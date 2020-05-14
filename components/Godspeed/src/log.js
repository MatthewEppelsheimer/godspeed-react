const log = (error, level) => {
	if ("warn" === level) {
		console.warn(error);
	} else {
		console.log(error);
	}
};

export { log };
