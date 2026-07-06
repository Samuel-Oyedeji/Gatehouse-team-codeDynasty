import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-ByrbTN72.js
var API_URL = "https://gatehouse-team-codedynasty-production.up.railway.app";
var TOKEN_KEY = "gatehouse_token";
var ESTATE_KEY = "gatehouse_estate";
function getToken() {
	return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}
function setToken(token) {
	if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}
function clearAuth() {
	if (typeof window !== "undefined") {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(ESTATE_KEY);
	}
}
function getEstateId() {
	return typeof window !== "undefined" ? localStorage.getItem(ESTATE_KEY) : null;
}
function setEstateId(id) {
	if (typeof window !== "undefined") localStorage.setItem(ESTATE_KEY, id);
}
function apiUrl(path) {
	return `${API_URL}${path}`;
}
/** Calls the NestJS API and unwraps the `{ message, data }` envelope to `data`. */
async function request(method, path, body) {
	const headers = { "Content-Type": "application/json" };
	const token = getToken();
	if (token) headers.Authorization = `Bearer ${token}`;
	const res = await fetch(apiUrl(path), {
		method,
		headers,
		body: body !== void 0 ? JSON.stringify(body) : void 0
	});
	const text = await res.text();
	const json = text ? JSON.parse(text) : {};
	if (!res.ok) {
		const msg = json?.message ?? res.statusText;
		throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
	}
	return json && typeof json === "object" && "data" in json ? json.data : json;
}
var browserClient;
function getQueryClient() {
	if (typeof window === "undefined") return new QueryClient();
	if (!browserClient) browserClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 5e3,
		refetchOnWindowFocus: false
	} } });
	return browserClient;
}
var ESTATE_STATE_KEY = ["estate-state"];
var ACCOUNT_BALANCE_KEY = ["account-balance"];
var BANKS_KEY = ["banks"];
async function loginFn({ data }) {
	const res = await request("POST", "/auth/login", data);
	setToken(res.accessToken);
	return res;
}
async function signupFn({ data }) {
	const res = await request("POST", "/auth/register", {
		fullName: data.name,
		email: data.email,
		phone: data.phone,
		password: data.password
	});
	setToken(res.accessToken);
	return res;
}
async function logoutFn() {
	try {
		await request("POST", "/auth/logout");
	} catch {}
	clearAuth();
	getQueryClient().clear();
	return { ok: true };
}
async function fetchCurrentUser() {
	try {
		const res = await request("GET", "/auth/me");
		if (!res.manager) return null;
		const estate = res.estates[0];
		if (estate) setEstateId(estate.id);
		return {
			id: res.manager.id,
			name: res.manager.fullName,
			email: res.manager.email,
			estateId: estate?.id ?? null,
			estateName: estate?.name ?? "",
			onboarded: (estate?.unitsCount ?? 0) > 0
		};
	} catch {
		return null;
	}
}
async function fetchStreamTicket() {
	return (await request("GET", "/stream/ticket")).ticket;
}
async function fetchEstateState() {
	const estateId = getEstateId();
	if (!estateId) throw new Error("No estate selected");
	return request("GET", `/estate/${estateId}/state`);
}
async function fetchAccountBalance() {
	const estateId = getEstateId();
	if (!estateId) throw new Error("No estate selected");
	return request("GET", `/estate/${estateId}/account-balance`);
}
async function fetchPublicStatement({ data }) {
	return request("GET", `/public/${data.token}`);
}
async function simulatePayment({ data }) {
	return request("POST", "/payments/simulate", {
		estateId: getEstateId(),
		unitLabel: data.unitLabel,
		amountNaira: data.amountNaira
	});
}
async function createGroupFn({ data }) {
	return request("POST", `/estate/${getEstateId()}/groups`, { name: data.name });
}
async function deleteGroupFn({ data }) {
	return request("DELETE", `/estate/${getEstateId()}/groups/${data.groupId}`);
}
async function assignUnitGroupFn({ data }) {
	return request("PATCH", `/estate/${getEstateId()}/units/${data.unitId}/group`, { groupId: data.groupId });
}
async function updateUnitFn({ data }) {
	const { unitId, ...body } = data;
	return request("PATCH", `/estate/${getEstateId()}/units/${unitId}`, body);
}
async function deleteUnitFn({ data }) {
	return request("DELETE", `/estate/${getEstateId()}/units/${data.unitId}`);
}
async function resolveExceptionFn({ data }) {
	return request("POST", `/exceptions/${data.exceptionId}/resolve`, {
		action: data.action,
		targetUnitId: data.targetUnitId
	});
}
async function payVendorFn({ data }) {
	return request("POST", "/payouts", {
		estateId: getEstateId(),
		...data
	});
}
async function addVendorFn({ data }) {
	return request("POST", "/vendors", {
		estateId: getEstateId(),
		...data
	});
}
async function updateVendorFn({ data }) {
	const { vendorId, ...body } = data;
	return request("PATCH", `/vendors/${vendorId}`, {
		estateId: getEstateId(),
		...body
	});
}
async function deleteVendorFn({ data }) {
	return request("DELETE", `/vendors/${data.vendorId}?estateId=${getEstateId()}`);
}
async function resolveAccountFn({ data }) {
	return request("POST", "/vendors/resolve-account", data);
}
async function fetchBanksFn() {
	return request("GET", "/vendors/banks");
}
async function createBillingRunFn({ data }) {
	return request("POST", "/billing/run", {
		estateId: getEstateId(),
		...data
	});
}
async function createLevyFn({ data }) {
	return request("POST", "/billing/levy", {
		estateId: getEstateId(),
		...data
	});
}
async function fetchOnboardingState() {
	const res = await request("GET", "/onboarding/state");
	if (res.estate) setEstateId(res.estate.id);
	return res;
}
async function createEstateFn({ data }) {
	const estate = await request("POST", "/onboarding/estate", {
		name: data.name,
		address: data.address,
		city: data.city,
		state: data.state || data.city,
		units: data.units
	});
	setEstateId(estate.id);
	return estate;
}
async function createFeesFn({ data }) {
	return request("POST", "/onboarding/fee", {
		estateId: getEstateId(),
		fees: data.fees
	});
}
async function provisionUnitsFn({ data }) {
	const res = await request("POST", "/onboarding/unit", {
		estateId: getEstateId(),
		units: data.units.map((u) => ({
			block: u.block,
			unitName: u.label,
			occupant: u.occupantName,
			phone: u.occupantPhone,
			email: `${u.occupantName.split(" ")[0].toLowerCase()}@example.ng`,
			type: u.occupancyType === "TENANT" ? "tenant" : "owner"
		}))
	});
	return {
		succeeded: res.succeeded.map((s) => ({
			label: s.unit.unitName,
			accountNumber: s.account.accountNumber
		})),
		failed: res.failed ?? []
	};
}
async function updateEstateFn({ data }) {
	return request("PATCH", `/estate/${getEstateId()}`, data);
}
async function updateFeeStructureFn({ data }) {
	if (data.allocationRule || data.autoCreditThresholdNaira != null) return request("PATCH", `/estate/${getEstateId()}`, {
		allocationRule: data.allocationRule,
		autoCreditThresholdNaira: data.autoCreditThresholdNaira
	});
	return { ok: true };
}
async function resetDemoFn() {
	return { ok: true };
}
//#endregion
export { resolveAccountFn as A, getQueryClient as C, payVendorFn as D, logoutFn as E, updateFeeStructureFn as F, updateUnitFn as I, updateVendorFn as L, signupFn as M, simulatePayment as N, provisionUnitsFn as O, updateEstateFn as P, getEstateId as S, loginFn as T, fetchCurrentUser as _, apiUrl as a, fetchPublicStatement as b, createEstateFn as c, createLevyFn as d, deleteGroupFn as f, fetchBanksFn as g, fetchAccountBalance as h, addVendorFn as i, resolveExceptionFn as j, resetDemoFn as k, createFeesFn as l, deleteVendorFn as m, BANKS_KEY as n, assignUnitGroupFn as o, deleteUnitFn as p, ESTATE_STATE_KEY as r, createBillingRunFn as s, ACCOUNT_BALANCE_KEY as t, createGroupFn as u, fetchEstateState as v, getToken as w, fetchStreamTicket as x, fetchOnboardingState as y };
