enum LogLevel {
	log = "log",
	warn = "warn",
}

const log = (error: Error, level: LogLevel = LogLevel.log) => {
	if ("warn" === level) {
		console.warn(error);
	} else {
		console.log(error);
	}
};

export { log };
