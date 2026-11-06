# 紙本書版：內容撰寫規格（給撰寫者）

每一本書 = 一個 JSON 檔（`books/NN_名稱.json`），由 `engine.html` 讀取後變成一本可翻閱的 3D 互動書：
左頁印故事文字與研究決策（選項＋掀開紙片看回饋），右頁上方浮著 3D 場景或 3D 統計模型。

**完整範例（務必先讀）：`books/00_multivariate_case01.json`**。它是品質與份量的標準。

## 工作流程

1. 讀該章投影片文字：`src/<章名>.txt`（含講者備註）。投影片有些以圖片為主、文字少；請以該章主題的標準研究所統計教學內容補足，但**以講義的重點、用語、例子為主軸**。
2. 寫 `books/NN_<章名>.json`。
3. 檢查：`python -I build.py --check books/NN_xxx.json`，修到 **0 錯誤**，警告也盡量清掉（警告多半是文字太長、會被縮字）。
4. 建置：`python -I build.py books/NN_xxx.json` → 輸出到 `out/`。
5. 自動試玩：`node playtest.js "out/<file>.html" shots/NN good`（約 3–6 分鐘；必須顯示 `"final": "DONE"` 且 `errors: []`）。
6. 用 Read 工具**實際看截圖**（`shots/NN/*.png`）：每一則研究筆記的 3D 模型、每一個決策頁、結案頁。檢查文字是否被裁切、標籤是否重疊、模型是否看得懂。發現問題就改 JSON 重跑。
7. 不要修改 `engine.html`、`build.py`、`playtest.js`。若發現引擎 bug，記下來在回報中說明，用 JSON 迴避。

所有指令在 `C:\Users\user\Desktop\MULTIVARIATE\paperbooks` 執行（Bash：`cd /c/Users/user/Desktop/MULTIVARIATE/paperbooks`）。

## 語言與風格

- 台灣繁體中文，學術但好讀。全形標點（，。：；「」（）），數字與英文前後留半形空格（例：`312 位`、`p ＜ .05` 可寫成 `p < .05`）。
- 統計數字用 APA 慣例：小數點前的 0 省略於 p、r、β 等介於 ±1 的量（`.05`、`r = .62`）。
- 強調用 `<em>…</em>`（印成紅褐色粗體）。不要用其他 HTML。
- 研究所「多變量統計」課程、**運動科學／體育**情境（選手、教練、訓練介入、體適能、運動心理、傷害預防等）。
- 每本書是一個「研究案件」：有一個看似合理、但統計推論有問題的研究宣稱，主角一步步追查。教學重點必須自然地放進劇情與研究決策裡。

## 固定主角（每本書都要放進 cast，外觀一字不改）

```json
"hero": {"name": "沈以安", "role": "運動科學研究者", "look": {"shirt": "#2e8b84", "coat": true, "glasses": true, "hair": "#2a1e18", "hairStyle": "bun", "acc": "notebook"}, "quips": [...依本章自訂 2–3 句...]},
"ra":   {"name": "柏哲", "role": "研究生", "look": {"shirt": "#5c9c6a", "hair": "#1a1a1a"}, "quips": [...]}
```

另外依本章需要加入 1–3 位角色（例如提出可疑宣稱的教練／研究者、審查委員、統計顧問、選手）。不要沿用「周啟宏」「方靜儀」。
`look` 欄位：`shirt`/`hair`/`pants`/`skin` 為 `#RRGGBB`；`hairStyle`: `short`|`bun`|`long`|`bald`|`cap`；`glasses`/`coat`: true/false；`acc`: `tie`|`notebook`|`clipboard`|`whistle`|`laptop`|null。

## 份量（每本書）

- **3 幕**（`acts`），每幕 7–12 段故事文字。
- **研究決策 4–6 題**（`type:"choice"`），每題 3–4 個選項，恰好 1 個 `good:true`；錯誤選項要是學生**真的常犯**的錯，回饋要說明為什麼錯、正確做法是什麼。
- **研究筆記 6–8 則**（`type:"note"`），每則一個 3D 模型。筆記是本書的教學核心：概念、公式、判讀步驟、常見誤用、報告寫法。整本書的筆記要涵蓋該章講義的主要內容。
- 結案報告 `ending`：2–3 段＋一句 `takeaway`＋三段 `verdict`（全對／過半／過少）。

## 頂層結構

```json
{
  "file": "第03章_共變數分析_紙本書版",          // 輸出檔名（不含 .html）
  "caseNo": "03",                                   // 章號，兩位數
  "title": "書名（中文，≤ 10 字，像案件名）",
  "header": "CASE 03  ·  書名  ·  ANCOVA",          // 左頁頁眉，≤ 40 字元
  "cover": {
    "series": "R E S E A R C H   C A S E   F I L E S",
    "big": "ANCOVA",                                // 封面大字：英文方法名，≤ 12 字元
    "en": "英文副標（≤ 40 字元）",
    "tag": "CASE 03 ・ Analysis of Covariance",
    "tagline": ["兩行引言，", "每行 ≤ 16 字。"],
    "summary": "案件摘要 80–130 字",
    "conflict": "核心衝突一句話（可用 <em>）"
  },
  "cast": { ... },
  "acts": [ ... ],
  "notes": { ... },
  "ending": { "title": "…：結案", "paragraphs": ["…","…"], "takeaway": "…", "verdict": ["…","…","…"] }
}
```

## 幕（act）

```json
{
  "key": "第一幕", "title": "幕名（≤ 10 字）",
  "scene": { "type": "conference", "cast": ["coach","hero","ra"], "screen": { "title": "投影片標題", "sub": "副標", "bars": [["組 A", 12.4, "M = 12.4"], ["組 B", 9.8]] } },
  "fig": { "cap": "圖 1.1　圖說標題", "sub": "圖說內文 40–100 字。" },
  "beats": [ ... ]
}
```

- `scene.type`：`conference`（研討會：投影幕＋講台＋聽眾；cast[0] 站講台）、`lab`（研究室：電腦螢幕顯示 screen）、`meeting`（會議桌＋白板顯示 screen）、`field`（運動場跑道＋選手；可加 screen 當看板）、`classroom`（黑板顯示 screen＋學生）、`matrix`（相關矩陣立體柱，參數 `n` 4–12、`blocks` 1–4）。
- `cast` 最多 5 人，必須是 cast 裡的 id；順序決定站位。
- `screen`：`title`（≤ 22 字）、可選 `sub`；然後 `bars`（≤ 6 根，`[標籤, 數值, 可選顯示文字]`）**或** `lines`（≤ 6 行文字，每行 ≤ 24 字）。
- 右頁圖說 `fig` 描述這個場景。

## 段落（beats）

- 敘述：`{"s":"n","t":"…"}`；對白：`{"s":"hero","t":"…"}`（不用加引號，引擎會加「」）。每段 ≤ 120 字。
- 研究筆記：`{"type":"note","id":"筆記id"}` → 翻到筆記跨頁，再翻回故事。
- 換場景：`{"type":"scene","scene":{...},"fig":{...},"title":"新頁標題（可選）"}` → 下一段文字會翻到新跨頁並換 3D 場景。
- 模型動畫頁（**新**，讓故事中間也能看到會動的 3D 模型）：
```json
{"type":"viz","title":"頁標題（≤ 16 字）",
 "text":["左頁說明第 1 段（40–90 字，可用 <em>）","第 2 段（可選）"],
 "model":{ …任何模型類型，強烈建議加 steps… },
 "cap":"圖 V1　右頁圖說標題","sub":"右頁圖說 30–90 字（可選）","points":["重點（可選，≤ 2 點）"]}
```
  翻到一個跨頁：左頁是標題＋說明＋步驟清單（目前步驟會高亮），右頁是自動播放的 3D 模型動畫。之後的故事文字會自動翻新頁接續。放在故事中「需要看見」的時刻（剛提出疑問時、發現關鍵數字時、揭露真相時）。`text` 總字數 ≤ 200 字。
- 研究決策也可以加 `"model":{…}`，決策頁右側就會浮出這個模型（取代場景），適合「看著圖做判斷」的題目。
- 研究決策：
```json
{"type":"choice","header":"決策短標題（≤ 14 字）",
 "scene": {...可選，換場景...}, "fig": {...可選...},
 "q":"題目（≤ 80 字）",
 "opts":[{"t":"選項（≤ 45 字）","good":false,"fb":"回饋（60–150 字）"}, ...]}
```
  題目＋所有選項合計 ≤ 230 字（太長會縮字）。決策後下一段文字會自動翻新頁。

## 研究筆記（notes）

```json
"notes": {
  "ancova_model": {
    "no": 1, "t": "筆記標題（≤ 14 字）",
    "blocks": [
      {"type":"h","t":"小標"},
      {"type":"p","t":"段落"},
      {"type":"formula","t":"Y = β₀ + β₁X + ε"},
      {"type":"bullet","t":"條列"}
    ],
    "fig": {
      "model": { ...3D 模型，見下... },
      "table": [["", "欄1", "欄2"], ["列名", "…", "…"]],   // 可選，≤ 6 列、每格 ≤ 12 字，印在模型下方
      "cap": "圖 N1　圖說標題",
      "sub": "圖說 40–90 字：說明模型中顏色、形狀代表什麼。",
      "points": ["重點 1（≤ 40 字）", "重點 2", "重點 3"]   // 2–3 點，合計 ≤ 180 字
    }
  }
}
```
- `no` 依出現順序 1, 2, 3…；`blocks` 左頁總字數 ≤ 520 字（含公式），通常 2–3 個小標、3–5 段。
- 公式 ≤ 34 字元；用 Unicode 上下標（₀₁₂ ² ³ ᵢ ⱼ）、希臘字母（α β λ μ σ ε η² ω）、≤ ≥ ≠ × ÷ √ Σ。不要用 LaTeX。
- 筆記中的數字若是虛構的教學數值，在 `sub` 標註「數值為教學示意」。

## 3D 模型類型（`fig.model`）

顏色只能用：`teal` `red` `gold` `ink` `purple` `blue` `gray` `green`。標籤文字盡量短（≤ 8 字），否則會重疊。

1. **`bars`** 正負長條（負荷量、迴歸係數、效果量、各組平均、比例）
```json
{"type":"bars","title":"標準化迴歸係數 β","rows":[["訓練量",0.42],["睡眠",0.21],["年齡",-0.18,"red"]],"max":0.5,"thresholds":[0.1],"posLabel":"正向","negLabel":"負向","unit":""}
```
   `rows` ≤ 8 列，標籤 ≤ 6 字；`max` 為軸的最大絕對值；`thresholds` 畫水平門檻線；第三欄可指定顏色。

2. **`columns`** 立體柱＋折線＋水平面（陡坡圖、各組平均＋門檻、時間序列、次數分配）
```json
{"type":"columns","values":[7.1,3.6,2.7,1.15,0.95],"labels":["1","2","3","4","5"],"highlight":3,"markIndex":3,"plane":{"value":1,"label":"λ = 1"},"lines":[{"values":[1.6,1.5,1.4,1.3,1.27],"label":"隨機資料","color":"gold"}],"notes":[{"text":"保留 3 個","at":1,"color":"teal"}],"yLabel":"特徵值","showValues":true,"connect":true}
```
   `values` ≤ 12 個非負數；前 `highlight` 根為綠色、`markIndex` 那根為紅色、其餘灰色；`connect:false` 不連線。

3. **`lines`** 多組折線（組平均隨時間、交互作用、簡單斜率、重複測量、調整前後平均）
```json
{"type":"lines","title":"組別 × 時間","xLabels":["前測","中測","後測"],"series":[{"label":"訓練組","values":[42,48,55],"color":"teal","err":[2,2,3]},{"label":"對照組","values":[41,43,44],"color":"red"}],"ymin":35,"ymax":60,"yLabel":"VO₂max"}
```
   每個 series 的 values 數量必須等於 xLabels 數量；≤ 4 組、≤ 8 個時間點；`err` 可選（誤差線）。

4. **`curves`** 曲線（常態分布、抽樣分布、t 分布近似、邏輯斯曲線、直線、折線點）＋陰影區＋標記線＋散點
```json
{"type":"curves","x":[-4,4],"curves":[{"type":"normal","mu":0,"sd":1,"label":"H₀","color":"gray"},{"type":"normal","mu":2.5,"sd":1,"label":"H₁","color":"teal"}],"shade":{"curve":0,"from":1.96,"to":4,"label":"α/2","color":"red"},"marks":[{"x":1.96,"label":"臨界值","color":"ink"}],"xLabel":"t","yLabel":"機率密度"}
```
   curve type：`normal`(mu,sd)｜`logistic`(b0,b1，y 為 0–1，請設 `"ymax":1`)｜`line`(a,b)｜`points`(points:[[x,y],…])。`dots`: `[[x,y,"color"],…]` ≤ 80 點（例如邏輯斯迴歸的 0/1 資料點）。

5. **`scatter3d`** 三維點雲（主成分、多元迴歸平面、群集／判別）
```json
{"type":"scatter3d","axes":["X₁ 訓練量","X₂ 睡眠","Y 表現"],"plane":{"bx":0.6,"bz":0.3,"noise":0.06,"label":"迴歸平面","residuals":true}}
{"type":"scatter3d","axes":["依變項 1","依變項 2","依變項 3"],"groups":[{"label":"訓練組","center":[0.25,0.15,0],"sd":0.1,"n":40,"color":"teal"},{"label":"對照組","center":[-0.2,-0.1,0.05],"sd":0.1,"n":40,"color":"red"}]}
{"type":"scatter3d","axes":["Z₁","Z₂","Z₃"],"arrows":[{"label":"PC1"},{"label":"PC2"}]}
```
   座標範圍約 −0.6～0.6。平面：`y = bx·x + bz·z`（bx、bz 約 −0.8～0.8）。

6. **`paths`** 路徑圖（中介、調節、CFA、SEM、ANCOVA 概念圖、研究設計）
```json
{"type":"paths","title":"簡單中介模型","nodes":[
  {"id":"X","label":"訓練","x":-0.8,"y":0.3},{"id":"M","label":"自我效能","x":0,"y":0.85},{"id":"Y","label":"表現","x":0.8,"y":0.3},
  {"id":"W","label":"性別","kind":"mod","x":0.4,"y":0.0},{"id":"F","label":"因素","kind":"lat","x":0,"y":0.5},{"id":"e","label":"ε","kind":"err","x":0.9,"y":0.0}],
 "edges":[{"from":"X","to":"M","label":"a","color":"teal"},{"from":"M","to":"Y","label":"b","color":"teal"},{"from":"X","to":"Y","label":"c′","color":"gray"},
  {"from":"W","toEdge":["X","Y"],"color":"purple"},{"from":"F","to":"Y","double":true,"color":"purple","label":"相關"}]}
```
   `kind`：`obs`（方塊，預設）｜`lat`（紅球，潛在變項）｜`err`（灰小球）｜`comp`（綠六角柱）｜`mod`（紫八面體，調節變項）。`x` ∈ [−1,1]、`y` ∈ [0,1]（y 大＝上方）。≤ 16 節點、≤ 30 條邊；`toEdge` 畫一條指向另一條路徑中點的箭頭（調節）；`double:true` 是雙向弧線（相關／共變）。節點標籤 ≤ 5 字。

7. **`matrix`** 相關矩陣塔（多重共線性、相關結構）
```json
{"type":"matrix","title":"預測變項相關","labels":["身高","體重","BMI","體脂"],"values":[[1,0.6,0.3,0.2],[0.6,1,0.85,0.7],[0.3,0.85,1,0.8],[0.2,0.7,0.8,1]],"showAbove":0.3}
```
   ≤ 8 個變數，n×n 對稱。

8. **`boxes`** 箱形圖（描述統計、離群值、組間分布比較、變異數同質性）
```json
{"type":"boxes","title":"三組 30 公尺衝刺","groups":[{"label":"A 組","stats":[4.1,4.3,4.4,4.6,4.9],"mean":4.45,"outliers":[5.4],"color":"teal"}],"yLabel":"秒"}
```
   `stats` 必須遞增 [最小, Q1, 中位數, Q3, 最大]；≤ 6 組。可加 `"refs":[{"value":0.5,"label":"切點 .50","color":"red"}]` 畫水平參考線。

9. **`drops`** 落球直方圖（抽樣分布、中央極限定理、p 值尾端、虛無分布模擬、次數分配）——小球一顆顆落進格子堆成分布，最後畫出常態曲線
```json
{"type":"drops","title":"重複抽樣 150 次","x":[-4,4],"dist":{"mu":0,"sd":1},"n":150,"bins":17,"shade":{"from":1.96,"to":4,"label":"p/2 尾端","color":"red"},"marks":[{"x":1.96,"label":"t = 1.96","color":"red"}],"xLabel":"樣本平均數（標準化）"}
```
   兩種給資料方式：`dist`(mu,sd)＋`n`（≤ 200）＋`bins`（5–25）自動模擬；或直接給 `counts:[…]`（每格球數，單格 ≤ 60、總數 ≤ 200）。`shade` 區間內的球會變色；`curve:false` 不畫曲線；`seed` 改變隨機樣本。

10. **`fit`** 迴歸擬合動畫（簡單迴歸、殘差、ANCOVA 平行斜率、調節的不同斜率、辛普森悖論、迴歸向平均回歸）——資料點落下 → 直線從水平「轉」到最小平方斜率 → 殘差線長出來
```json
{"type":"fit","title":"兩隊各自的斜率","xLabel":"訓練量","yLabel":"表現","showSlope":true,"residuals":false,"overall":"合併",
 "groups":[{"label":"A 隊","color":"teal","gen":{"n":22,"b0":30,"b1":2,"noise":2,"x":[2,6]}},
           {"label":"B 隊","color":"red","points":[[6.1,22.3],[7.4,24.0],[8.8,27.5]]}]}
```
   每組用 `points:[[x,y],…]`（≤ 60 點）或 `gen:{n,b0,b1,noise,x:[min,max],seed}` 產生資料；斜率由程式以最小平方法計算（也可給 `line:{b0,b1}` 強制）。單組時可直接把 `points`/`gen` 放在最外層。`overall`（字串或 true）額外畫一條合併所有點的黑色迴歸線；`groupLines:false` 不畫各組線；`showSlope` 在線尾標出 b；`residuals:true` 畫殘差；`x`、`y` 可固定軸範圍 `[min,max]`。≤ 4 組。

### 模型動畫步驟（`steps`，任何模型類型都可用）

模型可以有 2–5 個「步驟」，引擎會自動輪播：每一步把該步的欄位**覆蓋**到基本模型上，重新生成並播放生成動畫，並在頁面上顯示步驟說明 `cap`。用來呈現「前 → 後」「小樣本 → 大樣本」「未調整 → 調整後」「加入調節變項」「斜率不平行」等變化。

```json
{"type":"lines","xLabels":["前測","後測"],"series":[…],
 "steps":[{"cap":"未調整：B 組看起來進步較多"},
          {"cap":"共變數調整後：差距消失","series":[…調整後數值…]}]}
```
- `cap` 必填（≤ 40 字，描述這一步「看什麼」）；其餘欄位是要覆蓋的模型欄位（陣列與物件是**整個取代**，不是合併）。
- 第一步通常不覆蓋任何欄位，只寫 `cap`。
- 每步都要能單獨成為合法模型（build 會逐步驗證）。

**其他**：指數請寫成 `exp(…)`，不要寫 `e^…`。

**選型建議**：每本書至少用 4 種不同的模型類型；選最能「讓概念變得看得見」的，而不是最容易的。例：變異數同質性 → boxes；交互作用 → lines；中介 → paths；檢定力 → curves 兩條常態＋陰影；多重共線性 → matrix；迴歸 → scatter3d plane；邏輯斯 → curves logistic＋dots。

## 品質檢查清單

- [ ] 劇情有一條主線：可疑宣稱 → 追查 → 揭露 → 修正，三幕各有推進。
- [ ] 每個研究決策都對應講義裡的一個核心判斷（方法選擇、假設檢查、結果解讀、報告寫法、因果推論等）。
- [ ] 研究筆記涵蓋講義主要概念，公式正確，判讀門檻有出處慣例（如 Cohen 的效果量標準）。
- [ ] 統計內容正確（請自我審查：自由度、公式、假設條件、效果量定義）。
- [ ] 每本書 4–6 個 `viz` 模型動畫頁、每幕至少 1 個；至少一半的 viz／筆記模型有 `steps`；至少用到一次 `drops` 或 `fit`。
- [ ] build 0 錯誤、playtest `DONE` 且無錯誤、看過所有筆記與決策截圖。
