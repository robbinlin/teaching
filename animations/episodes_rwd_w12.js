// 真實世界運動大數據分析：第 12 週 EP1　分群沒有標準答案
// 散布點與分群結果由課程網站第 12 週工具（gen/widgets_rwd/kmeans.js）的同一套程式產生：模擬資料 150 點，nstart = 1。
const RW12 = (() => {
  const rng = seed => { let s = seed >>> 0; return () => { s += 0x6D2B79F5; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const rnorm = r => { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const mk = kind => { const r = rng(kind === 'three' ? 5 : 9); const P = [];
    if (kind === 'three') [[2.2, 2.6], [6.6, 3.2], [4.3, 7.2]].forEach(c => { for (let i = 0; i < 50; i++) P.push([c[0] + rnorm(r) * .75, c[1] + rnorm(r) * .75]); });
    else for (let i = 0; i < 150; i++) P.push([4.5 + rnorm(r) * 1.6, 4.9 + rnorm(r) * 1.6]);
    return P; };
  const km = (P, k, sd, kind) => { const r = rng(sd * 7919 + k * 31 + (kind === 'three' ? 1 : 2)); const n = P.length; const pick = [];
    while (pick.length < k) { const i = Math.floor(r() * n); if (!pick.includes(i)) pick.push(i); }
    let C = pick.map(i => P[i].slice()); const lab = new Array(n).fill(-1);
    for (let it = 0; it < 80; it++) { let ch = false;
      for (let i = 0; i < n; i++) { let b = 0, bd = 1e18; for (let c = 0; c < k; c++) { const d = (P[i][0] - C[c][0]) ** 2 + (P[i][1] - C[c][1]) ** 2; if (d < bd) { bd = d; b = c; } } if (lab[i] !== b) { lab[i] = b; ch = true; } }
      if (!ch) break; const S = C.map(() => [0, 0, 0]); for (let i = 0; i < n; i++) { const s = S[lab[i]]; s[0] += P[i][0]; s[1] += P[i][1]; s[2]++; }
      C = C.map((c, j) => S[j][2] ? [S[j][0] / S[j][2], S[j][1] / S[j][2]] : c); }
    const ord = C.map((c, j) => j).sort((a, b) => (C[a][0] + C[a][1] * .3) - (C[b][0] + C[b][1] * .3)); const map = []; ord.forEach((j, i) => { map[j] = i; });
    return { lab: lab.map(l => map[l]), C: ord.map(j => C[j]) }; };
  const ari = (a, b) => { const n = a.length, ka = Math.max(...a) + 1, kb = Math.max(...b) + 1; const M = Array.from({ length: ka }, () => new Array(kb).fill(0)); for (let i = 0; i < n; i++) M[a[i]][b[i]]++; const c2 = v => v * (v - 1) / 2;
    let sij = 0, sa = 0, sb = 0; for (let i = 0; i < ka; i++) { let r = 0; for (let j = 0; j < kb; j++) { sij += c2(M[i][j]); r += M[i][j]; } sa += c2(r); } for (let j = 0; j < kb; j++) { let c = 0; for (let i = 0; i < ka; i++) c += M[i][j]; sb += c2(c); }
    const ex = sa * sb / c2(n), mx = (sa + sb) / 2; return mx === ex ? 1 : (sij - ex) / (mx - ex); };
  const three = mk('three'), none = mk('none');
  const T4 = km(three, 3, 4, 'three'), T5 = km(three, 3, 5, 'three');
  const N1 = km(none, 3, 1, 'none'), N2 = km(none, 3, 2, 'none'), N4 = km(none, 3, 4, 'none');
  const N4k = km(none, 4, 1, 'none');
  // 換樣本：隨機抽 80% 重新分群
  const r8 = rng(12), keep = none.map(() => r8() < .8), idx = []; keep.forEach((k, i) => { if (k) idx.push(i); });
  const sub = km(idx.map(i => none[i]), 3, 1, 'none'); const subLab = new Array(none.length).fill(-1); idx.forEach((i, j) => { subLab[i] = sub.lab[j]; });
  let pair = [idx[0], idx[1]];
  search: for (const i of idx) for (const j of idx) { if (j <= i || subLab[i] !== subLab[j]) continue; const d = Math.hypot(none[i][0] - none[j][0], none[i][1] - none[j][1]); if (d > 1.1 && d < 1.5 && Math.abs(none[i][0] - 4.5) < 2 && Math.abs(none[i][1] - 4.9) < 2) { pair = [i, j]; break search; } }
  return { three, none, T4, T5, N1, N2, N4, N4k, subLab, pair,
    ariT: ari(T4.lab, T5.lab), ariN12: ari(N1.lab, N2.lab), ariN24: ari(N2.lab, N4.lab),
    names: ['運動熱衷型', '被動參與型', '社交導向型', '低度參與型'] };
})();

const RW12E1 = (() => {
  const CL = [COL.blue, COL.mustard, COL.pink, COL.green];
  const PX = (g, v) => g.ox + v / 10 * g.w, PY = (g, v) => g.oy + g.h - v / 10 * g.h;
  const dot = (x, y, r, color, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = ALPHA * a; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.lineWidth = Math.max(1, r * .16); ctx.strokeStyle = INK; ctx.stroke(); ctx.restore(); };
  // 同一片散布點：labA 的顏色淡出、labB 的顏色淡入（mix 0→1）；lab 為 null 或 -1 時畫灰色
  const dots = (P, g, labA, labB, mix, o = {}) => P.forEach((p, i) => {
    const x = PX(g, p[0]), y = PY(g, p[1]), r = g.r * (1 + .35 * Math.sin(Math.PI * clamp(mix)) * (labB ? 1 : 0));
    const cA = labA && labA[i] >= 0 ? CL[labA[i]] : '#cfc9bb', cB = labB ? (labB[i] >= 0 ? CL[labB[i]] : '#e6e1d4') : null;
    const fa = o.alpha === undefined ? 1 : o.alpha;
    dot(x, y, r, cA, fa * (cB ? 1 - mix : 1)); if (cB && mix > 0) dot(x, y, r, cB, fa * mix * (labB[i] >= 0 ? 1 : .45));
  });
  const centers = (C, g, k) => C.forEach(c => { const x = PX(g, c[0]), y = PY(g, c[1]), s = g.r * 1.5; appear(k, () => { inkLine(x - s, y - s, x + s, y + s, { w: 5 }); inkLine(x - s, y + s, x + s, y - s, { w: 5 }); }); });
  const frame = g => shape(rectPts(g.ox - 20, g.oy - 20, g.w + 40, g.h + 40), { fill: COL.white, w: 3.5, smooth: false });
  const tag = (x, y, w, h, s, size, col, k) => appear(k, () => { shape(roundRectPts(x - w / 2, y - h / 2, w, h, 16), { fill: '#fffdf6', w: 3.5 }); dot(x - w / 2 + 34, y, 12, col, 1); txt(s, x + 18, y + 1, size, { color: COL.black }); });

  // 1 課堂情境：AI 把學生分成四群，還取了名字
  const s1 = { beats: [0, 5.97, 16.64], draw(lt) {
    ground(lt, 140, 1780);
    txt('「用運動參與的變項，把學生分群」', 960, 150, 52, { p: prog(lt, .4, 1.6), color: COL.black });
    stick(230, GY, 1.0, { hair: 'tuft', la: Math.PI * .1, ra: Math.PI * .05, bob: idle(RLT) * .3 });
    const g = { ox: 420, oy: 430, w: 400, h: 290, r: 5.5 };
    appear(prog(lt, 1, .6), () => { shape(rectPts(380, 410, 480, 330), { fill: COL.white, w: 4, smooth: false }); shape([[340, 740], [900, 740], [940, 780], [300, 780]], { fill: COL.blueL, w: 4, smooth: false });
      dots(RW12.none, g, null, RW12.N4k.lab, ease(prog(lt, 6.2, 1.2))); });
    RW12.names.forEach((n, i) => tag(1100, 330 + i * 100, 360, 76, n, 38, CL[i], prog(lt, 10.8 + i * 1.25, .6)));
    appear(prog(lt, 7, .6), () => txt('AI 交出四群', 1100, 262, 34, { color: COL.gray }));
    appear(prog(lt, 16.6, .6), () => stick(1640, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat' }));
    bubble(1580, 400, 560, 150, 1610, 520, '', 40, prog(lt, 18.2, .6));
    appear(prog(lt, 18.4, .5), () => { txt('資料裡真的有', 1580, 372, 40, { color: COL.black }); txt('這四種學生嗎？', 1580, 428, 40, { color: COL.black }); });
  } };

  // 2 演算法一定會交出結果
  const s2 = { beats: [0, 4.21, 12.26], draw(lt) {
    txt('演算法一定會交出結果', 960, 135, 60, { p: prog(lt, .3, 1), color: COL.black });
    appear(prog(lt, 1, .7), () => { txt('沒有結果變項', 430, 300, 48, { color: COL.black }); txt('沒有標準答案可以對照', 430, 370, 38, { color: COL.gray }); });
    const g = { ox: 900, oy: 250, w: 760, h: 560, r: 10 }, m = ease(prog(lt, 9.3, 1.4));
    appear(prog(lt, 4.3, .8), () => { frame(g); dots(RW12.none, g, null, RW12.N4k.lab, m); txt('只有一團、沒有結構的模擬資料', g.ox + g.w / 2, 205, 32, { color: COL.gray }); });
    centers(RW12.N4k.C, g, prog(lt, 10.4, .6));
    appear(prog(lt, 8.6, .6), () => txt('k-means，k = 4', 430, 500, 44, { color: COL.blue }));
    appear(prog(lt, 10.6, .6), () => txt('照樣切成四群', 430, 570, 48, { color: COL.red }));
    noteBox(430, 750, 620, 150, [['這個分法穩不穩？', 42, COL.black], ['有沒有用？', 42, COL.black]], '#fff8e2', prog(lt, 12.4, .7));
  } };

  // 3 尺度決定結果
  const s3 = { beats: [0, 5.89, 15.7], draw(lt) {
    txt('尺度決定結果', 960, 135, 60, { p: prog(lt, .3, 1), color: COL.black });
    txt('分群靠的是距離：數值範圍大的變項主導結果', 960, 225, 38, { p: prog(lt, 2, 1.6), color: COL.gray });
    const X0 = 240, FULL = 1400, m = ease(prog(lt, 16, 1.6)), kb = ease(prog(lt, 6, 1.4));
    const w1 = lerp(FULL, 620, m) * kb, w2 = lerp(FULL * 4 / 600, 620, m);
    appear(prog(lt, 5.9, .5), () => {
      txt('每週運動分鐘數', X0, 300, 38, { align: 'left', color: COL.black });
      shape(rectPts(X0, 335, Math.max(w1, 4), 70), { fill: COL.blueL, w: 4, smooth: false });
    });
    appear(prog(lt, 7, .5) * (1 - m), () => { txt('0', X0, 435, 32, { color: COL.gray }); txt('600', X0 + FULL, 435, 32, { color: COL.gray }); });
    appear(prog(lt, 9.3, .5), () => {
      txt('五點量表', X0, 500, 38, { align: 'left', color: COL.black });
      shape(rectPts(X0, 535, w2, 70), { fill: COL.pinkL, w: 4, smooth: false, color: COL.pink });
    });
    appear(prog(lt, 10, .5) * (1 - m), () => txt('1 到 5', X0 + 34, 570, 34, { align: 'left', color: COL.pink }));
    appear(prog(lt, 12.2, .6) * (1 - m), () => txt('範圍相差 150 倍：等於只用運動分鐘數分群', 1060, 570, 38, { color: COL.red }));
    appear(prog(lt, 16.6, .7), () => { txt('Z 分數標準化', 1260, 420, 54, { color: COL.green }); txt('兩個變項的範圍可以比較', 1260, 495, 34, { color: COL.gray }); });
    noteBox(880, 760, 860, 90, [['有沒有標準化，規格書要寫明', 42, COL.black]], '#fff8e2', prog(lt, 19.4, .7));
    stick(1640, GY, .95, { glasses: true, la: Math.PI * .75, ra: lt > 15.7 ? [-Math.PI * .2, -Math.PI * .35] : Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 4 選群數：三種指標常給不同答案
  const s4 = { beats: [0, 11.05], draw(lt) {
    txt('要分幾群？沒有單一的正確方法', 960, 135, 58, { p: prog(lt, .3, 1.2), color: COL.black });
    const KX = k => 300 + (k - 2) * 150, AY = 560;
    appear(prog(lt, 1.6, .6), () => { inkLine(220, AY, 1000, AY, { w: 4 }); for (let k = 2; k <= 6; k++) { inkLine(KX(k), AY - 12, KX(k), AY + 12, { w: 4 }); txt(String(k), KX(k), AY + 48, 38, { color: COL.black }); } txt('群數 k', 1010, AY + 48, 30, { align: 'left', color: COL.gray }); txt('示意圖', 230, 250, 28, { align: 'left', color: COL.gray }); });
    [['組內平方和的轉折點', 3, 300, COL.blue, 4.6], ['輪廓係數', 4, 400, COL.amber, 6.3], ['gap 統計量', 5, 300, COL.green, 7.6]].forEach(([s, k, y, col, at]) => {
      const kk = prog(lt, at, .6);
      appear(kk, () => { txt(s, KX(k) + (k === 3 ? -40 : k === 5 ? 60 : 0), y, 34, { color: col }); arrow(KX(k), y + 30, KX(k), AY - 22, { w: 4, head: 14, color: col }); });
    });
    const k2 = prog(lt, 11.2, .7);
    if (k2 > 0) { ink([[KX(3), AY + 86], [KX(3), AY + 104], [KX(5), AY + 104], [KX(5), AY + 86]], { w: 4.5, color: COL.red, p: k2 }); txt('指標建議的範圍（例如 3 到 5 群）', KX(4), AY + 146, 32, { color: COL.red, p: k2 }); }
    [['1', '指標建議的範圍', 11.3], ['2', '哪個群數最穩定', 13.6], ['3', '各群說得清楚、人數不太少', 15.4]].forEach(([n, s, at], i) => appear(prog(lt, at, .6), () => { txt(n, 1180, 300 + i * 95, 52, { color: COL.red }); txt(s, 1230, 300 + i * 95, 40, { align: 'left', color: COL.black }); }));
    stick(1560, GY, .9, { hair: 'pony', la: Math.PI * .7, ra: [-Math.PI * .2, -Math.PI * .6], mouth: lt < 11 ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 5 穩定性：換種子、換樣本（主視覺：同一片散布點，換種子後顏色分界改變）
  const s5 = { beats: [0, 8.6, 13.37, 21.07, 31.76], draw(lt) {
    const sw = prog(lt, 31.4, .6);
    appear(1 - sw, () => txt('穩定性檢查一　換種子', 960, 130, 56, { p: prog(lt, .3, 1), color: COL.black }));
    appear(sw, () => txt('穩定性檢查二　換樣本', 960, 130, 56, { color: COL.black }));
    // 20 個種子
    const cur = lt < 13.4 ? 0 : lt < 17 ? 4 : lt < 21.2 ? 5 : lt < 24.5 ? 1 : lt < 28 ? 2 : 4;
    appear(prog(lt, 2.6, .5) * (1 - sw), () => { txt('種子', 330, 218, 30, { align: 'right', color: COL.gray });
      for (let i = 0; i < 20; i++) { const kk = clamp((lt - 3 - i * .2) / .3); if (kk <= 0) continue; const x = 350 + i * 62; appear(kk, () => { shape(rectPts(x, 194, 52, 48), { fill: i + 1 === cur ? COL.mustard : COL.white, w: 2.5, smooth: false }); txt(String(i + 1), x + 26, 219, 26, { color: COL.black, jit: .3 }); }); } });
    appear(prog(lt, 1.2, .6) * (1 - prog(lt, 12.9, .5)), () => txt('k-means 的起始點是隨機的', 960, 330, 44, { color: COL.gray }));
    // ARI 量尺
    appear(prog(lt, 8.7, .6) * (1 - prog(lt, 12.9, .5)), () => {
      txt('調整蘭德指數（ARI）', 960, 450, 52, { color: COL.blue });
      inkLine(560, 580, 1360, 580, { w: 5 }); inkLine(560, 562, 560, 598, { w: 5 }); inkLine(1360, 562, 1360, 598, { w: 5 }); txt('0', 560, 640, 40, { color: COL.gray }); txt('1', 1360, 640, 40, { color: COL.gray });
      const kk = prog(lt, 10.6, .8); if (kk > 0) { arrow(1330, 500, 1330, 562, { w: 5, head: 16, color: COL.green, p: kk }); txt('各次分法一致：應接近 1', 960, 730, 44, { color: COL.green, p: kk }); }
    });
    // 左：三個分開的群
    const gL = { ox: 170, oy: 330, w: 560, h: 450, r: 8.5 }, gR = { ox: 1190, oy: 330, w: 560, h: 450, r: 8.5 };
    appear(prog(lt, 13.4, .7) * (1 - sw), () => {
      frame(gL); txt('三個分開的群（模擬資料）', gL.ox + gL.w / 2, 285, 32, { color: COL.gray });
      dots(RW12.three, gL, RW12.T4.lab, RW12.T5.lab, ease(prog(lt, 17, 1)));
      centers(lt < 17.5 ? RW12.T4.C : RW12.T5.C, gL, 1);
      txt(lt < 17 ? '種子 4' : '種子 4 → 5', gL.ox + gL.w / 2 - 150, 838, 36, { color: COL.black });
      appear(prog(lt, 18, .5), () => txt('ARI ' + RW12.ariT.toFixed(2), gL.ox + gL.w / 2 + 130, 838, 50, { color: COL.green }));
    });
    // 右：只有一團
    const m2 = ease(prog(lt, 24.5, 1)), m3 = ease(prog(lt, 28, 1)), ms = ease(prog(lt, 33.2, 1.2));
    appear(prog(lt, 21.2, .7), () => {
      frame(gR); txt('只有一團（模擬資料）', gR.ox + gR.w / 2, 285, 32, { color: COL.gray });
      if (ms > 0) dots(RW12.none, gR, RW12.N4.lab, RW12.subLab, ms);
      else if (m3 > 0) dots(RW12.none, gR, RW12.N2.lab, RW12.N4.lab, m3);
      else dots(RW12.none, gR, RW12.N1.lab, RW12.N2.lab, m2);
      if (lt < 32.8) centers(lt < 25 ? RW12.N1.C : lt < 28.5 ? RW12.N2.C : RW12.N4.C, gR, 1 - prog(lt, 32.2, .5));
      appear(1 - sw, () => {
        txt(lt < 24.5 ? '種子 1' : lt < 28 ? '種子 1 → 2' : '種子 2 → 4', gR.ox + gR.w / 2 - 150, 838, 36, { color: COL.black });
        if (lt >= 25.3) txt('ARI ' + (lt < 28.6 ? RW12.ariN12 : RW12.ariN24).toFixed(2), gR.ox + gR.w / 2 + 130, 838, 50, { color: COL.red });
      });
    });
    appear(prog(lt, 28.8, .6) * (1 - sw), () => { txt('同樣切三群', 960, 470, 40, { color: COL.black }); txt('分界線', 960, 560, 44, { color: COL.red }); txt('跟著起點移動', 960, 620, 44, { color: COL.red }); });
    // 換樣本
    appear(prog(lt, 32.2, .7), () => { txt('隨機抽 80% 的資料', 560, 400, 52, { color: COL.black }); txt('重新分群，重複多次', 560, 480, 44, { color: COL.gray }); });
    const kp = prog(lt, 36.6, .8);
    if (kp > 0) { const [a, b] = RW12.pair.map(i => [PX(gR, RW12.none[i][0]), PY(gR, RW12.none[i][1])]);
      inkLine(a[0], a[1], b[0], b[1], { w: 5, color: COL.black, p: kp }); inkEll(a[0], a[1], 20, 20, { w: 4.5, color: COL.black, p: kp }); inkEll(b[0], b[1], 20, 20, { w: 4.5, color: COL.black, p: kp });
      appear(kp, () => { txt('同一對學生', 560, 620, 48, { color: COL.blue }); txt('多數時候分在同一群嗎？', 560, 700, 48, { color: COL.blue }); txt('灰色：這一次沒抽到的 20%', gR.ox + gR.w / 2, 838, 32, { color: COL.gray }); }); }
  } };

  // 6 兩個解讀上的錯誤
  const s6 = { beats: [0, 10.85, 16.74, 27.43], draw(lt) {
    txt('解讀時的兩個錯誤', 960, 130, 56, { p: prog(lt, .3, 1), color: COL.black });
    inkLine(960, 210, 960, 850, { w: 2.5, color: COL.gray, p: prog(lt, 1, 1) });
    // 一、命名
    appear(prog(lt, 2.6, .6), () => { txt('1', 150, 232, 60, { color: COL.red }); txt('名字是解讀出來的', 200, 232, 46, { align: 'left', color: COL.red }); });
    const un = prog(lt, 11, 1);
    RW12.names.forEach((n, i) => { const y = 370 + i * 84, kk = prog(lt, 4 + i * .5, .5);
      appear(kk, () => { shape(roundRectPts(110, y - 34, 300, 68, 14), { fill: '#fffdf6', w: 3.5 }); dot(142, y, 11, CL[i], 1); });
      appear(kk * (1 - un), () => txt(n, 272, y + 1, 34, { color: COL.black })); appear(un, () => txt('第 ' + (i + 1) + ' 群', 272, y + 1, 34, { color: COL.gray })); });
    appear(prog(lt, 11.3, .8), () => {
      txt('各群在每個變項上的平均', 670, 300, 30, { color: COL.blue });
      for (let r = 0; r <= 4; r++) inkLine(450, 336 + r * 84, 890, 336 + r * 84, { w: 2.5 });
      for (let c = 0; c <= 4; c++) inkLine(450 + c * 110, 336, 450 + c * 110, 672, { w: 2.5 });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) txt(c === 3 ? '…' : '平均', 505 + c * 110, 379 + r * 84, 26, { color: COL.gray, jit: .3 });
    });
    noteBox(500, 770, 640, 90, [['名字是解讀，表才是資料', 40, COL.black]], '#fff8e2', prog(lt, 13.6, .7));
    // 二、循環論證
    appear(prog(lt, 16.8, .6), () => { txt('2', 1050, 232, 60, { color: COL.red }); txt('循環論證', 1100, 232, 46, { align: 'left', color: COL.red }); });
    appear(prog(lt, 18.2, .6), () => { shape(roundRectPts(1050, 330, 220, 90, 16), { fill: COL.blueL, w: 4 }); txt('九題', 1160, 376, 44, { color: COL.black }); });
    arrow(1285, 375, 1525, 375, { w: 5, head: 16, p: prog(lt, 19, .6) }); txt('用來分群', 1405, 340, 30, { color: COL.gray, p: prog(lt, 19, .6) });
    appear(prog(lt, 19.6, .6), () => { shape(roundRectPts(1540, 330, 220, 90, 16), { fill: COL.greenL, w: 4 }); txt('四群', 1650, 376, 44, { color: COL.black }); });
    const kr = prog(lt, 21.2, 1.2);
    if (kr > 0) { ink([[1650, 432], [1600, 500], [1210, 500], [1165, 446]], { w: 5, color: COL.red, p: kr }); if (kr >= 1) { inkLine(1165, 446, 1162, 474, { w: 5, color: COL.red }); inkLine(1165, 446, 1192, 456, { w: 5, color: COL.red }); } txt('再檢定各群在這九題上的差異', 1405, 540, 32, { color: COL.red, p: kr }); }
    appear(prog(lt, 24.2, .6), () => txt('當然顯著', 1405, 610, 56, { color: COL.red }));
    noteBox(1405, 760, 700, 150, [['用沒有參與分群的變項驗證', 40, COL.green], ['例如：規律運動與否', 34, COL.black]], '#fff8e2', prog(lt, 27.6, .7));
  } };

  // 7 結語
  const s7 = { beats: [0, 5.81], draw(lt) {
    ground(lt, 140, 1780);
    txt('分群沒有標準答案', 960, 200, 92, { p: prog(lt, .2, .9), color: COL.black });
    underline(590, 1330, 268, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    appear(prog(lt, 2.4, .7), () => txt('演算法切出四群 ≠ 資料裡有四種學生', 960, 370, 50, { color: COL.red }));
    [['檢查穩定性', 1000, 6], ['外部變項驗證', 1350, 7.6], ['最後才命名', 1700, 9.4]].forEach(([s, x, at], i) => {
      appear(prog(lt, at, .6), () => { txt(String(i + 1), x, 480, 56, { color: COL.blue }); txt(s, x, 550, 42, { color: COL.black }); });
      if (i < 2) arrow(x + 140, 550, x + 205, 550, { w: 4, head: 14, p: prog(lt, at + .8, .5) });
    });
    stick(220, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(410, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(580, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 22.9], [s2, 18.1], [s3, 22.8], [s4, 19.8], [s5, 42.1], [s6, 34.6], [s7, 16.1]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 12 週　分群沒有標準答案', scenes,
    sources: ['資料來源', '散布點與 ARI：課程網站第 12 週分群工具的模擬資料，不是調查資料', 'James et al. (2021). An Introduction to Statistical Learning, 2nd ed., ch. 12', '林彥光老師講義〈第 12 週 非監督式學習：分群與降維〉'] };
})();
EPISODES['rw12e1'] = RW12E1;
