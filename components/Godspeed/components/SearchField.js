import { useRef } from "react";
import PropTypes from "prop-types";
import {
	useGodspeedContextDEPRECATED,
	useGodspeedContextKey,
} from "../src/context";

const SearchField = (props) => {
	const { placeholder } = props;

	const { enter, escape } = useGodspeedContextKey();
	const { search, selection } = useGodspeedContextDEPRECATED();

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
				enter();
				break;

			case "Escape":
				const { shouldBlurSearchField } = escape();
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
};
SearchField.defaultProps = {
	placeholder: "",
};
SearchField.propTypes = {
	placeholder: PropTypes.string,
};

export default SearchField;
