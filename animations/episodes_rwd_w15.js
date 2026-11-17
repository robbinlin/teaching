// 真實世界運動大數據分析：第 15 週 EP1　沒測到的混淆，要多強才能推翻結論
const RW15 = (() => {
  // 講義 W15 第 2 節：E-value = RR + √(RR × (RR − 1))；對照表 1.2 → 1.69、1.5 → 2.37、2.0 → 3.41
  // w15.json 概念 2 的提示：RR 1.5、信賴區間下限 1.3 的 E-value 是 1.92；講義程式範例 est 1.5, lo 1.3, hi 1.7
  const ev = rr => rr + Math.sqrt(rr * (rr - 1));
  return { ev, table: [[1.2, '1.69'], [1.5, '2.37'], [2.0, '3.41']], ci: [1.3, 1.7], ciE: '1.92',
    methods: ['迴歸調整', '配對', '加權', '分層'],
    parts: ['1 未測混淆與偏誤方向', '2 敏感度分析的結果', '3 資料結構的限制', '4 結論能說到哪裡'],
    bad: ['「本研究為橫斷面設計，', '　無法推論因果，', '　未來研究可採縱貫設計。」'],
    good: ['「原本的運動興趣未被測量，它會同時提高', '　參加社團與規律運動的機率，使估計偏高。', '　E-value 為 [__]，而已測最強的混淆因子', '　（性別）與兩者的關聯約為 [__]。⋯⋯', '　本研究的估計應視為社團效果的上限。」'] };
})();

const RW15E1 = (() => {
  const pill = (x, y, w, h, s, fill, o = {}) => { shape(roundRectPts(x - w / 2, y - h / 2, w, h, 18), { fill, w: 3.5, color: o.color }); txt(s, x, y + 1, o.size || 34, { color: o.tc || COL.black }); };
  const dashLine = (x0, y0, x1, y1, o = {}) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L / 26)); for (let i = 0; i < n; i++) { const a = i / n, b = (i + .55) / n; inkLine(lerp(x0, x1, a), lerp(y0, y1, a), lerp(x0, x1, b), lerp(y0, y1, b), { w: 3.5, ...o }); } };
  const dot = (x, y, r, fill, color) => shape(ellPts(x, y, r, r, 0, Math.PI * 2, 18), { fill, w: 3.5, color });

  // 1 開場故事：1959 年 Cornfield 等人的論證
  const s1 = { beats: [0, 10.9, 21.67], draw(lt) {
    txt('1959｜吸菸與肺癌', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1.6, .6), () => { pill(300, 600, 230, 80, '吸菸', COL.blueL, { size: 42 }); pill(800, 600, 230, 80, '肺癌', COL.blueL, { size: 42 }); });
    arrow(425, 600, 675, 600, { w: 6, head: 20, p: prog(lt, 2.6, .8) });
    appear(prog(lt, 3.4, .6), () => txt('比較容易得', 550, 560, 30, { color: COL.gray }));
    // 沒測到的體質
    const kq = prog(lt, 6.2, .8), gone = prog(lt, 21.9, .8);
    appear(kq, () => pill(550, 340, 340, 80, '沒測到的體質？', COL.pinkL, { size: 38, color: COL.red }));
    if (kq > 0) { appear(kq, () => { dashLine(470, 385, 335, 550, { color: COL.red }); dashLine(630, 385, 765, 550, { color: COL.red }); }); }
    // 康菲爾德等六位學者
    const k2 = prog(lt, 11, .8);
    appear(k2, () => {
      paperSheet(1430, 300, 720, 200, .012);
      txt('Cornfield 等六位作者（1959）', 1430, 262, 38, { color: COL.black });
      txt('〈吸菸與肺癌〉', 1430, 330, 34, { color: COL.gray });
      stick(1430, GY, 1.1, { hair: 'cap', mouth: 'smile', la: [Math.PI * .95, Math.PI * 1.15], ra: Math.PI * .35, bob: idle(RLT) * .4 });
    });
    appear(prog(lt, 15.2, .7), () => { txt('至少要和', 205, 420, 34, { color: COL.red }); txt('風險比一樣強', 205, 466, 34, { color: COL.red }); });
    appear(prog(lt, 15.2, .7), () => txt('才解釋得掉', 1060, 600, 34, { color: COL.red }));
    if (gone > 0) cross(550, 340, 1.5, gone);
    appear(prog(lt, 22.6, .6), () => txt('當時找不到這麼強的因子', 550, 250, 38, { color: COL.red }));
    noteBox(620, 780, 860, 90, [['後來被視為敏感度分析的起點', 42, COL.black]], '#fff8e2', prog(lt, 24.6, .7));
  } };

  // 2 回到課堂
  const s2 = { beats: [0, 8.29], draw(lt) {
    ground(lt, 140, 1780);
    txt('回到課堂：社團與規律運動', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1.2, .6), () => { pill(300, 640, 270, 80, '參加社團', COL.mustard, { size: 40 }); pill(860, 640, 270, 80, '規律運動', COL.greenL, { size: 40 }); });
    arrow(445, 640, 715, 640, { w: 6, head: 20, p: prog(lt, 2.2, .8) });
    const kq = prog(lt, 4.6, .8);
    appear(kq, () => {
      pill(580, 390, 420, 80, '原本的運動興趣', COL.pinkL, { size: 40, color: COL.red });
      txt('沒有測到', 580, 310, 36, { color: COL.red });
      dashLine(490, 435, 335, 590, { color: COL.red }); dashLine(670, 435, 825, 590, { color: COL.red });
    });
    appear(prog(lt, 8.4, .6), () => stick(1500, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat', bob: idle(RLT) * .3 }));
    bubble(1470, 400, 660, 100, 1500, 540, '它要多強，才能推翻結論？', 42, prog(lt, 11.4, .6));
    noteBox(1470, 265, 660, 80, [['沒測到的混淆因子一定存在', 38, COL.red]], '#fff8e2', prog(lt, 8.8, .6));
    stick(1150, GY, .85, { hair: 'pony', la: Math.PI * .7, ra: Math.PI * .3, mouth: lt > 8.3 ? 'o' : 'smile', bob: idle(RLT, 1) * .3 });
  } };

  // 3 雙重穩健：兩個模型，兩次機會
  const s3 = { beats: [0, 8.45, 12.34], draw(lt) {
    txt('雙重穩健估計', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const B = [[440, '結果模型', '對結果建模，調整混淆因子', COL.blue, 1.8], [1080, '處理模型', '對處理建模，得到傾向分數', COL.mustardD, 3.6]];
    const late = lt > 12.34, fade = 1 - prog(lt, 12.2, .5);
    B.forEach(([x, name, desc, col, at], i) => appear(prog(lt, at, .7), () => {
      shape(roundRectPts(x - 290, 220, 580, 390, 24), { fill: '#fffdf6', w: 4, color: col });
      txt(name, x, 285, 52, { color: col }); txt(desc, x, 355, 30, { color: COL.black });
    }));
    appear(prog(lt, 5.8, .6), () => txt('兩個模型，兩次機會', 760, 680, 46, { color: COL.black }));
    // 任一正確即可
    if (!late) {
      appear(prog(lt, 8.6, .5) * fade, () => { check(440, 470, 1.1, prog(lt, 8.6, .5)); txt('設定正確', 440, 550, 34, { color: COL.green }); });
      appear(prog(lt, 9.4, .5) * fade, () => { cross(1080, 470, 1, prog(lt, 9.4, .5)); txt('設定錯誤', 1080, 550, 34, { color: COL.red }); });
      appear(prog(lt, 10.4, .6) * fade, () => noteBox(760, 780, 700, 90, [['其中一個正確，估計就一致', 40, COL.green]], '#fff8e2', 1));
    } else {
      // 兩個模型都少了同一個變項
      [440, 1080].forEach((x, i) => {
        appear(prog(lt, 15 + i * .5, .6), () => { shape(roundRectPts(x - 170, 432, 340, 64, 16), { fill: COL.pinkL, w: 3.5, color: COL.red }); txt('少了同一個變項', x, 465, 34, { color: COL.red }); });
        if (lt > 18.4 + i * .4) cross(x, 550, .8, prog(lt, 18.4 + i * .4, .5));
      });
      appear(prog(lt, 12.6, .6), () => txt('保護的是：模型設定錯誤', 760, 760, 40, { color: COL.blue }));
      noteBox(760, 830, 700, 76, [['兩次機會都是錯的', 40, COL.red]], '#fff8e2', prog(lt, 19.4, .6));
    }
    stick(1640, GY, 1.0, { hair: 'tuft', la: Math.PI * .7, ra: [-Math.PI * .1, -Math.PI * .35], mouth: late ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 4 主視覺：風險比對 E-value 的曲線，加上一個可移動的點
  const s4 = { beats: [0, 14.88, 20.45, 24.02, 29.99], draw(lt) {
    const X0 = 210, XW = 880, Y0 = 770, YH = 520;
    const PX = rr => X0 + (rr - 1) / 1.2 * XW, PY = e => Y0 - (e - 1) / 3 * YH;
    txt('E 值：未測混淆要多強', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    appear(prog(lt, 1, .7), () => {
      paperSheet(1530, 250, 620, 150, .012);
      txt('VanderWeele & Ding（2017）', 1530, 222, 36, { color: COL.black });
      txt('Ann Intern Med, 167(4), 268–274', 1530, 280, 28, { color: COL.gray });
    });
    appear(prog(lt, 5.4, .6), () => txt('未測因子和處理、結果', 1530, 375, 34, { color: COL.black }));
    appear(prog(lt, 8.2, .6), () => txt('各要多強的關聯，', 1530, 421, 34, { color: COL.black }));
    appear(prog(lt, 11, .6), () => txt('才能完全解釋掉？', 1530, 467, 34, { color: COL.red }));
    // 座標軸
    const ka = prog(lt, 9, 1);
    axis(X0 - 20, X0 + XW + 40, Y0, { p: ka }); arrow(X0, Y0 + 20, X0, Y0 - YH - 50, { w: 4, head: 16, p: ka });
    appear(ka, () => {
      txt('E 值', X0 + 26, Y0 - YH - 30, 32, { color: COL.gray, align: 'left' });
      txt('觀察到的風險比', X0 + XW - 80, Y0 + 82, 30, { color: COL.gray });
      [1, 1.2, 1.5, 2].forEach(v => { inkLine(PX(v), Y0, PX(v), Y0 + 12, { w: 3 }); txt(v.toFixed(1), PX(v), Y0 + 40, 30, { color: COL.gray }); });
      [1, 2, 3, 4].forEach(v => { inkLine(X0 - 12, PY(v), X0, PY(v), { w: 3 }); txt(String(v), X0 - 36, PY(v), 30, { color: COL.gray }); });
    });
    // 公式與曲線
    appear(prog(lt, 15, .7), () => txt('E 值 = RR + √(RR × (RR − 1))', 1530, 545, 36, { color: COL.blue }));
    appear(prog(lt, 15, .7), () => txt('RR：風險比', 1530, 592, 26, { color: COL.gray }));
    const kc = prog(lt, 16, 3.6);
    if (kc > 0) { const pts = []; for (let i = 0; i <= 60; i++) { const rr = 1 + 1.15 * i / 60; pts.push([PX(rr), PY(RW15.ev(rr))]); } ink(pts, { w: 6, color: COL.blue, p: kc }); }
    // 可移動的點
    const m1 = ease(prog(lt, 24.1, 1.3)), m2 = ease(prog(lt, 26.9, 1.3)), m3 = ease(prog(lt, 30.2, 1.2)), m4 = ease(prog(lt, 34.4, 1.4));
    const rr = 1.2 + .3 * m1 + .5 * m2 - .5 * m3 - .2 * m4, e = RW15.ev(rr), kp = prog(lt, 20.5, .6);
    const reach = [20.9, 25.4, 28.2];
    RW15.table.forEach(([r, lab], i) => appear(prog(lt, reach[i], .5), () => {
      dot(PX(r), PY(RW15.ev(r)), 9, COL.white, COL.blue);
      txt(lab, PX(r) - 22, PY(RW15.ev(r)) - (i ? 34 : 68), 38, { color: COL.black, align: 'right' });
      txt('風險比 ' + r.toFixed(1) + '　→　' + lab, 1530, 655 + i * 52, 36, { color: COL.black });
    }));
    // 信賴區間
    const kci = prog(lt, 31.6, .8);
    if (kci > 0) {
      const y = Y0 - 46; inkLine(PX(RW15.ci[0]), y, PX(RW15.ci[1]), y, { w: 5, color: COL.red, p: kci });
      appear(kci, () => { inkLine(PX(1.3), y - 14, PX(1.3), y + 14, { w: 5, color: COL.red }); inkLine(PX(1.7), y - 14, PX(1.7), y + 14, { w: 5, color: COL.red }); txt('信賴區間 1.3–1.7', PX(1.7) + 20, y, 30, { color: COL.red, align: 'left' }); });
    }
    appear(prog(lt, 36.2, .5), () => {
      txt('1.92', PX(1.3) + 30, PY(RW15.ev(1.3)) + 40, 38, { color: COL.red, align: 'left' });
      txt('下限 1.3　→　' + RW15.ciE, 1530, 822, 38, { color: COL.red });
    });
    appear(kp, () => {
      dashLine(PX(rr), PY(e) + 18, PX(rr), Y0 - 2, { color: COL.gray, w: 2.5 }); dashLine(X0 + 2, PY(e), PX(rr) - 18, PY(e), { color: COL.gray, w: 2.5 });
      dot(PX(rr), PY(e), 17, COL.mustard);
      const moving = (m1 > 0 && m1 < 1) || (m2 > 0 && m2 < 1) || (m3 > 0 && m3 < 1) || (m4 > 0 && m4 < 1);
      if (moving) txt(e.toFixed(2), PX(rr) + 30, PY(e) + 36, 34, { color: COL.mustardD, align: 'left', jit: .3 });
    });
  } };

  // 5 比較基準：和已測量的最強混淆因子比
  const s5 = { beats: [0, 8.21], draw(lt) {
    const BASE = 760, LY = 470;
    txt('E 值要有比較基準', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    axis(280, 1200, BASE, { p: prog(lt, .6, .6) }); arrow(300, BASE + 16, 300, 240, { w: 4, head: 16, p: prog(lt, .6, .6) });
    appear(prog(lt, .8, .6), () => txt('與處理、結果的關聯強度', 310, 205, 30, { color: COL.gray, align: 'left' }));
    const kl = prog(lt, 1.4, .8);
    appear(kl, () => { dashLine(302, LY, 1180, LY, { color: COL.blue, w: 4.5 }); txt('E 值 1.69', 1090, LY - 36, 38, { color: COL.blue }); });
    // 已測最強
    const k1 = prog(lt, 4.4, 1.2);
    if (k1 > 0) { bar(520, BASE, 170, 180 * ease(k1), COL.blueL); appear(k1, () => { txt('已測量的最強混淆因子', 520, BASE + 36, 30, { color: COL.black }); }); }
    // 未測的運動興趣：可能更強
    const k2 = ease(prog(lt, 8.6, 2.4));
    if (k2 > 0) {
      const h = 430 * k2; shape(rectPts(795, BASE - h, 170, h), { fill: COL.pinkL, w: 4, smooth: false, color: COL.red });
      appear(prog(lt, 8.4, .6), () => txt('原本的運動興趣（未測）', 900, BASE + 36, 30, { color: COL.red }));
      appear(prog(lt, 10.8, .5), () => txt('？', 880, BASE - 430 - 44, 60, { color: COL.red }));
    }
    appear(prog(lt, 1, .6), () => txt('（長條高度為示意）', 700, 850, 26, { color: COL.gray }));
    noteBox(1560, 300, 520, 150, [['只看 E 值，無法判斷', 36, COL.black], ['要和已測最強的比', 36, COL.blue]], '#fff8e2', prog(lt, 2.6, .7));
    noteBox(1560, 470, 520, 90, [['結論就站不住', 44, COL.red]], '#fff8e2', prog(lt, 14, .6));
    stick(1560, GY, 1.0, { glasses: true, la: [Math.PI * 1.05, Math.PI * 1.2], ra: Math.PI * .35, mouth: lt > 8.2 ? 'flat' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 6 多種方法一致，只說明了一半
  const s6 = { beats: [0, 7.81, 14.82], draw(lt) {
    txt('四種方法結果一致，代表什麼', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const MX = i => 250 + i * 290, off = [-14, 10, -4, 16];
    RW15.methods.forEach((m, i) => {
      appear(prog(lt, .6 + i * .75, .5), () => pill(MX(i), 260, 240, 70, m, '#fffdf6', { size: 38 }));
      appear(prog(lt, 3.6 + i * .2, .5), () => { inkLine(MX(i) - 70 + off[i], 350, MX(i) + 70 + off[i], 350, { w: 4 }); dot(MX(i) + off[i], 350, 12, COL.blueL); });
    });
    appear(prog(lt, 3.6, .5), () => dashLine(160, 395, 1210, 395, { color: COL.gray, w: 2 }));
    appear(prog(lt, 4.6, .6), () => { txt('估計相近', 1500, 262, 44, { color: COL.green }); txt('（估計的位置為示意）', 1500, 350, 26, { color: COL.gray }); });
    // 同一組變項、同一個假設
    const kb = prog(lt, 8, .8);
    RW15.methods.forEach((m, i) => { const p = prog(lt, 8.4 + i * .3, .7); if (p > 0) arrow(MX(i), 410, lerp(MX(i), 685, .55), 520, { w: 4, head: 14, color: COL.blue, p }); });
    appear(kb, () => { shape(roundRectPts(405, 530, 560, 90, 20), { fill: COL.blueL, w: 4, color: COL.blue }); txt('調整的是同一組變項', 685, 576, 42, { color: COL.black }); });
    const kh = prog(lt, 11.4, .7);
    if (kh > 0) arrow(685, 628, 685, 690, { w: 5, head: 16, color: COL.red, p: kh });
    appear(kh, () => { shape(roundRectPts(385, 700, 600, 90, 20), { fill: COL.pinkL, w: 4, color: COL.red }); txt('同一個假設：沒有未測混淆', 685, 746, 40, { color: COL.red }); });
    // 一致說明了什麼
    appear(prog(lt, 15, .6), () => { check(1290, 470, .7, prog(lt, 15.2, .5)); txt('結果不受「怎麼調整」影響', 1340, 470, 34, { color: COL.green, align: 'left' }); });
    appear(prog(lt, 18.6, .6), () => { cross(1290, 560, .7, prog(lt, 18.8, .5)); txt('不說明調整的變項夠不夠', 1340, 560, 34, { color: COL.red, align: 'left' }); });
    stick(1560, GY, .85, { hair: 'pony', la: Math.PI * .7, ra: Math.PI * .3, mouth: lt > 7.8 ? 'o' : 'smile', bob: idle(RLT) * .3 });
  } };

  // 7 限制段落：兩段文字並排（右下角留給資料來源卡）
  const s7 = { beats: [0, 13.01, 21.38, 31.35], draw(lt) {
    txt('限制段落怎麼寫', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    [3.4, 6.2, 8.2, 10.4].forEach((at, i) => appear(prog(lt, at, .5), () => pill(275 + i * 440, 235, 416, 64, RW15.parts[i], '#fff8e2', { size: 32 })));
    // 不好的寫法
    const kb = prog(lt, 13.1, .7);
    appear(kb, () => { paperSheet(470, 480, 780, 360, -.008); txt('不好的寫法', 470, 340, 40, { color: COL.red }); });
    RW15.bad.forEach((l, i) => txt(l, 130, 420 + i * 56, 34, { align: 'left', color: COL.black, p: prog(lt, 14 + i * 1.1, 1.4), jit: .5 }));
    appear(prog(lt, 18.4, .6), () => txt('可以貼在任何一篇論文後面', 470, 612, 34, { color: COL.red }));
    // 較好的寫法
    const kg = prog(lt, 21.5, .7);
    appear(kg, () => { paperSheet(1390, 480, 940, 360, .008); txt('較好的寫法', 1390, 340, 40, { color: COL.green }); });
    RW15.good.forEach((l, i) => txt(l, 950, 400 + i * 50, 30, { align: 'left', color: COL.black, p: prog(lt, 22.2 + i * 1.2, 1.6), jit: .5 }));
    const ux = (line, pre) => 950 + measure(RW15.good[line].slice(0, pre), 30);
    if (lt > 26) underline(ux(1, 15), ux(1, 20), 472, { p: prog(lt, 26, .5), color: COL.red });
    if (lt > 29.4) underline(ux(4, 14), ux(4, 16), 622, { p: prog(lt, 29.4, .5), color: COL.red });
    // 結語
    noteBox(500, 780, 860, 100, [['限制段落告訴讀者：結論可以用到哪裡', 40, COL.black]], '#fff8e2', prog(lt, 31.5, .7));
  } };

  const order = [[s1, 29.5], [s2, 16.4], [s3, 21.8], [s4, 39.5], [s5, 17.1], [s6, 23.4], [s7, 39.4]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 15 週　沒測到的混淆，要多強才能推翻結論', scenes,
    sources: ['資料來源', 'Cornfield 等 (1959)；重刊於 Int J Epidemiol 2009;38(5):1175–1191', 'VanderWeele & Ding (2017). Ann Intern Med, 167(4), 268–274', '林彥光老師講義〈第 15 週 因果推論（三）：雙重穩健與敏感度分析〉'] };
})();
EPISODES['rw15e1'] = RW15E1;
