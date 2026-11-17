// 真實世界運動大數據分析：第 14 週 EP1　把兩組調整到可以比：傾向分數
const RW14 = (() => {
  // w14.json 概念 3、4 的工具數字（600 人的模擬資料）：未調整 2.53、真值 1.00；
  // 卡尺 0.20：179 對、捨棄 62 位處理組、估計 1.29、SMD 0.12；卡尺 0.05：159 對、捨棄 82 人、SMD 0.02；
  // 加權估計 1.12、最大權重 24.6；調整前 SMD 1.09。
  const sim = { n: 600, raw: '2.53', truth: '1.00', pairs: 179, drop: 62, est: '1.29', pairs2: 159, drop2: 82, ipw: '1.12', wmax: '24.6', smd: [1.09, 0.12, 0.02] };
  // 示意用的小人位置（不是模擬資料的個別值）：處理組 24 人、對照組 36 人
  const T = [], C = [];
  for (let i = 0; i < 24; i++) T.push(i === 0 ? .041 : .2 + .74 * Math.pow((i - 1) / 22, .8));
  for (let j = 0; j < 36; j++) C.push(.03 + .72 * j / 35);
  const used = new Set(), match = [];
  T.forEach((t, i) => { let best = -1, bd = .045; C.forEach((c, j) => { const d = Math.abs(c - t); if (!used.has(j) && d < bd) { bd = d; best = j; } }); match[i] = best; if (best >= 0) used.add(best); });
  return { sim, T, C, match, feat: ['性別', '年級', '學校類型', '都市化層級', '⋯⋯'] };
})();

const RW14E1 = (() => {
  const dashV = (x, y0, y1, o) => { for (let y = y0; y < y1; y += 24) inkLine(x, y, x, Math.min(y + 13, y1), { w: 3, ...o }); };
  const dot = (x, y, r, fill, color) => shape(ellPts(x, y, r, r, 0, Math.PI * 2, 18), { fill, w: 3.5, color });
  const pill = (x, y, w, h, s, fill) => { shape(roundRectPts(x - w / 2, y - h / 2, w, h, 18), { fill, w: 3.5 }); txt(s, x, y + 1, 34, { color: COL.black }); };
  const X0 = 330, XW = 970, PX = e => X0 + e * XW;

  // 1 課堂情境：兩組在十幾個特徵上都不一樣
  const s1 = { beats: [0, 5.89, 14.63], draw(lt) {
    ground(lt, 140, 1780);
    txt('參加社團的學生，比較常規律運動嗎？', 960, 150, 52, { p: prog(lt, .3, 1.4), color: COL.black });
    [[420, '參加社團', COL.mustard, COL.mustardD], [980, '沒參加社團', COL.blueL, COL.blue]].forEach(([cx, name, fill, col], g) => {
      txt(name, cx, 265, 40, { color: col, p: prog(lt, 1 + g * 1.2, .6) });
      for (let i = 0; i < 8; i++) appear(prog(lt, 1.2 + g * 1.2 + i * .1, .4), () => mini(cx - 120 + (i % 4) * 80, 370 + Math.floor(i / 4) * 110, .8, fill));
    });
    const L = [150, 90, 170, 110, 0], R = [80, 160, 70, 180, 0], AT = [8.8, 9.6, 10.3, 11.2, 11.8];
    RW14.feat.forEach((f, i) => appear(prog(lt, AT[i], .5), () => {
      const y = 610 + i * 50;
      txt(f, 700, y, 30, { color: COL.black });
      if (L[i]) { shape(rectPts(580 - L[i], y - 12, L[i], 24), { fill: COL.mustard, w: 2.5, smooth: false }); shape(rectPts(820, y - 12, R[i], 24), { fill: COL.blueL, w: 2.5, smooth: false }); }
    }));
    appear(prog(lt, 12.2, .6), () => txt('十幾個特徵都不一樣', 700, 562, 36, { color: COL.red }));
    appear(prog(lt, 8.8, .5), () => txt('（長條為示意）', 1010, 812, 24, { color: COL.gray, align: 'left' }));
    appear(prog(lt, 14.7, .6), () => stick(1560, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat', bob: idle(RLT) * .3 }));
    bubble(1500, 400, 620, 100, 1545, 535, '怎麼調整到可以比？', 42, prog(lt, 15, .6));
    noteBox(1500, 270, 600, 80, [['又怎麼證明調整成功？', 38, COL.red]], '#fff8e2', prog(lt, 18.2, .6));
  } };

  // 2 傾向分數：多個變項 → 一個分數
  const s2 = { beats: [0, 11.09, 20.1], draw(lt) {
    txt('傾向分數', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1.2, .8), () => {
      paperSheet(1450, 290, 740, 220, .015);
      txt('Rosenbaum & Rubin（1983）', 1450, 250, 40, { color: COL.black });
      txt('Biometrika, 70(1), 41–55', 1450, 320, 30, { color: COL.gray });
    });
    appear(prog(lt, 4.7, .7), () => txt('給定特徵之後，接受處理的機率', 540, 250, 44, { color: COL.black }));
    appear(prog(lt, 5.8, .7), () => txt('e(X) = P(處理 = 1 | X)', 540, 330, 46, { color: COL.blue }));
    appear(prog(lt, 8.5, .6), () => txt('在這裡：參加社團的機率', 540, 405, 36, { color: COL.mustardD }));
    // 多個變項
    RW14.feat.forEach((f, i) => appear(prog(lt, 11.2 + i * .3, .4), () => pill(230, 510 + i * 60, 250, 46, f, '#fffdf6')));
    appear(prog(lt, 12.8, .5), () => cross(430, 640, .7, clamp((lt - 12.8) / .6)));
    appear(prog(lt, 12.8, .5), () => txt('無法逐一配對', 480, 705, 30, { color: COL.red }));
    // 一個分數
    const ka = prog(lt, 14, .8);
    if (ka > 0) {
      axis(620, 1520, 660, { p: ka });
      appear(ka, () => { txt('0', 620, 700, 30, { color: COL.gray }); txt('1', 1500, 700, 30, { color: COL.gray }); txt('傾向分數', 1060, 705, 30, { color: COL.gray }); });
    }
    appear(prog(lt, 14.6, .6), () => { mini(1140, 590, .7, COL.mustard); mini(1196, 590, .7, COL.blueL); inkLine(1168, 646, 1168, 674, { w: 4, color: COL.blue }); });
    appear(prog(lt, 15, .6), () => txt('分數相同的兩個人', 1168, 480, 36, { color: COL.blue }));
    appear(prog(lt, 17.2, .6), () => txt('這些特徵的分布，平均而言相同', 1168, 760, 36, { color: COL.green }));
    appear(prog(lt, 20.3, .6), () => txt('多個變項', 230, 455, 34, { color: COL.gray }));
    appear(prog(lt, 22, .6), () => { txt('一個分數', 800, 600, 40, { color: COL.blue }); arrow(530, 600, 700, 600, { w: 5, head: 18, color: COL.blue }); });
    noteBox(860, 835, 900, 80, [['只能平衡放進模型的變項', 40, COL.red]], '#fff8e2', prog(lt, 24.4, .6));
  } };

  // 3 設計與分析分離
  const s3 = { beats: [0, 7.09], draw(lt) {
    txt('設計與分析分離', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, .8, .7), () => { shape(roundRectPts(160, 220, 700, 500, 24), { fill: '#fffdf6', w: 4, color: COL.blue }); txt('階段一　設計', 510, 285, 52, { color: COL.blue }); });
    ['估計傾向分數', '配對或加權', '檢查平衡'].forEach((s, i) => appear(prog(lt, 1.6 + i * .6, .5), () => txt(s, 510, 385 + i * 65, 40, { color: COL.black })));
    appear(prog(lt, 4, .5), () => pill(430, 640, 280, 70, '結果變項', COL.pinkL));
    if (lt > 4.8) cross(430, 640, 1.1, prog(lt, 4.8, .6));
    appear(prog(lt, 5.2, .5), () => txt('不讀取', 680, 640, 38, { color: COL.red }));
    const ka = prog(lt, 7.2, .7);
    if (ka > 0) { arrow(880, 470, 1040, 470, { w: 6, head: 20, color: COL.green, p: ka }); txt('平衡達成', 960, 420, 34, { color: COL.green, p: ka }); }
    appear(prog(lt, 8.2, .7), () => { shape(roundRectPts(1060, 220, 700, 500, 24), { fill: '#fffdf6', w: 4, color: COL.green }); txt('階段二　分析', 1410, 285, 52, { color: COL.green }); txt('估計效果', 1410, 420, 40, { color: COL.black }); });
    appear(prog(lt, 9, .5), () => pill(1330, 640, 280, 70, '結果變項', COL.greenL));
    if (lt > 9.5) check(1580, 640, .8, prog(lt, 9.5, .5));
    appear(prog(lt, 11.2, .7), () => txt('不可能為了想要的答案，反覆修改模型', 960, 800, 44, { color: COL.black }));
  } };

  // 4 主視覺：兩組依傾向分數排在一條線上，配對連線，配不到的人移出
  const s4 = { beats: [0, 8.13, 15.92, 23.09, 32.1], draw(lt) {
    const S = RW14.sim, AY = 560, ty = i => 490 - (i % 2) * 65, cy = j => 660 + (j % 3) * 55;
    txt('配對：找傾向分數最接近的人', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1, .6), () => txt('（小人位置為示意）', 850, 140, 28, { color: COL.gray, align: 'left' }));
    noteBox(1620, 235, 440, 90, [['模擬資料　' + S.n + ' 人', 40, COL.black]], '#fff8e2', prog(lt, 1.6, .6));
    axis(X0 - 10, X0 + XW + 20, AY, { p: prog(lt, 4.4, .8) });
    appear(prog(lt, 4.6, .6), () => { txt('0', X0 - 26, AY, 30, { color: COL.gray }); txt('1', X0 + XW + 44, AY, 30, { color: COL.gray }); txt('傾向分數', X0 + XW / 2, AY + 34, 26, { color: COL.gray }); });
    appear(prog(lt, 4.2, .6), () => { txt('處理組', 170, 440, 40, { color: COL.mustardD }); txt('參加社團', 170, 490, 28, { color: COL.gray }); txt('對照組', 170, 690, 40, { color: COL.blue }); txt('沒參加', 170, 740, 28, { color: COL.gray }); });
    // 配對連線
    let k = 0;
    RW14.T.forEach((t, i) => { const j = RW14.match[i]; if (j < 0) return; const p = prog(lt, 9 + k * .28, .5); k++; if (p > 0) inkLine(PX(t), ty(i) + 18, PX(RW14.C[j]), cy(j) - 38, { w: 3, color: COL.green, p }); });
    // 小人
    RW14.C.forEach((c, j) => appear(prog(lt, 5 + j * .05, .4), () => mini(PX(c), cy(j), .42, COL.blueL)));
    const fly = ease(prog(lt, 21.4, 1.6)); let u = 0;
    RW14.T.forEach((t, i) => appear(prog(lt, 5 + i * .07, .4), () => {
      if (RW14.match[i] >= 0) return mini(PX(t), ty(i), .42, COL.mustard);
      const x = lerp(PX(t), 1465 + u * 62, fly), y = lerp(ty(i), 560, fly); u++;
      mini(x, y, .42, lt > 13.4 ? COL.pinkL : COL.mustard);
    }));
    appear(prog(lt, 13.4, .6) * (1 - prog(lt, 21.2, .5)), () => { txt('差距超過卡尺，不配', 1130, 330, 34, { color: COL.red }); arrow(1130, 352, 1180, 392, { w: 4, head: 14, color: COL.red }); });
    // 右側數字
    appear(prog(lt, 16.1, .5), () => txt('卡尺 0.20', 1620, 325, 36, { color: COL.gray }));
    appear(prog(lt, 17.9, .6), () => txt('配成 ' + S.pairs + ' 對', 1620, 392, 54, { color: COL.green }));
    appear(prog(lt, 20, .6), () => txt('移出 ' + S.drop + ' 位處理組', 1620, 465, 40, { color: COL.red }));
    const R = [['未調整', S.raw, COL.gray, 26.3], ['配對後', S.est, COL.black, 29.4], ['真值', S.truth, COL.green, 24.6]];
    R.forEach(([a, b, col, at], i) => appear(prog(lt, at, .6), () => { txt(a, 1440, 655 + i * 62, 38, { align: 'left', color: COL.gray }); txt(b, 1800, 655 + i * 62, 52, { align: 'right', color: col }); }));
    appear(prog(lt, 32.3, .6), () => txt('估計對象：處理組的平均效果', 560, 848, 38, { color: COL.blue }));
    appear(prog(lt, 35.2, .6), () => txt('只適用於配對成功的人', 1130, 848, 34, { color: COL.red }));
  } };

  // 5 加權：不捨棄人，小人大小 = 權重
  const s5 = { beats: [0, 6.29, 16.98], draw(lt) {
    const S = RW14.sim, AY = 520, g = ease(prog(lt, 3, 2.4)), sz = w => lerp(.42, .42 * Math.pow(w, .35), g);
    txt('加權：不捨棄任何人', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1, .6), () => txt('（模擬資料，小人位置為示意）', 660, 140, 28, { color: COL.gray, align: 'left' }));
    axis(X0 - 10, X0 + XW + 20, AY, { p: prog(lt, .4, .6) });
    appear(prog(lt, .5, .6), () => { txt('0', X0 - 26, AY, 30, { color: COL.gray }); txt('1', X0 + XW + 44, AY, 30, { color: COL.gray }); txt('傾向分數', X0 + XW / 2, AY + 30, 26, { color: COL.gray }); txt('處理組', 170, 400, 40, { color: COL.mustardD }); txt('對照組', 170, 660, 40, { color: COL.blue }); });
    appear(prog(lt, .6, .6), () => {
      RW14.C.forEach((c, j) => { const s = sz(1 / (1 - c)); mini(PX(c), 580 + 86 * s + (j % 2) * 62, s, COL.blueL); });
      RW14.T.forEach((t, i) => { const s = sz(1 / t); mini(PX(t), 480 - 40 * s - (i % 2) * 40 * (1 - g), s, COL.mustard); });
    });
    appear(prog(lt, 3.4, .6), () => { txt('每個人的權重', 1620, 235, 34, { color: COL.gray }); txt('處理組 1/e', 1620, 295, 40, { color: COL.mustardD }); txt('對照組 1/(1−e)', 1620, 352, 40, { color: COL.blue }); });
    appear(prog(lt, 8.6, .6), () => { txt('加權的估計', 1530, 450, 36, { color: COL.gray }); txt(S.ipw, 1740, 446, 72, { color: COL.black }); });
    const kc = prog(lt, 11.4, .8);
    if (kc > 0) { inkEll(PX(RW14.T[0]), 398, 72, 116, { w: 5, color: COL.red, p: kc }); appear(kc, () => { txt('最大權重 ' + S.wmax, 650, 290, 48, { color: COL.red }); arrow(520, 316, 445, 356, { w: 4, head: 14, color: COL.red }); }); }
    appear(prog(lt, 14.2, .6), () => txt('少數幾個人主導結果', 1620, 545, 36, { color: COL.red }));
    noteBox(1300, 795, 700, 80, [['加權 → 全體的平均效果', 38, COL.mustardD]], '#fff8e2', prog(lt, 17.1, .6));
    noteBox(520, 795, 700, 80, [['配對 → 處理組的平均效果', 38, COL.blue]], '#fff8e2', prog(lt, 19.6, .6));
    appear(prog(lt, 20.6, .6), () => txt('回答不同的問題', 1620, 640, 44, { color: COL.black }));
    appear(prog(lt, 23.2, .6), () => txt('數字不同，未必有錯', 1620, 700, 34, { color: COL.gray }));
  } };

  // 6 平衡診斷：標準化差異，調整前 → 卡尺 0.20 → 卡尺 0.05
  const s6 = { beats: [0, 8.77, 17.7, 24.07], draw(lt) {
    const S = RW14.sim, VX = v => 380 + v * 1000, AY = 640, RY = [330, 440, 550];
    txt('平衡診斷：標準化差異', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1, .6), () => txt('（模擬資料的混淆因子 Z）', 720, 140, 28, { color: COL.gray, align: 'left' }));
    appear(prog(lt, 3.4, .7), () => txt('兩組平均的差 ÷ 合併標準差', 1320, 215, 40, { color: COL.blue }));
    axis(360, 1560, AY, { p: prog(lt, 1.4, .8) });
    [0, .5, 1].forEach(v => appear(prog(lt, 1.8, .5), () => { inkLine(VX(v), AY, VX(v), AY + 12, { w: 3 }); txt(v === 0 ? '0' : v.toFixed(1), VX(v), AY + 38, 28, { color: COL.gray }); }));
    const kt = prog(lt, 6.4, .8);
    if (kt > 0) { dashV(VX(.1), 285, AY, { color: COL.green, p: 1, alpha: kt }); appear(kt, () => txt('← 小於 0.1 可接受', VX(.1) + 14, 258, 30, { color: COL.green, align: 'left' })); }
    const ROW = [['調整前', 10.2, 0, COL.red], ['配對　卡尺 0.20', 12.3, 1, COL.mustard], ['配對　卡尺 0.05', 17.9, 2, COL.greenL]];
    ROW.forEach(([name, at, i, fill]) => {
      const y = RY[i], kk = prog(lt, at, .5);
      if (kk <= 0) return;
      appear(kk, () => { txt(name, 350, y, 32, { align: 'right', color: COL.black }); if (i) dot(VX(S.smd[0]), y, 13, COL.white, COL.gray); });
      const m = i ? ease(prog(lt, at + .5, 1.8)) : 1, x = lerp(VX(S.smd[0]), VX(S.smd[i]), m);
      appear(kk, () => dot(x, y, 14, fill));
      if (m >= 1) appear(prog(lt, at + (i ? 2.3 : .3), .4), () => txt(S.smd[i].toFixed(2), i ? VX(.1) + 50 : x + 30, y, 38, { align: 'left', color: COL.black }));
    });
    appear(prog(lt, 15.6, .5), () => txt('還沒低於 0.1', 640, RY[1], 32, { align: 'left', color: COL.red }));
    appear(prog(lt, 21.2, .5), () => txt(S.pairs + ' 對，移出 ' + S.drop + ' 人', 900, RY[1], 32, { align: 'left', color: COL.gray }));
    appear(prog(lt, 21.2, .5), () => txt(S.pairs2 + ' 對，移出 ' + S.drop2 + ' 人', 900, RY[2], 32, { align: 'left', color: COL.red }));
    appear(prog(lt, 1.6, .5), () => txt('標準化差異', 1500, AY - 36, 28, { color: COL.gray }));
    const kn = prog(lt, 24.3, .6);
    noteBox(820, 795, 1080, 90, [['不看 p 值：樣本變小，p 值自然變大', 40, COL.black]], '#fff8e2', kn);
    if (lt > 25) cross(220, 795, .7, prog(lt, 25, .5));
    stick(1740, GY, .85, { hair: 'pony', la: [Math.PI * 1.15, Math.PI * 1.3], ra: Math.PI * .35, mouth: lt > 12.3 && lt < 17.9 ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 7 結語（右下角留給資料來源卡）
  const s7 = { beats: [0, 7.09], draw(lt) {
    ground(lt, 140, 790);
    txt('先平衡，再看結果', 960, 190, 88, { p: prog(lt, .2, .9), color: COL.black });
    underline(600, 1320, 256, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    [['配對前後的人數', 2.5, COL.black], ['調整前後的標準化差異', 4.5, COL.black], ['估計的對象是誰', 7.3, COL.red]].forEach(([s, at, col], i) => {
      appear(prog(lt, at, .6), () => txt(s, 960, 370 + i * 90, 50, { color: col, align: 'left' }));
      if (lt > at + .4) check(905, 370 + i * 90, .6, prog(lt, at + .4, .5));
    });
    stick(280, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(490, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(680, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 21.7], [s2, 28.9], [s3, 15.9], [s4, 39.6], [s5, 26.5], [s6, 33.4], [s7, 14.3]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 14 週　把兩組調整到可以比：傾向分數', scenes,
    sources: ['資料來源', '課程網站第 14 週「配對、加權與平衡」工具：600 人的模擬資料（不是調查資料）', 'Rosenbaum & Rubin (1983). Biometrika, 70(1), 41–55', '林彥光老師講義〈第 14 週 因果推論（二）：傾向分數〉'] };
})();
EPISODES['rw14e1'] = RW14E1;
