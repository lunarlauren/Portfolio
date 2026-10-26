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

### Responsive navigation handoff (October 26, 2026)

The sticky header deliberately switches between a **single row at 421–650px** and a **two-row grid at 420px and below**. The smaller layout preserves readable labels and 44px targets for Work, Playground, About, Contact, and the theme toggle. The case-study chapter index uses corresponding sticky offsets (64px / 110px) and heading scroll margins so keyboard and touch navigation should not hide chapter headings behind the header. These values are kept together at the end of `public/styles.css`; update both the header and chapter-index offsets when changing header dimensions. The source smoke test checks these declarations, **not** their rendered geometry. Still verify 320, 375, 420, 421, 650 and 760px widths, both themes, keyboard focus, and chapter scrolling in a browser before release.

## UX case-study editing guide

Each project in `window.PORTFOLIO` should make the designer's **reasoning** as clear as the final visual work:

1. `summary` — the hook, written for someone scanning the portfolio.
2. `details` — audience, problem, constraints and the user's actual role.
3. `process` — evidence or feedback **only when documented**, plus explorations, decisions, tradeoffs and iterations that can be substantiated.
4. `outcome` — what was delivered or shipped and what was learned. Use measurable impact only when verified.
5. `image` / `gallery` — approved project visuals. Empty image fields intentionally render descriptive `imageBrief` / `galleryBriefs` placeholders; those briefs are **not evidence of completed artifacts**.

The case-study view presents these as **Challenge & role → Process & design decisions → Deliverables & learning**. Preserve that sequence when adding projects. Keep `projectEvidence` and `caseHighlights` in `public/script.js` aligned with any verified status or scope changes in `public/content.js`.

**Evidence guardrails:** Never invent user interviews, usability tests, adoption numbers, conversion lifts, shipped features, or collaborators. Clearly distinguish concept/prototype work from shipped contributions. The user has confirmed **Hoylu Mobile Insights shipped**; do not describe its delivery as concept-only. The Holland America Line Navigator and stateroom TV contributions are also described as shipped. For Stateroom TV, the remote-control interaction model and Voyage Tracker scope are documented; the case study explicitly separates interface rationale from any unprovided guest research, tests, or impact measures. For Alcon **AI-Assisted IOL Planning**, the UX/UI workflow and connection between patient scans, model predictions, and another tool are documented, but clinical testing, safety validation, deployment, and impact are **not** verified; never present suggested labels or clinician review states as implemented safeguards. If the delivery status or outcome is unknown, say so rather than implying success.

### Illustration and independent-work handoff (October 26, 2026)

`Illustration & Experiments` describes an ongoing personal practice, **not** a verified sequence of completed studies. Its `evidence` and `tradeoffs` fields explain what is known and what is only design rationale. The three `PLANNED /` gallery briefs are intentional placeholders; replace each only with approved original work and captions describing actual choices. Do not imply sketch rounds, audience tests, or finished assets without source material. `projectEvidence` in `public/script.js` now labels this status, and the Fallout highlight lookup uses the exact title key from `content.js`. Keep those keys synchronized when renaming projects.

**Validation performed:** The repository smoke-test assertions (176 assertions) were executed against GitHub-fetched sources in a V8 JavaScript harness with Node file imports adapted. This is not a Node test run or browser/visual/deployment verification. Full Node execution and 320px–desktop keyboard, dark-mode, and reduced-motion QA remain open.

## Evidence and decision notes (October 2026)

The professional project index uses each project's `summary` for the problem and
the first sentence of `process` for a short **Design approach** preview. The
`processTeaser` helper reuses the existing copy instead of inventing research or
outcomes. Each card has **one** case-study link, avoiding duplicate tab stops.

Case studies may include two optional, plain-text fields in `public/content.js`:
`evidence` (what is confirmed and what supporting research/metrics are absent)
and `tradeoffs` (design tensions and rationale, without implying unverified tests
or decisions). `processNotesMarkup` renders these in labeled callouts. These fields are used on documented professional case studies including Hoylu **Connected Planning** and **Mobile Insights**, Alcon **Customizable Patient Portal**, and Holland America Line **Navigator App** and **Stateroom TV App**. Mobile Insights and Navigator remain explicitly **shipped**. Navigator's documented passenger feedback does not establish a quantified improvement or formal study.

For **Connected Planning**, preserve the distinction between documented UX/visual design contribution, unverified delivery or impact, and the breadth-versus-detail design rationale. The associated content smoke check protects that boundary.

For **Campaigns & Events**, describe the actual formats, viewing-distance constraints, and visual hierarchy choices; avoid presenting unmeasured booth response, lead generation, or campaign metrics as verified results. The optional `evidence` and `tradeoffs` fields are rendered as explicit case-study notes and checked in the content smoke test.

For **Motion & Storytelling**, the verified scope is a roughly 30-second product storyboard and motion-design planning, **not** a confirmed finished or shipped animation. Explain frame hierarchy and pacing as design rationale; the intended audience is framing rather than documented user research. Do not add review cycles, animation delivery, audience testing, or comprehension metrics without source evidence. `scripts/check-content.mjs` includes a regression assertion for this distinction. The October 26 update passed 10 targeted source-level V8 checks (content and renderer parsing, data shape, links, Motion evidence and Mobile Insights shipped status); the Node smoke command, browser QA, and deployment were **not** run or verified.

For **Forktactics**, describe the working AI-assisted prototype and observed iteration issues as self-directed exploration, **not** recruited user research or validated usability findings. Keep the automation-versus-control, ingredient-variety, and TCG-readability tradeoffs visible; do not claim verified grocery savings, reduced food waste, or a production launch. Its `evidence` and `tradeoffs` fields have regression assertions in `scripts/check-content.mjs`. Source-level parsing and targeted assertions passed for this update; the Node suite, browser QA, and deployment were not verified.

For **Fallout 76 ; What I'd Design**, treat the three proposals as independent fan-concept briefs, not completed or shipped Bethesda features. The case study now labels the audience, designer role, and three distinct design tensions; `evidence` explicitly distinguishes planned illustrations/UI mockups from finished artifacts. The case-study overview in `public/script.js` labels these speculative proposals as unshipped. Update both that overview and the assertions in `scripts/check-content.mjs` if the owner supplies finished work or verified feedback.

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


### Pass 11 — mobile CSS consolidation
Removed four superseded mobile header blocks (old 650px/390px/365px rules, including a competing two-row grid). The current 421–650px layout and <=420px two-row layout remain. Static checks: `public/script.js` parses as JavaScript and stylesheet braces are balanced. These checks do **not** validate browser layout or CSS semantics; test responsive header, hero portrait, and keyboard focus in a real browser before release.


### Pass 12 — hero portrait layout
The portrait now has bounded mobile widths, and its speech bubble stays aligned with the portrait on touch devices rather than inheriting desktop offsets. The featured-card footer reserves space for the portrait. This is a CSS-level change; visually verify the bubble at 320/375/390/420/760px, portrait crop, and the card's links before marking complete.


### Pass 13 — route landmarks and process previews
When the homepage is hidden on a project route, the case-study view takes the `main` landmark; when the homepage is shown, the case-study view is hidden. Project-card process previews are only rendered when source copy exists. The portrait's About link has an explicit keyboard focus outline in both themes. JavaScript parsing was checked, but actual screen-reader/browser route behavior still requires QA.


### Pass 14 — navigation QA
Returning from a project case study now focuses the relevant Work or Playground heading, rather than always focusing Work. Changed nonstandard `behavior: "instant"` scroll options to `"auto"`. Static checks confirm both script files parse, destination heading IDs exist, and case-study main landmark setup is present. Browser QA and screen-reader verification remain outstanding.


### Pass 15 — release cache and route focus
Updated HTML query versions for CSS and JavaScript to ensure new deployments request the latest assets. Case-study exit now restores heading focus only for explicit `#work` and `#playground` returns; other destinations retain native hash navigation. Source-level JavaScript parsing checked. Browser QA, deployed-asset verification, and cross-device testing are still required before sign-off.


### Case-study landmark and return navigation (accessibility pass)
The dynamically rendered case-study `role="main"` is named by its visible `#case-title` heading; the homepage `<main>` is hidden while a case study is open. The project overview's context, contribution, and delivery labels form a named group. Preserve the **shipped** designation for Hoylu Mobile Insights and the evidence boundaries in every case study when editing these templates. Returning to a project card uses standard `scrollTo({behavior:"auto"})` before restoring keyboard focus. `scripts/check-content.mjs` guards these source-level contracts, but real keyboard/screen-reader and responsive browser QA are still required.


### Mobile case-study reading pass (2026-10-26)
Added scoped <=600px text wrapping, line-height, 44px chapter targets, and responsive case-study image sizing without changing content, image placeholders, or theme tokens. Refreshed the stylesheet query version. Source checks: CSS braces balanced; `public/script.js` and `public/content.js` parse as JavaScript; HTML points to the new stylesheet version. **Not verified:** browser layout, keyboard/screen-reader interactions, contrast measurements, deployed site, or the native Node test suite.


### Phone featured-card clarity (2026-10-26)
Based on a supplied iPhone screenshot, hide the redundant bottom “Scroll to explore” link and portrait speech bubble at <=600px. The featured art remains a Work link; the portrait remains an About link. Keep both keyboard-accessible and preserve the desktop bubble. CSS version updated. Source checks passed: stylesheet braces, JS parsing, expected markup/selectors. Actual updated browser appearance and deployed assets are **not** verified.
