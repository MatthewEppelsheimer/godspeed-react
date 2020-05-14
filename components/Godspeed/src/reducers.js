import CONFIG from "../config";
import { log } from "./log";
import { indexData, search } from "./search";

const DEBUG = true;

const dataReducer = (state, action) => {
	const newState = { ...state };

	/// UTILITIES
	///
	/// **Utilities get data for transformations' use**

	const focusElement = (name) => {
		// pattern to go toward
		newState.focusedElement = name;

		// @todo revise away this original shape idea
		switch (name) {
			case "editor":
				newState.searchFieldFocused = false;
				break;

			case "search":
				newState.searchFieldFocused = true;
				break;
		}
	};

	const getRecordByIndex = (index) => {
		DEBUG &&
			console.log(
				"running reducer utility getRecordByIndex with:",
				index
			);
		return state.records.find((record) => index === record.index);
	};

	/// TRANSFORMATIONS
	///
	/// Transformations directly modify newState, without knowing about action

	// *** Displayed Record Transformations ***

	const setDisplayedRecordsTo = (records) => {
		DEBUG &&
			console.log(
				"performing transformation setDisplayedRecordsTo with:",
				records
			);
		newState.displayedRecords = indexData(records);
	};

	const setDisplayedRecordsToAllNew = () => {
		DEBUG &&
			console.log(
				"performing transformation setDisplayedRecordsToAllNew",
				"newState:",
				newState
			);

		setDisplayedRecordsTo(newState.records);
	};

	// *** Editor Transformations ***

	// Give focus to the editor
	const editorFocus = () => {
		focusElement("editor");
	};

	// update an editor to a new state
	const editorUpdateState = (id, newEditorState) => {
		DEBUG &&
			console.log(
				"performing transformation editorUpdateState with:",
				id,
				newEditorState
			);
		newState.editors.map((editor) => {
			if (id === editor.id) {
				editor.state = newEditorState;
			}
			return editor;
		});
	};

	// *** Record Transformations ***

	// Add a new record to and re-index state.records
	const recordCreate = (record = {}) => {
		DEBUG &&
			console.log("performing transformation recordCreate with:", record);
		const body = record?.body || "";
		const key = new Date().getTime();
		const name = record?.name || "";

		const newRecord = {
			body,
			key,
			name,
		};
		newState.records.unshift(newRecord);
		newState.records = indexData(newState.records);

		newState?.dataStore?.create?.(newRecord);
	};

	const recordCreateFromSearchPhrase = () => {
		DEBUG &&
			console.log(
				"performing transformation recordCreateFromSearchPhrase"
			);

		const name = state.searchPhrase;
		const body = state.searchPhrase;

		recordCreate({ name, body });
	};

	// Delete a record and remove it from search results
	const recordDelete = (record) => {
		DEBUG &&
			console.log("performing transformation recordDelete with:", record);
		const filter = (records) => {
			const newRecords = records.filter((rec) => record.key !== rec.key);
			return indexData(newRecords);
		};

		// @todo stopping after done would be more efficient than always looping through all records
		newState.records = filter(newState.records);
		newState.displayedRecords = filter(newState.displayedRecords);

		newState?.dataStore?.delete?.(record);
	};

	// Open a record in an editor, defaults to editorId of "main"
	const recordOpenInEditor = (record, editorId = "main") => {
		DEBUG &&
			console.log(
				"performing transformation recordOpenInEditor with:",
				record,
				editorId
			);
		const id = editorId;
		const newEditor = {
			id,
			record,
		};

		let uninitialized = true; // assume the new editor doesn't exist yet
		newState.editors = newState.editors.map((editor) => {
			if (editorId === editor.id) {
				editor = newEditor;
				uninitialized = false; // it exists
			}

			return editor;
		});

		// initialize the editor if needed
		if (uninitialized) {
			newState.editors.unshift(newEditor);
		}

		newState?.dataStore?.read?.(record);
	};

	// Update a pre-existing record whose id matches the new record state passed in
	// Only overwrites record values that are explicitly set (not null)
	// @todo implement debouncing with overridable default duration
	const recordUpdate = (record = {}) => {
		DEBUG &&
			console.log("performing transformation recordUpdate with:", record);
		const id = record?.key || null;
		const name = record?.name || null;
		const body = record?.body || null;

		// @todo warn if not passed at least record.id

		newState.records.map((rec) => {
			if (id === rec.key) {
				rec.body = body ?? rec.body;
				rec.name = name ?? rec.body;
			}
			return rec;
		});

		newState?.dataStore?.update?.(record);
	};

	// *** Search Transformations ***

	const setSearchPhrase = (phrase = "") => {
		DEBUG && console.log("performing transformation setSearchPhrase with:");
		newState.searchPhrase = phrase;
	};

	const searchFieldBlur = () => {
		DEBUG && console.log("performing transformation searchFieldBlur with:");
		newState.searchFieldFocused = false;
	};

	const searchFieldFocus = () => {
		DEBUG &&
			console.log("performing transformation searchFieldFocus with:");

		focusElement("search");
	};

	// *** Selection Transformations ***

	const setSelectionIndex = (newIndex) => {
		DEBUG &&
			console.log(
				"performing transformation setSelectionIndex with:",
				newIndex
			);

		newState.selectionIndex = newIndex;
	};

	// Move selection to the next result, not going past the last one
	const selectNext = () => {
		DEBUG && console.log("performing transformation selectNext with:");

		const newIndex =
			state.displayedRecords.length - 1 === state.selectionIndex
				? state.selectionIndex
				: state.selectionIndex + 1;

		setSelectionIndex(newIndex);
	};

	// Move selection to the previous result, not going past nothing selected (-1)
	const selectPrevious = () => {
		DEBUG && console.log("performing transformation selectPrevious");

		const newIndex =
			-1 === state.selectionIndex
				? state.selectionIndex
				: state.selectionIndex - 1;

		setSelectionIndex(newIndex);
	};

	/// ACTION HANDLING
	///
	/// Action handlers use transforms exclusively to manipulate newState
	try {
		DEBUG && console.log("doing action:", action);

		switch (action.type) {
			// *** Editor Actions ***

			// give focus to the editor
			case "editor.gainFocus":
				editorFocus();
				break;

			// Set an editor's state
			case "editor.setState":
				editorUpdateState(action.editorId, action.newEditorState);

				if (action?.record?.key) {
					recordUpdate({
						id: action.record.key,
						name: action.record?.name || null,
						body: action.record?.body || null,
					});
				}
				break;

			// *** Navigation Actions ***

			// handle "focusing in"
			// @todo Something like state.navigationFocus might be more flexible/elegant to query vs selectionIndex
			case "navigation.focusIn":
				if (-1 !== state.selectionIndex) {
					// If there is a record selected, open it
					const record = getRecordByIndex(state.selectionIndex);
					recordOpenInEditor(record);
					focusDocumentEditor;
				} else if (state.searchFieldFocused) {
					// Nothing is selected but the search field is in focus
					// time to create a new record using the search phrase
					recordCreateFromSearchPhrase();
					// show all records, including the new one
					setDisplayedRecordsToAllNew();
					// select the new record
					setSelectionIndex(0);
					// open the new record in the editor
					const newRecord = getRecordByIndex(0);
					recordOpenInEditor(newRecord);
					// give the record focus
					editorFocus();
					// intentionally NOT updating search phrase
				}
				break;

			// handle "focusing out"
			// @todo convert to using state.navigationFocus along w/ navigation.focusIn
			case "navigation.focusOut":
				if (false) {
					// if document editor is active, switch focus to search field
					// @todo implement switch of focus from document editor to search field
				} else if (-1 !== state.selectionIndex) {
					//  if a displayed result is selected (highlighted), unselect it
					DEBUG && console.log("unselecting");
					setSelectionIndex(-1);
				} else if ("" !== state.searchPhrase) {
					// if there is a search phrase, clear it
					DEBUG && console.log("clearing search phrase");
					setSearchPhrase();
				} else {
					// if search field is focused, blur it
					DEBUG && console.log("blurring searchfield");
					searchFieldBlur();
				}
				break;

			// *** Record Actions ***

			// add record to dataset, maybe updating search
			case "record.create":
				recordCreate(action.record);

				if (action.updateSearch) {
					setSearchPhrase("");
				}
				break;

			// delete record from dataset and remove it from search results
			case "record.delete":
				recordDelete(action.record);
				break;

			// update a active document
			case "record.update":
				recordUpdate(action.record);
				break;

			// *** Search Actions ***

			// blur search field
			case "search.blurSearchField":
				searchFieldBlur();
				break;

			// focus search field
			case "search.focusSearchField":
				searchFieldFocus();
				break;

			// update search phrase,
			case "search.updatePhrase":
				setSearchPhrase(action?.newPhrase || "");
				break;

			// *** Selection Actions ***

			// Set the current selection index
			case "selectionIndex.set":
				setSelectionIndex(action.newIndex);
				break;

			case "selection.next":
				selectNext();
				break;

			case "selection.previous":
				selectPrevious();
				break;

			// *** Action Error Handling ***

			default:
				log(new Error("unrecognized action.type"));
				break;
		}
	} catch (error) {
		log(error);
	}

	/// RECONCILIATION
	///
	/// Reconcile consequenses state transformations have for other parts of state

	// When search phrase has changed, ALWAYS update search results
	if (state.searchPhrase !== newState.searchPhrase) {
		const newSearchResults = search(
			newState.searchPhrase,
			newState.records
		);
		setDisplayedRecordsTo(newSearchResults);
	}

	// Update selection to track selected result or clear it when search narrows
	if (
		state.displayedRecords !== newState.displayedRecords &&
		-1 !== state.selectionIndex
	) {
		let stillInFoundSet = false;

		const selectedRecord = state.displayedRecords.find((record) => {
			state.selectionIndex === record.index;
		});

		if (selectedRecord) {
			newState.displayedRecords.map((record) => {
				if (selectedRecord.key === record.key) {
					stillInFoundSet = true;
					setSelectionIndex(record.index);
				}
				return record;
			});
		}
		if (!stillInFoundSet) {
			setSelectionIndex(-1);
		}
	}

	return newState;
};

export { dataReducer };
