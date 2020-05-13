import styles from "./Result.module.css";

import PropTypes from "prop-types";
import { buildHighlightString } from "../src/selection";
import DeleteButton from "./DeleteButton";
import { useGodspeedContextImmutable } from "../src/context";

const Result = (props) => {
	// @todo searchPhrase and selectedResultIndex should both come from context
	const { result, selectedResultIndex, searchPhrase } = props;

	const { record, slotFills } = useGodspeedContextImmutable();
	const { del } = record;

	const inner =
		"" === searchPhrase
			? result.name
			: buildHighlightString(searchPhrase, result.name, styles.highlight);

	const fill =
		slotFills.resultListItemSlot?.(
			result,
			{ delete: del } // ops object w/ action-firing callbacks
		) || null;

	return (
		<li
			className={
				result.index === selectedResultIndex ? styles.selected : ""
			}
		>
			{inner}
			<DeleteButton record={result} />
			{fill}
		</li>
	);
};
Result.defaultProps = {
	selectedResultIndex: -1,
	searchPhrase: "",
};
Result.propTypes = {
	result: PropTypes.shape({}).isRequired,
	selectedResultIndex: PropTypes.number.isRequired,
	searchPhrase: PropTypes.string.isRequired,
};

export default Result;
