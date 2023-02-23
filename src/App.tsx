import React from "react";
import "./App.css";
import DATA from "./data-mock";
import Godspeed from "./Godspeed/components/GodSpeed";
import { GsRecordDataOps } from "./Godspeed/interfaces";

// Mock interactions w/ external data store
const dataStoreCrudCallbacks: GsRecordDataOps = {
	create: () => {
		// console.log('dataStore told to create record');
		// @TODO return a promise to update optimistic UI after completion
	},
	update: () => {
		// console.log('dataStore told to update record')
	},
	del: () => {
		// console.log('dataStore told to delete record:', document);
		// @TODO return a promise to update optimistic UI after completion
	},
};

// Mock creating a slotfill
// Essentially React's Portals pattern but without reliance on ReactDOM
// Steals terminology from WordPress
// const resultListItemSlot = (result, ops) => {
//   return (
//     <button className="delete_button" onClick={() => ops.delete(result)}>delete</button>
//   )
// };
// const slotfills = {
// 	// resultListItemSlot,
// };

function App() {
	return (
		<React.Fragment>
			<div>
				<h1>What&apos;s this?</h1>
				<p>
					👉🏻{" "}
					<a
						href="https://github.com/MatthewEppelsheimer/godspeedjs.org#user-content-godspeed"
						target="_blank"
						rel="noreferrer"
					>
						github.com/MatthewEppelsheimer/godspeedjs.org
					</a>{" "}
					👈🏻 should answer some questions.
				</p>
				<p>
					<strong>
						Be sure and see the &ldquo;Development Notes as of
						2020-05-13&rdquo; section of that README.
					</strong>{" "}
					😄
				</p>
			</div>
			<h1>👇🏻Godspeed pre-v0.1 Demo 👇🏻</h1>
			<p>
				Take the{" "}
				<a
					href="https://github.com/MatthewEppelsheimer/godspeedjs.org#user-content-self-guided-tour-of-the-working-demo"
					target="_blank"
					rel="noreferrer"
				>
					Self-guided Demo
				</a>
			</p>
			<p>
				Navigation between elements is still a Work in Progress, but you
				can:
			</p>
			<ul>
				<li>Type to search.</li>
				<li>
					&lsquo;Escape&rsquo; to clear selection, then clear search.
				</li>
				<li>Arrow up/down to select.</li>
				<li>&lsquo;Enter&rsquo; to open document selected document.</li>
				<li>
					Or, &lsquo;Enter&rsquo; to create a new document from your
					search phrase.
				</li>
			</ul>
			<Godspeed
				records={DATA}
				dataStore={dataStoreCrudCallbacks}
				// slotFills={slotfills}
			/>
		</React.Fragment>
	);
}

export default App;
