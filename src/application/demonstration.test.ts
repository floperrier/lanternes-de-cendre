import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "../simulation/campagne";
import {
  EVENEMENTS_DE_LA_DEMONSTRATION,
  projeterDemonstration,
} from "./demonstration";

function appliquer(
  etat: EtatCampagne,
  commande: Parameters<typeof appliquerCommande>[1],
): EtatCampagne {
  return appliquerCommande(etat, commande).etat;
}

function creerEtatAuJalonFinal(): EtatCampagne {
  let etat = creerCampagneInitiale("CENDRE-01");
  etat = appliquer(etat, {
    type: "incident.ordonner",
    incidentId: "purification.pompe-instable",
    ordre: "securiser-pompe",
  });
  etat = appliquer(etat, {
    type: "compagnon.affecter",
    compagnonId: "ilyana-voss",
    quartierId: "intendance",
  });
  etat = appliquer(etat, {
    type: "conseil.decider",
    conseilId: "conseil.premiere-veille",
    sujetId: "purification-et-partage-de-l-eau",
    decisionId: "securiser-circuit",
  });
  etat = appliquer(etat, {
    type: "expedition.lancer",
    expeditionId: "vannes-grises",
  });
  etat = appliquer(etat, {
    type: "engagement-de-route.confirmer",
    tronconId: "digue-des-puits",
  });
  etat = appliquer(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  });
  etat = appliquer(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 2_355,
  });
  etat = appliquer(etat, {
    type: "expedition.ordonner",
    expeditionId: "vannes-grises",
    intention: "couper-contourner",
  });
  etat = appliquer(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 2_250,
  });
  return {
    ...etat,
    narration: {
      ...etat.narration,
      evenementActif: null,
      evenementsJoues: EVENEMENTS_DE_LA_DEMONSTRATION,
    },
  };
}

describe("Démonstration", () => {
  it("reste anonyme et ne présente pas l’Accès premium avant le jalon final", () => {
    const projection = projeterDemonstration(
      creerCampagneInitiale("CENDRE-01"),
      "fr",
    );

    expect(projection).toEqual({
      graineRepresentative: "CENDRE-01",
      terminee: false,
      jalonFinal: null,
    });
  });

  it("explique au jalon final que le deuxième Tronçon exige l’Accès premium", () => {
    const etat = creerEtatAuJalonFinal();

    expect(projeterDemonstration(etat, "fr")).toEqual({
      graineRepresentative: "CENDRE-01",
      terminee: true,
      jalonFinal: {
        titre: "La route continue",
        explication:
          "La Démonstration s’achève avant le deuxième Tronçon. La même Campagne pourra continuer avec l’Accès premium, sans recommencer.",
      },
    });
    expect(projeterDemonstration(etat, "en").jalonFinal).toEqual({
      titre: "The road continues",
      explication:
        "The Demonstration ends before the second Route Segment. The same Campaign can continue with Premium Access, without starting over.",
    });
  });
});
