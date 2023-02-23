interface GsSelectionActions {
	// move selection to one index down; don't go further than last result
	next: () => void;
	// move selection to one index up; don't go further than -1, which means none selected
	previous: () => void;
	// set selection index
	setIndex: (newIndex: number) => void;
}

export default GsSelectionActions;
