/**
 * Default template for rendering a document for editing
 *
 * Likely a throwaway component for dev prototyping, as use cases can't be
 * standardized into any default worth committing to maintain, and this will
 * quickly be replaced.
 */
import { useEffect, useState, useMemo } from "react";
import { PropTypes } from "prop-types";
import { ContentState, Editor, EditorState } from "draft-js";
import { useVelocityContext } from "../src/context";
import VelocityDocumentEditor from "./VelocityDocumentEditor";

/**
 * WIP point in progress:
 *
 * - Need to lift up editorState to <Velocity />, so changes are logged to its
 *   `state` and thus propagate down via context, to be passed here to
 *   Editor.editorState prop.
 * - Applications won't always need Draft.js — they may prefer a different
 *   editor or not even need to edit/update text, but just display it
 *   statically — so export a `useDraft` hook that essentially builds in
 *   compatibility with Draft.js, by working w/ EditorState & ContentState
 *   objects
 */
const VelocityDocumentEditorTemplate = (props) => {
	const { id } = props;

	const context = useVelocityContext();
	const { setState } = context.editorOps;
	const { update } = context.recordOps;

	const editor = context.editors.find((editor) => id === editor.id);
	const document = editor.record;
	const { body } = document || "";

	const initialContentState = useMemo(
		() => ContentState.createFromText(body),
		[body]
	);

	const initialEditorState = useMemo(
		() => EditorState.createWithContent(initialContentState),
		[initialContentState]
	);

	// !!!! WIP POINT !!!!
	// below not working; fucking up cursor position
	//

	// Initialize GS context state on first run
	let state = editor?.state || false;
	useEffect(() => {
		if (!state) {
			console.log("foo");
			// queue upstream state change
			setState(editor.id, initialEditorState);
			// and support first render
			state = initialEditorState;
		}
	});
	// and support local state's first render as well
	if (!state) {
		// and support first render
		state = initialEditorState;
	}

	const handleChange = (newState) => {
		const newPlainText = newState.getCurrentContent().getPlainText();

		setState(newState);
		// WIP!
		// PERHAPS IF THIS WERE MERGED INTO THE REDUCER
		// ; only trigger a single state change for
		update(document, newPlainText);
		console.log(newPlainText);
	};

	return <Editor editorState={state} onChange={handleChange} />;
};
VelocityDocumentEditorTemplate.propTypes = {
	id: PropTypes.string,
};

export default VelocityDocumentEditorTemplate;
