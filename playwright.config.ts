import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const SITE_URL = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Always rebuild, so the tests never hit a stale dist/. `--ignore-lock`
    // keeps this instance independent from any preview server the developer
    // already has running.
    command: `npx astro build && npx astro preview --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      SITE_URL,
      // Astro 7 daemonizes `astro preview` when it detects an AI coding agent
      // in the environment; Playwright needs the server in the foreground.
      ASTRO_PREVIEW_BACKGROUND: '1',
    },
  },
});
