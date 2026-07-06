// View-model types shared by the client UI and the server state assembler.
// These carry money as NAIRA numbers (the display edge); the database and the
// reconciliation engine work in integer kobo. Conversion happens in
// src/lib/server/state.ts. Kept shape-compatible with the original prototype so
// existing components render unchanged.

export type UnitStatus = "paid" | "partial" | "overdue" | "unbilled" | "credit";
export type PaymentStatus = "matched" | "partial" | "overpayment" | "exception" | "manual" | "reversed";
export type ExceptionType = "overpayment" | "duplicate" | "misdirected" | "third_party" | "reversal";

export interface Charge {
  id: string;
  description: string;
  amount: number; // naira
  paid: number; // naira
  createdAt: number;
  dueAt: number;
  cycle: string;
  kind: "service" | "levy";
}

export interface LedgerEntry {
  id: string;
  date: number;
  description: string;
  kind: "charge" | "payment" | "credit" | "debit";
  amount: number; // + charge, - payment/credit (naira)
  running: number;
  allocation?: string;
  // Settlement of THIS charge (charge rows only) — drives the ledger's paid column.
  settled?: "paid" | "partial" | "unpaid";
}

export interface Unit {
  id: string;
  label: string;
  block: string;
  groupId: string | null; // user-defined group; null = ungrouped
  occupant: string;
  phone: string;
  email: string;
  accountNumber: string;
  occupantType: "owner" | "tenant";
  balance: number; // naira owed
  credit: number; // naira credit
  status: UnitStatus;
  lastPaymentAt?: number;
  charges: Charge[];
  ledger: LedgerEntry[];
}

export interface Payment {
  id: string;
  unitId: string | null;
  amount: number; // naira
  surplusAmount?: number; // naira; present on overpayments
  sourceAccount?: string | null;
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
  bankCode: string; // Nomba bank code — needed to prefill the edit dialog + payouts
  account: string;
  totalPaid: number; // naira
}

export interface Payout {
  id: string;
  vendorId: string;
  vendorName: string; // snapshotted server-side so history survives vendor deletion
  amount: number; // naira
  note: string;
  date: number;
  status: "pending" | "success" | "failed" | "reversed";
}

export interface ActivityItem {
  id: string;
  timestamp: number;
  message: string;
  unitId?: string;
}

export interface Group {
  id: string;
  name: string;
}

export interface BillingRunView {
  id: string;
  cycle: string;
  chargeAmount: number; // naira
  unitsBilled: number;
  total: number; // naira
  collected: number; // naira
  createdAt: number;
}

export interface LevyView {
  id: string;
  name: string;
  amount: number; // naira per unit
  dueDate: number;
  unitsBilled: number;
  total: number; // naira
  collected: number; // naira
  requireExact: boolean;
}

export interface State {
  estate: { id: string; name: string; address: string; city: string };
  cycle: string;
  allocationRule: "OLDEST_FIRST" | "DUES_FIRST";
  units: Unit[];
  payments: Payment[];
  exceptions: ExceptionItem[];
  vendors: Vendor[];
  payouts: Payout[];
  billingRuns: BillingRunView[];
  levies: LevyView[];
  activity: ActivityItem[];
  groups: Group[];
  recentlyChanged: Record<string, number>;
}
