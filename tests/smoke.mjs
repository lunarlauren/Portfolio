// Browser smoke tests for the static portfolio and deep-link SPA fallback.
// Run: npm install --no-save playwright && npx playwright install chromium && node tests/smoke.mjs
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve } from "node:path";
import { chromium } from "playwright";

const root=resolve("public");
const types={".html":"text/html",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".webp":"image/webp"};
const server=createServer(async(req,res)=>{
 try{
  const path=new URL(req.url,"http://localhost").pathname;
  let file=resolve(root,"."+decodeURIComponent(path));
  if(!file.startsWith(root+"/")&&file!==root)throw Error("Invalid path");
  let info=await stat(file).catch(()=>null);
  if(!info?.isFile()){file=join(root,"index.html");info=await stat(file)}
  res.writeHead(200,{"content-type":types[extname(file)]||"application/octet-stream"});
  res.end(await readFile(file));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const origin="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
const errors=[];
// Compare against the actual homepage tags rather than hard-coding copy that
// editors may legitimately revise. Case routes must restore these on return.
const readMetadata=page=>page.evaluate(()=>{
 const selectors=[
  'meta[name="description"]','meta[property="og:title"]',
  'meta[property="og:description"]','meta[property="og:url"]',
  'meta[name="twitter:title"]','meta[name="twitter:description"]'
 ];
 return {
  title:document.title,
  canonical:document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
  tags:selectors.map(selector=>document.querySelector(selector)?.getAttribute("content"))
 };
});
try{
 const page=await browser.newPage();
 page.on("pageerror",error=>errors.push(error.message));
 await page.goto(origin+"/");
 const homepageMetadata=await readMetadata(page);
 // Accessible link navigation should expose challenge, reviewed contribution,
 // and the visible design approach—not just a generic case-study action.
 const cardDescriptions=await page.locator('.work .project-card-link').first().evaluate(link=>
  link.getAttribute('aria-describedby').split(/\s+/).map(id=>document.getElementById(id)?.textContent.trim())
 );
 assert.equal(cardDescriptions.length,3,'Professional card should describe challenge, facts, and process');
 assert.ok(cardDescriptions.every(Boolean),'Every card description ID must resolve');
 assert.match(cardDescriptions[2],/Design approach/,'Process teaser must be included in the accessible description');
 // The hero illustration and About headshot have different editorial jobs.
 // Confirm both local assets actually load; source-level path checks alone
 // would not catch a broken encoded filename or missing image response.
 const heroPortrait=page.locator(".hero-portrait-art");
 await heroPortrait.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector(".hero-portrait-art")?.naturalWidth>0);
 assert.match(await heroPortrait.getAttribute("src"),/laurenlevenportfolioheroportrait\.png$/);
 const aboutHeadshot=page.locator(".about-portrait img");
 await aboutHeadshot.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector(".about-portrait img")?.naturalWidth>0);
 assert.match(await aboutHeadshot.getAttribute("src"),/Headshot%20Lauren%20Leven\.png$/);
 assert.notEqual(await heroPortrait.getAttribute("src"),await aboutHeadshot.getAttribute("src"),
  "The About photograph must remain distinct from the illustrated hero");

 await page.goto(origin+"/case-studies/hoylu/connected-planning/");
 await page.locator("#case-title").waitFor();
 assert.match(await page.title(),/Connected Planning/);
 assert.equal(await page.locator("#main").isHidden(),true);
 assert.equal(await page.locator("#case-title").innerText(),"Connected Planning");
 assert.equal(await page.locator('.case-gallery').getAttribute('aria-label'),'Visual briefs and image placeholders','Planned case-study visuals must not be announced as an image gallery');
 assert.equal(await page.locator(".case-facts dt").allTextContents().then(labels=>labels.some(label=>label.trim()==="My role")),true,"Case facts should expose the designer's actual contribution");
 assert.match(await page.locator(".case-facts").innerText(),/Product UX and visual design/,"Role must use reviewed project metadata");
 assert.equal(await page.locator(".case-delivery-stamp").count(),0,"Design contributions without verified shipping must not get a shipped stamp");
 // Distinguish documented evidence boundaries from design reasoning without
 // using color alone: the visible headings remain different in both themes.
 assert.deepEqual(await page.locator(".case-process-note").evaluateAll(nodes=>nodes.map(node=>node.dataset.noteKind)),["evidence","rationale"]);
 for(const theme of ["light","dark"]){
  const borders=await page.evaluate(theme=>{
   document.documentElement.dataset.theme=theme;
   return [...document.querySelectorAll(".case-process-note")].map(node=>getComputedStyle(node).borderLeftColor);
  },theme);
  assert.notEqual(borders[0],borders[1],theme+" evidence and rationale need distinct annotation rules");
 }
 await page.evaluate(()=>{document.documentElement.dataset.theme="light"});
 await page.locator(".case-section-links button").first().click();
 // Evidence boundaries must be easy to find and keyboard-focusable.
 await page.locator('[data-case-jump="case-evidence-notes"]').click();
 assert.equal(await page.locator("#case-evidence-notes").evaluate(node=>document.activeElement===node),true,"Evidence heading should receive focus");
 assert.equal(await page.locator(".case-section-links button[aria-current='location']").count()>0,true);
 await page.locator(".case-next-nav a[href^='/case-studies/']").click();
 assert.match(page.url(),/\/case-studies\/hoylu\/mobile-insights\//);
 assert.match(await page.locator(".case-prose").innerText(),/Mobile Insights is a shipped product experience/,"Mobile Insights case study should describe its actual delivery status");
 assert.match(await page.locator(".case-evidence").innerText(),/Shipped product contribution/,"The project overview must identify Mobile Insights as shipped");
 assert.equal(await page.locator(".case-delivery-stamp").innerText(),"SHIPPED PRODUCT CONTRIBUTION","Shipped delivery must be visible above the fold");
 await page.goBack();
 assert.match(page.url(),/connected-planning/);
 await page.locator(".case-back").click();
 assert.match(page.url(),/\/#work$/);
 assert.equal(await page.locator("#main").isVisible(),true);
 assert.deepEqual(await readMetadata(page),homepageMetadata,"Returning from a case study must restore homepage title, canonical, and social previews");
 await page.locator(".project-card-link[href='/case-studies/hoylu/connected-planning/']").first().click();
 await page.locator('a[href="#about"]').first().click();
 assert.match(page.url(),/\/#about$/);
 assert.equal(await page.locator("#main").isVisible(),true);
 assert.deepEqual(await readMetadata(page),homepageMetadata,"Navigating from a case study to About must also restore homepage metadata");
 // A case-study link uses pushState, which emits neither hashchange nor
 // popstate. The header must identify Work rather than leaving About
 // announced as the current location from the previous view.
 await page.waitForFunction(()=>document.querySelector('.site-header nav a[href="#about"]')?.getAttribute("aria-current")==="location");
 await page.locator(".project-card-link[href='/case-studies/hoylu/connected-planning/']").first().click();
 await page.locator("#case-title").waitFor();
 await page.waitForFunction(()=>document.querySelector('.site-header nav a[href="#work"]')?.getAttribute("aria-current")==="location");
 assert.equal(await page.locator('.site-header nav a[href="#about"]').getAttribute("aria-current"),null,"About must not remain current on a case-study route");
 await page.locator(".case-back").click();
 await page.locator("#main").waitFor({state:"visible"});
 // Leaving a case study restores focus/scroll to the opener in an animation
 // frame. Wait for that restoration before deliberately scrolling to the
 // footer, or its pending scroll can override our test's scrollTo(bottom).
 await page.waitForFunction(()=>document.activeElement?.classList.contains("project-card-link"));
 // The Contact link opens mail, not an in-page location. Preserve the visual
 // near-footer underline without misreporting aria-current to screen readers.
 await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
 await page.waitForFunction(()=>document.querySelector(".header-contact")?.hasAttribute("data-section-active"));
 assert.equal(await page.locator(".header-contact").getAttribute("aria-current"),null,"Mailto Contact must not announce a current page location");
 assert.match(await page.locator(".header-contact").evaluate(node=>getComputedStyle(node).textDecorationLine),/underline/,"Near-footer Contact should remain visibly underlined");
 // The footer surface must reach the viewport edges, not stop at .wrap's
 // 1320px content width (which would expose the notebook dots on desktop).
 await page.setViewportSize({width:1440,height:900});
 const footerBounds=await page.locator("footer.wrap").evaluate(node=>{
  const bounds=node.getBoundingClientRect();
  return {left:bounds.left,width:bounds.width,viewport:document.documentElement.clientWidth};
 });
 assert.ok(Math.abs(footerBounds.left)<=1&&footerBounds.width>=footerBounds.viewport-2,"Footer paper must be full bleed at desktop widths");
 await page.locator("footer.wrap a").focus();
 // Programmatic focus after mouse clicks does not necessarily match :focus-visible.
 // Move focus away and back using the keyboard to test the actual modality.
 await page.keyboard.press("Tab");
 await page.keyboard.press("Shift+Tab");
 assert.equal(await page.locator("footer.wrap a").evaluate(node=>document.activeElement===node),true,"Keyboard focus should return to the footer link");
 assert.equal(await page.locator("footer.wrap a").evaluate(node=>getComputedStyle(node).outlineStyle),"solid","Footer link needs a visible keyboard focus outline");
 // Computed-style check catches a transparent footer in either theme.
 // It does not replace visual or screenshot QA on the deployed site.
 for(const theme of ["light","dark"]){
  const chrome=await page.evaluate(theme=>{
   document.documentElement.setAttribute("data-theme",theme);
   const footer=getComputedStyle(document.querySelector("footer.wrap"));
   const header=getComputedStyle(document.querySelector(".site-header"));
   return {footerColor:footer.backgroundColor,footerImage:footer.backgroundImage,headerColor:header.backgroundColor};
  },theme);
  assert.notEqual(chrome.footerColor,"transparent",theme+" footer must be opaque");
  assert.notEqual(chrome.footerColor,"rgba(0, 0, 0, 0)",theme+" footer must be opaque");
  assert.equal(chrome.footerImage,"none",theme+" footer must not show the page texture");
  assert.equal(chrome.footerColor,chrome.headerColor,theme+" header and footer should share the paper surface");
 }
 // Editorial chapters are optional. Keep numbering contiguous when a future
 // case study has evidence notes but no process section, or neither section.
 const optional=await browser.newPage();
 optional.on("pageerror",error=>errors.push(error.message));
 await optional.goto(origin+"/case-studies/hoylu/connected-planning/");
 await optional.evaluate(()=>{
  const project=window.PORTFOLIO.companies.find(company=>company.id==="hoylu").projects[0];
  project.process="";
  renderCaseStudy("case/hoylu/0");
 });
 assert.match(await optional.locator("#case-evidence-notes").innerText(),/^02 \/ Evidence & tradeoffs/);
 assert.match(await optional.locator("#case-outcome").innerText(),/^03 \/ Deliverables & learning/);
 await optional.evaluate(()=>{
  const project=window.PORTFOLIO.companies.find(company=>company.id==="hoylu").projects[0];
  project.evidence="";project.tradeoffs="";
  renderCaseStudy("case/hoylu/0");
 });
 assert.equal(await optional.locator("#case-evidence-notes").count(),0);
 assert.match(await optional.locator("#case-outcome").innerText(),/^02 \/ Deliverables & learning/);
 await optional.close();
 // Older/limited browsers may not expose IntersectionObserver. Chapter
 // progress must still follow scrolling and release its listeners on exit.
 const fallback=await browser.newPage();
 fallback.on("pageerror",error=>errors.push(error.message));
 await fallback.addInitScript(()=>{delete window.IntersectionObserver;});
 await fallback.goto(origin+"/case-studies/hoylu/connected-planning/");
 await fallback.locator("#case-title").waitFor();
 assert.equal(await fallback.evaluate(()=>"IntersectionObserver" in window),false,
  "The fallback smoke case must actually disable IntersectionObserver");
 await fallback.evaluate(()=>{
  const heading=document.querySelector("#case-outcome");
  window.scrollTo({top:heading.getBoundingClientRect().top+window.scrollY-100,behavior:"instant"});
 });
 await fallback.waitForFunction(()=>document.querySelector('[data-case-jump="case-outcome"]')?.getAttribute("aria-current")==="location");
 await fallback.locator(".case-back").click();
 await fallback.waitForFunction(()=>window.caseSectionScrollCleanup===null);
 await fallback.close();
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 mobile.on("pageerror",error=>errors.push(error.message));
 await mobile.goto(origin+"/case-studies/alcon/ai-assisted-iol-planning/");
 await mobile.locator("#case-title").waitFor();
 assert.equal(await mobile.locator("#case-title").innerText(),"AI-Assisted IOL Planning");
 assert.equal(await mobile.locator(".case-section-links button").first().isVisible(),true);
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),true,"Unexpected mobile horizontal overflow");
 await mobile.setViewportSize({width:320,height:720});
 assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),true,"Unexpected 320px horizontal overflow");
 // Selecting the outcome chapter should reveal its active tab in the narrow strip.
 // A programmatic document scroll is not a reliable IntersectionObserver trigger.
 await mobile.locator('[data-case-jump="case-outcome"]').click();
 await mobile.waitForFunction(()=>{
  const nav=document.querySelector(".case-section-links");
  const tab=nav?.querySelector('[data-case-jump="case-outcome"][aria-current="location"]');
  if(!tab)return false;
  const a=tab.getBoundingClientRect(),b=nav.getBoundingClientRect();
  return a.left>=b.left-2&&a.right<=b.right+2;
 },null,{timeout:3000});
 await mobile.close();
 assert.deepEqual(errors,[],"Uncaught browser JavaScript errors");
 console.log("PASS: deep links, chapters, shipped status, opaque themed footer, mobile layout, no page errors");
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
