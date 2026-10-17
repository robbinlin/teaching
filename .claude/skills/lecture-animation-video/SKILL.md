---
name: lecture-animation-video
description: 把課程講義（pptx/pdf/課程網站）做成「容易理解的手繪風短片」的完整生產線：分鏡（真實資料重算＋有出處的故事點）→ Canvas 手繪動畫 → ElevenLabs 中文旁白（API、逐句快取、ASR 回聽）→ 音量穩定（逐句等響度、兩段式 loudnorm、固定音樂底）→ 逐秒截圖檢查 → MP4 輸出、字幕、YouTube 上傳包。只要使用者提到「講義做成影片／動畫／短片」、「教學影片」、「配旁白／ElevenLabs／TTS」、「影片聲音忽大忽小」、「字幕 SRT」、「上傳 YouTube 的文案與縮圖」，即使沒說「skill」也要用這個 skill。
---

# 講義 → 手繪動畫教學短片

這份 skill 記錄的是一條已經跑過 24 支影片（8 章 × 3 集，高等體育統計）的完整流程，
以及每個環節踩過的坑。目標是讓下一次只要換講義，就能用同樣的品質產出。

## 一句話版流程

```
講義/網站 → 分鏡（確認）→ 旁白稿 lines.json → TTS + ASR 回聽 → 動畫程式碼
→ 預覽截圖修版面 → 全片渲染（音樂＋旁白混音＋響度正規化）→ 逐秒截圖表／響度檢查
→ 720p/1080p/小檔 → 傳給使用者看 → commit/push → Dropbox → 字幕與 YouTube 包
```

每一章 3 集、每集 1.5–3 分鐘。先做第 1 章給使用者確認風格與語速，之後各章可連續做。

## 工作目錄慣例

```
animations/
  engine.js characters.js props.js audio.js episodes.js index.html render.cjs
  voice/ep<key>_lines.json   旁白稿（commit）
  voice/ep<key>_timeline.js  TTS 算出的場景/字幕時間（commit）
  voice/ep<key>_voice.wav    旁白音軌（不 commit）
  voice/cache/*.pcm          逐句 TTS 快取（不 commit）
  out/ep<key>v.mp4 out/check/*_sheet.jpg out/share/*_720p.mp4 ...
storyboards/第N章_xxx_分鏡.md
```
`key` 例如 `c5e1`；配音版的 key 是 `c5e1v`。API 金鑰只放在 scratchpad（chmod 600），不進 repo、不進雲端硬碟，做完提醒使用者輪換。

## 八個階段（細節看 references/）

1. **讀講義、核對數字** → `references/01-storyboard.md`
   用 python-pptx 抽文字；課程網站用 Playwright 走一遍；講義提到的資料集真的下載下來用 pandas/scipy/statsmodels 重算。
   講義與網站不一致時以重算為準，並在影片與分鏡註明。
2. **分鏡** → 同上。每集：1 個有年代、有出處的歷史故事開場（網路查證，連結留在分鏡檔）、2–4 個講義例題、1 個作業、1 句總結。
   分鏡給使用者確認後才寫程式；確認的那一句常常也包含風格指示（「用原子筆」「慢一點」）。
3. **旁白稿與 TTS** → `references/02-narration.md`
   每句有 `disp`（字幕）與 `say`（口語稿）。口語稿全中文，不能出現單獨的拉丁字母（n、z、r、p 會被唸成怪音），
   數字寫成中文讀法。`scripts/lint_lines.py` 先掃一遍，再跑 `scripts/tts.py <key> elevenlabs`，
   再用 `scripts/asr_check.py` 把每句回聽辨識，對照原文找唸錯的地方。
4. **音量穩定** → `references/03-audio-loudness.md`
   使用者抱怨「忽大忽小」的根因有三：ElevenLabs 逐句音量不一、音樂閃避造成抽吸、整體只做峰值正規化。
   解法已寫進 `scripts/tts.py`（逐句等響度）與 `scripts/mix_audio.sh`（dynaudnorm → 壓縮 → 固定 0.22 音樂底 → 兩段式 loudnorm −16 LUFS）。
5. **動畫程式** → `references/04-animation.md`
   每個場景是 `{ beats:[...], draw(lt){...} }`；`beats` 讓場景動作跟著旁白句子走。內容只畫到 y≈900，底下是字幕框。
6. **預覽與渲染** → 同上。先 `node render.cjs preview <key>v t1,t2,…` 看關鍵秒數，修版面碰撞，再 `node render.cjs full <key>v`。
   4 核機器可同時跑 2 支。別用 `pkill -f render` 之類會殺到自己 shell 的指令。
7. **檢查與輸出** → `references/05-delivery.md`
   `scripts/post.sh` 一次做：長度、LUFS 量測、逐秒截圖表（一定要用 Read 工具真的看圖）、720p、小檔。看完截圖才算檢查過。
8. **交付** → 同上。小檔先傳聊天室讓使用者看，commit/push，再上傳雲端；上傳後核對檔案大小。字幕與 YouTube 包的檔名要英數、文字檔要 UTF-8 BOM＋CRLF。

## 這些坑不要再踩

- **中英夾雜**唸起來怪 → 口語稿全中文：t 檢定寫「踢檢定」、p 值「批值」、α「阿法」、r「相關係數」、z「標準分數」、n「樣本數／很多次」。
- **句首專有名詞**容易糊（「斯皮爾曼係數是…」）→ 前面墊幾個字（「斯皮爾曼等級相關的係數，則是…」）。
- **ASR 回聽**出現原文沒有的詞（例如多了「其實」）→ 那句重寫、刪快取重合成，而不是放過。
- **OfflineAudioContext** 在長片會超線性變慢（40 秒要 32 秒、160 秒要幾分鐘）→ 音樂分 30 秒一段、3 秒預滾渲染後拼接（見 03）。
- **預覽截圖**是唯一能抓到的版面問題：字壓到表格、圖超出字幕區、角色遮住重點。每支至少看一張逐秒總表。
- **雲端硬碟的檔案請求**可能在轉檔沒完成時就上傳到半截 → 上傳後用 API 查大小核對。
- **zip 裡的中文檔名**在 Windows 會亂碼甚至被跳過；**無 BOM 的 UTF-8 txt/srt** 會被繁中 Windows 當 Big5 → 英數檔名、BOM、CRLF。
- **講義裡的數字**可能與資料不符（係數單位、組合數）→ 重算，影片用重算值並註明。
- 沒有金鑰或 API 掛掉時可退回離線 Kokoro（sherpa-onnx），但中文男聲品質較差，只當備援。

## 給使用者的溝通節奏

- 每章開始前只貼分鏡摘要與要確認的事項，不要貼整份程式碼。
- 渲染中先回報「已開始渲染，約 N 分鐘」，完成後傳小檔（<30 MB）＋一張截圖總表。
- 使用者說「繼續做完」就不再逐章確認，但每章仍然交付預覽與 commit。
