import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

// baseURL comes from playwright.config.ts
test.use({ viewport: { width: 375, height: 700 }, colorScheme: 'light' });

const DARK_BG = 'rgb(20, 22, 28)';

function rgb(s: string): [number, number, number] {
  const m = s.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) throw new Error(`bad color ${s}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}
function lum(s: string) {
  const [r, g, b] = rgb(s).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

const css = (page: Page, sel: string, prop: string) =>
  page.locator(sel).first().evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop);
const expectTheme = (page: Page, t: 'light' | 'dark') =>
  expect(page.locator('html')).toHaveAttribute('data-theme', t);
const expectBg = (page: Page, color: string) =>
  expect.poll(() => css(page, 'body', 'background-color')).toBe(color);

async function mk(request: APIRequestContext) {
  const tag = `T6-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  const res = await request.post('/api/requests', {
    data: { title: tag, details: 'theme test', doneWhen: 'Theme works', name: 'Robot' },
  });
  expect(res.status()).toBe(201);
  const json = await res.json();
  return { id: json.request.id as number, tag };
}

async function fresh(page: Page, path: string) {
  await page.goto(path);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

for (const path of ['/', '/new']) {
  test(`dark default, toggle, persist on ${path}`, async ({ page, request }) => {
    const made = await mk(request);
    await fresh(page, path);
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
    await expectTheme(page, 'dark');
    await expectBg(page, DARK_BG);

    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await expectTheme(page, 'light');
    await expect.poll(async () => lum(await css(page, 'body', 'background-color'))).toBeGreaterThan(0.8);
    const bg = await css(page, 'body', 'background-color');
    const fg = await css(page, 'body', 'color');
    expect(lum(bg)).toBeGreaterThan(0.8);
    expect(lum(fg)).toBeLessThan(0.3);
    expect(contrast(bg, fg)).toBeGreaterThanOrEqual(4.5);
    if (path === '/') {
      await expect(page.getByRole('heading', { name: made.tag })).toBeVisible();
      expect(lum(await css(page, '.card', 'background-color'))).toBeGreaterThan(0.5);
      expect(lum(await css(page, '.vote', 'background-color'))).toBeGreaterThan(0.5);
    } else {
      expect(lum(await css(page, 'input', 'background-color'))).toBeGreaterThan(0.5);
    }
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');

    await page.reload();
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
    await expectTheme(page, 'light');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
    await page.goto(path === '/' ? '/new' : '/');
    await expectTheme(page, 'light');
    await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');

    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expectTheme(page, 'dark');
    await expect(page.getByRole('button', { name: 'Switch to light mode' })).toBeVisible();
    await expectBg(page, DARK_BG);
  });
}

test('light OS scheme with no stored value is dark', async ({ browser }) => {
  const ctx = await browser.newContext({
    ...test.info().project.use,
    colorScheme: 'light',
    viewport: { width: 375, height: 700 },
  });
  const page = await ctx.newPage();
  await page.goto('/');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  await expectTheme(page, 'dark');
  await expectBg(page, DARK_BG);
  await ctx.close();
});

test('vote button is 56x56 in both themes', async ({ page, request }) => {
  const made = await mk(request);
  await fresh(page, '/');
  const vote = page.locator(`button[aria-label="Upvote request ${made.id}"]`);
  for (const name of ['Switch to light mode', 'Switch to dark mode']) {
    await expect(vote).toBeVisible();
    const b = await vote.boundingBox();
    expect(Math.abs(b!.width - 56)).toBeLessThanOrEqual(1);
    expect(Math.abs(b!.height - 56)).toBeLessThanOrEqual(1);
    await page.getByRole('button', { name }).click();
  }
  const b = await vote.boundingBox();
  expect(Math.abs(b!.width - 56)).toBeLessThanOrEqual(1);
  expect(Math.abs(b!.height - 56)).toBeLessThanOrEqual(1);
});
