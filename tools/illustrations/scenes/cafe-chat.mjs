import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, bubble, mug, heart } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Two people talk over coffee at a café table.
export default function () {
  const W = 600, H = 500, top = 372;
  const left = figure({ pose: 'Coffee', hair: 'BunCurly', face: 'Smile', c: { ink: INK, skin: SKIN[2], cloth: P.peach, cloth2: P.clay, prop: P.cream }, place: { cx: 168, bottom: top + 30, height: 282 } });
  const right = figure({ pose: 'Explaining', hair: 'Afro', face: 'Cheeky', facialHair: 'GoateeCircle', flip: true, c: { ink: INK, skin: SKIN[4], cloth: P.cream }, place: { cx: 432, bottom: top + 30, height: 282 } });
  const body = `
  <g class="spin-slow" style="transform-origin:300px 250px"><path d="${shape('cookie9', 300, 250, 238, 4)}" fill="${P.paper}" opacity=".75"/></g>
  <circle cx="530" cy="96" r="46" fill="${P.peach}" class="breathe" style="transform-origin:530px 96px"/>
  <path d="${shape('clover4', 64, 380, 40, 30)}" fill="${P.sage}" class="spin-rev" style="transform-origin:64px 380px"/>
  <g class="bob">${left}</g>
  <g class="bob b2">${right}</g>
  <path d="M300 ${top + 26} V ${H - 26}" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="300" cy="${H - 20}" rx="62" ry="10" fill="${P.forest}" stroke="${INK}" stroke-width="3.2"/>
  <ellipse cx="300" cy="${top + 12}" rx="218" ry="28" fill="${P.sandDeep}" stroke="${INK}" stroke-width="3.4"/>
  <ellipse cx="300" cy="${top + 4}" rx="218" ry="24" fill="${P.sand}" stroke="${INK}" stroke-width="3.4"/>
  <g transform="translate(372 ${top - 44})">${mug({ x: 0, y: 0, ink: INK, fill: P.forest, s: 0.9 })}</g>
  <g transform="translate(262 ${top - 22})"><ellipse cx="18" cy="16" rx="30" ry="8" fill="${P.paper}" stroke="${INK}" stroke-width="3"/><path d="M0 12 C 4 -6, 32 -6, 36 12 Z" fill="${P.peachDeep}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></g>
  ${bubble({ x: 170, y: 22, w: 150, h: 60, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.3, len: 18, width: 20 }, lines: [0.9, 0.6], lineColor: P.forestSoft, extra: ' class="pop p1"' })}
  ${bubble({ x: 334, y: 52, w: 84, h: 54, r: 20, fill: P.peach, stroke: INK, sw: 3.2, tail: { side: 'br', at: 0.62, len: 16, width: 18 }, extra: ' class="pop p2"' }).replace('</g>', `${heart(376, 81, 1, P.clay, INK)}</g>`)}
  ${najmaStar(78, 70, 15, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(560, 250, 10, P.forest, ' class="twinkle t3"')}
  <circle cx="470" cy="30" r="5" fill="${P.forest}"/><circle cx="30" cy="220" r="4.5" fill="${P.terracotta}"/>
  `;
  const css = baseCss + `.bob{animation:bob 6s ease-in-out 4}.b2{animation-delay:-3s}@keyframes bob{50%{transform:translateY(-4px)}}`;
  return doc({ w: W, h: H, title: 'Conversation over coffee', desc: 'Two people talk across a café table with cups of coffee.', css, body });
}
