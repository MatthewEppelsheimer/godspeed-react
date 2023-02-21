import { GsAction, GsActionTypes } from "./actions";

export interface GsActionSelectionSet extends GsAction {
	type: GsActionTypes.selectionSet;
	newIndex: number;
}

export function createGsActionSelectionSet(
	newIndex: number
): GsActionSelectionSet {
	return { type: GsActionTypes.selectionSet, newIndex };
}
