/**
 * Default template for rendering a document for editing
 *
 * Likely a throwaway component for dev prototyping, as use cases can't be
 * standardized into any default worth committing to maintain, and this will
 * quickly be replaced.
 */
import { useEffect, useMemo, useRef } from "react";
import { PropTypes } from "prop-types";
import { ContentState, Editor, EditorState } from "draft-js";
import {
	useGodspeedContextEditor,
	useGodspeedContextImmutable,
} from "../src/context";

const DEBUG = false;

/**
 * Default Draft.js document editor
 */
const DocumentEditorTemplate = (props) => {
	const { id } = props;

	const editorRef = useRef();
	const { setState } = useGodspeedContextImmutable().editor;
	const {
		getEditorById,
		isEditorFocused,
		registerEditorGainedFocus,
	} = useGodspeedContextEditor();

	const editor = getEditorById(id);
	const { record } = editor;
	const body = record?.body || "";

	// Initialize state on first run
	const initialContentState = useMemo(
		() => ContentState.createFromText(body),
		[body]
	);

	const initialEditorState = useMemo(
		() => EditorState.createWithContent(initialContentState),
		[initialContentState]
	);

	let state = editor?.state || false;
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
	const focusedInDOM = document.activeElement === editorRef.current;
	useEffect(() => {
		DEBUG &&
			console.log("[focusedInState, focusedInDOM]:", [
				focusedInState,
				focusedInDOM,
			]);
		if (focusedInState && !focusedInDOM) {
			DEBUG && console.log("editor should focus");
			editorRef.current.focus();
		} else if (!focusedInState && focusedInDOM) {
			DEBUG && console.log("editor should blur");
			editorRef.current.blur();
		}
	});
	const handleClick = () => {
		if (!isEditorFocused) {
			registerEditorGainedFocus();
		}
	};

	// Propagate content changes to app state
	const handleChange = (newState) => {
		const newPlainText = newState.getCurrentContent().getPlainText();

		setState(id, newState, record, newPlainText);
	};

	return (
		<Editor
			editorState={state}
			onChange={handleChange}
			onClick={handleClick}
			ref={editorRef}
		/>
	);
};
DocumentEditorTemplate.propTypes = {
	id: PropTypes.string,
};

export default DocumentEditorTemplate;
