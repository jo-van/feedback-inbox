import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

const u = Date.now().toString(36);
const MIN = 60_000;
const HOUR = 60 * MIN;
const now = Date.now();
const MASKED = 'New idea (being screened…)';

type Spec = { off: number | string; masked?: boolean; seeded?: boolean };
const specs: Record<string, Spec> = {
  fresh: { off: -10_000 },
  min1: { off: -MIN },
  min5: { off: -5 * MIN },
  min60: { off: -HOUR },
  h3: { off: -3 * HOUR },
  h23: { off: -23 * HOUR },
  future: { off: HOUR },
  garbage: { off: 'garbage' },
  h24: { off: -24 * HOUR },
  d2: { off: -48 * HOUR },
  masked: { off: -5 * MIN, masked: true },
  seeded: { off: -3 * HOUR, seeded: true },
};
const keys = Object.keys(specs);
const title = (k: string) => (specs[k].masked ? MASKED : `Age${u}${k}`);
const stamp = (k: string) => {
  const o = specs[k].off;
  return typeof o === 'string' ? o : new Date(now + o).toISOString();
};

async function mock(page: Page, override?: Record<string, string>) {
  await page.route('**/api/requests', async (route) => {
    if (route.request().method() !== 'GET') return route.continue();
    let response;
    let json;
    try {
      response = await route.fetch();
      json = await response.json();
    } catch {
      return;
    }
    const synth = keys.map((k, i) => ({
      id: 900000 + i,
      title: title(k),
      details: '',
      doneWhen: 'done',
      name: 'Tester',
      votes: 0,
      stage: 'queued',
      seeded: !!specs[k].seeded,
      publicReason: '',
      createdAt: override?.[k] ?? stamp(k),
    }));
    const base = json.requests.filter((r: { id: number }) => r.id < 900000 || r.id >= 900100);
    await route.fulfill({ response, json: { ...json, requests: [...base, ...synth] } }).catch(() => {});
  });
}

// Never calls route.fetch(): safe against context teardown races.
async function mockStatic(page: Page, overrides?: Record<string, string>) {
  await page.route('**/api/requests', async (route) => {
    if (route.request().method() !== 'GET') return route.continue().catch(() => {});
    const synth = keys.map((k, i) => ({
      id: 900000 + i,
      title: title(k),
      details: '',
      doneWhen: 'done',
      name: 'Tester',
      votes: 0,
      stage: 'queued',
      seeded: !!specs[k].seeded,
      publicReason: '',
      createdAt: overrides?.[k] ?? stamp(k),
    }));
    await route.fulfill({ json: { requests: synth } }).catch(() => {});
  });
}

const age = (page: Page, k: string) =>
  page
    .getByTestId('request-card')
    .filter({ has: page.getByRole('heading', { name: title(k) }) })
    .filter({ hasText: `#${900000 + keys.indexOf(k)} ` })
    .getByTestId('age');

test.describe('static ages', () => {
test.beforeEach(async ({ page }) => {
  await mock(page);
  await page.goto('/');
  await expect(page.getByTestId('search')).toBeVisible();
  await expect(age(page, 'fresh')).toBeVisible();
});

test('every card has an age', async ({ page }) => {
  const cards = page.getByTestId('request-card');
  const n = await cards.count();
  for (let i = 0; i < n; i++) {
    const a = cards.nth(i).getByTestId('age');
    await expect(a).toBeVisible();
    const txt = (await a.innerText()).trim();
    expect(txt.length).toBeGreaterThan(0);
    expect(txt).toMatch(/just now|\d+ (minute|hour|day)s? ago/);
  }
});

test('relative ages', async ({ page }) => {
  const want: Record<string, string> = {
    fresh: 'just now',
    min5: '5 minutes ago',
    min1: '1 minute ago',
    min60: '1 hour ago',
    h3: '3 hours ago',
    h23: '23 hours ago',
    h24: '1 day ago',
    d2: '2 days ago',
    future: 'just now',
    garbage: 'just now',
  };
  for (const [k, v] of Object.entries(want)) await expect(age(page, k)).toHaveText(`· ${v}`);
  const all = await page.getByTestId('age').allInnerTexts();
  for (const t of all) expect(t).not.toMatch(/NaN|undefined|-\d/);
});

test('masked and seeded cards show age', async ({ page }) => {
  await expect(age(page, 'masked')).toBeVisible();
  await expect(age(page, 'masked')).toHaveText('· 5 minutes ago');
  await expect(age(page, 'seeded')).toBeVisible();
  await expect(age(page, 'seeded')).toHaveText('· 3 hours ago');
});

test('title attribute', async ({ page }) => {
  const t = await age(page, 'min5').getAttribute('title');
  expect(t).toBe(stamp('min5'));
  const g = await age(page, 'garbage').getAttribute('title');
  expect(g ?? '').not.toContain('Invalid');
});

});

test('age refreshes without reload', async ({ page }) => {
  const T0 = Date.now();
  await page.clock.install({ time: T0 });
  await mockStatic(page, { fresh: new Date(T0 - 5000).toISOString() });
  await page.goto('/');
  await expect(age(page, 'fresh')).toHaveText('· just now');
  await page.clock.runFor(65_000);
  await expect(age(page, 'fresh')).toHaveText('· 1 minute ago');
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});
