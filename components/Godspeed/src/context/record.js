import { createContext, useContext } from "react";

const GodspeedContextRecord = createContext({
	// @todo add initial state
});
GodspeedContextRecord.displayName = "Godspeed Mutable Editor Context";

const useGodspeedContextRecord = () => {
	const context = useContext(GodspeedContextRecord);
	if (context === undefined) {
		throw new Error(
			"useGodspeedContextRecord must be used within a GodspeedContextRecord, such as the <Godspeed> component."
		);
	}

	return context;
};

export default GodspeedContextRecord;
export { useGodspeedContextRecord };
