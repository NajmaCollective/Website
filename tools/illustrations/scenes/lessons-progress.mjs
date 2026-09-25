import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, rr, plant, f } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// A learner climbs a staircase of stacked books towards a star flag: lessons that build over time.
export default function () {
  const W = 600, H = 500, ground = 462, bh = 30;
  const cols = [P.sage, P.peachDeep, P.mintDeep, P.clay, P.sand, P.forest, P.peach, P.sageDeep];
  let k = 0;
  const stack = (x, w, n, delay) => {
    let out = '';
    for (let j = 0; j < n; j++) {
      const y = ground - (j + 1) * bh, off = [0, 6, -4, 8, -2, 4][(j + n) % 6], ww = w - [0, 10, 4, 14, 6, 8][(j + k) % 6];
      const c = cols[(k++) % cols.length];
      const dark = c === P.forest || c === P.clay;
      out += `<path d="${rr(x + off, y, ww, bh, 7)}" fill="${c}" stroke="${INK}" stroke-width="3.2"/>` +
        `<path d="M${f(x + off + 12)} ${f(y + 9)} H${f(x + off + ww - 40)}" stroke="${dark ? P.paper : INK}" stroke-width="3" stroke-linecap="round" opacity="${dark ? 0.7 : 0.35}"/>` +
        `<rect x="${f(x + off + ww - 28)}" y="${f(y + 5)}" width="10" height="${bh - 10}" rx="2" fill="${dark ? P.paper : INK}" opacity="${dark ? 0.8 : 0.75}"/>`;
    }
    return `<g class="step" style="animation-delay:${delay}s">${out}</g>`;
  };
  const S = [[56, 150, 1], [186, 150, 3], [316, 150, 5], [446, 128, 7]];
  const tops = S.map(([, , n]) => ground - n * bh);
  const learner = figure({ pose: 'WalkingWB', hair: 'Bun', face: 'Smile', c: { ink: INK, skin: SKIN[3], cloth: P.peach, shoe: P.forest, sole: P.cream, sock: P.mint }, place: { cx: 262, bottom: tops[1] + 4, height: 262 } });
  const flagX = 510, flagTop = tops[3] - 136;
  const body = `
  <g class="spin-slow" style="transform-origin:320px 230px"><path d="${shape('cookie12', 320, 230, 214)}" fill="${P.sage}" opacity=".55"/></g>
  <ellipse cx="300" cy="${ground + 6}" rx="286" ry="14" fill="${P.sandDeep}" opacity=".7"/>
  ${S.map(([x, w, n], i) => stack(x, w, n, i * 0.12)).join('')}
  ${learner}
  <g class="float"><path d="M${flagX} ${tops[3]} V ${flagTop}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
  <path d="M${flagX + 2} ${flagTop + 2} C ${flagX + 35} ${flagTop - 8}, ${flagX + 51} ${flagTop + 16}, ${flagX + 85} ${flagTop + 8} L ${flagX + 77} ${flagTop + 44} C ${flagX + 47} ${flagTop + 52}, ${flagX + 33} ${flagTop + 30}, ${flagX + 2} ${flagTop + 40} Z" fill="${P.terracotta}" stroke="${INK}" stroke-width="3.2" stroke-linejoin="round" class="wave"/>
  ${najmaStar(flagX + 43, flagTop + 25, 10, P.peach)}</g>
  <path d="M120 ${tops[0] - 30} C 170 ${tops[1] - 120}, 260 ${tops[1] - 170}, 360 ${tops[2] - 120} S 470 ${tops[3] - 150}, ${flagX - 16} ${flagTop - 10}" fill="none" stroke="${P.forest}" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 10" class="flow"/>
  ${najmaStar(120, tops[0] - 30, 11, P.terracotta, ' class="twinkle t1"')}
  ${najmaStar(360, tops[2] - 120, 13, P.forest, ' class="twinkle t2"')}
  ${najmaStar(438, 40, 16, P.terracotta, ' class="twinkle t3"')}
  ${plant({ x: 40, y: ground, s: 0.82, ink: INK, pot: P.clay, rim: P.terracotta, leaves: [P.forest, P.mintDeep] })}
  ${twinkle(46, 170, 9, P.forest, ' class="twinkle t4"')}
  <circle cx="220" cy="60" r="5" fill="${P.forest}"/><circle cx="586" cy="200" r="4" fill="${P.terracotta}"/>
  `;
  const css = baseCss + `.step{animation:rise .9s cubic-bezier(.34,1.3,.64,1) both}@keyframes rise{from{opacity:0;transform:translateY(24px)}}
  .wave{transform-box:fill-box;transform-origin:0 50%;animation:wave 3.2s ease-in-out 8}@keyframes wave{50%{transform:skewY(-4deg) scaleX(.94)}}`;
  return doc({ w: W, h: H, title: 'Learning that builds over time', desc: 'A learner climbs a staircase of stacked books towards a flag marked with a star.', css, body });
}
