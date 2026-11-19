import { expect, test, type Locator, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const u = Date.now().toString(36);

test.beforeAll(async ({ playwright }, info) => {
  const request = await playwright.request.newContext({ baseURL: info.project.use.baseURL });
  for (let i = 0; i < 12; i++) {
    const res = await request.post('/api/requests', {
      data: { title: `Pin${u}${i}`, doneWhen: 'The link stays pinned', name: 'Robot' },
    });
    expect(res.status()).toBe(201);
  }
  await request.dispose();
});

type Box = { x: number; y: number; width: number; height: number };
const intersects = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const cards = (page: Page) => page.getByTestId('request-card');
const link = (page: Page) => page.getByRole('link', { name: 'Suggest an idea' });
const scrollY = (page: Page) => page.evaluate(() => window.scrollY);
const scrollDown = async (page: Page) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => scrollY(page)).toBeGreaterThan(0);
};
async function open(page: Page) {
  await page.goto('/');
  await expect(cards(page).first()).toBeVisible();
}
const box = async (l: Locator) => (await l.boundingBox())!;

test('visible before scroll', async ({ page }) => {
  await open(page);
  await expect(link(page)).toBeVisible();
});

test('pinned after scroll', async ({ page }) => {
  await open(page);
  await scrollDown(page);
  await expect(link(page)).toBeVisible();
  const b = await box(link(page));
  expect(b.y).toBeGreaterThanOrEqual(0);
  expect(b.y).toBeLessThanOrEqual(80);
  expect(await link(page).evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
});

test('click after scroll navigates', async ({ page }) => {
  await open(page);
  await scrollDown(page);
  await link(page).click();
  await expect(page).toHaveURL(/\/new$/);
});

test('no overlap', async ({ page }) => {
  await open(page);
  await scrollDown(page);
  const l = await box(link(page));
  const top = page.getByTestId('back-to-top');
  await expect(top).toBeVisible();
  expect(intersects(l, await box(top))).toBe(false);
  const votes = page.locator('[aria-label^="Upvote request"]');
  const n = await votes.count();
  for (let i = 0; i < n; i++) {
    const v = votes.nth(i);
    if (await v.isVisible()) {
      const vb = await v.boundingBox();
      if (vb) expect(intersects(l, vb)).toBe(false);
    }
  }
  await top.click();
  await expect.poll(() => scrollY(page), { timeout: 2500 }).toBe(0);
});

test('top layout', async ({ page }) => {
  await open(page);
  expect(await scrollY(page)).toBe(0);
  const h = page.getByRole('heading', { name: /Feedback Inbox/ });
  await expect(link(page)).toBeVisible();
  await expect(h).toBeVisible();
  expect(intersects(await box(link(page)), await box(h))).toBe(false);
});

test('/new unchanged', async ({ page }) => {
  await page.goto('/new');
  await expect(page.getByRole('heading', { name: 'Suggest a change', level: 1 })).toBeVisible();
  await expect(page.locator('form input, form textarea').first()).toBeVisible();
  await expect(page.locator('a.pinned')).toHaveCount(0);
});
