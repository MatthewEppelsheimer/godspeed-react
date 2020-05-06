import { createContext, useMemo, useState, useReducer } from 'react';
import CONFIG from '../config'
import { indexData, search } from './search';
import { dataReducer } from './reducers';

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
const useVelocityContext = (dataIn, dataStore, defaultSearchPhrase) => {
    const [data, dispatch] = useReducer(dataReducer, indexData(dataIn));
    // const data = useMemo(() => indexData(data),[data]);
    const [searchResults, setSearchResults] = useState(data);
    const [searchPhrase, setSearchPhrase] = useState('');
    // @TODO use selectedKey
    const [selectionKey, setSelectionKey] = useState(CONFIG.default_selected_key); // store key of selected element, so it stays selected even when its index changes in response to searchPhrase changes
    const [selectionIndex, setSelectionIndex] = useState(CONFIG.default_selected_index);

    // wrap setSelectedResultIndex by updating selectionKey as well first
    const updateSelectedTo = (newValue) => {
        setSelectionIndex(newValue);
        // setSelectionKey(CONFIG.default_selected_index === newValue ? "" : searchResults.find(result => newValue === result.index).key);
    };

    // wrap setSearchPhrase() to also update results
    const updateSearch = (phrase) => {
        setSearchPhrase(phrase);
        // only recompute if not clearing search field
        setSearchResults(defaultSearchPhrase === phrase ? data : search(phrase,data));

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
    
    const createRecord = (data) => {
        const type = 'create';

        // create the record
        const newRecord = {
            key: new Date().getTime(),
            value: data.value,
        };
        dispatch({
            type,
            newRecord,
        });

        // update external data store when there is one
        dataStore && dataStore.create && dataStore.create(newRecord);
    };
    
    const handleKeyEnter = () => {
        if (CONFIG.default_selected_index !== selectionIndex) {
            // if something's selected, open it
            // @TODO
        } else {
            // if nothing selected, create new record then select it
            createRecord({value: searchPhrase});
            
            // Necessary to show all again
            // Alternately we could just search for the newly created one,
            // but I think this is better UX.
            setSearchResults(data);
            updateSelectedTo(0);
        }
    }

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
            enter: handleKeyEnter,
            escape: handleKeyEscape,
        },
        search: {
            phrase: searchPhrase,
            results: searchResults,
            update: updateSearch,
        },
        selection: {
            create: createRecord,
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