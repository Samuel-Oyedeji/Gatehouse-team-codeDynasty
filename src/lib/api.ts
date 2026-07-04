// API surface for the frontend, backed by the NestJS backend over HTTP. Each
// function keeps the name and `{ data }` call shape the pages/store already use,
// so store.ts and the route components are untouched by the repoint.
import { request, setToken, clearAuth, getEstateId, setEstateId } from "./http";
import type { State, Unit } from "./types";

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
  clearAuth();
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

// ---------- billing ----------
export async function createBillingRunFn({ data }: { data: { cycleLabel: string; chargeAmountNaira: number; dueDate: number; unitIds?: string[] } }) {
  return request<{ unitsBilled: number }>("POST", "/billing/run", { estateId: getEstateId(), ...data });
}

export async function createLevyFn({ data }: { data: { name: string; amountNaira: number; dueDate: number; requireExact?: boolean; unitIds?: string[] } }) {
  return request<{ unitsBilled: number }>("POST", "/billing/levy", { estateId: getEstateId(), ...data });
}

// ---------- onboarding ----------
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
}): Promise<{ label: string; accountNumber: string | null }[]> {
  const res = await request<{ succeeded: { unit: { unitName: string }; account: { accountNumber: string } }[] }>(
    "POST",
    "/onboarding/unit",
    {
      estateId: getEstateId(),
      units: data.units.map((u) => ({
        block: u.block,
        unitName: u.label,
        occupant: u.occupantName,
        email: `${u.occupantName.split(" ")[0].toLowerCase()}@example.ng`,
        type: u.occupancyType === "TENANT" ? "tenant" : "owner",
      })),
    },
  );
  return res.succeeded.map((s) => ({ label: s.unit.unitName, accountNumber: s.account.accountNumber }));
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
