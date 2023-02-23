import GsDocumentEditor from "./GsDocumentEditor";
import GsSearchResultList from "./GsSearchResultList";
import GsSearchField from "./GsSearchField";
import { useGodspeed } from "../useGodspeed";
import GsContextProviders from "./GsContextProviders";
import {
	GsRecord,
	GsRecordDataOps,
	// GsSlotFills
} from "../interfaces";
import { PropsWithChildren } from "react";

interface GodspeedProps extends PropsWithChildren {
	dataStore: GsRecordDataOps;
	defaultSearchPhrase?: string;
	records: GsRecord[];
	searchInputPlaceholder?: string;
	// slotFills: GsSlotFills;
}

const Godspeed = ({
	children,
	dataStore,
	defaultSearchPhrase = "",
	records,
	searchInputPlaceholder = "Type to search...",
}: // slotFills,
GodspeedProps) => {
	const { actions, state } = useGodspeed({
		defaultSearchPhrase,
		dataStore,
		recordData: records,
		// slotFills,
	});

	return (
		<GsContextProviders actions={actions} godspeedState={state}>
			{children ?? (
				<>
					<GsSearchField placeholder={searchInputPlaceholder} />
					<GsSearchResultList />
					<GsDocumentEditor id="godspeed-demo-editor" />
				</>
			)}
		</GsContextProviders>
	);
};

export default Godspeed;
