import VelocityResultList from './VelocityResultList'
import VelocitySearchField from './VelocitySearchField';
import VelocityContext, { useVelocityContext } from '../src/context'

export default function Velocity(props) {
    const { children, dataStore, data } = props;
    const defaultSearchPhrase = ""; // @todo implement (currently does nothing)
    const searchInputPlaceholder = props.searchInputPlaceholder || "Type to search..." // @todo move default to config

    const context = useVelocityContext(data, dataStore, defaultSearchPhrase);

    return (
        <VelocityContext.Provider value={context}>
            { children ||
            (<>
                <VelocitySearchField placeholder={searchInputPlaceholder} />
                <VelocityResultList />
            </>)
            }
        </VelocityContext.Provider>
    )
}
