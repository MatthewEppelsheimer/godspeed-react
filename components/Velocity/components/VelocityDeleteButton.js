import PropTypes from "prop-types";
import { useVelocityContext } from "../src/context";

const VelocityDeleteButton = (props) => {
	const { name, record } = props;

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
VelocityDeleteButton.defaultProps = {
	name: "delete",
};
VelocityDeleteButton.propTypes = {
	name: PropTypes.string,
	record: PropTypes.shape({}).isRequired,
};

export default VelocityDeleteButton;
