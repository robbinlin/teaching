"""體育測驗與統計 課程網站建置。
  python -X utf8 build_site.py <輸出資料夾> [章號 ...] [--no-video]
不給章號＝六章全部，並產生首頁。每章來源在 chN/：
  content.json  guide.md  widgets.js（選用）  data/manifest.json（選用）  img/（選用）
  slides/（s-NN.jpg、deck.pdf、deck.pptx）  thumbs/  episodes.json     ← 由 prep.py 產生
"""
import json, re, shutil, sys, zipfile
from pathlib import Path

here = Path(__file__).resolve().parent
G = here / 'gen2'
ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13]
CHS = [n for n in ALL if (here / ('ch%d' % n) / 'content.json').exists()]
VIDEO_DIR = Path(r'F:\Dropbox\claude-體育測驗與統計\動畫短片\成品_單線插畫風')
DECK = {1: '(一)體育測驗與統計概念', 2: '(二)測驗與評量的應用技術', 3: '(三)描述統計與常態分布', 4: '(四)相關和預測', 5: '(五)推論統計', 6: '(六)信度與效度的理論',
        7: '(七)效標參照的信度與效度', 8: '(八)編製紙筆測驗與調查', 9: '(九)測量情意的行為', 10: '(十)評分', 12: '(十二)競技與健身運動的心理測量', 13: '(十三)課室評等'}
SIMP = '这为个们说对时会过还没关东车马门问间见长书页话语读写点线图样数据标应该计观测验术机实际现发开动种类显检变级从两么参与无专业习学号际项题选择错误确认论证质量预设范围单双历届组织统总结绩评价'.replace('量','').replace('范','')
SIMP = ''.join(ch for ch in SIMP if ch not in '錯誤確認')
rd = lambda p: Path(p).read_text(encoding='utf-8')


def rmtree(d):
    """Dropbox 同步時會暫時鎖住資料夾，重試幾次。"""
    import time
    for i in range(20):
        try:
            shutil.rmtree(d)
            return
        except FileNotFoundError:
            return
        except PermissionError:
            time.sleep(1.5)
    shutil.rmtree(d)


def check(ch, c, guide, wjs, files):
    """回傳問題清單（字串）。空清單＝通過。"""
    P = []
    d = here / ('ch%d' % ch)
    eps = json.loads(rd(d / 'episodes.json'))
    for k in ['id', 'title', 'eyebrow', 'lede', 'objectives', 'videos', 'concepts', 'widgets', 'epmap', 'example', 'slidesNote', 'stage3', 'quiz', 'think', 'hw']:
        if k not in c:
            P.append('content.json 缺欄位 ' + k)
    if P:
        return P
    if c['id'] != ch:
        P.append('id 應為 %d' % ch)
    if len(c['videos']) != 4:
        P.append('videos 應有 4 集')
    for v, e in zip(c['videos'], eps):
        if v.get('k') != e['k']:
            P.append('videos 的 k 應依序為 ep1..ep4')
        starts = {s['t'] for s in e['scenes']}
        for t, lab in v.get('c', []):
            if t not in starts:
                P.append('%s 時間碼 %s 不是場景起點（可用：%s）' % (v['k'], t, ' '.join(sorted(starts, key=lambda x: (len(x), x)))))
            if len(lab) > 14:
                P.append('%s 時間碼標籤超過 14 字：%s' % (v['k'], lab))
        if len(v.get('c', [])) < 4:
            P.append('%s 時間碼少於 4 個' % v['k'])
    nC = len(c['concepts'])
    if len(c['widgets']) != nC:
        P.append('widgets 長度（%d）要等於 concepts 長度（%d）' % (len(c['widgets']), nC))
    alljs = rd(G / 'widgets.js') + wjs
    for w in c['widgets']:
        if w and not re.search(r'\bW\.%s\s*=' % re.escape(w), alljs):
            P.append('找不到互動工具 W.' + w)
    flat = [i for seg in c['epmap'] for i in seg]
    if len(c['epmap']) != 4 or sorted(flat) != list(range(nC)):
        P.append('epmap 要有 4 段，且剛好涵蓋每個概念索引一次')
    for k in ['tab', 'title', 'lede']:
        if k not in c['stage3']:
            P.append('stage3 缺 ' + k)
    q = c['quiz']
    if len(q) != 8:
        P.append('quiz 應為 8 題，目前 %d' % len(q))
    ans = [x['a'] for x in q if 'o' in x]
    for x in q:
        if 'o' in x:
            if len(x['o']) != 4 or not (0 <= x['a'] < 4):
                P.append('quiz %s 需 4 個選項且 a 在 0..3' % x['id'])
        elif 'num' not in x or 'tol' not in x:
            P.append('quiz %s 需 o/a 或 num/tol' % x['id'])
        if not x.get('e'):
            P.append('quiz %s 缺解說 e' % x['id'])
    if ans and max(ans.count(i) for i in range(4)) > 3:
        P.append('quiz 正確選項位置太集中：%s' % ans)
    n_num = sum(1 for x in q if 'num' in x)
    if not 1 <= n_num <= 2:
        P.append('quiz 數值題應為 1–2 題，目前 %d' % n_num)
    for x in c['hw']['questions']:
        t = x.get('type')
        if t not in ('long', 'single', 'multi', 'num'):
            P.append('hw %s type 不合法' % x.get('id'))
        if t == 'long' and not x.get('ref'):
            P.append('hw %s 缺參考結果 ref' % x['id'])
        if t in ('single', 'multi', 'num') and not x.get('e'):
            P.append('hw %s 缺解說 e' % x['id'])
    heads2 = re.findall(r'^## (.+)$', guide, re.M)
    heads3 = re.findall(r'^#{3,4} (.+)$', guide, re.M)
    if len(heads2) < 3:
        P.append('guide.md 至少要有 3 個 ## 小節')
    nS = len(list((d / 'slides').glob('s-*.jpg')))
    for name, heads in (('stepRefs', heads3), ('secRefs', heads2)):
        for r in c.get(name, []):
            if sum(1 for h in heads if h.startswith(r[0])) != 1:
                P.append('%s 標題「%s」在 guide.md 中找不到或不唯一' % (name, r[0]))
            for n in r[1]:
                if not 1 <= n <= nS:
                    P.append('%s 講義頁碼 %s 超出範圍（共 %d 張）' % (name, n, nS))
    for x in files:
        if not (d / 'data' / x['file']).exists():
            P.append('資料檔不存在：' + x['file'])
    for img in re.findall(r'!\[[^\]]*\]\(img/([^)]+)\)', guide):
        if not (d / 'img' / img).exists():
            P.append('圖片不存在：img/' + img)
    blob = json.dumps(c, ensure_ascii=False) + guide
    bad = sorted({ch_ for ch_ in blob if ch_ in SIMP})
    if bad:
        P.append('疑似簡體字：' + ''.join(bad))
    if re.search(r'[\U0001F300-\U0001FAFF☀-➿]', blob):
        P.append('內容不可用 emoji')
    return P


def page(c, wjs):
    css = ''.join(rd(G / f) for f in ['base.css', 'extra.css', 'epflow.css', 'filelink.css', 'theme.css'])
    main = rd(G / 'main.js')
    fmap = {x['file']: x['path'] for x in c['files']}
    main = main.replace('/*__EPFLOW__*/', rd(G / 'epflow.js'))
    main = main.replace('/*__FILELINK__*/', ('window.FILEMAP=' + json.dumps(fmap, ensure_ascii=False) + ';' + rd(G / 'filelink.js')) if fmap else '')
    js = rd(G / 'prelude.js') + rd(G / 'widgets.js') + '\n/* ===== 本章互動工具 ===== */\n' + wjs + '\n' + main
    data = json.dumps(c, ensure_ascii=False).replace('</', '<\\/')
    head = ('<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<title>體育測驗與統計 第 %d 章 %s</title>\n' % (c['id'], c['title']) +
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap">\n')
    return (head + '<style>\nbody{margin:0}img{max-width:100%}[hidden]{display:none!important}\n' + css + '</style></head>\n<body>\n' + rd(G / 'body.html') +
            '\n<script type="application/json" id="chData">' + data + '</script>\n<script>(function(){\n' + js + '\n})();</script>\n</body></html>\n')


def load(ch):
    d = here / ('ch%d' % ch)
    c = json.loads(rd(d / 'content.json'))
    guide = rd(d / 'guide.md')
    wjs = rd(d / 'widgets.js') if (d / 'widgets.js').exists() else ''
    man = d / 'data' / 'manifest.json'
    files = json.loads(rd(man)) if man.exists() else []
    return d, c, guide, wjs, files


def build(ch, out, video=True):
    d, c, guide, wjs, files = load(ch)
    probs = check(ch, c, guide, wjs, files)
    for p in probs:
        print('  [ch%d 檢查] %s' % (ch, p))
    dst = out / ('ch%d' % ch)
    for sub in ['slides', 'thumbs', 'data', 'img']:
        if (dst / sub).exists():
            rmtree(dst / sub)
    (dst / 'slides').mkdir(parents=True)
    slides = sorted((d / 'slides').glob('s-*.jpg'))
    for f in slides + [d / 'slides' / 'deck.pdf', d / 'slides' / 'deck.pptx']:
        shutil.copyfile(f, dst / 'slides' / f.name)
    shutil.copytree(d / 'thumbs', dst / 'thumbs')
    if (d / 'img').exists():
        shutil.copytree(d / 'img', dst / 'img')
    fl = []
    if files:
        (dst / 'data').mkdir()
        with zipfile.ZipFile(dst / 'data' / 'all.zip', 'w', zipfile.ZIP_DEFLATED) as z:
            for x in files:
                shutil.copyfile(d / 'data' / x['file'], dst / 'data' / x['file'])
                z.write(d / 'data' / x['file'], 'CH%02d_資料/%s' % (ch, x['file']))
                fl.append({'ext': x.get('ext') or x['file'].rsplit('.', 1)[-1].upper(), 'label': x['label'], 'file': x['file'], 'path': 'data/' + x['file']})
    eps = json.loads(rd(d / 'episodes.json'))
    if all(v.get('id') for v in c['videos']):
        shutil.rmtree(dst / 'video', ignore_errors=True)
    else:
        (dst / 'video').mkdir(exist_ok=True)
    for v, e in zip(c['videos'], eps):
        if v.get('id'):
            continue
        v['src'] = 'video/%s.mp4' % v['k']
        if video:
            src = list((VIDEO_DIR / ('第%d章' % ch)).glob('第%d章_EP%s_*_720p.mp4' % (ch, v['k'][2:])))
            if len(src) == 1:
                t = dst / v['src']
                if not t.exists() or t.stat().st_size != src[0].stat().st_size:
                    shutil.copyfile(src[0], t)
            else:
                print('  [ch%d] 找不到影片 %s' % (ch, v['k']))
    nav = {str(i): '../ch%d/index.html' % i for i in CHS}
    nav['home'] = '../index.html'
    c.update({'slidesN': len(slides), 'deckName': DECK[ch], 'guide': guide, 'files': fl, 'zip': 'data/all.zip' if fl else None,
              'nav': nav, 'static': True, 'pptxPath': 'slides/deck.pptx', 'chs': CHS})
    (dst / 'index.html').write_text(page(c, wjs), encoding='utf-8', newline='\n')
    print('ch%d 建置完成：%d 張投影片、%d 個概念、%d 個工具、%d 個資料檔%s' % (ch, len(slides), len(c['concepts']), sum(1 for w in c['widgets'] if w), len(fl), '；檢查有 %d 個問題' % len(probs) if probs else '；檢查通過'))
    return not probs


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    out = Path(args[0]).resolve()
    out.mkdir(parents=True, exist_ok=True)
    (out / '.nojekyll').write_text('')
    chs = [int(a) for a in args[1:]] or CHS
    ok = all([build(ch, out, '--no-video' not in sys.argv) for ch in chs])
    if len(args) == 1 and (here / 'home.py').exists():
        import home
        home.build(out)
    sys.exit(0 if ok else 1)
