import GsRecord from "./GsRecord";

type GsRecordEditorData = Omit<GsRecord, "revisions" & "index">;

export default GsRecordEditorData;
