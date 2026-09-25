import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, rr } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// One teacher, one vote: shared decisions by simple majority.
export default function () {
  const W = 600, H = 500, desk = 380;
  const ppl = [
    { pose: 'PointingUp', hair: 'Bun', face: 'Smile', c: { ink: INK, skin: SKIN[1], cloth: P.peach }, cx: 110, h: 260, flip: true },
    { pose: 'Explaining', hair: 'ShortWavy', face: 'Calm', facialHair: 'Full', c: { ink: INK, skin: SKIN[3], cloth: P.cream }, cx: 240, h: 250 },
    { pose: 'PointingUp', hair: 'Hijab', face: 'Cute', c: { ink: INK, skin: SKIN[2], cloth: P.mint }, cx: 370, h: 262 },
    { pose: 'DotJacket', hair: 'GrayShort', face: 'Smile', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[0], cloth: P.sage }, cx: 500, h: 250 },
  ].map((p, i) => `<g class="bob b${i}">${figure({ ...p, place: { cx: p.cx, bottom: desk + 40, height: p.h } })}</g>`).join('');
  const box = { x: 238, y: desk - 70, w: 124, h: 110 };
  const body = `
  <g class="spin-slow" style="transform-origin:300px 240px"><path d="${shape('clover8', 300, 240, 236, 10)}" fill="${P.sage}" opacity=".7"/></g>
  ${ppl}
  <path d="${rr(20, desk, 560, 36, 18)}" fill="${P.sandDeep}" stroke="${INK}" stroke-width="3.4"/>
  <path d="${rr(40, desk + 36, 520, 64, 20)}" fill="${P.sand}" stroke="${INK}" stroke-width="3.4"/>
  <g class="ballot"><path d="${rr(box.x + 36, box.y - 64, 52, 64, 6)}" fill="${P.paper}" stroke="${INK}" stroke-width="3"/><path d="M${box.x + 50} ${box.y - 34} l7 8 l14 -16" fill="none" stroke="${P.forest}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g>
  <path d="${rr(box.x, box.y, box.w, box.h, 12)}" fill="${P.terracotta}" stroke="${INK}" stroke-width="3.4"/>
  <path d="${rr(box.x - 8, box.y - 14, box.w + 16, 22, 8)}" fill="${P.clay}" stroke="${INK}" stroke-width="3.4"/>
  <rect x="${box.x + 30}" y="${box.y - 6}" width="${box.w - 60}" height="6" rx="3" fill="${INK}"/>
  ${najmaStar(box.x + box.w / 2, box.y + 56, 20, P.peach)}
  ${najmaStar(46, 60, 14, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(556, 70, 10, P.forest, ' class="twinkle t3"')}
  <circle cx="300" cy="40" r="5" fill="${P.forest}"/><circle cx="580" cy="200" r="4.5" fill="${P.terracotta}"/>
  `;
  const css = baseCss + `.bob{animation:bob 6s ease-in-out 4}.b1{animation-delay:-1.5s}.b2{animation-delay:-3s}.b3{animation-delay:-4.5s}@keyframes bob{50%{transform:translateY(-4px)}}
  .ballot{animation:vote 6s cubic-bezier(.5,0,.3,1) 4}@keyframes vote{0%,20%{transform:translateY(0)}55%,70%{transform:translateY(58px);opacity:1}72%{opacity:0}74%{transform:translateY(0);opacity:0}90%,100%{opacity:1}}`;
  return doc({ w: W, h: H, title: 'Deciding together', desc: 'Four teachers raise their hands behind a table while a ballot drops into a box.', css, body });
}
