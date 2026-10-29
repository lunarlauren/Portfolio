/* Case-study view rendering and chapter navigation.
   Called by the portfolio router after a project path is resolved.
   Shared editorial helpers live in project-content.js; keep its script tag before this renderer. */
function renderCaseStudy(hash){
const parts=hash.split("/"),group=parts[1],i=Number(parts[2]);const company=data.companies.find(c=>c.id===group);const projects=company?company.projects:group==="playground"?data.playground:null;const p=projects?.[i];if(!p||!Number.isInteger(i)||i<0){history.replaceState(null,"","/#work");route();return}main.hidden=true;caseView.hidden=false;$(".skip-link").href="#case-study";// Absolute homepage anchors keep Open in New Tab and modified clicks on the
// intended archive, rather than reopening the case-study URL with a stale hash.
const returnHash=company?"/#work":"/#playground";const details=p.details||p.summary;const nextProject=projects.length>1?projects[(i+1)%projects.length]:null;const nextIndex=projects.length>1?(i+1)%projects.length:0;const nextHref=casePath(group,nextIndex);// Optional editorial chapters must not leave gaps in the visible reading order.
const hasProcess=Boolean(p.process);const processNotes=processNotesMarkup(p,hasProcess?3:2);const outcomeChapter=2+Number(hasProcess)+Number(Boolean(processNotes));const gallery=Array.isArray(p.gallery)?p.gallery:[];const briefs=Array.isArray(p.galleryBriefs)?p.galleryBriefs:[];// The gallery often contains editorial briefs rather than supplied images.
// Give assistive technology an accurate group name without implying a screenshot exists.
// Gallery images and editorial briefs can arrive at different times. Keep
// unmatched briefs visible rather than silently dropping them when one
// approved image is added; a brief is never evidence of a shipped screen.
const galleryCount=Math.max(gallery.length,briefs.length);
const galleryLabel=gallery.length&&gallery.every(Boolean)&&briefs.length<=gallery.length?"Project image gallery":gallery.some(Boolean)?"Project images and visual briefs":"Visual briefs and image placeholders";
const galleryItems=galleryCount
 ?Array.from({length:galleryCount},(_,j)=>visual({title:p.title,image:gallery[j],imageBrief:briefs[j]})).join("")
 :visual({title:p.title,imageBrief:p.imageBrief});caseView.innerHTML='<a class="case-back" href="'+returnHash+'">← Back to '+(company?"work":"playground")+'</a><header class="case-head"><p class="eyebrow">'+esc(company?.name||"PERSONAL WORK")+' / '+esc(p.type)+'</p><h1 id="case-title">'+esc(p.title)+'</h1>'+deliveryStampMarkup(p)+'<p class="case-intro">'+esc(p.summary)+'</p></header>'+evidenceMarkup(p)+'<div class="case-hero-visual">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title)+'">'+illustrativeImageStatus(p.imageBrief):'<div class="hero-image-brief"><span class="brief-kicker">'+esc(visualBriefKicker(p.imageBrief))+'</span><span>'+esc(p.imageBrief||"Add an approved hero visual.")+'</span></div>')+'</div>'+highlightMarkup(p)+'<nav class="case-section-links" aria-label="On this case study"><button type="button" data-case-jump="case-challenge" aria-controls="case-challenge">Challenge &amp; role</button>'+(p.process?'<button type="button" data-case-jump="case-process" aria-controls="case-process">Process &amp; rationale</button>':"")+(processNotes?'<button type="button" data-case-jump="case-evidence-notes" aria-controls="case-evidence-notes">Evidence &amp; tradeoffs</button>':"")+(p.outcome?'<button type="button" data-case-jump="case-outcome" aria-controls="case-outcome">Deliverables &amp; learning</button>':"")+'</nav><div class="case-body">'+caseFactsMarkup(p,company)+'<div class="case-prose"><h2 id="case-challenge">01 / The challenge & my role</h2><p>'+esc(details)+'</p>'+(p.process?'<h2 id="case-process">02 / Process & design rationale</h2><p>'+esc(p.process)+'</p>':'')+processNotes+(p.outcome?'<h2 id="case-outcome">'+String(outcomeChapter).padStart(2,"0")+' / Deliverables & learning</h2><p>'+esc(p.outcome)+'</p>':'')+'</div></div><div class="case-gallery" role="group" aria-label="'+galleryLabel+'">'+galleryItems+'</div><nav class="case-next-nav" aria-label="Case study navigation"><a class="case-next" href="'+returnHash+'">← Explore more work</a>'+(nextProject?'<a class="case-next" href="'+nextHref+'">Next: '+esc(nextProject.title)+' →</a>':'')+'</nav>';// Section navigation must not change the URL hash: hashes are reserved for routing.
const caseJumpButtons=[...caseView.querySelectorAll("[data-case-jump]")];
// Cache chapter targets once per render; buttons and scroll tracking share them.
const caseJumpTargets=new Map(caseJumpButtons.map(button=>[
 button.dataset.caseJump,document.getElementById(button.dataset.caseJump)
]));
const caseJumpHeadings=[...caseJumpTargets.values()].filter(Boolean);
const chapterNav=caseView.querySelector(".case-section-links");
// Keep the active chapter visible in the horizontally scrolling phone index.
// Only scroll the tab strip: scrollIntoView would move the reading page too.
function revealCurrentCaseTab(button){
 const navBounds=chapterNav.getBoundingClientRect();
 const tabBounds=button.getBoundingClientRect();
 const edge=16; // Leave room for the focus outline.
 let delta=0;
 if(tabBounds.left<navBounds.left+edge)delta=tabBounds.left-navBounds.left-edge;
 else if(tabBounds.right>navBounds.right-edge)delta=tabBounds.right-navBounds.right+edge;
 if(delta){
  // A programmatic scroll must not create an animated tab-strip chase.
  // The active tab should become visible immediately for keyboard users.
  chapterNav.scrollLeft+=delta;
 }
}
function setCurrentCaseSection(id,{reveal=false}={}){
 const active=caseJumpButtons.find(button=>button.dataset.caseJump===id);
 if(!active)return;
 // Reading progress updates the active state without stealing the horizontal
 // scroll position from someone browsing other chapter tabs. Only a deliberate
 // chapter selection (or initial render) requests a tab-strip reveal.
 if(active.getAttribute("aria-current")==="location"){
  if(reveal)revealCurrentCaseTab(active);
  return;
 }
 caseJumpButtons.forEach(button=>{
  if(button===active)button.setAttribute("aria-current","location");
  else button.removeAttribute("aria-current");
 });
 if(reveal)revealCurrentCaseTab(active);
}
caseJumpButtons.forEach(button=>{
 button.addEventListener("click",()=>{
  const heading=caseJumpTargets.get(button.dataset.caseJump);
  if(!heading)return;
  heading.setAttribute("tabindex","-1");
  setCurrentCaseSection(heading.id,{reveal:true});
  heading.scrollIntoView({behavior:window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  heading.focus({preventScroll:true});
 });
});
// The case-study index follows reading progress, not just button taps.
// Both observers and the fallback use the same viewport threshold, so the
// current chapter is consistent in browsers with or without IntersectionObserver.
function updateCurrentCaseSectionFromScroll(){
 const threshold=Math.min(220,window.innerHeight*.3);
 let current=caseJumpHeadings[0]?.id;
 for(const heading of caseJumpHeadings){
  if(heading&&heading.getBoundingClientRect().top<=threshold)current=heading.id;
 }
 if(current)setCurrentCaseSection(current);
}
// Disconnect old listeners before replacing caseView's content on another route.
if(window.caseSectionObserver)window.caseSectionObserver.disconnect();
if(window.caseSectionScrollCleanup){
 window.caseSectionScrollCleanup();
 window.caseSectionScrollCleanup=null;
}
if(typeof window.IntersectionObserver==="function"&&caseJumpHeadings.length>0){
 window.caseSectionObserver=new IntersectionObserver(updateCurrentCaseSectionFromScroll,
  {rootMargin:"-20% 0px -55% 0px",threshold:0});
 caseJumpHeadings.forEach(heading=>window.caseSectionObserver.observe(heading));
}else if(caseJumpHeadings.length>0){
 // Older/limited browsers still get a current chapter while reading. Only
 // calculate layout once per animation frame, and remove listeners on exit.
 // Keep the frame handle so leaving a case study cancels queued work;
 // removing listeners alone would still allow one stale callback to run.
 let frameId=null;
 const onScroll=()=>{
  if(frameId!==null)return;
  frameId=requestAnimationFrame(()=>{
   frameId=null;
   updateCurrentCaseSectionFromScroll();
  });
 };
 window.addEventListener("scroll",onScroll,{passive:true});
 window.addEventListener("resize",onScroll);
 window.caseSectionScrollCleanup=()=>{
  if(frameId!==null){
   cancelAnimationFrame(frameId);
   frameId=null;
  }
  window.removeEventListener("scroll",onScroll);
  window.removeEventListener("resize",onScroll);
 };
}
if(caseJumpButtons.length)setCurrentCaseSection(caseJumpButtons[0].dataset.caseJump,{reveal:true});
document.title=p.title+" — Lauren Leven";
 const pageUrl=location.origin+casePath(group,i);
 // Keep share previews aligned with the routed project, not the homepage.
 // Static crawlers still require server-rendered metadata for reliable previews.
 const setMeta=(selector,value)=>document.querySelector(selector)?.setAttribute("content",value);
 document.querySelector('link[rel="canonical"]')?.setAttribute("href",pageUrl);
 setMeta('meta[name="description"]',p.summary);
 setMeta('meta[property="og:title"]',document.title);
 setMeta('meta[property="og:description"]',p.summary);
 setMeta('meta[property="og:url"]',pageUrl);
 setMeta('meta[name="twitter:title"]',document.title);
 setMeta('meta[name="twitter:description"]',p.summary);
 window.scrollTo({top:0,behavior:"auto"});caseView.focus({preventScroll:true})}

