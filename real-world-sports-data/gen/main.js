/* ---------- hero & nav ---------- */
const pad2=n=>String(n).padStart(2,'0');
$('#hEyebrow').textContent=CH.eyebrow;$('#hTitle').textContent=CH.title;$('#hLede').textContent=CH.lede;
$('#hObj').innerHTML=CH.objectives.map((o,i)=>`<li><span>目標 ${i+1}</span>${esc(o)}</li>`).join('');
const nImg=(CH.guide.match(/!\[/g)||[]).length;
$('#hFacts').innerHTML=[[CH.videos.length,'集動畫'],[CH.slidesN,'張投影片'],nImg?[nImg,'張 SPSS 截圖']:null,[CH.quiz.length,'題自我檢測'],[CH.hw.questions.length,'題作業']].filter(Boolean).map(([n,l])=>`<span><b>${n}</b> ${l}</span>`).join('');
const NAV=CH.nav||{};
const TGT=CH.static?'':' target="_blank" rel="noopener"';
$('#chapnav').innerHTML=(NAV.home?`<a class="home" href="${esc(NAV.home)}"${TGT}>課程首頁</a>`:'')+[1,2,3,4,5,6,7,8].map(i=>i===CH.id?`<span class="cur" aria-current="page">CH${pad2(i)}</span>`:NAV[i]?`<a href="${esc(NAV[i])}"${TGT}>CH${pad2(i)}</a>`:`<span>CH${pad2(i)}</span>`).join('');
document.title='高等體育統計 第'+CH.id+'章';
$('#footText').textContent=`高等體育統計・第 ${CH.id} 章。數值核對自本章講義與 SPSS 指南之實際輸出。進度與作答只保存在你目前使用的瀏覽器。`;
const nxt=CH.id<8&&NAV[CH.id+1];$('#nextCh').innerHTML=nxt?`<a class="btn primary" href="${esc(nxt)}"${TGT}>下一章：第 ${CH.id+1} 章</a>`:'<a class="btn" href="#learn">回到影片與概念</a>';

/* ---------- stages / router ---------- */
const isSpss=CH.guideType==='spss';
const STAGES=[['learn','影片與概念'],['slides','投影片'],['spss',isSpss?'SPSS 操作':'計算核對'],['quiz','自我檢測'],['homework','章節作業']];
$('#stageNav').innerHTML=STAGES.map(([id,lab],i)=>`<a class="stage-tab" href="#${id}" data-tab="${id}"><span class="n">${i+1}</span>${lab}</a>`).join('');
$('#toSpss').firstChild.textContent='下一步：'+STAGES[2][1]+' ';$('#backSpss').textContent='上一步：'+STAGES[2][1];
function route(){
  let h=(location.hash||'').slice(1);let sub=null;
  if(/^spss-\d+$/.test(h)){sub=h;h='spss';}
  if(!STAGES.some(s=>s[0]===h))h='learn';
  $$('.stage').forEach(s=>s.hidden=s.dataset.stage!==h);
  $$('.stage-tab').forEach(t=>{if(t.dataset.tab===h)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current');});
  const cur=$(`.stage-tab[data-tab="${h}"]`);if(cur)cur.scrollIntoView({block:'nearest',inline:'nearest'});
  if(sub){const d=document.getElementById(sub);if(d){d.open=true;setTimeout(()=>d.scrollIntoView({behavior:'smooth',block:'start'}),30);}}
  else window.scrollTo({top:0});
}
window.addEventListener('hashchange',route);

/* ---------- progress ---------- */
const SPSS_TRACK=[];
function answered(q){const v=S.hw[q.id];if(q.type==='multi')return Array.isArray(v)&&v.length>0;if(q.type==='single')return v!==undefined&&v!==null;return typeof v==='string'&&v.trim().length>0;}
function progress(){
  const v=CH.videos.filter(x=>S.videos[x.k]).length;const sp=SPSS_TRACK.filter(k=>S.spss[k]).length;
  const qz=CH.quiz.filter(q=>S.quiz[q.id]&&S.quiz[q.id].ok).length;const hwDone=CH.hw.questions.filter(answered).length;
  const done={learn:v===CH.videos.length,slides:!!S.slidesDone,spss:SPSS_TRACK.length>0&&sp===SPSS_TRACK.length,quiz:qz===CH.quiz.length,homework:hwDone===CH.hw.questions.length};
  const units=(v/CH.videos.length)+(S.slidesDone?1:0)+(SPSS_TRACK.length?sp/SPSS_TRACK.length:0)+(qz/CH.quiz.length)+(hwDone/CH.hw.questions.length);
  const p=Math.round(units/5*100);$('#meterFill').style.width=p+'%';$('#meterPct').textContent=p+'%';
  for(const k in done){const t=$(`.stage-tab[data-tab="${k}"]`);if(t)t.classList.toggle('done',done[k]);}
}

/* ---------- downloads ---------- */
const dlP=(window.claude&&window.claude.use)?window.claude.use('downloads').catch(()=>null):Promise.resolve(null);
async function download(path,name){
  if(CH.static){const a=document.createElement('a');a.href=path;a.download=name;document.body.appendChild(a);a.click();a.remove();return;}
  const dl=await dlP;if(!dl){toast('這個檢視無法下載檔案，請在 claude.ai 開啟本頁。');return;}
  try{let blob;if(/\.b64\.txt$/.test(path)){const txt=(await fetch(path).then(r=>{if(!r.ok)throw new Error(r.status);return r.text();})).trim();const bin=atob(txt);const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);blob=new Blob([u]);}else blob=await fetch(path).then(r=>{if(!r.ok)throw new Error(r.status);return r.blob();});
    const res=await dl.save({filename:name,data:blob});if(res&&res.status==='saved')toast('已儲存 '+name);}
  catch(e){const c=e&&e.code;if(c==='declined')return;if(c==='rate_limited'){toast('上一個下載確認還沒結束，稍後再試。');return;}toast('下載沒有完成，請再試一次。');}
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-dl]');if(b){e.preventDefault();download(b.dataset.dl,b.dataset.name);}});
const DLI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';

/* ---------- videos ---------- */
const secs=t=>{const [m,s]=t.split(':').map(Number);return m*60+s;};
function renderVideos(){
  $('#videos').innerHTML=CH.videos.map(v=>`<article class="video">
   <a class="thumb" href="https://youtu.be/${v.id}" target="_blank" rel="noopener" data-video="${v.k}" aria-label="在 YouTube 觀看 ${esc(v.t)}">
     <img src="thumbs/${v.k}.jpg" alt="" loading="lazy">${S.videos[v.k]?'<span class="seen">已觀看</span>':''}
     <span class="play"><svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z"/></svg></span></a>
   <div class="body"><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p>
   <ul class="chips">${v.c.map(([t,l])=>`<li><a href="https://youtu.be/${v.id}?t=${secs(t)}" target="_blank" rel="noopener" data-video="${v.k}"><span class="t">${t}</span><span>${esc(l)}</span></a></li>`).join('')}</ul></div></article>`).join('');
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-video]');if(a){S.videos[a.dataset.video]=true;save();setTimeout(()=>{renderVideos();progress();},400);}});

/* ---------- concepts ---------- */
function renderConcepts(){
  $('#concepts').innerHTML=CH.concepts.map((c,i)=>{const w=CH.widgets[i];return `<article class="concept${w?'':' solo'}"><div class="concept-text"><span class="num">概念 ${i+1}</span><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>${c.tip?`<p class="tip">${esc(c.tip)}</p>`:''}</div>${w?`<div class="widget" id="w${i}"></div>`:''}</article>`;}).join('');
  $('#exampleText').textContent=CH.example;
  CH.widgets.forEach((w,i)=>{if(w&&W[w]){try{W[w]($('#w'+i),CH);}catch(err){$('#w'+i).innerHTML='<p class="note">這個互動工具載入失敗。</p>';console.error(err);}}});
}

/* ---------- slides ---------- */
const NSL=CH.slidesN;let slide=1;
function renderSlides(){
  $('#slidesNote').textContent=CH.slidesNote+' 用左右鍵或下方縮圖翻頁；翻到最後一張即完成本步驟。';
  $('#slideStrip').innerHTML=Array.from({length:NSL},(_,i)=>`<button data-s="${i+1}" aria-label="第 ${i+1} 張"><img src="slides/s-${pad2(i+1)}.jpg" alt="" loading="lazy"></button>`).join('');
  $('#slideDl').innerHTML=`<button class="btn" data-dl="${CH.pptxPath||'slides/deck.pptx.b64.txt'}" data-name="${esc(CH.deckName)}.pptx">${DLI}下載 PPTX 原檔</button><button class="btn" data-dl="slides/deck.pdf" data-name="${esc(CH.deckName)}.pdf">${DLI}下載 PDF</button>`;
  $('#slideStrip').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(b)goSlide(+b.dataset.s);});
  $('#slidePrev').addEventListener('click',()=>goSlide(slide-1));$('#slideNext').addEventListener('click',()=>goSlide(slide+1));
  document.addEventListener('keydown',e=>{if($('[data-stage="slides"]').hidden)return;if(e.target.closest('input,textarea'))return;if(e.key==='ArrowRight')goSlide(slide+1);if(e.key==='ArrowLeft')goSlide(slide-1);});
  goSlide(1,true);
}
function goSlide(n,silent){
  slide=Math.max(1,Math.min(NSL,n));$('#slideImg').src='slides/s-'+pad2(slide)+'.jpg';$('#slideImg').alt='第 '+CH.id+' 章投影片第 '+slide+' 張';
  $('#slideCount').textContent=slide+' / '+NSL;$('#slidePrev').disabled=slide===1;$('#slideNext').disabled=slide===NSL;
  $$('#slideStrip button').forEach(b=>b.setAttribute('aria-current',+b.dataset.s===slide?'true':'false'));
  const cur=$(`#slideStrip [data-s="${slide}"]`);if(cur&&!silent)cur.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
  if(slide===NSL&&!S.slidesDone){S.slidesDone=true;toast('投影片看完了，步驟 2 完成。');}
  save();progress();
}

/* ---------- files ---------- */
function renderFiles(){
  if(!CH.files.length){$('#filesPanel').hidden=true;return;}
  $('#zipBtn').innerHTML=CH.zip?`<button class="btn primary" data-dl="${esc(CH.zip)}" data-name="高等體育統計_CH${pad2(CH.id)}_資料.zip">${DLI}下載全部（ZIP，${CH.files.length} 個檔）</button>`:'';
  $('#filesNote').textContent=CH.files.every(f=>f.path)?'每個檔案都可以單獨下載，也可以一次下載全部（ZIP）。下載後在 SPSS 選「檔案 → 開啟 → 資料」開啟 .sav，不需要匯入或執行語法。':CH.zip?'CSV 可單獨下載；其他格式（SAV、SPS、XLS、XLSX）包含在 ZIP 內。SPS 語法裡的路徑要改成自己的下載位置。':'下載後在 SPSS 開啟。';
  $('#files').innerHTML=CH.files.map(f=>`<div class="file"><span class="ext">${esc(f.ext)}</span><div><strong>${esc(f.label)}</strong><small>${esc(f.file)}</small>${f.path?`<button data-dl="${esc(f.path)}" data-name="${esc(f.file)}">下載 ${esc(f.ext)}</button>`:'<span class="inzip">在 ZIP 內</span>'}</div></div>`).join('');
}

/* ---------- guide ---------- */
function inline(t){return esc(t).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');}
function slideRef(nums,note){return `<div class="slideref"><span class="label">講義對照 · 第 ${nums.join('、')} 張</span><p>${esc(note)}</p><div class="pics">${nums.map(n=>`<figure><img src="slides/s-${pad2(n)}.jpg" alt="講義第 ${n} 張" loading="lazy" data-zoom><figcaption><span>講義第 ${n} 張</span><a href="#slides" data-goslide="${n}">在投影片檢視器開啟</a></figcaption></figure>`).join('')}</div></div>`;}
function blocks(text){
  const lines=text.split('\n');let h='';let list=null;const close=()=>{if(list){h+=`</${list}>`;list=null;}};
  for(let i=0;i<lines.length;i++){
    const line=lines[i].trim();if(!line){close();continue;}
    if(line.startsWith('```')){close();const code=[];while(++i<lines.length&&!lines[i].trim().startsWith('```'))code.push(lines[i]);h+=`<div class="code"><button type="button" data-copy>複製</button><pre>${esc(code.join('\n'))}</pre></div>`;continue;}
    const shot=/!\[([^\]]*)\]\(截圖\/([^)]+)\)/.exec(line);
    if(shot){close();const file=shot[2];const src='spss/'+file;const ch=Number((/^ch(\d+)/.exec(file)||[])[1]);
      const rest=line.replace(shot[0],'').replace(/^[-*]\s*/,'').trim();const restC=rest.replace(/^（|）$/g,'');
      const alt=/\.(png|bmp|jpg)$/i.test(shot[1])||/^SPSS ch/i.test(shot[1])?(restC||'SPSS 操作畫面'):shot[1];
      h+=`<figure>${ch&&ch!==CH.id?`<p class="borrowed">共用介面示意：本圖來自第 ${ch} 章。請依本節文字選擇資料與變數，勿照填背景欄位。</p>`:''}<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" data-zoom><figcaption>${inline(alt)}${restC&&alt!==restC?'　'+inline(restC):''}</figcaption></figure>`;continue;}
    const hd=/^(#{1,6}) (.*)/.exec(line);
    if(hd){close();const lv=hd[1].length;h+=lv<=3?`<h3>${inline(hd[2])}</h3>`:`<h4>${inline(hd[2])}</h4>`;const m=(CH.stepRefs||[]).find(r=>hd[2].startsWith(r[0]));if(m)h+=slideRef(m[1],m[2]);continue;}
    if(line.startsWith('|')){close();const rows=[line];while(i+1<lines.length&&lines[i+1].trim().startsWith('|'))rows.push(lines[++i].trim());const cells=rows.filter(r=>!/^\|[\s:|-]+\|$/.test(r)).map(r=>r.replace(/^\||\|$/g,'').split('|'));h+=`<div class="tbl-wrap"><table>${cells.map((r,j)=>`<tr>${r.map(c=>j===0?`<th>${inline(c.trim())}</th>`:`<td>${inline(c.trim())}</td>`).join('')}</tr>`).join('')}</table></div>`;continue;}
    const ol=/^\d+\.\s+(.*)/.exec(line),ul=/^[-*]\s+(.*)/.exec(line);
    if(ol){if(list!=='ol'){close();h+='<ol>';list='ol';}h+=`<li>${inline(ol[1])}</li>`;continue;}
    if(ul){if(list!=='ul'){close();h+='<ul>';list='ul';}h+=`<li>${inline(ul[1])}</li>`;continue;}
    close();h+=`<p>${inline(line)}</p>`;
  }
  close();return h;
}
function renderGuide(){
  $('#h-spss').textContent=isSpss?'SPSS 操作指南':'課堂概念與計算核對';
  $('#spssLede').textContent=isSpss?'先下載資料，再依各節步驟在自己的 SPSS 操作，把輸出和截圖對照。每節做完按「完成這一節」，進度會記在這台裝置的瀏覽器。':'本章講義沒有指定 SPSS 操作。下面依投影片頁序整理計算核對與講義更正，每節都附上對應的講義頁。讀完一節按「完成這一節」。';
  const md=CH.guide;const parts=md.split(/^## /m);const intro=parts.shift().replace(/^# .*\n?/,'').trim();
  const secsArr=parts.map(p=>{const nl=p.indexOf('\n');return{title:(nl<0?p:p.slice(0,nl)).trim(),body:nl<0?'':p.slice(nl+1)};});
  const ck='<svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-10"/></svg>';
  const chev='<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
  let html=intro?`<p class="prose" style="margin:0 0 14px">${inline(intro)}</p>`:'';
  secsArr.forEach((s,k)=>{const id='spss-'+(k+1);const track=!/核對狀態/.test(s.title);if(track)SPSS_TRACK.push(id);
    const sr=(CH.secRefs||[]).find(x=>s.title.startsWith(x[0]));
    html+=`<details class="sec" id="${id}"${k===0?' open':''}><summary><span class="mono" style="color:var(--muted);font-size:13px">${pad2(k+1)}</span><span>${inline(s.title)}</span><span class="badge" data-badge="${id}"></span>${chev}</summary><div class="sec-body">${sr?slideRef(sr[1],sr[2]):''}${blocks(s.body)}${track?`<div class="sec-done"><button class="btn" data-done="${id}"></button></div>`:''}</div></details>`;});
  $('#guide').innerHTML=html;
  $('#toc').innerHTML='<span class="label" style="padding:0 8px 6px">本頁章節</span>'+secsArr.map((s,k)=>`<a href="#spss-${k+1}" data-toc="spss-${k+1}">${ck}<span>${inline(s.title)}</span></a>`).join('');
  refreshSpss();
}
function refreshSpss(){
  SPSS_TRACK.forEach(id=>{const d=!!S.spss[id];const b=$(`[data-done="${id}"]`);if(b){b.innerHTML=d?'已完成 · 取消標記':'完成這一節';b.classList.toggle('primary',!d);}
    const bd=$(`[data-badge="${id}"]`);if(bd)bd.textContent=d?'已完成':'';const t=$(`[data-toc="${id}"]`);if(t)t.classList.toggle('done',d);});
  $$('#toc a .ck').forEach(c=>c.style.visibility=c.parentElement.classList.contains('done')?'visible':'hidden');
}
document.addEventListener('click',e=>{
  const d=e.target.closest('[data-done]');if(d){const id=d.dataset.done;S.spss[id]=!S.spss[id];save();refreshSpss();progress();if(S.spss[id]){const sec=document.getElementById(id);if(sec)sec.open=false;}return;}
  const c=e.target.closest('[data-copy]');if(c){const txt=c.nextElementSibling.textContent;const ok=()=>{c.textContent='已複製';setTimeout(()=>c.textContent='複製',1500);};
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok).catch(()=>selectText(c.nextElementSibling));}else selectText(c.nextElementSibling);return;}
  const z=e.target.closest('[data-zoom]');if(z){openLight(z.src,z.alt);return;}
  const gs=e.target.closest('[data-goslide]');if(gs){const n=+gs.dataset.goslide;setTimeout(()=>goSlide(n),60);return;}
  const t=e.target.closest('[data-toc]');if(t){const sec=document.getElementById(t.dataset.toc);if(sec)sec.open=true;}
});
function selectText(n){const r=document.createRange();r.selectNodeContents(n);const s=getSelection();s.removeAllRanges();s.addRange(r);toast('已選取，請按 Ctrl+C 複製');}
function openLight(src,alt){const o=document.createElement('div');o.className='lightbox';o.setAttribute('role','dialog');o.setAttribute('aria-label','放大檢視');
  o.innerHTML=`<button type="button">關閉</button><div><img src="${esc(src)}" alt="${esc(alt)}"><p>${esc(alt)}</p></div>`;
  const close=()=>{o.remove();document.removeEventListener('keydown',k);};const k=e=>{if(e.key==='Escape')close();};
  o.addEventListener('click',e=>{if(e.target===o||e.target.tagName==='BUTTON')close();});document.addEventListener('keydown',k);document.body.appendChild(o);o.querySelector('button').focus();}

/* ---------- quiz ---------- */
const QUIZ=CH.quiz;
function renderQuiz(){
  $('#quizTotal').textContent='/ '+QUIZ.length;
  $('#quiz').innerHTML=QUIZ.map((q,k)=>{const st=S.quiz[q.id]||{};
    const body=q.num!==undefined?`<div class="numrow"><input id="in-${q.id}" inputmode="decimal" aria-label="${esc(q.p)}" value="${st.v!==undefined?esc(st.v):''}"><button class="btn" data-qnum="${q.id}">檢查</button>${q.unit?`<span class="note">單位：${esc(q.unit)}</span>`:''}</div>`:
      `<div class="opts">${q.o.map((o,i)=>`<label class="opt${st.v===i?(i===q.a?' right':' wrong'):''}"><input type="radio" name="${q.id}" value="${i}"${st.v===i?' checked':''}><span>${esc(o)}</span></label>`).join('')}</div>`;
    return `<fieldset class="q" id="card-${q.id}"><legend><span class="qn">${pad2(k+1)}</span><span>${esc(q.p)}</span></legend>${body}<div data-fb="${q.id}">${fb(q,st)}</div></fieldset>`;}).join('');
  updQuiz();
}
function fb(q,st){if(st.v===undefined||st.v==='')return '';return st.ok?`<p class="fb ok"><b>答對了</b>${esc(q.e)}</p>`:`<p class="fb no"><b>再想想</b>${q.num!==undefined?esc(q.hint||'再算一次。'):'這個選項不對，換一個試試。'}</p>`;}
function setQ(q,v,ok){S.quiz[q.id]={v,ok};save();const card=$('#card-'+q.id);$(`[data-fb="${q.id}"]`,card).innerHTML=fb(q,S.quiz[q.id]);
  $$('.opt',card).forEach((l,i)=>{l.classList.remove('right','wrong');if(i===v)l.classList.add(ok?'right':'wrong');});updQuiz();progress();}
function updQuiz(){const n=QUIZ.filter(q=>S.quiz[q.id]&&S.quiz[q.id].ok).length;$('#quizScore').textContent=n;$('#quizStatus').textContent=n===QUIZ.length?'全部答對，步驟 4 完成。':`還有 ${QUIZ.length-n} 題沒答對。全部答對即完成本步驟。`;}
document.addEventListener('change',e=>{const r=e.target;if(r.type==='radio'){const q=QUIZ.find(x=>x.id===r.name);if(q){const v=+r.value;setQ(q,v,v===q.a);}}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-qnum]');if(!b)return;const q=QUIZ.find(x=>x.id===b.dataset.qnum);const raw=$('#in-'+q.id).value.trim().replace(/,/g,'').replace(/%$/,'');const v=Number(raw);
  if(raw===''||!Number.isFinite(v)){toast('請輸入數字');return;}setQ(q,raw,Math.abs(v-q.num)<=q.tol);});

/* ---------- think ---------- */
$('#thinkP').textContent=CH.think.p;
$('#thinkRef').innerHTML=`<h4>參考答案</h4>${CH.think.answer.map(p=>`<p>${esc(p)}</p>`).join('')}<h4 style="margin-top:10px">自我檢核</h4>${CH.think.check.map(p=>`<p>${esc(p)}</p>`).join('')}`;

/* ---------- homework ---------- */
const HW=CH.hw.questions;
$('#h-hw').textContent='章節作業：'+CH.hw.title;$('#hwSource').textContent='步驟 5 · '+CH.hw.source;
function renderHW(){
  $('#hw').innerHTML=HW.map((q,k)=>{const v=S.hw[q.id];let body='';
    if(q.type==='multi')body=`<div class="opts">${q.o.map((o,i)=>`<label class="opt"><input type="checkbox" data-hwm="${q.id}" value="${i}"${Array.isArray(v)&&v.includes(i)?' checked':''}><span>${esc(o)}</span></label>`).join('')}</div><div><button class="btn" data-hwcheck="${q.id}">核對答案</button></div>`;
    if(q.type==='single')body=`<div class="opts">${q.o.map((o,i)=>`<label class="opt"><input type="radio" name="hw-${q.id}" data-hws="${q.id}" value="${i}"${v===i?' checked':''}><span>${esc(o)}</span></label>`).join('')}</div>`;
    if(q.type==='num')body=`<div class="numrow"><input id="hw-${q.id}" inputmode="decimal" aria-label="${esc(q.p)}" value="${typeof v==='string'?esc(v):''}"><button class="btn" data-hwcheck="${q.id}">核對答案</button></div>${q.hint?`<span class="note">${esc(q.hint)}</span>`:''}`;
    if(q.type==='long')body=`<textarea data-hwt="${q.id}" aria-label="${esc(q.p)}" placeholder="寫下分析步驟、結果與解釋…">${typeof v==='string'?esc(v):''}</textarea><div><button class="btn" data-hwref="${q.id}" aria-expanded="false">對照參考結果</button></div><div class="ref" data-ref="${q.id}" hidden>${q.ref||''}</div>`;
    return `<fieldset class="q" id="hwcard-${q.id}"><legend><span class="qn">${pad2(k+1)}</span><span>${esc(q.p)}</span></legend>${body}<div data-hwfb="${q.id}"></div></fieldset>`;}).join('');
  HW.forEach(q=>{if((q.type==='single'&&S.hw[q.id]!==undefined)||(S.hwChecked&&S.hwChecked[q.id]&&answered(q)))checkHW(q,true);});updHW();
}
function checkHW(q,quiet){const box=$(`[data-hwfb="${q.id}"]`);const card=$('#hwcard-'+q.id);let ok=false;
  if(q.type==='multi'){const v=(S.hw[q.id]||[]).slice().sort();const a=q.a.slice().sort();ok=v.length===a.length&&v.every((x,i)=>x===a[i]);
    $$('.opt',card).forEach((l,i)=>{l.classList.remove('right','wrong');const sel=v.includes(i),should=a.includes(i);if(sel&&should)l.classList.add('right');else if(sel!==should)l.classList.add('wrong');});}
  if(q.type==='single'){const v=S.hw[q.id];ok=v===q.a;$$('.opt',card).forEach((l,i)=>{l.classList.remove('right','wrong');if(i===v)l.classList.add(ok?'right':'wrong');});}
  if(q.type==='num'){const v=Number(String(S.hw[q.id]).replace(/,/g,'').replace(/%$/,''));ok=Number.isFinite(v)&&Math.abs(v-q.num)<=q.tol;}
  box.innerHTML=ok?`<p class="fb ok"><b>正確</b>${esc(q.e||'')}</p>`:`<p class="fb no"><b>還不對</b>${q.type==='multi'?'標紅的選項要再想想：有該選沒選的，也有不該選的。':q.type==='num'?esc(q.hint||'再檢查一次計算與分母。'):'再想想題目問的是哪一種情況。'}</p>`;
  if(!quiet){S.hwChecked=S.hwChecked||{};S.hwChecked[q.id]=true;save();}
}
function updHW(){const n=HW.filter(answered).length;$('#hwStatus').textContent=n===HW.length?`${n} / ${HW.length} 題已作答，步驟 5 完成。`:`${n} / ${HW.length} 題已作答`;progress();}
let hwTimer;
document.addEventListener('input',e=>{const t=e.target;
  if(t.dataset.hwt){S.hw[t.dataset.hwt]=t.value;clearTimeout(hwTimer);hwTimer=setTimeout(()=>{save();updHW();},400);}
  if(t.id&&t.id.startsWith('hw-')&&t.tagName==='INPUT'&&t.type!=='radio'){S.hw[t.id.slice(3)]=t.value;save();updHW();}
  if(t.id==='thinkText'){S.think=t.value;save();}
});
document.addEventListener('change',e=>{const t=e.target;
  if(t.dataset.hwm){const id=t.dataset.hwm;S.hw[id]=$$(`[data-hwm="${id}"]`).filter(x=>x.checked).map(x=>+x.value);save();updHW();}
  if(t.dataset.hws){const q=HW.find(x=>x.id===t.dataset.hws);S.hw[q.id]=+t.value;save();checkHW(q);updHW();}
});
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-hwcheck]');if(c){const q=HW.find(x=>x.id===c.dataset.hwcheck);if(!answered(q)){toast('先作答再核對');return;}checkHW(q);return;}
  const r=e.target.closest('[data-hwref]');if(r){const box=$(`[data-ref="${r.dataset.hwref}"]`);box.hidden=!box.hidden;r.setAttribute('aria-expanded',String(!box.hidden));r.textContent=box.hidden?'對照參考結果':'收起對照';return;}
  if(e.target.id==='hwClearBtn'){$('#hwClear').innerHTML='<span>確定清除這些作答？</span><button class="btn" id="hwYes">清除</button><button class="btn" id="hwNo">取消</button>';return;}
  if(e.target.id==='hwNo'){$('#hwClear').innerHTML='<button class="btn" id="hwClearBtn">清除我的作答</button>';return;}
  if(e.target.id==='hwYes'){S.hw={};S.hwChecked={};save();renderHW();$('#hwClear').innerHTML='<button class="btn" id="hwClearBtn">清除我的作答</button>';toast('已清除作答');return;}
  if(e.target.id==='thinkBtn'){const box=$('#thinkRef');box.hidden=!box.hidden;e.target.setAttribute('aria-expanded',String(!box.hidden));e.target.textContent=box.hidden?'查看參考答案與自我檢核':'收起參考答案';}
});

/* ---------- boot ---------- */
renderVideos();renderConcepts();renderSlides();renderFiles();renderGuide();renderQuiz();renderHW();
$('#thinkText').value=S.think||'';
route();progress();
