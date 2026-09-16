(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
const rawRe=/\$\{[^}]+\}/g;

function numericFrom(el){
  if(!el)return null;
  const candidates=[...el.querySelectorAll('strong,b,.ba-stat-value,.metric strong,.stat strong')];
  for(const n of candidates){
    const m=clean(n.textContent).match(/^\d+$/);
    if(m)return Number(m[0]);
  }
  const m=clean(el.textContent).match(/(?:^|\s)(\d+)(?:\s|$)/);
  return m?Number(m[1]):null;
}
function findNumericByLabel(labels){
  const terms=labels.map(x=>x.toLowerCase());
  const blocks=$$('#main article,#main .card,#main .metric,#main .ba-stat,#main .ba-glass,#main .stat,#main section > div');
  for(const el of blocks){
    const t=clean(el.textContent).toLowerCase();
    if(terms.some(x=>t.includes(x))&&!rawRe.test(t)){
      rawRe.lastIndex=0;
      const n=numericFrom(el); if(n!==null)return n;
    }
    rawRe.lastIndex=0;
  }
  return null;
}
function countUserRows(){
  const tables=$$('#main table');
  for(const table of tables){
    const context=clean(table.closest('section,.card,div')?.textContent||table.textContent).toLowerCase();
    if(!context.includes('χρήστες blueability')&&!context.includes('χρηστες blueability'))continue;
    const rows=$$('tbody tr',table).filter(tr=>!/(δεν υπάρχουν|δεν υπαρχουν)/i.test(tr.textContent||''));
    if(rows.length)return rows.length;
  }
  return null;
}
function countClassCards(){
  const explicit=$$('#main [data-openclass],#main .ba-class,#main .class-card').length;
  if(explicit)return explicit;
  return findNumericByLabel(['τάξεις','ταξεις']);
}
function countApprovedLinks(){
  const explicit=$$('#main [data-link-id].approved,#main .caregiver-link.approved,#main .approved-link').length;
  if(explicit)return explicit;
  const n=findNumericByLabel(['συνδέσεις','συνδεσεις']);
  return n===null?0:n;
}
function isPreview(){return !!$('#demoRole')?.value}
function resolve(expr){
  const e=expr.replace(/\s+/g,'');
  if(e==='classes.length'){
    const n=countClassCards();
    return n===null?(isPreview()?4:0):n;
  }
  if(e==='members'){
    const n=findNumericByLabel(['συμμετέχοντες','συμμετεχοντες','μέλη τάξεων','μελη ταξεων']);
    return n===null?(isPreview()?18:0):n;
  }
  if(e==='m.count||0'||e==='m.count??0'){
    const rows=countUserRows();
    if(rows!==null)return rows;
    const n=findNumericByLabel(['μέλη','μελη']);
    return n===null?0:n;
  }
  if(e==='c.count||0'||e==='c.count??0'){
    const n=countClassCards();
    return n===null?0:n;
  }
  if(/links\.filter\(x=>x\.approved_at\)\.length/.test(e)||/links\.filter\(.+approved_at.+\)\.length/.test(e))return countApprovedLinks();
  return null;
}
function repairTextNode(node){
  const src=node.nodeValue||'';
  if(!src.includes('${'))return false;
  let changed=false;
  const out=src.replace(rawRe,m=>{
    const expr=m.slice(2,-1);
    const v=resolve(expr);
    if(v===null){console.warn('BlueAbility: unresolved UI template placeholder',m);changed=true;return '—'}
    changed=true;return String(v);
  });
  if(changed)node.nodeValue=out;
  return changed;
}
function repair(){
  const root=$('#main'); if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(repairTextNode);
}
let raf=0;
const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>setTimeout(repair,15))};
const mo=new MutationObserver(m=>{if(m.some(x=>x.type==='childList'||x.type==='characterData'))schedule()});
mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
document.addEventListener('click',()=>setTimeout(repair,50),true);
document.addEventListener('change',()=>setTimeout(repair,50),true);
window.addEventListener('load',()=>setTimeout(repair,120));
setTimeout(repair,220);
window.BlueAbilityTemplateAudit=()=>{const root=$('#main');const bad=[];if(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(w.nextNode()){if((w.currentNode.nodeValue||'').includes('${'))bad.push(clean(w.currentNode.nodeValue))}}return{remaining:bad.length,placeholders:bad}};
})();
