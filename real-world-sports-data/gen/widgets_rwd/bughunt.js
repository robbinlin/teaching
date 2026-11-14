/* ---------- W06: bughunt（數字取自 facts.json，survey4.sas7bdat，n = 37,822）---------- */
W.bughunt=(w)=>{
  const CU=[[1,3925,1],[2,4053,0],[3,4075,3],[4,2404,3],[5,3006,3],[6,1105,5],[7,2580,3],[8,1223,4],[9,1130,4],[10,1469,3],[11,1091,5],[12,1323,4],[13,1271,4],[14,1412,4],[15,977,6],[16,1103,6],[17,947,3],[18,1214,2],[19,1196,2],[20,1190,2],[21,787,3],[22,339,4]];
  const UR=[[1,3925,1845],[2,3600,1847],[3,15268,7968],[4,6698,3643],[5,2196,1147],[6,2080,1138]];
  const N=37822,NMISS=4055,K=19386,NC=33499;
  let tab='c1',showMiss=false,zero=true,stat='sum';w.style.minWidth='0';
  const n0=x=>x.toLocaleString('en-US');
  w.innerHTML=`<div class="widget-title"><strong>三個不會報錯的錯誤</strong>${segHTML('bht',[['c1','案例一'],['c2','案例二'],['c3','案例三']],'c1')}</div><div id="bhBody" style="min-width:0"></div><p class="readout" id="bhM"></p><p class="note" style="margin:0">資料：課程既有衍生檔，37,822 位學生。縣市只列代碼。</p>`;
  const body=w.querySelector('#bhBody'),msg=w.querySelector('#bhM');
  const d1=()=>{const cols=showMiss?[1,2,3,4,5,6,0]:[1,2,3,4,5,6];const rows=showMiss?CU:CU.filter(r=>r[2]!==0);
    const colTot=c=>CU.filter(r=>r[2]===c).reduce((s,r)=>s+r[1],0)+(c===0?2:0);
    let h=`<tr><th>縣市代碼</th>${cols.map(c=>`<th>${c?'第 '+c+' 層':'遺漏'}</th>`).join('')}<th>合計</th></tr>`;
    rows.forEach(r=>{h+=`<tr><th>${r[0]}</th>${cols.map(c=>`<td class="${c===r[2]?(c===0?'hl-num':'hl-den'):''}" style="padding:3px 8px;text-align:right">${c===r[2]?n0(r[1]):''}</td>`).join('')}<td class="tot" style="padding:3px 8px;text-align:right">${n0(r[1])}</td></tr>`;});
    if(showMiss)h+=`<tr><th>代碼遺漏</th>${cols.map(c=>`<td class="${c===0?'hl-num':''}" style="padding:3px 8px;text-align:right">${c===0?'2':''}</td>`).join('')}<td class="tot" style="padding:3px 8px;text-align:right">2</td></tr>`;
    h+=`<tr><th>合計</th>${cols.map(c=>`<td class="tot" style="padding:3px 8px;text-align:right">${n0(colTot(c))}</td>`).join('')}<td class="tot" style="padding:3px 8px;text-align:right">${n0(showMiss?N:N-NMISS)}</td></tr>`;
    body.innerHTML=`<div class="in-row"><span class="note">交叉表選項</span>${segHTML('bhm',[['0','預設輸出'],['1','加上 missing']],showMiss?'1':'0')}</div>
    <div class="tbl-wrap" style="max-height:340px;overflow:auto;margin-bottom:12px"><table class="ct" style="font-size:13px">${h}</table></div>`+
    statsHTML([['表中總人數',n0(showMiss?N:N-NMISS),'med'],['資料總人數',n0(N)],['沒有分層的人數',showMiss?n0(NMISS):'看不到',showMiss?'mean':''],['表中縣市數',showMiss?'22':'21']]);
    msg.textContent=showMiss?'加上遺漏欄，縣市代碼 2 的 4,053 人整列落在「遺漏」：六行 if / else if 沒有任何一行寫到代碼 2。另有 2 人縣市代碼本身遺漏。合計 4,055 人不在任何一層。':'預設輸出只有 21 個縣市、33,767 人，每個縣市都落在一層，看起來完全正常。少掉的 4,055 人沒有任何提示。切到「加上 missing」。';};
  const d2=()=>{const den=zero?N:NC,pct=K/den*100;const L=10,R=630,W_=R-L;const segs=zero?[[K,'var(--accent)','規律 '+n0(K)],[N-K,'var(--muted)','記為不規律 '+n0(N-K)]]:[[K,'var(--accent)','規律 '+n0(K)],[NC-K,'var(--muted)','不規律 '+n0(NC-K)],[N-NC,'var(--line)','遺漏 '+n0(N-NC)]];
    body.innerHTML=`<div class="in-row"><span class="note">兩題沒完整回答的人</span>${segHTML('bhz',[['1','else 記 0'],['0','記為遺漏']],zero?'1':'0')}</div>${SV('0 0 640 44','規律運動人數與分母')}<p class="note" style="margin:0">${segs.map(([v,c,l])=>`<span style="display:inline-block;width:10px;height:10px;background:${c};margin-right:4px"></span>${l}`).join('　')}</p>`+
      statsHTML([['規律運動人數',n0(K)],['分母',n0(den),'med'],['規律運動比例',pct.toFixed(1)+'%','mean'],['未完整作答',n0(N-NC)]]);
    const svg=body.querySelector('svg');let x=L;segs.forEach(([v,c,l])=>{const ww=v/N*W_;el('rect',{x,y:4,width:ww,height:36,style:'fill:'+c},svg);x+=ww;});
    msg.textContent=zero?'else 把 4,323 位沒完整回答的人（3,953 人沒答運動強度，370 人運動天數編碼為 -1）全部算成不規律。19,386 ÷ 37,822 = 51.3%。':'先把遺漏判出來，分子不變，分母縮到 33,499 人。19,386 ÷ 33,499 = 57.9%，比原來高 6.6 個百分點。哪一個才對，要寫在規格書裡。';};
  const d3=()=>{body.innerHTML=`<div class="in-row"><span class="note">vbar 的統計量</span>${segHTML('bhs',[['sum','預設：加總'],['mean','stat=mean']],stat)}</div>${SV('0 0 640 290','各都市化層級的長條圖')}`+
      statsHTML(stat==='sum'?[['最高的柱子','第 3 層'],['柱高',n0(7968),'med'],['最低的柱子','第 6 層'],['柱高',n0(1138)]]:[['最高的柱子','第 6 層'],['柱高','54.7%','mean'],['最低的柱子','第 1 層'],['柱高','47.0%']]);
    const svg=body.querySelector('svg');const L=64,R=625,T=28,B=240;const vals=UR.map(u=>stat==='sum'?u[2]:u[2]/u[1]*100);const top=stat==='sum'?8000:60,step=stat==='sum'?2000:10;
    const y=v=>B-v/top*(B-T),x=i=>L+(i+0.5)/6*(R-L),bw=58;
    axisY(svg,y,0,top,L,step,v=>stat==='sum'?n0(v):v,'規律運動百分比 (%)',T);
    vals.forEach((v,i)=>{el('rect',{x:x(i)-bw/2,y:y(v),width:bw,height:B-y(v),class:'bar'},svg);const t=el('text',{x:x(i),y:y(v)-5,'text-anchor':'middle'},svg);t.textContent=stat==='sum'?n0(v):v.toFixed(1);const l=el('text',{x:x(i),y:B+17,'text-anchor':'middle'},svg);l.textContent='第 '+(i+1)+' 層';});
    el('line',{x1:L,x2:R,y1:B,y2:B,class:'axis'},svg);const lb=el('text',{x:R,y:B+36,'text-anchor':'end'},svg);lb.textContent='都市化層級';
    msg.textContent=stat==='sum'?'y 軸標籤寫的是百分比，柱子上的數字卻是幾千。vbar 搭配 response= 時預設把 0/1 加總，畫出來的是規律運動人數。第 3 層最高，因為那一層有 15,268 人。':'加上 stat=mean 才是比例。最高的換成第 6 層 54.7%，第 3 層是 52.2%，最低是第 1 層 47.0%。軸標籤一個字都沒改。';};
  const draw=()=>{(tab==='c1'?d1:tab==='c2'?d2:d3)();};
  segBind(w,'bht',v=>{tab=v;draw();});segBind(w,'bhm',v=>{showMiss=v==='1';draw();});segBind(w,'bhz',v=>{zero=v==='1';draw();});segBind(w,'bhs',v=>{stat=v;draw();});
  draw();
};
