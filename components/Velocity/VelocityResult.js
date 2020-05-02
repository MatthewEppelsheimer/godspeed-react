import styles from './VelocityResult.module.css'
import { buildHighlightString } from './'

export default function VelocityResult(props) {
    const {result, selectedResultIndex, searchPhrase} = props;

    const inner = '' === searchPhrase ? result.value : buildHighlightString(searchPhrase,result.value,styles.highlight);

    return <li key={result.key} className={result.index === selectedResultIndex ? styles.selected : ""}>{inner}</li>
}