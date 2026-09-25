// Scene kit: Najma's Material shapes and star, simple props and the SVG document wrapper.
// The shapes follow tools/shapes.py so the artwork matches the site's clip-path shapes.
const f1 = v => { const r = Math.round(v * 10) / 10; return Object.is(r, -0) ? '0' : String(r); };

// ---- Brand shapes (ported from tools/shapes.py) ----
const norm = (x, y) => { const d = Math.hypot(x, y); return d ? [x / d, y / d] : [0, 0]; };
function roundedPolygon(verts, radii, steps = 10) {
  const out = []; const k = verts.length;
  verts.forEach(([px, py], i) => {
    const [ax, ay] = verts[(i - 1 + k) % k], [bx, by] = verts[(i + 1) % k];
    const [ux, uy] = norm(ax - px, ay - py), [vx, vy] = norm(bx - px, by - py);
    const theta = Math.acos(Math.max(-1, Math.min(1, ux * vx + uy * vy)));
    let r = radii[i];
    if (r <= 0 || theta < 1e-6) { out.push([px, py]); return; }
    let t = r / Math.tan(theta / 2);
    const lim = 0.5 * Math.min(Math.hypot(ax - px, ay - py), Math.hypot(bx - px, by - py));
    if (t > lim) { t = lim; r = t * Math.tan(theta / 2); }
    const t1 = [px + ux * t, py + uy * t], t2 = [px + vx * t, py + vy * t];
    const [bsx, bsy] = norm(ux + vx, uy + vy); const h = r / Math.sin(theta / 2);
    const cx = px + bsx * h, cy = py + bsy * h;
    const a1 = Math.atan2(t1[1] - cy, t1[0] - cx), a2 = Math.atan2(t2[1] - cy, t2[0] - cx);
    let da = ((a2 - a1 + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    for (let s = 0; s <= steps; s++) { const a = a1 + da * s / steps; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  });
  return out;
}
function starPts(points, inner, ro, ri = ro, rot = 0) {
  const v = [], r = [];
  for (let i = 0; i < points * 2; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / points; const rad = i % 2 ? inner : 1; v.push([rad * Math.cos(a), rad * Math.sin(a)]); r.push(i % 2 ? ri : ro); }
  return roundedPolygon(v, r);
}
function lobedPts(n, depth, power, rot = 0, N = 240) {
  const pts = [];
  for (let i = 0; i < N; i++) { const a = i * 2 * Math.PI / N; const g = (1 + Math.cos(n * (a - rot))) / 2; const r = 1 - depth * (1 - Math.pow(g, power)); pts.push([r * Math.sin(a), -r * Math.cos(a)]); }
  return pts;
}
const SHAPES = {
  sunny: () => starPts(8, 0.78, 0.25, 0.30),
  verysunny: () => starPts(8, 0.66, 0.20, 0.20),
  star: () => starPts(8, 0.60, 0.11, 0.04),
  cookie4: () => lobedPts(4, 0.13, 0.55), cookie6: () => lobedPts(6, 0.11, 0.55), cookie9: () => lobedPts(9, 0.09, 0.55), cookie12: () => lobedPts(12, 0.075, 0.55),
  clover4: () => lobedPts(4, 0.46, 0.42), clover8: () => lobedPts(8, 0.30, 0.50),
  softburst: () => lobedPts(10, 0.16, 1.6), circle: () => lobedPts(1, 0, 1, 0, 120),
};
// Smooth closed path through points (Catmull-Rom -> cubic Bézier) for crisp, light output.
function smoothClosed(pts) {
  const n = pts.length; let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + 'Z';
}
export function shape(name, cx, cy, r, rot = 0, every = 3) {
  let pts = SHAPES[name]();
  const m = Math.max(...pts.map(([x, y]) => Math.hypot(x, y)));
  const c = Math.cos(rot * Math.PI / 180), s = Math.sin(rot * Math.PI / 180);
  pts = pts.filter((_, i) => i % every === 0).map(([x, y]) => [cx + (x * c - y * s) / m * r, cy + (x * s + y * c) / m * r]);
  return smoothClosed(pts);
}

// ---- Najma star (the logo's eight-pointed star, 48-unit box, centre 24,24) ----
const NAJMA_STAR = 'M22.45 11.17A1.74 1.74 0 0 1 25.55 11.17L27.39 14.74A0.63 0.63 0 0 0 28.15 15.06L31.98 13.83A1.74 1.74 0 0 1 34.17 16.02L32.94 19.85A0.63 0.63 0 0 0 33.26 20.61L36.83 22.45A1.74 1.74 0 0 1 36.83 25.55L33.26 27.39A0.63 0.63 0 0 0 32.94 28.15L34.17 31.98A1.74 1.74 0 0 1 31.98 34.17L28.15 32.94A0.63 0.63 0 0 0 27.39 33.26L25.55 36.83A1.74 1.74 0 0 1 22.45 36.83L20.61 33.26A0.63 0.63 0 0 0 19.85 32.94L16.02 34.17A1.74 1.74 0 0 1 13.83 31.98L15.06 28.15A0.63 0.63 0 0 0 14.74 27.39L11.17 25.55A1.74 1.74 0 0 1 11.17 22.45L14.74 20.61A0.63 0.63 0 0 0 15.06 19.85L13.83 16.02A1.74 1.74 0 0 1 16.02 13.83L19.85 15.06A0.63 0.63 0 0 0 20.61 14.74Z';
export function najmaStar(cx, cy, r, fill, extra = '') {
  const s = r / 13.3;
  const star = `<path d="${NAJMA_STAR}" transform="translate(${f1(cx - 24 * s)} ${f1(cy - 24 * s)}) scale(${+s.toFixed(4)})" fill="${fill}"/>`;
  return extra ? `<g${extra}>${star}</g>` : star;
}
// Four-point twinkle
export function twinkle(cx, cy, r, fill, extra = '') {
  const k = r * 0.22;
  return `<path d="M${f1(cx)} ${f1(cy - r)}Q${f1(cx + k)} ${f1(cy - k)} ${f1(cx + r)} ${f1(cy)}Q${f1(cx + k)} ${f1(cy + k)} ${f1(cx)} ${f1(cy + r)}Q${f1(cx - k)} ${f1(cy + k)} ${f1(cx - r)} ${f1(cy)}Q${f1(cx - k)} ${f1(cy - k)} ${f1(cx)} ${f1(cy - r)}Z" fill="${fill}"${extra}/>`;
}

// ---- Primitives ----
export const rr = (x, y, w, h, r) => `M${f1(x + r)} ${f1(y)}H${f1(x + w - r)}A${r} ${r} 0 0 1 ${f1(x + w)} ${f1(y + r)}V${f1(y + h - r)}A${r} ${r} 0 0 1 ${f1(x + w - r)} ${f1(y + h)}H${f1(x + r)}A${r} ${r} 0 0 1 ${f1(x)} ${f1(y + h - r)}V${f1(y + r)}A${r} ${r} 0 0 1 ${f1(x + r)} ${f1(y)}Z`;

// Speech bubble: rounded body with a soft tail. tail: {x, y} tip point, side 'b'|'t'|'l'|'r', at: fraction along side
export function bubble({ x, y, w, h, r = 18, fill, stroke, sw = 3.2, tail = { side: 'b', at: 0.25, len: 16, width: 18 }, lines = [], lineColor, extra = '', dots = false }) {
  const { side, at, len, width } = tail;
  let d;
  if (side === 'b') {
    const tx = x + w * at;
    d = `M${f1(x + r)} ${f1(y)}H${f1(x + w - r)}A${r} ${r} 0 0 1 ${f1(x + w)} ${f1(y + r)}V${f1(y + h - r)}A${r} ${r} 0 0 1 ${f1(x + w - r)} ${f1(y + h)}H${f1(tx + width / 2)}Q${f1(tx)} ${f1(y + h + len * 0.4)} ${f1(tx - width * 0.35)} ${f1(y + h + len)}Q${f1(tx - width * 0.25)} ${f1(y + h + len * 0.35)} ${f1(tx - width / 2)} ${f1(y + h)}H${f1(x + r)}A${r} ${r} 0 0 1 ${f1(x)} ${f1(y + h - r)}V${f1(y + r)}A${r} ${r} 0 0 1 ${f1(x + r)} ${f1(y)}Z`;
  } else if (side === 'br') {
    const tx = x + w * at;
    d = `M${f1(x + r)} ${f1(y)}H${f1(x + w - r)}A${r} ${r} 0 0 1 ${f1(x + w)} ${f1(y + r)}V${f1(y + h - r)}A${r} ${r} 0 0 1 ${f1(x + w - r)} ${f1(y + h)}H${f1(tx + width / 2)}Q${f1(tx + width * 0.25)} ${f1(y + h + len * 0.35)} ${f1(tx + width * 0.35)} ${f1(y + h + len)}Q${f1(tx)} ${f1(y + h + len * 0.4)} ${f1(tx - width / 2)} ${f1(y + h)}H${f1(x + r)}A${r} ${r} 0 0 1 ${f1(x)} ${f1(y + h - r)}V${f1(y + r)}A${r} ${r} 0 0 1 ${f1(x + r)} ${f1(y)}Z`;
  }
  let out = `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  const lc = lineColor || stroke;
  lines.forEach((lw, i) => {
    const lh = Math.min(9, h / (lines.length * 2.4));
    const ly = y + h / 2 - (lines.length * lh * 2 - lh) / 2 + i * lh * 2;
    out += `<rect x="${f1(x + 18)}" y="${f1(ly)}" width="${f1((w - 36) * lw)}" height="${f1(lh)}" rx="${f1(lh / 2)}" fill="${lc}" class="line"/>`;
  });
  if (dots) { for (let i = 0; i < 3; i++) out += `<circle cx="${f1(x + w / 2 + (i - 1) * 14)}" cy="${f1(y + h / 2)}" r="4.2" fill="${lc}" class="dot d${i}"/>`; }
  return `<g${extra}>${out}</g>`;
}

export function doc({ w, h, title, desc, css = '', body, defs = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d"><title id="t">${title}</title><desc id="d">${desc}</desc>` +
    (defs ? `<defs>${defs}</defs>` : '') + (css ? `<style>${css}</style>` : '') + `${body}</svg>`;
}

export const f = f1;

// ---- Props (ink outline, flat fills; sizes in scene units) ----
const leafPath = (len, wid) => `M0 0 C ${f1(wid)} ${f1(-len * 0.3)}, ${f1(wid * 0.8)} ${f1(-len * 0.8)}, 0 ${f1(-len)} C ${f1(-wid * 0.8)} ${f1(-len * 0.8)}, ${f1(-wid)} ${f1(-len * 0.3)}, 0 0 Z`;
export function plant({ x, y, s = 1, ink, pot, rim, leaves, sw = 3.2, cls = '' }) {
  // x,y: bottom centre of the pot
  const L = [[-38, 64, 20, 0], [-14, 84, 22, 1], [10, 90, 22, 0], [32, 70, 20, 1], [52, 52, 16, 0]];
  const leafSvg = L.map(([ang, len, wid, k], i) => `<g transform="rotate(${ang})" class="leaf l${i}"><path d="${leafPath(len, wid)}" fill="${leaves[k % leaves.length]}" stroke="${ink}" stroke-width="${f1(sw / s)}" stroke-linejoin="round"/><path d="M0 -4 C 2 ${f1(-len * 0.4)}, 1 ${f1(-len * 0.7)}, 0 ${f1(-len * 0.86)}" fill="none" stroke="${ink}" stroke-width="${f1(sw * 0.7 / s)}" stroke-linecap="round"/></g>`).join('');
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})"${cls ? ` class="${cls}"` : ''}>
    <g transform="translate(0 -44)">${leafSvg}</g>
    <path d="M-26 -44 H26 L20 0 H-20 Z" fill="${pot}" stroke="${ink}" stroke-width="${f1(sw / s)}" stroke-linejoin="round"/>
    <rect x="-30" y="-52" width="60" height="12" rx="4" fill="${rim}" stroke="${ink}" stroke-width="${f1(sw / s)}"/>
  </g>`;
}
export function books({ x, y, ink, colors, sw = 3.2 }) {
  // x,y: bottom-left of the stack
  const sizes = [[92, 20, 0], [80, 18, 6], [88, 18, -2]];
  let out = '', yy = y;
  sizes.forEach(([w, h, dx], i) => {
    yy -= h;
    out += `<rect x="${f1(x + dx)}" y="${f1(yy)}" width="${w}" height="${h}" rx="4" fill="${colors[i % colors.length]}" stroke="${ink}" stroke-width="${sw}"/>` +
      `<path d="M${f1(x + dx + w - 16)} ${f1(yy + 4)} V${f1(yy + h - 4)}" stroke="${ink}" stroke-width="${f1(sw * 0.8)}" stroke-linecap="round"/>`;
  });
  return out;
}
export function mug({ x, y, ink, fill, sw = 3.2, steam = true, s = 1 }) {
  // x,y: top-left of the cup body
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <path d="M0 0 H44 V38 A13 13 0 0 1 31 51 H13 A13 13 0 0 1 0 38 Z" fill="${fill}" stroke="${ink}" stroke-width="${f1(sw / s)}" stroke-linejoin="round"/>
    <path d="M44 9 H49 A11 11 0 0 1 49 31 H44" fill="none" stroke="${ink}" stroke-width="${f1(sw / s)}"/>
    ${steam ? `<path d="M13 -10 C 7 -20, 21 -26, 15 -38" fill="none" stroke="${ink}" stroke-width="${f1(2.6 / s)}" stroke-linecap="round" class="steam s1"/><path d="M29 -8 C 23 -18, 37 -24, 31 -36" fill="none" stroke="${ink}" stroke-width="${f1(2.6 / s)}" stroke-linecap="round" class="steam s2"/>` : ''}
  </g>`;
}

// Video tile: a window with a clipped figure inside.
let clipN = 0;
export function videoTile({ x, y, w, h, r = 18, bg, deco = '', fig, ink, sw = 3.2, frame = '#ffffff', pad = 0, bar = false, extra = '' }) {
  const id = 'c' + (++clipN) + Math.random().toString(36).slice(2, 6);
  const top = bar ? 30 : 0;
  const sx = x + pad, sy = y + pad + top, swd = w - pad * 2, sh = h - pad * 2 - top;
  const outer = pad || bar ? `<path d="${rr(x, y, w, h, r)}" fill="${frame}" stroke="${ink}" stroke-width="${sw}"/>` : '';
  const dots = bar ? `<circle cx="${x + 18}" cy="${y + 16}" r="4.2" fill="${ink}" opacity=".85"/><circle cx="${x + 32}" cy="${y + 16}" r="4.2" fill="${ink}" opacity=".5"/><circle cx="${x + 46}" cy="${y + 16}" r="4.2" fill="${ink}" opacity=".25"/>` : '';
  const ir = pad || bar ? Math.max(8, r - 8) : r;
  return `<g${extra}>${outer}${dots}<clipPath id="${id}"><path d="${rr(sx, sy, swd, sh, ir)}"/></clipPath>` +
    `<g clip-path="url(#${id})"><rect x="${sx}" y="${sy}" width="${swd}" height="${sh}" fill="${bg}"/>${deco}${fig}</g>` +
    `<path d="${rr(sx, sy, swd, sh, ir)}" fill="none" stroke="${ink}" stroke-width="${f1(pad || bar ? sw * 0.8 : sw)}"/></g>`;
}
// Figure rising out of a shape: visible inside the shape, or anywhere above the line y = cut.
export function emerge({ d, cut, fig, W = 2000 }) {
  const id = 'e' + (++clipN) + Math.random().toString(36).slice(2, 6);
  return `<clipPath id="${id}"><path d="${d}"/><rect x="-${W}" y="-${W}" width="${W * 3}" height="${f1(cut + W)}"/></clipPath><g clip-path="url(#${id})">${fig}</g>`;
}
export function checkRow({ x, y, w, ink, fill, done = true, bar, sw = 3 }) {
  return `<g class="row"><circle cx="${f1(x + 13)}" cy="${f1(y)}" r="13" fill="${done ? fill : '#fff'}" stroke="${ink}" stroke-width="${sw}"/>` +
    (done ? `<path d="M${f1(x + 7)} ${f1(y)} l4.5 5 l8.5 -9.5" fill="none" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" class="tick"/>` : '') +
    `<rect x="${f1(x + 36)}" y="${f1(y - 5)}" width="${f1(w)}" height="10" rx="5" fill="${bar}" class="line"/></g>`;
}
// Arch window path: semicircular top, flat base.
export const arch = (x, y, w, h) => `M${f1(x)} ${f1(y + h)}V${f1(y + w / 2)}A${f1(w / 2)} ${f1(w / 2)} 0 0 1 ${f1(x + w)} ${f1(y + w / 2)}V${f1(y + h)}Z`;
export function clipTo(d, content) {
  const id = 'k' + Math.random().toString(36).slice(2, 8);
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${content}</g>`;
}
export function heart(cx, cy, s, fill, ink, sw = 3) {
  return `<path d="M${f1(cx)} ${f1(cy + 10 * s)}C${f1(cx - 16 * s)} ${f1(cy)} ${f1(cx - 14 * s)} ${f1(cy - 14 * s)} ${f1(cx - 6 * s)} ${f1(cy - 13 * s)}C${f1(cx - 2 * s)} ${f1(cy - 12.5 * s)} ${f1(cx)} ${f1(cy - 9 * s)} ${f1(cx)} ${f1(cy - 7 * s)}C${f1(cx)} ${f1(cy - 9 * s)} ${f1(cx + 2 * s)} ${f1(cy - 12.5 * s)} ${f1(cx + 6 * s)} ${f1(cy - 13 * s)}C${f1(cx + 14 * s)} ${f1(cy - 14 * s)} ${f1(cx + 16 * s)} ${f1(cy)} ${f1(cx)} ${f1(cy + 10 * s)}Z" fill="${fill}" stroke="${ink}" stroke-width="${sw}" stroke-linejoin="round"/>`;
}
