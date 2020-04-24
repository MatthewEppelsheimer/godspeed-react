import { Fragment, useMemo, useRef, useState } from 'react'
import VelocityResultList from './VelocityResultList'

const DATA = [
    {
        key: "pandas1", // Unique identifier, use for list key
        value: "of all animals pandas",
    },
    {
        key: "pandas2",
        value: "of all animals pandas are",
    },
    {
        key: "pandas3",
        value: "of all animals pandas are the best",
    },
    {
        key: "pandas4",
        value: "of all animals pandas are the best absolutely",
    },
    {
        key: "monkeys1",
        value: "of all animals monkeys",
    },
    {
        key: "monkeys2",
        value: "of all animals monkeys are",
    },
    {
        key: "monkeys3",
        value: "of all animals monkeys are okay I guess",
    },
    {
        key: "garbage",
        value: "allllll animals",
    },
];

const DEFAULT_SELECTED_INDEX = -1;
const DEFAULT_SELECTED_KEY = "";
const DEFAULT_SEARCH_PHRASE = "";
const SEARCH_INPUT_PLACEHOLDER = "Type to search..."

const DEBUG = false;

// add sequential indices to each member of array `data`
// used to dynamically index results after they change in response to new search phrase
const indexData = (data) => {
    for (let i = 0; i < data.length; i++) {
        data[i].index = i;
    }

    return data;
};

const search = (phrase,data) => {
    const newResults = data
        .filter(
            (item) => item.value.indexOf(phrase) > -1
        );

    // @TODO refactor indexData() to be chainable; add after .map() two lines above
    return indexData(newResults);
}

export default function Velocity() {
    const initialDataMemo = useMemo(() => indexData(DATA),[DATA]);
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
        setResults(DEFAULT_SEARCH_PHRASE === phrase ? initialDataMemo : search(phrase,DATA));

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
            updateSearch(DEFAULT_SEARCH_PHRASE);
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
                placeholder={SEARCH_INPUT_PLACEHOLDER}
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
