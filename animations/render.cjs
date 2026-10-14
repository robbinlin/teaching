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
    const wav = await page.evaluate(async () => renderMusic(EP.music, EP.dur));
    const wavPath = path.join(OUT, `ep${ep}.wav`);
    fs.writeFileSync(wavPath, Buffer.from(wav, 'base64'));
    const mp4 = path.join(OUT, `ep${ep}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-i', wavPath, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21', '-pix_fmt', 'yuv420p',
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
