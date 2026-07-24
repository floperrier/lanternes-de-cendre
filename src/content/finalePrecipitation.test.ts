import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const ID =
  "finale.precipitation.la-derniere-negociation-des-bassins";

describe("finale — Faire tomber la cendre", () => {
  it("ajoute exactement une conséquence systémique au catalogue de 58 Événements", () => {
    const lot = catalogueDEvenements.evenements.filter(({ id }) =>
      id.startsWith("finale.precipitation."),
    );

    expect(lot).toHaveLength(1);
    expect(lot[0]).toMatchObject({
      id: ID,
      famille: "consequences-systemiques",
    });
    expect(lot[0]?.choix.map(({ id }) => id)).toEqual([
      "administrer-le-ciel-rendu",
      "assigner-la-terre-des-sacrifies",
      "rompre-le-front-en-pluie-noire",
    ]);
    expect(catalogueDEvenements.evenements).toHaveLength(58);
  });

  it("nomme contrôle, victimes et dette environnementale dans les deux langues", () => {
    const consequence = catalogueDEvenements.evenements.find(
      ({ id }) => id === ID,
    );

    expect(consequence?.textes.fr.presentation.modele).toContain(
      "où elle tombe",
    );
    expect(consequence?.textes.fr.informations[0]?.modele).toContain(
      "Aucun ciel clair",
    );
    expect(consequence?.textes.en.presentation.modele).toContain(
      "where it falls",
    );
    expect(consequence?.textes.en.informations[0]?.modele).toContain(
      "No clear sky",
    );
    expect(consequence?.acteurs).not.toContain("ilyana-voss");
    expect(consequence?.acteurs).not.toContain("maelys-rive");
  });

  it("livre une illustration accessible et traçable hors du catalogue gratuit", () => {
    const consequence = catalogueDEvenements.evenements.find(
      ({ id }) => id === ID,
    );

    expect(consequence?.asset).toMatchObject({
      contientTexte: false,
      fichier:
        "/api/commercial/assets/finale-precipitation-consequence.webp",
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
    const catalogueGratuit = JSON.stringify(catalogueDeBase);
    expect(catalogueGratuit).not.toContain(
      "La Dernière négociation des bassins",
    );
    expect(catalogueGratuit).not.toContain(
      "finale-precipitation-consequence.webp",
    );
  });

  it("associe un seul Fait causal à chacune des trois issues", () => {
    const consequence = catalogueDEvenements.evenements.find(
      ({ id }) => id === ID,
    );

    expect(
      consequence?.choix.every(
        ({ faitsProduits }) => faitsProduits.length === 1,
      ),
    ).toBe(true);
  });
});
