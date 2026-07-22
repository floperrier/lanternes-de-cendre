import { describe, expect, it } from "vitest";

import { appliquerCommande, creerCampagneInitiale } from "../simulation/campagne";
import { projeterCompagnonEtConseil } from "./conseil";

describe("projection du Compagnon et du Conseil", () => {
  it("présente le profil complet avant toute Affectation", () => {
    const projection = projeterCompagnonEtConseil(
      creerCampagneInitiale("CENDRE-01"),
      "fr",
    );

    expect(projection.compagnon).toMatchObject({
      id: "ilyana-voss",
      nom: "Ilyana Voss",
      competenceMajeure: "Intendance",
      competenceSecondaire: "Diplomatie",
      trait: {
        nom: "Minutieuse, jusqu’à l’intransigeance",
        ambivalence: expect.stringContaining("pression"),
      },
      conviction: expect.stringContaining("eau sûre"),
      projet: expect.stringContaining("circuit de purification redondant"),
      etatPersonnel: {
        nom: "Brûlures de cendre stabilisées",
        contrainte: expect.stringContaining("eau contaminée"),
        voieDeSoin: expect.stringContaining("filtres"),
      },
      affectation: null,
    });
    expect(projection.conseil).toBeNull();
  });

  it("ouvre un Conseil structuré et une information précise après l’Affectation", () => {
    const etatAffecte = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "compagnon.affecter",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
      },
    ).etat;

    const projection = projeterCompagnonEtConseil(etatAffecte, "fr");

    expect(projection.compagnon.affectation).toEqual({
      quartierId: "intendance",
      quartier: "Intendance",
      informationOuverte:
        "Le clapet secondaire peut isoler la pompe douze minutes sans interrompre l’eau des Foyers.",
    });
    expect(projection.conseil).toMatchObject({
      id: "conseil.premiere-veille",
      titre: "Conseil de la première veille",
      sujets: [
        {
          id: "purification-et-partage-de-l-eau",
          titre: "Purification et partage de l’eau",
          voix: [
            {
              compagnonId: "ilyana-voss",
              compagnon: "Ilyana Voss",
              faitConnu: expect.stringContaining("douze minutes"),
              source: {
                nom: "Relevé de pression de l’Intendance",
                date: "relevé à 00:00",
              },
              recommandationMorale: expect.stringContaining("Foyers"),
              enjeuPersonnel: expect.stringContaining("brûlures"),
            },
          ],
          decisions: [
            {
              id: "securiser-circuit",
              libelle: "Prioriser la sécurisation du circuit",
              ouverteParAffectation: true,
            },
            {
              id: "maintenir-distribution",
              libelle: "Maintenir la distribution vers les ateliers",
              ouverteParAffectation: false,
            },
          ],
        },
      ],
    });
    expect(projection.conseil!.sujets.length).toBeLessThanOrEqual(3);
    expect(projection.conseil!.sujets[0]!.voix.length).toBeLessThanOrEqual(2);
  });

  it("projette les textes narratifs du Conseil en anglais", () => {
    const etatAffecte = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      {
        type: "compagnon.affecter",
        compagnonId: "ilyana-voss",
        quartierId: "intendance",
      },
    ).etat;

    const projection = projeterCompagnonEtConseil(etatAffecte, "en");

    expect(projection.compagnon.competenceMajeure).toBe(
      "Stewardship",
    );
    expect(projection.conseil?.sujets[0]?.voix[0]).toMatchObject({
      faitConnu: expect.stringContaining("twelve minutes"),
      recommandationMorale: expect.stringContaining("living quarters"),
      enjeuPersonnel: expect.stringContaining("ash burns"),
    });
  });
});
