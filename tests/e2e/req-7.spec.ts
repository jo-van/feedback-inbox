import { expect, test, type APIRequestContext, type Page } from '@playwright/test';

test.use({ viewport: { width: 375, height: 700 } });

const TOL = 1;

type Made = { id: number; tag: string };

async function create(request: APIRequestContext, tag: string, title: string, details: string, doneWhen: string): Promise<Made> {
  const res = await request.post('/api/requests', {
    data: { title, details, doneWhen, name: 'Robot' },
  });
  expect(res.status()).toBe(201);
  const json = await res.json();
  return { id: json.request.id, tag };
}

async function createThree(request: APIRequestContext): Promise<Made[]> {
  const t = Date.now();
  const shortTag = `R7s${t}`;
  const medTag = `R7m${t}`;
  const longTag = `R7l${t}`;
  return [
    await create(request, shortTag, shortTag, '', 'Button is same size'),
    await create(request, medTag, `${medTag} medium length title for a request about button sizes`, 'Some details here.', 'The button stays the same size'),
    await create(
      request,
      longTag,
      `${longTag} ` + 'very long title words '.repeat(15),
      'Long details. '.repeat(40),
      'Done when this is long. '.repeat(15),
    ),
  ];
}

const btn = (page: Page, id: number) => page.locator(`button[aria-label="Upvote request ${id}"]`);

async function waitFor(page: Page, made: Made[]) {
  for (const m of made) await expect(page.getByRole('heading', { name: new RegExp(m.tag) })).toBeVisible();
}

async function sizes(page: Page, made: Made[]) {
  await page.goto('/');
  await waitFor(page, made);
  const out: { w: number; h: number }[] = [];
  const all = page.locator("button[aria-label^='Upvote request']");
  const n = await all.count();
  for (let i = 0; i < n; i++) {
    const b = await all.nth(i).boundingBox();
    if (b) out.push({ w: b.width, h: b.height });
  }
  return out;
}

async function size(page: Page, id: number) {
  const b = await btn(page, id).boundingBox();
  expect(b).not.toBeNull();
  return { w: b!.width, h: b!.height };
}

function near(a: { w: number; h: number }, b: { w: number; h: number }) {
  expect(Math.abs(a.w - b.w)).toBeLessThanOrEqual(TOL);
  expect(Math.abs(a.h - b.h)).toBeLessThanOrEqual(TOL);
}

test('all vote buttons are the same size', async ({ page, request }) => {
  const made = await createThree(request);
  const s = await sizes(page, made);
  expect(s.length).toBeGreaterThanOrEqual(3);
  for (const x of s) near(x, s[0]);
  const mine = [];
  for (const m of made) mine.push(await size(page, m.id));
  for (const x of mine) near(x, mine[0]);
});

test('voted and unvoted buttons are the same size', async ({ page, request }) => {
  const made = await createThree(request);
  await sizes(page, made);
  const before = await size(page, made[1].id);
  await btn(page, made[0].id).click();
  await expect(btn(page, made[0].id)).toBeDisabled();
  near(await size(page, made[0].id), before);
});

test('count digit growth does not change size', async ({ page, request }) => {
  const made = await createThree(request);
  const counts = [9, 99, 100];
  await page.route('**/api/requests', async (route) => {
    if (route.request().method() !== 'GET') return route.continue();
    const res = await route.fetch();
    const json = await res.json().catch(() => null);
    if (json && Array.isArray(json.requests)) {
      made.forEach((m, i) => {
        const r = json.requests.find((x: { id: number }) => x.id === m.id);
        if (r) r.votes = counts[i];
      });
      return route.fulfill({ response: res, json });
    }
    return route.fulfill({ response: res });
  });
  await page.goto('/');
  await waitFor(page, made);
  const votes = (id: number) => btn(page, id).getByTestId('votes');
  await expect(votes(made[0].id)).toHaveText('9');
  await expect(votes(made[1].id)).toHaveText('99');
  await expect(votes(made[2].id)).toHaveText('100');
  const s9 = await size(page, made[0].id);
  const s99 = await size(page, made[1].id);
  const s100 = await size(page, made[2].id);
  await btn(page, made[0].id).click();
  await expect(votes(made[0].id)).toHaveText('10');
  const s10 = await size(page, made[0].id);
  for (const x of [s10, s99, s100]) near(x, s9);
});

test('clicking a vote increments and keeps size', async ({ page, request }) => {
  const made = await createThree(request);
  await sizes(page, made);
  const id = made[2].id;
  const votes = btn(page, id).getByTestId('votes');
  const count = Number(await votes.textContent());
  const before = await size(page, id);
  await btn(page, id).click();
  await expect(votes).toHaveText(String(count + 1));
  await expect(btn(page, id)).toBeDisabled();
  await expect(btn(page, id)).toHaveClass(/voted/);
  near(await size(page, id), before);
});

test('sizes persist after reload', async ({ page, request }) => {
  const made = await createThree(request);
  const first = await sizes(page, made);
  await btn(page, made[0].id).click();
  await expect(btn(page, made[0].id)).toBeDisabled();
  const votedSize = await size(page, made[0].id);
  await page.reload();
  await waitFor(page, made);
  const all = page.locator("button[aria-label^='Upvote request']");
  await expect(all.first()).toBeVisible();
  const after = [];
  for (let i = 0; i < (await all.count()); i++) {
    const b = await all.nth(i).boundingBox();
    if (b) after.push({ w: b.width, h: b.height });
  }
  for (const x of after) near(x, first[0]);
  await expect(btn(page, made[0].id)).toBeDisabled();
  near(await size(page, made[0].id), votedSize);
});
