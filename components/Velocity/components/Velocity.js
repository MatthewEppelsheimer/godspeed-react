import VelocityResultList from './VelocityResultList'
import VelocitySearchField from './VelocitySearchField';
import VelocityContext, { useVelocityContext } from '../src/context'

export default function Velocity(props) {
    const { children, data } = props;
    const defaultSearchPhrase = ""; // @todo implement (currently does nothing)
    const searchInputPlaceholder = props.searchInputPlaceholder || "Type to search..."

    const contextValue = useVelocityContext(data, defaultSearchPhrase);

    return (
        <VelocityContext.Provider value={contextValue}>
            { children ||
            (<>
                <VelocitySearchField placeholder={searchInputPlaceholder} />
                <VelocityResultList />
            </>)
            }
        </VelocityContext.Provider>
    )
}
