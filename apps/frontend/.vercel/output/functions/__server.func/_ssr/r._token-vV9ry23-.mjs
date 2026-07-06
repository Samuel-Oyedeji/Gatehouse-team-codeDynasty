import { b as fetchPublicStatement } from "./api-ByrbTN72.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r._token-vV9ry23-.js
var $$splitComponentImporter = () => import("./r._token-DWFZf1V3.mjs");
var Route = createFileRoute("/r/$token")({
	loader: ({ params }) => fetchPublicStatement({ data: { token: params.token } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
