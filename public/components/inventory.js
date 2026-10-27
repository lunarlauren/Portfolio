/* About inventory interactions: isolated from portfolio navigation and case-study rendering. */
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
 const reduceMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
 function selectItem(button,animate=true){
  const item=descriptions[button.dataset.item];
  if(!item)return;
  buttons.forEach(other=>other.setAttribute("aria-pressed",String(other===button)));
  panel.querySelector("strong").textContent=item[0];
  panel.querySelector("p").textContent=item[1];
  if(animate&&!reduceMotion){
   button.classList.remove("inventory-pop");
   panel.classList.remove("inventory-refresh");
   void button.offsetWidth;
   button.classList.add("inventory-pop");
   panel.classList.add("inventory-refresh");
  }
 }
 buttons.forEach((button,i)=>{
  button.addEventListener("click",()=>selectItem(button));
  button.addEventListener("keydown",event=>{
   if(!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp"].includes(event.key))return;
   event.preventDefault();
   const step=event.key==="ArrowRight"||event.key==="ArrowDown"?1:-1;
   const next=buttons[(i+step+buttons.length)%buttons.length];
   next.focus();
   selectItem(next);
  });
 });

}
initInventory();

