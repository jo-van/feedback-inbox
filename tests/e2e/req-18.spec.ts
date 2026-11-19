import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const TEXT = 'Built live at Louisville Startup Week';

test('footer is present once with exact text', async ({ page }) => {
  await page.goto('/');
  const f = page.getByRole('contentinfo');
  await expect(f).toHaveCount(1);
  await expect(f).toBeVisible();
  await expect(f).toHaveText(TEXT);
  await expect(page.locator('footer')).toHaveCount(1);
});

test('footer follows the board and sits below the search input', async ({ page }) => {
  await page.goto('/');
  const search = page.locator('input').first();
  await expect(search).toBeVisible();
  const follows = await page.evaluate(() => {
    const i = document.querySelector('input')!;
    const f = document.querySelector('footer')!;
    const m = document.querySelector('main')!;
    return !!(i.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING) && !!(m.compareDocumentPosition(f) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(follows).toBe(true);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const f = page.getByRole('contentinfo');
  await expect(f).toBeVisible();
  const fb = (await f.boundingBox())!;
  const sb = (await search.boundingBox())!;
  expect(fb.y).toBeGreaterThan(sb.y);
});

test('footer shows with empty filter results', async ({ page }) => {
  await page.goto('/');
  const f = page.getByRole('contentinfo');
  await expect(f).toHaveText(TEXT);
  const search = page.locator('input').first();
  if (await search.isVisible()) {
    await search.fill('zz-req18-' + Date.now());
    await expect(f).toBeVisible();
    await expect(f).toHaveText(TEXT);
  }
});

test('footer shows while loading and with an empty list', async ({ page }) => {
  await page.route('**/api/requests*', async (r) => {
    await new Promise((res) => setTimeout(res, 1500));
    await r.fulfill({ json: { requests: [] } });
  });
  await page.goto('/');
  const f = page.getByRole('contentinfo');
  await expect(f).toHaveText(TEXT);
  await expect(page.getByText('Loading…')).toBeVisible();
  await expect(page.getByText('No requests.')).toBeVisible();
  await expect(f).toHaveText(TEXT);
});

test('footer is absent on /new', async ({ page }) => {
  await page.goto('/new');
  await expect(page.getByRole('contentinfo')).toHaveCount(0);
  await expect(page.getByText(TEXT)).toHaveCount(0);
});

test('regression: Suggest an idea link is still pinned', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Suggest an idea' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/new');
  await expect(link).toHaveCSS('position', 'fixed');
});
