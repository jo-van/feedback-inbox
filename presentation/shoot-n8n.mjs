// Screenshot the n8n canvas (Factory Line and Builder). Run in the Playwright image with --network host.
import { chromium } from '@playwright/test';
const [out, email, password] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://127.0.0.1:5678/signin');
await page.fill('input[type=email], input[name=emailOrLdapLoginId], input[name=email]', email);
await page.fill('input[type=password]', password);
await page.keyboard.press('Enter');
await page.waitForTimeout(4000);
for (const [id, name] of [['ffFactoryLine001', 'line'], ['ffStationBuild01', 'builder']]) {
  await page.goto(`http://127.0.0.1:5678/workflow/${id}`);
  await page.waitForTimeout(5000);
  await page.keyboard.press('Shift+1').catch(() => {});
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/n8n-${name}.png` });
}
await browser.close();
console.log('done');
