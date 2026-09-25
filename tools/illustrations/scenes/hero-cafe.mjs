import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, rr, doc, bubble, videoTile, mug, heart } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Solidarity Café hero: four people in an online conversation, coffee in hand.
export default function () {
  const W = 600, H = 600;
  const win = { x: 46, y: 64, w: 470, h: 388 };
  const gx = win.x + 14, gy = win.y + 42, tw = (win.w - 14 * 2 - 12) / 2, th = (win.h - 42 - 14 - 12) / 2;
  const tiles = [
    { bg: P.peach, fig: { pose: 'Coffee', hair: 'Afro', face: 'Smile', c: { ink: INK, skin: SKIN[4], cloth: P.forest, cloth2: P.mint, prop: P.cream } } },
    { bg: P.mint, fig: { pose: 'Whatever', hair: 'Hijab', face: 'Cheeky', c: { ink: INK, skin: SKIN[1], cloth: P.cream } } },
    { bg: P.sage, fig: { pose: 'Sweater', hair: 'GrayBun', face: 'Calm', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[0], cloth: P.clay, cloth2: P.peach } } },
    { bg: P.cream, fig: { pose: 'Device', hair: 'Turban', face: 'Smile', facialHair: 'Full', c: { ink: INK, skin: SKIN[2], cloth: P.sage, prop: P.paper } } },
  ].map((t, i) => {
    const x = gx + (i % 2) * (tw + 12), y = gy + Math.floor(i / 2) * (th + 12);
    return videoTile({ x, y, w: tw, h: th, r: 16, bg: t.bg, ink: INK, sw: 3,
      deco: `<path d="${shape(['sunny', 'cookie9', 'clover4', 'cookie6'][i], x + tw / 2, y + th * 0.9, th * 0.62, i * 15)}" fill="#ffffff" opacity=".35"/>`,
      fig: figure({ ...t.fig, place: { cx: x + tw / 2, bottom: y + th + 8, height: th * 1.06 } }) });
  }).join('');
  const body = `
  <g class="spin-slow" style="transform-origin:300px 300px"><path d="${shape('softburst', 300, 300, 286)}" fill="${P.peach}"/></g>
  <path d="${shape('cookie6', 548, 540, 48)}" fill="${P.mint}" class="spin-rev" style="transform-origin:548px 540px"/>
  <g class="float">
    <path d="${rr(win.x, win.y, win.w, win.h, 26)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.4"/>
    <circle cx="${win.x + 22}" cy="${win.y + 21}" r="5.2" fill="${P.terracotta}"/><circle cx="${win.x + 39}" cy="${win.y + 21}" r="5.2" fill="${P.peachDeep}"/><circle cx="${win.x + 56}" cy="${win.y + 21}" r="5.2" fill="${P.sageDeep}"/>
    <rect x="${win.x + win.w - 84}" y="${win.y + 15}" width="62" height="12" rx="6" fill="${P.mint}"/>
    ${tiles}
  </g>
  ${bubble({ x: 318, y: 18, w: 150, h: 58, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.3, len: 18, width: 20 }, lines: [0.9, 0.6], lineColor: P.forestSoft, extra: ' class="pop p1"' })}
  ${bubble({ x: 30, y: 250, w: 72, h: 52, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'br', at: 0.7, len: 14, width: 16 }, extra: ' class="pop p2"' }).replace('</g>', `${heart(66, 280, 1.05, P.clay, INK)}</g>`)}
  <g transform="translate(430 470)">${mug({ x: 0, y: 0, ink: INK, fill: P.forest, s: 1.55 })}</g>
  ${najmaStar(560, 170, 16, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(24, 130, 10, P.forest, ' class="twinkle t3"')}
  ${twinkle(300, 560, 9, P.terracotta, ' class="twinkle t4"')}
  <circle cx="560" cy="330" r="5" fill="${P.forest}"/><circle cx="150" cy="540" r="4.5" fill="${P.terracotta}"/>
  `;
  return doc({ w: W, h: H, title: 'An online Solidarity Café', desc: 'Four people talk together on a video call, one holding a coffee.', css: baseCss, body });
}
