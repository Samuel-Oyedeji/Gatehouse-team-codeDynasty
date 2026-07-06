// Thin HTTP client for the NestJS backend. The JWT and current estate id live in
// localStorage (client-only); server-side loaders only call public endpoints.
const API_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:3000";
const TOKEN_KEY = "gatehouse_token";
const ESTATE_KEY = "gatehouse_estate";

export function getToken(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}
export function setToken(token: string) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}
export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ESTATE_KEY);
  }
}
export function getEstateId(): string | null {
  return typeof window !== "undefined" ? localStorage.getItem(ESTATE_KEY) : null;
}
export function setEstateId(id: string) {
  if (typeof window !== "undefined") localStorage.setItem(ESTATE_KEY, id);
}

export function apiUrl(path: string): string {
  return `${API_URL}${path}`;
}

type Method = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

/** Calls the NestJS API and unwraps the `{ message, data }` envelope to `data`. */
export async function request<T = unknown>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(apiUrl(path), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = json?.message ?? res.statusText;
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  }
  return (json && typeof json === "object" && "data" in json ? json.data : json) as T;
}
