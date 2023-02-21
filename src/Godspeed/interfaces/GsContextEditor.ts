// WIP creating real types for these
interface GsContextEditor {
	getEditorById: (id: string) => any; // returns an editor
	isEditorFocused: () => boolean;
	registerEditorGainedFocus: () => void;
}

export default GsContextEditor;
