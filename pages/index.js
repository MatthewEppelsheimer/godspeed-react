import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout";
import Godspeed from "../components/Godspeed";
import DATA from "../data-mock";
import utilStyles from "../styles/utils.module.css";

// Mock interactions w/ external data store
const createCallback = (document) => {
	// console.log('dataStore told to create record:',document);
	// @TODO return a promise to update optimistic UI after completion
};

const deleteCallback = (document) => {
	// console.log('dataStore told to delete record:', document);
	// @TODO return a promise to update optimistic UI after completion
};
const dataStoreCrudCallbacks = {
	create: createCallback,
	read: null,
	update: null,
	delete: deleteCallback,
};

// Mock creating a slotfill
// Essentially React's Portals pattern but without reliance on ReactDOM
// Steals terminology from WordPress
// const resultListItemSlot = (result, ops) => {
//   return (
//     <button className="delete_button" onClick={() => ops.delete(result)}>delete</button>
//   )
// };

const slotfills = {
	// resultListItemSlot,
};

export default function Home() {
	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<Godspeed
				data={DATA}
				dataStore={dataStoreCrudCallbacks}
				slotFills={slotfills}
			/>
		</Layout>
	);
}
