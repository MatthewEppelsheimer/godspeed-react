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
import {
	useGodspeedContextEditor,
	useGodspeedContextImmutable,
} from "../src/context";

/**
 * Default Draft.js document editor
 */
const DocumentEditorTemplate = (props) => {
	const { id } = props;

	const { setState } = useGodspeedContextImmutable().editor;
	const { getEditorById } = useGodspeedContextEditor();

	const editor = getEditorById(id);
	const { record } = editor;
	const body = record?.body || "";

	const initialContentState = useMemo(
		() => ContentState.createFromText(body),
		[body]
	);

	const initialEditorState = useMemo(
		() => EditorState.createWithContent(initialContentState),
		[initialContentState]
	);

	// Initialize state on first run
	let state = editor?.state || false;
	if (!state) {
		state = initialEditorState;
	}
	// and also push it to context-managed state after first render
	// @NOTE Features work without this in development; not sure if this is
	// useful, though it seems like a good idea.
	useEffect(() => {
		if (!state) {
			state = initialEditorState;
			setState(id, state);
		}
	}, []);

	const handleChange = (newState) => {
		const newPlainText = newState.getCurrentContent().getPlainText();

		setState(id, newState, record, newPlainText);
	};

	return <Editor editorState={state} onChange={handleChange} />;
};
DocumentEditorTemplate.propTypes = {
	id: PropTypes.string,
};

export default DocumentEditorTemplate;
