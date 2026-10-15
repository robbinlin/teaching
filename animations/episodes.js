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
