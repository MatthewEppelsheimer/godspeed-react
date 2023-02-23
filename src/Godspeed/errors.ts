class GsError extends Error {
	/**
	 * Godspeed base error class
	 *
	 * Currently no frills, but all custom Godspeed errors should extend from this to ease adding standard base error logic later.
	 */
	constructor(message: string, options: Parameters<ErrorConstructor>[1]) {
		super(message, options);
		this.name = "GodspeedError";
	}
}

export { GsError };
