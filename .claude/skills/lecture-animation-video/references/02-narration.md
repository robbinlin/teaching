# 02 旁白稿、ElevenLabs TTS、ASR 回聽

## lines.json 格式（voice/ep<key>_lines.json）
```json
{
 "voice_sid": 60, "speed": 0.95, "el_speed": 0.95,
 "elevenlabs_voice_id": "<voice id>", "elevenlabs_model": "eleven_v3",
 "scenes": [
  [ {"disp": "字幕原文（可含英數、符號）", "say": "口語稿（全中文）", "say_el": "ElevenLabs 專用口語稿，省略則用 disp"} ],
  [ ... ]
 ]
}
```
`scenes` 的長度與順序必須和 episodes.js 裡該集的 `scenes` 一一對應；每句對應一個 `beats` 時間點。

## 口語稿規則（為什麼：TTS 看到單獨字母會唸成英文字母名或怪音，中英夾雜被使用者點名「念起來很奇怪」）
| 字幕寫法 | 口語稿寫法 |
|---|---|
| t 檢定 | 踢檢定 |
| p 值 / P < .05 | 批值 / 批值小於零點零五 |
| α、β | 阿法、貝他 |
| z、z 分數 | 標準分數 |
| r、ρ | 相關係數、斯皮爾曼係數 |
| n、n = 40 | 樣本數、四十個人、很多次（看語意） |
| σ/√n | 標準差除以根號樣本數 |
| χ²、U | 卡方、曼惠特尼統計量 |
| F、DHA、WHI 等大寫縮寫 | 可保留，TTS 唸英文字母名還算自然；但單一小寫變數名一律改中文 |
| 1,504,628 | 一百五十萬零四千六百二十八（長數字可改「約一百五十萬」） |
| Bonferroni、Kruskal–Wallis | 邦費羅尼、克魯斯卡瓦利斯（或中文意譯＋人名） |
| 95% CI | 百分之九十五信賴區間 |
- 句首避免放多音節譯名；前面墊「這個」「所謂的」等。
- 字幕一句不超過約 60 字（字幕框 1640 px、50 px 字，自動折成兩行）；口語稿可以比字幕更口語、更長一點。
- 先跑 `scripts/lint_lines.py voice/ep<key>_lines.json`：抓出 say 裡的拉丁字母、阿拉伯數字、過長句。

## ElevenLabs API（scripts/tts.py）
- 端點 `POST /v1/text-to-speech/{voice_id}?output_format=pcm_24000`，header `xi-api-key`。
- 模型：`eleven_v3` 中文最自然；它只接受 `voice_settings.stability` ∈ {0, .5, 1}，不支援 `previous_text`。
  `eleven_multilingual_v2` 可用 `speed`、`style`、`previous_text`（接前兩句維持語氣）。
- 聲音挑選：`GET /v1/shared-voices?language=zh&gender=male&age=young`，描述含 taiwan 的優先；
  做 3–4 個候選各合成同一段 20 秒讓使用者聽（存 mp3 傳聊天室），由使用者選。
- 逐句快取：`voice/cache/<md5(voice|model|text)>.pcm`。某一句唸錯 → 改口語稿（文字變了 key 就變）或刪該快取重跑，其他句不重花錢。
- 金鑰：使用者在聊天貼的 key 存到 `scratchpad/.el_key`（chmod 600），用 `ELEVENLABS_API_KEY=$(cat …)` 帶入，
  不寫進任何會 commit 或上傳的檔案；交付時提醒輪換。
- 時間軸：每句前後留白 LEAD 0.6 s（首句 1.0）、句間 GAP 0.45 s、場景尾 TAIL 0.9 s、全片尾 4 s（留給資料來源卡）。
  跑完輸出 `voice/ep<key>_voice.wav` 與 `voice/ep<key>_timeline.js`。

## ASR 回聽（scripts/asr_check.py）
用 sherpa-onnx 的 paraformer 中文小模型把每一句切出來辨識，和 `say` 逐句並排印出。
看的重點不是逐字正確率，而是：
- 多出原文沒有的詞（TTS 幻聽，常在句尾）→ 重寫該句；
- 專有名詞糊掉 → 前面墊字；
- 英文字母被唸成怪音 → 改中文。
修完刪該句快取重跑 TTS，再回聽一次，直到沒有新問題。

## 備援
沒有金鑰或 API 失敗：`scripts/tts.py <key> <kokoro 模型資料夾>` 用離線 Kokoro（sherpa-onnx）。品質較差，只做預覽用。
