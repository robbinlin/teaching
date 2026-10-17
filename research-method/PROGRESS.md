# 研究法課程網站：進度（2026-10-17）

## 已完成
- 課程網站原型 `course.html`（第 1 章五個單元可玩：判斷、排序、填寫範本、AI 回饋；答案只存學生瀏覽器；第 2–5 章鎖定）。
  已發佈 artifact：https://claude.ai/artifact/WdrCdnc7YsiyGbjWBGUJmD
- 第 1 章分鏡 `storyboards/第1章_緒論_分鏡.md`（5 支，對應 1.1–1.5；資料來源尚需逐篇核對）。
- 旁白稿 `animations/voice/epm1e1~5_lines.json`（lint 通過）；產生腳本 `tools/mk_lines.py`。
- EP1 動畫 `animations/episodes_m1.js`（角色：小研、指導教授）。

## 待辦
1. 在研究室桌機跑 ElevenLabs 配音：`cd animations/voice && ELEVENLABS_API_KEY=… ELEVENLABS_VOICE_ID=jEEldhZPwU4gikRKvJJz python3 -I tts.py m1e1 elevenlabs`（金鑰用環境變數，不要進 repo）。
2. ASR 回聽 → 修錯 → `node render.cjs full m1e1v`。
3. 確認 EP1 風格後，畫 EP2–EP5。
4. 影片上傳 YouTube 後，把連結填進 `course.html` 的 `VIDEOS`，重新發佈。
5. 第 2–5 章單元內容。
6. 實際點測 AI 回饋與下載按鈕。

注意：先前聊天中貼過的 ElevenLabs 金鑰請輪換。
