/* ---------- W05: joinrows ---------- */
W.joinrows=(w)=>{
  const LEFT=[['S1',1],['S2',1],['S3',2],['S4',3],['S5',3],['S6',4]];
  const RIGHT={uniq:[[1,1],[2,2],[3,3],[4,4],[5,5]],miss:[[1,1],[3,3],[4,4],[5,5]],dup:[[1,1],[2,2],[3,3],[3,4],[4,4],[5,5]]};
  const ALFA=[['A21',8],['A25',24],['A25',22],['A25',76]],BETA=[['A21',55],['A25',4],['A25',91],['A25',38]];
  const SC_NOTE={uniq:'右表每個縣市代碼只出現一次。',miss:'右表少了縣市代碼 2。',dup:'右表的縣市代碼 3 出現兩次（分層 3 與 4）。',m2m:'講義的 alfa、beta：A25 在兩張表各有 3 列。'};
  let sc='uniq',jt='left',shown=false;w.style.minWidth='0';
  const tbl=(head,rows,mark)=>`<table class="ct" style="font-size:14px"><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr>${rows.map((r,i)=>`<tr>${r.map(c=>`<td class="${mark&&mark(r,i)||''}" style="padding:4px 10px">${c===null?'<span style="color:var(--bad)">遺漏</span>':esc(c)}</td>`).join('')}</tr>`).join('')}</table>`;
  w.innerHTML=`<div class="widget-title"><strong>合併之前，先預測列數</strong></div>
  <div class="in-row"><span class="note">右表狀況</span>${segHTML('jrsc',[['uniq','鍵唯一'],['miss','缺一個縣市'],['dup','有重複'],['m2m','多對多']],'uniq')}</div>
  <div class="in-row" id="jrJt"><span class="note">合併類型</span>${segHTML('jrjt',[['inner','inner'],['left','left'],['full','full']],'left')}</div>
  <p class="note" id="jrNote" style="margin:6px 0"></p>
  <div id="jrSrc" style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start"></div>
  <div class="in-row" style="margin-top:12px"><label for="jrPred" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span id="jrPredLab">我預測合併後有幾列</span><input class="num-in" type="number" id="jrPred" min="0" max="40" step="1" inputmode="numeric"></label><button class="btn primary" type="button" id="jrGo">合併</button></div>
  <div id="jrOut" style="min-width:0"></div><p class="readout" id="jrM"></p>`;
  const q=id=>w.querySelector('#'+id);
  const join=()=>{const R=RIGHT[sc];const rows=[];const usedR=new Set();const un=[];
    LEFT.forEach(([id,c])=>{const m=R.map((r,i)=>[r,i]).filter(([r])=>r[0]===c);
      if(m.length)m.forEach(([r,i],k)=>{usedR.add(i);rows.push({r:[id,c,r[1]],extra:k>0});});
      else{un.push([id,c]);if(jt!=='inner')rows.push({r:[id,c,null]});}});
    if(jt==='full')R.forEach((r,i)=>{if(!usedR.has(i))rows.push({r:[null,r[0],r[1]],ronly:true});});
    return{rows,un};};
  const src=()=>{
    if(sc==='m2m'){q('jrSrc').innerHTML=`<div><span class="note">alfa（4 列）</span><div class="tbl-wrap">${tbl(['id','v1'],ALFA)}</div></div><div><span class="note">beta（4 列）</span><div class="tbl-wrap">${tbl(['id','v4'],BETA)}</div></div>`;}
    else{const R=RIGHT[sc];const cnt={};R.forEach(r=>cnt[r[0]]=(cnt[r[0]]||0)+1);
      q('jrSrc').innerHTML=`<div><span class="note">左表：學生（6 列，一列一位學生）</span><div class="tbl-wrap">${tbl(['學生','縣市代碼'],LEFT)}</div></div><div><span class="note">右表：縣市對照（${R.length} 列）</span><div class="tbl-wrap">${tbl(['縣市代碼','都市化分層'],R,r=>cnt[r[0]]>1?'hl-num':'')}</div></div>`;}
    q('jrJt').style.display=sc==='m2m'?'none':'';q('jrNote').textContent=SC_NOTE[sc];
    q('jrPredLab').textContent=sc==='m2m'?'我預測 PROC SQL inner join 的列數':'我預測合併後有幾列';};
  const draw=()=>{src();const out=q('jrOut');
    if(!shown){out.innerHTML='';q('jrM').textContent=sc==='m2m'?'同一個鍵在兩張表都重複。先想：SQL 會怎麼配對？DATA step 的 MERGE 又會怎麼配對？填入預測再按「合併」。':'先說出兩張表的粒度，再想這個合併類型會保留誰。填入預測再按「合併」。';return;}
    const pred=q('jrPred').value===''?null:Math.round(+q('jrPred').value);
    if(sc==='m2m'){const ds=ALFA.map((a,i)=>[a[0],a[1],BETA[i][1]]);const sq=[];ALFA.forEach(a=>BETA.forEach(b=>{if(a[0]===b[0])sq.push([a[0],a[1],b[1]]);}));
      const ok=pred===sq.length;
      out.innerHTML=statsHTML([['你的預測',pred===null?'—':pred,ok?'mean':''],['PROC SQL 列數',sq.length,'med'],['DATA step MERGE 列數',ds.length]])+
        `<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start"><div><span class="note">DATA step MERGE：同一鍵內依序一對一</span><div class="tbl-wrap">${tbl(['id','v1','v4'],ds)}</div></div><div><span class="note">PROC SQL：同一鍵內兩兩配對</span><div class="tbl-wrap">${tbl(['id','v1','v4'],sq)}</div></div></div>`+
        `<p class="fb ${ok?'ok':'no'}" style="margin-top:10px"><b>${ok?'預測正確':'預測不符'}</b>SQL 是 1 + 3×3 = 10 列，DATA step 是 4 列。兩段程式都沒有錯誤訊息。</p>`;
      q('jrM').textContent='把 DATA step 改寫成 SQL，或從 SAS 翻成 R，列數就從 4 變 10。遇到多對多，先回頭確認其中一張表的粒度是否弄錯。';return;}
    const {rows,un}=join();const n=rows.length,ok=pred===n;const extra=rows.filter(r=>r.extra).length,ronly=rows.filter(r=>r.ronly).length;
    out.innerHTML=statsHTML([['你的預測',pred===null?'—':pred,ok?'mean':''],['實際列數',n,'med'],['左表列數',LEFT.length],['沒對上的學生（anti join）',un.length],['重複鍵多出的列',extra],['只在右表的列',ronly]])+
      `<div class="tbl-wrap" style="max-height:300px;overflow:auto">${tbl(['學生','縣市代碼','都市化分層'],rows.map(x=>x.r),(r,i)=>rows[i].extra?'hl-num':(r[2]===null||r[0]===null)?'hl-den':'')}</div>`+
      `<p class="fb ${ok?'ok':'no'}" style="margin-top:10px"><b>${ok?'預測正確':'預測不符'}</b>${un.length?`沒對上：${un.map(u=>u[0]+'（縣市 '+u[1]+'）').join('、')}。`:'每位學生都對到了。'}${extra?`縣市 3 的兩位學生各被複製一次，多出 ${extra} 列。`:''}</p>`;
    let msg;
    if(sc==='dup')msg=jt==='inner'||jt==='left'||jt==='full'?`右表的鍵不唯一，列數由 6 變成 ${n}。S4、S5 各出現兩次，之後算比例時這兩人被算兩次。合併後列數不等於左表列數，就要回頭查右表。`:'';
    else if(sc==='miss')msg=jt==='inner'?'inner join 把沒對上的 S3 直接丟掉，列數變 5，沒有任何訊息。':jt==='left'?'left join 保留 S3，但分層是遺漏。列數仍是 6，所以只看列數抓不到，要用 anti join 或數遺漏。':'full join 保留兩邊全部：S3 的分層遺漏，另外多出一列只在右表的縣市 5。';
    else msg=jt==='inner'?'鍵唯一、每位學生都對得到，inner 與 left 的結果相同，都是 6 列。':jt==='left'?'多對一的 left join，合併後列數等於左表列數 6。這是唯一應該出現的結果。':'full join 多出一列：縣市 5 在右表有、左表沒有學生。';
    q('jrM').textContent=msg;};
  segBind(w,'jrsc',v=>{sc=v;shown=false;draw();});segBind(w,'jrjt',v=>{jt=v;shown=false;draw();});
  q('jrGo').addEventListener('click',()=>{shown=true;draw();});
  draw();
};
