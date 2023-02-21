import { GsRecordEditorData } from "../interfaces";
import { GsAction, GsActionTypes } from "./actions";

export interface GsActionEditorSetState extends GsAction {
	type: GsActionTypes.editorSetState;
	editorId: string;
	newEditorState: any;
	record?: GsRecordEditorData;
}

export function createGsActionEditorSetState(
	editorId: string,
	newEditorState: any,
	record?: GsRecordEditorData
): GsActionEditorSetState {
	const action: GsActionEditorSetState = {
		type: GsActionTypes.editorSetState,
		editorId,
		newEditorState,
	};

	if (undefined !== record) {
		action.record = record;
	}

	return action;
}
