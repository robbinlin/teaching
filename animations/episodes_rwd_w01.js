// 真實世界運動大數據分析：第 1 週 EP1　同一句話，十六個答案
const RW01 = {
  N: 37822, noAns: 3953, neg1: 980,
  // facts.json decision_grid。鍵 = 定義(0 天數＋流汗會喘 / 1 只看天數)、−1(0 留著 / 1 轉遺漏)、分母(0 全體 / 1 完整作答)、加權(0 無 / 1 有)；值 = [分析人數, 規律運動比例 %]
  G: {
    '0000': [37822, 51.3], '0001': [37248, 51.4], '0010': [33869, 57.2], '0011': [33710, 56.9],
    '0100': [37822, 51.3], '0101': [37248, 51.4], '0110': [33499, 57.9], '0111': [33353, 57.5],
    '1000': [37822, 81.0], '1001': [37248, 81.9], '1010': [37822, 81.0], '1011': [37248, 81.9],
    '1100': [37822, 81.0], '1101': [37248, 81.9], '1110': [36842, 83.2], '1111': [36660, 83.2],
  },
  D: [['規律運動的定義', '天數＋流汗會喘', '只看運動天數'], ['天數題的 −1', '留著當數值', '轉成遺漏'], ['分母', '全體受訪者', '完整作答者'], ['加權', '不加權', '用權重變項']],
};

const RW01E1 = (() => {
  const LX = v => 200 + (v - 45) / 45 * 1520, LY = 620, SX = i => 270 + i * 460;
  const dot = (x, y, r, fill, w = 3.5) => shape(ellPts(x, y, r, r, 0, Math.PI * 2, 16), { fill, w });
  // 依時間套用切換步驟 [時間, 第幾個決定, 新值]，回傳開關位置與落點
  function state(lt, init, steps) {
    let sel = init.slice(), knob = init.slice(), from = RW01.G[sel.join('')], to = from, kk = 1, pos = from[1];
    const ghosts = [];
    steps.forEach(([t, i, v]) => {
      const k = ease(prog(lt, t, 1.3)); if (k <= 0) return;
      const prev = RW01.G[sel.join('')]; sel = sel.slice(); sel[i] = v; const nx = RW01.G[sel.join('')];
      knob[i] = lerp(1 - v, v, k); pos = lerp(prev[1], nx[1], k); from = prev; to = nx; kk = k;
      if (prev[1] !== nx[1] && !ghosts.includes(prev[1])) ghosts.push(prev[1]);
    });
    return { knob, pos, from, to, kk, ghosts };
  }
  // 一個決定的開關。mode：0 還沒談到（淡）、1 一般、2 正在談（紅框）；knob < 0 不標示選項
  function sw(i, knob, mode) {
    appear(mode === 0 ? .32 : 1, () => {
      const x = SX(i), d = RW01.D[i], hot = mode === 2;
      txt(d[0], x, 210, 32, { color: hot ? COL.red : COL.black });
      shape(roundRectPts(x - 208, 248, 416, 74, 22), { fill: COL.white, w: hot ? 5.5 : 3.5, color: hot ? COL.red : INK, smooth: false });
      if (knob >= 0) shape(roundRectPts(x - 202 + knob * 202, 255, 202, 60, 18), { fill: COL.mustard, w: 3, smooth: false });
      txt(d[1], x - 101, 286, 26, { color: COL.black, jit: .5 }); txt(d[2], x + 101, 286, 26, { color: COL.black, jit: .5 });
    });
  }
  function numLine(k) {
    appear(k, () => {
      inkLine(170, LY, 1750, LY, { w: 5 });
      for (let v = 45; v <= 90; v += 5) { inkLine(LX(v), LY - 12, LX(v), LY + 12, { w: 3.5 }); txt(v + '%', LX(v), LY + 46, 28, { color: COL.gray, jit: .4 }); }
      txt('規律運動比例', 1750, LY + 84, 26, { color: COL.gray, align: 'right' });
    });
  }
  function marker(st, k) {
    appear(k, () => {
      const x = LX(st.pos);
      st.ghosts.forEach(v => inkEll(LX(v), LY, 11, 11, { w: 3, color: COL.gray }));
      inkLine(x, LY - 92, x, LY - 20, { w: 4, color: COL.mustardD }); dot(x, LY, 17, COL.mustard);
      const a = st.kk < .5 ? 1 - st.kk * 2 : st.kk * 2 - 1, g = st.kk < .5 ? st.from : st.to;
      appear(a, () => { txt(g[1].toFixed(1) + '%', x, LY - 150, 88, { color: COL.red }); txt('分析人數 ' + fmtN(g[0]) + ' 人', x, LY - 222, 28, { color: COL.gray }); });
    });
  }
  // 55%–60% 的放大尺：57.2、57.9、57.5 在主數線上只差幾十個像素
  function zoom(st, k) {
    appear(k, () => {
      const ZX = v => 1100 + (v - 55) / 5 * 660, ZY = 800, inR = v => v > 55 && v < 60;
      shape(roundRectPts(1060, 730, 740, 128, 18), { fill: '#fffdf6', w: 3, smooth: false });
      txt('放大　55%–60%', 1082, 754, 24, { color: COL.gray, align: 'left' });
      inkLine(1090, ZY, 1770, ZY, { w: 4 });
      for (let v = 55; v <= 60; v++) { inkLine(ZX(v), ZY - 9, ZX(v), ZY + 9, { w: 3 }); txt(v + '%', ZX(v), ZY + 32, 22, { color: COL.gray, jit: .4 }); }
      st.ghosts.filter(inR).forEach(v => { inkEll(ZX(v), ZY, 9, 9, { w: 3, color: COL.gray }); txt(v.toFixed(1), ZX(v), ZY - 28, 22, { color: COL.gray, jit: .4 }); });
      if (inR(st.pos)) dot(ZX(st.pos), ZY, 13, COL.mustard, 3);
    });
  }
  // 十六個落點：同一個位置往上疊
  const DOTS = (() => {
    const placed = [];
    return Object.values(RW01.G).map(g => g[1]).sort((a, b) => a - b).map(v => {
      const x = LX(v); let lv = 0;
      while (placed.some(p => p[1] === lv && Math.abs(p[0] - x) < 27)) lv++;
      placed.push([x, lv]); return [x, LY - 26 - lv * 29, v];
    });
  })();
  const laptop = (x, k, done) => appear(k, () => {
    inkLine(x - 30, 768, x + 190, 768, { w: 5 }); inkLine(x - 10, 768, x - 10, GY, { w: 4 }); inkLine(x + 170, 768, x + 170, GY, { w: 4 });
    shape(rectPts(x, 640, 160, 112), { fill: COL.white, w: 4, smooth: false }); inkLine(x - 14, 760, x + 174, 760, { w: 6 });
    [.5, .85, .65, .75].forEach((h, i) => { const kk = clamp(done * 4 - i); if (kk > 0) bar(x + 32 + i * 32, 742, 20, h * 80 * kk, COL.blueL); });
  });

  // 1 課堂情境：全班把同一句話交給 AI
  const s1 = { beats: [0, 7.7, 13.5], draw(lt) {
    ground(lt, 140, 1780);
    txt('第 1 週｜第一堂課', 150, 150, 40, { p: prog(lt, .3, .8), color: COL.gray, align: 'left' });
    stick(300, GY, 1.15, { glasses: true, la: Math.PI * .75, ra: lt > 3 ? [-Math.PI * .28, -Math.PI * .38] : Math.PI * .3, bob: idle(RLT) * .4 });
    const diff = lt > 20.3;
    appear(prog(lt, 1.2, .7), () => stick(1040, GY, 1.0, { hair: 'pony', mouth: diff ? 'o' : 'smile', ra: Math.PI * .12, la: Math.PI * .7, bob: idle(RLT, 1) * .3 }));
    appear(prog(lt, 1.7, .7), () => stick(1470, GY, 1.0, { hair: 'tuft', mouth: lt > 22.3 ? 'o' : 'smile', ra: Math.PI * .12, la: Math.PI * .7, bob: idle(RLT, 2) * .3 }));
    const done = prog(lt, 14, 2.4);
    laptop(1150, prog(lt, 1.4, .7), done); laptop(1580, prog(lt, 1.9, .7), done);
    appear(prog(lt, 16.6, .5), () => { check(1290, 668, .45, 1); check(1720, 668, .45, 1); });
    noteBox(760, 330, 420, 100, [['同一句話', 52, COL.black]], '#fff8e2', prog(lt, 3.6, .6) * (1 - prog(lt, 7.6, .4)));
    bubble(760, 330, 1040, 116, 400, 520, '都市化程度和學生規律運動有沒有關係？', 46, prog(lt, 7.9, .7));
    const ka = prog(lt, 10.6, .9) * (1 - prog(lt, 18.8, .6));
    appear(clamp(ka * 3), () => { arrow(1090, 400, 1215, 622, { w: 4, head: 16, color: COL.blue, p: ka }); arrow(1250, 400, 1650, 622, { w: 4, head: 16, color: COL.blue, p: ka }); });
    bubble(1040, 505, 240, 92, 1040, 596, '51.3%', 52, prog(lt, 20.3, .5));
    bubble(1470, 505, 240, 92, 1470, 584, '81.0%', 52, prog(lt, 22.3, .5));
  } };

  // 2 同一份資料，沒有錯誤訊息；模型替你做了決定
  const s2 = { beats: [0, 7.5, 11.6], draw(lt) {
    txt('同一份資料　37,822 位學生', 960, 150, 54, { p: prog(lt, .3, 1), color: COL.black });
    [[330, '報告 A', '51.3%', 'pony'], [1590, '報告 B', '81.0%', 'tuft']].forEach(([x, name, v, hair], i) => {
      appear(prog(lt, .9 + i * .4, .7), () => { paperSheet(x, 470, 400, 340, i ? .02 : -.02); txt(name, x, 345, 34, { color: COL.gray }); txt(v, x, 445, 88, { color: COL.red }); });
      appear(prog(lt, 4.6 + i * .5, .5), () => { check(x - 120, 568, .5, 1); txt('0 個錯誤訊息', x + 30, 568, 32, { color: COL.green }); });
      stick(x, GY, .6, { hair, mouth: lt > 7.5 ? 'o' : 'smile', la: [-Math.PI * .75, -Math.PI * .6], ra: [-Math.PI * .25, -Math.PI * .4], bob: idle(RLT, i) * .3 });
    });
    appear(prog(lt, 1.8, .6) * (1 - prog(lt, 7.3, .4)), () => {
      noteBox(960, 470, 320, 150, [['同一份資料', 38, COL.black], ['同一句話', 38, COL.black]], '#fff8e2', 1);
      arrow(790, 470, 550, 470, { w: 4, head: 16, color: COL.blue, p: prog(lt, 2.4, .6) }); arrow(1130, 470, 1370, 470, { w: 4, head: 16, color: COL.blue, p: prog(lt, 2.4, .6) });
    });
    txt('模型沒有問你，就替你做了決定', 960, 245, 40, { p: prog(lt, 7.7, .9), color: COL.red });
    RW01.D.forEach((d, i) => {
      const y = 345 + i * 112, open = prog(lt, 12 + i * .85, .5);
      appear(prog(lt, 8.3 + i * .45, .5), () => {
        shape(roundRectPts(710, y - 46, 500, 92, 20), { fill: open > .5 ? '#fff8e2' : COL.white, w: 4, smooth: false });
        appear(1 - open, () => txt('？', 960, y, 56, { color: COL.gray }));
        appear(open, () => txt('決定 ' + (i + 1) + '　' + d[0], 960, y, 34, { color: COL.black }));
      });
    });
  } };

  // 3 決定一：定義。51.3% → 81.0%
  const s3 = { beats: [0, 9.6, 14.2], draw(lt) {
    txt('決定一　規律運動怎麼定義', 80, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const st = state(lt, [0, 0, 0, 0], [[10.3, 0, 1]]);
    appear(prog(lt, 1, .7), () => RW01.D.forEach((d, i) => sw(i, st.knob[i], i === 0 ? 2 : 0)));
    numLine(prog(lt, 4.2, .8)); marker(st, prog(lt, 6.6, .6));
    appear(prog(lt, 14.5, .7), () => {
      txt('51.3%', LX(51.3), LY - 62, 40, { color: COL.gray });
      arrow(940, LY - 62, 500, LY - 62, { w: 4, head: 16 }); arrow(960, LY - 62, 1385, LY - 62, { w: 4, head: 16 });
      txt('差 29.7 個百分點', 950, LY - 112, 44, { color: COL.black });
    });
    stick(105, GY, .62, { hair: 'pony', mouth: lt > 11 ? 'o' : 'smile', ra: lt > 11 ? [-Math.PI * .3, -Math.PI * .45] : Math.PI * .3, bob: idle(RLT) * .3 });
    noteBox(960, 800, 900, 90, [['同一群學生，只換了一個定義', 40, COL.black]], '#fff8e2', prog(lt, 15.6, .6));
  } };

  // 4 決定二、三：分母與 −1。51.3% → 57.2% → 57.9%
  const s4 = { beats: [0, 8.6, 18.4], draw(lt) {
    txt('決定二、三　分母，以及天數題的 −1', 80, 130, 48, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const st = state(lt, [1, 0, 0, 0], [[.6, 0, 0], [14.4, 2, 1], [26.4, 1, 1]]);
    const hot = lt < 2.6 ? 0 : lt < 18.5 ? 2 : 1;
    RW01.D.forEach((d, i) => sw(i, st.knob[i], i === hot ? 2 : i === 3 || (i === 1 && lt < 18.5) ? 0 : 1));
    numLine(1); marker(st, 1);
    const kB = prog(lt, 18.6, .6);
    appear(prog(lt, 4.4, .6) * (1 - kB), () => noteBox(620, 786, 700, 144, [[fmtN(RW01.noAns) + ' 人沒有回答運動強度', 36, COL.red], lt < 14.4 ? ['算進分母 → 當成不規律運動', 32, COL.black] : ['不算進分母 → 剩 33,869 人', 32, COL.green]], '#fff8e2', 1));
    appear(prog(lt, 20, .6), () => noteBox(620, 786, 700, 144, [['運動天數題：' + RW01.neg1 + ' 人的編碼是 −1', 36, COL.red], lt < 26.4 ? ['留著 → 當成一般數值來算', 32, COL.black] : ['轉成遺漏再排除 → 剩 33,499 人', 32, COL.green]], '#fff8e2', 1));
    zoom(st, prog(lt, 15.4, .7));
    stick(120, GY, .62, { hair: 'tuft', mouth: 'flat', ra: Math.PI * .3, la: Math.PI * .7, bob: idle(RLT) * .3 });
  } };

  // 5 決定四：加權；十六個答案排在同一條線上
  const s5 = { beats: [0, 6.7, 14.4], draw(lt) {
    const kAll = prog(lt, 6.9, .8);
    txt(lt < 6.8 ? '決定四　要不要加權' : '四個決定，16 種做法', 80, 130, 48, { p: lt < 6.8 ? prog(lt, .2, .8) : prog(lt, 6.8, .8), color: COL.black, align: 'left' });
    const st = state(lt, [0, 1, 1, 0], [[3.3, 3, 1]]);
    RW01.D.forEach((d, i) => sw(i, kAll > .5 ? -1 : st.knob[i], kAll > 0 ? 1 : i === 3 ? 2 : 1));
    numLine(1); marker(st, 1 - kAll); zoom(st, 1 - kAll);
    appear(kAll * (1 - prog(lt, 14.2, .5)), () => txt('2 × 2 × 2 × 2 ＝ 16 種做法', 960, 420, 60, { color: COL.black }));
    DOTS.forEach(([x, y, v], i) => { const k = prog(lt, 9.6 + i * .22, .35); if (k > 0) appear(k, () => dot(x, lerp(y - 40, y, easeOut(k)), 12, v > 70 ? COL.pinkL : COL.blueL, 3)); });
    appear(prog(lt, 13.4, .6), () => { txt('天數＋流汗會喘', LX(54.6), 745, 30, { color: COL.blue }); txt('只看運動天數', LX(82), 745, 30, { color: COL.pink }); });
    appear(prog(lt, 14.7, .6), () => txt('最低 51.3%', LX(51.3), 462, 42, { color: COL.blue }));
    appear(prog(lt, 17.8, .6), () => txt('最高 83.2%', LX(83.2), 462, 42, { color: COL.red }));
    const kd = prog(lt, 20.4, .9);
    if (kd > 0) { ink([[LX(51.3), 426], [LX(51.3), 406], [LX(83.2), 406], [LX(83.2), 426]], { w: 5, p: kd }); txt('相差 31.9 個百分點', 951, 364, 52, { color: COL.black, p: kd }); }
    appear(prog(lt, 23.2, .6), () => { noteBox(960, 812, 820, 84, [['每一種做法，程式都跑得出來', 40, COL.black]], '#fff8e2', 1); check(600, 812, .6, clamp((lt - 23.6) / .5)); });
    stick(120, GY, .62, { hair: 'pony', mouth: kAll > 0 ? 'o' : 'smile', ra: Math.PI * .3, la: Math.PI * .7, bob: idle(RLT) * .3 });
  } };

  // 6 留給人的三件事
  const s6 = { beats: [0, 4.4, 8.9, 14.6], draw(lt) {
    txt('留給人的三件事', 960, 140, 60, { p: prog(lt, 2.2, .9), color: COL.black });
    appear(prog(lt, .3, .6), () => { txt('程式由誰寫', 880, 218, 36, { color: COL.gray }); txt('已經不重要', 1090, 218, 36, { color: COL.gray }); inkLine(780, 220, 980, 216, { w: 4, color: COL.gray, p: prog(lt, 1.2, .5) }); });
    const C = [[420, '規格', '分析之前', '把決定寫下來', COL.blue, 4.6], [960, '判斷', '這份橫斷面調查', '能不能回答問題', COL.red, 9.1], [1500, '驗證', '程式做的事', '＝ 你以為它做的事', COL.green, 14.8]];
    C.forEach(([x, t, a, b, col, at], i) => { const k = prog(lt, at, .8); appear(k, () => {
      shape(roundRectPts(x - 230, 270, 460, 400, 24), { fill: '#fffdf6', w: 4 });
      txt(String(i + 1), x - 150, 345, 64, { color: col }); txt(t, x + 30, 345, 60, { color: col });
      txt(a, x, 470, 34, { color: COL.black }); txt(b, x, 530, 34, { color: COL.black });
      check(x, 615, .7, clamp((lt - at - .8) / .5));
    }); });
    stick(960, GY + 30, .7, { hair: 'tuft', la: waveArm(RLT + 1), ra: Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 7 結語：十八週都落在這三件事上；交給 AI 之前先寫下決定
  const s7 = { beats: [0, 4.1], draw(lt) {
    ground(lt, 140, 1780);
    txt('這學期的每一週', 960, 150, 40, { p: prog(lt, .3, .7), color: COL.gray });
    const W = [[1, 3, '規格', COL.blueL, COL.blue], [4, 6, '驗證', COL.greenL, COL.green], [7, 15, '判斷', COL.pinkL, COL.red], [16, 18, '報告', COL.white, COL.gray]];
    const BX = w => 420 + (w - 1) * 60;
    W.forEach(([a, b, name, fill, col], gi) => {
      for (let w = a; w <= b; w++) appear(prog(lt, .6 + w * .12, .4), () => { shape(rectPts(BX(w), 205, 52, 52), { fill, w: 3, smooth: false }); txt(String(w), BX(w) + 26, 232, 24, { color: COL.black, jit: .4 }); });
      txt(name, (BX(a) + BX(b) + 52) / 2, 295, 36, { color: col, p: prog(lt, 1.6 + gi * .5, .5) });
    });
    txt('交給 AI 之前，先寫下你的決定', 1180, 440, 68, { p: prog(lt, 4.4, 1.2), color: COL.black });
    underline(730, 1630, 492, { p: prog(lt, 5.8, .6), color: COL.mustardD });
    appear(prog(lt, 6.6, .7), () => RW01.D.forEach((d, i) => { txt(d[0], 900 + (i % 2) * 420, 560 + Math.floor(i / 2) * 62, 34, { color: COL.gray, align: 'left' }); check(870 + (i % 2) * 420, 560 + Math.floor(i / 2) * 62, .4, clamp((lt - 7.2 - i * .3) / .4)); }));
    stick(300, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(500, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(680, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 25], [s2, 18], [s3, 20], [s4, 31], [s5, 26], [s6, 21], [s7, 14]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 1 週　同一句話，十六個答案', scenes,
    sources: ['資料來源', '108 學年度學生運動參與情形調查（SRDA 釋出），課程衍生檔重算，n = 37,822', '四個決定、16 種做法的比例與分析人數，皆由同一份衍生檔逐一重算', '林彥光老師講義〈第 1 週 課程介紹：AI 會寫程式之後，分析者做什麼〉'] };
})();
EPISODES['rw01e1'] = RW01E1;
