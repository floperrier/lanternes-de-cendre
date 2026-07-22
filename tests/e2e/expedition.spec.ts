import { expect, test, type Page } from "@playwright/test";

import { creerApplicationCampagne } from "../../src/application/application";
import {
  creerReproductionInitiale,
  creerSauvegarde,
  exporterSauvegarde,
} from "../../src/sauvegarde/sauvegarde";
import type { CommandeDeReproduction } from "../../src/sauvegarde/types";
import { empreinteEtat } from "../../src/simulation/campagne";

function creerArchiveDExpedition(statut: "ordre-requis" | "terminee"): string {
  const application = creerApplicationCampagne("CENDRE-01");
  const initiale = creerReproductionInitiale(application.lireEtat());
  const commandes: CommandeDeReproduction[] = [];
  application.sabonnerAuxCommandes((commande, etat) => {
    commandes.push({
      sequence: commandes.length,
      commande,
      empreinteApres: empreinteEtat(etat),
    });
  });
  application.envoyerCommande({
    type: "expedition.lancer",
    expeditionId: "vannes-grises",
  });
  application.envoyerCommande({
    type: "temps-du-convoi.ecouler",
    secondesReelles: 9_420,
  });
  if (statut === "terminee") {
    application.envoyerCommande({
      type: "expedition.ordonner",
      expeditionId: "vannes-grises",
      intention: "couper-contourner",
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 9_000,
    });
  }
  return exporterSauvegarde(
    creerSauvegarde(application.lireEtat(), { ...initiale, commandes }),
  );
}

async function importerArchive(
  page: Page,
  nom: string,
  archive: string,
) {
  await page.getByLabel("Choisir une sauvegarde à importer").setInputFiles({
    name: nom,
    mimeType: "application/json",
    buffer: Buffer.from(archive),
  });
}

test("une Expédition autonome attend un ordre distant puis conserve son Bilan", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");

  const expedition = page.getByRole("region", {
    name: "Expédition — Station des Vannes Grises",
  });
  await expect(expedition).toContainText("Rétablir un débit exploitable");
  await expect(expedition).toContainText("Cartographier l’accès et rentrer");
  await expect(expedition).toContainText("Liora");
  await expect(expedition).toContainText("4 Habitants");
  await expect(expedition).toContainText("Filtres doubles");
  await expect(expedition).toContainText("Écart réversible ≤ 45 min");
  await expect(expedition).toContainText("Repli à la première blessure");
  await expect(expedition).toContainText("Vivres : −331,2 rations");
  await expect(expedition).toContainText("4 h 10–5 h 20");
  await expect(expedition).toContainText("Itinéraire des Vanniers");
  await expect(expedition).toContainText("Exposition à la cendre — marquée");
  await expect(expedition).toContainText(
    "Pire conséquence : Blessure d’un membre de l’équipe",
  );

  const lancer = expedition.getByRole("button", {
    name: "Confirmer le mandat et lancer",
  });
  await lancer.focus();
  await page.keyboard.press("Enter");
  await expect(expedition).toContainText("Mandat confirmé");

  await importerArchive(
    page,
    "expedition-ordre-requis.json",
    creerArchiveDExpedition("ordre-requis"),
  );

  await expect(expedition).toContainText("Passerelle rompue : détour autonome");
  await expect(expedition).toContainText("Sas contaminé traité sans ordre");
  await expect(expedition).toContainText("Équipe en attente");
  const ordre = page.getByRole("region", {
    name: "La salle des pompes est encore alimentée",
  });
  await expect(
    ordre.getByRole("heading", {
      name: "La salle des pompes est encore alimentée",
    }),
  ).toBeFocused();
  await expect(ordre).toContainText("Galerie praticable encore 20 à 35 min");
  await expect(ordre).toContainText(
    "L’Expédition attend ; le Temps du convoi continue",
  );

  const horloge = page.locator(".commandes-du-temps > time");
  const avant = await horloge.textContent();
  await page.clock.runFor(1_000);
  await expect(horloge).not.toHaveText(avant ?? "");
  await page.getByRole("button", { name: "Pause" }).click();
  const enPause = await horloge.textContent();
  await page.clock.runFor(2_000);
  await expect(horloge).toHaveText(enPause ?? "");

  await ordre.getByRole("button", { name: /Couper puis contourner/ }).click();
  await expect(expedition).toContainText("Retour autonome");
  await importerArchive(
    page,
    "expedition-terminee.json",
    creerArchiveDExpedition("terminee"),
  );

  await expect(expedition).toContainText("Bilan de retour");
  await expect(expedition).toContainText("Pompe partiellement réamorcée");
  await expect(expedition).toContainText("Prévu : 4 h 10–5 h 20");
  await expect(expedition).toContainText("Réalisé : 5 h 07");
  await expect(expedition).toContainText("Eau : +1,6 j d’Autonomie");
  await expect(expedition).toContainText(
    "Alimentation coupée ; débit réduit, retour sûr.",
  );

  const sauvegarde = page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  await sauvegarde.getByRole("button", { name: "Sauvegarder" }).click();
  await expect(sauvegarde.getByText("Sauvegarde à jour.")).toBeVisible();
  await page.reload();

  await expect(
    page.getByRole("region", {
      name: "Expédition — Station des Vannes Grises",
    }),
  ).toContainText("Pompe partiellement réamorcée");
});

test("le mandat d’Expédition suit la langue anglaise", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "English" }).click();

  const expedition = page.getByRole("region", {
    name: "Expedition — Grey Sluices Station",
  });
  await expect(expedition).toContainText("Restore a usable flow");
  await expect(expedition).toContainText("4 inhabitants");
  await expect(expedition).toContainText("Sluice Keepers’ itinerary");
  await expect(
    expedition.getByRole("button", {
      name: "Confirm mandate and launch",
    }),
  ).toBeVisible();
});
