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

async function creerArchiveALaSaturationDuHalo(
  page: Page,
): Promise<string> {
  return page.evaluate(async () => {
    const urlScenarios = "/src/diagnostic/scenariosSentinelles.ts";
    const urlSauvegarde = "/src/sauvegarde/sauvegarde.ts";
    const scenariosModule = (await import(
      /* @vite-ignore */ urlScenarios
    )) as typeof import("../../src/diagnostic/scenariosSentinelles");
    const sauvegardeModule = (await import(
      /* @vite-ignore */ urlSauvegarde
    )) as typeof import("../../src/sauvegarde/sauvegarde");
    const scenario = scenariosModule
      .obtenirScenariosSentinelles()
      .find(({ id }) => id === "saturation-halo");
    if (scenario === undefined) {
      throw new Error("La sentinelle du Halo est absente.");
    }
    return sauvegardeModule.exporterSauvegarde(
      sauvegardeModule.creerSauvegarde(
        scenario.snapshot,
        sauvegardeModule.creerReproductionInitiale(scenario.snapshot),
      ),
    );
  });
}

async function activerPremiumDeTest(
  page: Page,
  prefixe: string,
): Promise<void> {
  const urlDeTest = await page.evaluate(async (prefixeDEmail) => {
    const reponse = await fetch("/api/commercial/lien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `${prefixeDEmail}-${crypto.randomUUID()}@example.test`,
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
  }, prefixe);
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

  await activerPremiumDeTest(page, "crise-veille-basse");

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

test("la saturation du Halo expose ses causes, son dernier recours et persiste sa Cicatrice", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await installerHorlogeFixe(page);
  await page.goto("/");
  await activerPremiumDeTest(page, "crise-halo");

  await page
    .getByLabel("Choisir une sauvegarde à importer")
    .setInputFiles({
      name: "crise-halo.json",
      mimeType: "application/json",
      buffer: Buffer.from(await creerArchiveALaSaturationDuHalo(page)),
    });

  const crise = page.getByRole("alertdialog", {
    name: "Crise — Saturation du Halo de la Couronne",
  });
  await expect(crise).toBeVisible();
  await expect(crise).toContainText(
    "Le Phare actif ne peut plus absorber seul les contraintes accumulées par les voies, les Cicatrices et leurs Récupérations.",
  );
  await expect(crise).toContainText(
    "Le Halo du Phare sature et le Temps du convoi est suspendu.",
  );
  await expect(crise).toContainText("6 Matériaux");
  await expect(crise).toContainText("5 Habitants affectés");
  await expect(crise).toContainText("11 Habitants affectés");
  await expect(crise).toContainText("Dernier recours");
  await expect(
    crise.getByRole("button", { name: "Confirmer cette réponse" }),
  ).toHaveCount(3);
  await expect(page.locator(".scene-layout")).toHaveAttribute("inert", "");

  await crise
    .getByRole("article")
    .filter({ hasText: "Stabiliser l’anneau du Halo par des étais" })
    .getByRole("button", { name: "Confirmer cette réponse" })
    .click();

  const etatDesCrises = page.getByRole("region", {
    name: "Crises et Cicatrices",
  });
  await expect(etatDesCrises).toContainText("Halo bridé par les étais");
  await expect(etatDesCrises).toContainText(
    "Charge du Halo répartie au Nœud",
  );
  await expect(etatDesCrises).toContainText(
    "Atteindre le Nœud central sous un Tronçon.",
  );
  await page.getByText(/^Journal causal \(\d+\)$/).click();
  await expect(
    page.getByText("Crise du Halo — anneau stabilisé par des étais"),
  ).toBeVisible();

  await page.getByRole("button", { name: "English" }).click();
  const etatRepris = page.getByRole("region", {
    name: "Crises and Scars",
  });
  await expect(etatRepris).toContainText("Halo constrained by braces");
  await expect(etatRepris).toContainText(
    "Halo load redistributed at the Node",
  );
  await expect(
    page.getByText("Halo crisis — ring stabilized with braces"),
  ).toBeVisible();

  const sauvegardeDuHalo = page.getByRole("region", {
    name: "Sauvegarde de Campagne",
  });
  await sauvegardeDuHalo
    .getByRole("button", { name: "Sauvegarder" })
    .click();
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const urlPersistance = "/src/sauvegarde/persistance.ts";
        const persistanceModule = (await import(
          /* @vite-ignore */ urlPersistance
        )) as typeof import("../../src/sauvegarde/persistance");
        const port =
          persistanceModule.creerPortDePersistanceIndexedDb();
        try {
          const archives = await port.lister();
          return archives.some(({ contenu }) =>
            contenu.includes("cicatrice.halo-bride-par-les-etais"),
          );
        } finally {
          port.fermer();
        }
      }),
    )
    .toBe(true);
  await expect(sauvegardeDuHalo.getByRole("status")).toHaveText(
    "Sauvegarde à jour.",
  );
});
