import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { A as TriangleAlert, L as CircleCheck, O as ArrowRight, _ as Eye, d as Receipt, r as Wrench, s as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as gatehouse_mark_default } from "./gatehouse-mark-DfY7ZYsT.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { t as Money } from "./money-DshzQerR.mjs";
import { t as AccountNumber } from "./account-number-fopwu6AS.mjs";
import { t as StatusPill } from "./status-pill-BPbzTGYK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C6L0PU98.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-canvas",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Problem, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(How, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trust, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-border bg-card/80 backdrop-blur sticky top-0 z-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-6 h-16 flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gatehouse_mark_default,
						alt: "HireFlow logo",
						className: "h-7 w-7 object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold tracking-tight",
						children: "Gatehouse"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden md:flex items-center gap-7 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#how",
							className: "hover:text-ink",
							children: "How it works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#features",
							className: "hover:text-ink",
							children: "Features"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "hover:text-ink",
							children: "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						children: "Start collecting"
					})
				})
			]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-12 items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex items-center gap-2 rounded-full bg-brand-tint px-3 py-1 text-xs font-medium text-brand",
				children: "For Nigerian estate managers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-5 font-display text-5xl font-semibold tracking-tight text-ink leading-[1.05]",
				children: "Every unit gets its own account number. Every payment reconciles itself."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-lg text-muted-foreground leading-relaxed",
				children: "Gatehouse collects service charges into your estate's own bank account, attributes every payment automatically, and shows residents exactly where their money goes. End the WhatsApp-and-spreadsheet chaos."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-7 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/signup",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						children: ["Start collecting ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
							size: 16,
							className: "ml-1.5"
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#how",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "outline",
						children: "See how it works"
					})
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroPreview, {})]
	});
}
function HeroPreview() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-5 shadow-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Maple Court · Q3 2026"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-semibold",
						children: "Block A & B"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#047857] tabular font-medium",
						children: "Unmatched: 0"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: [
						{
							label: "A1",
							name: "Adaeze",
							status: "paid",
							val: 0
						},
						{
							label: "A2",
							name: "Tunde",
							status: "partial",
							val: 2e4
						},
						{
							label: "A3",
							name: "Aisha",
							status: "paid",
							val: 0
						},
						{
							label: "A4",
							name: "Femi",
							status: "paid",
							val: 0
						},
						{
							label: "B1",
							name: "Yetunde",
							status: "paid",
							val: 0
						},
						{
							label: "B2",
							name: "Ifeanyi",
							status: "overdue",
							val: 45e3
						},
						{
							label: "B3",
							name: "Bukola",
							status: "paid",
							val: 0
						},
						{
							label: "B4",
							name: "Obinna",
							status: "credit",
							val: 1e4
						}
					].map((t) => {
						const tone = {
							paid: "border-[#A7F3D0] bg-[#ECFDF5]",
							partial: "border-[#FDE68A] bg-[#FFFBEB]",
							overdue: "border-[#FECDD3] bg-[#FFF1F2]",
							credit: "border-[#C7D2FE] bg-[#EEF2FF]",
							unbilled: "border-border bg-secondary"
						}[t.status];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-xl border p-3 ${tone}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-base font-semibold",
										children: t.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { kind: t.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-xs text-muted-foreground truncate",
									children: t.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm font-medium tabular",
									children: t.val === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[#047857]",
										children: "settled"
									}) : t.status === "credit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[#4338CA]",
										children: ["+", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: t.val })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Money, { value: t.val }) })
								})
							]
						}, t.label);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 pt-4 border-t border-border flex items-center gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-brand animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-ink",
							children: [
								"Block B Flat 4 paid ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular font-medium",
									children: "₦55,000"
								}),
								", ₦10,000 credit"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto text-xs text-muted-foreground tabular",
							children: "just now"
						})
					]
				})
			]
		})
	});
}
function Problem() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-6xl mx-auto px-6 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl font-semibold text-ink",
			children: "The treasurer's job, before Gatehouse"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid md:grid-cols-3 gap-4",
			children: [
				{
					title: "Chasing payments on WhatsApp",
					body: "Endless reminders in the estate group. No one knows who has actually paid."
				},
				{
					title: "A spreadsheet that's always wrong",
					body: "Bank statements don't say who paid. Names don't match units. Reconciliation eats your weekend."
				},
				{
					title: "Residents distrust the books",
					body: "\"Where did our money go?\" becomes the question at every AGM."
				}
			].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-lg font-semibold",
					children: it.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground leading-relaxed",
					children: it.body
				})]
			}, it.title))
		})]
	});
}
function How() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "how",
		className: "bg-card border-y border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-6 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl font-semibold text-ink",
					children: "How it works"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid md:grid-cols-3 gap-6",
					children: [
						{
							n: 1,
							title: "Add your units",
							body: "Bulk upload your block list. Each unit gets its own dedicated 10-digit account number, in the estate's own bank account."
						},
						{
							n: 2,
							title: "Residents pay by transfer",
							body: "Service charges and levies land in the right unit's account. Payments reconcile instantly — no notes, no names, no guesswork."
						},
						{
							n: 3,
							title: "Pay vendors and publish",
							body: "Pay security, waste, and diesel from inside Gatehouse. Residents see exactly where every naira went, in plain language."
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-5xl font-bold text-brand tabular",
							children: s.n.toString().padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 font-display text-xl font-semibold",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground leading-relaxed",
							children: s.body
						})
					] }, s.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wide text-muted-foreground mb-2",
						children: "Your residents will see"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Maple Court · Block B Flat 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-sm",
								children: "Transfer to"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountNumber, {
									value: "8021449320",
									size: "lg"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "From any bank app. Your payment is recorded automatically."
							})
						]
					})]
				})
			]
		})
	});
}
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "features",
		className: "max-w-6xl mx-auto px-6 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-3xl font-semibold",
			children: "Everything a treasurer actually needs"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4",
			children: [
				{
					i: CircleCheck,
					t: "Automatic reconciliation",
					d: "Per-unit account numbers mean every payment knows where it belongs."
				},
				{
					i: Receipt,
					t: "Partial and overpayment handling",
					d: "Underpaid? It shows. Overpaid? It moves to credit. Always tidy."
				},
				{
					i: TriangleAlert,
					t: "Arrears tracking and reminders",
					d: "See who is behind by 30, 60, 90+ days. Nudge them by SMS or WhatsApp in one click."
				},
				{
					i: Eye,
					t: "Per-unit statements",
					d: "Every resident gets a no-login link to their own statement and history."
				},
				{
					i: Wrench,
					t: "Vendor payouts",
					d: "Pay security, waste, diesel, and repairs from inside the app. Every payout is logged."
				},
				{
					i: ShieldCheck,
					t: "Public transparency report",
					d: "A shareable, plain-language view of where the dues went this cycle."
				}
			].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(x.i, { className: "text-brand h-5 w-5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 font-display text-base font-semibold",
						children: x.t
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground leading-relaxed",
						children: x.d
					})
				]
			}, x.t))
		})]
	});
}
function Trust() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-card border-t border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trustline, {
					title: "Funds settle into the estate's account",
					children: "Money never sits with Gatehouse. It moves directly to your estate's own bank."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trustline, {
					title: "Gatehouse never holds funds",
					children: "We're the ledger, not the wallet. Your committee always controls the money."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trustline, {
					title: "Powered by Nomba",
					children: "Built on CBN-licensed payment rails used by thousands of Nigerian businesses."
				})
			]
		})
	});
}
function Trustline({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "text-brand h-5 w-5" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-display text-base font-semibold",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-muted-foreground",
			children
		})
	] });
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "border-t border-border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-6 w-6 rounded-md bg-brand text-white grid place-items-center font-display font-bold text-xs",
						children: "G"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold",
						children: "Gatehouse"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground",
					children: "Estate dues that reconcile themselves."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Product",
					items: [
						"How it works",
						"Features",
						"Pricing"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Legal",
					items: [
						"Terms",
						"Privacy",
						"Security"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Contact",
					items: ["hello@gatehouse.ng", "+234 800 000 0000"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border py-4 text-center text-xs text-muted-foreground",
			children: "© 2026 Gatehouse"
		})]
	});
}
function FooterCol({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "font-medium text-ink",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-2 space-y-1.5 text-muted-foreground",
		children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: i }, i))
	})] });
}
//#endregion
export { Index as component };
