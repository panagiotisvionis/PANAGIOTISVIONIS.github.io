(()=>{
'use strict';
const STORE='blueability-a11y-v1';
const defaults={easy:false,big:true,calm:false,transcript:true,speed:0.9};
let pref={...defaults};
try{pref={...pref,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch(_){ }
let utterance=null,paused=false,visualCounter=1;
const assigned=new Map();
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(pref))}catch(_){ }applyPrefs()};
const roleText=()=>($('#ur')?.textContent||'').toLowerCase();
const isBeneficiary=()=>/ωφελ/.test(roleText());
const isLearner=()=>/(μαθη|ωφελ)/.test(roleText());
const textOf=el=>(el?.innerText||'').replace(/\s+/g,' ').trim();
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function injectBase(){
 if($('#baA11yStyle'))return;
 const style=document.createElement('style');style.id='baA11yStyle';style.textContent=`
 .ba-skip{position:fixed;left:14px;top:10px;z-index:99999;transform:translateY(-160%);background:#fff;color:#063b55;padding:12px 18px;border-radius:12px;font-weight:800;box-shadow:0 8px 30px #001c2f33}.ba-skip:focus{transform:none}
 .ba-a11y-fab{position:fixed;right:18px;bottom:18px;z-index:9998;border:0;border-radius:999px;background:#063b55;color:#fff;padding:13px 18px;font-weight:800;box-shadow:0 10px 30px #001c2f55;cursor:pointer}
 .ba-a11y-panel{position:fixed;right:18px;bottom:76px;z-index:9999;width:min(390px,calc(100vw - 28px));max-height:78vh;overflow:auto;background:#fff;color:#082f43;border:1px solid #b7d8e6;border-radius:22px;padding:18px;box-shadow:0 18px 55px #001c2f3d}.ba-a11y-panel[hidden]{display:none}.ba-a11y-panel h2{font-size:1.25rem;margin:0 0 6px}.ba-a11y-panel p{font-size:.9rem;color:#527080;margin:0 0 14px}.ba-a11y-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:11px 0;border-top:1px solid #e0edf3}.ba-a11y-row label{font-weight:750}.ba-a11y-row small{display:block;color:#67808c;font-weight:500;margin-top:3px}.ba-a11y-row input[type=checkbox]{width:24px;height:24px}.ba-a11y-row select{min-height:42px;border-radius:10px;padding:0 10px}.ba-a11y-close{float:right;border:0;background:#eef8fc;border-radius:10px;padding:7px 10px;font-weight:800;cursor:pointer}
 .ba-audio-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 16px;padding:12px;background:#eaf8fd;border:1px solid #c8e6f1;border-radius:16px}.ba-audio-bar button,.ba-audio-bar select{min-height:44px;border-radius:11px;border:1px solid #9dcddd;background:#fff;color:#073b55;padding:0 12px;font-weight:800}.ba-audio-bar button{cursor:pointer}.ba-audio-status{font-size:.78rem;color:#496d7e;margin-left:auto}.ba-transcript{margin:0 0 16px;padding:16px;border:2px solid #b8dfed;background:#fff;border-radius:16px;line-height:1.7}.ba-transcript h4{margin:0 0 8px}.ba-transcript[hidden]{display:none}
 .ba-access-support{margin:16px 0;padding:18px;border-radius:20px;background:linear-gradient(135deg,#eaf9ff,#f7fcff);border:1px solid #cce9f4}.ba-access-support h3{margin:0 0 8px}.ba-access-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.ba-access-choice{min-height:92px;border:2px solid #b9ddea;background:#fff;border-radius:18px;padding:12px;text-align:left;font-weight:800;color:#0a405b;cursor:pointer}.ba-access-choice span{display:block;font-size:1.55rem;margin-bottom:6px}.ba-access-choice:hover,.ba-access-choice:focus{border-color:#13a7d5;box-shadow:0 0 0 4px #13a7d522}
 .ba-field-access{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}.ba-field-access span{background:#e9f8ef;color:#145b33;border-radius:999px;padding:6px 9px;font-size:.72rem;font-weight:750}
 .ba-easy-mode body{font-size:1.08em}.ba-easy-mode #main p,.ba-easy-mode #main li{max-width:72ch;line-height:1.75}.ba-easy-mode .ba-hero{min-height:310px}.ba-easy-mode .ba-card-body p{font-size:1.02rem}.ba-easy-mode .ba-filterbar{display:none}.ba-easy-mode .ba-section p{max-width:62ch}
 .ba-big-targets button,.ba-big-targets a,.ba-big-targets select,.ba-big-targets input{min-height:48px}.ba-big-targets #nav button{min-height:54px}.ba-big-targets .ba-option{min-height:58px;font-size:1rem}
 .ba-calm *, .ba-calm *::before,.ba-calm *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.ba-calm .ba-hero,.ba-calm .ba-thumb,.ba-calm .ba-game-visual{background-attachment:initial!important}
 :focus-visible{outline:4px solid #ffb703!important;outline-offset:3px!important}
 @media(max-width:720px){.ba-access-grid{grid-template-columns:1fr}.ba-audio-status{width:100%;margin-left:0}.ba-a11y-fab{right:12px;bottom:12px}}
 `;document.head.appendChild(style);
 const skip=document.createElement('a');skip.className='ba-skip';skip.href='#main';skip.textContent='Μετάβαση στο κύριο περιεχόμενο';document.body.prepend(skip);
 const live=document.createElement('div');live.id='baLive';live.setAttribute('aria-live','polite');live.setAttribute('aria-atomic','true');live.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';document.body.appendChild(live);
 const fab=document.createElement('button');fab.className='ba-a11y-fab';fab.type='button';fab.innerHTML='♿ Προσβασιμότητα';fab.setAttribute('aria-controls','baA11yPanel');fab.setAttribute('aria-expanded','false');document.body.appendChild(fab);
 const panel=document.createElement('section');panel.id='baA11yPanel';panel.className='ba-a11y-panel';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','false');panel.setAttribute('aria-labelledby','baA11yTitle');panel.innerHTML=`<button class="ba-a11y-close" type="button" aria-label="Κλείσιμο">✕</button><h2 id="baA11yTitle">Πώς σε βοηθά να χρησιμοποιείς το BlueAbility;</h2><p>Δεν χρειάζεται να δηλώσεις διάγνωση. Διάλεξε μόνο τις ρυθμίσεις που σε εξυπηρετούν.</p>
 <div class="ba-a11y-row"><label>Απλή λειτουργία<small>Λιγότερες πληροφορίες κάθε φορά και πιο καθαρή διάταξη.</small></label><input id="baEasy" type="checkbox"></div>
 <div class="ba-a11y-row"><label>Μεγάλα πλήκτρα<small>Μεγαλύτερες περιοχές πατήματος για αφή, πληκτρολόγιο ή switch.</small></label><input id="baBig" type="checkbox"></div>
 <div class="ba-a11y-row"><label>Ήρεμη εμφάνιση<small>Μειώνει κινήσεις και μεταβάσεις.</small></label><input id="baCalm" type="checkbox"></div>
 <div class="ba-a11y-row"><label>Transcript ανοιχτό<small>Το κείμενο της ελληνικής αφήγησης παραμένει ορατό.</small></label><input id="baTranscript" type="checkbox"></div>
 <div class="ba-a11y-row"><label for="baSpeed">Ταχύτητα ελληνικής φωνής<small>Η αφήγηση ξεκινά μόνο όταν πατήσεις «Άκουσε».</small></label><select id="baSpeed"><option value="0.75">0,75×</option><option value="0.9">0,9×</option><option value="1">1×</option><option value="1.15">1,15×</option><option value="1.25">1,25×</option></select></div>`;document.body.appendChild(panel);
 fab.onclick=()=>{panel.hidden=!panel.hidden;fab.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)$('#baEasy')?.focus()};
 $('.ba-a11y-close',panel).onclick=()=>{panel.hidden=true;fab.setAttribute('aria-expanded','false');fab.focus()};
 $('#baEasy').onchange=e=>{pref.easy=e.target.checked;save()};$('#baBig').onchange=e=>{pref.big=e.target.checked;save()};$('#baCalm').onchange=e=>{pref.calm=e.target.checked;save()};$('#baTranscript').onchange=e=>{pref.transcript=e.target.checked;save();enhanceAudio()};$('#baSpeed').onchange=e=>{pref.speed=+e.target.value;save()};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){panel.hidden=true;fab.setAttribute('aria-expanded','false');fab.focus()}});
}

function applyPrefs(){
 document.documentElement.classList.toggle('ba-easy-mode',!!pref.easy);document.documentElement.classList.toggle('ba-big-targets',!!pref.big);document.documentElement.classList.toggle('ba-calm',!!pref.calm);
 if($('#baEasy'))$('#baEasy').checked=!!pref.easy;if($('#baBig'))$('#baBig').checked=!!pref.big;if($('#baCalm'))$('#baCalm').checked=!!pref.calm;if($('#baTranscript'))$('#baTranscript').checked=!!pref.transcript;if($('#baSpeed'))$('#baSpeed').value=String(pref.speed);
}

function announce(t){const l=$('#baLive');if(l){l.textContent='';setTimeout(()=>l.textContent=t,30)}}
function greekVoice(){const all=speechSynthesis?.getVoices?.()||[];const gr=all.filter(v=>/^el([_-]|$)/i.test(v.lang||''));const score=v=>/natural|neural|microsoft|google|athina|melina/i.test(v.name||'')?2:1;return gr.sort((a,b)=>score(b)-score(a))[0]||all.find(v=>/^el/i.test(v.lang||''))||null}
function speak(text,restart=true){if(!('speechSynthesis'in window))return announce('Η συσκευή δεν υποστηρίζει αφήγηση.');if(restart)speechSynthesis.cancel();utterance=new SpeechSynthesisUtterance(text);utterance.lang='el-GR';utterance.rate=+pref.speed||.9;utterance.pitch=1;const v=greekVoice();if(v)utterance.voice=v;utterance.onstart=()=>{paused=false;announce('Η ελληνική αφήγηση ξεκίνησε.')};utterance.onend=()=>{paused=false;announce('Η αφήγηση ολοκληρώθηκε.')};utterance.onerror=()=>announce('Δεν ήταν δυνατή η αφήγηση σε αυτή τη συσκευή.');speechSynthesis.speak(utterance)}
function pauseResume(){if(!('speechSynthesis'in window))return;if(speechSynthesis.speaking&&!speechSynthesis.paused){speechSynthesis.pause();paused=true;announce('Παύση αφήγησης.')}else if(speechSynthesis.paused){speechSynthesis.resume();paused=false;announce('Συνέχεια αφήγησης.')}}
function cleanTranscript(root){const clone=root.cloneNode(true);$$('button,select,input,textarea,.ba-audio-bar,.ba-transcript',clone).forEach(x=>x.remove());return textOf(clone)}
function enhanceAudio(){
 const copy=$('#copy');if(!copy||!copy.offsetParent)return;if($('.ba-audio-bar',copy)){$('.ba-transcript',copy)?.toggleAttribute('hidden',!pref.transcript);return}
 const text=cleanTranscript(copy);if(text.length<20)return;
 const bar=document.createElement('div');bar.className='ba-audio-bar';bar.setAttribute('role','group');bar.setAttribute('aria-label','Ελληνική αφήγηση και transcript');bar.innerHTML=`<button type="button" data-ba-play>▶ Άκουσε</button><button type="button" data-ba-pause>⏸ Παύση</button><button type="button" data-ba-restart>↻ Από την αρχή</button><button type="button" data-ba-transcript>📄 Transcript</button><select data-ba-speed aria-label="Ταχύτητα αφήγησης"><option value="0.75">0,75×</option><option value="0.9">0,9×</option><option value="1">1×</option><option value="1.15">1,15×</option><option value="1.25">1,25×</option></select><span class="ba-audio-status">Ελληνική φωνή συσκευής</span>`;
 const tr=document.createElement('section');tr.className='ba-transcript';tr.hidden=!pref.transcript;tr.innerHTML=`<h4>Transcript</h4><p>${esc(text)}</p>`;copy.prepend(tr);copy.prepend(bar);$('[data-ba-speed]',bar).value=String(pref.speed);
 $('[data-ba-play]',bar).onclick=()=>speak(text);$('[data-ba-pause]',bar).onclick=pauseResume;$('[data-ba-restart]',bar).onclick=()=>speak(text,true);$('[data-ba-transcript]',bar).onclick=()=>{tr.hidden=!tr.hidden;pref.transcript=!tr.hidden;save()};$('[data-ba-speed]',bar).onchange=e=>{pref.speed=+e.target.value;save();if(speechSynthesis.speaking)speak(text,true)};
 setTimeout(()=>{const v=greekVoice();$('.ba-audio-status',bar).textContent=v?`Ελληνικά · ${v.name}`:'Ελληνική φωνή συσκευής'},250);
}

function topic(el){const t=textOf(el).toLowerCase();if(/αμεα|αναπηρ|προσβασ|ωφελ/.test(t))return'accessibility,disability,inclusion';if(/χελων/.test(t))return'sea,turtle';if(/ποσειδων|οικοσυσ|ύφαλ|κοραλλ/.test(t))return'underwater,marine,ecosystem';if(/πλασ|ρύπαν|καθαρ/.test(t))return'ocean,cleanup,environment';if(/αλι|ψαρ/.test(t))return'sustainable,fishing,sea';if(/εκπαιδευ|τάξ/.test(t))return'inclusive,education,technology';if(/οικογέν|φροντισ/.test(t))return'family,inclusion,outdoors';if(/δράσ|κοινότη/.test(t))return'community,coast,volunteer';return'ocean,mediterranean,marine';}
function stableKey(el,i){const route=($('#main h1')?.textContent||$('#main h2')?.textContent||'page').trim();return [route,el.className,textOf(el).slice(0,90),i].join('|')}
function photoFor(key,words){if(!assigned.has(key)){let n;try{const map=JSON.parse(sessionStorage.getItem('ba-visual-map')||'{}');if(map[key])n=map[key];else{n=visualCounter++;map[key]=n;sessionStorage.setItem('ba-visual-map',JSON.stringify(map))}assigned.set(key,n)}catch(_){assigned.set(key,visualCounter++)}}const n=assigned.get(key);return`https://loremflickr.com/1600/900/${encodeURIComponent(words)}?lock=${700+n}`}
function uniqueVisuals(){
 const els=$$('.ba-hero,.ba-thumb,.ba-class-cover,.ba-lesson-hero,.ba-game-visual,.auth .art').filter(el=>!el.dataset.baUniqueVisual);els.forEach((el,i)=>{const key=stableKey(el,i);el.dataset.baUniqueVisual='1';el.dataset.baVisualKey=key;const url=photoFor(key,topic(el));el.style.backgroundImage=`linear-gradient(90deg,rgba(1,34,52,.68),rgba(1,55,74,.16)),url('${url}')`;if(el.matches('.ba-thumb,.ba-class-cover'))el.style.backgroundImage=`url('${url}')`;});
}

function enhanceBeneficiaryHome(){if(!isBeneficiary()||!$('#main')||$('#baBeneficiarySupport'))return;const h=$('#main .ba-hero');if(!h)return;const box=document.createElement('section');box.id='baBeneficiarySupport';box.className='ba-access-support';box.innerHTML=`<h3>Διάλεξε τον τρόπο που σε βοηθά σήμερα</h3><p>Μπορείς να αλλάξεις επιλογή οποιαδήποτε στιγμή. Δεν υπάρχει χρονική πίεση.</p><div class="ba-access-grid"><button class="ba-access-choice" type="button" data-ba-nav="learn"><span>👀</span>Να δω και να μάθω</button><button class="ba-access-choice" type="button" data-ba-nav="games"><span>🎮</span>Να παίξω</button><button class="ba-access-choice" type="button" data-ba-nav="field"><span>🌊</span>Να κάνω κάτι για τη θάλασσα</button></div>`;h.insertAdjacentElement('afterend',box);$$('[data-ba-nav]',box).forEach(b=>b.onclick=()=>document.querySelector(`#nav [data-v="${b.dataset.baNav}"]`)?.click())}
function enhanceField(){ $$('.ba-action').forEach(a=>{if($('.ba-field-access',a))return;const d=document.createElement('div');d.className='ba-field-access';d.setAttribute('aria-label','Επιλογές προσβάσιμης συμμετοχής');d.innerHTML='<span>♿ Προσβάσιμος ρόλος</span><span>🪑 Καθιστή συμμετοχή</span><span>🔇 Ήσυχη επιλογή</span><span>👥 Με συνοδό</span>';$('.ba-card-body',a)?.insertBefore(d,$('.ba-meta',a)||null)})}
function semantics(){const main=$('#main');if(main){main.setAttribute('role','main');main.setAttribute('tabindex','-1')}const nav=$('#nav');if(nav)nav.setAttribute('aria-label','Κύρια πλοήγηση BlueAbility');$$('button:not([aria-label])').forEach(b=>{if(!b.textContent.trim()&&b.title)b.setAttribute('aria-label',b.title)});}
function enhance(){applyPrefs();semantics();uniqueVisuals();enhanceAudio();enhanceBeneficiaryHome();enhanceField()}

injectBase();applyPrefs();if('speechSynthesis'in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>enhanceAudio()}
let raf=0;const obs=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(enhance)});obs.observe(document.documentElement,{subtree:true,childList:true});window.addEventListener('hashchange',()=>setTimeout(enhance,50));window.addEventListener('load',()=>setTimeout(enhance,150));document.addEventListener('click',()=>setTimeout(enhance,40),true);setTimeout(enhance,300);
})();