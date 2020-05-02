// return array of all index positions where a phrase is found in a string
const positions = (needle,haystack,foundSet = []) => {
    const found = haystack.indexOf(needle);
    
    if (-1 === found) {
        // we're done
        return foundSet;
    }

    foundSet.push(found);

    if (haystack.length > found) {
        // more to search
        // call recursively, adding to foundSet
        foundSet = positions(needle,haystack.substring(found + 1),foundSet)
    }

    return foundSet;
};

// positions() returns progressive offsets, each value building one before, but we need 0-relative offsets.
// @TODO the need for this is stupid; fix positions() to not need to do this.
const mapRelativeOffsetsToCumulative = (set) => {
    let x = 0;
    for (let i = 0; i < set.length; i++) {
        x += set[i] + 1;
        set[i] = x - 1;
    }

    return set;
};

export const buildHighlightString = (needle,haystack,highlightClass) => {
    const startPositionsProto = positions(needle,haystack);
    const startPositions = mapRelativeOffsetsToCumulative(startPositionsProto);

    let highlightRanges = [];
    let collapsedRanges = [];

    startPositions.forEach(element => {
        highlightRanges.push({
            start: element,
            end: element + needle.length
        });
    });

    let a_start, a_end, b_start, b_end = null;
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

        if (b_start < a_end + 1) {
            // ranges overlap, so let's collapse them and move on to the next range
            a_end = b_end;
        } else {
            // ranges do not overlap, so let's store A & move B into position A for next comparison
            collapsedRanges.push({
                start: a_start,
                end: a_end,
            });
            a_start = b_start;
            a_end = b_end;
        }

        if (!highlightRanges[i+1]) {
            // we are on the last item, so store our last range
            collapsedRanges.push({
                start: a_start,
                end: a_end,
            });
        }

    }

    let fragments = [];
    let cursor = 0;
    let highlight = true; // whether we're highlighting toggle; assume yes at beginning
    collapsedRanges.forEach(range => {
        if (0 === cursor && range.start > cursor) {
            highlight = false; // first fragment isn't highlighted
        }
        // pick up from cursor to start of current range
        if (cursor < range.start) {
            fragments.push(haystack.substring(cursor,range.start));
        }
        // pick up current range
        fragments.push(haystack.substring(range.start,range.end));
        cursor = range.end;
    });
    if (haystack.length > cursor) {
        // pick up after last range
        fragments.push(haystack.substring(cursor));
    }

    console.log(fragments);

    let construct = (
        <p>
            {fragments.map(fragment => {
                highlight = !highlight; // toggle first; use old value below
                return highlight ? fragment : (<span class={highlightClass}>{fragment}</span>);
            })}
        </p>
    );

    console.log(construct);
    return construct;
};
