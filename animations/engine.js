// 手繪原子筆動畫引擎：紙張、抖動線條、填色、文字、字幕
const W = 1920, H = 1080, FPS = 30, BOIL_RATE = 8;
const INK = '#1e2754';
const COL = {
  ink: INK, black: '#1b1a22', paper: '#f4ead3', mustard: '#e9b23e', mustardD: '#c8901f',
  pink: '#de3f8f', pinkL: '#f7c6dc', skin: '#fff6ea', white: '#fffbf3', blue: '#3d62b8',
  blueL: '#c9d7f2', red: '#cf4436', green: '#3e8d5b', greenL: '#cfe8d3', gray: '#9a958a',
  amber: '#b5651d', beer: '#2a1810', foam: '#fbf3dc'
};
const FONT = '"Iansui", "LXGW WenKai TC", "WenQuanYi Zen Hei", sans-serif';

let ctx, BOIL = 0, T = 0, SEED = 1, ALPHA = 1, RLT = 0; // RLT: real (unstretched) scene time for idle motion

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => { k = clamp(k); return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; };
const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
const back = k => { k = clamp(k); const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
// 0→1 progress of an event that starts at a and lasts d seconds
const prog = (t, a, d) => clamp((t - a) / d);

function hash3(a, b, c) {
  let h = Math.imul((a | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul((b | 0) + 0x632be5ab, 0xc2b2ae35) ^ Math.imul((c | 0) + 0x27d4eb2f, 0x165667b1);
  h ^= h >>> 15; h = Math.imul(h, 0x2c1b3c6d); h ^= h >>> 12; h = Math.imul(h, 0x297a2d39); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
const rnd = (a, b = 0) => hash3(a, b, 99991);
// smooth 1D value noise that re-rolls on every boil tick
function vnoise(seed, x) {
  const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  return lerp(hash3(seed, i, BOIL) * 2 - 1, hash3(seed, i + 1, BOIL) * 2 - 1, u);
}

// ---------- geometry helpers ----------
function resample(pts, step, closed) {
  const src = closed ? pts.concat([pts[0]]) : pts;
  const out = [src[0]];
  let carry = 0;
  for (let i = 1; i < src.length; i++) {
    const [x0, y0] = src[i - 1], [x1, y1] = src[i];
    const L = Math.hypot(x1 - x0, y1 - y0);
    let d = step - carry;
    while (d <= L) { const k = d / L; out.push([lerp(x0, x1, k), lerp(y0, y1, k)]); d += step; }
    carry = L - (d - step);
  }
  const last = src[src.length - 1];
  if (out.length < 2 || Math.hypot(out[out.length - 1][0] - last[0], out[out.length - 1][1] - last[1]) > 0.5) out.push(last);
  return out;
}
function catmull(pts, closed = false, seg = 8) {
  const n = pts.length, out = [];
  if (n < 3) return pts.slice();
  const g = i => closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
  const lim = closed ? n : n - 1;
  for (let i = 0; i < lim; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    for (let s = 0; s < seg; s++) {
      const t = s / seg, t2 = t * t, t3 = t2 * t;
      out.push([
        .5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        .5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      ]);
    }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}
function ellPts(cx, cy, rx, ry, a0 = 0, a1 = Math.PI * 2, n = 36) {
  const o = [];
  for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); o.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return o;
}
function rectPts(x, y, w, h) { return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
function roundRectPts(x, y, w, h, r) {
  const o = [];
  const arc = (cx, cy, a0) => { for (let i = 0; i <= 4; i++) { const a = a0 + i / 4 * Math.PI / 2; o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
  arc(x + w - r, y + r, -Math.PI / 2); arc(x + w - r, y + h - r, 0); arc(x + r, y + h - r, Math.PI / 2); arc(x + r, y + r, Math.PI);
  return o;
}
// thick limb outline around a polyline, widths tapering w0→w1
function limbPoly(pts, w0, w1) {
  const sm = catmull(pts, false, 6), L = [], R = [];
  for (let i = 0; i < sm.length; i++) {
    const a = sm[Math.max(0, i - 1)], b = sm[Math.min(sm.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const w = lerp(w0, w1, i / (sm.length - 1)) / 2;
    L.push([sm[i][0] + nx * w, sm[i][1] + ny * w]); R.push([sm[i][0] - nx * w, sm[i][1] - ny * w]);
  }
  return L.concat(R.reverse());
}

// ---------- ink primitives ----------
function jitterPts(pts, amp, seed, freq = .09) {
  return pts.map((p, i) => [p[0] + amp * vnoise(seed, i * freq), p[1] + amp * vnoise(seed + 7919, i * freq)]);
}
function tracePath(jp, closed) {
  ctx.beginPath();
  ctx.moveTo(jp[0][0], jp[0][1]);
  for (let i = 1; i < jp.length - 1; i++) {
    const mx = (jp[i][0] + jp[i + 1][0]) / 2, my = (jp[i][1] + jp[i + 1][1]) / 2;
    ctx.quadraticCurveTo(jp[i][0], jp[i][1], mx, my);
  }
  ctx.lineTo(jp[jp.length - 1][0], jp[jp.length - 1][1]);
  if (closed) ctx.closePath();
}
// main ballpoint stroke. o: w, color, amp, p (draw-on progress), closed, alpha, seed
function ink(pts, o = {}) {
  const seed = o.seed ?? (SEED++ * 31);
  const p = o.p ?? 1;
  if (p <= 0 || pts.length < 2) return;
  const w = o.w ?? 4, amp = o.amp ?? 2.0;
  let rs = resample(pts, 5, !!o.closed);
  if (o.closed) { // overshoot past the start like a real pen
    const extra = Math.max(2, Math.floor(rs.length * .05));
    rs = rs.concat(rs.slice(1, extra));
  }
  const m = Math.max(2, Math.ceil(rs.length * p));
  const jp = jitterPts(rs.slice(0, m), amp, seed);
  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = o.color ?? INK;
  ctx.globalAlpha = ALPHA * (o.alpha ?? .94);
  ctx.lineWidth = w;
  tracePath(jp, false); ctx.stroke();
  // second faint pass = ballpoint ink skipping / double line
  ctx.globalAlpha = ALPHA * (o.alpha ?? .94) * .32;
  ctx.lineWidth = Math.max(1, w * .45);
  ctx.translate(1.1 * vnoise(seed + 3, 1), 1.1 * vnoise(seed + 5, 2));
  tracePath(jp, false); ctx.stroke();
  ctx.restore();
}
function inkSmooth(pts, o = {}) { ink(catmull(pts, !!o.closed, 8), o); }
function inkLine(x0, y0, x1, y1, o = {}) { ink([[x0, y0], [x1, y1]], o); }
function inkEll(cx, cy, rx, ry, o = {}) { ink(ellPts(cx, cy, rx, ry, -1.9, -1.9 + Math.PI * 2, 40), { ...o, closed: true }); }

// fill a closed shape with flat color + optional pattern; outline drawn separately
function fillShape(pts, color, o = {}) {
  const seed = o.seed ?? (SEED++ * 31);
  const amp = (o.amp ?? 2) * .6;
  const jp = jitterPts(resample(pts, 8, true), amp, seed + 11);
  ctx.save();
  ctx.globalAlpha = ALPHA * (o.alpha ?? 1);
  tracePath(jp, true);
  ctx.fillStyle = color; ctx.fill();
  if (o.pattern) {
    ctx.clip();
    const xs = jp.map(p => p[0]), ys = jp.map(p => p[1]);
    const x0 = Math.min(...xs) - 20, x1 = Math.max(...xs) + 20, y0 = Math.min(...ys) - 20, y1 = Math.max(...ys) + 20;
    if (o.pattern === 'dots') {
      const sp = o.sp ?? 13, r = o.r ?? 3;
      ctx.fillStyle = o.patColor ?? COL.white;
      const ox = (hash3(seed, BOIL, 1) - .5) * 1.5, oy = (hash3(seed, BOIL, 2) - .5) * 1.5;
      let row = 0;
      for (let y = y0; y < y1; y += sp * .87, row++) {
        for (let x = x0 + (row % 2) * sp / 2; x < x1; x += sp) {
          ctx.beginPath(); ctx.arc(x + ox, y + oy, r, 0, 7); ctx.fill();
        }
      }
    } else if (o.pattern === 'hatch') {
      const sp = o.sp ?? 10, ang = o.ang ?? -0.8;
      const ca = Math.cos(ang), sa = Math.sin(ang), R = Math.hypot(x1 - x0, y1 - y0);
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      for (let d = -R / 2, i = 0; d < R / 2; d += sp, i++) {
        const px = cx - sa * d, py = cy + ca * d;
        ink([[px - ca * R / 2, py - sa * R / 2], [px + ca * R / 2, py + sa * R / 2]], { w: o.hw ?? 1.6, amp: 1.2, alpha: o.ha ?? .55, color: o.patColor ?? INK, seed: seed + i * 7 });
      }
    }
  }
  ctx.restore();
}
// filled + outlined shape in one call
function shape(pts, o = {}) {
  const smooth = o.smooth !== false;
  const sp = smooth ? catmull(pts, true, 6) : pts;
  if (o.fill) fillShape(sp, o.fill, o);
  if (o.stroke !== false) ink(sp, { ...o, closed: true, seed: undefined });
}

// ---------- text ----------
function setFont(size, weight = 700) { ctx.font = `${weight} ${size}px ${FONT}`; }
function txt(s, x, y, size, o = {}) {
  const seed = SEED++ * 31;
  ctx.save();
  setFont(size, o.weight ?? 700);
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const full = ctx.measureText(s).width;
  const chars = [...s];
  const p = o.p ?? 1;
  const shown = chars.slice(0, Math.ceil(chars.length * p)).join('');
  if (!shown) { ctx.restore(); return full; }
  let sx = x;
  if ((o.align ?? 'center') === 'center') sx = x - full / 2; else if (o.align === 'right') sx = x - full;
  const j = o.jit ?? 1;
  ctx.translate(sx + (hash3(seed, BOIL, 1) - .5) * 2 * j, y + (hash3(seed, BOIL, 2) - .5) * 2 * j);
  ctx.rotate((o.rot ?? 0) + (hash3(seed, BOIL, 3) - .5) * .012 * j);
  ctx.globalAlpha = ALPHA * (o.alpha ?? 1);
  ctx.fillStyle = o.color ?? INK;
  ctx.fillText(shown, 0, 0);
  ctx.restore();
  return full;
}
function measure(s, size, weight = 700) { ctx.save(); setFont(size, weight); const w = ctx.measureText(s).width; ctx.restore(); return w; }
function wrapText(s, size, maxW) {
  const total = measure(s, size);
  if (total <= maxW) return [s];
  // balanced lines; keep numbers / Latin words whole; never start a line with closing punctuation
  const tokens = s.match(/[A-Za-z0-9.,%]+|./gu);
  const n = Math.ceil(total / maxW), target = total / n + size * .5;
  const closing = '。，、）」』？！：；…,.)';
  const lines = []; let cur = '';
  for (const tk of tokens) {
    if (cur && measure(cur + tk, size) > target && lines.length < n - 1 && !closing.includes(tk[0])) { lines.push(cur); cur = tk.trim() ? tk : ''; }
    else cur += tk;
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- paper ----------
let PAPERS = [];
function makePaper(seed) {
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = COL.paper; g.fillRect(0, 0, W, H);
  // faint ruled notebook lines + margin
  g.strokeStyle = 'rgba(80,110,170,.13)'; g.lineWidth = 2;
  for (let y = 70; y < H; y += 58) { g.beginPath(); g.moveTo(0, y + rnd(seed, y) * 2); g.lineTo(W, y + rnd(seed, y + 1) * 2); g.stroke(); }
  g.strokeStyle = 'rgba(200,70,70,.14)'; g.beginPath(); g.moveTo(118, 0); g.lineTo(121, H); g.stroke();
  // fibers
  for (let i = 0; i < 900; i++) {
    const x = rnd(seed, i) * W, y = rnd(seed, i + 5e4) * H, a = rnd(seed, i + 9e4) * 6.28, l = 6 + rnd(seed, i + 7e4) * 22;
    g.strokeStyle = `rgba(120,95,50,${.05 + rnd(seed, i + 3e4) * .07})`; g.lineWidth = .8;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * .5 + 3, y + Math.sin(a) * l * .5 - 3, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  // grain
  const id = g.getImageData(0, 0, W, H), d = id.data;
  let s = seed * 9301 + 49297;
  for (let i = 0; i < d.length; i += 4) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const n = ((s >> 8) % 23) - 11;
    d[i] += n; d[i + 1] += n; d[i + 2] += n * .8;
  }
  g.putImageData(id, 0, 0);
  // vignette
  const vg = g.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(90,60,20,.22)');
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  return c;
}
function drawPaper() {
  if (!PAPERS.length) PAPERS = [makePaper(11), makePaper(23), makePaper(37)];
  const p = PAPERS[BOIL % 3];
  ctx.globalAlpha = 1;
  ctx.drawImage(p, 0, 0);
}

// ---------- UI: tape label, subtitle, source card ----------
function tape(x, y, w, h, color, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const pts = [[0, 0], [w, 2], [w - 4, h], [3, h - 2]];
  fillShape(pts, color, { alpha: .9, amp: 1.5 });
  ctx.restore();
}
function episodeTag(label) {
  ctx.save();
  tape(36, 30, measure(label, 34) + 60, 62, COL.mustard, -.012);
  txt(label, 66, 62, 34, { align: 'left', color: COL.black });
  ctx.restore();
}
function subtitle(s, lt, dur) {
  const k = ease(lt / .3) * (1 - ease((lt - dur + .15) / .15));
  if (k <= 0) return;
  const size = 50, maxW = 1640;
  const lines = wrapText(s, size, maxW);
  const lh = 64, h = lines.length * lh + 34;
  const w = Math.max(...lines.map(l => measure(l, size))) + 90;
  const cy = 990 - (lines.length - 1) * lh / 2;
  const prevA = ALPHA; ALPHA *= k;
  ctx.save(); ctx.translate(W / 2, cy + (1 - k) * 20);
  shape(rectPts(-w / 2, -h / 2, w, h), { fill: COL.white, smooth: false, w: 3.5, amp: 1.6, alpha: .95 });
  lines.forEach((l, i) => txt(l, 0, -((lines.length - 1) * lh) / 2 + i * lh + 2, size, { color: COL.black, p: clamp(lt / .5) }));
  ctx.restore();
  ALPHA = prevA;
}
function sourceCard(lines, k) {
  if (k <= 0) return;
  const size = 25, lh = 34;
  const w = Math.max(...lines.map(l => measure(l, size, 400))) + 50, h = lines.length * lh + 30;
  const prevA = ALPHA; ALPHA *= k;
  ctx.save(); ctx.translate(W - 60 - w, 868 - h + (1 - k) * 15); ctx.rotate(-.008);
  shape(rectPts(0, 0, w, h), { fill: '#fff8e2', smooth: false, w: 2.5, amp: 1.2 });
  tape(w / 2 - 40, -14, 80, 26, COL.pinkL, .05);
  lines.forEach((l, i) => txt(l, 25, 30 + i * lh, size, { align: 'left', weight: i === 0 ? 700 : 400, color: INK, jit: .5 }));
  ctx.restore();
  ALPHA = prevA;
}

// ---------- arrows & misc marks ----------
function arrow(x0, y0, x1, y1, o = {}) {
  const mid = [(x0 + x1) / 2 + (o.bend ?? 0) * -(y1 - y0) * .2, (y0 + y1) / 2 + (o.bend ?? 0) * (x1 - x0) * .2];
  const pts = catmull([[x0, y0], mid, [x1, y1]], false, 10);
  ink(pts, o);
  if ((o.p ?? 1) < .95) return;
  const a = Math.atan2(y1 - pts[pts.length - 3][1], x1 - pts[pts.length - 3][0]), L = o.head ?? 22;
  ink([[x1 - Math.cos(a - .45) * L, y1 - Math.sin(a - .45) * L], [x1, y1], [x1 - Math.cos(a + .45) * L, y1 - Math.sin(a + .45) * L]], { ...o, p: 1 });
}
function sparkle(x, y, r, k = 1) {
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + .3;
    inkLine(x + Math.cos(a) * r * .55, y + Math.sin(a) * r * .55, x + Math.cos(a) * r * (0.55 + .45 * k), y + Math.sin(a) * r * (0.55 + .45 * k), { w: 3.5, color: COL.mustardD });
  }
}
function underline(x0, x1, y, o = {}) { ink([[x0, y], [(x0 + x1) / 2, y + 3], [x1, y - 2]], { w: 5, ...o }); }
