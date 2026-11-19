import { expect, test } from '@playwright/test';

test('board loads and shows the suggest button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Feedback Inbox/ })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Suggest an idea' })).toBeVisible();
  await expect(page.getByTestId('request-card').first()).toBeVisible();
});

test('someone can submit a request and see it on the board', async ({ page }) => {
  const title = `E2E check ${Date.now()}`;
  await page.goto('/new');
  await page.getByLabel('What should we change or fix?').fill(title);
  await page.getByLabel('How will we know it works?').fill('It shows up on the board');
  await page.getByLabel(/First name/).fill('Robot');
  await page.getByRole('button', { name: /Send it to the factory/ }).click();
  await expect(page.getByText(/Your request is #\d+/)).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
});
