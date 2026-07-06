import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime, d as DialogClose, f as DialogContent, g as DialogTitle, h as DialogPortal, m as DialogOverlay, p as DialogDescription, u as Dialog } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-BkEeRci-.mjs";
import { D as Bell, E as Check, I as EllipsisVertical, M as LoaderCircle, f as Plus, h as Link2, i as Wallet, l as Send, n as X, o as Trash2, p as Pencil, w as ChevronRight, x as Circle } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent$1, o as DialogTitle$1, s as DialogTrigger, t as Dialog$1 } from "./dialog-Bk9pEsHD.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { i as useGatehouse, t as store } from "./store-BHHuWGN2.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as formatDate } from "./format-DyUNyznX.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-CmIv1W53.mjs";
import { t as AccountNumber } from "./account-number-fopwu6AS.mjs";
import { t as StatusPill } from "./status-pill-BPbzTGYK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/add-unit-dialog-DMMoD7c8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function UnitDetailSheet({ unitId, onOpenChange }) {
	const { units } = useGatehouse();
	const unit = units.find((u) => u.id === unitId);
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const [confirmOpen, setConfirmOpen] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setEditing(false);
		setMenuOpen(false);
		setConfirmOpen(false);
	}, [unitId]);
	function startEdit() {
		setEmail(unit?.email ?? "");
		setPhone(unit?.phone ?? "");
		setEditing(true);
	}
	async function saveContact() {
		if (!unit) return;
		const nextEmail = email.trim();
		const nextPhone = phone.trim();
		if (nextEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
			toast.error("Enter a valid email address");
			return;
		}
		setSaving(true);
		try {
			await store.updateUnit(unit.id, {
				email: nextEmail || void 0,
				phone: nextPhone
			});
			toast.success("Contact updated");
			setEditing(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not update unit");
		} finally {
			setSaving(false);
		}
	}
	async function removeUnit() {
		if (!unit) return;
		setDeleting(true);
		try {
			await store.deleteUnit(unit.id);
			toast.success(`${unit.label} removed`);
			onOpenChange(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not remove unit");
		} finally {
			setDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!unitId,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			className: "w-full sm:max-w-xl overflow-y-auto p-0",
			onInteractOutside: (e) => {
				if (menuOpen || confirmOpen) e.preventDefault();
			},
			children: unit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
					open: menuOpen,
					onOpenChange: setMenuOpen,
					modal: false,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							className: "absolute right-11 top-2.5 z-20 h-8 w-8 text-muted-foreground",
							"aria-label": "Unit actions",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { size: 16 })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: startEdit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
								size: 14,
								className: "mr-2"
							}), " Edit contact"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onSelect: () => setConfirmOpen(true),
							className: "text-destructive focus:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								size: 14,
								className: "mr-2"
							}), " Delete unit"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "border-b border-border p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-start justify-between gap-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "font-display text-2xl",
									children: unit.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: unit.status })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-ink",
								children: [
									unit.occupant,
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize",
										children: unit.occupantType
									})
								]
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
							open: confirmOpen,
							onOpenChange: setConfirmOpen,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
								"Remove ",
								unit.label,
								"?"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
								"This removes ",
								unit.label,
								" (",
								unit.occupant,
								") from the estate. Payment history is kept for the record, but the unit will no longer appear in your lists. The virtual account is left untouched."
							] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
								disabled: deleting,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
								onClick: (e) => {
									e.preventDefault();
									removeUnit();
								},
								className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
								children: deleting ? "Removing…" : "Remove unit"
							})] })] })
						}),
						editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-3 rounded-lg border border-border p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "resident@email.com"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									inputMode: "tel",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									placeholder: "08012345678"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										disabled: saving,
										onClick: () => setEditing(false),
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										disabled: saving,
										onClick: saveContact,
										children: [saving && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
											size: 14,
											className: "mr-1.5 animate-spin"
										}), saving ? "Saving…" : "Save"]
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-0.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: unit.email || "No email on file" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: unit.phone || "No phone on file" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg bg-brand-tint p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] uppercase tracking-wide text-brand",
								children: "Receiving account"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountNumber, {
									value: unit.accountNumber,
									size: "lg"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-3 gap-3 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Owed",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: unit.balance }),
									tone: unit.balance > 0 ? "warn" : "ok"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Credit",
									value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: unit.credit }),
									tone: unit.credit > 0 ? "credit" : "muted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									label: "Last paid",
									value: unit.lastPaymentAt ? formatDate(unit.lastPaymentAt) : "—",
									tone: "muted"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => toast.success(`Statement sent to ${unit.occupant}`),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
										size: 14,
										className: "mr-1.5"
									}), " Send statement"]
								}),
								unit.balance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => toast.success(`Payment reminder sent to ${unit.occupant} — owes ₦${unit.balance.toLocaleString("en-NG")}`),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
										size: 14,
										className: "mr-1.5"
									}), " Send reminder"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => {
										navigator.clipboard?.writeText(`${window.location.origin}/r/${unit.id}`);
										toast.success("Resident link copied");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, {
										size: 14,
										className: "mr-1.5"
									}), " Copy resident link"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => toast("Record cash payment — opens form in real app"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, {
										size: 14,
										className: "mr-1.5"
									}), " Record payment"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: "Arrears aging"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 gap-2 text-center",
							children: [
								{
									l: "0–30",
									v: unit.balance
								},
								{
									l: "31–60",
									v: 0
								},
								{
									l: "61–90",
									v: 0
								},
								{
									l: "90+",
									v: 0
								}
							].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [b.l, " days"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-sm font-medium tabular text-ink",
									children: ["₦", b.v.toLocaleString("en-NG")]
								})]
							}, b.l))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground",
							children: "Transaction ledger"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border border-border overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-secondary text-left text-xs uppercase tracking-wide text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Description"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium text-right",
											children: "Amount"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium text-right",
											children: "Balance"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: unit.ledger.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted-foreground tabular",
											children: formatDate(l.date)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-ink",
												children: l.description
											}), l.allocation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: l.allocation
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerStatus, { entry: l })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right tabular",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: Math.abs(l.amount) })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-right tabular text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: l.running })
										})
									]
								}, l.id)) })]
							})
						})
					]
				})
			] })
		})
	});
}
function LedgerStatus({ entry }) {
	if (entry.kind === "payment") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
		kind: "paid",
		children: "Received"
	});
	if (entry.kind === "credit") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: "credit" });
	if (entry.settled === "paid") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: "paid" });
	if (entry.settled === "partial") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: "partial" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
		kind: "overdue",
		children: "Unpaid"
	});
}
function Stat({ label, value, tone }) {
	const colors = {
		ok: "bg-[#ECFDF5] text-[#047857]",
		warn: "bg-[#FFFBEB] text-[#B45309]",
		credit: "bg-[#EEF2FF] text-[#4338CA]",
		muted: "bg-secondary text-ink"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-lg p-3 ${colors}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] uppercase tracking-wide opacity-80",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-sm font-semibold tabular",
			children: value
		})]
	});
}
function blockFromLabel(label) {
	const match = label.trim().match(/^[A-Za-z]+/);
	return (match ? match[0] : "A").toUpperCase();
}
var emptyRow = () => ({
	label: "",
	occupant: "",
	phone: ""
});
function AddUnitDialog({ children }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [rows, setRows] = (0, import_react.useState)([emptyRow()]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const validRows = rows.filter((r) => r.label.trim() && r.occupant.trim());
	const reset = () => setRows([emptyRow()]);
	const update = (i, patch) => setRows((rs) => rs.map((r, j) => j === i ? {
		...r,
		...patch
	} : r));
	async function submit() {
		if (validRows.length === 0) return;
		setBusy(true);
		try {
			const { succeeded, failed } = await store.addUnits(validRows.map((r) => ({
				label: r.label.trim(),
				block: blockFromLabel(r.label),
				occupantName: r.occupant.trim(),
				occupantPhone: r.phone.trim() || void 0
			})));
			toast.success(`${succeeded.length} unit${succeeded.length === 1 ? "" : "s"} added — account numbers minted`);
			if (failed.length > 0) toast.error(`${failed.length} failed — ${failed.map((f) => `${f.unit}: ${f.reason}`).join("; ")}`);
			reset();
			setOpen(false);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not add units");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog$1, {
		open,
		onOpenChange: (v) => {
			setOpen(v);
			if (!v) reset();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
			className: "sm:max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
					className: "font-display",
					children: "Add units"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[90px_1fr_130px_auto] gap-2 px-0.5 text-xs font-medium text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unit" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Occupant" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Phone" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-9" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-[50vh] space-y-2 overflow-y-auto pr-0.5",
						children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[90px_1fr_130px_auto] gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									autoFocus: i === 0,
									placeholder: "A1",
									value: r.label,
									onChange: (e) => update(i, { label: e.target.value })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "Jane Doe",
									value: r.occupant,
									onChange: (e) => update(i, { occupant: e.target.value })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "08012345678",
									value: r.phone,
									onChange: (e) => update(i, { phone: e.target.value })
								}),
								i === rows.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "icon",
									onClick: () => setRows([...rows, emptyRow()]),
									"aria-label": "Add another unit",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									onClick: () => setRows(rows.filter((_, j) => j !== i)),
									"aria-label": "Remove unit",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
								})
							]
						}, i))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						setOpen(false);
						reset();
					},
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					disabled: validRows.length === 0 || busy,
					onClick: submit,
					children: busy ? "Adding…" : validRows.length <= 1 ? "Add unit" : `Add ${validRows.length} units`
				})] })
			]
		})]
	});
}
//#endregion
export { UnitDetailSheet as n, AddUnitDialog as t };
