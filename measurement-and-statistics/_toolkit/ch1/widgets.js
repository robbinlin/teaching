/* ===== 第 1 章 測驗與測量的概念：互動工具 ===== */
const c1T=(svg,x,y,s,a)=>{a=Object.assign({x,y},a||{});if(!/font-size/.test(a.style||''))a.style='font-size:13px;'+(a.style||'');const t=el('text',a,svg);t.textContent=s;return t;};
const c1N=v=>Math.round(v).toLocaleString('en-US');
const c1Set=(root,id,v)=>{const i=root.querySelector('#'+id);i.value=v;i.dispatchEvent(new Event('input'));};

/* ---------- c1bp：同一個收縮壓，新舊兩種標準 ---------- */
W.c1bp=(w)=>{
  // 分類界線依短片 EP1（ep_c1e1.js 的兩把色尺）：舊標準 2003 年起、新標準 2017 年起（美國 ACC/AHA）
  const STD={
    old:{name:'舊標準',yr:'2003 年起',thr:140,segs:[[100,120,'正常','正常',0],[120,140,'高血壓前期','高血壓前期',1],[140,160,'高血壓','高血壓',3]]},
    new:{name:'新標準',yr:'2017 年起',thr:130,segs:[[100,120,'正常','正常',0],[120,130,'偏高','偏高',1],[130,140,'第一期','第一期高血壓',2],[140,160,'第二期','第二期高血壓',3]]}};
  const FILL=['fill:var(--soft)','fill:var(--mustard);fill-opacity:.55','fill:var(--amber);fill-opacity:.38','fill:var(--amber);fill-opacity:.92'];
  const defs=[{id:'c1bpv',label:'測量值：收縮壓（mmHg）',min:100,max:160,step:1,value:135}];
  let cur='new';
  w.innerHTML=`<div class="widget-title"><strong>同一個數字，兩種標準</strong>${segHTML('c1bps',[['old','套用舊標準'],['new','套用新標準']],cur)}</div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" id="c1bpR">影片的例子：135</button><span class="note">拖滑桿改變測量值，右上角切換評價用的標準。</span></div>
  ${SV('0 0 520 212','收縮壓在新舊兩種高血壓標準色尺上的位置')}
  <div id="c1bpS"></div><p class="readout" id="c1bpM"></p>
  <p class="note" style="margin:0">色尺只看收縮壓，分類界線與短片 EP1 相同。130/80 是 2017 年美國 ACC/AHA 指引的門檻，這裡只用來說明「測量不變、評價標準改變」，不是台灣現行的診斷標準；實際診斷還要看舒張壓，並由醫師判斷。</p>`;
  const svg=w.querySelector('svg'),L=16,R=504,x=v=>L+(v-100)/60*(R-L);
  const cat=(k,v)=>STD[k].segs.find((s,i,a)=>v<s[1]||i===a.length-1);
  const draw=()=>{
    const v=val(w,'c1bpv');svg.innerHTML='';
    const left=v>=130;
    [['old',52],['new',118]].forEach(([k,y0])=>{
      const s=STD[k],g=el('g',{style:k===cur?'':'opacity:.45'},svg),hit=cat(k,v);
      const t=c1T(g,left?L:R,y0-6,`${s.name}（${s.yr}）　門檻 ${s.thr}`,{'text-anchor':left?'start':'end',style:'font-size:13px;fill:var(--ink)'+(k===cur?';font-weight:700':'')});
      s.segs.forEach(sg=>{
        el('rect',{x:x(sg[0]),y:y0,width:x(sg[1])-x(sg[0]),height:32,style:FILL[sg[4]]+';stroke:var(--ink);stroke-width:'+(sg===hit?2.2:.8)},g);
        c1T(g,(x(sg[0])+x(sg[1]))/2,y0+21,sg[2],{'text-anchor':'middle',style:'font-size:13px;fill:var('+(sg[4]===3?'--accent-ink':'--ink')+')'+(sg===hit?';font-weight:700':'')});
      });
      el('line',{x1:x(s.thr),x2:x(s.thr),y1:y0-5,y2:y0+37,style:'stroke:var(--amber);stroke-width:3'},g);
    });
    el('line',{x1:L,x2:R,y1:170,y2:170,class:'axis'},svg);
    for(let t=100;t<=160;t+=10){el('line',{x1:x(t),x2:x(t),y1:170,y2:174,class:'axis'},svg);c1T(svg,x(t),187,t,{'text-anchor':'middle'});}
    c1T(svg,R,204,'收縮壓（mmHg）',{'text-anchor':'end'});
    [[28,60],[78,126],[144,170]].forEach(([a,b])=>el('line',{x1:x(v),x2:x(v),y1:a,y2:b,class:'zline'},svg));
    el('path',{d:`M${x(v)-9} 12L${x(v)+9} 12L${x(v)} 28Z`,style:'fill:var(--mustard);stroke:var(--ink);stroke-width:1.2'},svg);
    c1T(svg,v>150?x(v)-14:x(v)+14,24,v,{'text-anchor':v>150?'end':'start',style:'font-size:16px;font-weight:700;fill:var(--ink)'});
    const o=cat('old',v)[3],n=cat('new',v)[3];
    w.querySelector('#c1bpS').innerHTML=statsHTML([['測量（有多少）',v+' mmHg'],['舊標準的評價',o,cur==='old'?'mean':''],['新標準的評價',n,cur==='new'?'med':''],['是否過門檻',cur==='old'?(v>=140?'已過 140':'未過 140'):(v>=130?'已過 130':'未過 130')]]);
    let m;
    if(v<120)m=`${v} mmHg：兩種標準都評為「正常」。換標準，這個人的評價不會變。`;
    else if(v<130)m=`${v} mmHg：舊標準叫「高血壓前期」，新標準叫「偏高」。名稱不同，但兩邊都還沒過高血壓門檻。`;
    else if(v<140)m=`${v} mmHg：舊標準評為「高血壓前期」（門檻 140，還沒過），新標準評為「第一期高血壓」（門檻 130，已經過了）。血壓計沒換、數字沒變，變的只有評價用的標準。`;
    else m=`${v} mmHg：兩種標準都已過高血壓門檻，舊標準稱「高血壓」，新標準稱「第二期高血壓」。`;
    w.querySelector('#c1bpM').textContent=`目前套用${STD[cur].name}。`+m;
  };
  segBind(w,'c1bps',v=>{cur=v;draw();});
  w.querySelector('#c1bpR').addEventListener('click',()=>c1Set(w,'c1bpv',135));
  bindSliders(w,defs,draw);draw();
};

/* ---------- c1ref：同一個成績，常模參照與效標參照兩種讀法 ---------- */
W.c1ref=(w)=>{
  // 效標：講義第 17 張每日步數分級表；「>10000」「>12500」依短片讀作 10,000 以上、12,500 以上
  const BAND=[[0,5000,'靜式','靜式生活型態'],[5000,7500,'低度','低度活動量'],[7500,10000,'中低度','中低度活動量'],[10000,12500,'中高度','中高度活動量'],[12500,16000,'高度','高度活動量']];
  const RNG=['不到 5,000 步','5,000–7,499 步','7,500–9,999 步','10,000–12,499 步','12,500 步以上'];
  const FILL=['fill:var(--soft)','fill:var(--mustard);fill-opacity:.28','fill:var(--mustard);fill-opacity:.62','fill:var(--accent);fill-opacity:.3','fill:var(--accent);fill-opacity:.62'];
  const defs=[{id:'c1rx',label:'你的成績：每日步數',min:0,max:16000,step:100,value:8000,fmt:c1N},
    {id:'c1rm',label:'參照團體的平均數（示意）',min:3000,max:13000,step:100,value:7000,fmt:c1N},
    {id:'c1rs',label:'參照團體的標準差（示意）',min:500,max:4000,step:100,value:2000,fmt:c1N}];
  w.innerHTML=`<div class="widget-title"><strong>同一個成績，兩種讀法</strong><span class="note">預設：短片裡阿量的 8,000 步</span></div>
  ${sliders(defs)}
  <div class="in-row"><span class="note">換一個參照團體：</span><button class="btn" type="button" data-c1rg="7000,2000">A 團體（示意）：平均 7,000</button><button class="btn" type="button" data-c1rg="11000,2500">B 團體（示意）：平均 11,000</button><button class="btn" type="button" id="c1rR">回到 8,000 步</button></div>
  ${SV('0 0 520 250','上方是參照團體的步數分布，下方是講義的每日步數分級')}
  <div class="legend"><span><i style="background:var(--accent);opacity:.45"></i>常模參照：團體裡步數比你少的人</span><span><i style="background:var(--mustard)"></i>效標參照：講義第 17 張的分級</span></div>
  <div id="c1rS"></div><p class="readout" id="c1rM"></p>
  <p class="note" style="margin:0">分級界線取自講義第 17 張（10,000 步以上為中高度、12,500 步以上為高度）。參照團體的平均數與標準差是自編的示意值，並假設步數呈常態分配（第 3 章會學），不是真實調查資料。</p>`;
  const svg=w.querySelector('svg'),L=16,R=504,T=34,B=150,x=v=>L+v/16000*(R-L);
  const draw=()=>{
    const v=val(w,'c1rx'),mu=val(w,'c1rm'),sg=val(w,'c1rs');svg.innerHTML='';
    const f=t=>ST.dnorm((t-mu)/sg),y=d=>B-d/f(mu)*(B-T),z=(v-mu)/sg,P=ST.pnorm(z);
    curveArea(svg,x,y,f,0,v,'area-p');curve(svg,x,y,f,0,16000,'curve');
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    el('line',{x1:x(mu),x2:x(mu),y1:T,y2:B,class:'mean'},svg);
    c1T(svg,x(mu)+(v>=mu?-5:5),B+14,'團體平均 '+c1N(mu),{'text-anchor':v>=mu?'end':'start',class:'meanlab'});
    const bi=BAND.findIndex((b,i)=>v<b[1]||i===BAND.length-1);
    BAND.forEach((b,i)=>{
      el('rect',{x:x(b[0]),y:172,width:x(b[1])-x(b[0]),height:30,style:FILL[i]+';stroke:var(--ink);stroke-width:'+(i===bi?2.2:.8)},svg);
      c1T(svg,(x(b[0])+x(b[1]))/2,192,b[2],{'text-anchor':'middle',style:'font-size:13px;fill:var(--ink)'+(i===bi?';font-weight:700':'')});
    });
    [0,5000,7500,10000,12500,16000].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:202,y2:206,class:'axis'},svg);c1T(svg,x(t),219,c1N(t),{'text-anchor':t===0?'start':t===16000?'end':'middle'});});
    c1T(svg,R,238,'每日步數',{'text-anchor':'end'});
    el('line',{x1:x(v),x2:x(v),y1:22,y2:206,class:'zline'},svg);
    c1T(svg,Math.min(Math.max(x(v),L+34),R-34),15,c1N(v)+' 步',{'text-anchor':'middle',style:'font-size:15px;font-weight:700;fill:var(--ink)'});
    const pc=P*100,pcs=pc<1?'不到第 1 百分位':pc>99?'第 99 百分位以上':'第 '+Math.round(pc)+' 百分位';
    const nxt=bi<BAND.length-1?c1N(BAND[bi][1]-v)+' 步':'已是最高一級';
    w.querySelector('#c1rS').innerHTML=statsHTML([['效標參照：等級',BAND[bi][3],'med'],['到下一級還差',nxt],['常模參照：排在',pcs,'mean'],['離平均幾個標準差',(z<0?'−':'+')+Math.abs(z).toFixed(2)]]);
    const more=pc<1?'幾乎比所有人都少':pc>99?'幾乎比所有人都多':`大約比 ${Math.round(pc)}% 的人多`;
    w.querySelector('#c1rM').textContent=`${c1N(v)} 步。效標參照：對照分級表落在「${RNG[bi]}」，是${BAND[bi][3]}；不管別人走多少，這個答案都一樣。常模參照：在平均 ${c1N(mu)}、標準差 ${c1N(sg)} 的團體裡，${more}；換一個團體，排名就跟著變。`;
  };
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c1rg]');if(b){const [m,s]=b.dataset.c1rg.split(',');c1Set(w,'c1rm',m);c1Set(w,'c1rs',s);}});
  w.querySelector('#c1rR').addEventListener('click',()=>c1Set(w,'c1rx',8000));
  bindSliders(w,defs,draw);draw();
};

/* ---------- c1timing：十週減重 4.5 公斤，形成評量與總結評量 ---------- */
W.c1timing=(w)=>{
  // 目標與時程出自講義第 20 張；每週數值是短片 EP3 使用的示意值（ep_c1e3.js）
  const V=[0,-0.6,-1.1,-1.5,-2.1,-2.4,-3.0,-3.4,-3.8,-4.2,-4.5],GOAL=4.5;
  const defs=[{id:'c1tw',label:'現在是第幾週',min:0,max:10,step:1,value:5,fmt:v=>'第 '+v+' 週'}];
  let mode='weekly';
  w.innerHTML=`<div class="widget-title"><strong>十週減重 4.5 公斤：什麼時候量？</strong>${segHTML('c1tm',[['weekly','每週都量'],['final','只在第 10 週量']],mode)}</div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" id="c1tR">回到第 5 週、每週都量</button></div>
  ${SV('0 0 520 236','十週的體重變化與目標線')}
  <div class="legend"><span><i style="background:var(--accent)"></i>過程中的測量（形成評量）</span><span><i style="background:var(--amber)"></i>第 10 週的檢視（總結評量）</span><span><i style="background:var(--muted)"></i>虛線：每週 0.45 公斤的等速進度</span></div>
  <div id="c1tS"></div><p class="readout" id="c1tM"></p>
  <p class="note" style="margin:0">「目標減 4.5 公斤、每週量體重與體脂是形成評量、第十週檢視是總結評量」出自講義第 20 張。每週的數值是短片 EP3 用的示意值，講義沒有給。</p>`;
  const svg=w.querySelector('svg'),L=46,R=500,T=24,B=190,x=k=>L+k/10*(R-L),y=v=>T+(-v)/5*(B-T);
  const kg=v=>(Math.round(v*100)/100).toString();
  const draw=()=>{
    const k=val(w,'c1tw');svg.innerHTML='';
    for(let t=0;t<=5;t++){el('line',{x1:L,x2:R,y1:y(-t),y2:y(-t),class:'grid'},svg);c1T(svg,L-6,y(-t)+4,t?'−'+t:'0',{'text-anchor':'end'});}
    c1T(svg,4,12,'體重變化（公斤，示意）',{'text-anchor':'start'});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    for(let t=0;t<=10;t++){el('line',{x1:x(t),x2:x(t),y1:B,y2:B+4,class:'axis'},svg);c1T(svg,x(t),B+17,t,{'text-anchor':'middle',style:t===k?'font-weight:700;fill:var(--ink)':''});}
    c1T(svg,R,B+34,'週',{'text-anchor':'end'});
    el('line',{x1:L,x2:R,y1:y(-GOAL),y2:y(-GOAL),style:'stroke:var(--amber);stroke-width:1.6;stroke-dasharray:6 4'},svg);
    c1T(svg,L+6,y(-GOAL)-5,'目標 −4.5',{'text-anchor':'start',style:'fill:var(--amber);font-weight:500'});
    el('line',{x1:x(0),x2:x(10),y1:y(0),y2:y(-GOAL),class:'dash'},svg);
    el('rect',{x:x(k)-13,y:T,width:26,height:B-T,style:'fill:var(--mustard);fill-opacity:.22'},svg);
    const shown=[];for(let t=0;t<=k;t++)if(mode==='weekly'||t===0||t===10)shown.push(t);
    if(mode==='weekly'&&shown.length>1)el('path',{d:pathOf(shown.map(t=>[x(t),y(V[t])])),class:'ln'},svg);
    shown.forEach(t=>{el('circle',{cx:x(t),cy:y(V[t]),r:t===10?7:4.5,class:t===10?'pt2':'pt',style:'stroke:var(--surface);stroke-width:1.5'},svg);});
    const known=shown.includes(k),pace=0.45*k,done=-V[k],diff=done-pace;
    const kind=k===10?'總結評量':known?'形成評量':'沒有測量';
    w.querySelector('#c1tS').innerHTML=statsHTML([['這一週做的評量',kind,k===10?'med':known?'mean':''],['已減（示意）',known?kg(done)+' 公斤':'不知道'],['等速進度應減',kg(pace)+' 公斤'],['還能調整的時間',(10-k)+' 週']]);
    let m;
    if(k===0)m='第 0 週是起點。講義說形成評量是「開始或進行中的評量，如前測與再測」，所以開始前先量一次，也算形成評量。';
    else if(k===10)m=`第 10 週檢視成果：共減 ${kg(done)} 公斤，達到目標。這是總結評量，用來驗收；計畫已經結束，沒有時間再修正。`+(mode==='final'?'中間九週都沒量，就算途中落後也不會發現。':'');
    else if(known)m=`第 ${k} 週量到已減 ${kg(done)} 公斤，等速進度是 ${kg(pace)} 公斤，${diff>=0?'超前':'落後'} ${kg(Math.abs(diff))} 公斤。這是形成評量：還剩 ${10-k} 週，可以依結果調整飲食與運動。`;
    else m=`第 ${k} 週沒有測量，不知道進度是超前還是落後。只做總結評量的話，要等到第 10 週才知道結果，那時已經來不及修正。`;
    w.querySelector('#c1tM').textContent=m;
  };
  segBind(w,'c1tm',v=>{mode=v;draw();});
  w.querySelector('#c1tR').addEventListener('click',()=>{mode='weekly';w.querySelectorAll('[data-c1tm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c1tm==='weekly'?'true':'false'));c1Set(w,'c1tw',5);});
  bindSliders(w,defs,draw);draw();
};

/* ---------- c1purpose：情境分類練習（六個目的／形成或總結） ---------- */
W.c1purpose=(w)=>{
  const SETS={
    goal:{opts:['安置','診斷','預測','動機','成就','課程評量'],items:[
      ['教練在季前測全隊體能，把選手分成三組訓練。',0,'短片 EP3 的小考','依測驗結果把人分到適合的組別，是安置。講義的說法：利用前測結果將學生依能力分組。'],
      ['體檢後，醫師依體重、血壓、膽固醇等結果，告訴父親他將來罹患心血管疾病的危險升高。',2,'講義第 8 張的情境','用現在的測量推估將來會發生的事，是預測。'],
      ['測驗後發現某位選手左腿肌力明顯比右腿弱，教練針對這個弱點加強訓練。',1,'自編例子','找出弱點或缺點，是診斷。'],
      ['老師每個月把每個人的進步幅度畫成圖給學生看，學生看到自己進步，更願意練。',3,'自編例子','藉由測量結果鼓舞學生，是動機。'],
      ['游泳課的教學目標是「能連續游 50 公尺」，期末逐一檢查每位學生有沒有做到。',4,'自編例子','依事先訂好的教學目標，評量學生達到什麼水準，是成就。'],
      ['體育室比較新體能訓練計畫實施前後全隊的測驗成績，決定下學期要不要繼續採用。',5,'自編例子','評的對象是訓練計畫本身。講義的說法：訓練計畫的正當性是依據課程評量的結果。'],
      ['開學第一週測 50 公尺游泳，會游的編到進階班，不會游的編到基礎班。',0,'自編例子','用前測結果依能力分班，是安置。']]},
    time:{opts:['形成評量','總結評量'],items:[
      ['物理治療師在治療期間，不斷用不正式的測驗評估肩關節活動範圍，再調整活動處方。',0,'講義第 19 張','在進行當中做，結果用來調整接下來的做法，是形成評量。'],
      ['修課學生在學期結束時拿到的最後等第分數。',1,'講義第 20 張','教學告一段落後的最後評價，是總結評量。'],
      ['減重者的目標是減輕 4.5 公斤，他每週持續測量體重與體脂。',0,'講義第 20 張','過程中持續量，隨時可以修正，是形成評量。'],
      ['同一位減重者，到第十週檢視體重與體脂百分比有沒有達到目標。',1,'講義第 20 張','計畫結束時的驗收，是總結評量。'],
      ['訓練開始前先做一次前測，了解每個人的起點。',0,'講義第 19 張','講義說形成評量是「開始或進行中的評量，如前測與再測」，前測算形成評量。'],
      ['游泳課第 3 週，老師錄下每個人的換氣動作，當場告訴你哪裡要改。',0,'自編例子','還在學習過程中，回饋是為了讓你修正，是形成評量。'],
      ['學期最後一週測 1600 公尺跑走，成績計入學期總分。',1,'自編例子','教學單元結束後做、用來給最後成績，是總結評量。']]}};
  let mode='goal',k=0,st={goal:{},time:{}};
  w.innerHTML=`<div class="widget-title"><strong>這個情境，是哪一種？</strong>${segHTML('c1pm',[['goal','六個目的'],['time','形成或總結']],mode)}</div>
  <p class="note" style="margin:0" id="c1pN"></p>
  <p style="margin:0;font-size:16px;font-weight:500" id="c1pQ"></p>
  <div class="tagrow" id="c1pO"></div>
  <p class="readout" id="c1pM"></p>
  <div class="controls"><button class="btn" type="button" id="c1pPrev">上一題</button><button class="btn primary" type="button" id="c1pNext">下一題</button><button class="btn" type="button" id="c1pR">重新開始</button></div>
  <div id="c1pS"></div>
  <p class="note" style="margin:0">情境取自講義第 8、19–21 張與短片 EP3；標「自編例子」的是為了練習另外編的。選錯可以再選，直到選對。</p>`;
  const q=id=>w.querySelector('#'+id);
  const draw=()=>{
    const S0=SETS[mode],it=S0.items[k],s=st[mode][k]||{wrong:[],ok:false};
    q('c1pN').textContent=`第 ${k+1} 題／共 ${S0.items.length} 題　出處：${it[2]}`;
    q('c1pQ').textContent=it[0];
    q('c1pO').innerHTML=S0.opts.map((o,i)=>`<button type="button" class="tag${s.ok&&i===it[1]?' right':s.wrong.includes(i)?' wrong':''}" data-c1po="${i}">${o}</button>`).join('');
    q('c1pM').textContent=s.ok?`答對了，是「${S0.opts[it[1]]}」。${it[3]}`:s.wrong.length?`「${S0.opts[s.wrong[s.wrong.length-1]]}」不對，再想想：${mode==='goal'?'這次測量的結果，最後被拿去做什麼決定？':'這次評量是在過程當中做，還是告一段落之後做？'}`:(mode==='goal'?'讀完情境，選出它屬於講義六個目的中的哪一個。':'讀完情境，判斷它是形成評量還是總結評量。');
    q('c1pPrev').disabled=k===0;q('c1pNext').disabled=k===S0.items.length-1;
    const all=Object.values(st[mode]),nOk=all.filter(a=>a.ok).length,first=all.filter(a=>a.ok&&!a.wrong.length).length;
    q('c1pS').innerHTML=statsHTML([['已答對',nOk+' / '+S0.items.length,'mean'],['第一次就選對',first+' 題'],['還沒答對',(S0.items.length-nOk)+' 題',nOk===S0.items.length?'':'med']]);
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c1po]');
    if(b){const it=SETS[mode].items[k],s=st[mode][k]||(st[mode][k]={wrong:[],ok:false});if(s.ok)return;const i=+b.dataset.c1po;if(i===it[1])s.ok=true;else if(!s.wrong.includes(i))s.wrong.push(i);else{s.wrong.splice(s.wrong.indexOf(i),1);s.wrong.push(i);}draw();}
  });
  q('c1pPrev').addEventListener('click',()=>{if(k>0){k--;draw();}});
  q('c1pNext').addEventListener('click',()=>{if(k<SETS[mode].items.length-1){k++;draw();}});
  q('c1pR').addEventListener('click',()=>{st[mode]={};k=0;draw();});
  segBind(w,'c1pm',v=>{mode=v;k=0;draw();});draw();
};

/* ---------- c1target：射靶與體重計，信度與效度 ---------- */
W.c1target=(w)=>{
  // 體重計的數字與短片 EP4 相同：真正的體重 68.0；每次多 3 公斤 → 71.0、71.0、71.0；阿量的體重計 68、71、65；可靠的體重計 68.0、68.1、67.9
  const TRUE=68,U=[0,1,-1],A=[[-.7,-.5],[.6,-.6],[-.4,.7],[.75,.35],[.1,-.85],[-.8,.15]],DIR=[0.74,-0.67],LIM=0.5;
  const defs=[{id:'c1gb',label:'系統偏差：每次都多幾公斤',min:0,max:5,step:0.5,value:3,fmt:v=>'+'+v.toFixed(1)+' 公斤'},
    {id:'c1ge',label:'隨機誤差：每次上下飄多少',min:0,max:3,step:0.1,value:0,fmt:v=>'±'+v.toFixed(1)+' 公斤'}];
  w.innerHTML=`<div class="widget-title"><strong>這把尺可靠嗎？</strong><span class="note">預設：短片裡每次都多 3 公斤的體重計</span></div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" data-c1gp="3,0">每次多 3 公斤</button><button class="btn" type="button" data-c1gp="0,3">阿量的體重計</button><button class="btn" type="button" data-c1gp="0,0.1">可靠的體重計</button><button class="btn" type="button" data-c1gp="3,3">又偏又飄</button></div>
  ${SV('0 0 520 256','左邊是射靶落點，右邊是體重計三次讀數')}
  <div id="c1gS"></div><p class="readout" id="c1gM"></p>
  <p class="note" style="margin:0">真正的體重固定為 68.0 公斤。體重計與射靶是短片 EP4 補充的例子，講義只給定義：信度是測量的一致性，效度是測量的真實性。「誤差在 0.5 公斤以內才算一致、算準」是這個工具自訂的示意門檻。</p>`;
  const svg=w.querySelector('svg'),CX=132,CY=136,RR=90,x=v=>284+(v-64)/13*216;
  const draw=()=>{
    const b=val(w,'c1gb'),e=val(w,'c1ge');svg.innerHTML='';
    // 靶
    c1T(svg,CX,16,'射靶比喻：6 箭的落點',{'text-anchor':'middle',style:'font-size:13px;fill:var(--ink)'});
    [1,.66,.33].forEach((r,i)=>el('circle',{cx:CX,cy:CY,r:RR*r,style:'fill:'+(i%2?'var(--surface)':'var(--soft)')+';stroke:var(--muted);stroke-width:1'},svg));
    el('circle',{cx:CX,cy:CY,r:7,style:'fill:var(--amber)'},svg);
    const ox=CX+DIR[0]*b/5*0.8*RR,oy=CY+DIR[1]*b/5*0.8*RR,sp=(0.07+e/3*0.6)*RR;
    if(b>0)el('line',{x1:CX,y1:CY,x2:ox,y2:oy,class:'dash'},svg);
    A.forEach(p=>el('circle',{cx:ox+p[0]*sp,cy:oy+p[1]*sp,r:5,class:'pt',style:'stroke:var(--surface);stroke-width:1.5'},svg));
    c1T(svg,CX,250,e<=LIM?(b<=LIM?'集中，而且正中紅心':'集中，卻偏掉了'):'分散',{'text-anchor':'middle',style:'font-size:13px;font-weight:700;fill:var(--ink)'});
    // 體重計
    const rd=U.map(u=>TRUE+b+e*u);
    c1T(svg,284,16,'體重計量三次（公斤）',{'text-anchor':'start',style:'font-size:13px;fill:var(--ink)'});
    rd.forEach((r,i)=>{const bx=284+i*76;
      el('rect',{x:bx,y:26,width:66,height:40,rx:6,style:'fill:var(--soft);stroke:var(--ink);stroke-width:1.2'},svg);
      c1T(svg,bx+33,53,r.toFixed(1),{'text-anchor':'middle',style:'font-size:19px;font-weight:700;fill:var(--ink)'});
      c1T(svg,bx+33,82,'第 '+(i+1)+' 次',{'text-anchor':'middle'});});
    el('line',{x1:x(64),x2:x(77),y1:186,y2:186,class:'axis'},svg);
    for(let t=64;t<=77;t++){el('line',{x1:x(t),x2:x(t),y1:186,y2:190,class:'axis'},svg);if(t%2===0)c1T(svg,x(t),203,t,{'text-anchor':'middle'});}
    c1T(svg,x(77),220,'讀數（公斤）',{'text-anchor':'end'});
    el('line',{x1:x(TRUE),x2:x(TRUE),y1:122,y2:186,style:'stroke:var(--amber);stroke-width:2.4'},svg);
    c1T(svg,x(TRUE),114,'真正的體重 68.0',{'text-anchor':'middle',style:'fill:var(--amber);font-weight:500;font-size:13px'});
    rd.forEach((r,i)=>el('circle',{cx:x(r),cy:176-i*14,r:5.5,class:'pt',style:'stroke:var(--surface);stroke-width:1.5'},svg));
    // 判讀
    const rel=e<=LIM,acc=b<=LIM,range=2*e,list=rd.map(r=>r.toFixed(1)).join('、');
    const relS=rel?'高（很一致）':'低（不一致）',valS=rel?(acc?'高（量到真實值）':'低（一致但不準）'):'靠不住';
    w.querySelector('#c1gS').innerHTML=statsHTML([['信度：一致性',relS,rel?'mean':'med'],['效度：真實性',valS,rel&&acc?'mean':'med'],['三次最多差',range.toFixed(1)+' 公斤'],['平均讀數 − 真正體重',(b>0?'+':'')+b.toFixed(1)+' 公斤']]);
    let m;
    if(rel&&acc)m=`三次讀數 ${list}，幾乎一樣，而且就是真正的體重：信度高、效度也高。射靶就是每一箭都集中，而且正中紅心。`;
    else if(rel)m=`三次讀數 ${list}，很一致，所以有信度；但每次都比真正的體重多 ${b.toFixed(1)} 公斤，量到的不是真實值，沒有效度。射靶就是集中卻偏掉。`;
    else if(acc)m=`三次讀數 ${list}，最多差 ${range.toFixed(1)} 公斤，信度低。雖然三次平均起來接近 68，但你不知道哪一次可以相信；量不穩的尺，也談不上量得真。`;
    else m=`三次讀數 ${list}，最多差 ${range.toFixed(1)} 公斤，平均還多了 ${b.toFixed(1)} 公斤：既不一致也不真實，信度、效度都沒有。`;
    w.querySelector('#c1gM').textContent=m;
  };
  w.addEventListener('click',ev=>{const p=ev.target.closest('[data-c1gp]');if(p){const [b,e]=p.dataset.c1gp.split(',');c1Set(w,'c1gb',b);c1Set(w,'c1ge',e);}});
  bindSliders(w,defs,draw);draw();
};
