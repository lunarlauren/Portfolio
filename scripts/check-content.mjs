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
assert.match(script, /processNotesMarkup\(p\)/, 'Case study must render evidence and tradeoff notes');
assert.match(script, /Design approach/, 'Project previews must expose design rationale');
const patientPortal = data.companies.find(company => company.id === 'alcon')?.projects.find(project => project.title === 'Customizable Patient Portal');
assert.ok(patientPortal, 'Missing Alcon patient portal case study');
assert.match(patientPortal.evidence, /not been supplied/i, 'Patient portal must not imply undocumented research or metrics');
assert.match(patientPortal.tradeoffs, /flexibility for individual practices/i, 'Patient portal must explain its documented UX design tension');
assert.match(script, /Evidence & boundaries/, 'Case studies must label the evidence boundary');
assert.match(script, /Design tension & rationale/, 'Case studies must distinguish rationale from tested results');
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
assert.match(script, /"Fallout 76 ;  What I'd Design":\[\["THE IDEA"/, 'Fallout highlight key must match the case-study title');



// Static responsive guards: these do not prove browser layout or screen-reader behavior.
assert.match(css, /@media\(min-width:421px\) and \(max-width:650px\)/, 'Mid-size header should remain single-row');
assert.match(css, /@media\(max-width:420px\)\{\s*\/\* The earlier two-row grid is intentional/, 'Smallest screens should retain two-row navigation');
assert.match(css, /\.case-view \.case-section-links\{top:110px/, 'Small-screen sticky chapter index must clear the two-row header');
assert.match(css, /\.case-view \.case-section-links\{top:64px/, 'Mid-size sticky chapter index must clear the one-row header');
assert.match(html, /styles\.css\?v=20261026-responsive-case-index/, 'HTML must reference the revised stylesheet');

console.log(`PASS: ${data.companies.length} companies, ${projects.length} projects, navigation targets, JS syntax and Mobile Insights delivery status`);
