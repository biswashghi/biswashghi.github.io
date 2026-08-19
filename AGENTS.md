# Agent Notes

Working notes for AI agents (and future me) on this repo.

## Project

React 19 + React Router 7 SPA, MDX blog, Webpack 5, deployed to GitHub Pages via
GitHub Actions. No backend — the `/admin` UI commits directly to this repo through
the GitHub Contents API using a session-scoped fine-grained PAT.

- `npm start` — dev server on :8080 (runs image optimization first)
- `npm run build` — production build to `dist/`
- `npm test` — Jest

## Layout Requirements

**No page may scroll horizontally.** Every route must satisfy
`document.documentElement.scrollWidth === clientWidth` at every viewport width.
Verify at 375px, 768px, and desktop before considering a layout change done.

To check in the browser console:

```js
const de = document.documentElement;
[...document.querySelectorAll('*')]
  .filter((el) => el.getBoundingClientRect().right > de.clientWidth + 1 && !el.closest('.nav'))
  .map((el) => el.className || el.tagName);
```

(The `.nav` exclusion is intentional — see below.)

### Reset `margin` on every `<figure>`

The browser UA stylesheet applies `figure { margin: 1em 40px }`. Combined with
`width: 100%` this pushes the element 40px past its container and creates
page-wide horizontal scroll. Every `<figure>` rule must set `margin` explicitly.
This has already caused one real bug (`.photo-month-card`).

Existing figure classes, all of which set margin: `.figure`, `.post__cover`,
`.photo`, `.art-piece`, `.photo-month-card`.

### Images

Always set `width`/`height` or `aspect-ratio` so lazy-loaded images don't shift
layout as they arrive. Overflow bugs often only appear once images have loaded —
force them before measuring:

```js
document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
```

### Mobile navigation

Below 1200px the primary nav is a single horizontally-scrolling row. This is the
one element allowed to scroll sideways, and it has its own scroll container, so
it never contributes to page-level overflow.

Its affordance is a **gradient fade only** on the right edge, applied via
`.nav--overflowing::after`. The `nav--overflowing` class is set from JS in
`src/App.js` by comparing `scrollWidth`/`clientWidth`/`scrollLeft`, so the fade
disappears once the user reaches the end.

Do not add a chevron, arrow, or any opaque badge over the row — it lands on top
of whichever nav item is at the boundary and reads as a rendering bug. This was
tried and reverted.

## Content

- Blog posts: `src/blog/posts/*.mdx`, YAML frontmatter, auto-discovered via
  `require.context`. Always fill in `excerpt` — the blog index renders a blank
  line without it.
- Never invent project metrics, install counts, or resume achievements. Pull them
  from the actual repo/store listing, or ask.

## Images

Originals live in `src/assets/originals/`; the served copies in
`src/assets/images/` and `src/assets/uploads/` are generated. Never hand-edit or
compress the originals.
