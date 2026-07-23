import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";

const IDS_DU_LOT_DE_TRAVERSE_LIBRE = [
  "trame.pompe-neuve.l-embranchement-sans-garde",
  "trame.pompe-neuve.les-filtres-du-rail",
  "trame.traverse-libre.le-reservoir-sous-la-voie",
  "trame.traverse-libre.la-galerie-qui-cede",
  "trame.traverse-libre.maelys-et-le-manifeste",
] as const;

describe("embranchement autonome de Traverse-Libre", () => {
  it("compile exactement deux conflits, une révélation, une conséquence et une histoire de Compagnon", () => {
    const lot = IDS_DU_LOT_DE_TRAVERSE_LIBRE.map((id) =>
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
        IDS_DU_LOT_DE_TRAVERSE_LIBRE.includes(
          evenement.id as (typeof IDS_DU_LOT_DE_TRAVERSE_LIBRE)[number],
        ),
      ),
    ).toHaveLength(5);
  });

  it("garantit une issue sans stock à la Galerie dégradée et distingue aide connue ou discrète", () => {
    const filtres = catalogueDEvenements.evenements.find(
      ({ id }) => id === "trame.pompe-neuve.les-filtres-du-rail",
    );
    const galerie = catalogueDEvenements.evenements.find(
      ({ id }) => id === "trame.traverse-libre.la-galerie-qui-cede",
    );

    expect(
      filtres?.choix.find(({ id }) => id === "inscrire-livraison")?.effets,
    ).toEqual([]);
    expect(
      galerie?.choix.find(({ id }) => id === "ouvrir-contournement")?.effets,
    ).toEqual([]);
    expect(
      galerie?.textes.fr.choix["ouvrir-contournement"]?.coutsConnus[0]
        .modele,
    ).toContain("deux futurs lots de filtres");
    expect(filtres?.textes.en.presentation.modele).toContain(
      "filters and medicine",
    );
  });

  it("livre cinq assets premium bilingues, distincts, accessibles et traçables", () => {
    const lot = IDS_DU_LOT_DE_TRAVERSE_LIBRE.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );
    for (const evenement of lot) {
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
