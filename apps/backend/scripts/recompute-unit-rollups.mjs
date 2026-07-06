// One-off fix: recomputes balanceKobo, creditBalanceKobo, and status for every
// unit from the source-of-truth charge/credit rows.
//
// Background: consumeCreditForUnit had an early return when creditBalanceKobo=0,
// skipping recomputeUnitRollups after new charge creation. Units that received a
// service charge while already at zero credit were left with stale status/balance.
//
// Run: node scripts/recompute-unit-rollups.mjs
// Requires DATABASE_URL in env (or .env in repo root).
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function deriveUnitStatus(balanceKobo, creditKobo, totalOriginalKobo) {
  if (totalOriginalKobo <= 0) return creditKobo > 0 ? 'CREDIT' : 'UNBILLED';
  if (balanceKobo <= 0) return creditKobo > 0 ? 'CREDIT' : 'PAID';
  if (balanceKobo >= totalOriginalKobo) return 'OVERDUE';
  return 'PARTIAL';
}

async function main() {
  const units = await prisma.unit.findMany({
    where: { deletedAt: null },
    select: { id: true, unitName: true, status: true, balanceKobo: true },
  });

  console.log(`Recomputing rollups for ${units.length} units…\n`);

  let changed = 0;
  for (const unit of units) {
    const [chargeAgg, creditAgg] = await Promise.all([
      prisma.charge.aggregate({
        where: { unitId: unit.id },
        _sum: { outstandingKobo: true, originalAmountKobo: true },
      }),
      prisma.creditEntry.aggregate({
        where: { unitId: unit.id },
        _sum: { amountKobo: true },
      }),
    ]);

    const balanceKobo = chargeAgg._sum.outstandingKobo ?? 0;
    const totalOriginal = chargeAgg._sum.originalAmountKobo ?? 0;
    const creditKobo = creditAgg._sum.amountKobo ?? 0;
    const status = deriveUnitStatus(balanceKobo, creditKobo, totalOriginal);

    const balanceChanged = unit.balanceKobo !== balanceKobo;
    const statusChanged = unit.status !== status;

    if (balanceChanged || statusChanged) {
      await prisma.unit.update({
        where: { id: unit.id },
        data: { balanceKobo, creditBalanceKobo: creditKobo, status },
      });
      console.log(`  [FIXED] ${unit.unitName}: status ${unit.status} → ${status}, balance ${unit.balanceKobo} → ${balanceKobo} kobo`);
      changed++;
    }
  }

  console.log(`\nDone. ${changed}/${units.length} units updated.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
