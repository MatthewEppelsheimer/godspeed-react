import PropTypes from "prop-types";
import { useGodspeedContextDEPRECATED } from "../src/context/deprecated";

const DeleteButton = (props) => {
	const { name, record } = props;

	const { recordOps } = useGodspeedContextDEPRECATED();

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
