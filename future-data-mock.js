export default [
	// a typical record
	{
		key: 123, // unix creation timestamp
		state: {
			// current contents
			name: "", // duplicates first line of body, for search/ease of processing
			body: "", // rich text... how?
			date: 123, // unix timestamp
		},
		revisions: [
			// copies of old state objects
		],
	},
];
