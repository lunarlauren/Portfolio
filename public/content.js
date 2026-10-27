/* Portfolio editorial content.
   Fictional impact-writing samples live in docs/ILLUSTRATIVE_IMPACT_EXAMPLES.md,
   not in these published outcomes. Do not add unverified metrics here.
   Drafts are based on known work themes, not verified client results.
   Replace review notes and add approved imagery before publishing externally.
   Images: set image to a file in public/images; gallery can contain image paths.
   imageBrief and galleryBriefs appear as descriptive placeholders until then.
   audience and constraints are editorial summaries of documented context;
   explicitly label design scenarios that are not validated research personas.
   ILLUSTRATIVE briefs request new explanatory artwork, not documented output;
   approved-screen requests for shipped products must use real approved assets. */
window.PORTFOLIO = {
  email: "bertinoln@gmail.com",
  companies: [
    {
      id:"hoylu", name:"Hoylu", category:"PRODUCT · BRAND · MOTION",
      description:"Construction planning has a lot of moving pieces. At Hoylu, I worked on product UX and visual communication to help people see the bigger picture without losing the details.",
      accent:"#ffacd3", featured:true,
      projects:[
        {
          title:"Connected Planning", type:"Product UX",
          audience:"Construction teams coordinating plans and decisions (design context; not a research-validated persona).",
          constraints:"Interrelated schedules, stakeholders and planning details; preserving context while making detail findable.",
          summary:"When every team has a different piece of the plan, finding the full picture gets messy. I worked on making connected project information easier to follow.",
          archiveApproach:"I focused on keeping the overview useful, clarifying relationships between views, and providing a path into the details.",
          details:"A construction plan is rarely just one plan. Different people need different pieces of information, but those pieces still have to connect. At Hoylu, I worked on the UX and visual structure of connected planning: how someone gets oriented, understands the relationships between items, and follows the detail behind a decision. My job was to make a complicated workflow easier to read without pretending the complexity wasn't there.",
          process:"I started with a simple question: if someone notices a problem in the overall plan, how do they find the item behind it? That led me to focus on three decisions: keep the project overview useful, make relationships between views understandable, and give people a clear path into the details. These describe the areas I designed around; I don't have documented testing results for a particular flow.",
          evidence:"Confirmed scope: product UX and visual design contributions to Hoylu's construction-planning experience. The case-study materials supplied here do not establish a specific research method, tested prototype, launch date, or measured outcome for this project.",
          tradeoffs:"The tricky part was deciding how much of the plan to show at once. Too much and it's overwhelming; too little and people lose the context behind a decision. I explored ways to keep the big picture visible while making the next useful detail easier to find. These are design directions, not a claim that one was proven to win.",
          outcome:"I contributed product UX and visual design to Hoylu's connected-planning experience, with an emphasis on making related project information easier to follow. The concrete story here is the problem and my design contribution; I don't have a verified performance metric to attach to it.",
          imageBrief:"ILLUSTRATIVE / Proposed desktop planning interface with project overview, linked schedule items, and focused detail. Use fictional project data; not a screenshot of a verified shipped flow.",
          galleryBriefs:[
            "ILLUSTRATIVE / Side-by-side information architecture concepts comparing fragmented and unified navigation. Not a documented before-and-after or validated iteration.",
            "ILLUSTRATIVE / Proposed three-screen sequence: project overview → planning item → stakeholder detail. Annotations explain design rationale, not verified implementation decisions.",
            "ILLUSTRATIVE / Proposed responsive desktop and mobile planning states; not screenshots of delivered interfaces."
          ]
        },
        {
          title:"Mobile Insights", type:"UX / UI",
          audience:"Project managers checking project information away from a desktop (design scenario, not documented persona research).",
          constraints:"Small-screen readability and touch interaction; balancing quick status checks with supporting context.",
          summary:"A desktop dashboard doesn't belong on a phone unchanged. I focused on what project managers need to notice first—and how they can get to the details.",
          archiveApproach:"I focused on insight-card hierarchy, readable summaries, supporting detail, and touch-friendly interaction.",
          details:"Hoylu Mobile Insights is a shipped product experience. My role was UX/UI design for its mobile insights work, framed around project managers checking construction-project information away from a desktop. A dashboard cannot simply be squeezed onto a phone: status, changes, and supporting context compete for limited space. The challenge was to make short checks useful without stripping away the information needed to understand an insight. This audience scenario is design framing, not a claim of documented user research.",
          process:"I explored the mobile UX story as a sequence of questions: what should someone notice first, what context explains it, and where should they go for detail? My design focus included the hierarchy of insight cards, summary information, and supporting detail, alongside legibility and touch-friendly interaction. The key rationale was to prioritize a quick status check while preserving a path to deeper context. This describes design exploration, not verified test findings or a claim that every explored interaction shipped.",
          // Editorial evidence boundary: these notes distinguish confirmed delivery
          // from design rationale. Replace only when approved source material exists.
          evidence:"Confirmed: I contributed UX/UI design to Hoylu's shipped Mobile Insights experience. Interview findings, usability-test results, specific iteration rounds, implementation handoff details, collaboration records, and usage metrics have not been provided for this case study; none are presented as verified evidence.",
          tradeoffs:"On a phone, every piece of information is competing for space. I wanted the important update to be obvious without turning the rest into a scavenger hunt. The question became: what belongs up front, and what can wait until someone taps for more?",
          outcome:"Shipped UX/UI contribution to Hoylu's mobile insights experience, focused on legible information hierarchy and useful next steps on smaller screens. This case study describes my design contribution and delivery status; adoption or performance metrics have not been verified for publication.",
          // These are proposed portfolio illustrations, not source artifacts from
          // the shipped product. Do not present them as screenshots or tested flows.
          imageBrief:"ILLUSTRATIVE / Proposed hero mockup (not a screenshot of shipped screens): three mobile views explaining an insight overview, supporting detail, and a status update. Use fictional project data.",
          galleryBriefs:[
            "ILLUSTRATIVE / Proposed user-flow diagram: a project manager moves from a status insight to supporting project detail. Not a documented shipped flow.",
            "ILLUSTRATIVE / Wireframe-to-layout comparison explaining information hierarchy; not a record of verified iteration rounds.",
            "ILLUSTRATIVE / Component study of insight cards, status chips, filters, and touch states; not verified production UI."
          ]
        },
        {
          title:"Campaigns & Events", type:"Visual Design",
          audience:"Construction-technology event visitors and digital audiences (format-based design framing).",
          constraints:"Viewing distance, legibility and different display formats, including 65-inch and 40-inch screens.",
          summary:"A trade-show wall gets a few seconds. A campaign graphic gets even less. I designed for both.",
          details:"At Hoylu, I worked on visual communications for a construction technology audience across marketing and event touchpoints. The challenge changes with the format: a social graphic has seconds to earn attention, while a booth wall must communicate from across a room. Both need a clear message, recognizable brand, and a useful visual hierarchy.",
          process:"I translated product messages into layouts for event booth signage, presentation assets, and digital campaign graphics. For large-format work, I considered viewing distance, display proportions, and how printed graphics relate to nearby screens, including 65-inch and 40-inch displays. I adjusted the information hierarchy for each setting: a short, legible message from across a room versus more supporting detail at screen-reading distance. These are documented design considerations, not results of a comparative audience study.",
          // The formats and design scope are documented; event/campaign performance is not.
          evidence:"Documented contribution: visual design for Hoylu event signage, presentation materials, and digital campaigns, with layout considerations for 65-inch and 40-inch displays. The materials available for this case study do not establish formal audience research, tested variants, event lead counts, or campaign performance.",
          tradeoffs:"A booth wall has to make sense from across the room. A presentation can tell a longer story. I didn't want to squeeze the same layout into every format. I used scale, type hierarchy, and consistent branding to adapt the message rather than treating every format as the same canvas. This describes my design rationale, not a measured comparison of alternatives.",
          outcome:"Created visual assets for Hoylu's event and digital communication formats, adapting the product story to environmental signage, presentations, and campaign graphics. The deliverables are design contributions; audience response, lead generation, and marketing impact have not been quantified here.",
          imageBrief:"ILLUSTRATIVE / Proposed trade-show booth mockup with Hoylu signage, a screen, and a clear product message. Use approved branding; not a photograph of the delivered booth.",
          galleryBriefs:[
            "ILLUSTRATIVE / Proposed environmental mockup showing booth walls, screen placements, and scale relative to visitors; not an as-built event photograph.",
            "ILLUSTRATIVE / Proposed campaign asset lineup: LinkedIn banner, presentation cover, email graphic, and printed collateral. Not evidence that every format was produced.",
            "ILLUSTRATIVE / Proposed typography and layout study showing how a visual system could scale from large-format signage to digital; not a documented comparison of delivered variants."
          ]
        },
        {
          title:"Motion & Storytelling", type:"Motion Design",
          audience:"Viewers needing a quick introduction to the product (communication goal, not audience-study findings).",
          constraints:"Approximately 30 seconds to explain connected workflows without overloading individual frames.",
          summary:"Thirty seconds isn't long to explain construction software. That's what makes every frame matter.",
          details:"Construction planning software has relationships and changes over time that are difficult to communicate in a still image. At Hoylu, my documented contribution included a storyboard for an approximately 30-second product explainer. The audience challenge was to help a viewer understand the product idea quickly, without assuming familiarity with its workflows. My role here was visual storytelling and motion-design planning; a completed animation or production handoff has not been confirmed for this case study.",
          process:"The storyboard organized the explanation into short visual beats: establish the product idea, show how information connects, then leave enough time for the viewer to understand the relationship. Within a roughly 30-second runtime, pacing and legibility compete with the amount of detail that can be shown. The rationale was to give each frame one clear communication job and maintain a consistent visual language. Specific rounds of exploration, review feedback, and implementation collaboration have not been documented, so they are not presented as completed steps.",
          // A storyboard is documented; final animation, research and performance are not.
          evidence:"Documented scope: a short-form, approximately 30-second Hoylu product storyboard and motion-design planning. The intended viewer and communication needs are design framing, not findings from a recorded audience study. Interview findings, formal testing, review rounds, final animation delivery, and audience metrics have not been supplied.",
          tradeoffs:"Thirty seconds goes by fast. I had to decide what viewers absolutely needed to understand and what could wait. The frame-by-frame hierarchy and pacing described here are storyboard rationale, not a claim that alternatives were tested or that a finished video improved comprehension.",
          outcome:"Delivered work documented here: storyboard and motion-design planning for a short product explainer. Completion or release of a final animation, production implementation, and measured audience outcomes have not been verified.",
          imageBrief:"ILLUSTRATIVE / Proposed 16:9 storyboard keyframe with connected project nodes, interface panels, and motion paths. Not an exported frame from the documented storyboard.",
          galleryBriefs:[
            "ILLUSTRATIVE / Proposed six-frame storyboard strip for an approximately 30-second explainer; not the original delivered storyboard or a finished animation.",
            "ILLUSTRATIVE / Proposed motion style frames exploring typography, shapes, transitions, and color hierarchy; not verified production frames or documented iteration rounds.",
            "ILLUSTRATIVE / Proposed narration-to-visual sequence diagram; not a documented production timeline or handoff artifact."
          ]
        }
      ]
    },
    {
      id:"alcon",name:"Alcon",category:"HEALTHCARE PRODUCT UX",
      description:"Healthcare interfaces have to make complicated information feel manageable. My work at Alcon focused on clearer paths through patient and clinical experiences.",
      accent:"#fff0dc",
      projects:[
        {
          title:"Customizable Patient Portal",type:"UX/UI Design · Patient Experience",
          audience:"Patients preparing for surgery and medical-practice staff configuring the portal.",
          constraints:"Practice-level flexibility without sacrificing clarity and consistency for patients.",
          summary:"Patients already have plenty to think about before surgery. I worked on making the next step easier to find and understand.",
          details:"Before surgery, people have enough on their minds. They shouldn't have to decipher a portal to find the next step. I worked on a customizable patient portal that allowed medical practices to tailor the experience and share surgery-related documents and preparation information. The UX challenge was to support different practice needs while keeping the patient-facing experience consistent and easy to understand.",
          process:"I considered the relationship between what a practice configures and what a patient ultimately sees. Important documents, preparation steps, and other surgery information needed a hierarchy that made the next relevant item obvious. This required thinking about content grouping, navigation, and the balance between flexibility for practices and clarity for patients. I approached customization as part of the patient experience, not a separate settings exercise.",
          // Scope is documented; no interviews, tests, or adoption data are claimed.
          evidence:"Documented scope: I contributed UX/UI design to a customizable patient portal and practice-facing setup experience. Research methods, usability findings, and adoption measures have not been supplied for this case study.",
          tradeoffs:"Practices need flexibility. Patients need consistency. The interface has to make room for both. My design rationale focused on separating practice configuration from the patient-facing information hierarchy; this is an explanation of the UX problem, not a claim of validated results.",
          outcome:"UX/UI design for a patient-facing portal and practice customization workflow. I had to think about both sides: what a practice needs to set up, and what a patient needs to understand without calling someone for help.",
          imageBrief:"ILLUSTRATIVE / Proposed paired views: practice customization on desktop and a patient portal on mobile, with surgery information, documents, and next steps. Use fictional patient data; not a shipped interface screenshot.",
          galleryBriefs:[
            "ILLUSTRATIVE / Proposed practice setup flow showing branding, information modules, and a patient-facing preview; not a documented tested or shipped flow.",
            "ILLUSTRATIVE / Proposed patient information sequence: surgery overview, preparation instructions, documents, and follow-up. Not a validated patient journey or research finding.",
            "ILLUSTRATIVE / Proposed document delivery states for a fictional surgery packet, with read/download controls and information hierarchy. Not verified production behavior."
          ]
        },
        {
          title:"AI-Assisted IOL Planning",type:"UX/UI Design · Clinical Tools",
          audience:"Clinicians working with patient measurements, scans and model-generated information.",
          constraints:"Distinguishing measured inputs from predictions and clarifying information passed between tools.",
          summary:"A prediction and a patient measurement aren't the same thing. A clinical interface needs to make that distinction unmistakable.",
          details:"I worked on a clinician-facing UX/UI system related to intraocular lens (IOL) planning. Doctors could use patient measurements and scans to train an AI model on prescription decisions, with predicted information then associated with a patient's file and passed to another application. The interface needed to make the source information and generated predictions understandable within a clinical workflow.",
          process:"I approached the interface as a sequence of information states: patient measurements and scans, the model-training or prediction workflow, and information passed to the patient file and a connected application. My UX/UI focus was how to help a clinician recognize the source of each piece of information and understand the handoff between tools. Separating measured inputs from model-generated predictions was a design consideration, not a claim that a specific labeling system was implemented or clinically validated. Iteration rounds and review decisions have not been documented here.",
          // The workflow and UX/UI role are documented; clinical validation and launch status are not.
          evidence:"Documented scope: my UX/UI contribution concerned a clinician-facing IOL planning workflow involving patient measurements, scans, AI model training or predictions, and a downstream application. No approved research findings, clinician usability tests, safety validation, deployment status, or outcome metrics have been provided for this case study.",
          tradeoffs:"A prediction isn't the same thing as a measurement. I wanted the interface to make that difference obvious without overwhelming the clinician. Distinguishing measurements, model-generated information, and the downstream handoff was my design rationale; the available project record does not establish which alternatives were implemented, tested, or preferred by clinicians.",
          outcome:"UX/UI design contribution to a connected IOL planning workflow. The documented design focus was information provenance and the relationship between the clinician-facing workflow, patient record, and downstream tool. Whether these specific designs shipped or improved clinical decisions has not been verified for publication.",
          imageBrief:"ILLUSTRATIVE / Proposed clinical interface concept showing fictional measurements, scan thumbnails, model review, and AI-labeled predictions. Not an implemented or clinically validated screen.",
          galleryBriefs:[
            "ILLUSTRATIVE / Proposed system-flow explanation: measurements and scans → model workflow → prediction → patient file → connected application. Not verified implementation architecture.",
            "ILLUSTRATIVE / Proposed clinician interface with fictional measurements, scan previews, review controls, and labeled model outputs; not a tested workflow.",
            "ILLUSTRATIVE / Proposed patient-record concept distinguishing source measurements from model predictions. Not a deployed patient record or clinically validated presentation."
          ]
        }
      ]
    },
    {
      id:"holland-america",name:"Holland America Line",category:"PRODUCT DESIGN · UX/UI",
      description:"Designing for guests at sea meant thinking beyond a typical app screen—from finding things on a phone to navigating a TV with a remote.",
      accent:"#203d64",
      projects:[
        {
          title:"Navigator App",type:"Mobile UX/UI · Guest Experience",
          audience:"Cruise passengers using onboard booking, account and Wi-Fi guidance.",
          constraints:"Making choices, confirmation and connection guidance understandable to guests using a mobile app.",
          summary:"On a cruise, even simple tasks have unfamiliar steps. I worked on making bookings, account details, and Wi-Fi guidance easier to navigate.",
          details:"I worked on the parts of a cruise app people actually need while they're trying to enjoy their trip: booking dinner, choosing excursions, and checking purchases. These flows needed to make choices and confirmations clear to passengers who might be using the app for the first time while onboard.",
          process:"Passenger feedback pointed to confusion around connecting to the ship's Wi-Fi, so I worked on visual cues to make that step easier to recognize. For dining and excursion bookings, I worked through the screens from browsing to confirmation, focusing on the details passengers needed at each point.",
          // Evidence boundary: passenger Wi-Fi confusion was reported, but no
          // interview count, test method, or before/after metric is documented.
          evidence:"Documented project context: passenger feedback identified confusion around connecting to the ship's Wi-Fi. I contributed visual guidance for that step and designed and prototyped booking and account flows. The feedback source, sample size, validation method, and post-release impact are not documented here.",
          tradeoffs:"Someone using the app for the first time should know what to do next—and whether their booking actually worked. I focused on legible choices, guidance, and confirmations; this describes my design priorities, not a tested improvement in completion rates.",
          outcome:"My work contributed to Navigator, an app passengers actually use at sea. I designed and prototyped booking and account flows, plus Wi-Fi guidance informed by passenger feedback. The fun challenge was making unfamiliar onboard tasks feel less like a puzzle.",
          imageBrief:"Approved Navigator app screens showing dining reservations, shore excursions, or Wi-Fi connection guidance.",
          galleryBriefs:[
            "Dining reservation and excursion booking flow screens, showing how guests choose and confirm experiences.",
            "Wi-Fi connection interface and the visual guidance added in response to guest feedback.",
            "Purchase statement or other onboard guest-service screen, with attention to readable information hierarchy."
          ]
        },
        {
          title:"Stateroom TV App",type:"In-Room TV UX/UI · Guest Experience",
          audience:"Cruise guests viewing onboard information from across a room.",
          constraints:"Remote-control directional navigation, visible focus and television viewing distance.",
          summary:"No mouse. No touchscreen. Just a remote and a guest trying to find something. That changes every navigation decision.",
          details:"I contributed UX/UI design to Holland America Line's shipped stateroom TV experience, including onboard information such as Voyage Tracker. The audience was guests navigating from across the room with a remote rather than a mouse or touchscreen. That input constraint shaped the interface: readable information, clear focus states, and a directional path between controls all needed attention.",
          process:"I considered the interaction from the remote outward: where focus starts, how it moves between choices, and how a guest can tell which control is selected. For Voyage Tracker, I prioritized the main voyage information and considered how secondary details could remain accessible without competing for attention. This describes my interface-design approach; it is not a claim that a particular navigation pattern was validated through testing.",
          evidence:"Confirmed scope: I contributed interface design to the shipped in-stateroom TV app, including Voyage Tracker. User interviews, usability studies, remote-control test findings, and engagement metrics have not been supplied for this case study. The design rationale below should not be read as measured guest behavior.",
          tradeoffs:"A TV isn't just a giant phone. You need to read it from across the room and navigate with a handful of buttons. I favored clear focus visibility, directional predictability, and a strong primary-information hierarchy as design priorities; no tested comparison between alternatives is claimed.",
          outcome:"This work shipped in Holland America Line's stateroom TV experience, including remote-friendly navigation and Voyage Tracker. Designing for a TV made me rethink things I'd take for granted on a phone: focus states, button targets, and whether someone can read the screen from across the room.",
          imageBrief:"Approved stateroom TV app interface with the Voyage Tracker widget visible.",
          galleryBriefs:[
            "Stateroom TV home screen showing its layout and navigation.",
            "Voyage Tracker widget and ship-position or itinerary information, as available in approved artwork.",
            "Additional in-room TV widgets or interaction states that demonstrate readable, remote-friendly UI."
          ]
        }
      ]
    }
  ],
  playground:[
    {
      title:"Forktactics",type:"Independent Product · UX/UI Design",
      summary:"I got tired of the weekly 'what's for dinner?' spiral, so I started designing a meal planner that makes choosing food feel more like building a deck than doing homework.",
      details:"Dinner shouldn't require a fresh round of decision-making every single night. Forktactics began as my attempt to make weekly meal planning feel less like homework. I conceived and iterated on a product that helps people choose meals, review a week of dinners, and shop with less waste. The experience combines preference-based discovery, a weekly menu, budget awareness, and a grocery list that consolidates ingredients used by multiple recipes. It's a personal project I'm still building and refining.",
      process:"I wanted the weekly menu to feel like the heart of the experience, not a maze of settings. I iterated on meal discovery, swipe interactions, menu previews before committing, recipe swaps, ingredient consolidation, and a clear cooked/not-cooked state. I explored a few visual directions, including a trading-card-inspired theme. Along the way, I kept returning to practical issues such as small-screen overflow, swipe gestures competing with scrolling, and onboarding that asked too much of new users. Building an AI-assisted prototype helped me test ideas quickly, but the important design work was deciding which interactions genuinely made planning easier.",
      // Self-directed prototype evidence is not equivalent to participant research.
      evidence:"Documented: Forktactics is my independent, AI-assisted working prototype. Iteration has surfaced interaction and data-quality issues, including swipe gestures competing with scrolling and grocery quantities or price estimates needing refinement. No recruited user interviews, formal usability study, verified grocery savings, or production launch has been documented.",
      tradeoffs:"The design tension is automation versus control: propose a useful weekly menu while leaving room to review and swap meals. Ingredient overlap can support budget awareness but should not eliminate variety; a trading-card-inspired visual identity should make discovery inviting without hiding everyday planning actions. These are design priorities, not measured outcomes.",
      outcome:"Forktactics is a working prototype, not a polished success story with a bow on it. I've built and reworked the weekly planner, recipe discovery, and grocery list as I find friction in the flow. I'm still testing whether the ideas actually save time, money, or food waste.",
      imageBrief:"Show the existing Forktactics prototype as an exploration, clearly labeled PROTOTYPE. Replace with original Figma-designed hero visuals once the redesign exists.",
      galleryBriefs:[
        "01 / THE CORE IDEA ;  Diagram the flow: tell Forktactics your tastes → get a proposed weekly menu → review and swap meals → shop within your budget.",
        "02 / PROTOTYPE EXPLORATION ;  Real screenshots of the AI-assisted working prototype, labeled as exploratory rather than final design.",
        "03 / SMARTER SHOPPING LOGIC ;  Illustrate how two or more dinners share ingredients, how quantities roll into one grocery list, and how estimated costs inform menu choices against a budget. Label calculations as prototype estimates.",
        "04 / THE DESIGN DIRECTION ;  Early original Figma explorations of a TCG-inspired interface that makes choosing meals playful without complicating planning. Work in progress.",
        "05 / DESIGNING THE SYSTEM ;  Future Figma components: meal cards, states, navigation, typography, spacing, and accessibility decisions. Add when created.",
        "06 / FROM PROTOTYPE TO PRODUCT ;  Future side-by-side comparison of exploratory prototype and designer-led redesign. Do not present as completed until built."
      ]
    },
    {
      title:"Fallout 76 ;  What I'd Design",type:"Unofficial Game Concept Design · Fan Work",
      summary:"How far can you push an idea before it stops feeling like Fallout? I explored new camp objects, a themed season, and Brahmin-powered travel.",
      details:"These are three unofficial Fallout 76 design proposals for players who enjoy CAMP objects, seasonal rewards, and Appalachia's worldbuilding: a Meat Week charcuterie display, a Mistress of Mystery-inspired season, and Brahmin-powered transportation. My role is independent concept direction and visual planning, not work commissioned by Bethesda. The challenge is to respect the game's recognizable retro-futurist language while introducing something playful and distinct. The artwork and UI mockups described below are planned portfolio visuals, not evidence of implemented game content.",
      process:"I organized the proposals around three different player touchpoints: a placeable CAMP object, a season and its rewards, and a speculative travel interaction. That separation helps me ask different design questions about silhouette, visual hierarchy, and in-world plausibility. The directions below are concept briefs, not documented prototypes, player-tested iterations, or finished illustrations.\n\nMEAT WEEK / THE CHARCUTERIE BOARD ;  A camp display inspired by Meat Week: an oversized, delightfully absurd spread of wasteland meats and snacks. The design challenge is to make a playful collectible display feel readable, appetizing in a Fallout sort of way, and unmistakably part of Grahm's celebration.\n\nMISTRESS OF MYSTERY / THE SEASON ;  A season concept inspired by the Order of Mysteries, with a themed season scoreboard and a curated lineup of rewards I'd want to earn. The visual direction draws from secret identities, pulp-comic drama, and the faction's theatrical elegance. Reward illustrations and a scoreboard mockup will make the concept tangible.\n\nBRAHMIN TRANSPORTATION ;  A concept for moving through Appalachia with Brahmin. I'd explore how the vehicle or caravan looks, what it feels like to use, and how it fits Fallout's scrappy world without pretending it's an existing mechanic.",
      // No finished artwork, playtest, or shipped content is established by these briefs.
      evidence:"Documented in this portfolio brief: three independent fan proposals and planned visual directions. The materials here do not establish completed concept illustrations, interactive prototypes, player interviews, usability tests, developer collaboration, or in-game implementation. Image briefs describe work to create, not evidence of finished assets.",
      tradeoffs:"Each proposal has a different design tension: make a Meat Week CAMP display immediately recognizable without losing its ridiculous charm; make a Mistress of Mystery season feel faithful to the faction without simply copying existing rewards; and make Brahmin transportation fit the world's scrappy logic without implying it is a supported mechanic. These are questions for future exploration, not validated design decisions.",
      outcome:"Three speculative fan-design directions with briefs for future concept illustrations and UI mockups. They are unofficial proposals, not shipped game features; finished assets, player response, and implementation outcomes are not established by the current materials.",
      imageBrief:"Concept portfolio cover: three distinct fan-design proposals; Meat Week charcuterie display, Mistress of Mystery season scoreboard, and Brahmin transportation. Use original concept artwork once designed; do not imply these are in-game screenshots.",
      galleryBriefs:[
        "01 / MEAT WEEK CHARCUTERIE ;  Concept illustration of a placeable camp meat display board, with ingredients, presentation, scale, and a playful Fallout-style item name.",
        "02 / MEAT WEEK ITEM PRESENTATION ;  Mock up the camp-building catalog tile and the display in a player camp, clearly labeled FAN CONCEPT.",
        "03 / MISTRESS OF MYSTERY SEASON ;  Design a complete season scoreboard composition inspired by the Order of Mysteries, using an original layout and clearly marked as an unofficial concept.",
        "04 / THE REWARDS I'D WANT ;  Illustrate a proposed reward lineup for the season: outfits, camp decor, props, and other themed collectibles. Final item choices and art to be designed.",
        "05 / BRAHMIN TRANSPORTATION ;  Concept sheet showing a Brahmin-powered caravan or transport system, including silhouette, materials, and how a player might interact with it.",
        "06 / IN-WORLD EXPERIENCE ;  UI and environmental mockups showing how the transportation concept could fit into Appalachia; speculative gameplay, not an existing feature."
      ]
    },
    {
      title:"Illustration & Experiments",type:"Personal Creative Practice",
      summary:"Sometimes the best reason to make something is that I can't stop thinking about it. This is where those ideas go.",
      details:"Outside client briefs, I use personal illustration as a place to explore character, expression, and visual style. My role is independent creative direction and illustration, rather than product UX for a defined user group. The visual challenge is to make a character or composition readable and distinctive without relying on extra detail. This collection does not have a documented client brief, audience study, or production deadline.",
      process:"The questions guiding this work are visual ones: what can a silhouette communicate before color is added, how does a palette change the mood, and which details support the expression? A stronger process presentation would pair original sketches with alternatives, explain why one direction was refined, and show the final artwork. Those stages are a presentation plan here, not a claim that particular sketch rounds or tests have been documented.",
      // Personal practice is documented; these visual briefs are not completed artwork.
      evidence:"Confirmed scope: ongoing independent illustration and creative exploration. Specific dated sketches, comparative iterations, audience feedback, and approved finished pieces have not been supplied for this case study. The hero and gallery descriptions are future image briefs, not completed deliverables or test evidence.",
      tradeoffs:"I love a memorable silhouette, but I also know when a design is trying to say five things at once. I look for the details that make a character recognizable and cut the ones that just add noise. These are the questions behind the work, not claims about a formal test.",
      outcome:"An ongoing personal illustration practice. This page currently communicates the creative direction and planned process presentation; it does not claim a completed illustrated series, formal evaluation, or measured audience response.",
      imageBrief:"Planned hero: editorial collage of original character illustrations, color studies, and selected polished artwork on a restrained background. Add only when the artwork is ready.",
      galleryBriefs:[
        "PLANNED / Character development sheet with original silhouettes, expressions, palettes, and final poses. Not yet supplied.",
        "PLANNED / Side-by-side original rough sketch, refined linework, and final color with notes on actual decisions. Not yet supplied.",
        "PLANNED / Curated mini-gallery of three personal pieces with captions identifying each piece and its process. Not yet supplied."
      ]
    }
  ]
};
