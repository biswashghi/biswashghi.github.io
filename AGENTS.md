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

## Resume data model

`src/data/resume/` (profile, summary, experience, education, certifications,
skills) plus `assembleResume()` in `src/data/resume/index.js` is the single
source of truth for both the `/resume` page (`ResumeSection.js`) and the
generated PDF. Resume inclusion for a project is **opt-in**: a project in
`src/data/projects.js` only appears on the resume if it carries a `resume`
field (`{ order, title, meta, bullets }`) — the resume is a curated subset,
not a mirror of `/projects`. Work experience lives only in
`src/data/resume/experience.js` and has no `/projects` presence at all.

### PDF generation (`scripts/generate-resume-pdf.cjs`)

Runs on `prestart`/`prebuild`, writes `public/resume.pdf` from
`assembleResume()`. A few non-obvious pitfalls hit while building this, worth
knowing before touching the script:

- **The data files use ESM `import`/`export`** but this package has no
  `"type": "module"`, so the script loads `@babel/register` (scoped to `src/`
  via `only`) before requiring `src/data/resume`.
- **Fonts are Lato + Raleway Bold** (matches the original hand-made resume,
  not the site's own IBM Plex Sans/Fraunces) via `@fontsource/lato` and
  `@fontsource/raleway`, which only ship `.woff2`. pdfkit/fontkit's WOFF2
  support renders as blank glyphs in some viewers even though `.text()`
  succeeds — decompress to raw TTF with `wawoff2` first and register the
  buffer, don't register the `.woff2` file directly. **`wawoff2.decompress()`
  is not safe to call concurrently** (shared WASM module) — a `Promise.all`
  over multiple fonts silently corrupts the output; decompress sequentially.
- **The two-column "table" layout** (label column + content column + full
  rule) is built by temporarily narrowing `doc.page.margins.left` for the
  content pass and restoring it after — see `renderTableRow` in the script.
  Two things broke this before it worked:
  - `itemHeader`'s title and meta write at the same captured `y` for
    side-by-side alignment; if the title write alone crosses a page break,
    that `y` is stale and the meta write can silently overflow onto a further
    page. Guard with `doc.page === startPage` before reusing it.
  - Closing a `continued: true` text chain with a dummy empty-string call
    doesn't reliably advance `doc.y` — the next line can render on top of it.
    Make the *real* last segment the one with `continued: false`.
  - Writing a page-number footer inside the bottom margin, or writing a row
    label at a `y` already near the bottom margin, both trip pdfkit's
    automatic page-break check and silently spawn a blank/orphan page. Zero
    out `margins.bottom` for footer writes, and proactively `addPage()`
    (`ensureRoom()`) before starting a row if little space remains.
- Verify output with `pdffonts` (embedded fonts) and the `Read` tool's PDF
  page rendering (needs `poppler`: `brew install poppler`) rather than
  trusting `pdftotext` alone — text can extract correctly while glyphs render
  blank, or while two lines silently overlap.

## Images

Originals live in `src/assets/originals/`; the served copies in
`src/assets/images/` and `src/assets/uploads/` are generated. Never hand-edit or
compress the originals.
