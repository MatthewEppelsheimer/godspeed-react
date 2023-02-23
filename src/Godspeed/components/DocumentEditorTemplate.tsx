/**
 * Default template for rendering a document for editing
 *
 * Likely a throwaway component for dev prototyping, as use cases can't be
 * standardized into any default worth committing to maintain, and this will
 * quickly be replaced.
 */
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { ContentState, Editor, EditorState } from "draft-js";

import {
	useGodspeedContextEditor,
	useGodspeedContextControlImmutable,
} from "../context";
import DEBUG from "../debug";

interface DocumentEditorTemplateProps {
	id: string;
}

/**
 * Default Draft.js document editor
 */
const DocumentEditorTemplate = (props: DocumentEditorTemplateProps) => {
	const { id } = props;

	const editorRef = useRef<Editor>();
	const { setState } = useGodspeedContextControlImmutable().editor;
	const {
		getEditorById,
		isEditorFocused,
		registerEditorGainedFocus,
	} = useGodspeedContextEditor();

	const editor = getEditorById(id);
	const { record } = editor;

	const body = record?.body ?? "";

	// Initialize state on first run
	const initialContentState = useMemo(
		() => ContentState.createFromText(body),
		[body]
	);

	const initialEditorState = useMemo(
		() => EditorState.createWithContent(initialContentState),
		[initialContentState]
	);

	let state = editor.state ?? false;
	if (!state) {
		state = initialEditorState;
	}
	// also push it to context-managed state after first render
	// @NOTE Features work without this in development; not sure if this is
	// useful, though it seems like a good idea.
	useEffect(() => {
		if (!state) {
			state = initialEditorState;
			setState(id, state);
		}
	}, []);

	// Synchronize editor focus with app state
	const focusedInState = isEditorFocused();
	// @hacky typing to get this to compile; draft-js is EOL and we'll migrate to lexical.dev
	const focusedInDOM =
		document.activeElement ===
		((editorRef.current as unknown) as Element | null);
	useEffect(() => {
		DEBUG &&
			console.log("[focusedInState, focusedInDOM]:", [
				focusedInState,
				focusedInDOM,
			]);
		if (focusedInState && !focusedInDOM) {
			DEBUG && console.log("editor should focus");
			editorRef.current?.focus();
		} else if (!focusedInState && focusedInDOM) {
			DEBUG && console.log("editor should blur");
			editorRef.current?.blur();
		}
	});
	const handleClick = () => {
		if (!focusedInState) {
			registerEditorGainedFocus();
		}
	};

	// Propagate content changes to app state
	const handleChange = (newState: EditorState) => {
		const newPlainText = newState.getCurrentContent().getPlainText();

		setState(id, newState, record, newPlainText);
	};

	return (
		<Editor
			editorState={state}
			onChange={handleChange}
			// @ts-expect-error -- just need to compile during this conversion; moving to lexical.dev
			onClick={handleClick}
			ref={editorRef as MutableRefObject<Editor | null>}
		/>
	);
};

export default DocumentEditorTemplate;
