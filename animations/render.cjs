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
const { execFileSync } = require('child_process');
function mixAudio(music, voice, out) {
  const pre = out.replace('.wav', '_pre.wav');
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', music, '-i', voice, '-filter_complex',
    // voice: even out loudness within and across sentences; music: constant low bed (no ducking = no pumping)
    '[1:a]aresample=44100,dynaudnorm=f=100:g=5:p=0.9:m=15,acompressor=threshold=-28dB:ratio=4:attack=5:release=120:makeup=3,pan=stereo|c0=c0|c1=c0[v];' +
    '[0:a]volume=0.22[m];[m][v]amix=inputs=2:duration=first:normalize=0[a]', '-map', '[a]', pre]);
  return finishLoudnorm(pre, out);
}
function finishLoudnorm(pre, out) {
  const r = require('child_process').spawnSync('ffmpeg', ['-hide_banner', '-i', pre, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
  const j = JSON.parse(r.stderr.toString().match(/\{[^{}]*"input_i"[^{}]*\}/)[0]);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', pre, '-af',
    `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=44100`, out]);
  return out;
}

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('pageerror', e => console.error('PAGE ERROR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('console:', m.text()); });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?ep=' + ep);
  await page.evaluate(() => window.READY);
  const dur = await page.evaluate(() => EP.dur);

  if (mode === 'audio') {
    const wav = await page.evaluate(async () => renderMusic((S, d) => EP.music(S, d, EP.scenes.map(s => s.t0)), EP.dur));
    const wavPath = path.join(OUT, `ep${ep}.wav`);
    fs.writeFileSync(wavPath, Buffer.from(wav, 'base64'));
    const mixed = mixAudio(wavPath, path.join(__dirname, 'voice', `ep${ep.replace('v', '')}_voice.wav`), path.join(OUT, `ep${ep}_mix.wav`));
    const mp4 = path.join(OUT, `ep${ep}.mp4`), tmp = mp4.replace('.mp4', '_tmp.mp4');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp4, '-i', mixed, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur), '-movflags', '+faststart', tmp]);
    fs.renameSync(tmp, mp4);
    console.log('audio replaced', mp4);
  } else if (mode === 'preview') {
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
    // narrated version: mix voice + softly ducked music into one wav first, then two-pass (linear) loudness normalisation
    const voice = path.join(__dirname, 'voice', `ep${ep.replace('v', '')}_voice.wav`);
    let audioArgs = ['-i', wavPath, '-map', '0:v', '-map', '1:a'];
    if (ep.endsWith('v')) {
      const mixed = mixAudio(wavPath, voice, path.join(OUT, `ep${ep}_mix.wav`));
      audioArgs = ['-i', mixed, '-map', '0:v', '-map', '1:a'];
    }
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
