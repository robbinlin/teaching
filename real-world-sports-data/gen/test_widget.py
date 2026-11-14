"""Usage: python3 test_widget.py <name> [width]  -> shots/<name>_<width>.png, prints console errors.
Builds a one-widget page with the real prelude/helpers/CSS so a widget can be checked alone."""
import sys, os, json, re, subprocess, tempfile
G = os.path.dirname(os.path.abspath(__file__))
name = sys.argv[1]; width = int(sys.argv[2]) if len(sys.argv) > 2 else 1100
rd = lambda f: open(os.path.join(G, f), encoding='utf-8').read()
helpers = rd('widgets.js').split('/* ---------- CH1 widgets')[0]
old = {m: re.search(r'(W\.%s=\(.*?\n\};\n)' % m, rd('widgets.js'), re.S) for m in ['fwer', 'simpson', 'interact']}
wsrc = rd(f'widgets_rwd/{name}.js') if os.path.exists(os.path.join(G, f'widgets_rwd/{name}.js')) else old[name].group(1)
ch = {'id': 1, 'title': 't'}
html = ('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>' + rd('base.css') + rd('extra.css') +
        '</style><main class="wrap" style="padding-block:24px"><article class="concept"><div class="concept-text"><span class="num">概念</span><h3>測試</h3><p>測試文字</p></div><div class="widget" id="w0"></div></article></main>'
        f'<script type="application/json" id="chData">{json.dumps(ch)}</script><script>(function(){{' + rd('prelude.js') + helpers + wsrc +
        f"\nW['{name}'](document.getElementById('w0'),CH);}})();</script>")
p = os.path.join(G, 'shots', f'_{name}.html'); open(p, 'w', encoding='utf-8').write(html)
js = """
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:%d,height:900}});
const errs=[];pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto('file://%s');await pg.waitForTimeout(400);
const ov=await pg.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
await pg.screenshot({path:'%s',fullPage:true});console.log(JSON.stringify({errors:errs,horizontalOverflow:ov}));await b.close();})();
""" % (width, p, os.path.join(G, 'shots', f'{name}_{width}.png'))
f = os.path.join(G, 'shots', f'_{name}.cjs'); open(f, 'w').write(js)
print(subprocess.run(['node', f], capture_output=True, text=True, cwd=G).stdout or 'node failed')
