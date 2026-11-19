import { defineConfig, devices } from '@playwright/test';

// BASE_URL points at a deployed preview or production URL.
export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'guard/**/*.spec.ts', 'smoke/**/*.spec.ts'],
  timeout: 45_000,
  retries: 1,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: process.env.BASE_URL, trace: 'off', ...devices['Pixel 7'] },
});
