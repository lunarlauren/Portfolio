/* Portfolio editorial content.
   Drafts are based on known work themes, not verified client results.
   Replace review notes and add approved imagery before publishing externally.
   Images: set image to a file in public/images; gallery can contain image paths.
   imageBrief and galleryBriefs appear as descriptive placeholders until then. */
window.PORTFOLIO = {
  email: "hello@example.com",
  companies: [
    {
      id:"hoylu", name:"Hoylu", category:"PRODUCT · BRAND · MOTION",
      description:"Designing clearer ways to communicate, plan, and collaborate in the complexity of construction.",
      accent:"#ffacd3", featured:true,
      projects:[
        {
          title:"Connected Planning", type:"Product UX",
          summary:"Turning complex construction planning into a more connected, understandable product experience.",
          details:"Construction planning brings schedules, teams, dependencies, and changing project information into the same conversation. This case study explores how a product experience can make that complexity easier to navigate, with stronger information hierarchy and clearer relationships between work, people, and project context.",
          process:"Frame the key planning questions first: what has changed, who needs to know, and what should happen next? Map the relationships between project-level information and the views different stakeholders need. Use progressive disclosure, consistent visual language, and realistic construction scenarios to guide the interface.",
          outcome:"Portfolio focus: show the design reasoning, interaction decisions, and iteration behind connected planning. Add validated launch details or measurable outcomes only when approved.",
          imageBrief:"Hero composition: a polished desktop construction-planning interface showing a project overview, linked schedule items, and a focused detail panel. Use realistic but anonymized sample data.",
          galleryBriefs:[
            "Before-and-after information architecture: disconnected boards versus a unified project hierarchy, with clear labels and arrows.",
            "Three-screen UX sequence: project overview → planning item → stakeholder detail, annotated with key interaction decisions.",
            "Responsive UI mockups: desktop planning workspace beside a compact tablet or mobile review state."
          ]
        },
        {
          title:"Mobile Insights", type:"UX / UI",
          summary:"Bringing the right construction project information to people who need answers away from their desks.",
          details:"A mobile experience has to respect limited space and limited attention. This exploration focuses on translating dense project information into glanceable status, useful priorities, and a clear path from summary to detail.",
          process:"Start with field-friendly tasks: check progress, spot changes, understand risk, and follow up. Prioritize the highest-value information, establish a readable hierarchy, and design touch targets and states that work in real-world conditions.",
          outcome:"Portfolio focus: demonstrate mobile-first prioritization, legibility, and how a complex desktop workflow becomes a useful on-the-go experience. Confirm which screens can be shown publicly.",
          imageBrief:"Hero composition: three mobile screens displaying a construction project dashboard, an insight detail, and a status update; include realistic charts and clear labels.",
          galleryBriefs:[
            "Mobile user-flow diagram showing how a site lead moves from an alert to the affected planning item.",
            "Side-by-side early wireframe and refined high-fidelity screen with annotations on hierarchy and spacing.",
            "Close-up component sheet: insight cards, status chips, filters, and accessible interaction states."
          ]
        },
        {
          title:"Campaigns & Events", type:"Visual Design",
          summary:"Making a complex construction technology story approachable across campaigns, events, and physical spaces.",
          details:"Marketing design for a technical product has to earn attention quickly while remaining accurate. This collection brings together visual storytelling across event environments, presentations, and campaign assets—formats that must communicate clearly at dramatically different scales.",
          process:"Distill each message to a simple visual idea, then adapt it into a flexible system. Consider distance, viewing time, contrast, and production constraints for booth signage; carry the same hierarchy into smaller digital and print touchpoints.",
          outcome:"Portfolio focus: show the consistency of the system across formats, from large environmental graphics to small campaign assets. Add photographs and approved deliverables as available.",
          imageBrief:"Hero composition: realistic trade-show booth mockup featuring large Hoylu signage, a screen, and a clear product message; use approved branding.",
          galleryBriefs:[
            "Wide environmental mockup showing booth walls, screen placements, and scale relative to visitors.",
            "Flat campaign asset lineup: LinkedIn banner, presentation cover, email graphic, and printed collateral.",
            "Close-up typography and layout details showing how the visual system scales from large-format signage to digital."
          ]
        },
        {
          title:"Motion & Storytelling", type:"Motion Design",
          summary:"Explaining platform ideas through concise, approachable visual narratives.",
          details:"Some product ideas are easier to understand in motion. This case study looks at how interface-inspired animation and purposeful transitions can explain relationships, changes, and workflows without overwhelming the viewer.",
          process:"Begin with the single takeaway the audience should remember. Build a storyboard around a clear opening, visual progression, and resolution. Use restrained motion, consistent visual metaphors, and pacing that allows technical ideas to land.",
          outcome:"Portfolio focus: present the storyboard-to-animation process. Include a final video or approved excerpt when available; do not imply unverified campaign performance.",
          imageBrief:"Hero composition: cinematic 16:9 storyboard keyframe with connected project nodes, interface panels, and motion paths in Hoylu's visual language.",
          galleryBriefs:[
            "Six-frame storyboard strip showing the progression of a 30-second product explainer.",
            "Motion style frames: typography, shapes, transitions, and color hierarchy on a dark and light background.",
            "Production timeline or sequence diagram connecting narration beats to on-screen visuals."
          ]
        }
      ]
    },
    {
      id:"alcon",name:"Alcon",category:"HEALTHCARE PRODUCT UX",
      description:"Patient-facing surgical communication and clinician-facing AI-assisted IOL planning workflows.",
      accent:"#fff0dc",
      projects:[
        {
          title:"Customizable Patient Portal",type:"UX/UI Design · Patient Experience",
          summary:"A practice-customizable patient portal for sharing surgical documents, preparation instructions, and important care information.",
          details:"This patient-facing application gave practices a way to tailor the portal experience to their needs and share surgery-related information with patients. The design challenge was to balance practice-level customization with a clear, reassuring experience for people preparing for a procedure.",
          process:"Case-study angle: demonstrate the relationship between practice configuration and the patient experience. Show how important documents, surgery instructions, and patient information can be organized for clarity. Show your actual wireframes, interface iterations, and UX decisions; add research or testing details only if you conducted them.",
          outcome:"UX/UI design work completed. Deployment, adoption, and measured patient outcomes are not confirmed.",
          imageBrief:"Hero to design: two connected views—practice customization dashboard on desktop and a patient portal on mobile, showing surgery information, a document list, and clear next steps. Use fictional patient data.",
          galleryBriefs:[
            "Practice setup flow: configurable branding, information modules, and the resulting patient-facing preview.",
            "Patient journey: surgery overview, preparation instructions, documents, and follow-up information in a clear sequence.",
            "Document delivery detail: example surgery packet, read/download states, and a reassuring information hierarchy using fictional records."
          ]
        },
        {
          title:"AI-Assisted IOL Planning",type:"UX/UI Design · Clinical Tools",
          summary:"Connecting patient measurements, scans, and clinician-trained AI predictions to an IOL prescription planning workflow.",
          details:"This clinician-facing system supported doctors in training an AI model on intraocular lens (IOL) prescription decisions using patient data and scans. The predicted information was then associated with the patient's file and passed into another application, creating a connected workflow across clinical tools.",
          process:"Case-study angle: map the end-to-end journey from patient data and imaging through clinician model training, predicted IOL information, and downstream patient-file use. Emphasize clear distinctions between source measurements, model predictions, and clinician decisions. Use your actual UX flows, screen designs, and interaction decisions to explain your contribution.",
          outcome:"UX/UI design work completed. Deployment, adoption, prediction accuracy, and clinical outcomes are not confirmed.",
          imageBrief:"Hero to design: connected clinical application screens with anonymized patient scan thumbnails, a model-training or review interface, and predicted IOL information flowing into a patient record. Label predictions clearly as AI-generated.",
          galleryBriefs:[
            "System flow diagram: patient data and scans → clinician-guided model training → prediction → patient file → connected application.",
            "Clinician interface concept: anonymized measurements, scan previews, training/review controls, and clear model-output labeling.",
            "Patient record detail: side-by-side source measurements and predicted IOL information, with visual cues separating AI output from clinician-reviewed data."
          ]
        }
      ]
    },
    {
      id:"holland-america",name:"Holland America Line",category:"BRAND · VISUAL DESIGN",
      description:"Brand and visual storytelling work. The draft below awaits confirmed project details and approved imagery.",
      accent:"#203d64",
      projects:[
        {
          title:"Travel Brand Storytelling",type:"Brand & Visual Design · Draft",
          summary:"A proposed showcase for translating a distinctive travel brand into engaging visual communications.",
          details:"EDITORIAL DRAFT — Specific responsibilities and deliverables have not yet been supplied. This framework emphasizes the interplay between evocative imagery, refined typography, and practical communication across travel-related touchpoints.",
          process:"Replace with the actual assignment, audience, brand requirements, creative explorations, and final execution. Explain which decisions were yours and how they served the brief.",
          outcome:"TO VERIFY — Add approved deliverables and factual outcomes when available.",
          imageBrief:"Hero suggestion: approved Holland America Line campaign key art featuring destination photography, refined typography, and a premium editorial composition.",
          galleryBriefs:[
            "Suggested visual: approved campaign artwork adapted for web, email, and print.",
            "Suggested visual: detail of typography and image treatment with brand consistency notes.",
            "Suggested visual: realistic mockup of a final approved customer-facing touchpoint."
          ]
        }
      ]
    }
  ],
  playground:[
    {
      title:"Forktactics",type:"Independent Product · UX/UI · Creative Direction",
      summary:"A playful, budget-conscious meal-planning PWA that connects recipe discovery, weekly menus, grocery planning, and cooking progress.",
      details:"THE CHALLENGE — Planning dinner is not one decision. It means choosing meals people actually want, estimating the cost of ingredients, avoiding duplicate purchases, accounting for leftovers, and remembering what has already been cooked. I started Forktactics (originally YumPlan, then SupperPal) to bring that fragmented process into one approachable experience.\n\nTHE PRODUCT — Forktactics combines a recipe collection, preference-led discovery, weekly dinner planning, consolidated shopping, and cook tracking. Instead of asking users to build a rigid calendar first, the experience encourages exploring more meals than needed, previewing a proposed week, and committing only when the menu feels right. A grocery list translates those choices into a practical shopping trip, with overlapping ingredients and estimated costs visible in context.\n\nMY ROLE — Independent product creator responsible for defining the problem, feature priorities, user flows, UX/UI, visual identity, responsive interaction design, and iterative implementation and testing. Development has involved AI-assisted coding and GitHub-based review and cleanup; this is a self-directed product rather than a commissioned client engagement.",
      process:"01 / FRAME THE PROBLEM — I began with everyday constraints: a limited grocery budget, repetitive meal choices, ingredient waste, and the friction of planning dinners across several disconnected tools. The design principle became simple: make the next useful action obvious.\n\n02 / DESIGN THE LOOP — The core journey connects Discover → Plan → Preview → Shop → Cook → Start a new week. Discovery supports meal preferences, filters, and quick positive/negative decisions; planning accommodates more candidate meals than available dinner slots, leftovers, and an editable preview before commitment. The weekly menu became the dashboard's primary focus, with clear cooked/not-cooked states and a visible new-week action.\n\n03 / MAKE SHOPPING PRACTICAL — Recipe selections feed a combined grocery list. Work on ingredient overlap, quantities, package estimates, budget feedback, check-off controls, and manual adjustments addressed the gap between a recipe ingredient list and what someone actually buys. Cost figures are estimates, not verified live store prices.\n\n04 / DEVELOP A DISTINCT IDENTITY — The product evolved through YumPlan and SupperPal into Forktactics, a fork-and-cards identity inspired by tabletop and trading-card games. The visual system explored cozy pixel-RPG, cyberpunk, modern, and TCG-inspired treatments. The challenge was keeping each theme expressive without sacrificing consistency, contrast, or readability.\n\n05 / ITERATE IN REAL CONDITIONS — Mobile testing exposed cards that required too much scrolling, gesture conflicts between swiping and page movement, crowded navigation, visual-theme leakage, and unclear planning states. Iterations simplified the home dashboard, made the weekly menu the hero, refined card sizing and navigation, and prioritized tap targets and feedback.\n\n06 / DESIGN FOR CONTINUITY — As the prototype grew, the work expanded to local data persistence, saved recipes, cooking progress, photos, shopping data, backup/recovery, PWA/offline behavior, and safer code changes. GitHub pull requests, automated checks, staging, and refactoring became part of the product-design process—not separate from it.",
      outcome:"CURRENT STATE — An actively developed independent web app with a responsive, installable PWA experience and connected meal-planning workflows. The project demonstrates end-to-end product thinking, interaction design, visual-system exploration, and iteration based on observed usability problems. Some features and implementation details remain under refinement; no public adoption, grocery savings, or usability metrics are claimed.\n\nWHAT I LEARNED — Adding functionality is often easier than making it feel effortless. The most valuable iterations were about reducing competing choices, clarifying what happens next, and keeping the interface understandable even as the underlying planning logic grew more complex.",
      imageBrief:"Use a real Forktactics screenshot as the hero: the redesigned mobile weekly-menu dashboard, with the fork-and-cards identity and clear cooked/not-cooked meal states. Pair with a restrained desktop view; avoid inventing finished screens.",
      galleryBriefs:[
        "01 / The problem and product loop: a simple journey map connecting Discover → Plan → Preview → Shop → Cook, alongside actual screens.",
        "02 / Before and after: early YumPlan/SupperPal planning screens compared with the simplified Forktactics weekly-menu dashboard, annotated with concrete usability decisions.",
        "03 / Recipe discovery: real card-based browsing, preferences, filtering, and the swipe-versus-scroll interaction challenge.",
        "04 / Grocery logic: an actual consolidated shopping list showing ingredient overlap, quantity controls, and estimated budget—not live retailer prices.",
        "05 / Design system: fork-and-cards identity and selected cozy, cyberpunk, modern, and TCG-inspired UI treatments, noting consistency and accessibility refinements.",
        "06 / Product craft: responsive layouts, installable PWA, saved-data continuity, and a concise view of iteration through staging, testing, and code cleanup."
      ]
    },
    {
      title:"Fallout 76 Environments",type:"Game Environment Design",
      summary:"Building atmospheric, story-rich spaces that reward exploration and make players curious.",
      details:"Building in Fallout 76 is a form of environmental storytelling: architecture, lighting, props, and routes imply a narrative without needing a line of dialogue. My builds explore how spaces can feel inhabited, unsettling, playful, or unexpectedly believable.",
      process:"Start with a concept and a story the environment should tell. Block out the route, plan key sightlines, layer recognizable details, and use light, contrast, and prop placement to guide the visitor through the scene.",
      outcome:"A growing body of personal worldbuilding work, including a slasher-themed hospital environment. Show finished screenshots alongside layout decisions and behind-the-scenes construction.",
      imageBrief:"Hero composition: wide in-game screenshot of the horror hospital exterior or lobby, emphasizing architecture, atmosphere, and environmental clues.",
      galleryBriefs:[
        "Wide in-game interior showing the hospital's storytelling through props, signage, and lighting.",
        "Overhead or diagrammatic floor plan highlighting visitor flow, ramps, stairs, and narrative beats.",
        "Three cinematic close-ups of environmental details that reward exploration."
      ]
    },
    {
      title:"Illustration & Experiments",type:"Personal Creative Practice",
      summary:"Characters, playful visual systems, and experiments that keep curiosity at the center of my process.",
      details:"Personal work gives me room to try styles, materials, and ideas without a conventional brief. It is where I develop characters, explore unexpected visual directions, and practice translating rough concepts into finished compositions.",
      process:"Collect references, sketch rapidly, test silhouettes and color relationships, then refine the strongest ideas. Keep the early studies visible: the experimentation is often as interesting as the finished image.",
      outcome:"An evolving collection rather than a single campaign. Curate a small number of strong pieces and show the decisions that connect sketch to final artwork.",
      imageBrief:"Hero composition: editorial collage of original character illustrations, color studies, and selected polished artwork on a restrained background.",
      galleryBriefs:[
        "Character development sheet: silhouettes, expressions, palettes, and final poses.",
        "Process comparison: rough sketch, refined linework, and final colored illustration.",
        "Curated mini-gallery of three visually distinct personal pieces with short captions."
      ]
    }
  ]
};
