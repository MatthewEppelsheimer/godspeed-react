import { GsRecord } from ".";

/**
 * To avoid duplicating all GsRecord data in a result list
 */
type GsRecordIdData = Pick<GsRecord, "uuid">;

export default GsRecordIdData;
