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
const workCss = read('../public/components/work-cards.css');
const stationeryCss = read('../public/components/stationery.css');
new vm.Script(caseStudy, { filename: 'public/components/case-study.js' });
new vm.Script(projectContent, { filename: 'public/components/project-content.js' });
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
  // A published outcome must never quietly include fictional impact-writing samples.
  // Keep those examples in docs/ILLUSTRATIVE_IMPACT_EXAMPLES.md until verified.
  assert.doesNotMatch(project.outcome, /DEMO RESULT|FICTIONAL|hypothetical (?:usability|prototype|study)|imagined concept test/i,
    `${project.title}: invented impact examples must not appear in published outcomes`);
  if (project.gallery) assert.ok(Array.isArray(project.gallery), `${project.title}: gallery must be an array`);
  if (project.galleryBriefs) assert.ok(Array.isArray(project.galleryBriefs), `${project.title}: galleryBriefs must be an array`);
  for (const key of ['evidence', 'tradeoffs']) {
    if (project[key] !== undefined) {
      assert.ok(typeof project[key] === 'string' && project[key].trim(), `${project.title}: invalid ${key}`);
    }
  }
}
// Case-study reading contract: make the intended audience and the real
// design constraints visible without inventing discovery or validation.
const professionalProjects = data.companies.flatMap(company => company.projects);
for (const project of professionalProjects) {
  for (const key of ['audience', 'constraints']) {
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
// Connected Planning: describe the design tension without upgrading rationale to research findings.
const connectedPlanning = data.companies.find(company => company.id === 'hoylu')?.projects.find(project => project.title === 'Connected Planning');
assert.ok(connectedPlanning, 'Missing Hoylu Connected Planning case study');
assert.match(connectedPlanning.evidence, /do not establish a specific research method/i, 'Connected Planning must distinguish confirmed contribution from undocumented research');
assert.match(connectedPlanning.tradeoffs, /breadth versus detail/i, 'Connected Planning must explain its UX design tension');
assert.match(connectedPlanning.outcome, /not independently verified/i, 'Connected Planning must not imply unverified delivery or impact');


// Campaigns & Events: show visual-design decisions without inventing marketing impact.
const campaigns = data.companies.find(company => company.id === 'hoylu')?.projects.find(project => project.title === 'Campaigns & Events');
assert.ok(campaigns, 'Missing Hoylu Campaigns & Events case study');
assert.match(campaigns.process, /65-inch and 40-inch displays/i, 'Campaigns must retain actual display-format constraints');
assert.match(campaigns.evidence, /do not establish formal audience research/i, 'Campaigns must separate documented scope from unverified research');
assert.match(campaigns.tradeoffs, /distance versus detail/i, 'Campaigns must explain its visual-design tradeoff');
assert.match(campaigns.outcome, /have not been quantified here/i, 'Campaigns must not imply measured marketing results');

// Motion & Storytelling: a documented storyboard is not evidence of a finished animation.
const motion = data.companies.find(company => company.id === 'hoylu')?.projects.find(project => project.title === 'Motion & Storytelling');
assert.ok(motion, 'Missing Hoylu Motion & Storytelling case study');
assert.match(motion.details, /approximately 30-second product explainer/i, 'Motion must preserve the documented storyboard runtime');
assert.match(motion.details, /my role here was visual storytelling and motion-design planning/i, 'Motion must identify the designer\'s actual scope');
assert.match(motion.evidence, /final animation delivery.*have not been supplied/i, 'Motion must not imply an undocumented finished video');
assert.match(motion.tradeoffs, /clarity versus coverage/i, 'Motion must explain the storytelling tradeoff');
assert.match(motion.outcome, /have not been verified/i, 'Motion must distinguish the storyboard from unverified outcomes');

const mobile = data.companies.find(company => company.id === 'hoylu')?.projects.find(project => project.title === 'Mobile Insights');
assert.ok(mobile, 'Missing Hoylu Mobile Insights case study');
assert.match(mobile.outcome, /shipped/i, 'Mobile Insights was confirmed shipped');
assert.doesNotMatch(mobile.outcome, /mobile ux concepts/i, 'Do not describe Mobile Insights as concept-only');
assert.match(script, /"Mobile Insights":\["Hoylu · Construction software","Mobile UX and visual design","Shipped product contribution"\]/);
assert.match(mobile.evidence, /shipped Mobile Insights experience/i, 'Evidence must retain shipped status');
assert.match(mobile.evidence, /not been provided/i, 'Do not imply undocumented research or metrics');
assert.match(mobile.tradeoffs, /design tension/i, 'Describe the UX tradeoff without inventing testing');
assert.match(mobile.details, /My role was UX\/UI design/i, 'Mobile Insights must name the designer\'s actual role');
assert.match(mobile.details, /project managers.*away from a desktop/i, 'Mobile Insights must make the audience scenario clear');
assert.match(mobile.details, /design framing, not a claim of documented user research/i, 'Audience framing must not masquerade as research');
assert.match(mobile.evidence, /implementation handoff details, collaboration records/i, 'Do not invent Mobile Insights implementation or collaboration specifics');
assert.match(mobile.imageBrief, /ILLUSTRATIVE \/.*not a screenshot of shipped screens/i, 'Mobile Insights mockup must not impersonate shipped UI');
assert.ok(mobile.galleryBriefs.every(brief => brief.startsWith('ILLUSTRATIVE /')), 'Mobile Insights gallery briefs must be labeled illustrative');
assert.match(mobile.galleryBriefs[0], /project manager/i, 'Illustrative mobile flow must use the same audience scenario as the case study');
assert.match(mobile.galleryBriefs[1], /not a record of verified iteration rounds/i, 'Illustrative wireframes must not imply documented iterations');
assert.match(caseStudy, /processNotesMarkup\(p\)/, 'Case study must render evidence and tradeoff notes');
assert.match(script, /Design approach/, 'Project previews must expose design rationale');
const patientPortal = data.companies.find(company => company.id === 'alcon')?.projects.find(project => project.title === 'Customizable Patient Portal');
assert.ok(patientPortal, 'Missing Alcon patient portal case study');
assert.match(patientPortal.evidence, /not been supplied/i, 'Patient portal must not imply undocumented research or metrics');
assert.match(patientPortal.tradeoffs, /flexibility for individual practices/i, 'Patient portal must explain its documented UX design tension');
assert.match(projectContent, /Evidence & boundaries/, 'Case studies must label the evidence boundary');
assert.match(projectContent, /Design tension & rationale/, 'Case studies must distinguish rationale from tested results');
// Clinical AI case study: distinguish documented UX scope from clinical validation.
const iolPlanning = data.companies.find(company => company.id === 'alcon')?.projects.find(project => project.title === 'AI-Assisted IOL Planning');
assert.ok(iolPlanning, 'Missing Alcon IOL planning case study');
assert.match(iolPlanning.details, /patient measurements and scans/i, 'IOL planning must preserve documented clinical context');
assert.match(iolPlanning.process, /design consideration, not a claim/i, 'IOL planning must not present rationale as validated implementation');
assert.match(iolPlanning.evidence, /No approved research findings.*safety validation.*deployment status/i, 'IOL planning must identify missing research, validation, and delivery evidence');
assert.match(iolPlanning.tradeoffs, /UX tension/i, 'IOL planning must articulate its information-design tradeoff');
assert.match(iolPlanning.outcome, /has not been verified for publication/i, 'IOL planning must not imply shipped clinical results');

const navigator = data.companies.find(company => company.id === 'holland-america')?.projects.find(project => project.title === 'Navigator App');
assert.ok(navigator, 'Missing Holland America Navigator case study');
assert.match(navigator.outcome, /shipped app/i, 'Navigator must retain its shipped status');
assert.match(navigator.evidence, /passenger feedback/i, 'Navigator should identify its documented feedback source');
assert.match(navigator.evidence, /not documented here/i, 'Navigator must distinguish feedback from unverified validation or impact');
assert.match(navigator.tradeoffs, /tradeoff/i, 'Navigator should explain the mobile UX rationale');
const stateroom = data.companies.find(company => company.id === 'holland-america')?.projects.find(project => project.title === 'Stateroom TV App');
assert.ok(stateroom, 'Missing Holland America stateroom TV case study');
assert.match(stateroom.details, /remote rather than a mouse or touchscreen/i, 'Stateroom context must explain directional input constraints');
assert.match(stateroom.evidence, /shipped in-stateroom TV app/i, 'Stateroom contribution must retain shipped status');
assert.match(stateroom.evidence, /have not been supplied/i, 'Stateroom must not imply undocumented research or metrics');
assert.match(stateroom.tradeoffs, /design tension/i, 'Stateroom must describe a UX tradeoff');
assert.match(stateroom.outcome, /not verified for publication/i, 'Stateroom must distinguish delivery from unverified impact');


// Independent product work: distinguish hands-on prototype iteration from formal user validation.
const forktactics = data.playground.find(project => project.title === 'Forktactics');
assert.ok(forktactics, 'Missing Forktactics case study');
assert.match(forktactics.evidence, /independent, AI-assisted working prototype/i, 'Forktactics must identify its prototype status');
assert.match(forktactics.evidence, /No recruited user interviews, formal usability study/i, 'Forktactics must not imply formal user research');
assert.match(forktactics.tradeoffs, /automation versus control/i, 'Forktactics must explain the planning UX tradeoff');
assert.match(forktactics.outcome, /not been independently validated/i, 'Forktactics must not imply verified savings or usability impact');


// Unofficial game work: concept briefs and future image prompts are not shipped features.
const falloutConcept = data.playground.find(project => project.title === "Fallout 76 ;  What I'd Design");
assert.ok(falloutConcept, 'Missing Fallout fan-concept case study');
assert.match(falloutConcept.details, /independent concept direction and visual planning/i, 'Fallout must identify the designer\'s role');
assert.match(falloutConcept.process, /concept briefs, not documented prototypes/i, 'Fallout must distinguish exploration from validated iterations');
assert.match(falloutConcept.evidence, /do not establish completed concept illustrations/i, 'Fallout must not treat image briefs as completed artwork');
assert.match(falloutConcept.tradeoffs, /different design tension/i, 'Fallout must explain its design rationale');
assert.match(falloutConcept.outcome, /not shipped game features/i, 'Fallout must remain explicitly unshipped');
assert.match(script, /Speculative proposals · not shipped/, 'Case-study overview must expose Fallout delivery status');

// Personal illustration: process plans must not masquerade as documented artwork or testing.
const illustration = data.playground.find(project => project.title === 'Illustration & Experiments');
assert.ok(illustration, 'Missing independent illustration case study');
assert.match(illustration.details, /independent creative direction and illustration/i, 'Illustration must identify the actual role');
assert.match(illustration.process, /presentation plan here, not a claim/i, 'Illustration must distinguish future process visuals from recorded iterations');
assert.match(illustration.evidence, /future image briefs, not completed deliverables/i, 'Illustration must not imply that planned art exists');
assert.match(illustration.tradeoffs, /expression versus clarity/i, 'Illustration must explain its visual design tension');
assert.match(illustration.outcome, /does not claim a completed illustrated series/i, 'Illustration must not imply undocumented outcomes');
assert.ok(illustration.galleryBriefs.every(brief => brief.startsWith('PLANNED /')), 'Illustration gallery placeholders must be labeled as planned');
assert.match(script, /"Illustration & Experiments":\["Independent · Personal creative practice"/, 'Illustration overview must disclose independent status');
assert.match(projectContent, /"Fallout 76 ;  What I'd Design":\[\["THE IDEA"/, 'Fallout highlight key must match the case-study title');



// Archive labels reuse the same reviewed role/delivery source as case-study
// overviews. An unlabeled project would make its status harder to assess.
assert.match(script, /archiveFactsMarkup\(evidence\)/, 'Project cards must render role/delivery facts');
assert.match(script, /projectCard\(project,index,company\.id,projectEvidence\[project\.title\]\)/, 'Professional cards must use reviewed evidence');
assert.match(script, /<dl class="project-card-facts">/, 'Role and delivery facts should use description-list semantics');
for (const project of data.companies.flatMap(company => company.projects)) {
  assert.ok(script.includes(JSON.stringify(project.title) + ':['), `${project.title}: missing shared evidence label`);
}
assert.match(workCss, /\.work \.project-card-facts\s*\{/, 'Archive facts must have an intentional layout');
assert.match(workCss, /\.work \.project-card-facts dd\s*\{/, 'Archive values must have readable styles');
assert.match(script, /"Mobile Insights":\["Hoylu · Construction software","Mobile UX and visual design","Shipped product contribution"\]/, 'Mobile Insights must be labeled shipped on archive and detail pages');

// Static responsive guards: these do not prove browser layout or screen-reader behavior.
assert.match(navigationCss, /@media\(max-width:600px\)\{\s*\.site-header\{\s*display:flex/, 'Production mobile header must remain one row');
assert.match(navigationCss, /@media\(max-width:360px\)/, 'Narrow-phone header must have an explicit layout');
assert.match(caseCss, /@media\(max-width:420px\)\{\s*\.case-view \.case-section-links\{top:64px/, 'Phone chapter index must clear the production one-row header');
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

// Editorial integrity: speculative artwork is not an artifact of delivery,
// a documented iteration, or a screenshot. This includes visual-design work,
// where a polished mockup can otherwise look like an event photograph.
// Shipped Navigator and Stateroom TV request approved real screens instead.
const illustrativeProjects = [
  'Connected Planning',
  'Mobile Insights',
  'Campaigns & Events',
  'Motion & Storytelling',
  'Customizable Patient Portal',
  'AI-Assisted IOL Planning'
];
for (const title of illustrativeProjects) {
  const project = professionalProjects.find(item => item.title === title);
  assert.ok(project, `${title}: project must exist`);
  assert.ok(project.galleryBriefs?.length, `${title}: planned gallery must exist`);
  for (const brief of [project.imageBrief, ...project.galleryBriefs]) {
    assert.match(brief, /^ILLUSTRATIVE \/ /, `${title}: planned art needs an explicit illustrative label`);
  }
}
for (const title of ['Navigator App', 'Stateroom TV App']) {
  const project = professionalProjects.find(item => item.title === title);
  assert.ok(project, `${title}: shipped project must exist`);
  assert.match(project.imageBrief, /^Approved /, `${title}: request approved shipped-product imagery, not fabricated screenshots`);
}
const planning = professionalProjects.find(item => item.title === 'Connected Planning');
assert.doesNotMatch(planning.galleryBriefs.join(' '), /Before-and-after information architecture:/, 'Do not imply a documented before/after comparison');
assert.match(caseStudy, /Process &amp; rationale/, 'Case-study navigation should identify design rationale');
assert.match(caseStudy, /02 \/ Process & design rationale/, 'Case-study heading should not imply verified design decisions');

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
// A separate evidence chapter makes the research/assumption boundary discoverable
// without upgrading design rationale into documented testing or outcomes.
assert.match(projectContent, /<h2 id="case-evidence-notes">03 \/ Evidence &amp; tradeoffs<\/h2>/, 'Evidence notes need a visible chapter heading');
assert.match(caseStudy, /data-case-jump="case-evidence-notes"/, 'Chapter navigation must link to the evidence boundary');
assert.match(caseStudy, /const processNotes=processNotesMarkup\(p\)/, 'Evidence chapter must render from existing documented notes');
assert.match(caseStudy, /\(processNotes\?'04':'03'\)/, 'Outcome chapter number must follow optional evidence chapter');

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


console.log(`PASS: ${data.companies.length} companies, ${projects.length} projects, navigation targets, JS syntax and Mobile Insights delivery status`);
