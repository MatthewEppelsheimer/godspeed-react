interface GsSearchActions {
	// blur search field
	blur: () => void;

	// focus search field
	focus: () => void;

	updatePhrase: (newPhrase: string) => void;
}

export default GsSearchActions;
