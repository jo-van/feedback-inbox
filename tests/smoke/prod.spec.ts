// PROTECTED: read-only production smoke test run after every release.
import { expect, test } from '@playwright/test';

test('production board loads with requests', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Feedback Inbox/ })).toBeVisible();
  await expect(page.getByTestId('request-card').first()).toBeVisible();
});

test('production suggest form renders', async ({ page }) => {
  await page.goto('/new');
  await expect(page.getByLabel('What should we change or fix?')).toBeVisible();
});

test('production APIs respond', async ({ request }) => {
  expect((await request.get('/api/requests')).status()).toBe(200);
  expect((await request.get('/api/factory-status')).status()).toBe(200);
  expect((await request.get('/floor')).status()).toBe(200);
});
