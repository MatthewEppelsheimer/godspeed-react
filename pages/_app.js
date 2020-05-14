import "../styles/global.css";
// @todo compartmentalize this with Draft.js components somehow
import "../styles/draft.css";

export default function App({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
