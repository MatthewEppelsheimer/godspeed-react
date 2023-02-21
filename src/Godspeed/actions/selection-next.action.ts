import { GsAction, GsActionTypes } from "./actions";

export interface GsActionSelectionNext extends GsAction {
	type: GsActionTypes.selectionNext;
}

export function createGsActionSelectionNext(): GsActionSelectionNext {
	return { type: GsActionTypes.selectionNext };
}
