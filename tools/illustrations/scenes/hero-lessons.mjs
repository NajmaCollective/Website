import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, rr, doc, f, emerge, checkRow, videoTile, bubble } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Lessons hero: a teacher points to the plan for a 55-minute lesson.
export default function () {
  const W = 600, H = 600;
  const base = { cx: 226, cy: 356, r: 188 };
  const teacher = figure({ pose: 'DotJacket', hair: 'LongCurly', face: 'Smile',
    c: { ink: INK, skin: SKIN[2], cloth: P.sage }, place: { cx: 240, bottom: 572, height: 352 } });
  const card = { x: 350, y: 176, w: 222, h: 222 };
  const ring = { cx: 470, cy: 112, r: 50 };
  const arc = (a) => { const t = (a - 90) * Math.PI / 180; return [ring.cx + ring.r * Math.cos(t), ring.cy + ring.r * Math.sin(t)]; };
  const [ex, ey] = arc(330);
  const body = `
  <g class="spin-slow" style="transform-origin:${base.cx}px ${base.cy}px"><path d="${shape('cookie12', base.cx, base.cy, base.r + 36)}" fill="${P.peach}"/></g>
  <path d="${shape('clover4', 86, 150, 58, 12)}" fill="${P.sage}" class="spin-rev" style="transform-origin:86px 150px"/>
  <circle cx="520" cy="500" r="66" fill="${P.mint}" class="breathe" style="transform-origin:520px 500px"/>
  ${emerge({ d: shape('circle', base.cx, base.cy, base.r), cut: base.cy - 60, fig: teacher })}
  <g class="float2">
    <path d="${rr(card.x, card.y, card.w, card.h, 22)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.4"/>
    <path d="M${card.x} ${card.y + 22} a22 22 0 0 1 22 -22 h${card.w - 44} a22 22 0 0 1 22 22 v44 h-${card.w} z" fill="${P.mint}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>
    ${najmaStar(card.x + 34, card.y + 34, 13, P.forest, ' class="twinkle t2"')}
    <rect x="${card.x + 60}" y="${card.y + 24}" width="112" height="12" rx="6" fill="${P.forest}"/>
    ${checkRow({ x: card.x + 22, y: card.y + 98, w: 128, ink: INK, fill: P.peachDeep, bar: P.sage })}
    ${checkRow({ x: card.x + 22, y: card.y + 140, w: 104, ink: INK, fill: P.peachDeep, bar: P.sage })}
    ${checkRow({ x: card.x + 22, y: card.y + 182, w: 120, ink: INK, fill: P.peachDeep, done: false, bar: P.sage })}
  </g>
  <g class="timer">
    <circle cx="${ring.cx}" cy="${ring.cy}" r="${ring.r + 16}" fill="${P.paper}" stroke="${INK}" stroke-width="3.4"/>
    <circle cx="${ring.cx}" cy="${ring.cy}" r="${ring.r}" fill="none" stroke="${P.sage}" stroke-width="12"/>
    <path d="M${ring.cx} ${ring.cy - ring.r} A${ring.r} ${ring.r} 0 1 1 ${f(ex)} ${f(ey)}" fill="none" stroke="${P.terracotta}" stroke-width="12" stroke-linecap="round" pathLength="100" class="arc"/>
    <path d="M${ring.cx} ${ring.cy} V${ring.cy - 30}" stroke="${INK}" stroke-width="4" stroke-linecap="round" class="hand"/>
    <circle cx="${ring.cx}" cy="${ring.cy}" r="6" fill="${INK}"/>
    <rect x="${ring.cx - 10}" y="${ring.cy - ring.r - 30}" width="20" height="12" rx="4" fill="${P.terracotta}" stroke="${INK}" stroke-width="3"/>
  </g>
  ${videoTile({ x: 414, y: 452, w: 158, h: 126, r: 20, bg: P.sage, ink: INK, fig: figure({ pose: 'Coffee', hair: 'ShortCurly', face: 'Smile', facialHair: 'GoateeCircle', c: { ink: INK, skin: SKIN[4], cloth: P.terracotta, cloth2: P.peach, prop: P.cream }, place: { cx: 494, bottom: 596, height: 152 } }), extra: ' class="float"' })}
  ${bubble({ x: 440, y: 404, w: 84, h: 42, r: 18, fill: P.paper, stroke: INK, sw: 3, tail: { side: 'b', at: 0.3, len: 14, width: 16 }, dots: true, lineColor: P.forest, extra: ' class="pop p2"' })}
  ${najmaStar(300, 70, 15, P.terracotta, ' class="twinkle t1"')}
  ${twinkle(360, 470, 10, P.forest, ' class="twinkle t3"')}
  ${twinkle(40, 318, 9, P.terracotta, ' class="twinkle t4"')}
  <circle cx="352" cy="120" r="5" fill="${P.forest}"/><circle cx="590" cy="380" r="4.5" fill="${P.terracotta}"/>
  `;
  const css = baseCss + `
  .arc{stroke-dasharray:92 100;animation:arc 2.4s cubic-bezier(.2,.7,.2,1) .3s both}
  .hand{transform-origin:${ring.cx}px ${ring.cy}px;animation:tick 12s linear 2}
  .row .tick{stroke-dasharray:30;animation:tick-in 9s ease-out 2}
  .row:nth-of-type(2) .tick{animation-delay:.5s}
  .row .line{transform-box:fill-box;transform-origin:0 50%;animation:type 9s ease-out 2}
  @keyframes arc{from{stroke-dasharray:0 100}}
  @keyframes tick{to{transform:rotate(360deg)}}
  @keyframes tick-in{0%,8%{stroke-dashoffset:30}18%,100%{stroke-dashoffset:0}}`;
  return doc({ w: W, h: H, title: 'Planning an English lesson', desc: 'A teacher points to a lesson plan with a checklist and a timer for a 55-minute lesson.', css, body });
}
