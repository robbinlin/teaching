/* ===== episode flow: watch one, play one ===== */
(()=>{
const stage=document.querySelector('[data-stage="learn"]');const vbox=document.getElementById('videos');if(!stage||!vbox)return;
const MAP=window.EP_MAP;const cons=[...stage.querySelectorAll('.concept')];
const nV=vbox.children.length||3;const map=MAP||Array.from({length:nV},(_,i)=>cons.length===nV?[i]:[]);
const flow=document.createElement('div');flow.className='epflow';flow.id='epflow';
const titles=[...vbox.querySelectorAll('.video h3')].map(h=>h.textContent);
for(let i=0;i<nV;i++){
  const ep=document.createElement('section');ep.className='ep';ep.dataset.ep=i;
  const t=(titles[i]||'').replace(/^EP\d+\s*/,'');
  const cs=map[i]||[];
  ep.innerHTML=`<div class="ep-head"><span class="ep-badge">${i+1}</span><span class="label">第 ${i+1} 段 · EP${i+1}</span><h3>${esc(t)}</h3><span class="ep-state">尚未觀看</span></div><div class="ep-video"></div>`+
    (cs.length?`<p class="ep-go"><span>${cs.some(c=>cons[c]&&cons[c].querySelector('.widget'))?`看完影片，<b>接著動手：概念 ${cs.map(c=>c+1).join('、')}</b>，用工具驗證影片裡的說法。`:`看完影片，<b>接著讀：概念 ${cs.map(c=>c+1).join('、')}</b>，把這一集的重點整理一次。`}</span></p><div class="ep-concepts"></div>`:'');
  const box=ep.querySelector('.ep-concepts');cs.forEach(c=>{if(cons[c])box.appendChild(cons[c]);});
  flow.appendChild(ep);
}
// leftover concepts (not mapped) go to the last segment
const used=new Set(map.flat());const left=cons.filter((_,i)=>!used.has(i));
if(left.length){const last=flow.lastElementChild;let box=last.querySelector('.ep-concepts');if(!box){box=document.createElement('div');box.className='ep-concepts';last.appendChild(box);}left.forEach(c=>box.appendChild(c));}
vbox.before(flow);vbox.hidden=true;const cb=document.getElementById('concepts');if(cb&&!cb.children.length)cb.hidden=true;
const p=stage.querySelector('.stage-head p');if(p)p.textContent='分成三段，每段先看一集動畫（約兩分鐘，會在 YouTube 開啟，點時間碼可直接跳到那一段），看完回來用下面的工具動手驗證，再進下一段。';
function place(){const cards=[...vbox.children];flow.querySelectorAll('.ep').forEach((ep,i)=>{const slot=ep.querySelector('.ep-video');slot.innerHTML='';if(cards[i])slot.appendChild(cards[i]);
  const seen=!!(cards[i]&&cards[i].querySelector('.seen'));ep.classList.toggle('watched',seen);ep.querySelector('.ep-state').textContent=seen?'✓ 已觀看':'尚未觀看';ep.querySelector('.ep-badge').textContent=seen?'✓':(i+1);});}
place();
const orig=renderVideos;renderVideos=function(){orig();place();};
})();
