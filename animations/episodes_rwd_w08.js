// 真實世界運動大數據分析：第 8 週 EP1　樣本很大的時候，什麼都顯著
const RW08 = {
  // facts.json b13_21_by_regular：題號、平均差（分）、Cohen's d；九題 p 皆 < .001
  q: [['b13', 0.17, 0.10], ['b14', 0.23, 0.25], ['b15', 0.31, 0.36], ['b16', 0.22, 0.28], ['b17', 0.27, 0.30], ['b18', 0.19, 0.23], ['b19', 0.20, 0.22], ['b20', 0.19, 0.19], ['b21', 0.15, 0.18]],
  m1: 2.64, m0: 2.47,   // b13 兩組平均（規律、不規律）
  code: ['proc ttest data=survey4;', '  class regular;', '  var b13-b21;', 'run;'],
};

const RW08E1 = (() => {
  const cell = (x, y, w, h, fill, col) => shape(rectPts(x, y, w, h), { fill: fill || COL.white, w: 2.5, smooth: false, color: col || INK });
  // 一行多色文字，整行以 cx 置中
  const seq = (parts, cx, y, size) => { const W = parts.reduce((a, [s]) => a + measure(s, size), 0); let x = cx - W / 2; parts.forEach(([s, col]) => { txt(s, x, y, size, { align: 'left', color: col || COL.black }); x += measure(s, size); }); };

  // 1 開場故事：2016 年美國統計學會的 p 值聲明
  const s1 = { beats: [0, 5.24, 15.61], draw(lt) {
    ground(lt, 140, 1780);
    txt('2016 年', 400, 150, 44, { p: prog(lt, .3, .8), color: COL.gray });
    appear(prog(lt, .8, .8), () => { paperSheet(400, 350, 480, 300, -.02); txt('美國統計學會', 400, 265, 36, { color: COL.gray }); txt('p 值聲明', 400, 350, 76, { color: COL.black }); txt('2016', 400, 435, 38, { color: COL.gray }); });
    txt('過去不曾對特定統計做法表態', 400, 548, 30, { p: prog(lt, 6, .8), color: COL.blue });
    appear(prog(lt, 10.4, .7), () => {
      stick(260, GY, .78, { mouth: 'smile', la: Math.PI * .7, ra: [-Math.PI * .15, -Math.PI * .45], bob: idle(RLT) * .3 });
      stick(540, GY, .78, { mouth: 'smile', la: [Math.PI * 1.15, Math.PI * 1.45], ra: Math.PI * .3, bob: idle(RLT, 1) * .3 });
      txt('瓦瑟斯坦', 260, 622, 30, { color: COL.black }); txt('拉扎爾', 540, 622, 30, { color: COL.black });
    });
    // 六項原則
    txt('六項原則', 1300, 220, 52, { p: prog(lt, 15.7, .7), color: COL.black });
    for (let i = 0; i < 6; i++) { const k = prog(lt, 16.2 + i * .18, .4), x = 1050 + i * 100, hot = i === 4 && lt > 18.2; appear(k, () => { shape(ellPts(x, 330, 36, 36, 0, Math.PI * 2, 24), { fill: hot ? COL.pinkL : COL.white, w: 4, color: hot ? COL.red : INK }); txt(String(i + 1), x, 332, 40, { color: hot ? COL.red : COL.black }); }); }
    const ka = prog(lt, 19, .6);
    if (ka > 0) arrow(1450, 376, 1450, 448, { w: 4, head: 14, color: COL.red, p: ka });
    noteBox(1300, 590, 900, 270, [['第五項', 34, COL.red], ['p 值或統計顯著', 46, COL.black], ['量不出效果的大小', 42, COL.black], ['也量不出結果的重要性', 42, COL.black]], '#fff8e2', prog(lt, 19.4, .8));
  } };

  // 2 課堂資料：九題的 p 值全部小於 .001
  const s2 = { beats: [0, 11.03, 18.36], draw(lt) {
    ground(lt, 140, 900);
    txt('規律 vs 不規律運動：九題的平均', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    txt('規律運動＝運動天數達標且會流汗會喘', 120, 196, 28, { p: prog(lt, 4.2, .6), color: COL.gray, align: 'left' });
    RW08.code.forEach((l, i) => txt(l, 130, 270 + i * 50, 34, { align: 'left', color: COL.black, p: prog(lt, 1 + i * .5, .9), jit: .5 }));
    // 九題的表
    const X = 1020, Y0 = 250, RH = 64;
    appear(prog(lt, 5, .5), () => { txt('題號', X + 100, Y0 - 34, 32, { color: COL.gray }); txt('p 值', X + 350, Y0 - 34, 32, { color: COL.gray }); });
    RW08.q.forEach(([v], i) => appear(prog(lt, 5.2 + i * .3, .4), () => {
      const y = Y0 + i * RH, kp = prog(lt, 14.6 + i * .22, .35), ks = clamp((lt - 18.5 - i * .1) / .3);
      cell(X, y, 200, RH - 8); txt(v, X + 100, y + RH / 2 - 4, 34, { color: COL.black });
      cell(X + 200, y, 300, RH - 8, ks > 0 ? COL.pinkL : COL.white, ks > 0 ? COL.red : INK);
      if (kp > 0) txt('< .001', X + 350, y + RH / 2 - 4, 36, { color: COL.red, p: kp }); else txt('？', X + 350, y + RH / 2 - 4, 32, { color: COL.gray });
      if (ks > 0) txt('顯著', X + 590, y + RH / 2 - 4, 34, { color: COL.red, p: ks });
    }));
    noteBox(500, 500, 560, 90, [['兩組各有 17,000 多人', 42, COL.black]], '#fff8e2', prog(lt, 11.2, .7));
    stick(230, GY, .85, { hair: 'pony', mouth: lt > 20 ? 'o' : 'smile', la: Math.PI * .7, ra: Math.PI * .3, bob: idle(RLT) * .3 });
    bubble(390, 600, 380, 90, 272, 652, '差了多少？', 46, prog(lt, 20.6, .6));
  } };

  // 3 效果量：同一張圖從平均差換成 d
  const s3 = { beats: [0, 6.29, 10.98, 21.99], draw(lt) {
    txt('差了多少', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const BASE = 760, X = i => 230 + i * 95, m = ease(prog(lt, 6.4, 1.6)), kb = prog(lt, 1, 2.2), hot = lt > 11;
    axis(150, 1060, BASE, { p: prog(lt, .5, .5) }); arrow(170, BASE + 10, 170, 250, { w: 4, head: 16, p: prog(lt, .5, .5) });
    txt(m < .5 ? '平均差（分）' : '標準化效果量 d', 200, 232, 34, { color: m < .5 ? COL.blue : COL.green, p: prog(lt, .8, .5), align: 'left' });
    RW08.q.forEach(([v, df, d], i) => {
      const h = lerp(df, d, m) * 1000 * clamp(kb * 5 - i * .45);
      bar(X(i), BASE, 62, h, hot && i === 0 ? COL.mustard : m < .5 ? COL.blueL : COL.greenL);
      txt(v, X(i), BASE + 38, 28, { color: hot && i === 0 ? COL.red : COL.gray, p: prog(lt, .9, .5) });
      if (kb >= 1) txt((m < .5 ? df : d).toFixed(2), X(i), BASE - h - 26, 30, { color: hot && i === 0 ? COL.red : COL.black });
    });
    // 右側：五點量表與 b13
    const SX = v => 1200 + (v - 1) * 150, SY = 420;
    appear(prog(lt, 1.4, .6), () => { inkLine(SX(1), SY, SX(5), SY, { w: 5 }); for (let v = 1; v <= 5; v++) { inkLine(SX(v), SY - 12, SX(v), SY + 12, { w: 4 }); txt(String(v), SX(v), SY + 44, 32, { color: COL.gray }); } });
    appear(prog(lt, 1.4, .6) * (1 - prog(lt, 10.6, .4)), () => txt('五點量表', 1500, 250, 44, { color: COL.black }));
    appear(prog(lt, 11.1, .6), () => txt('b13　兩組的平均', 1500, 250, 44, { color: COL.red }));
    appear(prog(lt, 13.2, .5), () => { inkLine(SX(RW08.m1), SY - 70, SX(RW08.m1), SY, { w: 5, color: COL.green }); txt('規律 2.64', SX(RW08.m1) + 10, SY - 92, 32, { align: 'left', color: COL.green }); });
    appear(prog(lt, 15, .5), () => { inkLine(SX(RW08.m0), SY - 70, SX(RW08.m0), SY, { w: 5, color: COL.blue }); txt('不規律 2.47', SX(RW08.m0) - 10, SY - 92, 32, { align: 'right', color: COL.blue }); });
    txt('九題平均差　0.15 – 0.31 分', 1500, 545, 40, { p: prog(lt, 2.6, .8), color: COL.blue });
    txt('九題效果量 d　0.10 – 0.36', 1500, 610, 40, { p: prog(lt, 7.6, .8), color: COL.green });
    txt('b13：差 0.17 分，d = 0.10', 1500, 680, 42, { p: prog(lt, 17, .8), color: COL.red });
    noteBox(1500, 805, 760, 130, [['樣本很大，很小的差異也顯著', 36, COL.red], ['p 值只回答：差異是不是剛好為零', 36, COL.black]], '#fff8e2', prog(lt, 22.2, .7));
  } };

  // 4 結果要報告三樣
  const s4 = { beats: [0, 6.77, 17.62], draw(lt) {
    ground(lt, 140, 1780);
    txt('結果要報告三樣', 960, 135, 58, { p: prog(lt, .3, .9), color: COL.black });
    const C = [[420, '差異的大小', COL.red, 2.8], [960, '信賴區間', COL.blue, 4.1], [1500, '效果量', COL.green, 5.2]];
    C.forEach(([x, t, col, at], i) => appear(prog(lt, at, .6), () => { shape(roundRectPts(x - 220, 205, 440, 120, 22), { fill: '#fffdf6', w: 4 }); txt(String(i + 1), x - 165, 265, 56, { color: col }); txt(t, x + 30, 265, 46, { color: col }); }));
    // 一句話結果（b15）
    const c1 = lt > 11 ? COL.red : COL.black, c2 = lt > 13.3 ? COL.blue : COL.black, c3 = lt > 15.6 ? COL.green : COL.black;
    appear(prog(lt, 7, .8), () => { paperSheet(960, 490, 1340, 230, .005); seq([['規律運動組在 b15　'], ['平均高 0.31 分', c1]], 960, 445, 48); });
    appear(prog(lt, 9.4, .8), () => seq([['（'], ['95% 信賴區間 ＿＿ 到 ＿＿', c2], ['，'], ['d = 0.36', c3], ['）']], 960, 530, 46));
    appear(prog(lt, 13.4, .6), () => txt('信賴區間的兩個端點，由程式輸出填入', 960, 640, 28, { color: COL.gray }));
    appear(prog(lt, 17.7, .6), () => stick(300, GY, .95, { glasses: true, la: Math.PI * .75, ra: [-Math.PI * .12, -Math.PI * .5], mouth: 'flat', bob: idle(RLT) * .3 }));
    noteBox(1010, 745, 980, 90, [['五點量表上差 0.31 分，有沒有實務意義？', 42, COL.black]], '#fff8e2', prog(lt, 18.2, .6));
  } };

  // 5 多重比較：九次檢定
  const s5 = { beats: [0, 6.93, 14.9], draw(lt) {
    txt('多重比較：九題，九次機會', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    RW08.q.forEach(([v], i) => appear(prog(lt, 2 + i * .3, .4), () => { const x = 200 + i * 190; shape(roundRectPts(x - 70, 205, 140, 84, 14), { fill: COL.blueL, w: 3.5 }); txt(v, x, 245, 36, { color: COL.black }); txt('α = .05', x, 318, 26, { color: COL.gray }); }));
    txt('九題實際上都沒有差異時，至少一題 p < 0.05 的機率', 960, 392, 34, { p: prog(lt, 7.1, .8), color: COL.gray });
    appear(prog(lt, 10.4, .7), () => {
      const a = '1 − 0.95', b = ' ≈ ', c = '37%', S = 92, w = measure(a, S) + 34 + measure(b, S) + measure(c, S); let x = 960 - w / 2;
      txt(a, x, 480, S, { align: 'left', color: COL.black }); x += measure(a, S); txt('9', x + 4, 442, 44, { align: 'left', color: COL.black }); x += 34;
      txt(b, x, 480, S, { align: 'left', color: COL.black }); x += measure(b, S); txt(c, x, 480, S, { align: 'left', color: COL.red });
    });
    const C = [[340, '校正', 'Bonferroni', '0.05 ÷ 9 ≈ 0.0056', COL.blue, 15.6], [960, '合併', '合成一個量表分數', '只檢定一次', COL.green, 17.6], [1580, '事前指定', '一題為主要結果', '其餘為探索性', COL.red, 21.4]];
    C.forEach(([x, t, a, b, col, at]) => appear(prog(lt, at, .7), () => { shape(roundRectPts(x - 270, 580, 540, 250, 22), { fill: '#fffdf6', w: 4 }); txt(t, x, 632, 50, { color: col }); txt(a, x, 712, 36, { color: COL.black }); txt(b, x, 772, 36, { color: COL.black }); }));
  } };

  // 6 岔路花園：AI 讓岔路變多
  const s6 = { beats: [0, 6.37, 12.07, 17.96], draw(lt) {
    txt('AI 讓岔路變多', 120, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    txt('換個定義再跑一次', 300, 225, 38, { p: prog(lt, 2.4, .7), color: COL.black });
    txt('只要 10 秒', 300, 285, 50, { p: prog(lt, 4.6, .5), color: COL.red });
    txt('一個下午：50 條岔路', 310, 365, 36, { p: prog(lt, 6.5, .7), color: COL.black });
    stick(200, GY, .85, { hair: 'tuft', la: Math.PI * .6, ra: [Math.PI * .05, -Math.PI * .1], mouth: lt > 9.4 && lt < 12 ? 'smile' : 'flat', bob: idle(RLT) * .3 });
    appear(prog(lt, .6, .5), () => { cell(330, 620, 180, 120); shape([[310, 740], [530, 740], [550, 768], [290, 768]], { fill: COL.blueL, w: 3.5, smooth: false }); txt('AI', 420, 678, 44, { color: COL.blue }); });
    const R = [520, 660], n = Math.floor(50 * prog(lt, 1.6, 8)), all = lt > 18.4, BEST = 3;
    for (let k = 0; k < 5; k++) if (n > k * 10) inkLine(R[0], R[1], 720, 250 + k * 122, { w: 4, color: COL.gray, p: clamp((n - k * 10) / 3) });
    for (let i = 0; i < n; i++) {
      const k = Math.floor(i / 10), y = 200 + i * 12.2, best = i === BEST && lt > 9.6, col = all ? COL.blue : best ? COL.red : COL.gray;
      inkLine(720, 250 + k * 122, 990, y, { w: best || all ? 3 : 2, color: col });
      shape(ellPts(1000, y, best ? 11 : 5, best ? 11 : 5, 0, Math.PI * 2, 12), { fill: best && !all ? COL.mustard : all ? COL.blueL : COL.white, w: 2, color: col });
    }
    appear(prog(lt, 9.8, .6) * (1 - prog(lt, 18.2, .4)), () => txt('只報告最漂亮的這一條', 1030, 236, 32, { align: 'left', color: COL.red }));
    noteBox(1470, 430, 720, 150, [['1　先寫規格書', 42, COL.blue], ['看到結果之前，決定主要分析', 34, COL.black]], '#fff8e2', prog(lt, 13, .7));
    noteBox(1470, 640, 720, 150, [['2　報告所有跑過的分析', 42, COL.green], ['包含沒有顯著的', 34, COL.black]], '#fff8e2', prog(lt, 18.1, .7));
    appear(prog(lt, 19, .6), () => txt('50 條全部列出來', 1030, 236, 32, { align: 'left', color: COL.blue }));
  } };

  // 7 JASP 獨立重做與結語
  const s7 = { beats: [0, 12.53], draw(lt) {
    ground(lt, 140, 1780);
    txt('用 JASP 獨立重做一次', 960, 135, 58, { p: prog(lt, .3, .9), color: COL.black });
    const P = [[580, '程式輸出', COL.blue, 1.2], [1340, 'JASP（點選）', COL.green, 4.4]], ROW = ['統計量', '自由度', 'p 值'];
    appear(prog(lt, 2.2, .6), () => txt('同一份資料', 960, 222, 34, { color: COL.gray }));
    P.forEach(([x, t, col, at]) => appear(prog(lt, at, .7), () => { shape(roundRectPts(x - 250, 185, 500, 260, 22), { fill: '#fffdf6', w: 4 }); txt(t, x, 228, 42, { color: col }); ROW.forEach((r, i) => txt(r, x, 296 + i * 52, 38, { color: COL.black })); }));
    ROW.forEach((r, i) => { const k = prog(lt, 8.3 + i * 1.1, .5); appear(k, () => txt('＝', 930, 296 + i * 52, 44, { color: COL.black })); check(1000, 296 + i * 52, .5, k); });
    appear(prog(lt, 12.7, .7), () => txt('p < 0.05 之後，還要寫出來', 1080, 510, 52, { color: COL.black }));
    [['差多少', COL.red, 15.3, 760], ['估得多準', COL.blue, 16.4, 1080], ['跑了幾次', COL.green, 17.6, 1420]].forEach(([s, col, at, x]) => { const k = prog(lt, at, .5); appear(k, () => txt(s, x, 590, 60, { color: col })); if (k > 0) underline(x - 110, x + 110, 632, { p: k, color: col }); });
    stick(230, GY, .95, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(400, GY, .85, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(550, GY, .68, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 12 });
  } };

  const order = [[s1, 27.8], [s2, 25.9], [s3, 31.5], [s4, 26.2], [s5, 25.8], [s6, 23.3], [s7, 23.3]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 8 週　樣本很大的時候，什麼都顯著', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', 'Wasserstein & Lazar (2016). The American Statistician, 70(2), 129–133', '林彥光老師講義〈第 8 週 統計推論：選方法、讀結果〉'] };
})();
EPISODES['rw08e1'] = RW08E1;
