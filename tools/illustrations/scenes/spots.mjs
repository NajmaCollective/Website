import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, bubble, rr, doc, f, emerge, checkRow, heart, books, mug } from '../lib/kit.mjs';
import { P, INK, SKIN } from '../lib/palette.mjs';

// Card spots: one person rising from a Material shape, with a prop that names the topic.
// Static artwork (no internal motion); the page adds a hover lift.
const W = 400, H = 240;
function spot({ title, desc, blob, fig, props = '', shapeName = 'cookie9', cx = 132, cy = 150, r = 92, height = 212 }) {
  const figSvg = figure({ ...fig, place: { cx, bottom: cy + r + 4, height } });
  const body = `<path d="${shape(shapeName, cx, cy, r + 22, 8)}" fill="${blob}"/>` +
    emerge({ d: shape('circle', cx, cy, r), cut: cy - 30, fig: figSvg }) + props;
  return doc({ w: W, h: H, title, desc, body });
}
const laptop = (x, y, s, lid, star) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="${rr(0, 0, 150, 96, 12)}" fill="${lid}" stroke="${INK}" stroke-width="${f(3.2 / s)}"/>
  <path d="${rr(10, 10, 130, 76, 6)}" fill="${P.paper}" stroke="${INK}" stroke-width="${f(2.4 / s)}"/>
  <path d="M-14 96 H164 L152 112 H-2 Z" fill="${P.sandDeep}" stroke="${INK}" stroke-width="${f(3.2 / s)}" stroke-linejoin="round"/>
  ${star}</g>`;
const megaphone = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-14)">
  <path d="M0 18 L64 -8 V76 L0 50 Z" fill="${P.clay}" stroke="${INK}" stroke-width="${f(3.2 / s)}" stroke-linejoin="round"/>
  <path d="${rr(-22, 16, 26, 36, 8)}" fill="${P.terracotta}" stroke="${INK}" stroke-width="${f(3.2 / s)}"/>
  <path d="M64 -8 C 80 12, 80 56, 64 76" fill="${P.peach}" stroke="${INK}" stroke-width="${f(3.2 / s)}"/>
  <path d="M10 50 L18 74 H34 L28 56" fill="${P.sand}" stroke="${INK}" stroke-width="${f(3 / s)}" stroke-linejoin="round"/>
  <path d="M92 10 L108 -2 M96 34 H116 M92 58 L108 70" stroke="${INK}" stroke-width="${f(3.2 / s)}" stroke-linecap="round"/></g>`;
const globe = (x, y, r) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="${P.mint}" stroke="${INK}" stroke-width="3.2"/>
  <ellipse cx="${x}" cy="${y}" rx="${r * 0.45}" ry="${r}" fill="none" stroke="${INK}" stroke-width="2.6"/>
  <path d="M${x - r} ${y} H${x + r} M${x - r * 0.86} ${y - r * 0.5} H${x + r * 0.86} M${x - r * 0.86} ${y + r * 0.5} H${x + r * 0.86}" stroke="${INK}" stroke-width="2.4"/></g>`;
const envelope = (x, y, w, h, fill) => `<g><path d="${rr(x, y, w, h, 10)}" fill="${fill}" stroke="${INK}" stroke-width="3.2"/>
  <path d="M${x + 6} ${y + 8} L${x + w / 2} ${y + h * 0.58} L${x + w - 6} ${y + 8}" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/></g>`;
const doc2 = (x, y, w, h, rot = 0) => `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><path d="${rr(x, y, w, h, 10)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.2"/>
  ${[0, 1, 2, 3].map(i => `<rect x="${x + 14}" y="${y + 18 + i * 16}" width="${(w - 28) * [0.9, 0.7, 0.85, 0.5][i]}" height="7" rx="3.5" fill="${i ? P.sageDeep : P.forest}"/>`).join('')}</g>`;
const board = (x, y, w, h) => `<g><path d="M${x + 20} ${y + h} L${x + 6} ${y + h + 44} M${x + w - 20} ${y + h} L${x + w - 6} ${y + h + 44}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <path d="${rr(x, y, w, h, 12)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.2"/>
  ${[[0.4, P.peachDeep], [0.62, P.mintDeep], [0.9, P.forest]].map(([k, c], i) => `<rect x="${x + 18 + i * 30}" y="${f(y + h - 14 - k * (h - 34))}" width="20" height="${f(k * (h - 34))}" rx="5" fill="${c}" stroke="${INK}" stroke-width="2.6"/>`).join('')}
  <path d="M${x + 14} ${y + h - 14} H${x + w - 14}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/></g>`;
const ring = (cx, cy, r, frac, col) => {
  const a = frac * 2 * Math.PI - Math.PI / 2, ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a);
  return `<g><circle cx="${cx}" cy="${cy}" r="${r + 12}" fill="${P.paper}" stroke="${INK}" stroke-width="3.2"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${P.sage}" stroke-width="9"/>
  <path d="M${cx} ${cy - r} A${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${f(ex)} ${f(ey)}" fill="none" stroke="${col}" stroke-width="9" stroke-linecap="round"/>
  <path d="M${cx} ${cy} L${f(cx + (r - 12) * Math.cos(a))} ${f(cy + (r - 12) * Math.sin(a))}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="4.5" fill="${INK}"/></g>`;
};
const cap = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 18 L46 0 L92 18 L46 36 Z" fill="${P.forest}" stroke="${INK}" stroke-width="${f(3 / s)}" stroke-linejoin="round"/>
  <path d="M20 28 V46 C 30 56, 62 56, 72 46 V28" fill="${P.forest}" stroke="${INK}" stroke-width="${f(3 / s)}" stroke-linejoin="round"/>
  <path d="M46 18 L80 30 V52" fill="none" stroke="${P.clay}" stroke-width="${f(3 / s)}" stroke-linecap="round"/><circle cx="80" cy="56" r="5" fill="${P.clay}" stroke="${INK}" stroke-width="${f(2.4 / s)}"/></g>`;
const calendar = (x, y, w, h) => `<g><path d="${rr(x, y, w, h, 12)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.2"/>
  <path d="M${x} ${y + 12} a12 12 0 0 1 12 -12 h${w - 24} a12 12 0 0 1 12 12 v18 h-${w} z" fill="${P.terracotta}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round"/>
  <path d="M${x + 22} ${y - 8} v16 M${x + w - 22} ${y - 8} v16" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  ${[0, 1, 2].map(r => [0, 1, 2, 3].map(c => `<circle cx="${x + 20 + c * ((w - 40) / 3)}" cy="${y + 48 + r * 18}" r="4.2" fill="${r === 1 && c === 2 ? P.forest : P.sageDeep}"/>`).join('')).join('')}
  <circle cx="${x + 20 + 2 * ((w - 40) / 3)}" cy="${y + 66}" r="11" fill="none" stroke="${P.forest}" stroke-width="3"/></g>`;

export const spots = {
  'spot-general': () => spot({ title: 'Conversation', desc: 'A learner with a cup of coffee, mid-conversation.', blob: P.mint,
    fig: { pose: 'Coffee', hair: 'BunCurly', face: 'Smile', c: { ink: INK, skin: SKIN[3], cloth: P.peach, cloth2: P.clay, prop: P.cream } },
    props: bubble({ x: 232, y: 34, w: 124, h: 50, r: 20, fill: P.paper, stroke: INK, sw: 3, tail: { side: 'b', at: 0.25, len: 14, width: 16 }, lines: [0.9, 0.55], lineColor: P.forestSoft }) +
      bubble({ x: 262, y: 104, w: 92, h: 44, r: 18, fill: P.peach, stroke: INK, sw: 3, tail: { side: 'br', at: 0.6, len: 12, width: 14 }, dots: true, lineColor: P.terracotta }) + najmaStar(368, 196, 11, P.terracotta) }),
  'spot-business': () => spot({ title: 'Professional English', desc: 'A professional beside a laptop showing a chart.', blob: P.peach, shapeName: 'clover4',
    fig: { pose: 'BlazerBlackTee', hair: 'MediumShort', face: 'Calm', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[1], cloth: P.forest, cloth2: P.mintDeep } },
    props: laptop(236, 88, 0.86, P.mint, '') + `<g transform="translate(252 104)">${[[0.35, P.peachDeep], [0.6, P.mintDeep], [0.85, P.forest]].map(([k, c], i) => `<rect x="${i * 26}" y="${f(50 - k * 44)}" width="18" height="${f(k * 44)}" rx="4" fill="${c}"/>`).join('')}<path d="M0 52 H96" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/></g>` + twinkle(372, 44, 9, P.forest) }),
  'spot-academic': () => spot({ title: 'Academic English', desc: 'A student beside a stack of books and a graduation cap.', blob: P.sage, shapeName: 'sunny',
    fig: { pose: 'ButtonShirt', hair: 'LongCurly', face: 'Cute', c: { ink: INK, skin: SKIN[2], cloth: P.cream, cloth2: P.mint } },
    props: `<g transform="translate(250 212) scale(1.2)">${books({ x: 0, y: 0, ink: INK, colors: [P.terracotta, P.mintDeep, P.peachDeep] }).replace(/stroke-width="3.2"/g, 'stroke-width="2.7"')}</g>` + cap(262, 70, 1.05) + najmaStar(236, 44, 10, P.terracotta) }),
  'spot-ielts': () => spot({ title: 'Test preparation', desc: 'A learner with a finger raised beside a checklist and a timer.', blob: P.mint, shapeName: 'cookie12',
    fig: { pose: 'PointingUp', hair: 'Turban', face: 'Smile', facialHair: 'Full', c: { ink: INK, skin: SKIN[3], cloth: P.peach } },
    props: `<g><path d="${rr(246, 70, 118, 132, 16)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.2"/>${checkRow({ x: 260, y: 104, w: 58, ink: INK, fill: P.peachDeep, bar: P.sage, sw: 2.8 })}${checkRow({ x: 260, y: 138, w: 46, ink: INK, fill: P.peachDeep, bar: P.sage, sw: 2.8 })}${checkRow({ x: 260, y: 172, w: 52, ink: INK, fill: P.peachDeep, bar: P.sage, sw: 2.8, done: false })}</g>` + ring(352, 58, 26, 0.7, P.terracotta) }),
  'spot-advocacy': () => spot({ title: 'Advocacy and organising', desc: 'A campaigner speaking beside a megaphone.', blob: P.peach, shapeName: 'cookie6',
    fig: { pose: 'Explaining', hair: 'Hijab', face: 'Explaining', c: { ink: INK, skin: SKIN[1], cloth: P.cream } },
    props: megaphone(258, 96, 1) + bubble({ x: 286, y: 22, w: 70, h: 46, r: 18, fill: P.paper, stroke: INK, sw: 3, tail: { side: 'b', at: 0.3, len: 12, width: 14 } }).replace('</g>', `${heart(321, 47, 0.9, P.clay, INK)}</g>`) }),
  'spot-meetings': () => spot({ title: 'International meetings', desc: 'A colleague gesturing openly beside a globe.', blob: P.sage, shapeName: 'clover8',
    fig: { pose: 'Whatever', hair: 'ShortWavy', face: 'Smile', facialHair: 'GoateeCircle', c: { ink: INK, skin: SKIN[4], cloth: P.forest } },
    props: globe(318, 132, 50) + bubble({ x: 270, y: 20, w: 96, h: 44, r: 18, fill: P.paper, stroke: INK, sw: 3, tail: { side: 'b', at: 0.3, len: 12, width: 14 }, lines: [0.85], lineColor: P.forestSoft }) + najmaStar(376, 212, 10, P.terracotta) }),
  'spot-presentations': () => spot({ title: 'Presentations', desc: 'A speaker pointing to a chart on a board.', blob: P.mint, shapeName: 'sunny', cx: 124,
    fig: { pose: 'DotJacket', hair: 'Afro', face: 'Explaining', c: { ink: INK, skin: SKIN[4], cloth: P.sage } },
    props: board(250, 40, 124, 110) + twinkle(372, 206, 9, P.terracotta) }),
  'spot-reports': () => spot({ title: 'Written English', desc: 'A colleague with a phone beside an email and a report.', blob: P.peach, shapeName: 'cookie9',
    fig: { pose: 'Device', hair: 'Bun', face: 'Calm', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[0], cloth: P.forest, prop: P.paper } },
    props: doc2(262, 48, 96, 110, 6) + envelope(238, 138, 88, 58, P.mint) + najmaStar(372, 36, 10, P.terracotta) }),
  // Lesson options and offers: white shapes, for cards that carry their own colour
  'spot-private': () => spot({ title: 'Private lessons', desc: 'A learner working at a laptop.', blob: 'rgba(255,255,255,.62)', shapeName: 'cookie12',
    fig: { pose: 'Geek', hair: 'Afro', face: 'Smile', facialHair: 'Full', c: { ink: INK, skin: SKIN[3], cloth: P.forest, cloth2: P.mint, prop: P.paper }, drop: [[780, 790, 895, 890]] },
    cx: 150, height: 206, props: bubble({ x: 292, y: 30, w: 86, h: 44, r: 18, fill: P.paper, stroke: INK, sw: 3, tail: { side: 'b', at: 0.3, len: 12, width: 14 }, dots: true, lineColor: P.forest }) }),
  'spot-short': () => spot({ title: 'Short lessons', desc: 'A learner holding a coffee beside a timer.', blob: 'rgba(255,255,255,.62)', shapeName: 'clover4',
    fig: { pose: 'Coffee', hair: 'Hijab', face: 'Calm', c: { ink: INK, skin: SKIN[2], cloth: P.terracotta, cloth2: P.peach, prop: P.cream } },
    props: ring(318, 112, 46, 25 / 60, P.forest) + twinkle(376, 40, 9, P.terracotta) }),
  'spot-meet': () => spot({ title: 'Meeting a teacher', desc: 'A teacher with open hands beside a calendar with one date circled.', blob: 'rgba(255,255,255,.62)', shapeName: 'cookie6',
    fig: { pose: 'Whatever', hair: 'MediumBangs', face: 'Smile', c: { ink: INK, skin: SKIN[0], cloth: P.clay } },
    props: calendar(266, 64, 110, 116) + najmaStar(250, 40, 10, P.forest) }),
  'spot-cafe': () => spot({ title: 'Solidarity Café', desc: 'A person holding a mug beside speech bubbles.', blob: 'rgba(255,255,255,.62)', shapeName: 'softburst',
    fig: { pose: 'Coffee', hair: 'ShortCurly', face: 'Smile', facialHair: 'Full', c: { ink: INK, skin: SKIN[4], cloth: P.sage, cloth2: P.forest, prop: P.peach } },
    props: bubble({ x: 240, y: 40, w: 118, h: 50, r: 20, fill: P.paper, stroke: INK, sw: 3, tail: { side: 'b', at: 0.25, len: 14, width: 16 }, lines: [0.9, 0.5], lineColor: P.forestSoft }) + `<g transform="translate(300 150)">${mug({ x: 0, y: 0, ink: INK, fill: P.forest, s: 0.95 })}</g>` }),
  'spot-programmes': () => spot({ title: 'Programmes for organisations', desc: 'A lead teacher pointing to a chart on a board.', blob: 'rgba(255,255,255,.62)', shapeName: 'sunny', cx: 124,
    fig: { pose: 'DotJacket', hair: 'CornRows', face: 'Smile', c: { ink: INK, skin: SKIN[2], cloth: P.peach } },
    props: board(250, 40, 124, 110) }),
};
