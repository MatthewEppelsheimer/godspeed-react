import { useCallback, useSyncExternalStore } from "react";

import { GsRecord, Uuid } from "./interfaces";
import { GsError } from "./errors";

/* Errors */

class GsRecordStoreError extends GsError {}

class GsRecordStoreErrorRecordAlreadyExists extends GsRecordStoreError {
	constructor(recordId: Uuid) {
		super(`store already has record with id ${recordId}`, undefined);
		this.name = "GodspeedRecordStoreErrorRecordAlreadyExists";
	}
}

class GsRecordStoreErrorRecordDoesNotExist extends GsRecordStoreError {
	constructor(recordId: Uuid) {
		super(
			`unable to access record that doesn't exist in store with id ${recordId}`,
			undefined
		);
		this.name = `GodspeedRecordStoreErrorRecordDoesNotExist`;
	}
}

/* `useSyncExternalStore`-related types */

type Listener = () => void;
type Unsubscriber = () => void;
/**
 * Equivalent to Parameters<typeof useSyncExternalStore>[0]
 */
type Subscriber = (onStoreChange: Listener) => Unsubscriber;

/* Store-internal types */

/**
 * Store-internal representation of records
 */
interface GsRecordStoreData extends GsRecord {
	listeners: Listener[];
}

/**
 * Store access methods.
 */
interface GsRecordStoreAccess {
	create: (record: GsRecord) => void;
	read: (recordId: Uuid) => GsRecord;
	update: (record: GsRecord) => void;
	delete: (recordId: Uuid) => void;
}

/**
 * The store itself
 */
const STORE_RECORDS: GsRecordStoreData[] = [];

/**
 * @throw GsRecordStoreErrorRecordAlreadyExists if record not in store with given recordId
 */
function assertRecordDoesNotExistInStore(recordId: Uuid): void {
	if (undefined !== STORE_RECORDS.find((r) => recordId === r.uuid)) {
		throw new GsRecordStoreErrorRecordAlreadyExists(recordId);
	}
}

/**
 * Get record from the store by ID, after asserting it exists
 * @throws GsRecordStoreErrorRecordDoesNotExist if record not found in store
 */
function assertRecordExistsInStoreAndGetByRecordId(
	recordId: Uuid
): GsRecordStoreData {
	const found = STORE_RECORDS.find((r) => recordId === r.uuid);
	if (undefined === found) {
		throw new GsRecordStoreErrorRecordDoesNotExist(recordId);
	}
	return found;
}

/**
 * Get the array index within the record store of a record with given id
 */
function getStoreIndexForRecordWithId(recordId: Uuid): number {
	return STORE_RECORDS.findIndex((r) => recordId === r.uuid);
}

/**
 * Subscribe a given listener to a record in store with given ID
 */
function addSubscriberToRecord(recordId: Uuid, listener: Listener): void {
	const record = assertRecordExistsInStoreAndGetByRecordId(recordId);
	record.listeners.push(listener);
}

/**
 * Unsubscribe a given listern from a record in store with given ID
 */
function removeSubscriberFromRecord(recordId: Uuid, listener: Listener): void {
	try {
		const record = assertRecordExistsInStoreAndGetByRecordId(recordId);
		record.listeners = record.listeners.filter((l) => l !== listener);
	} catch (e) {
		// It's fine if it doesn't exist; there's nothing to unsubscribe
		if (!(e instanceof GsRecordStoreErrorRecordDoesNotExist)) {
			throw e;
		}
	}
}

/**
 * Get subscribed listener callbacks from a record in the store
 */
function getListenersForRecordId(recordId: Uuid): Listener[] {
	const record = STORE_RECORDS.find((r) => recordId === r.uuid);
	return undefined === record ? [] : record.listeners;
}

/**
 * Invoke listener callbacks for a record in the store
 */
function emitChangeForRecordId(id: Uuid): void {
	getListenersForRecordId(id).forEach((l) => {
		l();
	});
}

/**
 * Invoke listener callbacks for an array of records in the store
 *
 * @TODO this is unused; delete?
 */
// function emitChangeForRecordIds(changedRecords: Uuid[]): void {
// 	changedRecords.forEach((id) => {
// 		emitChangeForRecordId(id);
// 	});
// }

/**
 * External CRUD access to store records
 *
 * At least for now, effects are limited to dumb storage and change
 * subscription management, without logic for e.g. validation, updating
 * revisions, transformations, sync with canonical source, etc.) Thus, methods
 * only work with complete GsRecord data, not e.g. GsRecordUpdateData.
 */
export const recordStoreAccess: GsRecordStoreAccess = {
	/**
	 * Add a record to the store with subscriber metadata
	 *
	 * @throws GsRecordStoreErrorRecordAlreadyExists if record already exists with given Id
	 */
	create: (record: GsRecord) => {
		assertRecordDoesNotExistInStore(record.uuid);
		STORE_RECORDS.push({ ...record, listeners: [] });
	},

	/**
	 * Read a record's state from the store
	 *
	 * @TODO unit test: this must strictly return GsRecord, and not GsRecordStoreData with its internal data
	 * @TODO unit test: a copy is returned, not a reference
	 *
	 * @throws GsRecordStoreErrorRecordDoesNotExist if record not found in store with given ID
	 */
	read: (recordId: Uuid): GsRecord => {
		const found = assertRecordExistsInStoreAndGetByRecordId(recordId);

		const record: GsRecord = { ...found };
		delete (record as GsRecord & { listeners?: Listener[] }).listeners;

		return record;
	},

	/**
	 * Overwrite a record in the store exactly with the given data
	 * @throws GsRecordStoreErrorRecordDoesNotExist if record not found in store with given ID
	 */
	update: (updatedRecord: GsRecord): void => {
		const recordId = updatedRecord.uuid;
		const oldRecord = assertRecordExistsInStoreAndGetByRecordId(recordId);
		const oldIndex = getStoreIndexForRecordWithId(updatedRecord.uuid);

		const { listeners } = oldRecord;
		const newRecord: GsRecordStoreData = { ...updatedRecord, listeners };

		STORE_RECORDS.splice(oldIndex, 1, newRecord);
		emitChangeForRecordId(recordId);
	},

	/**
	 * Delete a record from the store
	 */
	delete: (recordId: Uuid): void => {
		const oldRecord = assertRecordExistsInStoreAndGetByRecordId(recordId);
		const { listeners } = oldRecord;

		const oldIndex = getStoreIndexForRecordWithId(recordId);
		STORE_RECORDS.splice(oldIndex, 1);

		listeners.forEach((l) => {
			l();
		});
	},
};

/**
 * Record-specific Subscriber factory
 */
function makeSubscriberForRecord(recordId: Uuid): Subscriber {
	return (listener: Listener) => {
		addSubscriberToRecord(recordId, listener);
		return () => {
			removeSubscriberFromRecord(recordId, listener);
		};
	};
}

/**
 * Custom hook to sync a component with a single record's changes in the store
 */
export function useGodspeedSyncStoreForRecord(
	recordId: Uuid
): ReturnType<typeof useSyncExternalStore> {
	/**
	 * Store subscriber for changes to the record
	 */
	const subscribeToRecord: Subscriber = useCallback(
		makeSubscriberForRecord(recordId),
		[recordId]
	);

	/**
	 * Returns the record, or `undefined` if it doesn't exist, such as after it's been deleted.
	 */
	const getRecordSnapshot: () => GsRecord | undefined = useCallback<
		() => GsRecord | undefined
	>(() => {
		try {
			return recordStoreAccess.read(recordId);
		} catch (e) {
			if (e instanceof GsRecordStoreErrorRecordDoesNotExist) {
				return undefined;
			}
			throw e;
		}
	}, [recordId]);

	return useSyncExternalStore(subscribeToRecord, getRecordSnapshot);
}
