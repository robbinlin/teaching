# 研究法課程網站：進度（2026-10-17）

## 已完成
- 課程網站原型 `course.html`（第 1 章五個單元可玩：判斷、排序、填寫範本、AI 回饋；答案只存學生瀏覽器；第 2–5 章鎖定）。
  已發佈 artifact：https://claude.ai/artifact/WdrCdnc7YsiyGbjWBGUJmD
- 第 1 章分鏡 `storyboards/第1章_緒論_分鏡.md`（6 支，EP0 對應新增 1.0、EP1–EP5 對應 1.1–1.5；資料來源尚需逐篇核對）。
- 旁白稿 `animations/voice/epm1e1~5_lines.json`（lint 通過）；產生腳本 `tools/mk_lines.py`。
- EP1 動畫 `animations/episodes_m1.js`（角色：小研、指導教授）。

- 影片改為 6 支（EP0–EP5），標題一律問句式：EP0 如何選擇研究題目？／EP1 研究背景怎麼寫？／EP2 研究問題怎麼寫？／EP3 研究目的怎麼設立？／EP4 研究假設與名詞定義怎麼寫？／EP5 研究範圍與限制怎麼設定？
- EP0 分鏡與旁白稿 `epm1e0_lines.json` 已寫（開場故事 Warren／Marshall 待核對；動畫尚未畫、尚未配音）。
- EP1 已配音並渲染（`animations/out/epm1e1v.mp4`，成品存 Dropbox「Claude體育研究法/EP1」）。

- 課程網站擴充為五章 29 單元（第 1 章 6、第 2 章 6、第 3 章 6、第 4 章 5、第 5 章 6），全部開放；新增 2.6 APA 引註與參考文獻、3.6 研究倫理與 IRB、5.6 摘要與關鍵字；新增「論文初稿」總覽頁（題目＋摘要＋五章＋參考文獻）。
- 第 2–5 章內容依 F:\Dropbox\1151 國體 高等體育研究法 講義對齊（詳見專案文件 course-plan-by-lecture.md）。

- 網站內容加厚：29 單元都有可展開的「講義重點」（註明出處講義），10 個單元附標註範例；前後單元一鍵帶入；初稿頁「環環相扣」一致性檢查（含 Claude 檢查）。
- 四個工具：2.3 文獻矩陣（可匯出 CSV）、2.6 APA 產生器（清單進初稿參考文獻，中文筆畫、英文字母排序）、3.2 樣本數計算器（非中心 F 精確計算，與 G*Power 一致）、3.5 統計方法選擇精靈。
- 每章「讀一篇真論文」評析：謝易澂（2020）、Woodman & Hardy（2003）、Hatzigeorgiadis 等（2014）、聶喬齡等（2023）、Killham 等（2018）；網站只放書目、簡介與引導題，全文在課程資料夾。

## 待辦
1. 配音指令（Windows 要加 `-X utf8`）：`cd animations\voice; $env:ELEVENLABS_API_KEY="…"; $env:ELEVENLABS_VOICE_ID="jEEldhZPwU4gikRKvJJz"; python -X utf8 -I tts.py m1e0 elevenlabs`（金鑰用環境變數，不要進 repo；EP1 已完成，EP0、EP2–EP5 待做）。
2. ASR 回聽 → 修錯 → `node render.cjs full m1e1v`。
3. 確認 EP1 風格後，畫 EP0、EP2–EP5。
3b. 課程網站新增 1.0「選題」單元（對應 EP0），並在 `VIDEOS` 加 `1.0`。
4. 影片上傳 YouTube 後，把連結填進 `course.html` 的 `VIDEOS`，重新發佈。
5. 第 2–5 章影片：每份講義一支（清單見 course-plan-by-lecture.md），影片欄位先顯示「影片製作中」。
6. 實際點測 AI 回饋與下載按鈕。

注意：先前聊天中貼過的 ElevenLabs 金鑰請輪換。

## 2026-10-18 影片批次（全部 −16 LUFS，成品在 Dropbox「Claude體育研究法」各 EP 資料夾）
| 影片 | key | 長度 |
|---|---|---|
| EP00 研究是什麼？論文怎麼走？（研究方法與緒論） | m0e1 | 約 97 秒 |
| EP2 研究問題怎麼寫？ | m1e2 | 86 秒 |
| EP3 研究目的怎麼設立？ | m1e3 | 74 秒 |
| EP4 研究假設與名詞定義怎麼寫？ | m1e4 | 79 秒 |
| EP5 研究範圍與限制怎麼設定？ | m1e5 | 約 76 秒 |
| EP2-4 文獻探討怎麼寫？ | m2e4 | 99 秒 |
| EP2-6 參考文獻怎麼列？ | m2e6 | 97 秒 |
| EP3-1 研究設計怎麼選？ | m3e1 | 107 秒 |
| EP3-2 樣本數要收多少人？ | m3e2 | 98 秒 |
| EP3-3 問卷題目怎麼設計？ | m3e3 | 98 秒 |
| EP3-3b 信度是什麼？怎麼報告？ | m3e8 | 101 秒 |
| EP3-3c 效度是什麼？怎麼證明？ | m3e9 | 94 秒 |
| EP3-4 實驗設計有哪幾種？ | m3e4 | 111 秒 |
| EP3-5 統計方法怎麼選？ | m3e5 | 104 秒 |
| EP3-6 研究倫理與 IRB 怎麼送？ | m3e6 | 118 秒 |
| EP4-3 結果段落怎麼避免退稿？（Streiner 2007） | m4e3 | 約 97 秒 |
| EP4-5 結果與討論怎麼寫？ | m4e5 | 96 秒 |
| EP5-5 結論、建議與摘要怎麼寫？ | m5e5 | 97 秒 |

- 動畫檔：episodes_m1b.js（第 1 章 EP2–5、開場）、episodes_m2.js、episodes_m3.js、episodes_m45.js；分鏡：第1章、第3章、第2_4_5章 分鏡 md。
- course.html 的 VIDEOS 改為可一單元多支，已完成者顯示「已完成，待上傳」；上傳 YouTube 後填 url。
- 尚未做：2.1 文獻怎麼找（無獨立講義）、課綱 Extended Readings（待決定）。
- ElevenLabs 金鑰全部配音完成後請輪換。

## 2026-10-18 YouTube（不公開）
- 播放清單「高等體育研究法」（不公開，20 支，依新增日期排序）：https://www.youtube.com/playlist?list=PLToQ9czxCyH8
- 上傳檔為壓縮版（1080p、每支 < 10 MB，在 C:\Users\user\outputs\yt）；原始高畫質檔仍在 Dropbox。
- course.html 的 VIDEOS 已填入各支連結；開場 EP00：https://youtu.be/t_Bib8UZIQY（網站未掛單元）。

## 2026-10-18 第二批 7 支（補齊所有單元，網站 29 單元都有影片）
| 單元 | 影片 | YouTube |
|---|---|---|
| 2.1 | 文獻怎麼找？（m2e1，101 秒） | https://youtu.be/yd2rc5pTJ5Q |
| 2.2 | 一篇文獻怎麼讀、怎麼摘要？（m2e2，92 秒） | https://youtu.be/QhybkXPbk0I |
| 2.3 | 文獻矩陣怎麼做？（m2e3，84 秒） | https://youtu.be/HsNWOeD-sI4 |
| 2.5 | 假設怎麼從文獻導出？（m2e5，93 秒） | https://youtu.be/__LwfvV-NjM |
| 4.1、4.2 | 描述統計與圖表怎麼報？（m4e1，90 秒） | https://youtu.be/U7e5sYQBGlk |
| 5.1、5.3 | 討論怎麼寫出主要發現與意涵？（m5e1，88 秒） | https://youtu.be/Uhu8Z60wAgQ |
| 5.4 | 研究限制與未來研究怎麼寫？（m5e4，92 秒） | https://youtu.be/1bYQbHdUUNg |
動畫在 animations/episodes_more.js；分鏡在 第2_4_5章_分鏡.md 第二批。播放清單共 27 支（新 7 支排在最後）。
