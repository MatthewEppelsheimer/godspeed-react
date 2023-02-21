import DateNumber from "./DateNumber";

export default interface GsRecordState {
	name: string; // duplicates first line of body, for search/ease of processing
	body: string; // rich text... how?
	// @TODO change to `modified`
	date: DateNumber; // unix timestamp
}
