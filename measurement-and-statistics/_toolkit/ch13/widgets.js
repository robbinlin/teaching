/* ===== 第 13 章　課室評等：互動工具 ===== */

/* ---------- c13composite：直接加總與 T 分數加權（講義表 13-1 的四位學生） ---------- */
W.c13composite=(w)=>{
  const M=[5,5,23],SD=[Math.sqrt(100/24),Math.sqrt(100/24),Math.sqrt(14/24)],FULL=[9,9,27],NAMES=['A','B','C','D'];
  const BASE=[[5,5,24],[8,7,22],[9,5,23],[3,3,24]];
  let X=BASE.map(r=>r.slice()),mode='raw',sel=1;
  const defs=[0,1,2].map(j=>({id:'c13cpW'+j,label:'測驗 '+(j+1)+' 的比重',min:0,max:10,step:1,value:j===2?6:2,fmt:v=>v+' 份'}));
  w.innerHTML=`<div class="widget-title"><strong>四位學生：直接加總，還是換成 T 分數再乘比重</strong><div class="controls"><button class="btn" type="button" data-c13cp="2,2,6">講義表 13-1（比重 2：2：6）</button><button class="btn" type="button" data-c13cp="1,1,1">三個測驗一樣重</button></div></div>
  ${segHTML('c13cpm',[['raw','原始分數直接加總'],['t','T 分數加權']],'raw')}
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th>學生</th><th>測驗 1<br>滿分 9</th><th>測驗 2<br>滿分 9</th><th>測驗 3<br>滿分 27</th><th id="c13cpH"></th><th>名次</th></tr></thead>
  <tbody>${NAMES.map((n,i)=>`<tr><td>${n}</td>${[0,1,2].map(j=>`<td><input type="number" inputmode="decimal" step="1" data-c13cr="${i}" data-c13cc="${j}" value="${X[i][j]}" style="width:46px;padding:4px 3px" aria-label="學生 ${n} 測驗 ${j+1}"><div class="note" id="c13cpT${i}${j}"></div></td>`).join('')}<td class="hl" id="c13cpR${i}"></td><td id="c13cpK${i}"></td></tr>`).join('')}
  <tr class="sum"><td>全班平均</td><td>5</td><td>5</td><td>23</td><td></td><td></td></tr>
  <tr><td>全班標準差</td><td>2.04</td><td>2.04</td><td>0.76</td><td></td><td></td></tr></tbody></table></div>
  ${sliders(defs)}
  ${SV('0 0 640 250','上方兩條長條比較老師想要的比重與實際的份量，下方是四位學生的結果')}
  <div class="legend"><span><i style="background:var(--accent)"></i>測驗 1</span><span><i style="background:var(--mustard)"></i>測驗 2</span><span><i style="background:var(--amber)"></i>測驗 3</span></div>
  <div class="tagrow" id="c13cpS">${NAMES.map((n,i)=>`<button type="button" class="tag" data-c13cs="${i}">看學生 ${n} 的算式</button>`).join('')}</div>
  <div class="formula" style="white-space:normal;line-height:1.7" id="c13cpF"></div><div id="c13cpSt"></div><p class="readout" id="c13cpM"></p>
  <p class="note" style="margin:0">全班平均與標準差由表 13-1 的 25 人次數分配算出（標準差除以 N−1），固定不動；四位學生的分數可以改。「實際的份量」用各測驗標準差的佔比來表示，是粗略的指標。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const COL=['var(--accent)','var(--mustard)','var(--amber)'];
  const r1=v=>Math.round(v*10)/10;
  const ranks=a=>a.map(v=>1+a.filter(u=>r1(u)>r1(v)).length);
  const draw=()=>{
    const ws=defs.map(d=>val(w,d.id)),sw=ws[0]+ws[1]+ws[2];
    const P=sw>0?ws.map(v=>v/sw):[0,0,0];
    const T=X.map(r=>r.map((v,j)=>50+10*(v-M[j])/SD[j]));
    const raw=X.map(r=>r[0]+r[1]+r[2]),comp=T.map(r=>r[0]*P[0]+r[1]*P[1]+r[2]*P[2]);
    const isT=mode==='t',res=isT?comp:raw,rk=ranks(res),rkRaw=ranks(raw),rkT=ranks(comp);
    const show=v=>isT?v.toFixed(1):String(+v.toFixed(2));
    q('c13cpH').innerHTML=isT?'複合分數':'總分';
    X.forEach((r,i)=>{r.forEach((v,j)=>{q('c13cpT'+i+j).textContent=isT?'T '+T[i][j].toFixed(1):'';});q('c13cpR'+i).textContent=show(res[i]);q('c13cpK'+i).textContent=rk[i];});
    defs.forEach(d=>{q(d.id).disabled=!isT;});
    w.querySelectorAll('[data-c13cs]').forEach(b=>b.classList.toggle('on',+b.dataset.c13cs===sel));
    svg.innerHTML='';const VW=nar()?400:640,L=nar()?12:16,R=VW-(nar()?12:16);svg.setAttribute('viewBox','0 0 '+VW+' 250');
    const share=(yy,lab,ps)=>{txt(lab,{x:L,y:yy-6,'text-anchor':'start'});let x0=L;ps.forEach((p,j)=>{const ww=p*(R-L);if(ww>0){el('rect',{x:x0,y:yy,width:ww,height:20,style:'fill:'+COL[j]+';opacity:.85'},svg);if(ww>34)txt(Math.round(p*100)+'%',{x:x0+ww/2,y:yy+14,'text-anchor':'middle',style:'fill:var(--surface);font-weight:500'});}x0+=ww;});};
    const sds=SD[0]+SD[1]+SD[2];
    share(18,isT?'你訂的比重':'照滿分看：測驗 3 佔 27 ÷ 45 ＝ 60%',isT?P:FULL.map(v=>v/45));
    share(64,isT?'T 分數加權後，各測驗實際的份量':'直接加總時，各測驗實際的份量（標準差佔比）',isT?P:SD.map(v=>v/sds));
    const lo=isT?20:0,hi=isT?80:45,BL=L+30,BR=R-(nar()?74:86),x=v=>BL+(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*(BR-BL);
    NAMES.forEach((n,i)=>{const yy=110+i*26;txt(n,{x:L+4,y:yy+14,'text-anchor':'start',class:'grp'});el('rect',{x:BL,y:yy,width:Math.max(1,x(res[i])-BL),height:18,class:i===sel?'bar2 sel':'bar sel'},svg);txt(show(res[i])+'　第 '+rk[i]+' 名',{x:x(res[i])+6,y:yy+13,'text-anchor':'start'});});
    axisX(svg,x,lo,hi,216,isT?10:5,null,isT?'複合分數（T 分數 × 比重）':'原始總分（滿分 45）',BL,BR);
    const n=NAMES[sel],xs=X[sel],ts=T[sel],pc=P.map(p=>Math.round(p*100)+'%');
    q('c13cpF').innerHTML=isT?
      `學生 ${n} 的測驗 1：T ＝ (${xs[0]} − 5) ÷ 2.04 × 10 ＋ 50 ＝ <b>${ts[0].toFixed(1)}</b>。複合分數 ＝ <b>${ts[0].toFixed(1)}</b> × ${pc[0]} ＋ <b>${ts[1].toFixed(1)}</b> × ${pc[1]} ＋ <b>${ts[2].toFixed(1)}</b> × ${pc[2]} ＝ <i>${comp[sel].toFixed(1)}</i>`:
      `學生 ${n} 的總分 ＝ <b>${xs[0]}</b> ＋ <b>${xs[1]}</b> ＋ <b>${xs[2]}</b> ＝ <i>${+raw[sel].toFixed(2)}</i>（比重沒有用到）`;
    const ord=NAMES.map((_,i)=>i).sort((a,b)=>res[b]-res[a]);
    const ordS=ord.map((i,k)=>(k?(r1(res[ord[k-1]])===r1(res[i])?' ＝ ':' ＞ '):'')+NAMES[i]+' '+show(res[i])).join('');
    q('c13cpSt').innerHTML=statsHTML([['第 1 名',ord.filter(i=>rk[i]===1).map(i=>NAMES[i]).join('、'),'mean'],['最後一名',ord.filter(i=>rk[i]===Math.max(...rk)).map(i=>NAMES[i]).join('、'),'med'],['B 的結果',show(res[1])],['D 的結果',show(res[3])],['B、D 原始總分',(+raw[1].toFixed(2))+'、'+(+raw[3].toFixed(2))]]);
    let msg=(isT?'T 分數加權：':'直接加總：')+ordS+'。';
    if(!isT)msg+='直接加總沒有用到比重。測驗 3 的滿分佔六成，可是全班只在 22 到 24 分之間（標準差 0.76），實際的份量只有約 16%；名次幾乎由散得開的測驗 1、測驗 2 決定。切到「T 分數加權」看看名次怎麼變。';
    else if(sw===0)msg='三個比重都是 0，算不出複合分數。至少給一個測驗比重。';
    else{msg+='每個測驗都換成平均 50、標準差 10 的 T 分數，再乘上比重，各測驗的份量才會等於你訂的比重。';
      if(rkRaw[1]<rkRaw[3]&&rkT[3]<rkT[1])msg+=`直接加總時 B（${+raw[1].toFixed(2)}）贏 D（${+raw[3].toFixed(2)}）；現在 D ${comp[3].toFixed(1)}、B ${comp[1].toFixed(1)}，名次反過來了。`;
      else if(rkRaw[1]<rkRaw[3])msg+='這組比重下 B 仍然排在 D 前面：測驗 3 的比重要夠高，D 才追得上。';}
    q('c13cpM').textContent=msg;
  };
  segBind(w,'c13cpm',v=>{mode=v;draw();});
  bindSliders(w,defs,draw);window.addEventListener('resize',draw);
  w.addEventListener('input',e=>{const t=e.target;if(t.dataset.c13cr===undefined)return;const v=parseFloat(t.value);if(!isFinite(v))return;X[+t.dataset.c13cr][+t.dataset.c13cc]=v;draw();});
  w.addEventListener('click',e=>{const s=e.target.closest('[data-c13cs]');if(s){sel=+s.dataset.c13cs;draw();return;}
    const b=e.target.closest('[data-c13cp]');if(!b)return;const ws=b.dataset.c13cp.split(',');
    X=BASE.map(r=>r.slice());w.querySelectorAll('[data-c13cr]').forEach(i=>{i.value=X[+i.dataset.c13cr][+i.dataset.c13cc];});
    defs.forEach((d,j)=>{const i=q(d.id);i.disabled=false;i.value=ws[j];i.dispatchEvent(new Event('input'));});});
  draw();
};

/* ---------- c13tscore：常態化方式（講義表 13-4、表 13-3） ---------- */
W.c13tscore=(w)=>{
  const PRE={t4:{s:[85,74,63,59,53,47],f:[1,1,1,1,1,1],pick:63},t1:{s:[9,8,7,6,5,4,3,2,1],f:[1,2,3,4,5,4,3,2,1],pick:8}};
  let pick=63;
  w.innerHTML=`<div class="widget-title"><strong>常態化方式：分數 → 百分等級 → T 分數</strong><div class="controls"><button class="btn" type="button" data-c13ts="t4">講義表 13-4</button><button class="btn" type="button" data-c13ts="t1">表 13-1 測驗 1（25 人）</button></div></div>
  <label for="c13tsS" class="note">原始分數（用逗號或空白分開）</label><textarea class="nums" id="c13tsS" rows="2" spellcheck="false"></textarea>
  <label for="c13tsFq" class="note">每個分數的次數（順序和上面對齊）</label><textarea class="nums" id="c13tsFq" rows="2" spellcheck="false"></textarea>
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th>原始分數</th><th>次數 f</th><th>累積次數 cf</th><th>中點 cfm</th><th>百分等級</th><th>查表 T 分數</th></tr></thead><tbody id="c13tsB"></tbody></table></div>
  <div class="tagrow" id="c13tsP"></div>
  ${SV('0 0 640 210','常態曲線上標出每個原始分數換算後的 T 分數，塗色面積是所選分數的百分等級')}
  <div class="formula" style="white-space:normal;line-height:1.7" id="c13tsF"></div><div id="c13tsSt"></div><p class="readout" id="c13tsM"></p>
  <p class="note" style="margin:0">查表用的是表 13-3：找最接近的百分等級，讀出它的 T 分數（表上只有 T＝15 到 85）。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const parse=id=>q(id).value.split(/[\s,，、;；]+/).filter(t=>t!=='').map(Number);
  const tabPR=T=>+(ST.pnorm((T-50)/10)*100).toFixed(2);
  const look=pr=>{let best=15;for(let T=15;T<=85;T++){if(Math.abs(tabPR(T)-pr)<Math.abs(tabPR(best)-pr)-1e-9)best=T;}return best;};
  const g=v=>String(+v.toFixed(2));
  const draw=()=>{
    const s=parse('c13tsS'),f=parse('c13tsFq');
    if(s.length<2||s.length!==f.length||s.concat(f).some(v=>!isFinite(v))||f.some(v=>v<=0)){q('c13tsM').textContent=`分數和次數要一樣多（目前 ${s.length} 個和 ${f.length} 個），至少 2 個分數，次數要大於 0。`;return;}
    const mp=new Map();s.forEach((v,i)=>mp.set(v,(mp.get(v)||0)+f[i]));
    const rows=[...mp.entries()].sort((a,b)=>a[0]-b[0]).map(([v,ff])=>({v,f:ff}));
    let cf=0;const N=rows.reduce((t,r)=>t+r.f,0);
    rows.forEach(r=>{r.below=cf;cf+=r.f;r.cf=cf;r.cfm=r.below+r.f/2;r.pr=r.cfm/N*100;r.T=look(r.pr);});
    if(!rows.some(r=>r.v===pick))pick=rows[Math.floor(rows.length/2)].v;
    const cur=rows.find(r=>r.v===pick),desc=rows.slice().reverse();
    q('c13tsB').innerHTML=desc.map(r=>`<tr><td${r===cur?' class="hl"':''}>${g(r.v)}</td><td>${g(r.f)}</td><td>${g(r.cf)}</td><td>${g(r.cfm)}</td><td${r===cur?' class="hl"':''}>${r.pr.toFixed(1)}</td><td${r===cur?' class="hl"':''}>${r.T}</td></tr>`).join('')+`<tr class="sum"><td>合計</td><td>${g(N)}</td><td></td><td></td><td></td><td></td></tr>`;
    q('c13tsP').innerHTML=desc.map(r=>`<button type="button" class="tag${r===cur?' on':''}" data-c13tp="${r.v}">${g(r.v)} 分</button>`).join('');
    svg.innerHTML='';const VW=nar()?400:640,L=14,R=VW-14,B=160,Tp=34;svg.setAttribute('viewBox','0 0 '+VW+' 210');
    const x=t=>L+(t-15)/70*(R-L),fz=t=>ST.dnorm((t-50)/10),y=v=>B-v/fz(50)*(B-Tp);
    curveArea(svg,x,y,fz,15,cur.T,'area-p');curve(svg,x,y,fz,15,85,'curve');
    axisX(svg,x,20,80,B,10,null,'T 分數',L,R);
    rows.forEach((r,i)=>{const c=r===cur;el('line',{x1:x(r.T),x2:x(r.T),y1:y(fz(r.T)),y2:B,class:c?'ln2':'dash'},svg);el('circle',{cx:x(r.T),cy:y(fz(r.T)),r:c?6:4,class:c?'pt2':'pt'},svg);
      txt(g(r.v),{x:x(r.T),y:y(fz(r.T))-(i%2?20:9),'text-anchor':'middle',class:c?'medlab':''});});
    txt('圓點上的數字是原始分數',{x:L,y:12,'text-anchor':'start'});
    q('c13tsF').innerHTML=`${g(cur.v)} 分：cfm ＝ 比它低的 <b>${g(cur.below)}</b> 人 ＋ 自己的一半 <b>${g(cur.f/2)}</b> ＝ ${g(cur.cfm)}；百分等級 ＝ ${g(cur.cfm)} ÷ ${g(N)} × 100 ＝ <b>${cur.pr.toFixed(1)}</b>；表 13-3 最接近的是 ${tabPR(cur.T).toFixed(2)} → T ＝ <i>${cur.T}</i>`;
    q('c13tsSt').innerHTML=statsHTML([['人數 N',g(N)],['選的分數',g(cur.v)],['累積次數中點',g(cur.cfm)],['百分等級',cur.pr.toFixed(1),'mean'],['T 分數',cur.T,'med']]);
    q('c13tsM').textContent=`${g(cur.v)} 分的百分等級是 ${cur.pr.toFixed(1)}：把同分的人算一半，全班約有 ${cur.pr.toFixed(1)}% 的人在它之下（圖上塗色的面積）。查表得 T 分數 ${cur.T}，${cur.T>50?'高於 50，在全班中間以上':cur.T<50?'低於 50，在全班中間以下':'剛好在全班正中間'}。常態化方式只用到名次，所以不管原始分數的分配長什麼樣子，換出來的 T 分數都會排成接近常態的形狀。`;
  };
  const load=k=>{q('c13tsS').value=PRE[k].s.join(', ');q('c13tsFq').value=PRE[k].f.join(', ');pick=PRE[k].pick;draw();};
  q('c13tsS').addEventListener('input',draw);q('c13tsFq').addEventListener('input',draw);window.addEventListener('resize',draw);
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c13ts]');if(b){load(b.dataset.c13ts);return;}const p=e.target.closest('[data-c13tp]');if(p){pick=+p.dataset.c13tp;draw();}});
  load('t4');
};

/* ---------- c13cut：把 65 個複合分數切成等第（講義表 13-7，四種切法） ---------- */
W.c13cut=(w)=>{
  const DATA=[98,93,91,88,86,85,83,81,81,79,78,78,77,76,75,74,73,73,72,71,71,70,69,68,67,67,66,65,65,65,64,64,63,63,63,63,62,62,61,61,60,59,57,57,56,56,55,55,54,53,52,51,50,48,47,47,46,45,44,41,40,38,37,36,26];
  const N=DATA.length,MEAN=ST.mean(DATA),SDV=ST.sd(DATA),G=['A','B','C','D','F'];
  const GC=['var(--accent)','var(--mustard)','var(--muted)','var(--amber)','var(--ink)'];
  const MODES=[['obs','觀察法'],['pct','預定百分比法'],['c1','依曲線・方法一'],['c2','依曲線・方法二']];
  const DEF=()=>({obs:[98,91,44,36],pct:[15,25,45,10],z1:0.6,z2:1.8,q1:0.47,q2:1.47,query:88});
  let S=DEF(),mode='c1';
  const sl1=[{id:'c13cuZ1',label:'B 與 C、C 與 D 的切點：平均 ±',min:0.2,max:1.2,step:0.05,value:0.6,fmt:v=>v.toFixed(2)+' 個標準差'},{id:'c13cuZ2',label:'A 與 B、D 與 F 的切點：平均 ±',min:1.3,max:2.4,step:0.05,value:1.8,fmt:v=>v.toFixed(2)+' 個標準差'}];
  const sl2=[{id:'c13cuQ1',label:'C 的範圍：平均 ±',min:0.2,max:1,step:0.01,value:0.47,fmt:v=>v.toFixed(2)+' 個標準差'},{id:'c13cuQ2',label:'A、F 從幾個標準差以外開始',min:1.1,max:2.2,step:0.01,value:1.47,fmt:v=>v.toFixed(2)+' 個標準差'}];
  w.innerHTML=`<div class="widget-title"><strong>同一批分數，四種切法</strong><div class="controls"><button class="btn" type="button" id="c13cuRs">講義設定</button></div></div>
  ${segHTML('c13cum',MODES,'c1')}
  <div id="c13cuP"></div>
  <div class="in-row"><label for="c13cuQy"><span>查一個分數在四種切法下的等第</span><input class="num-in" type="number" id="c13cuQy" value="88" min="0" max="100" step="1" inputmode="decimal"></label></div>
  ${SV('0 0 640 190','65 個複合分數的點圖，顏色代表等第，虛線是等第的切點')}
  <div class="legend">${G.map((g,i)=>`<span><i style="background:${GC[i]}"></i>${g}</span>`).join('')}<span>黑色直線：查詢的分數</span></div>
  <div class="formula" style="white-space:normal;line-height:1.7" id="c13cuF"></div>
  <div class="tbl-wrap"><table class="wtbl"><thead><tr><th>切法</th><th>A</th><th>B</th><th>C</th><th>D</th><th>F</th><th id="c13cuTh"></th></tr></thead><tbody id="c13cuT"></tbody></table></div>
  <p class="readout" id="c13cuM"></p>
  <p class="note" style="margin:0">資料是表 13-7 的 65 個複合分數（平均 63.4、標準差 15.09）。講義的觀察法、預定百分比法是用表 13-5、表 13-6 示範的；這裡把同樣的做法套到表 13-7（百分比沿用表 13-6 的 15、25、45、10、5%），方便和依曲線訂等第比較。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
  const half=v=>Math.floor(v+0.5);
  /* 由高分往下數：切在同分群的邊界上，取最接近目標人數的位置 */
  const byCum=cum=>{const bounds=[0,N];for(let i=1;i<N;i++)if(DATA[i-1]!==DATA[i])bounds.push(i);
    return cum.map(c=>{const t=N*c;return bounds.reduce((b,v)=>(Math.abs(v-t)<Math.abs(b-t)-1e-9||(Math.abs(Math.abs(v-t)-Math.abs(b-t))<1e-9&&v<b))?v:b,bounds[0]);}).map(b=>b===0?Infinity:DATA[b-1]);};
  const acc=p=>{const o=[];let s=0;p.forEach(v=>{s+=v;o.push(s/100);});return o;};
  const pct2=()=>{const a=Math.round((1-ST.pnorm(S.q2))*100),c=Math.round((2*ST.pnorm(S.q1)-1)*100),b=Math.round((ST.pnorm(S.q2)-ST.pnorm(S.q1))*100);return [a,b,c,b,100-a-2*b-c];};
  const mins=m=>m==='obs'?S.obs.slice():m==='pct'?byCum(acc(S.pct)):m==='c1'?[MEAN+S.z2*SDV,MEAN+S.z1*SDV,MEAN-S.z1*SDV,MEAN-S.z2*SDV]:byCum(acc(pct2().slice(0,4)));
  const gradeOf=(v,mn)=>{for(let i=0;i<4;i++)if(v>=mn[i])return i;return 4;};
  const counts=mn=>{const c=[0,0,0,0,0];DATA.forEach(v=>c[gradeOf(v,mn)]++);return c;};
  const params=()=>{
    const P=q('c13cuP');
    if(mode==='obs'){P.innerHTML=`<div class="in-row">${G.slice(0,4).map((g,i)=>`<label for="c13cuO${i}"><span>${g} 的最低分</span><input class="num-in" type="number" id="c13cuO${i}" data-c13co="${i}" value="${S.obs[i]}" step="1" inputmode="decimal" style="width:74px"></label>`).join('')}</div>`;}
    else if(mode==='pct'){P.innerHTML=`<div class="in-row">${G.slice(0,4).map((g,i)=>`<label for="c13cuC${i}"><span>${g} 給幾 %</span><input class="num-in" type="number" id="c13cuC${i}" data-c13cq="${i}" value="${S.pct[i]}" min="0" max="100" step="1" inputmode="decimal" style="width:74px"></label>`).join('')}<label><span>F（剩下的）</span><b id="c13cuCF" style="font-family:var(--mono);font-weight:500"></b></label></div>`;}
    else{const d=mode==='c1'?sl1:sl2;d[0].value=mode==='c1'?S.z1:S.q1;d[1].value=mode==='c1'?S.z2:S.q2;P.innerHTML=sliders(d);
      bindSliders(w,d,()=>{if(mode==='c1'){S.z1=val(w,'c13cuZ1');S.z2=val(w,'c13cuZ2');}else{S.q1=val(w,'c13cuQ1');S.q2=val(w,'c13cuQ2');}draw();});}
  };
  const f1=v=>v.toFixed(1);
  const draw=()=>{
    const all=MODES.map(([k])=>mins(k)),mi=MODES.findIndex(m=>m[0]===mode),mn=all[mi],cn=counts(mn),qy=S.query;
    if(mode==='pct'){const r=100-S.pct.reduce((a,b)=>a+b,0);q('c13cuCF').textContent=r+'%';}
    svg.innerHTML='';const VW=nar()?400:640,L=14,R=VW-14,B=150,rr=nar()?3:4.2,x=v=>L+(v-20)/80*(R-L);svg.setAttribute('viewBox','0 0 '+VW+' 190');
    const edges=mn.map(v=>mode==='c1'?v:v-0.5).filter(v=>isFinite(v)&&v>20&&v<=100);
    const zone=[100].concat(mn.map(v=>mode==='c1'?v:v-0.5)).concat([20]).map(v=>Math.max(20,Math.min(100,v)));
    G.forEach((g,i)=>{const a=zone[i+1],b=zone[i];if(b-a>0.01){const t=txt(g+' '+cn[i]+' 人',{x:(x(a)+x(b))/2,y:14,'text-anchor':'middle',style:'fill:var(--ink);font-weight:500'});if(x(b)-x(a)<44)t.textContent=g;}});
    edges.forEach(v=>{el('line',{x1:x(v),x2:x(v),y1:22,y2:B,class:'dash'},svg);});
    const seen={};DATA.forEach(v=>{const k=seen[v]=(seen[v]||0)+1;el('circle',{cx:x(v),cy:B-6-(k-1)*(rr*2+1.5),r:rr,style:'fill:'+GC[gradeOf(v,mn)]},svg);});
    axisX(svg,x,20,100,B,10,null,'複合分數',L,R);
    if(qy>=20&&qy<=100){el('line',{x1:x(qy),x2:x(qy),y1:26,y2:B,class:'zline'},svg);txt(String(+qy.toFixed(1))+' 分',{x:x(qy)+(qy>60?-5:5),y:36,'text-anchor':qy>60?'end':'start',style:'fill:var(--ink);font-weight:500'});}
    const rng=m=>m.map((v,i)=>isFinite(v)?G[i]+' '+(mode==='c1'?f1(v):+v.toFixed(1))+' 以上':G[i]+' 沒有人').join('、');
    let F='';
    if(mode==='obs')F=`你訂的最低分：${rng(mn)}，其餘是 F。`;
    else if(mode==='pct'){const p=S.pct.concat([100-S.pct.reduce((a,b)=>a+b,0)]);F=`預估人數 ＝ 65 × 百分比：${p.map((v,i)=>G[i]+' <b>'+(+(N*v/100).toFixed(2))+'</b>').join('、')}。由高分往下數、同分同等第，實際是 ${cn.map((v,i)=>G[i]+' <i>'+v+'</i>').join('、')} 人。`;}
    else if(mode==='c1')F=`切點 ＝ 平均 ± 幾個標準差：63.4 − ${S.z2} × 15.09 ＝ <b>${f1(mn[3])}</b>、63.4 − ${S.z1} × 15.09 ＝ <b>${f1(mn[2])}</b>、63.4 ＋ ${S.z1} × 15.09 ＝ <b>${f1(mn[1])}</b>、63.4 ＋ ${S.z2} × 15.09 ＝ <b>${f1(mn[0])}</b>`;
    else{const p=pct2();F=`常態分配下各等第的百分比：${p.map((v,i)=>G[i]+' '+v+'%').join('、')}。乘上 65 人：${p.map(v=>'<b>'+(+(N*v/100).toFixed(2))+'</b>').join('、')}，取整數後由高分往下數：${cn.map(v=>'<i>'+v+'</i>').join('、')} 人；最低分 ${mn.map((v,i)=>isFinite(v)?G[i]+' '+v:G[i]+' 無').join('、')}。`;}
    q('c13cuF').innerHTML=F;
    q('c13cuTh').textContent=(+qy.toFixed(1))+' 分';
    const gq=all.map(m=>G[gradeOf(qy,m)]);
    q('c13cuT').innerHTML=MODES.map(([k,l],i)=>{const c=counts(all[i]);return `<tr><td${i===mi?' class="hl"':''}>${l}</td>${c.map(v=>`<td>${v}</td>`).join('')}<td class="hl">${gq[i]}</td></tr>`;}).join('');
    const same=gq.every(v=>v===gq[0]);
    let msg=`${MODES[mi][1]}：${cn.map((v,i)=>G[i]+' '+v+' 人').join('、')}。${+qy.toFixed(1)} 分在四種切法下${same?'都是 '+gq[0]:'分別是 '+gq.join('、')+'（依表格由上到下）：分數沒變，等第跟著切法變'}。`;
    if(mode==='obs')msg+='表 13-7 的分數幾乎連在一起，最大的斷層只有 36 到 26（差 10 分）、98 到 93（差 5 分）、91 到 88 與 44 到 41（各差 3 分）。照斷層切，中間的人幾乎都擠在同一個等第；觀察法適合表 13-5 那種人少、斷層明顯的班。';
    else if(mode==='pct')msg+='預估人數有小數，而且同分的人要拿同一個等第，所以實際人數常常和預估差一兩個。';
    else if(mode==='c1')msg+='切點由全班的平均數和標準差決定，每個等第有幾個人，要切下去才知道。';
    else msg+='先用常態分配決定百分比，再換成人數由高分往下數；它的 A 比方法一多，因為方法一要到平均以上 1.8 個標準差才給 A。';
    q('c13cuM').textContent=msg;
  };
  segBind(w,'c13cum',v=>{mode=v;params();draw();});
  w.addEventListener('input',e=>{const t=e.target,v=parseFloat(t.value);
    if(t.id==='c13cuQy'){if(isFinite(v)){S.query=v;draw();}return;}
    if(t.dataset.c13co!==undefined){if(isFinite(v)){S.obs[+t.dataset.c13co]=v;draw();}return;}
    if(t.dataset.c13cq!==undefined){if(isFinite(v)&&v>=0){const old=S.pct[+t.dataset.c13cq];S.pct[+t.dataset.c13cq]=v;if(S.pct.reduce((a,b)=>a+b,0)>100){S.pct[+t.dataset.c13cq]=old;q('c13cuM').textContent='四個百分比加起來不能超過 100%。';return;}draw();}}});
  q('c13cuRs').addEventListener('click',()=>{S=DEF();q('c13cuQy').value=88;params();draw();});
  window.addEventListener('resize',draw);
  params();draw();
};

/* ---------- c13standard：先訂標準再對照（講義表 13-10、13-11、13-12） ---------- */
W.c13standard=(w)=>{
  const DATA=[98,93,91,88,86,85,83,81,81,79,78,78,77,76,75,74,73,73,72,71,71,70,69,68,67,67,66,65,65,65,64,64,63,63,63,63,62,62,61,61,60,59,57,57,56,56,55,55,54,53,52,51,50,48,47,47,46,45,44,41,40,38,37,36,26];
  const TABS=[['def','定義評等（表 13-10）'],['norm','常模（表 13-11）'],['std','自訂標準（表 13-12）']];
  const DEFT=[['A','45 以上','8 以上','5'],['B','40–44','7','4'],['C','35–39','6','3'],['D','30–34','5','2'],['E','25–29','4','1']];
  const LOW=[[45,40,35,30,25],[8,7,6,5,4],[5,4,3,2,1]],DOM=['認知','技能','情意'];
  const NORM={m:{l:'男',p75:702,p25:818},f:{l:'女',p75:769,p25:852}};
  let tab='def',D=[42,7,4],sex='m',mm=12,ss=30,k=100;
  const kd=[{id:'c13stK',label:'全班離滿分的差距縮成原來的',min:10,max:100,step:5,value:100,fmt:v=>v+'%'}];
  w.innerHTML=`<div class="widget-title"><strong>先訂好標準，再拿分數去對照</strong><div class="controls"><button class="btn" type="button" id="c13stRs">回到預設</button></div></div>
  ${segHTML('c13stt',TABS,'def')}<div id="c13stB" style="display:grid;gap:12px;min-width:0"></div><p class="readout" id="c13stM"></p><p class="note" id="c13stN" style="margin:0"></p>`;
  const q=id=>w.querySelector('#'+id);
  const nar=()=>(w.clientWidth||window.innerWidth)<470;
  const ms=s=>Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0');
  const body=()=>{
    const B=q('c13stB');
    if(tab==='def')B.innerHTML=`<div class="in-row">${DOM.map((d,j)=>`<label for="c13stD${j}"><span>${d}分數</span><input class="num-in" type="number" id="c13stD${j}" data-c13sd="${j}" value="${D[j]}" step="1" inputmode="decimal" style="width:80px"></label>`).join('')}</div>
      <div class="tbl-wrap"><table class="wtbl"><thead><tr><th>等第</th><th>認知</th><th>技能</th><th>情意</th></tr></thead><tbody id="c13stTb"></tbody></table></div><div id="c13stS"></div>`;
    else if(tab==='norm')B.innerHTML=`${segHTML('c13stx',[['m','男'],['f','女']],sex)}
      <div class="in-row"><label for="c13stMi"><span>1 英里走路：分</span><input class="num-in" type="number" id="c13stMi" value="${mm}" min="5" max="30" step="1" inputmode="numeric" style="width:80px"></label><label for="c13stSe"><span>秒</span><input class="num-in" type="number" id="c13stSe" value="${ss}" min="0" max="59" step="1" inputmode="numeric" style="width:80px"></label></div>
      ${SV('0 0 640 120','時間數線，標出百分等級 75 與 25 的時間，以及輸入的成績')}<div id="c13stS"></div>`;
    else{kd[0].value=k;B.innerHTML=`${sliders(kd)}${SV('0 0 640 220','各等第人數：自訂標準與依曲線訂等第的比較')}
      <div class="legend"><span><i style="background:var(--accent)"></i>自訂標準（表 13-12：90、80、70、60 分）</span><span><i style="background:var(--amber)"></i>依曲線・方法一（平均 ±0.6、±1.8 個標準差）</span></div><div id="c13stS"></div>`;
      bindSliders(w,kd,()=>{k=val(w,'c13stK');draw();});}
  };
  const draw=()=>{
    const svg=w.querySelector('#c13stB svg');
    const txt=(s,a)=>{const t=el('text',a,svg);t.textContent=s;return t;};
    if(tab==='def'){
      const gi=D.map((v,j)=>{const i=LOW[j].findIndex(lo=>v>=lo);return i;});
      q('c13stTb').innerHTML=DEFT.map((r,i)=>`<tr><td>${r[0]}</td>${[0,1,2].map(j=>`<td${gi[j]===i?' class="hl"':''}>${r[j+1]}</td>`).join('')}</tr>`).join('');
      const gl=gi.map(i=>i<0?'表上沒有':DEFT[i][0]);
      q('c13stS').innerHTML=statsHTML(DOM.map((d,j)=>[d+'的等第',gl[j],j===0?'mean':j===1?'med':'']));
      q('c13stM').textContent=`認知 ${D[0]} 分是 ${gl[0]}、技能 ${D[1]} 分是 ${gl[1]}、情意 ${D[2]} 分是 ${gl[2]}。每個目標各有各的對照表，達到範圍就給那個等第，和同學考幾分沒有關係。`+(gi.some(i=>i<0)?'有分數低於表上最低的範圍（認知 25、技能 4、情意 1），表 13-10 沒有寫這種情況的等第。':'');
      q('c13stN').textContent='預設的 42、7、4 分是自編例子。表 13-10 的最低等第寫的是 E（其他表是 F），這裡照講義原樣。三個目標的等第怎麼合併成一個最後等第，講義沒有寫。';
    }else if(tab==='norm'){
      const P=NORM[sex],t=mm*60+ss,VW=nar()?400:640,L=16,R=VW-16,lo=600,hi=960,x=v=>L+(Math.max(lo,Math.min(hi,v))-lo)/(hi-lo)*(R-L);
      svg.innerHTML='';svg.setAttribute('viewBox','0 0 '+VW+' 120');
      el('rect',{x:x(lo),y:46,width:x(P.p75)-x(lo),height:16,style:'fill:var(--accent);opacity:.55'},svg);
      el('rect',{x:x(P.p75),y:46,width:x(P.p25)-x(P.p75),height:16,style:'fill:var(--mustard);opacity:.6'},svg);
      el('rect',{x:x(P.p25),y:46,width:x(hi)-x(P.p25),height:16,style:'fill:var(--amber);opacity:.5'},svg);
      txt('← 走得快',{x:L,y:14,'text-anchor':'start'});txt('走得慢 →',{x:R,y:14,'text-anchor':'end'});
      txt('百分等級 75：'+ms(P.p75),{x:x(P.p75),y:38,'text-anchor':'middle',class:'meanlab'});txt('百分等級 25：'+ms(P.p25),{x:x(P.p25),y:38,'text-anchor':nar()?'start':'middle',class:'medlab'});
      axisX(svg,x,lo,hi,70,60,ms,'時間（分：秒）',L,R);
      el('line',{x1:x(t),x2:x(t),y1:40,y2:70,class:'zline'},svg);el('circle',{cx:x(t),cy:54,r:6,style:'fill:var(--ink)'},svg);
      const pos=t<=P.p75?'百分等級 75 以上':t<P.p25?'百分等級 25 到 75 之間':t===P.p25?'剛好在百分等級 25':'百分等級 25 以下';
      q('c13stS').innerHTML=statsHTML([['你的時間',ms(t)],['百分等級 75（'+P.l+'）',ms(P.p75),'mean'],['百分等級 25（'+P.l+'）',ms(P.p25),'med'],['落在',pos]]);
      q('c13stM').textContent=`${P.l}生走 ${mm} 分 ${ss} 秒，${t<=P.p75?'比百分等級 75 的 '+ms(P.p75)+' 還快（或一樣快），贏過常模裡至少四分之三的人':t<P.p25?'落在 '+ms(P.p75)+' 和 '+ms(P.p25)+' 之間，也就是常模中間的那一半':t===P.p25?'剛好等於百分等級 25 的 '+ms(P.p25):'比百分等級 25 的 '+ms(P.p25)+' 還慢，落在常模後面的四分之一'}。走路測驗的時間越短越好，所以百分等級 75 的時間比較短。對照的是一大群人事先建立的常模，不是這一班的同學。`;
      q('c13stN').textContent='預設的 12 分 30 秒是影片裡阿量的成績（自編例子）。表 13-11 只列出百分等級 75 與 25 兩個時間，百分等級怎麼對應到等第，講義沒有寫，要由老師事先訂好。常模改編自 Jackson, Solomon, & Stusek（1992）。';
    }else{
      const kk=k/100,d=DATA.map(v=>100-(100-v)*kk),m=ST.mean(d),s=ST.sd(d);
      const cnt=mn=>{const c=[0,0,0,0,0];d.forEach(v=>{let g=4;for(let i=0;i<4;i++)if(v>=mn[i]){g=i;break;}c[g]++;});return c;};
      const c1=cnt([90,80,70,60]),c2=cnt([m+1.8*s,m+0.6*s,m-0.6*s,m-1.8*s]);
      const VW=nar()?400:640,L=34,R=VW-10,T=20,B=176,mx=Math.max(...c1,...c2,10),st=niceStep(mx,5),top=Math.ceil(mx/st)*st,y=v=>B-v/top*(B-T);
      svg.innerHTML='';svg.setAttribute('viewBox','0 0 '+VW+' 220');
      for(let t=0;t<=top+1e-9;t+=st){el('line',{x1:L,x2:R,y1:y(t),y2:y(t),class:'grid'},svg);txt(t,{x:L-6,y:y(t)+4,'text-anchor':'end'});}
      txt('人數',{x:4,y:11,'text-anchor':'start'});
      const gw=(R-L)/5,bw=Math.min(34,gw*0.34);
      ['A','B','C','D','F'].forEach((g,i)=>{const cx=L+gw*(i+0.5);
        el('rect',{x:cx-bw-2,y:y(c1[i]),width:bw,height:B-y(c1[i]),class:'bar sel'},svg);txt(c1[i],{x:cx-bw/2-2,y:y(c1[i])-5,'text-anchor':'middle',class:'meanlab'});
        el('rect',{x:cx+2,y:y(c2[i]),width:bw,height:B-y(c2[i]),class:'bar2 sel'},svg);txt(c2[i],{x:cx+bw/2+2,y:y(c2[i])-5,'text-anchor':'middle',class:'medlab'});
        txt(g,{x:cx,y:B+18,'text-anchor':'middle',class:'grp'});});
      el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
      txt('等第',{x:R,y:B+36,'text-anchor':'end'});
      q('c13stS').innerHTML=statsHTML([['全班平均',m.toFixed(1)],['全班最低分',Math.min(...d).toFixed(1)],['自訂標準拿 A',c1[0]+' 人','mean'],['自訂標準拿 F',c1[4]+' 人','mean'],['依曲線拿 A',c2[0]+' 人','med'],['依曲線拿 F',c2[4]+' 人','med']]);
      q('c13stM').textContent=(k===100?'原始的 65 個分數：':`每個人離 100 分的差距縮成 ${k}%，全班平均變成 ${m.toFixed(1)}、最低 ${Math.min(...d).toFixed(1)} 分：`)+
        `自訂標準下 A 有 ${c1[0]} 人、F 有 ${c1[4]} 人；依曲線訂等第${k===100?'是':'還是'} A ${c2[0]} 人、F ${c2[4]} 人。`+
        (c1[0]===65?'全班都達到 90 分，自訂標準就全班都給 A；依曲線切的話，同一班還是有人拿 D、拿 F。':'自訂標準的切點固定在 90、80、70、60 分，全班越強，拿 A 的人越多；依曲線的切點跟著全班的平均數和標準差走，各等第的人數一個都沒變。把滑桿往左拉到 10% 看看。');
      q('c13stN').textContent='這裡把表 13-7 的 65 個複合分數當成 100 分知識測驗的成績，是網站為了比較而做的假設；講義沒有把表 13-7 用在自訂標準。滑桿是假設全班都變強（越往左，每個人越接近滿分）。';
    }
  };
  segBind(w,'c13stt',v=>{tab=v;body();draw();});
  segBind(w,'c13stx',v=>{sex=v;draw();});
  w.addEventListener('input',e=>{const t=e.target,v=parseFloat(t.value);if(!isFinite(v))return;
    if(t.dataset.c13sd!==undefined){D[+t.dataset.c13sd]=v;draw();}
    else if(t.id==='c13stMi'){if(v>=0){mm=Math.floor(v);draw();}}
    else if(t.id==='c13stSe'){if(v>=0&&v<60){ss=Math.floor(v);draw();}}});
  q('c13stRs').addEventListener('click',()=>{D=[42,7,4];sex='m';mm=12;ss=30;k=100;body();draw();});
  window.addEventListener('resize',draw);
  body();draw();
};
