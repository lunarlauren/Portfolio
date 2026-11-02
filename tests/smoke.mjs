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
 // Count real image requests, not markup occurrences: a mistaken preload URL
 // or CORS mode can cause the browser to download the same image twice.
 let heroImageRequests=0;
 let retiredCssRequests=0;
 page.on("request",request=>{
  const path=new URL(request.url()).pathname;
  if(path==="/laurenlevenportfolioheroportrait.png")heroImageRequests++;
  if(path==="/styles.css")retiredCssRequests++;
 });
 await page.goto(origin+"/");
 const homepageMetadata=await readMetadata(page);
 // Pass 18: prove render-critical fonts and hero art are discovered in
 // the HTML head, not by an @import waterfall after foundations.css.
 await page.waitForFunction(()=>document.querySelector(".hero-portrait-art")?.naturalWidth>0);
 const discovery=await page.evaluate(()=>{
  const head=[...document.head.querySelectorAll("link")];
  const fontSheet=head.find(link=>link.rel==="stylesheet"&&link.href.includes("fonts.googleapis.com/css2"));
  const rootSheet=head.find(link=>link.rel==="stylesheet"&&link.href.includes("/components/foundations.css"));
  const artPreload=head.find(link=>link.rel==="preload"&&link.as==="image");
  const art=document.querySelector(".hero-portrait-art");
  const headshot=document.querySelector(".about-portrait img");
  const preconnects=head.filter(link=>link.rel==="preconnect");
  return {
   fontUrl:fontSheet?.href,
   fontBeforeFoundation:fontSheet&&rootSheet?
    head.indexOf(fontSheet)<head.indexOf(rootSheet):false,
   googleCssConnect:preconnects.some(link=>link.href==="https://fonts.googleapis.com/"),
   googleFileConnect:preconnects.some(link=>link.href==="https://fonts.gstatic.com/"&&
    link.crossOrigin==="anonymous"),
   artPreloadUrl:artPreload?.getAttribute("href"),
   artPreloadPriority:artPreload?.fetchPriority,
   preloadBeforeCSS:artPreload&&rootSheet?head.indexOf(artPreload)<head.indexOf(rootSheet):false,
   artSrc:art.getAttribute("src"),
   artPriority:art.fetchPriority,
   artLoaded:art.naturalWidth>0,
   bodyFont:getComputedStyle(document.body).fontFamily,
   displayFont:getComputedStyle(document.querySelector(".hero h1")).fontFamily,
   headshotLoading:headshot.loading,
   headshotDecoding:headshot.decoding,
   legacyCss:head.some(link=>link.rel==="stylesheet"&&new URL(link.href).pathname==="/styles.css")
  };
 });
 assert.equal(discovery.googleCssConnect,true,"Font CSS origin should preconnect");
 assert.equal(discovery.googleFileConnect,true,"Cross-origin font file host should preconnect anonymously");
 assert.match(discovery.fontUrl||"",/family=DM\+Sans.*family=Newsreader.*display=swap/,
  "Original DM Sans and Newsreader Google Fonts request is still used");
 assert.equal(discovery.fontBeforeFoundation,true,
  "Font CSS is discovered before first component stylesheet");
 assert.equal(discovery.artPreloadUrl,"/laurenlevenportfolioheroportrait.png",
  "Critical image preload uses the actual hero illustration URL");
 assert.equal(discovery.artPreloadPriority,"high","Hero preload has high fetch priority");
 assert.equal(discovery.preloadBeforeCSS,true,"Hero preload precedes render-blocking component CSS");
 assert.equal(discovery.artSrc,discovery.artPreloadUrl,"Preload and img should reuse exact same URL");
 assert.equal(discovery.artPriority,"high","Above-the-fold hero image retains high fetch priority");
 assert.equal(discovery.artLoaded,true,"Hero image loads from the preloaded resource");
 assert.equal(heroImageRequests,1,"Hero preload and img must result in one network request");
 assert.equal(retiredCssRequests,0,"Inactive styles.css compatibility stub is no longer fetched");
 assert.equal(discovery.legacyCss,false,"Inactive styles.css must not be linked in head");
 assert.match(discovery.bodyFont,/DM Sans/,"Body text keeps its authored font-family stack");
 assert.match(discovery.displayFont,/Newsreader/,"Headings keep the display font-family stack");
 assert.equal(discovery.headshotLoading,"lazy","Large About portrait is not eagerly requested");
 assert.equal(discovery.headshotDecoding,"async","About portrait remains asynchronously decoded");

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

 // Pass 17: opaque chrome is the legibility layer. Backdrop blur behind
 // an opaque sheet has no visible contribution but requests extra compositing;
 // preserve the tactile separator, theme toggle gloss, and parallax behavior.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const paint=await page.evaluate(value=>{
    document.documentElement.dataset.theme=value;
    const css=node=>getComputedStyle(node);
    const header=css(document.querySelector(".site-header"));
    const toggle=css(document.querySelector(".site-header .theme-toggle"));
    const portrait=document.querySelector(".hero .hero-portrait-art");
    const portraitStyle=css(portrait);
    const prev=portrait.style.getPropertyValue("--hero-parallax-y");
    portrait.style.setProperty("--hero-parallax-y","8px");
    const plus=css(portrait).translate;
    portrait.style.setProperty("--hero-parallax-y","-8px");
    const minus=css(portrait).translate;
    if(prev)portrait.style.setProperty("--hero-parallax-y",prev);
    else portrait.style.removeProperty("--hero-parallax-y");
    return {
     paper:css(document.body).backgroundColor,
     headerBackground:header.backgroundColor,
     headerShadow:header.boxShadow,
     headerEdge:header.borderBottomColor,
     headerBlur:header.backdropFilter,
     toggleBlur:toggle.backdropFilter,
     toggleBackground:toggle.backgroundColor,
     toggleShadow:toggle.boxShadow,
     portraitWillChange:portraitStyle.willChange,
     plus,minus
    };
   },theme);
   const id=width+"px "+theme;
   assert.equal(paint.headerBackground,paint.paper,id+": opaque chrome keeps page paper");
   assert.equal(paint.headerBlur,"none",id+": scrolling header must not blur backdrop");
   assert.equal(paint.toggleBlur,"none",id+": theme toggle no longer blurs backdrop");
   assert.notEqual(paint.headerShadow,"none",id+": header retains soft separation");
   assert.notEqual(paint.headerEdge,"rgba(0, 0, 0, 0)",id+": hairline stays visible");
   assert.notEqual(paint.toggleBackground,"rgba(0, 0, 0, 0)",
    id+": tactile toggle still has paper tint");
   assert.match(paint.toggleShadow,/inset/,id+": toggle retains its inset highlight");
   assert.equal(paint.portraitWillChange,"auto",
    id+": hero must not reserve a permanent compositor layer");
   assert.notEqual(paint.plus,paint.minus,
    id+": portrait keeps responsive translate parallax without will-change");
   assert.match(paint.plus,/8px/,id+": portrait can translate downward");
   assert.match(paint.minus,/-8px/,id+": portrait can translate upward");
  }
 }
 await page.setViewportSize({width:1280,height:800});
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // Pass 21: one foundation token owner must preserve rendered heading type
 // and paragraph rhythm at phone/desktop widths in both themes. The archive
 // title's background highlight retains its stationery-specific transition.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const typography=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const style=selector=>getComputedStyle(document.querySelector(selector));
    const sample=document.createElement("p");
    sample.textContent="Type scale check";
    document.body.append(sample);
    const paragraph=getComputedStyle(sample);
    const values={
     headingFamily:style(".hero h1").fontFamily,
     headingWeight:style(".hero h1").fontWeight,
     headingTransition:style(".hero h1").transitionProperty,
     workFamily:style(".work .section-head h2").fontFamily,
     workWeight:style(".work .section-head h2").fontWeight,
     aboutFamily:style(".about h2").fontFamily,
     aboutWeight:style(".about h2").fontWeight,
     paragraphSize:paragraph.fontSize,
     paragraphLineHeight:paragraph.lineHeight,
     skipPadding:style(".skip-link").paddingTop,
     archiveTitleTransition:style(".work .archive-project-title").transitionProperty
    };
    sample.remove();
    return values;
   },theme);
   const label=width+"px "+theme;
   for(const key of ["headingFamily","workFamily","aboutFamily"]){
    assert.match(typography[key],/Newsreader/,label+": "+key+" uses shared display type");
   }
   for(const key of ["headingWeight","workWeight","aboutWeight"]){
    assert.equal(typography[key],"600",label+": "+key+" preserves heading weight");
   }
   assert.equal(typography.paragraphSize,"16px",label+": paragraph body token");
   assert.equal(typography.paragraphLineHeight,"25.6px",label+": paragraph leading");
   assert.equal(typography.skipPadding,"12px",label+": skip-link retains its hit area");
   assert.match(typography.headingTransition,/font-variation-settings/,
    label+": heading retains editorial axis transition");
   assert.equal(typography.archiveTitleTransition,"background-size",
    label+": archive title keeps its stationery highlighter transition");
  }
 }
 await page.setViewportSize({width:1280,height:800});
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // Pass 7: root aliases --paper and --ink must resolve dynamically from
 // the light/dark source palette without a second theme-specific declaration.
 // Chrome edge likewise follows --line, including increased contrast below.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const tokens=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const root=getComputedStyle(document.documentElement);
    const value=name=>root.getPropertyValue(name).trim();
    return {
     paper:value("--paper"),palettePaper:value("--palette-paper"),
     ink:value("--ink"),brandInk:value("--brand-ink"),
     notebook:value("--notebook-paper"),
     edge:value("--site-chrome-edge"),line:value("--line"),
     headerEdge:getComputedStyle(document.querySelector(".site-header")).getPropertyValue("--site-chrome-edge").trim(),
     dots:value("--notebook-dot-color"),
     texture:getComputedStyle(document.body).backgroundImage,
     renderedInk:getComputedStyle(document.body).color
    };
   },theme);
   assert.equal(tokens.paper,tokens.palettePaper,width+"px "+theme+": paper alias follows theme palette");
   assert.equal(tokens.ink,tokens.brandInk,width+"px "+theme+": ink alias follows theme brand ink");
   assert.equal(tokens.paper,theme==="dark"?"#151515":"#f5f3ef",width+"px "+theme+": paper palette stays unchanged");
   assert.equal(tokens.ink,theme==="dark"?"#f1f0ec":"#171717",width+"px "+theme+": ink palette stays unchanged");
   assert.equal(tokens.renderedInk,theme==="dark"?"rgb(241, 240, 236)":"rgb(23, 23, 23)",
    width+"px "+theme+": body ink stays readable");
   assert.equal(tokens.notebook,tokens.paper,width+"px "+theme+": notebook paper follows the active paper token");
   assert.equal(tokens.edge,tokens.line,width+"px "+theme+": chrome edge follows the active separator");
   assert.equal(tokens.headerEdge,tokens.line,width+"px "+theme+": header inherits the same separator");
   assert.equal(tokens.dots.replace(/\s/g,""),theme==="dark"?"rgba(245,245,245,.14)":"rgba(40,40,40,.14)",
    width+"px "+theme+": notebook dots retain contrast");
   assert.match(tokens.texture,/radial-gradient/,width+"px "+theme+": notebook texture remains visible");
  }
 }
 await page.setViewportSize({width:1280,height:800});
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // Hero emphasis must resolve to the actual heading ink, not a late
 // !important theme override. Portrait reveal remains grayscale on hover
 // devices, while the note keeps the active light/dark paper separator.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const heroInk=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const heading=document.querySelector(".hero .hero-copy h1");
    const emphasis=heading.querySelector("em");
    const note=document.querySelector(".hero .notebook-hero-note");
    const portrait=document.querySelector(".hero .feature-art .hero-portrait-art");
    return {
     heading:getComputedStyle(heading).color,
     emphasis:getComputedStyle(emphasis).color,
     emphasisStyle:getComputedStyle(emphasis).fontStyle,
     noteBorder:getComputedStyle(note).borderBottomColor,
     expectedNote:getComputedStyle(document.documentElement).getPropertyValue(theme==="dark"?"--brand-pink":"--line").trim(),
     portraitFilter:getComputedStyle(portrait).filter
    };
   },theme);
   assert.equal(heroInk.emphasis,theme==="dark"?"rgb(222, 222, 222)":heroInk.heading,
    width+"px "+theme+": hero emphasis retains its theme-specific neutral ink");
   assert.equal(heroInk.emphasisStyle,theme==="dark"?"italic":"normal",
    width+"px "+theme+": hero emphasis retains its theme-specific type");
   assert.match(heroInk.portraitFilter,/grayscale\(1\)/,width+"px "+theme+": hero grayscale reveal remains active");
   const expected=theme==="dark"?"rgb(222, 222, 222)":"rgb(200, 197, 192)";
   assert.equal(heroInk.noteBorder,expected,width+"px "+theme+": note border must retain theme color");
  }
 }
 await page.setViewportSize({width:1280,height:800});
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // A late editorial skin previously shadowed the stronger dark
 // high-contrast separator preference. Test computed tokens, not just source.
 const contrastSession=await page.context().newCDPSession(page);
 await contrastSession.send("Emulation.setEmulatedMedia",{
  features:[{name:"prefers-contrast",value:"more"}]
 });
 await page.evaluate(()=>document.documentElement.dataset.theme="dark");
 const highContrast=await page.evaluate(()=>{
  const root=getComputedStyle(document.documentElement);
  return {line:root.getPropertyValue("--line").trim(),edge:root.getPropertyValue("--site-chrome-edge").trim(),muted:root.getPropertyValue("--muted").trim()};
 });
 assert.equal(highContrast.line,"#91adc3","Dark high-contrast separators must override standard theme");
  assert.equal(highContrast.edge,highContrast.line,"Chrome edge must follow the stronger high-contrast separator");
 assert.notEqual(highContrast.muted,"#c4c4c4","High-contrast secondary ink must override standard theme");
 await contrastSession.send("Emulation.setEmulatedMedia",{features:[]});
 await contrastSession.detach();
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // Brand accents are a visible distinction between professional projects.
 // Check computed colors in Chromium: the editorial global palette deliberately
 // neutralizes blue/pink, but Work's client tabs must not become gray.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   const cards=await page.evaluate(()=>[...document.querySelectorAll(".work .client-file")].map(card=>({
    client:[...card.classList].find(name=>name.startsWith("client-file--"))?.replace("client-file--",""),
    title:card.querySelector(".archive-project-title")?.textContent.trim(),
    tab:getComputedStyle(card.querySelector(".client-file-label")).backgroundColor,
    tabInk:getComputedStyle(card.querySelector(".client-file-label")).color,
    shipped:card.querySelector(".project-delivery-shipped")?.textContent.trim()||null,
    stampBorder:card.querySelector(".project-delivery-shipped")?getComputedStyle(card.querySelector(".project-delivery-shipped")).borderTopStyle:null
   })));
   const accents={hoylu:"rgb(83, 167, 222)",alcon:"rgb(241, 92, 157)","holland-america":"rgb(80, 186, 156)"};
   assert.ok(cards.length>=8,"Professional archive should include documented case studies");
   for(const card of cards){
    assert.equal(card.tab,accents[card.client],width+"px "+theme+": "+card.client+" tab keeps its brand accent");
    assert.equal(card.tabInk,"rgb(0, 0, 0)",width+"px "+theme+": tab ink retains readable contrast");
    if(["Mobile Insights","Navigator App","Stateroom TV App"].includes(card.title)){
     assert.equal(card.shipped,"Shipped product contribution",card.title+" shows verified delivery");
     assert.equal(card.stampBorder,"solid",card.title+" shipped stamp has a visible edge");
    }else assert.equal(card.shipped,null,card.title+" must not be marked shipped without verification");
   }
  }
 }
 await page.setViewportSize({width:1280,height:800});
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // Regression: blue boxes around ordinary hero/Work text were caused by
 // a dark-mode outline rule accidentally sharing the CTA's selector list.
 // Check computed styles in Chromium, not only source text, in both themes.
 for(const theme of ["light","dark"]){
  const staticOutlines=await page.evaluate(theme=>{
   document.documentElement.dataset.theme=theme;
   return [
    [".hero .eyebrow","Hero label"],
    [".hero-description","Hero introduction"],
    [".work .section-head>p","Work introduction"],
    [".about-copy p","About paragraph"]
   ].map(([selector,name])=>{
    const element=document.querySelector(selector);
    return {name,found:!!element,outline:element?getComputedStyle(element).outlineStyle:null};
   });
  },theme);
  for(const item of staticOutlines){
   assert.equal(item.found,true,item.name+" should exist for outline regression");
   assert.equal(item.outline,"none",theme+" must not draw a focus rectangle around "+item.name);
  }
 }
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // Shared editorial action tokens must preserve hover contrast on the
 // homepage and About invitation at phone and desktop widths in both themes.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:800});
  for(const theme of ["light","dark"]){
   await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   const expected=theme==="dark"
    ?{background:"rgb(166, 217, 255)",ink:"rgb(17, 17, 17)"}
    :{background:"rgb(35, 95, 136)",ink:"rgb(255, 255, 255)"};
   for(const selector of [".hero-actions .primary-link",".about .about-copy > .text-link"]){
    await page.hover(selector);
    // Wait for the authored hover transition before asserting final colors.
    await page.waitForTimeout(400);
    const colors=await page.$eval(selector,element=>{
     const style=getComputedStyle(element);
     return {background:style.backgroundColor,ink:style.color};
    });
    assert.deepEqual(colors,expected,
     selector+" hover must retain editorial contrast in "+theme+" at "+width+"px");
   }
  }
 }
 // Resting colors are as important as hover: the previous dark CTA cascade
 // needed !important to overcome an earlier, more specific homepage rule.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:800});
  for(const theme of ["light","dark"]){
   await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   await page.mouse.move(0,0);
   await page.waitForTimeout(300);
   const colors=await page.evaluate(()=>{
    const get=selector=>{
     const css=getComputedStyle(document.querySelector(selector));
     return {background:css.backgroundColor,ink:css.color};
    };
    return {hero:get(".hero-actions .primary-link"),
     about:get(".about .about-copy > .text-link"),
     contact:get(".site-header .header-contact")};
   });
   const expected=theme==="dark"
    ?{background:"rgb(241, 240, 236)",ink:"rgb(21, 21, 21)"}
    :{background:"rgb(23, 23, 23)",ink:"rgb(245, 243, 239)"};
   assert.deepEqual(colors.hero,expected,`${width}px ${theme}: resting hero CTA`);
   assert.deepEqual(colors.about,expected,`${width}px ${theme}: resting About CTA`);
   if(width===390){
    assert.equal(colors.contact.background,"rgba(0, 0, 0, 0)",
     `${theme}: phone Contact stays text-only`);
    assert.equal(colors.contact.ink,theme==="dark"?"rgb(241, 240, 236)":"rgb(23, 23, 23)",
     `${theme}: phone Contact ink is readable`);
   }else assert.deepEqual(colors.contact,expected,
    `${theme}: desktop Contact remains filled`);
  }
 }
 // Nav and quiet-link hover should resolve to the editorial accent in
 // both themes without a final-layer !important override.
 await page.setViewportSize({width:1280,height:800});
 for(const theme of ["light","dark"]){
  await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);
  const expected=theme==="dark"?"rgb(166, 217, 255)":"rgb(35, 95, 136)";
  for(const selector of [".site-header nav a[href='/#work']", ".hero-actions .quiet-link"]){
   await page.hover(selector);
   const ink=await page.$eval(selector,node=>getComputedStyle(node).color);
   assert.equal(ink,expected,theme+" "+selector+" hover ink");
  }
 }
 await page.setViewportSize({width:1280,height:720});
 await page.evaluate(()=>document.documentElement.dataset.theme="light");

 // The After Hours section is deliberately a dark reading surface in both
 // page themes. Guard its visible heading and paper-free introduction after
 // extracting the component CSS from the legacy stylesheet.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   await page.evaluate(value=>{document.documentElement.dataset.theme=value},theme);
   const night=await page.evaluate(()=>{
   const section=document.querySelector("#playground");
   const heading=section.querySelector("#playground-title");
   const intro=section.querySelector(".section-head>p");
   const process=section.querySelector(".project-card-process");
   const css=getComputedStyle(section),title=getComputedStyle(heading);
   // Synthetic brief protects the intentionally unsupplied image state even
   // if every current After Hours card eventually gains approved artwork.
   const probe=document.createElement("article");
   probe.className="project-card";
   probe.innerHTML='<div class="project-visual"><div class="visual-brief"><span class="brief-kicker">ILLUSTRATIVE</span></div></div>';
   section.append(probe);
   const frame=probe.querySelector(".project-visual");
   const brief=probe.querySelector(".visual-brief");
   const kicker=probe.querySelector(".brief-kicker");
   const placeholder={
    surface:getComputedStyle(frame).backgroundColor,
    edge:getComputedStyle(frame).borderTopColor,
    briefInk:getComputedStyle(brief).color,
    kickerInk:getComputedStyle(kicker).color
   };
   probe.remove();
   return {
    placeholder,
    surface:css.backgroundColor,
    headingVisible:title.display!=="none"&&title.visibility!=="hidden",
    introBackground:getComputedStyle(intro).backgroundColor,
    introColor:getComputedStyle(intro).color,
    processColor:getComputedStyle(process).color,
    processEdge:getComputedStyle(process).borderTopColor,
    headingColor:title.color,
    headingOpacity:title.opacity
   };
  });
  assert.equal(night.surface,"rgb(23, 23, 23)",
   "Playground must retain its neutral charcoal surface in "+theme+" theme");
  assert.equal(night.introColor,"rgb(224, 224, 224)",
   "Playground introduction must retain readable night ink in "+theme+" theme");
  assert.equal(night.processColor,"rgb(224, 224, 224)",
   "Playground process text must inherit readable paragraph ink in "+theme+" theme");
  assert.equal(night.processEdge,"rgb(119, 119, 119)",
   "Playground process divider must retain its night edge in "+theme+" theme");
  assert.equal(night.headingVisible,true,"Playground heading must remain visible");
  assert.equal(night.headingColor,"rgb(255, 255, 255)",
   "Playground heading must retain white ink in "+theme+" theme");
  assert.equal(night.headingOpacity,"1","Playground heading must remain fully opaque");
  assert.equal(night.introBackground,"rgba(0, 0, 0, 0)",
   "Playground intro must not inherit notebook paper in "+theme+" theme");
  assert.deepEqual(night.placeholder,{
   surface:"rgb(41, 41, 41)",edge:"rgb(119, 119, 119)",
   briefInk:"rgb(241, 241, 241)",kickerInk:"rgb(241, 241, 241)"
  }, "Playground illustrative brief must retain its night contrast in "+theme+" theme at "+width+"px");
  }
 }
 await page.evaluate(()=>document.documentElement.dataset.theme="light");
 await page.setViewportSize({width:390,height:844});
 const playGridColumns=await page.locator("#play-grid").evaluate(grid=>
  getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length);
 assert.equal(playGridColumns,1,"Playground cards must stack on narrow phones");
 await page.setViewportSize({width:1280,height:720});

 // The shared image fallback and no-image frame must resolve the same
 // night paint. Work and Playground override this shared base independently.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const fallback=await page.evaluate(value=>{
    document.documentElement.dataset.theme=value;
    const brief=document.createElement("div");
    brief.className="project-visual";
    brief.innerHTML='<span class="visual-brief">Illustrative brief</span>';
    const loading=document.createElement("div");
    loading.className="project-visual";
    loading.innerHTML='<img alt="">';
    // Case-study hero briefs share the dark ink; unrelated labels must not
    // inherit a site-wide placeholder override.
    const hero=document.createElement("div");
    hero.className="case-hero-visual";
    hero.innerHTML='<div class="hero-image-brief"><span class="brief-kicker">ILLUSTRATIVE</span></div>';
    const heroImage=document.createElement("section");
    heroImage.className="case-view";
    heroImage.innerHTML='<div class="case-hero-visual"><img alt=""><span class="visual-image-status">ILLUSTRATIVE VISUAL</span></div>';
    const unrelated=document.createElement("span");
    unrelated.className="brief-kicker";
    unrelated.textContent="Outside illustration";
    document.body.append(brief,loading,hero,heroImage,unrelated);
    const noImage=getComputedStyle(brief),withImage=getComputedStyle(loading);
    const heroFrame=heroImage.querySelector(".case-hero-visual");
    const heroStatus=heroImage.querySelector(".visual-image-status");
    const sample={
     briefSurface:noImage.backgroundColor,
     loadingSurface:withImage.backgroundColor,
     imageFrameDisplay:withImage.display,
     imageFrameRatio:withImage.aspectRatio,
     imageFit:getComputedStyle(loading.querySelector("img")).objectFit,
     borderStyle:noImage.borderTopStyle,
     borderColor:noImage.borderTopColor,
     heroKickerInk:getComputedStyle(hero.querySelector(".brief-kicker")).color,
     heroImageFit:getComputedStyle(heroFrame.querySelector("img")).objectFit,
     heroImageSurface:getComputedStyle(heroFrame).backgroundColor,
     heroStatusPosition:getComputedStyle(heroStatus).position,
     heroStatusBottom:getComputedStyle(heroStatus).bottom,
     heroStatusPointerEvents:getComputedStyle(heroStatus).pointerEvents,
     unrelatedKickerInk:getComputedStyle(unrelated).color,
     bodyInk:getComputedStyle(document.body).color
    };
    brief.remove();loading.remove();hero.remove();heroImage.remove();unrelated.remove();
    return sample;
   },theme);
   assert.equal(fallback.borderStyle,"dashed",
    width+"px "+theme+": shared illustrative frame must remain dashed");
   assert.equal(fallback.imageFrameDisplay,"grid",width+"px "+theme+": real-image frame retains grid layout");
   assert.equal(fallback.imageFrameRatio,"4 / 3",width+"px "+theme+": real-image frame retains aspect ratio");
   assert.equal(fallback.imageFit,"cover",width+"px "+theme+": real images retain their cover crop");
   assert.equal(fallback.heroImageFit,"cover",width+"px "+theme+": case-study images retain their cover crop");
   assert.equal(fallback.heroStatusPosition,"absolute",width+"px "+theme+": illustrative image status stays anchored");
   assert.equal(fallback.heroStatusBottom,"12px",width+"px "+theme+": illustrative status keeps its original inset");
   assert.equal(fallback.heroStatusPointerEvents,"none",width+"px "+theme+": illustrative status cannot block image interactions");
   assert.equal(fallback.unrelatedKickerInk,"rgb(154, 50, 99)",
    width+"px "+theme+": unrelated labels must not inherit dark illustrative ink");
   if(theme==="dark"){
    assert.equal(fallback.heroKickerInk,fallback.bodyInk,
     width+"px dark: case-study hero illustrative disclosure retains readable ink");
    assert.equal(fallback.heroImageSurface,fallback.loadingSurface,
     width+"px dark: case-study hero and project frames share the same dark loading paint");
    assert.equal(fallback.briefSurface,fallback.loadingSurface,
     width+"px dark: loading images and illustrative briefs share one fallback surface");
    assert.equal(fallback.borderColor,"rgb(73, 96, 116)",
     width+"px dark: shared illustrative frame retains its night edge");
   }
  }
 }
 await page.evaluate(()=>document.documentElement.dataset.theme="light");
 await page.setViewportSize({width:1280,height:720});

 // Archive CSS now belongs to work-cards.css. Check computed layout and
 // card surfaces in both themes and at desktop/phone widths after extraction.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  const surfaces=[];
  for(const theme of ["light","dark"]){
   const archive=await page.evaluate(async theme=>{
    document.documentElement.dataset.theme=theme;
    // CTA colors transition when the theme changes; sample the settled state.
    await new Promise(resolve=>setTimeout(resolve,260));
    const grid=document.querySelector(".work .featured-projects-grid");
    const card=grid?.querySelector(".featured-project.client-file");
    const process=card?.querySelector(".project-card-process");
    const visual=card?.querySelector(".project-visual");
    const meta=card?.querySelector(".project-meta");
    const link=card?.querySelector(".project-card-link");
    const summary=link?.querySelector(":scope > p:not(.project-card-process)");
    const factValue=card?.querySelector(".project-card-facts dd");
    const eyebrow=card?.querySelector(":scope > .eyebrow");
     const title=card?.querySelector(".project-card h3.archive-project-title");
     // Test actual painted client tabs and CTA ink, not just CSS token presence.
     const rgb=value=>{
      const canvas=document.createElement("canvas");
      canvas.width=canvas.height=1;
      const ctx=canvas.getContext("2d");
      ctx.fillStyle=value;ctx.fillRect(0,0,1,1);
      return [...ctx.getImageData(0,0,1,1).data].slice(0,3);
     };
     const luminance=value=>{
      const [r,g,b]=rgb(value).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
      return .2126*r+.7152*g+.0722*b;
     };
     const contrast=(a,b)=>{
      const [hi,lo]=[luminance(a),luminance(b)].sort((x,y)=>y-x);
      return (hi+.05)/(lo+.05);
     };
     const facts=card?.querySelector(".project-card-facts");
     const cardOrder=link?[...link.children].map(node=>{
      if(node.classList.contains("archive-project-title"))return "title";
      if(node.classList.contains("project-meta"))return "meta";
      if(node.querySelector(".project-card-summary-label"))return "challenge";
      if(node.classList.contains("project-card-facts"))return "facts";
      if(node.classList.contains("project-card-process"))return "approach";
      if(node.classList.contains("project-visual"))return "visual";
      return null;
     }).filter(Boolean):[];
     const factsColumns=facts?getComputedStyle(facts).gridTemplateColumns.trim().split(/\s+/).length:0;
     const clientInk=[...grid.querySelectorAll(".featured-project.client-file")].map(file=>{
      const label=file.querySelector(".client-file-label");
      const cta=file.querySelector(".project-card-cta");
      if(!label||!cta)return null;
      return {
       labelContrast:contrast(getComputedStyle(label).color,getComputedStyle(label).backgroundColor),
       ctaContrast:contrast(getComputedStyle(cta).color,getComputedStyle(file).backgroundColor),
       ctaColor:getComputedStyle(cta).color,
       cardColor:getComputedStyle(file).color,
       cardBackground:getComputedStyle(file).backgroundColor,
       labelColor:getComputedStyle(label).color,
       labelBackground:getComputedStyle(label).backgroundColor
      };
     });
    // A synthetic missing-image Work card stays testable even after real art arrives.
    const probe=document.createElement("div");
    probe.className="featured-project client-file";
    probe.innerHTML='<div class="project-visual"><div class="visual-brief"><span class="brief-kicker">ILLUSTRATIVE BRIEF</span><span>Image needed</span></div></div>';
    grid.append(probe);
    const frame=probe.querySelector(".project-visual");
    const brief=probe.querySelector(".visual-brief");
    const kicker=probe.querySelector(".brief-kicker");
    const placeholder={
     surface:getComputedStyle(frame).backgroundColor,
     borderStyle:getComputedStyle(frame).borderTopStyle,
     borderWidth:getComputedStyle(frame).borderTopWidth,
     briefContrast:contrast(getComputedStyle(brief).color,getComputedStyle(frame).backgroundColor),
     kickerContrast:contrast(getComputedStyle(kicker).color,getComputedStyle(frame).backgroundColor)
    };
    // A supplied-image probe must retain the same frame after its paint
    // moves from the late editorial stylesheet into the Work component.
    const supplied=document.createElement("div");
    supplied.className="featured-project client-file";
    supplied.innerHTML='<div class="project-visual"><img alt=""></div>';
    grid.append(supplied);
    const imageStyle=getComputedStyle(supplied.querySelector(".project-visual"));
    const imageFrame={
     borderStyle:imageStyle.borderTopStyle,
     borderColor:imageStyle.borderTopColor,
     radius:imageStyle.borderTopLeftRadius,
     shadow:imageStyle.boxShadow,
     background:imageStyle.backgroundColor
    };
    supplied.remove();
    probe.remove();
    return {
     placeholder,imageFrame,cardOrder,factsColumns,
     // Inherited ink must not erase distinct muted labels or client CTA accents.
     bodyInk:[title,meta,summary,process,process?.querySelector("strong"),factValue]
      .map(node=>node?getComputedStyle(node).color:null),
     eyebrowInk:eyebrow?getComputedStyle(eyebrow).color:null,
     introEyebrowInk:getComputedStyle(document.querySelector(".work .section-head .eyebrow")).color,
     visualPosition:visual?getComputedStyle(visual).position:null,
     visualOverflow:visual?getComputedStyle(visual).overflow:null,
     metaDisplay:meta?getComputedStyle(meta).display:null,
     linkDisplay:link?getComputedStyle(link).display:null,
     found:!!grid&&!!card&&!!process&&!!title,
     columns:grid?getComputedStyle(grid).gridTemplateColumns.trim().split(" ").filter(Boolean).length:0,
     surface:card?getComputedStyle(card).backgroundColor:null,
     approachVisible:!!process&&getComputedStyle(process).display!=="none",
     processInk:process?getComputedStyle(process).color:null,
     cardInk:card?getComputedStyle(card).color:null,
     factsEdge:facts?getComputedStyle(facts).borderTopColor:null,
     factsBorderStyle:facts?getComputedStyle(facts).borderTopStyle:null,
     focusEdge:card?getComputedStyle(card).getPropertyValue("--focus").trim():null,
     clientInk
    };
   },theme);
   assert.equal(archive.found,true,"Work archive and documented process teaser must render");
   assert.deepEqual(archive.cardOrder,["title","meta","challenge","facts","approach","visual"],
    width+"px "+theme+": role, delivery and approach must precede project imagery");
   assert.equal(archive.factsColumns,2,
    width+"px "+theme+": role and delivery should scan in two columns");
   assert.equal(archive.placeholder.surface,theme==="dark"?"rgb(36, 36, 36)":"rgb(238, 236, 232)",
    width+"px "+theme+": Work placeholder must use neutral editorial paper");
   assert.equal(archive.placeholder.borderStyle,"dashed",
    width+"px "+theme+": missing Work imagery must retain its dashed frame");
   assert.equal(archive.placeholder.borderWidth,"1px",
    width+"px "+theme+": Work briefs retain their compact 1px frame");
   assert.deepEqual({
    borderStyle:archive.imageFrame.borderStyle,
    borderColor:archive.imageFrame.borderColor,
    radius:archive.imageFrame.radius,
    background:archive.imageFrame.background
   },{
    borderStyle:"solid",
    borderColor:theme==="dark"?"rgb(100, 100, 100)":"rgb(183, 181, 177)",
    radius:"2px",
    background:"rgba(0, 0, 0, 0)"
   },width+"px "+theme+": supplied Work imagery retains its neutral editorial frame");
   assert.notEqual(archive.imageFrame.shadow,"none",
    width+"px "+theme+": image frame keeps its inset highlight");
   assert.ok(archive.placeholder.briefContrast>=4.5&&archive.placeholder.kickerContrast>=4.5,
    width+"px "+theme+": placeholder brief and disclosure must meet 4.5:1 contrast");
   assert.equal(archive.columns,width<=760?1:2,"Work archive columns must match viewport width");
   assert.notEqual(archive.surface,"rgba(0, 0, 0, 0)","Archive card must have a solid surface");
   assert.equal(archive.approachVisible,true,"Documented design approach teaser must remain visible");
   assert.equal(archive.visualPosition,"relative","Project preview positioning in "+theme+" at "+width+"px");
   assert.equal(archive.visualOverflow,"hidden","Project preview crop in "+theme+" at "+width+"px");
   assert.equal(archive.metaDisplay,"flex","Project metadata layout in "+theme+" at "+width+"px");
   assert.equal(archive.linkDisplay,"block","Work link geometry in "+theme+" at "+width+"px");
   assert.equal(archive.processInk,archive.cardInk,"Archive process copy must match readable card ink");
   assert.ok(archive.bodyInk.every(color=>color===archive.cardInk),
    width+"px "+theme+": archive title, metadata, challenge, approach and fact values inherit readable theme ink");
   assert.equal(archive.eyebrowInk,archive.introEyebrowInk,
    width+"px "+theme+": file eyebrow retains muted label ink");
   assert.ok(archive.factsEdge&&archive.focusEdge,"Archive facts and focus must retain shared theme colors");
   assert.equal(archive.factsBorderStyle,"solid","Archive evidence divider must remain visible");
   assert.ok(archive.clientInk.length>0&&archive.clientInk.every(Boolean),
    "Every archive file needs a client tab and visible case-study CTA");
   for(const client of archive.clientInk){
    assert.ok(client.labelContrast>=4.5,
     `${width}px ${theme}: client tab must meet 4.5:1 (got ${client.labelContrast.toFixed(2)})`);
    assert.ok(client.ctaContrast>=4.5,
     `${width}px ${theme}: archive CTA must meet 4.5:1 (got ${client.ctaContrast.toFixed(2)}; CTA ${client.ctaColor} on ${client.cardBackground})`);
    assert.notEqual(client.ctaColor,client.cardColor,
     `${width}px ${theme}: CTA must not be flattened to generic card ink`);
   }
   // The more-specific Work dashed brief used to override the shared
   // solid high-contrast edge; verify the accessible state in both themes.
   await page.emulateMedia({contrast:"more"});
   const highContrastBrief=await page.evaluate(()=>{
    const grid=document.querySelector(".work .featured-projects-grid");
    const probe=document.createElement("div");
    probe.className="featured-project client-file";
    probe.innerHTML='<div class="project-visual"><span class="visual-brief">Illustrative brief</span></div>';
    grid.append(probe);
    const style=getComputedStyle(probe.querySelector(".project-visual")).borderTopStyle;
    probe.remove();
    return style;
   });
   assert.equal(highContrastBrief,"solid",
    width+"px "+theme+": Work missing-image edge must be solid at increased contrast");
   await page.emulateMedia({contrast:"no-preference"});
   surfaces.push(archive.surface);
  }
  assert.notEqual(surfaces[0],surfaces[1],"Archive card must adapt to light and dark themes");
 }
 await page.evaluate(()=>document.documentElement.dataset.theme="light");
 await page.setViewportSize({width:1280,height:720});

 // Phone Work intro: keep the UX story readable while revealing projects sooner.
 // These are computed-layout checks, not pixel-level screenshot comparisons.
 for(const width of [320,390,600]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const intro=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const work=document.querySelector("#work");
    const head=work.querySelector(".section-head");
    const title=head.querySelector("h2");
    const copy=work.querySelector(".section-head>p");
    return {
     paddingTop:parseFloat(getComputedStyle(work).paddingTop),
     headGap:parseFloat(getComputedStyle(head).marginBottom),
     titleSize:parseFloat(getComputedStyle(title).fontSize),
     titleHeight:title.getBoundingClientRect().height,
     copyVisible:getComputedStyle(copy).display!=="none",
     overflow:document.documentElement.scrollWidth>innerWidth+2
    };
   },theme);
   assert.ok(intro.paddingTop>=34&&intro.paddingTop<=48,
    `${width}px ${theme}: Work top spacing should be compact on phones`);
   assert.ok(intro.headGap>=20&&intro.headGap<=28,
    `${width}px ${theme}: First project should follow the Work introduction closely`);
   assert.ok(intro.titleSize>=31.9&&intro.titleSize<=38.1&&intro.titleHeight<175,
    `${width}px ${theme}: Work title should be legible without dominating the viewport`);
   assert.ok(intro.copyVisible&&!intro.overflow,
    `${width}px ${theme}: UX-process intro must remain readable without horizontal overflow`);
  }
 }
 await page.evaluate(()=>document.documentElement.dataset.theme="light");
 await page.setViewportSize({width:1280,height:720});

 // Pass 12: high contrast must suppress folder shadows even under the
 // stronger :hover/:focus-within selectors. Verify both themes and layouts,
 // then ensure ordinary themes still retain their tactile card shadow.
 const contrastCardsPage=await browser.newPage();
 contrastCardsPage.on("pageerror",error=>errors.push(error.message));
 await contrastCardsPage.goto(origin+"/");
 const contrastCard=contrastCardsPage.locator(".work .featured-project.client-file").first();
 for(const width of [390,1280]){
  await contrastCardsPage.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   await contrastCardsPage.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
   await contrastCardsPage.mouse.move(0,0);
   await contrastCardsPage.emulateMedia({contrast:"no-preference"});
   const normal=await contrastCard.evaluate(node=>getComputedStyle(node).boxShadow);
   assert.notEqual(normal,"none",width+"px "+theme+": normal tactile file shadow remains");
   await contrastCardsPage.emulateMedia({contrast:"more"});
   const assertCardEdge=async(state)=>{
    // Media switches can transition the previous shadow for 250ms. Finish
    // CSS transitions before measuring the settled high-contrast surface.
    const value=await contrastCard.evaluate(node=>{
     void getComputedStyle(node).boxShadow;
     for(const animation of node.getAnimations()){
      if(animation.playState==="running")animation.finish();
     }
     const css=getComputedStyle(node);
     return {shadow:css.boxShadow,left:css.borderLeftWidth,right:css.borderRightWidth};
    });
    assert.equal(value.shadow,"none",width+"px "+theme+" "+state+": contrast mode has no decorative shadow");
    assert.equal(value.left,"2px",width+"px "+theme+" "+state+": strong left edge");
    assert.equal(value.right,"2px",width+"px "+theme+" "+state+": strong right edge");
   };
   await assertCardEdge("rest");
   await contrastCard.hover();
   await assertCardEdge("hover");
   await contrastCardsPage.mouse.move(0,0);
   await contrastCard.locator(".project-card-link").first().focus();
   assert.equal(await contrastCard.evaluate(node=>node.matches(":focus-within")),true,
    width+"px "+theme+": archive card should receive child focus");
   await assertCardEdge("keyboard focus");
   await contrastCardsPage.evaluate(()=>document.activeElement?.blur());
  }
 }
 await contrastCardsPage.close();

 // Pass 13: forced-colors is a system palette mode, not merely a
 // prefers-contrast setting. Real keyboard targets need system Highlight,
 // and editorial missing-image frames need distinguishable solid edges.
 const forcedPage=await browser.newPage();
 forcedPage.on("pageerror",error=>errors.push(error.message));
 await forcedPage.emulateMedia({forcedColors:"active"});
 await forcedPage.goto(origin+"/");
 const systemHighlight=await forcedPage.evaluate(()=>{
  const probe=document.createElement("span");
  probe.style.color="Highlight";
  document.body.append(probe);
  const color=getComputedStyle(probe).color;
  probe.remove();
  return color;
 });
 assert.ok(await forcedPage.evaluate(()=>matchMedia("(forced-colors: active)").matches),
  "Chromium must actually emulate forced colors before asserting system ink");
 const checkRing=async(locator,label)=>{
  await locator.focus();
  await forcedPage.keyboard.press("Tab");
  await forcedPage.keyboard.press("Shift+Tab");
  const result=await locator.evaluate(node=>{
   const style=getComputedStyle(node);
   return {
    focused:document.activeElement===node,
    keyboard:node.matches(":focus-visible"),
    style:style.outlineStyle,
    color:style.outlineColor,
    width:parseFloat(style.outlineWidth)
   };
  });
  assert.equal(result.focused,true,label+": keyboard returns to target");
  assert.equal(result.keyboard,true,label+": focus-visible is active");
  assert.equal(result.style,"solid",label+": visible outline is solid");
  assert.ok(result.width>=3,label+": focus ring stays at least 3px");
  assert.equal(result.color,systemHighlight,label+": outline uses system Highlight");
 };
 for(const width of [390,1280]){
  await forcedPage.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   await forcedPage.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   await checkRing(forcedPage.locator(".work .client-file .project-card-link").first(),
    width+"px "+theme+" Work link");
   const focusFile=await forcedPage.locator(".work .featured-project.client-file").first()
    .evaluate(node=>{
     const style=getComputedStyle(node);
     return {focused:node.matches(":focus-within"),outline:style.outlineColor,
      width:parseFloat(style.outlineWidth)};
    });
   assert.equal(focusFile.focused,true,width+"px "+theme+": focused file keeps focus-within");
   assert.equal(focusFile.outline,systemHighlight,width+"px "+theme+": archive file uses Highlight");
   assert.ok(focusFile.width>=2,width+"px "+theme+": file focus outline remains visible");
   await checkRing(forcedPage.locator("#play-grid .project-card-link").first(),
    width+"px "+theme+" After Hours link");
   const edges=await forcedPage.evaluate(()=>{
    const work=document.querySelector(".work .featured-project.client-file");
    const play=document.querySelector(".playground");
    const a=document.createElement("div"),b=document.createElement("div");
    a.className=b.className="project-visual";
    work.append(a);play.append(b);
    const result={work:getComputedStyle(a).borderTopStyle,
     playground:getComputedStyle(b).borderTopStyle};
    a.remove();b.remove();
    return result;
   });
   assert.equal(edges.work,"solid",width+"px "+theme+": Work illustrative frame is solid");
   assert.equal(edges.playground,"solid",width+"px "+theme+": After Hours illustrative frame is solid");
  }
 }
 await forcedPage.goto(origin+"/case-studies/hoylu/connected-planning/");
 await forcedPage.locator(".case-view .case-head").waitFor();
 for(const width of [390,1280]){
  await forcedPage.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   await forcedPage.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   await checkRing(forcedPage.locator(".case-back"),width+"px "+theme+" Back link");
   await checkRing(forcedPage.locator(".case-next-nav .case-next").first(),
    width+"px "+theme+" Next navigation link");
   await checkRing(forcedPage.locator(".case-section-links button").first(),
    width+"px "+theme+" chapter control");
   const selection=await forcedPage.locator(".case-section-links button[aria-current='location']")
    .first().evaluate(node=>getComputedStyle(node).borderTopColor);
   assert.equal(selection,systemHighlight,width+"px "+theme+": current chapter uses system Highlight");
  }
 }
 await forcedPage.close();

 // Pass 14: stress real components with long, unbroken editor-supplied
 // labels and 200% root text size. A clipped page can conceal the problem,
 // so inspect each element's scroll box and actual rendered bounds.
 const reflowPage=await browser.newPage();
 reflowPage.on("pageerror",error=>errors.push(error.message));
 await reflowPage.goto(origin+"/");
 const longToken="ProductStrategyAndEnterpriseWorkflowArchitecture".repeat(5);
 await reflowPage.evaluate(token=>{
  document.querySelector(".work .client-file .archive-project-title").textContent=token;
 },longToken);
 const measureNode=selector=>reflowPage.locator(selector).first().evaluate(node=>{
  const box=node.getBoundingClientRect();
  return {client:node.clientWidth,scroll:node.scrollWidth,
   left:box.left,right:box.right,height:box.height,viewport:innerWidth};
 });
 const checkBox=(data,label)=>{
  assert.ok(data.client>0,label+": element has a usable reading width");
  assert.ok(data.scroll<=data.client+2,
   label+": no text should overflow its own scroll box ("+data.scroll+"/"+data.client+")");
  assert.ok(data.left>=-2&&data.right<=data.viewport+2,
   label+": element must remain within the viewport");
  assert.ok(data.height>0,label+": text remains rendered");
 };
 for(const width of [320,390,760,1280]){
  await reflowPage.setViewportSize({width,height:844});
  for(const scale of [100,200]){
   for(const theme of ["light","dark"]){
    await reflowPage.evaluate(({scale,theme})=>{
     document.documentElement.dataset.theme=theme;
     document.documentElement.style.fontSize=scale+"%";
    },{scale,theme});
    checkBox(await measureNode(".work .client-file .archive-project-title"),
     width+"px "+scale+"% text "+theme+" Work title");
   }
  }
 }
 await reflowPage.goto(origin+"/case-studies/hoylu/connected-planning/");
 await reflowPage.locator(".case-view .case-approach").waitFor();
 await reflowPage.evaluate(token=>{
  document.querySelector(".case-head h1").textContent=token;
  document.querySelector(".case-approach-label").textContent=token;
  document.querySelector(".case-approach-text").textContent=token;
  document.querySelector(".case-next-nav .case-next:last-child").textContent="Next: "+token;
 },longToken);
 for(const width of [320,390,760,1280]){
  await reflowPage.setViewportSize({width,height:844});
  for(const scale of [100,200]){
   for(const theme of ["light","dark"]){
    await reflowPage.evaluate(({scale,theme})=>{
     document.documentElement.dataset.theme=theme;
     document.documentElement.style.fontSize=scale+"%";
    },{scale,theme});
    for(const [selector,name] of [
     [".case-head h1","case-study heading"],
     [".case-approach-label","approach kicker"],
     [".case-approach-text","approach reasoning"],
     [".case-next-nav .case-next:last-child","next case-study link"]]){
     checkBox(await measureNode(selector),width+"px "+scale+"% text "+theme+" "+name);
    }
    const cols=await reflowPage.evaluate(()=>{
     const label=document.querySelector(".case-approach-label");
     const copy=document.querySelector(".case-approach-text");
     const section=document.querySelector(".case-approach");
     const a=label.getBoundingClientRect(),b=copy.getBoundingClientRect(),c=section.getBoundingClientRect();
     return {labelRight:a.right,textLeft:b.left,sectionRight:c.right,textWidth:b.width};
    });
    assert.ok(cols.textWidth>40,width+"px "+scale+"% "+theme+": explanation keeps a reading column");
    if(width>600)assert.ok(cols.textLeft>=cols.labelRight-2,
     width+"px "+scale+"% "+theme+": long kicker cannot collide with explanation");
    assert.ok(cols.sectionRight<=width+2,
     width+"px "+scale+"% "+theme+": approach panel does not escape the viewport");
   }
  }
 }
 await reflowPage.close();

 // Reduced-motion visitors must not receive Playground preview or case entrance motion.
 const reducedMotionPage=await browser.newPage({reducedMotion:"reduce"});
 reducedMotionPage.on("pageerror",error=>errors.push(error.message));
 await reducedMotionPage.goto(origin+"/");
 const previewTransition=await reducedMotionPage.locator("#play-grid .project-card-link .project-visual").first()
  .evaluate(node=>getComputedStyle(node).transitionProperty);
 assert.equal(previewTransition,"none","Playground preview must not animate under reduced motion");
 // A color reveal can remain useful without a half-second transition.
 // Preserve grayscale treatment but remove motion on the hero portrait.
 for(const theme of ["light","dark"]){
  const portraitMotion=await reducedMotionPage.evaluate(value=>{
   document.documentElement.dataset.theme=value;
   const portrait=document.querySelector(".hero .hero-portrait-art");
   const style=getComputedStyle(portrait);
   return {transition:style.transitionProperty,filter:style.filter};
  },theme);
  assert.equal(portraitMotion.transition,"none",theme+": reduced-motion portrait reveal is instantaneous");
  assert.match(portraitMotion.filter,/grayscale/,theme+": editorial portrait treatment remains");
 }
 // Pass 22: switch the OS preference while a real Work/After Hours link
 // is hovered or keyboard-focused. Motion must stop without a page reload;
 // opting back in restores the authored arrow movement and focus ring.
 for(const width of [390,1280]){
  await reducedMotionPage.setViewportSize({width,height:900});
  for(const theme of ["light","dark"]){
   await reducedMotionPage.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   for(const selector of [".work .project-card-link","#play-grid .project-card-link"]){
    const link=reducedMotionPage.locator(selector).first();
    const checkStationary=async(state)=>{
     // Media emulation updates styles before the next paint. Allow two frames
     // for the global 0.01ms transition safeguard to finish before sampling.
     await reducedMotionPage.evaluate(()=>new Promise(done=>
      requestAnimationFrame(()=>requestAnimationFrame(done))));
     const values=await link.evaluate(node=>{
      const arrow=node.querySelector(".project-meta span:last-child");
      const preview=node.querySelector(".project-visual");
      const file=node.closest(".client-file");
      const label=file?.querySelector(".client-file-label");
      return {
       transforms:[node,arrow,preview,file,label].filter(Boolean)
        .map(el=>getComputedStyle(el).transform),
       transitions:[node,arrow,node.closest(".play-grid")?preview:null,label].filter(Boolean)
        .map(el=>getComputedStyle(el).transitionProperty)
      };
     });
     const context=width+"px "+theme+" "+selector+" "+state;
     assert.ok(values.transforms.every(value=>value==="none"),context+": reduced motion keeps every preview layer still "+JSON.stringify(values));
     assert.ok(values.transitions.every(value=>value==="none"),context+": reduced motion disables preview transitions "+JSON.stringify(values));
    };
    const waitForArrow=async(y)=>{
     await reducedMotionPage.waitForFunction(({selector,y})=>{
      const arrow=document.querySelector(selector+" .project-meta span:last-child");
      const transform=new DOMMatrixReadOnly(getComputedStyle(arrow).transform);
      return Math.abs(transform.m41-4)<0.01&&Math.abs(transform.m42-y)<0.01;
     },{selector,y});
    };
    await reducedMotionPage.emulateMedia({reducedMotion:"no-preference"});
    await link.hover();
    await waitForArrow(-3);
    await reducedMotionPage.emulateMedia({reducedMotion:"reduce"});
    await checkStationary("hover");

    await reducedMotionPage.mouse.move(0,0);
    await link.focus();
    await reducedMotionPage.keyboard.press("Tab");
    await reducedMotionPage.keyboard.press("Shift+Tab");
    await reducedMotionPage.emulateMedia({reducedMotion:"no-preference"});
    await waitForArrow(-4);
    await reducedMotionPage.emulateMedia({reducedMotion:"reduce"});
    await checkStationary("keyboard focus");
    const focus=await link.evaluate(node=>({visible:node.matches(":focus-visible"),
     outline:getComputedStyle(node).outlineStyle,width:parseFloat(getComputedStyle(node).outlineWidth)}));
    assert.ok(focus.visible&&focus.outline==="solid"&&focus.width>=3,
     width+"px "+theme+" "+selector+": static feedback keeps its keyboard focus ring");
   }
  }
 }

 // A synthetic project preview verifies the shared image rule even when all
 // authored project art is intentionally represented by placeholders.
 const reducedImageTransition=await reducedMotionPage.evaluate(()=>{
  const card=document.createElement("div");card.className="project-card";
  card.innerHTML='<a class="project-card-link" href="#work"><div class="project-visual"><img alt=""></div></a>';
  document.body.append(card);
  card.querySelector("a").focus();
  const image=card.querySelector("img");
  const value={transition:getComputedStyle(image).transitionProperty,transform:getComputedStyle(image).transform};
  card.remove();return value;
 });
 assert.equal(reducedImageTransition.transition,"none","Project image zoom must honor reduced motion");
 assert.equal(reducedImageTransition.transform,"none","Project image must not zoom on reduced-motion focus");

 await reducedMotionPage.goto(origin+"/case-studies/hoylu/connected-planning/");
 await reducedMotionPage.locator(".case-view .case-head").waitFor();
 const caseAnimation=await reducedMotionPage.locator(".case-view .case-head")
  .evaluate(node=>getComputedStyle(node).animationName);
 assert.equal(caseAnimation,"none","Case-study entrance must not animate under reduced motion");
 // Pass 9: the consolidated case-study reduced-motion block must also
 // disable chapter strip scrolling and tab transitions in both themes.
 for(const theme of ["light","dark"]){
  await reducedMotionPage.evaluate(value=>document.documentElement.dataset.theme=value,theme);
  const navMotion=await reducedMotionPage.evaluate(()=>{
   const strip=document.querySelector(".case-view .case-section-links");
   const button=strip.querySelector("button");
   const cover=document.querySelector(".case-view .case-hero-visual");
   const body=document.querySelector(".case-view .case-body");
   const gallery=document.querySelector(".case-view .case-gallery");
   return {
    scroll:getComputedStyle(strip).scrollBehavior,
    buttonTransition:getComputedStyle(button).transitionProperty,
    coverAnimation:getComputedStyle(cover).animationName,
    bodyAnimation:getComputedStyle(body).animationName,
    galleryAnimation:getComputedStyle(gallery).animationName
   };
  });
  assert.equal(navMotion.scroll,"auto",theme+": reduced-motion chapter strip must not smooth-scroll");
  assert.equal(navMotion.buttonTransition,"none",theme+": reduced-motion chapter buttons have no transition");
  for(const key of ["coverAnimation","bodyAnimation","galleryAnimation"]){
   assert.equal(navMotion[key],"none",theme+": routed case "+key+" must remain stationary");
  }
 }

 await reducedMotionPage.close();

 // Pass 11: skip decorative rings when route management focuses static
 // headings/containers, but retain visible keyboard rings on actual actions.
 // Use a separate page so test focus state cannot affect router assertions.
 const focusPage=await browser.newPage();
 focusPage.on("pageerror",error=>errors.push(error.message));
 await focusPage.goto(origin+"/");
 await focusPage.locator(".work .project-card-link").first().waitFor();
 const inspectFocus=async(selector)=>{
  return await focusPage.locator(selector).first().evaluate(node=>{
   const style=getComputedStyle(node);
   return {
    focused:document.activeElement===node,
    keyboardVisible:node.matches(":focus-visible"),
    outlineStyle:style.outlineStyle,
    outlineWidth:parseFloat(style.outlineWidth),
    shadow:style.boxShadow
   };
  });
 };
 for(const width of [320,390,1280]){
  await focusPage.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const heading=await focusPage.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const target=document.getElementById("work-title");
    target.tabIndex=-1;
    target.focus({preventScroll:true});
    const style=getComputedStyle(target);
    return {focused:document.activeElement===target,tabIndex:target.tabIndex,
     outline:style.outlineStyle,shadow:style.boxShadow};
   },theme);
   assert.equal(heading.focused,true,width+"px "+theme+": Work heading receives route focus");
   assert.equal(heading.tabIndex,-1,width+"px "+theme+": Work heading remains out of normal tab order");
   assert.equal(heading.outline,"none",width+"px "+theme+": static heading has no decorative ring");
   assert.equal(heading.shadow,"none",width+"px "+theme+": static heading has no focus shadow");
   await focusPage.locator(".work .project-card-link").first().focus();
   await focusPage.keyboard.press("Tab");
   await focusPage.keyboard.press("Shift+Tab");
   const link=await inspectFocus(".work .project-card-link");
   assert.equal(link.focused,true,width+"px "+theme+": keyboard returns to first Work link");
   assert.equal(link.keyboardVisible,true,width+"px "+theme+": Work link is focus-visible");
   assert.equal(link.outlineStyle,"solid",width+"px "+theme+": Work link has a solid focus ring");
   assert.ok(link.outlineWidth>=3,width+"px "+theme+": Work link focus ring remains at least 3px");
  }
 }
 await focusPage.goto(origin+"/case-studies/hoylu/connected-planning/");
 await focusPage.locator(".case-view .case-head").waitFor();
 for(const width of [390,1280]){
  await focusPage.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const wrapper=await focusPage.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const target=document.querySelector(".case-view");
    target.focus({preventScroll:true});
    const style=getComputedStyle(target);
    return {focused:document.activeElement===target,tabIndex:target.tabIndex,
     outline:style.outlineStyle,shadow:style.boxShadow};
   },theme);
   assert.equal(wrapper.focused,true,width+"px "+theme+": case wrapper receives route focus");
   assert.equal(wrapper.tabIndex,-1,width+"px "+theme+": case wrapper stays outside tab order");
   assert.equal(wrapper.outline,"none",width+"px "+theme+": case wrapper has no decorative ring");
   assert.equal(wrapper.shadow,"none",width+"px "+theme+": case wrapper has no focus shadow");
   for(const selector of [".case-back",".case-section-links button"]){
    await focusPage.locator(selector).first().focus();
    await focusPage.keyboard.press("Tab");
    await focusPage.keyboard.press("Shift+Tab");
    const action=await inspectFocus(selector);
    assert.equal(action.focused,true,width+"px "+theme+": keyboard returns to "+selector);
    assert.equal(action.keyboardVisible,true,width+"px "+theme+": "+selector+" is focus-visible");
    assert.equal(action.outlineStyle,"solid",width+"px "+theme+": "+selector+" retains a visible ring");
    assert.ok(action.outlineWidth>=3,width+"px "+theme+": "+selector+" retains a 3px ring");
   }
  }
 }
 await focusPage.close();

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
 // Pass 19: the original PNG remains the same-photo fallback; supporting
 // browsers select the 1024px WebP without an unnecessary 4.57 MB PNG fetch.
 const delivered=await aboutHeadshot.evaluate(img=>({
  src:new URL(img.currentSrc).pathname,
  original:img.getAttribute("src"),
  naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,
  width:img.getAttribute("width"),height:img.getAttribute("height"),
  lazy:img.loading,decoding:img.decoding
 }));
 assert.equal(delivered.src,"/headshot-lauren-leven-1024.webp",
  "Chromium should decode the actual smaller WebP source in About");
 assert.equal(delivered.original,"/Headshot%20Lauren%20Leven.png",
  "Original photo remains as the fallback source");
 assert.equal(delivered.naturalWidth,1024,"Optimized image has 1024 source pixels");
 assert.equal(delivered.naturalHeight,1024,"Optimized image keeps square source crop");
 assert.equal(delivered.width,"2000","Fallback photo intrinsic width remains reserved");
 assert.equal(delivered.height,"2000","Fallback photo intrinsic height remains reserved");
 assert.equal(delivered.lazy,"lazy","About headshot remains lazy");
 assert.equal(delivered.decoding,"async","About headshot keeps async decoding");

 // Hold the WebP response to check whether the picture/image has a stable
 // reserved box BEFORE any bytes arrive; then compare the same element after
 // the response. This checks actual layout-shift resistance on phone/desktop.
 for(const width of [390,1280]){
  const imagePage=await browser.newPage({viewport:{width,height:844}});
  imagePage.on("pageerror",error=>errors.push(error.message));
  let releaseImage;
  let resolvePending;
  const paused=new Promise(resolve=>{resolvePending=resolve});
  let pngRequests=0,webpRequests=0;
  imagePage.on("request",request=>{
   const path=new URL(request.url()).pathname;
   if(path==="/Headshot%20Lauren%20Leven.png")pngRequests++;
   if(path==="/headshot-lauren-leven-1024.webp")webpRequests++;
  });
  await imagePage.route("**/headshot-lauren-leven-1024.webp",route=>{
   releaseImage=()=>route.continue();
   resolvePending();
  });
  await imagePage.goto(origin+"/");
  await imagePage.locator(".about-portrait").scrollIntoViewIfNeeded();
  await paused;
  const measure=()=>imagePage.locator(".about-portrait img").evaluate(img=>{
   const rect=img.getBoundingClientRect();
   return {
    width:rect.width,height:rect.height,naturalWidth:img.naturalWidth,
    ratio:rect.height/rect.width,
    actual:img.currentSrc?new URL(img.currentSrc).pathname:null,
    picture:getComputedStyle(img.parentElement).display
   };
  });
  const before=await measure();
  const expectedRatio=width<=600?1.25:1;
  assert.ok(before.width>=100,width+"px: image reserves a visible width before loading");
  assert.ok(Math.abs(before.ratio-expectedRatio)<0.03,
   width+"px: image reserves the authored phone crop or desktop square before loading");
  assert.equal(before.naturalWidth,0,width+"px: image bytes are still held back");
  assert.equal(before.picture,"block",width+"px: picture wrapper does not add inline line-box");
  await releaseImage();
  await imagePage.waitForFunction(()=>document.querySelector(".about-portrait img")?.naturalWidth>0);
  const after=await measure();
  assert.equal(after.actual,"/headshot-lauren-leven-1024.webp",
   width+"px: WebP source replaces full-size PNG request");
  assert.ok(Math.abs(after.width-before.width)<1&&Math.abs(after.height-before.height)<1,
   width+"px: image geometry stays stable when the lazy image finishes loading");
  assert.equal(webpRequests,1,width+"px: exactly one optimized image request");
  assert.equal(pngRequests,0,width+"px: browser does not download PNG in parallel");
  await imagePage.close();
 }



 // Pass 6: the editorial skin must not force heading colors or hero panel
 // paint with !important. Measure the resulting values at both sides of the
 // phone/tablet/desktop breakpoints, in each page theme.
 for(const width of [320,390,600,601,950,1024,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const paint=await page.evaluate(value=>{
    document.documentElement.dataset.theme=value;
    const read=selector=>getComputedStyle(document.querySelector(selector));
    const h1=read(".hero h1"),em=read(".hero h1 em");
    const workH2=read(".work .section-head h2"),workEm=read(".work .section-head h2 em");
    const aboutH2=read(".about h2"),aboutEm=read(".about h2 em");
    const feature=read(".hero .hero-feature"),art=read(".hero .feature-art");
    return {
     titleInk:h1.color,emphasisInk:em.color,emphasisStyle:em.fontStyle,
     workInk:workH2.color,workEmInk:workEm.color,workEmStyle:workEm.fontStyle,
     aboutInk:aboutH2.color,aboutEmInk:aboutEm.color,aboutEmStyle:aboutEm.fontStyle,
     featurePaint:feature.backgroundColor,featureShadow:feature.boxShadow,
     artPaint:art.backgroundColor,artShadow:art.boxShadow
    };
   },theme);
   assert.equal(paint.titleInk,theme==="dark"?"rgb(241, 240, 236)":"rgb(23, 23, 23)",
    width+"px "+theme+": hero headline follows theme ink");
   assert.equal(paint.emphasisInk,theme==="dark"?"rgb(222, 222, 222)":paint.titleInk,
    width+"px "+theme+": hero emphasis keeps its pre-refactor neutral contrast");
   assert.equal(paint.emphasisStyle,theme==="dark"?"italic":"normal",
    width+"px "+theme+": hero emphasis preserves editorial type treatment");
   assert.equal(paint.workEmInk,paint.workInk,
    width+"px "+theme+": Work section emphasis inherits its parent color");
   assert.equal(paint.aboutEmInk,paint.aboutInk,
    width+"px "+theme+": About section emphasis inherits its parent color");
   assert.equal(paint.workEmStyle,"italic",width+"px "+theme+": Work section emphasis remains italic");
   assert.equal(paint.aboutEmStyle,"italic",width+"px "+theme+": About section emphasis remains italic");
   for(const key of ["featurePaint","artPaint"]){
    assert.equal(paint[key],"rgba(0, 0, 0, 0)",
     width+"px "+theme+": unframed hero surface "+key+" stays transparent");
   }
   for(const key of ["featureShadow","artShadow"]){
    assert.equal(paint[key],"none",
     width+"px "+theme+": hero surface "+key+" stays unframed");
   }
  }
 }

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
     actionPadding:getComputedStyle(document.querySelector('.hero-actions .primary-link')).padding,
     actionDirection:getComputedStyle(document.querySelector('.hero-actions')).flexDirection,
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
   assert.equal(hero.actionPadding,'14px 20px',
    `${width}px ${theme}: Phone CTA retains its intended inset after legacy cleanup`);
   assert.equal(hero.actionDirection,'column',
    `${width}px ${theme}: Phone action stack retains its intended direction`);
   assert.ok(hero.illustrationBottom<844,
    `${width}px ${theme}: Portrait should be visible within the first phone viewport`);
   assert.equal(hero.overflow,false,
    `${width}px ${theme}: Hero must not introduce horizontal scrolling`);
  }
 }

 // Pass 5: phone hero layout must not depend on !important to win the
 // cascade. Test computed geometry/visibility in both themes, including
 // the 600px boundary where the phone composition still applies.
 for(const width of [320,390,600]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const phone=await page.evaluate(selected=>{
    document.documentElement.dataset.theme=selected;
    const feature=document.querySelector(".hero .hero-feature");
    const art=document.querySelector(".hero .feature-art");
    const featureStyle=getComputedStyle(feature),artStyle=getComputedStyle(art);
    const visible=selector=>getComputedStyle(document.querySelector(selector)).display;
    return {
     featureMinHeight:featureStyle.minHeight,
     featureHeight:feature.getBoundingClientRect().height,
     featurePadding:featureStyle.padding,
     featureBorder:featureStyle.borderTopWidth,
     featureShadow:featureStyle.boxShadow,
     featureBackground:featureStyle.backgroundColor,
     artInset:[artStyle.top,artStyle.right,artStyle.bottom,artStyle.left],
     artTransform:artStyle.transform,artFilter:artStyle.filter,
     featureTop:visible(".hero .feature-top"),
     artOrbit:visible(".hero .art-orbit"),
     note:visible(".hero .notebook-hero-note"),
     foot:visible(".hero .hero-foot"),
     quietLink:visible(".hero .hero-actions .quiet-link")
    };
   },theme);
   assert.equal(phone.featureMinHeight,"0px",width+"px "+theme+": hero panel must not impose old minimum height");
   assert.ok(Math.abs(phone.featureHeight-Math.min(300,Math.max(225,width*.61)))<2,
    width+"px "+theme+": portrait panel must use the authored responsive height");
   assert.equal(phone.featurePadding,"0px",width+"px "+theme+": phone portrait panel has no card padding");
   assert.equal(phone.featureBorder,"0px",width+"px "+theme+": phone portrait panel has no frame");
   assert.equal(phone.featureShadow,"none",width+"px "+theme+": phone portrait panel has no shadow");
   assert.equal(phone.featureBackground,"rgba(0, 0, 0, 0)",width+"px "+theme+": portrait background remains transparent");
   assert.deepEqual(phone.artInset,["0px","0px","0px","0px"],width+"px "+theme+": art fills portrait panel");
   assert.equal(phone.artTransform,"none",width+"px "+theme+": art wrapper has no rotation");
   assert.equal(phone.artFilter,"none",width+"px "+theme+": art wrapper has no filter");
   for(const key of ["featureTop","artOrbit","note","foot","quietLink"]){
    assert.equal(phone[key],"none",width+"px "+theme+": decorative or secondary element "+key+" must stay hidden");
   }
  }
 }

 // Phone header: DOM and visual order must agree, without crowded controls.
 for(const width of [320,390,650]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const layout=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const q=selector=>document.querySelector(selector).getBoundingClientRect();
    const nav=q(".site-header nav"),contact=q(".site-header .header-contact"),toggle=q(".site-header .theme-toggle");
    return {
     navBottom:nav.bottom,contactTop:contact.top,toggleTop:toggle.top,
     contactHeight:contact.height,toggleHeight:toggle.height,
     navRight:nav.right,headerBottom:q(".site-header").bottom,
     linkHeights:[...document.querySelectorAll(".site-header nav a")].map(link=>link.getBoundingClientRect().height),
     scrollPadding:parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
     overflow:document.documentElement.scrollWidth>innerWidth+2
    };
   },theme);
   assert.ok(layout.navBottom<=layout.contactTop+2,`${width}px ${theme}: nav must visually precede Contact`);
   assert.ok(Math.abs(layout.contactTop-layout.toggleTop)<=2,`${width}px ${theme}: Contact and theme share row two`);
   assert.ok(layout.linkHeights.every(h=>h>=44)&&layout.contactHeight>=44&&layout.toggleHeight>=44,
    `${width}px ${theme}: navigation targets must be at least 44px high`);
   assert.ok(layout.navRight<=width+1&&!layout.overflow,`${width}px ${theme}: header must not overflow`);
   assert.ok(layout.scrollPadding>=layout.headerBottom+8,`${width}px ${theme}: anchors must clear sticky header`);
  }
 }

 // Pass 15: phone nav must reflow at 200% text size without overlap, clip
 // or an out-of-date sticky-header offset. Compare its actual rectangles.
 const headerReflowPage=await browser.newPage();
 headerReflowPage.on("pageerror",error=>errors.push(error.message));
 await headerReflowPage.goto(origin+"/");
 const syncHeader=async()=>headerReflowPage.waitForFunction(()=>{
  const header=document.querySelector(".site-header");
  const token=parseFloat(getComputedStyle(document.documentElement)
   .getPropertyValue("--mobile-site-header-height"));
  return Number.isFinite(token)&&Math.abs(token-Math.ceil(header.getBoundingClientRect().height))<=1;
 });
 for(const width of [320,390,650]){
  await headerReflowPage.setViewportSize({width,height:844});
  for(const scale of [100,200,100]){
   for(const theme of ["light","dark"]){
    await headerReflowPage.evaluate(({scale,theme})=>{
     document.documentElement.dataset.theme=theme;
     document.documentElement.style.fontSize=scale+"%";
    },{scale,theme});
    await syncHeader();
    const m=await headerReflowPage.evaluate(()=>{
     const box=sel=>document.querySelector(sel).getBoundingClientRect();
     const nav=box(".site-header nav"),header=box(".site-header");
     const contact=box(".header-contact"),toggle=box(".theme-toggle");
     const links=[...document.querySelectorAll(".site-header nav a")].map(x=>{
      const r=x.getBoundingClientRect();
      return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,
       width:r.width,height:r.height,client:x.clientWidth,scroll:x.scrollWidth};
     });
     return {headerHeight:header.height,navRight:nav.right,navBottom:nav.bottom,
      contactTop:contact.top,toggleTop:toggle.top,
      contactHeight:contact.height,toggleHeight:toggle.height,links,
      navScroll:document.querySelector(".site-header nav").scrollWidth,
      navClient:document.querySelector(".site-header nav").clientWidth,
      scrollPadding:parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop),
      pageOverflow:document.documentElement.scrollWidth-innerWidth};
    });
    const at=width+"px "+scale+"% text "+theme;
    assert.ok(m.pageOverflow<=2&&m.navScroll<=m.navClient+2&&m.navRight<=width+2,
     at+": header and nav have no horizontal overflow");
    assert.ok(m.navBottom<=m.contactTop+2&&Math.abs(m.contactTop-m.toggleTop)<=2,
     at+": links precede Contact and theme row");
    assert.ok(m.contactHeight>=44&&m.toggleHeight>=44,at+": controls retain 44px targets");
    assert.ok(m.scrollPadding>=m.headerHeight+8,at+": scroll offset clears full sticky header");
    for(const [i,link] of m.links.entries()){
     assert.ok(link.height>=44&&link.width>=24&&link.left>=-2&&link.right<=width+2,
      at+": nav link "+i+" stays onscreen and touch-friendly");
     assert.ok(link.scroll<=link.client+2,at+": nav label "+i+" isn't clipped");
     for(let j=0;j<i;j++){
      const other=m.links[j],dx=Math.min(link.right,other.right)-Math.max(link.left,other.left);
      const dy=Math.min(link.bottom,other.bottom)-Math.max(link.top,other.top);
      assert.ok(dx<=1||dy<=1,at+": nav links "+j+" and "+i+" cannot overlap");
     }
    }
   }
  }
 }
 await headerReflowPage.setViewportSize({width:320,height:844});
 await headerReflowPage.evaluate(()=>{
  document.documentElement.dataset.theme="light";
  document.documentElement.style.fontSize="200%";
 });
 await syncHeader();
 for(const selector of ['.site-header nav a[href="/#work"]',
  '.site-header nav a[href="/#playground"]','.site-header nav a[href="/#about"]',
  '.site-header .header-contact','.site-header .theme-toggle']){
  const control=headerReflowPage.locator(selector);
  await control.focus();
  await headerReflowPage.keyboard.press("Tab");
  await headerReflowPage.keyboard.press("Shift+Tab");
  const state=await control.evaluate(node=>{
   const css=getComputedStyle(node);
   return {focused:document.activeElement===node,visible:node.matches(":focus-visible"),
    outline:css.outlineStyle,width:parseFloat(css.outlineWidth)};
  });
  assert.equal(state.focused,true,selector+": keyboard returns to control at 200%");
  assert.equal(state.visible,true,selector+": focus-visible stays active at 200%");
  assert.equal(state.outline,"solid",selector+": focus ring stays solid at 200%");
  assert.ok(state.width>=3,selector+": focus outline remains at least 3px");
 }
 await headerReflowPage.goto(origin+"/case-studies/hoylu/connected-planning/");
 await headerReflowPage.locator(".case-section-links").waitFor();
 for(const width of [320,390,650]){
  await headerReflowPage.setViewportSize({width,height:844});
  for(const scale of [100,200]){
   for(const theme of ["light","dark"]){
    await headerReflowPage.evaluate(({scale,theme})=>{
     document.documentElement.dataset.theme=theme;
     document.documentElement.style.fontSize=scale+"%";
    },{scale,theme});
    await syncHeader();
    const m=await headerReflowPage.evaluate(()=>{
     const header=document.querySelector(".site-header").getBoundingClientRect();
     return {height:header.height,
      stickyTop:parseFloat(getComputedStyle(document.querySelector(".case-section-links")).top),
      margin:parseFloat(getComputedStyle(document.querySelector(".case-prose h2[id]")).scrollMarginTop),
      padding:parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)};
    });
    const at=width+"px "+scale+"% "+theme+" case header";
    assert.ok(Math.abs(m.stickyTop-m.height)<=2,at+": chapter strip clears dynamic header");
    assert.ok(m.margin>=m.height+75,at+": chapter heading clears both sticky bars");
    assert.ok(m.padding>=m.height+8,at+": anchor padding clears sticky header");
   }
  }
 }
 await headerReflowPage.close();

 // Guard the tablet breakpoints moved out of legacy styles.css. At 620px
 // the 650px spacing must win over 760px defaults; at 900px the hero
 // remains a single column with the original illustration minimum height.
 for(const width of [620,900]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const layout=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const hero=getComputedStyle(document.querySelector(".hero"));
    const feature=getComputedStyle(document.querySelector(".hero-feature"));
    const actions=getComputedStyle(document.querySelector(".hero-actions"));
    return {
     paddingTop:hero.paddingTop,paddingBottom:hero.paddingBottom,
     featureMinHeight:feature.minHeight,actionGap:actions.columnGap,
     columns:hero.gridTemplateColumns
    };
   },theme);
   if(width===620){
    assert.equal(layout.paddingTop,"28px",`620px ${theme}: 650px hero top padding must win`);
    assert.equal(layout.paddingBottom,"55px",`620px ${theme}: 650px hero bottom padding must win`);
    assert.equal(layout.featureMinHeight,"320px",`620px ${theme}: portrait panel height must be retained`);
    assert.equal(layout.actionGap,"14px",`620px ${theme}: CTA spacing must not regress to 760px gap`);
   }else{
    assert.equal(layout.featureMinHeight,"420px",`900px ${theme}: tablet portrait minimum height must remain`);
    assert.equal(layout.columns.trim().split(/\s+/).length,1,`900px ${theme}: hero must use one column`);
   }
  }
 }

 // Pass 8: prove consolidated 760px/1024px media blocks preserve the
 // original cascade at their boundaries, not just source selector counts.
 // Phone, tablet, narrow desktop, and large desktop are checked in both themes.
 for(const width of [600,601,650,651,760,761,950,951,1023,1024,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const layout=await page.evaluate(value=>{
    document.documentElement.dataset.theme=value;
    const get=selector=>getComputedStyle(document.querySelector(selector));
    const feature=document.querySelector(".hero .hero-feature");
    const art=document.querySelector(".hero .feature-art");
    return {
     minHeight:get(".hero .hero-feature").minHeight,
     actionGap:get(".hero .hero-actions").columnGap,
     emDisplay:get(".hero .hero-copy h1 em").display,
     noteDisplay:get(".hero .notebook-hero-note").display,
     heroDisplay:get(".hero").display,
     columns:get(".hero").gridTemplateColumns,
     featureHeight:feature.getBoundingClientRect().height,
     artHeight:art.getBoundingClientRect().height,
     heroPaddingTop:get(".hero").paddingTop
    };
   },theme);
   const minHeight=width<=600?"0px":width<=650?"320px":
    width<=760?"430px":width<=950?"420px":width<1024?"520px":"0px";
   assert.equal(layout.minHeight,minHeight,width+"px "+theme+": portrait panel minimum height");
   const gap=width<=600?"12px":width<=650?"14px":width<=760?"18px":"24px";
   assert.equal(layout.actionGap,gap,width+"px "+theme+": responsive hero action gap");
   assert.equal(layout.emDisplay,width<=760?"inline":"inline-block",
    width+"px "+theme+": emphasis display across tablet cutoff");
   assert.equal(layout.noteDisplay,width<=600?"none":"flex",
    width+"px "+theme+": notebook note follows phone cutoff (flex items are blockified)");
   assert.equal(layout.heroDisplay,width<=600?"flex":"grid",
    width+"px "+theme+": hero maintains intentional layout mode");
   if(width>=1024){
    assert.ok(Math.abs(layout.artHeight-layout.featureHeight)<2,
     width+"px "+theme+": desktop art fills the feature frame");
    assert.equal(layout.minHeight,"0px",width+"px "+theme+": desktop frame has no minimum");
    assert.ok(parseFloat(layout.heroPaddingTop)>=32,
     width+"px "+theme+": desktop hero keeps reading gutter");
   }else if(width>=601){
    assert.equal(layout.columns.trim().split(/\s+/).length,width<=950?1:2,
     width+"px "+theme+": column count remains stable at 950px boundary");
   }
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
 // About's AI note should inherit the biography type rhythm rather than
 // maintaining competing phone/desktop declarations. Check both themes.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const typography=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const bio=getComputedStyle(document.querySelector(".about .about-bio p"));
    const note=getComputedStyle(document.querySelector(".about .ai-process p:not(.eyebrow)"));
    return {bioSize:bio.fontSize,noteSize:note.fontSize,bioLeading:bio.lineHeight,noteLeading:note.lineHeight};
   },theme);
   assert.equal(typography.noteSize,typography.bioSize,
    `${width}px ${theme}: AI aside and biography should share readable type size`);
   assert.equal(typography.noteLeading,typography.bioLeading,
    `${width}px ${theme}: AI aside should inherit the biography line height`);
  }
 }
 await page.setViewportSize({width:1280,height:720});
 await page.evaluate(()=>{document.documentElement.dataset.theme="light"});
 assert.notEqual(await page.locator(".about-portrait figcaption").evaluate(node=>getComputedStyle(node).display),"none",
  "Desktop About must retain the headshot caption");

 // Pass 10: archive title and metadata selectors no longer repeat
 // .featured-project. Verify computed type and spacing at each breakpoint.
 for(const width of [320,390,600,601,760,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const cards=await page.evaluate(value=>{
    document.documentElement.dataset.theme=value;
    return [...document.querySelectorAll(".work .client-file")].map(file=>{
     const heading=file.querySelector(".archive-project-title");
     const meta=file.querySelector(".project-meta");
     return {
      featured:file.classList.contains("featured-project"),
      weight:getComputedStyle(heading).fontWeight,
      margin:getComputedStyle(meta).marginTop,
      size:parseFloat(getComputedStyle(heading).fontSize),
      leading:parseFloat(getComputedStyle(heading).lineHeight)
     };
    });
   },theme);
   assert.ok(cards.length>=3,width+"px "+theme+": professional client files exist");
   for(const card of cards){
    assert.equal(card.featured,true,width+"px "+theme+": client files retain featured structure");
    assert.equal(card.weight,"500",width+"px "+theme+": heading weight remains 500");
    assert.equal(card.margin,"12px",width+"px "+theme+": metadata retains 12px spacing");
    assert.ok(Math.abs(card.leading/card.size-(width<=600?1.12:1.1))<0.02,
     width+"px "+theme+": archive title line-height remains unchanged");
   }
  }
 }
 await page.setViewportSize({width:1280,height:720});
 await page.evaluate(()=>{document.documentElement.dataset.theme="light"});

 await page.goto(origin+"/case-studies/hoylu/connected-planning/");
 await page.locator("#case-title").waitFor();
 // Pass 10: the shared case-navigation owner keeps every next/back link
 // touch-friendly. Fact values and evidence text retain distinct line heights.
 for(const width of [390,760,1280]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const data=await page.evaluate(value=>{
    document.documentElement.dataset.theme=value;
    const links=[...document.querySelectorAll(".case-next-nav a,.case-back")];
    const ratio=selector=>{
     const style=getComputedStyle(document.querySelector(selector));
     return parseFloat(style.lineHeight)/parseFloat(style.fontSize);
    };
    return {
     links:links.map(link=>{
      const style=getComputedStyle(link);
      return {isNext:link.matches(".case-next-nav a")?link.classList.contains("case-next"):true,
       height:parseFloat(style.minHeight),display:style.display,align:style.alignItems};
     }),
     facts:ratio(".case-fact-value"),evidence:ratio(".case-evidence-item strong")
    };
   },theme);
   assert.ok(data.links.length>=2,width+"px "+theme+": case navigation exists");
   for(const link of data.links){
    assert.equal(link.isNext,true,width+"px "+theme+": next links retain class and nav parent");
    assert.ok(link.height>=44,width+"px "+theme+": case links retain 44px minimum height");
    assert.ok(["flex","inline-flex"].includes(link.display),width+"px "+theme+": links remain flex-aligned");
    assert.equal(link.align,"center",width+"px "+theme+": links stay vertically aligned");
   }
   assert.ok(Math.abs(data.facts-1.6)<0.02,width+"px "+theme+": fact values retain 1.6 leading");
   assert.ok(Math.abs(data.evidence-1.5)<0.02,width+"px "+theme+": evidence values retain 1.5 leading");
  }
 }
 await page.setViewportSize({width:1280,height:720});
 await page.evaluate(()=>{document.documentElement.dataset.theme="light"});


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
 // Check computed evidence/gallery geometry and theme paint after removing dead overrides.
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  const samples=[];
  for(const theme of ["light","dark"]){
   const metrics=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const evidence=getComputedStyle(document.querySelector(".case-evidence"));
    const gallery=getComputedStyle(document.querySelector(".case-gallery"));
    return {evidenceCols:evidence.gridTemplateColumns.trim().split(/\s+/).length,
     galleryCols:gallery.gridTemplateColumns.trim().split(/\s+/).length,
     evidenceGap:evidence.gap,galleryGap:gallery.gap,
     surface:getComputedStyle(document.querySelector(".case-evidence-item")).backgroundColor,
     heroBorder:getComputedStyle(document.querySelector(".case-hero-visual:not(:has(img))")).borderTopStyle,
     heroBriefSize:parseFloat(getComputedStyle(document.querySelector(".case-hero-visual .hero-image-brief")).fontSize),
     factLabelFont:getComputedStyle(document.querySelector(".case-fact-label")).fontFamily,
     factValueFont:getComputedStyle(document.querySelector(".case-fact-value")).fontFamily,
     factLabelWeight:getComputedStyle(document.querySelector(".case-fact-label")).fontWeight,
     factValueWeight:getComputedStyle(document.querySelector(".case-fact-value")).fontWeight,
     factLabelSize:getComputedStyle(document.querySelector(".case-fact-label")).fontSize,
     factValueSize:getComputedStyle(document.querySelector(".case-fact-value")).fontSize};
   },theme);
   assert.equal(metrics.evidenceCols,width===390?1:3,theme+": evidence columns at "+width+"px");
   assert.equal(metrics.galleryCols,width===390?1:2,theme+": gallery columns at "+width+"px");
   assert.equal(metrics.heroBorder,"dashed",theme+": missing hero must retain dashed border at "+width+"px");
    assert.equal(metrics.factLabelFont,metrics.factValueFont,theme+": fact label and value share body type");
    assert.match(metrics.factLabelFont,/DM Sans/,theme+": facts retain the authored body font");
    assert.equal(metrics.factLabelWeight,"650",theme+": fact labels retain their hierarchy");
    assert.equal(metrics.factValueWeight,"400",theme+": fact values stay supporting copy");
    assert.equal(metrics.factLabelSize,"12px",theme+": fact label meta size");
    assert.equal(metrics.factValueSize,"14px",theme+": fact value size");
   assert.ok(metrics.heroBriefSize>=16&&metrics.heroBriefSize<=20,theme+": visual brief must stay caption-sized at "+width+"px");
   samples.push(metrics);
  }
  assert.equal(samples[0].evidenceGap,samples[1].evidenceGap,"Evidence spacing must not shift with theme");
  assert.equal(samples[0].galleryGap,samples[1].galleryGap,"Gallery spacing must not shift with theme");
  assert.notEqual(samples[0].surface,samples[1].surface,"Evidence card surface must adapt to theme");
  // Hovered chapter tabs need readable text in both themes; reduced motion
  // should disable the transition without removing the hover/focus cue.
  await page.emulateMedia({reducedMotion:"reduce"});
  for(const theme of ["light","dark"]){
   await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   await page.mouse.move(0,0);
   const chapter=page.locator(".case-section-links button").last();
   await chapter.hover();
   const result=await chapter.evaluate(node=>{
    const style=getComputedStyle(node);
    const rgb=value=>{
     const canvas=document.createElement("canvas");
     canvas.width=canvas.height=1;
     const ctx=canvas.getContext("2d");
     ctx.fillStyle=value;ctx.fillRect(0,0,1,1);
     return [...ctx.getImageData(0,0,1,1).data].slice(0,3);
    };
    const luminance=value=>{
     const [r,g,b]=rgb(value).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
     return .2126*r+.7152*g+.0722*b;
    };
    const [hi,lo]=[luminance(style.color),luminance(style.backgroundColor)].sort((a,b)=>b-a);
    return {contrast:(hi+.05)/(lo+.05),minHeight:parseFloat(style.minHeight),transition:style.transitionDuration};
   });
   assert.ok(result.contrast>=4.5,width+"px "+theme+": chapter hover needs 4.5:1 contrast (got "+result.contrast.toFixed(2)+")");
   assert.ok(result.minHeight>=44,width+"px "+theme+": chapter touch target remains 44px");
   assert.ok(parseFloat(result.transition)<=0.001,width+"px "+theme+": reduced motion keeps chapter transitions effectively instant");
  }
  await page.emulateMedia({reducedMotion:"no-preference"});
 }
 // The consolidated breakpoints must preserve facts, gallery, evidence, and
 // sticky chapter offsets across their exact boundaries in both themes.
 for(const width of [320,480,481,600,650,651,760,761]){
  await page.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   await page.evaluate(value=>document.documentElement.dataset.theme=value,theme);
   if(width<=650){
    // ResizeObserver publishes the measured height asynchronously. Wait
    // for it before comparing the chapter offset to the visible header.
    await page.waitForFunction(()=>{
     const header=document.querySelector(".site-header");
     const measured=parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue("--mobile-site-header-height"));
     return Number.isFinite(measured)&&
      Math.abs(measured-Math.ceil(header.getBoundingClientRect().height))<=1;
    });
   }
   const metrics=await page.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const columns=selector=>getComputedStyle(document.querySelector(selector)).gridTemplateColumns.trim().split(/\s+/).length;
    const facts=getComputedStyle(document.querySelector(".case-facts"));
    return {
     factsDisplay:facts.display,factCols:columns(".case-facts"),
     evidenceCols:columns(".case-evidence"),galleryCols:columns(".case-gallery"),
     stickyTop:parseFloat(getComputedStyle(document.querySelector(".case-section-links")).top),
     headerHeight:document.querySelector(".site-header").getBoundingClientRect().height,
     overflow:document.documentElement.scrollWidth-innerWidth
    };
   },theme);
   if(width<=760){
    assert.equal(metrics.factsDisplay,"grid",width+"px "+theme+": facts use the responsive grid");
    assert.equal(metrics.factCols,width<=480?1:2,width+"px "+theme+": facts columns");
   }else assert.equal(metrics.factsDisplay,"flex",width+"px "+theme+": desktop facts remain flex");
   assert.equal(metrics.evidenceCols,width<=760?1:3,width+"px "+theme+": evidence columns");
   assert.equal(metrics.galleryCols,width<=760?1:2,width+"px "+theme+": gallery columns");
   if(width<=650){
    assert.ok(Math.abs(metrics.stickyTop-Math.ceil(metrics.headerHeight))<=1,
     width+"px "+theme+": phone chapter offset follows actual sticky header height (offset="+metrics.stickyTop+", height="+metrics.headerHeight+")");
   }else{
    assert.equal(metrics.stickyTop,width<=760?64:72,
     width+"px "+theme+": tablet/desktop chapter offset remains unchanged");
   }
   assert.ok(metrics.overflow<=2,width+"px "+theme+": no horizontal page overflow");
  }
 }
 await page.evaluate(()=>{document.documentElement.dataset.theme="light"});
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
 // Pass 16: one case-study stylesheet must preserve the structural defaults
 // previously loaded before the component, in both themes and at phone/desktop.
 const caseOwnerPage=await browser.newPage();
 caseOwnerPage.on("pageerror",error=>errors.push(error.message));
 await caseOwnerPage.goto(origin+"/case-studies/hoylu/connected-planning/");
 await caseOwnerPage.locator(".case-view .case-head").waitFor();
 for(const width of [390,1280]){
  await caseOwnerPage.setViewportSize({width,height:844});
  for(const theme of ["light","dark"]){
   const values=await caseOwnerPage.evaluate(theme=>{
    document.documentElement.dataset.theme=theme;
    const style=selector=>getComputedStyle(document.querySelector(selector));
    const cover=document.createElement("div");
    cover.className="case-hero-visual";
    cover.innerHTML='<img alt="" />';
    document.querySelector(".case-view").append(cover);
    const coverStyle=getComputedStyle(cover);
    const result={
     pageBackground:style(".case-view").backgroundColor,
     paperBackground:style("body").backgroundColor,
     minHeight:parseFloat(style(".case-view").minHeight),
     bodyColumns:style(".case-body").gridTemplateColumns.trim().split(/\s+/).length,
     backDisplay:style(".case-back").display,
     nextMarginTop:parseFloat(style(".case-next-nav .case-next").marginTop),
     headingFamily:style(".case-prose h2").fontFamily,
     headingWeight:style(".case-prose h2").fontWeight,
     coverHeight:parseFloat(coverStyle.height),
     coverObjectFit:getComputedStyle(cover.querySelector("img")).objectFit,
     overflow:document.documentElement.scrollWidth-innerWidth
    };
    cover.remove();
    return result;
   },theme);
   const at=width+"px "+theme+" consolidated case-study";
   assert.equal(values.pageBackground,values.paperBackground,at+": page retains theme paper");
   assert.ok(values.minHeight>0,at+": case page retains minimum reading height");
   assert.equal(values.bodyColumns,width<=760?1:2,at+": case body retains responsive columns");
   assert.equal(values.backDisplay,"inline-flex",at+": Back link retains layout");
   assert.equal(values.nextMarginTop,60,at+": next-project spacing remains authored");
   assert.match(values.headingFamily,/Newsreader/i,at+": case headings inherit display family");
   assert.equal(values.headingWeight,"600",at+": case headings retain display weight");
   assert.ok(Math.abs(values.coverHeight-Math.min(640,Math.max(300,width*.48)))<=2,
    at+": approved-image cover retains base frame height");
   assert.equal(values.coverObjectFit,"cover",at+": approved images retain shared crop");
   assert.ok(values.overflow<=2,at+": no horizontal overflow");
  }
 }
 await caseOwnerPage.close();

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
