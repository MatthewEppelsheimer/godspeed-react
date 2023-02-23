import { Reducer } from "react";
import {
	GsAction,
	GsActionTypes,
	GsActionEditorGainFocus,
	GsActionEditorSetState,
	GsActionRecordCreate,
	GsActionRecordDelete,
	GsActionRecordUpdate,
	GsActionSearchUpdate,
	GsActionSelectionSet,
} from "./actions";
import {
	GsEditorData,
	GsFocusedElement,
	GsRecord,
	GsRecordCreationData,
	GsRecordState,
	GsStateData,
} from "./interfaces";
import { log } from "./log";
import { indexData, search } from "./search";
import DEBUG from "./debug";
import { EditorState } from "draft-js";

export type GsDataReducer = Reducer<GsStateData, GsAction>;

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
const dataReducer: GsDataReducer = (state: GsStateData, action: GsAction) => {
	// We treat state as immutable, so start with a fresh copy
	const newState: GsStateData = { ...state };

	/**
	 * UTILITIES
	 *
	 * Utilities Manipulate data for transformations' use.
	 *
	 * Do: One thing only.
	 * Do NOT: Access `state`, `newState`, or `action`.
	 */

	/**
	 * Get a record from state with given index
	 * @throws when no matching index found
	 */
	const getRecordByIndex = (index: number): GsRecord => {
		DEBUG &&
			console.log(
				`running reducer utility getRecordByIndex with index ${index}`
			);
		const found = state.records.find(
			(record: GsRecord) => index === record.index
		);

		if (found === undefined) {
			const msg = `No record found with index ${index}`;

			DEBUG && console.log(msg);
			throw new Error(msg);
		}

		return found;
	};

	/**
	 * TRANSFORMATIONS
	 *
	 * Transformations carry out state change instructions imperatively.
	 *
	 * Do:
	 *     - One thing only
	 *     - Modify `newState`
	 *     - Compose from other transformations
	 *
	 * Generally AVOID:
	 *     - Accessing `state`
	 *
	 *  Do NOT:
	 *     - Access `action`
	 */
	///
	///
	///

	// *** Displayed Record Transformations ***

	/**
	 * Focus an element in state.
	 *
	 * Supports "editor", "search", or false.
	 */
	const focusElement = (
		element: GsFocusedElement = GsFocusedElement.none
	) => {
		DEBUG &&
			console.log(
				`performing transformation focusElement, focusing ${
					element === GsFocusedElement.none
						? "no elements"
						: `${element} element`
				}`
			);

		newState.focusedElement = element;
	};

	const setDisplayedRecordsTo = (records: GsRecord[]) => {
		DEBUG &&
			console.log(
				`performing transformation setDisplayedRecordsTo with records ${JSON.stringify(
					records
				)}`
			);
		// @TODO reconsider indexData here; does it violate "transformations do one thing only"?
		newState.displayedRecords = indexData(records);
	};

	// @TODO why use newState exactly?
	const setDisplayedRecordsToAllNew = () => {
		DEBUG &&
			console.log(
				`performing transformation setDisplayedRecordsToAllNew, which uses newState.records`
			);

		setDisplayedRecordsTo(newState.records);
	};

	// *** Editor Transformations ***

	/**
	 * Give focus to the editor
	 */
	const editorFocus = () => {
		focusElement(GsFocusedElement.editor);
	};

	/**
	 * Update an editor to a new state.
	 */
	const editorUpdateState = (
		editorId: string,
		newEditorState: EditorState
	) => {
		DEBUG &&
			console.log(
				`performing transformation editorUpdateState with editorId ${editorId} and newEditorState ${JSON.stringify(
					newEditorState
				)}`
			);
		newState.editors.map((editor: GsEditorData) => {
			if (editorId === editor.id) {
				editor.state = newEditorState;
			}
			return editor;
		});
	};

	// *** Record Transformations ***

	/**
	 * Add a new record to and re-index `state.records`.
	 * @todo support dynamic shapes with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 * @todo confirm that `link` tag in the todo above works in JSDoc output
	 */
	const recordCreate = (record: GsRecordCreationData) => {
		DEBUG &&
			console.log(
				`performing transformation recordCreate with record ${JSON.stringify(
					record
				)}`
			);

		// Use body if not-empty, else use name if not-empty, else both are blank
		const body =
			record.body && "" !== record.body ? record.body : record.name || "";
		const name =
			record.body && "" !== record.body
				? record.body.substring(
						0,
						record.body.indexOf(`\n`) || record.body.length
				  )
				: record.name || "";

		const date = new Date().getTime();

		const newRecordState: GsRecordState = {
			body,
			date,
			name,
		};

		const newRecord: GsRecord = {
			uuid: "TODO", // @TODO
			state: newRecordState,
			revisions: [],
		};

		newState.records.unshift(newRecord);
		newState.records = indexData(newState.records);

		// @TODO should either of these optional chainings be removed?
		newState.dataStore.create(newRecord);
	};

	/**
	 * Create a new record from search input.
	 *
	 * @todo support dynamic shapes with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 */
	const recordCreateFromSearchPhrase = () => {
		DEBUG &&
			console.log(
				`performing transformation recordCreateFromSearchPhrase`
			);

		const name = newState.searchPhrase;
		const body = newState.searchPhrase;

		recordCreate({ name, body });
	};

	/**
	 * Delete a record and remove it from search results.
	 *
	 * @todo support dynamic shape with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 */
	const recordDelete = (record: Pick<GsRecord, "uuid">) => {
		DEBUG &&
			console.log(
				`performing transformation recordDelete with record ${JSON.stringify(
					record
				)}`
			);

		// @todo performance optimization: stop after find one instead of looping through all
		const filter = (records: GsRecord[]) =>
			records.filter((rec) => record.uuid !== rec.uuid);

		newState.records = indexData(filter(newState.records));
		newState.displayedRecords = indexData(
			filter(newState.displayedRecords)
		);

		newState.dataStore.del(record);
	};

	/**
	 * Open a record in an editor, defaults to editorId of "main".
	 *
	 * @todo support dynamic shape with templating — {@link ../README.md} {@tag dynamic-record-shapes}
	 */
	const recordOpenInEditor = (record: GsRecord, editorId = "main") => {
		DEBUG &&
			console.log(
				`performing transformation recordOpenInEditor with record ${JSON.stringify(
					record
				)} and editorId ${editorId}`
			);

		const newEditor: GsEditorData = {
			id: editorId,
			state: record, // @TODO;
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
	};

	/**
	 * Update a pre-existing record
	 *
	 * @throws when record not found
	 * @TODO debounce
	 */
	const recordUpdate = (recordData: { uuid: string; body: string }) => {
		DEBUG &&
			console.log(
				`performing transformation recordUpdate with recordData ${JSON.stringify(
					recordData
				)}`
			);

		const { uuid, body } = recordData;

		// @TODO find one record to operate on rather than mapping
		const updatedRecord = newState.records.find((rec) => uuid === rec.uuid);
		if (undefined === updatedRecord) {
			throw new Error(`record ${uuid} not found to update`);
		}

		updatedRecord.revisions.push(updatedRecord.state);
		updatedRecord.state.body = body;
		updatedRecord.state.name = body.substring(
			0,
			body.indexOf(`\n`) || body.length
		);
		updatedRecord.state.date = Date.now();

		newState.dataStore.update(updatedRecord);
	};

	// *** Search Transformations ***

	const setSearchPhrase = (phrase: string) => {
		DEBUG &&
			console.log(
				`performing transformation setSearchPhrase with ${phrase}`
			);
		newState.searchPhrase = phrase;
	};

	const searchFieldFocus = () => {
		DEBUG && console.log("performing transformation searchFieldFocus");

		focusElement(GsFocusedElement.search);
	};

	// *** Selection Transformations ***

	const setSelectionIndex = (newIndex: number) => {
		DEBUG &&
			console.log(
				`performing transformation setSelectionIndex with newIndex ${newIndex}`
			);

		newState.selectionIndex = newIndex;
	};

	// Move selection to the next result, not going past the last one
	const selectNext = () => {
		DEBUG && console.log(`performing transformation selectNext`);

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

	try {
		DEBUG && console.log(`doing action ${JSON.stringify(action)}`);

		switch (action.type) {
			case GsActionTypes.editorGainFocus:
				action = action as GsActionEditorGainFocus;

				editorFocus();
				break;

			case GsActionTypes.editorSetState:
				{
					const {
						editorId,
						newEditorState,
						record,
					} = action as GsActionEditorSetState;

					editorUpdateState(editorId, newEditorState);

					if (record?.uuid) {
						recordUpdate({
							uuid: record.uuid,
							body: record.state.body,
						});
					}
				}
				break;

			// @todo Something like state.navigationFocus might be more flexible/elegant to query vs selectionIndex
			case GsActionTypes.navigationFocusIn:
				if (-1 !== state.selectionIndex) {
					// If there is a record selected, open it
					const record = getRecordByIndex(state.selectionIndex);
					recordOpenInEditor(record);
					editorFocus();
				} else if (GsFocusedElement.search === state.focusedElement) {
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

			// @todo convert to using state.navigationFocus along w/ navigation.focusIn
			case GsActionTypes.navigationFocusOut:
				if ("editor" === state.focusedElement) {
					DEBUG && console.log("focusing search");
					focusElement(GsFocusedElement.search);
					// if document editor is active, switch focus to search field
					// @todo implement switch of focus from document editor to search field
				} else if (-1 !== state.selectionIndex) {
					//  if a displayed result is selected (highlighted), unselect it
					DEBUG && console.log("unselecting");
					setSelectionIndex(-1);
				} else if ("" !== state.searchPhrase) {
					// if there is a search phrase, clear it
					DEBUG && console.log("clearing search phrase");
					setSearchPhrase("");
				} else {
					// if search field is focused, blur it
					DEBUG && console.log("blurring searchfield");
					focusElement(GsFocusedElement.none);
				}
				break;

			case GsActionTypes.recordCreate:
				{
					const {
						updateSearch,
						record,
					} = action as GsActionRecordCreate;
					const { name } = record;

					recordCreate({ name });

					if (updateSearch) {
						setSearchPhrase("");
					}
				}
				break;

			case GsActionTypes.recordDelete:
				{
					const { record } = action as GsActionRecordDelete;
					recordDelete(record);
				}
				break;

			case GsActionTypes.recordUpdate:
				{
					const { recordData } = action as GsActionRecordUpdate;

					recordUpdate(recordData);
				}
				break;

			case GsActionTypes.searchBlur:
				focusElement(GsFocusedElement.none);
				break;

			case GsActionTypes.searchFocus:
				searchFieldFocus();
				break;

			case GsActionTypes.searchUpdate:
				const { newPhrase } = action as GsActionSearchUpdate;

				setSearchPhrase(newPhrase);
				break;

			case GsActionTypes.selectionSet:
				const { newIndex } = action as GsActionSelectionSet;

				setSelectionIndex(newIndex);
				break;

			case GsActionTypes.selectionNext:
				selectNext();
				break;

			case GsActionTypes.selectionPrevious:
				selectPrevious();
				break;

			default:
				throw new Error("unrecognized action.type");
				break;
		}
	} catch (error) {
		log(error as Error); // @TODO coerce better
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
		// @TODO fix broken equivalence check
		state.displayedRecords !== newState.displayedRecords &&
		-1 !== state.selectionIndex
	) {
		let stillInFoundSet = false;

		const selectedRecord = state.displayedRecords.find((record) => {
			state.selectionIndex === record.index;
		});

		if (selectedRecord) {
			const record = newState.displayedRecords.find(
				(rec) => selectedRecord.uuid === rec.uuid
			);

			if (record !== undefined) {
				if (undefined === record.index) {
					throw new Error("selected record is missing index");
				}
				stillInFoundSet = true;
				setSelectionIndex(record.index);
			}
		}
		if (!stillInFoundSet) {
			setSelectionIndex(-1);
		}
	}

	return newState;
};

export { dataReducer };
