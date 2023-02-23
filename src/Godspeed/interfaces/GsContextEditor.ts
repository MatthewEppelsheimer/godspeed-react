import GsEditorData from "./GsEditorData";

interface GsContextEditor {
	// Draft.js related; migrating away soon
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getEditorById: (id: string) => GsEditorData;
	isEditorFocused: () => boolean;
	registerEditorGainedFocus: () => void;
}

export default GsContextEditor;
