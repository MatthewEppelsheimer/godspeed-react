/** @format */

import PropTypes from "prop-types";
import VelocityDocumentEditor from "./VelocityDocumentEditor";
import VelocityResultList from "./VelocityResultList";
import VelocitySearchField from "./VelocitySearchField";
import {
	useVelocityContextState,
	VelocityContextProvider,
} from "../src/context";

const Velocity = (props) => {
	const {
		children,
		dataStore,
		data,
		searchInputPlaceholder,
		slotFills,
	} = props;
	const defaultSearchPhrase = ""; // @todo implement (currently does nothing)

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
					<VelocityDocumentEditor />
				</>
			)}
		</VelocityContextProvider>
	);
};
Velocity.defaultProps = {
	searchInputPlaceholder: "Type to search...",
};
Velocity.propTypes = {
	children: PropTypes.element,
	dataStore: PropTypes.shape({
		create: PropTypes.func,
		read: PropTypes.func,
		update: PropTypes.func,
		delete: PropTypes.func,
	}),
	data: PropTypes.array.isRequired,
	searchInputPlaceholder: PropTypes.string,
	slotFills: PropTypes.shape({
		resultListItemSlot: PropTypes.element,
	}),
};

export default Velocity;
