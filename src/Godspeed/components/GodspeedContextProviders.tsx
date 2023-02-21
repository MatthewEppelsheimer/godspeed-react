import { useState } from "react";

import {
	GodspeedContextEditor,
	GodspeedContextControlImmutable,
	GodspeedContextSearch,
	GodspeedContextSelection,
	useMutableContext,
} from "../context";
import {
	GsContextControlImmutable,
	GsContextProvidersProps,
} from "../interfaces";

// Considered internal; recommend against implementing this yourself, as it's fundamentally core to Godspeed's logic, and is guaranteed to continue to be backwards compatible
const GsContextProviders = (props: GsContextProvidersProps) => {
	const { children, actions } = props;

	const {
		focusEditor,
		getEditors,
		isEditorFocused,
		getState,
		setState,
	} = actions?.editorAccess;
	const { enter, escape } = actions.keyAccess;
	const { create, del, update: updateRecord } = actions.recordAccess;
	const {
		blur,
		focus,
		getPhrase,
		getResults,
		isSearchFieldFocused,
	} = actions.searchAccess;
	const updateSearch = actions.searchAccess.update;
	const { getIndex, next, previous, setIndex } = actions.selectionAccess;
	const { slotFills } = actions.slotFillAccess;

	// IMMUTABLE CONTEXT
	//
	// State set only at render timefor context values prevents needless consumer renders
	// see {@link https://reactjs.org/docs/context.html#caveats}
	// closures passed to useState() mean they'll only run on first render
	const [immutableContext] = useState(
		(): GsContextControlImmutable => {
			return {
				editor: {
					getState, // @todo does this perhaps belong in mutable editors?
					setState,
					focusEditor,
				},
				key: {
					enter,
					escape,
				},
				record: {
					create,
					del,
					updateRecord,
				},
				search: {
					blur,
					focus,
					updateSearch,
				},
				selection: {
					next,
					previous,
					setIndex,
				},
				slotFills,
			};
		}
	);

	// MUTABLE CONTEXTS
	//
	// These are split up so consumers only re-render when context they depend on changes

	// *** Editor Context ***

	const editors = getEditors();
	const editorContext = useMutableContext(() => {
		return {
			editors: editors,
			getEditorById: (id: any) =>
				editors.find((editor: any) => id === editor.id),
			isEditorFocused: isEditorFocused,
		};
	}, editors);

	// *** Search Context ***

	const phrase = getPhrase();
	const results = getResults();
	const focused = isSearchFieldFocused();
	const searchContext = useMutableContext(() => {
		return {
			phrase,
			results,
			focused,
		};
	}, [phrase, results, focused]);

	// *** Selection Context ***

	const index = getIndex();
	const selectionContext = useMutableContext(() => {
		return {
			index,
		};
	}, index);

	return (
		<GodspeedContextControlImmutable.Provider value={immutableContext}>
			<GodspeedContextEditor.Provider value={editorContext}>
				<GodspeedContextSearch.Provider value={searchContext}>
					<GodspeedContextSelection.Provider value={selectionContext}>
						{children}
					</GodspeedContextSelection.Provider>
				</GodspeedContextSearch.Provider>
			</GodspeedContextEditor.Provider>
		</GodspeedContextControlImmutable.Provider>
	);
};

export default GsContextProviders;
