/**
 * Default template for rendering a document for editing
 *
 * Likely a throwaway component for dev prototyping, as use cases can't be
 * standardized into any default worth committing to maintain, and this will
 * quickly be replaced.
 */
import { useState, useMemo } from "react";
import { PropTypes } from "prop-types";
import { ContentState, Editor, EditorState } from "draft-js";
import { useVelocityContext } from "../src/context";
import VelocityDocumentEditor from "./VelocityDocumentEditor";

/**
 * WIP point thoughts:
 *
 * - Need to lift up editorState to <Velocity />, so changes are logged to its
 *   `state` and thus propagate down via context, to be passed here to
 *   Editor.editorState prop.
 * - Applications won't always need Draft.js — they may prefer a different
 *   editor or not even need to edit/update text, but just display it
 *   statically — so export a `useDraft` hook that essentially builds in
 *   compatibility with Draft.js, by working w/ EditorState & ContentState
 *   objects
 * - **Try writing the non-Draft version first, for the more general case.
 */
const VelocityDocumentEditorTemplate = (props) => {
	const { editor } = props;
	const document = editor.record;
	const { body } = document || "";

	const context = useVelocityContext();
	const { update } = context?.recordOps;

	const initialContentState = useMemo(
		() => ContentState.createFromText(body),
		[body]
	);

	const initialEditorState = useMemo(
		() => EditorState.createWithContent(initialContentState),
		[initialContentState]
	);
	const [editorState, setEditorState] = useState(initialEditorState);

	const handleChange = (newState) => {
		const newPlainText = newState.getCurrentContent().getPlainText();

		setEditorState(newState);
		update(document, newPlainText);
		console.log(newPlainText);
	};

	return <Editor editorState={editorState} onChange={handleChange} />;
};
VelocityDocumentEditorTemplate.propTypes = {
	editor: PropTypes.shape({}),
};

export default VelocityDocumentEditorTemplate;
