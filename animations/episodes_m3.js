// 研究法工作坊｜第 3 章 研究方法。沿用第 1 章的小研、指導教授（episodes_m1.js）。
function rtag3(label) { return '研究法工作坊｜第 3 章 ' + label; }
const COACH = { ...DAD, top: { fill: '#2f5d8a' }, sleeve: { fill: '#2f5d8a' }, bottom: { fill: '#3b3b48' }, pose0: { spread: 50, mouth: 'smile' } };
const coach = (x, y, s, pose, opts) => figure(COACH, x, y, s, pose, opts);

function M3E6() {
  const s1 = { beats: [0, 4.5, 9, 14], sub: '紐倫堡守則與赫爾辛基宣言', draw(lt) {
    ground(lt);
    const k2 = prog(lt, 9, .6);
    appear(1 - k2, () => { txt('1947・紐倫堡', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black }); });
    appear(k2, () => { txt('1964・赫爾辛基', 960, 150, 70, { color: COL.black }); });
    underline(700, 1220, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    bench(560, 560, 640, 280);
    gavel(820, 470, -.5 + .4 * Math.sin(Math.min(lt, 3) * 3) * (lt < 3 ? 1 : 0), 1);
    txt('法庭', 560, 700, 40, { color: COL.white, p: prog(lt, .6, .6) });
    // 判決書
    appear(prog(lt, 4.6, .5), () => {
      scroll(1340, 260, 520, 360, prog(lt, 4.6, 1.2));
      txt('紐倫堡守則（十條）', 1340, 330, 36, { color: COL.black, p: prog(lt, 5.2, .8) });
      txt('第一條', 1340, 410, 32, { color: COL.gray, p: prog(lt, 5.8, .5) });
      txt('受試者的自願同意', 1340, 470, 42, { color: COL.red, p: prog(lt, 6.2, .8) });
      txt('絕對必要', 1340, 530, 42, { color: COL.red, p: prog(lt, 6.8, .6) });
    });
    chip(1340, 690, 600, 80, '1975 修訂：先經獨立委員會審查', COL.blueL, prog(lt, 10.5, .6), 32);
    appear(prog(lt, 14.2, .5), () => { chip(560, 300, 560, 90, 'IRB 研究倫理審查委員會', COL.mustard, 1, 36); sparkle(860, 270, 34, 1); });
  } };
  const s2 = { beats: [0, 2.6, 8], sub: '對參與者的四項守則', draw(lt) {
    txt('研究倫理＝做研究時的行為規範', 960, 140, 56, { p: prog(lt, .2, .9), color: COL.black });
    underline(560, 1360, 190, { p: prog(lt, 1, .5), color: COL.mustardD });
    const C = [[330, '誠實尊重', '公開身分與目的', COL.blueL, 2.8], [750, '隱私保密', '只蒐集必要資訊', COL.greenL, 3.6], [1170, '避免傷害', '還要讓參與者受惠', COL.pinkL, 4.4], [1590, '知情同意', '自願、可隨時退出', COL.mustard, 5.2]];
    C.forEach(([x, a, b, col, at]) => {
      const k = prog(lt, at, .6);
      appear(k, () => {
        shape(roundRectPts(x - 185, 280, 370, 220, 24), { fill: col, w: 4, smooth: false });
        txt(a, x, 360, 50, { color: COL.black, p: clamp(k * 1.4) });
        txt(b, x, 440, 28, { color: COL.black, p: clamp((k - .2) * 1.6) });
      });
    });
    appear(prog(lt, 8.2, .6), () => {
      noteBox(560, 650, 700, 120, [['匿名', 40, COL.red], ['隱藏可辨識身分的名字', 30]], '#fff8e2', 1);
      noteBox(1360, 650, 700, 120, [['保密', 40, COL.red], ['不把參與者說的話告訴別人', 30]], '#fff8e2', prog(lt, 9.4, .6));
    });
  } };
  const s3 = { beats: [0, 3.2, 7.4, 10.8], sub: '知情同意書的四個要素', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    bubble(260, 300, 440, 110, 190, 440, '同意書要寫什麼？', 34, prog(lt, .4, .5));
    paperSheet(1200, 470, 1260, 660, -.012);
    txt('知情同意書', 1200, 215, 44, { p: prog(lt, .6, .7), color: COL.black });
    const rows = [
      ['知識', COL.blueL, '研究者、目的、參與方式、風險、資料保存', 3.4],
      ['自主', COL.greenL, '任何時間、不需理由都可退出，不受影響', 7.6],
      ['能力', COL.pinkL, '未成年者須法定代理人同意', 11.0],
      ['理解', COL.mustard, '用參與者聽得懂的話說明', 12.4]];
    rows.forEach(([tag, c, s, at], i) => {
      const k = prog(lt, at, .9), y = 320 + i * 120;
      appear(k, () => { chip(700, y, 120, 56, tag, c, 1, 30); txt(s, 790, y + 2, 34, { color: COL.black, align: 'left', p: k }); });
    });
  } };
  const s4 = { beats: [0, 3.8, 7.2], sub: '保密與匿名的反例', draw(lt) {
    ground(lt, 80, 1840);
    coach(260, GY, .82, { ...IDLE_ARMS, ra: [-.5, -1.6], mouth: 'o', bob: idle(RLT) * .3 });
    student(1660, GY, .72, { ...IDLE_ARMS, look: -1, mouth: lt > 4 ? 'smile' : 'o', bob: idle(RLT, 1) * .3 });
    bubble(560, 230, 620, 110, 330, 370, '把選手的睡眠資料給我', 36, prog(lt, .3, .5));
    // 資料夾
    appear(prog(lt, 1.2, .5), () => { shape(roundRectPts(820, 330, 300, 220, 14), { fill: '#f3e3b5', w: 4, smooth: false }); txt('睡眠資料', 970, 440, 38, { color: COL.black }); });
    appear(prog(lt, 4.0, .4), () => { cross(970, 440, 2.2, prog(lt, 4.0, .4)); });
    noteBox(970, 640, 640, 90, [['只能用於研究目的：違反保密', 32, COL.red]], '#fff8e2', prog(lt, 4.6, .6));
    // 真名 → 代號
    appear(prog(lt, 7.4, .5), () => {
      shape(roundRectPts(1260, 250, 360, 200, 14), { fill: '#fffdf6', w: 4, smooth: false });
      txt('論文初稿', 1440, 290, 30, { color: COL.gray });
      txt('選手王小明', 1440, 360, 38, { color: COL.black });
      inkLine(1320, 360, 1560, 360, { w: 5, color: COL.red, p: prog(lt, 8.2, .4) });
      txt('→ 選手 A', 1440, 420, 36, { color: COL.green, p: prog(lt, 8.8, .5) });
    });
  } };
  const s5 = { beats: [0, 5.2], sub: '送審順序：受訓、送審、核准、同意、蒐集', draw(lt) {
    txt('送審順序', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(800, 1120, 185, { p: prog(lt, .8, .5), color: COL.mustardD });
    const F = ['受訓', '送審', '核准', '取得同意', '蒐集資料'];
    F.forEach((s, i) => {
      const x = 260 + i * 350, at = .8 + i * .8;
      chip(x, 330, 260, 90, s, i === 4 ? COL.mustard : COL.blueL, prog(lt, at, .5), 36);
      if (i < 4) appear(prog(lt, at + .4, .3), () => arrow(x + 135, 330, x + 215, 330, { w: 4, color: COL.red, head: 14 }));
    });
    noteBox(960, 520, 720, 100, [['先保護人，再談資料', 42, COL.red]], '#fff8e2', prog(lt, 5.4, .6));
    student(250, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    prof(1680, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT, 1) * .3 });
    appear(prog(lt, 6.2, .5), () => chip(960, 700, 560, 80, '課程網站 3.6 寫同意書要點', COL.greenL, 1, 32));
  } };
  const order = [[s1, 20], [s2, 13], [s3, 15], [s4, 12], [s5, 10]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('研究倫理與 IRB 怎麼送？'), scenes,
    sources: ['資料來源', 'World Medical Association, Declaration of Helsinki (1964; 1975 revision)', 'Nuremberg Code (1947)', '林彥光〈研究倫理〉講義；課程網站〈3.6 研究倫理與 IRB 送審〉'] };
}
EPISODES['m3e6'] = M3E6();

function envelope(x, y, s, k = 1, num) {
  appear(k, () => {
    shape(rectPts(x - 60 * s, y - 40 * s, 120 * s, 80 * s), { fill: '#f6e7c1', w: 3.5, smooth: false });
    ink([[x - 60 * s, y - 40 * s], [x, y + 6 * s], [x + 60 * s, y - 40 * s]], { w: 3.5 });
    if (num) txt(num, x, y + 24 * s, 26 * s, { color: COL.red });
  });
}
function M3E1() {
  const s1 = { beats: [0, 4.6, 9.4, 14], sub: '1948 年鏈黴素試驗', draw(lt) {
    ground(lt);
    txt('1948・英國', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(730, 1190, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { flask(330, 640, 1.3, COL.blueL); txt('鏈黴素', 330, 760, 36, { color: COL.black }); txt('肺結核', 330, 300, 40, { color: COL.gray }); });
    // 信封
    [[760, '1'], [920, '2'], [1080, '1'], [1240, '2'], [1400, '1']].forEach(([x, n], i) => envelope(x, 420, 1, prog(lt, 4.8 + i * .35, .4), lt > 7 ? (n === '1' ? '治療' : '對照') : ''));
    appear(prog(lt, 4.8, .5), () => txt('密封信封＋隨機號碼', 1080, 320, 34, { color: COL.black }));
    appear(prog(lt, 9.6, .6), () => {
      chip(860, 620, 340, 80, '治療組', COL.greenL, 1, 34); chip(1300, 620, 340, 80, '對照組', COL.blueL, 1, 34);
      txt('差異 ＝ 藥物的效果', 1080, 715, 38, { color: COL.red, p: prog(lt, 10.4, .6) });
    });
    appear(prog(lt, 14.2, .5), () => { chip(1080, 795, 640, 64, '隨機分派：讓兩組起點相同', COL.mustard, 1, 32); sparkle(1420, 785, 30, 1); });
  } };
  const s2 = { beats: [0, 2.4, 7.2], sub: '問題決定設計', draw(lt) {
    txt('問題決定設計', 960, 140, 64, { p: prog(lt, .2, .8), color: COL.black });
    underline(740, 1180, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const R = [[330, '問因果', '實驗／準實驗', COL.pinkL, 2.6], [960, '問關聯、預測', '相關研究', COL.greenL, 4.4], [1590, '問現況、差異', '調查研究', COL.blueL, 7.4]];
    R.forEach(([x, q, d, col, at]) => {
      const k = prog(lt, at, .6);
      appear(k, () => {
        chip(x, 320, 420, 90, q, COL.white, 1, 38);
        arrow(x, 375, x, 455, { w: 4, color: COL.red, head: 14 });
        shape(roundRectPts(x - 230, 470, 460, 130, 22), { fill: col, w: 4, smooth: false });
        txt(d, x, 535, 46, { color: COL.black, p: clamp(k * 1.4) });
      });
    });
    noteBox(1275, 710, 900, 90, [['調查與相關研究都不能回答因果', 34, COL.red]], '#fff8e2', prog(lt, 9.6, .6));
  } };
  const s3 = { beats: [0, 1.8, 6.4], sub: '實驗三要件', draw(lt) {
    txt('真正的實驗：三要件', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(680, 1240, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const E = [[400, '組別比較', 2.0], [960, '操弄自變項', 3.0], [1520, '隨機化', 4.0]];
    E.forEach(([x, s, at]) => { const k = prog(lt, at, .5); appear(k, () => { shape(roundRectPts(x - 220, 270, 440, 160, 22), { fill: COL.greenL, w: 4, smooth: false }); txt(s, x, 350, 46, { color: COL.black, p: clamp(k * 1.4) }); }); });
    appear(prog(lt, 6.6, .6), () => {
      txt('準實驗', 400, 560, 46, { color: COL.black });
      check(620, 520, .8, prog(lt, 7.0, .3)); txt('組別', 700, 530, 30, { color: COL.gray, align: 'left' });
      check(620, 600, .8, prog(lt, 7.3, .3)); txt('操弄', 700, 610, 30, { color: COL.gray, align: 'left' });
      cross(1400, 560, 1.2, prog(lt, 7.8, .4)); txt('不能隨機分派個人', 1400, 660, 34, { color: COL.red });
      txt('只能整班或整隊分組', 1400, 720, 30, { color: COL.gray, p: prog(lt, 8.4, .6) });
    });
  } };
  const s4 = { beats: [0, 3.6, 8.2, 10.6], sub: '小研的研究設計', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    bubble(260, 300, 460, 110, 190, 440, '訓練會讓成績進步嗎？', 34, prog(lt, .4, .5));
    paperSheet(1200, 470, 1260, 660, -.012);
    txt('採取方法與理由', 1200, 215, 44, { p: prog(lt, .6, .7), color: COL.black });
    const rows = [['目的', COL.blueL, '推論訓練對成績的因果影響', 3.8], ['方法', COL.greenL, '適合實驗研究', 5.2], ['限制', COL.pinkL, '只能以校隊為單位分組', 6.4], ['設計', COL.mustard, '不等組前後測準實驗設計', 8.4]];
    rows.forEach(([tag, c, s, at], i) => { const k = prog(lt, at, .8), y = 310 + i * 100; appear(k, () => { chip(700, y, 120, 52, tag, c, 1, 28); txt(s, 790, y + 2, 34, { color: COL.black, align: 'left', p: k }); }); });
    appear(prog(lt, 10.8, .6), () => {
      chip(860, 730, 300, 72, '肌力訓練', COL.greenL, 1, 32); arrow(1020, 730, 1180, 730, { w: 5, color: COL.red, head: 16 });
      chip(1400, 730, 380, 72, '2000 公尺成績', COL.blueL, 1, 32);
      txt('自變項', 860, 790, 24, { color: COL.gray }); txt('依變項', 1400, 790, 24, { color: COL.gray });
    });
  } };
  const s5 = { beats: [0, 4.4, 9], sub: '調查研究不能問因果', draw(lt) {
    ground(lt, 80, 1840);
    noteBox(960, 250, 1100, 110, [['專業背景對教學意願有什麼影響？', 40]], COL.white, prog(lt, .3, .5));
    appear(prog(lt, 1.6, .4), () => cross(1480, 250, 1.1, prog(lt, 1.6, .4)));
    appear(prog(lt, 4.6, .5), () => { arrow(960, 315, 960, 395, { w: 5, color: COL.green, head: 16 }); });
    noteBox(960, 470, 1100, 110, [['不同背景的人，意願是否有差異？', 40, COL.green]], '#eef7ef', prog(lt, 5.0, .6));
    appear(prog(lt, 9.2, .6), () => chip(960, 660, 520, 90, '問題決定設計', COL.mustard, 1, 42));
    student(250, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    prof(1680, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT, 1) * .3 });
  } };
  const order = [[s1, 19], [s2, 12], [s3, 11], [s4, 14], [s5, 12]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('研究設計怎麼選？'), scenes,
    sources: ['資料來源', 'Medical Research Council (1948). Streptomycin treatment of pulmonary tuberculosis. BMJ, 2, 769–782.', 'James Lind Library；Hektoen International', '林彥光〈量化研究設計與撰寫〉〈量化研究類型〉講義'] };
}
EPISODES['m3e1'] = M3E1();

function M3E4() {
  const SOL = { ...GOSSET, hat: undefined, hair: 'side', mustache: false, glasses: 'thick', top: { fill: '#5b6d8a', vest: true }, sleeve: { fill: '#5b6d8a' }, bottom: { fill: '#3b3b48' }, pose0: { spread: 48, mouth: 'smile' } };
  const flow = (y, lab, a, b, c, k, col) => appear(k, () => {
    chip(330, y, 150, 60, lab, col, 1, 28);
    [[560, a], [820, b], [1080, c]].forEach(([x, s], i) => { chip(x, y, 200, 60, s || '—', s ? COL.white : COL.paper, 1, 28); if (i < 2) arrow(x + 105, y, x + 155, y, { w: 3.5, color: COL.gray, head: 10 }); });
  });
  const s1 = { beats: [0, 5.2, 10.2, 15], sub: '所羅門四組設計', draw(lt) {
    ground(lt);
    txt('1949・所羅門', 960, 150, 66, { p: prog(lt, .2, .9), color: COL.black });
    underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    figure(SOL, 1620, GY, .9, { ...IDLE_ARMS, look: -1, mouth: lt > 5 && lt < 10 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    bubble(1500, 300, 520, 110, 1620, 420, '前測會影響後測嗎？', 36, prog(lt, .6, .5) * (1 - prog(lt, 9.8, .3)));
    appear(prog(lt, 5.4, .5) * (1 - prog(lt, 9.8, .3)), () => {
      paperSheet(560, 470, 300, 360, -.03); txt('前測', 560, 330, 40, { color: COL.black });
      arrow(740, 470, 900, 470, { w: 5, color: COL.red, head: 16 });
      paperSheet(1080, 470, 300, 360, .03); txt('後測', 1080, 330, 40, { color: COL.black });
      txt('比較熟了？', 1080, 520, 40, { color: COL.red, p: prog(lt, 6.4, .6) });
    });
    const k = prog(lt, 10.4, .5);
    flow(300, '第 1 組', '前測', '處理', '後測', k, COL.greenL);
    flow(400, '第 2 組', '前測', '', '後測', prog(lt, 10.9, .5), COL.blueL);
    flow(500, '第 3 組', '', '處理', '後測', prog(lt, 11.4, .5), COL.greenL);
    flow(600, '第 4 組', '', '', '後測', prog(lt, 11.9, .5), COL.blueL);
    appear(prog(lt, 15.2, .5), () => { chip(720, 740, 560, 80, '所羅門四組設計', COL.mustard, 1, 38); sparkle(1020, 715, 30, 1); });
  } };
  const s2 = { beats: [0, 1.8, 8], sub: '實驗設計三大類', draw(lt) {
    txt('實驗設計三大類', 960, 140, 62, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const C = [[360, '前實驗', ['單組後測', '單組前後測', '靜態組間比較'], '證據薄弱，只適合初探', '#ece8df', 2.0], [960, '真實驗', ['組別對照', '前後測', '隨機分派'], '可以推論因果', COL.greenL, 8.2], [1560, '準實驗', ['組別對照', '前後測', '沒有隨機分派'], '有操弄，整班或整隊分組', COL.blueL, 9.4]];
    C.forEach(([x, t, L, note, col, at]) => { const k = prog(lt, at, .6);
      appear(k, () => { shape(roundRectPts(x - 260, 250, 520, 470, 24), { fill: col, w: 4, smooth: false }); txt(t, x, 320, 50, { color: COL.black, p: clamp(k * 1.4) });
        L.forEach((s, i) => txt('・' + s, x, 410 + i * 62, 34, { color: s.startsWith('沒有') ? COL.red : COL.black }));
        txt(note, x, 660, 28, { color: COL.gray }); }); });
  } };
  const s3 = { beats: [0, 5.4, 11.2], sub: '用符號看設計', draw(lt) {
    txt('用符號看設計', 960, 140, 62, { p: prog(lt, .2, .8), color: COL.black });
    underline(760, 1160, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    [['R', '隨機分派', 1.0], ['T1', '前測', 1.8], ['X', '實驗處理', 2.6], ['T2', '後測', 3.4]].forEach(([a, b, at], i) => { const x = 330 + i * 420;
      appear(prog(lt, at, .5), () => { chip(x - 70, 290, 110, 70, a, COL.mustard, 1, 36); txt(b, x + 70, 292, 34, { color: COL.black, align: 'left' }); }); });
    const row = (y, g, r, x) => { txt(g, 420, y, 40, { color: COL.black }); if (r) txt('R', 600, y, 40, { color: COL.red }); txt('T1', 760, y, 40, { color: COL.black });
      arrow(830, y, 950, y, { w: 4, color: COL.gray, head: 12 }); if (x) txt('X', 1020, y, 44, { color: COL.blue }); arrow(1090, y, 1210, y, { w: 4, color: COL.gray, head: 12 }); txt('T2', 1280, y, 40, { color: COL.black }); };
    appear(prog(lt, 5.6, .6), () => { row(470, '實驗組', true, true); row(570, '控制組', true, false); txt('隨機化實驗控制組前後測設計', 860, 640, 32, { color: COL.green }); });
    appear(prog(lt, 11.4, .5), () => { cross(600, 520, 1.6, prog(lt, 11.4, .4)); noteBox(960, 720, 900, 90, [['拿掉隨機分派 → 非隨機實驗控制組前後測（準實驗）', 32, COL.red]], '#fff8e2', 1); });
  } };
  const s4 = { beats: [0, 5.6, 10.4], sub: '受試者間與受試者內', draw(lt) {
    txt('受試者間 vs 受試者內', 960, 140, 58, { p: prog(lt, .2, .8), color: COL.black });
    underline(640, 1280, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => {
      shape(roundRectPts(140, 250, 760, 330, 22), { fill: '#fffdf6', w: 4, smooth: false }); txt('受試者間：每人只接受一種', 520, 300, 34, { color: COL.black });
      [0, 1, 2].forEach(i => mini(260 + i * 90, 470, 1.4, COL.greenL, 'dots')); [0, 1, 2].forEach(i => mini(600 + i * 90, 470, 1.4, COL.blueL, 'dots'));
      txt('A', 350, 380, 36, { color: COL.green }); txt('B', 690, 380, 36, { color: COL.blue });
      shape(roundRectPts(1020, 250, 760, 330, 22), { fill: '#fffdf6', w: 4, smooth: false }); txt('受試者內：同一批人都接受', 1400, 300, 34, { color: COL.black });
      [0, 1, 2].forEach(i => mini(1260 + i * 90, 470, 1.4, COL.pinkL, 'dots')); txt('A → B', 1400, 380, 36, { color: COL.black });
    });
    appear(prog(lt, 5.8, .6), () => { noteBox(1400, 650, 760, 100, [['自己跟自己比：個別差異抵銷，檢定力較高', 30, COL.green]], '#eef7ef', 1); });
    appear(prog(lt, 10.6, .6), () => {
      const G = [['A', 'B', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B']];
      G.forEach((r, i) => r.forEach((c, j) => { shape(rectPts(300 + j * 90, 620 + i * 70, 90, 70), { fill: ['#cfe8d3', '#c9d7f2', '#f7c6dc'][c.charCodeAt(0) - 65], w: 3, smooth: false }); txt(c, 345 + j * 90, 657 + i * 70, 32, { color: COL.black }); }));
      txt('對抗平衡', 600, 660, 32, { color: COL.black, align: 'left' }); txt('每種順序都出現', 600, 710, 30, { color: COL.gray, align: 'left' });
    });
  } };
  const s5 = { beats: [0, 7.2, 12.4], sub: '設計決定統計', draw(lt) {
    txt('設計決定統計', 960, 140, 62, { p: prog(lt, .2, .8), color: COL.black });
    underline(760, 1160, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    [['兩組', 't 檢定（獨立或相依）', 1.0], ['三組以上', '單因子 ANOVA', 2.6], ['兩個以上自變項', '多因子 ANOVA', 4.0], ['多個依變項', 'MANOVA', 5.6]].forEach(([a, b, at], i) => {
      const y = 280 + i * 90; appear(prog(lt, at, .5), () => { chip(640, y, 360, 70, a, COL.white, 1, 32); arrow(830, y, 930, y, { w: 4, color: COL.red, head: 12 }); chip(1220, y, 520, 70, b, COL.greenL, 1, 32); }); });
    appear(prog(lt, 7.4, .6), () => { noteBox(960, 642, 1100, 88, [['組別對照 ＋ 前後測 ＋ 隨機分派 → 避開大部分內在效度威脅', 32, COL.red]], '#fff8e2', 1); });
    appear(prog(lt, 12.6, .5), () => chip(520, 760, 600, 66, '課程網站：用符號畫出你的設計', COL.mustard, 1, 30));
  } };
  const order = [[s1, 20], [s2, 14], [s3, 15], [s4, 15], [s5, 15]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('實驗設計有哪幾種？'), scenes,
    sources: ['資料來源', 'Solomon, R. L. (1949). An extension of control group design. Psychological Bulletin.', 'Solomon four-group design（Wikipedia）', '林彥光〈實驗設計〉講義'] };
}
EPISODES['m3e4'] = M3E4();

function M3E2() {
  const coin2 = (x, y, r, k) => appear(k, () => { shape(ellPts(x, y, r, r * Math.max(.15, Math.abs(Math.cos(RLT * 5))), 0, 7, 24), { fill: COL.mustard, w: 3.5 }); });
  const s1 = { beats: [0, 4.6, 8.4, 15], sub: '柯恩的檢定力回顧', draw(lt) {
    ground(lt);
    txt('1962・柯恩', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(740, 1180, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    for (let i = 0; i < 7; i++) appear(prog(lt, .8 + i * .2, .4), () => shape(rectPts(260, 640 - i * 46, 300, 40), { fill: [COL.blueL, COL.greenL, COL.pinkL, COL.mustard][i % 4], w: 3, smooth: false }));
    appear(prog(lt, 2.4, .5), () => { txt('心理學期刊', 410, 720, 34, { color: COL.black }); txt('70 篇研究', 410, 300, 44, { color: COL.red }); });
    appear(prog(lt, 4.8, .6), () => noteBox(1120, 330, 760, 110, [['效果真的存在時，找得到的機率？', 38]], COL.white, 1));
    appear(prog(lt, 8.6, .6), () => {
      coin2(820, 560, 70, 1); txt('擲硬幣 0.50', 820, 690, 34, { color: COL.gray });
      txt('＞', 1050, 570, 60, { color: COL.black });
      txt('0.48', 1330, 560, 110, { color: COL.red, p: prog(lt, 9.2, .8) });
      txt('中等效果的平均檢定力', 1330, 690, 34, { color: COL.black });
    });
    appear(prog(lt, 15.2, .5), () => chip(1100, 790, 620, 70, '樣本太少，看不出結果', COL.mustard, 1, 34));
  } };
  const s2 = { beats: [0, 4.6, 7.6], sub: '四個要素，知三求一', draw(lt) {
    txt('樣本數計算的四個要素', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(660, 1260, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const B = [[380, '顯著水準 α', '0.05', COL.blueL, .9], [800, '檢定力 1−β', '0.80', COL.greenL, 1.5], [1220, '效果量', '？', COL.pinkL, 2.1], [1640, '樣本數 N', '？', COL.mustard, 2.7]];
    B.forEach(([x, a, v, col, at]) => { const k = prog(lt, at, .5); appear(k, () => {
      shape(roundRectPts(x - 180, 270, 360, 220, 24), { fill: col, w: 4, smooth: false });
      txt(a, x, 340, 38, { color: COL.black, p: clamp(k * 1.4) });
      if (lt > 7.8 || x > 1000) txt(x > 1000 && x < 1400 && lt > 7.8 ? '最難' : v, x, 440, 52, { color: COL.red });
    }); });
    appear(prog(lt, 4.8, .6), () => { chip(960, 620, 520, 90, '知道三個，求第四個', COL.white, 1, 40); });
    appear(prog(lt, 7.8, .5), () => noteBox(960, 760, 980, 80, [['慣例：α = 0.05、檢定力 80%', 34, COL.red]], '#fff8e2', 1));
  } };
  const s3 = { beats: [0, 3.4, 5.6], sub: '效果量從哪裡來', draw(lt) {
    txt('效果量從哪裡來？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const S = [[400, '① 文獻', '相似研究的效果量', COL.blueL, 1.0], [960, '② 預試', '先收一小批資料', COL.greenL, 3.6], [1520, '③ 慣例值', 'Cohen (1988)', COL.pinkL, 5.8]];
    S.forEach(([x, a, b, col, at]) => { const k = prog(lt, at, .5); appear(k, () => {
      shape(roundRectPts(x - 230, 260, 460, 170, 22), { fill: col, w: 4, smooth: false });
      txt(a, x, 330, 44, { color: COL.black, p: clamp(k * 1.4) }); txt(b, x, 395, 30, { color: COL.black });
    }); });
    appear(prog(lt, 6.6, .6), () => {
      const R = [['', '小', '中', '大'], ['變異數分析 f', '0.10', '0.25', '0.40'], ['多元迴歸 f²', '0.02', '0.15', '0.35']];
      R.forEach((r, i) => r.forEach((c, j) => { const x = j === 0 ? 660 : 920 + (j - 1) * 220, y = 520 + i * 75;
        if (i > 0 || j > 0) shape(rectPts(j === 0 ? 480 : x - 110, y - 36, j === 0 ? 330 : 220, 72), { fill: i === 0 ? '#eee6d2' : (j === 2 ? '#fff1b8' : COL.white), w: 3, smooth: false });
        txt(c, x - (j === 0 ? 15 : 0), y + 10, 32, { color: j === 2 && i > 0 ? COL.red : COL.black }); }));
    });
  } };
  const s4 = { beats: [0, 6, 12.4], sub: '兩個例題', draw(lt) {
    txt('用 G*Power 算算看', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(680, 1240, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const ex = (x, k, title, rows, ans, sub) => appear(k, () => {
      shape(roundRectPts(x - 380, 250, 760, 440, 26), { fill: COL.white, w: 4, smooth: false });
      txt(title, x, 310, 40, { color: COL.black });
      rows.forEach((r, i) => txt(r, x, 380 + i * 52, 32, { color: COL.gray }));
      txt(ans, x, 600, 64, { color: COL.red, p: clamp(k * 1.3 - .3) }); if (sub) txt(sub, x, 660, 30, { color: COL.black });
    });
    ex(520, prog(lt, .6, .6), '例一　多元迴歸', ['預測變項 4 個', 'f² = 0.15（中）', 'α = 0.05、檢定力 0.80'], 'N = 85', '');
    ex(1400, prog(lt, 6.2, .6), '例二　單因子變異數分析', ['3 組', 'f = 0.25（中）', 'α = 0.05、檢定力 0.80'], 'N = 159', '每組 53 人');
    appear(prog(lt, 12.6, .5), () => chip(960, 780, 640, 70, '免費軟體 G*Power', COL.mustard, 1, 34));
  } };
  const s5 = { beats: [0, 8.6, 11.4], sub: '寫進研究方法', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    paperSheet(1200, 425, 1260, 530, -.012);
    txt('研究對象：樣本數估計', 1200, 200, 42, { p: prog(lt, .4, .7), color: COL.black });
    const rows = [['軟體', COL.blueL, 'G*Power 3.1', 1.2], ['效果量', COL.greenL, '來源：文獻／預試／慣例', 2.6], ['參數', COL.pinkL, 'α = 0.05、檢定力 0.80', 4.4], ['結果', COL.mustard, '至少需要 N 人', 6.2]];
    rows.forEach(([tag, c, s, at], i) => { const k = prog(lt, at, .8), y = 270 + i * 80; appear(k, () => { chip(720, y, 150, 52, tag, c, 1, 28); txt(s, 830, y + 2, 34, { color: COL.black, align: 'left', p: k }); }); });
    appear(prog(lt, 8.8, .5), () => txt('＋ 多收一些，預留流失', 1200, 585, 36, { color: COL.red }));
    appear(prog(lt, 11.6, .5), () => chip(1200, 650, 700, 62, '課程網站：檢定力計算器', COL.mustard, 1, 32));
  } };
  const order = [[s1, 20], [s2, 14], [s3, 16], [s4, 17], [s5, 15]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('樣本數要收多少人？'), scenes,
    sources: ['資料來源', 'Cohen, J. (1962). The statistical power of abnormal-social psychological research. J. Abnormal & Social Psychology, 65, 145–153.', 'Cohen, J. (1988). Statistical power analysis for the behavioral sciences.', '林彥光〈樣本數計算〉講義'] };
}
EPISODES['m3e2'] = M3E2();

function M3E3() {
  const s1 = { beats: [0, 5.6, 11, 15], sub: '李克特量表', draw(lt) {
    ground(lt);
    txt('1932・李克特', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { noteBox(400, 380, 460, 180, [['態度', 64, COL.red], ['看不見、摸不到', 32]], COL.white, 1); });
    appear(prog(lt, 5.8, .6), () => noteBox(1260, 300, 900, 90, [['「運動應該列為必修。」', 38]], '#fff8e2', 1));
    const L = ['非常贊成', '贊成', '未決定', '不贊成', '非常不贊成'];
    L.forEach((s, i) => { const x = 900 + i * 180, k = prog(lt, 6.6 + i * .3, .4); appear(k, () => {
      shape(ellPts(x, 450, 34, 34, 0, 5, 20), { fill: (lt > 9 && i === 1) ? COL.mustard : COL.white, w: 3.5 });
      txt(s, x, 530, 28, { color: COL.black });
      if (lt > 11.2) txt(String(5 - i), x, 600, 44, { color: COL.red, p: prog(lt, 11.2 + i * .2, .4) });
    }); });
    appear(prog(lt, 15.2, .5), () => chip(1260, 720, 560, 76, '李克特量表', COL.mustard, 1, 38));
  } };
  const s2 = { beats: [0, 4.6, 10], sub: '從目的到題目', draw(lt) {
    txt('從目的到題目', 960, 140, 62, { p: prog(lt, .2, .8), color: COL.black });
    underline(740, 1180, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    [['研究目的', 300, .8], ['對象', 760, 1.6], ['能問什麼', 1220, 2.4], ['怎麼問', 1660, 3.0]].forEach(([s, x, at], i) => appear(prog(lt, at, .5), () => {
      chip(x, 290, 320, 80, s, [COL.blueL, COL.greenL, COL.pinkL, COL.mustard][i], 1, 36);
      if (i < 3) arrow(x + 170, 290, x + 290 - (i === 2 ? 50 : 0), 290, { w: 4, color: COL.red, head: 12 });
    }));
    appear(prog(lt, 4.8, .6), () => {
      chip(960, 450, 360, 80, '概念', COL.white, 1, 38);
      [620, 960, 1300].forEach((x, i) => { ink([[960, 490], [x, 560]], { w: 3 }); chip(x, 590, 260, 64, '向度 ' + (i + 1), COL.greenL, prog(lt, 5.4 + i * .3, .4), 30);
        for (let j = 0; j < 4; j++) appear(prog(lt, 6.4 + i * .3 + j * .1, .3), () => shape(rectPts(x - 110 + j * 58, 650, 46, 40), { fill: COL.white, w: 2.5, smooth: false })); });
      txt('3–5 個向度　×　每向度 4–6 題', 960, 740, 34, { color: COL.red, p: prog(lt, 7.6, .6) });
    });
    appear(prog(lt, 10.2, .5), () => chip(1580, 470, 420, 70, '先找現成量表', COL.mustard, 1, 32));
  } };
  const s3 = { beats: [0, 2.2, 9.6], sub: '措辭：不要誘導', draw(lt) {
    txt('措辭原則', 960, 140, 62, { p: prog(lt, .2, .8), color: COL.black });
    underline(780, 1140, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    chip(960, 250, 420, 76, '① 不要誘導', COL.pinkL, prog(lt, .6, .5), 36);
    appear(prog(lt, 2.4, .6), () => {
      noteBox(960, 380, 1300, 110, [['研究指出吸菸傷害心肺，你認為選手可以吸菸嗎？', 38]], COL.white, 1);
      ink([[330, 390], [800, 390]], { w: 6, color: COL.red, p: prog(lt, 5, .8) });
      txt('答案已經寫在題目裡', 960, 480, 34, { color: COL.red, p: prog(lt, 5.4, .6) });
    });
    appear(prog(lt, 9.8, .6), () => {
      chip(560, 610, 460, 70, '② 不要雙重否定', COL.pinkL, 1, 32);
      txt('你是否「不」贊成「反對」體罰？', 560, 700, 34, { color: COL.black });
      chip(1360, 610, 460, 70, '③ 不用艱澀字眼', COL.pinkL, prog(lt, 11.4, .5), 32);
      txt('題目要簡短、具體', 1360, 700, 34, { color: COL.black, p: prog(lt, 11.8, .6) });
    });
  } };
  const s4 = { beats: [0, 3.8, 7.2], sub: '選項設計', draw(lt) {
    txt('選項設計', 960, 140, 62, { p: prog(lt, .2, .8), color: COL.black });
    underline(780, 1140, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => {
      txt('你喜不喜歡打棒球？', 520, 270, 36, { color: COL.black });
      ['很不喜歡', '不喜歡', '喜歡', '很喜歡'].forEach((s, i) => { shape(rectPts(150 + i * 200, 320, 30, 30), { fill: COL.white, w: 3, smooth: false }); txt(s, 192 + i * 200, 345, 28, { color: COL.black, align: 'left' }); });
      txt('封閉式：好整理、好分析', 520, 420, 32, { color: COL.green });
    });
    appear(prog(lt, 4.0, .6), () => {
      txt('正反對稱、程度相同', 520, 520, 34, { color: COL.black });
      txt('不喜歡 ← 中間 → 喜歡', 520, 580, 32, { color: COL.gray });
    });
    appear(prog(lt, 7.4, .6), () => {
      shape(roundRectPts(1000, 250, 740, 400, 24), { fill: COL.white, w: 4, smooth: false });
      txt('你幾歲？', 1370, 310, 38, { color: COL.black });
      [['小於 18', 380], ['18 ～ 36', 450], ['37 ～ 64', 520]].forEach(([s, y]) => { shape(rectPts(1180, y - 22, 30, 30), { fill: COL.white, w: 3, smooth: false }); txt(s, 1240, y + 2, 34, { color: COL.black, align: 'left' }); });
      txt('65 歲選哪個？', 1370, 610, 38, { color: COL.red, p: prog(lt, 10.5, .6) });
    });
  } };
  const s5 = { beats: [0, 5.6, 10.4], sub: '翻譯量表與前測', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    [['國外量表', COL.blueL, .6], ['翻譯', COL.white, 1.4], ['專家審查', COL.greenL, 2.4], ['前測', COL.pinkL, 3.4], ['信效度', COL.mustard, 4.2]].forEach(([s, c, at], i) => {
      const x = 760 + i * 250; appear(prog(lt, at, .5), () => { chip(x, 300, 210, 76, s, c, 1, 32); if (i < 4) arrow(x + 110, 300, x + 140, 300, { w: 4, color: COL.red, head: 10 }); });
    });
    appear(prog(lt, 5.8, .6), () => {
      noteBox(1260, 470, 900, 130, [['前測人數', 34, COL.black], ['10–40 人，或正式樣本的 10%–20%', 36, COL.red]], '#fff8e2', 1);
      txt('Hertzog (2008)', 1260, 570, 26, { color: COL.gray });
    });
    appear(prog(lt, 10.6, .5), () => chip(1260, 650, 760, 66, '課程網站：替每個變項寫測量工具', COL.mustard, 1, 30));
  } };
  const order = [[s1, 19], [s2, 15], [s3, 15], [s4, 16], [s5, 15]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('問卷題目怎麼設計？'), scenes,
    sources: ['資料來源', 'Likert, R. (1932). A technique for the measurement of attitudes. Archives of Psychology, 140.', 'Hertzog, M. A. (2008). Considerations in determining sample size for pilot studies. Res Nurs Health, 31, 180–191.', '林彥光〈問卷設計原則〉講義'] };
}
EPISODES['m3e3'] = M3E3();

function M3E8() {
  const s1 = { beats: [0, 5.2, 10, 13], sub: '克隆巴赫係數阿法', draw(lt) {
    ground(lt);
    txt('1951・克隆巴赫', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(680, 1240, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    paperSheet(480, 470, 520, 520, -.02);
    txt('問卷', 480, 260, 44, { color: COL.black, p: prog(lt, .6, .6) });
    for (let i = 0; i < 6; i++) appear(prog(lt, 1 + i * .25, .4), () => { txt('第 ' + (i + 1) + ' 題', 360, 340 + i * 60, 30, { color: COL.black, align: 'left' }); [0, 1, 2, 3, 4].forEach(j => shape(ellPts(520 + j * 34, 330 + i * 60, 11, 11, 0, 3, 14), { fill: (j === 3 - (i % 2)) && lt > 5.4 ? COL.mustard : COL.white, w: 2.5 })); });
    appear(prog(lt, 5.4, .6), () => noteBox(1300, 340, 760, 110, [['這些題目在量同一件事嗎？', 40]], COL.white, 1));
    appear(prog(lt, 10.2, .6), () => { txt('α', 1300, 560, 150, { color: COL.red }); txt('Coefficient alpha', 1300, 650, 32, { color: COL.gray }); });
    appear(prog(lt, 13.2, .5), () => chip(1300, 760, 620, 70, '問卷研究必報的信度', COL.mustard, 1, 34));
  } };
  const s2 = { beats: [0, 2.4, 7.6], sub: '觀察分數＝真分數＋誤差', draw(lt) {
    txt('信度＝一致、穩定', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(680, 1240, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, 2.6, .6), () => {
      txt('X　＝　T　＋　E', 960, 330, 90, { color: COL.black });
      txt('觀察分數', 640, 420, 32, { color: COL.gray }); txt('真分數', 960, 420, 32, { color: COL.green }); txt('誤差', 1270, 420, 32, { color: COL.red });
    });
    appear(prog(lt, 7.8, .6), () => {
      const bar = (y, tr, lab) => { shape(rectPts(560, y, 800 * tr, 70), { fill: COL.greenL, w: 3, smooth: false }); shape(rectPts(560 + 800 * tr, y, 800 * (1 - tr), 70), { fill: COL.pinkL, w: 3, smooth: false }); txt(lab, 1420, y + 45, 32, { color: COL.black, align: 'left' }); };
      bar(520, .9, '信度高'); bar(630, .55, '信度低');
      txt('真分數', 760, 790, 28, { color: COL.green }); txt('誤差', 1250, 790, 28, { color: COL.red });
    });
  } };
  const s3 = { beats: [0, 5.4, 15], sub: '四種信度', draw(lt) {
    txt('信度怎麼估？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const C = [[300, '再測信度', '隔一段時間測兩次', COL.blueL, .6], [740, '折半信度', '題目分成兩半', COL.greenL, 5.6], [1180, '內部一致性', '克隆巴赫 α', COL.pinkL, 15.2], [1620, '評分者信度', '卡帕係數', COL.mustard, 17.4]];
    C.forEach(([x, a, b, col, at]) => { const k = prog(lt, at, .5); appear(k, () => {
      shape(roundRectPts(x - 200, 250, 400, 160, 22), { fill: col, w: 4, smooth: false });
      txt(a, x, 320, 40, { color: COL.black, p: clamp(k * 1.4) }); txt(b, x, 380, 28, { color: COL.black });
    }); });
    appear(prog(lt, 7.6, .6), () => {
      noteBox(960, 560, 1100, 170, [['斯皮爾曼－布朗公式', 34, COL.black], ['30 題折半相關 0.65  →  2×0.65 ÷ 1.65 ≈ 0.79', 38, COL.red]], '#fff8e2', 1);
      txt('兩半各只有 15 題，要校正回整份量表', 960, 700, 30, { color: COL.gray, p: prog(lt, 9, .6) });
    });
  } };
  const s4 = { beats: [0, 8.4, 13.6], sub: 'α 要多少才夠', draw(lt) {
    txt('α 要多少才夠？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const x0 = 360, w = 1200;
    appear(prog(lt, .6, .6), () => {
      ink([[x0, 330], [x0 + w, 330]], { w: 5 });
      [[0.5, ''], [0.6, '可接受（探索性）'], [0.7, '適當'], [0.8, '良好'], [0.9, '']].forEach(([v, l], i) => { const x = x0 + (v - .5) * w / .4 * .8; ink([[x, 315], [x, 345]], { w: 4 }); txt(v.toFixed(1), x, 390, 32, { color: COL.black }); if (l) txt(l, x, 270, 30, { color: [COL.gray, COL.mustardD, COL.green][i - 1], p: prog(lt, 1.6 + i * .8, .5) }); });
    });
    appear(prog(lt, 8.6, .6), () => {
      shape(rectPts(420, 470, 760, 220), { fill: COL.white, w: 3, smooth: false });
      txt('題目', 520, 515, 28, { color: COL.gray }); txt('刪除該題後的 α', 900, 515, 28, { color: COL.gray });
      [['第 1 題', '0.78'], ['第 2 題', '0.80'], ['第 3 題', '0.86']].forEach(([a, b], i) => { txt(a, 520, 570 + i * 50, 30, { color: COL.black }); txt(b, 900, 570 + i * 50, 30, { color: i === 2 ? COL.red : COL.black }); });
      txt('示意：整份 α = 0.82', 800, 730, 28, { color: COL.gray });
      txt('← 刪掉反而變高，回頭檢查', 1400, 670, 30, { color: COL.red, p: prog(lt, 10, .6) });
    });
    appear(prog(lt, 13.8, .5), () => noteBox(1500, 520, 560, 110, [['題數少・疲勞・吵雜', 32, COL.black], ['都會拉低信度', 30, COL.red]], '#fff8e2', 1));
  } };
  const s5 = { beats: [0, 5, 16], sub: '報告你的信度', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    bubble(260, 300, 480, 110, 190, 440, '別人的量表也要報？', 34, prog(lt, .4, .5));
    noteBox(1200, 250, 1000, 90, [['要！在你的樣本重新估信度', 38, COL.red]], '#fff8e2', prog(lt, 1.6, .5));
    appear(prog(lt, 5.2, .6), () => {
      txt('信度低 → 相關被低估', 1200, 380, 40, { color: COL.black });
      txt('觀察 r = 0.45', 900, 470, 38, { color: COL.gray });
      arrow(1090, 462, 1260, 462, { w: 5, color: COL.red, head: 14 });
      txt('校正後 ≈ 0.65', 1480, 470, 38, { color: COL.red, p: prog(lt, 9, .6) });
      txt('0.45 ÷ √(0.8 × 0.6)', 1200, 545, 32, { color: COL.gray, p: prog(lt, 8, .6) });
    });
    appear(prog(lt, 16.2, .5), () => chip(1200, 650, 760, 66, '課程網站：替每個工具寫信度', COL.mustard, 1, 30));
  } };
  const order = [[s1, 17], [s2, 14], [s3, 22], [s4, 18], [s5, 20]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('信度是什麼？怎麼報告？'), scenes,
    sources: ['資料來源', 'Cronbach, L. J. (1951). Coefficient alpha and the internal structure of tests. Psychometrika, 16, 297–334.', '林彥光〈信度〉講義（古典測驗理論、Spearman-Brown、衰減校正）'] };
}
EPISODES['m3e8'] = M3E8();

function M3E9() {
  const s1 = { beats: [0, 8, 12.4], sub: '建構效度', draw(lt) {
    ground(lt);
    txt('1955・克隆巴赫與米爾', 960, 150, 66, { p: prog(lt, .2, .9), color: COL.black });
    underline(620, 1300, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { shape(ellPts(420, 460, 170, 130, 0, 9, 30), { fill: '#e8e0f2', w: 4 }); txt('心理特質', 420, 450, 44, { color: COL.black }); txt('看不見', 420, 510, 30, { color: COL.gray }); });
    appear(prog(lt, 2.4, .6), () => { paperSheet(860, 460, 260, 300, .03); txt('測驗', 860, 400, 40, { color: COL.black }); txt('？', 660, 460, 70, { color: COL.red }); });
    appear(prog(lt, 8.2, .6), () => {
      [['理論', COL.blueL], ['預測', COL.greenL], ['證據 1', COL.pinkL], ['證據 2', COL.pinkL], ['證據 3', COL.pinkL]].forEach(([s, c], i) => { const x = 1180 + (i < 2 ? i * 260 : 260 + (i - 1) * 0) , y = i < 2 ? 330 : 330 + (i - 1) * 100; appear(prog(lt, 8.2 + i * .5, .4), () => chip(i < 2 ? 1180 + i * 300 : 1640, i < 2 ? 330 : 330 + (i - 1) * 100, 220, 70, s, c, 1, 32)); });
      arrow(1300, 330, 1360, 330, { w: 4, color: COL.red, head: 12 });
    });
    appear(prog(lt, 12.6, .5), () => chip(1300, 760, 520, 76, '建構效度', COL.mustard, 1, 40));
  } };
  const s2 = { beats: [0, 3, 12], sub: '量到你想量的嗎', draw(lt) {
    txt('效度：量到你想量的嗎？', 960, 140, 58, { p: prog(lt, .2, .8), color: COL.black });
    underline(620, 1300, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, 3.2, .6), () => {
      noteBox(700, 400, 1000, 260, [['小學三年級「數學」題', 34, COL.black], ['鞋子成本 15 元、標價 21 元，', 30], ['客人付 50 元假鈔，店家找 29 元……', 30], ['店家損失多少？', 30]], COL.white, 1);
      txt('測到的是：閱讀理解？', 1500, 400, 40, { color: COL.red, p: prog(lt, 7, .6) });
    });
    appear(prog(lt, 12.2, .6), () => {
      // 標靶
      const tg = (x, pts, lab) => { [90, 60, 30].forEach((r, i) => shape(ellPts(x, 690, r, r, 0, 3 + i, 24), { fill: ['#fff', '#f7c6dc', '#fff'][i], w: 3 })); pts.forEach(([dx, dy]) => shape(ellPts(x + dx, 690 + dy, 8, 8, 0, 1, 12), { fill: COL.black, w: 2 })); txt(lab, x, 820, 30, { color: COL.black }); };
      tg(700, [[50, -50], [58, -42], [44, -56], [54, -46]], '信度高、效度低');
      tg(1220, [[2, 3], [-6, 4], [5, -5], [-3, -4]], '信度高、效度高');
    });
  } };
  const s3 = { beats: [0, 5, 10], sub: '三類效度證據', draw(lt) {
    txt('三類效度證據', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    txt('1985・AERA／APA／NCME 聯合委員會', 960, 240, 32, { color: COL.gray, p: prog(lt, .6, .6) });
    const C = [[400, '內容', '題目涵蓋整個範圍？', '專家效度', COL.blueL, 5.2], [960, '效標關聯', '和外在標準相關？', '同時／預測效度', COL.greenL, 7.4], [1520, '建構', '符合理論結構？', '因素分析', COL.pinkL, 10.6]];
    C.forEach(([x, a, b, c2, col, at]) => { const k = prog(lt, at, .5); appear(k, () => {
      shape(roundRectPts(x - 240, 300, 480, 330, 24), { fill: col, w: 4, smooth: false });
      txt(a, x, 380, 50, { color: COL.black, p: clamp(k * 1.4) }); txt(b, x, 460, 30, { color: COL.black });
      chip(x, 560, 340, 64, c2, COL.white, 1, 30);
    }); });
    appear(prog(lt, 9, .5), () => txt('效度係數常見 0.30–0.60', 960, 700, 30, { color: COL.gray }));
  } };
  const s4 = { beats: [0, 4.4, 9.4], sub: '因素分析檢查表', draw(lt) {
    txt('因素分析檢查表', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    chip(420, 300, 520, 80, 'KMO ＞ 0.6', COL.blueL, prog(lt, .6, .5), 38);
    appear(prog(lt, 4.6, .6), () => {
      chip(420, 430, 520, 80, '特徵值 ＞ 1、陡坡圖', COL.greenL, 1, 34);
      // 陡坡圖
      ink([[1000, 260], [1000, 560], [1600, 560]], { w: 3 });
      const ev = [3.9, 1.8, 1.2, .7, .5, .4, .3]; const pts = ev.map((v, i) => [1060 + i * 80, 560 - v * 70]);
      ink(pts, { w: 4, color: COL.blue, p: prog(lt, 5, 1.2) });
      pts.forEach(([x, y], i) => appear(prog(lt, 5 + i * .15, .2), () => shape(ellPts(x, y, 9, 9, 0, i, 12), { fill: i < 3 ? COL.red : COL.white, w: 2.5 })));
      ink([[1000, 490], [1600, 490]], { w: 2, color: COL.gray }); txt('特徵值 = 1', 1660, 498, 24, { color: COL.gray, align: 'left' });
      txt('陡坡圖（示意）', 1300, 610, 26, { color: COL.gray });
    });
    appear(prog(lt, 9.6, .6), () => {
      chip(420, 560, 520, 80, '樣本數', COL.pinkL, 1, 36);
      [['100', '偏少', COL.gray], ['300', '良好', COL.green], ['500', '很好', COL.green]].forEach(([n, l, c], i) => { txt(n + ' 人', 260 + i * 170, 680, 34, { color: COL.black }); txt(l, 260 + i * 170, 730, 28, { color: c }); });
    });
  } };
  const s5 = { beats: [0, 8.4, 12.4], sub: '研究效度與工具效度', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    appear(prog(lt, .4, .6), () => {
      chip(900, 280, 380, 80, '內在效度', COL.blueL, 1, 36); txt('因果站得住嗎？', 900, 370, 30, { color: COL.black });
      chip(1500, 280, 380, 80, '外在效度', COL.greenL, prog(lt, 3.4, .5), 36); txt('能推論出去嗎？', 1500, 370, 30, { color: COL.black, p: prog(lt, 3.8, .5) });
    });
    appear(prog(lt, 8.6, .6), () => noteBox(1200, 500, 900, 100, [['國外量表翻譯後 → 重新檢驗信效度', 34, COL.red]], '#fff8e2', 1));
    appear(prog(lt, 12.6, .5), () => chip(1200, 650, 760, 66, '課程網站：替每個工具寫效度證據', COL.mustard, 1, 30));
  } };
  const order = [[s1, 17], [s2, 19], [s3, 18], [s4, 15], [s5, 16]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('效度是什麼？怎麼證明？'), scenes,
    sources: ['資料來源', 'Cronbach, L. J., & Meehl, P. E. (1955). Construct validity in psychological tests. Psychological Bulletin, 52, 281–302.', 'AERA, APA, & NCME (1985). Standards for educational and psychological testing.', '林彥光〈效度〉講義'] };
}
EPISODES['m3e9'] = M3E9();

function M3E5() {
  const s1 = { beats: [0, 6.4, 11, 16.4], sub: '柏克萊錄取率', draw(lt) {
    ground(lt);
    txt('1973・柏克萊', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    const bars = (x0, k, lab) => appear(k, () => {
      [['男', .44, COL.blueL], ['女', .35, COL.pinkL]].forEach(([g, v, c], i) => { const x = x0 + i * 170, h = v * 700;
        shape(rectPts(x - 55, 650 - h, 110, h), { fill: c, w: 3.5, smooth: false }); txt(Math.round(v * 100) + '%', x, 630 - h, 38, { color: COL.black }); txt(g, x, 700, 34, { color: COL.black }); });
      txt(lab, x0 + 85, 760, 30, { color: COL.gray });
    });
    bars(320, prog(lt, .8, .6), '整體錄取率');
    appear(prog(lt, 6.6, .6), () => {
      txt('按系所拆開', 1200, 280, 40, { color: COL.black });
      [['錄取率高的系', '男生多申請', COL.greenL], ['錄取率低的系', '女生多申請', COL.pinkL]].forEach(([a, b, c], i) => { chip(1200, 380 + i * 120, 460, 80, a, c, 1, 34); txt(b, 1530, 388 + i * 120, 30, { color: COL.gray, align: 'left' }); });
      txt('分系比較：沒有對女生不利', 1200, 640, 36, { color: COL.red, p: prog(lt, 11.2, .6) });
    });
    appear(prog(lt, 16.6, .5), () => chip(1200, 760, 560, 72, '辛普森詭論', COL.mustard, 1, 38));
  } };
  const s2 = { beats: [0, 2.6, 8], sub: '四種資料尺度', draw(lt) {
    txt('先認清資料型態', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const C = [[330, '名目', '性別、隊別', '只分類', COL.blueL, 2.8], [750, '序位', '名次、等級', '可排序', COL.greenL, 4.6], [1170, '等距', '智商、溫度', '差距有意義', COL.pinkL, 8.2], [1590, '等比', '身高、秒數', '0 代表沒有', COL.mustard, 10]];
    C.forEach(([x, a, b, c2, col, at]) => { const k = prog(lt, at, .5); appear(k, () => {
      shape(roundRectPts(x - 190, 280, 380, 260, 24), { fill: col, w: 4, smooth: false });
      txt(a, x, 360, 52, { color: COL.black, p: clamp(k * 1.4) }); txt(b, x, 440, 32, { color: COL.black }); txt(c2, x, 500, 28, { color: COL.gray });
    }); });
    appear(prog(lt, 10.6, .6), () => { arrow(260, 620, 1660, 620, { w: 5, color: COL.red, head: 16 }); txt('資訊越來越多', 960, 680, 32, { color: COL.red }); });
  } };
  const s3 = { beats: [0, 7.4, 13.6], sub: '比較平均數', draw(lt) {
    txt('比較平均數', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(740, 1180, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const row = (y, a, b, k, col) => appear(k, () => { chip(560, y, 520, 80, a, COL.white, 1, 32); arrow(830, y, 950, y, { w: 4, color: COL.red, head: 12 }); chip(1300, y, 600, 80, b, col, 1, 34); });
    row(290, '兩組不同的人', '獨立樣本 t 檢定', prog(lt, .8, .6), COL.blueL);
    row(410, '同一批人前後測', '相依樣本 t 檢定', prog(lt, 7.6, .6), COL.greenL);
    row(530, '三組以上', '變異數分析', prog(lt, 10, .6), COL.pinkL);
    appear(prog(lt, 13.8, .6), () => noteBox(960, 690, 1100, 120, [['顯著 → 只知道「不全相等」', 34, COL.black], ['事後比較：Tukey、Bonferroni、Scheffé', 32, COL.red]], '#fff8e2', 1));
  } };
  const s4 = { beats: [0, 3.6, 9], sub: '關聯與預測', draw(lt) {
    txt('看關聯、做預測', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => {
      chip(500, 270, 520, 76, '類別 × 類別 → 卡方檢定', COL.blueL, 1, 32);
      const T = [['', '男', '女'], ['通過', '35', '20'], ['不通過', '45', '40']];
      T.forEach((r, i) => r.forEach((c, j) => { shape(rectPts(320 + j * 130, 340 + i * 64, 130, 64), { fill: i === 0 || j === 0 ? '#eee6d2' : COL.white, w: 2.5, smooth: false }); txt(c, 385 + j * 130, 382 + i * 64, 30, { color: COL.black }); }));
      txt('講義例題', 500, 560, 26, { color: COL.gray });
    });
    appear(prog(lt, 3.8, .6), () => {
      chip(1360, 270, 600, 76, '連續 × 連續 → 相關、迴歸', COL.greenL, 1, 32);
      ink([[1100, 330], [1100, 600], [1620, 600]], { w: 3 });
      const P = [[1150, 560], [1200, 540], [1240, 520], [1290, 500], [1330, 470], [1380, 455], [1430, 430], [1480, 400], [1530, 390], [1570, 360]];
      P.forEach(([x, y], i) => shape(ellPts(x, y + (i % 3 - 1) * 14, 8, 8, 0, i, 12), { fill: COL.blue, w: 2 }));
      ink([[1130, 575], [1600, 355]], { w: 4, color: COL.red, p: prog(lt, 5, .8) });
    });
    appear(prog(lt, 9.2, .5), () => chip(960, 700, 560, 80, '相關 ≠ 因果', COL.mustard, 1, 40));
  } };
  const s5 = { beats: [0, 7.2, 13], sub: '檢查前提', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    [['獨立', COL.blueL], ['常態', COL.greenL], ['變異數同質', COL.pinkL]].forEach(([s, c], i) => appear(prog(lt, .6 + i * .6, .5), () => { chip(840 + i * 330, 280, 290, 76, s, c, 1, 32); check(840 + i * 330 + 120, 260, .6, 1); }));
    appear(prog(lt, 7.4, .6), () => {
      const T = [['', '拒絕 H₀', '不拒絕 H₀'], ['H₀ 為真', '型一誤差 α', '✓'], ['H₀ 為假', '✓', '型二誤差 β']];
      T.forEach((r, i) => r.forEach((c, j) => { shape(rectPts(800 + j * 280, 390 + i * 70, 280, 70), { fill: i === 0 || j === 0 ? '#eee6d2' : COL.white, w: 2.5, smooth: false }); txt(c, 940 + j * 280, 435 + i * 70, 30, { color: c.includes('誤差') ? COL.red : COL.black }); }));
    });
    appear(prog(lt, 13.2, .5), () => chip(1220, 660, 800, 66, '課程網站：每個假設配一個統計方法', COL.mustard, 1, 30));
  } };
  const order = [[s1, 21], [s2, 14], [s3, 18], [s4, 13], [s5, 16]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag3('統計方法怎麼選？'), scenes,
    sources: ['資料來源', 'Bickel, P. J., Hammel, E. A., & O’Connell, J. W. (1975). Sex bias in graduate admissions: Data from Berkeley. Science, 187, 398–404.', '林彥光〈統計分析與應用〉講義'] };
}
EPISODES['m3e5'] = M3E5();
