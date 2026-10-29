/* iOS Home Screen websites do not guarantee native pull-to-refresh.
   Offer a small, standalone-only gesture without preventing native scrolling. */
(function(){
 const standalone=window.matchMedia?.("(display-mode: standalone)").matches||navigator.standalone===true;
 if(!standalone||!window.matchMedia?.("(max-width: 650px)").matches)return;
 const indicator=document.createElement("div");
 indicator.className="standalone-refresh-indicator";
 indicator.setAttribute("role","status");
 indicator.setAttribute("aria-live","polite");
 indicator.textContent="Pull down to refresh";
 document.body.appendChild(indicator);
 let start=null,armed=false;
 const threshold=105;
 function reset(){start=null;armed=false;indicator.classList.remove("is-visible","is-armed");}
 document.addEventListener("touchstart",event=>{
  reset();
  if(event.touches.length!==1||window.scrollY>1)return;
  if(event.target.closest("a,button,input,textarea,select,[contenteditable]"))return;
  start={x:event.touches[0].clientX,y:event.touches[0].clientY};
 },{passive:true});
 document.addEventListener("touchmove",event=>{
  if(!start||event.touches.length!==1)return;
  const dx=event.touches[0].clientX-start.x;
  const dy=event.touches[0].clientY-start.y;
  if(window.scrollY>1||Math.abs(dx)>Math.max(28,dy*.5)||dy<12){
   reset();return;
  }
  armed=dy>=threshold;
  indicator.textContent=armed?"Release to refresh":"Pull down to refresh";
  indicator.classList.add("is-visible");
  indicator.classList.toggle("is-armed",armed);
 },{passive:true});
 document.addEventListener("touchend",()=>{
  const shouldReload=armed&&window.scrollY<=1;
  reset();
  if(shouldReload){
   indicator.textContent="Refreshing…";
   indicator.classList.add("is-visible");
   window.location.reload();
  }
 },{passive:true});
 document.addEventListener("touchcancel",reset,{passive:true});
})();
