// 真實世界運動大數據分析：第 11 週 EP1　好得不像真的：資料洩漏
const RW11 = {
  // w11.json 概念 2 的工具預設值（模擬資料：200 人、200 個亂數特徵）：三種做法的 AUC
  auc: [['先挑特徵，再交叉驗證', 0.79, COL.red, '#f6c9c4'], ['每一折內才挑特徵', 0.58, COL.green, COL.greenL], ['同一個模型用在全新的模擬資料', 0.52, COL.gray, '#e4e0d6']],
  // 講義 W11 第 1 節：寫模型之前的四個問題
  q: ['預測什麼？', '在什麼時間點預測？那時已經知道哪些資訊？', '預測出來之後要做什麼？', '哪一種錯誤比較嚴重？'],
  // 講義 W11 第 2 節：三份資料
  sets: [['訓練集', '', COL.blueL, COL.blue, 200, 840, ['配適模型'], []], ['驗證集', '（或交叉驗證）', '#f6e3a8', COL.mustardD, 1070, 310, ['選模型、調參數'], ['可以重複使用']], ['測試集', '', COL.pinkL, COL.red, 1410, 310, ['報告最終表現'], ['只用一次', '最後才打開']]],
  feats: ['年級', '性別', '學校所在縣市'],
};

const RW11E1 = (() => {
  const dash = (x0, y0, x1, y1, o) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.floor(L / 26); for (let i = 0; i < n; i++) { const a = i * 26 / L, b = Math.min(1, (i * 26 + 14) / L); inkLine(lerp(x0, x1, a), lerp(y0, y1, a), lerp(x0, x1, b), lerp(y0, y1, b), { w: 3, ...o }); } };
  const lines = (arr, x, y, size, color, gap = 50) => arr.forEach((s, i) => txt(s, x, y + i * gap, size, { color }));

  // 1 課堂情境：AI 交出一個近乎完美的模型
  const s1 = { beats: [0, 5.46, 11.51], draw(lt) {
    ground(lt, 140, 1780);
    txt('「建一個模型，預測哪些學生不規律運動」', 960, 150, 52, { p: prog(lt, .4, 1.6), color: COL.black });
    stick(400, GY, 1.0, { hair: 'tuft', la: Math.PI * .1, ra: Math.PI * .05, mouth: lt > 8.5 && lt < 11.5 ? 'smile' : 'flat', bob: idle(RLT) * .3 });
    appear(prog(lt, 1, .6), () => { shape(rectPts(580, 440, 500, 320), { fill: COL.white, w: 4, smooth: false }); shape([[540, 760], [1120, 760], [1160, 800], [500, 800]], { fill: COL.blueL, w: 4, smooth: false }); });
    // 螢幕裡的 ROC 曲線
    const ka = prog(lt, 5.6, .6);
    if (ka > 0) {
      inkLine(640, 730, 880, 730, { w: 3, p: ka }); inkLine(640, 730, 640, 480, { w: 3, p: ka });
      appear(ka, () => { dash(640, 730, 880, 480, { color: COL.gray, alpha: .6 }); txt('隨機森林', 975, 500, 30, { color: COL.black }); });
      ink([[640, 730], [643, 590], [652, 510], [690, 488], [880, 480]], { w: 5, color: COL.red, p: prog(lt, 6.4, 1.4) });
    }
    appear(prog(lt, 8.2, .5), () => { txt('AUC', 975, 580, 30, { color: COL.gray }); txt('0.98', 975, 645, 64, { color: COL.red }); });
    appear(prog(lt, 9.4, .5), () => txt('區辨力接近完美', 830, 400, 34, { color: COL.red }));
    appear(prog(lt, 11.5, .6), () => stick(1520, GY, 1.2, { glasses: true, la: Math.PI * .8, ra: [Math.PI * 1.1, Math.PI * 1.25], mouth: 'flat' }));
    bubble(1470, 360, 660, 100, 1500, 470, '好得不像真的，先懷疑洩漏', 42, prog(lt, 12.0, .6));
  } };

  // 2 寫模型之前的四個問題
  const s2 = { beats: [0, 9.65, 15.86], draw(lt) {
    txt('寫模型之前，先回答四個問題', 960, 135, 60, { p: prog(lt, .3, 1), color: COL.black });
    const Y = i => 285 + i * 150, AT = [3.0, 5.0, 9.8, 12.6];
    RW11.q.forEach((q, i) => appear(prog(lt, AT[i], .6), () => {
      const hot = lt > 15.9 && (i === 1 && lt < 19.4 || i === 3 && lt >= 19.4);
      shape(ellPts(190, Y(i), 38, 38, 0, Math.PI * 2, 24), { fill: hot ? '#fff1c2' : COL.white, w: 4 });
      txt(String(i + 1), 190, Y(i), 44, { color: COL.black });
      txt(q, 260, Y(i), 40, { align: 'left', color: COL.black });
    }));
    appear(prog(lt, 3.6, .5), () => txt('不規律運動：是或否', 264, Y(0) + 54, 30, { align: 'left', color: COL.gray }));
    appear(prog(lt, 10.6, .5), () => txt('例如：優先邀請參加體育活動', 264, Y(2) + 54, 30, { align: 'left', color: COL.gray }));
    appear(prog(lt, 13.4, .5), () => txt('漏掉需要協助的學生，或多邀請不需要的學生', 264, Y(3) + 54, 30, { align: 'left', color: COL.gray }));
    const k2 = prog(lt, 16.0, .7), k4 = prog(lt, 19.5, .7);
    if (k2 > 0) arrow(1120, Y(1), 1230, Y(1), { w: 5, head: 16, color: COL.blue, p: k2 });
    appear(prog(lt, 16.5, .6), () => txt('決定哪些變項可以當特徵', 1260, Y(1), 40, { align: 'left', color: COL.blue }));
    if (k4 > 0) arrow(700, Y(3), 1230, Y(3), { w: 5, head: 16, color: COL.green, p: k4 });
    appear(prog(lt, 20.0, .6), () => txt('決定門檻怎麼設', 1260, Y(3), 40, { align: 'left', color: COL.green }));
    stick(1680, GY, .8, { glasses: true, la: [Math.PI * 1.05, Math.PI * 1.2], ra: Math.PI * .35, bob: idle(RLT) * .3 });
  } };

  // 3 三份資料
  const s3 = { beats: [0, 4.93, 10.66], draw(lt) {
    txt('資料切成三份', 960, 135, 60, { p: prog(lt, .3, 1), color: COL.black });
    const gap = ease(prog(lt, 1.2, 1)), AT = [2.2, 5.0, 10.7], Y = 240, HH = 120;
    RW11.sets.forEach(([name, sub, fill, col, x, w, use, rule], i) => {
      const xx = x - (i * 30) * (1 - gap), on = lt >= AT[i];
      appear(prog(lt, .6, .6), () => shape(rectPts(xx, Y, w + (i < 2 ? 30 * (1 - gap) : 0), HH), { fill: on ? fill : COL.white, w: 4, smooth: false }));
      appear(prog(lt, AT[i], .5), () => {
        txt(name, x + w / 2, sub ? Y + 44 : Y + HH / 2, 44, { color: COL.black });
        if (sub) txt(sub, x + w / 2, Y + 92, 26, { color: COL.gray });
      });
      appear(prog(lt, AT[i] + (i === 0 ? 1.0 : 1.6), .6), () => lines(use, x + w / 2, 430, 38, COL.black));
      appear(prog(lt, AT[i] + (i === 1 ? 3.4 : 2.8), .6), () => lines(rule, x + w / 2, 495, 38, col));
    });
    // 訓練集：一條配適線
    const kf = prog(lt, 3.2, 1.2);
    appear(prog(lt, 3.0, .5), () => { for (let i = 0; i < 14; i++) { const u = i / 13; inkEll(440 + u * 360, 700 - u * 130 + (rnd(i * 5 + 2) - .5) * 70, 6, 6, { w: 3, color: COL.blue }); } });
    if (kf > 0) inkLine(430, 708, 810, 562, { w: 5, color: COL.blue, p: kf });
    // 驗證集：重複使用的箭頭
    const kr = prog(lt, 8.4, 1);
    if (kr > 0) { ink(ellPts(1225, 650, 62, 62, -Math.PI * .5, Math.PI * 1.2, 24), { w: 5, color: COL.mustardD, p: kr }); appear(clamp(kr * 2 - 1), () => { ink([[1150, 690], [1175, 688], [1168, 664]], { w: 5, color: COL.mustardD }); txt('多次', 1225, 650, 32, { color: COL.mustardD }); }); }
    // 測試集：上鎖，只開一次
    appear(prog(lt, 13.4, .6), () => {
      ink(ellPts(1565, 648, 34, 40, Math.PI, Math.PI * 2, 14), { w: 6, color: COL.red });
      shape(roundRectPts(1505, 648, 120, 92, 12), { fill: COL.pinkL, w: 4, color: COL.red });
      txt('1 次', 1565, 695, 36, { color: COL.red });
    });
    stick(180, GY, .8, { hair: 'pony', ra: [-Math.PI * .15, -Math.PI * .1], bob: idle(RLT) * .3 });
  } };

  // 4 資料洩漏：定義、Kapoor & Narayanan（2023）、第一種
  const s4 = { beats: [0, 9.49, 17.26, 26.81], draw(lt) {
    txt('資料洩漏', 120, 135, 58, { p: prog(lt, .2, .8), color: COL.black, align: 'left' });
    const A = 1 - prog(lt, 16.8, .45);
    if (A > 0) {
      noteBox(530, 300, 800, 160, [['模型在訓練時，用到了', 42, COL.black], ['預測當下不該知道的資訊', 42, COL.red]], '#fff8e2', prog(lt, 1.0, .7) * A);
      const BASE = 790, k1 = ease(prog(lt, 5.4, 1)), k2 = ease(prog(lt, 7.2, 1));
      appear(prog(lt, 5.2, .5) * A, () => {
        axis(230, 890, BASE, { p: 1 });
        bar(400, BASE, 170, 300 * k1, '#f6c9c4'); bar(720, BASE, 170, 300 * k1 - 170 * k2, '#e4e0d6');
        txt('測試表現', 400, BASE + 42, 36, { color: COL.black }); txt('實際使用', 720, BASE + 42, 36, { color: COL.black });
        txt('（示意）', 560, BASE + 42, 26, { color: COL.gray });
      });
      appear(prog(lt, 6.2, .5) * A, () => txt('虛高', 400, BASE - 340, 44, { color: COL.red }));
      appear(prog(lt, 8.0, .5) * A, () => txt('失效', 720, BASE - 170, 44, { color: COL.red }));
      appear(prog(lt, 9.6, .7) * A, () => {
        paperSheet(1430, 500, 740, 460, .015);
        txt('Kapoor 與 Narayanan（2023）', 1430, 345, 40, { color: COL.black });
        txt('Patterns, 4(9), 100804', 1430, 400, 28, { color: COL.gray });
      });
      appear(prog(lt, 12.6, .6) * A, () => txt('17 個領域', 1430, 505, 92, { color: COL.red }));
      appear(prog(lt, 14.2, .6) * A, () => { txt('近三百篇', 1430, 610, 60, { color: COL.black }); txt('受洩漏影響的論文', 1430, 672, 36, { color: COL.gray }); });
    }
    // 第一種：特徵包含結果的成分
    const B = prog(lt, 17.3, .6);
    if (B > 0) {
      appear(B, () => txt('第一種　特徵包含結果的成分', 120, 225, 46, { align: 'left', color: COL.red }));
      // 結果的定義
      appear(prog(lt, 20.6, .7), () => {
        shape(roundRectPts(980, 290, 840, 290, 24), { fill: '#fffdf6', w: 4 });
        txt('結果：規律運動的定義', 1400, 340, 40, { color: COL.black });
        shape(rectPts(1020, 410, 330, 110), { fill: COL.blueL, w: 4, smooth: false }); txt('運動天數達標', 1185, 465, 38, { color: COL.black });
        txt('且', 1400, 465, 40, { color: COL.gray });
        shape(rectPts(1450, 410, 330, 110), { fill: COL.pinkL, w: 4, smooth: false, color: COL.red }); txt('會流汗會喘', 1615, 465, 38, { color: COL.red });
      });
      // 特徵清單
      appear(prog(lt, 18.2, .7), () => {
        shape(roundRectPts(140, 290, 560, 490, 24), { fill: '#fffdf6', w: 4 });
        txt('特徵', 420, 340, 40, { color: COL.black });
        RW11.feats.forEach((f, i) => { shape(rectPts(200, 385 + i * 92, 440, 72), { fill: COL.white, w: 3, smooth: false }); txt(f, 420, 421 + i * 92, 34, { color: COL.black }); });
      });
      const mv = ease(prog(lt, 27.2, 1.6));
      appear(prog(lt, 27.0, .4), () => {
        const x = lerp(1450, 200, mv), y = lerp(410, 661, mv), w = lerp(330, 440, mv), h = lerp(110, 72, mv);
        shape(rectPts(x, y, w, h), { fill: COL.pinkL, w: 4, smooth: false, color: COL.red }); txt('會流汗會喘', x + w / 2, y + h / 2, lerp(38, 34, mv), { color: COL.red });
      });
      appear(prog(lt, 30.2, .6), () => { txt('模型直接看到', 1400, 660, 50, { color: COL.red }); txt('答案的一部分', 1400, 728, 50, { color: COL.red }); });
      appear(prog(lt, 32.2, .6), () => txt('檢查：逐一核對特徵與結果的定義', 1400, 815, 34, { color: COL.blue }));
      stick(840, GY, .8, { hair: 'tuft', la: Math.PI * .75, ra: [-Math.PI * .1, -Math.PI * .2], mouth: lt > 28.5 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    }
  } };

  // 5 第二種：前處理在切分之前；模擬資料的三個 AUC
  const s5 = { beats: [0, 9.0, 16.73, 25.82, 30.02], draw(lt) {
    txt('第二種　前處理在切分之前', 120, 135, 54, { p: prog(lt, .2, .8), color: COL.red, align: 'left' });
    const A = 1 - prog(lt, 8.6, .4);
    if (A > 0) {
      const X0 = 300, CW = 240, Y = 320, HH = 110, cut = lt > 5.6;
      appear(prog(lt, .8, .6) * A, () => {
        txt('全部資料', X0, 280, 34, { align: 'left', color: COL.gray });
        for (let i = 0; i < 5; i++) { const te = i === 4 && cut; shape(rectPts(X0 + i * CW, Y, CW, HH), { fill: te ? COL.pinkL : COL.blueL, w: 4, smooth: false, color: te ? COL.red : INK }); if (cut) txt(te ? '測試的那一份' : '訓練', X0 + i * CW + CW / 2, Y + HH / 2, te ? 32 : 34, { color: te ? COL.red : COL.black }); }
      });
      const kb = prog(lt, 2.6, .9);
      if (kb > 0) appear(A, () => ink([[X0, Y + HH + 16], [X0, Y + HH + 40], [X0 + 5 * CW, Y + HH + 40], [X0 + 5 * CW, Y + HH + 16]], { w: 5, color: COL.red, p: kb }));
      appear(prog(lt, 3.2, .6) * A, () => { txt('標準化・補值・挑特徵', 900, 545, 48, { color: COL.red }); txt('用全部資料計算', 900, 610, 38, { color: COL.black }); });
      appear(prog(lt, 7.0, .5) * A, () => { arrow(1380, 700, 1380, 495, { w: 5, head: 16, color: COL.red }); txt('切分之前就先被看過了', 1380, 745, 42, { color: COL.red }); });
    }
    const B = prog(lt, 9.1, .6);
    if (B > 0) {
      // 左：模擬資料的說明
      noteBox(420, 300, 440, 100, [['模擬資料', 50, COL.black]], '#fff1c2', B);
      appear(prog(lt, 11.0, .6), () => txt('200 人 × 200 個特徵', 420, 420, 46, { color: COL.black }));
      appear(prog(lt, 13.6, .6), () => {
        txt('全是和結果無關的亂數', 420, 485, 34, { color: COL.red });
        for (let r = 0; r < 6; r++) for (let c = 0; c < 14; c++) { const v = rnd(r * 31 + c * 7 + 1); shape(rectPts(196 + c * 32, 540 + r * 32, 26, 26), { fill: v > .66 ? '#cfcabd' : v > .33 ? '#e4e0d6' : COL.white, w: 1.5, smooth: false, color: COL.gray }); }
        txt('真實的區辨力應該是 0.5', 420, 770, 32, { color: COL.gray });
      });
      // 右：三根橫條
      const L = 1010, R = 1790, X = v => L + v * (R - L), AX = 720, BY = [300, 450, 600], AT = [19.6, 25.9, 30.2], NT = [22.6, 27.6, 33.4];
      appear(prog(lt, 16.8, .6), () => {
        txt('交叉驗證的 AUC（模擬資料）', 1400, 215, 34, { color: COL.gray });
        inkLine(L, AX, R, AX, { w: 4 }); inkLine(L, 250, L, AX, { w: 4 });
        [0, 0.5, 1].forEach(v => { inkLine(X(v), AX, X(v), AX + 12, { w: 3 }); txt(v === 0 ? '0' : v === 1 ? '1.0' : '0.5', X(v), AX + 40, 30, { color: COL.gray }); });
        dash(X(.5), 250, X(.5), AX, { color: COL.gray, alpha: .7 });
      });
      RW11.auc.forEach(([lab, v, col, fill], i) => {
        const k = ease(prog(lt, AT[i], 1.6));
        appear(prog(lt, AT[i] - (i === 0 ? 2.6 : .1), .5), () => txt(lab, L + 14, BY[i] - 28, 32, { align: 'left', color: COL.black }));
        if (k > 0) shape(rectPts(L, BY[i], (X(v) - L) * k, 64), { fill, w: 4, smooth: false });
        appear(prog(lt, NT[i], .4), () => txt(v.toFixed(2), X(v) + 22, BY[i] + 32, 60, { align: 'left', color: col }));
      });
      appear(prog(lt, 36.0, .6), () => txt('0.5 等於亂猜', X(.5), AX + 90, 36, { color: COL.black }));
      stick(840, GY, .75, { hair: 'pony', la: Math.PI * .7, ra: [-Math.PI * .12, -Math.PI * .1], mouth: lt > 22.6 ? 'o' : 'smile', bob: idle(RLT) * .3 });
    }
  } };

  // 6 做法
  const s6 = { beats: [0, 7.17, 14.58], draw(lt) {
    txt('三個做法', 960, 140, 60, { p: prog(lt, .3, 1), color: COL.black });
    const C = [[420, '前處理放進交叉驗證', ['每一折', '只用訓練的部分計算'], COL.blue, 1.0], [960, '先建基準', ['邏輯斯迴歸', '複雜模型要贏過基準'], COL.green, 7.2], [1500, '變項重要性不是原因', ['說明模型用了哪些變項', '不說明改變它會發生什麼'], COL.red, 14.6]];
    C.forEach(([x, t, ls, col, at], i) => { const k = prog(lt, at, .8); appear(k, () => {
      shape(roundRectPts(x - 235, 250, 470, 420, 24), { fill: '#fffdf6', w: 4 });
      txt(String(i + 1), x, 315, 64, { color: col }); txt(t, x, 395, 42, { color: col });
      appear(prog(lt, at + 2.4, .6), () => txt(ls[0], x, 485, 34, { color: COL.black }));
      appear(prog(lt, at + 3.8, .6), () => txt(ls[1], x, 540, 34, { color: COL.black }));
      check(x, 615, .7, clamp((lt - at - 4.6) / .5));
    }); });
    stick(960, GY + 30, .7, { hair: 'tuft', la: waveArm(RLT + 1), ra: Math.PI * .3, bob: idle(RLT) * .3 });
  } };

  // 7 結語（右下角留給資料來源卡）
  const s7 = { beats: [0, 4.93], draw(lt) {
    ground(lt, 140, 790);
    txt('手上的資料表現很好，新資料上未必', 960, 190, 76, { p: prog(lt, .2, 1.2), color: COL.black });
    underline(380, 1540, 250, { p: prog(lt, 1.6, .5), color: COL.mustardD });
    appear(prog(lt, 5.0, .7), () => { txt('好得不像真的', 1220, 400, 64, { color: COL.black }); txt('先檢查洩漏', 1220, 500, 84, { color: COL.red }); });
    stick(280, GY, 1.2, { glasses: true, la: waveArm(RLT), bob: idle(RLT) * .4 });
    stick(490, GY, 1.05, { hair: 'pony', ra: [-Math.PI * .3, -Math.PI * .5 + Math.sin(RLT * 5 + 1) * .25], bob: idle(RLT, 1) * .4 });
    stick(680, GY, .8, { hair: 'tuft', la: waveArm(RLT + 2), bob: -Math.abs(Math.sin(RLT * 6)) * 14 });
  } };

  const order = [[s1, 17.1], [s2, 23.8], [s3, 16.4], [s4, 34.7], [s5, 40.2], [s6, 22.0], [s7, 11.9]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP3, dur: t, tag: '真實世界運動大數據分析｜第 11 週　好得不像真的：資料洩漏', scenes,
    sources: ['資料來源', 'Kapoor & Narayanan (2023). Patterns, 4(9), 100804', '0.79、0.58、0.52 為課程網站洩漏工具的模擬資料（200 人、200 個亂數特徵）', '林彥光老師講義〈第 11 週 監督式學習：預測模型〉'] };
})();
EPISODES['rw11e1'] = RW11E1;
