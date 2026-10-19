const data=window.PORTFOLIO;const $=s=>document.querySelector(s);const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));const slug=s=>encodeURIComponent(s);const imageMarkup=(p)=>p.image?'<img loading="lazy" src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title+' project preview')+'">':'<span class="visual-label visual-brief"><span class="brief-kicker">IMAGE TO DESIGN</span><span>'+esc(p.imageBrief||"Add an approved project image or design mockup here.")+'</span></span>';const visual=(p)=>'<div class="project-visual">'+imageMarkup(p)+'</div>';const projectCard=(p,i,group)=>'<article class="project-card" style="--i:'+Number(i)+'"><a class="project-card-link" href="#project/'+slug(group)+'/'+slug(String(i))+'" aria-label="View '+esc(p.title)+' case study">'+visual(p)+'<div class="project-meta"><span>'+esc(p.type)+'</span><span aria-hidden="true">↗</span></div><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary)+'</p></a></article>';const companyGrid=$("#company-grid");companyGrid.innerHTML=data.companies.map((c,i)=>'<button class="company-card '+(c.featured?'featured':'')+'" type="button" data-company="'+esc(c.id)+'" style="--accent:'+esc(c.accent)+';--i:'+i+'" aria-controls="collection" aria-expanded="false"><span class="card-top"><span>'+esc(c.category)+'</span><span aria-hidden="true">↗</span></span><span class="company-name">'+esc(c.name)+'</span><span class="company-description">'+esc(c.description)+'</span><span class="card-bottom">'+c.projects.length+' PROJECT'+(c.projects.length===1?'':'S')+' <span aria-hidden="true">→</span></span></button>').join("");$("#play-grid").innerHTML=data.playground.map((p,i)=>projectCard(p,i,"playground")).join("");const collection=$("#collection");
function openCompany(id,scroll=true){
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
  const wasOpen=!collection.hidden;
  collection.hidden=true;collection.after(companyGrid);companyGrid.hidden=false;companyGrid.dataset.active="";collection.dataset.active="";
  
  document.querySelectorAll(".company-card").forEach(btn=>{btn.setAttribute("aria-expanded","false");});
}
document.querySelectorAll("[data-company]").forEach(btn=>btn.addEventListener("click",()=>{location.hash="company/"+encodeURIComponent(btn.dataset.company)}));
const main=$("#main"),caseView=document.createElement("section");caseView.className="case-view wrap";caseView.hidden=true;caseView.id="case-study";caseView.setAttribute("role","main");caseView.tabIndex=-1;main.after(caseView);function route(){const hash=decodeURIComponent(location.hash.slice(1));if(!hash.startsWith("project/")){$(".skip-link").href="#main";main.hidden=false;caseView.hidden=true;if(hash.startsWith("company/")){const id=hash.slice(8);if(data.companies.some(c=>c.id===id)){openCompany(id,false);document.title=data.companies.find(c=>c.id===id).name+" Projects — Lauren Leven";return}}showCompanies();document.title="Lauren Leven — Visual & Product Designer";return}const parts=hash.split("/"),group=parts[1],i=Number(parts[2]);const company=data.companies.find(c=>c.id===group);const projects=company?company.projects:group==="playground"?data.playground:null;const p=projects?.[i];if(!p||!Number.isInteger(i)){location.hash="work";return}main.hidden=true;caseView.hidden=false;$(".skip-link").href="#case-study";const returnHash=company?"#company/"+encodeURIComponent(company.id):"#playground";const details=p.details||p.summary;const gallery=Array.isArray(p.gallery)?p.gallery:[];const briefs=Array.isArray(p.galleryBriefs)?p.galleryBriefs:[];const galleryItems=gallery.length?gallery.map((img,j)=>visual({title:p.title,image:img,imageBrief:briefs[j]})).join(""):(briefs.length?briefs.map(brief=>visual({title:p.title,imageBrief:brief})).join(""):visual({title:p.title,imageBrief:p.imageBrief}));caseView.innerHTML='<a class="case-back" href="'+returnHash+'">← Back to '+(company?esc(company.name):"playground")+'</a><header class="case-head"><p class="eyebrow">'+esc(company?.name||"PERSONAL WORK")+' / '+esc(p.type)+'</p><h1>'+esc(p.title)+'</h1><p class="case-intro">'+esc(p.summary)+'</p></header><div class="case-hero-visual">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.imageAlt||p.title)+'">':'<div class="hero-image-brief"><span class="brief-kicker">HERO IMAGE TO DESIGN</span><span>'+esc(p.imageBrief||"Add an approved hero visual.")+'</span></div>')+'</div><div class="case-body"><aside class="case-facts"><div class="case-fact"><span class="case-fact-label">Discipline</span><span class="case-fact-value">'+esc(p.type)+'</span></div><div class="case-fact"><span class="case-fact-label">Context</span><span class="case-fact-value">'+esc(company?.name||"Independent")+'</span></div></aside><div class="case-prose"><h2>The project</h2><p>'+esc(details)+'</p>'+(p.process?'<h2>Approach</h2><p>'+esc(p.process)+'</p>':'')+(p.outcome?'<h2>Outcome</h2><p>'+esc(p.outcome)+'</p>':'')+'</div></div><div class="case-gallery" aria-label="Project image gallery">'+galleryItems+'</div><a class="case-next" href="'+returnHash+'">← Explore more work</a>';document.title=p.title+" — Lauren Leven";window.scrollTo({top:0,behavior:"instant"});caseView.focus({preventScroll:true})}// Shared-element navigation: the selected company card morphs into its gallery header.
let previousHash=decodeURIComponent(location.hash.slice(1));
function routeWithMotion(){
  const nextHash=decodeURIComponent(location.hash.slice(1));
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

// About inventory: each slot is text-first until custom item artwork is supplied.
const inventoryDescriptions={
 figma:["Figma","Where the wireframes, UI ideas, and probably-too-many iterations live."],
 illustrator:["Illustrator","Vector shapes, logos, icons, and all the little details."],
 photoshop:["Photoshop","Photo editing, composites, and making the visual idea actually happen."],
 aftereffects:["After Effects","A little movement can make a whole design feel alive."],
 prototyping:["Prototyping","Making things clickable so the idea can speak for itself."],
 sidequests:["Side quests","Illustration, games, and personal projects I get very invested in."]
};
document.querySelectorAll(".inventory-item").forEach(button=>button.addEventListener("click",()=>{
 const entry=inventoryDescriptions[button.dataset.item];if(!entry)return;
 document.querySelectorAll(".inventory-item").forEach(item=>item.setAttribute("aria-pressed",String(item===button)));
 const panel=document.getElementById("inventory-inspect");
 panel.querySelector("strong").textContent=entry[0];panel.querySelector("p").textContent=entry[1];
}));
