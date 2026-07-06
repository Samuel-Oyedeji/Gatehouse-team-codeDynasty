import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { l as useGatehouse, r as store } from "./store-Crsze7j9.mjs";
import { R as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as SectionHeader } from "./dist-BI4ddG03.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { i as relTime } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DTEkdcTO.mjs";
import { t as StatusPill } from "./status-pill-D6-twkBW.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BgaUmdAB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.exceptions-C_WHIxwX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExceptionsPage() {
	const { exceptions, payments, units } = useGatehouse();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		title: "Exceptions",
		sub: "Payments that need a quick human decision."
	}), exceptions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-10 w-10 text-brand" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-xl font-semibold",
				children: "All clear."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Every payment is attributed."
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: exceptions.map((ex) => {
			const p = payments.find((x) => x.id === ex.paymentId);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExceptionCard, {
				ex,
				payment: p,
				unit: p.unitId ? units.find((x) => x.id === p.unitId) : null
			}, ex.id);
		})
	})] });
}
function ExceptionCard({ ex, payment, unit }) {
	const { units } = useGatehouse();
	const [target, setTarget] = (0, import_react.useState)(ex.candidateUnitId ?? "");
	const [refundOpen, setRefundOpen] = (0, import_react.useState)(false);
	const refundAmount = payment.surplusAmount ?? payment.amount;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: refundOpen,
		onOpenChange: setRefundOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Confirm refund" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The following transfer will be sent via Nomba immediately and cannot be undone." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border bg-muted/40 p-3 space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Amount"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold tabular text-ink",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: refundAmount })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Recipient"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-ink",
								children: payment.sender
							})]
						}),
						payment.sourceAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-ink tabular",
								children: payment.sourceAccount
							})]
						})
					]
				})]
			})
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: () => {
				store.resolveException(ex.id, "refund");
				toast.success("Refund sent");
			},
			children: "Send refund"
		})] })] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: ex.type }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground tabular",
							children: relTime(payment.timestamp)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-lg font-semibold tabular text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: payment.amount }),
							" from ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans",
								children: payment.sender
							})
						]
					}),
					unit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Received into ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-ink",
								children: unit.label
							}),
							" · ",
							unit.occupant
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-sm text-ink",
						children: ex.suggestion
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 w-72 space-y-2",
				children: [
					ex.type === "overpayment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: () => {
							store.resolveException(ex.id, "credit");
							toast.success("Surplus moved to credit balance");
						},
						children: "Move surplus to credit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						onClick: () => setRefundOpen(true),
						children: "Issue refund"
					})] }),
					ex.type === "duplicate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: () => {
							store.resolveException(ex.id, "duplicate-hold");
							toast.success("Held as duplicate");
						},
						children: "Confirm duplicate, hold"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						onClick: () => {
							store.resolveException(ex.id, "duplicate-keep");
							toast.success("Treated as a separate payment");
						},
						children: "Treat as separate payment"
					})] }),
					ex.type === "misdirected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: target,
						onValueChange: setTarget,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose correct unit" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
							value: u.id,
							children: [
								u.label,
								" — ",
								u.occupant
							]
						}, u.id)) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						disabled: !target,
						onClick: () => {
							store.resolveException(ex.id, "reassign", target);
							toast.success("Reassigned to the correct unit");
						},
						children: "Reassign payment"
					})] }),
					ex.type === "third_party" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: () => {
							store.resolveException(ex.id, "attribute");
							toast.success("Attributed and tagged as paid on behalf");
						},
						children: [
							"Attribute to ",
							unit?.label,
							" (paid on behalf)"
						]
					}),
					ex.type === "reversal" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: () => {
							store.resolveException(ex.id, "acknowledge");
							toast.success("Reversal acknowledged");
						},
						children: "Acknowledge (balance adjusted)"
					})
				]
			})]
		})
	})] });
}
//#endregion
export { ExceptionsPage as component };
