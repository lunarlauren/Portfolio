# Portfolio developer handoff

## Project-content editing guide â€” Pass 31

The opening comment in `public/content.js` now gives designers a short map for
adding projects, editing case-study copy, replacing image briefs with approved
assets, and keeping claims evidence-based. It calls out the title-keyed lookup
maps in `script.js` and `components/project-content.js`, so renames do not
silently lose archive facts or highlights. The script cache key was advanced.

## Novice-friendly homepage source â€” Pass 30

`public/index.html` now uses consistent indentation for its metadata, style
links, navigation, homepage sections, and theme control. Short comments point
to the common edit locations: homepage copy in this file, project details in
`content.js`, and component styling in the matching CSS file. The early theme
setup stays before stylesheets to prevent a flash; behavior and page content
are unchanged. Use the visible sections as the editing map instead of adding
new layout rules to the legacy stylesheet.

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
and computed facts columns in bowß®=¶‰žËkºwµçF†÷r—BÖ÷fW2&WGvVVâ6†ö–6W2ÂæB†÷rwVW7B6âFVÆÂv†–6‚6öçG&öÂ—26VÆV7FVBâf÷"f÷–vRG&6¶W"Â’&–÷&—F—¦VBF†RÖ–âf÷–vR–æf÷&ÖF–öâæB6öç6–FW&VB†÷r6V6öæF'’FWF–Ç26÷VÆB&VÖ–â66W76–&ÆRv—F†÷WB6ö×WF–ærf÷"GFVçF–öââF†—2FW67&–&W2×’–çFW&f6RÖFW6–vâ&ö6ƒ²—B—2æ÷B6Æ–ÒF†B'F–7VÆ"æf–vF–öâGFW&âv2fÆ–FFVBF‡&÷Vv‚FW7F–ærâ"À¢Wf–FVæ6S¢$6öæf—&ÖVB66÷S¢’6öçG&–'WFVB–çFW&f6RFW6–vâFòF†R6†—VB–â×7FFW&ööÒEbÂ–æ6ÇVF–ærf÷–vRG&6¶W"âW6W"–çFW'f–Ww2ÂW6&–Æ—G’7GVF–W2Â&VÖ÷FRÖ6öçG&öÂFW7Bf–æF–æw2ÂæBVævvVÖVçBÖWG&–72†fRæ÷B&VVâ7WÆ–VBf÷"F†—266R7GVG’âF†RFW6–vâ&F–öæÆR&VÆ÷r6†÷VÆBæ÷B&R&VB2ÖV7W&VBwVW7B&V†f–÷"â"À¢G&FVöfg3¢$Eb—6âwB§W7Bv–çB†öæRâ–÷RæVVBFò&VB—Bg&öÒ7&÷72F†R&ööÒæBæf–vFRv—F‚†æFgVÂöb'WGFöç2â’ff÷&VB6ÆV"fö7W2f—6–&–Æ—G’ÂF—&V7F–öæÂ&VF–7F&–Æ—G’ÂæB7G&öær&–Ö'’Ö–æf÷&ÖF–öâ†–W&&6‡’2FW6–vâ&–÷&—F–W3²æòFW7FVB6ö×&—6öâ&WGvVVâÇFW&æF—fW2—26Æ–ÖVBâ"À¢÷WF6öÖS¢%F†—2v÷&²6†—VB–â†öÆÆæBÖW&–6Æ–æRw27FFW&ööÒEbW‡W&–Væ6RÂ–æ6ÇVF–ær&VÖ÷FRÖg&–VæFÇ’æf–vF–öâæBf÷–vRG&6¶W"âFW6–væ–ærf÷"EbÖFRÖR&WF†–æ²F†–æw2’vBF¶Rf÷"w&çFVBöâ†öæS¢fö7W27FFW2Â'WGFöâF&vWG2ÂæBv†WF†W"6öÖVöæR6â&VBF†R67&VVâg&öÒ7&÷72F†R&ööÒâ"À¢–ÖvT'&–Vc¢$&÷fVB7FFW&ööÒEb–çFW&f6Rv—F‚F†Rf÷–vRG&6¶W"v–FvWBf—6–&ÆRâ"À¢vÆÆW'”'&–Vg3¥°¢%7FFW&ööÒEb†öÖR67&VVâ6†÷v–ær—G2Æ–÷WBæBæf–vF–öââ"À¢%f÷–vRG&6¶W"v–FvWBæB6†—×÷6—F–öâ÷"—F–æW&'’–æf÷&ÖF–öâÂ2f–Æ&ÆR–â&÷fVB'Gv÷&²â"À¢$FF—F–öæÂ–â×&ööÒEbv–FvWG2÷"–çFW&7F–öâ7FFW2F†BFVÖöç7G&FR&VF&ÆRÂ&VÖ÷FRÖg&–VæFÇ’T’â ¢Ð¢Ð¢Ð¢Ð¢ÒÀ¢Æ–w&÷VæC¥°¢°¢F—FÆS¢$f÷&·F7F–72"ÇG—S¢$–æFWVæFVçB&öGV7B+rU‚õT’FW6–vâ"À¢7VÖÖ'“¢$’v÷BF—&VBöbF†RvVV¶Ç’wv†Bw2f÷"F–ææW#òr7—&ÂÂ6ò’7F'FVBFW6–væ–ærÖVÂÆææW"F†BÖ¶W26†ö÷6–ærfööBfVVÂÖ÷&RÆ–¶R'V–ÆF–ærFV6²F†âFö–ær†öÖWv÷&²â"À¢FWF–Ç3¢$F–ææW"6†÷VÆFâwB&WV—&Rg&W6‚&÷VæBöbFV6—6–öâÖÖ¶–ærWfW'’6–ævÆRæ–v‡Bâf÷&·F7F–72&Vvâ2×’GFV×BFòÖ¶RvVV¶Ç’ÖVÂÆææ–ærfVVÂÆW72Æ–¶R†öÖWv÷&²â’6öæ6V—fVBæB—FW&FVBöâ&öGV7BF†B†VÇ2V÷ÆR6†ö÷6RÖVÇ2Â&Wf–WrvVV²öbF–ææW'2ÂæB6†÷v—F‚ÆW72v7FRâF†RW‡W&–Væ6R6öÖ&–æW2&VfW&Væ6RÖ&6VBF—66÷fW'’ÂvVV¶Ç’ÖVçRÂ'VFvWBv&VæW72ÂæBw&ö6W'’Æ—7BF†B6öç6öÆ–FFW2–æw&VF–VçG2W6VB'’×VÇF—ÆR&V6—W2â—Bw2W'6öæÂ&ö¦V7B’vÒ7F–ÆÂ'V–ÆF–æræB&Vf–æ–ærâ"À¢&ö6W73¢$’vçFVBF†RvVV¶Ç’ÖVçRFòfVVÂÆ–¶RF†R†V'BöbF†RW‡W&–Væ6RÂæ÷BÖ¦Röb6WGF–æw2â’—FW&FVBöâÖVÂF—66÷fW'’Â7v—R–çFW&7F–öç2ÂÖVçR&Wf–Ww2&Vf÷&R6öÖÖ—GF–ærÂ&V6—R7v2Â–æw&VF–VçB6öç6öÆ–FF–öâÂæB6ÆV"6öö¶VBöæ÷BÖ6öö¶VB7FFRâ’W‡Æ÷&VBfWrf—7VÂF—&V7F–öç2Â–æ6ÇVF–ærG&F–ærÖ6&BÖ–ç7—&VBF†VÖRâÆöærF†Rv’Â’¶WB&WGW&æ–ærFò&7F–6Â—77VW27V6‚26ÖÆÂ×67&VVâ÷fW&fÆ÷rÂ7v—RvW7GW&W26ö×WF–ærv—F‚67&öÆÆ–ærÂæBöæ&ö&F–ærF†B6¶VBFöò×V6‚öbæWrW6W'2â'V–ÆF–ærâ’Ö76—7FVB&÷F÷G—R†VÇVBÖRFW7B–FV2V–6¶Ç’Â'WBF†R–×÷'FçBFW6–vâv÷&²v2FV6–F–ærv†–6‚–çFW&7F–öç2vVçV–æVÇ’ÖFRÆææ–ærV6–W"â"À¢òò6VÆbÖF—&V7FVB&÷F÷G—RWf–FVæ6R—2æ÷BWV—fÆVçBFò'F–6—çB&W6V&6‚à¢Wf–FVæ6S¢$Fö7VÖVçFVC¢f÷&·F7F–72—2×’–æFWVæFVçBÂ’Ö76—7FVBv÷&¶–ær&÷F÷G—Râ—FW&F–öâ†27W&f6VB–çFW&7F–öâæBFF×VÆ—G’—77VW2Â–æ6ÇVF–ær7v—RvW7GW&W26ö×WF–ærv—F‚67&öÆÆ–æræBw&ö6W'’VçF—F–W2÷"&–6RW7F–ÖFW2æVVF–ær&Vf–æVÖVçBâæò&V7'V—FVBW6W"–çFW'f–Ww2Âf÷&ÖÂW6&–Æ—G’7GVG’ÂfW&–f–VBw&ö6W'’6f–æw2Â÷"&öGV7F–öâÆVæ6‚†2&VVâFö7VÖVçFVBâ"À¢G&FVöfg3¢%F†RFW6–vâFVç6–öâ—2WFöÖF–öâfW'7W26öçG&öÃ¢&÷÷6RW6VgVÂvVV¶Ç’ÖVçRv†–ÆRÆVf–ær&ööÒFò&Wf–WræB7vÖVÇ2â–æw&VF–VçB÷fW&Æ6â7W÷'B'VFvWBv&VæW72'WB6†÷VÆBæ÷BVÆ–Ö–æFRf&–WG“²G&F–ærÖ6&BÖ–ç7—&VBf—7VÂ–FVçF—G’6†÷VÆBÖ¶RF—66÷fW'’–çf—F–ærv—F†÷WB†–F–ærWfW'–F’Æææ–ær7F–öç2âF†W6R&RFW6–vâ&–÷&—F–W2Âæ÷BÖV7W&VB÷WF6öÖW2â"À¢÷WF6öÖS¢$f÷&·F7F–72—2v÷&¶–ær&÷F÷G—RÂæ÷BöÆ—6†VB7V66W727F÷'’v—F‚&÷röâ—Bâ’wfR'V–ÇBæB&Wv÷&¶VBF†RvVV¶Ç’ÆææW"Â&V6—RF—66÷fW'’ÂæBw&ö6W'’Æ—7B2’f–æBg&–7F–öâ–âF†RfÆ÷râ’vÒ7F–ÆÂFW7F–ærv†WF†W"F†R–FV27GVÆÇ’6fRF–ÖRÂÖöæW’Â÷"fööBv7FRâ"À¢–ÖvT'&–Vc¢%6†÷rF†RW†—7F–ærf÷&·F7F–72&÷F÷G—R2âW‡Æ÷&F–öâÂ6ÆV&Ç’Æ&VÆVB$õDõE•Râ&WÆ6Rv—F‚÷&–v–æÂf–vÖÖFW6–væVB†W&òf—7VÇ2öæ6RF†R&VFW6–vâW†—7G2â"À¢vÆÆW'”'&–Vg3¥°¢#òD„R4õ$R”DT²F–w&ÒF†RfÆ÷s¢FVÆÂf÷&·F7F–72–÷W"F7FW2(i"vWB&÷÷6VBvVV¶Ç’ÖVçR(i"&Wf–WræB7vÖVÇ2(i"6†÷v—F†–â–÷W"'VFvWBâ"À¢#"ò$õDõE•RU…Äõ$D”ôâ²&VÂ67&VVç6†÷G2öbF†R’Ö76—7FVBv÷&¶–ær&÷F÷G—RÂÆ&VÆVB2W‡Æ÷&F÷'’&F†W"F†âf–æÂFW6–vââ"À¢#2ò4Ô%DU"4„õ”ärÄôt”2²–ÆÇW7G&FR†÷rGvò÷"Ö÷&RF–ææW'26†&R–æw&VF–VçG2Â†÷rVçF—F–W2&öÆÂ–çFòöæRw&ö6W'’Æ—7BÂæB†÷rW7F–ÖFVB6÷7G2–æf÷&ÒÖVçR6†ö–6W2v–ç7B'VFvWBâÆ&VÂ6Æ7VÆF–öç22&÷F÷G—RW7F–ÖFW2â"À¢#BòD„RDU4”tâD•$T5D”ôâ²V&Ç’÷&–v–æÂf–vÖW‡Æ÷&F–öç2öbD4rÖ–ç7—&VB–çFW&f6RF†BÖ¶W26†ö÷6–ærÖVÇ2Æ–gVÂv—F†÷WB6ö×Æ–6F–ærÆææ–ærâv÷&²–â&öw&W72â"À¢#RòDU4”tä”ärD„R5•5DTÒ²gWGW&Rf–vÖ6ö×öæVçG3¢ÖVÂ6&G2Â7FFW2Âæf–vF–öâÂG—öw&‡’Â76–ærÂæB66W76–&–Æ—G’FV6—6–öç2âFBv†Vâ7&VFVBâ"À¢#bòe$ôÒ$õDõE•RDò$ôET5B²gWGW&R6–FRÖ'’×6–FR6ö×&—6öâöbW‡Æ÷&F÷'’&÷F÷G—RæBFW6–væW"ÖÆVB&VFW6–vââFòæ÷B&W6VçB26ö×ÆWFVBVçF–Â'V–ÇBâ ¢Ð¢ÒÀ¢°¢F—FÆS¢$fÆÆ÷WBsb²v†B’vBFW6–vâ"ÇG—S¢%Væöff–6–ÂvÖR6öæ6WBFW6–vâ+rfâv÷&²"À¢7VÖÖ'“¢$†÷rf"6â–÷RW6‚â–FV&Vf÷&R—B7F÷2fVVÆ–ærÆ–¶RfÆÆ÷WCò’W‡Æ÷&VBæWr6×ö&¦V7G2ÂF†VÖVB6V6öâÂæB'&†Ö–â×÷vW&VBG&fVÂâ"À¢FWF–Ç3¢%F†W6R&RF‡&VRVæöff–6–ÂfÆÆ÷WBsbFW6–vâ&÷÷6Ç2f÷"Æ–W'2v†òVæ¦÷’4Õö&¦V7G2Â6V6öæÂ&Wv&G2ÂæBÆ6†–w2v÷&ÆF'V–ÆF–æs¢ÖVBvVV²6†&7WFW&–RF—7Æ’ÂÖ—7G&W72öb×—7FW'’Ö–ç7—&VB6V6öâÂæB'&†Ö–â×÷vW&VBG&ç7÷'FF–öââ×’&öÆR—2–æFWVæFVçB6öæ6WBF—&V7F–öâæBf—7VÂÆææ–ærÂæ÷Bv÷&²6öÖÖ—76–öæVB'’&WF†W6FâF†R6†ÆÆVævR—2Fò&W7V7BF†RvÖRw2&V6övæ—¦&ÆR&WG&òÖgWGW&—7BÆæwVvRv†–ÆR–çG&öGV6–ær6öÖWF†–ærÆ–gVÂæBF—7F–æ7BâF†R'Gv÷&²æBT’Öö6·W2FW67&–&VB&VÆ÷r&RÆææVB÷'FföÆ–òf—7VÇ2Âæ÷BWf–FVæ6Röb–×ÆVÖVçFVBvÖR6öçFVçBâ"À¢&ö6W73¢$’÷&væ—¦VBF†R&÷÷6Ç2&÷VæBF‡&VRF–ffW&VçBÆ–W"F÷V6‡ö–çG3¢Æ6V&ÆR4Õö&¦V7BÂ6V6öâæB—G2&Wv&G2ÂæB7V7VÆF—fRG&fVÂ–çFW&7F–öââF†B6W&F–öâ†VÇ2ÖR6²F–ffW&VçBFW6–vâVW7F–öç2&÷WB6–Æ†÷VWGFRÂf—7VÂ†–W&&6‡’ÂæB–â×v÷&ÆBÆW6–&–Æ—G’âF†RF—&V7F–öç2&VÆ÷r&R6öæ6WB'&–Vg2Âæ÷BFö7VÖVçFVB&÷F÷G—W2ÂÆ–W"×FW7FVB—FW&F–öç2Â÷"f–æ—6†VB–ÆÇW7G&F–öç2åÆåÆäÔTBtTT²òD„R4„$5UDU$”R$ô$B²6×F—7Æ’–ç7—&VB'’ÖVBvVV³¢â÷fW'6—¦VBÂFVÆ–v‡FgVÆÇ’'7W&B7&VBöbv7FVÆæBÖVG2æB6æ6·2âF†RFW6–vâ6†ÆÆVævR—2FòÖ¶RÆ–gVÂ6öÆÆV7F–&ÆRF—7Æ’fVVÂ&VF&ÆRÂWF—¦–ær–âfÆÆ÷WB6÷'Böbv’ÂæBVæÖ—7F¶&Ç’'Böbw&†Òw26VÆV'&F–öâåÆåÆäÔ•5E$U52ôbÕ•5DU%’òD„R4T4ôâ²6V6öâ6öæ6WB–ç7—&VB'’F†R÷&FW"öb×—7FW&–W2Âv—F‚F†VÖVB6V6öâ66÷&V&ö&BæB7W&FVBÆ–æWWöb&Wv&G2’vBvçBFòV&ââF†Rf—7VÂF—&V7F–öâG&w2g&öÒ6V7&WB–FVçF—F–W2ÂVÇÖ6öÖ–2G&ÖÂæBF†Rf7F–öâw2F†VG&–6ÂVÆVvæ6Râ&Wv&B–ÆÇW7G&F–öç2æB66÷&V&ö&BÖö6·Wv–ÆÂÖ¶RF†R6öæ6WBFæv–&ÆRåÆåÆä%$„Ô”âE$å5õ%DD”ôâ²6öæ6WBf÷"Ö÷f–ærF‡&÷Vv‚Æ6†–v—F‚'&†Ö–ââ’vBW‡Æ÷&R†÷rF†RfV†–6ÆR÷"6&fâÆöö·2Âv†B—BfVVÇ2Æ–¶RFòW6RÂæB†÷r—Bf—G2fÆÆ÷WBw267&’v÷&ÆBv—F†÷WB&WFVæF–ær—Bw2âW†—7F–ærÖV6†æ–2â"À¢òòæòf–æ—6†VB'Gv÷&²ÂÆ—FW7BÂ÷"6†—VB6öçFVçB—2W7F&Æ—6†VB'’F†W6R'&–Vg2à¢Wf–FVæ6S¢$Fö7VÖVçFVB–âF†—2÷'FföÆ–ò'&–Vc¢F‡&VR–æFWVæFVçBfâ&÷÷6Ç2æBÆææVBf—7VÂF—&V7F–öç2âF†RÖFW&–Ç2†W&RFòæ÷BW7F&Æ—6‚6ö×ÆWFVB6öæ6WB–ÆÇW7G&F–öç2Â–çFW&7F—fR&÷F÷G—W2ÂÆ–W"–çFW'f–Ww2ÂW6&–Æ—G’FW7G2ÂFWfVÆ÷W"6öÆÆ&÷&F–öâÂ÷"–âÖvÖR–×ÆVÖVçFF–öââ–ÖvR'&–Vg2FW67&–&Rv÷&²Fò7&VFRÂæ÷BWf–FVæ6Röbf–æ—6†VB76WG2â"À¢G&FVöfg3¢$V6‚&÷÷6Â†2F–ffW&VçBFW6–vâFVç6–öã¢Ö¶RÖVBvVV²4ÕF—7Æ’–ÖÖVF–FVÇ’&V6övæ—¦&ÆRv—F†÷WBÆ÷6–ær—G2&–F–7VÆ÷W26†&Ó²Ö¶RÖ—7G&W72öb×—7FW'’6V6öâfVVÂf—F†gVÂFòF†Rf7F–öâv—F†÷WB6–×Ç’6÷––ærW†—7F–ær&Wv&G3²æBÖ¶R'&†Ö–âG&ç7÷'FF–öâf—BF†Rv÷&ÆBw267&’Æöv–2v—F†÷WB–×Ç––ær—B—27W÷'FVBÖV6†æ–2âF†W6R&RVW7F–öç2f÷"gWGW&RW‡Æ÷&F–öâÂæ÷BfÆ–FFVBFW6–vâFV6—6–öç2â"À¢÷WF6öÖS¢%F‡&VR7V7VÆF—fRfâÖFW6–vâF—&V7F–öç2v—F‚'&–Vg2f÷"gWGW&R6öæ6WB–ÆÇW7G&F–öç2æBT’Öö6·W2âF†W’&RVæöff–6–Â&÷÷6Ç2Âæ÷B6†—VBvÖRfVGW&W3²f–æ—6†VB76WG2ÂÆ–W"&W7öç6RÂæB–×ÆVÖVçFF–öâ÷WF6öÖW2&Ræ÷BW7F&Æ—6†VB'’F†R7W'&VçBÖFW&–Ç2â"À¢–ÖvT'&–Vc¢$6öæ6WB÷'FföÆ–ò6÷fW#¢F‡&VRF—7F–æ7BfâÖFW6–vâ&÷÷6Ç3²ÖVBvVV²6†&7WFW&–RF—7Æ’ÂÖ—7G&W72öb×—7FW'’6V6öâ66÷&V&ö&BÂæB'&†Ö–âG&ç7÷'FF–öââW6R÷&–v–æÂ6öæ6WB'Gv÷&²öæ6RFW6–væVC²Fòæ÷B–×Ç’F†W6R&R–âÖvÖR67&VVç6†÷G2â"À¢vÆÆW'”'&–Vg3¥°¢#òÔTBtTT²4„$5UDU$”R²6öæ6WB–ÆÇW7G&F–öâöbÆ6V&ÆR6×ÖVBF—7Æ’&ö&BÂv—F‚–æw&VF–VçG2Â&W6VçFF–öâÂ66ÆRÂæBÆ–gVÂfÆÆ÷WB×7G–ÆR—FVÒæÖRâ"À¢#"òÔTBtTT²•DTÒ$U4TåDD”ôâ²Öö6²WF†R6×Ö'V–ÆF–ær6FÆörF–ÆRæBF†RF—7Æ’–âÆ–W"6×Â6ÆV&Ç’Æ&VÆVBdâ4ôä4UBâ"À¢#2òÔ•5E$U52ôbÕ•5DU%’4T4ôâ²FW6–vâ6ö×ÆWFR6V6öâ66÷&V&ö&B6ö×÷6—F–öâ–ç7—&VB'’F†R÷&FW"öb×—7FW&–W2ÂW6–ærâ÷&–v–æÂÆ–÷WBæB6ÆV&Ç’Ö&¶VB2âVæöff–6–Â6öæ6WBâ"À¢#BòD„R$Ut$E2’tBtåB²–ÆÇW7G&FR&÷÷6VB&Wv&BÆ–æWWf÷"F†R6V6öã¢÷WFf—G2Â6×FV6÷"Â&÷2ÂæB÷F†W"F†VÖVB6öÆÆV7F–&ÆW2âf–æÂ—FVÒ6†ö–6W2æB'BFò&RFW6–væVBâ"À¢#Rò%$„Ô”âE$å5õ%DD”ôâ²6öæ6WB6†VWB6†÷v–ær'&†Ö–â×÷vW&VB6&fâ÷"G&ç7÷'B7—7FVÒÂ–æ6ÇVF–ær6–Æ†÷VWGFRÂÖFW&–Ç2ÂæB†÷rÆ–W"Ö–v‡B–çFW&7Bv—F‚—Bâ"À¢#bò”âÕtõ$ÄBU…U$”Tä4R²T’æBVçf—&öæÖVçFÂÖö6·W26†÷v–ær†÷rF†RG&ç7÷'FF–öâ6öæ6WB6÷VÆBf—B–çFòÆ6†–²7V7VÆF—fRvÖWÆ’Âæ÷BâW†—7F–ærfVGW&Râ ¢Ð¢ÒÀ¢°¢F—FÆS¢$–ÆÇW7G&F–öâbW‡W&–ÖVçG2"ÇG—S¢%W'6öæÂ7&VF—fR&7F–6R"À¢7VÖÖ'“¢%6öÖWF–ÖW2F†R&W7B&V6öâFòÖ¶R6öÖWF†–ær—2F†B’6âwB7F÷F†–æ¶–ær&÷WB—BâF†—2—2v†W&RF†÷6R–FV2vòâ"À¢FWF–Ç3¢$÷WG6–FR6Æ–VçB'&–Vg2Â’W6RW'6öæÂ–ÆÇW7G&F–öâ2Æ6RFòW‡Æ÷&R6†&7FW"ÂW‡&W76–öâÂæBf—7VÂ7G–ÆRâ×’&öÆR—2–æFWVæFVçB7&VF—fRF—&V7F–öâæB–ÆÇW7G&F–öâÂ&F†W"F†â&öGV7BU‚f÷"FVf–æVBW6W"w&÷WâF†Rf—7VÂ6†ÆÆVævR—2FòÖ¶R6†&7FW"÷"6ö×÷6—F–öâ&VF&ÆRæBF—7F–æ7F—fRv—F†÷WB&VÇ––æröâW‡G&FWF–ÂâF†—26öÆÆV7F–öâFöW2æ÷B†fRFö7VÖVçFVB6Æ–VçB'&–VbÂVF–Væ6R7GVG’Â÷"&öGV7F–öâFVFÆ–æRâ"À¢&ö6W73¢%F†RVW7F–öç2wV–F–ærF†—2v÷&²&Rf—7VÂöæW3¢v†B6â6–Æ†÷VWGFR6öÖ×Væ–6FR&Vf÷&R6öÆ÷"—2FFVBÂ†÷rFöW2ÆWGFR6†ævRF†RÖööBÂæBv†–6‚FWF–Ç27W÷'BF†RW‡&W76–öãò7G&öævW"&ö6W72&W6VçFF–öâv÷VÆB—"÷&–v–æÂ6¶WF6†W2v—F‚ÇFW&æF—fW2ÂW‡Æ–âv‡’öæRF—&V7F–öâv2&Vf–æVBÂæB6†÷rF†Rf–æÂ'Gv÷&²âF†÷6R7FvW2&R&W6VçFF–öâÆâ†W&RÂæ÷B6Æ–ÒF†B'F–7VÆ"6¶WF6‚&÷VæG2÷"FW7G2†fR&VVâFö7VÖVçFVBâ"À¢òòW'6öæÂ&7F–6R—2Fö7VÖVçFVC²F†W6Rf—7VÂ'&–Vg2&Ræ÷B6ö×ÆWFVB'Gv÷&²à¢Wf–FVæ6S¢$6öæf—&ÖVB66÷S¢öævö–ær–æFWVæFVçB–ÆÇW7G&F–öâæB7&VF—fRW‡Æ÷&F–öââ7V6–f–2FFVB6¶WF6†W2Â6ö×&F—fR—FW&F–öç2ÂVF–Væ6RfVVF&6²ÂæB&÷fVBf–æ—6†VB–V6W2†fRæ÷B&VVâ7WÆ–VBf÷"F†—266R7GVG’âF†R†W&òæBvÆÆW'’FW67&—F–öç2&RgWGW&R–ÖvR'&–Vg2Âæ÷B6ö×ÆWFVBFVÆ—fW&&ÆW2÷"FW7BWf–FVæ6Râ"À¢G&FVöfg3¢$’Æ÷fRÖVÖ÷&&ÆR6–Æ†÷VWGFRÂ'WB’Ç6ò¶æ÷rv†VâFW6–vâ—2G'––ærFò6’f—fRF†–æw2Böæ6Râ’Æöö²f÷"F†RFWF–Ç2F†BÖ¶R6†&7FW"&V6övæ—¦&ÆRæB7WBF†RöæW2F†B§W7BFBæö—6RâF†W6R&RF†RVW7F–öç2&V†–æBF†Rv÷&²Âæ÷B6Æ–×2&÷WBf÷&ÖÂFW7Bâ"À¢÷WF6öÖS¢$âöævö–ærW'6öæÂ–ÆÇW7G&F–öâ&7F–6RâF†—2vR7W'&VçFÇ’6öÖ×Væ–6FW2F†R7&VF—fRF—&V7F–öâæBÆææVB&ö6W72&W6VçFF–öã²—BFöW2æ÷B6Æ–Ò6ö×ÆWFVB–ÆÇW7G&FVB6W&–W2Âf÷&ÖÂWfÇVF–öâÂ÷"ÖV7W&VBVF–Væ6R&W7öç6Râ"À¢–ÖvT'&–Vc¢%ÆææVB†W&ó¢VF—F÷&–Â6öÆÆvRöb÷&–v–æÂ6†&7FW"–ÆÇW7G&F–öç2Â6öÆ÷"7GVF–W2ÂæB6VÆV7FVBöÆ—6†VB'Gv÷&²öâ&W7G&–æVB&6¶w&÷VæBâFBöæÇ’v†VâF†R'Gv÷&²—2&VG’â"À¢vÆÆW'”'&–Vg3¥°¢%ÄääTBò6†&7FW"FWfVÆ÷ÖVçB6†VWBv—F‚÷&–v–æÂ6–Æ†÷VWGFW2ÂW‡&W76–öç2ÂÆWGFW2ÂæBf–æÂ÷6W2âæ÷B–WB7WÆ–VBâ"À¢%ÄääTBò6–FRÖ'’×6–FR÷&–v–æÂ&÷Vv‚6¶WF6‚Â&Vf–æVBÆ–æWv÷&²ÂæBf–æÂ6öÆ÷"v—F‚æ÷FW2öâ7GVÂFV6—6–öç2âæ÷B–WB7WÆ–VBâ"À¢%ÄääTBò7W&FVBÖ–æ’ÖvÆÆW'’öbF‡&VRW'6öæÂ–V6W2v—F‚6F–öç2–FVçF–g––ærV6‚–V6RæB—G2&ö6W72âæ÷B–WB7WÆ–VBâ ¢Ð¢Ð¢Ð§Ó°