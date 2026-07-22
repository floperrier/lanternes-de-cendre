import { expect, test } from "@playwright/test";

import { creerApplicationCampagne } from "../../src/application/application";
import {
  creerReproductionInitiale,
  creerSauvegarde,
  exporterSauvegarde,
} from "../../src/sauvegarde/sauvegarde";
import type { CommandeDeReproduction } from "../../src/sauvegarde/types";
import { empreinteEtat } from "../../src/simulation/campagne";

function creerArchiveAuJalonSuivant(): string {
  const application = creerApplicationCampagne("CENDRE-01");
  const reproductionInitiale = creerReproductionInitiale(
    application.lireEtat(),
  );
  const commandes: CommandeDeReproduction[] = [];
  application.sabonnerAuxCommandes((commande, etat) => {
    commandes.push({
      sequence: commandes.length,
      commande,
      empreinteApres: empreinteEtat(etat),
    });
  });
  application.envoyerCommande({
    type: "engagement-de-route.confirmer",
    tronconId: "digue-des-puits",
  });
  application.envoyerCommande({
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  });
  application.envoyerCommande({
    type: "temps-du-convoi.ecouler",
    secondesReelles: 90,
  });

  return exporterSauvegarde(
    creerSauvegarde(application.lireEtat(), {
      ...reproductionInitiale,
      commandes,
    }),
  );
}

test("l’Atlas et sa liste DOM comparent les mêmes Renseignements sourcés", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");

  const atlas = page.getByRole("region", { name: "Atlas d’exploitation" });
  await expect(atlas.getByTestId("atlas-pixi")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(atlas.locator("canvas")).toHaveAttribute("aria-hidden", "true");
  await expect(atlas).toContainText("Halte du puits sec");
  await expect(atlas).toContainText("Halte du puits sec → Haut-Puits");
  await expect(atlas).toContainText("Vigie du Phare");
  await expect(atlas).toContainText("Messagers de Haut-Puits");
  await expect(atlas).toContainText("Cendre basse");
  await expect(atlas).toContainText("Dérive vers l’est");
  await expect(atlas).toContainText("Puits Libres");
  await expect(atlas).toContainText("Consommation exacte : 3 L de Combustible");
  await expect(atlas).toContainText("Eau estimée : 3–5 L");

  const vueListe = atlas.getByText("Vue DOM en liste de l’Atlas");
  await vueListe.focus();
  await page.keyboard.press("Enter");
  const liste = atlas.locator(".atlas__liste-dom");
  await expect(liste).toContainText("Halte du puits sec → Haut-Puits");
  await expect(liste).toContainText("Nappe de saumure");
  await expect(liste).toContainText("Vigie du Phare · relevé maintenant");
  await expect(
    liste.getByRole("button", {
      name: "Étudier l’Engagement vers Haut-Puits",
    }),
  ).toBeVisible();
});

test("un Engagement confirmé suspend le Temps puis le Front condamne le retour", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");

  const atlas = page.getByRole("region", { name: "Atlas d’exploitation" });
  const etudier = atlas
    .locator(".atlas__actions")
    .getByRole("button", { name: "Étudier l’Engagement vers Haut-Puits" });
  await etudier.focus();
  await page.keyboard.press("Enter");

  const confirmation = page.getByRole("dialog", {
    name: "Engagement vers Haut-Puits",
  });
  await expect(confirmation).toContainText(
    "Cet Engagement est irréversible hors Crise explicite",
  );
  await expect(confirmation).toContainText("Durée exacte : 6 min");
  await expect(confirmation).toContainText("Eau estimée : 3–5 L");
  const confirmer = confirmation.getByRole("button", {
    name: "Confirmer l’Engagement sans retour vers Haut-Puits",
  });
  const annuler = confirmation.getByRole("button", { name: "Annuler" });
  await expect(confirmer).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(annuler).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(confirmer).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(confirmation).toBeHidden();
  await expect(etudier).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(confirmation).toBeVisible();
  await expect(confirmer).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("button", { name: "Pause" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(atlas).toContainText("Aucun demi-tour normal");
  await expect(atlas).toContainText("Vigie du Phare");
  await expect(atlas).toContainText("Eau estimée : 3–5 L");

  await page
    .getByLabel("Choisir une sauvegarde à importer")
    .setInputFiles({
      name: "jalon-haut-puits.json",
      mimeType: "application/json",
      buffer: Buffer.from(creerArchiveAuJalonSuivant()),
    });

  await expect(atlas).toContainText("PositionHaut-Puits");
  await expect(atlas).toContainText("Front de cendre — accès arrière condamné");
  await expect(atlas).toContainText("Haut-Puits → Relais des Vannes");
  await expect(atlas).not.toContainText("Halte du puits sec → Haut-Puits");
});
