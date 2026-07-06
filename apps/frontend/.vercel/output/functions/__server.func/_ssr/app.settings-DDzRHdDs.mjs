import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { F as updateFeeStructureFn, P as updateEstateFn, S as getQueryClient } from "./api-BUANDe_q.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { l as useGatehouse } from "./store-Crsze7j9.mjs";
import { R as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-BIISrCij.mjs";
import { t as SectionHeader } from "./dist-BI4ddG03.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-2-MLY1H8.mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-CEgUpBXp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.settings-DDzRHdDs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function SettingsPage() {
	const { estate, allocationRule } = useGatehouse();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, { title: "Settings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "profile",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "profile",
					children: "Estate"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "rules",
					children: "Allocation rules"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "notif",
					children: "Notifications"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "team",
					children: "Team"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "nomba",
					children: "Nomba"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "profile",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EstateTab, { initial: {
					name: estate.name,
					address: estate.address,
					city: estate.city
				} }, estate.id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "rules",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulesTab, { initial: allocationRule }, allocationRule)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "notif",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 max-w-2xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bill notification" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							defaultValue: "Hi {name}, your {cycle} service charge of ₦{amount} is now due. Transfer to {account} from any bank app — your payment is recorded automatically.",
							rows: 3
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment receipt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							defaultValue: "Thank you {name}. We received ₦{amount} for {cycle}. {remaining_message}",
							rows: 3
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Arrears reminder" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							defaultValue: "Hi {name}, you still owe ₦{balance} on {cycle}. Transfer to {account} to settle.",
							rows: 3
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => toast.success("Templates updated"),
							children: "Save templates"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "team",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 max-w-xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: "Estate treasurer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground",
								children: "Treasurer · you"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Invite a co-manager by email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { placeholder: "name@email.com" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => toast.success("Invitation sent"),
							children: "Send invite"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "nomba",
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6 max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "text-brand h-6 w-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: "Connected"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								"Payments settle directly into ",
								estate.name,
								"'s Nomba business account."
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "mt-4",
						onClick: () => toast("Manage connection in Nomba dashboard"),
						children: "Manage connection"
					})]
				})
			})
		]
	})] });
}
function EstateTab({ initial }) {
	const [name, setName] = (0, import_react.useState)(initial.name);
	const [address, setAddress] = (0, import_react.useState)(initial.address);
	const [city, setCity] = (0, import_react.useState)(initial.city);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			await updateEstateFn({ data: {
				name,
				address,
				city
			} });
			await getQueryClient().invalidateQueries();
			toast.success("Estate details saved");
		} catch {
			toast.error("Could not save");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-xl space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estate name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: name,
				onChange: (e) => setName(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: address,
				onChange: (e) => setAddress(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City / State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: city,
				onChange: (e) => setCity(e.target.value)
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: save,
				disabled: busy,
				children: busy ? "Saving…" : "Save changes"
			})
		]
	});
}
function RulesTab({ initial }) {
	const [value, setValue] = (0, import_react.useState)(initial === "DUES_FIRST" ? "dues" : "oldest");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function save() {
		setBusy(true);
		try {
			await updateFeeStructureFn({ data: { allocationRule: value === "dues" ? "DUES_FIRST" : "OLDEST_FIRST" } });
			await getQueryClient().invalidateQueries();
			toast.success("Allocation rule saved");
		} catch {
			toast.error("Could not save");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6 max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				className: "mb-3 block",
				children: "When a payment arrives and the unit owes more than one thing, apply it…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
				value,
				onValueChange: setValue,
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioOption, {
					value: "oldest",
					title: "Oldest charge first",
					desc: "Clears the most overdue item before newer ones. Recommended."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioOption, {
					value: "dues",
					title: "Dues before levies",
					desc: "Always settle the recurring service charge first, then one-off levies."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				onClick: save,
				disabled: busy,
				children: busy ? "Saving…" : "Save"
			})
		]
	});
}
function RadioOption({ value, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-start gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
			value,
			className: "mt-0.5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-medium text-ink",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted-foreground",
			children: desc
		})] })]
	});
}
//#endregion
export { SettingsPage as component };
