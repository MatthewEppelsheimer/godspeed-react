import Result from "./Result";
import { useGodspeedContextDEPRECATED } from "../src/context/deprecated";

const ResultList = () => {
	const { search, selection } = useGodspeedContextDEPRECATED();

	const resultList = search.results.map(
		// @todo maybe move these context-provided props down a level?
		(result) => (
			<Result
				key={result.key.toString()}
				result={result}
				searchPhrase={search.phrase}
				selectedResultIndex={selection.index}
			/>
		)
	);

	return <ul>{resultList}</ul>;
};

export default ResultList;
