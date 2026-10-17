# 04 手繪動畫引擎與渲染

## 引擎（engine.js）要點
- Canvas 2D，1920×1080，30 fps。「原子筆手繪」= 線條沿路徑加 value-noise 抖動，`BOIL_RATE=8` 每秒重抽 8 次（line boil）。
- 紙張底色 `#f4ead3`，墨色 `#1e2754`，字型 Iansui / LXGW WenKai TC（fonts/ 內離線 woff2）。
- 常用 helper：`txt(s,x,y,size,{p,color,align,weight})`、`ink(pts,o)`、`inkLine`、`shape(pts,{fill,w,alpha})`、
  `bar`、`axis`、`arrow`、`curve`、`shadeUnder`、`normalPdf`、`noteBox(x,y,w,h,lines,fill,k)`、`table2x2`、`scatter`、
  `bubble`（對話框）、`check/cross`、`paperSheet`、`tape`、`rankTag`、`mini`；
  節奏：`prog(lt,start,dur)` 0→1、`appear(k,fn)`、`easeOut`、`lerp`、`clamp`、`rnd(seed)`；
  角色：`dad/mom/kid(x,y,scale,pose,opts)` 與歷史人物（`gosset`、`fisher`、`neyman`、`pascal`…），
  新人物 = `{...GOSSET, hat, hair, mustache, glasses, top, bottom, pose0}` + 一行 wrapper。
- 版面安全區：內容畫在 y ≤ 900。905 以下是字幕框（50 px 字、最多兩行）。右下角 868 以上在片尾會出現資料來源卡。
  左上 (36,30) 是集名標籤，不要放重點。

## 每集的結構（episodes.js）
```js
function C5E1() {
  const s1 = { beats: [0, 2.2, 4.0], draw(lt) { /* lt = 場景內秒數（已對應到旁白） */ } };
  ...
  const order = [[s1, 8], [s2, 10], ...];            // 未配音版每場景秒數
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1 /* 借音樂 */, dur: t, tag: '高等體育統計｜第 5 章 EP1　變異數分析', scenes,
           sources: ['資料來源', '講義〈…〉p.3', 'Fisher (1925) …'] };
}
EPISODES['c5e1'] = C5E1;
```
- `beats[j]` 是第 j 句旁白開始時，場景動畫應該走到的時間點。index.html 的 `narrated()` 會把旁白時間軸分段線性映射到這些 beat，
  所以「畫面上的東西在旁白講到它時出現」是靠 beats 對齊，不是靠猜秒數。
- 一場景 = 一個視覺重點 + 最多 4 句。超過就拆。
- 數字出現時同時有口白與畫面；關鍵結論用 `noteBox` 或 `underline` 標。
- 作業題：畫「題目卡 → 計算 → 答案框」，不要只念答案。

## 預覽（不要跳過）
```
node render.cjs preview c5e1v 3,9.5,18,27,40,55,70,88,100,118
```
時間點取每個場景的中段與結尾。用 Read 工具看每張 jpg，找：
文字互疊、表格超出、角色擋到圖、內容掉進字幕區、片尾資料來源卡壓到內容。改座標後重拍。

## 全片渲染
```
NODE_PATH=$(npm root -g) node render.cjs full c5e1v
```
- 約 8–12 fps 的渲染速度；兩分鐘片約 5–8 分鐘。4 核機器並行 2 支，第 3 支排後面。
- 背景執行時用 `nohup … > log 2>&1 &`，以 log 的 `frame N/M` 判斷進度。
- 渲染前後都別用 `pkill -f render.cjs`：pattern 會比對到自己的 shell。要殺就用 pid。
- 渲染輸出 `out/ep<key>v.mp4`（1080p，crf 21，aac 192k，已含混音與 loudnorm）。
