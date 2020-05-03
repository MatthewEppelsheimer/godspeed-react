// add sequential indices to each member of array `data`
// used to dynamically index results after they change in response to new search phrase
const indexData = (data) => {
    for (let i = 0; i < data.length; i++) {
        data[i].index = i;
    }

    return data;
};

const search = (phrase,data) => {
    const newResults = data
        .filter(
            (item) => item.value.indexOf(phrase) > -1
        );

    // @TODO refactor indexData() to be chainable; add after .map() two lines above
    return indexData(newResults);
}

export {
    indexData,
    search
};
