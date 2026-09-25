import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, rr, emerge, f } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Checking a level: a learner answers questions on a phone; a level ladder rises beside them.
export default function () {
  const W = 600, H = 500;
  const base = { cx: 206, cy: 290, r: 170 };
  const learner = figure({ pose: 'Device', hair: 'MediumBangs', face: 'Smile', c: { ink: INK, skin: SKIN[2], cloth: P.forest, prop: P.paper }, place: { cx: 214, bottom: 470, height: 322 } });
  const card = { x: 346, y: 70, w: 220, h: 262 };
  const opt = (y, sel) => `<g class="opt"><path d="${rr(card.x + 20, y, card.w - 40, 38, 19)}" fill="${sel ? P.mint : P.paper}" stroke="${INK}" stroke-width="3"/>` +
    `<circle cx="${card.x + 42}" cy="${y + 19}" r="9" fill="${sel ? P.forest : P.paper}" stroke="${INK}" stroke-width="3"/>` +
    `<rect x="${card.x + 62}" y="${y + 14}" width="${sel ? 96 : 80}" height="10" rx="5" fill="${sel ? P.forest : P.sageDeep}"/></g>`;
  const ladder = [0.28, 0.42, 0.56, 0.7, 0.84, 1].map((h, i) =>
    `<rect x="${card.x + 22 + i * 30}" y="${f(card.y + card.h + 110 - h * 90)}" width="22" height="${f(h * 90)}" rx="6" fill="${i < 4 ? [P.peachDeep, P.clay, P.terracotta, P.forest][i] : P.paper}" stroke="${INK}" stroke-width="3" class="lvl v${i}"/>`).join('');
  const body = `
  <g class="spin-slow" style="transform-origin:${base.cx}px ${base.cy}px"><path d="${shape('cookie9', base.cx, base.cy, base.r + 34, 10)}" fill="${P.paper}" opacity=".85"/></g>
  <path d="${shape('clover4', 548, 440, 38, 30)}" fill="${P.peach}" class="spin-rev" style="transform-origin:548px 440px"/>
  ${emerge({ d: shape('circle', base.cx, base.cy, base.r), cut: base.cy - 40, fig: learner })}
  <g class="float2">
    <path d="${rr(card.x, card.y, card.w, card.h, 24)}" fill="${P.paper}" stroke="${INK}" stroke-width="3.4"/>
    <rect x="${card.x + 20}" y="${card.y + 26}" width="150" height="12" rx="6" fill="${P.forest}"/>
    <rect x="${card.x + 20}" y="${card.y + 48}" width="112" height="10" rx="5" fill="${P.sageDeep}"/>
    ${opt(card.y + 84, false)}${opt(card.y + 134, true)}${opt(card.y + 184, false)}
    <path d="M${card.x + card.w - 46} ${card.y + 153} l6 7 l12 -14" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" class="check"/>
  </g>
  <path d="M${card.x + 10} ${card.y + card.h + 110} H${card.x + 210}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>
  ${ladder}
  ${najmaStar(card.x + 124, card.y + card.h + 20, 12, P.terracotta, ' class="twinkle t1"')}
  ${najmaStar(64, 80, 15, P.terracotta, ' class="twinkle t2"')}
  ${twinkle(300, 40, 10, P.forest, ' class="twinkle t3"')}
  <circle cx="40" cy="300" r="4.5" fill="${P.forest}"/><circle cx="330" cy="470" r="4.5" fill="${P.terracotta}"/>
  `;
  const css = baseCss + `.lvl{transform-box:fill-box;transform-origin:50% 100%;animation:grow 1s cubic-bezier(.34,1.4,.64,1) both}.v1{animation-delay:.1s}.v2{animation-delay:.2s}.v3{animation-delay:.3s}.v4{animation-delay:.4s}.v5{animation-delay:.5s}
  .check{stroke-dasharray:34;animation:draw 9s ease-out 2}@keyframes draw{0%,10%{stroke-dashoffset:34}22%,100%{stroke-dashoffset:0}}@keyframes grow{from{transform:scaleY(0)}}`;
  return doc({ w: W, h: H, title: 'Checking an English level', desc: 'A learner answers multiple-choice questions on a phone beside a rising level chart.', css, body });
}
