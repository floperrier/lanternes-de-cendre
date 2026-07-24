import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const IDS = [
  "finale.ancrage.le-contrat-des-trois-solutions",
  "finale.ancrage.choisir-d-ancrer-le-coeur",
  "finale.ancrage.la-derniere-negociation",
] as const;

describe("finale — Ancrer le cœur", () => {
  it("compile exactement une révélation, un conflit et une histoire de Compagnon", () => {
    const lot = IDS.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );

    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "mystere-des-phares",
      "conflits-regionaux",
      "histoires-de-compagnons",
    ]);
    expect(
      catalogueDEvenements.evenements.filter(({ id }) =>
        id.startsWith("finale.ancrage."),
      ),
    ).toHaveLength(3);
    expect(catalogueDEvenements.evenements).toHaveLength(58);
  });

  it("livre trois assets premium bilingues, accessibles et traçables", () => {
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
          /^\/api\/commercial\/assets\/finale-ancrage-.+\.webp$/,
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
    ).toBe(3);
  });

  it("garde le contrat, le cœur et leurs images hors du catalogue gratuit", () => {
    const catalogueGratuit = JSON.stringify(catalogueDeBase);
    expect(catalogueGratuit).not.toMatch(
      /Contrat final du Nœud|Node’s final contract|Dernière négociation/,
    );
    expect(catalogueGratuit).not.toContain("finale-ancrage-");
    expect(catalogueGratuit).not.toContain("coeur-du-noeud");
  });

  it("fait de la négociation une histoire du Compagnon réellement suivi", () => {
    const negociation = catalogueDEvenements.evenements.find(
      ({ id }) =>
        id === "finale.ancrage.la-derniere-negociation",
    );
    expect(negociation?.acteurs).toEqual([
      "porte-lanterne",
      "ilyana-voss",
      "equipes-de-l-anneau",
    ]);
    expect(
      negociation?.textes.fr.presentation.modele,
    ).toContain("Ilyana");
    expect(
      negociation?.textes.en.informations[0]?.modele,
    ).toContain("Ilyana");
  });

  it("associe exactement un Fait persistant à chaque décision finale", () => {
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
