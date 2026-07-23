import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS_DU_LOT_DE_LA_VOIE_PRINCIPALE = [
  "trame.barriere-neuve.le-permis-des-essieux",
  "trame.barriere-neuve.la-taxe-des-lanternes",
  "trame.grand-aiguillage.la-piece-sans-serie",
  "trame.grand-aiguillage.l-eau-des-machines",
  "trame.grand-aiguillage.ilyana-et-l-attelage",
] as const;

describe("voie principale de la Trame de Fer", () => {
  it("compile exactement deux conflits, une révélation, une conséquence et une histoire de Compagnon", () => {
    expect(catalogueDeBase.evenements.map(({ id }) => id)).not.toEqual(
      expect.arrayContaining([...IDS_DU_LOT_DE_LA_VOIE_PRINCIPALE]),
    );

    const lot = IDS_DU_LOT_DE_LA_VOIE_PRINCIPALE.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );

    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "conflits-regionaux",
      "conflits-regionaux",
      "mystere-des-phares",
      "consequences-systemiques",
      "histoires-de-compagnons",
    ]);
    expect(
      catalogueDEvenements.evenements.filter((evenement) =>
        evenement.id.startsWith("trame."),
      ),
    ).toHaveLength(5);
  });

  it("annonce le Train-outil et l’Attelage fédéré avec des coûts lisibles sans imposer le monopole républicain", () => {
    const revelation = catalogueDEvenements.evenements.find(
      ({ id }) => id === "trame.grand-aiguillage.la-piece-sans-serie",
    );
    const compagnon = catalogueDEvenements.evenements.find(
      ({ id }) => id === "trame.grand-aiguillage.ilyana-et-l-attelage",
    );

    expect(revelation?.choix.flatMap(({ faitsProduits }) => faitsProduits)).toEqual(
      expect.arrayContaining([
        {
          id: "trame.grand-aiguillage.train-outil-annonce",
          cible: "piece-de-regulation",
        },
        {
          id: "trame.grand-aiguillage.reparation-locale-ouverte",
          cible: "piece-de-regulation",
        },
      ]),
    );
    expect(compagnon?.choix.flatMap(({ faitsProduits }) => faitsProduits)).toEqual(
      expect.arrayContaining([
        {
          id: "trame.grand-aiguillage.attelage-federe-annonce",
          cible: "piece-de-regulation",
        },
      ]),
    );
    expect(revelation?.textes.fr.choix["appeler-train-outil"]?.coutsConnus[0]
      .modele).toContain("Engagement");
    expect(compagnon?.textes.fr.choix["former-attelage"]?.coutsConnus[0]
      .modele).toContain("Matériaux");
  });

  it("livre cinq assets premium bilingues, distincts, accessibles et traçables", () => {
    const lot = IDS_DU_LOT_DE_LA_VOIE_PRINCIPALE.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );

    for (const evenement of lot) {
      expect(evenement?.periodeEligibilite.fin).toBe(2_147_483_647);
      expect(evenement?.textes.fr.titre.modele).not.toBe("");
      expect(evenement?.textes.en.titre.modele).not.toBe("");
      expect(evenement?.asset).toMatchObject({
        contientTexte: false,
        fichier: expect.stringMatching(
          /^\/api\/commercial\/assets\/.+\.webp$/,
        ),
        alternatives: {
          fr: expect.any(String),
          en: expect.any(String),
        },
        provenance: {
          droits: "OpenAI Terms of Use — output assigned to the user",
          statutApprobation: "pending-pull-request-review",
          reviseur: null,
        },
      });
    }
    expect(
      new Set(lot.map((evenement) => evenement?.asset?.fichier)).size,
    ).toBe(5);
  });
});
