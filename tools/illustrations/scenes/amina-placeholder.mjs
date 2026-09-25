import { najmaStar, twinkle, doc, f } from '../lib/kit.mjs';
import { P, INK } from '../lib/palette.mjs';

// Profile placeholder while a teacher's photograph is pending: her initial, set in
// Roboto Flex, so no likeness is invented before an approved photograph exists.
// The page crops it into an arch.
export default function () {
  const W = 480, H = 360;
  // Capital A from Roboto Flex (wght 660, wdth 104, opsz 72), in font units with y pointing up.
  const glyph = 'M-17.116730804991676 0H290.80592251069174L598.087942858343 1020.6579459455679Q609.3756649535571 1059.8503135595165 617.479707811337 1089.509190310313Q625.5837506691169 1119.1680670611095 632.3926289572119 1143.7602737604248H636.0127584828733Q642.8798182648097 1119.205066301838 650.6164471921002 1089.3835927217006Q658.3530761193906 1059.562119141563 670.2848992536019 1020.3624685850809L987.1838816047239 0H1305.764822336423L823.3950819439051 1457.4569985845446H471.27966472717526ZM247.03249073864572 311.8301063776016H1033.2860957656012L978.3474215818715 526.3499384837341H298.9742846412191Z';
  const s = 0.108, gw = (1305.8 + 17.1) * s, gh = 1457.5 * s;
  const ax = 240 - gw / 2 + 17.1 * s, base = 290;
  let dots = '';
  for (let y = 20; y < H; y += 28) for (let x = 18 + ((y / 28) % 2) * 14; x < W; x += 28) dots += `<circle cx="${x}" cy="${y}" r="2.2"/>`;
  const body = `
  <rect width="${W}" height="${H}" fill="${P.mint}"/>
  <g fill="${P.mintDeep}" opacity=".7">${dots}</g>
  <circle cx="240" cy="210" r="112" fill="${P.paper}" opacity=".55"/>
  <path d="${glyph}" transform="translate(${f(ax)} ${base}) scale(${s} ${-s})" fill="${P.forest}"/>
  ${najmaStar(300, 122, 15, P.terracotta)}
  ${twinkle(90, 92, 11, P.forest)}${twinkle(396, 250, 9, P.terracotta)}
  <circle cx="400" cy="84" r="5" fill="${P.forest}"/><circle cx="76" cy="268" r="4.5" fill="${P.terracotta}"/>`;
  return doc({ w: W, h: H, title: 'Profile photograph to follow', desc: 'The initial A, shown until a photograph is available.', body });
}
