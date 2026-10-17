"""檢查旁白稿：python3 -I lint_lines.py voice/ep<key>_lines.json
抓出 say/say_el 裡的拉丁字母、阿拉伯數字、過長句、場景為空。這些會讓 ElevenLabs 唸出怪音或字幕放不下。"""
import json, re, sys
spec = json.load(open(sys.argv[1], encoding='utf-8'))
bad = 0
for si, sc in enumerate(spec['scenes']):
    if not sc: print(f'場景 {si+1} 沒有句子'); bad += 1
    for li, ln in enumerate(sc):
        say = ln.get('say_el') or ln.get('say') or ln['disp']
        tag = f'場景{si+1} 句{li+1}'
        if re.search(r'[a-z]', say): print(f'{tag} 含小寫拉丁字母（n/z/r/p 會唸成怪音）：{say}'); bad += 1
        elif re.search(r'[A-Z]', say): print(f'{tag} 提醒：含大寫字母縮寫（DHA、F 這類唸起來 OK，單字母變數請改中文）：{say}')
        if re.search(r'\d', say): print(f'{tag} 含阿拉伯數字（請寫成中文讀法）：{say}'); bad += 1
        if len(ln['disp']) > 62: print(f'{tag} 字幕過長（字幕框兩行約 64 字） {len(ln["disp"])} 字：{ln["disp"]}'); bad += 1
        if re.match(r'^[一-鿿]{4,}(係數|定理|檢定)是', say): print(f'{tag} 句首專有名詞，建議前面墊字：{say}')
print('OK' if not bad else f'{bad} 個問題')
sys.exit(1 if bad else 0)
