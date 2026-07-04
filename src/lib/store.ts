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
  provisionUnitsFn,
  createGroupFn,
  deleteGroupFn,
  assignUnitGroupFn,
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
  groups: [],
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
  async addUnits(
    units: {
      label: string;
      block: string;
      occupantName: string;
      occupantPhone?: string;
      occupancyType?: "OWNER" | "TENANT";
    }[],
  ) {
    const res = await provisionUnitsFn({ data: { units } });
    await refresh();
    return res;
  },
  async createGroup(name: string) {
    const group = await createGroupFn({ data: { name } });
    await refresh();
    return group;
  },
  async deleteGroup(groupId: string) {
    await deleteGroupFn({ data: { groupId } });
    await refresh();
  },
  async assignUnitGroup(unitId: string, groupId: string | null) {
    await assignUnitGroupFn({ data: { unitId, groupId } });
    await refresh();
  },
  async reset() {
    await resetDemoFn();
    await refresh();
  },
};
