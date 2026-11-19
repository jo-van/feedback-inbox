import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const TEXT = 'Built live at Startup Week Louisville';

for (const path of ['/', '/new']) {
  test(`footer renders on ${path}`, async ({ page }) => {
    await page.goto(path);
    const footer = page.locator('footer');
    await expect(footer).toHaveCount(1);
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer).toHaveText(TEXT);
  });

  test(`footer follows main and is reachable at the bottom on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('footer')).toHaveCount(1);
    const follows = await page.evaluate(() => {
      const main = document.querySelector('main');
      const footer = document.querySelector('footer');
      if (!main || !footer) return false;
      return Boolean(main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(follows).toBeTruthy();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer')).toBeInViewport();
  });
}
