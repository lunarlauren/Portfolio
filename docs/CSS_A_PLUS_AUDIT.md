# CSS A+ audit — pass 1

Baseline: `main` commit `994a8ac5ada0f311759453a6548cd05af6b004b1` (2026-11-01).

## Inventory
13 CSS files, **93,863 bytes** (uncompressed repository source); 12 component sheets plus the 132-byte inactive `public/styles.css` compatibility stub. CSS is linked individually, in cascade order, from `public/index.html`. This is a source-size baseline, **not** transferred CSS or browser performance.

| File | Bytes | Intended owner |
| --- | ---: | --- |
| `components/case-study.css` | 19,257 | Case-study presentation and responsive reading |
| `components/work-cards.css` | 16,783 | Work archive and shared card motion |
| `components/foundations.css` | 11,574 | Global palette, typography, and primitives |
| `components/hero-polish.css` | 9,631 | Hero layout and portrait |
| `components/navigation.css` | 9,347 | Header, navigation, and chrome |
| `components/about.css` | 7,445 | About section |
| `components/stationery.css` | 5,311 | Paper and stationery treatments |
| `components/homepage-base.css` | 4,779 | Shared homepage geometry |
| `components/playground.css` | 3,761 | Night Playground surface and contrast |
| `components/visual-placeholders.css` | 2,422 | Shared missing-image state |
| `components/monochrome-editorial.css` | 2,127 | Editorial theme tokens and selective image treatments |
| `components/case-study-base.css` | 1,294 | Case-study foundational rules |
| `styles.css` | 132 | Inactive compatibility stub |

## Confirmed cascade boundaries to protect
- `visual-placeholders.css` defines generic `.project-visual` paint, a no-image dashed frame, and the dark fallback. `playground.css` intentionally overrides the no-image state with charcoal and light text, in **both** page themes.
- `work-cards.css` owns Work preview frames and card interactions; `monochrome-editorial.css` supplies card theme tokens and the late `.playground .play-grid .project-card-link{border-color:#666}` override. Investigate this override before moving it; do not delete it without computed-style coverage.
- `monochrome-editorial.css` still uses `!important` for italic heading color, hero feature paint, and reduced-motion transitions. These are **audit candidates**, not proven dead rules.
- `index.html` loads `styles.css` between foundational and component sheets despite its having zero active CSS declarations. Removing the link is a separate low-risk change after confirming compatibility expectations.

## Conflict awareness
At audit time five PRs were open, including mobile portrait-first, standalone/theme work, and monochrome editorial work. Do not modify their active areas without reviewing diffs and rebasing.

## A+ acceptance criteria
1. Every component has a documented owner and no unexplained cross-file overrides.
2. Each removal is backed by selector/cascade analysis and computed-style checks in **light and dark** at mobile and desktop widths.
3. Preserve approved imagery, illustrative provenance labels, keyboard focus, reduced motion, forced/increased contrast, and responsive layout.
4. Content guard continues to distinguish documented evidence from assumptions; **Hoylu Mobile Insights is shipped**.
5. CI source/syntax/Chromium checks must pass before merging. Screenshot comparison and production deployment must be reported separately; CI smoke alone proves neither.

## Next implementation pass
Audit `visual-placeholders.css`, `playground.css`, and the final Playground border rule in `monochrome-editorial.css`. Identify any actually duplicated declarations, consolidate only after inspecting computed-style precedence and adding a focused regression assertion. Follow with `!important` specificity review in the editorial sheet.

This pass is **inventory/documentation only**: no CSS declarations were changed and no visual equivalence is claimed.
