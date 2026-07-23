import { expect, test } from "@playwright/test";

import { installerHorlogeFixe } from "./horloge";

test("un Chantier de Halte survit à la reprise et transforme la silhouette", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installerHorlogeFixe(page);
  await page.goto("/");

  const infrastructure = page.getByRole("region", { name: "Infrastructure" });
  await expect(infrastructure).toContainText("5 Plateformes · 8 installations · 4 Emplacements libres");
  const coupeHabitee = page.getByTestId("coupe-habitee");
  await expect(coupeHabitee).toHaveAttribute(
    "data-installations",
    "8",
  );
  await expect(coupeHabitee).toHaveAttribute("data-ready", "true");
  expect((await coupeHabitee.screenshot()).byteLength).toBeGreaterThan(5_000);

  const largeurInitiale = (await coupeHabitee.boundingBox())?.width;
  await page.setViewportSize({ width: 720, height: 800 });
  await expect
    .poll(async () => (await coupeHabitee.boundingBox())?.width)
    .not.toBe(largeurInitiale);
  expect((await coupeHabitee.screenshot()).byteLength).toBeGreaterThan(5_000);

  await infrastructure.getByRole("button", { name: "Déployer la Halte" }).click();
  await expect(infrastructure.getByRole("alert")).toContainText(
    "suspendre le Temps du convoi",
  );
  await page.getByRole("button", { name: "Pause" }).click();
  await infrastructure.getByRole("button", { name: "Déployer la Halte" }).click();
  await infrastructure.getByLabel("Priorité").selectOption("haute");
  await infrastructure.getByRole("button", { name: "Engager le Chantier" }).click();
  await expect(infrastructure).toContainText("Construction — Condenseur thermique");

  await page.getByRole("button", { name: "Vitesse 1×" }).click();
  await page.clock.fastForward(30_000);
  await page.getByRole("button", { name: "Pause" }).click();
  await expect(infrastructure).toContainText("50 % · Matériaux 6/12 · 30 s restantes");

  await page.getByRole("button", { name: "Sauvegarder" }).click();
  await expect(page.getByText("Sauvegarde à jour.")).toBeVisible();
  await page.reload();

  const infrastructureReprise = page.getByRole("region", {
    name: "Infrastructure",
  });
  await expect(infrastructureReprise).toContainText(
    "50 % · Matériaux 6/12 · 30 s restantes",
  );
  await page.getByRole("button", { name: "Vitesse 1×" }).click();
  await page.clock.fastForward(30_000);

  await expect(coupeHabitee).toHaveAttribute(
    "data-installations",
    "9",
  );
  const fichesDesInstallations = infrastructureReprise.getByText(
    "Fiches des installations",
  );
  await fichesDesInstallations.focus();
  await page.keyboard.press("Enter");
  await expect(
    infrastructureReprise.getByRole("heading", { name: "Condenseur thermique" }),
  ).toBeVisible();
  await expect(infrastructureReprise).toContainText(
    "Le condenseur fournit 8 L d’Eau par heure.",
  );
});

test("les sélections suivent l’implantation après un déplacement", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installerHorlogeFixe(page);
  await page.goto("/");
  const infrastructure = page.getByRole("region", { name: "Infrastructure" });

  await page.getByRole("button", { name: "Pause" }).click();
  await infrastructure.getByRole("button", { name: "Déployer la Halte" }).click();
  await infrastructure.getByLabel("Déplacement").check();
  await infrastructure.getByLabel("Priorité").selectOption("haute");
  await infrastructure.getByRole("button", { name: "Engager le Chantier" }).click();
  await page.getByRole("button", { name: "Vitesse 1×" }).click();
  await page.clock.fastForward(30_000);
  await page.getByRole("button", { name: "Pause" }).click();

  await infrastructure.getByLabel("Construction").check();
  await expect(infrastructure.getByLabel("Emplacement")).toHaveValue(
    "intendance.technique",
  );
  await infrastructure.getByRole("button", { name: "Engager le Chantier" }).click();
  await expect(infrastructure).toContainText(
    "Construction — Condenseur thermique",
  );
});

test("le panneau et ses refus suivent la langue anglaise", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "English" }).click();
  const infrastructure = page.getByRole("region", { name: "Infrastructure" });

  await expect(infrastructure).toContainText("Stewardship");
  await expect(infrastructure).toContainText("Hearths");
  await infrastructure.getByRole("button", { name: "Deploy the Halt" }).click();
  await expect(infrastructure.getByRole("alert")).toContainText(
    "Pause Convoy Time",
  );
});
