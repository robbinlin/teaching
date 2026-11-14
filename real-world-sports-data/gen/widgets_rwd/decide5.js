/* ---------- W01: decide5 四個分析決策 → 規律運動比例 ---------- */
W.decide5=(w)=>{
  // facts.json decision_grid：[定義, -1 處理, 分母, 加權, 分析人數, 比例%]
  const G=[["days","keep","all","none",37822,81.0],["days","keep","all","weight",37248,81.9],["days","keep","complete","none",37822,81.0],["days","keep","complete","weight",37248,81.9],["days","na","all","none",37822,81.0],["days","na","all","weight",37248,81.9],["days","na","complete","none",36842,83.2],["days","na","complete","weight",36660,83.2],["days_sweat","keep","all","none",37822,51.3],["days_sweat","keep","all","weight",37248,51.4],["days_sweat","keep","complete","none",33869,57.2],["days_sweat","keep","complete","weight",33710,56.9],["days_sweat","na","all","none",37822,51.3],["days_sweat","na","all","weight",37248,51.4],["days_sweat","na","complete","none",33499,57.9],["days_sweat","na","complete","weight",33353,57.5]];
  const D=[
    {k:'d5def',label:'規律運動的定義',o:[['days','只看運動天數'],['days_sweat','天數＋流汗會喘']]},
    {k:'d5mis',label:'天數題的 -1',o:[['keep','留著當數值'],['na','轉成遺漏']]},
    {k:'d5den',label:'分母',o:[['all','全體受訪者'],['complete','完整作答者']]},
    {k:'d5wt',label:'加權',o:[['none','不加權'],['weight','用權重變項']]}];
  const cur=['days_sweat','keep','all','none'];
  w.innerHTML=`<div class="widget-title"><strong>同一份資料，四個決策，十六種做法</strong><span class="note">主資料集 37,822 人</span></div>
  <div style="display:grid;gap:8px">${D.map((d,i)=>`<div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px"><span style="min-width:7.5em;font-size:14px">${d.label}</span>${segHTML(d.k,d.o,cur[i])}</div>`).join('')}</div>
  ${SV('0 0 640 150','十六種做法得到的規律運動比例')}<div id="d5S"></div><p class="readout" id="d5M"></p>
  <p class="note" style="margin:0">數字由課程衍生檔 survey4 重算。圓點是十六種做法各自的結果，重疊的點表示那個決策在該組合下不影響數字。</p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{
    const hit=G.find(g=>g[0]===cur[0]&&g[1]===cur[1]&&g[2]===cur[2]&&g[3]===cur[3]);
    const L=30,R=610,Y=92,lo=45,hi=90,x=v=>L+(v-lo)/(hi-lo)*(R-L);
    svg.innerHTML='';axisX(svg,x,lo,hi,Y,5,v=>v+'%','規律運動比例',L,R);
    const seen={};G.forEach(g=>{const key=g[5].toFixed(1);seen[key]=(seen[key]||0)+1;el('circle',{cx:x(g[5]),cy:Y-12-(seen[key]-1)*9,r:4,fill:'var(--muted)',opacity:.45},svg);});
    el('line',{x1:x(hit[5]),x2:x(hit[5]),y1:20,y2:Y,stroke:'var(--amber)','stroke-width':2},svg);
    el('circle',{cx:x(hit[5]),cy:Y,r:6,fill:'var(--amber)'},svg);
    const t=el('text',{x:Math.min(R-30,Math.max(L+30,x(hit[5]))),y:14,'text-anchor':'middle',style:'font-weight:700;fill:var(--amber)'},svg);t.textContent=hit[5].toFixed(1)+'%';
    const all=G.map(g=>g[5]),mn=Math.min(...all),mx=Math.max(...all);
    w.querySelector('#d5S').innerHTML=statsHTML([['規律運動比例',hit[5].toFixed(1)+'%','med'],['分析人數',hit[4].toLocaleString()],['十六種做法的最小值',mn.toFixed(1)+'%'],['最大值',mx.toFixed(1)+'%'],['最大減最小',(mx-mn).toFixed(1)+' 個百分點']]);
    const why=cur[0]==='days'?'只看天數時，沒回答強度題的人不影響結果，所以分母的選擇只在 -1 轉成遺漏後才有差別。':cur[2]==='all'?'分母用全體時，3,953 位沒回答強度題的人被算成不規律，比例被拉低。':'分母只算完整作答者，沒回答的人不計入，比例比用全體高約 6 個百分點。';
    w.querySelector('#d5M').textContent=`目前的做法得到 ${hit[5].toFixed(1)}%（${hit[4].toLocaleString()} 人）。${why}`;
  };
  D.forEach((d,i)=>segBind(w,d.k,v=>{cur[i]=v;draw();}));draw();
};
