export enum GsActionTypes {
	editorGainFocus = "editor.gainFocus",
	editorSetState = "editor.setState",
	navigationFocusIn = "navigation.focusIn",
	navigationFocusOut = "navigation.focusOut",
	recordCreate = "record.create",
	recordDelete = "record.delete",
	recordUpdate = "record.update",
	searchBlur = "search.blur",
	searchFocus = "search.focus",
	searchUpdate = "search.update",
	selectionSet = "selection.set",
	selectionNext = "selection.next",
	selectionPrevious = "selection.previous",
}

export interface GsAction {
	type: GsActionTypes;
}
