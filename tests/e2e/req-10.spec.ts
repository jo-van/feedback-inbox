import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const u = Date.now().toString(36);
const ids: number[] = []; // [A, B, C]

async function create(request: APIRequestContext, suffix: string) {
  const res = await request.post('/api/requests', {
    data: { title: `Sort${u}${suffix}`, doneWhen: 'It sorts', name: 'Robot' },
  });
  expect(res.status()).toBe(201);
  return (await res.json()).request.id as number;
}

test.beforeAll(async ({ playwright }, info) => {
  const baseURL = info.project.use.baseURL;
  const request = await playwright.request.newContext({ baseURL });
  for (const s of ['A', 'B', 'C']) ids.push(await create(request, s));
  // A: 3 votes, B: 1 vote, C: 0 votes
  for (let i = 0; i < 3; i++) await request.post(`/api/requests/${ids[0]}/vote`);
  await request.post(`/api/requests/${ids[1]}/vote`);
  await request.dispose();
});

async function rows(page: Page) {
  const cards = page.getByTestId('request-card');
  const n = await cards.count();
  const out: { id: number; votes: number; title: string }[] = [];
  for (let i = 0; i < n; i++) {
    const c = cards.nth(i);
    const meta = await c.locator('.meta').innerText();
    const id = Number(/#(\d+)/.exec(meta)![1]);
    const votes = Number((await c.getByTestId('votes').innerText()).trim());
    out.push({ id, votes, title: (await c.locator('h2').innerText()).trim() });
  }
  return out;
}
const idsDesc = (r: { id: number }[]) => r.every((x, i) => i === 0 || r[i - 1].id > x.id);
const votesDesc = (r: { id: number; votes: number }[]) =>
  r.every((x, i) => i === 0 || r[i - 1].votes > x.votes || (r[i - 1].votes === x.votes && r[i - 1].id > x.id));

const card = (page: Page, id: number) =>
  page.getByTestId('request-card').filter({ hasText: `#${id} ` });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(card(page, ids[0])).toBeVisible();
});

test('controls', async ({ page }) => {
  const nw = page.getByTestId('sort-newest');
  const vt = page.getByTestId('sort-votes');
  await expect(nw).toHaveText('Newest');
  await expect(vt).toHaveText('Most votes');
  const s = (await page.getByTestId('search').boundingBox())!;
  const f = (await page.getByTestId('request-card').first().boundingBox())!;
  for (const b of [nw, vt]) {
    const bb = (await b.boundingBox())!;
    expect(bb.y).toBeGreaterThanOrEqual(s.y + s.height);
    expect(bb.y + bb.height).toBeLessThanOrEqual(f.y);
  }
});

test('default newest', async ({ page }) => {
  await expect(page.getByTestId('sort-newest')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('sort-votes')).toHaveAttribute('aria-pressed', 'false');
  expect(idsDesc(await rows(page))).toBe(true);
});

test('most votes ordering', async ({ page }) => {
  await page.getByTestId('sort-votes').click();
  await expect(page.getByTestId('sort-votes')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('sort-newest')).toHaveAttribute('aria-pressed', 'false');
  const r = await rows(page);
  expect(votesDesc(r)).toBe(true);
  expect(r[0].votes).toBe(Math.max(...r.map((x) => x.votes)));
  await page.getByTestId('sort-newest').click();
  await expect(page.getByTestId('sort-newest')).toHaveAttribute('aria-pressed', 'true');
  expect(idsDesc(await rows(page))).toBe(true);
});

test('sort persists across refresh', async ({ page }) => {
  await page.getByTestId('sort-votes').click();
  await page.waitForTimeout(6500);
  await expect(page.getByTestId('sort-votes')).toHaveAttribute('aria-pressed', 'true');
  expect(votesDesc(await rows(page))).toBe(true);
});

test('upvote while sorted by votes', async ({ page }) => {
  await page.getByTestId('sort-votes').click();
  const [a, b] = [ids[0], ids[1]];
  const before = await rows(page);
  const bVotes = before.find((x) => x.id === b)!.votes;
  const aVotes = before.find((x) => x.id === a)!.votes;
  await page.getByRole('button', { name: `Upvote request ${b}` }).click();
  await expect(card(page, b).getByTestId('votes')).toHaveText(String(bVotes + 1));
  const after = await rows(page);
  expect(votesDesc(after)).toBe(true);
  expect(after.find((x) => x.id === b)!.votes).toBe(bVotes + 1);
  if (bVotes + 1 > aVotes) {
    expect(after.findIndex((x) => x.id === b)).toBeLessThan(after.findIndex((x) => x.id === a));
  }
});

test('search plus sort', async ({ page }) => {
  await page.getByTestId('sort-votes').click();
  await page.getByTestId('search').fill(`Sort${u}`);
  await expect(page.getByTestId('request-card')).toHaveCount(3);
  let r = await rows(page);
  expect(r.every((x) => x.title.includes(`Sort${u}`))).toBe(true);
  expect(votesDesc(r)).toBe(true);
  await page.getByTestId('sort-newest').click();
  r = await rows(page);
  expect(r.length).toBe(3);
  expect(idsDesc(r)).toBe(true);
  await page.getByTestId('search').fill(`nomatch${u}zzz`);
  await expect(page.getByTestId('no-matches')).toHaveText('No requests match your search');
});

test('empty state', async ({ page }) => {
  await page.route('**/api/requests', (route) =>
    route.request().method() === 'GET' ? route.fulfill({ json: { requests: [] } }) : route.continue());
  await page.goto('/');
  await expect(page.getByText('No requests.')).toBeVisible();
});
