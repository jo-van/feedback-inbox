import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const u = Date.now().toString(36);
const ids: number[] = []; // [A, B]

test.beforeAll(async ({ playwright }, info) => {
  const request = await playwright.request.newContext({ baseURL: info.project.use.baseURL });
  for (const s of ['A', 'B']) {
    const res = await request.post('/api/requests', {
      data: { title: `Bounce${u}${s}`, doneWhen: 'It bounces', name: 'Robot' },
    });
    expect(res.status()).toBe(201);
    ids.push((await res.json()).request.id as number);
  }
  await request.dispose();
});

const card = (page: Page, id: number) =>
  page.getByTestId('request-card').filter({ hasText: `#${id} ` });
const btn = (page: Page, id: number) => card(page, id).locator('button.vote');
const votes = async (page: Page, id: number) =>
  Number((await card(page, id).getByTestId('votes').innerText()).trim());
const animName = (b: ReturnType<typeof btn>) => b.evaluate((e) => getComputedStyle(e).animationName);

async function fresh(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.removeItem('ff_voted'));
  await page.reload();
  await expect(card(page, ids[0])).toBeVisible();
  await expect(btn(page, ids[0])).toBeEnabled();
}

test('bounce on tap', async ({ page }) => {
  await fresh(page);
  const [a, b] = [btn(page, ids[0]), btn(page, ids[1])];
  const n = await votes(page, ids[0]);
  await expect(a).not.toHaveClass(/bounce/);
  await a.click();
  await expect(a).toHaveClass(/bounce/);
  await expect(a).toHaveClass(/voted/);
  expect(await animName(a)).not.toBe('none');
  const dur = await a.evaluate((e) => parseFloat(getComputedStyle(e).animationDuration));
  expect(dur).toBeLessThanOrEqual(0.6);
  await expect(b).not.toHaveClass(/bounce/);
  await expect(a).not.toHaveClass(/bounce/);
  await expect(card(page, ids[0]).getByTestId('votes')).toHaveText(String(n + 1));
  await expect(a).toBeDisabled();
  await expect(a).toHaveClass(/voted/);
  await page.reload();
  await expect(card(page, ids[0])).toBeVisible();
  await expect(card(page, ids[0]).getByTestId('votes')).toHaveText(String(n + 1));
  await expect(btn(page, ids[0])).toHaveClass(/voted/);
  await expect(btn(page, ids[0])).toBeDisabled();
  await expect(btn(page, ids[0])).not.toHaveClass(/bounce/);
});

test('no bounce on load', async ({ page }) => {
  await page.goto('/');
  await page.evaluate((id) => localStorage.setItem('ff_voted', JSON.stringify([id])), ids[0]);
  await page.reload();
  await expect(card(page, ids[0])).toBeVisible();
  await expect(btn(page, ids[0])).toBeDisabled();
  await expect(page.locator('button.vote.bounce')).toHaveCount(0);
  expect(await animName(btn(page, ids[0]))).toBe('none');
  await expect(btn(page, ids[1])).not.toHaveClass(/bounce/);
  expect(await animName(btn(page, ids[1]))).toBe('none');
});

test('double click votes once', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', (r) => {
    if (r.method() === 'POST' && r.url().includes(`/api/requests/${ids[0]}/vote`)) posts.push(r.url());
  });
  await fresh(page);
  const a = btn(page, ids[0]);
  const n = await votes(page, ids[0]);
  try {
    await a.click({ force: true });
    await a.click({ force: true, timeout: 1000 });
  } catch {}
  await expect(a).not.toHaveClass(/bounce/);
  await expect(card(page, ids[0]).getByTestId('votes')).toHaveText(String(n + 1));
  expect(posts.length).toBe(1);
});

test('reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await fresh(page);
  const b = btn(page, ids[1]);
  const n = await votes(page, ids[1]);
  await b.click();
  expect(await animName(b)).toBe('none');
  await expect(card(page, ids[1]).getByTestId('votes')).toHaveText(String(n + 1));
  await expect(b).toHaveClass(/voted/);
  await expect(b).toBeDisabled();
});
