// Query-backed store. Preserves the prototype's `useGatehouse()` / `store.*`
// surface so existing components render unchanged, but reads from the server
// (getEstateState) via TanStack Query and mutates through server functions,
// invalidating the estate-state cache after each change.
import { useQuery } from "@tanstack/react-query";
import { getQueryClient, ESTATE_STATE_KEY } from "./query-client";
import type { State } from "./types";
import {
  fetchEstateState,
  simulatePayment,
  resolveExceptionFn,
  payVendorFn,
  resetDemoFn,
} from "./api";

export * from "./types";

export type ResolveAction =
  | "credit"
  | "refund"
  | "duplicate-hold"
  | "duplicate-keep"
  | "reassign"
  | "attribute";

export const EMPTY_STATE: State = {
  estate: { id: "", name: "", address: "", city: "" },
  cycle: "",
  allocationRule: "OLDEST_FIRST",
  units: [],
  payments: [],
  exceptions: [],
  vendors: [],
  payouts: [],
  billingRuns: [],
  levies: [],
  activity: [],
  recentlyChanged: {},
};

async function refresh() {
  await getQueryClient().invalidateQueries({ queryKey: ESTATE_STATE_KEY });
}

/** Raw query (exposes loading/error) — used where a component wants status. */
export function useEstateStateQuery() {
  return useQuery({ queryKey: ESTATE_STATE_KEY, queryFn: () => fetchEstateState() });
}

/** Backwards-compatible hook: always returns a State (empty while loading). */
export function useGatehouse(): State {
  const { data } = useEstateStateQuery();
  return data ?? EMPTY_STATE;
}

export const store = {
  async recordPayment(unitLabel: string, amountNaira: number) {
    await simulatePayment({ data: { unitLabel, amountNaira } });
    await refresh();
  },
  async resolveException(exceptionId: string, action: ResolveAction, targetUnitId?: string) {
    await resolveExceptionFn({ data: { exceptionId, action, targetUnitId } });
    await refresh();
  },
  async payVendor(vendorId: string, amountNaira: number, note: string) {
    await payVendorFn({ data: { vendorId, amountNaira, note } });
    await refresh();
  },
  async reset() {
    await resetDemoFn();
    await refresh();
  },
};
