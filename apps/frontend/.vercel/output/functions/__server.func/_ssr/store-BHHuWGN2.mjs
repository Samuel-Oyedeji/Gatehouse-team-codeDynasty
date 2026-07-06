import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as resolveAccountFn, C as getQueryClient, D as payVendorFn, I as updateUnitFn, L as updateVendorFn, N as simulatePayment, O as provisionUnitsFn, f as deleteGroupFn, g as fetchBanksFn, h as fetchAccountBalance, i as addVendorFn, j as resolveExceptionFn, k as resetDemoFn, m as deleteVendorFn, n as BANKS_KEY, o as assignUnitGroupFn, p as deleteUnitFn, r as ESTATE_STATE_KEY, t as ACCOUNT_BALANCE_KEY, u as createGroupFn, v as fetchEstateState } from "./api-4JFegvrj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BHHuWGN2.js
var EMPTY_STATE = {
	estate: {
		id: "",
		name: "",
		address: "",
		city: ""
	},
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
	recentlyChanged: {}
};
async function refresh() {
	await getQueryClient().invalidateQueries({ queryKey: ESTATE_STATE_KEY });
}
/** Raw query (exposes loading/error) — used where a component wants status. */
function useEstateStateQuery() {
	return useQuery({
		queryKey: ESTATE_STATE_KEY,
		queryFn: () => fetchEstateState()
	});
}
/** Backwards-compatible hook: always returns a State (empty while loading). */
function useGatehouse() {
	const { data } = useEstateStateQuery();
	return data ?? EMPTY_STATE;
}
/** Live Nomba settlement-account balance. Polls every 60s so the figure stays
*  current without a manual refresh. */
function useAccountBalanceQuery() {
	return useQuery({
		queryKey: ACCOUNT_BALANCE_KEY,
		queryFn: () => fetchAccountBalance(),
		refetchInterval: 6e4
	});
}
/** Live bank list (with codes) for the Add Vendor dropdown. Banks rarely change,
*  so cache aggressively and don't refetch across a session. */
function useBanksQuery() {
	return useQuery({
		queryKey: BANKS_KEY,
		queryFn: () => fetchBanksFn(),
		staleTime: 1440 * 6e4
	});
}
var store = {
	async recordPayment(unitLabel, amountNaira) {
		await simulatePayment({ data: {
			unitLabel,
			amountNaira
		} });
		await refresh();
	},
	async resolveException(exceptionId, action, targetUnitId) {
		await resolveExceptionFn({ data: {
			exceptionId,
			action,
			targetUnitId
		} });
		await refresh();
	},
	async payVendor(vendorId, amountNaira, note) {
		await payVendorFn({ data: {
			vendorId,
			amountNaira,
			note
		} });
		await refresh();
	},
	async addVendor(input) {
		const vendor = await addVendorFn({ data: input });
		await refresh();
		return vendor;
	},
	async updateVendor(vendorId, input) {
		const vendor = await updateVendorFn({ data: {
			vendorId,
			...input
		} });
		await refresh();
		return vendor;
	},
	async deleteVendor(vendorId) {
		await deleteVendorFn({ data: { vendorId } });
		await refresh();
	},
	resolveAccount(accountNumber, bankCode) {
		return resolveAccountFn({ data: {
			accountNumber,
			bankCode
		} });
	},
	async addUnits(units) {
		const res = await provisionUnitsFn({ data: { units } });
		await refresh();
		return res;
	},
	async createGroup(name) {
		const group = await createGroupFn({ data: { name } });
		await refresh();
		return group;
	},
	async deleteGroup(groupId) {
		const qc = getQueryClient();
		const prev = qc.getQueryData(ESTATE_STATE_KEY);
		qc.setQueryData(ESTATE_STATE_KEY, (s) => s ? {
			...s,
			groups: s.groups.filter((g) => g.id !== groupId),
			units: s.units.map((u) => u.groupId === groupId ? {
				...u,
				groupId: null
			} : u)
		} : s);
		try {
			await deleteGroupFn({ data: { groupId } });
			await refresh();
		} catch (e) {
			if (prev) qc.setQueryData(ESTATE_STATE_KEY, prev);
			throw e;
		}
	},
	async assignUnitGroup(unitId, groupId) {
		const qc = getQueryClient();
		const prevGroupId = qc.getQueryData(ESTATE_STATE_KEY)?.units.find((u) => u.id === unitId)?.groupId ?? null;
		const setGroup = (gid) => qc.setQueryData(ESTATE_STATE_KEY, (s) => s ? {
			...s,
			units: s.units.map((u) => u.id === unitId ? {
				...u,
				groupId: gid
			} : u)
		} : s);
		setGroup(groupId);
		try {
			await assignUnitGroupFn({ data: {
				unitId,
				groupId
			} });
			await refresh();
		} catch (e) {
			setGroup(prevGroupId);
			throw e;
		}
	},
	async updateUnit(unitId, contact) {
		await updateUnitFn({ data: {
			unitId,
			...contact
		} });
		await refresh();
	},
	async deleteUnit(unitId) {
		await deleteUnitFn({ data: { unitId } });
		await refresh();
	},
	async reset() {
		await resetDemoFn();
		await refresh();
	}
};
//#endregion
export { useGatehouse as i, useAccountBalanceQuery as n, useBanksQuery as r, store as t };
