import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const baseURL = process.env.BASE_URL ?? 'https://www.creai.mx';

export default defineConfig({
  testDir: './src/e2e-tests',
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: 'integration',
      testMatch: /tests\/integration\/.*\.spec\.ts/,
    },
    {
      name: 'frontend-chromium',
      testMatch: /tests\/ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'frontend-mobile',
      testMatch: /tests\/mobile\/.*\.spec\.ts/,
      use: { ...devices['iPhone X'], browserName: 'chromium' },
    },
    {
      name: 'passmark-ai',
      testMatch: /tests\/ai\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
