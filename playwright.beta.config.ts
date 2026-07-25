import { defineConfig, devices } from "@playwright/test";

const port = Number.parseInt(process.env.BETA_PLAYWRIGHT_PORT ?? "4175", 10);
const baseURL = `http://127.0.0.1:${port}`;
const environnement = Object.fromEntries(
  Object.entries(process.env).filter(
    (entree): entree is [string, string] => entree[1] !== undefined,
  ),
);

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: [
    /beta-configuration-deployee\.spec\.ts/,
    /beta-deployee\.spec\.ts/,
    /beta-retour-arriere\.spec\.ts/,
    /beta-sauvegarde-deployee\.spec\.ts/,
    /demonstration\.spec\.ts/,
  ],
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 180_000,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium-beta",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "node dist-beta/server/serveur.mjs",
    url: `${baseURL}/api/beta/sante`,
    reuseExistingServer: false,
    env: {
      ...environnement,
      BETA_COMMERCIAL_MODE: "test",
      COMMERCIAL_DATABASE_PATH: `.scratch/commercial-beta-${port}.sqlite`,
      HOST: "127.0.0.1",
      PORT: String(port),
    },
  },
});
