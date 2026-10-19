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
      title:"Forktactics",type:"Independent Product · UX/UI Design",
      summary:"Tell Forktactics what you like. Get a week of dinners and a grocery list that fits your budget—with a playful trading-card-game twist.",
      details:"The problem isn't a shortage of recipes. It's the daily decision of what to cook, what to buy, and how to stay on budget. Forktactics flips the process: share your tastes and preferences, then let the app propose a week of meals you can review and change. The goal is to make dinner planning feel simple, personal, and a little fun.",
      process:"I started by building an AI-assisted working prototype to test the idea quickly. That let me explore preference-based discovery, generated menus, meal swaps, shared grocery ingredients, cost estimates, and a menu-first weekly dashboard. Just as importantly, it exposed confusing flows, excessive scrolling, and features competing with the main task.\n\nThe prototype helped clarify the product direction: the generated weekly menu should be the hero. I'm now moving into a designer-led redesign, starting from scratch in Figma rather than polishing the prototype indefinitely. I'm keeping the trading-card-game aesthetic as the distinctive hook, while designing the interface, components, and interactions intentionally around ease of use.",
      outcome:"Current stage: a functional, AI-assisted exploratory prototype and a defined direction for the next design phase—not a finished redesign. I'll create the new UI and design system myself, using the prototype as a reference for what works and what needs to change. AI will remain a tool for implementation and iteration, with product and design decisions led by me.",
      imageBrief:"Show the existing Forktactics prototype as an exploration, clearly labeled PROTOTYPE. Replace with original Figma-designed hero visuals once the redesign exists.",
      galleryBriefs:[
        "01 / THE CORE IDEA — Diagram the flow: tell Forktactics your tastes → get a proposed weekly menu → review and swap meals → shop within your budget.",
        "02 / PROTOTYPE EXPLORATION — Real screenshots of the AI-assisted working prototype, labeled as exploratory rather than final design.",
        "03 / WHAT I LEARNED — Annotated prototype screens showing where scrolling, navigation, or competing features distracted from the generated menu.",
        "04 / THE DESIGN DIRECTION — Early original Figma explorations of a TCG-inspired interface that makes choosing meals playful without complicating planning. Work in progress.",
        "05 / DESIGNING THE SYSTEM — Future Figma components: meal cards, states, navigation, typography, spacing, and accessibility decisions. Add when created.",
        "06 / FROM PROTOTYPE TO PRODUCT — Future side-by-side comparison of exploratory prototype and designer-led redesign. Do not present as completed until built."
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
