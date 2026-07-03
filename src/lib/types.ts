// View-model types shared by the client UI and the server state assembler.
// These carry money as NAIRA numbers (the display edge); the database and the
// reconciliation engine work in integer kobo. Conversion happens in
// src/lib/server/state.ts. Kept shape-compatible with the original prototype so
// existing components render unchanged.

export type UnitStatus = "paid" | "partial" | "overdue" | "unbilled" | "credit";
export type PaymentStatus = "matched" | "partial" | "overpayment" | "exception" | "manual";
export type ExceptionType = "overpayment" | "duplicate" | "misdirected" | "third_party";

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
  kind: "charge" | "payment" | "credit";
  amount: number; // + charge, - payment/credit (naira)
  running: number;
  allocation?: string;
}

export interface Unit {
  id: string;
  label: string;
  block: string;
  occupant: string;
  phone: string;
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
  totalPaid: number; // naira
}

export interface Payout {
  id: string;
  vendorId: string;
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
  recentlyChanged: Record<string, number>;
}
