/** @format */

import { useContext } from "react";
import VelocityResult from "./VelocityResult";
import VelocityContext from "../src/context";

export default function VelocityResultList(props) {
	const { search, selection } = useContext(VelocityContext);

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
