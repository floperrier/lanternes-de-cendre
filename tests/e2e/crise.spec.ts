import { expect, test, type Page } from "@playwright/test";

import { installerHorlogeFixe } from "./horloge";

async function creerArchiveALaSecondeAlerte(page: Page): Promise<string> {
  return page.evaluate(async () => {
    const urlApplication = "/src/application/application.ts";
    const urlSauvegarde = "/src/sauvegarde/sauvegarde.ts";
    const applicationModule = (await import(
      /* @vite-ignore */ urlApplication
    )) as typeof import("../../src/application/application");
    const sauvegardeModule = (await import(
      /* @vite-ignore */ urlSauvegarde
    )) as typeof import("../../src/sauvegarde/sauvegarde");
    const application = applicationModule.creerApplicationCampagne(
      "CENDRE-01",
      {
        politiqueDAcces:
          applicationModule.ACCES_AU_CONTENU_COMPLET,
      },
    );
    const envoyer = application.envoyerCommande;
    envoyer({
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "maintenir-debit",
    });
    envoyer({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });
    for (const [evenementId, choixId] of [
      ["prologue.signaux-sous-la-cendre", "accueillir"],
      ["prologue.reponse-du-phare", "consigner-harmonique"],
      ["prologue.filtres-de-la-veille", "proteger-foyers"],
      ["prologue.ilyana-au-clapet", "confier-clapet"],
    ] as const) {
      envoyer({
        type: "evenement-narratif.choisir",
        evenementId,
        choixId,
      });
      if (evenementId !== "prologue.ilyana-au-clapet") {
        envoyer({
          type: "temps-du-convoi.ecouler",
          secondesReelles: 1,
        });
      }
    }
    envoyer({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 117,
    });
    envoyer({
      type: "crise.declencher",
      criseId: "penurie-eau.pompe-purification",
    });
    envoyer({
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "isoler-et-rationner",
    });
    envoyer({
      type: "engagement-de-route.confirmer",
      tronconId: "chaussee-de-veille-basse",
    });
    envoyer({ type: "temps-du-convoi.regler-vitesse", vitesse: 4 });
    envoyer({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 120,
    });
    envoyer({
      type: "evenement-narratif.choisir",
      evenementId: "veille-basse.la-place-sous-le-phare",
      choixId: "accueillir",
    });
    const etat = application.lireEtat();
    return sauvegardeModule.exporterSauvegarde(
      sauvegardeModule.creerSauvegarde(
        etat,
        sauvegardeModule.creerReproductionInitiale(etat),
      ),
    );
  });
}

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

test("la Crise de Veille-Basse s’annonce, arbitre deux réponses et persiste", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installerHorlogeFixe(page);
  await page.goto("/");

  const urlDeTest = await page.evaluate(async () => {
    const reponse = await fetch("/api/commercial/lien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `crise-veille-basse-${crypto.randomUUID()}@example.test`,
        intention: "acheter",
      }),
    });
    const resultat = (await reponse.json()) as {
      readonly urlDeTest?: string;
    };
    if (!reponse.ok || resultat.urlDeTest === undefined) {
      throw new Error("Le lien premium de test n’a pas été délivré.");
    }
    return resultat.urlDeTest;
  });
  await page.goto(urlDeTest);
  await expect(
    page.getByText(/Environnement Paddle de test/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Valider le paiement test" }).click();
  await expect(
    page.getByText(
      "Accès premium permanent actif. La même Campagne peut continuer.",
    ),
  ).toBeVisible();

  await page
    .getByLabel("Choisir une sauvegarde à importer")
    .setInputFiles({
      name: "crise-veille-basse.json",
      mimeType: "application/json",
      buffer: Buffer.from(await creerArchiveALaSecondeAlerte(page)),
    });

  const etatDesCrises = page.getByRole("region", {
    name: "Crises et Cicatrices",
  });
  await expect(etatDesCrises).toContainText(
    "Aggravation annoncée — accueil sous pénurie",
  );
  await expect(etatDesCrises).toContainText(
    "La Cohorte a été accueillie alors que l’Eau restait sous tension.",
  );
  await expect(etatDesCrises).toContainText(
    "Les réserves et les capacités d’accueil ont atteint leur limite.",
  );
  await expect(etatDesCrises).toContainText("dans 2 min");

  await page.getByRole("button", { name: "English" }).click();
  await page.getByRole("button", { name: "Vitesse 4×" }).click();
  await page.clock.fastForward(30_000);

  const crise = page.getByRole("alertdialog", {
    name: "Crisis — Cohort welcomed under shortage",
  });
  await expect(crise).toBeVisible();
  await expect(crise).toContainText(
    "The Cohort was welcomed while Water remained strained.",
  );
  await expect(crise).toContainText("6 Provisions");
  await expect(crise).toContainText("5 Materials");
  await expect(
    crise.getByRole("button", { name: "Confirm this response" }),
  ).toHaveCount(2);

  await crise
    .getByRole("article")
    .filter({ hasText: "Reinforce filtered shelter capacity" })
    .getByRole("button", { name: "Confirm this response" })
    .click();
  await expect(
    page.getByRole("region", { name: "Crises and Scars" }),
  ).toContainText("Shelter capacity saturated");

  await page.getByRole("button", { name: "Vitesse 4×" }).click();
  await page.clock.fastForward(120_000);
  await page
    .getByRole("region", { name: "The filter gate" })
    .getByRole("button", {
      name: "Assign the technicians to reinforce the airlock",
    })
    .click();
  await expect(
    page.getByRole("region", { name: "Crises and Scars" }),
  ).toContainText("Recovery accomplished");

  await page.getByRole("button", { name: "Sauvegarder" }).click();
  await expect(page.getByText("Sauvegarde à jour.")).toBeVisible();
  await page.reload();

  const etatRepris = page.getByRole("region", {
    name: "Crises et Cicatrices",
  });
  await expect(etatRepris).toContainText("Capacités d’accueil saturées");
  await expect(etatRepris).toContainText("Accueil stabilisé");
  await expect(etatRepris).toContainText("Récupération accomplie");
});
