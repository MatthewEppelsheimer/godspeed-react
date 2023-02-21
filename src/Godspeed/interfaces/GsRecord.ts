import GsRecordState from "./GsRecordState";

export default interface GsRecord {
	uuid: string; // @TODO use UUID type
	state: GsRecordState; // current contents
	revisions: GsRecordState[];
	index?: number;
}
