/* ===== episode flow: watch one, play one ===== */
(()=>{
const stage=document.querySelector('[data-stage="learn"]');const vbox=document.getElementById('videos');if(!stage||!vbox)return;
const cons=[...stage.querySelectorAll('.concept')];const cards=[...vbox.children];const nV=cards.length;
const map=CH.epmap||Array.from({length:nV},(_,i)=>cons.length===nV?[i]:[]);
const flow=document.createElement('div');flow.className='epflow';flow.id='epflow';
const NUM=['一','二','三','四','五','六'];
cards.forEach((card,i)=>{
  const ep=document.createElement('section');ep.className='ep';ep.dataset.ep=CH.videos[i].k;
  const t=CH.videos[i].t.replace(/^EP\d+\s*/,'');const cs=map[i]||[];
  ep.innerHTML=`<div class="ep-head"><span class="ep-badge">${i+1}</span><span class="label">第 ${i+1} 段 · EP${i+1}</span><h3>${esc(t)}</h3><span class="ep-state">尚未觀看</span></div><div class="ep-video"></div>`+
    (cs.length?`<p class="ep-go"><span>${cs.some(c=>cons[c]&&cons[c].querySelector('.widget'))?`看完影片，<b>接著動手：概念 ${cs.map(c=>c+1).join('、')}</b>，用工具驗證影片裡的說法。`:`看完影片，<b>接著讀：概念 ${cs.map(c=>c+1).join('、')}</b>，把這一集的重點整理一次。`}</span></p><div class="ep-concepts"></div>`:'');
  ep.querySelector('.ep-video').appendChild(card);
  const box=ep.querySelector('.ep-concepts');cs.forEach(c=>{if(cons[c])box.appendChild(cons[c]);});
  flow.appendChild(ep);
});
const used=new Set(map.flat());const left=cons.filter((_,i)=>!used.has(i));
if(left.length){const last=flow.lastElementChild;let box=last.querySelector('.ep-concepts');if(!box){box=document.createElement('div');box.className='ep-concepts';last.appendChild(box);}left.forEach(c=>box.appendChild(c));}
vbox.before(flow);vbox.hidden=true;const cb=document.getElementById('concepts');if(cb&&!cb.children.length)cb.hidden=true;
const p=stage.querySelector('.stage-head p');if(p)p.textContent=`分成${NUM[nV-1]||nV}段，每段先看一集短片（約兩分鐘，直接在頁面上播放，點時間碼可跳到那一段），看完用下面的工具動手驗證，再進下一段。`;
window.__epSync=function(){flow.querySelectorAll('.ep').forEach((ep,i)=>{const seen=!!S.videos[ep.dataset.ep];ep.classList.toggle('watched',seen);ep.querySelector('.ep-state').textContent=seen?'已觀看':'尚未觀看';ep.querySelector('.ep-badge').innerHTML=seen?'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 12l5 5 9-10"/></svg>':(i+1);});};
window.__epSync();
})();
