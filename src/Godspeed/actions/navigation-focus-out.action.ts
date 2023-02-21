import { GsAction, GsActionTypes } from "./actions";

export interface GsActionNavigationFocusOut extends GsAction {
	type: GsActionTypes.navigationFocusOut;
}

export function createGsActionNavigationFocusOut(): GsActionNavigationFocusOut {
	return { type: GsActionTypes.navigationFocusOut };
}
