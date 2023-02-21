import PropTypes from "prop-types";
import { useGodspeedContextControlImmutable } from "../context";

const DeleteButton = (props: { name: string; record: any }) => {
	const { name, record } = props;

	const { del } = useGodspeedContextControlImmutable().record;

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
