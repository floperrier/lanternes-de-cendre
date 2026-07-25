import { expect, test } from "@playwright/test";

import { installerHorlogeFixe } from "./horloge";

test("les Autonomies précèdent les détails économiques sourcés", async ({
  page,
}) => {
  await installerHorlogeFixe(page);
  await page.goto("/");

  const pilotage = page.getByRole("complementary", {
    name: "Pilotage du convoi",
  });
  await expect(pilotage.getByRole("heading", { name: "Autonomies" })).toBeVisible();
  await expect(pilotage).toContainText("Vivres20 h");
  await expect(pilotage).toContainText("Chaleur+8 kW");

  const details = pilotage.getByText("Quantités, flux et prévision");
  await details.focus();
  await page.keyboard.press("Enter");

  await expect(pilotage).toContainText("Halte du puits sec dans 3 h");
  await expect(pilotage).toContainText("920 rations");
  await expect(pilotage).toContainText("−46 rations/h");
  await expect(pilotage).toContainText("768–796 rations");
  await expect(pilotage).toContainText("Relevé de route du Phare");
});

test("la Doctrine pilote un Incident et le Journal causal au clavier", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installerHorlogeFixe(page);
  await page.goto("/");

  const doctrine = page.getByText("Doctrine du convoi");
  await doctrine.focus();
  await page.keyboard.press("Enter");

  const entretienPreventif = page.getByRole("button", {
    name: "Préventif",
  });
  await entretienPreventif.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Transition vers Préventif · 30 s")).toBeVisible();

  await page.clock.fastForward(30_000);
  await expect(entretienPreventif).toHaveAttribute("aria-pressed", "true");

  const incident = page.getByRole("region", {
    name: "Pompe de purification instable",
  });
  await expect(incident).toContainText("Inspection de l’Atelier");
  await expect(incident).toContainText("Préserver les Habitants");

  const ordre = incident.getByRole("button", { name: "Sécuriser la pompe" });
  await ordre.focus();
  await page.keyboard.press("Enter");

  await expect(incident).toBeHidden();
  const journal = page.getByText("Journal causal (1)");
  await journal.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Pompe de purification — joint remplacé")).toBeVisible();
  await expect(page.getByText("Acteurs — Porte-Lanterne, Équipes d’entretien")).toBeVisible();
  await expect(page.getByText("Cible — Pompe de purification")).toBeVisible();
  await expect(page.getByText("3 Matériaux consommés")).toBeVisible();
  await expect(page.getByText("Aucun Habitant exposé")).toBeVisible();
});

test("le Journal rend la cohorte orientée sans identifiant technique", async ({
  page,
}) => {
  await installerHorlogeFixe(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Vitesse 4×" }).click();
  await page.clock.fastForward(15_000);

  const evenement = page.getByRole("region", {
    name: "Des signaux sous la cendre",
  });
  const orienter = evenement.getByRole("button", {
    name: "Transmettre la route de Veille-Basse",
  });
  await orienter.focus();
  await page.keyboard.press("Enter");

  await expect(evenement).toBeHidden();
  const journal = page.getByText("Journal causal (1)");
  await journal.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Cohorte orientée vers Veille-Basse")).toBeVisible();
  await expect(
    page.getByText("Acteurs — Porte-Lanterne, Cohorte de réfugiés"),
  ).toBeVisible();
  await expect(page.getByText("Cible — Cohorte de réfugiés")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(
    "prologue.cohorte-orientee",
  );
  await expect(page.locator(".journal-causal")).not.toContainText(
    "Matériel —",
  );
});
