interface GsContextControlImmutable {
	editor: {
		getState: any;
		setState: (
			editorId: any,
			newEditorState: any,
			record?: any,
			newRecordBody?: any
		) => void;
		focusEditor: any;
	};
	key: {
		enter: () => void;
		escape: () => void;
	};
	record: {
		create: any;
		del: (record: any) => void;
		updateRecord: any;
	};
	search: {
		blur: () => void;
		focus: () => void;
		updateSearch: (phrase: string) => void;
	};
	selection: {
		next: () => void;
		previous: () => void;
		setIndex: any;
	};
	slotFills: {
		resultListItemSlot?: any;
	};
}

export default GsContextControlImmutable;
