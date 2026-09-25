// Figure builder: composes Open Peeps pieces (CC0, Pablo Stanley) and colours them.
// Each pose's white fill is split into skin, garment, prop and shoe regions using the
// traced shapes in data/regions.json, so a figure can wear the Najma palette while
// keeping the original hand-drawn linework on top.
import { readFileSync, existsSync } from 'node:fs';
import { exportParts } from '../export-parts.mjs';
const data = new URL('../data/', import.meta.url);
if (!existsSync(new URL('parts.json', data))) exportParts(new URL('parts.json', data));
const parts = JSON.parse(readFileSync(new URL('parts.json', data)));
const regions = JSON.parse(readFileSync(new URL('regions.json', data)));
const boxes = JSON.parse(readFileSync(new URL('bbox.json', data)));

const num = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
const translate = t => { const m = (t || '').match(num); return m ? [+m[0], +(m[1] || 0)] : [0, 0]; };

// Round every coordinate to one decimal: plenty for artwork drawn at ~0.3 scale.
export const round = d => d.replace(num, v => { const r = Math.round(+v * 10) / 10; return Object.is(r, -0) ? '0' : String(r); });

function subpaths(d) { return d.split(/(?=M)/).filter(Boolean); }
function bboxOf(sp, dx, dy) {
  const n = (sp.match(num) || []).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) { const x = n[i] + dx, y = n[i + 1] + dy; x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return [x0, y0, x1, y1];
}
const inside = (b, r) => b[0] >= r[0] && b[1] >= r[1] && b[2] <= r[2] && b[3] <= r[3];

// Render one piece's paths of a given role with an explicit colour, applying translate transforms.
function pieceRole(piece, role, fill, drop = []) {
  const [ox, oy] = translate(piece.outer);
  return piece.paths.filter(p => p.role === role).map(p => {
    const [px, py] = translate(p.transform);
    let d = p.d;
    if (drop.length) d = subpaths(d).filter(sp => !drop.some(r => inside(bboxOf(sp, ox + px, oy + py), r))).join('');
    const t = (ox + px || oy + py) ? ` transform="translate(${+(ox + px).toFixed(2)} ${+(oy + py).toFixed(2)})"` : '';
    return `<path d="${round(d)}"${t} fill="${fill}"${p.fillRule ? ` fill-rule="${p.fillRule}"` : ''}/>`;
  }).join('');
}

// Ink pieces laid out as react-peeps does: the head at (225, 0), features offset inside it.
const HEAD = { hair: [0, 0], face: [159, 186], facialHair: [123, 338], accessories: [47, 241] };

export function figureBox(pose, hair) {
  const a = boxes['pose/' + pose], b = boxes['hair/' + (hair || 'Short')];
  const x0 = Math.min(a[0], b[0]), y0 = Math.min(a[1], b[1]);
  const x1 = Math.max(a[0] + a[2], b[0] + b[2]), y1 = Math.max(a[1] + a[3], b[1] + b[3]);
  return [x0, y0, x1 - x0, y1 - y0];
}

export function placement(o) {
  if (o.place && 'height' in o.place) {
    const [bx, by, bw, bh] = figureBox(o.pose, o.hair);
    const s = o.place.height / bh, sx = o.flip ? -s : s;
    return { s, sx, tx: o.place.cx - (bx + bw / 2) * sx, ty: o.place.bottom - (by + bh) * s };
  }
  const { x = 0, y = 0, s = 1 } = o.place || {};
  return { s, sx: o.flip ? -s : s, tx: x, ty: y };
}
// Map a point in a figure's own coordinates into scene coordinates.
export function toScene(o, x, y) { const p = placement(o); return [p.tx + x * p.sx, p.ty + y * p.s]; }

/**
 * figure({ pose, hair, face, facialHair, accessory, c: colours, drop, place, flip, id, cls })
 * colours: ink, skin, cloth, cloth2, prop, shoe, sole, sock, chair, bodyInk (optional override for solid garments)
 * place: { cx, bottom, height } in scene units, or { x, y, s } raw.
 */
export function figure(o) {
  const c = { cloth2: o.c.cloth, prop: '#fffdf8', shoe: '#fffdf8', sole: o.c.ink, sock: o.c.skin, chair: '#e6e8df', ...o.c };
  const pose = parts.pose[o.pose];
  if (!pose) throw new Error('Unknown pose ' + o.pose);
  const reg = regions[o.pose] || {};
  let body = pieceRole(pose, 'bg', c.cloth);
  for (const role of ['cloth2', 'prop', 'chair', 'sock', 'shoe', 'sole', 'skin']) if (reg[role]) body += `<path d="${reg[role]}" fill="${c[role]}"/>`;
  body += pieceRole(pose, 'ink', c.bodyInk || c.ink, o.drop || []);
  let head = '';
  const add = (cat, key, bg) => {
    if (!key || key === 'None') return;
    const piece = parts[cat][key];
    if (!piece) throw new Error(`Unknown ${cat} ${key}`);
    const [hx, hy] = HEAD[cat];
    const inner = pieceRole(piece, 'bg', bg) + pieceRole(piece, 'ink', cat === 'hair' && c.hairInk ? c.hairInk : c.ink);
    head += (hx || hy) ? `<g transform="translate(${hx} ${hy})">${inner}</g>` : inner;
  };
  add('hair', o.hair || 'Short', c.skin);
  if (o.blush) head += `<g fill="${o.blush}" opacity=".55"><ellipse cx="${o.blushAt?.[0] ?? 185}" cy="${o.blushAt?.[1] ?? 415}" rx="34" ry="22"/><ellipse cx="${o.blushAt?.[2] ?? 395}" cy="${o.blushAt?.[3] ?? 405}" rx="34" ry="22"/></g>`;
  add('face', o.face || 'Smile', c.skin);
  add('facialHair', o.facialHair, c.skin);
  add('accessories', o.accessory, c.lens || c.skin);
  const inner = body + `<g transform="translate(225 0)">${head}</g>`;
  const { tx, ty, sx, s } = placement(o);
  const tr = `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${sx.toFixed(5)} ${s.toFixed(5)})`;
  return `<g${o.id ? ` id="${o.id}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}><g transform="${tr}">${inner}</g></g>`;
}
