import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.billing-Chtc8vnt.js
var $$splitComponentImporter = () => import("./app.billing-_gDvjAuB.mjs");
var Route = createFileRoute("/app/billing")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	validateSearch: (s) => ({ create: typeof s.create === "string" ? s.create : void 0 })
});
//#endregion
export { Route as t };
