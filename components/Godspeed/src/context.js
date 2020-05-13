import { createContext, useContext } from "react";

const contextFactory = (initialState, displayName, componentName, hookName) => {
	const context = createContext(initialState);
	context.displayName = displayName;

	const hook = () => {
		const innerContext = useContext(context);
		if (innerContext === undefined) {
			throw new Error(
				`${hookName} must be used within a ${componentName} provider, such as the <Godspeed> component.`
			);
		}

		return innerContext;
	};
	return [context, hook];
};

const [GodspeedContextEditor, useGodspeedContextEditor] = contextFactory(
	{}, // @todo initial state
	"Godspeed Editor Context",
	"GodspeedContextEditor",
	"useGodspeedContextEditor"
);
const [GodspeedContextImmutable, useGodspeedContextImmutable] = contextFactory(
	{}, // @todo initial state
	"Godspeed Immutable Context",
	"GodspeedContextImmutable",
	"useGodspeedContextImmutable"
);
const [GodspeedContextSearch, useGodspeedContextSearch] = contextFactory(
	{}, // @todo initial state
	"Godspeed Search Context",
	"GodspeedContextSearch",
	"useGodspeedContextSearch"
);
const [GodspeedContextSelection, useGodspeedContextSelection] = contextFactory(
	{}, // @todo initial state
	"Godspeed Selection Context",
	"GodspeedContextSelection",
	"useGodspeedContextSelection"
);

export {
	GodspeedContextEditor,
	GodspeedContextImmutable,
	GodspeedContextSearch,
	GodspeedContextSelection,
	useGodspeedContextEditor,
	useGodspeedContextImmutable,
	useGodspeedContextSearch,
	useGodspeedContextSelection,
};
