import { defineConfig, devices } from '@playwright/test';

// BASE_URL points at a deployed preview or production URL.
export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e/**/*.spec.ts', 'guard/**/*.spec.ts', 'smoke/**/*.spec.ts'],
  timeout: 45_000,
  retries: 1,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: process.env.PW_JSON || 'test-results/results.json' }]],
  outputDir: process.env.PW_OUTPUT_DIR || 'test-results',
  use: {
    baseURL: process.env.BASE_URL, trace: 'off', ...devices['Pixel 7'],
    ...(process.env.PW_PROXY ? { proxy: { server: process.env.PW_PROXY } } : {}),
  },
});
