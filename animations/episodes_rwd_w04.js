// 真實世界運動大數據分析：第 4 週 EP1　讀懂 AI 寫的清理程式
const RW04 = {
  // 課程網站第 4 週工具 nacmp 的 8 列示意資料（模擬，非主資料集）；null = 遺漏
  X: [1, 4, null, 2, -1, 5, null, 3],
  Q: ['讀進幾列、幾欄？和編碼簿一致嗎？', '每一欄的型態對嗎？', '遺漏碼處理了哪些欄位？漏了哪些？', '每一步之後：遺漏值多幾筆？列數少幾列？', '有沒有哪一步，沒有訊息就刪掉資料？'],
  steps: ['讀入', '轉遺漏碼', '文字轉數值', '去除重複', '篩選'],
};

const RW04E1 = (() => {
  const cell = (x, y, w, h, fill, col) => shape(rectPts(x, y, w, h), { fill: fill || COL.white, w: 2.5, smooth: false, color: col || INK });

  // 1 課堂情境：AI 寫好了清理程式
  const s1 = { beats: [0, 8.69, 13.63], draw(lt) {
    ground(lt, 140, 1780);
    txt('AI 寫好了一段清理程式', 960, 150, 56, { p: prog(lt, .3, 1), color: COL.black });
    stick(430, GY, 1.0, { hair: 'pony', la: Math.PI * .1, ra: Math.PI * .05, bob: idle(RLT) * .3 });
    appear(prog(lt, .8, .6), () => { cell(600, 470, 460, 290); shape([[560, 760], [1100, 760], [1140, 800], [520, 800]], { fill: COL.blueL, w: 4, smooth: false }); });
    [300, 380, 250, 340, 200].forEach((w, i) => inkLine(640 + (i % 2) * 30, 520 + i * 40, 640 + (i % 2) * 30 + w, 520 + i * 40, { w: 4, color: COL.gray, p: prog(lt, 1.6 + i * .5, .6) }));
    appear(prog(lt, 5.6, .5), () => { check(1010, 510, .8, 1); txt('執行完成・0 個錯誤', 830, 440, 30, { color: COL.green }); });
    appear(prog(lt, 8.7, .6), () => stick(1500, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat' }));
    const q2 = lt > 11.6;
    bubble(1430, 380, 560, 100, 1470, 490, q2 ? '少做了什麼？' : '它對資料做了什麼？', 42, q2 ? prog(lt, 11.6, .4) : prog(lt, 9, .6));
    noteBox(960, 260, 900, 80, [['不必會寫，但要會審', 44, COL.red]], '#fff8e2', prog(lt, 13.8, .6));
  } };

  // 2 審查五問
  const s2 = { beats: [0, 7.89, 14.17, 23.02], draw(lt) {
    txt('審查五問', 960, 140, 60, { p: prog(lt, .3, 1), color: COL.black });
    const AT = [3.6, 7.9, 10.6, 14.2, 19];
    RW04.Q.forEach((q, i) => { const y = 260 + i * 108, late = i >= 3; appear(prog(lt, AT[i], .6), () => {
      inkEll(250, y, 34, 34, { w: 4, color: late ? COL.red : COL.blue }); txt(String(i + 1), 250, y + 2, 42, { color: late ? COL.red : COL.blue });
      txt(q, 320, y, 42, { align: 'left', color: COL.black });
    }); });
    const k = prog(lt, 23.1, .8);
    if (k > 0) ink([[1210, 560], [1240, 560], [1240, 716], [1210, 716]], { w: 5, color: COL.red, p: k });
    appear(prog(lt, 23.6, .6), () => { txt('答案在', 1275, 608, 40, { align: 'left', color: COL.red }); txt('輸出與紀錄檔', 1275, 668, 40, { align: 'left', color: COL.red }); });
    stick(1700, GY, .9, { hair: 'tuft', la: Math.PI * .7, ra: [-Math.PI * .1, -Math.PI * .6], mouth: lt > 23 ? 'o' : 'flat', bob: idle(RLT) * .3 });
  } };

  // 3 陷阱一：x < 3 在三種語言留下的列數
  const s3 = { beats: [0, 9.33, 16.58, 26.94], draw(lt) {
    txt('陷阱一　遺漏值的比較', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    txt('條件：x < 3', 760, 130, 48, { p: prog(lt, 6.6, .6), color: COL.red, align: 'left' });
    const X0 = 150, Y0 = 250, RH = 62;
    appear(prog(lt, .6, .5), () => { txt('列', X0 + 45, Y0 - 30, 30, { color: COL.gray }); txt('x', X0 + 165, Y0 - 30, 34, { color: COL.gray }); });
    RW04.X.forEach((v, i) => appear(prog(lt, .8 + i * .22, .4), () => {
      const y = Y0 + i * RH, miss = v === null, hl = miss && lt > 4.3;
      cell(X0, y, 90, RH - 8); txt(String(i + 1), X0 + 45, y + RH / 2 - 3, 30, { color: COL.gray });
      cell(X0 + 90, y, 150, RH - 8, hl ? COL.pinkL : COL.white, hl ? COL.red : INK); txt(miss ? '遺漏' : String(v), X0 + 165, y + RH / 2 - 3, miss ? 30 : 36, { color: hl ? COL.red : COL.black });
    }));
    txt('8 列示意資料（模擬）', X0 + 120, 782, 30, { p: prog(lt, 2.4, .6), color: COL.gray });
    // 三種語言
    const L = [['SAS', 'if x < 3;', 620, 9.5, 14.3, 5, '成立・保留'], ['R', 'filter(d, x < 3)', 900, 16.8, 21.6, 3, 'NA・丟掉'], ['pandas', 'd[d.x < 3]', 1180, 23.6, 25.2, 3, 'False・丟掉']];
    L.forEach(([name, code, cx, t0, t1, n, mtxt], li) => {
      const step = li === 2 ? .12 : .35;
      appear(prog(lt, t0, .5), () => { txt(name, cx, Y0 - 62, 40, { color: COL.black }); txt(code, cx, Y0 - 22, 26, { color: COL.gray, jit: .5 }); });
      RW04.X.forEach((v, i) => appear(prog(lt, t0 + .5 + i * step, .35), () => {
        const y = Y0 + i * RH, miss = v === null, keep = miss ? li === 0 : v < 3;
        cell(cx - 120, y, 240, RH - 8, miss ? COL.pinkL : keep ? COL.greenL : COL.white, miss ? COL.red : INK);
        txt(miss ? mtxt : keep ? '保留' : '丟掉', cx, y + RH / 2 - 3, 30, { color: miss ? COL.red : keep ? COL.green : COL.gray });
      }));
      appear(prog(lt, t1, .6), () => txt('留下 ' + n + ' 列', cx, 800, 52, { color: n === 5 ? COL.red : COL.blue }));
    });
    noteBox(1630, 400, 400, 210, [['SAS 翻成 R', 40, COL.black], ['條件相同', 34, COL.gray], ['5 列 → 3 列', 48, COL.red]], '#fff8e2', prog(lt, 27.2, .7));
    appear(prog(lt, 27, .6), () => stick(1630, GY, .85, { hair: 'pony', mouth: 'o', la: Math.PI * .75, ra: [-Math.PI * .2, -Math.PI * .65], bob: idle(RLT) * .3 }));
  } };

  // 4 陷阱二：文字轉數值失敗不會停下來
  const s4 = { beats: [0, 8.69, 20.1], draw(lt) {
    txt('陷阱二　文字轉數值：失敗不會停下來', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    txt('temp1 = input(b9_1b, best32.);', 120, 230, 36, { align: 'left', color: COL.black, p: prog(lt, .8, 1), jit: .5 });
    const C = [['"2"', '2'], ['"三次"', null], ['"5"', '5'], ['"不一定"', null]], Y0 = 330, RH = 84;
    appear(prog(lt, 1.6, .5), () => { txt('文字', 290, Y0 - 32, 30, { color: COL.gray }); txt('數值', 690, Y0 - 32, 30, { color: COL.gray }); });
    C.forEach(([a, b], i) => {
      const y = Y0 + i * RH, kk = prog(lt, 3.2 + i * .7, .6);
      appear(prog(lt, 1.8 + i * .25, .4), () => { cell(170, y, 240, RH - 10); txt(a, 290, y + RH / 2 - 4, 36, { color: COL.black }); });
      if (kk > 0) arrow(425, y + RH / 2 - 5, 575, y + RH / 2 - 5, { w: 3.5, head: 12, p: kk, color: b ? INK : COL.red });
      appear(kk, () => { cell(590, y, 200, RH - 10, b ? COL.white : COL.pinkL, b ? INK : COL.red); txt(b || '遺漏', 690, y + RH / 2 - 4, b ? 36 : 32, { color: b ? COL.black : COL.red }); });
    });
    txt('（示意內容）', 480, Y0 + 4 * RH + 22, 26, { p: prog(lt, 2.6, .5), color: COL.gray });
    const R = [['SAS', 'input(…, best32.)', '紀錄檔一行 NOTE', COL.blue, 11.9], ['R', 'as.numeric()', '一則警告', COL.amber, 15.4], ['pandas', 'to_numeric(errors="coerce")', '完全沒有訊息', COL.red, 17.6]];
    R.forEach(([n, c, m, col, at], i) => appear(prog(lt, at, .6), () => {
      const y = 350 + i * 118;
      txt(n, 940, y, 42, { align: 'left', color: COL.black }); txt(c, 940, y + 42, 24, { align: 'left', color: COL.gray, jit: .5 });
      txt(m, 1300, y, 42, { align: 'left', color: col });
    }));
    appear(prog(lt, 9, .6), () => stick(1740, GY, .8, { hair: 'tuft', mouth: lt > 17.6 ? 'o' : 'flat', la: Math.PI * .7, ra: Math.PI * .3, bob: idle(RLT) * .3 }));
    noteBox(880, 800, 1160, 90, [['轉換前　遺漏數 = ？　→　轉換後　遺漏數 = ？', 42, COL.black]], '#fff8e2', prog(lt, 20.3, .7));
  } };

  // 5 陷阱三：nodupkey 留下哪一筆
  const s5 = { beats: [0, 8.18, 16.7], draw(lt) {
    txt('陷阱三　去重：留下哪一筆', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const code = 'proc sort data=readin nodupkey; by id; run;', pre = 'proc sort data=readin ';
    txt(code, 120, 230, 36, { align: 'left', color: COL.black, p: prog(lt, .8, 1.2), jit: .5 });
    const ux = 120 + measure(pre, 36), uw = measure('nodupkey', 36);
    if (lt > 2.6) underline(ux, ux + uw, 258, { p: prog(lt, 2.6, .5), color: COL.red });
    appear(prog(lt, 3.4, .6), () => txt('只比對 id', ux + uw / 2, 300, 34, { color: COL.red }));
    const row = (x, y, a, b, c, o = {}) => {
      cell(x, y, 150, 84, o.idFill); txt(a, x + 75, y + 40, 44, { color: o.idCol || COL.black });
      cell(x + 150, y, 260, 84); txt(b, x + 280, y + 40, 44, { color: COL.black });
      cell(x + 410, y, 200, 84, o.scFill); txt(c, x + 510, y + 40, 46, { color: o.scCol || COL.black });
    };
    const head = x => { txt('id', x + 75, 372, 34, { color: COL.gray }); txt('name', x + 280, 372, 34, { color: COL.gray }); txt('score', x + 510, 372, 34, { color: COL.gray }); };
    const same = lt > 5.8;
    appear(prog(lt, 4.6, .6), () => { head(150); row(150, 406, '1', 'David', '45', { idFill: same ? COL.pinkL : null, idCol: same ? COL.red : null }); row(150, 496, '1', 'David', '74', { idFill: same ? COL.pinkL : null, idCol: same ? COL.red : null }); txt('課程範例資料', 455, 624, 30, { color: COL.gray }); });
    const k = prog(lt, 13.6, .8);
    if (k > 0) arrow(790, 492, 960, 492, { w: 5, head: 18, p: k });
    appear(prog(lt, 13.2, .5), () => txt('nodupkey', 875, 452, 32, { color: COL.red }));
    appear(prog(lt, 14.2, .7), () => { head(1000); row(1000, 450, '1', 'David', '？', { scFill: COL.pinkL, scCol: COL.red }); txt('只剩一筆：排序後的第一筆', 1305, 590, 40, { color: COL.red }); txt('另一筆被刪除，即使分數不同', 1305, 648, 34, { color: COL.black }); });
    noteBox(960, 790, 940, 90, [['刪除之前，先列出重複的紀錄', 44, COL.blue]], '#fff8e2', prog(lt, 16.9, .7));
  } };

  // 6 做法：每一步前後數遺漏數與列數
  const s6 = { beats: [0, 4.4, 11.24], draw(lt) {
    txt('每一步的前後，各數兩個數字', 960, 140, 58, { p: prog(lt, 4.5, .9), color: COL.black });
    ['陷阱一', '陷阱二', '陷阱三'].forEach((t, i) => { const k = prog(lt, .4 + i * .7, .5), y = 330 + i * 120; appear(k, () => { txt(t, 170, y, 40, { color: COL.black }); check(300, y, .6, clamp((lt - .8 - i * .7) / .4)); }); });
    txt('程式都順利跑完', 210, 690, 32, { p: prog(lt, 2.6, .6), color: COL.green });
    const X = 430, Y0 = 300, RH = 88, W = [400, 290, 290];
    appear(prog(lt, 4.6, .6), () => { txt('步驟', X + 200, Y0 - 36, 36, { color: COL.gray }); txt('遺漏數', X + 545, Y0 - 36, 40, { color: COL.red }); txt('列數', X + 835, Y0 - 36, 40, { color: COL.blue }); });
    RW04.steps.forEach((s, i) => appear(prog(lt, 4.8 + i * .25, .5), () => {
      const y = Y0 + i * RH, d1 = clamp((lt - 6.2 - i * .45) / .4), d2 = clamp((lt - 8.6 - i * .45) / .4);
      cell(X, y, W[0], RH - 10); txt(s, X + 200, y + RH / 2 - 5, 38, { color: COL.black });
      cell(X + 400, y, W[1], RH - 10, d1 > 0 ? '#fdeeee' : COL.white); cell(X + 690, y, W[2], RH - 10, d2 > 0 ? '#eef3fd' : COL.white);
      if (d1 > 0) { txt('前　後', X + 500, y + RH / 2 - 5, 30, { color: COL.gray }); check(X + 630, y + RH / 2 - 5, .5, d1); } else txt('？', X + 545, y + RH / 2 - 5, 36, { color: COL.gray });
      if (d2 > 0) { txt('前　後', X + 790, y + RH / 2 - 5, 30, { color: COL.gray }); check(X + 920, y + RH / 2 - 5, .5, d2); } else txt('？', X + 835, y + RH / 2 - 5, 36, { color: COL.gray });
    }));
    noteBox(1660, 400, 380, 210, [['請 AI 印出', 40, COL.blue], ['每一步的', 34, COL.black], ['遺漏數與列數', 34, COL.black]], '#fff8e2', prog(lt, 11.4, .7));
    noteBox(1660, 650, 380, 150, [['讀紀錄檔', 40, COL.red], ['NOTE・WARNING', 30, COL.black]], '#fff8e2', prog(lt, 14.2, .7));
  } };

  // 7 結語
  const s7 = { beats: [0, 2.29], draw(lt) {
    ground(lt, 140, 1780);
    txt('不必會寫，但要會審', 960, 200, 92, { p: prog(lt, .2, .9), color: COL.black });
    underline(540, 1380, 268, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    appear(prog(lt, 2.4, .7), () => {
      txt('步驟前', 620, 365, 34, { color: COL.gray }); txt('步驟後', 1300, 365, 34, { color: COL.gray });
      noteBox(620, 480, 340, 150, [['遺漏數', 44, COL.red], ['列數', 44, COL.blue]], '#fff8e2', 1);
      noteBox(1300, 480, 340, 150, [['遺漏數', 44, COL.red], ['列數', 44, COL.blue]], '#fff8e2', 1);
      arrow(820, 480, 1100, 480, { w: 5, head: 18, p: prog(lt, 3, .8) }); txt('每一步', 960, 440, 34, { color: COL.black });
    });
    stick(300, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(500, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(680, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 17], [s2, 27], [s3, 35.5], [s4, 24], [s5, 20], [s6, 17.5], [s7, 6.2]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 4 週　讀懂 AI 寫的清理程式', scenes,
    sources: ['資料來源', '課程網站第 4 週互動工具「遺漏值的比較」：8 列示意資料（模擬，非主資料集）', '去重範例（ID 1 的 45 分與 74 分兩筆）：講義所附課程範例資料', '林彥光老師講義〈第 4 週 讀懂 AI 寫的程式（一）：讀入與清理〉'] };
})();
EPISODES['rw04e1'] = RW04E1;
