import GsRecord from "./GsRecord";

interface GsRecordDataOps {
	create: (newRecord: GsRecord) => void;
	update: (record: GsRecord) => void;
	del: (record: Pick<GsRecord, "uuid">) => void;
}

export default GsRecordDataOps;
