import { GsRecord, GsRecordCreationData, Uuid } from "./";

interface GsRecordDataOps {
	create: (newRecord: GsRecordCreationData) => void;
	update: (record: GsRecord) => void;
	del: (recordId: Uuid) => void;
}

export default GsRecordDataOps;
