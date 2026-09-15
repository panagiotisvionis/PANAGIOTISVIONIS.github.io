(()=>{
const drive=id=>`https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
const uns=id=>`https://unsplash.com/photos/${id}/download?force=true&w=1600`;
const A={
 hero:{p:drive('1PkVK-HoIUcxRpF27GNk9JH2UEtGLXasK'),f:uns('bsr7akPJIcw')},
 biodiversity:{p:drive('12tkyTWPPLAaRBQiNJSwy1VQz6CLT9I4b'),f:uns('39SlEAlZEq8')},
 fishing:{p:drive('1O8mHYfMwhNwCOscG0HPxVXTaHcH8RB3Q'),f:uns('XEtFmDMUNB0')},
 coast:{p:drive('1KgUD38SdE8idUY1flLC8TJ_mK-EvvPdu'),f:uns('FJRYUL_YHXg')},
 educator:{p:drive('1XOSYus-WKyHzJg6fetiOL34wLVPza9oH'),f:uns('bsr7akPJIcw')},
 family:{p:drive('14AZYl4EjWBGcWzm6Ds9uUH2QERvBJKiz'),f:uns('4TXds-w6n9U')},
 assistant:{p:drive('1Sq4OrmPshK1yuRM6tt5ftt3MQfSierWk'),f:uns('bsr7akPJIcw')},
 field:{p:drive('1BTWXlylqtsJZE7rvOOtuaW9NnmJzuuoh'),f:uns('WwWPcQkzHPk')}
};
const cache={};
function choose(key,cb){if(cache[key])return cb(cache[key]);let a=A[key]||A.hero,i=new Image();i.onload=()=>{cache[key]=a.p;cb(a.p)};i.onerror=()=>{cache[key]=a.f;cb(a.f)};i.src=a.p}
function bg(el,key,extra=''){if(!el||el.dataset.premiumBg===key)return;el.dataset.premiumBg=key;choose(key,u=>{el.style.backgroundImage=`${extra?extra+',':''}url("${u}")`})}
function lessonKey(l){let s=(l?.slug||'').toLowerCase();if(/fishing|bycatch|consumption/.test(s))return'fishing';if(/pollution|plastic|coast/.test(s))return'coast';if(/accessible|water-safety/.test(s))return'family';if(/citizen|blue-action|responsible|protected|climate/.test(s))return'field';return'biodiversity'}
function roleVisual(){try{if(typeof S!=='undefined'&&S.demoRole==='educator')return'educator';if(typeof S!=='undefined'&&S.demoRole==='caregiver')return'family'}catch(e){}return'hero'}
function strip(key,kicker,title,copy,pills){let main=document.querySelector('#main'),head=main?.querySelector('.head');if(!main||!head||main.querySelector('.premiumStrip'))return;let x=document.createElement('section');x.className='premiumStrip';x.innerHTML=`<div class="premiumStripContent"><p class="eye">${kicker}</p><h2>${title}</h2><p>${copy}</p>${pills?`<div class="miniPills">${pills.map(v=>`<span>${v}</span>`).join('')}</div>`:''}</div>`;head.after(x);bg(x,key)}
function decorateLessons(){let cards=[...document.querySelectorAll('.lesson')];if(!cards.length)return;cards.forEach((c,i)=>{if(c.querySelector('.lessonVisual'))return;let l=null;try{let id=c.querySelector('[data-l]')?.dataset.l;l=(typeof S!=='undefined'&&S.lessons||[]).find(x=>x.id===id)||((typeof S!=='undefined'&&S.lessons||[])[i])}catch(e){}let v=document.createElement('div');v.className='lessonVisual';c.prepend(v);bg(v,lessonKey(l))})}
function decorateGames(){let keys=['biodiversity','fishing','coast','assistant'];document.querySelectorAll('.gameIcon').forEach((g,i)=>{g.classList.add('premiumGame');bg(g,keys[i%keys.length])})}
function decorate(){let main=document.querySelector('#main');if(!main)return;let view='';try{view=typeof S!=='undefined'?S.view:''}catch(e){}main.classList.remove('premiumHome','premiumLearn','premiumField','premiumAssistant');
 if(view==='home'){main.classList.add('premiumHome');let h=main.querySelector('.heroCard');if(h){h.classList.add('premiumHero');bg(h,roleVisual())}}
 if(view==='learn'){main.classList.add('premiumLearn');strip('biodiversity','Εξερεύνηση · γνώση · δράση','18 διαδρομές για να γνωρίσουμε τη θάλασσα.','Από τα οικοσυστήματα και την Ποσειδωνία μέχρι την προσβασιμότητα, την ασφαλή συμμετοχή και τη δράση πολιτών.',['3 επίπεδα','Βλέπω · Ακούω · Παίζω','Πράξη στο πεδίο']);decorateLessons();let h=main.querySelector('.head h1');if(h&&/10 ενότητες/.test(h.textContent))h.textContent=h.textContent.replace('10 ενότητες','18 ενότητες')}
 if(view==='games')decorateGames();
 if(view==='assistant'){main.classList.add('premiumAssistant');strip('assistant','Θαλάσσιος βοηθός','Ένας ήρεμος χώρος για ερωτήσεις και ανακάλυψη.','Ζήτησε εξήγηση με απλά λόγια, ιδέες για δραστηριότητες ή βοήθεια για να συνδέσεις όσα μαθαίνεις με όσα παρατηρείς.',['Προσβάσιμες απαντήσεις','3 επίπεδα γλώσσας','Ιδέες για δράση'])}
 if(view==='field'){main.classList.add('premiumField');strip('field','Στο πεδίο','Η μάθηση συνεχίζεται έξω, δίπλα στη θάλασσα.','Δράσεις ακτής, παρατήρηση, citizen science και συμμετοχή με σαφείς ρόλους ώστε κάθε άνθρωπος να μπορεί να συνεισφέρει.',['Συμμετοχή','Παρατήρηση','Κοινότητα'])}
 if(view==='progress')strip('coast','Η διαδρομή σου','Μικρά βήματα, ορατή πρόοδος.','Δες τι ολοκλήρωσες, πού θέλεις επανάληψη και ποια επόμενη εμπειρία ταιριάζει στη διαδρομή σου.',['Χωρίς πίεση','Mastery','Προσωπικός ρυθμός']);
 let proof=[...document.querySelectorAll('.proof span')].find(x=>/10 ενότητες/.test(x.textContent));if(proof)proof.textContent='18 ενότητες';
}
function bootVisuals(){bg(document.querySelector('.art'),'hero');decorate();let main=document.querySelector('#main');if(main){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}).observe(main,{childList:true,subtree:true})}document.addEventListener('click',()=>setTimeout(decorate,0),true);document.addEventListener('change',()=>setTimeout(decorate,0),true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootVisuals);else bootVisuals();
})();
