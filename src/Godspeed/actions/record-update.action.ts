import { GsAction, GsActionTypes } from "./actions";
import { GsRecordUpdateData } from "../interfaces";

export interface GsActionRecordUpdate extends GsAction {
	type: GsActionTypes.recordUpdate;
	recordData: GsRecordUpdateData;
}

export function createGsActionRecordUpdate(
	recordData: GsRecordUpdateData
): GsActionRecordUpdate {
	return { type: GsActionTypes.recordUpdate, recordData };
}
