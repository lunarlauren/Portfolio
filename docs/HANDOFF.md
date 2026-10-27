# Portfolio developer handoff

## Source of truth
Edit the production-facing site in `public/`; obsolete root-level prototype files were removed and must not be recreated. `public/content.js` holds project narratives, constraints, evidence boundaries, outcomes, and planned imagery. `public/script.js` owns routing and archive cards. `public/components/project-content.js` owns case-study evidence, highlights, and facts; `public/components/case-study.js` renders case studies and chapter navigation. Their order in `public/index.html` matters: **content → project-content → case-study → script**.

Styles begin in `public/components/foundations.css`, then `public/components/homepage-base.css`, then `public/components/case-study-base.css`, then the legacy `public/styles.css`, with scoped additions in `public/components/...`. Client folder tabs use a shared dark-ink token (`--file-label-ink`) against blue, pink, and green accents; maintain at least **4.5:1 contrast** for the small tab labels in both themes. Prefer existing color and type tokens, preserve the stationery visual language, and check both light/dark modes. Avoid appending competing overrides to the base stylesheet.

## Editorial and UX evidence rules
Each professional case study should make **context/problem, intended audience and constraints, actual role, evidence/discovery where documented, explorations and rationale, implementation/collaboration when verified, and outcomes or learning** easy to find. The source check requires `audience`, `constraints`, `evidence`, and `tradeoffs` for every professional project; an evidence note may explicitly say that research or metrics are unavailable. If a fact is missing, say so; do not manufacture interviews, iterations, tests, conversion metrics, or launch claims.

Case-study facts now include **My role**, sourced from the reviewed second value in `projectEvidence` (`public/script.js`), alongside discipline, audience/scenario, and constraints. Keep that label aligned with the verified scope in `public/content.js`; it is not a license to expand a contribution into project ownership. Unknown projects omit the role rather than invent one.

The case-study chapter index exposes **Evidence & tradeoffs** as a separate reading destination when evidence or tradeoff notes exist. Keep the notes grounded in `public/content.js`; do not add a chapter to imply undocumented research. Chapter numbering, focus, and horizontal reveal of the active chapter are generated in `public/components/case-study.js`. The phone tab strip intentionally has **no one-sided gradient mask**: it previously faded a chapter and its focus indicator. The production one-row mobile header lives in `public/components/navigation.css` (loaded after legacy header rules in `styles.css`); sticky chapter offsets live in `public/components/case-study.css`.

Image placeholders disclose their evidence status in the visible kicker: **ILLUSTRATIVE** is proposed explanatory artwork, **PLANNED** has not been supplied, **APPROVED PRODUCT IMAGE NEEDED** requests a real approved asset, and **PROTOTYPE** is not a shipped screen. The shared classifier lives in `public/components/project-content.js` and is used by archive/gallery cards and case-study heroes. Do not remove those distinctions when replacing placeholders.

The case-study cover now repeats **verified shipped status** as a compact editorial stamp, derived exclusively from the third `projectEvidence` value in `public/script.js`. The helper is `deliveryStampMarkup` in `public/components/project-content.js`; only the exact reviewed value `Shipped product contribution` gets a stamp. Do not label a concept, design contribution, or prototype as shipped. Styling lives in `public/components/case-study.css` and uses cover tokens for both themes.\n\n**Hoylu Mobile Insights is shipped**; preserve that in its content, archive card, and project overview. An illustrative Mobile Insights mockup is **not** a screenshot of the shipped product. Keep `ILLUSTRATIVE /` or `PLANNED /` labels on speculative art briefs. Navigator and Stateroom TV request approved real imagery; do not silently replace those requests with generated screenshots. Confirm ownership and permission before publishing client assets.

### Illustrative impact copy is separate from published outcomes

Nine fictional impact-writing samples are retained in [ILLUSTRATIVE_IMPACT_EXAMPLES.md](./ILLUSTRATIVE_IMPACT_EXAMPLES.md) for editorial reference only. **Do not paste those numbers into `public/content.js` or describe them as observed results.** The public case-study `outcome` field must contain only documented contributions, delivery status, or clearly qualified learning. `scripts/check-content.mjs` rejects fictional-result markers in published outcomes. If verified metrics become available, record the evidence source, sample/baseline, timeframe, and your role before publishing.

## Validation and release
Run `node scripts/check-content.mjs` for source-level editorial, accessibility-markup, component-order, and delivery-status checks. Run `node --check` on changed JavaScript. For browser checks, install Playwright/Chromium and run `node tests/smoke.mjs` (see that file for setup). The Chromium suite checks evidence-heading focus, Mobile Insights shipped status, narrow-screen overflow, the footer's full-bleed opaque background in both themes, and the footer link's keyboard outline. These are local browser checks, not live-site visual verification. The GitHub Actions browser-smoke workflow now runs the content check before browser tests.

Source assertions **do not** prove browser behavior, screen-reader usability, contrast, or deployment. Before signing off, check direct case-study URLs, Back/Forward, chapter focus, 320–480px layout and 200% zoom, both themes, keyboard navigation, and actual image/placeholder rendering. Refresh versioned asset URLs in `public/index.html` when editing a loaded CSS/JS file: unchanged query strings can leave phone browsers displaying cached header/footer CSS even after a successful deploy.

## Safe changes
Prefer small commits and avoid rewriting the case-study renderer unless necessary. Add or adjust regression assertions alongside changes to UX evidence, navigation, or semantics. Use a PR for changes with broad routing, content-schema, or stylesheet impact. Record the exact checks run; never claim live or visual QA without performing it.

## Start here: editing without breaking things

Think of the site like a set of labeled drawers:

| Want to change… | Open this file |
| --- | --- |
| Homepage words, About portrait or section order | `public/index.html` |
| A project story, evidence or approved image | `public/content.js` |
| Fonts, starting colors, focus and basic layout | `public/components/foundations.css` |
| Early homepage layout, hero and card rules | `public/components/homepage-base.css` |
| Initial case-study layout and typography | `public/components/case-study-base.css` |
| Older component styling and later overrides | `public/styles.css` (legacy; edit carefully) |
| About portrait size and mobile layout | `public/components/about.css` |
| Header and navigation appearance | `public/components/navigation.css` |
| Work cards and folders | `public/components/work-cards.css` |
| Case-study page appearance | `public/components/case-study.css` |
| Theme and stationery styling | `public/components/stationery.css` |

**Safe editing recipe:** Change one thing; keep a copy of the old value; check a narrow phone width and a desktop width in both themes; run the repository tests; commit only when CI passes. A passing syntax check is **not** a passing browser test. Do not change project outcomes or claim user testing without evidence.

**CSS rule of thumb:** Search for the selector across all stylesheets before editing. The base stylesheet contains historical overrides; the later-loaded component files can override it. Prefer cleaning up the original rule rather than adding a second competing rule at the bottom. Keep comments about *why* a rule exists, not a narration of every CSS property.

**About portrait:** Its HTML is in the About section of `public/index.html`; its layout is isolated in `public/components/about.css`. The hero's abstract featured-art placeholder stays in place until an approved product visual is supplied.

## CSS cleanup progress

The first global rules were moved into `public/components/foundations.css` without changing their order relative to the remaining styles. `public/styles.css` is still a large legacy file with overrides and should **not** be deleted or reordered wholesale. Future extraction should move coherent rule groups and verify computed styles, mobile overflow, dark mode, and the browser smoke tests before declaring a pass.

### Homepage CSS extraction

`homepage-base.css` contains the earliest homepage, hero, card, and responsive rules in their original sequence. Later declarations in `styles.css` and the dedicated component stylesheets can still override these rules. This extraction is organizational, not a complete removal of duplicates; validate actual computed styles before consolidating overlapping selectors.

### Case-study base extraction

`public/components/case-study-base.css` holds the earliest case-study layout rules. It loads before the legacy stylesheet so later overrides remain effective. The final case-study styling is also in `public/components/case-study.css`. Do not delete either without browser-based visual comparison.

### Removed hero portrait legacy CSS

The hero portrait and speech bubble were retired when the illustration moved into About. Their obsolete selectors have now been removed from `public/styles.css`. The About portrait's active rules are in `public/components/about.css`. Dark-mode token declarations overridden later in the same stylesheet have been pruned; theme overrides elsewhere remain and need browser QA before broader merging.

### Theme token consolidation

The legacy stylesheet now keeps the final notebook margin values in its first notebook token block, and the final dark-mode focus/muted/line values in the main dark-theme block. `--site-chrome-edge` inherits `var(--line)` in both themes; only the dark chrome background needs its own override. Continue to keep the CSS load order unchanged until visual regression checks are complete.

### Typography tokens (rem)

The canonical type scale is in `public/components/foundations.css`: `--type-h1`, `--type-h2`, `--type-h3`, `--type-paragraph`, `--type-eyebrow`, `--type-lead`, `--type-body`, `--type-sm`, and `--type-xs`. Display and body font families are `--font-display` and `--font-body`. Semantic `h1`/`h2`/`h3`/`p`/`.eyebrow` defaults use low-specificity `:where()` rules so existing page-specific typography remains intact. Font-size declarations using `px` were converted to equivalent `rem` values (16px = 1rem), including clamp endpoints; responsive viewport units were retained. Some legacy `font` shorthand declarations and other non-font measurements still use px and should be audited separately. Test heading wrapping, navigation, case studies, and text zoom in both themes before treating the migration as fully verified.

### Portfolio image dimensions

Prepare project card and gallery thumbnail artwork at **1600 × 1000 pixels (16:10)**. The `.collection .project-visual` and featured project image frames use a shared 16:10 aspect ratio across breakpoints. Images use `object-fit: cover`, so keep essential UI and text away from crop edges. Text-only placeholder visuals intentionally remain content-sized. Full case-study screenshots may retain their native aspect ratios to preserve legibility.
