import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as getQueryClient, E as logoutFn, S as getEstateId, a as apiUrl, w as getToken, x as fetchStreamTicket } from "./api-4JFegvrj.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { c as useLayoutEffect2, i as useCallbackRef, r as createContextScope } from "./dist-C85t2aoY.mjs";
import { t as Primitive } from "./dist-BgEo49St.mjs";
import { A as TriangleAlert, F as FileChartColumnIncreasing, N as House, c as Settings, d as Receipt, g as LayoutDashboard, k as ArrowLeftRight, m as LogOut, r as Wrench, t as Zap } from "../_libs/lucide-react.mjs";
import { c as DialogFooter, f as DialogTitle, i as DialogContent, l as DialogHeader, m as DialogTrigger, o as DialogDescription, t as Dialog } from "./dialog-B3JjP9jO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-BIISrCij.mjs";
import { i as useGatehouse, t as store } from "./store-BHHuWGN2.mjs";
import { t as gatehouse_mark_default } from "./gatehouse-mark-DfY7ZYsT.mjs";
import { P as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-DI6OPYLq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useLiveUpdates() {
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || typeof EventSource === "undefined") return;
		if (!getToken() || !getEstateId()) return;
		let es = null;
		let reconnectTimer;
		let closed = false;
		async function connect() {
			const estateId = getEstateId();
			if (closed || !estateId) return;
			let ticket;
			try {
				ticket = await fetchStreamTicket();
			} catch {
				if (!closed) reconnectTimer = setTimeout(connect, 5e3);
				return;
			}
			if (closed) return;
			const url = apiUrl(`/stream?token=${encodeURIComponent(ticket)}&estateId=${encodeURIComponent(estateId)}`);
			es = new EventSource(url);
			es.onmessage = () => getQueryClient().invalidateQueries();
			es.onerror = () => {
				es?.close();
				es = null;
				if (!closed) reconnectTimer = setTimeout(connect, 3e3);
			};
		}
		connect();
		return () => {
			closed = true;
			clearTimeout(reconnectTimer);
			es?.close();
		};
	}, []);
}
function SimulatePayment() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [unit, setUnit] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("0");
	const { units } = useGatehouse();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "border-dashed text-muted-foreground hover:text-ink hover:border-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
					size: 14,
					className: "mr-1.5"
				}), "Simulate payment"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display",
				children: "Simulate an incoming payment"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Developer-only. Fires a fake transfer into the app so reconciliation runs." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "sim-unit",
						children: "Unit label (e.g. A3, B12)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "sim-unit",
						value: unit,
						onChange: (e) => setUnit(e.target.value),
						list: "sim-unit-list"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
						id: "sim-unit-list",
						children: units.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: u.label,
							children: u.occupant
						}, u.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Leave blank or enter an unknown label to test unmatched flow."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "sim-amount",
					children: "Amount (₦)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "sim-amount",
					type: "number",
					value: amount,
					onChange: (e) => setAmount(e.target.value)
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					const n = Number(amount);
					if (!n || n <= 0) return;
					store.recordPayment(unit.trim(), n);
					setOpen(false);
				},
				children: "Fire payment"
			})] })
		] })]
	});
}
var AVATAR_NAME = "Avatar";
var [createAvatarContext, createAvatarScope] = createContextScope(AVATAR_NAME);
var STATIC_IMAGE_COUNT_STATE = [0, () => void 0];
var [AvatarProvider, useAvatarContext] = createAvatarContext(AVATAR_NAME);
var Avatar$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAvatar, ...avatarProps } = props;
	const [imageLoadingStatus, setImageLoadingStatus] = import_react.useState("idle");
	const [imageCount, setImageCount] = useImageCount();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarProvider, {
		scope: __scopeAvatar,
		imageLoadingStatus,
		setImageLoadingStatus,
		imageCount,
		setImageCount,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
			...avatarProps,
			ref: forwardedRef
		})
	});
});
Avatar$1.displayName = AVATAR_NAME;
var IMAGE_NAME = "AvatarImage";
var AvatarImage$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAvatar, src, onLoadingStatusChange, ...imageProps } = props;
	const context = useAvatarContext(IMAGE_NAME, __scopeAvatar);
	useUpdateImageCount(context.setImageCount);
	const imageLoadingStatus = useImageLoadingStatus(src, {
		referrerPolicy: imageProps.referrerPolicy,
		crossOrigin: imageProps.crossOrigin,
		loadingStatus: context.imageLoadingStatus,
		setLoadingStatus: context.setImageLoadingStatus
	});
	const handleLoadingStatusChange = useCallbackRef((status) => {
		onLoadingStatusChange?.(status);
	});
	const loadingStatusRef = import_react.useRef(imageLoadingStatus);
	useLayoutEffect2(() => {
		const previousLoadingStatus = loadingStatusRef.current;
		loadingStatusRef.current = imageLoadingStatus;
		if (imageLoadingStatus !== previousLoadingStatus) handleLoadingStatusChange(imageLoadingStatus);
	}, [imageLoadingStatus, handleLoadingStatusChange]);
	return imageLoadingStatus === "loaded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.img, {
		...imageProps,
		ref: forwardedRef,
		src
	}) : null;
});
AvatarImage$1.displayName = IMAGE_NAME;
var FALLBACK_NAME = "AvatarFallback";
var AvatarFallback$1 = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeAvatar, delayMs, ...fallbackProps } = props;
	const context = useAvatarContext(FALLBACK_NAME, __scopeAvatar);
	const [canRender, setCanRender] = import_react.useState(delayMs === void 0);
	import_react.useEffect(() => {
		if (delayMs !== void 0) {
			const timerId = window.setTimeout(() => setCanRender(true), delayMs);
			return () => window.clearTimeout(timerId);
		}
	}, [delayMs]);
	return canRender && context.imageLoadingStatus !== "loaded" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		...fallbackProps,
		ref: forwardedRef
	}) : null;
});
AvatarFallback$1.displayName = FALLBACK_NAME;
function useImageLoadingStatus(src, { loadingStatus, setLoadingStatus, referrerPolicy, crossOrigin }) {
	useLayoutEffect2(() => {
		if (!src) {
			setLoadingStatus("error");
			return;
		}
		const image = new window.Image();
		const handleLoad = (event) => {
			const image2 = event.currentTarget;
			setLoadingStatus(getImageLoadingStatus(image2));
		};
		const handleError = () => setLoadingStatus("error");
		image.addEventListener("load", handleLoad);
		image.addEventListener("error", handleError);
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;
		image.crossOrigin = crossOrigin ?? null;
		image.src = src;
		setLoadingStatus(getImageLoadingStatus(image));
		return () => {
			image.removeEventListener("load", handleLoad);
			image.removeEventListener("error", handleError);
			setLoadingStatus("idle");
		};
	}, [
		src,
		crossOrigin,
		referrerPolicy,
		setLoadingStatus
	]);
	return loadingStatus;
}
function getImageLoadingStatus(image) {
	return image.complete ? image.naturalWidth > 0 ? "loaded" : "error" : "loading";
}
function useImageCount() {
	let state = STATIC_IMAGE_COUNT_STATE;
	{
		state = import_react.useState(0);
		const [imageCount] = state;
		const hasWarnedRef = import_react.useRef(false);
		import_react.useEffect(() => {
			if (imageCount > 1 && !hasWarnedRef.current) {
				hasWarnedRef.current = true;
				console.warn("Avatar: Only one `Avatar.Image` component should be rendered per `Avatar.Root`, but multiple were detected. This will lead to unexpected behavior.");
			}
		}, [imageCount]);
	}
	return state;
}
function useUpdateImageCount(setImageCount) {
	import_react.useEffect(() => {
		setImageCount((imageCount) => imageCount + 1);
		return () => {
			setImageCount((imageCount) => imageCount - 1);
		};
	}, [setImageCount]);
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var NAV = [
	{
		to: "/app/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/app/units",
		label: "Units",
		icon: House
	},
	{
		to: "/app/billing",
		label: "Billing",
		icon: Receipt
	},
	{
		to: "/app/payments",
		label: "Payments",
		icon: ArrowLeftRight
	},
	{
		to: "/app/exceptions",
		label: "Exceptions",
		icon: TriangleAlert
	},
	{
		to: "/app/vendors",
		label: "Vendors",
		icon: Wrench
	},
	{
		to: "/app/reports",
		label: "Reports",
		icon: FileChartColumnIncreasing
	},
	{
		to: "/app/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell() {
	useLiveUpdates();
	const nav = useNavigate();
	const { estate, cycle, exceptions } = useGatehouse();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [loggingOut, setLoggingOut] = (0, import_react.useState)(false);
	async function handleLogout() {
		if (loggingOut) return;
		setLoggingOut(true);
		await logoutFn();
		nav({ to: "/login" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex bg-canvas",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "w-60 shrink-0 border-r border-border bg-card flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-16 flex items-center px-5 border-b border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/dashboard",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: gatehouse_mark_default,
							alt: "HireFlow logo",
							className: "h-7 w-7 object-contain"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold tracking-tight",
							children: "Gatehouse"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 px-3 py-4 space-y-1",
					children: NAV.map((n) => {
						const active = path.startsWith(n.to);
						const Icon = n.icon;
						const isExc = n.to === "/app/exceptions";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-brand-tint text-brand font-medium" : "text-muted-foreground hover:bg-secondary hover:text-ink"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1",
									children: n.label
								}),
								isExc && exceptions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-[#FFF1F2] text-[#BE123C] px-1.5 text-[10px] font-semibold tabular min-w-[18px] text-center",
									children: exceptions.length
								})
							]
						}, n.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleLogout,
						disabled: loggingOut,
						className: "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-ink disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 text-left",
							children: loggingOut ? "Signing out…" : "Log out"
						})]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "h-16 shrink-0 border-b border-border bg-card flex items-center px-6 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-semibold text-ink",
								children: estate.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-sm",
								children: "·"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: estate.city
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground rounded-md border border-border px-2.5 py-1 tabular",
						children: cycle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `text-xs px-2.5 py-1 rounded-full tabular font-medium ${exceptions.length > 0 ? "bg-[#FFF1F2] text-[#BE123C]" : "bg-[#ECFDF5] text-[#047857]"}`,
						children: ["Unmatched: ", exceptions.length]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimulatePayment, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						className: "h-8 w-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-brand text-white text-xs",
							children: "AO"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-auto p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
//#endregion
export { AppShell as component };
