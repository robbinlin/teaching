import json, re, os, shutil, zipfile, sys
S=sys.argv[1]; OUT=S+'/yt2/pkg'; shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
meta=json.load(open('youtube/youtube_metadata.json'))
CH={1:'描述資料特徵的統計量及圖表',2:'基礎機率及抽樣分配',3:'估計與檢定',4:'單樣本及雙樣本檢定',5:'平均數檢定：多組樣本',6:'兩個類別變數之檢定',7:'相關和迴歸分析（一）',8:'多變項迴歸分析'}
PL={1:'第1章 描述資料特徵的統計量及圖表。集中趨勢、分散程度、統計圖表三集，用肺癌病人、薪資、CVD 等課堂資料示範。',
 2:'第2章 基礎機率及抽樣分配。邊際／聯合／條件機率、二項式與常態分配、抽樣分配與中央極限定理。',
 3:'第3章 估計與檢定。信賴區間、假設檢定與 P 值、型一型二錯誤與檢定力。',
 4:'第4章 單樣本及雙樣本檢定。t 檢定三種、無母數檢定（Wilcoxon、Mann–Whitney）、P 值與信賴區間的關係。',
 5:'第5章 平均數檢定：多組樣本。變異數分析、Bonferroni 事後比較、Kruskal–Wallis 與作業解析。',
 6:'第6章 兩個類別變數之檢定。卡方獨立性檢定、葉氏校正與費雪精確檢定、疫苗資料與 McNemar。',
 7:'第7章 相關和迴歸分析（一）。皮爾森相關、斯皮爾曼等級相關、簡單線性迴歸與作業。',
 8:'第8章 多變項迴歸分析。干擾變數與辛普森詭論、交互作用與分層、卜瓦松迴歸作業全解。'}
BASE=['高等體育統計','統計學','體育統計','生物統計','Statistics','Biostatistics','國立體育大學','手繪動畫','統計教學']
KW={1:['平均數','中位數','眾數','標準差','盒鬚圖','直方圖','散佈圖','描述統計'],2:['機率','條件機率','二項分配','常態分配','中央極限定理','抽樣分配','標準誤'],
 3:['信賴區間','假設檢定','P值','型一錯誤','型二錯誤','檢定力','統計推論'],4:['t檢定','獨立樣本','成對樣本','無母數','Wilcoxon','Mann-Whitney','單尾雙尾'],
 5:['變異數分析','ANOVA','事後檢定','Bonferroni','Kruskal-Wallis','多重比較'],6:['卡方檢定','獨立性檢定','費雪精確檢定','葉氏校正','McNemar','列聯表'],
 7:['相關係數','皮爾森','斯皮爾曼','線性迴歸','最小平方法','決定係數','R平方'],8:['多變項迴歸','干擾變數','辛普森詭論','交互作用','分層分析','卜瓦松迴歸','發生率比']}
def ts(s):
    s=int(round(s)); return f"{s//60}:{s%60:02d}"
problems=[]
for v in meta:
    m=re.match(r'高等體育統計 \| 第(\d)章 EP(\d) (.*)$',v['title']); ch,ep,short=int(m[1]),int(m[2]),m[3]
    d=f"{OUT}/{v['order']:02d}_ch{ch}_ep{ep}"; os.makedirs(d)
    tags=BASE+KW[ch]+[f'第{ch}章']
    v['tags']=tags; v['playlist']=f'高等體育統計 第{ch}章 {CH[ch]}'; v['thumbnail']=f"{v['order']:02d}_ch{ch}_ep{ep}/thumbnail.jpg"
    v['folder']=f"{v['order']:02d}_ch{ch}_ep{ep}"
    # chapter timestamp check (YouTube: >=3 chapters, first 0:00, each >=10 s)
    cs=[l for l in v['description'].split('\n') if re.match(r'^\d+:\d\d ',l)]
    secs=[int(x.split()[0].split(':')[0])*60+int(x.split()[0].split(':')[1]) for x in cs]+[int(v['seconds'])]
    gaps=[b-a for a,b in zip(secs,secs[1:])]
    if len(cs)<3 or secs[0]!=0 or min(gaps)<10: problems.append((v['order'],len(cs),gaps))
    open(f'{d}/title.txt','w').write(v['title']+'\n')
    open(f'{d}/description.txt','w').write(v['description']+'\n')
    open(f'{d}/tags.txt','w').write(', '.join(tags)+'\n')
    open(f'{d}/playlist.txt','w').write(v['playlist']+'\n')
    shutil.copy(f"youtube/srt/{v['srt']}", f'{d}/subtitle_zh-TW.srt')
    shutil.copy(f"{S}/yt2/thumbs/{v['order']:02d}.jpg", f'{d}/thumbnail.jpg')
    open(f'{d}/video_file.txt','w').write(f"Dropbox /Claude統計課程/Claude（林老師的助理） - {v['file']}\n")
print('chapter problems:',problems)
json.dump(meta,open(f'{OUT}/youtube_metadata.json','w'),ensure_ascii=False,indent=1)
os.makedirs(f'{OUT}/playlists'); 
for ch in range(1,9): open(f'{OUT}/playlists/ch{ch}.txt','w').write(f'高等體育統計 第{ch}章 {CH[ch]}\n\n{PL[ch]}\n\n國立體育大學 競技與教練科學研究所「高等體育統計」｜林彥光 老師\n課程網站：https://advanced-sports-statistics-course.robbinlin.chatgpt.site\n')
# README
L=['# 高等體育統計 動畫影片 YouTube 上傳包（v2）','',
'本包內所有檔名皆為英數，避免 Windows 解壓縮時中文檔名亂碼或遺失。中文標題與說明都在各資料夾的 txt 檔內。','',
'## 內容','',
'- `01_ch1_ep1` … `24_ch8_ep3`：每支影片一個資料夾',
'  - `title.txt` 標題（直接複製）',
'  - `description.txt` 說明文字（含章節時間戳、本集重點、資料來源、hashtag）',
'  - `tags.txt` 標籤（逗號分隔，上傳時貼到「標記」）',
'  - `subtitle_zh-TW.srt` 繁體中文字幕（語言選「中文（台灣）」）',
'  - `thumbnail.jpg` 縮圖 1280×720',
'  - `playlist.txt` 要加入的播放清單名稱',
'  - `video_file.txt` 對應的影片檔（在 Dropbox /Claude統計課程，請用 720p 或 1080p 皆可）',
'- `playlists/ch1.txt` … `ch8.txt`：8 個播放清單的名稱與說明',
'- `youtube_metadata.json`：以上全部的機器可讀版本（若日後改用 API 上傳）',
'- `README.md`：本說明','',
'## 建議上傳設定','',
'| 項目 | 設定 |','|---|---|','| 隱私 | 不公開（網站嵌入可看，搜尋不到） |','| 目標對象 | 不是為兒童打造 |','| 類別 | 教育 |',
'| 影片語言 | 中文（台灣） |','| 字幕 | 上傳 `subtitle_zh-TW.srt`，語言 中文（台灣） |','| 授權 | 標準 YouTube 授權 |',
'| 章節 | 說明文字內已含時間戳（第一個 0:00、每段 ≥ 10 秒、≥ 3 段），上傳後自動生成章節 |',
'| 播放清單 | 依章建立 8 個，名稱見 `playlists/` |','',
'## 影片總表','','| 順序 | 資料夾 | 標題 | 長度 | 影片檔 |','|---|---|---|---|---|']
for v in meta: L.append(f"| {v['order']} | `{v['folder']}` | {v['title']} | {ts(v['seconds'])} | {v['file']} |")
L+=['','## 每支影片的標題、說明、標籤','']
for v in meta:
    L+=[f"### {v['order']}. {v['title']}",'',f"資料夾 `{v['folder']}`　影片檔 `{v['file']}`　播放清單「{v['playlist']}」",'','**標題**','','```',v['title'],'```','','**說明**','','```',v['description'],'```','','**標籤**','','```',', '.join(v['tags']),'```','']
open(f'{OUT}/README.md','w').write('\n'.join(L))
# zip (ASCII names only)
zp=f'{S}/yt2/YouTube_upload_package_v2.zip'
with zipfile.ZipFile(zp,'w',zipfile.ZIP_DEFLATED) as z:
    for root,_,files in os.walk(OUT):
        for f in sorted(files):
            p=os.path.join(root,f); arc=os.path.relpath(p,OUT); assert arc.isascii(), arc; z.write(p,'YouTube_upload_package/'+arc)
print(zp, os.path.getsize(zp)); print(len(zipfile.ZipFile(zp).namelist()),'files')
