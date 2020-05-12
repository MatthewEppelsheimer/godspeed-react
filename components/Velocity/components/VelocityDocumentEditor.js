/**
 * A shallow wrapper for displaying a document
 *
 * This is responsible just for providing a wrapper div with class `document`,
 * and logic to load the correct display template as a child component.
 */

import { useVelocityContext } from "../src/context";
import VelocityDocumentEditorTemplate from "./VelocityDocumentEditorTemplate";

const VelocityDocumentEditor = () => {
	const context = useVelocityContext();
	const { document } = context?.selection || false;

	if (!document) {
		return (
			<>
				<h1>No document selected</h1>
				<p>Select a document to start editing.</p>
			</>
		);
	}

	const template = context?.template || <VelocityDocumentEditorTemplate />;

	return <div className="document">{template}</div>;
};

export default VelocityDocumentEditor;
