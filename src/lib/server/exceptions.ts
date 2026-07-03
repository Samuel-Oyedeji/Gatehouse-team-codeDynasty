// Exception resolution (PRD §5.4, §6.4). Each type resolves to the right
// allocations/credit entries and clears the open exception (decrementing the
// unmatched counter). Reuses the reconciliation engine with forceApply so a
// confirmed/attributed payment allocates exactly like a fresh one.
import type { Prisma, PaymentStatus } from "@prisma/client";
import { prisma } from "./db";
import { reconcile } from "../reconciliation";
import { applyReconEffects, recomputeUnitRollups } from "./apply";
import { formatNaira } from "../money";
import { broadcast } from "./events";

export type ResolveAction =
  | "credit"
  | "refund"
  | "duplicate-hold"
  | "duplicate-keep"
  | "reassign"
  | "attribute";

export interface ResolveResult {
  ok: boolean;
  message: string;
}

export async function resolveException(
  exceptionId: string,
  action: ResolveAction,
  targetUnitId?: string,
): Promise<ResolveResult> {
  const exception = await prisma.exception.findUnique({
    where: { id: exceptionId },
    include: { payment: true },
  });
  if (!exception || exception.status === "RESOLVED") return { ok: false, message: "Exception not found or already resolved" };
  const payment = exception.payment;
  const estateId = payment.estateId;

  let message = "Resolved";

  await prisma.$transaction(async (tx) => {
    switch (exception.type) {
      case "OVERPAYMENT": {
        // Charges were already settled at ingest; only the surplus was held.
        const allocated = await tx.allocation.aggregate({
          where: { paymentId: payment.id },
          _sum: { amountKobo: true },
        });
        const surplus = payment.grossAmountKobo - (allocated._sum.amountKobo ?? 0);
        if (action === "credit" && payment.unitId && surplus > 0) {
          await tx.creditEntry.create({
            data: { unitId: payment.unitId, amountKobo: surplus, reason: "Overpayment moved to credit" },
          });
          await recomputeUnitRollups(tx, payment.unitId);
          await tx.payment.update({ where: { id: payment.id }, data: { status: "OVERPAYMENT" } });
          message = `${formatNaira(surplus)} surplus moved to credit`;
        } else {
          await tx.payment.update({ where: { id: payment.id }, data: { status: "OVERPAYMENT" } });
          message = `${formatNaira(surplus)} flagged for refund`;
        }
        break;
      }
      case "DUPLICATE": {
        if (action === "duplicate-keep" && payment.unitId) {
          await applyPaymentToUnit(tx, payment.id, payment.unitId, payment.grossAmountKobo, payment.sourceName);
          message = "Treated as a separate payment";
        } else {
          // Confirmed duplicate — leave unapplied so it is never double-counted.
          message = "Confirmed duplicate, held";
        }
        break;
      }
      case "MISDIRECTED": {
        const dest = targetUnitId ?? exception.candidateUnitId ?? undefined;
        if (!dest) throw new Error("NO_TARGET_UNIT");
        await tx.payment.update({ where: { id: payment.id }, data: { unitId: dest } });
        await applyPaymentToUnit(tx, payment.id, dest, payment.grossAmountKobo, payment.sourceName);
        message = "Reassigned to the correct unit";
        break;
      }
      case "THIRD_PARTY": {
        if (payment.unitId) {
          await applyPaymentToUnit(tx, payment.id, payment.unitId, payment.grossAmountKobo, payment.sourceName, "Paid on behalf");
          message = "Attributed and tagged as paid on behalf";
        }
        break;
      }
    }

    await tx.exception.update({
      where: { id: exception.id },
      data: { status: "RESOLVED", resolvedAt: new Date(), resolutionNote: message },
    });
    await tx.activity.create({
      data: { estateId, unitId: payment.unitId, message: `Exception resolved: ${message}` },
    });
  });

  broadcast(estateId, "exception");
  return { ok: true, message };
}

/** Apply a held payment to a unit via the engine (forceApply skips dup/third-party checks). */
async function applyPaymentToUnit(
  tx: Prisma.TransactionClient,
  paymentId: string,
  unitId: string,
  amountKobo: number,
  sourceName: string,
  tag?: string,
): Promise<void> {
  const unit = await tx.unit.findUniqueOrThrow({ where: { id: unitId } });
  const estate = await tx.estate.findUniqueOrThrow({ where: { id: unit.estateId } });
  const openCharges = await tx.charge.findMany({ where: { unitId, status: { not: "SETTLED" } } });

  const result = reconcile({
    payment: { amountKobo, receivedAt: Date.now(), sourceName },
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
    priorPayments: [],
    unitMatched: true,
    forceApply: true,
  });

  await applyReconEffects(tx, {
    paymentId,
    unitId,
    result,
    charges: openCharges.map((c) => ({
      id: c.id,
      outstandingKobo: c.outstandingKobo,
      originalAmountKobo: c.originalAmountKobo,
    })),
  });

  await tx.payment.update({
    where: { id: paymentId },
    data: { status: result.status as PaymentStatus, tag: tag ?? null },
  });
}
