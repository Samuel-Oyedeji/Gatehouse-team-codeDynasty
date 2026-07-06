import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { P as FilePlusCorner, f as Plus, i as Wallet, l as Send, o as Trash2 } from "../_libs/lucide-react.mjs";
import { c as DialogFooter, f as DialogTitle, i as DialogContent, l as DialogHeader, t as Dialog } from "./dialog-B3JjP9jO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-BIISrCij.mjs";
import { i as useGatehouse, t as store } from "./store-BHHuWGN2.mjs";
import { t as SectionHeader } from "./section-header-BXDMGI7z.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { i as relTime } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { t as Progress } from "./progress-oU-Y82sD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as KpiCard, t as AccountBalanceCard } from "./account-balance-card-Dow5yAOB.mjs";
import { n as UnitDetailSheet, t as AddUnitDialog } from "./add-unit-dialog-Cpn8swsm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.dashboard-AkD9gSR-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	paid: "border-[#A7F3D0] bg-[#ECFDF5]",
	partial: "border-[#FDE68A] bg-[#FFFBEB]",
	overdue: "border-[#FECDD3] bg-[#FFF1F2]",
	unbilled: "border-border bg-secondary",
	credit: "border-[#C7D2FE] bg-[#EEF2FF]"
};
var DOT = {
	paid: "#10B981",
	partial: "#F59E0B",
	overdue: "#F43F5E",
	unbilled: "#94A3B8",
	credit: "#6366F1"
};
function UnitTile({ unit: u, flashing, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		draggable: true,
		onDragStart: (e) => {
			e.dataTransfer.setData("text/plain", u.id);
			e.dataTransfer.effectAllowed = "move";
		},
		onClick: () => onOpen(u.id),
		className: cn("flex min-w-0 flex-col rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md cursor-grab active:cursor-grabbing", TONE[u.status], flashing && "pulse-flash ring-2 ring-brand"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-2 w-2 shrink-0 rounded-full",
					style: { backgroundColor: DOT[u.status] }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 truncate font-display text-[15px] font-semibold leading-tight text-ink",
					children: u.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 truncate text-xs text-muted-foreground",
				children: u.occupant
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 truncate text-sm font-medium tabular",
				children: u.balance > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-ink",
					children: ["owing ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: u.balance })]
				}) : u.credit > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[#4338CA]",
					children: ["+", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: u.credit })]
				}) : u.status === "unbilled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "not billed"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[#047857]",
					children: "settled"
				})
			})
		]
	});
}
function UnitGroupsPanel({ units, groups, recentlyChanged, onOpenUnit, className }) {
	const [dragOver, setDragOver] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const ungrouped = units.filter((u) => !u.groupId);
	const createGroup = async () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setBusy(true);
		try {
			await store.createGroup(trimmed);
			toast.success(`Group "${trimmed}" created — drag units in`);
			setName("");
			setCreating(false);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not create group");
		} finally {
			setBusy(false);
		}
	};
	const deleteGroup = async (id, gName) => {
		try {
			await store.deleteGroup(id);
			toast(`Group "${gName}" removed`);
		} catch (e) {
			toast.error(`Couldn't remove ${gName} — restored it`, { description: e instanceof Error ? e.message : void 0 });
		}
	};
	const assign = async (unitId, groupId) => {
		const u = units.find((x) => x.id === unitId);
		if (!u || (u.groupId ?? null) === groupId) return;
		try {
			await store.assignUnitGroup(unitId, groupId);
		} catch (e) {
			toast.error(`Couldn't move ${u.label} — put it back`, { description: e instanceof Error ? e.message : void 0 });
		}
	};
	const Tile = ({ u }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitTile, {
		unit: u,
		flashing: !!recentlyChanged[u.id],
		onOpen: onOpenUnit
	});
	const dropProps = (zoneId, groupId) => ({
		onDragOver: (e) => {
			e.preventDefault();
			setDragOver(zoneId);
		},
		onDragLeave: (e) => {
			if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null);
		},
		onDrop: (e) => {
			e.preventDefault();
			const id = e.dataTransfer.getData("text/plain");
			if (id) assign(id, groupId);
			setDragOver(null);
		}
	});
	const gridCls = "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-6 gap-2";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("p-6", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold",
					children: "Unit status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs text-muted-foreground md:inline",
						children: "Drag a unit into a group · click to open its statement."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddUnitDialog, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						className: "mr-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
							size: 14,
							className: "mr-1"
						}), "Add unit"]
					}) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				...dropProps("ungrouped", null),
				className: cn("rounded-xl border border-transparent p-2 -m-2 transition-colors", dragOver === "ungrouped" && "border-brand bg-brand-tint/40"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium text-ink",
						children: "Ungrouped"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [ungrouped.length, " units"]
					})]
				}), ungrouped.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: gridCls,
					children: ungrouped.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { u }, u.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground py-3",
					children: "Every unit is assigned to a group."
				})]
			}),
			groups.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-4",
				children: groups.map((g) => {
					const members = units.filter((u) => u.groupId === g.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						...dropProps(g.id, g.id),
						className: cn("rounded-xl border border-border p-3 transition-colors", dragOver === g.id && "border-brand bg-brand-tint/40"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-medium text-ink",
									children: g.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [members.length, " units"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => void deleteGroup(g.id, g.name),
									className: "ml-auto text-muted-foreground hover:text-[#F43F5E] transition-colors",
									title: "Delete group",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
								})
							]
						}), members.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: gridCls,
							children: members.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, { u }, u.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground py-3",
							children: "Drag units here to add them."
						})]
					}, g.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setCreating(true),
				className: "mt-4 flex h-24 w-44 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 20 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: "Create group"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: creating,
				onOpenChange: (v) => {
					setCreating(v);
					if (!v) setName("");
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display",
						children: "Create group"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Group name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						autoFocus: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						onKeyDown: (e) => e.key === "Enter" && void createGroup(),
						placeholder: "e.g. Tower West, Duplexes, Ground floor"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							setCreating(false);
							setName("");
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: !name.trim() || busy,
						onClick: () => void createGroup(),
						children: "Create"
					})] })
				] })
			})
		]
	});
}
function Dashboard() {
	const { units, activity, recentlyChanged, cycle, groups } = useGatehouse();
	const [openUnit, setOpenUnit] = (0, import_react.useState)(null);
	const stats = (0, import_react.useMemo)(() => {
		const billed = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.amount, 0), 0);
		const collected = units.reduce((a, u) => a + u.charges.reduce((b, c) => b + c.paid, 0), 0);
		return {
			billed,
			collected,
			outstanding: billed - collected,
			paid: units.filter((u) => u.status === "paid" || u.status === "credit").length,
			partial: units.filter((u) => u.status === "partial").length,
			unpaid: units.filter((u) => u.status === "overdue").length,
			rate: billed > 0 ? Math.round(collected / billed * 100) : 0
		};
	}, [units]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			title: cycle ? `Dashboard — ${cycle}` : "Dashboard",
			sub: "Every payment lands here the moment it clears.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => toast.success("Billing run started for this cycle"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePlusCorner, {
							size: 14,
							className: "mr-1.5"
						}), "Bill this cycle"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => toast("Record manual payment"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, {
							size: 14,
							className: "mr-1.5"
						}), "Record a payment"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => toast("Pay a vendor"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
							size: 14,
							className: "mr-1.5"
						}), "Pay a vendor"]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Collected this cycle",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: stats.collected }),
					sub: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: stats.billed }),
						" billed"
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Collection rate",
					value: `${stats.rate}%`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: stats.rate,
						className: "h-1.5"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Outstanding",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: stats.outstanding }),
					sub: `${stats.unpaid + stats.partial} units behind`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
					label: "Units status",
					value: `${stats.paid}/${units.length}`,
					sub: `${stats.paid} paid · ${stats.partial} partial · ${stats.unpaid} unpaid`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-2 rounded-full overflow-hidden bg-secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								width: `${stats.paid / units.length * 100}%`,
								backgroundColor: "#10B981"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								width: `${stats.partial / units.length * 100}%`,
								backgroundColor: "#F59E0B"
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
								width: `${stats.unpaid / units.length * 100}%`,
								backgroundColor: "#F43F5E"
							} })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountBalanceCard, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitGroupsPanel, {
				className: "lg:col-span-2",
				units,
				groups,
				recentlyChanged,
				onOpenUnit: setOpenUnit
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold mb-4",
						children: "Activity"
					}),
					activity.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing yet. New payments will appear here as they clear."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-3",
						children: activity.slice(0, 12).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 cursor-pointer rounded-md p-2 -mx-2 hover:bg-secondary",
							onClick: () => a.unitId && setOpenUnit(a.unitId),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1.5 h-2 w-2 rounded-full bg-brand shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-ink",
									children: a.message
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground tabular",
									children: relTime(a.timestamp)
								})]
							})]
						}, a.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 pt-4 border-t border-border text-xs text-muted-foreground",
						children: [
							"Tip: click \"Simulate payment\" in the top bar to fire a fake transfer.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => store.reset(),
								className: "text-brand underline",
								children: "Reset demo"
							})
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnitDetailSheet, {
			unitId: openUnit,
			onOpenChange: (v) => !v && setOpenUnit(null)
		})
	] });
}
//#endregion
export { Dashboard as component };
