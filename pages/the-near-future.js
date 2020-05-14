/**
 * A page to mock intended developer use of Godspeed.
 * 
 * Demonstrates how to construct a custom record data structure, with templates
 * for CRUD operations, rendering a search result, and rendering a document.
 */
import DATA from "../future-data-mock";
import Godspeed from "../components/Godspeed/components/Godspeed";
import Result from "../components/Godspeed/components/Result";
import DocumentEditorTemplate from "../components/Godspeed/components/DocumentEditorTemplate";
import { search } from "../components//src/search";
import { GodspeedContextProviders } from "../components/Godspeed";

/**
 * The default "dataConnector". WIP!
 * 
 * Implements a simple core experience out of the box. Users can override as
 * many or few functions as needed to tailor their experience. This won't
 * appear outside of Godspeed internal files, except in documentation.
 */
const dataConnectorDefault = {
	// GS calls this to know which member of a record is its unique ID.
	// In this way, GS internals don't need to know the actual member's name.
	id: (record) => record.id,

	// The default app doesn't use revisions but can implement for users
	revisions: (record) => null,

	// @todo expand on above for more default functionality like mod date

	// Factory method GS calls internally to create a new record.
	// `input` is the text in the search field
	create: (input) => {
		const id = new Date().getTime();
		const body = input,

		return { id, body };
	},

	// Method GS calls to get a record's data for display. 
	// Returns an object formatted with data the also-provided templates need.
	// Not _actually_ called directly! Only used if one of the three variants
	// below uses it. Must be broad enough to cover all more specific versions.
	read: (record) => {{ body: record.body }},

	// More specific `read` for data needed to display the record in a list of
	// search results. Defining this in addition to the catch-all `read` is an
	// optimization to avoid preparing more data than this purpose requires. In
	// this default case, limit to the first 30 characters.
	// @TODO but is it an optimization though? It's more work... Research this a bit.
	readForResultList: (record) => {{ body: record.body.substring(0,30) }},

	// More specific `read` for data needed to display the record in a read-only
	// document view. Defining this in addition to the catch-all `read` is an
	// optimization to avoid preparing more data than this purpose requires.
	readForDocumentDisplay: this.read,

	// More specific `read` for data needed to display the record in a document
	// editor view. Defining this in addition to the catch-all `read` is an
	// optimization to avoid preparing more data than this purpose requires.
	readForDocumentEdit: this.readForDocumentDisplay,

	// @WIP-POINT
	// @todo
	update: (record, newState) => {
		const newRecord 
		return {
			id: record.id,
			body: newState.body,
		};
	},

	// Method to call when deleting a record
	// @WIP-POINT
	// @TODO Support also passing a function (record) => null,
	delete: undefined,

	// Search algorithm to use. User-overridable.
	// @TODO actually support this override, figure out function shape, etc.
	searchAlgorithm: search,

	// A test predicate passed to filter() when searching through records.
	// Records for whom the test returns false will be excluded from results.
	// The default is to include all results returned by the search algorithm.
	// Useful to e.g. not display results in memory but with `status: deleted`
	// or `status: private` or something.
	// @todo
	searchFilter: true,

	// Fields to search by; return an array of members of a passed-in record.
	// GS calls this to know which members of a record to search through.
	// In this way, GS internals don't need to know the actual members' names.
	// NOTE!!!!!! Support returning an array OR a single value.
	searchFields: (record) => record.body,

	// Template for displaying a record in a list of search results
	// NOTE!!!! Function that takes `record` as an input. This allows
	// flexibility to have a different template depending on some aspect of the
	// record.
	templateResultList: (record) => Result,

	// Template for displaying a record in a read-only document viewer.
	// NOTE!!!! Function that takes `record` as an input. This allows
	// flexibility to have a different template depending on some aspect of the
	// record.
	// @todo create a default component for thi to export
	templateDocumentDisplay: (record) => null,

	// Template for displaying a record in an editor
	templateDocumentEdit: DocumentEditorTemplate,
};

/**
 * dataConnector override. WIP!
 * 
 * A WIP exploration of what implementing a custom "dataConnector" will be like
 * to implement an actual nvAlt clone.
 */
const dataConnector = {
	// Deviating from default only to test this out
	id: (record) => record.key,

	revisions: (record) => record.revisions,

	// create a blank new record
	create: (input = null) => {
		const key = new Date().getTime();
		return {
			key: key,
			state: {
				name: null,
				body: input,
				date: key,
			},
			revisions: [],
		};
	},

	read: (record) => {
		return {
			key: record.key,
			body: record.state.body,
			name: record.state.name,
		}
	},

	readForResultList: (record) => {
		return {
			key: record.key,
			name: record.state.name,
		};
	},

	readForDocumentDisplay: (record) => {
		return {
			key: record.key,
			body: record.state.body,
		};
	},

	// @WIPPOINT...
};

const idToSearch = 123 // ID of the record we're updating
const records = [] // our records
dataShape.update();

export default function NotationalGS() {
	return (
		<Layout home>
			<Head>
				<title>NotationalGS</title>
				{/* Draft.js requires this */}
				<meta charset="utf-8" />
			</Head>
			<Godspeed
				records={DATA}
				// HERE IT IS! EASY-PEASY.
				dataStore={dataStoreCrudCallbacks}
			>
				<GodspeedContextProviders>
					{
						/**
						 * Mix of core and custom interface components go here,
						 * similar to in <Godspeed>.
						*/
					}
				</GodspeedContextProviders>
			</Godspeed>
		</Layout>
	);
}
