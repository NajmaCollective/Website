// Renders the closing-band loops in tools/loops/ to lossless-quality masters.
//
//   node tools/render_loops.cjs OUT_DIR [piece ...]
//
// Each piece becomes OUT_DIR/<piece>.mkv: 1920 × 1080, 24 fps, 12 seconds,
// x264 at near-lossless quality. tools/encode_video.sh turns a master into the
// files the site serves. The masters are large and can always be rebuilt from
// tools/loops/, so they stay out of git.
// Needs Node, Playwright with a Chromium, and ffmpeg.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FPS = 24;
const SECONDS = 12;
const ALL = ['constellation', 'rhythm', 'unfolding', 'woven', 'voices'];
const [out = 'loop-masters', ...picked] = process.argv.slice(2);
const pieces = picked.length ? picked : ALL;

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  fs.readFile(path.join(ROOT, p), (err, data) => {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : 'text/html' });
    res.end(data);
  });
});

(async () => {
  fs.mkdirSync(out, { recursive: true });
  await new Promise(resolve => server.listen(0, resolve));
  const browser = await chromium.launch();
  for (const name of pieces) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    await page.goto(`http://127.0.0.1:${server.address().port}/tools/loops/?capture&piece=${name}`);
    await page.waitForFunction(() => window.ready);
    const canvas = await page.$('canvas');
    const file = path.join(out, `${name}.mkv`);
    const ffmpeg = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '8', '-pix_fmt', 'yuv444p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const frames = FPS * SECONDS;
    for (let i = 0; i < frames; i++) {
      await page.evaluate(t => window.frame(t), i / frames);
      const png = await canvas.screenshot({ type: 'png' });
      if (!ffmpeg.stdin.write(png)) await new Promise(resolve => ffmpeg.stdin.once('drain', resolve));
    }
    ffmpeg.stdin.end();
    await new Promise((resolve, reject) => ffmpeg.on('close', code => code ? reject(new Error(`ffmpeg ${code}`)) : resolve()));
    console.log(`${name}: ${frames} frames → ${file}`);
    await page.close();
  }
  await browser.close();
  server.close();
})();
