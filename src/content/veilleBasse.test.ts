import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";

export const EVENEMENTS_DE_VEILLE_BASSE = [
  "veille-basse.la-place-sous-le-phare",
  "veille-basse.la-porte-des-filtres",
  "veille-basse.les-registres-du-reflux",
  "veille-basse.maelys-et-le-coffret",
] as const;

describe("lot éditorial de Veille-Basse", () => {
  it("compile exactement deux conflits régionaux, une révélation et une histoire de Compagnon", () => {
    const evenements = EVENEMENTS_DE_VEILLE_BASSE.map((id) =>
      catalogueDEvenements.evenements.find((evenement) => evenement.id === id),
    );

    expect(evenements).not.toContain(undefined);
    expect(evenements.map((evenement) => evenement?.famille)).toEqual([
      "conflits-regionaux",
      "conflits-regionaux",
      "mystere-des-phares",
      "histoires-de-compagnons",
    ]);
    expect(
      catalogueDEvenements.evenements.filter((evenement) =>
        evenement.id.startsWith("veille-basse."),
      ),
    ).toHaveLength(4);
  });

  it("rend chaque Événement bilingue, illustré, traçable et accessible", () => {
    const evenements = EVENEMENTS_DE_VEILLE_BASSE.map((id) =>
      catalogueDEvenements.evenements.find((evenement) => evenement.id === id),
    );

    for (const evenement of evenements) {
      expect(evenement?.textes.fr.titre.modele).not.toBe("");
      expect(evenement?.textes.en.titre.modele).not.toBe("");
      expect(evenement?.asset?.alternatives.fr).not.toBe("");
      expect(evenement?.asset?.alternatives.en).not.toBe("");
      expect(evenement?.asset?.contientTexte).toBe(false);
      expect(evenement?.asset?.provenance).toMatchObject({
        droits: "OpenAI Terms of Use — output assigned to the user",
        statutApprobation: "pending-pull-request-review",
        reviseur: null,
      });
    }
  });

  it("garantit une révélation essentielle compréhensible sans Compagnon particulier", () => {
    const revelation = catalogueDEvenements.evenements.find(
      (evenement) =>
        evenement.id === "veille-basse.les-registres-du-reflux",
    );

    expect(revelation).toMatchObject({
      famille: "mystere-des-phares",
      fonction: "revelation-essentielle-deplacement-des-cendres",
      acteurs: ["porte-lanterne", "techniciens-veille-basse"],
    });
    expect(revelation?.acteurs).not.toContain("maelys-rive");
    expect(revelation?.textes.fr.presentation.modele).toContain(
      "repoussait la cendre",
    );
    expect(revelation?.textes.en.presentation.modele).toContain(
      "pushed ash",
    );
  });

  it("enchaîne le lot depuis Veille-Basse sans répétition identique", () => {
    const evenements = EVENEMENTS_DE_VEILLE_BASSE.map((id) =>
      catalogueDEvenements.evenements.find((evenement) => evenement.id === id),
    );

    expect(evenements.map((evenement) => evenement?.epuisement)).toEqual([
      "unique",
      "unique",
      "unique",
      "unique",
    ]);
    expect(evenements[0]?.conditions.requises).toContainEqual({
      type: "lieu-present",
      lieu: "veille-basse",
    });
    expect(evenements[1]?.faitsLus).toEqual([
      "veille-basse.cohorte-accueillie",
      "veille-basse.cohorte-refusee",
      "veille-basse.cohorte-redirigee",
    ]);
    expect(evenements[2]?.faitsLus).toEqual([
      "veille-basse.sas-renforce",
      "veille-basse.hospice-ouvert",
    ]);
    expect(evenements[3]?.faitsLus).toEqual([
      "veille-basse.registres-copies",
      "veille-basse.registres-laisses",
    ]);
  });
});
