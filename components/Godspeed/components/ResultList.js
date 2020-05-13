import Result from "./Result";
import {
	useGodspeedContextSearch,
	useGodspeedContextSelection,
} from "../src/context";

const ResultList = () => {
	const { phrase, results } = useGodspeedContextSearch();
	const { index } = useGodspeedContextSelection();

	const resultList = results.map(
		// @todo maybe move these context-provided props down a level?
		(result) => (
			<Result
				key={result.key.toString()}
				result={result}
				searchPhrase={phrase}
				selectedResultIndex={index}
			/>
		)
	);

	return <ul>{resultList}</ul>;
};

export default ResultList;
