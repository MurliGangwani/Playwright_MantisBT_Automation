// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://mantisbt.org/bugs', // or another Mantis demo site
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  testDir: './tests',
  retries: 1,
  timeout: 30000,
});
