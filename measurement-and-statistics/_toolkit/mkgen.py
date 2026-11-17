"""由高等體育統計的 _toolkit（gen/）產生本課程版本（gen2/）。每個替換都用 assert 確認原文存在。
  python -X utf8 mkgen.py
"""
import re, shutil
from pathlib import Path

here = Path(__file__).resolve().parent
G, G2 = here / 'gen', here / 'gen2'
G2.mkdir(exist_ok=True)
rd = lambda n: (G / n).read_text(encoding='utf-8')
wr = lambda n, s: (G2 / n).write_text(s, encoding='utf-8', newline='\n')


def rep(s, a, b, n=1):
    assert s.count(a) == n, (a[:60], s.count(a))
    return s.replace(a, b)


for f in ['base.css', 'extra.css', 'filelink.css', 'filelink.js', 'widgets.js']:
    shutil.copyfile(G / f, G2 / f)

# ---- prelude：每門課的 localStorage key 前綴必須不同
p = rd('prelude.js')
p = rep(p, "const KEY='ass-ch'+CH.id+'-v2';", "const KEY='mstat-ch'+CH.id+'-v1';")
wr('prelude.js', p)

# ---- body
b = rd('body.html')
b = rep(b, '<span class="brand-mark">Advanced Statistics</span><span><strong>高等體育統計</strong><small>國立體育大學 競技與教練科學研究所・林彥光 老師</small></span>',
        '<span class="brand-mark">Measurement &amp; Statistics</span><span><strong>體育測驗與統計</strong><small>國立體育大學・林彥光 老師</small></span>')
b = rep(b, '三集動畫各約兩分鐘。點時間碼可直接跳到那一段（會在 YouTube 開啟）。看完回來，用下面的小工具驗證影片裡的說法。',
        '四集短片各約兩分鐘，直接在頁面上播放，點時間碼可跳到那一段。每看完一集，用下面的小工具動手驗證影片裡的說法。')
b = rep(b, '題目的數字都來自本章講義與 SPSS 指南的實際輸出。', '題目依本章講義與短片出題，數字都重新計算核對過。')
wr('body.html', b)

# ---- main
m = rd('main.js')
m = rep(m, "[CH.videos.length,'集動畫'],[CH.slidesN,'張投影片'],nImg?[nImg,'張 SPSS 截圖']:null,",
        "[CH.videos.length,'集短片'],[CH.widgets.filter(Boolean).length,'個互動工具'],[CH.slidesN,'張投影片'],")
m = rep(m, '[1,2,3,4,5,6,7,8].map(i=>i===CH.id?', 'CH.chs.map(i=>i===CH.id?')
m = rep(m, "document.title='高等體育統計 第'+CH.id+'章';", "document.title='體育測驗與統計 第 '+CH.id+' 章 '+CH.title;")
m = rep(m, '`高等體育統計・第 ${CH.id} 章。數值核對自本章講義與 SPSS 指南之實際輸出。進度與作答只保存在你目前使用的瀏覽器。`',
        '`體育測驗與統計・第 ${CH.id} 章。內容依本章講義與短片製作，數值都重新計算核對過。進度與作答只保存在你目前使用的瀏覽器。`')
m = rep(m, 'const nxt=CH.id<8&&NAV[CH.id+1];', 'const NXT=CH.chs[CH.chs.indexOf(CH.id)+1];const nxt=NXT&&NAV[NXT];')
m = rep(m, "const isSpss=CH.guideType==='spss';\nconst STAGES=[['learn','影片與概念'],['slides','投影片'],['spss',isSpss?'SPSS 操作':'計算核對'],",
        "const ST3=CH.stage3;\nconst STAGES=[['learn','影片與概念'],['slides','投影片'],['spss',ST3.tab],")
i, j = m.index('/* ---------- videos ---------- */'), m.index('/* ---------- concepts ---------- */')
VIDEOS = r'''/* ---------- videos ---------- */
const secs=t=>{const [m,s]=t.split(':').map(Number);return m*60+s;};
const SEEN='<span class="seen">已觀看</span>';
const PLAY='<span class="play"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span>';
function renderVideos(){
  $('#videos').innerHTML=CH.videos.map(v=>{
    const media=v.id?`<div class="thumb yt" role="button" tabindex="0" data-ytplay="${v.k}" data-t="0" aria-label="播放 ${esc(v.t)}"><img src="thumbs/${v.k}.jpg" alt="" loading="lazy">${S.videos[v.k]?SEEN:''}${PLAY}</div>`
      :`<div class="thumb vp"><video controls preload="none" playsinline poster="thumbs/${v.k}.jpg" data-vk="${v.k}" aria-label="${esc(v.t)}"><source src="${esc(v.src)}" type="video/mp4"></video>${S.videos[v.k]?SEEN:''}</div>`;
    const chip=([t,l])=>`<li><button type="button" ${v.id?'data-ytplay':'data-seek'}="${v.k}" data-t="${secs(t)}"><span class="t">${t}</span><span>${esc(l)}</span></button></li>`;
    return `<article class="video" data-card="${v.k}">${media}<div class="body"><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p><ul class="chips">${v.c.map(chip).join('')}</ul>${v.id?`<a class="ytlink" href="https://youtu.be/${v.id}" target="_blank" rel="noopener">在 YouTube 開啟</a>`:''}</div></article>`;}).join('');
}
function markSeen(k){if(S.videos[k])return;S.videos[k]=true;save();const t=$(`[data-card="${k}"] .thumb`);if(t&&!t.querySelector('.seen'))t.insertAdjacentHTML('beforeend',SEEN);progress();if(window.__epSync)window.__epSync();}
function ytPlay(k,t){const v=CH.videos.find(x=>x.k===k);const box=$(`[data-card="${k}"] .thumb`);if(!v||!box)return;
  $$('.thumb.yt iframe').forEach(f=>{const b=f.parentElement;if(b!==box){const kk=b.dataset.ytplay;b.innerHTML=`<img src="thumbs/${kk}.jpg" alt="">${S.videos[kk]?SEEN:''}${PLAY}`;}});
  box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&playsinline=1&start=${t|0}" title="${esc(v.t)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  box.scrollIntoView({block:'nearest',behavior:'smooth'});setTimeout(()=>markSeen(k),3000);}
document.addEventListener('timeupdate',e=>{const v=e.target;if(v.tagName==='VIDEO'&&v.dataset.vk&&v.duration&&v.currentTime/v.duration>=0.9)markSeen(v.dataset.vk);},true);
document.addEventListener('ended',e=>{const v=e.target;if(v.tagName==='VIDEO'&&v.dataset.vk)markSeen(v.dataset.vk);},true);
document.addEventListener('play',e=>{const v=e.target;if(v.tagName==='VIDEO')$$('video[data-vk]').forEach(o=>{if(o!==v)o.pause();});},true);
document.addEventListener('click',e=>{
  const y=e.target.closest('[data-ytplay]');if(y){if(y.querySelector('iframe'))return;ytPlay(y.dataset.ytplay,+y.dataset.t);return;}
  const b=e.target.closest('[data-seek]');
  if(b){const v=$(`video[data-vk="${b.dataset.seek}"]`);if(!v)return;const t=+b.dataset.t;const go=()=>{v.currentTime=t;v.play();};if(v.readyState>=1)go();else{v.addEventListener('loadedmetadata',go,{once:true});v.load();}}
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.thumb.yt')){e.preventDefault();ytPlay(e.target.dataset.ytplay,0);}});

'''
m = m[:i] + VIDEOS + m[j:]
m = rep(m, '高等體育統計_CH${pad2(CH.id)}_資料.zip', '體育測驗與統計_CH${pad2(CH.id)}_資料.zip')
m, n = re.subn(r"\$\('#filesNote'\)\.textContent=CH\.files\.every\(.*?;\n", "$('#filesNote').textContent=CH.filesNote||'每個檔案都可以單獨下載，也可以一次下載全部（ZIP）。CSV 檔用 Excel 或 SPSS 都能直接開啟。';\n", m, flags=re.S)
assert n == 1
m, n = re.subn(r"\$\('#h-spss'\)\.textContent=isSpss\?.*?;\n", "$('#h-spss').textContent=ST3.title;\n", m)
assert n == 1
m, n = re.subn(r"\$\('#spssLede'\)\.textContent=isSpss\?.*?;\n", "$('#spssLede').textContent=ST3.lede;\n", m)
assert n == 1
m = rep(m, r"const shot=/!\[([^\]]*)\]\(截圖\/([^)]+)\)/.exec(line);", r"const shot=/!\[([^\]]*)\]\((?:截圖|img)\/([^)]+)\)/.exec(line);")
m = rep(m, "const src='spss/'+file;", "const src='img/'+file;")
m = rep(m, "(restC||'SPSS 操作畫面')", "(restC||'操作畫面')")
# 數值題接受全形負號與全形數字的減號
assert m.count(".replace(/,/g,'').replace(/%$/,'')") == 2
m = m.replace(".replace(/,/g,'').replace(/%$/,'')", ".replace(/,/g,'').replace(/[−－]/g,'-').replace(/%$/,'')")
m = rep(m, '下一章：第 ${CH.id+1} 章', '下一章：第 ${NXT} 章')
assert 'isSpss' not in m and '高等' not in m, [x for x in ('isSpss', '高等') if x in m]
BOOT = 'renderVideos();renderConcepts();renderSlides();renderFiles();renderGuide();renderQuiz();renderHW();'
TAIL = 'route();progress();'
assert m.count(BOOT) == 1 and m.count(TAIL) == 1
m = m.replace(BOOT, BOOT + '\n/*__EPFLOW__*/').replace(TAIL, '/*__FILELINK__*/\n' + TAIL)
wr('main.js', m)

# ---- epflow：卡片只搬一次，之後只更新狀態（影片播放中不能重繪）
EP = r'''/* ===== episode flow: watch one, play one ===== */
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
'''
wr('epflow.js', EP)
c = rd('epflow.css')
c = rep(c, "stroke='%230B7A80'", "stroke='%233B5A94'")
c = rep(c, '.ep .video .thumb{flex:0 0 min(42%,400px);align-self:flex-start}', '.ep .video .thumb{flex:0 0 min(60%,640px);align-self:flex-start}')
wr('epflow.css', c)
print('gen2 ok')
