"""Build the YouTube upload package for one RWD episode.

Usage (from animations/):  python youtube/make_rwd_package.py youtube/package_rwd/meta_w07.json
meta json: {"key": "rw07e1", "week": 7, "week_title": "探索式資料分析與視覺化", "ep_title": "一張圖怎樣算誠實",
            "summary": "一到兩句話", "labels": ["每個場景的章節名稱（<=14 字）", ...], "points": ["本集重點", ...],
            "sources": ["資料來源", ...], "tags": ["額外標籤", ...], "thumb_t": 120}
Needs voice/ep<key>_timeline.js and out/preview/ep<key>v_<thumb_t>.00.jpg (make it with: node render.cjs preview <key>v <thumb_t>).
All text files are written as UTF-8 with BOM and CRLF.
"""
import json, os, re, subprocess, sys
from PIL import Image

meta = json.load(open(sys.argv[1], encoding='utf-8'))
key, wk = meta['key'], meta['week']
here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # animations/
out = os.path.join(here, 'youtube', 'package_rwd', f'{wk:02d}_w{wk:02d}_ep1')
os.makedirs(out, exist_ok=True)

tl = json.loads(re.sub(r'^[^=]*=\s*', '', open(os.path.join(here, 'voice', f'ep{key}_timeline.js'), encoding='utf-8').read()).rstrip().rstrip(';'))
assert len(meta['labels']) == len(tl['scenes']), 'labels must have one entry per scene'
chapters = []
for s, lab in zip(tl['scenes'], meta['labels']):
    t = int(s['t0'])
    chapters.append(f'{t // 60}:{t % 60:02d} {lab}')
assert chapters[0].startswith('0:00') and len(chapters) >= 3

title = f"{meta['ep_title']}｜真實世界運動大數據分析 第 {wk} 週 {meta['week_title']}"
assert len(title) <= 100, 'YouTube title limit is 100 characters'
nl = '\n'
desc = f"""{meta['summary']}

課程：真實世界運動大數據分析專題討論（國立體育大學　林彥光老師）
第 {wk} 週　{meta['week_title']}　EP1
課程網站：https://robbinlin.github.io/teaching/real-world-sports-data/w{wk:02d}/

章節
{nl.join(chapters)}

本集重點
{nl.join('・' + p for p in meta['points'])}

資料來源
{nl.join('・' + p for p in meta['sources'])}

製作說明：動畫以程式繪製，旁白為語音合成。
#資料分析 #運動大數據 #統計學"""
tags = ','.join(['真實世界運動大數據分析', '資料分析', '統計學', '運動科學', 'AI 資料分析', '林彥光'] + meta.get('tags', []))
video = f'RWD_W{wk:02d}_EP1_720p.mp4'
vf = f'影片檔：{video}\n建議設定：不公開、教育類、語言 中文（台灣）、非兒童內容\n字幕：subtitle_zh-TW.srt\n縮圖：thumbnail.jpg'

def w(name, text):
    open(os.path.join(out, name), 'wb').write(b'\xef\xbb\xbf' + text.replace('\r\n', '\n').replace('\n', '\r\n').encode('utf-8'))

w('title.txt', title); w('description.txt', desc); w('tags.txt', tags); w('video_file.txt', vf)

def ts(s):
    return f'{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round((s % 1) * 1000)) % 1000:03d}'
cues, n = [], 0
for sc in tl['scenes']:
    for l in sc['lines']:
        n += 1
        cues.append(f"{n}\n{ts(sc['t0'] + l['t0'])} --> {ts(sc['t0'] + l['t1'] + 0.3)}\n{l['disp']}\n")
w('subtitle_zh-TW.srt', '\n'.join(cues))

frame = os.path.join(here, 'out', 'preview', f"ep{key}v_{float(meta['thumb_t']):.2f}.jpg")
Image.open(frame).resize((1280, 720), Image.LANCZOS).save(os.path.join(out, 'thumbnail.jpg'), quality=88)

# site snippet: the "videos" entry for gen/content/wNN.json (YouTube id filled in after upload)
site = {"k": "ep1", "id": "", "t": f"EP1 {meta['ep_title']}", "d": meta['summary'],
        "c": [[c.split(' ', 1)[0], c.split(' ', 1)[1]] for c in chapters]}
json.dump(site, open(os.path.join(out, 'site_videos_entry.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('package ->', out, '| cues', n, '| title', len(title), 'chars')
