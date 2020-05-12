import { createContext, useContext } from "react";
import CONFIG from "../config";

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
// @todo add defaultProps and propTypes

const GodspeedContextProviders = (props) => {
	const { children, controllers } = props;

	const { deprecatedController } = controllers;

	return (
		<GodspeedContextDEPRECATED.Provider value={deprecatedController}>
			{children}
		</GodspeedContextDEPRECATED.Provider>
	);
};
// @todo add defaultProps and propTypes

export default GodspeedContextDEPRECATED;
export { useGodspeedContextDEPRECATED, GodspeedContextProviders };
