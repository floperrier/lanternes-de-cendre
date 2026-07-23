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
      libelle: "Haut-Puits",
      destination: "Haut-Puits",
      connexion: "Maison des Filtres → Haut-Puits",
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
      position: "Filter House",
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
    expect(projeterAtlas(arrivee, "en", () => false)).toMatchObject({
      position: "High Well",
      engagement: null,
      dernierJalon: {
        cause: "Ash Front — rear access condemned",
      },
      troncons: expect.arrayContaining([
        expect.objectContaining({
          id: "chemin-des-vanniers",
          destination: "The Basketmakers",
          connexion: "High Well → The Basketmakers",
          engageable: false,
          renseignements: [
            expect.objectContaining({
              source: "High Well Scouts",
              age: "observed 6 min ago",
            }),
          ],
          bilan: expect.objectContaining({
            consequencesConnues: expect.arrayContaining([
              "The Lighthouse plume drifts east and reaches the Basketmakers.",
            ]),
          }),
        }),
      ]),
    });

    expect(projeterAtlas(arrivee, "en", () => true).troncons[0]).toMatchObject(
      {
        id: "chemin-des-vanniers",
        engageable: false,
      },
    );
  });

  it("projette le coût et le Renseignement causal des Nacelles sans révéler leur état réel", () => {
    const initial = creerCampagneInitiale("CENDRE-NACELLES");
    const projection = projeterAtlas({
      ...initial,
      routes: { ...initial.routes, position: "les-vanniers" },
      hautPuits: {
        ...initial.hautPuits,
        relationPublique: "cooperative",
      },
      narration: {
        ...initial.narration,
        faitsDeCampagne: [
          {
            id: "bassins.haut-puits.panache-confine",
            cause: "bassins.haut-puits.vanniers-du-panache",
            acteurs: ["porte-lanterne"],
            cible: "nacelliers-des-vannes",
            moment: 0,
            effets: { materiels: [], humains: [] },
          },
          {
            id: "bassins.haut-puits.ilyana-garante",
            cause: "bassins.haut-puits.ilyana-et-la-vanne",
            acteurs: ["porte-lanterne"],
            cible: "ilyana-voss",
            moment: 0,
            effets: { materiels: [], humains: [] },
          },
        ],
      },
    });
    const nacelles = projection.troncons.find(
      ({ id }) => id === "chenal-des-vannes",
    );

    expect(nacelles).toMatchObject({
      destination: "Relais des Vannes",
      consommation: "4 L de Combustible · 6 L d’Eau",
      renseignements: [
        expect.objectContaining({
          source: "Relevé transmis par la branche d’approche",
          fiabilite: "Rapporté",
          controlePolitique: "Mandat des Nacelliers non reconnu",
        }),
      ],
      bilan: {
        consequencesConnues: expect.arrayContaining([
          "Consommation exacte : 4 L de Combustible · 6 L d’Eau",
          "Appui appliqué : treuil principal sous charge contrôlée",
        ]),
        incertitudes: [],
      },
    });
    expect(JSON.stringify(nacelles)).not.toContain('"degrade"');
  });
});
