import { useContext } from 'react';
import styles from './VelocityResult.module.css'
import { buildHighlightString } from '../src/selection'
import VelocityContext from '../src/context';

export default function VelocityResult(props) {
    const {result, selectedResultIndex, searchPhrase } = props;

    const { selection, slotFills } = useContext(VelocityContext);

    const inner = '' === searchPhrase ? result.value : buildHighlightString(searchPhrase,result.value,styles.highlight);

    const fill = slotFills && slotFills.resultListItemSlot &&
        slotFills.resultListItemSlot(
            result,
            {delete: selection.delete}
        ) || null;

    return <li className={result.index === selectedResultIndex ? styles.selected : ""}>{inner}{fill}</li>
}