import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './src',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  maxFailures: isCI ? 5 : 0,
  ...(isCI ? { workers: 4 } : {}),
  reporter: isCI ? [['github'], ['html']] : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: [
    {
      command: isCI ? 'pnpm exec next build && pnpm exec next start' : 'pnpm dev',
      url: 'http://localhost:3000/api/stats/total',
      timeout: 300_000,
      reuseExistingServer: !isCI
    },
    {
      command: 'pnpm exec vite --config vite.config.wc.ts --port 5173 --strictPort',
      url: 'http://localhost:5173/e2e.html',
      timeout: 60_000,
      reuseExistingServer: !isCI
    }
  ]
});
