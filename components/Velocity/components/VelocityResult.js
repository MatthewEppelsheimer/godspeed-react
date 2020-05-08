/** @format */

import { useContext } from "react";
import styles from "./VelocityResult.module.css";
import { buildHighlightString } from "../src/selection";
import VelocityContext from "../src/context";
import VelocityDeleteButton from "./VelocityDeleteButton";

export default function VelocityResult(props) {
	const { result, selectedResultIndex, searchPhrase } = props;

	const { selection, slotFills } = useContext(VelocityContext);

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
}
