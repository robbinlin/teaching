import json, os, re, shutil, base64, zipfile, sys
R = '/tmp/claude-0/-home-claude/cd232513-5fae-5ea8-89b2-c8c53a010923/scratchpad'
G = R + '/gen'
WIDGETS = {2: ['condprob', 'binom', 'normal', 'clt'], 3: ['sdse', 'ci', 'ztest'], 4: ['design', 'ttest', 'tails'],
           5: ['anova', 'fwer', None], 6: [None, 'chi2', 'fisher'], 7: ['corr', None, 'r2'], 8: ['simpson', 'interact', 'rate']}
DECK = {2: '基礎機率及分配、抽樣分配_lin20250304', 3: '估計與檢定 lin20250304', 4: '單樣本及雙樣本檢定_lin20260411',
        5: '平均數檢定_多組樣本_lin20260411', 6: '兩個類別變數之檢定_lin20220520', 7: '相關和廻歸分析(一)_lin20241122', 8: '多變量迴歸分析20241128'}
nav = json.load(open(G + '/nav.json')) if os.path.exists(G + '/nav.json') else {}

def page(chdata, extra_js=''):
    css = open(G + '/base.css', encoding='utf-8').read() + open(G + '/extra.css', encoding='utf-8').read()
    body = open(G + '/body.html', encoding='utf-8').read()
    js = open(G + '/prelude.js', encoding='utf-8').read() + open(G + '/widgets.js', encoding='utf-8').read() + extra_js + open(G + '/main.js', encoding='utf-8').read()
    data = json.dumps(chdata, ensure_ascii=False).replace('</', '<\\/')
    head = (f'<title>高等體育統計 第{chdata["id"]}章</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap">\n')
    return head + '<style>' + css + '</style>\n' + body + f'\n<script type="application/json" id="chData">{data}</script>\n<script>(function(){{\n' + js + '\n})();</script>\n'

def build(ch):
    src = json.load(open(f'{R}/ch{ch}/source.json', encoding='utf-8'))
    c = json.load(open(f'{R}/ch{ch}/content.json', encoding='utf-8'))
    out = f'{R}/site{ch}'
    for d in ['slides', 'thumbs', 'spss', 'data']:
        os.makedirs(f'{out}/{d}', exist_ok=True)
    slides = sorted(f for f in os.listdir(f'{R}/ch{ch}/slides') if f.startswith('s-'))
    for f in slides: shutil.copy(f'{R}/ch{ch}/slides/{f}', f'{out}/slides/{f}')
    shutil.copy(f'{R}/ch{ch}/slides/deck.pdf', f'{out}/slides/deck.pdf')
    open(f'{out}/slides/deck.pptx.b64.txt', 'w').write(base64.b64encode(open(f'{R}/ch{ch}/slides/deck.pptx', 'rb').read()).decode())
    for f in os.listdir(f'{R}/ch{ch}/thumbs'): shutil.copy(f'{R}/ch{ch}/thumbs/{f}', f'{out}/thumbs/{f}')
    if os.path.isdir(f'{R}/ch{ch}/spss'):
        for f in os.listdir(f'{R}/ch{ch}/spss'): shutil.copy(f'{R}/ch{ch}/spss/{f}', f'{out}/spss/{f}')
    files = []
    zipname = None
    if src['datasets']:
        zp = f'{out}/data/all.zip'
        with zipfile.ZipFile(zp, 'w', zipfile.ZIP_DEFLATED) as z:
            for x in src['datasets']:
                z.write(f'{R}/ch{ch}/data/{x["file"]}', f'CH{ch:02d}_資料/{x["file"]}')
        open(f'{out}/data/all.zip.b64.txt', 'w').write(base64.b64encode(open(zp, 'rb').read()).decode())
        os.remove(zp)
        zipname = 'data/all.zip.b64.txt'
        for x in src['datasets']:
            ext = x['file'].rsplit('.', 1)[-1].upper()
            path = None
            if ext == 'CSV':
                safe = re.sub(r'[^A-Za-z0-9._-]', '_', x['file'])
                raw = open(f'{R}/ch{ch}/data/{x["file"]}', 'rb').read()
                try:
                    raw.decode('utf-8'); open(f'{out}/data/{safe}', 'wb').write(raw); path = 'data/' + safe
                except UnicodeDecodeError:
                    open(f'{out}/data/{safe}.b64.txt', 'w').write(base64.b64encode(raw).decode()); path = 'data/' + safe + '.b64.txt'
            files.append({'ext': ext, 'label': x['label'], 'file': x['file'], 'path': path})
    for q in c['hw']['questions']:
        q['p'] = q['p'].replace('条件', '條件')
    c.update({'slidesN': len(slides), 'deckName': DECK[ch], 'guide': src['guide_md'], 'guideType': src['guide_type'],
              'files': files, 'zip': zipname, 'widgets': WIDGETS[ch], 'nav': nav})
    open(f'{out}/index.html', 'w', encoding='utf-8').write(page(c))
    fl = []
    for root, _, fs in os.walk(out):
        for f in fs:
            if f == 'index.html' or f.startswith('_'): continue
            fl.append(os.path.relpath(os.path.join(root, f), out))
    json.dump(sorted(fl), open(f'{out}/_files.json', 'w'))
    tot = sum(os.path.getsize(os.path.join(out, f)) for f in fl)
    print(ch, 'files', len(fl), 'MB', round(tot / 1e6, 1), 'slides', len(slides))

if __name__ == '__main__':
    for ch in [int(a) for a in sys.argv[1:]] or range(2, 9):
        build(ch)
