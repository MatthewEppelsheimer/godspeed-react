import { GsAction, GsActionTypes } from "./actions";

export interface GsActionRecordDelete extends GsAction {
	type: GsActionTypes.recordDelete;
	record: {
		uuid: string; // @TODO make "UUID" type
	};
}

// @TODO make "UUID" type
export function createGsActionRecordDelete(uuid: string): GsActionRecordDelete {
	return { type: GsActionTypes.recordDelete, record: { uuid } };
}
