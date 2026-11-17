/* ===== 講義步驟中的檔名 → 直接下載連結 ===== */
(()=>{
const FM=window.FILEMAP||{};const names=Object.keys(FM).sort((a,b)=>b.length-a.length);if(!names.length)return;
const DL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
const mk=n=>{const a=document.createElement('a');a.className='dl-file';a.href=FM[n];a.setAttribute('download',n);a.title='下載 '+n;a.innerHTML=DL+'<span></span>';a.lastChild.textContent=n;return a;};
// 1) 步驟說明裡的檔名
const g=document.getElementById('guide');
if(g){const re=new RegExp(names.map(n=>n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
  const w=document.createTreeWalker(g,NodeFilter.SHOW_TEXT,{acceptNode:t=>t.parentElement.closest('a,button,.dl-file')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  const nodes=[];let n;while(n=w.nextNode())if(re.test(n.data)){nodes.push(n);re.lastIndex=0;}
  nodes.forEach(t=>{const s=t.data;re.lastIndex=0;let m,last=0;const frag=document.createDocumentFragment();
    while(m=re.exec(s)){if(m.index>last)frag.appendChild(document.createTextNode(s.slice(last,m.index)));frag.appendChild(mk(m[0]));last=m.index+m[0].length;}
    if(last<s.length)frag.appendChild(document.createTextNode(s.slice(last)));
    const code=t.parentElement.tagName==='CODE'&&t.parentElement.textContent===s?t.parentElement:null;
    (code||t).replaceWith(frag);});}
// 2) 「本章資料」清單：每個檔都能單獨下載
document.querySelectorAll('#files .file').forEach(f=>{const nm=(f.querySelector('small')||{}).textContent;const z=f.querySelector('.inzip');
  if(nm&&FM[nm]&&z){const a=mk(nm);a.classList.add('dl-btn');a.lastChild.textContent='下載';z.replaceWith(a);}});
const note=document.getElementById('filesNote');if(note&&/ZIP 內/.test(note.textContent))note.textContent='每個檔案都可以單獨下載，也可以按上方按鈕一次下載全部（ZIP）。SPS 語法裡的路徑要改成自己的下載位置。';
})();
