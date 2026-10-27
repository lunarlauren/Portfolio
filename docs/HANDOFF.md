# Portfolio developer handoff

## Source of truth
Edit the production-facing site in `public/`; the root-level HTML/CSS/JS files are legacy copies. `public/content.js` holds project narratives, constraints, evidence boundaries, outcomes, and planned imagery. `public/script.js` owns routing and archive cards. `public/components/project-content.js` owns case-study evidence, highlights, and facts; `public/components/case-study.js` renders case studies and chapter navigation. Their order in `public/index.html` matters: **content → project-content → case-study → script**.

Styles begin in `public/styles.css`, with scoped additions in `public/components/...`. Client folder tabs use a shared dark-ink token (`--file-label-ink`) against blue, pink, and green accents; maintain at least **4.5:1 contrast** for the small tab labels in both themes. Prefer existing color and type tokens, preserve the stationery visual language, and check both light/dark modes. Avoid appending competing overrides to the base stylesheet.

## Editorial and UX evidence rules
Each professional case study should make **context/problem, intended audience and constraints, actual role, evidence/discovery where documented, explorations and rationale, implementation/collaboration when verified, and outcomes or learning** easy to find. If a fact is missing, say so; do not manufacture interviews, iterations, tests, conversion metrics, or launch claims.

The case-study chapter index exposes **Evidence & tradeoffs** as a separate reading destination when evidence or tradeoff notes exist. Keep the notes grounded in `public/content.js`; do not add a chapter to imply undocumented research. Chapter numbering, focus, and horizontal reveal of the active chapter are generated in `public/components/case-study.js`. The phone tab strip intentionally has **no one-sided gradient mask**: it previously faded a chapter and its focus indicator. The production one-row mobile header lives in `public/components/navigation.css` (loaded after legacy header rules in `styles.css`); sticky chapter offsets live in `public/components/case-study.css`.

**Hoylu Mobile Insights is shipped**; preserve that in its content, archive card, and project overview. An illustrative Mobile Insights mockup is **not** a screenshot of the shipped product. Keep `ILLUSTRATIVE /` or `PLANNED /` labels on speculative art briefs. Navigator and Stateroom TV request approved real imagery; do not silently replace those requests with generated screenshots. Confirm ownership and permission before publishing client assets.

## Validation and release
Run `node scripts/check-content.mjs` for source-level editorial, accessibility-markup, component-order, and delivery-status checks. Run `node --check` on changed JavaScript. For browser checks, install Playwright/Chromium and run `node tests/smoke.mjs` (see that file for setup). The browser suite includes evidence-heading keyboard focus, shipped Mobile Insights labeling, and 320px horizontal-overflow checks; these remain unverified until Chromium runs. The GitHub Actions browser-smoke workflow now runs the content check before browser tests.

Source assertions **do not** prove browser behavior, screen-reader usability, contrast, or deployment. Before signing off, check direct case-study URLs, Back/Forward, chapter focus, 320–480px layout and 200% zoom, both themes, keyboard navigation, and actual image/placeholder rendering. Refresh versioned asset URLs in `public/index.html` when editing a loaded CSS/JS file.

## Safe changes
Prefer small commits and avoid rewriting the case-study renderer unless necessary. Add or adjust regression assertions alongside changes to UX evidence, navigation, or semantics. Use a PR for changes with broad routing, content-schema, or stylesheet impact. Record the exact checks run; never claim live or visual QA without performing it.
