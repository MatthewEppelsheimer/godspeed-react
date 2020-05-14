import CONFIG from "../config";
import { log } from "./log";
import { indexData, search } from "./search";

const DEBUG = false;

/**
 * Reduce actions down into state changes.
 *
 * Shaped to pass to React's useReducer(), for the useGodspeed() custom hook.
 * This owns the shape of app-level state and the logic to transform it.
 * It has four major sections:
 *
 *     1. Utilities for transformations. Agnostic to `action`, `newState`, and `state`.
 *     2. Transformations to `newState`. Imperative, discrete, logic-free, agnostic to `action` and `state`.
 *     3. Reducers compose Transformations based on `action` and `state`. Declarative logic, agnostic to `newState`.
 *     4. Reconciliation of any additional consequences to state of previous transformations.
 *
 * The primary role of reducers is composing `newState` from pre-existing
 * `state` in response to an `action`. `newState` is copied from `state` as the
 * very first step, and all functions are declared in scope for the convenience
 * of having access to both.
 *
 * Separating Transformations from Reducers (and Utilities from Transformations)
 * maximizes code reuse and allows thinking in a high-level/declarative mode
 * and in a low-level/imperative mode separately. This structure slows down
 * writing code but significantly speeds up reading, testing, and maintaining
 * it.
 *
 * Organizing Reconciliation as a separate step eases the burden of applying
 * all logical consequences that transformations have for other parts of
 * state. This is very useful since various actions may share consequences
 * and it would be difficult to remember all of the places where
 * all consequences apply — not to mention wasteful to do so multiple times.
 * The best example of the value of reconciliation is updating the selected
 * result when the contents of the Result List changes.
 *
 * `state` is treated as immutable throughout all parts of the reducer. This
 * is consistent with React convention (for various reasons), and is especially
 * useful here as `state` remains an untouched archive of state before any
 * transformations, which is useful for comparisons throughout.
 *
 * @todo {@priority low} An adaptation of {@link https://github.com/yannickcr/eslint-plugin-react/blob/master/lib/rules/no-direct-mutation-state.js} would be swell
 *
 * @param {object} state State managed by useReducer before transformations.
 * @param {object} action An action passed to dispatch() in the controller.
 *                        Must include a `type` member.
 *
 * @returns {object} `newState`, a transformed `state` after applying the action.
 */
const dataReducer = (state, action) => {
	// We treat state as immutable, so start with a fresh copy
	const newState = { ...state };

	/**
	 * UTILITIES
	 *
	 * Utilities Manipulate data for transformations' use.
	 *
	 * Do: One thing only.
	 * Do NOT: Access `state`, `newState`, or `action`.
	 */

	const getRecordByIndex = (index) => {
		DEBUG &&
			console.log(
				"running reducer utility getRecordByIndex with:",
				index
			);
		return state.records.find((record) => index === record.index);
	};

	/**
	 * TRANSFORMATIONS
	 *
	 * Transformations carry out state change instructions imperatively.
	 *
	 * Do:
	 *     - One thing only.
	 *     - Modify `newState`
	 *
	 * Generally AVOID:
	 *     - Accessing `state`, though that
	 *
	 *  Do NOT:
	 *     - Access `action`
	 */
	///
	///
	///

	// *** Displayed Record Transformations ***

	const focusElement = (name) => {
		// pattern to go toward
		newState.focusedElement = name;

		// @todo revise away this original shape idea; `focusedElement: string` is much better
		switch (name) {
			case "editor":
				newState.searchFieldFocused = false;
				break;

			case "search":
				newState.searchFieldFocused = true;
				break;
		}
	};

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

	/**
	 * Give focus to the editor
	 */
	const editorFocus = () => {
		focusElement("editor");
	};

	/**
	 * Update an editor to a new state.
	 * @param {string} id Editor id.
	 * @param {object} newEditorState New editor state.
	 */
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

	/**
	 * Add a new record to and re-index `state.records`.
	 * @param {object} record Record to add. Can have
	 *
	 * @todo support dynamic shapes with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 * @todo confirm that `link` tag in the todo above works in JSDoc output
	 */
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

	/**
	 * Create a new record from search input.
	 *
	 * @todo support dynamic shapes with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 */
	const recordCreateFromSearchPhrase = () => {
		DEBUG &&
			console.log(
				"performing transformation recordCreateFromSearchPhrase"
			);

		const name = state.searchPhrase;
		const body = state.searchPhrase;

		recordCreate({ name, body });
	};

	/**
	 * Delete a record and remove it from search results.
	 * @param {object} record Record to delete from results
	 *
	 * @todo support dynamic shape with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 */
	const recordDelete = (record) => {
		DEBUG &&
			console.log("performing transformation recordDelete with:", record);

		// @todo performance optimization: stop after find one instead of looping through all
		const filter = (records) => {
			const newRecords = records.filter((rec) => record.key !== rec.key);
			return indexData(newRecords);
		};

		newState.records = filter(newState.records);
		newState.displayedRecords = filter(newState.displayedRecords);

		newState?.dataStore?.delete?.(record);
	};

	/**
	 * Open a record in an editor, defaults to editorId of "main".
	 * @param {*} record Record to open.
	 * @param {*} editorId Id of editor to open the record in.
	 *
	 * @todo support dynamic shape with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 */
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

	/// REDUCERS
	///
	/// Reduce actions to `newState` with declarative transformations
	///    -

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

	/// RECONCILERS
	///
	/// Reconcile the consequenses state transformations have for other parts of state

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
