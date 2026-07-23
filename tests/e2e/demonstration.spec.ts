import { expect, test, type Locator, type Page } from "@playwright/test";

test.use({
  viewport: { width: 640, height: 360 },
  deviceScaleFactor: 2,
});

async function activerAuClavier(
  page: Page,
  cible: Locator,
): Promise<void> {
  await expect(cible).toBeVisible();
  for (let tabulation = 0; tabulation < 200; tabulation += 1) {
    if (
      await cible.evaluate(
        (element) => element === element.ownerDocument.activeElement,
      )
    ) {
      break;
    }
    await page.keyboard.press("Tab");
  }
  await expect(cible).toBeFocused();
  await page.keyboard.press("Enter");
}

test("la Démonstration complète atteint sa porte premium sans sollicitation anticipée", async ({
  page,
}, testInfo) => {
  test.setTimeout(120_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  await page.goto("/");
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

  const incident = page.getByRole("region", {
    name: "Pompe de purification instable",
  });
  await activerAuClavier(
    page,
    incident.getByRole("button", { name: "Sécuriser la pompe" }),
  );

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
      name: "Étudier l’Engagement vers Relais des Vannes",
    }),
  ).toHaveCount(0);

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
  await expect(jalon.getByRole("heading")).toBeFocused();
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

  await page.screenshot({
    path: testInfo.outputPath("demonstration-final.png"),
    fullPage: true,
  });
});
