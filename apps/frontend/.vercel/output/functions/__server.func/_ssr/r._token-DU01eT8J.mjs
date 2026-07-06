import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { s as ShieldCheck, y as Download } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as formatDate } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { t as AccountNumber } from "./account-number-fopwu6AS.mjs";
import { t as StatusPill } from "./status-pill-BPbzTGYK.mjs";
import { t as Route } from "./r._token-Dfn3yaCh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r._token-DU01eT8J.js
var import_jsx_runtime = require_jsx_runtime();
function ResidentPage() {
	const statement = Route.useLoaderData();
	if (!statement) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-canvas px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-semibold",
			children: "Statement not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "This link is invalid or has expired."
		})] })
	});
	const { estate, unit, accountNumber, transparency } = statement;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-canvas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md mx-auto px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						estate.name,
						" · ",
						estate.city
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-display text-xl font-semibold mt-0.5",
					children: [
						unit.label,
						" — ",
						unit.occupant
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "max-w-md mx-auto px-5 py-6 space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: "You owe"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-4xl font-semibold tabular text-ink",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: unit.balance })
						}),
						unit.credit > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatusPill, {
								kind: "credit",
								children: ["Credit: ₦", unit.credit.toLocaleString("en-NG")]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-lg bg-brand-tint p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-wide text-brand",
									children: "Pay your dues — transfer to"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountNumber, {
										value: accountNumber,
										size: "lg"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-ink leading-relaxed",
									children: "Transfer to this account from any bank app. Your payment is recorded automatically."
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-base font-semibold",
							children: "Your statement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: unit.status })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border text-sm",
						children: unit.ledger.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "py-3 flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-ink",
									children: l.description
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground tabular",
									children: [formatDate(l.date), l.allocation ? ` · ${l.allocation}` : ""]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `tabular font-medium ${l.kind === "payment" ? "text-[#047857]" : "text-ink"}`,
									children: [l.kind === "payment" ? "−" : "", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: Math.abs(l.amount) })]
								}), l.kind === "payment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "mt-0.5 text-xs text-brand inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { size: 11 }), "Receipt"]
								})]
							})]
						}, l.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-base font-semibold",
							children: "Where the estate's money went"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								"This cycle, residents paid ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular font-medium text-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: transparency.collected })
								}),
								". We spent ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular font-medium text-ink",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: transparency.spent })
								}),
								" keeping ",
								estate.name,
								" running."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2.5",
							children: transparency.byCategory.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ink",
									children: c.category
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular font-medium",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: c.amount })
								})]
							}, c.category))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 12,
							className: "text-brand"
						}),
						"Powered by Gatehouse · Funds settle into ",
						estate.name,
						"'s own account."
					]
				})
			]
		})]
	});
}
//#endregion
export { ResidentPage as component };
