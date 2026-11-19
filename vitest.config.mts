import { defineConfig } from 'vitest/config';

// node_modules is mounted read-only in the factory sandbox, so keep caches elsewhere.
export default defineConfig({
  cacheDir: '/tmp/vitest-cache',
  test: { include: ['tests/unit/**/*.test.ts'] },
});
