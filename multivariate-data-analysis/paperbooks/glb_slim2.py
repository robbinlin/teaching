"""把 Tripo 匯出的高面數 GLB 壓成網頁可用的小檔：pymeshlab 保留貼圖的邊收縮減面＋貼圖縮小。
用法（需用裝了 pymeshlab 的環境）:
  C:/Users/user/.venvs/meshtools/Scripts/python.exe glb_slim2.py in.glb out.glb [目標面數=12000] [貼圖=1024]"""
import json, struct, sys, io
import numpy as np, pymeshlab
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
TARGET = int(sys.argv[3]) if len(sys.argv) > 3 else 12000
TEX = int(sys.argv[4]) if len(sys.argv) > 4 else 1024
b = open(src, 'rb').read()
n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n]); bin0 = b[20 + n + 8:]
def view(i): v = j['bufferViews'][i]; o = v.get('byteOffset', 0); return bin0[o:o + v['byteLength']]
def acc(i, dt, w): a = j['accessors'][i]; return np.frombuffer(view(a['bufferView']), dt, a['count'] * w, a.get('byteOffset', 0)).reshape(-1, w)
p = j['meshes'][0]['primitives'][0]; at = p['attributes']
pos = acc(at['POSITION'], np.float32, 3).astype(np.float64); uv = acc(at['TEXCOORD_0'], np.float32, 2).astype(np.float64)
idx = acc(p['indices'], np.uint32, 1).ravel().astype(np.int64)
# weld identical positions; keep UVs per face corner (wedge) so seams survive
upos, inv = np.unique(np.round(pos, 6), axis=0, return_inverse=True); inv = inv.ravel()
faces = inv[idx].reshape(-1, 3); wuv = uv[idx]
ok = (faces[:, 0] != faces[:, 1]) & (faces[:, 1] != faces[:, 2]) & (faces[:, 0] != faces[:, 2])
faces = faces[ok]; wuv = wuv.reshape(-1, 3, 2)[ok].reshape(-1, 2)
# pymeshlab needs a texture bound to the mesh, so go through a temporary OBJ+MTL
import tempfile, os
td = tempfile.mkdtemp(); obj = os.path.join(td, 'm.obj')
Image.new('RGB', (4, 4)).save(os.path.join(td, 't.png'))
open(os.path.join(td, 'm.mtl'), 'w').write('newmtl m' + chr(10) + 'map_Kd t.png' + chr(10))
uuv, uvinv = np.unique(np.round(wuv, 6), axis=0, return_inverse=True); uvinv = uvinv.ravel().reshape(-1, 3)
with open(obj, 'w') as f:
    f.write('mtllib m.mtl' + chr(10) + 'usemtl m' + chr(10))
    np.savetxt(f, upos, fmt='v %.6f %.6f %.6f'); np.savetxt(f, uuv, fmt='vt %.6f %.6f')
    np.savetxt(f, np.column_stack([faces[:, 0] + 1, uvinv[:, 0] + 1, faces[:, 1] + 1, uvinv[:, 1] + 1, faces[:, 2] + 1, uvinv[:, 2] + 1]), fmt='f %d/%d %d/%d %d/%d')
ms = pymeshlab.MeshSet(); ms.load_new_mesh(obj)
ms.meshing_decimation_quadric_edge_collapse_with_texture(targetfacenum=TARGET, qualitythr=0.5, extratcoordw=1.5, preserveboundary=True, optimalplacement=True, preservenormal=True)
m = ms.current_mesh(); V = m.vertex_matrix(); F = m.face_matrix().astype(np.int64); W = m.wedge_tex_coord_matrix()
# split vertices per (vertex, uv); smooth normals from welded positions
fn = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
vn = np.zeros_like(V); [np.add.at(vn, F[:, k], fn) for k in range(3)]; vn /= np.maximum(np.linalg.norm(vn, axis=1, keepdims=True), 1e-12)
corner = np.column_stack([F.ravel(), np.round(W, 5)])
uc, cinv = np.unique(corner, axis=0, return_inverse=True); cinv = cinv.ravel()
vi = uc[:, 0].astype(np.int64); P, N, U, t = V[vi], vn[vi], uc[:, 1:3], cinv.reshape(-1, 3)
def img(i, size, qy):
    im = Image.open(io.BytesIO(view(j['images'][i]['bufferView']))).convert('RGB'); im.thumbnail((size, size), Image.LANCZOS)
    o = io.BytesIO(); im.save(o, 'JPEG', quality=qy, optimize=True); return o.getvalue()
mat = j['materials'][0]; tx = lambda ti: j['textures'][ti]['source']
small = len(P) < 65536
blobs = [P.astype('<f4').tobytes(), N.astype('<f4').tobytes(), U.astype('<f4').tobytes(), t.astype('<u2' if small else '<u4').tobytes(),
         img(tx(mat['pbrMetallicRoughness']['baseColorTexture']['index']), TEX, 82), img(tx(mat['normalTexture']['index']), TEX, 80),
         img(tx(mat['pbrMetallicRoughness']['metallicRoughnessTexture']['index']), TEX // 2, 78)]
views, off, body = [], 0, b''
for x in blobs:
    views.append({'buffer': 0, 'byteOffset': off, 'byteLength': len(x)}); x += b'\0' * (-len(x) % 4); body += x; off += len(x)
g = {'asset': {'version': '2.0', 'generator': 'Tripo + glb_slim2'}, 'scene': 0, 'scenes': [{'nodes': [0]}], 'nodes': [{'mesh': 0}],
     'meshes': [{'primitives': [{'attributes': {'POSITION': 0, 'NORMAL': 1, 'TEXCOORD_0': 2}, 'indices': 3, 'material': 0}]}],
     'materials': [{'pbrMetallicRoughness': {'baseColorTexture': {'index': 0}, 'metallicRoughnessTexture': {'index': 2}}, 'normalTexture': {'index': 1}}],
     'textures': [{'source': 0, 'sampler': 0}, {'source': 1, 'sampler': 0}, {'source': 2, 'sampler': 0}], 'samplers': [{'magFilter': 9729, 'minFilter': 9987}],
     'images': [{'bufferView': 4, 'mimeType': 'image/jpeg'}, {'bufferView': 5, 'mimeType': 'image/jpeg'}, {'bufferView': 6, 'mimeType': 'image/jpeg'}],
     'accessors': [{'bufferView': 0, 'componentType': 5126, 'count': len(P), 'type': 'VEC3', 'min': P.min(0).tolist(), 'max': P.max(0).tolist()},
                   {'bufferView': 1, 'componentType': 5126, 'count': len(P), 'type': 'VEC3'}, {'bufferView': 2, 'componentType': 5126, 'count': len(P), 'type': 'VEC2'},
                   {'bufferView': 3, 'componentType': 5123 if small else 5125, 'count': t.size, 'type': 'SCALAR'}],
     'bufferViews': views, 'buffers': [{'byteLength': len(body)}]}
js = json.dumps(g, separators=(',', ':')).encode(); js += b' ' * (-len(js) % 4)
out = b'glTF' + struct.pack('<II', 2, 12 + 8 + len(js) + 8 + len(body)) + struct.pack('<I', len(js)) + b'JSON' + js + struct.pack('<I', len(body)) + b'BIN\0' + body
open(dst, 'wb').write(out)
print(f'tris {len(idx)//3} -> {len(t)}, verts {len(pos)} -> {len(P)}, bytes {len(b)} -> {len(out)}')
