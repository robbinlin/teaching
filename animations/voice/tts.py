"""用 sherpa-onnx + Kokoro v1.1-zh 離線合成旁白，並依旁白長度排出場景時間軸。

用法：python3 -I voice/tts.py <ep> <kokoro 模型資料夾>
輸出：voice/ep<ep>_voice.wav（整條旁白音軌）、voice/ep<ep>_timeline.js（場景與字幕時間）
"""
import json, sys, wave
from pathlib import Path
import numpy as np
import sherpa_onnx

ep, mdir = sys.argv[1], Path(sys.argv[2])
here = Path(__file__).resolve().parent
spec = json.loads((here / f'ep{ep}_lines.json').read_text())

m = str(mdir) + '/'
cfg = sherpa_onnx.OfflineTtsConfig(
    model=sherpa_onnx.OfflineTtsModelConfig(
        kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
            model=m + 'model.onnx', voices=m + 'voices.bin', tokens=m + 'tokens.txt',
            data_dir=m + 'espeak-ng-data', dict_dir=m + 'dict',
            lexicon=m + 'lexicon-us-en.txt,' + m + 'lexicon-zh.txt'),
        num_threads=4),
    rule_fsts=m + 'phone-zh.fst,' + m + 'date-zh.fst,' + m + 'number-zh.fst')
tts = sherpa_onnx.OfflineTts(cfg)

LEAD_FIRST, LEAD, GAP, TAIL, TAIL_LAST = 1.0, .6, .45, .9, 4.0
sr = None
track, scenes, t = [], [], 0.0

def trim(x, thr=.008):
    idx = np.where(np.abs(x) > thr)[0]
    return x[max(0, idx[0] - 200): idx[-1] + 400] if len(idx) else x

for si, lines in enumerate(spec['scenes']):
    s0 = t
    t += LEAD_FIRST if si == 0 else LEAD
    out = []
    for li, ln in enumerate(lines):
        a = tts.generate(ln['say'], sid=spec['voice_sid'], speed=spec['speed'])
        sr = a.sample_rate
        x = trim(np.array(a.samples, dtype=np.float32))
        d = len(x) / sr
        out.append({'t0': round(t - s0, 3), 't1': round(t - s0 + d, 3), 'disp': ln['disp'], 'say': ln['say']})
        track.append((t, x))
        t += d + (GAP if li < len(lines) - 1 else 0)
    t += TAIL_LAST if si == len(spec['scenes']) - 1 else TAIL
    scenes.append({'t0': round(s0, 3), 't1': round(t, 3), 'lines': out})

dur = round(t, 3)
buf = np.zeros(int(dur * sr) + 1, dtype=np.float32)
for st, x in track:
    i = int(st * sr); buf[i:i + len(x)] += x
peak = np.abs(buf).max() or 1
buf = buf / peak * .89
with wave.open(str(here / f'ep{ep}_voice.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((buf * 32767).astype('<i2').tobytes())
(here / f'ep{ep}_timeline.js').write_text(
    f'TIMELINES[{json.dumps(str(ep))}] = ' + json.dumps({'dur': dur, 'scenes': scenes}, ensure_ascii=False, indent=1) + ';\n')
print('duration', dur)
for s in scenes: print(s['t0'], s['t1'], [l['t1'] - l['t0'] for l in s['lines']])
