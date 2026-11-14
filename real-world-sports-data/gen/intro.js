
/* ===== Galton board intro ===== */
(()=>{
const cv=document.getElementById('galton');if(!cv)return;
const ctx=cv.getContext('2d');const intro=cv.closest('.intro');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const R=12,NB=R+1,CAP=1600;
const css=n=>getComputedStyle(intro).getPropertyValue(n).trim();
const COL={ball:css('--ball')||'#5CC9CE',curve:css('--curve')||'#F0A24A',peg:css('--peg')||'rgba(232,241,238,.38)'};
const choose=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-k+i)/i;return r;};
const PMF=Array.from({length:NB},(_,k)=>choose(R,k)/Math.pow(2,R));
const PEAK=Math.max(...PMF);
const SD=Math.sqrt(R/4),MU=R/2;
let W=0,H=0,dpr=1,G=null;
let counts=new Array(NB).fill(0),N=0,balls=[],hits=new Map(),fade=1,resetting=false;
let running=false,visible=true,last=0,spawnAcc=0,statAcc=0;
function layout(){
  const r=cv.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  let x0,x1,y0,y1;
  if(W>900){x0=W*0.53;x1=W-Math.max(28,W*0.04);y0=Math.max(128,H*0.17);y1=H-Math.max(56,H*0.08);}
  else{const bh=Math.min(H*0.48,440);const tx=document.querySelector('.intro-text');const tb=tx?tx.getBoundingClientRect().bottom-r.top:0;x0=14;x1=W-14;y0=Math.max(H-bh,tb+36);y1=H-22;}
  const bw=x1-x0,bh=y1-y0;
  const pegH=bh*0.56,binH=bh*0.40;
  const dx=Math.min(bw/(NB+1),pegH/(R-1)*1.25),dy=Math.min(pegH/(R-1),dx*0.92);
  const cx=(x0+x1)/2,top=y0+(pegH-dy*(R-1))*0.5+8;
  const binTop=top+dy*(R-1)+dy*0.9,bottom=Math.min(y1,binTop+binH);
  G={cx,top,dx,dy,binTop,bottom,binH:bottom-binTop,br:Math.max(2.2,dx*0.2),pr:Math.max(1.6,dx*0.075)};
}
const pegX=(r,j)=>G.cx+(j-r/2)*G.dx,pegY=r=>G.top+r*G.dy;
const binX=k=>G.cx+(k-R/2)*G.dx;
function scale(){const mx=Math.max(...counts);return G.binH*0.86/Math.max(N*PEAK,mx,10);}
function spawn(){if(balls.length>140)return;balls.push({r:0,k:0,t:0,dir:0,ph:'in',x:G.cx,y:G.top-G.dy*1.6,vy:0,sp:0.9+Math.random()*0.35});}
function step(dt){
  const s=dt/1000;
  for(const b of balls){
    if(b.ph==='in'){b.y+=G.dy*7*s*b.sp;if(b.y>=pegY(0)-G.br*1.6){b.ph='peg';b.y=pegY(0)-G.br*1.6;b.dir=Math.random()<0.5?0:1;hits.set('0,0',performance.now());}continue;}
    if(b.ph==='peg'){b.t+=s*8.5*b.sp;const t=Math.min(1,b.t);const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
      const xa=pegX(b.r,b.k),xb=pegX(b.r+1,b.k+b.dir);const ya=pegY(b.r)-G.br*1.6,yb=pegY(b.r+1)-G.br*1.6;
      b.x=xa+(xb-xa)*e;b.y=ya+(yb-ya)*t-Math.sin(Math.PI*t)*G.dy*0.38;
      if(b.t>=1){b.t=0;b.r++;b.k+=b.dir;
        if(b.r>=R-1){b.ph='fall';b.x=binX(b.k);b.vy=G.dy*3;}else{b.dir=Math.random()<0.5?0:1;hits.set(b.r+','+b.k,performance.now());}}
      continue;}
    if(b.ph==='fall'){b.vy+=G.dy*60*s;b.y+=b.vy*s;const ty=G.bottom-counts[b.k]*scale()-G.br*0.6;
      if(b.y>=ty||b.y>H+40){b.ph='done';counts[b.k]++;N++;}}
  }
  balls=balls.filter(b=>b.ph!=='done');
  if(N>=CAP&&!resetting){resetting=true;}
  if(resetting){fade-=s*0.9;if(fade<=0){counts.fill(0);N=0;fade=1;resetting=false;}}
}
function draw(){
  ctx.clearRect(0,0,W,H);const now=performance.now();
  // pegs
  for(let r=0;r<R-1;r++)for(let j=0;j<=r;j++){const h=hits.get(r+','+j);const a=h?Math.max(0,1-(now-h)/260):0;
    ctx.beginPath();ctx.arc(pegX(r,j),pegY(r),G.pr+a*G.pr*0.9,0,7);ctx.fillStyle=a>0?`rgba(240,162,74,${0.25+a*0.6})`:COL.peg;ctx.fill();}
  // funnel
  ctx.strokeStyle=COL.peg;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(G.cx-G.dx*1.3,G.top-G.dy*2.4);ctx.lineTo(G.cx-G.dx*0.42,G.top-G.dy*0.9);ctx.moveTo(G.cx+G.dx*1.3,G.top-G.dy*2.4);ctx.lineTo(G.cx+G.dx*0.42,G.top-G.dy*0.9);ctx.stroke();
  // bins
  const sc=scale();ctx.globalAlpha=fade;
  ctx.strokeStyle='rgba(232,241,238,.14)';ctx.lineWidth=1;ctx.beginPath();
  for(let k=0;k<=NB;k++){const x=binX(k)-G.dx/2;ctx.moveTo(x,G.binTop);ctx.lineTo(x,G.bottom);}ctx.stroke();
  ctx.strokeStyle='rgba(232,241,238,.3)';ctx.beginPath();ctx.moveTo(binX(0)-G.dx/2,G.bottom);ctx.lineTo(binX(R)+G.dx/2,G.bottom);ctx.stroke();
  const bw=G.dx*0.78;
  for(let k=0;k<NB;k++){const h=counts[k]*sc;if(h<=0)continue;const x=binX(k)-bw/2,y=G.bottom-h;
    const gr=ctx.createLinearGradient(0,y,0,G.bottom);gr.addColorStop(0,'rgba(92,201,206,.85)');gr.addColorStop(1,'rgba(92,201,206,.25)');
    ctx.fillStyle=gr;ctx.fillRect(x,y,bw,h);}
  // normal curve (expected counts)
  if(N>0){ctx.strokeStyle=COL.curve;ctx.lineWidth=2.2;ctx.beginPath();
    for(let i=0;i<=160;i++){const v=-0.6+(R+1.2)*i/160;const e=N*Math.exp(-0.5*((v-MU)/SD)**2)/(SD*Math.sqrt(2*Math.PI));const px=G.cx+(v-R/2)*G.dx,py=G.bottom-Math.min(e*sc,G.binH*1.05);i?ctx.lineTo(px,py):ctx.moveTo(px,py);}
    ctx.stroke();}
  ctx.globalAlpha=1;
  // balls
  for(const b of balls){ctx.beginPath();ctx.arc(b.x,b.y,G.br,0,7);ctx.fillStyle='rgba(92,201,206,.18)';ctx.fill();
    ctx.beginPath();ctx.arc(b.x,b.y,G.br*0.62,0,7);ctx.fillStyle=COL.ball;ctx.fill();}
  // axis labels
  ctx.fillStyle='rgba(232,241,238,.45)';ctx.font=`${Math.max(9,Math.min(12,G.dx*0.42))}px "IBM Plex Mono",ui-monospace,monospace`;ctx.textAlign='center';
  for(let k=0;k<NB;k+=(G.dx<20?2:1))ctx.fillText(k,binX(k),G.bottom+14);
}
const elN=document.getElementById('gN'),elM=document.getElementById('gM'),elS=document.getElementById('gS');
function stats(){if(!elN)return;elN.textContent=N.toLocaleString();if(N<2){elM.textContent='—';elS.textContent='—';return;}
  let m=0;counts.forEach((c,k)=>m+=c*k);m/=N;let v=0;counts.forEach((c,k)=>v+=c*(k-m)**2);v/=(N-1);elM.textContent=m.toFixed(3);elS.textContent=Math.sqrt(v).toFixed(3);}
function loop(ts){if(!running)return;const dt=Math.min(50,ts-(last||ts));last=ts;
  spawnAcc+=dt;const every=resetting?1e9:60;while(spawnAcc>every){spawn();spawnAcc-=every;}if(spawnAcc>every)spawnAcc=0;
  step(dt);draw();statAcc+=dt;if(statAcc>180){stats();statAcc=0;}requestAnimationFrame(loop);}
function start(){if(running||RM)return;running=true;last=0;requestAnimationFrame(loop);}
function stop(){running=false;}
layout();
if(RM){const n=800;for(let k=0;k<NB;k++)counts[k]=Math.round(n*PMF[k]);N=counts.reduce((a,b)=>a+b,0);draw();stats();}
else{start();}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{layout();balls=[];draw();},120);});
new IntersectionObserver(es=>{visible=es[0].isIntersecting;visible&&!document.hidden?start():stop();},{threshold:0.02}).observe(intro);
document.addEventListener('visibilitychange',()=>{document.hidden?stop():visible&&start();});
cv.addEventListener('click',()=>{if(RM||resetting)return;for(let i=0;i<50;i++)setTimeout(spawn,i*14);});
// chapter rows reveal
const rows=[...document.querySelectorAll('.chrow')];
if(!RM&&'IntersectionObserver' in window){rows.forEach(r=>r.classList.add('pre'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=rows.indexOf(e.target);e.target.style.transitionDelay=(i%2)*80+'ms';e.target.classList.add('in');e.target.classList.remove('pre');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
  rows.forEach(r=>io.observe(r));}
})();
