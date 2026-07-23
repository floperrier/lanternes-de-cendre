import { expect, test, type Locator, type Page } from "@playwright/test";

import { creerApplicationCampagne } from "../../src/application/application";
import {
  creerReproductionInitiale,
  creerSauvegarde,
  exporterSauvegarde,
} from "../../src/sauvegarde/sauvegarde";
import type { CommandeDeReproduction } from "../../src/sauvegarde/types";
import { empreinteEtat } from "../../src/simulation/campagne";

async function activerAuClavier(cible: Locator): Promise<void> {
  await cible.focus();
  await expect(cible).toBeFocused();
  await cible.press("Enter");
}

function creerArchiveDeDemonstration(
  statut: "conflit" | "ordre-requis" | "terminee",
): string {
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
  const envoyer = application.envoyerCommande;
  envoyer({ type: "temps-du-convoi.ecouler", secondesReelles: 60 });
  for (const [evenementId, choixId] of [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
  ] as const) {
    envoyer({ type: "evenement-narratif.choisir", evenementId, choixId });
    if (evenementId !== "prologue.ilyana-au-clapet") {
      envoyer({ type: "temps-du-convoi.ecouler", secondesReelles: 1 });
    }
  }
  envoyer({
    type: "incident.ordonner",
    incidentId: "purification.pompe-instable",
    ordre: "securiser-pompe",
  });
  envoyer({
    type: "compagnon.affecter",
    compagnonId: "ilyana-voss",
    quartierId: "intendance",
  });
  envoyer({
    type: "conseil.decider",
    conseilId: "conseil.premiere-veille",
    sujetId: "purification-et-partage-de-l-eau",
    decisionId: "securiser-circuit",
  });
  envoyer({ type: "expedition.lancer", expeditionId: "vannes-grises" });
  envoyer({
    type: "engagement-de-route.confirmer",
    tronconId: "digue-des-puits",
  });
  envoyer({ type: "temps-du-convoi.regler-vitesse", vitesse: 4 });
  envoyer({ type: "temps-du-convoi.ecouler", secondesReelles: 90 });
  if (statut === "conflit") {
    return exporterSauvegarde(
      creerSauvegarde(application.lireEtat(), {
        ...reproductionInitiale,
        commandes,
      }),
    );
  }
  envoyer({
    type: "evenement-narratif.choisir",
    evenementId: "bassins-fendus.eau-de-haut-puits",
    choixId: "promettre-partage",
  });
  envoyer({ type: "temps-du-convoi.ecouler", secondesReelles: 2_265 });
  if (statut === "terminee") {
    envoyer({
      type: "expedition.ordonner",
      expeditionId: "vannes-grises",
      intention: "couper-contourner",
    });
    envoyer({ type: "temps-du-convoi.ecouler", secondesReelles: 2_250 });
  }
  return exporterSauvegarde(
    creerSauvegarde(application.lireEtat(), {
      ...reproductionInitiale,
      commandes,
    }),
  );
}

/**
 * Les longues attentes de simulation sont remplacées par des archives de
 * checkpoint produites par le moteur et rejouables bit à bit. Le scénario
 * vérifie donc les frontières avant/après reprise ; il ne prétend pas simuler
 * une continuité murale de plusieurs heures dans le navigateur.
 */
async function importerArchive(
  page: Page,
  nom: string,
  archive: string,
): Promise<void> {
  await page.getByLabel("Choisir une sauvegarde à importer").setInputFiles({
    name: nom,
    mimeType: "application/json",
    buffer: Buffer.from(archive),
  });
}

test("la Démonstration complète atteint sa porte premium sans sollicitation anticipée", async ({
  page,
}, testInfo) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
  const sessionCdp = await page.context().newCDPSession(page);
  await sessionCdp.send("Emulation.setPageScaleFactor", {
    pageScaleFactor: 2,
  });
  const emulationNavigateur = await page.evaluate(() => ({
    mouvementReduit: window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches,
    echelleVisuelle: window.visualViewport?.scale ?? 1,
    zoomCss: getComputedStyle(document.documentElement).zoom,
  }));
  expect(emulationNavigateur).toEqual({
    mouvementReduit: true,
    echelleVisuelle: 2,
    zoomCss: "1",
  });
  const surfacesVisuelles = page.locator("canvas");
  await expect(surfacesVisuelles).toHaveCount(2);
  for (const surface of await surfacesVisuelles.all()) {
    await expect(surface).toHaveAttribute("aria-hidden", "true");
  }
  await expect(page.getByText(/Accès premium|Premium Access/)).toHaveCount(0);

  await page.clock.runFor(60_000);
  const titresEtChoixDuPrologue = [
    ["Des signaux sous la cendre", "Ouvrir les Foyers"],
    ["Le Phare reçoit une réponse", "Consigner l’harmonique pour la route"],
    ["La cendre dans les filtres", "Réserver les filtres propres aux Foyers"],
    ["Ilyana tient le clapet", "Lui confier l’isolement du clapet"],
  ] as const;
  for (const [titre, choix] of titresEtChoixDuPrologue) {
    const evenement = page.getByRole("region", { name: titre });
    await expect(evenement).toBeVisible();
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(evenement.getByRole("button", { name: choix }));
    if (titre !== "Ilyana tient le clapet") {
      await page.clock.runFor(1_000);
    }
  }
  await expect(page.getByText(/Accès premium|Premium Access/)).toHaveCount(0);

  const incident = page.getByRole("region", {
    name: "Pompe de purification instable",
  });
  await activerAuClavier(
    incident.getByRole("button", { name: "Sécuriser la pompe" }),
  );

  const sauvegarde = page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  await activerAuClavier(
    sauvegarde.getByRole("button", { name: "Sauvegarder" }),
  );
  await expect(sauvegarde.getByText("Sauvegarde à jour.")).toBeVisible();

  const compagnon = page.getByRole("region", {
    name: "Compagnon — Ilyana Voss",
  });
  await activerAuClavier(
    compagnon.getByRole("button", { name: "Affecter à l’Intendance" }),
  );
  const conseil = page.getByRole("region", {
    name: "Conseil de la première veille",
  });
  await expect(
    conseil.getByRole("heading", {
      name: "Conseil de la première veille",
      exact: true,
    }),
  ).toBeFocused();
  await activerAuClavier(
    conseil.getByRole("button", {
      name: "Prioriser la sécurisation du circuit",
    }),
  );

  const expedition = page.getByRole("region", {
    name: "Expédition — Station des Vannes Grises",
  });
  await activerAuClavier(
    expedition.getByRole("button", {
      name: "Confirmer le mandat et lancer",
    }),
  );
  const etudier = page
    .locator(".atlas__actions")
    .getByRole("button", { name: "Étudier l’Engagement vers Haut-Puits" });
  await activerAuClavier(etudier);
  const engagement = page.getByRole("dialog", {
    name: "Engagement vers Haut-Puits",
  });
  const confirmerEngagement = engagement.getByRole("button", {
    name: "Confirmer l’Engagement sans retour vers Haut-Puits",
  });
  await expect(confirmerEngagement).toBeFocused();
  await activerAuClavier(confirmerEngagement);

  await activerAuClavier(page.getByRole("button", { name: "Vitesse 4×" }));
  await importerArchive(
    page,
    "demonstration-conflit.json",
    creerArchiveDeDemonstration("conflit"),
  );
  const conflit = page.getByRole("region", {
    name: "L’eau qui reste aux Bassins",
  });
  await expect(conflit).toContainText("Haut-Puits");
  await expect(conflit.getByRole("img")).toBeVisible();
  await activerAuClavier(
    conflit.getByRole("button", { name: "Promettre un partage mesuré" }),
  );
  await expect(page.getByText(/Accès premium|Premium Access/)).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Étudier l’Engagement vers Relais des Vannes",
    }),
  ).toHaveCount(0);

  await importerArchive(
    page,
    "demonstration-ordre-requis.json",
    creerArchiveDeDemonstration("ordre-requis"),
  );
  const ordre = page.getByRole("region", {
    name: "La salle des pompes est encore alimentée",
  });
  await activerAuClavier(
    ordre.getByRole("button", { name: /Couper puis contourner/ }),
  );
  await importerArchive(
    page,
    "demonstration-terminee.json",
    creerArchiveDeDemonstration("terminee"),
  );

  const jalon = page.getByRole("region", { name: "La route continue" });
  await expect(jalon.getByRole("heading")).toBeFocused();
  await expect(page.locator(".app-header")).toHaveAttribute("inert", "");
  await expect(page.locator(".scene-layout")).toHaveAttribute("inert", "");
  await expect(jalon).toContainText(
    "La même Campagne pourra continuer avec l’Accès premium, sans recommencer.",
  );
  await expect(expedition).toContainText("Bilan de retour");
  await expect(page.getByText("En pause").first()).toBeVisible();

  await activerAuClavier(
    sauvegarde.getByRole("button", { name: "Sauvegarder" }),
  );
  await expect(sauvegarde.getByText("Sauvegarde à jour.")).toBeVisible();
  const telechargement = page.waitForEvent("download");
  await activerAuClavier(
    sauvegarde.getByRole("button", { name: "Exporter" }),
  );
  const archive = await telechargement;
  const cheminArchive = await archive.path();
  expect(cheminArchive).not.toBeNull();
  await page.getByLabel("Choisir une sauvegarde à importer").setInputFiles(
    cheminArchive!,
  );
  await expect(
    sauvegarde.getByText("Sauvegarde importée et reprise."),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "La route continue" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("region", { name: "La route continue" })).toBeVisible();
  await activerAuClavier(page.getByRole("button", { name: "English" }));
  await expect(
    page.getByRole("region", { name: "The road continues" }),
  ).toContainText("The same Campaign can continue with Premium Access");

  await page.screenshot({
    path: testInfo.outputPath("demonstration-final.png"),
    fullPage: true,
  });
});
