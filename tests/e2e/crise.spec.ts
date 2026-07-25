import { expect, test } from "@playwright/test";

import { installerHorlogeFixe } from "./horloge";

test("la Crise suspend le convoi et persiste sa Récupération accomplie", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installerHorlogeFixe(page);
  await page.goto("/");

  const incident = page.getByRole("region", {
    name: "Pompe de purification instable",
  });
  await incident.getByRole("button", { name: "Maintenir le débit" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Aggravation annoncée — purification instable",
    }),
  ).toBeVisible();
  await expect(page.getByText("Fenêtre de décision :")).toContainText(
    "dans 3 min",
  );

  await page.getByRole("button", { name: "English" }).click();
  await page.getByRole("button", { name: "Vitesse 4×" }).click();
  await page.clock.fastForward(45_000);

  const crise = page.getByRole("alertdialog", {
    name: "Crisis — Purified water contaminated",
  });
  await expect(crise).toBeVisible();
  const tempsLorsDeLaCrise = await page
    .locator(".commandes-du-temps > time")
    .textContent();
  if (tempsLorsDeLaCrise === null) {
    throw new Error("Le Temps du convoi n’est pas affiché.");
  }
  await expect(crise).toContainText("16 L remain usable");
  await expect(crise).toContainText("4 Materials");
  await expect(crise).toContainText("5 Remedies");
  await expect(crise).toContainText("8 inhabitants evacuated");
  await expect(crise).toContainText("Last resort");
  await expect(crise).not.toContainText("%");

  const reponses = crise.getByRole("button", {
    name: "Confirm this response",
  });
  await expect(reponses).toHaveCount(3);
  for (const reponse of await reponses.all()) {
    await expect(reponse).toBeEnabled();
  }
  await expect(
    crise.getByRole("button", {
      name: "Confirm this response — Isolate the circuit and ration Water",
      exact: true,
    }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    crise.getByRole("button", {
      name: "Confirm this response — Evacuate exposed Hearths toward High Well",
      exact: true,
    }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(reponses.first()).toBeFocused();
  await expect(page.locator(".commandes-du-temps > time")).toHaveText(
    tempsLorsDeLaCrise,
  );
  await expect(page.locator(".scene-layout")).toHaveAttribute("inert", "");
  await expect(page.getByText("En pause").first()).toBeVisible();
  for (const commande of await page
    .locator(".commandes-du-temps button")
    .all()) {
    await expect(commande).toBeDisabled();
  }

  await expect(crise).toContainText("Known cost");
  await expect(crise).toContainText("Worst credible consequence");

  const rationnement = crise
    .getByRole("article")
    .filter({ hasText: "Isolate the circuit and ration Water" });
  await rationnement
    .getByRole("button", { name: "Confirm this response" })
    .click();

  const etatDesCrises = page.getByRole("region", {
    name: "Crises and Scars",
  });
  await expect(etatDesCrises).toContainText("Water rationing");
  await expect(etatDesCrises).toContainText("Survival baseline preserved");
  await expect(etatDesCrises).toContainText(
    "Deploy the Halt at Dry Well.",
  );
  await expect(etatDesCrises).toContainText("Recovery underway");
  await expect(etatDesCrises).toContainText("Cost : 2 Materials");
  await expect(etatDesCrises).toContainText("Cause : Water rationing");

  await page.getByRole("button", { name: "Pause" }).click();
  await page
    .getByRole("region", { name: "Infrastructure" })
    .getByRole("button", { name: "Deploy the Halt" })
    .click();

  await expect(etatDesCrises).toContainText("Recovery accomplished");
  await expect(etatDesCrises).toContainText("Cost : 2 Materials committed");
  await expect(etatDesCrises).toContainText("Cause : Water rationing");

  await page.getByRole("button", { name: "Sauvegarder" }).click();
  await expect(page.getByText("Sauvegarde à jour.")).toBeVisible();
  await page.reload();

  await expect(
    page.getByRole("region", { name: "Crises et Cicatrices" }),
  ).toContainText("Rationnement de l’Eau");
  await expect(page.getByText("Socle de survie préservé")).toBeVisible();
  const recuperationReprise = page.getByRole("region", {
    name: "Crises et Cicatrices",
  });
  await expect(recuperationReprise).toContainText("Récupération accomplie");
  await expect(recuperationReprise).toContainText(
    "Coût : 2 Matériaux engagés",
  );
  await expect(recuperationReprise).toContainText(
    "Cause : Rationnement de l’Eau",
  );
});
