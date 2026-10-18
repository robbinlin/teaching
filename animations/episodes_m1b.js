// 研究法工作坊｜第 1 章 EP2–EP5（緒論敘寫）。
const ep1End = (order, tag, sources, scenesIn) => { let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; }); return { ...EP1, dur: t, tag: rtag(tag), scenes, sources }; };
const wrap1 = (lt, lines) => ['回到課程網站', lines];

function M1E2() {
  const s1 = { beats: [0, 4.6, 9.4, 14.4], sub: '1854 年倫敦霍亂', draw(lt) {
    ground(lt);
    txt('1854・倫敦', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, 4.8, .6), () => { noteBox(500, 320, 640, 100, [['為什麼大家會生病？', 38]], COL.white, 1); cross(780, 300, .6, prog(lt, 6.4, .4)); });
    appear(prog(lt, 9.6, .6), () => { noteBox(500, 470, 640, 120, [['喝寬街水泵的水', 34], ['和死亡有沒有關係？', 36, COL.red]], '#fff8e2', 1); });
    // 地圖
    appear(prog(lt, .8, .6), () => {
      shape(rectPts(1000, 260, 640, 460), { fill: '#f3ead2', w: 3, smooth: false });
      [[1000, 400, 1640, 400], [1000, 560, 1640, 560], [1180, 260, 1180, 720], [1420, 260, 1420, 720]].forEach(([a, b, c, d]) => ink([[a, b], [c, d]], { w: 2, color: COL.gray }));
      shape(rectPts(1290, 470, 30, 30), { fill: COL.blue, w: 3, smooth: false }); txt('水泵', 1305, 535, 26, { color: COL.blue });
    });
    const D = [[1260, 440], [1340, 450], [1280, 520], [1350, 510], [1230, 480], [1380, 470], [1310, 420], [1250, 560], [1360, 560], [1210, 430], [1400, 520], [1300, 590], [1100, 330], [1550, 650]];
    D.forEach(([x, y], i) => appear(prog(lt, 14.6 + i * .12, .2), () => shape(rectPts(x - 8, y - 8, 16, 16), { fill: COL.black, w: 1.5, smooth: false })));
  } };
  const s2 = { beats: [0, 2.6], sub: '好問題的三樣東西', draw(lt) {
    txt('好的研究問題：三樣東西', 960, 140, 58, { p: prog(lt, .2, .8), color: COL.black });
    underline(620, 1300, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    [['對象', '研究誰', COL.blueL], ['變項', '看什麼', COL.greenL], ['關係', '關聯？差異？預測？', COL.pinkL]].forEach(([a, b, c], i) => { const x = 400 + i * 560; appear(prog(lt, 2.8 + i * 1.6, .5), () => { shape(roundRectPts(x - 230, 300, 460, 220, 24), { fill: c, w: 4, smooth: false }); txt(a, x, 390, 56, { color: COL.black }); txt(b, x, 470, 32, { color: COL.black }); }); });
  } };
  const s3 = { beats: [0, 3, 6.6, 13.4], sub: '一步步縮小', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: lt > 3 && lt < 6.6 ? 'o' : 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    bubble(260, 300, 460, 110, 190, 440, '運動訓練好不好？', 34, prog(lt, .4, .5));
    appear(prog(lt, 3.2, .4), () => cross(470, 290, .6, 1));
    [['主題', '疲勞管理', COL.blueL], ['對象', '大專划船選手', COL.greenL], ['變項', '睡眠時數、疲勞分數', COL.pinkL]].forEach(([a, b, c], i) => appear(prog(lt, 6.8 + i * 1.6, .5), () => { const w = 900 - i * 160; shape(roundRectPts(1250 - w / 2, 250 + i * 110, w, 90, 20), { fill: c, w: 3.5, smooth: false }); txt(a + '：' + b, 1250, 308 + i * 110, 34, { color: COL.black }); }));
    appear(prog(lt, 13.6, .6), () => noteBox(1250, 640, 1100, 110, [['睡眠時數與賽季疲勞分數，是否有關聯？', 38, COL.red]], '#fff8e2', 1));
  } };
  const s4 = { beats: [0, 5.8], sub: '能用資料回答嗎', draw(lt) {
    txt('能用資料回答嗎？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { noteBox(960, 320, 1000, 100, [['為什麼選手會受傷？', 40]], COL.white, 1); cross(1520, 320, .7, prog(lt, 2.6, .4)); txt('原因太多、範圍太大', 960, 420, 32, { color: COL.red, p: prog(lt, 2.8, .5) }); });
    appear(prog(lt, 6, .6), () => { noteBox(960, 560, 1300, 110, [['大專田徑選手的睡眠時數與疲勞分數是否有關聯？', 36]], '#eef7ef', 1); check(1680, 550, .9, prog(lt, 8, .4)); });
  } };
  const s5 = { beats: [0, 4], sub: '寫出你的研究問題', draw(lt) {
    ground(lt, 80, 1840);
    student(250, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    prof(1680, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT, 1) * .3 });
    noteBox(960, 300, 1100, 110, [['「＿＿（對象）的＿＿與＿＿是否有＿＿？」', 38]], COL.white, prog(lt, .4, .5));
    appear(prog(lt, 4.2, .6), () => chip(960, 500, 700, 90, '能被資料回答，才是研究問題', COL.mustard, 1, 38));
  } };
  return ep1End([[s1, 21], [s2, 10], [s3, 19], [s4, 12], [s5, 10]], 'EP2　研究問題怎麼寫？', ['資料來源', 'Science History Institute: John Snow hunts the blue death', 'JSTOR Daily: John Snow and the birth of epidemiology', '林彥光〈緒論敘寫〉講義']);
}
EPISODES['m1e2'] = M1E2();

function M1E3() {
  const s1 = { beats: [0, 6.4, 11.6, 15.4], sub: '1747 年壞血病試驗', draw(lt) {
    ground(lt);
    txt('1747・索爾茲伯里號', 960, 150, 66, { p: prog(lt, .2, .9), color: COL.black });
    underline(640, 1280, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    const T = ['蘋果酒', '硫酸劑', '醋', '海水', '橘子檸檬', '藥膏'];
    T.forEach((s, i) => { const x = 330 + i * 250; appear(prog(lt, 6.6 + i * .3, .4), () => { mini(x - 40, 560, 1.1, i === 4 ? COL.mustard : COL.blueL, 'dots'); mini(x + 40, 560, 1.1, i === 4 ? COL.mustard : COL.blueL, 'dots'); chip(x, 330, 210, 60, s, i === 4 ? COL.mustard : COL.white, 1, 28); }); });
    appear(prog(lt, .8, .6), () => txt('12 位壞血病水手', 960, 260, 36, { color: COL.gray }));
    appear(prog(lt, 15.6, .6), () => { sparkle(1330, 420, 40, 1); txt('恢復最明顯', 1330, 740, 34, { color: COL.red }); });
  } };
  const s2 = { beats: [0, 3.4], sub: '目的＝問題的陳述版', draw(lt) {
    txt('研究目的＝研究問題的陳述版', 960, 140, 56, { p: prog(lt, .2, .8), color: COL.black });
    underline(560, 1360, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    ['探討', '比較', '驗證', '建立'].forEach((s, i) => chip(420 + i * 360, 380, 280, 100, s, [COL.blueL, COL.greenL, COL.pinkL, COL.mustard][i], prog(lt, 3.6 + i * .5, .4), 48));
    appear(prog(lt, 5.8, .5), () => txt('每一條都以動詞開頭', 960, 520, 36, { color: COL.red }));
  } };
  const s3 = { beats: [0, 3.4, 5.8, 8.4], sub: '拼一句目的', draw(lt) {
    txt('拼一句目的', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(760, 1160, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const P = [['探討', COL.blueL, 260, .6], ['大專排球選手', COL.greenL, 300, 3.6], ['八週肌力訓練', COL.pinkL, 320, 6], ['對垂直跳高度的影響', COL.mustard, 420, 8.6]];
    let x = 220; P.forEach(([s, c, w, at]) => { const xx = x + w / 2; appear(prog(lt, at, .5), () => chip(xx, 380 + (1 - easeOut(prog(lt, at, .5))) * -120, w, 90, s, c, 1, 36)); x += w + 20; });
    ['動詞', '對象', '介入', '結果'].forEach((s, i) => { let xx = 220; for (let j = 0; j < i; j++) xx += P[j][2] + 20; txt(s, xx + P[i][2] / 2, 470, 28, { color: COL.gray, p: prog(lt, P[i][3] + .4, .4) }); });
  } };
  const s4 = { beats: [0, 5.6], sub: '不合格的目的', draw(lt) {
    txt('這些不算目的', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { noteBox(560, 380, 760, 140, [['讓大家更重視運動', 38], ['願景，資料無法回答', 30, COL.red]], COL.white, 1); cross(900, 340, .7, prog(lt, 2.4, .4)); });
    appear(prog(lt, 5.8, .6), () => { noteBox(1380, 380, 680, 140, [['了解…、看看…', 38], ['動詞太模糊', 30, COL.red]], COL.white, 1); cross(1680, 340, .7, prog(lt, 7, .4)); });
  } };
  const s5 = { beats: [0, 5], sub: '寫出兩條目的', draw(lt) {
    ground(lt, 80, 1840);
    student(250, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    prof(1680, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT, 1) * .3 });
    [['研究問題一', '目的一'], ['研究問題二', '目的二']].forEach(([a, b], i) => appear(prog(lt, .6 + i * .8, .5), () => { chip(720, 280 + i * 100, 340, 76, a, COL.blueL, 1, 32); arrow(900, 280 + i * 100, 1020, 280 + i * 100, { w: 4, color: COL.red, head: 12 }); chip(1200, 280 + i * 100, 300, 76, b, COL.greenL, 1, 32); }));
    appear(prog(lt, 5.2, .6), () => chip(960, 560, 640, 90, '目的要能用結果回答', COL.mustard, 1, 40));
  } };
  return ep1End([[s1, 20], [s2, 10], [s3, 14], [s4, 12], [s5, 10]], 'EP3　研究目的怎麼設立？', ['資料來源', 'Rethinking Clinical Trials: James Lind (1747)', 'Lind, J. (1753). A treatise of the scurvy.', '林彥光〈緒論敘寫〉講義']);
}
EPISODES['m1e3'] = M1E3();

function M1E4() {
  const s1 = { beats: [0, 7.6, 12.6], sub: '1847 年維也納產房', draw(lt) {
    ground(lt);
    txt('1847・維也納', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { chip(460, 300, 400, 76, '醫師的產房', COL.pinkL, 1, 34); chip(460, 420, 400, 76, '助產士的產房', COL.greenL, 1, 34); txt('死亡率較高', 760, 308, 30, { color: COL.red, align: 'left' }); });
    appear(prog(lt, 7.8, .6), () => noteBox(560, 580, 760, 120, [['假設：洗手可以降低死亡率', 36, COL.red]], '#fff8e2', 1));
    appear(prog(lt, 12.8, .6), () => {
      ink([[1100, 300], [1100, 680], [1700, 680]], { w: 3 });
      const v = [[1180, 18, '4 月'], [1600, 2, '7 月']];
      v.forEach(([x, p, m], i) => { const h = p * 18; shape(rectPts(x - 60, 680 - h, 120, h), { fill: i ? COL.greenL : COL.pinkL, w: 3, smooth: false }); txt((i ? '＜' : '約') + p + '%', x, 660 - h, 34, { color: COL.black }); txt(m, x, 720, 30, { color: COL.black }); });
      arrow(1260, 400, 1520, 600, { w: 4, color: COL.green, head: 14 });
      txt('含氯水洗手', 1400, 460, 30, { color: COL.green });
    });
  } };
  const s2 = { beats: [0, 3.8], sub: '操作型定義三件事', draw(lt) {
    txt('操作型定義：三件事', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(660, 1260, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    [['工具', COL.blueL], ['時間點', COL.greenL], ['數值意義', COL.pinkL]].forEach(([s, c], i) => { const x = 400 + i * 560; appear(prog(lt, 4 + i * 1.2, .5), () => { shape(roundRectPts(x - 220, 320, 440, 180, 24), { fill: c, w: 4, smooth: false }); txt(s, x, 425, 54, { color: COL.black }); }); });
  } };
  const s3 = { beats: [0, 4.4, 13.4], sub: '把「疲勞」變成分數', draw(lt) {
    txt('把「疲勞」變成分數', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(680, 1240, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { noteBox(960, 290, 900, 90, [['疲勞：選手覺得很累', 38]], COL.white, 1); cross(1360, 290, .6, prog(lt, 2.6, .4)); });
    appear(prog(lt, 4.6, .6), () => {
      noteBox(960, 450, 1500, 110, [['以 Borg CR-10 量表，訓練後 30 分鐘內測得的自覺疲勞分數', 36]], '#eef7ef', 1);
      chip(520, 560, 260, 56, '工具', COL.blueL, prog(lt, 6, .4), 28); chip(960, 560, 260, 56, '時間點', COL.greenL, prog(lt, 8, .4), 28);
    });
    appear(prog(lt, 13.6, .6), () => { chip(1400, 560, 300, 56, '數值意義', COL.pinkL, 1, 28); txt('分數越高越疲勞', 960, 680, 38, { color: COL.red }); });
  } };
  const s4 = { beats: [0, 4.6], sub: '假設句的四部分', draw(lt) {
    txt('假設句：四部分', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(720, 1200, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    ['時間點', '組別', '指標', '方向'].forEach((s, i) => chip(420 + i * 360, 290, 280, 76, s, [COL.blueL, COL.greenL, COL.pinkL, COL.mustard][i], prog(lt, .8 + i * .6, .4), 36));
    appear(prog(lt, 4.8, .6), () => {
      const P = [['八週訓練後，', COL.blueL], ['實驗組的', COL.greenL], ['2000 公尺成績進步幅度，', COL.pinkL], ['顯著大於控制組。', COL.mustard]];
      let x = 200; P.forEach(([s, c], i) => { const w = s.length * 34 + 20; appear(prog(lt, 4.8 + i * 1.2, .4), () => { shape(rectPts(x, 440, w, 80), { fill: c, w: 2.5, smooth: false }); txt(s, x + w / 2, 492, 34, { color: COL.black }); }); x += w + 6; });
    });
  } };
  const s5 = { beats: [0, 5], sub: '寫定義與假設', draw(lt) {
    ground(lt, 80, 1840);
    student(250, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    prof(1680, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT, 1) * .3 });
    chip(720, 300, 400, 80, '操作型定義', COL.blueL, prog(lt, .6, .5), 36); chip(1200, 300, 400, 80, '一條假設', COL.greenL, prog(lt, 1.4, .5), 36);
    appear(prog(lt, 5.2, .6), () => chip(960, 500, 700, 90, '好的假設，要能被資料推翻', COL.mustard, 1, 38));
  } };
  return ep1End([[s1, 19], [s2, 10], [s3, 17], [s4, 13], [s5, 10]], 'EP4　研究假設與名詞定義怎麼寫？', ['資料來源', 'Ignaz Semmelweis（Wikipedia）；ScienceAlert', '林彥光〈緒論敘寫〉講義']);
}
EPISODES['m1e4'] = M1E4();

function M1E5() {
  const s1 = { beats: [0, 7.8, 11.6, 18.6], sub: '1936 年文學文摘民調', draw(lt) {
    ground(lt);
    txt('1936・美國總統大選', 960, 150, 66, { p: prog(lt, .2, .9), color: COL.black });
    underline(640, 1280, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { for (let i = 0; i < 12; i++) envelope(260 + (i % 4) * 130, 300 + Math.floor(i / 4) * 100, .8, prog(lt, .8 + i * .1, .3)); txt('寄出約 1000 萬份、收回約 240 萬份', 450, 640, 30, { color: COL.black }); });
    appear(prog(lt, 7.8, .6), () => { chip(1200, 300, 360, 76, '預測：蘭登', COL.blueL, 1, 34); chip(1600, 300, 360, 76, '結果：羅斯福', COL.pinkL, 1, 34); cross(1390, 290, .5, prog(lt, 9, .4)); });
    appear(prog(lt, 11.8, .6), () => { noteBox(1400, 480, 700, 140, [['名單：電話簿、車輛登記', 34], ['大蕭條時期 → 偏向有錢人', 32, COL.red]], '#fff8e2', 1); });
    appear(prog(lt, 18.8, .5), () => chip(1400, 650, 600, 70, '樣本大 ≠ 樣本對', COL.mustard, 1, 36));
  } };
  const s2 = { beats: [0, 4.8], sub: '範圍與限制', draw(lt) {
    txt('範圍 vs 限制', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(740, 1180, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { shape(roundRectPts(180, 260, 720, 320, 24), { fill: COL.blueL, w: 4, smooth: false }); txt('範圍', 540, 340, 52, { color: COL.black }); txt('你選的邊界', 540, 410, 32, { color: COL.black }); txt('誰・何時・何地', 540, 480, 34, { color: COL.red }); });
    appear(prog(lt, 5, .6), () => { shape(roundRectPts(1020, 260, 720, 320, 24), { fill: COL.pinkL, w: 4, smooth: false }); txt('限制', 1380, 340, 52, { color: COL.black }); txt('你控制不了的部分', 1380, 410, 32, { color: COL.black }); txt('取樣方式・測量方法', 1380, 480, 34, { color: COL.red }); });
  } };
  const s3 = { beats: [0, 6.2, 10.4], sub: '划船研究的範例', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    paperSheet(1200, 450, 1260, 560, -.012);
    const rows = [['範圍', COL.blueL, '2026 年北部大專划船校隊選手', .4], ['限制', COL.pinkL, '方便取樣，推論他族群須謹慎', 6.4], ['重要性', COL.greenL, '理論補證據；實務供教練參考', 10.6]];
    rows.forEach(([tag, c, s, at], i) => { const k = prog(lt, at, .8), y = 300 + i * 130; appear(k, () => { chip(720, y, 150, 56, tag, c, 1, 28); txt(s, 830, y + 2, 34, { color: COL.black, align: 'left', p: k }); }); });
  } };
  const s4 = { beats: [0, 5.2], sub: '兩個反例', draw(lt) {
    txt('兩個反例', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(760, 1160, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { noteBox(560, 380, 760, 140, [['「本研究沒有任何限制」', 36], ['讀者反而不信任', 30, COL.red]], COL.white, 1); cross(920, 330, .6, prog(lt, 2.6, .4)); });
    appear(prog(lt, 5.4, .6), () => { noteBox(1380, 380, 700, 140, [['「讓全世界選手都變強」', 36], ['過度推論', 30, COL.red]], COL.white, 1); cross(1710, 330, .6, prog(lt, 6.8, .4)); });
  } };
  const s5 = { beats: [0, 5], sub: '寫範圍、限制、重要性', draw(lt) {
    ground(lt, 80, 1840);
    student(250, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    prof(1680, GY, .72, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT, 1) * .3 });
    ['範圍', '限制', '重要性'].forEach((s, i) => chip(640 + i * 320, 300, 260, 76, s, [COL.blueL, COL.pinkL, COL.greenL][i], prog(lt, .6 + i * .5, .4), 34));
    appear(prog(lt, 5.2, .6), () => chip(960, 500, 760, 90, '誠實交代邊界，研究更可信', COL.mustard, 1, 38));
  } };
  return ep1End([[s1, 24], [s2, 11], [s3, 16], [s4, 11], [s5, 10]], 'EP5　研究範圍與限制怎麼設定？', ['資料來源', 'Emory University: Historical blunders (Literary Digest 1936)', 'Data 100 course notes: Sampling', '林彥光〈緒論敘寫〉講義']);
}
EPISODES['m1e5'] = M1E5();

function M0E1() {
  const s1 = { beats: [0, 5.2, 11, 16], sub: '權威可能會錯', draw(lt) {
    ground(lt);
    txt('1543・維薩留斯', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(680, 1240, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { paperSheet(420, 450, 360, 380, -.03); txt('蓋倫的書', 420, 340, 40, { color: COL.black }); txt('1300 多年的權威', 420, 420, 30, { color: COL.gray }); });
    appear(prog(lt, 5.4, .6), () => { paperSheet(1000, 450, 360, 380, .02); txt('人體解剖', 1000, 340, 40, { color: COL.black }); txt('親手觀察', 1000, 420, 30, { color: COL.green }); });
    appear(prog(lt, 11.2, .6), () => {
      chip(1500, 330, 420, 70, '蓋倫：下顎兩塊', COL.pinkL, 1, 32); cross(1700, 320, .5, prog(lt, 12.4, .3));
      chip(1500, 450, 420, 70, '人體：下顎一塊', COL.greenL, 1, 32); check(1700, 440, .6, prog(lt, 13, .3));
    });
    appear(prog(lt, 16.2, .5), () => chip(1500, 580, 560, 72, '資料是最後的裁判', COL.mustard, 1, 36));
  } };
  const s2 = { beats: [0, 8.6], sub: '知識的五種來源', draw(lt) {
    txt('知識從哪裡來？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    ['傳統', '權威', '個人經驗', '邏輯推理', '科學方法'].forEach((s, i) => { const x = 260 + i * 350; appear(prog(lt, 1 + i * .9, .5), () => { const y = 520 - i * 50; shape(rectPts(x - 140, y, 280, 640 - y), { fill: i === 4 ? COL.mustard : [COL.blueL, COL.greenL, COL.pinkL, '#e8e0f2'][i], w: 3.5, smooth: false }); txt(s, x, y - 24, 36, { color: COL.black }); }); });
    appear(prog(lt, 8.8, .6), () => noteBox(960, 740, 1300, 100, [['研究＝有計畫、有系統地收集、分析、解釋資料', 34, COL.red]], '#fff8e2', 1));
  } };
  const s3 = { beats: [0, 4, 11.6], sub: '研究的三種分類', draw(lt) {
    txt('研究怎麼分類？', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const col = (x, h, items, c, at) => appear(prog(lt, at, .6), () => { chip(x, 270, 420, 76, h, COL.white, 1, 34); items.forEach((s, i) => chip(x, 370 + i * 90, 420, 70, s, c, prog(lt, at + .3 + i * .5, .4), 28)); });
    col(380, '依性質', ['質性', '量化'], COL.blueL, .6);
    col(960, '依層次', ['第一層：探索、敘述', '第二層：比較、相關', '第三層：驗證因果'], COL.greenL, 4.2);
    col(1540, '依設計', ['非實驗', '準實驗', '實驗'], COL.pinkL, 11.8);
  } };
  const s4 = { beats: [0, 2.4, 9.6], sub: '論文五章', draw(lt) {
    txt('一篇論文，五章', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const C = [['緒論', '為什麼做', 2.6], ['文獻探討', '別人做了什麼', 4.4], ['研究方法', '你怎麼做', 6.6], ['研究結果', '發現了什麼', 9.8], ['討論與結論', '意義與建議', 11.8]];
    C.forEach(([a, b, at], i) => { const x = 260 + i * 350; appear(prog(lt, at, .5), () => { shape(roundRectPts(x - 150, 300, 300, 260, 20), { fill: [COL.blueL, COL.greenL, COL.pinkL, COL.mustard, '#e8e0f2'][i], w: 4, smooth: false }); txt('第 ' + (i + 1) + ' 章', x, 360, 30, { color: COL.gray }); txt(a, x, 430, 38, { color: COL.black }); txt(b, x, 500, 28, { color: COL.black }); if (i < 4) arrow(x + 155, 430, x + 195, 430, { w: 4, color: COL.red, head: 10 }); }); });
  } };
  const s5 = { beats: [0, 4.6, 8.6], sub: '從這裡開始', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    noteBox(1200, 280, 900, 90, [['研究倫理：先保護參與者，再談資料', 34, COL.red]], '#fff8e2', prog(lt, .4, .5));
    appear(prog(lt, 4.8, .6), () => { for (let i = 0; i < 4; i++) { const x = 900 + i * 200; chip(x, 430, 160, 60, '研究 ' + (i + 1), COL.blueL, prog(lt, 4.8 + i * .4, .3), 26); if (i < 3) arrow(x + 85, 430, x + 115, 430, { w: 3, color: COL.red, head: 9 }); } });
    appear(prog(lt, 8.8, .5), () => chip(1200, 580, 860, 72, '每個單元一段 → 論文初稿', COL.mustard, 1, 34));
  } };
  return { ...ep1End([[s1, 21], [s2, 14], [s3, 17], [s4, 16], [s5, 13]], '', ['資料來源', 'The Conversation (2014). The man who revolutionized our knowledge of the human body.', 'Vesalius, A. (1543). De humani corporis fabrica.', '林彥光〈研究方法與緒論〉講義']), tag: '研究法工作坊｜開場 研究是什麼？論文怎麼走？' };
}
EPISODES['m0e1'] = M0E1();
