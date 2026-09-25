import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, bubble, rr, mug } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// A facilitated conversation: people sit together; some speak, some listen.
export default function () {
  const W = 600, H = 500, ground = 470;
  const a = figure({ pose: 'CrossedLegs', hair: 'Afro', face: 'Calm', facialHair: 'Full', c: { ink: INK, skin: SKIN[4], cloth: P.sage, shoe: P.cream, sock: P.peach }, place: { cx: 118, bottom: ground - 4, height: 300 } });
  const b = figure({ pose: 'HandsBackWB', hair: 'LongCurly', face: 'Smile', c: { ink: INK, skin: SKIN[2], cloth: P.peach, shoe: P.forest }, place: { cx: 300, bottom: ground - 18, height: 250 } });
  const c = figure({ pose: 'WheelChair', hair: 'Hijab', face: 'Smile', flip: true, c: { ink: INK, skin: SKIN[1], cloth: P.forest, cloth2: P.clay, shoe: P.cream, sock: P.sage, chair: P.sage }, place: { cx: 484, bottom: ground, height: 290 } });
  const body = `
  <g class="spin-slow" style="transform-origin:300px 250px"><path d="${shape('softburst', 300, 250, 244)}" fill="${P.peach}" opacity=".7"/></g>
  <path d="${shape('cookie6', 60, 70, 40)}" fill="${P.mint}" class="spin-rev" style="transform-origin:60px 70px"/>
  <ellipse cx="300" cy="${ground + 4}" rx="284" ry="14" fill="${P.sandDeep}" opacity=".7"/>
  <path d="${rr(62, ground - 70, 116, 66, 26)}" fill="${P.clay}" stroke="${INK}" stroke-width="3.2"/>
  <path d="M74 ${ground - 48} H166" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" opacity=".35"/>
  <g class="bob">${a}</g>
  <path d="${rr(236, ground - 30, 128, 28, 14)}" fill="${P.mintDeep}" stroke="${INK}" stroke-width="3.2"/>
  <g class="bob b1">${b}</g>
  <g class="bob b2">${c}</g>
  <path d="${rr(214, ground - 58, 172, 16, 8)}" fill="${P.sandDeep}" stroke="${INK}" stroke-width="3.2"/>
  <path d="M236 ${ground - 42} V ${ground - 4} M364 ${ground - 42} V ${ground - 4}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  <g transform="translate(246 ${ground - 94})">${mug({ x: 0, y: 0, ink: INK, fill: P.terracotta, s: 0.72 })}</g>
  <g transform="translate(318 ${ground - 94})">${mug({ x: 0, y: 0, ink: INK, fill: P.paper, s: 0.72, steam: false })}</g>
  ${bubble({ x: 240, y: 70, w: 160, h: 60, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.4, len: 18, width: 20 }, lines: [0.9, 0.6], lineColor: P.forestSoft, extra: ' class="pop p1"' })}
  ${bubble({ x: 60, y: 96, w: 86, h: 48, r: 20, fill: P.mint, stroke: INK, sw: 3.2, tail: { side: 'br', at: 0.6, len: 14, width: 16 }, dots: true, lineColor: P.forest, extra: ' class="pop p2"' })}
  ${najmaStar(540, 110, 15, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(430, 40, 10, P.forest, ' class="twinkle t3"')}
  <circle cx="200" cy="40" r="5" fill="${P.forest}"/><circle cx="580" cy="300" r="4.5" fill="${P.terracotta}"/>
  `;
  const css = baseCss + `.bob{animation:bob 6s ease-in-out 4}.b1{animation-delay:-2s}.b2{animation-delay:-4s}@keyframes bob{50%{transform:translateY(-3px)}}`;
  return doc({ w: W, h: H, title: 'A conversation at the Café', desc: 'Three people sit around a low table with drinks; one speaks while the others listen.', css, body });
}
