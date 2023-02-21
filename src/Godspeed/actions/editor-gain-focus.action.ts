import { GsAction, GsActionTypes } from "./actions";

export interface GsActionEditorGainFocus extends GsAction {
	type: GsActionTypes.editorGainFocus;
}

export function createGsActionEditorGainFocus(): GsActionEditorGainFocus {
	return { type: GsActionTypes.editorGainFocus };
}
