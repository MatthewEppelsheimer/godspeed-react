import PropTypes from "prop-types";
import DocumentEditor from "./DocumentEditor";
import ResultList from "./ResultList";
import SearchField from "./SearchField";
import { useGodspeed, GodspeedContextProvider } from "../src/context";

const Godspeed = (props) => {
	const {
		children,
		dataStore,
		defaultSearchPhrase,
		records,
		searchInputPlaceholder,
		slotFills,
	} = props;

	const context = useGodspeed({
		defaultSearchPhrase,
		dataStore,
		records,
		slotFills,
	});

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
	defaultSearchPhrase: "",
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
	records: PropTypes.array.isRequired,
	searchInputPlaceholder: PropTypes.string,
	slotFills: PropTypes.shape({
		resultListItemSlot: PropTypes.element,
	}),
};

export default Godspeed;
