import Result from "./Result";
import {
	useGodspeedContextSearch,
	useGodspeedContextSelection,
} from "../context";

const ResultList = () => {
	const { results } = useGodspeedContextSearch();
	const { index } = useGodspeedContextSelection();

	return (
		<ul>
			{results.map((result) => (
				<Result
					key={result.uuid}
					record={result}
					selected={index === result.index}
				/>
			))}
		</ul>
	);
};

export default ResultList;
