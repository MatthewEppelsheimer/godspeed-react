import PropTypes from "prop-types";
import { useGodspeedContextRecord } from "../src/context";

const DeleteButton = (props) => {
	const { name, record } = props;

	const { del } = useGodspeedContextRecord();

	return (
		<button className="delete_button" onClick={() => del(record)}>
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
