# 體育測驗與統計 課程網站：單章製作規格

你負責一章的章節頁內容。頁面骨架、樣式、建置程式都已完成，你只在 `site/chN/` 產出下面五樣東西，然後建置、截圖、自己看圖檢查到沒有問題為止。

對象是國立體育大學大學部學生（林彥光老師的「體育測驗與統計」）。全部用繁體中文、台灣用語，語氣像老師直接講，平實、具體。不用 emoji，不寫行銷語，不用簡體字。

## 路徑

工作根目錄（下稱 SP）：
`C:/Users/user/AppData/Local/Temp/claude/9e7e69c32428cf36/cb581adc-ed6e-4640-8269-024c49679c3c/scratchpad`

唯一可寫入的位置：`SP/site/chN/`（你的章）與 `SP/site/out/chN/`、`SP/site/out/_shots/`（建置輸出）。
不要改 `SP/site/gen2/`、`build_site.py`、`shot.py`、其他章的資料夾。發現框架的問題，寫在最後回報裡，不要自己修。
Bash 指令長度上限約 8000 字元，大檔案一律用 Write 工具寫。

## 來源（唯一的事實依據）

- `SP/decks/chN.txt`：原始講義逐頁文字。
- `SP/site/chN/slides/s-01.jpg …`：網站上給學生看的美化版講義（頁碼以這個為準，1 起算）；`SP/site/chN/sheet.jpg` 是全部投影片的縮圖總表。用 Read 工具看圖。
- `SP/site/chN/episodes.json`：本章四集短片的標題、講義範圍、每個場景的起始時間（`t`，如 `0:36`）與逐句字幕。
- `SP/line/storyboards/chN.md`：四集分鏡；`SP/line/storyboards/00_全系列總表與講義核對.md`：與講義不符之處、重算的統計量、影片補充內容。
- `SP/line/animations/ep_cNe1.js … ep_cNe4.js`：影片畫面程式，裡面有影片實際使用的資料與數字。

每一個數字都必須出自講義，或由講義資料直接重算（用 python 的 numpy／scipy 自己算一次，不要抄）。講義印的值與重算值不同時，用重算值並寫明差異（核對文件已列出的更正要沿用）。影片裡出現過的數字，網站必須一致。自編的例子要寫明「自編例子」。

## 產出一：`content.json`

```json
{
  "id": 3,
  "title": "描述統計與常態分配",
  "eyebrow": "CH 03 / 06 · 描述資料",
  "lede": "兩句話：學生在這一頁會做什麼，要具體（用哪份資料、玩哪個工具）。",
  "objectives": ["3–4 條，取自講義的學習目標頁，改成學生做得到的動作"],
  "videos": [
    {"k": "ep1", "t": "EP1 四種測量尺度", "d": "一句話摘要這一集講什麼、用了什麼例子",
     "c": [["0:00", "標籤，14 字以內"], ["0:36", "…"]]}
  ],
  "concepts": [
    {"title": "概念標題", "text": "2–4 句，把這個概念講清楚，用講義的例子與數字。",
     "tip": "1–2 句。有互動工具時：明確告訴學生動手試什麼、應該看到什麼。沒有工具時：寫一個常見錯誤或小例子。"}
  ],
  "widgets": ["c3scales", "c3central", null],
  "epmap": [[0], [1], [2], [3]],
  "example": "一段貫穿本章的例子（講義的資料），3–4 句。",
  "slidesNote": "一句話：講義名稱與張數，例如「〈(三) 描述統計與常態分配〉，共 26 張。」",
  "stage3": {"tab": "動手算", "title": "動手算一次", "lede": "兩句話說明這一步要學生做什麼。"},
  "filesNote": "（選用）資料檔區塊的一句說明",
  "stepRefs": [["guide.md 裡某個 ### 或 #### 標題的開頭文字", [16], "一句話：這張講義與這一步的關係"]],
  "secRefs": [["guide.md 裡某個 ## 標題的開頭文字", [8], "一句話"]],
  "quiz": [
    {"id": "q1", "p": "題目", "o": ["選項", "選項", "選項", "選項"], "a": 2, "e": "為什麼對，1–3 句，帶數字"},
    {"id": "q7", "p": "數值題", "num": 48.35, "tol": 0.01, "unit": "ml/kg/min", "hint": "答錯時的提示", "e": "算式與答案"}
  ],
  "think": {"p": "一題不計分的思考題", "answer": ["參考答案，2–3 點"], "check": ["自我檢核，2 點"]},
  "hw": {"title": "作業主題", "source": "出處，例如「講義第 5 張練習與表 3-1」",
    "questions": [
      {"id": "h1", "type": "long", "p": "題目", "ref": "<h4>參考結果</h4><p>…</p>（可用 <div class=\"tbl-wrap\"><table>…</table></div>）"},
      {"id": "h2", "type": "single", "p": "…", "o": ["…"], "a": 0, "e": "…"},
      {"id": "h3", "type": "multi", "p": "…", "o": ["…"], "a": [0, 2], "e": "…"},
      {"id": "h4", "type": "num", "p": "…", "num": 3.05, "tol": 0.01, "hint": "…", "e": "…"}
    ]}
}
```

規則：

- `videos` 剛好 4 集，`k` 依序 ep1–ep4，`t` 為「EPn 」加 episodes.json 的標題。`c` 每集 5–8 個時間碼，時間必須是 episodes.json 裡某個場景的 `t`（照抄），標籤 14 字以內，說出那一段在講什麼。
- `concepts` 5–6 個，依影片順序。`widgets` 與 `concepts` 等長，沒有工具填 `null`。`epmap` 是四段，每段列出那一集之後要接的概念索引（0 起算），每個概念剛好出現一次。每一集至少接一個概念；整章至少 3 個互動工具，能放工具的概念盡量放。
- `quiz` 剛好 8 題：6–7 題四選一、1–2 題數值題。正確選項的位置要分散（同一位置最多 3 題）。題目考這一章真正容易錯的地方，用講義的真實數字。至少 1 題寫明「用上面的某某工具試試看」才答得出來。解說 1–3 句。
- `hw.questions` 5–6 題，四種題型都要有。講義有練習題的，優先改寫成作業；其他由講義資料出題。`long` 的 `ref` 給出完整的參考結果與「解讀方向」，數字只用重算過的值。
- `think` 一題，要學生判斷或解釋，不是計算。
- 文字裡不要出現 LaTeX。上下標用 Unicode（x̄、X²、√、Σ、χ²、α、β、μ、σ）。

## 產出二：`guide.md`（步驟 3 的內容）

這一步讓學生自己動手把講義的計算做一遍（第 1 章是重點整理，第 2 章是軟體操作）。格式：

- 開頭一小段前言（不加標題）。
- 4–7 個 `## 小節`。每個小節在頁面上是一個可收合、可標記「完成這一節」的區塊，所以每節要是一件能做完的事。
- 小節內可用 `###`／`####` 小標、段落、`- ` 清單、`1. ` 編號清單、表格（`| a | b |`）、``` 程式碼區塊（放 Excel 公式或 SPSS 語法）、`**粗體**`、`` `行內程式碼` ``。其他 markdown 語法（連結、斜體、LaTeX、巢狀清單）不支援，不要用。
- 計算類小節的寫法：先說要算什麼、用哪份資料（寫出資料檔檔名，檔名會自動變成下載連結）；列出手算步驟與中間值；再給 Excel 的做法（函數名稱要正確，例如 AVERAGE、MEDIAN、MODE.SNGL、STDEV.S、STDEV.P、VAR.S、CORREL、SLOPE、INTERCEPT、T.TEST、CHISQ.TEST、NORM.S.DIST）；最後一句話說明結果怎麼解讀。SPSS 的選單路徑只在你確定時才寫，不確定就只寫 Excel。
- 最後一節固定為「## 講義更正與說明」：列出核對文件中屬於本章的更正（講義怎麼寫、正確是什麼、為什麼），以及影片補充而講義沒有的內容。沒有更正的章，寫影片與講義的對應關係。
- `stepRefs`／`secRefs` 把有對應講義頁的小標接到投影片（頁面會在該標題下顯示講義縮圖）。標題文字必須是 guide.md 裡真實標題的開頭，且唯一。3–8 個。

## 產出三：`data/` 資料檔與 `data/manifest.json`

把本章講義裡學生需要動手算的表格做成 CSV（UTF-8 加 BOM，Excel 才不會亂碼；第一列是欄名，欄名用中文或簡短英文）。檔名用英數（例如 `table3-1_vo2max.csv`）。
`manifest.json`：`[{"file": "table3-1_vo2max.csv", "label": "表 3-1　65 位學生的 VO₂max", "ext": "CSV"}]`。
資料必須逐格對照講義投影片圖片，再用總和或筆數驗證（核對文件已記錄部分總和）。沒有可下載資料的章可以不建 data/。

## 產出四：`widgets.js`（本章的互動工具）

每個工具是 `W.名稱=(w,CH)=>{ … }`，`w` 是頁面給的容器（`div.widget`）。名稱一律加章號前綴（`c3central`），避免和別章衝突。檔案會被接在 `gen2/prelude.js`、`gen2/widgets.js` 之後、同一個函式作用域內（`'use strict'`），所以：

- 可直接使用：`$ $$ esc fmt el（建立 SVG 元素） niceStep`、統計函式庫 `ST`（pnorm dnorm qnorm pt dt qt pf pchisq mean sd ols rng rnorm ranks spearman …）、`SV axisX axisY pathOf sliders bindSliders val segHTML segBind statsHTML fp f2 curve curveArea`。先讀 `SP/site/gen2/widgets.js` 看既有工具（W.normal、W.corr、W.chi2、W.ttest、W.anova、W.tails）的寫法。既有工具的預設資料是別門課的，不能直接用名字引用；需要類似功能時，把程式複製到你的檔案、改名、把預設值換成本章講義的資料。
- 檔案頂層不要宣告會撞名的常數或函式；輔助函式放在工具函式裡面，或加章號前綴。
- 樣式只用既有 class：`.widget-title .in-row .num-in .slider-row .stats/.stat（可加 mean、med） .readout .legend .note .btn .seg .controls .tbl-wrap`；圖表 `.chart svg` 內的 `axis grid curve area-p area-r`；另外 `gen2/theme.css` 提供 `.wtbl`（小表格，`tr.sum` 合計列，`.hl` 強調格）、`textarea.nums`、`.formula`（算式列，`<b>`、`<i>` 兩種強調色）、`.tagrow/.tag`（選項鈕，`.on .right .wrong`）、圖表用 `.pt .pt2 .ln .ln2 .dash .bar .bar2 .must .lnm`。真的不夠才用行內 style，顏色一律用 CSS 變數（`var(--accent)` 海軍藍、`var(--amber)` 粉紅、`var(--mustard)` 芥末黃、`var(--ink) --muted --line --soft --surface --bg --ok --bad`），不可寫死色碼（頁面有深色模式）。
- 每個工具要做到：參數可調且有合理預設（預設值＝講義或影片的資料）、改了立刻重算、圖和數字並陳、有一句 `.readout` 用白話解讀目前的狀態、有「講義資料」之類的預設鈕可以回到原始資料。預設狀態下顯示的數字必須等於講義重算值。
- 手機寬度 390px 不可水平溢出：SVG 用 viewBox，表格包在 `.tbl-wrap` 裡。
- 元素 id 要加章號前綴，避免同頁其他工具撞 id。

## 建置與檢查（在 `SP/site` 目錄執行）

```
python -X utf8 build_site.py out N --no-video
python -X utf8 shot.py out N learn
python -X utf8 shot.py out N learn --mobile
python -X utf8 shot.py out N spss
python -X utf8 shot.py out N quiz
python -X utf8 shot.py out N homework
```

- `build_site.py` 會檢查格式（題數、時間碼、標題對應、資料檔、簡體字…），必須印出「檢查通過」。
- `shot.py` 產生整頁截圖並回報 console 錯誤、載入失敗的工具、水平溢出；一定要用 Read 工具把截圖打開來看。可加 `--js "…"` 先在頁面執行一段 JS（例如改輸入值並觸發 `input` 事件、點按鈕）再截圖，`--clip "#w2"` 只截某個工具，`--tag 名稱` 另存檔名。用這個方式確認每個工具改了參數真的會重算，結果合理。
- 版面要檢查：字有沒有重疊或被切、圖表座標軸是否合理、手機版是否溢出、表格是否太寬。
- 寫完後自己從頭到尾讀一遍 content.json 與 guide.md，像學生第一次看到一樣，改掉講不清楚或跳步的地方。

## 完成後回報

1. 寫了哪些檔案；每個互動工具一句話說明。
2. 你重算過哪些數字、與講義或核對文件有無出入。
3. 沒辦法從來源確認、需要老師看的地方。
4. 框架的問題或建議（如果有）。
