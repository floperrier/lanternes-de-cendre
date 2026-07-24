import { CONTENU_PREMIUM_V1 } from "../serveur-commercial/cataloguePremiumComplet";
import { installerContenuPremiumComplet } from "../src/commercial/contenuPremium";

installerContenuPremiumComplet(CONTENU_PREMIUM_V1);

const { executerScenariosSentinelles, obtenirScenariosSentinelles } =
  await import("../src/diagnostic/scenariosSentinelles");
const resultats = executerScenariosSentinelles();
const divergences = resultats.filter(
  (resultat) => resultat.statut === "divergence",
);

if (divergences.length > 0) {
  console.error(
    JSON.stringify(
      {
        statut: "divergence",
        capsules: divergences.map(({ capsule }) => capsule),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} else {
  console.log(
    `${obtenirScenariosSentinelles().length} scénarios, ${resultats.length} conduites et 5 invariants vérifiés.`,
  );
}
