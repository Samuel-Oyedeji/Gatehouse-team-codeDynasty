// Billing runs and levies (PRD §5.2). A billing run creates one service-charge
// per selected unit; a levy creates a one-off charge per unit. Existing credit is
// applied immediately, then residents are notified.
import { prisma } from "./db";
import { consumeCreditForUnit } from "./apply";
import { notifier } from "./notifications";
import { formatNaira } from "../money";
import { broadcast } from "./events";

async function resolveUnitIds(estateId: string, unitIds?: string[]): Promise<string[]> {
  if (unitIds && unitIds.length) return unitIds;
  const units = await prisma.unit.findMany({ where: { estateId }, select: { id: true } });
  return units.map((u) => u.id);
}

export interface BillingRunInput {
  cycleLabel: string;
  chargeAmountKobo: number;
  dueDate: number; // epoch ms
  unitIds?: string[]; // omitted = all units
}

export async function createBillingRun(estateId: string, input: BillingRunInput) {
  const unitIds = await resolveUnitIds(estateId, input.unitIds);
  const dueDate = new Date(input.dueDate);

  const run = await prisma.billingRun.create({
    data: {
      estateId,
      cycleLabel: input.cycleLabel,
      chargeAmountKobo: input.chargeAmountKobo,
      unitScope: input.unitIds?.length ? { unitIds } : { all: true },
    },
  });

  const units = await prisma.unit.findMany({ where: { id: { in: unitIds } } });
  for (const unit of units) {
    await prisma.$transaction(async (tx) => {
      await tx.charge.create({
        data: {
          unitId: unit.id,
          sourceType: "SERVICE_CHARGE",
          billingRunId: run.id,
          description: `Service charge — ${input.cycleLabel}`,
          cycleLabel: input.cycleLabel,
          originalAmountKobo: input.chargeAmountKobo,
          outstandingKobo: input.chargeAmountKobo,
          dueDate,
          status: "OPEN",
        },
      });
      await consumeCreditForUnit(tx, unit.id);
    });
    void notifier.billIssued(
      { name: unit.occupantName, phone: unit.occupantPhone ?? undefined },
      { unitLabel: unit.label, amountKobo: input.chargeAmountKobo, dueDate: input.dueDate },
    );
  }

  await prisma.estate.update({ where: { id: estateId }, data: { cycleLabel: input.cycleLabel } });
  await prisma.activity.create({
    data: { estateId, message: `Billing run ${input.cycleLabel} — ${units.length} units billed ${formatNaira(input.chargeAmountKobo)}` },
  });
  broadcast(estateId, "billing");
  return { billingRunId: run.id, unitsBilled: units.length };
}

export interface LevyInput {
  name: string;
  amountKobo: number;
  dueDate: number;
  requireExact?: boolean;
  unitIds?: string[];
}

export async function createLevy(estateId: string, input: LevyInput) {
  const unitIds = await resolveUnitIds(estateId, input.unitIds);
  const dueDate = new Date(input.dueDate);

  const levy = await prisma.levy.create({
    data: {
      estateId,
      name: input.name,
      amountKobo: input.amountKobo,
      dueDate,
      requireExact: input.requireExact ?? false,
      unitScope: input.unitIds?.length ? { unitIds } : { all: true },
    },
  });

  const units = await prisma.unit.findMany({ where: { id: { in: unitIds } } });
  for (const unit of units) {
    await prisma.$transaction(async (tx) => {
      await tx.charge.create({
        data: {
          unitId: unit.id,
          sourceType: "LEVY",
          levyId: levy.id,
          description: input.name,
          cycleLabel: input.name,
          originalAmountKobo: input.amountKobo,
          outstandingKobo: input.amountKobo,
          dueDate,
          status: "OPEN",
        },
      });
      await consumeCreditForUnit(tx, unit.id);
    });
    void notifier.billIssued(
      { name: unit.occupantName, phone: unit.occupantPhone ?? undefined },
      { unitLabel: unit.label, amountKobo: input.amountKobo, dueDate: input.dueDate },
    );
  }

  await prisma.activity.create({
    data: { estateId, message: `Levy "${input.name}" — ${units.length} units billed ${formatNaira(input.amountKobo)}` },
  });
  broadcast(estateId, "billing");
  // Note: `requireExact` is stored and surfaced in the UI; exactness is enforced in
  // reconciliation logic rather than by pinning the unit account's expectedAmount,
  // since a unit's single account also collects recurring dues (which allow partials).
  return { levyId: levy.id, unitsBilled: units.length };
}
