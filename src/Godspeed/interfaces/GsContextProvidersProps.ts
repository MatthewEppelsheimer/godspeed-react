interface GsContextProvidersProps {
	actions: {
		editorAccess: {
			focusEditor: () => void;
			getEditors: () => any;
			getState: (editorId: any) => any;
			isEditorFocused: () => boolean;
			setState: (
				editorId: any,
				newEditorState: any,
				record: any,
				newRecordBody: any
			) => void;
		};
		keyAccess: {
			enter: () => void;
			escape: () => void;
		};
		recordAccess: {
			create: (record: any) => void;
			del: (record: any) => void;
			update: (record: any) => void;
		};
		searchAccess?: any;
		selectionAccess?: any;
		slotFillAccess?: any;
	};
	children?: any;
}

export default GsContextProvidersProps;
