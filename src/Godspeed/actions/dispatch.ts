import { Dispatch } from "react";

import {
	GsRecordCreationData,
	// GsRecordEditorData
} from "../interfaces";

import {
	// createGsActionEditorGainFocus,
	// createGsActionEditorSetState,
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
	const focusIn = () => {
		dispatch(createGsActionNavigationFocusIn());
	};
	const focusOut = () => {
		dispatch(createGsActionNavigationFocusOut());
	};

	const navigation = {
		focusIn,
		focusOut,
	};

	const create = (
		recordData: GsRecordCreationData,
		updateSearch?: boolean
	) => {
		dispatch(createGsActionRecordCreate(recordData, updateSearch));
	};
	const deleteRecord = (uuid: string) => {
		dispatch(createGsActionRecordDelete(uuid));
	};
	const updateRecord = (record: { uuid: string; body: string }) => {
		dispatch(createGsActionRecordUpdate(record));
	};

	const record = {
		create,
		delete: deleteRecord,
		update: updateRecord,
	};

	const blur = () => {
		dispatch(createGsActionSearchBlur());
	};
	const focus = () => {
		dispatch(createGsActionSearchFocus());
	};
	const updatePhrase = (newPhrase: string) => {
		dispatch(createGsActionSearchUpdate(newPhrase));
	};

	const search = {
		blur,
		focus,
		updatePhrase,
	};

	const next = () => {
		dispatch(createGsActionSelectionNext());
	};
	const previous = () => {
		dispatch(createGsActionSelectionPrevious());
	};
	const set = (newIndex: number) => {
		dispatch(createGsActionSelectionSet(newIndex));
	};

	const selection = {
		next,
		previous,
		set,
	};

	return {
		// editor: {
		// 	gainFocus: () => {
		// 		dispatch(createGsActionEditorGainFocus());
		// 	},
		// 	setState: (
		// 		editorId: string,
		// 		// Draft.js-related; migrating away soon
		// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// 		newEditorState: any,
		// 		record?: GsRecordEditorData
		// 	) => {
		// 		dispatch(
		// 			createGsActionEditorSetState(
		// 				editorId,
		// 				newEditorState,
		// 				record
		// 			)
		// 		);
		// 	},
		// },
		navigation,
		record,
		search,
		selection,
	};
}
