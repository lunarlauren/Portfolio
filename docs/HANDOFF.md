# Portfolio developer handoff

## Dark media-frame edge contrast — Pass 39

Illustrative Work frames and case-study covers use a stronger dark-theme edge
(`#6F8498`, 4.72:1 against `#151515`). The shared frame owner is
`public/components/visual-placeholders.css`; CI checks the computed edge. The
reveal smoke check now respects whether About starts within the test viewport.

## Portfolio-making case study — Pass 38

The About section contains a keyboard-friendly disclosure with the portfolio's
design rationale, editorial type and notebook details, and light/dark brand
colors. Keep it in About; it is not a Work project or a header destination.

## Dark hero divider contrast — Pass 37

The homepage note border now uses the light dark-theme accent instead of the
low-contrast neutral rule. This keeps the transparent note readable against
the dark paper; the hero stylesheet URL has a fresh cache key. Commit is on
GitHub main; wait for the browser check before considering the pass verified.

## Accessibility and workflow audit — Pass 36

The homepage logo and secondary hero link now meet the 44px touch-target goal.
The decorative hero slash is hidden from assistive technology and uses the
theme-aware muted text color. The theme-toggle source check now reads the
button's opening tag, and related HTML/JS checks tolerate normal whitespace
while continuing to assert their actual accessibility and routing behavior.
Both changed stylesheet URLs use fresh cache keys.

## Dark case-study contrast — Pass 35

Case-study covers, fact cards, reading panels, process notes, chapter controls,
and illustrative image briefs now use the dark paper token for their surfaces
and light ink for their text. The global palette flips its navy token to light
ink in dark mode, so dark component surfaces should start from `--paper`.
Both affected stylesheet URLs use fresh cache keys.

## Header control target sizing — Pass 34

The desktop theme switch now has a 44×44px hit area, matching Contact and the
phone layout. This gives the icon control the same practical target size without
changing its circular shape. The navigation stylesheet cache key was advanced.

## Shared action shape and dark toggle contrast — Pass 33

The About contact action now uses the same `--editorial-action-radius` token as
the header and hero actions at desktop widths. The dark theme switch now uses
the dark paper surface with theme-aware ink for its idle state; its hover state
stays visible without turning into a pale control with a white icon. The two
changed stylesheet URLs use fresh cache keys so browsers receive the update.

## Interaction-script readability — Pass 32

`public/script.js` now uses consistent formatting and short section markers for
project-card rendering, case-study routing, header state, and optional motion.
The opening note points copy edits back to `content.js` and presentation edits
to component CSS. This is a source-only cleanup; interaction behavior is
unchanged. The script cache key was advanced.

## Project-content editing guide — Pass 31

The opening comment in `public/content.js` now gives designers a short map for
adding projects, editing case-study copy, replacing image briefs with approved
assets, and keeping claims evidence-based. It calls out the title-keyed lookup
maps in `script.js` and `components/project-content.js`, so renames do not
silently lose archive facts or highlights. The script cache key was advanced.

## Novice-friendly homepage source — Pass 30

`public/index.html` now uses consistent indentation for its metadata, style
links, navigation, homepage sections, and theme control. Short comments point
to the common edit locations: homepage copy in this file, project details in
`content.js`, and component styling in the matching CSS file. The early theme
setup stays before stylesheets to prevent a flash; behavior and page content
are unchanged. Use the visible sections as the editing map instead of adding
new layout rules to the legacy stylesheet.

## Desktop header alignment — Pass 29

The desktop header container now uses a single flex row with centered
cross-axis alignment and space-between placement. This keeps the wordmark on
the same vertical axis as the nav, Contact action, and theme toggle, and avoids
the stacked block layout that made the header nearly twice as tall. The phone
grid layout remains the responsive override. The navigation stylesheet cache
key was advanced; verify the desktop and mobile header after CSS changes.

## Dark hero-note contrast and live verification — Pass 28

The dark hero note was inheriting a near-white `--night-bg` fill because that
token is mixed from `--palette-navy`, which becomes white in dark mode. The
fill is now transparent and the note explicitly inherits the theme's high
contrast brand ink; its divider uses the shared line token. The hero stylesheet
cache key was advanced. Verified on the live Worker: the note is transparent
with light ink, action colors/radii match, and Work cards retain a square
top-left corner. Worker version `1c5d3d7c-3a51-46e4-a8d5-20eeb501e307`.

## Shared action styling and dark contrast — Pass 27

The primary Work link, desktop Contact action, and About invitation share a
3px editorial radius, 15px bold type, ink/paper resting colors, and the same
theme-aware hover colors. Their padding remains component-specific; the phone
Contact link stays text-only. Dark quiet-link ink now uses `--brand-ink` for
clear contrast against `--paper`, and dark header action focus uses the shared
`--focus` token. Work project cards have a square top-left corner and retain
their rounded remaining corners. Keep the theme and focus tokens shared when
editing these controls.

## Case-study chapter press motion — Pass 26

The chapter buttons' 2px pressed-state offset now shares the existing
`prefers-reduced-motion:no-preference` gate with case-study entrance motion.
Under reduced motion, the chapter buttons still change color and keep their
keyboard ring, but stay stationary on press. Keep interactive feedback that
moves a control inside the motion-enabled block.

## About invitation motion preference — Pass 25

The About invitation's 2px hover lift runs only for hover-capable devices when
the visitor has not requested reduced motion. Its reduced-motion rule disables
the transition property; it no longer needs a competing `transform:none`
override. Hover/focus colors and keyboard outline stay in the CTA's shared
interaction rule. Preserve this separation when changing the invitation.

## Static hero art cascade — Pass 24

`homepage-base.css` owns the art frame's shared `inset:0`; phone and desktop
rules no longer repeat it. `hero-polish.css` no longer resets `transform` on
the hero art: no loaded rule animates or moves that property. Portrait parallax
uses the independent `translate` property. Grayscale reveal and reduced-motion
filter timing remain unchanged. Keep transforms only if a real transform effect
is added, and update the stylesheet cache keys when changing either file.

## Homepage motion defaults — Pass 23

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

## Preference-aware project arrows — Pass 22

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



## Foundation typography and motion ownership — Pass 21

`foundations.css` now has one `:root` for palette, typography, and spacing,
plus one ordinary dark-theme token block. Headings inherit the shared
Newsreader/600 defaults; component files own only sizes and special treatment.
The `--type-paragraph` alias and duplicate hero/section font declarations
were retired. The archive title has no variable-font motion to transition;
the global reduced-motion rule already suppresses heading transitions.
Do not add another late root or dark palette block. Preserve UX narratives,
illustrative image disclosures, and shipped Hoylu Mobile Insights wording.
Source and Chromium checks are necessary; deployment is separately verified.

## Current case-study CSS ownership — Pass 16

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

## Motion media ownership — Pass 9

`work-cards.css` has a single fine-pointer, hover-capable,
`prefers-reduced-motion:no-preference` block for archive folder/tab lift and
linked project/Playground preview motion. Keep keyboard focus and default
transitions in their separate accessibility-aware rules.

`case-study.css` has one `prefers-reduced-motion:reduce` block governing
the chapter strip's scrolling, button transition, and routed case-study
entrance animations. When editing animation timing or chapter navigation,
test both themes and the reduced-motion setting. Do not merge media
conditions with different accessibility semantics merely to reduce file size.

## Selector ownership — Pass 10

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

## Programmatic focus versus keyboard focus — Pass 11

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

## Contrast and reduced-motion ownership — Pass 12

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

## Windows forced-colors focus and illustrated briefs — Pass 13

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

## Text reflow and long-content resilience — Pass 14

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

## Enlarged-text phone header and measured sticky offsets — Pass 15

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

## Opaque chrome and compositing efficiency — Pass 17

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

## Resource discovery and image priority — Pass 18

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

## Optimized About headshot and image-layout stability — Pass 19

The original `public/Headshot Lauren Leven.png` is a **2000 × 2000**
photograph and remains in Git unchanged as a browser fallback. The same
photograph was resized to 1024 × 1024 and exported as
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
and intrinsic dimensions. Chromium tests check that the WebP—not the PNG—is
fetched once and decoded, and hold the image response to compare image bounds
before/after load on phone and desktop. This is a local rendering test and
does not prove a deployed CDN cache outcome, LCP, or a field-measured CLS score.

## Visual regression screenshots — Pass 20

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
Edit the production-facing site in `public/`; obsolete root-level prototype files were removed and must not be recreated. `public/content.js` holds project narratives, constraints, evidence boundaries, outcomes, and planned imagery. `public/script.js` owns routing and archive cards. `public/components/project-content.js` owns case-study evidence, highlights, and facts; `public/components/case-study.js` renders case studies and chapter navigation. Their order in `public/index.html` matters: **content → project-content → case-study → script**.

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

Styles begin in `public/components/foundations.css`, then `public/components/homepage-base.css`, then the inactive `public/styles.css`; `public/components/case-study.css` owns all case-study structure and appearance. Client folder tabs use a shared dark-ink token (`--file-label-ink`) against blue, pink, and green accents; maintain at least **4.5:1 contrast** for the small tab labels in both themes. Prefer existing color and type tokens, preserve the stationery visual language, and check both light/dark modes. Avoid appending competing overrides to the base stylesheet. The responsive hero's typography, portrait sizing, and phone reading order are owned by `public/components/hero-polish.css`. The single `@media(max-width:600px)` block intentionally hides the redundant editorial note and decorative card chrome on phones; the note remains on larger screens. Avoid adding competing `styles.css` overrides. The About section's heading scale, biography measure/leading, and short-laptop typography now live in `public/components/about.css` (loaded after `styles.css`); avoid reintroducing About-specific type overrides into the legacy sheet. The short-viewport heading rule (`min-width:1024px`, `max-height:780px`) intentionally comes last so it wins the cascade. The Work section's two-column desktop heading, editorial title scale, supporting paragraph alignment, and short-laptop spacing now live together in `public/components/work-cards.css` (after the legacy sheet). Keep Work heading and section padding changes there. On phones (600px and below), the Work intro uses a 34–48px top gutter, a 2–2.375rem heading and a 20–28px handoff to the first archive card; the full UX-process summary stays visible. The 760px/600px archive rules are grouped once each in work-cards.css. Test 320/390/600px in both themes before release. The shared `.projects-grid` / `.play-grid` layout now lives in `public/components/homepage-base.css`; Work card geometry and focus styles live in `work-cards.css`; the old collection view is retired. Archive folders render as `.featured-project.client-file`: their eyebrow margins have one owner, dark file tokens share one theme block, and reduced-motion/hoverless cards share a stationary fallback. The numeric FILE labels are authored in `script.js`, not generated by CSS counters. Keep the documented challenge → role/delivery → approach scan order and verified shipped-status copy intact.


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
760px, 650px, 600px, 480px, and 420px breakpoint (17 scattered blocks → 5).
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
The professional archive in `public/script.js` renders title → project type →
challenge → reviewed contribution/delivery facts → documented design approach →
approved image or clearly labeled illustrative brief → case-study link. This
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
The legacy `public/styles.css` has zero active rules. `visual-placeholders.css` now owns shared project-preview frame geometry and real-image cover cropping alongside the illustrative-brief frame; `work-cards.css` no longer duplicates the base `.project-visual` selector. Work retains its neutral archive frame and actual CTA underline, while Playground retains its independent charcoal contrast. Border color on borderless Playground links, duplicate card `min-width`, repeated process ink and inherited link underline metrics were removed as ineffective declarations. `visual-placeholders.css` owns the shared illustrative-brief frame and one dark media fallback for both missing images and loading real images. The retired `--placeholder-surface` / `--placeholder-edge` custom properties were only used within that stylesheet; direct background/border declarations now avoid duplicated light/dark token overrides. **Keep the dark fallback after the light no-image rule** so its higher-specificity theme selector wins. Work's neutral `--surface-blush` paper, `--ink` disclosure and dashed `--line` frame belong together in `work-cards.css`; Playground retains its scoped charcoal and white labels. Work now owns the supplied-image border/glow as well; its more-specific illustrative brief retains the dashed edge, switching to solid for increased-contrast preferences. Synthetic Chromium checks cover shared dark fallback paint and Work's 4.5:1 brief/disclosure contrast at 390px/1280px in both themes. These are computed-style checks, not screenshot equivalence or deployment verification. Case-study evidence and shipped-status copy are unchanged.

## Shared case-study/gallery media ownership (2026-11-01)
The shared media component (public/components/visual-placeholders.css) now owns identical image cropping for project previews and case-study heroes, their dark loading/brief paint, and the illustrative-image status overlay. Project previews alone keep their image stacking layer. Case-study base owns hero frame geometry; case-study.css retains gallery layout, compact no-image hero geometry, and mobile height:auto image exceptions. Gallery images already inherit width and grid-item blockification from the shared frame, so redundant display:block and max-width:100% declarations were removed. Keep status-overlay provenance and Hoylu Mobile Insights' shipped status unchanged. Source checks and Chromium computed-style checks cover both themes at 390px and 1280px; screenshot equivalence and production deployment remain unverified.

## Archive text and color cascade (2026-11-01)
Work archive headings, metadata, challenge copy, approach labels and fact values now inherit the current theme ink from `foundations.css`, rather than receiving a second descendant-wide color override in `work-cards.css`. The shared paragraph rule no longer imposes muted ink: Playground sets its own readable night colors. Eyebrows still inherit `--muted`, client tabs keep `--file-label-ink`, and the case-study CTA keeps `--file-cta-ink`. The folder's positioning is owned by `.client-file`, while the glass surface remains on `.work .featured-project.client-file`. Client accent and typography tokens are defined before use, so redundant fallback branches were removed. The Chromium archive test checks these computed colors at 390px/1280px in both themes; it does not prove screenshot parity.

## Archive card CSS ownership (2026-10-31)
`work-cards.css` owns Work archive geometry, folder tabs, UX-process preview text, card lift and keyboard focus outline. `work-cards.css` also owns glass card backgrounds, borders, shadows and transition timing; the later `monochrome-editorial.css` supplies theme tokens; Work facts/focus now use the existing `--line` / `--focus` tokens directly, without duplicate aliases. Older Work declarations for those surfaces were removed because the editorial skin overrode them; do not reintroduce competing declarations. The Work file retains preview-brief geometry and responsive sizing, but no longer declares overridden per-client preview color tokens. Folder-tab motion is defined with its base label rule; redundant eyebrow typography, unused mobile h3 sizing, duplicated CTA tokens and duplicate reduced-motion resets are retired. The light-theme tablet card padding remains intentionally active at 761–1023px. Shared `visual-placeholders.css` owns generic missing-image fallback paint; Work owns the featured-image frame and the more-specific neutral/dashed brief treatment. Keep dashed placeholder frames and their explicit illustrative/approved-image-needed labels. Browser smoke tests must check opaque surfaces and readable process copy at 390px and 1280px in both themes. This cleanup does not change project narratives, provenance, or delivery status.

## Playground night cascade (2026-10-31)
`public/components/playground.css` owns the After Hours night heading, intro, and placeholder contrast in both page themes. The heading uses ordinary block-heading defaults instead of redundant visibility/opacity/height and `!important` resets. A scoped `.playground .project-card .project-visual:not(:has(img))` rule outranks the shared dark placeholder surface; the brief and kicker retain explicit light ink. The night introduction has one theme-independent rule rather than two identical light/dark selectors. Keep the shared placeholder disclosure labels and the project-card process text intact. Browser smoke tests check the actual heading/intro colors and a synthetic no-image brief at 390px and 1280px in both themes; this is not screenshot equivalence.

## Shared project-card motion ownership (2026-10-31)
`work-cards.css` now owns image zoom timing and its reduced-motion guard for both Work and After Hours; `work-cards.css` also owns glass-card surface transitions; `monochrome-editorial.css` supplies theme tokens. The shared metadata arrow keeps its distinct desktop hover and keyboard-focus offsets; its transform and transition are both disabled for reduced motion. `playground.css` keeps the night preview's transform-only hover lift and disables it for reduced motion. The previously conflicting hover shadow and an unused link transition reset were removed. Do not add project-image transitions back into the editorial skin or reintroduce the night hover shadow. Verify image placeholders, keyboard focus, and both themes before merging; CSS source checks and Chromium smoke tests are not pixel-level visual QA.

## Theme token ownership cleanup (2026-10-31)
`navigation.css` owns `--site-chrome-bg` and `--site-chrome-edge`; `stationery.css` owns `--notebook-paper` and light/dark dot colors. The editorial skin must not redeclare these late in the cascade. `monochrome-editorial.css` keeps card surface tokens with its theme variables and one full-color rule for project media. Unused editorial aliases were retired; Work now owns the archive grid gap and title typography. The redundant editorial body-dot reset was removed because stationery's theme-scoped body rules already win the cascade. Hero/About grayscale reveals remain intentional. Primary CTA colors now live in `monochrome-editorial.css` without `!important`; Contact and About actions own their colors in their component files. Verify chrome, paper dots, project color, keyboard focus, and CTA hover in both themes. Reconcile older PR #59 before merging it.

## Editorial action contrast tokens (2026-10-31)
`monochrome-editorial.css` defines `--editorial-accent` and `--editorial-action-ink` for light and dark modes. Primary, header, and About CTA hover/focus colors use these tokens; do not add a dark-only override: the earlier homepage `!important` base has been removed. Product imagery stays in color on touch devices via the later full-color rule, so the older duplicate touch-only filter was removed. Verify both themes and keyboard focus in a browser before merging; PR #59 contains an older competing editorial skin and must be reconciled rather than merged over this work.

## Editorial cascade consolidation (2026-10-31)
`public/styles.css` is an inactive compatibility stub. The owning `monochrome-editorial.css` keeps project/case-study imagery in color, with grayscale reveals limited to About and hero portraits. The Work glass-card surface and facts/focus use shared `--line` and `--focus` tokens for legible evidence and keyboard navigation. Shared paper-dot backgrounds use theme tokens. Preserve intentional image placeholders and Hoylu Mobile Insights as shipped; test both themes at phone and desktop widths.

## Final legacy paper migration and After Hours contrast (2026-10-31)
`public/styles.css` is intentionally retained as a small, versioned compatibility stub with **zero active CSS rules**. The light-paper heading positioning and transparent paragraph treatment now live in `public/components/stationery.css`, which loads after Playground. The Playground's more specific night-paragraph selector keeps its transparent background and light ink. `public/components/playground.css` now defines neutral charcoal and legible foregrounds directly; an escaped `\\n` sequence previously preceded a dead block of intended overrides. Keep those values consolidated in existing rules rather than appending another override tail. Chromium checks assert the section surface and intro color in both themes; they are not a pixel-level screenshot comparison.

## Legacy hero ownership consolidation (2026-10-31)
The legacy `public/styles.css` is now a compatibility stub; shared light-paper `.section-head` rules live in `public/components/stationery.css`. Hero-specific dark/light headline colors, artwork stacking, copy transparency and 420px description wrapping moved to `public/components/hero-polish.css`. The unframed portrait has explicit background and overflow treatments at both phone (≤600px) and tablet/desktop (≥601px) widths, making the legacy feature-card background/overflow redundant. Dark `.hero-foot` ink is unchanged; its span's inherited color requires no declaration. Keep Playground's more-specific contrast override and update the affected stylesheet cache keys in `public/index.html`. Validate both themes at phone/tablet/desktop widths before claiming visual parity.

## Hero notebook-note and phone CTA ownership (2026-10-31)
The notebook note's type, underline, optical alignment, dark variant, and 760px constraint now live in `public/components/hero-polish.css`; its 600px phone rule still hides the redundant note. The older phone rhythm rules were superseded by the portrait-first layout and removed from `public/styles.css`. Preserve the effective phone CTA `14px 20px` padding, centered alignment, and column action direction when removing overrides; moving declarations between files is not automatically behavior-neutral. Source checks guard ownership, but verify 320/390/600px and both themes in a browser before asserting visual parity.

## Hero responsive CSS ownership (2026-10-31)
The responsive hero breakpoints (950px, 760px, 650px, and 1024px) now live in `public/components/hero-polish.css`. The earlier desktop hero sizing and spacing in `public/styles.css` had been superseded by later hero-polish declarations; only the still-effective desktop illustration height was retained. The reduced-motion hover guard for the main CTA belongs in `homepage-base.css`, and the artwork hover guard lives with the hero. When adjusting the portrait, typography, or fold, edit the owning component and inspect 320px, 390px, tablet, and desktop layouts in both themes. The open portrait-first PR #17 and standalone-refresh PR #18 were not changed; reconcile them against current `main` before merging. Automated checks do not establish pixel-level visual parity.

## Navigation and responsive viewport ownership (2026-10-30)
The 82px sticky-header scroll offset and desktop 44px navigation link targets live in `public/components/navigation.css`. Case-study chapter headings have separate larger offsets in `public/components/case-study.css`. Touch targets for archive, generic text, and case-study links live in `work-cards.css`, `homepage-base.css`, and `case-study.css`. Noninteractive wrappers focused programmatically intentionally have no ring; actual links/buttons keep keyboard focus rings. Phone safe-area gutters live in `stationery.css`; tablet About padding lives in `about.css`. Do not reintroduce these mixed-purpose selectors into `styles.css`. Source checks do not prove rendered geometry, contrast, or deployment.

## Project grid and Work spacing ownership (2026-10-30)
To change how many project cards fit across a row, open `public/components/homepage-base.css` and find **SHARED PROJECT GRIDS**. The `auto-fit` rule adds columns when space allows, and the existing `max-width:760px` rule stacks cards on phones. The Work section's desktop padding and short-laptop adjustment live together at the top of `public/components/work-cards.css`. That file also owns archive card keyboard focus and phone-size card spacing. Do not add another copy to `styles.css`; the old duplicate mobile grid rule and mobile card-display override were removed. Verify archive and After Hours grids in both themes, at phone/tablet/desktop widths, before releasing.

## Small-label typography ownership (2026-10-30)
The shared uppercase `.eyebrow` labels (including high-contrast behavior) are defined once in `public/components/foundations.css`. The `.project-meta` card label and `.hero-foot` details live in `homepage-base.css`, while the `.brief-kicker` inside illustrative image placeholders lives in `visual-placeholders.css`. Work-specific card and client-tab adjustments stay in `work-cards.css`; mobile hero label sizing stays in `hero-polish.css`. The later `navigation.css` owns navigation text size. These replace competing legacy typography declarations. To edit a label, search for its class in the owning file; do not add a new override in `styles.css`. Verify both themes, narrow screens, and browser zoom before release.

## Retired collection gallery (2026-10-31)
The homepage renders professional case-study cards directly under `#work`; it does not mount the former company collection chooser. Removed its unused navigation, header, gallery animation, dark-mode, and reduced-motion selectors from `work-cards.css`, plus orphaned base header/close-button rules from `homepage-base.css`. Keep active `.project-card-link` focus, metadata-arrow feedback, `#work-title` programmatic focus, and Playground cards. If collection browsing is intentionally rebuilt, introduce new markup and keyboard/navigation tests rather than restoring old CSS by default. Open PR #59 contains an older editorial layer; reconcile it before merging. No project narratives, UX evidence, shipped statuses, or illustrative image placeholders changed.

## Playground CSS ownership (2026-10-30)
The always-dark **After Hours / Playground** section now lives in `public/components/playground.css`, loaded immediately after legacy `public/styles.css`. It owns the night surface, section title, placeholder contrast, project process text, responsive layout, keyboard focus color, and full-height card behavior. The shared project-card foundations and archive styles remain in `homepage-base.css` and `work-cards.css`; shared Work/Playground link affordances live in component stylesheets. Playground loads before stationery; its more-specific night-paragraph selector intentionally wins over the generic light-paper heading rule. The old sparkle button, its keyframes, and its decorative span styles were removed because no markup or script renders them. Do not recreate that interaction without adding accessible markup and behavior. `scripts/check-content.mjs` checks ownership and stylesheet ordering; browser checks must still verify both themes and phone widths.

## Notebook surface ownership (2026-10-30)
`public/components/stationery.css` owns the light and dark full-page dot grids, their shared step token, and the transparent homepage section surfaces. The older ruled-paper layer and desktop margin-line override in `public/styles.css` were superseded by the later dot-grid reset and have been removed. Keep `--notebook-paper`, `--notebook-pink`, and `--notebook-dot-*` in stationery rather than restoring texture tokens in legacy CSS. The hero's note and desktop footer layout remain in their existing component/legacy rules; do not conflate those with the page background. When editing the texture, update both stylesheet cache versions in `public/index.html` and check the background in light/dark themes at desktop and phone widths. Source assertions in `scripts/check-content.mjs` guard this ownership; they are not a visual comparison.

## About CSS ownership (2026-10-30)
The removed inventory left unused rules in `public/styles.css`, `public/components/about.css`, and `public/components/stationery.css`. Those rules and the unused `public/components/inventory.js` are retired. Keep About column width, portrait, biography, AI note, CTA, and compact-laptop spacing in `public/components/about.css`; `public/styles.css` should not regain inventory selectors or About grid overrides. The homepage reveal selector in `public/script.js` no longer includes the removed component. `scripts/check-content.mjs` and `tests/smoke.mjs` guard the mobile reading order and absence of the removed inventory; the desktop biography/AI and portrait now form a two-column introduction. Light/dark color tokens remain shared. Verify browser geometry in both themes and at phone widths before asserting visual parity.

## Portrait assets
The homepage hero deliberately uses `public/laurenlevenportfolioheroportrait.png` (the illustrated 3D portrait) to communicate visual craft. The About biography uses the separate `public/Headshot Lauren Leven.png` photograph, referenced as `/Headshot%20Lauren%20Leven.png` in `public/index.html`. Keep both images distinct when editing: About introduces the actual designer, while the hero expresses the illustrative identity. The About figure, caption, responsive sizing, and lazy-loading behavior are owned by `public/components/about.css` and `public/index.html`. The large original headshot remains a fallback; the responsive About image now delivers the optimized WebP derivative in supporting browsers. Neither portrait is product evidence or a case-study image placeholder.

## Mobile About editorial layout
On phones (≤600px), `public/components/about.css` keeps the About heading deliberately smaller than the hero statement. It uses the available text width rather than a fixed `12ch` maximum, which previously caused extra lines even on standard phones. The real headshot floats to the **left** of the first biography paragraph, which wraps naturally beneath it, rather than appearing as a detached centered square. The portrait uses a modest rounded crop; its redundant caption is hidden **only on phones**, where the adjacent sentence already introduces Lauren. Desktop still shows the caption. **The About introduction now uses two desktop columns**: biography and AI note on the left, real headshot on the right. On phones it returns to one reading column. Do not restore the retired interactive inventory or its script/styles. The biography, AI process note, and contact CTA flow in document order. Preserve the full-size photo source and its factual alt text. The biography is concise and describes Lauren's approach; do not expand it into unverified research or impact claims. `scripts/check-content.mjs` guards the one-column layout and absence of obsolete inventory code. Check narrow phones, long text, and both themes visually before claiming visual validation.

## Hero interaction hierarchy
The hero intentionally has no decorative star button: it added a keyboard stop without helping visitors understand UX work. Keep the illustrated portrait noninteractive and preserve the primary **Explore my work** link to the case-study archive. The stationery textures remain decorative in both themes. `scripts/check-content.mjs` guards against reintroducing the unused sticker markup, animation listener, or CSS.

## Phone hero spacing and content hierarchy
At widths ≤600px, `public/components/hero-polish.css` owns the headline → noninteractive 3D portrait → concise explanation → primary **Explore my work** link. The headline has a slightly looser line height and a dedicated gap before the portrait; the portrait is intentionally a little smaller to preserve negative space around its silhouette. Keep the explanatory paragraph short—the projects themselves show the industries and UX process—and use a **content-sized**, at least 48px-tall CTA rather than a full-width pink bar. Keep the illustration visible within the first phone viewport at 320px and 390px if possible without collapsing the type scale. The test contract is in `scripts/check-content.mjs`, with rendered geometry checks for both themes in `tests/smoke.mjs`. The workstation illustration in the hero and real About photograph remain distinct. Do not claim live-site visual verification from static assertions or automated Chromium alone.

## Progressive reveal safety
The homepage's section entrance animation in `public/script.js` is enhancement only. `initReveals()` must check that `IntersectionObserver` is a **callable constructor**, not merely a property on `window`, before applying `reveal-ready` to Work/About content. If the API is absent, non-callable, or reduced motion is requested, content stays visible without an entrance effect. The source check and Chromium smoke test cover the present-but-undefined API case. This preserves access to the UX case-study archive in limited browsers; it is not a substitute for live visual or screen-reader testing.

## Light/dark theme behavior
The inline controller near the end of `public/index.html` sets `data-theme`, `color-scheme`, the toggle's accessible state, and mobile browser `theme-color` together. The toggle has a **stable accessible name, “Dark theme,”** while `aria-pressed` alone announces whether dark mode is active; its hover title may describe the next action. Do not switch the accessible name between “Switch to dark” and “Switch to light” while also using `aria-pressed`—that creates contradictory toggle announcements. A stored `portfolio-theme` choice wins over OS preference; without one, the page follows live OS color-scheme changes. The `storage` listener synchronizes changes across open tabs, including a cleared preference. Keep these states paired and preserve the dependency-free behavior checks in `scripts/check-content.mjs`. This is source-level coverage, not visual or screen-reader verification.

## Dark chrome continuity
The sticky header and full-width footer use the shared `--site-chrome-bg` token defined in `public/components/navigation.css`. In dark mode it **must equal `--paper`**, not a separate blue-mixed swatch: the former created a conspicuous bright band above the dark dotted hero. Keep the chrome opaque so scrolled content cannot show through, and retain the subtle `--site-chrome-edge` separator. `tests/smoke.mjs` checks computed dark header/footer colors against the body background; the light notebook-paper chrome remains unchanged. Refresh the `styles.css` version in `public/index.html` after changes, especially for Safari caches. This does not establish that Cloudflare deployed the commit.

## Header navigation and Contact semantics
The Work/Playground/About links are in-page locations and may use `aria-current="location"`. **Contact is a `mailto:` action, not a section**: near the footer, `public/script.js` sets `data-section-active` solely to preserve its underline in `public/components/navigation.css`. Do not give the email link `aria-current`; `tests/smoke.mjs` checks the visible underline and the absence of misleading accessibility state. At the end of a tall About layout, the CTA may already have scrolled above the viewport; the Contact underline still appears once About is the active section and the visitor reaches the page end. This is visual feedback only, never `aria-current`. When `routeWithMotion()` changes the URL through `history.pushState`, it emits `portfolio:route` after rendering because native `hashchange` and `popstate` do not fire for that action. The header scrollspy listens for this event and schedules its normal debounced state update. Keep the event and listener paired; browser smoke coverage checks the About → case-study transition.

Case-study links use delegated same-tab SPA navigation only for ordinary clicks. A `target="_blank"` link, named browsing context, `download` attribute, or modifier-key click must retain native browser behavior; the in-memory return-focus target should likewise be recorded only for ordinary same-tab navigation. `scripts/check-content.mjs` exercises the delegated handler and `tests/smoke.mjs` opens a real Chromium tab to catch regressions.

## Archive card accessibility
Professional project cards use a concise `aria-labelledby` (project title + case-study action). Their `aria-describedby` references the challenge summary, the visible **Design approach** teaser when one exists, and—only when reviewed `projectEvidence` exists—the role/delivery definition list. Every target ID is derived from the unique group/index card ID. Independent cards without reviewed facts must omit the facts target; cards without a process teaser must omit the process target. Never insert empty or dangling description IDs. Update `scripts/check-content.mjs` when changing this relationship. These checks validate generated markup, not actual screen-reader announcements.

## Routed metadata and sharing previews
The static homepage's title, canonical URL, description, Open Graph tags, and Twitter tags originate in `public/index.html`. On case-study navigation, `public/components/case-study.js` temporarily sets project-specific values. `public/script.js` snapshots the homepage values before routing and restores them when visitors return to Work, About, or another homepage section. Keep this restoration paired with any future metadata fields; otherwise Back navigation can leave a previous project's preview on the homepage. The Chromium smoke test compares the restored tags to the actual homepage markup rather than hard-coding editorial copy. Client-side updates do **not** guarantee that social crawlers see case-study-specific previews; that would require server-rendered metadata.

**Unknown case-study deep links:** `public/script.js` resolves missing or renamed `/case-studies/...` paths to the Work archive and replaces the stale address with `/#work` (not a new history entry). This prevents the homepage from appearing under an invalid project URL; it is an archive fallback, not an HTTP 404. Keep this behavior aligned with `scripts/check-content.mjs` route assertions. A true 404 response would require server-side routing.

Case-study chapter progress uses `IntersectionObserver` where available. In browsers without it, `public/components/case-study.js` uses passive scroll/resize listeners throttled to one animation frame, with the same reading-position threshold. The home-route branch in `public/script.js` disconnects the observer **and** removes fallback listeners when the case study is hidden; a new case render also cleans up previous tracking. The fallback retains its pending animation-frame ID and **cancels that frame on cleanup**, since removing listeners alone cannot stop a queued update. Only use `IntersectionObserver` when it is a callable constructor. Keep these lifecycles paired so hidden chapters cannot update the active tab. `tests/smoke.mjs` exercises the no-observer path, a queued-frame cancellation, and listener cleanup.

**Mobile Insights editorial boundary:** The shipped product contribution is confirmed. Its archive summary leads with the small-screen information-hierarchy challenge, then identifies the UX/UI contribution and verified shipped status; this is design framing, not a claim of user testing. The portfolio does not establish that a desktop dashboard was ported, which exploratory interaction states reached production, or how the feature performed after launch. Keep the archive summary centered on the documented mobile UX/UI focus (readable insight hierarchy and supporting context); keep the outcome explicit about delivery versus unavailable engineering and usage evidence. `scripts/check-content.mjs` guards this distinction.

## Unsupplied case-study hero visuals
A missing approved product image remains an explicit editorial brief, never a fake screenshot. `public/components/case-study.css` keeps **brief-only** covers compact (220–320px minimum on desktop; 200–240px on phones, growing with text), so the challenge and UX process appear sooner. Real image covers retain their original full-height sizing. Do not remove or relabel the brief, and do not apply the compact treatment to supplied imagery. `tests/smoke.mjs` checks brief provenance, desktop/phone geometry, and text overflow in Chromium; this is not a production visual review.

## Case-study cover design approach
Professional case studies with an explicitly authored `archiveApproach` in `public/content.js` now show a short **Design approach** line inside the cover, immediately after the challenge summary and before the image placeholder or approved visual. `caseApproachMarkup` in `public/components/project-content.js` escapes that text and returns nothing if it is missing; do not auto-generate a method, research claim, or outcome from other fields. The renderer is `public/components/case-study.js`; `public/components/case-study.css` owns the shared responsive, light/dark layout. This is an orientation teaser, not a replacement for the fuller process, evidence, tradeoffs, and learning chapters. Keep the existing illustrative-image disclosures and Mobile Insights' shipped status. `scripts/check-content.mjs` guards the markup and source order; browser and screen-reader behavior still need manual verification.

## Editorial and UX evidence rules
Each professional case study should make **context/problem, intended audience and constraints, actual role, evidence/discovery where documented, explorations and rationale, implementation/collaboration when verified, and outcomes or learning** easy to find. The source check requires `audience`, `constraints`, `evidence`, and `tradeoffs` for every professional project; an evidence note may explicitly say that research or metrics are unavailable. If a fact is missing, say so; do not manufacture interviews, iterations, tests, conversion metrics, or launch claims.

Case-study facts now include **My role**, sourced from the reviewed second value in `projectEvidence` (`public/script.js`), alongside discipline, audience/scenario, and constraints. Keep that label aligned with the verified scope in `public/content.js`; it is not a license to expand a contribution into project ownership. Unknown projects omit the role rather than invent one.

The Work archive shows **The challenge → My contribution → Delivery → Design approach** before the case-study link. `public/script.js` normally takes the first sentence of each project's `process` for its approach teaser. When that opening is a rhetorical question or context rather than a design action, set an optional, reviewed `archiveApproach` in `public/content.js` instead. Keep it a faithful summary of the documented `process`—never a new claim about research, tested iterations, or results. The source check exercises both the override and fallback. The archive's layout and labels live in `public/components/work-cards.css`. The entire project card is a link; its accessible name comes from the project heading plus “Read the case study,” and its description comes from the challenge summary. Keep those stable `aria-labelledby`/`aria-describedby` references if changing card markup, rather than adding a generic `aria-label` that masks the editorial context. `scripts/check-content.mjs` exercises professional and independent cards.


The case-study cover highlights are authored separately in `public/components/project-content.js` (`caseHighlights`). Prefer a documented input and concrete design execution over generic project context when the record supports it. Connected Planning's overview/detail balance and Motion & Storytelling's short visual beats are **design rationale**, not verified usability findings or proof of a finished animation; the source checks guard those boundaries. Navigator's passenger Wi-Fi feedback and booking/account prototyping are supported by its `evidence` field in `public/content.js`; this is **not** a claim of formal interviews, usability testing, or measured outcomes. The Navigator `process` paragraph now names the prototyped flows and visual Wi-Fi guidance explicitly, while distinguishing those design artifacts from unknown engineering handoff details and release-specific UI. Do not describe an individual prototype state as shipped without approved implementation evidence. Keep the highlight assertions in `scripts/check-content.mjs` aligned with that evidence. For the patient portal, distinguish confirmed UX/UI work on both practice setup and patient-facing information from unverified adoption or shipping. For the shipped Stateroom TV app, name the Voyage Tracker contribution directly, while treating remote-first navigation and viewing-distance readability as design focus—not measured usability findings.

Campaigns & Events cover highlights now distinguish the **format tradeoff** (distance-readable booth wall versus presentation detail) from the actual signage/presentation/campaign design contribution. The 65-inch and 40-inch display context is documented in `content.js`, but no event performance data is established. AI-Assisted IOL Planning cover highlights describe **information provenance** and the intended handoff to patient files/connected tools as UX rationale; do not present a specific UI labeling pattern, clinical validation, deployment, or patient outcome as verified. Keep both sets of cover assertions in `scripts/check-content.mjs` aligned with the evidence notes.

The case-study chapter index exposes **Evidence & tradeoffs** as a separate reading destination when evidence or tradeoff notes exist. Keep the notes grounded in `public/content.js`; do not add a chapter to imply undocumented research. Chapter numbering, focus, and horizontal reveal of the active chapter are generated in `public/components/case-study.js`. Automatic chapter tracking updates `aria-current` without scrolling the horizontal tab strip, even when the active chapter changes; only explicit chapter selection and initial render reveal the active tab. This prevents the reading-progress observer from pulling a manually browsed tab strip away from the reader. Keep the executable state-helper regression in `scripts/check-content.mjs` alongside this behavior. Optional process and evidence chapters are numbered from the sections actually rendered; keep `processNotesMarkup` in `project-content.js` and the outcome heading in sync. The browser smoke test covers missing optional chapters. The phone tab strip intentionally has **no one-sided gradient mask**: it previously faded a chapter and its focus indicator. Evidence notes use `data-note-kind="evidence"` and design-tradeoff notes use `data-note-kind="rationale"` in `public/components/project-content.js`; `public/components/case-study.css` gives them distinct, theme-aware notebook rules. The visible headings—not border color—carry their meaning. Each annotation now also has a visible, text-based qualifier: **Evidence status** identifies what the available material can support, while **Design reasoning · not test evidence** explicitly separates rationale from validated findings. These labels are rendered by `processNotesMarkup` in `project-content.js` and styled in `case-study.css`; preserve them in both themes and when editing notes. Do not treat a design rationale as validated research or imply evidence beyond the supplied copy. The production one-row mobile header lives in `public/components/navigation.css` (loaded after legacy header rules in `styles.css`); sticky chapter offsets live in `public/components/case-study.css`.

The case-study gallery's accessible group label also distinguishes supplied image entries from visual briefs: image-only galleries are announced as image galleries, mixed content as images and briefs, and placeholder-only galleries as visual briefs and image placeholders. This label is presentation metadata, not a shipping or research claim. Update the browser assertion if approved gallery assets are later supplied. Gallery rendering now uses the larger of `gallery` and `galleryBriefs` lengths, so adding one approved image does not silently remove remaining editorial brief slots. Keep the mixed-gallery accessible label accurate while replacing assets.

Image placeholders disclose their evidence status in the visible kicker: **ILLUSTRATIVE** is proposed explanatory artwork, **PLANNED** has not been supplied, **APPROVED PRODUCT IMAGE NEEDED** requests a real approved asset, and **PROTOTYPE** is not a shipped screen. The shared classifier lives in `public/components/project-content.js` and is used by archive/gallery cards and case-study heroes. Do not remove those distinctions when replacing placeholders. When an `ILLUSTRATIVE /` brief receives an image file, its visible **ILLUSTRATIVE VISUAL · NOT A PRODUCT SCREENSHOT** label stays on the archive/gallery image and case-study hero. If the file is instead an approved real product screenshot, update the brief and alt text at the same time; do not let a stale illustrative brief mislabel real evidence. The status helper is `illustrativeImageStatus` in `project-content.js`, with styling in `case-study.css`.

The case-study cover now repeats **verified shipped status** as a compact editorial stamp, derived exclusively from the third `projectEvidence` value in `public/script.js`. The helper is `deliveryStampMarkup` in `public/components/project-content.js`; only the exact reviewed value `Shipped product contribution` gets a stamp. Do not label a concept, design contribution, or prototype as shipped. Styling lives in `public/components/case-study.css` and uses cover tokens for both themes.

**Hoylu Mobile Insights is shipped**; preserve that in its content, archive card, and project overview. An illustrative Mobile Insights mockup is **not** a screenshot of the shipped product. Keep `ILLUSTRATIVE /` or `PLANNED /` labels on speculative art briefs. Navigator and Stateroom TV request approved real imagery; do not silently replace those requests with generated screenshots. Confirm ownership and permission before publishing client assets.

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
| Case-study structure and reading typography | `public/components/case-study.css` |
| Retired compatibility stub (no active declarations) | `public/styles.css` (do not add new rules) |
| About portrait size and mobile layout | `public/components/about.css` |
| Header and navigation appearance | `public/components/navigation.css` |
| Work cards and folders | `public/components/work-cards.css` |
| Case-study page appearance | `public/components/case-study.css` |
| Theme and stationery styling | `public/components/stationery.css` |

**Safe editing recipe:** Change one thing; keep a copy of the old value; check a narrow phone width and a desktop width in both themes; run the repository tests; commit only when CI passes. A passing syntax check is **not** a passing browser test. Do not change project outcomes or claim user testing without evidence.

**CSS rule of thumb:** Search for a selector across component stylesheets before editing. `public/styles.css` is a 132-byte compatibility stub with no active rules; later-loaded components can still override one another. Edit the authoritative component rather than adding a competing late override. Keep comments about *why* a rule exists, not a narration of every CSS property.

**Portrait ownership:** `public/index.html` uses `/laurenlevenportfolioheroportrait.png` in the hero and the separate `/Headshot%20Lauren%20Leven.png` photograph in About. The hero illustration is a noninteractive visual panel, not a featured-project link. At phone widths (≤600px), `public/components/hero-polish.css` uses `display: contents` on the generic `.hero-copy` wrapper to place the portrait immediately after the headline. The portrait panel has no links or buttons; the single visible primary CTA follows the short introduction in visual and keyboard focus order. The decorative orbit, tiles, badge, caption, and redundant note are hidden on phones only. The component's one phone media block replaces several overlapping historical overrides; keep future changes there and update the structural assertions in `scripts/check-content.mjs`. The About crop/layout belongs to `public/components/about.css`; preserve the actual headshot there and the illustrated hero above.

## CSS cleanup progress

`public/styles.css` is now a comment-only compatibility stub. Further consolidation should target duplicated component rules, preserve the established stylesheet load order, and verify computed styles, mobile overflow, dark mode, and browser smoke tests.

### Homepage CSS extraction

`homepage-base.css` owns homepage grids, hero actions, section typography, and entrance motion. Shared Work/After Hours card structure and image geometry now belong to `work-cards.css`, while `monochrome-editorial.css` supplies theme tokens; Work image-frame paint belongs in `work-cards.css`. The mobile 260px `.project-visual` height was dead because a later `height:auto` won the cascade; it was retired. Validate computed styles before further consolidation.

### Case-study base extraction

Historical note: the original case-study layout once lived in `case-study-base.css`; Pass 16 consolidated its live declarations into `case-study.css` and retired the redundant request. Preserve computed desktop/mobile geometry and theme paint when editing.

### Hero illustration and retired legacy CSS

The old hero portrait/speech-bubble implementation was removed from `public/styles.css`. The current hero uses the approved 3D illustration inside a featured-art frame on desktop; phones present the same asset without the card chrome, immediately after the headline. Responsive sizing and phone content order are owned by `public/components/hero-polish.css`. The About portrait remains independently styled in `public/components/about.css`. Keep the hero image's alt text meaningful, and avoid reintroducing redundant clickable links around the visual. Dark-mode token declarations overridden later in the same stylesheet have been pruned; theme overrides elsewhere still need browser QA before broader merging.

### Theme token consolidation

The legacy stylesheet now keeps the final notebook margin values in its first notebook token block, and the final dark-mode focus/muted/line values in the main dark-theme block. `--site-chrome-edge` inherits `var(--line)` in both themes; only the dark chrome background needs its own override. Continue to keep the CSS load order unchanged until visual regression checks are complete.

### Typography tokens (rem)

The canonical type scale is in `public/components/foundations.css`: `--type-h1`, `--type-h2`, `--type-h3`, `--type-paragraph`, `--type-eyebrow`, `--type-lead`, `--type-body`, `--type-sm`, and `--type-xs`. Display and body font families are `--font-display` and `--font-body`. Semantic `h1`/`h2`/`h3`/`p`/`.eyebrow` defaults use low-specificity `:where()` rules so existing page-specific typography remains intact. Font-size declarations using `px` were converted to equivalent `rem` values (16px = 1rem), including clamp endpoints; responsive viewport units were retained. Some legacy `font` shorthand declarations and other non-font measurements still use px and should be audited separately. Test heading wrapping, navigation, case studies, and text zoom in both themes before treating the migration as fully verified.

### Portfolio image dimensions

Prepare project card and gallery thumbnail artwork at **1600 × 1000 pixels (16:10)**. The `.collection .project-visual` and featured project image frames use a shared 16:10 aspect ratio across breakpoints. Images use `object-fit: cover`, so keep essential UI and text away from crop edges. Text-only placeholder visuals intentionally remain content-sized. Full case-study screenshots may retain their native aspect ratios to preserve legibility.

### Canonical homepage links from case studies

Header navigation, the wordmark, footer Back to top, and generated case-study return links use absolute homepage hashes (for example, `/#work`). This is intentional: a relative `#work` opened in a new tab from `/case-studies/…/` would reopen that case-study URL instead of the Work archive. The router intercepts **only ordinary same-tab clicks** on these anchors while a case study is visible; modified clicks, `target` links, and downloads retain native browser behavior. The homepage hero's `#work` CTA remains relative because it is only visible on the homepage. The header scrollspy reads the link's `.hash` rather than using its full `href` as a CSS selector. If changing link URLs, update `tests/smoke.mjs` and verify browser Back/focus restoration and both themes.

## Archive gallery CSS ownership
The retired `.collection` gallery must not return. Professional case studies render directly in the Work archive, with evidence-first reading order and explicit image briefs until approved assets are available. Keep responsive card geometry in `work-cards.css`, shared placeholder colors in `visual-placeholders.css`, and dark-mode tokens in `monochrome-editorial.css`.

## Shared visual-placeholder CSS ownership (2026-10-30)
`public/components/visual-placeholders.css` loads immediately after legacy `styles.css` and owns common no-image project-card treatments, brief typography, theme colors, and high-contrast borders. Approved images still use `homepage-base.css`; archive/client-file exceptions live in `work-cards.css`, the always-dark Playground in `playground.css`, and case-study hero/gallery sizing in `case-study.css`. Briefs are editorial placeholders, not fabricated product screenshots. The shared background/text no longer uses `!important`, allowing client-file preview tokens to take effect in both themes. Legacy case-hero placeholder rules remain a separate extraction target. Source tests check ownership and order; verify browser layout and contrast at phone widths before claiming visual parity.

## Case-study CSS ownership (2026-10-30)
Reading sheet geometry, evidence panels, cover text and chapter hover/focus surfaces have consolidated component rules. The retired light-only `.case-prose` rule was fully superseded by `.case-view .case-prose`; the shared hover/focus background still adapts to both themes and focus retains an underline. Preserve responsive sticky offsets and illustrative briefs. Validate source and Chromium checks before merging; these do not prove screenshot parity.

Case-study hero image briefs, responsive case-gallery/body rules, fact labels, outcome highlights, next-project navigation, and evidence/rationale process notes now live in `public/components/case-study.css`. Do not reintroduce these rules into `public/styles.css`. Missing hero artwork is a **labeled editorial brief**, not proof of a shipped screenshot; its light/dark surfaces use `--case-hero-placeholder-bg` and `--case-hero-placeholder-border` instead of a light-only `!important`. The case-study component loads after the legacy stylesheet, preserving more-specific reading and typography overrides. Verify both themes and phone widths when modifying these tokens; preserve real images and Hoylu Mobile Insights' shipped contribution status.

## Case-study typography and keyboard-state ownership (2026-10-30)

The case-study component owns fact metadata sizing, long-form reading colors, dark-theme case links, 44px chapter/next navigation targets, and focus states. Shared typography tokens still originate in `components/foundations.css`. Avoid putting case-specific selectors back into `styles.css`; it should retain only truly shared type and theme rules. The mobile chapter strip intentionally hides its scrollbar without masking the last tab or keyboard outline. Case-study text and verified shipping labels were not changed. Test keyboard focus, text zoom, dark/light contrast, and 320–760px layouts when editing these rules.

### Work archive CSS ownership (2026-10-30)

The featured project grid, notebook index card layout, UX-process preview labels, CTA and keyboard focus rules, and desktop archive spacing now live in `public/components/work-cards.css` rather than `public/styles.css`. The extracted rules are placed before the more specific client-file treatments in the same component so folder tabs, preview provenance, responsive layout, and light/dark tokens keep precedence. Duplicate 16:10 mobile aspect-ratio declarations and superseded desktop spacing were retired. The shared notebook page background remains in `styles.css`; it is not an archive-card responsibility. Keep the challenge → contribution → delivery → approach hierarchy and reviewed evidence unchanged. `scripts/check-content.mjs` guards CSS ownership; browser tests and both theme/phone widths remain necessary before claiming visual parity.

### 2026-10-30 — Retired company chooser cleanup
The old `.company-grid`/`.company-card` chooser is not rendered by the current `index.html`, `script.js`, or project content scripts. Its unused layout, color, dark-mode, and motion rules were removed from `styles.css` and `homepage-base.css` rather than migrated as dead CSS. Active project metadata arrow behavior now lives in `components/work-cards.css`; the shared reduced-motion guard remains in `styles.css`. Keep current client-file cards, documented UX-process previews, theme contrast, and intentional visual placeholders intact. Do not restore obsolete company selectors without introducing an actual accessible component and corresponding tests.

## Retired hero decoration CSS (2026-10-30)
The hero displays the supplied portrait without old orbit, tile, and caption chrome at every viewport width. `hero-polish.css` hides the decorative markup; obsolete CSS was removed from `styles.css` and `homepage-base.css`. Keep active `.feature-art` positioning and portrait image rules. The separate portrait-first PR #17 was not edited.

## CSS editing for beginners

**Start here:** The website is in `public/`, not the repository root. CSS is the set of rules that controls how the site looks. A **selector** (such as `.skip-link`) chooses an element; a **property** (such as `color`) changes its appearance.

1. To change **site-wide colors, fonts, spacing, or keyboard focus**, start in `public/components/foundations.css`. Variables beginning with `--` are reusable values. For example, `var(--ink)` means “use the current text color,” including dark mode.
2. To change **a particular section**, edit its component file in `public/components/` (for example, `about.css`, `work-cards.css`, or `playground.css`). Look for the section name in the file comments.
3. **Avoid editing `public/styles.css` for new features.** It is older code kept temporarily so existing pages continue looking the same. Move one related group of rules at a time into the correct component file.
4. `@media(max-width:760px)` means “on screens 760 pixels wide or narrower.” `html[data-theme="dark"]` applies only to dark mode. `:focus-visible` means the visitor is navigating with a keyboard.
5. Before changing a value, search the project for the selector and check for another rule later in the load order. Later rules can override earlier ones. Change one thing, then check desktop/mobile, light/dark, and keyboard Tab navigation.

**Example — change the skip link:** Find `.skip-link` in `foundations.css`. Its normal state is moved offscreen; its `:focus-visible` state becomes visible. Keep that behavior: it helps keyboard visitors skip navigation.

**Safety checklist:** Run `node scripts/check-content.mjs`; then use the project's available browser smoke tests. Neither source checks nor successful CI prove that the live site was deployed or looks pixel-perfect. Never add made-up UX research, outcomes, or metrics to project descriptions; Hoylu Mobile Insights is shipped.

## Dark-mode blue rectangle fix and CSS ownership (2026-10-30)

The blue rectangles around the hero label, descriptive paragraph, and Work introduction were caused by a **comma-separated CSS selector mistake** in `public/styles.css`: ordinary text selectors were accidentally grouped with `.primary-link:focus-visible` and received a keyboard focus outline at all times. Do **not** hide every outline to fix this; keyboard visitors need visible focus indicators.

- `components/foundations.css` owns the shared focus ring and dark-mode spacing; `--focus` is the theme-aware outline color. Only links, buttons, and intentionally focusable elements receive it.
- `components/homepage-base.css` owns dark-theme quiet/text link colors; `components/navigation.css` owns header links; `components/work-cards.css` owns the archive back link. Their colors were extracted from the mixed dark-theme block in `styles.css`.
- The source smoke check rejects accidental static-text outlines. It cannot prove rendered geometry or contrast. Check the hero and Work introduction in both themes, then use Tab to verify visible outlines on the CTA, navigation, and skip link before deploying.

This change does not touch project narratives or claims. Hoylu Mobile Insights remains a **shipped contribution**; unverified UX research and results must not be invented.

## Homepage motion and CTA ownership (2026-10-30)

The primary button's geometry, hover nudge, and homepage entrance effects live in `public/components/homepage-base.css`; final theme-aware colors live in `monochrome-editorial.css`. The old `reveal-enter` animation was dead code: the motion-enabled reveal rule already sets `animation:none` and uses an observer-controlled opacity transition instead. The redundant animation and keyframes were removed. Reduced-motion visitors must see the Work/About sections immediately, and keyboard focus remains owned by `foundations.css`. Change hero geometry in `hero-polish.css` rather than appending overrides to `styles.css`; the open portrait-first and standalone-theme PRs were not modified. Run the content checks and Chromium smoke tests before release; neither proves pixel-level parity or deployment.

### Archive editorial selector consolidation (2026-10-31)
The final archive glass surface in `public/components/monochrome-editorial.css` now uses `.work :is(.featured-project.client-file,.notebook-project-index .featured-project)` for the common card, gloss, hover, ink, and reduced-motion rules. Both alternatives have the same class specificity as the original selectors, so the existing cascade and light/dark token values are preserved. The duplicate dark-only surface selector and repeated client-tab background/border-top declarations were retired; `work-cards.css` remains the owner of the client tab's background. Do not reintroduce parallel card selectors when updating the visual skin. The legacy `public/styles.css` is a compatibility stub with no active rules. Source checks verify ownership; Chromium and real-device checks are still required for visual equivalence.

### 2026-10-31 — Shared project-card primitives and dead override cleanup

`work-cards.css` now owns the common Work/After Hours card geometry, metadata typography, link affordances, and image cover crop previously split across two positions in `homepage-base.css`. Duplicate featured-link display/decoration, mobile facts stacking, obsolete focus radius, and superseded light card surface declarations were removed. The editorial skin still controls card surfaces; `work-cards.css` now owns shared project-image transition timing, while `playground.css` controls the always-dark After Hours contrast. The responsive facts list stacks at ≤600px, including ≤420px, without a duplicate media rule. Source and Chromium smoke tests guard card positioning, clipping, metadata, and keyboard-readable process content. No case-study narratives or delivery claims were changed; Mobile Insights remains shipped.

### 2026-10-31 — Remove unrendered card and After Hours heading overrides

`script.js` renders an `h3` title inside each linked project card (including professional archive titles), not an `h4` or `.project-title` element. The unused h4 hover/focus rules in `foundations.css`/`work-cards.css`, obsolete `.project-title` decoration block, and unrendered `.featured-case-link` were removed. The archive uses the existing linked card and its 44px mobile tap target; its former `height:100%` rule was always superseded by `height:auto` in the notebook index, so both were retired. The After Hours heading has one `#playground-title` rule rather than duplicate generic h2/pseudo-element resets; the introductory paragraph still overrides later light-paper styling for both themes. Keep the real title, focus, process teaser, dark contrast and reduced-motion behaviors. Source tests protect selector ownership, and Chromium smoke tests check both theme colors, mobile/desktop widths and live title markup; browser checks do not establish pixel-level parity or production deployment.

### 2026-10-31 — Phone navigation consolidation

At ≤650px, `navigation.css` now has one two-row grid: the logo spans both rows, Work/Playground/About occupy row one, and Contact plus theme occupy row two. DOM/keyboard order matches visual order; all controls retain 44px hit heights. The mobile Contact link is text-only, avoiding the oversized filled CTA. The header is 110px tall, so homepage anchor offsets are 122px; the case-study sticky chapter strip uses `--mobile-site-header-height` and an additional 80px heading offset. Edit these together rather than adding later overrides. Browser smoke checks cover 320/390/650px in both themes. No production or pixel-level parity claim is implied.

### 2026-10-31 — Editorial dead-cascade removal

The archive glass surface in `monochrome-editorial.css` is the single owner of card backgrounds, borders, radius, and shadows; the earlier flat `.notebook-project-index .featured-project` surface was completely superseded and has been removed. The Work component still owns image overflow/cropping, so the editorial layer retains only its 2px image-frame radius. Removed unused `.visual-placeholder` aliases (the renderer uses `.project-visual > .visual-label.visual-brief`), unused archive ink/surface tokens, redundant body/header/About colors, and redundant project-image `filter:none` resets. Only hero and About portraits intentionally use grayscale; actual project media retains full color. CSS source checks protect these ownership boundaries; confirm both themes and mobile/desktop in a browser before claiming visual parity. Open PR #59 still proposes an older competing editorial layer and must be reconciled separately.

### 2026-10-31 — One-frame illustrative briefs

`public/script.js` renders unsupplied art as one `span.visual-label.visual-brief` inside `.project-visual`. The dashed outer frame is intentional; the generic label border accidentally drew a second inner frame and overrode the brief's left alignment. `visual-placeholders.css` owns the shared unframed brief, `work-cards.css` owns compact archive kicker spacing and outer-frame geometry, and `monochrome-editorial.css` owns neutral light/dark placeholder colors. A dead desktop Work-heading margin override was removed from `stationery.css`; the authoritative Work heading layout stays in `work-cards.css`. Keep explicit illustrative labels and Hoylu Mobile Insights' shipped status. Source checks are not browser or deployment verification.

### 2026-10-31 — Archive ink cascade and accessible client links

`monochrome-editorial.css` owns glass card surfaces, **not** descendant text colors. The removed blanket `!important` selector masked client CTA and tab ink; `work-cards.css` now owns archive copy, muted challenge labels, client CTA tokens and black tab ink (needed for 4.5:1 on the dark #777 tab). CTA colors blend each accent with the theme foreground so linked text remains legible on both paper surfaces. The redundant homepage dark CTA base and higher-specificity editorial hover have both been removed; the removed header/footer override masked `navigation.css` forced-colors behavior. `public/styles.css` remains an inactive stub. Source tests protect ownership and Chromium smoke checks tab/CTA computed contrast at 390px and 1280px in both themes. Do not infer pixel-level parity or deployment from these checks. Project evidence, image placeholders and the shipped Mobile Insights status were not edited.

### 2026-10-31 — Action color ownership and cascade reduction

The primary CTA's final resting and hover/focus colors live in `monochrome-editorial.css`; `homepage-base.css` owns geometry and motion. The obsolete dark homepage `!important` base and compensating editorial hover are removed. Desktop Contact is owned by `navigation.css`, with an unfilled, readable text action in the two-row mobile header; its phone state no longer needs `!important`. The About invitation's background, border, 4px/6px tactile shadow, hover, and focus colors now live entirely in `about.css`. Shared `--editorial-accent` and `--editorial-action-ink` tokens preserve both-theme contrast. Keep 44px phone Contact targets and visible focus rings. Source and Chromium tests check ownership and action states, but neither establishes pixel-level visual parity or production deployment. No case-study claims, illustrative placeholders, or Mobile Insights shipped status changed.

### 2026-10-31 — Link-state and divider ownership

The `public/styles.css` compatibility stub remains inactive. Homepage primary/quiet link resting and hover/focus colors now live in `homepage-base.css`, while header navigation hover/focus lives in `navigation.css`. Both use existing `--editorial-accent` / `--editorial-action-ink` tokens for light/dark contrast; `monochrome-editorial.css` no longer overrides these links with `!important`. The old foundation hover block was dead and removed. The only rendered `.text-link` is the About invitation; its geometry and interactions are already owned by `about.css`, so the duplicate homepage declarations were removed. Work's section divider now lives in `work-cards.css`, and About/Playground retain their homepage dividers. Source assertions and Chromium hover checks protect this consolidation. Open PRs #17, #18, #23 and #59 were not changed. UX narratives, illustrative image placeholders, and the shipped status of Hoylu Mobile Insights remain untouched. Passing CI does not establish pixel-level visual parity or deployment.

### 2026-10-31 — About and homepage dead-cascade consolidation

`about.css` owns the About section divider and tablet heading scale previously declared in `homepage-base.css`. Removed the homepage's overridden Playground divider, About flex/paragraph rules and generic footer block; `playground.css`, `about.css` and `navigation.css` already own their rendered states. Removed the About portrait's ineffective filter resets, an overridden desktop float layout, repeated caption/phone wrapping and superseded phone CTA margin. The editorial skin continues to own the intentional grayscale portrait; the responsive biography, AI note and contact action are unchanged. Keep this ownership instead of restoring global overrides. Source checks and Chromium CI are required; neither implies deployment or pixel-level parity.

### 2026-11-01 — Shared project media motion ownership

`work-cards.css` now owns image zoom, After Hours preview lift, archive-link lift, and their reduced-motion guards. The old preview hover/reduced-motion rules were removed from `playground.css`; that component continues to own its always-dark colors and layout. Media motion only runs for visitors who have **not** requested reduced motion; hover motion additionally requires a fine pointer, while keyboard focus receives a corresponding preview affordance. Reduced-motion visitors keep static contrast, underline and focus-ring feedback without the image, folder label, or archive surface shifting. The original approved images, illustrative briefs, and case-study evidence remain untouched. Source checks protect ownership and Chromium tests check reduced-motion hover/focus transforms in both themes; neither proves production deployment or pixel-perfect equivalence.

### 2026-11-01 — Case-study mobile cascade and theme token consolidation

The legacy `public/styles.css` remains an inactive compatibility stub. The former case-study base owned structural defaults (now consolidated in `case-study.css`); `case-study.css` has **one** default and **one** dark-theme `.case-view` token block for typography, cover, evidence and reading surfaces. Removed superseded phone headline wrapping, gallery columns, reading-sheet padding, duplicate chapter spacing and button touch targets, and redundant dark illustrative-hero paint. The shared chapter button still has a 44px minimum height, with 10px/12px phone padding and visible keyboard focus. The intentional illustrative briefs, both theme palettes, project copy and shipped Mobile Insights status are unchanged. Source checks protect the consolidated declarations; verify actual browser behavior and CI before merging, and do not infer pixel-level parity or deployment from source checks.

### 2026-11-01 — Case-study evidence and gallery cascade ownership

`public/styles.css` remains an inactive compatibility stub. The former case-study base retained structural fallbacks (now consolidated in `case-study.css`); `case-study.css` owns effective evidence-card paint and type, gallery spacing and responsive evidence gaps. This pass removed overridden cover/intro declarations, redundant paragraph sizes, and competing evidence-card colors and gaps. The evidence grid stays three columns on desktop and one on phones; the gallery stays two columns on desktop and one on phones. Chromium checks cover computed geometry, spacing and theme surfaces at 390px and 1280px. Hoylu Mobile Insights remains shipped; no narratives, metrics, evidence, images or placeholders changed. Screenshot parity and production deployment are not verified.

### 2026-11-01 — Case-study chapter controls and dark hover contrast

`case-study.css` now groups chapter button geometry, focus, selected-state paint and motion instead of overriding them later. The `--case-chapter-hover` token preserves the light paper tint and uses dark paper in night mode to keep light text readable. The 44px target, horizontal phone strip, forced-colors focus ring, sticky offsets and evidence-first content remain unchanged. Source checks and Chromium hover-contrast assertions cover 390px/1280px in both themes. Screenshot parity and deployment are unverified. Mobile Insights remains shipped.

### 2026-11-01 — Case-study annotation and gallery ownership

The inactive `public/styles.css` stub has no rules to retire. `case-study.css` now owns neutral fact/highlight rules, square process-note surfaces, gallery frame sizing/paint, and case-view text ink; `monochrome-editorial.css` supplies theme tokens only. Removed redundant late editorial overrides and combined repeated facts typography and note-radius declarations. Evidence/rationale note kinds retain distinct border accents and visible provenance kickers; dark-specific note surfaces, approved imagery, responsive columns and shipped Mobile Insights copy are unchanged. Run source checks and Chromium in both themes before merging. Passing CI does not establish screenshot parity or production deployment.

### 2026-11-01 — Global theme palette ownership

`foundations.css` now owns the shared light/dark palette, ink, paper, focus and notebook-pink tokens. `stationery.css` owns dot-grid texture and elevation; `monochrome-editorial.css` owns editorial card/action paint and image treatments only. Former late editorial global overrides shadowed foundations and disabled the stronger dark high-contrast separator preference. Standard light/dark token values are preserved; high-contrast preferences can now take effect. Work client accents remain explicit in `work-cards.css`, not derived from neutral palette aliases. Change shared palette values in foundations, run source and Chromium CI in both themes, and verify deployment separately. No UX narratives, evidence, images or shipped Mobile Insights status changed.

### 2026-11-01 — About responsive and typography consolidation

`about.css` is the sole owner of About's 600px phone layout, invitation CTA and AI-process note spacing. The note's paragraphs inherit the biography font size, line height and wrapping from `.about .about-copy p`; only their narrower 58ch measure is specialized. Desktop and short-laptop spacing now share their existing 1024px media blocks. `homepage-base.css` no longer repeats About's block display or the dead emphasis colors superseded by the editorial skin; the global focus ring and border-box defaults still apply to the CTA. Source assertions and Chromium typography checks cover the two themes at 390px and 1280px; screenshot parity and deployment remain unverified. UX evidence, image placeholders and Hoylu Mobile Insights' shipped status were not changed.

### 2026-11-01 — Case-study fact typography and illustrative cover cascade

Before Pass 16, `case-study-base.css` retained structural defaults but no longer supplied a head width or inherited fact colors/weights that are always superseded in the rendered case view. `case-study.css` now gives the facts' shared DM Sans family to their parent, retains distinct label/value weights and sizes, and keeps the illustrative hero's dashed frame and compact height in one scoped rule. Removed an unused hero pseudo-element reset and redundant image-status positioning: both media containers already have `position:relative` in their structural owners. Gallery sizing, approved screenshots, keyboard focus, sticky chapter offsets, light/dark colors, and UX evidence text remain unchanged. Source checks guard ownership; Chromium checks cover facts typography and the existing hero/evidence geometry in both themes at 390px and 1280px. Screenshot parity and live deployment still require separate verification.
