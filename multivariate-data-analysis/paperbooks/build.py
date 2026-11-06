"""紙本書版建置與檢查工具
用法：
  python -I build.py --check books/xxx.json   # 只檢查
  python -I build.py books/xxx.json [...]      # 檢查並輸出到 out/
  python -I build.py --all                     # 全部書
"""
import json, os, sys, glob, re
sys.stdout.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
MODEL_TYPES = {'scatter3d', 'bars', 'paths', 'columns', 'lines', 'curves', 'matrix', 'boxes', 'drops', 'fit'}
SCENE_TYPES = {'conference', 'lab', 'meeting', 'field', 'matrix', 'classroom'}
COLORS = {'teal', 'red', 'gold', 'ink', 'purple', 'blue', 'gray', 'green'}
NODE_KINDS = {'obs', 'lat', 'err', 'comp', 'mod'}

def plain(s):
    return re.sub(r'</?(?:em|b|i|strong|br|span)(?:\s[^>]*)?/?>', '', str(s or ''), flags=re.I)

def check(book, name):
    E, W = [], []
    def err(m): E.append(m)
    def warn(m): W.append(m)
    for k in ('title', 'cover', 'cast', 'acts', 'notes', 'ending'):
        if k not in book: err(f'缺少頂層欄位 {k}')
    cast = book.get('cast', {}) or {}
    if not isinstance(cast, dict) or not cast: err('cast 必須是非空物件')
    for cid, c in cast.items():
        if not c.get('name'): err(f'cast.{cid} 缺 name')
        if not c.get('quips'): warn(f'cast.{cid} 沒有 quips')
    notes = book.get('notes', {}) or {}
    used_notes = []
    def check_scene(sc, where):
        if not isinstance(sc, dict): err(f'{where}: scene 必須是物件'); return
        if sc.get('type') not in SCENE_TYPES: err(f'{where}: scene.type 必須是 {sorted(SCENE_TYPES)}')
        for cid in sc.get('cast', []) or []:
            if cid not in cast: err(f'{where}: scene.cast 參照不存在的角色 {cid}')
        if len(sc.get('cast', []) or []) > 5: err(f'{where}: scene.cast 最多 5 人')
        scr = sc.get('screen')
        if scr is not None:
            if not isinstance(scr, dict): err(f'{where}: screen 必須是物件')
            else:
                if len(plain(scr.get('title', ''))) > 22: warn(f'{where}: screen.title 超過 22 字會縮小')
                for b in scr.get('bars', []) or []:
                    if not (isinstance(b, list) and len(b) >= 2 and isinstance(b[1], (int, float))): err(f'{where}: screen.bars 每項應為 [標籤, 數值, 可選顯示文字]')
    acts = book.get('acts', [])
    if not isinstance(acts, list) or not acts: err('acts 必須是非空陣列')
    nchoice = 0
    nviz = 0
    for ai, a in enumerate(acts):
        w = f'acts[{ai}]'
        for k in ('key', 'title', 'scene', 'fig', 'beats'):
            if k not in a: err(f'{w} 缺 {k}')
        if 'scene' in a: check_scene(a['scene'], w)
        fig = a.get('fig', {})
        if fig and len(plain(fig.get('sub', ''))) > 120: warn(f'{w}.fig.sub 超過 120 字')
        for bi, b in enumerate(a.get('beats', [])):
            wb = f'{w}.beats[{bi}]'
            t = b.get('type')
            if t is None:
                if 't' not in b: err(f'{wb} 文字段落缺 t')
                s = b.get('s', 'n')
                if s != 'n' and s not in cast: err(f'{wb} 講者 {s} 不在 cast')
                if len(plain(b.get('t'))) > 150: warn(f'{wb} 段落 {len(plain(b.get("t")))} 字，建議 ≤ 120 字')
            elif t == 'note':
                if b.get('id') not in notes: err(f'{wb} 參照不存在的筆記 {b.get("id")}')
                used_notes.append(b.get('id'))
            elif t == 'scene':
                if 'scene' in b: check_scene(b['scene'], wb)
            elif t == 'viz':
                nviz += 1
                if not b.get('title'): err(f'{wb} viz 缺 title')
                if not b.get('model'): err(f'{wb} viz 缺 model')
                else: check_model(b['model'], wb, err, warn)
                txt = b.get('text', '')
                tl = sum(len(plain(x)) for x in txt) if isinstance(txt, list) else len(plain(txt))
                if tl > 240: warn(f'{wb} viz 文字 {tl} 字，建議 ≤ 200 字')
                if len(plain(b.get('sub', ''))) > 120: warn(f'{wb} viz.sub 超過 120 字')
            elif t == 'choice':
                nchoice += 1
                opts = b.get('opts', [])
                if not (2 <= len(opts) <= 4): err(f'{wb} 選項需 2–4 個')
                if not any(o.get('good') for o in opts): err(f'{wb} 至少要有一個 good:true 選項')
                for oi, o in enumerate(opts):
                    if not o.get('t') or not o.get('fb'): err(f'{wb}.opts[{oi}] 缺 t 或 fb')
                    if len(plain(o.get('fb'))) > 170: warn(f'{wb}.opts[{oi}].fb {len(plain(o.get("fb")))} 字，建議 ≤ 150 字')
                tot = len(plain(b.get('q'))) + sum(len(plain(o.get('t'))) for o in opts)
                if tot > 260: warn(f'{wb} 題目＋選項共 {tot} 字，建議 ≤ 230 字')
                if not b.get('header'): warn(f'{wb} 沒有 header（決策短標題）')
                if 'scene' in b: check_scene(b['scene'], wb)
                if b.get('model'): check_model(b['model'], wb, err, warn)
            else:
                err(f'{wb} 未知的 type {t}')
    for nid, n in notes.items():
        w = f'notes.{nid}'
        for k in ('no', 't', 'blocks', 'fig'):
            if k not in n: err(f'{w} 缺 {k}')
        total = 0
        for b in n.get('blocks', []):
            if b.get('type') not in ('h', 'p', 'formula', 'bullet'): err(f'{w} block type 錯誤 {b.get("type")}')
            total += len(plain(b.get('t')))
            if b.get('type') == 'formula' and len(plain(b.get('t'))) > 34: warn(f'{w} 公式超過 34 字會縮小')
        if total > 560: warn(f'{w} 左頁文字 {total} 字，建議 ≤ 520 字（會自動縮字）')
        fig = n.get('fig', {})
        m = fig.get('model')
        if not m: err(f'{w}.fig 缺 model')
        else: check_model(m, w, err, warn)
        ptxt = sum(len(plain(p)) for p in fig.get('points', []))
        if ptxt > 200: warn(f'{w}.fig.points 共 {ptxt} 字，建議 ≤ 180 字')
        if fig.get('table') and len(fig['table']) > 6: warn(f'{w}.fig.table 超過 6 列')
    for nid in notes:
        if nid not in used_notes: warn(f'筆記 {nid} 沒有在任何 beats 中被使用')
    if nchoice < 3: warn(f'只有 {nchoice} 個研究決策，建議 ≥ 3')
    if nviz < 3: warn(f'只有 {nviz} 個模型動畫頁（viz），建議 ≥ 4')
    end = book.get('ending', {})
    if not end.get('paragraphs'): err('ending.paragraphs 缺')
    return E, W

def check_model(m, w, err, warn):
    steps = m.get('steps')
    if steps is not None:
        if not isinstance(steps, list) or not (2 <= len(steps) <= 5): err(f'{w}: model.steps 需 2–5 個步驟')
        else:
            base = {k: v for k, v in m.items() if k != 'steps'}
            for si, st in enumerate(steps):
                if not isinstance(st, dict): err(f'{w}: steps[{si}] 必須是物件'); continue
                if not st.get('cap'): err(f'{w}: steps[{si}] 缺 cap（步驟說明）')
                elif len(plain(st['cap'])) > 40: warn(f'{w}: steps[{si}].cap 超過 40 字')
                merged = dict(base); merged.update({k: v for k, v in st.items() if k != 'cap'})
                check_model(merged, f'{w}.steps[{si}]', err, warn)
            return
    t = m.get('type')
    if t not in MODEL_TYPES: err(f'{w}: model.type 必須是 {sorted(MODEL_TYPES)}'); return
    def num(v): return isinstance(v, (int, float)) and not isinstance(v, bool)
    def col(c, where):
        if c is not None and c not in COLORS: err(f'{w}: {where} 顏色 {c} 不在 {sorted(COLORS)}')
    if t == 'bars':
        rows = m.get('rows', [])
        if not rows: err(f'{w}: bars.rows 必填')
        for r in rows:
            if not (isinstance(r, list) and len(r) >= 2 and num(r[1])): err(f'{w}: bars.rows 每列 [標籤, 數值, 可選顏色]')
            if isinstance(r, list) and len(r) > 2: col(r[2], 'bars.rows')
            if isinstance(r, list) and len(str(r[0])) > 6: warn(f'{w}: bars 標籤「{r[0]}」超過 6 字可能重疊')
        if len(rows) > 8: warn(f'{w}: bars 最多顯示 8 列')
    elif t == 'paths':
        ids = set()
        for nd in m.get('nodes', []):
            if not nd.get('id'): err(f'{w}: paths 節點缺 id')
            ids.add(nd.get('id'))
            if nd.get('kind', 'obs') not in NODE_KINDS: err(f'{w}: 節點 kind 必須是 {sorted(NODE_KINDS)}')
            if not (num(nd.get('x', 0)) and -1.05 <= nd.get('x', 0) <= 1.05): err(f'{w}: 節點 {nd.get("id")} x 須在 -1..1')
            if not (num(nd.get('y', 0)) and -0.05 <= nd.get('y', 0) <= 1.05): err(f'{w}: 節點 {nd.get("id")} y 須在 0..1')
        for e in m.get('edges', []):
            if e.get('from') not in ids: err(f'{w}: 邊 from {e.get("from")} 不存在')
            if 'toEdge' in e:
                for x in e['toEdge']:
                    if x not in ids: err(f'{w}: toEdge {x} 不存在')
            elif e.get('to') not in ids: err(f'{w}: 邊 to {e.get("to")} 不存在')
            col(e.get('color'), 'edge')
    elif t == 'columns':
        if not all(num(v) for v in m.get('values', [])) or not m.get('values'): err(f'{w}: columns.values 必須是數字陣列')
        for l in m.get('lines', []):
            if not all(num(v) for v in l.get('values', [])): err(f'{w}: columns.lines.values 必須是數字')
    elif t == 'lines':
        ser = m.get('series', [])
        if not ser: err(f'{w}: lines.series 必填')
        n = len(m.get('xLabels', []))
        for s in ser:
            if not all(num(v) for v in s.get('values', [])): err(f'{w}: lines.series.values 必須是數字')
            if n and len(s.get('values', [])) != n: err(f'{w}: series 值的數量需等於 xLabels 數量')
            col(s.get('color'), 'series')
    elif t == 'curves':
        cs = m.get('curves', [])
        if not cs: err(f'{w}: curves.curves 必填')
        for c in cs:
            if c.get('type', 'normal') not in ('normal', 'logistic', 'line', 'points'): err(f'{w}: curve type 錯誤')
            col(c.get('color'), 'curve')
        x = m.get('x')
        if x is not None and not (isinstance(x, list) and len(x) == 2 and x[0] < x[1]): err(f'{w}: curves.x 應為 [min,max]')
    elif t == 'matrix':
        lb = m.get('labels', []); vals = m.get('values', [])
        if len(vals) != len(lb) or any(len(r) != len(lb) for r in vals): err(f'{w}: matrix.values 必須是 n×n，n=labels 數')
        if len(lb) > 8: warn(f'{w}: matrix 最多 8 個變數')
    elif t == 'boxes':
        for gr in m.get('groups', []):
            st = gr.get('stats', [])
            if len(st) != 5 or not all(num(v) for v in st) or st != sorted(st): err(f'{w}: boxes.stats 必須是遞增的 [min,q1,median,q3,max]')
    elif t == 'drops':
        x = m.get('x')
        if x is not None and not (isinstance(x, list) and len(x) == 2 and x[0] < x[1]): err(f'{w}: drops.x 應為 [min,max]')
        cs = m.get('counts')
        if cs is not None and not (isinstance(cs, list) and cs and all(num(v) and v >= 0 for v in cs)): err(f'{w}: drops.counts 必須是非負數字陣列')
        if cs and sum(cs) > 400: warn(f'{w}: drops 球數 {sum(cs)} 過多，建議 ≤ 200')
        if cs and max(cs) > 60: warn(f'{w}: drops 單格超過 60 顆會被截斷')
        if m.get('shade'): col(m['shade'].get('color'), 'shade')
    elif t == 'fit':
        gs = m.get('groups') or [m]
        if len(gs) > 4: warn(f'{w}: fit 最多 4 組')
        for gr in gs:
            pts = gr.get('points'); gen = gr.get('gen')
            if not pts and not gen: err(f'{w}: fit 每組需要 points 或 gen')
            if pts and not all(isinstance(p, list) and len(p) >= 2 and num(p[0]) and num(p[1]) for p in pts): err(f'{w}: fit.points 每點 [x,y]')
            if gen and not all(num(gen.get(k, 0)) for k in ('b0', 'b1', 'noise', 'n')): err(f'{w}: fit.gen 的 b0/b1/noise/n 必須是數字')
            col(gr.get('color'), 'fit group')
        for k in ('x', 'y'):
            v = m.get(k)
            if v is not None and not (isinstance(v, list) and len(v) == 2 and v[0] < v[1]): err(f'{w}: fit.{k} 應為 [min,max]')
    elif t == 'scatter3d':
        if m.get('axes') and len(m['axes']) != 3: err(f'{w}: scatter3d.axes 需 3 個')

def build(path, write=True):
    book = json.load(open(path, encoding='utf-8'))
    name = os.path.splitext(os.path.basename(path))[0]
    E, W = check(book, name)
    print(f'== {name}: {len(E)} 錯誤, {len(W)} 警告')
    for e in E: print('  ✗', e)
    for x in W: print('  ⚠', x)
    if E or not write: return not E
    eng = open(os.path.join(HERE, 'engine.html'), encoding='utf-8').read()
    js = json.dumps(book, ensure_ascii=False).replace('</', '<\\/')
    html = eng.replace('/*__BOOK__*/', 'const BOOK=' + js + ';').replace('__TITLE__', (book.get('cover', {}).get('big') or 'MULTIVARIATE') + '｜' + book['title'] + '・紙本書版')
    os.makedirs(OUT, exist_ok=True)
    fn = os.path.join(OUT, book.get('file', name) + '.html')
    open(fn, 'w', encoding='utf-8').write(html)
    print('  → ', fn)
    return True


def make_index():
    import html as H
    books = []
    for p in sorted(glob.glob(os.path.join(HERE, 'books', '*.json'))):
        b = json.load(open(p, encoding='utf-8'))
        name = os.path.splitext(os.path.basename(p))[0]
        nchoice = sum(1 for a in b.get('acts', []) for x in a.get('beats', []) if x.get('type') == 'choice')
        books.append((b, b.get('file', name) + '.html', nchoice))
    cards = []
    for b, fn, nc in books:
        c = b.get('cover', {})
        acts = '・'.join(H.escape(a.get('title', '')) for a in b.get('acts', []))
        summ = H.escape(re.sub(r'<[^>]+>', '', c.get('summary', '')))
        cards.append(f'''<a class="card" href="{H.escape(fn)}"><div class="spine"><span>CASE {H.escape(b.get('caseNo',''))}</span></div><div class="body"><div class="big">{H.escape(c.get('big',''))}</div><h2>{H.escape(b.get('title',''))}</h2><div class="tag">{H.escape(c.get('tag',''))}</div><p>{summ}</p><div class="meta">{acts}<br>研究筆記 {len(b.get('notes',{}))} 則 ・ 研究決策 {nc} 題</div></div></a>''')
    page = f'''<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>多變量統計・紙本書版書架</title>
<style>:root{{--paper:#f4eddc;--ink:#1e1912;--teal:#0c4a45;--acc:#86200f}}*{{box-sizing:border-box;margin:0;padding:0}}body{{background:#3b2a1c;color:var(--ink);font-family:"Microsoft JhengHei","PingFang TC","Noto Sans TC",sans-serif;padding:40px 16px 60px}}
header{{max-width:1100px;margin:0 auto 28px;color:#f3ead6}}header .k{{letter-spacing:.35em;font-size:12px;color:#c9a97a}}header h1{{font-size:clamp(26px,4vw,40px);margin:8px 0}}header p{{color:#d9c9a8;line-height:1.7;max-width:760px}}
.grid{{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}}
.card{{display:flex;text-decoration:none;color:inherit;background:var(--paper);border-radius:6px 10px 10px 6px;box-shadow:0 10px 24px rgba(0,0,0,.35);overflow:hidden;transition:transform .2s,box-shadow .2s}}.card:hover{{transform:translateY(-4px) rotate(-.4deg);box-shadow:0 16px 30px rgba(0,0,0,.45)}}
.spine{{width:38px;background:linear-gradient(90deg,#2e2622,#4a3a30);display:flex;align-items:center;justify-content:center}}.spine span{{writing-mode:vertical-rl;color:#e8d9b8;letter-spacing:.3em;font-size:12px;font-weight:700}}
.body{{padding:18px 18px 16px;flex:1}}.big{{font-size:12px;letter-spacing:.25em;color:var(--teal);font-weight:700}}h2{{font-size:24px;margin:6px 0 4px}}.tag{{color:var(--acc);font-size:13px;font-weight:700;margin-bottom:10px}}p{{font-size:14px;line-height:1.7;color:#3a3226}}.meta{{margin-top:12px;font-size:12px;color:#6a5a3a;line-height:1.6;border-top:1px dashed rgba(60,40,20,.3);padding-top:8px}}
</style></head><body><header><div class="k">R E S E A R C H   C A S E   F I L E S</div><h1>多變量統計・紙本書版書架</h1><p>每一本都是一個研究案件：翻頁閱讀故事、在研究決策處選擇並掀開紙片看回饋、在研究筆記頁觀察浮在紙上的 3D 統計模型（可拖曳旋轉）。建議使用 Chrome 或 Edge 開啟，需要網路載入 3D 函式庫。</p></header>
<div class="grid">{"".join(cards)}</div></body></html>'''
    open(os.path.join(OUT, 'list.html'), 'w', encoding='utf-8').write(page.replace('<header>', '<header><a href="index.html" style="color:#e8c98a;font-size:14px">← 回到 3D 書房</a>'))
    lib = []
    for b, fn, nc in books:
        c = b.get('cover', {})
        nviz = sum(1 for a in b.get('acts', []) for x in a.get('beats', []) if x.get('type') == 'viz')
        lib.append({'file': fn, 'id': fn[:-5], 'caseNo': b.get('caseNo', ''), 'title': b.get('title', ''), 'big': c.get('big', ''), 'tag': c.get('tag', ''),
                    'summary': re.sub(r'<[^>]+>', '', c.get('summary', '')), 'acts': [a.get('title', '') for a in b.get('acts', [])],
                    'notes': len(b.get('notes', {})), 'viz': nviz, 'choices': nc, 'color': b.get('spineColor', '')})
    tpl = open(os.path.join(HERE, 'library.html'), encoding='utf-8').read()
    js = json.dumps(lib, ensure_ascii=False).replace('</', '<\\/')
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(tpl.replace('/*__LIB__*/', 'const LIB=' + js + ';'))
    print('  → index.html (3D 書房) + list.html')

if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(0)
    if a[0] == '--check':
        ok = all(build(p, False) for p in a[1:]); sys.exit(0 if ok else 1)
    files = sorted(glob.glob(os.path.join(HERE, 'books', '*.json'))) if a[0] == '--all' else a
    ok = all([build(p) for p in files]); make_index(); sys.exit(0 if ok else 1)
