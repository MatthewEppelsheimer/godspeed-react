import { createContext, useContext } from "react";
import CONFIG from "../../config";

const GodspeedContextDEPRECATED = createContext({
	// won't implement initial state because this is deprecated
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

export default GodspeedContextDEPRECATED;

export { useGodspeedContextDEPRECATED };
