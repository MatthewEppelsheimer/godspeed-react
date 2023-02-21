import { GsAction, GsActionTypes } from "./actions";

export interface GsActionSelectionPrevious extends GsAction {
	type: GsActionTypes.selectionPrevious;
}

export function createGsActionSelectionPrevious(): GsActionSelectionPrevious {
	return { type: GsActionTypes.selectionPrevious };
}
