# 多變量資料分析（Multivariate Data Analysis）

多變量統計課程的互動教材：一座 3D 書房，書架上有 12 本「研究案件」紙本書。主角沈以安走到書架前選書，每本書以故事、研究決策與 3D 模型動畫講解一章內容。

## 直接開啟

用 Chrome 或 Edge 開 `paperbooks/out/index.html`（需要網路，Three.js／GSAP 從 CDN 載入）。

- 點地板或 WASD／方向鍵走路；點書背或靠近書架按 Enter 取書，再按「翻開這本書」。
- 書中點書頁或按空白鍵翻頁；模型頁會自動播放 3D 動畫，可拖曳旋轉；右上角「回書房」。
- `paperbooks/out/list.html` 是不用 3D 的書目清單。

## 書目

| 編號 | 書 |
|---|---|
| CASE 00 | MULTIVARIATE：消失的維度（三幕完整案例） |
| 01 | 敘述統計與資料視覺化 |
| 02 | 平均值檢定 |
| 03 | 共變數分析（ANCOVA） |
| 04 | 重複測量設計 |
| 05 | MANOVA |
| 06 | 迴歸分析 I |
| 07 | 迴歸分析 II |
| 08 | 邏輯斯迴歸 |
| 09 | 調節與中介 |
| 10 | 驗證性因素分析 |
| 11 | 投稿常見的統計謬誤 |

## 結構

```
multivariate.html               最早的 3D 互動故事版（單檔）
multivariate_paper_act1.html    紙本書版原型（第一幕）
paperbooks/
  engine.html     書本引擎（/*__BOOK__*/ 注入書本 JSON）
  library.html    3D 書房模板（/*__LIB__*/ 注入書目）
  build.py        驗證 + 輸出 out/*.html
  playtest.js     Playwright 自動試玩到結局
  SPEC.md         書本 JSON 撰寫規格（模型類型、steps、viz 頁…）
  books/*.json    12 本書的內容
  src/*.txt       各章講義抽出的文字
  out/            建好的單檔 HTML（可直接開）
```

## 重建

```bash
cd paperbooks
python build.py --all          # 驗證全部書並輸出到 out/
node playtest.js out/<書名>.html   # 需要 playwright
```

改視覺或互動 → 改 `engine.html` / `library.html`；改內容 → 改 `books/*.json`，然後重建。
