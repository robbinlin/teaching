/* ===== 第 12 章 競技與健身運動的心理測量：互動工具 ===== */
const c12T=(svg,x,y,s,a)=>{a=Object.assign({x,y},a||{});if(!/font-size/.test(a.style||''))a.style='font-size:13px;'+(a.style||'');const t=el('text',a,svg);t.textContent=s;return t;};
const c12Set=(root,id,v)=>{const i=root.querySelector('#'+id);i.value=v;i.dispatchEvent(new Event('input'));};
const c12Z=z=>Number.isFinite(z)?(z<0?'−':'+')+Math.abs(z).toFixed(2):'—';
// 表 12-3（講義第 15 張）：列＝原始分數 30→10；欄＝高中男性、高中女性、大學男性、大學女性
const c12T3=[[98,98,97,99],[96,95,93,98],[93,89,93,96],[88,83,88,93],[78,77,82,90],[65,70,77,86],[53,60,70,82],[43,51,63,77],[33,43,56,69],[24,34,51,62],[17,26,43,53],[12,19,34,43],[9,14,27,34],[7,11,21,25],[6,9,16,18],[5,6,8,14],[5,5,4,10],[4,4,2,6],[2,2,1,3],[1,1,0,1],[0,0,0,0]];
// 表 12-5（講義第 19–20 張）：列＝原始分數 36→9；欄＝男性認知、男性身體、男性自信心、女性認知、女性身體、女性自信心
const c12T5=[[99,99,99,99,99,99],[99,99,96,98,99,98],[99,99,94,96,99,97],[99,98,91,94,99,96],[99,98,87,92,98,94],[98,97,83,89,98,92],[98,96,79,87,97,89],[96,95,76,84,94,86],[95,94,71,80,91,83],[93,93,66,76,89,78],[89,92,60,73,86,73],[86,89,52,70,83,67],[83,85,46,65,79,61],[80,82,39,60,73,55],[75,79,34,55,67,48],[68,75,28,49,61,41],[61,71,22,44,57,35],[55,63,17,39,51,28],[48,55,12,33,46,21],[40,49,7,26,41,14],[34,42,3,20,35,11],[28,35,2,16,30,8],[23,27,1,11,24,5],[18,21,0,8,18,3],[12,16,0,5,14,2],[7,10,0,3,10,1],[4,5,0,1,6,0],[1,1,0,0,1,0]];

/* ---------- c12trait：看指導語與問法分類（特質或狀態／一般或運動特定） ---------- */
W.c12trait=(w)=>{
  const SETS={
    ts:{opts:['特質','狀態'],ask:'讀完這句指導語或題目，判斷它量的是特質還是狀態。',hint:'它問的是「平常、通常」的你，還是「此刻、現在」的你？',items:[
      ['指導語：「記得選擇的詞是描述你通常覺得在運動和遊戲時的感受。」',0,'講義圖 12-2 競技運動競賽焦慮測驗','關鍵字是「通常」。問平常大致穩定的傾向，量的是特質焦慮。'],
      ['指導語：「在右方圈選出適當的數字，表示此刻的感受。」',1,'講義圖 12-3 競賽狀態焦慮問卷-2','關鍵字是「此刻」。問此時此刻的感受，量的是狀態焦慮；問卷名稱裡也寫了「狀態」。'],
      ['題目：「在比賽前我感到憂慮。」選項是很少、有時候、經常。',0,'講義圖 12-2 第 2 題','選項問的是「多常發生」，要回想平常比賽前的樣子，所以是特質。'],
      ['題目：「我的心跳加速」選項是一點也不、稍微、普通、非常。',1,'講義圖 12-3 第 17 題','選項問的是現在「有多強」，配上指導語的「此刻」，是狀態。'],
      ['指導語：「以下是描述人們擁有的感受，回答你此刻的心情如何。」',1,'講義圖 12-9 心情狀態量表','又是「此刻」。心情會跟著情境變，這份量表的名稱就叫心情「狀態」量表。'],
      ['題目：「每當我開始覺得計畫無聊時，我就會放棄而做其它事情。」選項從非常不像我到非常像我。',0,'講義圖 12-8 自我動機量表第 2 題','「像不像我」問的是你一向的樣子，不是今天的感覺，所以是特質。'],
      ['題目：「我現在心跳得好快。」',1,'短片 EP1 的小考（自編，仿圖 12-3 第 17 題）','問的是「現在」，所以是狀態焦慮。同一個人可以特質焦慮低、狀態焦慮高。']]},
    gs:{opts:['一般量表','運動特定量表'],ask:'讀完這一題或這份量表的說明，判斷它是一般量表還是運動特定量表。',hint:'題目問的是日常生活，還是直接問比賽、練習或某個專項？',items:[
      ['題目：「每當我開始覺得計畫無聊時，我就會放棄而做其它事情。」',0,'講義圖 12-8 自我動機量表第 2 題','題目沒有提到運動，問的是日常做事的習慣，是一般量表。講義把它放在第九節「一般心理量表」。'],
      ['題目：「競賽時，我會保持正向的自我對話。」',1,'講義表 12-1 運動表現策略測驗','直接問競賽時的情況，是運動特定量表。'],
      ['形容詞：「精力旺盛的」，回答此刻的心情。',0,'講義圖 12-9 心情狀態量表的活力分量表','任何人、任何場合都能填，沒有運動情境，是一般量表。'],
      ['題目：「比賽前，我感到胃不舒服。」',1,'講義圖 12-2 第 8 題','問的是比賽前的反應，是運動特定量表。'],
      ['注意力與人際關係的測驗，用寬－外在、狹窄焦點等六個分量表量注意力。',0,'講義表 12-9（第九節）','講義把它列在第九節「競技與健身運動的一般心理量表」，不限定哪一種運動。'],
      ['棒球注意力與人際關係測驗。',1,'講義表 12-7（第七節）','同一份注意力測驗改成棒球專用的版本，題目貼近棒球情境，是運動特定量表。'],
      ['題幹：「我感到在競技運動中非常成功當…」題目：「我可以做的比我的朋友好。」',1,'講義圖 12-4 競技運動工作與自我導向問卷','題幹就限定在競技運動裡，是運動特定量表。']]}};
  let mode='ts',k=0,st={ts:{},gs:{}};
  w.innerHTML=`<div class="widget-title"><strong>看問法，分一分</strong>${segHTML('c12tm',[['ts','特質或狀態'],['gs','一般或運動特定']],mode)}</div>
  <p class="note" style="margin:0" id="c12tN"></p>
  <p style="margin:0;font-size:16px;font-weight:500" id="c12tQ"></p>
  <div class="tagrow" id="c12tO"></div>
  <p class="readout" id="c12tM"></p>
  <div class="controls"><button class="btn" type="button" id="c12tPrev">上一題</button><button class="btn primary" type="button" id="c12tNext">下一題</button><button class="btn" type="button" id="c12tR">重新開始</button></div>
  <div id="c12tS"></div>
  <p class="note" style="margin:0">每一題只引用講義的一句指導語或一個題目，出處寫在題號旁邊；標「自編」的是短片的小考。選錯可以再選，直到選對。右上角可以換另一組練習。</p>`;
  const q=id=>w.querySelector('#'+id);
  const draw=()=>{
    const S0=SETS[mode],it=S0.items[k],s=st[mode][k]||{wrong:[],ok:false};
    q('c12tN').textContent=`第 ${k+1} 題／共 ${S0.items.length} 題　出處：${it[2]}`;
    q('c12tQ').textContent=it[0];
    q('c12tO').innerHTML=S0.opts.map((o,i)=>`<button type="button" class="tag${s.ok&&i===it[1]?' right':s.wrong.includes(i)?' wrong':''}" data-c12to="${i}">${o}</button>`).join('');
    q('c12tM').textContent=s.ok?`答對了，是「${S0.opts[it[1]]}」。${it[3]}`:s.wrong.length?`「${S0.opts[s.wrong[s.wrong.length-1]]}」不對，再想想：${S0.hint}`:S0.ask;
    q('c12tPrev').disabled=k===0;q('c12tNext').disabled=k===S0.items.length-1;
    const all=Object.values(st[mode]),nOk=all.filter(a=>a.ok).length,first=all.filter(a=>a.ok&&!a.wrong.length).length;
    const cnt=S0.opts.map((o,i)=>S0.items.filter((x,j)=>x[1]===i&&st[mode][j]&&st[mode][j].ok).length);
    q('c12tS').innerHTML=statsHTML([['已答對',nOk+' / '+S0.items.length,'mean'],['第一次就選對',first+' 題'],['答對的題目裡：'+S0.opts[0],cnt[0]+' 題'],['答對的題目裡：'+S0.opts[1],cnt[1]+' 題',nOk===S0.items.length?'':'med']]);
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c12to]');
    if(b){const it=SETS[mode].items[k],s=st[mode][k]||(st[mode][k]={wrong:[],ok:false});if(s.ok)return;const i=+b.dataset.c12to;if(i===it[1])s.ok=true;else if(!s.wrong.includes(i))s.wrong.push(i);draw();}
  });
  q('c12tPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  q('c12tNext').addEventListener('click',()=>{if(k<SETS[mode].items.length-1){k++;draw();}});
  q('c12tR').addEventListener('click',()=>{st[mode]={};k=0;draw();});
  segBind(w,'c12tm',v=>{mode=v;k=0;draw();});draw();
};

/* ---------- c12norm：表 12-3 競賽焦慮測驗常模查表 ---------- */
W.c12norm=(w)=>{
  const G=[['hm','高中男性'],['hf','高中女性'],['cm','大學男性'],['cf','大學女性']];
  const defs=[{id:'c12nx',label:'原始分數（10–30）',min:10,max:30,step:1,value:22,fmt:v=>v+' 分'}];
  let g=2;
  w.innerHTML=`<div class="widget-title"><strong>查表 12-3：這個分數排在哪裡？</strong>${segHTML('c12ng',G,'cm')}</div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" id="c12nR">影片的例子：22 分、大學男性</button><span class="note">拖滑桿改原始分數，右上角換常模組別。</span></div>
  ${SV('0 0 520 240','四個組別的原始分數與百分等級對照曲線')}
  <div class="legend"><span><i style="background:var(--accent)"></i>粗線：你選的組別</span><span><i style="background:var(--muted)"></i>細線與灰點：其他三組</span><span><i style="background:var(--amber)"></i>你的位置</span></div>
  <div class="tbl-wrap" id="c12nTb"></div>
  <div id="c12nS"></div><p class="readout" id="c12nM"></p>
  <p class="note" style="margin:0">數字逐格取自講義第 15 張表 12-3（Martens, 1977）。講義表頭寫「百分比」，內容其實是百分等級：這一組裡分數比你低的人大約占百分之幾。分數越高代表比賽時越容易焦慮。</p>`;
  const svg=w.querySelector('svg'),L=40,R=506,T=28,B=192,x=v=>L+(v-10)/20*(R-L),y=p=>B-p/100*(B-T);
  const pr=(raw,j)=>c12T3[30-raw][j];
  const draw=()=>{
    const raw=val(w,'c12nx');svg.innerHTML='';
    [0,25,50,75,100].forEach(p=>{el('line',{x1:L,x2:R,y1:y(p),y2:y(p),class:'grid'},svg);c12T(svg,L-6,y(p)+4,p,{'text-anchor':'end',style:'font-size:12px'});});
    c12T(svg,4,14,'百分等級',{'text-anchor':'start',style:'font-size:12px'});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    for(let t=10;t<=30;t+=2){el('line',{x1:x(t),x2:x(t),y1:B,y2:B+4,class:'axis'},svg);c12T(svg,x(t),B+18,t,{'text-anchor':'middle',style:'font-size:12px'+(t===raw?';font-weight:700;fill:var(--ink)':'')});}
    c12T(svg,R,B+38,'原始分數',{'text-anchor':'end',style:'font-size:12px'});
    const line=j=>{const pts=[];for(let t=10;t<=30;t++)pts.push([x(t),y(pr(t,j))]);return pathOf(pts);};
    G.forEach((_,j)=>{if(j!==g)el('path',{d:line(j),style:'stroke:var(--muted);stroke-width:1.1;fill:none;opacity:.7'},svg);});
    el('path',{d:line(g),class:'ln',style:'stroke-width:2.6'},svg);
    el('line',{x1:x(raw),x2:x(raw),y1:T-6,y2:B,class:'zline'},svg);
    G.forEach((_,j)=>{if(j!==g)el('circle',{cx:x(raw),cy:y(pr(raw,j)),r:4,style:'fill:var(--muted);stroke:var(--surface);stroke-width:1.2'},svg);});
    const p=pr(raw,g),left=raw>24;
    el('circle',{cx:x(raw),cy:y(p),r:6.5,class:'pt2',style:'stroke:var(--surface);stroke-width:1.6'},svg);
    c12T(svg,x(raw)+(left?-11:11),Math.max(y(p)-9,T+4),'百分等級 '+p,{'text-anchor':left?'end':'start',style:'font-size:14px;font-weight:700;fill:var(--ink);paint-order:stroke;stroke:var(--surface);stroke-width:4px'});
    // 節錄的常模表：上下各兩列
    const top=Math.min(30,Math.max(14,raw+2));let h='<table class="wtbl"><tr><th>原始分數</th>'+G.map(([,n],j)=>`<th${j===g?' style="color:var(--ink);font-weight:700"':''}>${n}</th>`).join('')+'</tr>';
    for(let t=top;t>top-5;t--)h+=`<tr${t===raw?' style="font-weight:700"':''}><td>${t}</td>`+G.map((_,j)=>`<td${t===raw&&j===g?' class="hl"':''}>${pr(t,j)}</td>`).join('')+'</tr>';
    w.querySelector('#c12nTb').innerHTML=h+'</table>';
    w.querySelector('#c12nS').innerHTML=statsHTML(G.map(([,n],j)=>[n,pr(raw,j),j===g?'med':'']));
    const others=G.map(([,n],j)=>j===g?null:`${n} ${pr(raw,j)}`).filter(Boolean).join('、');
    const all=G.map((_,j)=>pr(raw,j)),spread=Math.max(...all)-Math.min(...all);
    const pos=p>=75?'在這一組裡算偏高，排在最高的四分之一':p<=25?'在這一組裡算偏低，排在最低的四分之一':p>=50?`在這一組的中間偏上，比中間的 50 高 ${p-50}`:`在這一組的中間偏下，比中間的 50 低 ${50-p}`;
    w.querySelector('#c12nM').textContent=`原始分數 ${raw}，對照${G[g][1]}運動員的常模，百分等級是 ${p}：大約比這一組 ${p}% 的人高，${pos}。同樣 ${raw} 分，${others}`+(spread>=10?`，四組最多差 ${spread}。所以查常模一定要找對自己那一組。`:`，四組只差 ${spread}，在分數很高或很低的兩端，各組的差別就不大了。`);
  };
  segBind(w,'c12ng',v=>{g=G.findIndex(a=>a[0]===v);draw();});
  w.querySelector('#c12nR').addEventListener('click',()=>{g=2;w.querySelectorAll('[data-c12ng]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c12ng==='cm'?'true':'false'));c12Set(w,'c12nx',22);});
  bindSliders(w,defs,draw);draw();
};

/* ---------- c12csai：表 12-5 競賽狀態焦慮問卷-2，三個分量表分開查 ---------- */
W.c12csai=(w)=>{
  const SUB=['認知焦慮','身體焦慮','自信心'];
  const defs=[{id:'c12c0',label:'認知焦慮的原始分數',min:9,max:36,step:1,value:20,fmt:v=>v+' 分'},
    {id:'c12c1',label:'身體焦慮的原始分數',min:9,max:36,step:1,value:20,fmt:v=>v+' 分'},
    {id:'c12c2',label:'自信心的原始分數',min:9,max:36,step:1,value:20,fmt:v=>v+' 分'}];
  let sex=0;
  w.innerHTML=`<div class="widget-title"><strong>查表 12-5：三個分量表分開查</strong>${segHTML('c12cs',[['m','男性常模'],['f','女性常模']],'m')}</div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" data-c12cp="m,20,20,20">影片的例子：男選手三項都 20 分</button><button class="btn" type="button" data-c12cp="f,22,19,25">步驟 3 的小安：女性 22、19、25</button></div>
  ${SV('0 0 520 176','三個分量表的百分等級長條圖')}
  <div class="tbl-wrap" id="c12cTb"></div>
  <div id="c12cS"></div><p class="readout" id="c12cM"></p>
  <p class="note" style="margin:0">數字逐格取自講義第 19–20 張表 12-5（Martens, Vealey, &amp; Burton, 1990）。每個分量表 9 題、每題 1–4 分，所以分數範圍是 9–36。三個例題各屬哪個分量表依問卷原設計，講義圖 12-3 沒有標。表頭的「百分比」是百分等級。</p>`;
  const svg=w.querySelector('svg'),L=96,R=486,x=p=>L+p/100*(R-L);
  const pr=(raw,s,j)=>c12T5[36-raw][s*3+j];
  const lvl=p=>p>=75?'偏高':p<=25?'偏低':'中間';
  const draw=()=>{
    const v=[0,1,2].map(j=>val(w,'c12c'+j)),p=v.map((r,j)=>pr(r,sex,j));svg.innerHTML='';
    [0,25,50,75,100].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:14,y2:140,class:t===50?'dash':'grid'},svg);c12T(svg,x(t),156,t,{'text-anchor':'middle',style:'font-size:12px'});});
    el('line',{x1:L,x2:R,y1:140,y2:140,class:'axis'},svg);
    c12T(svg,R,172,'百分等級（虛線是中間的 50）',{'text-anchor':'end',style:'font-size:12px'});
    SUB.forEach((n,j)=>{const y0=22+j*40;
      c12T(svg,4,y0+13,n,{'text-anchor':'start',style:'font-size:13px;fill:var(--ink);font-weight:500'});
      c12T(svg,4,y0+28,v[j]+' 分',{'text-anchor':'start',style:'font-size:12px'});
      el('rect',{x:L,y:y0,width:Math.max(x(p[j])-L,1.5),height:26,class:j===2?'must':'bar'},svg);
      const inside=p[j]>80;
      c12T(svg,inside?x(p[j])-7:x(p[j])+7,y0+18,'百分等級 '+p[j],{'text-anchor':inside?'end':'start',style:'font-size:13px;font-weight:700;fill:var('+(inside&&j!==2?'--accent-ink':'--ink')+')'});});
    w.querySelector('#c12cTb').innerHTML='<table class="wtbl"><tr><th>分量表</th><th>原始分數</th><th>男性常模</th><th>女性常模</th></tr>'+SUB.map((n,j)=>`<tr><td>${n}</td><td>${v[j]}</td><td${sex===0?' class="hl"':''}>${pr(v[j],0,j)}</td><td${sex===1?' class="hl"':''}>${pr(v[j],1,j)}</td></tr>`).join('')+'</table>';
    w.querySelector('#c12cS').innerHTML=statsHTML([['認知焦慮',p[0],'mean'],['身體焦慮',p[1],'mean'],['自信心',p[2],'med'],['常模組別',sex?'女性':'男性']]);
    const same=v[0]===v[1]&&v[1]===v[2];
    let m=`${sex?'女':'男'}性常模：認知焦慮 ${v[0]} 分是百分等級 ${p[0]}（${lvl(p[0])}），身體焦慮 ${v[1]} 分是 ${p[1]}（${lvl(p[1])}），自信心 ${v[2]} 分是 ${p[2]}（${lvl(p[2])}）。`;
    if(same)m+=`三項的原始分數都是 ${v[0]}，百分等級卻是 ${p[0]}、${p[1]}、${p[2]}：每個分量表的分數分布不一樣，一定要分開查。`;
    m+='讀的方向不同：兩種焦慮是百分等級越低越好，自信心是越高越好。';
    if(p[2]<=25&&(p[0]>50||p[1]>50))m+='這位選手焦慮在中間以上、自信心卻偏低，比賽前最需要處理的是信心。';
    else if(p[2]>=75&&p[0]<50&&p[1]<50)m+='這位選手焦慮在中間以下、自信心偏高，是比較理想的賽前狀態。';
    w.querySelector('#c12cM').textContent=m;
  };
  const setSex=s=>{sex=s==='f'?1:0;w.querySelectorAll('[data-c12cs]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c12cs===s?'true':'false'));};
  segBind(w,'c12cs',v=>{sex=v==='f'?1:0;draw();});
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c12cp]');if(b){const a=b.dataset.c12cp.split(',');setSex(a[0]);[0,1,2].forEach(j=>c12Set(w,'c12c'+j,a[j+1]));}});
  bindSliders(w,defs,draw);draw();
};

/* ---------- c12profile：用平均數與標準差看相對位置（z 分數） ---------- */
W.c12profile=(w)=>{
  // 平均數與標準差取自講義表 12-6（第 24 張）、表 12-8（第 32 張）、表 12-4（第 16 張）；ex 是自編的例子
  const DS={
    t6:{name:'表 12-6 自我對話',who:'罰球線上的阿量',max:4,step:0.1,rows:[['心理提升',3.05,0.89],['焦慮控制',2.39,0.94],['信心',2.83,0.92],['指導',2.97,0.87],['擔憂',1.05,0.83],['解離',0.65,0.79],['身體疲勞',1.04,0.84],['無關的思考',0.97,0.89]],ex:[2.0,1.5,2.0,2.2,2.7,0.6,1.0,2.2],
      src:'表 12-6（Zourbanos 等, 2009）自我對話問卷的八個分量表。每題 0–4 分是依原問卷，講義沒有列。'},
    t8:{name:'表 12-8 運動動機',who:'偶爾才去健身房的大叔',max:4,step:0.1,rows:[['內在的',2.80,1.02],['認同的',3.24,0.87],['內射的',1.74,1.25],['外在的',0.59,0.90],['無動機',0.30,0.68]],ex:[1.5,2.0,2.5,2.0,0.5],
      src:'表 12-8（Markland &amp; Tobin, 2004）健身運動行為調節問卷的五個分量表。每題 0–4 分是依原問卷，講義沒有列。'},
    t4:{name:'表 12-4 運動焦慮',who:'一位大學選手',max:20,step:1,sum:true,grp:['9–10 歲','11–12 歲','13–14 歲','大學生'],
      rows:[['身體焦慮',[8.29,7.70,8.34,9.78],[3.14,2.80,3.36,3.61]],['擔憂',[9.05,9.37,10.50,12.12],[3.53,3.54,3.75,3.85]],['專注力干擾',[7.54,6.82,7.29,6.93],[2.71,2.28,2.88,2.37]],['全部分數',[24.88,23.88,26.14,28.83],[8.14,7.14,8.40,8.05]]],ex:[13,16,8],
      src:'表 12-4（Smith 等, 2006）競技運動焦慮量表-2。全部分數是三個分量表相加，由工具自動算；每個分量表 5–20 分是依原量表，講義沒有列。'}};
  let key='t6',grp=3,xs=DS.t6.ex.slice();
  w.innerHTML=`<div class="widget-title"><strong>沒有常模表，就算 z 分數</strong>${segHTML('c12pd',[['t6','表 12-6 自我對話'],['t8','表 12-8 運動動機'],['t4','表 12-4 運動焦慮']],key)}</div>
  <div class="in-row" id="c12pG"></div>
  <div class="tbl-wrap" id="c12pTb"></div>
  <div class="in-row"><button class="btn" type="button" id="c12pEx">自編例子</button><button class="btn" type="button" id="c12pMean">全部填成平均數</button><span class="note">在「你的分數」那一欄直接改數字。</span></div>
  <div class="formula" id="c12pF"></div>
  ${SV('0 0 520 300','各分量表的 z 分數長條圖')}
  <div id="c12pS"></div><p class="readout" id="c12pM"></p>
  <p class="note" style="margin:0" id="c12pN"></p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id),L=122,R=462,x=z=>L+(z+3)/6*(R-L);
  const ms=()=>DS[key].rows.map(r=>DS[key].grp?[r[0],r[1][grp],r[2][grp]]:r);
  const build=()=>{
    const d=DS[key],rows=ms();
    q('c12pG').innerHTML=d.grp?'<span class="note">跟哪一組比：</span><div class="tagrow">'+d.grp.map((n,i)=>`<button type="button" class="tag${i===grp?' on':''}" data-c12pg="${i}">${n}</button>`).join('')+'</div>':'';
    q('c12pG').style.display=d.grp?'':'none';
    q('c12pTb').innerHTML='<table class="wtbl"><tr><th>分量表</th><th>你的分數</th><th>平均數</th><th>標準差</th><th>z 分數</th></tr>'+rows.map((r,i)=>`<tr><td>${r[0]}</td><td>${d.sum&&i===rows.length-1?`<b id="c12pSum"></b>`:`<input type="number" inputmode="decimal" id="c12px${i}" min="0" max="${d.max}" step="${d.step}" value="${xs[i]}" aria-label="${r[0]}的分數">`}</td><td>${r[1].toFixed(2)}</td><td>${r[2].toFixed(2)}</td><td id="c12pz${i}"></td></tr>`).join('')+'</table>';
    q('c12pN').innerHTML='平均數與標準差取自講義'+d.src+'「你的分數」預設是自編的例子（'+d.who+'）。z 分數只說明離平均幾個標準差；平均數很靠近最低分的分量表（例如解離 0.65、無動機 0.30），分數擠在低分那一端，不要直接用常態分配換算百分等級。';
    draw();
  };
  const draw=()=>{
    const d=DS[key],rows=ms(),n=rows.length;
    const v=rows.map((r,i)=>{if(d.sum&&i===n-1)return NaN;const t=q('c12px'+i).value;return t===''?NaN:+t;});
    if(d.sum){v[n-1]=v.slice(0,n-1).reduce((a,b)=>a+b,0);q('c12pSum').textContent=Number.isFinite(v[n-1])?String(+v[n-1].toFixed(2)):'—';}
    const z=rows.map((r,i)=>(v[i]-r[1])/r[2]);
    z.forEach((t,i)=>{q('c12pz'+i).textContent=c12Z(t);});
    const H=38+n*28+34;svg.setAttribute('viewBox','0 0 520 '+H);svg.innerHTML='';
    const B=38+n*28;
    for(let t=-3;t<=3;t++){el('line',{x1:x(t),x2:x(t),y1:30,y2:B,class:t===0?'mean':'grid'},svg);c12T(svg,x(t),B+16,t===0?'0':(t<0?'−':'+')+Math.abs(t),{'text-anchor':'middle',style:'font-size:12px'});}
    c12T(svg,x(0),20,'平均數',{'text-anchor':'middle',class:'meanlab',style:'font-size:12px'});
    c12T(svg,x(-3),20,'低於平均',{'text-anchor':'start',style:'font-size:12px'});c12T(svg,x(3),20,'高於平均',{'text-anchor':'end',style:'font-size:12px'});
    c12T(svg,R,B+31,'z 分數（離平均幾個標準差）',{'text-anchor':'end',style:'font-size:12px'});
    rows.forEach((r,i)=>{const y0=38+i*28;
      c12T(svg,4,y0+15,r[0],{'text-anchor':'start',style:'font-size:13px;fill:var(--ink)'});
      if(!Number.isFinite(z[i]))return;
      const zc=Math.max(-3,Math.min(3,z[i])),a=Math.min(x(0),x(zc)),b=Math.max(x(0),x(zc));
      el('rect',{x:a,y:y0+3,width:Math.max(b-a,1.5),height:18,class:z[i]>=0?'bar2':'bar'},svg);
      c12T(svg,z[i]>=0?b+5:a-5,y0+17,c12Z(z[i])+(Math.abs(z[i])>3?'（超出圖）':''),{'text-anchor':z[i]>=0?'start':'end',style:'font-size:12px;font-weight:700;fill:var(--ink)'});});
    const ok=z.map((t,i)=>Number.isFinite(t)?i:-1).filter(i=>i>=0);
    if(!ok.length){q('c12pF').textContent='請在「你的分數」填入數字。';q('c12pS').innerHTML='';q('c12pM').textContent='還沒有可以計算的分數。';return;}
    const hi=ok.reduce((a,b)=>z[b]>z[a]?b:a),lo=ok.reduce((a,b)=>z[b]<z[a]?b:a);
    q('c12pF').innerHTML=`z ＝（分數 − 平均數）÷ 標準差　${esc(rows[hi][0])}：（<b>${v[hi]}</b> − ${rows[hi][1].toFixed(2)}）÷ ${rows[hi][2].toFixed(2)} ＝ <i>${c12Z(z[hi])}</i>`;
    q('c12pS').innerHTML=statsHTML([['相對最高',rows[hi][0]+' '+c12Z(z[hi]),'med'],['相對最低',rows[lo][0]+' '+c12Z(z[lo]),'mean'],['離平均超過 1 個標準差',ok.filter(i=>Math.abs(z[i])>1).length+' 個分量表'],['比較的對象',d.grp?d.grp[grp]:'表內的樣本']]);
    let pair=null;
    ok.forEach(i=>ok.forEach(j=>{if(i<j&&!(d.sum&&(i===n-1||j===n-1))&&v[i]===v[j]&&Math.abs(z[i]-z[j])>=1&&(!pair||Math.abs(z[i]-z[j])>Math.abs(z[pair[0]]-z[pair[1]])))pair=[i,j];}));
    let m;
    if(ok.every(i=>Math.abs(z[i])<0.005))m='每個分數都剛好等於平均數，z 分數全部是 0：這個人在每個分量表上都排在這群人的正中間。把其中一格改大或改小，看長條往哪一邊長。';
    else{m=`跟${d.grp?d.grp[grp]+'這一組':'表內這群人'}比，相對位置最高的是「${rows[hi][0]}」（z ＝ ${c12Z(z[hi])}），最低的是「${rows[lo][0]}」（z ＝ ${c12Z(z[lo])}）。`;
      if(pair)m+=`注意「${rows[pair[0]][0]}」和「${rows[pair[1]][0]}」的原始分數同樣是 ${v[pair[0]]}，z 卻是 ${c12Z(z[pair[0]])} 和 ${c12Z(z[pair[1]])}：每個分量表的平均數和標準差不同，原始分數不能直接互相比。`;
      else m+='原始分數的高低不等於相對位置的高低，要先減掉各自的平均數、再除以各自的標準差才能比。';
      if(d.grp)m+='換一個年齡組，同樣的分數 z 就會變。';}
    q('c12pM').textContent=m;
  };
  w.addEventListener('input',e=>{if(e.target.matches('input[type=number]')){const i=+e.target.id.replace('c12px','');xs[i]=e.target.value;draw();}});
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c12pg]');if(b){grp=+b.dataset.c12pg;const keep=DS[key].rows.map((r,i)=>q('c12px'+i)?q('c12px'+i).value:null).filter(t=>t!==null);xs=keep;build();}});
  q('c12pEx').addEventListener('click',()=>{xs=DS[key].ex.slice();build();});
  q('c12pMean').addEventListener('click',()=>{const r=ms();xs=(DS[key].sum?r.slice(0,-1):r).map(a=>a[1]);build();});
  segBind(w,'c12pd',v=>{key=v;grp=3;xs=DS[key].ex.slice();build();});
  build();
};

/* ---------- c12stage：圖 12-7 改變階段的流程判斷 ---------- */
W.c12stage=(w)=>{
  // 流程與講義第 34 張圖 12-7 相同；問句採短片 EP4 的說法，講義原文列在題目下方。五個階段的名稱是短片補充。
  const N={
    q1:{x:90,y:8,w:340,h:36,t:'一週五天以上，每天至少 30 分鐘中等強度活動？',full:'你一週有五天以上，每天至少做三十分鐘中等強度的身體活動嗎？',orig:'你是否在一週大多的天數中（五天或更多）至少增加三十分鐘的中等強度身體活動？'},
    q2:{x:20,y:74,w:220,h:36,t:'每週會做一些中等強度活動？',full:'那你每週會做一些中等強度的活動嗎？',orig:'你每週至少增加三十分鐘的中等強度體力活動嗎？'},
    q3:{x:290,y:74,w:210,h:36,t:'已經持續六個月以上？',full:'這樣的活動習慣，已經持續六個月以上了嗎？',orig:'你在過去六個月中經常活躍嗎？'},
    q4:{x:20,y:140,w:110,h:40,t:'打算開始活動？',full:'你打算開始增加身體活動嗎？',orig:'你打算增加體力活動嗎？'},
    s3:{x:150,y:140,w:90,h:40,t:'第三階段',nm:'準備期'},s4:{x:290,y:140,w:100,h:40,t:'第四階段',nm:'行動期'},s5:{x:400,y:140,w:100,h:40,t:'第五階段',nm:'維持期'},
    s1:{x:8,y:210,w:84,h:40,t:'第一階段',nm:'無意圖期'},s2:{x:100,y:210,w:84,h:40,t:'第二階段',nm:'意圖期'}};
  const TREE={q1:{y:'q3',n:'q2'},q2:{y:'s3',n:'q4'},q3:{y:'s5',n:'s4'},q4:{y:'s2',n:'s1'}};
  const INFO={
    s1:['三題都答「否」：活動量沒到、每週也沒有固定在動，而且還不打算開始，是第一階段。講義的說法是「根本沒有想到體力活動」。','開始有「想動」的念頭'],
    s2:['現在沒有在動，但已經打算開始，是第二階段。講義的說法是「偶爾會想到，但不會實際活動」。','每週真的開始做一些活動'],
    s3:['每週有在動，但沒有到一週五天、每天三十分鐘，是第三階段。短片裡辦了會員、偶爾才去健身房的大叔就在這裡。','增加到一週五天、每天 30 分鐘'],
    s4:['活動量已經達到，但還沒滿六個月，是第四階段。短片小考「規律運動持續三個月」就是這一格。','繼續維持到滿六個月'],
    s5:['活動量達到，而且已經維持六個月以上，是第五階段，習慣已經養成。','已是最後階段，持續維持']};
  let ans={q1:false,q2:true};
  w.innerHTML=`<div class="widget-title"><strong>圖 12-7：你在第幾階段？</strong><span class="note">預設：短片裡偶爾才去健身房的大叔</span></div>
  <div class="in-row"><button class="btn" type="button" data-c12sp="q1:n,q2:y">大叔：偶爾才去</button><button class="btn" type="button" data-c12sp="q1:y,q3:n">規律運動三個月</button><button class="btn" type="button" data-c12sp="">清空，用自己的情況回答</button></div>
  <div id="c12sQ"></div>
  ${SV('0 0 520 258','改變階段流程圖，走過的路徑會加粗')}
  <div id="c12sS"></div><p class="readout" id="c12sM"></p>
  <p class="note" style="margin:0">流程照講義第 34 張圖 12-7（Blair 等, 2001）。講義的問句譯作「至少增加三十分鐘」，這裡用短片的說法，原文列在每一題下面。五個階段的名稱（無意圖期、意圖期、準備期、行動期、維持期）是短片補充的，講義只寫第一到第五階段。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const path=()=>{const p=['q1'];let c='q1';while(TREE[c]&&ans[c]!==undefined){c=TREE[c][ans[c]?'y':'n'];p.push(c);}return p;};
  const draw=()=>{
    const p=path(),end=p[p.length-1],done=!TREE[end];svg.innerHTML='';
    Object.keys(TREE).forEach(k=>['n','y'].forEach(s=>{const a=N[k],b=N[TREE[k][s]],on=p.includes(k)&&ans[k]===(s==='y')&&ans[k]!==undefined;
      const x1=a.x+a.w/2,y1=a.y+a.h,x2=b.x+b.w/2,y2=b.y,ym=y1+13;
      el('path',{d:`M${x1} ${y1}L${x1} ${ym}L${x2} ${ym}L${x2} ${y2}`,style:'fill:none;stroke:var('+(on?'--accent':'--line')+');stroke-width:'+(on?3:1.4)},svg);
      c12T(svg,x2+(s==='y'?6:-6),ym+12,s==='y'?'是':'否',{'text-anchor':s==='y'?'start':'end',style:'font-size:12px;'+(on?'font-weight:700;fill:var(--ink)':'')});}));
    Object.keys(N).forEach(k=>{const a=N[k],on=p.includes(k),isS=!TREE[k],hit=isS&&k===end;
      el('rect',{x:a.x,y:a.y,width:a.w,height:a.h,rx:isS?8:5,style:'fill:var('+(hit?'--mustard':isS?'--soft':'--surface')+');stroke:var('+(on?'--accent':'--line')+');stroke-width:'+(on?2.4:1.2)+(on||!done&&!isS?'':';opacity:.6')},svg);
      const tc=hit?'fill:#1B2947':'fill:var(--ink)'+(on?'':';opacity:.6');
      if(isS){c12T(svg,a.x+a.w/2,a.y+17,a.t,{'text-anchor':'middle',style:'font-size:13px;font-weight:700;'+tc});c12T(svg,a.x+a.w/2,a.y+33,a.nm,{'text-anchor':'middle',style:'font-size:12px;'+tc});}
      else c12T(svg,a.x+a.w/2,a.y+a.h/2+5,a.t,{'text-anchor':'middle',style:'font-size:13px;'+tc+(on&&ans[k]===undefined?';font-weight:700':'')});});
    q('c12sQ').innerHTML=p.filter(k=>TREE[k]).map((k,i)=>`<div style="margin:0 0 10px"><p style="margin:0 0 4px;font-weight:500">${i+1}. ${N[k].full}</p><p class="note" style="margin:0 0 6px">講義原文：${N[k].orig}</p><div class="tagrow"><button type="button" class="tag${ans[k]===true?' on':''}" data-c12sa="${k}:y">是</button><button type="button" class="tag${ans[k]===false?' on':''}" data-c12sa="${k}:n">否</button></div></div>`).join('');
    const nq=p.filter(k=>TREE[k]&&ans[k]!==undefined).length;
    if(done){const I=INFO[end];
      q('c12sS').innerHTML=statsHTML([['目前的階段',N[end].t,'med'],['階段名稱（短片補充）',N[end].nm],['回答了幾題',nq+' 題'],['到下一階段要做到',I[1],'mean']]);
      q('c12sM').textContent=I[0]+(end==='s5'?'':'要往下一階段走，需要：'+I[1]+'。')+'改掉上面任何一題的答案，看路徑怎麼換。';}
    else{q('c12sS').innerHTML=statsHTML([['目前的階段','還沒判斷出來'],['回答了幾題',nq+' 題']]);
      q('c12sM').textContent='照自己的情況回答上面的問題，每答一題，流程圖就往下走一格，最多三題就會走到一個階段。';}
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c12sa]');
    if(b){const [k,s]=b.dataset.c12sa.split(':');ans[k]=s==='y';const keep=path();Object.keys(ans).forEach(t=>{if(!keep.includes(t))delete ans[t];});draw();return;}
    const pb=e.target.closest('[data-c12sp]');
    if(pb){ans={};pb.dataset.c12sp.split(',').filter(Boolean).forEach(t=>{const [k,s]=t.split(':');ans[k]=s==='y';});draw();}
  });
  draw();
};
