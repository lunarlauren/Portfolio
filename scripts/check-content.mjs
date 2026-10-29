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
const aboutCss = read('../public/components/about.css');
const stationeryCss = read('../public/components/stationery.css');
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
const stylesheetOrder = ['styles.css', 'hero-polish.css', 'stationery.css', 'navigation.css', 'case-study.css'];
let previousPosition = -1;
for (const name of stylesheetOrder) {
 const match = html.indexOf('/' + (name === 'styles.css' ? name : 'components/' + name));
 assert.ok(match > previousPosition, name + ' must load after the preceding stylesheet');
 previousPosition = match;
}
assert.doesNotMatch(css, /\/\* Problem-solving hero: shared layout in both themes/, 'Extracted hero polish must not return to legacy CSS');
assert.match(heroPolishCss, /\.hero \.hero-copy h1\{/, 'Hero typography must remain in its component');
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
// Preserve the genuine photo, biography, and separate interactive inventory.
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
assert.match(html, /class="creative-inventory" aria-labelledby="inventory-title"/,
 'About inventory must retain its accessible title and interaction');

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
assert.match(mobileInsights.summary, /^On a small screen, [^.]+\./i);
assert.match(mobileInsights.summary, /project-status summaries[\s\S]*supporting context/i);
assert.match(mobileInsights.summary, /contributed UX\/UI design[\s\S]*shipped Mobile Insights experience/i);
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

// A case-study observer must not follow hidden headings after a route exit.
// The next case render still creates a fresh observer for its own chapters.
assert.match(script, /if\(window\.caseSectionObserver\)\{window\.caseSectionObserver\.disconnect\(\);window\.caseSectionObserver=null;\}/, 'Leaving a case study must release its chapter observer');
assert.match(caseStudy, /window\.caseSectionObserver=new IntersectionObserver\(/, 'Opening a case study must reattach chapter tracking');

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
assert.match(phoneHeroCss, /\.hero \.hero-description\{[^}]*max-width:34ch/, 'Phone body copy needs a readable measure');
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
assert.match(html, /hero-polish\.css\?v=20261029-portrait-first/,
 'Homepage must load the updated hero stylesheet');

assert.ok(workCss.includes('.work.wrap{padding-bottom:clamp(28px,7vw,44px)}'), 'Mobile work section needs a compact handoff');
assert.ok(navigationCss.includes('gap:clamp(7px,2.2vw,13px)'), 'Phone navigation spacing should remain intentional');
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



// Uploaded illustrative artwork must not silently read as shipped UI.
// Exercise the shared classifier, then guard both render paths and its visible style.
const provenanceFor = brief => vm.runInNewContext(projectContent + '\nillustrativeImageStatus(' + JSON.stringify(brief) + ')');
assert.match(provenanceFor('ILLUSTRATIVE / Proposed flow'), /ILLUSTRATIVE VISUAL · NOT A PRODUCT SCREENSHOT/);
assert.equal(provenanceFor('APPROVED / Actual shipped screen'), '');
assert.ok(script.includes('illustrativeImageStatus(p.imageBrief)'), 'Archive/gallery images must retain illustrative status');
assert.ok(caseStudy.includes('illustrativeImageStatus(p.imageBrief)'), 'Case-study hero images must retain illustrative status');
assert.match(caseCss, /\.case-hero-visual > \.visual-image-status/, 'Illustrative hero label must have visible styling');

console.log(`PASS: ${data.companies.length} companies, ${projects.length} projects, navigation targets, JS syntax and component contracts`);
