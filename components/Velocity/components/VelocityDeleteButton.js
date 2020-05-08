/** @format */

import { useContext } from "react";
import VelocityContext from "../src/context";

const VelocityDeleteButton = (props) => {
	const { record } = props;
	const name = props.name || "delete";

	const { selection } = useContext(VelocityContext);

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
