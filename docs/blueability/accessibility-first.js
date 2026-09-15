(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
let speech=null;
const roleText=()=>($('#ur')?.textContent||'').toLowerCase();
const isBeneficiary=()=>/ωφελ/.test(roleText());
const visible=e=>!!(e&&e.offsetParent!==null);
const sayLive=t=>{let n=$('#baA11yLive');if(!n){n=document.createElement('div');n.id='baA11yLive';n.setAttribute('aria-live','polite');n.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)';document.body.appendChild(n)}n.textContent='';setTimeout(()=>n.textContent=t,20)};

function greekVoice(){
 if(!('speechSynthesis'in window))return null;
 const voices=speechSynthesis.getVoices()||[];
 const greek=voices.filter(v=>/^el([_-]|$)/i.test(v.lang||''));
 const rank=v=>/natural|neural|google|microsoft|athina|melina/i.test(v.name||'')?3:/premium|enhanced/i.test(v.name||'')?2:1;
 return greek.sort((a,b)=>rank(b)-rank(a))[0]||voices.find(v=>/^el/i.test(v.lang||''))||null;
}
function currentRate(){const x=$('#voiceRate');return x?Math.max(.6,Math.min(1.4,+x.value||.9)):.9}
function speakText(text){if(!('speechSynthesis'in window)){sayLive('Η συσκευή δεν υποστηρίζει αφήγηση.');return}speechSynthesis.cancel();speech=new SpeechSynthesisUtterance(text);speech.lang='el-GR';speech.rate=currentRate();speech.pitch=1;const v=greekVoice();if(v)speech.voice=v;speech.onstart=()=>sayLive('Η ελληνική αφήγηση ξεκίνησε.');speech.onend=()=>sayLive('Η αφήγηση ολοκληρώθηκε.');speechSynthesis.speak(speech)}
function pauseResume(){if(!('speechSynthesis'in window))return;if(speechSynthesis.speaking&&!speechSynthesis.paused){speechSynthesis.pause();sayLive('Παύση αφήγησης.')}else if(speechSynthesis.paused){speechSynthesis.resume();sayLive('Συνέχεια αφήγησης.')}}
function transcriptText(root){const c=root.cloneNode(true);$$('button,select,input,textarea,.ba-voicebar,.voicebar,.transcript',c).forEach(x=>x.remove());return(c.innerText||'').replace(/\s+/g,' ').trim()}
function enhanceLessonVoice(){
 const copy=$('#copy');if(!visible(copy)||copy.dataset.baVoiceEnhanced)return;
 const native=[...copy.querySelectorAll('button')].some(b=>/άκου|παύση|φωνή|αφήγηση/i.test(b.textContent||''));
 if(native){copy.dataset.baVoiceEnhanced='native';return}
 const text=transcriptText(copy);if(text.length<30)return;
 copy.dataset.baVoiceEnhanced='1';
 const bar=document.createElement('div');bar.className='ba-voicebar';bar.setAttribute('role','group');bar.setAttribute('aria-label','Ελληνική αφήγηση και transcript');
 bar.innerHTML='<button type="button" data-ba-play>▶ Άκουσε</button><button type="button" data-ba-pause>⏸ Παύση</button><button type="button" data-ba-restart>↻ Από την αρχή</button><button type="button" data-ba-trans>📄 Transcript</button><span data-ba-voice></span>';
 const tr=document.createElement('section');tr.className='ba-transcript';tr.hidden=!($('#transcriptToggle')?.checked);tr.innerHTML='<h4>Transcript</h4><p></p>';tr.querySelector('p').textContent=text;
 copy.prepend(tr);copy.prepend(bar);
 $('[data-ba-play]',bar).onclick=()=>speakText(text);$('[data-ba-pause]',bar).onclick=pauseResume;$('[data-ba-restart]',bar).onclick=()=>speakText(text);$('[data-ba-trans]',bar).onclick=()=>{tr.hidden=!tr.hidden};
 const v=greekVoice();$('[data-ba-voice]',bar).textContent=v?`Ελληνικά · ${v.name}`:'Ελληνική φωνή συσκευής';
}
function beneficiarySupport(){
 if(!isBeneficiary()||$('#baBeneficiarySupport')||!visible($('#main')))return;
 const hero=$('#main .ba-hero,.main .hero');if(!hero)return;
 const box=document.createElement('section');box.id='baBeneficiarySupport';box.className='ba-beneficiary-support';
 box.innerHTML='<h2>Τι θέλεις να κάνεις σήμερα;</h2><p>Διάλεξε ένα βήμα. Μπορείς να σταματήσεις και να συνεχίσεις όποτε θέλεις.</p><div class="ba-choice-grid"><button type="button" data-v="learn"><span>👀</span><b>Να δω και να μάθω</b></button><button type="button" data-v="games"><span>🎮</span><b>Να παίξω</b></button><button type="button" data-v="field"><span>🌊</span><b>Να κάνω κάτι για τη θάλασσα</b></button></div>';
 hero.insertAdjacentElement('afterend',box);$$('button[data-v]',box).forEach(b=>b.onclick=()=>document.querySelector(`#nav [data-v="${b.dataset.v}"]`)?.click());
}
function fieldAccessibility(){
 $$('.ba-action,.action-card').forEach(card=>{if($('.ba-field-access',card))return;const body=$('.ba-card-body',card)||card;const d=document.createElement('div');d.className='ba-field-access';d.setAttribute('aria-label','Δυνατότητες προσβάσιμης συμμετοχής');d.innerHTML='<span>♿ Προσβάσιμος ρόλος</span><span>🪑 Καθιστή συμμετοχή</span><span>🔇 Ήσυχη επιλογή</span><span>👥 Συνοδός</span>';body.appendChild(d)})
}
function semantics(){const m=$('#main');if(m){m.setAttribute('role','main');m.setAttribute('tabindex','-1')}const nav=$('#nav');if(nav)nav.setAttribute('aria-label','Κύρια πλοήγηση BlueAbility')}
function style(){if($('#baA11yPlusStyle'))return;const s=document.createElement('style');s.id='baA11yPlusStyle';s.textContent=`
.ba-voicebar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 14px;padding:12px;border:1px solid #b9deeb;background:#ecf9fd;border-radius:16px}.ba-voicebar button{min-height:46px;padding:0 13px;border:1px solid #9dcddd;border-radius:11px;background:#fff;color:#063b55;font-weight:800;cursor:pointer}.ba-voicebar span{margin-left:auto;font-size:.76rem;color:#526f7c}.ba-transcript{margin:0 0 16px;padding:16px;border:2px solid #b9deeb;background:#fff;border-radius:16px;line-height:1.75}.ba-transcript[hidden]{display:none}.ba-transcript h4{margin:0 0 8px}.ba-beneficiary-support{margin:18px 0;padding:20px;border-radius:22px;background:linear-gradient(135deg,#eaf9ff,#fff);border:1px solid #c7e6f1}.ba-beneficiary-support h2{margin:0 0 6px}.ba-beneficiary-support p{margin:0;color:#527080}.ba-choice-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}.ba-choice-grid button{min-height:108px;text-align:left;border:2px solid #b6dce9;background:#fff;border-radius:18px;padding:14px;color:#073b55;cursor:pointer}.ba-choice-grid span{display:block;font-size:1.7rem;margin-bottom:8px}.ba-choice-grid b{font-size:1rem}.ba-choice-grid button:focus-visible,.ba-choice-grid button:hover{outline:4px solid #ffb703;outline-offset:2px;border-color:#10a7d5}.ba-field-access{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.ba-field-access span{display:inline-flex;align-items:center;min-height:32px;padding:5px 9px;border-radius:999px;background:#e9f8ef;color:#155c34;font-size:.73rem;font-weight:800}@media(max-width:760px){.ba-choice-grid{grid-template-columns:1fr}.ba-voicebar span{width:100%;margin-left:0}}
`;document.head.appendChild(s)}
function enhance(){style();semantics();enhanceLessonVoice();beneficiarySupport();fieldAccessibility()}
if('speechSynthesis'in window){speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=enhance}
let raf=0;const mo=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(enhance)});mo.observe(document.documentElement,{childList:true,subtree:true});document.addEventListener('click',()=>setTimeout(enhance,40),true);window.addEventListener('load',()=>setTimeout(enhance,120));setTimeout(enhance,200);
})();