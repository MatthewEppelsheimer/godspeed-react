import GsRecordState from "./GsRecordState";
import Uuid from "./Uuid";

export default interface GsRecord {
	uuid: Uuid;
	state: GsRecordState; // current contents
	revisions: GsRecordState[];
	index?: number;
}
