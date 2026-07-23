import type { Page } from "@playwright/test";

const INSTANT_D_INSTALLATION = new Date("2026-01-01T00:00:00.000Z");
const INSTANT_FIGE = new Date("2026-01-01T00:00:01.000Z");

export async function installerHorlogeFixe(page: Page) {
  await page.clock.install({ time: INSTANT_D_INSTALLATION });
  await page.clock.pauseAt(INSTANT_FIGE);
}
