import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as getQueryClient, M as signupFn } from "./api-ByrbTN72.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-DqWKNAsU.mjs";
import { E as Check, _ as Eye, n as X, v as EyeOff } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-BIISrCij.mjs";
import { t as gatehouse_mark_default } from "./gatehouse-mark-DfY7ZYsT.mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/signup-D0CpXtsX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()\-_=+{};:,<.>])[A-Za-z\d@$!%*?&#^()\-_=+{};:,<.>]{8,}$/;
var PASSWORD_RULES = [
	{
		label: "At least 8 characters",
		test: (v) => v.length >= 8
	},
	{
		label: "One uppercase letter",
		test: (v) => /[A-Z]/.test(v)
	},
	{
		label: "One lowercase letter",
		test: (v) => /[a-z]/.test(v)
	},
	{
		label: "One number",
		test: (v) => /\d/.test(v)
	},
	{
		label: "One special character",
		test: (v) => /[@$!%*?&#^()\-_=+{};:,<.>]/.test(v)
	}
];
var PHONE_RE = /^\+[1-9]\d{1,14}$/;
function sanitizePhone(v) {
	return v.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
}
function normalizePhone(v) {
	const cleaned = sanitizePhone(v);
	if (cleaned.startsWith("+")) return cleaned;
	if (cleaned.startsWith("0")) return "+234" + cleaned.slice(1);
	if (cleaned.startsWith("234")) return "+" + cleaned;
	return cleaned ? "+" + cleaned : "";
}
function PasswordInput({ value, onChange, placeholder }) {
	const [show, setShow] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: show ? "text" : "password",
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			className: "pr-10"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setShow((s) => !s),
			"aria-label": show ? "Hide password" : "Show password",
			tabIndex: -1,
			className: "absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground",
			children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
		})]
	});
}
function SignupPage() {
	const nav = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onSubmit(e) {
		e.preventDefault();
		const cleanedPhone = normalizePhone(phone);
		if (!PHONE_RE.test(cleanedPhone)) return toast.error("Enter a valid phone number, e.g. 08030000000 or +2348030000000");
		if (!PASSWORD_RE.test(password)) return toast.error("Password doesn't meet all the requirements below");
		if (password !== confirm) return toast.error("Passwords do not match");
		setBusy(true);
		try {
			await signupFn({ data: {
				name,
				email,
				phone: cleanedPhone,
				password
			} });
			await getQueryClient().invalidateQueries();
			nav({ to: "/onboarding" });
		} catch (err) {
			const msg = err instanceof Error ? err.message : "";
			toast.error(msg && !msg.startsWith("[") ? msg : "Could not create account");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-canvas px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 justify-center mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: gatehouse_mark_default,
					alt: "Gatehouse logo",
					className: "h-7 w-7 object-contain"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg font-semibold tracking-tight",
					children: "Gatehouse"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold",
						children: "Create your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Set up Gatehouse for your estate in under five minutes."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-6 space-y-4",
						onSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Adaeze Okafor"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Work email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "you@business.com"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "tel",
								inputMode: "numeric",
								value: phone,
								onChange: (e) => setPhone(sanitizePhone(e.target.value)),
								onBlur: () => setPhone((p) => normalizePhone(p)),
								placeholder: "+2348030000000"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
									value: password,
									onChange: setPassword,
									placeholder: "Enter password"
								}),
								password && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-1",
									children: PASSWORD_RULES.map((r) => {
										const ok = r.test(password);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: cn("flex items-center gap-1.5 text-xs", ok ? "text-green-600" : "text-muted-foreground"),
											children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 shrink-0" }), r.label]
										}, r.label);
									})
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Confirm password" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordInput, {
									value: confirm,
									onChange: setConfirm,
									placeholder: "Confirm password"
								}),
								confirm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: cn("mt-2 flex items-center gap-1.5 text-xs", password === confirm ? "text-green-600" : "text-muted-foreground"),
									children: [password === confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5 shrink-0" }), "Passwords match"]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								disabled: busy,
								children: busy ? "Creating…" : "Create account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted-foreground text-center",
						children: ["Already have an account? ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "text-brand font-medium",
							children: "Sign in"
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { SignupPage as component };
