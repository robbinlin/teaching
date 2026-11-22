# 真實世界運動大數據分析專題討論：課程自學網站

靜態網站，放在 GitHub Pages 即可使用。首頁 `index.html`，各週 `w01/`…`w18/`。

- 每週五個步驟：概念與互動工具、投影片、講義、自我檢測、課後作業。
- 進度與作答只存在瀏覽器（localStorage，key 前綴 `rwd-w`）。沒有登入與教師頁。
- 影片：目前各週 `videos` 為空。影片上傳後，在 `gen/content/wNN.json` 的 `videos` 填入 YouTube ID 與時間軸，並在該週資料夾放 `thumbs/<k>.jpg`，重新建置。

## 課程教材

`course-materials/` 放課綱（`00_課綱.md`）、18 週講義（`講義/`）、空白範本、Word 版（`docx/`）、簡報原始檔（`簡報原始檔/`）與簡報連結清單（`course-materials/README.md`）。網站建置用的講義副本在 `gen/handouts/`，修改講義後兩處要一起更新。

## 重新建置

```
python3 gen/build_rwd.py .
```

輸入：`gen/content/wNN.json`（每週內容）、`gen/widgets_rwd/*.js`（互動工具）、`gen/handouts/WNN.md`（講義，建置時去掉「時間配置」與「教師備註」）、投影片圖片（環境變數 `RWD_SLIDES`，每週一個資料夾，內含 `s-01.jpg…` 與 `deck.pdf`；已建置的圖片在各週 `slides/`）。

## 資料

`gen/facts.json` 是由課程衍生檔 `survey4.sas7bdat`（108 學年度學生運動參與情形調查，37,822 人）重算的彙總數字。原始資料不在此儲存庫。互動工具中標示「模擬資料」者使用固定種子的模擬資料。

## 互動工具

| 週 | 工具 | 內容 |
|---|---|---|
| 1 | decide5 | 四個分析決策，十六種規律運動比例（51.3%–83.2%） |
| 2 | qtype | 研究問題分類：描述、預測、因果 |
| 3 | spec | 規格書沒寫的決策會留下幾種答案 |
| 4 | nacmp | 遺漏值比較在 SAS、R、pandas 的差別 |
| 5 | joinrows | 先預測合併後的列數，再看結果 |
| 6 | bughunt | 三個不會報錯的錯誤（真實數字） |
| 7 | axis | y 軸起點與信賴區間 |
| 8 | bign、fwer | 樣本數與 p 值；多重比較 |
| 10 | orrr、simpson | 勝算比與風險比；調整變項改變方向 |
| 11 | leak | 資料洩漏：全雜訊特徵也能得到高 AUC |
| 12 | kmeans | 分群與換種子的穩定性 |
| 13 | dagadj | 混淆、中介、衝突因子：調整與不調整 |
| 14 | psm | 卡尺、配對、加權與平衡 |
| 15 | evalue | E-value 計算 |
| 16 | disclose | AI 使用揭露段落產生器 |
