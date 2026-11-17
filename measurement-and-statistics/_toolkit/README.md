# 體育測驗與統計 課程網站：製作程式

這個資料夾是網站的來源與產生程式。網站本體在上一層（`index.html`、`ch1/`…`ch6/`），直接用瀏覽器開 `index.html` 就能看。

底稿是「高等體育統計」網站的產生程式（`gen/`，原樣保留），`mkgen.py` 把它改成本課程的版本（`gen2/`）：課名、六章、海軍藍配色、影片改成在頁面上直接播放本機 mp4、localStorage 前綴 `mstat-`。

## 檔案

| 檔案 | 用途 |
|---|---|
| `prep.py` | 講義 pptx 轉 PDF 與圖片（用本機 PowerPoint）、由短片時間軸產生 `episodes.json` 與縮圖 |
| `mkgen.py` | 由 `gen/` 產生 `gen2/`（每個替換都有 assert） |
| `gen2/theme.css` | 本課程的配色與新增樣式 |
| `build_site.py` | 建置各章頁面並檢查內容格式；不給章號時連首頁一起建 |
| `home.py` | 首頁 |
| `shot.py` | 無頭瀏覽器截圖並回報 console 錯誤 |
| `SPEC.md` | 每章內容的撰寫規格 |
| `chN/` | 每章來源：`content.json`、`guide.md`、`widgets.js`、`data/`、`slides/`、`thumbs/`、`episodes.json` |

## 常用指令（在這個資料夾執行）

```
python -X utf8 build_site.py ..            重建全站（含複製 720p 影片）
python -X utf8 build_site.py .. 3          只重建第 3 章
python -X utf8 build_site.py .. --no-video 不複製影片
python -X utf8 shot.py .. 3 learn          截圖檢查第 3 章的步驟 1
```

需要：Python（playwright、pymupdf、pillow）、ffmpeg；重轉講義需要 PowerPoint。

## 影片

`build_site.py` 從 `動畫短片/成品_單線插畫風/第N章/` 複製 720p 檔到 `chN/video/epM.mp4`。短片重新輸出後，重跑一次建置就會換成新檔。
之後若改放 YouTube，在 `content.json` 的每集加上 `"id": "YouTube 影片 ID"`，頁面會自動改成連到 YouTube。

## 尚未設定

- 登入與雲端進度（Firebase）、教師頁：目前進度只存在學生自己的瀏覽器。底稿的 `gen/auth.js`、`gen/teacher.html` 可沿用，需要先建立 Firebase 專案。
- 發佈：尚未放上 GitHub Pages。
