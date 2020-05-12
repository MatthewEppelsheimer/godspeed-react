/**
 * Default template for rendering a document for editing
 *
 * Likely a throwaway component for dev prototyping, as use cases can't be
 * standardized into any default worth committing to maintain, and this will
 * quickly be replaced.
 */
import { useState } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
import { useVelocityContext } from "../src/context";

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
const VelocityDocumentEditorTemplate = () => {
	const context = useVelocityContext();
	const { document, update } = context?.selection || false;
	const initialContentState = ContentState.createFromText(
		document?.body || ""
	);

	const initialEditorState = EditorState.createWithContent(
		initialContentState
	);
	const [editorState, setEditorState] = useState(initialEditorState);

	const handleChange = (newState) => {
		const newPlainText = newState.getCurrentContent().getPlainText();

		setEditorState(newState);
		update(document, newPlainText);
		console.log(newPlainText);
	};

	return <Editor editorState={editorState} onChange={handleChange} />;

	// const { body, name } = document || {
	// 	body: "No document body. Edit to give this document a body.",
	// 	name: "No document name.",
	// };

	// return (
	// 	<>
	// 		{name ? (
	// 			<h1 className="document__name">{name}</h1>
	// 		) : (
	// 			<h1
	// 				className="document__name document__name--placeholder"
	// 				style={{ fontStyle: "italic" }}
	// 			>
	// 				No document name yet
	// 			</h1>
	// 		)}
	// 		{body ? (
	// 			<div className="document__body">{body}</div>
	// 		) : (
	// 			<div
	// 				className="document__body document__body--placeholder"
	// 				style={{ fontStyle: "italic" }}
	// 			>
	// 				Add content to this document
	// 			</div>
	// 		)}
	// 	</>
	// );
};

export default VelocityDocumentEditorTemplate;
