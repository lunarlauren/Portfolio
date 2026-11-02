# Portfolio developer handoff

## Dark hero-note contrast and live verification â€” Pass 28

The dark hero note was inheriting a near-white `--night-bg` fill because that
token is mixed from `--palette-navy`, which becomes white in dark mode. The
fill is now transparent and the note explicitly inherits the theme's high
contrast brand ink; its divider uses the shared line token. The hero stylesheet
cache key was advanced. Verified on the live Worker: the note is transparent
with light ink, action colors/radii match, and Work cards retain a square
top-left corner. Worker version `1c5d3d7c-3a51-46e4-a8d5-20eeb501e307`.

## Shared action styling and dark contrast â€” Pass 27

The primary Work link, desktop Contact action, and About invitation share a
3px editorial radius, 15px bold type, ink/paper resting colors, and the same
theme-aware hover colors. Their padding remains component-specific; the phone
Contact link stays text-only. Dark quiet-link ink now uses `--brand-ink` for
clear contrast against `--paper`, and dark header action focus uses the shared
`--focus` token. Work project cards have a square top-left corner and retain
their rounded remaining corners. Keep the theme and focus tokens shared when
editing these controls.

## Case-study chapter press motion â€” Pass 26

The chapter buttons' 2px pressed-state offset now shares the existing
`prefers-reduced-motion:no-preference` gate with case-study entrance motion.
Under reduced motion, the chapter buttons still change color and keep their
keyboard ring, but stay stationary on press. Keep interactive feedback that
moves a control inside the motion-enabled block.

## About invitation motion preference â€” Pass 25

The About invitation's 2px hover lift runs only for hover-capable devices when
the visitor has not requested reduced motion. Its reduced-motion rule disables
the transition property; it no longer needs a competing `transform:none`
override. Hover/focus colors and keyboard outline stay in the CTA's shared
interaction rule. Preserve this separation when changing the invitation.

## Static hero art cascade â€” Pass 24

`homepage-base.css` owns the art frame's shared `inset:0`; phone and desktop
rules no longer repeat it. `hero-polish.css` no longer resets `transform` on
the hero art: no loaded rule animates or moves that property. Portrait parallax
uses the independent `translate` property. Grayscale reveal and reduced-motion
filter timing remain unchanged. Keep transforms only if a real transform effect
is added, and update the stylesheet cache keys when changing either file.

## Homepage motion defaults â€” Pass 23

`homepage-base.css` applies the primary button lift and arrow movement only
when reduced motion is not requested. The arrow also retains its fine-pointer
hover guard. The previous reduced-motion rule disabled the arrow's transition
but still allowed its hover transform to jump to the shifted position.

Reveal opacity/transforms and hero parallax are already opt-in, so their
important resets are removed. The reduced-motion group disables transition
properties directly and includes `.about h2.reveal-ready` to outrank the shared
heading transition. Existing observed content becomes visible immediately when
the visitor enables reduced motion. The editorial About portrait also disables
transition properties without an important shorthand.

Chromium checks exercise the actual homepage button, keyboard ring, portrait
parallax and offscreen reveal targets at 390px/1280px in both themes, including
live preference changes and restoring normal hover motion. Keep the global
duration safeguard and existing visual baselines.

## Preference-aware project arrows â€” Pass 22

`work-cards.css` places metadata-arrow transforms inside the existing
`prefers-reduced-motion:no-preference` guards. Keyboard focus retains the
4px/-4px arrow movement; fine-pointer hover retains 4px/-3px. The arrow,
image, preview and folder-label transforms now default to stationary under
reduced motion, without an important transform reset.

The reduced-motion rule sets `transition-property:none`, including on the
project link itself. This also prevents an implicit `all` transition when a
visitor changes the preference while hovering. It avoids competing with
foundations' intentional important duration safeguard. Keep the global safeguard and the separate archive
surface reset, which also handles touch devices. Color, underlines and
keyboard rings continue to provide feedback when motion is disabled.

Chromium smoke tests toggle the preference on an already hovered or
keyboard-focused Work/After Hours link at 390px and 1280px in both themes.
They verify stationary preview layers and retained focus rings, then restore
the original arrow motion without reloading. The existing 12 component
snapshots remain the visual baseline; production deployment is a separate check.



## Foundation typography and motion ownership â€” Pass 21

`foundations.css` now has one `:root` for palette, typography, and spacing,
plus one ordinary dark-theme token block. Headings inherit the shared
Newsreader/600 defaults; component files own only sizes and special treatment.
The `--type-paragraph` alias and duplicate hero/section font declarations
were retired. The archive title has no variable-font motion to transition;
the global reduced-motion rule already suppresses heading transitions.
Do not add another late root or dark palette block. Preserve UX narratives,
illustrative image disclosures, and shipped Hoylu Mobile Insights wording.
Source and Chromium checks are necessary; deployment is separately verified.

## Current case-study CSS ownership â€” Pass 16

`public/styles.css` is an inactive 132-byte compatibility stub. The retired
`case-study-base.css` no longer loads or exists. `case-study.css` owns
case-page structure, reading type, facts, chapter navigation, and responsive
states; `visual-placeholders.css` owns shared image cropping and illustrative
status labels. Keep the default case rules before their scoped/theme/phone
overrides. Base heading font shorthands were removed because the shared
`--font-display` and heading weight already provide them.

The old base's desktop 220px/700px columns, hero frame, Back/Next spacing,
and paragraph ink are preserved. The phone grid, dark reading ink, approved
image crop, chapter offsets, and 44px controls still have their component
owners. Check content contracts, syntax, and Chromium at 390/1280px in
both themes before merging; passing tests do not establish screenshot parity
or production deployment. Do not alter UX evidence, illustrative image
provenance, or Hoylu Mobile Insights' verified shipped contribution.

## Motion media ownership â€” Pass 9

`work-cards.css` has a single fine-pointer, hover-capable,
`prefers-reduced-motion:no-preference` block for archive folder/tab lift and
linked project/Playground preview motion. Keep keyboard focus and default
transitions in their separate accessibility-aware rules.

`case-study.css` has one `prefers-reduced-motion:reduce` block governing
the chapter strip's scrolling, button transition, and routed case-study
entrance animations. When editing animation timing or chapter navigation,
test both themes and the reduced-motion setting. Do not merge media
conditions with different accessibility semantics merely to reduce file size.

## Selector ownership â€” Pass 10

Professional Work entries are rendered as `.featured-project.client-file`.
For archive titles and metadata, `work-cards.css` deliberately uses
`.work .client-file .archive-project-title` and
`.work .client-file .project-meta` rather than repeating both structural
classes. Their shared specificity is sufficient to beat generic card type;
the 600px title override retains the same selector and follows later.

Case-study next links are generated as `a.case-next` inside
`.case-next-nav`. The existing `.case-next-nav a,.case-back` rule owns
44px touch targets and alignment; do not add a redundant `.case-next`
size rule. Case fact values retain 1.6 line-height, while evidence
`strong` text retains 1.5. Computed-style tests cover both themes.

## Programmatic focus versus keyboard focus â€” Pass 11

The router focuses the Work heading and case-study wrapper to orient screen
readers after route changes. Both receive `tabindex="-1"` and intentionally
suppress a decorative outline **only while focused in that state**:
`#work-title[tabindex="-1"]:focus` and
`.case-view[tabindex="-1"]:focus`. Neither rule needs `!important`.
Avoid making these selectors broad `:focus` resets that could hide future
interactive focus states.

Actual project links, case-study Back/Next links, and chapter buttons still
have explicit 3px `:focus-visible` outlines in their component owners. The
Chromium focus smoke test covers keyboard modality, light/dark themes and
phone/desktop widths. Keep those focus behaviors independently verifiable.

## Contrast and reduced-motion ownership â€” Pass 12

High-contrast Work cards need stronger borders and **no decorative shadow**,
even while hovered or focused. The `prefers-contrast:more` rule in
`work-cards.css` explicitly covers both the resting
`.featured-project.client-file` state and the higher-specificity
`:is(:hover,:focus-within)` state. Never replace those selectors with a
weaker rule that loses to the regular hover shadow, and avoid `!important`
when the actual state can be represented by a properly scoped selector.

Case-study entrance animations are opt-in under
`prefers-reduced-motion:no-preference`; the reduced-motion fallback can set
`animation:none` without an important override. The hero portrait can set
`transition:none` under reduced motion, retaining its editorial grayscale
appearance while removing the animated color reveal. The global reduced-motion
duration reset in `foundations.css` remains intentional. Chromium smoke
tests cover Work cards at rest/hover/focus in both themes and widths, and
the reduced-motion portrait/case-study states.

## Windows forced-colors focus and illustrated briefs â€” Pass 13

Windows forced-colors mode uses system colors, not the site's custom
high-contrast palette. The `@media(forced-colors:active)` block at the end
of `work-cards.css` owns `Highlight` outlines for Work/After Hours links,
focused archive files, and solid borders for illustrative missing-image frames.
It also retains `CanvasText` borders/dots on shipped-status labels.

The corresponding `case-study.css` block sits **after** ordinary case
navigation focus rules. It provides `Highlight` outlines for Back/Next links,
chapter buttons, and the active chapter border. This order is deliberate:
later standard component paint must not overwrite system color.

The Chromium smoke suite explicitly emulates `forced-colors:active` at
390px and 1280px in both page themes, verifies genuine keyboard
`:focus-visible`, and checks system highlight and border style values.
These system settings are independent of `prefers-contrast:more`. Do not
add `forced-color-adjust:none` to preserve decorative accents; it would
bypass the user's chosen color palette.

## Text reflow and long-content resilience â€” Pass 14

`case-study.css` caps the *Design approach* kicker track with
`fit-content(18ch)` rather than an unconstrained `max-content` track.
Normal short labels preserve their natural width, while unexpectedly long
copy can wrap without pushing the adjacent UX rationale outside the cover.
The kicker allows `overflow-wrap:anywhere` and the explanation column
retains `minmax(0,1fr)`. At widths up to 600px, the existing single-column
layout still takes precedence.

Case-study cover headings also allow emergency word wrapping at desktop
widths, not only under the 760px mobile breakpoint.

Next-case and Back anchors use `min-width:0`, `max-width:100%`, and
`overflow-wrap:anywhere` so project-title links can reflow rather than be
clipped. The Work archive title also allows emergency wrapping for long
unbroken names; regular natural-language titles retain editorial balancing.

Chromium reflow smoke tests inject temporary long content into the rendered
Work and case-study components and verify *element* scroll bounds at 320px,
390px, 760px, and 1280px, including 200% root-font resizing and both themes.
The temporary test mutations never alter authored project content. These
tests supplement, but do not replace, manual full-page browser zoom and
screen-reader review.

## Enlarged-text phone header and measured sticky offsets â€” Pass 15

At up to 650px, the navigation component keeps the same DOM order, two-row
visual hierarchy, and minimum 44px touch targets. The first row is
`minmax(44px,auto)`, and the links can wrap when root text is enlarged.
The second row retains Contact and the theme toggle; no controls are removed,
shrunken to illegible sizes, or sent into an inaccessible horizontal scroller.

The header retains a *static* `min-height:110px` baseline. The small
`initResponsiveHeaderHeight()` hook in `public/script.js` observes the
actual rendered header height and updates
`--mobile-site-header-height`. The variable is consumed by the mobile
`scroll-padding-top` and section scroll margins in `navigation.css`, and by
the phone case-study chapter strip and heading margins in `case-study.css`.
**Do not use the measured variable to size the header itself**: that
creates a feedback loop that can stop it shrinking when fonts return to
normal. The code updates only on changes and falls back to a window resize
listener where `ResizeObserver` is unavailable.

Chromium tests verify 320/390/650px at normal, 200%, and restored text
size, in both themes, checking bounding rectangles, nonoverlapping 44px
navigation targets, keyboard focus, and real header/anchor/chapter offsets.
This complements manual testing with actual browser zoom and display-scale
settings.

## Opaque chrome and compositing efficiency â€” Pass 17

The sticky header's `--site-chrome-bg` is opaque to keep scrolled content
from showing through navigation. A `backdrop-filter` cannot visibly affect
the opaque header and causes unnecessary backdrop rendering work, so
`navigation.css` no longer applies backdrop blur to the header or its theme
toggle. The hairline separator, toggle's semi-transparent paper tint, soft
shadow, and inset gloss are preserved with a feature guard on
`color-mix()` itself rather than on support for backdrop blur. Windows
forced-colors still uses system `Canvas`/`CanvasText` and removes shadows.

The homepage portrait still responds to the existing
`--hero-parallax-y` variable, but it does **not** permanently request
a compositor layer with `will-change:translate`. A browser can choose its
own layer strategy when the portrait actually moves. Do not add permanent
`will-change` to offscreen or long-lived elements unless profiling shows
a measurable benefit.

The Chromium smoke suite checks computed blur, opacity, shadow, toggle
surface, and live parallax translation at 390px and 1280px in both themes.
This verifies retained rendering behavior, **not** a quantified FPS,
battery-life, or Core Web Vitals improvement. Measure performance on
representative devices before making a numerical claim.

## Resource discovery and image priority â€” Pass 18

The original DM Sans (400/500/600/700) and variable Newsreader font
stylesheet now loads directly from the HTML `<head>` rather than through
`@import` inside `foundations.css`. Preconnect hints for
`fonts.googleapis.com` and `fonts.gstatic.com` (with anonymous CORS mode
for font files) let the browser begin connection setup before parsing CSS.
`display=swap` and the authored font-family fallbacks remain unchanged.
Keep a single font stylesheet request rather than restoring a blocking import.

The illustrated hero is above the fold on phones and desktop. A high-priority
`<link rel="preload" as="image">` in the head references the **exact same
URL** as the hero image's existing `fetchpriority="high"` and async decode.
Do not change only one URL or add a cross-origin mode to only one of the
references; that could produce a duplicate image download. The About photo
continues to use `loading="lazy" decoding="async"`; it must not be preloaded
as critical content. The inactive 132-byte `styles.css` compatibility stub
remains for existing source audits but is **not** linked as a stylesheet, so
it no longer generates an unnecessary render-blocking network request.

The source headshot PNG is 4,572,180 bytes in Git. Pass 18 left that
asset unchanged; Pass 19 subsequently added a reviewed, compressed WebP
derivative while keeping this original photograph as fallback. Do not infer
real-world LCP or CDN improvements without deployed resource measurements.

Chromium tests verify head link order, preconnects, priority attributes,
unchanged font stacks, asynchronous About photo loading, absence of the
compatibility request, and exactly **one** hero image request after preload
discovery. Google Fonts network performance and Core Web Vitals need
real-world measurement; offline CI cannot prove those outcomes.

## Optimized About headshot and image-layout stability â€” Pass 19

The original `public/Headshot Lauren Leven.png` is a **2000 Ã— 2000**
photograph and remains in Git unchanged as a browser fallback. The same
photograph was resized to 1024 Ã— 1024 and exported as
`public/headshot-lauren-leven-1024.webp` using Chromium's image encoder
at 0.86 quality. The reviewed derivative is approximately **68 KB** rather
than the original **4.57 MB** (about **98.5% fewer image bytes** in browsers
that support WebP). No synthetic portrait, retouching, new crop, or replacement
subject was introduced.

`public/index.html` uses `<picture>` with the optimized WebP `<source>`
and the original PNG as the `<img>` fallback. The image retains factual
alt text, `loading="lazy"`, `decoding="async"`, and `width="2000"
height="2000"` attributes for a preallocated **1:1 intrinsic ratio**.
The source PNG and WebP are both square, so the desktop portrait occupies
the same dimensions. `about.css` owns the block-level `picture`
wrapper; its existing phone-only `aspect-ratio:4/5`,
`object-fit:cover` and `object-position:center 27%` preserve the
mobile crop. Do not remove these without checking the phone layout.

The source contract verifies both real file formats, size savings, fallback,
and intrinsic dimensions. Chromium tests check that the WebPâ€”not the PNGâ€”is
fetched once and decoded, and hold the image response to compare image bounds
before/after load on phone and desktop. This is a local rendering test and
does not prove a deployed CDN cache outcome, LCP, or a field-measured CLS score.

## Visual regression screenshots â€” Pass 20

`tests/visual-regression.mjs` compares **12 reviewed component snapshots**
from real homepage and case-study routes at **390px** and **1280px**, in
**light and dark** modes. Each comparison targets the existing header, hero
illustration panel, or case-study chapter strip, rather than a full page of
regularly edited prose. Chapter button labels are normalized to short fixed
terms for screenshot purposes; content semantics are checked separately by
the regular smoke suite. Reduced motion is enabled and animations, parallax,
and the caret are frozen during screenshot capture. This keeps CSS geometry,
surface colors, borders, artwork, and theme treatments in view while avoiding
incidental animation timing changes.

The committed JPEG baselines live in `tests/visual-baselines/`. The visual
test runs in the same GitHub Actions Chromium job after the existing content,
syntax, and browser smoke tests. It compares decoded pixels in Chromium:
major differences exceeding **5% of pixels** (per-channel difference over
35/255) or **7.5 mean RGB units** fail CI. Any dimension change fails.
These thresholds accommodate small font-antialiasing differences, **not**
arbitrary changes in component appearance. On failure, the workflow uploads
`artifacts/visual/*-actual.jpg` and `*-diff.png` as a reviewable artifact
for 14 days.

To regenerate *only after reviewing an intentional design change*:

```sh
npm install --no-save playwright
npx playwright install chromium
VISUAL_BASELINE_CAPTURE=1 node tests/visual-regression.mjs
node tests/visual-regression.mjs
```

Review **every** resulting JPEG against the intended design and commit the
changed files explicitly. Never make the normal CI job automatically update
snapshots, and do not increase diff thresholds just to make a real regression
pass. Run the screenshot test with the same Chromium revision as CI whenever
possible. The source-level and computed-style tests continue to cover
keyboard focus, overflow, system colors, and reduced motion; these snapshots
are only one part of visual QA. They do **not** replace cross-browser checks,
real-device testing, or full-page copy review.

## Source of truth
Edit the production-facing site in `public/`; obsolete root-level prototype files were removed and must not be recreated. `public/content.js` holds project narratives, constraints, evidence boundaries, outcomes, and planned imagery. `public/script.js` owns routing and archive cards. `public/components/project-content.js` owns case-study evidence, highlights, and facts; `public/components/case-study.js` renders case studies and chapter navigation. Their order in `public/index.html` matters: **content â†’ project-content â†’ case-study â†’ script**.

### Derived theme tokens (CSS A+ pass 7)

`public/components/foundations.css` declares `--paper:var(--palette-paper)` and
`--ink:var(--brand-ink)` **once** on `:root`. The dark theme changes
`--palette-paper` and `--brand-ink`, not the derived aliases. Likewise,
`public/components/navigation.css` declares `--site-chrome-edge:var(--line)`
once, so the header/footer divider follows both theme and increased-contrast
separator values automatically. Avoid repeating aliases in
`html[data-theme="dark"]`: doing so adds competing sources of truth.
Keep the intentional dark `--site-chrome-bg` paint, which ensures opaque
header/footer surfaces. Browser smoke tests cover both themes at 390px and
1280px and verify high-contrast separator inheritance.

**Beginner-friendly color ownership:** Light and dark theme variables now live together at the top of `public/components/foundations.css`. Edit a named `--color` variable there rather than appending an override to `public/styles.css`. `public/styles.css` is now a compatibility stub with no active declarations; new rules belong in their owning component. Check both themes after every CSS change.

Styles begin in `public/components/foundations.css`, then `public/components/homepage-base.css`, then the inactive `public/styles.css`; `public/components/case-study.css` owns all case-study structure and appearance. Client folder tabs use a shared dark-ink token (`--file-label-ink`) against blue, pink, and green accents; maintain at least **4.5:1 contrast** for the small tab labels in both themes. Prefer existing color and type tokens, preserve the stationery visual language, and check both light/dark modes. Avoid appending competing overrides to the base stylesheet. The responsive hero's typography, portrait sizing, and phone reading order are owned by `public/components/hero-polish.css`. The single `@media(max-width:600px)` block intentionally hides the redundant editorial note and decorative card chrome on phones; the note remains on larger screens. Avoid adding competing `styles.css` overrides. The About section's heading scale, biography measure/leading, and short-laptop typography now live in `public/components/about.css` (loaded after `styles.css`); avoid reintroducing About-specific type overrides into the legacy sheet. The short-viewport heading rule (`min-width:1024px`, `max-height:780px`) intentionally comes last so it wins the cascade. The Work section's two-column desktop heading, editorial title scale, supporting paragraph alignment, and short-laptop spacing now live together in `public/components/work-cards.css` (after the legacy sheet). Keep Work heading and section padding changes there. On phones (600px and below), the Work intro uses a 34â€“48px top gutter, a 2â€“2.375rem heading and a 20â€“28px handoff to the first archive card; the full UX-process summary stays visible. The 760px/600px archive rules are grouped once each in work-cards.css. Test 320/390/600px in both themes before release. The shared `.projects-grid` / `.play-grid` layout now lives in `public/components/homepage-base.css`; Work card geometry and focus styles live in `work-cards.css`; the old collection view is retired. Archive folders render as `.featured-project.client-file`: their eyebrow margins have one owner, dark file tokens share one theme block, and reduced-motion/hoverless cards share a stationary fallback. The numeric FILE labels are authored in `script.js`, not generated by CSS counters. Keep the documented challenge â†’ role/delivery â†’ approach scan order and verified shipped-status copy intact.


## Hero editorial CSS ownership (2026-11-01)
The inactive `public/styles.css` is already a compatibility stub; it has no
remaining hero declarations to migrate. `hero-polish.css` now owns the
monochrome portrait reveal, italic emphasis, and note border as well as the
responsive geometry. The final `monochrome-editorial.css` no longer applies
late hero paint or `!important` headline overrides. The hero headline inherits the theme ink. Emphasis inherits that ink in
light mode (normal type) and uses `--brand-pink` italic in dark mode; the note
uses the light `--line` edge and existing dark `--brand-pink` edge. Touch devices see the full-color
portrait, and reduced-motion users get an immediate reveal. Preserve the
601px desktop-art / 600px phone boundary and the 1024px art fill; they are
intentional. Source and Chromium computed-style checks cover 390/1280px in
both themes. They do not establish screenshot parity or live deployment.

## Case-study responsive breakpoint ownership (2026-11-01)
`public/components/case-study.css` now has one `max-width` block per
760px, 650px, 600px, 480px, and 420px breakpoint (17 scattered blocks â†’ 5).
The 760px block owns the tablet facts/evidence/gallery columns, cover and
reading rhythm, and compact chapter strip. The 650px rule clears the taller
two-row header; 600px hides the chapter scrollbar and stacks approach labels;
480px makes long facts single-column; 420px adjusts chapter-strip padding.
Keep this descending order and do not reintroduce responsive overrides into
the inactive `styles.css`. Source assertions compare each complete breakpoint;
Chromium checks 320/480/481/600/650/651/760/761px in both themes. These checks
do not establish screenshot-level parity or a production deployment.

## Case-study hero and evidence CSS ownership (2026-11-01)
The inactive `public/styles.css` remains a compatibility stub. In `case-study.css`,
no-image hero briefs use one scoped caption rule and a dashed frame. The existing
dark hero paint supplies the dark placeholder surface; do not reintroduce unused
`--case-hero-placeholder-*` overrides. Real approved screenshots keep the
full-height image treatment. Evidence grid, label and value geometry are now
owned by the scoped `.case-view` selectors, including the phone column switch.
Keep illustrative provenance labels, authored UX rationale and shipped status
separate. Check 390/1280px, both themes and reduced motion in Chromium; these
checks do not establish screenshot parity or production deployment.

## Work evidence-first card hierarchy (2026-11-01)
The professional archive in `public/script.js` renders title â†’ project type â†’
challenge â†’ reviewed contribution/delivery facts â†’ documented design approach â†’
approved image or clearly labeled illustrative brief â†’ case-study link. This
is one semantic DOM order for mobile, desktop and screen readers; do not
reorder only with CSS. After Hours keeps its visual-first layout. The Work
component owns the gap above media and uses two columns for role/delivery
facts at 360px and wider, stacking only at 359px and below. The redundant
generic Work h3 declaration was removed; the single archive title rule
retains its 500 font weight. Browser smoke checks assert the rendered order
and computed facts columns in both themes at 390px and 1280px. No case-study
research, metrics, outcome claims or image assets were changed; Mobile Insights
remains a shipped contribution. These tests do not establish screenshot parity.

## Client color and verified-delivery ownership (2026-11-01)
The global monochrome editorial palette remains neutral. The Work archive now
defines Hoylu blue, Alcon pink, and Holland America green directly in
`work-cards.css`; do not derive these from the theme-neutralized
`--palette-blue` or `--palette-pink`. The same `--file-accent` drives tabs,
hover highlighters, and contrast-mixed CTAs. Six redundant client/theme
highlighter declarations were removed from `stationery.css`.

Only projects whose reviewed `projectEvidence[title][2]` is exactly
`Shipped product contribution` receive the small text-labeled delivery
stamp. This includes **Hoylu Mobile Insights** and the two shipped Holland
America apps. No other project should receive that stamp without confirmed
delivery evidence. `scripts/check-content.mjs` guards the evidence condition;
Chromium smoke tests check the rendered labels, accents, and stamp at phone
and desktop widths in both themes. This does not establish screenshot parity
or a production deployment.

## Shared illustrative-placeholder ownership (2026-11-01)
The legacy `public/styles.css` has zero active rules. `visual-placeholders.css` now owns shared project-preview frame geometry and real-image cover cropping alongside the illustrative-brief frame; `wormµëMí¢G§²ÚîÆ­yİÙ•È½™½ÕÌ±¥Ù•Ì¥¸¹…Ù¥…Ñ¥½¸¹ÍÍ€¸	½Ñ ÕÍ”•á¥ÍÑ¥¹œ€´µ•‘¥Ñ½É¥…°µ…•¹Ñ€€¼€´µ•‘¥Ñ½É¥…°µ…Ñ¥½¸µ¥¹­€Ñ½­•¹Ì™½È±¥¡Ğ½‘…É¬½¹ÑÉ…ÍĞìµ½¹½¡É½µ”µ•‘¥Ñ½É¥…°¹ÍÍ€¹¼±½¹•È½Ù•ÉÉ¥‘•ÌÑ¡•Í”±¥¹­Ìİ¥Ñ €…¥µÁ½ÉÑ…¹Ñ€¸Q¡”½±™½Õ¹‘…Ñ¥½¸¡½Ù•È‰±½¬İ…Ì‘•……¹É•µ½Ù•¸Q¡”½¹±äÉ•¹‘•É•€¹Ñ•áĞµ±¥¹­€¥ÌÑ¡”‰½ÕĞ¥¹Ù¥Ñ…Ñ¥½¸ì¥ÑÌ•½µ•ÑÉä…¹¥¹Ñ•É…Ñ¥½¹Ì…É”…±É•…‘ä½İ¹•‰ä…‰½ÕĞ¹ÍÍ€°Í¼Ñ¡”‘ÕÁ±¥…Ñ”¡½µ•Á…”‘•±…É…Ñ¥½¹Ìİ•É”É•µ½Ù•¸]½É¬ÌÍ•Ñ¥½¸‘¥Ù¥‘•È¹½Ü±¥Ù•Ì¥¸İ½É¬µ…É‘Ì¹ÍÍ€°…¹‰½ÕĞ½A±…åÉ½Õ¹É•Ñ…¥¸Ñ¡•¥È¡½µ•Á…”‘¥Ù¥‘•ÉÌ¸M½ÕÉ”…ÍÍ•ÉÑ¥½¹Ì…¹¡É½µ¥Õ´¡½Ù•È¡•­ÌÁÉ½Ñ•ĞÑ¡¥Ì½¹Í½±¥‘…Ñ¥½¸¸=Á•¸AIÌ€ŒÄÜ°€ŒÄà°€ŒÈÌ…¹€ŒÔäİ•É”¹½Ğ¡…¹•¸U`¹…ÉÉ…Ñ¥Ù•Ì°¥±±ÕÍÑÉ…Ñ¥Ù”¥µ…”Á±…•¡½±‘•ÉÌ°…¹Ñ¡”Í¡¥ÁÁ•ÍÑ…ÑÕÌ½˜!½å±Ô5½‰¥±”%¹Í¥¡ÑÌÉ•µ…¥¸Õ¹Ñ½Õ¡•¸A…ÍÍ¥¹œ$‘½•Ì¹½Ğ•ÍÑ…‰±¥Í Á¥á•°µ±•Ù•°Ù¥ÍÕ…°Á…É¥Ñä½È‘•Á±½åµ•¹Ğ¸((ŒŒŒ€ÈÀÈØ´ÄÀ´ÌÄƒŠP‰½ÕĞ…¹¡½µ•Á…”‘•…µ…Í…‘”½¹Í½±¥‘…Ñ¥½¸()…‰½ÕĞ¹ÍÍ€½İ¹ÌÑ¡”‰½ÕĞÍ•Ñ¥½¸‘¥Ù¥‘•È…¹Ñ…‰±•Ğ¡•…‘¥¹œÍ…±”ÁÉ•Ù¥½ÕÍ±ä‘•±…É•¥¸¡½µ•Á…”µ‰…Í”¹ÍÍ€¸I•µ½Ù•Ñ¡”¡½µ•Á…”Ì½Ù•ÉÉ¥‘‘•¸A±…åÉ½Õ¹‘¥Ù¥‘•È°‰½ÕĞ™±•à½Á…É…É…Á ÉÕ±•Ì…¹•¹•É¥Œ™½½Ñ•È‰±½¬ìÁ±…åÉ½Õ¹¹ÍÍ€°…‰½ÕĞ¹ÍÍ€…¹¹…Ù¥…Ñ¥½¸¹ÍÍ€…±É•…‘ä½İ¸Ñ¡•¥ÈÉ•¹‘•É•ÍÑ…Ñ•Ì¸I•µ½Ù•Ñ¡”‰½ÕĞÁ½ÉÑÉ…¥ĞÌ¥¹•™™•Ñ¥Ù”™¥±Ñ•ÈÉ•Í•ÑÌ°…¸½Ù•ÉÉ¥‘‘•¸‘•Í­Ñ½À™±½…Ğ±…å½ÕĞ°É•Á•…Ñ•…ÁÑ¥½¸½Á¡½¹”İÉ…ÁÁ¥¹œ…¹ÍÕÁ•ÉÍ•‘•Á¡½¹”Qµ…É¥¸¸Q¡”•‘¥Ñ½É¥…°Í­¥¸½¹Ñ¥¹Õ•ÌÑ¼½İ¸Ñ¡”¥¹Ñ•¹Ñ¥½¹…°É…åÍ…±”Á½ÉÑÉ…¥ĞìÑ¡”É•ÍÁ½¹Í¥Ù”‰¥½É…Á¡ä°$¹½Ñ”…¹½¹Ñ…Ğ…Ñ¥½¸…É”Õ¹¡…¹•¸-••ÀÑ¡¥Ì½İ¹•ÉÍ¡¥À¥¹ÍÑ•…½˜É•ÍÑ½É¥¹œ±½‰…°½Ù•ÉÉ¥‘•Ì¸M½ÕÉ”¡•­Ì…¹¡É½µ¥Õ´$…É”É•ÅÕ¥É•ì¹•¥Ñ¡•È¥µÁ±¥•Ì‘•Á±½åµ•¹Ğ½ÈÁ¥á•°µ±•Ù•°Á…É¥Ñä¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠPM¡…É•ÁÉ½©•Ğµ•‘¥„µ½Ñ¥½¸½İ¹•ÉÍ¡¥À()İ½É¬µ…É‘Ì¹ÍÍ€¹½Ü½İ¹Ì¥µ…”é½½´°™Ñ•È!½ÕÉÌÁÉ•Ù¥•Ü±¥™Ğ°…É¡¥Ù”µ±¥¹¬±¥™Ğ°…¹Ñ¡•¥ÈÉ•‘Õ•µµ½Ñ¥½¸Õ…É‘Ì¸Q¡”½±ÁÉ•Ù¥•Ü¡½Ù•È½É•‘Õ•µµ½Ñ¥½¸ÉÕ±•Ìİ•É”É•µ½Ù•™É½´Á±…åÉ½Õ¹¹ÍÍ€ìÑ¡…Ğ½µÁ½¹•¹Ğ½¹Ñ¥¹Õ•ÌÑ¼½İ¸¥ÑÌ…±İ…åÌµ‘…É¬½±½ÉÌ…¹±…å½ÕĞ¸5•‘¥„µ½Ñ¥½¸½¹±äÉÕ¹Ì™½ÈÙ¥Í¥Ñ½ÉÌİ¡¼¡…Ù”€¨©¹½Ğ¨¨É•ÅÕ•ÍÑ•É•‘Õ•µ½Ñ¥½¸ì¡½Ù•Èµ½Ñ¥½¸…‘‘¥Ñ¥½¹…±±äÉ•ÅÕ¥É•Ì„™¥¹”Á½¥¹Ñ•È°İ¡¥±”­•å‰½…É™½ÕÌÉ••¥Ù•Ì„½ÉÉ•ÍÁ½¹‘¥¹œÁÉ•Ù¥•Ü…™™½É‘…¹”¸I•‘Õ•µµ½Ñ¥½¸Ù¥Í¥Ñ½ÉÌ­••ÀÍÑ…Ñ¥Œ½¹ÑÉ…ÍĞ°Õ¹‘•É±¥¹”…¹™½ÕÌµÉ¥¹œ™••‘‰…¬İ¥Ñ¡½ÕĞÑ¡”¥µ…”°™½±‘•È±…‰•°°½È…É¡¥Ù”ÍÕÉ™…”Í¡¥™Ñ¥¹œ¸Q¡”½É¥¥¹…°…ÁÁÉ½Ù•¥µ…•Ì°¥±±ÕÍÑÉ…Ñ¥Ù”‰É¥•™Ì°…¹…Í”µÍÑÕ‘ä•Ù¥‘•¹”É•µ…¥¸Õ¹Ñ½Õ¡•¸M½ÕÉ”¡•­ÌÁÉ½Ñ•Ğ½İ¹•ÉÍ¡¥À…¹¡É½µ¥Õ´Ñ•ÍÑÌ¡•¬É•‘Õ•µµ½Ñ¥½¸¡½Ù•È½™½ÕÌÑÉ…¹Í™½ÉµÌ¥¸‰½Ñ Ñ¡•µ•Ìì¹•¥Ñ¡•ÈÁÉ½Ù•ÌÁÉ½‘ÕÑ¥½¸‘•Á±½åµ•¹Ğ½ÈÁ¥á•°µÁ•É™•Ğ•ÅÕ¥Ù…±•¹”¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠP…Í”µÍÑÕ‘äµ½‰¥±”…Í…‘”…¹Ñ¡•µ”Ñ½­•¸½¹Í½±¥‘…Ñ¥½¸()Q¡”±•…äÁÕ‰±¥Œ½ÍÑå±•Ì¹ÍÍ€É•µ…¥¹Ì…¸¥¹…Ñ¥Ù”½µÁ…Ñ¥‰¥±¥ÑäÍÑÕˆ¸Q¡”™½Éµ•È…Í”µÍÑÕ‘ä‰…Í”½İ¹•ÍÑÉÕÑÕÉ…°‘•™…Õ±ÑÌ€¡¹½Ü½¹Í½±¥‘…Ñ•¥¸…Í”µÍÑÕ‘ä¹ÍÍ€¤ì…Í”µÍÑÕ‘ä¹ÍÍ€¡…Ì€¨©½¹”¨¨‘•™…Õ±Ğ…¹€¨©½¹”¨¨‘…É¬µÑ¡•µ”€¹…Í”µÙ¥•İ€Ñ½­•¸‰±½¬™½ÈÑåÁ½É…Á¡ä°½Ù•È°•Ù¥‘•¹”…¹É•…‘¥¹œÍÕÉ™…•Ì¸I•µ½Ù•ÍÕÁ•ÉÍ•‘•Á¡½¹”¡•…‘±¥¹”İÉ…ÁÁ¥¹œ°…±±•Éä½±Õµ¹Ì°É•…‘¥¹œµÍ¡••ĞÁ…‘‘¥¹œ°‘ÕÁ±¥…Ñ”¡…ÁÑ•ÈÍÁ…¥¹œ…¹‰ÕÑÑ½¸Ñ½Õ Ñ…É•ÑÌ°…¹É•‘Õ¹‘…¹Ğ‘…É¬¥±±ÕÍÑÉ…Ñ¥Ù”µ¡•É¼Á…¥¹Ğ¸Q¡”Í¡…É•¡…ÁÑ•È‰ÕÑÑ½¸ÍÑ¥±°¡…Ì„€ĞÑÁàµ¥¹¥µÕ´¡•¥¡Ğ°İ¥Ñ €ÄÁÁà¼ÄÉÁàÁ¡½¹”Á…‘‘¥¹œ…¹Ù¥Í¥‰±”­•å‰½…É™½ÕÌ¸Q¡”¥¹Ñ•¹Ñ¥½¹…°¥±±ÕÍÑÉ…Ñ¥Ù”‰É¥•™Ì°‰½Ñ Ñ¡•µ”Á…±•ÑÑ•Ì°ÁÉ½©•Ğ½Áä…¹Í¡¥ÁÁ•5½‰¥±”%¹Í¥¡ÑÌÍÑ…ÑÕÌ…É”Õ¹¡…¹•¸M½ÕÉ”¡•­ÌÁÉ½Ñ•ĞÑ¡”½¹Í½±¥‘…Ñ•‘•±…É…Ñ¥½¹ÌìÙ•É¥™ä…ÑÕ…°‰É½İÍ•È‰•¡…Ù¥½È…¹$‰•™½É”µ•É¥¹œ°…¹‘¼¹½Ğ¥¹™•ÈÁ¥á•°µ±•Ù•°Á…É¥Ñä½È‘•Á±½åµ•¹Ğ™É½´Í½ÕÉ”¡•­Ì¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠP…Í”µÍÑÕ‘ä•Ù¥‘•¹”…¹…±±•Éä…Í…‘”½İ¹•ÉÍ¡¥À()ÁÕ‰±¥Œ½ÍÑå±•Ì¹ÍÍ€É•µ…¥¹Ì…¸¥¹…Ñ¥Ù”½µÁ…Ñ¥‰¥±¥ÑäÍÑÕˆ¸Q¡”™½Éµ•È…Í”µÍÑÕ‘ä‰…Í”É•Ñ…¥¹•ÍÑÉÕÑÕÉ…°™…±±‰…­Ì€¡¹½Ü½¹Í½±¥‘…Ñ•¥¸…Í”µÍÑÕ‘ä¹ÍÍ€¤ì…Í”µÍÑÕ‘ä¹ÍÍ€½İ¹Ì•™™•Ñ¥Ù”•Ù¥‘•¹”µ…ÉÁ…¥¹Ğ…¹ÑåÁ”°…±±•ÉäÍÁ…¥¹œ…¹É•ÍÁ½¹Í¥Ù”•Ù¥‘•¹”…ÁÌ¸Q¡¥ÌÁ…ÍÌÉ•µ½Ù•½Ù•ÉÉ¥‘‘•¸½Ù•È½¥¹ÑÉ¼‘•±…É…Ñ¥½¹Ì°É•‘Õ¹‘…¹ĞÁ…É…É…Á Í¥é•Ì°…¹½µÁ•Ñ¥¹œ•Ù¥‘•¹”µ…É½±½ÉÌ…¹…ÁÌ¸Q¡”•Ù¥‘•¹”É¥ÍÑ…åÌÑ¡É•”½±Õµ¹Ì½¸‘•Í­Ñ½À…¹½¹”½¸Á¡½¹•ÌìÑ¡”…±±•ÉäÍÑ…åÌÑİ¼½±Õµ¹Ì½¸‘•Í­Ñ½À…¹½¹”½¸Á¡½¹•Ì¸¡É½µ¥Õ´¡•­Ì½Ù•È½µÁÕÑ••½µ•ÑÉä°ÍÁ…¥¹œ…¹Ñ¡•µ”ÍÕÉ™…•Ì…Ğ€ÌäÁÁà…¹€ÄÈàÁÁà¸!½å±Ô5½‰¥±”%¹Í¥¡ÑÌÉ•µ…¥¹ÌÍ¡¥ÁÁ•ì¹¼¹…ÉÉ…Ñ¥Ù•Ì°µ•ÑÉ¥Ì°•Ù¥‘•¹”°¥µ…•Ì½ÈÁ±…•¡½±‘•ÉÌ¡…¹•¸MÉ••¹Í¡½ĞÁ…É¥Ñä…¹ÁÉ½‘ÕÑ¥½¸‘•Á±½åµ•¹Ğ…É”¹½ĞÙ•É¥™¥•¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠP…Í”µÍÑÕ‘ä¡…ÁÑ•È½¹ÑÉ½±Ì…¹‘…É¬¡½Ù•È½¹ÑÉ…ÍĞ()…Í”µÍÑÕ‘ä¹ÍÍ€¹½ÜÉ½ÕÁÌ¡…ÁÑ•È‰ÕÑÑ½¸•½µ•ÑÉä°™½ÕÌ°Í•±•Ñ•µÍÑ…Ñ”Á…¥¹Ğ…¹µ½Ñ¥½¸¥¹ÍÑ•…½˜½Ù•ÉÉ¥‘¥¹œÑ¡•´±…Ñ•È¸Q¡”€´µ…Í”µ¡…ÁÑ•Èµ¡½Ù•É€Ñ½­•¸ÁÉ•Í•ÉÙ•ÌÑ¡”±¥¡ĞÁ…Á•ÈÑ¥¹Ğ…¹ÕÍ•Ì‘…É¬Á…Á•È¥¸¹¥¡Ğµ½‘”Ñ¼­••À±¥¡ĞÑ•áĞÉ•…‘…‰±”¸Q¡”€ĞÑÁàÑ…É•Ğ°¡½É¥é½¹Ñ…°Á¡½¹”ÍÑÉ¥À°™½É•µ½±½ÉÌ™½ÕÌÉ¥¹œ°ÍÑ¥­ä½™™Í•ÑÌ…¹•Ù¥‘•¹”µ™¥ÉÍĞ½¹Ñ•¹ĞÉ•µ…¥¸Õ¹¡…¹•¸M½ÕÉ”¡•­Ì…¹¡É½µ¥Õ´¡½Ù•Èµ½¹ÑÉ…ÍĞ…ÍÍ•ÉÑ¥½¹Ì½Ù•È€ÌäÁÁà¼ÄÈàÁÁà¥¸‰½Ñ Ñ¡•µ•Ì¸MÉ••¹Í¡½ĞÁ…É¥Ñä…¹‘•Á±½åµ•¹Ğ…É”Õ¹Ù•É¥™¥•¸5½‰¥±”%¹Í¥¡ÑÌÉ•µ…¥¹ÌÍ¡¥ÁÁ•¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠP…Í”µÍÑÕ‘ä…¹¹½Ñ…Ñ¥½¸…¹…±±•Éä½İ¹•ÉÍ¡¥À()Q¡”¥¹…Ñ¥Ù”ÁÕ‰±¥Œ½ÍÑå±•Ì¹ÍÍ€ÍÑÕˆ¡…Ì¹¼ÉÕ±•ÌÑ¼É•Ñ¥É”¸…Í”µÍÑÕ‘ä¹ÍÍ€¹½Ü½İ¹Ì¹•ÕÑÉ…°™…Ğ½¡¥¡±¥¡ĞÉÕ±•Ì°ÍÅÕ…É”ÁÉ½•ÍÌµ¹½Ñ”ÍÕÉ™…•Ì°…±±•Éä™É…µ”Í¥é¥¹œ½Á…¥¹Ğ°…¹…Í”µÙ¥•ÜÑ•áĞ¥¹¬ìµ½¹½¡É½µ”µ•‘¥Ñ½É¥…°¹ÍÍ€ÍÕÁÁ±¥•ÌÑ¡•µ”Ñ½­•¹Ì½¹±ä¸I•µ½Ù•É•‘Õ¹‘…¹Ğ±…Ñ”•‘¥Ñ½É¥…°½Ù•ÉÉ¥‘•Ì…¹½µ‰¥¹•É•Á•…Ñ•™…ÑÌÑåÁ½É…Á¡ä…¹¹½Ñ”µÉ…‘¥ÕÌ‘•±…É…Ñ¥½¹Ì¸Ù¥‘•¹”½É…Ñ¥½¹…±”¹½Ñ”­¥¹‘ÌÉ•Ñ…¥¸‘¥ÍÑ¥¹Ğ‰½É‘•È…•¹ÑÌ…¹Ù¥Í¥‰±”ÁÉ½Ù•¹…¹”­¥­•ÉÌì‘…É¬µÍÁ•¥™¥Œ¹½Ñ”ÍÕÉ™…•Ì°…ÁÁÉ½Ù•¥µ…•Éä°É•ÍÁ½¹Í¥Ù”½±Õµ¹Ì…¹Í¡¥ÁÁ•5½‰¥±”%¹Í¥¡ÑÌ½Áä…É”Õ¹¡…¹•¸IÕ¸Í½ÕÉ”¡•­Ì…¹¡É½µ¥Õ´¥¸‰½Ñ Ñ¡•µ•Ì‰•™½É”µ•É¥¹œ¸A…ÍÍ¥¹œ$‘½•Ì¹½Ğ•ÍÑ…‰±¥Í ÍÉ••¹Í¡½ĞÁ…É¥Ñä½ÈÁÉ½‘ÕÑ¥½¸‘•Á±½åµ•¹Ğ¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠP±½‰…°Ñ¡•µ”Á…±•ÑÑ”½İ¹•ÉÍ¡¥À()™½Õ¹‘…Ñ¥½¹Ì¹ÍÍ€¹½Ü½İ¹ÌÑ¡”Í¡…É•±¥¡Ğ½‘…É¬Á…±•ÑÑ”°¥¹¬°Á…Á•È°™½ÕÌ…¹¹½Ñ•‰½½¬µÁ¥¹¬Ñ½­•¹Ì¸ÍÑ…Ñ¥½¹•Éä¹ÍÍ€½İ¹Ì‘½ĞµÉ¥Ñ•áÑÕÉ”…¹•±•Ù…Ñ¥½¸ìµ½¹½¡É½µ”µ•‘¥Ñ½É¥…°¹ÍÍ€½İ¹Ì•‘¥Ñ½É¥…°…É½…Ñ¥½¸Á…¥¹Ğ…¹¥µ…”ÑÉ•…Ñµ•¹ÑÌ½¹±ä¸½Éµ•È±…Ñ”•‘¥Ñ½É¥…°±½‰…°½Ù•ÉÉ¥‘•ÌÍ¡…‘½İ•™½Õ¹‘…Ñ¥½¹Ì…¹‘¥Í…‰±•Ñ¡”ÍÑÉ½¹•È‘…É¬¡¥ µ½¹ÑÉ…ÍĞÍ•Á…É…Ñ½ÈÁÉ•™•É•¹”¸MÑ…¹‘…É±¥¡Ğ½‘…É¬Ñ½­•¸Ù…±Õ•Ì…É”ÁÉ•Í•ÉÙ•ì¡¥ µ½¹ÑÉ…ÍĞÁÉ•™•É•¹•Ì…¸¹½ÜÑ…­”•™™•Ğ¸]½É¬±¥•¹Ğ…•¹ÑÌÉ•µ…¥¸•áÁ±¥¥Ğ¥¸İ½É¬µ…É‘Ì¹ÍÍ€°¹½Ğ‘•É¥Ù•™É½´¹•ÕÑÉ…°Á…±•ÑÑ”…±¥…Í•Ì¸¡…¹”Í¡…É•Á…±•ÑÑ”Ù…±Õ•Ì¥¸™½Õ¹‘…Ñ¥½¹Ì°ÉÕ¸Í½ÕÉ”…¹¡É½µ¥Õ´$¥¸‰½Ñ Ñ¡•µ•Ì°…¹Ù•É¥™ä‘•Á±½åµ•¹ĞÍ•Á…É…Ñ•±ä¸9¼U`¹…ÉÉ…Ñ¥Ù•Ì°•Ù¥‘•¹”°¥µ…•Ì½ÈÍ¡¥ÁÁ•5½‰¥±”%¹Í¥¡ÑÌÍÑ…ÑÕÌ¡…¹•¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠP‰½ÕĞÉ•ÍÁ½¹Í¥Ù”…¹ÑåÁ½É…Á¡ä½¹Í½±¥‘…Ñ¥½¸()…‰½ÕĞ¹ÍÍ€¥ÌÑ¡”Í½±”½İ¹•È½˜‰½ÕĞÌ€ØÀÁÁàÁ¡½¹”±…å½ÕĞ°¥¹Ù¥Ñ…Ñ¥½¸Q…¹$µÁÉ½•ÍÌ¹½Ñ”ÍÁ…¥¹œ¸Q¡”¹½Ñ”ÌÁ…É…É…Á¡Ì¥¹¡•É¥ĞÑ¡”‰¥½É…Á¡ä™½¹ĞÍ¥é”°±¥¹”¡•¥¡Ğ…¹İÉ…ÁÁ¥¹œ™É½´€¹…‰½ÕĞ€¹…‰½ÕĞµ½ÁäÁ€ì½¹±äÑ¡•¥È¹…ÉÉ½İ•È€Ôá µ•…ÍÕÉ”¥ÌÍÁ•¥…±¥é•¸•Í­Ñ½À…¹Í¡½ÉĞµ±…ÁÑ½ÀÍÁ…¥¹œ¹½ÜÍ¡…É”Ñ¡•¥È•á¥ÍÑ¥¹œ€ÄÀÈÑÁàµ•‘¥„‰±½­Ì¸¡½µ•Á…”µ‰…Í”¹ÍÍ€¹¼±½¹•ÈÉ•Á•…ÑÌ‰½ÕĞÌ‰±½¬‘¥ÍÁ±…ä½ÈÑ¡”‘•…•µÁ¡…Í¥Ì½±½ÉÌÍÕÁ•ÉÍ•‘•‰äÑ¡”•‘¥Ñ½É¥…°Í­¥¸ìÑ¡”±½‰…°™½ÕÌÉ¥¹œ…¹‰½É‘•Èµ‰½à‘•™…Õ±ÑÌÍÑ¥±°…ÁÁ±äÑ¼Ñ¡”Q¸M½ÕÉ”…ÍÍ•ÉÑ¥½¹Ì…¹¡É½µ¥Õ´ÑåÁ½É…Á¡ä¡•­Ì½Ù•ÈÑ¡”Ñİ¼Ñ¡•µ•Ì…Ğ€ÌäÁÁà…¹€ÄÈàÁÁàìÍÉ••¹Í¡½ĞÁ…É¥Ñä…¹‘•Á±½åµ•¹ĞÉ•µ…¥¸Õ¹Ù•É¥™¥•¸U`•Ù¥‘•¹”°¥µ…”Á±…•¡½±‘•ÉÌ…¹!½å±Ô5½‰¥±”%¹Í¥¡ÑÌœÍ¡¥ÁÁ•ÍÑ…ÑÕÌİ•É”¹½Ğ¡…¹•¸((ŒŒŒ€ÈÀÈØ´ÄÄ´ÀÄƒŠP…Í”µÍÑÕ‘ä™…ĞÑåÁ½É…Á¡ä…¹¥±±ÕÍÑÉ…Ñ¥Ù”½Ù•È…Í…‘”()	•™½É”A…ÍÌ€ÄØ°…Í”µÍÑÕ‘äµ‰…Í”¹ÍÍ€É•Ñ…¥¹•ÍÑÉÕÑÕÉ…°‘•™…Õ±ÑÌ‰ÕĞ¹¼±½¹•ÈÍÕÁÁ±¥•„¡•…İ¥‘Ñ ½È¥¹¡•É¥Ñ•™…Ğ½±½ÉÌ½İ•¥¡ÑÌÑ¡…Ğ…É”…±İ…åÌÍÕÁ•ÉÍ•‘•¥¸Ñ¡”É•¹‘•É•…Í”Ù¥•Ü¸…Í”µÍÑÕ‘ä¹ÍÍ€¹½Ü¥Ù•ÌÑ¡”™…ÑÌœÍ¡…É•4M…¹Ì™…µ¥±äÑ¼Ñ¡•¥ÈÁ…É•¹Ğ°É•Ñ…¥¹Ì‘¥ÍÑ¥¹Ğ±…‰•°½Ù…±Õ”İ•¥¡ÑÌ…¹Í¥é•Ì°…¹­••ÁÌÑ¡”¥±±ÕÍÑÉ…Ñ¥Ù”¡•É¼Ì‘…Í¡•™É…µ”…¹½µÁ…Ğ¡•¥¡Ğ¥¸½¹”Í½Á•ÉÕ±”¸I•µ½Ù•…¸Õ¹ÕÍ•¡•É¼ÁÍ•Õ‘¼µ•±•µ•¹ĞÉ•Í•Ğ…¹É•‘Õ¹‘…¹Ğ¥µ…”µÍÑ…ÑÕÌÁ½Í¥Ñ¥½¹¥¹œè‰½Ñ µ•‘¥„½¹Ñ…¥¹•ÉÌ…±É•…‘ä¡…Ù”Á½Í¥Ñ¥½¸éÉ•±…Ñ¥Ù•€¥¸Ñ¡•¥ÈÍÑÉÕÑÕÉ…°½İ¹•ÉÌ¸…±±•ÉäÍ¥é¥¹œ°…ÁÁÉ½Ù•ÍÉ••¹Í¡½ÑÌ°­•å‰½…É™½ÕÌ°ÍÑ¥­ä¡…ÁÑ•È½™™Í•ÑÌ°±¥¡Ğ½‘…É¬½±½ÉÌ°…¹U`•Ù¥‘•¹”Ñ•áĞÉ•µ…¥¸Õ¹¡…¹•¸M½ÕÉ”¡•­ÌÕ…É½İ¹•ÉÍ¡¥Àì¡É½µ¥Õ´¡•­Ì½Ù•È™…ÑÌÑåÁ½É…Á¡ä…¹Ñ¡”•á¥ÍÑ¥¹œ¡•É¼½•Ù¥‘•¹”•½µ•ÑÉä¥¸‰½Ñ Ñ¡•µ•Ì…Ğ€ÌäÁÁà…¹€ÄÈàÁÁà¸MÉ••¹Í¡½ĞÁ…É¥Ñä…¹±¥Ù”‘•Á±½åµ•¹ĞÍÑ¥±°É•ÅÕ¥É”Í•Á…É…Ñ”Ù•É¥™¥…Ñ¥½¸¸(