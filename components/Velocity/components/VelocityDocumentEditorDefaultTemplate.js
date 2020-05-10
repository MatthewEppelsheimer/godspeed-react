/**
 * Default template for rendering a document for editing
 *
 * This is a throwaway component for dev prototyping, as use cases can't be
 * standardized into any default worth committing to maintain, and this will
 * quickly be replaced.
 *
 * @format
 */
import { useVelocityContext } from "../src/context";

const VelocityDocumentEditorDefaultTemplate = () => {
	const context = useVelocityContext();
	const { document } = context?.selection || false;

	// Initial state before a document is selected
	if (!document) {
		return (
			<>
				<h1>No document selected</h1>
				<p>Select a document to start editing.</p>
			</>
		);
	}
	const { body, name } = document || {
		body: "No document body. Edit to give this document a body.",
		name: "No document name.",
	};

	return (
		<>
			{name ? (
				<h1 className="document__name">{name}</h1>
			) : (
				<h1
					className="document__name document__name--placeholder"
					style={{ fontStyle: "italic" }}
				>
					No document name yet
				</h1>
			)}
			{body ? (
				<div className="document__body">{body}</div>
			) : (
				<div
					className="document__body document__body--placeholder"
					style={{ fontStyle: "italic" }}
				>
					Add content to this document
				</div>
			)}
		</>
	);
};

export default VelocityDocumentEditorDefaultTemplate;
