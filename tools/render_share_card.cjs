// Renders tools/share-card.html to assets/brand/share-card.jpg (1200 × 630).
// Usage: node tools/render_share_card.cjs   (needs `npm i playwright` and a Chromium)
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(root, 'tools/share-card.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, 'assets/brand/share-card.jpg'), type: 'jpeg', quality: 86 });
  await browser.close();
})();
