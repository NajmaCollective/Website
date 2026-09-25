import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, bubble, heart, f } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Community and campaign groups: people gathered under bunting.
export default function () {
  const W = 600, H = 500, ground = 476;
  const people = [
    { pose: 'RestingWB', hair: 'CornRows', face: 'Smile', c: { ink: INK, skin: SKIN[4], cloth: P.clay, shoe: P.cream, sock: P.peach }, cx: 112, h: 336 },
    { pose: 'PointingFingerWB', hair: 'Hijab', face: 'Explaining', c: { ink: INK, skin: SKIN[1], cloth: P.forest, sole: P.cream }, cx: 238, h: 342 },
    { pose: 'EasingWB', hair: 'ShortScratch', face: 'Calm', facialHair: 'Chin', c: { ink: INK, skin: SKIN[2], cloth: P.peach, cloth2: P.cream, shoe: P.forest, sock: P.sage }, cx: 390, h: 338 },
    { pose: 'CrossedArmsWB', hair: 'GrayMedium', face: 'Smile', accessory: 'GlassRound', flip: true, c: { ink: INK, skin: SKIN[0], cloth: P.mint, shoe: P.terracotta, sole: P.cream, sock: P.peach }, cx: 504, h: 330 },
  ].map((p, i) => `<g class="bob b${i}">${figure({ ...p, place: { cx: p.cx, bottom: ground, height: p.h } })}</g>`).join('');
  // bunting along a catenary
  const flags = [];
  const n = 9;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = 20 + t * 560, y = 58 + 38 * Math.sin(Math.PI * t);
    const col = [P.terracotta, P.mintDeep, P.peachDeep, P.forest, P.sage][i % 5];
    flags.push(`<path d="M${f(x - 20)} ${f(y - 2)} L${f(x + 20)} ${f(y + 2)} L${f(x + 2)} ${f(y + 40)} Z" fill="${col}" stroke="${INK}" stroke-width="3" stroke-linejoin="round" class="flag g${i % 3}"/>`);
  }
  const body = `
  <g class="spin-slow" style="transform-origin:300px 280px"><path d="${shape('sunny', 300, 280, 236, 6)}" fill="${P.mint}" opacity=".75"/></g>
  <path d="M10 50 Q 300 140 590 50" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  ${flags.join('')}
  <ellipse cx="300" cy="${ground + 4}" rx="280" ry="14" fill="${P.sandDeep}" opacity=".7"/>
  ${people}
  ${bubble({ x: 282, y: 118, w: 66, h: 46, r: 18, fill: P.paper, stroke: INK, sw: 3, tail: { side: 'b', at: 0.3, len: 14, width: 16 }, extra: ' class="pop p1"' }).replace('</g>', `${heart(315, 143, 0.9, P.clay, INK)}</g>`)}
  ${najmaStar(40, 240, 14, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(566, 280, 10, P.forest, ' class="twinkle t3"')}
  `;
  const css = baseCss + `.bob{animation:bob 6s ease-in-out 4}.b1{animation-delay:-1.5s}.b2{animation-delay:-3s}.b3{animation-delay:-4.5s}@keyframes bob{50%{transform:translateY(-4px)}}
  .flag{transform-box:fill-box;transform-origin:50% 0;animation:flutter 3s ease-in-out 8}.g1{animation-delay:-1s}.g2{animation-delay:-2s}@keyframes flutter{50%{transform:rotate(5deg)}}`;
  return doc({ w: W, h: H, title: 'Community organisations', desc: 'Four people from community and campaign groups gather beneath bunting.', css, body });
}
