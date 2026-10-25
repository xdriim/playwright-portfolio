import { defineConfig, devices } from '@playwright/test';

/** Where the logged-in browser state is saved by the setup project. */
export const STORAGE_STATE = 'playwright/.auth/standard-user.json';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // Fail the CI build if someone leaves a `test.only` in the code.
  forbidOnly: isCI,
  // Retries only in CI: locally we want to see flaky tests fail.
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://www.saucedemo.com',
    // saucedemo.com exposes `data-test="..."` attributes, so getByTestId() uses them.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1. Logs in once and saves the session to STORAGE_STATE.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2. UI tests. They depend on `setup`, so they start already logged in.
    {
      name: 'chromium',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      testDir: './tests/e2e',
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },

    // 3. API tests: no browser needed, just Playwright's `request` client.
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: 'https://dummyjson.com',
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },
  ],
});
