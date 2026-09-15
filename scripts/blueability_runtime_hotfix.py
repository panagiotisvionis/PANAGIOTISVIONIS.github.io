from pathlib import Path
import re

p = Path('docs/blueability/index.html')
s = p.read_text(encoding='utf-8')

# Keep a single hotfix block on repeated deployments.
s = re.sub(
    r'\n?/\* BLUEABILITY_RUNTIME_HOTFIX_V4_START \*/.*?/\* BLUEABILITY_RUNTIME_HOTFIX_V4_END \*/\n?',
    '\n',
    s,
    flags=re.S,
)

hotfix = r'''
/* BLUEABILITY_RUNTIME_HOTFIX_V4_START */
const baAdminShell=(message='Φόρτωση δεδομένων οργανισμού…')=>`<section class="ba-hero" style="background-image:linear-gradient(90deg,rgba(2,28,45,.86),rgba(4,71,91,.48)),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85')"><div><span class="tag">BlueAbility · Διαχείριση</span><h1>Ένας οργανισμός, πολλοί δρόμοι μάθησης.</h1><p>Περιεχόμενο, δραστηριότητες, κοινότητα και πρόοδος σε ένα ενιαίο, προσβάσιμο περιβάλλον.</p></div><div class="ba-hero-side"><div class="ba-glass"><small>Κατάσταση</small><strong style="font-size:1rem">${esc(message)}</strong></div></div></section><div class="ba-stats"><article class="card ba-stat"><span class="ico">👥</span><div><strong>—</strong><small>μαθητές / ωφελούμενοι</small></div></article><article class="card ba-stat"><span class="ico">🧑‍🏫</span><div><strong>—</strong><small>εκπαιδευτικοί</small></div></article><article class="card ba-stat"><span class="ico">🏫</span><div><strong>—</strong><small>τάξεις</small></div></article><article class="card ba-stat"><span class="ico">✦</span><div><strong>18</strong><small>ενότητες</small></div></article></div><article class="card ba-panel"><h3>Το BlueAbility είναι ενεργό.</h3><p class="muted">Μπορείς να ανοίξεις Περιεχόμενο, Δραστηριότητες, Analytics, Δράσεις και Κοινότητα από το αριστερό μενού.</p></article>`;

const baPreviousShowApp=showApp;
showApp=function(){
  baPreviousShowApp();
  const dr=$('#demoRole');
  if(dr){
    const names={'':'Κανονική διαχείριση','student':'Προβολή · Μαθητής','beneficiary':'Προβολή · Ωφελούμενος','educator':'Προβολή · Εκπαιδευτικός','caregiver':'Προβολή · Οικογένεια'};
    [...dr.options].forEach(o=>o.textContent=names[o.value]||o.textContent);
  }
  if(!$('#main').innerHTML.trim()){
    $('#main').innerHTML=(role()==='org_admin'&&!isDemo())?baAdminShell():'<article class="card ba-panel"><h3>Φόρτωση εμπειρίας…</h3><p class="muted">Ετοιμάζουμε το προσωπικό σου περιβάλλον.</p></article>';
  }
};

organization=async function(){
  if(role()!=='org_admin'||isDemo())return adminAnalytics();
  $('#main').innerHTML=baAdminShell('Σύνδεση με τα δεδομένα οργανισμού…');
  try{
    const orgId=S.m?.organization_id;
    if(!orgId){
      $('#main').insertAdjacentHTML('beforeend','<article class="card ba-panel" style="margin-top:16px"><h3>Η σύνδεση οργανισμού δεν φορτώθηκε ακόμη.</h3><p class="muted">Η εφαρμογή παραμένει διαθέσιμη. Πάτησε επανάληψη.</p><button class="btn p" id="retryOrg">Επανάληψη</button></article>');
      $('#retryOrg')?.addEventListener('click',organization);
      return;
    }
    const timeout=new Promise((_,rej)=>setTimeout(()=>rej(new Error('organization timeout')),9000));
    const queries=Promise.all([
      sb.from('organization_memberships').select('*',{count:'exact',head:true}).eq('organization_id',orgId),
      sb.from('classrooms').select('*',{count:'exact',head:true}).eq('organization_id',orgId),
      sb.from('profiles').select('id,display_name,email,requested_account_type,email_confirmed,created_at').order('created_at',{ascending:false})
    ]);
    const [mr,cr,ur]=await Promise.race([queries,timeout]);
    const members=mr?.count||0, classes=cr?.count||0, users=ur?.data||[];
    const publicUsers=users.filter(x=>x.requested_account_type!=='admin');
    const educators=publicUsers.filter(x=>x.requested_account_type==='educator').length;
    const learners=publicUsers.filter(x=>['student','beneficiary'].includes(x.requested_account_type)).length;
    $('#main').innerHTML=`<section class="ba-hero" style="background-image:linear-gradient(90deg,rgba(2,28,45,.9),rgba(4,71,91,.45)),url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85')"><div><span class="tag">Διαχείριση BlueAbility</span><h1>Ένας οργανισμός, πολλοί δρόμοι μάθησης.</h1><p>Οι λογαριασμοί ενεργοποιούνται αυτόματα. Εσύ παραμένεις ο μοναδικός διαχειριστής.</p></div><div class="ba-hero-side"><div class="ba-glass"><small>Μέλη</small><strong>${members}</strong></div><div class="ba-glass"><small>Τάξεις</small><strong>${classes}</strong></div></div></section><div class="ba-stats"><article class="card ba-stat"><span class="ico">👥</span><div><strong>${learners}</strong><small>μαθητές / ωφελούμενοι</small></div></article><article class="card ba-stat"><span class="ico">🧑‍🏫</span><div><strong>${educators}</strong><small>εκπαιδευτικοί</small></div></article><article class="card ba-stat"><span class="ico">🏫</span><div><strong>${classes}</strong><small>τάξεις</small></div></article><article class="card ba-stat"><span class="ico">📘</span><div><strong>${S.lessons.length||18}</strong><small>ενότητες</small></div></article></div><div class="ba-section"><div><h2>Χρήστες BlueAbility</h2><p>Ρόλοι από την εγγραφή — χωρίς ουρά έγκρισης.</p></div></div><div class="card ba-panel"><table class="ba-table"><thead><tr><th>Όνομα</th><th>Ρόλος</th><th>Email</th><th>Εγγραφή</th></tr></thead><tbody>${publicUsers.map(x=>`<tr><td><b>${esc(x.display_name||'Χωρίς όνομα')}</b></td><td>${esc(accountLabels[x.requested_account_type]||'Χρήστης')}</td><td>${esc(x.email||'')}${x.email_confirmed?' ✓':''}</td><td>${new Date(x.created_at).toLocaleDateString('el-GR')}</td></tr>`).join('')||'<tr><td colspan="4">Δεν υπάρχουν ακόμη χρήστες.</td></tr>'}</tbody></table></div>`;
  }catch(err){
    console.error('BlueAbility organization load failed',err);
    $('#main').innerHTML=baAdminShell('Η εφαρμογή είναι ενεργή')+'<article class="card ba-panel" style="margin-top:16px"><h3>Δεν φορτώθηκαν τα στατιστικά.</h3><p class="muted">Το υπόλοιπο περιβάλλον λειτουργεί κανονικά. Πάτησε επανάληψη.</p><button class="btn p" id="retryOrg">Επανάληψη</button></article>';
    $('#retryOrg')?.addEventListener('click',organization);
  }
};

const baPreviousBoot=boot;
boot=async function(){
  try{
    return await Promise.race([baPreviousBoot(),new Promise((_,rej)=>setTimeout(()=>rej(new Error('boot timeout')),15000))]);
  }catch(err){
    console.error('BlueAbility boot fallback',err);
    showApp();renderNav();
    if(role()==='org_admin'&&!isDemo())$('#main').innerHTML=baAdminShell('Η εφαρμογή είναι ενεργή — επανάληψη φόρτωσης');
  }
};
/* BLUEABILITY_RUNTIME_HOTFIX_V4_END */
'''

anchor = 'await boot();'
pos = s.rfind(anchor)
if pos < 0:
    raise SystemExit('boot anchor missing')

s = s[:pos] + hotfix + '\n' + s[pos:]
s = s.replace('>Κανονική προβολή<', '>Κανονική διαχείριση<')
s = re.sub(r'\./premium\.css\?v=[^"\']+', './premium.css?v=20260915pro4', s)
p.write_text(s, encoding='utf-8')
