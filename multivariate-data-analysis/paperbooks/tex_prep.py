"""把無縫貼圖原圖處理成書庫用的貼圖：縮成 1024 的顏色圖，並從明暗算出 512 的法線圖（凹凸感）。
用法: C:/Users/user/.venvs/meshtools/Scripts/python.exe tex_prep.py 原圖 名稱 [強度=2.0]  → assets/tex_名稱.jpg, assets/tex_名稱_n.jpg"""
import sys, numpy as np
from PIL import Image, ImageFilter
src, name = sys.argv[1], sys.argv[2]; k = float(sys.argv[3]) if len(sys.argv) > 3 else 2.0
im = Image.open(src).convert('RGB')
im.resize((1024, 1024), Image.LANCZOS).save(f'assets/tex_{name}.jpg', quality=84, optimize=True)
g = np.asarray(im.resize((512, 512), Image.LANCZOS).convert('L').filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float64) / 255
dx = (np.roll(g, -1, 1) - np.roll(g, 1, 1)) * k; dy = (np.roll(g, -1, 0) - np.roll(g, 1, 0)) * k   # wrap-around keeps it tileable
n = np.dstack([-dx, dy, np.ones_like(g) * 0.25]); n /= np.linalg.norm(n, axis=2, keepdims=True)
Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8)).save(f'assets/tex_{name}_n.jpg', quality=82, optimize=True)
t = Image.new('RGB', (1024, 1024)); s = im.resize((512, 512)); [t.paste(s, (x, y)) for x in (0, 512) for y in (0, 512)]; t.save(sys.argv[4]) if len(sys.argv) > 4 else None
