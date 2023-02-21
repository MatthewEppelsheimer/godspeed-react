import DocumentEditor from "./DocumentEditor";
import ResultList from "./ResultList";
import SearchField from "./SearchField";
import { useGodspeed } from "../controller";
import GsContextProviders from "./GodspeedContextProviders";
import { GsRecord } from "../interfaces";

interface GodspeedProps {
	children?: any;
	dataStore: any;
	defaultSearchPhrase: any;
	records: GsRecord[];
	searchInputPlaceholder: any;
	slotFills: any;
}

const Godspeed = (props: GodspeedProps) => {
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
		<GsContextProviders actions={actions}>
			{children || (
				<>
					<SearchField placeholder={searchInputPlaceholder} />
					<ResultList />
					<DocumentEditor />
				</>
			)}
		</GsContextProviders>
	);
};
Godspeed.defaultProps = {
	defaultSearchPhrase: "",
	searchInputPlaceholder: "Type to search...",
};

export default Godspeed;
