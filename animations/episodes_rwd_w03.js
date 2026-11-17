// 真實世界運動大數據分析：第 3 週 EP1　把決定寫下來：分析規格書
// 數字來源：real-world-sports-data/gen/facts.json（decision_grid、n_total、regular_complete）與講義 W03.md
const RW03 = {
  N: 37822, nC: 33499,
  // 第 1 週共用表格（示意）：decision_grid 中六種做法的比例
  cls: [51.3, 81.0, 57.9, 83.2, 57.2, 51.4],
  steps: [['規格', '人寫下問題、定義、規則', 6.8], ['計畫', '模型提出，人核可', 9.6], ['執行', '模型寫程式並執行', 11.8], ['驗證', '人設計檢查並判定', 13], ['報告', '人決定結論與限制', 13.4]],
  fields: ['研究問題', '資料', '分析母體', '變項定義', '遺漏值規則', '方法', '輸出', '驗收條件'],
  cols: ['人數', '規律運動人數', '比例', '信賴區間'],
  // decision_grid 的九個不同比例；g: d = 只看天數的定義, s = 天數＋流汗會喘的其他做法, f = 四項全寫
  grid: [[51.3, 's'], [51.4, 's'], [56.9, 's'], [57.2, 's'], [57.5, 's'], [57.9, 'f'], [81.0, 'd'], [81.9, 'd'], [83.2, 'd']],
  dec: [['規律運動的定義', '運動天數達標且會流汗會喘', 19], ['−1 怎麼處理', '轉成遺漏', 29], ['分母是誰', '完整作答的 33,499 人', 31], ['要不要加權', '不加權', 34.2]],
};

const RW03E1 = (() => {
  // 1 開場：第一週的班級共用表格
  const s1 = { beats: [0, 7.4, 16.25], draw(lt) {
    txt('第 1 週｜課堂任務', 80, 130, 46, { p: prog(lt, .2, .8), color: COL.gray, align: 'left' });
    ground(lt, 60, 820);
    stick(190, GY, 1.05, { glasses: true, la: Math.PI * .75, ra: [-Math.PI * .2, -Math.PI * .35], bob: idle(RLT) * .3 });
    bubble(450, 440, 690, 110, 250, 575, '都市化程度和學生規律運動，有沒有關係？', 32, prog(lt, .8, .7));
    appear(prog(lt, 1.5, .7), () => {
      stick(520, GY, .85, { hair: 'tuft', mouth: lt > 13 ? 'o' : 'smile', bob: idle(RLT, 1) * .3 });
      stick(700, GY, .85, { hair: 'pony', mouth: lt > 13 ? 'o' : 'smile', bob: idle(RLT, 2) * .3 });
    });
    // 班級共用表格
    const X = 920, W = 840, Y0 = 240, RH = 68, k = prog(lt, 7.4, .8);
    appear(k, () => {
      txt('班級共用表格', X + W / 2, 195, 44, { color: COL.black });
      shape(rectPts(X, Y0, W, RH), { fill: COL.blueL, w: 3.5, smooth: false });
      txt('同學', X + 150, Y0 + RH / 2, 32, { color: COL.black }); txt('模型報告的規律運動比例', X + 570, Y0 + RH / 2, 32, { color: COL.black });
      for (let i = 0; i < 6; i++) shape(rectPts(X, Y0 + (i + 1) * RH, W, RH), { fill: COL.white, w: 2.5, smooth: false });
      inkLine(X + 300, Y0, X + 300, Y0 + 7 * RH, { w: 2.5 });
    });
    RW03.cls.forEach((v, i) => appear(prog(lt, 8.6 + i * .8, .5), () => {
      const hot = lt > 14 && (v === 51.3 || v === 83.2);
      txt('第 ' + (i + 1) + ' 位', X + 150, Y0 + (i + 1.5) * RH, 32, { color: COL.gray });
      txt(v.toFixed(1) + '%', X + 570, Y0 + (i + 1.5) * RH, 42, { color: hot ? COL.red : COL.black });
    }));
    txt('示意：數字是同一份資料、不同做法算出的比例', X + W / 2, Y0 + 7 * RH + 30, 26, { color: COL.gray, p: prog(lt, 10, .8) });
    // 一句話直接跳到執行
    appear(prog(lt, 16.4, .7), () => {
      txt('一句話', 200, 270, 50, { color: COL.black }); arrow(300, 270, 560, 270, { w: 5, head: 18, color: COL.red, p: prog(lt, 16.8, .8) }); txt('執行', 650, 270, 50, { color: COL.red });
      txt('沒有規格、沒有計畫', 430, 220, 28, { color: COL.gray });
    });
    noteBox(X + W / 2, 825, W, 84, [['沒寫下來的決定，模型替你做了', 40, COL.red]], '#fff8e2', prog(lt, 20, .7));
  } };

  // 2 五步工作流
  const s2 = { beats: [0, 6.6, 14.5], draw(lt) {
    txt('五步工作流', 960, 140, 60, { p: prog(lt, .3, .9), color: COL.black });
    const BX = i => 240 + i * 360;
    RW03.steps.forEach(([name, who, at], i) => {
      appear(prog(lt, 2.3 + i * .75, .5), () => {
        const skip = lt > 14.5 && i < 2;
        shape(roundRectPts(BX(i) - 140, 250, 280, 130, 22), { fill: skip ? COL.pinkL : (i < 3 && lt > at ? COL.blueL : '#fffdf6'), w: 4, color: skip ? COL.red : INK });
        txt(String(i + 1), BX(i) - 88, 315, 50, { color: COL.mustardD }); txt(name, BX(i) + 22, 315, 56, { color: COL.black });
        if (i < 4) arrow(BX(i) + 152, 315, BX(i) + 208, 315, { w: 4, head: 14 });
      });
      txt(who, BX(i), 440, 28, { color: i < 3 ? COL.black : COL.gray, p: prog(lt, at, .9) });
    });
    const k = prog(lt, 14.6, .8);
    if (k > 0) ink([[90, 480], [90, 520], [750, 520], [750, 480]], { w: 5, color: COL.red, p: k });
    appear(prog(lt, 15.4, .6), () => txt('第 1 週略過了這兩步', 420, 580, 46, { color: COL.red }));
    ground(lt, 1180, 1820);
    stick(1420, GY, .9, { glasses: true, la: [Math.PI * 1.15, Math.PI * 1.3], ra: Math.PI * .3, bob: idle(RLT) * .3 });
    stick(1640, GY, .85, { hair: 'pony', bob: idle(RLT, 1) * .3 });
  } };

  // 3 純對話與可執行環境
  const s3 = { beats: [0, 7.0, 15.9], draw(lt) {
    txt('數字是怎麼來的', 80, 130, 50, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    // 左：純對話
    appear(prog(lt, .8, .7), () => {
      shape(roundRectPts(120, 200, 780, 450, 24), { fill: '#fffdf6', w: 4 });
      txt('純對話', 510, 250, 44, { color: COL.blue });
    });
    bubble(420, 345, 420, 76, 300, 400, '平均是多少？', 34, prog(lt, 1.6, .5));
    const strike = prog(lt, 18.5, .6);
    appear(prog(lt, 2.6, .6), () => txt('平均為 3.42', 560, 475, 76, { color: strike > 0 ? COL.gray : COL.black }));
    if (strike > 0) inkLine(340, 480, 790, 470, { w: 7, color: COL.red, p: strike });
    appear(prog(lt, 3.6, .6), () => txt('依語言規律生成', 510, 575, 34, { color: COL.gray }));
    appear(prog(lt, 5.4, .6), () => { cross(800, 250, .6, 1); txt('不能當作結果', 510, 620, 30, { color: COL.red }); });
    // 右：可執行程式的環境
    appear(prog(lt, 7.1, .7), () => {
      shape(roundRectPts(1020, 200, 780, 450, 24), { fill: '#fffdf6', w: 4 });
      txt('可以執行程式的環境', 1410, 250, 44, { color: COL.green });
    });
    appear(prog(lt, 8.2, .6), () => {
      txt('程式', 1090, 325, 28, { color: COL.gray, align: 'left' });
      txt('d <- read.csv("data108.csv")', 1090, 372, 30, { color: COL.black, align: 'left', jit: .5 });
      txt('mean(d$x, na.rm = TRUE)', 1090, 420, 30, { color: COL.black, align: 'left', jit: .5 });
    });
    appear(prog(lt, 9.8, .6), () => {
      arrow(1410, 448, 1410, 486, { w: 4, head: 12 });
      shape(rectPts(1090, 495, 640, 62), { fill: COL.greenL, w: 3, smooth: false }); txt('執行後的輸出', 1410, 527, 32, { color: COL.black });
    });
    appear(prog(lt, 11.4, .6), () => { check(1740, 250, .6, 1); txt('這種數字才收', 1250, 612, 32, { color: COL.green }); });
    appear(prog(lt, 13.2, .6), () => txt('程式仍須審查', 1580, 612, 32, { color: COL.mustardD }));
    noteBox(960, 775, 980, 90, [['沒有程式與輸出，這個數字就不存在', 42, COL.red]], '#fff8e2', prog(lt, 19.2, .7));
    stick(230, GY, .72, { hair: 'tuft', mouth: lt > 15.9 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    stick(1690, GY, .72, { glasses: true, la: Math.PI * .7, ra: Math.PI * .3, bob: idle(RLT, 1) * .3 });
  } };

  // 4 一頁規格書與表格外殼
  const s4 = { beats: [0, 10.4, 16.7, 25.6], draw(lt) {
    txt('一頁，八個欄位', 400, 130, 48, { p: prog(lt, .2, .8), color: COL.black });
    appear(prog(lt, .8, .7), () => { paperSheet(400, 525, 620, 670, 0); txt('分析規格書', 400, 240, 42, { color: COL.black }); });
    RW03.fields.forEach((f, i) => appear(prog(lt, 3.3 + i * .78, .45), () => {
      const y = 318 + i * 66, hot = i === 6 && lt > 10.4;
      if (hot) shape(rectPts(130, y - 28, 540, 56), { fill: COL.mustard, w: 3, smooth: false });
      txt(String(i + 1), 185, y, 34, { color: COL.mustardD }); txt(f, 235, y, 38, { color: COL.black, align: 'left' });
    }));
    // 表格外殼
    const X = 900, C0 = 180, CW = 185, Y0 = 250, HH = 70, RH = 66, k = prog(lt, 10.6, 1.4);
    appear(prog(lt, 10.5, .6), () => txt('表格外殼：只缺數字的空白表格', X + 460, 195, 40, { color: COL.blue }));
    if (k > 0) {
      appear(clamp(k * 2), () => shape(rectPts(X, Y0, C0 + CW * 4, HH), { fill: COL.blueL, w: 3.5, smooth: false }));
      for (let i = 0; i <= 6; i++) inkLine(X, Y0 + HH + i * RH, X + (C0 + CW * 4) * clamp(k * 1.5 - i * .05), Y0 + HH + i * RH, { w: 2.8 });
      for (let j = 0; j <= 4; j++) { const x = j === 0 ? X : X + C0 + (j - 1) * CW + (j === 0 ? 0 : 0); inkLine(j === 0 ? X : X + C0 + (j - 1) * CW, Y0, j === 0 ? X : X + C0 + (j - 1) * CW, Y0 + (HH + 6 * RH) * k, { w: 2.8 }); }
      inkLine(X + C0 + 4 * CW, Y0, X + C0 + 4 * CW, Y0 + (HH + 6 * RH) * k, { w: 2.8 });
    }
    for (let i = 0; i < 6; i++) txt('第 ' + (i + 1) + ' 層', X + C0 / 2, Y0 + HH + (i + .5) * RH, 30, { color: COL.black, p: prog(lt, 18 + i * .35, .5) });
    RW03.cols.forEach((c, j) => txt(c, X + C0 + (j + .5) * CW, Y0 + HH / 2, 27, { color: COL.black, p: prog(lt, 21.2 + j * 1.05, .5) }));
    appear(prog(lt, 14, .6), () => txt('？', X + C0 + 2 * CW, Y0 + HH + 3 * RH, 150, { color: '#d9d3c3' }));
    noteBox(X + 460, 800, 800, 86, [['看到結果之前，先決定要報告什麼', 40, COL.red]], '#fff8e2', prog(lt, 25.7, .6));
    stick(805, GY, .68, { hair: 'pony', ra: lt > 10.4 ? [-Math.PI * .2, -Math.PI * .3] : Math.PI * .3, la: lt > 10.4 ? Math.PI * .7 : [Math.PI * 1.2, Math.PI * 1.3], bob: idle(RLT) * .3 });
  } };

  // 5 四個決策：九個答案收斂成一個
  const s5 = { beats: [0, 7.0, 16.9, 27.0], draw(lt) {
    txt('同一份資料，規律運動比例是多少？', 80, 130, 48, { p: prog(lt, .2, 1), color: COL.black, align: 'left' });
    appear(prog(lt, 4, .6), () => txt('全體 37,822 人', 1620, 130, 36, { color: COL.gray }));
    appear(prog(lt, .9, .6) * (1 - prog(lt, 6.8, .4)), () => { txt('規格沒寫，', 330, 360, 56, { color: COL.black }); txt('會差多少？', 330, 440, 56, { color: COL.red }); });
    // 四個決策
    RW03.dec.forEach(([name, val, at], i) => {
      const y = 250 + i * 100, done = prog(lt, at, .5);
      appear(prog(lt, 7.2 + i * 1.25, .5), () => {
        shape(rectPts(90, y - 24, 48, 48), { fill: done > 0 ? COL.greenL : COL.white, w: 3.5, smooth: false });
        txt(name, 165, y, 38, { color: COL.black, align: 'left' });
      });
      if (done > 0) { check(114, y, .5, done); txt(val, 165, y + 44, 27, { color: COL.green, align: 'left', p: done }); }
    });
    appear(prog(lt, 12.6, .5) * (1 - prog(lt, 18.6, .5)), () => txt('四個都沒寫', 330, 660, 40, { color: COL.red }));
    // 數線
    const PX = p => 800 + (p - 45) / 45 * 960, AY = 620, k1 = prog(lt, 21.9, 1), k2 = prog(lt, 35.5, 1);
    axis(770, 1800, AY, { p: prog(lt, 1.2, .8) });
    [50, 60, 70, 80, 90].forEach(v => appear(prog(lt, 1.8, .6), () => { inkLine(PX(v), AY - 10, PX(v), AY + 10, { w: 3 }); txt(v + '%', PX(v), AY + 40, 28, { color: COL.gray }); }));
    const da = prog(lt, 12.2, 2);
    let base = -99, lv = 0;
    RW03.grid.forEach(([v, g], i) => {
      const x = PX(v); if (x - base < 26) lv++; else { lv = 0; base = x; }
      const a = clamp(da * 9 - i) * (g === 'd' ? 1 - k1 : g === 's' ? 1 - k2 : 1);
      const y = AY - 22 - lv * 30 * (g === 'f' ? 1 - ease(k2) : 1), r = g === 'f' ? 13 + 7 * ease(k2) : 13;
      appear(a, () => shape(ellPts(x, y, r, r, 0, Math.PI * 2, 16), { fill: g === 'f' && k2 > 0 ? COL.green : g === 'd' ? COL.pink : COL.blue, w: 3 }));
    });
    // 個數與範圍
    appear(prog(lt, 12.2, .5), () => txt('可能出現的比例', 1290, 215, 36, { color: COL.gray }));
    const st = lt < 21.9 ? 0 : lt < 35.5 ? 1 : 2, since = [12.4, 21.9, 35.5][st];
    appear(prog(lt, since, .5), () => txt(['9 個', '6 個', '1 個'][st], 1290, 330, 120, { color: [COL.red, COL.mustardD, COL.green][st] }));
    appear(prog(lt, 14, .6) * (1 - prog(lt, 21.9, .4)), () => txt('51.3% ～ 83.2%', 1290, 770, 64, { color: COL.red }));
    appear(prog(lt, 23, .6) * (1 - prog(lt, 35.5, .4)), () => txt('51.3% ～ 57.9%', 1290, 770, 64, { color: COL.mustardD }));
    appear(prog(lt, 36.3, .6), () => { txt('57.9%', 1290, 775, 100, { color: COL.green }); arrow(1082, AY + 68, 1150, 742, { w: 4, head: 14, color: COL.green }); });
    stick(560, GY, .7, { glasses: true, la: Math.PI * .7, ra: lt > 12 ? [-Math.PI * .1, -Math.PI * .2] : Math.PI * .3, mouth: st === 2 ? 'smile' : 'flat', bob: idle(RLT) * .3 });
  } };

  // 6 規格書的測試
  const s6 = { beats: [0, 2.35, 8.6], draw(lt) {
    txt('規格書的測試', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    ground(lt, 240, 1680);
    appear(prog(lt, .8, .6), () => { paperSheet(960, 330, 210, 230, 0); txt('同一份', 960, 300, 34, { color: COL.black }); txt('規格書', 960, 350, 40, { color: COL.black }); });
    const ka = prog(lt, 3, .9);
    arrow(840, 400, 700, 560, { w: 5, head: 16, p: ka }); arrow(1080, 400, 1220, 560, { w: 5, head: 16, p: ka });
    stick(440, GY, .95, { hair: 'pony', ra: Math.PI * .1, bob: idle(RLT) * .3 });
    stick(1480, GY, .95, { hair: 'tuft', la: Math.PI * .9, mouth: lt > 8.6 ? 'o' : 'smile', bob: idle(RLT, 1) * .3 });
    const diff = lt > 8.9;
    appear(prog(lt, 4.6, .6), () => { shape(rectPts(600, 590, 270, 110), { fill: COL.white, w: 4, smooth: false }); txt('57.9%', 735, 646, 60, { color: COL.black }); });
    appear(prog(lt, 5.2, .6), () => { shape(rectPts(1050, 590, 270, 110), { fill: diff ? COL.pinkL : COL.white, w: 4, smooth: false, color: diff ? COL.red : INK }); txt(diff ? '57.2%' : '57.9%', 1185, 646, 60, { color: diff ? COL.red : COL.black }); });
    appear(prog(lt, 6.6, .5), () => txt(diff ? '≠' : '＝', 960, 644, 84, { color: diff ? COL.red : COL.green }));
    appear(prog(lt, 7, .5) * (diff ? 0 : 1), () => check(960, 540, .7, prog(lt, 7, .5)));
    appear(prog(lt, 9.6, .5), () => txt('−1 沒有轉成遺漏', 1185, 735, 28, { color: COL.red }));
    noteBox(960, 815, 760, 84, [['補上沒寫到的決定，再測一次', 40, COL.red]], '#fff8e2', prog(lt, 12.3, .6));
  } };

  // 7 結語
  const s7 = { beats: [0, 2.45], draw(lt) {
    ground(lt, 100, 900);
    txt('決定，在分析之前寫下來', 960, 200, 88, { p: prog(lt, .2, .9), color: COL.black });
    underline(470, 1450, 266, { p: prog(lt, 1.2, .5), color: COL.mustardD });
    appear(prog(lt, 2.6, .7), () => {
      txt('換一個人', 760, 400, 50, { color: COL.blue }); txt('換一個模型', 760, 500, 50, { color: COL.blue });
      arrow(930, 400, 1130, 440, { w: 5, head: 16, p: prog(lt, 4, .7) }); arrow(930, 500, 1130, 460, { w: 5, head: 16, p: prog(lt, 4.6, .7) });
    });
    appear(prog(lt, 6, .6), () => { txt('同一個數字', 1420, 450, 76, { color: COL.green }); check(1700, 440, .8, prog(lt, 6.4, .5)); });
    stick(220, GY, 1.15, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(410, GY, 1.0, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(580, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 24.6], [s2, 20.5], [s3, 23.4], [s4, 29.7], [s5, 40.2], [s6, 15.3], [s7, 13.2]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 3 週　把決定寫下來：分析規格書', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', '四個決策共十六種做法的比例：課程衍生檔重算（facts.json 的 decision_grid）', '林彥光老師講義〈第 3 週 AI 協作分析工作流與分析規格書〉'] };
})();
EPISODES['rw03e1'] = RW03E1;
