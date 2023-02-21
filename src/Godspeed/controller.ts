/**
 * Godspeed app-level state management
 */
import { ReducerState, useMemo, useReducer } from "react";

import { dispatchFactory } from "./actions";
import CONFIG from "./config";
import { indexData } from "./search";
import { dataReducer, GsDataReducer } from "./reducers";
import {
	GsFocusedElement,
	GsRecord,
	GsRecordCreationData,
	GsRecordEditorData,
	GsRecordUpdateData,
} from "./interfaces";

// custom hook to abstract core <Godspeed /> functionality, to provide context from component state
const useGodspeed = (options: {
	records: GsRecord[];
	dataStore: any;
	slotFills: any;
	defaultSearchPhrase: any;
}) => {
	const { records, dataStore, slotFills, defaultSearchPhrase } = options;
	const initialData = useMemo(() => indexData(records), [records]);
	const initialState: ReducerState<GsDataReducer> = {
		dataStore: dataStore,
		editors: [{ id: "main", state: undefined }], // @TODO properly type `.state`
		records: initialData,
		displayedRecords: initialData,
		searchPhrase: defaultSearchPhrase,
		selectionIndex: CONFIG.default_selected_index,
		focusedElement: GsFocusedElement.search,
	};

	const [state, reducerDispatch] = useReducer(dataReducer, initialState);
	const dispatch = dispatchFactory(reducerDispatch);

	// okay for each of these to be immutable; these are logical groupings, not
	// intended to serve as context provider values. For those, see
	// src/contexts.js

	const editorAccess = {
		focusEditor: () => {
			dispatch.editor.gainFocus();
		},

		getEditors: () => state.editors,

		getState: (editorId: any) => {
			const editor = state.editors.find(
				(editor: any) => editorId === editor.id
			);
			return editor?.state || null;
		},

		isEditorFocused: () => "editor" === state.focusedElement,

		setState: (
			editorId: any,
			newEditorState: any,
			record?: GsRecordEditorData // not sure I got this right. Signature previously included separate params for `record` and `newRecordBody`
		) => {
			const type = "editor.setState";
			const action: {
				type: string;
				editorId: any;
				newEditorState: any;
				record?: any;
			} = {
				type,
				editorId,
				newEditorState,
			};

			dispatch.editor.setState(editorId, newEditorState, record);
		},
	};

	const keyAccess = {
		enter: () => {
			dispatch.navigation.focusIn();
		},
		escape: () => {
			dispatch.navigation.focusOut();
		},
	};

	const recordAccess = {
		// optionally suppress updating search with updateSearch = false
		create: (
			recordData: GsRecordCreationData = {},
			updateSearch = true
		) => {
			dispatch.record.create(recordData, updateSearch);
		},

		// Delete a record and remove it from displayedRecords
		// @TODO create a GsRecordDeleteData for consistency
		del: (record: Pick<GsRecord, "uuid">) => {
			dispatch.record.delete(record.uuid);
		},

		// @todo after finish controller/reducer refactor, update callers' signatures to pass newBody as a member of record
		update: (record: GsRecordUpdateData) => {
			dispatch.record.update(record);
		},
	};

	const searchAccess = {
		// blur search field
		blur: () => {
			dispatch.search.blur();
		},

		// focus search field
		focus: () => {
			dispatch.search.focus();
		},

		// Get current search phrase
		getPhrase: () => state.searchPhrase,

		// Get records in current search results
		getResults: () => state.displayedRecords,

		// Report whether search field is focused
		isSearchFieldFocused: () =>
			GsFocusedElement.search === state.focusedElement,

		update: (newPhrase: string = "") => {
			dispatch.search.update(newPhrase);
		},
	};

	// @TODO support concurrent active result views (will involve rethinking terminology)
	const selectionAccess = {
		// Get selection index
		getIndex: () => state.selectionIndex,

		// move selection to next result; don't go further than last result
		next: () => {
			dispatch.selection.next();
		},

		// move selected result up one; don't go further than -1, which is none selected
		previous: () => {
			dispatch.selection.previous();
		},

		// set selection index
		setIndex: (newIndex: number) => {
			const type = "selectionIndex.set";
			dispatch.selection.set(newIndex);
		},
	};

	// @TODO it's a bit weird to pass this through in this way; slotFills is a <Godspeed> prop
	const slotFillAccess = {
		slotFills,
	};

	return {
		editorAccess,
		keyAccess,
		recordAccess,
		searchAccess,
		selectionAccess,
		slotFillAccess,
	};
};

export { useGodspeed };
