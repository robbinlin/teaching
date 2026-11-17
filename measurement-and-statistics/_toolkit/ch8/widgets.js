/* ===== 第 8 章 編製紙筆測驗與調查：互動工具 ===== */
const c8T=(svg,x,y,s,a)=>{a=Object.assign({x,y},a||{});if(!/font-size/.test(a.style||''))a.style='font-size:13px;'+(a.style||'');const t=el('text',a,svg);t.textContent=s;return t;};
const c8N=x=>String(+(+x).toFixed(2));
const c8P=(x,d=1)=>Number.isFinite(x)?(x*100).toFixed(d).replace(/\.0$/,'')+'%':'—';

/* ---------- c8blueprint：雙向細目表產生器（表 8-1） ---------- */
W.c8blueprint=(w)=>{
  // 權重出自講義第 6 張表 8-1；每格題數＝內容權重 × 教育目標權重 × 總題數（器材 × 分析講義印 1.0%／0.6，重算為 2.0%／1.2）
  const RN=['歷史','價值','器材','禮儀','安全','規則','戰略','技術'],CN=['認識','瞭解','應用','分析','綜合','評價'];
  const PRE={deck:{r:[5,5,10,10,10,20,15,25],c:[30,10,30,20,0,10],n:60},rule:{r:[0,0,0,0,0,100,0,0],c:[30,10,30,20,0,10],n:60}};
  let sel=[5,0];
  const inp=(id,v)=>`<input type="number" id="${id}" value="${v}" min="0" max="100" step="1" inputmode="decimal" style="width:52px;padding:4px 3px" aria-label="權重百分比">`;
  w.innerHTML=`<div class="widget-title"><strong>雙向細目表產生器</strong><span class="note">預設：講義表 8-1，羽球筆試 60 題</span></div>
  <div class="in-row"><label for="c8bN"><span>總題數</span><input class="num-in" type="number" id="c8bN" value="60" min="1" max="300" step="1" inputmode="numeric"></label>
  <button class="btn" type="button" data-c8bp="deck">講義表 8-1</button><button class="btn" type="button" data-c8bp="rule">阿量的想法：全部考規則</button></div>
  <div class="tbl-wrap"><table class="wtbl" id="c8bT">
  <tr><th>內容目標</th><th>權重 %</th>${CN.map(c=>`<th>${c}</th>`).join('')}<th>合計</th></tr>
  <tr><td>層次權重 %</td><td id="c8bCS"></td>${CN.map((c,j)=>`<td>${inp('c8bc'+j,PRE.deck.c[j])}</td>`).join('')}<td></td></tr>
  ${RN.map((r,i)=>`<tr><td>${r}</td><td>${inp('c8br'+i,PRE.deck.r[i])}</td>${CN.map((c,j)=>`<td data-c8b="${i},${j}" tabindex="0" style="cursor:pointer"></td>`).join('')}<td id="c8bR${i}"></td></tr>`).join('')}
  <tr class="sum"><td>合計</td><td id="c8bRS"></td>${CN.map((c,j)=>`<td id="c8bC${j}"></td>`).join('')}<td id="c8bTT"></td></tr>
  </table></div>
  <p class="note" style="margin:0">格子裡的數字是題數（可以有小數）。直接改權重或總題數，整張表立刻重算；點任一格，下面會列出那一格的算式。</p>
  <div class="formula" id="c8bF"></div>
  ${SV('0 0 520 200','八項內容目標各要出幾題的長條圖')}
  <div id="c8bS"></div><p class="readout" id="c8bM"></p>
  <p class="note" style="margin:0">權重取自講義第 6 張表 8-1。「器材 × 分析」講義印 1.0%／0.6 題，但 10% × 20%＝2.0%、60 題是 1.2 題，這樣器材列才會是 6 題、分析欄才會是 12 題；這裡用重算的 1.2。</p>`;
  const g=id=>w.querySelector('#'+id),svg=w.querySelector('svg');
  const num=id=>{const v=parseFloat(g(id).value);return Number.isFinite(v)&&v>=0?v:0;};
  const draw=()=>{
    const N=num('c8bN'),r=RN.map((_,i)=>num('c8br'+i)),c=CN.map((_,j)=>num('c8bc'+j));
    const rs=r.reduce((a,b)=>a+b,0),cs=c.reduce((a,b)=>a+b,0);
    const cell=(i,j)=>r[i]*c[j]/10000*N;
    w.querySelectorAll('[data-c8b]').forEach(td=>{const [i,j]=td.dataset.c8b.split(',').map(Number);td.textContent=c8N(cell(i,j));td.className=i===sel[0]&&j===sel[1]?'hl':'';});
    const rt=RN.map((_,i)=>r[i]*cs/10000*N),ct=CN.map((_,j)=>c[j]*rs/10000*N),tt=rs*cs/10000*N;
    rt.forEach((v,i)=>g('c8bR'+i).textContent=c8N(v));ct.forEach((v,j)=>g('c8bC'+j).textContent=c8N(v));
    g('c8bRS').textContent=c8N(rs)+'%';g('c8bCS').textContent=c8N(cs)+'%';g('c8bTT').textContent=c8N(tt);
    const [si,sj]=sel,pc=r[si]*c[sj]/100,v=cell(si,sj);
    g('c8bF').innerHTML=`${RN[si]} <b>${c8N(r[si])}%</b> × ${CN[sj]} <b>${c8N(c[sj])}%</b> ＝ ${c8N(pc)}%　→　${c8N(N)} 題 × ${c8N(pc)}% ＝ <i>${c8N(v)} 題</i>`;
    svg.innerHTML='';const mx=Math.max(...rt,1e-9);
    RN.forEach((n,i)=>{const y=10+i*23,bw=rt[i]/mx*380;
      c8T(svg,46,y+13,n,{'text-anchor':'end',style:'font-size:13px;fill:var(--ink)'+(i===si?';font-weight:700':'')});
      el('rect',{x:54,y,width:Math.max(bw,0.5),height:16,class:i===si?'must':'bar'},svg);
      c8T(svg,60+bw,y+13,c8N(rt[i])+' 題',{'text-anchor':'start',style:'font-size:13px;fill:var(--ink)'});});
    const top=rt.indexOf(Math.max(...rt));
    g('c8bS').innerHTML=statsHTML([['內容權重合計',c8N(rs)+'%',Math.abs(rs-100)<1e-9?'':'med'],['教育目標權重合計',c8N(cs)+'%',Math.abs(cs-100)<1e-9?'':'med'],[RN[si]+' × '+CN[sj],c8N(v)+' 題','mean'],[RN[si]+'整列',c8N(rt[si])+' 題'],['整份測驗',c8N(tt)+' 題']]);
    let m;
    if(Math.abs(rs-100)>1e-9||Math.abs(cs-100)>1e-9)m=`權重沒有加到 100%（內容 ${c8N(rs)}%、教育目標 ${c8N(cs)}%），所以每格題數加起來是 ${c8N(tt)} 題，不是 ${c8N(N)} 題。先把兩邊的權重都調回合計 100%。`;
    else{
      const isInt=Math.abs(v-Math.round(v))<1e-9;
      m=`「${RN[si]} × ${CN[sj]}」這一格算出來是 ${c8N(v)} 題`+(isInt?'。':`，不是整數，實際出題時要自己取捨成 ${Math.floor(v)} 或 ${Math.ceil(v)} 題。`)+`題數最多的內容是${RN[top]}，${c8N(rt[top])} 題。`;
      if(r[5]===100)m+='全部考規則的話，其他七項內容一題都沒有，這份考卷只量到羽球課的五分之一（規則原本的權重是 20%）。';
      else if(String(r)===String(PRE.deck.r)&&String(c)===String(PRE.deck.c)&&N===60)m+='照講義的權重，規則只該佔 12 題，不是 60 題；綜合的權重是 0%，整欄都不出題。';
    }
    g('c8bM').textContent=m;
  };
  const pick=td=>{sel=td.dataset.c8b.split(',').map(Number);draw();};
  w.addEventListener('click',e=>{
    const td=e.target.closest('[data-c8b]');if(td)return pick(td);
    const b=e.target.closest('[data-c8bp]');if(b){const p=PRE[b.dataset.c8bp];p.r.forEach((v,i)=>g('c8br'+i).value=v);p.c.forEach((v,j)=>g('c8bc'+j).value=v);g('c8bN').value=p.n;sel=[5,0];draw();}
  });
  w.addEventListener('keydown',e=>{const td=e.target.closest('[data-c8b]');if(td&&(e.key==='Enter'||e.key===' ')){e.preventDefault();pick(td);}});
  w.addEventListener('input',draw);draw();
};

/* ---------- c8confidence：是非題信賴加權計分（表 8-2） ---------- */
W.c8confidence=(w)=>{
  // 計分出自講義第 8 張表 8-2（第一列「絕對性」依短片寫作「絕對對」）；期望值由表 8-2 自行計算
  const TAB=[['絕對對','A',2,-2],['可能對','B',1,0],['不知道','C',0.5,0.5],['可能錯','D',1,0],['絕對錯','E',2,-2]];
  const defs=[{id:'c8cp',label:'你對這一題的把握：判斷正確的機率',min:50,max:100,step:1,value:50,fmt:v=>v+'%'}];
  let truth='T',pick=4;
  const sg=v=>(v>0?'＋':v<0?'−':'')+c8N(Math.abs(v));
  w.innerHTML=`<div class="widget-title"><strong>信賴加權：這一題得幾分？</strong>${segHTML('c8ct',[['T','正確答案是「對」'],['F','正確答案是「錯」']],truth)}</div>
  <p class="note" style="margin:0">你在答案卡上畫的是哪一個？</p>
  <div class="tagrow" id="c8cO"></div>
  <div class="tbl-wrap"><table class="wtbl" id="c8cT"></table></div>
  <p class="readout" id="c8cM"></p>
  <div class="in-row"><button class="btn" type="button" id="c8cR">影片小考：答案是「對」，選「絕對錯」</button></div>
  <div class="widget-title"><strong>沒把握的時候，畫哪一個最划算？</strong><span class="note">預設 50%：丟銅板亂猜</span></div>
  ${sliders(defs)}
  ${SV('0 0 520 232','三種把握程度的平均得分隨判斷正確機率的變化')}
  <div class="legend"><span><i style="background:var(--amber)"></i>畫「絕對」</span><span><i style="background:var(--accent)"></i>畫「可能」</span><span><i style="background:var(--mustard)"></i>畫「不知道」</span></div>
  <div id="c8cS"></div><p class="readout" id="c8cE"></p>
  <p class="note" style="margin:0">計分取自講義第 8 張表 8-2。「平均得分」是這裡依表 8-2 算的期望值：畫「絕對」＝2×正確機率−2×錯誤機率，畫「可能」＝1×正確機率，畫「不知道」固定 0.5 分；講義沒有列出這些算式。</p>`;
  const g=id=>w.querySelector('#'+id),svg=w.querySelector('svg');
  const L=46,R=500,T=28,B=186,x=p=>L+(p-50)/50*(R-L),y=v=>B-v/2*(B-T);
  const draw=()=>{
    const judge=pick<2?'T':pick>2?'F':null,ok=judge===truth,sc=judge===null?0.5:(ok?TAB[pick][2]:TAB[pick][3]);
    g('c8cO').innerHTML=TAB.map((t,i)=>`<button type="button" class="tag${i===pick?' on':''}" data-c8co="${i}">${t[1]}　${t[0]}</button>`).join('');
    g('c8cT').innerHTML=`<tr><th>選項</th><th>記號</th><th>判斷正確</th><th>判斷不正確</th></tr>`+TAB.map((t,i)=>`<tr><td>${t[0]}</td><td>${t[1]}</td><td class="${i===pick&&(ok||judge===null)?'hl':''}">${sg(t[2])}</td><td class="${i===pick&&(!ok||judge===null)?'hl':''}">${sg(t[3])}</td></tr>`).join('');
    const tn=truth==='T'?'對':'錯';
    g('c8cM').textContent=judge===null?`正確答案是「${tn}」，你畫「不知道」：不管答案是什麼，固定拿 0.5 分。`
      :`正確答案是「${tn}」，你畫「${TAB[pick][0]}」：判斷${ok?'正確':'錯誤'}，${pick===0||pick===4?'又選了絕對':'選的是可能'}，這一題${sc<0?'倒扣 '+c8N(-sc)+' 分':'得 '+c8N(sc)+' 分'}。`;
    const p=val(w,'c8cp'),q=p/100,ev=[4*q-2,q,0.5],nm=['絕對','可能','不知道'];
    svg.innerHTML='';
    for(let t=0;t<=2;t+=0.5){el('line',{x1:L,x2:R,y1:y(t),y2:y(t),class:'grid'},svg);c8T(svg,L-6,y(t)+4,c8N(t),{'text-anchor':'end'});}
    c8T(svg,4,11,'每題平均得分',{'text-anchor':'start'});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    for(let t=50;t<=100;t+=10){el('line',{x1:x(t),x2:x(t),y1:B,y2:B+4,class:'axis'},svg);c8T(svg,x(t),B+17,t+'%',{'text-anchor':'middle'});}
    c8T(svg,R,B+36,'判斷正確的機率',{'text-anchor':'end'});
    el('line',{x1:x(50),y1:y(0.5),x2:x(100),y2:y(0.5),class:'lnm'},svg);
    el('line',{x1:x(50),y1:y(0.5),x2:x(100),y2:y(1),class:'ln'},svg);
    el('line',{x1:x(50),y1:y(0),x2:x(100),y2:y(2),class:'ln2'},svg);
    el('line',{x1:x(p),x2:x(p),y1:T,y2:B,class:'dash'},svg);
    [['must',2],['pt',1],['pt2',0]].forEach(([c,i])=>el('circle',{cx:x(p),cy:y(ev[i]),r:5.5,class:c,style:'stroke:var(--surface);stroke-width:1.5'},svg));
    const mx=Math.max(...ev),best=nm.filter((n,i)=>Math.abs(ev[i]-mx)<1e-9);
    g('c8cS').innerHTML=statsHTML(ev.map((v,i)=>['畫「'+nm[i]+'」平均',sg(+v.toFixed(2))+' 分',Math.abs(v-mx)<1e-9?'mean':'']));
    let m=`判斷正確的機率 ${p}%：畫「絕對」平均 2×${c8N(q)}−2×${c8N(1-q)}＝${c8N(ev[0])} 分，畫「可能」平均 ${c8N(ev[1])} 分，畫「不知道」固定 0.5 分。`;
    if(p===50)m+='丟銅板還硬畫「絕對」，平均起來是 0 分，比老實畫「不知道」的 0.5 分少。';
    else if(best.length>1)m+=`這時候畫「${best.join('」和「')}」一樣划算。`;
    else m+=`這時候畫「${best[0]}」最划算。`+(best[0]==='絕對'?'把握超過三分之二，畫「絕對」才比畫「可能」划算。':'把握還不到三分之二，硬畫「絕對」反而吃虧。');
    g('c8cE').textContent=m;
  };
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c8co]');if(b){pick=+b.dataset.c8co;draw();}});
  segBind(w,'c8ct',v=>{truth=v;draw();});
  g('c8cR').addEventListener('click',()=>{truth='T';pick=4;w.querySelectorAll('[data-c8ct]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c8ct==='T'?'true':'false'));draw();});
  bindSliders(w,defs,draw);draw();
};

/* ---------- c8item：項目分析計算器（圖 8-3、圖 8-4、表 8-3） ---------- */
W.c8item=(w)=>{
  // 選答人數出自講義第 14 張圖 8-3；難度指數＝兩組答對人數÷兩組總人數，鑑別指數＝高分組答對率−低分組答對率
  const OP=['A','B','C','D','略'];
  const PRE={draft:{name:'圖 8-3 初稿（題號 5，預試 185 人）',stem:'依專家意見，下列有三個因素會導致體適能降低至全國水準以下，那項不受影響呢？',opts:['平均壽命增加','日常生活所需體力降低','靜態活動的職業增加','學校合併的數目增加'],h:[28,2,1,19,0],l:[24,8,1,17,0],key:3},
    fix:{name:'圖 8-3 修正（題號 25，正式施測 1112 人）',stem:'依專家意見，下列有三項會導致體適能降低至全國水準之下，那項不受影響呢？',opts:['高齡人數增加','日常生活所需體力降低','靜態活動的職業增加','學校合併的數目增加'],h:[69,10,5,216,0],l:[89,52,54,104,1],key:3}};
  let key=3,cur='draft';
  const inp=(id)=>`<input type="number" id="${id}" min="0" step="1" inputmode="numeric" style="width:58px" aria-label="人數">`;
  w.innerHTML=`<div class="widget-title"><strong>項目分析計算器</strong>${segHTML('c8ip',[['draft','講義圖 8-3 初稿'],['fix','講義圖 8-3 修正']],cur)}</div>
  <p class="note" style="margin:0" id="c8iQ"></p>
  <div class="in-row"><span class="note">正確選項：</span><span class="tagrow" id="c8iK"></span></div>
  <div class="tbl-wrap"><table class="wtbl">
  <tr><th>各選項的選答人數</th>${OP.map(o=>`<th>${o}</th>`).join('')}<th>組人數</th></tr>
  <tr><td>高分組（前 27%）</td>${OP.map((o,j)=>`<td>${inp('c8ih'+j)}</td>`).join('')}<td id="c8iHN"></td></tr>
  <tr><td>低分組（後 27%）</td>${OP.map((o,j)=>`<td>${inp('c8il'+j)}</td>`).join('')}<td id="c8iLN"></td></tr>
  </table></div>
  <div class="formula" id="c8iF"></div>
  ${SV('0 0 520 214','高分組與低分組在各選項的選答比例')}
  <div class="legend"><span><i style="background:var(--accent)"></i>高分組選這個選項的比例</span><span><i style="background:var(--amber)"></i>低分組選這個選項的比例</span><span>長條上方的數字是人數</span></div>
  <div id="c8iS"></div><p class="readout" id="c8iM"></p>
  ${SV('0 0 520 250','難度指數與鑑別指數的關係，標出目前這一題的位置')}
  <div class="legend"><span><i style="background:var(--accent)"></i>這個難度下可能的最大鑑別指數（講義圖 8-4）</span><span><i style="background:var(--mustard)"></i>0.40：十分良好</span><span><i style="background:var(--amber)"></i>目前這一題</span></div>
  <p class="note" style="margin:0">人數取自講義第 14 張圖 8-3（講義的 E 欄是空的，這裡省略）。兩個公式講義沒有寫出來，是由圖 8-3 的數字反推並驗算的：初稿 36%、4%，修正 53%、37%，和講義印的相同。三角形是講義第 15 張圖 8-4；0.40 的標準出自第 17 張表 8-3 的附註。</p>`;
  const g=id=>w.querySelector('#'+id),svgs=w.querySelectorAll('svg');
  const num=id=>{const v=parseFloat(g(id).value);return Number.isFinite(v)&&v>=0?v:0;};
  const load=k=>{cur=k;const p=PRE[k];p.h.forEach((v,j)=>g('c8ih'+j).value=v);p.l.forEach((v,j)=>g('c8il'+j).value=v);key=p.key;draw();};
  const draw=()=>{
    const p0=PRE[cur],h=OP.map((_,j)=>num('c8ih'+j)),l=OP.map((_,j)=>num('c8il'+j));
    const nh=h.reduce((a,b)=>a+b,0),nl=l.reduce((a,b)=>a+b,0);
    g('c8iQ').textContent=`${p0.name}：${p0.stem}　`+p0.opts.map((o,i)=>OP[i]+'、'+o).join('　');
    g('c8iK').innerHTML=OP.slice(0,4).map((o,i)=>`<button type="button" class="tag${i===key?' on':''}" data-c8ik="${i}">${o}</button>`).join('');
    g('c8iHN').textContent=nh;g('c8iLN').textContent=nl;
    const okN=nh>0&&nl>0,ph=h[key]/nh,pl=l[key]/nl,P=(h[key]+l[key])/(nh+nl),D=ph-pl,Dmax=2*Math.min(P,1-P);
    g('c8iF').innerHTML=okN?`難度指數＝(<b>${h[key]}</b>＋<b>${l[key]}</b>) ÷ (${nh}＋${nl}) ＝ <i>${c8P(P)}</i><br>鑑別指數＝<b>${h[key]}</b>÷${nh} − <b>${l[key]}</b>÷${nl} ＝ ${c8P(ph)} − ${c8P(pl)} ＝ <i>${c8P(D)}</i>`:'兩組都要有人數才能計算。';
    // 圖一：各選項的選答比例
    const s1=svgs[0];s1.innerHTML='';const L=40,R=510,T=22,B=176,gw=(R-L)/5,y=v=>B-v*(B-T);
    for(let t=0;t<=1.001;t+=0.25){el('line',{x1:L,x2:R,y1:y(t),y2:y(t),class:'grid'},s1);c8T(s1,L-5,y(t)+4,Math.round(t*100)+'%',{'text-anchor':'end'});}
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},s1);
    OP.forEach((o,j)=>{const cx=L+gw*(j+0.5),a=nh?h[j]/nh:0,b=nl?l[j]/nl:0;
      el('rect',{x:cx-30,y:y(a),width:28,height:B-y(a),class:'bar'},s1);el('rect',{x:cx+2,y:y(b),width:28,height:B-y(b),class:'bar2'},s1);
      c8T(s1,cx-16,y(a)-4,h[j],{'text-anchor':'middle',style:'font-size:12px;fill:var(--ink)'});c8T(s1,cx+16,y(b)-4,l[j],{'text-anchor':'middle',style:'font-size:12px;fill:var(--ink)'});
      c8T(s1,cx,B+17,j===key?'＊'+o+'（正確）':o,{'text-anchor':'middle',style:'font-size:13px;fill:var(--ink)'+(j===key?';font-weight:700':'')});});
    
    // 圖二：圖 8-4 的三角形
    const s2=svgs[1];s2.innerHTML='';const L2=46,R2=500,T2=14,B2=214,x2=v=>L2+v*(R2-L2),y2=v=>B2-(v+1)/2*(B2-T2);
    for(let t=-1;t<=1.001;t+=0.5){el('line',{x1:L2,x2:R2,y1:y2(t),y2:y2(t),class:t===0?'axis':'grid'},s2);c8T(s2,L2-6,y2(t)+4,t<0?'−'+c8N(-t):c8N(t),{'text-anchor':'end'});}
    for(let t=0;t<=1.001;t+=0.25){el('line',{x1:x2(t),x2:x2(t),y1:B2,y2:B2+4,class:'axis'},s2);c8T(s2,x2(t),B2+17,t.toFixed(2),{'text-anchor':'middle'});}
    el('line',{x1:L2,x2:R2,y1:B2,y2:B2,class:'axis'},s2);
    c8T(s2,R2,B2+34,'難度指數（越小越難）',{'text-anchor':'end'});c8T(s2,L2+6,T2+10,'鑑別指數',{'text-anchor':'start'});
    el('path',{d:pathOf([[x2(0),y2(0)],[x2(0.5),y2(1)],[x2(1),y2(0)]]),class:'ln'},s2);
    el('path',{d:pathOf([[x2(0),y2(0)],[x2(0.5),y2(-1)],[x2(1),y2(0)]]),class:'dash'},s2);
    el('line',{x1:L2,x2:R2,y1:y2(0.4),y2:y2(0.4),class:'lnm',style:'stroke-dasharray:6 4'},s2);
    c8T(s2,L2+4,y2(0.4)-5,'0.40',{'text-anchor':'start',style:'font-size:12px;fill:var(--ink)'});
    if(okN){el('line',{x1:x2(P),x2:x2(P),y1:y2(Dmax),y2:y2(0),class:'dash'},s2);
      el('circle',{cx:x2(P),cy:y2(D),r:6.5,class:'pt2',style:'stroke:var(--surface);stroke-width:1.5'},s2);
      c8T(s2,P>0.7?x2(P)-11:x2(P)+11,y2(D)+(D>0.25?20:-9),`難度 ${c8P(P)}、鑑別 ${c8P(D)}`,{'text-anchor':P>0.7?'end':'start',style:'font-size:13px;font-weight:700;fill:var(--ink)'});}
    if(!okN){g('c8iS').innerHTML='';g('c8iM').textContent='請在兩組都填入選答人數。';return;}
    g('c8iS').innerHTML=statsHTML([['難度指數',c8P(P),'mean'],['高分組答對率',c8P(ph)],['低分組答對率',c8P(pl)],['鑑別指數',c8P(D),'med'],['這個難度的最大鑑別',c8P(Dmax)]]);
    const bad=[],flat=[];
    OP.slice(0,4).forEach((o,j)=>{if(j===key)return;const a=h[j]/nh,b=l[j]/nl;if(a>b)bad.push(`${o}（高分組 ${h[j]} 人、低分組 ${l[j]} 人）`);else if(h[j]+l[j]<=0.02*(nh+nl))flat.push(o);});
    let m=`難度指數 ${c8P(P)}：兩組合起來有 ${c8P(P)} 的人答對`+(P<0.3?'，偏難。':P>0.7?'，偏簡單。':'，離理想值 50% 不遠。');
    if(D<0)m+=`鑑別指數 ${c8P(D)} 是負的：低分組答對的比例反而比較高，這一題一定要修。`;
    else if(D>=0.4)m+=`鑑別指數 ${c8P(D)}，達到 0.40 以上，是十分良好的鑑別力。`;
    else if(D<0.1)m+=`鑑別指數只有 ${c8P(D)}：高分組和低分組答對的比例差不多，這一題幾乎分不出誰會、誰不會。`;
    else m+=`鑑別指數 ${c8P(D)}，還沒到 0.40 的標準，但已經看得出高分組答對的比例比較高。`;
    if(bad.length)m+=`錯誤選項 ${bad.join('、')} 被高分組選得比低分組多，問題多半出在這個選項。`;
    if(flat.length)m+=`錯誤選項 ${flat.join('、')} 幾乎沒有人選，沒有發揮作用。`;
    g('c8iM').textContent=m;
  };
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c8ik]');if(b){key=+b.dataset.c8ik;draw();}});
  segBind(w,'c8ip',load);
  w.addEventListener('input',draw);load('draft');
};

/* ---------- c8survey：問卷題目診斷練習 ---------- */
W.c8survey=(w)=>{
  // 開放式／閉鎖式的例題取自短片 EP4；其餘題目與「題目的毛病」分類為自編補充（講義第 21 張只有標題）
  const SETS={
    type:{opts:['開放式題目','閉鎖式題目'],ask:'這一題是讓人自己寫答案，還是給選項讓人勾？',items:[
      ['你為什麼運動？（請自由填寫）',0,'短片 EP4','沒有選項，讓人自己寫答案，是開放式題目。答案很豐富，但是不好整理。',''],
      ['你每週運動幾天？　□0 天　□1–2 天　□3–4 天　□5 天以上',1,'短片 EP4','給選項讓人勾，是閉鎖式題目。填起來快、好統計，但選項要列得完整。',''],
      ['你對體育課有什麼建議？',0,'短片 EP4 的小考','要填答的人自己寫，是開放式題目。',''],
      ['你最常做的運動是哪一種？　□球類　□跑步　□游泳　□重量訓練　□其他',1,'自編例子','有固定選項可以勾，是閉鎖式題目。「其他」這個選項是為了把選項列完整。',''],
      ['「我覺得體育課的份量剛好。」　□非常同意　□同意　□普通　□不同意　□非常不同意',1,'自編例子','同意程度的五個選項已經定好，填答的人只能從裡面勾一個，是閉鎖式題目。',''],
      ['請描述你上一次運動受傷的經過。',0,'自編例子','沒有選項、要用文字敘述，是開放式題目。','']]},
    flaw:{opts:['一題問兩件事','用語在引導答案','選項不完整或重疊','對不上調查目的','沒有明顯毛病'],ask:'再讀一次題目：它問了幾件事？語氣有沒有偏向某個答案？選項有沒有漏掉或重疊？和「運動習慣」有沒有關係？',items:[
      ['你對體育館的設備和開放時間滿意嗎？　□滿意　□不滿意',0,'自編例子','設備和開放時間是兩件事。對設備滿意、對開放時間不滿意的人不知道該勾哪一個。','修改：拆成兩題，一題問設備、一題問開放時間。'],
      ['運動對健康好處多多，你是否同意每個人都應該天天運動？　□同意　□不同意',1,'自編例子','題目前半句先說了運動的好處，等於暗示要答「同意」。','修改：刪掉前半句，只問「你同意『每個人都應該天天運動』嗎？」'],
      ['你每週運動幾天？　□1–2 天　□2–3 天　□4–5 天',2,'自編例子','完全不運動和運動 6、7 天的人沒有選項可以勾；運動 2 天的人則有兩個選項可以勾。','修改：改成短片 EP4 的選項「0 天、1–2 天、3–4 天、5 天以上」，每個人都剛好落在一格。'],
      ['你最喜歡哪一位歌手？',3,'自編例子','這份問卷的目的是了解運動習慣，這一題的答案用不上。短片 EP4：每一題都要對得上調查目的，對不上的就刪掉。','修改：刪掉這一題，問卷也變短。'],
      ['你每週運動幾天？　□0 天　□1–2 天　□3–4 天　□5 天以上',4,'短片 EP4','只問一件事，語氣中性，0 到 7 天都有選項、彼此不重疊，也和調查目的有關。',''],
      ['你不覺得學校應該多開放夜間球場嗎？　□是　□否',1,'自編例子','「你不覺得……嗎」的問法已經預設了立場，填答的人容易順著題目答「是」。','修改：改成「你贊成學校增加夜間球場的開放時段嗎？」'],
      ['過去一週，你有幾天運動超過 30 分鐘？　＿＿天',4,'自編例子','只問一件事，時間範圍（過去一週）和標準（超過 30 分鐘）都寫清楚了，和調查目的有關。這是只要填一個數字的開放式題目。','']]}};
  let mode='type',k=0,st={type:{},flaw:{}};
  w.innerHTML=`<div class="widget-title"><strong>問卷題目診斷</strong>${segHTML('c8sm',[['type','開放式或閉鎖式'],['flaw','這一題哪裡有毛病']],mode)}</div>
  <p class="note" style="margin:0" id="c8sN"></p>
  <p style="margin:0;font-size:16px;font-weight:500" id="c8sQ"></p>
  <div class="tagrow" id="c8sO"></div>
  <p class="readout" id="c8sM"></p>
  <div class="controls"><button class="btn" type="button" id="c8sPrev">上一題</button><button class="btn primary" type="button" id="c8sNext">下一題</button><button class="btn" type="button" id="c8sR">重新開始</button></div>
  <div id="c8sS"></div>
  <p class="note" style="margin:0">情境：阿量要用問卷了解同學的運動習慣（短片 EP4）。開放式與閉鎖式是講義第 21 張的分類。「這一題哪裡有毛病」的四種毛病是編寫問卷常見的檢查項目，講義第 21 張「其他考慮事項」只有標題，這部分是另外補充的；標「自編例子」的題目都是為了練習編的。選錯可以再選，直到選對。</p>`;
  const q=id=>w.querySelector('#'+id);
  const draw=()=>{
    const S0=SETS[mode],it=S0.items[k],s=st[mode][k]||{wrong:[],ok:false};
    q('c8sN').textContent=`第 ${k+1} 題／共 ${S0.items.length} 題　出處：${it[2]}`;
    q('c8sQ').textContent=it[0];
    q('c8sO').innerHTML=S0.opts.map((o,i)=>`<button type="button" class="tag${s.ok&&i===it[1]?' right':s.wrong.includes(i)?' wrong':''}" data-c8so="${i}">${o}</button>`).join('');
    q('c8sM').textContent=s.ok?`答對了，是「${S0.opts[it[1]]}」。${it[3]}${it[4]}`:s.wrong.length?`「${S0.opts[s.wrong[s.wrong.length-1]]}」不對，再想想：${S0.ask}`:(mode==='type'?'讀完題目，判斷它是開放式還是閉鎖式題目。':'讀完題目，選出它最主要的毛病；沒有毛病就選最後一個。答對後會看到修改的方法。');
    q('c8sPrev').disabled=k===0;q('c8sNext').disabled=k===S0.items.length-1;
    const all=Object.values(st[mode]),nOk=all.filter(a=>a.ok).length,first=all.filter(a=>a.ok&&!a.wrong.length).length;
    q('c8sS').innerHTML=statsHTML([['已答對',nOk+' / '+S0.items.length,'mean'],['第一次就選對',first+' 題'],['還沒答對',(S0.items.length-nOk)+' 題',nOk===S0.items.length?'':'med']]);
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c8so]');
    if(b){const it=SETS[mode].items[k],s=st[mode][k]||(st[mode][k]={wrong:[],ok:false});if(s.ok)return;const i=+b.dataset.c8so;if(i===it[1])s.ok=true;else{if(s.wrong.includes(i))s.wrong.splice(s.wrong.indexOf(i),1);s.wrong.push(i);}draw();}
  });
  q('c8sPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  q('c8sNext').addEventListener('click',()=>{if(k<SETS[mode].items.length-1){k++;draw();}});
  q('c8sR').addEventListener('click',()=>{st[mode]={};k=0;draw();});
  segBind(w,'c8sm',v=>{mode=v;k=0;draw();});draw();
};
