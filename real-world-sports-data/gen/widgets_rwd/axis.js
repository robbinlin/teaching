/* ---------- W07: axis（各層 n、k 取自 facts.json by_urban_all）---------- */
W.axis=(w)=>{
  const UR=[[3925,1845],[3600,1847],[15268,7968],[6698,3643],[2196,1147],[2080,1138]];
  const P=UR.map(([n,k])=>k/n*100),SE=UR.map(([n,k])=>{const p=k/n;return Math.sqrt(p*(1-p)/n)*100;});
  const defs=[{id:'axS',label:'y 軸起點',min:0,max:45,step:1,value:0,fmt:v=>v+'%'}];let ci=false;w.style.minWidth='0';
  w.innerHTML=`<div class="widget-title"><strong>同一組比例，換一個 y 軸起點</strong>${segHTML('axci',[['0','只畫比例'],['1','加 95% 區間']],'0')}</div>${sliders(defs)}${SV('0 0 640 300','六個都市化層級的規律運動比例長條圖')}<div id="axSt"></div><p class="readout" id="axM"></p><p class="note" style="margin:0">資料：課程既有衍生檔，六層共 33,767 人；未加權，沒完整回答者記為不規律。</p>`;
  const svg=w.querySelector('svg');
  const draw=()=>{const s=val(w,'axS');svg.innerHTML='';const L=48,R=625,T=24,B=250,top=60;
    const y=v=>B-(v-s)/(top-s)*(B-T),x=i=>L+(i+0.5)/6*(R-L),bw=56;const step=top-s>30?10:top-s>15?5:2;
    axisY(svg,y,s,top,L,step,v=>v,'規律運動比例 (%)',T);
    P.forEach((v,i)=>{el('rect',{x:x(i)-bw/2,y:y(v),width:bw,height:Math.max(0,B-y(v)),class:'bar'},svg);
      const t=el('text',{x:x(i),y:y(v+(ci?1.96*SE[i]:0))-6,'text-anchor':'middle'},svg);t.textContent=v.toFixed(1);
      if(ci){const lo=v-1.96*SE[i],hi=v+1.96*SE[i];el('line',{x1:x(i),x2:x(i),y1:y(hi),y2:y(Math.max(lo,s)),style:'stroke:var(--amber);stroke-width:2'},svg);[hi,lo].forEach(c=>{if(c>=s)el('line',{x1:x(i)-8,x2:x(i)+8,y1:y(c),y2:y(c),style:'stroke:var(--amber);stroke-width:2'},svg);});}
      const l=el('text',{x:x(i),y:B+17,'text-anchor':'middle'},svg);l.textContent='第 '+(i+1)+' 層';});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);
    if(s>0){const b=el('text',{x:R,y:B+38,'text-anchor':'end',style:'fill:var(--bad)'},svg);b.textContent='軸從 '+s+'% 開始';}
    const hi=Math.max(...P),lo=Math.min(...P),ratio=(hi-s)/(lo-s);
    w.querySelector('#axSt').innerHTML=statsHTML([['最高柱 ÷ 最低柱（視覺）',ratio.toFixed(2)+' 倍','med'],['最高 ÷ 最低（實際）',(hi/lo).toFixed(2)+' 倍'],['實際差距',(hi-lo).toFixed(1)+' 百分點','mean'],['第 6 層 95% 區間',(P[5]-1.96*SE[5]).toFixed(1)+'–'+(P[5]+1.96*SE[5]).toFixed(1)+'%']]);
    w.querySelector('#axM').textContent=(s===0?'y 軸從 0 開始：第 6 層（54.7%）的柱子是第 1 層（47.0%）的 1.16 倍高，與實際相符。把起點往右拉。':`y 軸從 ${s}% 開始：最高的柱子看起來是最低的 ${ratio.toFixed(1)} 倍，實際只差 7.7 個百分點、1.16 倍。數字沒有變，變的是柱子的比例。`)+(ci?' 信賴區間顯示：第 2 到第 6 層的區間多半互相重疊，只有第 1 層明顯較低。':'');};
  bindSliders(w,defs,draw);segBind(w,'axci',v=>{ci=v==='1';draw();});draw();
};
