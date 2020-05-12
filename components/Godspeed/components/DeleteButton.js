import PropTypes from "prop-types";
import { useGodspeedContext } from "../src/context";

const DeleteButton = (props) => {
	const { name, record } = props;

	const { recordOps } = useGodspeedContext();

	return (
		<button
			className="delete_button"
			onClick={() => recordOps.delete(record)}
		>
			{name}
		</button>
	);
};
DeleteButton.defaultProps = {
	name: "delete",
};
DeleteButton.propTypes = {
	name: PropTypes.string,
	record: PropTypes.shape({}).isRequired,
};

export default DeleteButton;
