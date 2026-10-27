// Dependency-free structural smoke checks for the portfolio's static assets.
// These checks cannot replace browser, keyboard, screen-reader or visual QA.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const content = read('../public/content.js');
const script = read('../public/script.js');
const html = read('../public/index.html');
const css = read('../public/styles.css');
// Read the actual owners of these rules after the component extraction.
// Assertions against only script.js/styles.css silently become stale otherwise.
const caseStudy = read('../public/components/case-study.js');
const projectContent = read('../public/components/project-content.js');
const caseCss = read('../public/components/case-study.css');
const navigationCss = read('../public/components/navigation.css');
const heroPolishCss = read('../public/components/hero-polish.css');
const workCss = read('../public/components/work-cards.css');
const stationeryCss = read('../public/components/stationery.css');
// Component ownership and stylesheet order are part of the visual contract.
const stylesheetOrder = ['styles.css', 'hero-polish.css', 'stationery.css', 'navigation.css', 'case-study.css'];
let previousPosition = -1;
for (const name of stylesheetOrder) {
 const match = html.indexOf('/' + (name === 'styles.css' ? name : 'components/' + name));
 assert.ok(match > previousPosition, name + ' must load after the preceding stylesheet');
 previousPosition = match;
}
assert.doesNotMatch(css, /\/\* Problem-solving hero: shared layout in both themes/, 'Extracted hero polish must not return to legacy CSS');
assert.match(heroPolishCss, /\.hero \.hero-copy h1\{/, 'Hero typography must remain in its component');
assert.doesNotMatch(css, /\/\* Case-study handoff: quick factual overview/, 'Case evidence must not return to legacy CSS');
assert.match(caseCss, /\.case-evidence-item\{/, 'Case evidence must remain in case-study component');
assert.match(navigationCss, /footer\.wrap\{/, 'Footer chrome must remain with navigation');
assert.doesNotMatch(css, /footer\.wrap\{/, 'Footer chrome must not be duplicated in legacy CSS');

new vm.Script(caseStudy, { filename: 'public/components/case-study.js' });
new vm.Script(projectContent, { filename: 'public/components/project-content.js' });
// Image briefs must never look like verified screenshots or documented design artifacts.
// Exercise the actual editorial label helper, not a duplicate classifier in tests.
const visualBriefKicker = vm.runInNewContext(projectContent + '\nvisualBriefKicker', {});
assert.match(visualBriefKicker('ILLUSTRATIVE / Proposed mobile UI'), /ILLUSTRATIVE/);
assert.match(visualBriefKicker('Approved Navigator app screens'), /APPROVED PRODUCT IMAGE NEEDED/);
assert.match(visualBriefKicker('PLANNED / Character studies'), /PLANNED ARTWORK/);
assert.match(visualBriefKicker('Show the prototype, clearly labeled PROTOTYPE'), /PROTOTYPE/);
assert.match(script, /visualBriefKicker\(p\.imageBrief\)/, 'Archive and gallery placeholders must disclose their status');
assert.match(caseStudy, /visualBriefKicker\(p\.imageBrief\)/, 'Case-study hero placeholders must disclose their status');
// Delivery badges are driven by reviewed metadata, never by an illustration
// or a case-study title. Concept/design-only work must not gain a shipped label.
const deliveryStampMarkup = vm.runInNewContext(projectContent + '\ndeliveryStampMarkup', {
 projectEvidence: {
  'Mobile Insights': ['Hoylu', 'UX/UI', 'Shipped product contribution'],
  'Connected Planning': ['Hoylu', 'UX/UI', 'Product design contribution']
 }
});
assert.match(deliveryStampMarkup({title:'Mobile Insights'}), /SHIPPED PRODUCT CONTRIBUTION/);
assert.equal(deliveryStampMarkup({title:'Connected Planning'}), '');
assert.match(caseStudy, /deliveryStampMarkup\(p\)/, 'Case-study cover must render verified delivery status');
assert.match(caseCss, /\.case-view \.case-delivery-stamp\{/, 'Shipped badge styling must remain scoped to case studies');


const context = { window: {} };
vm.runInNewContext(content, context, { filename: 'public/content.js' });
new vm.Script(script, { filename: 'public/script.js' }); // syntax only; DOM not available here

const data = context.window.PORTFOLIO;
assert.ok(data && Array.isArray(data.companies) && Array.isArray(data.playground));
const ids = data.companies.map(company => company.id);
assert.equal(new Set(ids).size, ids.length, 'Company IDs must be unique');

const projects = [
  ...data.companies.flatMap(company => {
    assert.ok(company.id && company.name && Array.isArray(company.projects));
    return company.projects;
  }),
  ...data.playground
];
const titles = projects.map(project => project.title);
assert.equal(new Set(titles).size, titles.length, 'Project titles must be unique');
for (const project of projects) {
  for (const key of ['title', 'type', 'summary', 'details', 'process', 'outcome']) {
    assert.ok(typeof project[key] === 'string' && project[key].trim(), `${project.title || 'Untitled'}: missing ${key}`);
  }
  if (project.gallery) assert.ok(Array.isArray(project.gallery), `${project.title}: gallery must be an array`);
  if (project.galleryBriefs) assert.ok(Array.isArray(project.galleryBriefs), `${project.title}: galleryBriefs must be an array`);
  for (const key of ['evidence', 'tradeoffs']) {
    if (project[key] !== undefined) {
      assert.ok(typeof project[key] === 'string' && project[key].trim(), `${project.title}: invalid ${key}`);
    }
  }
}
// Professional stories need an explicit audience, constraints, evidence
// boundary and design tradeoff. Missing research should be disclosed, not
// filled with invented interviews or metrics to satisfy this contract.
const professionalProjects = data.companies.flatMap(company => company.projects);
for (const project of professionalProjects) {
  for (const key of ['audience', 'constraints', 'evidence', 'tradeoffs']) {
    assert.ok(typeof project[key] === 'string' && project[key].trim(), `${project.title}: missing ${key}`);
  }
}
assert.match(projectContent, /const caseFactsMarkup=/, 'Case studies must share a named facts renderer');
assert.match(caseStudy, /caseFactsMarkup\(p,company\)/, 'Case study must display the facts');
assert.match(projectContent, /<dl class="case-facts"/, 'Facts should be a semantic description list');
assert.match(projectContent, /<dt class="case-fact-label"/, 'Fact labels should use dt elements');
assert.match(projectContent, /<dd class="case-fact-value"/, 'Fact values should use dd elements');
assert.match(caseCss, /\.case-view \.case-facts\s*\{/, 'Case facts must have scoped layout styles');
assert.match(caseCss, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, 'Case facts should have a narrow-screen two-column layout');
assert.match(caseCss, /@media\(max-width:480px\)\{\s*\.case-view \.case-facts\{\s*grid-template-columns:minmax\(0,1fr\)/, 'Phone case facts must switch to one readable column');
assert.match(caseCss, /\.case-view \.case-process-note\{\s*border-radius:0/, 'Evidence notes should have intentional square stationery edges');

for (const id of ['main', 'work', 'playground', 'about']) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `Missing #${id} navigation target`);
}
// Archive labels reuse the same reviewed role/delivery source as case-study
// overviews. An unlabeled project would make its status harder to assess.
assert.match(script, /archiveFactsMarkup\(evidence\)/, 'Project cards must render role/delivery facts');
assert.match(script, /projectCard\(project,index,company\.id,projectEvidence\[project\.title\]\)/, 'Professional cards must use reviewed evidence');
assert.match(script, /<dl class="project-card-facts">/, 'Role and delivery facts should use description-list semantics');
assert.match(workCss, /\.work \.project-card-facts\s*\{/, 'Archive facts must have an intentional layout');
assert.match(workCss, /\.work \.project-card-facts dd\s*\{/, 'Archive values must have readable styles');

// Static responsive guards: these do not prove browser layout or screen-reader behavior.
assert.match(navigationCss, /@media\(max-width:650px\)\{\s*\.site-header\{\s*display:flex/, 'Production mobile header must remain one row');
assert.match(navigationCss, /@media\(max-width:360px\)/, 'Narrow-phone header must have an explicit layout');
assert.match(caseCss, /@media\(max-width:760px\)\{[\s\S]*?\.case-view \.case-section-links\{\s*top:64px/, 'Phone chapter index must clear the production one-row header');
assert.match(caseCss, /\.case-view \.case-section-links\{\s*top:64px/, 'Mobile chapter index must clear the one-row header');
assert.match(caseStudy, /function revealCurrentCaseTab\(button\)/, 'Current chapter should remain visible in the phone tab strip');
assert.match(caseStudy, /chapterNav\.scrollLeft\+=delta/, 'Reveal must scroll the strip without scrolling the document');
assert.doesNotMatch(css, /\.case-view \.case-section-links\{mask-image:/, 'Do not restore the one-sided fade that obscured chapter controls');
// The version is intentionally updated with each CSS deployment. Do not pin a
// smoke test to one historic cache-busting token: that made routine releases fail.
assert.match(html, /styles\.css\?v=[a-zA-Z0-9-]+/, 'HTML must reference a versioned stylesheet');

// Case-study accessibility: the visible title names the active main landmark,
// and evidence is a labeled group rather than an unnamed generic container.
assert.match(script, /caseView\.setAttribute\("aria-labelledby","case-title"\)/, 'Case-study main landmark must have a name');
assert.match(caseStudy, /<h1 id="case-title">/, 'Case-study title must label its main landmark');
assert.match(projectContent, /<dl class="case-evidence" aria-label="Project overview"/, 'Project overview must use a semantic description list');
assert.match(projectContent, /<dt class="case-evidence-label"/, 'Project overview labels must use dt elements');
assert.match(projectContent, /<dd class="case-evidence-value"/, 'Project overview values must use dd elements');
assert.match(caseCss, /\.case-view \.case-evidence-value\{margin:0\}/, 'Overview values must not inherit default dd indentation');
assert.doesNotMatch(script, /behavior:"instant"/, 'Scroll restoration should use a standard behavior value');

// A light-theme notebook-paper rule must not cover the dark Playground intro.
// This is a source-order guard only, not a measured color-contrast test.
const genericPaperRule = css.indexOf('html:not([data-theme="dark"]) .section-head>p');
const playgroundContrastRule = css.lastIndexOf('html:not([data-theme="dark"]) .playground .section-head>p');
assert.ok(genericPaperRule >= 0 && playgroundContrastRule > genericPaperRule, 'Playground contrast override must follow the notebook-paper rule');
assert.match(css.slice(playgroundContrastRule, playgroundContrastRule + 260), /background:transparent/, 'Playground intro must not inherit paper background');
assert.doesNotMatch(caseStudy, /case-section-context/, 'Chapter navigation must not reintroduce the redundant project-title inset');
assert.match(caseStudy, /<nav class="case-section-links" aria-label="On this case study">/, 'Sticky chapter navigation must retain an accessible name');
// Visual briefs are editorial placeholders, not screenshots. Keep the gallery's
// accessible name truthful when no approved images have been supplied.
assert.match(caseStudy, /const galleryLabel=gallery\.length&&gallery\.every\(Boolean\)/, 'Gallery label must reflect whether actual images are present');
assert.match(caseStudy, /Visual briefs and image placeholders/, 'Placeholder-only galleries must not claim to be image galleries');

// Guard the component load order and the lighter sidebar hierarchy without
// claiming that source checks prove actual text contrast or browser reflow.
const helperIndex = html.indexOf('src="/components/project-content.js');
const rendererIndex = html.indexOf('src="/components/case-study.js');
const routerIndex = html.indexOf('src="/script.js');
assert.ok(helperIndex >= 0 && helperIndex < rendererIndex && rendererIndex < routerIndex, 'Case-study helpers, renderer, and router must load in order');
assert.match(html, /\/components\/case-study\.css\?v=/, 'Case-study component stylesheet must be loaded');
assert.match(caseCss, /\.case-view \.case-fact-value\{\s*font-weight:400/, 'Sidebar values should read as supporting text rather than bold headings');
assert.match(caseCss, /--case-type-title:/, 'Case-study type scale should remain component-scoped');
assert.match(projectContent, /const processNotesMarkup=/, 'Evidence and tradeoff notes must have a shared renderer');
const renderProcessNotes = vm.runInNewContext(projectContent + '\nprocessNotesMarkup', { esc: value => String(value) });
const exampleNotes = renderProcessNotes({ evidence:'Documented scope only', tradeoffs:'Design reasoning only' });
assert.match(exampleNotes, /data-note-kind="evidence"/, 'Evidence boundaries need their own semantic presentation hook');
assert.match(exampleNotes, /data-note-kind="rationale"/, 'Tradeoffs need their own semantic presentation hook');
assert.ok(exampleNotes.indexOf('Documented scope only') < exampleNotes.indexOf('Design reasoning only'), 'Evidence must precede rationale');
assert.equal(renderProcessNotes({}), '', 'Projects without evidence or rationale should not show an empty chapter');
assert.match(renderProcessNotes({evidence:'Scope only'},2), /<h2 id="case-evidence-notes">02 \/ Evidence &amp; tradeoffs<\/h2>/, 'Evidence must be chapter 02 when process is omitted');
assert.match(renderProcessNotes({evidence:'Scope only'},3), /<h2 id="case-evidence-notes">03 \/ Evidence &amp; tradeoffs<\/h2>/, 'Evidence remains chapter 03 when process exists');
assert.match(caseCss, /\.case-view \.case-process-note\[data-note-kind="evidence"\]/, 'Evidence styling must remain in the case-study component');
assert.match(caseCss, /\.case-view \.case-process-note\[data-note-kind="rationale"\]/, 'Rationale styling must remain in the case-study component');
// A separate evidence chapter makes the research/assumption boundary discoverable
// without upgrading design rationale into documented testing or outcomes.
assert.match(projectContent, /<h2 id="case-evidence-notes">'\+String\(chapterNumber\)\.padStart\(2,"0"\)/, 'Evidence chapter heading must use the actual chapter number');
assert.match(caseStudy, /data-case-jump="case-evidence-notes"/, 'Chapter navigation must link to the evidence boundary');
assert.match(caseStudy, /processNotes=processNotesMarkup\(p,hasProcess\?3:2\)/, 'Evidence chapter must follow the optional process chapter');
assert.match(caseStudy, /outcomeChapter=2\+Number\(hasProcess\)\+Number\(Boolean\(processNotes\)\)/, 'Outcome chapter number must follow the sections actually rendered');

// Pass 3: archive geometry is shared; only surface/focus tokens change by theme.
assert.match(workCss, /--archive-facts-edge:var\(--line\)/, 'Light archive dividers need a shared token');
assert.match(workCss, /--archive-facts-edge:color-mix\(/, 'Dark archive dividers need an explicit token');
assert.match(workCss, /--archive-focus-edge:color-mix\(/, 'Dark archive focus needs a visible token');
assert.match(workCss, /outline:2px solid var\(--archive-focus-edge\)/, 'Archive focus must consume the theme token');
assert.match(workCss, /text-wrap:balance/, 'Archive headings must balance across card widths');

// Pass 4: reading hierarchy, chapter state and mobile gallery contracts.
assert.match(caseCss, /text-wrap:balance/, 'Case-study cover titles should balance');
assert.match(caseCss, /max-width:74ch/, 'Long-form reading measure should be constrained');
assert.match(caseCss, /\.case-view \.case-section-links button\[aria-current="location"\]/, 'Active chapter needs a visible tab state');
assert.match(caseCss, /\.case-view \.case-evidence-item\{[^}]*border-radius:0/, 'Evidence cards should retain the editorial paper shape');
assert.match(caseCss, /\.case-view \.case-gallery\{grid-template-columns:minmax\(0,1fr\)\}/, 'Phone galleries should stack in one column');

// Pass 11: keep chapter navigation target lookup centralized.
assert.ok(caseStudy.includes('const caseJumpTargets=new Map('), 'Case study must cache chapter targets per render');
assert.ok(caseStudy.includes('const heading=caseJumpTargets.get(button.dataset.caseJump)'), 'Chapter click handlers must reuse cached targets');
assert.ok(caseStudy.includes('const caseJumpHeadings=[...caseJumpTargets.values()]'), 'Reading-progress tracking must reuse chapter targets');
assert.ok(!caseStudy.includes('const heading=document.getElementById(button.dataset.caseJump)'), 'Avoid duplicate chapter DOM lookups');

// Pass 10: one archive geometry with theme-specific color tokens.
assert.match(workCss, /--archive-surface:var\(--palette-paper\)/, 'Archive paper surface must have a light token');
assert.match(workCss, /--archive-surface:color-mix\(in srgb,var\(--palette-navy\)/, 'Archive paper surface must have a dark token');
assert.match(workCss, /background-color:var\(--archive-surface\)/, 'Archive card background must use its theme token');
assert.match(workCss, /border:1px solid var\(--archive-edge\)!important/, 'Archive card border must use its theme token');
assert.match(workCss, /color:var\(--file-cta-ink,var\(--file-accent\)\)/, 'Archive CTA must use a shared theme color');

// Pass 9: hero type hierarchy and archive title token contracts.
assert.ok(heroPolishCss.includes('max-width:54ch;text-wrap:pretty;line-height:1.6'), 'Desktop hero copy must retain a readable measure');
assert.ok(heroPolishCss.includes('line-height:1.65;max-width:38ch'), 'Mobile hero copy must retain a readable line length');
assert.ok(heroPolishCss.includes('margin:var(--space-4) 0 var(--space-3)'), 'Mobile headline should use shared spacing tokens');
assert.ok(workCss.includes('font-size:clamp(var(--type-h3),2.6vw,2.375rem)'), 'Archive headings must reference the shared type scale');

// Pass 8: mobile rhythm and single-row navigation guardrails.
const heroCss = read('../public/components/hero-polish.css');
// Keep the mobile hero's discipline line from leaving an isolated final word.
assert.ok(heroCss.includes('letter-spacing:.075em;text-wrap:balance'), 'Mobile hero eyebrow should balance wrapped text');
assert.match(heroCss, /\.hero\.wrap\{[^}]*min-height:0;[^}]*padding-bottom:clamp\(/, 'Mobile hero must not reserve a viewport of empty space');
assert.ok(workCss.includes('.work.wrap{padding-bottom:clamp(28px,7vw,44px)}'), 'Mobile work section needs a compact handoff');
assert.ok(navigationCss.includes('gap:clamp(7px,2.2vw,13px)'), 'Phone navigation spacing should remain intentional');
assert.ok(navigationCss.includes('min-height:44px;padding:0 1px'), 'Phone navigation links must retain 44px hit height');

// Pass 7: routed metadata and mobile chapter navigation contracts.
for (const key of ['og:title','og:description','og:url','twitter:title','twitter:description']) {
 assert.ok(caseStudy.includes('setMeta(\'meta[' + (key.startsWith('og:') ? 'property' : 'name') + '="' + key + '"]\''), 'Case-study routing must update ' + key);
}
assert.match(caseStudy, /if\(active\.getAttribute\("aria-current"\)==="location"\)\{/, 'Already-active chapters must remain revealable');
assert.match(caseStudy, /revealCurrentCaseTab\(active\);/, 'Chapter navigation must reveal active tabs');

// Pass 6: production stylesheet ownership and duplicate-rule guardrails.
assert.doesNotMatch(caseCss, /html\[data-theme="dark"\] \.case-evidence-item\{/, 'Evidence theme colors should use shared tokens, not duplicate dark rules');
assert.match(caseCss, /\.case-view \.case-evidence-item\{[^}]*border-radius:0/, 'Evidence geometry must remain in the scoped component');
assert.match(caseCss, /\.case-view \.case-evidence-item\{[^}]*padding:var\(--space-4/, 'Evidence spacing must use the shared scale');

// Pass 5: keyboard focus, touch targets, and reduced-motion contracts.
assert.match(navigationCss, /:focus-visible/, 'Header navigation must expose keyboard focus');
assert.match(navigationCss, /@media\(forced-colors:active\)/, 'Focus must remain visible in forced-colors mode');
assert.match(caseCss, /\.case-view \.case-section-links button\{\s*min-height:44px;/, 'Case chapter controls must meet the 44px touch target');
assert.match(caseCss, /\.case-view \.case-section-links button:focus-visible/, 'Case chapter controls must show focus');
assert.match(stationeryCss, /@media\(prefers-reduced-motion:reduce\)/, 'Stationery interactions must honor reduced motion');
assert.match(stationeryCss, /transition:none;/, 'Reduced motion must disable highlight transitions');

// Pass 15: footer must paint a solid themed surface, not expose notebook dots.
assert.ok(navigationCss.includes('background:var(--site-chrome-bg);'), 'Footer must reset inherited background layers');
assert.match(css, /html\[data-theme="dark"\]\s*\{[^}]*--site-chrome-bg\s*:/, 'Dark theme must supply a dedicated chrome surface');

// Pass 13: leaving a case study must never strand focus in hidden content.
assert.match(script, /if\(leavingProject&&nextHash!=="work"&&nextHash!=="playground"\)/, 'Non-gallery case-study exits must restore focus');
assert.match(script, /destination\.focus\(\{preventScroll:true\}\)/, 'Focus must move to a visible destination');
assert.match(script, /caseOpener=null;\s*\}\);\s*\}\s*previousHash=nextHash;/, 'Non-gallery exits must discard stale project openers');
assert.match(caseCss, /@media\(forced-colors:active\)\{[\s\S]*?\.case-view \.case-section-links button\[aria-current="location"\]\{border-color:Highlight\}/, 'Chapter selection must remain visible in forced colors');

// Pass 12: chapter controls expose an equivalent focus state in both themes.
assert.match(caseCss, /\.case-section-links button:focus-visible\{[^}]*background:var\(--surface-blush\);[^}]*text-decoration:underline;/, 'Keyboard focus must provide tactile feedback beyond the outline');
assert.match(caseCss, /html\[data-theme="dark"\] \.case-section-links button:focus-visible\{[^}]*background:color-mix\(/, 'Dark-mode chapter focus must use a theme-aware surface');

// The pastel folder tabs were previously white-on-color (< 3.2:1).
// Measure their shared ink against each client accent; geometry and theme
// behavior remain unchanged. This checks tokens, not computed browser styles.
const tokenHex = (source, name) => {
 const match = source.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]{6})\\s*;'));
 assert.ok(match, 'Missing hex color token: ' + name);
 return match[1];
};
const luminance = hex => {
 const channels = hex.slice(1).match(/../g).map(channel => parseInt(channel,16)/255)
  .map(value => value <= .04045 ? value/12.92 : ((value+.055)/1.055)**2.4);
 return channels[0]*.2126 + channels[1]*.7152 + channels[2]*.0722;
};
const contrastRatio = (a,b) => {
 const [lighter,darker] = [luminance(a),luminance(b)].sort((x,y)=>y-x);
 return (lighter+.05)/(darker+.05);
};
assert.match(workCss, /\.client-file \.client-file-label\{[^}]*color:var\(--file-label-ink\)/, 'Client tabs must use their accessible ink token');
const tabInk = tokenHex(workCss, 'file-label-ink');
for (const accent of ['blue','pink','green']) {
 const tabColor = tokenHex(stationeryCss, 'palette-' + accent);
 assert.ok(contrastRatio(tabInk,tabColor) >= 4.5, accent + ' client tab must meet WCAG AA normal-text contrast');
}


console.log(`PASS: ${data.companies.length} companies, ${projects.length} projects, navigation targets, JS syntax and component contracts`);
