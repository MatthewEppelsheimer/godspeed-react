import { createContext, useContext } from "react";

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

export default GodspeedContextEditorsMutable;
export { useGodspeedContextEditorsMutable };
