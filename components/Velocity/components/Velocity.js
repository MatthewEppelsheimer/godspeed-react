/** @format */

import VelocityResultList from "./VelocityResultList";
import VelocitySearchField from "./VelocitySearchField";
import VelocityContext, { useVelocityContextState } from "../src/context";

export default function Velocity(props) {
	const { children, dataStore, data, slotFills } = props;
	const defaultSearchPhrase = ""; // @todo implement (currently does nothing)
	const searchInputPlaceholder =
		props.searchInputPlaceholder || "Type to search..."; // @todo move default to config

	const context = useVelocityContextState(
		data,
		dataStore,
		slotFills,
		defaultSearchPhrase
	);

	return (
		<VelocityContext.Provider value={context}>
			{children || (
				<>
					<VelocitySearchField placeholder={searchInputPlaceholder} />
					<VelocityResultList />
				</>
			)}
		</VelocityContext.Provider>
	);
}
