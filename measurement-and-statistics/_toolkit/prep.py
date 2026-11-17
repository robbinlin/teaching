"""整理來源：講義轉圖片、影片縮圖與時間軸。
  python -X utf8 prep.py slides     pptx → pdf → s-NN.jpg、sheet.jpg
  python -X utf8 prep.py episodes   每章 episodes.json 與影片縮圖
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

here = Path(__file__).resolve().parent
COURSE = Path(r'F:\Dropbox\claude-體育測驗與統計')
ANIM = COURSE / '動畫短片' / 'animations_line'
VIDEO = COURSE / '動畫短片' / '成品_單線插畫風'
DECKS = {1: '(一)體育測驗與統計概念/(一)體育測驗與統計概念 20230224.pptx', 2: '(二)測驗與評量的應用技術/(二)測驗與評量的應用技術 20220312.pptx',
         3: '(三)描述統計與常態分布/(三)描述統計與常態分布.pptx', 4: '(四)相關和預測/(四)相關和預測.pptx',
         5: '(五)推論統計/(五)推論統計_20220425.pptx', 6: '(六)信度與效度的理論/(六)信度與效度的理論.pptx',
         7: '(七)效標參照的信度與效度/(七)效標參照的信度與效度.pptx', 8: '(八)編製紙筆測驗與調查/(八)編製紙筆測驗與調查.pptx', 9: '(九)測量情意的行為/(九)測量情意的行為.pptx', 10: '(十)評分/(十)評分.pptx', 12: '(十二)競技與健身運動的心理測量/(十二)競技與健身運動的心理測量.pptx', 13: '(十三)課室評等/(十三)課室評等.pptx'}
CHS = sorted(DECKS)
PS = r'''
$ErrorActionPreference = 'Stop'
$pp = New-Object -ComObject PowerPoint.Application
try {
  foreach ($n in @(%s)) {
    $src = Join-Path '%s' ("ch$n\slides\deck.pptx")
    $dst = Join-Path '%s' ("ch$n\slides\deck.pdf")
    $pres = $pp.Presentations.Open($src, $true, $false, $false)
    $pres.SaveAs($dst, 32)
    $pres.Close()
    Write-Output "ch$n ok"
  }
} finally { $pp.Quit() }
'''


def slides():
    only = [int(x) for x in sys.argv[2:]]
    import fitz
    from PIL import Image, ImageDraw
    for n, rel in DECKS.items():
        d = here / ('ch%d' % n) / 'slides'
        d.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(COURSE / '美化版' / rel, d / 'deck.pptx')
    if not all((here / ('ch%d' % n) / 'slides' / 'deck.pdf').exists() for n in DECKS):
        ps = here / '_pdf.ps1'
        todo = [n for n in DECKS if not (here / ('ch%d' % n) / 'slides' / 'deck.pdf').exists()]
        ps.write_text(PS % (','.join(map(str, todo)), here, here), encoding='utf-8-sig')
        subprocess.run(['powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', str(ps)], check=True, timeout=900)
    for n in DECKS:
        d = here / ('ch%d' % n) / 'slides'
        if only and n not in only:
            continue
        for f in d.glob('s-*.jpg'):
            f.unlink()
        doc = fitz.open(d / 'deck.pdf')
        thumbs = []
        for i, pg in enumerate(doc):
            pix = pg.get_pixmap(matrix=fitz.Matrix(1600 / pg.rect.width, 1600 / pg.rect.width), alpha=False)
            im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
            im.save(d / ('s-%02d.jpg' % (i + 1)), quality=84, optimize=True)
            t = im.resize((400, round(400 * im.height / im.width)))
            ImageDraw.Draw(t).rectangle([0, 0, 62, 24], fill=(20, 30, 60))
            ImageDraw.Draw(t).text((6, 5), 's-%02d' % (i + 1), fill=(255, 255, 255))
            thumbs.append(t)
        cols = 5
        rows = -(-len(thumbs) // cols)
        w, h = thumbs[0].size
        sheet = Image.new('RGB', (cols * w, rows * h), (255, 255, 255))
        for i, t in enumerate(thumbs):
            sheet.paste(t, ((i % cols) * w, (i // cols) * h))
        sheet.save(d.parent / 'sheet.jpg', quality=80)
        print('ch', n, 'slides', len(thumbs), flush=True)


def timeline(key):
    p = ANIM / 'voice' / ('ep%s_timeline.js' % key)
    return json.loads(re.sub(r'^[^=]*=\s*', '', p.read_text(encoding='utf-8')).rstrip().rstrip(';'))


def episodes():
    sys.path.insert(0, str(ANIM))
    titles = {}
    src = (ANIM / 'finalize.py').read_text(encoding='utf-8')
    for k, t in re.findall(r"'(c\d+e\d)': '([^']+)'", src):
        titles[k] = t
    board = (COURSE / '動畫短片' / 'storyboards_line' / '00_全系列總表與講義核對.md').read_text(encoding='utf-8')
    full = {}
    for a, b, t, rng in re.findall(r'^\| (\d+)-(\d) \| ([^|]+) \| ([^|]+) \|', board, re.M):
        full['c%se%s' % (a, b)] = (t.strip(), rng.strip())
    for ch in ([int(x) for x in sys.argv[2:]] or CHS):
        d = here / ('ch%d' % ch)
        (d / 'thumbs').mkdir(parents=True, exist_ok=True)
        eps = []
        for e in range(1, 5):
            key = 'c%de%d' % (ch, e)
            tl = timeline(key)
            scenes = []
            for i, sc in enumerate(tl['scenes']):
                t0 = sc['t0']
                scenes.append({'i': i + 1, 't': '%d:%02d' % (int(t0) // 60, int(t0) % 60), 't0': round(t0, 2),
                               'lines': [(l.get('who', ''), l['disp']) for l in sc['lines']]})
            eps.append({'k': 'ep%d' % e, 'key': key, 'title': full[key][0], 'range': full[key][1], 'file': titles[key], 'dur': round(tl['dur'], 1), 'scenes': scenes})
            mp4 = next((VIDEO / ('第%d章' % ch)).glob('第%d章_EP%d_*_1080p.mp4' % (ch, e)))
            # 縮圖取片頭場景（第 2 或第 3 場）中段
            tt = None
            for sc in tl['scenes'][:4]:
                if len(sc['lines']) == 1 and '集' in sc['lines'][0]['disp']:
                    tt = sc['t0'] + 3.0
                    break
            if tt is None:
                tt = tl['scenes'][1]['t0'] + 2.0
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-ss', '%.2f' % tt, '-i', str(mp4), '-frames:v', '1', '-vf', 'scale=960:-1', '-q:v', '4', str(d / 'thumbs' / ('ep%d.jpg' % e))], check=True)
        (d / 'episodes.json').write_text(json.dumps(eps, ensure_ascii=False, indent=1), encoding='utf-8')
        print('ch', ch, [(x['k'], x['dur'], len(x['scenes'])) for x in eps], flush=True)


{'slides': slides, 'episodes': episodes}[sys.argv[1]]()
