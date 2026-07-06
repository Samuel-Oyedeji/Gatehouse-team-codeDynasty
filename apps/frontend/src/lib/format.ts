export function ngn(n: number): string {
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(Math.round(n)).toLocaleString("en-NG");
  return `${sign}₦${v}`;
}

export function formatNuban(acc: string): string {
  const s = acc.replace(/\D/g, "").padStart(10, "0").slice(0, 10);
  return `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7, 10)}`;
}

export function relTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}