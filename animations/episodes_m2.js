// 研究法工作坊｜第 2 章 文獻探討。沿用 episodes_m1.js / episodes_m3.js 的元件。
function rtag2(label) { return '研究法工作坊｜第 2 章 ' + label; }

function M2E4() {
  const s1 = { beats: [0, 6.8, 13, 18], sub: '同樣的文獻，不同的結論', draw(lt) {
    ground(lt);
    const k2 = prog(lt, 6.8, .6);
    appear(1 - k2, () => txt('1952・艾森克', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black }));
    appear(k2, () => txt('1977・史密斯與格拉斯', 960, 150, 66, { color: COL.black }));
    underline(640, 1280, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { noteBox(460, 360, 640, 150, [['心理治療的效果', 36], ['不比自然痊癒好？', 40, COL.red]], COL.white, 1); });
    appear(prog(lt, 7, .6), () => {
      for (let i = 0; i < 24; i++) { const c = i % 6, r = Math.floor(i / 6); appear(prog(lt, 7 + i * .05, .3), () => shape(rectPts(1040 + c * 90, 270 + r * 80, 70, 56), { fill: [COL.blueL, COL.greenL, COL.pinkL][i % 3], w: 2.5, smooth: false })); }
      txt('375 篇研究、同一把尺', 1300, 620, 38, { color: COL.black });
    });
    appear(prog(lt, 13.2, .6), () => {
      shape(rectPts(260, 560, 160, 120), { fill: COL.gray, w: 3, smooth: false }); txt('未治療', 340, 720, 30, { color: COL.black });
      shape(rectPts(470, 500, 160, 180), { fill: COL.greenL, w: 3, smooth: false }); txt('治療', 550, 720, 30, { color: COL.black });
      arrow(380, 520, 520, 470, { w: 4, color: COL.red, head: 12 });
    });
    appear(prog(lt, 18.2, .5), () => chip(1300, 740, 640, 70, '整理與比較，決定結論', COL.mustard, 1, 34));
  } };
  const s2 = { beats: [0, 2.2, 8.6], sub: '文獻探討的五個功能', draw(lt) {
    txt('文獻探討的五個功能', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(660, 1260, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const F = [['熟悉主題', 2.4], ['別人做過什麼', 3.6], ['研究進展到哪', 5.2], ['規劃取樣', 8.8], ['討論的比較基準', 10.6]];
    F.forEach(([s, at], i) => { const x = 260 + i * 350; appear(prog(lt, at, .5), () => {
      shape(ellPts(x, 380, 150, 150, 0, i + 3, 26), { fill: [COL.blueL, COL.greenL, COL.pinkL, COL.mustard, '#e8e0f2'][i], w: 4 });
      txt(String(i + 1), x, 340, 56, { color: COL.red }); txt(s, x, 420, 32, { color: COL.black });
    }); });
  } };
  const s3 = { beats: [0, 5.4, 11], sub: '挑文獻的五個原則', draw(lt) {
    txt('挑文獻：五個原則', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(680, 1240, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const P = [['相關', '扣住主題', COL.blueL], ['新近', '近幾年的研究', COL.greenL], ['多元', '不只引一個人', COL.pinkL], ['重要', '代表性文獻', COL.mustard], ['確實', '第一手、讀全文', '#e8e0f2']];
    P.forEach(([a, b, c], i) => { const x = 260 + i * 350, k = prog(lt, .8 + i * .6, .5); appear(k, () => {
      shape(roundRectPts(x - 150, 260, 300, 120, 20), { fill: c, w: 4, smooth: false }); txt(a, x, 335, 48, { color: COL.black, p: clamp(k * 1.4) });
      if (lt > 5.6 + (i > 2 ? 4 : 0) || i < 3 && lt > 5.6) txt(b, x, 430, 30, { color: COL.black, p: prog(lt, i < 3 ? 5.6 + i * .8 : 11.2, .5) });
    }); });
    appear(prog(lt, 11.4, .6), () => noteBox(960, 590, 1000, 110, [['盡量引第一手文獻，讀全文，不只讀摘要', 34, COL.red]], '#fff8e2', 1));
  } };
  const s4 = { beats: [0, 6.4, 11.6], sub: '整體—部分—整體', draw(lt) {
    txt('整體 — 部分 — 整體', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(660, 1260, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    [['引言', '說明範圍（導覽圖）', COL.blueL, 280, 90], ['評論性回顧', '背景、理論、實務、研究', COL.greenL, 400, 160], ['摘要', '總結重點', COL.blueL, 590, 90]].forEach(([a, b, c, y, h], i) => appear(prog(lt, .8 + i * 1.6, .5), () => {
      shape(roundRectPts(220, y, 700, h, 18), { fill: c, w: 4, smooth: false }); txt(a, 380, y + h / 2 + 12, 40, { color: COL.black }); txt(b, 730, y + h / 2 + 10, 28, { color: COL.black });
    }));
    appear(prog(lt, 6.6, .6), () => { txt('排列方式', 1400, 300, 40, { color: COL.black }); ['依時間', '依取向', '由一般到特定'].forEach((s, i) => chip(1400, 380 + i * 80, 380, 64, s, COL.white, prog(lt, 6.8 + i * .5, .4), 30)); });
    appear(prog(lt, 11.8, .6), () => { cross(1150, 700, .8, 1); txt('只列表、不評析', 1420, 710, 38, { color: COL.red }); });
  } };
  const s5 = { beats: [0, 4.6, 10.4], sub: '引註原則', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    appear(prog(lt, .4, .6), () => {
      noteBox(1200, 280, 1000, 140, [['二手文獻', 32, COL.black], ['……（Rabbitt, 1982，引自 Lyon et al., 2014）', 32, COL.red]], COL.white, 1);
      txt('英文：as cited in', 1200, 390, 28, { color: COL.gray });
    });
    appear(prog(lt, 4.8, .6), () => {
      chip(950, 490, 400, 70, '別人的話', COL.blueL, 1, 32); chip(1450, 490, 400, 70, '你的看法', COL.greenL, 1, 32);
      txt('分清楚、不曲解', 1200, 580, 34, { color: COL.red });
    });
    appear(prog(lt, 10.6, .5), () => chip(1200, 670, 760, 66, '課程網站：把矩陣寫成評析', COL.mustard, 1, 30));
  } };
  const order = [[s1, 23], [s2, 14], [s3, 15], [s4, 16], [s5, 15]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag2('文獻探討怎麼寫？'), scenes,
    sources: ['資料來源', 'Eysenck, H. J. (1952). The effects of psychotherapy: An evaluation. J. Consulting Psychology, 16, 319–324.', 'Smith, M. L., & Glass, G. V. (1977). Meta-analysis of psychotherapy outcome studies. American Psychologist, 32, 752–760.', '林彥光〈文獻探討敘寫〉講義'] };
}
EPISODES['m2e4'] = M2E4();

function M2E6() {
  const s1 = { beats: [0, 5.8, 9.8, 14], sub: 'APA 格式的起點', draw(lt) {
    ground(lt);
    txt('1929・七頁的投稿須知', 960, 150, 64, { p: prog(lt, .2, .9), color: COL.black });
    underline(620, 1300, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { paperSheet(420, 470, 300, 380, -.03); txt('Psychological', 420, 360, 28, { color: COL.black }); txt('Bulletin', 420, 400, 28, { color: COL.black }); txt('7 頁', 420, 520, 48, { color: COL.red }); });
    appear(prog(lt, 6, .6), () => { txt('格式一致', 860, 420, 40, { color: COL.black }); txt('找得到出處', 860, 490, 40, { color: COL.black }); });
    appear(prog(lt, 10, .6), () => {
      for (let i = 0; i < 7; i++) shape(rectPts(1180 + i * 70, 560 - (i + 1) * 30, 56, (i + 1) * 30), { fill: i === 6 ? COL.mustard : COL.blueL, w: 2.5, smooth: false });
      txt('第 1 版 → 第 7 版（2019）', 1420, 610, 32, { color: COL.black });
    });
    appear(prog(lt, 14.2, .5), () => chip(1420, 720, 480, 72, 'APA 格式', COL.mustard, 1, 38));
  } };
  const s2 = { beats: [0, 3.8, 8], sub: '一筆文獻的四個部分', draw(lt) {
    txt('一筆文獻：四個部分', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(680, 1240, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    const parts = [['Cohen, J.', '作者', COL.blueL, 200], ['(1962).', '日期', COL.greenL, 520], ['The statistical power of …', '名稱', COL.pinkL, 900], ['J. Abnorm. Soc. Psychol., 65(3), 145–153.', '出處', COL.mustard, 1500]];
    parts.forEach(([a, b, c, x], i) => appear(prog(lt, .6 + i * .6, .5), () => { const w = [260, 200, 460, 660][i]; shape(roundRectPts(x - w / 2, 300, w, 80, 16), { fill: c, w: 3, smooth: false }); txt(a, x, 352, 28, { color: COL.black }); txt(b, x, 430, 32, { color: COL.black }); }));
    appear(prog(lt, 4, .6), () => { chip(560, 560, 520, 70, '中文：全名', COL.white, 1, 32); chip(1300, 560, 640, 70, '英文：姓＋名字縮寫', COL.white, 1, 32); });
    appear(prog(lt, 8.2, .6), () => txt('https://doi.org/10.1037/h0045186', 960, 690, 34, { color: COL.blue }));
  } };
  const s3 = { beats: [0, 5.6, 12], sub: '內文引註', draw(lt) {
    txt('內文引註 ⇄ 參考文獻', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(660, 1260, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { chip(560, 290, 460, 76, '內文引了', COL.blueL, 1, 34); arrow(800, 280, 1110, 280, { w: 4, color: COL.red, head: 12 }); arrow(1110, 305, 800, 305, { w: 4, color: COL.red, head: 12 }); chip(1360, 290, 460, 76, '文末就要列', COL.greenL, 1, 34); });
    appear(prog(lt, 5.8, .6), () => {
      txt('兩位：(Woodman & Hardy, 2003)', 960, 450, 36, { color: COL.black });
      txt('三位以上：(Hatzigeorgiadis et al., 2014)', 960, 520, 36, { color: COL.black, p: prog(lt, 7.6, .6) });
    });
    appear(prog(lt, 12.2, .6), () => txt('直接引用：(Cohen, 1962, p. 145)', 960, 620, 36, { color: COL.red }));
  } };
  const s4 = { beats: [0, 7, 10.4], sub: '排序與第七版', draw(lt) {
    txt('排序與第七版的改變', 960, 140, 60, { p: prog(lt, .2, .8), color: COL.black });
    underline(660, 1260, 190, { p: prog(lt, .8, .5), color: COL.mustardD });
    appear(prog(lt, .6, .6), () => { chip(500, 280, 520, 72, '中文：筆畫由少到多', COL.blueL, 1, 32); chip(1300, 280, 520, 72, '英文：姓氏字母', COL.greenL, 1, 32); });
    appear(prog(lt, 7.2, .6), () => {
      shape(rectPts(360, 380, 1200, 280), { fill: COL.white, w: 3, smooth: false });
      [['', '講義（第六版）', '第七版'], ['作者', '列到 7 位', '列到 20 位'], ['DOI', 'doi:10.xxxx', 'https://doi.org/10.xxxx'], ['書籍', '出版地：出版社', '只寫出版社']].forEach((r, i) => r.forEach((c, j) => txt(c, 480 + j * 440 - (j === 0 ? 40 : 0), 430 + i * 66, 30, { color: i === 0 ? COL.gray : (j === 2 ? COL.red : COL.black) })));
    });
  } };
  const s5 = { beats: [0, 7.6, 10.6], sub: '常見錯誤', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    [['年份不一致', 'Cohen (1962) vs (1963)'], ['少了頁碼', '65(3)，___'], ['標題大小寫', 'The Statistical Power Of…']].forEach(([a, b], i) => appear(prog(lt, .6 + i * 1.6, .5), () => { const x = 880 + i * 400; chip(x, 290, 340, 70, a, COL.pinkL, 1, 32); txt(b, x, 370, 24, { color: COL.gray }); cross(x + 150, 270, .45, 1); }));
    appear(prog(lt, 7.8, .6), () => noteBox(1280, 500, 900, 90, [['口試委員最容易檢查的地方', 34, COL.red]], '#fff8e2', 1));
    appear(prog(lt, 10.8, .5), () => chip(1280, 640, 760, 66, '課程網站：APA 文獻產生器', COL.mustard, 1, 30));
  } };
  const order = [[s1, 20], [s2, 14], [s3, 15], [s4, 15], [s5, 15]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag2('參考文獻怎麼列？'), scenes,
    sources: ['資料來源', 'Bentley, M., et al. (1929). Instructions in regard to preparation of manuscript. Psychological Bulletin, 26, 57–63.', 'American Psychological Association (2020). Publication manual (7th ed.).', '林彥光〈參考文獻〉〈文獻探討敘寫〉講義'] };
}
EPISODES['m2e6'] = M2E6();
