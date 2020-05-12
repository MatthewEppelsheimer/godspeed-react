import { createContext, useContext } from "react";
import CONFIG from "../config";

// @todo add defaultProps and propTypes for all components

const GodspeedContextDEPRECATED = createContext({
	// @TODO convert to TypeScript interface
	// @todo update based on what's actually returned
	editors: [{ id: "main" }],
	handleKey: {
		escape: () => {},
	},
	search: {
		phrase: "",
		results: [],
		update: () => {},
	},
	selection: {
		document: null,
		index: CONFIG.default_selected_index,
		next: () => {},
		previous: () => {},
	},
});
GodspeedContextDEPRECATED.displayName = "Godspeed Context";

// Wrap useContext(GodspeedContextDEPRECATED) in a check that a provider was found
const useGodspeedContextDEPRECATED = () => {
	const context = useContext(GodspeedContextDEPRECATED);
	if (context === undefined) {
		throw new Error(
			"useGodspeedContextDEPRECATED must be used within a GodspeedContextDEPRECATEDProvider, such as the <Godspeed> component."
		);
	}

	return context;
};

const GodspeedContextEditors = createContext({
	// @todo add initial state
});
GodspeedContextEditors.displayName = "Godspeed Editor Context";

const GodspeedContextEditorsMutable = createContext({
	// @todo add initial state
});
GodspeedContextEditorsMutable.displayName = "Godspeed Mutable Editor Context";

const useGodspeedContextEditorsMutable = () => {
	const context = useContext(GodspeedContextEditorsMutable);
	if (context === undefined) {
		throw new Error(
			"useGodspeedContextEditorsMutable must be used within a GodspeedContextEditorsMutable, such as the <Godspeed> component."
		);
	}

	return context;
};

const GodspeedContextProviders = (props) => {
	const { children, controllers } = props;

	const { deprecatedController, editorController } = controllers;

	const { getEditors } = editorController;
	const editors = getEditors();
	const editorMutableContext = {
		editors: editors,
		getEditorById: (id) => editors.find((editor) => id === editor.id),
	};

	return (
		<GodspeedContextDEPRECATED.Provider value={deprecatedController}>
			<GodspeedContextEditorsMutable.Provider
				value={editorMutableContext}
			>
				{children}
			</GodspeedContextEditorsMutable.Provider>
		</GodspeedContextDEPRECATED.Provider>
	);
};
// @todo add defaultProps and propTypes

export default GodspeedContextDEPRECATED;
export {
	useGodspeedContextDEPRECATED,
	useGodspeedContextEditorsMutable,
	GodspeedContextProviders,
	GodspeedContextEditors,
	GodspeedContextEditorsMutable,
};
