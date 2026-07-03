// Resident public statement (PRD §5.6). Resolves a resident-link token (or a unit
// id, so the manager's "copy resident link" using /r/{unitId} also works) to a
// single unit's statement plus the estate transparency summary. No auth.
import { prisma } from "./db";
import { getEstateState } from "./state";
import type { Unit } from "../types";

export interface PublicStatement {
  estate: { name: string; city: string };
  unit: Unit;
  accountNumber: string;
  bankName: string;
  transparency: {
    collected: number;
    spent: number;
    balance: number;
    byCategory: { category: string; amount: number }[];
  };
}

export async function getPublicStatement(tokenOrUnitId: string): Promise<PublicStatement | null> {
  const link = await prisma.residentLink.findUnique({ where: { token: tokenOrUnitId }, include: { unit: true } });
  const unitRow = link?.unit ?? (await prisma.unit.findUnique({ where: { id: tokenOrUnitId } }));
  if (!unitRow) return null;

  if (link) {
    await prisma.residentLink.update({ where: { id: link.id }, data: { lastViewedAt: new Date() } });
  }

  const state = await getEstateState(unitRow.estateId);
  const unit = state.units.find((u) => u.id === unitRow.id);
  if (!unit) return null;

  const spent = state.payouts
    .filter((p) => p.status !== "failed")
    .reduce((a, p) => a + p.amount, 0);
  const collected = state.units.reduce(
    (a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0),
    0,
  );
  const categoryByVendor = new Map(state.vendors.map((v) => [v.id, v.category]));
  const byCategoryMap = new Map<string, number>();
  for (const p of state.payouts) {
    if (p.status === "failed") continue;
    const cat = categoryByVendor.get(p.vendorId) ?? "Other";
    byCategoryMap.set(cat, (byCategoryMap.get(cat) ?? 0) + p.amount);
  }

  const va = await prisma.virtualAccount.findUnique({ where: { unitId: unitRow.id } });

  return {
    estate: { name: state.estate.name, city: state.estate.city },
    unit,
    accountNumber: va?.accountNumber ?? unit.accountNumber,
    bankName: va?.bankName ?? "",
    transparency: {
      collected,
      spent,
      balance: collected - spent,
      byCategory: [...byCategoryMap.entries()].map(([category, amount]) => ({ category, amount })),
    },
  };
}
