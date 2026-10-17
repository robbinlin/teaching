# 03 音量穩定與配樂

使用者的原話是「聲音有點忽大忽小聲」。拆開來有三個來源，三層都要處理。

## 第一層：TTS 逐句音量不一致 → 逐句等響度（tts.py 的 level()）
每句合成出來後：
1. `trim()` 去掉前後靜音（閾值 0.008，前留 200、後留 400 樣本）。
2. 以 20 ms 框算 RMS，只取有聲框（RMS > 0.01），把「說話部分」的 RMS 拉到 −18 dBFS。
   為什麼只算有聲框：句子長短與停頓不同，整句 RMS 會被靜音拉低，短句就會偏大聲。
3. 全片拼完只做峰值保護（peak ≤ 0.95），不要再整體正規化，否則第一步白做。

## 第二層：混音鏈（scripts/mix_audio.sh，render.cjs 內同樣的 filter）
```
[voice] aresample=44100,
        dynaudnorm=f=100:g=5:p=0.9:m=15,          # 慢速動態正規化，抹平句內起伏
        acompressor=threshold=-28dB:ratio=4:attack=5:release=120:makeup=3,
        pan=stereo|c0=c0|c1=c0 [v];
[music] volume=0.22 [m];                            # 固定低音樂底，不做 sidechain 閃避
[m][v] amix=inputs=2:duration=first:normalize=0
```
不閃避的原因：sidechain ducking 在句間空檔會讓音樂抽吸，聽起來就是「忽大忽小」。固定 0.22 的底，旁白永遠在上面。

## 第三層：兩段式 loudnorm
先量：`ffmpeg -i pre.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -`
再帶 measured_* 做 `linear=true` 的第二遍。單遍 loudnorm 是動態模式，會把前後段音量推來推去；線性兩遍才是「整體增益」。
目標 −16 LUFS / TP −1.5（YouTube 與手機喇叭都合適）。

## 驗收
```
ffmpeg -i out/ep<key>v.mp4 -af loudnorm=I=-16:TP=-1.5:print_format=json -f null - 2>&1 | grep -E 'input_i|input_tp|input_lra'
```
input_i 應在 −16 ± 1，input_lra 通常 5–9。LRA > 11 代表還有大小聲，回頭看是哪一句（用 timeline 切段量 RMS）。

## 配樂（audio.js）
Web Audio 離線合成（pluck/strum/whistle/marimba/bell/bass/kick…），每集 `music(S, dur, sceneStarts)` 排事件。
坑：OfflineAudioContext 長度一拉長就超線性變慢（10 s→2 s、20 s→5.7 s、40 s→32 s）。
解法：`renderMusic` 以 30 秒為一段、每段多算 3 秒預滾，Synth 的發聲方法包一層只排進本段窗口的事件並平移時間，
渲染完去掉預滾再拼接；結尾 1.6 秒淡出。164 秒的曲子從卡死變成約 110 秒。
驗證拼接：在每段邊界前後各 0.2 秒量 RMS，差值 < 1 dB 即無接縫。
