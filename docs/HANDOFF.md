# Portfolio developer handoff

## Desktop header alignment â€” Pass 29

The desktop header container now uses a single flex row with centered
cross-axis alignment and space-between placement. This keeps the wordmark on
the same vertical axis as the nav, Contact action, and theme toggle, and avoids
the stacked block layout that made the header nearly twice as tall. The phone
grid layout remains the responsive override. The navigation stylesheet cache
key was advanced; verify the desktop and mobile header after CSS changes.

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
delivery evidence. vÛNı¶‰ËkºwµçXÜÜØİÛœÈHX›İ]ÙXİ[Ûˆ]šY\ˆ[™X›]XY[™ÈØØ[H™]š[İ\ÛHXÛ\™Y[ˆÛY\YÙKX˜\ÙK˜ÜÜØˆ™[[İ™YHÛY\YÙIÜÈİ™\œšY[ˆ^YÜ›İ[™]šY\‹X›İ]›^Ü\˜YÜ˜\[\È[™Ù[™\šXÈ›Ûİ\ˆ›ØÚÎÈ^YÜ›İ[™˜ÜÜØX›İ]˜ÜÜØ[™˜]šYØ][Û‹˜ÜÜØ[™XYHİÛˆZ\ˆ™[™\™Yİ]\Ëˆ™[[İ™YHX›İ]Ü˜Z]	ÜÈ[™Y™™Xİ]™Hš[\ˆ™\Ù]Ë[ˆİ™\œšY[ˆ\ÚİÜ›Ø]^[İ]™\X]YØ\[Û‹ÜÛ™HÜ˜\[™È[™İ\\œÙYYÛ™HÕHX\™Ú[‹ˆHY]ÜšX[ÚÚ[ˆÛÛ[Y\ÈÈİÛˆH[[[Û˜[Ü˜^\ØØ[HÜ˜Z]ÈH™\ÜÛœÚ]™Hš[ÙÜ˜\KRH›İH[™ÛÛXİXİ[Ûˆ\™H[˜Ú[™ÙYˆÙY\\ÈİÛ™\œÚ\[œİXYÙˆ™\İÜš[™ÈÛØ˜[İ™\œšY\ËˆÛİ\˜ÙHÚXÚÜÈ[™Ú›ÛZ][HÒH\™H™\]Z\™YÈ™Z]\ˆ[\Y\È\Ş[Y[Üˆ^[[]™[\š]K‚‚ˆÈÈÈŒ‹LLKLH8 %Ú\™Y›Ú™XİYYXH[İ[ÛˆİÛ™\œÚ\‚˜ÛÜšËXØ\™Ë˜ÜÜØ›İÈİÛœÈ[XYÙH›ÛÛKY\ˆİ\œÈ™]šY]ÈY\˜Ú]™K[[šÈY[™Z\ˆ™YXÙY[[İ[ÛˆİX\™ËˆHÛ™]šY]Èİ™\‹Ü™YXÙY[[İ[Ûˆ[\ÈÙ\™H™[[İ™Yœ›ÛH^YÜ›İ[™˜ÜÜØÈ]ÛÛ\Û™[ÛÛ[Y\ÈÈİÛˆ]È[Ø^\ËY\šÈÛÛÜœÈ[™^[İ]ˆYYXH[İ[ÛˆÛ›H[œÈ›Üˆš\Ú]ÜœÈÚÈ]™H
Š››İ
Šˆ™\]Y\İY™YXÙY[İ[ÛÈİ™\ˆ[İ[ÛˆY][Û˜[H™\]Z\™\ÈHš[™HÚ[\‹Ú[HÙ^X›Ø\™›Øİ\È™XÙZ]™\ÈHÛÜœ™\ÜÛ™[™È™]šY]ÈY™›Ü™[˜ÙKˆ™YXÙY[[İ[Ûˆš\Ú]ÜœÈÙY\İ]XÈÛÛ˜\İ[™\›[™H[™›Øİ\Ë\š[™È™YY˜XÚÈÚ]İ]H[XYÙK›Û\ˆX™[Üˆ\˜Ú]™Hİ\™˜XÙHÚY[™ËˆHÜšYÚ[˜[\›İ™Y[XYÙ\Ë[\İ˜]]™HœšYYœË[™Ø\ÙK\İYH]šY[˜ÙH™[XZ[ˆ[İXÚYˆÛİ\˜ÙHÚXÚÜÈ›İXİİÛ™\œÚ\[™Ú›ÛZ][H\İÈÚXÚÈ™YXÙY[[İ[Ûˆİ™\‹Ù›Øİ\È˜[œÙ›Ü›\È[ˆ›İ[Y\ÎÈ™Z]\ˆ›İ™\È›ÙXİ[Ûˆ\Ş[Y[Üˆ^[\\™™Xİ\]Z]˜[[˜ÙK‚‚ˆÈÈÈŒ‹LLKLH8 %Ø\ÙK\İYH[Øš[HØ\ØØYH[™[YHÚÙ[ˆÛÛœÛÛY][Û‚‚•HYØXŞHX›XËÜİ[\Ë˜ÜÜØ™[XZ[œÈ[ˆ[˜Xİ]™HÛÛ\]Xš[]HİX‹ˆH›Ü›Y\ˆØ\ÙK\İYH˜\ÙHİÛ™YİXİ\˜[Y˜][È
›İÈÛÛœÛÛY]Y[ˆØ\ÙK\İYK˜ÜÜØ
NÈØ\ÙK\İYK˜ÜÜØ\È
Š›Û™JŠˆY˜][[™
Š›Û™JŠˆ\šË][YH˜Ø\ÙK]šY]ØÚÙ[ˆ›ØÚÈ›Üˆ\ÙÜ˜\KÛİ™\‹]šY[˜ÙH[™™XY[™Èİ\™˜XÙ\Ëˆ™[[İ™Yİ\\œÙYYÛ™HXY[™HÜ˜\[™ËØ[\HÛÛ[[œË™XY[™Ë\ÚY]Y[™Ë\XØ]HÚ\\ˆÜXÚ[™È[™]ÛˆİXÚ\™Ù]Ë[™™Y[™[\šÈ[\İ˜]]™KZ\›ÈZ[ˆHÚ\™YÚ\\ˆ]Ûˆİ[\ÈHZ[š[][HZYÚÚ]LÌLœÛ™HY[™È[™š\ÚX›HÙ^X›Ø\™›Øİ\ËˆH[[[Û˜[[\İ˜]]™HœšYYœË›İ[YH[]\Ë›Ú™XİÛÜH[™Ú\Y[Øš[H[œÚYÚÈİ]\È\™H[˜Ú[™ÙYˆÛİ\˜ÙHÚXÚÜÈ›İXİHÛÛœÛÛY]YXÛ\˜][ÛœÎÈ™\šYHXİX[œ›İÜÙ\ˆ™Z]š[Üˆ[™ÒH™Y›Ü™HY\™Ú[™Ë[™È›İ[™™\ˆ^[[]™[\š]HÜˆ\Ş[Y[œ›ÛHÛİ\˜ÙHÚXÚÜË‚‚ˆÈÈÈŒ‹LLKLH8 %Ø\ÙK\İYH]šY[˜ÙH[™Ø[\HØ\ØØYHİÛ™\œÚ\‚˜X›XËÜİ[\Ë˜ÜÜØ™[XZ[œÈ[ˆ[˜Xİ]™HÛÛ\]Xš[]HİX‹ˆH›Ü›Y\ˆØ\ÙK\İYH˜\ÙH™]Z[™YİXİ\˜[˜[˜XÚÜÈ
›İÈÛÛœÛÛY]Y[ˆØ\ÙK\İYK˜ÜÜØ
NÈØ\ÙK\İYK˜ÜÜØİÛœÈY™™Xİ]™H]šY[˜ÙKXØ\™Z[[™\KØ[\HÜXÚ[™È[™™\ÜÛœÚ]™H]šY[˜ÙHØ\Ëˆ\È\ÜÈ™[[İ™Yİ™\œšY[ˆÛİ™\‹Ú[›ÈXÛ\˜][ÛœË™Y[™[\˜YÜ˜\Ú^™\Ë[™ÛÛ\][™È]šY[˜ÙKXØ\™ÛÛÜœÈ[™Ø\ËˆH]šY[˜ÙHÜšYİ^\È™YHÛÛ[[œÈÛˆ\ÚİÜ[™Û™HÛˆÛ™\ÎÈHØ[\Hİ^\ÈÛÈÛÛ[[œÈÛˆ\ÚİÜ[™Û™HÛˆÛ™\ËˆÚ›ÛZ][HÚXÚÜÈÛİ™\ˆÛÛ\]YÙ[ÛY]KÜXÚ[™È[™[YHİ\™˜XÙ\È]ÎL[™LˆŞ[H[Øš[H[œÚYÚÈ™[XZ[œÈÚ\YÈ›È˜\œ˜]]™\ËY]šXÜË]šY[˜ÙK[XYÙ\ÈÜˆXÙZÛ\œÈÚ[™ÙYˆØÜ™Y[œÚİ\š]H[™›ÙXİ[Ûˆ\Ş[Y[\™H›İ™\šYšYY‚‚ˆÈÈÈŒ‹LLKLH8 %Ø\ÙK\İYHÚ\\ˆÛÛ›ÛÈ[™\šÈİ™\ˆÛÛ˜\İ‚˜Ø\ÙK\İYK˜ÜÜØ›İÈÜ›İ\ÈÚ\\ˆ]ÛˆÙ[ÛY]K›Øİ\ËÙ[XİY\İ]HZ[[™[İ[Ûˆ[œİXYÙˆİ™\œšY[™È[H]\‹ˆHKXØ\ÙKXÚ\\‹Zİ™\˜ÚÙ[ˆ™\Ù\™\ÈHYÚ\\ˆ[[™\Ù\È\šÈ\\ˆ[ˆšYÚ[ÙHÈÙY\YÚ^™XYX›KˆH\™Ù]Üš^›Û[Û™Hİš\›Ü˜ÙYXÛÛÜœÈ›Øİ\Èš[™ËİXÚŞHÙ™œÙ]È[™]šY[˜ÙKYš\œİÛÛ[™[XZ[ˆ[˜Ú[™ÙYˆÛİ\˜ÙHÚXÚÜÈ[™Ú›ÛZ][Hİ™\‹XÛÛ˜\İ\ÜÙ\[ÛœÈÛİ™\ˆÎLÌL[ˆ›İ[Y\ËˆØÜ™Y[œÚİ\š]H[™\Ş[Y[\™H[™\šYšYYˆ[Øš[H[œÚYÚÈ™[XZ[œÈÚ\Y‚‚ˆÈÈÈŒ‹LLKLH8 %Ø\ÙK\İYH[››İ][Ûˆ[™Ø[\HİÛ™\œÚ\‚•H[˜Xİ]™HX›XËÜİ[\Ë˜ÜÜØİXˆ\È›È[\ÈÈ™]\™KˆØ\ÙK\İYK˜ÜÜØ›İÈİÛœÈ™]]˜[˜XİÚYÚYÚ[\ËÜ]X\™H›ØÙ\ÜË[›İHİ\™˜XÙ\ËØ[\Hœ˜[YHÚ^š[™ËÜZ[[™Ø\ÙK]šY]È^[šÎÈ[Û›ØÚ›ÛYKYY]ÜšX[˜ÜÜØİ\Y\È[YHÚÙ[œÈÛ›Kˆ™[[İ™Y™Y[™[]HY]ÜšX[İ™\œšY\È[™ÛÛXš[™Y™\X]Y˜XİÈ\ÙÜ˜\H[™›İK\˜Y]\ÈXÛ\˜][ÛœËˆ]šY[˜ÙKÜ˜][Û˜[H›İHÚ[™È™]Z[ˆ\İ[˜İ›Ü™\ˆXØÙ[È[™š\ÚX›H›İ™[˜[˜ÙHÚXÚÙ\œÎÈ\šË\ÜXÚYšXÈ›İHİ\™˜XÙ\Ë\›İ™Y[XYÙ\K™\ÜÛœÚ]™HÛÛ[[œÈ[™Ú\Y[Øš[H[œÚYÚÈÛÜH\™H[˜Ú[™ÙYˆ[ˆÛİ\˜ÙHÚXÚÜÈ[™Ú›ÛZ][H[ˆ›İ[Y\È™Y›Ü™HY\™Ú[™Ëˆ\ÜÚ[™ÈÒHÙ\È›İ\İX›\ÚØÜ™Y[œÚİ\š]HÜˆ›ÙXİ[Ûˆ\Ş[Y[‚‚ˆÈÈÈŒ‹LLKLH8 %ÛØ˜[[YH[]HİÛ™\œÚ\‚˜›İ[™][ÛœË˜ÜÜØ›İÈİÛœÈHÚ\™YYÚÙ\šÈ[]K[šË\\‹›Øİ\È[™›İX›ÛÚË\[šÈÚÙ[œËˆİ][Û™\K˜ÜÜØİÛœÈİYÜšY^\™H[™[]˜][ÛÈ[Û›ØÚ›ÛYKYY]ÜšX[˜ÜÜØİÛœÈY]ÜšX[Ø\™ØXİ[ÛˆZ[[™[XYÙH™X]Y[ÈÛ›Kˆ›Ü›Y\ˆ]HY]ÜšX[ÛØ˜[İ™\œšY\ÈÚYİÙY›İ[™][ÛœÈ[™\ØX›YHİ›Û™Ù\ˆ\šÈYÚXÛÛ˜\İÙ\\˜]Üˆ™Y™\™[˜ÙKˆİ[™\™YÚÙ\šÈÚÙ[ˆ˜[Y\È\™H™\Ù\™YÈYÚXÛÛ˜\İ™Y™\™[˜Ù\ÈØ[ˆ›İÈZÙHY™™XİˆÛÜšÈÛY[XØÙ[È™[XZ[ˆ^XÚ][ˆÛÜšËXØ\™Ë˜ÜÜØ›İ\š]™Yœ›ÛH™]]˜[[]H[X\Ù\ËˆÚ[™ÙHÚ\™Y[]H˜[Y\È[ˆ›İ[™][ÛœË[ˆÛİ\˜ÙH[™Ú›ÛZ][HÒH[ˆ›İ[Y\Ë[™™\šYH\Ş[Y[Ù\\˜][Kˆ›ÈV˜\œ˜]]™\Ë]šY[˜ÙK[XYÙ\ÈÜˆÚ\Y[Øš[H[œÚYÚÈİ]\ÈÚ[™ÙY‚‚ˆÈÈÈŒ‹LLKLH8 %X›İ]™\ÜÛœÚ]™H[™\ÙÜ˜\HÛÛœÛÛY][Û‚‚˜X›İ]˜ÜÜØ\ÈHÛÛHİÛ™\ˆÙˆX›İ]	ÜÈŒÛ™H^[İ][š]][ÛˆÕH[™RK\›ØÙ\ÜÈ›İHÜXÚ[™ËˆH›İIÜÈ\˜YÜ˜\È[š\š]Hš[ÙÜ˜\H›ÛÚ^™K[™HZYÚ[™Ü˜\[™Èœ›ÛH˜X›İ]˜X›İ]XÛÜHÈÛ›HZ\ˆ˜\œ›İÙ\ˆNÚYX\İ\™H\ÈÜXÚX[^™Yˆ\ÚİÜ[™ÚÜ[\ÜÜXÚ[™È›İÈÚ\™HZ\ˆ^\İ[™ÈLYYXH›ØÚÜËˆÛY\YÙKX˜\ÙK˜ÜÜØ›ÈÛ™Ù\ˆ™\X]ÈX›İ]	ÜÈ›ØÚÈ\Ü^HÜˆHXY[\\Ú\ÈÛÛÜœÈİ\\œÙYYHHY]ÜšX[ÚÚ[ÈHÛØ˜[›Øİ\Èš[™È[™›Ü™\‹X›ŞY˜][Èİ[\HÈHÕKˆÛİ\˜ÙH\ÜÙ\[ÛœÈ[™Ú›ÛZ][H\ÙÜ˜\HÚXÚÜÈÛİ™\ˆHÛÈ[Y\È]ÎL[™LÈØÜ™Y[œÚİ\š]H[™\Ş[Y[™[XZ[ˆ[™\šYšYYˆV]šY[˜ÙK[XYÙHXÙZÛ\œÈ[™Ş[H[Øš[H[œÚYÚÉÈÚ\Yİ]\ÈÙ\™H›İÚ[™ÙY‚‚ˆÈÈÈŒ‹LLKLH8 %Ø\ÙK\İYH˜Xİ\ÙÜ˜\H[™[\İ˜]]™HÛİ™\ˆØ\ØØYB‚™Y›Ü™H\ÜÈM‹Ø\ÙK\İYKX˜\ÙK˜ÜÜØ™]Z[™YİXİ\˜[Y˜][È]›ÈÛ™Ù\ˆİ\YYHXYÚYÜˆ[š\š]Y˜XİÛÛÜœËİÙZYÚÈ]\™H[Ø^\Èİ\\œÙYY[ˆH™[™\™YØ\ÙHšY]ËˆØ\ÙK\İYK˜ÜÜØ›İÈÚ]™\ÈH˜XİÉÈÚ\™YHØ[œÈ˜[Z[HÈZ\ˆ\™[™]Z[œÈ\İ[˜İX™[İ˜[YHÙZYÚÈ[™Ú^™\Ë[™ÙY\ÈH[\İ˜]]™H\›ÉÜÈ\ÚYœ˜[YH[™ÛÛ\XİZYÚ[ˆÛ™HØÛÜY[Kˆ™[[İ™Y[ˆ[\ÙY\›ÈÙ]YËY[[Y[™\Ù][™™Y[™[[XYÙK\İ]\ÈÜÚ][Ûš[™Îˆ›İYYXHÛÛZ[™\œÈ[™XYH]™HÜÚ][Ûœ™[]]™X[ˆZ\ˆİXİ\˜[İÛ™\œËˆØ[\HÚ^š[™Ë\›İ™YØÜ™Y[œÚİËÙ^X›Ø\™›Øİ\ËİXÚŞHÚ\\ˆÙ™œÙ]ËYÚÙ\šÈÛÛÜœË[™V]šY[˜ÙH^™[XZ[ˆ[˜Ú[™ÙYˆÛİ\˜ÙHÚXÚÜÈİX\™İÛ™\œÚ\ÈÚ›ÛZ][HÚXÚÜÈÛİ™\ˆ˜XİÈ\ÙÜ˜\H[™H^\İ[™È\›ËÙ]šY[˜ÙHÙ[ÛY]H[ˆ›İ[Y\È]ÎL[™LˆØÜ™Y[œÚİ\š]H[™]™H\Ş[Y[İ[™\]Z\™HÙ\\˜]H™\šYšXØ][Û‹‚