import styles from "./Result.module.css";

import { buildHighlightString } from "../selection";
import DeleteButton from "./DeleteButton.js";
import {
	useGodspeedContextControlImmutable,
	useGodspeedContextSearch,
} from "../context";
import { GsRecord } from "../interfaces";

interface ResultProps {
	record: GsRecord;
	selected: boolean;
}
const Result = (props: ResultProps) => {
	const {
		record: recordControl,
		slotFills,
	} = useGodspeedContextControlImmutable();
	const { phrase } = useGodspeedContextSearch();

	const { record, selected } = props;
	const { name } = record.state;
	const { del: recordDelete } = recordControl;

	const inner =
		"" === phrase
			? name
			: buildHighlightString(phrase, name, styles.highlight);

	const fill =
		slotFills.resultListItemSlot?.(record, { delete: recordDelete }) ||
		null;

	return (
		<li className={selected ? styles.selected : ""}>
			{inner}
			<DeleteButton record={record} />
			{fill}
		</li>
	);
};

export default Result;
