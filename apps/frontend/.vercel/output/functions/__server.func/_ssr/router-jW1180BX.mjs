import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { C as getQueryClient, _ as fetchCurrentUser } from "./api-ByrbTN72.mjs";
import { F as useRouter, O as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$15 } from "./r._token-vV9ry23-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-jW1180BX.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-kuyNeQTh.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$14 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Gatehouse" },
			{
				name: "description",
				content: "Estate dues and service charge collection"
			},
			{
				property: "og:title",
				content: "Gatehouse"
			},
			{
				property: "og:description",
				content: "Estate dues and service charge collection"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$14.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$12 = () => import("./signup-D0CpXtsX.mjs");
var Route$13 = createFileRoute("/signup")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./onboarding-DtVEnYXR.mjs");
var Route$12 = createFileRoute("/onboarding")({
	beforeLoad: async () => {
		if (typeof window === "undefined") return;
		const user = await fetchCurrentUser();
		if (!user) throw redirect({ to: "/login" });
		if (user.onboarded) throw redirect({ to: "/app/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./login-56vzsSzW.mjs");
var Route$11 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./app-CVPYC6-7.mjs");
var Route$10 = createFileRoute("/app")({
	beforeLoad: async () => {
		if (typeof window === "undefined") return;
		const user = await fetchCurrentUser();
		if (!user) throw redirect({ to: "/login" });
		if (!user.onboarded) throw redirect({ to: "/onboarding" });
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./routes-C6L0PU98.mjs");
var Route$9 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Gatehouse — Estate dues that reconcile themselves" },
		{
			name: "description",
			content: "Gatehouse collects service charges into your estate's own bank account, attributes every payment automatically, and shows residents where the money goes."
		},
		{
			property: "og:title",
			content: "Gatehouse — Estate dues that reconcile themselves"
		},
		{
			property: "og:description",
			content: "Every unit gets its own account number. Every payment reconciles itself."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var Route$8 = createFileRoute("/app/")({ beforeLoad: () => {
	throw redirect({ to: "/app/dashboard" });
} });
var $$splitComponentImporter$7 = () => import("./app.vendors-CrBCvctc.mjs");
var Route$7 = createFileRoute("/app/vendors")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./app.units-CqI7yVyR.mjs");
var Route$6 = createFileRoute("/app/units")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./app.settings-CpEagHC0.mjs");
var Route$5 = createFileRoute("/app/settings")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./app.reports-B0jq70Td.mjs");
var Route$4 = createFileRoute("/app/reports")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./app.payments-DITAtcxF.mjs");
var Route$3 = createFileRoute("/app/payments")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./app.exceptions-DN0W0RXc.mjs");
var Route$2 = createFileRoute("/app/exceptions")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./app.dashboard-DK5fxBk5.mjs");
var Route$1 = createFileRoute("/app/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./app.billing-DOUa8cQA.mjs");
var Route = createFileRoute("/app/billing")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SignupRoute = Route$13.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$14
});
var OnboardingRoute = Route$12.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => Route$14
});
var LoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$14
});
var AppRoute = Route$10.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$14
});
var IndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var AppIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var RTokenRoute = Route$15.update({
	id: "/r/$token",
	path: "/r/$token",
	getParentRoute: () => Route$14
});
var AppVendorsRoute = Route$7.update({
	id: "/vendors",
	path: "/vendors",
	getParentRoute: () => AppRoute
});
var AppUnitsRoute = Route$6.update({
	id: "/units",
	path: "/units",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$5.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppReportsRoute = Route$4.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRoute
});
var AppPaymentsRoute = Route$3.update({
	id: "/payments",
	path: "/payments",
	getParentRoute: () => AppRoute
});
var AppExceptionsRoute = Route$2.update({
	id: "/exceptions",
	path: "/exceptions",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppBillingRoute: Route.update({
		id: "/billing",
		path: "/billing",
		getParentRoute: () => AppRoute
	}),
	AppDashboardRoute,
	AppExceptionsRoute,
	AppPaymentsRoute,
	AppReportsRoute,
	AppSettingsRoute,
	AppUnitsRoute,
	AppVendorsRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	OnboardingRoute,
	SignupRoute,
	RTokenRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: getQueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
