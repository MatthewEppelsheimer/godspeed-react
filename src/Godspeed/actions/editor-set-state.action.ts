import { GsRecordEditorData } from "../interfaces";
import { GsAction, GsActionTypes } from "./actions";

export interface GsActionEditorSetState extends GsAction {
	type: GsActionTypes.editorSetState;
	editorId: string;
	// Draft.js-related; migrating away soon
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	newEditorState: any;
	record?: GsRecordEditorData;
}

export function createGsActionEditorSetState(
	editorId: string,
	// Draft.js-related; migrating away soon
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	newEditorState: any,
	record?: GsRecordEditorData
): GsActionEditorSetState {
	const action: GsActionEditorSetState = {
		type: GsActionTypes.editorSetState,
		editorId,
		// Draft.js-related; migrating away soon
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		newEditorState,
	};

	if (undefined !== record) {
		action.record = record;
	}

	return action;
}
