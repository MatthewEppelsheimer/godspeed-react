import { GsAction, GsActionTypes } from "./actions";

export interface GsActionSearchBlur extends GsAction {
	type: GsActionTypes.searchBlur;
}

export function createGsActionSearchBlur(): GsActionSearchBlur {
	return { type: GsActionTypes.searchBlur };
}
