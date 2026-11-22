# 交接說明：真實世界運動大數據分析

給在老師電腦上接手的 Claude Code 工作階段。

## 目前狀態

- 課綱、18 週講義、範本、簡報原始檔：本分支 `real-world-sports-data/course-materials/`（`robbinlin/robbinlin` 的 `claude/gracious-allen-8r8q5t` 分支留有同一份舊副本，以本分支為準）。
- 課程網站已公開：https://robbinlin.github.io/teaching/real-world-sports-data/
  - 原始檔與產生程式在本分支 `real-world-sports-data/`（`gen/build_rwd.py`，說明見 `README.md`）。
  - 公開版在 `gh-pages` 分支的 `real-world-sports-data/` 資料夾。
- 影片：第 1–8、10–16 週各一集已完成並上傳 YouTube，影片 ID 與時間軸已填進 `gen/content/wNN.json`，縮圖在各週 `thumbs/`。第 9、17、18 週（期中與期末）沒有影片。
  - 動畫：`animations/episodes_rwd.js`；旁白稿與時間軸：`animations/voice/`；分鏡：`animations/storyboards/`；上傳包：`animations/youtube/package_rwd/`。
  - 影片檔（mp4）不在儲存庫。

## 接下來要做

- 修改 `gen/content/` 或講義後，用 `python3 gen/build_rwd.py .` 重新建置，檢查頁面，再把 `index.html` 與 `w01`–`w18` 複製到 `gh-pages` 分支的 `real-world-sports-data/`。推送 `gh-pages` 前先取得老師同意。
- 講義有兩份：`course-materials/講義/`（教材）與 `gen/handouts/`（網站建置用），修改時兩處一起更新。

## 老師已決定的事

- 影片主角用火柴人風格。
- 規律運動定義為 `b9_1a >= 3 且 b9_2 = 1`（與 `survey4.sas7bdat` 的 `regular` 一致，全體 51.3%）。
- 網站不做登入，進度只存在瀏覽器。

## 尚待老師回覆

- 影片風格與語速是否可以，其餘 15 個教學週要不要照做（每週一集或多集）。
- 網站公開呈現課程資料檔的彙總數字，是否符合 SRDA 使用約定。
- 縣市代碼 2 是哪個縣市（未對照編碼簿，網站與影片只寫代碼）。
- ElevenLabs 金鑰存在雲端環境設定中，全部影片完成後建議輪換。
