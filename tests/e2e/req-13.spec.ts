import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const u = Date.now().toString(36);

test.beforeAll(async ({ playwright }, info) => {
  const request = await playwright.request.newContext({ baseURL: info.project.use.baseURL });
  for (const s of ['a', 'b']) {
    const res = await request.post('/api/requests', {
      data: { title: `Cnt${u}${s}`, doneWhen: 'It works fine', name: 'Robot' },
    });
    expect(res.status()).toBe(201);
  }
  await request.dispose();
});

const count = (page: Page) => page.getByTestId('request-count');
const cards = (page: Page) => page.getByTestId('request-card');
const search = (page: Page) => page.getByTestId('search');
const apiTotal = async (page: Page) => {
  const res = await page.request.get('/api/requests');
  return (await res.json()).requests.length as number;
};
const num = async (page: Page) => parseInt(((await count(page).textContent()) || '').trim(), 10);

function stub(n: number, startId = 1000) {
  return Array.from({ length: n }, (_, i) => ({
    id: startId + i,
    title: `Stub request ${i + 1}`,
    details: '',
    doneWhen: 'It works',
    name: 'Robot',
    votes: 0,
    stage: 'received',
    round: 0,
    seeded: false,
    publicReason: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

async function open(page: Page) {
  await page.goto('/');
  await expect(cards(page).first()).toBeVisible();
  await expect(count(page)).toBeVisible();
}

test('visible, above search, not fixed, text matches total', async ({ page }) => {
  await open(page);
  await expect
    .poll(async () => (await count(page).textContent())?.trim() === `${await apiTotal(page)} requests so far`)
    .toBe(true);
  expect(await num(page)).toBeGreaterThanOrEqual(2);
  const c = (await count(page).boundingBox())!;
  const s = (await search(page).boundingBox())!;
  expect(c.y + c.height).toBeLessThanOrEqual(s.y);
  const pos = await count(page).evaluate((el) => getComputedStyle(el).position);
  expect(pos).not.toBe('fixed');
});

test('equals number of cards with no search', async ({ page }) => {
  await open(page);
  await expect(search(page)).toHaveValue('');
  await expect
    .poll(async () => (await cards(page).count()) === (await num(page)) && (await num(page)) === (await apiTotal(page)))
    .toBe(true);
});

test('search does not change count', async ({ page }) => {
  await open(page);
  const before = await count(page).textContent();
  await search(page).fill(`Cnt${u}a`);
  await expect
    .poll(async () => {
      const n = await cards(page).count();
      return n >= 1 && n < (await num(page));
    })
    .toBe(true);
  await expect(count(page)).toHaveText(before!);
  await search(page).fill(`zzz-nomatch-${u}`);
  await expect(page.getByTestId('no-matches')).toBeVisible();
  await expect(count(page)).toHaveText(before!);
  await search(page).fill('');
  await expect(count(page)).toHaveText(before!);
});

test('singular', async ({ page }) => {
  await page.route('**/api/requests', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ requests: stub(1) }) }));
  await page.goto('/');
  await expect(count(page)).toHaveText('1 request so far');
});

test('plural stub', async ({ page }) => {
  await page.route('**/api/requests', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ requests: stub(2) }) }));
  await page.goto('/');
  await expect(count(page)).toHaveText('2 requests so far');
});

test('increases after poll (stubbed)', async ({ page }) => {
  let n = 3;
  await page.route('**/api/requests', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ requests: stub(n) }) }));
  await page.goto('/');
  await expect(count(page)).toHaveText('3 requests so far');
  n = 4;
  await expect(count(page)).toHaveText('4 requests so far', { timeout: 12000 });
});

test('increases after new request and poll (real)', async ({ page }) => {
  await open(page);
  const n0 = await num(page);
  const title = `Cnt${u}new`;
  const res = await page.request.post('/api/requests', { data: { title, doneWhen: 'It works fine', name: 'Robot' } });
  expect(res.status()).toBe(201);
  await expect(async () => {
    const n = await num(page);
    expect(n).toBeGreaterThanOrEqual(n0 + 1);
    expect(n).toBe(await apiTotal(page));
  }).toPass({ timeout: 15000 });
  await search(page).fill(title);
  await expect(page.getByText(title)).toBeVisible();
});

test('hidden while loading', async ({ page }) => {
  await page.route('**/api/requests', () => new Promise(() => {}));
  await page.goto('/');
  await expect(page.getByText('Loading…')).toBeVisible();
  await expect(count(page)).toHaveCount(0);
});

test('hidden on error before first load', async ({ page }) => {
  await page.route('**/api/requests', (route) => route.fulfill({ status: 500, body: 'err' }));
  await page.goto('/');
  await expect(page.getByText('Could not load requests. Retrying…')).toBeVisible();
  await expect(count(page)).toHaveCount(0);
});

test('hidden when empty', async ({ page }) => {
  await page.route('**/api/requests', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ requests: [] }) }));
  await page.goto('/');
  await expect(page.getByText('No requests.')).toBeVisible();
  await expect(count(page)).toHaveCount(0);
});

test('existing behaviour intact', async ({ page }) => {
  await open(page);
  await expect(search(page)).toBeVisible();
  await expect(page.getByTestId('sort-newest')).toBeVisible();
  await expect(page.getByTestId('sort-votes')).toBeVisible();
  await expect(page.getByTestId('back-to-top')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Suggest an idea' })).toBeVisible();
  const before = await count(page).textContent();
  await page.getByTestId('sort-votes').click();
  await expect(page.getByTestId('sort-votes')).toHaveAttribute('aria-pressed', 'true');
  await expect(count(page)).toHaveText(before!);
});
