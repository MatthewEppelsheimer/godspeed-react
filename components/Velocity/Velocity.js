import { useMemo, useState } from 'react'
import VelocityResultList from './VelocityResultList'
import { indexData, search } from './index'
import VelocitySearchField from './VelocitySearchField';
import VelocityContext from './context'
import { DEFAULT_SELECTED_INDEX, DEFAULT_SELECTED_KEY } from './config'

export default function Velocity(props) {
    const { data } = props;
    const defaultSearchPhrase = ""; // @todo implement (currently does nothing)
    const searchInputPlaceholder = props.searchInputPlaceholder || "Type to search..."

    const initialDataMemo = useMemo(() => indexData(data),[data]);
    const [results, setResults] = useState(initialDataMemo);
    const [searchPhrase, setSearchPhrase] = useState('');
    // @TODO use selectedKey
    const [selectedKey, setSelectedKey] = useState(DEFAULT_SELECTED_KEY); // store key of selected element, so it stays selected even when its index changes in response to searchPhrase changes
    const [selectedResultIndex, setSelectedResultIndex] = useState(DEFAULT_SELECTED_INDEX);

    // wrap setSelectedResultIndex by updating selectedKey as well first
    const updateSelectedTo = (newValue) => {
        setSelectedResultIndex(newValue);
        setSelectedKey(DEFAULT_SELECTED_INDEX === newValue ? "" : results[newValue].key);
    };

    // wrap setSearchPhrase() to also update results
    const updateSearch = (phrase) => {
        setSearchPhrase(phrase);
        // only recompute if not clearing search field
        setResults(defaultSearchPhrase === phrase ? initialDataMemo : search(phrase,data));

        // @TODO: instead of this, update selectedIndex based on key here
        updateSelectedTo(DEFAULT_SELECTED_INDEX);
    };

    // move selected result down one; don't go further than last result
    const selectNext = () => {
        updateSelectedTo(results.length -1 === selectedResultIndex ? selectedResultIndex : selectedResultIndex + 1);
    };

    // move selected result up one; don't go further than -1, which is none selected
    const selectPrevious = () => {
        updateSelectedTo(DEFAULT_SELECTED_INDEX === selectedResultIndex ? selectedResultIndex : selectedResultIndex - 1);
    };
    
    // Behavior spans across entire Velocity context so this belongs here
    // first blur document editor & focus search,
    //  then clear selected result,
    //  then clear search input,
    //  then blur search input
    const handleKeyEscape = () => {
        let shouldBlurSearchField = false;

        if ( false ) {
            // @todo implement switch of focus from document editor to search field
        } else if (-1 !== selectedResultIndex) {
            updateSelectedTo(DEFAULT_SELECTED_INDEX);
        } else if ('' === searchPhrase) {
            shouldBlurSearchField = true;
            updateSelectedTo(DEFAULT_SELECTED_INDEX);
        } else {
            updateSearch(defaultSearchPhrase);
            updateSelectedTo(DEFAULT_SELECTED_INDEX);
        }

        return { shouldBlurSearchField };
    };
    
    const contextValue = {
        handleKey: {
            escape: handleKeyEscape,
        },
        search: {
            phrase: searchPhrase,
            results: results,
            update: updateSearch,
        },
        selection: {
            index: selectedResultIndex,
            next: selectNext,
            previous: selectPrevious,
        },
    };

    return (
        <VelocityContext.Provider value={contextValue}>
            <VelocitySearchField placeholder={searchInputPlaceholder} />
            <VelocityResultList />
        </VelocityContext.Provider>
    )
}
