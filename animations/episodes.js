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
