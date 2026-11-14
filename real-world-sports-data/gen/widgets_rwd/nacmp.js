/* ---------- W04: nacmp 遺漏值的比較，三種語言三種結果 ---------- */
W.nacmp=(w)=>{
  // 示意用小資料：x 為某題作答，-1 是遺漏碼，null 是已經是遺漏的值
  const X=[1,4,null,2,-1,5,null,3];
  let lang='sas',conv=false;
  const NA={sas:'.',r:'NA',pd:'NaN'};
  const CODE={sas:'if x < 3;',r:'filter(d, x < 3)',pd:'d[d.x < 3]'};
  w.innerHTML=`<div class="widget-title"><strong>同一個條件 x &lt; 3，留下哪幾列</strong>${segHTML('nalang',[['sas','SAS'],['r','R'],['pd','pandas']],'sas')}</div>
  <div class="in-row"><label style="display:inline-flex;gap:8px;align-items:center;cursor:pointer"><input type="checkbox" id="naConv" style="accent-color:var(--accent)">先把 -1 轉成遺漏</label><code id="naCode" style="font-family:var(--mono);font-size:14px"></code></div>
  <div class="tbl-wrap"><table class="ct" id="naT"></table></div><div id="naS"></div><p class="readout" id="naM"></p>
  <p class="note" style="margin:0">8 列示意資料，不是主資料集。</p>`;
  const draw=()=>{
    const x=X.map(v=>conv&&v===-1?null:v);
    const res=x.map(v=>v===null?(lang==='sas'?['成立','keep']:lang==='r'?['NA','drop']:['False','drop']):(v<3?[lang==='pd'?'True':lang==='r'?'TRUE':'成立','keep']:[lang==='pd'?'False':lang==='r'?'FALSE':'不成立','drop']));
    let h='<tr><th>列</th><th>x</th><th>x &lt; 3 的結果</th><th>是否保留</th></tr>';
    x.forEach((v,i)=>{const [txt,k]=res[i];const miss=v===null;h+=`<tr><th>${i+1}</th><td class="${miss?'hl-den':''}" style="font-family:var(--mono)">${miss?NA[lang]:v}</td><td style="font-family:var(--mono)">${txt}</td><td class="${k==='keep'?'hl-num':''}">${k==='keep'?'保留':'<span class="note">丟掉</span>'}</td></tr>`;});
    w.querySelector('#naT').innerHTML=h;
    const kept=res.filter(r=>r[1]==='keep').length,keptMiss=x.filter((v,i)=>v===null&&res[i][1]==='keep').length;
    const nn=x.filter(v=>v!==null),mean=nn.reduce((s,v)=>s+v,0)/nn.length;
    w.querySelector('#naCode').textContent=CODE[lang];
    w.querySelector('#naS').innerHTML=statsHTML([['保留列數',kept+' / 8','med'],['其中遺漏值',keptMiss+' 列'],['x 的遺漏數',(8-nn.length)+' 個'],['x 的平均',f2(mean,2),'mean'],['計入平均的列數',nn.length+' 列']]);
    const a=lang==='sas'?`SAS 把數值遺漏視為比任何數都小，所以「. < 3」成立，${keptMiss} 列遺漏值被留下來。`:lang==='r'?'R 遇到遺漏值時比較結果是 NA，filter() 只留 TRUE，遺漏的列被丟掉，沒有任何訊息。':'pandas 遇到 NaN 時比較結果是 False，遺漏的列被丟掉，沒有任何訊息。';
    const b=conv?' -1 已轉成遺漏，平均只用真正的作答計算。':' -1 還留在資料裡：它小於 3 所以被當成一筆低分保留，平均也被它拉低。';
    w.querySelector('#naM').textContent=a+b;
  };
  segBind(w,'nalang',v=>{lang=v;draw();});
  w.querySelector('#naConv').addEventListener('change',e=>{conv=e.target.checked;draw();});
  draw();
};
