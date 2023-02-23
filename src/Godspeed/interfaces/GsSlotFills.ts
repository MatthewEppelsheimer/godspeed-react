import GsRecord from "./GsRecord";
import Uuid from "./Uuid";

// 2023-02: This isn't fully implemented functionality. Created based on commented-out "mockup" from App.tsx; not sure how much or if this makes sense
interface GsResultListItemSlotOptions {
	delete: (recordId: Uuid) => void;
}

export default interface GsSlotFills {
	resultListItemSlot?: (
		record: GsRecord,
		options: GsResultListItemSlotOptions
	) => JSX.Element;
}
