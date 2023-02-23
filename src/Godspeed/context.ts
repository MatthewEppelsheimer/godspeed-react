import React, { createContext, useContext } from "react";
import {
	GsActions,
	// GsContextEditor,
	GsFocusedElement,
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
	GodspeedContextSearchPhrase,
	useGodspeedContextSearchPhrase,
] = contextFactory<GsSearchPhrase>("Godspeed Search Phrase Context");

const [
	GodspeedContextFocusedElement,
	useGodspeedContextFocusedElement,
] = contextFactory<GsFocusedElement>("Godspeed Focused Element Context");

const [
	GodspeedContextSelectionIndex,
	useGodspeedContextSelectionIndex,
] = contextFactory<GsSelectionIndex>("Godspeed Selection Index Context");

export {
	GodspeedContextActions,
	// GodspeedContextEditor,
	GodspeedContextFocusedElement,
	GodspeedContextSearchPhrase,
	GodspeedContextSelectionIndex,
	useGodspeedContextActions,
	// useGodspeedContextEditor,
	useGodspeedContextFocusedElement,
	useGodspeedContextSearchPhrase,
	useGodspeedContextSelectionIndex,
};
