import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import {
	GodspeedContextEditor,
	GodspeedContextImmutable,
	GodspeedContextSearch,
	GodspeedContextSelection,
} from "../src/context";

const GodspeedContextProviders = (props) => {
	const { children, actions } = props;

	const { getEditors, getState, setState } = actions.editorAccess;
	const { enter, escape } = actions.keyAccess;
	const { create, del } = actions.recordAccess;
	const updateRecord = actions.recordAccess.update;
	const {
		blur,
		focus,
		getPhrase,
		getResults,
		isSearchFieldFocused,
	} = actions.searchAccess;
	const updateSearch = actions.searchAccess.update;
	const { getIndex, next, previous, setIndex } = actions.selectionAccess;
	const { slotFills } = actions.slotFillAccess;

	// IMMUTABLE CONTEXT
	//
	// State set only at render timefor context values prevents needless consumer renders
	// see {@link https://reactjs.org/docs/context.html#caveats}
	// closures passed to useState() mean they'll only run on first render
	const [immutableContext] = useState(() => {
		return {
			editor: {
				getState, // @todo does this perhaps belong in mutable editors?
				setState,
			},
			key: {
				enter,
				escape,
			},
			record: {
				create,
				del,
				updateRecord,
			},
			search: {
				blur,
				focus,
				updateSearch,
			},
			selection: {
				next,
				previous,
				setIndex,
			},
			slotFills,
		};
	});

	// MUTABLE CONTEXTS
	//
	// Split these up so consumers only re-render when context they depend on changes

	// Only recreate mutable context values when their dependencies have changed
	// See {@link https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback}
	const useMutableContext = (contextTemplate, dependencies) => {
		if (!Array.isArray(dependencies)) {
			dependencies = [dependencies];
		}
		const prevDeps = useRef({ current: null });

		const generateContext = () => {
			prevDeps.current = dependencies;
			return contextTemplate(dependencies);
		};
		const [value, set] = useState(() => generateContext());

		if (!prevDeps.current || !isEqual(prevDeps.current, dependencies)) {
			set(generateContext());
		}

		return value;
	};

	// *** Editor Context ***

	const editors = getEditors();
	const editorContext = useMutableContext(() => {
		return {
			editors: editors,
			getEditorById: (id) => editors.find((editor) => id === editor.id),
		};
	}, editors);

	// *** Search Context ***

	const phrase = getPhrase();
	const results = getResults();
	const focused = isSearchFieldFocused();
	const searchContext = useMutableContext(() => {
		return {
			phrase,
			results,
			focused,
		};
	}, [phrase, results, focused]);

	// *** Selection Context ***

	const index = getIndex();
	const selectionContext = useMutableContext(() => {
		return {
			index,
		};
	}, index);

	return (
		<GodspeedContextImmutable.Provider value={immutableContext}>
			<GodspeedContextEditor.Provider value={editorContext}>
				<GodspeedContextSearch.Provider value={searchContext}>
					<GodspeedContextSelection.Provider value={selectionContext}>
						{children}
					</GodspeedContextSelection.Provider>
				</GodspeedContextSearch.Provider>
			</GodspeedContextEditor.Provider>
		</GodspeedContextImmutable.Provider>
	);
};
GodspeedContextProviders.propTypes = {
	actions: PropTypes.shape({
		editorAccess: PropTypes.shape({}),
		keyAccess: PropTypes.shape({}),
		recordAccess: PropTypes.shape({}),
		searchAccess: PropTypes.shape({}),
		selectionAccess: PropTypes.shape({}),
		slotFillAccess: PropTypes.shape({}),
	}),
};

export default GodspeedContextProviders;
