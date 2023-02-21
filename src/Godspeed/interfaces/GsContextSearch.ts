import GsRecord from "./GsRecord";

interface GsContextSearch {
	focused: boolean;
	phrase: string;
	results: GsRecord[];
}

export default GsContextSearch;
