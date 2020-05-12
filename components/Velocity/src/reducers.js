import { log } from "./log";
import { indexData } from "./search";

// @todo define & return newState once, reused by each case
const dataReducer = (state, action) => {
	const getRecordByIndex = (index) => {
		return state.records.find((record) => index === record.index);
	};

	const getRecordById = (id) => {
		return state.records.find((record) => id === record.key);
	};

	// console.log("dataReducer called with state:", state, "action:", action);
	switch (action.type) {
		// Replace entire set of records set
		case "records.set":
			try {
				state.records = indexData(action.records);
				return state;
			} catch (error) {
				log(error);
			}
			break;

		case "displayedRecords.set":
			// Replace entire set of displayedRecords
			try {
				const newState = { ...state };
				newState.displayedRecords = indexData(action.records);
				// console.log("reducer returning with newState:", newState);
				return newState;
			} catch (error) {
				log(error);
			}
			break;

		case "record.create":
			// add record to dataset
			try {
				const newState = { ...state };
				newState.records.unshift(action.newRecord);
				newState.records = indexData(newState.records);
				return newState;
			} catch (error) {
				log(error);
			}
			break;

		case "record.delete":
			// delete record from dataset
			try {
				const filter = (records) =>
					indexData(
						records.filter((record) => action.key !== record.key)
					);
				const newState = { ...state };

				// @TODO stopping after done would be more efficient than always looping through all records
				newState.records = filter(newState.records);
				newState.displayedRecords = filter(newState.displayedRecords);
				// console.log("delete case returning with newState:", state);
				return newState;
			} catch (error) {
				log(error);
			}
			break;

		case "record.setActive":
			// switch the active document
			try {
				const newState = { ...state };
				const record = getRecordByIndex(action.index);
				const id = action.editorId;

				const newEditor = {
					id,
					record,
				};

				let uninitialized = true; // assume it doesn't exist yet
				newState.editors = newState.editors.map((editor) => {
					if (id === editor.id) {
						editor = newEditor;
						uninitialized = false; // it exists
					}

					return editor;
				});

				// initialize the editor if needed
				if (uninitialized) {
					newState.editors.unshift(newEditor);
				}

				return newState;
			} catch (error) {
				log(error);
			}
			break;

		case "record.update":
			// update the active document
			try {
				const newState = { ...state };
				const record = getRecordById(action.key);

				newState.records.map((record) => {
					if (action.key === record.key) {
						record.body = action.body;
					}
					return record;
				});

				return newState;
			} catch (error) {
				log(error);
			}
			break;

		default:
			log(new Error("unrecognized action.type"));
			return false;
	}
};

export { dataReducer };
