# 交接說明：真實世界運動大數據分析

給在老師電腦上接手的 Claude Code 工作階段。

## 目前狀態

- 課綱、18 週講義、簡報原始檔：`robbinlin/robbinlin` 的 `claude/gracious-allen-8r8q5t` 分支，`1152-RWD-course/`。
- 課程網站已公開：https://robbinlin.github.io/teaching/real-world-sports-data/
  - 原始檔與產生程式在本分支 `real-world-sports-data/`（`gen/build_rwd.py`，說明見 `README.md`）。
  - 公開版在 `gh-pages` 分支的 `real-world-sports-data/` 資料夾。
- 第 6 週試做影片（火柴人版，3 分 04 秒）已完成，尚未上傳 YouTube。
  - 動畫：`animations/episodes_rwd.js`；旁白稿與時間軸：`animations/voice/eprw6e1_*`；分鏡：`animations/storyboards/RWD_第6週_驗證與除錯_分鏡.md`。
  - 上傳包：`animations/youtube/package_rwd/01_w06_ep1/`（標題、說明、章節、標籤、字幕、縮圖），壓縮檔 `animations/youtube/RWD_W06_EP1_youtube.zip`。
  - 影片檔不在儲存庫。老師已從雲端對話下載 `RWD_W06_EP1_720p.mp4`，請先問檔案放在哪裡。

## 接下來要做

1. 用老師電腦上已登入的瀏覽器，把 `RWD_W06_EP1_720p.mp4` 上傳到 YouTube Studio。
   - 標題用 `title.txt`，說明用 `description.txt`，標籤用 `tags.txt`，字幕上傳 `subtitle_zh-TW.srt`（中文（台灣）），縮圖用 `thumbnail.jpg`。
   - 建議設定：不公開、教育類、非兒童內容。公開與否由老師決定，上傳前先確認。
   - 不要經手老師的密碼；瀏覽器沒有登入就請老師自己登入。
2. 拿到影片 ID 後，填進網站第 6 週：
   - 編輯 `real-world-sports-data/gen/content/w06.json` 的 `videos`：
     ```json
     [{"k": "ep1", "id": "<YouTube ID>", "t": "EP1 沒有錯誤訊息的錯誤",
       "d": "程式跑完、沒有錯誤訊息，結果就是對的嗎？三個真實案例與三個檢查。",
       "c": [["0:00", "2013 年的試算表錯誤"], ["0:35", "程式跑完就是對的嗎"], ["0:55", "案例一：消失的縣市"],
             ["1:27", "案例二：else 與分母"], ["2:01", "案例三：軸寫百分比"], ["2:31", "三個檢查"], ["2:53", "結語"]]}]
     ```
   - 把上傳包的 `thumbnail.jpg` 複製成 `real-world-sports-data/w06/thumbs/ep1.jpg`。`build_rwd.py` 每次建置會重建各週資料夾，所以要在建置後再放一次，或改 `build_rwd.py` 讓它複製縮圖。
   - 重新建置：`RWD_SLIDES=<投影片圖片資料夾> python3 gen/build_rwd.py .`。投影片圖片目前只存在已建好的 `wNN/slides/`；重建前先把它們備份成 `RWD_SLIDES` 指向的資料夾（每週一個 `wNN/`，內含 `s-01.jpg…` 與 `deck.pdf`）。
   - 檢查第 6 週頁面後，提交到本分支，並把 `index.html` 與 `w01`–`w18` 複製到 `gh-pages` 分支的 `real-world-sports-data/`。推送 `gh-pages` 前先取得老師同意。

## 老師已決定的事

- 影片主角用火柴人風格。
- 規律運動定義為 `b9_1a >= 3 且 b9_2 = 1`（與 `survey4.sas7bdat` 的 `regular` 一致，全體 51.3%）。
- 網站不做登入，進度只存在瀏覽器。

## 尚待老師回覆

- 影片風格與語速是否可以，其餘 15 個教學週要不要照做（每週一集或多集）。
- 網站公開呈現課程資料檔的彙總數字，是否符合 SRDA 使用約定。
- 縣市代碼 2 是哪個縣市（未對照編碼簿，網站與影片只寫代碼）。
- ElevenLabs 金鑰存在雲端環境設定中，全部影片完成後建議輪換。
