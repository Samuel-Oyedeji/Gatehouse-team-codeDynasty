import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dist-D9t2HPxJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function usePrevious(value) {
	const ref = import_react.useRef({
		value,
		previous: value
	});
	return import_react.useMemo(() => {
		if (ref.current.value !== value) {
			ref.current.previous = ref.current.value;
			ref.current.value = value;
		}
		return ref.current.previous;
	}, [value]);
}
function clamp(value, [min, max]) {
	return Math.min(max, Math.max(min, value));
}
//#endregion
export { usePrevious as n, clamp as t };
