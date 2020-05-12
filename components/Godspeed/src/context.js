import { createContext, useContext } from "react";
import CONFIG from "../config";

const GodspeedContext = createContext({
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
GodspeedContext.displayName = "Godspeed Context";

// Wrap useContext(GodspeedContext) in a check that a provider was found
const useGodspeedContext = () => {
	const context = useContext(GodspeedContext);
	if (context === undefined) {
		throw new Error(
			"useGodspeedContext must be used within a GodspeedContextProvider, such as the <Godspeed> component."
		);
	}

	return context;
};
// @todo add defaultProps and propTypes

const GodspeedContextProvider = (props) => {
	const { children, value } = props;

	return (
		<GodspeedContext.Provider value={value}>
			{children}
		</GodspeedContext.Provider>
	);
};
// @todo add defaultProps and propTypes

export default GodspeedContext;
export { useGodspeedContext, GodspeedContextProvider };
