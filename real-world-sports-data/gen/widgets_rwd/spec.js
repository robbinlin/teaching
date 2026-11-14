/* ---------- W03: spec 規格書寫了哪些決策 → 還剩幾種答案 ---------- */
W.spec=(w)=>{
  // facts.json decision_grid：[定義, -1 處理, 分母, 加權, 分析人數, 比例%]
  const G=[["days","keep","all","none",37822,81.0],["days","keep","all","weight",37248,81.9],["days","keep","complete","none",37822,81.0],["days","keep","complete","weight",37248,81.9],["days","na","all","none",37822,81.0],["days","na","all","weight",37248,81.9],["days","na","complete","none",36842,83.2],["days","na","complete","weight",36660,83.2],["days_sweat","keep","all","none",37822,51.3],["days_sweat","keep","all","weight",37248,51.4],["days_sweat","keep","complete","none",33869,57.2],["days_sweat","keep","complete","weight",33710,56.9],["days_sweat","na","all","none",37822,51.3],["days_sweat","na","all","weight",37248,51.4],["days_sweat","na","complete","none",33499,57.9],["days_sweat","na","complete","weight",33353,57.5]];
  const D=[
    {label:'變項定義',field:'規格書「變項定義」',o:[['days','只看運動天數'],['days_sweat','天數＋流汗會喘']],v:'days_sweat'},
    {label:'-1 的處理',field:'「遺漏值規則」',o:[['keep','留著當數值'],['na','轉成遺漏']],v:'na'},
    {label:'分母',field:'「分析母體」',o:[['all','全體受訪者'],['complete','完整作答者']],v:'complete'},
    {label:'是否加權',field:'「方法」',o:[['none','不加權'],['weight','用權重變項']],v:'none'}];
  const on=[false,false,false,false];
  w.innerHTML=`<div class="widget-title"><strong>規格書寫了什麼，答案就剩幾種</strong><span><button class="btn" type="button" id="spAll">全部寫進規格</button> <button class="btn" type="button" id="spNone">全部不寫</button></span></div>
  <div id="spT" style="display:grid;gap:0"></div>
  ${SV('0 0 640 110','依目前規格可能出現的規律運動比例')}<div id="spS"></div><p class="readout" id="spM"></p>
  <p class="note" style="margin:0">沒寫進規格的決策，視為執行的人或模型可以任選。數字由課程衍生檔 survey4 重算（37,822 人）。</p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{
    w.querySelector('#spT').innerHTML=D.map((d,i)=>`<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;border-top:1px solid var(--line);padding:9px 0"><label style="display:inline-flex;gap:8px;align-items:center;cursor:pointer;min-width:10.5em"><input type="checkbox" data-spon="${i}"${on[i]?' checked':''} style="accent-color:var(--accent)"><span><b style="font-weight:500">${d.label}</b><br><span class="note">${d.field}</span></span></label>${on[i]?`<select data-spv="${i}" class="num-in" style="width:auto;max-width:100%">${d.o.map(([v,l])=>`<option value="${v}"${v===d.v?' selected':''}>${l}</option>`).join('')}</select>`:'<span class="note">沒寫，由執行者自行決定</span>'}</div>`).join('');
    const left=G.filter(g=>D.every((d,i)=>!on[i]||g[i]===d.v));
    const vals=[...new Set(left.map(g=>g[5]))].sort((a,b)=>a-b),mn=vals[0],mx=vals[vals.length-1];
    const L=30,R=610,Y=62,lo=45,hi=90,x=v=>L+(v-lo)/(hi-lo)*(R-L);
    svg.innerHTML='';axisX(svg,x,lo,hi,Y,5,v=>v+'%','規律運動比例',L,R);
    G.forEach(g=>el('circle',{cx:x(g[5]),cy:Y-12,r:4,fill:'var(--muted)',opacity:.25},svg));
    if(mx>mn)el('line',{x1:x(mn),x2:x(mx),y1:Y-12,y2:Y-12,stroke:'var(--amber)','stroke-width':3,opacity:.6},svg);
    vals.forEach(v=>el('circle',{cx:x(v),cy:Y-12,r:6,fill:'var(--amber)'},svg));
    const tl=el('text',{x:x(mn),y:Y-28,'text-anchor':mx>mn?'end':'middle',style:'fill:var(--amber);font-weight:700'},svg);tl.textContent=mn.toFixed(1)+'%';
    if(mx>mn){const tr=el('text',{x:x(mx),y:Y-28,'text-anchor':'start',style:'fill:var(--amber);font-weight:700'},svg);tr.textContent=mx.toFixed(1)+'%';}
    const nOn=on.filter(Boolean).length;
    w.querySelector('#spS').innerHTML=statsHTML([['已寫進規格',nOn+' / 4 項'],['符合規格的做法',left.length+' 種'],['可能出現的比例',vals.length+' 個','med'],['最小',mn.toFixed(1)+'%'],['最大',mx.toFixed(1)+'%'],['差距',(mx-mn).toFixed(1)+' 個百分點']]);
    w.querySelector('#spM').textContent=vals.length===1?(nOn===4?`四項都寫了，任何人照這份規格執行都應該得到 ${mn.toFixed(1)}%。這就是規格書的測試。`:`目前寫的這幾項已足以讓數字固定在 ${mn.toFixed(1)}%，但沒寫的決策仍可能改變分析人數，還是應該補上。`):`還有 ${4-nOn} 項沒寫，兩個人照同一份規格可能交出 ${mn.toFixed(1)}% 到 ${mx.toFixed(1)}% 之間的 ${vals.length} 個不同數字，而且都沒有違反規格。`;
  };
  w.addEventListener('change',e=>{const t=e.target;if(t.dataset.spon!==undefined){on[+t.dataset.spon]=t.checked;draw();}else if(t.dataset.spv!==undefined){D[+t.dataset.spv].v=t.value;draw();}});
  w.querySelector('#spAll').addEventListener('click',()=>{on.fill(true);draw();});
  w.querySelector('#spNone').addEventListener('click',()=>{on.fill(false);draw();});
  draw();
};
