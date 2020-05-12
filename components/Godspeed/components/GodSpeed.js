import PropTypes from "prop-types";
import DocumentEditor from "./DocumentEditor";
import ResultList from "./ResultList";
import SearchField from "./SearchField";
import {
	useGodspeedContextState,
	GodspeedContextProvider,
} from "../src/context";

const Godspeed = (props) => {
	const {
		children,
		dataStore,
		data,
		searchInputPlaceholder,
		slotFills,
	} = props;
	const defaultSearchPhrase = ""; // @todo implement (currently does nothing)

	const context = useGodspeedContextState(
		data,
		dataStore,
		slotFills,
		defaultSearchPhrase
	);

	return (
		<GodspeedContextProvider value={context}>
			{children || (
				<>
					<SearchField placeholder={searchInputPlaceholder} />
					<ResultList />
					<DocumentEditor />
				</>
			)}
		</GodspeedContextProvider>
	);
};
Godspeed.defaultProps = {
	searchInputPlaceholder: "Type to search...",
};
Godspeed.propTypes = {
	children: PropTypes.element,
	dataStore: PropTypes.shape({
		create: PropTypes.func,
		read: PropTypes.func,
		update: PropTypes.func,
		delete: PropTypes.func,
	}),
	data: PropTypes.array.isRequired,
	searchInputPlaceholder: PropTypes.string,
	slotFills: PropTypes.shape({
		resultListItemSlot: PropTypes.element,
	}),
};

export default Godspeed;
