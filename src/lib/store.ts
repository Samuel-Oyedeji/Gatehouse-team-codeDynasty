import { useSyncExternalStore } from "react";

export type UnitStatus = "paid" | "partial" | "overdue" | "unbilled" | "credit";
export type PaymentStatus = "matched" | "partial" | "overpayment" | "exception";
export type ExceptionType = "overpayment" | "duplicate" | "misdirected" | "third_party";

export interface Unit {
  id: string;
  label: string; // "A1"
  block: string; // "A"
  occupant: string;
  phone: string;
  accountNumber: string; // 10 digits
  occupantType: "owner" | "tenant";
  balance: number; // amount still owed (>=0)
  credit: number; // unused credit
  status: UnitStatus;
  lastPaymentAt?: number;
  charges: Charge[];
  ledger: LedgerEntry[];
}

export interface Charge {
  id: string;
  description: string;
  amount: number;
  paid: number;
  createdAt: number;
  dueAt: number;
  cycle: string;
  kind: "service" | "levy";
}

export interface LedgerEntry {
  id: string;
  date: number;
  description: string;
  kind: "charge" | "payment" | "credit";
  amount: number; // + charge, - payment
  running: number;
  allocation?: string;
}

export interface Payment {
  id: string;
  unitId: string | null;
  amount: number;
  timestamp: number;
  sender: string;
  status: PaymentStatus;
  allocation: string;
  exceptionType?: ExceptionType;
}

export interface ExceptionItem {
  id: string;
  paymentId: string;
  type: ExceptionType;
  suggestion: string;
  candidateUnitId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  bank: string;
  account: string;
  totalPaid: number;
}

export interface Payout {
  id: string;
  vendorId: string;
  amount: number;
  note: string;
  date: number;
}

export interface ActivityItem {
  id: string;
  timestamp: number;
  message: string;
  unitId?: string;
}

export interface State {
  estate: { name: string; address: string; city: string };
  cycle: string;
  units: Unit[];
  payments: Payment[];
  exceptions: ExceptionItem[];
  vendors: Vendor[];
  payouts: Payout[];
  activity: ActivityItem[];
  recentlyChanged: Record<string, number>; // unitId -> timestamp for flash
}

// ---------- Seed data ----------
const FIRST_NAMES = [
  "Adaeze", "Chinedu", "Tunde", "Aisha", "Femi", "Yetunde", "Ifeanyi", "Bukola",
  "Obinna", "Hauwa", "Segun", "Ngozi", "Kelechi", "Funke", "Emeka", "Zainab",
  "Olumide", "Chiamaka", "Babatunde", "Folake", "Uche", "Halima", "Tobi", "Ibrahim",
  "Damilola", "Nneka", "Kunle", "Maryam", "Chukwudi", "Wale",
];
const LAST_NAMES = [
  "Okafor", "Adeyemi", "Okonkwo", "Bello", "Eze", "Mohammed", "Abiola", "Ogundimu",
  "Nwosu", "Lawal", "Olaniyi", "Aliyu", "Onyema", "Adebayo", "Ibe", "Yusuf",
  "Balogun", "Chukwu", "Ojo", "Obi",
];

let _seed = 7;
function rand() { _seed = (_seed * 9301 + 49297) % 233280; return _seed / 233280; }
function pick<T>(arr: T[]): T { return arr[Math.floor(rand() * arr.length)]; }
function nuban(): string {
  let s = "";
  for (let i = 0; i < 10; i++) s += Math.floor(rand() * 10);
  return s;
}
function id(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

const SERVICE_CHARGE = 45000;
const LEVY_AMOUNT = 10000;
const CYCLE = "Q3 2026";

function buildSeed(): State {
  const units: Unit[] = [];
  const blocks = ["A", "B", "C", "D"];
  blocks.forEach((blk) => {
    for (let i = 1; i <= 15; i++) {
      const occupant = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
      const r = rand();
      let status: UnitStatus = "paid";
      let balance = 0;
      let credit = 0;
      if (r < 0.65) { status = "paid"; balance = 0; }
      else if (r < 0.85) { status = "partial"; balance = Math.floor(5000 + rand() * 35000 / 1000) * 1000; }
      else if (r < 0.95) { status = "overdue"; balance = SERVICE_CHARGE; }
      else { status = "credit"; balance = 0; credit = Math.floor(5000 + rand() * 15000 / 1000) * 1000; }

      const total = SERVICE_CHARGE;
      const paid = total - balance;
      const charges: Charge[] = [
        {
          id: id("chg"),
          description: `Service charge — ${CYCLE}`,
          amount: SERVICE_CHARGE,
          paid: Math.max(0, Math.min(SERVICE_CHARGE, paid)),
          createdAt: Date.now() - 30 * 86400_000,
          dueAt: Date.now() + 5 * 86400_000,
          cycle: CYCLE,
          kind: "service",
        },
      ];
      const ledger: LedgerEntry[] = [
        {
          id: id("le"),
          date: Date.now() - 30 * 86400_000,
          description: `Service charge — ${CYCLE}`,
          kind: "charge",
          amount: SERVICE_CHARGE,
          running: SERVICE_CHARGE,
          allocation: undefined,
        },
      ];
      if (paid > 0) {
        ledger.push({
          id: id("le"),
          date: Date.now() - Math.floor(rand() * 20) * 86400_000,
          description: "Transfer received",
          kind: "payment",
          amount: -paid,
          running: SERVICE_CHARGE - paid,
          allocation: `Applied to ${CYCLE} service charge`,
        });
      }
      if (credit > 0) {
        ledger.push({
          id: id("le"),
          date: Date.now() - 2 * 86400_000,
          description: "Overpayment — credit",
          kind: "credit",
          amount: -credit,
          running: -credit,
          allocation: "Held as credit balance",
        });
      }

      units.push({
        id: id("u"),
        label: `${blk}${i}`,
        block: blk,
        occupant,
        phone: `+234 80${Math.floor(10000000 + rand() * 89999999)}`,
        accountNumber: nuban(),
        occupantType: rand() < 0.6 ? "owner" : "tenant",
        balance,
        credit,
        status,
        lastPaymentAt: paid > 0 ? Date.now() - Math.floor(rand() * 20) * 86400_000 : undefined,
        charges,
        ledger,
      });
    }
  });

  const vendors: Vendor[] = [
    { id: id("v"), name: "Sentinel Security Ltd", category: "Security", bank: "GTBank", account: nuban(), totalPaid: 850000 },
    { id: id("v"), name: "CleanCity Waste", category: "Waste management", bank: "Access", account: nuban(), totalPaid: 320000 },
    { id: id("v"), name: "Power & Diesel Co.", category: "Diesel", bank: "Zenith", account: nuban(), totalPaid: 540000 },
    { id: id("v"), name: "FixIt Estate Repairs", category: "Repairs", bank: "UBA", account: nuban(), totalPaid: 190000 },
  ];

  const payouts: Payout[] = [
    { id: id("po"), vendorId: vendors[0].id, amount: 425000, note: "July security", date: Date.now() - 28 * 86400_000 },
    { id: id("po"), vendorId: vendors[0].id, amount: 425000, note: "August security", date: Date.now() - 5 * 86400_000 },
    { id: id("po"), vendorId: vendors[1].id, amount: 160000, note: "July waste", date: Date.now() - 25 * 86400_000 },
    { id: id("po"), vendorId: vendors[1].id, amount: 160000, note: "August waste", date: Date.now() - 3 * 86400_000 },
    { id: id("po"), vendorId: vendors[2].id, amount: 320000, note: "Diesel — July refill", date: Date.now() - 18 * 86400_000 },
    { id: id("po"), vendorId: vendors[2].id, amount: 220000, note: "Diesel — August refill", date: Date.now() - 2 * 86400_000 },
    { id: id("po"), vendorId: vendors[3].id, amount: 190000, note: "Gatehouse roof repair", date: Date.now() - 12 * 86400_000 },
  ];

  // Seed payments (matched, just enough to populate the ledger)
  const payments: Payment[] = units
    .filter((u) => u.lastPaymentAt)
    .slice(0, 18)
    .map((u) => ({
      id: id("p"),
      unitId: u.id,
      amount: SERVICE_CHARGE - u.balance,
      timestamp: u.lastPaymentAt!,
      sender: u.occupant,
      status: u.balance === 0 ? "matched" : "partial",
      allocation: `${CYCLE} service charge`,
    }));

  // Seed exceptions
  const exU1 = units[3];
  const exU2 = units[8];
  const exU3 = units[20];
  const exPayments: Payment[] = [
    { id: id("p"), unitId: exU1.id, amount: 55000, timestamp: Date.now() - 1800_000, sender: exU1.occupant, status: "exception", allocation: "Overpayment by ₦10,000", exceptionType: "overpayment" },
    { id: id("p"), unitId: exU2.id, amount: 45000, timestamp: Date.now() - 2400_000, sender: exU2.occupant, status: "exception", allocation: "Possible duplicate", exceptionType: "duplicate" },
    { id: id("p"), unitId: null, amount: 45000, timestamp: Date.now() - 600_000, sender: "Chinedu Okafor", status: "exception", allocation: "Sender does not match any unit", exceptionType: "misdirected" },
    { id: id("p"), unitId: exU3.id, amount: 45000, timestamp: Date.now() - 300_000, sender: "Stephen Adewale (father)", status: "exception", allocation: "Third-party sender", exceptionType: "third_party" },
  ];
  payments.push(...exPayments);

  const exceptions: ExceptionItem[] = [
    { id: id("ex"), paymentId: exPayments[0].id, type: "overpayment", suggestion: "Move ₦10,000 surplus to credit balance" },
    { id: id("ex"), paymentId: exPayments[1].id, type: "duplicate", suggestion: "Same amount from same sender within 15 minutes" },
    { id: id("ex"), paymentId: exPayments[2].id, type: "misdirected", suggestion: "Reassign to the correct unit", candidateUnitId: units[2].id },
    { id: id("ex"), paymentId: exPayments[3].id, type: "third_party", suggestion: `Attribute to ${exU3.label} and tag as paid on behalf` },
  ];

  const activity: ActivityItem[] = payments
    .slice(-10)
    .reverse()
    .map((p) => {
      const u = units.find((x) => x.id === p.unitId);
      return {
        id: id("a"),
        timestamp: p.timestamp,
        unitId: p.unitId ?? undefined,
        message: u
          ? `Block ${u.block} Flat ${u.label.slice(1)} paid ₦${p.amount.toLocaleString("en-NG")}, ${p.status === "matched" ? "dues settled" : p.status === "exception" ? "needs review" : "balance remaining"}`
          : `Unmatched payment of ₦${p.amount.toLocaleString("en-NG")} from ${p.sender}`,
      };
    });

  return {
    estate: { name: "Maple Court", address: "Plot 14 Admiralty Way", city: "Lekki, Lagos" },
    cycle: CYCLE,
    units,
    payments,
    exceptions,
    vendors,
    payouts,
    activity,
    recentlyChanged: {},
  };
}

// ---------- Vanilla store ----------
let state: State = buildSeed();
const listeners = new Set<() => void>();

function set(updater: (s: State) => State) {
  state = updater(state);
  listeners.forEach((l) => l());
}

export const store = {
  get: () => state,
  subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; },
  reset: () => { state = buildSeed(); listeners.forEach((l) => l()); },

  recordPayment(unitLabel: string, amount: number) {
    const unit = state.units.find((u) => u.label.toLowerCase() === unitLabel.toLowerCase());
    if (!unit) {
      // unmatched
      const p: Payment = {
        id: id("p"),
        unitId: null,
        amount,
        timestamp: Date.now(),
        sender: "Unknown sender",
        status: "exception",
        allocation: "No unit matched the receiving account",
        exceptionType: "misdirected",
      };
      const ex: ExceptionItem = { id: id("ex"), paymentId: p.id, type: "misdirected", suggestion: "Pick the correct unit" };
      set((s) => ({
        ...s,
        payments: [p, ...s.payments],
        exceptions: [ex, ...s.exceptions],
        activity: [{ id: id("a"), timestamp: Date.now(), message: `Unmatched payment of ₦${amount.toLocaleString("en-NG")}` }, ...s.activity],
      }));
      return;
    }
    applyPaymentToUnit(unit.id, amount, unit.occupant);
  },

  resolveException(exId: string, action: "credit" | "refund" | "duplicate-hold" | "duplicate-keep" | "reassign" | "attribute", targetUnitId?: string) {
    const ex = state.exceptions.find((e) => e.id === exId);
    if (!ex) return;
    const payment = state.payments.find((p) => p.id === ex.paymentId);
    if (!payment) return;

    if (ex.type === "overpayment" && payment.unitId) {
      const unit = state.units.find((u) => u.id === payment.unitId)!;
      const owed = unit.balance;
      const surplus = payment.amount - owed;
      if (action === "credit") {
        applyPaymentToUnit(unit.id, payment.amount, payment.sender);
        // remove exception and update payment status
      } else {
        // refund — just settle owed portion
        applyPaymentToUnit(unit.id, owed, payment.sender);
      }
    } else if (ex.type === "duplicate" && payment.unitId) {
      if (action === "duplicate-keep") {
        applyPaymentToUnit(payment.unitId, payment.amount, payment.sender);
      }
      // else hold => do nothing
    } else if (ex.type === "misdirected") {
      const tid = targetUnitId ?? ex.candidateUnitId;
      if (tid) applyPaymentToUnit(tid, payment.amount, payment.sender);
    } else if (ex.type === "third_party" && payment.unitId) {
      applyPaymentToUnit(payment.unitId, payment.amount, payment.sender, "Paid on behalf");
    }

    set((s) => ({
      ...s,
      exceptions: s.exceptions.filter((e) => e.id !== exId),
      payments: s.payments.map((p) => p.id === payment.id ? { ...p, status: "matched" as PaymentStatus } : p),
    }));
  },

  payVendor(vendorId: string, amount: number, note: string) {
    set((s) => ({
      ...s,
      payouts: [{ id: id("po"), vendorId, amount, note, date: Date.now() }, ...s.payouts],
      vendors: s.vendors.map((v) => v.id === vendorId ? { ...v, totalPaid: v.totalPaid + amount } : v),
      activity: [{ id: id("a"), timestamp: Date.now(), message: `Paid ${s.vendors.find(v => v.id === vendorId)?.name} ₦${amount.toLocaleString("en-NG")} — ${note}` }, ...s.activity],
    }));
  },

  addLevy(_name: string, _amount: number) {
    // stub for now
  },
};

function applyPaymentToUnit(unitId: string, amount: number, sender: string, tag?: string) {
  set((s) => {
    const units = s.units.map((u) => {
      if (u.id !== unitId) return u;
      let remaining = amount;
      const newCharges = u.charges.map((c) => {
        const owed = c.amount - c.paid;
        if (owed <= 0 || remaining <= 0) return c;
        const pay = Math.min(owed, remaining);
        remaining -= pay;
        return { ...c, paid: c.paid + pay };
      });
      const credit = u.credit + Math.max(0, remaining);
      const balance = newCharges.reduce((acc, c) => acc + (c.amount - c.paid), 0);
      let status: UnitStatus = "paid";
      if (balance > 0 && balance < newCharges.reduce((a, c) => a + c.amount, 0)) status = "partial";
      else if (balance > 0) status = "overdue";
      else if (credit > 0) status = "credit";
      const running = balance - credit;
      const ledger: LedgerEntry[] = [
        ...u.ledger,
        {
          id: id("le"),
          date: Date.now(),
          description: tag ? `Transfer received — ${tag}` : "Transfer received",
          kind: "payment",
          amount: -amount,
          running,
          allocation: tag ?? `Applied to ${s.cycle} service charge`,
        },
      ];
      return { ...u, charges: newCharges, balance, credit, status, lastPaymentAt: Date.now(), ledger };
    });
    const u = units.find((x) => x.id === unitId)!;
    const payment: Payment = {
      id: id("p"),
      unitId,
      amount,
      timestamp: Date.now(),
      sender,
      status: u.balance === 0 ? (u.credit > 0 ? "overpayment" : "matched") : "partial",
      allocation: `Applied to ${s.cycle} service charge`,
    };
    const msg = u.balance === 0
      ? `Block ${u.block} Flat ${u.label.slice(1)} paid ₦${amount.toLocaleString("en-NG")}, dues settled`
      : `Block ${u.block} Flat ${u.label.slice(1)} paid ₦${amount.toLocaleString("en-NG")}, ₦${u.balance.toLocaleString("en-NG")} still owing`;
    return {
      ...s,
      units,
      payments: [payment, ...s.payments],
      activity: [{ id: id("a"), timestamp: Date.now(), message: msg, unitId }, ...s.activity].slice(0, 50),
      recentlyChanged: { ...s.recentlyChanged, [unitId]: Date.now() },
    };
  });
  // clear flash after 1.5s
  setTimeout(() => {
    set((s) => {
      const next = { ...s.recentlyChanged };
      delete next[unitId];
      return { ...s, recentlyChanged: next };
    });
  }, 1500);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()), () => selector(store.get()));
}

export function useGatehouse() {
  return useStore((s) => s);
}