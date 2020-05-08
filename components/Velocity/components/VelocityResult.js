/** @format */

import styles from "./VelocityResult.module.css";

import PropTypes from "prop-types";
import { buildHighlightString } from "../src/selection";
import { useVelocityContext } from "../src/context";
import VelocityDeleteButton from "./VelocityDeleteButton";

const VelocityResult = (props) => {
	// @todo searchPhrase should come from context
	const { result, selectedResultIndex, searchPhrase } = props;

	const { selection, slotFills } = useVelocityContext();

	const inner =
		"" === searchPhrase
			? result.value
			: buildHighlightString(
					searchPhrase,
					result.value,
					styles.highlight
			  );

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
			<VelocityDeleteButton record={result} />
			{fill}
		</li>
	);
};
VelocityResult.propTypes = {
	result: PropTypes.shape({}).isRequired,
	selectedResultIndex: PropTypes.number.isRequired,
	searchPhrase: PropTypes.string.isRequired,
};

export default VelocityResult;
