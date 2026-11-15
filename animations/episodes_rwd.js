// 真實世界運動大數據分析：火柴人版角色與第 6 週 EP1
// ---------- stick figure ----------
// o: la / ra = arm angle in radians (0 = pointing right, PI/2 = down) or [upper, fore]; hair: 'tuft' | 'pony' | 'cap'; glasses; mouth: 'smile' | 'flat' | 'o'; bob
function stick(x, y, s = 1, o = {}) {
  const bob = o.bob || 0, r = 36 * s, hy = y - 196 * s + bob;
  const neck = [x, hy + r], sh = [x, hy + r + 16 * s], hip = [x, y - 80 * s + bob];
  const seg = (p, ang, len) => [p[0] + Math.cos(ang) * len, p[1] + Math.sin(ang) * len];
  const arm = (a, dflt) => { const A = a === undefined ? dflt : a; const [a1, a2] = Array.isArray(A) ? A : [A, A]; const el = seg(sh, a1, 44 * s); return [sh, el, seg(el, a2, 42 * s)]; };
  inkLine(hip[0], hip[1], x - 30 * s, y, { w: 6 }); inkLine(hip[0], hip[1], x + 30 * s, y, { w: 6 });
  inkLine(neck[0], neck[1], hip[0], hip[1], { w: 6 });
  ink(arm(o.la, Math.PI * .68), { w: 5.5 }); ink(arm(o.ra, Math.PI * .32), { w: 5.5 });
  shape(ellPts(x, hy, r, r * 1.04, 0, Math.PI * 2, 24), { fill: o.fill || COL.white, w: 5 });
  ctx.save(); ctx.fillStyle = INK; ctx.globalAlpha = ALPHA; ctx.beginPath(); ctx.arc(x - 12 * s, hy - 4 * s, 3.6 * s, 0, 7); ctx.arc(x + 12 * s, hy - 4 * s, 3.6 * s, 0, 7); ctx.fill(); ctx.restore();
  const m = o.mouth || 'smile';
  if (m === 'smile') ink([[x - 12 * s, hy + 12 * s], [x, hy + 19 * s], [x + 12 * s, hy + 12 * s]], { w: 3.5 });
  else if (m === 'flat') inkLine(x - 10 * s, hy + 15 * s, x + 10 * s, hy + 15 * s, { w: 3.5 });
  else inkEll(x, hy + 15 * s, 6 * s, 7 * s, { w: 3 });
  if (o.glasses) { inkEll(x - 12 * s, hy - 4 * s, 10 * s, 9 * s, { w: 2.6 }); inkEll(x + 12 * s, hy - 4 * s, 10 * s, 9 * s, { w: 2.6 }); inkLine(x - 2 * s, hy - 4 * s, x + 2 * s, hy - 4 * s, { w: 2.6 }); }
  if (o.hair === 'tuft') [-10, 0, 10].forEach(d => inkLine(x + d * s, hy - r, x + d * 1.8 * s, hy - r - 16 * s, { w: 3.5 }));
  if (o.hair === 'pony') ink([[x + r * .7, hy - r * .6], [x + r * 1.5, hy - r * .2], [x + r * 1.35, hy + r * .9]], { w: 5 });
  if (o.hair === 'cap') { shape([[x - 46 * s, hy - r - 2 * s], [x, hy - r - 20 * s], [x + 46 * s, hy - r - 2 * s], [x, hy - r + 12 * s]], { fill: COL.black, w: 3, smooth: false }); inkLine(x + 30 * s, hy - r, x + 34 * s, hy - r + 30 * s, { w: 3, color: COL.mustardD }); }
}
const waveArm = t => [-Math.PI * .3, -Math.PI * .5 + Math.sin(t * 5) * .25];

const RW6 = {
  N: 37822, c2: 4053, noAns: 3953, k: 19386, nC: 33499,
  // 都市化層級：人數、規律運動人數、比例（survey4 重算）
  lv: [[3925, 1845, 47.0], [3600, 1847, 51.3], [15268, 7968, 52.2], [6698, 3643, 54.4], [2196, 1147, 52.2], [2080, 1138, 54.7]],
  map: { 1: [1], 2: [18, 19, 20], 3: [3, 4, 5, 7, 10, 17, 21], 4: [8, 9, 12, 13, 14, 22], 5: [6, 11], 6: [15, 16] },
  code: ['if county=1 then urban=1;', 'else if county in (18,1,19,20) then urban=2;', 'else if county in (7,3,10,4,5,17,21) then urban=3;', 'else if county in (8,9,13,12,14,22) then urban=4;', 'else if county in (6,11) then urban=5;', 'else if county in (16,15) then urban=6;'],
};
const fmtN = n => n.toLocaleString('en-US');

const RW6E1 = (() => {
  // 1 開場故事：Reinhart–Rogoff 與研究生赫恩登
  const s1 = { beats: [0, 12, 20, 31.5], draw(lt) {
    txt('2010｜哈佛大學', 420, 150, 40, { p: prog(lt, .3, .8), color: COL.gray });
    appear(prog(lt, 1.2, .8), () => { paperSheet(420, 430, 520, 400, -.02); txt('政府債務 > GDP 90%', 420, 310, 38, { color: COL.black }); txt('平均經濟成長', 420, 370, 34, { color: COL.gray }); });
    const fix = prog(lt, 27, 1.2);
    appear(prog(lt, 5, .8) * (1 - fix), () => txt('−0.1%', 420, 490, 120, { color: COL.red }));
    appear(fix, () => { txt('2.2%', 420, 490, 120, { color: COL.green }); txt('（全部更正後）', 420, 580, 28, { color: COL.gray }); });
    // 研究生
    const k2 = prog(lt, 12, .8);
    appear(k2, () => { txt('2013｜麻州大學', 960, 150, 40, { color: COL.gray }); stick(960, GY, 1.15, { hair: 'cap', mouth: lt < 20 ? 'flat' : 'smile', la: [Math.PI * .75, Math.PI * .2], ra: lt < 20 ? [-Math.PI * .25, -Math.PI * .75] : Math.PI * .1, bob: idle(RLT) * .4 }); });
    appear(prog(lt, 14.5, .6) * (1 - prog(lt, 20, .5)), () => bubble(960, 330, 420, 90, 960, 420, '算不出來……', 40, 1));
    // 試算表：20 列，公式只框到 15 列
    const k3 = prog(lt, 20, 1.2), X = 1380, Y0 = 190, RH = 30;
    appear(k3, () => {
      txt('原始試算表', X + 150, 150, 36, { color: COL.black });
      for (let i = 0; i < 20; i++) { const miss = i >= 15; shape(rectPts(X, Y0 + i * RH, 300, RH), { fill: miss && lt > 23 ? COL.pinkL : COL.white, w: 2, smooth: false }); inkLine(X + 150, Y0 + i * RH, X + 150, Y0 + (i + 1) * RH, { w: 1.5, alpha: .5 }); }
    });
    const k4 = prog(lt, 22.5, 1);
    if (k4 > 0) { ink([[X - 26, Y0 + 2], [X - 44, Y0 + 2], [X - 44, Y0 + 15 * RH - 2], [X - 26, Y0 + 15 * RH - 2]], { w: 5, color: COL.blue, p: k4 }); txt('平均的範圍', X - 60, Y0 + 7.5 * RH, 28, { align: 'right', color: COL.blue, p: k4 }); }
    appear(prog(lt, 24, .7), () => { txt('少框 5 個國家', X + 150, Y0 + 20 * RH + 40, 36, { color: COL.red }); arrow(X + 150, Y0 + 20 * RH + 14, X + 150, Y0 + 18 * RH, { w: 4, head: 14, color: COL.red }); });
    noteBox(700, 800, 900, 90, [['試算表沒有跳出任何錯誤訊息', 44, COL.black]], '#fff8e2', prog(lt, 31.6, .7));
  } };

  // 2 回到課堂
  const s2 = { beats: [0, 7.5, 11.5], draw(lt) {
    ground(lt, 140, 1780);
    txt('都市化程度 × 學生規律運動', 960, 150, 56, { p: prog(lt, .3, 1), color: COL.black });
    stick(430, GY, 1.0, { hair: 'tuft', la: Math.PI * .1, ra: Math.PI * .05, bob: idle(RLT) * .3 });
    // 筆電
    appear(prog(lt, 1, .6), () => { shape(rectPts(600, 470, 460, 290), { fill: COL.white, w: 4, smooth: false }); shape([[560, 760], [1100, 760], [1140, 800], [520, 800]], { fill: COL.blueL, w: 4, smooth: false }); });
    const kb = prog(lt, 3, 2.5);
    [.5, .8, .6, .9, .7, .75].forEach((h, i) => { const kk = clamp(kb * 6 - i); if (kk > 0) bar(660 + i * 62, 720, 40, h * 170 * kk, COL.blueL); });
    appear(prog(lt, 7.6, .5), () => { check(1010, 510, .8, 1); txt('執行完成・0 個錯誤', 830, 440, 30, { color: COL.green }); });
    const k3 = prog(lt, 11.5, .6);
    appear(k3, () => stick(1500, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat' }));
    bubble(1430, 360, 560, 100, 1470, 470, '你怎麼知道它是對的？', 42, prog(lt, 11.8, .6));
    noteBox(960, 250, 900, 80, [['三個不會讓程式停下來的錯誤', 40, COL.red]], '#fff8e2', prog(lt, 15, .6));
  } };

  // 3 案例一：消失的縣市
  const s3 = { beats: [0, 6.5, 11.5, 24.5], draw(lt) {
    txt('案例一　都市化分層', 300, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    RW6.code.forEach((l, i) => txt(l, 80, 230 + i * 56, 31, { align: 'left', color: COL.black, p: prog(lt, .8 + i * .5, .9), jit: .5 }));
    // 圈出兩個 1；指出沒有 2
    const kc = prog(lt, 6.8, .8);
    if (kc > 0) { inkEll(249, 230, 22, 26, { w: 4.5, color: COL.red, p: kc }); inkEll(383, 286, 22, 26, { w: 4.5, color: COL.red, p: kc }); }
    appear(prog(lt, 9, .6), () => txt('代碼 2 在哪裡？', 500, 590, 40, { color: COL.red }));
    // 22 個縣市落入六個籃子
    const BX = i => 1010 + i * 140, BY = 640;
    for (let u = 1; u <= 6; u++) appear(prog(lt, 1.5 + u * .25, .5), () => { ink([[BX(u - 1) - 56, BY - 150], [BX(u - 1) - 56, BY], [BX(u - 1) + 56, BY], [BX(u - 1) + 56, BY - 150]], { w: 4 }); txt('第 ' + u + ' 層', BX(u - 1), BY + 34, 26, { color: COL.gray }); });
    const drop = prog(lt, 3, 3);
    let idx = 0;
    for (let u = 1; u <= 6; u++) RW6.map[u].forEach((c, j) => {
      const sx = 990 + (idx % 11) * 72, sy = 190 + Math.floor(idx / 11) * 62; idx++;
      const tx = BX(u - 1) - 28 + (j % 2) * 56, ty = BY - 24 - Math.floor(j / 2) * 34;
      const kk = ease(clamp(drop * 1.6 - idx * .025));
      const x = lerp(sx, tx, kk), y = lerp(sy, ty, kk);
      shape(rectPts(x - 24, y - 15, 48, 30), { fill: COL.blueL, w: 2.2, smooth: false }); txt(String(c), x, y + 1, 22, { color: COL.black, jit: .4 });
    });
    // 代碼 2：沒有籃子接
    const k2 = ease(prog(lt, 11.5, 1.6));
    appear(prog(lt, 2, .5), () => { const x = lerp(1710, 1150, k2), y = lerp(252, 760, k2); shape(rectPts(x - 30, y - 19, 60, 38), { fill: lt > 9 ? COL.pinkL : COL.blueL, w: 3, smooth: false, color: lt > 9 ? COL.red : INK }); txt('2', x, y + 1, 28, { color: lt > 9 ? COL.red : COL.black }); });
    appear(prog(lt, 13.5, .7), () => { txt('4,053 人', 1420, 745, 60, { color: COL.red }); txt('沒有被分到任何一層', 1420, 805, 32, { color: COL.red }); });
    appear(prog(lt, 16.5, .7), () => txt('全體 37,822 人', 1560, 130, 34, { color: COL.gray }));
    noteBox(480, 770, 780, 130, [['檢查：縣市 × 分層 的交叉表', 36, COL.blue], ['包含遺漏（/ missing）', 32, COL.black]], '#fff8e2', prog(lt, 24.6, .7));
  } };

  // 4 案例二：else 把沒回答的人算成不運動
  const s4 = { beats: [0, 10, 18, 24.5], draw(lt) {
    txt('案例二　else 把沒回答的人記成 0', 440, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1.2, .8), () => { txt('if 天數達標 and 會流汗會喘 then regular = 1;', 120, 240, 36, { align: 'left', color: COL.black, jit: .5 }); txt('else regular = 0;', 120, 300, 36, { align: 'left', color: lt > 7 ? COL.red : COL.black, jit: .5 }); });
    if (lt > 7) underline(120, 420, 326, { p: prog(lt, 7, .5), color: COL.red });
    // 一條人數長條：規律 / 不規律 / 沒回答
    const X0 = 160, WID = 1600, Y = 470, HH = 120, tot = RW6.N, na = tot - RW6.nC, irr = RW6.nC - RW6.k;
    const w1 = WID * RW6.k / tot, w2 = WID * irr / tot, w3 = WID * na / tot;
    const kb = prog(lt, 3, 1.5), out = ease(prog(lt, 24.5, 1.5));
    appear(kb, () => {
      shape(rectPts(X0, Y, w1, HH), { fill: COL.greenL, w: 4, smooth: false }); txt('規律運動 ' + fmtN(RW6.k), X0 + w1 / 2, Y + HH / 2, 36, { color: COL.black });
      shape(rectPts(X0 + w1, Y, w2, HH), { fill: '#f1d9d2', w: 4, smooth: false }); txt('不規律 ' + fmtN(irr), X0 + w1 + w2 / 2, Y + HH / 2, 36, { color: COL.black });
      const y3 = Y + out * 130;
      shape(rectPts(X0 + w1 + w2, y3, w3, HH), { fill: lt > 10 && out < 1 ? COL.pinkL : (out >= 1 ? COL.white : '#f1d9d2'), w: 4, smooth: false, color: lt > 10 ? COL.red : INK });
      if (lt > 10) txt('沒回答', X0 + w1 + w2 + w3 / 2, y3 + HH / 2, 30, { color: COL.red });
    });
    appear(prog(lt, 10.5, .7) * (1 - prog(lt, 24, .5)), () => { txt('3,953 人沒有回答運動強度', 1420, 400, 34, { color: COL.red }); arrow(1620, 420, 1680, 462, { w: 4, head: 14, color: COL.red }); });
    // 兩種分母
    appear(prog(lt, 18.2, .7), () => { txt('分母 = 全體 37,822', 520, 720, 36, { color: COL.gray }); txt('51.3%', 520, 810, 96, { color: out > .5 ? COL.gray : COL.red }); });
    appear(prog(lt, 25.5, .7), () => { txt('分母 = 完整作答 33,499', 1240, 720, 36, { color: COL.gray }); txt('57.9%', 1240, 810, 96, { color: COL.green }); });
    appear(prog(lt, 30, .6), () => { arrow(700, 810, 1040, 810, { w: 4, head: 16 }); txt('差 6.6 個百分點', 870, 770, 30, { color: COL.black }); });
  } };

  // 5 案例三：軸寫百分比，畫的是人數
  const s5 = { beats: [0, 10.5, 19], draw(lt) {
    txt('案例三　軸寫百分比，畫的是人數', 440, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const BASE = 800, X = i => 500 + i * 165, m = ease(prog(lt, 19, 2));
    axis(380, 1420, BASE, { p: prog(lt, .6, .5) }); arrow(400, BASE + 10, 400, 230, { w: 4, head: 16, p: prog(lt, .6, .5) });
    txt('規律運動百分比 (%)', 400, 200, 30, { color: lt > 9.5 && m < .5 ? COL.red : COL.gray, p: prog(lt, 1, .6), align: 'left' });
    const kb = prog(lt, 2, 2.5);
    RW6.lv.forEach(([n, k, pct], i) => {
      const hc = k / 7968 * 500, hp = (pct - 40) / 16 * 500, h = lerp(hc, hp, m) * clamp(kb * 6 - i * .6);
      const top = i === 2 && m < .5 || i === 5 && m >= .5;
      bar(X(i), BASE, 104, h, top ? COL.mustard : COL.blueL);
      txt('第 ' + (i + 1) + ' 層', X(i), BASE + 40, 28, { color: COL.gray, p: prog(lt, 1.2, .5) });
      if (kb >= 1) txt(m < .5 ? fmtN(k) : pct.toFixed(1) + '%', X(i), BASE - h - 30, 34, { color: top ? COL.red : COL.black });
    });
    const kc = prog(lt, 6.5, .8) * (1 - prog(lt, 18.5, .5));
    if (kc > 0) appear(clamp(kc * 3), () => inkEll(X(2), BASE - 530, 96, 40, { w: 5, color: COL.red, p: prog(lt, 6.5, .8) }));
    appear(prog(lt, 11, .7) * (1 - prog(lt, 18.5, .5)), () => noteBox(1650, 330, 470, 150, [['畫的是人數（加總）', 36, COL.red], ['第 3 層有 15,268 人', 32, COL.black]], '#fff8e2', 1));
    appear(prog(lt, 21.5, .7), () => noteBox(1650, 330, 470, 150, [['stat = mean 才是比例', 36, COL.green], ['縱軸改從 40% 起算', 28, COL.gray]], '#fff8e2', 1));
    stick(210, GY, .9, { hair: 'pony', ra: [-Math.PI * .15, -Math.PI * .1], mouth: m < .5 ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 6 三個檢查
  const s6 = { beats: [0, 9.5, 16], draw(lt) {
    txt('每次拿到結果，做三個檢查', 960, 140, 60, { p: prog(lt, .3, 1), color: COL.black });
    const C = [[420, '交叉表', '衍生變項 × 原始變項', '包含遺漏', COL.blue, 3.5], [960, '列數帳', '讀入 → 每一步 → 分析', '各剩多少人', COL.green, 9.6], [1500, '手算一格', '圖上的數字', '和表格對一次', COL.red, 16.1]];
    C.forEach(([x, t, a, b, col, at], i) => { const k = prog(lt, at, .8); appear(k, () => {
      shape(roundRectPts(x - 230, 270, 460, 400, 24), { fill: '#fffdf6', w: 4 });
      txt(String(i + 1), x - 170, 340, 64, { color: col }); txt(t, x + 20, 340, 52, { color: col });
      txt(a, x, 470, 32, { color: COL.black }); txt(b, x, 530, 32, { color: COL.black });
      check(x, 615, .7, clamp((lt - at - .8) / .5));
    }); });
    stick(960, GY + 30, .7, { hair: 'tuft', la: waveArm(RLT + 1), ra: Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 7 結語
  const s7 = { beats: [0, 3], draw(lt) {
    ground(lt, 140, 1780);
    txt('沒有錯誤訊息 ≠ 正確', 960, 200, 92, { p: prog(lt, .2, .9), color: COL.black });
    underline(520, 1400, 268, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    const k = prog(lt, 3, .8);
    appear(k, () => {
      txt('資料', 620, 470, 48, { color: COL.gray }); txt('數字', 1300, 470, 48, { color: COL.red });
      ink([[690, 455], [960, 370], [1230, 455]], { w: 5, color: COL.blue, p: prog(lt, 3.3, .8) }); ink([[690, 485], [960, 570], [1230, 485]], { w: 5, color: COL.green, p: prog(lt, 4.2, .8) });
      txt('第一條路徑', 960, 345, 28, { color: COL.blue, p: prog(lt, 3.6, .5) }); txt('第二條路徑', 960, 600, 28, { color: COL.green, p: prog(lt, 4.5, .5) });
    });
    stick(300, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(1560, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(1740, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 36], [s2, 19], [s3, 32], [s4, 34], [s5, 30], [s6, 22], [s7, 10]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 6 週　沒有錯誤訊息的錯誤', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', 'Herndon, Ash & Pollin (2014). Cambridge Journal of Economics, 38(2), 257–279', '林彥光老師講義〈第 6 週 驗證與除錯〉'] };
})();
EPISODES['rw6e1'] = RW6E1;
