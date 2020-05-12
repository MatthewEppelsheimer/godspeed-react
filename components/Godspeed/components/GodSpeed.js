import PropTypes from "prop-types";
import DocumentEditor from "./DocumentEditor";
import ResultList from "./ResultList";
import SearchField from "./SearchField";
import { useGodspeed } from "../src/controller";
import { GodspeedContextProviders } from "../src/context";

const Godspeed = (props) => {
	const {
		children,
		dataStore,
		defaultSearchPhrase,
		records,
		searchInputPlaceholder,
		slotFills,
	} = props;

	const controllers = useGodspeed({
		defaultSearchPhrase,
		dataStore,
		records,
		slotFills,
	});

	return (
		<GodspeedContextProviders controllers={controllers}>
			{children || (
				<>
					<SearchField placeholder={searchInputPlaceholder} />
					<ResultList />
					<DocumentEditor />
				</>
			)}
		</GodspeedContextProviders>
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
