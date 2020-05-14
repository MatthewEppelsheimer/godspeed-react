import PropTypes from "prop-types";
import DocumentEditor from "./DocumentEditor.js";
import ResultList from "./ResultList.js";
import SearchField from "./SearchField.js";
import { useGodspeed } from "../src/controller";
import GodspeedContextProviders from "./GodspeedContextProviders.js";

const Godspeed = (props) => {
	const {
		children,
		dataStore,
		defaultSearchPhrase,
		records,
		searchInputPlaceholder,
		slotFills,
	} = props;

	const actions = useGodspeed({
		defaultSearchPhrase,
		dataStore,
		records,
		slotFills,
	});

	return (
		<GodspeedContextProviders actions={actions}>
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
