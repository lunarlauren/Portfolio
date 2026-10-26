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
assert.match(script, /processNotesMarkup\\(p\\)/, 'Case study must render evidence and tradeoff notes');
assert.match(script, /Design approach/, 'Project previews must expose design rationale');
console.log(`PASS: ${data.companies.length} companies, ${projects.length} projects, navigation targets, JS syntax and Mobile Insights delivery status`);
