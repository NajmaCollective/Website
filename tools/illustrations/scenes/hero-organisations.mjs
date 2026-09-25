import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, rr, doc, bubble } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Organisations hero: a lead teacher presents to a group. The price card covers the lower left.
export default function () {
  const W = 600, H = 600;
  const board = { x: 72, y: 54, w: 300, h: 224 };
  const presenter = figure({ pose: 'PointingFingerWB', hair: 'Turban', face: 'Smile', facialHair: 'Full', flip: true,
    c: { ink: INK, skin: SKIN[3], cloth: P.mint, sole: P.cream }, place: { cx: 466, bottom: 578, height: 486 } });
  const bars = [[0.46, P.peachDeep], [0.7, P.mintDeep], [0.92, P.forest]].map(([h, c], i) =>
    `<rect x="${board.x + 36 + i * 46}" y="${board.y + board.h - 34 - h * 130}" width="30" height="${h * 130}" rx="6" fill="${c}" stroke="${INK}" stroke-width="3" class="bar b${i}"/>`).join('');
  const body = `
  <g class="spin-slow" style="transform-origin:352px 300px"><path d="${shape('cookie4', 352, 300, 250, 10)}" fill="${P.mint}"/></g>
  <path d="${shape('clover8', 540, 90, 44)}" fill="${P.peach}" class="spin-rev" style="transform-origin:540px 90px"/>
  <path d="M${board.x + 60} ${board.y + board.h} L${board.x + 30} ${board.y + board.h + 150} M${board.x + board.w - 60} ${board.y + board.h} L${board.x + board.w - 30} ${board.y + board.h + 150}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <path d="${rr(board.x, board.y, board.w, board.h, 20)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.4"/>
  <rect x="${board.x + board.w / 2 - 22}" y="${board.y - 12}" width="44" height="18" rx="6" fill="${P.terracotta}" stroke="${INK}" stroke-width="3"/>
  ${bars}
  <path d="M${board.x + 30} ${board.y + board.h - 34} H${board.x + 172}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  <path d="M${board.x + 36} ${board.y + 100} C ${board.x + 70} ${board.y + 90}, ${board.x + 110} ${board.y + 70}, ${board.x + 160} ${board.y + 44}" fill="none" stroke="${P.terracotta}" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="3 9" class="flow"/>
  <rect x="${board.x + 196}" y="${board.y + 34}" width="80" height="12" rx="6" fill="${P.forest}"/>
  <rect x="${board.x + 196}" y="${board.y + 60}" width="64" height="10" rx="5" fill="${P.sageDeep}"/>
  <rect x="${board.x + 196}" y="${board.y + 82}" width="72" height="10" rx="5" fill="${P.sageDeep}"/>
  <g class="float2"><path d="${rr(board.x + 196, board.y + 112, 80, 70, 12)}" fill="${P.peach}" stroke="${INK}" stroke-width="3"/>${najmaStar(board.x + 236, board.y + 147, 17, P.terracotta, ' class="twinkle t2"')}</g>
  ${presenter}
  ${bubble({ x: 420, y: 44, w: 132, h: 56, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.3, len: 16, width: 18 }, lines: [0.9, 0.55], lineColor: P.forestSoft, extra: ' class="pop p1"' })}
  ${najmaStar(30, 330, 14, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(578, 250, 10, P.forest, ' class="twinkle t3"')}
  <circle cx="400" cy="160" r="5" fill="${P.terracotta}"/><circle cx="36" cy="40" r="4.5" fill="${P.forest}"/>
  `;
  const css = baseCss + `.bar{transform-box:fill-box;transform-origin:50% 100%;animation:grow 1.2s cubic-bezier(.34,1.4,.64,1) both}.b1{animation-delay:.15s}.b2{animation-delay:.3s}
  @keyframes grow{from{transform:scaleY(0)}}`;
  return doc({ w: W, h: H, title: 'A programme for an organisation', desc: 'A lead teacher presents a chart on a board during a group session.', css, body });
}
