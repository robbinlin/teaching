// 真實世界運動大數據分析：第 5 週 EP1　合併之後，應該有幾列
const RW05 = {
  N: 37822, NC: 33499, P1: '51.3%', P2: '57.9%', NCOUNTY: 22,
  // 課程網站第 5 週工具 joinrows 的示意資料（模擬，非主資料集）
  L: [['S1', 1], ['S2', 1], ['S3', 2], ['S4', 3], ['S5', 3], ['S6', 4]],
  RU: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
  RM: [[1, 1], [3, 3], [4, 4], [5, 5]],
  ID: ['A21', 'A25', 'A25', 'A25'],
  sql: ['select county,', '       sum(regular = 1) / count(*) as regular_pct', 'from survey4', 'group by county;'],
};

const RW05E1 = (() => {
  const cell = (x, y, w, h, fill, col) => shape(rectPts(x, y, w, h), { fill: fill || COL.white, w: 2.5, smooth: false, color: col || INK });
  const KEYF = '#fff1c2', RH = 58, Y0 = 300, LX = 180, CW = 120;
  const ly = i => Y0 + i * RH + RH / 2 - 4;
  // 左表：學生｜縣市代碼
  const leftTbl = (o = {}) => {
    txt('左表：學生（6 列）', LX + CW, 215, 34, { color: COL.black });
    txt('學生', LX + CW / 2, Y0 - 28, 26, { color: COL.gray }); txt('縣市代碼', LX + CW * 1.5, Y0 - 28, 26, { color: COL.gray });
    RW05.L.forEach(([id, c], i) => { const y = Y0 + i * RH, hl = o.hl && o.hl(i);
      cell(LX, y, CW, RH - 8, hl ? COL.pinkL : COL.white, hl ? COL.red : INK); txt(id, LX + CW / 2, ly(i), 30, { color: hl ? COL.red : COL.black });
      cell(LX + CW, y, CW, RH - 8, hl ? COL.pinkL : o.key ? KEYF : COL.white, hl ? COL.red : INK); txt(String(c), LX + CW * 1.5, ly(i), 32, { color: hl ? COL.red : COL.black }); });
    txt('6 位學生示意資料（模擬）', LX + CW, Y0 + 6 * RH + 30, 28, { color: COL.gray });
  };
  const rightRow = (RX, y, c, u, fill, col) => { cell(RX, y, CW, RH - 8, fill, col); txt(String(c), RX + CW / 2, y + RH / 2 - 4, 32, { color: col || COL.black }); cell(RX + CW, y, CW, RH - 8, fill && fill !== KEYF ? fill : COL.white, col); txt(String(u), RX + CW * 1.5, y + RH / 2 - 4, 32, { color: col || COL.black }); };
  const rightHead = (RX, name) => { txt(name, RX + CW, 215, 34, { color: COL.black }); txt('縣市代碼', RX + CW / 2, Y0 - 28, 26, { color: COL.gray }); txt('分層', RX + CW * 1.5, Y0 - 28, 26, { color: COL.gray }); };

  // 1 課堂情境：先猜列數，再執行
  const s1 = { beats: [0, 9.94, 15.75], draw(lt) {
    ground(lt, 140, 1780);
    txt('合併之後，應該有幾列？', 960, 140, 60, { p: prog(lt, .3, 1), color: COL.black });
    appear(prog(lt, 2.2, .7), () => { paperSheet(700, 500, 400, 280, -.02); txt('學生資料', 700, 420, 40, { color: COL.black }); txt(fmtN(RW05.N) + ' 列', 700, 510, 68, { color: COL.blue }); txt('一列是一位學生', 700, 590, 28, { color: COL.gray }); });
    appear(prog(lt, 6.4, .7), () => { paperSheet(1130, 500, 340, 280, .02); txt('縣市分層表', 1130, 420, 40, { color: COL.black }); txt(RW05.NCOUNTY + ' 列', 1130, 510, 68, { color: COL.green }); txt('一列是一個縣市', 1130, 590, 28, { color: COL.gray }); });
    stick(230, GY, 1.0, { hair: 'pony', la: Math.PI * .7, ra: lt > 12 ? [-Math.PI * .1, -Math.PI * .55] : Math.PI * .3, mouth: lt > 12 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    stick(400, GY, .85, { hair: 'tuft', la: Math.PI * .7, ra: Math.PI * .3, mouth: lt > 12 ? 'flat' : 'smile', bob: idle(RLT, 1) * .3 });
    stick(1620, GY, 1.15, { glasses: true, la: lt > 10 ? [Math.PI * 1.1, Math.PI * 1.25] : Math.PI * .7, ra: Math.PI * .3, mouth: 'smile', bob: idle(RLT) * .3 });
    bubble(1570, 400, 460, 100, 1610, 520, '先不要執行', 44, prog(lt, 10.1, .6));
    appear(prog(lt, 12.6, .7), () => { arrow(915, 660, 915, 720, { w: 5, head: 16 }); txt('合併後　？　列', 915, 775, 60, { color: COL.red }); });
    noteBox(920, 255, 640, 80, [['先猜列數，再執行', 44, COL.red]], '#fff8e2', prog(lt, 15.9, .6));
  } };

  // 2 粒度與鍵
  const s2 = { beats: [0, 9.23, 14.54], draw(lt) {
    txt('粒度：一列代表什麼', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const RX = 1150, key = lt > 9.4;
    appear(prog(lt, .8, .7), () => leftTbl({ key }));
    appear(prog(lt, 1.6, .7), () => { rightHead(RX, '右表：縣市分層（5 列）'); RW05.RU.forEach(([c, u], i) => rightRow(RX, Y0 + i * RH, c, u, key ? KEYF : null)); });
    const k1 = prog(lt, 4.6, .7), k2 = prog(lt, 7, .7);
    if (k1 > 0) { ink([[LX - 14, Y0 + 2], [LX - 30, Y0 + 2], [LX - 30, Y0 + RH - 10], [LX - 14, Y0 + RH - 10]], { w: 5, color: COL.blue, p: k1 }); txt('一列＝一位學生', LX + 2 * CW + 30, ly(0), 36, { align: 'left', color: COL.blue, p: k1 }); }
    if (k2 > 0) { ink([[RX + 2 * CW + 14, Y0 + 2], [RX + 2 * CW + 30, Y0 + 2], [RX + 2 * CW + 30, Y0 + RH - 10], [RX + 2 * CW + 14, Y0 + RH - 10]], { w: 5, color: COL.green, p: k2 }); txt('一列＝一個縣市', RX + 2 * CW + 46, ly(0), 36, { align: 'left', color: COL.green, p: k2 }); }
    appear(prog(lt, 9.5, .7), () => { txt('鍵', 790, 500, 110, { color: COL.red }); txt('縣市代碼', 790, 590, 36, { color: COL.red }); });
    const ka = prog(lt, 10.4, .8);
    if (ka > 0) { arrow(720, 490, LX + 2 * CW + 16, 470, { w: 4.5, head: 16, color: COL.red, p: ka }); arrow(860, 490, RX - 78, 446, { w: 4.5, head: 16, color: COL.red, p: ka }); }
    txt('urban_level |> count(county) |> filter(n > 1)', 180, 780, 34, { align: 'left', color: COL.black, p: prog(lt, 14.8, 1.4), jit: .5 });
    appear(prog(lt, 18.6, .6), () => { arrow(1010, 780, 1090, 780, { w: 4.5, head: 16, color: COL.green }); txt('應回傳 0 列', 1120, 780, 44, { align: 'left', color: COL.green }); check(1400, 775, .7, clamp((lt - 19) / .5)); });
    RW05.RU.forEach((r, i) => { const k = clamp((lt - 15.6 - i * .45) / .4); if (k > 0) check(RX - 40, ly(i), .45, k); });
    stick(1700, GY, .85, { glasses: true, la: [Math.PI * 1.05, Math.PI * 1.2], ra: Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 3 列數規則：合併後列數 = 左表列數
  const s3 = { beats: [0, 8.61, 13.22, 20.95], draw(lt) {
    txt('把縣市的分層，併到每一位學生', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const RX = 760, sh = ease(prog(lt, 13.4, .8)), kd = prog(lt, 14.2, .6);
    const ry = c => Y0 + ((c - 1) + (c >= 4 ? sh : 0)) * RH + RH / 2 - 4, dy = Y0 + 3 * RH;
    appear(prog(lt, .6, .6), () => leftTbl());
    appear(prog(lt, 1.2, .6), () => { rightHead(RX, '右表：縣市分層'); RW05.RU.forEach(([c, u]) => rightRow(RX, ry(c) - RH / 2 + 4, c, u, lt > 14.2 && c === 3 ? COL.pinkL : null, lt > 14.2 && c === 3 ? COL.red : null)); });
    appear(kd, () => { rightRow(RX, dy, 3, 4, COL.pinkL, COL.red); txt('代碼 3 出現兩次', RX + 2 * CW + 24, dy - 6, 32, { align: 'left', color: COL.red }); });
    let n = 0;
    RW05.L.forEach(([id, c], i) => { const k = prog(lt, 2.6 + i * .8, .6); if (k >= 1) n++; if (k > 0) inkLine(LX + 2 * CW + 8, ly(i), RX - 8, ry(c), { w: 3.5, color: COL.blue, p: k }); });
    [3, 4].forEach((i, j) => { const k = prog(lt, 16.3 + j * 1.3, .7); if (k >= 1) n++; if (k > 0) inkLine(LX + 2 * CW + 8, ly(i), RX - 8, dy + RH / 2 - 4, { w: 4, color: COL.red, p: k }); });
    const more = n > 6;
    appear(prog(lt, 2, .6), () => { txt('合併後列數', 1500, 290, 40, { color: COL.gray }); txt(String(n), 1500, 440, 220, { color: more ? COL.red : COL.black }); });
    appear(prog(lt, 8.9, .6), () => { txt(more ? '≠ 左表的 6 列' : '＝ 左表的 6 列', 1500, 610, 46, { color: more ? COL.red : COL.green }); if (more) cross(1500, 690, .7, 1); else check(1500, 690, .7, clamp((lt - 9.4) / .5)); });
    noteBox(960, 795, 900, 90, [['合併後列數 ＝ 左表列數', 44, COL.blue]], '#fff8e2', prog(lt, 9.2, .6) * (1 - prog(lt, 20.4, .4)));
    noteBox(960, 795, 900, 90, [['列數變多 → 右表的鍵不唯一', 44, COL.red]], '#fff8e2', prog(lt, 21.1, .6));
  } };

  // 4 多對多：DATA step MERGE 4 列、SQL 10 列
  const s4 = { beats: [0, 6.93, 15.62, 23.43], draw(lt) {
    txt('多對多：同一個鍵在兩張表都重複', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const TY = 330, TH = 62, hot = lt > 3.2;
    [['alfa', 100], ['beta', 330]].forEach(([name, X], ti) => appear(prog(lt, .8 + ti * .5, .6), () => {
      txt(name, X + 95, 245, 40, { color: COL.black }); txt('id', X + 55, TY - 28, 26, { color: COL.gray });
      RW05.ID.forEach((id, i) => { const y = TY + i * TH, h = hot && i > 0;
        cell(X, y, 110, TH - 8, h ? COL.pinkL : COL.white, h ? COL.red : INK); txt(id, X + 55, y + TH / 2 - 4, 30, { color: h ? COL.red : COL.black });
        cell(X + 110, y, 80, TH - 8); inkLine(X + 128, y + TH / 2 - 4, X + 172, y + TH / 2 - 4, { w: 3, color: COL.gray }); });
    }));
    txt('講義範例', 310, TY + 4 * TH + 26, 28, { p: prog(lt, 1.6, .5), color: COL.gray });
    const kb = prog(lt, 3.4, .7);
    if (kb > 0) { ink([[532, TY + TH + 2], [550, TY + TH + 2], [550, TY + 4 * TH - 10], [532, TY + 4 * TH - 10]], { w: 5, color: COL.red, p: kb }); txt('A25', 566, 455, 36, { align: 'left', color: COL.red, p: kb }); txt('各 3 筆', 566, 505, 36, { align: 'left', color: COL.red, p: kb }); }
    const NY = [340, 440, 510, 580];
    const panel = (cx, t0, name, sub, pairs, tl, step, col) => {
      appear(prog(lt, t0, .6), () => {
        txt(name, cx, 215, 40, { color: COL.black }); txt(sub, cx, 265, 30, { color: COL.gray });
        [-1, 1].forEach(sd => RW05.ID.forEach((id, i) => { cell(cx + sd * 122 - 42, NY[i] - 22, 84, 44, i > 0 ? COL.pinkL : COL.white); txt(id, cx + sd * 122, NY[i], 24, { color: COL.black }); }));
      });
      let n = 0;
      pairs.forEach(([a, b], j) => { const k = prog(lt, tl + j * step, Math.min(.6, step * 1.4)); if (k >= 1) n++; if (k > 0) inkLine(cx - 76, NY[a], cx + 76, NY[b], { w: 3.5, color: col, p: k }); });
      appear(prog(lt, tl, .5), () => txt(n + ' 列', cx, 695, 76, { color: col }));
    };
    panel(980, 7.1, 'DATA step MERGE', '同一鍵內，依序一對一', [[0, 0], [1, 1], [2, 2], [3, 3]], 9.4, .9, COL.blue);
    const sq = [[0, 0]]; for (let a = 1; a < 4; a++) for (let b = 1; b < 4; b++) sq.push([a, b]);
    panel(1500, 15.8, 'PROC SQL', '同一鍵內，兩兩配對', sq, 17.6, .42, COL.red);
    txt('1 + 3×3', 1500, 632, 32, { p: prog(lt, 19.8, .6), color: COL.red });
    noteBox(620, 800, 820, 90, [['兩段程式都沒有錯誤訊息', 44, COL.black]], '#fff8e2', prog(lt, 23.6, .6));
    const kr = prog(lt, 27.6, .8);
    if (kr > 0) { arrow(1100, 695, 1370, 695, { w: 5, head: 18, p: kr }); txt('改寫成 SQL', 1235, 655, 30, { color: COL.black, p: kr }); }
    appear(prog(lt, 23.6, .6), () => stick(1780, GY, .75, { hair: 'tuft', mouth: 'o', la: Math.PI * .7, ra: [-Math.PI * .2, -Math.PI * .65], bob: idle(RLT) * .3 }));
  } };

  // 5 沒對上的列：anti join
  const s5 = { beats: [0, 9.17, 16.5], draw(lt) {
    txt('沒對上的列：anti join', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const RX = 700, idx = { 1: 0, 3: 1, 4: 2, 5: 3 }, lost = lt > 9.3;
    appear(prog(lt, .5, .6), () => leftTbl({ hl: i => lost && i === 2 }));
    appear(prog(lt, 1, .6), () => { rightHead(RX, '右表：少了代碼 2'); RW05.RM.forEach(([c, u], i) => rightRow(RX, Y0 + i * RH, c, u)); });
    let n = 0;
    RW05.L.forEach(([id, c], i) => { const k = prog(lt, 3.6 + i * .45, .5); if (k >= 1) n++;
      if (k <= 0) return;
      if (c in idx) inkLine(LX + 2 * CW + 8, ly(i), RX - 8, Y0 + idx[c] * RH + RH / 2 - 4, { w: 3.5, color: COL.blue, p: k });
      else { inkLine(LX + 2 * CW + 8, ly(i), LX + 2 * CW + 62, ly(i), { w: 4, color: COL.red, p: k }); if (k >= 1) cross(LX + 2 * CW + 84, ly(i), .4, 1); } });
    const PX = 1070;
    appear(prog(lt, 3.4, .5), () => { txt('合併後', PX, 250, 40, { align: 'left', color: COL.gray }); txt(n + ' 列', PX + 150, 250, 64, { align: 'left', color: COL.black }); });
    appear(prog(lt, 6.6, .6), () => { txt('＝ 左表的 6 列', PX + 300, 250, 40, { align: 'left', color: COL.green }); check(PX + 610, 245, .6, clamp((lt - 7) / .5)); });
    appear(prog(lt, 9.6, .6), () => txt('S3 的分層：遺漏', PX, 345, 44, { align: 'left', color: COL.red }));
    txt('anti_join(survey, urban_level, by = "county")', PX, 440, 30, { align: 'left', color: COL.black, p: prog(lt, 12.6, 1.2), jit: .5 });
    appear(prog(lt, 14, .6), () => { cell(PX, 480, CW, RH - 8, COL.pinkL, COL.red); txt('S3', PX + CW / 2, 505, 30, { color: COL.red }); cell(PX + CW, 480, CW, RH - 8, COL.pinkL, COL.red); txt('2', PX + CW * 1.5, 505, 32, { color: COL.red }); txt('沒對上：1 列', PX + 2 * CW + 30, 505, 44, { align: 'left', color: COL.red }); });
    appear(prog(lt, 16.6, .5), () => txt('常見原因', PX, 610, 34, { align: 'left', color: COL.gray }));
    ['代碼表漏列', '文字前後有空白', '數值與文字型態不同'].forEach((s, i) => txt('・' + s, PX, 670 + i * 62, 40, { align: 'left', color: COL.black, p: prog(lt, 17.3 + i * 1.7, .7) }));
    appear(prog(lt, 9.3, .6), () => stick(1740, GY, .8, { hair: 'pony', mouth: lt > 14 ? 'smile' : 'o', la: Math.PI * .7, ra: [-Math.PI * .15, -Math.PI * .6], bob: idle(RLT) * .3 }));
  } };

  // 6 彙總的分母：count(*) 與 count(regular)
  const s6 = { beats: [0, 8.21, 11.22, 25.19], draw(lt) {
    txt('彙總的分母', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    RW05.sql.forEach((l, i) => txt(l, 120, 205 + i * 44, 33, { align: 'left', color: COL.black, p: prog(lt, .8 + i * .5, .8), jit: .5 }));
    const ux = 120 + measure('       sum(regular = 1) / ', 33), uw = measure('count(*)', 33);
    if (lt > 4.4) underline(ux, ux + uw, 273, { p: prog(lt, 4.4, .5), color: COL.red });
    const X0 = 160, WID = 1600, Y = 478, HH = 84, w1 = WID * RW05.NC / RW05.N, w2 = WID - w1, two = lt > 8.2;
    appear(prog(lt, 2.6, .8), () => {
      shape(rectPts(X0, Y, w1, HH), { fill: COL.blueL, w: 4, smooth: false }); txt('有回答', X0 + w1 / 2, Y + HH / 2, 36, { color: COL.black });
      shape(rectPts(X0 + w1, Y, w2, HH), { fill: two ? COL.pinkL : COL.blueL, w: 4, smooth: false, color: two ? COL.red : INK }); txt('沒回答', X0 + w1 + w2 / 2, Y + HH / 2, 32, { color: two ? COL.red : COL.black });
    });
    const k1 = prog(lt, 4.8, .9), k2 = prog(lt, 8.3, .9);
    if (k1 > 0) { ink([[X0, Y + HH + 10], [X0, Y + HH + 28], [X0 + WID, Y + HH + 28], [X0 + WID, Y + HH + 10]], { w: 5, color: COL.red, p: k1 }); txt('count(*)　所有的列', X0 + WID / 2, Y + HH + 62, 38, { color: COL.red, p: k1 }); }
    if (k2 > 0) { ink([[X0, Y - 10], [X0, Y - 28], [X0 + w1, Y - 28], [X0 + w1, Y - 10]], { w: 5, color: COL.blue, p: k2 }); txt('count(regular)　只算有回答的人', X0 + w1 / 2, Y - 58, 38, { color: COL.blue, p: k2 }); }
    appear(prog(lt, 12.4, .7), () => txt('分母 ' + fmtN(RW05.N) + ' 人', 520, 700, 38, { color: COL.red }));
    appear(prog(lt, 16.4, .7), () => txt(RW05.P1, 520, 795, 104, { color: COL.red }));
    appear(prog(lt, 19.6, .7), () => txt('分母 ' + fmtN(RW05.NC) + ' 人', 1300, 700, 38, { color: COL.blue }));
    appear(prog(lt, 22.2, .7), () => txt(RW05.P2, 1300, 795, 104, { color: COL.blue }));
    appear(prog(lt, 12.6, .6), () => { txt('規律運動比例', 910, 775, 34, { color: COL.gray }); txt('（主資料集）', 910, 820, 30, { color: COL.gray }); });
    noteBox(1480, 265, 600, 100, [['分母是誰，寫在規格書裡', 44, COL.black]], '#fff8e2', prog(lt, 25.4, .6));
  } };

  // 7 結語
  const s7 = { beats: [0, 3.81], draw(lt) {
    ground(lt, 140, 1780);
    txt('合併之前，先說出列數', 960, 200, 92, { p: prog(lt, .2, .9), color: COL.black });
    underline(500, 1420, 268, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    const C = [[520, '列數', '等於左表的列數', COL.blue, 3.9], [960, '沒對上的列', 'anti join', COL.red, 5.2], [1400, '分母', '和規格書一致', COL.green, 6.7]];
    C.forEach(([x, a, b, col, at]) => { const k = prog(lt, at, .6); noteBox(x, 440, 400, 160, [[a, 48, col], [b, 32, COL.black]], '#fff8e2', k); if (k > 0) check(x + 150, 375, .55, clamp((lt - at - .5) / .4)); });
    stick(300, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(500, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(680, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 20.6], [s2, 20.4], [s3, 24.5], [s4, 31.6], [s5, 22.6], [s6, 29.3], [s7, 9]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 5 週　合併之後，應該有幾列', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', '6 位學生與縣市對照表：課程網站第 5 週互動工具的示意資料（模擬，非主資料集）', '林彥光老師講義〈第 5 週 讀懂 AI 寫的程式（二）：合併、彙總與 SQL〉'] };
})();
EPISODES['rw05e1'] = RW05E1;
