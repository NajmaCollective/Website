import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// About hero: the collective stands together beneath Najma's star.
export default function () {
  const W = 600, H = 600, ground = 566;
  const people = [
    { pose: 'EasingWB', hair: 'LongCurly', face: 'Smile', c: { ink: INK, skin: SKIN[2], cloth: P.forest, cloth2: P.peach, shoe: P.cream, sock: P.sage }, cx: 112, h: 404 },
    { pose: 'BlazerPantsWB', hair: 'Hijab', face: 'Calm', c: { ink: INK, skin: SKIN[1], cloth: P.clay, cloth2: P.cream, shoe: P.forest, sock: P.peach }, cx: 234, h: 392 },
    { pose: 'PointingFingerWB', hair: 'ShortWavy', face: 'Smile', facialHair: 'GoateeCircle', c: { ink: INK, skin: SKIN[4], cloth: P.sage, sole: P.cream }, cx: 372, h: 420 },
    { pose: 'CrossedArmsWB', hair: 'Bun', face: 'Cute', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[0], cloth: P.peach, shoe: P.terracotta, sole: P.cream, sock: P.mint }, cx: 500, h: 398 },
  ].map((p, i) => `<g class="bob b${i}">${figure({ ...p, place: { cx: p.cx, bottom: ground, height: p.h } })}</g>`).join('');
  const body = `
  <g class="spin-slow" style="transform-origin:300px 256px"><path d="${shape('star', 300, 256, 262, 0)}" fill="${P.mint}"/></g>
  <circle cx="300" cy="256" r="104" fill="${P.sage}" class="breathe" style="transform-origin:300px 256px"/>
  <ellipse cx="300" cy="${ground + 4}" rx="272" ry="16" fill="${P.sandDeep}" opacity=".7"/>
  ${people}
  ${najmaStar(476, 62, 20, P.terracotta, ' class="twinkle t1"')}
  ${najmaStar(92, 92, 13, P.forest, ' class="twinkle t2"')}
  ${twinkle(560, 200, 10, P.terracotta, ' class="twinkle t3"')}
  ${twinkle(36, 250, 9, P.forest, ' class="twinkle t4"')}
  <path d="M92 92 L200 50 L300 40 L400 52 L476 62" fill="none" stroke="${P.forestSoft}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" class="flow"/>
  <circle cx="200" cy="50" r="4.5" fill="${P.forest}"/><circle cx="300" cy="40" r="5" fill="${P.terracotta}"/><circle cx="400" cy="52" r="4.5" fill="${P.forest}"/>
  `;
  const css = baseCss + `.bob{animation:bob 6s ease-in-out 4}.b1{animation-delay:-1.5s}.b2{animation-delay:-3s}.b3{animation-delay:-4.5s}
  @keyframes bob{50%{transform:translateY(-4px)}}`;
  return doc({ w: W, h: H, title: 'The Najma collective', desc: 'Four teachers stand together beneath a large eight-pointed star.', css, body });
}
