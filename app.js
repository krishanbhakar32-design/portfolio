(function(){
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>/^(https?:|mailto:|tel:|#|\/|\.)/i.test(u||'')?u:'';
const has=a=>Array.isArray(a)&&a.length>0;
const timeline=items=>'<ul class="timeline reveal">'+items.map(i=>'<li class="'+esc(i.state||'')+'"><h3>'+esc(i.title)+'</h3><p>'+esc(i.text)+'</p></li>').join('')+'</ul>';
const setMeta=(sel,attr,val)=>{const el=$(sel);if(el)el.setAttribute(attr,val)};

function applyTheme(t){
document.documentElement.setAttribute('data-theme',t);
$('#theme').textContent=t==='dark'?'☀':'☾';
$('#theme').setAttribute('aria-label',t==='dark'?'Switch to light theme':'Switch to dark theme');
}

function streakHtml(st){
if(!st||!st.startDate)return '';
const n=Math.max(0,Math.floor((Date.now()-new Date(st.startDate).getTime())/864e5)+1);
return '<p class="streak reveal"><b>'+n+'</b> '+esc(st.label||'day streak')+'</p>';
}

function mocksHtml(m){
if(!m||!has(m.items)||m.items.length<2)return '';
const W=600,H=240,pd=40,n=m.items.length;
const mx=Math.max(...m.items.map(i=>Number(i.max)||Number(i.score)));
const pts=m.items.map((i,k)=>[pd+k*(W-2*pd)/(n-1),H-pd-(Number(i.score)/mx)*(H-2*pd)]);
const path=pts.map((q,k)=>(k?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');
return '<div class="mocks reveal"><h3>'+esc(m.heading)+'</h3><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(m.heading)+'"><line x1="'+pd+'" y1="'+(H-pd)+'" x2="'+(W-pd)+'" y2="'+(H-pd)+'"/><path class="line" pathLength="1" d="'+path+'"/>'+pts.map((q,k)=>'<circle cx="'+q[0].toFixed(1)+'" cy="'+q[1].toFixed(1)+'" r="5"/><text x="'+q[0].toFixed(1)+'" y="'+(q[1]-12).toFixed(1)+'" text-anchor="middle" class="v">'+esc(m.items[k].score)+'</text><text x="'+q[0].toFixed(1)+'" y="'+(H-14)+'" text-anchor="middle">'+esc(m.items[k].label)+'</text>').join('')+'</svg></div>';
}

function thumb(x){
if(x.image)return '<img class="thumb" loading="lazy" src="'+esc(safeUrl(x.image))+'" alt="'+esc(x.name)+' preview">';
let h=0;for(const c of x.name)h=(h*31+c.charCodeAt(0))%360;
const ini=x.name.split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();
return '<div class="thumb ph" style="--h:'+h+'"><span>'+esc(ini)+'</span></div>';
}

function build(d){
const s=d.site;
let ci=0;
const ch=t=>[...t].map(c=>'<span class="ch" style="--i:'+(ci++)+'">'+(c===' '?'&nbsp;':esc(c))+'</span>').join('');
document.title=s.title||s.name;
setMeta('meta[name="description"]','content',s.description||'');
setMeta('meta[name="theme-color"]','content',s.themeColor||'#0a1020');
const head=document.head;
[['og:image',s.image],['og:title',s.title],['og:description',s.description],['og:type','website'],['og:url',s.url]].forEach(([p,v])=>{if(v){const m=document.createElement('meta');m.setAttribute('property',p);m.content=v;head.appendChild(m)}});
if(s.url){const c=document.createElement('link');c.rel='canonical';c.href=s.url;head.appendChild(c)}
const ld=document.createElement('script');ld.type='application/ld+json';
ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Person',name:s.owner||s.name,url:s.url||undefined,email:d.contact.email,description:s.description});
head.appendChild(ld);
$('#brand').textContent=s.name;

const nav=[];
const parts=[];
const h=d.hero;
parts.push('<section class="hero" id="home"><div><p class="hello">'+esc(h.greeting)+'</p><h1 aria-label="'+esc(s.name)+'">'+s.name.split(' To ').map((w,i)=>'<span>'+ch((i?'To ':'')+w)+'</span>').join('')+'</h1><p class="typing" id="typing" aria-live="off"></p><p class="intro">'+esc(h.intro)+'</p><div class="btns"><a class="btn solid" href="'+esc(safeUrl(h.primaryCta.target))+'">'+esc(h.primaryCta.label)+'</a><a class="btn" href="'+esc(safeUrl(h.secondaryCta.target))+'">'+esc(h.secondaryCta.label)+'</a>'+(d.resume&&d.resume.file?'<a class="btn" href="'+esc(safeUrl(d.resume.file))+'" download>'+esc(d.resume.label||'Resume')+'</a>':'')+'</div></div><aside class="count" aria-label="Exam countdown"><h3>Days until '+esc(d.ssc.exam.name)+'</h3><div class="digits" id="digits"><div><b data-u="d">0</b><small>days</small></div><div><b data-u="h">0</b><small>hours</small></div><div><b data-u="m">0</b><small>minutes</small></div><div><b data-u="s">0</b><small>seconds</small></div></div><p id="examline"></p></aside></section>');
const mq=(d.skills.groups||[]).flatMap(g=>g.items).map(i=>'<span>'+esc(i)+'</span>').join('');
if(mq)parts.push('<div class="marquee" aria-hidden="true"><div>'+mq+mq+'</div></div>');

const a=d.about;
nav.push(['about',a.heading?'About':'About']);
parts.push('<section id="about"><h2 class="reveal">'+esc(a.heading)+'</h2><div class="about reveal'+(a.photo?'':' nophoto')+'"><div>'+a.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+(has(a.facts)?'<div class="facts">'+a.facts.map(f=>'<div><b data-n="'+esc(f.value)+'">'+esc(f.value)+'</b><span>'+esc(f.label)+'</span></div>').join('')+'</div>':'')+'</div>'+(a.photo?'<img class="photo" src="'+esc(safeUrl(a.photo))+'" alt="'+esc(s.owner||s.name)+'">':'')+'</div></section>');

const ss=d.ssc;
nav.push(['ssc','SSC']);
parts.push('<section id="ssc"><h2 class="reveal">'+esc(ss.heading)+'</h2><p class="lead reveal">'+esc(ss.summary)+'</p><div class="progress reveal"><div class="row"><span>'+esc(ss.syllabus.label)+'</span><span id="pct">0%</span></div><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+esc(ss.syllabus.percent)+'"><i id="fill" data-w="'+esc(ss.syllabus.percent)+'"></i></div></div>'+streakHtml(ss.streak)+mocksHtml(ss.mocks)+timeline(ss.timeline)+'</section>');

const c=d.coding;
nav.push(['coding','Coding']);
parts.push('<section id="coding"><h2 class="reveal">'+esc(c.heading)+'</h2><p class="lead reveal">'+esc(c.intro)+'</p>'+timeline(c.timeline.map(i=>Object.assign({state:'done'},i)))+'</section>');

const p=d.projects;
if(has(p.items)){
nav.push(['projects','Projects']);
parts.push('<section id="projects"><h2 class="reveal">'+esc(p.heading)+'</h2><p class="lead reveal">'+esc(p.intro)+'</p><div class="projects">'+p.items.map(x=>'<article class="card reveal">'+thumb(x)+'<h3>'+esc(x.name)+'</h3><p>'+esc(x.description)+'</p><div class="tags">'+(x.tech||[]).map(t=>'<span>'+esc(t)+'</span>').join('')+'</div><div class="links">'+(x.live?'<a href="'+esc(safeUrl(x.live))+'" target="_blank" rel="noopener">Live site</a>':'')+(x.github?'<a href="'+esc(safeUrl(x.github))+'" target="_blank" rel="noopener">Source code</a>':'')+'</div></article>').join('')+'</div></section>');
}

const k=d.skills;
if(has(k.groups)){
nav.push(['skills','Skills']);
parts.push('<section id="skills"><h2 class="reveal">'+esc(k.heading)+'</h2><div class="skills">'+k.groups.map(g=>'<div class="reveal"><h3>'+esc(g.name)+'</h3><ul>'+g.items.map(i=>'<li>'+esc(i)+'</li>').join('')+'</ul></div>').join('')+'</div></section>');
}

if(d.gallery&&has(d.gallery.items)){
nav.push(['gallery','Gallery']);
parts.push('<section id="gallery"><h2 class="reveal">'+esc(d.gallery.heading)+'</h2><div class="gallery">'+d.gallery.items.map(i=>'<figure class="reveal"><img loading="lazy" src="'+esc(safeUrl(i.src))+'" alt="'+esc(i.caption||'')+'">'+(i.caption?'<figcaption>'+esc(i.caption)+'</figcaption>':'')+'</figure>').join('')+'</div></section>');
}

if(d.quotes&&has(d.quotes.items)){
parts.push('<section id="quotes" class="quotes"><h2 class="reveal">'+esc(d.quotes.heading)+'</h2>'+d.quotes.items.map(q=>'<blockquote class="reveal">'+esc(q.text)+(q.author?'<cite>'+esc(q.author)+'</cite>':'')+'</blockquote>').join('')+'</section>');
}

if(d.blog&&has(d.blog.items)){
nav.push(['blog','Updates']);
parts.push('<section id="blog"><h2 class="reveal">'+esc(d.blog.heading)+'</h2>'+timeline(d.blog.items.map(i=>({title:i.title,text:(i.date?i.date+'. ':'')+(i.text||''),state:'done'})))+'</section>');
}

const ct=d.contact;
nav.push(['contact','Contact']);
parts.push('<section id="contact" class="contact"><h2 class="reveal">'+esc(ct.heading)+'</h2><p class="lead reveal">'+esc(ct.text)+'</p><a class="mail reveal" href="mailto:'+esc(ct.email)+'?subject='+encodeURIComponent(ct.subject||'')+'">'+esc(ct.email)+'</a><div class="btns reveal" style="justify-content:center"><a class="btn solid" href="mailto:'+esc(ct.email)+'?subject='+encodeURIComponent(ct.subject||'')+'">Send an email</a><button class="btn" id="copy">Copy email</button></div>'+(has(ct.socials)?'<div class="socials">'+ct.socials.map(x=>'<a href="'+esc(safeUrl(x.url))+'" target="_blank" rel="noopener">'+esc(x.label)+'</a>').join('')+'</div>':'')+'</section>');

$('#top').innerHTML=parts.join('');
$('#links').innerHTML=nav.map(n=>'<a href="#'+n[0]+'">'+esc(n[1])+'</a>').join('');
$('#footer').innerHTML='<p>'+esc(d.footer.text)+'</p><p>&copy; '+new Date().getFullYear()+' '+esc(s.owner||s.name)+'</p>';
}

function typing(lines){
const el=$('#typing');
if(!el||!has(lines))return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=lines[0];return}
let li=0,ci=0,del=false;
(function tick(){
const w=lines[li];
el.textContent=w.slice(0,ci);
let t=del?35:75;
if(!del&&ci===w.length){del=true;t=1600}
else if(del&&ci===0){del=false;li=(li+1)%lines.length;t=350}
else ci+=del?-1:1;
setTimeout(tick,t);
})();
}

function countdown(ex){
const target=new Date(ex.date).getTime();
const nodes={d:$('[data-u="d"]'),h:$('[data-u="h"]'),m:$('[data-u="m"]'),s:$('[data-u="s"]')};
const fmt=new Date(target).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
function tick(){
const diff=Math.max(0,target-Date.now());
nodes.d.textContent=Math.floor(diff/864e5);
nodes.h.textContent=String(Math.floor(diff%864e5/36e5)).padStart(2,'0');
nodes.m.textContent=String(Math.floor(diff%36e5/6e4)).padStart(2,'0');
nodes.s.textContent=String(Math.floor(diff%6e4/1e3)).padStart(2,'0');
$('#examline').textContent=diff?ex.name+' on '+fmt:ex.name+' day has arrived. Best of luck.';
}
tick();setInterval(tick,1000);
}

function progress(){
const fill=$('#fill'),pct=$('#pct');
if(!fill)return;
const to=Number(fill.dataset.w)||0;
const run=()=>{
fill.style.width=to+'%';
const t0=performance.now();
(function step(n){const r=Math.min(1,(n-t0)/1600);pct.textContent=Math.round(to*r)+'%';if(r<1)requestAnimationFrame(step)})(t0);
};
new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){run();o.disconnect()}},{threshold:.4}).observe(fill.parentElement);
}

function reveal(){
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}

function spy(){
const links=[...document.querySelectorAll('#links a')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main section').forEach(s=>io.observe(s));
}

function scrollbar(){
const b=$('#scrollbar');
const f=()=>{const m=document.documentElement.scrollHeight-innerHeight;b.style.transform='scaleX('+(m>0?Math.min(1,scrollY/m):0)+')'};
addEventListener('scroll',f,{passive:true});addEventListener('resize',f);f();
}

function counts(){
const box=$('.facts');
if(!box)return;
new IntersectionObserver((e,o)=>{
if(!e[0].isIntersecting)return;
o.disconnect();
box.querySelectorAll('b').forEach(b=>{
const m=/^(\d+)(.*)$/.exec(b.dataset.n||'');
if(!m)return;
const to=Number(m[1]),t0=performance.now();
(function step(n){const r=Math.min(1,(n-t0)/1400),v=Math.round(to*(1-Math.pow(1-r,3)));b.textContent=v+m[2];if(r<1)requestAnimationFrame(step)})(t0);
});
},{threshold:.6}).observe(box);
}

function glow(){
document.querySelectorAll('.card').forEach(c=>c.addEventListener('pointermove',e=>{
const r=c.getBoundingClientRect();
c.style.setProperty('--mx',(e.clientX-r.left)+'px');
c.style.setProperty('--my',(e.clientY-r.top)+'px');
}));
}

function wire(d){
const links=$('#links'),burger=$('#burger');
burger.addEventListener('click',()=>{const o=links.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
links.addEventListener('click',e=>{if(e.target.closest('a')){links.classList.remove('open');burger.setAttribute('aria-expanded','false')}});
$('#theme').addEventListener('click',()=>{
const t=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
applyTheme(t);
try{localStorage.setItem('theme',t)}catch(e){}
});
const copy=$('#copy');
if(copy)copy.addEventListener('click',async()=>{
try{await navigator.clipboard.writeText(d.contact.email);copy.textContent='Copied'}catch(e){copy.textContent='Copy failed'}
setTimeout(()=>copy.textContent='Copy email',1800);
});
}

async function init(){
let d;
try{
const r=await fetch('data/content.json',{cache:'no-cache'});
if(!r.ok)throw new Error(r.status);
d=await r.json();
}catch(e){
$('#top').innerHTML='<section><h2>Content could not load</h2><p class="lead">Check that data/content.json exists and is valid JSON, and open the site through a web server.</p></section>';
$('#loader').classList.add('done');
return;
}
let saved=null;
try{saved=localStorage.getItem('theme')}catch(e){}
applyTheme(saved||d.site.themeDefault||'dark');
build(d);
wire(d);
typing(d.hero.taglines);
countdown(d.ssc.exam);
progress();
reveal();
spy();
scrollbar();
counts();
glow();
setTimeout(()=>$('#loader').classList.add('done'),350);
}
init();
})();
