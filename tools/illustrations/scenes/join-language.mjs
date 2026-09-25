import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, bubble, emerge } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// English as a shared language: two voices meet in one conversation.
export default function () {
  const W = 600, H = 500;
  const l = { cx: 170, cy: 300, r: 150 }, r = { cx: 430, cy: 300, r: 150 };
  const left = figure({ pose: 'StripedShirt', hair: 'Hijab', face: 'Explaining', c: { ink: INK, skin: SKIN[3], cloth: P.cream }, place: { cx: 178, bottom: 466, height: 290 } });
  const right = figure({ pose: 'ShirtCoat', hair: 'Twists', face: 'Smile', flip: true, c: { ink: INK, skin: SKIN[1], cloth: P.forest, cloth2: P.cream }, place: { cx: 424, bottom: 466, height: 290 } });
  const body = `
  <g class="spin-slow" style="transform-origin:${l.cx}px ${l.cy}px"><path d="${shape('cookie9', l.cx, l.cy, l.r + 26)}" fill="${P.paper}" opacity=".85"/></g>
  <g class="spin-rev" style="transform-origin:${r.cx}px ${r.cy}px"><path d="${shape('cookie12', r.cx, r.cy, r.r + 26)}" fill="${P.mint}"/></g>
  ${emerge({ d: shape('circle', l.cx, l.cy, l.r), cut: l.cy - 40, fig: left })}
  ${emerge({ d: shape('circle', r.cx, r.cy, r.r), cut: r.cy - 40, fig: right })}
  <g class="pop p1">${bubble({ x: 120, y: 34, w: 190, h: 66, r: 24, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.28, len: 20, width: 22 }, lines: [0.9, 0.55], lineColor: P.forestSoft })}</g>
  <g class="pop p2">${bubble({ x: 280, y: 74, w: 200, h: 66, r: 24, fill: P.peach, stroke: INK, sw: 3.2, tail: { side: 'br', at: 0.72, len: 20, width: 22 }, lines: [0.7, 0.9], lineColor: P.clay })}</g>
  ${najmaStar(540, 64, 16, P.terracotta, ' class="twinkle t1"')}
  ${najmaStar(58, 110, 12, P.forest, ' class="twinkle t2"')}
  ${twinkle(300, 250, 11, P.terracotta, ' class="twinkle t3"')}
  <circle cx="300" cy="200" r="5" fill="${P.forest}"/><circle cx="30" cy="330" r="4.5" fill="${P.terracotta}"/>
  `;
  return doc({ w: W, h: H, title: 'A shared language', desc: 'Two people from different backgrounds talk; their speech bubbles overlap.', css: baseCss, body });
}
