const TAOCE_EMAIL = 'contact@taoce.cn';
const TAOCE_WECHAT = 'Taoce-Founder';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('particle-canvas');
const ctx = canvas && !prefersReducedMotion ? canvas.getContext('2d') : null;
let width, height, particles = [], mouse = { x: 0, y: 0, active: false };
function resize(){ width = canvas.width = innerWidth * devicePixelRatio; height = canvas.height = innerHeight * devicePixelRatio; canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; createParticles(); }
function createParticles(){ const count = Math.min(130, Math.floor(innerWidth / 10)); particles = Array.from({length: count}, () => ({ x: Math.random()*width, y: Math.random()*height, z: Math.random()*1+.2, vx:(Math.random()-.5)*.22*devicePixelRatio, vy:(Math.random()-.5)*.22*devicePixelRatio })); }
function draw(){ ctx.clearRect(0,0,width,height); for (const p of particles){ p.x += p.vx*p.z; p.y += p.vy*p.z; if(p.x<0||p.x>width)p.vx*=-1; if(p.y<0||p.y>height)p.vy*=-1; const px=p.x, py=p.y, r=(1.1+p.z*1.8)*devicePixelRatio; ctx.beginPath(); ctx.arc(px,py,r,0,Math.PI*2); ctx.fillStyle=`rgba(120,190,255,${.18+p.z*.15})`; ctx.fill(); }
  for(let i=0;i<particles.length;i++){ for(let j=i+1;j<particles.length;j++){ const a=particles[i], b=particles[j]; const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy); const limit=145*devicePixelRatio; if(dist<limit){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=`rgba(110,180,255,${(1-dist/limit)*.12})`; ctx.lineWidth=devicePixelRatio*.6; ctx.stroke(); } } }
  requestAnimationFrame(draw); }
if (ctx) { resize(); draw(); addEventListener('resize', resize); }

const light = document.querySelector('.cursor-light');
addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; if(light){ light.style.opacity=.95; light.style.left=e.clientX+'px'; light.style.top=e.clientY+'px'; } document.documentElement.style.setProperty('--mx', e.clientX+'px'); document.documentElement.style.setProperty('--my', e.clientY+'px'); });
addEventListener('mouseleave',()=> { if(light) light.style.opacity=0; });

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
toggle?.addEventListener('click',()=>{ const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', open ? 'true':'false'); });
document.querySelectorAll('.site-nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const io = new IntersectionObserver((entries)=>{ entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); }); },{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.copy-line').forEach(btn=>btn.addEventListener('click',async()=>{
  const text=btn.dataset.copy;
  const originalHTML = btn.innerHTML;
  const setCopied = () => {
    const note = btn.querySelector('em');
    if (note) note.textContent = '已复制：' + text;
    else btn.textContent = '已复制：' + text;
    setTimeout(()=>{ btn.innerHTML = originalHTML; },1600);
  };
  try{ await navigator.clipboard.writeText(text); setCopied(); }
  catch{ location.href = text.includes('@') ? 'mailto:' + text : '#contact'; }
}));

document.getElementById('contactForm')?.addEventListener('submit',e=>{ e.preventDefault(); const data = new FormData(e.currentTarget); const subject = encodeURIComponent('桃策AI需求咨询'); const body = encodeURIComponent(`称呼：${data.get('name')}\n联系方式：${data.get('contact')}\n\nAI需求：\n${data.get('message')}`); location.href = `mailto:${TAOCE_EMAIL}?subject=${subject}&body=${body}`; });
