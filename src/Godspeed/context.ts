import React, { createContext, useContext } from "react";
import {
	GsActions,
	// GsContextEditor,
	GsFocusedElement,
	GsRecordIdList,
	GsSearchPhrase,
	GsSelectionIndex,
} from "./interfaces";

function contextFactory<T>(
	displayName: string,
	fallback?: T
): [React.Context<T>, () => T] {
	const context = createContext<T>(fallback as T);
	context.displayName = displayName;
	function useContextHook(): T {
		return useContext<T>(context);
	}

	return [context, useContextHook];
}

// const [GodspeedContextEditor, useGodspeedContextEditor] = contextFactory<
// 	GsContextEditor
// >("Godspeed Editor Context");

const [GodspeedContextActions, useGodspeedContextActions] = contextFactory<
	GsActions
>("Godspeed Actions Context");

const [
	GodspeedContextDisplayedRecords,
	useGodspeedContextDisplayedRecords,
] = contextFactory<GsRecordIdList>("Godspeed Displayed Records Context");

const [
	GodspeedContextFocusedElement,
	useGodspeedContextFocusedElement,
] = contextFactory<GsFocusedElement>("Godspeed Focused Element Context");

const [
	GodspeedContextSearchPhrase,
	useGodspeedContextSearchPhrase,
] = contextFactory<GsSearchPhrase>("Godspeed Search Phrase Context");

const [
	GodspeedContextSelectionIndex,
	useGodspeedContextSelectionIndex,
] = contextFactory<GsSelectionIndex>("Godspeed Selection Index Context");

export {
	GodspeedContextActions,
	GodspeedContextDisplayedRecords,
	// GodspeedContextEditor,
	GodspeedContextFocusedElement,
	GodspeedContextSearchPhrase,
	GodspeedContextSelectionIndex,
	useGodspeedContextActions,
	useGodspeedContextDisplayedRecords,
	// useGodspeedContextEditor,
	useGodspeedContextFocusedElement,
	useGodspeedContextSearchPhrase,
	useGodspeedContextSelectionIndex,
};
