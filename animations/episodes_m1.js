// 研究法工作坊｜第 1 章 緒論（5 支）。角色：小研（研究生）、指導教授，另有歷史人物。
const STUDENT = { ...MOM, hair: 'bob', freckles: false, top: { fill: '#5f8f6a' }, sleeve: { fill: '#5f8f6a' }, bottom: { fill: '#3b3b48' }, shoes: 'white', pose0: { spread: 46, mouth: 'smile' } };
const PROF = { ...GOSSET, hat: undefined, hair: 'side', mustache: false, glasses: 'thick', top: { fill: '#7a5a3a', vest: true }, sleeve: { fill: '#7a5a3a' }, bottom: { fill: '#3b3b48' }, shoes: 'black', pose0: { spread: 50, mouth: 'smile' } };
const TRIPLETT = { ...GOSSET, hat: undefined, hair: 'side', mustache: true, glasses: 'round', top: { fill: '#4b5a3a', vest: true }, sleeve: { fill: '#4b5a3a' }, bottom: { fill: '#3b3b48' }, pose0: { spread: 48, mouth: 'smile' } };
const student = (x, y, s, pose, opts) => figure(STUDENT, x, y, s, pose, opts);
const prof = (x, y, s, pose, opts) => figure(PROF, x, y, s, pose, opts);
const triplett = (x, y, s, pose, opts) => figure(TRIPLETT, x, y, s, pose, opts);
const IDLE_ARMS = { la: [P / 2 + .3, P / 2 + .15], ra: [P / 2 - .3, P / 2 - .15] };
function chip(x, y, w, h, s, color, k = 1, size = 30) {
  if (k <= 0) return;
  appear(k, () => { shape(roundRectPts(x - w / 2, y - h / 2, w, h, 16), { fill: color, w: 3.5, smooth: false }); txt(s, x, y + 2, size, { color: COL.black }); });
}
function rtag(label) { return '研究法工作坊｜第 1 章 ' + label; }

function M1E1() {
  const s1 = { beats: [0, 3.3, 6.6], sub: '1898 年，Triplett 發現自行車選手有人陪騎成績更好，於是在實驗室檢驗', draw(lt) {
    ground(lt);
    txt('1898・美國', 960, 150, 70, { p: prog(lt, .2, .9), color: COL.black });
    underline(730, 1190, 200, { p: prog(lt, 1, .5), color: COL.mustardD });
    triplett(300, GY, .95, { ...IDLE_ARMS, ra: [-.5, -1.9], look: 1, mouth: lt > 3.3 ? 'o' : 'smile' });
    // 單騎 vs 兩人騎
    const k = prog(lt, .8, 1.4);
    appear(k, () => {
      txt('單騎', 760, 330, 38, { color: COL.gray });
      mini(660 + 240 * easeOut(k), 690, 1.6, COL.blueL, 'dots');
      txt('兩人一起騎', 1330, 330, 38, { color: COL.blue });
      mini(1160 + 280 * easeOut(k), 690, 1.6, COL.pinkL, 'dots');
      mini(1060 + 280 * easeOut(k), 690, 1.6, COL.greenL, 'dots');
    });
    appear(prog(lt, 2.0, .5), () => { txt('比較快？', 1330, 420, 46, { color: COL.red }); });
    bubble(690, 560, 380, 110, 400, 600, '真的，還是巧合？', 36, prog(lt, 3.5, .5));
    // 實驗室：兩個小朋友捲釣魚線
    appear(prog(lt, 6.8, .6), () => {
      shape(roundRectPts(960, 560, 760, 270, 20), { fill: '#fffdf6', w: 3.5, smooth: false });
      txt('實驗室：小朋友捲釣魚線', 1340, 600, 32, { color: COL.black });
      kid(1100, 815, .55, { ...KIDSPEC.pose0, bob: idle(RLT) * .3 });
      kid(1580, 815, .55, { bob: idle(RLT, 1) * .3 });
      kid(1340, 815, .55, { bob: idle(RLT, 2) * .3 });
      inkEll(1220, 760, 18, 18, { w: 3.5, color: COL.blue }); inkEll(1460, 760, 18, 18, { w: 3.5, color: COL.blue });
    });
  } };
  const s2 = { beats: [0, 2.0, 4.6], sub: '研究背景像漏斗：現象、已知、缺口、本研究', draw(lt) {
    txt('研究背景＝漏斗', 960, 130, 64, { p: prog(lt, .2, .8), color: COL.black });
    underline(700, 1220, 180, { p: prog(lt, .8, .5), color: COL.mustardD });
    const L = [
      [1000, '現象：大範圍的趨勢', COL.blueL, 2.2],
      [800, '已知：過去研究做了什麼', COL.greenL, 3.2],
      [600, '缺口：還沒解決的問題', COL.pinkL, 4.8],
      [400, '本研究', COL.mustard, 6.0]];
    L.forEach(([w, s, c, at], i) => {
      const k = prog(lt, at, .6), y = 300 + i * 140;
      appear(k, () => {
        shape([[960 - w / 2, y - 55], [960 + w / 2, y - 55], [960 + w / 2 - 100, y + 55], [960 - w / 2 + 100, y + 55]], { fill: c, w: 3.5, smooth: false });
        txt(s, 960, y + 2, w < 500 ? 32 : 36, { color: COL.black });
      });
    });
    appear(prog(lt, 4.8, .5), () => { arrow(1500, 300 + 2 * 140 - 80, 1290, 300 + 2 * 140 - 10, { w: 4, color: COL.red, head: 16 }); txt('重心在這裡', 1620, 300 + 2 * 140 - 90, 34, { color: COL.red }); });
  } };
  const s3 = { beats: [0, 3.0, 6.2, 9.4], sub: '小研的背景：現象、已知、缺口三句話', draw(lt) {
    ground(lt, 80, 560);
    student(190, GY, .72, { ...IDLE_ARMS, look: 1, bob: idle(RLT) * .3 });
    prof(420, GY, .72, { ...IDLE_ARMS, mouth: 'smile', look: -1, bob: idle(RLT, 1) * .3 });
    bubble(260, 300, 440, 110, 190, 440, '想研究划船選手疲勞', 34, prog(lt, .4, .5));
    paperSheet(1200, 470, 1260, 660, -.012);
    txt('研究背景（草稿）', 1200, 215, 44, { p: prog(lt, .6, .7), color: COL.black });
    const rows = [
      ['現象', COL.blueL, '大專選手賽季訓練量越來越高，疲勞累積受到關注。', 3.2],
      ['已知', COL.greenL, '過去研究多用心率與主觀疲勞量表監測訓練負荷。', 6.4],
      ['缺口', COL.pinkL, '然而，結合睡眠與肌肉負荷的監測，證據仍然很少。', 9.6]];
    rows.forEach(([tag, c, s, at], i) => {
      const k = prog(lt, at, .9), y = 340 + i * 150;
      appear(k, () => { chip(700, y, 120, 56, tag, c, 1, 30); txt(s, 790, y + 2, 36, { color: COL.black, align: 'left', p: k }); });
    });
    appear(prog(lt, 9.8, .5), () => underline(790, 1700, 340 + 2 * 150 + 38, { color: COL.red }));
  } };
  const s4 = { beats: [0, 3.4], sub: '「我喜歡籃球」是個人興趣，不是研究動機', draw(lt) {
    ground(lt, 80, 700);
    student(260, GY, .9, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    bubble(560, 190, 640, 130, 320, 320, '我喜歡籃球，所以研究籃球', 36, prog(lt, .3, .5));
    appear(prog(lt, 1.4, .5), () => cross(1000, 190, 1.4, prog(lt, 1.4, .4)));
    const items = [['現象', 3.6], ['已知', 4.4], ['缺口', 5.2]];
    items.forEach(([s, at], i) => {
      const k = prog(lt, at, .5), y = 330 + i * 120;
      appear(k, () => { chip(1330, y, 220, 70, s, COL.white, 1, 36); cross(1520, y, .9, k); });
    });
    noteBox(1330, 740, 760, 110, [['個人興趣 ≠ 研究動機', 36, COL.red]], '#fff8e2', prog(lt, 6.2, .6));
  } };
  const s5 = { beats: [0, 3.4], sub: '回到課程網站，寫出你的背景段', draw(lt) {
    shape(roundRectPts(480, 190, 800, 520, 26), { fill: '#fffdf6', w: 4, smooth: false });
    shape(roundRectPts(480, 190, 800, 70, 26), { fill: COL.blueL, w: 4, smooth: false });
    txt('論文五章工作坊', 880, 228, 34, { p: prog(lt, .2, .6), color: COL.black });
    appear(prog(lt, .8, .5), () => { chip(880, 400, 640, 90, '1.1 研究背景與動機', COL.mustard, 1, 38); txt('判斷題・排序・寫作練習', 880, 520, 32, { color: COL.gray }); });
    appear(prog(lt, 1.6, .5), () => pen(1120, 410, -.6, 1));
    noteBox(880, 640, 720, 100, [['缺口句，是背景的重心', 40, COL.red]], '#fff8e2', prog(lt, 3.5, .6));
    underline(560, 1200, 700, { p: prog(lt, 4.2, .5), color: COL.mustardD });
    student(250, GY, .78, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT) * .3 });
    prof(1380, GY, .78, { ...IDLE_ARMS, mouth: 'smile', bob: idle(RLT, 1) * .3 });
  } };
  const order = [[s1, 12], [s2, 9], [s3, 14], [s4, 9], [s5, 8]];
  let t = 0; const scenes = order.map(([s, d]) => { const o = { ...s, t0: t, t1: t + d }; t += d; return o; });
  return { ...EP1, dur: t, tag: rtag('EP1　研究背景：從現象走到缺口'), scenes,
    sources: ['資料來源', 'Triplett (1898) Am J Psychol 9(4):507–533', 'Simply Psychology〈Social Facilitation〉', '課程網站〈1.1 研究背景與動機〉'] };
}
EPISODES['m1e1'] = M1E1();
