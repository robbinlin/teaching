// 真實世界運動大數據分析：第 2 週 EP1　同一份資料，三種問題
const RW02 = {
  N: 37822, pct: 51.3,
  // 各縣市代碼 1–22 的樣本人數（facts.json county_urban）
  cn: [3925, 4053, 4075, 2404, 3006, 1105, 2580, 1223, 1130, 1469, 1091, 1323, 1271, 1412, 977, 1103, 947, 1214, 1196, 1190, 787, 339],
  six: ['母體與抽樣方式', '題目原文與回溯期間', '選項與數值編碼', '遺漏與不適用的編碼', '跳答邏輯', '衍生變項'],
};

const RW02E1 = (() => {
  const head = (lt, a, b, col) => {
    txt(a, 120, 130, 52, { p: prog(lt, .2, .8), color: col, align: 'left' });
    txt(b, 120, 210, 40, { p: prog(lt, 1.2, 1.4), color: COL.black, align: 'left' });
  };
  const tagBox = (x, y, w, h, s, size, fill, col, k) => appear(k, () => { shape(roundRectPts(x - w / 2, y - h / 2, w, h, 18), { fill, w: 3.5, smooth: false, color: col || INK }); txt(s, x, y + 2, size, { color: col || COL.black }); });

  // 1 開場：課堂情境，主資料集
  const s1 = { beats: [0, 7.4, 14.3, 20.2], draw(lt) {
    ground(lt, 100, 960);
    stick(200, GY, 1.1, { glasses: true, la: Math.PI * .7, ra: [-Math.PI * .12, -Math.PI * .2], bob: idle(RLT) * .3 });
    appear(prog(lt, .4, .8), () => {
      paperSheet(640, 470, 500, 440, -.02);
      txt('主資料集', 640, 320, 34, { color: COL.gray });
      txt('學生運動參與情形調查', 640, 390, 42, { color: COL.black });
      for (let i = 0; i < 3; i++) inkLine(470, 600 + i * 34, 810 - i * 60, 600 + i * 34, { w: 3, color: COL.gray, alpha: .6 });
    });
    appear(prog(lt, 3.6, .7), () => { txt('37,822', 640, 480, 96, { color: COL.blue }); txt('位學生', 640, 552, 32, { color: COL.gray }); });
    // 四種來源
    txt('真實世界數據的來源', 1400, 190, 40, { p: prog(lt, 7.5, .8), color: COL.black });
    [['例行調查', 9.4], ['行政紀錄', 10.6], ['穿戴裝置', 11.6], ['賽事追蹤', 12.9]].forEach(([s, at], i) =>
      tagBox(1230 + (i % 2) * 340, 300 + Math.floor(i / 2) * 120, 290, 88, s, 40, i === 0 ? '#fde9b0' : COL.white, null, prog(lt, at, .6)));
    if (lt > 9.6) arrow(900, 430, 1070, 320, { w: 4, head: 14, color: COL.mustardD, p: prog(lt, 9.6, .7) });
    // 別人決定
    appear(prog(lt, 14.5, .6), () => { txt('題目怎麼問', 1250, 560, 40, { color: COL.black }); arrow(1380, 560, 1470, 560, { w: 4, head: 14 }); txt('別人決定', 1590, 560, 40, { color: COL.red }); });
    appear(prog(lt, 16, .6), () => { txt('誰被抽到', 1250, 640, 40, { color: COL.black }); arrow(1380, 640, 1470, 640, { w: 4, head: 14 }); txt('別人決定', 1590, 640, 40, { color: COL.red }); });
    noteBox(1400, 780, 760, 90, [['先分清楚：問的是哪一類問題', 42, COL.black]], '#fff8e2', prog(lt, 20.4, .7));
  } };

  // 2 三類任務
  const s2 = { beats: [0, 7.05], draw(lt) {
    txt('同一份資料，三種問題', 960, 150, 64, { p: prog(lt, .3, 1), color: COL.black });
    txt('Hernán, Hsu & Healy (2019)', 960, 232, 30, { p: prog(lt, 1.2, .8), color: COL.gray });
    const C = [[420, '描述', '現況是什麼', COL.blue, 4.3], [960, '預測', '能不能由 X 猜到 Y', COL.green, 5.1], [1500, '因果', '改變 X，Y 會不會跟著變', COL.red, 5.9]];
    C.forEach(([x, t, q, col, at]) => appear(prog(lt, at, .6), () => {
      shape(roundRectPts(x - 240, 300, 480, 300, 24), { fill: '#fffdf6', w: 4 });
      txt(t, x, 390, 84, { color: col }); txt(q, x, 510, 36, { color: COL.black });
    }));
    [['問法不同', 7.2], ['條件不同', 8.3], ['結論不同', 9.6]].forEach(([s, at], i) => { txt(s, 420 + i * 540, 720, 52, { p: prog(lt, at, .6), color: COL.black }); if (lt > at + .5) underline(320 + i * 540, 520 + i * 540, 762, { p: prog(lt, at + .5, .4), color: COL.mustardD }); });
  } };

  // 3 描述
  const s3 = { beats: [0, 7.25, 13.45], draw(lt) {
    head(lt, '第一種　描述', '各縣市的學生，規律運動的比例是多少？', COL.blue);
    const BASE = 790, X = i => 150 + i * 41, kb = prog(lt, 2.6, 3);
    axis(110, 1050, BASE, { p: prog(lt, 2, .6) });
    txt('各縣市樣本人數（縣市代碼 1–22）', 120, 300, 30, { p: prog(lt, 2.2, .8), color: COL.gray, align: 'left' });
    RW02.cn.forEach((n, i) => { const kk = ease(clamp(kb * 4 - i * .13)); if (kk > 0) bar(X(i), BASE, 28, n / 4075 * 400 * kk, COL.blueL); txt(String(i + 1), X(i), BASE + 30, 20, { color: COL.gray, p: prog(lt, 2.2, .6), jit: .3 }); });
    stick(1120, GY, .72, { hair: 'pony', la: [Math.PI * 1.05, Math.PI * 1.15], ra: Math.PI * .35, mouth: lt > 13.4 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    appear(prog(lt, 7.4, .6), () => txt('全部樣本直接算', 1520, 300, 38, { color: COL.gray }));
    appear(prog(lt, 9.6, .6), () => { txt('51.3%', 1520, 410, 130, { color: COL.blue }); txt('規律運動＝運動天數達標且會流汗會喘', 1520, 505, 28, { color: COL.gray }); txt('n = 37,822', 1520, 548, 28, { color: COL.gray }); });
    noteBox(1520, 640, 560, 84, [['這是樣本的數字', 42, COL.red]], '#fff8e2', prog(lt, 13.6, .6));
    if (lt > 16.2) arrow(1520, 686, 1520, 730, { w: 4, head: 14, p: prog(lt, 16.2, .5) });
    noteBox(1520, 790, 600, 100, [['全國學生的比例：依抽樣設計加權', 34, COL.blue]], '#eef3fc', prog(lt, 16.6, .7));
  } };

  // 4 預測
  const s4 = { beats: [0, 6.2, 12.65], draw(lt) {
    head(lt, '第二種　預測', '能不能由背景變項，找出不規律運動的學生？', COL.green);
    const hot = lt > 12.8;
    [0, 1, 2].forEach(i => tagBox(250, 350 + i * 100, 260, 74, '背景變項 ' + (i + 1), 34, hot && i === 1 ? '#fde9b0' : COL.white, null, prog(lt, 1.6 + i * .3, .5)));
    arrow(400, 450, 520, 450, { w: 5, head: 16, p: prog(lt, 2.6, .5) });
    appear(prog(lt, 2.8, .6), () => { shape(roundRectPts(540, 370, 240, 160, 20), { fill: COL.greenL, w: 4, smooth: false }); txt('模型', 660, 452, 52, { color: COL.black }); });
    arrow(800, 450, 920, 450, { w: 5, head: 16, p: prog(lt, 3.4, .5) });
    const flag = [1, 0, 0, 1, 0, 1, 0, 0], flag2 = [0, 1, 0, 0, 1, 0, 0, 1];
    const row = (y, f, k, guess, label) => appear(k, () => {
      txt(label, 1010, y - 110, 30, { color: COL.gray, align: 'left' });
      f.forEach((v, i) => mini(1040 + i * 84, y, .78, v && guess > 0 ? COL.pinkL : COL.white));
    });
    row(430, flag, prog(lt, 3.6, .6), prog(lt, 4.6, .3), '建模型的資料');
    appear(prog(lt, 4.8, .5), () => txt('粉紅＝模型猜「不規律運動」', 1240, 320, 28, { color: COL.pink, align: 'left' }));
    if (lt > 6.6) check(1760, 420, .9, prog(lt, 6.6, .5));
    row(660, flag2, prog(lt, 8.6, .6), prog(lt, 9.4, .3), '新資料');
    if (lt > 10.6) check(1760, 650, .9, prog(lt, 10.6, .5));
    appear(prog(lt, 6.9, .5), () => txt('猜得準', 1700, 326, 32, { color: COL.green }));
    appear(prog(lt, 10.9, .5), () => txt('還是要準', 1700, 556, 32, { color: COL.green }));
    stick(250, GY, .8, { hair: 'tuft', la: Math.PI * .75, ra: [-Math.PI * .3, -Math.PI * .45], mouth: hot ? 'flat' : 'smile', bob: idle(RLT) * .3 });
    noteBox(900, 790, 900, 92, [['對預測有幫助 ≠ 改變它，結果就會變', 40, COL.red]], '#fff8e2', prog(lt, 12.9, .7));
  } };

  // 5 因果
  const s5 = { beats: [0, 5.6, 10.6, 15.6], draw(lt) {
    head(lt, '第三種　因果', '參加運動社團，會不會讓學生更規律運動？', COL.red);
    // 右：因果圖
    tagBox(1090, 620, 300, 90, '參加社團', 40, COL.blueL, null, prog(lt, 1.6, .6));
    tagBox(1650, 620, 300, 90, '規律運動', 40, COL.greenL, null, prog(lt, 2.2, .6));
    arrow(1250, 620, 1490, 620, { w: 5, head: 18, p: prog(lt, 2.8, .7) });
    txt('？', 1370, 572, 56, { p: prog(lt, 3.4, .5), color: COL.red });
    const kc = prog(lt, 10.8, .6);
    tagBox(1370, 380, 380, 90, '本來就愛運動', 40, '#fde9b0', null, kc);
    if (lt > 12) arrow(1280, 430, 1120, 568, { w: 5, head: 16, color: COL.red, p: prog(lt, 12, .7) });
    if (lt > 13.6) arrow(1460, 430, 1620, 568, { w: 5, head: 16, color: COL.red, p: prog(lt, 13.6, .7) });
    // 左：比較的兩組
    const love = [[1, 1, 0, 1, 1], [0, 0, 1, 0, 0]];
    [['有參加社團', 400, 5.8], ['沒參加社團', 640, 6.6]].forEach(([lab, y, at], r) => appear(prog(lt, at, .6), () => {
      txt(lab, 110, y - 20, 34, { color: COL.black, align: 'left' });
      love[r].forEach((v, i) => mini(370 + i * 88, y, .78, v && kc > 0 ? COL.mustard : COL.white));
    }));
    appear(prog(lt, 7.6, .6), () => { ink([[820, 350], [850, 350], [850, 680], [820, 680]], { w: 4, color: COL.blue }); txt('其他方面', 940, 490, 32, { color: COL.blue }); txt('要可以相比', 940, 534, 32, { color: COL.blue }); });
    appear(kc, () => { shape(rectPts(120, 487, 30, 30), { fill: COL.mustard, w: 2.5, smooth: false }); txt('本來就愛運動（示意）', 165, 503, 28, { color: COL.gray, align: 'left' }); });
    noteBox(960, 795, 1240, 90, [['題目寫「影響」「效果」＝因果語言，用因果的標準檢驗', 40, COL.black]], '#fff8e2', prog(lt, 15.8, .7));
  } };

  // 6 編碼簿六件事、引用
  const s6 = { beats: [0, 4.7, 10.75, 16.95, 24.75, 29.55], draw(lt) {
    txt('分析之前：從編碼簿找出六件事', 960, 140, 56, { p: prog(lt, .3, 1), color: COL.black });
    appear(prog(lt, 1, .7), () => { paperSheet(300, 400, 300, 300, -.03); txt('編碼簿', 300, 320, 46, { color: COL.black }); for (let i = 0; i < 4; i++) inkLine(200, 390 + i * 36, 400 - (i % 2) * 50, 390 + i * 36, { w: 3, color: COL.gray, alpha: .6 }); });
    stick(230, GY, 1.0, { glasses: true, la: Math.PI * .7, ra: [-Math.PI * .4, -Math.PI * .45], bob: idle(RLT) * .3 });
    const at = [4.9, 6.6, 9.3, 10.9, 12.2, 13.4];
    RW02.six.forEach((s, i) => appear(prog(lt, at[i], .5), () => {
      const y = 262 + i * 78, hot = i === 3 && lt > 17;
      txt(String(i + 1), 650, y, 46, { color: hot ? COL.red : COL.blue }); txt(s, 700, y, 40, { color: hot ? COL.red : COL.black, align: 'left' });
    }));
    // 遺漏碼 −1
    appear(prog(lt, 17.2, .6), () => {
      txt('遺漏碼 = −1', 1520, 270, 50, { color: COL.red });
      for (let i = 0; i < 5; i++) { const m = i === 1 || i === 3; shape(rectPts(1290 + i * 92, 330, 84, 64), { fill: m ? COL.pinkL : COL.white, w: 2.5, smooth: false }); if (m) txt('−1', 1332 + i * 92, 364, 34, { color: COL.red }); else inkLine(1312 + i * 92, 362, 1352 + i * 92, 362, { w: 3, color: COL.gray, alpha: .6 }); }
    });
    if (lt > 21) arrow(1520, 404, 1520, 446, { w: 4, head: 14, p: prog(lt, 21, .4) });
    noteBox(1520, 500, 540, 88, [['模型：把 −1 當成數值來算', 36, COL.black]], '#fff8e2', prog(lt, 21.3, .6));
    noteBox(1520, 620, 540, 88, [['類別代碼 → 當成連續數字', 36, COL.black]], '#fff8e2', prog(lt, 24.9, .6));
    noteBox(1080, 800, 1200, 92, [['找文獻：每一筆引用，都要自己開過原文', 42, COL.blue]], '#eef3fc', prog(lt, 29.7, .7));
  } };

  // 7 結語
  const s7 = { beats: [0, 5.25], draw(lt) {
    ground(lt, 140, 1780);
    txt('先分類，再決定方法與結論', 960, 190, 84, { p: prog(lt, .2, .9), color: COL.black });
    underline(480, 1440, 252, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    [[620, '描述', '加權', COL.blue, 1.2], [1040, '預測', '新資料驗證', COL.green, 1.9], [1460, '因果', '兩組可比', COL.red, 2.6]].forEach(([x, a, b, col, at]) => appear(prog(lt, at, .6), () => {
      tagBox(x, 360, 240, 90, a, 52, '#fffdf6', col, 1);
      arrow(x, 412, x, 462, { w: 4, head: 14 }); txt(b, x, 505, 40, { color: COL.black });
    }));
    appear(prog(lt, 5.4, .7), () => txt('課程網站：十句研究問題，練習分類', 1320, 605, 40, { color: COL.blue }));
    stick(250, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(450, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(630, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 28], [s2, 12.5], [s3, 22], [s4, 18.5], [s5, 23.5], [s6, 35.5], [s7, 13.5]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 2 週　同一份資料，三種問題', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', 'Hernán, Hsu & Healy (2019). Chance, 32(1), 42–49', '林彥光老師講義〈第 2 週 真實世界數據與三類研究問題〉'] };
})();
EPISODES['rw02e1'] = RW02E1;
