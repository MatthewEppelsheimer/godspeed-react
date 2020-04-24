import VelocityResult from './VelocityResult';

export default function VelocityResultList(props) {
    const {searchPhrase, selectedResultIndex, results} = props;

    const resultList = results.map(
        (result) => <VelocityResult result={result} searchPhrase={searchPhrase} selectedResultIndex={selectedResultIndex} />
    );

    return (
        <ul>{resultList}</ul>
    )
}