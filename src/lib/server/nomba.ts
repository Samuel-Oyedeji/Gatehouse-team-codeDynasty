// Nomba API client (server-only). Endpoint shapes verified against
// https://developer.nomba.com (see the PRD "Verified Nomba API contract").
// All Nomba money is in NAIRA; callers convert from kobo at the boundary.
import { createHmac, timingSafeEqual } from "node:crypto";

const BASE_URL = process.env.NOMBA_BASE_URL || "https://sandbox.nomba.com";
const CLIENT_ID = process.env.NOMBA_CLIENT_ID || "";
const CLIENT_SECRET = process.env.NOMBA_CLIENT_SECRET || "";
const ACCOUNT_ID = process.env.NOMBA_ACCOUNT_ID || "";
const WEBHOOK_KEY = process.env.NOMBA_WEBHOOK_SIGNATURE_KEY || "";

export function nombaConfigured(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET && ACCOUNT_ID);
}

// ---------- token management ----------
interface Token {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch ms
}
let cached: Token | null = null;

async function issueToken(): Promise<Token> {
  const res = await fetch(`${BASE_URL}/v1/auth/token/issue`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accountId: ACCOUNT_ID },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    throw new Error(`Nomba auth failed (${res.status}): ${await res.text()}`);
  }
  const json = await res.json();
  const d = json.data;
  return {
    accessToken: d.access_token,
    refreshToken: d.refresh_token,
    expiresAt: new Date(d.expiresAt).getTime(),
  };
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt - 60_000 > now) return cached.accessToken;
  cached = await issueToken();
  return cached.accessToken;
}

async function nombaFetch(path: string, init: RequestInit = {}): Promise<any> {
  if (!nombaConfigured()) throw new Error("NOMBA_NOT_CONFIGURED");
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      accountId: ACCOUNT_ID,
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    console.error(`[nomba] ${init.method ?? "GET"} ${path} -> ${res.status}`, text);
    throw new Error(`Nomba ${path} failed (${res.status}): ${text}`);
  }
  return json;
}

// ---------- Virtual Accounts ----------
export interface CreateVirtualAccountParams {
  accountRef: string; // 16-64 chars
  accountName: string; // 8-64 chars
  bvn?: string;
  expiryDate?: string; // "YYYY-MM-DD HH:MM:SS"
  expectedAmountNaira?: number;
}

export interface VirtualAccountResult {
  accountRef: string;
  accountNumber: string;
  bankName: string;
}

export async function createVirtualAccount(
  params: CreateVirtualAccountParams,
): Promise<VirtualAccountResult> {
  // Graceful local fallback so the app is usable before credentials are set.
  if (!nombaConfigured()) {
    console.warn("[nomba] not configured — issuing a synthetic virtual account for", params.accountRef);
    return {
      accountRef: params.accountRef,
      accountNumber: syntheticNuban(params.accountRef),
      bankName: "Nomba (sandbox stub)",
    };
  }
  const body: Record<string, unknown> = {
    accountRef: params.accountRef,
    accountName: params.accountName,
    currency: "NGN",
  };
  if (params.bvn) body.bvn = params.bvn;
  if (params.expiryDate) body.expiryDate = params.expiryDate;
  if (params.expectedAmountNaira != null) body.expectedAmount = params.expectedAmountNaira;

  const json = await nombaFetch("/v1/accounts/virtual", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const d = json.data;
  return {
    accountRef: d.accountRef,
    accountNumber: d.bankAccountNumber,
    bankName: d.bankName,
  };
}

export async function fetchVirtualAccount(accountNumber: string) {
  return nombaFetch(`/v1/accounts/virtual/${accountNumber}`);
}

// ---------- Transfers / Payouts ----------
export interface TransferParams {
  amountNaira: number;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  merchantTxRef: string; // idempotency key, unique per payout
  senderName?: string;
  narration?: string;
}

export interface TransferResult {
  id: string; // Nomba transfer id
  status: "SUCCESS" | "PENDING_BILLING" | string;
}

export async function transferToBank(params: TransferParams): Promise<TransferResult> {
  if (!nombaConfigured()) {
    console.warn("[nomba] not configured — simulating a successful payout", params.merchantTxRef);
    return { id: `SIM-${params.merchantTxRef}`, status: "SUCCESS" };
  }
  const json = await nombaFetch("/v2/transfers/bank", {
    method: "POST",
    body: JSON.stringify({
      amount: params.amountNaira,
      accountNumber: params.accountNumber,
      accountName: params.accountName,
      bankCode: params.bankCode,
      merchantTxRef: params.merchantTxRef,
      senderName: params.senderName,
      narration: params.narration,
    }),
  });
  return { id: json.data?.id, status: json.data?.status };
}

// ---------- Transactions (verify / backfill) ----------
export async function fetchTransactions(params?: { limit?: number; offset?: number }) {
  const q = new URLSearchParams();
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.offset) q.set("offset", String(params.offset));
  const suffix = q.toString() ? `?${q.toString()}` : "";
  return nombaFetch(`/v1/transactions/accounts${suffix}`);
}

// ---------- Webhook signature ----------
/**
 * Verify a `payment_success`/`payout_*` webhook. Nomba signs the colon-joined
 * string event_type:requestId:userId:walletId:transactionId:type:time:responseCode:nomba-timestamp
 * with HmacSHA256 using the dashboard signature key, delivered in `nomba-signature`.
 */
export function verifyNombaSignature(payload: any, signature: string, nombaTimestamp: string): boolean {
  if (!WEBHOOK_KEY || !signature) return false;
  const tx = payload?.data?.transaction ?? {};
  const merchant = payload?.data?.merchant ?? {};
  const signed = [
    payload?.event_type,
    payload?.requestId,
    merchant?.userId,
    merchant?.walletId,
    tx?.transactionId,
    tx?.type,
    tx?.time,
    tx?.responseCode,
    nombaTimestamp,
  ].join(":");
  const expected = createHmac("sha256", WEBHOOK_KEY).update(signed).digest("hex");
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ---------- helpers ----------
function syntheticNuban(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return String(2_000_000_000 + (h % 8_000_000_000)).slice(0, 10);
}
