/* EDIT THIS FILE to update the site. No React knowledge required.
   Images: add files to /images, then set image: "images/your-photo.webp".
   Replace placeholder text and contact email before publishing.
   Projects can have any number of entries per company. */
window.PORTFOLIO = {
  email: "hello@example.com", // TODO: change to your real public contact email
  companies: [
    { id:"hoylu", name:"Hoylu", category:"PRODUCT · BRAND · MOTION", description:"Making complex construction workflows clearer, more connected, and more human.", accent:"#264650", featured:true,
      projects:[
        {title:"Connected Planning",type:"Product UX",summary:"Exploring clearer, connected workflows for construction teams.",image:""},
        {title:"Mobile Insights",type:"UX / UI",summary:"Design explorations for useful project information on the go.",image:""},
        {title:"Campaigns & Events",type:"Visual Design",summary:"Brand storytelling across event spaces and marketing touchpoints.",image:""},
        {title:"Motion & Storytelling",type:"Motion Design",summary:"Making complex platform ideas easier to understand through motion.",image:""}
      ]},
    {id:"alcon",name:"Alcon",category:"VISUAL DESIGN",description:"A selection of design work for Alcon. Add your project details here.",accent:"#b18b7b",projects:[
      {title:"Alcon Project 01",type:"Visual Design",summary:"Replace with your actual project description.",image:""},
      {title:"Alcon Project 02",type:"Visual Design",summary:"Replace with your actual project description.",image:""}
    ]}
  ],
  playground:[
    {title:"SupperPal",type:"APP EXPERIMENT",summary:"A playful approach to planning meals and shopping smarter.",image:""},
    {title:"Fallout 76 Environments",type:"GAME ENVIRONMENT DESIGN",summary:"Worldbuilding, environmental storytelling, and interactive spaces.",image:""},
    {title:"Illustration & Experiments",type:"PERSONAL WORK",summary:"Sketches, visual explorations, and happy accidents.",image:""}
  ]
};