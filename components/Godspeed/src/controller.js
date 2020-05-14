/**
 * Godspeed app-level state management
 */
import { useMemo, useState, useReducer } from "react";
import CONFIG from "../config";
import { indexData, search } from "./search";
import { dataReducer } from "./reducers";

// custom hook to abstract core <Godspeed /> functionality, to provide context from component state
const useGodspeed = (options) => {
	const { records, dataStore, slotFills, defaultSearchPhrase } = options;
	const initialData = useMemo(() => indexData(records), [records]); // ONLY for setting INITIAL state values
	const initialState = {
		dataStore: dataStore,
		editors: [{ id: "main" }],
		records: initialData,
		displayedRecords: initialData,
		searchPhrase: defaultSearchPhrase,
		selectionIndex: CONFIG.default_selected_index,
		searchFieldFocused: true, // open app with search field focused
	};

	const [state, dispatch] = useReducer(dataReducer, indexData(initialState));

	// okay for each of these to be immutable; these are logical groupings, not
	// intended to serve as context provider values. For those, see
	// src/contexts.js

	const editorAccess = {
		focusEditor: () => {
			dispatch({ type: "editor.gainFocus" });
		},

		getEditors: () => state.editors,

		getState: (editorId) => {
			const editor = state.editors.find(
				(editor) => editorId === editor.id
			);
			return editor.state || null;
		},

		isEditorFocused: () => state.editor,

		setState: (
			editorId,
			newEditorState,
			record = null,
			newRecordBody = null
		) => {
			const type = "editor.setState";
			const action = {
				type,
				editorId,
				newEditorState,
			};

			if (record && newRecordBody) {
				action.record = record;
				action.record.body = newRecordBody;
			}

			dispatch(action);
		},
	}; // editorAccess

	const keyAccess = {
		enter: () => {
			dispatch({ type: "navigation.focusIn" });
		},
		escape: () => {
			dispatch({ type: "navigation.focusOut" });
		},
	}; // keyAccess

	const recordAccess = {
		// create a new record
		// optionally suppress updating search with updateSearch = false
		create: (record = {}, updateSearch = true) => {
			const type = "record.create";
			dispatch({
				type,
				record,
				updateSearch,
			});
		},

		// Delete a record and remove it from displayedRecords
		del: (record) => {
			const type = "record.delete";
			dispatch({
				type,
				record,
			});
		},

		// @todo after finish controller/reducer refactor, update callers' signatures to pass newBody as a member of record
		update: (record) => {
			const type = "record.update";
			dispatch({
				type,
				record,
			});
		},
	}; // recordAccess

	const searchAccess = {
		// blur search field
		blur: () => {
			dispatch({ type: "search.blurSearchField" });
		},

		// focus search field
		focus: () => {
			dispatch({ type: "search.focusSearchField" });
		},

		// Get current search phrase
		getPhrase: () => state.searchPhrase,

		// Get records in current search results
		getResults: () => state.displayedRecords,

		// Report whether search field is focused
		isSearchFieldFocused: () => state.searchFieldFocused,

		update: (newPhrase = null) => {
			const type = "search.updatePhrase";

			dispatch({
				type,
				newPhrase,
			});
		},
	}; // searchAccess

	// @todo support concurrent active result views (will involve rethinking terminology)
	const selectionAccess = {
		// Get selection index
		getIndex: () => state.selectionIndex,

		// move selection to next result; don't go further than last result
		next: () => {
			dispatch({ type: "selection.next" });
		},

		// move selected result up one; don't go further than -1, which is none selected
		previous: () => {
			dispatch({ type: "selection.previous" });
		},

		// set selection index
		setIndex: (newIndex) => {
			const type = "selectionIndex.set";
			dispatch({
				type,
				newIndex,
			});
		},
	}; // selectionAccess

	// @todo it's a bit weird to pass this through in this way; slotFills is a <Godspeed> prop
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
