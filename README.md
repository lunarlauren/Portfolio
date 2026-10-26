# Lauren Leven — design portfolio

A lightweight portfolio of product UX, visual design, and illustration. The production-facing static site is in **`public/`** and is configured as a Cloudflare Worker with static assets. The root-level `index.html`, `script.js`, `content.js`, and `styles.css` are older files; **do not edit those to change the live portfolio**.

## Project map

- `public/index.html` — page structure, header, hero, contact and theme toggle.
- `public/content.js` — company/project data, UX case-study writing, image briefs and galleries.
- `public/script.js` — project cards, company collections, case-study rendering, hash routing, active navigation and interactions.
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

Review at narrow and wide mobile widths and desktop; check light/dark contrast, keyboard focus order, skip link, company → project → back navigation, reduced-motion behavior, image alt text, and the Contact underline near the bottom of the page. Verify all copy and imagery with the portfolio owner. Run Lighthouse or axe in a browser before calling an accessibility pass complete.


## Project-first homepage navigation

The Work section renders **every professional project once** using the canonical company/project data in `public/content.js`. `professionalProjects` in `public/script.js` preserves each project's original company ID and index for stable case-study links. The old company tile layer is hidden on the homepage, while historical `#company/...` URLs remain supported for existing bookmarks. Do not reintroduce a second company gallery or a second set of featured project cards.

Project previews use existing summaries and intentionally labeled image placeholders. Avoid invented research, outcomes, or metrics. Test every project link, the return-to-work route, and browser back navigation on mobile before release.

## Notebook redesign — incremental implementation

The visual direction is a college-ruled creative notebook: warm paper, subtle blue rules, a pink margin, and replaceable illustrated stickers. The notebook tokens and light-mode backgrounds live under **NOTEBOOK VISUAL SYSTEM** in `public/styles.css`. The star sticker is a temporary accessible button in `public/index.html`, with its repeatable animation initialized near the end of `public/script.js`. Replace the glyph with approved owner-drawn artwork later; preserve the button label, hit area, keyboard support, and reduced-motion behavior.

The URL hash is the application's router. **Never use `href="#case-..."` for in-page chapter jumps inside a case study.** Chapter controls use `data-case-jump` buttons, `scrollIntoView`, and heading focus without changing the hash. Case-study back navigation returns to `#work`; the old `#company/...` route remains for existing deep links.

This redesign is in progress. Before calling it finished, verify at mobile widths (including 320px), test all project routes and chapter jumps in a real browser, check dark mode and reduced-motion behavior, inspect contrast and keyboard focus, and confirm the actual deployment separately from GitHub commits.


### Hero and project index cleanup (pass 4)
The hero heading uses CSS tokens rather than inline color declarations. The `.notebook-hero-note` annotation is text-only and can later be accompanied by owner-drawn sticker assets. Preserve the original portrait asset. The professional gallery is data-driven; avoid duplicating `companyGrid` declarations or maintaining a separate featured list. Keep cache-busting stylesheet and script URLs in `public/index.html` synchronized with changes.

**Pending verification:** JavaScript syntax check, narrow-mobile layout, real-browser chapter navigation, keyboard access, dark-mode contrast, and deployed Cloudflare version. No claim of a passing test without executing it.
