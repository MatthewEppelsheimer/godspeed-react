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
		editors: [{ id: "main" }],
		records: initialData,
		displayedRecords: initialData,
		selectionIndex: CONFIG.default_selected_index,
	};

	const [state, dispatch] = useReducer(dataReducer, indexData(initialState));

	// @todo refactor to combine these into the reducer
	const [searchPhrase, setSearchPhrase] = useState("");

	// get selection index
	const selectionIndex = () => state.selectionIndex;

	// set selection index
	const setSelectionIndex = (newIndex) => {
		const type = "selectionIndex.set";
		dispatch({ type, newIndex });
	};

	// wrap setSelectedResultIndex by updating selectionKey as well first
	const updateSelectedTo = (newValue) => {
		setSelectionIndex(newValue);
		// setSelectionKey(CONFIG.default_selected_index === newValue ? "" : state.records.find(result => newValue === result.index).key);
	};

	// completely replace records with passed-in state
	// so far unused
	const setRecordsTo = (records) => {
		dispatch({
			type: "records.set",
			records: records,
		});
	};

	// @TODO, and replace that state
	// const setSearchPhrase = (phrase) => {

	// };

	// @WIP replacing individual state with this
	// @TODO; make the reducer wrap in indexData()
	const setDisplayedRecords = (records) => {
		dispatch({
			type: "displayedRecords.set",
			records: records,
		});
	};

	// wrap setSearchPhrase() to also update results
	const updateSearch = (phrase) => {
		phrase = phrase || defaultSearchPhrase;

		// console.log('updateSearch called; phrase is', phrase);
		setSearchPhrase(phrase);
		// only recompute if not clearing search field
		// dispatch({
		//     type: 'setSearchPhrase',
		//     phrase: phrase,
		// });
		setDisplayedRecords(
			defaultSearchPhrase === phrase
				? state.records
				: indexData(search(phrase, state.records))
		);

		// @TODO: instead of this, update selectedIndex based on key here
		updateSelectedTo(CONFIG.default_selected_index);
	};

	// move selected result down one; don't go further than last result
	const selectNext = () => {
		const currentIndex = selectionIndex();
		const newIndex =
			state.displayedRecords.length - 1 === currentIndex
				? currentIndex
				: currentIndex + 1;
		updateSelectedTo(newIndex);
	};

	// move selected result up one; don't go further than -1, which is none selected
	const selectPrevious = () => {
		const currentIndex = selectionIndex();
		updateSelectedTo(
			CONFIG.default_selected_index === currentIndex
				? currentIndex
				: currentIndex - 1
		);
	};

	const createRecord = (record) => {
		// create the record
		const type = "record.create";

		const newRecord = {
			key: new Date().getTime(),
			name: record.name,
		};

		dispatch({
			type,
			newRecord,
		});

		updateSearch();

		// update external data store when there is one
		// @TODO avoid calling this if dispatching the action failed
		dataStore.create?.(newRecord);
	};

	// Delete a record
	const deleteRecord = (record) => {
		// this also removes it from displayedRecords
		dispatch({
			type: "record.delete",
			key: record.key,
		});

		// console.log('records before updateSearch:',state.records);

		// update external data store when there is one
		// @TODO avoid calling this if dispatching the action failed
		dataStore.delete?.(record);
	};

	// Update a record
	const updateRecord = (record, newBody) => {
		dispatch({
			type: "record.update",
			key: record.key,
			body: newBody,
		});

		// update external data store when there is one
		// @TODO avoid calling this if dispatching the action failed
		dataStore.update?.(record);
	};

	// Make a record the actively opened one
	const openRecordByIndex = (index, editorId = "main") => {
		const type = "record.setActive";
		dispatch({
			type,
			index,
			editorId,
		});

		// update external data store
		// @todo pretty sure this is broken
		dataStore.read?.(record);
	};

	// get an editor state
	const getEditorState = (editorId) => {
		const editor = state.editors.find((editor) => editorId === editor.id);
		return editor.state || null;
	};

	// set an editor state
	// possibly also update a record accordingly
	const setEditorState = (
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

		let alsoUpdatingRecord = false;
		if (record && newRecordBody) {
			action.record = record;
			action.newRecordBody = newRecordBody;
			alsoUpdatingRecord = true;
		}

		dispatch(action);

		// @todo consider debouncing internally
		if (alsoUpdatingRecord) {
			// @TODO avoid calling this if dispatching the action failed
			dataStore.update?.(record);
		}
	};

	// @todo to complete support for multiple editors add `createEditor()`

	const handleKeyEnter = () => {
		const currentIndex = selectionIndex();
		console.log(currentIndex);
		if (CONFIG.default_selected_index !== currentIndex) {
			// if something's selected, open it
			openRecordByIndex(currentIndex);
		} else {
			// if nothing selected:
			// create new record
			createRecord({ name: searchPhrase });
			// show all records (including new one)
			setDisplayedRecords(state.records);
			// select the new record
			updateSelectedTo(0);
		}
	};

	// Behavior spans across entire Godspeed context so this belongs here
	// first blur document editor & focus search,
	//  then clear selected result,
	//  then clear search input,
	//  then blur search input
	const handleKeyEscape = () => {
		let shouldBlurSearchField = false;
		const currentIndex = selectionIndex();

		if (false) {
			// @todo implement switch of focus from document editor to search field
		} else if (-1 !== currentIndex) {
			updateSelectedTo(CONFIG.default_selected_index);
		} else if ("" === searchPhrase) {
			shouldBlurSearchField = true;
			updateSelectedTo(CONFIG.default_selected_index);
		} else {
			updateSearch(defaultSearchPhrase);
			updateSelectedTo(CONFIG.default_selected_index);
		}

		return { shouldBlurSearchField };
	};

	const deprecatedController = {
		recordOps: {
			create: createRecord,
			delete: deleteRecord,
			update: updateRecord,
		},
		search: {
			phrase: searchPhrase,
			results: state.displayedRecords,
			update: updateSearch,
		},
		selection: {
			index: () => selectionIndex(),
			next: selectNext,
			previous: selectPrevious,
		},
		slotFills: slotFills,
	};

	// okay for each of these to be immutable; these are logical groupings, not
	// intended to serve as context provider values. For those, see
	// src/contexts.js

	const editorController = {
		getEditors: () => state.editors,
		getState: getEditorState,
		setState: setEditorState,
	};

	const keyController = {
		enter: () => handleKeyEnter(),
		escape: () => handleKeyEscape(),
	};

	return {
		deprecatedController,
		editorController,
		keyController,
	};
};

export { useGodspeed };
