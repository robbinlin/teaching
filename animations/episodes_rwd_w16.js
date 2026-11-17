// 真實世界運動大數據分析：第 16 週 EP1　別人按一個鍵，能得到同一個數字嗎
const RW16 = {
  // facts.json：n_total、regular_all（51.3%）、regular_complete（33,499 人、57.9%）
  N: 37822, pct: 51.3, nC: 33499, pctC: 57.9,
  // 講義 W16 第 1 節的行內程式
  code: ['分析樣本共 `r nrow(d)` 人，', '其中規律運動者占', '`r round(100 * mean(d$regular,', '      na.rm = TRUE), 1)`%。'],
  // 講義 W16 第 2 節的資料夾結構
  tree: [['README.md', '專案說明、執行順序、軟體版本'], ['data/raw/', '原始資料'], ['data/derived/', '程式產生的資料'], ['code/01_clean.R', ''], ['code/02_analysis.R', ''], ['code/03_figures.R', ''], ['output/', '表格與圖'], ['log/', 'AI 對話與執行紀錄'], ['report/report.qmd', '']],
  rules: [['原始資料不動', '唯讀，不修改'], ['衍生資料只由程式產生', '不用滑鼠手動改'], ['程式檔名有順序', '01 清理 → 02 分析 → 03 畫圖']],
  // 講義 W16 第 3 節：常見的失敗原因
  fails: [['寫死的個人路徑', 'D:\\Dropbox\\...'], ['沒有記錄的套件', ''], ['手動做過的步驟', '沒有寫進程式'], ['沒有設定亂數種子', '']],
  // 講義 W16 第 5 節：揭露的四個要素與例子
  disc: [['工具與版本', '工具名稱、模型版本、使用日期'], ['用在哪裡', '撰寫資料清理與分析程式；起草結果段落'], ['沒用在哪裡', '研究問題、DAG 與調整集、結論由作者決定'], ['人做了什麼驗證', '衍生變項經交叉表檢查；主要結果獨立重現；引用核對原文']],
};

const RW16E1 = (() => {
  const folder = (x, y, s, label, fill = COL.mustard) => {
    shape([[x - 72 * s, y - 40 * s], [x - 72 * s, y - 62 * s], [x - 18 * s, y - 62 * s], [x - 4 * s, y - 40 * s]], { fill, w: 3.5, smooth: false });
    shape(roundRectPts(x - 78 * s, y - 42 * s, 156 * s, 100 * s, 10), { fill, w: 4 });
    if (label) txt(label, x, y + 10 * s, 26 * s, { color: COL.black });
  };
  // 按鍵：k = 0 未按、1 按到底
  const keycap = (x, y, s, k, label = '執行') => {
    const d = 12 * s * k;
    shape(roundRectPts(x - 62 * s, y - 34 * s, 124 * s, 84 * s, 14), { fill: COL.gray, w: 3.5 });
    shape(roundRectPts(x - 62 * s, y - 46 * s + d, 124 * s, 80 * s, 14), { fill: k > .5 ? COL.mustard : COL.white, w: 4 });
    txt(label, x, y - 6 * s + d, 34 * s, { color: COL.black });
  };
  const press = (lt, at) => clamp(prog(lt, at, .25) - prog(lt, at + .7, .35));
  const screen = (x, y, w, h) => { shape(rectPts(x - w / 2, y - h / 2, w, h), { fill: COL.white, w: 4, smooth: false }); shape([[x - w / 2 - 30, y + h / 2], [x + w / 2 + 30, y + h / 2], [x + w / 2 + 60, y + h / 2 + 36], [x - w / 2 - 60, y + h / 2 + 36]], { fill: COL.blueL, w: 4, smooth: false }); };
  const win = (x, y, w, h, title, col) => { shape(roundRectPts(x, y, w, h, 16), { fill: '#fffdf6', w: 4 }); inkLine(x + 6, y + 64, x + w - 6, y + 64, { w: 3 }); txt(title, x + w / 2, y + 34, 34, { color: col }); };

  // 1 開場：課堂任務，互相重跑
  const s1 = { beats: [0, 8.69, 15.61], draw(lt) {
    ground(lt, 140, 1780);
    txt('第 16 週　課堂任務：互相重跑', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    // 交資料夾的同學與她的報告
    stick(330, GY, 1.0, { hair: 'pony', la: Math.PI * .7, ra: lt < 5 ? Math.PI * .08 : Math.PI * .3, bob: idle(RLT) * .3 });
    appear(prog(lt, 8.8, .7), () => {
      paperSheet(330, 400, 440, 250, -.02);
      txt('報告', 330, 318, 34, { color: COL.gray }); txt('規律運動的比例', 330, 380, 34, { color: COL.black }); txt('51.3%', 330, 460, 76, { color: COL.blue });
    });
    // 資料夾交給對方
    const mv = ease(prog(lt, 2.4, 2.4));
    folder(lerp(520, 800, mv), lerp(690, 700, mv) - Math.sin(mv * Math.PI) * 60, 1, 'README');
    stick(960, GY, 1.0, { hair: 'tuft', la: Math.PI * .85, ra: lt > 12.6 ? [Math.PI * .1, -Math.PI * .1] : Math.PI * .3, mouth: lt > 15.6 ? 'o' : 'smile', bob: idle(RLT, 1) * .3 });
    appear(prog(lt, 4.4, .6), () => screen(1290, 610, 400, 250));
    // 老師的規則
    const kt = prog(lt, 4.6, .6) * (1 - prog(lt, 8.4, .5));
    appear(prog(lt, .8, .6), () => stick(1720, GY, 1.0, { glasses: true, la: Math.PI * .8, ra: Math.PI * .3, mouth: 'smile', bob: idle(RLT, 2) * .3 }));
    bubble(1560, 380, 600, 100, 1700, 590, '只看 README，不可以問對方', 38, kt);
    // 對方按下執行鍵
    const kp = press(lt, 12.9);
    appear(prog(lt, 9.6, .6), () => keycap(1290, 560, 1, kp));
    appear(prog(lt, 13.5, .5) * (1 - prog(lt, 15.6, .4)), () => txt('執行中 ⋯', 1290, 680, 34, { color: COL.gray }));
    appear(prog(lt, 15.8, .5), () => txt('？', 1290, 690, 70, { color: COL.red }));
    noteBox(1010, 270, 800, 90, [['能不能得到同一個數字', 46, COL.red]], '#fff8e2', prog(lt, 17.4, .7));
  } };

  // 2 複製貼上是錯誤的來源
  const s2 = { beats: [0, 8.37, 14.9, 22.39], draw(lt) {
    txt('複製貼上是錯誤的來源', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const ch = ease(prog(lt, 8.6, 1.4)), changed = lt > 9.3;
    appear(prog(lt, 2.6, .7), () => {
      win(150, 215, 640, 400, '統計軟體的輸出', COL.blue);
      txt(changed ? '分母：完整作答 ' + fmtN(RW16.nC) + ' 人' : '分母：全體 ' + fmtN(RW16.N) + ' 人', 470, 330, 34, { color: changed ? COL.red : COL.gray });
      txt('規律運動的比例', 470, 400, 36, { color: COL.black });
      txt(lerp(RW16.pct, RW16.pctC, ch).toFixed(1) + '%', 470, 510, 100, { color: changed ? COL.green : COL.blue });
    });
    appear(prog(lt, 9, .6), () => txt('定義改了，表格更新', 560, 665, 36, { color: COL.green }));
    // 手抄
    const kc = prog(lt, 5, 1.2);
    arrow(820, 415, 1100, 415, { w: 6, head: 20, p: kc });
    appear(prog(lt, 5.2, .6), () => txt('手抄', 960, 370, 40, { color: COL.mustardD }));
    appear(prog(lt, 6, .7), () => {
      shape(rectPts(1130, 215, 640, 400), { fill: COL.white, w: 4, smooth: false });
      txt('文書軟體的內文', 1450, 249, 34, { color: COL.gray });
      [300, 560].forEach(y => { inkLine(1180, y, 1720, y, { w: 3, color: COL.gray, alpha: .5 }); inkLine(1180, y + 26, 1600, y + 26, { w: 3, color: COL.gray, alpha: .5 }); });
      txt('規律運動者占', 1450, 380, 36, { color: COL.black });
      txt('51.3%', 1450, 470, 100, { color: lt > 14.9 ? COL.red : COL.blue });
    });
    const ke = prog(lt, 15.2, .8);
    if (ke > 0) inkEll(1450, 470, 200, 72, { w: 5, color: COL.red, p: ke });
    appear(prog(lt, 19, .6), () => txt('忘了改', 1450, 665, 40, { color: COL.red }));
    noteBox(1010, 780, 1100, 90, [['第 9 週期中報告：內文與表格數字不一致', 40, COL.black]], '#fff8e2', prog(lt, 22.5, .7));
    stick(260, GY, .8, { hair: 'pony', la: Math.PI * .7, ra: Math.PI * .3, mouth: lt > 14.9 ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 3 Quarto：文字、程式、輸出放在同一份文件
  const s3 = { beats: [0, 6.77, 11.54], draw(lt) {
    txt('Quarto：數字由程式填入', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    [['文字', COL.black], ['程式', COL.blue], ['輸出', COL.green]].forEach(([s, c], i) => appear(prog(lt, 2.6 + i * .8, .5), () => { shape(roundRectPts(1010 + i * 200, 100, 170, 68, 18), { fill: '#fffdf6', w: 3.5, color: c }); txt(s, 1095 + i * 200, 135, 38, { color: c }); }));
    appear(prog(lt, .8, .7), () => {
      shape(rectPts(120, 215, 800, 420), { fill: COL.white, w: 4, smooth: false });
      txt('report.qmd', 520, 255, 34, { color: COL.gray });
      RW16.code.forEach((l, i) => txt(l, 170, 340 + i * 68, 36, { align: 'left', color: i >= 2 || i === 0 ? COL.blue : COL.black, jit: .5 }));
    });
    // 產生文件
    const again = lt > 11.54, kr = again ? prog(lt, 13.2, 1) : prog(lt, 7, 1.2);
    arrow(950, 425, 1150, 425, { w: 6, head: 20, p: prog(lt, 7, 1.2) });
    appear(prog(lt, 7.2, .6), () => txt(again ? '重新產生' : '產生文件', 1050, 380, 36, { color: COL.mustardD }));
    const up = ease(prog(lt, 13.4, 1.4));
    appear(prog(lt, 7.6, .7), () => {
      paperSheet(1490, 425, 620, 420, .012);
      txt('報告', 1490, 255, 34, { color: COL.gray });
      txt('分析樣本共', 1490, 330, 36, { color: COL.black });
      txt(fmtN(Math.round(lerp(RW16.N, RW16.nC, up))) + ' 人', 1490, 400, 60, { color: COL.blue });
      txt('其中規律運動者占', 1490, 480, 36, { color: COL.black });
      txt(lerp(RW16.pct, RW16.pctC, up).toFixed(1) + '%', 1490, 560, 76, { color: COL.blue });
    });
    appear(prog(lt, 11.7, .6), () => txt('定義改了：分母只算完整作答', 470, 700, 38, { color: COL.red }));
    if (lt > 15) { check(1800, 400, .7, prog(lt, 15, .4)); check(1800, 560, .7, prog(lt, 15.4, .4)); }
    noteBox(1490, 730, 620, 90, [['所有數字一起更新', 44, COL.green]], '#fff8e2', prog(lt, 15.6, .6));
    stick(860, GY + 20, .62, { glasses: true, la: [Math.PI * 1.1, Math.PI * 1.25], ra: Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 4 專案資料夾的三條規則
  const s4 = { beats: [0, 8.66, 13.51], draw(lt) {
    txt('專案資料夾的三條規則', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const TY = i => 290 + i * 60, at = [3.2, 8.8, 13.7], rows = [[1], [2], [3, 4, 5]];
    // 目前講到的那一列加底色
    rows.forEach((r, k) => { const a = prog(lt, at[k], .5) * (k < 2 ? 1 - prog(lt, at[k + 1] - .3, .4) : 1); if (a > 0) appear(a, () => shape(rectPts(196, TY(r[0]) - 28, 700, r.length * 60 - 4), { fill: [COL.pinkL, COL.greenL, COL.blueL][k], stroke: false, smooth: false })); });
    appear(prog(lt, .6, .6), () => { folder(170, 222, .62, ''); txt('project/', 240, 222, 38, { align: 'left', color: COL.black }); });
    const kt = prog(lt, .9, 2);
    inkLine(170, 262, 170, TY(8), { w: 3.5, p: kt });
    RW16.tree.forEach(([name, note], i) => appear(clamp(kt * 9 - i), () => {
      inkLine(170, TY(i), 204, TY(i), { w: 3.5 });
      txt(name, 216, TY(i), 34, { align: 'left', color: COL.black, jit: .5 });
      if (note) txt(note, 500, TY(i), 28, { align: 'left', color: COL.gray });
    }));
    RW16.rules.forEach(([t, sub], i) => appear(prog(lt, at[i], .7), () => {
      const y = 250 + i * 190, col = [COL.red, COL.green, COL.blue][i];
      shape(roundRectPts(1020, y, 780, 160, 22), { fill: '#fffdf6', w: 4 });
      txt(String(i + 1), 1085, y + 80, 68, { color: col }); txt(t, 1150, y + 56, 46, { color: col, align: 'left' }); txt(sub, 1150, y + 116, 32, { color: COL.black, align: 'left' });
    }));
    stick(940, GY + 20, .6, { hair: 'pony', la: [Math.PI * .95, Math.PI * 1.1], ra: Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 5 重跑測試（主視覺）
  const s5 = { beats: [0, 7.97, 15.7, 24.31, 30.44], draw(lt) {
    ground(lt, 140, 1780);
    txt('重跑測試', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const ok = lt > 31.9, run1 = lt > 16.4;
    // 左：作者與報告
    appear(prog(lt, .5, .6), () => { paperSheet(290, 330, 380, 210, -.02); txt('報告', 290, 262, 32, { color: COL.gray }); txt('51.3%', 290, 350, 84, { color: COL.blue }); });
    stick(290, GY, .9, { hair: 'pony', la: Math.PI * .7, ra: lt < 4 ? Math.PI * .05 : Math.PI * .3, mouth: run1 && !ok ? 'flat' : 'smile', bob: idle(RLT) * .3 });
    // 右：重跑的人與螢幕
    appear(prog(lt, .8, .6), () => { screen(1620, 330, 340, 210); txt('對方的電腦', 1620, 200, 30, { color: COL.gray }); });
    stick(1680, GY, .9, { hair: 'tuft', la: [Math.PI * .9, Math.PI * 1.05], ra: Math.PI * .3, mouth: ok ? 'smile' : run1 ? 'o' : 'smile', bob: idle(RLT, 1) * .3 });
    // 資料夾交過去
    const mv = ease(prog(lt, 1.6, 3));
    folder(lerp(560, 1300, mv), 330 - Math.sin(mv * Math.PI) * 50, .9, 'README');
    appear(prog(lt, 5, .6) * (1 - prog(lt, 7.8, .4)), () => { txt('另一個人', 930, 300, 38, { color: COL.black }); txt('或全新的 AI 對話', 930, 356, 38, { color: COL.black }); });
    // 兩個條件
    const c1 = prog(lt, 9.2, .6), c2 = prog(lt, 12.6, .6), cf = 1 - prog(lt, 15.4, .4);
    appear(c1 * cf, () => txt('1　不問任何問題，就能跑完', 620, 490, 42, { color: COL.black, align: 'left' }));
    appear(c2 * cf, () => txt('2　得到和報告相同的數字', 620, 570, 42, { color: COL.black, align: 'left' }));
    // 按鍵
    const kp = Math.max(press(lt, 15.9), press(lt, 31.2));
    appear(prog(lt, 8.4, .6), () => keycap(1450, 740, .9, kp));
    // 螢幕上的結果
    appear(prog(lt, 16.6, .5) * (1 - prog(lt, 31.2, .4)), () => { txt('執行失敗', 1620, 310, 46, { color: COL.red }); cross(1620, 380, .5, prog(lt, 16.8, .5)); });
    appear(prog(lt, 32, .6), () => txt('51.3%', 1620, 330, 84, { color: COL.green }));
    // 四個失敗原因
    const fa = [17.6, 22, 24.5, 28], fx = [760, 1130], fy = [530, 700];
    RW16.fails.forEach(([t, sub], i) => appear(prog(lt, fa[i], .6), () => {
      const x = fx[i % 2], y = fy[Math.floor(i / 2)];
      shape(roundRectPts(x - 175, y - 70, 350, 140, 18), { fill: ok ? COL.greenL : COL.pinkL, w: 3.5, color: ok ? COL.green : COL.red });
      txt(t, x, sub ? y - 22 : y, 34, { color: COL.black }); if (sub) txt(sub, x, y + 28, 30, { color: ok ? COL.gray : COL.red, jit: .5 });
      if (lt > 30.6 + i * .2) check(x + 140, y - 56, .5, prog(lt, 30.6 + i * .2, .4));
    }));
    appear(prog(lt, 15.8, .5) * (1 - prog(lt, 30.4, .4)), () => txt('常見的失敗原因', 945, 420, 40, { color: COL.red }));
    // 兩邊的數字相同
    const ke = prog(lt, 33, 1);
    if (ke > 0) { ink([[480, 262], [960, 212], [1440, 262]], { w: 5, color: COL.green, p: ke }); }
    appear(prog(lt, 33.6, .6), () => { txt('和報告一樣', 900, 400, 46, { color: COL.green }); check(1070, 395, .7, prog(lt, 33.8, .5)); });
  } };

  // 6 AI 使用揭露
  const s6 = { beats: [0, 8.53, 12.97], draw(lt) {
    txt('AI 使用揭露', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 3.6, .7), () => {
      paperSheet(430, 340, 640, 190, -.015);
      txt('「本研究使用 AI 工具輔助。」', 430, 340, 40, { color: COL.black });
    });
    if (lt > 6.8) cross(700, 262, .7, prog(lt, 6.8, .5));
    appear(prog(lt, 7, .5), () => txt('不夠', 620, 262, 40, { color: COL.red }));
    stick(430, GY, 1.0, { hair: 'tuft', la: Math.PI * .7, ra: lt > 8.5 && lt < 13 ? [-Math.PI * .2, -Math.PI * .6] : Math.PI * .3, mouth: lt > 8.5 && lt < 20 ? 'flat' : 'smile', bob: idle(RLT) * .3 });
    appear(prog(lt, 8.5, .5), () => txt('讀者', 290, 700, 32, { color: COL.gray }));
    appear(prog(lt, 9.2, .6) * (1 - prog(lt, 20.5, .5)), () => { txt('哪些部分', 660, 520, 38, { color: COL.red }); txt('要多看一眼？', 660, 572, 38, { color: COL.red }); });
    // 四個要素
    const at = [14.8, 16.6, 18, 19.8], col = [COL.blue, COL.green, COL.red, COL.mustardD];
    appear(prog(lt, 13, .6), () => txt('揭露的四個要素', 1370, 215, 44, { color: COL.black }));
    RW16.disc.forEach(([t, ex], i) => appear(prog(lt, at[i], .7), () => {
      const y = 265 + i * 150;
      shape(roundRectPts(900, y, 940, 132, 20), { fill: '#fffdf6', w: 4 });
      txt(String(i + 1), 950, y + 66, 56, { color: col[i] }); txt(t, 1000, y + 42, 40, { color: col[i], align: 'left' }); txt(ex, 1000, y + 96, 27, { color: COL.black, align: 'left' });
    }));
    appear(prog(lt, 21, .6), () => { txt('讀者能判斷風險', 620, 545, 38, { color: COL.green }); check(800, 540, .6, prog(lt, 21.2, .5)); });
  } };

  // 7 結語：回扣第一週；角色放左半邊，右下角留給資料來源卡
  const s7 = { beats: [0, 9.56], draw(lt) {
    ground(lt, 140, 1780);
    txt('第 1 週｜同一句話，十六個答案', 960, 150, 46, { p: prog(lt, .3, 1), color: COL.gray });
    const C = [['規格', COL.blue, COL.blueL], ['判斷', COL.red, COL.pinkL], ['驗證', COL.green, COL.greenL]];
    C.forEach(([s, c, f], i) => appear(prog(lt, 5.4 + i * 1.1, .6), () => { shape(roundRectPts(790 + i * 320, 225, 260, 100, 22), { fill: f, w: 4 }); txt(s, 920 + i * 320, 275, 56, { color: c }); }));
    appear(prog(lt, 4.2, .6), () => txt('留給人的三件事', 560, 275, 38, { color: COL.black }));
    // 資料夾 → 按鍵 → 同一個數字
    const mv = ease(prog(lt, 10.6, 1.6)), kp = press(lt, 13.2);
    appear(prog(lt, 9.8, .6), () => folder(lerp(820, 1000, mv), 470, 1, 'README'));
    appear(prog(lt, 12, .5), () => { arrow(1100, 470, 1190, 470, { w: 5, head: 16 }); keycap(1290, 480, .9, kp); });
    appear(prog(lt, 13.8, .6), () => { arrow(1380, 470, 1470, 470, { w: 5, head: 16 }); txt('51.3%', 1620, 470, 76, { color: COL.green }); check(1790, 465, .7, prog(lt, 14.2, .5)); });
    txt('別人按一個鍵，得到同一個數字', 1240, 596, 60, { p: prog(lt, 12.4, 1.4), color: COL.black });
    underline(820, 1660, 642, { p: prog(lt, 14, .6), color: COL.mustardD });
    stick(240, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(440, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(620, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 21.1], [s2, 27.7], [s3, 16.8], [s4, 18.8], [s5, 35.9], [s6, 22.1], [s7, 15.2]];   // 最後一句的 beat ＋ 該句長度
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 16 週　別人按一個鍵，能得到同一個數字嗎', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', '畫面中的重跑情境與資料夾為示意；51.3% 與 57.9% 為同一份資料的兩種分母', '林彥光老師講義〈第 16 週 報告、可重現性與 AI 使用揭露〉'] };
})();
EPISODES['rw16e1'] = RW16E1;
