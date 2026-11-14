/* ---------- W10: orrr 勝算比與風險比 ---------- */
W.orrr=(w)=>{
  const defs=[{id:'orp0',label:'對照組的比例',min:1,max:90,step:1,value:30,fmt:v=>v+'%'},{id:'oror',label:'勝算比 OR',min:0.2,max:5,step:0.1,value:2,fmt:v=>v.toFixed(1)}];
  w.innerHTML=`<div class="widget-title"><strong>同一個勝算比，換算成比例是幾倍</strong><span class="note">p₁ = OR·p₀ ÷ (1 − p₀ + OR·p₀)</span></div>${sliders(defs)}
  <div class="in-row"><span class="note">講義的三列（OR = 2）：</span>${[5,30,60].map(v=>`<button class="btn" type="button" data-orpre="${v}">對照組 ${v}%</button>`).join('')}</div>
  ${SV('0 0 640 270','左：對照組與暴露組的比例長條。右：同一個勝算比在不同對照組比例下對應的風險比')}<div id="orS"></div><p class="readout" id="orM"></p>`;
  const svg=w.querySelector('svg');
  const p1of=(p0,or)=>or*p0/(1-p0+or*p0);
  const txt=(x,y,s,anchor,style)=>{const t=el('text',{x,y,'text-anchor':anchor||'middle'},svg);if(style)t.setAttribute('style',style);t.textContent=s;return t;};
  const draw=()=>{const p0=val(w,'orp0')/100,or=val(w,'oror');const p1=p1of(p0,or),rr=p1/p0,diff=(p1-p0)*100;svg.innerHTML='';
    /* left: two bars */
    const L1=44,R1=250,T=30,B=218,y=v=>B-v*(B-T);
    [0,0.25,0.5,0.75,1].forEach(t=>{el('line',{x1:L1,x2:R1,y1:y(t),y2:y(t),class:'grid'},svg);txt(L1-6,y(t)+4,Math.round(t*100)+'%','end');});
    el('line',{x1:L1,x2:R1,y1:B,y2:B,class:'axis'},svg);
    [[p0,92,'var(--accent)','對照組'],[p1,176,'var(--amber)','暴露組']].forEach(([v,x,c,l])=>{el('rect',{x,y:y(v),width:56,height:B-y(v),style:`fill:${c};opacity:.8`},svg);txt(x+28,y(v)-6,(v*100).toFixed(1)+'%','middle','fill:var(--ink);font-weight:600');txt(x+28,B+17,l);});
    txt(L1,14,'規律運動的比例','start');
    /* right: RR as a function of p0 for this OR */
    const L2=340,R2=622,x=p=>L2+p/0.9*(R2-L2);const lo0=Math.min(1,or),hi0=Math.max(1,or),pad=Math.max(0.08,(hi0-lo0)*0.12),lo=lo0-pad,hi=hi0+pad,yy=v=>B-(v-lo)/(hi-lo)*(B-T);
    const st=niceStep(hi-lo,4);for(let t=Math.ceil(lo/st)*st;t<=hi+1e-9;t+=st){el('line',{x1:L2,x2:R2,y1:yy(t),y2:yy(t),class:'grid'},svg);txt(L2-6,yy(t)+4,(+t.toFixed(2)),'end');}
    el('line',{x1:L2,x2:R2,y1:B,y2:B,class:'axis'},svg);[0,30,60,90].forEach(t=>{el('line',{x1:x(t/100),x2:x(t/100),y1:B,y2:B+4,class:'axis'},svg);txt(x(t/100),B+17,t+'%');});
    txt(R2,B+34,'對照組的比例','end');txt(L2,14,'風險比（比例是幾倍）','start');
    el('line',{x1:L2,x2:R2,y1:yy(1),y2:yy(1),style:'stroke:var(--muted);stroke-dasharray:4 4'},svg);
    if(Math.abs(or-1)>1e-9){el('line',{x1:L2,x2:R2,y1:yy(or),y2:yy(or),style:'stroke:var(--amber);stroke-dasharray:4 4'},svg);txt(R2,yy(or)+(or>1?-5:13),'OR = '+or.toFixed(1),'end','fill:var(--amber)');}
    const pts=[];for(let p=0.01;p<=0.9001;p+=0.01)pts.push([x(p),yy(p1of(p,or)/p)]);el('path',{d:pathOf(pts),class:'curve'},svg);
    el('line',{x1:x(p0),x2:x(p0),y1:yy(rr),y2:B,style:'stroke:var(--accent);stroke-dasharray:2 3'},svg);el('circle',{cx:x(p0),cy:yy(rr),r:5,style:'fill:var(--accent)'},svg);
    w.querySelector('#orS').innerHTML=statsHTML([['暴露組比例',(p1*100).toFixed(1)+'%','med'],['風險比',f2(rr,2),'mean'],['比例差（百分點）',(diff>=0?'+':'')+diff.toFixed(1)],['勝算比',or.toFixed(1)]]);
    const gap=Math.abs(or-1)>1e-9?Math.abs(rr-1)/Math.abs(or-1):1;
    w.querySelector('#orM').textContent=Math.abs(or-1)<1e-9?'OR = 1：兩組比例相同，風險比也是 1。':`對照組 ${(p0*100).toFixed(0)}%、OR = ${or.toFixed(1)}：暴露組是 ${(p1*100).toFixed(1)}%，比例是 ${f2(rr,2)} 倍，差 ${Math.abs(diff).toFixed(1)} 個百分點。`+(gap<0.8?`把 OR 說成「${or.toFixed(1)} 倍的可能性」，會把效果說得比實際大。`:'結果很少見時，風險比才接近 OR。')+'往右拖對照組比例，曲線愈來愈靠近 1。';};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-orpre]');if(!b)return;const a=w.querySelector('#orp0'),o=w.querySelector('#oror');a.value=b.dataset.orpre;o.value=2;a.dispatchEvent(new Event('input'));o.dispatchEvent(new Event('input'));});
  bindSliders(w,defs,draw);draw();
};
