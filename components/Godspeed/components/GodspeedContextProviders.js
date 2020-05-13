import { useState, useRef } from "react";
import GodspeedContextDEPRECATED, {
	GodspeedContextEditors,
	GodspeedContextEditorsMutable,
	GodspeedContextKey,
	GodspeedContextRecord,
} from "../src/context";

const GodspeedContextProviders = (props) => {
	const { children, controllers } = props;

	const {
		deprecatedController,
		editorController,
		keyController,
		recordController,
	} = controllers;
	const { getEditors, getState, setState } = editorController;
	const { enter, escape } = keyController;
	const { create, del, update } = recordController;

	// IMMUTABLE CONTEXTS
	//
	// state for context values prevents needless consumer renders
	// see {@link https://reactjs.org/docs/context.html#caveats}
	// closures passed to useState() mean they'll only run on first render
	const useImmutableContext = (value) => useState(() => value);

	const [editorContext] = useImmutableContext({ getState, setState });
	const [keyContext] = useImmutableContext({ enter, escape });
	const [recordContext] = useImmutableContext({ create, del, update });

	// MUTABLE CONTEXTS
	//
	// Only recreate mutable context values when their dependencies have changed
	// See {@link https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback}
	const prevEditors = useRef({ current: null });

	// immutable Editors controller
	const editors = getEditors();
	const generateEditorMutableContext = () => {
		prevEditors.current = editors;
		return {
			editors: editors,
			getEditorById: (id) => editors.find((editor) => id === editor.id),
		};
	};
	const [editorMutableContext, setEditorMutableContext] = useState(() =>
		generateEditorMutableContext()
	);
	if (prevEditors.current && prevEditors.current !== editors) {
		setEditorMutableContext(generateEditorMutableContext());
	}

	return (
		<GodspeedContextDEPRECATED.Provider value={deprecatedController}>
			<GodspeedContextEditorsMutable.Provider
				value={editorMutableContext}
			>
				<GodspeedContextEditors.Provider value={editorContext}>
					<GodspeedContextKey.Provider value={keyContext}>
						<GodspeedContextRecord.Provider value={recordContext}>
							{children}
						</GodspeedContextRecord.Provider>
					</GodspeedContextKey.Provider>
				</GodspeedContextEditors.Provider>
			</GodspeedContextEditorsMutable.Provider>
		</GodspeedContextDEPRECATED.Provider>
	);
};
// @todo add defaultProps and propTypes

export default GodspeedContextProviders;
