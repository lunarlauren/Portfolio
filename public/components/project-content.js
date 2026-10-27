/* Case-study content presentation helpers. No routing or DOM initialization. */
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
 "Fallout 76 ;  What I'd Design":[["THE IDEA","Explore design ideas inside a game world I know well."],["THE APPROACH","Concept briefs informed by the game's visual language."]],
 "Illustration & Experiments":[["THE SPACE","Personal work driven by curiosity."],["MY FOCUS","Character, composition, and visual exploration."]]
};
// Handoff: these labels summarize documented contributions, not invented outcomes.
// Update alongside content.js when the scope or delivery status is confirmed.

const evidenceMarkup=p=>{
 const evidence=projectEvidence[p.title];
 if(!evidence)return "";
 const labels=["CONTEXT","MY CONTRIBUTION","DELIVERY"];
 return '<div class="case-evidence" role="group" aria-label="Project overview">'+evidence.map((value,i)=>'<div class="case-evidence-item"><span class="case-evidence-label">'+labels[i]+'</span><strong>'+esc(value)+'</strong></div>').join("")+'</div>';
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
// A semantic project-facts list makes audience and constraints scannable.
// These fields summarize documented context; a design scenario is not a
// claim that persona research or testing took place.
const caseFactsMarkup=(p,company)=>{
 const facts=[
  ["Discipline",p.type],
  ["Context",company?.name||"Independent"],
  ["Audience / scenario",p.audience],
  ["Key constraints",p.constraints]
 ].filter(([,value])=>typeof value==="string"&&value.trim());
 return '<dl class="case-facts" aria-label="Project facts">'+facts.map(([label,value])=>
  '<div class="case-fact"><dt class="case-fact-label">'+esc(label)+'</dt><dd class="case-fact-value">'+esc(value)+'</dd></div>'
 ).join("")+'</dl>';
};
