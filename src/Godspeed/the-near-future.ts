/**
 * WIP exploration intended developer use of Godspeed with some external data source
 *
 * Demonstrates how to construct a custom record data structure, with templates
 * for CRUD operations, rendering a search result, and rendering a document.
 *
 * NOTE THIS IS A MESS. During 2023-02 TypeScript conversion, I mostly focused
 * on just getting this to compile. Needs lots of re-thinking/re-design. And becoming
 * async.
 */

import { GsRecord, GsRecordCreationData, GsRecordState } from "./interfaces";

type DataConnector<
	Record extends {},
	RecordState extends {},
	RecordCreationData extends {},
	Id = string
> = {
	// GS calls this to know which member of a record is its unique ID.
	// In this way, GS internals don't need to know the actual member's name.
	id: (record: Record) => string;

	// The default app doesn't use revisions but can implement for users
	// @TODO expand for more default functionality like mod date?
	revisions: (record: Record) => RecordState[];

	// Factory method GS calls internally to create a new record.
	create: (input: RecordCreationData) => GsRecord;

	// Method GS calls to get a record's data for display.
	// Returns an object formatted with data the also-provided templates need.
	// Not _actually_ called directly! Only used if one of the three variants
	// below uses it. Must be broad enough to cover all more specific versions.
	read: (recordId: Id) => Record;

	// More specific `read` for data needed to display the record in a list of
	// search results. Defining this in addition to the catch-all `read` is an
	// optimization to avoid preparing more data than this purpose requires. In
	// this default case, limit to the first 30 characters.
	// @TODO but is it an optimization though? It's more work... Research this a bit.
	readForResultList?: (record: Record) => { body: any };

	// More specific `read` for data needed to display the record in a read-only
	// document view. Defining this in addition to the catch-all `read` is an
	// optimization to avoid preparing more data than this purpose requires.
	// If not defined, this.read is used.
	// @TODO but is it an optimization though? It's more work... Research this a bit.
	readForDocumentDisplay?: (record: Record) => any;

	// More specific `read` for data needed to display the record in a document
	// editor view. Defining this in addition to the catch-all `read` is an
	// optimization to avoid preparing more data than this purpose requires.
	// If not defined, this.readForDocumentDisplay is used if defined, else this.read
	// @TODO but is it an optimization though? It's more work... Research this a bit.
	readForDocumentEdit?: (record: Record) => any;

	// Method to call when updating a record
	update: (record: Record, newState: any) => Promise<GsRecord>;

	// Method to call when deleting a record; return true when successful
	// @TODO Support also passing a function (record) => void,
	delete: (record: Record) => Promise<boolean>;

	// Search algorithm to use. User-overridable.
	// @TODO actually support this override, figure out function shape, etc.
	searchAlgorithm: () => any;

	// A test predicate passed to filter() when searching through records.
	// Records for whom the test returns false will be excluded from results.
	// The default is to include all results returned by the search algorithm.
	// Useful to e.g. not display results in memory but with `status: deleted`
	// or `status: private` or something.
	searchFilter: () => any;

	// Fields to search by; return an array of members of a passed-in record.
	// GS calls this to know which members of a record to search through.
	// In this way, GS internals don't need to know the actual members' names.
	// NOTE!!!!!! Support returning an array OR a single value.
	searchFields: (record: Record) => any;

	// Template for displaying a record in a list of search results
	// NOTE!!!! Function that takes `record` as an input. This allows
	// flexibility to have a different template depending on some aspect of the
	// record.
	templateResultList: (record: Record) => GsRecord[];

	// Template for displaying a record in a read-only document viewer.
	// NOTE!!!! Function that takes `record` as an input. This allows
	// flexibility to have a different template depending on some aspect of the
	// record.
	// @todo create a default component for this to export
	templateDocumentDisplay: (record: Record) => any;

	// Template for displaying a record in an editor
	// templateDocumentEdit: DocumentEditorTemplate,
};
