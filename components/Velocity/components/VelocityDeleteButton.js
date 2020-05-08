/** @format */

import PropTypes from "prop-types";
import { useVelocityContext } from "../src/context";

const VelocityDeleteButton = (props) => {
	const { record } = props;
	const name = props.name || "delete";

	const { selection } = useVelocityContext();

	return (
		<button
			className="delete_button"
			onClick={() => selection.delete(record)}
		>
			{name}
		</button>
	);
};
VelocityDeleteButton.propTypes = {
	name: PropTypes.string,
	record: PropTypes.shape({}).isRequired,
};

export default VelocityDeleteButton;
