import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as Check, b as Copy } from "../_libs/lucide-react.mjs";
import { n as formatNuban } from "./format-DyUNyznX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-number-fopwu6AS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountNumber({ value, size = "md" }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: (e) => {
			e.stopPropagation();
			navigator.clipboard?.writeText(value);
			setCopied(true);
			toast.success("Account number copied");
			setTimeout(() => setCopied(false), 1500);
		},
		className: `inline-flex items-center gap-2 font-mono tabular ${size === "lg" ? "text-lg" : size === "sm" ? "text-xs" : "text-sm"} text-ink hover:text-brand transition-colors`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatNuban(value) }), copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			size: 14,
			className: "text-brand"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
			size: 14,
			className: "text-muted-foreground"
		})]
	});
}
//#endregion
export { AccountNumber as t };
