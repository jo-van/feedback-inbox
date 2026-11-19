import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const t = Date.now().toString(36);
const title = `Quokka${t} Alpha`;
const NEW_TEXT = 'No requests match your search';
const OLD_TEXT = 'No matching requests.';

async function createRequest(page: Page, title: string, details: string, name: string, doneWhen: string) {
  await page.goto('/new');
  await page.getByLabel('What should we change or fix?').fill(title);
  await page.getByLabel(/Anything else/).fill(details);
  await page.getByLabel('How will we know it works?').fill(doneWhen);
  await page.getByLabel(/First name/).fill(name);
  await page.getByRole('button', { name: /Send it to the factory/ }).click();
  await expect(page.getByText(/Your request is #\d+/)).toBeVisible();
}

const card = (page: Page) =>
  page.getByTestId('request-card').filter({ has: page.getByRole('heading', { name: title }) });

test.beforeAll(async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await createRequest(page, title, 'quokka details', `Nm${t}`, `Done${t}when`);
  await ctx.close();
});

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('search')).toBeVisible();
});

test('no match shows new message', async ({ page }) => {
  await page.getByTestId('search').fill(`nomatch${t}zzz`);
  await expect(page.getByTestId('request-card')).toHaveCount(0);
  await expect(page.getByTestId('no-matches')).toBeVisible();
  await expect(page.getByTestId('no-matches')).toHaveText(NEW_TEXT);
  await expect(page.getByText(OLD_TEXT)).toHaveCount(0);
  expect(await page.locator('body').innerText()).not.toContain(OLD_TEXT);
});

test('recovery after no match', async ({ page }) => {
  const s = page.getByTestId('search');
  await s.fill(`nomatch${t}zzz`);
  await expect(page.getByTestId('no-matches')).toBeVisible();
  await s.fill('');
  await expect(page.getByTestId('no-matches')).toHaveCount(0);
  await expect(card(page)).toBeVisible();
  await s.fill(`nomatch${t}zzz`);
  await s.fill(`quokka${t}`);
  await expect(page.getByTestId('no-matches')).toBeHidden();
  await expect(card(page)).toBeVisible();
});

test('whitespace-only shows everything', async ({ page }) => {
  await page.getByTestId('search').fill('   ');
  await expect(page.getByTestId('no-matches')).toHaveCount(0);
  await expect(card(page)).toBeVisible();
});

test('case-insensitive and survives refresh', async ({ page }) => {
  const s = page.getByTestId('search');
  await s.fill(`QUOKKA${t}`);
  await expect(card(page)).toBeVisible();
  await s.focus();
  await s.fill(`nomatch${t}zzz`);
  await page.waitForResponse((r) => r.url().includes('/api/requests') && r.request().method() === 'GET', { timeout: 8000 });
  await expect(s).toHaveValue(`nomatch${t}zzz`);
  await expect(s).toBeFocused();
  await expect(page.getByTestId('no-matches')).toHaveText(NEW_TEXT);
});

test('empty board shows no search box', async ({ page }) => {
  await page.route('**/api/requests', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { requests: [] } });
    } else {
      await route.continue();
    }
  });
  await page.goto('/');
  await expect(page.getByText('No requests.')).toBeVisible();
  await expect(page.getByTestId('search')).toHaveCount(0);
  await expect(page.getByTestId('no-matches')).toHaveCount(0);
});
