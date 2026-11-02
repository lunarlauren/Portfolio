# Portfolio developer handoff

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
`work-cards.css`; do#m7��h��춻�q�^wp widths and live title markup; browser checks do not establish pixel-level parity or production deployment.

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
