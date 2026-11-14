/* ---------- W14: psm ---------- */
W.psm=(w)=>{
  const N=600,TRUE=1.0;
  const r=ST.rng(20270514);const D=[];
  for(let i=0;i<N;i++){const z=ST.rnorm(r);const lp=-0.4+1.2*z;const e=1/(1+Math.exp(-lp));const t=r()<e?1:0;const y=2+TRUE*t+1.5*z+ST.rnorm(r);D.push({z,lp,e,t,y});}
  const T1=D.filter(d=>d.t===1),T0=D.filter(d=>d.t===0);
  const sdLp=ST.sd(D.map(d=>d.lp));
  const pooled=Math.sqrt((ST.sd(T1.map(d=>d.z))**2+ST.sd(T0.map(d=>d.z))**2)/2);
  const smdRaw=(ST.mean(T1.map(d=>d.z))-ST.mean(T0.map(d=>d.z)))/pooled;
  const rawEst=ST.mean(T1.map(d=>d.y))-ST.mean(T0.map(d=>d.y));
  const wmean=(a,f,g)=>{let s=0,ws=0;a.forEach(d=>{s+=g(d)*f(d);ws+=g(d);});return s/ws;};
  const w1=d=>1/d.e,w0=d=>1/(1-d.e);
  const ipw={est:wmean(T1,d=>d.y,w1)-wmean(T0,d=>d.y,w0),smd:(wmean(T1,d=>d.z,w1)-wmean(T0,d=>d.z,w0))/pooled,max:Math.max(...T1.map(w1),...T0.map(w0))};
  function match(c){const cal=c*sdLp;const used=new Array(T0.length).fill(false);const pairs=[];
    T1.slice().sort((a,b)=>b.lp-a.lp).forEach(a=>{let best=-1,bd=Infinity;for(let j=0;j<T0.length;j++){if(used[j])continue;const dd=Math.abs(T0[j].lp-a.lp);if(dd<bd){bd=dd;best=j;}}if(best>=0&&bd<=cal){used[best]=true;pairs.push([a,T0[best]]);}});
    const a=pairs.map(p=>p[0]),b=pairs.map(p=>p[1]);
    return{pairs,a,b,est:pairs.length?ST.mean(a.map(d=>d.y))-ST.mean(b.map(d=>d.y)):NaN,smd:pairs.length?(ST.mean(a.map(d=>d.z))-ST.mean(b.map(d=>d.z)))/pooled:NaN};}
  const defs=[{id:'psmC',label:'卡尺寬度（傾向分數 logit 標準差的倍數）',min:0.05,max:1,step:0.05,value:0.2,fmt:v=>' '+v.toFixed(2)}];
  let mode='raw';
  w.innerHTML=`<div class="widget-title"><strong>配對、加權與平衡</strong>${segHTML('psm',[['raw','未調整'],['match','1:1 配對'],['iptw','加權 IPTW']],'raw')}</div>
  ${sliders(defs)}${SV('0 0 640 280','兩組傾向分數的分布')}<div id="psmS"></div><p class="readout" id="psmM"></p>
  <p class="note" style="margin:0">模擬資料，${N} 人（處理組 ${T1.length}、對照組 ${T0.length}）。一個混淆因子 Z 同時提高接受處理的機率與結果；處理的真實效果設定為 ${TRUE.toFixed(2)}。為了示範，傾向分數直接用產生資料時的真實機率，省略了估計這一步。</p>`;
  const svg=w.querySelector('svg');const NB=20;
  const hist=(arr,wf)=>{const h=new Array(NB).fill(0);arr.forEach(d=>{h[Math.min(NB-1,Math.floor(d.e*NB))]+=wf?wf(d):1;});return h;};
  const draw=()=>{const c=val(w,'psmC');const m=match(c);svg.innerHTML='';
    let h1,h0,est,smd,items,msg;
    if(mode==='raw'){h1=hist(T1);h0=hist(T0);est=rawEst;smd=smdRaw;}
    if(mode==='match'){h1=hist(m.a);h0=hist(m.b);est=m.est;smd=m.smd;}
    if(mode==='iptw'){h1=hist(T1,w1);h0=hist(T0,w0);est=ipw.est;smd=ipw.smd;}
    const L=48,R=608,T=30,B=236,mid=(T+B)/2;const ym=Math.max(...h1,...h0,1);const x=v=>L+v*(R-L),hh=v=>v/ym*(mid-T-4),bw=(R-L)/NB-2;
    for(let i=0;i<NB;i++){const cx=x((i+0.5)/NB);
      if(h1[i]>0)el('rect',{x:cx-bw/2,y:mid-hh(h1[i]),width:bw,height:hh(h1[i]),fill:'var(--amber)',opacity:.85},svg);
      if(h0[i]>0)el('rect',{x:cx-bw/2,y:mid,width:bw,height:hh(h0[i]),fill:'var(--accent)',opacity:.85},svg);}
    el('line',{x1:L,x2:R,y1:mid,y2:mid,class:'axis'},svg);
    axisX(svg,x,0,1,B,0.2,v=>v.toFixed(1),'傾向分數',L,R);
    const t1=el('text',{x:L,y:T-12,fill:'var(--amber)'},svg);t1.textContent='處理組（向上）'+(mode==='iptw'?'，加權後':mode==='match'?'，配對成功者':'');
    const t0=el('text',{x:R,y:T-12,'text-anchor':'end',fill:'var(--accent)'},svg);t0.textContent='對照組（向下）';
    const base=[['估計值',Number.isFinite(est)?est.toFixed(2):'—','med'],['真值',TRUE.toFixed(2),'mean'],['Z 的 SMD（調整前）',smdRaw.toFixed(2)],['Z 的 SMD（調整後）',mode==='raw'?'—':Number.isFinite(smd)?smd.toFixed(2):'—']];
    if(mode==='match')base.push(['配對成功',m.pairs.length+' 對'],['被捨棄的處理組',(T1.length-m.pairs.length)+' 人']);
    if(mode==='iptw')base.push(['最大權重',ipw.max.toFixed(1)]);
    w.querySelector('#psmS').innerHTML=statsHTML(base);
    if(mode==='raw')msg=`直接比較兩組，差異是 ${rawEst.toFixed(2)}，高於真值 ${TRUE.toFixed(2)}。Z 的 SMD 為 ${smdRaw.toFixed(2)}，遠超過 0.1：處理組的 Z 本來就比較高，多出來的差異來自 Z。圖中兩組的傾向分數分布明顯錯開。`;
    if(mode==='match')msg=`卡尺 ${c.toFixed(2)}：${T1.length} 位處理組中 ${m.pairs.length} 位配對成功，${T1.length-m.pairs.length} 位被捨棄。Z 的 SMD 由 ${smdRaw.toFixed(2)} 降到 ${m.smd.toFixed(2)}${Math.abs(m.smd)<0.1?'，低於 0.1':'，仍高於 0.1'}，估計值 ${m.est.toFixed(2)}。把卡尺往左拉：SMD 變小，被捨棄的人變多，結論只適用於留下來的人。`;
    if(mode==='iptw')msg=`加權不捨棄任何人。加權後 Z 的 SMD 為 ${ipw.smd.toFixed(2)}，估計值 ${ipw.est.toFixed(2)}。最大權重 ${ipw.max.toFixed(1)}：這一個人在加權後的樣本中代表約 ${Math.round(ipw.max)} 人，傾向分數接近 0 或 1 的人愈多，估計愈不穩。卡尺對加權沒有作用。`;
    w.querySelector('#psmM').textContent=msg;};
  segBind(w,'psm',v=>{mode=v;draw();});bindSliders(w,defs,draw);draw();
};
