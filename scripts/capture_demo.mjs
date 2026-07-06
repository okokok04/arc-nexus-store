import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const outDir = 'assets/demo';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const base = 'https://arc-restaurant.vercel.app';

  console.log('Capturing homepage...');
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/home.png`, fullPage: true });

  console.log('Capturing create page...');
  await page.goto(base + '/create', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/create.png`, fullPage: true });

  console.log('Capturing history page...');
  await page.goto(base + '/history', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/history.png`, fullPage: true });

  console.log('Capturing escrow detail (try /escrow/1)...');
  await page.goto(base + '/escrow/1', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${outDir}/escrow1.png`, fullPage: true });

  await browser.close();

  // Create frames.txt for ffmpeg concat
  const frames = [
    `file '${outDir}/home.png'`,
    `file '${outDir}/create.png'`,
    `file '${outDir}/history.png'`,
    `file '${outDir}/escrow1.png'`
  ].join('\n');
  fs.writeFileSync(`${outDir}/frames.txt`, frames);

  console.log('Screenshots saved to', outDir);
  console.log('Run ffmpeg commands from assets/demo/README.md to make a GIF/MP4.');
})();
