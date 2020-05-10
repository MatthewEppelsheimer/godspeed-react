<!-- @format -->

By Matthew Eppelsheimer.

Note this uses the `?.` [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), which is awesome but isn't yet compatible with all browsers. If you need to support all browsers, [@TODO]…

Note that actual search is severely limited at this point — only phrases that exactly match as typed will match. I'll prioritize making this far better after essential UI functionality is working.. Perhaps sooner than that I will introduce a way for you to override the search algorithm so you can replace it with your own search methods.

# Roadmap

## MVP

-   DEBUG system w/ console logs strategically throughout
-   basic JSDoc for each component and functions, make import style consistent
-   add tests for reducer
-   add tests for `useVelocityContext`
-   Update a document, firing callback
-   incorporate Draft.js
-   Rename `useVelocityContextState` and move it to `VelocityContextProvider`, don't export `VelocityContext` - This will encapsulate abstract all context management, so the library won't need to then export `VelocityContext`
-   Refactor `useVelocityContextState` signature with options object param
-   Review and resolve all todos
-   Consider file reorganization
-   Typescript
-   add accessibility considerations
-   basic keyboard navigation improvements (TBD)
-   code review entire library
-   Review/reconsider library API, consider whether to commit to a semver 1.0
-   rename… perhaps to "Godspeed" (?) - Velocity.js is already taken
-   Package into own library, incorporated into a proof of concept consumer of the dependency
-   publish

## Later

-   add tests for all components
-   backspace key deletes selected record, if record selected (would require blurring search input)
-   store state history for undo
-   Optimistic UI w/ promises
-   Search improvements - case in-sensitive
-   helper UI in search field: "Press enter to create record `name of record`"
