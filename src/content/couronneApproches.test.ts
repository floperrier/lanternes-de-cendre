import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS = [
  "couronne.tete-de-ligne.le-decret-du-dernier-quai",
  "couronne.veille-des-trois.les-filtres-sous-les-phares",
  "couronne.approches.les-trois-socles-du-noeud",
  "couronne.approches.les-montages-de-la-couronne",
  "couronne.approches.ilyana-et-les-plans-sous-cendre",
] as const;

describe("approches de la Couronne muette", () => {
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
        id.startsWith("couronne."),
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

  it("garde les approches, leurs textes et leurs assets hors du catalogue gratuit", () => {
    expect(JSON.stringify(catalogueDeBase)).not.toMatch(
      /Tête-de-Ligne|Railhead|Veille-des-Trois|Threefold Watch|Berceau d’ancrage|Anchoring Cradle/,
    );
    expect(JSON.stringify(catalogueDeBase)).not.toContain("couronne-");
  });

  it("donne à chaque décision importante un ou deux Faits persistants", () => {
    for (const id of IDS) {
      const evenement = catalogueDEvenements.evenements.find(
        (candidat) => candidat.id === id,
      );
      for (const choix of evenement?.choix ?? []) {
        expect(choix.faitsProduits.length).toBeGreaterThanOrEqual(1);
        expect(choix.faitsProduits.length).toBeLessThanOrEqual(2);
      }
    }
  });
});
