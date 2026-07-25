import { defineConfig, devices } from "@playwright/test";

const port = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? "4173", 10);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: /beta-.*\.spec\.ts/,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testIgnore:
        /(?:beta-.*|scenarios-sentinelles)\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium-sentinelles",
      retries: 0,
      testMatch: /scenarios-sentinelles\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testIgnore:
        /(?:beta-.*|scenarios-sentinelles)\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "firefox-sentinelles",
      retries: 0,
      testMatch: /scenarios-sentinelles\.spec\.ts/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testIgnore:
        /(?:beta-.*|scenarios-sentinelles)\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "webkit-sentinelles",
      retries: 0,
      testMatch: /scenarios-sentinelles\.spec\.ts/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer:
      process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER === "true",
  },
});
