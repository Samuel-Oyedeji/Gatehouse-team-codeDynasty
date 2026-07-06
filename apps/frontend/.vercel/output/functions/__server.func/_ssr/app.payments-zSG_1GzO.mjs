import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { u as Search, y as Download } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as useGatehouse } from "./store-BHHuWGN2.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as SectionHeader } from "./section-header-BXDMGI7z.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as formatDate } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as StatusPill } from "./status-pill-BPbzTGYK.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.payments-zSG_1GzO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentsPage() {
	const { payments, units } = useGatehouse();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => payments.filter((p) => status === "all" || p.status === status).filter((p) => !q || p.sender.toLowerCase().includes(q.toLowerCase())), [
		payments,
		q,
		status
	]);
	const unitLookup = (0, import_react.useMemo)(() => new Map(units.map((u) => [u.id, u])), [units]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		title: "Payments",
		sub: "Every incoming transfer across the estate, newest first."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden p-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-3 p-4 border-b border-border bg-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[220px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						size: 14,
						className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by sender",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: status,
					onValueChange: setStatus,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-44",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All statuses"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "matched",
							children: "Matched"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "partial",
							children: "Partial"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "overpayment",
							children: "Overpayment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "exception",
							children: "Exception"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => toast.success("CSV export ready"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						size: 14,
						className: "mr-1.5"
					}), "Export"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Unit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Sender"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium text-right",
							children: "Amount"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2.5 font-medium",
							children: "Allocation"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((p) => {
					const u = p.unitId ? unitLookup.get(p.unitId) : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border hover:bg-secondary/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground tabular",
								children: formatDate(p.timestamp)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: u ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: u.label
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/app/exceptions",
									className: "text-[#BE123C] font-medium",
									children: "Unmatched →"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: p.sender
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right tabular",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: p.amount })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: p.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground text-xs",
								children: p.allocation
							})
						]
					}, p.id);
				}), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "text-center py-12 text-muted-foreground",
					children: "No payments match those filters."
				}) })] })]
			})
		})]
	})] });
}
//#endregion
export { PaymentsPage as component };
