# Portfolio developer handoff

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
The legacy `public/styles.css` has zero active rules. `visual-placeholders.css` now owns shared project-preview frame geometry and real-image cover cropping alongside the illustrative-brief frame; `work-cards.css` no longer duplicates the base `.project-visual` selector. Work retains its neutral archive frame and actual CTA underline, while Playground retains its independent charcoal contrast. Border color on borderless Playground links, duplicate card `min-width`, repeated process ink and inherited link underline metrics were removed as ineffective declarations. `visual-placeholders.css` owns the shared illustrative-brief frame and one dark media fallback for both missing images and loading real images. The retired `--placeholder-surface` / `--placeholder-edge` custom#]»ã¾­¢G§²ÚîÆ­yİÀ°(€€€€€Í¥é”éÁ…ÉÍ•±½…Ğ¡•Ñ½µÁÕÑ•‘MÑå±”¡¡•…‘¥¹œ¤¹™½¹ÑM¥é”¤°(€€€€€±•…‘¥¹œéÁ…ÉÍ•±½…Ğ¡•Ñ½µÁÕÑ•‘MÑå±”¡¡•…‘¥¹œ¤¹±¥¹•!•¥¡Ğ¤(€€€€ôì(€€€ô¤ì(€€ô±Ñ¡•µ”¤ì(€€…ÍÍ•ÉĞ¹½¬¡…É‘Ì¹±•¹Ñ øôÌ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆèÁÉ½™•ÍÍ¥½¹…°±¥•¹Ğ™¥±•Ì•á¥ÍĞˆ¤ì(€€™½È¡½¹ÍĞ…É½˜…É‘Ì¥ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡…É¹™•…ÑÕÉ•±ÑÉÕ”±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè±¥•¹Ğ™¥±•ÌÉ•Ñ…¥¸™•…ÑÕÉ•ÍÑÉÕÑÕÉ”ˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡…É¹İ•¥¡Ğ°ˆÔÀÀˆ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè¡•…‘¥¹œİ•¥¡ĞÉ•µ…¥¹Ì€ÔÀÀˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡…É¹µ…É¥¸°ˆÄÉÁàˆ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆèµ•Ñ…‘…Ñ„É•Ñ…¥¹Ì€ÄÉÁàÍÁ…¥¹œˆ¤ì(€€€…ÍÍ•ÉĞ¹½¬¡5…Ñ ¹…‰Ì¡…É¹±•…‘¥¹œ½…É¹Í¥é”´¡İ¥‘Ñ ğôØÀÀüÄ¸ÄÈèÄ¸Ä¤¤ğÀ¸ÀÈ°(€€€€İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè…É¡¥Ù”Ñ¥Ñ±”±¥¹”µ¡•¥¡ĞÉ•µ…¥¹ÌÕ¹¡…¹•ˆ¤ì(€€ô(€ô(ô(…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ èÄÈàÀ±¡•¥¡ĞèÜÈÁô¤ì(…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”  ¤ôùí‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”ô‰±¥¡Ğ‰ô¤ì((…İ…¥ĞÁ…”¹½Ñ¼¡½É¥¥¸¬ˆ½…Í”µÍÑÕ‘¥•Ì½¡½å±Ô½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼ˆ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ…Í”µÑ¥Ñ±”ˆ¤¹İ…¥Ñ½È ¤ì(€¼¼A…ÍÌ€ÄÀèÑ¡”Í¡…É•…Í”µ¹…Ù¥…Ñ¥½¸½İ¹•È­••ÁÌ•Ù•Éä¹•áĞ½‰…¬±¥¹¬(€¼¼Ñ½Õ µ™É¥•¹‘±ä¸…ĞÙ…±Õ•Ì…¹•Ù¥‘•¹”Ñ•áĞÉ•Ñ…¥¸‘¥ÍÑ¥¹Ğ±¥¹”¡•¥¡ÑÌ¸(™½È¡½¹ÍĞİ¥‘Ñ ½˜lÌäÀ°ÜØÀ°ÄÈàÁt¥ì(€…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ ±¡•¥¡ĞèàĞÑô¤ì(€™½È¡½¹ÍĞÑ¡•µ”½˜l‰±¥¡Ğˆ°‰‘…É¬‰t¥ì(€€½¹ÍĞ‘…Ñ„õ…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”¡Ù…±Õ”ôùì(€€€‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÙ…±Õ”ì(€€€½¹ÍĞ±¥¹­Ìõl¸¸¹‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹…Í”µ¹•áĞµ¹…Ø„°¹…Í”µ‰…¬ˆ¥tì(€€€½¹ÍĞÉ…Ñ¥¼õÍ•±•Ñ½Èôùì(€€€€½¹ÍĞÍÑå±”õ•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È¡Í•±•Ñ½È¤¤ì(€€€€É•ÑÕÉ¸Á…ÉÍ•±½…Ğ¡ÍÑå±”¹±¥¹•!•¥¡Ğ¤½Á…ÉÍ•±½…Ğ¡ÍÑå±”¹™½¹ÑM¥é”¤ì(€€€ôì(€€€É•ÑÕÉ¸ì(€€€€±¥¹­Ìé±¥¹­Ì¹µ…À¡±¥¹¬ôùì(€€€€€½¹ÍĞÍÑå±”õ•Ñ½µÁÕÑ•‘MÑå±”¡±¥¹¬¤ì(€€€€€É•ÑÕÉ¸í¥Í9•áĞé±¥¹¬¹µ…Ñ¡•Ì ˆ¹…Í”µ¹•áĞµ¹…Ø„ˆ¤ı±¥¹¬¹±…ÍÍ1¥ÍĞ¹½¹Ñ…¥¹Ì ‰…Í”µ¹•áĞˆ¤éÑÉÕ”°(€€€€€€¡•¥¡ĞéÁ…ÉÍ•±½…Ğ¡ÍÑå±”¹µ¥¹!•¥¡Ğ¤±‘¥ÍÁ±…äéÍÑå±”¹‘¥ÍÁ±…ä±…±¥¸éÍÑå±”¹…±¥¹%Ñ•µÍôì(€€€€ô¤°(€€€€™…ÑÌéÉ…Ñ¥¼ ˆ¹…Í”µ™…ĞµÙ…±Õ”ˆ¤±•Ù¥‘•¹”éÉ…Ñ¥¼ ˆ¹…Í”µ•Ù¥‘•¹”µ¥Ñ•´ÍÑÉ½¹œˆ¤(€€€ôì(€€ô±Ñ¡•µ”¤ì(€€…ÍÍ•ÉĞ¹½¬¡‘…Ñ„¹±¥¹­Ì¹±•¹Ñ øôÈ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè…Í”¹…Ù¥…Ñ¥½¸•á¥ÍÑÌˆ¤ì(€€™½È¡½¹ÍĞ±¥¹¬½˜‘…Ñ„¹±¥¹­Ì¥ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡±¥¹¬¹¥Í9•áĞ±ÑÉÕ”±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè¹•áĞ±¥¹­ÌÉ•Ñ…¥¸±…ÍÌ…¹¹…ØÁ…É•¹Ğˆ¤ì(€€€…ÍÍ•ÉĞ¹½¬¡±¥¹¬¹¡•¥¡ĞøôĞĞ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè…Í”±¥¹­ÌÉ•Ñ…¥¸€ĞÑÁàµ¥¹¥µÕ´¡•¥¡Ğˆ¤ì(€€€…ÍÍ•ÉĞ¹½¬¡l‰™±•àˆ°‰¥¹±¥¹”µ™±•à‰t¹¥¹±Õ‘•Ì¡±¥¹¬¹‘¥ÍÁ±…ä¤±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè±¥¹­ÌÉ•µ…¥¸™±•àµ…±¥¹•ˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡±¥¹¬¹…±¥¸°‰•¹Ñ•Èˆ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè±¥¹­ÌÍÑ…äÙ•ÉÑ¥…±±ä…±¥¹•ˆ¤ì(€€ô(€€…ÍÍ•ÉĞ¹½¬¡5…Ñ ¹…‰Ì¡‘…Ñ„¹™…ÑÌ´Ä¸Ø¤ğÀ¸ÀÈ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè™…ĞÙ…±Õ•ÌÉ•Ñ…¥¸€Ä¸Ø±•…‘¥¹œˆ¤ì(€€…ÍÍ•ÉĞ¹½¬¡5…Ñ ¹…‰Ì¡‘…Ñ„¹•Ù¥‘•¹”´Ä¸Ô¤ğÀ¸ÀÈ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè•Ù¥‘•¹”Ù…±Õ•ÌÉ•Ñ…¥¸€Ä¸Ô±•…‘¥¹œˆ¤ì(€ô(ô(…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ èÄÈàÀ±¡•¥¡ĞèÜÈÁô¤ì(…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”  ¤ôùí‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”ô‰±¥¡Ğ‰ô¤ì(((€¼¼…¹½¹¥…°¡½µ•Á…”…¹¡½ÉÌµÕÍĞİ½É¬İ¡•¸½Á•¹•¥¸…¹½Ñ¡•ÈÑ…ˆ™É½´„(€¼¼‘••Àµ±¥¹­•…Í”ÍÑÕ‘ä¸Q¡”½É¥¥¹…°…Í”µÍÑÕ‘äÁ…”µÕÍĞÉ•µ…¥¸¥¸Á±…”¸(™½È¡½¹ÍĞÍ•±•Ñ½È½˜lˆ¹Í¥Ñ”µ¡•…‘•È¹…Ø…m¡É•˜ôœ¼İ½É¬tˆ°€ˆ¹…Í”µ‰…¬‰t¥ì(€½¹ÍĞ±¥¹¬õÁ…”¹±½…Ñ½È¡Í•±•Ñ½È¤ì(€…İ…¥Ğ±¥¹¬¹•Ù…±Õ…Ñ”¡¹½‘”ôù¹½‘”¹Ñ…É•Ğô‰}‰±…¹¬ˆ¤ì(€½¹ÍĞ¹•İQ…‰AÉ½µ¥Í”õÁ…”¹İ…¥Ñ½ÉÙ•¹Ğ ‰Á½ÁÕÀˆ¤ì(€…İ…¥Ğ±¥¹¬¹±¥¬ ¤ì(€½¹ÍĞ¹•İQ…ˆõ…İ…¥Ğ¹•İQ…‰AÉ½µ¥Í”ì(€…İ…¥Ğ¹•İQ…ˆ¹İ…¥Ñ½É1½…‘MÑ…Ñ” ‰‘½µ½¹Ñ•¹Ñ±½…‘•ˆ¤ì(€…ÍÍ•ÉĞ¹•ÅÕ…°¡¹•ÜUI0¡¹•İQ…ˆ¹ÕÉ° ¤¤¹Á…Ñ¡¹…µ”°ˆ¼ˆ°‰9•ÜµÑ…ˆÉ•ÑÕÉ¸±¥¹¬Í¡½Õ±½Á•¸Ñ¡”¡½µ•Á…”ˆ¤ì(€…ÍÍ•ÉĞ¹•ÅÕ…°¡¹•ÜUI0¡¹•İQ…ˆ¹ÕÉ° ¤¤¹¡…Í °ˆİ½É¬ˆ°‰9•ÜµÑ…ˆÉ•ÑÕÉ¸±¥¹¬Í¡½Õ±Ñ…É•Ğ]½É¬ˆ¤ì(€…ÍÍ•ÉĞ¹µ…Ñ ¡Á…”¹ÕÉ° ¤°½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼°‰9•ÜµÑ…ˆÉ•ÑÕÉ¸µÕÍĞ¹½Ğ¹…Ù¥…Ñ”Ñ¡”½É¥¥¹…°…Í”ÍÑÕ‘äˆ¤ì(€…İ…¥Ğ¹•İQ…ˆ¹±½Í” ¤ì(€…İ…¥Ğ±¥¹¬¹•Ù…±Õ…Ñ”¡¹½‘”ôù¹½‘”¹É•µ½Ù•ÑÑÉ¥‰ÕÑ” ‰Ñ…É•Ğˆ¤¤ì(ô(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥ĞÁ…”¹Ñ¥Ñ±” ¤°½½¹¹•Ñ•A±…¹¹¥¹œ¼¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆµ…¥¸ˆ¤¹¥Í!¥‘‘•¸ ¤±ÑÉÕ”¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ…Í”µÑ¥Ñ±”ˆ¤¹¥¹¹•ÉQ•áĞ ¤°‰½¹¹•Ñ•A±…¹¹¥¹œˆ¤ì(€¼¼ÕÑ¡½É•U`É•…Í½¹¥¹œÍ¡½Õ±‰”Ù¥Í¥‰±”¥¸Ñ¡”½Ù•È‰•™½É”„Á±…•¡½±‘•È¸(€¼¼Q¡¥Ì¥Ì‘•Í¥¸É…Ñ¥½¹…±”°¹½Ğ„±…¥´½˜¥¹Ñ•ÉÙ¥•İÌ½ÈÙ•É¥™¥•É•ÍÕ±ÑÌ¸(½¹ÍĞ…ÁÁÉ½… õÁ…”¹±½…Ñ½È ˆ¹…Í”µ¡•…€¹…Í”µ…ÁÁÉ½… ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ…ÁÁÉ½… ¹½Õ¹Ğ ¤°Ä°‰AÉ½™•ÍÍ¥½¹…°…Í”µÍÑÕ‘ä½Ù•ÈÍ¡½Õ±•áÁ½Í”¥ÑÌ…ÕÑ¡½É•‘•Í¥¸…ÁÁÉ½… ˆ¤ì(½¹ÍĞ…ÁÁÉ½…¡Q•áĞõ…İ…¥Ğ…ÁÁÉ½… ¹¥¹¹•ÉQ•áĞ ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…ÁÁÉ½…¡Q•áĞ°½•Í¥¸…ÁÁÉ½… ½¤¤ì(…ÍÍ•ÉĞ¹½¬¡…ÁÁÉ½…¡Q•áĞ¹É•Á±…” ½•Í¥¸…ÁÁÉ½… ½¤°ˆˆ¤¹ÑÉ¥´ ¤¹±•¹Ñ øôÌÔ°(€€‰…Í”µÍÑÕ‘ä½Ù•ÈµÕÍĞ½¹Ñ…¥¸„µ•…¹¥¹™Õ°…ÕÑ¡½É•‘•Í¥¸É…Ñ¥½¹…±”ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ…ÁÁÉ½… ¹•Ù…±Õ…Ñ”¡¹½‘”ôù	½½±•…¸¡¹½‘”¹½µÁ…É•½Õµ•¹ÑA½Í¥Ñ¥½¸¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ¡•É¼µÙ¥ÍÕ…°ˆ¤¤™9½‘”¹=U59Q}A=M%Q%=9}=11=]%9¤¤±ÑÉÕ”°(€€‰Q¡”‘•Í¥¸…ÁÁÉ½… µÕÍĞÁÉ••‘”Ñ¡”Ù¥ÍÕ…°‰É¥•˜¥¸É•…‘¥¹œ½É‘•Èˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È œ¹…Í”µ…±±•Éäœ¤¹•ÑÑÑÉ¥‰ÕÑ” …É¥„µ±…‰•°œ¤°Y¥ÍÕ…°‰É¥•™Ì…¹¥µ…”Á±…•¡½±‘•ÉÌœ°A±…¹¹•…Í”µÍÑÕ‘äÙ¥ÍÕ…±ÌµÕÍĞ¹½Ğ‰”…¹¹½Õ¹•…Ì…¸¥µ…”…±±•Éäœ¤ì(€¼¼U¹Ñ¥°…ÁÁÉ½Ù•ÍÉ••¹Í¡½ÑÌ…ÉÉ¥Ù”°„‘•ÍÉ¥ÁÑ¥Ù”Ù¥ÍÕ…°‰É¥•˜Í¡½Õ±¹½Ğ(€¼¼½ÕÁäÑ¡”Í…µ”€ØĞÁÁà½Ù•È¡•¥¡Ğ…Ì„É•…°¥µ…”¸¡•¬‰½Ñ ‰É•…­Á½¥¹ÑÌ(€¼¼…¹ÁÉ•Í•ÉÙ”Ñ¡”•áÁ±¥¥Ğ¥±±ÕÍÑÉ…Ñ¥Ù”µ…ÉĞ±…‰•°…¹É•…‘…‰±”‰É¥•˜Ñ•áĞ¸(½¹ÍĞ‰É¥•˜õÁ…”¹±½…Ñ½È ˆ¹…Í”µ¡•É¼µÙ¥ÍÕ…°é¹½Ğ é¡…Ì¡¥µœ¤¤ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ‰É¥•˜¹½Õ¹Ğ ¤°Ä°‰¸Õ¹ÍÕÁÁ±¥•…Í”¡•É¼Í¡½Õ±É•Ñ…¥¸¥ÑÌ•‘¥Ñ½É¥…°‰É¥•˜ˆ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥Ğ‰É¥•˜¹¥¹¹•ÉQ•áĞ ¤°½%11UMQIQ%Y¸©9=PAI=UPMI9M!=P¼¤ì(½¹ÍĞ‘•Í­Ñ½Á	É¥•™!•¥¡Ğõ…İ…¥Ğ‰É¥•˜¹•Ù…±Õ…Ñ”¡¹½‘”ôù¹½‘”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤¹¡•¥¡Ğ¤ì(…ÍÍ•ÉĞ¹½¬¡‘•Í­Ñ½Á	É¥•™!•¥¡ĞøôÈÀÀ˜™‘•Í­Ñ½Á	É¥•™!•¥¡ĞğôÌĞÀ°‰•Í­Ñ½À‰É¥•˜Í¡½Õ±‰”½µÁ…Ğİ¥Ñ¡½ÕĞ±¥ÁÁ¥¹œ¥ÑÌ½Áäˆ¤ì(€¼¼Q¡”½±±¥¡Ğµ½¹±ä€…¥µÁ½ÉÑ…¹ĞÍÕÉ™…”±•…­•¥¹Ñ¼‘…É¬µ½‘”¸(€¼¼¡•¬½µÁÕÑ•ÍÕÉ™…•Ì…¹­••ÀÑ¡”¹¼µ¥µ…”‰½É‘•ÈÙ¥Í¥‰±”¸(½¹ÍĞ¡•É½Q¡•µ•MÕÉ™…•Ìõ…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”  ¤ôùì(€½¹ÍĞ¹½‘”õ‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ¡•É¼µÙ¥ÍÕ…°é¹½Ğ é¡…Ì¡¥µœ¤¤ˆ¤ì(€É•ÑÕÉ¸l‰±¥¡Ğˆ°‰‘…É¬‰t¹µ…À¡Ñ¡•µ”ôùì(€€‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÑ¡•µ”ì(€€½¹ÍĞÍÌõ•Ñ½µÁÕÑ•‘MÑå±”¡¹½‘”¤ì(€€É•ÑÕÉ¸íÑ¡•µ”±‰œéÍÌ¹‰…­É½Õ¹‘½±½È±‰½É‘•ÉMÑå±”éÍÌ¹‰½É‘•ÉQ½ÁMÑå±•ôì(€ô¤ì(ô¤ì(…ÍÍ•ÉĞ¹¹½ÑÅÕ…°¡¡•É½Q¡•µ•MÕÉ™…•ÍlÁt¹‰œ±¡•É½Q¡•µ•MÕÉ™…•ÍlÅt¹‰œ°‰!•É¼Á±…•¡½±‘•ÈµÕÍĞ…‘…ÁĞÑ¼‘…É¬Ñ¡•µ”ˆ¤ì(…ÍÍ•ÉĞ¹½¬¡¡•É½Q¡•µ•MÕÉ™…•Ì¹•Ù•Éä¡ÍÕÉ™…”ôùÍÕÉ™…”¹‰½É‘•ÉMÑå±”ôôô‰‘…Í¡•ˆ¤°‰5¥ÍÍ¥¹œ¡•É¼…ÉÑİ½É¬¹••‘Ì„‘…Í¡••‘¥Ñ½É¥…°‰½É‘•È¥¸‰½Ñ Ñ¡•µ•Ìˆ¤ì(…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”  ¤ôùí‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”ô‰±¥¡Ğ‰ô¤ì(…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ èÌäÀ±¡•¥¡ĞèàĞÑô¤ì(½¹ÍĞÁ¡½¹•	É¥•™!•¥¡Ğõ…İ…¥Ğ‰É¥•˜¹•Ù…±Õ…Ñ”¡¹½‘”ôù¹½‘”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤¹¡•¥¡Ğ¤ì(…ÍÍ•ÉĞ¹½¬¡Á¡½¹•	É¥•™!•¥¡ĞøôÄäÀ˜™Á¡½¹•	É¥•™!•¥¡ĞğôÌÈÀ°‰A¡½¹”‰É¥•˜Í¡½Õ±¹½Ğ‰ÕÉäÑ¡”U`¹…ÉÉ…Ñ¥Ù”ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ‰É¥•˜¹•Ù…±Õ…Ñ”¡¹½‘”ôù¹½‘”¹ÍÉ½±±!•¥¡Ğğõ¹½‘”¹±¥•¹Ñ!•¥¡Ğ¬È¤±ÑÉÕ”°‰	É¥•˜Ñ•áĞÍ¡½Õ±¹½Ğ‰”Ù•ÉÑ¥…±±ä±¥ÁÁ•ˆ¤ì(…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ èÄÈàÀ±¡•¥¡ĞèÜÈÁô¤ì(€¼¼¡•¬½µÁÕÑ••Ù¥‘•¹”½…±±•Éä•½µ•ÑÉä…¹Ñ¡•µ”Á…¥¹Ğ…™Ñ•ÈÉ•µ½Ù¥¹œ‘•…½Ù•ÉÉ¥‘•Ì¸(™½È¡½¹ÍĞİ¥‘Ñ ½˜lÌäÀ°ÄÈàÁt¥ì(€…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ ±¡•¥¡ĞèàĞÑô¤ì(€½¹ÍĞÍ…µÁ±•Ìõmtì(€™½È¡½¹ÍĞÑ¡•µ”½˜l‰±¥¡Ğˆ°‰‘…É¬‰t¥ì(€€½¹ÍĞµ•ÑÉ¥Ìõ…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”¡Ñ¡•µ”ôùì(€€€‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÑ¡•µ”ì(€€€½¹ÍĞ•Ù¥‘•¹”õ•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ•Ù¥‘•¹”ˆ¤¤ì(€€€½¹ÍĞ…±±•Éäõ•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ…±±•Éäˆ¤¤ì(€€€É•ÑÕÉ¸í•Ù¥‘•¹•½±Ìé•Ù¥‘•¹”¹É¥‘Q•µÁ±…Ñ•½±Õµ¹Ì¹ÑÉ¥´ ¤¹ÍÁ±¥Ğ ½qÌ¬¼¤¹±•¹Ñ °(€€€€…±±•Éå½±Ìé…±±•Éä¹É¥‘Q•µÁ±…Ñ•½±Õµ¹Ì¹ÑÉ¥´ ¤¹ÍÁ±¥Ğ ½qÌ¬¼¤¹±•¹Ñ °(€€€€•Ù¥‘•¹•…Àé•Ù¥‘•¹”¹…À±…±±•Éå…Àé…±±•Éä¹…À°(€€€€ÍÕÉ™…”é•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ•Ù¥‘•¹”µ¥Ñ•´ˆ¤¤¹‰…­É½Õ¹‘½±½È°(€€€€¡•É½	½É‘•Èé•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ¡•É¼µÙ¥ÍÕ…°é¹½Ğ é¡…Ì¡¥µœ¤¤ˆ¤¤¹‰½É‘•ÉQ½ÁMÑå±”°(€€€€¡•É½	É¥•™M¥é”éÁ…ÉÍ•±½…Ğ¡•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ¡•É¼µÙ¥ÍÕ…°€¹¡•É¼µ¥µ…”µ‰É¥•˜ˆ¤¤¹™½¹ÑM¥é”¤°(€€€€™…Ñ1…‰•±½¹Ğé•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ™…Ğµ±…‰•°ˆ¤¤¹™½¹Ñ…µ¥±ä°(€€€€™…ÑY…±Õ•½¹Ğé•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ™…ĞµÙ…±Õ”ˆ¤¤¹™½¹Ñ…µ¥±ä°(€€€€™…Ñ1…‰•±]•¥¡Ğé•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ™…Ğµ±…‰•°ˆ¤¤¹™½¹Ñ]•¥¡Ğ°(€€€€™…ÑY…±Õ•]•¥¡Ğé•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ™…ĞµÙ…±Õ”ˆ¤¤¹™½¹Ñ]•¥¡Ğ°(€€€€™…Ñ1…‰•±M¥é”é•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ™…Ğµ±…‰•°ˆ¤¤¹™½¹ÑM¥é”°(€€€€™…ÑY…±Õ•M¥é”é•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ™…ĞµÙ…±Õ”ˆ¤¤¹™½¹ÑM¥é•ôì(€€ô±Ñ¡•µ”¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹•Ù¥‘•¹•½±Ì±İ¥‘Ñ ôôôÌäÀüÄèÌ±Ñ¡•µ”¬ˆè•Ù¥‘•¹”½±Õµ¹Ì…Ğ€ˆ­İ¥‘Ñ ¬‰Áàˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹…±±•Éå½±Ì±İ¥‘Ñ ôôôÌäÀüÄèÈ±Ñ¡•µ”¬ˆè…±±•Éä½±Õµ¹Ì…Ğ€ˆ­İ¥‘Ñ ¬‰Áàˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹¡•É½	½É‘•È°‰‘…Í¡•ˆ±Ñ¡•µ”¬ˆèµ¥ÍÍ¥¹œ¡•É¼µÕÍĞÉ•Ñ…¥¸‘…Í¡•‰½É‘•È…Ğ€ˆ­İ¥‘Ñ ¬‰Áàˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…Ñ1…‰•±½¹Ğ±µ•ÑÉ¥Ì¹™…ÑY…±Õ•½¹Ğ±Ñ¡•µ”¬ˆè™…Ğ±…‰•°…¹Ù…±Õ”Í¡…É”‰½‘äÑåÁ”ˆ¤ì(€€€…ÍÍ•ÉĞ¹µ…Ñ ¡µ•ÑÉ¥Ì¹™…Ñ1…‰•±½¹Ğ°½4M…¹Ì¼±Ñ¡•µ”¬ˆè™…ÑÌÉ•Ñ…¥¸Ñ¡”…ÕÑ¡½É•‰½‘ä™½¹Ğˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…Ñ1…‰•±]•¥¡Ğ°ˆØÔÀˆ±Ñ¡•µ”¬ˆè™…Ğ±…‰•±ÌÉ•Ñ…¥¸Ñ¡•¥È¡¥•É…É¡äˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…ÑY…±Õ•]•¥¡Ğ°ˆĞÀÀˆ±Ñ¡•µ”¬ˆè™…ĞÙ…±Õ•ÌÍÑ…äÍÕÁÁ½ÉÑ¥¹œ½Áäˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…Ñ1…‰•±M¥é”°ˆÄÉÁàˆ±Ñ¡•µ”¬ˆè™…Ğ±…‰•°µ•Ñ„Í¥é”ˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…ÑY…±Õ•M¥é”°ˆÄÑÁàˆ±Ñ¡•µ”¬ˆè™…ĞÙ…±Õ”Í¥é”ˆ¤ì(€€…ÍÍ•ÉĞ¹½¬¡µ•ÑÉ¥Ì¹¡•É½	É¥•™M¥é”øôÄØ˜™µ•ÑÉ¥Ì¹¡•É½	É¥•™M¥é”ğôÈÀ±Ñ¡•µ”¬ˆèÙ¥ÍÕ…°‰É¥•˜µÕÍĞÍÑ…ä…ÁÑ¥½¸µÍ¥é•…Ğ€ˆ­İ¥‘Ñ ¬‰Áàˆ¤ì(€€Í…µÁ±•Ì¹ÁÕÍ ¡µ•ÑÉ¥Ì¤ì(€ô(€…ÍÍ•ÉĞ¹•ÅÕ…°¡Í…µÁ±•ÍlÁt¹•Ù¥‘•¹•…À±Í…µÁ±•ÍlÅt¹•Ù¥‘•¹•…À°‰Ù¥‘•¹”ÍÁ…¥¹œµÕÍĞ¹½ĞÍ¡¥™Ğİ¥Ñ Ñ¡•µ”ˆ¤ì(€…ÍÍ•ÉĞ¹•ÅÕ…°¡Í…µÁ±•ÍlÁt¹…±±•Éå…À±Í…µÁ±•ÍlÅt¹…±±•Éå…À°‰…±±•ÉäÍÁ…¥¹œµÕÍĞ¹½ĞÍ¡¥™Ğİ¥Ñ Ñ¡•µ”ˆ¤ì(€…ÍÍ•ÉĞ¹¹½ÑÅÕ…°¡Í…µÁ±•ÍlÁt¹ÍÕÉ™…”±Í…µÁ±•ÍlÅt¹ÍÕÉ™…”°‰Ù¥‘•¹”…ÉÍÕÉ™…”µÕÍĞ…‘…ÁĞÑ¼Ñ¡•µ”ˆ¤ì(€€¼¼!½Ù•É•¡…ÁÑ•ÈÑ…‰Ì¹••É•…‘…‰±”Ñ•áĞ¥¸‰½Ñ Ñ¡•µ•ÌìÉ•‘Õ•µ½Ñ¥½¸(€€¼¼Í¡½Õ±‘¥Í…‰±”Ñ¡”ÑÉ…¹Í¥Ñ¥½¸İ¥Ñ¡½ÕĞÉ•µ½Ù¥¹œÑ¡”¡½Ù•È½™½ÕÌÕ”¸(€…İ…¥ĞÁ…”¹•µÕ±…Ñ•5•‘¥„¡íÉ•‘Õ•‘5½Ñ¥½¸è‰É•‘Õ”‰ô¤ì(€™½È¡½¹ÍĞÑ¡•µ”½˜l‰±¥¡Ğˆ°‰‘…É¬‰t¥ì(€€…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”¡Ù…±Õ”ôù‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÙ…±Õ”±Ñ¡•µ”¤ì(€€…İ…¥ĞÁ…”¹µ½ÕÍ”¹µ½Ù” À°À¤ì(€€½¹ÍĞ¡…ÁÑ•ÈõÁ…”¹±½…Ñ½È ˆ¹…Í”µÍ•Ñ¥½¸µ±¥¹­Ì‰ÕÑÑ½¸ˆ¤¹±…ÍĞ ¤ì(€€…İ…¥Ğ¡…ÁÑ•È¹¡½Ù•È ¤ì(€€½¹ÍĞÉ•ÍÕ±Ğõ…İ…¥Ğ¡…ÁÑ•È¹•Ù…±Õ…Ñ”¡¹½‘”ôùì(€€€½¹ÍĞÍÑå±”õ•Ñ½µÁÕÑ•‘MÑå±”¡¹½‘”¤ì(€€€½¹ÍĞÉˆõÙ…±Õ”ôùì(€€€€½¹ÍĞ…¹Ù…Ìõ‘½Õµ•¹Ğ¹É•…Ñ•±•µ•¹Ğ ‰…¹Ù…Ìˆ¤ì(€€€€…¹Ù…Ì¹İ¥‘Ñ õ…¹Ù…Ì¹¡•¥¡ĞôÄì(€€€€½¹ÍĞÑàõ…¹Ù…Ì¹•Ñ½¹Ñ•áĞ ˆÉˆ¤ì(€€€€Ñà¹™¥±±MÑå±”õÙ…±Õ”íÑà¹™¥±±I•Ğ À°À°Ä°Ä¤ì(€€€€É•ÑÕÉ¸l¸¸¹Ñà¹•Ñ%µ…•…Ñ„ À°À°Ä°Ä¤¹‘…Ñ…t¹Í±¥” À°Ì¤ì(€€€ôì(€€€½¹ÍĞ±Õµ¥¹…¹”õÙ…±Õ”ôùì(€€€€½¹ÍĞmÈ±œ±‰tõÉˆ¡Ù…±Õ”¤¹µ…À¡ØôùØ¼ÈÔÔ¤¹µ…À¡ØôùØğô¸ÀĞÀĞÔıØ¼ÄÈ¸äÈè ¡Ø¬¸ÀÔÔ¤¼Ä¸ÀÔÔ¤¨¨È¸Ğ¤ì(€€€€É•ÑÕÉ¸€¸ÈÄÈØ©È¬¸ÜÄÔÈ©œ¬¸ÀÜÈÈ©ˆì(€€€ôì(€€€½¹ÍĞm¡¤±±½tõm±Õµ¥¹…¹”¡ÍÑå±”¹½±½È¤±±Õµ¥¹…¹”¡ÍÑå±”¹‰…­É½Õ¹‘½±½È¥t¹Í½ÉĞ ¡„±ˆ¤ôùˆµ„¤ì(€€€É•ÑÕÉ¸í½¹ÑÉ…ÍĞè¡¡¤¬¸ÀÔ¤¼¡±¼¬¸ÀÔ¤±µ¥¹!•¥¡ĞéÁ…ÉÍ•±½…Ğ¡ÍÑå±”¹µ¥¹!•¥¡Ğ¤±ÑÉ…¹Í¥Ñ¥½¸éÍÑå±”¹ÑÉ…¹Í¥Ñ¥½¹ÕÉ…Ñ¥½¹ôì(€€ô¤ì(€€…ÍÍ•ÉĞ¹½¬¡É•ÍÕ±Ğ¹½¹ÑÉ…ÍĞøôĞ¸Ô±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè¡…ÁÑ•È¡½Ù•È¹••‘Ì€Ğ¸ÔèÄ½¹ÑÉ…ÍĞ€¡½Ğ€ˆ­É•ÍÕ±Ğ¹½¹ÑÉ…ÍĞ¹Ñ½¥á• È¤¬ˆ¤ˆ¤ì(€€…ÍÍ•ÉĞ¹½¬¡É•ÍÕ±Ğ¹µ¥¹!•¥¡ĞøôĞĞ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè¡…ÁÑ•ÈÑ½Õ Ñ…É•ĞÉ•µ…¥¹Ì€ĞÑÁàˆ¤ì(€€…ÍÍ•ÉĞ¹½¬¡Á…ÉÍ•±½…Ğ¡É•ÍÕ±Ğ¹ÑÉ…¹Í¥Ñ¥½¸¤ğôÀ¸ÀÀÄ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆèÉ•‘Õ•µ½Ñ¥½¸­••ÁÌ¡…ÁÑ•ÈÑÉ…¹Í¥Ñ¥½¹Ì•™™•Ñ¥Ù•±ä¥¹ÍÑ…¹Ğˆ¤ì(€ô(€…İ…¥ĞÁ…”¹•µÕ±…Ñ•5•‘¥„¡íÉ•‘Õ•‘5½Ñ¥½¸è‰¹¼µÁÉ•™•É•¹”‰ô¤ì(ô(€¼¼Q¡”½¹Í½±¥‘…Ñ•‰É•…­Á½¥¹ÑÌµÕÍĞÁÉ•Í•ÉÙ”™…ÑÌ°…±±•Éä°•Ù¥‘•¹”°…¹(€¼¼ÍÑ¥­ä¡…ÁÑ•È½™™Í•ÑÌ…É½ÍÌÑ¡•¥È•á…Ğ‰½Õ¹‘…É¥•Ì¥¸‰½Ñ Ñ¡•µ•Ì¸(™½È¡½¹ÍĞİ¥‘Ñ ½˜lÌÈÀ°ĞàÀ°ĞàÄ°ØÀÀ°ØÔÀ°ØÔÄ°ÜØÀ°ÜØÅt¥ì(€…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ ±¡•¥¡ĞèàĞÑô¤ì(€™½È¡½¹ÍĞÑ¡•µ”½˜l‰±¥¡Ğˆ°‰‘…É¬‰t¥ì(€€…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”¡Ù…±Õ”ôù‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÙ…±Õ”±Ñ¡•µ”¤ì(€€¥˜¡İ¥‘Ñ ğôØÔÀ¥ì(€€€€¼¼I•Í¥é•=‰Í•ÉÙ•ÈÁÕ‰±¥Í¡•ÌÑ¡”µ•…ÍÕÉ•¡•¥¡Ğ…Íå¹¡É½¹½ÕÍ±ä¸]…¥Ğ(€€€€¼¼™½È¥Ğ‰•™½É”½µÁ…É¥¹œÑ¡”¡…ÁÑ•È½™™Í•ĞÑ¼Ñ¡”Ù¥Í¥‰±”¡•…‘•È¸(€€€…İ…¥ĞÁ…”¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôùì(€€€€½¹ÍĞ¡•…‘•Èõ‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹Í¥Ñ”µ¡•…‘•Èˆ¤ì(€€€€½¹ÍĞµ•…ÍÕÉ•õÁ…ÉÍ•±½…Ğ¡•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¤(€€€€€€¹•ÑAÉ½Á•ÉÑåY…±Õ” ˆ´µµ½‰¥±”µÍ¥Ñ”µ¡•…‘•Èµ¡•¥¡Ğˆ¤¤ì(€€€€É•ÑÕÉ¸9Õµ‰•È¹¥Í¥¹¥Ñ”¡µ•…ÍÕÉ•¤˜˜(€€€€€5…Ñ ¹…‰Ì¡µ•…ÍÕÉ•µ5…Ñ ¹•¥°¡¡•…‘•È¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤¹¡•¥¡Ğ¤¤ğôÄì(€€€ô¤ì(€€ô(€€½¹ÍĞµ•ÑÉ¥Ìõ…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”¡Ñ¡•µ”ôùì(€€€‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÑ¡•µ”ì(€€€½¹ÍĞ½±Õµ¹ÌõÍ•±•Ñ½Èôù•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È¡Í•±•Ñ½È¤¤¹É¥‘Q•µÁ±…Ñ•½±Õµ¹Ì¹ÑÉ¥´ ¤¹ÍÁ±¥Ğ ½qÌ¬¼¤¹±•¹Ñ ì(€€€½¹ÍĞ™…ÑÌõ•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µ™…ÑÌˆ¤¤ì(€€€É•ÑÕÉ¸ì(€€€€™…ÑÍ¥ÍÁ±…äé™…ÑÌ¹‘¥ÍÁ±…ä±™…Ñ½±Ìé½±Õµ¹Ì ˆ¹…Í”µ™…ÑÌˆ¤°(€€€€•Ù¥‘•¹•½±Ìé½±Õµ¹Ì ˆ¹…Í”µ•Ù¥‘•¹”ˆ¤±…±±•Éå½±Ìé½±Õµ¹Ì ˆ¹…Í”µ…±±•Éäˆ¤°(€€€€ÍÑ¥­åQ½ÀéÁ…ÉÍ•±½…Ğ¡•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µÍ•Ñ¥½¸µ±¥¹­Ìˆ¤¤¹Ñ½À¤°(€€€€¡•…‘•É!•¥¡Ğé‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹Í¥Ñ”µ¡•…‘•Èˆ¤¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤¹¡•¥¡Ğ°(€€€€½Ù•É™±½Üé‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹ÍÉ½±±]¥‘Ñ µ¥¹¹•É]¥‘Ñ (€€€ôì(€€ô±Ñ¡•µ”¤ì(€€¥˜¡İ¥‘Ñ ğôÜØÀ¥ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…ÑÍ¥ÍÁ±…ä°‰É¥ˆ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè™…ÑÌÕÍ”Ñ¡”É•ÍÁ½¹Í¥Ù”É¥ˆ¤ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…Ñ½±Ì±İ¥‘Ñ ğôĞàÀüÄèÈ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè™…ÑÌ½±Õµ¹Ìˆ¤ì(€€õ•±Í”…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹™…ÑÍ¥ÍÁ±…ä°‰™±•àˆ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè‘•Í­Ñ½À™…ÑÌÉ•µ…¥¸™±•àˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹•Ù¥‘•¹•½±Ì±İ¥‘Ñ ğôÜØÀüÄèÌ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè•Ù¥‘•¹”½±Õµ¹Ìˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹…±±•Éå½±Ì±İ¥‘Ñ ğôÜØÀüÄèÈ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè…±±•Éä½±Õµ¹Ìˆ¤ì(€€¥˜¡İ¥‘Ñ ğôØÔÀ¥ì(€€€…ÍÍ•ÉĞ¹½¬¡5…Ñ ¹…‰Ì¡µ•ÑÉ¥Ì¹ÍÑ¥­åQ½Àµ5…Ñ ¹•¥°¡µ•ÑÉ¥Ì¹¡•…‘•É!•¥¡Ğ¤¤ğôÄ°(€€€€İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆèÁ¡½¹”¡…ÁÑ•È½™™Í•Ğ™½±±½İÌ…ÑÕ…°ÍÑ¥­ä¡•…‘•È¡•¥¡Ğ€¡½™™Í•Ğôˆ­µ•ÑÉ¥Ì¹ÍÑ¥­åQ½À¬ˆ°¡•¥¡Ğôˆ­µ•ÑÉ¥Ì¹¡•…‘•É!•¥¡Ğ¬ˆ¤ˆ¤ì(€€õ•±Í•ì(€€€…ÍÍ•ÉĞ¹•ÅÕ…°¡µ•ÑÉ¥Ì¹ÍÑ¥­åQ½À±İ¥‘Ñ ğôÜØÀüØĞèÜÈ°(€€€€İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆèÑ…‰±•Ğ½‘•Í­Ñ½À¡…ÁÑ•È½™™Í•ĞÉ•µ…¥¹ÌÕ¹¡…¹•ˆ¤ì(€€ô(€€…ÍÍ•ÉĞ¹½¬¡µ•ÑÉ¥Ì¹½Ù•É™±½ÜğôÈ±İ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆè¹¼¡½É¥é½¹Ñ…°Á…”½Ù•É™±½Üˆ¤ì(€ô(ô(…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”  ¤ôùí‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”ô‰±¥¡Ğ‰ô¤ì(…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ èÄÈàÀ±¡•¥¡ĞèÜÈÁô¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ™…ÑÌ‘Ğˆ¤¹…±±Q•áÑ½¹Ñ•¹ÑÌ ¤¹Ñ¡•¸¡±…‰•±Ìôù±…‰•±Ì¹Í½µ”¡±…‰•°ôù±…‰•°¹ÑÉ¥´ ¤ôôô‰5äÉ½±”ˆ¤¤±ÑÉÕ”°‰…Í”™…ÑÌÍ¡½Õ±•áÁ½Í”Ñ¡”‘•Í¥¹•ÈÌ…ÑÕ…°½¹ÑÉ¥‰ÕÑ¥½¸ˆ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ™…ÑÌˆ¤¹¥¹¹•ÉQ•áĞ ¤°½AÉ½‘ÕĞU`…¹Ù¥ÍÕ…°‘•Í¥¸¼°‰I½±”µÕÍĞÕÍ”É•Ù¥•İ•ÁÉ½©•Ğµ•Ñ…‘…Ñ„ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ‘•±¥Ù•ÉäµÍÑ…µÀˆ¤¹½Õ¹Ğ ¤°À°‰•Í¥¸½¹ÑÉ¥‰ÕÑ¥½¹Ìİ¥Ñ¡½ÕĞÙ•É¥™¥•Í¡¥ÁÁ¥¹œµÕÍĞ¹½Ğ•Ğ„Í¡¥ÁÁ•ÍÑ…µÀˆ¤ì(€¼¼¥ÍÑ¥¹Õ¥Í ‘½Õµ•¹Ñ••Ù¥‘•¹”‰½Õ¹‘…É¥•Ì™É½´‘•Í¥¸É•…Í½¹¥¹œİ¥Ñ¡½ÕĞ(€¼¼ÕÍ¥¹œ½±½È…±½¹”èÑ¡”Ù¥Í¥‰±”¡•…‘¥¹ÌÉ•µ…¥¸‘¥™™•É•¹Ğ¥¸‰½Ñ Ñ¡•µ•Ì¸(…ÍÍ•ÉĞ¹‘••ÁÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µÁÉ½•ÍÌµ¹½Ñ”ˆ¤¹•Ù…±Õ…Ñ•±°¡¹½‘•Ìôù¹½‘•Ì¹µ…À¡¹½‘”ôù¹½‘”¹‘…Ñ…Í•Ğ¹¹½Ñ•-¥¹¤¤±l‰•Ù¥‘•¹”ˆ°‰É…Ñ¥½¹…±”‰t¤ì(™½È¡½¹ÍĞÑ¡•µ”½˜l‰±¥¡Ğˆ°‰‘…É¬‰t¥ì(€½¹ÍĞ‰½É‘•ÉÌõ…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”¡Ñ¡•µ”ôùì(€€‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÑ¡•µ”ì(€€É•ÑÕÉ¸l¸¸¹‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½É±° ˆ¹…Í”µÁÉ½•ÍÌµ¹½Ñ”ˆ¥t¹µ…À¡¹½‘”ôù•Ñ½µÁÕÑ•‘MÑå±”¡¹½‘”¤¹‰½É‘•É1•™Ñ½±½È¤ì(€ô±Ñ¡•µ”¤ì(€…ÍÍ•ÉĞ¹¹½ÑÅÕ…°¡‰½É‘•ÉÍlÁt±‰½É‘•ÉÍlÅt±Ñ¡•µ”¬ˆ•Ù¥‘•¹”…¹É…Ñ¥½¹…±”¹••‘¥ÍÑ¥¹Ğ…¹¹½Ñ…Ñ¥½¸ÉÕ±•Ìˆ¤ì(ô(…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”  ¤ôùí‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”ô‰±¥¡Ğ‰ô¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µÍ•Ñ¥½¸µ±¥¹­Ì‰ÕÑÑ½¸ˆ¤¹™¥ÉÍĞ ¤¹±¥¬ ¤ì(€¼¼Ù¥‘•¹”‰½Õ¹‘…É¥•ÌµÕÍĞ‰”•…ÍäÑ¼™¥¹…¹­•å‰½…Éµ™½ÕÍ…‰±”¸(…İ…¥ĞÁ…”¹±½…Ñ½È m‘…Ñ„µ…Í”µ©ÕµÀô‰…Í”µ•Ù¥‘•¹”µ¹½Ñ•Ì‰tœ¤¹±¥¬ ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ…Í”µ•Ù¥‘•¹”µ¹½Ñ•Ìˆ¤¹•Ù…±Õ…Ñ”¡¹½‘”ôù‘½Õµ•¹Ğ¹…Ñ¥Ù•±•µ•¹Ğôôõ¹½‘”¤±ÑÉÕ”°‰Ù¥‘•¹”¡•…‘¥¹œÍ¡½Õ±É••¥Ù”™½ÕÌˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µÍ•Ñ¥½¸µ±¥¹­Ì‰ÕÑÑ½¹m…É¥„µÕÉÉ•¹Ğô±½…Ñ¥½¸tˆ¤¹½Õ¹Ğ ¤øÀ±ÑÉÕ”¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ¹•áĞµ¹…Ø…m¡É•™xôœ½…Í”µÍÑÕ‘¥•Ì¼tˆ¤¹±¥¬ ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡Á…”¹ÕÉ° ¤°½p½…Í”µÍÑÕ‘¥•Íp½¡½å±Õp½µ½‰¥±”µ¥¹Í¥¡ÑÍp¼¼¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µÁÉ½Í”ˆ¤¹¥¹¹•ÉQ•áĞ ¤°½5½‰¥±”%¹Í¥¡ÑÌ¥Ì„Í¡¥ÁÁ•ÁÉ½‘ÕĞ•áÁ•É¥•¹”¼°‰5½‰¥±”%¹Í¥¡ÑÌ…Í”ÍÑÕ‘äÍ¡½Õ±‘•ÍÉ¥‰”¥ÑÌ…ÑÕ…°‘•±¥Ù•ÉäÍÑ…ÑÕÌˆ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ•Ù¥‘•¹”ˆ¤¹¥¹¹•ÉQ•áĞ ¤°½M¡¥ÁÁ•ÁÉ½‘ÕĞ½¹ÑÉ¥‰ÕÑ¥½¸¼°‰Q¡”ÁÉ½©•Ğ½Ù•ÉÙ¥•ÜµÕÍĞ¥‘•¹Ñ¥™ä5½‰¥±”%¹Í¥¡ÑÌ…ÌÍ¡¥ÁÁ•ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ‘•±¥Ù•ÉäµÍÑ…µÀˆ¤¹¥¹¹•ÉQ•áĞ ¤°‰M!%AAAI=UP=9QI%	UQ%=8ˆ°‰M¡¥ÁÁ•‘•±¥Ù•ÉäµÕÍĞ‰”Ù¥Í¥‰±”…‰½Ù”Ñ¡”™½±ˆ¤ì(½¹ÍĞµ½‰¥±•ÁÁÉ½… õ…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ¡•…€¹…Í”µ…ÁÁÉ½… ˆ¤¹¥¹¹•ÉQ•áĞ ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡µ½‰¥±•ÁÁÉ½… °½•Í¥¸…ÁÁÉ½… ½¤¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡µ½‰¥±•ÁÁÉ½… °¼ üéÍÑ…¹½ÕÑñÁÉ¥½É¥Ññ¡¥•É…É¡ñ‘•Ñ…¥±ñÑ…À¤½¤°(€€‰M¡¥ÁÁ•5½‰¥±”%¹Í¥¡ÑÌÍ¡½Õ±Í¡½Ü„½¹É•Ñ”Íµ…±°µÍÉ••¸‘•Í¥¸É…Ñ¥½¹…±”ˆ¤ì(…ÍÍ•ÉĞ¹‘½•Í9½Ñ5…Ñ ¡µ½‰¥±•ÁÁÉ½… °½qˆ üé¥¹Ñ•ÉÙ¥•İÌÁÉ½Ù•‘ñÉ•Í•…É Í¡½İ•‘ñÑ•ÍÑ•ÕÍ•ÉÌ¥qˆ½¤°(€€‰5½‰¥±”%¹Í¥¡ÑÌ½Ù•ÈµÕÍĞ¹½Ğ¥µÁ±äÕ¹‘½Õµ•¹Ñ•É•Í•…É ˆ¤ì(…İ…¥ĞÁ…”¹½	…¬ ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡Á…”¹ÕÉ° ¤°½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ‰…¬ˆ¤¹±¥¬ ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡Á…”¹ÕÉ° ¤°½p¼İ½É¬¼¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆµ…¥¸ˆ¤¹¥ÍY¥Í¥‰±” ¤±ÑÉÕ”¤ì(…ÍÍ•ÉĞ¹‘••ÁÅÕ…°¡…İ…¥ĞÉ•…‘5•Ñ…‘…Ñ„¡Á…”¤±¡½µ•Á…•5•Ñ…‘…Ñ„°‰I•ÑÕÉ¹¥¹œ™É½´„…Í”ÍÑÕ‘äµÕÍĞÉ•ÍÑ½É”¡½µ•Á…”Ñ¥Ñ±”°…¹½¹¥…°°…¹Í½¥…°ÁÉ•Ù¥•İÌˆ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹ÁÉ½©•Ğµ…Éµ±¥¹­m¡É•˜ôœ½…Í”µÍÑÕ‘¥•Ì½¡½å±Ô½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼tˆ¤¹™¥ÉÍĞ ¤¹±¥¬ ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È œ¹Í¥Ñ”µ¡•…‘•È¹…Ø…m¡É•˜ôˆ¼…‰½ÕĞ‰tœ¤¹±¥¬ ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡Á…”¹ÕÉ° ¤°½p¼…‰½ÕĞ¼¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆµ…¥¸ˆ¤¹¥ÍY¥Í¥‰±” ¤±ÑÉÕ”¤ì(…ÍÍ•ÉĞ¹‘••ÁÅÕ…°¡…İ…¥ĞÉ•…‘5•Ñ…‘…Ñ„¡Á…”¤±¡½µ•Á…•5•Ñ…‘…Ñ„°‰9…Ù¥…Ñ¥¹œ™É½´„…Í”ÍÑÕ‘äÑ¼‰½ÕĞµÕÍĞ…±Í¼É•ÍÑ½É”¡½µ•Á…”µ•Ñ…‘…Ñ„ˆ¤ì(€¼¼…Í”µÍÑÕ‘ä±¥¹¬ÕÍ•ÌÁÕÍ¡MÑ…Ñ”°İ¡¥ •µ¥ÑÌ¹•¥Ñ¡•È¡…Í¡¡…¹”¹½È(€¼¼Á½ÁÍÑ…Ñ”¸Q¡”¡•…‘•ÈµÕÍĞ¥‘•¹Ñ¥™ä]½É¬É…Ñ¡•ÈÑ¡…¸±•…Ù¥¹œ‰½ÕĞ(€¼¼…¹¹½Õ¹•…ÌÑ¡”ÕÉÉ•¹Ğ±½…Ñ¥½¸™É½´Ñ¡”ÁÉ•Ù¥½ÕÌÙ¥•Ü¸(…İ…¥ĞÁ…”¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôù‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È œ¹Í¥Ñ”µ¡•…‘•È¹…Ø…m¡É•˜ôˆ¼…‰½ÕĞ‰tœ¤ü¹•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µÕÉÉ•¹Ğˆ¤ôôô‰±½…Ñ¥½¸ˆ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹ÁÉ½©•Ğµ…Éµ±¥¹­m¡É•˜ôœ½…Í”µÍÑÕ‘¥•Ì½¡½å±Ô½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼tˆ¤¹™¥ÉÍĞ ¤¹±¥¬ ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ…Í”µÑ¥Ñ±”ˆ¤¹İ…¥Ñ½È ¤ì(…İ…¥ĞÁ…”¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôù‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È œ¹Í¥Ñ”µ¡•…‘•È¹…Ø…m¡É•˜ôˆ¼İ½É¬‰tœ¤ü¹•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µÕÉÉ•¹Ğˆ¤ôôô‰±½…Ñ¥½¸ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È œ¹Í¥Ñ”µ¡•…‘•È¹…Ø…m¡É•˜ôˆ¼…‰½ÕĞ‰tœ¤¹•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µÕÉÉ•¹Ğˆ¤±¹Õ±°°‰‰½ÕĞµÕÍĞ¹½ĞÉ•µ…¥¸ÕÉÉ•¹Ğ½¸„…Í”µÍÑÕ‘äÉ½ÕÑ”ˆ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹…Í”µ‰…¬ˆ¤¹±¥¬ ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ˆµ…¥¸ˆ¤¹İ…¥Ñ½È¡íÍÑ…Ñ”è‰Ù¥Í¥‰±”‰ô¤ì(€¼¼1•…Ù¥¹œ„…Í”ÍÑÕ‘äÉ•ÍÑ½É•Ì™½ÕÌ½ÍÉ½±°Ñ¼Ñ¡”½Á•¹•È¥¸…¸…¹¥µ…Ñ¥½¸(€¼¼™É…µ”¸]…¥Ğ™½ÈÑ¡…ĞÉ•ÍÑ½É…Ñ¥½¸‰•™½É”‘•±¥‰•É…Ñ•±äÍÉ½±±¥¹œÑ¼Ñ¡”(€¼¼™½½Ñ•È°½È¥ÑÌÁ•¹‘¥¹œÍÉ½±°…¸½Ù•ÉÉ¥‘”½ÕÈÑ•ÍĞÌÍÉ½±±Q¼¡‰½ÑÑ½´¤¸(…İ…¥ĞÁ…”¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôù‘½Õµ•¹Ğ¹…Ñ¥Ù•±•µ•¹Ğü¹±…ÍÍ1¥ÍĞ¹½¹Ñ…¥¹Ì ‰ÁÉ½©•Ğµ…Éµ±¥¹¬ˆ¤¤ì(€¼¼Q¡”½¹Ñ…Ğ±¥¹¬½Á•¹Ìµ…¥°°¹½Ğ…¸¥¸µÁ…”±½…Ñ¥½¸¸AÉ•Í•ÉÙ”Ñ¡”Ù¥ÍÕ…°(€¼¼¹•…Èµ™½½Ñ•ÈÕ¹‘•É±¥¹”İ¥Ñ¡½ÕĞµ¥ÍÉ•Á½ÉÑ¥¹œ…É¥„µÕÉÉ•¹ĞÑ¼ÍÉ••¸É•…‘•ÉÌ¸(…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”  ¤ôùİ¥¹‘½Ü¹ÍÉ½±±Q¼ À±‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹ÍÉ½±±!•¥¡Ğ¤¤ì(…İ…¥ĞÁ…”¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôù‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹¡•…‘•Èµ½¹Ñ…Ğˆ¤ü¹¡…ÍÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µÍ•Ñ¥½¸µ…Ñ¥Ù”ˆ¤¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹¡•…‘•Èµ½¹Ñ…Ğˆ¤¹•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µÕÉÉ•¹Ğˆ¤±¹Õ±°°‰5…¥±Ñ¼½¹Ñ…ĞµÕÍĞ¹½Ğ…¹¹½Õ¹”„ÕÉÉ•¹ĞÁ…”±½…Ñ¥½¸ˆ¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥ĞÁ…”¹±½…Ñ½È ˆ¹¡•…‘•Èµ½¹Ñ…Ğˆ¤¹•Ù…±Õ…Ñ”¡¹½‘”ôù•Ñ½µÁÕÑ•‘MÑå±”¡¹½‘”¤¹Ñ•áÑ•½É…Ñ¥½¹1¥¹”¤°½Õ¹‘•É±¥¹”¼°‰9•…Èµ™½½Ñ•È½¹Ñ…ĞÍ¡½Õ±É•µ…¥¸Ù¥Í¥‰±äÕ¹‘•É±¥¹•ˆ¤ì(€¼¼Q¡”™½½Ñ•ÈÍÕÉ™…”µÕÍĞÉ•… Ñ¡”Ù¥•İÁ½ÉĞ•‘•Ì°¹½ĞÍÑ½À…Ğ€¹İÉ…ÀÌ(€¼¼€ÄÌÈÁÁà½¹Ñ•¹Ğİ¥‘Ñ €¡İ¡¥ İ½Õ±•áÁ½Í”Ñ¡”¹½Ñ•‰½½¬‘½ÑÌ½¸‘•Í­Ñ½À¤¸(…İ…¥ĞÁ…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ èÄĞĞÀ±¡•¥¡ĞèäÀÁô¤ì(½¹ÍĞ™½½Ñ•É	½Õ¹‘Ìõ…İ…¥ĞÁ…”¹±½…Ñ½È ‰™½½Ñ•È¹İÉ…Àˆ¤¹•Ù…±Õ…Ñ”¡¹½‘”ôùì(€½¹ÍĞ‰½Õ¹‘Ìõ¹½‘”¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤ì(€É•ÑÕÉ¸í±•™Ğé‰½Õ¹‘Ì¹±•™Ğ±İ¥‘Ñ é‰½Õ¹‘Ì¹İ¥‘Ñ ±Ù¥•İÁ½ÉĞé‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹±¥•¹Ñ]¥‘Ñ¡ôì(ô¤ì(…ÍÍ•ÉĞ¹½¬¡5…Ñ ¹…‰Ì¡™½½Ñ•É	½Õ¹‘Ì¹±•™Ğ¤ğôÄ˜™™½½Ñ•É	½Õ¹‘Ì¹İ¥‘Ñ øõ™½½Ñ•É	½Õ¹‘Ì¹Ù¥•İÁ½ÉĞ´È°‰½½Ñ•ÈÁ…Á•ÈµÕÍĞ‰”™Õ±°‰±••…Ğ‘•Í­Ñ½Àİ¥‘Ñ¡Ìˆ¤ì(…İ…¥ĞÁ…”¹±½…Ñ½È ‰™½½Ñ•È¹İÉ…À„ˆ¤¹™½ÕÌ ¤ì(€¼¼AÉ½É…µµ…Ñ¥Œ™½ÕÌ…™Ñ•Èµ½ÕÍ”±¥­Ì‘½•Ì¹½Ğ¹••ÍÍ…É¥±äµ…Ñ €é™½ÕÌµÙ¥Í¥‰±”¸(€¼¼5½Ù”™½ÕÌ…İ…ä…¹‰…¬ÕÍ¥¹œÑ¡”­•å‰½…ÉÑ¼Ñ•ÍĞÑ¡”…ÑÕ…°µ½‘…±¥Ñä¸(…İ…¥ĞÁ…”¹­•å‰½…É¹ÁÉ•ÍÌ ‰Q…ˆˆ¤ì(…İ…¥ĞÁ…”¹­•å‰½…É¹ÁÉ•ÍÌ ‰M¡¥™Ğ­Q…ˆˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ‰™½½Ñ•È¹İÉ…À„ˆ¤¹•Ù…±Õ…Ñ”¡¹½‘”ôù‘½Õµ•¹Ğ¹…Ñ¥Ù•±•µ•¹Ğôôõ¹½‘”¤±ÑÉÕ”°‰-•å‰½…É™½ÕÌÍ¡½Õ±É•ÑÕÉ¸Ñ¼Ñ¡”™½½Ñ•È±¥¹¬ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥ĞÁ…”¹±½…Ñ½È ‰™½½Ñ•È¹İÉ…À„ˆ¤¹•Ù…±Õ…Ñ”¡¹½‘”ôù•Ñ½µÁÕÑ•‘MÑå±”¡¹½‘”¤¹½ÕÑ±¥¹•MÑå±”¤°‰Í½±¥ˆ°‰½½Ñ•È±¥¹¬¹••‘Ì„Ù¥Í¥‰±”­•å‰½…É™½ÕÌ½ÕÑ±¥¹”ˆ¤ì(€¼¼½µÁÕÑ•µÍÑå±”¡•¬…Ñ¡•Ì„ÑÉ…¹ÍÁ…É•¹Ğ™½½Ñ•È¥¸•¥Ñ¡•ÈÑ¡•µ”¸(€¼¼%Ğ‘½•Ì¹½ĞÉ•Á±…”Ù¥ÍÕ…°½ÈÍÉ••¹Í¡½ĞE½¸Ñ¡”‘•Á±½å•Í¥Ñ”¸(™½È¡½¹ÍĞÑ¡•µ”½˜l‰±¥¡Ğˆ°‰‘…É¬‰t¥ì(€½¹ÍĞ¡É½µ”õ…İ…¥ĞÁ…”¹•Ù…±Õ…Ñ”¡Ñ¡•µ”ôùì(€€‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹Í•ÑÑÑÉ¥‰ÕÑ” ‰‘…Ñ„µÑ¡•µ”ˆ±Ñ¡•µ”¤ì(€€½¹ÍĞ™½½Ñ•Èõ•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ‰™½½Ñ•È¹İÉ…Àˆ¤¤ì(€€½¹ÍĞ¡•…‘•Èõ•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹Í¥Ñ”µ¡•…‘•Èˆ¤¤ì(€€É•ÑÕÉ¸í™½½Ñ•É½±½Èé™½½Ñ•È¹‰…­É½Õ¹‘½±½È±™½½Ñ•É%µ…”é™½½Ñ•È¹‰…­É½Õ¹‘%µ…”±¡•…‘•É½±½Èé¡•…‘•È¹‰…­É½Õ¹‘½±½Éôì(€ô±Ñ¡•µ”¤ì(€…ÍÍ•ÉĞ¹¹½ÑÅÕ…°¡¡É½µ”¹™½½Ñ•É½±½È°‰ÑÉ…¹ÍÁ…É•¹Ğˆ±Ñ¡•µ”¬ˆ™½½Ñ•ÈµÕÍĞ‰”½Á…ÅÕ”ˆ¤ì(€…ÍÍ•ÉĞ¹¹½ÑÅÕ…°¡¡É½µ”¹™½½Ñ•É½±½È°‰É‰„ À°€À°€À°€À¤ˆ±Ñ¡•µ”¬ˆ™½½Ñ•ÈµÕÍĞ‰”½Á…ÅÕ”ˆ¤ì(€…ÍÍ•ÉĞ¹•ÅÕ…°¡¡É½µ”¹™½½Ñ•É%µ…”°‰¹½¹”ˆ±Ñ¡•µ”¬ˆ™½½Ñ•ÈµÕÍĞ¹½ĞÍ¡½ÜÑ¡”Á…”Ñ•áÑÕÉ”ˆ¤ì(€…ÍÍ•ÉĞ¹•ÅÕ…°¡¡É½µ”¹™½½Ñ•É½±½È±¡É½µ”¹¡•…‘•É½±½È±Ñ¡•µ”¬ˆ¡•…‘•È…¹™½½Ñ•ÈÍ¡½Õ±Í¡…É”Ñ¡”Á…Á•ÈÍÕÉ™…”ˆ¤ì(ô(€¼¼A…ÍÌ€ÄØè½¹”…Í”µÍÑÕ‘äÍÑå±•Í¡••ĞµÕÍĞÁÉ•Í•ÉÙ”Ñ¡”ÍÑÉÕÑÕÉ…°‘•™…Õ±ÑÌ(€¼¼ÁÉ•Ù¥½ÕÍ±ä±½…‘•‰•™½É”Ñ¡”½µÁ½¹•¹Ğ°¥¸‰½Ñ Ñ¡•µ•Ì…¹…ĞÁ¡½¹”½‘•Í­Ñ½À¸(½¹ÍĞ…Í•=İ¹•ÉA…”õ…İ…¥Ğ‰É½İÍ•È¹¹•İA…” ¤ì(…Í•=İ¹•ÉA…”¹½¸ ‰Á…••ÉÉ½Èˆ±•ÉÉ½Èôù•ÉÉ½ÉÌ¹ÁÕÍ ¡•ÉÉ½È¹µ•ÍÍ…”¤¤ì(…İ…¥Ğ…Í•=İ¹•ÉA…”¹½Ñ¼¡½É¥¥¸¬ˆ½…Í”µÍÑÕ‘¥•Ì½¡½å±Ô½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼ˆ¤ì(…İ…¥Ğ…Í•=İ¹•ÉA…”¹±½…Ñ½È ˆ¹…Í”µÙ¥•Ü€¹…Í”µ¡•…ˆ¤¹İ…¥Ñ½È ¤ì(™½È¡½¹ÍĞİ¥‘Ñ ½˜lÌäÀ°ÄÈàÁt¥ì(€…İ…¥Ğ…Í•=İ¹•ÉA…”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ ±¡•¥¡ĞèàĞÑô¤ì(€™½È¡½¹ÍĞÑ¡•µ”½˜l‰±¥¡Ğˆ°‰‘…É¬‰t¥ì(€€½¹ÍĞÙ…±Õ•Ìõ…İ…¥Ğ…Í•=İ¹•ÉA…”¹•Ù…±Õ…Ñ”¡Ñ¡•µ”ôùì(€€€‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹‘…Ñ…Í•Ğ¹Ñ¡•µ”õÑ¡•µ”ì(€€€½¹ÍĞÍÑå±”õÍ•±•Ñ½Èôù•Ñ½µÁÕÑ•‘MÑå±”¡‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È¡Í•±•Ñ½È¤¤ì(€€€½¹ÍĞ½Ù•Èõ‘½Õµ•¹Ğ¹É•…Ñ•±•µ•¹Ğ ‰‘¥Øˆ¤ì(€€€½Ù•È¹±…ÍÍ9…µ”ô‰…Í”µ¡•É¼µÙ¥ÍÕ…°ˆì(€€€½Ù•È¹¥¹¹•É!Q50ôœñ¥µœ…±Ğôˆˆ€¼øœì(€€€‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µÙ¥•Üˆ¤¹…ÁÁ•¹¡½Ù•È¤ì(€€€½¹ÍĞ½Ù•ÉMÑå±”õ•Ñ½µÁÕÑ•‘MÑå±”¡½Ù•È¤ì(€€€½¹ÍĞÉ•ÍÕ±Ğõì(€€€€Á…•	…­É½Õ¹éÍÑå±” ˆ¹…Í”µÙ¥•Üˆ¤¹‰…­É½Õ¹‘½±½È°(€€€€Á…Á•É	…­É½Õ¹éÍÑå±” ‰‰½‘äˆ¤¹‰…­É½Õ¹‘½±½È°(€€€€µ¥¹!•¥¡ĞéÁ…ÉÍ•±½…Ğ¡ÍÑå±” ˆ¹…Í”µÙ¥•Üˆ¤¹µ¥¹!•¥¡Ğ¤°(€€€€‰½‘å½±Õµ¹ÌéÍÑå±” ˆ¹…Í”µ‰½‘äˆ¤¹É¥‘Q•µÁ±…Ñ•½±Õµ¹Ì¹ÑÉ¥´ ¤¹ÍÁ±¥Ğ ½qÌ¬¼¤¹±•¹Ñ °(€€€€‰…­¥ÍÁ±…äéÍÑå±” ˆ¹…Í”µ‰…¬ˆ¤¹‘¥ÍÁ±…ä°(€€€€¹•áÑ5…É¥¹Q½ÀéÁ…ÉÍ•±½…Ğ¡ÍÑå±” ˆ¹…Í”µ¹•áĞµ¹…Ø€¹…Í”µ¹•áĞˆ¤¹µ…É¥¹Q½À¤°(€€€€¡•…‘¥¹…µ¥±äéÍÑå±” ˆ¹…Í”µÁÉ½Í” Èˆ¤¹™½¹Ñ…µ¥±ä°(€€€€¡•…‘¥¹]•¥¡ĞéÍÑå±” ˆ¹…Í”µÁÉ½Í” Èˆ¤¹™½¹Ñ]•¥¡Ğ°(€€€€½Ù•É!•¥¡ĞéÁ…ÉÍ•±½…Ğ¡½Ù•ÉMÑå±”¹¡•¥¡Ğ¤°(€€€€½Ù•É=‰©•Ñ¥Ğé•Ñ½µÁÕÑ•‘MÑå±”¡½Ù•È¹ÅÕ•ÉåM•±•Ñ½È ‰¥µœˆ¤¤¹½‰©•Ñ¥Ğ°(€€€€½Ù•É™±½Üé‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹ÍÉ½±±]¥‘Ñ µ¥¹¹•É]¥‘Ñ (€€€ôì(€€€½Ù•È¹É•µ½Ù” ¤ì(€€€É•ÑÕÉ¸É•ÍÕ±Ğì(€€ô±Ñ¡•µ”¤ì(€€½¹ÍĞ…Ğõİ¥‘Ñ ¬‰Áà€ˆ­Ñ¡•µ”¬ˆ½¹Í½±¥‘…Ñ•…Í”µÍÑÕ‘äˆì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡Ù…±Õ•Ì¹Á…•	…­É½Õ¹±Ù…±Õ•Ì¹Á…Á•É	…­É½Õ¹±…Ğ¬ˆèÁ…”É•Ñ…¥¹ÌÑ¡•µ”Á…Á•Èˆ¤ì(€€…ÍÍ•ÉĞ¹½¬¡Ù…±Õ•Ì¹µ¥¹!•¥¡ĞøÀ±…Ğ¬ˆè…Í”Á…”É•Ñ…¥¹Ìµ¥¹¥µÕ´É•…‘¥¹œ¡•¥¡Ğˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡Ù…±Õ•Ì¹‰½‘å½±Õµ¹Ì±İ¥‘Ñ ğôÜØÀüÄèÈ±…Ğ¬ˆè…Í”‰½‘äÉ•Ñ…¥¹ÌÉ•ÍÁ½¹Í¥Ù”½±Õµ¹Ìˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡Ù…±Õ•Ì¹‰…­¥ÍÁ±…ä°‰¥¹±¥¹”µ™±•àˆ±…Ğ¬ˆè	…¬±¥¹¬É•Ñ…¥¹Ì±…å½ÕĞˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡Ù…±Õ•Ì¹¹•áÑ5…É¥¹Q½À°ØÀ±…Ğ¬ˆè¹•áĞµÁÉ½©•ĞÍÁ…¥¹œÉ•µ…¥¹Ì…ÕÑ¡½É•ˆ¤ì(€€…ÍÍ•ÉĞ¹µ…Ñ ¡Ù…±Õ•Ì¹¡•…‘¥¹…µ¥±ä°½9•İÍÉ•…‘•È½¤±…Ğ¬ˆè…Í”¡•…‘¥¹Ì¥¹¡•É¥Ğ‘¥ÍÁ±…ä™…µ¥±äˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡Ù…±Õ•Ì¹¡•…‘¥¹]•¥¡Ğ°ˆØÀÀˆ±…Ğ¬ˆè…Í”¡•…‘¥¹ÌÉ•Ñ…¥¸‘¥ÍÁ±…äİ•¥¡Ğˆ¤ì(€€…ÍÍ•ÉĞ¹½¬¡5…Ñ ¹…‰Ì¡Ù…±Õ•Ì¹½Ù•É!•¥¡Ğµ5…Ñ ¹µ¥¸ ØĞÀ±5…Ñ ¹µ…à ÌÀÀ±İ¥‘Ñ ¨¸Ğà¤¤¤ğôÈ°(€€€…Ğ¬ˆè…ÁÁÉ½Ù•µ¥µ…”½Ù•ÈÉ•Ñ…¥¹Ì‰…Í”™É…µ”¡•¥¡Ğˆ¤ì(€€…ÍÍ•ÉĞ¹•ÅÕ…°¡Ù…±Õ•Ì¹½Ù•É=‰©•Ñ¥Ğ°‰½Ù•Èˆ±…Ğ¬ˆè…ÁÁÉ½Ù•¥µ…•ÌÉ•Ñ…¥¸Í¡…É•É½Àˆ¤ì(€€…ÍÍ•ÉĞ¹½¬¡Ù…±Õ•Ì¹½Ù•É™±½ÜğôÈ±…Ğ¬ˆè¹¼¡½É¥é½¹Ñ…°½Ù•É™±½Üˆ¤ì(€ô(ô(…İ…¥Ğ…Í•=İ¹•ÉA…”¹±½Í” ¤ì((€¼¼‘¥Ñ½É¥…°¡…ÁÑ•ÉÌ…É”½ÁÑ¥½¹…°¸-••À¹Õµ‰•É¥¹œ½¹Ñ¥Õ½ÕÌİ¡•¸„™ÕÑÕÉ”(€¼¼…Í”ÍÑÕ‘ä¡…Ì•Ù¥‘•¹”¹½Ñ•Ì‰ÕĞ¹¼ÁÉ½•ÍÌÍ•Ñ¥½¸°½È¹•¥Ñ¡•ÈÍ•Ñ¥½¸¸(½¹ÍĞ½ÁÑ¥½¹…°õ…İ…¥Ğ‰É½İÍ•È¹¹•İA…” ¤ì(½ÁÑ¥½¹…°¹½¸ ‰Á…••ÉÉ½Èˆ±•ÉÉ½Èôù•ÉÉ½ÉÌ¹ÁÕÍ ¡•ÉÉ½È¹µ•ÍÍ…”¤¤ì(…İ…¥Ğ½ÁÑ¥½¹…°¹½Ñ¼¡½É¥¥¸¬ˆ½…Í”µÍÑÕ‘¥•Ì½¡½å±Ô½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼ˆ¤ì(…İ…¥Ğ½ÁÑ¥½¹…°¹•Ù…±Õ…Ñ”  ¤ôùì(€½¹ÍĞÁÉ½©•Ğõİ¥¹‘½Ü¹A=IQ=1%<¹½µÁ…¹¥•Ì¹™¥¹¡½µÁ…¹äôù½µÁ…¹ä¹¥ôôô‰¡½å±Ôˆ¤¹ÁÉ½©•ÑÍlÁtì(€ÁÉ½©•Ğ¹ÁÉ½•ÍÌôˆˆì(€É•¹‘•É…Í•MÑÕ‘ä ‰…Í”½¡½å±Ô¼Àˆ¤ì(ô¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥Ğ½ÁÑ¥½¹…°¹±½…Ñ½È ˆ…Í”µ•Ù¥‘•¹”µ¹½Ñ•Ìˆ¤¹¥¹¹•ÉQ•áĞ ¤°½xÀÈp¼Ù¥‘•¹”€˜ÑÉ…‘•½™™Ì¼¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥Ğ½ÁÑ¥½¹…°¹±½…Ñ½È ˆ…Í”µ½ÕÑ½µ”ˆ¤¹¥¹¹•ÉQ•áĞ ¤°½xÀÌp¼•±¥Ù•É…‰±•Ì€˜±•…É¹¥¹œ¼¤ì(…İ…¥Ğ½ÁÑ¥½¹…°¹•Ù…±Õ…Ñ”  ¤ôùì(€½¹ÍĞÁÉ½©•Ğõİ¥¹‘½Ü¹A=IQ=1%<¹½µÁ…¹¥•Ì¹™¥¹¡½µÁ…¹äôù½µÁ…¹ä¹¥ôôô‰¡½å±Ôˆ¤¹ÁÉ½©•ÑÍlÁtì(€ÁÉ½©•Ğ¹•Ù¥‘•¹”ôˆˆíÁÉ½©•Ğ¹ÑÉ…‘•½™™Ìôˆˆì(€É•¹‘•É…Í•MÑÕ‘ä ‰…Í”½¡½å±Ô¼Àˆ¤ì(ô¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ½ÁÑ¥½¹…°¹±½…Ñ½È ˆ…Í”µ•Ù¥‘•¹”µ¹½Ñ•Ìˆ¤¹½Õ¹Ğ ¤°À¤ì(…ÍÍ•ÉĞ¹µ…Ñ ¡…İ…¥Ğ½ÁÑ¥½¹…°¹±½…Ñ½È ˆ…Í”µ½ÕÑ½µ”ˆ¤¹¥¹¹•ÉQ•áĞ ¤°½xÀÈp¼•±¥Ù•É…‰±•Ì€˜±•…É¹¥¹œ¼¤ì(…İ…¥Ğ½ÁÑ¥½¹…°¹±½Í” ¤ì(€¼¼M½µ”‰É½İÍ•ÉÌ½Á½±å™¥±±Ì•áÁ½Í”%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•È…Ì„ÁÉ½Á•ÉÑäİ¥Ñ¡½ÕĞ(€¼¼ÁÉ½Ù¥‘¥¹œ„½¹ÍÑÉÕÑ½È¸¼¹½Ğ¡¥‘”]½É¬½‰½ÕĞ‰•¡¥¹É•Ù•…°µÉ•…‘ä¥¸(€¼¼Ñ¡…ĞÍÑ…Ñ”ìÑ¡”ÁÉ½©•Ğ…É¡¥Ù”µÕÍĞÉ•µ…¥¸É•…‘…‰±”…¹¹…Ù¥…‰±”¸(½¹ÍĞ±¥µ¥Ñ•õ…İ…¥Ğ‰É½İÍ•È¹¹•İA…” ¤ì(±¥µ¥Ñ•¹½¸ ‰Á…••ÉÉ½Èˆ±•ÉÉ½Èôù•ÉÉ½ÉÌ¹ÁÕÍ ¡•ÉÉ½È¹µ•ÍÍ…”¤¤ì(…İ…¥Ğ±¥µ¥Ñ•¹…‘‘%¹¥ÑMÉ¥ÁĞ  ¤ôùíİ¥¹‘½Ü¹%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•ÈõÕ¹‘•™¥¹•íô¤ì(…İ…¥Ğ±¥µ¥Ñ•¹½Ñ¼¡½É¥¥¸¬ˆ¼ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ±¥µ¥Ñ•¹•Ù…±Õ…Ñ”  ¤ôùÑåÁ•½˜İ¥¹‘½Ü¹%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•È¤°‰Õ¹‘•™¥¹•ˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ±¥µ¥Ñ•¹±½…Ñ½È ˆ¹É•Ù•…°µÉ•…‘äˆ¤¹½Õ¹Ğ ¤°À°(€€‰9½¸µ…±±…‰±”%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•ÈµÕÍĞ±•…Ù”¡½µ•Á…”Í•Ñ¥½¹ÌÙ¥Í¥‰±”ˆ¤ì(…ÍÍ•ÉĞ¹½¬¡…İ…¥Ğ±¥µ¥Ñ•¹±½…Ñ½È ˆ¹İ½É¬€¹ÁÉ½©•Ğµ…Éµ±¥¹¬ˆ¤¹½Õ¹Ğ ¤øÀ°(€€‰AÉ½©•ĞÍÑ½É¥•ÌµÕÍĞÉ•µ…¥¸‘¥Í½Ù•É…‰±”İ¥Ñ¡½ÕĞÉ•Ù•…°…¹¥µ…Ñ¥½¸ˆ¤ì(…İ…¥Ğ±¥µ¥Ñ•¹±½Í” ¤ì(€¼¼=±‘•È½±¥µ¥Ñ•‰É½İÍ•ÉÌµ…ä¹½Ğ•áÁ½Í”%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•È¸¡…ÁÑ•È(€¼¼ÁÉ½É•ÍÌµÕÍĞÍÑ¥±°™½±±½ÜÍÉ½±±¥¹œ…¹É•±•…Í”¥ÑÌ±¥ÍÑ•¹•ÉÌ½¸•á¥Ğ¸(½¹ÍĞ™…±±‰…¬õ…İ…¥Ğ‰É½İÍ•È¹¹•İA…” ¤ì(™…±±‰…¬¹½¸ ‰Á…••ÉÉ½Èˆ±•ÉÉ½Èôù•ÉÉ½ÉÌ¹ÁÕÍ ¡•ÉÉ½È¹µ•ÍÍ…”¤¤ì(…İ…¥Ğ™…±±‰…¬¹…‘‘%¹¥ÑMÉ¥ÁĞ  ¤ôùí‘•±•Ñ”İ¥¹‘½Ü¹%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•Èíô¤ì(…İ…¥Ğ™…±±‰…¬¹½Ñ¼¡½É¥¥¸¬ˆ½…Í”µÍÑÕ‘¥•Ì½¡½å±Ô½½¹¹•Ñ•µÁ±…¹¹¥¹œ¼ˆ¤ì(…İ…¥Ğ™…±±‰…¬¹±½…Ñ½È ˆ…Í”µÑ¥Ñ±”ˆ¤¹İ…¥Ñ½È ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğ™…±±‰…¬¹•Ù…±Õ…Ñ”  ¤ôø‰%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•Èˆ¥¸İ¥¹‘½Ü¤±™…±Í”°(€€‰Q¡”™…±±‰…¬Íµ½­”…Í”µÕÍĞ…ÑÕ…±±ä‘¥Í…‰±”%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•Èˆ¤ì(…İ…¥Ğ™…±±‰…¬¹•Ù…±Õ…Ñ”  ¤ôùì(€½¹ÍĞ¡•…‘¥¹œõ‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ…Í”µ½ÕÑ½µ”ˆ¤ì(€İ¥¹‘½Ü¹ÍÉ½±±Q¼¡íÑ½Àé¡•…‘¥¹œ¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤¹Ñ½À­İ¥¹‘½Ü¹ÍÉ½±±d´ÄÀÀ±‰•¡…Ù¥½Èè‰¥¹ÍÑ…¹Ğ‰ô¤ì(ô¤ì(…İ…¥Ğ™…±±‰…¬¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôù‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È m‘…Ñ„µ…Í”µ©ÕµÀô‰…Í”µ½ÕÑ½µ”‰tœ¤ü¹•ÑÑÑÉ¥‰ÕÑ” ‰…É¥„µÕÉÉ•¹Ğˆ¤ôôô‰±½…Ñ¥½¸ˆ¤ì(€¼¼EÕ•Õ”„™…±±‰…¬ÕÁ‘…Ñ”°Ñ¡•¸±•…Ù”Íå¹¡É½¹½ÕÍ±ä‰•™½É”Ñ¡”¹•áĞÁ…¥¹Ğ¸(€¼¼I•µ½Ù¥¹œÍÉ½±°±¥ÍÑ•¹•ÉÌ¥Ì¥¹ÍÕ™™¥¥•¹Ğ¥˜Ñ¡”ÅÕ•Õ•™É…µ”ÍÕÉÙ¥Ù•Ì¸(½¹ÍĞ…¹•±•‘É…µ”õ…İ…¥Ğ™…±±‰…¬¹•Ù…±Õ…Ñ”  ¤ôùì(€½¹ÍĞ½É¥¥¹…±…¹•°õİ¥¹‘½Ü¹…¹•±¹¥µ…Ñ¥½¹É…µ”ì(€±•Ğ…¹•±•ôÀì(€İ¥¹‘½Ü¹…¹•±¹¥µ…Ñ¥½¹É…µ”õ™Õ¹Ñ¥½¸¡¥¥ì(€€…¹•±•¬¬ì(€€É•ÑÕÉ¸½É¥¥¹…±…¹•°¹…±°¡Ñ¡¥Ì±¥¤ì(€ôì(€ÑÉåì(€€İ¥¹‘½Ü¹‘¥ÍÁ…Ñ¡Ù•¹Ğ¡¹•ÜÙ•¹Ğ ‰ÍÉ½±°ˆ¤¤ì(€€¡¥ÍÑ½Éä¹ÁÕÍ¡MÑ…Ñ”¡¹Õ±°°ˆˆ°ˆ¼İ½É¬ˆ¤ì(€€É½ÕÑ” ¤ì(€õ™¥¹…±±åì(€€İ¥¹‘½Ü¹…¹•±¹¥µ…Ñ¥½¹É…µ”õ½É¥¥¹…±…¹•°ì(€ô(€É•ÑÕÉ¸…¹•±•ì(ô¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…¹•±•‘É…µ”°Ä°‰1•…Ù¥¹œ„…Í”ÍÑÕ‘äµÕÍĞ…¹•°Ñ¡”Á•¹‘¥¹œ¡…ÁÑ•È™É…µ”ˆ¤ì(…İ…¥Ğ™…±±‰…¬¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôùİ¥¹‘½Ü¹…Í•M•Ñ¥½¹MÉ½±±±•…¹ÕÀôôõ¹Õ±°¤ì(…İ…¥Ğ™…±±‰…¬¹±½Í” ¤ì(½¹ÍĞµ½‰¥±”õ…İ…¥Ğ‰É½İÍ•È¹¹•İA…”¡íÙ¥•İÁ½ÉĞéíİ¥‘Ñ èÌäÀ±¡•¥¡ĞèàĞÑô±¥Í5½‰¥±”éÑÉÕ”±¡…ÍQ½Õ éÑÉÕ•ô¤ì(µ½‰¥±”¹½¸ ‰Á…••ÉÉ½Èˆ±•ÉÉ½Èôù•ÉÉ½ÉÌ¹ÁÕÍ ¡•ÉÉ½È¹µ•ÍÍ…”¤¤ì(…İ…¥Ğµ½‰¥±”¹½Ñ¼¡½É¥¥¸¬ˆ½…Í”µÍÑÕ‘¥•Ì½…±½¸½…¤µ…ÍÍ¥ÍÑ•µ¥½°µÁ±…¹¹¥¹œ¼ˆ¤ì(…İ…¥Ğµ½‰¥±”¹±½…Ñ½È ˆ…Í”µÑ¥Ñ±”ˆ¤¹İ…¥Ñ½È ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğµ½‰¥±”¹±½…Ñ½È ˆ…Í”µÑ¥Ñ±”ˆ¤¹¥¹¹•ÉQ•áĞ ¤°‰$µÍÍ¥ÍÑ•%=0A±…¹¹¥¹œˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğµ½‰¥±”¹±½…Ñ½È ˆ¹…Í”µÍ•Ñ¥½¸µ±¥¹­Ì‰ÕÑÑ½¸ˆ¤¹™¥ÉÍĞ ¤¹¥ÍY¥Í¥‰±” ¤±ÑÉÕ”¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğµ½‰¥±”¹•Ù…±Õ…Ñ”  ¤ôù‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹ÍÉ½±±]¥‘Ñ ğõ¥¹¹•É]¥‘Ñ ¬È¤±ÑÉÕ”°‰U¹•áÁ•Ñ•µ½‰¥±”¡½É¥é½¹Ñ…°½Ù•É™±½Üˆ¤ì(…İ…¥Ğµ½‰¥±”¹Í•ÑY¥•İÁ½ÉÑM¥é”¡íİ¥‘Ñ èÌÈÀ±¡•¥¡ĞèÜÈÁô¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğµ½‰¥±”¹•Ù…±Õ…Ñ”  ¤ôù‘½Õµ•¹Ğ¹‘½Õµ•¹Ñ±•µ•¹Ğ¹ÍÉ½±±]¥‘Ñ ğõ¥¹¹•É]¥‘Ñ ¬È¤±ÑÉÕ”°‰U¹•áÁ•Ñ•€ÌÈÁÁà¡½É¥é½¹Ñ…°½Ù•É™±½Üˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğµ½‰¥±”¹±½…Ñ½È ˆ¹…Í”µ¡•…€¹…Í”µ…ÁÁÉ½… ˆ¤¹½Õ¹Ğ ¤°Ä°‰ÕÑ¡½É•…ÁÁÉ½… Í¡½Õ±É•µ…¥¸Ù¥Í¥‰±”…Ğ€ÌÈÁÁàˆ¤ì(…ÍÍ•ÉĞ¹•ÅÕ…°¡…İ…¥Ğµ½‰¥±”¹±½…Ñ½È ˆ¹…Í”µ¡•…€¹…Í”µ…ÁÁÉ½… ˆ¤¹•Ù…±Õ…Ñ”¡¹½‘”ôù•Ñ½µÁÕÑ•‘MÑå±”¡¹½‘”¤¹É¥‘Q•µÁ±…Ñ•½±Õµ¹Ì¹ÑÉ¥´ ¤¹ÍÁ±¥Ğ ½qÌ¬¼¤¹±•¹Ñ ¤°Ä°(€€‰Q¡”µ½‰¥±”…ÁÁÉ½… Í¡½Õ±ÍÑ…¬±…‰•°…¹½Áä¥¸½¹”½±Õµ¸ˆ¤ì(€¼¼M•±•Ñ¥¹œÑ¡”½ÕÑ½µ”¡…ÁÑ•ÈÍ¡½Õ±É•Ù•…°¥ÑÌ…Ñ¥Ù”Ñ…ˆ¥¸Ñ¡”¹…ÉÉ½ÜÍÑÉ¥À¸(€¼¼ÁÉ½É…µµ…Ñ¥Œ‘½Õµ•¹ĞÍÉ½±°¥Ì¹½Ğ„É•±¥…‰±”%¹Ñ•ÉÍ•Ñ¥½¹=‰Í•ÉÙ•ÈÑÉ¥•È¸(…İ…¥Ğµ½‰¥±”¹±½…Ñ½È m‘…Ñ„µ…Í”µ©ÕµÀô‰…Í”µ½ÕÑ½µ”‰tœ¤¹±¥¬ ¤ì(…İ…¥Ğµ½‰¥±”¹İ…¥Ñ½ÉÕ¹Ñ¥½¸  ¤ôùì(€½¹ÍĞ¹…Øõ‘½Õµ•¹Ğ¹ÅÕ•ÉåM•±•Ñ½È ˆ¹…Í”µÍ•Ñ¥½¸µ±¥¹­Ìˆ¤ì(€½¹ÍĞÑ…ˆõ¹…Øü¹ÅÕ•ÉåM•±•Ñ½È m‘…Ñ„µ…Í”µ©ÕµÀô‰…Í”µ½ÕÑ½µ”‰um…É¥„µÕÉÉ•¹Ğô‰±½…Ñ¥½¸‰tœ¤ì(€¥˜ …Ñ…ˆ¥É•ÑÕÉ¸™…±Í”ì(€½¹ÍĞ„õÑ…ˆ¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤±ˆõ¹…Ø¹•Ñ	½Õ¹‘¥¹±¥•¹ÑI•Ğ ¤ì(€É•ÑÕÉ¸„¹±•™Ğøõˆ¹±•™Ğ´È˜™„¹É¥¡Ğğõˆ¹É¥¡Ğ¬Èì(ô±¹Õ±°±íÑ¥µ•½ÕĞèÌÀÀÁô¤ì(…İ…¥Ğµ½‰¥±”¹±½Í” ¤ì(…ÍÍ•ÉĞ¹‘••ÁÅÕ…°¡•ÉÉ½ÉÌ±mt°‰U¹…Õ¡Ğ‰É½İÍ•È)…Ù…MÉ¥ÁĞ•ÉÉ½ÉÌˆ¤ì(½¹Í½±”¹±½œ ‰AMLè‘••À±¥¹­Ì°¡…ÁÑ•ÉÌ°Í¡¥ÁÁ•ÍÑ…ÑÕÌ°½Á…ÅÕ”Ñ¡•µ•™½½Ñ•È°µ½‰¥±”±…å½ÕĞ°¹¼Á…”•ÉÉ½ÉÌˆ¤ì)õ™¥¹…±±åí…İ…¥Ğ‰É½İÍ•È¹±½Í” ¤í…İ…¥Ğ¹•ÜAÉ½µ¥Í”¡É•Í½±Ù”ôùÍ•ÉÙ•È¹±½Í”¡É•Í½±Ù”¤¥ô