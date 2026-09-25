import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, bubble, rr, doc, f, plant, books, mug } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Home hero: a learner at a desk in a live lesson, the chosen teacher on screen.
export default function () {
  const W = 600, H = 600;
  const win = { x: 30, y: 64, w: 322, h: 240, r: 26 };
  const scr = { x: win.x + 12, y: win.y + 38, w: win.w - 24, h: win.h - 50, r: 16 };
  const teacher = figure({ pose: 'Explaining', hair: 'Bun', face: 'Smile', accessory: 'GlassRound',
    c: { ink: INK, skin: SKIN[1], cloth: P.cream }, place: { cx: scr.x + scr.w * 0.54, bottom: scr.y + scr.h + 2, height: 214 } });
  const learner = figure({ pose: 'Geek', hair: 'Hijab', face: 'Smile',
    c: { ink: INK, skin: SKIN[3], cloth: P.forest, cloth2: P.mint, prop: P.paper }, drop: [[780, 790, 895, 890]],
    place: { cx: 420, bottom: 546, height: 318 } });
  const deskTop = 522;
  const body = `
  <g class="spin-slow" style="transform-origin:322px 316px"><path d="${shape('cookie9', 322, 316, 262, 8)}" fill="${P.mint}"/></g>
  <circle cx="86" cy="110" r="72" fill="${P.peach}" class="breathe" style="transform-origin:86px 110px"/>
  <path d="${shape('clover4', 548, 120, 42, 20)}" fill="${P.sage}" class="spin-rev" style="transform-origin:548px 120px"/>
  <g class="float">
    <path d="${rr(win.x, win.y, win.w, win.h, win.r)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.4"/>
    <circle cx="${win.x + 23}" cy="${win.y + 19}" r="5.2" fill="${P.terracotta}"/><circle cx="${win.x + 40}" cy="${win.y + 19}" r="5.2" fill="${P.peachDeep}"/><circle cx="${win.x + 57}" cy="${win.y + 19}" r="5.2" fill="${P.sageDeep}"/>
    <clipPath id="screen"><path d="${rr(scr.x, scr.y, scr.w, scr.h, scr.r)}"/></clipPath>
    <g clip-path="url(#screen)">
      <rect x="${scr.x}" y="${scr.y}" width="${scr.w}" height="${scr.h}" fill="${P.peach}"/>
      <path d="${shape('sunny', scr.x + scr.w * 0.54, scr.y + scr.h * 0.7, 122, 12)}" fill="${P.peachDeep}" opacity=".5"/>
      ${najmaStar(scr.x + 32, scr.y + 32, 12, P.paper, ' class="twinkle t2"')}
      ${teacher}
    </g>
    <path d="${rr(scr.x, scr.y, scr.w, scr.h, scr.r)}" fill="none" stroke="${INK}" stroke-width="2.6"/>
  </g>
  ${bubble({ x: 264, y: 18, w: 178, h: 62, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.2, len: 18, width: 20 }, lines: [0.92, 0.58], lineColor: P.forestSoft, extra: ' class="pop p1"' })}
  <path d="${rr(62, deskTop + 8, 520, 70, 22)}" fill="${P.sand}" stroke="${INK}" stroke-width="3.2"/>
  <path d="M104 ${deskTop + 44} H 250 M 400 ${deskTop + 44} H 540" stroke="${P.sandDeep}" stroke-width="7" stroke-linecap="round"/>
  <rect x="44" y="${deskTop}" width="556" height="18" rx="9" fill="${P.sandDeep}" stroke="${INK}" stroke-width="3.2"/>
  ${plant({ x: 90, y: deskTop, s: 1.05, ink: INK, pot: P.clay, rim: P.terracotta, leaves: [P.forest, P.mintDeep], cls: 'sway' })}
  ${books({ x: 128, y: deskTop, ink: INK, colors: [P.forest, P.peachDeep, P.sage] })}
  ${mug({ x: 232, y: deskTop - 51, ink: INK, fill: P.terracotta })}
  ${learner}
  ${najmaStar(506, 452, 11, P.terracotta)}
  ${bubble({ x: 488, y: 212, w: 94, h: 50, r: 20, fill: P.mint, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.26, len: 16, width: 18 }, dots: true, lineColor: P.forest, extra: ' class="pop p2"' })}
  ${najmaStar(566, 300, 15, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(470, 104, 10, P.forest, ' class="twinkle t3"')}
  ${twinkle(22, 360, 8, P.terracotta, ' class="twinkle t4"')}
  <circle cx="586" cy="200" r="5" fill="${P.forest}"/><circle cx="16" cy="250" r="4.5" fill="${P.terracotta}"/>
  `;
  return doc({ w: W, h: H, title: 'A live online English lesson', desc: 'A learner at a laptop talks with their teacher, who appears in a video window.', css: baseCss + '.sway .leaf{transform-box:view-box;animation:none}', body });
}
