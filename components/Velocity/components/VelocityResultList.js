/** @format */

import VelocityResult from "./VelocityResult";
import { useVelocityContext } from "../src/context";

export default function VelocityResultList(props) {
	const { search, selection } = useVelocityContext();

	const resultList = search.results.map(
		// @todo maybe move these context-provided props down a level?
		(result) => (
			<VelocityResult
				key={result.key.toString()}
				result={result}
				searchPhrase={search.phrase}
				selectedResultIndex={selection.index}
			/>
		)
	);

	return <ul>{resultList}</ul>;
}
