import { GsRecordEditorData } from "./";

interface GsEditorActions {
	focus: () => void;
	getEditors: () => any;
	getState: (editorId: any) => any;
	isEditorFocused: () => boolean;
	setState: (
		editorId: string,
		newEditorState: any,
		record: GsRecordEditorData,
		newRecordBody: any
	) => void;
}

export default GsEditorActions;
