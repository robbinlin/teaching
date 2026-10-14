// 用法：
//   node render.cjs preview <ep> <t1,t2,...>   → out/preview/ep<ep>_<t>.jpg
//   node render.cjs full <ep>                  → out/ep<ep>.mp4（含配樂）
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const [mode, ep, arg] = process.argv.slice(2);
const OUT = path.join(__dirname, 'out');
const FPS = 30;

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?ep=' + ep);
  await page.evaluate(() => window.READY);
  const dur = await page.evaluate(() => EP.dur);

  if (mode === 'preview') {
    fs.mkdirSync(path.join(OUT, 'preview'), { recursive: true });
    for (const t of arg.split(',').map(Number)) {
      const b64 = await page.evaluate(t => frameJPEG(t), t);
      fs.writeFileSync(path.join(OUT, 'preview', `ep${ep}_${t.toFixed(2)}.jpg`), Buffer.from(b64.split(',')[1], 'base64'));
    }
  } else {
    const wav = await page.evaluate(async () => renderMusic((S, d) => EP.music(S, d, EP.scenes.map(s => s.t0)), EP.dur));
    const wavPath = path.join(OUT, `ep${ep}.wav`);
    fs.writeFileSync(wavPath, Buffer.from(wav, 'base64'));
    const mp4 = path.join(OUT, `ep${ep}.mp4`);
    // narrated version: duck the music under the voice track
    const voice = path.join(__dirname, 'voice', `ep${ep.replace('v', '')}_voice.wav`);
    const audioArgs = ep.endsWith('v')
      ? ['-i', wavPath, '-i', voice, '-filter_complex',
        '[2:a]aresample=44100,pan=stereo|c0=c0|c1=c0,volume=1.3,asplit=2[v1][v2];[1:a]volume=0.55[m];[m][v1]sidechaincompress=threshold=0.03:ratio=8:attack=15:release=350[d];[d][v2]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=44100[a]',
        '-map', '0:v', '-map', '[a]']
      : ['-i', wavPath, '-map', '0:v', '-map', '1:a'];
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      ...audioArgs, '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '192k', '-t', String(dur), '-movflags', '+faststart', mp4], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(dur * FPS);
    const t0 = Date.now();
    for (let f = 0; f < n; f++) {
      const b64 = await page.evaluate(t => frameJPEG(t), f / FPS);
      const ok = ff.stdin.write(Buffer.from(b64.split(',')[1], 'base64'));
      if (!ok) await new Promise(r => ff.stdin.once('drain', r));
      if (f % 150 === 0) console.log(`ep${ep} frame ${f}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('done', mp4);
  }
  await browser.close();
})();
