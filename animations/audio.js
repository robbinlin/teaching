// Web Audio 合成配樂：OfflineAudioContext 離線渲染 → WAV(base64)
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const NOTE = (() => { const n = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }; return s => { const m = s.match(/^([A-G])(#|b)?(-?\d)$/); return 12 * (+m[3] + 1) + n[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); }; })();

class Synth {
  constructor(ac) {
    this.ac = ac;
    this.comp = ac.createDynamicsCompressor();
    this.comp.threshold.value = -14; this.comp.ratio.value = 3; this.comp.attack.value = .01; this.comp.release.value = .2;
    this.master = ac.createGain(); this.master.gain.value = .8;
    this.master.connect(this.comp); this.comp.connect(ac.destination);
    this.rev = ac.createConvolver(); this.rev.buffer = this.impulse(1.6);
    const rg = ac.createGain(); rg.gain.value = .22; this.rev.connect(rg); rg.connect(this.master);
    this.noiseBuf = this.makeNoise(2);
    // 分段離線渲染：只排進 [winA - pre, winB) 的事件，時間平移到本段起點（見 renderMusic）
    this.winA = 0; this.pre = 0; this.winB = Infinity; this._d = 0;
    for (const k of ['pluck', 'strum', 'whistle', 'marimba', 'bell', 'bass', 'noise', 'kick', 'wood', 'whoosh', 'gavel']) {
      const f = this[k];
      this[k] = (t, ...r) => { if (this._d === 0) { if (t < this.winA - this.pre || t >= this.winB) return; t = t - this.winA + this.pre; } this._d++; try { return f.call(this, t, ...r); } finally { this._d--; } };
    }
  }
  impulse(sec) {
    const sr = this.ac.sampleRate, b = this.ac.createBuffer(2, sr * sec, sr);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let s = 1234 + c * 77; for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = ((s / 2147483647) * 2 - 1) * Math.pow(1 - i / d.length, 2.6); } }
    return b;
  }
  makeNoise(sec) {
    const sr = this.ac.sampleRate, b = this.ac.createBuffer(1, sr * sec, sr), d = b.getChannelData(0); let s = 42;
    for (let i = 0; i < d.length; i++) { s = (s * 16807) % 2147483647; d[i] = (s / 2147483647) * 2 - 1; }
    return b;
  }
  bus(gain, pan = 0, rev = .3) {
    const g = this.ac.createGain(); g.gain.value = gain;
    const p = this.ac.createStereoPanner(); p.pan.value = pan;
    g.connect(p); p.connect(this.master);
    if (rev > 0) { const s = this.ac.createGain(); s.gain.value = rev; p.connect(s); s.connect(this.rev); }
    return g;
  }
  env(g, t, a, peak, decay, end = .0001) {
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(end, t + a + decay);
  }
  osc(type, f, t, dur, dest) { const o = this.ac.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.connect(dest); o.start(t); o.stop(t + dur + .05); return o; }
  // ukulele-ish pluck
  pluck(t, m, vel = .5, dest, dec = .7) {
    const f = mtof(m), g = this.ac.createGain(), lp = this.ac.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(5200, t); lp.frequency.exponentialRampToValueAtTime(700, t + dec * .6); lp.Q.value = 2;
    lp.connect(g); g.connect(dest); this.env(g, t, .004, vel, dec);
    this.osc('triangle', f, t, dec, lp); const s = this.osc('sawtooth', f * 1.002, t, dec, lp);
    const sg = this.ac.createGain(); sg.gain.value = .25; s.disconnect(); s.connect(sg); sg.connect(lp);
  }
  strum(t, chord, vel, dest, down = true) { (down ? chord : chord.slice().reverse()).forEach((m, i) => this.pluck(t + i * .014, m, vel * (i === 0 ? 1 : .8), dest, .55)); }
  whistle(t, m, dur, vel = .25, dest) {
    const f = mtof(m), g = this.ac.createGain(); g.connect(dest);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vel, t + .05); g.gain.setValueAtTime(vel, t + Math.max(.06, dur - .07)); g.gain.exponentialRampToValueAtTime(.0001, t + dur + .05);
    const o = this.osc('sine', f, t, dur + .1, g);
    o.frequency.setValueAtTime(f * .97, t); o.frequency.exponentialRampToValueAtTime(f, t + .05);
    const l = this.ac.createOscillator(), lg = this.ac.createGain(); l.frequency.value = 5.5; lg.gain.value = f * .007; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur + .1);
    const h = this.osc('sine', f * 2, t, dur + .1, (() => { const x = this.ac.createGain(); x.gain.value = .06; x.connect(g); return x; })());
  }
  marimba(t, m, vel = .4, dest) {
    const f = mtof(m), g = this.ac.createGain(); g.connect(dest); this.env(g, t, .003, vel, .55);
    this.osc('sine', f, t, .6, g);
    const g2 = this.ac.createGain(); g2.connect(dest); this.env(g2, t, .002, vel * .35, .12); this.osc('sine', f * 3.93, t, .15, g2);
  }
  bell(t, m, vel = .3, dest, dec = 1.4) {
    const f = mtof(m);
    [[1, 1], [2.76, .4], [5.4, .18], [8.93, .08]].forEach(([r, a]) => { const g = this.ac.createGain(); g.connect(dest); this.env(g, t, .002, vel * a, dec / r ** .5); this.osc('sine', f * r, t, dec, g); });
  }
  bass(t, m, dur, vel = .5, dest) {
    const f = mtof(m), g = this.ac.createGain(), lp = this.ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650;
    lp.connect(g); g.connect(dest); this.env(g, t, .006, vel, dur);
    this.osc('triangle', f, t, dur, lp); this.osc('sine', f, t, dur, lp);
  }
  noise(t, dur, vel, dest, type = 'bandpass', freq = 3000, q = 1, freqEnd) {
    const s = this.ac.createBufferSource(); s.buffer = this.noiseBuf;
    const fl = this.ac.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(freq, t); if (freqEnd) fl.frequency.exponentialRampToValueAtTime(freqEnd, t + dur); fl.Q.value = q;
    const g = this.ac.createGain(); s.connect(fl); fl.connect(g); g.connect(dest); this.env(g, t, .003, vel, dur);
    s.start(t, (t * 7.3) % 1.5); s.stop(t + dur + .05);
  }
  kick(t, vel, dest) { const g = this.ac.createGain(); g.connect(dest); this.env(g, t, .002, vel, .3); const o = this.osc('sine', 130, t, .3, g); o.frequency.exponentialRampToValueAtTime(45, t + .25); }
  wood(t, vel, dest, f = 1100) { const g = this.ac.createGain(); g.connect(dest); this.env(g, t, .001, vel, .07); const o = this.osc('sine', f, t, .08, g); o.frequency.exponentialRampToValueAtTime(f * .7, t + .07); }
  whoosh(t, dur, vel, dest) { this.noise(t, dur, vel, dest, 'bandpass', 400, 1.5, 4000); }
  gavel(t, dest) { this.kick(t, .9, dest); this.noise(t, .09, .7, dest, 'bandpass', 1800, 2); this.wood(t + .005, .5, dest, 600); }
}

async function renderMusic(score, dur) {
  // 以 30 秒為一段分別渲染（含 3 秒前置），避免單一 OfflineAudioContext 節點過多而極慢
  const sr = 44100, CHK = 30, total = Math.ceil(sr * dur), out = [new Float32Array(total), new Float32Array(total)];
  for (let a = 0; a < dur; a += CHK) {
    const b = Math.min(a + CHK, dur), pre = Math.min(3, a), len = Math.ceil(sr * (b - a + pre));
    const ac = new OfflineAudioContext(2, len, sr), S = new Synth(ac);
    S.winA = a; S.winB = b; S.pre = pre;
    score(S, dur);
    if (b >= dur) { S.master.gain.setValueAtTime(.8, Math.max(0, dur - 1.6 - a + pre)); S.master.gain.linearRampToValueAtTime(0, dur - .05 - a + pre); }
    const buf = await ac.startRendering(), off = Math.round(sr * pre), o0 = Math.round(sr * a);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c), n = Math.max(0, Math.min(d.length - off, total - o0)); out[c].set(d.subarray(off, off + n), o0); }
  }
  return wavB64({ length: total, numberOfChannels: 2, sampleRate: sr, getChannelData: c => out[c] });
}
function wavB64(buf) {
  const n = buf.length, ch = buf.numberOfChannels, sr = buf.sampleRate;
  const ab = new ArrayBuffer(44 + n * ch * 2), v = new DataView(ab);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, 36 + n * ch * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, ch, true); v.setUint32(24, sr, true); v.setUint32(28, sr * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
  ws(36, 'data'); v.setUint32(40, n * ch * 2, true);
  const data = []; for (let c = 0; c < ch; c++) data.push(buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const s = Math.max(-1, Math.min(1, data[c][i])); v.setInt16(o, s < 0 ? s * 32768 : s * 32767, true); o += 2; }
  let bin = ''; const u = new Uint8Array(ab), CH = 0x8000;
  for (let i = 0; i < u.length; i += CH) bin += String.fromCharCode.apply(null, u.subarray(i, i + CH));
  return btoa(bin);
}
