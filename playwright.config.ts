import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: process.env.PREVIEW_URL || 'http://127.0.0.1:4322', channel: 'chrome', headless: true },
  timeout: 45000,
  workers: 1,
  reporter: 'list',
});
