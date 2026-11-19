import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const u = Date.now().toString(36);

test.beforeAll(async ({ playwright }, info) => {
  const request = await playwright.request.newContext({ baseURL: info.project.use.baseURL });
  for (let i = 0; i < 12; i++) {
    const res = await request.post('/api/requests', {
      data: { title: `Top${u}${i}`, doneWhen: 'It scrolls to the top', name: 'Robot' },
    });
    expect(res.status()).toBe(201);
  }
  await request.dispose();
});

const cards = (page: Page) => page.getByTestId('request-card');
const top = (page: Page) => page.getByTestId('back-to-top');
const scrollY = (page: Page) => page.evaluate(() => window.scrollY);
const scrollDown = async (page: Page) => {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => scrollY(page)).toBeGreaterThan(0);
};

async function open(page: Page) {
  await page.goto('/');
  await expect(cards(page).first()).toBeVisible();
}

test('render and position', async ({ page }) => {
  await open(page);
  await expect(top(page)).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Back to top' })).toHaveCount(1);
  await expect(top(page)).toHaveAttribute('type', 'button');
  const follows = await page.evaluate(() => {
    const b = document.querySelector('[data-testid=back-to-top]')!;
    const all = Array.from(document.querySelectorAll('[data-testid=request-card]'));
    return all.every((c) => !!(c.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING));
  });
  expect(follows).toBe(true);
  const last = (await cards(page).last().boundingBox())!;
  const btn = (await top(page).boundingBox())!;
  expect(btn.y).toBeGreaterThan(last.y);
});

test('scrolls to top', async ({ page }) => {
  await open(page);
  await scrollDown(page);
  await top(page).click();
  await expect.poll(() => scrollY(page), { timeout: 2500 }).toBe(0);
});

test('no state change', async ({ page }) => {
  await open(page);
  await page.getByTestId('search').fill(`Top${u}`);
  await page.getByTestId('sort-votes').click();
  await expect(cards(page).first()).toBeVisible();
  const snap = async () => ({
    search: await page.getByTestId('search').inputValue(),
    pressed: [
      await page.getByTestId('sort-newest').getAttribute('aria-pressed'),
      await page.getByTestId('sort-votes').getAttribute('aria-pressed'),
    ],
    votes: await page.getByTestId('votes').allTextContents(),
    titles: await cards(page).locator('h2').allTextContents(),
  });
  const before = await snap();
  await scrollDown(page);
  await top(page).click();
  await expect.poll(() => scrollY(page), { timeout: 2500 }).toBe(0);
  expect(await snap()).toEqual(before);
});

test('hidden when nothing to show', async ({ page }) => {
  await open(page);
  await page.getByTestId('search').fill(`zzz-nomatch-${u}`);
  await expect(page.getByTestId('no-matches')).toHaveText('No requests match your search');
  await expect(top(page)).toHaveCount(0);
  await page.getByTestId('search').fill('');
  await expect(top(page)).toBeVisible();
});

test('hidden while loading', async ({ page }) => {
  await page.route('**/api/requests', () => new Promise(() => {}));
  await page.goto('/');
  await expect(page.getByText('Loading…')).toBeVisible();
  await expect(top(page)).toHaveCount(0);
});

test('hidden when empty', async ({ page }) => {
  await page.route('**/api/requests', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ requests: [] }) }));
  await page.goto('/');
  await expect(page.getByText('No requests.')).toBeVisible();
  await expect(top(page)).toHaveCount(0);
});

test('keyboard', async ({ page }) => {
  await open(page);
  await top(page).focus();
  await expect(top(page)).toBeFocused();
  await scrollDown(page);
  await page.keyboard.press('Enter');
  await expect.poll(() => scrollY(page), { timeout: 2500 }).toBe(0);
  await scrollDown(page);
  await top(page).focus();
  await page.keyboard.press('Space');
  await expect.poll(() => scrollY(page), { timeout: 2500 }).toBe(0);
});
