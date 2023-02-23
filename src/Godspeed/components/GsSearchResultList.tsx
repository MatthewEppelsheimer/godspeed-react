import GsSearchResult from "./GsSearchResult";
import {
	useGodspeedContextSearch,
	useGodspeedContextSelection,
} from "../context";

function GsSearchResultList() {
	const { results } = useGodspeedContextSearch();
	const { index } = useGodspeedContextSelection();

	return (
		<ul>
			{results.map((result) => (
				<GsSearchResult
					key={result.uuid}
					record={result}
					selected={index === result.index}
				/>
			))}
		</ul>
	);
}

export default GsSearchResultList;
