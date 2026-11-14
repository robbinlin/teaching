/* ---------- W16: disclose ---------- */
W.disclose=(w)=>{
  const USED=['撰寫資料清理程式','撰寫分析程式','起草結果段落','製作互動儀表板'];
  const NOT=['研究問題','DAG 與調整集','結論'];
  const CHK=['所有衍生變項經交叉表檢查','列數帳核對：從原始資料到分析樣本','主要結果以 JASP 獨立重現','所有引用經作者核對原文','他人依 README 重跑得到相同數字'];
  const tin='font:inherit;padding:6px 8px;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--ink);width:100%;min-width:0';
  const txt=(id,lab,ph,type)=>`<label for="${id}" style="flex:1 1 150px;min-width:0;display:grid;gap:4px"><span>${lab}</span><input type="${type||'text'}" id="${id}" placeholder="${ph||''}" style="${tin}"></label>`;
  const grp=(name,title,arr)=>`<fieldset style="border:0;padding:0;margin:12px 0 0;min-width:0"><legend class="note" style="padding:0;margin-bottom:6px">${title}</legend><div class="opts">${arr.map((o,i)=>`<label class="opt"><input type="checkbox" data-dsc="${name}" value="${i}"><span>${o}</span></label>`).join('')}</div></fieldset>`;
  w.innerHTML=`<div class="widget-title"><strong>AI 使用揭露產生器</strong><span class="note">四個要素，缺一個就會被列出</span></div>
  <div class="in-row" style="align-items:flex-end">${txt('discloseTool','工具名稱','工具名稱')}${txt('discloseVer','模型版本','模型版本')}${txt('discloseDate','使用日期','','date')}</div>
  ${grp('used','用在哪裡',USED)}${grp('not','沒用在哪裡（由作者決定）',NOT)}${grp('chk','人做了什麼驗證',CHK)}
  <div class="tbl-wrap" style="margin-top:14px;padding:12px 14px;border:1px solid var(--line);border-radius:8px;background:var(--surface)"><p id="discloseOut" style="margin:0"></p></div>
  <div class="in-row" style="margin-top:10px"><button class="btn" type="button" id="discloseCopy">複製這段文字</button></div>
  <p class="readout" id="discloseM"></p>
  <p class="note" style="margin:0">勾選前先確認你真的做了。揭露寫了卻沒做的驗證，比不揭露更糟。</p>`;
  const q=id=>w.querySelector('#'+id);
  const picked=(name,arr)=>$$(`[data-dsc="${name}"]`,w).filter(x=>x.checked).map(x=>arr[+x.value]);
  let text='';
  const draw=()=>{
    const tool=q('discloseTool').value.trim(),ver=q('discloseVer').value.trim(),date=q('discloseDate').value;
    const u=picked('used',USED),n=picked('not',NOT),c=picked('chk',CHK);
    const miss=[];
    if(!tool||!ver||!date)miss.push('工具與版本（'+[!tool?'工具名稱':'',!ver?'模型版本':'',!date?'使用日期':''].filter(Boolean).join('、')+'）');
    if(!u.length)miss.push('用在哪裡');if(!n.length)miss.push('沒用在哪裡');if(!c.length)miss.push('人做了什麼驗證');
    const meta=[ver,date?'使用日期 '+date:''].filter(Boolean).join('，');
    const parts=[];
    parts.push(`本研究使用 ${tool||'［工具名稱］'}${meta?'（'+meta+'）':'（［模型版本、使用日期］）'}協助${u.length?u.join('、'):'［用在哪裡］'}。`);
    parts.push(`${n.length?n.join('、'):'［沒用在哪裡］'}由作者決定，未使用 AI 工具。`);
    parts.push(`作者做了下列驗證：${c.length?c.join('；'):'［人做的驗證］'}。`);
    parts.push('作者對全部內容負責。');
    text=parts.join('');q('discloseOut').textContent=text;
    q('discloseM').textContent=miss.length?`還缺 ${miss.length} 個要素：${miss.join('；')}。讀者無法從這段文字判斷風險。`:'四個要素都有了。讀者可以從這段文字判斷哪些部分由 AI 產生、哪些經過人工驗證。';
    q('discloseM').style.color=miss.length?'var(--bad)':'var(--ok)';};
  w.addEventListener('input',draw);w.addEventListener('change',draw);
  q('discloseCopy').addEventListener('click',()=>{const ok=()=>toast('已複製揭露文字');const fb=()=>{const r=document.createRange();r.selectNodeContents(q('discloseOut'));const s=getSelection();s.removeAllRanges();s.addRange(r);toast('已選取，請按 Ctrl+C 複製');};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(ok).catch(fb);else fb();});
  draw();
};
