/* ===== 第 4 章 相關和預測：互動工具 =====
   資料：講義表 4-1（10 位受試者的體重、反手與正手引體向上）。統計量都在瀏覽器即時重算。
   示意資料（曲線、範圍限制）與影片 EP3 使用的點相同；「腳長與跑步速度」用固定亂數種子產生。 */
const C4={
  WT:[59.0,59.0,63.5,68.0,68.0,72.6,72.6,72.6,77.1,77.1],
  CH:[10,9,15,9,7,5,3,8,4,6],
  PU:[8,7,12,10,6,3,4,7,5,3],
  /* 固定小數位；負號用 −；−0.00 顯示成 0.00 */
  f(x,d=2){if(!Number.isFinite(x))return '—';let s=x.toFixed(d);if(/^-0(\.0+)?$/.test(s))s=s.slice(1);return s.replace('-','−');},
  /* 表格用：最多兩位小數，去掉尾端的 0 */
  n(x){if(!Number.isFinite(x))return '—';return String(Math.round(x*100)/100).replace('-','−');},
  raw(x,y){const n=x.length;let sx=0,sy=0,sxx=0,syy=0,sxy=0;for(let i=0;i<n;i++){sx+=x[i];sy+=y[i];sxx+=x[i]*x[i];syy+=y[i]*y[i];sxy+=x[i]*y[i];}
    const num=n*sxy-sx*sy,d1=n*sxx-sx*sx,d2=n*syy-sy*sy;return{n,sx,sy,sxx,syy,sxy,num,d1,d2,r:d1>1e-9&&d2>1e-9?num/Math.sqrt(d1*d2):NaN};},
  fit(x,y){const s=C4.raw(x,y),n=s.n,mx=s.sx/n,my=s.sy/n,b=s.d1>1e-9?s.num/s.d1:NaN,a=my-b*mx,sdx=Math.sqrt(s.d1/n/(n-1)),sdy=Math.sqrt(s.d2/n/(n-1));
    const res=x.map((v,i)=>y[i]-(a+b*v)),sse=res.reduce((t,e)=>t+e*e,0);
    return Object.assign(s,{mx,my,a,b,sdx,sdy,res,sse,r2:s.r*s.r,see1:sdy*Math.sqrt(Math.max(0,1-s.r*s.r)),see2:Math.sqrt(sse/(n-2))});},
  word(r){if(!Number.isFinite(r))return{dir:'算不出來',str:'—',long:'其中一個變項每個人都一樣，r 算不出來'};
    const a=Math.abs(r);if(a<0.1)return{dir:'零相關',str:'接近 0',long:'幾乎是零相關，看不出點往哪個方向排'};
    const dir=r>0?'正相關':'負相關';
    return{dir,str:a>=0.995?'完全相關':a>=0.7?'高相關':a>=0.3?'0.3–0.7 之間':'低於 0.3',
      long:dir+'；'+(a>=0.995?'點幾乎排成一直線，是完全相關':a>=0.7?'離 0 的距離在 0.7 以上，屬於高相關':a>=0.3?'離 0 的距離介於低相關（0.3）和高相關（0.7）之間':'離 0 的距離不到 0.3，關係很弱')};},
  chart(vb,label,id,mw=580){return `<div class="chart"><svg id="${id}" viewBox="${vb}" role="img" aria-label="${esc(label)}" style="max-width:${mw}px;margin:0 auto"></svg></div>`;},
  tx(svg,x,y,s,anchor,style){const t=el('text',{x,y,'text-anchor':anchor||'middle',style:'font-size:12px;'+(style||'')},svg);t.textContent=s;return t;},
  /* 座標框：o={L,R,T,B,xl,xh,yl,yh,xs,ys,xlab,ylab}，回傳 X、Y 換算函式 */
  frame(svg,o){const{L,R,T,B,xl,xh,yl,yh}=o;const X=v=>L+(v-xl)/(xh-xl)*(R-L),Y=v=>B-(v-yl)/(yh-yl)*(B-T);
    for(let t=Math.ceil(yl/o.ys-1e-9)*o.ys;t<=yh+1e-9;t+=o.ys){el('line',{x1:L,x2:R,y1:Y(t),y2:Y(t),class:'grid'},svg);C4.tx(svg,L-6,Y(t)+4,String(+t.toFixed(6)),'end');}
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);el('line',{x1:L,x2:L,y1:T,y2:B,class:'axis'},svg);
    for(let t=Math.ceil(xl/o.xs-1e-9)*o.xs;t<=xh+1e-9;t+=o.xs){el('line',{x1:X(t),x2:X(t),y1:B,y2:B+4,class:'axis'},svg);C4.tx(svg,X(t),B+17,String(+t.toFixed(6)));}
    if(o.xlab)C4.tx(svg,R,B+34,o.xlab,'end');if(o.ylab)C4.tx(svg,4,T-8,o.ylab,'start');
    return{X,Y};},
  /* 直線 y=a+bx 在框內的線段端點 */
  seg(a,b,x0,x1,yl,yh){if(!Number.isFinite(a)||!Number.isFinite(b))return null;let p=[[x0,a+b*x0],[x1,a+b*x1]];
    if(Math.abs(b)>1e-12){p=p.map(([x,y])=>y>yh?[(yh-a)/b,yh]:y<yl?[(yl-a)/b,yl]:[x,y]);}
    else if(a>yh||a<yl)return null;return p;}
};

/* ---------- 概念 1：散布圖與 r（表 4-1、圖 4-2、4-3、4-4） ---------- */
W.c4scatter=(w)=>{
  const SETS={
    chin:{x:C4.CH,y:C4.PU,xl:0,xh:16,yl:0,yh:14,xs:2,ys:2,sx:1,sy:1,xlab:'反手引體向上（下）',ylab:'正手引體向上（下）',who:'受試者',
      src:'資料：講義表 4-1（第 6 張）。講義圖 4-2 把正手放在橫軸，這裡依表 4-2 把反手當 X；兩軸對調，r 不變。'},
    wt:{x:C4.WT,y:C4.PU,xl:56,xh:80,yl:0,yh:14,xs:4,ys:2,sx:0.1,sy:1,xlab:'體重（公斤）',ylab:'正手引體向上（下）',who:'受試者',
      src:'資料：講義表 4-1。講義圖 4-3 的橫軸單位是磅（130–170），這裡用表 4-1 的公斤；換單位不會改變相關的方向和強度。'},
    zero:{x:[1,2,3,4,5,6,7,8,9],y:[4,5,2,7,3,6,3,4,5],xl:0,xh:10,yl:0,yh:8,xs:2,ys:2,sx:0.5,sy:0.5,xlab:'X',ylab:'Y',who:'點',
      src:'資料：講義圖 4-4（第 9 張）的 9 個點，座標是從圖上讀出來的。'}
  };
  const BX={L:44,R:488,T:26,B:290};
  let key='chin',S=SETS[key],xs=S.x.slice(),ys=S.y.slice();
  w.innerHTML=`<div class="widget-title"><strong>拖動圓點，看 r 怎麼變</strong><div class="controls">${segHTML('c4s',[['chin','反手×正手'],['wt','體重×正手'],['zero','零相關']],'chin')}<button class="btn" type="button" id="c4sR">回到講義資料</button></div></div>
  ${C4.chart('0 0 500 330','散布圖：可拖動的資料點','c4sSvg')}${C4.chart('0 0 500 66','相關係數 r 在 −1 到 +1 數線上的位置','c4sNl')}<div id="c4sS"></div><p class="readout" id="c4sM"></p><p class="note" id="c4sN" style="margin:0"></p>`;
  const svg=w.querySelector('#c4sSvg'),nl=w.querySelector('#c4sNl');let F,line,dots=[],labs=[];
  const snap=(v,s)=>+(Math.round(v/s)*s).toFixed(2),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const toV=ev=>{const r=svg.getBoundingClientRect(),vx=(ev.clientX-r.left)/r.width*500,vy=(ev.clientY-r.top)/r.height*330;
    return[clamp(snap(S.xl+(vx-BX.L)/(BX.R-BX.L)*(S.xh-S.xl),S.sx),S.xl,S.xh),clamp(snap(S.yl+(BX.B-vy)/(BX.B-BX.T)*(S.yh-S.yl),S.sy),S.yl,S.yh)];};
  const refresh=()=>{const s=C4.fit(xs,ys),base=C4.raw(S.x,S.y).r,wd=C4.word(s.r);
    xs.forEach((v,i)=>{dots[i].setAttribute('cx',F.X(v));dots[i].setAttribute('cy',F.Y(ys[i]));dots[i].setAttribute('aria-label',`第 ${i+1} 個${S.who}：X ${v}、Y ${ys[i]}`);labs[i].setAttribute('x',F.X(v));labs[i].setAttribute('y',F.Y(ys[i])-11);});
    const sg=C4.seg(s.a,s.b,S.xl,S.xh,S.yl,S.yh);if(sg){line.setAttribute('x1',F.X(sg[0][0]));line.setAttribute('y1',F.Y(sg[0][1]));line.setAttribute('x2',F.X(sg[1][0]));line.setAttribute('y2',F.Y(sg[1][1]));line.removeAttribute('visibility');}else line.setAttribute('visibility','hidden');
    /* r 的數線（講義圖 4-1） */
    nl.innerHTML='';const NX=v=>30+(v+1)/2*440;el('line',{x1:NX(-1),x2:NX(1),y1:30,y2:30,class:'axis',style:'stroke-width:2'},nl);
    [[-1,'完全相關'],[-0.7,'高相關'],[-0.3,'低相關'],[0,'零相關'],[0.3,'低相關'],[0.7,'高相關'],[1,'完全相關']].forEach(([v,l])=>{el('line',{x1:NX(v),x2:NX(v),y1:25,y2:35,class:'axis',style:'stroke-width:2'},nl);
      const an=v===-1?'start':v===1?'end':'middle',px=v===-1?NX(v)-14:v===1?NX(v)+14:NX(v);C4.tx(nl,px,48,(v>0?'+':'')+C4.f(v,1),an);C4.tx(nl,px,62,l,an,'font-size:11px');});
    if(Number.isFinite(s.r)){const mx=NX(s.r);el('path',{d:`M${mx-7} 13L${mx+7} 13L${mx} 27Z`,class:'pt2'},nl);C4.tx(nl,clamp(mx,60,440),10,'r＝'+C4.f(s.r,3),'middle','fill:var(--amber);font-weight:500');}
    const moved=xs.filter((v,i)=>v!==S.x[i]||ys[i]!==S.y[i]).length;
    w.querySelector('#c4sS').innerHTML=statsHTML([['相關係數 r',C4.f(s.r,3),'mean'],['方向',wd.dir],['強度（離 0 多遠）',wd.str],['人數 n',s.n]]);
    let msg;
    if(moved)msg=`你動了 ${moved} 個點，r 從 ${C4.f(base,3)} 變成 ${C4.f(s.r,3)}：${wd.long}。只有 ${s.n} 個點的時候，一個點的位置就能讓 r 變很多。`;
    else if(key==='chin')msg='r＝0.889（影片四捨五入成 0.89）：反手做得多的人，正手也做得多，點從左下排到右上，是正相關；離 0 的距離超過 0.7，屬於高相關。';
    else if(key==='wt')msg='r＝−0.639（影片四捨五入成 −0.64）：體重越重，正手拉得越少，點從左上掉到右下，是負相關。負號只代表方向；強度看離 0 多遠，0.64 介於低相關（0.3）和高相關（0.7）之間。';
    else msg='r＝0.058，幾乎是 0：點散成一團，看不出往哪個方向排，就是零相關。知道 X 是多少，也猜不出 Y。';
    w.querySelector('#c4sM').textContent=msg;
    w.querySelector('#c4sN').textContent=S.src+' 按住圓點拖動，或點一下圓點再按方向鍵。圓點上方的數字是編號，虛線是這些點的走向。';};
  const build=()=>{svg.innerHTML='';F=C4.frame(svg,Object.assign({},BX,S));line=el('line',{class:'dash'},svg);dots=[];labs=[];
    xs.forEach((_,i)=>{labs.push(C4.tx(svg,0,0,String(i+1),'middle','font-size:11px'));
      const c=el('circle',{r:7,class:'dot',tabindex:0,style:'touch-action:none'},svg);dots.push(c);
      c.addEventListener('pointerdown',ev=>{ev.preventDefault();c.setPointerCapture(ev.pointerId);c.classList.add('active');
        const mv=e2=>{[xs[i],ys[i]]=toV(e2);refresh();},up=()=>{c.classList.remove('active');c.removeEventListener('pointermove',mv);c.removeEventListener('pointerup',up);c.removeEventListener('pointercancel',up);};
        c.addEventListener('pointermove',mv);c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);});
      c.addEventListener('keydown',ev=>{const d={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[ev.key];if(!d)return;ev.preventDefault();
        xs[i]=clamp(snap(xs[i]+d[0]*S.sx,S.sx),S.xl,S.xh);ys[i]=clamp(snap(ys[i]+d[1]*S.sy,S.sy),S.yl,S.yh);refresh();});});
    refresh();};
  const reset=()=>{S=SETS[key];xs=S.x.slice();ys=S.y.slice();build();};
  segBind(w,'c4s',v=>{key=v;reset();});w.querySelector('#c4sR').addEventListener('click',reset);build();
};

/* ---------- 概念 2：計算表與原始分數公式（表 4-2） ---------- */
W.c4rcalc=(w)=>{
  const PRE={chin:{x:C4.CH,xn:'反手'},wt:{x:C4.WT,xn:'體重'}};let key='chin',X=C4.CH.slice(),Y=C4.PU.slice();
  w.innerHTML=`<div class="widget-title"><strong>計算表：一步一步算出 r</strong><div class="controls">${segHTML('c4c',[['chin','反手×正手（表 4-2）'],['wt','體重×正手']],'chin')}<button class="btn" type="button" id="c4cR">回到講義資料</button></div></div>
  <div class="tbl-wrap"><table class="wtbl" id="c4cT"></table></div><div class="formula" id="c4cF" style="white-space:normal;line-height:1.7"></div><div id="c4cS"></div><p class="readout" id="c4cM"></p><p class="note" id="c4cN" style="margin:0"></p>`;
  const T=w.querySelector('#c4cT'),q=k=>T.querySelector(`[data-c4q="${k}"]`),par=v=>v<0?'('+C4.n(v)+')':C4.n(v);
  const upd=()=>{const ok=X.every(Number.isFinite)&&Y.every(Number.isFinite);
    X.forEach((x,i)=>{q('x'+i).textContent=C4.n(x*x);q('y'+i).textContent=C4.n(Y[i]*Y[i]);q('p'+i).textContent=C4.n(x*Y[i]);});
    q('x0').classList.toggle('hl',key==='chin'&&X[0]===10);
    const s=C4.raw(X,Y);['sx','sxx','sy','syy','sxy'].forEach(k=>{q(k).textContent=ok?C4.n(s[k]):'—';});
    const FM=w.querySelector('#c4cF'),M=w.querySelector('#c4cM'),SB=w.querySelector('#c4cS');
    if(!ok){FM.innerHTML='每一格都要填數字，才能往下算。';SB.innerHTML='';M.textContent='有空白或不是數字的格子。把 X、Y 都填好，下面的算式會自動重算。';return;}
    const n=s.n,q1=Math.sqrt(Math.max(0,s.d1)),q2=Math.sqrt(Math.max(0,s.d2)),den=q1*q2,has=Number.isFinite(s.r);
    FM.innerHTML=`分子　NΣXY − ΣXΣY<br>　＝ ${n}×${par(s.sxy)} − ${par(s.sx)}×${par(s.sy)} ＝ ${C4.n(n*s.sxy)} − ${par(s.sx*s.sy)} ＝ <b>${C4.n(s.num)}</b><br>`+
      `左根號　√(NΣX² − (ΣX)²)<br>　＝ √(${n}×${C4.n(s.sxx)} − ${par(s.sx)}²) ＝ √(${C4.n(n*s.sxx)} − ${C4.n(s.sx*s.sx)}) ＝ √${C4.n(s.d1)} ＝ <b>${C4.f(q1,3)}</b><br>`+
      `右根號　√(NΣY² − (ΣY)²)<br>　＝ √(${n}×${C4.n(s.syy)} − ${par(s.sy)}²) ＝ √(${C4.n(n*s.syy)} − ${C4.n(s.sy*s.sy)}) ＝ √${C4.n(s.d2)} ＝ <b>${C4.f(q2,3)}</b><br>`+
      `r ＝ 分子 ÷ (左根號 × 右根號)<br>`+(has?`　＝ ${C4.n(s.num)} ÷ (${C4.f(q1,3)} × ${C4.f(q2,3)}) ＝ ${C4.n(s.num)} ÷ ${C4.f(den,1)} ＝ <i>${C4.f(s.r,3)}</i>`:'　分母是 0，算不出來');
    SB.innerHTML=statsHTML([['分子',C4.n(s.num)],['分母',has?C4.f(den,1):'0'],['r（三位小數）',C4.f(s.r,3),'mean'],['r（兩位小數）',C4.f(s.r,2),'med']]);
    const same=X.every((v,i)=>v===PRE[key].x[i])&&Y.every((v,i)=>v===C4.PU[i]),wd=C4.word(s.r);
    M.textContent=!has?'X 或 Y 每個人都一樣的時候，根號裡面是 0，r 算不出來：沒有差異，就談不上「一起變」。':
      same&&key==='chin'?'r＝0.889，四捨五入就是影片裡的 0.89：超過 0.7，高度正相關。改改看任何一格，下面每一步都會跟著重算。':
      same?'這次分子是負的（−1135.5），所以 r＝−0.639，也就是影片裡的 −0.64：體重越重，正手拉得越少。分母一定是正的，r 的正負號完全由分子決定。':
      `你改過資料了：r＝${C4.f(s.r,3)}，${wd.long}。算出來的 r 一定在 −1 到 +1 之間，超出去就是算錯。`;
    w.querySelector('#c4cN').textContent=key==='chin'?'講義表 4-2 第 1 列的 X² 印成 10，正確是 10²＝100（黃底那一格）。用 100，這一欄的總和才會是講義印的 686。':'講義沒有印這張計算表，這裡用表 4-1 的體重（公斤）照同樣的步驟算。';};
  const build=()=>{const inp=(a,i,v,lab)=>`<input type="number" step="any" inputmode="decimal" data-c4${a}="${i}" value="${v}" aria-label="第 ${i+1} 位的 ${lab}" style="width:54px">`;
    T.innerHTML=`<tr><th>參與者</th><th>X（${PRE[key].xn}）</th><th>X²</th><th>Y（正手）</th><th>Y²</th><th>XY</th></tr>`+
      X.map((v,i)=>`<tr><td>${i+1}</td><td>${inp('x',i,v,'X')}</td><td data-c4q="x${i}"></td><td>${inp('y',i,Y[i],'Y')}</td><td data-c4q="y${i}"></td><td data-c4q="p${i}"></td></tr>`).join('')+
      `<tr class="sum"><td>Σ</td><td data-c4q="sx"></td><td data-c4q="sxx"></td><td data-c4q="sy"></td><td data-c4q="syy"></td><td data-c4q="sxy"></td></tr>`;upd();};
  T.addEventListener('input',e=>{const t=e.target;if(t.dataset.c4x!==undefined)X[+t.dataset.c4x]=parseFloat(t.value);else if(t.dataset.c4y!==undefined)Y[+t.dataset.c4y]=parseFloat(t.value);else return;upd();});
  const reset=()=>{X=PRE[key].x.slice();Y=C4.PU.slice();build();};
  segBind(w,'c4c',v=>{key=v;reset();});w.querySelector('#c4cR').addEventListener('click',reset);build();
};

/* ---------- 概念 3：決定係數 r²（圖 4-5） ---------- */
W.c4r2=(w)=>{
  const rf=v=>{const s=v.toFixed(3);return C4.f(v,s.endsWith('0')?2:3);};
  const defs=[{id:'c4qr',label:'相關係數 r',min:-1,max:1,step:0.001,value:0.9,fmt:rf}];
  w.innerHTML=`<div class="widget-title"><strong>把 r 平方：能解釋幾格？</strong><span class="note">100 格＝Y 的總變異</span></div>${sliders(defs)}
  <div class="in-row" style="margin:0"><span class="note">直接代入：</span>${[['0.9','0.90（圖 4-5）'],['0.889','反手×正手 0.889'],['-0.64','體重×正手 −0.64'],['0.7','0.70'],['0.3','+0.30']].map(([v,l])=>`<button class="btn" type="button" data-c4qv="${v}">${l}</button>`).join('')}</div>
  ${C4.chart('0 0 500 236','100 格方格：r 平方對應的可解釋比例','c4qSvg',520)}<div id="c4qS"></div><p class="readout" id="c4qM"></p>`;
  const svg=w.querySelector('#c4qSvg'),sl=w.querySelector('#c4qr');
  const draw=()=>{const r=+sl.value,r2=r*r,k=Math.round(r2*100),d=(+r.toFixed(3)).toFixed(3).endsWith('0')?2:3;svg.innerHTML='';
    for(let i=0;i<100;i++)el('rect',{x:20+(i%10)*21,y:14+Math.floor(i/10)*21,width:19,height:19,rx:2,class:i<k?'pt':'',style:i<k?'':'fill:var(--soft);stroke:var(--line)'},svg);
    C4.tx(svg,262,74,k+'%','start','font-size:50px;fill:var(--accent);font-weight:500');C4.tx(svg,262,100,'可以解釋（深色的格子）','start','font-size:14px;fill:var(--ink)');
    C4.tx(svg,262,160,(100-k)+'%','start','font-size:34px;font-weight:500');C4.tx(svg,262,184,'解釋不了（例如誤差）','start','font-size:14px');
    C4.tx(svg,262,218,`r² ＝ ${r<0?'('+rf(r)+')':rf(r)}² ＝ ${C4.f(r2,d)}`,'start','font-size:13px;fill:var(--ink)');
    w.querySelector('#c4qS').innerHTML=statsHTML([['相關係數 r',rf(r)],['決定係數 r²',C4.f(r2,d),'mean'],['可以解釋',k+'%'],['解釋不了',(100-k)+'%','med']]);
    const key=r.toFixed(3);let msg;
    if(key==='0.900')msg='r＝0.90 不是「90% 準」。平方之後 r²＝0.81：長距離跑步成績可以解釋最大攝氧量總變異的 81%，剩下 19% 是它解釋不了的，例如誤差（講義圖 4-5）。';
    else if(key==='0.889')msg='表 4-1 的反手和正手：0.889²＝0.790，反手次數可以解釋正手次數變異的 79%，還有 21% 要靠別的原因。';
    else if(key==='-0.640')msg='表 4-1 的體重和正手：(−0.64)²＝0.41，體重可以解釋 41%。負號只是方向，平方之後就不見了；它比 +0.30（只解釋 9%）強得多。';
    else if(key==='0.700')msg='r＝0.70 已經算高相關，平方之後只有 0.49：只解釋了大約一半。';
    else if(key==='0.300')msg='r＝+0.30 平方之後是 0.09：只解釋 9%，剩下 91% 都解釋不了。';
    else msg=`r＝${rf(r)}，r²＝${C4.f(r2,d)}：X 可以解釋 Y 總變異的 ${k}%，剩下 ${100-k}% 解釋不了。${r<0?'負號只是方向，平方之後就不見了。':''}${Math.abs(r)<0.5&&Math.abs(r)>=0.1?' r 不到 0.5 的時候，能解釋的還不到四分之一。':''}`;
    w.querySelector('#c4qM').textContent=msg;};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c4qv]');if(!b)return;sl.value=b.dataset.c4qv;sl.dispatchEvent(new Event('input',{bubbles:true}));});
  bindSliders(w,defs,draw);draw();
};

/* ---------- 概念 4：相關係數的陷阱（圖 4-6、4-7；影片 EP3） ---------- */
W.c4trap=(w)=>{
  /* 與影片 ep_c4e3.js 相同的示意資料 */
  const CURVE=[[0.7,0.9],[1.4,3.9],[2.1,5.0],[2.8,6.4],[3.5,7.6],[4.2,8.1],[4.9,8.8],[5.6,8.0],[6.3,8.2],[7.0,7.1],[7.7,4.8],[8.4,3.5],[9.1,0.8]];
  const RANGE=[[1.2,3.5],[1.5,2.4],[1.6,3.0],[2.2,2.4],[2.4,3.3],[2.4,1.2],[3.2,3.5],[3.6,4.0],[4.0,4.5],[4.3,5.7],[4.5,3.6],[4.7,6.0],[4.9,4.6],[4.9,3.6],[5.2,7.2],[5.6,5.4],[5.6,3.6],[5.7,4.5],[5.9,7.3],[6.3,3.9],[6.3,5.6],[6.4,6.2],[6.4,7.3],[7.0,7.0],[7.3,5.4],[7.6,7.9],[8.2,8.7],[8.6,7.7],[8.7,7.1],[8.9,8.1]];
  /* 假想的 30 位小學生：腳長（公分）、跑步速度（公尺／秒）、年級組別。固定亂數種子 356 */
  const KIDS=(()=>{const r=ST.rng(356),M=[[19,4.2],[21.5,5.0],[24,5.8]],p=[];for(let g=0;g<3;g++)for(let i=0;i<10;i++)p.push([Math.round((M[g][0]+ST.rnorm(r)*0.8)*10)/10,Math.round((M[g][1]+ST.rnorm(r)*0.3)*100)/100,g]);return p;})();
  const GN=['低年級','中年級','高年級'],GC=['pt','pt2','must'],GV=['var(--accent)','var(--amber)','var(--mustard)'];
  const SC=[['curve','曲線關係'],['range','範圍限制'],['outlier','一個離群的點'],['cause','相關不等於因果']];
  const NOTE={curve:'示意資料：和影片 EP3 相同的 13 個點，不是講義的數字。講義圖 4-6 畫的是喚醒水準與運動成績表現。',
    range:'示意資料：和影片 EP3 相同的 30 個點。0.84 與 0.22 是由這份資料算出來的，不是講義圖 4-7 的數字。',
    outlier:'資料：講義表 4-1 的反手與正手引體向上。這個情境是補充，影片沒有講。',
    cause:'示意資料：用固定亂數種子產生的 30 位假想小學生。講義沒有這個例子，是影片的補充。'};
  let sc='curve',cv='all',lo=5,hi=7,out=new Set(),kv='all';
  const rdefs=[{id:'c4tlo',label:'只看 X 從',min:0,max:10,step:0.5,value:5,fmt:v=>v.toFixed(1)},{id:'c4thi',label:'到',min:0,max:10,step:0.5,value:7,fmt:v=>v.toFixed(1)}];
  w.innerHTML=`<div class="widget-title"><strong>這個 r 可以直接相信嗎？</strong><button class="btn" type="button" id="c4tR">重設這個情境</button></div>
  <div class="tagrow">${SC.map(([k,l])=>`<button type="button" class="tag" data-c4t="${k}" aria-pressed="${k===sc}">${l}</button>`).join('')}</div><div id="c4tC"></div>
  ${C4.chart('0 0 500 320','散布圖：各種會誤導的情境','c4tSvg')}<div class="legend" id="c4tL"></div><div id="c4tS"></div><p class="readout" id="c4tM"></p><p class="note" id="c4tN" style="margin:0"></p>`;
  const svg=w.querySelector('#c4tSvg'),Cb=w.querySelector('#c4tC'),BX={L:44,R:488,T:26,B:280};
  const cor=p=>C4.fit(p.map(v=>v[0]),p.map(v=>v[1]));
  const fitLine=(F,f,x0,x1,o,cls)=>{const sg=C4.seg(f.a,f.b,x0,x1,o.yl,o.yh);if(sg)el('line',{x1:F.X(sg[0][0]),y1:F.Y(sg[0][1]),x2:F.X(sg[1][0]),y2:F.Y(sg[1][1]),class:cls},svg);};
  const tagNote=s=>C4.tx(svg,BX.R,BX.T-8,s,'end');
  const setStats=a=>{w.querySelector('#c4tS').innerHTML=statsHTML(a);},setMsg=s=>{w.querySelector('#c4tM').textContent=s;},setLegend=h=>{w.querySelector('#c4tL').innerHTML=h;};
  const draw=()=>{svg.innerHTML='';w.querySelector('#c4tN').textContent=NOTE[sc];setLegend('');
    if(sc==='curve'){const o={xl:0,xh:10,yl:0,yh:10,xs:2,ys:2,xlab:'變項 X',ylab:'變項 Y'},F=C4.frame(svg,Object.assign({},BX,o));tagNote('示意資料');
      const inS=p=>cv==='all'||(cv==='up'?p[0]<=4.9:p[0]>=4.9),sub=CURVE.filter(inS),f=cor(sub),fa=cor(CURVE),fu=cor(CURVE.filter(p=>p[0]<=4.9)),fd=cor(CURVE.filter(p=>p[0]>=4.9));
      fitLine(F,f,Math.min(...sub.map(p=>p[0]))-0.3,Math.max(...sub.map(p=>p[0]))+0.3,o,'ln');
      CURVE.forEach(p=>el('circle',{cx:F.X(p[0]),cy:F.Y(p[1]),r:6,class:inS(p)?'pt2':'out',style:'cursor:default'},svg));
      setLegend('<span><i style="background:var(--amber)"></i>納入計算的點</span><span><i style="background:var(--accent)"></i>硬畫的一條直線</span>');
      setStats([['全部 13 點的 r',C4.f(fa.r,2),cv==='all'?'mean':''],['上升段 7 點的 r',C4.f(fu.r,2),cv==='up'?'mean':''],['下降段 7 點的 r',C4.f(fd.r,2),cv==='down'?'mean':'']]);
      setMsg(cv==='all'?'13 個點排成先升後降的曲線，X 和 Y 明明有關係，可是硬畫一條直線幾乎是平的，r＝0.00。r 只量得出「直線」關係。像講義圖 4-6 的喚醒水準和運動成績表現：太低、太高都不好，算 r 會以為沒關係。':
        cv==='up'?'只看上升的那一段（X 到 4.9 為止），r＝0.97，是很強的正相關：X 越大，Y 越大。':'只看下降的那一段（X 從 4.9 起），r＝−0.95，是很強的負相關。前後兩段方向相反，合在一起互相抵消，r 才會接近 0。所以算 r 之前要先看散布圖。');}
    if(sc==='range'){const o={xl:0,xh:10,yl:0,yh:10,xs:2,ys:2,xlab:'變項 X',ylab:'變項 Y'},F=C4.frame(svg,Object.assign({},BX,o));tagNote('示意資料');
      const ok=lo<hi,inS=p=>ok&&p[0]>=lo&&p[0]<=hi,sub=RANGE.filter(inS),fa=cor(RANGE),f=sub.length>=3?cor(sub):null;
      if(ok)el('rect',{x:F.X(lo),y:BX.T,width:F.X(hi)-F.X(lo),height:BX.B-BX.T,class:'area-r'},svg);
      fitLine(F,fa,0.5,9.5,o,'dash');if(f&&Number.isFinite(f.r))fitLine(F,f,lo,hi,o,'ln2');
      RANGE.forEach(p=>el('circle',{cx:F.X(p[0]),cy:F.Y(p[1]),r:5.5,class:inS(p)?'pt2':'out',style:'cursor:default'},svg));
      setLegend('<span><i style="background:var(--amber)"></i>範圍內的人</span><span><i style="background:var(--surface);border:1px solid var(--ink)"></i>範圍外的人</span><span><i style="background:var(--muted)"></i>虛線：全體的走向</span>');
      setStats([['全體 30 人的 r',C4.f(fa.r,2)],['範圍內的 r',f?C4.f(f.r,2):'—','med'],['範圍內人數',sub.length],['X 的範圍',ok?lo.toFixed(1)+'–'+hi.toFixed(1):'—']]);
      setMsg(!ok?'下限要小於上限。':!f?'範圍內不到 3 個人，算 r 沒有意義。把範圍拉寬一點。':
        lo===5&&hi===7?'30 人全部一起看，r＝0.84。只挑 X 介於 5.0 到 7.0 的 10 人，r 掉到 0.22。範圍一縮小，大家的 X 都差不多，點就散成一團。就像只看校隊，實力都差不多；相關低，不代表這兩件事沒有關係。':
        `全體 30 人的 r 是 0.84；只看 X 介於 ${lo.toFixed(1)} 到 ${hi.toFixed(1)} 的 ${sub.length} 人，r＝${C4.f(f.r,2)}。${hi-lo>=7?'範圍放寬到接近全部，r 就回到全體的水準。':'範圍越窄，r 通常掉得越多；把範圍拉寬，r 會慢慢回到 0.84 附近。'}`);}
    if(sc==='outlier'){const o={xl:0,xh:16,yl:0,yh:14,xs:2,ys:2,xlab:'反手引體向上（下）',ylab:'正手引體向上（下）'},F=C4.frame(svg,Object.assign({},BX,o));tagNote('表 4-1');
      const P=C4.CH.map((v,i)=>[v,C4.PU[i],i]),sub=P.filter(p=>!out.has(p[2])),fa=cor(P),f=sub.length>=3?cor(sub):null;
      if(f)fitLine(F,f,0,16,o,'dash');
      P.forEach(p=>{C4.tx(svg,F.X(p[0]),F.Y(p[1])-11,String(p[2]+1),'middle','font-size:11px');
        el('circle',{cx:F.X(p[0]),cy:F.Y(p[1]),r:7,class:out.has(p[2])?'out':'pt',style:'cursor:pointer',tabindex:0,role:'button','data-c4o':p[2],'aria-label':`第 ${p[2]+1} 位：反手 ${p[0]}、正手 ${p[1]}，${out.has(p[2])?'已拿掉':'計算中'}`},svg);});
      setLegend('<span><i style="background:var(--accent)"></i>納入計算</span><span><i style="background:var(--surface);border:1px solid var(--ink)"></i>被拿掉的人（再點一下放回來）</span>');
      const gone=[...out].sort((a,b)=>a-b).map(i=>i+1);
      setStats([['目前的 r',f?C4.f(f.r,2):'—','mean'],['10 人全部的 r',C4.f(fa.r,2)],['納入人數',sub.length],['拿掉的人',gone.length?'第 '+gone.join('、')+' 位':'沒有']]);
      setMsg(!f?'至少要留 3 個人才能算。把人放回來。':!gone.length?'表 4-1 的 10 人，r＝0.89。第 3 位（反手 15、正手 12）離其他人很遠。點他一下把他拿掉，看 r 剩多少；再試試只拿掉第 4 位。':
        gone.join()==='3'?'拿掉第 3 位，r 從 0.89 掉到 0.80。只有 10 個人的時候，一個離群的點就能把 r 撐高不少。報告 r 之前先看散布圖，確認不是一兩個點撐出來的。':
        gone.join()==='4'?'拿掉第 4 位（反手 9、正手 10，離那條線最遠的人），r 從 0.89 升到 0.92。同樣是拿掉一個人，有的讓 r 變低，有的讓 r 變高。':
        `拿掉第 ${gone.join('、')} 位，剩 ${sub.length} 人，r＝${C4.f(f.r,2)}（10 人全部是 0.89）。人數越少，每一個點對 r 的影響越大。`);}
    if(sc==='cause'){const o={xl:17,xh:27,yl:3.5,yh:7,xs:2,ys:0.5,xlab:'腳長（公分）',ylab:'跑步速度（公尺／秒）'},F=C4.frame(svg,Object.assign({},BX,o));tagNote('示意資料・假想的例子');
      const fa=cor(KIDS),fg=[0,1,2].map(g=>cor(KIDS.filter(p=>p[2]===g)));
      if(kv==='all')fitLine(F,fa,17.5,26.5,o,'ln');else [0,1,2].forEach(g=>{const xsg=KIDS.filter(p=>p[2]===g).map(p=>p[0]);fitLine(F,fg[g],Math.min(...xsg)-0.3,Math.max(...xsg)+0.3,o,'dash');});
      KIDS.forEach(p=>el('circle',{cx:F.X(p[0]),cy:F.Y(p[1]),r:5.5,class:kv==='all'?'pt':GC[p[2]]},svg));
      setLegend(kv==='all'?'<span><i style="background:var(--accent)"></i>30 位小學生，不分年級</span>':GN.map((n,g)=>`<span><i style="background:${GV[g]}"></i>${n}</span>`).join('')+'<span>虛線：各年級自己的走向</span>');
      setStats([['全體 30 人的 r',C4.f(fa.r,2),kv==='all'?'mean':'']].concat(GN.map((n,g)=>[n+' 10 人的 r',C4.f(fg[g].r,2),kv==='grp'?'med':''])));
      setMsg(kv==='all'?`假想的例子：30 位小學生，腳越長，跑得越快，r＝${C4.f(fa.r,2)}。可以說「腳大讓人跑得快」嗎？按「依年級分開看」。`:
        `同一個年級裡面，腳長和速度幾乎沒有關係（r 是 ${fg.map(g=>C4.f(g.r,2)).join('、')}）。全體的 ${C4.f(fa.r,2)} 是年紀造成的：`+'年紀大的孩子腳大，也跑得快。兩件事一起變，不代表其中一件造成另一件，這就是相關不等於因果。');}
  };
  const controls=()=>{
    if(sc==='curve')Cb.innerHTML=`<div class="controls"><span class="note">算哪些點：</span>${segHTML('c4tv',[['all','全部'],['up','只看上升段'],['down','只看下降段']],cv)}</div>`;
    if(sc==='range'){rdefs[0].value=lo;rdefs[1].value=hi;Cb.innerHTML=sliders(rdefs)+`<div class="in-row" style="margin:6px 0 0"><button class="btn" type="button" data-c4tr="5,7">只看中間（5.0–7.0）</button><button class="btn" type="button" data-c4tr="0,10">看全部（0–10）</button></div>`;
      bindSliders(w,rdefs,()=>{lo=val(w,'c4tlo');hi=val(w,'c4thi');draw();});}
    if(sc==='outlier')Cb.innerHTML=`<div class="in-row" style="margin:0"><span class="note">點圖上的圓點，或：</span><button class="btn" type="button" data-c4to="2">只拿掉第 3 位</button><button class="btn" type="button" data-c4to="3">只拿掉第 4 位</button><button class="btn" type="button" data-c4to="">全部放回</button></div>`;
    if(sc==='cause')Cb.innerHTML=`<div class="controls"><span class="note">怎麼看：</span>${segHTML('c4tk',[['all','全部一起看'],['grp','依年級分開看']],kv)}</div>`;};
  const resetSc=()=>{cv='all';lo=5;hi=7;out=new Set();kv='all';controls();draw();};
  segBind(w,'c4tv',v=>{cv=v;draw();});segBind(w,'c4tk',v=>{kv=v;draw();});
  w.addEventListener('click',e=>{const t=e.target.closest('[data-c4t]');if(t){sc=t.dataset.c4t;w.querySelectorAll('[data-c4t]').forEach(b=>b.setAttribute('aria-pressed',b===t?'true':'false'));resetSc();return;}
    const rr=e.target.closest('[data-c4tr]');if(rr){[lo,hi]=rr.dataset.c4tr.split(',').map(Number);controls();draw();return;}
    const ob=e.target.closest('[data-c4to]');if(ob){out=new Set(ob.dataset.c4to===''?[]:[+ob.dataset.c4to]);draw();return;}
    const oc=e.target.closest('[data-c4o]');if(oc){const i=+oc.dataset.c4o;if(out.has(i))out.delete(i);else out.add(i);draw();}});
  svg.addEventListener('keydown',e=>{const oc=e.target.closest('[data-c4o]');if(oc&&(e.key==='Enter'||e.key===' ')){e.preventDefault();const i=+oc.dataset.c4o;if(out.has(i))out.delete(i);else out.add(i);draw();const n2=svg.querySelector(`[data-c4o="${i}"]`);if(n2)n2.focus();}});
  w.querySelector('#c4tR').addEventListener('click',resetSc);controls();draw();
};

/* ---------- 概念 5：迴歸直線、殘差、估計標準誤（表 4-1；影片 EP4） ---------- */
W.c4reg=(w)=>{
  const X=C4.CH,Y=C4.PU,f=C4.fit(X,Y);let sel=3,mode='1';
  const defs=[{id:'c4gx',label:'新的人反手做幾下（X）',min:0,max:18,step:1,value:12,fmt:v=>v+' 下'}];
  w.innerHTML=`<div class="widget-title"><strong>迴歸直線：用反手預測正手</strong><button class="btn" type="button" id="c4gR">回到影片的例子</button></div>${sliders(defs)}
  <div class="controls"><span class="note">估計標準誤的算法：</span>${segHTML('c4gm',[['1','sY×√(1−r²)'],['2','√(SSE÷(n−2))']],'1')}</div>
  ${C4.chart('0 0 500 340','散布圖、迴歸直線、殘差與預測值','c4gSvg')}
  <div class="legend"><span><i style="background:var(--ink)"></i>迴歸直線</span><span><i style="background:var(--amber)"></i>殘差（點到線的垂直距離）</span><span><i style="background:var(--mustard)"></i>預測值，上下各一個估計標準誤</span></div>
  <div class="formula" id="c4gF" style="white-space:normal;line-height:1.7"></div><div id="c4gS"></div><p class="readout" id="c4gM"></p><p class="note" style="margin:0">資料：講義表 4-1。點任何一個圓點，可以看那位受試者的殘差。小凱（反手 12 下）是影片裡的虛構人物。講義圖 4-9 示範殘差用的是另一條線（用體重預測正手），見「動手算」第 6 節。</p>`;
  const svg=w.querySelector('#c4gSvg'),o={L:44,R:488,T:26,B:290,xl:0,xh:18,yl:0,yh:16,xs:2,ys:2,xlab:'反手引體向上（下）',ylab:'正手引體向上（下）'};
  const draw=()=>{const x=val(w,'c4gx'),see=mode==='1'?f.see1:f.see2,yp=f.a+f.b*x,pred=v=>f.a+f.b*v;svg.innerHTML='';const F=C4.frame(svg,o);
    /* 直線上下各一個估計標準誤的帶狀範圍 */
    const x0=Math.max(0,(see-f.a)/f.b),pts=[[0,f.a+see],[18,pred(18)+see],[18,pred(18)-see],[x0,Math.max(0,pred(x0)-see)]];if(x0>0)pts.push([0,0]);
    el('path',{d:pathOf(pts.map(p=>[F.X(p[0]),F.Y(Math.min(o.yh,p[1]))]))+'Z',class:'area-r'},svg);
    el('line',{x1:F.X(0),y1:F.Y(pred(0)),x2:F.X(18),y2:F.Y(pred(18)),class:'fit'},svg);
    X.forEach((v,i)=>el('line',{x1:F.X(v),x2:F.X(v),y1:F.Y(Y[i]),y2:F.Y(pred(v)),class:'ln2',style:i===sel?'stroke-width:4':'stroke-width:1.5'},svg));
    /* 預測值 */
    el('line',{x1:F.X(x),x2:F.X(x),y1:F.Y(0),y2:F.Y(yp),class:'dash'},svg);el('line',{x1:F.X(0),x2:F.X(x),y1:F.Y(yp),y2:F.Y(yp),class:'dash'},svg);
    const ya=Math.max(0,yp-see),yb=Math.min(o.yh,yp+see);el('line',{x1:F.X(x),x2:F.X(x),y1:F.Y(ya),y2:F.Y(yb),class:'lnm',style:'stroke-width:4'},svg);
    [ya,yb].forEach(v=>el('line',{x1:F.X(x)-7,x2:F.X(x)+7,y1:F.Y(v),y2:F.Y(v),class:'lnm'},svg));
    X.forEach((v,i)=>{C4.tx(svg,F.X(v),F.Y(Y[i])+(Y[i]>=pred(v)?-11:19),String(i+1),'middle','font-size:11px');
      el('circle',{cx:F.X(v),cy:F.Y(Y[i]),r:i===sel?7.5:6,class:i===sel?'pt2':'pt',style:'cursor:pointer',tabindex:0,role:'button','data-c4g':i,'aria-label':`第 ${i+1} 位：反手 ${v}、正手 ${Y[i]}`},svg);});
    const cx=F.X(x),cy=F.Y(yp);el('path',{d:`M${cx} ${cy-9}L${cx+9} ${cy}L${cx} ${cy+9}L${cx-9} ${cy}Z`,class:'must',style:'stroke:var(--ink);stroke-width:1.5'},svg);
    C4.tx(svg,x>=14?cx-13:cx+13,cy+(x>=14?-10:20),'Y′＝'+C4.f(yp,1),x>=14?'end':'start','fill:var(--ink);font-weight:500');
    const k=f.res.filter(e=>Math.abs(e)<=see).length,e=f.res[sel],ps=pred(X[sel]);
    w.querySelector('#c4gF').innerHTML=`斜率 b ＝ r × sY ÷ sX ＝ ${C4.f(f.r,3)} × ${C4.f(f.sdy,3)} ÷ ${C4.f(f.sdx,3)} ＝ <b>${C4.f(f.b,3)}</b><br>`+
      `截距 a ＝ Y 平均 − b × X 平均 ＝ ${C4.n(f.my)} − ${C4.f(f.b,3)} × ${C4.n(f.mx)} ＝ <b>${C4.f(f.a,2)}</b><br>`+
      `預測 Y′ ＝ ${C4.f(f.b,3)} × ${x} ＋ ${C4.f(f.a,2)} ＝ <i>${C4.f(yp,1)}</i><br>`+
      (mode==='1'?`估計標準誤 ＝ sY × √(1 − r²) ＝ ${C4.f(f.sdy,3)} × √(1 − ${C4.f(f.r2,3)}) ＝ <i>${C4.f(see,2)}</i>`:`估計標準誤 ＝ √(殘差平方和 ÷ (n − 2)) ＝ √(${C4.f(f.sse,2)} ÷ ${f.n-2}) ＝ <i>${C4.f(see,2)}</i>`);
    w.querySelector('#c4gS').innerHTML=statsHTML([['預測值 Y′',C4.f(yp,1)+' 下','mean'],['估計標準誤',C4.f(see,2)+' 下','med'],['Y′ 上下各一個',C4.f(Math.max(0,yp-see),1)+'–'+C4.f(yp+see,1)],['殘差在範圍內',k+' / '+f.n+' 人'],['r',C4.f(f.r,3)],['r²',C4.f(f.r2,3)]]);
    w.querySelector('#c4gM').textContent=`反手 ${x} 下，代進 Y′＝0.756X＋0.75，預測正手 ${C4.f(yp,1)} 下。預測不會剛剛好：上下各留一個估計標準誤（${C4.f(see,2)} 下），大約是 ${C4.f(Math.max(0,yp-see),1)} 到 ${C4.f(yp+see,1)} 下；表 4-1 的 10 人裡，有 ${k} 人的實際成績落在各自預測值的上下 ${C4.f(see,2)} 下以內。`+
      `第 ${sel+1} 位：反手 ${X[sel]} 下，預測 ${C4.f(ps,1)} 下，實際 ${Y[sel]} 下，殘差 ${e>=0?'+':''}${C4.f(e,1)} 下（點在線的${e>=0?'上':'下'}方）。`+
      (mode==='2'?'這個 1.43 是 Excel 的 STEYX 和 SPSS 迴歸報表的算法：殘差平方和除以 n−2＝8；影片的 1.35 等於除以 n−1＝9。':'')+
      (x<3||x>15?'注意：表 4-1 的反手次數只有 3 到 15 下，超出這個範圍的預測不可靠。':'');};
  const pick=i=>{sel=i;draw();const n2=svg.querySelector(`[data-c4g="${i}"]`);return n2;};
  svg.addEventListener('click',e=>{const c=e.target.closest('[data-c4g]');if(c)pick(+c.dataset.c4g);});
  svg.addEventListener('keydown',e=>{const c=e.target.closest('[data-c4g]');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();const n2=pick(+c.dataset.c4g);if(n2)n2.focus();}});
  segBind(w,'c4gm',v=>{mode=v;draw();});
  w.querySelector('#c4gR').addEventListener('click',()=>{sel=3;mode='1';w.querySelectorAll('[data-c4gm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c4gm==='1'?'true':'false'));const sl=w.querySelector('#c4gx');sl.value=12;sl.dispatchEvent(new Event('input',{bubbles:true}));});
  bindSliders(w,defs,draw);draw();
};
