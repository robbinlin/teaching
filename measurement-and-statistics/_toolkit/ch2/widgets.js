/* ===== 第 2 章 互動工具：c2count / c2matrix / c2vartype / c2desc / c2sdsteps =====
   資料全部來自講義表 2-1（p.7）；BMI 由體重與身高計算。 */
const C2={
  H:['編號','性別','年齡','體重','身高','步數'],
  F:['編號','性別','年齡（歲）','體重（公斤）','身高（公分）','每天步數'],
  D:[[1,0,20,50,165,5000],[2,0,24,51,160,6000],[3,0,21,62,173,7000],[4,0,19,59,178,6500],[5,0,23,43,145,4500],
     [6,1,22,86,193,4800],[7,1,25,65,183,4000],[8,1,24,61,178,4200],[9,1,28,75,173,3900],[10,1,20,70,178,3500]],
  bmi:r=>r[3]/((r[4]/100)**2),
  P:[{k:'age',lab:'年齡',unit:'歲',col:2,d:0,sd:3,ext:45},
     {k:'wt',lab:'體重',unit:'公斤',col:3,d:0,sd:3,ext:120},
     {k:'ht',lab:'身高',unit:'公分',col:4,d:0,sd:3,ext:210},
     {k:'st',lab:'每天步數',unit:'步',col:5,d:0,sd:3,ext:15000},
     {k:'bmi',lab:'BMI',unit:'',col:-1,d:2,sd:2,ext:35}],
  vals:p=>p.col<0?C2.D.map(C2.bmi):C2.D.map(r=>r[p.col]),
  st:a=>{const n=a.length,sum=a.reduce((s,x)=>s+x,0),m=sum/n,ss=a.reduce((s,x)=>s+(x-m)**2,0);
    return{n,sum,m,ss,sd:n>1?Math.sqrt(ss/(n-1)):NaN,sdp:Math.sqrt(ss/n),min:Math.min(...a),max:Math.max(...a)};},
  f:(x,d=2)=>Number.isFinite(x)?x.toFixed(d):'—',
  sp:t=>/^[A-Za-z]/.test(t)?' '+t+' ':t,
  tags:(id,cur)=>`<div class="tagrow" id="${id}">${C2.P.map(p=>`<button type="button" class="tag" data-k="${p.k}" aria-pressed="${p.k===cur}">${p.lab}</button>`).join('')}</div>`
};

/* ---------- 概念 1：資料有多少筆（人數 × 天數） ---------- */
W.c2count=(w)=>{
  const defs=[{id:'c2cP',label:'參加者人數',min:10,max:2000,step:10,value:1000,fmt:v=>v.toLocaleString('zh-TW')+' 人'},
              {id:'c2cD',label:'每人配戴天數',min:1,max:14,step:1,value:10,fmt:v=>v+' 天'}];
  w.innerHTML=`<div class="widget-title"><strong>人數 × 天數＝幾筆資料</strong><div class="controls"><button type="button" class="btn" id="c2cR">影片的假設</button></div></div>
  ${sliders(defs)}${SV('0 0 640 132','方塊圖：一個方塊代表 100 筆資料')}
  <div class="legend"><span><i style="background:var(--accent)"></i>一個方塊＝100 筆（一人一天算一筆）</span><span><i style="background:var(--mustard)"></i>最下面的小黃塊：表 2-1 的 60 格，不到一個方塊</span></div>
  <div id="c2cS"></div><p class="readout" id="c2cM"></p>
  <p class="note" style="margin:0">人數與天數是影片 EP1 為了說明而假設的數字（1000 人、10 天）。講義第 3 張只說參加者「數量龐大」，沒有給實際人數。</p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const P=val(w,'c2cP'),D=val(w,'c2cD'),N=P*D;svg.innerHTML='';
    const cols=40,sz=13.6,gap=1.9,L=10,T=4;const full=Math.floor(N/100),rem=(N%100)/100;
    for(let i=0;i<full+(rem>0?1:0);i++){const cx=L+(i%cols)*(sz+gap),cy=T+Math.floor(i/cols)*(sz+gap);
      el('rect',{x:cx,y:cy,width:i<full?sz:Math.max(1.5,sz*rem),height:sz,rx:2,class:'bar',style:'opacity:.85'},svg);}
    el('rect',{x:L,y:116,width:sz*0.6,height:sz,rx:2,class:'must'},svg);
    w.querySelector('#c2cS').innerHTML=statsHTML([['列（一列一個人）',P.toLocaleString('zh-TW')],['欄（一天一欄）',D],['資料筆數',N.toLocaleString('zh-TW'),'mean'],['是表 2-1 的',fmt(N/60,0)+' 倍','med']]);
    const wk=D>=7?'連續 7 天以上，一定包含完整的週末兩天':D===6?'連續 6 天，至少會包含一天週末':'只戴 '+D+' 天，有可能完全沒排到週末（看從星期幾開始）';
    w.querySelector('#c2cM').textContent=`${P.toLocaleString('zh-TW')} 人 × ${D} 天＝${N.toLocaleString('zh-TW')} 筆。排成資料矩陣是 ${P.toLocaleString('zh-TW')} 列 × ${D} 欄，一格一格用手抄、用計算機按，既慢又容易出錯，所以要交給電腦。${wk}，這正是 Jessica 的團隊在問的事：要戴幾天、要不要含週末。`;};
  bindSliders(w,defs,draw);
  w.querySelector('#c2cR').addEventListener('click',()=>{[['c2cP',1000],['c2cD',10]].forEach(([id,v])=>{const i=w.querySelector('#'+id);i.value=v;i.dispatchEvent(new Event('input'));});});
  draw();
};

/* ---------- 概念 2：資料矩陣（表 2-1） ---------- */
W.c2matrix=(w)=>{
  let mode='row',r=2,c=3,bmi=false,extra=false;
  const INFO=[
    '「編號」這一欄是每個人的代號，用來認人、核對資料，不拿來計算。',
    '「性別」是類別，登錄時用 0 和 1 當代號（5 個 0、5 個 1）。講義圖 2-3 的 SPSS 截圖把 0 標成 Female（女），1 就是另一類。代號只是名字，數字的大小沒有意義。',
    '「年齡」是量出來的數量，單位是歲。這一欄裝的是 10 個人的年齡，最小 19、最大 28，平均 22.6 歲。',
    '「體重」是量出來的數量，單位是公斤。這一欄裝的是 10 個人的體重，最小 43、最大 86，平均 62.2 公斤。',
    '「身高」是量出來的數量，單位是公分。這一欄裝的是 10 個人的身高，最小 145、最大 193，平均 172.6 公分。',
    '「每天步數」是量出來的數量，單位是步。這一欄裝的是 10 個人的步數，最小 3500、最大 7000，平均 4940 步。',
    '「BMI」不是量出來的，是用體重和身高兩欄算出來的新變項：BMI＝體重（公斤）÷ 身高（公尺）²。10 個人最小 18.37、最大 25.06，平均 20.70。'];
  w.innerHTML=`<div class="widget-title"><strong>表 2-1　點一列、點一欄</strong>${segHTML('c2mm',[['row','點一列'],['col','點一欄']],'row')}</div>
  <div class="tbl-wrap"><table class="wtbl" id="c2mT"></table></div>
  <div class="formula" id="c2mF" hidden></div>
  <div id="c2mS"></div><p class="readout" id="c2mM"></p>
  <div class="in-row" style="margin:0"><button type="button" class="btn" id="c2mB"></button><button type="button" class="btn" id="c2mX"></button><button type="button" class="btn" id="c2mR">講義資料</button></div>
  <p class="note" style="margin:0">資料：講義第 7 張表 2-1，10 位受試者。點表格裡任何一格；點欄名可以直接選那一欄。</p>`;
  const draw=()=>{const nc=6+(bmi?1:0),nr=10+(extra?1:0);if(c>=nc)c=nc-1;if(r>=nr)r=nr-1;
    const heads=C2.H.concat(bmi?['BMI']:[]);
    let h=`<tr>${heads.map((t,j)=>`<th data-c="${j}" style="cursor:pointer" class="${mode==='col'&&j===c?'hl':''}">${t}</th>`).join('')}</tr>`;
    for(let i=0;i<nr;i++){const row=i<10?C2.D[i].concat(bmi?[C2.bmi(C2.D[i]).toFixed(2)]:[]):[11].concat(Array(nc-1).fill(''));
      h+=`<tr>${row.map((v,j)=>`<td data-r="${i}" data-c="${j}" style="cursor:pointer" class="${(mode==='row'&&i===r)||(mode==='col'&&j===c)?'hl':''}">${v===''?'<span style="color:var(--muted)">？</span>':v}</td>`).join('')}</tr>`;}
    w.querySelector('#c2mT').innerHTML=h;
    w.querySelector('#c2mB').textContent=bmi?'拿掉 BMI 欄':'計算新變項：加上 BMI 欄';
    w.querySelector('#c2mX').textContent=extra?'拿掉第 11 位':'多量第 11 位同學';
    w.querySelector('#c2mS').innerHTML=statsHTML([['列（人）',nr,mode==='row'?'mean':''],['欄（變項）',nc,mode==='col'?'mean':''],['格數',nr+' × '+nc+'＝'+nr*nc]]);
    const F=w.querySelector('#c2mF');const fr=C2.D[Math.min(r,9)];
    F.hidden=!bmi;if(bmi)F.innerHTML=mode==='row'&&r>=10?'第 11 位同學還沒量體重和身高，BMI 也就算不出來。':`${fr[0]} 號的 BMI＝體重 ÷ 身高（公尺）²＝<b>${fr[3]}</b> ÷ <i>${(fr[4]/100).toFixed(2)}</i>²＝${C2.bmi(fr).toFixed(2)}`;
    let m;
    if(mode==='row'){
      if(r>=10)m='第 11 列是新加入的同學，還沒量，所以整列是空的。多一個人，就是多一列；欄數不變。這位同學的數字要等實際量了才能填，不能自己編。';
      else{const d=C2.D[r];m=`第 ${r+1} 列＝${d[0]} 號受試者的全部資料：性別代號 ${d[1]}、${d[2]} 歲、${d[3]} 公斤、${d[4]} 公分、每天 ${d[5]} 步${bmi?`，算出來的 BMI 是 ${C2.bmi(d).toFixed(2)}`:''}。一列，就是一個人。`;}
    }else m=INFO[c]+(c===6?' 多一個變項，就是多一欄；人數不變。':' 一欄，就是一個變項。');
    w.querySelector('#c2mM').textContent=m;};
  w.querySelector('#c2mT').addEventListener('click',e=>{const th=e.target.closest('th[data-c]');
    if(th){mode='col';c=+th.dataset.c;w.querySelectorAll('[data-c2mm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c2mm==='col'?'true':'false'));draw();return;}
    const td=e.target.closest('td[data-r]');if(!td)return;r=+td.dataset.r;c=+td.dataset.c;draw();});
  segBind(w,'c2mm',v=>{mode=v;draw();});
  const setMode=v=>{mode=v;w.querySelectorAll('[data-c2mm]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c2mm===v?'true':'false'));};
  w.querySelector('#c2mB').addEventListener('click',()=>{bmi=!bmi;if(bmi){setMode('col');c=6;}draw();});
  w.querySelector('#c2mX').addEventListener('click',()=>{extra=!extra;if(extra){setMode('row');r=10;}draw();});
  w.querySelector('#c2mR').addEventListener('click',()=>{bmi=false;extra=false;setMode('row');r=2;c=3;draw();});
  draw();
};

/* ---------- 概念 3：變項檢視小練習 ---------- */
W.c2vartype=(w)=>{
  const V=[
    {zh:'編號',eg:'1、2、3 … 10',names:['id no','id','1id'],na:1,code:1,vl:0,label:'受試者編號',vals:'無',
      why:['編號只是每個人的代號，3 號不是 1 號的三倍。','每個號碼就是一個人，不是把人分成幾類，不需要數值標籤。']},
    {zh:'性別',eg:'0、1',names:['gender','gender 0 1','2gender'],na:0,code:1,vl:1,label:'性別',vals:'{0, Female}…',
      why:['0 和 1 是類別的代號，1 不比 0「大」。','不記下來，之後沒有人知道 0 是哪一類。講義圖 2-3 的截圖記的是 0＝Female。']},
    {zh:'年齡',eg:'20、24、21 …',names:['1age','age year','age'],na:2,code:0,vl:0,label:'年齡（歲）',vals:'無',
      why:['年齡是量出來的數量，28 歲比 19 歲大 9 歲。','數字本身就是答案，不需要另外解釋。']},
    {zh:'體重',eg:'50、51、62 …',names:['weight kg','weightkg','60kg'],na:1,code:0,vl:0,label:'體重（公斤）',vals:'無',
      why:['體重是量出來的數量，可以比大小、算平均。','數字本身就是答案；單位寫在標籤（Label）裡就好。']},
    {zh:'身高',eg:'165、160、173 …',names:['heightcm','height cm','1height'],na:0,code:0,vl:0,label:'身高（公分）',vals:'無',
      why:['身高是量出來的數量，可以比大小、算平均。','數字本身就是答案；單位寫在標籤（Label）裡就好。']},
    {zh:'每天步數',eg:'5000、6000、7000 …',names:['7000steps','steps per day','steps'],na:2,code:0,vl:0,label:'每天步數',vals:'無',
      why:['步數是數出來的數量，7000 步是 3500 步的兩倍。','數字本身就是答案，不需要數值標籤。']}];
  const Q=[v=>({t:'名稱（Name）要用哪一個？',o:v.names,a:v.na}),
           v=>({t:'這一欄的數字是代號，還是數量？',o:['代號（只是名字）','數量（大小有意義）'],a:v.code?0:1}),
           v=>({t:'要不要設數值標籤（Values）？',o:['要','不用'],a:v.vl?0:1})];
  let cur=1,ans=V.map(()=>[]),msg='';
  const ok=i=>Q.every((q,k)=>ans[i][k]===q(V[i]).a);
  w.innerHTML=`<div class="widget-title"><strong>變項檢視小練習</strong><div class="controls"><button type="button" class="btn" id="c2vA">看講義的設定</button><button type="button" class="btn" id="c2vR">重新練習</button></div></div>
  <div class="tagrow" id="c2vV"></div><div id="c2vQ" style="display:grid;gap:10px"></div><p class="readout" id="c2vM"></p>
  <div class="tbl-wrap"><table id="c2vT"></table></div>
  <p class="note" style="margin:0">名稱與數值標籤照講義第 9 張圖 2-3 的 SPSS 截圖（id、gender、age、weightkg、heightcm），標籤改寫成中文。第六個變項截圖裡叫 milesec，表 2-1 是每天步數，這裡自訂為 steps。「不能有空格、不能用數字開頭」是 SPSS 命名的一般規定。</p>`;
  const draw=()=>{const v=V[cur];
    w.querySelector('#c2vV').innerHTML=V.map((x,i)=>`<button type="button" class="tag${ok(i)?' right':''}" data-v="${i}" aria-pressed="${i===cur&&!ok(i)}"${i===cur?' style="outline:2px solid var(--ink);outline-offset:1px"':''}>${x.zh}</button>`).join('');
    w.querySelector('#c2vQ').innerHTML=`<p style="margin:0;font-size:14px">正在設定：<strong>${v.zh}</strong>　資料長這樣：<span class="mono">${v.eg}</span></p>`+Q.map((q,k)=>{const d=q(v);return `<div><p class="note" style="margin:0 0 4px">${k+1}. ${d.t}</p><div class="tagrow">${d.o.map((o,j)=>`<button type="button" class="tag${ans[cur][k]===j?(j===d.a?' right':' wrong'):''}" data-q="${k}" data-o="${j}">${esc(o)}</button>`).join('')}</div></div>`;}).join('');
    const n=V.filter((x,i)=>ok(i)).length;
    w.querySelector('#c2vM').textContent=msg||(n===V.length?'六個變項都設定好了。':'先選一個變項，回答三個問題。答對的設定會填進下面這張「變項檢視」。')+(msg?'':`已完成 ${n} / ${V.length} 個變項。`);
    w.querySelector('#c2vT').innerHTML='<tr><th>表 2-1 的欄</th><th>名稱 Name</th><th>類型 Type</th><th>標籤 Label</th><th>數值標籤 Values</th></tr>'+V.map((x,i)=>ok(i)?`<tr><td>${x.zh}</td><td class="mono">${x.names[x.na]}</td><td>數值 Numeric</td><td>${x.label}</td><td class="mono">${x.vals}</td></tr>`:`<tr><td>${x.zh}</td><td colspan="4" style="color:var(--muted)">還沒設定</td></tr>`).join('');};
  w.addEventListener('click',e=>{const t=e.target.closest('[data-v]');if(t){cur=+t.dataset.v;msg='';draw();return;}
    const b=e.target.closest('[data-q]');if(!b)return;const k=+b.dataset.q,j=+b.dataset.o,v=V[cur],d=Q[k](v);ans[cur][k]=j;
    if(j===d.a){msg='對。'+(k===0?`「${d.o[j]}」沒有空格、不是數字開頭，可以當名稱。`:v.why[k-1]);
      if(ok(cur)){const n=V.filter((x,i)=>ok(i)).length;msg+=` 「${v.zh}」設定完成（${n} / ${V.length}）：類型是數值（Numeric），因為登錄的都是數字${v.code&&v.vl?'，類別的意思記在數值標籤':''}。`+(n===V.length?'六個變項都設定好了，和講義圖 2-3 對照看看。':'換下一個變項。');}}
    else msg='再想想。'+(k===0?(/\s/.test(d.o[j])?'SPSS 的變項名稱中間不能有空格。':'SPSS 的變項名稱不能用數字開頭。'):k===1?(v.code?'想一想：這一欄的數字能不能比大小、算平均？':'這一欄的數字是量出來的，大小有意義。'):(v.vl?'如果不記下來，之後誰知道 0 和 1 各代表哪一類？':'數值標籤是用來解釋「代號代表哪一類」的；這一欄不是分類。'));
    draw();});
  w.querySelector('#c2vA').addEventListener('click',()=>{ans=V.map(v=>Q.map(q=>q(v).a));msg='對照講義圖 2-3 的設定：六個變項的類型都是數值（Numeric），只有性別需要數值標籤。';draw();});
  w.querySelector('#c2vR').addEventListener('click',()=>{ans=V.map(()=>[]);cur=1;msg='';draw();});
  draw();
};

/* ---------- 概念 5：一欄數字的描述統計 ---------- */
W.c2desc=(w)=>{
  let cur=C2.P[0];
  const txt=p=>C2.vals(p).map(v=>p.d?v.toFixed(p.d):String(v)).join(', ');
  const parse=s=>s.split(/[^0-9.\-]+/).filter(t=>t!==''&&t!=='-'&&t!=='.').map(Number).filter(Number.isFinite);
  w.innerHTML=`<div class="widget-title"><strong>一欄數字，五個統計量</strong><span class="note">可以直接改下面的數字</span></div>
  ${C2.tags('c2dP','age')}
  <textarea class="nums" id="c2dT" aria-label="數列，用逗號或空白分開" spellcheck="false"></textarea>
  <div class="in-row" style="margin:0"><button type="button" class="btn" id="c2dX">加入一個極端值</button><button type="button" class="btn" id="c2dR">講義資料</button></div>
  ${SV('0 0 640 190','點圖：每一點是一個人，標出平均數與正負一個標準差')}
  <div class="legend"><span><i style="background:var(--accent)"></i>每一點是一個人</span><span><i style="background:var(--amber)"></i>平均數</span><span><i style="background:var(--mustard)"></i>平均 ± 1 個標準差</span><span><i style="background:var(--ink)"></i>超出講義資料範圍的數字</span></div>
  <div id="c2dS"></div><p class="readout" id="c2dM"></p>
  <p class="note" style="margin:0">預設是講義表 2-1 的資料。標準差除以 N−1，和 SPSS、講義表 2-2、Excel 的 STDEV.S 相同。「極端值」是自編的示範數字（年齡 45、體重 120、身高 210、步數 15000、BMI 35），不是講義資料。</p>`;
  const ta=w.querySelector('#c2dT'),svg=w.querySelector('svg');
  const draw=()=>{const a=parse(ta.value),base=parse(txt(cur)),b=C2.st(base),u=cur.unit?' '+cur.unit:'';svg.innerHTML='';
    if(a.length<2){w.querySelector('#c2dS').innerHTML=statsHTML([['個數 N',a.length],['最小值','—'],['最大值','—'],['總和','—'],['平均數','—'],['標準差（N−1）','—']]);w.querySelector('#c2dM').textContent='至少要有兩個數字才能算標準差。數字之間用逗號或空白分開。';return;}
    const s=C2.st(a),dec=a.every(Number.isInteger)?0:2;
    const lo0=Math.min(s.min,s.m-s.sd),hi0=Math.max(s.max,s.m+s.sd),span=(hi0-lo0)||1,lo=lo0-span*0.07,hi=hi0+span*0.07;
    const VW=Math.max(300,Math.min(640,Math.round(svg.clientWidth)||640));svg.setAttribute('viewBox','0 0 '+VW+' 190');
    const L=20,R=VW-20,T=24,B=140;const x=v=>L+(v-lo)/(hi-lo)*(R-L);
    const x1=x(s.m-s.sd),x2=x(s.m+s.sd);
    el('rect',{x:x1,y:T,width:Math.max(0,x2-x1),height:B-T,class:'must',opacity:.3},svg);
    const step=niceStep(hi-lo,VW<440?4:6);axisX(svg,x,lo,hi,B,step,v=>C2.f(v,step<0.1?2:step<1?1:0),cur.lab+(cur.unit?'（'+cur.unit+'）':''),L,R);
    {const s1='−1 SD '+C2.f(s.m-s.sd,2),s2='＋1 SD '+C2.f(s.m+s.sd,2),w1=s1.length*6.8+8,w2=s2.length*6.8+8,bw=x2-x1;
      if(bw>=Math.max(w1,w2)){const two=bw<w1+w2+10;const t1=el('text',{x:x1+4,y:T+12},svg);t1.textContent=s1;const t2=el('text',{x:x2-4,y:T+(two?26:12),'text-anchor':'end'},svg);t2.textContent=s2;}}
    const cnt={};a.forEach(v=>{const k=v.toFixed(4);const j=cnt[k]=(cnt[k]||0)+1;const out=v<b.min-1e-9||v>b.max+1e-9;
      el('circle',{cx:x(v),cy:Math.max(T+34,B-9-(j-1)*14),r:6,class:out?'':'pt',style:(out?'fill:var(--ink);':'')+'stroke:var(--surface);stroke-width:1.5'},svg);});
    el('line',{x1:x(s.m),x2:x(s.m),y1:T-6,y2:B,class:'median'},svg);
    const tm=el('text',{x:Math.max(L+46,Math.min(R-46,x(s.m))),y:12,'text-anchor':'middle',class:'medlab'},svg);tm.textContent='平均 '+C2.f(s.m,2);
    w.querySelector('#c2dS').innerHTML=statsHTML([['個數 N',s.n],['最小值',C2.f(s.min,dec)],['最大值',C2.f(s.max,dec)],['總和',C2.f(s.sum,dec)],['平均數',C2.f(s.m,2),'med'],['標準差（N−1）',C2.f(s.sd,cur.sd),'mean']]);
    const same=a.length===base.length&&a.every((v,i)=>Math.abs(v-base[i])<1e-9);
    const within=a.filter(v=>v>=s.m-s.sd&&v<=s.m+s.sd).length;
    let m;
    if(same)m=`${s.n} 個人的${C2.sp(cur.lab)}從 ${C2.f(s.min,dec)} 到 ${C2.f(s.max,dec)}${u}，加起來 ${C2.f(s.sum,dec)}，除以 ${s.n}，平均 ${C2.f(s.m,2)}${u}。標準差 ${C2.f(s.sd,cur.sd)}${u}，${s.n} 個人裡有 ${within} 個落在平均上下一個標準差（${C2.f(s.m-s.sd,2)}～${C2.f(s.m+s.sd,2)}）之內。`+(cur.k==='bmi'?'BMI 是用體重和身高算出來的新變項，結果和影片 EP4 一樣。':'和講義表 2-2 的數字一樣。');
    else{m=`現在有 ${s.n} 個數字。和講義資料相比：平均 ${C2.f(b.m,2)} → ${C2.f(s.m,2)}，標準差 ${C2.f(b.sd,cur.sd)} → ${C2.f(s.sd,cur.sd)}。`;
      m+=s.sd>b.sd*1.3?'離群的數字會把平均拉過去，標準差更是明顯變大，因為它看的是每個數字離平均有多遠。':s.sd<b.sd*0.8?'數字彼此靠近了，標準差就變小。':'數字變了，統計量也跟著變。';
      m+='按「講義資料」可以回到原始數字。';}
    w.querySelector('#c2dM').textContent=m;};
  const load=p=>{cur=p;ta.value=txt(p);w.querySelectorAll('#c2dP .tag').forEach(t=>t.setAttribute('aria-pressed',t.dataset.k===p.k?'true':'false'));draw();};
  w.querySelector('#c2dP').addEventListener('click',e=>{const t=e.target.closest('[data-k]');if(t)load(C2.P.find(p=>p.k===t.dataset.k));});
  ta.addEventListener('input',draw);
  if(window.ResizeObserver){let lastW=0;new ResizeObserver(()=>{const cw=Math.round(svg.clientWidth);if(cw&&Math.abs(cw-lastW)>2){lastW=cw;draw();}}).observe(svg.parentElement);}
  w.querySelector('#c2dX').addEventListener('click',()=>{ta.value=ta.value.replace(/[\s,，]+$/,'')+', '+cur.ext;draw();});
  w.querySelector('#c2dR').addEventListener('click',()=>load(cur));
  load(cur);
};

/* ---------- 概念 6：標準差一步一步算 ---------- */
W.c2sdsteps=(w)=>{
  let cur=C2.P[0],div='n1';
  w.innerHTML=`<div class="widget-title"><strong>標準差一步一步算</strong>${segHTML('c2sv',[['n1','除以 N−1'],['n','除以 N']],'n1')}</div>
  ${C2.tags('c2sP','age')}
  <div class="tbl-wrap"><table class="wtbl" id="c2sT"></table></div>
  <div class="formula" id="c2sF"></div><div id="c2sS"></div><p class="readout" id="c2sM"></p>
  <div class="in-row" style="margin:0"><button type="button" class="btn" id="c2sR">講義資料</button></div>
  <p class="note" style="margin:0">資料：講義表 2-1。表中的數字四捨五入顯示，計算用的是完整數值。黃色那一列是離平均最遠的人。</p>`;
  const draw=()=>{const a=C2.vals(cur),s=C2.st(a),d=cur.d,u=cur.unit?' '+cur.unit:'';const dd=d?2:1;
    const sq=a.map(v=>(v-s.m)**2),mx=sq.indexOf(Math.max(...sq));
    w.querySelector('#c2sT').innerHTML=`<tr><th>編號</th><th>${cur.lab} X</th><th>X − 平均</th><th>（X − 平均）²</th></tr>`+
      a.map((v,i)=>`<tr><td class="${i===mx?'hl':''}">${i+1}</td><td class="${i===mx?'hl':''}">${C2.f(v,d)}</td><td class="${i===mx?'hl':''}">${(v-s.m>=0?'+':'−')+C2.f(Math.abs(v-s.m),dd)}</td><td class="${i===mx?'hl':''}">${C2.f(sq[i],2)}</td></tr>`).join('')+
      `<tr class="sum"><td>合計</td><td>${C2.f(s.sum,d)}</td><td>0</td><td>${C2.f(s.ss,2)}</td></tr>`;
    const k=div==='n1'?s.n-1:s.n,vr=s.ss/k,sd=Math.sqrt(vr);
    w.querySelector('#c2sF').innerHTML=`平均＝${C2.f(s.sum,d)} ÷ ${s.n}＝${C2.f(s.m,2)}<br>變異數＝<b>${C2.f(s.ss,2)}</b> ÷ <i>${k}</i>＝${C2.f(vr,2)}<br>標準差＝√${C2.f(vr,2)}＝${C2.f(sd,cur.sd)}`;
    w.querySelector('#c2sS').innerHTML=statsHTML([['平均數',C2.f(s.m,2),'med'],['離差平方和',C2.f(s.ss,2)],['除以',k+(div==='n1'?'（N−1）':'（N）')],['變異數',C2.f(vr,2)],['標準差',C2.f(sd,cur.sd),'mean']]);
    const pct=Math.round(sq[mx]/s.ss*100);
    w.querySelector('#c2sM').textContent=(div==='n1'?`除以 N−1（${k}）得到標準差 ${C2.f(s.sd,cur.sd)}${u}，${cur.k==='bmi'?'和影片 EP4 的 BMI 標準差一樣':'和講義表 2-2、SPSS 的結果一樣'}；Excel 用 STDEV.S。`:`除以 N（${k}）得到 ${C2.f(s.sdp,cur.sd)}${u}，比除以 N−1 的 ${C2.f(s.sd,cur.sd)} 小一點；Excel 用 STDEV.P。SPSS 的描述統計表用的是 N−1，所以對不上${cur.k==='bmi'?'影片 EP4 的 2.13':'表 2-2'}。`)+` ${mx+1} 號（${C2.f(a[mx],d)}${u}）離平均最遠，一個人就占了離差平方和的 ${pct}%。`;};
  const pick=p=>{cur=p;w.querySelectorAll('#c2sP .tag').forEach(t=>t.setAttribute('aria-pressed',t.dataset.k===p.k?'true':'false'));draw();};
  w.querySelector('#c2sP').addEventListener('click',e=>{const t=e.target.closest('[data-k]');if(t)pick(C2.P.find(p=>p.k===t.dataset.k));});
  segBind(w,'c2sv',v=>{div=v;draw();});
  w.querySelector('#c2sR').addEventListener('click',()=>{div='n1';w.querySelectorAll('[data-c2sv]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c2sv==='n1'?'true':'false'));pick(C2.P[0]);});
  draw();
};
