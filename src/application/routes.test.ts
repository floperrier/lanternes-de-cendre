import { describe, expect, it } from "vitest";

import { appliquerCommande, creerCampagneInitiale } from "../simulation/campagne";
import { projeterAtlas } from "./routes";

describe("projection de l’Atlas", () => {
  it("compare les Renseignements sans révéler l’état réel du Tronçon", () => {
    const projection = projeterAtlas(creerCampagneInitiale("CENDRE-01"));
    const digue = projection.troncons.find(
      (troncon) => troncon.id === "digue-des-puits",
    );

    expect(digue).toEqual({
      id: "digue-des-puits",
      destination: "Haut-Puits",
      connexion: "Halte du puits sec → Haut-Puits",
      duree: "6 min",
      consommation: "3 L de Combustible",
      engageable: true,
      renseignements: [
        {
          source: "Vigie du Phare",
          age: "relevé maintenant",
          fiabilite: "Confirmé",
          etat: "Praticable",
          meteo: "Cendre basse",
          panache: "Dérive vers l’est",
          danger: "Nappe de saumure",
          controlePolitique: "Puits Libres",
        },
        {
          source: "Messagers de Haut-Puits",
          age: "relevé il y a 2 h",
          fiabilite: "Ancien",
          etat: "Dégradé",
          meteo: "Rafales de cendre",
          panache: "Panache incertain",
          danger: "Nappe de saumure",
          controlePolitique: "Puits Libres",
        },
      ],
      bilan: {
        consequencesConnues: [
          "Durée exacte : 6 min",
          "Consommation exacte : 3 L de Combustible",
        ],
        incertitudes: [
          {
            valeur: "Eau estimée : 3–5 L",
            source: "Vigie du Phare",
            age: "relevé maintenant",
          },
        ],
      },
    });
    expect(JSON.stringify(projection)).not.toContain('"etatsReels"');
    expect(JSON.stringify(projection)).not.toContain('"degrade"');
  });

  it("projette l’Engagement en cours et la liaison aval en anglais", () => {
    const engagement = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    }).etat;

    expect(projeterAtlas(engagement, "en")).toMatchObject({
      titre: "Operations Atlas",
      position: "Dry Well Halt",
      engagement: {
        destination: "High Well",
        arrivee: "in 6 min",
        retour: "No normal U-turn",
      },
      troncons: [
        expect.objectContaining({
          id: "digue-des-puits",
          destination: "High Well",
          engageable: false,
          renseignements: [
            expect.objectContaining({ source: "Lighthouse Watch" }),
            expect.objectContaining({ source: "High Well Messengers" }),
          ],
        }),
      ],
    });

    const enRoute = appliquerCommande(engagement, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    }).etat;
    const arrivee = appliquerCommande(enRoute, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    }).etat;
    expect(projeterAtlas(arrivee, "en")).toMatchObject({
      position: "High Well",
      engagement: null,
      dernierJalon: {
        cause: "Ash Front — rear access condemned",
      },
      troncons: [
        {
          id: "chenal-des-vannes",
          destination: "Sluice Relay",
          connexion: "High Well → Sluice Relay",
        },
      ],
    });
  });
});
