import { createContext, useContext } from "react";

const GodspeedContextEditors = createContext({
	// @todo add initial state
});
GodspeedContextEditors.displayName = "Godspeed Editor Context";

const useGodspeedContextEditors = () => {
	const context = useContext(GodspeedContextEditors);
	if (context === undefined) {
		throw new Error(
			"useGodspeedContextEditors must be used within a GodspeedContextEditors provider, such as the <Godspeed> component."
		);
	}

	return context;
};

export default GodspeedContextEditors;
export { useGodspeedContextEditors };
