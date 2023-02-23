import {
	// GodspeedContextEditor,
	GodspeedContextActions,
	GodspeedContextFocusedElement,
	GodspeedContextSearchPhrase,
	GodspeedContextSelectionIndex,
} from "../context";
import { GsContextProvidersProps } from "../interfaces";

// Considered internal; recommend against implementing this yourself, as it's fundamentally core to Godspeed's logic, and is guaranteed to continue to be backwards compatible
function GsContextProviders({
	children,
	actions,
	godspeedState,
}: GsContextProvidersProps) {
	const { focusedElement, searchPhrase, selectionIndex } = godspeedState;

	// WIP CLIPBOARD:
	// GETTERS moved out of actions
	//	GsSearchActions
	// 		Get records in current search results
	// 			getResults: () => state.displayedRecords,

	return (
		<GodspeedContextActions.Provider value={actions}>
			{/* <GodspeedContextEditor.Provider value={editorContext}> */}
			<GodspeedContextFocusedElement.Provider value={focusedElement}>
				<GodspeedContextSearchPhrase.Provider value={searchPhrase}>
					<GodspeedContextSelectionIndex.Provider
						value={selectionIndex}
					>
						{children}
					</GodspeedContextSelectionIndex.Provider>
				</GodspeedContextSearchPhrase.Provider>
			</GodspeedContextFocusedElement.Provider>
			{/* </GodspeedContextEditor.Provider> */}
		</GodspeedContextActions.Provider>
	);
}

export default GsContextProviders;
