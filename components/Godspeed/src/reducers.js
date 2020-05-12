import { log } from "./log";
import { indexData } from "./search";

// @todo define & return newState once, reused by each case
const dataReducer = (state, action) => {
	const getRecordByIndex = (index) => {
		return state.records.find((record) => index === record.index);
	};

	const newState = { ...state };

	try {
		switch (action.type) {
			// Replace entire set of displayedRecords
			case "displayedRecords.set":
				newState.displayedRecords = indexData(action.records);
				break;

			// Set an editor's state
			case "editor.setState":
				newState.editors.map((editor) => {
					if (action.editorId === editor.id) {
						editor.state = action.newEditorState;
					}
					return editor;
				});

				if (action.record?.key && action.newRecordBody) {
					newState.records.map((rec) => {
						if (action.record.key === rec.key) {
							rec.body = action.newRecordBody;
						}
						return rec;
					});
				}
				break;

			// Replace entire set of records set
			case "records.set":
				newState.records = indexData(action.records);
				break;

			// add record to dataset
			case "record.create":
				newState.records.unshift(action.newRecord);
				newState.records = indexData(newState.records);
				break;

			// delete record from dataset
			case "record.delete":
				const filter = (records) =>
					indexData(
						records.filter((record) => action.key !== record.key)
					);

				// @TODO stopping after done would be more efficient than always looping through all records
				newState.records = filter(newState.records);
				newState.displayedRecords = filter(newState.displayedRecords);
				break;

			// switch the active document
			case "record.setActive":
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
				break;

			// update the active document
			case "record.update":
				newState.records.map((record) => {
					if (action.key === record.key) {
						record.body = action.body;
					}
					return record;
				});
				break;

			default:
				log(new Error("unrecognized action.type"));
		}
	} catch (error) {
		log(error);
	}

	return newState;
};

export { dataReducer };
