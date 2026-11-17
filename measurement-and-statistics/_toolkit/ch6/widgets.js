/* ===== 第 6 章　信度與效度的理論：互動工具 ===== */

/* ---------- c6truescore：觀察變異數＝真實變異數＋誤差變異數（講義表 6-1） ---------- */
W.c6truescore=(w)=>{
  const defs=[{id:'c6tsT',label:'真實變異數',min:10,max:200,step:0.1,value:116.7,fmt:v=>v.toFixed(1)},
              {id:'c6tsE',label:'誤差變異數',min:0,max:150,step:0.1,value:16.9,fmt:v=>v.toFixed(1)}];
  w.innerHTML=`<div class="widget-title"><strong>把觀察變異數拆成兩塊</strong><div class="controls"><button class="btn" type="button" data-c6ts="116.7,16.9">講義表 6-1</button><button class="btn" type="button" data-c6ts="80,20">影片小考 80＋20</button></div></div>
  ${sliders(defs)}
  ${SV('0 0 640 192','上方長條把觀察變異數拆成真實變異數與誤差變異數，下方數線標出信度')}
  <div class="legend"><span><i style="background:var(--accent)"></i>真實變異數：受試者之間真的差異</span><span><i style="background:var(--amber)"></i>誤差變異數：測量誤差造成的差異</span></div>
  <div class="formula" style="white-space:normal;line-height:1.7" id="c6tsF"></div><div id="c6tsS"></div><p class="readout" id="c6tsM"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;const MAXV=380;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const draw=()=>{
    const T=val(w,'c6tsT'),E=val(w,'c6tsE'),O=T+E,rel=T/O;svg.innerHTML='';
    const VW=nar()?400:640,L=16,R=VW-16,x=v=>L+v/MAXV*(R-L),xr=v=>L+v*(R-L);svg.setAttribute('viewBox','0 0 '+VW+' 192');
    el('rect',{x:x(0),y:28,width:x(T)-x(0),height:40,class:'bar'},svg);
    if(E>0)el('rect',{x:x(T),y:28,width:x(O)-x(T),height:40,class:'bar2'},svg);
    txt('真實 '+T.toFixed(1),{x:x(0),y:20,'text-anchor':'start'});
    txt('誤差 '+E.toFixed(1),{x:x(T),y:84,'text-anchor':'start'});
    txt('觀察變異數 '+O.toFixed(1)+' ＝ 真實 ＋ 誤差',{x:R,y:20,'text-anchor':'end'});
    axisX(svg,x,0,MAXV,96,50,null,null,L,R);
    el('line',{x1:xr(0),x2:xr(1),y1:162,y2:162,class:'axis'},svg);
    for(let i=0;i<=5;i++){const v=i/5;el('line',{x1:xr(v),x2:xr(v),y1:162,y2:166,class:'axis'},svg);txt(v.toFixed(1),{x:xr(v),y:180,'text-anchor':i===0?'start':i===5?'end':'middle'});}
    el('line',{x1:xr(0),x2:xr(rel),y1:162,y2:162,class:'ln','stroke-width':5},svg);
    el('circle',{cx:xr(rel),cy:162,r:7,class:'pt'},svg);
    txt('信度 '+rel.toFixed(2),{x:xr(rel),y:147,'text-anchor':rel>0.9?'end':rel<0.1?'start':'middle',class:'meanlab'});
    q('c6tsF').innerHTML=`信度 ＝ 真實 ÷ 觀察 ＝ <b>${T.toFixed(1)}</b> ÷ (<b>${T.toFixed(1)}</b> ＋ <i>${E.toFixed(1)}</i>) ＝ ${T.toFixed(1)} ÷ ${O.toFixed(1)} ＝ ${rel.toFixed(2)}`;
    q('c6tsS').innerHTML=statsHTML([['信度',rel.toFixed(2),'mean'],['觀察變異數',O.toFixed(1)],['真實變異數',T.toFixed(1)],['誤差變異數',E.toFixed(1),'med'],['觀察分數標準差',Math.sqrt(O).toFixed(1)],['誤差的標準差',Math.sqrt(E).toFixed(1)]]);
    const pt=Math.round(rel*100);
    q('c6tsM').textContent=`分數的差異裡，約 ${pt}% 是受試者之間真的差異，${100-pt}% 是測量誤差。`+
      (E===0?'誤差變異數是 0 的時候信度等於 1：量到的就是真實分數。':rel<0.7?'誤差佔這麼多，誰高誰低有一大部分只是測量誤差造成的。':'把誤差變異數往右拉，觀察變異數跟著變大，信度就往下掉；真實變異數不必變。');
  };
  bindSliders(w,defs,draw);window.addEventListener('resize',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c6ts]');if(!b)return;const[t,er]=b.dataset.c6ts.split(',');q('c6tsT').value=t;q('c6tsE').value=er;q('c6tsT').dispatchEvent(new Event('input'));q('c6tsE').dispatchEvent(new Event('input'));});
  draw();
};

/* ---------- c6sb：Spearman-Brown 預測公式（講義表 6-3、表 6-4） ---------- */
W.c6sb=(w)=>{
  const defs=[{id:'c6sbK',label:'長度變成原來的幾倍 k',min:0.25,max:5,step:0.25,value:2,fmt:v=>v+' 倍'}];
  let r=0.639;
  w.innerHTML=`<div class="widget-title"><strong>Spearman-Brown：測驗變長，信度怎麼變</strong><div class="controls"><button class="btn" type="button" data-c6sb="0.639,2">講義表 6-3</button><button class="btn" type="button" data-c6sb="0.5,2">影片小考</button></div></div>
  <div class="in-row"><label for="c6sbR"><span>原本的信度 r（折半時填兩半的相關）</span><input class="num-in" type="number" id="c6sbR" value="0.639" min="0" max="1" step="0.001" inputmode="decimal"></label></div>
  ${sliders(defs)}
  ${SV('0 0 640 262','橫軸是測驗長度倍數，縱軸是校正後的信度')}
  <div class="formula" style="white-space:normal;line-height:1.7" id="c6sbF"></div><div id="c6sbS"></div><p class="readout" id="c6sbM"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;const L=44,T=22,B=216,y=v=>B-v*(B-T);
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const r3=v=>String(+v.toFixed(3));
  const draw=()=>{
    const k=val(w,'c6sbK'),f=kk=>kk*r/(1+(kk-1)*r),rk=f(k);svg.innerHTML='';
    const VW=nar()?400:640,R=VW-36,x=kk=>L+kk/5*(R-L);svg.setAttribute('viewBox','0 0 '+VW+' 262');
    for(let i=0;i<=5;i++){const v=i/5;el('line',{x1:L,x2:R,y1:y(v),y2:y(v),class:'grid'},svg);txt(v.toFixed(1),{x:L-6,y:y(v)+4,'text-anchor':'end'});}txt('校正後的信度',{x:4,y:12,'text-anchor':'start'});axisX(svg,x,0,5,B,1,null,'長度倍數 k',L,R);
    el('line',{x1:x(1),x2:x(1),y1:T,y2:B,class:'dash'},svg);txt('k＝1 原本長度',{x:x(1)+5,y:B-6,'text-anchor':'start'});
    const pts=[];for(let i=0;i<=200;i++){const kk=0.02+(5-0.02)*i/200;pts.push([x(kk),y(f(kk))]);}
    el('path',{d:pathOf(pts),class:'ln'},svg);
    el('line',{x1:x(k),x2:x(k),y1:y(rk),y2:B,class:'dash'},svg);el('line',{x1:L,x2:x(k),y1:y(rk),y2:y(rk),class:'dash'},svg);
    el('circle',{cx:x(1),cy:y(r),r:4.5,class:'pt'},svg);
    el('circle',{cx:x(k),cy:y(rk),r:6.5,class:'pt2'},svg);
    txt(rk.toFixed(2),{x:x(k)+(k>4.4?-10:10),y:y(rk)+(rk>0.85?18:-9),'text-anchor':k>4.4?'end':'start',class:'medlab'});
    q('c6sbF').innerHTML=`新信度 ＝ k × r ÷ [1 ＋ (k − 1) × r] ＝ <b>${k}</b> × <b>${r3(r)}</b> ÷ [1 ${k<1?'−':'＋'} ${+Math.abs(k-1).toFixed(2)} × ${r3(r)}] ＝ <i>${rk.toFixed(2)}</i>`;
    const need=t=>{if(r<=0)return '—';if(r>=t)return '已達到';return (t*(1-r)/(r*(1-t))).toFixed(2)+' 倍';};
    q('c6sbS').innerHTML=statsHTML([['校正後的信度',rk.toFixed(2),'med'],['原本的信度 r',r3(r),'mean'],['長度倍數 k',k],['要到 0.80 需要',need(0.8)],['要到 0.90 需要',need(0.9)]]);
    q('c6sbM').textContent=(k===1?`長度不變（k＝1），信度就是原本的 ${r3(r)}。`:
      k>1?`測驗加長成 ${k} 倍，信度由 ${r3(r)} 提高到 ${rk.toFixed(2)}。`+(k===2?'折半信度就是這個情況：兩半的相關只代表半份測驗，要用 k＝2 校正回完整長度。':''):
      `測驗縮短成原來的 ${k} 倍，信度由 ${r3(r)} 降到 ${rk.toFixed(2)}：題目或次數越少，信度越低。`)+'曲線越往右越平，代表一直加長，進步的幅度會越來越小。';
  };
  q('c6sbR').addEventListener('input',()=>{const v=parseFloat(q('c6sbR').value);if(isFinite(v)&&v>=0&&v<=1){r=v;draw();}});
  q('c6sbR').addEventListener('change',()=>{q('c6sbR').value=r;});
  bindSliders(w,defs,draw);window.addEventListener('resize',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c6sb]');if(!b)return;const[rv,kv]=b.dataset.c6sb.split(',');r=+rv;q('c6sbR').value=rv;q('c6sbK').value=kv;q('c6sbK').dispatchEvent(new Event('input'));});
  draw();
};

/* ---------- c6alpha：alpha 係數（講義表 6-6） ---------- */
W.c6alpha=(w)=>{
  const BASE=[[3,5,3],[2,2,2],[6,5,3],[5,3,5],[3,4,4]];
  let X=BASE.map(r=>r.slice());const K=3;
  const row=(i)=>`<tr><td>${i+1}</td>${[0,1,2].map(j=>`<td><input type="number" inputmode="decimal" step="1" data-c6ar="${i}" data-c6ac="${j}" value="${X[i][j]}" style="width:54px" aria-label="受試者 ${i+1} 測驗 ${j+1}"></td>`).join('')}<td id="c6aT${i}"></td></tr>`;
  w.innerHTML=`<div class="widget-title"><strong>alpha 係數：三次測驗一不一致</strong><div class="controls"><button class="btn" type="button" id="c6aRs">講義表 6-6</button></div></div>
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th>受試者</th><th>測驗 1</th><th>測驗 2</th><th>測驗 3</th><th>總分</th></tr></thead>
  <tbody>${X.map((_,i)=>row(i)).join('')}
  <tr class="sum"><td>ΣX</td><td id="c6aS0"></td><td id="c6aS1"></td><td id="c6aS2"></td><td id="c6aS3"></td></tr>
  <tr><td>ΣX²</td><td id="c6aQ0"></td><td id="c6aQ1"></td><td id="c6aQ2"></td><td id="c6aQ3"></td></tr>
  <tr><td>變異數 s²</td><td id="c6aV0" class="hl"></td><td id="c6aV1" class="hl"></td><td id="c6aV2" class="hl"></td><td id="c6aV3" class="hl"></td></tr></tbody></table></div>
  ${SV('0 0 640 96','各次測驗變異數的和，與總分變異數的比較')}
  <div class="formula" style="white-space:normal;line-height:1.7" id="c6aF"></div><div id="c6aSt"></div><p class="readout" id="c6aM"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const sum=a=>a.reduce((s,v)=>s+v,0),vr=a=>{const m=sum(a)/a.length;return sum(a.map(v=>(v-m)**2))/(a.length-1);};
  const draw=()=>{
    const cols=[0,1,2].map(j=>X.map(r=>r[j]));const tot=X.map(r=>sum(r));cols.push(tot);
    tot.forEach((t,i)=>{q('c6aT'+i).textContent=+t.toFixed(2);});
    const V=cols.map(vr);
    cols.forEach((c,j)=>{q('c6aS'+j).textContent=+sum(c).toFixed(2);q('c6aQ'+j).textContent=+sum(c.map(v=>v*v)).toFixed(2);q('c6aV'+j).textContent=V[j].toFixed(2);});
    const sv=V[0]+V[1]+V[2],tv=V[3],al=tv>0?K/(K-1)*(1-sv/tv):NaN;
    svg.innerHTML='';const VW=nar()?400:640,L=nar()?104:150,R=VW-80;svg.setAttribute('viewBox','0 0 '+VW+' 96');const mx=Math.max(sv,tv,1e-9),xx=v=>L+v/mx*(R-L);
    txt('三次變異數的和',{x:L-8,y:30,'text-anchor':'end'});el('rect',{x:L,y:14,width:Math.max(1,xx(sv)-L),height:24,class:'bar'},svg);txt(sv.toFixed(2),{x:xx(sv)+6,y:30,'text-anchor':'start'});
    txt('總分的變異數',{x:L-8,y:70,'text-anchor':'end'});el('rect',{x:L,y:54,width:Math.max(1,xx(tv)-L),height:24,class:'bar2'},svg);txt(tv.toFixed(2),{x:xx(tv)+6,y:70,'text-anchor':'start'});
    q('c6aF').innerHTML=`alpha ＝ k ÷ (k − 1) × (1 − 各次的和 ÷ 總分) ＝ 3 ÷ 2 × (1 − <b>${sv.toFixed(2)}</b> ÷ <i>${tv.toFixed(2)}</i>) ＝ ${isFinite(al)?al.toFixed(2):'—'}`;
    q('c6aSt').innerHTML=statsHTML([['alpha 係數',isFinite(al)?al.toFixed(2):'—','mean'],['測驗次數 k',K],['三次變異數的和',sv.toFixed(2)],['總分的變異數',tv.toFixed(2),'med']]);
    q('c6aM').textContent=!isFinite(al)?'每個人的總分都一樣，總分變異數是 0，算不出 alpha。':
      `三次測驗各自的變異數加起來是 ${sv.toFixed(2)}，總分的變異數是 ${tv.toFixed(2)}，alpha ＝ ${al.toFixed(2)}。`+
      (al<=0?'總分變異數沒有比各次相加大，表示三次的分數沒有一起高、一起低，三次測驗彼此不一致。':'總分變異數比各次相加大得越多，表示同一個人三次的分數越是一起高、一起低，alpha 就越接近 1。');
  };
  w.addEventListener('input',e=>{const t=e.target;if(t.dataset.c6ar===undefined)return;const v=parseFloat(t.value);if(!isFinite(v))return;X[+t.dataset.c6ar][+t.dataset.c6ac]=v;draw();});
  window.addEventListener('resize',draw);
  q('c6aRs').addEventListener('click',()=>{X=BASE.map(r=>r.slice());w.querySelectorAll('[data-c6ar]').forEach(i=>{i.value=X[+i.dataset.c6ar][+i.dataset.c6ac];});draw();});
  draw();
};

/* ---------- c6sem：測量標準誤（講義表 6-2 測驗 1，影片 EP2） ---------- */
W.c6sem=(w)=>{
  const PRE={situp:{s:6.6,r:0.927,x:45,u:' 下'},sbp:{s:11.56,r:0.8735,x:133,u:' mmHg'}};
  let s=6.6,r=0.927,xo=45,u=' 下';
  const inp=(id,v,st,lab,extra='')=>`<label for="${id}"><span>${lab}</span><input class="num-in" type="number" id="${id}" value="${v}" step="${st}" inputmode="decimal"${extra}></label>`;
  w.innerHTML=`<div class="widget-title"><strong>測量標準誤：這個分數要加減多少來看</strong><div class="controls"><button class="btn" type="button" data-c6se="situp">表 6-2 仰臥起坐</button><button class="btn" type="button" data-c6se="sbp">表 6-1 收縮壓</button></div></div>
  <div class="in-row">${inp('c6seS',s,'any','標準差 s',' min="0"')}${inp('c6seR',r,'0.001','信度',' min="0" max="1"')}${inp('c6seX',xo,'any','觀察分數')}</div>
  ${SV('0 0 640 232','以觀察分數為中心，標出正負一個與正負兩個測量標準誤的範圍')}
  <div class="legend"><span><i style="background:var(--accent);opacity:.6"></i>±1 個測量標準誤（約 68%）</span><span><i style="background:var(--amber);opacity:.4"></i>±2 個測量標準誤（約 95%）</span></div>
  <div class="formula" style="white-space:normal;line-height:1.7" id="c6seF"></div><div id="c6seSt"></div><p class="readout" id="c6seM"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;const L=20,T=30,B=168;
  const txt=(t0,a)=>{const t=el('text',a,svg);t.textContent=t0;return t;};
  const draw=()=>{
    const sem=s*Math.sqrt(1-r),d=sem>0?sem:1,lo=xo-3.4*d,hi=xo+3.4*d;svg.innerHTML='';
    const VW=nar()?400:640,R=VW-20;svg.setAttribute('viewBox','0 0 '+VW+' 232');
    const x=v=>L+(v-lo)/(hi-lo)*(R-L),f=v=>ST.dnorm((v-xo)/d),y=v=>B-v/f(xo)*(B-T);
    const f1=v=>v.toFixed(1);
    if(sem>0){curveArea(svg,x,y,f,xo-2*d,xo+2*d,'area-r');curveArea(svg,x,y,f,xo-d,xo+d,'area-p');curve(svg,x,y,f,lo,hi,'curve');}
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    el('line',{x1:x(xo),x2:x(xo),y1:T-8,y2:B,class:'zline'},svg);
    txt('觀察分數 '+(+xo.toFixed(2)),{x:x(xo),y:T-13,'text-anchor':'middle',class:'meanlab'});
    if(sem>0){[-2,-1,1,2].forEach(k=>{const v=xo+k*sem;el('line',{x1:x(v),x2:x(v),y1:B,y2:B+5,class:'axis'},svg);txt(f1(v),{x:x(v),y:B+19,'text-anchor':'middle'});txt((k>0?'＋':'−')+Math.abs(k)+' 個',{x:x(v),y:B+34,'text-anchor':'middle'});});
      txt(f1(xo),{x:x(xo),y:B+19,'text-anchor':'middle'});
      el('line',{x1:x(xo-2*sem),x2:x(xo+2*sem),y1:B+46,y2:B+46,class:'ln2'},svg);txt('約 95%',{x:x(xo+2*sem)+6,y:B+50,'text-anchor':'start'});
      el('line',{x1:x(xo-sem),x2:x(xo+sem),y1:B+56,y2:B+56,class:'ln'},svg);txt('約 68%',{x:x(xo+sem)+6,y:B+60,'text-anchor':'start'});}
    q('c6seF').innerHTML=`測量標準誤 ＝ s × √(1 − 信度) ＝ <b>${s}</b> × √(1 − <b>${r}</b>) ＝ ${s} × ${Math.sqrt(1-r).toFixed(3)} ＝ <i>${sem.toFixed(2)}</i>`;
    q('c6seSt').innerHTML=statsHTML([['測量標準誤',sem.toFixed(2),'mean'],['±1 個的範圍',f1(xo-sem)+'–'+f1(xo+sem)],['±2 個的範圍',f1(xo-2*sem)+'–'+f1(xo+2*sem),'med']]);
    q('c6seM').textContent=sem===0?'信度是 1 的時候測量標準誤是 0：觀察分數就是真實分數，不用加減。':
      `量到 ${+xo.toFixed(2)}${u}，不代表真實分數剛好就是 ${+xo.toFixed(2)}。測量標準誤 ${sem.toFixed(2)}，約等於 ${sem.toFixed(1)}${u}：真實分數大約有 68% 的機會落在 ${f1(xo-sem)} 到 ${f1(xo+sem)} 之間，約 95% 的機會落在 ${f1(xo-2*sem)} 到 ${f1(xo+2*sem)} 之間。信度越高，這個範圍越窄。`;
  };
  const bind=(id,ok,set)=>{q(id).addEventListener('input',()=>{const v=parseFloat(q(id).value);if(isFinite(v)&&ok(v)){set(v);draw();}});};
  window.addEventListener('resize',draw);
  bind('c6seS',v=>v>=0,v=>{s=v;});bind('c6seR',v=>v>=0&&v<=1,v=>{r=v;});bind('c6seX',()=>true,v=>{xo=v;});
  ['c6seS','c6seR','c6seX'].forEach(id=>q(id).addEventListener('change',()=>{q('c6seS').value=s;q('c6seR').value=r;q('c6seX').value=xo;}));
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c6se]');if(!b)return;const P=PRE[b.dataset.c6se];s=P.s;r=P.r;xo=P.x;u=P.u;q('c6seS').value=s;q('c6seR').value=r;q('c6seX').value=xo;draw();});
  draw();
};

/* ---------- c6validity：這是哪一種證據？（分類練習） ---------- */
W.c6validity=(w)=>{
  const OPT=[['content','內容關聯效度'],['conc','同時效度（效標關聯）'],['pred','預測效度（效標關聯）'],['cons','建構關聯效度'],['rel','信度'],['obj','客觀性']];
  const HINT={content:'這一題沒有算相關，是在檢查測驗的內容本身。',conc:'這一題有一個公認的標準可以對照，而且和測驗差不多同一時間測。',pred:'這一題拿來對照的標準，是之後才會知道的結果。',cons:'這一題要量的是看不見的特質，看的是分數合不合理論的預期。',rel:'這一題配對的兩邊是同一個測驗（或它的另一個版本），問的是穩不穩。',obj:'這一題配對的兩邊是兩位評分者。'};
  const Q=[
    {t:'籃球技術包含投籃、傳球、運球，可是術科測驗只考投籃。老師逐項檢查：測驗內容有沒有涵蓋想測的範圍？',a:'content',s:'影片 EP3',e:'檢查的是測驗內容夠不夠完整，不必算相關。只考投籃，內容就不完整。'},
    {t:'Kelly 讓會員在同一週做三分鐘登階測驗和跑步機測驗，再算兩種成績的相關。',a:'conc',s:'講義第 4 張、影片 EP3',e:'跑步機測驗是公認的標準（效標），而且和登階測驗同時測，所以是同時效度。'},
    {t:'同一群人隔一週再做一次仰臥起坐，兩次成績的相關是 0.927。',a:'rel',s:'講義表 6-2',e:'同一個測驗測兩次是再測信度。它回答的是「量得穩不穩」，還沒回答「量得對不對」。'},
    {t:'用入學時的測驗分數，和學生日後的成績算相關。',a:'pred',s:'影片 EP3',e:'效標（日後成績）在未來才出現，測驗分數用來預測它，所以是預測效度。'},
    {t:'運動自信心看不見。理論上選手組的問卷分數應該高於一般組，研究者實際施測，看結果符不符合這個預期。',a:'cons',s:'影片 EP3（示意例子）',e:'看不見的特質沒有現成的標準可以對照，只能看分數符不符合理論預期，這是建構關聯效度。'},
    {t:'兩位評分者各自替同一批受試者打分數，再算兩人分數的相關。',a:'obj',s:'講義圖 6-2',e:'配對的是評分者 1 和評分者 2，估計的是客觀性：換一個人評，分數會不會差很多。'},
    {t:'用 2.4 公里跑的成績去對照實驗室測到的最大攝氧量，兩者的相關是 0.92。',a:'conc',s:'講義表 6-8（Getchell 等，1977）',e:'實驗室測到的最大攝氧量是效標。講義表 6-8 的標題就是「同時效度」。'},
    {t:'同一份測驗出 A、B 兩個版本，同一群人兩個版本都考，再算兩份成績的相關。',a:'rel',s:'講義圖 6-2、影片 EP2',e:'A 版本對 B 版本是複本信度，仍然是信度的一種。'},
    {t:'體適能課期末筆試出題前，老師拿課程大綱一條一條核對：每個單元是不是都有題目。',a:'content',s:'自編例子',e:'核對題目有沒有涵蓋該考的範圍，是內容關聯效度的做法。'},
    {t:'球隊選才時測了垂直跳，兩年後再蒐集這些選手正式比賽的表現評分，算兩者的相關。',a:'pred',s:'自編例子',e:'比賽表現是兩年後才有的效標，垂直跳分數用來預測它，是預測效度。'}];
  let i=0,res=Q.map(()=>null),done=false;
  w.innerHTML=`<div class="widget-title"><strong>這是哪一種證據？</strong><div class="controls"><button class="btn" type="button" id="c6vRs">從第 1 題重來</button></div></div>
  <p class="note" id="c6vN" style="margin:0"></p>
  <p id="c6vQ" style="margin:0;font-size:15px;line-height:1.75"></p>
  <div class="tagrow" id="c6vO">${OPT.map(([k,l])=>`<button type="button" class="tag" data-c6v="${k}">${l}</button>`).join('')}</div>
  <p class="readout" id="c6vM"></p>
  <div class="in-row" style="margin:0"><button class="btn" type="button" id="c6vNx">下一題</button></div>
  ${SV('0 0 640 40','十題的作答紀錄')}<div id="c6vS"></div>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const strip=()=>{svg.innerHTML='';const VW=nar()?400:640;svg.setAttribute('viewBox','0 0 '+VW+' 40');Q.forEach((_,j)=>{const cx=22+j*(VW-44)/9;el('circle',{cx,cy:16,r:11,style:`fill:${res[j]===true?'var(--ok)':res[j]===false?'var(--bad)':'var(--soft)'};stroke:${j===i?'var(--ink)':'var(--line)'};stroke-width:${j===i?2.4:1}`},svg);const t=el('text',{x:cx,y:38,'text-anchor':'middle'},svg);t.textContent=j+1;});
    const n=res.filter(v=>v!==null).length,ok=res.filter(v=>v===true).length;
    q('c6vS').innerHTML=statsHTML([['已作答',n+' ／ '+Q.length],['第一次就答對',ok,'mean'],['第一次答錯',n-ok,'med']]);};
  const show=()=>{done=false;const it=Q[i];q('c6vN').textContent=`第 ${i+1} 題／共 ${Q.length} 題　出處：${it.s}`;q('c6vQ').textContent=it.t;
    w.querySelectorAll('[data-c6v]').forEach(b=>{b.classList.remove('right','wrong');b.disabled=false;});
    q('c6vM').textContent='先問自己兩件事：配對的兩邊是什麼？有沒有拿一個公認的標準來對照？想好再點一個選項。';
    q('c6vNx').disabled=true;q('c6vNx').textContent=i===Q.length-1?'回到第 1 題':'下一題';strip();};
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c6v]');
    if(b){if(done)return;const it=Q[i],k=b.dataset.c6v;
      if(k===it.a){b.classList.add('right');if(res[i]===null)res[i]=true;done=true;w.querySelectorAll('[data-c6v]').forEach(x=>{if(x!==b)x.disabled=true;});q('c6vM').textContent='答對了。'+it.e;q('c6vNx').disabled=false;}
      else{b.classList.add('wrong');if(res[i]===null)res[i]=false;q('c6vM').textContent='不是這一種，再想想。'+HINT[it.a];}
      strip();return;}
    if(e.target.closest('#c6vNx')){i=(i+1)%Q.length;show();return;}
    if(e.target.closest('#c6vRs')){i=0;res=Q.map(()=>null);show();}});
  window.addEventListener('resize',strip);
  show();
};

/* ---------- c6ba：Bland-Altman 圖（講義表 6-9、表 6-10） ---------- */
W.c6ba=(w)=>{
  const M9=[103,117,116,123,127,125,135,126,133,145],E9=[105,115,120,125,125,125,125,130,135,145];
  const PRE={t9:{m:M9,e:E9},t10:{m:[103,117,116,123,147,125,151,126,133,145],e:[105,115,120,125,125,125,125,130,151,145]},p10:{m:M9,e:M9.map(v=>v+10)}};
  w.innerHTML=`<div class="widget-title"><strong>Bland-Altman 圖：兩台血壓計一不一致</strong></div>
  <div class="in-row" style="margin:0"><button class="btn" type="button" data-c6ba="t9">講義表 6-9</button><button class="btn" type="button" data-c6ba="t10">講義表 6-10</button><button class="btn" type="button" data-c6ba="p10">影片假設：電子都多 10</button></div>
  <label for="c6baM" class="note">水銀柱血壓計（每人一個數字，用逗號或空白分開）</label><textarea class="nums" id="c6baM" rows="2" spellcheck="false"></textarea>
  <label for="c6baE" class="note">自動電子血壓計（順序要和上面同一個人對齊）</label><textarea class="nums" id="c6baE" rows="2" spellcheck="false"></textarea>
  ${SV('0 0 640 316','橫軸是兩台血壓計的平均，縱軸是差值，虛線是一致性界限')}
  <div class="legend"><span><i style="background:var(--accent)"></i>平均差</span><span><i style="background:var(--amber)"></i>一致性界限與界限外的點</span></div>
  <div class="formula" style="white-space:normal;line-height:1.7" id="c6baF"></div><div id="c6baS"></div><p class="readout" id="c6baR"></p>
  <p class="note" style="margin:0">差值＝電子 − 水銀柱，講義表格把這一欄叫「誤差」。1.96 來自常態分配：平均數加減 1.96 個標準差，涵蓋中間 95% 的值（第 3 章）。界限的數值是依講義資料補算的，講義沒有印出來。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;const L=44,T=32,B=266;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const sg=(v,d=1)=>{const a=Math.abs(v).toFixed(d);return (+a===0?'':v>0?'＋':'−')+a;};
  const parse=id=>q(id).value.split(/[\s,，、;；]+/).filter(t=>t!=='').map(Number);
  const draw=()=>{
    const m=parse('c6baM'),e=parse('c6baE');
    if(m.length<3||m.length!==e.length||m.concat(e).some(v=>!isFinite(v))){q('c6baR').textContent=`兩排數字要一樣多（目前 ${m.length} 個和 ${e.length} 個），至少 3 個人，而且都要是數字。`;return;}
    const n=m.length,d=m.map((v,i)=>e[i]-v),av=m.map((v,i)=>(v+e[i])/2),md=ST.mean(d),sd=ST.sd(d),lo=md-1.96*sd,hi=md+1.96*sd;
    const out=d.map((v,i)=>(v<lo-1e-9||v>hi+1e-9)?i+1:0).filter(Boolean);
    let rr=NaN;try{rr=ST.ols(m,e).r;}catch(err){}
    const mx=Math.max(...d.map(Math.abs),Math.abs(lo),Math.abs(hi),1)*1.15,st=niceStep(2*mx,6),Y=Math.ceil(mx/st)*st;
    const xs=niceStep(Math.max(...av)-Math.min(...av)+6,5),xl=Math.floor((Math.min(...av)-3)/xs)*xs,xh=Math.ceil((Math.max(...av)+3)/xs)*xs;
    const VW=nar()?400:640,R=VW-26;svg.setAttribute('viewBox','0 0 '+VW+' 316');
    const x=v=>L+(v-xl)/(xh-xl)*(R-L),y=v=>B-(v+Y)/(2*Y)*(B-T);
    svg.innerHTML='';
    for(let t=-Y;t<=Y+1e-9;t+=st){el('line',{x1:L,x2:R,y1:y(t),y2:y(t),class:'grid'},svg);txt((t<0?'−':'')+Math.abs(+t.toFixed(6)),{x:L-6,y:y(t)+4,'text-anchor':'end'});}txt('差值（電子 − 水銀柱）',{x:4,y:13,'text-anchor':'start'});axisX(svg,x,xl,xh,B,xs,null,'兩台的平均',L,R);
    if(sd>0)el('rect',{x:L,y:y(hi),width:R-L,height:y(lo)-y(hi),class:'area-r'},svg);
    el('line',{x1:L,x2:R,y1:y(0),y2:y(0),class:'axis',style:'stroke:var(--muted)'},svg);
    if(sd>0){el('line',{x1:L,x2:R,y1:y(hi),y2:y(hi),class:'ln2','stroke-dasharray':'7 5'},svg);el('line',{x1:L,x2:R,y1:y(lo),y2:y(lo),class:'ln2','stroke-dasharray':'7 5'},svg);}
    el('line',{x1:L,x2:R,y1:y(md),y2:y(md),class:'ln'},svg);
    if(sd>0){txt('上界 '+sg(hi),{x:R-4,y:y(hi)-5,'text-anchor':'end',class:'medlab'});txt('下界 '+sg(lo),{x:R-4,y:y(lo)+14,'text-anchor':'end',class:'medlab'});}
    txt('平均差 '+sg(md),{x:L+6,y:y(md)+15,'text-anchor':'start',class:'meanlab'});
    d.forEach((v,i)=>{const o=out.includes(i+1);const c=el('circle',{cx:x(av[i]),cy:y(v),r:5.5,class:o?'pt2':'pt'},svg);const tt=el('title',{},c);tt.textContent=`${i+1} 號：平均 ${+av[i].toFixed(1)}、差值 ${sg(v,Number.isInteger(v)?0:1)}`;
      if(o)txt((i+1)+' 號',{x:x(av[i])+9,y:y(v)+4,'text-anchor':'start',class:'medlab'});});
    q('c6baF').innerHTML=`一致性界限 ＝ 平均差 ± 1.96 × 差值標準差 ＝ <b>${sg(md)}</b> ± 1.96 × <b>${sd.toFixed(2)}</b> ＝ <i style="white-space:nowrap">${sg(lo)} ～ ${sg(hi)}</i>`;
    q('c6baS').innerHTML=statsHTML([['平均差',sg(md),'mean'],['差值標準差',sd.toFixed(2)],['界限下界',sg(lo),'med'],['界限上界',sg(hi),'med'],['界限外',out.length+' 人'],['兩台的相關 r',isFinite(rr)?rr.toFixed(3):'—']]);
    const bias=Math.abs(md)<0.05?'平均差是 0：沒有哪一台固定偏高。':`平均差 ${sg(md)}：電子血壓計平均比水銀柱${md>0?'高':'低'} ${Math.abs(md).toFixed(1)}。`;
    const lim=sd===0?'每個人的差值都一樣，標準差是 0，界限縮成一條線，所有的點都排在平均差上。':`一致性界限 ${sg(lo)} 到 ${sg(hi)}：同一個人換一台量，兩台的差距大多（約 95%）落在這個範圍；${n} 人中${out.length?'有 '+out.length+' 人（'+out.join('、')+' 號）落在界限外':'沒有人落在界限外'}。`;
    const wide=Math.max(Math.abs(lo),Math.abs(hi));
    const end=(isFinite(rr)&&rr>0.9&&Math.abs(md)>=5)?`相關高達 ${rr.toFixed(2)}，數字卻不一致：只看相關就會漏掉這個偏差。`:
      wide>=20?`兩台可能差到 ${Math.round(wide)} 上下，影片的結論是這兩台不能互相替換。`+(isFinite(rr)?`（相關 r＝${rr.toFixed(3)}）`:''):
      `界限夠不夠窄，要看這樣的差距在實際使用上能不能接受。`+(isFinite(rr)?`（相關 r＝${rr.toFixed(3)}）`:'');
    q('c6baR').textContent=bias+lim+end;
  };
  const load=k=>{q('c6baM').value=PRE[k].m.join(', ');q('c6baE').value=PRE[k].e.join(', ');draw();};
  window.addEventListener('resize',draw);q('c6baM').addEventListener('input',draw);q('c6baE').addEventListener('input',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c6ba]');if(b)load(b.dataset.c6ba);});
  load('t9');
};
