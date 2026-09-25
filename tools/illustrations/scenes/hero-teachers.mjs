import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, rr, doc, arch, clipTo, bubble, heart } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Teachers hero: three teachers, each in an arched portrait window.
export default function () {
  const W = 600, H = 600, base = 548, aw = 168;
  const A = [
    { x: 30, top: 214, bg: P.mint, deco: P.mintDeep, fig: { pose: 'ButtonShirt', hair: 'Hijab', face: 'Smile', c: { ink: INK, skin: SKIN[1], cloth: P.terracotta, cloth2: P.peach } } },
    { x: 216, top: 118, bg: P.peach, deco: P.peachDeep, fig: { pose: 'BlazerBlackTee', hair: 'ShortCurly', face: 'Calm', facialHair: 'Full', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[3], cloth: P.forest, cloth2: P.mintDeep } } },
    { x: 402, top: 232, bg: P.sage, deco: P.sageDeep, fig: { pose: 'StripedShirt', hair: 'MediumBangs', face: 'Cute', c: { ink: INK, skin: SKIN[0], cloth: P.cream } } },
  ];
  const arches = A.map((a, i) => {
    const d = arch(a.x, a.top, aw, base - a.top);
    const fig = figure({ ...a.fig, place: { cx: a.x + aw / 2 + (i === 1 ? 4 : 0), bottom: base + 30, height: (base - a.top) * (i === 1 ? 0.92 : 1.02) } });
    const inner = `<rect x="${a.x}" y="${a.top}" width="${aw}" height="${base - a.top}" fill="${a.bg}"/>` +
      `<path d="${shape(i === 1 ? 'sunny' : 'cookie9', a.x + aw / 2, base - 40, aw * 0.62, i * 20)}" fill="${a.deco}" opacity=".55"/>` + fig;
    return `<g class="rise r${i}">${clipTo(d, inner)}<path d="${d}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/></g>`;
  }).join('');
  const body = `
  <g class="spin-slow" style="transform-origin:300px 330px"><path d="${shape('cookie12', 300, 330, 272)}" fill="${P.sand}" opacity=".7"/></g>
  ${arches}
  <path d="${rr(14, base - 2, 572, 26, 13)}" fill="${P.sandDeep}" stroke="${INK}" stroke-width="3.4"/>
  ${bubble({ x: 404, y: 106, w: 104, h: 58, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.28, len: 16, width: 18 }, extra: ' class="pop p1"' }).replace('</g>', `${heart(456, 137, 1.15, P.clay, INK)}</g>`)}
  ${najmaStar(118, 150, 18, P.terracotta, ' class="twinkle t1"')}
  ${najmaStar(300, 62, 12, P.forest, ' class="twinkle t3"')}
  ${twinkle(560, 214, 10, P.forest, ' class="twinkle t2"')}
  ${twinkle(40, 300, 8, P.terracotta, ' class="twinkle t4"')}
  <circle cx="200" cy="96" r="5" fill="${P.forest}"/><circle cx="580" cy="330" r="4.5" fill="${P.terracotta}"/><circle cx="360" cy="40" r="4" fill="${P.terracotta}"/>
  `;
  const css = baseCss + `.rise{animation:rise 1s cubic-bezier(.34,1.3,.64,1) both}.r1{animation-delay:.15s}.r2{animation-delay:.3s}
  @keyframes rise{from{opacity:0;transform:translateY(40px)}}`;
  return doc({ w: W, h: H, title: 'Three English teachers', desc: 'Portraits of three teachers in arched windows.', css, body });
}
