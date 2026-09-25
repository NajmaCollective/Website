// Extracts every Open Peeps piece (CC0 artwork by Pablo Stanley, via the MIT-licensed
// react-peeps package) into data/parts.json: path data, transforms and whether each
// path is the piece's fill ("bg") or its linework ("ink").
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const P = require('react-peeps');

const BG = '#ABCDEF', INK = '#123456';
function parse(Comp) {
  const s = renderToStaticMarkup(React.createElement(Comp, { strokeColor: INK, backgroundColor: BG }));
  const outer = (s.match(/^<g(?: transform="([^"]*)")?>/) || [])[1] || '';
  const paths = [...s.matchAll(/<path ([^>]*)>/g)].map(m => {
    const a = {};
    for (const x of m[1].matchAll(/([\w-]+)="([^"]*)"/g)) a[x[1]] = x[2];
    const role = a.fill === BG ? 'bg' : a.fill === INK ? 'ink' : 'other';
    return { role, d: a.d, transform: a.transform || '', fillRule: a['fill-rule'] || '', fill: role === 'other' ? a.fill : undefined };
  });
  return { outer, paths };
}

export function exportParts(file) {
  const out = { pose: {}, hair: {}, face: {}, facialHair: {}, accessories: {} };
  for (const set of [P.BustPose, P.SittingPose, P.StandingPose]) for (const k of Object.keys(set)) out.pose[k] = parse(set[k]);
  for (const k of Object.keys(P.Hair)) out.hair[k] = parse(P.Hair[k]);
  for (const k of Object.keys(P.Face)) out.face[k] = parse(P.Face[k]);
  for (const k of Object.keys(P.FacialHair)) out.facialHair[k] = parse(P.FacialHair[k]);
  for (const k of Object.keys(P.Accessories)) out.accessories[k] = parse(P.Accessories[k]);
  writeFileSync(file, JSON.stringify(out));
}

if (import.meta.url === `file://${process.argv[1]}`) exportParts(new URL('data/parts.json', import.meta.url));
