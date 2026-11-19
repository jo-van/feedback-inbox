// Screenshot every slide of deck.html at 1920x1080. Run inside the Playwright image:
//   node shoot.mjs <deck.html> <outdir> [count] [extra-url ...]
import { chromium } from '@playwright/test';
const [deck, out, count = '19', ...extra] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
for (let i = 0; i < Number(count); i++) {
  await page.goto(`file://${deck}#${i}`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${out}/slide-${String(i).padStart(2, '0')}.png` });
}
let k = 0;
for (const url of extra) {
  await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${out}/extra-${k++}.png` });
}
await browser.close();
console.log('done');
