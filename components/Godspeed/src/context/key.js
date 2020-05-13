import { createContext, useContext } from "react";

const GodspeedContextKey = createContext({
	// @todo add initial state
});
GodspeedContextKey.displayName = "Godspeed Key Context";

const useGodspeedContextKey = () => {
	const context = useContext(GodspeedContextKey);
	if (context === undefined) {
		throw new Error(
			"useGodspeedContextKey must be used within a GodspeedContextKey, such as the <Godspeed> component."
		);
	}

	return context;
};

export default GodspeedContextKey;
export { useGodspeedContextKey };
