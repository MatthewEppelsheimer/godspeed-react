import styles from "./Result.module.css";

import PropTypes from "prop-types";
import { buildHighlightString } from "../src/selection";
import { useGodspeedContextDEPRECATED } from "../src/context/deprecated";
import DeleteButton from "./DeleteButton";

const Result = (props) => {
	// @todo searchPhrase and selectedResultIndex should both come from context
	const { result, selectedResultIndex, searchPhrase } = props;

	const { selection, slotFills } = useGodspeedContextDEPRECATED();

	const inner =
		"" === searchPhrase
			? result.name
			: buildHighlightString(searchPhrase, result.name, styles.highlight);

	const fill =
		slotFills.resultListItemSlot?.(
			result,
			{ delete: selection.delete } // ops object w/ action-firing callbacks
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
