import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { r as ngn } from "./format-DyUNyznX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-DshzQerR.js
var import_jsx_runtime = require_jsx_runtime();
function Money({ value, className = "", muted = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `money tabular ${muted ? "text-muted-foreground" : ""} ${className}`,
		children: ngn(value)
	});
}
//#endregion
export { Money as t };
