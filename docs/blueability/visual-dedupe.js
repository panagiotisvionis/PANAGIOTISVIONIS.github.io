(()=>{
'use strict';

/*
 BlueAbility global visual manifest
 Rule: one photographic image belongs to exactly one semantic UI slot.
 The mapping is deterministic across reloads and routes, not session-random.
*/
const BUILD='visual-global-v2';
const VISUAL_SELECTORS=[
  '.auth-art','.art',
  '.ba-hero','.heroCard',
  '.ba-thumb','.visual','.lesson-visual','.ba-lesson-hero',
  '.game-visual','.ba-game-visual',
  '.card-cover','.ba-class-cover','.event-cover','.field-cover'
].join(',');
const slotMap=new Map();
const lockOwner=new Map();
let scheduled=0;

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();

function hash32(str,seed=2166136261){
  let h=seed>>>0;
  for(let i=0;i<str.length;i++){
    h^=str.charCodeAt(i);
    h=Math.imul(h,16777619);
  }
  h^=h>>>16;
  h=Math.imul(h,0x85ebca6b);
  h^=h>>>13;
  h=Math.imul(h,0xc2b2ae35);
  h^=h>>>16;
  return h>>>0;
}

function activeView(){
  const active=$('#nav [data-v].on');
  const role=clean($('#ur')?.textContent).toLowerCase();
  if(active?.dataset?.v)return `${role||'user'}:${active.dataset.v}`;
  if(!$('#app')?.classList.contains('hide'))return `${role||'user'}:app`;
  return 'public:auth';
}

function nearestTitle(el){
  const owner=el.closest('article,section,dialog,.card,.lesson,.ba-visual-card,.ba-game-card,.ba-action,.ba-class');
  if(!owner)return'';
  return clean(owner.querySelector('h1,h2,h3,h4,[data-title]')?.textContent||owner.getAttribute('aria-label')||'').slice(0,120);
}

function semanticId(el,index){
  const explicit=[
    el.id,
    el.dataset?.l,el.dataset?.play,el.dataset?.j,el.dataset?.openclass,
    el.closest('[data-l]')?.dataset?.l,
    el.closest('[data-play]')?.dataset?.play,
    el.closest('[data-j]')?.dataset?.j,
    el.closest('[data-openclass]')?.dataset?.openclass
  ].filter(Boolean).join(':');
  const cls=clean(el.className).split(' ').filter(Boolean).sort().join('.').slice(0,100);
  const title=nearestTitle(el);
  const sectionTitle=clean(el.closest('section')?.querySelector('h1,h2')?.textContent||'').slice(0,100);
  return `${activeView()}|${explicit||'-'}|${cls||el.tagName}|${title||sectionTitle||'-'}|slot:${index}`;
}

function topicFor(el){
  const s=clean(`${activeView()} ${nearestTitle(el)} ${el.parentElement?.innerText||''}`).toLowerCase();
  if(/αναπηρ|αμεα|ωφελ|προσβασ|αμαξ|συνοδ|ένταξ/.test(s))return'inclusive,disability,people,coast';
  if(/χελων/.test(s))return'sea,turtle,mediterranean,wildlife';
  if(/ποσειδων/.test(s))return'posidonia,seagrass,mediterranean,underwater';
  if(/κοραλλ|ύφαλ|οικοσυσ/.test(s))return'underwater,reef,mediterranean,marine';
  if(/πλασ|ρύπαν|σκουπ|καθαρ/.test(s))return'ocean,cleanup,environment,coast';
  if(/αλι|ψαρ|δίχτυ/.test(s))return'sustainable,fishing,mediterranean,sea';
  if(/εκπαιδευ|τάξ|μάθη|βιβλιοθήκ/.test(s))return'inclusive,education,technology,learning';
  if(/οικογέν|φροντισ/.test(s))return'family,inclusion,coast,outdoors';
  if(/κοινότη|εθελον|δράσ/.test(s))return'community,volunteer,coast,mediterranean';
  if(/πρόοδο|analytics|διαχείρι/.test(s))return'ocean,technology,education,blue';
  if(/παιχνίδ|αποστολή/.test(s))return'ocean,exploration,marine,adventure';
  return'mediterranean,ocean,marine,coast';
}

function uniqueLock(key){
  for(let salt=0;salt<1000;salt++){
    const lock=10000+(hash32(`${BUILD}|${key}|${salt}`)%900000000);
    const owner=lockOwner.get(lock);
    if(!owner||owner===key){lockOwner.set(lock,key);return lock}
  }
  return 900000001+(slotMap.size%999999);
}

function imageFor(key,topic){
  if(slotMap.has(key))return slotMap.get(key);
  const lock=uniqueLock(key);
  // lock makes each semantic slot stable; different slots never share the same lock.
  const url=`https://loremflickr.com/1600/900/${encodeURIComponent(topic)}?lock=${lock}`;
  slotMap.set(key,url);
  return url;
}

function apply(el,url,key){
  if(el.dataset.baVisualSlot===key&&el.dataset.baVisualUrl===url)return;
  el.dataset.baVisualSlot=key;
  el.dataset.baVisualUrl=url;
  el.dataset.baUniquePhoto='true';
  const isHero=el.matches('.auth-art,.art,.ba-hero,.heroCard,.ba-lesson-hero,.game-visual,.ba-game-visual');
  const overlay=isHero
    ? 'linear-gradient(120deg,rgba(3,31,48,.76),rgba(5,62,78,.36),rgba(4,35,49,.18)),'
    : '';
  el.style.backgroundImage=`${overlay}url("${url}")`;
  el.style.backgroundSize='cover';
  el.style.backgroundPosition='center';
}

function collect(){
  const roots=[];
  if(!$('#auth')?.classList.contains('hide'))roots.push($('#auth'));
  if(!$('#app')?.classList.contains('hide'))roots.push($('#app'));
  if(!roots.length)roots.push(document);
  const out=[];
  roots.forEach(root=>{
    if(!root)return;
    $$(VISUAL_SELECTORS,root).forEach(el=>{
      // Avoid styling plain text wrappers named .hero unless they already carry/expect a visual background.
      if(el.matches('.hero')&&!el.classList.contains('ba-hero')&&!/url\(/.test(getComputedStyle(el).backgroundImage||''))return;
      if(!out.includes(el))out.push(el);
    });
  });
  return out;
}

function audit(){
  const elements=collect();
  const routeSeen=new Set();
  elements.forEach((el,index)=>{
    const key=semanticId(el,index);
    let url=imageFor(key,topicFor(el));
    // Defensive duplicate check for the current DOM as well.
    if(routeSeen.has(url)){
      const altKey=`${key}|collision:${index}`;
      url=imageFor(altKey,topicFor(el));
    }
    routeSeen.add(url);
    apply(el,url,key);
  });

  // Final invariant: no two visible photographic slots may expose the same assigned URL.
  const finalSeen=new Map();
  elements.forEach((el,index)=>{
    const u=el.dataset.baVisualUrl;
    if(!u)return;
    if(finalSeen.has(u)){
      const key=`${semanticId(el,index)}|repair`;
      const url=imageFor(key,topicFor(el));
      apply(el,url,key);
    }else finalSeen.set(u,el);
  });
}

function schedule(){
  cancelAnimationFrame(scheduled);
  scheduled=requestAnimationFrame(()=>setTimeout(audit,0));
}

const mo=new MutationObserver(muts=>{
  // Ignore our own data/style writes; react mainly to route/content replacement.
  if(muts.some(m=>m.type==='childList'))schedule();
});
mo.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(audit,120));
document.addEventListener('click',()=>setTimeout(audit,80),true);
window.addEventListener('popstate',()=>setTimeout(audit,80));
setTimeout(audit,220);

// Small diagnostic for manual QA in DevTools without affecting users.
window.BlueAbilityVisualAudit=()=>{
  const rows=collect().map((el,index)=>({slot:semanticId(el,index),url:el.dataset.baVisualUrl||'',title:nearestTitle(el)}));
  const counts=rows.reduce((m,r)=>(m[r.url]=(m[r.url]||0)+1,m),{});
  return {total:rows.length,duplicates:Object.entries(counts).filter(([u,n])=>u&&n>1),rows};
};
})();
