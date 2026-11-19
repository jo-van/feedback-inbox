import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const t = Date.now().toString(36);
const zebra = `Zebra${t} Add Dark Mode`;
const quokka = `Quokka${t} other`;
const plain = `Plain${t}`;
const hidden = `Hidden${t}word`;
const nameV = `Nm${t}`;
const doneV = `Done${t}when`;

async function createRequest(page: Page, title: string, details: string, name: string, doneWhen: string) {
  await page.goto('/new');
  await page.getByLabel('What should we change or fix?').fill(title);
  await page.getByLabel(/Anything else/).fill(details);
  await page.getByLabel('How will we know it works?').fill(doneWhen);
  await page.getByLabel(/First name/).fill(name);
  await page.getByRole('button', { name: /Send it to the factory/ }).click();
  await expect(page.getByText(/Your request is #\d+/)).toBeVisible();
}

const card = (page: Page, title: string) =>
  page.getByTestId('request-card').filter({ has: page.getByRole('heading', { name: title }) });

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await createRequest(page, zebra, 'zebra details', nameV, doneV);
  await createRequest(page, quokka, 'quokka details', nameV, doneV);
  await createRequest(page, plain, `has ${hidden} inside`, nameV, doneV);
  await ctx.close();
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('search')).toBeVisible();
});

async function expectOnlyMatches(page: Page, q: string) {
  await expect(card(page, zebra)).toBeVisible();
  await expect(card(page, quokka)).toHaveCount(0);
  const hs = await page.getByTestId('request-card').locator('h2').allTextContents();
  for (const h of hs) expect(h.toLowerCase()).toContain(q.trim().toLowerCase());
}

test('input attributes and position', async ({ page }) => {
  const s = page.getByTestId('search');
  await expect(s).toHaveAttribute('aria-label', 'Search requests by title');
  await expect(s).toHaveAttribute('placeholder', 'Search by title');
  const sb = await s.boundingBox();
  const cb = await page.getByTestId('request-card').first().boundingBox();
  expect(sb!.y).toBeLessThan(cb!.y);
});

test('filters by title, case and whitespace', async ({ page }) => {
  const s = page.getByTestId('search');
  await s.fill(`zebra${t}`);
  await expectOnlyMatches(page, `zebra${t}`);
  await s.fill(`  ZEBRA${t}  `);
  await expectOnlyMatches(page, `zebra${t}`);
});

test('matches title only', async ({ page }) => {
  const s = page.getByTestId('search');
  for (const v of [hidden, nameV, doneV]) {
    await s.fill(v);
    await expect(page.getByTestId('request-card')).toHaveCount(0);
    await expect(page.getByTestId('no-matches')).toBeVisible();
  }
});

test('clear and whitespace-only show everything', async ({ page }) => {
  const s = page.getByTestId('search');
  await s.fill(`zebra${t}`);
  await expect(card(page, quokka)).toHaveCount(0);
  for (const v of ['', '   ']) {
    await s.fill(v);
    await expect(card(page, zebra)).toBeVisible();
    await expect(card(page, quokka)).toBeVisible();
    await expect(card(page, plain)).toBeVisible();
  }
});

test('no match message', async ({ page }) => {
  await page.getByTestId('search').fill(`nomatch${t}zzz`);
  await expect(page.getByTestId('request-card')).toHaveCount(0);
  await expect(page.getByTestId('no-matches')).toHaveText('No requests match your search');
});

test('filter and focus survive refresh', async ({ page }) => {
  const s = page.getByTestId('search');
  await s.focus();
  await s.fill(`zebra${t}`);
  await page.waitForResponse((r) => r.url().includes('/api/requests') && r.request().method() === 'GET', { timeout: 8000 });
  await expect(s).toBeVisible();
  await expect(s).toHaveValue(`zebra${t}`);
  await expect(s).toBeFocused();
  await expect(card(page, zebra)).toBeVisible();
  await expect(card(page, quokka)).toHaveCount(0);
});

test('upvote under filter', async ({ page }) => {
  await page.getByTestId('search').fill(`zebra${t}`);
  const c = card(page, zebra);
  await expect(c).toBeVisible();
  const before = Number(await c.getByTestId('votes').textContent());
  await c.getByRole('button', { name: /Upvote request \d+/ }).click();
  await expect(c.getByTestId('votes')).toHaveText(String(before + 1));
  await expect(c).toBeVisible();
});
