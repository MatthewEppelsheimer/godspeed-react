import { PropsWithChildren } from "react";
import { GsActions, GsStateData } from "./";

interface GsContextProvidersProps extends PropsWithChildren {
	actions: GsActions;
	godspeedState: GsStateData;
}

export default GsContextProvidersProps;
