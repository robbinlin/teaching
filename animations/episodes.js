// 三支影片的分鏡（場景繪製）、字幕、資料來源與配樂譜
const GY = 840; // ground line

function ground(lt, x0 = 140, x1 = 1780) { ink([[x0, GY + 2], [(x0 + x1) / 2, GY - 2], [x1, GY + 3]], { w: 4, p: prog(lt, 0, .8), alpha: .7 }); }
function appear(k, fn) { if (k <= 0) return; const a = ALPHA; ALPHA *= clamp(k); const r = fn(); ALPHA = a; return r; }
function bubble(x, y, w, h, tx, ty, s, size = 40, k = 1) {
  if (k <= 0) return;
  appear(k, () => {
    shape([...roundRectPts(x - w / 2, y - h / 2, w, h, 26)], { fill: COL.white, w: 3.5, smooth: false });
    fillShape([[tx, ty], [x - 20, y + h / 2 - 4], [x + 20, y + h / 2 - 4]], COL.white);
    ink([[x - 22, y + h / 2], [tx, ty], [x + 22, y + h / 2]], { w: 3.5 });
    txt(s, x, y + 2, size, { color: COL.black, p: clamp(k * 1.5) });
  });
}
function Phi(z) { // standard normal CDF
  const t = 1 / (1 + .2316419 * Math.abs(z)), d = .3989423 * Math.exp(-z * z / 2);
  const p = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// ============================ EP1：t 檢定 ============================
const EP1 = {
  tag: '高等體育統計｜EP1 平均數比一比：t 檢定', dur: 30,
  sources: ['資料來源', 'Wikipedia〈William Sealy Gosset〉', 'The Conversation〈The genius at Guinness…〉', '林老師講義〈單樣本及雙樣本檢定〉p.7–11'],
  scenes: [
    { t0: 0, t1: 5, beats: [0, 1.8, 2.5], sub: '1908 年，健力士酒廠的 Gosset 只有少少樣本，卻要判斷原料好不好',
      draw(lt) {
        ground(lt);
        brewery(230, GY, 1.1, easeOut(prog(lt, .1, 1.4)));
        txt('1908・都柏林', 980, 175, 76, { p: prog(lt, .3, 1), color: COL.black });
        underline(760, 1200, 225, { p: prog(lt, 1, .5), color: COL.mustardD });
        barrel(1450, GY, 1.0); barrel(1620, GY, .9);
        appear(prog(lt, .6, .4), () => barrel(1535, GY - 110, .85));
        [0, 1, 2].forEach(i => barley(640 + i * 34, GY, .9, Math.sin(RLT * 2 + i) * .05));
        const g = appear(prog(lt, .4, .5), () => gosset(980, GY, .95, { ra: [-.7, -1.75], la: [P / 2 + .3, P / 2 - .4], look: 1, mouth: lt > 2.5 ? 'o' : 'flat', brow: lt > 2.5 ? 1 : 0 }));
        if (g) beerGlass(g.rh[0] + 4, g.rh[1] + 18, .75, 1);
        bubble(1330, 330, 300, 120, 1070, 360, '只有 n = 4 ？', 44, prog(lt, 2.2, .5));
      } },
    { t0: 5, t1: 10, beats: [0, .35, 1.6], sub: '公司不准用本名發表，他署名「Student」，t 分配就此誕生',
      draw(lt) {
        paperSheet(760, 465, 1060, 640, -.015);
        const pw = txt('Student', 470, 255, 120, { p: prog(lt, .4, 1.3), color: INK, align: 'center' });
        if (lt > .4 && lt < 1.9) { const k = prog(lt, .4, 1.3); pen(470 - pw / 2 + pw * k + 6, 290, .5, .8); }
        underline(330, 620, 320, { p: prog(lt, 1.7, .4), color: COL.red });
        // normal vs t
        const cx = 800, base = 735, wh = 440, hs = 720;
        axis(340, 1270, base, { p: prog(lt, 1.6, .6) });
        curve(cx, base, wh, hs, normalPdf, { p: prog(lt, 1.9, 1.2), color: COL.gray, w: 3.5, alpha: .8 });
        curve(cx, base, wh, hs, z => tPdf(z, 3), { p: prog(lt, 2.4, 1.4), color: COL.blue, w: 6 });
        txt('常態分配', 600, 455, 34, { color: COL.gray, p: prog(lt, 2.8, .5) });
        txt('t 分配', 1110, 600, 42, { color: COL.blue, p: prog(lt, 3.6, .4) });
        appear(prog(lt, 3.7, .4), () => arrow(1110, 625, 1150, 700, { w: 3.5, color: COL.blue, head: 14 }));
        txt('（樣本小 → 尾巴比較厚）', 1050, 760, 30, { color: COL.blue, p: prog(lt, 4, .5) });
        // sticky note
        appear(prog(lt, .2, .4), () => {
          ctx.save(); ctx.translate(1120, 260); ctx.rotate(.05);
          shape(rectPts(-150, -70, 300, 140), { fill: COL.pinkL, smooth: false, w: 3 });
          tape(-40, -86, 80, 26, COL.mustard, -.04);
          txt('公司規定：', 0, -22, 34, { color: COL.black }); txt('不可用本名發表', 0, 26, 34, { color: COL.red });
          ctx.restore();
        });
        gosset(1610, GY, .78, { ra: [-.9, -2.1], la: [P / 2 + .3, P / 2 + .1], mouth: 'smile', look: -1 });
      } },
    { t0: 10, t1: 16, beats: [0, .6, 3.8], sub: '單樣本 t 檢定：一組的平均數，和一個已知標準值比',
      draw(lt) {
        ground(lt, 140, 560);
        const d = dad(330, GY, .92, { ra: [-.5, -1.9], la: [P / 2 + .3, P / 2 + .15], mouth: lt > 4 ? 'smile' : 'flat', look: 1, bob: idle(RLT) * .3 });
        stopwatch(d.rh[0] + 10, d.rh[1] - 40, 46, RLT);
        const X = v => 700 + (v - 6) / 8 * 1000, AY = 700;
        axis(660, 1760, AY, { p: prog(lt, .2, .6) });
        for (let v = 6; v <= 14; v += 2) { inkLine(X(v), AY - 8, X(v), AY + 8, { w: 3, p: prog(lt, .6, .2) }); txt(String(v), X(v), AY + 36, 30, { p: prog(lt, .6, .3) }); }
        txt('每週練習時數（小時）', 1500, AY + 80, 30, { p: prog(lt, .7, .4), color: COL.gray });
        const vals = [8.5, 9.4, 10.1, 11.2, 11.9, 12.3, 12.6, 13.6];
        vals.forEach((v, i) => {
          const k = prog(lt, .8 + i * .15, .35); if (k <= 0) return;
          const y = lerp(AY - 260, AY - 26, easeOut(k));
          shape(ellPts(X(v), y, 18, 18, 0, Math.PI * 2, 14), { fill: COL.blueL, w: 3.5 });
        });
        // mu0
        const kM = prog(lt, 2.3, .5);
        if (kM > 0) { ink([[X(10), AY - 330], [X(10), AY]], { w: 4.5, color: COL.red, p: kM }); txt('μ₀ = 10（標準）', X(10) - 20, AY - 360, 36, { color: COL.red, p: kM, align: 'right' }); }
        const mean = 11.2, kX = prog(lt, 3, .6);
        if (kX > 0) { ink([[X(mean), AY - 290], [X(mean), AY]], { w: 4.5, color: COL.blue, p: kX }); txt('樣本平均 11.2', X(mean) + 18, AY - 320, 36, { color: COL.blue, p: kX, align: 'left' }); }
        const kA = prog(lt, 3.8, .5);
        if (kA > 0) { arrow(X(10) + 6, AY - 200, X(mean) - 6, AY - 200, { w: 4, head: 14, p: kA, color: COL.black }); }
        appear(prog(lt, 4.2, .5), () => {
          ctx.save(); ctx.translate(1250, 210); ctx.rotate(-.01);
          shape(rectPts(-330, -55, 660, 110), { fill: '#fff8e2', smooth: false, w: 3 });
          txt('t = （平均 − μ₀）÷（s / √n）', 0, 2, 44, { color: COL.black });
          ctx.restore();
        });
      } },
    { t0: 16, t1: 22, beats: [0, .3, 2.6], sub: '獨立雙樣本 t 檢定：兩組「不同的人」比平均數',
      draw(lt) {
        ground(lt);
        dad(300, GY, .85, { ra: [-.25, -.35], rhand: 'open', mouth: 'smile', look: 1, bob: idle(RLT) * .3 });
        mom(1640, GY, .85, { la: [P + .25, P + .35], lhand: 'open', look: -1, bob: idle(RLT, 1) * .3 });
        const base = 760, h1 = 380 * easeOut(prog(lt, .4, 1.2)), h2 = 300 * easeOut(prog(lt, .7, 1.2));
        inkLine(620, base, 1300, base, { w: 4.5, p: prog(lt, .2, .4) });
        bar(800, base, 170, h1, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 });
        bar(1120, base, 170, h2, COL.pinkL, { pattern: 'dots', patColor: COL.pink, sp: 14, r: 3 });
        if (lt > 1.6) { errBar(800, base - 380, 40); errBar(1120, base - 300, 46); }
        txt('男子組', 800, base + 40, 38, { p: prog(lt, .3, .4), color: COL.blue });
        txt('女子組', 1120, base + 40, 38, { p: prog(lt, .3, .4), color: COL.pink });
        txt('平均 12.4 小時', 800, base - 455, 34, { p: prog(lt, 1.6, .4) });
        txt('平均 9.8 小時', 1120, base - 380, 34, { p: prog(lt, 1.8, .4) });
        const kB = prog(lt, 2.6, .5);
        if (kB > 0) {
          ink([[900, base - 380], [960, base - 380], [960, base - 300], [1020, base - 300]], { w: 4, color: COL.red, p: kB });
          txt('差異夠大嗎？', 960, base - 520, 44, { color: COL.red, p: prog(lt, 2.9, .4) });
        }
        appear(prog(lt, 3.6, .5), () => {
          ctx.save(); ctx.translate(960, 150);
          shape(rectPts(-380, -50, 760, 100), { fill: '#fff8e2', smooth: false, w: 3 });
          txt('t = （平均₁ − 平均₂）÷ 標準誤', 0, 2, 42, { color: COL.black });
          ctx.restore();
        });
      } },
    { t0: 22, t1: 27, beats: [0, .1, 2.0], sub: '成對 t 檢定：同一批人「訓練前、後」比，看的是差值 d',
      draw(lt) {
        ground(lt, 140, 600);
        const jump = Math.max(0, Math.sin(RLT * 5)) * 46;
        kid(330, GY, 1.35, { bob: -jump, liftL: jump > 10 ? 10 : 0, liftR: jump > 10 ? 10 : 0, mouth: jump > 20 ? 'open' : 'smile' });
        const Y = v => 760 - (v - 28) / 24 * 460, xa = 820, xb = 1220;
        ink([[xa, 300], [xa, 770]], { w: 4, p: prog(lt, .1, .4) }); ink([[xb, 300], [xb, 770]], { w: 4, p: prog(lt, .1, .4) });
        txt('訓練前', xa, 260, 38, { p: prog(lt, .2, .4) }); txt('訓練後', xb, 260, 38, { p: prog(lt, .2, .4) });
        txt('垂直跳（cm）', 1020, 805, 28, { color: COL.gray, p: prog(lt, .3, .4) });
        const pre = [32, 35, 38, 41, 44], post = [36, 37, 43, 44, 49];
        pre.forEach((v, i) => {
          const k = prog(lt, .5 + i * .25, .5);
          appear(prog(lt, .4 + i * .25, .2), () => shape(ellPts(xa, Y(v), 15, 15, 0, 7, 12), { fill: COL.white, w: 3.5 }));
          if (k > 0) {
            ink([[xa + 16, Y(v)], [xb - 16, Y(post[i])]], { w: 4, color: COL.green, p: k });
            if (k >= 1) shape(ellPts(xb, Y(post[i]), 15, 15, 0, 7, 12), { fill: COL.greenL, w: 3.5 });
          }
          const kd = prog(lt, 2.0 + i * .2, .3);
          txt(`第 ${i + 1} 人　d = +${post[i] - pre[i]}`, 1400, Y(pre[i]) + 2, 34, { p: kd, color: COL.green, align: 'left' });
        });
        appear(prog(lt, 3.3, .5), () => {
          ctx.save(); ctx.translate(1560, 170);
          shape(rectPts(-260, -48, 520, 96), { fill: COL.greenL, smooth: false, w: 3 });
          txt('平均差 3.8 → 對 d 做 t 檢定', 0, 2, 36, { color: COL.black });
          ctx.restore();
        });
      } },
    { t0: 27, t1: 30, beats: [0, .7, 1.3], sub: '比平均數前先問：比標準值？兩組不同人？同一批人前後？',
      draw(lt) {
        ground(lt, 140, 1000);
        txt('t 檢定三兄弟', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
        underline(330, 790, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
        txt('單樣本・獨立樣本・成對樣本', 560, 275, 40, { p: prog(lt, .7, .6), color: COL.blue });
        dad(330, GY, .8, DANCE_DAD(RLT));
        kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 });
        mom(790, GY, .8, DANCE_MOM(RLT));
      } }
  ],
  music(S, dur, starts = [0, 5, 10, 16, 22, 27]) {
    const bpm = 112, b = 60 / bpm, voiced = dur > 40;
    const uke = S.bus(.42, -.25, .25), wh = S.bus(voiced ? .3 : .5, .2, .5), bass = S.bus(.5, 0, .05), perc = S.bus(.35, .15, .1), sfx = S.bus(.5, 0, .3);
    const prog4 = [['C4', 'E4', 'G4', 'C5'], ['B3', 'D4', 'G4', 'B4'], ['C4', 'E4', 'A4', 'C5'], ['C4', 'F4', 'A4', 'C5']].map(c => c.map(NOTE));
    const roots = ['C3', 'G2', 'A2', 'F2'].map(NOTE);
    const bars = Math.floor(dur / (4 * b));
    for (let bar = 0; bar < bars; bar++) {
      const t0 = bar * 4 * b, ch = prog4[bar % 4];
      [[0, 1, .5], [1, 1, .38], [1.5, 0, .3], [2.5, 0, .3], [3, 1, .4], [3.5, 0, .3]].forEach(([bt, d, v]) => S.strum(t0 + bt * b, ch, v, uke, !!d));
      S.bass(t0, roots[bar % 4], b * 1.6, .55, bass); S.bass(t0 + 2 * b, roots[bar % 4] + 7, b * 1.4, .45, bass);
      for (let i = 0; i < 4; i++) S.noise(t0 + i * b + b / 2, .05, .12, perc, 'highpass', 6000, .7);
      if (bar % 2 === 1) S.kick(t0, .25, perc);
    }
    const mel = [
      [0, 'E5', 1], [1, 'G5', 1], [2, 'A5', .5], [2.5, 'G5', .5], [3, 'E5', 1],
      [4, 'D5', 1], [5, 'D5', .5], [5.5, 'E5', .5], [6, 'D5', 1], [7, 'B4', 1],
      [8, 'C5', 1], [9, 'E5', 1], [10, 'A5', 1.5], [11.5, 'G5', .5],
      [12, 'A5', 1], [13, 'G5', .5], [13.5, 'F5', .5], [14, 'E5', 1], [15, 'C5', 1]
    ];
    // whistle phrase every other 4-bar block (every block when there is no narration)
    for (let blk = 1; (blk * 4 + 4) * 4 * b < dur - 3; blk += voiced ? 2 : 1)
      mel.forEach(([bt, n, l]) => S.whistle(blk * 16 * b + bt * b, NOTE(n), l * b * .92, .2, wh));
    const last = starts[starts.length - 1];
    S.bell(last + .05, NOTE('C6'), .25, sfx); S.bell(last + .3, NOTE('E6'), .2, sfx); S.bell(last + .55, NOTE('G6'), .2, sfx);
    starts.slice(1).forEach(t => S.whoosh(t - .25, .35, .12, sfx));
  }
};

// ============================ EP2：無母數 ============================
const EP2 = {
  tag: '高等體育統計｜EP2 不看平均看排名：無母數檢定', dur: 30,
  sources: ['資料來源', 'Significance〈How Frank Wilcoxon helped statisticians…〉', 'Mann & Whitney (1947), Ann. Math. Stat. 18', '林老師講義〈單樣本及雙樣本檢定〉p.12–15'],
  scenes: [
    { t0: 0, t1: 5, sub: '資料歪斜、出現離群值時，平均數會被拉著跑',
      draw(lt) {
        ground(lt);
        const drop = prog(lt, 1.6, .5), tilt = .16 * back(prog(lt, 2.05, .6));
        const fx = 1000, fy = 700;
        shape([[fx, fy + 6], [fx - 70, GY], [fx + 70, GY]], { fill: COL.mustard, w: 4.5, smooth: false });
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(tilt);
        shape(rectPts(-560, -14, 1120, 22), { fill: '#c99a5b', smooth: false, w: 4 });
        const PX = v => -500 + v / 10 * 900;
        [2, 3, 4, 4, 5, 6].forEach((v, i) => {
          const stack = [2, 3, 4, 4, 5, 6].slice(0, i).filter(u => u === v).length;
          shape(ellPts(PX(v), -40 - stack * 46, 22, 22, 0, 7, 14), { fill: COL.blueL, w: 3.5 });
          txt(String(v), PX(v), -40 - stack * 46, 26);
        });
        ctx.restore();
        // the outlier ball
        const by = lerp(-140, fy - 90 + Math.sin(tilt) * 520, easeOut(drop)) ;
        if (lt > 1.4) { shape(ellPts(fx + 500 * Math.cos(tilt), by, 72, 72, 0, 7, 22), { fill: COL.red, w: 5 }); txt('99', fx + 500 * Math.cos(tilt), by + 2, 64, { color: COL.white }); }
        // mean & median markers
        const meanV = lerp(4, 17.6, ease(prog(lt, 2.3, 1)));
        const mx = Math.min(fx + (-500 + meanV / 10 * 900) * Math.cos(tilt), 1620);
        txt('平均數 ' + meanV.toFixed(1) + (meanV > 10 ? ' →' : ''), mx, 330, 44, { color: COL.pink, p: prog(lt, .4, .5) });
        arrow(mx, 360, mx, 470, { w: 4, color: COL.pink, head: 16, p: prog(lt, .6, .3) });
        const dx = fx + (-500 + 4 / 10 * 900) * Math.cos(tilt);
        txt('中位數 4', dx - 60, 180, 44, { color: COL.green, p: prog(lt, .6, .5) });
        arrow(dx - 60, 210, dx, 560 + Math.sin(tilt) * -100, { w: 4, color: COL.green, head: 16, p: prog(lt, .8, .3) });
        if (lt > 3) txt('（沒變！）', dx - 60, 250, 32, { color: COL.green, p: prog(lt, 3, .4) });
        dad(240, GY, .8, { la: [-P / 2 - .6, -P / 2 - .3], ra: [-P / 2 + .6, -P / 2 + .3], lhand: 'open', rhand: 'open', mouth: lt > 2 ? 'o' : 'smile', brow: lt > 2 ? 1.5 : 0, bob: lt > 2 && lt < 2.6 ? -20 : 0 });
      } },
    { t0: 5, t1: 10, sub: '1945 年，化學家 Wilcoxon 想到：把數字換成「排名」',
      draw(lt) {
        ground(lt, 140, 640);
        const w = wilcoxon(330, GY, .92, { ra: [-.5, -1.4], la: [P / 2 + .3, P / 2 + .1], look: 1 });
        flask(w.rh[0] + 10, w.rh[1] + 70, .7);
        txt('1945・美國氰胺公司實驗室', 330, 150, 40, { p: prog(lt, .2, .8), color: COL.black });
        const vals = ['7.9', '3.2', '5.1', '9.4', '6.0'], ranks = [4, 1, 2, 5, 3];
        vals.forEach((v, i) => {
          const x = 840 + i * 210, k = prog(lt, .3 + i * .15, .4);
          appear(k, () => { shape(rectPts(x - 80, 270, 160, 100), { fill: COL.white, smooth: false, w: 3.5 }); txt(v, x, 322, 52, { color: COL.black }); });
          const kr = prog(lt, 1.8 + i * .32, .35);
          if (kr > 0) arrow(x, 385, x, 470, { w: 4, head: 14, p: kr });
          rankTag(x, 520, ranks[i], prog(lt, 1.95 + i * .32, .3));
        });
        txt('數值', 690, 322, 36, { color: COL.gray, align: 'right', p: prog(lt, .3, .3) });
        txt('名次', 690, 520, 36, { color: COL.gray, align: 'right', p: prog(lt, 1.8, .3) });
        appear(prog(lt, 3.6, .4), () => {
          ctx.save(); ctx.translate(1260, 680); ctx.rotate(-.02);
          shape(rectPts(-360, -50, 720, 100), { fill: COL.mustard, smooth: false, w: 3.5, alpha: .9 });
          txt('就算是 999，也只是「第 1 名」', 0, 2, 40, { color: COL.black });
          ctx.restore();
        });
      } },
    { t0: 10, t1: 17, sub: '單樣本／成對：Wilcoxon 符號等級檢定（成對資料先算差值）',
      draw(lt) {
        ground(lt, 140, 420);
        kid(240, GY, 1.1, { ra: [-.25, -.4], rhand: 'open', la: [P / 2 + .4, P / 2 + .2], lhand: 'open', mouth: 'open', bob: idle(lt) * .4 });
        txt('H₀：pH 中位數 = 7', 1100, 170, 54, { p: prog(lt, .1, .6), color: COL.black });
        const ph = [6.8, 7.4, 7.9, 6.5, 8.1, 7.2], rk = [1.5, 3, 5, 4, 6, 1.5];
        ph.forEach((v, i) => {
          const x = 560 + i * 215, d = Math.round((v - 7) * 10) / 10, pos = d > 0;
          appear(prog(lt, .3 + i * .12, .3), () => beaker(x, 400, 1.05, v.toFixed(1)));
          txt('d ' + (pos ? '+' : '−') + Math.abs(d).toFixed(1), x, 450, 36, { p: prog(lt, 1.4 + i * .2, .3), color: pos ? COL.green : COL.red });
          rankTag(x, 530, rk[i], prog(lt, 2.8 + i * .25, .3), pos ? COL.greenL : '#f4c4bd');
        });
        txt('|d| 的名次', 488, 530, 30, { color: COL.gray, align: 'right', p: prog(lt, 2.8, .3) });
        appear(prog(lt, 4.6, .4), () => txt('W⁺ = 3 + 5 + 6 + 1.5 = 15.5', 820, 650, 44, { color: COL.green, p: prog(lt, 4.6, .6) }));
        appear(prog(lt, 5.2, .4), () => txt('W⁻ = 1.5 + 4 = 5.5', 1420, 650, 44, { color: COL.red, p: prog(lt, 5.2, .6) }));
        appear(prog(lt, 5.8, .4), () => txt('正負名次和差很多 → 中位數可能不是 7', 1110, 750, 38, { color: COL.black, p: prog(lt, 5.8, .6) }));
      } },
    { t0: 17, t1: 25, sub: '兩組獨立：Mann–Whitney U 檢定（1947）——混在一起排名再比',
      draw(lt) {
        ground(lt);
        const boys = [12, 9, 14, 11, 15], girls = [8, 10, 7, 13, 6];
        const all = boys.map((v, i) => ({ v, g: 0, i })).concat(girls.map((v, i) => ({ v, g: 1, i }))).sort((a, b) => a.v - b.v);
        all.forEach((a, r) => a.rank = r + 1);
        const toLine = ease(prog(lt, 1.2, 1.8)), back2 = ease(prog(lt, 5.0, 1.4));
        txt('男子組', 450, 300, 44, { color: COL.blue, alpha: 1 - toLine + back2 });
        txt('女子組', 1470, 300, 44, { color: COL.pink, alpha: 1 - toLine + back2 });
        txt('全部混在一起，依練習時數排隊', 960, 230, 44, { alpha: clamp(toLine * 2 - 1) * (1 - back2) });
        all.forEach((a, r) => {
          const gx = (a.g === 0 ? 250 : 1270) + a.i * 100;
          const lx = 330 + r * 140;
          const x = lerp(lerp(gx, lx, toLine), gx, back2);
          const hop = Math.sin(toLine * P) * -50 + Math.sin(back2 * P) * -50;
          const y = 640 + hop;
          mini(x, y, 1.4, a.g === 0 ? COL.blueL : COL.pinkL, a.g === 1 ? 'dots' : undefined);
          txt(String(a.v), x, y - 150, 32, { color: COL.gray });
          rankTag(x, y + 100, a.rank, prog(lt, 3.3 + r * .14, .25), a.g === 0 ? COL.blueL : COL.pinkL);
        });
        appear(prog(lt, 6.4, .4), () => txt('名次和 R男 = 36', 450, 410, 44, { color: COL.blue, p: prog(lt, 6.4, .5) }));
        appear(prog(lt, 6.7, .4), () => txt('名次和 R女 = 19', 1470, 410, 44, { color: COL.pink, p: prog(lt, 6.7, .5) }));
        appear(prog(lt, 7.1, .4), () => txt('→ 換算成 U 值檢定', 960, 500, 40, { color: COL.black }));
      } },
    { t0: 25, t1: 30, sub: '資料不常態、樣本又小？改用排名的無母數檢定！',
      draw(lt) {
        ground(lt, 140, 1220);
        const clap = prog(lt, .6, .3);
        const lift = lerp(.4, 0, clap);
        kid(420, GY, 1.0, { bob: -Math.abs(Math.sin(lt * 6)) * 18, mouth: 'open' });
        dad(660, GY, .85, { ra: [-1.0 + lift, -1.2 + lift], rhand: 'open', mouth: 'grit', look: 1 });
        mom(940, GY, .85, { la: [P + 1.0 - lift, P + 1.2 - lift], lhand: 'open', mouth: 'open', look: -1 });
        if (lt > .9) { sparkle(805, 330, 80, prog(lt, .9, .3)); txt('啪！', 805, 220, 56, { color: COL.red }); }
        txt('平均數 → t 檢定', 1500, 220, 44, { p: prog(lt, .3, .5), color: COL.blue, align: 'center' });
        txt('中位數 → 無母數', 1500, 300, 44, { p: prog(lt, .7, .5), color: COL.green, align: 'center' });
      } }
  ],
  music(S, dur) {
    const bpm = 100, b = 60 / bpm;
    const mar = S.bus(.5, -.2, .3), mel = S.bus(.42, .25, .45), bass = S.bus(.5, 0, .05), perc = S.bus(.35, .2, .15), sfx = S.bus(.45, 0, .35);
    const chords = [['F3', 'A3', 'C4', 'F4'], ['C3', 'G3', 'C4', 'E4'], ['D3', 'A3', 'D4', 'F4'], ['Bb2', 'F3', 'Bb3', 'D4']].map(c => c.map(NOTE));
    const bars = Math.floor(dur / (4 * b));
    for (let bar = 0; bar < bars; bar++) {
      const t0 = bar * 4 * b, ch = chords[bar % 4];
      const pat = [0, 2, 1, 3, 2, 1, 3, 2];
      pat.forEach((ni, i) => S.marimba(t0 + i * b / 2, ch[ni] + 12, i % 2 ? .25 : .35, mar));
      S.bass(t0, ch[0] - 12 + 12, b * 1.8, .5, bass); S.bass(t0 + 2 * b, ch[1] - 12 + 12, b * 1.5, .4, bass);
      S.wood(t0 + b, .3, perc, 1000); S.wood(t0 + 3 * b, .3, perc, 1000); S.wood(t0 + 3.5 * b, .18, perc, 1400);
    }
    const m = [[0, 'A5', 1.5], [1.5, 'G5', .5], [2, 'F5', 1], [3, 'C5', 1], [4, 'E5', 1], [5, 'G5', 1], [6, 'C6', 2], [8, 'D6', 1], [9, 'C6', .5], [9.5, 'A5', .5], [10, 'F5', 2], [12, 'G5', 1], [13, 'A5', 1], [14, 'F5', 2]];
    [2, 6].forEach(barOff => m.forEach(([bt, n, l]) => { const t = barOff * 4 * b + bt * b; if (t < dur - 2.5) S.bell(t, NOTE(n), .14, mel, l * b * 1.6); }));
    // rank "ding"s
    [1.95, 2.27, 2.59, 2.91, 3.23].forEach((t, i) => S.bell(5 + t, NOTE('C6') + [0, 2, 4, 7, 9][i], .2, sfx, .6));
    [0, 1, 2, 3, 4, 5].forEach(i => S.bell(10 + 2.8 + i * .25, NOTE('F5') + [0, 2, 4, 5, 7, 9][i], .16, sfx, .5));
    for (let r = 0; r < 10; r++) S.wood(17 + 3.3 + r * .14, .25, sfx, 1300 + r * 60);
    S.noise(1.55, .5, .3, sfx, 'bandpass', 3000, 1, 300); S.kick(2.05, .9, sfx); S.wood(2.06, .4, sfx, 500);
    S.noise(25.9, .12, .5, sfx, 'bandpass', 2500, 1.5); S.noise(25.92, .08, .4, sfx, 'highpass', 5000, 1);
    [5, 10, 17, 25].forEach(t => S.whoosh(t - .25, .35, .12, sfx));
  }
};

// ============================ EP3：P 值、信賴區間、檢定方向 ============================
const EP3 = {
  tag: '高等體育統計｜EP3 P 值・信賴區間・檢定方向', dur: 30,
  sources: ['資料來源', 'Wasserstein & Lazar (2016), The American Statistician', 'ACC〈The Fading Bright Line of p < 0.05〉(2016)', '林老師講義〈單樣本及雙樣本檢定〉p.22–24'],
  scenes: [
    { t0: 0, t1: 6, sub: '統計像法庭：先假設 H₀「沒有差異」，再看證據夠不夠推翻它',
      draw(lt) {
        ground(lt);
                const hit = 4.6, sw = lt < hit - .5 ? -0.3 : lt < hit ? lerp(-.3, -1.1, (lt - hit + .5) / .5) : lerp(.4, -.3, prog(lt, hit, .8));
        const k = kid(960, 500, 1.1, { ra: [-.2 + sw * .6, -1.2 + sw], la: [P / 2 + .4, P / 2], mouth: lt > hit && lt < hit + .6 ? 'open' : 'flat', brow: 1 });
        gavel(k.rh[0], k.rh[1], sw + 1.0, .7);
        bench(960, 430, 640, 170);
        txt('統計法庭', 960, 515, 64, { color: COL.white });
        if (lt > hit && lt < hit + .5) { for (let i = 0; i < 5; i++) { const a = -P / 2 + (i - 2) * .4; inkLine(1080 + Math.cos(a) * 40, 420 + Math.sin(a) * 40, 1080 + Math.cos(a) * 80, 420 + Math.sin(a) * 80, { w: 4, color: COL.red }); } }
        bubble(1320, 230, 400, 110, 1090, 320, '先假設 H₀ 為真', 42, prog(lt, 1, .5));
        // defendant H0
        appear(prog(lt, .5, .5), () => {
          shape(rectPts(1340, 620, 340, 220), { fill: '#d8b98a', smooth: false, w: 4.5, pattern: 'hatch', patColor: '#6b4422', sp: 24, ang: 0 });
          const sy = 560 + Math.sin(lt * 8) * 4;
          shape(roundRectPts(1430, sy - 130, 160, 190, 20), { fill: COL.white, smooth: false, w: 4 });
          txt('H₀', 1510, sy - 70, 64, { color: COL.black });
          ctx.save(); ctx.fillStyle = INK; ctx.globalAlpha = ALPHA; ctx.beginPath(); ctx.arc(1485, sy - 10, 5, 0, 7); ctx.arc(1535, sy - 10, 5, 0, 7); ctx.fill(); ctx.restore();
          inkLine(1495, sy + 20, 1525, sy + 20, { w: 3.5 });
          shape([[1600, sy - 110], [1608, sy - 90], [1600, sy - 84], [1592, sy - 90]], { fill: COL.blueL, w: 2.5 });
          txt('「兩組沒有差異」', 1510, 790, 34, { color: COL.black });
        });
        const d = dad(380, GY, .85, { ra: [-.4, -.2], rhand: 'open', la: [P / 2 + .2, -.3], mouth: lt > 2.5 ? 'open' : 'flat', look: 1 });
        appear(prog(lt, 1.6, .4), () => { ctx.save(); ctx.translate(d.lh[0], d.lh[1]); ctx.rotate(-.1); shape(rectPts(-60, -40, 120, 85), { fill: COL.mustard, smooth: false, w: 3.5 }); txt('資料', 0, 2, 34, { color: COL.black }); ctx.restore(); });
        bubble(330, 220, 300, 100, 380, 300, '證據夠嗎？', 42, prog(lt, 2.6, .5));
      } },
    { t0: 6, t1: 12, sub: 'p 值：如果 H₀ 為真，看到「這麼極端」結果的機率',
      draw(lt) {
        const cx = 960, base = 720, wh = 700, hs = 1000, a = 3.6;
        axis(240, 1700, base, { p: prog(lt, 0, .5) });
        curve(cx, base, wh, hs, normalPdf, { p: prog(lt, .1, 1), w: 6 });
        txt('假設 H₀ 為真時，統計量的分配', cx, 250, 40, { p: prog(lt, .3, .6), color: COL.gray });
        const zc = 1.645, xc = cx + zc / a * wh;
                const z = 0.8 + 1.6 * ease(prog(lt, 1, 3.5));
        const x = cx + z / a * wh;
        if (lt > 1) {
          shadeUnder(cx, base, wh, hs, normalPdf, z, 3.6, COL.pink, { alpha: .55, pattern: 'hatch', patColor: COL.pink, sp: 10 });
          arrow(x, base + 110, x, base + 12, { w: 5, color: COL.blue, head: 16 });
          txt('觀察到的 t', x, base + 140, 34, { color: COL.blue });
        }
        if (lt > .8) { for (let y = base; y > base - 260; y -= 26) inkLine(xc, y, xc, y - 14, { w: 4, color: COL.red }); txt('α = 0.05', xc + 16, base - 235, 36, { color: COL.red, align: 'left' }); }
        const p = 1 - Phi(z), sig = p < .05;
        appear(prog(lt, 1, .3), () => {
          ctx.save(); ctx.translate(1480, 330);
          shape(rectPts(-170, -55, 340, 110), { fill: sig ? COL.greenL : COL.white, smooth: false, w: 4 });
          txt('p = ' + p.toFixed(3), 0, 2, 54, { color: sig ? COL.green : COL.black });
          ctx.restore();
        });
        lamp(1720, 190, sig ? 1 : 0);
        if (sig) txt('p < 0.05 → 拒絕 H₀', 1500, 430, 38, { color: COL.green });
        mom(170, GY, .6, { ra: [-.35, -.55], rhand: 'open', look: 1, mouth: sig ? 'open' : 'o' });
      } },
    { t0: 12, t1: 18, sub: '信賴區間沒有包含 0 → 拒絕 H₀，而且看得出差多少',
      draw(lt) {
        const X = v => 330 + (v + 2) / 7 * 1260, y = 560;
        axis(260, 1660, y, { p: prog(lt, 0, .5) });
        for (let v = -2; v <= 4; v++) { inkLine(X(v), y - 10, X(v), y + 10, { w: 3, p: prog(lt, .3, .2) }); txt(String(v), X(v), y + 42, 32, { p: prog(lt, .3, .3), color: v === 0 ? COL.red : INK }); }
        ink([[X(0), y - 240], [X(0), y + 20]], { w: 5, color: COL.red, p: prog(lt, .5, .4) });
        txt('0 = 沒有差異', X(0), y - 270, 36, { color: COL.red, p: prog(lt, .6, .4) });
        txt('男子組 − 女子組（小時）', 1500, y + 100, 30, { color: COL.gray, p: prog(lt, .4, .5) });
        const mv = ease(prog(lt, 2.4, .9)), lo = lerp(-.4, .6, mv), hi = lerp(2.6, 3.6, mv), pt = lerp(1.1, 2.1, mv);
        const ok = mv > .99, by = y - 120, kc = prog(lt, .9, .6);
        if (kc > 0) {
          const col = ok ? COL.green : COL.gray;
          ink([[X(lo), by], [X(hi), by]], { w: 7, color: col, p: kc });
          inkLine(X(lo), by - 24, X(lo), by + 24, { w: 6, color: col, p: kc }); inkLine(X(hi), by - 24, X(hi), by + 24, { w: 6, color: col, p: kc });
          shape(ellPts(X(pt), by, 16, 16, 0, 7, 12), { fill: col, w: 3.5, alpha: kc });
          txt('95% 信賴區間', X(pt), by - 55, 34, { color: col, p: kc });
        }
        if (lt > 1.4 && lt < 2.4) { txt('包含 0 → 不拒絕 H₀', 960, 760, 44, { color: COL.gray, p: prog(lt, 1.6, .5) }); cross(640, 760, .8, prog(lt, 1.6, .4)); }
        if (ok) {
          check(560, 720, 1, prog(lt, 3.3, .4));
          txt('不含 0 → 拒絕 H₀', 900, 720, 46, { color: COL.green, p: prog(lt, 3.3, .5) });
          txt('男子組平均多 2.1 小時（0.6 ～ 3.6）', 960, 210, 46, { color: COL.black, p: prog(lt, 3.6, .8) });
        }
        dad(1780, GY, .62, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: ok ? 'smile' : 'flat' });
      } },
    { t0: 18, t1: 25, sub: '問「有沒有差」用雙尾；問「男子組比較大」用右尾',
      draw(lt) {
        const panels = [
          { x: 360, t: '雙尾', h: 'H₁：μ₁ ≠ μ₂', tails: [[-3.6, -1.96], [1.96, 3.6]] },
          { x: 960, t: '左尾', h: 'H₁：μ₁ < μ₂', tails: [[-3.6, -1.645]] },
          { x: 1560, t: '右尾', h: 'H₁：μ₁ > μ₂', tails: [[1.645, 3.6]] }
        ];
        panels.forEach((pn, i) => {
          const k = prog(lt, .2 + i * 1.0, .6);
          appear(k, () => {
            shape(rectPts(pn.x - 260, 200, 520, 520), { fill: '#fffdf6', smooth: false, w: 4 });
            txt(pn.t, pn.x, 270, 56, { color: COL.black });
            txt(pn.h, pn.x, 345, 40, { color: COL.blue });
            const base = 640, wh = 220, hs = 430;
            pn.tails.forEach(([a, b]) => shadeUnder(pn.x, base, wh, hs, normalPdf, a, b, COL.pink, { alpha: .75 }));
            inkLine(pn.x - 240, base, pn.x + 240, base, { w: 3.5 });
            curve(pn.x, base, wh, hs, normalPdf, { w: 5, p: k });
          });
        });
        const kh = prog(lt, 3.6, .6);
        if (kh > 0) {
          ink(ellPts(1560, 460, 300, 290, -P / 2, -P / 2 + 2 * P * kh, 40), { w: 6, color: COL.mustardD });
          txt('「男子組比較大」', 1560, 770, 42, { color: COL.mustardD, p: prog(lt, 3.9, .5) });
        }
        const k2 = prog(lt, 4.8, .6);
        if (k2 > 0) { ink(ellPts(360, 460, 300, 290, -P / 2, -P / 2 + 2 * P * k2, 40), { w: 6, color: COL.green }); txt('「有沒有差」', 360, 770, 42, { color: COL.green, p: prog(lt, 5.1, .5) }); }
      } },
    { t0: 25, t1: 30, sub: 'p 值不代表效果大小，也不是 H₀ 為真的機率（ASA, 2016）',
      draw(lt) {
        ground(lt, 140, 520);
        const k = prog(lt, .1, 1.2);
        scroll(1000, 150, 1000, 470, k);
        if (k > .6) {
          txt('美國統計學會（ASA）2016 聲明', 1000, 230, 48, { color: COL.black, p: prog(lt, .9, .6) });
          underline(700, 1300, 268, { p: prog(lt, 1.3, .3), color: COL.red });
          txt('① p 值不是「H₀ 為真」的機率', 1000, 340, 42, { p: prog(lt, 1.4, .6) });
          txt('② p 值不能衡量效果大小或重要性', 1000, 420, 42, { p: prog(lt, 1.9, .6) });
          txt('③ 別只靠 p < 0.05 下結論', 1000, 500, 42, { p: prog(lt, 2.4, .6) });
        }
        dad(210, GY, .72, { la: [P / 2 + .3, P / 2 + .1], ra: [-.6, -1.6], rhand: 'open', mouth: 'smile', look: 1 });
        kid(390, GY, .95, { bob: -Math.abs(Math.sin(lt * 5)) * 16 });
      } }
  ],
  music(S, dur) {
    const bpm = 92, b = 60 / bpm;
    const bass = S.bus(.6, 0, .08), pl = S.bus(.33, -.3, .3), perc = S.bus(.35, .2, .2), mel = S.bus(.4, .25, .45), sfx = S.bus(.6, 0, .3);
    const ch = [['A2', 'C4', 'E4', 'A4'], ['F2', 'C4', 'F4', 'A4'], ['C3', 'C4', 'E4', 'G4'], ['G2', 'B3', 'D4', 'G4']].map(c => c.map(NOTE));
    const walk = [[0, 7, 12, 7], [0, 7, 12, 4], [0, 4, 7, 9], [0, 2, 5, 7]];
    const bars = Math.floor(dur / (4 * b));
    for (let bar = 0; bar < bars; bar++) {
      const t0 = bar * 4 * b, c = ch[bar % 4];
      walk[bar % 4].forEach((iv, i) => S.bass(t0 + i * b, c[0] + iv, b * .7, .55, bass));
      [.5, 1.5, 2.5, 3.5].forEach(bt => S.strum(t0 + bt * b, c.slice(1), .22, pl));
      S.noise(t0 + b, .18, .18, perc, 'bandpass', 2600, .8); S.noise(t0 + 3 * b, .18, .18, perc, 'bandpass', 2600, .8);
      for (let i = 0; i < 8; i++) S.noise(t0 + i * b / 2, .04, .07, perc, 'highpass', 7000, .7);
      S.kick(t0, .35, perc); S.kick(t0 + 2.5 * b, .2, perc);
    }
    const m = [[0, 'E5', 1], [1, 'A5', 1], [2, 'G5', .5], [2.5, 'E5', .5], [3, 'C5', 1], [4, 'D5', 1.5], [5.5, 'E5', .5], [6, 'C5', 2], [8, 'E5', 1], [9, 'G5', 1], [10, 'A5', 1], [11, 'C6', 1], [12, 'B5', 1], [13, 'G5', 1], [14, 'D5', 2]];
    [2, 6].forEach(off => m.forEach(([bt, n, l]) => { const t = off * 4 * b + bt * b; if (t < dur - 3) S.whistle(t, NOTE(n), l * b * .9, .16, mel); }));
    S.gavel(4.6, sfx);
    // ding when p crosses 0.05: z(t)=0.8+1.6*ease((lt-1)/3.5) crosses 1.645
    let tc = 6; for (let x = 6; x < 12; x += .005) { const z = .8 + 1.6 * ease((x - 7) / 3.5); if (z >= 1.645) { tc = x; break; } }
    S.bell(tc, NOTE('E6'), .3, sfx, 1.2); S.bell(tc + .12, NOTE('A6'), .25, sfx, 1.2);
    S.bell(16, NOTE('C6'), .25, sfx); S.bell(16.12, NOTE('G6'), .2, sfx);
    [21.6, 22.8].forEach(t => S.noise(t, .4, .12, sfx, 'bandpass', 800, 1, 2500));
    S.strum(dur - 2.6, ['C3', 'G3', 'C4', 'E4', 'G4', 'C5'].map(NOTE), .5, pl);
    [6, 12, 18, 25].forEach(t => S.whoosh(t - .25, .35, .12, sfx));
  }
};

const EPISODES = { 1: EP1, 2: EP2, 3: EP3 };

// ============ 第 4 章 EP1（真實資料版）：PPHN 課堂資料 + 109 學年運動代表隊作業資料 ============
const EP1R = (() => {
  const B = EP1.scenes;
  const box = (x, y, w, h, lines, fill, k) => appear(k, () => {
    shape(rectPts(x - w / 2, y - h / 2, w, h), { fill, smooth: false, w: 3.5 });
    lines.forEach((l, i) => txt(l[0], x, y - (lines.length - 1) * 30 + i * 60, l[1] || 40, { color: l[2] || COL.black, p: clamp(k * 1.6) }));
  });
  // PPHN 新生兒 PH：131 筆，平均 7.131，SD 0.198，SE 0.0173；t = 7.571，df = 130
  const PH = { 6.6: 2, 6.7: 3, 6.8: 12, 6.9: 5, 7.0: 17, 7.1: 24, 7.2: 28, 7.3: 24, 7.4: 14, 7.5: 2 };
  const s3 = { beats: [0, 2.0, 4.5], draw(lt) {
    ground(lt, 140, 520);
    mom(250, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: lt > 5.6 ? 'open' : 'o', bob: idle(RLT) * .3 });
    txt('131 位 PPHN 新生兒：平均 PH 是否等於 7？', 1160, 150, 46, { p: prog(lt, .2, 1), color: COL.black });
    const X = v => 620 + (v - 6.55) * 1080, base = 760;
    axis(600, 1740, base, { p: prog(lt, 1.8, .4) });
    Object.entries(PH).forEach(([v, n], i) => {
      const h = n * 10 * easeOut(prog(lt, 2.0 + i * .1, .5));
      bar(X(+v), base, 96, h, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 });
      txt((+v).toFixed(1), X(+v), base + 34, 28, { p: prog(lt, 1.9, .3) });
    });
    txt('PH 值（人數）', 1620, base + 80, 28, { color: COL.gray, p: prog(lt, 2, .3) });
    const k0 = prog(lt, 3.3, .5);
    if (k0 > 0) { ink([[X(7.0), base], [X(7.0), 420]], { w: 5, color: COL.red, p: k0 }); txt('μ₀ = 7', X(7.0) - 14, 405, 38, { color: COL.red, align: 'right', p: k0 }); }
    const k1 = prog(lt, 3.9, .5);
    if (k1 > 0) { ink([[X(7.131), base], [X(7.131), 420]], { w: 5, color: COL.blue, p: k1 }); txt('樣本平均 7.13', X(7.131) + 14, 405, 38, { color: COL.blue, align: 'left', p: k1 }); }
    box(1160, 280, 900, 140, [['t = （7.131 − 7）÷ 0.0173 = 7.57', 42], ['df = 130，p < .001 → 平均 PH ≠ 7', 40, COL.green]], '#fff8e2', prog(lt, 4.6, .6));
  } };
  // 運動代表隊：人數 男 10.402 (n=911) / 女 5.841 (n=904)，Welch t = 11.576；每週練習天數 男 2.893 (861) / 女 2.904 (772)，t = −0.192, p = .848
  const s4 = { beats: [0, 1.0, 3.0, 5.0], draw(lt) {
    ground(lt);
    dad(190, GY, .75, { ra: [-.3, -.4], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    mom(1730, GY, .75, { la: [P + .3, P + .4], lhand: 'open', look: -1, bob: idle(RLT, 1) * .3 });
    txt('109 學年大專運動代表隊：男子組 vs 女子組（1,846 隊）', 960, 140, 44, { p: prog(lt, .2, 1), color: COL.black });
    const base = 760;
    // chart A: team size
    inkLine(450, base, 870, base, { w: 4.5, p: prog(lt, .9, .3) });
    txt('平均人數', 660, 410, 40, { p: prog(lt, 1.0, .3) });
    const hA = v => v * 22 * easeOut(prog(lt, 1.2, 1.0));
    bar(570, base, 130, hA(10.402), COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 });
    bar(750, base, 130, hA(5.841), COL.pinkL, { pattern: 'dots', patColor: COL.pink, sp: 14, r: 3 });
    if (lt > 2.2) { errBar(570, base - 10.402 * 22, 15); errBar(750, base - 5.841 * 22, 8); }
    txt('10.4 人', 570, base - 10.402 * 22 - 42, 34, { p: prog(lt, 2.2, .4) }); txt('5.8 人', 750, base - 5.841 * 22 - 36, 34, { p: prog(lt, 2.3, .4) });
    txt('男子組', 570, base + 40, 34, { color: COL.blue, p: prog(lt, 1, .3) }); txt('女子組', 750, base + 40, 34, { color: COL.pink, p: prog(lt, 1, .3) });
    box(660, 270, 560, 140, [['Welch t = 11.58', 40], ['p < .001 → 有顯著差異', 38, COL.green]], '#fff8e2', prog(lt, 3.1, .6));
    // chart B: practice days
    const kB = prog(lt, 5.0, .4);
    inkLine(1060, base, 1480, base, { w: 4.5, p: kB });
    txt('每週練習天數', 1270, 410, 40, { p: kB });
    const hB = v => v * 60 * easeOut(prog(lt, 5.2, 1.0));
    bar(1180, base, 130, hB(2.893), COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 });
    bar(1360, base, 130, hB(2.904), COL.pinkL, { pattern: 'dots', patColor: COL.pink, sp: 14, r: 3 });
    txt('2.89 天', 1180, base - 2.893 * 60 - 40, 34, { p: prog(lt, 6.1, .4) }); txt('2.90 天', 1360, base - 2.904 * 60 - 40, 34, { p: prog(lt, 6.2, .4) });
    txt('男子組', 1180, base + 40, 34, { color: COL.blue, p: kB }); txt('女子組', 1360, base + 40, 34, { color: COL.pink, p: kB });
    box(1270, 270, 560, 140, [['t = −0.19', 40], ['p = .85 → 沒有顯著差異', 38, COL.red]], '#fff8e2', prog(lt, 6.4, .6));
  } };
  // Apgar：131 位，1 分鐘 4.939、5 分鐘 5.725，差值平均 0.786，SD 1.196，t = 7.523
  const D = { '-4': 1, '-3': 1, '-2': 1, '-1': 2, 0: 55, 1: 41, 2: 21, 3: 6, 4: 2, 5: 1 };
  const s5 = { beats: [0, 2.0, 4.2], draw(lt) {
    ground(lt, 140, 480);
    kid(270, GY, 1.25, { bob: -Math.max(0, Math.sin(RLT * 4)) * 20, mouth: 'smile' });
    txt('同一個寶寶：1 分鐘 Apgar 平均 4.94 → 5 分鐘 平均 5.73', 1160, 150, 42, { p: prog(lt, .3, 1.2), color: COL.black });
    const X = v => 620 + (v + 4.5) * 108, base = 760;
    axis(600, 1740, base, { p: prog(lt, 1.8, .4) });
    Object.entries(D).forEach(([v, n], i) => {
      const h = n * 5 * easeOut(prog(lt, 2.0 + i * .1, .5));
      bar(X(+v), base, 96, h, +v > 0 ? COL.greenL : +v < 0 ? '#f4c4bd' : COL.white, {});
      txt((+v > 0 ? '+' : '') + v, X(+v), base + 34, 28, { p: prog(lt, 1.9, .3) });
      if (prog(lt, 2.5 + i * .1, .3) > 0) txt(String(n), X(+v), base - h - 22, 26, { color: COL.gray, p: prog(lt, 2.5 + i * .1, .3) });
    });
    txt('差值 d = 5 分鐘 − 1 分鐘（人數）', 1500, base + 80, 28, { color: COL.gray, p: prog(lt, 2, .3) });
    const k0 = prog(lt, 3.3, .5);
    if (k0 > 0) { ink([[X(0), base], [X(0), 420]], { w: 5, color: COL.red, p: k0 }); txt('d = 0（沒有改變）', X(0) - 14, 405, 34, { color: COL.red, align: 'right', p: k0 }); }
    const k1 = prog(lt, 3.8, .5);
    if (k1 > 0) { ink([[X(0.786), base], [X(0.786), 420]], { w: 5, color: COL.blue, p: k1 }); txt('平均差 0.79', X(0.786) + 14, 405, 36, { color: COL.blue, align: 'left', p: k1 }); }
    box(1160, 280, 900, 140, [['t = 0.786 ÷ 0.105 = 7.52', 42], ['df = 130，p < .001 → 5 分鐘顯著較高', 40, COL.green]], '#fff8e2', prog(lt, 4.4, .6));
  } };
  const order = [[B[0], 5], [B[1], 5], [s3, 7], [s4, 8], [s5, 7], [B[5], 3]];
  let t = 0;
  const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 4 章 EP1　平均數比一比：t 檢定', scenes,
    sources: ['資料來源', '課堂資料：PPHN 新生兒（131 位）', '作業資料：109 學年大專運動代表隊（1,846 隊）', 'Wikipedia〈William Sealy Gosset〉', '林老師講義〈單樣本及雙樣本檢定〉'] };
})();
EPISODES['1r'] = EP1R;

// ============ 第 4 章 EP2 / EP3（真實資料版） ============
function noteBox(x, y, w, h, lines, fill, k) {
  appear(k, () => {
    shape(rectPts(x - w / 2, y - h / 2, w, h), { fill, smooth: false, w: 3.5 });
    lines.forEach((l, i) => txt(l[0], x, y - (lines.length - 1) * 30 + i * 60, l[1] || 40, { color: l[2] || COL.black, p: clamp(k * 1.6) }));
  });
}
// 死亡組 (18) / 存活組 (111) 出生體重，與 PPHN 原始資料一致
const BW_DIED = [610, 790, 910, 1055, 1330, 1800, 1810, 2190, 2390, 2450, 2450, 2720, 2770, 2810, 2980, 3120, 3580, 3740];
const BW_ALIVE = [470, 560, 580, 590, 864, 900, 900, 910, 935, 954, 1100, 1100, 1100, 1140, 1180, 1250, 1460, 1510, 1610, 1675, 1680, 1810, 1920, 2080, 2120, 2150, 2150, 2225, 2230, 2320, 2350, 2370, 2370, 2375, 2420, 2450, 2480, 2510, 2520, 2550, 2620, 2650, 2680, 2720, 2760, 2790, 2800, 2820, 2830, 2850, 2850, 2855, 2860, 2900, 2910, 2950, 2950, 2950, 2950, 2950, 2990, 3010, 3050, 3050, 3055, 3074, 3075, 3090, 3140, 3150, 3150, 3160, 3180, 3190, 3210, 3250, 3265, 3290, 3300, 3310, 3310, 3320, 3320, 3320, 3350, 3370, 3380, 3430, 3450, 3490, 3495, 3500, 3510, 3540, 3580, 3580, 3635, 3659, 3670, 3690, 3700, 3780, 3876, 3950, 3960, 4016, 4090, 4190, 4270, 4320, 4450];

const EP2R = (() => {
  const B = EP2.scenes;
  // 男子組每隊人數：n = 911，平均 10.40，中位數 8，最大 111；偏態 3.05
  const s1 = { beats: [0, 2.6, 5.0], draw(lt) {
    ground(lt, 140, 460);
    dad(250, GY, .85, { la: [-P / 2 - .6, -P / 2 - .3], ra: [-P / 2 + .6, -P / 2 + .3], lhand: 'open', rhand: 'open', mouth: lt > 1.5 ? 'o' : 'smile', brow: lt > 1.5 ? 1.5 : 0, bob: idle(RLT) * .3 });
    txt('男子組每隊人數（911 隊）', 1160, 150, 46, { p: prog(lt, .2, .8), color: COL.black });
    const bins = [['0–4', 293], ['5–9', 221], ['10–14', 160], ['15–19', 106], ['20–29', 89], ['30–49', 36], ['50 以上', 6]];
    const base = 760, x0 = 600, bw = 150;
    axis(560, 1760, base, { p: prog(lt, .4, .4) });
    bins.forEach(([lab, n], i) => {
      const h = n * 1.25 * easeOut(prog(lt, .6 + i * .12, .5));
      bar(x0 + i * bw + 70, base, 110, h, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 });
      txt(lab, x0 + i * bw + 70, base + 34, 26, { p: prog(lt, .5, .3) });
      if (h > 4) txt(String(n), x0 + i * bw + 70, base - h - 22, 24, { color: COL.gray, p: prog(lt, 1.0 + i * .12, .3) });
    });
    txt('人數', 1720, base + 80, 28, { color: COL.gray, p: prog(lt, .5, .3) });
    const k1 = prog(lt, 1.6, .5);
    if (k1 > 0) { shape(ellPts(1690, 720, 34, 34, 0, 7, 20), { fill: COL.red, w: 4, alpha: k1 }); txt('111 人！', 1690, 650, 36, { color: COL.red, p: k1 }); }
    const XM = v => x0 + 70 + (v / 5) * bw - bw / 2; // bin width 5 → map value to x
    const k2 = prog(lt, 2.7, .5);
    if (k2 > 0) { ink([[XM(10.4), base], [XM(10.4), 400]], { w: 5, color: COL.pink, p: k2 }); txt('平均數 10.4', XM(10.4) + 16, 390, 36, { color: COL.pink, align: 'left', p: k2 }); }
    const k3 = prog(lt, 3.6, .5);
    if (k3 > 0) { ink([[XM(8), base], [XM(8), 345]], { w: 5, color: COL.green, p: k3 }); txt('中位數 8', XM(8) - 16, 330, 36, { color: COL.green, align: 'right', p: k3 }); }
    noteBox(1200, 270, 760, 110, [['偏斜＋離群值 → 平均數被拉走', 40, COL.red]], '#fff8e2', prog(lt, 5.2, .6));
  } };
  // PH vs 7：92 位高於、22 位低於、17 位相等；W+ = 5428、W− = 1127，p < .001；Apgar 差值 Wilcoxon p < .001
  const s3 = { beats: [0, 1.6, 4.0, 5.8], draw(lt) {
    ground(lt, 140, 440);
    kid(250, GY, 1.15, { ra: [-.25, -.4], rhand: 'open', la: [P / 2 + .4, P / 2 + .2], lhand: 'open', mouth: 'smile', bob: idle(RLT) * .4 });
    txt('H₀：PH 中位數 = 7（131 位 PPHN 新生兒）', 1160, 150, 46, { p: prog(lt, .2, .8), color: COL.black });
    const groups = [['高於 7', 92, COL.greenL, COL.green, '＋'], ['低於 7', 22, '#f4c4bd', COL.red, '−'], ['等於 7', 17, COL.white, COL.gray, '＝']];
    groups.forEach(([lab, n, fill, col, sym], g) => {
      const y0 = 260 + g * 100, kg = prog(lt, 1.7 + g * .5, .6);
      txt(lab, 620, y0 + 20, 36, { color: col, align: 'right', p: kg });
      for (let i = 0; i < n; i++) {
        const ki = prog(lt, 1.7 + g * .5 + i * .012, .15); if (ki <= 0) break;
        const x = 700 + (i % 40) * 22, y = y0 + Math.floor(i / 40) * 30;
        shape(ellPts(x, y, 9, 9, 0, 7, 8), { fill, w: 2.2, alpha: ki });
      }
      txt(`${n} 位`, 1740, y0 + 20, 34, { color: col, align: 'right', p: kg });
      if (g === 2) txt('不列入', 1740, y0 + 52, 26, { color: COL.gray, align: 'right', p: kg });
    });
    const kw = prog(lt, 4.2, .6);
    if (kw > 0) {
      const base = 740;
      bar(1300, base, 150, 5428 / 32 * easeOut(kw), COL.greenL, {}); bar(1520, base, 150, 1127 / 32 * easeOut(kw), '#f4c4bd', {});
      txt('W⁺ = 5428', 1300, base - 5428 / 32 - 28, 32, { color: COL.green, p: kw }); txt('W⁻ = 1127', 1520, base - 1127 / 32 - 28, 32, { color: COL.red, p: kw });
      txt('名次總和', 1160, base - 40, 30, { color: COL.gray, align: 'right', p: kw });
    }
    noteBox(760, 640, 480, 110, [['p < .001 → 中位數 ≠ 7', 36, COL.green]], '#fff8e2', prog(lt, 4.9, .5));
    noteBox(1160, 820, 1000, 80, [['成對資料：Apgar 差值做同樣的檢定，p < .001', 32]], COL.greenL, prog(lt, 6.0, .5));
  } };
  // Mann–Whitney：存活 111 vs 死亡 18（有效 129），平均名次 67.9 vs 47.0，U = 675.5，p = .028
  const s4 = { beats: [0, 1.4, 4.0, 5.6], draw(lt) {
    ground(lt, 140, 440);
    mom(250, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'o', bob: idle(RLT) * .3 });
    txt('出生體重：存活組（111）vs 死亡組（18）', 1160, 150, 46, { p: prog(lt, .2, .8), color: COL.black });
    const all = BW_ALIVE.map(v => [v, 0]).concat(BW_DIED.map(v => [v, 1])).sort((a, b) => a[0] - b[0]);
    const X = i => 560 + i * 9.2, yA = 520, yD = 620;
    const kr = prog(lt, 1.5, 2.2);
    all.forEach(([v, g], i) => {
      const k = prog(kr, i / all.length, .08); if (k <= 0) return;
      const y = lerp(g ? yD : yA, 570, 1 - k);
      shape(ellPts(X(i), g ? yD : yA, 6, 6, 0, 7, 8), { fill: g ? COL.pinkL : COL.blueL, w: 1.8, alpha: k });
    });
    if (kr > 0) { axis(540, 1780, 740, { p: kr }); txt('輕 → 重（名次 1 … 129）', 1160, 780, 28, { color: COL.gray, p: kr }); }
    txt('存活', 520, yA, 30, { color: COL.blue, align: 'right', p: prog(lt, 1.5, .3) }); txt('死亡', 520, yD, 30, { color: COL.pink, align: 'right', p: prog(lt, 1.5, .3) });
    const k2 = prog(lt, 4.1, .6);
    if (k2 > 0) {
      ink([[X(66.9), yA - 40], [X(66.9), yA + 30]], { w: 5, color: COL.blue, p: k2 }); txt('平均名次 67.9', X(66.9), yA - 60, 32, { color: COL.blue, p: k2 });
      ink([[X(46.0), yD - 30], [X(46.0), yD + 40]], { w: 5, color: COL.pink, p: k2 }); txt('平均名次 47.0', X(46.0), yD + 68, 32, { color: COL.pink, p: k2 });
    }
    noteBox(1160, 300, 760, 140, [['U = 675.5，p = .028', 44], ['兩組分布有顯著差異', 38, COL.green]], '#fff8e2', prog(lt, 5.8, .6));
  } };
  const order = [[s1, 7], [{ ...B[1], beats: [0, 1.8, 3.6] }, 5], [s3, 8], [s4, 8], [{ ...B[4], beats: [0, .6] }, 5]];
  let t = 0;
  const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 4 章 EP2　不看平均看排名：無母數檢定', scenes,
    sources: ['資料來源', '課堂資料：PPHN 新生兒（131 位）', '作業資料：109 學年大專運動代表隊（1,846 隊）', 'Significance〈How Frank Wilcoxon helped statisticians…〉', 'Mann & Whitney (1947), Ann. Math. Stat. 18'] };
})();

const EP3R = (() => {
  const B = EP3.scenes;
  // p 值：練習天數 t = −0.19 (p = .85)；隊伍人數 Welch t = 11.58 (p < .001)
  const s2 = { beats: [0, 1.6, 4.2], draw(lt) {
    const cx = 960, base = 720, wh = 700, hs = 1000, a = 3.6;
    axis(240, 1700, base, { p: prog(lt, 0, .5) });
    curve(cx, base, wh, hs, normalPdf, { p: prog(lt, .1, 1), w: 6 });
    txt('假設 H₀ 為真時，t 統計量的分配', cx, 250, 40, { p: prog(lt, .3, .6), color: COL.gray });
    [-1.96, 1.96].forEach(z => { if (lt > .8) { for (let y = base; y > base - 180; y -= 26) inkLine(cx + z / a * wh, y, cx + z / a * wh, y - 14, { w: 4, color: COL.red }); } });
    if (lt > .8) txt('α = .05（雙尾）', cx + 1.96 / a * wh + 16, base - 200, 32, { color: COL.red, align: 'left' });
    const k1 = prog(lt, 1.7, .6);
    if (k1 > 0) {
      shadeUnder(cx, base, wh, hs, normalPdf, -3.6, -0.19, COL.pinkL, { alpha: .5 }); shadeUnder(cx, base, wh, hs, normalPdf, 0.19, 3.6, COL.pinkL, { alpha: .5 });
      arrow(cx - 0.19 / a * wh, base + 110, cx - 0.19 / a * wh, base + 12, { w: 5, color: COL.blue, head: 16, p: k1 });
      txt('練習天數 t = −0.19', cx - 0.19 / a * wh, base + 140, 34, { color: COL.blue, p: k1 });
      noteBox(400, 380, 440, 120, [['p = .85', 50], ['很常見 → 證據不足', 34, COL.gray]], COL.white, prog(lt, 2.4, .5));
    }
    const k2 = prog(lt, 4.3, .6);
    if (k2 > 0) {
      arrow(1690, base + 110, 1690, base + 12, { w: 5, color: COL.green, head: 16, p: k2 });
      txt('隊伍人數 t = 11.58 →', 1560, base + 140, 34, { color: COL.green, p: k2 });
      noteBox(1500, 380, 440, 120, [['p < .001', 50, COL.green], ['極罕見 → 拒絕 H₀', 34, COL.green]], COL.greenL, prog(lt, 5.0, .5));
      lamp(1720, 190, k2);
    }
  } };
  // 信賴區間：人數差 4.56 [3.79, 5.33]；天數差 −0.01 [−0.12, 0.10]
  const s3 = { beats: [0, 1.6, 4.2, 6.5], draw(lt) {
    txt('男子組 − 女子組 的 95% 信賴區間', 960, 150, 46, { p: prog(lt, .2, .8), color: COL.black });
    const rows = [
      { y: 400, lab: '每隊人數', lo: 3.788, hi: 5.334, pt: 4.561, X: v => 760 + v / 7 * 900, ticks: [0, 1, 2, 3, 4, 5, 6], at: 1.7, ok: true, unit: '人' },
      { y: 660, lab: '每週練習天數', lo: -0.124, hi: 0.102, pt: -0.011, X: v => 1210 + v / 0.35 * 900, ticks: [-0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3], at: 4.3, ok: false, unit: '天' }
    ];
    rows.forEach(r => {
      const k = prog(lt, r.at - 1.4, .6); if (k <= 0) return;
      txt(r.lab, 560, r.y, 38, { align: 'right', p: k });
      axis(600, 1740, r.y + 70, { p: k });
      r.ticks.forEach(v => { inkLine(r.X(v), r.y + 60, r.X(v), r.y + 80, { w: 3, p: k }); txt(String(v), r.X(v), r.y + 108, 26, { p: k, color: v === 0 ? COL.red : INK }); });
      ink([[r.X(0), r.y - 70], [r.X(0), r.y + 85]], { w: 5, color: COL.red, p: k });
      const kc = prog(lt, r.at, .7), col = r.ok ? COL.green : COL.gray;
      if (kc > 0) {
        ink([[r.X(r.lo), r.y], [r.X(r.hi), r.y]], { w: 7, color: col, p: kc });
        inkLine(r.X(r.lo), r.y - 22, r.X(r.lo), r.y + 22, { w: 6, color: col, p: kc }); inkLine(r.X(r.hi), r.y - 22, r.X(r.hi), r.y + 22, { w: 6, color: col, p: kc });
        shape(ellPts(r.X(r.pt), r.y, 15, 15, 0, 7, 12), { fill: col, w: 3.5, alpha: kc });
        txt(`${r.pt > 0 ? '+' : ''}${r.pt.toFixed(2)} ${r.unit}（${r.lo.toFixed(2)} ～ ${r.hi.toFixed(2)}）`, r.X(r.pt), r.y - 48, 32, { color: col, p: kc });
      }
      const kj = prog(lt, r.at + 1.2, .5);
      if (kj > 0) { if (r.ok) check(1800, r.y, .9, kj); else cross(1800, r.y, .8, kj); txt(r.ok ? '不含 0 → 拒絕 H₀' : '包含 0 → 不拒絕 H₀', 1860, r.y + 150, 30, { color: r.ok ? COL.green : COL.red, align: 'right', p: kj }); }
    });
    noteBox(960, 900, 900, 90, [['區間還告訴你「差多少」，比只看 p 值更有資訊', 36]], '#fff8e2', prog(lt, 6.6, .6));
  } };
  // 檢定方向：作業 1 雙尾、作業 2 右尾
  const s4 = { beats: [0, 1.4, 3.6], draw(lt) {
    const panels = [
      { x: 480, t: '雙尾', h: 'H₁：μ男 ≠ μ女', tails: [[-3.6, -1.96], [1.96, 3.6]], q: '作業 1：平均數是否不同', at: 1.5, col: COL.green },
      { x: 1440, t: '右尾', h: 'H₁：Md男 > Md女', tails: [[1.645, 3.6]], q: '作業 2：男子組是否較大', at: 3.7, col: COL.mustardD }
    ];
    panels.forEach((pn, i) => {
      const k = prog(lt, .2 + i * .5, .6);
      appear(k, () => {
        shape(rectPts(pn.x - 360, 200, 720, 520), { fill: '#fffdf6', smooth: false, w: 4 });
        txt(pn.t, pn.x, 270, 56, { color: COL.black }); txt(pn.h, pn.x, 345, 40, { color: COL.blue });
        const base = 640, wh = 300, hs = 430;
        pn.tails.forEach(([a, b]) => shadeUnder(pn.x, base, wh, hs, normalPdf, a, b, COL.pink, { alpha: .75 }));
        inkLine(pn.x - 330, base, pn.x + 330, base, { w: 3.5 }); curve(pn.x, base, wh, hs, normalPdf, { w: 5, p: k });
      });
      const kq = prog(lt, pn.at, .6);
      if (kq > 0) { ink(ellPts(pn.x, 460, 400, 290, -P / 2, -P / 2 + 2 * P * kq, 40), { w: 6, color: pn.col }); txt(pn.q, pn.x, 790, 40, { color: pn.col, p: prog(lt, pn.at + .3, .5) }); }
    });
    const km = prog(lt, 0, .4);
    txt('「有沒有差」→ 雙尾　　「誰比較大」→ 單尾', 960, 120, 40, { p: km, color: COL.black });
  } };
  const order = [[{ ...B[0], beats: [0, 2.6] }, 6], [s2, 6], [s3, 8], [s4, 7], [{ ...B[4], beats: [0, 1.4] }, 5]];
  let t = 0;
  const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 4 章 EP3　P 值・信賴區間・檢定方向', scenes,
    sources: ['資料來源', '作業資料：109 學年大專運動代表隊（1,846 隊）', 'Wasserstein & Lazar (2016), The American Statistician', '林老師講義〈單樣本及雙樣本檢定〉p.22–24'] };
})();
EPISODES['2r'] = EP2R; EPISODES['3r'] = EP3R;

// ============ 第 1 章 EP1：集中趨勢（平均數、中位數、眾數） ============
const C1E1 = (() => {
  function ox(x, y, s, k) {
    appear(k, () => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      [-90, -40, 40, 90].forEach(lx => shape(rectPts(lx - 14, -10, 28, 90), { fill: '#6b4a2b', smooth: false, w: 3.5 }));
      shape(ellPts(0, -90, 150, 80, 0, 7, 30), { fill: '#8a5a33', w: 4.5, pattern: 'dots', patColor: '#5a3a1a', sp: 22, r: 5 });
      shape(ellPts(165, -120, 55, 45, 0, 7, 20), { fill: '#8a5a33', w: 4 });
      inkSmooth([[185, -160], [205, -200], [235, -190]], { w: 5 }); inkSmooth([[150, -160], [140, -200], [110, -195]], { w: 5 });
      ctx.save(); ctx.fillStyle = INK; ctx.globalAlpha = ALPHA; ctx.beginPath(); ctx.arc(185, -125, 4, 0, 7); ctx.fill(); ctx.restore();
      inkSmooth([[-150, -100], [-185, -60], [-170, -20]], { w: 4 });
      ctx.restore();
    });
  }
  const s1 = { beats: [0, 2.0, 4.3, 7.0], draw(lt) {
    ground(lt);
    txt('1906・英國 Plymouth 市集', 960, 140, 50, { p: prog(lt, .2, .9), color: COL.black });
    ox(560, GY, .95, prog(lt, .6, .6));
    galton(1460, GY, .9, { ra: [-.6, -1.4], la: [P / 2 + .3, P / 2 + .1], look: -1, mouth: lt > 2 ? 'smile' : 'flat' });
    // ballot slips piling
    const n = Math.floor(40 * easeOut(prog(lt, 2.1, 1.6)));
    for (let i = 0; i < n; i++) { const px = 1690 + (i % 4) * 46, py = 760 - Math.floor(i / 4) * 16; shape(rectPts(px, py, 38, 26), { fill: COL.white, smooth: false, w: 2 }); }
    txt('787 張猜測', 1780, 560, 34, { p: prog(lt, 3.0, .5) });
    // number line with median & true
    const k = prog(lt, 4.4, .8);
    if (k > 0) {
      const X = v => 300 + (v - 1100) / 250 * 960, y = 470;
      axis(280, 1300, y, { p: k });
      [1100, 1150, 1200, 1250, 1300].forEach(v => { inkLine(X(v), y - 8, X(v), y + 8, { w: 3, p: k }); txt(String(v), X(v), y + 36, 26, { p: k }); });
      for (let i = 0; i < 60; i++) { const v = 1100 + 250 * (0.5 + 0.5 * Math.tanh((rnd(i, 3) * 2 - 1) * 1.4) * (rnd(i, 4) > .5 ? 1 : -1) * .9); shape(ellPts(X(v), y - 30 - rnd(i, 5) * 40, 6, 6, 0, 7, 8), { fill: COL.blueL, w: 1.5, alpha: k * .8 }); }
      const k2 = prog(lt, 5.4, .6);
      if (k2 > 0) { ink([[X(1207), y + 10], [X(1207), y - 150]], { w: 5, color: COL.blue, p: k2 }); txt('中位數 1,207 磅', X(1207) - 16, 300, 34, { color: COL.blue, align: 'right', p: k2 }); }
      const k3 = prog(lt, 6.2, .6);
      if (k3 > 0) { ink([[X(1198), y + 10], [X(1198), y - 110]], { w: 5, color: COL.red, p: k3 }); txt('實際 1,198 磅', X(1198) + 16, 350, 34, { color: COL.red, align: 'left', p: k3 }); }
    }
    noteBox(1060, 240, 700, 80, [['一群人的意見 → 一個數：集中趨勢', 34]], '#fff8e2', prog(lt, 7.2, .5));
  } };
  const STRESS = [['<1', 1525, .5], ['1–2', 527, 1.5], ['2–3', 242, 2.5], ['3–4', 109, 3.5], ['>4', 196, 4.5]];
  const s2 = { beats: [0, 2.2, 5.0], draw(lt) {
    ground(lt, 140, 460);
    mom(250, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('高中職學生每天感到壓力的時間（講義圖 1）', 1160, 150, 44, { p: prog(lt, .2, .9), color: COL.black });
    const base = 720, x0 = 640, bw = 200;
    axis(600, 1720, base, { p: prog(lt, .4, .4) });
    STRESS.forEach(([lab, n, mid], i) => {
      const h = n * .3 * easeOut(prog(lt, .6 + i * .15, .5)), x = x0 + i * bw + 80;
      bar(x, base, 130, h, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 });
      txt(lab + ' 小時', x, base + 36, 28, { p: prog(lt, .5, .3) });
      if (h > 4) txt(String(n), x, base - h - 22, 26, { color: COL.gray, p: prog(lt, 1.0 + i * .15, .3) });
      const km = prog(lt, 2.3 + i * .25, .35);
      if (km > 0) { txt('中間值 ' + mid, x, base + 70, 24, { color: COL.pink, p: km }); shape(ellPts(x, base - h / 2, 14, 14, 0, 7, 10), { fill: COL.pink, w: 2.5, alpha: km }); }
    });
    noteBox(1160, 300, 1000, 100, [['平均 = Σ(中間值 × 人數) ÷ Σ人數 = 3,422 ÷ 2,599 = 1.31 小時', 34]], '#fff8e2', prog(lt, 3.8, .7));
    const kmo = prog(lt, 5.2, .6);
    if (kmo > 0) { ink(ellPts(x0 + 80, base - 1525 * .3 / 2, 110, 1525 * .3 / 2 + 30, -P / 2, -P / 2 + 2 * P * kmo, 40), { w: 6, color: COL.mustardD }); txt('眾數：人數最多的一組', x0 + 80 + 150, 250, 36, { color: COL.mustardD, align: 'left', p: prog(lt, 5.6, .5) }); }
    txt('（區間資料，平均是近似值）', 1160, 860, 28, { color: COL.gray, p: prog(lt, 5.0, .5) });
  } };
  const s3 = { beats: [0, 2.6, 5.2], draw(lt) {
    const nums = [1, 3, 9, 13, 27];
    txt('中位數：排好之後，正中間的那個數', 960, 150, 46, { p: prog(lt, .2, .9), color: COL.black });
    const y = 480;
    nums.forEach((v, i) => { const k = prog(lt, .4 + i * .2, .4); appear(k, () => { shape(rectPts(560 + i * 170 - 60, y - 60, 120, 120), { fill: i === 2 ? COL.mustard : COL.white, smooth: false, w: 4 }); txt(String(v), 560 + i * 170, y + 4, 56, { color: COL.black }); }); });
    const kk = prog(lt, 1.6, .6);
    if (kk > 0) { kid(560 + 2 * 170, y - 70, .85, { bob: -Math.abs(Math.sin(RLT * 5)) * 12, mouth: 'open' }); txt('中位數 = 9', 560 + 2 * 170, 640, 44, { color: COL.mustardD, p: kk }); }
    const k6 = prog(lt, 2.7, .5);
    appear(k6, () => { shape(rectPts(560 + 5 * 170 - 60, y - 60, 120, 120), { fill: COL.greenL, smooth: false, w: 4 }); txt('31', 560 + 5 * 170, y + 4, 56, { color: COL.black }); });
    if (k6 > 0) { ink(roundRectPts(560 + 2 * 170 - 75, y - 75, 150 + 170, 150, 16), { closed: true, w: 5, color: COL.green, p: prog(lt, 3.2, .6) }); }
    noteBox(1100, 780, 760, 90, [['偶數個 → (9 + 13) ÷ 2 = 11', 42, COL.green]], '#fff8e2', prog(lt, 3.9, .6));
    const k7 = prog(lt, 5.3, .6);
    if (k7 > 0) { txt('← 一半比它小', 300, 640, 34, { color: COL.gray, p: k7 }); txt('一半比它大 →', 1500, 640, 34, { color: COL.gray, p: k7 }); }
  } };
  const WAGE = [[2013, 44.4, 55.4], [2016, 46.4, 59.1], [2019, 49.7, 64.1], [2022, 51.8, 69.3]];
  const s4 = { beats: [0, 2.4, 5.2], draw(lt) {
    ground(lt, 1500, 1800);
    dad(1790, GY, .7, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: lt > 3 ? 'o' : 'flat', brow: lt > 3 ? 1 : 0 });
    txt('受雇員工總薪資（主計總處，萬元／年）', 600, 150, 44, { p: prog(lt, .2, .9), color: COL.black });
    const base = 700, Y = v => base - (v - 40) * 14;
    WAGE.forEach(([yr, md, mn], i) => {
      const x = 320 + i * 200, k = prog(lt, .4 + i * .3, .5);
      bar(x - 42, base, 70, (md - 40) * 14 * easeOut(k), COL.greenL, {}); bar(x + 42, base, 70, (mn - 40) * 14 * easeOut(k), COL.pinkL, { pattern: 'dots', patColor: COL.pink, sp: 14, r: 3 });
      txt(String(yr), x, base + 36, 30, { p: k });
      if (k >= 1) { txt(String(md), x - 42, Y(md) - 22, 26, { color: COL.green }); txt(String(mn), x + 42, Y(mn) - 22, 26, { color: COL.pink }); }
    });
    inkLine(220, base, 1000, base, { w: 4.5, p: prog(lt, .3, .4) });
    txt('■ 中位數', 480, 205, 30, { color: COL.green, p: prog(lt, .5, .4) }); txt('■ 平均數', 700, 205, 30, { color: COL.pink, p: prog(lt, .5, .4) });
    const k2 = prog(lt, 2.5, .8);
    if (k2 > 0) {
      const cx = 1330, b2 = 700, wh = 270, hs = 260;
      const f = z => { const u = (z + 1.6); return u > 0 ? u * Math.exp(-u) * 1.1 : 0; };
      curve(cx, b2, wh, hs, f, { p: k2, w: 5, range: 3.6 });
      ink([[cx + (-0.6) / 3.6 * wh, b2], [cx + (-0.6) / 3.6 * wh, b2 - 120]], { w: 4, color: COL.green, p: prog(lt, 3.2, .4) }); txt('中位數', cx + (-0.6) / 3.6 * wh, b2 - 140, 28, { color: COL.green, p: prog(lt, 3.2, .4) });
      ink([[cx + (0.4) / 3.6 * wh, b2], [cx + (0.4) / 3.6 * wh, b2 - 90]], { w: 4, color: COL.pink, p: prog(lt, 3.6, .4) }); txt('平均數', cx + (0.4) / 3.6 * wh, b2 - 110, 28, { color: COL.pink, p: prog(lt, 3.6, .4) });
      txt('右偏：少數高薪把平均拉高', cx, b2 + 50, 32, { color: COL.red, p: prog(lt, 4.0, .6) });
    }
    noteBox(1330, 290, 520, 100, [['看薪資：中位數更能', 34], ['代表「一般人」', 34, COL.green]], '#fff8e2', prog(lt, 5.4, .6));
  } };
  const AGE = [[30, 1], [35, 4], [40, 13], [45, 22], [50, 41], [55, 58], [60, 88], [65, 89], [70, 82], [75, 56], [80, 21], [85, 3]];
  const s5 = { beats: [0, 2.8, 5.0], draw(lt) {
    ground(lt, 140, 460);
    dad(250, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('478 位肺癌病人的年齡（課堂資料）', 1160, 150, 46, { p: prog(lt, .2, .9), color: COL.black });
    const base = 740, X = v => 620 + (v - 30) / 60 * 1100;
    axis(600, 1760, base, { p: prog(lt, .3, .4) });
    AGE.forEach(([v, n], i) => { const h = n * 4.2 * easeOut(prog(lt, .5 + i * .08, .5)); bar(X(v + 2.5), base, 86, h, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 }); if (i % 2 === 0) txt(String(v), X(v), base + 34, 26, { p: prog(lt, .4, .3) }); });
    txt('歲', 1760, base + 34, 26, { p: prog(lt, .4, .3) });
    const marks = [[64.4, '平均 64.4', COL.pink, 2.9], [65, '中位數 65', COL.green, 3.4], [62, '眾數 62', COL.mustardD, 3.9]];
    marks.forEach(([v, lab, col, at], i) => { const k = prog(lt, at, .5); if (k > 0) { ink([[X(v), base], [X(v), 330 + i * 40]], { w: 5, color: col, p: k }); inkLine(1500, 300 + i * 50, 1530, 300 + i * 50, { w: 6, color: col, p: k }); txt(lab, 1545, 300 + i * 50, 34, { color: col, align: 'left', p: k }); } });
    noteBox(1160, 880, 900, 80, [['三個數接近 → 分布對稱，三個都好用', 32, COL.green]], COL.greenL, prog(lt, 5.1, .6));
    noteBox(1725, 565, 340, 70, [['歪斜、有極端值 → 看中位數', 25, COL.red]], '#fff8e2', prog(lt, 6.2, .6));
  } };
  const s6 = { beats: [0, 1.2], draw(lt) {
    ground(lt, 140, 1000);
    txt('三種代表值', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    txt('平均數・中位數・眾數', 560, 275, 40, { p: prog(lt, .7, .6), color: COL.blue });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    txt('先看分布形狀，再選代表值', 1350, 500, 44, { p: prog(lt, 1.3, .6), color: COL.black });
  } };
  const order = [[s1, 9], [s2, 7], [s3, 7], [s4, 7], [s5, 7], [s6, 3]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 1 章 EP1　集中趨勢：平均數、中位數、眾數', scenes,
    sources: ['資料來源', 'Galton (1907) Vox Populi, Nature；Wallis (2014) arXiv:1410.3989', '主計總處 受雇員工薪資統計（講義 p.15）', '課堂資料：lung cancer study（478 位）', '林老師講義〈第一章 描述資料特徵的統計量及圖表〉'] };
})();
EPISODES['c1e1'] = C1E1;

// ============ 第 1 章 EP2：分散程度（全距、IQR、標準差、盒鬚圖） ============
const SURV = { n: 469, min: 0.03, q1: 23.2, med: 45.8, q3: 73.2, max: 204, whi: 145.8, out: [150.2, 153.3, 153.9, 157.5, 157.7, 159.6, 159.9, 162.6, 168.1, 175.9, 204.0] };
const SITES = [['DFCI', 82, 4.0, 26.5, 51.0, 78.25, 110.0, []], ['HLM', 92, 0.03, 16.2, 38.2, 70.4, 150.2, []], ['MI', 188, 2.2, 22.6, 53.4, 78.6, 162.6, [168.1, 175.9]], ['MSKCC', 107, 2.0, 30.5, 43.0, 62.0, 100.0, [114, 115, 204]]];
function boxH(x, y, w, X, s, k, col) { // horizontal box plot: s = {min,q1,med,q3,whi,out}
  const a = ALPHA; ALPHA *= k;
  ink([[X(s.min), y], [X(s.q1), y]], { w: 4, color: col }); ink([[X(s.q3), y], [X(s.whi), y]], { w: 4, color: col });
  inkLine(X(s.min), y - 18, X(s.min), y + 18, { w: 4, color: col }); inkLine(X(s.whi), y - 18, X(s.whi), y + 18, { w: 4, color: col });
  shape(rectPts(X(s.q1), y - w / 2, X(s.q3) - X(s.q1), w), { fill: COL.blueL, smooth: false, w: 4, pattern: 'hatch', patColor: COL.blue, sp: 16 });
  inkLine(X(s.med), y - w / 2, X(s.med), y + w / 2, { w: 6, color: COL.red });
  (s.out || []).forEach(o => inkEll(X(o), y, 9, 9, { w: 3, color: col }));
  ALPHA = a;
}
const C1E2 = (() => {
  const s1 = { beats: [0, 1.4, 3.4], draw(lt) {
    ground(lt);
    txt('兩隊的平均身高都是 180 cm', 960, 150, 50, { p: prog(lt, .2, .9), color: COL.black });
    const teams = [[420, [180, 181, 179, 180, 180], COL.blueL, '整齊'], [1300, [160, 200, 170, 195, 175], COL.pinkL, '參差']];
    teams.forEach(([x0, hs, col, lab], ti) => {
      hs.forEach((h, i) => { const k = prog(lt, .4 + ti * 1.0 + i * .12, .4); appear(k, () => mini(x0 + i * 110, GY - (h - 150) * 3 + 64, (h - 150) / 30 * .9 + .6, col, ti ? 'dots' : undefined)); });
      ink([[x0 - 70, GY - 90 - 20], [x0 + 4 * 110 + 70, GY - 90 - 20]], { w: 3, color: COL.gray, alpha: .6, p: prog(lt, 1.4 + ti * 1.0, .4) });
      txt(lab, x0 + 220, 330, 44, { color: ti ? COL.red : COL.green, p: prog(lt, 1.6 + ti * 1.0, .5) });
    });
    txt('平均 180', 1040, GY - 110, 30, { color: COL.gray, p: prog(lt, 1.5, .4) });
    noteBox(960, 250, 760, 80, [['集中趨勢一樣，分散程度不一樣', 36, COL.red]], '#fff8e2', prog(lt, 3.6, .6));
  } };
  const s2 = { beats: [0, 1.6, 4.2, 6.6], draw(lt) {
    ground(lt, 140, 440);
    mom(250, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('469 位肺癌病人的存活月數（課堂資料）', 1160, 150, 46, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 560 + v / 210 * 1180, y = 560;
    axis(540, 1780, y + 60, { p: prog(lt, .4, .5) });
    [0, 30, 60, 90, 120, 150, 180, 210].forEach(v => { inkLine(X(v), y + 52, X(v), y + 68, { w: 3, p: prog(lt, .5, .3) }); txt(String(v), X(v), y + 96, 26, { p: prog(lt, .5, .3) }); });
    // strip of dots (schematic from histogram counts)
    const H = [69, 80, 82, 62, 70, 40, 26, 16, 12, 1, 8, 2, 0, 1];
    const kd = prog(lt, .6, 1.4);
    H.forEach((n, bi) => { for (let j = 0; j < Math.min(n, 14); j++) { const k = prog(kd, (bi * 14 + j) / 196, .05); if (k <= 0) return; shape(ellPts(X(bi * 15 + 2 + (j % 7) * 2), y - (j % 7) * 0 - Math.floor(j / 7) * 14 + 20, 5, 5, 0, 7, 8), { fill: COL.blueL, w: 1.5, alpha: k }); } });
    const kr = prog(lt, 1.7, .8);
    if (kr > 0) { arrow(X(0), y - 170, X(204), y - 170, { w: 4, head: 16, p: kr, color: COL.mustardD }); txt('全距 = 204 − 0.03 ≈ 204 個月', X(100), y - 205, 34, { color: COL.mustardD, p: kr }); }
    const kq = prog(lt, 4.3, .9);
    [[SURV.q1, 'Q1 = 23.2'], [SURV.med, '中位數 45.8'], [SURV.q3, 'Q3 = 73.2']].forEach(([v, lab], i) => { const k = prog(lt, 4.3 + i * .5, .5); if (k > 0) { ink([[X(v), y + 50], [X(v), y - 30]], { w: 5, color: i === 1 ? COL.red : COL.green, p: k }); txt(lab, X(v), y - 50 - (i === 1 ? 30 : 0), 30, { color: i === 1 ? COL.red : COL.green, p: k }); } });
    const ki = prog(lt, 6.7, .8);
    if (ki > 0) { fillShape(rectPts(X(SURV.q1), y + 40, X(SURV.q3) - X(SURV.q1), 16), COL.greenL, { alpha: ki * .9 }); txt('IQR = 73.2 − 23.2 = 50：中間 50% 的人', X(48), y + 150, 36, { color: COL.green, p: ki }); }
  } };
  const EX = [110, 98, 110, 66, 29];
  const s3 = { beats: [0, 1.6, 5.4], draw(lt) {
    txt('標準差（SD）', 960, 140, 50, { p: prog(lt, .2, .6), color: COL.black });
    appear(prog(lt, .4, .8), () => { ctx.save(); ctx.translate(960, 250); shape(rectPts(-520, -50, 1040, 100), { fill: '#fff8e2', smooth: false, w: 3.5 }); txt('SD = √[ Σ(xᵢ − 平均)² ÷ (n − 1) ]', 0, 2, 44, { color: COL.black }); ctx.restore(); });
    const m = 82.6, y0 = 400;
    txt('5 位病人', 330, y0 - 50, 32, { color: COL.gray, p: prog(lt, 1.7, .3) });
    EX.forEach((v, i) => {
      const k = prog(lt, 1.8 + i * .25, .4), y = y0 + i * 62;
      appear(k, () => { txt(String(v), 330, y, 36); txt('− 82.6 =', 470, y, 30, { color: COL.gray }); txt((v - m).toFixed(1), 620, y, 32, { color: COL.blue }); txt('→ ²', 720, y, 30, { color: COL.gray }); txt(((v - m) ** 2).toFixed(1), 850, y, 32, { color: COL.pink }); });
    });
    const ks = prog(lt, 3.2, .6);
    if (ks > 0) { inkLine(790, y0 + 4 * 62 + 32, 920, y0 + 4 * 62 + 32, { w: 3, p: ks }); txt('Σ = 4,887.2', 850, y0 + 5 * 62 + 10, 32, { color: COL.pink, p: ks }); }
    noteBox(1380, 520, 760, 150, [['4,887.2 ÷ 4 = 1,221.8', 38], ['√1,221.8 = 35.0 個月', 44, COL.green]], COL.white, prog(lt, 4.0, .7));
    noteBox(1380, 780, 760, 130, [['全部 469 位：SD = 35.8 個月', 38, COL.blue], ['變異數 = SD² = 1,280', 36, COL.gray]], '#fff8e2', prog(lt, 5.6, .7));
    dad(1800, GY, .6, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile' });
  } };
  const s4 = { beats: [0, 2.0, 5.0], draw(lt) {
    ground(lt, 140, 460);
    tukey(250, GY, .9, { ra: [-.5, -1.3], la: [P / 2 + .3, P / 2 + .1], look: 1, mouth: 'smile' });
    txt('1977・Tukey 的盒鬚圖（Box-and-Whisker Plot）', 1160, 150, 46, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 560 + v / 210 * 1180, y = 520;
    axis(540, 1780, y + 150, { p: prog(lt, .4, .5) });
    [0, 30, 60, 90, 120, 150, 180, 210].forEach(v => { inkLine(X(v), y + 142, X(v), y + 158, { w: 3, p: prog(lt, .5, .3) }); txt(String(v), X(v), y + 186, 26, { p: prog(lt, .5, .3) }); });
    const kb = prog(lt, 2.1, 1.2);
    if (kb > 0) {
      const s = { ...SURV, out: lt > 5.2 ? SURV.out : [] };
      boxH(0, y, 120, X, s, kb, INK);
      appear(prog(lt, 2.6, .5), () => { txt('Q1 23.2', X(SURV.q1), y - 95, 28, { color: COL.green }); txt('中位數 45.8', X(SURV.med), y + 95, 28, { color: COL.red }); txt('Q3 73.2', X(SURV.q3), y - 95, 28, { color: COL.green }); });
      appear(prog(lt, 3.4, .5), () => { arrow(X(SURV.q1), y - 130, X(SURV.q3), y - 130, { w: 3.5, head: 12, color: COL.green }); arrow(X(SURV.q3), y - 130, X(SURV.q1), y - 130, { w: 3.5, head: 12, color: COL.green }); txt('盒長 = IQR = 50', X(48), y - 160, 30, { color: COL.green }); });
    }
    const ko = prog(lt, 5.1, .7);
    if (ko > 0) { ink([[X(148.2), y + 140], [X(148.2), y - 60]], { w: 4, color: COL.red, p: ko }); txt('Q3 + 1.5 IQR = 148.2', X(148.2), y - 85, 28, { color: COL.red, p: ko }); txt('11 位界外值 o', X(178), y - 40, 30, { color: COL.red, p: prog(lt, 5.8, .5) }); txt('鬚線到 145.8', X(110), y + 60, 26, { color: COL.gray, p: prog(lt, 5.5, .5) }); }
  } };
  const s5 = { beats: [0, 1.8, 5.0], draw(lt) {
    txt('四家醫院的存活月數', 960, 140, 50, { p: prog(lt, .2, .8), color: COL.black });
    const X = v => 440 + v / 210 * 920;
    axis(420, 1400, 860, { p: prog(lt, .3, .5) });
    [0, 30, 60, 90, 120, 150, 180, 210].forEach(v => { inkLine(X(v), 852, X(v), 868, { w: 3, p: prog(lt, .4, .3) }); txt(String(v), X(v), 896, 26, { p: prog(lt, .4, .3) }); });
    SITES.forEach(([name, n, mn, q1, md, q3, whi, out], i) => {
      const y = 260 + i * 150, k = prog(lt, .5 + i * .4, .7);
      txt(`${name}（${n}）`, 470, y, 30, { align: 'right', p: k });
      boxH(0, y, 80, X, { min: mn, q1, med: md, q3, whi, out }, k, INK);
    });
    const k2 = prog(lt, 1.9, .6);
    if (k2 > 0) { txt('中位數 38', X(38.2), 410 + 60, 26, { color: COL.red, p: k2 }); txt('中位數 53', X(53.4), 560 + 60, 26, { color: COL.red, p: k2 }); }
    const k3 = prog(lt, 3.0, .6);
    if (k3 > 0) ink(ellPts(X(46), 710, X(62) - X(30) + 60, 70, -P / 2, -P / 2 + 2 * P * k3, 40), { w: 5, color: COL.mustardD });
    txt('盒子最短 → 分散最小', X(100), 795, 28, { color: COL.mustardD, p: prog(lt, 3.4, .5) });
    noteBox(1430, 190, 820, 80, [['全距・IQR・標準差・盒鬚圖', 36, COL.blue]], '#fff8e2', prog(lt, 5.1, .6));
  } };
  const order = [[s1, 6], [s2, 9], [s3, 8], [s4, 8], [s5, 7]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 1 章 EP2　分散程度：全距、IQR、標準差、盒鬚圖', scenes,
    sources: ['資料來源', '課堂資料：lung cancer study（469 位存活月數）', 'Tukey (1977) Exploratory Data Analysis', '林老師講義〈第一章〉p.17–27'] };
})();
EPISODES['c1e2'] = C1E2;

// ============ 第 1 章 EP3：直方圖、長條圖、散佈圖 ============
const C1E3 = (() => {
  const s1 = { beats: [0, 2.6], draw(lt) {
    ground(lt);
    txt('1786・William Playfair《商業與政治圖集》', 960, 150, 48, { p: prog(lt, .2, .9), color: COL.black });
    playfair(360, GY, .9, { ra: [-.6, -1.4], la: [P / 2 + .3, P / 2 + .1], look: 1, mouth: 'smile' });
    appear(prog(lt, .6, .6), () => { paperSheet(1150, 520, 900, 560, .01); });
    const vals = [12, 7, 15, 9, 4, 11, 6, 13, 8, 10];
    vals.forEach((v, i) => { const h = v * 24 * easeOut(prog(lt, 1.0 + i * .12, .5)); bar(790 + i * 80, 760, 50, h, COL.mustard, {}); });
    inkLine(740, 760, 1580, 760, { w: 3.5, p: prog(lt, .9, .3) });
    txt('史上第一張長條圖（示意）', 1150, 300, 30, { color: COL.gray, p: prog(lt, 1.2, .5) });
    noteBox(1150, 900, 760, 80, [['一張圖，比一整頁數字更快看出模式', 34]], '#fff8e2', prog(lt, 2.8, .6));
  } };
  const HIST = [69, 80, 82, 62, 70, 40, 26, 16, 12, 1, 8, 2, 0, 1];
  const s2 = { beats: [0, 1.4, 4.6], draw(lt) {
    ground(lt, 140, 440);
    kid(250, GY, 1.15, { ra: [-.25, -.4], rhand: 'open', la: [P / 2 + .4, P / 2 + .2], lhand: 'open', mouth: 'smile', bob: idle(RLT) * .4 });
    txt('直方圖：存活月數（每 15 個月一組）', 1160, 150, 46, { p: prog(lt, .2, .9), color: COL.black });
    const base = 760, X = v => 600 + v / 210 * 1160;
    axis(580, 1780, base, { p: prog(lt, .3, .4) });
    HIST.forEach((n, i) => { const h = n * 5 * easeOut(prog(lt, 1.5 + i * .12, .5)); shape(rectPts(X(i * 15), base - h, X(15) - X(0), h), { fill: COL.blueL, smooth: false, w: 3.5, pattern: 'hatch', patColor: COL.blue, sp: 16 }); if (i % 2 === 0) txt(String(i * 15), X(i * 15), base + 34, 24, { p: prog(lt, .4, .3) }); });
    txt('個月', 1790, base + 34, 24, { p: prog(lt, .4, .3) });
    const km = prog(lt, 3.4, .6);
    if (km > 0) { ink(ellPts(X(37.5), base - 82 * 5 / 2, 60, 82 * 5 / 2 + 20, -P / 2, -P / 2 + 2 * P * km, 40), { w: 5, color: COL.mustardD }); txt('眾數在 30–45', X(37.5), base - 82 * 5 - 50, 30, { color: COL.mustardD, p: km }); }
    const kt = prog(lt, 4.0, .8);
    if (kt > 0) arrow(X(90), base - 200, X(190), base - 60, { w: 4, head: 16, color: COL.red, p: kt, bend: -.3 });
    txt('右偏長尾', X(160), base - 240, 32, { color: COL.red, p: prog(lt, 4.4, .5) });
    noteBox(1160, 215, 760, 80, [['連續資料・長條相連・看形狀與眾數', 32]], '#fff8e2', prog(lt, 4.8, .6));
  } };
  const SG = [['DFCI', 36, 46], ['HLM', 47, 53], ['MI', 84, 105], ['MSKCC', 67, 40]];
  const s3 = { beats: [0, 2.4], draw(lt) {
    ground(lt, 1500, 1800);
    mom(1660, GY, .75, { la: [P + .3, P + .4], lhand: 'open', look: -1, bob: idle(RLT, 1) * .3 });
    txt('長條圖：四家醫院的病人數，依性別堆疊', 760, 150, 46, { p: prog(lt, .2, .9), color: COL.black });
    const base = 760;
    inkLine(240, base, 1300, base, { w: 4.5, p: prog(lt, .3, .4) });
    SG.forEach(([name, f, m], i) => {
      const x = 380 + i * 260, k = easeOut(prog(lt, .5 + i * .3, .6));
      bar(x, base, 150, m * 2.6 * k, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 });
      if (k >= 1) shape(rectPts(x - 75, base - m * 2.6 - f * 2.6, 150, f * 2.6), { fill: COL.pinkL, smooth: false, w: 4, pattern: 'dots', patColor: COL.pink, sp: 14, r: 3 });
      txt(name, x, base + 36, 30, { p: prog(lt, .4, .3) });
      if (k >= 1) { txt(String(m), x, base - m * 2.6 / 2, 26, { color: COL.blue }); txt(String(f), x, base - m * 2.6 - f * 2.6 / 2, 26, { color: COL.pink }); txt(String(m + f), x, base - (m + f) * 2.6 - 24, 28, { color: COL.black }); }
    });
    txt('■ 男', 1200, 250, 30, { color: COL.blue, p: prog(lt, .5, .4) }); txt('■ 女', 1200, 300, 30, { color: COL.pink, p: prog(lt, .5, .4) });
    const k2 = prog(lt, 2.5, .6);
    if (k2 > 0) { ink(ellPts(380 + 3 * 260, base - 107 * 2.6 / 2, 110, 107 * 2.6 / 2 + 30, -P / 2, -P / 2 + 2 * P * k2, 40), { w: 5, color: COL.mustardD }); txt('唯一女 > 男', 380 + 3 * 260, 380, 30, { color: COL.mustardD, p: prog(lt, 2.9, .5) }); }
    noteBox(760, 215, 700, 80, [['類別資料・長條分開', 32]], '#fff8e2', prog(lt, 3.2, .6));
  } };
  const s4 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 400);
    dad(230, GY, .8, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('散佈圖：收縮壓 vs 舒張壓（CVD 資料，取 400 筆）', 1160, 150, 46, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 560 + (v - 70) / 180 * 1100, Y = v => 800 - (v - 40) / 100 * 520;
    axis(540, 1720, 800, { p: prog(lt, .4, .5) }); axis(560, 560, 240, { p: prog(lt, .4, .5) });
    [80, 120, 160, 200, 240].forEach(v => txt(String(v), X(v), 834, 24, { p: prog(lt, .5, .3) })); [60, 90, 120].forEach(v => txt(String(v), 520, Y(v), 24, { align: 'right', p: prog(lt, .5, .3) }));
    txt('收縮壓', 1720, 850, 28, { color: COL.gray, p: prog(lt, .5, .3) }); txt('舒張壓', 560, 215, 28, { color: COL.gray, p: prog(lt, .5, .3) });
    const kd = prog(lt, .8, 2.0);
    SCATTER.forEach(([s, d], i) => { const k = prog(kd, i / SCATTER.length, .04); if (k <= 0) return; shape(ellPts(X(s), Y(d), 6, 6, 0, 7, 8), { fill: COL.blueL, w: 1.6, alpha: k * .9 }); });
    const kr = prog(lt, 2.8, .8);
    if (kr > 0) { ink([[X(80), Y(53)], [X(220), Y(118)]], { w: 5, color: COL.red, p: kr, alpha: .8 }); txt('r = 0.74　正相關', X(190), Y(70), 40, { color: COL.red, p: prog(lt, 3.2, .5) }); }
  } };
  const FIVE = [70, 108.5, 120.5, 135, 276];
  const s5 = { beats: [0, 2.6, 4.4], draw(lt) {
    txt('作業預告：CVD 收縮壓的五數總結', 960, 150, 48, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 300 + (v - 60) / 230 * 1320, y = 480;
    axis(280, 1680, y + 120, { p: prog(lt, .3, .5) });
    [60, 100, 140, 180, 220, 260].forEach(v => { inkLine(X(v), y + 112, X(v), y + 128, { w: 3, p: prog(lt, .4, .3) }); txt(String(v), X(v), y + 156, 26, { p: prog(lt, .4, .3) }); });
    const labs = ['最小 70', 'Q1 108.5', '中位數 120.5', 'Q3 135', '最大 276'];
    FIVE.forEach((v, i) => { const k = prog(lt, .5 + i * .4, .5); if (k > 0) { ink([[X(v), y + 110], [X(v), y - 40]], { w: 5, color: i === 2 ? COL.red : COL.green, p: k }); txt(labs[i], X(v), y - 70 - (i % 2) * 40, 30, { color: i === 2 ? COL.red : COL.green, p: k }); } });
    const kb = prog(lt, 2.7, 1.0);
    if (kb > 0) boxH(0, y + 40, 60, X, { min: 70, q1: 108.5, med: 120.5, q3: 135, whi: 174.5, out: [] }, kb, INK);
    txt('← 五個數 = 盒鬚圖', X(200), y + 40, 32, { color: COL.blue, p: prog(lt, 3.2, .5) });
    txt('（鬚線到 Q3 + 1.5 IQR = 174.75；更大的值是界外值）', 760, y + 210, 26, { color: COL.gray, p: prog(lt, 3.6, .5) });
    noteBox(700, 800, 980, 80, [['直方圖看形狀・長條圖比類別・散佈圖看關係', 36, COL.blue]], '#fff8e2', prog(lt, 4.6, .6));
  } };
  const order = [[s1, 6], [s2, 8], [s3, 6], [s4, 6], [s5, 7]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 1 章 EP3　看圖說話：直方圖、長條圖、散佈圖', scenes,
    sources: ['資料來源', '課堂資料：lung cancer study；作業資料：CVD_All（64,489 筆）', 'Playfair (1786) The Commercial and Political Atlas', '林老師講義〈第一章〉p.28–36'] };
})();
EPISODES['c1e3'] = C1E3;
const SCATTER = [[117, 74], [130, 85], [140, 86], [97, 66], [134, 106], [121, 88], [104, 74], [96, 68], [116, 75], [85, 68], [132, 82], [120, 70], [164, 80], [180, 120], [113, 82], [103, 71], [142, 88], [124, 80], [104, 78], [113, 64], [151, 105], [116, 80], [94, 59], [140, 86], [109, 77], [122, 75], [124, 88], [123, 78], [140, 84], [154, 103], [144, 106], [124, 69], [114, 65], [127, 73], [126, 94], [128, 96], [126, 78], [135, 98], [114, 74], [120, 74], [104, 75], [128, 78], [133, 102], [121, 71], [139, 84], [145, 108], [105, 62], [110, 74], [112, 67], [102, 71], [98, 64], [124, 73], [143, 92], [109, 76], [105, 74], [138, 90], [97, 68], [107, 66], [104, 64], [103, 52], [138, 84], [130, 80], [95, 59], [161, 100], [96, 64], [141, 84], [138, 74], [94, 60], [128, 83], [122, 86], [125, 79], [114, 70], [114, 72], [117, 70], [142, 99], [163, 112], [126, 77], [130, 92], [170, 86], [134, 69], [100, 70], [148, 84], [108, 77], [102, 64], [175, 100], [108, 79], [138, 69], [151, 100], [106, 67], [159, 74], [159, 96], [103, 51], [114, 74], [130, 80], [130, 69], [109, 69], [112, 66], [95, 64], [128, 70], [122, 86], [94, 64], [128, 77], [128, 77], [132, 87], [131, 81], [166, 88], [131, 79], [116, 75], [134, 81], [108, 66], [117, 68], [131, 78], [104, 72], [134, 74], [98, 81], [125, 84], [108, 74], [118, 78], [117, 68], [108, 67], [123, 70], [140, 99], [112, 81], [144, 84], [140, 80], [111, 78], [116, 76], [103, 67], [109, 62], [76, 60], [105, 77], [90, 58], [112, 67], [92, 65], [104, 76], [172, 97], [139, 88], [115, 81], [122, 80], [119, 83], [112, 82], [92, 65], [139, 92], [135, 101], [118, 74], [110, 73], [118, 88], [179, 136], [125, 86], [129, 78], [153, 108], [108, 70], [165, 108], [118, 74], [156, 92], [146, 86], [141, 92], [117, 66], [138, 79], [119, 97], [102, 76], [121, 69], [104, 70], [152, 100], [114, 78], [112, 68], [145, 62], [104, 72], [154, 82], [119, 85], [153, 93], [148, 86], [136, 80], [126, 111], [114, 71], [110, 64], [112, 77], [126, 79], [154, 97], [97, 66], [138, 115], [118, 79], [137, 81], [123, 80], [124, 91], [104, 68], [139, 93], [116, 80], [159, 99], [122, 61], [114, 78], [105, 69], [154, 90], [120, 72], [155, 115], [152, 86], [144, 84], [139, 77], [132, 87], [132, 82], [96, 62], [100, 82], [131, 81], [145, 100], [106, 78], [138, 82], [177, 98], [108, 73], [132, 89], [99, 66], [94, 58], [106, 68], [114, 80], [146, 93], [130, 88], [148, 99], [142, 90], [141, 76], [117, 80], [93, 62], [122, 80], [104, 63], [100, 76], [96, 68], [145, 92], [129, 72], [108, 64], [111, 66], [98, 66], [112, 68], [141, 97], [148, 81], [123, 80], [158, 81], [142, 86], [112, 82], [123, 93], [120, 70], [122, 94], [109, 68], [138, 92], [114, 72], [100, 70], [119, 75], [125, 86], [122, 76], [108, 76], [140, 91], [137, 96], [86, 61], [106, 81], [109, 68], [122, 78], [108, 73], [146, 90], [138, 89], [104, 65], [101, 70], [127, 92], [110, 66], [130, 77], [117, 67], [122, 72], [133, 88], [144, 96], [108, 70], [132, 74], [148, 86], [134, 89], [107, 83], [132, 76], [126, 80], [118, 78], [142, 90], [108, 74], [120, 82], [142, 86], [95, 57], [150, 91], [150, 95], [172, 73], [148, 88], [138, 79], [133, 69], [123, 71], [115, 74], [138, 69], [145, 96], [95, 58], [108, 62], [110, 72], [126, 88], [121, 87], [117, 77], [121, 66], [103, 66], [170, 110], [136, 75], [123, 76], [123, 86], [159, 99], [115, 82], [145, 93], [126, 90], [111, 72], [115, 77], [104, 67], [96, 58], [156, 78], [98, 70], [107, 71], [115, 75], [115, 76], [146, 104], [142, 82], [128, 78], [140, 88], [129, 79], [145, 93], [125, 75], [167, 69], [154, 94], [107, 84], [138, 78], [172, 101], [125, 88], [132, 94], [129, 87], [138, 69], [130, 79], [140, 96], [100, 72], [112, 79], [123, 73], [100, 71], [89, 67], [114, 67], [128, 67], [110, 81], [87, 80], [124, 78], [132, 80], [128, 61], [152, 92], [147, 98], [92, 71], [129, 86], [120, 64], [106, 66], [102, 72], [134, 88], [125, 87], [114, 80], [126, 76], [105, 67], [92, 61], [127, 85], [112, 76], [158, 90], [121, 62], [133, 76], [122, 78], [94, 62], [139, 70], [154, 100], [104, 68], [118, 90], [133, 91], [148, 84], [103, 72], [122, 63], [116, 75], [148, 106], [118, 74], [166, 90], [113, 76], [150, 94], [114, 80], [138, 89], [105, 68], [152, 82], [142, 91], [126, 90], [113, 70], [118, 67], [108, 62], [121, 77], [120, 78], [112, 74], [110, 72], [126, 94], [107, 76], [104, 65], [97, 67], [104, 77], [109, 66], [120, 74], [145, 94], [150, 91], [93, 62]];

// ============ 第 2 章 EP1：機率是什麼（邊際、聯合、條件機率） ============
const SMOKE = [['0 包', 45795, 41629, 4166], ['1 包', 14404, 13021, 1383], ['2 包', 1596, 1420, 176], ['超過 2 包', 168, 144, 24]]; // 表 2-1
const SMOKE_N = 61963;
const C2E1 = (() => {
  const fmt = n => n.toLocaleString('en-US');
  function die(x, y, s, face, rot, k = 1) {
    appear(k, () => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
      shape(roundRectPts(-40, -40, 80, 80, 12), { fill: COL.white, w: 4 });
      const pips = { 1: [[0, 0]], 2: [[-20, -20], [20, 20]], 3: [[-20, -20], [0, 0], [20, 20]], 4: [[-20, -20], [20, -20], [-20, 20], [20, 20]], 5: [[-20, -20], [20, -20], [0, 0], [-20, 20], [20, 20]], 6: [[-20, -22], [20, -22], [-20, 0], [20, 0], [-20, 22], [20, 22]] }[face];
      ctx.fillStyle = INK; ctx.globalAlpha = ALPHA; pips.forEach(([px, py]) => { ctx.beginPath(); ctx.arc(px, py, 6.5, 0, 7); ctx.fill(); });
      ctx.restore();
    });
  }
  function umbrella(x, y, s, k = 1) {
    appear(k, () => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      shape(ellPts(0, 0, 150, 110, P, 2 * P, 30).concat([[150, 0], [110, 18], [75, 0], [37, 18], [0, 0], [-37, 18], [-75, 0], [-110, 18], [-150, 0]]), { fill: COL.pinkL, w: 4, pattern: 'dots', patColor: COL.pink, sp: 20, r: 4 });
      inkLine(0, 0, 0, 170, { w: 5 }); ink(ellPts(18, 170, 18, 18, 0, P, 12), { w: 5 });
      ctx.restore();
    });
  }
  function sun(x, y, r, k = 1) {
    appear(k, () => {
      shape(ellPts(x, y, r, r, 0, 7, 30), { fill: COL.mustard, w: 4 });
      for (let i = 0; i < 10; i++) { const a = i / 10 * 2 * P + RLT * .3; inkLine(x + Math.cos(a) * (r + 14), y + Math.sin(a) * (r + 14), x + Math.cos(a) * (r + 40), y + Math.sin(a) * (r + 40), { w: 4, color: COL.mustardD }); }
    });
  }
  // 1654 Pascal & Fermat: problem of points
  const s1 = { beats: [0, 2.2, 5.6], draw(lt) {
    ground(lt);
    txt('1654・巴黎與土魯斯：帕斯卡與費馬的通信', 960, 140, 50, { p: prog(lt, .2, .9), color: COL.black });
    pascal(380, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: lt > 5.5 ? 'smile' : 'flat' });
    fermat(1540, GY, .9, { la: [P - .3, P - .2], lhand: 'open', look: -1 });
    // table with dice & coins
    const kt = prog(lt, .5, .6);
    appear(kt, () => { shape(rectPts(760, 700, 400, 24), { fill: '#8a5a33', smooth: false, w: 4 }); inkLine(790, 724, 780, GY, { w: 5 }); inkLine(1130, 724, 1140, GY, { w: 5 }); });
    die(850, 650, .75, 5, -.2, prog(lt, .8, .5)); die(960, 655, .75, 3, .3, prog(lt, 1.0, .5));
    for (let i = 0; i < 9; i++) shape(ellPts(1060 + (i % 3) * 22, 672 - Math.floor(i / 3) * 10, 16, 6, 0, 7, 14), { fill: COL.mustard, w: 2.5, alpha: kt });
    // flying letter
    const kl = prog(lt, 2.3, 2.2);
    if (kl > 0 && kl < 1) { const e = easeOut(kl); paperSheet(lerp(520, 1400, e), 430 - Math.sin(e * P) * 160, 120, 90, (e - .5) * .6); }
    const ks = prog(lt, 2.4, .6);
    noteBox(960, 300, 760, 80, [['賭局中斷：比數 2 : 1，賭金怎麼分？', 38]], '#fff8e2', ks);
    const kb = prog(lt, 3.8, .8);
    if (kb > 0) {
      const x0 = 580, y = 420, w = 760 * easeOut(kb);
      shape(rectPts(x0, y, w * .75, 60), { fill: COL.blueL, smooth: false, w: 3.5, pattern: 'hatch', patColor: COL.blue, sp: 16 });
      shape(rectPts(x0 + w * .75, y, w * .25, 60), { fill: COL.pinkL, smooth: false, w: 3.5 });
      txt('3/4', x0 + 760 * .375, y + 32, 34, { color: COL.blue, p: kb }); txt('1/4', x0 + 760 * .875, y + 32, 34, { color: COL.pink, p: kb });
      txt('依「贏的可能性」分：3 : 1', 960, 540, 36, { color: COL.black, p: prog(lt, 4.4, .6) });
    }
    noteBox(960, 960, 640, 70, [['這幾封信 → 機率論的起點', 34, COL.blue]], COL.white, prog(lt, 5.8, .6));
  } };
  // probability 0..1, rain
  const s2 = { beats: [0, 2.2, 4.8], draw(lt) {
    ground(lt, 140, 900);
    sun(300, 240, 60, prog(lt, 2.4, .6));
    kid(520, GY, 1.0, { la: [P + .2, P - .8], look: -1, mouth: lt > 2.4 ? 'o' : 'smile', brow: lt > 2.4 ? 1 : 0, bob: idle(RLT) * .3 });
    umbrella(430, 440, .9, prog(lt, 2.2, .5));
    txt('機率：0 到 1 之間的數', 1350, 150, 50, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 1000 + v * 700, y = 400;
    axis(960, 1760, y, { p: prog(lt, .4, .6) });
    [0, .5, 1].forEach(v => { inkLine(X(v), y - 10, X(v), y + 10, { w: 3.5, p: prog(lt, .6, .4) }); txt(v === .5 ? '0.5' : String(v), X(v), y + 40, 30, { p: prog(lt, .6, .4) }); });
    txt('不可能', X(0), y - 40, 28, { color: COL.gray, p: prog(lt, .9, .4) }); txt('一定發生', X(1), y - 40, 28, { color: COL.gray, p: prog(lt, .9, .4) });
    const kp = prog(lt, 2.4, .6);
    if (kp > 0) { shape(ellPts(X(.7), y, 16, 16, 0, 7, 12), { fill: COL.pink, w: 3, alpha: kp }); txt('降雨機率 0.7', X(.7), y - 60, 36, { color: COL.pink, p: kp }); txt('≠ 一定下雨', X(.7), 520, 34, { color: COL.red, p: prog(lt, 3.2, .5) }); }
    const kb = prog(lt, 5.0, .8);
    if (kb > 0) {
      const x0 = 1000, yy = 640, w = 700 * easeOut(kb);
      shape(rectPts(x0, yy, w * .7, 70), { fill: COL.blueL, smooth: false, w: 3.5, pattern: 'hatch', patColor: COL.blue, sp: 16 });
      shape(rectPts(x0 + w * .7, yy, w * .3, 70), { fill: COL.mustard, smooth: false, w: 3.5 });
      txt('下雨 0.7', x0 + 245, yy + 36, 32, { color: COL.blue, p: kb }); txt('不下雨 0.3', x0 + 595, yy + 36, 30, { color: COL.mustardD, p: kb });
      txt('0.7 + 0.3 = 1：所有可能加起來一定是 1', 1350, 790, 38, { color: COL.black, p: prog(lt, 5.8, .6) });
    }
  } };
  // Keelung smoking table: marginal probability
  const s3 = { beats: [0, 2.0, 5.0], draw(lt) {
    ground(lt, 140, 460);
    mom(260, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('基隆心血管疾病調查：61,963 人的每日菸量（表 2-1）', 1160, 140, 44, { p: prog(lt, .2, .9), color: COL.black });
    const X0 = 620, Y0 = 220, RH = 100;
    const kh = prog(lt, .5, .5);
    appear(kh, () => { txt('每日菸量', X0 + 110, Y0, 32, { color: COL.gray }); txt('人數', X0 + 420, Y0, 32, { color: COL.gray }); txt('機率', X0 + 760, Y0, 32, { color: COL.gray }); inkLine(X0, Y0 + 30, X0 + 1140, Y0 + 30, { w: 3.5 }); });
    SMOKE.forEach(([lab, n], i) => {
      const y = Y0 + 70 + i * RH, k = prog(lt, 2.1 + i * .35, .5), kp = prog(lt, 5.1 + i * .3, .5);
      appear(k, () => { txt(lab, X0 + 110, y + 10, 36, { color: COL.black }); txt(fmt(n), X0 + 420, y + 10, 36, { color: COL.blue }); });
      bar(X0 + 1000 + 0, y + 30, 0, 0, COL.blueL); // keep pattern seed stable
      const bw = n / SMOKE_N * 420 * easeOut(k);
      if (bw > 0) shape(rectPts(X0 + 560, y - 20, bw, 50), { fill: COL.blueL, smooth: false, w: 3, pattern: 'hatch', patColor: COL.blue, sp: 14 });
      if (kp > 0) txt((n / SMOKE_N).toFixed(3), X0 + 1060, y + 10, 36, { color: COL.pink, p: kp });
    });
    inkLine(X0, Y0 + 70 + 4 * RH - 50, X0 + 1140, Y0 + 70 + 4 * RH - 50, { w: 3.5, p: prog(lt, 3.6, .4) });
    txt('合計', X0 + 110, Y0 + 80 + 4 * RH, 36, { p: prog(lt, 3.7, .4), color: COL.black }); txt('61,963', X0 + 420, Y0 + 80 + 4 * RH, 36, { color: COL.blue, p: prog(lt, 3.7, .4) });
    txt('1.000', X0 + 1060, Y0 + 80 + 4 * RH, 36, { color: COL.pink, p: prog(lt, 6.4, .5) });
    noteBox(1160, 800, 980, 80, [['人數 ÷ 總人數 ＝ 邊際機率（marginal probability）', 34, COL.pink]], '#fff8e2', prog(lt, 6.0, .6));
  } };
  // joint probability grid
  const s4 = { beats: [0, 2.4, 5.6], draw(lt) {
    txt('兩個變數一起看：每日菸量 × 心血管疾病（表 2-2）', 960, 130, 46, { p: prog(lt, .2, .9), color: COL.black });
    const X0 = 440, Y0 = 230, CW = 260, RH = 100;
    const kh = prog(lt, .5, .5);
    appear(kh, () => {
      txt('無 CVD', X0 + CW * .5, Y0 - 30, 32, { color: COL.gray }); txt('有 CVD', X0 + CW * 1.5, Y0 - 30, 32, { color: COL.gray }); txt('邊際', X0 + CW * 2.5, Y0 - 30, 32, { color: COL.gray });
      inkLine(X0 - 220, Y0, X0 + CW * 3, Y0, { w: 3.5 }); inkLine(X0, Y0 - 60, X0, Y0 + RH * 5, { w: 3.5 }); inkLine(X0 + CW * 2, Y0 - 60, X0 + CW * 2, Y0 + RH * 5, { w: 2.5, dash: true });
    });
    const showP = lt > 2.4;
    SMOKE.forEach(([lab, n, a, b], i) => {
      const y = Y0 + RH * i + 60, k = prog(lt, .8 + i * .25, .5);
      appear(k, () => {
        txt(lab, X0 - 110, y, 32, { color: COL.black });
        const kp = prog(lt, 2.5 + i * .2, .5);
        const cell = (v, x, col) => { if (kp <= 0) txt(fmt(v), x, y, 32, { color: COL.blue }); else { txt(fmt(v), x, y - 22, 22, { color: COL.gray, p: kp }); txt((v / SMOKE_N).toFixed(4), x, y + 14, 34, { color: col, p: kp }); } };
        cell(a, X0 + CW * .5, COL.pink); cell(b, X0 + CW * 1.5, COL.pink);
        const km = prog(lt, 5.8 + i * .15, .4); if (km > 0) txt((n / SMOKE_N).toFixed(3), X0 + CW * 2.5, y, 32, { color: COL.mustardD, p: km });
      });
    });
    const ky = Y0 + RH * 4 + 60, kc = prog(lt, 6.4, .5);
    inkLine(X0 - 220, ky - 50, X0 + CW * 3, ky - 50, { w: 2.5, dash: true, p: kc });
    appear(kc, () => { txt('邊際', X0 - 110, ky, 32, { color: COL.gray }); txt('0.9072', X0 + CW * .5, ky, 32, { color: COL.mustardD }); txt('0.0928', X0 + CW * 1.5, ky, 32, { color: COL.mustardD }); txt('1.000', X0 + CW * 2.5, ky, 34, { color: COL.black }); });
    // highlight joint cell (0 包, 無)
    const kj = prog(lt, 3.2, .6);
    if (kj > 0) { ink(roundRectPts(X0 + 20, Y0 + 15, CW - 40, RH - 20, 14), { closed: true, w: 6, color: COL.red, p: kj }); }
    noteBox(1560, 420, 600, 130, [['P(不吸菸 且 無 CVD)', 34, COL.red], ['= 41,629 ÷ 61,963 = 0.6718', 34, COL.red]], '#fff8e2', prog(lt, 3.6, .6));
    txt('聯合機率（joint probability）', 1560, 560, 32, { color: COL.gray, p: prog(lt, 4.2, .5) });
    noteBox(1560, 760, 600, 80, [['8 格加總 = 1；列、行加總 = 邊際機率', 28, COL.blue]], COL.white, prog(lt, 6.0, .6));
  } };
  // conditional probability: homework 1
  const s5 = { beats: [0, 2.4, 5.4, 8.0], draw(lt) {
    ground(lt, 1500, 1800);
    dad(1700, GY, .75, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: lt > 5.4 ? 'o' : 'flat', brow: lt > 5.4 ? 1 : 0 });
    txt('作業 1：某城市 10,000 人，吸菸與肺癌', 760, 130, 46, { p: prog(lt, .2, .9), color: COL.black });
    // population box
    const BX = 200, BY = 210, BW = 900, BH = 500;
    const kb = prog(lt, .5, .7);
    appear(kb, () => { shape(rectPts(BX, BY, BW, BH), { fill: COL.white, smooth: false, w: 4 }); txt('全部 10,000 人', BX + 130, BY + 40, 30, { color: COL.gray }); });
    // smokers box (20%)
    const SX = BX + 20, SY = BY + 90, SW = BW * .2 - 20, SH = BH - 110;
    const ks = prog(lt, 1.0, .7);
    appear(ks, () => { shape(rectPts(SX, SY, SW, SH), { fill: COL.mustard, smooth: false, w: 4 }); txt('吸菸', SX + SW / 2, SY + 40, 32, { color: COL.black }); txt('2,000', SX + SW / 2, SY + 85, 34, { color: COL.black }); });
    appear(prog(lt, 1.4, .6), () => { txt('不吸菸 8,000', BX + BW * .6, SY + 60, 32, { color: COL.gray }); txt('（肺癌 30）', BX + BW * .6, SY + 110, 26, { color: COL.gray }); });
    // lung cancer block inside smokers (1%)
    const kc = prog(lt, 1.9, .6);
    appear(kc, () => { shape(rectPts(SX + 10, SY + SH - 70, SW - 20, 50), { fill: COL.pink, smooth: false, w: 3.5 }); txt('肺癌 20', SX + SW / 2, SY + SH - 42, 26, { color: COL.white }); });
    // formulas
    const F = [[2.6, 'P(吸菸) = 2,000 ÷ 10,000 = 0.2', COL.blue], [3.9, 'P(吸菸 且 無肺癌) = 1,980 ÷ 10,000 = 0.198', COL.blue], [5.6, 'P(肺癌 | 吸菸) = 20 ÷ 2,000 = 0.01', COL.red]];
    F.forEach(([at, s, col], i) => txt(s, 650, 780 + i * 52, 32, { color: col, align: 'center', p: prog(lt, at, .6) }));
    // denominator frame shrinks from whole population to smokers
    const kd = prog(lt, 5.5, 1.2);
    if (kd > 0) {
      const e = easeOut(kd);
      const x = lerp(BX - 10, SX - 10, e), y = lerp(BY - 10, SY - 10, e), w = lerp(BW + 20, SW + 20, e), h = lerp(BH + 20, SH + 20, e);
      ink(roundRectPts(x, y, w, h, 12), { closed: true, w: 7, color: COL.red });
      txt('← 分母 = 吸菸的 2,000 人', SX + SW + 30, SY + SH / 2 + 60, 32, { color: COL.red, align: 'left', p: prog(lt, 6.4, .5) });
    }
    noteBox(1500, 300, 520, 90, [['條件機率', 36, COL.red], ['先限定「已知」的那群人', 30, COL.red]], '#fff8e2', prog(lt, 8.1, .6));
  } };
  const s6 = { beats: [0, 2.8], draw(lt) {
    ground(lt, 140, 1000);
    txt('三種機率', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    const cards = [['邊際 P(X)', '一個變數', COL.mustardD], ['聯合 P(X, Y)', '兩個同時發生', COL.pink], ['條件 P(Y | X)', '先限定分母', COL.red]];
    cards.forEach(([a, b, col], i) => noteBox(1400, 290 + i * 140, 620, 120, [[a, 38, col], [b, 28, COL.gray]], '#fff8e2', prog(lt, .4 + i * .5, .6)));
    txt('算機率之前，先問：分母是誰？', 1400, 150, 44, { p: prog(lt, 2.9, .6), color: COL.black });
  } };
  const order = [[s1, 9], [s2, 8], [s3, 8], [s4, 8], [s5, 10], [s6, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 2 章 EP1　機率是什麼：邊際、聯合、條件機率', scenes,
    sources: ['資料來源', 'Pascal–Fermat 1654 年通信：APS News (2009) This Month in Physics History', '基隆心血管疾病調查 CVD_All（61,963 人，講義表 2-1、2-2）', '作業 1：講義 p.29；課程網站 Chapter 02 計算核對', '林老師講義〈第二章 基礎機率及抽樣分配〉'] };
})();
EPISODES['c2e1'] = C2E1;

// ============ 第 2 章 EP2：二項式與常態（從銅板到鐘形曲線） ============
const SBP5 = [0, 0, 24, 99, 357, 880, 1882, 3143, 4412, 5431, 6088, 6065, 6020, 4935, 4136, 3502, 2721, 2161, 1683, 1111, 779, 569, 390, 323, 230, 123, 110, 72, 40, 31, 26, 12]; // 無 CVD 收縮壓，60 起每 5 mmHg 一組，n = 57,387
const BIN30 = [0.0012, 0.0093, 0.0337, 0.0785, 0.1325, 0.1723, 0.1795, 0.1538, 0.1106, 0.0676, 0.0355, 0.0161, 0.0064]; // Binomial(30, 0.2)
const C2E2 = (() => {
  function book(x, y, s, k) {
    appear(k, () => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      shape(rectPts(-120, -80, 240, 160), { fill: '#8a3b2f', smooth: false, w: 4 });
      inkLine(-120, -50, 120, -50, { w: 2.5, color: COL.mustard }); inkLine(-120, 50, 120, 50, { w: 2.5, color: COL.mustard });
      txt('Ars', 0, -8, 34, { color: COL.mustard }); txt('Conjectandi', 0, 30, 26, { color: COL.mustard });
      ctx.restore();
    });
  }
  function coin(x, y, r, k, face) { appear(k, () => { shape(ellPts(x, y, r, r * Math.abs(Math.cos(RLT * 6)), 0, 7, 24), { fill: COL.mustard, w: 3.5 }); txt(face, x, y + 8, 28, { color: COL.mustardD }); }); }
  const s1 = { beats: [0, 2.4, 5.0], draw(lt) {
    ground(lt);
    txt('1713・巴塞爾：雅各・白努利《猜度術》', 960, 140, 50, { p: prog(lt, .2, .9), color: COL.black });
    bernoulli(520, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    book(1000, 600, 1, prog(lt, .6, .6));
    appear(prog(lt, .5, .5), () => { shape(rectPts(820, 690, 360, 24), { fill: '#8a5a33', smooth: false, w: 4 }); inkLine(850, 714, 840, GY, { w: 5 }); inkLine(1150, 714, 1160, GY, { w: 5 }); });
    const kc = prog(lt, 2.5, .5);
    coin(1450, 380 - Math.abs(Math.sin(RLT * 3)) * 120, 50, kc, '成功');
    noteBox(1450, 580, 520, 130, [['只有兩種結果：', 32], ['成功 p　失敗 1 − p', 36, COL.blue]], '#fff8e2', prog(lt, 2.8, .6));
    noteBox(960, 300, 820, 80, [['過世 8 年後由姪子出版 → 二項式分配、大數法則', 32, COL.gray]], COL.white, prog(lt, 5.1, .6));
  } };
  // five draws, p = .5
  const PMF5 = [0.03125, 0.15625, 0.3125, 0.3125, 0.15625, 0.03125];
  const s2 = { beats: [0, 2.4, 5.2], draw(lt) {
    txt('男女各半，隨機抽 5 人：男生出現幾次？', 960, 130, 46, { p: prog(lt, .2, .9), color: COL.black });
    const base = 760, x0 = 300, bw = 150;
    axis(240, 1240, base, { p: prog(lt, .4, .4) });
    PMF5.forEach((p, k) => { const h = p * 1500 * easeOut(prog(lt, .6 + k * .15, .5)), x = x0 + k * bw + 60; bar(x, base, 100, h, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 16 }); txt(String(k) + ' 男', x, base + 36, 28, { p: prog(lt, .5, .3) }); if (h > 5) txt(p.toFixed(5), x, base - h - 22, 22, { color: COL.gray, p: prog(lt, 1.0 + k * .15, .3) }); });
    // k = 1: five positions
    const k1 = prog(lt, 2.5, .8);
    if (k1 > 0) {
      ink(roundRectPts(x0 + bw + 60 - 60, base - PMF5[1] * 1500 - 50, 120, PMF5[1] * 1500 + 55, 12), { closed: true, w: 5, color: COL.pink, p: k1 });
      for (let r = 0; r < 5; r++) { const kr = prog(lt, 2.7 + r * .2, .3); for (let c = 0; c < 5; c++) shape(ellPts(1380 + c * 50, 240 + r * 58, 18, 18, 0, 7, 12), { fill: c === r ? COL.blue : COL.white, w: 3, alpha: kr }); }
      txt('C(5,1) = 5 種位置 → 5 × 0.5⁵ = 0.15625', 1500, 560, 30, { color: COL.pink, p: prog(lt, 3.8, .6) });
    }
    const k2 = prog(lt, 5.3, .8);
    if (k2 > 0) {
      ink(roundRectPts(x0 + 2 * bw + 60 - 60, base - PMF5[2] * 1500 - 50, 120, PMF5[2] * 1500 + 55, 12), { closed: true, w: 5, color: COL.green, p: k2 });
      noteBox(1500, 700, 720, 110, [['恰 2 男：C(5,2) = 10（不是 5 × 4）', 32, COL.green], ['10 × 0.5⁵ = 0.3125', 32, COL.green]], '#fff8e2', k2);
    }
  } };
  // homework 2: Bin(30, .2)
  const s3 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('作業 2：30 位選手，每人受傷機率 0.2 → X ～ Binomial(30, 0.2)', 960, 130, 44, { p: prog(lt, .2, .9), color: COL.black });
    // 30 mini athletes, 6 injured on average
    const km = prog(lt, .5, 1.2);
    for (let i = 0; i < 30; i++) { const k = clamp(km * 30 - i); if (k > 0) mini(250 + (i % 10) * 70, 300 + Math.floor(i / 10) * 90, .55, [3, 9, 14, 17, 25, 28].includes(i) && lt > 5.6 ? COL.pink : COL.blueL, 'dots'); }
    const base = 760, x0 = 1000, bw = 66;
    axis(960, 1900, base, { p: prog(lt, .4, .4) });
    BIN30.forEach((p, k) => { const h = p * 1800 * easeOut(prog(lt, .8 + k * .1, .5)), x = x0 + k * bw + 30; bar(x, base, 48, h, k === 3 && lt > 2.7 ? COL.pink : COL.blueL, { pattern: 'hatch', patColor: k === 3 && lt > 2.7 ? COL.red : COL.blue, sp: 12 }); txt(String(k), x, base + 32, 24, { p: prog(lt, .6, .3) }); });
    txt('受傷人數', 1860, base + 32, 24, { p: prog(lt, .6, .3) });
    const k3 = prog(lt, 2.7, .6);
    noteBox(1440, 300, 760, 110, [['P(X = 3) = C(30,3) × 0.2³ × 0.8²⁷', 32, COL.red], ['= 0.0785', 36, COL.red]], '#fff8e2', k3);
    const k4 = prog(lt, 5.5, .6);
    if (k4 > 0) { ink([[x0 + 6 * bw + 30, base], [x0 + 6 * bw + 30, 440]], { w: 5, color: COL.green, p: k4 }); txt('平均 np = 6', x0 + 6 * bw + 30, 420, 30, { color: COL.green, p: k4 }); }
    noteBox(600, 880, 760, 80, [['平均 np = 6　變異數 np(1−p) = 4.8', 34, COL.green]], COL.white, prog(lt, 6.0, .6));
  } };
  // Galton quincunx
  const ROWS = 10;
  const s4 = { beats: [0, 2.6, 5.4], draw(lt) {
    ground(lt, 140, 520);
    galton(330, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('1873・高爾頓的五點梅花機（Quincunx）', 1160, 130, 46, { p: prog(lt, .2, .9), color: COL.black });
    const cx = 1160, top = 220, dy = 36, dx = 42, base = 760;
    const kb = prog(lt, .4, .8);
    appear(kb, () => {
      shape(rectPts(cx - 320, top - 40, 640, base - top + 60), { fill: COL.white, smooth: false, w: 4 });
      for (let r = 0; r < ROWS; r++) for (let c = 0; c <= r; c++) { ctx.fillStyle = INK; ctx.globalAlpha = ALPHA * .8; ctx.beginPath(); ctx.arc(cx + (c - r / 2) * dx, top + r * dy, 4.5, 0, 7); ctx.fill(); }
      for (let b = -5; b <= 5; b++) inkLine(cx + (b + .5) * dx, base, cx + (b + .5) * dx, base - 160, { w: 2.5, alpha: .6 });
    });
    // balls: deterministic random walks
    const N = 80, bins = new Array(11).fill(0);
    const t0 = 1.0, dur = 1.6, gap = .06;
    for (let i = 0; i < N; i++) {
      const u = (lt - t0 - i * gap) / dur; if (u < 0) continue;
      let pos = 0; const path = []; for (let r = 0; r < ROWS; r++) { pos += rnd(i, r + 10) < .5 ? -.5 : .5; path.push(pos); }
      if (u >= 1) { bins[Math.round(pos + 5)]++; continue; }
      const r = u * ROWS, ri = Math.floor(r), f = r - ri, p0 = ri === 0 ? 0 : path[ri - 1], p1 = path[Math.min(ri, ROWS - 1)];
      const bx = cx + lerp(p0, p1, f) * dx, by = top + r * dy;
      shape(ellPts(bx, by, 9, 9, 0, 7, 10), { fill: COL.pink, w: 2 });
    }
    bins.forEach((n, b) => { for (let j = 0; j < n; j++) shape(ellPts(cx + (b - 5) * dx, base - 10 - j * 17, 8, 8, 0, 7, 8), { fill: COL.pink, w: 1.8 }); });
    const kc = prog(lt, 5.5, .8);
    if (kc > 0) curve(cx, base - 2, 230, 230, normalPdf, { w: 5, color: COL.blue, p: kc, range: 3 });
    noteBox(1160, 860, 900, 80, [['每顆球左右各 0.5 → 二項式；球夠多 → 鐘形的常態', 32, COL.blue]], '#fff8e2', prog(lt, 5.8, .6));
    noteBox(1600, 300, 520, 90, [['每顆球：10 次', 30], ['左或右，機率各 0.5', 30, COL.gray]], COL.white, prog(lt, 2.7, .6));
  } };
  // Keelung SBP histogram + normal
  const s5 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('57,387 位無心血管疾病基隆市民的收縮壓（講義圖 2-4）', 960, 130, 44, { p: prog(lt, .2, .9), color: COL.black });
    const base = 740, X = v => 360 + (v - 60) / 160 * 1200, mean = 122.3, sd = 20.3;
    axis(330, 1600, base, { p: prog(lt, .3, .4) });
    [80, 100, 120, 140, 160, 180, 200].forEach(v => { inkLine(X(v), base - 8, X(v), base + 8, { w: 3 }); txt(String(v), X(v), base + 34, 26, { p: prog(lt, .4, .3) }); });
    txt('mmHg', 1600, base + 34, 24, { p: prog(lt, .4, .3) });
    SBP5.forEach((n, i) => { const h = n / 6100 * 420 * easeOut(prog(lt, .5 + i * .04, .5)); if (h > 0) bar(X(60 + i * 5 + 2.5), base, 34, h, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 14 }); });
    const kc = prog(lt, 2.7, .8);
    if (kc > 0) curve(X(mean), base, (3 * sd) / 160 * 1200, 420 * 1.02, normalPdf, { w: 5, color: COL.red, p: kc, range: 3 });
    txt('平均 122・標準差 20', X(mean), 250, 36, { color: COL.red, p: prog(lt, 3.2, .5) });
    const bands = [[1, '68%', COL.green, 5.5], [2, '95%', COL.mustardD, 6.2], [3, '99.7%', COL.pink, 6.9]];
    bands.forEach(([k, lab, col, at], i) => { const kk = prog(lt, at, .5); if (kk > 0) { const y = 300 + i * 40; ink([[X(mean - k * sd), y], [X(mean + k * sd), y]], { w: 4, color: col, p: kk }); inkLine(X(mean - k * sd), y - 10, X(mean - k * sd), y + 10, { w: 3, color: col, p: kk }); inkLine(X(mean + k * sd), y - 10, X(mean + k * sd), y + 10, { w: 3, color: col, p: kk }); txt(`±${k} SD → ${lab}`, X(mean + 3 * sd) + 150, y + 8, 28, { color: col, p: kk }); } });
    noteBox(1500, 620, 640, 110, [['實際資料：', 28, COL.gray], ['70.1%・95.7%・99.1%', 32, COL.blue]], '#fff8e2', prog(lt, 7.4, .6));
  } };
  // standardisation & height example
  const s6 = { beats: [0, 2.4, 5.2], draw(lt) {
    ground(lt, 1500, 1800);
    kid(1700, GY, 1.0, { bob: idle(RLT) * .4, mouth: lt > 5.2 ? 'o' : 'smile' });
    noteBox(760, 150, 1000, 90, [['標準化：z = (數值 − 平均) ÷ 標準差', 40, COL.blue]], '#fff8e2', prog(lt, .2, .6));
    txt('講義例：95% 的學生身高在 1.1 到 1.7 公尺', 760, 290, 40, { p: prog(lt, 2.5, .6), color: COL.black });
    const base = 620, X = v => 360 + (v - .95) / .9 * 900, m = 1.4, sd = .15;
    const k = prog(lt, 2.7, .8);
    if (k > 0) {
      shadeUnder(X(m), base, 3 * sd / .9 * 900, 260, normalPdf, -2, 2, COL.greenL, { alpha: .8 });
      axis(330, 1330, base, { p: k }); curve(X(m), base, 3 * sd / .9 * 900, 260, normalPdf, { w: 5, p: k, range: 3 });
      [1.1, 1.4, 1.7].forEach(v => { inkLine(X(v), base - 8, X(v), base + 8, { w: 3, p: k }); txt(v.toFixed(1), X(v), base + 34, 28, { p: k }); });
      txt('平均 (1.1+1.7)/2 = 1.4', X(m), 680, 30, { color: COL.blue, p: prog(lt, 3.4, .5) });
      txt('標準差 (1.7−1.1)/4 = 0.15', X(m), 720, 30, { color: COL.blue, p: prog(lt, 3.9, .5) });
    }
    const k2 = prog(lt, 5.3, .8);
    if (k2 > 0) {
      const v = 1.4 + 2.326 * .15;
      ink([[X(v), base], [X(v), 380]], { w: 5, color: COL.red, p: k2 }); txt('第 99 百分位：z = 2.326', X(v) + 20, 400, 30, { color: COL.red, align: 'left', p: k2 });
      txt('1.4 + 2.326 × 0.15 ≈ 1.75 m', X(v) + 20, 440, 30, { color: COL.red, align: 'left', p: prog(lt, 5.9, .5) });
      noteBox(1500, 330, 560, 110, [['平均 + 3 SD = 1.85 m', 30, COL.gray], ['是第 99.87 百分位，不是第 99', 26, COL.gray]], COL.white, prog(lt, 6.6, .6));
    }
  } };
  const s7 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('兩種分配', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 620, 120, [['二項式：數「幾次」', 38, COL.blue], ['離散・參數 n, p', 28, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 620, 120, [['常態：量「多少」', 38, COL.red], ['連續・參數 μ, σ', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('n 夠大，二項式也長成鐘形', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 8], [s2, 8], [s3, 8], [s4, 9], [s5, 9], [s6, 9], [s7, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 2 章 EP2　二項式與常態：從銅板到鐘形曲線', scenes,
    sources: ['資料來源', 'Bernoulli (1713) Ars Conjectandi；Galton (1873) quincunx（Kunert et al. 2001）', '基隆 CVD_All 無心血管疾病者收縮壓（n = 57,387）', '作業 2、身高例：講義 p.23、p.30；課程網站 Chapter 02 計算核對', '林老師講義〈第二章 基礎機率及抽樣分配〉'] };
})();
EPISODES['c2e2'] = C2E2;

// ============ 第 2 章 EP3：抽樣分配與中央極限定理 ============
const MEANS = { // 從 57,387 筆收縮壓反覆抽樣 2,000 次的樣本平均數直方圖（80 起每 2.5 mmHg）
  1: [7, 8, 13, 17, 29, 34, 45, 56, 76, 72, 111, 98, 106, 82, 118, 82, 129, 99, 124, 74, 78, 62, 55, 60, 67, 34, 36, 24, 30, 28, 21, 22, 16, 15, 10, 13],
  5: [0, 0, 0, 0, 0, 0, 1, 1, 12, 18, 36, 67, 87, 158, 184, 243, 219, 216, 178, 154, 129, 93, 82, 51, 29, 18, 9, 7, 3, 3, 1, 1, 0, 0, 0, 0],
  40: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 8, 102, 352, 599, 538, 270, 101, 25, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
const C2E3 = (() => {
  const s1 = { beats: [0, 2.6, 5.4], draw(lt) {
    ground(lt, 140, 700);
    demoivre(400, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('1733・倫敦：棣美弗的小冊子', 1200, 130, 50, { p: prog(lt, .2, .9), color: COL.black });
    const kp = prog(lt, .6, .6);
    appear(kp, () => { paperSheet(1000, 420, 260, 340, -.05); curve(1000, 520, 100, 110, normalPdf, { w: 4, range: 3 }); txt('1733', 1000, 300, 30, { color: COL.gray }); });
    noteBox(1500, 330, 600, 110, [['第一次導出常態曲線', 34, COL.blue], ['（至今只剩 2 份）', 28, COL.gray]], '#fff8e2', prog(lt, 1.2, .6));
    // timeline
    const y = 760, kt = prog(lt, 2.7, .8);
    axis(700, 1860, y, { p: kt });
    [[1733, '棣美弗', '常態曲線'], [1810, '拉普拉斯', '推廣到一般情形'], [1920, '波利亞', '命名「中央極限定理」']].forEach(([yr, who, what], i) => {
      const x = 800 + i * 440, k = prog(lt, 3.0 + i * 1.1, .6);
      if (k > 0) { inkLine(x, y - 14, x, y + 14, { w: 4, p: k }); txt(String(yr), x, y + 50, 34, { color: COL.black, p: k }); txt(who, x, y - 60, 32, { color: COL.blue, p: k }); txt(what, x, y - 24, 24, { color: COL.gray, p: k }); }
    });
  } };
  const s2 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 140, 600);
    kid(360, GY, 1.0, { la: [P + .2, P - .8], look: 1, mouth: 'o', brow: 1, bob: idle(RLT) * .4 });
    bubble(560, 300, 700, 150, 450, 470, '', 36, prog(lt, .3, .6));
    appear(prog(lt, .3, .6), () => { txt('量 1 個人的血壓，', 560, 275, 34, { color: COL.black }); txt('還是 40 個人取平均比較穩？', 560, 325, 34, { color: COL.black }); });
    txt('母體：57,387 位無心血管疾病市民的收縮壓', 1300, 150, 40, { p: prog(lt, 3.1, .6), color: COL.black });
    const base = 740, X = v => 760 + (v - 60) / 160 * 1000, k = prog(lt, 3.2, .8);
    if (k > 0) { axis(740, 1800, base, { p: k }); SBP5.forEach((n, i) => { const h = n / 6100 * 380 * easeOut(prog(lt, 3.3 + i * .03, .4)); if (h > 0) bar(X(60 + i * 5 + 2.5), base, 28, h, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 14 }); }); [80, 120, 160, 200].forEach(v => txt(String(v), X(v), base + 34, 26, { p: k })); txt('平均 122・標準差 20', 1300, 300, 36, { color: COL.red, p: prog(lt, 4.4, .5) }); }
  } };
  // simulation panels
  const s3 = { beats: [0, 3.0, 6.0], draw(lt) {
    txt('從真實資料反覆抽樣 2,000 次，看「樣本平均數」怎麼分布', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    const P3 = [[1, 20.3, 20.1, .4], [5, 9.1, 9.0, 3.1], [40, 3.2, 3.2, 6.1]];
    P3.forEach(([n, se, sd, at], i) => {
      const cx = 400 + i * 560, base = 700, X = v => cx - 260 + (v - 80) / 90 * 520, k = prog(lt, at, .8);
      if (k <= 0) return;
      txt(`每次抽 n = ${n} 人`, cx, 230, 36, { color: COL.black, p: k });
      axis(cx - 270, cx + 280, base, { p: k });
      [80, 120, 160].forEach(v => txt(String(v), X(v), base + 32, 24, { p: k }));
      const H = MEANS[n], mx = n === 40 ? 600 : n === 5 ? 250 : 130;
      H.forEach((c, j) => { const h = c / mx * 380 * easeOut(prog(lt, at + .3 + j * .03, .5)); if (h > 0) bar(X(80 + j * 2.5 + 1.25), base, 12, h, i === 2 ? COL.pinkL : COL.blueL, {}); });
      txt(`平均數的標準差 ≈ ${sd}`, cx, 770, 28, { color: i === 2 ? COL.red : COL.blue, p: prog(lt, at + 1.4, .5) });
      txt(`σ/√n = 20.3/√${n} = ${se}`, cx, 810, 28, { color: COL.gray, p: prog(lt, at + 1.9, .5) });
    });
    noteBox(960, 900, 960, 70, [['樣本愈大，平均數的分布愈窄、愈像常態', 34, COL.red]], '#fff8e2', prog(lt, 8.2, .6));
  } };
  const s4 = { beats: [0, 2.8], draw(lt) {
    txt('標準誤 SE = σ / √n', 960, 140, 56, { p: prog(lt, .2, .8), color: COL.blue });
    const base = 700, cx = 960;
    const k = prog(lt, .5, .8);
    if (k > 0) { axis(300, 1620, base, { p: k }); curve(cx, base, 540, 150, normalPdf, { w: 5, color: COL.blue, p: k, range: 3 }); txt('個別血壓：標準差 σ = 20', 420, 420, 32, { color: COL.blue, p: prog(lt, 1.0, .5) }); }
    const k2 = prog(lt, 2.9, .8);
    if (k2 > 0) { curve(cx, base, 540 / Math.sqrt(40), 150 * Math.sqrt(40) * .6, normalPdf, { w: 5, color: COL.red, p: k2, range: 3 }); txt('40 人平均：標準誤 = 20/√40 = 3.2', 1420, 300, 32, { color: COL.red, p: prog(lt, 3.3, .5) }); }
    noteBox(960, 860, 1100, 80, [['個別資料的分布沒有改變，變窄的是「平均數」的分布', 32, COL.black]], '#fff8e2', prog(lt, 3.9, .6));
  } };
  // homework 3
  const s5 = { beats: [0, 2.6, 5.4], draw(lt) {
    ground(lt, 1500, 1800);
    dad(1700, GY, .75, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile' });
    txt('作業 3：母體身高平均 170、標準差 10，隨機抽 40 人', 760, 130, 44, { p: prog(lt, .2, .9), color: COL.black });
    noteBox(760, 240, 1000, 90, [['樣本平均數 ≈ 常態，平均 170，標準誤 10/√40 = 1.58', 34, COL.blue]], '#fff8e2', prog(lt, 2.7, .6));
    const base = 680, cx = 700, wh = 450, hs = 260, X = z => cx + z / 3.6 * wh, k = prog(lt, 3.2, .8);
    if (k > 0) {
      shadeUnder(cx, base, wh, hs, normalPdf, 3.16, 3.6, COL.pink, { alpha: .9 });
      axis(200, 1250, base, { p: k }); curve(cx, base, wh, hs, normalPdf, { w: 5, p: k, range: 3.6 });
      [[-2, '166.8'], [0, '170'], [2, '173.2'], [3.16, '175']].forEach(([z, lab]) => { inkLine(X(z), base - 8, X(z), base + 8, { w: 3, p: k }); txt(lab, X(z), base + 34, 26, { p: k, color: z > 3 ? COL.red : COL.black }); });
    }
    const k2 = prog(lt, 5.5, .8);
    if (k2 > 0) { ink([[X(3.16), base], [X(3.16), 400]], { w: 5, color: COL.red, p: k2 }); txt('z = (175 − 170) ÷ 1.58 = 3.16', X(3.16) + 30, 420, 30, { color: COL.red, align: 'left', p: k2 }); txt('P(平均 > 175) ≈ 0.0008', X(3.16) + 30, 465, 30, { color: COL.red, align: 'left', p: prog(lt, 6.1, .5) }); }
    noteBox(760, 860, 880, 80, [['問的是 40 人的「平均」，不是 1 個人的身高', 32, COL.gray]], COL.white, prog(lt, 6.8, .6));
  } };
  const s6 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('中央極限定理', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(300, 820, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 640, 120, [['樣本平均數 → 常態', 38, COL.blue], ['不管原本資料長什麼樣', 28, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 640, 120, [['標準誤 = σ ÷ √n', 38, COL.red], ['樣本愈大，平均數愈穩', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('推論統計的基石', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 9], [s2, 7], [s3, 10], [s4, 6], [s5, 9], [s6, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 2 章 EP3　抽樣分配與中央極限定理', scenes,
    sources: ['資料來源', 'de Moivre (1733)；Laplace (1810)；Pólya (1920) 命名 — J. D. Cook, How the CLT began', '模擬：基隆 CVD_All 無心血管疾病者收縮壓（n = 57,387），各抽 2,000 次', '作業 3：講義 p.31；課程網站 Chapter 02 計算核對', '林老師講義〈第二章 基礎機率及抽樣分配〉'] };
})();
EPISODES['c2e3'] = C2E3;

// ============ 第 3 章 EP1：估計與信賴區間 ============
const CI100 = [[89.89,1],[89.61,1],[90.24,1],[90.07,1],[90.81,0],[89.39,1],[90.91,0],[89.84,1],[90.02,1],[90.09,1],[90.66,1],[89.87,1],[90.68,1],[90.23,1],[90.26,1],[90.33,1],[90.19,1],[89.83,1],[89.65,1],[89.27,1],[89.98,1],[89.78,1],[90.32,1],[90.02,1],[90.55,1],[89.81,1],[89.78,1],[90.31,1],[89.88,1],[90.24,1],[90.19,1],[90.16,1],[90.62,1],[90.09,1],[90.05,1],[89.84,1],[89.41,1],[90.58,1],[90.62,1],[90.07,1],[90.62,1],[90.2,1],[90.13,1],[89.79,1],[89.85,1],[89.66,1],[89.75,1],[89.67,1],[89.67,1],[90.08,1],[90.38,1],[90.5,1],[89.68,1],[90.91,0],[90.16,1],[90.22,1],[90.13,1],[89.55,1],[89.61,1],[90.26,1],[89.19,0],[90.21,1],[89.64,1],[90.23,1],[89.44,1],[90.26,1],[89.8,1],[89.31,1],[90.47,1],[89.9,1],[89.65,1],[89.89,1],[90.25,1],[90.12,1],[90.68,1],[89.26,1],[90.2,1],[90.05,1],[90.16,1],[90.63,1],[89.34,1],[90.43,1],[89.49,1],[89.73,1],[90.1,1],[89.31,1],[90.2,1],[90.34,1],[90.0,1],[89.8,1],[90.1,1],[89.51,1],[89.91,1],[89.15,0],[89.83,1],[90.34,1],[89.96,1],[90.25,1],[90.3,1],[90.84,0]]; // 模擬：母體平均 90、σ 2.6、n 40，各樣本平均與是否涵蓋
const C3E1 = (() => {
  const SE = 0.411;
  const s1 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 140, 760);
    neyman(420, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('1937・倫敦：奈曼的「信賴區間」', 1200, 130, 50, { p: prog(lt, .2, .9), color: COL.black });
    appear(prog(lt, .6, .6), () => { paperSheet(1000, 430, 260, 340, -.05); txt('1937', 1000, 320, 30, { color: COL.gray }); txt('Phil. Trans.', 1000, 400, 24, { color: COL.gray }); txt('R. Soc. A', 1000, 430, 24, { color: COL.gray }); });
    const k = prog(lt, 1.2, .8);
    if (k > 0) { const y = 480; axis(1250, 1850, y, { p: k }); ink([[1420, y - 40], [1420, y + 40]], { w: 6, color: COL.blue, p: k }); ink([[1700, y - 40], [1700, y + 40]], { w: 6, color: COL.blue, p: k }); ink([[1420, y], [1700, y]], { w: 8, color: COL.blue, p: k }); txt('a', 1420, y + 80, 34, { color: COL.blue, p: k }); txt('b', 1700, y + 80, 34, { color: COL.blue, p: k }); txt('母體參數大概在這個範圍', 1560, 400, 32, { color: COL.blue, p: prog(lt, 1.8, .5) }); }
    noteBox(1200, 760, 860, 100, [['不只給「一個數」，', 32], ['還給「一個範圍」加上「多有信心」', 34, COL.blue]], '#fff8e2', prog(lt, 3.1, .6));
  } };
  const s2 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('講義例：83 位國小學童，乳清蛋白 vs 碳水化合物，看跳高', 960, 130, 44, { p: prog(lt, .2, .9), color: COL.black });
    // population cloud
    const kp = prog(lt, .5, .8);
    appear(kp, () => { shape(ellPts(560, 520, 420, 300, 0, 7, 40), { fill: COL.white, w: 4, pattern: 'dots', patColor: '#e6e0cc', sp: 30, r: 3 }); for (let i = 0; i < 60; i++) { const a = rnd(i, 1) * 2 * P, r = Math.sqrt(rnd(i, 2)); mini(560 + Math.cos(a) * 360 * r, 560 + Math.sin(a) * 240 * r, .4, COL.blueL, 'dots'); } txt('母體：「所有」國小學生', 560, 260, 34, { color: COL.black }); txt('母體平均 μ 未知', 560, 850, 32, { color: COL.gray }); });
    const ka = prog(lt, 2.7, .8);
    if (ka > 0) { arrow(1000, 520, 1240, 520, { w: 5, head: 20, p: ka }); txt('抽樣', 1120, 480, 32, { color: COL.pink, p: ka }); }
    appear(prog(lt, 3.2, .7), () => { shape(roundRectPts(1260, 380, 360, 300, 30), { fill: COL.pinkL, w: 4 }); for (let i = 0; i < 20; i++) mini(1300 + (i % 5) * 70, 450 + Math.floor(i / 5) * 60, .4, COL.pink, 'dots'); txt('樣本：83 人', 1440, 720, 34, { color: COL.pink }); });
    const kb = prog(lt, 5.5, .8);
    if (kb > 0) { arrow(1240, 620, 1000, 620, { w: 5, head: 20, color: COL.blue, p: kb }); txt('推論（估計）', 1120, 670, 32, { color: COL.blue, p: kb }); }
    noteBox(1440, 250, 560, 90, [['樣本平均 x̄', 32], ['→ 母體平均的點估計', 30, COL.blue]], '#fff8e2', prog(lt, 6.2, .6));
  } };
  const s3 = { beats: [0, 2.2, 5.0], draw(lt) {
    ground(lt, 140, 560);
    const jump = -Math.abs(Math.sin(RLT * 2.5)) * 90;
    kid(350, GY, 1.0, { bob: jump, la: [P + .4, P - .6], ra: [-.4, -P / 2 + .6], mouth: 'smile' });
    txt('40 位攝取乳清蛋白的小運動員：平均跳高 90.2 公分，σ = 2.6', 1180, 130, 42, { p: prog(lt, .2, .9), color: COL.black });
    noteBox(1180, 250, 900, 80, [['標準誤 = 2.6 ÷ √40 = 0.411', 36, COL.blue]], '#fff8e2', prog(lt, 2.3, .6));
    const X = v => 700 + (v - 88.5) / 3 * 1000, y = 560;
    const k = prog(lt, .6, .8);
    axis(680, 1760, y, { p: k });
    [89, 90, 91].forEach(v => { inkLine(X(v), y - 10, X(v), y + 10, { w: 3, p: k }); txt(v + '', X(v), y + 40, 28, { p: k }); });
    txt('公分', 1760, y + 40, 24, { p: k });
    const kp = prog(lt, 1.0, .5);
    if (kp > 0) { shape(ellPts(X(90.2), y, 14, 14, 0, 7, 12), { fill: COL.pink, w: 3, alpha: kp }); txt('x̄ = 90.2', X(90.2), y - 50, 32, { color: COL.pink, p: kp }); }
    const kc = prog(lt, 5.1, 1.0);
    if (kc > 0) {
      const e = easeOut(kc), lo = 90.2 - .806 * e, hi = 90.2 + .806 * e;
      ink([[X(lo), y + 90], [X(hi), y + 90]], { w: 8, color: COL.blue }); inkLine(X(lo), y + 70, X(lo), y + 110, { w: 5, color: COL.blue }); inkLine(X(hi), y + 70, X(hi), y + 110, { w: 5, color: COL.blue });
      txt('89.39', X(89.394), y + 150, 30, { color: COL.blue, p: prog(lt, 5.8, .4) }); txt('91.01', X(91.006), y + 150, 30, { color: COL.blue, p: prog(lt, 5.8, .4) });
      noteBox(1180, 820, 980, 90, [['95% CI = 90.2 ± 1.96 × 0.411 = (89.39, 91.01)', 34, COL.blue]], '#fff8e2', prog(lt, 6.2, .6));
    }
  } };
  const s4 = { beats: [0, 2.6, 6.0], draw(lt) {
    txt('重複抽樣 100 次，每次 40 人，各算一條 95% 信賴區間（模擬）', 960, 120, 42, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 400 + (v - 88.3) / 3.4 * 900;
    const km = prog(lt, .5, .6);
    if (km > 0) { ink([[X(90), 180], [X(90), 940]], { w: 4, color: COL.red, dash: true, p: km }); txt('母體平均 μ = 90', X(90), 165, 28, { color: COL.red, p: km }); }
    const n = Math.floor(100 * clamp((lt - 1.0) / 4.5)); let miss = 0;
    for (let i = 0; i < n; i++) {
      const [m, c] = CI100[i], col = c ? COL.blue : COL.red, y = 195 + i * 7.5;
      if (!c) miss++;
      ink([[X(m - .806), y], [X(m + .806), y]], { w: c ? 2.5 : 4, color: col, alpha: .9 });
    }
    const kn = prog(lt, 1.2, .3);
    if (kn > 0) { noteBox(1560, 300, 480, 130, [['蓋住 μ：' + (n - miss), 36, COL.blue], ['沒蓋住：' + miss, 36, COL.red]], COL.white, kn); }
    noteBox(1560, 560, 500, 110, [['長期來看，約 95%', 32], ['的區間會包含母體平均', 32, COL.blue]], '#fff8e2', prog(lt, 6.1, .6));
    noteBox(1560, 760, 500, 110, [['不是「95% 的資料', 28, COL.gray], ['落在區間內」', 28, COL.gray]], COL.white, prog(lt, 7.2, .6));
  } };
  const s5 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('區間多寬？看信心水準，也看樣本數', 960, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 560 + (v - 88.8) / 2.8 * 1000;
    const rows = [['90%', 1.645, COL.green, .5], ['95%', 1.96, COL.blue, .9], ['99%', 2.576, COL.pink, 1.3]];
    axis(540, 1600, 560, { p: prog(lt, .3, .4) });
    [89, 90, 91].forEach(v => { inkLine(X(v), 550, X(v), 570, { w: 3, p: prog(lt, .3, .4) }); txt(v + '', X(v), 600, 26, { p: prog(lt, .3, .4) }); });
    rows.forEach(([lab, z, col, at], i) => {
      const k = prog(lt, at, .6); if (k <= 0) return;
      const y = 260 + i * 90, h = z * SE * easeOut(k);
      ink([[X(90.2 - h), y], [X(90.2 + h), y]], { w: 8, color: col }); inkLine(X(90.2 - h), y - 18, X(90.2 - h), y + 18, { w: 4, color: col }); inkLine(X(90.2 + h), y - 18, X(90.2 + h), y + 18, { w: 4, color: col });
      txt(lab, 420, y + 10, 34, { color: col, p: k }); txt(`±${z} × 0.411`, 1760, y + 10, 26, { color: col, p: prog(lt, at + .4, .4) });
    });
    txt('信心愈高，區間愈寬', 960, 470, 34, { color: COL.black, p: prog(lt, 2.0, .5) });
    const k2 = prog(lt, 2.7, .8);
    if (k2 > 0) {
      [[40, 0.411, COL.blue, 2.7], [160, 0.206, COL.mustardD, 3.6]].forEach(([n, se, col, at], i) => {
        const k = prog(lt, at, .6); if (k <= 0) return; const y = 700 + i * 80, h = 1.96 * se * easeOut(k);
        ink([[X(90.2 - h), y], [X(90.2 + h), y]], { w: 8, color: col }); inkLine(X(90.2 - h), y - 18, X(90.2 - h), y + 18, { w: 4, color: col }); inkLine(X(90.2 + h), y - 18, X(90.2 + h), y + 18, { w: 4, color: col });
        txt(`n = ${n}`, 420, y + 10, 34, { color: col, p: k }); txt(`標準誤 ${se}`, 1760, y + 10, 26, { color: col, p: k });
      });
      txt('樣本數四倍，區間減半', 960, 880, 34, { color: COL.black, p: prog(lt, 4.4, .5) });
    }
    noteBox(1620, 880, 500, 100, [['寬度 → 精密度', 30, COL.blue], ['信心水準 → 準確性', 30, COL.pink]], '#fff8e2', prog(lt, 5.5, .6));
  } };
  const s6 = { beats: [0, 2.4, 4.8, 7.2], draw(lt) {
    ground(lt, 1500, 1800);
    mom(1700, GY, .8, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('作業 1、2 快問快答：樣本數增加時…', 760, 130, 46, { p: prog(lt, .2, .9), color: COL.black });
    const Q = [[.5, '樣本平均值的標準誤變小', true, '✓ σ/√n 隨 n 變小'], [2.5, '樣本標準差變小', false, '✗ 不一定，它估計的是 σ'], [4.9, '95% 信賴區間包含 95% 的觀測資料', false, '✗ 區間是在估母體平均'], [7.3, '重複抽樣，約 95% 的區間包含母體平均', true, '✓ 這才是 95% 的意思']];
    Q.forEach(([at, q, ok, ans], i) => {
      const k = prog(lt, at, .6), y = 250 + i * 160;
      appear(k, () => { shape(rectPts(200, y - 50, 820, 100), { fill: COL.white, smooth: false, w: 3.5 }); txt(q, 610, y + 10, 32, { color: COL.black }); });
      const ka = prog(lt, at + 1.0, .5);
      if (ka > 0) { (ok ? check : cross)(1080, y, 1, ka); txt(ans, 1140, y + 10, 28, { color: ok ? COL.green : COL.red, align: 'left', p: ka }); }
    });
  } };
  const s7 = { beats: [0, 2.4], draw(lt) {
    ground(lt, 140, 1000);
    txt('估計', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(440, 680, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 640, 120, [['點估計：一個數', 38, COL.pink], ['x̄ = 90.2', 28, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 640, 120, [['區間估計：範圍 + 信心', 38, COL.blue], ['(89.39, 91.01)，95%', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('標準誤愈小，估得愈準', 1400, 150, 44, { p: prog(lt, 2.5, .6), color: COL.black });
  } };
  const order = [[s1, 7], [s2, 9], [s3, 9], [s4, 10], [s5, 9], [s6, 11], [s7, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 3 章 EP1　估計與信賴區間', scenes,
    sources: ['資料來源', 'Neyman (1937) Phil. Trans. R. Soc. A 236:333–380；USU Statistics History', '講義例：40 位小運動員跳高 90.2 cm、σ 2.6（p.12）；課程網站 Chapter 03 計算核對', '100 條區間：以母體平均 90、σ 2.6、n 40 模擬', '林老師講義〈估計及檢定〉'] };
})();
EPISODES['c3e1'] = C3E1;

// ============ 第 3 章 EP2：假設檢定與 P 值 ============
function normCdf(z) { const t = 1 / (1 + .2316419 * Math.abs(z)); const d = .3989423 * Math.exp(-z * z / 2); const p = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; }
const C3E2 = (() => {
  function teacup(x, y, s, milk, k = 1) {
    appear(k, () => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      shape(ellPts(0, 40, 70, 14, 0, 7, 20), { fill: COL.white, w: 3 });
      shape([[-60, -20], [60, -20], [48, 40], [-48, 40]], { fill: COL.white, w: 3.5 });
      shape(ellPts(0, -20, 60, 14, 0, 7, 20), { fill: milk ? '#e8d3b0' : '#8a5a33', w: 3 });
      ink(ellPts(72, 8, 18, 22, -P / 2, P / 2, 12), { w: 3.5 });
      ctx.restore();
    });
  }
  const s1 = { beats: [0, 3.2], draw(lt) {
    ground(lt);
    txt('1920 年代・英國洛桑農業試驗站：女士品茶', 960, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    bristol(380, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    fisher(1560, GY, .9, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: lt > 3.2 ? 'smile' : 'flat' });
    bubble(560, 330, 620, 120, 430, 480, '「先加奶」和「先加茶」，我喝得出來！', 30, prog(lt, .6, .6));
    const order = [1, 0, 0, 1, 0, 1, 1, 0];
    order.forEach((m, i) => teacup(700 + i * 80, 690, .55, m, prog(lt, 3.3 + i * .15, .4)));
    txt('8 杯：4 杯先加奶、4 杯先加茶，隨機排列', 960, 790, 32, { color: COL.black, p: prog(lt, 4.6, .5) });
    noteBox(1540, 330, 560, 90, [['費雪：那就來做實驗', 32], ['（1935《實驗設計》）', 26, COL.gray]], '#fff8e2', prog(lt, 3.4, .6));
  } };
  const s2 = { beats: [0, 2.6, 5.0], draw(lt) {
    txt('如果她只是亂猜，全部答對的機率有多大？', 960, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    const k = prog(lt, .5, .8);
    // 70 little arrangements as dots grid, one highlighted
    for (let i = 0; i < 70; i++) { const kk = clamp(k * 70 - i + 1); if (kk > 0) shape(rectPts(300 + (i % 14) * 64, 260 + Math.floor(i / 14) * 64, 50, 50), { fill: i === 23 ? COL.pink : COL.white, smooth: false, w: 2.5, alpha: kk }); }
    txt('8 杯選 4 杯當「先加奶」：C(8,4) = 70 種排法', 740, 620, 34, { color: COL.black, p: prog(lt, 1.6, .5) });
    noteBox(1520, 360, 600, 130, [['只有 1 種全對', 34, COL.pink], ['1/70 = 0.014', 40, COL.pink]], '#fff8e2', prog(lt, 2.7, .6));
    noteBox(960, 760, 1200, 110, [['虛無假設 H₀：她只是亂猜。', 34], ['若 H₀ 成立，全對這麼極端的事只有 1.4% 的機會 → 證據不利於 H₀', 30, COL.blue]], COL.white, prog(lt, 5.1, .7));
  } };
  const s3 = { beats: [0, 2.8], draw(lt) {
    txt('兩個假設', 960, 130, 56, { p: prog(lt, .2, .8), color: COL.black });
    const cards = [[480, 'H₀ 虛無假設', '維持原狀、沒有差別', COL.gray, '乳清蛋白與否，跳高能力相同', '貼布無療效'], [1440, 'Hₐ 對立假設', '研究者想證明的', COL.pink, '跳高能力不同', '貼布有療效']];
    cards.forEach(([x, t, sub, col, e1, e2], i) => {
      const k = prog(lt, .5 + i * 2.3, .7);
      appear(k, () => { shape(rectPts(x - 400, 220, 800, 560), { fill: '#fffdf6', smooth: false, w: 4 }); txt(t, x, 300, 48, { color: col }); txt(sub, x, 360, 32, { color: COL.gray }); inkLine(x - 340, 400, x + 340, 400, { w: 3 }); txt('例 1：' + e1, x, 500, 30, { color: COL.black }); txt('例 2：' + e2, x, 580, 30, { color: COL.black }); });
    });
    const ka = prog(lt, 1.6, .5);
    if (ka > 0) txt('⇄', 960, 510, 80, { color: COL.blue, p: ka });
    txt('決策只有兩種：拒絕 H₀，或無法拒絕 H₀', 960, 880, 36, { color: COL.blue, p: prog(lt, 5.0, .6) });
  } };
  const s4 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('講義例：30 人收縮壓平均 138.5，是否高於 130？（σ = 20）', 960, 130, 44, { p: prog(lt, .2, .9), color: COL.black });
    noteBox(960, 230, 900, 80, [['H₀：μ ≤ 130　　Hₐ：μ > 130　（右尾）', 36, COL.blue]], '#fff8e2', prog(lt, .6, .6));
    const base = 700, cx = 760, wh = 480, hs = 300, X = z => cx + z / 3.6 * wh;
    const k = prog(lt, 1.2, .8);
    if (k > 0) {
      shadeUnder(cx, base, wh, hs, normalPdf, 1.645, 3.6, COL.pinkL, { alpha: .9 });
      axis(240, 1320, base, { p: k }); curve(cx, base, wh, hs, normalPdf, { w: 5, p: k, range: 3.6 });
      txt('H₀ 成立時，z 的分布', cx, 360, 30, { color: COL.gray, p: k });
      [[0, '0'], [1.645, '1.645']].forEach(([z, lab]) => { inkLine(X(z), base - 8, X(z), base + 8, { w: 3, p: k }); txt(lab, X(z), base + 36, 26, { p: k }); });
      txt('拒絕域 α = 0.05', X(2.4), base + 80, 28, { color: COL.pink, p: prog(lt, 1.8, .5) });
    }
    const k2 = prog(lt, 2.7, .8);
    if (k2 > 0) {
      noteBox(1560, 420, 620, 130, [['z = (138.5 − 130) ÷ (20/√30)', 30, COL.red], ['= 8.5 ÷ 3.65 = 2.33', 36, COL.red]], COL.white, k2);
      ink([[X(2.33), base], [X(2.33), 420]], { w: 6, color: COL.red, p: prog(lt, 3.4, .5) }); txt('2.33', X(2.33), 400, 28, { color: COL.red, p: prog(lt, 3.4, .5) });
      shadeUnder(cx, base, wh, hs, normalPdf, 2.33, 3.6, COL.red, { alpha: .8 * prog(lt, 3.8, .5) });
    }
    const k3 = prog(lt, 5.5, .8);
    if (k3 > 0) { noteBox(1560, 640, 620, 130, [['右尾 P = 0.00996 < 0.05', 34, COL.red], ['拒絕 H₀：有證據支持 μ > 130', 30, COL.blue]], '#fff8e2', k3); txt('（課程網站更正值；原投影片 z = 5.06 不符題目數據）', 760, 830, 26, { color: COL.gray, p: prog(lt, 6.4, .5) }); }
  } };
  const s5 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 1500, 1800);
    dad(1700, GY, .75, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile' });
    txt('P 值到底是什麼？', 760, 140, 56, { p: prog(lt, .2, .8), color: COL.black });
    const Q = [[.6, 'H₀（和模型假設）成立時，出現「這麼極端或更極端」結果的機率', true], [3.1, 'H₀ 為真的機率', false], [4.3, '這次拒絕 H₀ 會出錯的機率', false]];
    Q.forEach(([at, q, ok], i) => { const k = prog(lt, at, .6), y = 300 + i * 170; appear(k, () => { shape(rectPts(160, y - 55, 1040, 110), { fill: COL.white, smooth: false, w: 3.5 }); txt(q, 680, y + 10, 30, { color: COL.black }); }); const ka = prog(lt, at + .6, .5); if (ka > 0) (ok ? check : cross)(1270, y, 1, ka); });
    noteBox(760, 800, 1000, 80, [['P 值小 → 資料和 H₀ 很不一致 → 拒絕 H₀ 的「風險」小', 30, COL.blue]], '#fff8e2', prog(lt, 5.4, .6));
  } };
  const s6 = { beats: [0, 2.0, 4.0, 6.0], draw(lt) {
    txt('檢定四步驟', 960, 130, 56, { p: prog(lt, .2, .8), color: COL.black });
    const steps = [['① 設假設', 'H₀、Hₐ，並訂 α'], ['② 選統計量', 'z、t…及其抽樣分布'], ['③ 找拒絕域', '依 α 與分布'], ['④ 算 P 值', '下結論、解釋']];
    steps.forEach(([t, d], i) => { const k = prog(lt, .4 + i * 2.0, .6), x = 330 + i * 420; appear(k, () => { shape(roundRectPts(x - 180, 320, 360, 260, 24), { fill: i === 3 ? COL.pinkL : '#fffdf6', w: 4 }); txt(t, x, 400, 40, { color: COL.black }); txt(d, x, 480, 28, { color: COL.gray }); }); if (i < 3) arrow(x + 190, 450, x + 230, 450, { w: 4, head: 14, p: prog(lt, 1.2 + i * 2.0, .4) }); });
    noteBox(960, 760, 900, 80, [['P < α → 拒絕 H₀；P ≥ α → 無法拒絕 H₀', 36, COL.blue]], '#fff8e2', prog(lt, 6.4, .6));
  } };
  const s7 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('假設檢定', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['P < α：拒絕 H₀', 38, COL.pink], ['資料與 H₀ 不一致', 28, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['P ≥ α：無法拒絕 H₀', 38, COL.blue], ['≠ 證明 H₀ 正確', 28, COL.red]], '#fff8e2', prog(lt, .9, .6));
    txt('用證據做決策', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 7], [s2, 8], [s3, 7], [s4, 9], [s5, 8], [s6, 9], [s7, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 3 章 EP2　假設檢定與 P 值', scenes,
    sources: ['資料來源', 'Fisher (1935) The Design of Experiments；Wikipedia: Muriel Bristol（1/70 = 1/C(8,4)）', '講義例：30 人收縮壓 138.5 vs 130、σ 20（p.25–26）；課程網站 Chapter 03 更正 z = 2.33', '林老師講義〈估計及檢定〉p.14–25'] };
})();
EPISODES['c3e2'] = C3E2;

// ============ 第 3 章 EP3：型一、型二錯誤與檢定力 ============
const C3E3 = (() => {
  const s1 = { beats: [0, 3.0], draw(lt) {
    ground(lt);
    txt('1933・奈曼與皮爾森：兩種錯誤與檢定力', 960, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    neyman(400, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    epearson(760, GY, .9, { look: -1, mouth: 'smile', bob: idle(RLT, 1) * .3 });
    fisher(1560, GY, .9, { la: [P - .3, P - .2], lhand: 'open', look: -1 });
    noteBox(1120, 330, 560, 130, [['型一錯誤 α', 34, COL.red], ['型二錯誤 β・檢定力 1 − β', 30, COL.blue]], '#fff8e2', prog(lt, .8, .6));
    noteBox(1560, 330, 480, 110, [['費雪 1925：', 28, COL.gray], ['α = 0.05 成為慣例', 32, COL.mustardD]], COL.white, prog(lt, 3.1, .6));
  } };
  const s2 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('決策 × 事實', 960, 120, 52, { p: prog(lt, .2, .8), color: COL.black });
    const X0 = 560, Y0 = 220, CW = 520, RH = 220;
    const kh = prog(lt, .5, .6);
    appear(kh, () => {
      txt('事實：H₀ 為真', X0 + CW * .5, Y0 - 20, 30, { color: COL.gray }); txt('事實：Hₐ 為真', X0 + CW * 1.5, Y0 - 20, 30, { color: COL.gray });
      txt('不拒絕 H₀', X0 - 160, Y0 + RH * .5 + 10, 30, { color: COL.gray }); txt('拒絕 H₀', X0 - 160, Y0 + RH * 1.5 + 10, 30, { color: COL.gray });
      inkLine(X0 - 300, Y0 + 10, X0 + CW * 2, Y0 + 10, { w: 3.5 }); inkLine(X0, Y0 - 50, X0, Y0 + RH * 2 + 10, { w: 3.5 }); inkLine(X0 - 300, Y0 + RH + 10, X0 + CW * 2, Y0 + RH + 10, { w: 2.5 }); inkLine(X0 + CW, Y0 - 50, X0 + CW, Y0 + RH * 2 + 10, { w: 2.5 });
    });
    const cells = [[0, 0, '決策正確', '1 − α', COL.green, 1.0], [1, 1, '決策正確（檢定力）', '1 − β', COL.green, 1.4], [0, 1, '型一錯誤', 'α', COL.red, 2.7], [1, 0, '型二錯誤', 'β', COL.blue, 5.3]];
    cells.forEach(([r, c, t, sym, col, at]) => { const k = prog(lt, at, .6); appear(k, () => { shape(rectPts(X0 + c * CW + 20, Y0 + r * RH + 30, CW - 40, RH - 40), { fill: col === COL.green ? COL.greenL : col === COL.red ? COL.pinkL : COL.blueL, smooth: false, w: 3 }); txt(t, X0 + c * CW + CW / 2, Y0 + r * RH + RH / 2 - 10, 34, { color: col }); txt(sym, X0 + c * CW + CW / 2, Y0 + r * RH + RH / 2 + 50, 40, { color: col }); }); });
    noteBox(960, 760, 1000, 80, [['型一：冤枉好人（H₀ 真卻拒絕）　型二：放過壞人（Hₐ 真卻沒拒絕）', 28, COL.black]], '#fff8e2', prog(lt, 6.0, .6));
  } };
  // glucose curves
  function glucose(lt, C, kAll, showAreas) {
    const base = 700, X = v => 300 + (v - 70) / 90 * 1200, sd = 10, hs = 320;
    axis(260, 1560, base, { p: kAll });
    [80, 100, 115, 126, 140, 150].forEach(v => { if (v === 115 && Math.abs(C - 115) > 2) return; inkLine(X(v), base - 8, X(v), base + 8, { w: 3, p: kAll }); txt(String(v), X(v), base + 36, 26, { p: kAll, color: v === 100 ? COL.blue : v === 126 ? COL.pink : COL.black }); });
    txt('mg/dl', 1570, base + 36, 22, { p: kAll });
    const wh = 3 * sd / 90 * 1200;
    if (showAreas) {
      shadeUnder(X(100), base, wh, hs, normalPdf, (C - 100) / sd, 3, COL.red, { alpha: .75 });
      shadeUnder(X(126), base, wh, hs, normalPdf, -3, (C - 126) / sd, COL.blue, { alpha: .75 });
    }
    curve(X(100), base, wh, hs, normalPdf, { w: 5, color: COL.blue, p: kAll, range: 3 }); curve(X(126), base, wh, hs, normalPdf, { w: 5, color: COL.pink, p: kAll, range: 3 });
    txt('正常人 平均 100', X(100), 330, 30, { color: COL.blue, p: kAll }); txt('糖尿病 平均 126', X(126), 330, 30, { color: COL.pink, p: kAll });
    ink([[X(C), base], [X(C), 280]], { w: 6, color: COL.red }); txt('切點 C = ' + Math.round(C), X(C), 255, 30, { color: COL.red });
    return X;
  }
  const s3 = { beats: [0, 3.0], draw(lt) {
    txt('講義例：用空腹血糖診斷糖尿病（兩曲線標準差以 10 示意）', 960, 130, 42, { p: prog(lt, .2, .9), color: COL.black });
    const k = prog(lt, .5, .8); if (k <= 0) return;
    glucose(lt, 115, k, lt > 3.1);
    const ka = prog(lt, 3.1, .6);
    noteBox(1700, 420, 400, 110, [['紅：型一錯誤 α', 28, COL.red], ['正常人被判有病', 24, COL.gray]], COL.white, ka);
    noteBox(1700, 600, 400, 110, [['藍：型二錯誤 β', 28, COL.blue], ['病人被判沒病', 24, COL.gray]], COL.white, prog(lt, 3.8, .6));
    txt('血糖 > C 判定有病', 960, 820, 32, { color: COL.black, p: prog(lt, 1.4, .5) });
  } };
  const s4 = { beats: [0, 2.8, 5.6], draw(lt) {
    txt('切點往右移：α 變小、β 變大；往左移則相反', 960, 130, 44, { p: prog(lt, .2, .9), color: COL.black });
    const u = lt < 2.8 ? 115 : lt < 5.6 ? lerp(115, 120, easeOut(prog(lt, 2.8, 1.5))) : lerp(120, 110, easeOut(prog(lt, 5.6, 1.5)));
    glucose(lt, u, 1, true);
    const a = 1 - normCdf((u - 100) / 10), b = normCdf((u - 126) / 10);
    noteBox(1700, 420, 400, 110, [['α = ' + a.toFixed(2), 36, COL.red], ['型一錯誤', 24, COL.gray]], COL.white, 1);
    noteBox(1700, 600, 400, 110, [['β = ' + b.toFixed(2), 36, COL.blue], ['型二錯誤', 24, COL.gray]], COL.white, 1);
    noteBox(960, 860, 1000, 80, [['兩種錯誤此消彼長，不會同時發生，也不能同時歸零', 32, COL.black]], '#fff8e2', prog(lt, 7.2, .6));
  } };
  const s5 = { beats: [0, 3.0], draw(lt) {
    txt('怎麼同時降低兩種錯誤？增加樣本數', 960, 130, 46, { p: prog(lt, .2, .9), color: COL.black });
    const base = 700, X = v => 300 + (v - 70) / 90 * 1200, hs = 320, C = 113;
    const n = lt < 3.0 ? 1 : lerp(1, 4, easeOut(prog(lt, 3.0, 2.0)));
    const sd = 10 / Math.sqrt(n), wh = 3 * sd / 90 * 1200, k = prog(lt, .5, .8);
    axis(260, 1560, base, { p: k });
    [100, 126].forEach(v => { inkLine(X(v), base - 8, X(v), base + 8, { w: 3, p: k }); txt(String(v), X(v), base + 36, 26, { p: k }); });
    if (k > 0) {
      shadeUnder(X(100), base, wh, hs * Math.sqrt(n) * .5, normalPdf, (C - 100) / sd, 3, COL.red, { alpha: .75 });
      shadeUnder(X(126), base, wh, hs * Math.sqrt(n) * .5, normalPdf, -3, (C - 126) / sd, COL.blue, { alpha: .75 });
      curve(X(100), base, wh, hs * Math.sqrt(n) * .5, normalPdf, { w: 5, color: COL.blue, p: k, range: 3 }); curve(X(126), base, wh, hs * Math.sqrt(n) * .5, normalPdf, { w: 5, color: COL.pink, p: k, range: 3 });
      ink([[X(C), base], [X(C), 300]], { w: 5, color: COL.red, p: k });
      txt('樣本平均的標準誤 = 10/√n', 960, 260, 32, { color: COL.gray, p: k });
    }
    const a = 1 - normCdf((C - 100) / sd), b = normCdf((C - 126) / sd);
    noteBox(1700, 400, 400, 180, [['n = ' + Math.round(n), 36, COL.black], ['α = ' + a.toFixed(3), 30, COL.red], ['β = ' + b.toFixed(3), 30, COL.blue]], COL.white, k);
    noteBox(1700, 640, 400, 100, [['檢定力 1 − β', 30, COL.green], ['= ' + (1 - b).toFixed(3), 34, COL.green]], '#fff8e2', prog(lt, 3.2, .6));
    txt('曲線變窄、分開 → β 變小、檢定力變大', 960, 860, 34, { color: COL.black, p: prog(lt, 5.0, .6) });
  } };
  const s6 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 1500, 1800);
    mom(1700, GY, .8, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('作業 4、5：α 與 P 值，哪裡不一樣？', 760, 140, 48, { p: prog(lt, .2, .8), color: COL.black });
    noteBox(760, 330, 1100, 150, [['顯著水準 α：事前設定', 38, COL.red], ['可以容忍的型一錯誤率（常用 0.05）', 30, COL.gray]], '#fff8e2', prog(lt, .6, .6));
    noteBox(760, 560, 1100, 150, [['P 值：事後算出', 38, COL.blue], ['資料與 H₀ 不一致的程度', 30, COL.gray]], '#fff8e2', prog(lt, 1.4, .6));
    noteBox(760, 800, 1100, 100, [['P < α → 拒絕 H₀，接受對立假設；P ≥ α → 無法拒絕 H₀', 32, COL.black]], COL.white, prog(lt, 3.1, .6));
  } };
  const s7 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('兩種錯誤', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['α 顧「冤枉」', 38, COL.red], ['β 顧「放過」', 38, COL.blue]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['樣本數是調節兩者的旋鈕', 34, COL.green], ['檢定力 = 1 − β', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('抓得到真正的差異，才是好檢定', 1400, 150, 42, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 7], [s2, 9], [s3, 7], [s4, 9], [s5, 8], [s6, 7], [s7, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 3 章 EP3　型一、型二錯誤與檢定力', scenes,
    sources: ['資料來源', 'Neyman & Pearson (1933)；Fisher (1925) Statistical Methods for Research Workers', '講義例：空腹血糖 100 vs 126 mg/dl、切點 115（p.20–21；標準差 10 為示意）', '林老師講義〈估計及檢定〉p.17–21、作業 4–5'] };
})();
EPISODES['c3e3'] = C3E3;

// ============ 第 5 章 EP1：變異數分析（為什麼不能兩兩比） ============
const ORG = [['Stomach 胃', 13, 286.0, 124.0, [124, 42, 25, 45, 412, 51, 1112, 46, 103, 876, 146, 340, 396]], ['Bronchus 支氣管', 17, 211.6, 155.0, [81, 461, 20, 450, 246, 166, 63, 64, 155, 859, 151, 166, 37, 223, 138, 72, 245]], ['Colon 結腸', 17, 457.4, 372.0, [248, 377, 189, 1843, 180, 537, 519, 455, 406, 365, 942, 776, 372, 163, 101, 20, 283]], ['Ovary 卵巢', 6, 884.3, 406.0, [1234, 89, 201, 356, 2970, 456]], ['Breast 乳房', 11, 1395.9, 1166.0, [1235, 24, 1581, 1166, 40, 727, 3808, 791, 1804, 3460, 719]]];
const C5E1 = (() => {
  const s1 = { beats: [0, 2.6, 5.6], draw(lt) {
    txt('講義例：配方奶加 DHA，四種濃度，嬰兒 18 個月時測視力與認知', 960, 130, 42, { p: prog(lt, .2, .9), color: COL.black });
    const G = [['0%', COL.gray], ['0.32%', COL.blueL], ['0.64%', COL.blue], ['0.96%', COL.pink]];
    const pos = [[560, 330], [1360, 330], [560, 700], [1360, 700]];
    G.forEach(([lab, col], i) => { const k = prog(lt, .5 + i * .25, .5), [x, y] = pos[i]; appear(k, () => { shape(roundRectPts(x - 150, y - 60, 300, 120, 24), { fill: COL.white, w: 4 }); txt('DHA ' + lab, x, y + 12, 36, { color: i === 0 ? COL.gray : COL.black }); }); });
    const pairs = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
    pairs.forEach(([a, b], i) => { const k = prog(lt, 2.7 + i * .3, .4); if (k > 0) { const [x1, y1] = pos[a], [x2, y2] = pos[b]; ink([[x1, y1], [x2, y2]], { w: 4, color: COL.red, p: k, alpha: .8 }); } });
    const kc = prog(lt, 4.6, .5);
    if (kc > 0) txt('兩兩比較：6 次 t 檢定', 960, 515, 40, { color: COL.red, p: kc });
    noteBox(960, 900, 1100, 90, [['每次 α = 0.05：6 次都不犯錯 0.95⁶ = 0.735 → 至少錯一次 0.265', 32, COL.red]], '#fff8e2', prog(lt, 5.7, .7));
  } };
  const s2 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 140, 760);
    fisher(420, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('1920 年代・洛桑：費雪的「變異數分析」', 1200, 130, 50, { p: prog(lt, .2, .9), color: COL.black });
    // field plots
    const k = prog(lt, .6, .8);
    appear(k, () => { for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const col = [COL.greenL, COL.mustard, COL.pinkL, COL.blueL][(r + c) % 4]; shape(rectPts(880 + c * 110, 300 + r * 90, 100, 80), { fill: col, smooth: false, w: 3 }); } txt('田間試驗：不同肥料、不同小區', 1095, 620, 28, { color: COL.gray }); });
    noteBox(1500, 400, 560, 130, [['一次檢定所有組：', 32], ['總變異 = 組間 + 組內', 36, COL.blue]], '#fff8e2', prog(lt, 3.1, .6));
    txt('F 分配以他的姓氏命名（Snedecor, 1934）', 1200, 800, 30, { color: COL.gray, p: prog(lt, 4.2, .5) });
  } };
  const s3 = { beats: [0, 2.4, 5.0, 7.4], draw(lt) {
    txt('把總變異拆成兩塊', 960, 130, 52, { p: prog(lt, .2, .8), color: COL.black });
    const X = v => 300 + v * 1.1, base = 640;
    const grp = [[320, [20, 60, 80, 110, 150]], [560, [230, 260, 300, 330, 370]], [800, [430, 470, 520, 560, 590]]];
    const gm = 350;
    axis(260, 1340, base, { p: prog(lt, .3, .4) });
    grp.forEach(([m, pts], gi) => { const col = [COL.blue, COL.green, COL.pink][gi]; pts.forEach((v, i) => { const k = prog(lt, .4 + gi * .3 + i * .06, .3); shape(ellPts(X(v), base - 40 - i * 28, 11, 11, 0, 7, 10), { fill: col, w: 2.5, alpha: k }); }); const km = prog(lt, 2.5 + gi * .2, .4); if (km > 0) { inkLine(X(m) - 0, base - 200, X(m), base - 10, { w: 4, color: col, p: km }); txt('組平均', X(m), base - 220, 24, { color: col, p: km }); } });
    const kg = prog(lt, 2.6, .5);
    if (kg > 0) { ink([[X(gm), base - 250], [X(gm), base - 5]], { w: 4, color: COL.black, dash: true, p: kg }); txt('總平均', X(gm), base - 270, 24, { color: COL.black, p: kg }); }
    const kb = prog(lt, 5.1, .6);
    if (kb > 0) { grp.forEach(([m]) => { inkLine(X(gm), base + 30, X(m), base + 30, { w: 6, color: COL.red, p: kb }); }); txt('組間：各組平均離總平均多遠 → SSB', 800, base + 70, 30, { color: COL.red, p: kb }); }
    const kw = prog(lt, 7.5, .6);
    if (kw > 0) { grp.forEach(([m, pts], gi) => pts.forEach((v, i) => inkLine(X(m), base - 40 - i * 28, X(v), base - 40 - i * 28, { w: 2.5, color: COL.gray, p: kw }))); txt('組內：每個點離自己組平均多遠 → SSW', 800, base + 110, 30, { color: COL.gray, p: kw }); }
    noteBox(1600, 300, 560, 180, [['SST = SSB + SSW', 36, COL.black], ['F = MSB ÷ MSW', 36, COL.blue], ['組間大於組內 → 有差異', 26, COL.gray]], '#fff8e2', prog(lt, 5.4, .6));
  } };
  const s4 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('課堂資料：64 位晚期癌症病人，依器官分 5 組，存活天數', 960, 130, 44, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 300 + v / 4000 * 1300, rows = ORG;
    axis(280, 1660, 760, { p: prog(lt, .3, .4) });
    [0, 1000, 2000, 3000, 4000].forEach(v => { inkLine(X(v), 752, X(v), 768, { w: 3, p: prog(lt, .3, .4) }); txt(v.toLocaleString(), X(v), 795, 24, { p: prog(lt, .3, .4) }); });
    txt('天', 1680, 795, 24, { p: prog(lt, .3, .4) });
    rows.forEach(([lab, n, m, md, pts], i) => {
      const y = 240 + i * 100, k = prog(lt, .5 + i * .3, .5);
      if (k <= 0) return;
      txt(lab, 150, y + 8, 26, { color: COL.black, p: k, align: 'left' });
      pts.forEach((v, j) => shape(ellPts(X(v), y + (rnd(i * 50 + j, 2) - .5) * 30, 8, 8, 0, 7, 8), { fill: COL.blueL, w: 2, alpha: k }));
      const km = prog(lt, 2.7 + i * .2, .4); if (km > 0) { inkLine(X(m), y - 28, X(m), y + 28, { w: 6, color: COL.red, p: km }); txt('平均 ' + m.toLocaleString(), X(m) + 16, y - 24, 22, { color: COL.red, align: 'left', p: km }); }
    });
    noteBox(1560, 460, 560, 110, [['乳癌組平均 1,396 天', 30, COL.red], ['支氣管組只有 212 天', 30, COL.blue]], '#fff8e2', prog(lt, 4.0, .6));
    noteBox(960, 900, 1000, 80, [['五組平均真的不同？還是抽樣的運氣？→ ANOVA', 34, COL.black]], COL.white, prog(lt, 5.5, .6));
  } };
  const s5 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('變異數分析表（講義）', 960, 130, 50, { p: prog(lt, .2, .8), color: COL.black });
    const X0 = 240, Y0 = 230, cols = [['變異來源', 0], ['平方和', 330], ['自由度', 620], ['均方', 840], ['F', 1130], ['p 值', 1330]];
    const kh = prog(lt, .4, .5);
    appear(kh, () => { cols.forEach(([t, dx]) => txt(t, X0 + dx + 60, Y0, 30, { color: COL.gray, align: 'left' })); inkLine(X0, Y0 + 30, X0 + 1500, Y0 + 30, { w: 3.5 }); });
    const rows = [['組間（處理）', '11,535,761', '4', '2,883,940', '6.43', '0.00023', .9, COL.red], ['組內（誤差）', '26,448,144', '59', '448,274', '', '', 1.5, COL.gray], ['總和', '37,983,905', '63', '', '', '', 2.0, COL.black]];
    rows.forEach(([a, b, c, d, e, f, at, col], i) => { const k = prog(lt, at, .5), y = Y0 + 90 + i * 80; appear(k, () => { [a, b, c, d, e, f].forEach((t, j) => txt(t, X0 + cols[j][1] + 60, y, 30, { color: j === 0 ? COL.black : col, align: 'left' })); }); });
    inkLine(X0, Y0 + 90 + 2 * 80 - 40, X0 + 1500, Y0 + 90 + 2 * 80 - 40, { w: 2.5, p: prog(lt, 2.0, .4) });
    noteBox(960, 580, 1100, 90, [['F = MSB ÷ MSW = 2,883,940 ÷ 448,274 = 6.43', 34, COL.blue]], '#fff8e2', prog(lt, 2.7, .6));
    const k = prog(lt, 5.5, .8);
    if (k > 0) {
      const base = 850, cx = 700, wh = 500, hs = 200, fpdf = z => { const x = z + 1.2; return x > 0 ? Math.pow(x, 1) * Math.exp(-x * 1.8) * 2.2 : 0; };
      shadeUnder(cx, base, wh, hs, fpdf, 1.6, 3.6, COL.pink, { alpha: .9 });
      axis(240, 1260, base, { p: k }); curve(cx, base, wh, hs, fpdf, { w: 5, p: k, range: 3.6 });
      txt('F(4, 59) 分布', 420, 700, 26, { color: COL.gray, p: k }); txt('6.43', cx + 2.4 / 3.6 * wh, 825, 26, { color: COL.red, p: k });
      noteBox(1560, 780, 560, 110, [['p = 0.00023 < 0.05', 32, COL.red], ['五組平均存活天數有顯著差異', 26, COL.black]], COL.white, prog(lt, 6.2, .6));
    }
  } };
  const s6 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('變異數分析', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(330, 790, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['三組以上 → 一次檢定', 38, COL.blue], ['不要兩兩做 t 檢定', 28, COL.red]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['F = 組間均方 ÷ 組內均方', 36, COL.black], ['前提：常態、變異數相同、獨立', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('F 顯著，只說「至少有兩組不同」', 1400, 150, 40, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 9], [s2, 7], [s3, 11], [s4, 9], [s5, 10], [s6, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 5 章 EP1　變異數分析：為什麼不能兩兩比', scenes,
    sources: ['資料來源', 'Fisher (1925) Statistical Methods for Research Workers；F 分配命名：Snedecor (1934)', '課堂資料 survival.csv（64 位病人、5 個器官）；講義 ANOVA 表', 'DHA 配方奶例與整體型一錯誤：講義 p.3–4', '林老師講義〈第五章 平均數檢定：多組樣本〉'] };
})();
EPISODES['c5e1'] = C5E1;

// ============ 第 5 章 EP2：事後檢定 Bonferroni ============
const BONF = [['Breast − Bronchus', 1184.3, 0.0003, true], ['Breast − Colon', 938.5, 0.0061, true], ['Breast − Stomach', 1109.9, 0.0015, true], ['Breast − Ovary', 511.6, 1, false], ['Bronchus − Ovary', -672.7, 0.3857, false], ['Ovary − Stomach', 598.3, 0.7528, false], ['Colon − Ovary', -426.9, 1, false], ['Bronchus − Colon', -245.8, 1, false], ['Colon − Stomach', 171.4, 1, false], ['Bronchus − Stomach', -74.4, 1, false]];
const C5E2 = (() => {
  const s1 = { beats: [0, 3.0, 6.0], draw(lt) {
    ground(lt, 140, 760);
    pauling(420, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('1976–1978・鮑林與卡麥隆：維他命 C 與晚期癌症', 1200, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    appear(prog(lt, .6, .6), () => { shape(roundRectPts(900, 300, 120, 220, 20), { fill: COL.mustard, w: 4 }); txt('維他命', 960, 390, 24, { color: COL.black }); txt('C', 960, 440, 40, { color: COL.black }); txt('每天 10 公克', 960, 570, 26, { color: COL.gray }); });
    noteBox(1500, 360, 600, 130, [['兩座諾貝爾獎得主', 30, COL.gray], ['報告：存活時間延長 3–4 倍', 32, COL.blue]], '#fff8e2', prog(lt, 1.4, .6));
    noteBox(1500, 600, 600, 130, [['後來梅約診所的隨機試驗', 28, COL.gray], ['找不到效果：對照組不可比', 28, COL.red]], COL.white, prog(lt, 3.1, .6));
    txt('課堂的 64 位病人存活資料，就出自這項研究', 1200, 820, 32, { color: COL.black, p: prog(lt, 6.1, .6) });
  } };
  const s2 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('F 顯著了，然後呢？哪幾組不一樣？', 960, 130, 50, { p: prog(lt, .2, .8), color: COL.black });
    const X = v => 300 + v / 1600 * 1300, y = 430;
    axis(280, 1660, y, { p: prog(lt, .4, .4) });
    ORG.forEach(([lab, n, m], i) => { const k = prog(lt, .6 + i * .2, .4); const col = [COL.blue, COL.blue, COL.blue, COL.blue, COL.red][i]; if (k > 0) { shape(ellPts(X(m), y, 16, 16, 0, 7, 12), { fill: col, w: 3, alpha: k }); txt(lab.split(' ')[1], X(m), y - 40 - (i % 2) * 36, 26, { color: col, p: k }); } });
    txt('各組平均存活天數', 960, 540, 28, { color: COL.gray, p: prog(lt, 1.6, .4) });
    noteBox(960, 640, 1100, 90, [['5 組兩兩比較：C(5,2) = 10 對', 36, COL.black]], '#fff8e2', prog(lt, 2.7, .6));
    noteBox(960, 790, 1100, 100, [['1936・Bonferroni：每對改用 α/10 = 0.005', 34, COL.blue], ['整體型一錯誤才不超過 0.05', 28, COL.gray]], COL.white, prog(lt, 5.3, .6));
  } };
  const s3 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('Bonferroni 多重比較（講義表）', 960, 120, 46, { p: prog(lt, .2, .8), color: COL.black });
    const X0 = 300, Y0 = 200;
    appear(prog(lt, .4, .5), () => { txt('比較', X0, Y0, 26, { color: COL.gray, align: 'left' }); txt('差異（天）', X0 + 520, Y0, 26, { color: COL.gray, align: 'left' }); txt('修正 p 值', X0 + 860, Y0, 26, { color: COL.gray, align: 'left' }); inkLine(X0 - 20, Y0 + 24, X0 + 1140, Y0 + 24, { w: 3 }); });
    BONF.forEach(([lab, d, p, sig], i) => { const k = prog(lt, .6 + i * .22, .4), y = Y0 + 70 + i * 56; appear(k, () => { txt(lab, X0, y, 28, { color: sig ? COL.red : COL.black, align: 'left' }); txt((d > 0 ? '+' : '') + d.toLocaleString(), X0 + 520, y, 28, { color: sig ? COL.red : COL.gray, align: 'left' }); txt(p === 1 ? '1' : p.toFixed(4), X0 + 860, y, 28, { color: sig ? COL.red : COL.gray, align: 'left' }); }); });
    const ks = prog(lt, 2.7, .6);
    if (ks > 0) ink(roundRectPts(X0 - 30, Y0 + 40, 1160, 3 * 56 + 10, 14), { closed: true, w: 5, color: COL.red, p: ks });
    noteBox(1620, 400, 520, 160, [['只有 3 對顯著：', 30, COL.black], ['乳癌 vs 支氣管、結腸、胃', 28, COL.red], ['乳癌組存活顯著較長', 26, COL.gray]], '#fff8e2', prog(lt, 3.2, .6));
    noteBox(1620, 720, 520, 130, [['t 的分母用全部 5 組', 26, COL.gray], ['的 MSW 來估變異', 26, COL.gray]], COL.white, prog(lt, 5.5, .6));
  } };
  const s4 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 1500, 1800);
    dad(1700, GY, .75, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile' });
    txt('事後檢定的兩個原則', 760, 140, 50, { p: prog(lt, .2, .8), color: COL.black });
    noteBox(760, 330, 1100, 150, [['① 先做整體 F 檢定', 38, COL.blue], ['F 不顯著，就不用再往下比', 30, COL.gray]], '#fff8e2', prog(lt, .5, .6));
    noteBox(760, 580, 1100, 150, [['② 多重比較要控制整體型一錯誤', 36, COL.red], ['Bonferroni：α ÷ 比較次數', 30, COL.gray]], '#fff8e2', prog(lt, 2.7, .6));
    txt('問 10 個問題，就要付 10 倍的小心', 760, 820, 34, { color: COL.black, p: prog(lt, 4.0, .6) });
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('事後檢定', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['F 顯著 → 再問「誰不一樣」', 36, COL.blue], ['Bonferroni：α / 比較數', 28, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['乳癌 vs 支氣管、結腸、胃', 34, COL.red], ['其他 7 對沒有顯著差異', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('資料還要問：各組可比嗎？', 1400, 150, 40, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 10], [s2, 9], [s3, 9], [s4, 7], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 5 章 EP2　事後檢定：Bonferroni 多重比較', scenes,
    sources: ['資料來源', 'Cameron & Pauling (1976, 1978) PNAS；Moertel et al. (1985) NEJM（梅約診所試驗）', 'Bonferroni (1936)；Dunn (1961) 多重比較', '講義 Bonferroni 多重比較表（10 對、3 對顯著）；survival.csv 重算相符', '林老師講義〈第五章 平均數檢定：多組樣本〉'] };
})();
EPISODES['c5e2'] = C5E2;

// ============ 第 5 章 EP3：Kruskal–Wallis 與作業 ============
const SUPP = [['A', [1.21, 1.19, 1.17, 1.23, 1.29, 1.14], 1.205], ['B', [1.34, 1.41, 1.38, 1.29, 1.36, 1.42, 1.37, 1.32], 1.361], ['C', [1.45, 1.45, 1.51, 1.39, 1.44], 1.448], ['D', [1.31, 1.32, 1.28, 1.35, 1.41, 1.27, 1.37], 1.33]];
const C5E3 = (() => {
  const s1 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 140, 760);
    kruskal(420, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('1952・芝加哥：克魯斯卡與瓦利斯的「秩次」檢定', 1200, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    const vals = [20, 45, 124, 155, 372, 1166, 3808], cols = [COL.blue, COL.blue, COL.pink, COL.green, COL.pink, COL.mustardD, COL.mustardD];
    vals.forEach((v, i) => { const k = prog(lt, .6 + i * .2, .4); appear(k, () => { shape(roundRectPts(880 + i * 130, 380, 110, 70, 14), { fill: COL.white, w: 3 }); txt(v.toLocaleString(), 935 + i * 130, 425, 24, { color: cols[i] }); }); const kr = prog(lt, 3.1 + i * .15, .4); if (kr > 0) rankTag(935 + i * 130, 520, i + 1, kr); });
    txt('不管數值多大，只看排第幾', 1330, 620, 34, { color: COL.black, p: prog(lt, 4.4, .5) });
    noteBox(1330, 780, 900, 80, [['不需要常態、不怕極端值：ANOVA 的無母數版本', 30, COL.blue]], '#fff8e2', prog(lt, 5.0, .6));
  } };
  const s2 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('課堂資料：存活天數偏斜、各組變異差很多 → 改用 Kruskal–Wallis', 960, 130, 42, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 300 + v / 4000 * 1300;
    ORG.forEach(([lab, n, m, md, pts], i) => { const y = 230 + i * 80, k = prog(lt, .4 + i * .2, .4); if (k <= 0) return; txt(lab.split(' ')[1], 150, y + 8, 26, { color: COL.black, p: k, align: 'left' }); pts.forEach((v, j) => shape(ellPts(X(v), y + (rnd(i * 50 + j, 2) - .5) * 24, 7, 7, 0, 7, 8), { fill: COL.blueL, w: 2, alpha: k })); const km = prog(lt, 2.7 + i * .15, .4); if (km > 0) { inkLine(X(md), y - 24, X(md), y + 24, { w: 6, color: COL.green, p: km }); txt('中位數 ' + md.toLocaleString(), X(md) + 14, y - 20, 20, { color: COL.green, align: 'left', p: km }); } });
    axis(280, 1660, 650, { p: prog(lt, .3, .4) }); [0, 1000, 2000, 3000, 4000].forEach(v => txt(v.toLocaleString(), X(v), 685, 22, { p: prog(lt, .3, .4) }));
    noteBox(960, 820, 1200, 100, [['H0：五組中位數相同。H = 14.95，自由度 4，p = 0.0048', 32, COL.red], ['結論同 ANOVA：各組不全相同', 28, COL.gray]], '#fff8e2', prog(lt, 5.3, .6));
  } };
  const s3 = { beats: [0, 2.6, 5.2, 7.6], draw(lt) {
    txt('作業：26 位選手，A、B、C、D 四種營養補充品，一週增重（公斤）', 960, 130, 42, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 360 + (v - 1.1) / .45 * 1100, base = 620;
    axis(330, 1500, base, { p: prog(lt, .3, .4) }); [1.1, 1.2, 1.3, 1.4, 1.5].forEach(v => { inkLine(X(v), base - 8, X(v), base + 8, { w: 3, p: prog(lt, .3, .4) }); txt(v.toFixed(1), X(v), base + 36, 24, { p: prog(lt, .3, .4) }); });
    SUPP.forEach(([lab, pts, m], i) => { const y = 230 + i * 90, col = [COL.blue, COL.green, COL.pink, COL.mustardD][i], k = prog(lt, .5 + i * .2, .4); if (k <= 0) return; txt(lab, 300, y + 10, 32, { color: col, p: k }); pts.forEach((v, j) => shape(ellPts(X(v), y + (rnd(i * 20 + j, 3) - .5) * 20, 9, 9, 0, 7, 8), { fill: col, w: 2.5, alpha: k })); const km = prog(lt, 2.7 + i * .15, .4); if (km > 0) { inkLine(X(m), y - 28, X(m), y + 28, { w: 5, color: COL.red, p: km }); txt(m.toFixed(2), X(m), y - 36, 22, { color: COL.red, p: km }); } });
    noteBox(1660, 300, 480, 150, [['H0：四組平均相同', 30, COL.black], ['Ha：不全相同', 30, COL.pink]], '#fff8e2', prog(lt, 1.6, .5));
    noteBox(1660, 540, 480, 150, [['ANOVA：F(3, 22) = 25.4', 28, COL.red], ['p < 0.001', 32, COL.red]], COL.white, prog(lt, 5.3, .6));
    noteBox(1660, 760, 480, 120, [['Kruskal–Wallis：', 26, COL.gray], ['H = 18.6, p = 0.0003', 28, COL.blue]], COL.white, prog(lt, 7.7, .6));
    txt('SSB = 0.171, SSW = 0.049；MSB = 0.057, MSW = 0.0022', 900, 720, 28, { color: COL.gray, p: prog(lt, 5.8, .5) });
  } };
  const s4 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('作業 Bonferroni：6 對，每對 α = 0.05/6 = 0.0083', 960, 130, 46, { p: prog(lt, .2, .9), color: COL.black });
    const P = [['A − B', -0.156, 0.0000, true], ['A − C', -0.243, 0.0000, true], ['A − D', -0.125, 0.0006, true], ['B − C', -0.087, 0.024, true], ['B − D', 0.031, 1, false], ['C − D', 0.118, 0.0019, true]];
    const X0 = 360, Y0 = 220;
    appear(prog(lt, .4, .5), () => { txt('比較', X0, Y0, 26, { color: COL.gray, align: 'left' }); txt('差異（kg）', X0 + 360, Y0, 26, { color: COL.gray, align: 'left' }); txt('修正 p 值', X0 + 700, Y0, 26, { color: COL.gray, align: 'left' }); inkLine(X0 - 20, Y0 + 24, X0 + 1000, Y0 + 24, { w: 3 }); });
    P.forEach(([lab, d, p, sig], i) => { const k = prog(lt, .6 + i * .3, .4), y = Y0 + 80 + i * 70; appear(k, () => { txt(lab, X0, y, 32, { color: sig ? COL.red : COL.black, align: 'left' }); txt((d > 0 ? '+' : '') + d.toFixed(3), X0 + 360, y, 30, { color: sig ? COL.red : COL.gray, align: 'left' }); txt(p === 1 ? '1' : p < .0001 ? '< 0.0001' : p.toFixed(4), X0 + 700, y, 30, { color: sig ? COL.red : COL.gray, align: 'left' }); }); });
    noteBox(1560, 380, 560, 150, [['5 對顯著', 36, COL.red], ['只有 B 與 D 分不出來', 28, COL.gray]], '#fff8e2', prog(lt, 2.7, .6));
    noteBox(1560, 640, 560, 150, [['C 增重最多（1.45 kg）', 30, COL.pink], ['A 最少（1.21 kg）', 30, COL.blue]], COL.white, prog(lt, 5.3, .6));
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('多組比較', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['常態、變異數相同 → ANOVA', 34, COL.blue], ['否則 → Kruskal–Wallis', 30, COL.green]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['整體顯著 → Bonferroni 事後', 34, COL.red], ['每組至少 5 人', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('先整體，再兩兩', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 8], [s2, 9], [s3, 11], [s4, 9], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 5 章 EP3　Kruskal–Wallis 與作業', scenes,
    sources: ['資料來源', 'Kruskal & Wallis (1952) JASA 47:583–621', '課堂 survival.csv（K-W H = 14.95）；作業 26 位選手增重（講義 p.24–25；課程網站 SPS）', '作業重算：F = 25.4、H = 18.6、Bonferroni 6 對', '林老師講義〈第五章 平均數檢定：多組樣本〉'] };
})();
EPISODES['c5e3'] = C5E3;

// ============ 第 6 章 EP1：卡方獨立性檢定 ============
function table2x2(x, y, cw, rh, rows, cols, cells, k, opts = {}) { // cells: [[text,color]...] row-major incl. totals
  appear(k, () => {
    txt('', x, y, 1);
    cols.forEach((c, j) => txt(c, x + cw * (j + 1) + cw / 2, y - 20, 28, { color: COL.gray }));
    rows.forEach((r, i) => txt(r, x + cw / 2, y + rh * i + rh / 2 + 10, 28, { color: COL.gray }));
    inkLine(x, y + 10, x + cw * (cols.length + 1), y + 10, { w: 3.5 }); inkLine(x + cw, y - 50, x + cw, y + rh * rows.length + 10, { w: 3.5 });
    cells.forEach((row, i) => row.forEach((c, j) => { const [t, col, sub] = Array.isArray(c) ? c : [c, COL.black]; txt(String(t), x + cw * (j + 1) + cw / 2, y + rh * i + rh / 2 + (sub ? -4 : 10), opts.size || 34, { color: col || COL.black }); if (sub) txt(sub, x + cw * (j + 1) + cw / 2, y + rh * i + rh / 2 + 34, 22, { color: COL.gray }); }));
  });
}
const C6E1 = (() => {
  const s1 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 140, 760);
    kpearson(420, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('1900・倫敦：卡爾・皮爾森的卡方檢定', 1200, 130, 50, { p: prog(lt, .2, .9), color: COL.black });
    noteBox(1200, 330, 900, 130, [['觀測次數 O　vs　期望次數 E', 36, COL.black], ['χ² = Σ (O − E)² ÷ E', 40, COL.blue]], '#fff8e2', prog(lt, .8, .6));
    noteBox(1200, 560, 900, 110, [['差得愈多，χ² 愈大，愈不像「無關」', 32, COL.red]], COL.white, prog(lt, 3.1, .6));
    txt('適用於兩個「類別」變數：有／無、是／否、A／B／C', 1200, 760, 30, { color: COL.gray, p: prog(lt, 4.2, .5) });
  } };
  const s2 = { beats: [0, 2.8], draw(lt) {
    txt('講義案例：血清鉀濃度低，日後較容易得糖尿病？', 960, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    const k = prog(lt, .5, 1.2);
    for (let i = 0; i < 60; i++) { const kk = clamp(k * 60 - i); if (kk > 0) mini(220 + (i % 15) * 60, 300 + Math.floor(i / 15) * 80, .45, i % 8 === 0 ? COL.pink : COL.blueL, 'dots'); }
    txt('12,209 位受試者，追蹤 9 年，1,475 人診斷出糖尿病', 660, 680, 32, { color: COL.black, p: prog(lt, 1.4, .5) });
    const G = [['< 4.0', 1.64], ['4.0–4.5', 1.64], ['4.5–5.0', 1.39], ['5.0–5.5', 1.0]];
    const base = 700, x0 = 1260;
    axis(1220, 1800, base, { p: prog(lt, 2.9, .4) });
    G.forEach(([lab, r], i) => { const h = r * 180 * easeOut(prog(lt, 3.0 + i * .2, .5)), x = x0 + i * 130 + 50; bar(x, base, 80, h, i === 3 ? COL.greenL : COL.pinkL, { pattern: 'hatch', patColor: i === 3 ? COL.green : COL.pink, sp: 14 }); txt(lab, x, base + 32, 22, { p: prog(lt, 2.9, .4) }); if (h > 5) txt(r.toFixed(2) + ' 倍', x, base - h - 20, 24, { color: COL.black, p: prog(lt, 3.4 + i * .2, .3) }); });
    txt('血清鉀 (mEq/L)：糖尿病罹患率相對第四組', 1510, 790, 24, { color: COL.gray, p: prog(lt, 3.0, .4) });
    noteBox(1510, 300, 540, 110, [['兩個類別變數：', 28, COL.gray], ['鉀濃度組別 × 是否得病', 30, COL.blue]], '#fff8e2', prog(lt, 4.6, .6));
  } };
  const s3 = { beats: [0, 2.6, 5.2, 7.8], draw(lt) {
    txt('講義例：職級 × 喜歡新式刷卡系統？', 960, 120, 46, { p: prog(lt, .2, .8), color: COL.black });
    table2x2(240, 230, 200, 90, ['主管', '非主管', '欄總合'], ['喜歡新制', '喜歡舊制', '列總合'], [[55, 45, [100, COL.gray]], [70, 30, [100, COL.gray]], [[125, COL.gray], [75, COL.gray], [200, COL.gray]]], prog(lt, .5, .6));
    txt('觀測值 O', 640, 560, 28, { color: COL.gray, p: prog(lt, .5, .6) });
    const k2 = prog(lt, 2.7, .6);
    table2x2(1120, 230, 200, 90, ['主管', '非主管', '欄總合'], ['喜歡新制', '喜歡舊制', '列總合'], [[[62.5, COL.blue], [37.5, COL.blue], [100, COL.gray]], [[62.5, COL.blue], [37.5, COL.blue], [100, COL.gray]], [[125, COL.gray], [75, COL.gray], [200, COL.gray]]], k2);
    txt('期望值 E = 列總合 × 欄總合 ÷ N', 1520, 560, 28, { color: COL.blue, p: k2 });
    txt('若職級與喜好無關，兩列的比例應該一樣：125/200 = 62.5%', 960, 640, 30, { color: COL.gray, p: prog(lt, 3.4, .5) });
    noteBox(960, 720, 1200, 90, [['χ² = (55−62.5)²/62.5 + (45−37.5)²/37.5 + (70−62.5)²/62.5 + (30−37.5)²/37.5 = 4.8', 28, COL.red]], '#fff8e2', prog(lt, 5.3, .7));
    noteBox(960, 830, 1200, 80, [['自由度 (2−1)(2−1) = 1，p = 0.028 < 0.05 → 職級與喜好有關（葉氏校正 4.18，p = 0.041）', 26, COL.black]], COL.white, prog(lt, 7.9, .7));
  } };
  const s4 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('課堂資料 PPHN：胎齡 < 34 週，和新生兒死亡有關嗎？（表 6-1、6-2）', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    noteBox(960, 220, 1100, 80, [['H0：死亡與胎齡 < 34 週無關　　Ha：有關', 34, COL.blue]], '#fff8e2', prog(lt, .4, .6));
    table2x2(420, 350, 200, 110, ['存活', '死亡', '合計'], ['< 34 週', '≥ 34 週', '合計'], [[[26, COL.black, '列 23.2%'], [86, COL.black, '列 76.8%'], [112, COL.gray]], [[6, COL.black, '列 31.6%'], [13, COL.black, '列 68.4%'], [19, COL.gray]], [[32, COL.gray], [99, COL.gray], [131, COL.gray]]], prog(lt, .8, .6));
    const k = prog(lt, 2.7, .6);
    if (k > 0) { txt('死亡組早產比例 31.6%，存活組 23.2%：看起來有差', 1560, 400, 26, { color: COL.gray, p: k }); txt('但 19 位死亡裡只差 2 個人…', 1560, 450, 26, { color: COL.gray, p: prog(lt, 3.6, .5) }); }
    noteBox(1560, 600, 620, 130, [['χ²（葉氏校正）= 0.246，自由度 1', 28, COL.red], ['p = 0.62 > 0.05', 36, COL.red]], COL.white, prog(lt, 5.5, .6));
    txt('無法拒絕 H0：沒有證據顯示死亡與早產有關', 960, 850, 34, { color: COL.black, p: prog(lt, 6.4, .6) });
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('卡方檢定', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['兩個類別變數 → 列聯表', 36, COL.blue], ['期望值 = 列總合 × 欄總合 ÷ N', 26, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['χ² = Σ(O − E)² / E', 38, COL.red], ['自由度 (列−1)(欄−1)', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('看的是「觀測離期望多遠」', 1400, 150, 42, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 7], [s2, 8], [s3, 11], [s4, 9], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 6 章 EP1　卡方獨立性檢定', scenes,
    sources: ['資料來源', 'Pearson (1900) Phil. Mag.；Wikipedia: Chi-squared test', '講義：血清鉀研究（康活健康知識網 2011）、刷卡系統例、PPHN 表 6-1/6-2（n = 131）', '課程網站 CH06 SPS 資料重算：χ² 4.8 / 0.246', '林老師講義〈第六章 兩個類別變數之檢定〉'] };
})();
EPISODES['c6e1'] = C6E1;

// ============ 第 6 章 EP2：小樣本：葉氏校正與費雪精確檢定 ============
const C6E2 = (() => {
  const s1 = { beats: [0, 3.0], draw(lt) {
    ground(lt);
    fisher(1540, GY, .9, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile' });
    txt('1934・葉慈的校正　／　1935・費雪的精確檢定', 960, 130, 48, { p: prog(lt, .2, .9), color: COL.black });
    noteBox(640, 330, 800, 130, [['樣本小、期望次數 < 5 時', 32, COL.gray], ['卡方的近似會「太容易顯著」', 34, COL.red]], '#fff8e2', prog(lt, .8, .6));
    noteBox(640, 540, 800, 130, [['葉氏：|O − E| 先減 0.5 再平方', 32, COL.blue], ['費雪：直接算出所有排法的機率', 32, COL.green]], COL.white, prog(lt, 3.1, .6));
    txt('費雪的精確檢定，就是從「女士品茶」來的', 960, 800, 32, { color: COL.gray, p: prog(lt, 4.6, .5) });
  } };
  const s2 = { beats: [0, 2.8, 5.6], draw(lt) {
    txt('講義例：52 張牌抽 6 張，抽到 2 張紅心', 960, 120, 48, { p: prog(lt, .2, .8), color: COL.black });
    for (let i = 0; i < 6; i++) { const k = prog(lt, .5 + i * .15, .4); appear(k, () => { shape(roundRectPts(300 + i * 130, 220, 100, 140, 12), { fill: COL.white, w: 3.5 }); txt(i < 2 ? '♥' : '♠', 350 + i * 130, 305, 56, { color: i < 2 ? COL.red : COL.black }); }); }
    table2x2(1140, 260, 200, 90, ['抽到', '沒抽到', ''], ['紅心', '非紅心', ''], [[2, 4, [6, COL.gray]], [11, 35, [46, COL.gray]], [[13, COL.gray], [39, COL.gray], [52, COL.gray]]], prog(lt, 1.6, .6));
    noteBox(960, 560, 1100, 100, [['期望值：6 × 13 ÷ 52 = 1.5 張 → 小於 5，卡方不適用', 32, COL.red]], '#fff8e2', prog(lt, 2.9, .6));
    noteBox(960, 720, 1200, 110, [['費雪：用超幾何分布算「恰好 2 張」的機率', 30, COL.green], ['C(13,2) × C(39,4) ÷ C(52,6) = 78 × 82,251 ÷ 20,358,520 = 0.315', 28, COL.black]], COL.white, prog(lt, 5.7, .7));
    txt('把「同樣或更極端」的排法機率加總，就是精確 p 值', 960, 830, 28, { color: COL.gray, p: prog(lt, 7.2, .5) });
  } };
  const s3 = { beats: [0, 2.6, 5.2, 7.8], draw(lt) {
    txt('作業：慢性疲勞症候群，A 藥物 vs 安慰劑，六週後症狀是否減輕', 960, 120, 42, { p: prog(lt, .2, .9), color: COL.black });
    table2x2(300, 250, 220, 100, ['A 藥物', '安慰劑', '總計'], ['減輕', '未減輕', '總計'], [[[12, COL.green, '80.0%'], [3, COL.black, '20.0%'], [15, COL.gray]], [[3, COL.black, '17.6%'], [14, COL.red, '82.4%'], [17, COL.gray]], [[15, COL.gray], [17, COL.gray], [32, COL.gray]]], prog(lt, .5, .6));
    noteBox(1500, 260, 680, 110, [['H0：藥物與症狀減輕無關', 30, COL.black], ['Ha：有關（藥物有效）', 30, COL.pink]], '#fff8e2', prog(lt, 1.4, .5));
    noteBox(1500, 440, 680, 130, [['期望次數：7.0、8.0、8.0、9.0', 28, COL.gray], ['都 ≥ 5，卡方可用', 30, COL.blue]], COL.white, prog(lt, 2.7, .6));
    noteBox(1500, 620, 680, 130, [['χ² = 12.44，p = 0.0004', 30, COL.red], ['葉氏校正 10.06，p = 0.0015', 26, COL.gray]], COL.white, prog(lt, 5.3, .6));
    noteBox(1500, 800, 680, 110, [['費雪精確檢定（雙尾）', 26, COL.gray], ['p = 0.0010 → 藥物有效', 32, COL.green]], '#fff8e2', prog(lt, 7.9, .6));
    txt('有效率 80% vs 17.6%：差距大，樣本雖小也顯著', 760, 740, 30, { color: COL.black, p: prog(lt, 4.0, .5) });
  } };
  const s4 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 1500, 1800);
    mom(1700, GY, .8, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('卡方檢定的適用條件', 760, 140, 52, { p: prog(lt, .2, .8), color: COL.black });
    const Q = [[.5, '觀測值彼此獨立（一人一格）', true], [1.3, '類別互斥、涵蓋所有情形', true], [2.7, '每格期望次數 ≥ 5', true], [3.5, '資料要常態分布', false]];
    Q.forEach(([at, q, ok], i) => { const k = prog(lt, at, .5), y = 280 + i * 140; appear(k, () => { shape(rectPts(200, y - 50, 900, 100), { fill: COL.white, smooth: false, w: 3.5 }); txt(q, 650, y + 10, 32, { color: COL.black }); }); const ka = prog(lt, at + .4, .4); if (ka > 0) (ok ? check : cross)(1160, y, 1, ka); });
    txt('期望次數太小 → 改用費雪精確檢定', 650, 835, 34, { color: COL.green, p: prog(lt, 4.2, .6) });
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('小樣本', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(440, 680, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['先看期望次數', 38, COL.blue], ['≥ 5 → 卡方（2×2 可加葉氏校正）', 26, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['< 5 → 費雪精確檢定', 38, COL.green], ['超幾何分布，直接算機率', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('作業結論：A 藥物有效', 1400, 150, 42, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 7], [s2, 10], [s3, 11], [s4, 7], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 6 章 EP2　小樣本：葉氏校正與費雪精確檢定', scenes,
    sources: ['資料來源', 'Yates (1934) JRSS Suppl.；Hitchcock (2009) Yates and contingency tables: 75 years later', 'Fisher (1935) The Design of Experiments', '講義紅心例（p.13）；作業 CFS 資料（p.15；課程網站 CH06_homework_CFS_source.sps）重算', '林老師講義〈第六章 兩個類別變數之檢定〉'] };
})();
EPISODES['c6e2'] = C6E2;

// ============ 第 6 章 EP3：大樣本與配對：疫苗資料與 McNemar ============
const C6E3 = (() => {
  const VAX = [['無接種', 41, 1504669, 27.2], ['一劑', 19, 1152401, 16.5], ['兩劑', 39, 6298333, 6.2], ['三劑', 59, 12031990, 4.9]];
  const s1 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('講義資料：2022 年台灣，接種劑次 × 中重症（台大醫師整理）', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    const X0 = 220, Y0 = 220;
    appear(prog(lt, .4, .5), () => { ['接種狀態', '中重症', '總人數', '每百萬中重症'].forEach((h, j) => txt(h, X0 + [0, 300, 600, 980][j] + 100, Y0, 28, { color: COL.gray, align: 'left' })); inkLine(X0, Y0 + 28, X0 + 1400, Y0 + 28, { w: 3.5 }); });
    VAX.forEach(([lab, s, n, r], i) => { const k = prog(lt, .7 + i * .3, .5), y = Y0 + 90 + i * 80; appear(k, () => { txt(lab, X0 + 100, y, 32, { color: COL.black, align: 'left' }); txt(String(s), X0 + 400, y, 32, { color: COL.red, align: 'left' }); txt(n.toLocaleString(), X0 + 700, y, 32, { color: COL.black, align: 'left' }); }); const kr = prog(lt, 2.7 + i * .25, .4); if (kr > 0) { bar(X0 + 1080 + r * 7, y + 2, r * 14, 44, i === 0 ? COL.pinkL : COL.blueL, { pattern: 'hatch', patColor: i === 0 ? COL.pink : COL.blue, sp: 12 }); txt(r.toFixed(1), X0 + 1100 + r * 14, y + 10, 28, { color: i === 0 ? COL.red : COL.blue, align: 'left' }); } });
    noteBox(960, 640, 1100, 90, [['未接種 27.2 vs 三劑 4.9（每百萬）：差 5.5 倍', 34, COL.red]], '#fff8e2', prog(lt, 4.2, .6));
    noteBox(960, 790, 1100, 90, [['4×2 列聯表 χ² = 102.5，自由度 3，p < 0.001', 32, COL.blue]], COL.white, prog(lt, 5.5, .6));
  } };
  const s2 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('合併成 2×2：未接種 vs 有接種', 960, 120, 48, { p: prog(lt, .2, .8), color: COL.black });
    table2x2(300, 260, 240, 110, ['無接種', '有接種', ''], ['中重症', '輕症／無症狀', '總人數'], [[[41, COL.red], '1,504,628', ['1,504,669', COL.gray]], [[117, COL.red], '19,482,607', ['19,482,724', COL.gray]], [['158', COL.gray], ['20,987,235', COL.gray], ['20,987,393', COL.gray]]], prog(lt, .5, .6), { size: 30 });
    noteBox(1600, 330, 560, 130, [['每百萬：27.2 vs 6.0', 32, COL.red], ['相對風險約 4.5 倍', 30, COL.black]], '#fff8e2', prog(lt, 2.7, .6));
    noteBox(1600, 540, 560, 130, [['χ² = 83.7，自由度 1', 30, COL.blue], ['p < 0.001', 36, COL.blue]], COL.white, prog(lt, 3.6, .6));
    noteBox(960, 800, 1300, 100, [['樣本兩千萬人：任何小差異都會「顯著」，所以要同時報告效果量（倍數）', 30, COL.black]], '#fff8e2', prog(lt, 5.3, .7));
  } };
  const s3 = { beats: [0, 2.8, 5.6], draw(lt) {
    txt('同一批人前後比：McNemar 檢定（1947）', 960, 120, 48, { p: prog(lt, .2, .8), color: COL.black });
    ground(lt, 140, 460);
    kid(300, GY, .9, { bob: idle(RLT) * .4, mouth: 'smile' });
    txt('訓練前 → 訓練後', 300, 300, 30, { color: COL.gray, p: prog(lt, .4, .5) });
    const k = prog(lt, .6, .6);
    table2x2(640, 280, 240, 110, ['前：達標', '前：未達標', ''], ['後：達標', '後：未達標', ''], [[['a', COL.gray], ['b', COL.red]], [['c', COL.blue], ['d', COL.gray]]], k);
    noteBox(1560, 330, 600, 130, [['配對資料不是獨立的', 30, COL.red], ['不能用一般卡方', 30, COL.red]], '#fff8e2', prog(lt, 2.9, .6));
    noteBox(1560, 560, 600, 150, [['只看「改變」的兩格 b、c', 30, COL.black], ['χ² = (b − c)² ÷ (b + c)', 34, COL.blue]], COL.white, prog(lt, 5.7, .6));
    txt('a、d 沒變化，對「訓練有沒有效」沒有資訊', 960, 820, 30, { color: COL.gray, p: prog(lt, 6.8, .5) });
  } };
  const s4 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('類別變數', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['獨立樣本 → 卡方／費雪', 36, COL.blue], ['看期望次數選方法', 26, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['配對樣本 → McNemar', 36, COL.green], ['只看改變的格子', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('顯著之外，還要看倍數', 1400, 150, 42, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 10], [s2, 9], [s3, 9], [s4, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 6 章 EP3　大樣本與配對：疫苗資料與 McNemar', scenes,
    sources: ['資料來源', '講義 p.17 疫苗資料（Yahoo 新聞，台大醫師整理，2022）；課程網站 CH06_class_vaccine_source.sps', 'McNemar (1947) Psychometrika 12:153–157', '重算：4×2 χ² = 102.5；2×2 χ² = 83.7', '林老師講義〈第六章 兩個類別變數之檢定〉'] };
})();
EPISODES['c6e3'] = C6E3;

// 第 7 章散佈圖子樣本（各 300 筆，CVD_All_spss.csv；r0 為模擬資料）
const SC7 = {"age_sbp":[[65.0,147.0],[29.0,146.0],[46.0,154.0],[47.0,179.0],[44.0,103.0],[38.0,124.0],[60.0,120.0],[46.0,99.0],[36.0,147.0],[43.0,102.0],[57.0,166.5],[34.0,122.5],[27.0,102.0],[58.0,149.0],[49.0,120.0],[50.0,111.0],[49.0,120.0],[57.0,97.5],[32.0,132.5],[43.0,137.0],[40.0,121.0],[66.0,104.0],[49.0,123.0],[40.0,111.5],[72.0,129.5],[75.0,142.5],[33.0,86.5],[40.0,126.5],[51.0,133.5],[59.0,134.0],[36.0,111.0],[72.0,136.0],[46.0,166.0],[39.0,130.0],[39.0,128.0],[49.0,149.0],[35.0,97.0],[22.0,105.0],[27.0,99.0],[38.0,101.0],[63.0,134.0],[37.0,94.0],[24.0,120.0],[41.0,146.0],[54.0,125.0],[64.0,124.0],[37.0,126.0],[56.0,117.0],[41.0,126.0],[57.0,130.0],[42.0,103.5],[51.0,129.0],[40.0,100.0],[44.0,150.0],[61.0,145.5],[47.0,177.0],[44.0,138.0],[42.0,108.0],[25.0,115.0],[63.0,157.5],[45.0,130.0],[33.0,126.5],[22.0,87.5],[34.0,144.0],[52.0,120.0],[40.0,103.5],[48.0,134.0],[74.0,168.0],[42.0,117.0],[61.0,179.0],[51.0,130.0],[43.0,167.0],[42.0,131.0],[33.0,114.0],[40.0,100.5],[31.0,106.5],[25.0,120.0],[46.0,131.0],[42.0,133.0],[26.0,141.0],[33.0,86.0],[70.0,172.0],[58.0,140.0],[39.0,104.0],[32.0,129.0],[29.0,144.0],[51.0,103.0],[31.0,143.0],[55.0,132.0],[51.0,130.0],[68.0,114.0],[53.0,100.0],[44.0,125.0],[61.0,131.0],[48.0,113.0],[64.0,127.0],[62.0,154.0],[53.0,136.0],[32.0,113.5],[37.0,143.5],[34.0,120.0],[55.0,111.0],[37.0,123.0],[62.0,149.0],[47.0,160.0],[47.0,127.0],[45.0,132.0],[71.0,118.0],[34.0,94.0],[50.0,127.0],[41.0,102.0],[58.0,113.5],[73.0,145.0],[71.0,130.0],[61.0,139.0],[76.0,154.5],[51.0,120.0],[45.0,115.5],[38.0,110.0],[34.0,146.0],[68.0,117.0],[50.0,147.0],[34.0,144.0],[59.0,132.0],[54.0,136.0],[72.0,165.0],[42.0,145.0],[33.0,122.0],[56.0,87.0],[34.0,133.0],[41.0,119.0],[34.0,124.0],[21.0,115.0],[75.0,123.0],[50.0,123.5],[40.0,100.5],[44.0,94.0],[47.0,111.5],[45.0,122.0],[31.0,119.0],[68.0,108.0],[30.0,89.0],[44.0,120.0],[48.0,148.0],[43.0,100.5],[35.0,88.5],[31.0,107.5],[70.0,112.0],[24.0,120.0],[73.0,156.5],[42.0,88.5],[52.0,93.5],[24.0,107.0],[61.0,126.5],[45.0,123.5],[65.0,156.5],[74.0,165.0],[61.0,119.5],[39.0,109.0],[74.0,137.5],[50.0,115.5],[37.0,112.0],[55.0,111.0],[60.0,145.0],[49.0,113.0],[34.0,116.0],[45.0,119.5],[50.0,127.0],[52.0,139.5],[45.0,124.0],[44.0,116.0],[60.0,134.0],[58.0,119.0],[43.0,95.0],[31.0,119.0],[46.0,180.0],[75.0,152.5],[34.0,99.0],[37.0,146.0],[45.0,114.5],[53.0,119.0],[26.0,118.5],[64.0,104.5],[54.0,141.0],[50.0,123.0],[63.0,128.0],[36.0,118.5],[30.0,89.0],[68.0,130.5],[42.0,127.0],[55.0,133.0],[29.0,122.0],[50.0,119.0],[24.0,130.0],[50.0,135.0],[49.0,118.0],[37.0,107.5],[40.0,103.5],[57.0,123.0],[43.0,116.0],[36.0,110.0],[62.0,125.5],[68.0,143.5],[50.0,109.5],[52.0,106.0],[27.0,114.0],[33.0,124.0],[33.0,112.0],[38.0,107.5],[69.0,159.0],[43.0,137.5],[74.0,163.5],[46.0,105.0],[53.0,138.0],[71.0,174.0],[36.0,117.5],[62.0,109.0],[50.0,95.0],[59.0,164.0],[70.0,106.0],[49.0,131.0],[57.0,113.5],[63.0,144.5],[67.0,110.0],[46.0,146.0],[44.0,113.0],[28.0,93.0],[78.0,181.0],[58.0,142.5],[47.0,110.0],[47.0,132.5],[31.0,104.0],[20.0,101.0],[62.0,169.0],[38.0,93.0],[64.0,111.0],[66.0,126.5],[50.0,117.5],[55.0,109.0],[46.0,145.5],[52.0,133.0],[51.0,122.0],[70.0,124.5],[43.0,109.0],[51.0,125.5],[31.0,114.0],[26.0,120.0],[25.0,129.0],[45.0,102.0],[38.0,102.0],[77.0,160.5],[25.0,87.0],[77.0,150.0],[41.0,124.5],[61.0,136.5],[74.0,138.0],[49.0,110.0],[51.0,99.0],[43.0,109.5],[59.0,127.0],[32.0,105.0],[62.0,189.0],[23.0,112.5],[52.0,123.0],[64.0,115.5],[36.0,85.5],[52.0,144.0],[61.0,173.0],[75.0,157.5],[57.0,127.5],[69.0,124.0],[48.0,160.0],[59.0,125.0],[43.0,111.0],[59.0,128.0],[55.0,181.0],[44.0,135.0],[67.0,131.0],[26.0,104.0],[58.0,149.5],[30.0,153.0],[56.0,130.0],[56.0,107.0],[26.0,113.0],[49.0,119.0],[52.0,150.0],[30.0,116.0],[78.0,164.0],[45.0,98.5],[63.0,150.0],[51.0,112.0],[50.0,114.0],[29.0,106.0],[62.0,145.0],[33.0,99.5],[64.0,140.0],[53.0,138.0],[63.0,121.0],[31.0,128.0],[32.0,99.0]],"dbp_sbp":[[66.5,100.0],[64.0,91.0],[69.5,109.0],[76.5,121.0],[75.0,152.5],[75.0,100.0],[70.0,104.0],[79.0,109.5],[70.0,106.0],[78.0,121.0],[85.0,127.0],[101.0,169.5],[71.5,93.0],[67.0,94.0],[79.0,134.0],[80.0,113.0],[95.5,162.5],[65.5,102.5],[77.5,145.5],[100.0,140.0],[87.5,130.5],[94.0,132.0],[74.5,113.5],[60.0,100.0],[66.5,122.5],[76.5,116.0],[78.0,113.5],[87.0,154.0],[73.0,107.0],[97.0,146.0],[63.5,97.5],[70.0,105.5],[64.0,110.0],[86.0,133.0],[69.0,109.5],[93.0,122.0],[83.0,110.5],[50.0,98.0],[74.5,128.0],[105.0,143.0],[80.0,108.0],[99.0,142.5],[80.0,115.0],[91.0,138.0],[78.0,128.0],[70.0,120.0],[77.0,99.0],[62.0,101.0],[92.5,130.0],[96.0,140.5],[71.0,111.0],[84.0,120.0],[76.0,107.0],[107.5,197.0],[74.0,136.0],[84.5,131.0],[71.5,110.5],[79.0,128.5],[75.0,145.5],[82.0,115.0],[70.0,104.5],[76.0,116.5],[71.0,101.0],[82.0,130.5],[75.0,120.0],[70.0,99.0],[69.0,113.0],[75.5,99.5],[65.5,140.0],[86.0,114.0],[66.0,133.0],[93.5,126.5],[69.0,133.0],[86.0,144.5],[68.5,104.0],[75.0,123.0],[68.0,96.0],[76.5,113.0],[84.0,114.0],[79.0,119.0],[74.0,120.0],[73.0,120.0],[72.0,108.0],[90.5,137.0],[62.0,116.5],[74.0,146.0],[122.5,184.5],[67.0,104.0],[76.0,138.0],[57.0,88.0],[75.0,136.0],[87.5,147.0],[78.5,115.0],[84.0,121.0],[87.0,140.0],[62.0,90.0],[94.0,137.0],[70.0,104.0],[89.0,125.0],[69.0,120.0],[67.5,100.0],[76.0,124.0],[108.5,156.0],[67.5,98.5],[69.0,112.0],[81.0,121.0],[93.0,174.5],[92.0,151.0],[70.0,106.0],[104.0,152.0],[86.5,152.0],[78.0,132.0],[72.0,115.0],[90.0,134.0],[81.0,124.0],[93.0,153.5],[67.0,125.0],[89.0,141.5],[75.5,112.5],[64.5,103.5],[68.5,89.5],[78.0,121.5],[90.5,160.5],[90.0,159.5],[86.0,137.0],[81.0,110.0],[81.0,164.0],[69.5,103.0],[82.0,107.0],[65.0,90.5],[76.0,132.5],[86.0,114.0],[73.0,153.0],[79.5,114.5],[81.0,134.0],[77.5,109.5],[78.5,131.0],[72.0,110.0],[71.0,112.0],[83.0,118.0],[77.0,124.0],[93.0,150.5],[85.5,142.0],[75.0,104.5],[84.0,135.0],[62.0,103.0],[81.0,103.0],[72.0,133.5],[73.0,128.0],[87.0,136.0],[72.0,112.0],[70.0,103.5],[72.0,139.0],[77.0,122.0],[79.5,130.0],[76.5,109.5],[63.0,115.0],[100.0,109.0],[79.5,129.0],[107.5,163.5],[100.5,162.5],[93.0,142.0],[66.0,103.5],[57.0,97.0],[72.5,113.5],[78.0,181.0],[96.0,148.0],[98.5,166.0],[81.0,121.0],[81.0,139.0],[87.0,151.0],[74.5,109.5],[74.0,125.0],[83.0,124.0],[69.5,103.5],[70.0,114.5],[72.0,129.0],[68.0,108.0],[74.0,119.5],[80.5,118.0],[93.0,141.0],[76.0,128.0],[68.0,92.0],[62.0,108.0],[64.0,127.0],[73.5,127.0],[76.0,110.0],[81.5,141.0],[73.0,127.0],[85.0,136.5],[73.0,124.0],[80.5,151.5],[79.5,114.5],[64.0,107.0],[69.0,145.5],[62.5,89.5],[67.5,105.0],[84.5,138.0],[92.0,141.0],[85.5,127.0],[66.0,103.0],[69.5,106.0],[79.5,136.0],[83.0,131.5],[59.5,87.0],[76.5,111.0],[79.0,132.0],[80.5,118.0],[85.0,121.5],[69.0,98.0],[84.0,116.5],[84.0,130.0],[87.0,116.0],[89.5,142.5],[79.0,128.0],[93.0,137.5],[67.0,117.0],[60.0,109.0],[72.5,105.0],[73.0,112.5],[76.5,110.5],[72.5,107.0],[90.5,130.0],[79.5,123.5],[63.0,105.0],[74.0,138.0],[78.0,116.0],[91.0,145.0],[71.0,140.5],[79.0,107.0],[68.0,127.0],[76.0,114.5],[94.0,153.0],[60.0,93.5],[76.0,110.0],[86.0,142.0],[61.0,88.5],[63.0,124.0],[89.0,132.0],[80.0,114.0],[74.5,106.0],[79.0,135.0],[80.0,117.0],[83.0,141.0],[67.0,104.0],[70.5,108.0],[89.0,121.0],[80.5,115.5],[60.0,111.0],[72.5,114.5],[100.0,130.0],[90.0,140.0],[82.0,119.5],[70.0,110.0],[78.0,113.0],[79.0,156.0],[77.5,122.5],[74.0,109.0],[70.5,98.0],[86.0,159.0],[74.5,103.0],[83.5,141.5],[66.5,109.0],[81.0,132.0],[104.5,192.0],[116.5,236.0],[95.0,147.0],[72.5,99.5],[75.0,101.0],[66.0,107.5],[93.0,133.0],[77.5,117.5],[75.0,127.5],[78.0,142.0],[96.5,132.5],[83.5,122.5],[61.0,109.0],[79.0,148.0],[85.0,145.5],[79.5,168.5],[71.0,128.0],[79.0,122.5],[70.0,93.0],[92.0,147.0],[92.0,128.0],[62.0,81.0],[88.0,112.0],[81.0,138.0],[70.0,112.0],[73.0,153.0],[70.0,119.0],[65.5,102.5],[64.5,102.0],[69.5,130.0],[74.5,101.5],[67.5,124.0],[82.5,123.0],[83.5,141.5],[71.0,118.0],[77.0,126.5]],"waist_sbp":[[67.0,99.0],[82.0,161.0],[69.0,99.0],[98.0,172.0],[80.5,110.0],[85.0,121.0],[79.0,100.5],[81.0,141.0],[64.0,99.5],[63.0,125.0],[67.0,86.5],[62.0,91.0],[80.0,105.0],[96.0,132.5],[89.0,120.0],[79.0,123.0],[78.0,147.0],[79.0,146.5],[67.0,115.5],[79.0,114.0],[71.0,138.0],[95.0,117.0],[75.0,128.0],[64.0,111.0],[81.0,109.0],[83.0,105.5],[87.0,112.5],[67.0,94.0],[69.0,96.0],[81.0,121.5],[91.0,142.0],[61.0,100.0],[88.0,103.0],[73.0,117.5],[76.0,142.5],[67.0,114.0],[65.0,124.0],[67.0,109.0],[80.0,123.0],[64.0,106.0],[68.0,115.5],[70.0,102.0],[77.0,128.0],[74.5,134.0],[85.0,127.5],[66.0,121.0],[82.0,122.0],[81.0,104.5],[88.0,107.0],[83.0,105.0],[102.0,150.0],[66.0,126.0],[69.0,104.0],[69.0,113.5],[80.0,116.0],[97.0,130.5],[72.0,141.0],[74.0,130.0],[82.0,125.0],[76.0,161.0],[68.0,110.0],[87.0,157.0],[87.5,136.0],[98.0,140.0],[71.5,148.0],[83.0,123.0],[93.0,130.0],[72.0,95.0],[82.0,143.0],[74.0,129.0],[60.0,90.0],[74.0,173.5],[71.0,111.5],[79.0,114.0],[87.0,129.0],[93.0,144.5],[77.0,125.5],[91.0,147.5],[71.0,128.0],[66.0,104.0],[82.0,118.0],[78.0,95.5],[84.0,145.0],[83.0,148.0],[69.0,92.0],[79.0,107.0],[70.0,161.0],[90.0,136.5],[79.0,102.0],[64.0,103.0],[99.0,151.0],[77.0,117.0],[87.0,123.0],[87.0,117.0],[80.0,120.0],[63.0,95.0],[82.0,123.0],[71.0,98.0],[71.0,118.0],[167.0,112.0],[68.0,112.0],[80.0,110.0],[107.0,113.0],[77.0,85.0],[94.0,176.5],[84.0,126.0],[86.0,111.0],[94.0,129.5],[90.0,90.0],[79.0,121.0],[179.0,129.0],[73.0,123.0],[70.0,110.5],[74.0,105.0],[69.0,86.5],[81.0,151.5],[86.0,138.0],[78.0,135.0],[72.0,97.0],[83.0,117.0],[78.0,100.5],[85.0,111.0],[86.0,123.0],[80.0,110.0],[102.0,143.0],[64.0,131.5],[78.0,115.0],[67.0,105.0],[59.0,135.0],[85.0,136.0],[64.0,108.0],[83.5,129.0],[73.0,128.0],[81.0,140.5],[67.0,100.0],[66.0,108.0],[71.0,123.5],[75.0,104.0],[71.0,97.5],[68.0,113.5],[60.0,96.0],[69.0,112.0],[86.5,136.0],[87.0,125.5],[76.0,127.0],[74.0,114.5],[97.0,143.5],[77.0,106.0],[71.0,104.5],[96.0,111.0],[84.0,126.0],[80.0,133.0],[62.0,91.5],[89.0,117.0],[86.5,129.5],[85.0,130.0],[93.0,142.0],[93.0,96.0],[84.0,135.0],[79.0,118.0],[69.0,102.0],[70.0,121.0],[76.0,121.5],[73.0,110.0],[80.0,169.0],[70.0,100.0],[83.0,131.5],[99.0,155.0],[84.0,160.0],[79.0,118.0],[65.0,117.0],[79.0,134.0],[85.0,189.0],[89.0,143.0],[77.0,106.0],[89.0,130.0],[79.0,151.0],[105.0,120.0],[71.0,131.0],[102.0,143.0],[66.0,140.5],[91.0,124.5],[73.0,92.0],[88.0,131.5],[87.0,132.5],[79.0,135.5],[90.0,128.0],[80.0,110.0],[74.0,122.0],[75.0,110.5],[88.0,132.0],[75.0,92.0],[69.0,91.0],[89.5,130.0],[84.0,156.0],[83.0,108.0],[58.0,112.0],[74.0,92.0],[78.0,123.0],[87.0,108.0],[64.0,87.0],[64.0,103.0],[76.0,99.0],[67.0,98.5],[85.0,123.0],[71.0,115.0],[78.0,129.5],[67.0,124.0],[82.5,126.0],[70.0,108.5],[77.0,103.0],[68.0,110.5],[68.0,104.5],[59.5,124.0],[85.0,109.0],[76.0,144.0],[88.0,105.0],[69.0,133.0],[85.0,182.5],[64.0,105.0],[81.0,130.0],[67.0,138.0],[86.0,105.0],[91.0,153.0],[90.0,114.0],[60.0,132.0],[89.0,162.0],[67.0,101.0],[93.0,85.0],[87.0,141.0],[82.0,125.0],[83.0,160.0],[81.0,112.0],[67.0,91.0],[72.0,100.0],[90.0,146.0],[70.0,94.0],[85.0,133.5],[64.0,148.0],[68.0,113.0],[81.0,150.0],[73.0,123.0],[75.0,86.5],[63.0,115.0],[71.0,128.5],[71.0,118.0],[71.0,147.0],[69.0,125.0],[69.5,130.0],[97.0,129.0],[80.0,153.0],[84.0,156.5],[78.0,102.0],[63.0,88.0],[95.0,153.5],[88.0,117.5],[69.0,107.5],[84.0,106.5],[90.0,161.0],[70.0,126.0],[61.0,137.0],[95.0,172.0],[73.0,109.0],[89.0,114.5],[105.0,180.5],[80.0,116.5],[81.0,101.0],[70.5,104.0],[110.0,148.5],[76.0,142.0],[76.0,108.0],[77.0,129.0],[70.0,91.5],[69.0,147.0],[89.0,120.0],[68.0,129.0],[65.0,108.0],[86.0,138.0],[61.5,143.0],[84.0,157.0],[87.0,109.0],[103.0,128.0],[69.0,124.0],[82.0,105.0],[67.0,165.0],[90.0,145.5],[76.0,107.5],[78.0,137.0],[70.0,127.0],[73.0,133.5],[69.0,136.5],[100.0,134.0],[73.0,111.0],[76.0,107.0],[73.0,146.0],[81.0,157.0],[77.0,110.0],[78.0,95.0],[72.0,104.0],[62.0,102.0]],"r0":[[0.37,-1.96],[0.37,1.17],[1.08,-0.13],[-0.31,-1.44],[0.74,-1.14],[0.24,-0.9],[0.62,1.7],[-1.92,0.69],[1.18,-1.34],[-1.61,1.85],[-1.18,1.34],[0.73,-1.06],[-0.43,-2.66],[1.73,0.96],[0.13,-0.6],[-1.06,-0.14],[0.13,-0.52],[-0.43,1.26],[1.53,1.48],[1.61,0.81],[0.72,-0.15],[-0.42,0.26],[0.07,0.62],[1.04,-1.57],[-0.81,1.24],[-0.81,-0.32],[0.84,0.26],[0.73,0.14],[-0.24,0.91],[-0.28,1.07]]};
// ============ 第 7 章 EP1：相關係數 ============
function scatter(pts, X, Y, k, col = COL.blueL, r = 6) { pts.forEach((p, i) => { const kk = clamp(k * pts.length * .5 - i * .5 + 1); if (kk > 0) shape(ellPts(X(p[0]), Y(p[1]), r, r, 0, 7, 8), { fill: col, w: 1.8, alpha: kk * .85 }); }); }
const C7E1 = (() => {
  const s1 = { beats: [0, 3.0, 6.0], draw(lt) {
    ground(lt, 140, 700);
    galton(400, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: 'smile', bob: idle(RLT) * .3 });
    txt('1886・高爾頓：父母身高 vs 子女身高', 1200, 130, 50, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 900 + (v - 60) / 18 * 700, Y = v => 760 - (v - 60) / 18 * 460, k = prog(lt, .6, 1.5);
    axis(880, 1640, 760, { p: prog(lt, .5, .4) }); arrow(900, 780, 900, 280, { w: 4, head: 16, p: prog(lt, .5, .4) });
    txt('父母平均身高', 1300, 800, 26, { color: COL.gray, p: prog(lt, .5, .4) }); txt('子女身高', 900, 260, 26, { color: COL.gray, p: prog(lt, .5, .4) });
    const pts = []; for (let i = 0; i < 120; i++) { const px = 62 + rnd(i, 1) * 14 + rnd(i, 2) * 2, py = 69 + (px - 69) * .65 + (rnd(i, 3) - .5) * 5 + (rnd(i, 4) - .5) * 3; pts.push([px, py]); }
    scatter(pts, X, Y, k);
    const kl = prog(lt, 3.1, .8);
    if (kl > 0) { ink([[X(62), Y(69 + (62 - 69) * .65)], [X(76), Y(69 + (76 - 69) * .65)]], { w: 5, color: COL.red, p: kl }); ink([[X(62), Y(62)], [X(76), Y(76)]], { w: 3, color: COL.gray, dash: true, p: kl }); txt('高個子的小孩，平均比父母矮一點：回歸到平庸', 1270, 230, 28, { color: COL.red, p: prog(lt, 3.8, .5) }); }
    noteBox(1200, 880, 900, 80, [['1888 年他提出「相關」；皮爾森把它寫成係數 r', 30, COL.blue]], '#fff8e2', prog(lt, 6.1, .6));
  } };
  const s2 = { beats: [0, 2.8, 5.6], draw(lt) {
    txt('講義：基隆社區篩檢資料，收縮壓 vs 年齡（隨機取 300 筆）', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 300 + (v - 15) / 70 * 1100, Y = v => 800 - (v - 60) / 160 * 560;
    axis(280, 1440, 800, { p: prog(lt, .4, .4) }); arrow(300, 820, 300, 200, { w: 4, head: 16, p: prog(lt, .4, .4) });
    [20, 40, 60, 80].forEach(v => txt(String(v), X(v), 835, 24, { p: prog(lt, .4, .4) })); [80, 120, 160, 200].forEach(v => txt(String(v), 262, Y(v) + 8, 22, { p: prog(lt, .4, .4), align: 'right' }));
    txt('年齡', 1440, 835, 24, { color: COL.gray, p: prog(lt, .4, .4) }); txt('收縮壓', 300, 180, 24, { color: COL.gray, p: prog(lt, .4, .4) });
    scatter(SC7.age_sbp, X, Y, prog(lt, .6, 2.0));
    const kl = prog(lt, 2.9, .8); if (kl > 0) ink([[X(20), Y(93.79 + .63 * 20)], [X(80), Y(93.79 + .63 * 80)]], { w: 4, color: COL.red, p: kl });
    noteBox(1660, 330, 480, 130, [['年齡愈大，收縮壓愈高', 28, COL.black], ['但散得很開', 28, COL.gray]], '#fff8e2', prog(lt, 3.2, .6));
    noteBox(1660, 560, 480, 150, [['皮爾生相關係數', 26, COL.gray], ['r = 0.42', 44, COL.red], ['n = 63,251，p < 0.001', 22, COL.gray]], COL.white, prog(lt, 5.7, .6));
  } };
  const s3 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('r 從 −1 到 +1：雲的形狀', 960, 120, 50, { p: prog(lt, .2, .8), color: COL.black });
    const R = [[-1, '−1'], [-0.6, '−0.6'], [0, '0'], [0.6, '0.6'], [1, '1']];
    R.forEach(([r, lab], i) => {
      const cx = 300 + i * 330, cy = 480, k = prog(lt, .5 + i * .4, .6); if (k <= 0) return;
      shape(rectPts(cx - 130, cy - 130, 260, 260), { fill: COL.white, smooth: false, w: 3, alpha: k });
      for (let j = 0; j < 60; j++) { const u = rnd(j + i * 100, 1) * 2 - 1, e = (rnd(j + i * 100, 2) * 2 - 1) * Math.sqrt(1 - r * r), v = r * u + e * .9; shape(ellPts(cx + u * 110, cy - v * 110, 5, 5, 0, 7, 6), { fill: COL.blue, w: 1.5, alpha: k * .8 }); }
      txt('r = ' + lab, cx, cy + 180, 34, { color: COL.black, p: k });
    });
    txt('負相關：一個增加另一個減少', 630, 720, 28, { color: COL.gray, p: prog(lt, 2.7, .5) }); txt('正相關：一起增加', 1290, 720, 28, { color: COL.gray, p: prog(lt, 2.7, .5) });
    noteBox(960, 850, 1100, 80, [['r 只量「線性」關係；|r| 愈接近 1，點愈貼近一條直線', 30, COL.blue]], '#fff8e2', prog(lt, 5.3, .6));
  } };
  const s4 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('講義表 7-2：年齡與各變數的皮爾生相關係數（n ≈ 59,000）', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    const rows = [['腰圍', .347], ['收縮壓', .420], ['舒張壓', .256], ['飯前血糖', .220], ['高密度脂蛋白', -.012], ['三酸甘油脂', .129]];
    const X0 = 640, Y0 = 260, X = v => 1000 + v * 900;
    appear(prog(lt, .4, .5), () => { inkLine(X(0), Y0 - 30, X(0), Y0 + 6 * 90, { w: 3, dash: true }); txt('0', X(0), Y0 - 50, 24, { color: COL.gray }); txt('0.5', X(.5), Y0 - 50, 24, { color: COL.gray }); });
    rows.forEach(([lab, r], i) => { const k = prog(lt, .6 + i * .3, .5), y = Y0 + i * 90 + 40; if (k <= 0) return; txt(lab, 500, y + 10, 30, { color: COL.black, p: k, align: 'right' }); const w = r * 900 * easeOut(k); shape(rectPts(Math.min(X(0), X(0) + w), y - 24, Math.abs(w), 48), { fill: r < 0 ? COL.pinkL : COL.blueL, smooth: false, w: 3, pattern: 'hatch', patColor: r < 0 ? COL.pink : COL.blue, sp: 12 }); txt(r.toFixed(3), X(0) + w + (r < 0 ? -50 : 50), y + 10, 28, { color: r < 0 ? COL.pink : COL.blue, p: k }); });
    noteBox(1560, 760, 620, 110, [['都隨年齡增加而增加，', 28, COL.black], ['只有高密度脂蛋白略減', 28, COL.pink]], '#fff8e2', prog(lt, 2.7, .6));
    txt('樣本六萬人：每個 r 都 p < 0.001，但 0.129 很弱、0.420 也只是中等', 960, 900, 28, { color: COL.gray, p: prog(lt, 5.3, .6) });
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('相關係數', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['先畫散佈圖', 38, COL.blue], ['再算 r：−1 到 +1', 28, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['顯著 ≠ 很強', 38, COL.red], ['|r| 的大小才是關係強度', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('相關不等於因果', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 10], [s2, 9], [s3, 9], [s4, 9], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 7 章 EP1　相關係數：兩個連續變數的關係', scenes,
    sources: ['資料來源', 'Galton (1886; 1888)；USU Statistics History: Correlation & Regression', '課堂資料 CVD_All_spss.csv：表 7-2 皮爾生係數重算（n ≈ 59,000）', '散佈圖為 300 筆隨機子樣本；高爾頓身高圖為示意', '林老師講義〈第七章 相關和廻歸分析（一）〉'] };
})();
EPISODES['c7e1'] = C7E1;

// ============ 第 7 章 EP2：斯皮爾曼等級相關與極端值 ============
const C7E2 = (() => {
  const s1 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 140, 700);
    spearman(400, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('1904・斯皮爾曼：把數值換成名次再算相關', 1200, 130, 50, { p: prog(lt, .2, .9), color: COL.black });
    const vals = [[98, 1], [117.5, 2], [134.5, 3], [135, 4], [138, 5], [153, 6], [191, 7]];
    vals.forEach(([v, r], i) => { const k = prog(lt, .6 + i * .2, .4); appear(k, () => { shape(roundRectPts(820 + i * 130, 360, 110, 70, 14), { fill: COL.white, w: 3 }); txt(String(v), 875 + i * 130, 405, 24, { color: COL.black }); }); const kr = prog(lt, 3.1 + i * .15, .4); if (kr > 0) rankTag(875 + i * 130, 500, r, kr); });
    txt('收縮壓 → 名次', 1265, 300, 28, { color: COL.gray, p: prog(lt, .5, .4) });
    noteBox(1265, 660, 900, 110, [['兩個變數都換成名次，再算皮爾生 r', 30, COL.blue], ['不要求常態、也能抓到非線性的單調關係', 28, COL.gray]], '#fff8e2', prog(lt, 4.4, .6));
  } };
  const s2 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('講義表 7-4：收縮壓與各變數，兩種相關係數比較', 960, 120, 46, { p: prog(lt, .2, .9), color: COL.black });
    const rows = [['年齡', .420, .421], ['腰圍', .426, .458], ['舒張壓', .743, .742], ['飯前血糖', .191, .255], ['高密度脂蛋白', -.163, -.210], ['三酸甘油脂', .219, .322]];
    const X0 = 520, Y0 = 220;
    appear(prog(lt, .4, .5), () => { txt('皮爾生', X0 + 520, Y0, 28, { color: COL.blue }); txt('斯皮爾曼', X0 + 820, Y0, 28, { color: COL.green }); inkLine(X0 - 60, Y0 + 26, X0 + 1000, Y0 + 26, { w: 3.5 }); });
    rows.forEach(([lab, p, sp], i) => { const k = prog(lt, .6 + i * .3, .5), y = Y0 + 90 + i * 85; appear(k, () => { txt(lab, X0 + 160, y, 30, { color: COL.black, align: 'right' }); txt(p.toFixed(3), X0 + 520, y, 32, { color: COL.blue }); }); const k2 = prog(lt, 2.7 + i * .2, .4); if (k2 > 0) txt(sp.toFixed(3), X0 + 820, y, 32, { color: COL.green, p: k2 }); });
    noteBox(1660, 420, 480, 150, [['方向、大小都接近', 28, COL.black], ['偏斜的變數（血糖、三酸甘油脂）', 24, COL.gray], ['斯皮爾曼略高', 28, COL.green]], '#fff8e2', prog(lt, 5.3, .6));
  } };
  const s3 = { beats: [0, 2.8, 5.6, 8.0], draw(lt) {
    txt('講義圖 7-3：一個極端值能做什麼？（模擬資料）', 960, 120, 46, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 760 + (v + 3) / 12 * 760, Y = v => 820 - (v + 3) / 12 * 620;
    axis(360, 1540, 820, { p: prog(lt, .4, .4) }); arrow(380, 840, 380, 200, { w: 4, head: 16, p: prog(lt, .4, .4) });
    scatter(SC7.r0, X, Y, prog(lt, .6, 1.2), COL.blue, 7);
    noteBox(1700, 330, 420, 170, [['30 個點', 26, COL.gray], ['皮爾生 −0.17', 30, COL.blue], ['斯皮爾曼 −0.17', 30, COL.green]], COL.white, prog(lt, 1.6, .5));
    const ko = prog(lt, 2.9, .6);
    if (ko > 0) { shape(ellPts(X(8), Y(8), 12, 12, 0, 7, 10), { fill: COL.red, w: 3, alpha: ko }); txt('加入 1 個極端點 (8, 8)', X(8) - 40, Y(8) + 50, 26, { color: COL.red, align: 'right', p: ko }); }
    const kl = prog(lt, 5.7, .8);
    if (kl > 0) { ink([[X(-3), Y(-3 * .6 - .2)], [X(8), Y(8 * .6 - .2)]], { w: 4, color: COL.red, dash: true, p: kl }); }
    noteBox(1700, 600, 420, 170, [['31 個點', 26, COL.gray], ['皮爾生 0.59', 32, COL.red], ['斯皮爾曼 −0.06', 30, COL.green]], '#fff8e2', prog(lt, 5.8, .6));
    noteBox(960, 900, 1100, 70, [['極端值能把「無關」變成「中度相關」；斯皮爾曼只看名次，幾乎不受影響', 26, COL.black]], COL.white, prog(lt, 8.1, .6));
  } };
  const s4 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('兩種相關', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['皮爾生：線性、常態', 36, COL.blue], ['用原始數值', 26, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['斯皮爾曼：單調、不怕極端值', 34, COL.green], ['用名次', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('先看圖，再選係數', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 9], [s2, 9], [s3, 11], [s4, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 7 章 EP2　斯皮爾曼等級相關與極端值', scenes,
    sources: ['資料來源', 'Spearman (1904) Am. J. Psychol. 15:72–101', '課堂資料 CVD_All_spss.csv：表 7-4 斯皮爾曼係數重算', '極端值示範為模擬資料（30 點 + 1 點），對應講義圖 7-3', '林老師講義〈第七章 相關和廻歸分析（一）〉'] };
})();
EPISODES['c7e2'] = C7E2;

// ============ 第 7 章 EP3：簡單線性迴歸與作業 ============
const C7E3 = (() => {
  const s1 = { beats: [0, 3.0], draw(lt) {
    ground(lt, 140, 700);
    legendre(400, GY, .9, { ra: [-.3, -.45], rhand: 'open', look: 1, bob: idle(RLT) * .3 });
    txt('1805・勒讓德：最小平方法', 1200, 130, 50, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 900 + v * 70, Y = v => 760 - v * 50, pts = [[1, 2.2], [2, 2.6], [3, 4.1], [4, 3.9], [5, 5.6], [6, 5.2], [7, 7.1], [8, 6.9], [9, 8.4]];
    axis(880, 1600, 760, { p: prog(lt, .4, .4) }); arrow(900, 780, 900, 260, { w: 4, head: 16, p: prog(lt, .4, .4) });
    const a = 1.2, b = .78, k = prog(lt, .6, .8);
    pts.forEach(([x, y], i) => { const kk = prog(lt, .6 + i * .1, .3); shape(ellPts(X(x), Y(y), 8, 8, 0, 7, 8), { fill: COL.blue, w: 2, alpha: kk }); });
    const kl = prog(lt, 1.8, .6); if (kl > 0) ink([[X(0.5), Y(a + b * .5)], [X(9.5), Y(a + b * 9.5)]], { w: 4, color: COL.red, p: kl });
    const kr = prog(lt, 3.1, .6); if (kr > 0) pts.forEach(([x, y]) => inkLine(X(x), Y(y), X(x), Y(a + b * x), { w: 3, color: COL.pink, p: kr }));
    noteBox(1250, 860, 900, 80, [['找一條線，讓所有「殘差」的平方和最小', 32, COL.red]], '#fff8e2', prog(lt, 3.6, .6));
    txt('殘差 = 觀測值 − 直線預測值', 1700, 300, 26, { color: COL.pink, p: prog(lt, 3.3, .5) });
  } };
  const s2 = { beats: [0, 2.6, 5.2, 7.6], draw(lt) {
    txt('講義表 7-5：用年齡預測收縮壓', 960, 120, 48, { p: prog(lt, .2, .8), color: COL.black });
    const X = v => 300 + (v - 15) / 70 * 1000, Y = v => 800 - (v - 60) / 160 * 560;
    axis(280, 1340, 800, { p: prog(lt, .4, .4) }); arrow(300, 820, 300, 200, { w: 4, head: 16, p: prog(lt, .4, .4) });
    [20, 40, 60, 80].forEach(v => txt(String(v), X(v), 835, 24, { p: prog(lt, .4, .4) })); [80, 120, 160, 200].forEach(v => txt(String(v), 262, Y(v) + 8, 22, { p: prog(lt, .4, .4), align: 'right' }));
    scatter(SC7.age_sbp, X, Y, prog(lt, .5, 1.5));
    const kl = prog(lt, 2.7, .8); if (kl > 0) ink([[X(20), Y(93.79 + .63 * 20)], [X(80), Y(93.79 + .63 * 80)]], { w: 5, color: COL.red, p: kl });
    noteBox(1660, 300, 500, 130, [['收縮壓 = 93.79 + 0.63 × 年齡', 26, COL.red], ['斜率 0.63：每大 1 歲，平均高 0.63 mmHg', 22, COL.gray]], '#fff8e2', kl);
    const kp = prog(lt, 5.3, .6);
    if (kp > 0) { ink([[X(50), Y(60)], [X(50), Y(125.29)], [X(15), Y(125.29)]], { w: 3, color: COL.green, dash: true, p: kp }); shape(ellPts(X(50), Y(125.29), 12, 12, 0, 7, 10), { fill: COL.green, w: 3, alpha: kp }); noteBox(1660, 520, 500, 110, [['年齡 50 歲', 26, COL.gray], ['→ 預測 125.29 mmHg', 30, COL.green]], COL.white, kp); }
    noteBox(1660, 730, 500, 130, [['斜率 p < 0.001，顯著', 26, COL.blue], ['但 R² 只有 0.1767', 30, COL.red]], COL.white, prog(lt, 7.7, .6));
  } };
  const s3 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('決定係數 R²：直線解釋了多少變異？', 960, 120, 48, { p: prog(lt, .2, .8), color: COL.black });
    const panels = [[SC7.age_sbp, 'age', '年齡 → 收縮壓', 0.1767, [15, 85], 93.79, .63, 560], [SC7.dbp_sbp, 'dbp', '舒張壓 → 收縮壓', 0.552, [40, 140], 22.58, 1.289, 1360]];
    panels.forEach(([pts, key, lab, r2, xr, a, b, cx], i) => {
      const k = prog(lt, .5 + i * 2.6, .6); if (k <= 0) return;
      const X = v => cx - 300 + (v - xr[0]) / (xr[1] - xr[0]) * 600, Y = v => 760 - (v - 60) / 160 * 480;
      axis(cx - 320, cx + 320, 760, { p: k }); arrow(cx - 300, 780, cx - 300, 260, { w: 3.5, head: 14, p: k });
      scatter(pts, X, Y, k, COL.blueL, 5); ink([[X(xr[0]), Y(a + b * xr[0])], [X(xr[1]), Y(a + b * xr[1])]], { w: 4, color: COL.red, p: k });
      txt(lab, cx, 230, 32, { color: COL.black, p: k });
      noteBox(cx, 850, 400, 70, [['R² = ' + r2, 36, i ? COL.green : COL.red]], '#fff8e2', prog(lt, 1.2 + i * 2.6, .5));
    });
    txt('R² = 0.18：點散得開，直線解釋不多　　R² = 0.55：點貼近直線', 960, 940, 26, { color: COL.gray, p: prog(lt, 5.3, .6) });
  } };
  const s4 = { beats: [0, 2.6, 5.2, 7.8], draw(lt) {
    txt('作業：沒有心血管疾病的成人（n = 56,612），腰圍 → 收縮壓', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 300 + (v - 50) / 80 * 1000, Y = v => 800 - (v - 60) / 160 * 560;
    axis(280, 1340, 800, { p: prog(lt, .4, .4) }); arrow(300, 820, 300, 200, { w: 4, head: 16, p: prog(lt, .4, .4) });
    [60, 80, 100, 120].forEach(v => txt(String(v), X(v), 835, 24, { p: prog(lt, .4, .4) })); [80, 120, 160, 200].forEach(v => txt(String(v), 262, Y(v) + 8, 22, { p: prog(lt, .4, .4), align: 'right' }));
    txt('腰圍 (cm)', 1340, 835, 24, { color: COL.gray, p: prog(lt, .4, .4) });
    scatter(SC7.waist_sbp, X, Y, prog(lt, .5, 1.5));
    noteBox(1660, 290, 500, 160, [['皮爾生 r = 0.428', 30, COL.blue], ['斯皮爾曼 ρ = 0.458', 30, COL.green], ['都 p < 0.001：顯著正相關', 22, COL.gray]], '#fff8e2', prog(lt, 2.7, .6));
    const kl = prog(lt, 5.3, .8); if (kl > 0) ink([[X(55), Y(58.51 + .819 * 55)], [X(125), Y(58.51 + .819 * 125)]], { w: 5, color: COL.red, p: kl });
    noteBox(1660, 500, 500, 130, [['收縮壓 = 58.51 + 0.819 × 腰圍', 26, COL.red], ['R² = 0.183（解釋 18.3%）', 26, COL.gray]], COL.white, kl);
    const kp = prog(lt, 7.9, .6);
    if (kp > 0) { ink([[X(100), Y(60)], [X(100), Y(140.4)], [X(50), Y(140.4)]], { w: 3, color: COL.green, dash: true, p: kp }); shape(ellPts(X(100), Y(140.4), 12, 12, 0, 7, 10), { fill: COL.green, w: 3, alpha: kp }); noteBox(1660, 740, 500, 160, [['腰圍 100 cm', 26, COL.gray], ['→ 平均 140.4 mmHg', 30, COL.green], ['是「平均」預測，個人會散開', 22, COL.gray]], '#fff8e2', kp); }
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('線性迴歸', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['y = a + b x', 40, COL.red], ['斜率 b：x 每多 1，y 平均多 b', 26, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['R²：解釋了多少變異', 36, COL.blue], ['顯著 ≠ 預測得準', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('預測的是「平均」', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 9], [s2, 11], [s3, 9], [s4, 11], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 7 章 EP3　簡單線性迴歸與作業', scenes,
    sources: ['資料來源', 'Legendre (1805) Nouvelles méthodes…；Leiden stathist 19th century', '課堂 CVD_All：表 7-5 收縮壓～年齡（R² 0.1767、50 歲 → 125.29）、收縮壓～舒張壓（R² 0.552）重算相符', '作業：無 CVD 者 n = 56,612，r 0.428、ρ 0.458、收縮壓 = 58.51 + 0.819 × 腰圍', '林老師講義〈第七章 相關和廻歸分析（一）〉'] };
})();
EPISODES['c7e3'] = C7E3;

// ============ 第 8 章 EP1：干擾變數：辛普森詭論與調整 ============
const C8E1 = (() => {
  const s1 = { beats: [0, 2.8, 5.6, 8.0], draw(lt) {
    txt('1951・辛普森詭論：講義的招生例', 960, 120, 50, { p: prog(lt, .2, .8), color: COL.black });
    const bars = (x, y, lab, m, f, k) => { appear(k, () => { txt(lab, x, y - 270, 30, { color: COL.black }); bar(x - 70, y, 100, m * 2.4, COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 12 }); bar(x + 70, y, 100, f * 2.4, COL.pinkL, { pattern: 'dots', patColor: COL.pink, sp: 10, r: 3 }); txt('男 ' + m + '%', x - 70, y + 34, 24, { color: COL.blue }); txt('女 ' + f + '%', x + 70, y + 34, 24, { color: COL.pink }); }); };
    bars(400, 620, '全校合計', 68.8, 56.5, prog(lt, .5, .7));
    const k2 = prog(lt, 2.9, .7); bars(960, 620, '法學院', 15.1, 33.6, k2); bars(1480, 620, '商學院', 80.1, 91.1, prog(lt, 3.4, .7));
    txt('男 209/304　女 143/253', 400, 700, 22, { color: COL.gray, p: prog(lt, 1.2, .5) }); txt('男 8/53　女 51/152', 960, 700, 22, { color: COL.gray, p: k2 }); txt('男 201/251　女 92/101', 1480, 700, 22, { color: COL.gray, p: prog(lt, 3.6, .5) });
    noteBox(960, 800, 1200, 90, [['分開看：兩個學院都是女生錄取率高；合併看：男生高', 32, COL.red]], '#fff8e2', prog(lt, 5.7, .6));
    txt('原因：女生多申請錄取率低的法學院 → 「學院」是干擾變數', 960, 900, 30, { color: COL.black, p: prog(lt, 8.1, .6) });
  } };
  const s2 = { beats: [0, 3.0, 6.0], draw(lt) {
    ground(lt, 140, 520);
    mom(330, GY, .85, { ra: [-.3, -.45], rhand: 'open', look: 1, mouth: lt > 3 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    txt('講義：賀爾蒙治療 vs 冠狀動脈心臟病', 1160, 130, 50, { p: prog(lt, .2, .8), color: COL.black });
    noteBox(1160, 330, 1000, 130, [['1990 年代觀察性研究（護士健康研究）：', 28, COL.gray], ['用賀爾蒙的人，冠心病少 35–60%', 34, COL.green]], '#fff8e2', prog(lt, .6, .6));
    noteBox(1160, 560, 1000, 130, [['2002 年 WHI 隨機試驗：', 28, COL.gray], ['賀爾蒙反而增加冠心病風險', 34, COL.red]], COL.white, prog(lt, 3.1, .6));
    noteBox(1160, 790, 1000, 110, [['用賀爾蒙的人原本就比較健康、年輕、教育高：「健康使用者」干擾', 28, COL.black]], '#fff8e2', prog(lt, 6.1, .6));
  } };
  const s3 = { beats: [0, 2.8, 5.6], draw(lt) {
    txt('課堂模型（CVD_All 重算，n = 61,167）：抽菸量對腰圍', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    const Y = v => 760 - (v - 70) * 30, X0 = 420;
    axis(360, 1500, 760, { p: prog(lt, .4, .4) }); arrow(380, 780, 380, 220, { w: 4, head: 16, p: prog(lt, .4, .4) });
    [70, 75, 80, 85].forEach(v => { inkLine(372, Y(v), 388, Y(v), { w: 3, p: prog(lt, .4, .4) }); txt(String(v), 340, Y(v) + 8, 22, { p: prog(lt, .4, .4) }); }); txt('腰圍 (cm)', 380, 200, 22, { color: COL.gray, p: prog(lt, .4, .4) });
    const G = [['抽 < 1 包', 76.79, COL.blueL, .5], ['抽 ≥ 1 包', 82.54, COL.pinkL, .8]];
    G.forEach(([lab, v, col, at], i) => { const k = prog(lt, at, .6), x = X0 + i * 220 + 100; bar(x, 760, 140, (v - 70) * 30 * easeOut(k), col, { pattern: 'hatch', patColor: i ? COL.pink : COL.blue, sp: 14 }); txt(lab, x, 795, 24, { p: k }); if (k > .9) txt(v.toFixed(1), x, Y(v) - 20, 24, { color: i ? COL.pink : COL.blue }); });
    noteBox(1000, 300, 420, 90, [['粗估：+5.75 cm', 34, COL.red]], '#fff8e2', prog(lt, 1.4, .5));
    const k2 = prog(lt, 2.9, .7);
    if (k2 > 0) {
      const G2 = [['< 50 歲', 74.35, 80.09], ['≥ 50 歲', 80.66, 86.40]];
      G2.forEach(([lab, a, b], i) => { const x = 1000 + i * 240; bar(x, 760, 80, (a - 70) * 30 * easeOut(k2), COL.blueL, { pattern: 'hatch', patColor: COL.blue, sp: 12 }); bar(x + 90, 760, 80, (b - 70) * 30 * easeOut(k2), COL.pinkL, { pattern: 'hatch', patColor: COL.pink, sp: 12 }); txt(lab, x + 45, 795, 24, { p: k2 }); });
      noteBox(1660, 420, 480, 150, [['加入年齡（≥ 50）調整', 26, COL.gray], ['抽菸 +5.74 cm', 32, COL.red], ['年齡 +6.31 cm', 26, COL.black]], COL.white, prog(lt, 3.6, .6));
    }
    noteBox(1660, 660, 480, 130, [['調整前 5.75 ≈ 調整後 5.74', 26, COL.black], ['年齡不是干擾變數', 30, COL.blue]], '#fff8e2', prog(lt, 5.7, .6));
    txt('（講義結論相同；講義表中的 0.235 為另一尺度之係數）', 960, 900, 22, { color: COL.gray, p: prog(lt, 6.6, .5) });
  } };
  const s4 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('什麼是干擾變數？', 960, 130, 56, { p: prog(lt, .2, .8), color: COL.black });
    const k = prog(lt, .5, .8);
    appear(k, () => { shape(roundRectPts(300, 480, 300, 100, 24), { fill: COL.blueL, w: 4 }); txt('暴露 X', 450, 540, 34, { color: COL.black }); shape(roundRectPts(1320, 480, 300, 100, 24), { fill: COL.pinkL, w: 4 }); txt('結果 Y', 1470, 540, 34, { color: COL.black }); arrow(620, 530, 1300, 530, { w: 5, head: 20 }); txt('想估的效應', 960, 500, 28, { color: COL.gray }); });
    const k2 = prog(lt, 2.7, .8);
    appear(k2, () => { shape(roundRectPts(810, 230, 300, 100, 24), { fill: COL.mustard, w: 4 }); txt('干擾 Z', 960, 290, 34, { color: COL.black }); arrow(880, 340, 520, 470, { w: 4, head: 16, color: COL.mustardD }); arrow(1040, 340, 1400, 470, { w: 4, head: 16, color: COL.mustardD }); });
    noteBox(960, 720, 1200, 130, [['Z 和 X 有關、也和 Y 有關，但不在 X → Y 的路上', 30, COL.black], ['調整 Z 之後估計值明顯改變，Z 才算干擾變數', 30, COL.red]], '#fff8e2', prog(lt, 5.3, .6));
    txt('流行病學裡，年齡和性別最常被當成干擾變數來調整', 960, 900, 28, { color: COL.gray, p: prog(lt, 6.4, .5) });
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('干擾變數', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['合併看 ≠ 分開看', 38, COL.red], ['辛普森詭論', 26, COL.gray]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['多變項迴歸：把 Z 放進模型', 34, COL.blue], ['調整後估計值', 26, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('比較調整前後', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 10], [s2, 9], [s3, 9], [s4, 9], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: '高等體育統計｜第 8 章 EP1　干擾變數：辛普森詭論與調整', scenes,
    sources: ['資料來源', 'Simpson (1951) JRSS B；Bickel et al. (1975) Science；講義招生例 p.5–6', 'Rossouw (2000)；WHI (2002) JAMA；Hernán et al. (2008)', '課堂模型以 CVD_All_spss.csv 重算（腰圍 ~ 抽菸量 ≥ 1 包，年齡 ≥ 50）', '林老師講義〈多變項迴歸分析〉'] };
})();
EPISODES['c8e1'] = C8E1;

// ============ 第 8 章 EP2：交互作用與分層分析 ============
const C8E2 = (() => {
  const s1 = { beats: [0, 2.8, 5.6], draw(lt) {
    txt('抽菸對腰圍的效果，會不會隨年齡層而不同？', 960, 130, 48, { p: prog(lt, .2, .8), color: COL.black });
    noteBox(960, 215, 1200, 80, [['腰圍 = β₀ + β₁ 抽菸 + β₂ 年齡 + β₃ (抽菸 × 年齡)', 32, COL.blue]], '#fff8e2', prog(lt, .5, .6));
    const Y = v => 760 - (v - 70) * 30;
    axis(500, 1420, 760, { p: prog(lt, 2.9, .4) });
    const k = prog(lt, 3.0, .8);
    if (k > 0) {
      const lines = [['< 50 歲', 74.07, 74.07 + 6.83, COL.blue], ['≥ 50 歲', 74.07 + 7.04, 74.07 + 7.04 + 6.83 - 2.81, COL.pink]];
      lines.forEach(([lab, a, b, col], i) => { ink([[700, Y(a)], [1220, Y(b)]], { w: 5, color: col, p: k }); shape(ellPts(700, Y(a), 10, 10, 0, 7, 8), { fill: col, w: 2, alpha: k }); shape(ellPts(1220, Y(b), 10, 10, 0, 7, 8), { fill: col, w: 2, alpha: k }); txt(lab, 1300, Y(b) + 8, 26, { color: col, align: 'left', p: k }); txt('+' + (b - a).toFixed(2), 960, Y((a + b) / 2) - 24 + (i ? -10 : 10), 24, { color: col, p: prog(lt, 3.6, .5) }); });
      txt('抽 < 1 包', 700, 795, 24, { p: k }); txt('抽 ≥ 1 包', 1220, 795, 24, { p: k });
    }
    noteBox(1660, 560, 480, 170, [['重算（n = 61,167）', 24, COL.gray], ['β₃ = −2.81，p < 0.001', 30, COL.red], ['年輕 +6.83，年長 +4.02', 26, COL.black]], COL.white, prog(lt, 5.7, .6));
    txt('兩條線不平行 → 抽菸與年齡有交互作用，年齡「修改」了抽菸的效應', 960, 900, 28, { color: COL.black, p: prog(lt, 6.8, .6) });
  } };
  const s2 = { beats: [0, 2.6, 5.4], draw(lt) {
    txt('三個以上因子的交互作用太複雜 → 分層分析', 960, 130, 48, { p: prog(lt, .2, .8), color: COL.black });
    const k = prog(lt, .5, .8);
    appear(k, () => { shape(roundRectPts(660, 230, 600, 110, 24), { fill: COL.white, w: 4 }); txt('全部資料 n = 61,167', 960, 297, 32, { color: COL.black }); arrow(820, 350, 560, 450, { w: 4, head: 16 }); arrow(1100, 350, 1360, 450, { w: 4, head: 16 }); });
    const P = [[560, '女性層 n = 38,758', '交互作用 p = 0.20', '不顯著', COL.green, 2.7], [1360, '男性層 n = 22,409', '交互作用 −1.08，p < 0.001', '顯著', COL.red, 5.5]];
    P.forEach(([x, t, r, c, col, at]) => { const kk = prog(lt, at, .7); appear(kk, () => { shape(roundRectPts(x - 300, 460, 600, 260, 24), { fill: '#fffdf6', w: 4 }); txt(t, x, 520, 32, { color: COL.black }); txt('腰圍 ~ 抽菸 × 年齡', x, 575, 24, { color: COL.gray }); txt(r, x, 630, 28, { color: col }); txt(c, x, 685, 34, { color: col }); }); });
    noteBox(960, 830, 1100, 90, [['各層分開跑模型，不必放複雜的交互作用項（講義：女無、男有）', 28, COL.black]], '#fff8e2', prog(lt, 6.6, .6));
  } };
  const s3 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 1500, 1800);
    dad(1700, GY, .75, { la: [P - .3, P - .2], lhand: 'open', look: -1, mouth: 'flat' });
    txt('分層的代價', 760, 140, 56, { p: prog(lt, .2, .8), color: COL.black });
    noteBox(760, 330, 1100, 150, [['好處：模型簡單，不用解釋三階交互作用', 32, COL.green]], '#fff8e2', prog(lt, .5, .6));
    noteBox(760, 560, 1100, 150, [['代價：每層人數變少，檢定力下降', 32, COL.red], ['某一層資料太少時，分層就不適合', 28, COL.gray]], COL.white, prog(lt, 2.7, .6));
    txt('男性層只剩 22,409 人，仍然夠大；小樣本就要小心', 760, 800, 28, { color: COL.gray, p: prog(lt, 4.0, .5) });
  } };
  const s4 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('交互作用', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(380, 740, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['干擾：調整後估計值變了', 34, COL.blue], ['交互作用：效應隨另一因子改變', 28, COL.red]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['乘積項 β₃ 顯著 → 有交互作用', 32, COL.black], ['太複雜 → 分層', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('一條線不夠，就畫兩條', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 10], [s2, 9], [s3, 7], [s4, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP2, dur: t, tag: '高等體育統計｜第 8 章 EP2　交互作用與分層分析', scenes,
    sources: ['資料來源', '課堂模型以 CVD_All_spss.csv 重算：腰圍 ~ 抽菸 × 年齡（≥ 50）；性別分層（女 38,758、男 22,409 有效）', '講義 p.19–26：交互作用、分層分析（女性無、男性有）', '林老師講義〈多變項迴歸分析〉'] };
})();
EPISODES['c8e2'] = C8E2;

// ============ 第 8 章 EP3：作業：壓差、年齡、性別與卜瓦松發生率 ============
const C8E3 = (() => {
  const s1 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('作業 1：壓差 = 收縮壓 − 舒張壓，年齡是壓差的風險因子嗎？', 960, 120, 44, { p: prog(lt, .2, .9), color: COL.black });
    const X = v => 300 + (v - 15) / 70 * 1000, Y = v => 800 - (v - 10) / 90 * 560;
    axis(280, 1340, 800, { p: prog(lt, .4, .4) }); arrow(300, 820, 300, 200, { w: 4, head: 16, p: prog(lt, .4, .4) });
    [20, 40, 60, 80].forEach(v => txt(String(v), X(v), 835, 24, { p: prog(lt, .4, .4) })); [20, 40, 60, 80].forEach(v => txt(String(v), 262, Y(v) + 8, 22, { p: prog(lt, .4, .4), align: 'right' }));
    txt('年齡', 1340, 835, 24, { color: COL.gray, p: prog(lt, .4, .4) }); txt('壓差 (mmHg)', 300, 180, 22, { color: COL.gray, p: prog(lt, .4, .4) });
    const pts = SC7.age_sbp.map(([a, s], i) => [a, s - (0.5 * s + 10 + (rnd(i, 7) - .5) * 10)]);
    scatter(pts, X, Y, prog(lt, .5, 1.5), COL.blueL, 5);
    const kl = prog(lt, 2.7, .8); if (kl > 0) ink([[X(20), Y(26.0 + .409 * 20)], [X(80), Y(26.0 + .409 * 80)]], { w: 5, color: COL.red, p: kl });
    noteBox(1660, 300, 500, 150, [['壓差 = 26.0 + 0.41 × 年齡', 28, COL.red], ['每大 1 歲 +0.41 mmHg', 24, COL.gray], ['p < 0.001，R² = 0.158', 24, COL.gray]], '#fff8e2', kl);
    noteBox(1660, 610, 500, 250, [['作業 2：加入性別', 26, COL.gray], ['年齡 0.41 → 0.40（幾乎不變）', 26, COL.black], ['性別不是干擾變數', 28, COL.blue], ['年齡×性別 −0.15，p < 0.001', 24, COL.red]], COL.white, prog(lt, 5.3, .6));
    txt('（散佈圖為示意子樣本；係數以全體 63,200 人重算）', 800, 900, 22, { color: COL.gray, p: prog(lt, 3.5, .5) });
  } };
  const s2 = { beats: [0, 2.8, 5.6], draw(lt) {
    txt('作業 3：卜瓦松模型估計 CVD 每年發生率', 960, 130, 50, { p: prog(lt, .2, .8), color: COL.black });
    const k = prog(lt, .5, 1.2);
    for (let i = 0; i < 40; i++) { const kk = clamp(k * 40 - i); if (kk > 0) mini(260 + (i % 10) * 70, 300 + Math.floor(i / 10) * 90, .5, i % 11 === 0 ? COL.pink : COL.blueL, 'dots'); }
    txt('每人追蹤 1–5 年，加總成「人年」', 575, 680, 28, { color: COL.gray, p: prog(lt, 1.6, .5) });
    noteBox(1400, 300, 760, 150, [['5,859 件 CVD', 34, COL.red], ['÷ 228,765 人年', 34, COL.black], ['= 每 1,000 人年 25.6 件', 32, COL.blue]], '#fff8e2', prog(lt, 2.9, .7));
    noteBox(1400, 560, 760, 150, [['卜瓦松迴歸：log(發生率) = β₀ + β₁ X', 28, COL.black], ['追蹤年數取 log 當 offset', 26, COL.gray], ['exp(β) = 發生率比 IRR', 28, COL.blue]], COL.white, prog(lt, 5.7, .7));
    txt('計數資料（事件數）不用線性迴歸，用卜瓦松', 960, 880, 30, { color: COL.black, p: prog(lt, 7.0, .5) });
  } };
  const s3 = { beats: [0, 2.6, 5.2, 7.8], draw(lt) {
    txt('作業 4：壓差是 CVD 的風險因子嗎？', 960, 130, 50, { p: prog(lt, .2, .8), color: COL.black });
    const rows = [['粗估：CVD ~ 壓差', '1.025 / mmHg', 'p < 0.001', COL.red, .5], ['調整年齡、性別', '1.003 / mmHg', 'p = 0.0002', COL.blue, 2.7], ['加入 壓差 × 性別', '交互作用 1.001', 'p = 0.43（無）', COL.gray, 5.3]];
    const X0 = 300, Y0 = 260;
    appear(prog(lt, .3, .4), () => { txt('模型', X0, Y0, 26, { color: COL.gray, align: 'left' }); txt('壓差 IRR', X0 + 700, Y0, 26, { color: COL.gray, align: 'left' }); txt('p 值', X0 + 1100, Y0, 26, { color: COL.gray, align: 'left' }); inkLine(X0 - 20, Y0 + 26, X0 + 1400, Y0 + 26, { w: 3 }); });
    rows.forEach(([m, irr, p, col, at], i) => { const k = prog(lt, at, .6), y = Y0 + 100 + i * 110; appear(k, () => { txt(m, X0, y, 32, { color: COL.black, align: 'left' }); txt(irr, X0 + 700, y, 32, { color: col, align: 'left' }); txt(p, X0 + 1100, y, 28, { color: col, align: 'left' }); }); });
    noteBox(960, 720, 1200, 110, [['調整後從 1.025 掉到 1.003：年齡是干擾變數（壓差隨年齡升高）', 30, COL.red]], '#fff8e2', prog(lt, 3.6, .6));
    noteBox(960, 870, 1200, 80, [['壓差仍顯著，但效應很小；壓差 × 性別沒有交互作用', 28, COL.black]], COL.white, prog(lt, 7.9, .6));
  } };
  const s4 = { beats: [0, 2.6, 5.2], draw(lt) {
    txt('作業 5：依性別分層', 960, 130, 52, { p: prog(lt, .2, .8), color: COL.black });
    const P = [[560, '女性', '39,639 人・3,523 件', '每 1,000 人年 24.3', '壓差 IRR 1.002，p = 0.06', COL.pink, .5], [1360, '男性', '23,561 人・2,336 件', '每 1,000 人年 28.0', '壓差 IRR 1.005，p < 0.001', COL.blue, 2.7]];
    P.forEach(([x, t, n, r, irr, col, at]) => { const k = prog(lt, at, .7); appear(k, () => { shape(roundRectPts(x - 320, 230, 640, 380, 24), { fill: '#fffdf6', w: 4 }); txt(t, x, 300, 40, { color: col }); txt(n, x, 370, 26, { color: COL.gray }); txt(r, x, 440, 30, { color: COL.black }); txt(irr, x, 530, 28, { color: col }); }); });
    noteBox(960, 760, 1200, 130, [['分層結論與第 4 題一致：男性壓差效應較明顯，但交互作用檢定不顯著', 28, COL.black], ['事件數、人年與模型樣本要對得上（n = 63,200）', 26, COL.gray]], '#fff8e2', prog(lt, 5.3, .6));
  } };
  const s5 = { beats: [0, 2.6], draw(lt) {
    ground(lt, 140, 1000);
    txt('多變項迴歸', 560, 170, 72, { p: prog(lt, .1, .6), color: COL.black });
    underline(330, 790, 220, { p: prog(lt, .6, .4), color: COL.mustardD });
    dad(330, GY, .8, DANCE_DAD(RLT)); kid(560, GY, 1.0, { bob: -Math.abs(Math.sin(RLT * 6)) * 20 }); mom(790, GY, .8, DANCE_MOM(RLT));
    noteBox(1400, 300, 660, 120, [['先問干擾：調整前後比一比', 34, COL.blue], ['再問交互作用：乘積項', 30, COL.red]], '#fff8e2', prog(lt, .4, .6));
    noteBox(1400, 460, 660, 120, [['計數資料 → 卜瓦松、IRR', 34, COL.green], ['必要時分層', 28, COL.gray]], '#fff8e2', prog(lt, .9, .6));
    txt('八章完結，謝謝收看', 1400, 150, 44, { p: prog(lt, 2.7, .6), color: COL.black });
  } };
  const order = [[s1, 10], [s2, 10], [s3, 11], [s4, 9], [s5, 5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '高等體育統計｜第 8 章 EP3　作業：壓差、年齡、性別與卜瓦松發生率', scenes,
    sources: ['資料來源', '作業以 CVD_All_spss.csv 重算（n = 63,200；5,859 件 / 228,765 人年）', '線性：壓差 ~ 年齡 (+性別、交互作用)；卜瓦松：CVD ~ 壓差 (+年齡、性別、交互作用；offset = log 追蹤年)', '課程網站 Chapter 08 作業指南；林老師講義〈多變項迴歸分析〉p.27'] };
})();
EPISODES['c8e3'] = C8E3;
