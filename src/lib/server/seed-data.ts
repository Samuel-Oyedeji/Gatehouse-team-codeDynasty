// Demo seed (PRD §13). Creates Maple Court and drives its status mix through the
// REAL reconciliation/ingest path so seeded data is engine-consistent. Reused by
// prisma/seed.ts (CLI) and the in-app "reset demo" control.
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { ingestInboundPayment } from "./ingest";
import { createBillingRun } from "./billing";
import { accountRefFor } from "./domain-helpers";

const DEMO_EMAIL = "treasurer@maplecourt.ng";
const DEMO_PASSWORD = "password";

const FIRST = ["Adaeze", "Chinedu", "Tunde", "Aisha", "Femi", "Yetunde", "Ifeanyi", "Bukola", "Obinna", "Hauwa", "Segun", "Ngozi", "Kelechi", "Funke", "Emeka", "Zainab", "Olumide", "Chiamaka", "Babatunde", "Folake", "Uche", "Halima", "Tobi", "Ibrahim", "Damilola", "Nneka", "Kunle", "Maryam", "Chukwudi", "Wale"];
const LAST = ["Okafor", "Adeyemi", "Okonkwo", "Bello", "Eze", "Mohammed", "Abiola", "Ogundimu", "Nwosu", "Lawal", "Olaniyi", "Aliyu", "Onyema", "Adebayo", "Ibe", "Yusuf", "Balogun", "Chukwu", "Ojo", "Obi"];

let seed = 7;
function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
function pick<T>(a: T[]): T { return a[Math.floor(rand() * a.length)]; }
function nuban() { let s = ""; for (let i = 0; i < 10; i++) s += Math.floor(rand() * 10); return s; }

const SERVICE_KOBO = 4_500_000; // ₦45,000
const now = Date.now();
const day = 86_400_000;

export async function seedDemoEstate(): Promise<{ estateId: string; userId: string }> {
  seed = 7;
  const existing = await prisma.user.findUnique({ where: { email: DEMO_EMAIL } });
  if (existing) {
    await resetDemo(existing.estateId);
    return { estateId: existing.estateId, userId: existing.id };
  }

  const estate = await prisma.estate.create({
    data: {
      name: "Maple Court",
      address: "Plot 14 Admiralty Way",
      city: "Lekki, Lagos",
      cycleLabel: "Q3 2026",
      allocationRule: "OLDEST_FIRST",
      serviceChargeKobo: SERVICE_KOBO,
      serviceChargeCadence: "quarterly",
      autoCreditThresholdKobo: 500_000, // ₦5,000 — larger surplus raises an exception
      duplicateWindowSecs: 900,
    },
  });
  const user = await prisma.user.create({
    data: {
      estateId: estate.id,
      name: "Bayo Okonkwo",
      email: DEMO_EMAIL,
      phone: "+234 803 111 2222",
      role: "treasurer",
      passwordHash: await bcrypt.hash(DEMO_PASSWORD, 10),
    },
  });
  await populateDemoData(estate.id);
  return { estateId: estate.id, userId: user.id };
}

export async function resetDemo(estateId: string): Promise<void> {
  seed = 7;
  await wipeEstateData(estateId);
  await prisma.estate.update({
    where: { id: estateId },
    data: {
      name: "Maple Court",
      address: "Plot 14 Admiralty Way",
      city: "Lekki, Lagos",
      cycleLabel: "Q3 2026",
      allocationRule: "OLDEST_FIRST",
      serviceChargeKobo: SERVICE_KOBO,
      autoCreditThresholdKobo: 500_000,
      duplicateWindowSecs: 900,
    },
  });
  await populateDemoData(estateId);
}

async function populateDemoData(estateId: string) {
  // 1. Units + virtual accounts + resident links (written directly to keep seeding fast/offline).
  const blocks = ["A", "B", "C", "D"];
  const unitIds: string[] = [];
  for (const block of blocks) {
    for (let i = 1; i <= 15; i++) {
      const unit = await prisma.unit.create({
        data: {
          estateId,
          label: `${block}${i}`,
          block,
          occupantName: `${pick(FIRST)} ${pick(LAST)}`,
          occupantPhone: `+234 80${Math.floor(10000000 + rand() * 89999999)}`,
          occupancyType: rand() < 0.6 ? "OWNER" : "TENANT",
          status: "UNBILLED",
        },
      });
      unitIds.push(unit.id);
      await prisma.virtualAccount.create({
        data: {
          unitId: unit.id,
          nombaAccountRef: accountRefFor(estateId, unit.id),
          accountNumber: nuban(),
          bankName: "Nomba MFB",
          status: "ACTIVE",
          provisionedAt: new Date(now - 40 * day),
        },
      });
      await prisma.residentLink.create({ data: { unitId: unit.id, token: randomBytes(16).toString("hex") } });
    }
  }

  // 2. Bill the cycle — one service charge per unit (real service).
  await createBillingRun(estateId, {
    cycleLabel: "Q3 2026",
    chargeAmountKobo: SERVICE_KOBO,
    dueDate: now + 5 * day,
    unitIds,
  });

  const units = await prisma.unit.findMany({
    where: { estateId },
    include: { virtualAccount: true },
    orderBy: [{ block: "asc" }, { label: "asc" }],
  });

  // Reserve the last four units for explicit exceptions.
  const exceptionUnits = units.slice(-4);
  const normalUnits = units.slice(0, -4);

  // 3. Drive a believable status mix through the real ingest path.
  let n = 0;
  for (const u of normalUnits) {
    const ref = u.virtualAccount!.nombaAccountRef;
    const r = rand();
    const at = now - Math.floor(rand() * 25) * day;
    if (r < 0.62) {
      await pay(ref, SERVICE_KOBO, u.occupantName, at); // paid in full
    } else if (r < 0.8) {
      const amt = (Math.floor(15 + rand() * 20)) * 100_000; // ₦15k–₦35k partial
      await pay(ref, amt, u.occupantName, at);
    } else if (r < 0.9) {
      // leave unpaid
    } else {
      await pay(ref, SERVICE_KOBO + 200_000, u.occupantName, at); // small overpay → credit
    }
    n++;
  }

  // 4. Explicit exceptions (PRD §13: 3–4 pre-seeded).
  const [exOver, exDup, exThird, exMis] = exceptionUnits;
  // overpayment beyond threshold
  await pay(exOver.virtualAccount!.nombaAccountRef, SERVICE_KOBO + 1_000_000, exOver.occupantName, now - 30 * 60_000);
  // duplicate: settle, then a second identical transfer within the window
  await pay(exDup.virtualAccount!.nombaAccountRef, SERVICE_KOBO, exDup.occupantName, now - 20 * 60_000);
  await pay(exDup.virtualAccount!.nombaAccountRef, SERVICE_KOBO, exDup.occupantName, now - 12 * 60_000);
  // third-party sender
  await pay(exThird.virtualAccount!.nombaAccountRef, SERVICE_KOBO, "Stephen Adewale (father)", now - 8 * 60_000);
  // misdirected: no matching account
  await ingestInboundPayment({
    nombaTxnRef: `seed-mis-${randomBytes(6).toString("hex")}`,
    accountRef: null,
    amountKobo: SERVICE_KOBO,
    sourceName: "Chinedu Okafor",
    receivedAt: now - 6 * 60_000,
    estateIdHint: estateId,
  });
  void exMis;

  // 5. Vendors + payout history (written directly to avoid live transfers during seed).
  const vendors = await Promise.all([
    prisma.vendor.create({ data: { estateId, name: "Sentinel Security Ltd", category: "Security", bankName: "GTBank", bankCode: "058", accountNumber: nuban() } }),
    prisma.vendor.create({ data: { estateId, name: "CleanCity Waste", category: "Waste management", bankName: "Access", bankCode: "044", accountNumber: nuban() } }),
    prisma.vendor.create({ data: { estateId, name: "Power & Diesel Co.", category: "Diesel", bankName: "Zenith", bankCode: "057", accountNumber: nuban() } }),
    prisma.vendor.create({ data: { estateId, name: "FixIt Estate Repairs", category: "Repairs", bankName: "UBA", bankCode: "033", accountNumber: nuban() } }),
  ]);
  const payouts: { vendorId: string; amountKobo: number; note: string; ago: number }[] = [
    { vendorId: vendors[0].id, amountKobo: 42_500_000, note: "July security", ago: 28 },
    { vendorId: vendors[0].id, amountKobo: 42_500_000, note: "August security", ago: 5 },
    { vendorId: vendors[1].id, amountKobo: 16_000_000, note: "July waste", ago: 25 },
    { vendorId: vendors[1].id, amountKobo: 16_000_000, note: "August waste", ago: 3 },
    { vendorId: vendors[2].id, amountKobo: 32_000_000, note: "Diesel — July refill", ago: 18 },
    { vendorId: vendors[2].id, amountKobo: 22_000_000, note: "Diesel — August refill", ago: 2 },
    { vendorId: vendors[3].id, amountKobo: 19_000_000, note: "Gatehouse roof repair", ago: 12 },
  ];
  for (const p of payouts) {
    await prisma.payout.create({
      data: {
        estateId,
        vendorId: p.vendorId,
        amountKobo: p.amountKobo,
        note: p.note,
        merchantTxRef: `seed-payout-${randomBytes(6).toString("hex")}`,
        status: "SUCCESS",
        createdAt: new Date(now - p.ago * day),
      },
    });
  }
}

function pay(accountRef: string, amountKobo: number, sourceName: string, receivedAt: number) {
  return ingestInboundPayment({
    nombaTxnRef: `seed-${randomBytes(8).toString("hex")}`,
    accountRef,
    amountKobo,
    sourceName,
    receivedAt,
  });
}

async function wipeEstateData(estateId: string) {
  await prisma.allocation.deleteMany({ where: { payment: { estateId } } });
  await prisma.exception.deleteMany({ where: { payment: { estateId } } });
  await prisma.payment.deleteMany({ where: { estateId } });
  await prisma.creditEntry.deleteMany({ where: { unit: { estateId } } });
  await prisma.charge.deleteMany({ where: { unit: { estateId } } });
  await prisma.residentLink.deleteMany({ where: { unit: { estateId } } });
  await prisma.virtualAccount.deleteMany({ where: { unit: { estateId } } });
  await prisma.payout.deleteMany({ where: { estateId } });
  await prisma.vendor.deleteMany({ where: { estateId } });
  await prisma.billingRun.deleteMany({ where: { estateId } });
  await prisma.levy.deleteMany({ where: { estateId } });
  await prisma.activity.deleteMany({ where: { estateId } });
  await prisma.unit.deleteMany({ where: { estateId } });
}
