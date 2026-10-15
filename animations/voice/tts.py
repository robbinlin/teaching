"""合成旁白，並依旁白長度排出場景時間軸。

用法：
  python3 -I voice/tts.py <ep> <kokoro 模型資料夾>   # 離線 Kokoro（sherpa-onnx）
  python3 -I voice/tts.py <ep> elevenlabs            # ElevenLabs API
    需要環境變數 ELEVENLABS_API_KEY；可選 ELEVENLABS_VOICE_ID（未設定時自動在語音庫找台灣口音男聲）
輸出：voice/ep<ep>_voice.wav（整條旁白音軌）、voice/ep<ep>_timeline.js（場景與字幕時間）
"""
import json, os, sys, wave, urllib.request, urllib.parse
from pathlib import Path
import numpy as np

ep, engine = sys.argv[1], sys.argv[2]
here = Path(__file__).resolve().parent
spec = json.loads((here / f'ep{ep}_lines.json').read_text())


class Kokoro:
    def __init__(self, mdir):
        import sherpa_onnx
        m = str(mdir) + '/'
        cfg = sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
                    model=m + 'model.onnx', voices=m + 'voices.bin', tokens=m + 'tokens.txt',
                    data_dir=m + 'espeak-ng-data', dict_dir=m + 'dict',
                    lexicon=m + 'lexicon-us-en.txt,' + m + 'lexicon-zh.txt'),
                num_threads=4),
            rule_fsts=m + 'phone-zh.fst,' + m + 'date-zh.fst,' + m + 'number-zh.fst')
        self.tts = sherpa_onnx.OfflineTts(cfg)

    def say(self, line):
        a = self.tts.generate(line['say'], sid=spec['voice_sid'], speed=spec['speed'])
        return np.array(a.samples, dtype=np.float32), a.sample_rate


class ElevenLabs:
    API = 'https://api.elevenlabs.io'

    def __init__(self):
        self.key = os.environ['ELEVENLABS_API_KEY']
        self.voice = os.environ.get('ELEVENLABS_VOICE_ID') or spec.get('elevenlabs_voice_id') or self.find_voice()
        self.model = spec.get('elevenlabs_model', 'eleven_multilingual_v2')
        self.prev = []
        print('ElevenLabs voice', self.voice, 'model', self.model)

    def req(self, path, body=None):
        r = urllib.request.Request(self.API + path, data=json.dumps(body).encode() if body else None,
                                   headers={'xi-api-key': self.key, 'Content-Type': 'application/json'})
        with urllib.request.urlopen(r, timeout=120) as f:
            return f.read()

    def find_voice(self):
        q = urllib.parse.urlencode({'language': 'zh', 'gender': 'male', 'age': 'young', 'page_size': 100})
        voices = json.loads(self.req('/v1/shared-voices?' + q))['voices']
        tw = [v for v in voices if 'taiwan' in json.dumps(v).lower()]
        pick = (tw or voices)[0]
        print('picked', pick.get('name'), pick.get('accent'), pick.get('description', '')[:80])
        return pick['voice_id']

    def say(self, line):
        # cache each sentence so one bad take can be redone by deleting its file in voice/cache/
        import hashlib
        text = line.get('say_el', line['disp'])
        cache = here / 'cache' / (hashlib.md5(f'{self.voice}|{self.model}|{text}'.encode()).hexdigest() + '.pcm')
        if cache.exists():
            return np.frombuffer(cache.read_bytes(), '<i2').astype(np.float32) / 32768, 24000
        cache.parent.mkdir(exist_ok=True)
        body = {'text': text, 'model_id': self.model}
        if self.model == 'eleven_v3':  # v3 takes only stability (0 / .5 / 1) and no request stitching
            body['voice_settings'] = {'stability': .5}
        else:
            body['voice_settings'] = {'stability': .5, 'similarity_boost': .75, 'style': .2, 'speed': spec.get('el_speed', .95)}
            body['previous_text'] = ''.join(self.prev[-2:])
        pcm = self.req(f'/v1/text-to-speech/{self.voice}?output_format=pcm_24000', body)
        cache.write_bytes(pcm)
        self.prev.append(body['text'])
        return np.frombuffer(pcm, '<i2').astype(np.float32) / 32768, 24000


tts = ElevenLabs() if engine == 'elevenlabs' else Kokoro(Path(engine))

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
        x, sr = tts.say(ln)
        x = trim(x)
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
