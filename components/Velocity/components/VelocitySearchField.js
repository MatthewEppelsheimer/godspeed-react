/** @format */

import { useContext, useRef } from "react";
import VelocityContext from "../src/context";

export default function VelocitySearchField(props) {
	const { placeholder } = props;

	const { handleKey, search, selection } = useContext(VelocityContext);

	const searchFieldRef = useRef(null);

	// dispatch hotkey handlers
	const handleKeyDown = (event) => {
		switch (event.key) {
			case "ArrowDown":
				selection.next();
				break;

			case "ArrowUp":
				selection.previous();
				break;

			case "Enter":
				handleKey.enter();
				break;

			case "Escape":
				const { shouldBlurSearchField } = handleKey.escape();
				if (shouldBlurSearchField) {
					searchFieldRef.current.blur();
				}
				break;
		}
	};

	// update captured component's state when input element value changes
	const handleChange = (event) => {
		search.update(event.target.value);
	};

	return (
		<input
			onKeyDown={handleKeyDown}
			onChange={handleChange}
			placeholder={placeholder}
			ref={searchFieldRef}
			value={search.phrase}
		/>
	);
}
