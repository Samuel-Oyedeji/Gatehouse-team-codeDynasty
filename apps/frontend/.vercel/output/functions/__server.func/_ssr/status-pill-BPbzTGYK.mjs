import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-pill-BPbzTGYK.js
var import_jsx_runtime = require_jsx_runtime();
var MAP = {
	paid: {
		label: "Paid",
		bg: "#ECFDF5",
		fg: "#047857"
	},
	matched: {
		label: "Matched",
		bg: "#ECFDF5",
		fg: "#047857"
	},
	partial: {
		label: "Partial",
		bg: "#FFFBEB",
		fg: "#B45309"
	},
	overdue: {
		label: "Overdue",
		bg: "#FFF1F2",
		fg: "#BE123C"
	},
	unbilled: {
		label: "Unbilled",
		bg: "#F1F5F9",
		fg: "#475569"
	},
	credit: {
		label: "Credit",
		bg: "#EEF2FF",
		fg: "#4338CA"
	},
	overpayment: {
		label: "Overpayment",
		bg: "#EEF2FF",
		fg: "#4338CA"
	},
	exception: {
		label: "Exception",
		bg: "#FFF1F2",
		fg: "#BE123C"
	},
	duplicate: {
		label: "Duplicate",
		bg: "#FFFBEB",
		fg: "#B45309"
	},
	misdirected: {
		label: "Misdirected",
		bg: "#FFF1F2",
		fg: "#BE123C"
	},
	third_party: {
		label: "Third-party",
		bg: "#EEF2FF",
		fg: "#4338CA"
	},
	reversed: {
		label: "Reversed",
		bg: "#FFF1F2",
		fg: "#BE123C"
	},
	reversal: {
		label: "Reversed",
		bg: "#FFF1F2",
		fg: "#BE123C"
	}
};
function StatusPill({ kind, children }) {
	const v = MAP[kind] ?? MAP.unbilled;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tabular",
		style: {
			backgroundColor: v.bg,
			color: v.fg
		},
		children: children ?? v.label
	});
}
//#endregion
export { StatusPill as t };
