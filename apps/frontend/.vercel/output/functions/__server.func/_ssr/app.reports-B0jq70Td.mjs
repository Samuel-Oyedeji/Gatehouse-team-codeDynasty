import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { h as Link2, y as Download } from "../_libs/lucide-react.mjs";
import { i as useGatehouse } from "./store-BT0801Va.mjs";
import { t as SectionHeader } from "./section-header-BXDMGI7z.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-Cdw7O0na.mjs";
import { r as ngn } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as KpiCard, t as AccountBalanceCard } from "./account-balance-card-VaIcuHd4.mjs";
import { t as StatusPill } from "./status-pill-BPbzTGYK.mjs";
import { a as Line, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as CartesianGrid, r as YAxis, s as Bar, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.reports-B0jq70Td.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const { units, vendors, payouts, payments, estate, cycle } = useGatehouse();
	const collected = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0), 0);
	const spent = payouts.reduce((a, p) => a + p.amount, 0);
	const arrears = units.filter((u) => u.balance > 0).sort((a, b) => b.balance - a.balance);
	const byCategory = vendors.map((v) => ({
		name: v.category,
		amount: payouts.filter((p) => p.vendorId === v.id).reduce((a, p) => a + p.amount, 0)
	}));
	const byDay = /* @__PURE__ */ new Map();
	for (const p of payments) {
		if (p.status === "exception") continue;
		const d = new Date(p.timestamp);
		const key = `${d.getMonth() + 1}/${d.getDate()}`;
		byDay.set(key, (byDay.get(key) ?? 0) + p.amount);
	}
	const trend = [...byDay.entries()].slice(-8).map(([week, amount]) => ({
		week,
		collected: amount
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		title: `Reports — ${cycle}`,
		sub: "Money in versus money out, plus a public view for residents."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "financials",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "financials",
				children: "Estate financials"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "public",
				children: "Public transparency view"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "financials",
				className: "mt-4 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
								label: "Total collected",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: collected })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
								label: "Total spent",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: spent })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
								label: "Balance",
								value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: collected - spent }),
								sub: "Expected — collected minus spent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountBalanceCard, {})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-base font-semibold mb-4",
								children: "Spending by category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 240,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: byCategory,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#E2E8F0",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "name",
											stroke: "#64748B",
											fontSize: 12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "#64748B",
											fontSize: 12,
											tickFormatter: (v) => `₦${(v / 1e3).toFixed(0)}k`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => ngn(v) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "amount",
											fill: "#0F766E",
											radius: [
												4,
												4,
												0,
												0
											]
										})
									]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-base font-semibold mb-4",
								children: "Collection over time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 240,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: trend,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#E2E8F0",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "week",
											stroke: "#64748B",
											fontSize: 12
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "#64748B",
											fontSize: 12,
											tickFormatter: (v) => `₦${(v / 1e3).toFixed(0)}k`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => ngn(v) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "collected",
											stroke: "#0F766E",
											strokeWidth: 2,
											dot: { fill: "#0F766E" }
										})
									]
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "overflow-hidden p-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-5 py-3 border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: "Arrears report"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => toast.success("Arrears CSV exported"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
									size: 14,
									className: "mr-1.5"
								}), "Export"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-2.5 font-medium",
										children: "Unit"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-2.5 font-medium",
										children: "Occupant"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-2.5 font-medium",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-4 py-2.5 font-medium text-right",
										children: "Owed"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [arrears.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium",
										children: u.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: u.occupant
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: u.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right tabular",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: u.balance })
									})
								]
							}, u.id)), arrears.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 4,
								className: "text-center py-8 text-muted-foreground",
								children: "No outstanding balances. Beautiful."
							}) })] })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "public",
				className: "mt-4 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							navigator.clipboard?.writeText(`${window.location.origin}/public`);
							toast.success("Public link copied");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
							size: 14,
							className: "mr-1.5"
						}), "Copy public link"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-8 max-w-2xl mx-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								estate.name,
								" · ",
								cycle
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-semibold mt-2",
							children: "Where your dues went"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-ink leading-relaxed",
							children: [
								"This quarter, residents paid ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold tabular",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: collected })
								}),
								" ",
								"in service charges. We spent ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold tabular",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: spent })
								}),
								" ",
								"keeping the estate running."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 space-y-3",
							children: byCategory.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [Math.round(c.amount / spent * 100), "% of spending"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-lg font-semibold tabular",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: c.amount })
								})]
							}, c.name))
						})
					]
				})]
			})
		]
	})] });
}
//#endregion
export { ReportsPage as component };
