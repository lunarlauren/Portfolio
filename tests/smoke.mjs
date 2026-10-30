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
 // Persisted appearance must be applied before the stylesheet paints, not
 // only by the late footer toggle controller (iOS Home Screen flash).
 const initialTheme=await page.evaluate(()=>({
  root:document.documentElement.getAttribute("data-theme"),
  meta:document.querySelector('meta[name="theme-color"]').content,
  background:document.documentElement.style.backgroundColor
 }));
 assert.ok(["light","dark"].includes(initialTheme.root));
 assert.equal(initialTheme.meta,initialTheme.root==="dark"?"#111d2a":"#f7f9fa");
 assert.ok(initialTheme.background,"Root background should be set before first paint");


 // The dark header/footer should be one opaque sheet with the page,
 // not a brighter blue band above the dotted hero.
 await page.evaluate(()=>document.documentElement.dataset.theme="dark");
 const chromeColors=await page.evaluate(()=>({
  page:getComputedStyle(document.documentElement).getPropertyValue("--paper").trim(),
  header:getComputedStyle(document.querySelector(".site-header")).backgroundColor,
  footer:getComputedStyle(document.querySelector("footer.wrap")).backgroundColor,
  expected:getComputedStyle(document.body).backgroundColor
 }));
 assert.equal(chromeColors.header,chromeColors.expected,
  "Dark sticky header must match the dark page surface");
 assert.equal(chromeColors.footer,chromeColors.expected,
  "Dark footer must match the dark page surface");
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // The After Hours section is deliberately a dark reading surface in both
 // page themes. Guard its visible heading and paper-free introduction after
 // extracting the component CSS from the legacy stylesheet.
 for(const theme of ["light","dark"]){
  await page.evaluate(value=>{document.documentElement.dataset.theme=value},theme);
  const night=await page.evaluate(()=>{
   const section=document.querySelector("#playground");
   const heading=section.querySelector("#playground-title");
   const intro=section.querySelector(".section-head>p");
   const css=getComputedStyle(section),title=getComputedStyle(heading);
   return {
    surface:css.backgroundColor,
    headingVisible:title.display!=="none"&&title.visibility!=="hidden",
    introBackground:getComputedStyle(intro).backgroundColor
   };
  });
  assert.notEqual(night.surface,"rgba(0, 0, 0, 0)",
   "Playground must retain its opaque night surface in "+theme+" theme");
  assert.equal(night.headingVisible,true,"Playground heading must remain visible");
  assert.equal(night.introBackground,"rgba(0, 0, 0, 0)",
   "Playground intro must not inherit notebook paper in "+theme+" theme");
 }
 await page.evaluate(()=>document.documentElement.dataset.theme="light");
 await page.setViewportSize({width:390,height:844});
 const playGridColumns=await page.locator("#play-grid").evaluate(grid=>
  getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length);
 assert.equal(playGridColumns,1,"Playground cards must stack on narrow phones");
 await page.setViewportSize({width:1280,height:720});

 // Accessible link navigation should expose challenge, reviewed contribution,
 // and the visible design approach—not just a generic case-study action.
 const cardDescriptions=await page.locator('.work .project-card-link').first().evaluate(link=>
  link.getAttribute('aria-describedby').split(/\s+/).map(id=>document.getElementById(id)?.textContent.trim())
 );
 assert.equal(cardDescriptions.length,3,'Professional card should describe challenge, facts, and process');
 assert.ok(cardDescriptions.every(Boolean),'Every card description ID must resolve');
 assert.match(cardDescriptions[2],/Design approach/,'Process teaser must be included in the accessible description');
 // Opening a case study in a new tab must not be hijacked by SPA routing.
 // The original portfolio page should remain on the homepage.
 const newTabCard=page.locator(".work .project-card-link").first();
 await newTabCard.evaluate(link=>link.target="_blank");
 const popupPromise=page.waitForEvent("popup");
 await newTabCard.click();
 const popup=await popupPromise;
 await popup.locator("#case-title").waitFor();
 assert.ok(popup.url().includes("/case-studies/hoylu/connected-planning/"));
 assert.equal(new URL(page.url()).pathname,"/","New-tab navigation must leave the opener on the homepage");
 await popup.close();
 await newTabCard.evaluate(link=>link.removeAttribute("target"));
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

 // The mobile introduction should give the illustration its own space and
 // keep the action easy to find without turning it into a full-width slab.
 // Measure both themes; the two use the same responsive geometry.
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const hero=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const q=selector=>document.querySelector(selector).getBoundingClientRect();
    const headline=q(".hero h1"),illustration=q(".hero-feature");
    const body=q(".hero-description"),action=q(".hero-actions .primary-link");
    const container=document.querySelector(".hero");
    const style=getComputedStyle(container);
    return {
     artToHeadline:headline.top-illustration.bottom,
     headlineToCopy:body.top-headline.bottom,
     copyToAction:action.top-body.bottom,
     actionWidth:action.width,actionHeight:action.height,
     available:container.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),
     illustrationBottom:illustration.bottom,
     overflow:document.documentElement.scrollWidth>innerWidth+2
    };
   },theme);
   assert.ok(hero.artToHeadline>=15,
    `${width}px ${theme}: Portrait should lead the headline without collision`);
   assert.ok(hero.headlineToCopy>=18,
    `${width}px ${theme}: Headline needs space before the introduction`);
   assert.ok(hero.copyToAction>=22,
    `${width}px ${theme}: CTA must not crowd the paragraph`);
   assert.ok(hero.actionWidth<=hero.available*.94,
    `${width}px ${theme}: CTA should not fill the editorial column`);
   assert.ok(hero.actionHeight>=48,
    `${width}px ${theme}: CTA must remain a usable touch target`);
   assert.ok(hero.illustrationBottom<844,
    `${width}px ${theme}: Portrait should be visible within the first phone viewport`);
   assert.equal(hero.overflow,false,
    `${width}px ${theme}: Hero must not introduce horizontal scrolling`);
  }
 }

 // Regression for the compact About composition: a 12ch max-width on the
 // heading once created unnecessary extra lines on phones. Measure the actual
 // rendered width and confirm the photo still sits with the introduction.
 for(const width of [320,390]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const layout=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const about=document.querySelector(".about");
    const heading=about.querySelector("h2");
    const portrait=about.querySelector(".about-portrait");
    const caption=portrait.querySelector("figcaption");
    const intro=about.querySelector(".about-intro p");
    const aiNote=about.querySelector(".ai-process");
     const copy=about.querySelector(".about-copy");
    const headingRect=heading.getBoundingClientRect();
    const aboutStyle=getComputedStyle(about);
    const available=about.clientWidth-parseFloat(aboutStyle.paddingLeft)-parseFloat(aboutStyle.paddingRight);
    return {
     available,headingWidth:headingRect.width,headingRight:headingRect.right,
     headingHeight:headingRect.height,portraitFloat:getComputedStyle(portrait).float,
     portraitWidth:portrait.getBoundingClientRect().width,
     portraitTop:portrait.getBoundingClientRect().top,
     introTop:intro.getBoundingClientRect().top,
     captionDisplay:getComputedStyle(caption).display,
     aiTop:aiNote.getBoundingClientRect().top,
     copyRight:copy.getBoundingClientRect().right,
     copyDisplay:getComputedStyle(copy.parentElement).display,
     portraitBottom:portrait.getBoundingClientRect().bottom
    };
   },theme);
   assert.ok(layout.headingWidth>=layout.available*.9,
    `${width}px ${theme}: About heading must use the available text column`);
   assert.ok(layout.headingRight<=width+1,
    `${width}px ${theme}: About heading must not overflow the viewport`);
   assert.ok(layout.headingHeight<310,
    `${width}px ${theme}: About heading must not consume an entire phone screen`);
   assert.equal(layout.portraitFloat,"left",`${width}px ${theme}: Headshot should sit beside the intro`);
   assert.ok(layout.portraitWidth>=100&&layout.portraitWidth<=140,
    `${width}px ${theme}: Headshot should remain a compact editorial portrait`);
   assert.ok(Math.abs(layout.portraitTop-layout.introTop)<24,
    `${width}px ${theme}: Headshot and introduction should start together`);
   assert.equal(layout.captionDisplay,"none",`${width}px ${theme}: Avoid a repeated introduction`);
   assert.equal(layout.copyDisplay,"block",`${width}px ${theme}: About should use a single reading column`);
   assert.ok(layout.copyRight<=width+1,
    `${width}px ${theme}: About copy must not overflow the viewport`);
   assert.ok(layout.aiTop>=layout.portraitBottom,
    `${width}px ${theme}: AI process note must follow the portrait without overlapping it`);
  }
 }
 await page.setViewportSize({width:1280,height:720});
 await page.evaluate(()=>{document.documentElement.dataset.theme="light"});
 assert.notEqual(await page.locator(".about-portrait figcaption").evaluate(node=>getComputedStyle(node).display),"none",
  "Desktop About must retain the headshot caption");

 await page.goto(origin+"/case-studies/hoylu/connected-planning/");
 await page.locator("#case-title").waitFor();
 // Canonical homepage anchors must work when opened in another tab from a
 // deep-linked case study. The original case-study page must remain in place.
 for(const selector of [".site-header nav a[href='/#work']", ".case-back"]){
  const link=page.locator(selector);
  await link.evaluate(node=>node.target="_blank");
  const newTabPromise=page.waitForEvent("popup");
  await link.click();
  const newTab=await newTabPromise;
  await newTab.waitForLoadState("domcontentloaded");
  assert.equal(new URL(newTab.url()).pathname,"/","New-tab return link should open the homepage");
  assert.equal(new URL(newTab.url()).hash,"#work","New-tab return link should target Work");
  assert.match(page.url(),/connected-planning/,"New-tab return must not navigate the original case study");
  await newTab.close();
  await link.evaluate(node=>node.removeAttribute("target"));
 }
 assert.match(await page.title(),/Connected Planning/);
 assert.equal(await page.locator("#main").isHidden(),true);
 assert.equal(await page.locator("#case-title").innerText(),"Connected Planning");
 // Authored UX reasoning should be visible in the cover before a placeholder.
 // This is design rationale, not a claim of interviews or verified results.
 const approach=page.locator(".case-head .case-approach");
 assert.equal(await approach.count(),1,"Professional case-study cover should expose its authored design approach");
 const approachText=await approach.innerText();
 assert.match(approachText,/Design approach/i);
 assert.ok(approachText.replace(/Design approach/i,"").trim().length>=35,
  "Case-study cover must contain a meaningful authored design rationale");
 assert.equal(await approach.evaluate(node=>Boolean(node.compareDocumentPosition(document.querySelector(".case-hero-visual"))&Node.DOCUMENT_POSITION_FOLLOWING)),true,
  "The design approach must precede the visual brief in reading order");
 assert.equal(await page.locator('.case-gallery').getAttribute('aria-label'),'Visual briefs and image placeholders','Planned case-study visuals must not be announced as an image gallery');
 // Until approved screenshots arrive, a descriptive visual brief should not
 // occupy the same 640px cover height as a real image. Check both breakpoints
 // and preserve the explicit illustrative-art label and readable brief text.
 const brief=page.locator(".case-hero-visual:not(:has(img))");
 assert.equal(await brief.count(),1,"An unsupplied case hero should retain its editorial brief");
 assert.match(await brief.innerText(),/ILLUSTRATIVE.*NOT A PRODUCT SCREENSHOT/);
 const desktopBriefHeight=await brief.evaluate(node=>node.getBoundingClientRect().height);
 assert.ok(desktopBriefHeight>=200&&desktopBriefHeight<=340,"Desktop brief should be compact without clipping its copy");
 // The old light-only !important surface leaked into dark mode.
 // Check computed surfaces and keep the no-image border visible.
 const heroThemeSurfaces=await page.evaluate(()=>{
  const node=document.querySelector(".case-hero-visual:not(:has(img))");
  return ["light","dark"].map(theme=>{
   document.documentElement.dataset.theme=theme;
   const css=getComputedStyle(node);
   return {theme,bg:css.backgroundColor,borderStyle:css.borderTopStyle};
  });
 });
 assert.notEqual(heroThemeSurfaces[0].bg,heroThemeSurfaces[1].bg,"Hero placeholder must adapt to dark theme");
 assert.ok(heroThemeSurfaces.every(surface=>surface.borderStyle==="dashed"),"Missing hero artwork needs a dashed editorial border in both themes");
 await page.evaluate(()=>{document.documentElement.dataset.theme="light"});
 await page.setViewportSize({width:390,height:844});
 const phoneBriefHeight=await brief.evaluate(node=>node.getBoundingClientRect().height);
 assert.ok(phoneBriefHeight>=190&&phoneBriefHeight<=320,"Phone brief should not bury the UX narrative");
 assert.equal(await brief.evaluate(node=>node.scrollHeight<=node.clientHeight+2),true,"Brief text should not be vertically clipped");
 await page.setViewportSize({width:1280,height:720});
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
 const mobileApproach=await page.locator(".case-head .case-approach").innerText();
 assert.match(mobileApproach,/Design approach/i);
 assert.match(mobileApproach,/(?:stand out|priorit|hierarch|detail|tap)/i,
  "Shipped Mobile Insights should show a concrete small-screen design rationale");
 assert.doesNotMatch(mobileApproach,/\b(?:interviews proved|research showed|tested users)\b/i,
  "Mobile Insights cover must not imply undocumented research");
 await page.goBack();
 assert.match(page.url(),/connected-planning/);
 await page.locator(".case-back").click();
 assert.match(page.url(),/\/#work$/);
 assert.equal(await page.locator("#main").isVisible(),true);
 assert.deepEqual(await readMetadata(page),homepageMetadata,"Returning from a case study must restore homepage title, canonical, and social previews");
 await page.locator(".project-card-link[href='/case-studies/hoylu/connected-planning/']").first().click();
 await page.locator('.site-header nav a[href="/#about"]').click();
 assert.match(page.url(),/\/#about$/);
 assert.equal(await page.locator("#main").isVisible(),true);
 assert.deepEqual(await readMetadata(page),homepageMetadata,"Navigating from a case study to About must also restore homepage metadata");
 // A case-study link uses pushState, which emits neither hashchange nor
 // popstate. The header must identify Work rather than leaving About
 // announced as the current location from the previous view.
 await page.waitForFunction(()=>document.querySelector('.site-header nav a[href="/#about"]')?.getAttribute("aria-current")==="location");
 await page.locator(".project-card-link[href='/case-studies/hoylu/connected-planning/']").first().click();
 await page.locator("#case-title").waitFor();
 await page.waitForFunction(()=>document.querySelector('.site-header nav a[href="/#work"]')?.getAttribute("aria-current")==="location");
 assert.equal(await page.locator('.site-header nav a[href="/#about"]').getAttribute("aria-current"),null,"About must not remain current on a case-study route");
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
 // Some browsers/polyfills expose IntersectionObserver as a property without
 // providing a constructor. Do not hide Work/About behind reveal-ready in
 // that state; the project archive must remain readable and navigable.
 const limited=await browser.newPage();
 limited.on("pageerror",error=>errors.push(error.message));
 await limited.addInitScript(()=>{window.IntersectionObserver=undefined;});
 await limited.goto(origin+"/");
 assert.equal(await limited.evaluate(()=>typeof window.IntersectionObserver),"undefined");
 assert.equal(await limited.locator(".reveal-ready").count(),0,
  "Non-callable IntersectionObserver must leave homepage sections visible");
 assert.ok(await limited.locator(".work .project-card-link").count()>0,
  "Project stories must remain discoverable without reveal animation");
 await limited.close();
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
 // Queue a fallback update, then leave synchronously before the next paint.
 // Removing scroll listeners is insufficient if the queued frame survives.
 const canceledFrame=await fallback.evaluate(()=>{
  const originalCancel=window.cancelAnimationFrame;
  let canceled=0;
  window.cancelAnimationFrame=function(id){
   canceled++;
   return originalCancel.call(this,id);
  };
  try{
   window.dispatchEvent(new Event("scroll"));
   history.pushState(null,"","/#work");
   route();
  }finally{
   window.cancelAnimationFrame=originalCancel;
  }
  return canceled;
 });
 assert.equal(canceledFrame,1,"Leaving a case study must cancel the pending chapter frame");
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
 assert.equal(await mobile.locator(".case-head .case-approach").count(),1,"Authored approach should remain visible at 320px");
 assert.equal(await mobile.locator(".case-head .case-approach").evaluate(node=>getComputedStyle(node).gridTemplateColumns.trim().split(/\s+/).length),1,
  "The mobile approach should stack label and copy in one column");
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
