import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as getQueryClient, O as provisionUnitsFn, c as createEstateFn, l as createFeesFn, y as fetchOnboardingState } from "./api-4JFegvrj.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { L as CircleCheck, a as Upload, f as Plus, j as Sparkles, n as X } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-BIISrCij.mjs";
import { t as gatehouse_mark_default } from "./gatehouse-mark-DfY7ZYsT.mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Progress } from "./progress-oU-Y82sD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AccountNumber } from "./account-number-fopwu6AS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BQ6LdBMn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-D-_GutfV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnboardingPage() {
	const [step, setStep] = (0, import_react.useState)(null);
	const nav = useNavigate();
	const total = 4;
	const [draft, setDraft] = (0, import_react.useState)({
		unitCount: 60,
		serviceCharge: 0,
		cadence: "quarterly",
		levies: [],
		accounts: []
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		fetchOnboardingState().then((s) => {
			if (!active) return;
			if (s.estate) {
				const units = s.estate.units;
				setDraft((d) => ({
					...d,
					unitCount: units
				}));
			}
			setStep(s.step);
		}).catch(() => {
			if (active) setStep(1);
		});
		return () => {
			active = false;
		};
	}, []);
	if (step === null) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-canvas grid place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative grid place-items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 w-14 rounded-full border-2 border-brand/20 border-t-brand animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: gatehouse_mark_default,
					alt: "Gatehouse logo",
					className: "absolute h-7 w-7 object-contain"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Loading your onboarding…"
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-canvas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-2xl mx-auto px-6 h-16 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gatehouse_mark_default,
						alt: "Gatehouse logo",
						className: "h-7 w-7 object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "Gatehouse"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground tabular",
					children: [
						"Step ",
						step,
						" of ",
						total
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-2xl mx-auto px-6 pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: step / total * 100,
					className: "h-1"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl mx-auto px-6 py-10",
			children: [
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepEstate, {
					draft,
					setDraft,
					next: () => setStep(2)
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepNomba, { next: () => setStep(3) }),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepFees, {
					draft,
					setDraft,
					next: () => setStep(4)
				}),
				step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepUnits, {
					draft,
					setDraft,
					next: async () => {
						await getQueryClient().invalidateQueries();
						nav({ to: "/app/dashboard" });
					}
				})
			]
		})]
	});
}
function StepCard({ title, sub, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: sub
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-4",
				children
			})
		]
	});
}
function StepEstate({ draft, setDraft, next }) {
	const [name, setName] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [count, setCount] = (0, import_react.useState)(draft.unitCount);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onContinue() {
		setBusy(true);
		try {
			await createEstateFn({ data: {
				name,
				address,
				city,
				units: count
			} });
			setDraft({
				...draft,
				unitCount: count
			});
			next();
		} catch {
			toast.error("Could not create estate");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepCard, {
		title: "Create your estate",
		sub: "Tell us about the community you manage.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estate name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: "Maple Court"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: address,
				onChange: (e) => setAddress(e.target.value),
				placeholder: "Plot 14 Admiralty Way"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City / State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: city,
					onChange: (e) => setCity(e.target.value),
					placeholder: "Lekki, Lagos"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Number of units" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: count,
					onChange: (e) => setCount(Number(e.target.value)),
					placeholder: "60"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onContinue,
				className: "w-full",
				disabled: busy,
				children: busy ? "Saving…" : "Continue"
			})
		]
	});
}
function StepNomba({ next }) {
	const [created, setCreated] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
		title: "Create your Nomba subaccount",
		sub: "Gatehouse creates a dedicated Nomba subaccount for your estate, where every unit payment settles.",
		children: !created ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-border bg-secondary p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-ink",
				children: "The subaccount sits under your estate's Nomba business account, so your committee keeps control of the funds. Gatehouse only reads incoming payments so it can attribute them to the right unit."
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => {
				setCreated(true);
				toast.success("Nomba subaccount created");
			},
			className: "w-full",
			children: "Create subaccount"
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg bg-brand-tint border border-[#A7F3D0] p-5 flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "text-brand h-5 w-5 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-medium text-ink",
				children: "Subaccount created."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm text-muted-foreground",
				children: "Payments will settle into your estate's Nomba subaccount."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: next,
			className: "w-full",
			children: "Continue"
		})] })
	});
}
function StepFees({ draft, setDraft, next }) {
	const [serviceCharge, setServiceCharge] = (0, import_react.useState)(draft.serviceCharge);
	const [cadence, setCadence] = (0, import_react.useState)(draft.cadence);
	const [levies, setLevies] = (0, import_react.useState)(draft.levies);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onContinue() {
		setBusy(true);
		try {
			await createFeesFn({ data: { fees: [{
				name: "Service charge",
				type: "service_fee",
				amount: serviceCharge,
				frequency: cadence
			}, ...levies.filter((l) => l.name.trim() && Number(l.amount) > 0).map((l) => ({
				name: l.name.trim(),
				type: "levy",
				amount: Number(l.amount),
				frequency: "one_time"
			}))] } });
			setDraft({
				...draft,
				serviceCharge,
				cadence,
				levies
			});
			next();
		} catch {
			toast.error("Could not save fee structure");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StepCard, {
		title: "Set the fee structure",
		sub: "What residents pay you, and how often.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service charge (₦)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: serviceCharge,
					onChange: (e) => setServiceCharge(Number(e.target.value)),
					placeholder: "0"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cadence" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: cadence,
					onValueChange: setCadence,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "monthly",
							children: "Monthly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "quarterly",
							children: "Quarterly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "annually",
							children: "Annually"
						})
					] })]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-medium mb-2",
				children: "One-off levies (optional)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [levies.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[1fr_140px_auto] gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Levy name",
							value: l.name,
							onChange: (e) => setLevies(levies.map((x, j) => j === i ? {
								...x,
								name: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "Amount",
							value: l.amount,
							onChange: (e) => setLevies(levies.map((x, j) => j === i ? {
								...x,
								amount: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setLevies(levies.filter((_, j) => j !== i)),
							children: "Remove"
						})
					]
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => setLevies([...levies, {
						name: "",
						amount: ""
					}]),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						size: 14,
						className: "mr-1.5"
					}), "Add a levy"]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onContinue,
				className: "w-full",
				disabled: busy,
				children: busy ? "Saving…" : "Continue"
			})
		]
	});
}
function blockFromLabel(label) {
	const match = label.trim().match(/^[A-Za-z]+/);
	return (match ? match[0] : "A").toUpperCase();
}
function downloadUnitsTemplate() {
	const url = URL.createObjectURL(new Blob(["Unit Label,Occupant Name,Phone Number\nA1,Jane Doe,08012345678\nA2,John Smith,08087654321\n"], { type: "text/csv;charset=utf-8;" }));
	const a = document.createElement("a");
	a.href = url;
	a.download = "units-template.csv";
	a.click();
	URL.revokeObjectURL(url);
}
function parseCsvToRows(text) {
	const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	if (lines.length === 0) return [];
	const startIdx = /label|occupant|phone|name/i.test(lines[0]) ? 1 : 0;
	const rows = [];
	for (const line of lines.slice(startIdx)) {
		const [label = "", occupant = "", phone = ""] = line.split(",").map((c) => c.trim());
		if (label || occupant || phone) rows.push({
			label,
			occupant,
			phone
		});
	}
	return rows;
}
function StepUnits({ draft, setDraft, next }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [rows, setRows] = (0, import_react.useState)([{
		label: "",
		occupant: "",
		phone: ""
	}]);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const done = draft.accounts.length > 0;
	const validRows = rows.filter((r) => r.label.trim() && r.occupant.trim());
	function loadFile(file) {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const parsed = parseCsvToRows(String(reader.result ?? ""));
			if (parsed.length === 0) {
				toast.error("No units found in that CSV");
				return;
			}
			setRows(parsed);
			toast.success(`Loaded ${parsed.length} unit${parsed.length === 1 ? "" : "s"} — review and edit below`);
		};
		reader.onerror = () => toast.error("Could not read that file");
		reader.readAsText(file);
	}
	async function provision(units) {
		setBusy(true);
		try {
			const { succeeded, failed } = await provisionUnitsFn({ data: { units } });
			setDraft({
				...draft,
				accounts: succeeded.map((p) => ({
					label: p.label,
					accountNumber: p.accountNumber
				}))
			});
			toast.success(`${succeeded.length} unit account${succeeded.length === 1 ? "" : "s"} provisioned`);
			if (failed.length > 0) toast.error(`${failed.length} failed — ${failed.map((f) => `${f.unit}: ${f.reason}`).join("; ")}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not provision unit accounts");
		} finally {
			setBusy(false);
		}
	}
	function generate() {
		if (validRows.length === 0) return;
		provision(validRows.map((r) => ({
			label: r.label.trim(),
			block: blockFromLabel(r.label),
			occupantName: r.occupant.trim(),
			occupantPhone: r.phone.trim() || void 0
		})));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepCard, {
		title: "Add your units",
		sub: "Each unit gets its own dedicated account number once added.",
		children: !done ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onClick: () => fileRef.current?.click(),
				onDragOver: (e) => {
					e.preventDefault();
					setDragging(true);
				},
				onDragLeave: () => setDragging(false),
				onDrop: (e) => {
					e.preventDefault();
					setDragging(false);
					loadFile(e.dataTransfer.files[0]);
				},
				className: `rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${dragging ? "border-brand bg-brand-tint" : "border-border bg-secondary"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: ".csv,text/csv",
						className: "hidden",
						onChange: (e) => {
							loadFile(e.target.files?.[0]);
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mx-auto h-7 w-7 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 font-medium",
						children: "Drop your CSV here, or click to browse"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Columns: unit label, occupant name, phone number"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						className: "mt-4",
						onClick: (e) => {
							e.stopPropagation();
							downloadUnitsTemplate();
						},
						children: "Download template"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-center text-muted-foreground",
				children: "— or add one at a time —"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[80px_1fr_140px_auto] gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "A1",
							value: r.label,
							onChange: (e) => setRows(rows.map((x, j) => j === i ? {
								...x,
								label: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Occupant",
							value: r.occupant,
							onChange: (e) => setRows(rows.map((x, j) => j === i ? {
								...x,
								occupant: e.target.value
							} : x))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Phone",
							value: r.phone,
							onChange: (e) => setRows(rows.map((x, j) => j === i ? {
								...x,
								phone: e.target.value
							} : x))
						}),
						i === rows.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "icon",
							onClick: () => setRows([...rows, {
								label: "",
								occupant: "",
								phone: ""
							}]),
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: generate,
				className: "w-full",
				disabled: busy || validRows.length === 0,
				children: busy ? "Provisioning accounts…" : validRows.length === 0 ? "Generate unit accounts" : `Generate ${validRows.length} unit account${validRows.length === 1 ? "" : "s"}`
			})
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-brand-tint border border-[#A7F3D0] p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mx-auto h-7 w-7 text-brand" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 font-display text-xl font-semibold",
					children: [
						draft.accounts.length,
						" units, ",
						draft.accounts.length,
						" account numbers."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Each one settles into your estate's Nomba account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-2 max-w-xs mx-auto text-left",
					children: [draft.accounts.slice(0, 4).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: a.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountNumber, {
							value: a.accountNumber ?? "pending",
							size: "sm"
						})]
					}, a.label)), draft.accounts.length > 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center text-xs text-muted-foreground pt-2",
						children: [
							"+ ",
							draft.accounts.length - 4,
							" more"
						]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: next,
			className: "w-full",
			children: "Open my dashboard"
		})] })
	});
}
//#endregion
export { OnboardingPage as component };
