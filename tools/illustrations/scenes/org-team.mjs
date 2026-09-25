import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, bubble, rr } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Three colleagues plan together: a small team from one organisation.
export default function () {
  const W = 600, H = 500, ground = 474;
  const a = figure({ pose: 'EasingWB', hair: 'Twists', face: 'Smile', c: { ink: INK, skin: SKIN[3], cloth: P.forest, cloth2: P.mint, shoe: P.cream, sock: P.peach }, place: { cx: 132, bottom: ground, height: 372 } });
  const b = figure({ pose: 'WheelChair', hair: 'MediumShort', face: 'Cheeky', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[1], cloth: P.clay, cloth2: P.forest, shoe: P.cream, sock: P.sage, chair: P.sage }, place: { cx: 300, bottom: ground, height: 300 } });
  const c = figure({ pose: 'CrossedArmsWB', hair: 'Hijab', face: 'Calm', flip: true, c: { ink: INK, skin: SKIN[2], cloth: P.mint, shoe: P.terracotta, sole: P.cream, sock: P.peach }, place: { cx: 474, bottom: ground, height: 362 } });
  const body = `
  <g class="spin-slow" style="transform-origin:300px 240px"><path d="${shape('cookie6', 300, 240, 230, 10)}" fill="${P.paper}" opacity=".8"/></g>
  <path d="${shape('clover8', 530, 78, 42)}" fill="${P.mint}" class="spin-rev" style="transform-origin:530px 78px"/>
  <ellipse cx="300" cy="${ground + 4}" rx="262" ry="14" fill="${P.peachDeep}" opacity=".7"/>
  <g class="bob">${a}</g><g class="bob b1">${b}</g><g class="bob b2">${c}</g>
  ${bubble({ x: 214, y: 18, w: 172, h: 64, r: 22, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.46, len: 20, width: 22 }, lines: [0.92, 0.62], lineColor: P.forestSoft, extra: ' class="pop p1"' })}
  <g class="float2"><path d="${rr(28, 40, 96, 72, 14)}" fill="${P.mint}" stroke="${INK}" stroke-width="3.2"/><rect x="44" y="60" width="62" height="9" rx="4.5" fill="${P.forest}"/><rect x="44" y="80" width="46" height="9" rx="4.5" fill="${P.forestSoft}"/></g>
  ${najmaStar(560, 190, 15, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(420, 40, 10, P.forest, ' class="twinkle t3"')}
  <circle cx="150" cy="150" r="4.5" fill="${P.terracotta}"/><circle cx="580" cy="330" r="4.5" fill="${P.forest}"/>
  `;
  const css = baseCss + `.bob{animation:bob 6s ease-in-out 4}.b1{animation-delay:-2s}.b2{animation-delay:-4s}@keyframes bob{50%{transform:translateY(-4px)}}`;
  return doc({ w: W, h: H, title: 'A team learning together', desc: 'Three colleagues, one using a wheelchair, talk through a plan together.', css, body });
}
