// Pass 20: visual snapshots of stable component surfaces, not full-page copy.
// Run: node tests/visual-regression.mjs
// To update reviewed expected images: VISUAL_BASELINE_CAPTURE=1 node tests/visual-regression.mjs
import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile,stat,mkdir,writeFile} from "node:fs/promises";
import {resolve,join,extname} from "node:path";
import {chromium} from "playwright";

const root=resolve("public");
const baselines=resolve("tests/visual-baselines");
const failures=resolve("artifacts/visual");
const capture=process.env.VISUAL_BASELINE_CAPTURE==="1";
const emit=process.env.VISUAL_BASELINE_EMIT==="1";
const mime={".html":"text/html",".css":"text/css",".js":"text/javascript",
 ".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".webp":"image/webp"};
const server=createServer(async(req,res)=>{
 try{
  const path=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  let file=resolve(root,"."+path);
  if(file!==root&&!file.startsWith(root+"/"))throw Error("Outside public/");
  let info=await stat(file).catch(()=>null);
  if(!info?.isFile()){file=join(root,"index.html");info=await stat(file)}
  res.writeHead(200,{"content-type":mime[extname(file)]||"application/octet-stream"});
  res.end(await readFile(file));
 }catch(error){res.writeHead(500);res.end(String(error))}
});
await new Promise(done=>server.listen(0,"127.0.0.1",done));
const origin="http://127.0.0.1:"+server.address().port;
const browser=await chromium.launch({headless:true});
const cases=[
 {id:"header",path:"/",selector:".site-header"},
 {id:"hero-art",path:"/",selector:".hero-feature"},
 {id:"case-chapters",path:"/case-studies/hoylu/connected-planning/",
  selector:".case-section-links"}
].flatMap(c=>[390,1280].flatMap(width=>["light","dark"]
 .map(theme=>({...c,width,theme,key:c.id+"-"+width+"-"+theme}))));
let passed=0;
const problems=[];
try{
 for(const spec of cases){
  const page=await browser.newPage({viewport:{width:spec.width,height:900},
   deviceScaleFactor:1,colorScheme:spec.theme,reducedMotion:"reduce",locale:"en-US"});
  try{
   await page.addInitScript(theme=>{
    try{localStorage.setItem("portfolio-theme",theme)}catch{}
   },spec.theme);
   await page.goto(origin+spec.path,{waitUntil:"domcontentloaded"});
   await page.locator(spec.selector).waitFor({state:"visible"});
   await page.evaluate(async()=>{
    await document.fonts.ready;
    const art=document.querySelector(".hero-portrait-art");
    if(art&&!art.complete)await art.decode().catch(()=>{});
   });
   // Freeze animations, parallax and caret before capture.
   await page.addStyleTag({content:"*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;caret-color:transparent!important}.hero .hero-portrait-art{translate:none!important}"});
   if(spec.id==="case-chapters"){
    // Stable labels so project copy revisions do not alter snapshots.
    await page.evaluate(()=>{
     const labels=["Challenge","Process","Evidence","Outcomes"];
     document.querySelectorAll(".case-section-links button")
      .forEach((node,i)=>node.textContent=labels[i]||"Chapter");
    });
   }
   const el=page.locator(spec.selector);
   await el.scrollIntoViewIfNeeded();
   const actual=await el.screenshot({type:"jpeg",quality:78,
    animations:"disabled",caret:"hide",scale:"css",timeout:15000});
   const filename=join(baselines,spec.key+".jpg");
   if(capture){
    await mkdir(baselines,{recursive:true});
    await writeFile(filename,actual);
    if(emit)console.log("__VISUAL_BASELINE__"+spec.key+"__"+
     actual.toString("base64")+"__VISUAL_BASELINE_END__");
    console.log("Captured "+spec.key+" ("+actual.length+" bytes)");
    passed++;continue;
   }
   let expected;
   try{expected=await readFile(filename)}
   catch{throw Error("Missing reviewed baseline "+filename)}
   const comparison=await page.evaluate(async({live,base})=>{
    const load=b64=>new Promise((resolve,reject)=>{
     const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;
     image.src="data:image/jpeg;base64,"+b64;
    });
    const a=await load(live),b=await load(base);
    if(a.width!==b.width||a.height!==b.height)
     return {sizeMismatch:true,actual:[a.width,a.height],
      expected:[b.width,b.height],ratio:1,mean:255};
    const canvas=document.createElement("canvas");
    canvas.width=a.width;canvas.height=a.height;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});
    ctx.drawImage(a,0,0);
    const left=ctx.getImageData(0,0,a.width,a.height);
    ctx.clearRect(0,0,a.width,a.height);ctx.drawImage(b,0,0);
    const right=ctx.getImageData(0,0,a.width,a.height);
    const overlay=ctx.createImageData(a.width,a.height);
    let changed=0,sum=0;
    for(let i=0;i<left.data.length;i+=4){
     let max=0,delta=0;
     for(let c=0;c<3;c++){
      const value=Math.abs(left.data[i+c]-right.data[i+c]);
      max=Math.max(max,value);delta+=value;
     }
     if(max>35)changed++;
     sum+=delta/3;
     overlay.data[i]=max>35?255:right.data[i]/2;
     overlay.data[i+1]=max>35?32:right.data[i+1]/2;
     overlay.data[i+2]=max>35?40:right.data[i+2]/2;
     overlay.data[i+3]=255;
    }
    ctx.putImageData(overlay,0,0);
    return {sizeMismatch:false,actual:[a.width,a.height],
     expected:[b.width,b.height],ratio:changed/(a.width*a.height),
     mean:sum/(a.width*a.height),
     diffPng:canvas.toDataURL("image/png").split(",")[1]};
   },{live:actual.toString("base64"),base:expected.toString("base64")});
   // Five percent allows minor font raster drift but catches major layout changes.
   const ok=!comparison.sizeMismatch&&comparison.ratio<=0.05&&comparison.mean<=7.5;
   if(!ok){
    await mkdir(failures,{recursive:true});
    await writeFile(join(failures,spec.key+"-actual.jpg"),actual);
    if(comparison.diffPng)await writeFile(join(failures,spec.key+"-diff.png"),
     Buffer.from(comparison.diffPng,"base64"));
    problems.push(spec.key+": "+JSON.stringify({
     changedPct:Number((comparison.ratio*100).toFixed(2)),
     meanError:Number(comparison.mean.toFixed(2)),
     actual:comparison.actual,baseline:comparison.expected
    }));
   }else passed++;
  }finally{await page.close()}
 }
 assert.deepEqual(problems,[],
  "Visual regressions: inspect artifacts/visual for actual and diff images.");
 console.log("PASS: "+passed+" component screenshots (header, hero, chapters; 390/1280; light/dark)");
}finally{
 await browser.close();
 await new Promise(done=>server.close(done));
}
