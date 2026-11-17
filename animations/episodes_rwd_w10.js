// 真實世界運動大數據分析：第 10 週 EP1　勝算比不是倍數
const RW10 = {
  // 講義 W10 第 2 節的換算表：對照組比例、OR = 2 時暴露組比例、比例的倍數
  or2: [[5, 9.5, '1.9'], [30, 46, '1.5'], [60, 75, '1.25']],
  // facts.json：全體規律運動比例；by_a1 兩組比例與人數。OR 1.26、倍數 1.12、差 5.8 個百分點見 w10.json 測驗 q4
  N: 37822, pctAll: 51.3, a1: [[19026, 54.8], [17996, 49.0]],
  use: [
    ['描述', COL.blue, ['想要標準化的特徵'], ['調整後的', '比例或平均'], ['—']],
    ['預測', COL.green, ['能提升準確度的', '任何變項'], ['區辨力與校準'], ['個別係數']],
    ['因果', COL.red, ['依 DAG 決定的', '混淆因子'], ['暴露的', '那一個係數'], ['其他共變項的係數']],
  ],
  rows: ['社團參與', '性別', '年級', '都市化層級', '認知 1', '認知 2', '認知 3', '認知 4', '認知 5', '認知 6', '認知 7', '認知 8', '認知 9'],
  code: ['library(marginaleffects)', 'fit <- glm(regular ~ club + sex + grade + urban,', '           data = d, family = binomial)', 'avg_predictions(fit, by = "club")', 'avg_comparisons(fit, variables = "club")'],
};

const RW10E1 = (() => {
  const dash = (x0, y, x1, o) => { for (let x = x0; x < x1; x += 26) inkLine(x, y, Math.min(x + 14, x1), y, { w: 3, ...o }); };
  const lines = (arr, x, y, size, color, gap = 46) => arr.forEach((s, i) => txt(s, x, y + (i - (arr.length - 1) / 2) * gap, size, { color }));

  // 1 課堂情境：請 AI 跑一個迴歸
  const s1 = { beats: [0, 6.69, 12.1], draw(lt) {
    ground(lt, 140, 1780);
    txt('「跑一個迴歸，看哪些因素影響規律運動」', 960, 150, 52, { p: prog(lt, .4, 1.6), color: COL.black });
    stick(400, GY, 1.0, { hair: 'tuft', la: Math.PI * .1, ra: Math.PI * .05, bob: idle(RLT) * .3 });
    appear(prog(lt, 1, .6), () => { shape(rectPts(580, 440, 500, 320), { fill: COL.white, w: 4, smooth: false }); shape([[540, 760], [1120, 760], [1160, 800], [500, 800]], { fill: COL.blueL, w: 4, smooth: false }); });
    ['性別', '年級', '都市化層級', '認知 1', '⋮', '認知 9'].forEach((v, i) => {
      const y = 476 + i * 50;
      txt(v, 610, y, 28, { align: 'left', color: COL.black, p: prog(lt, 2.4 + i * .5, .5) });
      if (i !== 4) {
        inkLine(860, y, 960, y, { w: 4, color: COL.gray, p: prog(lt, 6.8 + i * .3, .4) });
        const kc = prog(lt, 8.4 + i * .5, .5);
        if (kc > 0) inkEll(910, y, 78, 21, { w: 3.5, color: COL.red, p: kc });
      }
    });
    appear(prog(lt, 8.4, .5), () => txt('每個係數都解讀', 830, 400, 30, { color: COL.red }));
    appear(prog(lt, 12.1, .6), () => stick(1520, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat' }));
    bubble(1470, 360, 620, 100, 1500, 470, '這個模型的目的是什麼？', 42, prog(lt, 12.5, .6));
  } };

  // 2 一個工具，三種用途
  const s2 = { beats: [0, 9.09, 14.13, 20.63], draw(lt) {
    txt('一個工具，三種用途', 960, 135, 60, { p: prog(lt, .3, 1), color: COL.black });
    const RY = [400, 560, 715], AT = [9.1, 14.2, 20.7];
    ['放什麼', '看什麼', '不看什麼'].forEach((r, i) => txt(r, 265, RY[i], 34, { align: 'right', color: COL.gray, p: prog(lt, 5.2 + i * .5, .6) }));
    RW10.use.forEach(([name, col, put, see, skip], i) => {
      const x = 540 + i * 470;
      appear(prog(lt, 1.6 + i * 1.1, .7), () => { shape(roundRectPts(x - 215, 215, 430, 585, 24), { fill: '#fffdf6', w: 4 }); txt(name, x, 275, 56, { color: col }); });
      if (lt > 2.5 + i * 1.1) underline(x - 70, x + 70, 312, { p: prog(lt, 2.5 + i * 1.1, .4), color: col });
      appear(prog(lt, AT[i], .6), () => lines(put, x, RY[0], 38, COL.black, 50));
      appear(prog(lt, AT[i] + (i === 0 ? 1.8 : 2.2), .6), () => lines(see, x, RY[1], 38, col, 50));
      appear(prog(lt, AT[i] + (i === 1 ? 4.3 : 3.6), .6), () => lines(skip, x, RY[2], i === 2 ? 34 : 38, COL.gray));
    });
    [480, 640].forEach(y => { if (lt > 5) dash(300, y, 1720, { color: COL.gray, alpha: .5, p: 1 }); });
  } };

  // 3 主視覺：OR 固定是 2，兩根長條隨對照組比例改變，倍數縮小
  const s3 = { beats: [0, 7.57, 14.1, 18.31, 23.64], draw(lt) {
    txt('勝算比不是倍數', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const BASE = 790, H = 5.2, X0 = 330, XC = 540, XE = 800, T = [7.6, 14.1, 18.3];
    axis(X0 - 20, 1000, BASE, { p: prog(lt, .6, .5) }); arrow(X0, BASE + 10, X0, 215, { w: 4, head: 16, p: prog(lt, .6, .5) });
    [0, 50, 100].forEach(v => appear(prog(lt, 1, .5), () => { inkLine(X0 - 12, BASE - v * H, X0, BASE - v * H, { w: 3 }); txt(v + '%', X0 - 24, BASE - v * H, 28, { align: 'right', color: COL.gray }); }));
    txt('對照組', XC, BASE + 42, 36, { color: COL.black, p: prog(lt, 1.2, .5) }); txt('暴露組', XE, BASE + 42, 36, { color: COL.black, p: prog(lt, 1.2, .5) });
    // 狀態：0→1→2
    const k1 = ease(prog(lt, T[1], 1.3)), k2 = ease(prog(lt, T[2], 1.3)), grow = ease(prog(lt, T[0], 1.2));
    const D = RW10.or2, hc = lerp(lerp(D[0][0], D[1][0], k1), D[2][0], k2) * H * grow, he = lerp(lerp(D[0][1], D[1][1], k1), D[2][1], k2) * H * grow;
    const st = k2 > .5 ? 2 : k1 > .5 ? 1 : 0;
    if (grow > 0) {
      bar(XC, BASE, 160, hc, COL.blueL); bar(XE, BASE, 160, he, COL.mustard);
      appear(clamp(grow * 2 - 1), () => { txt(D[st][0] + '%', XC, BASE - hc - 34, 44, { color: COL.black }); txt(D[st][1] + '%', XE, BASE - he - 34, 44, { color: COL.black }); });
    }
    // 右側：OR 固定、倍數、換算表
    noteBox(1400, 240, 560, 100, [['勝算比 OR = 2', 48, COL.red]], '#fff8e2', prog(lt, 1.5, .7));
    appear(prog(lt, 4.3, .6), () => txt('勝算 2 倍 ≠ 機率 2 倍', 1400, 335, 38, { color: COL.black }));
    appear(prog(lt, 11.6, .6), () => { txt('比例的倍數', 1400, 420, 36, { color: COL.gray }); txt('× ' + D[st][2], 1400, 510, 120, { color: COL.red }); });
    const RA = [11.8, 16.6, 21.2];
    D.forEach(([c, e, r], i) => appear(prog(lt, RA[i], .6), () => {
      const y = 630 + i * 58, on = st === i || lt >= 23.6;
      txt(c + '% → ' + e + '%', 1330, y, 36, { color: on ? COL.black : COL.gray }); txt(r + ' 倍', 1600, y, 36, { color: on ? COL.red : COL.gray });
    }));
    const kf = prog(lt, 23.8, .8);
    if (kf > 0) arrow(1720, 615, 1720, 760, { w: 5, head: 16, color: COL.red, p: kf });
    appear(prog(lt, 25.2, .6), () => txt('結果愈常見，離倍數愈遠', 1400, 835, 40, { color: COL.red }));
    stick(150, GY, .8, { hair: 'pony', ra: [-Math.PI * .15, -Math.PI * .1], mouth: st > 0 ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 4 主資料集：a1 兩組
  const s4 = { beats: [0, 5.57, 14.18], draw(lt) {
    txt('換成主資料集', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const out = 1 - prog(lt, 5.2, .5);
    appear(prog(lt, .8, .7) * out, () => {
      txt('全體 ' + fmtN(RW10.N) + ' 人', 960, 330, 44, { color: COL.gray });
      shape(rectPts(360, 400, 1200, 110), { fill: COL.white, w: 4, smooth: false });
      shape(rectPts(360, 400, 1200 * RW10.pctAll / 100 * ease(prog(lt, 1.2, 1.2)), 110), { fill: COL.greenL, w: 4, smooth: false });
      appear(prog(lt, 2.2, .5), () => txt('規律運動 51.3%', 360 + 600 * RW10.pctAll / 100, 455, 46, { color: COL.black }));
    });
    appear(prog(lt, 3.6, .6) * out, () => txt('不是罕見結果', 960, 610, 56, { color: COL.red }));
    // 兩組長條
    const BASE = 790, H = 5.2, X0 = 330, kb = ease(prog(lt, 5.8, 1.2));
    if (kb > 0) {
      axis(X0 - 20, 1000, BASE, { p: prog(lt, 5.6, .5) }); arrow(X0, BASE + 10, X0, 215, { w: 4, head: 16, p: prog(lt, 5.6, .5) });
      [0, 50, 100].forEach(v => { inkLine(X0 - 12, BASE - v * H, X0, BASE - v * H, { w: 3 }); txt(v + '%', X0 - 24, BASE - v * H, 28, { align: 'right', color: COL.gray }); });
      txt('規律運動比例', X0 + 20, 200, 28, { align: 'left', color: COL.gray });
      RW10.a1.forEach(([n, pct], i) => {
        const x = 540 + i * 260, h = pct * H * kb;
        bar(x, BASE, 160, h, i ? COL.blueL : COL.mustard);
        txt('a1 = ' + (i + 1), x, BASE + 40, 36, { color: COL.black }); appear(clamp(kb * 2 - 1), () => txt(fmtN(n) + ' 人', x, BASE - 34, 28, { color: COL.black }));
        appear(prog(lt, 8.6 + i * 1.6, .5), () => txt(pct.toFixed(1) + '%', x, BASE - h - 34, 44, { color: COL.black }));
      });
    }
    const R = [['勝算比', '1.26', COL.red, 11.6], ['比例的倍數', '1.12', COL.black, 14.4], ['比例差', '5.8 個百分點', COL.green, 16.6]];
    R.forEach(([a, b, col, at], i) => appear(prog(lt, at, .6), () => { txt(a, 1090, 300 + i * 130, 40, { align: 'left', color: COL.gray }); txt(b, 1800, 300 + i * 130, 72, { align: 'right', color: col }); }));
    const kn = prog(lt, 19.4, .6);
    appear(kn, () => { txt('「可能性是 1.26 倍」', 1380, 720, 46, { color: COL.black }); txt('誇大效果', 1380, 800, 40, { color: COL.red }); });
    if (lt > 20.2) inkLine(1140, 722, 1620, 718, { w: 5, color: COL.red, p: prog(lt, 20.2, .6) });
    stick(150, GY, .8, { hair: 'tuft', la: Math.PI * .7, ra: [-Math.PI * .1, -Math.PI * .2], mouth: lt > 14 ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 5 改報調整後的比例與比例差
  const s5 = { beats: [0, 4.69], draw(lt) {
    txt('改報：調整後的比例與比例差', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    RW10.code.forEach((l, i) => txt(l, 90, 250 + i * 62 + (i > 2 ? 30 : 0) + (i > 3 ? 50 : 0), 34, { align: 'left', color: COL.black, p: prog(lt, .6 + i * .45, .9), jit: .5 }));
    appear(prog(lt, 2.6, .5), () => txt('# 各組調整後的比例', 130, 514, 28, { align: 'left', color: COL.green }));
    appear(prog(lt, 3.3, .5), () => txt('# 調整後的比例差', 130, 626, 28, { align: 'left', color: COL.green }));
    // 示意長條（不放數字）
    const BASE = 760, kb = ease(prog(lt, 4.9, 1.2)), XA = 1190, XB = 1450, HA = 290, HB = 400;
    axis(1060, 1600, BASE, { p: prog(lt, 4.7, .5) });
    bar(XA, BASE, 150, HA * kb, COL.blueL); bar(XB, BASE, 150, HB * kb, COL.mustard);
    appear(prog(lt, 5.2, .5), () => { txt('未參加社團', XA, BASE + 40, 32, { color: COL.black }); txt('參加社團', XB, BASE + 40, 32, { color: COL.black }); });
    appear(prog(lt, 9.6, .6), () => { txt('[__]%', XA, BASE - HA - 32, 38, { color: COL.black }); txt('[__]%', XB, BASE - HB - 32, 38, { color: COL.black }); });
    const kd = prog(lt, 6.6, .8);
    if (kd > 0) { dash(XA + 80, BASE - HA, 1640, { color: COL.red, p: 1 }); dash(XB + 80, BASE - HB, 1640, { color: COL.red, p: 1 }); ink([[1625, BASE - HA - 8], [1645, BASE - HA - 8], [1645, BASE - HB + 8], [1625, BASE - HB + 8]], { w: 5, color: COL.red, p: kd }); }
    appear(prog(lt, 7.2, .6), () => { txt('高 [__] 個', 1770, BASE - (HA + HB) / 2 - 22, 36, { color: COL.red }); txt('百分點', 1770, BASE - (HA + HB) / 2 + 26, 36, { color: COL.red }); });
    appear(prog(lt, 5.4, .5), () => txt('（示意圖）', 1320, 250, 28, { color: COL.gray }));
    stick(965, GY, .75, { glasses: true, la: Math.PI * .75, ra: [-Math.PI * .08, -Math.PI * .12], bob: idle(RLT) * .3 });
  } };

  // 6 表二謬誤
  const s6 = { beats: [0, 8.89, 16.37, 22.5], draw(lt) {
    txt('所有變項放進一個模型', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const Y = i => 225 + i * 42, XR = 560, focus = prog(lt, 16.6, .7);
    if (lt > 1) inkLine(XR, 200, XR, 760, { w: 3, color: COL.gray, p: prog(lt, 1, .6) });
    appear(prog(lt, 1.4, .5), () => { txt('OR = 1', XR, 790, 26, { color: COL.gray }); txt('（示意圖，非實際結果）', XR, 835, 26, { color: COL.gray }); });
    RW10.rows.forEach((r, i) => {
      const at = 1.6 + i * .3, cx = XR + (rnd(i * 7 + 3) - .42) * 230, hw = 34 + rnd(i * 13 + 5) * 60, me = i === 0 && focus > 0;
      txt(r, 330, Y(i), 28, { align: 'right', color: me ? COL.green : COL.black, p: prog(lt, at, .4) });
      if (lt > at + .2) { inkLine(cx - hw, Y(i), cx + hw, Y(i), { w: 3.5, color: me ? COL.green : INK, p: prog(lt, at + .2, .4) }); appear(prog(lt, at + .5, .3), () => shape(rectPts(cx - 8, Y(i) - 8, 16, 16), { fill: me ? COL.green : COL.black, w: 2, smooth: false })); }
      appear(prog(lt, 6.4 + i * .12, .4) * (1 - focus), () => txt('影響因子', 860, Y(i), 28, { color: COL.red }));
      if (i === 0) appear(focus, () => txt('暴露', 860, Y(i), 32, { color: COL.green }));
      else appear(prog(lt, 18.6 + i * .1, .4), () => txt('？', 860, Y(i), 30, { color: COL.gray }));
    });
    if (focus > 0) { shape(roundRectPts(190, Y(0) - 22, 760, 44, 12), { w: 4, color: COL.green, p: focus }); ink([[940, Y(1) - 8], [965, Y(1) - 8], [965, Y(12) + 12], [940, Y(12) + 12]], { w: 4, color: COL.gray, p: prog(lt, 18.4, .8) }); }
    // 出處
    appear(prog(lt, 8.9, .8), () => {
      paperSheet(1400, 330, 760, 270, .015);
      txt('表二謬誤', 1400, 262, 68, { color: COL.red });
      txt('Westreich & Greenland（2013）', 1400, 345, 36, { color: COL.black });
      txt('American Journal of Epidemiology, 177(4), 292–298', 1400, 405, 26, { color: COL.gray });
    });
    appear(prog(lt, 19.2, .6), () => { txt('其他共變項的係數', 1400, 520, 40, { color: COL.black }); txt('沒有對應的因果解釋', 1400, 578, 40, { color: COL.red }); });
    noteBox(1400, 745, 800, 150, [['描述 → 寫「調整後的關聯」', 38, COL.blue], ['因果 → 一次只回答一個暴露', 38, COL.green]], '#fff8e2', prog(lt, 22.6, .7));
  } };

  // 7 結語（右下角留給資料來源卡）
  const s7 = { beats: [0, 4.61], draw(lt) {
    ground(lt, 140, 790);
    txt('建模之前，先說目的', 960, 190, 88, { p: prog(lt, .2, .9), color: COL.black });
    underline(560, 1360, 256, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    RW10.use.forEach(([name, col], i) => appear(prog(lt, 1.6 + i * .8, .5), () => { shape(roundRectPts(700 + i * 280 - 105, 335, 210, 100, 20), { fill: '#fffdf6', w: 4, color: col }); txt(name, 700 + i * 280, 387, 52, { color: col }); }));
    appear(prog(lt, 4.7, .7), () => txt('報告比例和比例差', 1180, 510, 52, { color: COL.black }));
    appear(prog(lt, 6.4, .7), () => txt('只解讀要回答的那一個係數', 1180, 590, 52, { color: COL.red }));
    stick(280, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(490, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(680, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 17.5], [s2, 27.9], [s3, 29.5], [s4, 23.2], [s5, 13.2], [s6, 29.9], [s7, 13.2]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 10 週　勝算比不是倍數', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', 'Westreich & Greenland (2013). American Journal of Epidemiology, 177(4), 292–298', '林彥光老師講義〈第 10 週 迴歸模型：解讀與誤用〉'] };
})();
EPISODES['rw10e1'] = RW10E1;
