import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS = [
  "couronne.ouverture.le-diagnostic-des-verrous",
  "couronne.ouverture.les-trois-montages-devant-la-porte",
  "couronne.ouverture.le-dernier-conseil-de-la-couronne",
  "couronne.ouverture.ilyana-maelys-et-la-clef",
] as const;

describe("Ouverture de la Couronne", () => {
  it("ajoute exactement un conflit, un mystère, une conséquence et une histoire de Compagnon", () => {
    const lot = IDS.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );

    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "mystere-des-phares",
      "consequences-systemiques",
      "conflits-regionaux",
      "histoires-de-compagnons",
    ]);
    expect(
      catalogueDEvenements.evenements.filter(({ id }) =>
        id.startsWith("couronne."),
      ),
    ).toHaveLength(14);
  });

  it("livre quatre assets premium bilingues, accessibles et traçables", () => {
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
          /^\/api\/commercial\/assets\/couronne-ouverture-.+\.webp$/,
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
    ).toBe(4);
  });

  it("garde le dernier Conseil, le Nœud et leurs assets hors du catalogue gratuit", () => {
    const catalogueGratuit = JSON.stringify(catalogueDeBase);
    expect(catalogueGratuit).not.toMatch(
      /dernier Conseil de la Couronne|Crown’s final Council|Central Node locks/,
    );
    expect(catalogueGratuit).not.toContain("couronne-ouverture-");
    expect(catalogueGratuit).not.toContain(
      "delegues-du-dernier-conseil",
    );
  });

  it("ne persiste ni Faction ni Compagnon absent comme acteur des décisions", () => {
    const conseil = catalogueDEvenements.evenements.find(
      ({ id }) =>
        id ===
        "couronne.ouverture.le-dernier-conseil-de-la-couronne",
    );
    const clef = catalogueDEvenements.evenements.find(
      ({ id }) =>
        id === "couronne.ouverture.ilyana-maelys-et-la-clef",
    );

    expect(conseil?.acteurs).toEqual([
      "porte-lanterne",
      "equipes-de-l-anneau",
    ]);
    expect(clef?.acteurs).toEqual([
      "porte-lanterne",
      "equipes-de-l-anneau",
    ]);
  });

  it("donne exactement un Fait persistant à chaque décision", () => {
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
