import { figure } from '../lib/figure.mjs';
import { shape, najmaStar, twinkle, doc, f } from '../lib/kit.mjs';
import { P, INK, SKIN, baseCss } from '../lib/palette.mjs';

// Where Najma came from: an olive tree grows from an open book; people tend it together.
export default function () {
  const W = 600, H = 500;
  const bx = 300, by = 430; // spine bottom of the open book
  const page = (dir) => {
    const s = dir;
    return `<path d="M${bx} ${by - 26} C ${bx + s * 60} ${by - 52}, ${bx + s * 150} ${by - 48}, ${bx + s * 236} ${by - 24} L ${bx + s * 236} ${by + 12} C ${bx + s * 150} ${by - 12}, ${bx + s * 60} ${by - 14}, ${bx} ${by + 14} Z" fill="${P.paper}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>` +
      [0, 1, 2].map(i => `<path d="M${bx + s * (40 + i * 60)} ${by - 30 - (i === 0 ? 4 : 0) + i * 1} C ${bx + s * (60 + i * 60)} ${by - 36}, ${bx + s * (80 + i * 60)} ${by - 36}, ${bx + s * (96 + i * 60)} ${by - 32}" fill="none" stroke="${P.sageDeep}" stroke-width="3" stroke-linecap="round"/>`).join('');
  };
  const cover = `<path d="M${bx - 250} ${by - 20} L ${bx - 250} ${by + 22} C ${bx - 150} ${by + 6}, ${bx - 60} ${by + 10}, ${bx} ${by + 30} C ${bx + 60} ${by + 10}, ${bx + 150} ${by + 6}, ${bx + 250} ${by + 22} L ${bx + 250} ${by - 20} Z" fill="${P.forest}" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`;
  // olive tree: trunk + branches (strokes), leaves (lanceolate) and olives
  const trunk = `<path d="M${bx - 6} ${by - 8} C ${bx - 16} ${by - 70}, ${bx + 10} ${by - 110}, ${bx - 4} ${by - 170}" fill="none" stroke="${P.terracotta}" stroke-width="16" stroke-linecap="round"/>` +
    `<path d="M${bx - 6} ${by - 8} C ${bx - 16} ${by - 70}, ${bx + 10} ${by - 110}, ${bx - 4} ${by - 170}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".0"/>`;
  const branches = [
    [bx - 4, by - 150, bx - 80, by - 230, bx - 130, by - 250], [bx - 2, by - 170, bx + 30, by - 250, bx + 110, by - 280],
    [bx - 6, by - 110, bx + 60, by - 150, bx + 140, by - 160], [bx - 8, by - 120, bx - 60, by - 150, bx - 150, by - 170], [bx - 4, by - 170, bx - 10, by - 250, bx - 20, by - 320],
  ].map(([x0, y0, cx, cy, x1, y1]) => `<path d="M${x0} ${y0} Q ${cx} ${cy} ${x1} ${y1}" fill="none" stroke="${P.terracotta}" stroke-width="7" stroke-linecap="round"/>`).join('');
  let seed = 11; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  // canopy: soft overlapping crowns behind the leaves
  const crowns = [[bx - 96, by - 222, 70], [bx + 70, by - 238, 78], [bx - 16, by - 290, 70], [bx + 116, by - 168, 52], [bx - 128, by - 164, 50]];
  const canopy = crowns.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${[P.sageDeep, P.mintDeep, P.sage][i % 3]}" opacity=".55"/>`).join('');
  // olive twigs: pairs of slender leaves along short sprigs inside each crown
  const leaves = [];
  crowns.forEach(([cx, cy, r], i) => {
    for (let j = 0; j < 5; j++) {
      const a = rnd() * Math.PI * 2, d = rnd() * r * 0.7, x0 = cx + Math.cos(a) * d, y0 = cy + Math.sin(a) * d * 0.8;
      const ang = -30 - rnd() * 120, len = 30 + rnd() * 16;
      const ux = Math.cos(ang * Math.PI / 180), uy = Math.sin(ang * Math.PI / 180);
      leaves.push(`<path d="M${f(x0)} ${f(y0)} l${f(ux * len)} ${f(uy * len)}" stroke="${P.terracotta}" stroke-width="3" stroke-linecap="round"/>`);
      for (let k = 0; k < 3; k++) {
        const t = 0.3 + k * 0.3, px = x0 + ux * len * t, py = y0 + uy * len * t;
        for (const side of [-1, 1]) {
          const la = ang + side * 48;
          leaves.push(`<path d="M0 0 C 7 -5, 24 -5, 32 0 C 24 5, 7 5, 0 0 Z" transform="translate(${f(px)} ${f(py)}) rotate(${f(la)})" fill="${[P.forest, P.olive, P.forest, P.mintDeep][(i + j + k) % 4]}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`);
        }
      }
    }
  });
  const olives = [[bx - 110, by - 238], [bx + 90, by - 262], [bx + 120, by - 150], [bx - 130, by - 160], [bx + 30, by - 222], [bx - 40, by - 300], [bx + 58, by - 290]]
    .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="7.5" ry="9.5" fill="${P.olive}" stroke="${INK}" stroke-width="2.4"/><circle cx="${x - 2}" cy="${y - 3}" r="2" fill="${P.sage}"/>`).join('');
  const reader = figure({ pose: 'OneLegUpBW', hair: 'MediumBangs', face: 'Calm', c: { ink: INK, skin: SKIN[2], cloth: P.peach, cloth2: P.cream, shoe: P.terracotta, sole: P.cream, sock: P.mint }, place: { cx: 132, bottom: by - 20, height: 150 } });
  const walker = figure({ pose: 'EasingWB', hair: 'ShortCurly', face: 'Smile', flip: true, c: { ink: INK, skin: SKIN[4], cloth: P.sage, cloth2: P.cream, shoe: P.cream, sock: P.peach }, place: { cx: 466, bottom: by - 22, height: 196 } });
  const body = `
  <g class="spin-slow" style="transform-origin:300px 220px"><path d="${shape('sunny', 300, 220, 212, 0)}" fill="${P.mint}" opacity=".7"/></g>
  <path d="M60 80 L150 40 L260 56 M340 30 L450 44 L540 90" fill="none" stroke="${P.forestSoft}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" class="flow"/>
  ${najmaStar(60, 80, 10, P.forest, ' class="twinkle t2"')}${najmaStar(150, 40, 8, P.terracotta, ' class="twinkle t4"')}${najmaStar(450, 44, 9, P.terracotta, ' class="twinkle t1"')}${najmaStar(540, 90, 12, P.forest, ' class="twinkle t3"')}
  <ellipse cx="300" cy="${by + 38}" rx="280" ry="14" fill="${P.sandDeep}" opacity=".7"/>
  ${cover}${page(-1)}${page(1)}
  <g class="tree">${canopy}${trunk}${branches}${leaves.join('')}${olives}</g>
  ${reader}${walker}
  ${najmaStar(300, 72, 17, P.terracotta, ' class="twinkle t5"')}
  `;
  const css = baseCss + `.tree{transform-box:fill-box;transform-origin:50% 100%;animation:grow-tree 1.6s cubic-bezier(.34,1.2,.64,1) both, sway 9s ease-in-out 1.6s 3}
  @keyframes grow-tree{from{transform:scale(.2);opacity:0}}@keyframes sway{50%{transform:rotate(1.2deg)}}`;
  return doc({ w: W, h: H, title: 'Growing from shared roots', desc: 'An olive tree grows from an open book while two people read and look on.', css, body });
}
