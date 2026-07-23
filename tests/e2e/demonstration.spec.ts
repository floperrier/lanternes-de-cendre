import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

import { expect, test, type Locator, type Page } from "@playwright/test";

import { installerHorlogeFixe } from "./horloge";

test.use({
  viewport: { width: 640, height: 360 },
  deviceScaleFactor: 2,
});

async function activerAuClavier(
  page: Page,
  cible: Locator,
): Promise<void> {
  await expect(cible).toBeVisible();
  await cible.focus();
  await expect(cible).toBeFocused();
  await page.keyboard.press("Enter");
}

test("la Démonstration complète atteint sa porte premium sans sollicitation anticipée", async ({
  page,
}, testInfo) => {
  test.setTimeout(120_000);
  const chargementsDuContenuComplet: string[] = [];
  page.on("request", (requete) => {
    if (requete.url().includes("/api/commercial/contenu-complet")) {
      chargementsDuContenuComplet.push(requete.url());
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installerHorlogeFixe(page);
  await page.goto("/");
  expect(
    (
      await page.request.get(
        "/api/commercial/assets/haut-puits-vanniers.webp",
      )
    ).status(),
  ).toBe(401);
  const emulationNavigateur = await page.evaluate(() => ({
    mouvementReduit: window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches,
    largeurMiseEnPage: window.innerWidth,
    pixelsParPixelCss: window.devicePixelRatio,
    largeurPhysique: window.innerWidth * window.devicePixelRatio,
  }));
  expect(emulationNavigateur).toEqual({
    mouvementReduit: true,
    largeurMiseEnPage: 640,
    pixelsParPixelCss: 2,
    largeurPhysique: 1280,
  });
  const surfacesVisuelles = page.locator("canvas");
  await expect(surfacesVisuelles).toHaveCount(2);
  for (const surface of await surfacesVisuelles.all()) {
    await expect(surface).toHaveAttribute("aria-hidden", "true");
  }
  await expect(page.getByText(/Accès premium|Premium Access/)).toHaveCount(0);

  const incident = page.getByRole("region", {
    name: "Pompe de purification instable",
  });
  await activerAuClavier(
    page,
    incident.getByRole("button", { name: "Sécuriser la pompe" }),
  );

  await page.clock.fastForward(60_000);
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
    await activerAuClavier(
      page,
      evenement.getByRole("button", { name: choix }),
    );
    if (titre !== "Ilyana tient le clapet") {
      await page.clock.fastForward(1_000);
    }
  }
  await expect(page.getByText(/Accès premium|Premium Access/)).toHaveCount(0);

  const sauvegarde = page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  await activerAuClavier(
    page,
    sauvegarde.getByRole("button", { name: "Sauvegarder" }),
  );
  await expect(sauvegarde.getByText("Sauvegarde à jour.")).toBeVisible();

  const compagnon = page.getByRole("region", {
    name: "Compagnon — Ilyana Voss",
  });
  await activerAuClavier(
    page,
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
    page,
    conseil.getByRole("button", {
      name: "Prioriser la sécurisation du circuit",
    }),
  );

  const expedition = page.getByRole("region", {
    name: "Expédition — Station des Vannes Grises",
  });
  await activerAuClavier(
    page,
    expedition.getByRole("button", {
      name: "Confirmer le mandat et lancer",
    }),
  );
  const etudier = page
    .locator(".atlas__actions")
    .getByRole("button", { name: "Étudier l’Engagement vers Haut-Puits" });
  await activerAuClavier(page, etudier);
  const engagement = page.getByRole("dialog", {
    name: "Engagement vers Haut-Puits",
  });
  const confirmerEngagement = engagement.getByRole("button", {
    name: "Confirmer l’Engagement sans retour vers Haut-Puits",
  });
  await expect(confirmerEngagement).toBeFocused();
  await activerAuClavier(page, confirmerEngagement);

  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 4×" }),
  );
  await page.clock.fastForward(90_000);
  const conflit = page.getByRole("region", {
    name: "L’eau qui reste dans les Bassins fendus",
  });
  await expect(conflit).toContainText("Haut-Puits");
  await expect(conflit.getByRole("img")).toBeVisible();
  await activerAuClavier(
    page,
    conflit.getByRole("button", { name: "Promettre un partage mesuré" }),
  );
  await expect(page.getByText(/Accès premium|Premium Access/)).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Étudier l’Engagement vers Les Vanniers",
    }),
  ).toHaveCount(0);
  expect(chargementsDuContenuComplet).toHaveLength(0);

  await page.clock.fastForward(2_265_000);
  const ordre = page.getByRole("region", {
    name: "La salle des pompes est encore alimentée",
  });
  await activerAuClavier(
    page,
    ordre.getByRole("button", { name: /Couper puis contourner/ }),
  );
  await page.clock.fastForward(2_250_000);

  const jalon = page.getByRole("region", { name: "La route continue" });
  await expect(
    jalon.getByRole("heading", { name: "La route continue" }),
  ).toBeFocused();
  await expect(page.locator(".app-header")).toHaveAttribute("inert", "");
  await expect(page.locator(".scene-layout")).toHaveAttribute("inert", "");
  await expect(jalon).toContainText(
    "La même Campagne pourra continuer avec l’Accès premium, sans recommencer.",
  );
  await expect(expedition).toContainText("Bilan de retour");
  await expect(page.getByText("En pause").first()).toBeVisible();

  await activerAuClavier(
    page,
    sauvegarde.getByRole("button", { name: "Sauvegarder" }),
  );
  await expect(sauvegarde.getByText("Sauvegarde à jour.")).toBeVisible();
  const telechargement = page.waitForEvent("download");
  await activerAuClavier(
    page,
    sauvegarde.getByRole("button", { name: "Exporter" }),
  );
  const archive = await telechargement;
  const cheminArchive = await archive.path();
  expect(cheminArchive).not.toBeNull();
  const ouvertureDeFichier = page.waitForEvent("filechooser");
  await activerAuClavier(
    page,
    sauvegarde.getByRole("button", { name: "Importer", exact: true }),
  );
  const importeur = await ouvertureDeFichier;
  await importeur.setFiles(cheminArchive!);
  await expect(
    sauvegarde.getByText("Sauvegarde importée et reprise."),
  ).toBeVisible();
  await expect(page.getByRole("region", { name: "La route continue" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("region", { name: "La route continue" })).toBeVisible();
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "English" }),
  );
  await expect(
    page.getByRole("region", { name: "The road continues" }),
  ).toContainText("The same Campaign can continue with Premium Access");

  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Français" }),
  );
  const porteCommerciale = page.getByRole("region", {
    name: "La route continue",
  });
  const email = `veilleuse-demonstration-${randomUUID()}@example.test`;
  await porteCommerciale.getByLabel("Adresse email").fill(email);
  await activerAuClavier(
    page,
    porteCommerciale.getByRole("button", {
      name: "Acheter la V1 — 19,99 € TTC",
    }),
  );
  await expect(
    porteCommerciale.getByText(
      "Lien de connexion envoyé. Il expire dans cinq minutes.",
    ),
  ).toBeVisible();
  await activerAuClavier(
    page,
    porteCommerciale.getByRole("button", {
      name: "Ouvrir le lien de test",
    }),
  );
  await expect(
    porteCommerciale.getByText(/Environnement Paddle de test/),
  ).toBeVisible();
  await activerAuClavier(
    page,
    porteCommerciale.getByRole("button", {
      name: "Valider le paiement test",
    }),
  );

  await expect(porteCommerciale).toHaveCount(0);
  await expect(
    page.getByText(
      "Accès premium permanent actif. La même Campagne peut continuer.",
    ),
  ).toBeVisible();
  expect(chargementsDuContenuComplet).toHaveLength(1);
  await expect(
    page.getByRole("button", {
      name: "Étudier l’Engagement vers Les Vanniers",
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Haut-Puits" }),
  ).toContainText("Marché de l’eau");
  expect(
    await page.evaluate(async () => {
      const reponse = await fetch(
        "/api/commercial/assets/haut-puits-vanniers.webp",
      );
      return {
        statut: reponse.status,
        type: reponse.headers.get("content-type"),
        octets: (await reponse.arrayBuffer()).byteLength,
      };
    }),
  ).toEqual({
    statut: 200,
    type: "image/webp",
    octets: expect.any(Number),
  });

  const halteDeHautPuits = [
    ["Le pacte des citernes", "Garantir le partage de l’Eau"],
    [
      "Les Vanniers sous le panache",
      "Confiner les boues avec les équipes du convoi",
    ],
    [
      "Ce que retient le Décanteur",
      "Consigner le procédé du Décanteur itinérant",
    ],
    ["Ilyana devant la dernière vanne", "Lui confier le registre de partage"],
  ] as const;
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 1×" }),
  );
  await page.clock.fastForward(1_000);
  for (const [titre, choix] of halteDeHautPuits) {
    const evenement = page.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      page,
      evenement.getByRole("button", { name: choix }),
    );
    await page.clock.fastForward(1_000);
  }

  await activerAuClavier(
    page,
    page.getByRole("button", {
      name: "Étudier l’Engagement vers Les Vanniers",
    }),
  );
  await activerAuClavier(
    page,
    page
      .getByRole("dialog", { name: "Engagement vers Les Vanniers" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Les Vanniers",
      }),
  );
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 4×" }),
  );
  await page.clock.fastForward(105_000);

  const atlas = page.getByRole("region", {
    name: "Atlas d’exploitation",
  });
  await expect(atlas).toContainText("Relevé transmis par la branche d’approche");
  await expect(atlas).toContainText("4 L de Combustible · 6 L d’Eau");
  await activerAuClavier(
    page,
    atlas.getByRole("button", {
      name: "Étudier l’Engagement vers Relais des Vannes",
    }),
  );
  await activerAuClavier(
    page,
    page
      .getByRole("dialog", { name: "Engagement vers Relais des Vannes" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Relais des Vannes",
      }),
  );
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 4×" }),
  );
  await page.clock.fastForward(75_000);
  await expect(
    atlas.getByRole("button", {
      name: /Étudier l’Engagement vers (Les Vanniers|Veille-Basse)/,
    }),
  ).toHaveCount(0);

  const passageDesNacelles = [
    [
      "Le poids des deux rives",
      "Répartir les contrepoids entre les deux rives",
    ],
    ["Le frein sous la cendre", "Baliser le boîtier et ses témoins"],
    [
      "La main sur le frein",
      "Transformer clandestinement le frein révélé",
    ],
    [
      "Deux voix dans le câble",
      "Porter le passage partagé au Conseil des Vannes",
    ],
  ] as const;
  for (const [titre, choix] of passageDesNacelles) {
    const evenement = page.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      page,
      evenement.getByRole("button", { name: choix }),
    );
    await page.clock.fastForward(1_000);
  }
  const journalCausal = page.locator("details.journal-causal");
  await journalCausal.locator("summary").click();
  await expect(
    journalCausal.getByText("Trace de limaille de laiton persistante"),
  ).toBeVisible();

  await activerAuClavier(
    page,
    atlas.getByRole("button", {
      name: "Étudier l’Engagement vers Déversoir Noir",
    }),
  );
  await activerAuClavier(
    page,
    page
      .getByRole("dialog", { name: "Engagement vers Déversoir Noir" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Déversoir Noir",
      }),
  );
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 4×" }),
  );
  await page.clock.fastForward(90_000);

  const ouvertureDuDeversoir = [
    ["La conduite zéro", "Relever l’interface avant de refermer la dalle"],
    [
      "La tempête aux vannes",
      "Convoquer chaque délégation autour de la table",
    ],
  ] as const;
  for (const [titre, choix] of ouvertureDuDeversoir) {
    const evenement = page.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      page,
      evenement.getByRole("button", { name: choix }),
    );
    await page.clock.fastForward(1_000);
  }

  const conseilDesVannes = page.getByRole("region", {
    name: "Conseil des Vannes",
  });
  await expect(
    conseilDesVannes.getByRole("button", {
      name: "Réorienter la Cohorte vers une Arche de déplacés",
    }),
  ).toHaveCount(0);
  await expect(
    conseilDesVannes.getByRole("button", {
      name: "Contraindre les vannes et assumer la coercition",
    }),
  ).toBeVisible();
  await activerAuClavier(
    page,
    conseilDesVannes.getByRole("button", {
      name: "Réparer le vieux décanteur comme projet majeur",
    }),
  );
  await page.clock.fastForward(1_000);

  const fermetureDesBassins = [
    [
      "Le châssis des Bassins",
      "Sceller la transformation retenue dans le châssis",
    ],
    [
      "Le passage sans retour",
      "Consigner chaque abandon et chaque occasion",
    ],
  ] as const;
  for (const [titre, choix] of fermetureDesBassins) {
    const evenement = page.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      page,
      evenement.getByRole("button", { name: choix }),
    );
    await page.clock.fastForward(1_000);
  }

  await activerAuClavier(
    page,
    atlas.getByRole("button", {
      name: "Étudier l’Engagement vers Passage de la Ligne Zéro",
    }),
  );
  await activerAuClavier(
    page,
    page
      .getByRole("dialog", {
        name: "Engagement vers Lisière de la Trame de Fer",
      })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Lisière de la Trame de Fer",
      }),
  );
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 4×" }),
  );
  await page.clock.fastForward(120_000);
  await expect(atlas).toContainText("Lisière de la Trame de Fer");

  await expect(expedition).toContainText("Bilan de retour");
  const exportApresAchat = page.waitForEvent("download");
  await page
    .getByRole("region", { name: "Sauvegarde de Campagne" })
    .getByRole("button", { name: "Exporter" })
    .click();
  const archiveApresAchat = await exportApresAchat;
  const cheminApresAchat = await archiveApresAchat.path();
  expect(cheminApresAchat).not.toBeNull();
  const contenuApresAchat = await readFile(cheminApresAchat!, "utf8");
  expect(contenuApresAchat).not.toContain(email);
  expect(contenuApresAchat).not.toMatch(
    /identiteId|preuveLocale|acces-premium/i,
  );
  expect(contenuApresAchat).toContain(
    "bassins.nacelles.trace-laiton-persistante",
  );
  const importApresAchat = page.waitForEvent("filechooser");
  await activerAuClavier(
    page,
    sauvegarde.getByRole("button", { name: "Importer", exact: true }),
  );
  await (await importApresAchat).setFiles(cheminApresAchat!);
  await expect(
    sauvegarde.getByText("Sauvegarde importée et reprise."),
  ).toBeVisible();
  if (!(await journalCausal.evaluate((journal) => journal.hasAttribute("open")))) {
    await journalCausal.locator("summary").click();
  }
  await expect(
    journalCausal.getByText("Trace de limaille de laiton persistante"),
  ).toBeVisible();

  const navigateurVierge = await page.context().browser()!.newContext();
  const autrePage = await navigateurVierge.newPage();
  await autrePage.goto("/");
  await expect(
    autrePage.locator("time").filter({ hasText: "00:00" }).first(),
  ).toBeVisible();
  await activerAuClavier(
    autrePage,
    autrePage.getByRole("button", { name: "Restaurer mon achat" }),
  );
  await autrePage.getByLabel("Adresse email").fill(email);
  await activerAuClavier(
    autrePage,
    autrePage.getByRole("button", { name: "Restaurer mon achat" }),
  );
  await activerAuClavier(
    autrePage,
    autrePage.getByRole("button", { name: "Ouvrir le lien de test" }),
  );
  await expect(
    autrePage.getByText(
      "Accès premium permanent actif. La même Campagne peut continuer.",
    ),
  ).toBeVisible();
  await expect(autrePage.getByText("CENDRE-01").first()).toBeVisible();
  await expect(autrePage.getByText("Bilan de retour")).toHaveCount(0);
  await navigateurVierge.close();

  await page.screenshot({
    path: testInfo.outputPath("demonstration-final.png"),
    fullPage: true,
  });
});
