/* Portfolio routing, project discovery, and case-study rendering. */
const data=window.PORTFOLIO;const $=s=>document.querySelector(s);const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const slug=s=>encodeURIComponent(s);const safeHash=()=>{try{return decodeURIComponent(location.hash.slice(1))}catch{return "work"}};
// Stable, human-readable case-study paths derived from project titles.
const projectSlug=title=>String(title).toLowerCase().normalize("NFKD")
 .replace(/[\u0300-\u036f]/g,"").replace(/&/g," and ")
 .replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const casePath=(group,index)=>{
 const company=data.companies.find(c=>c.id===group);
 const project=(company?.projects||(group==="playground"?data.playground:[]))?.[index];
 return project?"/case-studies/"+slug(group)+"/"+projectSlug(project.title)+"/":"/#work";
};
const caseRoute=()=>{
 const match=location.pathname.match(/^\/case-studies\/([^/]+)\/([^/]+)\/?$/);
 if(!match)return safeHash();
 let group;
 try{group=decodeURIComponent(match[1])}catch{return "work"}
 const company=data.companies.find(c=>c.id===group);
 const projects=company?.projects||(group==="playground"?data.playground:null);
 const index=projects?.findIndex(p=>projectSlug(p.title)===match[2])??-1;
 return index>=0?"project/"+group+"/"+index:"work";
};
const navigateCase=(url)=>{
 history.pushState({caseStudy:true},"",url);
 routeWithMotion();
};const imageMarkup=(p)=>p.image?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title+' project preview')+'">'+illustrativeImageStatus(p.imageBrief):'<span class="visual-label visual-brief"><span class="brief-kicker">'+esc(visualBriefKicker(p.imageBrief))+'</span><span>'+esc(p.imageBrief||"Add an approved project image or design mockup here.")+'</span></span>';const visual=(p)=>'<div class="project-visual">'+imageMarkup(p)+'</div>';// Prefer a reviewed archiveApproach when the case study opens with a question
// or context rather than an action. Otherwise reuse the first process sentence.
// These are editorial excerpts, never inferred research, decisions, or results.
const processTeaser=p=>{
 const curated=String(p.archiveApproach||"").trim();
 if(curated)return curated;
 const text=String(p.process||"").trim();
 return text.match(/^.*?[.!?](?=\s|$)/)?.[0]||text;
};
// Optional archive facts let a recruiter distinguish role from delivery before
// opening a case study. Only render reviewed labels, never inferred metrics.
const archiveFactsMarkup=evidence=>evidence?
 '<dl class="project-card-facts"><div><dt>My contribution</dt><dd>'+esc(evidence[1])+'</dd></div><div><dt>Delivery</dt><dd>'+esc(evidence[2])+'</dd></div></dl>':"";
// Keep card content in one semantic order across desktop and mobile.
// Professional cards lead with the challenge; playground cards stay visual-first.
const projectCard=(p,i,group,evidence)=>{
 const professional=group!=="playground";
 // A short accessible link name plus a challenge summary is more useful than
 // an aria-label that hides all the card's editorial context from link navigation.
 // IDs are unique across client groups and the independent-work gallery.
 const cardId='project-card-'+projectSlug(group)+'-'+Number(i);
 const titleId=cardId+'-title',summaryId=cardId+'-summary',ctaId=cardId+'-cta';
 const title='<h3 id="'+titleId+'"'+(professional?' class="archive-project-title"':'')+'>'+esc(p.title)+'</h3>';
 const preview=professional?title+visual(p):visual(p);
 const meta='<div class="project-meta"><span>'+esc(p.type)+'</span><span aria-hidden="true">↗</span></div>';
 const summary='<p id="'+summaryId+'">'+(professional?'<strong class="project-card-summary-label">The challenge</strong> ':'')+esc(p.summary)+'</p>';
 const approach=processTeaser(p);
 const process=approach?'<p class="project-card-process"><strong>Design approach</strong> '+esc(approach)+'</p>':"";
 const cta='<span id="'+ctaId+'" class="project-card-cta">Read the case study <span aria-hidden="true">→</span></span>';
 return '<article class="project-card" style="--i:'+Number(i)+'"><a class="project-card-link" href="'+casePath(group,i)+'" aria-labelledby="'+titleId+' '+ctaId+'" aria-describedby="'+summaryId+'">'+preview+meta+(professional?'':title)+summary+archiveFactsMarkup(evidence)+process+cta+'</a></article>';
};
// Single source of truth for project discovery. No company gate or repeated
// featured/company lists: each professional project appears exactly once.
// Shared, editorially verified role/delivery labels power both the archive
// cards and the case-study overview. Keep them in sync with content.js.
const projectEvidence={
 "Connected Planning":["Hoylu · Construction software","Product UX and visual design","Product design contribution"],
 "Mobile Insights":["Hoylu · Construction software","Mobile UX and visual design","Shipped product contribution"],
 "Campaigns & Events":["Hoylu · Marketing and events","Event signage and campaign visual design","Produced design assets"],
 "Motion & Storytelling":["Hoylu · Product communications","Storyboard and motion design planning","Storyboard deliverable"],
 "Customizable Patient Portal":["Alcon · Healthcare","UX/UI for patient and practice workflows","Design contribution"],
 "AI-Assisted IOL Planning":["Alcon · Clinical software","UX/UI for connected clinical workflows","Design contribution"],
 "Navigator App":["Holland America Line · Guest experience","Booking, account and Wi-Fi guidance UI","Shipped product contribution"],
 "Stateroom TV App":["Holland America Line · Guest experience","TV interface and remote navigation","Shipped product contribution"],
 "Forktactics":["Independent · Meal planning","Product concept, interaction design and iteration","Evolving prototype"],
 "Fallout 76 ;  What I'd Design":["Unofficial Fallout 76 fan work","Independent concept direction and visual planning","Speculative proposals · not shipped"],
 "Illustration & Experiments":["Independent · Personal creative practice","Illustration and visual exploration","Ongoing practice · gallery briefs planned"]
};

const professionalProjects=data.companies.flatMap(company=>
 company.projects.map((project,index)=>({company,project,index}))
);
const gallery=document.createElement("div");
gallery.className="projects-grid featured-projects-grid notebook-project-index";
gallery.setAttribute("role","list");
gallery.setAttribute("aria-label","Professional design projects");
gallery.innerHTML=professionalProjects.map(({company,project,index},order)=>
 '<div class="featured-project client-file client-file--'+esc(company.id)+'" role="listitem"><p class="eyebrow"><span class="client-file-label">'+esc(company.name)+'</span> <span class="client-file-number">FILE '+String(order+1).padStart(2,"0")+'</span> · '+esc(project.type)+'</p>'+
 projectCard(project,index,company.id,projectEvidence[project.title])+'</div>'
).join("");
$("#work").append(gallery);

// Populate the independent-work section from the same project data used by
// case-study routing. An empty #play-grid otherwise leaves a blank dark panel.
const playGrid=$("#play-grid");
if(playGrid&&Array.isArray(data.playground)){
 playGrid.innerHTML=data.playground.map((project,index)=>
  projectCard(project,index,"playground")
 ).join("");
}


const main=$("#main"),caseView=document.createElement("section");caseView.className="case-view wrap";caseView.hidden=true;caseView.id="case-study";caseView.setAttribute("role","main");caseView.setAttribute("aria-labelledby","case-title");caseView.tabIndex=-1;main.after(caseView);
// A case-study route temporarily replaces SEO/share metadata. Preserve the
// actual homepage values from index.html so browser Back, archive links, and
// hash navigation cannot leave a different project's preview behind.
const homeMetaSelectors=[
 'meta[name="description"]','meta[property="og:title"]',
 'meta[property="og:description"]','meta[property="og:url"]',
 'meta[name="twitter:title"]','meta[name="twitter:description"]'
];
const homeMetadata={
 title:document.title,
 canonical:document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
 tags:homeMetaSelectors.map(selector=>[selector,document.querySelector(selector)?.getAttribute("content")])
};
function restoreHomeMetadata(){
 document.title=homeMetadata.title;
 if(homeMetadata.canonical!==null)document.querySelector('link[rel="canonical"]')?.setAttribute("href",homeMetadata.canonical);
 for(const [selector,value] of homeMetadata.tags){
  if(value!==null)document.querySelector(selector)?.setAttribute("content",value);
 }
}
function route(){const hash=caseRoute();if(!hash.startsWith("project/")){
 // An unknown or renamed deep link currently resolves to the Work archive.
 // Normalize the URL as well, so the homepage never appears under a stale
 // /case-studies/... address (and its canonical/share metadata stay truthful).
 // Replace rather than push: Back should not revisit the broken address.
 if(location.pathname.startsWith("/case-studies/"))history.replaceState(null,"","/#work");
 // Chapter tracking belongs only to the visible case study. Disconnect on
 // exit so a hidden heading cannot keep updating the old chapter index.
 if(window.caseSectionObserver){window.caseSectionObserver.disconnect();window.caseSectionObserver=null;}
 $(".skip-link").href="#main";main.hidden=false;caseView.hidden=true;if(hash.startsWith("company/")){location.replace("#work");return}
 restoreHomeMetadata();
 return}return renderCaseStudy(hash)}
// Remember where a visitor opened a case study so Back returns to the
// same project card, rather than dumping them at the beginning of Work.
// This is intentionally in-memory: a directly linked case study has no opener.
let caseOpener=null;
let caseOpenerScroll=0;
document.addEventListener("click",event=>{
 const link=event.target.closest('a[href^="/case-studies/"]');
 // Only remember an opener for same-tab navigation. Modified clicks open
 // another browsing context and must not overwrite this page's return target.
 if(!link||!main.contains(link)||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==="_blank"||link.hasAttribute("download"))return;
 caseOpener=link;
 caseOpenerScroll=window.scrollY;
});
// Keep focus and scroll position predictable during hash navigation.
let previousHash=caseRoute();
function routeWithMotion(){
 const nextHash=caseRoute();
 const leavingProject=previousHash.startsWith("project/")&&!nextHash.startsWith("project/");
 route();
 // Restore focus only for explicit return-to-gallery navigation.
 // Other destinations (e.g. About or the top of the page) keep native hash focus.
 if(leavingProject&&(nextHash==="work"||nextHash==="playground")){
  requestAnimationFrame(()=>{
   if(caseOpener&&caseOpener.isConnected&&!main.hidden){
    window.scrollTo({top:caseOpenerScroll,behavior:"auto"});
    caseOpener.focus({preventScroll:true});
   }else{
    const heading=$(nextHash==="playground"?"#playground-title":"#work-title");
    if(heading&&!main.hidden){heading.tabIndex=-1;heading.focus({preventScroll:true});}
   }
   caseOpener=null;
  });
 }
 // A routed case study is removed from the accessibility tree on exit.
 // For other destinations, move focus to the visible section so keyboard
 // and screen-reader users aren't left focused inside the hidden view.
 if(leavingProject&&nextHash!=="work"&&nextHash!=="playground"){
  requestAnimationFrame(()=>{
   const id=nextHash.split("/")[0];
   const destination=document.getElementById(id)||main;
   if(!main.hidden&&destination){
    if(!destination.hasAttribute("tabindex"))destination.setAttribute("tabindex","-1");
    destination.focus({preventScroll:true});
   }
   // An opener from an earlier gallery visit must not be reused after
   // navigating elsewhere and then opening a different case study.
   caseOpener=null;
  });
 }
 previousHash=nextHash;
}
document.addEventListener("click",event=>{
 const link=event.target.closest('a[href^="/case-studies/"]');
 if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 event.preventDefault();
 navigateCase(link.getAttribute("href"));
});
document.addEventListener("click",event=>{
 const link=event.target.closest('a[href^="#"]');
 if(!link||!location.pathname.startsWith("/case-studies/")||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
 const hash=link.getAttribute("href");
 if(!["#top","#main","#work","#playground","#about"].includes(hash))return;
 event.preventDefault();
 history.pushState(null,"","/"+hash);
 routeWithMotion();
 requestAnimationFrame(()=>{
  const destination=document.querySelector(hash);
  if(destination&&!main.hidden)destination.scrollIntoView({behavior:"auto",block:"start"});
 });
});
window.addEventListener("popstate",routeWithMotion);
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
  const hash=caseRoute();
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
  // The contact CTA is the last meaningful destination, even when the footer
  // or browser viewport prevents it from reaching the normal scrollspy line.
  const contactRect=contactCTA?.getBoundingClientRect();
  const contactVisible=contactRect&&!main.hidden&&contactRect.top<window.innerHeight*.82&&contactRect.bottom>0;
  const nearEnd=document.documentElement.scrollHeight-(window.scrollY+window.innerHeight)<Math.max(96,window.innerHeight*.2);
  if(!hash.startsWith("project/")&&contactVisible&&nearEnd)active="contact";
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
