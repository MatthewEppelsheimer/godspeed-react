import GodspeedContextDEPRECATED, {
	GodspeedContextEditorsMutable,
} from "../src/context";

const GodspeedContextProviders = (props) => {
	const { children, controllers } = props;

	const { deprecatedController, editorController } = controllers;

	const { getEditors } = editorController;
	const editors = getEditors();
	const editorMutableContext = {
		editors: editors,
		getEditorById: (id) => editors.find((editor) => id === editor.id),
	};

	return (
		<GodspeedContextDEPRECATED.Provider value={deprecatedController}>
			<GodspeedContextEditorsMutable.Provider
				value={editorMutableContext}
			>
				{children}
			</GodspeedContextEditorsMutable.Provider>
		</GodspeedContextDEPRECATED.Provider>
	);
};
// @todo add defaultProps and propTypes

export default GodspeedContextProviders;
