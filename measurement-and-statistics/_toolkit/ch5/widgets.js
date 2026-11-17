/* ===== 第 5 章 推論統計：互動工具（c5sample、c5errors、c5pvalue、c5chi2、c5ttest、c5anova） =====
   預設資料＝講義表 5-3～5-7；c5sample 與 c5errors 的數值是自編示意值，畫面上有標明。 */
const c5={
  // 圖上的文字（比框架預設的 11px 大一點，手機上才看得到）
  t:(svg,x,y,s,a='middle',st='')=>{const e=el('text',{x,y,'text-anchor':a,style:'font-size:13px;'+st},svg);e.textContent=s;return e;},
  // p 值的寫法：.017、.00015、< .0001
  p:v=>!Number.isFinite(v)?'—':v<0.0001?'< .0001':v<0.001?v.toFixed(5).replace(/^0/,''):v.toFixed(3).replace(/^0/,''),
  pEq:v=>v<0.0001?'p < .0001':'p＝'+c5.p(v),
  nums:s=>(String(s).match(/-?\d+(?:\.\d+)?/g)||[]).map(Number),
  ss:a=>{const m=ST.mean(a);return a.reduce((s,v)=>s+(v-m)**2,0);},
  area:(svg,x,y,f,a,b,st)=>{if(!(b>a))return null;const n=80,pts=[[x(a),y(0)]];for(let i=0;i<=n;i++){const v=a+(b-a)*i/n;pts.push([x(v),y(f(v))]);}pts.push([x(b),y(0)]);return el('path',{d:pathOf(pts)+'Z',style:st},svg);},
  axX:(svg,x,lo,hi,Y,step,L,R,label,ff)=>{el('line',{x1:L,x2:R,y1:Y,y2:Y,class:'axis'},svg);for(let v=Math.ceil(lo/step-1e-9)*step;v<=hi+1e-9;v+=step){el('line',{x1:x(v),x2:x(v),y1:Y,y2:Y+4,class:'axis'},svg);c5.t(svg,x(v),Y+18,ff?ff(v):String(+v.toFixed(6)));}if(label)c5.t(svg,R,Y+36,label,'end');},
  axY:(svg,y,lo,hi,L,R,step,ff)=>{for(let v=Math.ceil(lo/step-1e-9)*step;v<=hi+1e-9;v+=step){el('line',{x1:L,x2:R,y1:y(v),y2:y(v),class:'grid'},svg);c5.t(svg,L-6,y(v)+4,ff?ff(v):String(+v.toFixed(6)),'end');}},
  sign:(v,d)=>(v<0?'−':'+')+f2(Math.abs(v),d)
};

/* ---------- 概念 1：母群體、樣本與抽樣誤差 ---------- */
W.c5sample=(w)=>{
  const N=200,MU=30,SG=8;
  // 示意母群體：200 位學生的活動時間（分鐘）。固定種子產生後，線性調整成平均剛好 30、標準差剛好 8。
  const POP=(()=>{const r=ST.rng(505),z=[];for(let i=0;i<N;i++)z.push(ST.rnorm(r));const m=ST.mean(z),s=Math.sqrt(z.reduce((t,v)=>t+(v-m)**2,0)/N);return z.map(v=>MU+SG*(v-m)/s);})();
  let seed=11,rnd=ST.rng(seed),means=[],cur=[];
  const defs=[{id:'c5sN',label:'每組樣本人數 n（改了會重新累積）',min:5,max:100,step:5,value:50}];
  w.innerHTML=`<div class="widget-title"><strong>從 200 位裡抽樣本，看平均數怎麼跳</strong><div class="controls"><button class="btn" type="button" id="c5sDraw">抽一組樣本</button><button class="btn" type="button" id="c5sMany">連抽 50 組</button><button class="btn" type="button" id="c5sReset">重新開始</button></div></div>${sliders(defs)}${SV('0 0 560 336','母群體的個人分數與各組樣本平均數')}<div id="c5sS"></div><p class="readout" id="c5sM"></p><p class="note" style="margin:0">母群體的數值是示意值（自編）：200 位學生體育課的活動時間，平均 μ＝30 分鐘、標準差 σ＝8 分鐘。講義第 5 張只給了人數（母群體 200 位、樣本 50 位）。</p>`;
  const svg=w.querySelector('svg');
  const take=n=>{const idx=Array.from({length:N},(_,i)=>i);for(let i=0;i<n;i++){const j=i+Math.floor(rnd()*(N-i));const t=idx[i];idx[i]=idx[j];idx[j]=t;}return idx.slice(0,n);};
  const one=()=>{const n=val(w,'c5sN');cur=take(n);means.push(ST.mean(cur.map(i=>POP[i])));};
  const draw=()=>{const n=val(w,'c5sN'),k=means.length,M=means[k-1];
    svg.innerHTML='';const L=16,R=544,lo=4,hi=56,B1=128,B2=292;const X=v=>L+(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*(R-L);
    c5.t(svg,L,14,`母群體：200 位學生，每點一人（粉紅色＝這次抽到的 ${n} 位）`,'start');
    const inS=new Set(cur),cnt={};
    POP.forEach((v,i)=>{const b=Math.floor(Math.max(lo,Math.min(hi-0.01,v)));const j=cnt[b]=(cnt[b]||0)+1;const s=inS.has(i);el('circle',{cx:X(b+0.5),cy:B1-3-(j-1)*5.2,r:s?2.7:2.2,class:s?'pt2':'ptN',style:s?'':'opacity:.3'},svg);});
    c5.axX(svg,X,10,50,B1,10,L,R);
    c5.t(svg,L,176,`各組樣本的平均數，每點一組（已抽 ${k} 組，黃色＝最新一組）`,'start');
    const c2={},pos=means.map(m=>{const b=Math.floor(m*2);c2[b]=(c2[b]||0)+1;return[b,c2[b]];});const mx=Math.max(...Object.values(c2)),dy=Math.min(5.2,100/mx);
    pos.forEach(([b,j],i)=>{if(i<k-1)el('circle',{cx:X(b/2+0.25),cy:B2-3-(j-1)*dy,r:2.4,class:'pt'},svg);});
    {const[b,j]=pos[k-1];el('circle',{cx:X(b/2+0.25),cy:B2-3-(j-1)*dy,r:4.2,class:'must',style:'stroke:var(--ink);stroke-width:1'},svg);}
    c5.axX(svg,X,10,50,B2,10,L,R,'活動時間（分鐘）');
    el('line',{x1:X(MU),x2:X(MU),y1:22,y2:B1,class:'mean'},svg);el('line',{x1:X(MU),x2:X(MU),y1:186,y2:B2,class:'mean'},svg);c5.t(svg,X(MU)+(M>=MU?-5:5),36,'μ＝'+f2(MU,1),M>=MU?'end':'start','fill:var(--accent);font-weight:500');
    el('line',{x1:X(M),x2:X(M),y1:44,y2:B1,class:'median'},svg);c5.t(svg,X(M)+(M>=MU?5:-5),56,'M＝'+f2(M,1),M>=MU?'start':'end','fill:var(--amber);font-weight:500');
    const mn=Math.min(...means),mxm=Math.max(...means);
    w.querySelector('#c5sS').innerHTML=statsHTML([['母群體平均 μ（母數）',f2(MU,1),'mean'],['這組的平均 M（統計數）',f2(M,1),'med'],['M − μ',c5.sign(M-MU,1)],['已抽組數',k],['各組 M 的範圍',k>1?f2(mn,1)+'–'+f2(mxm,1):'—'],['各組 M 的標準差',k>1?f2(ST.sd(means),2):'—']]);
    let msg=`這一組 ${n} 位的平均是 ${f2(M,1)} 分鐘，和母群體的 ${f2(MU,1)} 差 ${c5.sign(M-MU,1)}。母群體沒有變，換一批人平均數就不一樣，這個落差叫抽樣誤差。`;
    if(k>1){const P=means[k-2];msg+=`上一組是 ${f2(P,1)}，兩組相差 ${f2(Math.abs(M-P),1)} 分鐘，可是它們來自同一個母群體。所以看到兩組平均數不同，還不能直接說母群體真的有差別，要靠考驗來判斷。`;}
    else msg+='再按「抽一組樣本」看看。';
    if(k>=30)msg+=` 累積 ${k} 組後可以看到：各組平均數都擠在 μ 附近，散布比個人分數窄得多；把 n 調小，它會變寬。`;
    w.querySelector('#c5sM').textContent=msg;};
  w.querySelector('#c5sDraw').addEventListener('click',()=>{one();draw();});
  w.querySelector('#c5sMany').addEventListener('click',()=>{for(let i=0;i<50;i++)one();draw();});
  w.querySelector('#c5sReset').addEventListener('click',()=>{seed++;rnd=ST.rng(seed);means=[];one();draw();});
  bindSliders(w,defs,()=>{means=[];one();draw();});one();draw();
};

/* ---------- 概念 2：第一類型錯誤與第二類型錯誤 ---------- */
W.c5errors=(w)=>{
  const defs=[{id:'c5eA',label:'顯著水準 α',min:0.01,max:0.2,step:0.01,value:0.05,fmt:v=>v.toFixed(2)},{id:'c5eD',label:'真實差異（幾個標準差）',min:0,max:1.5,step:0.05,value:0.5,fmt:v=>v.toFixed(2)},{id:'c5eN',label:'每組人數 n',min:5,max:100,step:1,value:20}];
  w.innerHTML=`<div class="widget-title"><strong>α、β 與考驗力：兩條曲線怎麼切</strong><button class="btn" type="button" id="c5eR">回到預設</button></div>${sliders(defs)}${SV('0 0 560 262','虛無假設與對立假設下的分配，以及 α、β、考驗力的面積')}<div class="legend"><span><i style="background:var(--amber)"></i>α：第一類型錯誤</span><span><i style="background:var(--mustard)"></i>β：第二類型錯誤</span><span><i style="background:var(--accent);opacity:.45"></i>1 − β：考驗力</span></div><div id="c5eS"></div><p class="readout" id="c5eM"></p><p class="note" style="margin:0">示意計算（自編）：兩組人數相同、雙尾考驗，用常態分配近似；橫軸是「兩組平均數的差 ÷ 標準誤」。講義圖 5-1 只定義 α 與 β，沒有給數字。考驗力（1 − β，也叫檢定力）是真的有差異時抓得到的機率。</p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const a=val(w,'c5eA'),d=val(w,'c5eD'),n=val(w,'c5eN');const de=d*Math.sqrt(n/2),zc=ST.qnorm(1-a/2);const pw=1-ST.pnorm(zc-de)+ST.pnorm(-zc-de),be=1-pw;
    svg.innerHTML='';const L=16,R=544,T=44,B=206,lo=-4,hi=Math.max(6,Math.ceil(de+3.5));const x=v=>L+(v-lo)/(hi-lo)*(R-L),y=v=>B-v/0.42*(B-T);const f0=v=>ST.dnorm(v),f1=v=>ST.dnorm(v-de);
    if(d>0){c5.area(svg,x,y,f1,zc,hi,'fill:var(--accent);opacity:.32');c5.area(svg,x,y,f1,lo,-zc,'fill:var(--accent);opacity:.32');c5.area(svg,x,y,f1,-zc,zc,'fill:var(--mustard);opacity:.6');}
    c5.area(svg,x,y,f0,zc,hi,'fill:var(--amber);opacity:.7');c5.area(svg,x,y,f0,lo,-zc,'fill:var(--amber);opacity:.7');
    curve(svg,x,y,f0,lo,hi,'curve');if(d>0)curve(svg,x,y,f1,lo,hi,'curve3');
    [-zc,zc].forEach(c=>el('line',{x1:x(c),x2:x(c),y1:T-6,y2:B,class:'dash'},svg));
    c5.axX(svg,x,lo,hi,B,hi-lo>12?2:1,L,R);
    c5.t(svg,Math.max(L+70,x(0)),14,'虛無假設為真：沒有差別','middle','fill:var(--ink);font-weight:500');
    if(d>0)c5.t(svg,Math.min(R-70,Math.max(L+70,x(de))),31,'對立假設為真：有差別','middle','fill:var(--accent);font-weight:500');
    c5.t(svg,x(0),B+40,x(zc)-x(-zc)>100?'保留虛無假設':'保留','middle');c5.t(svg,x(zc)+8,B+40,'拒絕 →','start');c5.t(svg,x(-zc)-8,B+40,'← 拒絕','end');
    const pc=v=>(v*100).toFixed(1)+'%';
    w.querySelector('#c5eS').innerHTML=statsHTML([['α（第一類型錯誤）',pc(a),'med'],['β（第二類型錯誤）',d>0?pc(be):'—'],['考驗力 1 − β',d>0?pc(pw):'—','mean'],['臨界值','±'+f2(zc,2)]]);
    let msg=`α＝${a.toFixed(2)}：假如其實沒有差別，仍有 ${pc(a)} 的機會落在粉紅色區域而拒絕虛無假設，這是第一類型錯誤（沒效說成有效）。`;
    if(d>0)msg+=`假如真的有 ${d.toFixed(2)} 個標準差的差異、每組 ${n} 人，有 ${pc(be)} 的機會落在黃色區域而保留虛無假設，這是第二類型錯誤（有效說成沒效）；抓到差異的機會（考驗力）是 ${pc(pw)}。`+(pw<0.5?'想讓 β 變小，可以增加人數；把 α 訂得更嚴（調小）只會讓 β 變大。':'把 α 調小，粉紅色變少，黃色卻變多：兩種錯誤此消彼長。');
    else msg+='真實差異設為 0 時，虛無假設就是真的，只可能犯第一類型錯誤，沒有 β 可言。';
    w.querySelector('#c5eM').textContent=msg;};
  w.querySelector('#c5eR').addEventListener('click',()=>{defs.forEach(q=>{const i=w.querySelector('#'+q.id);i.value=q.value;i.dispatchEvent(new Event('input'));});});
  bindSliders(w,defs,draw);draw();
};

/* ---------- 概念 3：p 值（由 W.tails 改寫） ---------- */
W.c5pvalue=(w)=>{
  let h1='ne';const defs=[{id:'c5pT',label:'觀察到的 t',min:-10,max:10,step:0.001,value:5.136,fmt:v=>v.toFixed(3)},{id:'c5pD',label:'自由度 df',min:2,max:60,step:1,value:14}];
  w.innerHTML=`<div class="widget-title"><strong>p 值是哪一塊面積</strong>${segHTML('c5ph',[['ne','雙尾'],['gt','右尾'],['lt','左尾']],'ne')}</div><div class="in-row" style="margin:0"><span class="note">講義的結果：</span><button class="btn" type="button" data-c5pp="5.136,14">獨立樣本 t(14)＝5.14</button><button class="btn" type="button" data-c5pp="9,7">相依樣本 t(7)＝9.00</button><button class="btn" type="button" data-c5pp="crit">剛好在臨界值上</button></div>${sliders(defs)}${SV('0 0 560 250','虛無假設為真時的 t 分配、拒絕域與 p 值面積')}<div class="legend"><span><i style="background:var(--accent);opacity:.6"></i>p 值面積</span><span><i style="background:var(--amber);opacity:.35"></i>拒絕域（面積 α＝.05）</span></div><div id="c5pS"></div><p class="readout" id="c5pM"></p><p class="note" style="margin:0">曲線是「虛無假設為真」時 t 值的分配。講義第 11 張寫「P 值：p(虛無假設成立)」不精確，正確的說法見上面的解讀。</p>`;
  const svg=w.querySelector('svg');
  const set=(id,v)=>{const i=w.querySelector('#'+id);i.value=v;i.dispatchEvent(new Event('input'));};
  const draw=()=>{const t=val(w,'c5pT'),df=val(w,'c5pD'),A=0.05;const pR=1-ST.pt(t,df),pL=ST.pt(t,df),p2=2*(1-ST.pt(Math.abs(t),df));const p=h1==='gt'?pR:h1==='lt'?pL:p2;const tc=h1==='ne'?ST.qt(1-A/2,df):ST.qt(1-A,df);
    svg.innerHTML='';const L=16,R=544,T=30,B=196,hi=Math.max(5,Math.ceil(Math.abs(t))+1),lo=-hi;const x=v=>L+(v-lo)/(hi-lo)*(R-L),f=v=>ST.dt(v,df),y=v=>B-v/f(0)*(B-T);const at=Math.abs(t);
    const rj='fill:var(--amber);opacity:.28',pa='fill:var(--accent);opacity:.6';
    if(h1!=='lt')c5.area(svg,x,y,f,tc,hi,rj);if(h1!=='gt')c5.area(svg,x,y,f,lo,-tc,rj);
    if(h1==='gt')c5.area(svg,x,y,f,t,hi,pa);if(h1==='lt')c5.area(svg,x,y,f,lo,t,pa);if(h1==='ne'){c5.area(svg,x,y,f,at,hi,pa);c5.area(svg,x,y,f,lo,-at,pa);}
    curve(svg,x,y,f,lo,hi,'curve');
    (h1==='ne'?[-tc,tc]:h1==='gt'?[tc]:[-tc]).forEach(c=>el('line',{x1:x(c),x2:x(c),y1:T+34,y2:B,class:'dash'},svg));
    el('line',{x1:x(t),x2:x(t),y1:T-8,y2:B,class:'zline'},svg);if(h1==='ne'&&at>0.02)el('line',{x1:x(-t),x2:x(-t),y1:T-8,y2:B,class:'zline',style:'opacity:.35'},svg);
    const far=x(t)>R-90;c5.t(svg,x(t)+(far?-6:6),T-2,'觀察到的 t＝'+t.toFixed(2).replace('-','−'),far?'end':'start','fill:var(--ink);font-weight:500');
    c5.axX(svg,x,lo,hi,B,hi>7?2:1,L,R,'t 值');c5.t(svg,x(0),B+36,'t＝0：完全沒有差別','middle');
    const rej=p<A;const side=h1==='ne'?`落在 ±${at.toFixed(2)} 以外`:h1==='gt'?`大於等於 ${t.toFixed(2).replace('-','−')}`:`小於等於 ${t.toFixed(2).replace('-','−')}`;
    w.querySelector('#c5pS').innerHTML=statsHTML([[h1==='ne'?'p 值（雙尾）':h1==='gt'?'p 值（右尾）':'p 值（左尾）',c5.p(p),'mean'],['t',t.toFixed(2).replace('-','−')],['自由度',df],['α＝.05 的臨界值',(h1==='ne'?'±':h1==='lt'?'−':'')+f2(tc,3)],['裁決',rej?'拒絕 H0':'保留 H0','med']]);
    let msg=`假如虛無假設是真的，t 值${side}（和手上的結果一樣極端或更極端）的機率${p<0.0001?'小於 .0001':'是 '+c5.p(p)}`;
    msg+=p>0&&p<0.01?`，大約每 ${Number((1/p).toPrecision(2)).toLocaleString('zh-TW')} 次才出現 1 次。`:'。';
    msg+=rej?`p 小於 α＝.05，拒絕虛無假設。${p<0.001?'藍色面積小到看不見；把 t 往 0 拉，看面積怎麼長大。':''}`:'p 不小於 α＝.05，保留虛無假設：這樣的結果在「沒有差別」時並不少見。';
    if((h1==='gt'&&t<0)||(h1==='lt'&&t>0))msg+='觀察到的方向和對立假設相反，單尾的 p 值會很大；方向要在看資料之前決定。';
    msg+=' p 值不是「虛無假設成立的機率」。';
    w.querySelector('#c5pM').textContent=msg;};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c5pp]');if(!b)return;if(b.dataset.c5pp==='crit'){const df=val(w,'c5pD');set('c5pT',(h1==='lt'?-1:1)*Math.ceil(ST.qt(h1==='ne'?0.975:0.95,df)*1000)/1000);}else{const[t,df]=b.dataset.c5pp.split(',');set('c5pD',df);set('c5pT',t);}});
  segBind(w,'c5ph',v=>{h1=v;draw();});bindSliders(w,defs,draw);draw();
};

/* ---------- 概念 4：卡方考驗（由 W.chi2 改寫） ---------- */
W.c5chi2=(w)=>{
  const DEF=[10,0,2,18],RN=['循環重量訓練','有氧舞蹈'],CN=['男生','女生'];let O=DEF.slice();
  const calc=t=>{const[a,b,c,d]=t,r1=a+b,r2=c+d,c1=a+c,c2=b+d,N=r1+r2;const E=[r1*c1/N,r1*c2/N,r2*c1/N,r2*c2/N];const parts=t.map((o,i)=>E[i]?(o-E[i])**2/E[i]:0);const chi=parts.reduce((s,v)=>s+v,0);const chiY=t.reduce((s,o,i)=>s+(E[i]?Math.max(0,Math.abs(o-E[i])-0.5)**2/E[i]:0),0);
    const lo=Math.max(0,c1-r2),hi=Math.min(r1,c1),pobs=ST.dhyper(a,r1,r2,c1);let pf=0;for(let k=lo;k<=hi;k++){const q=ST.dhyper(k,r1,r2,c1);if(q<=pobs*(1+1e-7))pf+=q;}
    return{r1,r2,c1,c2,N,E,parts,chi,chiY,p:1-ST.pchisq(chi,1),pY:1-ST.pchisq(chiY,1),pf:Math.min(1,pf)};};
  w.innerHTML=`<div class="widget-title"><strong>2×2 次數表：觀察次數、期望次數與卡方</strong><button class="btn" type="button" id="c5xR">講義資料</button></div><div class="tbl-wrap"><table class="ct" id="c5xT"></table></div>${SV('0 0 560 138','兩門課的男生比例，和虛無假設成立時的比例')}<p class="formula" id="c5xF"></p><div id="c5xS"></div><p class="readout" id="c5xM"></p><p class="note" style="margin:0">四格人數可以直接改。格子裡的小字是期望次數（列合計 × 欄合計 ÷ 總人數），紅色表示小於 5。預設是講義表 5-3 的 30 人。</p>`;
  const svg=w.querySelector('svg'),q=s=>w.querySelector(s);
  const build=()=>{let h=`<tr><th>課程</th>${CN.map(c=>`<th>${c}</th>`).join('')}<th>合計</th><th>男生比例</th></tr>`;
    [0,1].forEach(i=>{h+=`<tr><th>${RN[i]}</th>${[0,1].map(j=>{const k=i*2+j;return `<td><input type="number" min="0" max="999" value="${O[k]}" data-c5x="${k}" aria-label="${RN[i]}的${CN[j]}人數"><span class="exp" data-c5e="${k}"></span></td>`;}).join('')}<td class="tot" data-c5rt="${i}"></td><td class="tot" data-c5rp="${i}"></td></tr>`;});
    h+=`<tr><th>合計</th><td class="tot" data-c5ct="0"></td><td class="tot" data-c5ct="1"></td><td class="tot" data-c5n></td><td class="tot" data-c5rp="2"></td></tr>`;q('#c5xT').innerHTML=h;upd();};
  const upd=()=>{const s=calc(O);const ok=s.r1>0&&s.r2>0&&s.c1>0&&s.c2>0;const pc=v=>Number.isFinite(v)?f2(v*100,1)+'%':'—';
    [0,1,2,3].forEach(k=>{const e=q(`[data-c5e="${k}"]`);e.textContent=ok?'期望 '+f2(s.E[k],2):'';e.classList.toggle('low',ok&&s.E[k]<5);});
    q('[data-c5rt="0"]').textContent=s.r1;q('[data-c5rt="1"]').textContent=s.r2;q('[data-c5ct="0"]').textContent=s.c1;q('[data-c5ct="1"]').textContent=s.c2;q('[data-c5n]').textContent=s.N;
    const pr=[O[0]/s.r1,O[2]/s.r2,s.c1/s.N];pr.forEach((v,i)=>q(`[data-c5rp="${i}"]`).textContent=pc(v));
    svg.innerHTML='';if(!ok){q('#c5xS').innerHTML='';q('#c5xF').textContent='χ² 算不出來';q('#c5xM').textContent='每一列、每一欄至少要有 1 人，才算得出期望次數。';return;}
    const L=108,R=530,x=v=>L+v*(R-L);
    [0,1].forEach(i=>{const yy=26+i*40;el('rect',{x:L,y:yy,width:R-L,height:24,style:'fill:var(--soft)'},svg);el('rect',{x:L,y:yy,width:Math.max(0,x(pr[i])-L),height:24,class:'bar'},svg);c5.t(svg,L-8,yy+17,RN[i].replace('重量訓練','課').replace('有氧舞蹈','舞蹈課'),'end','fill:var(--ink)');
      const inside=pr[i]>0.2;c5.t(svg,inside?x(pr[i])-6:x(pr[i])+6,yy+17,'男生 '+pc(pr[i]),inside?'end':'start',inside?'fill:var(--accent-ink)':'fill:var(--ink)');});
    el('line',{x1:x(pr[2]),x2:x(pr[2]),y1:16,y2:100,class:'lnm',style:'stroke-dasharray:6 4'},svg);
    c5.t(svg,Math.min(385,Math.max(175,x(pr[2]))),120,`虛線：虛無假設成立時，兩門課的男生都該占 ${pc(pr[2])}`,'middle','fill:var(--ink)');
    q('#c5xF').innerHTML=`χ² ＝ Σ (觀察 − 期望)² ÷ 期望 ＝ ${s.parts.map(v=>f2(v,2)).join(' + ')} ＝ <b>${f2(s.chi,2)}</b>`;
    const low=s.E.filter(e=>e<5).length;
    q('#c5xS').innerHTML=statsHTML([['Pearson χ²(1)',f2(s.chi,2),'mean'],['p',c5.p(s.p)],['連續性校正後 χ²',f2(s.chiY,2),'med'],['校正後 p',c5.p(s.pY)],['Fisher 精確考驗 p',c5.p(s.pf)],['最小期望次數',f2(Math.min(...s.E),2)]]);
    const rej=s.p<0.05;let msg=`${RN[0]}的男生占 ${pc(pr[0])}、${RN[1]}占 ${pc(pr[1])}；假如兩門課的男女比例相同，兩邊都應該接近 ${pc(pr[2])}。χ²(1)＝${f2(s.chi,2)}，${c5.pEq(s.p)}，${rej?'小於 .05，拒絕虛無假設：兩門課的男女比例不相同。':'不小於 .05，保留虛無假設：這樣的落差還在抽樣誤差會出現的範圍內。'}`;
    if(low)msg+=`有 ${low} 格期望次數小於 5，卡方的近似比較粗，2×2 表通常會一併看連續性校正（${f2(s.chiY,2)}）或 Fisher 精確考驗${(s.pY<0.05)===rej&&(s.pf<0.05)===rej?'，這裡結論相同':'，這裡結論不一致，要以它們為準'}。`;
    if(O.join()===DEF.join())msg+=' 講義圖 5-2 的 SPSS 輸出也是 22.500 與 18.905。';
    q('#c5xM').textContent=msg;};
  w.addEventListener('input',e=>{const i=e.target.closest('[data-c5x]');if(!i)return;O[+i.dataset.c5x]=Math.max(0,Math.min(999,Math.round(+i.value||0)));upd();});
  q('#c5xR').addEventListener('click',()=>{O=DEF.slice();build();});build();
};

/* ---------- 概念 5：t 考驗（獨立與相依） ---------- */
W.c5ttest=(w)=>{
  const PRE={ind:{mode:'ind',a:[20,18,17,19,20,16,18,19],b:[16,15,17,14,15,13,14,12],la:'正選球員',lb:'候補球員'},pair:{mode:'pair',a:[20,24,20,19,20,22,21,21],b:[18,20,17,16,15,18,19,17],la:'季節後',lb:'季節前'}};
  let mode='ind',src='ind',la=PRE.ind.la,lb=PRE.ind.lb;
  w.innerHTML=`<div class="widget-title"><strong>兩組平均數的 t 考驗</strong>${segHTML('c5tm',[['ind','獨立樣本'],['pair','相依樣本']],'ind')}</div><div class="in-row" style="margin:0"><span class="note">講義資料：</span><button class="btn" type="button" data-c5tp="ind">表 5-4　正選與候補</button><button class="btn" type="button" data-c5tp="pair">表 5-5　季節前後</button></div>
  <div class="slider-row"><label for="c5tA"><span id="c5tLA"></span><textarea class="nums" id="c5tA" rows="2" spellcheck="false"></textarea></label><label for="c5tB"><span id="c5tLB"></span><textarea class="nums" id="c5tB" rows="2" spellcheck="false"></textarea></label></div>
  ${SV('0 0 560 226','兩組資料的點圖')}<p class="formula" id="c5tF"></p><div id="c5tS"></div><p class="readout" id="c5tM"></p><p class="note" id="c5tN" style="margin:0"></p>`;
  const svg=w.querySelector('svg'),q=s=>w.querySelector(s);
  const load=k=>{const P=PRE[k];src=k;mode=P.mode;la=P.la;lb=P.lb;q('#c5tA').value=P.a.join(', ');q('#c5tB').value=P.b.join(', ');w.querySelectorAll('[data-c5tm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c5tm===mode?'true':'false'));draw();};
  const draw=()=>{const a=c5.nums(q('#c5tA').value),b=c5.nums(q('#c5tB').value);q('#c5tLA').textContent=`第一組：${la}（${a.length} 筆）`;q('#c5tLB').textContent=`第二組：${lb}（${b.length} 筆）`;
    svg.innerHTML='';const fail=m=>{q('#c5tS').innerHTML='';q('#c5tF').textContent='t 算不出來';q('#c5tM').textContent=m;q('#c5tN').textContent='';};
    if(a.length<2||b.length<2)return fail('每一組至少要有 2 個數字，用逗號或空白隔開。');
    if(mode==='pair'&&a.length!==b.length)return fail(`相依樣本是同一批人量兩次，兩欄的筆數要一樣，而且第 1 個對第 1 個、第 2 個對第 2 個。目前是 ${a.length} 筆和 ${b.length} 筆。`);
    const m1=ST.mean(a),m2=ST.mean(b),s1=ST.sd(a),s2=ST.sd(b),n1=a.length,n2=b.length;
    // 圖：上下兩列點圖，相同的值往外疊；相依樣本把同一個人的兩個點連起來
    const all=a.concat(b),st=niceStep(Math.max(1,Math.max(...all)-Math.min(...all)),7),lo=Math.floor(Math.min(...all)/st)*st-st/2,hi=Math.ceil(Math.max(...all)/st)*st+st/2;const L=92,R=540,x=v=>L+(v-lo)/(hi-lo)*(R-L),Y=[84,128];
    const place=(arr,dir)=>{const c={};return arr.map(v=>{const k=c[v]=(c[v]||0)+1;return[x(v),(dir<0?Y[0]:Y[1])+dir*(k-1)*11];});};const pa=place(a,-1),pb=place(b,1);
    if(mode==='pair')pa.forEach((p,i)=>el('line',{x1:p[0],y1:p[1],x2:pb[i][0],y2:pb[i][1],style:'stroke:var(--muted);stroke-width:1.2;opacity:.7'},svg));
    pa.forEach(p=>el('circle',{cx:p[0],cy:p[1],r:5,class:'pt'},svg));pb.forEach(p=>el('circle',{cx:p[0],cy:p[1],r:5,class:'pt2'},svg));
    el('line',{x1:x(m1),x2:x(m1),y1:Y[0]-52,y2:Y[0]+12,class:'ln',style:'stroke-dasharray:5 3'},svg);el('line',{x1:x(m2),x2:x(m2),y1:Y[1]-12,y2:Y[1]+46,class:'ln2',style:'stroke-dasharray:5 3'},svg);
    c5.t(svg,x(m1),Y[0]-58,'平均 '+f2(m1,2),'middle','fill:var(--accent);font-weight:500');c5.t(svg,x(m2),Y[1]+62,'平均 '+f2(m2,2),'middle','fill:var(--amber);font-weight:500');
    c5.t(svg,L-12,Y[0]+4,la.slice(0,5),'end','fill:var(--ink)');c5.t(svg,L-12,Y[1]+4,lb.slice(0,5),'end','fill:var(--ink)');
    el('line',{x1:L-6,x2:R,y1:(Y[0]+Y[1])/2,y2:(Y[0]+Y[1])/2,class:'grid'},svg);c5.axX(svg,x,lo,hi,196,st,L-6,R);
    let t,df,p,diff=m1-m2,se;
    if(mode==='ind'){const sp2=((n1-1)*s1*s1+(n2-1)*s2*s2)/(n1+n2-2);se=Math.sqrt(sp2*(1/n1+1/n2));t=diff/se;df=n1+n2-2;p=2*(1-ST.pt(Math.abs(t),df));
      const v1=s1*s1/n1,v2=s2*s2/n2,tW=diff/Math.sqrt(v1+v2),dW=(v1+v2)**2/(v1*v1/(n1-1)+v2*v2/(n2-1)),pW=2*(1-ST.pt(Math.abs(tW),dW));
      if(!(se>0))return fail('兩組都沒有變異（每個數字都一樣），標準誤是 0，t 算不出來。');
      q('#c5tF').innerHTML=`t ＝ (M₁ − M₂) ÷ 標準誤 ＝ (${f2(m1,3)} − ${f2(m2,3)}) ÷ <i>${f2(se,3)}</i> ＝ <b>${f2(t,2)}</b>`;
      q('#c5tS').innerHTML=statsHTML([[la+'平均',f2(m1,2),'mean'],[la+'標準差',f2(s1,2)],[lb+'平均',f2(m2,2),'med'],[lb+'標準差',f2(s2,2)],['平均差',f2(diff,2)],['t',f2(t,2)],['自由度',df],['p（雙尾）',c5.p(p)]]);
      q('#c5tN').textContent=`獨立樣本這裡假定兩組變異數相等（和影片、講義圖 5-3 的第一列相同），標準誤 ＝ √[合併變異數 × (1/n₁ + 1/n₂)]。不假定相等的作法（Welch）：t＝${f2(tW,2)}、自由度 ${f2(dW,2)}、p＝${c5.p(pW)}。`;
    }else{const d=a.map((v,i)=>v-b[i]),sdD=ST.sd(d);se=sdD/Math.sqrt(n1);if(!(se>0))return fail('每個人的差都一樣，差值的標準差是 0，t 算不出來。');t=diff/se;df=n1-1;p=2*(1-ST.pt(Math.abs(t),df));
      q('#c5tF').innerHTML=`t ＝ 差的平均 ÷ (差的標準差 ÷ √n) ＝ ${f2(diff,3)} ÷ (<i>${f2(sdD,3)}</i> ÷ √${n1}) ＝ <b>${f2(t,2)}</b>`;
      q('#c5tS').innerHTML=statsHTML([[la+'平均',f2(m1,2),'mean'],[lb+'平均',f2(m2,2),'med'],['差的平均',f2(diff,2)],['差的標準差',f2(sdD,2)],['t',f2(t,2)],['自由度',df],['p（雙尾）',c5.p(p)]]);
      q('#c5tN').textContent=`相依樣本先算每個人的差（${la} − ${lb}），再考驗「差的平均是不是 0」，所以自由度是人數減 1。灰線連的是同一個人的兩次分數。`;}
    const rej=p<0.05;let msg=mode==='ind'?`${la}平均 ${f2(m1,2)}、${lb}平均 ${f2(m2,2)}，相差 ${f2(Math.abs(diff),2)}。`:`同一批 ${n1} 人，每個人的差（${la} − ${lb}）平均是 ${f2(diff,2)}。`;
    msg+=`t(${df})＝${f2(t,2)}，${c5.pEq(p)}，${rej?'小於 .05，拒絕虛無假設：'+(mode==='ind'?'兩組的平均數有顯著差異。':'前後的平均數有顯著差異。'):'不小於 .05，保留虛無假設：這樣的差距還在抽樣誤差會出現的範圍內。'}`;
    if(src==='pair'&&mode==='ind')msg+=' 注意：這是同一批人的資料，卻當成兩組不同的人來算。每個人原本程度的高低全被算進誤差，t 值會比相依樣本的算法小很多（講義資料是 9.00 掉到 4.28）。';
    if(src==='ind'&&mode==='pair')msg+=' 注意：正選和候補是不同的人，沒有誰和誰配成一對，不能用相依樣本；這裡算出來的數字沒有意義。';
    q('#c5tM').textContent=msg;};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c5tp]');if(b)load(b.dataset.c5tp);});
  segBind(w,'c5tm',v=>{mode=v;draw();});
  ['c5tA','c5tB'].forEach(id=>q('#'+id).addEventListener('input',draw));load('ind');
};

/* ---------- 概念 6：變異數分析（單因子可改資料；二因子展示講義結果） ---------- */
W.c5anova=(w)=>{
  const DEF=[[193,190,195,175,188],[148,170,172,168,165],[170,157,140,148,150]];
  // 表 5-7：方法（scrimmage、動作訓練）× 位置（投手、野手），每格 6 人
  const TWO=[[[29,30,24,23,28,29],[34,34,31,30,32,28]],[[29,34,34,38,28,29],[28,34,31,26,27,32]]],MN=['scrimmage','動作訓練'],PN=['投手','野手'];
  let view='one';const defs=[{id:'c5aK',label:'組內分散（每個人離自己組平均的距離 × 幾倍）',min:0.5,max:3,step:0.1,value:1,fmt:v=>'× '+v.toFixed(1)}];
  w.innerHTML=`<div class="widget-title"><strong>變異數分析：組間變異比組內變異</strong>${segHTML('c5av',[['one','單因子（表 5-6）'],['two','二因子（表 5-7）']],'one')}</div>
  <div id="c5aOne"><div class="slider-row">${[0,1,2].map(i=>`<label for="c5aG${i}"><span>第 ${i+1} 組臥舉最大重量</span><textarea class="nums" id="c5aG${i}" rows="2" spellcheck="false" style="min-height:52px"></textarea></label>`).join('')}</div>${sliders(defs)}<div class="in-row" style="margin:0"><button class="btn" type="button" id="c5aR">講義資料</button><span class="note">改數字，或拉「組內分散」，看 F 怎麼變。</span></div></div>
  ${SV('0 0 560 264','各組資料點與平均數')}<div class="tbl-wrap"><table class="wtbl" id="c5aT"></table></div><div id="c5aS"></div><p class="readout" id="c5aM"></p><p class="note" id="c5aN" style="margin:0"></p>`;
  const svg=w.querySelector('svg'),q=s=>w.querySelector(s);
  const row=(n,ss,df,ms,F,p,cls)=>`<tr${cls?` class="${cls}"`:''}><td>${n}</td><td>${f2(ss,2)}</td><td>${df}</td><td>${ms===null?'':f2(ms,2)}</td><td${F!==null&&p<0.05?' class="hl"':''}>${F===null?'':f2(F,2)}</td><td>${p===null?'':c5.p(p)}</td></tr>`;
  const HEAD='<tr><th>變異來源</th><th>平方和 SS</th><th>自由度</th><th>均方 MS</th><th>F</th><th>p</th></tr>';
  const one=()=>{const k=val(w,'c5aK');const raw=[0,1,2].map(i=>c5.nums(q('#c5aG'+i).value)).filter(g=>g.length);
    svg.innerHTML='';const fail=m=>{q('#c5aT').innerHTML='';q('#c5aS').innerHTML='';q('#c5aM').textContent=m;};
    if(raw.length<2||raw.some(g=>g.length<2))return fail('至少要有兩組，每組至少 2 個數字，用逗號或空白隔開。');
    const G=raw.map(g=>{const m=ST.mean(g);return g.map(v=>m+k*(v-m));});const all=G.flat(),N=all.length,J=G.length,gm=ST.mean(all);const ms=G.map(g=>ST.mean(g));
    const ssb=G.reduce((s,g,i)=>s+g.length*(ms[i]-gm)**2,0),ssw=G.reduce((s,g)=>s+c5.ss(g),0),msb=ssb/(J-1),msw=ssw/(N-J);if(!(msw>0))return fail('每一組裡的數字都一樣，組內變異是 0，F 算不出來。');const F=msb/msw,p=1-ST.pf(F,J-1,N-J);
    const st=niceStep(Math.max(1,Math.max(...all)-Math.min(...all)),5),lo=Math.floor(Math.min(...all)/st)*st,hi=Math.ceil(Math.max(...all)/st)*st;const L=48,R=540,T=22,B=222,y=v=>B-(v-lo)/(hi-lo)*(B-T),cw=(R-L)/J;
    c5.axY(svg,y,lo,hi,L,R,st);el('line',{x1:L,x2:R,y1:y(gm),y2:y(gm),class:'mean'},svg);c5.t(svg,R,y(gm)-6,'總平均 '+f2(gm,1),'end','fill:var(--accent);font-weight:500');
    G.forEach((g,i)=>{const cx=L+cw*(i+0.5),c={};g.forEach(v=>{const b=Math.round(y(v)/7);const j=c[b]=(c[b]||0)+1;el('circle',{cx:cx-34+(j-1)*11,cy:y(v),r:4.5,class:'pt',style:'opacity:.75'},svg);});
      el('line',{x1:cx-48,x2:cx+30,y1:y(ms[i]),y2:y(ms[i]),class:'median',style:'stroke-width:3'},svg);c5.t(svg,cx+36,y(ms[i])+4,f2(ms[i],1),'start','fill:var(--amber);font-weight:500');c5.t(svg,cx,B+22,`第 ${i+1} 組（${g.length} 人）`,'middle','fill:var(--ink)');});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    q('#c5aT').innerHTML=HEAD+row('組間',ssb,J-1,msb,F,p)+row('組內',ssw,N-J,msw,null,null)+row('全體',ssb+ssw,N-1,null,null,null,'sum');
    q('#c5aS').innerHTML=statsHTML(ms.map((m,i)=>[`第 ${i+1} 組平均`,f2(m,1),i===0?'med':'']).concat([['總平均',f2(gm,1),'mean'],[`F(${J-1}, ${N-J})`,f2(F,2)],['p',c5.p(p)]]));
    let msg=k!==1?`現在把每個人離自己組平均的距離變成 ${k.toFixed(1)} 倍，各組平均不變，所以組間均方還是 ${f2(msb,2)}，組內均方卻變成 ${f2(msw,2)}。`:'';
    msg+=`組間均方 ${f2(msb,2)} 是組內均方 ${f2(msw,2)} 的 ${f2(F,2)} 倍。${p<0.05?`假如各組母群體的平均數都相等，F 很少會這麼大（${c5.pEq(p)}），拒絕虛無假設：至少有一組的平均數和其他組不同。是哪幾組不同，要再做事後比較，這一章沒有教。`:`${c5.pEq(p)}，不小於 .05，保留虛無假設：各組平均數的差距，和組內每個人之間的差距比起來不夠大。`}`;
    q('#c5aM').textContent=msg;q('#c5aN').textContent='橫線是各組平均，虛線是總平均。組間變異看「橫線離虛線多遠」，組內變異看「點離自己的橫線多遠」。預設是講義表 5-6（講義圖 5-5 的 SPSS 輸出：F＝17.145）；臥舉重量講義沒有寫單位。';};
  const two=()=>{const n=6,cm=TWO.map(r=>r.map(c=>ST.mean(c))),all=TWO.flat(2),gm=ST.mean(all);const mM=TWO.map(r=>ST.mean(r.flat())),mP=[0,1].map(j=>ST.mean(TWO[0][j].concat(TWO[1][j])));
    const ssM=2*n*mM.reduce((s,m)=>s+(m-gm)**2,0),ssP=2*n*mP.reduce((s,m)=>s+(m-gm)**2,0),ssC=n*cm.flat().reduce((s,m)=>s+(m-gm)**2,0),ssI=ssC-ssM-ssP,ssE=TWO.flat().reduce((s,c)=>s+c5.ss(c),0),dfE=all.length-4,msE=ssE/dfE;const F=[ssM,ssP,ssI].map(v=>v/msE),P=F.map(v=>1-ST.pf(v,1,dfE));
    svg.innerHTML='';const L=48,R=540,T=22,B=222,lo=26,hi=33,y=v=>B-(v-lo)/(hi-lo)*(B-T),X=[L+(R-L)*0.28,L+(R-L)*0.72];
    c5.axY(svg,y,lo,hi,L,R,1);el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);PN.forEach((nm,j)=>c5.t(svg,X[j],B+22,nm,'middle','fill:var(--ink)'));
    [0,1].forEach(i=>{const cls=i?'ln2':'ln',col=i?'var(--amber)':'var(--accent)';el('line',{x1:X[0],y1:y(cm[i][0]),x2:X[1],y2:y(cm[i][1]),class:cls,style:'stroke-width:3'},svg);
      [0,1].forEach(j=>{el('circle',{cx:X[j],cy:y(cm[i][j]),r:6,class:i?'pt2':'pt'},svg);c5.t(svg,X[j]+(j?12:-12),y(cm[i][j])+5,f2(cm[i][j],2),j?'start':'end','fill:'+col+';font-weight:500');});
      c5.t(svg,X[1]+62,y(cm[i][1])+5,MN[i],'start','fill:'+col);});
    c5.t(svg,L,14,'守備測驗平均分數','start');
    q('#c5aT').innerHTML=HEAD+row('方法',ssM,1,ssM,F[0],P[0])+row('位置',ssP,1,ssP,F[1],P[1])+row('方法 × 位置',ssI,1,ssI,F[2],P[2])+row('誤差',ssE,dfE,msE,null,null)+row('全體',ssM+ssP+ssI+ssE,all.length-1,null,null,null,'sum');
    q('#c5aS').innerHTML=statsHTML([['scrimmage 平均',f2(mM[0],2),'mean'],['動作訓練平均',f2(mM[1],2),'med'],['投手平均',f2(mP[0],2)],['野手平均',f2(mP[1],2)],['交互作用 F(1, 20)',f2(F[2],2)],['交互作用 p',c5.p(P[2])]]);
    q('#c5aM').textContent=`兩條線交叉：投手練動作訓練比較高（${f2(cm[1][0],2)} 對 ${f2(cm[0][0],2)}），野手卻是 scrimmage 比較高（${f2(cm[0][1],2)} 對 ${f2(cm[1][1],2)}）。一高一低互相抵銷，所以方法和位置各自的主要效果都不顯著（p＝${c5.p(P[0])}、${c5.p(P[1])}），交互作用卻顯著（F＝${f2(F[2],2)}，p＝${c5.p(P[2])}）：哪種方法好，要看守哪個位置。`;
    q('#c5aN').textContent='這個畫面展示講義表 5-7（24 人，每格 6 人）的結果，資料不能改。兩條線如果平行，就沒有交互作用。這裡只描述四格平均的方向，沒有再做各位置內的比較。';};
  const draw=()=>{q('#c5aOne').hidden=view!=='one';(view==='one'?one:two)();};
  const reset=()=>{DEF.forEach((g,i)=>q('#c5aG'+i).value=g.join(', '));const s=q('#c5aK');s.value=1;s.dispatchEvent(new Event('input'));};
  q('#c5aR').addEventListener('click',reset);[0,1,2].forEach(i=>q('#c5aG'+i).addEventListener('input',draw));
  segBind(w,'c5av',v=>{view=v;draw();});bindSliders(w,defs,draw);DEF.forEach((g,i)=>q('#c5aG'+i).value=g.join(', '));draw();
};
