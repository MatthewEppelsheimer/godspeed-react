import { GsRecord, Indexable, WithIndex } from "./interfaces";

// add sequential indices to each member of array `data`
// used to dynamically index results after they change in response to new search phrase
function indexData<T extends object>(data: Indexable<T>[]): WithIndex<T>[] {
	for (let i = 0; i < data.length; i++) {
		data[i].index = i;
	}

	return data.map((d, i) => {
		const indexed = { ...d, index: i };
		return indexed;
	});
}

const search = (phrase: string, data: GsRecord[]): GsRecord[] => {
	// @TODO include all record content in search scope with item.state.body instead
	const newResults = data.filter((item) => item.state.name.includes(phrase));

	// @TODO refactor indexData() to be chainable; add after .filter()
	return indexData(newResults);
};

export { indexData, search };
