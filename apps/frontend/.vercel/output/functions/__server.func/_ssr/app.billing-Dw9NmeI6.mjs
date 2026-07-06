import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as getQueryClient, d as createLevyFn, s as createBillingRunFn } from "./api-4JFegvrj.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { E as Check, f as Plus } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, s as DialogTrigger, t as Dialog } from "./dialog-Bk9pEsHD.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as useGatehouse } from "./store-BHHuWGN2.mjs";
import { t as SectionHeader } from "./section-header-BXDMGI7z.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { t as formatDate } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as RadioGroupItem, t as RadioGroup } from "./radio-group-BJ3sdkEm.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.billing-Dw9NmeI6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
function UnitPicker({ units, groups, value, onChange }) {
	const sections = (0, import_react.useMemo)(() => {
		const known = new Set(groups.map((g) => g.id));
		const byGroup = /* @__PURE__ */ new Map();
		const ungrouped = [];
		for (const u of units) if (u.groupId && known.has(u.groupId)) {
			const list = byGroup.get(u.groupId) ?? [];
			list.push(u);
			byGroup.set(u.groupId, list);
		} else ungrouped.push(u);
		const result = groups.filter((g) => byGroup.has(g.id)).map((g) => ({
			id: g.id,
			name: g.name,
			units: byGroup.get(g.id)
		}));
		if (ungrouped.length) result.push({
			id: "__ungrouped",
			name: "Ungrouped",
			units: ungrouped
		});
		return result;
	}, [units, groups]);
	const isAll = value === null;
	const chosen = value ?? /* @__PURE__ */ new Set();
	function toggleUnit(id) {
		const next = new Set(chosen);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		onChange(next);
	}
	function toggleGroup(groupUnits) {
		const next = new Set(chosen);
		const allOn = groupUnits.every((u) => next.has(u.id));
		for (const u of groupUnits) if (allOn) next.delete(u.id);
		else next.add(u.id);
		onChange(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Apply to" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, {
				value: isAll ? "all" : "select",
				onValueChange: (v) => onChange(v === "all" ? null : /* @__PURE__ */ new Set()),
				className: "grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
							value: "all",
							id: "apply-all"
						}),
						"All units (",
						units.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
						value: "select",
						id: "apply-select"
					}), "Select units"]
				})]
			}),
			!isAll && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "h-56 rounded-md border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: sections.map((section) => {
						const allOn = section.units.every((u) => chosen.has(u.id));
						const someOn = section.units.some((u) => chosen.has(u.id));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center justify-between gap-2 bg-secondary px-3 py-2 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold uppercase tracking-wide text-ink",
								children: [
									section.name,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"(",
											section.units.length,
											")"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5 text-xs text-muted-foreground",
								children: ["Select all", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: allOn ? true : someOn ? "indeterminate" : false,
									onCheckedChange: () => toggleGroup(section.units)
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "py-1",
							children: section.units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: chosen.has(u.id),
										onCheckedChange: () => toggleUnit(u.id)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: u.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: ["— ", u.occupant || "vacant"]
									})
								]
							}, u.id))
						})] }, section.id);
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted-foreground",
				children: [
					chosen.size,
					" of ",
					units.length,
					" units selected"
				]
			})] })
		]
	});
}
function BillingPage() {
	const { billingRuns, levies, units, groups } = useGatehouse();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		title: "Billing & Charges",
		sub: "Recurring service charge and one-off levies."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "runs",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "runs",
				children: "Billing runs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
				value: "levies",
				children: "Levies"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "runs",
				className: "mt-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateBillingDialog, {
						units,
						groups
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "overflow-hidden p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium",
									children: "Cycle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium",
									children: "Charge"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium",
									children: "Units billed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium text-right",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium text-right",
									children: "Collected"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2.5 font-medium w-40",
									children: "Progress"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [billingRuns.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: "No billing runs yet. Create one to bill your units."
						}) }), billingRuns.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: r.cycle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: "Service charge"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular",
									children: r.unitsBilled
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right tabular",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: r.total })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right tabular",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: r.collected })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: r.total > 0 ? r.collected / r.total * 100 : 0,
										className: "h-1.5"
									})
								})
							]
						}, r.id))] })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
				value: "levies",
				className: "mt-4 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateLevyDialog, {
							units,
							groups
						})
					}),
					levies.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg font-semibold",
								children: l.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: l.amount }),
									" per unit · due ",
									formatDate(l.dueDate),
									l.requireExact ? " · exact amount required" : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display text-lg font-semibold tabular",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: l.collected }),
										" / ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: l.total })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [l.total > 0 ? Math.round(l.collected / l.total * 100) : 0, "% collected"]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: l.total > 0 ? l.collected / l.total * 100 : 0,
							className: "h-1.5 mt-4"
						})]
					}, l.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6 text-sm text-muted-foreground border-dashed",
						children: [
							levies.length === 0 ? "No active levies. " : "Add another levy. ",
							"Click ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ink font-medium",
								children: "Create levy"
							}),
							" above to add one."
						]
					})
				]
			})
		]
	})] });
}
function CreateBillingDialog({ units, groups }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [cycle, setCycle] = (0, import_react.useState)("Q4 2026");
	const [amount, setAmount] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const targetCount = selected ? selected.size : units.length;
	async function submit() {
		setBusy(true);
		try {
			const res = await createBillingRunFn({ data: {
				cycleLabel: cycle,
				chargeAmountNaira: amount,
				dueDate: Date.now() + 14 * 864e5,
				unitIds: selected ? [...selected] : void 0
			} });
			await getQueryClient().invalidateQueries();
			toast.success(`Billing run created — ${res.unitsBilled} residents notified`);
			setOpen(false);
		} catch {
			toast.error("Could not create billing run");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				size: 14,
				className: "mr-1.5"
			}), "Create billing run"] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display",
				children: "Create billing run"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cycle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: cycle,
						onChange: (e) => setCycle(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Charge amount (₦)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: amount,
						onChange: (e) => setAmount(Number(e.target.value))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitPicker, {
						units,
						groups,
						value: selected,
						onChange: setSelected
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: busy || targetCount === 0,
				children: busy ? "Billing…" : `Bill ${targetCount} unit${targetCount === 1 ? "" : "s"}`
			})] })
		] })]
	});
}
function CreateLevyDialog({ units, groups }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [due, setDue] = (0, import_react.useState)("");
	const [exact, setExact] = (0, import_react.useState)(true);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		const amt = Number(amount);
		if (!name.trim() || !amt) return toast.error("Enter a levy name and amount");
		if (selected && selected.size === 0) return toast.error("Select at least one unit");
		setBusy(true);
		try {
			const dueDate = due ? new Date(due).getTime() : Date.now() + 12 * 864e5;
			const res = await createLevyFn({ data: {
				name: name.trim(),
				amountNaira: amt,
				dueDate,
				requireExact: exact,
				unitIds: selected ? [...selected] : void 0
			} });
			await getQueryClient().invalidateQueries();
			toast.success(`Levy created — ${res.unitsBilled} residents notified`);
			setOpen(false);
			setName("");
			setAmount("");
			setDue("");
			setSelected(null);
		} catch {
			toast.error("Could not create levy");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
				size: 14,
				className: "mr-1.5"
			}), "Create levy"] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display",
				children: "Create one-off levy"
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Borehole repair levy"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (₦)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: amount,
						onChange: (e) => setAmount(e.target.value),
						placeholder: "10000"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Due date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: due,
						onChange: (e) => setDue(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							id: "exact",
							checked: exact,
							onChange: (e) => setExact(e.target.checked)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "exact",
							children: "Require exact amount — flag payments into this levy that are not the exact figure."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitPicker, {
						units,
						groups,
						value: selected,
						onChange: setSelected
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: submit,
				disabled: busy,
				children: busy ? "Creating…" : "Create levy"
			})] })
		] })]
	});
}
//#endregion
export { BillingPage as component };
