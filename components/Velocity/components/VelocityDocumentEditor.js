/**
 * A shallow wrapper for displaying a document
 *
 * This is responsible just for providing a wrapper div with class `document`,
 * and logic to load the correct display template as a child component.
 */

import PropTypes from "prop-types";
import { useVelocityContext } from "../src/context";
import VelocityDocumentEditorTemplate from "./VelocityDocumentEditorTemplate";

const VelocityDocumentEditor = (props) => {
	const { id } = props;
	const context = useVelocityContext();

	const editor = context?.editors.find((editor) => id === editor.id);
	const { record } = editor;

	if (!record) {
		return (
			<>
				<h1>No document selected</h1>
				<p>Select a document to start editing.</p>
			</>
		);
	}

	const template = context?.template || (
		<VelocityDocumentEditorTemplate editor={editor} />
	);

	return <div className="document">{template}</div>;
};
VelocityDocumentEditor.defaultProps = {
	id: "main",
};
VelocityDocumentEditor.propTypes = {
	id: PropTypes.string.isRequired,
};

export default VelocityDocumentEditor;
