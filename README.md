<!-- @format -->

By Matthew Eppelsheimer.

Note this uses the `?.` [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), which is awesome but isn't yet compatible with all browsers. If you need to support all browsers, [@TODO]…

Note that actual search is severely limited at this point — only phrases that exactly match as typed will match. I'll prioritize making this far better after essential UI functionality is working.. Perhaps sooner than that I will introduce a way for you to override the search algorithm so you can replace it with your own search methods.

# Roadmap

-   add context usage guards
-   add component prop types
-   null coalescing operator
-   DEBUG system w/ console logs strategically throughout
-   basic JSDoc for each component and functions
-   add tests for reducer
-   add tests for useVelocityContext
-   Read a document in VelocityDocumentEditor, firing a callback (for e.g. logging views)
-   Update a document, firing callback
-   Consider file reorganization
-   helper UI in search field: "Press enter to create record `name of record`"
-   keyboard improvements in general
-   add accessibility considerations
-   store state history for undo
-   Optimistic UI w/ promises
-   Search improvements - case in-sensitive
