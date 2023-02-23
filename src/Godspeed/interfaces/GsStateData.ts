import GsEditorData from "./GsEditorData";

import GsRecord from "./GsRecord";
import GsRecordDataOps from "./GsRecordDataOps";
import GsSearchPhrase from "./GsSearchPhrase";
import GsSelectionIndex from "./GsSelectionIndex";

export enum GsFocusedElement {
	editor = "editor",
	search = "search",
	none = "none",
}

interface GsStateData {
	dataStore: GsRecordDataOps;
	displayedRecords: GsRecord[]; // @TODO duplicative of lots of data in `.records`; consider storing array of record indices instead
	editors: GsEditorData[];
	focusedElement: GsFocusedElement;
	records: GsRecord[];
	searchPhrase: GsSearchPhrase;
	selectionIndex: GsSelectionIndex;
}

export default GsStateData;
