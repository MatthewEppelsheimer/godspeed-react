import { GsAction, GsActionTypes } from "./actions";

export interface GsActionNavigationFocusIn extends GsAction {
	type: GsActionTypes.navigationFocusIn;
}

export function createGsActionNavigationFocusIn(): GsActionNavigationFocusIn {
	return { type: GsActionTypes.navigationFocusIn };
}
