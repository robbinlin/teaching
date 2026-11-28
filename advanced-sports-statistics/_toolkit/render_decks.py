"""Make a render-only copy of a lecture deck so LibreOffice 24 (Linux, no Microsoft fonts) draws it
close to PowerPoint. The copy is only used to produce slide JPGs / PDF; students download the original pptx.

usage: python3 -I render_decks.py in.pptx out.pptx [line-spacing-scale=0.87] [smartart drawings to whiten]

What it changes in the copy:
  * Wingdings / Wingdings 3 bullets and arrows -> Unicode (no Wingdings font on Linux)
  * line spacing x0.87 (Noto Sans CJK is taller than Microsoft JhengHei UI), table rows capped so they keep
    the deck's row heights; auto-height tables squeezed a little more
  * mc:AlternateContent (Office equations) -> PowerPoint's own fallback picture as a plain <p:pic>
    (LibreOffice 24 draws neither the equation nor a picture-filled placeholder)
  * placeholders filled with a picture and holding no text -> <p:pic> (same limitation)
  * fallback pictures rendered white-on-transparent under the old dark theme -> recoloured to #243746
  * named SmartArt drawing caches: uncoloured text made white (PowerPoint shows it white on the dark boxes)

Full pipeline used for the 2026-11 unified-style decks (fonts: apt install fonts-noto-cjk fonts-crosextra-carlito
fonts-crosextra-caladea, plus a fontconfig alias Microsoft JhengHei UI -> Noto Sans CJK TC):
  for c in 1..8: python3 -I render_decks.py chC.pptx fix/chC.pptx   (ch8: add 0.87 ppt/diagrams/drawing1.xml)
  soffice --headless --convert-to pdf --outdir pdf fix/ch*.pptx
  pdftoppm -jpeg -jpegopt quality=85 -scale-to-x 1280 -scale-to-y 960 pdf/chC.pdf img/chC/p   -> chC/slides/s-NN.jpg
  Chapter 1 hides slides 2-4 (Line QR code, contents, grading) on the site and in its downloads.
Always look at a contact sheet of every chapter afterwards."""
import re, sys, zipfile

src, dst = sys.argv[1], sys.argv[2]
SCALE = float(sys.argv[3]) if len(sys.argv) > 3 else 0.87
# SmartArt drawings whose uncoloured text sits on dark boxes (PowerPoint shows it white; LibreOffice 24 dark)
WHITE_DRAWINGS = set(sys.argv[4].split(',')) if len(sys.argv) > 4 and sys.argv[4] else set()

SYM = {'': '→', '': '➔', '': '➢', '': '✓', '': '●', '': '▪',
       '': '■', '': '◆', '': '◇', '': '❖', '': '–', '': '▸'}
BU = {('Wingdings', 'l'): '●', ('Wingdings', 'ü'): '✓', ('Wingdings', 'n'): '■', ('Wingdings', 'q'): '❑',
      ('Wingdings', 'Ø'): '➢', ('Wingdings', '§'): '▪', ('Wingdings', 'v'): '❖', ('Wingdings', 'à'): '→',
      ('Wingdings 3', '}'): '▸', ('Wingdings 3', 'u'): '▸', ('Wingdings 2', '\u0097'): '•'}


def fix_bullets(x):
    def rep(m):
        font, ch = m.group(1), m.group(3)
        u = BU.get((font, ch)) or SYM.get(ch) or '•'
        return f'<a:buFont typeface="Arial"/><a:buChar char="{u}"/>'
    return re.sub(r'<a:buFont typeface="(Wingdings[^"]*)"([^>]*)/>\s*<a:buChar char="([^"]+)"\s*/>', rep, x)


def fix_runs(x):
    def rep(m):
        r = m.group(0)
        if 'Wingdings' not in r:
            return r
        r = re.sub(r'<a:sym typeface="Wingdings[^"]*"[^>]*/>', '', r)
        r = re.sub(r'(<a:(?:latin|ea|cs) typeface=")Wingdings[^"]*(")', r'\1Arial\2', r)
        return re.sub(r'<a:t>(.*?)</a:t>', lambda t: '<a:t>' + ''.join(SYM.get(c, c) for c in t.group(1)) + '</a:t>', r, flags=re.S)
    x = re.sub(r'<a:r>.*?</a:r>', rep, x, flags=re.S)
    return ''.join(SYM.get(c, c) for c in x)


def layout_xfrm(z, slide_name, sp):
    """xfrm for a placeholder that inherits its position: look it up in the slide layout, then the master"""
    ph = re.search(r'<p:ph\b([^>]*)/?>', sp)
    if not ph:
        return None
    idx = re.search(r'idx="(\d+)"', ph.group(1)); typ = re.search(r'type="(\w+)"', ph.group(1))
    rels = z.read(slide_name.replace('slides/', 'slides/_rels/') + '.rels').decode('utf-8')
    lay = re.search(r'Target="\.\./slideLayouts/(slideLayout\d+\.xml)"', rels)
    chain = []
    if lay:
        ln = 'ppt/slideLayouts/' + lay.group(1); chain.append(ln)
        lr = z.read(ln.replace('slideLayouts/', 'slideLayouts/_rels/') + '.rels').decode('utf-8')
        ms = re.search(r'Target="\.\./slideMasters/(slideMaster\d+\.xml)"', lr)
        if ms:
            chain.append('ppt/slideMasters/' + ms.group(1))
    for part in chain:
        x = z.read(part).decode('utf-8')
        for cand in re.findall(r'<p:sp>.*?</p:sp>', x, re.S):
            cph = re.search(r'<p:ph\b([^>]*)/?>', cand)
            if not cph:
                continue
            ok = (idx and re.search(rf'idx="{idx.group(1)}"', cph.group(1))) or (typ and re.search(rf'type="{typ.group(1)}"', cph.group(1)))
            if part.startswith('ppt/slideMasters') and not ok:
                ok = not typ and 'type="body"' in cph.group(1)
            xf = re.search(r'<a:xfrm[^>]*>.*?</a:xfrm>', cand, re.S)
            if ok and xf:
                return xf.group(0)
    return None


def _sp_to_pic(sp, xfrm_default=None):
    """fallback <p:sp> whose picture is a blipFill -> plain <p:pic> (LibreOffice 24 ignores blipFill on placeholders)"""
    blip = re.search(r'<a:blipFill[^>]*>(.*?)</a:blipFill>', sp, re.S)
    xfrm = re.search(r'<a:xfrm[^>]*>.*?</a:xfrm>', sp, re.S)
    xfrm = xfrm.group(0) if xfrm else xfrm_default
    if not blip or not xfrm:
        return sp
    cid = re.search(r'<p:cNvPr id="(\d+)" name="([^"]*)"', sp)
    i, nm = (cid.group(1), cid.group(2)) if cid else ('9000', 'fallback')
    return (f'<p:pic><p:nvPicPr><p:cNvPr id="{i}" name="{nm}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>'
            f'<p:blipFill>{blip.group(1)}</p:blipFill><p:spPr>{xfrm}<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>')


def unwrap_alternate(x):
    def rep(m):
        s = m.group(0)
        if 'Requires="p14"' in s or '<p:transition' in s:
            return s
        fb = re.search(r'<mc:Fallback[^>]*>(.*?)</mc:Fallback>', s, re.S)
        if not fb:
            return s
        inner = fb.group(1)
        return re.sub(r'<p:sp>.*?</p:sp>', lambda t: _sp_to_pic(t.group(0)), inner, flags=re.S)
    return re.sub(r'<mc:AlternateContent\b.*?</mc:AlternateContent>', rep, x, flags=re.S)


def ph_blip_to_pic(x, z=None, name=None):
    """placeholder <p:sp> filled with a picture and holding no text -> <p:pic> (same LibreOffice 24 limitation)"""
    def rep(m):
        sp = m.group(0)
        if '<p:ph' in sp and re.search(r'<p:spPr>.*?<a:blipFill', sp, re.S) and not re.search(r'<a:t>[^<]*\S', sp):
            return _sp_to_pic(sp, layout_xfrm(z, name, sp) if z else None)
        return sp
    return re.sub(r'<p:sp>.*?</p:sp>', rep, x, flags=re.S)


def table_margins(x):
    # tighten default cell insets (0.05in) so auto-height rows rendered with Noto stay close to PowerPoint's height
    def cell(m):
        t = m.group(0)
        if 'marT=' in t:
            return t
        return t.replace('<a:tcPr', '<a:tcPr marT="18288" marB="18288"', 1)
    x = re.sub(r'<a:tcPr\b[^>]*/?>', cell, x)

    # auto-height tables (every row h="0"): PowerPoint packs them tightly; squeeze harder
    def auto_tbl(t):
        tb = t.group(0)
        hs = re.findall(r'<a:tr h="(\d+)"', tb)
        if not hs or any(h != '0' for h in hs):
            return tb
        tb = re.sub(r'<a:spcPct val="(\d+)"/>', lambda m: f'<a:spcPct val="{min(int(m.group(1)), 72000)}"/>', tb)
        return tb.replace('marT="18288" marB="18288"', 'marT="0" marB="0"')
    return re.sub(r'<a:tbl>.*?</a:tbl>', auto_tbl, x, flags=re.S)


def smartart_white(x):
    """diagram drawing cache: runs with no explicit colour inherit the shape's fontRef (lt1 = white in PowerPoint);
    LibreOffice 24 renders them dark, so make the white explicit"""
    def sp(m):
        s = m.group(0)
        if '<dsp:txBody' not in s:
            return s
        def rpr(r):
            tag = r.group(0)
            if tag.endswith('/>'):
                return tag[:-2] + '><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></a:rPr>'
            return tag
        s = re.sub(r'<a:rPr\b[^>]*/>', rpr, s)
        s = re.sub(r'(<a:rPr\b[^>]*[^/]>)(?!<a:ln|<a:solidFill|<a:noFill|<a:gradFill)', r'\1<a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>', s)
        return s
    return re.sub(r'<dsp:sp\b.*?</dsp:sp>', sp, x, flags=re.S)


def scale_spacing(x):
    # existing percentage line spacing
    x = re.sub(r'<a:lnSpc><a:spcPct val="(\d+)"\s*/></a:lnSpc>',
               lambda m: f'<a:lnSpc><a:spcPct val="{int(int(m.group(1)) * SCALE)}"/></a:lnSpc>', x)

    # paragraphs without lnSpc: add one as first child of pPr (schema order: lnSpc first)
    def ppr(m):
        tag = m.group(0)
        if tag.endswith('/>'):
            return tag[:-2] + f'><a:lnSpc><a:spcPct val="{int(100000 * SCALE)}"/></a:lnSpc></a:pPr>'
        return tag + f'<a:lnSpc><a:spcPct val="{int(100000 * SCALE)}"/></a:lnSpc>'

    out, i = [], 0
    for m in re.finditer(r'<a:pPr\b[^>]*?/?>', x):
        out.append(x[i:m.start()])
        rest = x[m.end():m.end() + 20]
        tag = m.group(0)
        out.append(tag if (not tag.endswith('/>') and rest.startswith('<a:lnSpc>')) else ppr(m))
        i = m.end()
    out.append(x[i:])
    x = ''.join(out)
    # paragraphs with no pPr at all
    x = re.sub(r'<a:p>(?!<a:pPr)', f'<a:p><a:pPr><a:lnSpc><a:spcPct val="{int(100000 * SCALE)}"/></a:lnSpc></a:pPr>', x)
    # table cells: rows have a fixed minimum height in the deck; cap line spacing so rows are not stretched
    cap = int(100000 * SCALE)
    x = re.sub(r'<a:tbl>.*?</a:tbl>',
               lambda t: re.sub(r'<a:spcPct val="(\d+)"/>', lambda m: f'<a:spcPct val="{min(int(m.group(1)), cap)}"/>', t.group(0)),
               x, flags=re.S)
    return x


import io
import numpy as np
from PIL import Image


def light_fallbacks(z):
    """images used inside mc:Fallback whose ink is (near) white: old dark-theme renders"""
    hits = set()
    for n in z.namelist():
        m = re.match(r'ppt/slides/slide(\d+)\.xml$', n)
        if not m:
            continue
        x = z.read(n).decode('utf-8')
        rels = z.read(f'ppt/slides/_rels/slide{m.group(1)}.xml.rels').decode('utf-8')
        rid = {}
        for rel in re.findall(r'<Relationship [^>]*/>', rels):
            i = re.search(r'Id="([^"]+)"', rel); t = re.search(r'Target="([^"]+)"', rel)
            if i and t:
                rid[i.group(1)] = 'ppt/' + t.group(1).replace('../', '')
        for fb in re.findall(r'<mc:Fallback[^>]*>(.*?)</mc:Fallback>', x, re.S):
            for r in re.findall(r'r:embed="(rId\d+)"', fb):
                path = rid.get(r)
                if not path or not path.lower().endswith('.png'):
                    continue
                a = np.array(Image.open(io.BytesIO(z.read(path))).convert('RGBA'))
                op = a[..., 3] > 40
                if op.any() and a[..., :3][op].mean() > 200 and (a[..., 3] < 40).mean() > 0.5:
                    hits.add(path)
    return hits


def recolor(data, rgb=(0x24, 0x37, 0x46)):
    a = np.array(Image.open(io.BytesIO(data)).convert('RGBA'))
    light = a[..., :3].min(axis=2) > 170          # white / near-white ink only; keep coloured highlights
    for k in range(3):
        a[..., k][light] = rgb[k]
    buf = io.BytesIO(); Image.fromarray(a).save(buf, 'PNG'); return buf.getvalue()


class _Mem:
    """whole archive in memory (re-reading members mid-loop hit 'Bad magic number' on these decks)"""
    def __init__(self, path):
        z = zipfile.ZipFile(path)
        self.infos = z.infolist()
        self.data = {i.filename: z.read(i.filename) for i in self.infos}
        z.close()

    def namelist(self):
        return [i.filename for i in self.infos]

    def infolist(self):
        return self.infos

    def read(self, name):
        return self.data[name]


zin = _Mem(src)
LIGHT = light_fallbacks(zin)
print('recolor', sorted(LIGHT))
zout = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
for item in zin.infolist():
    data = zin.read(item.filename)
    n = item.filename
    if n.endswith('.xml') and (n.startswith('ppt/slides/slide') or n.startswith('ppt/slideLayouts/') or n.startswith('ppt/slideMasters/')):
        x = data.decode('utf-8')
        x = fix_bullets(x)
        x = fix_runs(x)
        if n.startswith('ppt/slides/slide'):
            x = unwrap_alternate(x)
            x = ph_blip_to_pic(x, zin, n)
            x = scale_spacing(x)
            x = table_margins(x)
        data = x.encode('utf-8')
    if n in WHITE_DRAWINGS:
        data = smartart_white(data.decode('utf-8')).encode('utf-8')
    if n in LIGHT:
        data = recolor(data)
    zout.writestr(item, data)
zout.close()
