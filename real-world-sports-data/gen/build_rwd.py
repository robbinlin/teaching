"""Build the static site for 真實世界運動大數據分析.
Usage: python3 build_rwd.py <out_dir>
Inputs: content/wNN.json, widgets_rwd/*.js, handouts (HANDOUTS), slide images (SLIDES)."""
import json, os, re, shutil, sys

G = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
HANDOUTS = os.environ.get('RWD_HANDOUTS', '/home/user/robbinlin/1152-RWD-course/講義')
SLIDES = os.environ.get('RWD_SLIDES', '/home/user/rwd-build/slides')
WEEKS = [int(x) for x in os.environ['RWD_WEEKS'].split(',')] if os.environ.get('RWD_WEEKS') else range(1, 19)
UNITS = [('問題與規格', [1, 2, 3]), ('讀程式與驗證', [4, 5, 6]), ('描述與推論', [7, 8, 9, 10]),
         ('預測', [11, 12]), ('因果', [13, 14, 15]), ('報告', [16, 17, 18])]
rd = lambda f: open(os.path.join(G, f), encoding='utf-8').read()

HELPERS = rd('widgets.js').split('/* ---------- CH1 widgets')[0]
def old_widget(name):
    m = re.search(r'(W\.%s=\(.*?\n\};\n)' % name, rd('widgets.js'), re.S)
    assert m, name
    return m.group(1)
NEW = {f[:-3]: rd('widgets_rwd/' + f) for f in sorted(os.listdir(os.path.join(G, 'widgets_rwd'))) if f.endswith('.js')}
def widget_js(names):
    return HELPERS + '\n'.join(NEW[n] if n in NEW else old_widget(n) for n in sorted(set(names)))

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@600;700&display=swap">\n')
CSS = rd('base.css') + rd('extra.css') + rd('rwd_extra.css')

def strip_handout(md):
    """Drop 時間配置 and every 教師備註 section; they are for the teacher, not the student site."""
    parts = re.split(r'(?m)^(?=## )', md)
    keep = [p for p in parts if not re.match(r'## (時間配置|教師備註)', p)]
    return ''.join(keep).rstrip() + '\n'

def page(c):
    names = [w for w in c['widgets'] if w]
    js = rd('rwd_prelude.js') + widget_js(names) + rd('rwd_main.js')
    data = json.dumps(c, ensure_ascii=False).replace('</', '<\\/')
    head = (f'<!doctype html>\n<html lang="zh-Hant">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            f'<title>真實世界運動大數據分析 第 {c["id"]} 週</title>\n' + FONTS)
    return (head + '<style>' + CSS + '</style>\n' + rd('rwd_body.html') +
            f'\n<script type="application/json" id="chData">{data}</script>\n<script>(function(){{\n' + js + '\n})();</script>\n</html>\n')

def build_week(n):
    c = json.load(open(f'{G}/content/w{n:02d}.json', encoding='utf-8'))
    guide = strip_handout(open(f'{HANDOUTS}/W{n:02d}.md', encoding='utf-8').read())
    heads = [l.lstrip('# ').strip() for l in guide.split('\n') if l.startswith('##')]
    for key in ('secRefs', 'stepRefs'):
        c[key] = [r for r in c.get(key, []) if any(h.startswith(r[0]) for h in heads)]
    dst = f'{OUT}/w{n:02d}'
    if os.path.exists(dst): shutil.rmtree(dst)
    os.makedirs(dst + '/slides')
    slides = sorted(f for f in os.listdir(f'{SLIDES}/w{n:02d}') if f.startswith('s-'))
    for f in slides + ['deck.pdf']:
        shutil.copy(f'{SLIDES}/w{n:02d}/{f}', f'{dst}/slides/{f}')
    assert len(c['widgets']) == len(c['concepts']), n
    for r in c['secRefs'] + c['stepRefs']:
        assert all(1 <= s <= len(slides) for s in r[1]), (n, r)
    nav = {str(i): f'../w{i:02d}/' for i in WEEKS}; nav['home'] = '../'
    c.update({'id': n, 'slidesN': len(slides), 'deckName': f'RWD_W{n:02d}', 'guide': guide, 'guideType': 'concept',
              'files': [], 'zip': None, 'nav': nav, 'static': True})
    c.setdefault('videos', [])
    open(f'{dst}/index.html', 'w', encoding='utf-8').write(page(c))
    return c

def home(weeks):
    rows = ''
    for unit, ws in UNITS:
        items = ''.join(
            f'<a class="wk" href="w{n:02d}/" data-wk="{n}"><span class="wn">W{n:02d}</span><span class="wt">{weeks[n]["title"]}</span>'
            f'<span class="wm">{"、".join(x for x in [str(len([w for w in weeks[n]["widgets"] if w])) + " 個工具" if any(weeks[n]["widgets"]) else "", str(weeks[n]["slidesN"]) + " 張投影片"] if x)}</span>'
            f'<span class="wp" data-pct="{n}"></span></a>' for n in ws if n in weeks)
        rows += f'<section class="unit"><h3>{unit}</h3><div class="wks">{items}</div></section>'
    js = rd('rwd_prelude.js').replace("const CH=JSON.parse(document.getElementById('chData').textContent);", 'const CH={id:0};') + widget_js(['decide5']) + rd('rwd_home.js')
    html = ('<!doctype html>\n<html lang="zh-Hant">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<title>真實世界運動大數據分析專題討論</title>\n' + FONTS + '<style>' + CSS + '</style>\n' +
            rd('rwd_home.html').replace('<!--WEEKS-->', rows) + '\n<script>(function(){\n' + js + '\n})();</script>\n</html>\n')
    open(f'{OUT}/index.html', 'w', encoding='utf-8').write(html)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    open(OUT + '/.nojekyll', 'w').close()
    weeks = {n: build_week(n) for n in WEEKS}
    home(weeks)
    tot = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(OUT) for f in fs)
    print('built', len(weeks), 'weeks; MB', round(tot / 1e6, 1))
