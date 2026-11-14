/* ---------- W11: leak 資料洩漏 ---------- */
W.leak=(w)=>{
  const N=200,K=10,F=5;let seed=11,flow='leak';
  const defs=[{id:'lkp',label:'雜訊特徵的個數',min:20,max:500,step:20,value:200}];
  w.innerHTML=`<div class="widget-title"><strong>特徵全是雜訊，交叉驗證卻說模型很準</strong>${segHTML('lkf',[['leak','先挑特徵，再交叉驗證'],['ok','每一折內才挑特徵']],'leak')}</div>
  ${sliders(defs)}<div class="in-row"><button class="btn" type="button" id="lkre">重新抽樣</button><span class="note">模擬資料：${N} 人，結果 0/1 各半，所有特徵都是與結果無關的亂數。分類器：挑出與結果相關最高的 ${K} 個特徵，標準化後相加。</span></div>
  ${SV('0 0 640 190','三種做法得到的 AUC 長條圖')}<div id="lkS"></div><p class="readout" id="lkM"></p>`;
  const svg=w.querySelector('svg');
  function gen(n,p,r){const X=new Float32Array(n*p);for(let i=0;i<n*p;i++)X[i]=ST.rnorm(r);const y=new Uint8Array(n);for(let i=0;i<n;i++)y[i]=i<n/2?1:0;
    for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=y[i];y[i]=y[j];y[j]=t;}return{X,y,n,p};}
  function fitStats(D,idx){const X=D.X,y=D.y,p=D.p,m=idx.length;let my=0;for(let a=0;a<m;a++)my+=y[idx[a]];my/=m;let syy=0;for(let a=0;a<m;a++)syy+=(y[idx[a]]-my)**2;
    const c=new Float64Array(p),mu=new Float64Array(p),sd=new Float64Array(p);
    for(let j=0;j<p;j++){let s=0;for(let a=0;a<m;a++)s+=X[idx[a]*p+j];const mx=s/m;let sxx=0,sxy=0;for(let a=0;a<m;a++){const i=idx[a],d=X[i*p+j]-mx;sxx+=d*d;sxy+=d*(y[i]-my);}mu[j]=mx;sd[j]=Math.sqrt(sxx/(m-1));c[j]=sxy/Math.sqrt(sxx*syy);}
    return{c,mu,sd};}
  const topK=c=>Array.from(c.keys()).sort((a,b)=>Math.abs(c[b])-Math.abs(c[a])).slice(0,K);
  const score=(D,i,sel,st)=>{let s=0;for(const j of sel)s+=Math.sign(st.c[j])*(D.X[i*D.p+j]-st.mu[j])/st.sd[j];return s;};
  function auc(sc,y){const o=sc.map((v,i)=>i).sort((a,b)=>sc[a]-sc[b]);let r1=0,n1=0;o.forEach((i,k)=>{if(y[i]){r1+=k+1;n1++;}});const n0=sc.length-n1;return(r1-n1*(n1+1)/2)/(n1*n0);}
  function run(p){const r=ST.rng(seed*1009+p);const D=gen(N,p,r);const all=Array.from({length:N},(_,i)=>i);const stAll=fitStats(D,all),selAll=topK(stAll.c);
    const cv=leaky=>{const sc=new Array(N);for(let f=0;f<F;f++){const tr=all.filter(i=>i%F!==f),te=all.filter(i=>i%F===f);const st=fitStats(D,tr);const sel=leaky?selAll:topK(st.c);te.forEach(i=>{sc[i]=score(D,i,sel,st);});}return auc(sc,D.y);};
    const D2=gen(N,p,r);const sc2=[];for(let i=0;i<N;i++)sc2.push(score(D2,i,selAll,stAll));
    return{leak:cv(true),ok:cv(false),fresh:auc(sc2,D2.y)};}
  const txt=(x,y,s,anchor,style)=>{const t=el('text',{x,y,'text-anchor':anchor||'start'},svg);if(style)t.setAttribute('style',style);t.textContent=s;return t;};
  const draw=()=>{const p=val(w,'lkp');const A=run(p);svg.innerHTML='';const L=206,R=600,x=v=>L+v*(R-L);
    [0,0.25,0.5,0.75,1].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:18,y2:150,class:'grid'},svg);txt(x(t),166,t.toFixed(2),'middle');});
    el('line',{x1:x(0.5),x2:x(0.5),y1:10,y2:150,style:'stroke:var(--muted);stroke-dasharray:4 4'},svg);txt(x(0.5)+5,184,'0.5 等於亂猜','middle');
    [['leak','先挑特徵，再交叉驗證',A.leak,'var(--bad)'],['ok','每一折內才挑特徵',A.ok,'var(--ok)'],['fresh','同一個模型用在全新資料',A.fresh,'var(--muted)']].forEach(([k,l,v,c],i)=>{const yy=28+i*42;
      txt(L-10,yy+17,l,'end',k===flow?'fill:var(--ink);font-weight:600':'');el('rect',{x:L,y:yy,width:Math.max(1,x(v)-L),height:26,style:`fill:${c};opacity:${k===flow||k==='fresh'?.85:.35}`},svg);txt(x(v)+6,yy+18,v.toFixed(2),'start','fill:var(--ink);font-weight:600');});
    w.querySelector('#lkS').innerHTML=statsHTML([['先挑再驗證 AUC',A.leak.toFixed(2),flow==='leak'?'med':''],['折內挑特徵 AUC',A.ok.toFixed(2),flow==='ok'?'mean':''],['全新資料 AUC',A.fresh.toFixed(2)],['特徵數／人數',p+' / '+N]]);
    w.querySelector('#lkM').textContent=flow==='leak'?`先用全部 ${N} 人挑出 ${K} 個「最相關」的特徵，再做五折交叉驗證，AUC 是 ${A.leak.toFixed(2)}。特徵全是亂數，這個數字來自挑特徵時已經看過每一折的答案。同一個模型拿到全新資料只有 ${A.fresh.toFixed(2)}。把特徵數往右拖，虛高得更厲害。`:`每一折只用訓練的那四份挑特徵，AUC 是 ${A.ok.toFixed(2)}，落在 0.5 附近，和全新資料上的 ${A.fresh.toFixed(2)} 是同一回事。挑特徵、補值、標準化都算前處理，都要放在交叉驗證裡面。`;};
  segBind(w,'lkf',v=>{flow=v;draw();});w.querySelector('#lkre').addEventListener('click',()=>{seed++;draw();});
  bindSliders(w,defs,draw);draw();
};
