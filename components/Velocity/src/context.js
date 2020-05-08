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
// @TODO change signature to accept an object w/ keyed input instead of individual params
const useVelocityContext = (dataIn, dataStore, slotFills, defaultSearchPhrase) => {
    const initialData = useMemo(() => indexData(dataIn), [dataIn]); // ONLY for setting INITIAL state values
    const initialState = {
        records: initialData,
        displayedRecords: initialData,
    };

    // @WIP refactor to combine these into the reducer
    const [state, dispatch] = useReducer(dataReducer, indexData(initialState));
    const [searchPhrase, setSearchPhrase] = useState('');
    // @TODO use selectedKey
    // const [selectionKey, setSelectionKey] = useState(CONFIG.default_selected_key); // store key of selected element, so it stays selected even when its index changes in response to searchPhrase changes
    const [selectionIndex, setSelectionIndex] = useState(CONFIG.default_selected_index);

    // wrap setSelectedResultIndex by updating selectionKey as well first
    const updateSelectedTo = (newValue) => {
        setSelectionIndex(newValue);
        // setSelectionKey(CONFIG.default_selected_index === newValue ? "" : state.records.find(result => newValue === result.index).key);
    };

    // completely replace records with passed-in state
    // so far unused
    const setRecordsTo = (records) => {
        dispatch({
            type: 'records.set',
            records: records
        })
    };

    // @TODO, and replace that state
    // const setSearchPhrase = (phrase) => {

    // };

    // @WIP replacing individual state with this
    // @TODO; make the reducer wrap in indexData()
    const setDisplayedRecords = (records) => {
        dispatch({
            type: 'displayedRecords.set',
            records: records,
        });
    };

    // wrap setSearchPhrase() to also update results
    const updateSearch = (phrase) => {
        phrase = phrase || defaultSearchPhrase;

        // console.log('updateSearch called; phrase is', phrase);
        setSearchPhrase(phrase);
        // only recompute if not clearing search field
        // dispatch({
        //     type: 'setSearchPhrase',
        //     phrase: phrase,
        // });
        setDisplayedRecords(defaultSearchPhrase === phrase ? state.records : indexData(search(phrase,state.records)));

        // @TODO: instead of this, update selectedIndex based on key here
        updateSelectedTo(CONFIG.default_selected_index);
    };

    // move selected result down one; don't go further than last result
    const selectNext = () => {
        updateSelectedTo(state.displayedRecords.length - 1 === selectionIndex ? selectionIndex : selectionIndex + 1);
    };

    // move selected result up one; don't go further than -1, which is none selected
    const selectPrevious = () => {
        updateSelectedTo(CONFIG.default_selected_index === selectionIndex ? selectionIndex : selectionIndex - 1);
    };
    
    const createRecord = (record) => {
        // create the record
        const type = 'record.create';

        const newRecord = {
            key: new Date().getTime(),
            value: record.value,
        };

        dispatch({
            type,
            newRecord,
        });

        updateSearch();

        // update external data store when there is one
        // @TODO avoid calling this if dispatching the action failed
        dataStore && dataStore.create && dataStore.create(newRecord);
    };
    
    // Delete a record
    const deleteRecord = (record) => {
        // this also removes it from displayedRecords
        dispatch({
            type: 'record.delete',
            key: record.key,
        });

        // console.log('records before updateSearch:',state.records);

        // update external data store when there is one
        // @TODO avoid calling this if dispatching the action failed
        dataStore && dataStore.delete && dataStore.delete(record);
    }

    const handleKeyEnter = () => {
        if (CONFIG.default_selected_index !== selectionIndex) {
            // if something's selected, open it
            // @TODO
        } else {
            // if nothing selected:
            // create new record
            createRecord({value: searchPhrase});
            // show all records (including new one)
            setDisplayedRecords(state.records);
            // select the new record
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
            results: state.displayedRecords,
            update: updateSearch,
        },
        selection: {
            delete: deleteRecord,
            create: createRecord,
            index: selectionIndex,
            next: selectNext,
            previous: selectPrevious,
        },
        slotFills: slotFills,
    };

    return contextValue;
}

export default VelocityContext;
export {
    useVelocityContext
};