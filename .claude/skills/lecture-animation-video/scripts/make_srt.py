"""由 timeline 產生 SRT（UTF-8 BOM + CRLF）：python3 -I make_srt.py voice/ep<key>_timeline.js out.srt"""
import json, re, sys
tl = json.loads(re.sub(r'^[^=]*=\s*', '', open(sys.argv[1], encoding='utf-8').read()).rstrip().rstrip(';'))
def ts(s): h = int(s // 3600); m = int(s % 3600 // 60); x = s % 60; return f'{h:02d}:{m:02d}:{int(x):02d},{int(round((x - int(x)) * 1000)):03d}'
out, n = [], 0
for sc in tl['scenes']:
    for l in sc['lines']:
        n += 1; a = sc['t0'] + l['t0']; b = sc['t0'] + l['t1'] + 0.3
        out.append(f'{n}\r\n{ts(a)} --> {ts(b)}\r\n{l["disp"]}\r\n\r\n')
open(sys.argv[2], 'wb').write(b'\xef\xbb\xbf' + ''.join(out).encode('utf-8'))
print(n, 'cues ->', sys.argv[2])
