import { GsRecordCreationData, GsRecordUpdateData, Uuid } from "./";

interface GsRecordActions {
	// optionally suppress updating search with updateSearch = false
	create: (recordData: GsRecordCreationData, updateSearch: boolean) => void;
	// Delete a record and remove it from displayedRecords
	// @TODO create a GsRecordDeleteData for consistency
	del: (recordId: Uuid) => void;
	// @TODO (pre-TypeScript) after finish controller/reducer refactor, update callers' signatures to pass newBody as a member of record
	update: (record: GsRecordUpdateData) => void;
}

export default GsRecordActions;
