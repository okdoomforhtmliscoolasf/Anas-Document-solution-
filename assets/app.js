(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const storage={get(key){try{return window.localStorage.getItem(key)}catch{return null}},set(key,value){try{window.localStorage.setItem(key,value)}catch{}}};

const menu=$('.menu'),nav=$('#site-nav');
if(menu&&nav){
  menu.addEventListener('click',()=>{
    const open=menu.getAttribute('aria-expanded')!=='true';
    menu.setAttribute('aria-expanded',String(open));
    nav.classList.toggle('open',open);
    menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  nav.addEventListener('click',e=>{
    if(e.target.closest('a')){
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
      menu.setAttribute('aria-label','Open navigation');
    }
  });
}

const styles=['bento','editorial','neomorphism','neobrutalism','brutalism','grunge','claymorphism'];
const labels={bento:'Bento grid',editorial:'Editorial',neomorphism:'Neomorphism',neobrutalism:'Neo-brutalism',brutalism:'Brutalism',grunge:'Grunge',claymorphism:'Claymorphism'};
const swatches={bento:'#cbd0bf',editorial:'#e9e3d8',neomorphism:'#d8d8d8',neobrutalism:'#f4d35e',brutalism:'#fff',grunge:'#9b8061',claymorphism:'#d6c4ad'};
const palettes={
paper:['#e9e3d8','#f7f3eb','#eee8dd','#302d28','#81786c','#58604d','#81664c','#d8d0c4','#8b765b','#d8cbb8'],
terracotta:['#eadbd0','#fbf1e9','#f2e5dc','#3d2b25','#8b7064','#8c4f3c','#9b5942','#dec8ba','#a65f45','#e5b9a2'],
sage:['#dfe5d9','#f4f7ef','#e8eee2','#29352d','#71806e','#526b55','#667d5d','#cbd6c5','#607b60','#d3dfce'],
ocean:['#dce4e8','#f2f6f8','#e5edf1','#26343c','#71818a','#3f6576','#426c80','#c7d5dc','#426c80','#c6dce5'],
plum:['#e6dfe6','#f7f1f7','#eee6ef','#352b38','#827487','#705778','#785d7e','#d6cad9','#80628a','#dbc9df'],
mono:['#dededb','#f7f7f4','#ebebe7','#202020','#777772','#41413e','#555550','#c9c9c2','#30302d','#d3d3cb'],
apricot:['#f0e1cb','#fff5e6','#f7ead8','#3b3024','#88745b','#9b693a','#a96f36','#e1c9a7','#a96f36','#efd0a6']
};
function applyStyle(s){
  if(!styles.includes(s))s='bento';
  document.documentElement.dataset.style=s;
  storage.set('ads-style',s);
  $$('[data-style-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.styleChoice===s)));
}
function applyPalette(p){
  if(!palettes[p])p='paper';
  const v=palettes[p],keys=['--paper','--cream','--cream-deep','--ink','--muted','--olive-dark','--clay-dark','--line','--accent','--accent-soft'];
  keys.forEach((k,i)=>document.documentElement.style.setProperty(k,v[i]));
  storage.set('ads-palette',p);
  $$('[data-palette-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.paletteChoice===p)));
}
const drawer=document.createElement('aside');
drawer.id='customizer';
drawer.setAttribute('aria-label','Website settings');
drawer.setAttribute('aria-hidden','true');
drawer.innerHTML=`<div class="customizer-head"><div><p class="eyebrow" style="margin:0 0 5px">ANAS DOCUMENTS SOLUTION</p><h2>Make it yours.</h2></div><button class="drawer-close" aria-label="Close settings">×</button></div>
<section class="drawer-section"><h3>Website styles</h3><p>Change the visual language across the website.</p><div class="theme-grid">${styles.map(s=>`<button class="theme-choice" data-style-choice="${s}" aria-pressed="false"><i class="theme-swatch" style="--swatch:${swatches[s]}"></i>${labels[s]}</button>`).join('')}</div></section>
<section class="drawer-section"><h3>Colour schemes</h3><p>Pick a palette for every page.</p><div class="palette-grid">${Object.entries(palettes).map(([k,v])=>`<button class="palette-choice" data-palette-choice="${k}" aria-pressed="false"><span>${({paper:'Paper & olive',terracotta:'Terracotta',sage:'Sage garden',ocean:'Ink blue',plum:'Plum & oat',mono:'Black & chalk',apricot:'Apricot'})[k]}</span><span class="palette-dots">${v.slice(0,3).map(c=>`<i style="--dot:${c}"></i>`).join('')}</span></button>`).join('')}</div></section>
<section class="drawer-section"><h3>Frequently asked questions</h3>
<details class="faq-item"><summary>Is appointment booking free?</summary><p>Yes. Sending an appointment request is free. Any service charges are discussed separately before work begins.</p></details>
<details class="faq-item"><summary>How do I book?</summary><p>Open Book Appointment, enter your details and continue to WhatsApp. Your appointment is confirmed only after the shop replies.</p></details>
<details class="faq-item"><summary>Where is the shop?</summary><p>Shop No. 02, Ayesha Height, opposite Gausiya Masjid, Sanjay Nagar, Mumbra.</p></details>
<details class="faq-item"><summary>What should I bring?</summary><p>Bring only documents relevant to your enquiry. Never share passwords or OTPs.</p></details>
<details class="faq-item"><summary>Can I ask about a service not listed?</summary><p>Yes. Choose “Not sure / something else” on the booking form and explain what you need.</p></details></section>
<section class="drawer-section"><h3>Quick access</h3><div class="drawer-links"><a href="services.html">▤ All services</a><a href="booking.html">↗ Book appointment</a><a href="contact.html">✆ Contact</a><a href="tel:+918652124770">☎ Call the shop</a></div><button class="drawer-reset" id="resetAppearance">Reset appearance</button></section>`;
const backdrop=document.createElement('div');
backdrop.id='customizer-backdrop';
backdrop.setAttribute('aria-hidden','true');
document.body.append(backdrop,drawer);
const trigger=$('.theme-trigger'),close=$('.drawer-close');
function openDrawer(){
  drawer.classList.add('open');backdrop.classList.add('open');
  drawer.setAttribute('aria-hidden','false');trigger?.setAttribute('aria-expanded','true');
  document.body.classList.add('drawer-open');close.focus();
}
function closeDrawer(){
  drawer.classList.remove('open');backdrop.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');trigger?.setAttribute('aria-expanded','false');
  document.body.classList.remove('drawer-open');trigger?.focus();
}
trigger?.addEventListener('click',openDrawer);
close.addEventListener('click',closeDrawer);
backdrop.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&drawer.classList.contains('open'))closeDrawer()});
drawer.addEventListener('click',e=>{
  const s=e.target.closest('[data-style-choice]'),p=e.target.closest('[data-palette-choice]');
  if(s)applyStyle(s.dataset.styleChoice);
  if(p)applyPalette(p.dataset.paletteChoice);
});
$('#resetAppearance',drawer).addEventListener('click',()=>{applyStyle('bento');applyPalette('paper')});
applyStyle(storage.get('ads-style')||'bento');
applyPalette(storage.get('ads-palette')||'paper');

/* Floating labels: keep labels visible, correctly associated and stable. */
$$('.form label').forEach(label=>{
  const field=$('input,textarea,select',label);
  if(!field)return;
  const textNode=[...label.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
  if(textNode){
    const span=document.createElement('span');
    span.className='field-label';
    span.textContent=textNode.textContent.trim();
    span.id='field-label-'+(field.name||'input');
    textNode.replaceWith(span);
    field.setAttribute('aria-labelledby',span.id);
  }
  const sync=()=>label.classList.toggle('is-active',!!field.value||document.activeElement===field);
  ['focus','blur','input','change'].forEach(ev=>field.addEventListener(ev,sync));
  sync();
});

/* Service search and category filters. No icon animation while typing. */
const search=$('#serviceSearch'),cards=$$('.card[data-cat]'),filters=$$('.filter[data-filter]');
let active='all';
function filterServices(){
  const q=(search?.value||'').trim().toLowerCase();
  let count=0;
  cards.forEach(c=>{
    const show=(active==='all'||c.dataset.cat===active)&&(!q||c.textContent.toLowerCase().includes(q));
    c.hidden=!show;
    if(show)count++;
  });
  const empty=$('.empty');
  if(empty)empty.hidden=count!==0;
}
search?.addEventListener('input',filterServices);
filters.forEach(b=>{
  b.setAttribute('aria-pressed',String(b.classList.contains('active')));
  b.addEventListener('click',()=>{
    active=b.dataset.filter||'all';
    filters.forEach(x=>{
      x.classList.toggle('active',x===b);
      x.setAttribute('aria-pressed',String(x===b));
    });
    filterServices();
  });
});

/* Reveal content safely; reduced-motion users see everything immediately. */
const reveals=$$('.reveal');
if('IntersectionObserver'in window&&!reduce){
  const ob=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');ob.unobserve(e.target)}
  }),{threshold:.06});
  reveals.forEach(el=>ob.observe(el));
}else reveals.forEach(el=>el.classList.add('in'));

/* Appointment form. It opens WhatsApp only after browser validation. */
const form=$('#bookingForm');
if(form){
  const status=$('.form-status',form);
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const phone=$('[name="phone"]',form),digits=(phone.value.match(/\d/g)||[]).length;
    if(!form.reportValidity())return;
    if(digits<10||digits>15){
      phone.setAttribute('aria-invalid','true');
      status.className='form-status show error';
      status.textContent='Please enter a valid phone number with 10–15 digits.';
      phone.focus();return;
    }
    phone.removeAttribute('aria-invalid');
    const d=new FormData(form);
    const msg=['Hello Anas Documents Solution!',`Name: ${d.get('name')}`,`Phone: ${d.get('phone')}`,`Service: ${d.get('service')}`,`Details: ${d.get('details')||'Not specified'}`,'I would like to book a free appointment.'].join('\n');
    status.className='form-status show success';
    status.textContent='Opening WhatsApp with your appointment request…';
    window.location.href='https://wa.me/918652124770?text='+encodeURIComponent(msg);
  });
}

/* Gentle end-of-page feedback; no whole-page transform that shifts fixed UI. */
let endLock=false;
const indicator=document.createElement('div');
indicator.id='end-indicator';
indicator.textContent='You’ve reached the end';
document.body.append(indicator);
let endTimer;
window.addEventListener('scroll',()=>{
  const atEnd=window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-3;
  if(atEnd&&!endLock){
    endLock=true;indicator.classList.add('show');
    clearTimeout(endTimer);
    endTimer=setTimeout(()=>{indicator.classList.remove('show');endLock=false},1100);
  }
},{passive:true});

$$('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));
const current=location.pathname.split('/').pop()||'index.html';
$$('#site-nav a').forEach(a=>{
  if(a.getAttribute('href')===current){a.classList.add('current');a.setAttribute('aria-current','page')}
});
})();