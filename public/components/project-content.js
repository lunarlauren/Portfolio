/* Case-study content presentation helpers. No routing or DOM initialization. */
const visualBriefKicker=brief=>{
 const note=String(brief||"").trim();
 if(/^ILLUSTRATIVE\s*\//i.test(note))return "ILLUSTRATIVE · NOT A PRODUCT SCREENSHOT";
 if(/^PLANNED\s*\//i.test(note)||/^Planned hero:/i.test(note))return "PLANNED ARTWORK · NOT YET SUPPLIED";
 if(/^Approved\b/i.test(note))return "APPROVED PRODUCT IMAGE NEEDED";
 if(/\bPROTOTYPE\b/i.test(note))return "PROTOTYPE IMAGE NEEDED";
 return "IMAGE TO ADD · NOT YET SUPPLIED";
};

const illustrativeImageStatus=brief=>/^ILLUSTRATIVE\s*\//i.test(String(brief||"").trim())
 ?'<span class="visual-image-status">ILLUSTRATIVE VISUAL · NOT A PRODUCT SCREENSHOT</span>':"";

const caseHighlights={
 "Connected Planning":[["THE CHALLENGE","Keep related project information understandable across teams."],["DESIGN RATIONALE","Preserve the planning overview while making relationships and supporting details easier to follow."]],
 "Mobile Insights":[["DELIVERY","Shipped product experience; my contribution was mobile UX/UI design."],["DESIGN FOCUS","Readable insight hierarchy with a path to supporting detail."]],
 "Campaigns & Events":[["DESIGN TRADEOFF","A booth wall needs a legible message at a distance; presentations can carry more supporting detail."],["MY DESIGN WORK","Adapted product messages for event signage, presentations, and digital campaign graphics."]],
 "Motion & Storytelling":[["THE CONSTRAINT","About 30 seconds to explain connected planning workflows."],["STORYBOARD APPROACH","Organized short visual beats to balance product detail, legibility, and pacing."]],
 "Customizable Patient Portal":[["MY DESIGN WORK","UX/UI for a patient portal and practice-facing customization."],["DESIGN TENSION","Flexible practice setup while keeping surgery information and next steps clear."]],
 "AI-Assisted IOL Planning":[["INFORMATION PROVENANCE","My UX/UI focus was distinguishing patient measurements and scans from model-generated predictions."],["WORKFLOW RATIONALE","Clarify how predicted information relates to the patient file and a connected application."]],
 "Navigator App":[["DOCUMENTED INPUT","Passenger feedback identified confusion around connecting to ship Wi-Fi."],["MY DESIGN WORK","Prototyped booking and account flows; designed Wi-Fi guidance."]],
 "Stateroom TV App":[["SHIPPED CONTRIBUTION","Stateroom TV interface design, including Voyage Tracker."],["DESIGN FOCUS","Readable voyage information and remote-first focus navigation."]],
 "Forktactics":[["THE IDEA","Make planning a week of dinners feel less exhausting."],["THE STATUS","An independent, evolving product prototype."]],
 "Fallout 76 ;  What I'd Design":[["THE IDEA","Explore design ideas inside a game world I know well."],["THE APPROACH","Concept briefs informed by the game's visual language."]],
 "Illustration & Experiments":[["THE SPACE","Personal work driven by curiosity."],["MY FOCUS","Character, composition, and visual exploration."]]
};

const caseApproachMarkup=p=>typeof p.archiveApproach==="string"&&p.archiveApproach.trim()
 ?'<p class="case-approach"><span class="case-approach-label">Design approach</span><span class="case-approach-text">'+esc(p.archiveApproach.trim())+'</span></p>'
 :"";

const deliveryStampMarkup=p=>projectEvidence[p.title]?.[2]==="Shipped product contribution"
 ?'<p class="case-delivery-stamp">SHIPPED PRODUCT CONTRIBUTION</p>':"";

const evidenceMarkup=p=>{
 const evidence=projectEvidence[p.title];
 if(!evidence)return "";
 const labels=["CONTEXT","MY CONTRIBUTION","DELIVERY"];
 return '<dl class="case-evidence" aria-label="Project overview">'+evidence.map((value,i)=>'<div class="case-evidence-item"><dt class="case-evidence-label">'+labels[i]+'</dt><dd class="case-evidence-value"><strong>'+esc(value)+'</strong></dd></div>').join("")+'</dl>';
};
const highlightMarkup=p=>{const items=caseHighlights[p.title]||[];return items.length?'<div class="case-highlights" role="group" aria-label="Project at a glance">'+items.map(([label,value])=>'<div class="case-highlight"><span class="case-highlight-label">'+esc(label)+'</span><p>'+esc(value)+'</p></div>').join("")+'</div>':""};
const processNotesMarkup=(p,chapterNumber=3)=>{
 const notes=[
  ["evidence","Evidence status","Evidence & boundaries",p.evidence],
  ["rationale","Design reasoning · not test evidence","Design tension & rationale",p.tradeoffs]
 ].filter(([, , ,value])=>typeof value==="string"&&value.trim());
 return notes.length?'<h2 id="case-evidence-notes">'+String(chapterNumber).padStart(2,"0")+' / Evidence &amp; tradeoffs</h2><div class="case-process-notes">'+notes.map(([kind,kicker,heading,value])=>
  '<section class="case-process-note" data-note-kind="'+kind+'"><span class="case-process-note-kicker">'+esc(kicker)+'</span><h3>'+esc(heading)+'</h3><p>'+esc(value)+'</p></section>'
 ).join("")+'</div>':"";
};
const caseFactsMarkup=(p,company)=>{
 const reviewedRole=projectEvidence[p.title]?.[1];
 const facts=[
  ["Discipline",p.type],
  ["My role",reviewedRole],
  ["Context",company?.name||"Independent"],
  ["Audience / scenario",p.audience],
  ["Key constraints",p.constraints]
 ].filter(([,value])=>typeof value==="string"&&value.trim());
 return '<dl class="case-facts" aria-label="Project facts">'+facts.map(([label,value])=>
  '<div class="case-fact"><dt class="case-fact-label">'+esc(label)+'</dt><dd class="case-fact-value">'+esc(value)+'</dd></div>'
 ).join("")+'</dl>';
};
