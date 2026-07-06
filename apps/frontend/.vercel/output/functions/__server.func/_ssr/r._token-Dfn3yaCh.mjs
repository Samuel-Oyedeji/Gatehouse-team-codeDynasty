import { b as fetchPublicStatement } from "./api-4JFegvrj.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r._token-Dfn3yaCh.js
var $$splitComponentImporter = () => import("./r._token-DU01eT8J.mjs");
var Route = createFileRoute("/r/$token")({
	loader: ({ params }) => fetchPublicStatement({ data: { token: params.token } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
