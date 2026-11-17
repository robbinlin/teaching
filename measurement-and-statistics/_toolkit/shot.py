"""用無頭瀏覽器開啟建好的頁面並截圖，同時回報 console 錯誤與載入失敗的工具。
  python -X utf8 shot.py <輸出資料夾> <章號|home> [階段=learn|slides|spss|quiz|homework] [--mobile] [--js "要先執行的 JS"] [--clip 選擇器]
截圖存到 <輸出資料夾>/_shots/chN_<階段>[_m][_標籤].jpg（--tag 標籤）。整頁長截圖；用 Read 工具看圖。
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

a = sys.argv[1:]
opt = lambda k: a[a.index(k) + 1] if k in a else None
out = Path(a[0]).resolve()
ch = a[1]
stage = a[2] if len(a) > 2 and not a[2].startswith('--') else 'learn'
mobile = '--mobile' in a
url = (out / 'index.html').as_uri() if ch == 'home' else (out / ('ch%s' % ch) / 'index.html').as_uri() + '#' + stage
(out / '_shots').mkdir(exist_ok=True)
name = ('home' if ch == 'home' else 'ch%s_%s' % (ch, stage)) + ('_m' if mobile else '') + ('_' + opt('--tag') if opt('--tag') else '') + '.jpg'
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 390, 'height': 844} if mobile else {'width': 1280, 'height': 900}, device_scale_factor=1)
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    pg.goto(url)
    pg.wait_for_timeout(1200)
    if opt('--js'):
        r = pg.evaluate(opt('--js'))
        if r is not None:
            print('JS 回傳：', r)
        pg.wait_for_timeout(500)
    fails = pg.evaluate("[...document.querySelectorAll('.widget')].filter(w=>/載入失敗/.test(w.textContent)).map(w=>w.id)")
    empty = pg.evaluate("[...document.querySelectorAll('.widget')].filter(w=>!w.children.length).map(w=>w.id)")
    over = pg.evaluate("document.documentElement.scrollWidth>document.documentElement.clientWidth+2")
    if opt('--clip'):
        pg.locator(opt('--clip')).first.screenshot(path=str(out / '_shots' / name), type='jpeg', quality=80)
    else:
        pg.screenshot(path=str(out / '_shots' / name), full_page=True, type='jpeg', quality=70)
    b.close()
print('截圖：', out / '_shots' / name)
print('console 錯誤：', [e for e in errs if 'fonts.g' not in e and 'ERR_INTERNET' not in e] or '無')
print('載入失敗的工具：', fails or '無', '；空白的工具：', empty or '無', '；水平捲動溢出：', over)
