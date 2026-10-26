# Lauren Leven — design portfolio

A lightweight portfolio of product UX, visual design, and illustration. The production-facing static site is in **`public/`** and is configured as a Cloudflare Worker with static assets. The root-level `index.html`, `script.js`, `content.js`, and `styles.css` are older files; **do not edit those to change the live portfolio**.

## Project map

- `public/index.html` — page structure, header, hero, contact and theme toggle.
- `public/content.js` — company/project data, UX case-study writing, image briefs and galleries.
- `public/script.js` — project index, case-study rendering, hash routing, active navigation and interactions.
- `public/styles.css` — responsive styling, themes, layout and motion.
- `public/LL logo.svg` and `public/laurenlevenportfolioheroportrait.png` — current brand and portrait assets.
- `wrangler.jsonc` — Worker configuration; `assets.directory` points to `./public`.
- `scripts/check-content.mjs` — dependency-free content and JavaScript smoke checks.

## UX case-study editing guide

Each project in `window.PORTFOLIO` should make the designer's **reasoning** as clear as the final visual work:

1. `summary` — the hook, written for someone scanning the portfolio.
2. `details` — audience, problem, constraints and the user's actual role.
3. `process` — evidence or feedback **only when documented**, plus explorations, decisions, tradeoffs and iterations that can be substantiated.
4. `outcome` — what was delivered or shipped and what was learned. Use measurable impact only when verified.
5. `image` / `gallery` — approved project visuals. Empty image fields intentionally render descriptive `imageBrief` / `galleryBriefs` placeholders; those briefs are **not evidence of completed artifacts**.

The case-study view presents these as **Challenge & role → Process & design decisions → Deliverables & learning**. Preserve that sequence when adding projects. Keep `projectEvidence` and `caseHighlights` in `public/script.js` aligned with any verified status or scope changes in `public/content.js`.

**Evidence guardrails:** Never invent user interviews, usability tests, adoption numbers, conversion lifts, shipped features, or collaborators. Clearly distinguish concept/prototype work from shipped contributions. The user has confirmed **Hoylu Mobile Insights shipped**; do not describe its delivery as concept-only. The Holland America Line Navigator and stateroom TV contributions are also described as shipped. If the delivery status or outcome is unknown, say so rather than implying success.

## Evidence and decision notes (October 2026)

The professional project index uses each project's `summary` for the problem and
the first sentence of `process` for a short **Design thinking** preview. The
`processTeaser` helper reuses the existing copy instead of inventing research or
outcomes. Each card has **one** case-study link, avoiding duplicate tab stops.

Case studies may include two optional, plain-text fields in `public/content.js`:
`evidence` (what is confirmed and what supporting research/metrics are absent)
and `tradeoffs` (design tensions and rationale, without implying unverified tests
or decisions). `processNotesMarkup` renders these in labeled callouts. Currently
Hoylu **Mobile Insights** uses both, and its delivery remains explicitly **shipped**.

Do not treat descriptive image briefs as completed wireframes, test artifacts, or
verified outcomes. Add actual discovery, iterations, collaboration details, and
results only when supported by owner-approved materials. Update
`scripts/check-content.mjs` whenever new structured case-study fields are added.

## Local preview and checks

From the repository root:

```sh
python3 -m http.server 8000 --directory public
# In another terminal:
node scripts/check-content.mjs
node --check public/script.js
```

Open the local server in a browser. The content smoke check validates data shape, required process fields, unique project names, navigation targets, script syntax, and the known Mobile Insights delivery-status consistency. It is **not** a browser accessibility or visual regression test.

## Deployment

`wrangler.jsonc` configures a Worker named `portfolio` with static assets served from `./public`. Deployment depends on the owner's Cloudflare setup; changes committed to GitHub are **not proof of deployment**. Check the Cloudflare deployment status and the live site after publishing.

## Manual QA before publishing

Review at narrow and wide mobile widths and desktop; check light/dark contrast, keyboard focus order, skip link, work → project → back navigation, reduced-motion behavior, image alt text, and the Contact underline near the bottom of the page. Verify all copy and imagery with the portfolio owner. Run Lighthouse or axe in a browser before calling an accessibility pass complete.


## Project-first homepage navigation

The Work section renders **every professional project once** using the canonical company/project data in `public/content.js`. `professionalProjects` in `public/script.js` preserves each project's original company ID and index for stable case-study links. The old company tile layer and collection markup have been removed. Historical `#company/...` URLs redirect to `#work` for existing bookmarks. Do not reintroduce a second company gallery or a second set of featured project cards.

Project previews use existing summaries and intentionally labeled image placeholders. Avoid invented research, outcomes, or metrics. Test every project link, the return-to-work route, and browser back navigation on mobile before release.

## Notebook redesign — incremental implementation

The visual direction is a college-ruled creative notebook: warm paper, subtle blue rules, a pink margin, and replaceable illustrated stickers. The notebook tokens and light-mode backgrounds live under **NOTEBOOK VISUAL SYSTEM** in `public/styles.css`. The star sticker is a temporary accessible button in `public/index.html`, with its repeatable animation initialized near the end of `public/script.js`. Replace the glyph with approved owner-drawn artwork later; preserve the button label, hit area, keyboard support, and reduced-motion behavior.

The URL hash is the application's router. **Never use `href="#case-..."` for in-page chapter jumps inside a case study.** Chapter controls use `data-case-jump` buttons, `scrollIntoView`, and heading focus without changing the hash. Case-study back navigation returns to `#work`; historical `#company/...` links redirect to `#work`.

This redesign is in progress. Before calling it finished, verify at mobile widths (including 320px), test all project routes and chapter jumps in a real browser, check dark mode and reduced-motion behavior, inspect contrast and keyboard focus, and confirm the actual deployment separately from GitHub commits.


### Hero and project index cleanup (pass 4)
The hero heading uses CSS tokens rather than inline color declarations. The `.notebook-hero-note` annotation is text-only and can later be accompanied by owner-drawn sticker assets. Preserve the original portrait asset. The professional gallery is data-driven; avoid duplicating `companyGrid` declarations or maintaining a separate featured list. Keep cache-busting stylesheet and script URLs in `public/index.html` synchronized with changes.

**Pending verification:** JavaScript syntax check, narrow-mobile layout, real-browser chapter navigation, keyboard access, dark-mode contrast, and deployed Cloudflare version. No claim of a passing test without executing it.


### Pass 5–6 — navigation cleanup and release checks
The obsolete company expansion renderer has been retired. Work is a single data-driven gallery; legacy company hashes redirect to `#work`. Case-study text has notebook-paper treatment but images remain on solid surfaces. Project previews omit missing process copy rather than showing empty headings.

**Required before release:** run a JavaScript syntax check, verify project and chapter navigation in a browser, inspect 320px mobile and desktop layouts, keyboard/focus behavior, reduced motion, and dark-mode contrast. GitHub commits do not establish deployment.


### Pass 7 — Work gallery DOM simplification
The Work gallery now mounts directly inside `#work`; the retired `#company-grid` and `#collection` elements and their script references have been removed. The `#company/...` hash still redirects to `#work` for existing links. Do not reintroduce empty company navigation containers.

A JavaScript parse check was performed on the updated `public/script.js` source. Browser rendering, interaction testing, and deployment status remain unverified.


### Pass 8 — scan-first project cards
Project cards show the project identity, preview, and short summary. The longer design-process explanation belongs in the case study, not repeated in the index. The obsolete `.featured-project-context` styles and related selector rules were removed from `public/styles.css`. Keep this division of content when adding new projects.


### Pass 9 — mobile interaction and landmarks
The dynamic case-study container is a named region rather than a second `main` landmark. Mobile project navigation, case-study chapter buttons, back/next links, and header controls have explicit minimum touch target heights and focus-visible outlines. Verify actual 320px wrapping and tab order in a browser before release.


### Pass 10 — narrow-screen navigation
At widths up to 420px the header uses a two-row CSS grid: logo, Contact, and theme toggle on top; Work, Playground, and About underneath. The hero headline, decorative star, and project cards also have narrow-width safeguards. The earlier mobile header overrides remain candidates for consolidation after real-browser visual QA. Verify 320px, 375px, 390px, and 420px, including zoomed text, before considering this complete.
