/* Case-study view rendering and chapter navigation.
   Called by the portfolio router after a project path is resolved.
   Shared editorial helpers live in project-content.js; keep its script tag before this renderer. */
function renderCaseStudy(hash){
const parts=hash.split("/"),group=parts[1],i=Number(parts[2]);const company=data.companies.find(c=>c.id===group);const projects=company?company.projects:group==="playground"?data.playground:null;const p=projects?.[i];if(!p||!Number.isInteger(i)||i<0){history.replaceState(null,"","/#work");route();return}main.hidden=true;caseView.hidden=false;$(".skip-link").href="#case-study";const returnHash=company?"#work":"#playground";const details=p.details||p.summary;const nextProject=projects.length>1?projects[(i+1)%projects.length]:null;const nextIndex=projects.length>1?(i+1)%projects.length:0;const nextHref=casePath(group,nextIndex);const gallery=Array.isArray(p.gallery)?p.gallery:[];const briefs=Array.isArray(p.galleryBriefs)?p.galleryBriefs:[];const galleryItems=gallery.length?gallery.map((img,j)=>visual({title:p.title,image:img,imageBrief:briefs[j]})).join(""):(briefs.length?briefs.map(brief=>visual({title:p.title,imageBrief:brief})).join(""):visual({title:p.title,imageBrief:p.imageBrief}));caseView.innerHTML='<a class="case-back" href="'+returnHash+'">← Back to '+(company?"work":"playground")+'</a><header class="case-head"><p class="eyebrow">'+esc(company?.name||"PERSONAL WORK")+' / '+esc(p.type)+'</p><h1 id="case-title">'+esc(p.title)+'</h1><p class="case-intro">'+esc(p.summary)+'</p></header>'+evidenceMarkup(p)+'<div class="case-hero-visual">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title)+'">':'<div class="hero-image-brief"><span class="brief-kicker">HERO IMAGE TO DESIGN</span><span>'+esc(p.imageBrief||"Add an approved hero visual.")+'</span></div>')+'</div>'+highlightMarkup(p)+'<nav class="case-section-links" aria-label="On this case study"><span class="case-section-context" aria-hidden="true">'+esc(p.title)+'</span><button type="button" data-case-jump="case-challenge">Challenge &amp; role</button>'+(p.process?'<button type="button" data-case-jump="case-process">Process &amp; rationale</button>':"")+(p.outcome?'<button type="button" data-case-jump="case-outcome">Deliverables &amp; learning</button>':"")+'</nav><div class="case-body">'+caseFactsMarkup(p,company)+'<div class="case-prose"><h2 id="case-challenge">01 / The challenge & my role</h2><p>'+esc(details)+'</p>'+(p.process?'<h2 id="case-process">02 / Process & design rationale</h2><p>'+esc(p.process)+'</p>':'')+processNotesMarkup(p)+(p.outcome?'<h2 id="case-outcome">03 / Deliverables & learning</h2><p>'+esc(p.outcome)+'</p>':'')+'</div></div><div class="case-gallery" role="group" aria-label="Project image gallery">'+galleryItems+'</div><nav class="case-next-nav" aria-label="Case study navigation"><a class="case-next" href="'+returnHash+'">← Explore more work</a>'+(nextProject?'<a class="case-next" href="'+nextHref+'">Next: '+esc(nextProject.title)+' →</a>':'')+'</nav>';// Section navigation must not change the URL hash: hashes are reserved for routing.
const caseJumpButtons=[...caseView.querySelectorAll("[data-case-jump]")];
const caseJumpHeadings=caseJumpButtons.map(button=>document.getElementById(button.dataset.caseJump));
function setCurrentCaseSection(id){
 caseJumpButtons.forEach(button=>{
  if(button.dataset.caseJump===id)button.setAttribute("aria-current","location");
  else button.removeAttribute("aria-current");
 });
}
caseJumpButtons.forEach(button=>{
 button.addEventListener("click",()=>{
  const heading=document.getElementById(button.dataset.caseJump);
  if(!heading)return;
  heading.setAttribute("tabindex","-1");
  setCurrentCaseSection(heading.id);
  heading.scrollIntoView({behavior:window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  heading.focus({preventScroll:true});
 });
});
// The case-study index follows reading progress, not just button taps.
// Disconnect on the next route to avoid observing removed headings.
if(window.caseSectionObserver)window.caseSectionObserver.disconnect();
if("IntersectionObserver" in window&&caseJumpHeadings.some(Boolean)){
 window.caseSectionObserver=new IntersectionObserver(()=>{
  const threshold=Math.min(220,window.innerHeight*.3);
  let current=caseJumpHeadings.find(Boolean)?.id;
  for(const heading of caseJumpHeadings){
   if(heading&&heading.getBoundingClientRect().top<=threshold)current=heading.id;
  }
  if(current)setCurrentCaseSection(current);
 },{rootMargin:"-20% 0px -55% 0px",threshold:0});
 caseJumpHeadings.filter(Boolean).forEach(heading=>window.caseSectionObserver.observe(heading));
}
if(caseJumpButtons.length)setCurrentCaseSection(caseJumpButtons[0].dataset.caseJump);
document.title=p.title+" — Lauren Leven";
 document.querySelector('link[rel="canonical"]')?.setAttribute("href",location.origin+casePath(group,i));
 document.querySelector('meta[name="description"]')?.setAttribute("content",p.summary);
 window.scrollTo({top:0,behavior:"auto"});caseView.focus({preventScroll:true})}

