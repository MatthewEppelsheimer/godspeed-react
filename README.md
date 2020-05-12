By Matthew Eppelsheimer.

Because Draft.js supports unicode, you must have the following meta tag in the <head></head> block of your HTML file:

```html
<meta charset="utf-8" />
```

You'll also need to include `Draft.css`, which you can import from `'draft-js/dist/Draft.css'`. (In a Nextjs app, add `import "draft-js/dist/draft.css"` to `pages/_app.js`.)

Note this uses the `?.` [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), which is awesome but isn't yet compatible with all browsers. If you need to support all browsers, [@TODO]…

Note that actual search is severely limited at this point — only phrases that exactly match as typed will match. I'll prioritize making this far better after essential UI functionality is working.. Perhaps sooner than that I will introduce a way for you to override the search algorithm so you can replace it with your own search methods.

# Roadmap

## MVP

-   Refactor `useGodspeedContextState` signature to use options object param and name it `useGodspeed`
-   Split context into multiple contexts to improve performance of consumers
    -   (currently each completely re-renders whenever any state changes, which is every keystroke)
-   create user API for specifying data shape, result list template, and editor template
-   consume passed-in data shape
-   consume passed-in editor template
-   basic JSDoc for each component and functions, make import style consistent
-   add tests for all components
-   Revise to make action verbs and terminology consistent in all state management
-   test reducers
-   test `useGodspeedContext`/`useGodspeed`
-   basic keyboard navigation improvements (TBD)
-   clear editor when its document is deleted
-   accessibility considerations
-   Typescript
-   Review and resolve all pre-MVP todos
-   Consider file reorganization
-   code review entire library
-   Review/reconsider library API, consider whether to commit to a semver 1.0
-   Package into own library, incorporated into a proof of concept consumer of the dependency
-   publish

## Later

-   add tests for all components
-   backspace key deletes selected record, if record selected (would require blurring search input)
-   store state history for undo
-   Optimistic UI w/ promises
-   Search improvements - case in-sensitive
-   helper UI in search field: "Press enter to create record `name of record`"
