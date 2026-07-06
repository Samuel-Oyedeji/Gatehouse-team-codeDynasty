// Query-backed store. Preserves the prototype's `useGatehouse()` / `store.*`
// surface so existing components render unchanged, but reads from the server
// (getEstateState) via TanStack Query and mutates through server functions,
// invalidating the estate-state cache after each change.
import { useQuery } from "@tanstack/react-query";
import { getQueryClient, ESTATE_STATE_KEY, ACCOUNT_BALANCE_KEY, BANKS_KEY } from "./query-client";
import type { State } from "./types";
import {
  fetchEstateState,
  fetchAccountBalance,
  simulatePayment,
  resolveExceptionFn,
  payVendorFn,
  addVendorFn,
  updateVendorFn,
  deleteVendorFn,
  resolveAccountFn,
  fetchBanksFn,
  resetDemoFn,
  provisionUnitsFn,
  createGroupFn,
  deleteGroupFn,
  assignUnitGroupFn,
  updateUnitFn,
  deleteUnitFn,
} from "./api";

export * from "./types";

export type ResolveAction =
  | "credit"
  | "refund"
  | "duplicate-hold"
  | "duplicate-keep"
  | "reassign"
  | "attribute"
  | "acknowledge";

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

/** Live Nomba settlement-account balance. Polls every 60s so the figure stays
 *  current without a manual refresh. */
export function useAccountBalanceQuery() {
  return useQuery({
    queryKey: ACCOUNT_BALANCE_KEY,
    queryFn: () => fetchAccountBalance(),
    refetchInterval: 60_000,
  });
}

/** Live bank list (with codes) for the Add Vendor dropdown. Banks rarely change,
 *  so cache aggressively and don't refetch across a session. */
export function useBanksQuery() {
  return useQuery({
    queryKey: BANKS_KEY,
    queryFn: () => fetchBanksFn(),
    staleTime: 24 * 60 * 60_000,
  });
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
  async addVendor(input: { name: string; category: string; bankName: string; bankCode: string; accountNumber: string }) {
    const vendor = await addVendorFn({ data: input });
    await refresh();
    return vendor;
  },
  async updateVendor(vendorId: string, input: { name: string; category: string; bankName: string; bankCode: string; accountNumber: string }) {
    const vendor = await updateVendorFn({ data: { vendorId, ...input } });
    await refresh();
    return vendor;
  },
  async deleteVendor(vendorId: string) {
    await deleteVendorFn({ data: { vendorId } });
    await refresh();
  },
  // Name enquiry — a read, not a mutation, so no cache refresh. Kept on the store
  // so pages reach the server through one bridge.
  resolveAccount(accountNumber: string, bankCode: string) {
    return resolveAccountFn({ data: { accountNumber, bankCode } });
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
  // Optimistic: drop the group and revert its units to ungrouped (matching the
  // server's SetNull) so the section vanishes instantly. Snapshot-restore on
  // failure since a delete touches the group plus every member unit.
  async deleteGroup(groupId: string) {
    const qc = getQueryClient();
    const prev = qc.getQueryData<State>(ESTATE_STATE_KEY);
    qc.setQueryData<State>(ESTATE_STATE_KEY, (s) =>
      s
        ? {
            ...s,
            groups: s.groups.filter((g) => g.id !== groupId),
            units: s.units.map((u) => (u.groupId === groupId ? { ...u, groupId: null } : u)),
          }
        : s,
    );
    try {
      await deleteGroupFn({ data: { groupId } });
      await refresh();
    } catch (e) {
      if (prev) qc.setQueryData(ESTATE_STATE_KEY, prev);
      throw e;
    }
  },
  // Optimistic: move the unit in the cache immediately so the tile jumps to its
  // new group without waiting on the server. Reconcile with server truth on
  // success; roll back to the snapshot and rethrow on failure so the caller can
  // alert the user.
  async assignUnitGroup(unitId: string, groupId: string | null) {
    const qc = getQueryClient();
    const prevGroupId =
      qc.getQueryData<State>(ESTATE_STATE_KEY)?.units.find((u) => u.id === unitId)?.groupId ?? null;
    // Patch just this unit via the functional updater so a concurrent move of a
    // different unit isn't clobbered by our optimistic write or rollback.
    const setGroup = (gid: string | null) =>
      qc.setQueryData<State>(ESTATE_STATE_KEY, (s) =>
        s ? { ...s, units: s.units.map((u) => (u.id === unitId ? { ...u, groupId: gid } : u)) } : s,
      );
    setGroup(groupId);
    try {
      await assignUnitGroupFn({ data: { unitId, groupId } });
      await refresh();
    } catch (e) {
      setGroup(prevGroupId);
      throw e;
    }
  },
  // Edit a unit's resident contact info (email / phone). The virtual account is
  // immutable and never sent. Refresh so the sheet and units list reflect the edit.
  async updateUnit(unitId: string, contact: { email?: string; phone?: string }) {
    await updateUnitFn({ data: { unitId, ...contact } });
    await refresh();
  },
  async deleteUnit(unitId: string) {
    await deleteUnitFn({ data: { unitId } });
    await refresh();
  },
  async reset() {
    await resetDemoFn();
    await refresh();
  },
};
