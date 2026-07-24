import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS = [
  "couronne.serres-de-verre.le-ralliement-des-cinq-colonies",
  "couronne.seuil.le-marche-des-abris",
  "couronne.seuil.les-releves-sous-la-porte",
  "couronne.colonies.le-prix-de-la-rampe",
  "couronne.seuil.maelys-et-le-registre-des-rallies",
] as const;

describe("voie des Colonies", () => {
  it("compile exactement deux conflits, un mystère, une conséquence et une histoire de Compagnon", () => {
    const lot = IDS.map((id) =>
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
      catalogueDEvenements.evenements.filter(({ id }) =>
        IDS.includes(id as (typeof IDS)[number]),
      ),
    ).toHaveLength(5);
  });

  it("livre cinq assets premium bilingues, accessibles et traçables", () => {
    const lot = IDS.map((id) =>
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
          /^\/api\/commercial\/assets\/couronne-.+\.webp$/,
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

  it("garde les Serres, le Seuil et leurs assets hors du catalogue gratuit", () => {
    expect(JSON.stringify(catalogueDeBase)).not.toMatch(
      /Serres-de-Verre|Glasshouses|Marché du Seuil|Threshold market/,
    );
    expect(JSON.stringify(catalogueDeBase)).not.toContain(
      "couronne-serres-ralliement",
    );
  });

  it("donne à chaque décision importante un Fait persistant", () => {
    for (const id of IDS) {
      const evenement = catalogueDEvenements.evenements.find(
        (candidat) => candidat.id === id,
      );
      for (const choix of evenement?.choix ?? []) {
        expect(choix.faitsProduits).toHaveLength(1);
      }
    }
  });
});
