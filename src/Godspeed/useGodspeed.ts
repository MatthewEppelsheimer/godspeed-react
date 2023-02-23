/**
 * Godspeed app-level state management
 */
import { ReducerState, useCallback, useMemo, useReducer } from "react";

import { dispatchFactory } from "./actions";
import CONFIG from "./config";
import { indexData } from "./search";
import { dataReducer, GsDataReducer } from "./reducers";
import {
	GsActions,
	GsFocusedElement,
	GsInputActions,
	GsKeyboardActions,
	GsRecord,
	GsRecordActions,
	GsRecordCreationData,
	GsRecordDataOps,
	// GsRecordEditorData,
	GsRecordUpdateData,
	GsSearchActions,
	GsSearchPhrase,
	GsSelectionActions,
	// GsSlotFills,
	GsStateData,
	Uuid,
} from "./interfaces";
import DEBUG from "./debug";
// import { EditorState } from "draft-js";

interface UseGodspeedOptions {
	recordData: GsRecord[];
	dataStore: GsRecordDataOps;
	// slotFills: GsSlotFills;
	defaultSearchPhrase: string;
}

// custom hook to abstract core <Godspeed /> functionality, to provide context from component state
function useGodspeed({
	recordData,
	dataStore,
	defaultSearchPhrase,
}: UseGodspeedOptions): { actions: GsActions; state: GsStateData } {
	const initialRecords = useMemo(() => indexData(recordData), [recordData]);
	const initialState: ReducerState<GsDataReducer> = {
		dataStore: dataStore,
		editors: [],
		records: initialRecords,
		displayedRecords: initialRecords,
		searchPhrase: defaultSearchPhrase,
		selectionIndex: CONFIG.default_selected_index,
		focusedElement: GsFocusedElement.search,
	};

	const [state, reducerDispatch] = useReducer(dataReducer, initialState);

	// should be immutable
	const actions = useMemo(() => {
		DEBUG &&
			console.log(
				`useGodspeed() is memoizing actions. Should only see this message twice in strict mode! If seen more, remove reducerDispatch from dependencies`
			);

		const dispatch = dispatchFactory(reducerDispatch);

		const enter = useCallback(() => {
			dispatch.navigation.focusIn();
		}, []);
		const escape = useCallback(() => {
			dispatch.navigation.focusOut();
		}, []);

		const keyboard: GsKeyboardActions = {
			enter,
			escape,
		};

		const input: GsInputActions = {
			keyboard,
		};

		// optionally suppress updating search with updateSearch = false
		const create = useCallback(
			(recordData: GsRecordCreationData = {}, updateSearch = true) => {
				dispatch.record.create(recordData, updateSearch);
			},
			[]
		);
		// Delete a record and remove it from displayedRecords
		const del = useCallback((recordId: Uuid) => {
			dispatch.record.delete(recordId);
		}, []);
		// @todo (pre-TypeScript) after finish controller/reducer refactor, update callers' signatures to pass newBody as a member of record
		const update = useCallback((record: GsRecordUpdateData) => {
			dispatch.record.update(record);
		}, []);

		const record: GsRecordActions = {
			create,
			del,
			update,
		};

		const blur = useCallback(() => {
			dispatch.search.blur();
		}, []);
		const focus = useCallback(() => {
			dispatch.search.focus();
		}, []);
		const updatePhrase = useCallback((newPhrase: GsSearchPhrase = "") => {
			dispatch.search.updatePhrase(newPhrase);
		}, []);
		const search: GsSearchActions = {
			// blur search field
			blur,

			// focus search field
			focus,

			updatePhrase,
		};

		// move selection to next result; don't go further than last result
		const next = useCallback(() => {
			dispatch.selection.next();
		}, []);
		// move selected result up one; don't go further than -1, which is none selected
		const previous = useCallback(() => {
			dispatch.selection.previous();
		}, []);
		// set selection index
		const setIndex = useCallback((newIndex: number) => {
			dispatch.selection.set(newIndex);
		}, []);
		// @TODO long term: support concurrent active result views (will involve rethinking terminology)
		const selection: GsSelectionActions = {
			next,
			previous,
			setIndex,
		};

		return {
			input,
			record,
			search,
			selection,
		};
	}, [reducerDispatch]);

	return {
		actions,
		state,
	};
}

export { useGodspeed };
