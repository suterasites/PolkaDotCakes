import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, 'Assets');
const previewDir = path.join(__dirname, 'asset-previews');
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

const avifs = fs.readdirSync(assetsDir).filter(f => f.toLowerCase().endsWith('.avif'));

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();

for (const f of avifs) {
  const dataUrl = 'data:image/avif;base64,' + fs.readFileSync(path.join(assetsDir, f)).toString('base64');
  const html = `<!doctype html><html><head><style>body{margin:0;background:#fff}img{display:block}</style></head><body><img id="i" src="${dataUrl}"></body></html>`;
  await page.setContent(html);
  await page.waitForFunction(() => {
    const img = document.getElementById('i');
    return img.complete && img.naturalWidth > 0;
  }, { timeout: 10000 });
  const dims = await page.evaluate(() => {
    const img = document.getElementById('i');
    return { w: img.naturalWidth, h: img.naturalHeight };
  });
  const scale = Math.min(1200 / dims.w, 1);
  const targetW = Math.round(dims.w * scale);
  const targetH = Math.round(dims.h * scale);
  await page.setViewport({ width: targetW, height: targetH });
  await page.evaluate((w, h) => {
    const img = document.getElementById('i');
    img.style.width = w + 'px';
    img.style.height = h + 'px';
  }, targetW, targetH);
  const out = path.join(previewDir, f.replace(/\.avif$/i, '.png'));
  await page.screenshot({ path: out, omitBackground: false, clip: { x: 0, y: 0, width: targetW, height: targetH } });
  console.log('converted', f, '->', path.basename(out), `${dims.w}x${dims.h}`);
}

await browser.close();
