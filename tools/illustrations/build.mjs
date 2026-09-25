// Builds every Najma illustration into assets/.
//   node build.mjs            all artwork
//   node build.mjs hero-home  one scene (file name in scenes/, or a spot name)
// Animated scenes also get a "-still" copy that the pages serve when reduced motion is
// requested. Output is optimised with SVGO using svgo.config.mjs.
import { readdirSync, writeFileSync } from 'node:fs';
import { optimize } from 'svgo';
import config from './svgo.config.mjs';
import { STILL } from './lib/palette.mjs';

const root = new URL('../../', import.meta.url);
const target = name => name === 'amina-placeholder'
  ? new URL('assets/teachers/amina-placeholder.svg', root)
  : new URL(`assets/illustrations/${name}.svg`, root);
const only = new Set(process.argv.slice(2));
const write = (name, svg) => {
  const out = optimize(svg, config).data;
  writeFileSync(target(name), out + '\n');
  return out.length;
};

for (const file of readdirSync(new URL('scenes/', import.meta.url)).filter(f => f.endsWith('.mjs')).sort()) {
  const mod = await import(new URL(`scenes/${file}`, import.meta.url));
  const scenes = mod.spots || { [file.replace(/\.mjs$/, '')]: mod.default };
  for (const [name, make] of Object.entries(scenes)) {
    if (only.size && !only.has(name)) continue;
    const svg = make();
    const size = write(name, svg);
    // Animated artwork carries a <style> with keyframes; give it a still twin.
    if (svg.includes('@keyframes')) write(`${name}-still`, svg.replace('</style>', STILL + '</style>'));
    console.log(name.padEnd(22), (size / 1024).toFixed(1) + ' KB');
  }
}
