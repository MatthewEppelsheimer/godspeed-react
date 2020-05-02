import { useContext } from 'react';
import VelocityResult from './VelocityResult';
import VelocityContext from './context'

export default function VelocityResultList(props) {
    const {
        search,
        selection,
    } = useContext(VelocityContext);

    const resultList = search.results.map(
        (result) => <VelocityResult result={result} searchPhrase={search.phrase} selectedResultIndex={selection.index} />
    );

    return (
        <ul>{resultList}</ul>
    )
}