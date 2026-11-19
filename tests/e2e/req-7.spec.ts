import { expect, test, type Page } from '@playwright/test';

const GREEN = 'rgb(61, 220, 132)';

async function createRequest(page: Page, prefix: string) {
  const title = `${prefix} ${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  await page.goto('/new');
  await page.getByLabel('What should we change or fix?').fill(title);
  await page.getByLabel('How will we know it works?').fill('The vote button looks right');
  await page.getByLabel(/First name/).fill('Tester');
  await page.getByRole('button', { name: /Send it to the factory/ }).click();
  const text = await page.getByText(/Your request is #(\d+)/).first().innerText();
  const id = Number(/Your request is #(\d+)/.exec(text)![1]);
  return { title, id };
}

function card(page: Page, title: string) {
  return page
    .getByRole('heading', { name: title })
    .locator('xpath=ancestor::*[@data-testid="request-card"]');
}

function voteButton(page: Page, title: string, id: number) {
  return card(page, title).getByRole('button', { name: `Upvote request ${id}` });
}

async function colors(btn: ReturnType<typeof voteButton>) {
  return btn.evaluate((el) => {
    const s = getComputedStyle(el);
    return { color: s.color, border: s.borderTopColor };
  });
}

async function votes(page: Page, title: string) {
  const t = await card(page, title).getByTestId('votes').innerText();
  return Number(t);
}

async function setup(page: Page) {
  const first = await createRequest(page, 'Req7');
  const second = await createRequest(page, 'Req7b');
  await page.goto('/');
  return { first, second };
}

async function expectDefault(page: Page, r: { title: string; id: number }) {
  const btn = voteButton(page, r.title, r.id);
  await expect(btn).toBeVisible();
  await expect(btn).not.toHaveClass(/\bvoted\b/);
  const c = await colors(btn);
  expect(c.color).not.toBe(GREEN);
  expect(c.border).not.toBe(GREEN);
}

async function expectGreen(page: Page, r: { title: string; id: number }) {
  const btn = voteButton(page, r.title, r.id);
  await expect(btn).toHaveClass(/\bvoted\b/);
  const c = await colors(btn);
  expect(c.color).toBe(GREEN);
  expect(c.border).toBe(GREEN);
}

test('not voted is not green', async ({ page }) => {
  const { first } = await setup(page);
  await expectDefault(page, first);
});

test('click turns green and count goes up', async ({ page }) => {
  const { first } = await setup(page);
  const btn = voteButton(page, first.title, first.id);
  await expect(btn).toBeVisible();
  const initial = await votes(page, first.title);
  await btn.click();
  await expectGreen(page, first);
  await expect.poll(() => votes(page, first.title)).toBe(initial + 1);
});

test('persists after reload', async ({ page }) => {
  const { first } = await setup(page);
  await voteButton(page, first.title, first.id).click();
  await expectGreen(page, first);
  await page.reload();
  await expectGreen(page, first);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('ff_voted') || '[]'));
  expect(stored).toContain(first.id);
});

test('other requests stay default', async ({ page }) => {
  const { first, second } = await setup(page);
  await expectDefault(page, second);
  await voteButton(page, first.title, first.id).click();
  await expectGreen(page, first);
  await expectDefault(page, second);
  await page.reload();
  await expectGreen(page, first);
  await expectDefault(page, second);
});

test('stays disabled', async ({ page }) => {
  const { first } = await setup(page);
  const btn = voteButton(page, first.title, first.id);
  await btn.click();
  await expect(btn).toBeDisabled();
  const after = await votes(page, first.title);
  await btn.click({ force: true }).catch(() => {});
  await btn.dispatchEvent('click');
  await expect.poll(() => votes(page, first.title)).toBe(after);

  await page.reload();
  const btn2 = voteButton(page, first.title, first.id);
  await expect(btn2).toBeDisabled();
  const after2 = await votes(page, first.title);
  await btn2.click({ force: true }).catch(() => {});
  await btn2.dispatchEvent('click');
  await expect.poll(() => votes(page, first.title)).toBe(after2);
});
