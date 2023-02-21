# Godspeed

_Search, create, and edit your documents like Aphrodite._

Godspeed is a [Notational Velocity](http://notational.net/)-inspired user interface library for [React.js](https://reactjs.org/) by [Matthew Eppelsheimer](http://mattheweppelsheimer.com).

**DO NOT USE IN PRODUCTION!** 

This is pre v0.1, not even fully usable yet and with many known issues. See the [Roadmap](#roadmap), below.

## 2023-02 Update

- WIP conversion to TypeScript, with Vite dev environment. Compiles and runs, with broken demo interactions.

# What?

[Notational Velocity](http://notational.net/) was a brilliant note taking app that attempted "to loosen the mental blockages to recording information" by unifying the interface for search and note creation into a single search field. Its UI featured:

-   Mouse-less, keyboard-focused interaction for speed
-   Search isn't a separate mode, but the primary interface
-   Search results updated instantly with each typed key
-   Typing "Enter" instantly creates a new record with your search terms as the first line
-   Modifications take effect immediately (there is no "saving")

I used its successor [nvAlt](https://brettterpstra.com/projects/nvalt/) for years, and in that time have fallen in love with its UI paradigm. But nvAlt has fallen into the Pit of Unmaintained Software in recent years. I've limped along for a while with [Simplenote](https://simplenote.com/), which mimics NV's UI — but only kind of, as its stripped-down philosophy makes it a weak imitation. NV is such a good paradigm that I not only want it back, but I want to use it in all kinds of new contexts beyond note taking.

For all these reasons, I'm building Godspeed as a worthy replacement.

The vision is to go even a bit further with features like:

-   history retention
-   Markdown support
-   multiple open documents
-   multiple active search views
-   a library for developers to implement custom document structures
-   impeccable developer documentation
-   Commitment to backwards compatibility and semantic versioning

I'm developing Godspeed from the ground up with all of this in mind, to make a bunch of my own ideas possible for various web, mobile, and desktop apps, and I hope also make it attractive to other developers.

# Self-Guided Tour of the Working Demo

**Try this out at [godspeedjs.now.sh](https://godspeedjs.now.sh/)!**

1. Type "pandas" into the search field, one letter at a time
2. Arrow down a few rows
3. Arrow up a few rows
4. Hit 'Escape'. Note your selected row has cleared
5. Hit 'Escape' again. Note your search phrase is cleared, and results are updated to "all" records
6. Hit 'Escape' yet a third time. Note the search field has lost focus.
    - **BROKEN!** Please reload the browser window to re-focus search. 🤦🏻‍♂️
7. Click the search field with the mouse to focus it again
8. Type "monkey", and arrow down once or twice to select one of the results.
9. Type 'Enter'. Note how the selected document is opened below the search results, and the document has focus
10. Go ahead and make some edits.
    - If it weren't for the issue in #6 above, you could then: _Then click the search field again (see caveat in #7 again) so you can select a different document, then click search field again and select the document you edited before — and note that your changes have persisted._ But alas.
11. With the search field focused and cleared, type "Catherine"
12. Hit "Enter". Note how you've just created and are now editing a new document.

# (Developer) User Docs

_For-real-actually helpful user docs are a Todo._

That said, see the `components/Godspeed.js` to see to compose your own Godspeed interface using:

-   the core `<Godspeed>` component, with a nested `<GodspeedContextProviders>` component to make data available to child components
-   `<SearchField>`, `<ResultList>`, and `<DocumentEditor>` children of `<Godspeed>` together compose the core of the system.
-   Everything you need to compose your own overrides are exported from the library.

# Notes for Reviewers, as of 2020-05-13

**Early reviewers, this is for you!**

_Wherein I apologize for all the construction dust._

-   This is currently packaged inside of a Next.js website for ease of demoing and development. Godspeed itself lives in [`<repository-root>/components/Godspeed`](https://github.com/MatthewEppelsheimer/godspeedjs.org/blob/master/components/Godspeed) (for code review only; isn't currently intended for Nextjs rendering.)
    ). You can demo it at []().

This is super WIP. I'm prioritizing development in this order:

1. Robust action-reducer control mechanism
    - Pleased to say this is working, and even on its way to being decently well documented. See:
    - `components/Godspeed.js`
    - `src/controller.js`
    - `src/reducers.js`
2. Core UI functionality (so search itself will absolutely _suck_ for a while)
    - Still very much a WIP, so even the UI is still quite broken in places
3. Re-usability and flexibility for multiple context

    - If it seems a little over-engineered, get off my lawn 😄
    - [The Near Future page](https://github.com/MatthewEppelsheimer/godspeedjs.org/blob/master/pages/the-near-future.js) shows the near future of the implementing developer's interface.
        - (That links to Github for code review; it isn't currently intended to work on the demo site.)

4. Tests
    - I've been waiting for each of the above to be in a good place before starting with tests, out of concern I'd end up having to rewrite a lot of tests after early rewrites.
    - I was hoping to get here by now, but this is still a few weeks away due to other life priorities
5. Code beauty >>> in-browser rendered beauty
    - This baby works (sort of) in the browser, but is suuuper ugly. The code/functionality is the most valuable part of Godspeed, so it's getting the priority. And, its code aesthetics ain't bad at all (_and_ demonstrate my abilities better).

Using libraries:

-   [Prettier.js](https://prettier.io/)
-   [Draft.js](https://draftjs.org/)
-   `lodash` used sparingly, because `[1,2] === [1,2]` is `false` and why reinvent `_isEqual()`?

# Notes for Implementors

## Rich text editing with Draft.js

This uses [Draft.js](https://draftjs.org/), a pretty slick React-based rich text editor.

-   Because Draft.js supports unicode, you must have the following meta tag in the <head></head> block of your HTML file:

```html
<meta charset="utf-8" />
```

-   You'll also need to include `Draft.css`, which you can import from `'draft-js/dist/Draft.css'`. (In a Nextjs app, add `import "draft-js/dist/draft.css"` to `pages/_app.js`.)

## Bleeding edge JavaScript

-   Note this uses the `?.` [optional chaining operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining), which is awesome but isn't yet compatible with all browsers. If you need to support all browsers, [instructions for babel transpilation here]

## Limitations

-   I consider everything in the [Roadmap](#roadmap) prior to version 1.1 a limitation
-   Note that actual search is severely limited at this point — only phrases that exactly match as typed will match. I'll prioritize making this far better after essential UI functionality is working
    -   ...perhaps sooner than that I will introduce a way for you to override the search algorithm so you can replace it with your own search methods.

# Roadmap

This is a labor of passion. I'm committed to building this through at least 1.6 as specified below.

**Feature order and release version subject to change, natch.**

## Currently in progress

-   JSDoc for reducers.js
-   JSDoc for controller.js
-   focus in/out of document editor
-   specification of user API shape, result list template, and editor template
-   generate record name from body upon record update

## 0.1 MVP

-   clear editor when its document is deleted
-   super basic editor styling
-   accessibile markup
-   various sundry MVP-ish keyboard interaction improvements
-   JSDoc for each component
-   JSDoc for GodspeedContextProviders
-   JSDoc for all functions
-   style consistencies in all files, e.g. alpha-sort imports, exports, functions, etc.
-   automated integration tests (Jest + React Test Library) for `useGodspeedContext`/`useGodspeed`/`dataReducer`
-   convert controller & reducer to TypeScript, for those juicy strictly typed goodness and those hot interfaces
-   revise to make action verbs and terminology consistent in all state management
-   basic keyboard navigation improvements (TBD)
-   review and resolve all MVP todos
-   move non-MVP todos out of code into this here Roadmap
-   extract `godspeed-react` package out of `godspeedjs.org`

## 1.0

-   documentation!
-   complete component test coverage
-   consider file reorganization
-   code review entire library
-   documentation!
-   webpack-ified build scripts
-   review/reconsider library API, consider whether to commit to a semver 1.0
-   package into own library, incorporated into a proof of concept consumer of the dependency
-   publish 1.0
-   documentation!

## 1.1

-   TBD external dataStore interaction improvements... promises, likely

## 1.2

-   store state history for undo

## 1.3 — Arguably ready for prime time as of this release

-   TBD adjustments to ease implementation in Electron.js
-   **search improvements galore!**
    -   Prior to this, search only matches exact typed string

## 1.4

-   support multiple editors

## 1.5

-   utilize the full power of Draft.js

## 1.6

-   extract everything independent of the DOM into `godspeed-core`, for reuse in React Native

## Later...

-   improve slotFills pattern and add more of them... Unless I don't come up with something better.
-   UI polish
    -   e.g. key to delete selected record, if record selected
    -   e.g. "Press enter to create record `name of record`" in search field:
-   Support "Optimistic UI" style for dataStore sync
