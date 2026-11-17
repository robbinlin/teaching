"""首頁：高爾頓板動畫、學習流程、六章目錄與本機進度。由 build_site.py 在全站建置時呼叫。"""
import json, re
from pathlib import Path

here = Path(__file__).resolve().parent
G, G0 = here / 'gen2', here / 'gen'
rd = lambda p: Path(p).read_text(encoding='utf-8')
esc = lambda s: str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

CSS = r'''
#hero{position:absolute;inset:0;width:100%;height:100%;z-index:-1;cursor:pointer;touch-action:manipulation}
.live{flex-wrap:wrap;gap:14px 26px}
.intro{--ball:#EDB23F;--curve:#F08BB3;--peg:rgba(226,232,247,.38)}
.intro::after{background:radial-gradient(120% 90% at 78% 40%,rgba(237,178,63,.10),transparent 60%),radial-gradient(80% 60% at 10% 100%,rgba(214,69,127,.10),transparent 60%)}
.intro h1 .t2{background:linear-gradient(100deg,var(--band-ink) 0%,var(--band-ink) 55%,var(--ball) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.intro .btn.primary{background:var(--ball);border-color:var(--ball);color:#1B2947}
.intro .btn.primary:hover{box-shadow:0 8px 24px -8px rgba(237,178,63,.6)}
.live div:nth-child(2) b{color:var(--ball)}
.flow{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;counter-reset:f}
.flow li{counter-increment:f;border-top:1px solid rgba(255,255,255,.18);padding-top:10px;font-size:14px;color:var(--band-muted)}
.flow li::before{content:"0" counter(f);display:block;font-family:var(--mono);font-size:12px;color:var(--mustard);margin-bottom:2px}
.flow b{display:block;color:var(--band-ink);font-size:15px;font-weight:700}
.home-head{display:flex;align-items:end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}
.home-head h2{font-family:var(--display);font-size:clamp(24px,3.2vw,32px);line-height:1.25}
.home-head p{margin:0;color:var(--muted);font-size:14px;max-width:52ch}
.chlist{display:grid;gap:16px;padding-bottom:48px}
.chrow{display:grid;grid-template-columns:minmax(0,260px) minmax(0,1fr) auto;gap:22px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:16px;text-decoration:none;color:var(--ink)}
.chrow:hover{border-color:var(--accent);box-shadow:0 10px 30px -18px rgba(59,90,148,.5)}
.chrow .pic{position:relative;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:var(--soft)}
.chrow .pic img{width:100%;height:100%;object-fit:cover;display:block}
.chrow .pic span{position:absolute;left:8px;top:8px;font-family:var(--mono);font-size:12px;background:#22355F;color:#fff;border-radius:6px;padding:2px 8px}
.chrow h3{font-family:var(--display);font-size:22px;line-height:1.3;margin:2px 0 6px}
.chrow p{margin:0 0 10px;font-size:14px;color:var(--muted)}
.chrow ol{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px 18px;font-size:13px}
.chrow ol li{display:flex;gap:8px;align-items:baseline;min-width:0}
.chrow ol li span{font-family:var(--mono);font-size:11px;color:var(--accent);flex:0 0 auto}
.chrow .go{display:grid;gap:8px;justify-items:end;min-width:112px}
.chrow .pct{font-family:var(--mono);font-size:26px;font-weight:500;font-variant-numeric:tabular-nums;line-height:1}
.chrow .pct small{font-size:12px;color:var(--muted);margin-left:2px}
.chrow .bar{width:112px;height:6px;border-radius:3px;background:var(--soft);overflow:hidden}
.chrow .bar i{display:block;height:100%;width:0;background:var(--accent);transition:width .4s ease}
.chrow.done .bar i{background:var(--ok)}
.chrow .cta{font-size:13px;color:var(--accent);display:inline-flex;align-items:center;gap:6px;font-weight:500}
.chrow .cta svg{width:14px;height:14px}
.chyt,.allyt{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--muted);text-decoration:none}
.chyt svg,.allyt svg{width:16px;height:16px;color:var(--amber);flex:0 0 auto}
.chyt:hover,.allyt:hover{color:var(--accent);text-decoration:underline}
.chyt{margin:-8px 0 6px 18px;width:max-content}
.allyt{display:flex;margin-top:6px}
.home-note{font-size:13px;color:var(--muted);margin:0 0 40px}
@media (max-width:860px){
 .flow{grid-template-columns:1fr 1fr}
 .chrow{grid-template-columns:1fr;gap:12px}
 .chrow ol{grid-template-columns:1fr}
 .chrow .go{grid-template-columns:auto 1fr auto;align-items:center;justify-items:start;min-width:0}
 .chrow .bar{width:100%}
}
'''

JS = r'''
(()=>{const M=JSON.parse(document.getElementById('homeData').textContent);
M.forEach(c=>{let S=null;try{S=JSON.parse(localStorage.getItem('mstat-ch'+c.id+'-v1')||'null');}catch(e){}
  const row=document.querySelector('[data-ch="'+c.id+'"]');if(!row)return;let p=0;
  if(S){const v=Object.values(S.videos||{}).filter(Boolean).length;const sp=Object.values(S.spss||{}).filter(Boolean).length;
    const qz=Object.values(S.quiz||{}).filter(x=>x&&x.ok).length;
    const hw=Object.values(S.hw||{}).filter(x=>Array.isArray(x)?x.length:(typeof x==='number'||(typeof x==='string'&&x.trim()))).length;
    const u=Math.min(1,v/c.nV)+(S.slidesDone?1:0)+Math.min(1,sp/c.nSec)+Math.min(1,qz/c.nQ)+Math.min(1,hw/c.nHW);p=Math.round(u/5*100);}
  row.querySelector('.pct').firstChild.textContent=p;row.querySelector('.bar i').style.width=p+'%';row.classList.toggle('done',p>=100);
  row.querySelector('.cta span').textContent=p>=100?'再看一次':p>0?'繼續學習':'開始這一章';});
})();
'''


def build(out):
    PL = json.loads(rd(here / 'youtube_playlists.json'))
    YT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>'
    chs = []
    import build_site
    for n in build_site.CHS:
        d = here / ('ch%d' % n)
        c = json.loads(rd(d / 'content.json'))
        guide = rd(d / 'guide.md')
        chs.append({'id': n, 'title': c['title'], 'eyebrow': c['eyebrow'], 'lede': c['lede'], 'eps': [re.sub(r'^EP\d+\s*', '', v['t']) for v in c['videos']],
                    'nV': len(c['videos']), 'nSec': len(re.findall(r'^## ', guide, re.M)), 'nQ': len(c['quiz']), 'nHW': len(c['hw']['questions']),
                    'nW': sum(1 for w in c['widgets'] if w)})
    nW = sum(c['nW'] for c in chs)
    NCHS, NEP, NQ = len(chs), sum(c['nV'] for c in chs), sum(c['nQ'] for c in chs)
    intro = ('<section class="intro" id="top" aria-labelledby="intro-title">\n <canvas id="hero" aria-hidden="true"></canvas>\n'
             ' <div class="wrap top intro-top"><div class="brand"><span class="brand-mark">Measurement &amp; Statistics</span><span><strong>體育測驗與統計</strong><small>國立體育大學・林彥光 老師</small></span></div><a class="top-link" href="#chapters">%d 章目錄</a>' % NCHS + '</div>\n'
             ' <div class="wrap intro-body">\n  <div class="intro-text">\n'
             '   <span class="label rv" style="--d:0">大學部課程 · %d 章 · %d 集單線插畫短片</span>' % (NCHS, NEP) + '\n'
             '   <h1 id="intro-title" class="rv" style="--d:1"><span class="t1">體育</span><span class="t2">測驗與統計</span></h1>\n'
             '   <p class="sub rv" style="--d:2">一個成績到底算好還是不好？這門課從測驗、測量、評價的差別談起，一路走到信度與效度。每章四集兩分鐘短片，配上可以動手玩的統計工具、講義、動手算的步驟，還有即時回饋的檢測與作業。</p>\n'
             '   <div class="cta rv" style="--d:3"><a class="btn primary" href="ch1/index.html">從第 1 章開始 ' + ARROW + '</a><a class="btn ghost" href="#chapters">瀏覽 %d 章</a>' % NCHS + '</div>\n'
             '   <div class="live rv" style="--d:4" aria-live="off">\n    <div><span>已測人數 n</span><b id="gN">0</b></div><div><span>平均 x̄（秒）</span><b id="gM">—</b></div><div><span>標準差 s</span><b id="gS">—</b></div><div><span>達標比例</span><b id="gP">—</b></div>\n   </div>\n'
             '   <p class="cap rv" style="--d:5">每位跑者衝過終點，碼錶量到一個秒數，這是測量。秒數一顆顆堆起來，就看得出平均數、標準差和分配的形狀，這是統計。再畫一條 12.5 秒的標準線，才知道誰達標，這是評價。秒數是電腦模擬的示意資料。<span class="hint">點一下畫面，再派 20 位跑者上場。</span></p>\n'
             '  </div>\n </div>\n <a class="scroll-cue" href="#chapters" aria-label="往下看章節目錄"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg></a>\n</section>\n')
    flow = ('<div class="band"><div class="wrap flowband"><ol class="flow">'
            '<li><b>看一集短片</b>兩分鐘，一個情境帶出一個概念</li><li><b>玩一個工具</b>拖一拖、改一改，驗證影片的說法</li>'
            '<li><b>翻講義</b>老師上課用的投影片，可下載</li><li><b>動手算</b>用講義的資料自己算一遍</li><li><b>檢測與作業</b>選完立刻知道對錯和理由</li></ol></div></div>\n')
    rows = ''
    for c in chs:
        rows += ('<a class="chrow" href="ch%d/index.html" data-ch="%d"><div class="pic"><img src="ch%d/thumbs/ep1.jpg" alt="" loading="lazy"><span>CH %02d</span></div>'
                 '<div><span class="label">%s</span><h3>%s</h3><p>%s</p><ol>%s</ol></div>'
                 '<div class="go"><div class="pct">0<small>%%</small></div><div class="bar"><i></i></div><span class="cta"><span>開始這一章</span>%s</span></div></a>\n'
                 '<a class="chyt" href="https://www.youtube.com/playlist?list=%s" target="_blank" rel="noopener">%s第 %d 章播放清單（4 集）</a>\n'
                 % (c['id'], c['id'], c['id'], c['id'], esc(c['eyebrow']), esc(c['title']), esc(c['lede']),
                    ''.join('<li><span>EP%d</span>%s</li>' % (i + 1, esc(t)) for i, t in enumerate(c['eps'])), ARROW, PL[str(c['id'])], YT, c['id']))
    main = ('<main class="wrap" id="chapters" style="padding-top:36px"><div class="home-head"><div><span class="label">課程內容</span><h2>%d 章目錄</h2></div>'
            '<p>全站共 %d 集短片、%d 個互動工具、%d 題自我檢測。每章約需 40 到 60 分鐘，可以分次完成。<a class="allyt" href="https://www.youtube.com/playlist?list=%s" target="_blank" rel="noopener">%s在 YouTube 連續播放全部 %d 集</a></p></div>\n<div class="chlist">\n%s</div>\n'
            '<p class="home-note">進度與作答只保存在你目前使用的瀏覽器，換一台裝置或清除瀏覽資料後會重新計算。</p></main>\n'
            '<footer><div class="wrap">體育測驗與統計・國立體育大學・林彥光 老師。短片與網站內容依課堂講義製作，數值都由講義資料重新計算核對。</div></footer>\n' % (NCHS, NEP, nW, NQ, PL['all'], YT, NEP, rows))
    css = rd(G / 'base.css') + rd(G / 'extra.css') + rd(G / 'theme.css') + rd(G0 / 'intro.css') + CSS
    ijs = rd(G / 'hero.js')
    meta = json.dumps([{k: c[k] for k in ('id', 'nV', 'nSec', 'nQ', 'nHW')} for c in chs])
    html = ('<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<title>體育測驗與統計</title>\n<meta name="description" content="國立體育大學「體育測驗與統計」自學網站：十二章、48 集短片、互動統計工具、講義、檢測與作業。">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap">\n'
            '<style>\nbody{margin:0}img{max-width:100%}[hidden]{display:none!important}\n' + css + '</style></head>\n<body>\n' + intro + flow + main +
            '<script type="application/json" id="homeData">' + meta + '</script>\n<script>' + ijs + JS + '</script>\n</body></html>\n')
    (out / 'index.html').write_text(html, encoding='utf-8', newline='\n')
    print('首頁建置完成：%d 個互動工具' % nW)
