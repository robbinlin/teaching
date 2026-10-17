# 05 檢查、輸出、交付、YouTube 包

## post.sh（scripts/post.sh <key>v <分享檔名> <截圖表列數>）
1. `ffprobe` 長度；2. loudnorm 量測（input_i 應 ≈ −16）；
3. 逐秒截圖表 `out/check/<key>v_sheet.jpg`（fps=1、每張 320 寬、每列 10 張；列數 = ceil(秒數/10)）；
4. `out/share/<名稱>_720p.mp4`（crf 23，音訊 copy）；5. `out/share/<key>_small.mp4`（crf 27、128k，<30 MB 給聊天室）。
一定用 Read 看截圖表，這是最後一道能抓到版面錯誤的檢查。

## 分享檔名
`第N章_EPn_主題_720p.mp4` / `_1080p.mp4`。1080p 就是 `out/ep<key>v.mp4` 改名。

## 交付順序
1. 小檔 + 截圖表傳聊天室（SendUserFile）。
2. git：commit episodes.js / characters.js / lines.json / timeline.js / storyboards；wav、mp4、cache 不進 repo。
3. 雲端硬碟：若只能用「檔案請求」上傳，用 Playwright 拖放腳本；上傳後用 API 查檔案大小與本機核對（曾發生轉檔未完就上傳到半截）。
   檔案請求會在檔名前加上傳者名稱前綴，交付時告訴使用者可以改名。
4. 提醒：關閉檔案請求、輪換 API 金鑰。

## 字幕 SRT（scripts/make_srt.py）
從 `voice/ep<key>_timeline.js` 產生：每句 = 場景 t0 + 句 t0/t1，顯示字幕用 `disp`。
輸出 UTF-8 **含 BOM**、**CRLF**（繁中 Windows 記事本否則顯示亂碼）。YouTube 接受帶 BOM 的 srt。

## YouTube 上傳包（曾經出錯兩次，以下是最終正確做法）
- 所有檔名英數：`01_ch1_ep1/{title.txt, description.txt, tags.txt, subtitle_zh-TW.srt, thumbnail.jpg, playlist.txt, video_file.txt}`。
  zip 內的中文檔名在 Windows 會亂碼或整個被跳過（「srt 資料夾是空的」）。
- 所有 txt/srt/md：UTF-8 BOM + CRLF。
- 說明文字結構：一句摘要 → 課程／老師／第幾集 → 課程網站 → 「章節」時間戳 → 本集重點 → 資料來源 → 製作說明與 hashtag。
  章節時間戳規則：第一個 0:00、至少 3 段、每段 ≥ 10 秒，否則 YouTube 不生成章節。章節名稱用人工寫的 labels（自動抽第一句太長）。
- 縮圖 1280×720：從 1080p 抽一格（約 40–60% 處，避開空畫面），背景放大 118% 把影片自己的左上標籤裁掉，
  下方淡色漸層帶 + 「第N章・EPn」＋標題（用與影片相同字型），Playwright 截圖 jpg 品質 88。做一張 4×6 總表檢查。
- 標籤：課程名、統計學、生物統計、各章關鍵詞 6–8 個。播放清單每章一個，附說明。
- 建議設定：不公開、教育類、中文（台灣）、非兒童內容。
- `youtube_metadata.json` 保留全部欄位，以後改用 YouTube Data API 上傳時直接用。

## 上傳到 YouTube 的兩條路
- API：使用者建 Cloud 專案 + OAuth「電視與受限輸入裝置」用戶端，用裝置碼流程授權，預設配額約 6 支/天。
- 人工／瀏覽器代操作：需要使用者本機已登入的瀏覽器（Claude in Chrome 或桌面版內建瀏覽器），雲端工作階段做不到，也不應經手使用者密碼。
