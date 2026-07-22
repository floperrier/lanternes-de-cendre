import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "../simulation/campagne";
import { projeterExpedition } from "./expeditions";
import { projeterPilotage } from "./pilotage";

describe("projection de l’Expédition dans l’Atlas", () => {
  it("sépare les coûts exacts, les intervalles sourcés et le pire risque crédible", () => {
    const projection = projeterExpedition(
      creerCampagneInitiale("CENDRE-01"),
      "fr",
    );

    expect(projection).toMatchObject({
      id: "vannes-grises",
      statut: "prete",
      titre: "Station des Vannes Grises",
      mandat: {
        objectif: "Rétablir un débit exploitable",
        issueDeRepli: "Cartographier l’accès et rentrer",
        responsable: "Liora",
        groupe: "4 Habitants",
        equipement: "Filtres doubles",
        enveloppeAutonomie:
          "Écart réversible ≤ 45 min et au plus 1 Remède",
        seuilDeRepli: "Repli à la première blessure",
      },
      prevision: {
        coutsConnus: [
          "Vivres : −331,2 rations",
          "Eau : −182,4 L",
          "Matériaux : −2 pièces",
          "Coût d’opportunité : Liora quitte Atelier–Opérations",
        ],
        duree: {
          intervalle: "4 h 10–5 h 20",
          source: "Itinéraire des Vanniers",
          age: "relevé il y a 2 j",
        },
        gain: {
          intervalle: "Eau : +1,8–2,7 j d’Autonomie",
          source: "Débit mesuré par les Vanniers",
          age: "relevé il y a 9 j",
        },
        risque: {
          nom: "Exposition à la cendre — marquée",
          mitigation: "Filtres doubles",
          pireConsequence: "Blessure d’un membre de l’équipe",
        },
      },
      actionPrincipale: "Confirmer le mandat et lancer",
    });
    expect(JSON.stringify(projection.prevision.risque)).not.toContain("%");
  });

  it("projette le même mandat en anglais sans révéler d’état caché", () => {
    const projection = projeterExpedition(
      creerCampagneInitiale("CENDRE-01"),
      "en",
    );

    expect(projection).toMatchObject({
      titre: "Grey Sluices Station",
      mandat: {
        objectif: "Restore a usable flow",
        responsable: "Liora",
        groupe: "4 inhabitants",
        seuilDeRepli: "Withdraw at the first injury",
      },
      prevision: {
        duree: { source: "Sluice Keepers’ itinerary" },
        risque: {
          mitigation: "Double filters",
          pireConsequence: "Injury to one team member",
        },
      },
      actionPrincipale: "Confirm mandate and launch",
    });
  });

  it("explique un départ indisponible sans exposer une action qui échouera", () => {
    const etatEpuise = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      { type: "temps-du-convoi.ecouler", secondesReelles: 57_600 },
    ).etat;

    expect(projeterExpedition(etatEpuise, "fr")).toMatchObject({
      actionPrincipale: "Confirmer le mandat et lancer",
      actionPrincipaleDisponible: false,
      refusLancement:
        "Départ impossible : les coûts connus exacts dépassent les stocks disponibles.",
    });
  });

  it("présente la rupture de mandat comme trois intentions, jamais comme des déplacements individuels", () => {
    let etat = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "expedition.lancer",
      expeditionId: "vannes-grises",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 9_420,
    }).etat;

    const projection = projeterExpedition(etat, "fr");

    expect(projection.suivi).toMatchObject({
      progression: "68 %",
      duree: "2 h 37",
      contact: "Équipe en attente",
      rapports: [
        expect.objectContaining({ titre: "Mandat confirmé" }),
        expect.objectContaining({ titre: "Canal sec atteint" }),
        expect.objectContaining({ titre: "Passerelle rompue : détour autonome" }),
        expect.objectContaining({ titre: "Sas contaminé traité sans ordre" }),
        expect.objectContaining({ titre: "Ordre demandé depuis le hall filtré" }),
      ],
    });
    expect(projection.ordreImportant).toEqual({
      titre: "La salle des pompes est encore alimentée",
      faitConnu: "Galerie praticable encore 20 à 35 min.",
      source: "Capteur de l’équipe — maintenant",
      recommandation: "Couper l’alimentation et préserver l’équipe.",
      enjeuPersonnel: "Ne pas franchir le seuil de blessure promis.",
      regleTemps:
        "L’Expédition attend ; le Temps du convoi continue et reste suspendable manuellement.",
      options: [
        expect.objectContaining({
          id: "couper-contourner",
          intention: "Couper puis contourner",
          consequences:
            "+45 min exactes · Eau +1,2–1,9 j estimés · exposition réduite",
          source: "Projection de Liora",
          age: "maintenant",
          recommandee: true,
        }),
        expect.objectContaining({
          id: "forcer-galerie",
          intention: "Forcer la galerie",
          consequences:
            "+15–25 min estimées · Eau +2,2–2,9 j estimés · exposition forte",
          recommandee: false,
        }),
        expect.objectContaining({
          id: "ordonner-repli",
          intention: "Ordonner le repli",
          recommandee: false,
        }),
      ],
    });
    expect(JSON.stringify(projection.ordreImportant)).not.toMatch(
      /déplacer|gauche|droite/i,
    );
    expect(
      projeterPilotage(etat, "fr").journalCausal
        .filter((fait) => fait.id.startsWith("expedition.vannes-grises"))
        .map((fait) => fait.titre),
    ).toEqual([
      "Expédition — mandat confirmé",
      "Expédition — canal sec atteint",
      "Expédition — détour autonome consigné",
      "Expédition — sas traité dans le mandat",
      "Expédition — rupture du mandat consignée",
    ]);
  });

  it("compare prévu et réalisé dans le Bilan de retour", () => {
    let etat: EtatCampagne = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      { type: "expedition.lancer", expeditionId: "vannes-grises" },
    ).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 9_420,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "expedition.ordonner",
      expeditionId: "vannes-grises",
      intention: "forcer-galerie",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 7_500,
    }).etat;

    expect(projeterExpedition(etat, "fr").bilan).toEqual({
      titre: "Pompe réamorcée sous exposition",
      duree: { prevue: "4 h 10–5 h 20", realisee: "4 h 42" },
      gain: { prevu: "Eau : +1,8–2,7 j d’Autonomie", realise: "Eau : +2,6 j d’Autonomie" },
      causeEcart: "Galerie forcée ; une exposition a été traitée.",
      ecarts: [
        "Passerelle rompue : détour réversible",
        "Sas contaminé : filtre double engagé",
        "Galerie forcée : exposition traitée",
      ],
      couts: [
        "Vivres : −331,2 rations",
        "Eau : −182,4 L",
        "Matériaux : −2 pièces",
      ],
      ordres: ["Forcer la galerie"],
      blessures: ["Exposition à la cendre traitée"],
      renseignements: ["Débit fort des Vannes Grises confirmé"],
      engagements: [],
      cicatrices: ["Liora — exposition prolongée"],
    });
    expect(projeterPilotage(etat, "fr").journalCausal.at(-1)?.titre).toBe(
      "Expédition — équipe revenue à Atelier–Opérations",
    );
  });
});
