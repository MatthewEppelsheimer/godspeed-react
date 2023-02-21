import { GsAction, GsActionTypes } from "./actions";

export interface GsActionSearchFocus extends GsAction {
	type: GsActionTypes.searchFocus;
}

export function createGsActionSearchFocus(): GsActionSearchFocus {
	return { type: GsActionTypes.searchFocus };
}
