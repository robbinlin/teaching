/* ---------- W02: qtype 這句話是描述、預測還是因果 ---------- */
W.qtype=(w)=>{
  const T={d:'描述',p:'預測',c:'因果'};
  const NEED={d:'關鍵要求：樣本能代表母體，所以要看抽樣設計與權重。',p:'關鍵要求：模型在沒看過的資料上仍然準確，所以要切分資料並驗證。',c:'關鍵要求：比較的兩組在其他方面可比，所以要處理混淆。'};
  const Q=[
    ['各縣市學生的規律運動比例是多少？','d','問的是現況的數值，沒有要猜誰、也沒有要改變什麼。'],
    ['能不能由性別、年級與學制，找出不規律運動的學生？','p','目的是在個別學生身上猜對結果，變項是不是原因並不重要。'],
    ['參加運動社團，會不會讓學生更規律運動？','c','問的是「如果讓學生參加」會發生什麼，這是介入的效果。'],
    ['男生和女生的規律運動比例差幾個百分點？','d','只是比較兩群人的現況，沒有主張性別造成差異的機制。'],
    ['學校增設運動設施後，學生的運動量會增加嗎？','c','「增設後會不會增加」是改變一件事之後的結果。'],
    ['用上學期的體育學習認知分數，能預估誰下學期會停止規律運動嗎？','p','用現在已知的資訊猜未來的狀態。'],
    ['都市化程度愈高的地區，學生規律運動的比例是否愈低？','d','問的是比例隨層級的分布型態；若要說都市化「造成」差異才是因果。'],
    ['提升學生對運動好處的認知，能提高規律運動的比例嗎？','c','「提升…能提高」是介入語言，橫斷面調查很難回答。'],
    ['哪些背景特徵的組合，最能區分規律與不規律運動的學生？','p','「最能區分」是區辨力，屬於預測；重要的特徵不等於原因。'],
    ['國小、國中、高中學生平均每週運動幾天？','d','各學制現況的平均值，重點在樣本是否代表各學制的學生。']];
  let ans=Q.map(()=>null);
  w.innerHTML=`<div class="widget-title"><strong>這句話問的是哪一類問題</strong><span><b id="qtN" style="font-family:var(--mono)"></b> <button class="btn" type="button" id="qtR">重來</button></span></div>
  <div id="qtL" style="display:grid;gap:12px"></div><p class="readout" id="qtM"></p>`;
  const draw=()=>{
    w.querySelector('#qtL').innerHTML=Q.map((q,i)=>{const a=ans[i];const ok=a===q[1];
      return `<div style="border-top:1px solid var(--line);padding-top:10px"><p style="margin:0 0 8px"><span class="note" style="font-family:var(--mono)">${String(i+1).padStart(2,'0')}</span>　${esc(q[0])}</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${Object.keys(T).map(k=>`<button type="button" class="btn" data-qt="${i},${k}" aria-pressed="${a===k}" style="padding:6px 16px;${a===k?`border-color:var(--${ok?'ok':'bad'});color:var(--${ok?'ok':'bad'})`:''}">${T[k]}</button>`).join('')}</div>
      ${a?`<p class="fb ${ok?'ok':'no'}" style="margin-top:8px"><b>${ok?'答對了':'再想想'}</b>${ok?esc(q[2])+' '+NEED[q[1]]:'想一下：這句話是在問現況、在猜某個人的結果，還是在問改變一件事之後會怎樣。'}</p>`:''}</div>`;}).join('');
    const done=ans.filter(Boolean).length,right=ans.filter((a,i)=>a===Q[i][1]).length;
    w.querySelector('#qtN').textContent=`答對 ${right} / ${Q.length}`;
    w.querySelector('#qtM').textContent=right===Q.length?'十題全對。回頭看第 3、5、8 題：句子裡出現「會不會讓」「能提高」「之後會不會」，就要用因果的標準檢驗。':done===0?'每題選一類，立刻知道對錯與理由，可以改選。':`已作答 ${done} 題。同一組變項，問法不同，需要的方法與能下的結論就不同。`;
  };
  w.addEventListener('click',e=>{const b=e.target.closest('[data-qt]');if(b){const [i,k]=b.dataset.qt.split(',');ans[+i]=k;draw();}});
  w.querySelector('#qtR').addEventListener('click',()=>{ans=Q.map(()=>null);draw();});
  draw();
};
