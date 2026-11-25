"""把 Tripo 匯出的高面數 GLB 壓成網頁可用的小檔（頂點分群減面＋貼圖縮小）。
用法: python -I glb_slim.py in.glb out.glb [grid=70] [tex=1024]"""
import json, struct, sys, io
import numpy as np
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
grid = int(sys.argv[3]) if len(sys.argv) > 3 else 70
TEX = int(sys.argv[4]) if len(sys.argv) > 4 else 1024
b = open(src, 'rb').read()
n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n])
bin0 = b[20 + n + 8:]
def view(i): v = j['bufferViews'][i]; o = v.get('byteOffset', 0); return bin0[o:o + v['byteLength']]
def acc(i, dt, w): a = j['accessors'][i]; return np.frombuffer(view(a['bufferView']), dt, a['count'] * w, a.get('byteOffset', 0)).reshape(-1, w)
p = j['meshes'][0]['primitives'][0]; at = p['attributes']
pos = acc(at['POSITION'], np.float32, 3).astype(np.float64); nor = acc(at['NORMAL'], np.float32, 3).astype(np.float64)
uv = acc(at['TEXCOORD_0'], np.float32, 2).astype(np.float64); idx = acc(p['indices'], np.uint32, 1).ravel()
mn, mx = pos.min(0), pos.max(0); cell = (mx - mn).max() / grid
q = np.floor((pos - mn) / cell).astype(np.int64)
uq = np.floor(uv * 48).astype(np.int64)            # 不同 UV 區塊不合併，避免貼圖接縫糊掉
nq = np.argmax(np.abs(nor), 1) * 2 + (np.take_along_axis(nor, np.argmax(np.abs(nor), 1)[:, None], 1).ravel() > 0)  # 正反面不合併
skey = (q[:, 0] * 4096 + q[:, 1]) * 4096 + q[:, 2]          # 位置只看空間格，同一格共用同一個位置（不會裂開）
_, sinv, scnt = np.unique(skey, return_inverse=True, return_counts=True)
SP = np.zeros((len(scnt), 3)); np.add.at(SP, sinv, pos); SP /= scnt[:, None]
key = (skey * 8 + nq) * 16384 + (uq[:, 0] % 128) * 128 + (uq[:, 1] % 128)   # UV 與法線另外分群
_, first, inv, cnt = np.unique(key, return_index=True, return_inverse=True, return_counts=True)
m = len(cnt)
def avg(a):
    o = np.zeros((m, a.shape[1])); np.add.at(o, inv, a); return o / cnt[:, None]
P, U, N = SP[sinv[first]], avg(uv), avg(nor); N /= np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-9)
t = inv[idx].reshape(-1, 3)
t = t[(t[:, 0] != t[:, 1]) & (t[:, 1] != t[:, 2]) & (t[:, 0] != t[:, 2])]
pk = sinv[first][t]; t = t[(pk[:, 0] != pk[:, 1]) & (pk[:, 1] != pk[:, 2]) & (pk[:, 0] != pk[:, 2])]
t = t[np.unique(np.sort(t, 1), axis=0, return_index=True)[1]]
used = np.unique(t); remap = np.full(m, -1); remap[used] = np.arange(len(used)); t = remap[t]; P, U, N = P[used], U[used], N[used]
def img(i, size, qy):
    im = Image.open(io.BytesIO(view(j['images'][i]['bufferView']))).convert('RGB'); im.thumbnail((size, size), Image.LANCZOS)
    o = io.BytesIO(); im.save(o, 'JPEG', quality=qy, optimize=True); return o.getvalue()
mat = j['materials'][0]; tx = lambda ti: j['textures'][ti]['source']
blobs = [P.astype('<f4').tobytes(), N.astype('<f4').tobytes(), U.astype('<f4').tobytes(), t.astype('<u4').tobytes(),
         img(tx(mat['pbrMetallicRoughness']['baseColorTexture']['index']), TEX, 82),
         img(tx(mat['normalTexture']['index']), TEX, 80),
         img(tx(mat['pbrMetallicRoughness']['metallicRoughnessTexture']['index']), TEX // 2, 78)]
views, off, body = [], 0, b''
for x in blobs:
    views.append({'buffer': 0, 'byteOffset': off, 'byteLength': len(x)}); x += b'\0' * (-len(x) % 4); body += x; off += len(x)
g = {'asset': {'version': '2.0', 'generator': 'Tripo + glb_slim'}, 'scene': 0, 'scenes': [{'nodes': [0]}], 'nodes': [{'mesh': 0}],
     'meshes': [{'primitives': [{'attributes': {'POSITION': 0, 'NORMAL': 1, 'TEXCOORD_0': 2}, 'indices': 3, 'material': 0}]}],
     'materials': [{'pbrMetallicRoughness': {'baseColorTexture': {'index': 0}, 'metallicRoughnessTexture': {'index': 2}}, 'normalTexture': {'index': 1}}],
     'textures': [{'source': 0, 'sampler': 0}, {'source': 1, 'sampler': 0}, {'source': 2, 'sampler': 0}], 'samplers': [{'magFilter': 9729, 'minFilter': 9987}],
     'images': [{'bufferView': 4, 'mimeType': 'image/jpeg'}, {'bufferView': 5, 'mimeType': 'image/jpeg'}, {'bufferView': 6, 'mimeType': 'image/jpeg'}],
     'accessors': [{'bufferView': 0, 'componentType': 5126, 'count': len(P), 'type': 'VEC3', 'min': P.min(0).tolist(), 'max': P.max(0).tolist()},
                   {'bufferView': 1, 'componentType': 5126, 'count': len(P), 'type': 'VEC3'}, {'bufferView': 2, 'componentType': 5126, 'count': len(P), 'type': 'VEC2'},
                   {'bufferView': 3, 'componentType': 5125, 'count': t.size, 'type': 'SCALAR'}],
     'bufferViews': views, 'buffers': [{'byteLength': len(body)}]}
js = json.dumps(g, separators=(',', ':')).encode(); js += b' ' * (-len(js) % 4)
out = b'glTF' + struct.pack('<II', 2, 12 + 8 + len(js) + 8 + len(body)) + struct.pack('<I', len(js)) + b'JSON' + js + struct.pack('<I', len(body)) + b'BIN\0' + body
open(dst, 'wb').write(out)
print(f'tris {len(idx)//3} -> {len(t)}, verts {len(pos)} -> {len(P)}, bytes {len(b)} -> {len(out)}')
