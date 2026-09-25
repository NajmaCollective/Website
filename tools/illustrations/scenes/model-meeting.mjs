import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, rr, videoTile, bubble } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// An international meeting with six participants.
export default function () {
  const W = 600, H = 500;
  const win = { x: 30, y: 70, w: 540, h: 360 };
  const gx = win.x + 14, gy = win.y + 42, gap = 10, tw = (win.w - 28 - gap * 2) / 3, th = (win.h - 56 - gap) / 2;
  const people = [
    { bg: P.peach, fig: { pose: 'Explaining', hair: 'Hijab', face: 'Explaining', c: { ink: INK, skin: SKIN[2], cloth: P.cream } } },
    { bg: P.mint, fig: { pose: 'ButtonShirt', hair: 'ShortWavy', face: 'Smile', facialHair: 'MoustacheThin', c: { ink: INK, skin: SKIN[1], cloth: P.sage, cloth2: P.paper } } },
    { bg: P.sage, fig: { pose: 'Turtleneck', hair: 'Long', face: 'Calm', accessory: 'GlassRound', c: { ink: INK, skin: SKIN[0], cloth: P.clay, bodyInk: P.terracotta } } },
    { bg: P.cream, fig: { pose: 'PoloSweater', hair: 'BaldSides', face: 'Smile', facialHair: 'GrayFull', c: { ink: INK, skin: SKIN[4], cloth: P.peachDeep, cloth2: P.cream } } },
    { bg: P.mint, fig: { pose: 'Coffee', hair: 'BantuKnots', face: 'Cute', c: { ink: INK, skin: SKIN[3], cloth: P.peach, cloth2: P.clay, prop: P.forest } } },
    { bg: P.peach, fig: { pose: 'ShirtCoat', hair: 'Turban', face: 'Smile', facialHair: 'Full', c: { ink: INK, skin: SKIN[3], cloth: P.forest, cloth2: P.cream } } },
  ];
  const tiles = people.map((t, i) => {
    const x = gx + (i % 3) * (tw + gap), y = gy + Math.floor(i / 3) * (th + gap);
    const speaking = i === 0;
    return videoTile({ x, y, w: tw, h: th, r: 14, bg: t.bg, ink: INK, sw: speaking ? 4.6 : 3,
      deco: `<path d="${shape(['sunny', 'cookie9', 'clover4', 'cookie6', 'cookie12', 'clover8'][i], x + tw / 2, y + th * 0.95, th * 0.62, i * 15)}" fill="#ffffff" opacity=".4"/>`,
      fig: figure({ ...t.fig, place: { cx: x + tw / 2, bottom: y + th + 8, height: th * 1.08 } }) });
  }).join('');
  const body = `
  <g class="spin-slow" style="transform-origin:300px 250px"><path d="${shape('cookie12', 300, 250, 246)}" fill="${P.paper}" opacity=".7"/></g>
  <g class="float">
    <path d="${rr(win.x, win.y, win.w, win.h, 26)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.4"/>
    <circle cx="${win.x + 22}" cy="${win.y + 21}" r="5.2" fill="${P.terracotta}"/><circle cx="${win.x + 39}" cy="${win.y + 21}" r="5.2" fill="${P.peachDeep}"/><circle cx="${win.x + 56}" cy="${win.y + 21}" r="5.2" fill="${P.sageDeep}"/>
    <rect x="${win.x + win.w - 90}" y="${win.y + 15}" width="68" height="12" rx="6" fill="${P.mint}"/>
    ${tiles}
  </g>
  ${bubble({ x: 70, y: 14, w: 156, h: 58, r: 20, fill: P.paper, stroke: INK, sw: 3.2, tail: { side: 'b', at: 0.34, len: 18, width: 20 }, lines: [0.9, 0.58], lineColor: P.forestSoft, extra: ' class="pop p1"' })}
  ${bubble({ x: 420, y: 18, w: 92, h: 50, r: 20, fill: P.mint, stroke: INK, sw: 3.2, tail: { side: 'br', at: 0.5, len: 16, width: 18 }, dots: true, lineColor: P.forest, extra: ' class="pop p2"' })}
  <g class="float2"><circle cx="560" cy="440" r="34" fill="${P.paper}" stroke="${INK}" stroke-width="3.2"/><path d="M526 440 H594 M560 406 C 540 420, 540 460, 560 474 C 580 460, 580 420, 560 406" fill="none" stroke="${INK}" stroke-width="2.8"/><ellipse cx="560" cy="440" rx="34" ry="14" fill="none" stroke="${INK}" stroke-width="2.4"/></g>
  ${najmaStar(40, 460, 14, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(300, 470, 9, P.forest, ' class="twinkle t3"')}
  <circle cx="330" cy="30" r="5" fill="${P.forest}"/>
  `;
  return doc({ w: W, h: H, title: 'An international online meeting', desc: 'Six participants meet on a video call; one is speaking.', css: baseCss, body });
}
