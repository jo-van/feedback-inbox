import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const idea = (page: Page) => page.getByRole('link', { name: 'Suggest an idea' });

test('criterion 1: link reads "Suggest an idea" and points to /new', async ({ page }) => {
  await page.goto('/');
  await expect(idea(page)).toBeVisible();
  await expect(idea(page)).toHaveAttribute('href', '/new');
});

test('criterion 2: no "Suggest a change" link or button remains', async ({ page }) => {
  await page.goto('/');
  await expect(idea(page)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Suggest a change' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Suggest a change' })).toHaveCount(0);
});

test('criterion 3: link keeps btn pinned styling and stays fixed at the top', async ({ page }) => {
  await page.goto('/');
  const link = idea(page);
  await expect(link).toBeVisible();
  await expect(link).toHaveClass(/btn/);
  await expect(link).toHaveClass(/pinned/);
  await expect(link).toHaveCSS('position', 'fixed');

  const top = async () => (await link.boundingBox())!.y;
  expect(Math.abs(await top())).toBeLessThanOrEqual(40);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(0);
  expect(Math.abs(await top())).toBeLessThanOrEqual(40);
});

test('criterion 4: clicking the link opens /new with its heading', async ({ page }) => {
  await page.goto('/');
  await idea(page).click();
  await page.waitForURL(/\/new$/);
  await expect(page.getByRole('heading', { name: 'Suggest a change', level: 1 })).toBeVisible();
});
