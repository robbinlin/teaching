"""Build the GitHub Pages version: /index.html + /chN/ for N=1..8, real download files, relative links."""
import json, os, re, shutil, base64, zipfile, sys
sys.path.insert(0, os.path.dirname(__file__))
import build as B
R = B.R
OUT = sys.argv[1]
NAV = {str(i): f'../ch{i}/' for i in range(1, 9)}
NAV['home'] = '../'
os.makedirs(OUT, exist_ok=True)
open(OUT + '/.nojekyll', 'w').close()

def epflow(html, boot, epmap=None):
    css = open(B.G + '/epflow.css', encoding='utf-8').read()
    js = open(B.G + '/epflow.js', encoding='utf-8').read()
    assert html.count(boot) == 1, boot
    html = html.replace(boot, boot + '\n' + ('window.EP_MAP=' + json.dumps(epmap) + ';' if epmap else '') + js, 1)
    return html.replace('</style>', css + '</style>', 1)
EPMAP = {2: [[0], [1, 2], [3]]}
SDK = ''.join('<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-%s-compat.js"></script>' % m for m in ('app', 'auth', 'firestore'))
BRIDGE = "window.__ADV={key:KEY,get state(){return S;},_cb:null};{const __s=save;save=function(){__s();try{window.__ADV._cb&&window.__ADV._cb();}catch(_){}};}\n"

def safe_name(fn, i):
    stem, ext = os.path.splitext(fn)
    s2 = re.sub(r'[^A-Za-z0-9._-]', '_', fn)
    return s2 if re.search(r'[A-Za-z0-9]', stem) and not re.search(r'[^\x00-\x7f]', fn) else f'file{i}{ext}'
def filelinks(html, fmap):
    if not fmap: return html
    js = 'window.FILEMAP=' + json.dumps(fmap, ensure_ascii=False) + ';' + open(B.G + '/filelink.js', encoding='utf-8').read()
    assert html.count('route();progress();') == 1
    html = html.replace('route();progress();', js + '\nroute();progress();', 1)
    return html.replace('</style>', open(B.G + '/filelink.css', encoding='utf-8').read() + '</style>', 1)

def withauth(html, chapter=True):
    if chapter:
        assert html.count('route();progress();') == 1
        html = html.replace('route();progress();', BRIDGE + 'route();progress();', 1)
    html = html.replace('</style>', open(B.G + '/auth.css', encoding='utf-8').read() + '</style>', 1)
    tail = SDK + '<script>' + open(B.G + '/auth.js', encoding='utf-8').read() + '</script>\n'
    i = html.rfind('</html>')
    return html[:i] + tail + html[i:] if i >= 0 else html + tail

BOOT = 'renderVideos();renderConcepts();renderSlides();renderFiles();renderGuide();renderQuiz();renderHW();'
BOOT1 = 'renderVideos();renderW0();renderW1();renderW2();renderSlides();renderFiles();renderGuide();renderQuiz();renderHW();'

def copytree(src, dst, skip=lambda f: False):
    for root, _, fs in os.walk(src):
        for f in fs:
            if f.startswith('_') or skip(f): continue
            rel = os.path.relpath(os.path.join(root, f), src)
            os.makedirs(os.path.dirname(os.path.join(dst, rel)), exist_ok=True)
            shutil.copy(os.path.join(root, f), os.path.join(dst, rel))

# chapters 2-8
for ch in range(2, 9):
    site = f'{R}/site{ch}'
    dst = f'{OUT}/ch{ch}'
    if os.path.exists(dst): shutil.rmtree(dst)
    copytree(site, dst, skip=lambda f: f.endswith('.b64.txt') or f == 'index.html')
    shutil.copy(f'{R}/ch{ch}/slides/deck.pptx', f'{dst}/slides/deck.pptx')
    src = json.load(open(f'{R}/ch{ch}/source.json', encoding='utf-8'))
    c = json.load(open(f'{R}/ch{ch}/content.json', encoding='utf-8'))
    for q in c['hw']['questions']: q['p'] = q['p'].replace('条件', '條件')
    files = []; zipname = None
    if src['datasets']:
        os.makedirs(f'{dst}/data', exist_ok=True)
        with zipfile.ZipFile(f'{dst}/data/all.zip', 'w', zipfile.ZIP_DEFLATED) as z:
            for x in src['datasets']:
                z.write(f'{R}/ch{ch}/data/{x["file"]}', f'CH{ch:02d}_資料/{x["file"]}')
        zipname = 'data/all.zip'
        for x in src['datasets']:
            ext = x['file'].rsplit('.', 1)[-1].upper(); path = None
            if ext == 'CSV':
                safe = re.sub(r'[^A-Za-z0-9._-]', '_', x['file'])
                shutil.copy(f'{R}/ch{ch}/data/{x["file"]}', f'{dst}/data/{safe}'); path = 'data/' + safe
            files.append({'ext': ext, 'label': x['label'], 'file': x['file'], 'path': path})
    guide_md = src['guide_md']
    man = f'{R}/newdata/ch{ch}/manifest.json'
    if os.path.exists(man):
        M = json.load(open(man, encoding='utf-8'))
        shutil.rmtree(f'{dst}/data', ignore_errors=True); os.makedirs(f'{dst}/data')
        with zipfile.ZipFile(f'{dst}/data/all.zip', 'w', zipfile.ZIP_DEFLATED) as z:
            for x in M:
                shutil.copy(f'{R}/newdata/ch{ch}/{x["file"]}', f'{dst}/data/{x["file"]}')
                z.write(f'{R}/newdata/ch{ch}/{x["file"]}', f'CH{ch:02d}_資料/{x["file"]}')
        files = [{'ext': x['ext'], 'label': x['label'], 'file': x['file'], 'path': 'data/' + x['file']} for x in M]
        zipname = 'data/all.zip'
        src['datasets'] = []
        if os.path.exists(f'{R}/ch{ch}/guide_v2.md'):
            guide_md = open(f'{R}/ch{ch}/guide_v2.md', encoding='utf-8').read()
    fmap = {x['file']: x['path'] for x in files if x.get('path')} if os.path.exists(man) else {}
    for i, x in enumerate(src['datasets']):
        sn = safe_name(x['file'], i)
        os.makedirs(f'{dst}/data', exist_ok=True)
        shutil.copy(f'{R}/ch{ch}/data/{x["file"]}', f'{dst}/data/{sn}')
        fmap[x['file']] = 'data/' + sn
    slides = sorted(f for f in os.listdir(f'{R}/ch{ch}/slides') if f.startswith('s-'))
    c.update({'slidesN': len(slides), 'deckName': B.DECK[ch], 'guide': guide_md, 'guideType': src['guide_type'],
              'files': files, 'zip': zipname, 'widgets': B.WIDGETS[ch], 'nav': NAV, 'static': True, 'pptxPath': 'slides/deck.pptx'})
    open(f'{dst}/index.html', 'w', encoding='utf-8').write('<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + withauth(filelinks(epflow(B.page(c), BOOT, EPMAP.get(ch)), fmap)).replace('<style>', '<style>\n:root{color-scheme:light}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}\n', 1) + '</html>\n')
    print('ch', ch)

# chapter 1 (original template)
dst = f'{OUT}/ch1'
if os.path.exists(dst): shutil.rmtree(dst)
c1 = f'{R}/ch1site'
copytree(c1, dst, skip=lambda f: f.endswith('.b64.txt') or f.endswith('.html') or f in ('template.html', 'lung.json', 'guide.json', 'guide_v2.json'))
shutil.copy(f'{c1}/slides/ch1.pptx', f'{dst}/slides/ch1.pptx')
shutil.copy(f'{c1}/CH01_data.zip', f'{dst}/CH01_data.zip')
h = open(f'{c1}/index.html', encoding='utf-8').read()
for a, b in [('data-dl="slides/ch1.pptx.b64.txt"', 'data-dl="slides/ch1.pptx"'), ('data-dl="CH01_data.zip.b64.txt"', 'data-dl="CH01_data.zip"'),
             ("async function download(path,name){\n  const dl=await dlP;", "async function download(path,name){\n  {const a=document.createElement('a');a.href=path;a.download=name;document.body.appendChild(a);a.click();a.remove();return;}\n  const dl=await dlP;")]:
    assert a in h, a; h = h.replace(a, b)
h = re.sub(r'href="https://claude\.ai/artifact/1KzEASbZmjAadUJNyTpui3" target="_blank" rel="noopener"', 'href="../"', h)
U = {2: 'UnuQpX8cFNFWyeUQpdC3EV', 3: 'SbBsexfFx9S3L4rBaEn9H6', 4: 'Eib187yXiJtfwKU6ZeUo7k', 5: '38WGwCydef167UdwWY6Zxw', 6: '47zGPoRp8Mv9oef1ZW7g7f', 7: 'DdhER4fYRggw9fUAsAAHeQ', 8: 'VEfUDBvwwJwJNKRztaZSLC'}
for i, u in U.items():
    h = h.replace(f'href="https://claude.ai/artifact/{u}" target="_blank" rel="noopener"', f'href="../ch{i}/"')
assert 'claude.ai/artifact' not in h
fmap1 = {f: 'data/' + f for f in os.listdir(f'{c1}/data')}
fmap1['adult income1.csv'] = 'data/adult_income1.csv'
man1 = f'{R}/newdata/ch1/manifest.json'
if os.path.exists(man1):
    M = json.load(open(man1, encoding='utf-8'))
    shutil.rmtree(f'{dst}/data', ignore_errors=True); os.makedirs(f'{dst}/data')
    os.remove(f'{dst}/CH01_data.zip')
    with zipfile.ZipFile(f'{dst}/CH01_data.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for x in M:
            shutil.copy(f'{R}/newdata/ch1/{x["file"]}', f'{dst}/data/{x["file"]}')
            z.write(f'{R}/newdata/ch1/{x["file"]}', f'CH01_資料/{x["file"]}')
    i0 = h.index('const FILES=['); j0 = h.index('];', i0) + 2
    h = h[:i0] + 'const FILES=' + json.dumps([[x['ext'], x['label'], x['file'], 'data/' + x['file']] for x in M], ensure_ascii=False) + ';' + h[j0:]
    h = re.sub(r'下載全部（ZIP，\d+ 個檔）', f'下載全部（ZIP，{len(M)} 個檔）', h)
    h = h.replace('CSV 可單獨下載；SAV、SPS、XLS 檔包含在 ZIP 內。SPS 語法裡的路徑要改成自己的下載位置。', '每個檔案都可以單獨下載，也可以一次下載全部（ZIP）。下載後在 SPSS 選「檔案 → 開啟 → 資料」開啟 .sav。')
    h = h.replace(">下載 CSV</button>", ">下載 ${e}</button>")
    if os.path.exists(f'{c1}/guide_v2.json'):
        g2 = json.load(open(f'{c1}/guide_v2.json', encoding='utf-8'))
        a0 = h.index('<script type="application/json" id="guideData">') + len('<script type="application/json" id="guideData">'); b0 = h.index('</script>', a0)
        h = h[:a0] + json.dumps(g2, ensure_ascii=False).replace('</', '<\\/') + h[b0:]
    fmap1 = {x['file']: 'data/' + x['file'] for x in M}
h = withauth(filelinks(epflow(h, BOOT1), fmap1))
open(f'{dst}/index.html', 'w', encoding='utf-8').write('<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + h.replace('<style>', '<style>\n:root{color-scheme:light}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}\n', 1) + '</html>\n')
print('ch 1')

# home
hh = open(f'{R}/home/index.html', encoding='utf-8').read()
for i in range(1, 9):
    u = '5pz9XF3QK6NrYDqTrsU5a7' if i == 1 else U[i]
    hh = hh.replace(f'href="https://claude.ai/artifact/{u}" target="_blank" rel="noopener"', f'href="ch{i}/"')
assert 'claude.ai/artifact' not in hh
hh = hh.replace('各章在新分頁開啟。', '')
import re as _re
_i = hh.index('<div class="band">'); _j = hh.index('<main class="wrap">')
_flow = _re.search(r'<ol class="flow".*?</ol>', hh[_i:_j], _re.S).group(0)
hh = hh[:_i] + open(B.G + '/intro.html', encoding='utf-8').read() + '<div class="band"><div class="wrap flowband">' + _flow + '</div></div>\n' + hh[_j:].replace('<main class="wrap">', '<main class="wrap" id="chapters" style="padding-top:28px">', 1)
hh = hh.replace('條件機率表、二項分配、中央極限定理模擬', '條件機率表、二項分配、常態分配、中央極限定理模擬')
hh = hh.replace('</style>', open(B.G + '/intro.css', encoding='utf-8').read() + '</style>', 1)
hh = hh.replace('</body>', '<script>' + open(B.G + '/intro.js', encoding='utf-8').read() + '</script>\n</body>', 1) if '</body>' in hh else hh + '<script>' + open(B.G + '/intro.js', encoding='utf-8').read() + '</script>\n'
hh = withauth(hh, chapter=False)
open(f'{OUT}/index.html', 'w', encoding='utf-8').write('<!doctype html>\n<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + hh.replace('<style>', '<style>\n:root{color-scheme:light}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}\n', 1) + '</html>\n')
os.makedirs(OUT + '/teacher', exist_ok=True)
open(OUT + '/teacher/index.html', 'w', encoding='utf-8').write(open(B.G + '/teacher.html', encoding='utf-8').read().replace('/*__AUTH__*/', open(B.G + '/auth.css', encoding='utf-8').read().join(['</script><style>', '</style><script>']) + open(B.G + '/auth.js', encoding='utf-8').read()))
print('teacher')
print('home')
