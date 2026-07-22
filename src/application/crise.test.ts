import { describe, expect, it } from "vitest";

import { appliquerCommande, creerCampagneInitiale } from "../simulation/campagne";
import { projeterCrises } from "./crise";
import { projeterPilotage } from "./pilotage";

function etatEnCrise() {
  let etat = creerCampagneInitiale("CENDRE-01");
  etat = appliquerCommande(etat, {
    type: "incident.ordonner",
    incidentId: "purification.pompe-instable",
    ordre: "maintenir-debit",
  }).etat;
  const checkpoint = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 180,
  }).etat;
  return appliquerCommande(checkpoint, {
    type: "crise.declencher",
    criseId: "penurie-eau.pompe-purification",
  }).etat;
}

describe("projection des Crises", () => {
  it("rend la chaîne, deux réponses coûteuses et le dernier recours sans pourcentage", () => {
    const projection = projeterCrises(etatEnCrise(), "fr");

    expect(projection.active).toMatchObject({
      titre: "Crise — Eau purifiée contaminée",
      cause:
        "Le débit maintenu malgré le joint dégradé a contaminé la réserve.",
      chaineVisible: [
        expect.stringContaining("Pompe maintenue en service"),
        expect.stringContaining("Contamination annoncée"),
        expect.stringContaining("16 L restent utilisables"),
      ],
      reponses: [
        expect.objectContaining({
          id: "isoler-et-rationner",
          coutConnu: "4 Matériaux",
          dernierRecours: false,
          viable: true,
        }),
        expect.objectContaining({
          id: "mobiliser-les-remedes",
          coutConnu: "5 Remèdes",
          dernierRecours: false,
          viable: true,
        }),
        expect.objectContaining({
          id: "evacuer-les-foyers-exposes",
          coutConnu: "8 Habitants évacués",
          dernierRecours: true,
          viable: true,
          attribution: "Foyers exposés du convoi",
        }),
      ],
    });
    expect(JSON.stringify(projection)).not.toMatch(/%/);
  });

  it("conserve la Cicatrice et la voie de récupération après la décision", () => {
    const etat = appliquerCommande(etatEnCrise(), {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "isoler-et-rationner",
    }).etat;

    const projection = projeterCrises(etat, "en");

    expect(projection.active).toBeNull();
    expect(projection.cicatrices).toEqual([
      expect.objectContaining({
        titre: "Water rationing",
        cause: "Isolation and rationing",
        consequence:
          "Water remains rationed until purification is restored.",
      }),
    ]);
    expect(projection.recuperations).toEqual([
      expect.objectContaining({
        garantie: "Survival baseline preserved",
        horizon: "within 2 route segments",
        statut: "Recovery underway",
        condition: "Build or obtain purification capacity.",
      }),
    ]);
  });

  it("rend les Faits de Crise lisibles dans le Journal causal bilingue", () => {
    const etat = appliquerCommande(etatEnCrise(), {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "mobiliser-les-remedes",
    }).etat;

    expect(
      projeterPilotage(etat, "fr").journalCausal.slice(-2),
    ).toMatchObject([
      {
        titre: "Réserve d’Eau — contamination isolée",
        acteurs: ["Équipes de purification", "Foyers du convoi"],
        cible: "Réserve d’Eau purifiée",
      },
      {
        titre: "Crise de purification — Remèdes mobilisés",
        cause: "Crise de pénurie d’Eau",
      },
    ]);
    expect(
      projeterPilotage(etat, "en").journalCausal.slice(-2),
    ).toMatchObject([
      { titre: "Water reserve — contamination isolated" },
      { titre: "Purification crisis — Remedies mobilized" },
    ]);
  });
});
