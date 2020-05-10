/**
 * A shallow wrapper for displaying a document
 *
 * This is responsible just for providing a wrapper div with class `document`,
 * and logic to load the correct display template as a child component.
 */

import { useVelocityContext } from "../src/context";
import VelocityDocumentEditorDefaultTemplate from "./VelocityDocumentEditorDefaultTemplate";

const VelocityDocumentEditor = () => {
	const context = useVelocityContext();

	const template = context?.template || (
		<VelocityDocumentEditorDefaultTemplate />
	);

	return <div className="document">{template}</div>;
};

export default VelocityDocumentEditor;
