// Records the live Factory Floor to video while a real run happens.
// Run inside the Playwright image: node record-floor.mjs <url> <outdir> <maxMinutes> <requestId>
// Stops when the request is released / parked / rejected (plus a short tail) or at maxMinutes.
import { chromium } from '@playwright/test';

const [url, out, maxMin = '25', id] = process.argv.slice(2);
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: out, size: { width: 1920, height: 1080 } } });
const page = await context.newPage();
await page.goto(url + (url.includes('?') ? '&' : '?') + 'focus=' + id);
const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
await page.addStyleTag({ content: `body::after{content:"PREVIOUS RUN · recorded ${stamp} · not today's audience request";position:fixed;left:50%;bottom:10px;transform:translateX(-50%);background:#ffc928;color:#1a1500;font:800 26px system-ui;padding:8px 18px;border-radius:10px;z-index:99}` });
const until = Date.now() + Number(maxMin) * 60_000;
let doneAt = 0;
while (Date.now() < until) {
  await page.waitForTimeout(10_000);
  const s = await page.evaluate(async (rid) => {
    const r = await fetch('/api/factory-status', { cache: 'no-store' }).then((x) => x.json()).catch(() => null);
    return r?.tickets?.find((t) => String(t.id) === String(rid))?.stage;
  }, id);
  if (!doneAt && ['released', 'needs_human', 'rejected'].includes(s)) doneAt = Date.now();
  if (doneAt && Date.now() - doneAt > 25_000) break;
}
await context.close();
await browser.close();
console.log('recorded');
