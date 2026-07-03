// Small shared helpers for the server domain layer.
import type { UnitStatus, ChargeStatus } from "@prisma/client";

/**
 * The accountRef we register with Nomba for a unit's virtual account. Encodes the
 * estate so inbound funds are always traceable to an estate even if the unit lookup
 * fails. cuid ids are ~25 chars, so this is comfortably within Nomba's 16–64 range.
 */
export function accountRefFor(estateId: string, unitId: string): string {
  return `gatehouse-${estateId}-${unitId}`;
}

export function estateIdFromAccountRef(ref: string): string | undefined {
  const parts = ref.split("-");
  return parts[0] === "gatehouse" && parts.length >= 3 ? parts[1] : undefined;
}

/** Human account name for Nomba (8–64 chars), e.g. "MAPLE COURT / B-04". */
export function accountNameFor(estateName: string, unitLabel: string): string {
  const name = `${estateName} / ${unitLabel}`.toUpperCase();
  return name.length < 8 ? name.padEnd(8, "X") : name.slice(0, 64);
}

export function deriveUnitStatus(
  balanceKobo: number,
  creditKobo: number,
  totalOriginalKobo: number,
): UnitStatus {
  if (totalOriginalKobo <= 0) return creditKobo > 0 ? "CREDIT" : "UNBILLED";
  if (balanceKobo <= 0) return creditKobo > 0 ? "CREDIT" : "PAID";
  if (balanceKobo >= totalOriginalKobo) return "OVERDUE";
  return "PARTIAL";
}

export function chargeStatusFor(outstandingKobo: number, originalKobo: number): ChargeStatus {
  if (outstandingKobo <= 0) return "SETTLED";
  if (outstandingKobo < originalKobo) return "PARTIAL";
  return "OPEN";
}
