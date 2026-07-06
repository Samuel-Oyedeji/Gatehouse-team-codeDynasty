import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as resolveAccountFn, D as provisionUnitsFn, E as payVendorFn, I as updateUnitFn, L as updateVendorFn, N as simulatePayment, S as getQueryClient, _ as fetchEstateState, d as deleteGroupFn, f as deleteUnitFn, h as fetchBanksFn, i as addVendorFn, j as resolveExceptionFn, k as resetDemoFn, l as createGroupFn, m as fetchAccountBalance, n as BANKS_KEY, o as assignUnitGroupFn, p as deleteVendorFn, r as ESTATE_STATE_KEY, t as ACCOUNT_BALANCE_KEY } from "./api-BUANDe_q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-Crsze7j9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
typeof window !== "undefined" && window.document && window.document.createElement;
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler?.(event);
	};
}
var useLayoutEffect2 = globalThis?.document ? import_react.useLayoutEffect : () => {};
var useReactId = import_react[" useId ".trim().toString()] || (() => void 0);
var count = 0;
function useId(deterministicId) {
	const [id, setId] = import_react.useState(useReactId());
	useLayoutEffect2(() => {
		if (!deterministicId) setId((reactId) => reactId ?? String(count++));
	}, [deterministicId]);
	return deterministicId || (id ? `radix-${id}` : "");
}
function useCallbackRef(callback) {
	const callbackRef = import_react.useRef(callback);
	import_react.useEffect(() => {
		callbackRef.current = callback;
	});
	return import_react.useMemo(() => ((...args) => callbackRef.current?.(...args)), []);
}
var useReactEffectEvent = import_react[" useEffectEvent ".trim().toString()];
var useReactInsertionEffect = import_react[" useInsertionEffect ".trim().toString()];
function useEffectEvent(callback) {
	if (typeof useReactEffectEvent === "function") return useReactEffectEvent(callback);
	const ref = import_react.useRef(() => {
		throw new Error("Cannot call an event handler while rendering.");
	});
	if (typeof useReactInsertionEffect === "function") useReactInsertionEffect(() => {
		ref.current = callback;
	});
	else useLayoutEffect2(() => {
		ref.current = callback;
	});
	return import_react.useMemo(() => ((...args) => ref.current?.(...args)), []);
}
var useInsertionEffect = import_react[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
function useControllableState({ prop, defaultProp, onChange = () => {}, caller }) {
	const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
		defaultProp,
		onChange
	});
	const isControlled = prop !== void 0;
	const value = isControlled ? prop : uncontrolledProp;
	{
		const isControlledRef = import_react.useRef(prop !== void 0);
		import_react.useEffect(() => {
			const wasControlled = isControlledRef.current;
			if (wasControlled !== isControlled) console.warn(`${caller} is changing from ${wasControlled ? "controlled" : "uncontrolled"} to ${isControlled ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`);
			isControlledRef.current = isControlled;
		}, [isControlled, caller]);
	}
	return [value, import_react.useCallback((nextValue) => {
		if (isControlled) {
			const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
			if (value2 !== prop) onChangeRef.current?.(value2);
		} else setUncontrolledProp(nextValue);
	}, [
		isControlled,
		prop,
		setUncontrolledProp,
		onChangeRef
	])];
}
function useUncontrolledState({ defaultProp, onChange }) {
	const [value, setValue] = import_react.useState(defaultProp);
	const prevValueRef = import_react.useRef(value);
	const onChangeRef = import_react.useRef(onChange);
	useInsertionEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);
	import_react.useEffect(() => {
		if (prevValueRef.current !== value) {
			onChangeRef.current?.(value);
			prevValueRef.current = value;
		}
	}, [value, prevValueRef]);
	return [
		value,
		setValue,
		onChangeRef
	];
}
function isFunction(value) {
	return typeof value === "function";
}
function useStateMachine(initialState, machine) {
	return import_react.useReducer((state, event) => {
		return machine[state][event] ?? state;
	}, initialState);
}
var Presence = (props) => {
	const { present, children } = props;
	const presence = usePresence(present);
	const child = typeof children === "function" ? children({ present: presence.isPresent }) : import_react.Children.only(children);
	const ref = useStableComposedRefs(presence.ref, getElementRef(child));
	return typeof children === "function" || presence.isPresent ? import_react.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
	const [node, setNode] = import_react.useState();
	const stylesRef = import_react.useRef(null);
	const prevPresentRef = import_react.useRef(present);
	const prevAnimationNameRef = import_react.useRef("none");
	const [state, send] = useStateMachine(present ? "mounted" : "unmounted", {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended"
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted"
		},
		unmounted: { MOUNT: "mounted" }
	});
	import_react.useEffect(() => {
		const currentAnimationName = getAnimationName(stylesRef.current);
		prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
	}, [state]);
	useLayoutEffect2(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		if (wasPresent !== present) {
			const prevAnimationName = prevAnimationNameRef.current;
			const currentAnimationName = getAnimationName(styles);
			if (present) send("MOUNT");
			else if (currentAnimationName === "none" || styles?.display === "none") send("UNMOUNT");
			else if (wasPresent && prevAnimationName !== currentAnimationName) send("ANIMATION_OUT");
			else send("UNMOUNT");
			prevPresentRef.current = present;
		}
	}, [present, send]);
	useLayoutEffect2(() => {
		if (node) {
			let timeoutId;
			const ownerWindow = node.ownerDocument.defaultView ?? window;
			const handleAnimationEnd = (event) => {
				const isCurrentAnimation = getAnimationName(stylesRef.current).includes(CSS.escape(event.animationName));
				if (event.target === node && isCurrentAnimation) {
					send("ANIMATION_END");
					if (!prevPresentRef.current) {
						const currentFillMode = node.style.animationFillMode;
						node.style.animationFillMode = "forwards";
						timeoutId = ownerWindow.setTimeout(() => {
							if (node.style.animationFillMode === "forwards") node.style.animationFillMode = currentFillMode;
						});
					}
				}
			};
			const handleAnimationStart = (event) => {
				if (event.target === node) prevAnimationNameRef.current = getAnimationName(stylesRef.current);
			};
			node.addEventListener("animationstart", handleAnimationStart);
			node.addEventListener("animationcancel", handleAnimationEnd);
			node.addEventListener("animationend", handleAnimationEnd);
			return () => {
				ownerWindow.clearTimeout(timeoutId);
				node.removeEventListener("animationstart", handleAnimationStart);
				node.removeEventListener("animationcancel", handleAnimationEnd);
				node.removeEventListener("animationend", handleAnimationEnd);
			};
		} else send("ANIMATION_END");
	}, [node, send]);
	return {
		isPresent: ["mounted", "unmountSuspended"].includes(state),
		ref: import_react.useCallback((node2) => {
			stylesRef.current = node2 ? getComputedStyle(node2) : null;
			setNode(node2);
		}, [])
	};
}
function setRef(ref, value) {
	if (typeof ref === "function") return ref(value);
	else if (ref !== null && ref !== void 0) ref.current = value;
}
function useStableComposedRefs(...refs) {
	const refsRef = import_react.useRef(refs);
	refsRef.current = refs;
	return import_react.useCallback((node) => {
		const currentRefs = refsRef.current;
		let hasCleanup = false;
		const cleanups = currentRefs.map((ref) => {
			const cleanup = setRef(ref, node);
			if (!hasCleanup && typeof cleanup === "function") hasCleanup = true;
			return cleanup;
		});
		if (hasCleanup) return () => {
			for (let i = 0; i < cleanups.length; i++) {
				const cleanup = cleanups[i];
				if (typeof cleanup === "function") cleanup();
				else setRef(currentRefs[i], null);
			}
		};
	}, []);
}
function getAnimationName(styles) {
	return styles?.animationName || "none";
}
function getElementRef(element) {
	let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
	let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.ref;
	getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
	mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
	if (mayWarn) return element.props.ref;
	return element.props.ref || element.ref;
}
var EMPTY_STATE = {
	estate: {
		id: "",
		name: "",
		address: "",
		city: ""
	},
	cycle: "",
	allocationRule: "OLDEST_FIRST",
	units: [],
	payments: [],
	exceptions: [],
	vendors: [],
	payouts: [],
	billingRuns: [],
	levies: [],
	activity: [],
	groups: [],
	recentlyChanged: {}
};
async function refresh() {
	await getQueryClient().invalidateQueries({ queryKey: ESTATE_STATE_KEY });
}
/** Raw query (exposes loading/error) — used where a component wants status. */
function useEstateStateQuery() {
	return useQuery({
		queryKey: ESTATE_STATE_KEY,
		queryFn: () => fetchEstateState()
	});
}
/** Backwards-compatible hook: always returns a State (empty while loading). */
function useGatehouse() {
	const { data } = useEstateStateQuery();
	return data ?? EMPTY_STATE;
}
/** Live Nomba settlement-account balance. Polls every 60s so the figure stays
*  current without a manual refresh. */
function useAccountBalanceQuery() {
	return useQuery({
		queryKey: ACCOUNT_BALANCE_KEY,
		queryFn: () => fetchAccountBalance(),
		refetchInterval: 6e4
	});
}
/** Live bank list (with codes) for the Add Vendor dropdown. Banks rarely change,
*  so cache aggressively and don't refetch across a session. */
function useBanksQuery() {
	return useQuery({
		queryKey: BANKS_KEY,
		queryFn: () => fetchBanksFn(),
		staleTime: 1440 * 6e4
	});
}
var store = {
	async recordPayment(unitLabel, amountNaira) {
		await simulatePayment({ data: {
			unitLabel,
			amountNaira
		} });
		await refresh();
	},
	async resolveException(exceptionId, action, targetUnitId) {
		const qc = getQueryClient();
		const prev = qc.getQueryData(ESTATE_STATE_KEY);
		qc.setQueryData(ESTATE_STATE_KEY, (s) => s ? {
			...s,
			exceptions: s.exceptions.filter((e) => e.id !== exceptionId)
		} : s);
		try {
			await resolveExceptionFn({ data: {
				exceptionId,
				action,
				targetUnitId
			} });
			await refresh();
		} catch (e) {
			if (prev) qc.setQueryData(ESTATE_STATE_KEY, prev);
			throw e;
		}
	},
	async payVendor(vendorId, amountNaira, note) {
		await payVendorFn({ data: {
			vendorId,
			amountNaira,
			note
		} });
		await refresh();
	},
	async addVendor(input) {
		const vendor = await addVendorFn({ data: input });
		await refresh();
		return vendor;
	},
	async updateVendor(vendorId, input) {
		const vendor = await updateVendorFn({ data: {
			vendorId,
			...input
		} });
		await refresh();
		return vendor;
	},
	async deleteVendor(vendorId) {
		await deleteVendorFn({ data: { vendorId } });
		await refresh();
	},
	resolveAccount(accountNumber, bankCode) {
		return resolveAccountFn({ data: {
			accountNumber,
			bankCode
		} });
	},
	async addUnits(units) {
		const res = await provisionUnitsFn({ data: { units } });
		await refresh();
		return res;
	},
	async createGroup(name) {
		const group = await createGroupFn({ data: { name } });
		await refresh();
		return group;
	},
	async deleteGroup(groupId) {
		const qc = getQueryClient();
		const prev = qc.getQueryData(ESTATE_STATE_KEY);
		qc.setQueryData(ESTATE_STATE_KEY, (s) => s ? {
			...s,
			groups: s.groups.filter((g) => g.id !== groupId),
			units: s.units.map((u) => u.groupId === groupId ? {
				...u,
				groupId: null
			} : u)
		} : s);
		try {
			await deleteGroupFn({ data: { groupId } });
			await refresh();
		} catch (e) {
			if (prev) qc.setQueryData(ESTATE_STATE_KEY, prev);
			throw e;
		}
	},
	async assignUnitGroup(unitId, groupId) {
		const qc = getQueryClient();
		const prevGroupId = qc.getQueryData(ESTATE_STATE_KEY)?.units.find((u) => u.id === unitId)?.groupId ?? null;
		const setGroup = (gid) => qc.setQueryData(ESTATE_STATE_KEY, (s) => s ? {
			...s,
			units: s.units.map((u) => u.id === unitId ? {
				...u,
				groupId: gid
			} : u)
		} : s);
		setGroup(groupId);
		try {
			await assignUnitGroupFn({ data: {
				unitId,
				groupId
			} });
			await refresh();
		} catch (e) {
			setGroup(prevGroupId);
			throw e;
		}
	},
	async updateUnit(unitId, contact) {
		await updateUnitFn({ data: {
			unitId,
			...contact
		} });
		await refresh();
	},
	async deleteUnit(unitId) {
		await deleteUnitFn({ data: { unitId } });
		await refresh();
	},
	async reset() {
		await resetDemoFn();
		await refresh();
	}
};
//#endregion
export { useBanksQuery as a, useEffectEvent as c, useLayoutEffect2 as d, useAccountBalanceQuery as i, useGatehouse as l, composeEventHandlers as n, useCallbackRef as o, store as r, useControllableState as s, Presence as t, useId as u };
