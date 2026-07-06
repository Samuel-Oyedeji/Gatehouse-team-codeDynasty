import type { UnitStatus, PaymentStatus, ExceptionType } from "@/lib/store";

type Kind = UnitStatus | PaymentStatus | ExceptionType | "exception";

const MAP: Record<string, { label: string; bg: string; fg: string }> = {
  paid: { label: "Paid", bg: "#ECFDF5", fg: "#047857" },
  matched: { label: "Matched", bg: "#ECFDF5", fg: "#047857" },
  partial: { label: "Partial", bg: "#FFFBEB", fg: "#B45309" },
  overdue: { label: "Overdue", bg: "#FFF1F2", fg: "#BE123C" },
  unbilled: { label: "Unbilled", bg: "#F1F5F9", fg: "#475569" },
  credit: { label: "Credit", bg: "#EEF2FF", fg: "#4338CA" },
  debit: { label: "Debit", bg: "#FFF7ED", fg: "#C2410C" },
  overpayment: { label: "Overpayment", bg: "#EEF2FF", fg: "#4338CA" },
  exception: { label: "Exception", bg: "#FFF1F2", fg: "#BE123C" },
  duplicate: { label: "Duplicate", bg: "#FFFBEB", fg: "#B45309" },
  misdirected: { label: "Misdirected", bg: "#FFF1F2", fg: "#BE123C" },
  third_party: { label: "Third-party", bg: "#EEF2FF", fg: "#4338CA" },
  reversed: { label: "Reversed", bg: "#FFF1F2", fg: "#BE123C" },
  reversal: { label: "Reversed", bg: "#FFF1F2", fg: "#BE123C" },
};

export function StatusPill({ kind, children }: { kind: Kind; children?: React.ReactNode }) {
  const v = MAP[kind] ?? MAP.unbilled;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular"
      style={{ backgroundColor: v.bg, color: v.fg }}
    >
      {children ?? v.label}
    </span>
  );
}