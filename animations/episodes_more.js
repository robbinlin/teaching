// 研究法工作坊｜第二批：2.1、2.2、2.3、2.5、4.1–4.2、5.1/5.3、5.4
const mkEp = (order, tag, sources) => { let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; }); return { ...EP1, dur: t, tag, scenes, sources }; };
const tagN = (n, s) => '研究法工作坊｜第 ' + n + ' 章 ' + s;
const head = (lt, s, w) => { txt(s, 960, 140, 58, { p: prog(lt, .2, .8), color: COL.black }); underline(960 - w / 2, 960 + w / 2, 190, { p: prog(lt, .8, .5), color: COL.mustardD }); };
const duo = (lt) => { ground(lt, 80, 560); student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 }); prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 }); };
const card = (x, y, w, h, a, b, col, k, sa = 42, sb = 28) => appear(k, () => { shape(roundRectPts(x - w / 2, y - h / 2, w, h, 22), { fill: col, w: 4, smooth: false }); txt(a, x, y - (b ? 14 : -12), sa, { color: COL.black, p: clamp(k * 1.4) }); if (b) txt(b, x, y + 40, sb, { color: COL.black }); });
const PAL = [COL.blueL, COL.greenL, COL.pinkL, COL.mustard, '#e8e0f2'];

function M2E1() {
  const s1 = { beats: [0, 7.6, 13], sub: '引文索引', draw(lt) {
    ground(lt);
    txt('1955・加菲爾德', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black }); underline(700, 1220, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { paperSheet(960, 470, 260, 300, 0); txt('一篇好論文', 960, 420, 34, { color: COL.black }); });
    appear(prog(lt, 7.8, .6), () => {
      [[420, 330], [420, 470], [420, 610]].forEach(([x, y], i) => { chip(x, y, 260, 64, '參考文獻 ' + (i + 1), COL.blueL, prog(lt, 7.8 + i * .3, .3), 28); arrow(820, 470, x + 140, y, { w: 3, color: COL.blue, head: 10, p: prog(lt, 8, .6) }); });
      txt('往前找', 420, 260, 32, { color: COL.blue });
      [[1500, 330], [1500, 470], [1500, 610]].forEach(([x, y], i) => { chip(x, y, 260, 64, '引用它的 ' + (i + 1), COL.greenL, prog(lt, 9.6 + i * .3, .3), 28); arrow(1100, 470, x - 140, y, { w: 3, color: COL.green, head: 10, p: prog(lt, 9.8, .6) }); });
      txt('往後找', 1500, 260, 32, { color: COL.green, p: prog(lt, 9.6, .4) });
    });
    appear(prog(lt, 13.2, .5), () => chip(960, 760, 520, 70, '引文資料庫的起點', COL.mustard, 1, 34));
  } };
  const s2 = { beats: [0, 5.4, 12], sub: '關鍵字與布林運算', draw(lt) {
    head(lt, '把問題拆成關鍵字', 520);
    [['對象', '大專划船選手'], ['變項', '睡眠時數'], ['結果', '疲勞']].forEach(([a, b], i) => { const x = 400 + i * 560; card(x, 320, 440, 150, a, b, PAL[i], prog(lt, .6 + i * .8, .5)); appear(prog(lt, 5.6 + i * .5, .5), () => { txt(['划船・rowing・rower', '睡眠品質・sleep', '自覺疲勞・fatigue・exhaustion'][i], x, 450, 28, { color: COL.gray }); }); });
    appear(prog(lt, 12.2, .6), () => { noteBox(960, 620, 1500, 110, [['(rower OR rowing)  AND  sleep  AND  (fatigue OR exhaustion)', 36, COL.red]], '#fff8e2', 1); txt('同義詞用 OR，不同概念用 AND', 960, 720, 30, { color: COL.black }); });
  } };
  const s3 = { beats: [0, 9.6, 16.2], sub: '資料庫與來源', draw(lt) {
    head(lt, '去哪裡找？', 420);
    [['臺灣博碩士論文', COL.blueL], ['華藝', COL.blueL], ['PubMed', COL.greenL], ['SPORTDiscus', COL.greenL], ['Google Scholar', COL.greenL]].forEach(([s, c], i) => chip(260 + i * 350, 290, 320, 72, s, c, prog(lt, .6 + i * .5, .4), 28));
    appear(prog(lt, 9.8, .6), () => { card(600, 480, 560, 150, '初級來源', '原始研究（期刊、學位論文）', COL.mustard, 1, 40, 28); card(1320, 480, 560, 150, '次級來源', '回顧、教科書、彙整', '#eee6d2', 1, 40, 28); txt('以初級為主', 960, 600, 32, { color: COL.red }); });
    appear(prog(lt, 16.4, .6), () => chip(960, 700, 760, 66, '好文獻 → 它的參考文獻＋被引用紀錄', COL.white, 1, 30));
  } };
  const s4 = { beats: [0, 5, 11], sub: '篩選與紀錄', draw(lt) {
    head(lt, '篩選，也要記錄', 460);
    appear(prog(lt, .6, .5), () => txt('相關・新近・多元・重要・確實', 960, 232, 30, { color: COL.gray }));
    const F = [['檢索結果', '120 篇', COL.blueL], ['看標題摘要', '35 篇', COL.greenL], ['讀全文', '14 篇', COL.pinkL], ['納入', '9 篇', COL.mustard]];
    F.forEach(([a, b, c], i) => appear(prog(lt, 5.2 + i * 1.2, .5), () => { const w = 900 - i * 160; shape(roundRectPts(960 - w / 2, 270 + i * 110, w, 90, 18), { fill: c, w: 3.5, smooth: false }); txt(a + '　' + b, 960, 328 + i * 110, 36, { color: COL.black }); }));
    appear(prog(lt, 11.2, .6), () => txt('每一步刪了幾篇、為什麼刪（示意數字）', 960, 740, 30, { color: COL.red }));
  } };
  const s5 = { beats: [0, 7.4, 11.6], sub: '寫進論文', draw(lt) {
    duo(lt); paperSheet(1200, 400, 1240, 470, -.012);
    txt('文獻檢索策略', 1200, 210, 42, { color: COL.black, p: prog(lt, .4, .6) });
    [['資料庫', COL.blueL], ['關鍵字', COL.greenL], ['年代範圍', COL.pinkL], ['篩選結果', COL.mustard]].forEach(([s, c], i) => chip(820 + i * 255, 300, 230, 60, s, c, prog(lt, .8 + i * .5, .4), 28));
    appear(prog(lt, 7.6, .6), () => txt('別人照著做，找得到差不多的文獻', 1200, 420, 34, { color: COL.red }));
    appear(prog(lt, 11.8, .5), () => chip(1200, 560, 720, 66, '課程網站：寫下檢索策略', COL.mustard, 1, 30));
  } };
  return mkEp([[s1, 18], [s2, 22], [s3, 24], [s4, 18], [s5, 18]], tagN(2, '文獻怎麼找？'), ['資料來源', 'Garfield, E. (1955). Citation indexes for science. Science, 122, 108–111.', '林彥光〈文獻探討敘寫〉講義']);
}
EPISODES['m2e1'] = M2E1();

function M2E2() {
  const s1 = { beats: [0, 9, 15], sub: '為什麼要批判性閱讀', draw(lt) {
    ground(lt);
    txt('2005・約安尼迪斯', 960, 150, 68, { p: prog(lt, .2, .9), color: COL.black }); underline(680, 1240, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { paperSheet(520, 450, 520, 360, -.02); txt('Why most published', 520, 380, 30, { color: COL.black }); txt('research findings', 520, 425, 30, { color: COL.black }); txt('are false', 520, 470, 30, { color: COL.red }); txt('PLoS Medicine', 520, 560, 26, { color: COL.gray }); });
    appear(prog(lt, 9.2, .6), () => ['樣本小', '效果小', '分析彈性大'].forEach((s, i) => chip(1300, 320 + i * 100, 400, 76, s, COL.pinkL, prog(lt, 9.2 + i * .5, .4), 34)));
    appear(prog(lt, 15.2, .5), () => chip(1300, 680, 620, 70, '看結論，更要看怎麼得到', COL.mustard, 1, 32));
  } };
  const s2 = { beats: [0, 2.6, 10], sub: '一篇抓五件事', draw(lt) {
    head(lt, '一篇文獻，抓五件事', 560);
    ['目的與問題', '對象', '設計與方法', '主要結果', '限制'].forEach((s, i) => card(260 + i * 350, 350, 320, 150, String(i + 1), s, PAL[i], prog(lt, 2.8 + i * .9, .4), 48, 30));
    appear(prog(lt, 10.2, .6), () => noteBox(960, 590, 1000, 90, [['先記 APA 書目，再寫摘要', 34, COL.red]], '#fff8e2', 1));
  } };
  const s3 = { beats: [0, 5.6, 16], sub: '一句話摘要', draw(lt) {
    head(lt, '一句話摘要', 380);
    const P = [['誰', 'Hatzigeorgiadis 等（2014）', COL.blueL], ['對誰', '41 名青少年游泳選手', COL.greenL], ['做了什麼', '介入組接受自我對話訓練', COL.pinkL], ['發現什麼', '成績進步多於控制組', COL.mustard]];
    P.forEach(([a, b, c], i) => appear(prog(lt, i < 1 ? .6 : 5.8 + (i - 1) * 2.6, .5), () => { chip(380, 280 + i * 110, 220, 70, a, c, 1, 30); txt(b, 540, 288 + i * 110, 34, { color: COL.black, align: 'left' }); }));
    appear(prog(lt, 16.2, .5), () => chip(960, 760, 560, 66, '→ 放進文獻矩陣', COL.white, 1, 30));
  } };
  const s4 = { beats: [0, 2.6, 9.4], sub: '批判性閱讀三問', draw(lt) {
    head(lt, '批判性閱讀：三個問題', 600);
    ['樣本夠不夠？', '設計能回答因果嗎？', '效果量多大？'].forEach((s, i) => card(400 + i * 560, 360, 480, 160, '?', s, PAL[i], prog(lt, 2.8 + i * 1.8, .5), 56, 32));
    appear(prog(lt, 9.6, .6), () => { chip(700, 600, 380, 70, '作者的結論', COL.white, 1, 32); chip(1220, 600, 380, 70, '我的評語', COL.mustard, 1, 32); txt('分開寫', 960, 690, 30, { color: COL.red }); });
  } };
  const s5 = { beats: [0, 5, 8.6], sub: '讀全文、註明引自', draw(lt) {
    duo(lt);
    card(900, 300, 440, 140, '第一手全文', '不要只讀摘要', COL.greenL, prog(lt, .4, .5), 38);
    card(1460, 300, 440, 140, '二手文獻', '註明「引自」', COL.pinkL, prog(lt, 5.2, .5), 38);
    appear(prog(lt, 8.8, .5), () => chip(1180, 520, 820, 66, '課程網站：三篇文獻各寫一段摘要', COL.mustard, 1, 30));
  } };
  return mkEp([[s1, 21], [s2, 15], [s3, 21], [s4, 17], [s5, 15]], tagN(2, '一篇文獻怎麼讀、怎麼摘要？'), ['資料來源', 'Ioannidis, J. P. A. (2005). Why most published research findings are false. PLoS Medicine, 2(8), e124.', 'Hatzigeorgiadis 等（2014）自我對話介入研究（課程網站第三章論文評析）', '林彥光〈文獻探討敘寫〉講義']);
}
EPISODES['m2e2'] = M2E2();

function M2E3() {
  const grid = (lt, k0, hl) => {
    const H = ['作者年代', '對象', '設計', '介入', '工具', '結果'];
    const R = [['甲 2019', '大學選手', '實驗', '8 週', 'CR-10', '↓疲勞'], ['乙 2021', '高中生', '準實驗', '6 週', 'POMS', '無差異'], ['丙 2023', '大學選手', '相關', '—', 'CR-10', '↓疲勞']];
    const x0 = 270, cw = 230;
    H.forEach((h, j) => appear(prog(lt, k0 + j * .15, .3), () => { shape(rectPts(x0 + j * cw, 280, cw, 64), { fill: '#eee6d2', w: 2.5, smooth: false }); txt(h, x0 + j * cw + cw / 2, 322, 28, { color: COL.black }); }));
    R.forEach((r, i) => r.forEach((c, j) => appear(prog(lt, k0 + 1 + i * .5, .3), () => { shape(rectPts(x0 + j * cw, 344 + i * 64, cw, 64), { fill: hl === j ? '#fff1b8' : COL.white, w: 2.5, smooth: false }); txt(c, x0 + j * cw + cw / 2, 386 + i * 64, 28, { color: hl === j ? COL.red : COL.black }); })));
  };
  const s1 = { beats: [0, 7, 11.4], sub: '矩陣法', draw(lt) {
    ground(lt);
    txt('1999・葛拉德的矩陣法', 960, 150, 64, { p: prog(lt, .2, .9), color: COL.black }); underline(620, 1300, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    grid(lt, 1, -1);
    appear(prog(lt, 7.2, .5), () => { txt('列＝一篇文獻', 1680, 420, 30, { color: COL.blue, align: 'left' }); });
    appear(prog(lt, 7.8, .5), () => { txt('欄＝比較項目', 960, 252, 30, { color: COL.green }); });
    appear(prog(lt, 11.6, .5), () => chip(960, 650, 640, 70, '相同與不同，一眼看出', COL.mustard, 1, 34));
  } };
  const s2 = { beats: [0, 9.6, 13.4], sub: '欄位怎麼設', draw(lt) {
    head(lt, '欄位怎麼設？', 420);
    ['作者年代', '對象', '設計', '變項／介入', '測量工具', '主要結果', '限制'].forEach((s, i) => chip(260 + (i % 4) * 470, 300 + Math.floor(i / 4) * 100, 420, 72, s, PAL[i % 5], prog(lt, .6 + i * .6, .4), 32));
    appear(prog(lt, 9.8, .5), () => txt('每格只寫短句', 960, 520, 34, { color: COL.black }));
    appear(prog(lt, 13.6, .5), () => chip(960, 630, 700, 76, '＋ 和我的研究有什麼關係？', COL.mustard, 1, 34));
  } };
  const s3 = { beats: [0, 4, 12], sub: '直著讀', draw(lt) {
    head(lt, '直著讀，不要橫著讀', 600);
    grid(lt, .2, 5);
    appear(prog(lt, 4.2, .6), () => { arrow(1540, 250, 1540, 560, { w: 6, color: COL.red, head: 18 }); txt('同一欄往下看', 1540, 610, 32, { color: COL.red }); });
    appear(prog(lt, 12.2, .6), () => noteBox(960, 700, 1300, 100, [['不一致 → 對象？劑量？測量？（示意資料）', 34, COL.red]], '#fff8e2', 1));
  } };
  const s4 = { beats: [0, 4.4, 10.4], sub: '從矩陣到段落', draw(lt) {
    head(lt, '從矩陣到段落', 420);
    [['主題一：疲勞的測量', COL.blueL], ['主題二：訓練介入', COL.greenL], ['主題三：睡眠', COL.pinkL]].forEach(([s, c], i) => chip(500, 300 + i * 110, 600, 80, s, c, prog(lt, .6 + i * .6, .4), 32));
    appear(prog(lt, 4.6, .6), () => { noteBox(1360, 410, 760, 260, [['一段的寫法', 34, COL.black], ['大部分研究發現…', 30], ['但是…不一致', 30], ['可能原因是…', 30]], COL.white, 1); });
    appear(prog(lt, 10.6, .6), () => chip(960, 720, 760, 72, '空白最多的欄 ＝ 研究缺口', COL.mustard, 1, 34));
  } };
  const s5 = { beats: [0, 5.6, 8.8], sub: '矩陣不是成品', draw(lt) {
    duo(lt);
    noteBox(1200, 280, 900, 100, [['矩陣是工具，論文要的是評析', 36, COL.red]], '#fff8e2', prog(lt, .4, .5));
    appear(prog(lt, 5.8, .5), () => { chip(1200, 420, 560, 70, '課程網站 2.3：匯出 CSV', COL.greenL, 1, 30); });
    appear(prog(lt, 9, .5), () => chip(1200, 560, 640, 66, '至少填五篇文獻', COL.mustard, 1, 30));
  } };
  return mkEp([[s1, 17], [s2, 18], [s3, 18], [s4, 18], [s5, 14]], tagN(2, '文獻矩陣怎麼做？'), ['資料來源', 'Garrard, J. (1999). Health sciences literature review made easy: The matrix method.', '林彥光〈文獻探討敘寫〉講義']);
}
EPISODES['m2e3'] = M2E3();

function M2E5() {
  const cups = ['奶', '茶', '茶', '奶', '茶', '奶', '奶', '茶'];
  const s1 = { beats: [0, 6.6, 12.6, 17], sub: '品茶的女士', draw(lt) {
    ground(lt);
    txt('1935・費雪', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black }); underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .5), () => noteBox(960, 300, 900, 90, [['先倒奶，還是先倒茶？', 38]], COL.white, 1));
    cups.forEach((c, i) => appear(prog(lt, 6.8 + i * .2, .3), () => { const x = 360 + i * 170; shape(rectPts(x - 50, 450, 100, 100), { fill: c === '奶' ? '#efe0c4' : '#c9a273', w: 3, smooth: false }); shape(ellPts(x, 450, 50, 16, 0, i, 18), { fill: '#f3ead2', w: 3 }); if (lt > 9) txt('先' + c, x, 600, 28, { color: COL.gray }); }));
    appear(prog(lt, 12.8, .5), () => txt('先假設：她只是亂猜', 960, 680, 38, { color: COL.red }));
    appear(prog(lt, 17.2, .5), () => chip(960, 770, 460, 70, '虛無假設 H₀', COL.mustard, 1, 36));
  } };
  const s2 = { beats: [0, 3.6, 11.6], sub: '從文獻導出', draw(lt) {
    head(lt, '假設從文獻導出', 500);
    ['一般性考查', '有無理論架構', '綜合整理', '提出架構與假設'].forEach((s, i) => { const x = 280 + i * 450; appear(prog(lt, 3.8 + i * 1.6, .5), () => { chip(x, 320, 400, 80, s, PAL[i], 1, 32); if (i < 3) arrow(x + 205, 320, x + 245, 320, { w: 4, color: COL.red, head: 12 }); }); });
    appear(prog(lt, 11.8, .6), () => { card(620, 560, 560, 150, '文獻一致', '假設可以有方向', COL.greenL, 1, 38); card(1300, 560, 560, 150, '文獻不一致', '寫成有沒有差異', COL.pinkL, 1, 38); });
  } };
  const s3 = { beats: [0, 3.4, 8], sub: '研究假設與統計假設', draw(lt) {
    head(lt, '研究假設 vs 統計假設', 600);
    appear(prog(lt, .6, .5), () => { shape(roundRectPts(160, 260, 780, 360, 24), { fill: COL.blueL, w: 4, smooth: false }); txt('研究假設（有方向）', 550, 330, 40, { color: COL.black }); });
    appear(prog(lt, 3.6, .5), () => { txt('戰繩訓練組的下肢表現', 550, 430, 32, { color: COL.black }); txt('優於對照組', 550, 480, 32, { color: COL.red }); });
    appear(prog(lt, 8.2, .5), () => { shape(roundRectPts(980, 260, 780, 360, 24), { fill: COL.pinkL, w: 4, smooth: false }); txt('統計假設（通常無方向）', 1370, 330, 40, { color: COL.black }); txt('H₀：兩組表現沒有差異', 1370, 450, 34, { color: COL.black }); });
  } };
  const s4 = { beats: [0, 5, 9.4], sub: '對應與架構圖', draw(lt) {
    head(lt, '一個假設，對應一個方法', 640);
    ['研究問題', '研究假設', '統計方法'].forEach((s, i) => { const x = 460 + i * 500; appear(prog(lt, .6 + i * .8, .5), () => { chip(x, 300, 380, 80, s, PAL[i], 1, 34); if (i < 2) arrow(x + 195, 300, x + 305, 300, { w: 4, color: COL.red, head: 12 }); }); });
    appear(prog(lt, 5.2, .6), () => { chip(620, 520, 360, 90, '戰繩訓練', COL.greenL, 1, 34); arrow(810, 520, 1110, 520, { w: 6, color: COL.red, head: 18 }); chip(1300, 520, 360, 90, '下肢表現', COL.blueL, 1, 34); txt('＋', 960, 490, 40, { color: COL.red }); });
    appear(prog(lt, 9.6, .5), () => txt('每條箭頭都要有文獻撐腰', 960, 660, 34, { color: COL.red }));
  } };
  const s5 = { beats: [0, 3, 9.4], sub: '能被推翻', draw(lt) {
    duo(lt);
    noteBox(1200, 280, 860, 90, [['好的假設，要能被資料推翻', 36, COL.red]], '#fff8e2', prog(lt, .4, .5));
    ['文獻', '問題', '假設', '統計'].forEach((s, i) => appear(prog(lt, 3.2 + i * .5, .4), () => { chip(840 + i * 240, 430, 200, 66, s, PAL[i], 1, 30); if (i < 3) txt('↔', 960 + i * 240, 440, 30, { color: COL.gray }); }));
    appear(prog(lt, 9.6, .5), () => chip(1200, 570, 760, 66, '課程網站：從矩陣導出一條假設', COL.mustard, 1, 30));
  } };
  return mkEp([[s1, 22], [s2, 17], [s3, 15], [s4, 15], [s5, 15]], tagN(2, '假設怎麼從文獻導出？'), ['資料來源', 'Fisher, R. A. (1935). The design of experiments.', '林彥光〈研究方法與緒論〉講義（論文架構：第二章）']);
}
EPISODES['m2e5'] = M2E5();

function M4E1() {
  const ANS = [[[10, 8.04], [8, 6.95], [13, 7.58], [9, 8.81], [11, 8.33], [14, 9.96], [6, 7.24], [4, 4.26], [12, 10.84], [7, 4.82], [5, 5.68]], [[10, 9.14], [8, 8.14], [13, 8.74], [9, 8.77], [11, 9.26], [14, 8.10], [6, 6.13], [4, 3.10], [12, 9.13], [7, 7.26], [5, 4.74]], [[10, 7.46], [8, 6.77], [13, 12.74], [9, 7.11], [11, 7.81], [14, 8.84], [6, 6.08], [4, 5.39], [12, 8.15], [7, 6.42], [5, 5.73]], [[8, 6.58], [8, 5.76], [8, 7.71], [8, 8.84], [8, 8.47], [8, 7.04], [8, 5.25], [19, 12.50], [8, 5.56], [8, 7.91], [8, 6.89]]];
  const plot = (x0, y0, d, k) => appear(k, () => { ink([[x0, y0 - 200], [x0, y0], [x0 + 340, y0]], { w: 3 }); d.forEach(([x, y], i) => shape(ellPts(x0 + (x - 2) * 18, y0 - (y - 2) * 17, 7, 7, 0, i, 10), { fill: COL.blue, w: 2 })); ink([[x0, y0 - 2 * 17], [x0 + 340, y0 - 11.45 * 17]], { w: 3, color: COL.red }); });
  const s1 = { beats: [0, 3.4, 9, 15.4], sub: '安斯庫姆四重奏', draw(lt) {
    ground(lt);
    txt('1973・安斯庫姆', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black }); underline(700, 1220, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, 3.6, .5), () => noteBox(960, 280, 1200, 80, [['平均 7.5・相關 0.82・迴歸線 y = 3 + 0.5x（四組都一樣）', 32]], COL.white, 1));
    ANS.forEach((d, i) => plot(200 + i * 430, 640, d, prog(lt, 9.2 + i * .6, .5)));
    appear(prog(lt, 15.6, .5), () => chip(960, 760, 460, 70, '先畫圖，再算數字', COL.mustard, 1, 34));
  } };
  const s2 = { beats: [0, 3.4, 9.4], sub: '描述統計表', draw(lt) {
    head(lt, '第一張表：認識你的樣本', 620);
    appear(prog(lt, .6, .6), () => {
      const R = [['變項', '統計量'], ['年齡（歲）', 'M = 20.4, SD = 1.3'], ['訓練年資（年）', 'Mdn = 6, IQR = 4–8'], ['性別：女', '18 人（45.0%）']];
      ink([[460, 290], [1460, 290]], { w: 3 }); ink([[460, 360], [1460, 360]], { w: 2 }); ink([[460, 570], [1460, 570]], { w: 3 });
      R.forEach((r, i) => r.forEach((c, j) => txt(c, 700 + j * 520, 338 + i * 70, 32, { color: i === 0 ? COL.gray : COL.black })));
      txt('（示意）', 1460, 610, 24, { color: COL.gray });
    });
    appear(prog(lt, 3.6, .5), () => txt('連續：平均與標準差；偏態：中位數與四分位距', 960, 670, 30, { color: COL.blue }));
    appear(prog(lt, 9.6, .5), () => txt('百分比一定附原始人數', 960, 740, 32, { color: COL.red }));
  } };
  const s3 = { beats: [0, 2.6, 9], sub: '小數位數', draw(lt) {
    head(lt, '小數點寫到哪？', 460);
    appear(prog(lt, 2.8, .6), () => { txt('年齡 20.4167 歲', 640, 360, 44, { color: COL.gray }); ink([[480, 352], [800, 352]], { w: 5, color: COL.red }); txt('→  20.4 歲', 1140, 360, 44, { color: COL.green }); });
    appear(prog(lt, 4.6, .6), () => { txt('p = 1.573E-2', 640, 470, 44, { color: COL.gray }); ink([[500, 462], [780, 462]], { w: 5, color: COL.red }); txt('→  p = .016', 1140, 470, 44, { color: COL.green }); });
    appear(prog(lt, 9.2, .5), () => chip(960, 620, 560, 70, '同一張表，位數一致', COL.mustard, 1, 32));
  } };
  const s4 = { beats: [0, 2.4, 9.4], sub: 'APA 表格', draw(lt) {
    head(lt, '一張表，只回答一個問題', 640);
    appear(prog(lt, 2.6, .6), () => {
      txt('表 2', 560, 280, 30, { color: COL.black, align: 'left' }); txt('兩組訓練前後的疲勞分數', 560, 320, 30, { color: COL.black, align: 'left' });
      ink([[560, 350], [1360, 350]], { w: 3 }); ink([[560, 410], [1360, 410]], { w: 2 }); ink([[560, 530], [1360, 530]], { w: 3 });
      txt('註：分數越高越疲勞。', 560, 570, 26, { color: COL.gray, align: 'left' });
      txt('編號、標題在上', 1610, 300, 28, { color: COL.red }); txt('不畫直線格', 1610, 440, 28, { color: COL.red }); txt('註解在下', 1610, 570, 28, { color: COL.red });
    });
    appear(prog(lt, 9.6, .5), () => txt('圖要有軸標籤與單位；一句話講得完，就不要做圖表', 960, 680, 30, { color: COL.black }));
  } };
  const s5 = { beats: [0, 6, 10], sub: '文字與表分工', draw(lt) {
    duo(lt);
    card(900, 300, 440, 140, '表', '放數字', COL.blueL, prog(lt, .4, .5), 44);
    card(1460, 300, 440, 140, '文字', '講重點、指向表', COL.greenL, prog(lt, 1, .5), 44);
    appear(prog(lt, 6.2, .5), () => txt('先寫最重要的發現（見表 2）', 1180, 450, 34, { color: COL.red }));
    appear(prog(lt, 10.2, .5), () => chip(1180, 570, 820, 66, '課程網站：做第一張描述統計表', COL.mustard, 1, 30));
  } };
  return mkEp([[s1, 22], [s2, 16], [s3, 14], [s4, 16], [s5, 14]], tagN(4, '描述統計與圖表怎麼報？'), ['資料來源', 'Anscombe, F. J. (1973). Graphs in statistical analysis. The American Statistician, 27(1), 17–21.', '林彥光〈研究結果與討論敘寫〉講義；Streiner (2007)']);
}
EPISODES['m4e1'] = M4E1();

function M5E1() {
  const s1 = { beats: [0, 4.6, 9.4, 18.6], sub: '林格曼的拉繩實驗', draw(lt) {
    ground(lt);
    txt('1913・林格曼', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black }); underline(720, 1200, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { ink([[200, 560], [1000, 560]], { w: 6, color: '#9b7b4f' }); for (let i = 0; i < 6; i++) mini(260 + i * 130, 640, 1.2, PAL[i % 5], 'dots'); });
    appear(prog(lt, 4.8, .6), () => { [1, 2, 4, 8].forEach((n, i) => { const h = [200, 185, 160, 120][i]; shape(rectPts(1200 + i * 120, 600 - h, 84, h), { fill: COL.pinkL, w: 3, smooth: false }); txt(n + ' 人', 1242 + i * 120, 640, 26, { color: COL.black }); }); txt('平均每人出力（示意）', 1420, 360, 28, { color: COL.gray }); });
    appear(prog(lt, 9.6, .6), () => noteBox(600, 330, 760, 120, [['1974・英格漢：假同伴', 34], ['協調不好？還是動機下降？', 32, COL.red]], COL.white, 1));
    appear(prog(lt, 18.8, .5), () => chip(1420, 740, 400, 70, '社會惰化', COL.mustard, 1, 36));
  } };
  const s2 = { beats: [0, 4, 8], sub: '第一段回答問題', draw(lt) {
    head(lt, '討論第一段：回答研究問題', 680);
    appear(prog(lt, .6, .6), () => noteBox(960, 320, 1200, 110, [['本研究發現……（一段話回答研究問題）', 36]], COL.white, 1));
    appear(prog(lt, 4.2, .6), () => { txt('只有結果、沒有討論 ＝ 貧血的研究', 960, 460, 36, { color: COL.red }); });
    appear(prog(lt, 8.2, .6), () => { card(620, 620, 520, 130, '符合預期', '說明可能原因', COL.greenL, 1, 36); card(1300, 620, 520, 130, '不符預期', '更要說明原因', COL.pinkL, 1, 36); });
  } };
  const s3 = { beats: [0, 2.4, 7.6], sub: '兩種架構', draw(lt) {
    head(lt, '討論的兩種架構', 460);
    appear(prog(lt, 2.6, .6), () => { txt('結果彼此相關', 560, 270, 36, { color: COL.black }); ['結果一', '結果二', '結果三'].forEach((s, i) => chip(560, 350 + i * 80, 300, 60, s, COL.blueL, 1, 28)); chip(560, 610, 360, 70, '綜合討論', COL.mustard, 1, 32); });
    appear(prog(lt, 7.8, .6), () => { txt('結果彼此獨立', 1380, 270, 36, { color: COL.black }); ['結果一', '結果二', '結果三'].forEach((s, i) => { chip(1260, 350 + i * 100, 220, 60, s, COL.blueL, 1, 28); chip(1500, 350 + i * 100, 220, 60, '討論', COL.mustard, 1, 28); }); });
  } };
  const s4 = { beats: [0, 5, 8.8], sub: '意涵與範圍', draw(lt) {
    head(lt, '理論意涵與實務應用', 560);
    card(620, 360, 560, 200, '理論意涵', '支持・修正・挑戰', COL.blueL, prog(lt, .6, .5), 44, 32);
    card(1300, 360, 560, 200, '實務應用', '教練・選手・學校', COL.greenL, prog(lt, 5.2, .5), 44, 32);
    appear(prog(lt, 9, .6), () => chip(960, 600, 900, 76, '適用範圍：對象・情境・介入', COL.mustard, 1, 34));
  } };
  const s5 = { beats: [0, 7.2, 11.4], sub: '從數據到理論', draw(lt) {
    duo(lt);
    ['1913 拉繩數據', '1974 假同伴', '社會惰化理論'].forEach((s, i) => appear(prog(lt, .6 + i * 1.4, .5), () => { chip(840 + i * 340, 300, 300, 72, s, PAL[i], 1, 26); if (i < 2) arrow(995 + i * 340, 300, 1035 + i * 340, 300, { w: 4, color: COL.red, head: 10 }); }));
    appear(prog(lt, 7.4, .5), () => txt('新問題 → 留給未來研究', 1180, 430, 34, { color: COL.red }));
    appear(prog(lt, 11.6, .5), () => chip(1180, 560, 820, 66, '課程網站：寫主要發現與理論意涵', COL.mustard, 1, 30));
  } };
  return mkEp([[s1, 24], [s2, 15], [s3, 13], [s4, 15], [s5, 15]], tagN(5, '討論怎麼寫出主要發現與意涵？'), ['資料來源', 'Ringelmann effect（Wikipedia）', 'Ingham, A. G., et al. (1974). The Ringelmann effect. Journal of Experimental Social Psychology, 10, 371–384.', '林彥光〈研究結果與討論敘寫〉講義']);
}
EPISODES['m5e1'] = M5E1();

function M5E4() {
  const s1 = { beats: [0, 4.4, 11, 16.2], sub: '霍桑照明實驗', draw(lt) {
    ground(lt);
    txt('1920 年代・霍桑工廠', 960, 150, 64, { p: prog(lt, .2, .9), color: COL.black }); underline(640, 1280, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    appear(prog(lt, .8, .6), () => { for (let i = 0; i < 3; i++) { const x = 360 + i * 200, on = Math.sin(RLT * 2 + i) > 0; ink([[x, 240], [x, 300]], { w: 3 }); shape(roundRectPts(x - 32, 300, 64, 64, 30), { fill: on ? '#ffd84d' : '#bdbdbd', w: 3, smooth: false }); } for (let i = 0; i < 4; i++) mini(320 + i * 110, 620, 1.1, PAL[i], 'dots'); });
    appear(prog(lt, 4.6, .6), () => noteBox(1300, 330, 780, 120, [['流傳：燈亮燈暗產量都上升', 34], ['因為知道自己被研究？', 32, COL.red]], COL.white, 1));
    appear(prog(lt, 11.2, .6), () => noteBox(1300, 510, 780, 120, [['2011・李維特與李斯特', 34], ['找回原始資料重新分析', 32]], '#eef7ef', 1));
    appear(prog(lt, 16.4, .5), () => chip(1300, 680, 680, 70, '戲劇性的模式，資料裡找不到', COL.mustard, 1, 32));
  } };
  const s2 = { beats: [0, 3, 10.8], sub: '交代研究過程', draw(lt) {
    head(lt, '交代研究過程', 460);
    ['招募參與者', '進入場域', '蒐集資料', '確保品質'].forEach((s, i) => card(310 + i * 430, 360, 380, 140, String(i + 1), s, PAL[i], prog(lt, 3.2 + i * 1.6, .5), 44, 32));
    appear(prog(lt, 11, .6), () => noteBox(960, 590, 1100, 90, [['實際做的和計畫不同的地方，也要寫', 34, COL.red]], '#fff8e2', 1));
  } };
  const s3 = { beats: [0, 2.4, 10.4], sub: '限制的四種狀況', draw(lt) {
    head(lt, '限制的四種狀況', 460);
    const C = [['事先注意', '照計畫處理', COL.greenL], ['事先注意', '沒處理好', COL.mustard], ['事先沒注意', '臨場補救', COL.blueL], ['事先沒注意', '也沒處理', COL.pinkL]];
    C.forEach(([a, b, c], i) => card(560 + (i % 2) * 800, 330 + Math.floor(i / 2) * 200, 700, 160, ['①', '②', '③', '④'][i] + ' ' + a, b, c, prog(lt, (i < 2 ? 2.6 : 10.6) + (i % 2) * 2.4, .5), 38, 32));
  } };
  const s4 = { beats: [0, 4.8, 9.6], sub: '寫限制的規則', draw(lt) {
    head(lt, '寫限制的規則', 420);
    appear(prog(lt, .6, .5), () => { chip(620, 300, 420, 76, '研究範圍', COL.blueL, 1, 34); chip(1300, 300, 420, 76, '選擇的方法', COL.greenL, 1, 34); cross(830, 280, .45, 1); cross(1510, 280, .45, 1); txt('都不算限制', 960, 390, 32, { color: COL.red }); });
    appear(prog(lt, 5, .6), () => { chip(620, 520, 420, 80, '限制', COL.pinkL, 1, 36); arrow(840, 520, 1080, 520, { w: 5, color: COL.red, head: 16 }); chip(1300, 520, 420, 80, '影響怎麼解釋', '#eee6d2', 1, 32); });
    appear(prog(lt, 9.8, .5), () => { arrow(1300, 570, 1300, 630, { w: 5, color: COL.green, head: 14 }); chip(1300, 680, 420, 70, '未來研究方向', COL.mustard, 1, 32); });
  } };
  const s5 = { beats: [0, 8, 10.8], sub: '限制配方向', draw(lt) {
    duo(lt);
    appear(prog(lt, .4, .6), () => { chip(900, 300, 440, 76, '只用自評疲勞', COL.pinkL, 1, 32); arrow(1130, 300, 1240, 300, { w: 5, color: COL.red, head: 14 }); chip(1500, 300, 480, 76, '加入心跳變異度', COL.greenL, 1, 32); });
    appear(prog(lt, 8.2, .5), () => txt('誠實交代限制，研究更可信', 1200, 430, 36, { color: COL.red }));
    appear(prog(lt, 11, .5), () => chip(1200, 560, 820, 66, '課程網站：每個限制配一個方向', COL.mustard, 1, 30));
  } };
  return mkEp([[s1, 24], [s2, 16], [s3, 14], [s4, 14], [s5, 15]], tagN(5, '研究限制與未來研究怎麼寫？'), ['資料來源', 'Levitt, S. D., & List, J. A. (2011). Was there really a Hawthorne effect at the Hawthorne plant? AEJ: Applied Economics, 3(1), 224–238.', '林彥光〈研究結果與討論敘寫〉講義']);
}
EPISODES['m5e4'] = M5E4();
