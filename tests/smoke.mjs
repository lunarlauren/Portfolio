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
try{
 const page=await browser.newPage();
 page.on("pageerror",error=>errors.push(error.message));
 await page.goto(origin+"/case-studies/hoylu/connected-planning/");
 await page.locator("#case-title").waitFor();
 assert.match(await page.title(),/Connected Planning/);
 assert.equal(await page.locator("#main").isHidden(),true);
 assert.equal(await page.locator("#case-title").innerText(),"Connected Planning");
 await page.locator(".case-section-links button").first().click();
 // Evidence boundaries must be easy to find and keyboard-focusable.
 await page.locator('[data-case-jump="case-evidence-notes"]').click();
 assert.equal(await page.locator("#case-evidence-notes").evaluate(node=>document.activeElement===node),true,"Evidence heading should receive focus");
 assert.equal(await page.locator(".case-section-links button[aria-current='location']").count()>0,true);
 await page.locator(".case-next-nav a[href^='/case-studies/']").click();
 assert.match(page.url(),/\/case-studies\/hoylu\/mobile-insights\//);
 assert.match(await page.locator(".case-prose").innerText(),/Mobile Insights is a shipped product experience/,"Mobile Insights case study should describe its actual delivery status");
 await page.goBack();
 assert.match(page.url(),/connected-planning/);
 await page.locator(".case-back").click();
 assert.match(page.url(),/\/#work$/);
 assert.equal(await page.locator("#main").isVisible(),true);
 await page.locator(".project-card-link[href='/case-studies/hoylu/connected-planning/']").first().click();
 await page.locator('a[href="#about"]').first().click();
 assert.match(page.url(),/\/#about$/);
 assert.equal(await page.locator("#main").isVisible(),true);
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
 console.log("PASS: direct deep links, chapter navigation, next/back, home links, mobile layout, no page errors");
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
