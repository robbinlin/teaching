// 研究法工作坊｜第 4、5 章 結果與討論。
function rtag45(n, label) { return '研究法工作坊｜第 ' + n + ' 章 ' + label; }

function M4E5() {
  const s1 = { beats: [0, 5.4, 9.6, 14.6], sub: '生態謬誤', draw(lt) {
    ground(lt);
    txt('1950・羅賓森', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    txt('1930 年美國普查：移民比例 vs 文盲率', 960, 250, 34, { color: COL.gray, p: prog(lt, .8, .6) });
    const sc = (x0, k, pts, slope, lab, col) => appear(k, () => {
      ink([[x0, 320], [x0, 640], [x0 + 520, 640]], { w: 3 });
      txt('移民', x0 + 260, 690, 28, { color: COL.gray }); txt('文盲', x0 - 40, 480, 28, { color: COL.gray });
      pts.forEach(([x, y], i) => shape(ellPts(x0 + x, y, 9, 9, 0, i, 12), { fill: col, w: 2 }));
      ink(slope.map(([x, y]) => [x0 + x, y]), { w: 4, color: COL.red });
      txt(lab, x0 + 260, 760, 34, { color: COL.black });
    });
    sc(260, prog(lt, 5.6, .6), [[40, 400], [100, 430], [160, 450], [220, 480], [290, 500], [350, 540], [410, 560], [470, 590]], [[30, 395], [490, 595]], '以州為單位：負相關', COL.blueL);
    sc(1140, prog(lt, 9.8, .6), [[60, 600], [120, 560], [140, 610], [200, 590], [260, 540], [300, 600], [360, 570], [420, 530], [470, 580]], [[40, 600], [490, 555]], '以個人為單位：正相關', COL.pinkL);
    appear(prog(lt, 14.8, .5), () => chip(960, 480, 320, 72, '生態謬誤', COL.mustard, 1, 36));
  } };
  const s2 = { beats: [0, 3.6, 8.4], sub: '結果怎麼報', draw(lt) {
    txt('結果怎麼報？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    ['假設一', '假設二', '假設三'].forEach((s, i) => appear(prog(lt, .8 + i * .5, .4), () => { chip(300 + i * 280, 300, 240, 70, s, COL.blueL, 1, 32); if (i < 2) arrow(425 + i * 280, 300, 455 + i * 280, 300, { w: 4, color: COL.red, head: 10 }); }));
    appear(prog(lt, 3.8, .6), () => {
      txt('1.573E-2', 520, 470, 48, { color: COL.gray }); ink([[400, 465], [640, 465]], { w: 5, color: COL.red, p: prog(lt, 4.6, .4) });
      arrow(680, 460, 800, 460, { w: 5, color: COL.green, head: 14 }); txt('.016', 900, 470, 52, { color: COL.green });
    });
    appear(prog(lt, 8.6, .6), () => noteBox(1400, 470, 640, 130, [['不顯著', 40, COL.black], ['也要報告', 36, COL.red]], '#fff8e2', 1));
  } };
  const s3 = { beats: [0, 2.4, 10.8], sub: '三種錯誤推理', draw(lt) {
    txt('三種錯誤推理', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const E = [['相關 → 因果', '調查、相關研究不能下因果結論', COL.pinkL, 2.6], ['只報百分比', '要附上原始人數', COL.blueL, 6.4], ['過度推論', '一年級 200 人 ≠ 全校', COL.greenL, 11]];
    E.forEach(([a, b, c, at], i) => { const x = 360 + i * 600, k = prog(lt, at, .5); appear(k, () => {
      shape(roundRectPts(x - 260, 270, 520, 300, 24), { fill: c, w: 4, smooth: false });
      cross(x, 350, .7, 1); txt(a, x, 460, 44, { color: COL.black }); txt(b, x, 530, 28, { color: COL.black });
    }); });
  } };
  const s4 = { beats: [0, 4.4, 11.6], sub: '討論：與文獻對話', draw(lt) {
    txt('討論：先寫你發現了什麼', 960, 140, 58, { p: prog(lt, .2, .8), color: COL.black });
    underline(600, 1320, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { chip(420, 300, 440, 80, '① 本研究發現', COL.mustard, 1, 34); arrow(650, 300, 760, 300, { w: 5, color: COL.red, head: 14 }); chip(990, 300, 440, 80, '② 扣回文獻解釋', COL.blueL, 1, 34); });
    appear(prog(lt, 4.6, .6), () => {
      shape(rectPts(260, 400, 1000, 260), { fill: COL.white, w: 3, smooth: false });
      [['', '本研究', '過去研究'], ['對象', '大學選手', '一般大學生'], ['情境', '賽季中', '實驗室'], ['結果', '一致？', '不一致？']].forEach((r, i) => r.forEach((c, j) => txt(c, 380 + j * 380, 450 + i * 60, 30, { color: i === 0 || j === 0 ? COL.gray : COL.black })));
      txt('（示意）', 1200, 690, 24, { color: COL.gray });
    });
    appear(prog(lt, 11.8, .6), () => ['支持', '推翻', '修正'].forEach((s, i) => chip(1560, 430 + i * 90, 240, 70, s + '理論', [COL.greenL, COL.pinkL, COL.blueL][i], prog(lt, 11.8 + i * .4, .4), 30)));
  } };
  const s5 = { beats: [0, 4.6, 8.4], sub: '研究限制', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    noteBox(1200, 290, 1000, 120, [['研究限制', 36, COL.black], ['沒完全處理好、影響品質的因素', 34, COL.red]], COL.white, prog(lt, .4, .5));
    appear(prog(lt, 4.8, .6), () => {
      chip(980, 460, 380, 70, '研究範圍', COL.blueL, 1, 32); chip(1420, 460, 380, 70, '選擇的方法', COL.greenL, 1, 32);
      cross(1210, 440, .5, 1); cross(1650, 440, .5, 1); txt('都不算限制', 1200, 550, 34, { color: COL.red });
    });
    appear(prog(lt, 8.6, .5), () => chip(1200, 650, 760, 66, '課程網站：寫結果、與文獻對話', COL.mustard, 1, 30));
  } };
  const order = [[s1, 21], [s2, 14], [s3, 15], [s4, 17], [s5, 14]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag45(4, '結果與討論怎麼寫？'), scenes,
    sources: ['資料來源', 'Robinson, W. S. (1950). Ecological correlations and the behavior of individuals. American Sociological Review, 15, 351–357.', '林彥光〈研究結果與討論敘寫〉講義'] };
}
EPISODES['m4e5'] = M4E5();

function M5E5() {
  const s1 = { beats: [0, 5.6, 9.6, 13.4], sub: '結構式摘要', draw(lt) {
    ground(lt);
    txt('1987・結構式摘要', 960, 150, 68, { p: prog(lt, .2, .9), color: COL.black });
    underline(660, 1260, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    paperSheet(480, 470, 520, 520, -.02);
    txt('摘要', 480, 260, 42, { color: COL.black, p: prog(lt, .6, .6) });
    const H = ['目的', '設計', '參與者', '測量', '結果', '結論'];
    H.forEach((h, i) => appear(prog(lt, 5.8 + i * .4, .4), () => { chip(330, 330 + i * 64, 150, 48, h, [COL.blueL, COL.greenL, COL.pinkL, COL.mustard, COL.blueL, COL.greenL][i], 1, 26); ink([[430, 330 + i * 64], [690, 330 + i * 64]], { w: 3, color: COL.gray }); }));
    appear(prog(lt, 9.8, .6), () => { student(1300, GY - 20, .6, { ...IDLE_ARMS, look: -1, bob: idle(RLT) * .3 }); bubble(1300, 300, 480, 110, 1300, 420, '先看摘要再決定', 34, 1); });
    appear(prog(lt, 13.6, .5), () => chip(1640, 560, 420, 70, '結構式摘要', COL.mustard, 1, 36));
  } };
  const s2 = { beats: [0, 6.4, 9.4], sub: '結論怎麼寫', draw(lt) {
    txt('結論怎麼寫？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    [['目的與方法', COL.blueL], ['依目的的結果', COL.greenL], ['意涵', COL.pinkL]].forEach(([s, c], i) => appear(prog(lt, .8 + i * 1.4, .5), () => { chip(400 + i * 560, 310, 440, 84, s, c, 1, 36); if (i < 2) arrow(625 + i * 560, 310, 735 + i * 560, 310, { w: 5, color: COL.red, head: 14 }); }));
    appear(prog(lt, 6.6, .6), () => chip(960, 450, 600, 76, '整合，不重複結果與討論', COL.white, 1, 34));
    appear(prog(lt, 9.6, .6), () => ['統計數字', '逐字稿', '引註文獻'].forEach((s, i) => { const x = 560 + i * 400; chip(x, 600, 320, 70, s, '#eee6d2', 1, 32); cross(x + 130, 590, .5, prog(lt, 10 + i * .4, .3)); }));
  } };
  const s3 = { beats: [0, 3.6, 11.2], sub: '三種不一致', draw(lt) {
    txt('結論與結果：三種不一致', 960, 140, 58, { p: prog(lt, .2, .8), color: COL.black });
    underline(620, 1300, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const E = [['結論超出資料', '說了資料沒顯示的事', COL.pinkL, 3.8], ['資料比結論多', '有結果沒收進結論', COL.blueL, 6.4], ['互相矛盾', '結論和數據方向相反', COL.greenL, 8.6]];
    E.forEach(([a, b, c, at], i) => { const x = 360 + i * 600; appear(prog(lt, at, .5), () => { shape(roundRectPts(x - 260, 260, 520, 240, 24), { fill: c, w: 4, smooth: false }); txt(a, x, 360, 42, { color: COL.black }); txt(b, x, 430, 28, { color: COL.black }); }); });
    appear(prog(lt, 11.4, .6), () => {
      ['結論 1', '結論 2', '結論 3'].forEach((s, i) => { chip(640, 600 + i * 70, 220, 56, s, COL.white, 1, 28); arrow(760, 600 + i * 70, 1060, 600 + i * 70, { w: 3, color: COL.green, head: 10 }); chip(1180, 600 + i * 70, 220, 56, '結果 ' + (i + 1), COL.greenL, 1, 28); });
    });
  } };
  const s4 = { beats: [0, 3, 10.8], sub: '學術建議與實務建議', draw(lt) {
    txt('建議分兩類', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(760, 1160, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const B = (x, a, items, c, at) => appear(prog(lt, at, .6), () => { shape(roundRectPts(x - 360, 260, 720, 340, 24), { fill: c, w: 4, smooth: false }); txt(a, x, 330, 46, { color: COL.black }); items.forEach((s, i) => txt('・' + s, x - 300, 410 + i * 60, 32, { color: COL.black, align: 'left' })); });
    B(540, '學術建議', ['理論怎麼解釋、怎麼修正', '未來研究可以怎麼做'], COL.blueL, 3.2);
    B(1380, '實務建議', ['給教練、選手', '給學校、單位的方案'], COL.greenL, 6.4);
    appear(prog(lt, 11, .6), () => noteBox(960, 700, 1000, 100, [['每個建議 ← 你的發現', 36, COL.red]], '#fff8e2', 1));
  } };
  const s5 = { beats: [0, 6.4, 13.2], sub: '摘要與關鍵字', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    ['目的', '方法', '參與者', '結果', '結論'].forEach((s, i) => appear(prog(lt, .4 + i * .4, .4), () => chip(760 + i * 230, 280, 200, 66, s, [COL.blueL, COL.greenL, COL.pinkL, COL.mustard, COL.blueL][i], 1, 30)));
    appear(prog(lt, 3.4, .5), () => txt('＋ 關鍵字 3–5 個', 1220, 370, 34, { color: COL.red }));
    appear(prog(lt, 6.6, .6), () => {
      [['學位論文', '500–1000 字'], ['期刊論文', '300–600 字']].forEach(([a, b], i) => { chip(980 + i * 480, 470, 300, 70, a, COL.white, 1, 32); txt(b, 980 + i * 480, 550, 36, { color: COL.black }); });
      txt('（中文摘要）', 1220, 600, 26, { color: COL.gray });
    });
    appear(prog(lt, 13.4, .5), () => chip(1220, 680, 760, 66, '課程網站：結論、建議，最後摘要', COL.mustard, 1, 30));
  } };
  const order = [[s1, 20], [s2, 14], [s3, 15], [s4, 15], [s5, 16]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag45(5, '結論、建議與摘要怎麼寫？'), scenes,
    sources: ['資料來源', 'Ad Hoc Working Group (1987). A proposal for more informative abstracts of clinical articles. Ann Intern Med, 106, 598–604.', '林彥光〈研究結論、建議與摘要敘寫〉講義'] };
}
EPISODES['m5e5'] = M5E5();

function M4E3() {
  const rule = (x, y, n, a, b, c, k) => appear(k, () => { shape(roundRectPts(x - 380, y - 90, 760, 200, 22), { fill: c, w: 4, smooth: false }); txt(n, x - 300, y - 30, 30, { color: COL.red, align: 'left' }); txt(a, x, y + 10, 38, { color: COL.black }); txt(b, x, y + 70, 30, { color: COL.green }); });
  const s1 = { beats: [0, 5.8, 9.4], sub: '0.05 從哪來', draw(lt) {
    ground(lt);
    txt('1925・費雪', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { paperSheet(420, 450, 360, 400, -.03); txt('Statistical Methods', 420, 360, 28, { color: COL.black }); txt('for Research Workers', 420, 400, 28, { color: COL.black }); txt('0.05「很方便」', 420, 510, 36, { color: COL.red }); });
    appear(prog(lt, 6, .6), () => {
      ink([[900, 520], [1700, 520]], { w: 5 }); ink([[1300, 470], [1300, 570]], { w: 5, color: COL.red }); txt('0.05', 1300, 450, 40, { color: COL.red });
      txt('顯著', 1080, 600, 34, { color: COL.green }); txt('不顯著', 1520, 600, 34, { color: COL.gray });
    });
    appear(prog(lt, 9.6, .6), () => { txt('0.049　≈　0.051', 1300, 690, 40, { color: COL.black }); txt('只是慣例', 1300, 760, 34, { color: COL.red }); });
  } };
  const s2 = { beats: [0, 7, 12.6], sub: '退稿捷徑 1–2', draw(lt) {
    txt('史特納（2007）：結果段落的退稿捷徑', 960, 140, 52, { p: prog(lt, .2, .8), color: COL.black });
    underline(500, 1420, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    rule(520, 400, '① ✗', '只寫用哪個軟體', '✓ 寫分析選項（如萃取、轉軸）', COL.pinkL, prog(lt, 7.2, .6));
    rule(1400, 400, '② ✗', 'p = 0.000', '✓ p < .001', COL.blueL, prog(lt, 12.8, .6));
  } };
  const s3 = { beats: [0, 4, 9.6], sub: '退稿捷徑 3–4', draw(lt) {
    txt('統計值、效果量都要給', 960, 140, 56, { p: prog(lt, .2, .8), color: COL.black });
    underline(620, 1300, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    rule(520, 400, '③ ✗', '只給 p = .04', '✓ F(2, 128) = 3.25, p = .04', COL.pinkL, prog(lt, .6, .6));
    rule(1400, 400, '④ ✗', '沒有信賴區間、效果量', '✓ 95% CI、η²、d', COL.blueL, prog(lt, 9.8, .6));
    appear(prog(lt, 11, .6), () => chip(960, 650, 520, 76, '顯著 ≠ 重要', COL.mustard, 1, 38));
  } };
  const s4 = { beats: [0, 7.6, 14.4], sub: '退稿捷徑 5–6', draw(lt) {
    txt('信效度怎麼報', 960, 140, 58, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { txt('t = −2.31　→　t = 2.31', 960, 280, 44, { color: COL.black }); txt('負號只是組別順序', 960, 340, 30, { color: COL.red }); });
    rule(520, 530, '⑤ ✗', '檢定信度係數 > 0', '✓ 看大小：.50 並不夠好', COL.pinkL, prog(lt, 7.8, .6));
    rule(1400, 530, '⑥ ✗', '「本量表具信效度」', '✓ 在你的樣本上重新證明', COL.blueL, prog(lt, 14.6, .6));
  } };
  const s5 = { beats: [0, 9.4, 13], sub: '退稿捷徑 7', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    rule(1200, 340, '⑦ ✗', 'n = 20，年齡 35.45 歲', '✓ 35.5 歲就夠了', COL.pinkL, prog(lt, .6, .6));
    appear(prog(lt, 9.6, .6), () => noteBox(1200, 540, 900, 90, [['反過來做，就是好的結果段落', 34, COL.red]], '#fff8e2', 1));
    appear(prog(lt, 13.2, .5), () => chip(1200, 660, 760, 66, '課程網站：用清單檢查結果', COL.mustard, 1, 30));
  } };
  const order = [[s1, 17], [s2, 18], [s3, 16], [s4, 21], [s5, 18]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag45(4, '結果段落怎麼避免退稿？'), scenes,
    sources: ['資料來源', 'Streiner, D. L. (2007). A shortcut to rejection: How not to write the results section of a paper. Can J Psychiatry, 52, 385–389.', 'Fisher, R. A. (1925). Statistical methods for research workers.'] };
}
EPISODES['m4e3'] = M4E3();
