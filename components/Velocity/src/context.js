import { createContext, useMemo, useState } from 'react';
import CONFIG from '../config'
import { indexData, search } from './search';

const VelocityContext = createContext({
    // @TODO convert to TypeScript interface
    handleKey: {
        escape: () => {},
    },
    search: {
        phrase: '',
        results: [],
        update: () => {},
    },
    selection: {
        index: CONFIG.default_selected_index,
        next: () => {},
        previous: () => {},
    }
});
VelocityContext.displayName = 'Velocity Context';

// custom hook to abstract core <Velocity /> functionality
const useVelocityContext = (data, defaultSearchPhrase) => {
    const initialDataMemo = useMemo(() => indexData(data),[data]);
    const [searchResults, setSearchResults] = useState(initialDataMemo);
    const [searchPhrase, setSearchPhrase] = useState('');
    // @TODO use selectedKey
    const [selectionKey, setSelectionKey] = useState(CONFIG.default_selected_key); // store key of selected element, so it stays selected even when its index changes in response to searchPhrase changes
    const [selectionIndex, setSelectionIndex] = useState(CONFIG.default_selected_index);

    // wrap setSelectedResultIndex by updating selectionKey as well first
    const updateSelectedTo = (newValue) => {
        setSelectionIndex(newValue);
        setSelectionKey(CONFIG.default_selected_index === newValue ? "" : searchResults[newValue].key);
    };

    // wrap setSearchPhrase() to also update results
    const updateSearch = (phrase) => {
        setSearchPhrase(phrase);
        // only recompute if not clearing search field
        setSearchResults(defaultSearchPhrase === phrase ? initialDataMemo : search(phrase,data));

        // @TODO: instead of this, update selectedIndex based on key here
        updateSelectedTo(CONFIG.default_selected_index);
    };

    // move selected result down one; don't go further than last result
    const selectNext = () => {
        updateSelectedTo(searchResults.length -1 === selectionIndex ? selectionIndex : selectionIndex + 1);
    };

    // move selected result up one; don't go further than -1, which is none selected
    const selectPrevious = () => {
        updateSelectedTo(CONFIG.default_selected_index === selectionIndex ? selectionIndex : selectionIndex - 1);
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
        } else if (-1 !== selectionIndex) {
            updateSelectedTo(CONFIG.default_selected_index);
        } else if ('' === searchPhrase) {
            shouldBlurSearchField = true;
            updateSelectedTo(CONFIG.default_selected_index);
        } else {
            updateSearch(defaultSearchPhrase);
            updateSelectedTo(CONFIG.default_selected_index);
        }

        return { shouldBlurSearchField };
    };
    
    const contextValue = {
        handleKey: {
            escape: handleKeyEscape,
        },
        search: {
            phrase: searchPhrase,
            results: searchResults,
            update: updateSearch,
        },
        selection: {
            index: selectionIndex,
            next: selectNext,
            previous: selectPrevious,
        },
    };

    return contextValue;
}

export default VelocityContext;
export {
    useVelocityContext
};