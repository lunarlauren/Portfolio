// Inventory is initialized independently of portfolio routing.
function initInventory(){
 const panel=document.getElementById("inventory-inspect");
 const buttons=[...document.querySelectorAll(".inventory-item")];
 if(!panel||!buttons.length)return;
 const descriptions={
 figma:["Figma","Where the wireframes, UI ideas, and probably-too-many iterations live."],
 illustrator:["Illustrator","Vector shapes, logos, icons, and all the little details."],
 photoshop:["Photoshop","Photo editing, composites, and making the visual idea actually happen."],
 aftereffects:["After Effects","A little movement can make a whole design feel alive."],
 gummyworms:["Gummy worms","A vital part of the creative process. For research purposes, obviously."],
 coffee:["Coffee","Creative fuel. Occasionally more urgent than the actual brief."]
 };
 const reduceMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
 function selectItem(button,animate=true){
  const item=descriptions[button.dataset.item];
  if(!item)return;
  buttons.forEach(other=>other.setAttribute("aria-pressed",String(other===button)));
  panel.querySelector("strong").textContent=item[0];
  panel.querySelector("p").textContent=item[1];
  if(animate&&!reduceMotion){
   button.classList.remove("inventory-pop");
   panel.classList.remove("inventory-refresh");
   void button.offsetWidth;
   button.classList.add("inventory-pop");
   panel.classList.add("inventory-refresh");
  }
 }
 buttons.forEach((button,i)=>{
  button.addEventListener("click",()=>selectItem(button));
  button.addEventListener("keydown",event=>{
   if(!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(event.key))return;
   event.preventDefault();
   const step=event.key==="ArrowRight"||event.key==="ArrowDown"?1:-1;
   const next=buttons[(i+step+buttons.length)%buttons.length];
   next.focus();
   selectItem(next);
  });
 });

}
initInventory();

const data=window.PORTFOLIO;const $=s=>document.querySelector(s);const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const slug=s=>encodeURIComponent(s);const safeHash=()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return "work"}};const imageMarkup=(p)=>p.image?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title+' project preview')+'">':'<span class="visual-label visual-brief"><span class="brief-kicker">IMAGE TO DESIGN</span><span>'+esc(p.imageBrief||"Add an approved project image or design mockup here.")+'</span></span>';const visual=(p)=>'<div class="project-visual">'+imageMarkup(p)+'</div>';// Use the first existing process sentence for a short, evidence-safe preview.
// Never generate or infer research findings, decisions, or results in the UI.
const processTeaser=p=>{
 const text=String(p.process||"").trim();
 return text.match(/^.*?[.!?](?=\s|$)/)?.[0]||text;
};
const projectCard=(p,i,group)=>'<article class="project-card" style="--i:'+Number(i)+'"><a class="project-card-link" href="#project/'+slug(group)+'/'+slug(String(i))+'" aria-label="View '+esc(p.title)+' case study">'+visual(p)+'<div class="project-meta"><span>'+esc(p.type)+'</span><span aria-hidden="true">↗</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p>'+(processTeaser(p)?'<p class="project-card-process"><strong>Design approach</strong> '+esc(processTeaser(p))+'</p>':"")+'<span class="project-card-cta">Read the case study <span aria-hidden="true">→</span></span></a></article>';// Single source of truth for project discovery. No company gate or repeated
// featured/company lists: each professional project appears exactly once.
const professionalProjects=data.companies.flatMap(company=>
 company.projects.map((project,index)=>({company,project,index}))
);
const gallery=document.createElement("div");
gallery.className="projects-grid featured-projects-grid notebook-project-index";
gallery.setAttribute("role","list");
gallery.setAttribute("aria-label","Professional design projects");
gallery.innerHTML=professionalProjects.map(({company,project,index},order)=>
 '<div class="featured-project" role="listitem"><p class="eyebrow">PROJECT '+String(order+1).padStart(2,"0")+' / '+esc(company.name)+' · '+esc(project.type)+'</p>'+
 projectCard(project,index,company.id)+'</div>'
).join("");
$("#work").append(gallery);

// Short, factual takeaways help visitors skim without replacing the full case study.
const caseHighlights={
 "Connected Planning":[["THE PROBLEM","Project information can be hard to follow across teams."],["MY FOCUS","Project context and clearer paths into the details."]],
 "Mobile Insights":[["THE QUESTION","What matters most when someone checks a project on their phone?"],["MY FOCUS","Readable insights and useful next steps on small screens."]],
 "Campaigns & Events":[["THE CHALLENGE","One product story, very different viewing distances."],["MY CONTRIBUTION","Event signage and digital campaign visuals."]],
 "Motion & Storytelling":[["THE FORMAT","A product idea explained in roughly 30 seconds."],["MY CONTRIBUTION","Storyboarding and visual pacing."]],
 "Customizable Patient Portal":[["WHO IT'S FOR","Patients preparing for surgery and the practices supporting them."],["THE DESIGN TASK","Flexible practice setup without confusing patients."]],
 "AI-Assisted IOL Planning":[["THE CHALLENGE","Keep clinical measurements distinct from AI-generated predictions."],["MY FOCUS","Clear information hierarchy and handoffs between tools."]],
 "Navigator App":[["THE CONTEXT","A shipped app used by cruise passengers."],["MY CONTRIBUTION","Booking, account information, and Wi-Fi guidance."]],
 "Stateroom TV App":[["THE CONTEXT","A shipped experience used in guest staterooms."],["MY FOCUS","Readable information and remote-control navigation."]],
 "Forktactics":[["THE IDEA","Make planning a week of dinners feel less exhausting."],["THE STATUS","An independent, evolving product prototype."]],
 "Fallout 76 — What I'd Design":[["THE IDEA","Explore design ideas inside a game world I know well."],["THE APPROACH","Concept work informed by the game's visual language."]],
 "Illustration & Experiments":[["THE SPACE","Personal work driven by curiosity."],["MY FOCUS","Character, composition, and visual exploration."]]
};
// Handoff: these labels summarize documented contributions, not invented outcomes.
// Update alongside content.js when the scope or delivery status is confirmed.
const projectEvidence={
 "Connected Planning":["Hoylu · Construction software","Product UX and visual design","Product design contribution"],
 "Mobile Insights":["Hoylu · Construction software","Mobile UX and visual design","Shipped product contribution"],
 "Campaigns & Events":["Hoylu · Marketing and events","Event signage and campaign visual design","Produced design assets"],
 "Motion & Storytelling":["Hoylu · Product communications","Storyboard and motion design planning","Storyboard deliverable"],
 "Customizable Patient Portal":["Alcon · Healthcare","UX/UI for patient and practice workflows","Design contribution"],
 "AI-Assisted IOL Planning":["Alcon · Clinical software","UX/UI for connected clinical workflows","Design contribution"],
 "Navigator App":["Holland America Line · Guest experience","Booking, account and Wi-Fi guidance UI","Shipped product contribution"],
 "Stateroom TV App":["Holland America Line · Guest experience","TV interface and remote navigation","Shipped product contribution"],
 "Forktactics":["Independent · Meal planning","Product concept, interaction design and iteration","Evolving prototype"]
};
const evidenceMarkup=p=>{
 const evidence=projectEvidence[p.title];
 if(!evidence)return "";
 const labels=["CONTEXT","MY CONTRIBUTION","DELIVERY"];
 return '<div class="case-evidence" aria-label="Project overview">'+evidence.map((value,i)=>'<div class="case-evidence-item"><span class="case-evidence-label">'+labels[i]+'</span><strong>'+esc(value)+'</strong></div>').join("")+'</div>';
};
const highlightMarkup=p=>{const items=caseHighlights[p.title]||[];return items.length?'<div class="case-highlights" role="group" aria-label="Project at a glance">'+items.map(([label,value])=>'<div class="case-highlight"><span class="case-highlight-label">'+esc(label)+'</span><p>'+esc(value)+'</p></div>').join("")+'</div>':""};
// Optional editorial notes distinguish design reasoning from research evidence
// and verified outcomes. Render only fields explicitly supplied in content.js.
const processNotesMarkup=p=>{
 const notes=[["Evidence & boundaries",p.evidence],["Design tension & rationale",p.tradeoffs]]
  .filter(([,value])=>typeof value==="string"&&value.trim());
 return notes.length?'<div class="case-process-notes">'+notes.map(([heading,value])=>
  '<section class="case-process-note"><h3>'+esc(heading)+'</h3><p>'+esc(value)+'</p></section>'
 ).join("")+'</div>':"";
};
const main=$("#main"),caseView=document.createElement("section");caseView.className="case-view wrap";caseView.hidden=true;caseView.id="case-study";caseView.setAttribute("role","main");caseView.tabIndex=-1;main.after(caseView);function route(){const hash=safeHash();if(!hash.startsWith("project/")){$(".skip-link").href="#main";main.hidden=false;caseView.hidden=true;if(hash.startsWith("company/")){location.replace("#work");return}document.title="Lauren Leven — Visual & Product Designer";return}const parts=hash.split("/"),group=parts[1],i=Number(parts[2]);const company=data.companies.find(c=>c.id===group);const projects=company?company.projects:group==="playground"?data.playground:null;const p=projects?.[i];if(!p||!Number.isInteger(i)||i<0){location.hash="work";return}main.hidden=true;caseView.hidden=false;$(".skip-link").href="#case-study";const returnHash=company?"#work":"#playground";const details=p.details||p.summary;const nextProject=projects.length>1?projects[(i+1)%projects.length]:null;const nextIndex=projects.length>1?(i+1)%projects.length:0;const nextHref="#project/"+slug(group)+"/"+slug(String(nextIndex));const gallery=Array.isArray(p.gallery)?p.gallery:[];const briefs=Array.isArray(p.galleryBriefs)?p.galleryBriefs:[];const galleryItems=gallery.length?gallery.map((img,j)=>visual({title:p.title,image:img,imageBrief:briefs[j]})).join(""):(briefs.length?briefs.map(brief=>visual({title:p.title,imageBrief:brief})).join(""):visual({title:p.title,imageBrief:p.imageBrief}));caseView.innerHTML='<a class="case-back" href="'+returnHash+'">← Back to '+(company?"work":"playground")+'</a><header class="case-head"><p class="eyebrow">'+esc(company?.name||"PERSONAL WORK")+' / '+esc(p.type)+'</p><h1>'+esc(p.title)+'</h1><p class="case-intro">'+esc(p.summary)+'</p></header>'+evidenceMarkup(p)+'<div class="case-hero-visual">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title)+'">':'<div class="hero-image-brief"><span class="brief-kicker">HERO IMAGE TO DESIGN</span><span>'+esc(p.imageBrief||"Add an approved hero visual.")+'</span></div>')+'</div>'+highlightMarkup(p)+'<nav class="case-section-links" aria-label="On this case study"><button type="button" data-case-jump="case-challenge">Challenge &amp; role</button>'+(p.process?'<button type="button" data-case-jump="case-process">Process &amp; decisions</button>':"")+(p.outcome?'<button type="button" data-case-jump="case-outcome">Deliverables &amp; learning</button>':"")+'</nav><div class="case-body"><aside class="case-facts"><div class="case-fact"><span class="case-fact-label">Discipline</span><span class="case-fact-value">'+esc(p.type)+'</span></div><div class="case-fact"><span class="case-fact-label">Context</span><span class="case-fact-value">'+esc(company?.name||"Independent")+'</span></div></aside><div class="case-prose"><h2 id="case-challenge">01 / The challenge & my role</h2><p>'+esc(details)+'</p>'+(p.process?'<h2 id="case-process">02 / Process & design decisions</h2><p>'+esc(p.process)+'</p>':'')+processNotesMarkup(p)+(p.outcome?'<h2 id="case-outcome">03 / Deliverables & learning</h2><p>'+esc(p.outcome)+'</p>':'')+'</div></div><div class="case-gallery" role="group" aria-label="Project image gallery">'+galleryItems+'</div><nav class="case-next-nav" aria-label="Case study navigation"><a class="case-next" href="'+returnHash+'">← Explore more work</a>'+(nextProject?'<a class="case-next" href="'+nextHref+'">Next: '+esc(nextProject.title)+' →</a>':'')+'</nav>';// Section navigation must not change the URL hash: hashes are reserved for routing.
caseView.querySelectorAll("[data-case-jump]").forEach(button=>{
 button.addEventListener("click",()=>{
  const heading=document.getElementById(button.dataset.caseJump);
  if(!heading)return;
  heading.setAttribute("tabindex","-1");
  heading.scrollIntoView({behavior:window.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  heading.focus({preventScroll:true});
 });
});
document.title=p.title+" — Lauren Leven";window.scrollTo({top:0,behavior:"auto"});caseView.focus({preventScroll:true})}// Keep focus and scroll position predictable during hash navigation.
let previousHash=safeHash();
function routeWithMotion(){
 const nextHash=safeHash();
 const leavingProject=previousHash.startsWith("project/")&&!nextHash.startsWith("project/");
 route();
 if(leavingProject){
  requestAnimationFrame(()=>{
   const destination=nextHash==="playground"?"#playground-title":"#work-title";
   const heading=$(destination);
   if(heading&&!main.hidden){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  });
 }
 previousHash=nextHash;
}
window.addEventListener("hashchange",routeWithMotion);route();
// Navigation handoff: keep the header's current-section indicator synchronized
// with both hash routes and ordinary scrolling, without rewriting browser history.
function initSectionNavigation(){
 const links=[...document.querySelectorAll('.site-header nav a[href^="#"]')];
 const contactLink=document.getElementById("contact-link");
 const contactCTA=document.getElementById("email-link");
 const sections=links.map(link=>({link,section:document.querySelector(link.getAttribute("href"))}))
   .filter(entry=>entry.section);
 if(!sections.length)return;
 function updateCurrent(){
  const hash=safeHash();
  let active=null;
  if(hash.startsWith("project/")){
   active="work";
  }else{
   // Track the section nearest the top reading position. This also handles
   // visitors scrolling without using the navigation links.
   const threshold=Math.min(180,window.innerHeight*.25);
   for(const entry of sections){
    if(entry.section.getBoundingClientRect().top<=threshold)active=entry.section.id;
   }
   if(!active&&hash.startsWith("company/"))active="work";
   // On the landing hero, highlight Work as the next primary destination.
   if(!active)active="work";
  }
  // Contact is a mailto action rather than an anchor section. At the bottom
  // of a short page, its CTA can never reach the usual top-of-screen threshold.
  // Mark Contact current when the CTA is visible near the page's end.
  const atPageEnd=window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-24;
  const contactVisible=contactCTA&&!main.hidden&&contactCTA.getBoundingClientRect().top<window.innerHeight*.82;
  if(!hash.startsWith("project/")&&atPageEnd&&contactVisible)active="contact";
  if(contactLink){
   if(active==="contact")contactLink.setAttribute("aria-current","location");
   else contactLink.removeAttribute("aria-current");
  }
  for(const {link,section} of sections){
   if(section.id===active)link.setAttribute("aria-current","location");
   else link.removeAttribute("aria-current");
  }
 }
 let pending=false;
 function scheduleUpdate(){
  if(pending)return;
  pending=true;
  requestAnimationFrame(()=>{pending=false;updateCurrent()});
 }
 window.addEventListener("scroll",scheduleUpdate,{passive:true});
 window.addEventListener("resize",scheduleUpdate);
 window.addEventListener("hashchange",scheduleUpdate);
 updateCurrent();
}
initSectionNavigation();
$("#year").textContent=new Date().getFullYear();if(data.email&&data.email!=="hello@example.com"){const mail="mailto:"+data.email;$("#contact-link").href=mail;$("#email-link").href=mail}else{$("#contact-link").href="#about";$("#email-link").href="#about";$("#email-link").textContent="Contact details coming soon ↗"}

// Small, optional tactile details: no autoplay, no sound, no persistent state.
const footerSecret=document.getElementById("footer-secret");
const footerMessages=["✳","made with curiosity","one more little detail ♡","✳"];
let secretIndex=0;
footerSecret?.addEventListener("click",()=>{
 secretIndex=(secretIndex+1)%footerMessages.length;
 footerSecret.textContent=footerMessages[secretIndex];
 footerSecret.setAttribute("aria-label",footerMessages[secretIndex]==="✳"?"Reveal a little surprise":footerMessages[secretIndex]);
});


/* Reveal elements when they enter the viewport, without hiding content when JS fails. */
function initReveals(){
 if(!("IntersectionObserver" in window)||window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add("in-view");
   observer.unobserve(entry.target);
  });
 },{threshold:.08,rootMargin:"0px 0px -24px 0px"});
 document.querySelectorAll(".section-head,.about h2,.about-copy,.creative-inventory").forEach(el=>{
  el.classList.add("reveal-ready");
  observer.observe(el);
 });
}
initReveals();


// Decorative notebook sticker: optional, repeatable tactile feedback.
// Swap the button's star glyph for a commissioned illustration later.
document.querySelectorAll("[data-sticker-placeholder]").forEach(sticker=>{
 sticker.addEventListener("click",()=>{
  if(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)return;
  sticker.classList.remove("sticker-pop");
  void sticker.offsetWidth;
  sticker.classList.add("sticker-pop");
 });
 sticker.addEventListener("animationend",()=>sticker.classList.remove("sticker-pop"));
});
