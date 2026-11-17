// 真實世界運動大數據分析：第 13 週 EP1　是社團的效果，還是本來就愛運動
const RW13 = {
  // w13.json「混淆、中介、衝突因子」提示與測驗 q4、q5、h4：網站工具 dagadj 的模擬資料（不是調查資料）
  // [結構, Z 的例子, 真值, 不調整, 調整後, 該不該調整, Z 與 X、Y 的箭頭方向]
  dag: [
    ['混淆', '性別', 0.50, 0.89, 0.49, '要調整', 'ZX', 'ZY'],
    ['中介', '運動技能', 0.60, 0.62, 0.22, '不要調整', 'XZ', 'ZY'],
    ['衝突因子', '校隊', 0.50, 0.52, -0.24, '不要調整', 'XZ', 'YZ'],
  ],
  // 講義 W13 第 2 節：三個識別假設
  assume: [
    ['可交換性', COL.red, ['調整某些變項後', '兩組可以比'], '不能'],
    ['正值性', COL.blue, ['每一種特徵的學生', '都有機會落在兩組'], '可以部分檢查'],
    ['一致性', COL.green, ['「參加社團」的定義', '夠明確'], '靠定義'],
  ],
  // 講義 W13 第 5 節：目標試驗表
  trial: [
    ['納入條件', '學期初未參加運動社團的學生', '無法得知學期初狀態'],
    ['處理策略', '參加社團一學期，對照不參加', '調查時自述是否參加'],
    ['分派', '隨機', '調整測得的混淆因子'],
    ['追蹤起點', '分派當日', '不存在，兩者同時測量'],
    ['結果', '學期末的規律運動', '調查時的規律運動'],
    ['因果對比', '兩組規律運動比例之差', '調整後的比例差'],
  ],
};

const RW13E1 = (() => {
  const f2 = v => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
  const dashH = (x0, x1, y, o) => { for (let x = x0; x < x1; x += 26) inkLine(x, y, Math.min(x + 14, x1), y, { w: 3, ...o }); };
  const dashV = (x, y0, y1, o) => { for (let y = y0; y < y1; y += 26) inkLine(x, y, x, Math.min(y + 14, y1), { w: 3, ...o }); };
  const node = (x, y, w, h, label, size, o = {}) => { shape(roundRectPts(x - w / 2, y - h / 2, w, h, 18), { fill: o.fill || '#fffdf6', w: 4, color: o.color }); txt(label, x, y + 2, size, { color: o.tc || COL.black }); };

  // 1 課堂情境
  const s1 = { beats: [0, 6.21, 9.46], draw(lt) {
    ground(lt, 140, 1780);
    txt('參加運動社團的學生，比較規律運動', 960, 150, 56, { p: prog(lt, .4, 1.6), color: COL.black });
    stick(330, GY, 1.0, { hair: 'pony', la: Math.PI * .75, ra: [-Math.PI * .1, -Math.PI * .15], bob: idle(RLT) * .3 });
    // 同學的圖（示意，不放數字）
    appear(prog(lt, 1, .6), () => { paperSheet(760, 560, 520, 420, -.015); txt('規律運動比例（示意圖）', 760, 395, 28, { color: COL.gray }); });
    const kb = ease(prog(lt, 2.2, 1.6));
    if (kb > 0) { axis(560, 960, 720, { p: 1 }); bar(670, 720, 110, 150 * kb, COL.blueL); bar(850, 720, 110, 250 * kb, COL.mustard); }
    appear(prog(lt, 2.6, .5), () => { txt('未參加', 670, 752, 28, { color: COL.black }); txt('參加社團', 850, 752, 28, { color: COL.black }); });
    bubble(420, 300, 520, 96, 350, 420, '可見社團讓人動起來！', 40, prog(lt, 6.3, .5) * (1 - prog(lt, 9.3, .4)));
    appear(prog(lt, 9.5, .6), () => stick(1500, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat' }));
    appear(prog(lt, 9.9, .6), () => noteBox(1400, 330, 740, 150, [['是社團的效果？', 42, COL.black], ['還是本來就愛運動？', 42, COL.red]], '#fff8e2', 1));
  } };

  // 2 反事實：兩個結果，只看得到一個
  const s2 = { beats: [0, 8.42, 16.39], draw(lt) {
    txt('反事實：每位學生有兩個結果', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    stick(230, GY, 1.0, { hair: 'tuft', la: Math.PI * .7, ra: Math.PI * .3, mouth: lt > 12 ? 'flat' : 'smile', bob: idle(RLT) * .3 });
    const kA = prog(lt, 2.6, .7), kB = prog(lt, 5.2, .7), hide = prog(lt, 12.6, .8);
    if (kA > 0) arrow(330, 600, 520, 350, { w: 5, head: 16, p: kA });
    if (kB > 0) arrow(330, 680, 520, 700, { w: 5, head: 16, p: kB });
    appear(kA, () => { shape(roundRectPts(540, 255, 520, 170, 20), { fill: COL.greenL, w: 4 }); txt('參加社團', 800, 305, 42, { color: COL.black }); txt('有沒有規律運動？', 800, 372, 36, { color: COL.black }); });
    appear(kB, () => { shape(roundRectPts(540, 620, 520, 170, 20), { fill: hide > .5 ? '#e4e0d6' : COL.blueL, w: 4 }); });
    appear(kB * (1 - hide), () => { txt('不參加', 800, 670, 42, { color: COL.black }); txt('有沒有規律運動？', 800, 737, 36, { color: COL.black }); });
    appear(hide, () => { txt('？', 800, 690, 96, { color: COL.gray }); txt('永遠看不到', 800, 760, 30, { color: COL.red }); });
    appear(prog(lt, 8.6, .6), () => { txt('效果 ＝ 兩個結果的差', 800, 522, 44, { color: COL.red }); });
    appear(prog(lt, 11.2, .5), () => { check(1110, 340, .7, prog(lt, 11.2, .5)); txt('實現了', 1200, 400, 30, { color: COL.green }); });
    // 別人的資料
    const kO = prog(lt, 16.5, .8);
    appear(kO, () => {
      txt('別人的資料', 1520, 520, 40, { color: COL.black });
      for (let i = 0; i < 10; i++) mini(1340 + (i % 5) * 90, 640 + Math.floor(i / 5) * 110, .55, COL.blue, 'dots');
    });
    if (lt > 17.6) arrow(1290, 700, 1080, 705, { w: 5, head: 16, color: COL.blue, p: prog(lt, 17.6, .8) });
    noteBox(1520, 300, 520, 100, [['別人必須夠像', 46, COL.red]], '#fff8e2', prog(lt, 19, .6));
  } };

  // 3 三個識別假設
  const s3 = { beats: [0, 8.05, 16.66], draw(lt) {
    txt('用觀察資料談因果：三個假設', 960, 140, 58, { p: prog(lt, .3, 1), color: COL.black });
    const AT = [3.2, 8.2, 12.6];
    RW13.assume.forEach(([name, col, tx, test], i) => { const x = 420 + i * 540; appear(prog(lt, AT[i], .7), () => {
      shape(roundRectPts(x - 235, 250, 470, 440, 24), { fill: '#fffdf6', w: i === 0 && lt > 16.66 ? 6 : 4, color: i === 0 && lt > 16.66 ? COL.red : undefined });
      txt(String(i + 1), x - 180, 320, 60, { color: col }); txt(name, x + 30, 320, 52, { color: col });
      tx.forEach((s, j) => txt(s, x, 420 + j * 54, 34, { color: COL.black }));
      appear(prog(lt, 16.8 + i * .5, .5), () => { txt('能用資料檢驗嗎', x, 566, 26, { color: COL.gray }); txt(test, x, 625, 42, { color: i === 0 ? COL.red : COL.black }); });
    }); });
    noteBox(960, 790, 1000, 90, [['可交換性：只能靠領域知識主張', 42, COL.red]], '#fff8e2', prog(lt, 19.4, .6));
  } };

  // 4 主視覺：因果圖的三種結構，切換調整／不調整（模擬資料）
  const s4 = { beats: [0, 8.18, 19.75, 30.84, 42.49], draw(lt) {
    txt('因果圖：三種結構', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const P0 = [8.18, 19.75, 30.84], TU = [15.0, 26.4, 36.2], TA = [17.6, 28.2, 38.6], TR = [13.4, 24.8, 31.6];
    const ph = lt < P0[1] ? 0 : lt < P0[2] ? 1 : 2, [name, zname, truth, vU, vA, verdict, e1, e2] = RW13.dag[ph];
    const on = lt >= P0[0], adj = on && lt >= TA[ph] + .3, kin = prog(lt, P0[ph], .6);
    const XX = 230, XY = 830, YB = 640, XZ = 530, YZ = 330;
    // 節點
    appear(prog(lt, 1.2, .6), () => node(XX, YB, 300, 100, '參加社團', 42));
    appear(prog(lt, 2.0, .6), () => node(XY, YB, 300, 100, '規律運動', 42));
    if (lt > 2.8) arrow(385, YB, 675, YB, { w: 6, head: 18, p: prog(lt, 2.8, .8) });
    appear(prog(lt, 4.2, .6), () => node(XZ, YZ, 300, 100, on ? '' : '第三個變項', 40, { fill: adj ? COL.mustard : '#fffdf6' }));
    if (on) {
      appear(kin, () => { txt(zname, XZ, YZ + 2, 42, { color: COL.black }); txt(name, XZ, 222, 54, { color: ph === 0 ? COL.blue : COL.red }); });
      const pa = prog(lt, P0[ph] + 1.2, .8), pb = prog(lt, P0[ph] + 2.4, .8), col = ph === 0 ? COL.blue : COL.red;
      if (pa > 0) { if (e1 === 'ZX') arrow(440, 388, 300, 582, { w: 6, head: 18, color: col, p: pa }); else arrow(300, 582, 440, 388, { w: 6, head: 18, color: col, p: pa }); }
      if (pb > 0) { if (e2 === 'ZY') arrow(620, 388, 760, 582, { w: 6, head: 18, color: col, p: pb }); else arrow(760, 582, 620, 388, { w: 6, head: 18, color: col, p: pb }); }
      const kv = prog(lt, TA[ph] + 1.4, .5);
      appear(kv, () => { txt(verdict, XZ, 500, 42, { color: ph === 0 ? COL.green : COL.red }); if (ph === 0) check(XZ, 560, .55, kv); else cross(XZ, 562, .5, kv); });
    }
    // 右側：估計值
    const AX = v => 1140 + (v + .4) / 1.4 * 600, AY = 580;
    appear(prog(lt, 5.0, .6), () => {
      txt('模擬資料（課程網站工具）：估計的效果', 1440, 215, 34, { color: COL.blue });
      const act = adj ? 1 : 0;
      ['不調整', '調整'].forEach((s, i) => { const x = 1335 + i * 210; shape(roundRectPts(x - 100, 258, 200, 70, 20), { fill: on && lt >= TU[ph] - .6 && act === i ? COL.mustard : COL.white, w: 4 }); txt(s, x, 294, 36, { color: COL.black }); });
      inkLine(AX(-.4), AY, AX(1.03), AY, { w: 4 });
      [0, .5, 1].forEach(v => { inkLine(AX(v), AY, AX(v), AY + 12, { w: 3 }); txt(v === 0 ? '0' : v.toFixed(1), AX(v), AY + 38, 28, { color: COL.gray }); });
      inkLine(AX(0), 450, AX(0), AY, { w: 3, color: COL.gray });

    });
    if (on) {
      // 真值
      const tv = lerp(lerp(.5, .6, ease(prog(lt, TR[1], .8))), .5, ease(prog(lt, TR[2], .8)));
      appear(prog(lt, TR[0], .6), () => { dashV(AX(tv), 425, AY, { color: COL.green }); txt('真值 ' + (lt >= TR[1] + .4 && lt < TR[2] + .4 ? '0.60' : '0.50'), AX(tv), 398, 34, { color: COL.green }); });
      // 估計值長條
      const ks = prog(lt, TU[ph], .5), km = ease(prog(lt, TA[ph], 1.2)), v = lerp(vU, vA, km), shown = km < .5 ? vU : vA;
      appear(ks, () => {
        const x0 = AX(0), x1 = AX(v * ease(ks)), far = Math.abs(v - truth) > .08;
        shape(rectPts(Math.min(x0, x1), 478, Math.abs(x1 - x0), 70), { fill: far ? COL.pinkL : COL.greenL, w: 4, smooth: false });
        txt(f2(shown), x1 + (v < 0 ? -78 : 78), 514, 46, { color: far ? COL.red : COL.green });
      });
      if (ph === 2) appear(prog(lt, 40.6, .5), () => txt('方向反了', 1230, 440, 40, { color: COL.red }));
    }
    // 紀錄
    RW13.dag.forEach(([n, z, t, u, a, vd], i) => appear(prog(lt, TA[i] + 1.6, .6), () => {
      const y = 690 + i * 55;
      txt(n, 1090, y, 32, { align: 'left', color: COL.black }); txt(f2(u) + ' → ' + f2(a), 1420, y, 32, { color: COL.black }); txt(vd, 1810, y, 32, { align: 'right', color: i === 0 ? COL.green : COL.red });
    }));
    noteBox(530, 790, 880, 90, [['全部放進模型，不會比較安全', 42, COL.red]], '#fff8e2', prog(lt, 42.7, .6));
  } };

  // 5 目標試驗表
  const s5 = { beats: [0, 8.29, 14.98], draw(lt) {
    txt('目標試驗表', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const X0 = 140, X1 = 400, X2 = 1090, X3 = 1780, Y0 = 200, HH = 64, RH = 82, YR = i => Y0 + HH + i * RH, hl = prog(lt, 18.6, .7);
    appear(prog(lt, .8, .6), () => {
      shape(rectPts(X0, Y0, X3 - X0, HH + 6 * RH), { fill: '#fffdf6', w: 4, smooth: false });
      inkLine(X0, Y0 + HH, X3, Y0 + HH, { w: 4 }); inkLine(X1, Y0, X1, Y0 + HH + 6 * RH, { w: 3 }); inkLine(X2, Y0, X2, Y0 + HH + 6 * RH, { w: 3 });
      for (let i = 1; i < 6; i++) inkLine(X0, YR(i), X3, YR(i), { w: 2, color: COL.gray });
    });
    appear(hl, () => shape(rectPts(X0, YR(3), X3 - X0, RH), { fill: COL.pinkL, w: 6, smooth: false, color: COL.red }));
    appear(prog(lt, 3.0, .6), () => txt('如果能做隨機試驗', (X1 + X2) / 2, Y0 + HH / 2, 36, { color: COL.green }));
    appear(prog(lt, 5.6, .6), () => txt('手上這份調查', (X2 + X3) / 2, Y0 + HH / 2, 36, { color: COL.blue }));
    RW13.trial.forEach(([a, b, c], i) => {
      const y = YR(i) + RH / 2;
      txt(a, (X0 + X1) / 2, y, 34, { color: COL.black, p: prog(lt, 1.4 + i * .35, .5) });
      appear(prog(lt, [8.5, 9.6, 10.8, 11.4, 12.4, 13.2][i], .5), () => txt(b, X1 + 30, y, 32, { align: 'left', color: COL.black }));
      appear(prog(lt, 15.2 + i * .5, .5), () => txt(c, X2 + 30, y, 32, { align: 'left', color: i === 3 && hl > 0 ? COL.red : (i === 0 || i === 3 ? COL.red : COL.black) }));
    });
    appear(prog(lt, 20.6, .6), () => txt('最大的問題：參加社團與規律運動同時測量，分不出先後', 960, 825, 42, { color: COL.red }));
  } };

  // 6 未測量的混淆與誠實的結論
  const s6 = { beats: [0, 8.11, 16.24], draw(lt) {
    txt('誠實的結論', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    // 左：未測量的混淆
    appear(prog(lt, .8, .6), () => {
      const x = 290, y = 255, w = 380, h = 96;
      shape(roundRectPts(x, y, w, h, 18), { fill: '#f3efe4', stroke: false });
      dashH(x + 10, x + w - 10, y, {}); dashH(x + 10, x + w - 10, y + h, {}); dashV(x, y + 10, y + h - 10, {}); dashV(x + w, y + 10, y + h - 10, {});
      txt('原本就愛運動', x + w / 2, y + h / 2 + 2, 40, { color: COL.black });
    });
    appear(prog(lt, 3.4, .5), () => txt('調查沒有問', 760, 232, 34, { color: COL.red, align: 'left' }));
    appear(prog(lt, 5.6, .5), () => txt('未測量', 760, 290, 34, { color: COL.red, align: 'left' }));
    appear(prog(lt, 1.4, .6), () => { node(230, 560, 280, 96, '參加社團', 40); node(730, 560, 280, 96, '規律運動', 40); });
    if (lt > 1.8) { arrow(400, 360, 270, 505, { w: 6, head: 18, color: COL.red, p: prog(lt, 1.8, .7) }); arrow(560, 360, 690, 505, { w: 6, head: 18, color: COL.red, p: prog(lt, 2.4, .7) }); }
    if (lt > 2.8) { arrow(375, 560, 585, 560, { w: 5, head: 16, color: COL.gray, p: prog(lt, 2.8, .6) }); txt('？', 480, 520, 44, { color: COL.gray, p: prog(lt, 3.2, .4) }); }
    stick(480, GY, .62, { glasses: true, la: Math.PI * .75, ra: [-Math.PI * .25, -Math.PI * .4], bob: idle(RLT) * .3 });
    // 右：結論的寫法
    appear(prog(lt, 8.2, .7), () => { paperSheet(1410, 520, 800, 560, .01); txt('結論', 1060, 295, 34, { color: COL.gray, align: 'left' }); });
    const L = [['調整 [__] 之後，', 8.9, COL.black], ['參加社團與規律運動有關聯，', 11.0, COL.black], ['比例差為 [__]。', 13.6, COL.black], ['由於兩者同時測量，', 17.0, COL.black], ['且缺乏先前運動習慣的資料，', 18.6, COL.black], ['這個關聯不能解讀為社團的效果。', 21.4, COL.red]];
    L.forEach(([s, at, col], i) => txt(s, 1060, 370 + i * 68 + (i > 2 ? 24 : 0), 38, { align: 'left', color: col, p: prog(lt, at, 1.0), jit: .5 }));
    if (lt > 22.6) underline(1060, 1625, 763, { p: prog(lt, 22.6, .6), color: COL.red });
  } };

  // 7 結語（右下角留給資料來源卡）
  const s7 = { beats: [0, 5.88], draw(lt) {
    ground(lt, 140, 790);
    txt('資料答不了，也是合格的結論', 960, 190, 84, { p: prog(lt, .2, .9), color: COL.black });
    underline(440, 1480, 256, { p: prog(lt, 1.1, .5), color: COL.mustardD });
    appear(prog(lt, 6.0, .7), () => txt('因果圖是研究者自己的主張', 1220, 400, 52, { color: COL.black }));
    appear(prog(lt, 8.2, .7), () => txt('每一個箭頭，都要說得出理由', 1220, 480, 52, { color: COL.red }));
    appear(prog(lt, 6.6, .6), () => { node(1050, 600, 200, 76, '社團', 36); node(1390, 600, 200, 76, '運動', 36); });
    if (lt > 8.4) arrow(1160, 600, 1280, 600, { w: 5, head: 16, color: COL.red, p: prog(lt, 8.4, .6) });
    stick(280, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(490, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(680, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 16.9], [s2, 22.4], [s3, 23.4], [s4, 48.1], [s5, 23.8], [s6, 25.3], [s7, 15.0]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 13 週　是社團的效果，還是本來就愛運動', scenes,
    sources: ['資料來源', '三種結構的估計值為課程網站因果圖工具的模擬資料，不是調查結果', 'Hernán & Robins (2016). American Journal of Epidemiology, 183(8), 758–764', '林彥光老師講義〈第 13 週 因果推論（一）：反事實、DAG 與目標試驗〉'] };
})();
EPISODES['rw13e1'] = RW13E1;
