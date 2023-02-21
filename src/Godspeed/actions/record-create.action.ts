import { GsRecord, GsRecordCreationData, GsRecordState } from "../interfaces";
import { GsAction, GsActionTypes } from "./actions";

export interface GsActionRecordCreate extends GsAction {
	type: GsActionTypes.recordCreate;
	updateSearch: boolean;
	record: Required<Pick<GsRecordCreationData, "name">>;
}

export function createGsActionRecordCreate(
	recordData: GsRecordCreationData,
	updateSearch: boolean = false
): GsActionRecordCreate {
	// Use body if not-empty, else use name if not-empty, else both are blank
	// @TODO DRY up with similar functionality in reducers.ts recordCreate()
	const name =
		recordData?.body && "" !== recordData.body
			? recordData.body.substring(
					0,
					recordData.body.indexOf(`\n`) || recordData.body.length
			  )
			: recordData.name || "";

	return { type: GsActionTypes.recordCreate, updateSearch, record: { name } };
}
