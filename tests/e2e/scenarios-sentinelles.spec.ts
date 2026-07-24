import { expect, test } from "@playwright/test";

import { CONTENU_PREMIUM_V1 } from "../../serveur-commercial/cataloguePremiumComplet";
import { installerContenuPremiumComplet } from "../../src/commercial/contenuPremium";

installerContenuPremiumComplet(CONTENU_PREMIUM_V1);

test("les scénarios sentinelles conservent états, événements et empreintes", async ({
  page,
}) => {
  const {
    capturerEtatsEtEvenementsDesScenariosSentinelles,
    executerScenariosSentinelles,
    obtenirScenariosSentinelles,
  } = await import("../../src/diagnostic/scenariosSentinelles");
  const resultatsNode = executerScenariosSentinelles();
  const observationsNode = capturerEtatsEtEvenementsDesScenariosSentinelles();

  await page.goto("/");
  const executionNavigateur = await page.evaluate(async () => {
    const urlContenu = "/src/commercial/contenuPremium.ts";
    const urlCatalogue = "/serveur-commercial/cataloguePremiumComplet.ts";
    const urlScenarios = "/src/diagnostic/scenariosSentinelles.ts";
    const contenu = await import(/* @vite-ignore */ urlContenu);
    const catalogue = await import(/* @vite-ignore */ urlCatalogue);
    contenu.installerContenuPremiumComplet(catalogue.CONTENU_PREMIUM_V1);
    const scenarios = await import(/* @vite-ignore */ urlScenarios);
    return {
      resultats: scenarios.executerScenariosSentinelles(),
      observations:
        scenarios.capturerEtatsEtEvenementsDesScenariosSentinelles(),
    };
  });

  const resultatsNavigateur = executionNavigateur.resultats;
  expect(resultatsNavigateur).toEqual(resultatsNode);
  expect(executionNavigateur.observations).toEqual(observationsNode);
  expect(resultatsNavigateur).toHaveLength(
    obtenirScenariosSentinelles().length * 2,
  );
  expect(resultatsNavigateur.every(({ statut }) => statut === "conforme")).toBe(
    true,
  );
});
