// API surface for the frontend, backed by the NestJS backend over HTTP. Each
// function keeps the name and `{ data }` call shape the pages/store already use,
// so store.ts and the route components are untouched by the repoint.
import { request, setToken, clearAuth, getEstateId, setEstateId } from "./http";
import { getQueryClient } from "./query-client";
import type { State, Unit } from "./types";
import type { Bank } from "./banks";

export interface PublicStatement {
  estate: { name: string; city: string };
  unit: Unit;
  accountNumber: string;
  bankName: string;
  transparency: {
    collected: number;
    spent: number;
    balance: number;
    byCategory: { category: string; amount: number }[];
  };
}

// ---------- auth ----------
export async function loginFn({ data }: { data: { email: string; password: string } }) {
  const res = await request<{ manager: { id: string }; accessToken: string }>("POST", "/auth/login", data);
  setToken(res.accessToken);
  return res;
}

export async function signupFn({ data }: { data: { name: string; email: string; phone?: string; password: string } }) {
  const res = await request<{ manager: { id: string }; accessToken: string }>("POST", "/auth/register", {
    fullName: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
  });
  setToken(res.accessToken);
  return res;
}

export async function logoutFn() {
  // Best-effort notify the server while the token is still present. The JWT is
  // stateless (this endpoint is currently a no-op), but honoring the contract
  // keeps logout correct if token revocation is ever added. A network error must
  // never block the local teardown below.
  try {
    await request("POST", "/auth/logout");
  } catch {
    // ignore — we log out locally regardless
  }
  clearAuth();
  // Drop every cached query so the next (or unauthenticated) view can't read the
  // previous session's estate data straight out of memory.
  getQueryClient().clear();
  return { ok: true };
}

export async function fetchCurrentUser() {
  try {
    const res = await request<{
      manager: { id: string; fullName: string; email: string } | null;
      estates: { id: string; name: string; unitsCount: number }[];
    }>("GET", "/auth/me");
    if (!res.manager) return null;
    const estate = res.estates[0];
    if (estate) setEstateId(estate.id);
    return {
      id: res.manager.id,
      name: res.manager.fullName,
      email: res.manager.email,
      estateId: estate?.id ?? null,
      estateName: estate?.name ?? "",
      onboarded: (estate?.unitsCount ?? 0) > 0,
    };
  } catch {
    return null;
  }
}

// ---------- reads ----------
export async function fetchEstateState() {
  const estateId = getEstateId();
  if (!estateId) throw new Error("No estate selected");
  return request<State>("GET", `/estate/${estateId}/state`);
}

export async function fetchReports() {
  const estateId = getEstateId();
  if (!estateId) throw new Error("No estate selected");
  return request("GET", `/estate/${estateId}/reports`);
}

// Live float in the shared Nomba settlement sub-account. `available` is false
// when Nomba isn't configured/reachable so the widget can show a fallback.
export interface AccountBalance {
  available: boolean;
  amountNaira?: number;
  currency?: string;
  asOf?: number;
}

export async function fetchAccountBalance() {
  const estateId = getEstateId();
  if (!estateId) throw new Error("No estate selected");
  return request<AccountBalance>("GET", `/estate/${estateId}/account-balance`);
}

export async function fetchPublicStatement({ data }: { data: { token: string } }) {
  return request<PublicStatement | null>("GET", `/public/${data.token}`);
}

// ---------- payments ----------
export async function simulatePayment({ data }: { data: { unitLabel: string; amountNaira: number } }) {
  return request("POST", "/payments/simulate", { estateId: getEstateId(), unitLabel: data.unitLabel, amountNaira: data.amountNaira });
}

export async function recordManualPayment({ data }: { data: { unitId: string; amountNaira: number; sender?: string } }) {
  return request("POST", "/payments/manual", { estateId: getEstateId(), ...data });
}

// ---------- unit groups ----------
export async function createGroupFn({ data }: { data: { name: string } }) {
  return request<{ id: string; name: string }>("POST", `/estate/${getEstateId()}/groups`, { name: data.name });
}

export async function deleteGroupFn({ data }: { data: { groupId: string } }) {
  return request("DELETE", `/estate/${getEstateId()}/groups/${data.groupId}`);
}

export async function assignUnitGroupFn({ data }: { data: { unitId: string; groupId: string | null } }) {
  return request("PATCH", `/estate/${getEstateId()}/units/${data.unitId}/group`, { groupId: data.groupId });
}

// ---------- unit contact / lifecycle ----------
// Edit a unit's resident contact fields. The virtual account is immutable, so it
// is never sent here. Omit a field to leave it unchanged; send phone: "" to clear.
export async function updateUnitFn({ data }: { data: { unitId: string; email?: string; phone?: string } }) {
  const { unitId, ...body } = data;
  return request("PATCH", `/estate/${getEstateId()}/units/${unitId}`, body);
}

export async function deleteUnitFn({ data }: { data: { unitId: string } }) {
  return request("DELETE", `/estate/${getEstateId()}/units/${data.unitId}`);
}

// ---------- exceptions ----------
export async function resolveExceptionFn({ data }: { data: { exceptionId: string; action: string; targetUnitId?: string } }) {
  return request("POST", `/exceptions/${data.exceptionId}/resolve`, { action: data.action, targetUnitId: data.targetUnitId });
}

// ---------- vendors / payouts ----------
export async function payVendorFn({ data }: { data: { vendorId: string; amountNaira: number; note: string } }) {
  return request("POST", "/payouts", { estateId: getEstateId(), ...data });
}

export async function addVendorFn({ data }: { data: { name: string; category: string; bankName: string; bankCode?: string; accountNumber: string } }) {
  return request("POST", "/vendors", { estateId: getEstateId(), ...data });
}

export async function updateVendorFn({ data }: { data: { vendorId: string; name?: string; category?: string; bankName?: string; bankCode?: string; accountNumber?: string } }) {
  const { vendorId, ...body } = data;
  return request("PATCH", `/vendors/${vendorId}`, { estateId: getEstateId(), ...body });
}

// estateId goes on the query string — DELETE carries no body.
export async function deleteVendorFn({ data }: { data: { vendorId: string } }) {
  return request("DELETE", `/vendors/${data.vendorId}?estateId=${getEstateId()}`);
}

// Confirms the account-holder name for a bank account (Nomba name enquiry) so a
// manager can verify a vendor before saving. Stateless — no estate scope.
export async function resolveAccountFn({ data }: { data: { accountNumber: string; bankCode: string } }) {
  return request<{ accountName: string }>("POST", "/vendors/resolve-account", data);
}

// Live bank list (with codes) from Nomba, for the Add Vendor bank dropdown.
export async function fetchBanksFn() {
  return request<Bank[]>("GET", "/vendors/banks");
}

// ---------- billing ----------
export async function createBillingRunFn({ data }: { data: { cycleLabel: string; chargeAmountNaira: number; dueDate: number; unitIds?: string[] } }) {
  return request<{ unitsBilled: number }>("POST", "/billing/run", { estateId: getEstateId(), ...data });
}

export async function createLevyFn({ data }: { data: { name: string; amountNaira: number; dueDate: number; requireExact?: boolean; unitIds?: string[] } }) {
  return request<{ unitsBilled: number }>("POST", "/billing/levy", { estateId: getEstateId(), ...data });
}

// ---------- onboarding ----------
export interface OnboardingState {
  step: number;
  estate: { id: string; name: string; address: string; city: string; state: string; units: number } | null;
  hasFees: boolean;
  hasUnits: boolean;
}

// Backend-derived onboarding progress, so a tab refresh resumes at the right step
// instead of restarting the wizard. Restores the estate id that later fee/unit
// calls read via getEstateId(), even if localStorage was cleared.
export async function fetchOnboardingState() {
  const res = await request<OnboardingState>("GET", "/onboarding/state");
  if (res.estate) setEstateId(res.estate.id);
  return res;
}

export async function createEstateFn({ data }: { data: { name: string; address: string; city: string; state?: string; units: number } }) {
  const estate = await request<{ id: string }>("POST", "/onboarding/estate", {
    name: data.name,
    address: data.address,
    city: data.city,
    state: data.state || data.city,
    units: data.units,
  });
  setEstateId(estate.id);
  return estate;
}

export async function createFeesFn({ data }: { data: { fees: { name: string; type: "service_fee" | "levy"; amount: number; frequency: string }[] } }) {
  return request("POST", "/onboarding/fee", { estateId: getEstateId(), fees: data.fees });
}

export async function provisionUnitsFn({
  data,
}: {
  data: { units: { label: string; block: string; occupantName: string; occupantPhone?: string; occupancyType?: "OWNER" | "TENANT" }[] };
}): Promise<{
  succeeded: { label: string; accountNumber: string | null }[];
  failed: { unit: string; reason: string }[];
}> {
  const res = await request<{
    succeeded: { unit: { unitName: string }; account: { accountNumber: string } }[];
    failed: { unit: string; reason: string }[];
  }>(
    "POST",
    "/onboarding/unit",
    {
      estateId: getEstateId(),
      units: data.units.map((u) => ({
        block: u.block,
        unitName: u.label,
        occupant: u.occupantName,
        phone: u.occupantPhone,
        email: `${u.occupantName.split(" ")[0].toLowerCase()}@example.ng`,
        type: u.occupancyType === "TENANT" ? "tenant" : "owner",
      })),
    },
  );
  return {
    succeeded: res.succeeded.map((s) => ({ label: s.unit.unitName, accountNumber: s.account.accountNumber })),
    failed: res.failed ?? [],
  };
}

// ---------- estate settings ----------
export async function updateEstateFn({ data }: { data: { name?: string; address?: string; city?: string; cycleLabel?: string } }) {
  return request("PATCH", `/estate/${getEstateId()}`, data);
}

export async function updateFeeStructureFn({
  data,
}: {
  data: { serviceChargeNaira?: number; serviceChargeCadence?: string; allocationRule?: "OLDEST_FIRST" | "DUES_FIRST"; autoCreditThresholdNaira?: number };
}) {
  // Only the estate-level settings (allocation rule / threshold) have a backend
  // update; the recurring service-charge amount is set via the next billing run.
  if (data.allocationRule || data.autoCreditThresholdNaira != null) {
    return request("PATCH", `/estate/${getEstateId()}`, {
      allocationRule: data.allocationRule,
      autoCreditThresholdNaira: data.autoCreditThresholdNaira,
    });
  }
  return { ok: true };
}

// ---------- demo ----------
export async function resetDemoFn() {
  // No server-side reset endpoint; re-seed from the backend CLI instead.
  return { ok: true };
}
