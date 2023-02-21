import { GsAction, GsActionTypes } from "./actions";

export interface GsActionSearchUpdate extends GsAction {
	type: GsActionTypes.searchUpdate;
	newPhrase: string;
}

export function createGsActionSearchUpdate(
	newPhrase: string
): GsActionSearchUpdate {
	return { type: GsActionTypes.searchUpdate, newPhrase };
}
