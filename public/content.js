/* Portfolio editorial content.
   Drafts are based on known work themes, not verified client results.
   Replace review notes and add approved imagery before publishing externally.
   Images: set image to a file in public/images; gallery can contain image paths.
   imageBrief and galleryBriefs appear as descriptive placeholders until then. */
window.PORTFOLIO = {
  email: "bertinoln@gmail.com",
  companies: [
    {
      id:"hoylu", name:"Hoylu", category:"PRODUCT · BRAND · MOTION",
      description:"Designing clearer ways to communicate, plan, and collaborate in the complexity of construction.",
      accent:"#ffacd3", featured:true,
      projects:[
        {
          title:"Connected Planning", type:"Product UX",
          summary::"Making complex construction planning easier to understand by connecting project context, stakeholders, and the information teams act on.",
          details::"Construction projects rarely fail for lack of information; the challenge is finding the right information in time to use it. At Hoylu, I worked on product design in a space where schedules, stakeholders, and planning conversations overlap. The central UX problem was how to make a complex, collaborative workflow feel coherent: what belongs to the project, how views relate, and where a person goes to understand the next decision.",
          process::"My design approach centered on information hierarchy and the relationship between project-level context and individual planning views. I explored how teams could move from a broad project picture to the detail behind an item without losing context. The work required thinking about different audiences—people coordinating plans and people acting on them—and how the interface communicates changes, dependencies, and ownership. This is the kind of product problem where structure and clarity matter more than adding another panel.",
          outcome::"Product UX and visual design contributions to Hoylu's construction-planning experience. The strongest case-study evidence will be annotated screens showing project context, linked views, and interaction decisions; product impact metrics have not been verified.",
          imageBrief:"Hero composition: a polished desktop construction-planning interface showing a project overview, linked schedule items, and a focused detail panel. Use realistic but anonymized sample data.",
          galleryBriefs:[
            "Before-and-after information architecture: disconnected boards versus a unified project hierarchy, with clear labels and arrows.",
            "Three-screen UX sequence: project overview → planning item → stakeholder detail, annotated with key interaction decisions.",
            "Responsive UI mockups: desktop planning workspace beside a compact tablet or mobile review state."
          ]
        },
        {
          title:"Mobile Insights", type:"UX / UI",
          summary::"Translating dense construction information into mobile views that prioritize what someone needs to know next.",
          details::"A project dashboard that works on a desktop does not automatically work on a phone. For Hoylu's mobile insights work, the design challenge was to make project information useful in short, focused moments: checking a status, understanding a change, or finding the detail behind an insight. Limited screen space made prioritization—not simply resizing—the central problem.",
          process::"I developed the mobile UX story around a sequence of questions: what should the user notice first, what context helps them understand it, and what action or deeper view comes next? I considered the hierarchy of insight cards, summary information, and supporting detail, with a focus on legibility and touch-friendly interactions. The aim was to preserve meaning while removing the density that makes desktop planning tools difficult to scan on the go.",
          outcome::"Mobile UX concepts and visual storytelling for Hoylu's project insights experience. Screens and interaction examples can demonstrate the hierarchy and decision-making; implementation and performance results have not been confirmed.",
          imageBrief:"Hero composition: three mobile screens displaying a construction project dashboard, an insight detail, and a status update; include realistic charts and clear labels.",
          galleryBriefs:[
            "Mobile user-flow diagram showing how a site lead moves from an alert to the affected planning item.",
            "Side-by-side early wireframe and refined high-fidelity screen with annotations on hierarchy and spacing.",
            "Close-up component sheet: insight cards, status chips, filters, and accessible interaction states."
          ]
        },
        {
          title:"Campaigns & Events", type:"Visual Design",
          summary::"Taking a technical SaaS product story from digital campaigns to full-size event environments without losing clarity.",
          details::"At Hoylu, I worked on visual communications for a construction technology audience across marketing and event touchpoints. The challenge changes with the format: a social graphic has seconds to earn attention, while a booth wall must communicate from across a room. Both need a clear message, recognizable brand, and a useful visual hierarchy.",
          process::"I translated product messages into compositions that could scale across formats, including event booth signage, presentation assets, and digital campaign graphics. For large-format work, I considered viewing distance, display proportions, and the relationship between printed graphics and screens, including 65-inch and 40-inch displays. The design decisions centered on what should be readable first and what supporting information could wait until someone moved closer.",
          outcome::"Visual design work spanning environmental signage and digital marketing materials. Approved booth photos, screen mockups, and campaign assets will show how the system holds together across sizes; event conversion or engagement metrics are not available.",
          imageBrief:"Hero composition: realistic trade-show booth mockup featuring large Hoylu signage, a screen, and a clear product message; use approved branding.",
          galleryBriefs:[
            "Wide environmental mockup showing booth walls, screen placements, and scale relative to visitors.",
            "Flat campaign asset lineup: LinkedIn banner, presentation cover, email graphic, and printed collateral.",
            "Close-up typography and layout details showing how the visual system scales from large-format signage to digital."
          ]
        },
        {
          title:"Motion & Storytelling", type:"Motion Design",
          summary::"Turning complex product messages into a concise, visual story built for motion.",
          details::"Construction software can be difficult to explain in a static image, especially when the value lies in how information connects and changes over time. I worked on motion-oriented product storytelling at Hoylu, including a short-form, approximately 30-second storyboard intended to communicate a product idea quickly and clearly.",
          process::"I approached the piece as a sequence rather than a collection of effects: establish the problem, introduce the key relationship, and land on a clear takeaway. Storyboarding helped determine what the audience needed to see in each moment, where transitions should clarify a connection, and where motion would distract. I focused on readable pacing, consistent visual language, and an achievable narrative within a tight runtime.",
          outcome::"Storyboard and motion-design planning for short-form product communication. The storyboard frames are the primary evidence available; a finished animation and performance results should only be shown if confirmed.",
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
          summary::"Balancing practice-specific customization with a clear patient experience for surgery documents and preparation.",
          details::"Preparing for a procedure comes with a lot of information, and patients need to find the right instructions without decoding a clinical system. I worked on a customizable patient portal that allowed medical practices to tailor the experience and share surgery-related documents and preparation information. The UX challenge was to support different practice needs while keeping the patient-facing experience consistent and easy to understand.",
          process::"I considered the relationship between what a practice configures and what a patient ultimately sees. Important documents, preparation steps, and other surgery information needed a hierarchy that made the next relevant item obvious. This required thinking about content grouping, navigation, and the balance between flexibility for practices and clarity for patients. In the portfolio, actual screens should show both sides of that relationship rather than presenting customization as an isolated feature.",
          outcome::"UX/UI design for a patient-facing portal and practice customization workflow. I do not have verified adoption, accessibility testing, or clinical outcome metrics to attribute to this work.",
          imageBrief:"Hero to design: two connected views—practice customization dashboard on desktop and a patient portal on mobile, showing surgery information, a document list, and clear next steps. Use fictional patient data.",
          galleryBriefs:[
            "Practice setup flow: configurable branding, information modules, and the resulting patient-facing preview.",
            "Patient journey: surgery overview, preparation instructions, documents, and follow-up information in a clear sequence.",
            "Document delivery detail: example surgery packet, read/download states, and a reassuring information hierarchy using fictional records."
          ]
        },
        {
          title:"AI-Assisted IOL Planning",type:"UX/UI Design · Clinical Tools",
          summary::"Making patient data, imaging, and AI-generated IOL predictions understandable within a connected clinical workflow.",
          details::"I worked on a clinician-facing UX/UI system related to intraocular lens (IOL) planning. Doctors could use patient measurements and scans to train an AI model on prescription decisions, with predicted information then associated with a patient's file and passed to another application. The design problem was not simply displaying a prediction; it was presenting several kinds of information with enough context to support a careful clinical workflow.",
          process::"I approached the interface as a sequence: review patient source data and scans, work with the model-training or prediction workflow, and understand how resulting information moves into the patient record and downstream application. A key design consideration was distinguishing measured inputs, model-generated outputs, and clinician-reviewed information, so those categories would not visually collapse into one another. The screens and flows should make the handoff between tools legible without implying that the interface replaces clinical judgment.",
          outcome::"UX/UI work for a connected clinical planning tool. This case study does not claim clinical validation, model accuracy, deployment status, or improved patient outcomes; those would require documented evidence.",
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
      id:"holland-america",name:"Holland America Line",category:"PRODUCT DESIGN · UX/UI",
      description:"Guest-facing digital experiences across the Navigator app and in-stateroom TV, from onboard booking to ship information.",
      accent:"#203d64",
      projects:[
        {
          title:"Navigator App",type:"Mobile UX/UI · Guest Experience",
          summary:"Designing clearer paths through dining reservations, shore excursions, purchase statements, and one surprisingly important hurdle: getting connected to ship Wi-Fi.",
          details:"A cruise vacation involves a lot of decisions, and guests shouldn't have to fight an app to make them. I designed and prototyped interfaces for Navigator, Holland America Line's mobile guest experience, covering restaurant reservations, shore excursion booking, and purchase statements. These are practical, high-intent moments: finding an experience, making a choice, checking the details, and knowing what happens next. My role was to translate those needs into clear, approachable mobile screens and flows.",
          process:"One especially useful design problem came from real-time guest feedback: connecting to the ship's Wi-Fi wasn't as obvious as it needed to be. I worked on visual cues to make that connection step easier to recognize and understand. In the reservation and excursion flows, I designed and prototyped the path from browsing to booking, keeping the hierarchy focused on the information guests need to make a decision. The through-line was reducing uncertainty—not adding more decoration or more steps.",
          outcome:"The work produced UI designs and prototypes across booking, purchase-information, and connectivity experiences. The Wi-Fi improvements were informed by feedback from actual guests, giving the design work a concrete usability problem to respond to. I don't have verified conversion, completion-rate, or satisfaction metrics to share, so I'm keeping the story focused on the design decisions and deliverables.",
          imageBrief:"Approved Navigator app screens showing dining reservations, shore excursions, or Wi-Fi connection guidance.",
          galleryBriefs:[
            "Dining reservation and excursion booking flow screens, showing how guests choose and confirm experiences.",
            "Wi-Fi connection interface and the visual guidance added in response to guest feedback.",
            "Purchase statement or other onboard guest-service screen, with attention to readable information hierarchy."
          ]
        },
        {
          title:"Stateroom TV App",type:"In-Room TV UX/UI · Guest Experience",
          summary::"Designing voyage information for a stateroom TV, where the remote—not a touchscreen—drives the experience.",
          details::"The stateroom TV app brought ship information into guests' rooms, including widgets such as Voyage Tracker. Unlike a mobile interface, the TV is viewed from a distance and operated with a remote control. That changes the interaction model: guests need to see where they are in the interface, understand what is selectable, and move through options without tapping directly on the screen.",
          process::"Remote navigation was a major focus of my design work. I considered directional movement between controls, visible focus and selected states, predictable paths through content, and the amount of information a guest can comfortably read from across the room. For widgets such as Voyage Tracker, the hierarchy needed to communicate the main information quickly while keeping the remote-driven experience straightforward. The key UX question was not just 'Can guests read it?' but 'Can they confidently move through it with a few buttons?'",
          outcome::"UX/UI design for the in-room TV experience and onboard information widgets, with particular attention to remote-control navigation. Approved screen states showing focus movement and selection would make this work especially compelling; measured usability or launch outcomes have not been verified.",
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
      summary::"An independently built meal-planning product that turns preferences and a budget into a weekly menu and consolidated grocery list.",
      details::"Forktactics started with a familiar problem: deciding what to cook is tiring, and buying ingredients for unrelated meals can get expensive. I conceived and iterated on a product that helps people choose meals, review a week of dinners, and shop with less waste. The experience combines preference-based discovery, a weekly menu, budget awareness, and a grocery list that consolidates ingredients used by multiple recipes. It is an independent, actively evolving project rather than a finished client launch.",
      process::"I designed the experience around the weekly menu as the primary destination, not a maze of settings. I iterated on meal discovery, swipe interactions, menu previews before committing, recipe swaps, ingredient consolidation, and a clear cooked/not-cooked state. I also explored multiple visual themes—including a playful trading-card-game direction—while repeatedly addressing practical usability issues such as small-screen overflow, scrolling versus swiping, confusing onboarding, and inconsistent component styling. Building an AI-assisted prototype helped me test ideas quickly, but the important design work was deciding which interactions genuinely made planning easier.",
      outcome::"A working, iterated product prototype with a weekly planning flow, recipe discovery, and shopping-list functionality. The project demonstrates end-to-end product thinking, rapid prototyping, responsive UI work, and iterative debugging. User adoption, grocery savings, and commercial results have not been measured.",
      imageBrief:"Show the existing Forktactics prototype as an exploration, clearly labeled PROTOTYPE. Replace with original Figma-designed hero visuals once the redesign exists.",
      galleryBriefs:[
        "01 / THE CORE IDEA — Diagram the flow: tell Forktactics your tastes → get a proposed weekly menu → review and swap meals → shop within your budget.",
        "02 / PROTOTYPE EXPLORATION — Real screenshots of the AI-assisted working prototype, labeled as exploratory rather than final design.",
        "03 / SMARTER SHOPPING LOGIC — Illustrate how two or more dinners share ingredients, how quantities roll into one grocery list, and how estimated costs inform menu choices against a budget. Label calculations as prototype estimates.",
        "04 / THE DESIGN DIRECTION — Early original Figma explorations of a TCG-inspired interface that makes choosing meals playful without complicating planning. Work in progress.",
        "05 / DESIGNING THE SYSTEM — Future Figma components: meal cards, states, navigation, typography, spacing, and accessibility decisions. Add when created.",
        "06 / FROM PROTOTYPE TO PRODUCT — Future side-by-side comparison of exploratory prototype and designer-led redesign. Do not present as completed until built."
      ]
    },
    {
      title:"Fallout 76 — What I'd Design",type:"Unofficial Game Concept Design · Fan Work",
      summary::"Independent Fallout 76 fan concepts exploring how new camp objects, seasonal themes, and traversal ideas could fit an established game world.",
      details::"I love the challenge of designing inside an existing visual universe. These unofficial Fallout 76 concepts explore three different types of game content: a Meat Week charcuterie display, a Mistress of Mystery-inspired season, and Brahmin-powered transportation. None are Bethesda commissions or announced features. The design challenge is to make something new feel like it belongs in Appalachia, where retro-futurist advertising, environmental storytelling, and dark humor all have a role.",
      process:"MEAT WEEK / THE CHARCUTERIE BOARD — A camp display inspired by Meat Week: an oversized, delightfully absurd spread of wasteland meats and snacks. The design challenge is to make a playful collectible display feel readable, appetizing in a Fallout sort of way, and unmistakably part of Grahm's celebration.\n\nMISTRESS OF MYSTERY / THE SEASON — A season concept inspired by the Order of Mysteries, with a themed season scoreboard and a curated lineup of rewards I'd want to earn. The visual direction draws from secret identities, pulp-comic drama, and the faction's theatrical elegance. Reward illustrations and a scoreboard mockup will make the concept tangible.\n\nBRAHMIN TRANSPORTATION — A concept for moving through Appalachia with Brahmin. I'd explore how the vehicle or caravan looks, what it feels like to use, and how it fits Fallout's scrappy world without pretending it's an existing mechanic.",
      outcome::"Independent game-design concepts demonstrating visual worldbuilding, themed content ideation, and sensitivity to an existing franchise's style. They are fan work, not shipped game features.",
      imageBrief:"Concept portfolio cover: three distinct fan-design proposals—Meat Week charcuterie display, Mistress of Mystery season scoreboard, and Brahmin transportation. Use original concept artwork once designed; do not imply these are in-game screenshots.",
      galleryBriefs:[
        "01 / MEAT WEEK CHARCUTERIE — Concept illustration of a placeable camp meat display board, with ingredients, presentation, scale, and a playful Fallout-style item name.",
        "02 / MEAT WEEK ITEM PRESENTATION — Mock up the camp-building catalog tile and the display in a player camp, clearly labeled FAN CONCEPT.",
        "03 / MISTRESS OF MYSTERY SEASON — Design a complete season scoreboard composition inspired by the Order of Mysteries, using an original layout and clearly marked as an unofficial concept.",
        "04 / THE REWARDS I'D WANT — Illustrate a proposed reward lineup for the season: outfits, camp decor, props, and other themed collectibles. Final item choices and art to be designed.",
        "05 / BRAHMIN TRANSPORTATION — Concept sheet showing a Brahmin-powered caravan or transport system, including silhouette, materials, and how a player might interact with it.",
        "06 / IN-WORLD EXPERIENCE — UI and environmental mockups showing how the transportation concept could fit into Appalachia; speculative gameplay, not an existing feature."
      ]
    },
    {
      title:"Illustration & Experiments",type:"Personal Creative Practice",
      summary::"Personal illustration and visual experiments that strengthen character design, composition, and storytelling across my work.",
      details::"Illustration is where I get to follow curiosity without a product requirement or campaign brief. I use personal projects to explore character silhouettes, color, expression, composition, and visual styles that might not fit a client assignment. That experimentation also feeds back into my design work: it sharpens my ability to communicate personality and create memorable visual systems.",
      process::"My process usually moves from rough sketches and references into silhouette exploration, color studies, and refinement. I look for what makes a character or composition recognizable before adding detail, then test whether the final image still communicates at a glance. Showing a few deliberate iterations alongside the finished work gives a better picture of my thinking than a gallery of polished images alone.",
      outcome::"An ongoing body of independent illustration and creative experiments. This collection demonstrates range and process rather than claiming client deliverables or business results.",
      imageBrief:"Hero composition: editorial collage of original character illustrations, color studies, and selected polished artwork on a restrained background.",
      galleryBriefs:[
        "Character development sheet: silhouettes, expressions, palettes, and final poses.",
        "Process comparison: rough sketch, refined linework, and final colored illustration.",
        "Curated mini-gallery of three visually distinct personal pieces with short captions."
      ]
    }
  ]
};
