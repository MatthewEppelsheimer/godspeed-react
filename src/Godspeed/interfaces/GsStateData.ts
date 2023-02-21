import GsRecord from "./GsRecord";
import GsRecordDataOps from "./GsRecordDataOps";

export enum GsFocusedElement {
	editor = "editor",
	search = "search",
	none = "none",
}

interface GsStateData {
	dataStore: GsRecordDataOps;
	displayedRecords: GsRecord[]; // @TODO duplicative of lots of data in `.records`; consider storing array of record indices instead
	editors: Array<{ id: string; state: any }>;
	focusedElement: GsFocusedElement;
	records: GsRecord[];
	searchPhrase: string;
	selectionIndex: number;
}

export default GsStateData;
