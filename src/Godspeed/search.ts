import { GsRecord, GsRecordIndexed } from "./interfaces";

// add sequential indices to each member of array `data`
// used to dynamically index results after they change in response to new search phrase
const indexData = (data: GsRecord[]): GsRecordIndexed[] => {
	for (let i = 0; i < data.length; i++) {
		data[i].index = i;
	}

	return data.map((d, i) => {
		d.index = i;
		return d as GsRecordIndexed;
	});
};

const search = (phrase: string, data: GsRecord[]): GsRecord[] => {
	// @TODO include all record content in search scope with item.state.body instead
	const newResults = data.filter(
		(item) => item.state.name.indexOf(phrase) > -1
	);

	// @TODO refactor indexData() to be chainable; add after .filter()
	return indexData(newResults);
};

export { indexData, search };
