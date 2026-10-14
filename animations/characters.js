// 角色：阿統（爸爸）、小檢（媽媽）、小樣（小孩），以及歷史人物 Gosset、Wilcoxon
// 座標原點在雙腳中間的地面，往上為負 y。

const ADULT = { hip: -250, shoulder: -440, headY: -528, hrx: 50, hry: 60, shW: 86, hemW: 90, legOff: 38, legW: 66, legW1: 50, armW: 46, upper: 96, fore: 88, handR: 17, neck: 22 };
const SLIM = { ...ADULT, shW: 74, hemW: 70, legOff: 30, legW: 50, legW1: 36, armW: 38, upper: 92, fore: 84, handR: 15, hrx: 46, hry: 56, headY: -522 };
const KID = { hip: -92, shoulder: -170, headY: -236, hrx: 52, hry: 50, shW: 44, hemW: 46, legOff: 18, legW: 34, legW1: 30, armW: 24, upper: 42, fore: 38, handR: 11, neck: 8 };

function defaultPose(p = {}) {
  return {
    la: [Math.PI / 2 + .35, Math.PI / 2 + .12], ra: [Math.PI / 2 - .35, Math.PI / 2 - .12],
    spread: 70, knee: 0, lean: 0, bob: 0, mouth: 'smile', look: 0, liftL: 0, liftR: 0, brow: 0, blink: false, ...p
  };
}

function armPts(d, s, ang) {
  const e = [s[0] + Math.cos(ang[0]) * d.upper, s[1] + Math.sin(ang[0]) * d.upper];
  const h = [e[0] + Math.cos(ang[1]) * d.fore, e[1] + Math.sin(ang[1]) * d.fore];
  return [s, e, h];
}

function drawLeg(d, hip, foot, kneeBend, spec) {
  const mid = [(hip[0] + foot[0]) / 2 + kneeBend, (hip[1] + foot[1]) / 2];
  const ankle = [foot[0], foot[1] - 22];
  const poly = limbPoly([hip, mid, ankle], d.legW, d.legW1);
  shape(poly, { fill: spec.bottom.fill, pattern: spec.bottom.pattern, patColor: spec.bottom.patColor, sp: spec.bottom.sp, r: spec.bottom.r, w: 4, smooth: false });
  if (spec.bottom.fill === COL.black) { // white crease lines on black pants
    inkLine(mid[0] - 6, mid[1] - 30, mid[0] + 4, mid[1] + 10, { color: COL.white, w: 3 });
    inkLine(ankle[0] - 10, ankle[1] - 18, ankle[0] + 12, ankle[1] - 14, { color: COL.white, w: 3 });
  }
}

function drawShoe(d, foot, dir, style, kid) {
  const L = kid ? 40 : 74, Hh = kid ? 20 : 30;
  const x = foot[0], y = foot[1];
  const toe = x + dir * L * .62, heel = x - dir * L * .38;
  const pts = [[heel, y], [heel, y - Hh * .8], [x, y - Hh], [toe - dir * 8, y - Hh * .7], [toe, y - Hh * .25], [toe, y]];
  const black = style === 'black';
  shape(pts, { fill: black ? COL.black : COL.white, w: 4 });
  inkLine(heel, y - 5, toe, y - 5, { w: 3, color: black ? COL.white : INK });
  if (!kid) inkLine(x - dir * 4, y - Hh * .85, x + dir * 14, y - Hh * .55, { w: 2.5, color: black ? COL.white : INK });
}

function drawTorso(d, spec, pose) {
  const s = d.shoulder, hip = d.hip, ln = pose.lean;
  const hem = spec.top.long ? hip + 120 : hip + 6;
  const hemW = spec.top.long ? d.hemW + 12 : d.hemW;
  const pts = [
    [-d.neck + ln, s - 12], [-d.shW + ln, s + 4], [-d.shW + 6 + ln * .7, s + 70],
    [-hemW + ln * .2, hem], [hemW + ln * .2, hem], [d.shW - 6 + ln * .7, s + 70], [d.shW + ln, s + 4], [d.neck + ln, s - 12]
  ];
  shape(pts, { fill: spec.top.fill, pattern: spec.top.pattern, patColor: spec.top.patColor, sp: spec.top.sp, r: spec.top.r, w: 4.2, smooth: false });
  // collar
  inkSmooth([[-d.neck - 4 + ln, s - 10], [ln, s + (d === KID ? 8 : 14)], [d.neck + 4 + ln, s - 10]], { w: 3.5 });
  if (!spec.top.long) inkLine(-hemW + 8 + ln * .2, hem - (d === KID ? 10 : 22), hemW - 8 + ln * .2, hem - (d === KID ? 10 : 22), { w: 2.6, alpha: .7 });
  if (spec.top.long) { // lab coat
    inkLine(ln * .6, s + 14, ln * .2, hem, { w: 3 });
    inkEll(-28 + ln * .5, s + 120, 6, 6, { w: 2.5 }); inkEll(-28 + ln * .4, s + 190, 6, 6, { w: 2.5 });
    shape(rectPts(30 + ln * .5, s + 60, 34, 30), { stroke: true, w: 2.5, smooth: false });
  }
  if (spec.top.cat) { // kid's cat-face shirt
    const cy = s + 46, cx = ln * .6;
    ink([[cx - 24, cy + 8], [cx - 22, cy - 18], [cx - 10, cy - 8], [cx + 10, cy - 8], [cx + 22, cy - 18], [cx + 24, cy + 8], [cx + 14, cy + 20], [cx - 14, cy + 20]], { closed: true, color: COL.white, w: 3 });
    ctx.save(); ctx.fillStyle = COL.white; ctx.globalAlpha = ALPHA;
    ctx.beginPath(); ctx.arc(cx - 9, cy + 2, 3.5, 0, 7); ctx.arc(cx + 9, cy + 2, 3.5, 0, 7); ctx.fill(); ctx.restore();
    fillShape([[cx - 3, cy + 8], [cx + 3, cy + 8], [cx, cy + 12]], COL.pink);
    inkLine(cx - 30, cy + 9, cx - 16, cy + 11, { color: COL.white, w: 2 }); inkLine(cx + 30, cy + 9, cx + 16, cy + 11, { color: COL.white, w: 2 });
  }
  if (spec.top.vest) { // Gosset's waistcoat + tie
    shape([[-d.neck + 6 + ln, s - 4], [ln, s + 40], [d.neck - 6 + ln, s - 4], [d.shW - 20 + ln * .6, s + 30], [d.hemW - 16, hem - 8], [-d.hemW + 16, hem - 8], [-d.shW + 20 + ln * .6, s + 30]], { fill: '#6b5440', smooth: false, w: 3.5 });
    shape([[ln - 6, s + 2], [ln + 6, s + 2], [ln + 9, s + 60], [ln, s + 72], [ln - 9, s + 60]], { fill: COL.red, smooth: false, w: 2.5 });
    for (let i = 0; i < 3; i++) inkEll(ln * .4 + 22, s + 88 + i * 34, 4, 4, { w: 2.5 });
  }
}

function drawArm(d, spec, s, ang, hand) {
  const [sh, el, h] = armPts(d, s, ang);
  const k = .82;
  const wrist = [lerp(el[0], h[0], k), lerp(el[1], h[1], k)];
  const sleeveFill = spec.sleeve?.fill ?? spec.top.fill;
  shape(limbPoly([sh, el, wrist], d.armW, d.armW * .78), { fill: sleeveFill, pattern: spec.sleeve?.pattern ?? spec.top.pattern, patColor: spec.top.patColor, sp: spec.top.sp, r: spec.top.r, w: 4, smooth: false });
  // hand
  const r = d.handR;
  shape(ellPts(h[0], h[1], r, r * .92, 0, Math.PI * 2, 14), { fill: COL.skin, w: 3.5 });
  if (hand !== 'open') { // fist knuckles
    const a = ang[1];
    for (let i = -1; i <= 1; i++) {
      const px = h[0] + Math.cos(a + Math.PI / 2) * i * r * .45, py = h[1] + Math.sin(a + Math.PI / 2) * i * r * .45;
      inkLine(px - Math.cos(a) * r * .2, py - Math.sin(a) * r * .2, px + Math.cos(a) * r * .55, py + Math.sin(a) * r * .55, { w: 2 });
    }
  } else { // open hand: fingers
    const a = ang[1];
    for (let i = -2; i <= 2; i++) {
      const fa = a + i * .32;
      inkLine(h[0] + Math.cos(fa) * r * .7, h[1] + Math.sin(fa) * r * .7, h[0] + Math.cos(fa) * r * 1.5, h[1] + Math.sin(fa) * r * 1.5, { w: 3.5 });
    }
  }
  return h;
}

function drawHead(d, spec, pose) {
  const cx = pose.lean * 1.1, cy = d.headY, rx = d.hrx, ry = d.hry;
  const hair = spec.hair;
  // neck
  if (d !== KID) shape(rectPts(cx - 15, cy + ry - 14, 30, d.shoulder - cy - ry + 6), { fill: COL.skin, w: 3, smooth: false });
  // back hair
  if (hair === 'bob') {
    shape([[cx - rx * 1.22, cy + ry * .62], [cx - rx * 1.28, cy - ry * .2], [cx - rx * .9, cy - ry * 1.05], [cx, cy - ry * 1.25], [cx + rx * .95, cy - ry * 1.05], [cx + rx * 1.3, cy - ry * .2], [cx + rx * 1.35, cy + ry * .55], [cx + rx * 1.5, cy + ry * .75], [cx + rx * .9, cy + ry * .66], [cx - rx * .9, cy + ry * .7], [cx - rx * 1.4, cy + ry * .8]], { fill: COL.black, w: 3 });
  } else if (hair === 'kid') {
    shape([[cx - rx * 1.12, cy + ry * .5], [cx - rx * 1.15, cy - ry * .4], [cx - rx * .6, cy - ry * 1.12], [cx + rx * .6, cy - ry * 1.12], [cx + rx * 1.15, cy - ry * .4], [cx + rx * 1.12, cy + ry * .5], [cx + rx * .7, cy + ry * .3], [cx - rx * .7, cy + ry * .3]], { fill: COL.black, w: 3 });
  }
  // ears
  if (hair !== 'bob' && hair !== 'kid') {
    shape(ellPts(cx - rx + 2, cy + 4, 10, 15), { fill: COL.skin, w: 3 });
    shape(ellPts(cx + rx - 2, cy + 4, 10, 15), { fill: COL.skin, w: 3 });
  }
  // face
  shape(ellPts(cx, cy, rx, ry, 0, Math.PI * 2, 30), { fill: COL.skin, w: 4 });
  // front hair
  if (hair === 'dad') {
    const pts = [];
    pts.push([cx - rx * 1.02, cy - ry * .05]);
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI * (1.05 + i / 12 * .95);
      const rr = 1.12 + (i % 2 ? .28 : .08) + rnd(i, 7) * .1;
      pts.push([cx + Math.cos(a) * rx * rr, cy - ry * .15 + Math.sin(a) * ry * rr]);
    }
    pts.push([cx + rx * 1.02, cy - ry * .1]);
    pts.push([cx + rx * .7, cy - ry * .55]); pts.push([cx + rx * .25, cy - ry * .42]); pts.push([cx - rx * .1, cy - ry * .62]); pts.push([cx - rx * .55, cy - ry * .45]); pts.push([cx - rx * .85, cy - ry * .5]);
    shape(pts, { fill: COL.black, w: 3, smooth: false });
    // flyaway strands
    inkSmooth([[cx + rx * .3, cy - ry * 1.3], [cx + rx * .6, cy - ry * 1.6], [cx + rx * 1.0, cy - ry * 1.5]], { w: 3, color: COL.black });
    inkSmooth([[cx - rx * .2, cy - ry * 1.35], [cx - rx * .1, cy - ry * 1.65], [cx + rx * .15, cy - ry * 1.62]], { w: 3, color: COL.black });
  } else if (hair === 'bob') {
    shape([[cx - rx * 1.05, cy - ry * .1], [cx - rx * .95, cy - ry * .75], [cx - rx * .2, cy - ry * 1.08], [cx + rx * .7, cy - ry * .95], [cx + rx * 1.05, cy - ry * .2], [cx + rx * .55, cy - ry * .5], [cx + rx * .05, cy - ry * .42], [cx - rx * .55, cy - ry * .55]], { fill: COL.black, w: 3 });
    inkSmooth([[cx + rx * .4, cy - ry * 1.15], [cx + rx * .9, cy - ry * 1.4], [cx + rx * 1.3, cy - ry * 1.25]], { w: 3, color: COL.black });
  } else if (hair === 'kid') {
    shape([[cx - rx * 1.05, cy - ry * .05], [cx - rx * .8, cy - ry * .85], [cx, cy - ry * 1.1], [cx + rx * .8, cy - ry * .85], [cx + rx * 1.05, cy - ry * .05], [cx + rx * .6, cy - ry * .35], [cx + rx * .2, cy - ry * .28], [cx - rx * .25, cy - ry * .32], [cx - rx * .65, cy - ry * .3]], { fill: COL.black, w: 3 });
    inkSmooth([[cx + rx * .1, cy - ry * 1.08], [cx + rx * .3, cy - ry * 1.4], [cx + rx * .55, cy - ry * 1.3]], { w: 3, color: COL.black });
  } else if (hair === 'side') { // Gosset: neat side part
    shape([[cx - rx * 1.02, cy - ry * .05], [cx - rx * .95, cy - ry * .7], [cx - rx * .3, cy - ry * 1.02], [cx + rx * .6, cy - ry * .95], [cx + rx * 1.02, cy - ry * .2], [cx + rx * .7, cy - ry * .6], [cx - rx * .2, cy - ry * .62], [cx - rx * .75, cy - ry * .45]], { fill: '#5a3d26', w: 3 });
  } else if (hair === 'bald') { // Wilcoxon: receding grey hair
    shape([[cx - rx * 1.04, cy + ry * .1], [cx - rx * .98, cy - ry * .5], [cx - rx * .7, cy - ry * .58], [cx - rx * .8, cy + ry * .1]], { fill: COL.gray, w: 2.5 });
    shape([[cx + rx * 1.04, cy + ry * .1], [cx + rx * .98, cy - ry * .5], [cx + rx * .7, cy - ry * .58], [cx + rx * .8, cy + ry * .1]], { fill: COL.gray, w: 2.5 });
  }
  if (spec.hat === 'bowler') {
    shape(ellPts(cx, cy - ry * .78, rx * 1.35, ry * .16), { fill: COL.black, w: 3 });
    shape([[cx - rx * .85, cy - ry * .8], [cx - rx * .8, cy - ry * 1.35], [cx, cy - ry * 1.6], [cx + rx * .8, cy - ry * 1.35], [cx + rx * .85, cy - ry * .8]], { fill: COL.black, w: 3 });
  }
  // face features
  const ex = rx * .38, ey = cy - ry * .02, lx = pose.look * 4;
  const bw = d === KID ? 0 : 1;
  if (pose.blink) {
    inkLine(cx - ex - 7, ey, cx - ex + 7, ey, { w: 3.5 }); inkLine(cx + ex - 7, ey, cx + ex + 7, ey, { w: 3.5 });
  } else {
    ctx.save(); ctx.fillStyle = INK; ctx.globalAlpha = ALPHA;
    const er = spec.eyeR ?? 4.8;
    ctx.beginPath(); ctx.arc(cx - ex + lx, ey, er, 0, 7); ctx.arc(cx + ex + lx, ey, er, 0, 7); ctx.fill(); ctx.restore();
    if (spec.bigEyes) { inkEll(cx - ex, ey, 11, 9, { w: 2.5 }); inkEll(cx + ex, ey, 11, 9, { w: 2.5 }); }
  }
  // brows
  const by = ey - ry * .3 - pose.brow * 6;
  if (bw) {
    inkLine(cx - ex - 14, by + 2, cx - ex + 12, by - 3 - pose.brow * 3, { w: spec.thickBrow ? 6 : 3.5 });
    inkLine(cx + ex - 12, by - 3 - pose.brow * 3, cx + ex + 14, by + 2, { w: spec.thickBrow ? 6 : 3.5 });
  }
  if (spec.glasses === 'thick') {
    const gw = 40, gh = 30;
    ink(roundRectPts(cx - ex - gw / 2, ey - gh / 2, gw, gh, 8), { closed: true, w: 6, color: COL.black });
    ink(roundRectPts(cx + ex - gw / 2, ey - gh / 2, gw, gh, 8), { closed: true, w: 6, color: COL.black });
    inkLine(cx - ex + gw / 2, ey - 4, cx + ex - gw / 2, ey - 4, { w: 4.5, color: COL.black });
    inkLine(cx - ex - gw / 2, ey - 6, cx - rx + 2, ey - 10, { w: 4, color: COL.black });
    inkLine(cx + ex + gw / 2, ey - 6, cx + rx - 2, ey - 10, { w: 4, color: COL.black });
  } else if (spec.glasses === 'round') {
    inkEll(cx - ex, ey, 16, 16, { w: 3 }); inkEll(cx + ex, ey, 16, 16, { w: 3 });
    inkLine(cx - ex + 16, ey - 2, cx + ex - 16, ey - 2, { w: 2.5 });
  }
  // nose
  if (d !== KID) inkSmooth([[cx + 2, ey + 8], [cx - 5, ey + ry * .3], [cx + 4, ey + ry * .34]], { w: 3 });
  // mustache / stubble / freckles
  const my = cy + ry * .55;
  if (spec.stubble) {
    ctx.save(); ctx.fillStyle = INK; ctx.globalAlpha = ALPHA * .8;
    for (let i = 0; i < 46; i++) {
      const a = Math.PI * (.12 + rnd(i, 31) * .76), rr = .62 + rnd(i, 32) * .32;
      const px = cx + Math.cos(a) * rx * rr, py = cy + ry * .1 + Math.sin(a) * ry * rr * .85;
      ctx.beginPath(); ctx.arc(px + (hash3(i, BOIL, 4) - .5), py, 1.7, 0, 7); ctx.fill();
    }
    ctx.restore();
  }
  if (spec.mustache) shape([[cx - 24, my - 2], [cx - 8, my - 14], [cx, my - 8], [cx + 8, my - 14], [cx + 24, my - 2], [cx + 4, my - 4], [cx - 4, my - 4]], { fill: '#5a3d26', w: 2.5 });
  if (spec.freckles) {
    ctx.save(); ctx.fillStyle = INK; ctx.globalAlpha = ALPHA * .7;
    [[-1, 0], [-1.2, 1], [-.8, 1], [1, 0], [1.2, 1], [.8, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(cx + sx * rx * .55, ey + 20 + sy * 6, 1.8, 0, 7); ctx.fill(); });
    ctx.restore();
  }
  // mouth
  const m = pose.mouth, mw = d === KID ? 9 : 13;
  if (m === 'o') shape(ellPts(cx, my + 2, mw * .6, mw * .8), { fill: '#7a2a2a', w: 3 });
  else if (m === 'smile') inkSmooth([[cx - mw, my - 2], [cx, my + 6], [cx + mw, my - 2]], { w: 3.5 });
  else if (m === 'open') shape([[cx - mw * 1.2, my - 4], [cx + mw * 1.2, my - 4], [cx, my + mw * 1.2]], { fill: '#7a2a2a', w: 3 });
  else if (m === 'grit') { shape(rectPts(cx - mw, my - 6, mw * 2, 12), { fill: COL.white, w: 3, smooth: false }); inkLine(cx - mw, my, cx + mw, my, { w: 2 }); }
  else inkLine(cx - mw * .8, my, cx + mw * .8, my, { w: 3.5 });
  // blush
  if (spec.blush) {
    ctx.save(); ctx.globalAlpha = ALPHA * .35; ctx.fillStyle = COL.pink;
    ctx.beginPath(); ctx.ellipse(cx - rx * .6, ey + ry * .32, 11, 6, 0, 0, 7); ctx.ellipse(cx + rx * .6, ey + ry * .32, 11, 6, 0, 0, 7); ctx.fill(); ctx.restore();
  }
}

// generic figure; returns world-space hand positions (for props)
function figure(spec, x, y, s, poseIn = {}, opts = {}) {
  const d = spec.dims, pose = defaultPose({ ...spec.pose0, ...poseIn });
  ctx.save();
  ctx.translate(x, y + pose.bob); ctx.scale(s * (opts.flip ? -1 : 1), s);
  const hipY = d.hip;
  const lh = [-d.legOff + pose.lean * .2, hipY], rh = [d.legOff + pose.lean * .2, hipY];
  const lf = [-pose.spread, -pose.liftL], rf = [pose.spread, -pose.liftR];
  drawLeg(d, lh, lf, -pose.knee, spec); drawLeg(d, rh, rf, pose.knee, spec);
  drawShoe(d, lf, -1, spec.shoes, d === KID); drawShoe(d, rf, 1, spec.shoes, d === KID);
  const ls = [-d.shW + 12 + pose.lean, d.shoulder + 18], rs = [d.shW - 12 + pose.lean, d.shoulder + 18];
  if (opts.armsBehind) { drawArm(d, spec, ls, pose.la, pose.lhand); drawArm(d, spec, rs, pose.ra, pose.rhand); }
  drawTorso(d, spec, pose);
  drawHead(d, spec, pose);
  let lhp, rhp;
  if (!opts.armsBehind) { lhp = drawArm(d, spec, ls, pose.la, pose.lhand); rhp = drawArm(d, spec, rs, pose.ra, pose.rhand); }
  else { lhp = armPts(d, ls, pose.la)[2]; rhp = armPts(d, rs, pose.ra)[2]; }
  const m = ctx.getTransform();
  const tw = p => [m.a * p[0] + m.c * p[1] + m.e, m.b * p[0] + m.d * p[1] + m.f];
  ctx.restore();
  return { lh: tw(lhp), rh: tw(rhp), head: [x, y + pose.bob + d.headY * s] };
}

const DAD = {
  dims: ADULT, hair: 'dad', glasses: 'thick', stubble: true, thickBrow: true,
  top: { fill: COL.white }, bottom: { fill: COL.pinkL, pattern: 'dots', patColor: COL.pink, sp: 12, r: 3.2 }, shoes: 'white',
  pose0: { spread: 78 }
};
const MOM = {
  dims: SLIM, hair: 'bob', freckles: true, bigEyes: true, eyeR: 4, blush: true,
  top: { fill: COL.pinkL, pattern: 'dots', patColor: COL.pink, sp: 11, r: 3 }, bottom: { fill: COL.black }, shoes: 'black',
  pose0: { spread: 58, mouth: 'o' }
};
const KIDSPEC = {
  dims: KID, hair: 'kid', blush: true, eyeR: 5,
  top: { fill: COL.black, cat: true }, sleeve: { fill: COL.white }, bottom: { fill: COL.black }, shoes: 'white',
  pose0: { spread: 26, la: [-Math.PI / 2 - .5, -Math.PI / 2 - .2], ra: [-Math.PI / 2 + .5, -Math.PI / 2 + .2], lhand: 'open', rhand: 'open' }
};
const GOSSET = {
  dims: ADULT, hair: 'side', hat: 'bowler', mustache: true, glasses: 'round',
  top: { fill: '#3b3f57', vest: true }, sleeve: { fill: '#3b3f57' }, bottom: { fill: '#4a4458', pattern: 'hatch', patColor: COL.white, sp: 14 }, shoes: 'black',
  pose0: { spread: 52, mouth: 'flat' }
};
const WILCOXON = {
  dims: ADULT, hair: 'bald', glasses: 'round',
  top: { fill: COL.white, long: true }, bottom: { fill: '#55506a' }, shoes: 'black',
  pose0: { spread: 50, mouth: 'smile' }
};

// convenient wrappers with idle motion
function idle(t, ph = 0) { return Math.sin(t * 3.2 + ph) * 6; }
function dad(x, y, s, pose = {}, opts) { return figure(DAD, x, y, s, pose, opts); }
function mom(x, y, s, pose = {}, opts) { return figure(MOM, x, y, s, pose, opts); }
function kid(x, y, s, pose = {}, opts) { return figure(KIDSPEC, x, y, s, pose, opts); }
function gosset(x, y, s, pose = {}, opts) { return figure(GOSSET, x, y, s, pose, opts); }
function wilcoxon(x, y, s, pose = {}, opts) { return figure(WILCOXON, x, y, s, pose, opts); }

// the reference "dance" poses
const P = Math.PI;
const DANCE_DAD = t => ({ la: [P + .15, -.25 + Math.sin(t * 6) * .15], ra: [-.1, -P / 2 - .3 + Math.sin(t * 6 + 1) * .15], spread: 95, knee: 18, lean: -6, mouth: 'grit', bob: Math.abs(Math.sin(t * 6)) * -10 });
const DANCE_MOM = t => ({ la: [P - .6, -.6 + Math.sin(t * 6 + 2) * .2], ra: [P / 2 - .9, P - .2], liftL: 40 + Math.sin(t * 6) * 10, spread: 62, knee: -14, lean: 8, mouth: 'o', bob: Math.abs(Math.sin(t * 6 + 1)) * -8 });
