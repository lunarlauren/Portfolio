// Respect a saved preference first, then the device theme.
function initTheme(){
 const button=document.getElementById("theme-toggle");
 const meta=document.querySelector('meta[name="theme-color"]');
 let saved=null;
 try{saved=localStorage.getItem("portfolio-theme")}catch{}
 const preferred=saved==="dark"||saved==="light"?saved:(window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light");
 const apply=theme=>{
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
  if(meta)meta.content=theme==="dark"?"#111d2a":"#f7f9fa";
  if(button){
   const dark=theme==="dark";
   button.setAttribute("aria-pressed",String(dark));
   button.setAttribute("aria-label",dark?"Switch to light theme":"Switch to dark theme");
   button.title=dark?"Switch to light theme":"Switch to dark theme";
   button.querySelector(".theme-toggle-icon").textContent=dark?"☀":"☾";
   button.querySelector(".theme-toggle-label").textContent=dark?"Light":"Dark";
  }
 };
 apply(preferred);
 button?.addEventListener("click",()=>{
  const next=document.documentElement.dataset.theme==="dark"?"light":"dark";
  apply(next);
  try{localStorage.setItem("portfolio-theme",next)}catch{}
 });
}
initTheme();

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
 buttons.forEach(button=>button.addEventListener("click",()=>{
  const item=descriptions[button.dataset.item];
  if(!item)return;
  buttons.forEach(other=>other.setAttribute("aria-pressed",String(other===button)));
  panel.querySelector("strong").textContent=item[0];
  panel.querySelector("p").textContent=item[1];
 }));
}
initInventory();

const data=window.PORTFOLIO;const $=s=>document.querySelector(s);const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const slug=s=>encodeURIComponent(s);const safeHash=()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return "work"}};const imageMarkup=(p)=>p.image?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title+' project preview')+'">':'<span class="visual-label visual-brief"><span class="brief-kicker">IMAGE TO DESIGN</span><span>'+esc(p.imageBrief||"Add an approved project image or design mockup here.")+'</span></span>';const visual=(p)=>'<div class="project-visual">'+imageMarkup(p)+'</div>';const projectCard=(p,i,group)=>'<article class="project-card" style="--i:'+Number(i)+'"><a class="project-card-link" href="#project/'+slug(group)+'/'+slug(String(i))+'" aria-label="View '+esc(p.title)+' case study">'+visual(p)+'<div class="project-meta"><span>'+esc(p.type)+'</span><span aria-hidden="true">↗</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p></a></article>';const companyGrid=$("#company-grid");companyGrid.innerHTML=data.companies.map((c,i)=>'<button class="company-card '+(c.featured?'featured':'')+'" type="button" data-company="'+esc(c.id)+'" style="--accent:'+esc(c.accent)+';--i:'+i+'" aria-controls="collection" aria-expanded="false"><span class="card-top"><span>'+esc(c.category)+'</span><span aria-hidden="true">↗</span></span><span class="company-name">'+esc(c.name)+'</span><span class="company-description">'+esc(c.description)+'</span><span class="card-bottom">'+c.projects.length+' PROJECT'+(c.projects.length===1?'':'S')+' <span aria-hidden="true">→</span></span></button>').join("");$("#play-grid").innerHTML=data.playground.map((p,i)=>projectCard(p,i,"playground")).join("");const collection=$("#collection");
function openCompany(id){
  const c=data.companies.find(x=>x.id===id);if(!c)return;
  companyGrid.hidden=false;
  companyGrid.dataset.active=id;
  companyGrid.parentNode.insertBefore(collection,companyGrid);
  collection.hidden=false;collection.dataset.active=id;
  collection.setAttribute("aria-label",c.name+" projects");
  collection.innerHTML='<div class="collection-nav"><span class="eyebrow">SELECTED WORK / '+esc(c.projects.length)+' PROJECTS</span></div><div class="collection-head"><div><p class="eyebrow">'+esc(c.category)+'</p><h3>'+esc(c.name)+'</h3><p>'+esc(c.description)+'</p></div></div><div class="projects-grid">'+c.projects.map((p,i)=>projectCard(p,i,c.id)).join("")+'</div>';
  document.querySelectorAll(".company-card").forEach(btn=>{const active=btn.dataset.company===id;btn.setAttribute("aria-expanded",String(active));});
  // Keep other company cards visible for quick switching.
}
function showCompanies(){
  collection.hidden=true;collection.after(companyGrid);companyGrid.hidden=false;companyGrid.dataset.active="";collection.dataset.active="";
  
  document.querySelectorAll(".company-card").forEach(btn=>{btn.setAttribute("aria-expanded","false");});
}
document.querySelectorAll("[data-company]").forEach(btn=>btn.addEventListener("click",()=>{location.hash="company/"+encodeURIComponent(btn.dataset.company)}));
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
const highlightMarkup=p=>{const items=caseHighlights[p.title]||[];return items.length?'<div class="case-highlights" aria-label="Project at a glance">'+items.map(([label,value])=>'<div class="case-highlight"><span class="case-highlight-label">'+esc(label)+'</span><p>'+esc(value)+'</p></div>').join("")+'</div>':""};
const main=$("#main"),caseView=document.createElement("section");caseView.className="case-view wrap";caseView.hidden=true;caseView.id="case-study";caseView.setAttribute("role","main");caseView.tabIndex=-1;main.after(caseView);function route(){const hash=safeHash();if(!hash.startsWith("project/")){$(".skip-link").href="#main";main.hidden=false;caseView.hidden=true;if(hash.startsWith("company/")){const id=hash.slice(8);if(data.companies.some(c=>c.id===id)){openCompany(id);document.title=data.companies.find(c=>c.id===id).name+" Projects — Lauren Leven";return}}showCompanies();document.title="Lauren Leven — Visual & Product Designer";return}const parts=hash.split("/"),group=parts[1],i=Number(parts[2]);const company=data.companies.find(c=>c.id===group);const projects=company?company.projects:group==="playground"?data.playground:null;const p=projects?.[i];if(!p||!Number.isInteger(i)||i<0){location.hash="work";return}main.hidden=true;caseView.hidden=false;$(".skip-link").href="#case-study";const returnHash=company?"#company/"+encodeURIComponent(company.id):"#playground";const details=p.details||p.summary;const nextProject=projects.length>1?projects[(i+1)%projects.length]:null;const nextIndex=projects.length>1?(i+1)%projects.length:0;const nextHref="#project/"+slug(group)+"/"+slug(String(nextIndex));const gallery=Array.isArray(p.gallery)?p.gallery:[];const briefs=Array.isArray(p.galleryBriefs)?p.galleryBriefs:[];const galleryItems=gallery.length?gallery.map((img,j)=>visual({title:p.title,image:img,imageBrief:briefs[j]})).join(""):(briefs.length?briefs.map(brief=>visual({title:p.title,imageBrief:brief})).join(""):visual({title:p.title,imageBrief:p.imageBrief}));caseView.innerHTML='<a class="case-back" href="'+returnHash+'">← Back to '+(company?esc(company.name):"playground")+'</a><header class="case-head"><p class="eyebrow">'+esc(company?.name||"PERSONAL WORK")+' / '+esc(p.type)+'</p><h1>'+esc(p.title)+'</h1><p class="case-intro">'+esc(p.summary)+'</p></header><div class="case-hero-visual">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title)+'">':'<div class="hero-image-brief"><span class="brief-kicker">HERO IMAGE TO DESIGN</span><span>'+esc(p.imageBrief||"Add an approved hero visual.")+'</span></div>')+'</div>'+highlightMarkup(p)+'<div class="case-body"><aside class="case-facts"><div class="case-fact"><span class="case-fact-label">Discipline</span><span class="case-fact-value">'+esc(p.type)+'</span></div><div class="case-fact"><span class="case-fact-label">Context</span><span class="case-fact-value">'+esc(company?.name||"Independent")+'</span></div></aside><div class="case-prose"><h2>The challenge & my role</h2><p>'+esc(details)+'</p>'+(p.process?'<h2>Design decisions</h2><p>'+esc(p.process)+'</p>':'')+(p.outcome?'<h2>Deliverables & takeaways</h2><p>'+esc(p.outcome)+'</p>':'')+'</div></div><div class="case-gallery" aria-label="Project image gallery">'+galleryItems+'</div><nav class="case-next-nav" aria-label="Case study navigation"><a class="case-next" href="'+returnHash+'">← Explore more work</a>'+(nextProject?'<a class="case-next" href="'+nextHref+'">Next: '+esc(nextProject.title)+' →</a>':'')+'</nav>';document.title=p.title+" — Lauren Leven";window.scrollTo({top:0,behavior:"instant"});caseView.focus({preventScroll:true})}// Keep focus and scroll position predictable during hash navigation.
let previousHash=safeHash();
function routeWithMotion(){
  const nextHash=safeHash();
  const leavingProject=previousHash.startsWith("project/")&&!nextHash.startsWith("project/");
  const toCompany=nextHash.startsWith("company/")?nextHash.slice(8):null;
  // Avoid shared-element snapshots while moving the expanded panel in the DOM.
  route();
  if(leavingProject){
    requestAnimationFrame(()=>{
      if(toCompany){collection.focus({preventScroll:true});}
      else{const heading=$("#work-title");if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
    });
  }
  if(toCompany){
    requestAnimationFrame(()=>{
      const work=$("#work");
      if(work)window.scrollTo({top:Math.max(0,window.scrollY+work.getBoundingClientRect().top),behavior:"instant"});
      if(!leavingProject)collection.focus({preventScroll:true});
    });
  }
  previousHash=nextHash;
}
window.addEventListener("hashchange",routeWithMotion);route();$("#year").textContent=new Date().getFullYear();if(data.email&&data.email!=="hello@example.com"){const mail="mailto:"+data.email;$("#contact-link").href=mail;$("#email-link").href=mail}else{$("#contact-link").href="#about";$("#email-link").href="#about";$("#email-link").textContent="Contact details coming soon ↗"}

// Small, optional tactile details: no autoplay, no sound, no persistent state.
const footerSecret=document.getElementById("footer-secret");
const footerMessages=["✳","made with curiosity ✦","one more little detail ♡","✳"];
let secretIndex=0;
footerSecret?.addEventListener("click",()=>{
 secretIndex=(secretIndex+1)%footerMessages.length;
 footerSecret.textContent=footerMessages[secretIndex];
 footerSecret.setAttribute("aria-label",footerMessages[secretIndex]==="✳"?"Reveal a little surprise":footerMessages[secretIndex]);
});
