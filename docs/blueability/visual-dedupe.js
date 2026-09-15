(()=>{
'use strict';
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const SESSION='blueability-visual-map-v1';
let state={used:{},slots:{},next:1};
try{state={...state,...JSON.parse(sessionStorage.getItem(SESSION)||'{}')}}catch(_){ }
const persist=()=>{try{sessionStorage.setItem(SESSION,JSON.stringify(state))}catch(_){ }};
const visualSelectors='.auth-art,.hero,.ba-hero,.ba-thumb,.visual,.lesson-visual,.ba-lesson-hero,.game-visual,.ba-game-visual,.card-cover,.ba-class-cover,.event-cover,.field-cover';
function urls(bg){return[...String(bg||'').matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1])}
function text(el){return(el.innerText||'').replace(/\s+/g,' ').trim().slice(0,100)}
function page(){return(document.querySelector('#main h1')?.textContent||document.querySelector('#main h2')?.textContent||document.title||'BlueAbility').trim()}
function topic(el){const s=(page()+' '+text(el)).toLowerCase();if(/αναπηρ|αμεα|προσβασ|ωφελ/.test(s))return'accessibility,inclusion,people';if(/χελων/.test(s))return'sea,turtle,mediterranean';if(/ποσειδων|οικοσυσ|ύφαλ|κοραλλ/.test(s))return'underwater,marine,reef';if(/πλασ|ρύπαν|καθαρ/.test(s))return'ocean,cleanup,environment';if(/αλι|ψαρ/.test(s))return'sustainable,fishing,sea';if(/εκπαιδευ|τάξ|μάθη/.test(s))return'inclusive,education,technology';if(/οικογέν|φροντισ/.test(s))return'family,inclusion,outdoors';if(/δράσ|κοινότη/.test(s))return'community,coast,volunteer';return'ocean,mediterranean,marine'}
function slotKey(el,i){const cls=(el.className||'').toString().replace(/\s+/g,'.');return`${page()}|${cls}|${text(el)}|${i}`}
function replacement(key,words){if(state.slots[key])return state.slots[key];const lock=9000+(state.next++);const u=`https://loremflickr.com/1600/900/${encodeURIComponent(words)}?lock=${lock}`;state.slots[key]=u;state.used[u]=key;persist();return u}
function applyReplacement(el,url){const bg=getComputedStyle(el).backgroundImage||el.style.backgroundImage||'';if(/linear-gradient|radial-gradient/.test(bg)){const gradients=(bg.match(/(?:linear|radial)-gradient\([^)]*(?:\)[^,)]*)*\)/g)||[]).join(',');el.style.backgroundImage=(gradients?gradients+',':'')+`url("${url}")`}else el.style.backgroundImage=`url("${url}")`;el.dataset.baUniquePhoto='1'}
function audit(){
 const localSeen=new Map();
 $$(visualSelectors).filter(el=>el.offsetParent!==null).forEach((el,i)=>{
   const key=slotKey(el,i);
   if(state.slots[key]){applyReplacement(el,state.slots[key]);return}
   const list=urls(getComputedStyle(el).backgroundImage||el.style.backgroundImage);const original=list[list.length-1];
   if(!original)return;
   const prior=localSeen.get(original)||state.used[original];
   if(prior&&prior!==key){applyReplacement(el,replacement(key,topic(el)))}else{localSeen.set(original,key);state.used[original]=key;persist()}
 });
}
let raf=0;const mo=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(audit)});mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});window.addEventListener('load',()=>setTimeout(audit,150));document.addEventListener('click',()=>setTimeout(audit,80),true);setTimeout(audit,300);
})();