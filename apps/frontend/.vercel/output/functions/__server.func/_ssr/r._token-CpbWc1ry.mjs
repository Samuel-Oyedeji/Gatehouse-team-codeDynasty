import { y as fetchPublicStatement } from "./api-BUANDe_q.mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r._token-CpbWc1ry.js
var $$splitComponentImporter = () => import("./r._token-BbqrB4rW.mjs");
var Route = createFileRoute("/r/$token")({
	loader: ({ params }) => fetchPublicStatement({ data: { token: params.token } }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
