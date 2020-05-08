/** @format */

import VelocityResultList from "./VelocityResultList";
import VelocitySearchField from "./VelocitySearchField";
import {
	useVelocityContextState,
	VelocityContextProvider,
} from "../src/context";

const Velocity = (props) => {
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
		<VelocityContextProvider value={context}>
			{children || (
				<>
					<VelocitySearchField placeholder={searchInputPlaceholder} />
					<VelocityResultList />
				</>
			)}
		</VelocityContextProvider>
	);
};

export default Velocity;
