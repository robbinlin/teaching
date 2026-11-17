# 真實世界運動大數據分析：每週影片製作手冊

給製作單一集影片的代理。照這份文件做完一集，不需要其他背景。全程繁體中文（台灣用語），不用 emoji。

工作目錄：`C:\Users\user\teaching\animations`（Windows，PowerShell；bash 指令用 Bash 工具）。
範本：第 6 週已完成，**先讀這三個檔**：`episodes_rwd.js`（火柴人 `stick()` 與 `RW6E1` 全集程式）、`voice/eprw6e1_lines.json`（旁白稿）、`storyboards/RWD_第6週_驗證與除錯_分鏡.md`（分鏡）。

## 產出（第 NN 週，key = `rwNNe1`）

| 檔案 | 說明 |
|---|---|
| `storyboards/RWD_第N週_<主題>_分鏡.md` | 分鏡，含資料來源 |
| `voice/eprwNNe1_lines.json` | 旁白稿 |
| `voice/eprwNNe1_timeline.js` | TTS 產生 |
| `episodes_rwd_wNN.js` | 動畫，結尾 `EPISODES['rwNNe1'] = ...`。`index.html` 會自動載入，不要改 `index.html`、`episodes_rwd.js`、引擎檔 |
| `out/share/RWD_WNN_EP1_720p.mp4` | 成品 |
| `youtube/package_rwd/meta_wNN.json` 與 `NN_wNN_ep1/` | 上傳包 |
| `F:\Dropbox\claude-real world data anslysis\05_影片\WNN\` | 複製 720p、分鏡、講稿、上傳包 |

不要 commit、不要 push、不要動其他週的檔案。

## 內容規則

- 來源只有三個：`C:\Users\user\robbinlin\1152-RWD-course\講義\WNN.md`、`C:\Users\user\teaching\real-world-sports-data\gen\content\wNN.json`、`C:\Users\user\teaching\real-world-sports-data\gen\facts.json`（由課程資料檔重算的真實數字，n = 37,822）。
- **畫面與旁白出現的每個數字都要在這三個來源裡**，或由它們直接算出。不可自編統計數字。網站工具的模擬結果要用時，旁白與畫面都要說「模擬資料」。
- 規律運動的定義寫「運動天數達標且會流汗會喘」，不寫每週幾天。縣市只寫代碼，不寫縣市名。題目只寫題號。
- 長度 2.5–3 分鐘：6–7 個場景，共 20–24 句，每句字幕不超過 60 字，全片口語稿約 450–550 字。
- 結構：開場（一個真實故事或課堂情境）→ 2–3 個講義裡的具體例子（有數字、有畫面變化）→ 該週的檢查或做法 → 一句結語。
- 開場的歷史故事**必須用網路搜尋查到兩個來源**（年代、人物、事件），連結寫進分鏡「資料來源」。查不到就改用課堂情境開場，不要硬編。
- 教師備註裡的課堂任務解答不要放進影片。
- 語氣像老師直接講。不用反問句堆疊、不用「不是 X，而是 Y」、不用口號。

## 旁白稿 `lines.json`

格式照 `voice/eprw6e1_lines.json`：頂層保留同樣的 `voice_sid`、`speed`、`el_speed`、`elevenlabs_voice_id`、`elevenlabs_model`；`scenes` 是陣列的陣列，每句有 `disp`（字幕）、`say`、`say_el`（兩者相同，口語稿）。

口語稿規則（TTS 會把單獨字母唸成怪音）：
- 全中文。阿拉伯數字寫成中文讀法（37,822 → 三萬七千八百二十二；51.3% → 百分之五十一點三；長數字可說「一萬五千多」）。
- 不可有小寫拉丁字母。`else` → 「其餘的」；`p` 值 → 「批值」；`t` 檢定 → 「踢檢定」；OR → 「勝算比」；AUC → 「曲線下面積」；DAG → 「因果圖」；SMD → 「標準化差異」；AI → 「人工智慧」；R、SAS、Python 可寫「阿爾」「薩斯」「派森」或直接說「三種語言」。
- 句首不要放多音節譯名；逗號多一點，讓語氣有停頓。

指令（PowerShell，在 `animations/`）：
```powershell
python -I ..\.claude\skills\lecture-animation-video\scripts\lint_lines.py voice\eprwNNe1_lines.json
$env:ELEVENLABS_API_KEY = (Get-Content C:\claude-orchestrator\elevenlabs_key.txt -Raw).Trim()   # 不要印出來
$env:PYTHONUTF8 = '1'
python voice\tts.py rwNNe1 elevenlabs
python ..\.claude\skills\lecture-animation-video\scripts\asr_check.py C:\Users\user\rwd-asr\sherpa-onnx-paraformer-zh-small-2024-03-09 voice\eprwNNe1_voice.wav voice\eprwNNe1_timeline.js
```
回聽結果是簡體同音字屬正常（程式→城市、縱軸→種植）。要處理的是：句尾多出原文沒有的字、整段唸錯、數字唸錯。處理方式是改寫那一句再跑一次 TTS（逐句有快取，只會重合成改過的句子）。跑完 TTS 記下每個場景的起訖秒數與每句長度（指令會印出）。

## 動畫程式

畫布 1920×1080，內容畫在 y ≤ 880；y > 905 是字幕框。左上 (36,30) 有集名標籤，標題從 y ≈ 130 開始。片尾最後 3.6 秒右下角（約 x 1000–1860、y 700–870）會出現資料來源卡，最後一個場景的角色與重點不要放在那裡。

每個場景：`const s1 = { beats: [0, 9, 17], draw(lt) { ... } };`
- `lt` 是場景內的動畫時間（秒）。`beats[j]` 是第 j 句旁白開始時動畫應走到的時間。把 `beats` 設成接近該句在旁白中的實際起始秒數（TTS 印出的每句長度加 0.45 秒句間隔累加，第一句從 0 開始），場景動畫總長設成接近旁白場景長度，動作速度才自然。
- 元素用 `prog(lt, 起始秒, 持續秒)` 得到 0→1 的進度來淡入或畫出，起始秒對齊對應句子的 beat。

結尾固定寫法（照 `RW6E1`）：
```js
const order = [[s1, 36], [s2, 19], ...];   // 每個場景的動畫秒數
let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 N 週　<集名>', scenes,
  sources: ['資料來源', '<一行>', '<一行>', '林彥光老師講義〈第 N 週 …〉'] };   // 每行不超過約 60 字
```
整集包在 `const RWnnE1 = (() => { ... })(); EPISODES['rwNNe1'] = RWnnE1;`。常數物件命名加週次（例如 `RW07`），不要與 `RW6`、`fmtN`、`stick`、`waveArm` 衝突；這四個可直接使用。

可用函式（都已載入）：
- 文字：`txt(s, x, y, size, {p, color, align:'left'|'center'|'right', weight, jit})`，預設置中、y 為垂直中心。`measure(s, size)`。
- 線與形狀：`ink(pts, {w, color, p})`、`inkLine(x0,y0,x1,y1,{w,color,p})`、`inkEll(cx,cy,rx,ry,{w,color,p})`、`shape(pts, {fill, w, smooth:false, color})`、`rectPts(x,y,w,h)`、`roundRectPts(x,y,w,h,r)`、`ellPts(cx,cy,rx,ry)`、`underline(x0,x1,y,{p,color})`、`arrow(x0,y0,x1,y1,{w,head,p,color})`。
- 圖表：`bar(x, base, w, h, color)`（x 為中心、base 為底線 y）、`axis(x0,x1,y,{p})`、`noteBox(x,y,w,h,[[文字,字級,顏色],…],fill,k)`（置中；每行佔 60px，h 至少 行數×60＋30）、`bubble(x,y,w,h,尖端x,尖端y,文字,字級,k)`、`check(x,y,s,k)`、`cross(x,y,s,k)`、`paperSheet(x,y,w,h,rot)`、`mini(x,y,s,color,'dots')`（小人，群體用）、`ground(lt,x0,x1)`、`GY`（地面 y = 840）。
- 節奏：`prog`、`appear(k, () => {...})`（k 為 0–1 的透明度）、`ease`、`easeOut`、`lerp`、`clamp`、`rnd(seed)`、`idle(RLT)`（角色微動）、`RLT`（場景時間，供持續動作）。
- 顏色 `COL`：ink、black、paper、mustard、mustardD、pink、pinkL、white、blue、blueL、red、green、greenL、gray、amber。
- 火柴人：`stick(x, 地面y, 縮放, {hair:'tuft'|'pony'|'cap', glasses:true, mouth:'smile'|'flat'|'o', la, ra, bob})`。`la`／`ra` 是手臂角度（弧度，0 朝右、π/2 朝下），可給 `[上臂, 前臂]`。固定角色：戴眼鏡的老師、綁馬尾的同學（pony）、三根毛的同學（tuft）；歷史人物用 `cap` 或不加髮型。`waveArm(RLT)` 是揮手。

畫面原則：一個場景一個視覺重點；數字出現時畫面同步出現；用「同一張圖從 A 變成 B」表現差異（例如 `lerp(舊高度, 新高度, ease(prog(...)))`）；程式碼用 `txt(..., {align:'left', jit:.5})` 逐行寫，字級 30–36。

## 預覽、渲染、檢查

```powershell
node render.cjs preview rwNNe1v 8,20,35,50,65,80,95,110,125,140,155,170     # 每個場景中段與結尾
```
把 `out/preview/eprwNNe1v_*.jpg` 用 PIL 拼成 3×N 縮圖總表（每張 640×360）再用 Read 看。檢查：文字互疊、超出畫面、掉進字幕區（y > 880）、角色擋住重點、片尾資料來源卡蓋到內容。改座標後重拍，直到乾淨。

```powershell
node render.cjs full rwNNe1v     # 約 8–15 分鐘；同時可能有別集在渲染，耐心等，逾時就用背景執行
```
Bash 工具（在 `animations/`）：
```bash
bash ../.claude/skills/lecture-animation-video/scripts/post.sh rwNNe1v RWD_WNN_EP1
```
它會印出長度與響度（`input_i` 應在 −16 ± 1），並產生 `out/check/rwNNe1v_sheet.jpg`（逐秒截圖表，**一定要用 Read 看**；太大就先用 PIL 縮到寬 1800）與 `out/share/RWD_WNN_EP1_720p.mp4`。發現問題就修正後重新渲染。`out/share/RWD_WNN_EP1_1080p.mp4` 很大，檢查完刪掉。

## 上傳包與交付

1. 寫 `youtube/package_rwd/meta_wNN.json`（欄位見 `youtube/make_rwd_package.py` 檔頭；`labels` 每個場景一個、不超過 14 字；`thumb_t` 選一個畫面完整、有標題字的秒數，並先 `node render.cjs preview rwNNe1v <thumb_t>`）。
2. `python youtube\make_rwd_package.py youtube\package_rwd\meta_wNN.json`
3. 複製到 `F:\Dropbox\claude-real world data anslysis\05_影片\WNN\`：`RWD_WNN_EP1_720p.mp4`、分鏡 md、`YouTube上傳包\`（整個 `NN_wNN_ep1` 資料夾內容），並寫一份 `講稿_第N週.md`（每個場景一個表格：字幕｜口語稿，格式照 `05_影片\W06\講稿_第6週.md`）。

## 回報

回報：成品路徑、長度、響度、場景數與句數、開場故事的兩個來源連結（或說明改用課堂情境）、看過截圖表後修了什麼、任何無法照手冊完成的地方。
