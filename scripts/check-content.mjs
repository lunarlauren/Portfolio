// Dependency-free structural smoke checks for the portfolio's static assets.
// These checks cannot replace browser, keyboard, screen-reader or visual QA.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const content = read('../public/content.js');
const script = read('../public/script.js');
const html = read('../public/index.html');
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


console.log(`PASS: ${data.companies.length} companies, ${projects.length} projects, navigation targets, JS syntax and Mobile Insights delivery status`);
