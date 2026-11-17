/* ===== 第 9 章 測量情意的行為：互動工具 ===== */
const c9T=(svg,x,y,s,a)=>{a=Object.assign({x,y},a||{});if(!/font-size/.test(a.style||''))a.style='font-size:13px;'+(a.style||'');const t=el('text',a,svg);t.textContent=s;return t;};
const c9Row=(label,tags,score,bw)=>`<div style="display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;padding:8px 0;border-bottom:1px solid var(--line)"><div style="flex:1 1 ${bw||230}px;min-width:0;font-size:14px">${label}</div><div class="tagrow">${tags}</div><b style="font-family:var(--mono);font-weight:500;min-width:52px;text-align:right">${score}</b></div>`;
const c9Mark=(svg,x,y,label,fill)=>{el('path',{d:`M${x-9} ${y-16}L${x+9} ${y-16}L${x} ${y}Z`,style:`fill:var(${fill||'--mustard'});stroke:var(--ink);stroke-width:1.2`},svg);c9T(svg,x,y-22,label,{'text-anchor':'middle',style:'font-size:16px;font-weight:700;fill:var(--ink)'});};
const c9Dir=d=>`<span class="note">（${d>0?'正向':'反向'}）</span>`;

/* ---------- c9likert：圖 9-1 五題的作答與計分 ---------- */
W.c9likert=(w)=>{
  // 題目與計分方向照講義圖 9-1；阿量的回答（不同意、同意、非常同意、非常不同意、同意）是短片 EP1 的自編示範，合計 22 分
  const OPT=['非常同意','同意','不確定','不同意','非常不同意'];
  const IT=[['在上課時我無法專心。',-1],['所有的學生都應該選像這樣的課。',1],['我喜歡學習新的運動技巧。',1],['我不喜歡課堂上的活動。',-1],['我喜歡上這門課。',1]];
  const PRE={liang:[3,1,0,4,1],agree:[0,0,0,0,0],mid:[2,2,2,2,2]};
  let ans=PRE.liang.slice(),rev='on';
  w.innerHTML=`<div class="widget-title"><strong>李克特量尺：作答與計分</strong>${segHTML('c9lr',[['on','反向題倒過來計分'],['off','全部當正向題計分']],rev)}</div>
  <div class="in-row"><button class="btn" type="button" data-c9lp="liang">阿量的回答（短片）</button><button class="btn" type="button" data-c9lp="agree">五題都選「非常同意」</button><button class="btn" type="button" data-c9lp="mid">五題都選「不確定」</button></div>
  <p class="note" style="margin:0">題目出自講義圖 9-1。每一題點一個選項，右邊是這一題換成的分數。</p>
  <div id="c9lI"></div>
  ${SV('0 0 520 112','五題總分在 5 到 25 分之間的位置')}
  <div id="c9lS"></div><p class="readout" id="c9lM"></p>
  <p class="note" style="margin:0">正向題「非常同意」得 5 分、反向題「非常同意」得 1 分，照講義圖 9-1。總分範圍 5–25 是由五題各 1–5 分推算的；這份範例沒有常模，總分只能說「靠近哪一端」，不能說贏過多少人。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const sc=(i,r)=>ans[i]==null?null:(IT[i][1]>0||!r?5-ans[i]:1+ans[i]);
  const draw=()=>{
    const r=rev==='on';
    q('c9lI').innerHTML=IT.map((it,i)=>c9Row(`${i+1}. ${it[0]}${c9Dir(it[1])}`,OPT.map((o,j)=>`<button type="button" class="tag${ans[i]===j?' on':''}" data-c9la="${i},${j}">${o}</button>`).join(''),sc(i,r)==null?'—':sc(i,r)+' 分',150)).join('');
    const s=IT.map((_,i)=>sc(i,r)),s2=IT.map((_,i)=>sc(i,true)),done=s.every(v=>v!=null);
    const tot=done?s.reduce((a,b)=>a+b,0):null,tot2=done?s2.reduce((a,b)=>a+b,0):null;
    svg.innerHTML='';
    const L=30,R=490,x=v=>L+(v-5)/20*(R-L);
    el('rect',{x:L,y:52,width:R-L,height:16,rx:4,style:'fill:var(--soft);stroke:var(--line)'},svg);
    if(done)el('rect',{x:L,y:52,width:x(tot)-L,height:16,rx:4,style:'fill:var(--accent);fill-opacity:.55'},svg);
    el('line',{x1:L,x2:R,y1:72,y2:72,class:'axis'},svg);
    [5,10,15,20,25].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:72,y2:76,class:'axis'},svg);c9T(svg,x(t),89,t,{'text-anchor':'middle'});});
    c9T(svg,L,106,'每題都得 1 分',{'text-anchor':'start'});c9T(svg,R,106,'每題都得 5 分',{'text-anchor':'end'});
    if(done){c9Mark(svg,x(tot),50,tot+' 分');
      if(!r&&tot2!==tot){el('circle',{cx:x(tot2),cy:60,r:6,class:'pt2',style:'stroke:var(--surface);stroke-width:1.5'},svg);c9T(svg,x(tot2),46,'正確 '+tot2,{'text-anchor':'middle',style:'font-size:12px;fill:var(--amber);font-weight:700'});}}
    const pos=[1,2,4].map(i=>s[i]),neg=[0,3].map(i=>s[i]),sum=a=>a.every(v=>v!=null)?a.reduce((p,c)=>p+c,0)+' 分':'—';
    q('c9lS').innerHTML=statsHTML([['總分',done?tot+' 分':'—','mean'],['可能的範圍','5–25 分'],['正向題小計（第 2、3、5 題）',sum(pos)],['反向題小計（第 1、4 題）',sum(neg),'med']]);
    let m;
    if(!done)m=`還有 ${s.filter(v=>v==null).length} 題沒有選，五題都選完才有總分。`;
    else if(r){
      m=`${s.join('＋')}＝${tot} 分。反向題已經倒過來算，所以五題都是「分數越高，態度越正向」，總分落在 5–25 分的${tot>=20?'高分端':tot<=10?'低分端':'中間一帶'}。`;
      if(ans.every(a=>a===0))m+='五題都選「非常同意」的人並沒有拿到滿分：他同時同意「我喜歡上這門課」和「我不喜歡課堂上的活動」，正向題和反向題互相抵消。這是放反向題的用處，可以看出有沒有人不看題目一路勾到底。';
      else if(tot===22&&ans.join()===PRE.liang.join())m+='這是短片 EP1 裡阿量的回答。';
    }else{
      m=`全部當正向題計分，得 ${s.join('＋')}＝${tot} 分；`+(tot2===tot?'這組回答剛好兩種算法一樣，因為反向題都選了「不確定」（3 分倒過來還是 3 分）。':`正確的算法是 ${s2.join('＋')}＝${tot2} 分，差了 ${Math.abs(tot2-tot)} 分。第 1、4 題是反向題，沒有倒過來算，這兩題的分數方向就和另外三題相反，總分會${tot>tot2?'高估':'低估'}這個人的態度。`);
    }
    q('c9lM').textContent=m;
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c9la]');if(b){const [i,j]=b.dataset.c9la.split(',').map(Number);ans[i]=ans[i]===j?null:j;draw();return;}
    const p=e.target.closest('[data-c9lp]');if(p){ans=PRE[p.dataset.c9lp].slice();draw();}
  });
  segBind(w,'c9lr',v=>{rev=v;draw();});draw();
};

/* ---------- c9scales：同樣的喜歡程度，三種量尺各記下什麼 ---------- */
W.c9scales=(w)=>{
  // 二點量尺的例題取自圖 9-9 第 2 題，李克特取自圖 9-1 第 3 題，語意差異取自圖 9-2 第 7 題與第 4 題。
  // 把「心裡的喜歡程度」畫成 0–100、等分成格子，是自編的示意，用來比較三種量尺分得出多少程度。
  const defs=[{id:'c9sa',label:'甲同學心裡的喜歡程度（示意）',min:0,max:100,step:1,value:62},{id:'c9sb',label:'乙同學心裡的喜歡程度（示意）',min:0,max:100,step:1,value:74}];
  const LK=['非常不同意','不同意','不確定','同意','非常同意'];
  let pair='r';
  w.innerHTML=`<div class="widget-title"><strong>同樣的感受，三種量尺各記下什麼</strong>${segHTML('c9sp',[['r','痛苦的—快樂的'],['l','好的—壞的']],pair)}</div>
  ${sliders(defs)}
  <div class="in-row"><button class="btn" type="button" data-c9sv="62,74">預設：62 和 74</button><button class="btn" type="button" data-c9sv="20,90">差很多：20 和 90</button><button class="btn" type="button" data-c9sv="64,66">幾乎一樣：64 和 66</button></div>
  ${SV('0 0 520 330','兩位同學的喜歡程度在二點量尺、李克特量尺、語意差異量尺上各落在哪一格')}
  <div class="legend"><span><i style="background:var(--accent)"></i>甲同學</span><span><i style="background:var(--amber)"></i>乙同學</span></div>
  <div id="c9sS"></div><p class="readout" id="c9sM"></p>
  <p class="note" style="margin:0">兩位同學與 0–100 的喜歡程度是自編的示意，並假設每種量尺把程度等分成幾格；真實的作答不會這麼整齊。二點量尺答「真實」記 1 分、「不真實」記 0 分，語意差異量尺七格記 1–7 分，是一般做法；講義第 7、8 張對這兩種量尺只列了「計分流程」「優點和缺點」的標題。右上角可以換一組形容詞：正面的詞換邊，記號的位置跟著換，分數不變。</p>`;
  const svg=w.querySelector('svg'),L=20,R=500,x=v=>L+v/100*(R-L);
  const lev=(v,n)=>Math.min(n-1,Math.floor(v/100*n));
  const draw=()=>{
    const a=val(w,'c9sa'),b=val(w,'c9sb'),fl=pair==='l';svg.innerHTML='';
    // 第 0 列：心裡的程度
    c9T(svg,L,16,'心裡的喜歡程度（0＝完全不喜歡，100＝非常喜歡）',{style:'font-size:13px;fill:var(--ink)'});
    el('line',{x1:L,x2:R,y1:44,y2:44,class:'axis'},svg);
    [0,25,50,75,100].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:44,y2:48,class:'axis'},svg);c9T(svg,x(t),61,t,{'text-anchor':t===0?'start':t===100?'end':'middle'});});
    el('circle',{cx:x(a),cy:44,r:7,class:'pt',style:'stroke:var(--surface);stroke-width:1.5'},svg);
    el('circle',{cx:x(b),cy:44,r:7,class:'pt2',style:'stroke:var(--surface);stroke-width:1.5'},svg);
    const rows=[
      {n:2,y:92,t:'二點量尺：「我較喜歡運動勝過於閱讀」（圖 9-9 第 2 題）',lab:['不真實','真實'],sc:k=>k,f:false},
      {n:5,y:172,t:'李克特量尺：「我喜歡學習新的運動技巧」（圖 9-1 第 3 題）',lab:LK,sc:k=>k+1,f:false},
      {n:7,y:252,t:fl?'語意差異量尺：身體活動　好的 ← → 壞的（圖 9-2 第 4 題）':'語意差異量尺：身體活動　痛苦的 ← → 快樂的（圖 9-2 第 7 題）',lab:null,sc:k=>k+1,f:fl}];
    const res=rows.map(r=>{
      const ka=lev(a,r.n),kb=lev(b,r.n),bw=(R-L)/r.n,same=ka===kb;
      c9T(svg,L,r.y-8,r.t,{style:'font-size:13px;fill:var(--ink)'});
      for(let k=0;k<r.n;k++){
        const lv=r.f?r.n-1-k:k,hit=lv===ka||lv===kb;
        el('rect',{x:L+k*bw,y:r.y,width:bw,height:44,style:'fill:var('+(hit?'--mustard':'--soft')+');fill-opacity:'+(hit?.3:1)+';stroke:var(--ink);stroke-width:'+(hit?1.8:.7)},svg);
        c9T(svg,L+(k+.5)*bw,r.y+16,r.lab?r.lab[lv]:(r.sc(lv)+' 分'),{'text-anchor':'middle',style:'font-size:'+(r.n===5?12:13)+'px;fill:var(--ink)'});
      }
      const cx=k=>L+((r.f?r.n-1-k:k)+.5)*bw;
      el('circle',{cx:cx(ka)-(same?9:0),cy:r.y+31,r:6,class:'pt',style:'stroke:var(--surface);stroke-width:1.5'},svg);
      el('circle',{cx:cx(kb)+(same?9:0),cy:r.y+31,r:6,class:'pt2',style:'stroke:var(--surface);stroke-width:1.5'},svg);
      return {same,sa:r.sc(ka),sb:r.sc(kb),d:Math.abs(ka-kb)};
    });
    c9T(svg,R,322,fl?'正面的詞「好的」在左邊：最左邊一格 7 分':'正面的詞「快樂的」在右邊：最右邊一格 7 分',{'text-anchor':'end'});
    const st=r=>r.same?'同一格，分不出來':'差 '+r.d+' 格';
    w.querySelector('#c9sS').innerHTML=statsHTML([['二點量尺（2 格）',`${res[0].sa} 分、${res[0].sb} 分`,res[0].same?'med':'mean'],['李克特量尺（5 格）',`${res[1].sa} 分、${res[1].sb} 分`,res[1].same?'med':'mean'],['語意差異量尺（7 格）',`${res[2].sa} 分、${res[2].sb} 分`,res[2].same?'med':'mean'],['心裡的程度相差',Math.abs(a-b)]]);
    const n=res.filter(r=>!r.same).length;
    let m=`甲 ${a}、乙 ${b}，心裡的程度相差 ${Math.abs(a-b)}。二點量尺：${st(res[0])}；李克特量尺：${st(res[1])}；語意差異量尺：${st(res[2])}。`;
    if(a===b)m+='兩個人的程度一樣，三種量尺記下來的答案當然也一樣。';
    else if(n===0)m+='兩個人差得很少，三種量尺都分不出來：格子再多，也有分不出來的時候。';
    else if(n===3)m+='兩個人差得夠多，連只有兩格的二點量尺都分得出來。';
    else if(res[0].same&&res[1].same)m+='二點量尺和李克特量尺都把兩個人記成同一個答案，只有七格的語意差異量尺看得出乙比甲多喜歡一點。格子越多，分得出的程度越細，但作答也越花時間。';
    else if(res[0].same)m+='二點量尺把兩個人都記成同一個答案，阿量說的「有點喜歡不見了」就是這個意思；格子比較多的量尺才分得出來。';
    else m+='格子多不保證一定分得開：兩個人如果剛好落在同一格裡就分不出來，剛好跨過格子的界線才分得出來。';
    w.querySelector('#c9sM').textContent=m;
  };
  w.addEventListener('click',e=>{const p=e.target.closest('[data-c9sv]');if(p){const [a,b]=p.dataset.c9sv.split(',');[['c9sa',a],['c9sb',b]].forEach(([id,v])=>{const i=w.querySelector('#'+id);i.value=v;i.dispatchEvent(new Event('input'));});}});
  segBind(w,'c9sp',v=>{pair=v;draw();});
  bindSliders(w,defs,draw);draw();
};

/* ---------- c9attitude：圖 9-6 身體活動感覺問卷的計分與解釋 ---------- */
W.c9attitude=(w)=>{
  // 題目、計分方向、解釋區間照講義第 23 張（圖 9-6）。代碼採更正後的對應：SD＝非常不同意、SA＝非常同意（講義第 22 張把兩者的中文寫反了）。
  const CODE=['SD','D','U','A','SA'];
  const IT=[['我盼望身體活動。',1],['我希望有比激烈的身體活動更有趣的維持體能方法。',-1],['身體活動是在做苦工。',-1],['我不喜愛身體活動。',-1],['身體活動對我是非常重要的。',1],['身體活動的結果，生活是如此更佳豐富。',1],['身體活動是愉快的。',1],['我不喜歡做規律身體活動的想法。',-1],['我會安排或改變我的日程表參與身體活動。',1],['我必須強迫自己參與身體活動。',-1],['錯過一天的身體活動是全然安心的。',-1],['身體活動是我一天最佳的時間。',1]];
  const BAND=[[12,17,'非常不喜歡','對身體活動非常不喜歡的感覺'],[18,29,'不喜歡','不喜歡的感覺'],[30,41,'中立','中立的感覺'],[42,53,'喜愛','喜愛的感覺'],[54,60,'很喜愛','對身體活動很喜愛的感覺']];
  const FILL=['fill:var(--amber);fill-opacity:.5','fill:var(--amber);fill-opacity:.22','fill:var(--soft)','fill:var(--accent);fill-opacity:.25','fill:var(--accent);fill-opacity:.55'];
  // 預設鈕用「作答者的意思」定義（0＝非常不同意 … 4＝非常同意），再依目前的代碼表換成圈選的代碼
  const INTENT={love:d=>d>0?4:0,like:d=>d>0?3:1,mid:()=>2,dislike:d=>d>0?1:3};
  const PN={love:'很喜愛身體活動的人',like:'還算喜歡的人',mid:'每題都圈 U 的人',dislike:'不太喜歡的人',allsa:'每題都圈 SA 的人'};
  let map='fix',preset='mid',ans=[];
  const fill=()=>{if(preset==='allsa')ans=IT.map(()=>4);else if(preset)ans=IT.map(it=>{const lv=INTENT[preset](it[1]);return map==='fix'?lv:(lv===4?0:lv===0?4:lv);});};
  fill();
  w.innerHTML=`<div class="widget-title"><strong>身體活動感覺問卷：12 題算總分</strong>${segHTML('c9am',[['fix','更正後的代碼'],['orig','講義原印的代碼']],map)}</div>
  <p class="formula" id="c9aL"></p>
  <div class="in-row"><button class="btn" type="button" data-c9ap="mid">每題都圈 U</button><button class="btn" type="button" data-c9ap="love">很喜愛的人</button><button class="btn" type="button" data-c9ap="like">還算喜歡的人</button><button class="btn" type="button" data-c9ap="dislike">不太喜歡的人</button><button class="btn" type="button" data-c9ap="allsa">每題都圈 SA</button></div>
  <p class="note" style="margin:0">題目出自講義圖 9-6（第 23 張）。可以按上面的預設鈕，也可以自己一題一題圈；右邊是這一題的得分。</p>
  <div id="c9aI"></div>
  ${SV('0 0 520 128','總分在 12 到 60 分之間的位置與五個解釋區間')}
  <div id="c9aS"></div><p class="readout" id="c9aM"></p>
  <p class="note" style="margin:0">計分照講義：第 1、5、6、7、9、12 題由 SD 到 SA 記 1 至 5 分，第 2、3、4、8、10、11 題記 5 至 1 分；12 題 × 3 分＝36 是中間分數。講義只給五個區間的文字解釋，沒有說明這些區間是怎麼訂的，也沒有常模。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const sc=i=>ans[i]==null?null:(IT[i][1]>0?ans[i]+1:5-ans[i]);
  const draw=()=>{
    q('c9aL').innerHTML=map==='fix'?'<b>更正後</b>　SD＝非常不同意　D＝不同意　U＝不確定　A＝同意　SA＝非常同意':'<i>講義第 22 張原印</i>　SD＝非常同意　D＝不同意　U＝不確定　A＝同意　SA＝非常不同意';
    q('c9aI').innerHTML=IT.map((it,i)=>c9Row(`${i+1}. ${it[0]}${c9Dir(it[1])}`,CODE.map((c,j)=>`<button type="button" class="tag${ans[i]===j?' on':''}" data-c9aa="${i},${j}">${c}</button>`).join(''),sc(i)==null?'—':sc(i)+' 分')).join('');
    const s=IT.map((_,i)=>sc(i)),done=s.every(v=>v!=null),tot=done?s.reduce((a,b)=>a+b,0):null;
    const bi=done?BAND.findIndex(b=>tot>=b[0]&&tot<=b[1]):-1;
    svg.innerHTML='';
    const L=14,R=506,x=v=>L+(v-11.5)/49*(R-L);
    BAND.forEach((b,i)=>{const x0=x(b[0]-.5),x1=x(b[1]+.5);
      el('rect',{x:x0,y:52,width:x1-x0,height:30,style:FILL[i]+';stroke:var(--ink);stroke-width:'+(i===bi?2.2:.8)},svg);
      c9T(svg,(x0+x1)/2,72,b[2],{'text-anchor':'middle',style:'font-size:'+(i===0?11:13)+'px;fill:var(--ink)'+(i===bi?';font-weight:700':'')});});
    el('line',{x1:L,x2:R,y1:86,y2:86,class:'axis'},svg);
    [12,18,30,36,42,54,60].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:86,y2:90,class:'axis'},svg);c9T(svg,x(t),103,t,{'text-anchor':'middle',style:t===36?'font-size:13px;font-weight:700;fill:var(--ink)':''});});
    c9T(svg,R,122,'總分（12–60 分），36 是中間分數',{'text-anchor':'end'});
    if(done)c9Mark(svg,Math.min(Math.max(x(tot),L+22),R-22),50,tot+' 分');
    const part=d=>{const a=IT.map((it,i)=>it[1]===d?s[i]:0);return IT.every((it,i)=>it[1]!==d||s[i]!=null)?a.reduce((p,c)=>p+c,0)+' 分':'—';};
    q('c9aS').innerHTML=statsHTML([['總分',done?tot+' 分':'—','mean'],['講義的解釋',done?BAND[bi][2]+'（'+BAND[bi][0]+'–'+BAND[bi][1]+'）':'—','med'],['正向題小計（6 題）',part(1)],['反向題小計（6 題）',part(-1)]]);
    let m;
    if(!done)m=`還有 ${s.filter(v=>v==null).length} 題沒有圈，12 題都圈完才有總分。`;
    else{
      m=`總分 ${tot} 分，落在 ${BAND[bi][0]}–${BAND[bi][1]}，講義的解釋是「${BAND[bi][3]}」。`;
      if(preset==='allsa')m+='每題都圈 SA 並不會拿到 60 分：正向題 6 × 5＝30，反向題 6 × 1＝6，合計 36，剛好是中間分數。要拿 60 分，必須正向題圈 SA、反向題圈 SD。';
      else if(preset==='mid')m+='每題都圈 U 是 12 × 3＝36 分，這就是講義說的中間分數，也是短片 EP3 小考的答案。';
      else if(preset&&map==='orig')m+=`這是「${PN[preset]}」照講義原印的代碼表（SD＝非常同意、SA＝非常不同意）圈出來的結果。計分規則還是把正向題的 SA 算 5 分，所以${preset==='love'?'最喜愛身體活動的人反而只得 12 分，被解釋成非常不喜歡':preset==='like'||preset==='dislike'?'只有圈 SD、SA 的題目會受影響；這組回答只用到 D 和 A，總分沒有變':'總分沒有變'}。代碼表和計分方向對不起來，問卷就不能用，所以本頁與短片都採更正後的對應。`;
      else if(preset)m+=`這是「${PN[preset]}」的圈法：${preset==='love'?'正向題圈 SA、反向題圈 SD，每題都得 5 分':preset==='like'?'正向題圈 A、反向題圈 D，每題都得 4 分':'正向題圈 D、反向題圈 A，每題都得 2 分'}。`;
      else if(map==='orig')m+='現在代碼表是講義原印的寫法；計分只看圈了哪個代碼，所以同一組圈選的總分不變，變的是「圈這個代碼的人原本想說什麼」。';
    }
    q('c9aM').textContent=m;
  };
  w.addEventListener('click',e=>{
    const b=e.target.closest('[data-c9aa]');if(b){const [i,j]=b.dataset.c9aa.split(',').map(Number);ans[i]=ans[i]===j?null:j;preset=null;draw();return;}
    const p=e.target.closest('[data-c9ap]');if(p){preset=p.dataset.c9ap;fill();draw();}
  });
  segBind(w,'c9am',v=>{map=v;fill();draw();});draw();
};

/* ---------- c9interest：圖 9-7 興趣調查，名次對調後全班加總 ---------- */
W.c9interest=(w)=>{
  // 活動名稱取自講義圖 9-7；「阿量的前 5 名」同短片 EP3；另外四位同學的名次是自編的示範
  const ACT=['籃球','游泳，跳水','重量訓練','羽球','自行車','排球','瑜珈','棒球'];
  const OTH=[['同學 B',{5:1,0:2,3:3,7:4,1:5}],['同學 C',{6:1,1:2,3:3,4:4,2:5}],['同學 D',{0:1,7:2,5:3,2:4,4:5}],['同學 E',{3:1,1:2,0:3,6:4,5:5}]];
  const LIANG=[0,1,2,3,4];
  let mine=LIANG.slice(),mode='rev';
  w.innerHTML=`<div class="widget-title"><strong>興趣調查：全班最想上哪一項</strong>${segHTML('c9im',[['rev','名次對調後加總'],['raw','直接把名次加起來']],mode)}</div>
  <p class="note" style="margin:0">照順序點出你最想上的 5 項（先點的是第 1 名），再點一次可以取消。</p>
  <div class="tagrow" id="c9iA"></div>
  <div class="in-row"><button class="btn" type="button" id="c9iR">阿量的前 5 名（短片）</button><button class="btn" type="button" id="c9iC">清除我的選擇</button></div>
  <div class="tbl-wrap" id="c9iT"></div>
  ${SV('0 0 520 250','八項活動的全班合計')}
  <div id="c9iS"></div><p class="readout" id="c9iM"></p>
  <p class="note" style="margin:0">講義圖 9-7 共列出六大類 57 項活動，這裡只取 8 項示範。計分方式照講義「對老師的說明」：1 和 5 對調、2 和 4 對調，也就是第 1 名 5 分、第 5 名 1 分，沒被選到的 0 分。四位同學的名次是自編的。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const draw=()=>{
    const me={};mine.forEach((a,k)=>me[a]=k+1);
    const all=[['你',me]].concat(OTH),pt=r=>r==null?0:(mode==='rev'?6-r:r);
    const tot=ACT.map((_,a)=>all.reduce((s,p)=>s+pt(p[1][a]),0)),cnt=ACT.map((_,a)=>all.filter(p=>p[1][a]!=null).length);
    q('c9iA').innerHTML=ACT.map((n,a)=>`<button type="button" class="tag${me[a]?' on':''}" data-c9ia="${a}">${me[a]?'第 '+me[a]+' 名　':''}${n}</button>`).join('');
    const mx=Math.max(...tot),order=ACT.map((_,a)=>a).sort((a,b)=>tot[b]-tot[a]||a-b),top=order.filter(a=>tot[a]===mx);
    q('c9iT').innerHTML=`<table class="wtbl"><tr><th>活動</th>${all.map(p=>`<th>${p[0]}</th>`).join('')}<th>合計</th></tr>${ACT.map((n,a)=>`<tr><td>${n}</td>${all.map(p=>`<td>${p[1][a]==null?'':(mode==='rev'?'<span class="note">第'+p[1][a]+'名</span> '+pt(p[1][a]):p[1][a])}</td>`).join('')}<td class="${tot[a]===mx?'hl':''}"><b>${tot[a]}</b></td></tr>`).join('')}</table>`;
    svg.innerHTML='';
    const L=96,R=470,sc=Math.max(20,mx),x=v=>L+v/sc*(R-L);
    order.forEach((a,k)=>{const y=14+k*28;
      c9T(svg,L-8,y+15,ACT[a],{'text-anchor':'end',style:'font-size:13px;fill:var(--ink)'});
      el('rect',{x:L,y:y,width:Math.max(1,x(tot[a])-L),height:20,class:tot[a]===mx?'bar2':'bar'},svg);
      c9T(svg,x(tot[a])+6,y+15,tot[a]+(mode==='rev'?' 分':'')+'（'+cnt[a]+' 人選）',{'text-anchor':'start'});});
    c9T(svg,R+30,246,mode==='rev'?'合計分數（第 1 名 5 分 … 第 5 名 1 分）':'名次直接相加（第 1 名算 1 … 第 5 名算 5）',{'text-anchor':'end'});
    q('c9iS').innerHTML=statsHTML([['你已選',mine.length+' / 5 項',mine.length===5?'mean':'med'],['合計最高',top.map(a=>ACT[a]).join('、')+' '+mx,'med'],['全班人數','5 人'],['每人分出去',mode==='rev'?'5＋4＋3＋2＋1＝15 分':'名次 1–5']]);
    let m;
    if(mode==='rev'){
      m=`名次對調後加總，合計最高的是「${top.map(a=>ACT[a]).join('、')}」（${mx} 分），是全班最想上的項目。`;
      if(mine.length<5)m=`你還有 ${5-mine.length} 項沒選（講義規定每人只能選 5 項）。目前`+m;
      else if(mine.join()===LIANG.join())m+='阿量把籃球排第 1 名，換成 5 分；自行車排第 5 名，只算 1 分。';
    }else{
      m=`直接把名次加起來，數字最大的是「${top.map(a=>ACT[a]).join('、')}」（${mx}）。可是名次數字越大代表越後面，沒被選到的又是 0，這個合計既不能說越大越受歡迎，也不能說越小越受歡迎。所以講義要老師先把 1 和 5、2 和 4 對調再加總。`;
    }
    q('c9iM').textContent=m;
  };
  w.addEventListener('click',e=>{const b=e.target.closest('[data-c9ia]');if(!b)return;const a=+b.dataset.c9ia,k=mine.indexOf(a);if(k>=0)mine.splice(k,1);else if(mine.length<5)mine.push(a);draw();});
  q('c9iR').addEventListener('click',()=>{mine=LIANG.slice();draw();});
  q('c9iC').addEventListener('click',()=>{mine=[];draw();});
  segBind(w,'c9im',v=>{mode=v;draw();});draw();
};

/* ---------- c9behavior：圖 9-13 教師評量表，代碼換點數再加總 ---------- */
W.c9behavior=(w)=>{
  // 點數值與四位學生的代碼照講義圖 9-13（第 41 張）。Marcus 的 R 依記分欄「從沒有或很少（Never or Rarely）」記 0 分。
  // D'Anthony 一列照代碼算是 35，講義印 37；預設用算得起來的 Patrice（22 分，同短片 EP4）。
  const BEH=['尊重他人','尊重教師','傾聽他人說話','顯示正向的身體語言'];
  const CD=[['A','總是',10],['M','大部分時間',7],['L','少於一半的時間',5],['N','從沒有或很少',0]];
  const STU={patrice:['Patrice',[2,2,2,1],22,'L、L、L、M'],latoya:['Latoya',[1,1,3,2],19,'M、M、N、L'],marcus:['Marcus',[3,2,3,2],10,'R、L、R、L'],danthony:["D'Anthony",[0,0,2,0],37,'A、A、L、A'],quiz:['短片小考',[0,0,1,2],null,'A、A、M、L']};
  let cur='patrice',ans=STU[cur][1].slice();
  w.innerHTML=`<div class="widget-title"><strong>教師評量表：代碼換成點數</strong><span class="note">預設：講義圖 9-13 的 Patrice</span></div>
  <div class="tagrow" id="c9bP"></div>
  <p class="formula">記分欄　<b>A</b> 總是＝10　<b>M</b> 大部分時間＝7　<b>L</b> 少於一半的時間＝5　<b>N</b> 從沒有或很少＝0</p>
  <div id="c9bI"></div>
  ${SV('0 0 520 196','目前這一列的總分，和講義四位學生照代碼算出的總分')}
  <div id="c9bS"></div><p class="readout" id="c9bM"></p>
  <p class="note" style="margin:0">四項行為、點數值與四位學生的代碼出自講義圖 9-13（第 41 張）。講義 Marcus 一列寫的是 R，記分欄沒有單獨列 R；「從沒有或很少」的英文是 Never or Rarely，這裡把 R 和 N 都記 0 分。「短片小考」那一列是短片 EP4 自編的組合。</p>`;
  const svg=w.querySelector('svg'),q=id=>w.querySelector('#'+id);
  const sumOf=a=>a.reduce((s,k)=>s+CD[k][2],0);
  const draw=()=>{
    q('c9bP').innerHTML=Object.keys(STU).map(k=>`<button type="button" class="tag${k===cur?' on':''}" data-c9bs="${k}">${STU[k][0]}</button>`).join('');
    q('c9bI').innerHTML=BEH.map((b,i)=>c9Row(b,CD.map((c,j)=>`<button type="button" class="tag${ans[i]===j?' on':''}" data-c9ba="${i},${j}">${c[0]}（${c[2]}）</button>`).join(''),CD[ans[i]][2]+' 分')).join('');
    const tot=sumOf(ans),S0=STU[cur],printed=S0[2],edited=ans.join()!==S0[1].join();
    svg.innerHTML='';
    const L=104,R=384,x=v=>L+v/40*(R-L);
    const bars=[['目前這一列',tot,null,true]].concat(['danthony','patrice','latoya','marcus'].map(k=>[STU[k][0],sumOf(STU[k][1]),STU[k][2],false]));
    bars.forEach((b,k)=>{const y=10+k*30+(k?8:0);
      c9T(svg,L-8,y+15,b[0],{'text-anchor':'end',style:'font-size:13px;fill:var(--ink)'+(b[3]?';font-weight:700':'')});
      el('rect',{x:L,y:y,width:R-L,height:20,style:'fill:var(--soft)'},svg);
      el('rect',{x:L,y:y,width:Math.max(1,x(b[1])-L),height:20,class:b[3]?'bar2':'bar'},svg);
      c9T(svg,x(Math.max(b[1],b[2]||0))+6,y+15,b[1]+' 分'+(b[2]!=null&&b[2]!==b[1]?'（講義印 '+b[2]+'）':''),{'text-anchor':'start',style:'font-size:13px;fill:var(--ink)'+(b[3]?';font-weight:700':'')});
      if(b[2]!=null&&b[2]!==b[1])el('line',{x1:x(b[2]),x2:x(b[2]),y1:y-3,y2:y+23,style:'stroke:var(--amber);stroke-width:2.4'},svg);});
    el('line',{x1:L,x2:R,y1:172,y2:172,class:'axis'},svg);
    [0,10,20,30,40].forEach(t=>{el('line',{x1:x(t),x2:x(t),y1:172,y2:176,class:'axis'},svg);c9T(svg,x(t),189,t,{'text-anchor':'middle'});});
    q('c9bS').innerHTML=statsHTML([['算出的總分',tot+' 分','mean'],['講義印的點數',printed==null||edited?'—':printed+' 分',printed!=null&&!edited&&printed!==tot?'med':''],['可能的範圍','0–40 分'],['四項的代碼',ans.map(k=>CD[k][0]).join('、')]]);
    const f=ans.map(k=>CD[k][2]).join('＋')+'＝'+tot;
    let m;
    if(edited)m=`${f} 分。你改過代碼，這一列已經不是${S0[0]==='短片小考'?'短片小考':'講義 '+S0[0]}原本的評量。`+(cur==='danthony'&&tot===37?'把第三項「傾聽他人說話」從 L 改成 M，10＋10＋7＋10 才會是講義印的 37；所以講義這一列不是代碼印錯，就是點數印錯。':'');
    else if(cur==='danthony')m=`講義 D'Anthony 一列的代碼是 A、A、L、A，照記分欄算是 ${f} 分，可是講義印的點數是 37，差 2 分。代碼和點數有一個印錯了：試試把第三項從 L 改成 M，看總分會不會變成 37。`;
    else if(cur==='quiz')m=`${f} 分。這是短片 EP4 小考的組合：總是、總是、大部分時間、少於一半的時間。`;
    else if(cur==='marcus')m=`${f} 分，和講義印的 ${printed} 分一致。講義這一列的代碼寫 R、L、R、L，R 照「從沒有或很少」記 0 分才對得起來。`;
    else m=`${f} 分，和講義印的 ${printed} 分一致。${cur==='patrice'?'短片 EP4 用的就是這一列：三項 5 分、一項 7 分。':''}檢核表只能記「有沒有」，評量表多了「多常出現」，所以能換成點數加總。`;
    q('c9bM').textContent=m;
  };
  w.addEventListener('click',e=>{
    const s=e.target.closest('[data-c9bs]');if(s){cur=s.dataset.c9bs;ans=STU[cur][1].slice();draw();return;}
    const b=e.target.closest('[data-c9ba]');if(b){const [i,j]=b.dataset.c9ba.split(',').map(Number);ans[i]=j;draw();}
  });
  draw();
};
