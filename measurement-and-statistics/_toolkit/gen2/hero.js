/* ===== 首頁動畫：跑者衝線 → 碼錶量到秒數 → 堆成分配 → 標準線評價 ===== */
(()=>{
const cv=document.getElementById('hero');if(!cv)return;
const ctx=cv.getContext('2d');const intro=cv.closest('.intro');
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const C={ink:'rgba(226,232,247,.92)',dim:'rgba(226,232,247,.38)',faint:'rgba(226,232,247,.16)',must:'#EDB23F',pink:'#F08BB3',blue:'#9DB8EC'};
const MU=13.6,SD=1.15,LO=10,HI=17.5,BW=0.25,NB=Math.round((HI-LO)/BW),STD=12.5,LANES=5,CAP=320;
let W=0,H=0,dpr=1,G=null;
let times=[],counts=new Array(NB).fill(0),runners=[],drops=[],pops=[],fade=1,resetting=false,seq=0;
let running=false,visible=true,last=0,spawnAcc=0,statAcc=0;
function rnorm(){let u=0;while(u===0)u=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*Math.random());}
function newTime(){let t;do{t=MU+SD*rnorm();}while(t<LO+0.3||t>HI-0.3);return Math.round(t*100)/100;}
function layout(){
  const r=cv.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  let x0,x1,y0,y1;
  if(W>900){x0=W*0.53;x1=W-Math.max(28,W*0.04);y0=Math.max(120,H*0.16);y1=H-Math.max(64,H*0.09);}
  else{const bh=Math.min(H*0.48,440);const tx=document.querySelector('.intro-text');const tb=tx?tx.getBoundingClientRect().bottom-r.top:0;x0=14;x1=W-14;y0=Math.max(H-bh,tb+30);y1=H-26;}
  const bh=y1-y0;const trackH=bh*0.36;const laneH=trackH/LANES;
  const histTop=y0+trackH+bh*0.10,base=y1-16;
  G={x0,x1,y0,trackH,laneH,histTop,base,histH:base-histTop,binW:(x1-x0)/NB,startX:x0+10,finX:x1-Math.max(26,(x1-x0)*0.07),s:Math.max(0.55,Math.min(1,laneH/30))};
}
const tx=t=>G.x0+(t-LO)/(HI-LO)*(G.x1-G.x0);
const laneY=l=>G.y0+G.laneH*(l+0.5);
function dotR(){return Math.max(1.8,Math.min(G.binW*0.40,5));}
function stackStep(){const r=dotR();const mx=Math.max(1,...counts);return Math.min(r*2.15,G.histH*0.92/mx);}
function spawn(delay){runners.push({lane:(seq++)%LANES,t:newTime(),p:-(delay||0),ph:Math.random()*6});}
function finish(rn){
  const b=Math.min(NB-1,Math.max(0,Math.floor((rn.t-LO)/BW)));
  pops.push({x:G.finX-10,y:laneY(rn.lane)+4,txt:rn.t.toFixed(2),a:1});
  drops.push({x0:G.finX,y0:laneY(rn.lane),b,t:rn.t,p:0,slot:counts[b]+drops.filter(d=>d.b===b).length});
}
function step(dt){
  const s=dt/1000;
  for(const rn of runners){const dur=rn.t*0.20;rn.p+=s/dur;rn.ph+=s*(15-rn.t*0.35);if(rn.p>=1&&!rn.done){rn.done=true;finish(rn);}}
  runners=runners.filter(rn=>rn.p<1.12);
  for(const d of drops){d.p+=s/0.75;if(d.p>=1){counts[d.b]++;times.push(d.t);d.dead=true;}}
  drops=drops.filter(d=>!d.dead);
  for(const p of pops){p.a-=s/1.3;p.x-=s*16;}pops=pops.filter(p=>p.a>0);
  if(times.length>=CAP&&!resetting&&!runners.length&&!drops.length)resetting=true;
  if(resetting){fade-=s*0.8;if(fade<=0){times=[];counts.fill(0);fade=1;resetting=false;}}
}
function stats(){const n=times.length;if(n<2)return{n,m:NaN,sd:NaN,pass:NaN};const m=times.reduce((a,b)=>a+b,0)/n;const v=times.reduce((a,b)=>a+(b-m)**2,0)/(n-1);return{n,m,sd:Math.sqrt(v),pass:times.filter(t=>t<=STD).length/n};}
function runner(x,y,ph,k){
  const s=G.s*k;ctx.save();ctx.translate(x,y);ctx.lineWidth=1.7;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=C.ink;
  const sw=Math.sin(ph),sw2=Math.sin(ph+Math.PI);
  ctx.beginPath();ctx.moveTo(-2*s,-2*s);ctx.lineTo(2*s,-11*s);ctx.stroke();                         // 軀幹（前傾）
  ctx.beginPath();ctx.moveTo(-2*s,-2*s);ctx.lineTo((-2+7*sw)*s,5*s);ctx.lineTo((-2+7*sw-3)*s,10*s);ctx.stroke(); // 腿
  ctx.beginPath();ctx.moveTo(-2*s,-2*s);ctx.lineTo((-2+7*sw2)*s,5*s);ctx.lineTo((-2+7*sw2-3)*s,10*s);ctx.stroke();
  ctx.beginPath();ctx.moveTo(1*s,-9*s);ctx.lineTo((1+6*sw2)*s,-4*s);ctx.stroke();                   // 手
  ctx.beginPath();ctx.moveTo(1*s,-9*s);ctx.lineTo((1+6*sw)*s,-4*s);ctx.stroke();
  ctx.beginPath();ctx.arc(4*s,-15*s,3.4*s,0,7);ctx.fillStyle='#22355F';ctx.fill();ctx.stroke();      // 頭
  ctx.beginPath();ctx.arc(-2*s,-2*s,2.2*s,0,7);ctx.fillStyle=C.pink;ctx.fill();                       // 短褲
  ctx.restore();
}
function draw(){
  ctx.clearRect(0,0,W,H);const fs=Math.max(9,Math.min(12,(G.x1-G.x0)/42));ctx.font=`${fs}px "IBM Plex Mono",ui-monospace,monospace`;
  // 跑道
  ctx.strokeStyle=C.faint;ctx.lineWidth=1;ctx.beginPath();
  for(let l=0;l<=LANES;l++){const y=G.y0+G.laneH*l;ctx.moveTo(G.x0,y);ctx.lineTo(G.x1,y);}ctx.stroke();
  ctx.strokeStyle=C.dim;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(G.finX,G.y0);ctx.lineTo(G.finX,G.y0+G.trackH);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=C.dim;ctx.textAlign='left';ctx.fillText('100 公尺',G.x0,G.y0-8);ctx.textAlign='right';ctx.fillText('終點・碼錶',G.x1,G.y0-8);
  for(const rn of runners){if(rn.p<0)continue;const p=Math.min(1,rn.p);runner(G.startX+(G.finX-G.startX)*p+(rn.p>1?(rn.p-1)*120:0),laneY(rn.lane)+G.laneH*0.18,rn.ph,1);}
  ctx.textAlign='right';for(const p of pops){ctx.fillStyle=`rgba(237,178,63,${Math.max(0,p.a)})`;ctx.fillText(p.txt+' 秒',p.x,p.y);}
  // 分配
  ctx.globalAlpha=fade;const r=dotR(),st=stackStep();
  const sx=tx(STD);ctx.fillStyle='rgba(237,178,63,.07)';ctx.fillRect(G.x0,G.histTop,sx-G.x0,G.histH);
  for(let b=0;b<NB;b++){const cx=G.x0+G.binW*(b+0.5);const pass=LO+BW*(b+1)<=STD+1e-9;ctx.fillStyle=pass?C.must:C.blue;
    for(let k=0;k<counts[b];k++){ctx.beginPath();ctx.arc(cx,G.base-r-k*st,r,0,7);ctx.fill();}}
  const S=stats();
  if(S.n>=12){ctx.strokeStyle=C.pink;ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<=140;i++){const t=LO+(HI-LO)*i/140;const e=S.n*BW*Math.exp(-0.5*((t-S.m)/S.sd)**2)/(S.sd*Math.sqrt(2*Math.PI));const y=G.base-Math.min(e*st,G.histH);i?ctx.lineTo(tx(t),y):ctx.moveTo(tx(t),y);}ctx.stroke();
    ctx.strokeStyle=C.ink;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(tx(S.m),G.histTop+14);ctx.lineTo(tx(S.m),G.base);ctx.stroke();
    ctx.fillStyle=C.ink;ctx.textAlign='center';ctx.fillText('平均 '+S.m.toFixed(2),tx(S.m),G.histTop+8);}
  ctx.strokeStyle=C.must;ctx.lineWidth=1.6;ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(sx,G.histTop-6);ctx.lineTo(sx,G.base);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=C.must;ctx.textAlign='left';ctx.fillText('標準 '+STD.toFixed(1)+' 秒',G.x0,G.histTop-10);
  ctx.globalAlpha=1;
  // 落下中的點
  for(const d of drops){const e=d.p<.5?2*d.p*d.p:1-Math.pow(-2*d.p+2,2)/2;const x1=G.x0+G.binW*(d.b+0.5),y1=G.base-r-d.slot*st;
    const x=d.x0+(x1-d.x0)*e,y=d.y0+(y1-d.y0)*e-Math.sin(Math.PI*d.p)*18;ctx.beginPath();ctx.arc(x,y,r+1,0,7);ctx.fillStyle=d.t<=STD?C.must:C.blue;ctx.fill();}
  // 軸
  ctx.strokeStyle=C.dim;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(G.x0,G.base);ctx.lineTo(G.x1,G.base);ctx.stroke();
  ctx.fillStyle=C.dim;ctx.textAlign='center';const stp=(G.x1-G.x0)<420?2:1;
  for(let t=LO;t<=HI;t+=stp)ctx.fillText(t,tx(t),G.base+14);
  ctx.textAlign='right';ctx.fillText('百米秒數（愈左愈快）',G.x1,G.base+ (W>900?28:26));
}
const eN=document.getElementById('gN'),eM=document.getElementById('gM'),eS=document.getElementById('gS'),eP=document.getElementById('gP');
function show(){if(!eN)return;const S=stats();eN.textContent=S.n;eM.textContent=S.n<2?'—':S.m.toFixed(2);eS.textContent=S.n<2?'—':S.sd.toFixed(2);if(eP)eP.textContent=S.n<2?'—':Math.round(S.pass*100)+'%';}
function loop(ts){if(!running)return;const dt=Math.min(50,ts-(last||ts));last=ts;
  spawnAcc+=dt;if(spawnAcc>420){spawnAcc=0;if(!resetting&&times.length+runners.length+drops.length<CAP)spawn();}
  step(dt);draw();statAcc+=dt;if(statAcc>200){show();statAcc=0;}requestAnimationFrame(loop);}
function start(){if(running||RM)return;running=true;last=0;requestAnimationFrame(loop);}
function stop(){running=false;}
layout();
if(RM){for(let i=0;i<160;i++){const t=newTime();times.push(t);counts[Math.floor((t-LO)/BW)]++;}draw();show();}
else{for(let i=0;i<3;i++)spawn(i*0.25);start();}
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{layout();draw();},120);});
new IntersectionObserver(es=>{visible=es[0].isIntersecting;visible&&!document.hidden?start():stop();},{threshold:0.02}).observe(intro);
document.addEventListener('visibilitychange',()=>{document.hidden?stop():visible&&start();});
cv.addEventListener('click',()=>{if(RM||resetting)return;for(let i=0;i<20;i++)spawn(i*0.12);});
// 章節列進場
const rows=[...document.querySelectorAll('.chrow')];
if(!RM&&'IntersectionObserver' in window){rows.forEach(r=>r.classList.add('pre'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=rows.indexOf(e.target);e.target.style.transitionDelay=(i%2)*80+'ms';e.target.classList.add('in');e.target.classList.remove('pre');io.unobserve(e.target);}}),{rootMargin:'0px 0px -8% 0px'});
  rows.forEach(r=>io.observe(r));}
})();
