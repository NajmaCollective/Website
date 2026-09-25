// Step 1 of the region pipeline (needs Playwright's Chromium).
// Measures every pose and hair piece (data/bbox.json) and rasterises the poses named in
// data/regions-map.json to data/raster/, white fill on transparent, ready for labelling.
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { exportParts } from '../export-parts.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const data = new URL('../data/', import.meta.url);
if (!existsSync(new URL('parts.json', data))) exportParts(new URL('parts.json', data));
const parts = JSON.parse(readFileSync(new URL('parts.json', data)));
const map = JSON.parse(readFileSync(new URL('regions-map.json', data)));

const piece = (p, bg, ink) => `<g${p.outer ? ` transform="${p.outer}"` : ''}>` + p.paths.map(x =>
  `<path d="${x.d}"${x.transform ? ` transform="${x.transform}"` : ''} fill="${x.role === 'ink' ? ink : bg}"${x.fillRule ? ` fill-rule="${x.fillRule}"` : ''}/>`).join('') + '</g>';

const browser = await chromium.launch();
const page = await browser.newPage();
const items = {};
for (const [k, v] of Object.entries(parts.pose)) items['pose/' + k] = piece(v, '#fff', '#000');
for (const [k, v] of Object.entries(parts.hair)) items['hair/' + k] = `<g transform="translate(225 0)">${piece(v, '#fff', '#000')}</g>`;
await page.setContent('<svg xmlns="http://www.w3.org/2000/svg">' + Object.entries(items).map(([k, s]) => `<g id="${k}">${s}</g>`).join('') + '</svg>');
const boxes = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('svg > g')].map(g => { const b = g.getBBox(); return [g.id, [b.x, b.y, b.width, b.height].map(Math.round)]; })));
writeFileSync(new URL('bbox.json', data), JSON.stringify(boxes, null, 1));

const S = 1.25, PAD = 20, raster = new URL('raster/', data);
mkdirSync(raster, { recursive: true });
const meta = {};
for (const name of Object.keys(map)) {
  const [x, y, w, h] = boxes['pose/' + name];
  const vx = x - PAD, vy = y - PAD, vw = w + 2 * PAD, vh = h + 2 * PAD, W = Math.ceil(vw * S), H = Math.ceil(vh * S);
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(`<body style="margin:0;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${vx} ${vy} ${vw} ${vh}" shape-rendering="crispEdges">${piece(parts.pose[name], '#ffffff', '#000000')}</svg></body>`);
  await page.screenshot({ path: new URL(`${name}.png`, raster).pathname, omitBackground: true, clip: { x: 0, y: 0, width: W, height: H } });
  meta[name] = { vx, vy, vw, vh, W, H, S };
}
writeFileSync(new URL('meta.json', raster), JSON.stringify(meta, null, 1));
await browser.close();
console.log('rasterised', Object.keys(meta).length, 'poses');
