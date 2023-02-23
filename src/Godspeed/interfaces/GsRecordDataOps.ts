import { GsRecordCreationData, GsRecordUpdateData, Uuid } from "./";

interface GsRecordDataOps {
	create: (newRecord: GsRecordCreationData) => void;
	update: (record: GsRecordUpdateData) => void;
	del: (recordId: Uuid) => void;
}

export default GsRecordDataOps;
