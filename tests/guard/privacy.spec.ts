// PROTECTED: the factory may not edit files under tests/guard/.
// Emails must never appear on any public surface.
import { expect, test } from '@playwright/test';

test('a submitted email never appears in public pages or APIs', async ({ page, request }) => {
  const email = `guard-${Date.now()}@example.com`;
  const res = await request.post('/api/requests', {
    data: { title: `Privacy guard ${Date.now()}`, doneWhen: 'email stays private', name: 'Guard', email, consent: true },
  });
  expect(res.status()).toBe(201);
  for (const path of ['/api/requests', '/api/factory-status', '/']) {
    const body = await (await request.get(path)).text();
    expect(body, path).not.toContain(email);
    expect(body, path).not.toContain('example.com');
  }
  await page.goto('/');
  expect(await page.content()).not.toContain(email);
});

test('factory floor page is served', async ({ request }) => {
  const r = await request.get('/floor');
  expect(r.status()).toBe(200);
  expect(await r.text()).toContain('Factory Floor');
});
