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

async function ouvrirLienDeTestSiPropose(page: Page): Promise<void> {
  const lienDeTest = page.getByRole("button", {
    name: "Ouvrir le lien de test",
  });
  const confirmation = page.getByText(
    "Accès premium permanent actif. La même Campagne peut continuer.",
  );
  await expect(lienDeTest.or(confirmation).first()).toBeVisible();
  if (await lienDeTest.isVisible()) {
    await activerAuClavier(page, lienDeTest);
  }
  await expect(confirmation).toBeVisible();
}

async function lireSecondesDeLaSauvegarde(page: Page): Promise<number> {
  const telechargement = page.waitForEvent("download");
  await page
    .getByRole("region", { name: "Sauvegarde de Campagne" })
    .getByRole("button", { name: "Exporter" })
    .click();
  const chemin = await (await telechargement).path();
  expect(chemin).not.toBeNull();
  const archive = JSON.parse(await readFile(chemin!, "utf8")) as {
    readonly etat: {
      readonly tempsDuConvoi: {
        readonly secondes: number;
      };
    };
  };
  return archive.etat.tempsDuConvoi.secondes;
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
  await page.clock.fastForward(121_000);
  await expect(atlas).toContainText("Lisière de la Trame de Fer");
  await activerAuClavier(
    page,
    sauvegarde.getByRole("button", { name: "Sauvegarder" }),
  );
  const exportALaLisiere = page.waitForEvent("download");
  await activerAuClavier(
    page,
    sauvegarde.getByRole("button", { name: "Exporter" }),
  );
  const archiveALaLisiere = await exportALaLisiere;
  const cheminArchiveALaLisiere = await archiveALaLisiere.path();
  expect(cheminArchiveALaLisiere).not.toBeNull();

  await activerAuClavier(
    page,
    atlas.getByRole("button", {
      name: "Étudier l’Engagement vers Rampe de Barrière-Neuve",
    }),
  );
  await activerAuClavier(
    page,
    page
      .getByRole("dialog", { name: "Engagement vers Barrière-Neuve" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Barrière-Neuve",
      }),
  );
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 4×" }),
  );
  await page.clock.fastForward(105_000);

  const controleDeBarriere = page.getByRole("region", {
    name: "Le permis des essieux",
  });
  await expect(controleDeBarriere.getByRole("img")).toBeVisible();
  await expect(controleDeBarriere).toContainText(
    "Contrôle des essieux de Barrière-Neuve",
  );
  await page.screenshot({
    path: testInfo.outputPath("trame-barriere-neuve.png"),
    fullPage: true,
  });
  await activerAuClavier(
    page,
    controleDeBarriere.getByRole("button", {
      name: "Prendre le permis républicain",
    }),
  );
  await page.clock.fastForward(1_000);
  const taxeDesLanternes = page.getByRole("region", {
    name: "La taxe des lanternes",
  });
  await activerAuClavier(
    page,
    taxeDesLanternes.getByRole("button", {
      name: "Acquitter la taxe en combustible",
    }),
  );
  await page.clock.fastForward(1_000);

  await activerAuClavier(
    page,
    atlas.getByRole("button", {
      name: "Étudier l’Engagement vers Voie des Ponts lourds",
    }),
  );
  await activerAuClavier(
    page,
    page
      .getByRole("dialog", { name: "Engagement vers Grand-Aiguillage" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Grand-Aiguillage",
      }),
  );
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Vitesse 4×" }),
  );
  await page.clock.fastForward(150_000);

  const choixDeGrandAiguillage = [
    ["La pièce sans série", "Ouvrir la réparation aux ateliers locaux"],
    [
      "L’eau des machines",
      "Rationner les tours et encadrer les réquisitions",
    ],
    ["Ilyana et l’attelage", "Former l’Attelage fédéré"],
  ] as const;
  for (const [titre, choix] of choixDeGrandAiguillage) {
    const evenement = page.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      page,
      evenement.getByRole("button", { name: choix }),
    );
    await page.clock.fastForward(1_000);
  }

  const grandAiguillage = page.getByRole("region", {
    name: "Grand-Aiguillage",
  });
  await expect(grandAiguillage).toContainText("Transactionnelle");
  await expect(grandAiguillage).toContainText(
    "Eau de refroidissement rationnée",
  );
  await expect(grandAiguillage).toContainText(
    "Permis républicain de circulation",
  );
  await expect(grandAiguillage).toContainText("Attelage fédéré — 8 Matériaux");
  await grandAiguillage.screenshot({
    path: testInfo.outputPath("trame-grand-aiguillage-mobile.png"),
  });
  await page.setViewportSize({ width: 1280, height: 720 });
  await grandAiguillage.scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath("trame-grand-aiguillage-desktop.png"),
  });
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "English" }),
  );
  await expect(
    page.getByRole("region", { name: "Grand Junction" }),
  ).toContainText("Iron Weave commitments");
  await expect(
    page.getByRole("region", { name: "Grand Junction" }),
  ).toContainText("Federated Hauler — 8 Materials");
  await activerAuClavier(
    page,
    page.getByRole("button", { name: "Français" }),
  );

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
  await ouvrirLienDeTestSiPropose(autrePage);
  await expect(autrePage.getByText("CENDRE-01").first()).toBeVisible();
  await expect(autrePage.getByText("Bilan de retour")).toHaveCount(0);
  await navigateurVierge.close();

  const navigateurTraverse = await page.context().browser()!.newContext({
    viewport: { width: 640, height: 360 },
    deviceScaleFactor: 2,
  });
  const pageTraverse = await navigateurTraverse.newPage();
  await installerHorlogeFixe(pageTraverse);
  await pageTraverse.goto("/");
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Restaurer mon achat" }),
  );
  await pageTraverse.getByLabel("Adresse email").fill(email);
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Restaurer mon achat" }),
  );
  await ouvrirLienDeTestSiPropose(pageTraverse);
  const sauvegardeTraverse = pageTraverse.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  const importALaLisiere = pageTraverse.waitForEvent("filechooser");
  await activerAuClavier(
    pageTraverse,
    sauvegardeTraverse.getByRole("button", {
      name: "Importer",
      exact: true,
    }),
  );
  await (await importALaLisiere).setFiles(cheminArchiveALaLisiere!);
  await expect(
    sauvegardeTraverse.getByText("Sauvegarde importée et reprise."),
  ).toBeVisible();

  const atlasTraverse = pageTraverse.getByRole("region", {
    name: "Atlas d’exploitation",
  });
  await expect(atlasTraverse).toContainText(
    "Embranchement autonome soutenu par les Puits Libres",
  );
  await expect(atlasTraverse).toContainText(
    "Voie principale tenue par la République du Rail",
  );
  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Embranchement de Pompe-Neuve",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", { name: "Engagement vers Pompe-Neuve" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Pompe-Neuve",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(128_000);

  for (const [titre, choix] of [
    ["L’embranchement sans garde", "Suivre les balises des Puits Libres"],
    ["Les filtres du rail", "Inscrire la livraison au manifeste du Rail"],
    [
      "Le réservoir sous la voie",
      "Lever la vanne et relever le passage sec",
    ],
    ["La galerie qui cède", "Ouvrir le contournement des réservoirs"],
  ] as const) {
    const evenement = pageTraverse.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageTraverse,
      evenement.getByRole("button", { name: choix }),
    );
    await pageTraverse.clock.fastForward(1_000);
  }
  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Galerie des Réservoirs",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", { name: "Engagement vers Traverse-Libre" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Traverse-Libre",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(165_000);

  const manifeste = pageTraverse.getByRole("region", {
    name: "Maëlys et le manifeste",
  });
  await expect(manifeste.getByRole("img")).toBeVisible();
  await activerAuClavier(
    pageTraverse,
    manifeste.getByRole("button", {
      name: "Publier le manifeste de Traverse-Libre",
    }),
  );
  await pageTraverse.clock.fastForward(1_000);

  const traverseLibre = pageTraverse.getByRole("region", {
    name: "Traverse-Libre",
  });
  await expect(traverseLibre).toContainText("Colonie autonome");
  await expect(traverseLibre).toContainText("Contournement");
  await expect(traverseLibre).toContainText("Praticable");
  await expect(traverseLibre).toContainText("Aide reçue");
  await expect(traverseLibre).toContainText("Publique");
  await pageTraverse.screenshot({
    path: testInfo.outputPath("trame-traverse-libre-mobile.png"),
    fullPage: true,
  });
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "English" }),
  );
  await expect(
    pageTraverse.getByRole("region", { name: "Free Crossing" }),
  ).toContainText("Rail dependencies");
  await expect(
    pageTraverse.getByRole("region", { name: "Free Crossing" }),
  ).toContainText("Autonomous colony");

  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Français" }),
  );
  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Voie des Citernes",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", {
        name: "Engagement vers Marché des Traverses",
      })
      .getByRole("button", {
        name:
          "Confirmer l’Engagement sans retour vers Marché des Traverses",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(165_000);

  for (const [titre, choix] of [
    [
      "Les services de la voie principale",
      "Céder une réserve d’Eau de refroidissement",
    ],
    [
      "La bascule sans manifeste",
      "Débrancher la transmission de la Bascule",
    ],
  ] as const) {
    const evenement = pageTraverse.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageTraverse,
      evenement.getByRole("button", { name: choix }),
    );
    await pageTraverse.clock.fastForward(1_000);
  }

  const marche = pageTraverse.getByRole("region", {
    name: "Marché des Traverses",
  });
  await expect(marche).toContainText("Offre officielle épuisée");
  await expect(marche).toContainText("Offre clandestine épuisée");
  await expect(marche).toContainText(
    "Bascule des manifestes · fil rompu et plombs déplacés",
  );

  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Ligne de Signal-Zéro",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", { name: "Engagement vers Signal-Zéro" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Signal-Zéro",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(135_000);

  for (const [titre, choix] of [
    [
      "L’interface aux deux fréquences",
      "Lire la fréquence calibrée du Rail",
    ],
    [
      "Les deux branches dans le verre",
      "Graver les deux états sur une même plaque",
    ],
    [
      "Ilyana et la Trace",
      "Transmettre la Trace aux techniciens de Signal-Zéro",
    ],
  ] as const) {
    const evenement = pageTraverse.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageTraverse,
      evenement.getByRole("button", { name: choix }),
    );
    await pageTraverse.clock.fastForward(1_000);
  }

  const signalZero = pageTraverse.getByRole("region", {
    name: "Signal-Zéro",
  });
  await expect(signalZero).toContainText(
    "Fréquence du Rail lue · verrouillage lourd documenté",
  );
  await expect(signalZero).toContainText(
    "Preuve transmise · attribution possible dès l’Aiguillage Zéro",
  );
  await expect(signalZero).toContainText(
    "Charte de circulation partagée préparée",
  );
  await expect(signalZero).toContainText(
    "Vol avec contournement préparé",
  );
  await pageTraverse.screenshot({
    path: testInfo.outputPath("trame-signal-zero-mobile.png"),
    fullPage: true,
  });

  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "English" }),
  );
  const zeroSignal = pageTraverse.getByRole("region", {
    name: "Zero Signal",
  });
  await expect(zeroSignal).toContainText(
    "Rail frequency read · heavy locking documented",
  );
  await expect(zeroSignal).toContainText(
    "Evidence transmitted · attribution possible at Zero Junction",
  );

  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Français" }),
  );
  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Faisceau de l’Aiguillage Zéro",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", { name: "Engagement vers Aiguillage Zéro" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Aiguillage Zéro",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(150_000);

  for (const [titre, choix] of [
    ["La Pièce et le cœur mobile", "Relever les portées du cœur mobile"],
    [
      "Le Conseil des voies",
      "Assurer un transport autonome, même sans préparation",
    ],
    [
      "Le passage de la Couronne",
      "Sceller les états de sortie avec le Conseil",
    ],
  ] as const) {
    const evenement = pageTraverse.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageTraverse,
      evenement.getByRole("button", { name: choix }),
    );
    await pageTraverse.clock.fastForward(1_000);
  }

  const aiguillageZero = pageTraverse.getByRole("region", {
    name: "Aiguillage Zéro",
  });
  await expect(aiguillageZero).toContainText("Transport autonome");
  await expect(aiguillageZero).toContainText(
    "porte de la Couronne ouverte · retour verrouillé",
  );
  await expect(aiguillageZero).toContainText(
    "Retour de l’accord régional et du registre de sortie planifié",
  );
  await pageTraverse.screenshot({
    path: testInfo.outputPath("trame-aiguillage-zero-mobile.png"),
    fullPage: true,
  });

  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "English" }),
  );
  await expect(
    pageTraverse.getByRole("region", { name: "Zero Junction" }),
  ).toContainText(
    "Regional arrangement and exit-register return planned",
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Français" }),
  );
  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Passage de la Couronne muette",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", { name: "Engagement vers Couronne muette" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Couronne muette",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(180_000);
  await expect(atlasTraverse).toContainText("Couronne muette");
  await expect(atlasTraverse).toContainText("Voie de Tête-de-Ligne");
  await expect(atlasTraverse).toContainText("Chemin des Trois Veilles");
  await expect(atlasTraverse).toContainText(
    "Piste des Serres-de-Verre",
  );

  await activerAuClavier(
    pageTraverse,
    sauvegardeTraverse.getByRole("button", { name: "Sauvegarder" }),
  );
  await expect(
    sauvegardeTraverse.getByText("Sauvegarde à jour."),
  ).toBeVisible();
  const exportALaCouronne = pageTraverse.waitForEvent("download");
  await activerAuClavier(
    pageTraverse,
    sauvegardeTraverse.getByRole("button", { name: "Exporter" }),
  );
  const archiveALaCouronne = await exportALaCouronne;
  const cheminArchiveALaCouronne = await archiveALaCouronne.path();
  expect(cheminArchiveALaCouronne).not.toBeNull();

  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Voie de Tête-de-Ligne",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", { name: "Engagement vers Tête-de-Ligne" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Tête-de-Ligne",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(165_000);

  for (const [titre, choix] of [
    [
      "Le décret du dernier quai",
      "Ouvrir l’atelier à toutes les délégations",
    ],
    ["Les trois socles du nœud", "Cartographier les trois socles"],
    [
      "Les montages de la Couronne",
      "Assembler le Précipitateur embarqué",
    ],
    [
      "Ilyana et les plans sous cendre",
      "Répartir les plans entre les équipes",
    ],
  ] as const) {
    const evenement = pageTraverse.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageTraverse,
      evenement.getByRole("button", { name: choix }),
    );
    await pageTraverse.clock.fastForward(1_000);
  }

  const approchesDeLaCouronne = pageTraverse.getByRole("region", {
    name: "Approches de la Couronne",
  });
  await expect(approchesDeLaCouronne).toContainText(
    "atelier de voie commun ouvert",
  );
  await expect(approchesDeLaCouronne).toContainText(
    "Berceau, Étalon et Précipitateur sont cartographiés",
  );
  await expect(approchesDeLaCouronne).toContainText(
    "Plans répartis entre les équipes",
  );
  await pageTraverse.screenshot({
    path: testInfo.outputPath("couronne-tete-de-ligne-mobile.png"),
    fullPage: true,
  });

  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "English" }),
  );
  await expect(
    pageTraverse.getByRole("region", {
      name: "Silent Crown Approaches",
    }),
  ).toContainText("shared track workshop opened");
  await expect(
    pageTraverse.getByRole("region", {
      name: "Silent Crown Approaches",
    }),
  ).toContainText("Plans distributed among Caravan-city teams");
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Français" }),
  );
  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name: "Étudier l’Engagement vers Arc ferroviaire du Nœud",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", {
        name: "Engagement vers Anneau intérieur",
      })
      .getByRole("button", {
        name:
          "Confirmer l’Engagement sans retour vers Anneau intérieur",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(121_000);

  for (const [titre, choix] of [
    [
      "Le diagnostic des verrous",
      "Rendre le diagnostic commun aux délégations",
    ],
    [
      "Les trois montages devant la porte",
      "Maintenir les trois dossiers de préparation",
    ],
    [
      "Le dernier Conseil de la Couronne",
      "Ouvrir par l’arc ferroviaire",
    ],
    [
      "Ilyana, Maëlys et la clef",
      "Consigner la clef entre les équipes",
    ],
  ] as const) {
    const evenement = pageTraverse.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageTraverse,
      evenement.getByRole("button", { name: choix }),
    );
    await pageTraverse.clock.fastForward(1_000);
  }

  await activerAuClavier(
    pageTraverse,
    atlasTraverse.getByRole("button", {
      name:
        "Étudier l’Engagement vers Passage de la Couronne ouverte",
    }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse
      .getByRole("dialog", { name: "Engagement vers Nœud central" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Nœud central",
      }),
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageTraverse.clock.fastForward(91_000);
  await expect(
    sauvegardeTraverse.getByText(
      "Point de reprise avant Solution finale enregistré.",
    ),
  ).toBeVisible();

  const contratPrecipitation = pageTraverse.getByRole("region", {
    name: "Contrat final du Nœud",
  });
  await expect(contratPrecipitation).toContainText(
    "Faire tomber la cendre — Solution finale préparée",
  );
  const revelationFinalePropre = pageTraverse.getByRole("region", {
    name: "Le contrat des trois Solutions",
  });
  await activerAuClavier(
    pageTraverse,
    revelationFinalePropre.getByRole("button", {
      name: "Rendre les causes lisibles à toutes les équipes",
    }),
  );
  await pageTraverse.clock.fastForward(1_000);

  const choixFinalTraverse = pageTraverse.getByRole("region", {
    name: "Choisir la Solution finale",
  });
  const precipitationPreparee = choixFinalTraverse.getByRole("button", {
    name: "Engager la Précipitation préparée",
  });
  await expect(precipitationPreparee).toContainText(
    "6 Eau et 6 Matériaux",
  );
  await activerAuClavier(pageTraverse, precipitationPreparee);
  await pageTraverse.clock.fastForward(1_000);

  const consequencePrecipitation = pageTraverse.getByRole("region", {
    name: "La Dernière négociation des bassins",
  });
  await expect(
    consequencePrecipitation.getByRole("img"),
  ).toBeVisible();
  await expect(consequencePrecipitation).toContainText(
    "Le Précipitateur ne détruit pas la cendre",
  );
  await expect(consequencePrecipitation).toContainText(
    "Haut-Puits, Veille-Basse, les Puits Libres",
  );
  await expect(
    consequencePrecipitation.getByRole("button"),
  ).toHaveCount(2);
  await activerAuClavier(
    pageTraverse,
    consequencePrecipitation.getByRole("button", {
      name: "Administrer lentement un Ciel rendu",
    }),
  );
  await pageTraverse.clock.fastForward(1_000);
  await expect(contratPrecipitation).toContainText("Ciel rendu");
  await expect(contratPrecipitation).toContainText(
    "précipitation lente et confinée",
  );
  await expect(contratPrecipitation).toContainText(
    "bassins administrés par leur Conseil",
  );
  await expect(contratPrecipitation).toContainText(
    "cœur mobile préservé mais périodiquement arrêté",
  );
  await expect(contratPrecipitation).toContainText(
    "coût humain réparti inégalement",
  );
  await pageTraverse.screenshot({
    path: testInfo.outputPath(
      "finale-precipitation-ciel-rendu-mobile.png",
    ),
    fullPage: true,
  });

  const revelationDeLEpilogue = pageTraverse.getByRole("region", {
    name: "Le registre des rejets",
  });
  await expect(revelationDeLEpilogue.getByRole("img")).toBeVisible();
  await expect(revelationDeLEpilogue).toContainText(
    "maintenu après le franchissement des seuils létaux",
  );
  await activerAuClavier(
    pageTraverse,
    revelationDeLEpilogue.getByRole("button", {
      name: "Rendre le registre intégralement public",
    }),
  );
  await pageTraverse.clock.fastForward(1_000);

  const histoireDesCompagnons = pageTraverse.getByRole("region", {
    name: "Le dernier tour de veille",
  });
  await expect(histoireDesCompagnons.getByRole("img")).toBeVisible();
  await expect(histoireDesCompagnons).toContainText(
    "Les sièges des profils jamais rencontrés restent sans nom",
  );
  await activerAuClavier(
    pageTraverse,
    histoireDesCompagnons.getByRole("button", {
      name: "Lire les devenirs devant toute la Vigie",
    }),
  );
  await pageTraverse.clock.fastForward(1_000);

  const epilogueDeCampagne = pageTraverse.getByRole("article", {
    name: "Épilogue de la Campagne",
  });
  await expect(epilogueDeCampagne).toBeVisible();
  await expect(epilogueDeCampagne).toHaveAttribute("lang", "fr");
  await expect(
    epilogueDeCampagne.getByRole("heading", {
      name: "Épilogue de la Campagne",
    }),
  ).toBeFocused();
  await expect(
    epilogueDeCampagne.getByRole("heading", {
      name: "Bilan de la Solution",
    }),
  ).toBeVisible();
  await expect(
    epilogueDeCampagne.getByRole("heading", {
      name: "Dénouement de campagne",
    }),
  ).toBeVisible();
  await expect(epilogueDeCampagne).toContainText("Campagne conclue");
  await expect(epilogueDeCampagne).toContainText(
    "Faire tomber la cendre",
  );
  await expect(epilogueDeCampagne).toContainText("Ciel rendu");
  await expect(epilogueDeCampagne).toContainText(
    "Dernière négociation de la Précipitation",
  );
  await expect(epilogueDeCampagne).toContainText("Stabilité technique");
  await expect(epilogueDeCampagne).toContainText(
    "précipitation lente et confinée",
  );
  await expect(epilogueDeCampagne).toContainText("Contrôle politique");
  await expect(epilogueDeCampagne).toContainText(
    "bassins administrés par leur Conseil",
  );
  await expect(epilogueDeCampagne).toContainText("Coût humain");
  await expect(epilogueDeCampagne).toContainText(
    "coût humain réparti inégalement",
  );
  await expect(epilogueDeCampagne).toContainText("Révélation finale");
  await expect(epilogueDeCampagne).toContainText("Ilyana Voss");
  await expect(
    epilogueDeCampagne.getByText("Maëlys Rive", { exact: true }),
  ).toHaveCount(0);
  const retoursDesColonies = epilogueDeCampagne
    .getByRole("heading", {
      name: "Cinq Colonies",
      exact: true,
    })
    .locator("..");
  await expect(retoursDesColonies.getByText("Haut-Puits", { exact: true }))
    .toBeVisible();
  await expect(retoursDesColonies.getByText("Veille-Basse", { exact: true }))
    .toBeVisible();
  await expect(
    retoursDesColonies.getByText("Grand-Aiguillage", { exact: true }),
  ).toBeVisible();
  await expect(
    retoursDesColonies.getByText("Traverse-Libre", { exact: true }),
  ).toBeVisible();
  await expect(retoursDesColonies.getByText("Seuil", { exact: true }))
    .toBeVisible();
  await expect(
    epilogueDeCampagne.getByRole("heading", {
      name: "Sites significatifs",
    }),
  ).toBeVisible();
  await expect(
    epilogueDeCampagne.getByRole("heading", { name: "Cohortes" }),
  ).toBeVisible();
  await expect(
    epilogueDeCampagne.getByRole("heading", { name: "Factions" }),
  ).toBeVisible();
  await expect(
    epilogueDeCampagne.getByRole("heading", { name: "Engagements" }),
  ).toBeVisible();
  await expect(
    epilogueDeCampagne.getByRole("heading", {
      name: "Traces clandestines",
    }),
  ).toBeVisible();
  await expect(
    epilogueDeCampagne.getByText(
      "Transport autonome de l’Aiguillage Zéro",
      { exact: true },
    ),
  ).toHaveCount(1);

  const secondesDeLEpilogue = await lireSecondesDeLaSauvegarde(
    pageTraverse,
  );
  await pageTraverse.clock.fastForward(10_000);
  expect(await lireSecondesDeLaSauvegarde(pageTraverse)).toBe(
    secondesDeLEpilogue,
  );

  await pageTraverse.screenshot({
    path: testInfo.outputPath("epilogue-ciel-rendu-mobile.png"),
    fullPage: true,
  });

  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "English" }),
  );
  const campaignEpilogue = pageTraverse.getByRole("article", {
    name: "Campaign Epilogue",
  });
  await expect(campaignEpilogue).toHaveAttribute("lang", "en");
  await expect(
    campaignEpilogue.getByRole("heading", {
      name: "Campaign denouement",
    }),
  ).toBeVisible();
  await expect(campaignEpilogue).toContainText("Campaign concluded");
  await expect(campaignEpilogue).toContainText("Bring down the ash");
  await expect(campaignEpilogue).toContainText("Returned Sky");
  await expect(campaignEpilogue).toContainText(
    "Zero Junction autonomous transport",
  );
  await activerAuClavier(
    pageTraverse,
    pageTraverse.getByRole("button", { name: "Français" }),
  );

  const sauvegardeDeLEpilogue = pageTraverse.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  await activerAuClavier(
    pageTraverse,
    sauvegardeDeLEpilogue.getByRole("button", {
      name: "Sauvegarder",
    }),
  );
  await expect(sauvegardeDeLEpilogue.getByText("Sauvegarde à jour."))
    .toBeVisible();
  await pageTraverse.reload();
  await expect(
    pageTraverse.getByRole("article", {
      name: "Épilogue de la Campagne",
    }),
  ).toBeVisible();

  const navigateurColonies = await page.context().browser()!.newContext({
    viewport: { width: 640, height: 360 },
    deviceScaleFactor: 2,
  });
  const pageColonies = await navigateurColonies.newPage();
  await installerHorlogeFixe(pageColonies);
  await pageColonies.goto("/");
  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "Restaurer mon achat" }),
  );
  await pageColonies.getByLabel("Adresse email").fill(email);
  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "Restaurer mon achat" }),
  );
  await ouvrirLienDeTestSiPropose(pageColonies);
  const sauvegardeColonies = pageColonies.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  const importALaCouronne = pageColonies.waitForEvent("filechooser");
  await activerAuClavier(
    pageColonies,
    sauvegardeColonies.getByRole("button", {
      name: "Importer",
      exact: true,
    }),
  );
  await (await importALaCouronne).setFiles(
    cheminArchiveALaCouronne!,
  );
  await expect(
    sauvegardeColonies.getByText("Sauvegarde importée et reprise."),
  ).toBeVisible();

  const atlasColonies = pageColonies.getByRole("region", {
    name: "Atlas d’exploitation",
  });
  await activerAuClavier(
    pageColonies,
    atlasColonies.getByRole("button", {
      name: "Étudier l’Engagement vers Piste des Serres-de-Verre",
    }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies
      .getByRole("dialog", { name: "Engagement vers Serres-de-Verre" })
      .getByRole("button", {
        name:
          "Confirmer l’Engagement sans retour vers Serres-de-Verre",
      }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageColonies.clock.fastForward(180_000);

  const ralliement = pageColonies.getByRole("region", {
    name: "Le ralliement des cinq Colonies",
  });
  await expect(ralliement.getByRole("img")).toBeVisible();
  await activerAuClavier(
    pageColonies,
    ralliement.getByRole("button", {
      name: "Forcer le passage sans coalition",
    }),
  );
  await pageColonies.clock.fastForward(1_000);
  await activerAuClavier(
    pageColonies,
    atlasColonies.getByRole("button", {
      name: "Étudier l’Engagement vers Rampe du Seuil",
    }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies
      .getByRole("dialog", { name: "Engagement vers Le Seuil" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Le Seuil",
      }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageColonies.clock.fastForward(135_000);

  for (const [titre, choix] of [
    [
      "Le marché des abris",
      "Rationner le marché et partager les abris",
    ],
    [
      "Les relevés sous la porte",
      "Recopier les relevés aux délégations",
    ],
    ["Le prix de la rampe", "Maintenir la brèche coûteuse"],
    [
      "Maëlys et le registre des ralliés",
      "Tenir un registre commun",
    ],
  ] as const) {
    const evenement = pageColonies.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageColonies,
      evenement.getByRole("button", { name: choix }),
    );
    await pageColonies.clock.fastForward(1_000);
  }

  const voieDesColonies = pageColonies.getByRole("region", {
    name: "Voie des Colonies",
  });
  await expect(voieDesColonies).toContainText(
    "Retour des cinq Colonies",
  );
  await expect(voieDesColonies).toContainText(
    "Haut-Puits : délégation présente",
  );
  await expect(voieDesColonies).toContainText(
    "Seuil : habitants représentés sur place",
  );
  await expect(voieDesColonies).toContainText(
    "brèche coûteuse tenue par les Habitants",
  );
  await expect(voieDesColonies).toContainText(
    "voix du Seuil garantie",
  );
  await pageColonies.screenshot({
    path: testInfo.outputPath("couronne-voie-colonies-mobile.png"),
    fullPage: true,
  });
  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "English" }),
  );
  await expect(
    pageColonies.getByRole("region", { name: "Colony Route" }),
  ).toContainText("Return of the five Colonies");
  await expect(
    pageColonies.getByRole("region", { name: "Colony Route" }),
  ).toContainText("costly breach held by Inhabitants");

  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "Français" }),
  );
  await activerAuClavier(
    pageColonies,
    atlasColonies.getByRole("button", {
      name: "Étudier l’Engagement vers Porte logistique du Seuil",
    }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies
      .getByRole("dialog", {
        name: "Engagement vers Anneau intérieur",
      })
      .getByRole("button", {
        name:
          "Confirmer l’Engagement sans retour vers Anneau intérieur",
      }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageColonies.clock.fastForward(105_000);

  for (const [titre, choix] of [
    [
      "Le diagnostic des verrous",
      "Rendre le diagnostic commun aux délégations",
    ],
    [
      "Les trois montages devant la porte",
      "Maintenir les trois dossiers de préparation",
    ],
    [
      "Le dernier Conseil de la Couronne",
      "Ouvrir la brèche de secours",
    ],
    [
      "Ilyana, Maëlys et la clef",
      "Consigner la clef entre les équipes",
    ],
  ] as const) {
    const evenement = pageColonies.getByRole("region", { name: titre });
    await expect(evenement.getByRole("img")).toBeVisible();
    await activerAuClavier(
      pageColonies,
      evenement.getByRole("button", { name: choix }),
    );
    await pageColonies.clock.fastForward(1_000);
  }

  const ouvertureDeLaCouronne = pageColonies.getByRole("region", {
    name: "Ouverture de la Couronne",
  });
  await expect(ouvertureDeLaCouronne).toContainText(
    "Brèche de secours — recours toujours disponible",
  );
  await expect(ouvertureDeLaCouronne).toContainText(
    "Nœud atteint mais bus de réaccord et collecteurs de précipitation détruits",
  );
  await expect(ouvertureDeLaCouronne).toContainText(
    "Réaccorder le réseau — issue rendue impossible",
  );
  await expect(ouvertureDeLaCouronne).toContainText(
    "Faire tomber la cendre — issue rendue impossible",
  );
  await expect(ouvertureDeLaCouronne).toContainText(
    "clef consignée entre les équipes",
  );
  await activerAuClavier(
    pageColonies,
    atlasColonies.getByRole("button", {
      name: "Étudier l’Engagement vers Brèche de secours du Nœud",
    }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies
      .getByRole("dialog", { name: "Engagement vers Nœud central" })
      .getByRole("button", {
        name: "Confirmer l’Engagement sans retour vers Nœud central",
      }),
  );
  await activerAuClavier(
    pageColonies,
    pageColonies.getByRole("button", { name: "Vitesse 4×" }),
  );
  await pageColonies.clock.fastForward(105_000);
  await expect(
    pageColonies.getByText("Nœud central", { exact: true }).first(),
  ).toBeVisible();
  await pageColonies.screenshot({
    path: testInfo.outputPath("couronne-noeud-central-mobile.png"),
    fullPage: true,
  });

  const contratFinal = pageColonies.getByRole("region", {
    name: "Contrat final du Nœud",
  });
  await expect(contratFinal).toContainText(
    "Ancrer le cœur — Solution finale risquée",
  );
  await expect(contratFinal).toContainText(
    "Réaccorder le réseau — Solution finale impossible",
  );
  await expect(contratFinal).toContainText(
    "Faire tomber la cendre",
  );
  await expect(contratFinal).toContainText(
    "Faire tomber la cendre — Solution finale impossible",
  );
  await activerAuClavier(
    pageColonies,
    contratFinal.getByText("Causes consultables").first(),
  );
  await expect(contratFinal).toContainText(
    "bus et collecteurs du Nœud détruits par la brèche",
  );
  await expect(
    sauvegardeColonies.getByText(
      "Point de reprise avant Solution finale enregistré.",
    ),
  ).toBeVisible();

  const revelationFinale = pageColonies.getByRole("region", {
    name: "Le contrat des trois Solutions",
  });
  await expect(revelationFinale.getByRole("img")).toBeVisible();
  await activerAuClavier(
    pageColonies,
    revelationFinale.getByRole("button", {
      name: "Rendre les causes lisibles à toutes les équipes",
    }),
  );
  await pageColonies.clock.fastForward(1_000);

  const choixDAncrage = pageColonies.getByRole("region", {
    name: "Choisir la Solution finale",
  });
  await expect(choixDAncrage.getByRole("img")).toBeVisible();
  const ancrageRisque = choixDAncrage.getByRole("button", {
    name: "Forcer l’Ancrage risqué",
  });
  await expect(ancrageRisque).toContainText(
    "10 Matériaux et 8 Habitants exposés",
  );
  await expect(choixDAncrage.getByRole("button")).toHaveCount(1);
  await activerAuClavier(pageColonies, ancrageRisque);
  await pageColonies.clock.fastForward(1_000);

  const derniereNegociation = pageColonies.getByRole("region", {
    name: "La Dernière négociation",
  });
  await expect(derniereNegociation.getByRole("img")).toBeVisible();
  await expect(derniereNegociation.getByRole("button")).toHaveCount(1);
  await activerAuClavier(
    pageColonies,
    derniereNegociation.getByRole("button", {
      name: "Tenir le cœur comme Dernier Rempart",
    }),
  );
  await pageColonies.clock.fastForward(1_000);

  await expect(contratFinal).toContainText("Dernier Rempart");
  await expect(contratFinal).toContainText(
    "stabilité technique sous contrainte",
  );
  await expect(contratFinal).toContainText(
    "contrôle gardé par les équipes",
  );
  await expect(contratFinal).toContainText(
    "coût humain durablement élevé",
  );
  await pageColonies.screenshot({
    path: testInfo.outputPath("finale-ancrage-dernier-rempart-mobile.png"),
    fullPage: true,
  });
  await navigateurColonies.close();
  await navigateurTraverse.close();

  await page.screenshot({
    path: testInfo.outputPath("demonstration-final.png"),
    fullPage: true,
  });
});
