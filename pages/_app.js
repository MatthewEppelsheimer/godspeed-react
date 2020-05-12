import "../styles/global.css";
// @todo compartmentalize this with Draft.js components somehow
import "draft-js/dist/draft.css";

export default function App({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
