/** @format */

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

export default VelocityDeleteButton;
