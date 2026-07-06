//#region node_modules/.nitro/vite/services/ssr/assets/format-DyUNyznX.js
function ngn(n) {
	return `${n < 0 ? "-" : ""}₦${Math.abs(Math.round(n)).toLocaleString("en-NG")}`;
}
function formatNuban(acc) {
	const s = acc.replace(/\D/g, "").padStart(10, "0").slice(0, 10);
	return `${s.slice(0, 4)} ${s.slice(4, 7)} ${s.slice(7, 10)}`;
}
function relTime(ts) {
	const diff = Date.now() - ts;
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "just now";
	if (m < 60) return `${m} min ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return `${Math.floor(h / 24)}d ago`;
}
function formatDate(ts) {
	return new Date(ts).toLocaleDateString("en-NG", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
//#endregion
export { relTime as i, formatNuban as n, ngn as r, formatDate as t };
