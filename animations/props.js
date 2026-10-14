// 道具與圖表：鐘形曲線、長條圖、碼錶、酒杯、燒杯、名次牌、法槌、卷軸……

function normalPdf(z) { return Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI); }
function tPdf(z, df) { // unnormalised shape is enough for drawing; scale to normal peak
  return Math.pow(1 + z * z / df, -(df + 1) / 2) * normalPdf(0) * (df < 3 ? .82 : .92);
}
// draw a density curve centred at cx; zRange [-a,a] mapped to width
function curve(cx, base, wHalf, hScale, f, o = {}) {
  const pts = [], a = o.range ?? 3.6;
  for (let i = 0; i <= 80; i++) { const z = -a + 2 * a * i / 80; pts.push([cx + z / a * wHalf, base - f(z) * hScale]); }
  ink(pts, { w: o.w ?? 5, p: o.p ?? 1, color: o.color ?? INK, alpha: o.alpha });
  return pts;
}
// shade area under curve between z0 and z1
function shadeUnder(cx, base, wHalf, hScale, f, z0, z1, color, o = {}) {
  const a = o.range ?? 3.6, pts = [[cx + z0 / a * wHalf, base]];
  for (let i = 0; i <= 30; i++) { const z = lerp(z0, z1, i / 30); pts.push([cx + z / a * wHalf, base - f(z) * hScale]); }
  pts.push([cx + z1 / a * wHalf, base]);
  fillShape(pts, color, { alpha: o.alpha ?? .75, pattern: o.pattern, patColor: o.patColor, sp: o.sp ?? 9, amp: 1 });
}
function axis(x0, x1, y, o = {}) { arrow(x0, y, x1, y, { w: 4, head: 16, ...o }); }

function bar(x, base, w, h, color, o = {}) {
  if (h <= 1) return;
  shape(rectPts(x - w / 2, base - h, w, h), { fill: color, smooth: false, w: 4, pattern: o.pattern, patColor: o.patColor, sp: o.sp, r: o.r });
}
function errBar(x, y, e) { inkLine(x, y - e, x, y + e, { w: 3.5 }); inkLine(x - 14, y - e, x + 14, y - e, { w: 3.5 }); inkLine(x - 14, y + e, x + 14, y + e, { w: 3.5 }); }

function stopwatch(x, y, r, t) {
  shape(rectPts(x - 10, y - r - 24, 20, 18), { fill: COL.mustard, smooth: false, w: 3 });
  shape(ellPts(x, y, r, r, 0, Math.PI * 2, 24), { fill: COL.white, w: 4.5 });
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; inkLine(x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9, { w: 2.5 }); }
  const a = -Math.PI / 2 + t * 2.4;
  inkLine(x, y, x + Math.cos(a) * r * .72, y + Math.sin(a) * r * .72, { w: 4, color: COL.red });
}
function beerGlass(x, y, s, fill = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const glass = [[-30, -110], [30, -110], [24, 0], [-24, 0]];
  const lvl = -100 * fill;
  fillShape([[-24 - 6 * fill, lvl], [24 + 6 * fill, lvl], [24, 0], [-24, 0]], COL.beer, { alpha: .92 });
  if (fill > .05) shape([[-31, lvl - 2], [-20, lvl - 18], [0, lvl - 22], [20, lvl - 18], [31, lvl - 2]], { fill: COL.foam, w: 3 });
  ink(glass, { closed: true, w: 4.5 });
  ctx.restore();
}
function barrel(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape([[-60, 0], [-70, -60], [-60, -120], [60, -120], [70, -60], [60, 0]], { fill: '#b07a3d', w: 4.5, pattern: 'hatch', patColor: '#5a3a18', sp: 18, ang: -1.57 });
  inkSmooth([[-68, -30], [0, -24], [68, -30]], { w: 5, color: COL.black }); inkSmooth([[-68, -90], [0, -96], [68, -90]], { w: 5, color: COL.black });
  ctx.restore();
}
function barley(x, y, s, sway = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(sway);
  inkSmooth([[0, 0], [4, -60], [0, -130]], { w: 3.5, color: COL.mustardD });
  for (let i = 0; i < 6; i++) {
    const yy = -80 - i * 10;
    shape(ellPts(-8, yy, 6, 10), { fill: COL.mustard, w: 2.2 }); shape(ellPts(8, yy - 4, 6, 10), { fill: COL.mustard, w: 2.2 });
    inkLine(-10, yy - 8, -18, yy - 26, { w: 1.5, color: COL.mustardD }); inkLine(10, yy - 12, 18, yy - 30, { w: 1.5, color: COL.mustardD });
  }
  ctx.restore();
}
function brewery(x, y, s, p = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const body = [[0, 0], [0, -330], [130, -400], [260, -330], [260, 0]];
  if (p > .2) fillShape(body, '#e6cfa6', { pattern: 'hatch', patColor: COL.red, sp: 26, ang: 0, ha: .35 });
  ink(body, { closed: true, w: 5, p });
  // chimney with smoke
  ink(rectPts(190, -440, 34, 90), { closed: true, w: 4, p });
  for (let i = 0; i < 3; i++) inkSmooth([[207, -450 - i * 40], [190 + i * 10, -470 - i * 40], [225 + i * 6, -490 - i * 40]], { w: 3, alpha: .6, p: clamp(p * 2 - 1 - i * .2) });
  // windows & door
  [[40, -260], [160, -260], [40, -150], [160, -150]].forEach(([wx, wy]) => shape(rectPts(wx, wy, 60, 70), { fill: COL.mustard, smooth: false, w: 3.5, alpha: p }));
  shape([[100, 0], [100, -90], [130, -110], [160, -90], [160, 0]], { fill: '#6b4422', w: 3.5, alpha: p });
  ctx.restore();
}
function paperSheet(x, y, w, h, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: '#fffdf6', smooth: false, w: 3.5 });
  for (let yy = -h / 2 + 50; yy < h / 2 - 20; yy += 40) inkLine(-w / 2 + 20, yy, w / 2 - 20, yy, { w: 1.5, alpha: .25, color: COL.blue });
  ctx.restore();
}
function pen(x, y, ang = -.6, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  shape([[0, 0], [14, -24], [14, -190], [-14, -190], [-14, -24]], { fill: COL.blue, smooth: false, w: 3.5 });
  shape(rectPts(-14, -190, 28, 30), { fill: COL.white, smooth: false, w: 3 });
  ctx.restore();
}
function flask(x, y, s, liquid = COL.green) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  fillShape([[-55, 0], [55, 0], [30, -50], [-30, -50]], liquid, { alpha: .7 });
  ink([[-14, -150], [-14, -90], [-60, 0], [60, 0], [14, -90], [14, -150]], { w: 4.5 });
  inkLine(-22, -150, 22, -150, { w: 4.5 });
  for (let i = 0; i < 3; i++) inkEll(-10 + i * 12, -70 - i * 22 - (T * 30 % 20), 5, 5, { w: 2 });
  ctx.restore();
}
function beaker(x, y, s, val, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const lvl = -60;
  fillShape([[-34, lvl], [34, lvl], [34, 0], [-34, 0]], o.liquid ?? COL.blueL, { alpha: .85 });
  ink([[-38, -110], [-34, -100], [-34, 0], [34, 0], [34, -110]], { w: 4 });
  txt(val, 0, -28, 34, { color: COL.black });
  ctx.restore();
}
function rankTag(x, y, n, k = 1, color = COL.mustard) {
  if (k <= 0) return;
  const s = back(k);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape(ellPts(0, 0, 30, 30, 0, Math.PI * 2, 20), { fill: color, w: 3.5 });
  txt(String(n), 0, 2, String(n).length > 1 ? 26 : 34, { color: COL.black });
  ctx.restore();
}
function gavel(x, y, ang, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  shape(rectPts(-6, -10, 12, 130), { fill: '#8a5a2b', smooth: false, w: 3.5 });
  shape(rectPts(-45, -40, 90, 36), { fill: '#6b4422', smooth: false, w: 4 });
  ctx.restore();
}
function bench(x, y, w, h) {
  shape(rectPts(x - w / 2, y, w, h), { fill: '#a8743e', smooth: false, w: 5, pattern: 'hatch', patColor: '#5a3a18', sp: 22, ang: 0 });
  inkLine(x - w / 2 - 10, y, x + w / 2 + 10, y, { w: 6 });
}
function scroll(x, y, w, h, k) {
  const hh = h * easeOut(k);
  shape(rectPts(x - w / 2, y, w, Math.max(4, hh)), { fill: '#fbf0d0', smooth: false, w: 4 });
  shape(ellPts(x - w / 2 - 6, y, 16, 16), { fill: '#e2c98c', w: 3.5 }); shape(ellPts(x + w / 2 + 6, y, 16, 16), { fill: '#e2c98c', w: 3.5 });
  shape(rectPts(x - w / 2 - 20, y + hh - 14, w + 40, 28), { fill: '#e2c98c', smooth: false, w: 3.5 });
}
function lamp(x, y, on) {
  if (on > 0) {
    ctx.save(); ctx.globalAlpha = ALPHA * .35 * on; ctx.fillStyle = COL.mustard;
    ctx.beginPath(); ctx.arc(x, y, 70 + 10 * Math.sin(T * 12), 0, 7); ctx.fill(); ctx.restore();
    sparkle(x, y, 95, on);
  }
  shape(ellPts(x, y, 38, 40, 0, Math.PI * 2, 20), { fill: on > 0 ? '#ffe27a' : COL.white, w: 4 });
  shape(rectPts(x - 18, y + 36, 36, 24), { fill: COL.gray, smooth: false, w: 3.5 });
}
function check(x, y, s = 1, k = 1) { ink([[x - 30 * s, y], [x - 8 * s, y + 24 * s], [x + 36 * s, y - 30 * s]], { w: 8, color: COL.green, p: k }); }
function cross(x, y, s = 1, k = 1) { inkLine(x - 26 * s, y - 26 * s, x + 26 * s, y + 26 * s, { w: 8, color: COL.red, p: k }); if (k > .5) inkLine(x + 26 * s, y - 26 * s, x - 26 * s, y + 26 * s, { w: 8, color: COL.red, p: (k - .5) * 2 }); }
function mini(x, y, s, color, pattern) { // tiny stick athlete for group scenes
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shape([[-18, -40], [18, -40], [22, 0], [-22, 0]], { fill: color, pattern, patColor: COL.pink, sp: 8, r: 2.2, w: 3, smooth: false });
  inkLine(-10, 0, -14, 40, { w: 5 }); inkLine(10, 0, 14, 40, { w: 5 });
  shape(ellPts(0, -64, 22, 22, 0, Math.PI * 2, 16), { fill: COL.skin, w: 3.5 });
  ctx.save(); ctx.fillStyle = INK; ctx.globalAlpha = ALPHA; ctx.beginPath(); ctx.arc(-7, -64, 3, 0, 7); ctx.arc(7, -64, 3, 0, 7); ctx.fill(); ctx.restore();
  ctx.restore();
}
