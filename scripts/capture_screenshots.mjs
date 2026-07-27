import { chromium } from 'playwright';
import fs from 'fs';

const BASE = process.env.CAPTURE_BASE_URL || 'http://localhost:5173';
const OUT_DIR = 'docs/screenshots';

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();

  const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktop.goto(BASE, { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(1000);
  await desktop.screenshot({ path: `${OUT_DIR}/desktop-ui.png`, fullPage: true });
  await desktop.close();
  console.log('Saved desktop-ui.png');

  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobile.goto(BASE, { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(1000);
  await mobile.screenshot({ path: `${OUT_DIR}/mobile-ui.png`, fullPage: true });
  await mobile.close();
  console.log('Saved mobile-ui.png');

  await browser.close();
})();
