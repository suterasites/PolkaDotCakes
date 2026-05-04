import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataUrl = 'data:image/avif;base64,' + fs.readFileSync(path.join(__dirname, 'Assets/logo.avif')).toString('base64');

const html = `<!doctype html><html><head><style>
  html,body{margin:0;background:transparent}
  .stage{position:relative;width:256px;height:256px;background:transparent}
  .crop{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
  /* Logo intrinsic 647x183. Cake occupies roughly x: 60..280 (220px wide). Center that square inside 256x256 with a tiny inset. */
  .crop img{height:240px;width:auto;object-fit:cover;object-position:-65px 0;transform:translateX(0);clip-path:inset(0 calc(100% - 240px) 0 0)}
</style></head><body>
<div class="stage">
  <div class="crop">
    <img id="i" src="${dataUrl}" alt="" />
  </div>
</div></body></html>`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 256, height: 256, deviceScaleFactor: 2 });
await page.setContent(html);
await page.waitForFunction(() => {
  const i = document.getElementById('i');
  return i && i.complete && i.naturalWidth > 0;
}, { timeout: 10000 });

// Use a simpler approach: draw to canvas with cropping math
const buf = await page.evaluate(async (src) => {
  const img = new Image();
  img.src = src;
  await new Promise(r => { img.onload = r; });
  // Logo intrinsic 647x183. Auto-detect cake bounds via alpha-trim of the left ~280px region.
  const probe = document.createElement('canvas');
  probe.width = img.naturalWidth; probe.height = img.naturalHeight;
  probe.getContext('2d').drawImage(img, 0, 0);
  const id = probe.getContext('2d').getImageData(0, 0, Math.min(290, img.naturalWidth), img.naturalHeight);
  let minX = id.width, minY = id.height, maxX = 0, maxY = 0;
  for (let y = 0; y < id.height; y++) {
    for (let x = 0; x < id.width; x++) {
      const i = (y * id.width + x) * 4;
      const r = id.data[i], g = id.data[i+1], b = id.data[i+2], a = id.data[i+3];
      // treat near-white or transparent as background
      const isBg = a < 8 || (r > 245 && g > 245 && b > 245);
      if (!isBg) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  const sx = Math.max(0, minX - 4);
  const sy = Math.max(0, minY - 4);
  const sw = Math.min(img.naturalWidth - sx, (maxX - minX) + 8);
  const sh = Math.min(img.naturalHeight - sy, (maxY - minY) + 8);
  const out = 256;
  const c = document.createElement('canvas');
  c.width = out; c.height = out;
  const ctx = c.getContext('2d');
  // transparent background
  // fit cake into out x out preserving aspect
  const scale = Math.min(out / sw, out / sh) * 0.92;
  const dw = sw * scale, dh = sh * scale;
  const dx = (out - dw) / 2, dy = (out - dh) / 2;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  return c.toDataURL('image/png');
}, dataUrl);

const b64 = buf.split(',')[1];
fs.writeFileSync(path.join(__dirname, 'Assets/favicon.png'), Buffer.from(b64, 'base64'));
console.log('Wrote Assets/favicon.png');

await browser.close();
