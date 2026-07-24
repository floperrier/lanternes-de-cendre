import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import catalogueDeBase from "./catalogue.generated";

const ID =
  "finale.reaccord.la-derniere-negociation-du-reseau";

describe("finale — Réaccorder le réseau", () => {
  it("ajoute exactement un conflit final au catalogue de 58 Événements", () => {
    const lot = catalogueDEvenements.evenements.filter(({ id }) =>
      id.startsWith("finale.reaccord."),
    );

    expect(lot).toHaveLength(1);
    expect(lot[0]).toMatchObject({
      id: ID,
      famille: "conflits-regionaux",
    });
    expect(lot[0]?.choix.map(({ id }) => id)).toEqual([
      "mailler-la-constellation",
      "confier-le-reseau-de-fer",
      "separer-les-veilles",
    ]);
    expect(catalogueDEvenements.evenements).toHaveLength(58);
  });

  it("livre un conflit bilingue, accessible et traçable", () => {
    const conflit = catalogueDEvenements.evenements.find(
      ({ id }) => id === ID,
    );

    expect(conflit?.textes.fr.presentation.modele).toContain(
      "propriétaire",
    );
    expect(conflit?.textes.en.informations[0]?.modele).toContain(
      "alliances",
    );
    expect(conflit?.acteurs).not.toContain("ilyana-voss");
    expect(conflit?.acteurs).not.toContain("maelys-rive");
    expect(conflit?.asset).toMatchObject({
      contientTexte: false,
      fichier:
        "/api/commercial/assets/finale-reaccord-conflit.webp",
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
  });

  it("garde le conflit et son image hors du catalogue gratuit", () => {
    const catalogueGratuit = JSON.stringify(catalogueDeBase);

    expect(catalogueGratuit).not.toContain(
      "La Dernière négociation du réseau",
    );
    expect(catalogueGratuit).not.toContain(
      "finale-reaccord-conflit.webp",
    );
  });

  it("associe un seul Fait causal à chaque variante", () => {
    const conflit = catalogueDEvenements.evenements.find(
      ({ id }) => id === ID,
    );

    expect(
      conflit?.choix.every(
        ({ faitsProduits }) => faitsProduits.length === 1,
      ),
    ).toBe(true);
  });
});
