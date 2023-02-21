// return array of all index positions where a phrase is found in a string
function positions(
	needle: string,
	haystack: string,
	foundSet: number[] = []
): number[] {
	const found = haystack.indexOf(needle);

	if (-1 === found) {
		// we're done
		return foundSet;
	}

	foundSet.push(found);

	if (haystack.length > found) {
		// more to search
		// call recursively, adding to foundSet
		foundSet = positions(needle, haystack.substring(found + 1), foundSet);
	}

	return foundSet;
}

// positions() returns progressive offsets, each value building one before, but we need 0-relative offsets.
// @TODO the need for this is stupid; fix positions() to not need to do this.
function mapRelativeOffsetsToCumulative(set: number[]): number[] {
	let x = 0;
	for (let i = 0; i < set.length; i++) {
		x += set[i] + 1;
		set[i] = x - 1;
	}

	return set;
}

type HighlightRange = { start: number; end: number };

function buildHighlightString(
	needle: string,
	haystack: string,
	highlightClass: string
): JSX.Element {
	const startPositionsProto = positions(needle, haystack);
	const startPositions = mapRelativeOffsetsToCumulative(startPositionsProto);

	let highlightRanges: HighlightRange[] = [];
	let collapsedRanges: HighlightRange[] = [];

	startPositions.forEach((element) => {
		highlightRanges.push({
			start: element,
			end: element + needle.length,
		});
	});

	let a_start: number, a_end: number, b_start: number, b_end: number;

	for (let i = 0; highlightRanges.length > i; i++) {
		if (1 === highlightRanges.length) {
			// there's only one range; just use it and we're done
			collapsedRanges = highlightRanges;
			break;
		}

		if (0 === i) {
			// we've just started; load new range into A position, then move on to the next
			a_start = highlightRanges[i].start;
			a_end = highlightRanges[i].end;
			continue;
		}

		// load new range into B position for comparison
		b_start = highlightRanges[i].start;
		b_end = highlightRanges[i].end;

		if (b_start < a_end! + 1) {
			// ranges overlap, so let's collapse them and move on to the next range
			a_end = b_end;
		} else {
			// ranges do not overlap, so let's store A & move B into position A for next comparison
			collapsedRanges.push({
				start: a_start!,
				end: a_end!,
			});
			a_start = b_start;
			a_end = b_end;
		}

		if (!highlightRanges[i + 1]) {
			// we are on the last item, so store our last range
			collapsedRanges.push({
				start: a_start!,
				end: a_end,
			});
		}
	}

	let fragments = [];
	let cursor = 0;
	// whether we're highlighting toggle, accounting for no range
	let highlight = collapsedRanges.length ? true : false;
	collapsedRanges.forEach((range) => {
		if (0 === cursor && range.start > cursor) {
			highlight = false; // first fragment isn't highlighted
		}
		// pick up from cursor to start of current range
		if (cursor < range.start) {
			fragments.push(haystack.substring(cursor, range.start));
		}
		// pick up current range
		fragments.push(haystack.substring(range.start, range.end));
		cursor = range.end;
	});
	if (haystack.length > cursor) {
		// pick up after last range
		fragments.push(haystack.substring(cursor));
	}

	// because React needs unique keys for each element procedurally generated from a list
	let time = new Date().getTime();
	let spans = [];
	for (let i = 0; i < fragments.length; i++) {
		spans.push({ text: fragments[i], key: time++ });
	}

	let construct: JSX.Element = (
		<>
			{spans.map((span) => {
				highlight = !highlight; // toggle first; use old value below
				return highlight ? (
					<span key={span.key}>{span.text}</span>
				) : (
					<span className={highlightClass} key={span.key}>
						{span.text}
					</span>
				);
			})}
		</>
	);

	return construct;
}

export { buildHighlightString };
