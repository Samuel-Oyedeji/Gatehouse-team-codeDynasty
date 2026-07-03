// The single inbound-payment ingestion path. Both the Nomba webhook and the
// Simulate/manual controls funnel a normalised payment through here:
// dedupe on the Nomba reference → run the reconciliation engine → persist
// atomically → broadcast for real-time UI. Idempotent (PRD §5.3, §6.5).
import type { Prisma, PaymentStatus, ExceptionType } from "@prisma/client";
import { prisma } from "./db";
import { reconcile, type ReconResult } from "../reconciliation";
import { estateIdFromAccountRef } from "./domain-helpers";
import { applyReconEffects } from "./apply";
import { formatNaira } from "../money";
import { broadcast } from "./events";

export interface InboundPayment {
  nombaTxnRef: string;
  accountRef?: string | null;
  accountNumber?: string | null;
  amountKobo: number;
  sourceName: string;
  sourceAccount?: string | null;
  receivedAt: number; // epoch ms
  rawPayload?: unknown;
  status?: PaymentStatus; // e.g. MANUAL for cash entries
  estateIdHint?: string;
}

export interface IngestResult {
  deduped: boolean;
  paymentId: string;
  status: PaymentStatus;
  exceptionType?: ExceptionType;
}

export async function ingestInboundPayment(input: InboundPayment): Promise<IngestResult> {
  // 1. Idempotency — a re-delivered webhook must never double-credit.
  const existing = await prisma.payment.findUnique({ where: { nombaTxnRef: input.nombaTxnRef } });
  if (existing) {
    return { deduped: true, paymentId: existing.id, status: existing.status };
  }

  // 2. Resolve the receiving virtual account → unit.
  const va = input.accountRef
    ? await prisma.virtualAccount.findUnique({ where: { nombaAccountRef: input.accountRef }, include: { unit: true } })
    : input.accountNumber
      ? await prisma.virtualAccount.findFirst({ where: { accountNumber: input.accountNumber }, include: { unit: true } })
      : null;

  // 3. Resolve the estate (from the unit, the accountRef, or the single estate).
  let estateId =
    input.estateIdHint ??
    va?.unit.estateId ??
    (input.accountRef ? estateIdFromAccountRef(input.accountRef) : undefined);
  if (!estateId) estateId = (await prisma.estate.findFirst({ select: { id: true } }))?.id;
  if (!estateId) throw new Error("NO_ESTATE");

  const receivedAt = new Date(input.receivedAt);

  // 4a. Misdirected: no unit owns the account.
  if (!va) {
    const payment = await prisma.payment.create({
      data: {
        estateId,
        unitId: null,
        nombaTxnRef: input.nombaTxnRef,
        grossAmountKobo: input.amountKobo,
        sourceName: input.sourceName,
        sourceAccount: input.sourceAccount ?? null,
        receivedAt,
        status: "EXCEPTION",
        rawPayload: (input.rawPayload as Prisma.InputJsonValue) ?? undefined,
        exception: {
          create: {
            type: "MISDIRECTED",
            suggestion: "No unit matched the receiving account — reassign to the correct unit.",
          },
        },
      },
    });
    await prisma.activity.create({
      data: {
        estateId,
        message: `Unmatched payment of ${formatNaira(input.amountKobo)} from ${input.sourceName}`,
      },
    });
    broadcast(estateId, "payment");
    return { deduped: false, paymentId: payment.id, status: "EXCEPTION", exceptionType: "MISDIRECTED" };
  }

  // 4b. Matched unit — reconcile.
  const unit = va.unit;
  const estate = await prisma.estate.findUniqueOrThrow({ where: { id: unit.estateId } });
  const openCharges = await prisma.charge.findMany({
    where: { unitId: unit.id, status: { not: "SETTLED" } },
  });
  const windowStart = new Date(input.receivedAt - estate.duplicateWindowSecs * 1000);
  const priors = await prisma.payment.findMany({
    where: { unitId: unit.id, receivedAt: { gte: windowStart } },
  });

  const result = reconcile({
    payment: { amountKobo: input.amountKobo, receivedAt: input.receivedAt, sourceName: input.sourceName },
    charges: openCharges.map((c) => ({
      id: c.id,
      kind: c.sourceType,
      outstandingKobo: c.outstandingKobo,
      dueDate: c.dueDate.getTime(),
    })),
    creditBalanceKobo: unit.creditBalanceKobo,
    occupantName: unit.occupantName,
    rule: estate.allocationRule,
    autoCreditThresholdKobo: estate.autoCreditThresholdKobo,
    duplicateWindowSecs: estate.duplicateWindowSecs,
    priorPayments: priors.map((p) => ({
      amountKobo: p.grossAmountKobo,
      sourceName: p.sourceName,
      receivedAt: p.receivedAt.getTime(),
    })),
    unitMatched: true,
  });

  const paymentId = await persistReconciled({
    estateId: unit.estateId,
    unitId: unit.id,
    unitLabel: unit.label,
    block: unit.block,
    occupant: { name: unit.occupantName, phone: unit.occupantPhone ?? undefined },
    nombaTxnRef: input.nombaTxnRef,
    grossAmountKobo: input.amountKobo,
    sourceName: input.sourceName,
    sourceAccount: input.sourceAccount ?? null,
    receivedAt,
    rawPayload: input.rawPayload,
    baseStatus: input.status,
    result,
    charges: openCharges,
  });

  broadcast(unit.estateId, "payment");
  return {
    deduped: false,
    paymentId,
    status: mapStatus(result, input.status),
    exceptionType: result.exceptionType as ExceptionType | undefined,
  };
}

function mapStatus(result: ReconResult, base?: PaymentStatus): PaymentStatus {
  if (base === "MANUAL" && !result.isException) return "MANUAL";
  return result.status as PaymentStatus;
}

interface PersistParams {
  estateId: string;
  unitId: string;
  unitLabel: string;
  block: string;
  occupant: { name: string; phone?: string };
  nombaTxnRef: string;
  grossAmountKobo: number;
  sourceName: string;
  sourceAccount: string | null;
  receivedAt: Date;
  rawPayload?: unknown;
  baseStatus?: PaymentStatus;
  result: ReconResult;
  charges: { id: string; outstandingKobo: number; originalAmountKobo: number }[];
}

/** Persist a reconciled payment and all of its side effects atomically. */
async function persistReconciled(p: PersistParams): Promise<string> {
  const { result } = p;

  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        estateId: p.estateId,
        unitId: p.unitId,
        nombaTxnRef: p.nombaTxnRef,
        grossAmountKobo: p.grossAmountKobo,
        sourceName: p.sourceName,
        sourceAccount: p.sourceAccount,
        receivedAt: p.receivedAt,
        status: mapStatus(result, p.baseStatus),
        tag: result.tag ?? null,
        rawPayload: (p.rawPayload as Prisma.InputJsonValue) ?? undefined,
      },
    });

    await applyReconEffects(tx, {
      paymentId: payment.id,
      unitId: p.unitId,
      result,
      charges: p.charges,
    });

    if (result.isException && result.exceptionType) {
      await tx.exception.create({
        data: {
          paymentId: payment.id,
          type: result.exceptionType as ExceptionType,
          suggestion: result.suggestion ?? "Needs review",
        },
      });
    }

    await tx.activity.create({
      data: { estateId: p.estateId, unitId: p.unitId, message: activityMessage(p) },
    });

    return payment.id;
  });
}

function activityMessage(p: PersistParams): string {
  const amt = formatNaira(p.grossAmountKobo);
  const who = `${p.unitLabel}`;
  switch (p.result.status) {
    case "MATCHED":
      return `${who} paid ${amt}, dues settled`;
    case "PARTIAL":
      return `${who} paid ${amt}, balance still owing`;
    case "OVERPAYMENT":
      return `${who} paid ${amt}, ${formatNaira(p.result.creditAddedKobo)} moved to credit`;
    default:
      return `${who} paid ${amt}, needs review`;
  }
}
