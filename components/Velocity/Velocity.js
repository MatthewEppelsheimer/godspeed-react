import VelocityResultList from './VelocityResultList'
import VelocitySearchField from './VelocitySearchField';
import VelocityContext, { useVelocityContext } from './context'

export default function Velocity(props) {
    const { data } = props;
    const defaultSearchPhrase = ""; // @todo implement (currently does nothing)
    const searchInputPlaceholder = props.searchInputPlaceholder || "Type to search..."

    const contextValue = useVelocityContext(data, defaultSearchPhrase);

    return (
        <VelocityContext.Provider value={contextValue}>
            <VelocitySearchField placeholder={searchInputPlaceholder} />
            <VelocityResultList />
        </VelocityContext.Provider>
    )
}
