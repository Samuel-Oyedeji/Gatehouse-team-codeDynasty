import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as useAccountBalanceQuery } from "./store-BHHuWGN2.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { i as relTime } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-balance-card-Dow5yAOB.js
var import_jsx_runtime = require_jsx_runtime();
function KpiCard({ label, value, sub, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-display text-3xl font-semibold tabular text-ink",
				children: value
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground tabular",
				children: sub
			}),
			children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children
			})
		]
	});
}
function AccountBalanceCard() {
	const { data, isLoading } = useAccountBalanceQuery();
	const ready = data?.available && data.amountNaira != null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
		label: "Nomba account balance",
		value: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: data.amountNaira }) : isLoading ? "…" : "—",
		sub: ready ? `Live settlement-account float · updated ${relTime(data.asOf ?? Date.now())}` : isLoading ? "Fetching from Nomba…" : "Unavailable — check Nomba connection"
	});
}
//#endregion
export { KpiCard as n, AccountBalanceCard as t };
