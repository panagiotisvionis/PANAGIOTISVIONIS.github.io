// BlueAbility Accessibility First loader
const parts=['app.pack.00','app.pack.01','app.pack.02','app.pack.03','app.pack.04','app.pack.05','app.pack.06'];
if(!('DecompressionStream' in window)) throw new Error('Το πρόγραμμα περιήγησης χρειάζεται υποστήριξη DecompressionStream.');
const packed=(await Promise.all(parts.map(async p=>{const r=await fetch('./'+p+'?v=20260915a11y1',{cache:'force-cache'});if(!r.ok)throw new Error('Αποτυχία φόρτωσης '+p);return r.text()}))).join('');
const raw=Uint8Array.from(atob(packed),c=>c.charCodeAt(0));
const source=await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
const url=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
try{
  await import(url);
  document.getElementById('copy')?.classList.add('lesson-copy');
  document.querySelector('#lesson .actions')?.classList.add('modal-actions');
  await import('./accessibility-first.js?v=20260915a11y2');
  await import('./visual-dedupe.js?v=20260915visual1');
}finally{URL.revokeObjectURL(url)}
