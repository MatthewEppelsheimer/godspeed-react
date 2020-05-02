import { Fragment, useMemo, useRef, useState } from 'react'
import VelocityResultList from './VelocityResultList'
import { indexData, search } from './index'

const DEFAULT_SELECTED_INDEX = -1;
const DEFAULT_SELECTED_KEY = "";

const DEBUG = false;

export default function Velocity(props) {
    const defaultSearchPhrase = ""; // @todo implement (currently does nothing)
    const searchInputPlaceholder = props.searchInputPlaceholder || "Type to search..."

    const initialDataMemo = useMemo(() => indexData(props.data),[props.data]);
    const [results, setResults] = useState(initialDataMemo);
    const [searchPhrase, setSearchPhrase] = useState('');
    const [selectedKey, setSelectedKey] = useState(DEFAULT_SELECTED_KEY); // store key of selected element, so it stays selected even when its index changes in response to searchPhrase changes
    const [selectedResultIndex, setSelectedResultIndex] = useState(DEFAULT_SELECTED_INDEX);
    const inputEl = useRef(null); // for .blur() calls

    // wrap setSelectedResultIndex by updating selectedKey as well first
    const updateSelectedTo = (newValue) => {
        setSelectedResultIndex(newValue);
        setSelectedKey(DEFAULT_SELECTED_INDEX === newValue ? "" : results[newValue].key);
    };

    // WIP
    // wrap setSearchPhrase() to also update results
    const updateSearch = (phrase) => {
        setSearchPhrase(phrase);
        // only recompute if not clearing search field
        setResults(defaultSearchPhrase === phrase ? initialDataMemo : search(phrase,props.data));

        // @TODO: instead of this, update selectedIndex based on key here
        updateSelectedTo(DEFAULT_SELECTED_INDEX);
    };

    // first clear selected result, then clear search input, then blur search input
    const handleKeyEscape = () => {
        if (-1 !== selectedResultIndex) {
            updateSelectedTo(DEFAULT_SELECTED_INDEX);
        } else if ('' === searchPhrase) {
            inputEl.current.blur();
            updateSelectedTo(DEFAULT_SELECTED_INDEX);
        } else {
            updateSearch(defaultSearchPhrase);
            updateSelectedTo(DEFAULT_SELECTED_INDEX);
        }
    };

    // move selected result down one; don't go further than last result
    const handleKeyArrowDown = () => {
        updateSelectedTo(results.length -1 === selectedResultIndex ? selectedResultIndex : selectedResultIndex + 1);
    };

    // move selected result up one; don't go further than -1, which is none selected
    const handleKeyArrowUp = () => {
        updateSelectedTo(DEFAULT_SELECTED_INDEX === selectedResultIndex ? selectedResultIndex : selectedResultIndex - 1);
    };

    // dispatch hotkey handlers
    const handleKeyDown = (event) => {
        DEBUG && console && console.log(event.type, event.key,event);

        switch (event.key) {
            case 'ArrowDown':
                handleKeyArrowDown();
                break;
                
            case 'ArrowUp':
                handleKeyArrowUp();
                break;

            case 'Escape':
                handleKeyEscape();
                break;
        }
    };

    // update captured componet's state when input element value changes
    const handleChange = (event) => {
        DEBUG && console && console.log(event.type, event.target.value,event);
        updateSearch(event.target.value);
    };

    return (
        <Fragment>
            <input
                onKeyDown={handleKeyDown}
                onChange={handleChange}
                placeholder={searchInputPlaceholder}
                ref={inputEl}
                value={searchPhrase}
            />
            <VelocityResultList
                results={results}
                searchPhrase={searchPhrase}
                selectedResultIndex={selectedResultIndex}
            />
        </Fragment>
    )
}
