import styles from './VelocityResult.module.css'
import { buildHighlightString } from '../src/selection'

export default function VelocityResult(props) {
    const {result, selectedResultIndex, searchPhrase} = props;

    const inner = '' === searchPhrase ? result.value : buildHighlightString(searchPhrase,result.value,styles.highlight);

    return <li className={result.index === selectedResultIndex ? styles.selected : ""}>{inner}</li>
}