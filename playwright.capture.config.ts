import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './scripts',
  testMatch: 'capture-screenshots.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'http://127.0.0.1:4174',
    viewport: { width: 1920, height: 1080 },
    trace: 'off',
    video: 'off',
  },
  reporter: 'line',
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174/start',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
