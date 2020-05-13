/**
 * A shallow wrapper for displaying a document
 *
 * This is responsible just for providing a wrapper div with class `document`,
 * and logic to load the correct display template as a child component.
 */

import PropTypes from "prop-types";
import { useGodspeedContextEditorsMutable } from "../src/context";
import DocumentEditorTemplate from "./DocumentEditorTemplate";

const DocumentEditor = (props) => {
	const { id } = props;
	const context = useGodspeedContextEditorsMutable();
	const { getEditorById } = context;

	const editor = getEditorById(id);
	const { record } = editor;

	// @todo: Potential performance optimization: Delegate this to
	// DocumentEditorTemplate, avoid destroying it when no open document.
	if (!record) {
		return (
			<>
				<h1>No document selected</h1>
				<p>Select a document to start editing.</p>
			</>
		);
	}

	// @todo actually port template into a context
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
