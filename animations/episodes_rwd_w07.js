// 真實世界運動大數據分析：第 7 週 EP1　一張圖怎樣算誠實
const RW07 = {
  N: 37822,
  // facts.json by_urban_all：六個都市化層級的規律運動比例（%）
  pct: [47.0, 51.3, 52.2, 54.4, 52.2, 54.7],
  // facts.json a1：選項 1、選項 2、遺漏
  a1: [19026, 17996, 800],
  // facts.json decision_grid（days_sweat / keep / all）：未加權與加權
  unw: 51.3, wtd: 51.4, wN: 37248, wMiss: 574,
  // Anscombe 四組資料的示意形狀（非原始數值）：u、v 皆為 0–1
  shapes: [
    i => [i / 10, .25 + .5 * (i / 10) + [.06, -.09, .1, -.04, .08, -.1, .03, .09, -.07, .05, -.05][i]],
    i => [i / 10, .15 + 2.0 * (i / 10) - 1.4 * (i / 10) * (i / 10)],
    i => [i / 10, i === 8 ? .95 : .2 + .45 * (i / 10)],
    i => i === 10 ? [.92, .9] : [.25, .2 + i * .05],
  ],
};

const RW07E1 = (() => {
  const cell = (x, y, w, h, fill, col) => shape(rectPts(x, y, w, h), { fill: fill || COL.white, w: 2.5, smooth: false, color: col || INK });
  const dot = (x, y, r, col) => shape(ellPts(x, y, r, r, 0, Math.PI * 2, 12), { fill: col || COL.blueL, w: 2.5 });

  // 1 開場故事：Anscombe 1973 的四組資料
  const s1 = { beats: [0, 7.57, 13.7, 17.83], draw(lt) {
    txt('1973｜安斯庫姆（Anscombe）的四組資料', 960, 135, 52, { p: prog(lt, .3, 1), color: COL.black });
    appear(prog(lt, 1.5, .6), () => stick(150, GY, .75, { mouth: 'smile', la: Math.PI * .7, ra: [-Math.PI * .1, -Math.PI * .3], bob: idle(RLT) * .3 }));
    const PX = i => 640 + i * 320, k3 = prog(lt, 13.8, 1.2);
    for (let g = 0; g < 4; g++) {
      const x = PX(g);
      appear(prog(lt, 4.2 + g * .3, .5), () => {
        cell(x - 135, 230, 270, 240);
        txt('第 ' + (g + 1) + ' 組', x, 200, 32, { color: COL.gray });
      });
      appear(prog(lt, 5.8, .5) * (1 - k3), () => {
        [0, 1, 2].forEach(r => inkLine(x - 90, 285 + r * 34, x + 90, 285 + r * 34, { w: 3, color: COL.gray }));
        txt('11 個點', x, 415, 36, { color: COL.black });
      });
      if (k3 > 0) {
        ink([[x - 118, 245], [x - 118, 456], [x + 120, 456]], { w: 3, p: k3 });
        inkLine(x - 110, 450 - .25 * 200, x + 110, 450 - .75 * 200, { w: 3.5, color: COL.blue, p: prog(lt, 15.4, .8) });
        for (let i = 0; i < 11; i++) { const [u, v] = RW07.shapes[g](i); appear(clamp(k3 * 4 - i * .25 - g * .3), () => dot(x - 110 + u * 220, 450 - v * 200, 8, g === 2 && i === 8 || g === 3 && i === 10 ? COL.pinkL : COL.mustard)); }
      }
    }
    appear(k3, () => txt('（示意圖）', 1800, 495, 26, { color: COL.gray, align: 'right' }));
    const ST = [['平均', 7.9], ['變異數', 9.1], ['相關係數', 10.2], ['迴歸線', 11.6]];
    ST.forEach(([s, at], r) => { const k = prog(lt, at, .5), y = 560 + r * 56; appear(k, () => { txt(s, 470, y, 36, { color: COL.black, align: 'right' }); for (let g = 0; g < 4; g++) txt('幾乎相同', PX(g), y, 30, { color: COL.green }); }); });
    noteBox(960, 815, 900, 90, [['先要分布和圖，再要模型', 44, COL.red]], '#fff8e2', prog(lt, 19.6, .7));
  } };

  // 2 表一：遺漏人數與分母
  const s2 = { beats: [0, 5.81, 12.54], draw(lt) {
    txt('表一：樣本是誰，每個變項缺多少', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    stick(140, GY, .95, { glasses: true, la: Math.PI * .7, ra: [-Math.PI * .12, -Math.PI * .2], bob: idle(RLT) * .3 });
    const X0 = 340, Y0 = 220, RH = 88, CW = 330;
    const R = [['a1 題', '人數', .8], ['選項 1', fmtN(RW07.a1[0]), 1.6], ['選項 2', fmtN(RW07.a1[1]), 2.2], ['遺漏', fmtN(RW07.a1[2]), 9.2], ['合計', fmtN(RW07.N), 6.4]];
    R.forEach(([a, b, at], r) => appear(prog(lt, at, .5), () => {
      const y = Y0 + r * RH, miss = r === 3, head = r === 0;
      cell(X0, y, CW, RH, miss ? COL.pinkL : head ? '#fff8e2' : COL.white, miss ? COL.red : INK); cell(X0 + CW, y, CW, RH, miss ? COL.pinkL : head ? '#fff8e2' : COL.white, miss ? COL.red : INK);
      txt(a, X0 + CW / 2, y + RH / 2 - 2, 40, { color: miss ? COL.red : head ? COL.gray : COL.black }); txt(b, X0 + CW * 1.5, y + RH / 2 - 2, head ? 40 : 46, { color: miss ? COL.red : head ? COL.gray : COL.black });
    }));
    noteBox(720, 795, 860, 90, [['列出遺漏人數・百分比註明分母', 42, COL.black]], '#fff8e2', prog(lt, 12.7, .7));
    appear(prog(lt, 16.6, .6), () => txt('選項 1：' + fmtN(RW07.a1[0]) + ' 人', 1440, 260, 46, { color: COL.black }));
    appear(prog(lt, 18.9, .6), () => { txt('分母＝全體 ' + fmtN(RW07.N), 1440, 360, 36, { color: COL.gray }); txt('50.3%', 1440, 445, 88, { color: COL.blue }); });
    appear(prog(lt, 20.9, .6), () => { txt('分母＝有作答 ' + fmtN(RW07.N - RW07.a1[2]), 1440, 570, 36, { color: COL.gray }); txt('51.4%', 1440, 655, 88, { color: COL.green }); });
  } };

  // 3 離群值不等於錯誤
  const s3 = { beats: [0, 7.81, 11.62], draw(lt) {
    txt('離群值不等於錯誤', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    axis(200, 1380, 465, { p: prog(lt, .5, .6) });
    txt('每週運動時數（示意圖）', 760, 510, 28, { color: COL.gray, p: prog(lt, .8, .5) });
    const CNT = [3, 5, 7, 6, 5, 4, 3, 2, 1, 1]; let n = 0;
    CNT.forEach((c, j) => { for (let q = 0; q < c; q++) { n++; appear(prog(lt, .8 + n * .03, .3), () => dot(290 + j * 52, 440 - q * 27, 11, COL.blueL)); } });
    const FX = 1230, real = lt >= 7.81;
    appear(prog(lt, 1.6, .4), () => dot(FX, 440, 13, real ? COL.mustard : COL.pinkL));
    const kc = prog(lt, 2, .7);
    if (kc > 0) inkEll(FX, 440, 42, 40, { w: 4.5, color: COL.red, p: kc });
    appear(prog(lt, 2.4, .4) * (1 - prog(lt, 7.7, .3)), () => txt('？', FX, 360, 56, { color: COL.red }));
    appear(prog(lt, 7.9, .5), () => txt('每週 20 小時', FX, 362, 40, { color: COL.red }));
    const C = [['輸入錯誤', 3.4, '該處理', COL.red], ['遺漏碼', 4.6, '該處理', COL.red], ['真實的極端值', 5.6, '回原始紀錄確認', COL.green]];
    C.forEach(([s, at, st, col], i) => appear(prog(lt, at, .6), () => {
      const x = 330 + i * 430, hot = i === 2 && real;
      shape(roundRectPts(x - 190, 570, 380, 170, 22), { fill: hot ? '#fff8e2' : '#fffdf6', w: hot ? 5 : 4 });
      txt(String(i + 1), x - 150, 612, 40, { color: COL.gray }); txt(s, x + 10, 622, 44, { color: COL.black });
      txt(st, x, 695, 34, { color: col, p: prog(lt, 11.8 + (i === 2 ? 2.2 : i * .5), .5) });
    }));
    appear(prog(lt, 8.2, .6), () => {
      stick(1640, GY, 1.0, { hair: 'pony', la: Math.PI * .75, ra: [-Math.PI * .35, -Math.PI * .5], bob: -Math.abs(Math.sin(RLT * 5)) * 10 });
      const by = 590 - Math.abs(Math.sin(RLT * 5)) * 26;
      shape(ellPts(1722, by, 26, 26, 0, Math.PI * 2, 16), { fill: COL.mustard, w: 3.5 });
    });
    bubble(1620, 450, 300, 90, 1630, 545, '我是校隊', 40, prog(lt, 9, .5));
    noteBox(760, 812, 1100, 80, [['刪除之前，回到原始紀錄確認', 42, COL.black]], '#fff8e2', prog(lt, 14.2, .6));
  } };

  // 4 調查權重：未加權描述樣本，加權估計母體
  const s4 = { beats: [0, 8.37, 18.34], draw(lt) {
    txt('未加權描述樣本，加權估計母體', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const ROW = [[10, COL.blueL], [6, COL.greenL], [3, COL.mustard]], k1 = prog(lt, 1, 1.5), k2 = prog(lt, 3, 1.2);
    appear(prog(lt, .8, .5), () => txt('母體', 510, 210, 40, { color: COL.gray }));
    ROW.forEach(([c, col], r) => { for (let i = 0; i < c; i++) appear(clamp(k1 * 3 - r * .5 - i * .08), () => mini(300 + i * 48, 290 + r * 92, .5, col)); });
    if (k2 > 0) arrow(820, 380, 1040, 380, { w: 5, head: 18, p: k2 });
    appear(k2, () => { txt('抽樣調查', 930, 340, 32, { color: COL.black }); txt('樣本', 1250, 210, 40, { color: COL.gray }); shape(roundRectPts(1090, 240, 320, 270, 20), { fill: '#fffdf6', w: 3.5 }); });
    ROW.forEach(([c, col], r) => { for (let i = 0; i < 3; i++) appear(clamp(prog(lt, 3.6, 1.5) * 3 - r * .5 - i * .15), () => mini(1180 + i * 70, 290 + r * 92, .5, col)); });
    txt('各層抽出率不同（示意圖）', 1250, 545, 28, { color: COL.gray, p: prog(lt, 5, .6) });
    txt('規律運動＝運動天數達標且會流汗會喘', 760, 608, 34, { color: COL.black, p: prog(lt, 8.5, .8) });
    appear(prog(lt, 13.2, .6), () => { txt('未加權（描述樣本）', 430, 668, 36, { color: COL.gray }); txt(RW07.unw.toFixed(1) + '%', 430, 752, 92, { color: COL.blue }); txt('n = ' + fmtN(RW07.N), 430, 828, 28, { color: COL.gray }); });
    appear(prog(lt, 15.7, .6), () => { txt('加權（估計母體）', 1050, 668, 36, { color: COL.gray }); txt(RW07.wtd.toFixed(1) + '%', 1050, 752, 92, { color: COL.green }); txt('n = ' + fmtN(RW07.wN) + '（' + RW07.wMiss + ' 人沒有權重）', 1050, 828, 28, { color: COL.gray }); });
    noteBox(1610, 740, 420, 150, [['報告要寫明', 40, COL.black], ['有沒有加權', 44, COL.red]], '#fff8e2', prog(lt, 20.4, .7));
    appear(prog(lt, 20.4, .6), () => stick(1610, 665, .7, { glasses: true, la: Math.PI * .7, ra: [Math.PI * .4, Math.PI * .45], bob: idle(RLT) * .3 }));
  } };

  // 5 主視覺：同一份資料，縱軸從 0 與從 45
  const s5 = { beats: [0, 11.49, 15.14, 21.59], draw(lt) {
    txt('同一份資料，換一條縱軸', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const BASE = 790, H = 520, X = i => 540 + i * 150, m = ease(prog(lt, 15.6, 2.6));
    const y0 = lerp(0, 45, m), y1 = lerp(60, 56, m), cut = m > 0, done = m >= 1;
    axis(400, 1400, BASE, { p: prog(lt, .6, .5) }); arrow(430, BASE + 10, 430, 210, { w: 4, head: 16, p: prog(lt, .6, .5) });
    txt('規律運動比例 (%)', 450, 195, 30, { color: COL.gray, p: prog(lt, 1, .6), align: 'left' });
    appear(prog(lt, 1.2, .5), () => {
      txt(String(Math.round(y0)), 412, BASE, 36, { color: cut ? COL.red : COL.black, align: 'right' });
      inkLine(420, BASE - H, 440, BASE - H, { w: 3.5 }); txt(String(Math.round(y1)), 412, BASE - H, 32, { color: COL.gray, align: 'right' });
    });
    const kb = prog(lt, 2, 2.5);
    RW07.pct.forEach((p, i) => {
      const h = (p - y0) / (y1 - y0) * H * clamp(kb * 6 - i * .6), hi = i === 5 && lt > 8.4, lo = i === 0 && lt > 6.6;
      bar(X(i), BASE, 100, h, hi || lo ? COL.mustard : COL.blueL);
      txt('第 ' + (i + 1) + ' 層', X(i), BASE + 40, 28, { color: COL.gray, p: prog(lt, 1.2, .5) });
      if (kb >= 1) txt(p.toFixed(1) + '%', X(i), BASE - h - 28, 32, { color: hi || lo ? COL.red : COL.black });
    });
    stick(230, GY, .9, { hair: 'pony', ra: [-Math.PI * .15, -Math.PI * .1], mouth: cut && lt < 21.5 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    noteBox(1640, 290, 400, 90, [[cut ? '縱軸從 45 開始' : '縱軸從 0 開始', 40, cut ? COL.red : COL.black]], '#fff8e2', prog(lt, 11.6, .6));
    noteBox(1640, 460, 400, 170, [['第 6 層 ÷ 第 1 層', 32, COL.gray], [done ? '柱高 4.8 倍' : cut ? '柱高 ……' : '柱高 1.16 倍', 46, cut ? COL.red : COL.black]], '#fff8e2', prog(lt, 12.6, .6));
    noteBox(1640, 660, 400, 170, [['實際只差', 34, COL.gray], ['7.7 個百分點', 46, COL.green]], '#fff8e2', prog(lt, 21.7, .6));
  } };

  // 6 選圖與核對
  const s6 = { beats: [0, 12.37, 17.7], draw(lt) {
    txt('選圖，然後核對', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const C = [[400, '各組的比例', '長條圖・縱軸從 0 開始', COL.blue, 1.6], [960, '分布', '直方圖・箱形圖', COL.green, 6.6], [1520, '兩個連續變項', '散布圖', COL.red, 9.2]];
    C.forEach(([x, a, b, col, at], i) => appear(prog(lt, at, .7), () => {
      shape(roundRectPts(x - 230, 200, 460, 340, 24), { fill: '#fffdf6', w: 4 });
      if (i === 0) { inkLine(x - 130, 405, x + 130, 405, { w: 3.5 }); [118, 134, 126, 140].forEach((h, j) => bar(x - 84 + j * 56, 405, 40, h, COL.blueL)); txt('0', x - 150, 405, 30, { color: COL.blue }); }
      if (i === 1) { inkLine(x - 140, 405, x + 140, 405, { w: 3.5 }); [28, 66, 118, 150, 104, 58, 26].forEach((h, j) => bar(x - 108 + j * 36, 405, 36, h, COL.greenL)); }
      if (i === 2) { ink([[x - 130, 245], [x - 130, 405], [x + 130, 405]], { w: 3.5 }); for (let j = 0; j < 14; j++) dot(x - 105 + j * 16, 380 - j * 8 - rnd(j, 7) * 46, 7, COL.pinkL); }
      txt(a, x, 455, 40, { color: col }); txt(b, x, 505, 30, { color: COL.black });
    }));
    // AI 畫的圖 + 摘要表
    const k2 = prog(lt, 12.5, .8), k3 = prog(lt, 17.9, .8);
    appear(k2, () => {
      txt('AI 畫的圖', 485, 592, 32, { color: COL.gray });
      inkLine(280, 835, 700, 835, { w: 3.5 }); txt('0', 262, 835, 26, { color: COL.gray });
      RW07.pct.forEach((p, i) => bar(330 + i * 62, 835, 44, p / 60 * 190, i === 2 && k3 > 0 ? COL.mustard : COL.blueL));
    });
    appear(prog(lt, 14.6, .7), () => {
      txt('摘要表', 1120, 592, 32, { color: COL.gray });
      [['層級', '比例'], ['第 2 層', '51.3%'], ['第 3 層', '52.2%'], ['第 4 層', '54.4%']].forEach(([a, b], r) => {
        const y = 620 + r * 56, hl = r === 2 && k3 > 0;
        cell(940, y, 180, 56, r === 0 ? '#fff8e2' : COL.white); cell(1120, y, 180, 56, hl ? COL.pinkL : r === 0 ? '#fff8e2' : COL.white);
        txt(a, 1030, y + 26, 30, { color: r === 0 ? COL.gray : COL.black }); txt(b, 1210, y + 26, 32, { color: hl ? COL.red : r === 0 ? COL.gray : COL.black });
      });
    });
    appear(k3, () => { txt('52.2%', 454, 642, 30, { color: COL.red }); });
    if (k3 > 0) { inkEll(454, 642, 62, 26, { w: 4, color: COL.red, p: k3 }); inkEll(1210, 758, 80, 30, { w: 4, color: COL.red, p: k3 }); }
    appear(prog(lt, 19, .5), () => { check(815, 720, 1, prog(lt, 19, .5)); txt('核對一次', 820, 790, 34, { color: COL.green }); });
    stick(1620, GY, .9, { hair: 'tuft', la: waveArm(RLT + 1), ra: Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 7 結語
  const s7 = { beats: [0, 4.29], draw(lt) {
    ground(lt, 140, 1780);
    txt('誠實的圖：印象和數字相稱', 960, 200, 84, { p: prog(lt, .2, .9), color: COL.black });
    underline(440, 1480, 266, { p: prog(lt, 1.6, .5), color: COL.mustardD });
    const k = prog(lt, 4.3, .7);
    appear(k, () => { txt('先看資料', 700, 430, 68, { color: COL.blue }); txt('再建模', 1260, 430, 68, { color: COL.green }); });
    if (k > 0) arrow(890, 430, 1100, 430, { w: 6, head: 20, p: prog(lt, 4.9, .6) });
    stick(240, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(430, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(600, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 25], [s2, 24], [s3, 18.5], [s4, 24], [s5, 28.5], [s6, 22.5], [s7, 11.5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 7 週　一張圖怎樣算誠實', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', 'Anscombe FJ (1973). The American Statistician, 27(1), 17–21', '林彥光老師講義〈第 7 週 探索式資料分析與視覺化〉'] };
})();
EPISODES['rw07e1'] = RW07E1;
