// Server-function API surface called by the client store and pages. Each handler
// runs server-side only; the TanStack Start plugin strips these bodies (and their
// server-only imports) from the client bundle, replacing calls with RPC.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getEstateState } from "./server/state";
import { getPublicStatement } from "./server/public";
import { getReports } from "./server/reports";
import { requireEstateId, getCurrentUser } from "./server/session";
import { ingestInboundPayment } from "./server/ingest";
import { resolveException, type ResolveAction } from "./server/exceptions";
import { payVendor, addVendor } from "./server/payouts";
import { createBillingRun, createLevy } from "./server/billing";
import { provisionUnits } from "./server/provisioning";
import { updateEstateDetails, updateFeeStructure } from "./server/estate";
import { signup, login, logout } from "./server/auth";
import { resetDemo, seedDemoEstate } from "./server/seed-data";
import { prisma } from "./server/db";
import { nairaToKobo } from "./money";
import { randomUUID } from "node:crypto";

// ---------- reads ----------
export const fetchEstateState = createServerFn({ method: "GET" }).handler(async () => {
  const estateId = await requireEstateId();
  return getEstateState(estateId);
});

export const fetchReports = createServerFn({ method: "GET" }).handler(async () => {
  const estateId = await requireEstateId();
  return getReports(estateId);
});

export const fetchCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const unitCount = await prisma.unit.count({ where: { estateId: user.estateId } });
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    estateId: user.estateId,
    estateName: user.estate.name,
    onboarded: unitCount > 0,
  };
});

export const fetchPublicStatement = createServerFn({ method: "GET" })
  .validator((d: unknown) => z.object({ token: z.string() }).parse(d))
  .handler(async ({ data }) => getPublicStatement(data.token));

// ---------- payments ----------
export const simulatePayment = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ unitLabel: z.string().trim(), amountNaira: z.number().positive() }).parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    const unit = data.unitLabel
      ? await prisma.unit.findFirst({
          where: { estateId, label: { equals: data.unitLabel, mode: "insensitive" } },
          include: { virtualAccount: true },
        })
      : null;
    return ingestInboundPayment({
      nombaTxnRef: `sim-${randomUUID()}`,
      accountRef: unit?.virtualAccount?.nombaAccountRef ?? null,
      amountKobo: nairaToKobo(data.amountNaira),
      sourceName: unit?.occupantName ?? "Unknown sender",
      receivedAt: Date.now(),
      estateIdHint: estateId,
      rawPayload: { channel: "simulate", unitLabel: data.unitLabel },
    });
  });

export const recordManualPayment = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ unitId: z.string(), amountNaira: z.number().positive(), sender: z.string().optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    const unit = await prisma.unit.findFirstOrThrow({
      where: { id: data.unitId, estateId },
      include: { virtualAccount: true },
    });
    return ingestInboundPayment({
      nombaTxnRef: `manual-${randomUUID()}`,
      accountRef: unit.virtualAccount?.nombaAccountRef ?? null,
      amountKobo: nairaToKobo(data.amountNaira),
      sourceName: data.sender || unit.occupantName,
      receivedAt: Date.now(),
      status: "MANUAL",
      estateIdHint: estateId,
      rawPayload: { channel: "manual" },
    });
  });

// ---------- exceptions ----------
export const resolveExceptionFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        exceptionId: z.string(),
        action: z.enum(["credit", "refund", "duplicate-hold", "duplicate-keep", "reassign", "attribute"]),
        targetUnitId: z.string().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    await requireEstateId();
    return resolveException(data.exceptionId, data.action as ResolveAction, data.targetUnitId);
  });

// ---------- vendors / payouts ----------
export const payVendorFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ vendorId: z.string(), amountNaira: z.number().positive(), note: z.string() }).parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    return payVendor(estateId, data.vendorId, nairaToKobo(data.amountNaira), data.note);
  });

export const addVendorFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        name: z.string(),
        category: z.string(),
        bankName: z.string(),
        bankCode: z.string().optional(),
        accountNumber: z.string(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    return addVendor(estateId, data);
  });

// ---------- billing ----------
export const createBillingRunFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        cycleLabel: z.string(),
        chargeAmountNaira: z.number().positive(),
        dueDate: z.number(),
        unitIds: z.array(z.string()).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    return createBillingRun(estateId, {
      cycleLabel: data.cycleLabel,
      chargeAmountKobo: nairaToKobo(data.chargeAmountNaira),
      dueDate: data.dueDate,
      unitIds: data.unitIds,
    });
  });

export const createLevyFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        name: z.string(),
        amountNaira: z.number().positive(),
        dueDate: z.number(),
        requireExact: z.boolean().optional(),
        unitIds: z.array(z.string()).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    return createLevy(estateId, {
      name: data.name,
      amountKobo: nairaToKobo(data.amountNaira),
      dueDate: data.dueDate,
      requireExact: data.requireExact,
      unitIds: data.unitIds,
    });
  });

// ---------- onboarding / provisioning ----------
export const provisionUnitsFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        units: z.array(
          z.object({
            label: z.string(),
            block: z.string(),
            occupantName: z.string(),
            occupantPhone: z.string().optional(),
            occupancyType: z.enum(["OWNER", "TENANT"]).optional(),
          }),
        ),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    return provisionUnits(estateId, data.units);
  });

export const updateEstateFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ name: z.string().optional(), address: z.string().optional(), city: z.string().optional(), cycleLabel: z.string().optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    return updateEstateDetails(estateId, data);
  });

export const updateFeeStructureFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        serviceChargeNaira: z.number().optional(),
        serviceChargeCadence: z.string().optional(),
        allocationRule: z.enum(["OLDEST_FIRST", "DUES_FIRST"]).optional(),
        autoCreditThresholdNaira: z.number().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const estateId = await requireEstateId();
    return updateFeeStructure(estateId, {
      serviceChargeKobo: data.serviceChargeNaira != null ? nairaToKobo(data.serviceChargeNaira) : undefined,
      serviceChargeCadence: data.serviceChargeCadence,
      allocationRule: data.allocationRule,
      autoCreditThresholdKobo: data.autoCreditThresholdNaira != null ? nairaToKobo(data.autoCreditThresholdNaira) : undefined,
    });
  });

// ---------- auth ----------
export const signupFn = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ name: z.string(), email: z.string().email(), phone: z.string().optional(), password: z.string().min(6), estateName: z.string().optional() }).parse(d),
  )
  .handler(async ({ data }) => signup(data));

export const loginFn = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ email: z.string().email(), password: z.string() }).parse(d))
  .handler(async ({ data }) => login(data.email, data.password));

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  await logout();
  return { ok: true };
});

// ---------- demo ----------
export const resetDemoFn = createServerFn({ method: "POST" }).handler(async () => {
  const estateId = await requireEstateId();
  await resetDemo(estateId);
  return { ok: true };
});

export const seedDemoFn = createServerFn({ method: "POST" }).handler(async () => {
  const { estateId } = await seedDemoEstate();
  return { estateId };
});
