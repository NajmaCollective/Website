// Najma's closing-band artwork: five seamless loops drawn from the two brand
// shapes, the eight-pointed star and the twelve-lobed scallop.
//
// Every piece is a pure function of the loop phase t (0 ≤ t < 1), so frame 0
// and the frame after the last one are identical and the loop has no seam.
// Rotations are whole multiples of each shape's symmetry (45° for the star,
// 30° for the scallop) for the same reason.
//
// The four closing-band pieces are drawn on black: the site screens them onto
// the dark green band, so black takes on the band's colour and only the light
// shows. "voices" sits in a card grid on a light page, so it carries its own
// green ground.
import { SCALLOP_D, STAR_D, SCALLOP_R, STAR_R } from './shapes.js';

export const W = 1920;
export const H = 1080;
const TAU = Math.PI * 2;
const STAR = new Path2D(STAR_D);
const SCALLOP = new Path2D(SCALLOP_D);

// Colours from css/tokens.css: inverse-primary mint, primary-container, the
// secondary sage, the tertiary peach and the clay used in the fee bar.
const C = {
  mint: [176, 217, 189], mintLight: [214, 240, 222], sage: [201, 216, 180],
  peach: [255, 219, 201], clay: [217, 165, 140], green: [32, 62, 50],
  // A slightly stronger clay, so warm light stays warm once screened onto green.
  ember: [236, 158, 116],
};
const rgba = (c, a = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
const mix = (a, b, k) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
const smooth = x => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const wave = (t, cycles, phase) => .5 + .5 * Math.sin(TAU * t * cycles + phase);

function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let r = Math.imul(seed ^ seed >>> 15, 1 | seed);
    r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r;
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}

// Draws a brand shape centred on (x, y) with the given outer radius in pixels.
function shape(ctx, path, unitR, x, y, radius, rotation, style) {
  const s = radius / unitR;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(rotation); ctx.scale(s, s); ctx.translate(-24, -24);
  if (style.fill) {
    ctx.globalAlpha = style.fillAlpha ?? 1;
    ctx.fillStyle = typeof style.fill === 'function' ? style.fill(ctx) : style.fill;
    ctx.fill(path);
  }
  if (style.stroke) {
    ctx.globalAlpha = style.strokeAlpha ?? 1;
    ctx.strokeStyle = typeof style.stroke === 'function' ? style.stroke(ctx) : style.stroke;
    ctx.lineWidth = style.width / s; ctx.lineJoin = 'round';
    ctx.stroke(path);
  }
  ctx.restore();
}
const star = (ctx, ...a) => shape(ctx, STAR, STAR_R, ...a);
const scallop = (ctx, ...a) => shape(ctx, SCALLOP, SCALLOP_R, ...a);

/* 1. Constellation — the Solidarity Café. Najma means "star": a field of small
   stars drifts and glimmers around one large star, joined by faint lines. */
const field = (() => {
  const r = rng(11);
  const stars = Array.from({ length: 70 }, () => {
    const a = r() * TAU, d = Math.pow(r(), .75) * 820;
    return {
      x: 1180 + Math.cos(a) * d * 1.2, y: 540 + Math.sin(a) * d * .66,
      size: 5 + Math.pow(r(), 3.2) * 36, orbit: 5 + r() * 18, phase: r() * TAU,
      spin: r() < .5 ? -1 : 1, cycles: 1 + Math.floor(r() * 2), warm: r() < .3,
    };
  }).filter(s => Math.hypot(s.x - 1180, s.y - 540) > 210);
  const links = [];
  stars.forEach((s, i) => {
    stars.map((o, j) => [j, Math.hypot(o.x - s.x, o.y - s.y)])
      .filter(([j, d]) => j > i && d < 240).sort((a, b) => a[1] - b[1]).slice(0, 2)
      .forEach(([j]) => links.push([i, j]));
  });
  return { stars, links };
})();

function constellation(ctx, t) {
  const pos = s => [s.x + s.orbit * Math.cos(TAU * t + s.phase), s.y + s.orbit * .7 * Math.sin(TAU * t + s.phase)];
  const glow = s => .35 + .65 * wave(t, s.cycles, s.phase);
  ctx.lineWidth = 1.4;
  for (const [i, j] of field.links) {
    const a = field.stars[i], b = field.stars[j];
    const [ax, ay] = pos(a), [bx, by] = pos(b);
    ctx.strokeStyle = rgba(C.mint, .16 * glow(a) * glow(b));
    ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  }
  for (const s of field.stars) {
    const [x, y] = pos(s), g = glow(s), col = s.warm ? C.ember : C.mintLight;
    star(ctx, x, y, s.size, s.spin * TAU / 8 * t + s.phase, {
      fill: rgba(col), fillAlpha: .25 + .6 * g,
      ...(s.size > 18 ? { stroke: rgba(col), strokeAlpha: .8 * g, width: 1.6 } : {}),
    });
  }
  scallop(ctx, 1180, 540, 250, TAU / 12 * t, { stroke: rgba(C.sage), strokeAlpha: .32, width: 2 });
  star(ctx, 1180, 540, 168, TAU / 8 * t, {
    fill: c => { const g = c.createRadialGradient(24, 24, 0, 24, 24, STAR_R); g.addColorStop(0, rgba(C.mint, .55)); g.addColorStop(1, rgba(C.mint, .06)); return g; },
    stroke: rgba(C.mintLight), width: 3,
  });
  star(ctx, 1180, 540, 66, -TAU / 8 * t + TAU / 16, { fill: rgba(C.peach), fillAlpha: .5 + .4 * wave(t, 2, 0), stroke: rgba(C.peach), width: 2 });
}

/* 2. Rhythm — Teachers. Scalloped rings travel outward from a small star like
   a steady pulse; each ring turns a little as it widens. */
function rhythm(ctx, t) {
  const cx = 1240, cy = 560, gap = 62;
  for (let i = 0; i < 30; i++) {
    const r = (i + 2 * t) * gap;         // two gaps per loop keeps each ring's colour
    const a = smooth(r / (gap * 1.6)) * Math.exp(-r / 600);
    if (a < .01) continue;
    scallop(ctx, cx, cy, r, r * .0042, {
      stroke: rgba(i % 2 ? C.ember : C.mint), strokeAlpha: .95 * a, width: 2.2 + r * .0018,
    });
  }
  const p = wave(t, 2, -Math.PI / 2);
  star(ctx, cx, cy, 44 + 6 * p, TAU / 8 * t, { fill: rgba(C.peach), fillAlpha: .7 + .3 * p });
}

/* 3. Unfolding — About. Nested stars turn against each other, so the figure
   opens out from its centre and folds back again. */
function unfolding(ctx, t) {
  const cx = 1180, cy = 540;
  for (let k = 9; k >= 0; k--) {
    const breathe = 1 + .08 * Math.sin(TAU * t - k * .75);
    const r = 46 * Math.pow(1.3, k) * breathe;
    const dir = k % 2 ? 1 : -1;
    const col = mix(C.mint, C.ember, k / 9);
    star(ctx, cx, cy, r, dir * TAU / 8 * t + k * TAU / 16, {
      fill: rgba(col), fillAlpha: .05,
      stroke: rgba(col), strokeAlpha: Math.max(.12, 1 - k / 10), width: 2.4,
    });
  }
  star(ctx, cx, cy, 30, TAU / 8 * t, { fill: rgba(C.peach) });
}

/* 4. Woven — For organisations. Two large stars turn in opposite directions
   inside a scallop; where their outlines cross, the light gathers, and a warm
   glow travels round the figure once a loop. */
function woven(ctx, t) {
  const cx = 1180, cy = 560;
  const sweep = (col, rotation) => c => {
    const g = c.createConicGradient(TAU * t - rotation - Math.PI / 2, 24, 24);
    [[0, 1], [.2, .35], [.5, .18], [.8, .35], [1, 1]].forEach(([o, a]) => g.addColorStop(o, rgba(col, a)));
    return g;
  };
  const ra = TAU / 8 * t, rb = -TAU / 8 * t + TAU / 16;
  scallop(ctx, cx, cy, 330, TAU / 12 * t, { stroke: rgba(C.sage), strokeAlpha: .4, width: 2 });
  star(ctx, cx, cy, 440, ra, { fill: rgba(C.mint), fillAlpha: .05, stroke: sweep(C.mint, ra), width: 3.2 });
  star(ctx, cx, cy, 440, rb, { fill: rgba(C.ember), fillAlpha: .05, stroke: sweep(C.ember, rb), width: 3.2 });
  star(ctx, cx, cy, 210, -ra, { stroke: rgba(C.clay), strokeAlpha: .55, width: 2 });
  star(ctx, cx, cy, 64, ra, { fill: rgba(C.peach), fillAlpha: .85 });
}

/* 5. Voices — the organisations card grid. Translucent stars of different
   sizes and colours move on their own paths and keep meeting and overlapping. */
const voices = (() => {
  const r = rng(5);
  const cols = [C.mint, C.ember, C.sage, C.clay, C.mintLight];
  return Array.from({ length: 13 }, (_, i) => {
    const a = i / 13 * TAU + r() * .4, d = 170 + r() * 330;
    return {
      x: 960 + Math.cos(a) * d * 1.25, y: 540 + Math.sin(a) * d * .85,
      size: 60 + Math.pow(r(), 1.6) * 170, ax: 40 + r() * 120, ay: 30 + r() * 90,
      fx: 1 + Math.floor(r() * 2), fy: 1 + Math.floor(r() * 2), px: r() * TAU, py: r() * TAU,
      spin: (r() < .5 ? -1 : 1) * (1 + Math.floor(r() * 2)), phase: r() * TAU, col: cols[i % cols.length],
    };
  });
})();

function voicesArt(ctx, t) {
  for (const v of voices) {
    star(ctx, v.x + v.ax * Math.sin(TAU * t * v.fx + v.px), v.y + v.ay * Math.sin(TAU * t * v.fy + v.py), v.size,
      v.spin * TAU / 8 * t + v.phase, { fill: rgba(v.col), fillAlpha: .2, stroke: rgba(v.col), strokeAlpha: .7, width: 2.4 });
  }
}

const voicesGround = ctx => {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#1b352a'); g.addColorStop(1, '#2b5141');
  return g;
};

export const PIECES = {
  constellation: { draw: constellation, title: 'Constellation' },
  rhythm: { draw: rhythm, title: 'Rhythm' },
  unfolding: { draw: unfolding, title: 'Unfolding' },
  woven: { draw: woven, title: 'Woven' },
  voices: { draw: voicesArt, title: 'Voices', ground: voicesGround, blend: 'screen' },
};

// Draws the scene, then adds two blurred copies of it so the lines glow.
export function render(canvas, name, t) {
  const piece = PIECES[name];
  const ctx = canvas.getContext('2d');
  const scene = render.scene ??= Object.assign(document.createElement('canvas'), { width: W, height: H });
  const s = scene.getContext('2d');
  s.setTransform(1, 0, 0, 1, 0, 0); s.globalCompositeOperation = 'source-over'; s.globalAlpha = 1;
  s.clearRect(0, 0, W, H);
  // Overlaps add up as light; Voices screens instead, so many overlaps never burn out to white.
  s.globalCompositeOperation = piece.blend ?? 'lighter';
  piece.draw(s, t);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = piece.ground ? piece.ground(ctx) : '#000'; ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'lighter';
  ctx.filter = 'blur(30px)'; ctx.globalAlpha = .5; ctx.drawImage(scene, 0, 0);
  ctx.filter = 'blur(8px)'; ctx.globalAlpha = .6; ctx.drawImage(scene, 0, 0);
  ctx.filter = 'none'; ctx.globalAlpha = 1; ctx.drawImage(scene, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
}
