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

-   focus in/out of document editor
-   generate record name from body upon record update
-   clear editor when its document is deleted
-   super basic editor styling
-   accessibility considerations
-   prepare README
-   extract package
-   to the github

-   basic JSDoc for each component, make import style consistent
-   Typescript for controller & reducer
-   basic JSDoc for all functions
-   finish specification for user API shape, result list template, and editor template
-   consume passed-in data shape and templates
-   consume passed-in editor template
-   add tests for all components
-   Revise to make action verbs and terminology consistent in all state management
-   test reducers
-   test `useGodspeedContext`/`useGodspeed`
-   basic keyboard navigation improvements (TBD)
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
