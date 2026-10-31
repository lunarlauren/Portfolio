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
const foundationsCss = read('../public/components/foundations.css');
const navigationCss = read('../public/components/navigation.css');
const heroPolishCss = read('../public/components/hero-polish.css');
const workCss = read('../public/components/work-cards.css');
const editorialCss = read('../public/components/monochrome-editorial.css');
const homepageCss = read('../public/components/homepage-base.css');
const playgroundCss = read('../public/components/playground.css');
const visualPlaceholderCss = read('../public/components/visual-placeholders.css');
const aboutCss = read('../public/components/about.css');
const stationeryCss = read('../public/components/stationery.css');

// Regression: a former dark-theme selector accidentally outlined ordinary
// labels and paragraphs along with the focused CTA, drawing blue rectangles.
// Only actual focus targets should receive the global focus ring.
{
 const staticText = ['.eyebrow', '.hero-description', '.section-head>p', '.about-copy p'];
 const allCss = [foundationsCss, homepageCss, css, navigationCss, workCss, caseCss, playgroundCss, aboutCss, stationeryCss].join('\n');
 const rulesWithOutlines = [...allCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(([, , declarations]) => /(?:^|;)\s*outline\s*:/.test(declarations));
 for (const textSelector of staticText) {
  assert.ok(!rulesWithOutlines.some(([, selectors]) =>
   selectors.split(',').map(s => s.trim()).includes('html[data-theme="dark"] ' + textSelector)),
  'Dark theme must not outline static text: ' + textSelector);
 }
 assert.match(foundationsCss, /:where\(a,button,\[tabindex="-1"\]\):focus-visible/, 'Shared keyboard focus belongs in foundations.css');
 assert.match(foundationsCss, /html\[data-theme="dark"\] \.primary-link:focus-visible/, 'Dark CTA focus must stay visible');
 assert.doesNotMatch(css, /html\[data-theme="dark"\] \.hero-description\s*,/, 'Legacy dark text outline must not return');
}

// Navigation and viewport ownership regressions: source-level, not visual QA.
{
 assert.doesNotMatch(css, /scroll-padding-top:82px|scroll-margin-top:82px|site-header nav a,\.feature-project-link/, 'Legacy CSS must not regain mixed navigation rules');
 assert.match(navigationCss, /html\{scroll-padding-top:82px\}/, 'Sticky header scroll offset belongs to navigation');
 assert.match(navigationCss, /#work,#playground,#about,#top,#main\{scroll-margin-top:82px\}/, 'Section anchors must remain in sync');
 assert.match(navigationCss, /\.site-header nav a\{white-space:nowrap;min-height:44px;display:inline-flex;align-items:center\}/, 'Desktop navigation links need 44px targets');
 assert.match(stationeryCss, /env\(safe-area-inset-left\)/, 'Phone gutters must honor safe areas');
 assert.match(workCss, /\.notebook-project-index \.project-card-link\{min-height:44px\}/, 'Active mobile archive links retain 44px targets');
 assert.match(caseCss, /\.case-next\{min-height:44px/, 'Case next links retain 44px targets');
 assert.match(caseCss, /\.case-view:focus\{outline:none!important/, 'Programmatic case wrapper focus stays undecorated');
 assert.match(aboutCss, /min-width:601px\) and \(max-width:760px/, 'Tablet About spacing stays scoped');
}

// Theme state is part of the accessible light/dark experience. Exercise the
// actual inline controller: OS changes follow only without a manual choice,
// and cross-tab updates refresh the toggle and browser theme color.
{
 const inlineTheme=html.match(/<footer[\s\S]*?<script>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(inlineTheme,'Homepage theme controller must remain discoverable');
 new vm.Script(inlineTheme,{filename:'homepage-theme.js'});
 // Toggle buttons keep a stable name; the pressed state announces whether dark mode is on.
 assert.match(html, /<button class="theme-toggle"[^>]*aria-label="Dark theme"[^>]*aria-pressed="false"/,
  'Theme toggle needs a stable accessible name and an initial pressed state');
 const state={dark:false,stored:null,theme:null,color:null,pressed:null,label:'Dark theme'};
 const root={style:{},setAttribute:(key,value)=>{if(key==='data-theme')state.theme=value},getAttribute:()=>state.theme};
 const icon={textContent:''};
 const button={setAttribute:(key,value)=>{if(key==='aria-pressed')state.pressed=value;if(key==='aria-label')state.label=value},querySelector:()=>icon,addEventListener:(name,callback)=>{if(name==='click')state.click=callback}};
 const scheme={get matches(){return state.dark},addEventListener:(name,callback)=>{if(name==='change')state.schemeChange=callback}};
 const browser={matchMedia:()=>scheme,addEventListener:(name,callback)=>{if(name==='storage')state.storage=callback}};
 const document={documentElement:root,getElementById:()=>button,querySelector:()=>({setAttribute:(key,value)=>{if(key==='content')state.color=value}})};
 const localStorage={getItem:()=>state.stored,setItem:(key,value)=>{state.stored=value}};
 vm.runInNewContext(inlineTheme,{document,window:browser,localStorage});
 assert.equal(state.theme,'light','Default light OS preference must be honored');
 assert.equal(state.pressed,'false','Light theme must expose the toggle as not pressed');
 assert.equal(state.label,'Dark theme','Theme toggle must keep its accessible name in light mode');
 state.dark=true;state.schemeChange();
 assert.equal(state.theme,'dark','OS theme changes must apply without a stored choice');
 state.click();
 assert.equal(state.theme,'light','Manual theme toggle must override the OS');
 state.schemeChange();
 assert.equal(state.theme,'light','OS changes must not override a manual selection');
 state.storage({key:'portfolio-theme',newValue:'dark'});
 assert.equal(state.theme,'dark','Theme choices in another tab must synchronize');
 assert.equal(state.label,'Dark theme','Cross-tab updates must not rename the toggle');
 assert.equal(state.pressed,'true','Toggle pressed state must reflect dark theme');
 assert.equal(state.color,'#111d2a','Browser chrome color must reflect dark theme');
 state.storage({key:'portfolio-theme',newValue:null});
 assert.equal(state.theme,'dark','Clearing preference must restore current OS theme');
 assert.equal(state.label,'Dark theme','System-driven changes must not rename the toggle');
}

// Component ownership and stylesheet order are part of the visual contract.
const stylesheetOrder = ['styles.css', 'visual-placeholders.css', 'playground.css', 'hero-polish.css', 'stationery.css', 'navigation.css', 'case-study.css'];
let previousPosition = -1;
for (const name of stylesheetOrder) {
 const match = html.indexOf('/' + (name === 'styles.css' ? name : 'components/' + name));
 assert.ok(match > previousPosition, name + ' must load after the preceding stylesheet');
 previousPosition = match;
}
assert.match(visualPlaceholderCss, /html\[data-theme="dark"\] \.project-visual:not/, 'Placeholder dark tokens must stay in the shared component');
assert.doesNotMatch(visualPlaceholderCss, /\.project-visual:not\(:has\(img\)\) \.visual-label\{/, 'No nested border around illustrative briefs');
assert.match(visualPlaceholderCss, /\.project-visual \.visual-brief\{[^}]*display:flex;/, 'Shared brief remains readable');
assert.doesNotMatch(workCss, /\.project-visual \.visual-brief\{\s*box-shadow:none/, 'No unused Work brief shadow reset');
assert.doesNotMatch(editorialCss, /\.project-visual:not\(:has\(img\)\) \*\{/, 'No redundant editorial placeholder descendant override');
assert.doesNotMatch(stationeryCss, /\.work \.section-head\{margin-bottom:/, 'Work heading rhythm belongs to work-cards.css');
assert.equal((workCss.match(/@media\(max-width:760px\)/g)||[]).length,1,
 'Work tablet archive layout should have one responsive owner');
assert.equal((workCss.match(/@media\(max-width:600px\)/g)||[]).length,1,
 'Work phone intro and archive should share one breakpoint');
assert.match(workCss,/\.work \.section-head h2\{[^}]*font-size:clamp\(2rem,7\.8vw,2\.375rem\)/,
 'Work phone headline must not crowd out the first case study');
assert.doesNotMatch(workCss,/\.client-file::before\{content:none\}/,
 'Unused client tab pseudo-element reset must stay retired');

assert.doesNotMatch(css, /^\.project-visual:not\(:has\(img\)\)/m, 'Shared placeholder rules must not return to legacy CSS');
assert.doesNotMatch(css, /\/\* Problem-solving hero: shared layout in both themes/, 'Extracted hero polish must not return to legacy CSS');
assert.match(heroPolishCss, /\.hero \.hero-copy h1\{/, 'Hero typography must remain in its component');
// Hero ink, artwork stacking and 420px wrapping have one component owner.
assert.doesNotMatch(css, /\.hero-feature|\.hero-foot|\.hero-description|\.hero-copy|\.hero h1|@media\(max-width:420px\)/,
 'Legacy paper rules must not regain hero declarations');
assert.match(heroPolishCss, /html\[data-theme="dark"\] \.hero h1 em\{color:var\(--brand-pink\)!important\}/,
 'Hero component retains dark emphasis ink');
assert.match(heroPolishCss, /html:not\(\[data-theme="dark"\]\) \.hero-description\{background:transparent;/,
 'Hero component keeps notebook paper visible through description');
assert.match(heroPolishCss, /@media\(max-width:420px\)\{[\s\S]*?\.hero \.hero-description\{max-width:100%;overflow-wrap:break-word\}/,
 'Narrow phones retain description wrapping');
// The old responsive hero layout was consolidated into the finishing component.
assert.doesNotMatch(css, /@media\(max-width:950px\)|@media\(max-width:650px\)|@media\(min-width:1024px\)/,
 'Legacy stylesheet must not own the hero tablet/desktop breakpoints');
assert.doesNotMatch(css, /\.hero-feature:hover \.feature-art,\.primary-link:hover/,
 'Legacy stylesheet must not combine artwork and button motion guards');
assert.match(heroPolishCss, /@media\(max-width:950px\)\{[\s\S]*?\.hero-feature\{min-height:420px\}/,
 'Hero component must retain the 950px single-column breakpoint');
assert.match(heroPolishCss, /@media\(max-width:760px\)\{[\s\S]*?\.hero-actions\{gap:18px\}/,
 'Hero component must retain tablet spacing and action gap');
assert.match(heroPolishCss, /@media\(max-width:650px\)\{[\s\S]*?\.hero-feature\{min-height:320px\}/,
 'Hero component must preserve the 650px fold and illustration height');
assert.match(heroPolishCss, /\.hero \.feature-art\{height:100%;min-height:0\}/,
 'Desktop hero art must retain its original fill height');
assert.match(homepageCss, /\.primary-link:hover\{transform:none\}/,
 'Reduced-motion CTA hover must remain with homepage button styles');
// The hero notebook note and phone action sizing have one component owner.
assert.doesNotMatch(css, /\.notebook-hero-note\s*\{|\.hero \.notebook-hero-note::before/,
 'Legacy CSS must not regain notebook note styles');
assert.match(heroPolishCss, /\.notebook-hero-note\{display:inline-flex/, 'Hero component must own notebook note typography');
assert.match(heroPolishCss, /\.hero \.notebook-hero-note::before/, 'Hero component must own note optical alignment');
assert.match(heroPolishCss, /\.hero \.hero-actions\{[^}]*flex-direction:column/, 'Phone hero actions retain column layout');
assert.match(heroPolishCss, /\.hero \.hero-actions \.primary-link\{[^}]*padding:14px 20px/, 'Phone CTA retains its effective touch padding');

// The mobile layout visually places the portrait before the hero CTAs.
// Keeping the portrait panel noninteractive prevents a mismatched tab order.
const heroFeatureMarkup = html.match(/<div class="hero-feature" id="hero-feature">[\s\S]*?<\/div><\/section>/)?.[0];
assert.ok(heroFeatureMarkup, 'Homepage must retain the illustrated hero panel');
assert.match(heroFeatureMarkup, /<img class="hero-portrait-art"[^>]+alt="[^"]+"/, 'Hero portrait must have useful alternative text');
assert.doesNotMatch(heroFeatureMarkup, /<(?:a|button)\b/, 'Visually reordered portrait panel must not contain keyboard-focusable controls');
// The hero should direct attention to UX work, not add an unrelated keyboard
// stop for a decorative animation. Keep the useful work CTA and portrait.
const heroMarkup = html.match(/<section class="hero wrap" id="top">[\s\S]*?<\/section>/)?.[0];
assert.ok(heroMarkup, 'Homepage must retain its introductory hero');
assert.match(heroMarkup, /class="primary-link" href="#work"/, 'Hero must keep the primary work CTA');
assert.doesNotMatch(heroMarkup, /<button\b|data-sticker-placeholder/, 'Decorative star must not be a hero control');
assert.doesNotMatch(script, /data-sticker-placeholder|sticker-pop/, 'Removed decorative control must not leave JavaScript listeners');
assert.doesNotMatch(css + heroPolishCss, /notebook-sticker|sticker-pop/, 'Removed decorative control must not leave unused CSS');

// The homepage's progressive reveal must not hide editorial content if a browser
// exposes an IntersectionObserver property that is not a callable constructor.
assert.match(script, /typeof window\.IntersectionObserver!=="function"/,
 'Reveals must check that the observer constructor is callable');
const revealStart=script.indexOf('function initReveals(){');
const revealEnd=script.indexOf('\ninitReveals();',revealStart);
assert.ok(revealStart>=0&&revealEnd>revealStart,'Reveal controller must remain discoverable');
const revealController=script.slice(revealStart,revealEnd+'\ninitReveals();'.length);
let revealAdds=0;
vm.runInNewContext(revealController,{
 window:{IntersectionObserver:undefined,matchMedia:()=>({matches:false})},
 document:{querySelectorAll:()=>[{classList:{add:()=>{revealAdds++}}}]}
});
assert.equal(revealAdds,0,'Unsupported observers must leave section content visible');

// Preserve the intentionally distinct portraits: illustration introduces
// visual craft in the hero; the real headshot identifies the designer in About.
// Neither image is a case-study product screenshot or editorial placeholder.
assert.match(heroFeatureMarkup, /src="\/laurenlevenportfolioheroportrait\.png"/,
 'Hero must retain Lauren\'s illustrated portrait');
const aboutPortraitMarkup = html.match(/<figure class="about-portrait">[\s\S]*?<\/figure>/)?.[0];
assert.ok(aboutPortraitMarkup, 'About must retain its portrait and caption');
assert.match(aboutPortraitMarkup, /src="\/Headshot%20Lauren%20Leven\.png"/,
 'About should use Lauren\'s actual headshot, not repeat the hero illustration');
assert.match(aboutPortraitMarkup, /alt="Portrait photograph of Lauren Leven"/,
 'About headshot must have a factual accessible description');

// Phone About has one clear visual introduction rather than a full-screen
// heading followed by a detached centered headshot and oversized body copy.
// Preserve the genuine photo, biography, and one-column About reading order.
const phoneAboutCss = aboutCss.slice(aboutCss.lastIndexOf('@media (max-width: 600px)'));
assert.ok(phoneAboutCss.startsWith('@media (max-width: 600px)'), 'About needs a dedicated phone layout owner');
assert.match(phoneAboutCss, /\.about h2\s*\{[^}]*font-size:\s*clamp\(/,
 'Mobile About heading must have a smaller editorial type scale');
assert.doesNotMatch(phoneAboutCss, /max-width:\s*12ch/,
 'Mobile About heading should not be restricted to an unnecessarily narrow 12ch measure');
assert.match(phoneAboutCss, /\.about \.about-portrait\s*\{[^}]*float:\s*left/,
 'Mobile headshot must sit with the introduction instead of standing alone');
assert.match(phoneAboutCss, /\.about \.about-portrait img\s*\{[^}]*object-fit:\s*cover/,
 'Small portrait should use a consistent cropped frame');
assert.match(phoneAboutCss, /\.about \.about-copy p\s*\{[^}]*line-height:\s*1\.55/,
 'Mobile biography should retain legible reading leading');
assert.match(html, /03 \/ ABOUT ME/, 'About section label must describe its content');
assert.match(aboutCss, /\.about \.about-bottom\s*\{[^}]*display:\s*block/,
 'About should have one readable column after removing the inventory');
assert.match(html, /class="ai-process" aria-labelledby="ai-process-title"/,
 'About should keep its accessible AI process note');
assert.doesNotMatch(html, /creative-inventory|inventory-inspect|components\/inventory\.js/,
 'Removed inventory must not be rendered or loaded');
assert.doesNotMatch(css+aboutCss+stationeryCss+script, /creative-inventory|\.inventory-(?:item|grid|heading|icon|inspect)/,
 'Removed inventory must not retain dead styles or reveal behavior');

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
// The entire project card is a link. Do not mask its title and challenge with
// a generic aria-label: give link navigation a concise name and description.
const cardStart = script.indexOf('const projectCard=');
const cardEnd = script.indexOf('// Single source of truth', cardStart);
assert.ok(cardStart >= 0 && cardEnd > cardStart, 'Project card renderer must remain discoverable');
const renderProjectCard = vm.runInNewContext(
 script.slice(cardStart, cardEnd) + '\nprojectCard',
 {
  projectSlug: value => String(value).replace(/[^a-z0-9]+/gi, '-'),
  esc: value => String(value),
  visual: () => '<div>image</div>',
  processTeaser: project => project.process || '',
  archiveFactsMarkup: (evidence,id) => evidence ? '<dl id="' + id + '"><dt>My contribution</dt><dd>' + evidence[1] + '</dd><dt>Delivery</dt><dd>' + evidence[2] + '</dd></dl>' : '',
  casePath: () => '/case-studies/hoylu/connected-planning/'
 }
);
// Project-card descriptions include the challenge and the visible process teaser.
// Reviewed professional cards also expose role/delivery; absent facts or process
// must never leave dangling accessible-description references.
for (const [group,evidence] of [
 ['hoylu',['Hoylu context','Mobile UX and visual design','Shipped product contribution']],
 ['playground',undefined]
]) {
 const card = renderProjectCard({
  title: 'Sample project', type: 'Product UX',
  summary: 'The challenge and audience context.', process: 'I explored information hierarchy.'
 }, 0, group, evidence);
 const prefix = 'project-card-' + group + '-0';
 assert.match(card, new RegExp('aria-labelledby="' + prefix + '-title ' + prefix + '-cta"'));
 assert.match(card, new RegExp('aria-describedby="' + prefix + '-summary' + (evidence ? ' ' + prefix + '-facts' : '') + ' ' + prefix + '-process"'));
 for (const suffix of ['title', 'summary', 'cta', ...(evidence ? ['facts'] : []), 'process']) {
  assert.match(card, new RegExp('id="' + prefix + '-' + suffix + '"'));
 }
 if (evidence) {
  assert.match(card, /<dt>My contribution<\/dt><dd>Mobile UX and visual design<\/dd>/);
  assert.match(card, /<dt>Delivery<\/dt><dd>Shipped product contribution<\/dd>/);
 } else {
  assert.doesNotMatch(card, /-facts"/, 'No dangling facts ID on independent cards');
 }
 assert.doesNotMatch(card, /aria-label=/, 'A card-wide label would mask its context');
 assert.match(card, /The challenge and audience context\./);
 assert.match(card, /<strong>Design approach<\/strong> I explored information hierarchy\./);
}
// Optional process fields must not create a dangling aria-describedby ID.
const noProcessCard = renderProjectCard({
 title:'Sample project',type:'Product UX',summary:'A concise challenge.',process:''
},1,'playground',undefined);
assert.match(noProcessCard,/aria-describedby="project-card-playground-1-summary"/);
assert.doesNotMatch(noProcessCard,/-process"/);

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


// Keep authored UX reasoning visible on the case-study cover before image
// placeholders, without inventing research, test results, or implementation.
const renderCaseApproach = vm.runInNewContext(projectContent + '\ncaseApproachMarkup', {
 esc: value => String(value).replace(/</g, '&lt;').replace(/>/g, '&gt;')
});
const approachSample = renderCaseApproach({archiveApproach:'I prioritized clear <status> and context.'});
assert.match(approachSample, /class="case-approach-label">Design approach<\/span>/);
assert.match(approachSample, /I prioritized clear &lt;status&gt; and context\./);
assert.equal(renderCaseApproach({}), '', 'Missing authored approach must not produce an invented teaser');
assert.equal(renderCaseApproach({archiveApproach:'   '}), '', 'Blank approach must not create an empty visual block');
assert.ok(caseStudy.indexOf('caseApproachMarkup(p)') > caseStudy.indexOf('case-intro'),
 'Case-study cover must present authored approach after the challenge summary');
assert.ok(caseStudy.indexOf('caseApproachMarkup(p)') < caseStudy.indexOf('evidenceMarkup(p)'),
 'Design approach must appear before the image and chapter navigation');
assert.match(caseCss, /\.case-view \.case-approach\{/, 'Approach layout belongs to the case-study component');
assert.match(caseCss, /@media\(max-width:600px\)\{[\s\S]*?\.case-view \.case-approach\{grid-template-columns:minmax\(0,1fr\)/,
 'Phone approach label and copy must stack without horizontal overflow');

const context = { window: {} };
vm.runInNewContext(content, context, { filename: 'public/content.js' });
new vm.Script(script, { filename: 'public/script.js' }); // syntax only; DOM not available here
// Case-study links are enhanced only for unmodified same-tab navigation.
// Exercise the real delegated handler so target="_blank", named browsing
// contexts, and download links retain native browser behavior.
{
 const start=script.indexOf('document.addEventListener("click",event=>{',script.indexOf('previousHash=nextHash;'));
 const end=script.indexOf('\n});',start);
 assert.ok(start>=0&&end>start,'Case-study link handler must remain discoverable');
 const handlers=[],navigations=[];
 vm.runInNewContext(script.slice(start,end+4),{
  document:{addEventListener:(name,handler)=>{assert.equal(name,'click');handlers.push(handler)}},
  navigateCase:href=>navigations.push(href)
 });
 assert.equal(handlers.length,1);
 const click=(target='',download=false)=>{
  let prevented=false;
  const link={target,hasAttribute:name=>name==='download'&&download,getAttribute:()=>'/case-studies/hoylu/mobile-insights/'};
  handlers[0]({target:{closest:()=>link},button:0,defaultPrevented:false,
   metaKey:false,ctrlKey:false,shiftKey:false,altKey:false,
   preventDefault:()=>{prevented=true}});
  return prevented;
 };
 assert.equal(click(),true,'Same-tab case-study links should use SPA navigation');
 assert.equal(click('_self'),true,'Explicit _self should use SPA navigation');
 assert.equal(click('_blank'),false,'New-tab links must use native navigation');
 assert.equal(click('previewFrame'),false,'Named browsing contexts must use native navigation');
 assert.equal(click('',true),false,'Download links must use native behavior');
 assert.equal(navigations.length,2,'Only same-tab links should reach SPA routing');
}

// A missing/renamed case-study URL must not show the Work archive while
// retaining a broken /case-studies/... address. Exercise the real route()
// branch with a small DOM/history stub; this is not browser navigation QA.
{
 const start=script.indexOf('function route(){');
 const end=script.indexOf('// Remember where a visitor opened a case study',start);
 assert.ok(start>=0&&end>start,'Router branch must remain discoverable');
 const routeSource=script.slice(start,end);
 const exerciseRoute=(pathname,hash)=>{
  const replaced=[],events=[],main={hidden:true},caseView={hidden:false},skip={href:'#case-study'};
  vm.runInNewContext(routeSource+'\nroute()',{
   caseRoute:()=>hash,location:{pathname},history:{replaceState:(...args)=>replaced.push(args)},
   window:{caseSectionObserver:null},$:()=>skip,main,caseView,
   restoreHomeMetadata:()=>events.push('home'),renderCaseStudy:()=>events.push('case')
  });
  return {replaced,events,main,caseView,skip};
 };
 const missing=exerciseRoute('/case-studies/hoylu/old-title/','work');
 assert.equal(missing.replaced.length,1,'Unknown case-study URLs should be normalized');
 assert.equal(missing.replaced[0][2],'/#work','Broken URLs should resolve to the Work archive');
 assert.equal(missing.main.hidden,false,'The archive should be visible after recovery');
 assert.equal(missing.caseView.hidden,true,'The old case-study view should be hidden');
 assert.equal(missing.skip.href,'#main','Skip link should target the visible main landmark');
 assert.deepEqual(missing.events,['home'],'Homepage metadata should be restored');
 assert.equal(exerciseRoute('/','work').replaced.length,0,'Ordinary homepage routes should not be rewritten');
 const valid=exerciseRoute('/case-studies/hoylu/mobile-insights/','project/hoylu/1');
 assert.equal(valid.replaced.length,0,'Valid case-study routes must remain unchanged');
 assert.deepEqual(valid.events,['case'],'Valid case studies must still render');
}

const data = context.window.PORTFOLIO;
assert.ok(data && Array.isArray(data.companies) && Array.isArray(data.playground));
// Exercise the actual slug resolver too: a valid shipped case must resolve,
// while an outdated title or unknown client must take the archive fallback.
{
 const slugStart=script.indexOf('const projectSlug=');
 const slugEnd=script.indexOf('\nconst casePath=',slugStart);
 const routeStart=script.indexOf('const caseRoute=()=>{');
 const routeEnd=script.indexOf('\nconst navigateCase=',routeStart);
 assert.ok(slugStart>=0&&slugEnd>slugStart&&routeStart>=0&&routeEnd>routeStart);
 const resolver=script.slice(slugStart,slugEnd)+'\n'+script.slice(routeStart,routeEnd)+'\ncaseRoute()';
 const resolve=pathname=>vm.runInNewContext(resolver,{
  location:{pathname},data,safeHash:()=> 'work'
 });
 assert.equal(resolve('/case-studies/hoylu/mobile-insights/'),'project/hoylu/1');
 assert.equal(resolve('/case-studies/hoylu/old-title/'),'work');
 assert.equal(resolve('/case-studies/unknown/mobile-insights/'),'work');
}
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
  for (const key of ['evidence', 'tradeoffs', 'archiveApproach']) {
    if (project[key] !== undefined) {
      assert.ok(typeof project[key] === 'string' && project[key].trim(), `${project.title}: invalid ${key}`);
    }
  }
}
// The Navigator case-study preview should expose the one documented feedback
// input and concrete prototyping work, without implying a formal study.
const renderHighlights = vm.runInNewContext(projectContent + '\n' + 'highlightMarkup', {
 esc: value => String(value)
});
const navigatorProject = projects.find(project => project.title === 'Navigator App');
assert.match(navigatorProject.evidence, /passenger feedback identified confusion/i);
assert.match(navigatorProject.evidence, /designed and prototyped booking and account flows/i);
// The process chapter must show the documented design artifacts and the
// implementation boundary, not imply that every prototype screen shipped.
assert.match(navigatorProject.process, /designed and prototyped booking and account flows/i);
assert.match(navigatorProject.process, /browsing through selection and confirmation/i);
assert.match(navigatorProject.process, /engineering handoff details/i);
assert.match(navigatorProject.process, /which prototype states shipped/i);
assert.doesNotMatch(navigatorProject.process, /usability tests (showed|proved)|increased bookings|improved conversion/i);

const navigatorHighlights = renderHighlights(navigatorProject);
assert.match(navigatorHighlights, /DOCUMENTED INPUT/);
assert.match(navigatorHighlights, /Passenger feedback identified confusion around connecting to ship Wi-Fi/);
assert.match(navigatorHighlights, /MY DESIGN WORK/);
assert.match(navigatorHighlights, /Prototyped booking and account flows; designed Wi-Fi guidance/);
assert.doesNotMatch(navigatorHighlights, /interviews|usability tests|measured improvement/i);
assert.match(caseStudy, /highlightMarkup\(p\)/, 'Case studies must render the editorial highlights');
assert.match(renderHighlights({title:'Mobile Insights'}), /Shipped product experience/, 'Mobile Insights must retain its shipped status');
// A shipped contribution is a delivery fact, not evidence that a desktop
// dashboard was ported, that every explored interaction shipped, or that
// engagement improved. Keep the archive teaser and outcome inside that scope.
const mobileInsights = projects.find(project => project.title === 'Mobile Insights');
// The archive teaser should open with the design tension, then state the
// verified UX/UI contribution and shipped status—not imply a tested flow.
assert.match(mobileInsights.summary, /\b(?:phone|small.screen|mobile)\b/i,
 'Mobile Insights archive teaser must name the small-screen constraint');
assert.match(mobileInsights.summary, /\b(?:dashboard|status|insights)\b/i,
 'Mobile Insights archive teaser must convey the information hierarchy problem');
assert.match(mobileInsights.summary, /\bshipped\b/i,
 'Mobile Insights archive teaser must state verified delivery');
assert.match(mobileInsights.summary, /\b(?:helped design|UX\/UI design|design contribution)\b/i,
 'Mobile Insights archive teaser must identify the actual design role');
assert.doesNotMatch(mobileInsights.summary, /desktop dashboard|users (needed|preferred)|research (showed|proved)/i);
assert.match(mobileInsights.outcome, /Mobile Insights shipped with my UX\/UI design contribution/i);
assert.match(mobileInsights.outcome, /production interaction states[\s\S]*engineering handoff details[\s\S]*usage metrics are not verified/i);
assert.doesNotMatch(mobileInsights.outcome, /increased adoption|improved engagement|validated in usability tests/i);

// The patient portal and stateroom TV covers must show what was actually
// designed, while separating design priorities from documented delivery.
const patientPortal = projects.find(project => project.title === 'Customizable Patient Portal');
const patientPortalHighlights = renderHighlights(patientPortal);
assert.match(patientPortal.evidence, /UX\/UI design to a customizable patient portal and practice-facing setup/i);
assert.match(patientPortalHighlights, /MY DESIGN WORK[\s\S]*patient portal and practice-facing customization/);
assert.match(patientPortalHighlights, /DESIGN TENSION[\s\S]*surgery information and next steps/);
assert.doesNotMatch(patientPortalHighlights, /tested|validated|adoption|shipped/i, 'Patient portal highlights must not imply verified outcomes');

const stateroomTV = projects.find(project => project.title === 'Stateroom TV App');
const stateroomHighlights = renderHighlights(stateroomTV);
assert.match(stateroomTV.evidence, /shipped in-stateroom TV app, including Voyage Tracker/i);
assert.match(stateroomHighlights, /SHIPPED CONTRIBUTION[\s\S]*Voyage Tracker/);
assert.match(stateroomHighlights, /DESIGN FOCUS[\s\S]*remote-first focus navigation/);
assert.doesNotMatch(stateroomHighlights, /interviews|usability tests|engagement|improved/i, 'Stateroom highlights must not imply unsupported research or impact');


// These two covers should expose specific design reasoning, not a generic
// project description. Keep the claims inside the documented process scope.
const connectedPlanning = projects.find(project => project.title === 'Connected Planning');
const connectedHighlights = renderHighlights(connectedPlanning);
assert.match(connectedPlanning.process, /project overview/i);
assert.match(connectedPlanning.process, /relationships between views/i);
assert.match(connectedHighlights, /THE CHALLENGE[\s\S]*related project information/);
assert.match(connectedHighlights, /DESIGN RATIONALE[\s\S]*planning overview[\s\S]*supporting details/);
assert.doesNotMatch(connectedHighlights, /tested|validated|measured|shipped/i);

const motionStorytelling = projects.find(project => project.title === 'Motion & Storytelling');
const motionHighlights = renderHighlights(motionStorytelling);
assert.match(motionStorytelling.process, /short visual beats/i);
assert.match(motionStorytelling.process, /pacing and legibility/i);
assert.match(motionHighlights, /THE CONSTRAINT[\s\S]*30 seconds/);
assert.match(motionHighlights, /STORYBOARD APPROACH[\s\S]*visual beats[\s\S]*legibility/);
assert.doesNotMatch(motionHighlights, /tested|validated|measured|shipped|completed animation/i);


// Case-study cover copy must describe documented format constraints and
// design reasoning, never claim measured campaign or clinical outcomes.
const campaignProject = projects.find(project => project.title === 'Campaigns & Events');
const campaignHighlights = renderHighlights(campaignProject);
assert.match(campaignProject.process, /65-inch and 40-inch displays/);
assert.match(campaignProject.tradeoffs, /booth wall[\s\S]*presentation/i);
assert.match(campaignHighlights, /DESIGN TRADEOFF[\s\S]*booth wall[\s\S]*presentations/);
assert.match(campaignHighlights, /MY DESIGN WORK[\s\S]*event signage[\s\S]*digital campaign/);
assert.doesNotMatch(campaignHighlights, /tested|validated|leads|conversion|improved/i);

const iolProject = projects.find(project => project.title === 'AI-Assisted IOL Planning');
const iolHighlights = renderHighlights(iolProject);
assert.match(iolProject.process, /measurements and scans[\s\S]*model-training or prediction workflow/);
assert.match(iolProject.evidence, /No approved research findings[\s\S]*deployment status/);
assert.match(iolHighlights, /INFORMATION PROVENANCE[\s\S]*patient measurements[\s\S]*model-generated predictions/);
assert.match(iolHighlights, /WORKFLOW RATIONALE[\s\S]*patient file[\s\S]*connected application/);
assert.doesNotMatch(iolHighlights, /tested|validated|shipped|clinically proven|improved/i);

// Archive excerpts may override a rhetorical opening, but must remain authored
// in content.js rather than being fabricated from a project's delivery label.
const archiveTeaserSource = script.match(/const processTeaser=p=>\{[\s\S]*?\n\};/)?.[0];
assert.ok(archiveTeaserSource, 'Archive teaser helper should be present');
const archiveTeaser = vm.runInNewContext(archiveTeaserSource + '\nprocessTeaser');
assert.equal(archiveTeaser({ archiveApproach: 'Focused on hierarchy.', process: 'Why? More context.' }), 'Focused on hierarchy.');
assert.equal(archiveTeaser({ process: 'Mapped the flow. Then iterated.' }), 'Mapped the flow.');
for (const title of ['Connected Planning', 'Mobile Insights']) {
  const project = projects.find(p => p.title === title);
  assert.ok(project?.archiveApproach, `${title}: use a reviewed action-oriented archive teaser`);
  assert.equal(archiveTeaser(project), project.archiveApproach);
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
assert.match(script, /archiveFactsMarkup\(evidence,factsId\)/, 'Project cards must render role/delivery facts with a unique description target');
assert.match(script, /projectCard\(project,index,company\.id,projectEvidence\[project\.title\]\)/, 'Professional cards must use reviewed evidence');
assert.match(script, /<dl id="'\+id\+'" class="project-card-facts">/, 'Role and delivery facts should use description-list semantics');
assert.match(workCss, /\.work \.project-card-facts\s*\{/, 'Archive facts must have an intentional layout');
assert.match(workCss, /\.work \.project-card-facts dd\s*\{/, 'Archive values must have readable styles');

// Static responsive guards: these do not prove browser layout or screen-reader behavior.
assert.match(navigationCss, /@media\(max-width:650px\)\{[\s\S]*?\.site-header\{\s*display:grid/, 'Production phone header must use the accessible two-row grid');
assert.match(navigationCss, /@media\(max-width:360px\)/, 'Narrow-phone header must have an explicit layout');
assert.match(caseCss, /@media\(max-width:760px\)\{[\s\S]*?\.case-view \.case-section-links\{\s*top:64px/, 'Tablet chapter index must retain its compact sticky offset');
assert.match(caseCss, /@media\(max-width:650px\)\{[\s\S]*?\.case-view \.case-section-links\{top:var\(--mobile-site-header-height,110px\)/, 'Phone chapter index must clear the two-row header');
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


// The old company chooser is no longer rendered by index.html or script.js.
// Do not reintroduce its superseded CSS into the active project-card system.
assert.doesNotMatch(css + homepageCss, /\.company-(?:grid|card|name|description)\b/,
 'Retired company chooser styles must not return');
assert.match(workCss, /\.project-card \.project-meta span:last-child\{display:inline-block/,
 'Active project metadata arrow belongs to work-cards.css');

// Retire selectors for unrendered h4 titles, project-title classes and a
// standalone featured-case-link. script.js renders h3 titles inside linked cards.
assert.doesNotMatch(workCss, /\.featured-case-link\b|\.project-title\b|\.project-card-link:hover h4\b/,
 'Dead project-card heading and link selectors must not return');
assert.doesNotMatch(foundationsCss, /\.project-card-link(?::hover|:focus-visible) h4\b/,
 'Shared heading motion must target rendered elements');
assert.doesNotMatch(workCss, /\.featured-project \.project-card-link\{height:100%\}|\.notebook-project-index \.featured-project \.project-card-link\{height:auto\}/,
 'The notebook index must not restore its superseded link height override');
assert.doesNotMatch(playgroundCss, /\.playground \.section-head h2\{display:block!important|\.playground \.section-head h2::after|\.playground \.section-head \.playground-title::(?:before|after)/,
 'Night heading must not accumulate obsolete generic and pseudo-element overrides');
// Shared card geometry has one owner; the homepage base keeps only grids and hero.
assert.doesNotMatch(homepageCss, /\.project-(?:card|visual|meta|card-link)\b/,
 'Shared card primitives must not return to homepage-base.css');
assert.match(workCss, /\.project-visual\{display:grid;place-items:center;overflow:hidden;position:relative;/,
 'Work component owns the shared card frame geometry');
assert.match(workCss, /\.project-visual img\{width:100%;height:100%;object-fit:cover;/,
 'Real project imagery must retain its cover crop');
assert.doesNotMatch(workCss, /@media\(max-width:420px\)\{\s*\.work \.project-card-facts/,
 'The 600px facts stack already covers 420px; avoid duplicate overrides');

// Archive presentation belongs to work-cards.css, not legacy overrides.
// These structural checks do not replace browser geometry/contrast checks.
assert.doesNotMatch(css, /\.featured-projects-grid\s*\{|\.notebook-project-index\s*\{|\.project-card-process\s*\{|\.project-card-cta\s*\{/,
 'Featured archive and process teaser rules must stay out of legacy CSS');
assert.match(workCss, /\.featured-projects-grid\{display:grid/, 'Work component must own archive grid');
// Project grids and archive spacing have named owners, not late legacy copies.
assert.ok(!css.includes('.projects-grid,.play-grid'), 'Legacy CSS must not redefine shared project columns');
assert.ok(homepageCss.includes('grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))'), 'Homepage base owns responsive project columns');
assert.ok(!css.includes('.work.wrap{padding-block:'), 'Legacy CSS must not redefine Work section spacing');
assert.ok(workCss.includes('.work.wrap{padding-block:clamp(42px,5vw,68px)}'), 'Work component owns desktop section spacing');
assert.doesNotMatch(css + workCss + homepageCss, /#collection\b|\.collection(?:\b|-nav\b|-back\b|-head\b)|\.close-collection\b/, 'Retired collection gallery must not retain CSS');
assert.match(workCss, /\.project-card \.project-card-process\{/, 'Work component must own design approach teaser');
assert.match(workCss, /:is\(\.work,\.playground\) \.project-card-link:focus-visible\{/, 'Shared Work/Playground keyboard focus ring must remain');
assert.doesNotMatch(workCss, /\.notebook-project-index \.project-card-link:focus-visible\{/, 'Do not restore the overridden notebook-only focus rule');
assert.match(html, /work-cards\.css\?v=[0-9]{8}-[a-z0-9-]+/, 'Archive CSS must have a cache-versioned stylesheet reference');

// Homepage interactions belong with the CTA and hero, not legacy overrides.
// In reduced motion, reveal-ready must never hide the Work/About sections.
assert.doesNotMatch(css, /(?:reveal-ready|reveal-enter|hero-enter|hero-parallax-y|html\[data-theme="dark"\] \.primary-link)/,
 'Legacy CSS must not own homepage entrance or dark CTA states');
assert.doesNotMatch(homepageCss, /html\[data-theme="dark"\] \.primary-link:hover\{background:/,
 'Homepage must not compete with editorial dark CTA tokens');
assert.match(homepageCss, /@media\(prefers-reduced-motion:no-preference\)\{[\s\S]*?\.reveal-ready\{animation:none;opacity:0/,
 'Homepage reveal must remain opt-in for motion');
assert.match(homepageCss, /\.reveal-ready\{opacity:1!important;transform:none!important;transition:none!important\}/,
 'Reduced-motion visitors must see revealed sections');
assert.doesNotMatch(homepageCss, /@keyframes reveal-enter/,
 'Superseded reveal-enter keyframes must not return');

// Typography and link styling have named owners, not a late global override.
assert.ok(!css.includes('.project-card p,.case-back,footer'), 'Legacy typography bundle must not return');
assert.ok(!css.includes('.hero-description,.case-intro,.section-head>p,.project-card p'), 'Legacy mixed text-color selector must not return');
assert.match(homepageCss, /\.hero h1 \{[^}]*line-height:1\.04;letter-spacing:-\.045em/, 'Homepage owns the hero headline rhythm');
assert.match(homepageCss, /\.primary-link \{[^}]*background:var\(--brand-navy\)/, 'Homepage owns the CTA background');
assert.match(navigationCss, /\.site-header nav a:hover\{color:color-mix/, 'Navigation owns link hover color');

// The old collection chooser is not rendered or routed. Retire its styling
// rather than carrying an untestable alternate gallery in the cascade.
assert.doesNotMatch(html + script + projectContent + caseStudy,
 /(?:id=["']collection["']|class=["'][^"']*\bcollection(?:-nav|-back|-head)?\b|querySelector\(["']#collection["']\))/, 
 'Retired collection navigation must not return to active markup or routing');
assert.match(workCss, /#work-title:focus\{outline:none!important;box-shadow:none!important\}/,
 'Programmatically focused Work heading stays undecorated; links retain visible focus');
// Keep the cache-busting contract without pinning an unrelated historical
// version string. This pass retires chrome already hidden by hero-polish.css.
assert.match(html, /\/styles\.css\?v=[a-zA-Z0-9-]+/,
 'Legacy CSS must remain cache-versioned');
assert.doesNotMatch(css + homepageCss,
 /\.(?:art-orbit|art-tile|art-center)(?:-[a-z]+)?(?:\s|\{|:)/,
 'Hidden hero ornament CSS must not return to active stylesheets');
assert.match(heroPolishCss, /\.hero \.art-orbit,\s*\.hero \.art-tile\s*\{display:none/,
 'Hero polish must continue hiding retired decorative elements');

// Keep interaction motion in its component, and preserve accessible fallbacks.
// These source checks guard ownership; Chromium tests still check behavior.
assert.doesNotMatch(css, /gallery-reveal|detail-reveal|--motion-ease/,
 'Legacy CSS must not reintroduce cross-component motion');
assert.ok(!css.includes('.play-grid .project-card-link:hover .project-visual'),
 'Playground preview motion must stay out of legacy CSS');
assert.ok(foundationsCss.includes('--motion-ease:cubic-bezier(.22,1,.36,1)'),
 'Foundations must own the shared motion token');
assert.ok(foundationsCss.includes('::view-transition-old(selected-company)'),
 'Foundations must retain the shared route transition');
assert.ok(caseCss.includes('@keyframes detail-reveal') && caseCss.includes('.case-view:not([hidden]) .case-head{animation:detail-reveal'),
 'Case-study must own its entrance animation');
assert.ok(playgroundCss.includes('.play-grid .project-card-link:hover .project-visual{transform:translateY(-5px)'),
 'Playground must own its preview hover');
assert.ok(caseCss.includes('.case-view .case-head,.case-view .case-hero-visual,.case-view .case-body,.case-view .case-gallery{animation:none!important}'),
 'Case-study reduced-motion override must remain');
assert.ok(playgroundCss.includes('.play-grid .project-card-link .project-visual{transition:none!important}'),
 'Playground reduced-motion override must remain');

// A light-theme notebook-paper rule must not cover the dark Playground intro.
// This is a source-order guard only, not a measured color-contrast test.
const genericPaperRule = stationeryCss.indexOf('html:not([data-theme="dark"]) .section-head>p');
const playgroundContrastRule = playgroundCss.indexOf('html:not([data-theme="dark"]) .playground .section-head>p');
assert.ok(genericPaperRule >= 0 && playgroundContrastRule >= 0,
 'Stationery paper heading and Playground night contrast rules must have component owners');
assert.doesNotMatch(css, /\.section-head\s*\{|\.section-head>p\s*\{/, 'Retired legacy stylesheet must not contain heading rules');
assert.doesNotMatch(playgroundCss, /\\n\/\* Beyond the Brief/, 'Escaped newline text must not invalidate Playground selectors');
assert.match(playgroundCss, /\.playground\.wrap \{[^}]*background:#171717;/, 'After Hours must have a stable neutral night surface');
assert.match(playgroundCss, /\.playground \.project-card \.project-card-process\{color:#e0e0e0;/, 'After Hours process text must be legible in both themes');
assert.match(playgroundCss.slice(playgroundContrastRule, playgroundContrastRule + 260),
 /background:transparent/, 'Playground intro must not inherit paper background');
assert.doesNotMatch(css, /\.playground\s+\.section-head>p/,
 'Playground paragraph rules must not return to legacy CSS');
assert.doesNotMatch(css + playgroundCss, /sparkle-button|night-sparkles|night-twinkle/,
 'Removed sparkle interaction must not retain unused CSS');
assert.doesNotMatch(caseStudy, /case-section-context/, 'Chapter navigation must not reintroduce the redundant project-title inset');
assert.match(caseStudy, /<nav class="case-section-links" aria-label="On this case study">/, 'Sticky chapter navigation must retain an accessible name');
// Visual briefs are editorial placeholders, not screenshots. Keep the gallery's
// accessible name truthful when no approved images have been supplied.
assert.match(caseStudy, /const galleryLabel=gallery\.length&&gallery\.every\(Boolean\)/, 'Gallery label must reflect whether actual images are present');
assert.match(caseStudy, /Visual briefs and image placeholders/, 'Placeholder-only galleries must not claim to be image galleries');
// When approved images arrive gradually, do not discard still-unfilled
// editorial brief slots or announce the mixed gallery as images-only.
assert.match(caseStudy, /const galleryCount=Math\.max\(gallery\.length,briefs\.length\)/, 'Gallery must retain unmatched visual briefs');
assert.match(caseStudy, /Array\.from\(\{length:galleryCount\}/, 'Gallery must render all image and brief slots');
assert.match(caseStudy, /briefs\.length<=gallery\.length\?"Project image gallery"/, 'An incomplete gallery must not be labeled images-only');

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
// Visible qualifiers must distinguish the limits of evidence from design
// judgment without implying that undocumented user research occurred.
assert.match(exampleNotes, /class="case-process-note-kicker">Evidence status<\/span>/, 'Evidence note must disclose its status');
assert.match(exampleNotes, /class="case-process-note-kicker">Design reasoning · not test evidence<\/span>/, 'Tradeoffs must not masquerade as tested findings');
assert.match(caseCss, /\.case-view \.case-process-note-kicker\{/, 'Evidence qualifier styling belongs to the case-study component');
assert.equal((exampleNotes.match(/class="case-process-note-kicker"/g)||[]).length,2, 'Both note kinds need visible qualifiers');
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

// Archive structure is owned by Work; the final editorial skin owns
// contrast and focus tokens in both themes. Do not duplicate assignments.
assert.match(editorialCss, /--archive-facts-edge:var\(--line\)/, 'Archive dividers need the final editorial ink token');
assert.match(editorialCss, /--archive-focus-edge:var\(--focus\)/, 'Archive focus needs the shared theme-aware focus token');
assert.doesNotMatch(workCss, /--archive-(?:surface|edge|shadow|facts-edge|focus-edge)\s*:/,
 'Work layout must not redeclare editorial card surface/focus tokens');
assert.match(workCss, /outline:2px solid var\(--archive-focus-edge\)/, 'Archive focus must consume the theme token');
// Placeholder color ownership: do not revive superseded per-client palettes.
assert.doesNotMatch(workCss, /--(?:archive-preview(?:-edge|-text)?|file-tint)\s*:/,
 'Work must not restore unused preview color tokens');
assert.match(workCss, /border:1px dashed var\(--line\)/,
 'Work must retain a dashed frame for unsupplied project imagery');
assert.match(editorialCss, /background:var\(--placeholder-surface\)!important/,
 'The editorial skin must own placeholder background color');
assert.match(editorialCss, /color:var\(--placeholder-text\)!important/,
 'The editorial skin must own placeholder ink');
assert.match(workCss, /text-wrap:balance/, 'Archive headings must balance across card widths');

// Pass 4: reading hierarchy, chapter state and mobile gallery contracts.
assert.match(caseCss, /text-wrap:balance/, 'Case-study cover titles should balance');
assert.match(caseCss, /max-width:74ch/, 'Long-form reading measure should be constrained');
assert.match(caseCss, /\.case-view \.case-section-links button\[aria-current="location"\]/, 'Active chapter needs a visible tab state');
assert.match(caseCss, /\.case-view \.case-evidence-item\{[^}]*border-radius:0/, 'Evidence cards should retain the editorial paper shape');
assert.match(caseCss, /\.case-view \.case-gallery\{grid-template-columns:minmax\(0,1fr\)\}/, 'Phone galleries should stack in one column');

// A case-study observer must not follow hidden headings after a route exit.
// The next case render still creates a fresh observer for its own chapters.
assert.match(script, /if\(window\.caseSectionObserver\)\{window\.caseSectionObserver\.disconnect\(\);window\.caseSectionObserver=null;\}/, 'Leaving a case study must release its chapter observer');
assert.match(caseStudy, /window\.caseSectionObserver=new IntersectionObserver\(/, 'Opening a case study must reattach chapter tracking');

// Pass 11: keep chapter navigation target lookup centralized.
assert.ok(caseStudy.includes('const caseJumpTargets=new Map('), 'Case study must cache chapter targets per render');
assert.ok(caseStudy.includes('const heading=caseJumpTargets.get(button.dataset.caseJump)'), 'Chapter click handlers must reuse cached targets');
assert.ok(caseStudy.includes('const caseJumpHeadings=[...caseJumpTargets.values()]'), 'Reading-progress tracking must reuse chapter targets');
assert.ok(!caseStudy.includes('const heading=document.getElementById(button.dataset.caseJump)'), 'Avoid duplicate chapter DOM lookups');

// Archive surface is applied last by the editorial skin, with opaque
// light/dark colors; Work only owns the preview and card geometry.
assert.match(editorialCss, /--editorial-card:#f7f6f3/, 'Light archive surface needs an opaque token');
assert.match(editorialCss, /--editorial-card:#252525/, 'Dark archive surface needs an opaque token');
assert.match(editorialCss, /background-color:var\(--editorial-card\)!important/, 'Archive card must paint an opaque base');
assert.match(editorialCss, /border:1px solid var\(--editorial-card-edge\)!important/, 'Archive card edge belongs to editorial skin');
assert.doesNotMatch(workCss, /border:1px solid var\(--archive-edge\)!important/, 'Retired archive border must not return');
assert.match(workCss, /color:var\(--file-cta-ink,var\(--file-accent\)\)/, 'Archive CTA must use a shared theme color');

// Pass 9: hero hierarchy and archive title token contracts.
assert.ok(heroPolishCss.includes('max-width:54ch;text-wrap:pretty;line-height:1.6'), 'Desktop hero copy must retain a readable measure');
assert.ok(workCss.includes('font-size:clamp(var(--type-h3),2.6vw,2.375rem)'), 'Archive headings must reference the shared type scale');

// Pass 8: mobile rhythm, portrait prominence, and single-row navigation.
// Test the *current* phone design contract, not obsolete pre-portrait spacing.
// A single media block makes subsequent visual tuning less error-prone.
assert.equal((heroPolishCss.match(/@media\(max-width:600px\)/g)||[]).length,1, 'Phone hero rules should have one owner');
const phoneHeroCss = heroPolishCss.slice(heroPolishCss.indexOf('@media(max-width:600px)'));
assert.match(phoneHeroCss, /\.hero\.wrap\{[^}]*min-height:0;[^}]*padding-bottom:clamp\(/, 'Phone hero must not reserve a viewport of empty space');
assert.match(phoneHeroCss, /\.hero \.hero-copy\{display:contents\}/, 'Phone layout must keep the portrait in the editorial flow');
for (const [selector,order] of [['h1',3],['feature',2],['description',5],['actions',6]]) {
 const rule = selector==='h1' ? '\\.hero \\.hero-copy>h1' : '\\.hero \\.hero-'+selector;
 assert.match(phoneHeroCss,new RegExp(rule+'\\{[^}]*order:'+order+';'), 'Phone hero order must preserve '+selector);
}
assert.match(phoneHeroCss, /\.hero \.hero-copy>\.eyebrow\{[^}]*text-wrap:balance/, 'Phone discipline line should wrap intentionally');
assert.match(phoneHeroCss, /\.hero \.hero-feature\{[^}]*background:transparent!important/, 'Portrait should not inherit the busy featured-card surface');
assert.match(phoneHeroCss, /\.hero \.notebook-hero-note\{display:none!important\}/, 'Phone intro should not repeat its message');
assert.match(phoneHeroCss, /\.hero \.hero-actions \.quiet-link,\.hero \.hero-foot\{display:none!important\}/, 'Phone hero should have one primary action');
assert.match(phoneHeroCss, /\.hero \.hero-actions \.primary-link\{[^}]*min-height:48px/, 'Primary action needs a touch-friendly height');
const phoneHeroMeasure = phoneHeroCss.match(/\.hero \.hero-description\{[^}]*max-width:(\d+)ch/);
assert.ok(phoneHeroMeasure && Number(phoneHeroMeasure[1])>=30 && Number(phoneHeroMeasure[1])<=42,
 'Phone body copy needs a readable measure without pinning one editorial value');
// Maintain the phone's editorial negative space without repeating the previous
// edge-to-edge pink action. Geometry is checked separately in Chromium.
assert.match(phoneHeroCss, /\.hero \.hero-copy>h1\{[^}]*line-height:1\.12/,
 'Phone headline needs open line spacing');
assert.match(phoneHeroCss, /\.hero \.hero-feature\{[^}]*margin:0 0 18px/,
 'Illustration needs breathing room before the headline');
assert.match(phoneHeroCss, /\.hero \.hero-actions\{[^}]*margin-top:26px/,
 'Mobile CTA needs a distinct gap after the introduction');
assert.match(phoneHeroCss, /\.hero \.hero-actions \.primary-link\{[^}]*width:auto;min-width:min\(100%,238px\)/,
 'Phone CTA should remain content-sized, not a full-width color bar');
assert.match(html, /hero-polish\.css\?v=[a-zA-Z0-9-]+/,
 'Homepage must load the updated hero stylesheet');

assert.match(workCss,/\.work\.wrap\{[^}]*padding-bottom:clamp\(28px,7vw,44px\)/, 'Mobile work section needs a compact handoff');
assert.ok(navigationCss.includes('gap:clamp(8px,2.4vw,18px)'), 'Phone navigation spacing should remain intentional');
assert.match(navigationCss, /grid-template-rows:44px 44px/, 'Phone header must use two rows');
assert.match(navigationCss, /grid-row:1\/3/, 'Logo must span the two rows');
assert.match(navigationCss, /--mobile-site-header-height:110px/, 'Phone header height must be shared');
assert.match(caseCss, /top:var\(--mobile-site-header-height,110px\)/, 'Case chapter strip must clear the phone header');
assert.ok(navigationCss.includes('min-height:44px;padding:0 1px'), 'Phone navigation links must retain 44px hit height');

// Pass 7: routed metadata and mobile chapter navigation contracts.
for (const key of ['og:title','og:description','og:url','twitter:title','twitter:description']) {
 assert.ok(caseStudy.includes('setMeta(\'meta[' + (key.startsWith('og:') ? 'property' : 'name') + '="' + key + '"]\''), 'Case-study routing must update ' + key);
}
assert.match(caseStudy, /if\(active\.getAttribute\("aria-current"\)==="location"\)\{\s*if\(reveal\)revealCurrentCaseTab\(active\);/, 'Observer updates must not hijack manually scrolled tabs');
assert.match(caseStudy, /setCurrentCaseSection\(heading\.id,\{reveal:true\}\)/, 'Explicit chapter jumps must reveal their tab');
assert.match(caseStudy, /revealCurrentCaseTab\(active\);/, 'Chapter navigation must reveal active tabs');
// Exercise the real chapter-state helper, not just its source shape: passive
// reading-progress updates must not drag the horizontally browsed tab strip.
const sectionStateStart = caseStudy.indexOf('function setCurrentCaseSection(');
const sectionStateEnd = caseStudy.indexOf('\ncaseJumpButtons.forEach(button=>{', sectionStateStart);
assert.ok(sectionStateStart >= 0 && sectionStateEnd > sectionStateStart, 'Chapter state helper must be present');
const sectionStateSource = caseStudy.slice(sectionStateStart, sectionStateEnd);
const makeChapterButton = id => ({
 dataset: {caseJump: id},
 attributes: {},
 getAttribute(name) { return this.attributes[name] ?? null; },
 setAttribute(name, value) { this.attributes[name] = value; },
 removeAttribute(name) { delete this.attributes[name]; }
});
const firstChapterButton = makeChapterButton('chapter-one');
const secondChapterButton = makeChapterButton('chapter-two');
let chapterReveals = 0;
const setCurrentChapter = new Function('caseJumpButtons', 'revealCurrentCaseTab',
 sectionStateSource + '\nreturn setCurrentCaseSection;')(
 [firstChapterButton, secondChapterButton], () => { chapterReveals++; }
);
setCurrentChapter('chapter-one');
setCurrentChapter('chapter-two');
assert.equal(chapterReveals, 0, 'Observer chapter changes must not scroll the mobile tab strip');
assert.equal(secondChapterButton.getAttribute('aria-current'), 'location', 'Observer still updates the active chapter');
setCurrentChapter('chapter-two', {reveal:true});
assert.equal(chapterReveals, 1, 'Explicit selection must reveal an already-active chapter');
setCurrentChapter('chapter-one', {reveal:true});
assert.equal(chapterReveals, 2, 'Explicit selection must reveal a newly active chapter');
assert.equal(secondChapterButton.getAttribute('aria-current'), null, 'Only one chapter may be current');


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
/* Notebook texture is owned by stationery.css. The legacy ruled-paper layer
   was always overwritten by the later dot-grid rule, so keep it retired. */
assert.doesNotMatch(css, /--notebook-(?:dot-(?:color|step|radius)|paper|pink|rule|margin-offset|margin-opacity)\s*:/,
 'Legacy stylesheet must not redefine stationery surface tokens');
assert.doesNotMatch(css, /repeating-linear-gradient\(to bottom,transparent 0,transparent 31px/,
 'Retired ruled-paper background must not return');
assert.match(stationeryCss, /html:not\(\[data-theme="dark"\]\) body\{[\s\S]*?background-image:radial-gradient/,
 'Stationery component must own light dot-grid surface');
assert.match(stationeryCss, /html\[data-theme="dark"\] body\{[\s\S]*?background-image:radial-gradient/,
 'Stationery component must retain dark dot-grid surface');

// Pass 15: footer must paint a solid themed surface, not expose notebook dots.
assert.ok(navigationCss.includes('background:var(--site-chrome-bg);'), 'Footer must reset inherited background layers');
assert.match(navigationCss, /html\[data-theme="dark"\]\s*\{[^}]*--site-chrome-bg\s*:/, 'Navigation component must supply a dedicated dark chrome surface');
assert.doesNotMatch(css, /--site-chrome-bg\s*:/, 'Chrome surface tokens must not be duplicated in legacy CSS');

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



// Uploaded illustrative artwork must not silently read as shipped UI.
// Exercise the shared classifier, then guard both render paths and its visible style.
const provenanceFor = brief => vm.runInNewContext(projectContent + '\nillustrativeImageStatus(' + JSON.stringify(brief) + ')');
assert.match(provenanceFor('ILLUSTRATIVE / Proposed flow'), /ILLUSTRATIVE VISUAL · NOT A PRODUCT SCREENSHOT/);
assert.equal(provenanceFor('APPROVED / Actual shipped screen'), '');
assert.ok(script.includes('illustrativeImageStatus(p.imageBrief)'), 'Archive/gallery images must retain illustrative status');
assert.ok(caseStudy.includes('illustrativeImageStatus(p.imageBrief)'), 'Case-study hero images must retain illustrative status');
assert.match(caseCss, /\.case-hero-visual > \.visual-image-status/, 'Illustrative hero label must have visible styling');
assert.match(caseCss, /--case-hero-placeholder-bg:/, 'Case-study component owns no-image hero surface tokens');
assert.match(caseCss, /html\[data-theme="dark"\] \.case-view \.case-hero-visual:not\(:has\(img\)\)/, 'Dark case hero needs its own placeholder surface');
assert.doesNotMatch(css, /\.case-hero-visual:not\(:has\(img\)\)/, 'Legacy CSS must not own case hero placeholders');
assert.doesNotMatch(css, /\.case-process-note\s*\{/, 'Case-study process notes must be component-owned');


// Archive skin selector ownership: the client folder and notebook index
// share identical surfaces in both themes. Preserve the two branches inside
// :is() without reintroducing redundant dark-only specificity.
assert.match(editorialCss, /\.work :is\(\.featured-project\.client-file,\.notebook-project-index \.featured-project\)\{/,
 'Archive skin must use one shared selector for both card types');
assert.match(editorialCss, /\.work :is\(\.featured-project\.client-file,\.notebook-project-index \.featured-project\)::after\{/,
 'Archive gloss must use the same shared card selector');
assert.doesNotMatch(editorialCss, /html\[data-theme="dark"\] \.work \.featured-project\.client-file\{/,
 'Do not restore a redundant dark-only archive surface override');
assert.match(workCss, /\.client-file \.client-file-label\{[\s\S]*?background:var\(--file-accent\)/,
 'Work card component must own the client tab background');

// Editorial owns action hover colors for both themes; homepage must not
// reintroduce a higher-specificity dark override of these shared tokens.
assert.match(editorialCss, /--editorial-action-ink:#fff;/, 'Light editorial actions need white hover ink');
assert.match(editorialCss, /--editorial-accent:#a6d9ff;--editorial-action-ink:#111;/, 'Dark editorial actions need near-black hover ink');
assert.match(editorialCss, /\.primary-link:is\(:hover,:focus-visible\),\.header-contact:is\(:hover,:focus-visible\)\{/,
 'One editorial hover rule must serve both themes');
assert.doesNotMatch(editorialCss, /html\[data-theme="dark"\] \.primary-link:is\(:hover,:focus-visible\)/,
 'Do not restore duplicate dark-only CTA hover rules');
assert.match(editorialCss, /\.about \.about-copy>\.text-link:is\(:hover,:focus-visible\)\{[^}]*color:var\(--editorial-action-ink\)/, 'About CTA must use shared action ink');
assert.doesNotMatch(editorialCss, /color:#fff!important;|background:#a6d9ff!important;color:#111!important/, 'No duplicate literal action colors');
// Theme token ownership: later editorial declarations must not mask component edits.
assert.doesNotMatch(editorialCss, /--(?:site-chrome-bg|site-chrome-edge|notebook-paper|notebook-dot-color)\s*:/, 'Editorial skin must not duplicate navigation/stationery tokens');
assert.match(stationeryCss, /--notebook-paper:var\(--paper\)/, 'Notebook surface follows the active paper theme');
assert.match(stationeryCss, /html\[data-theme="dark"\]\{--notebook-dot-color:rgba\(245,245,245,\.14\)\}/, 'Dark notebook dots retain intended contrast');
assert.match(navigationCss, /--site-chrome-edge:var\(--line\)/, 'Opaque chrome separator belongs to navigation');
assert.doesNotMatch(editorialCss, /:is\(\.featured-project,\.project-card,\.play-grid > \*\):is\(:hover,:focus-within\) img/, 'Full-color project imagery must not need duplicate hover overrides');
assert.doesNotMatch(editorialCss, /\.visual-placeholder|--archive-(?:surface|ink|muted):/, 'Retired archive aliases and unused tokens must not return');
assert.doesNotMatch(editorialCss, /\.notebook-project-index \.featured-project\{/, 'Archive surface must have only one authoritative editorial rule');
assert.doesNotMatch(editorialCss, /\.project-visual img,\.project-card img,\.play-grid img,\.case-gallery img/, 'Do not restore redundant full-color image filter resets');
assert.match(editorialCss, /\.project-card img\{transition:transform \.45s ease\}/, 'Shared project images retain their transition');
assert.doesNotMatch(editorialCss, /\.work :is\(\.featured-project\.client-file,\.notebook-project-index \.featured-project\) :is\(/,
 'No blanket archive descendant ink override may erase client CTA/tab colors');
assert.match(workCss, /\.work \.project-card :is\(h3,p,\.project-meta\)\{color:var\(--ink\)\}/,
 'Work component owns readable text without recoloring nested labels');
assert.match(workCss, /--file-label-ink:#000000;/, 'Tab label ink must contrast with dark monochrome blue');
assert.match(workCss, /--file-cta-ink:color-mix\(in srgb,var\(--file-accent\) 35%,var\(--ink\)\)/,
 'Archive CTAs must not use pale raw accent ink on light paper');
assert.doesNotMatch(editorialCss, /\.site-header,footer\.wrap\{background:/,
 'Navigation owns opaque header and footer, including forced-colors behavior');

console.log(`PASS: ${data.companies.length} companies, ${projects.length} projects, navigation targets, JS syntax and component contracts`);
