import { isEqual } from "lodash";
import React, { createContext, useContext, useState, useRef } from "react";
import {
	GsContextEditor,
	GsContextControlImmutable,
	GsContextSearch,
	GsContextSelection,
} from "./interfaces";

const contextFactory = <T>(
	initialState: T,
	displayName: string
): [React.Context<T>, () => T] => {
	const context = createContext<T>(initialState);
	context.displayName = displayName;

	const hook = (): T => {
		const innerContext = useContext<T>(context);
		// @TODO rework or cut. From original JS, but messing up contextFactory return type.
		// if (innerContext === undefined) {
		// 	throw new Error(
		// 		`${hookName} must be used within a ${componentName} provider, such as the <Godspeed> component.`
		// 	);
		// }

		return innerContext;
	};
	return [context, hook];
};

// Only recreate mutable context values when their dependencies have changed
// See {@link https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback}
// @TODO include type parameters
const useMutableContext = (contextTemplate: any, dependencies: any) => {
	if (!Array.isArray(dependencies)) {
		dependencies = [dependencies];
	}
	const prevDeps = useRef({ current: null });

	const generateContext = () => {
		prevDeps.current = dependencies;
		return contextTemplate(dependencies);
	};
	const [value, set] = useState(() => generateContext());

	if (!prevDeps.current || !isEqual(prevDeps.current, dependencies)) {
		set(generateContext());
	}

	return value;
};

const [GodspeedContextEditor, useGodspeedContextEditor] = contextFactory<
	GsContextEditor
>(
	{
		// @TODO confirm these just need to pass type checking because they'll be set later
		// If so, better way?
		getEditorById: (id: string) => "",
		isEditorFocused: () => false,
		registerEditorGainedFocus: () => {},
	},
	"Godspeed Editor Context"
);
const [
	GodspeedContextControlImmutable,
	useGodspeedContextControlImmutable,
] = contextFactory<GsContextControlImmutable>(
	{
		editor: {
			getState: () => {},
			setState: (id: any, state: any) => {},
			focusEditor: () => {},
		},
		key: {
			enter: () => {},
			escape: () => {},
		},
		record: {
			create: () => {},
			del: (record: any) => {},
			updateRecord: () => {},
		},
		search: {
			blur: () => {},
			focus: () => {},
			updateSearch: (phrase: string) => {},
		},
		selection: {
			next: () => {},
			previous: () => {},
			setIndex: () => {},
		},
		slotFills: {},
	},
	"Godspeed Control Immutable Context"
);
const [GodspeedContextSearch, useGodspeedContextSearch] = contextFactory<
	GsContextSearch
>(
	{
		focused: false,
		phrase: "",
		results: [],
	},
	"Godspeed Search Context"
);
const [GodspeedContextSelection, useGodspeedContextSelection] = contextFactory<
	GsContextSelection
>(
	{
		index: -1,
	},
	"Godspeed Selection Context"
);

export {
	GodspeedContextEditor,
	GodspeedContextControlImmutable,
	GodspeedContextSearch,
	GodspeedContextSelection,
	useGodspeedContextControlImmutable,
	useGodspeedContextEditor,
	useGodspeedContextSearch,
	useGodspeedContextSelection,
	useMutableContext,
};
