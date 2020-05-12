/**
 * A shallow wrapper for displaying a document
 *
 * This is responsible just for providing a wrapper div with class `document`,
 * and logic to load the correct display template as a child component.
 */

import PropTypes from "prop-types";
import { useGodspeedContext } from "../src/context";
import DocumentEditorTemplate from "./DocumentEditorTemplate";

const DocumentEditor = (props) => {
	const { id } = props;
	const context = useGodspeedContext();

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

	const template = context?.template || <DocumentEditorTemplate id={id} />;

	return <div className="document">{template}</div>;
};
DocumentEditor.defaultProps = {
	id: "main",
};
DocumentEditor.propTypes = {
	id: PropTypes.string.isRequired,
};

export default DocumentEditor;
