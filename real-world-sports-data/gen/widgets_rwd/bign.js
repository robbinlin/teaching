/* ---------- W08: bign（九題差異取自 facts.json b13_21_by_regular）---------- */
W.bign=(w)=>{
  const ITEMS=[['b13',0.17,0.10],['b14',0.23,0.25],['b15',0.31,0.36],['b16',0.22,0.28],['b17',0.27,0.30],['b18',0.19,0.23],['b19',0.20,0.22],['b20',0.19,0.19],['b21',0.15,0.18]];
  const nOf=v=>Math.round(20*Math.pow(1000,v/100));w.style.minWidth='0';
  const defs=[{id:'bgD',label:'效果量 d',min:0.02,max:0.5,step:0.01,value:0.10,fmt:v=>v.toFixed(2)},{id:'bgN',label:'每組樣本數',min:0,max:100,step:1,value:33,fmt:v=>nOf(v).toLocaleString('en-US')}];
  const pv=(d,n)=>{const t=d*Math.sqrt(n/2);return{t,p:2*(1-ST.pt(Math.abs(t),2*n-2))};};
  w.innerHTML=`<div class="widget-title"><strong>差異不變，樣本變大</strong><span class="note">兩組獨立樣本 t 檢定，兩組人數相同</span></div>${sliders(defs)}${SV('0 0 640 280','p 值隨每組樣本數變化的曲線')}<div id="bgSt"></div><p class="readout" id="bgM"></p>
  <div class="tbl-wrap"><table class="ct" style="font-size:14px"><tr><th>題號</th>${ITEMS.map(i=>`<th>${i[0]}</th>`).join('')}</tr><tr><th>平均差（分）</th>${ITEMS.map(i=>`<td style="padding:4px 8px;text-align:right">${i[1].toFixed(2)}</td>`).join('')}</tr><tr><th>d</th>${ITEMS.map(i=>`<td style="padding:4px 8px;text-align:right">${i[2].toFixed(2)}</td>`).join('')}</tr><tr><th>p 值</th>${ITEMS.map(()=>`<td style="padding:4px 8px;text-align:right">&lt; .001</td>`).join('')}</tr></table></div>
  <p class="note" style="margin:6px 0 0">上表：主資料集中規律與不規律運動兩組在體育學習認知九題（b13–b21，五點量表）的實際差異，每組約 1.7–1.9 萬人。</p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const d=val(w,'bgD'),n=nOf(val(w,'bgN'));svg.innerHTML='';const L=48,R=625,T=22,B=232;
    const x=v=>L+v/100*(R-L),y=p=>B-p*(B-T);
    axisY(svg,y,0,1,L,0.2,v=>v.toFixed(1),'p 值',T);
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);[20,100,1000,5000,20000].forEach(k=>{const xv=Math.log(k/20)/Math.log(1000)*100;el('line',{x1:x(xv),x2:x(xv),y1:B,y2:B+4,class:'axis'},svg);const t=el('text',{x:x(xv),y:B+17,'text-anchor':k===20000?'end':'middle'},svg);t.textContent=k.toLocaleString('en-US');});
    const lb=el('text',{x:R,y:B+34,'text-anchor':'end'},svg);lb.textContent='每組樣本數（對數刻度）';
    el('line',{x1:L,x2:R,y1:y(0.05),y2:y(0.05),style:'stroke:var(--bad);stroke-width:1.5;stroke-dasharray:5 4'},svg);const a=el('text',{x:R-4,y:y(0.05)-5,'text-anchor':'end',style:'fill:var(--bad)'},svg);a.textContent='p = .05';
    const pts=[];for(let v=0;v<=100;v+=1)pts.push([x(v),y(pv(d,nOf(v)).p)]);el('path',{d:pathOf(pts),class:'curve',style:'fill:none;stroke:var(--accent);stroke-width:2.5'},svg);
    const cur=pv(d,n),cx=x(val(w,'bgN'));el('line',{x1:cx,x2:cx,y1:T,y2:B,style:'stroke:var(--amber);stroke-width:1.5'},svg);el('circle',{cx,cy:y(cur.p),r:5,style:'fill:var(--amber)'},svg);
    const se=Math.sqrt(2/n+d*d/(4*n)),lo=d-1.96*se,hi=d+1.96*se,need=Math.ceil(2*Math.pow(1.96/d,2));
    w.querySelector('#bgSt').innerHTML=statsHTML([['每組樣本數',n.toLocaleString('en-US')],['t',cur.t.toFixed(2)],['p 值',fp(cur.p),cur.p<0.05?'med':''],['d 的 95% 信賴區間',lo.toFixed(2)+' 到 '+hi.toFixed(2),'mean'],['p 跨過 .05 約需每組',need.toLocaleString('en-US')+' 人']]);
    w.querySelector('#bgM').textContent=`效果量固定在 d = ${d.toFixed(2)}。每組 ${n.toLocaleString('en-US')} 人時 p ${cur.p<0.001?'< .001':'= '+fp(cur.p)}${cur.p<0.05?'，達到顯著':'，未達顯著'}。差異的大小從頭到尾沒有變，變的只有樣本數；樣本愈大，信賴區間愈窄，p 值愈小。d = 0.10 時每組約 769 人就會跨過 .05，主資料集每組超過 17,000 人。`;};
  bindSliders(w,defs,draw);draw();
};
