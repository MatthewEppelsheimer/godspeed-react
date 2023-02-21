import { Dispatch } from "react";

import { GsRecordCreationData, GsRecordEditorData } from "../interfaces";

import {
	createGsActionEditorGainFocus,
	createGsActionEditorSetState,
	createGsActionNavigationFocusIn,
	createGsActionNavigationFocusOut,
	createGsActionRecordCreate,
	createGsActionRecordDelete,
	createGsActionRecordUpdate,
	createGsActionSearchBlur,
	createGsActionSearchFocus,
	createGsActionSearchUpdate,
	createGsActionSelectionNext,
	createGsActionSelectionPrevious,
	createGsActionSelectionSet,
	GsAction,
} from "./";

export function dispatchFactory(dispatch: Dispatch<GsAction>) {
	return {
		editor: {
			gainFocus: () => {
				dispatch(createGsActionEditorGainFocus());
			},
			setState: (
				editorId: string,
				newEditorState: any,
				record?: GsRecordEditorData
			) => {
				dispatch(
					createGsActionEditorSetState(
						editorId,
						newEditorState,
						record
					)
				);
			},
		},
		navigation: {
			focusIn: () => {
				dispatch(createGsActionNavigationFocusIn());
			},
			focusOut: () => {
				dispatch(createGsActionNavigationFocusOut());
			},
		},
		record: {
			create: (
				recordData: GsRecordCreationData,
				updateSearch?: boolean
			) => {
				dispatch(createGsActionRecordCreate(recordData, updateSearch));
			},
			delete: (uuid: string) => {
				dispatch(createGsActionRecordDelete(uuid));
			},
			update: (record: { uuid: string; body: string }) => {
				dispatch(createGsActionRecordUpdate(record));
			},
		},
		search: {
			blur: () => {
				dispatch(createGsActionSearchBlur());
			},
			focus: () => {
				dispatch(createGsActionSearchFocus());
			},
			update: (newPhrase: string) => {
				dispatch(createGsActionSearchUpdate(newPhrase));
			},
		},
		selection: {
			next: () => {
				dispatch(createGsActionSelectionNext());
			},
			previous: () => {
				dispatch(createGsActionSelectionPrevious());
			},
			set: (newIndex: number) => {
				dispatch(createGsActionSelectionSet(newIndex));
			},
		},
	};
}
