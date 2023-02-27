import { EditorState } from "draft-js";
import GsRecordEditorData from "./GsRecordEditorData";

interface GsEditorData {
	id: string;
	record?: GsRecordEditorData;
	state?: EditorState;
}

export default GsEditorData;
