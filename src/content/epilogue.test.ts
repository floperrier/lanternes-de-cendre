import { describe, expect, it } from "vitest";

import { catalogueDEvenements } from "./catalogue";
import {
  CATEGORIES_DE_RETOUR_PAR_FAIT_MAJEUR,
  FAITS_MAJEURS_DE_L_EPILOGUE,
} from "../simulation/epilogue";

const IDS_DE_L_EPILOGUE = [
  "epilogue.revelation.le-registre-des-rejets",
  "epilogue.compagnons.le-dernier-tour-de-veille",
] as const;

const REVELATIONS_GARANTIES = [
  "prologue.reponse-du-phare",
  "veille-basse.les-registres-du-reflux",
  "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
  "couronne.ouverture.le-diagnostic-des-verrous",
  "epilogue.revelation.le-registre-des-rejets",
] as const;

function chapitre(id: string):
  | "prologue"
  | "bassins"
  | "trame"
  | "couronne"
  | "finale" {
  if (id.startsWith("prologue.")) {
    return "prologue";
  }
  if (
    id.startsWith("bassins.") ||
    id.startsWith("bassins-fendus.") ||
    id.startsWith("veille-basse.")
  ) {
    return "bassins";
  }
  if (id.startsWith("trame.")) {
    return "trame";
  }
  if (id.startsWith("couronne.")) {
    return "couronne";
  }
  return "finale";
}

describe("contrat éditorial de l’Épilogue", () => {
  it("porte le catalogue à 60 selon la matrice 4 + 17 + 18 + 14 + 7", () => {
    expect(catalogueDEvenements.evenements).toHaveLength(60);
    expect(
      Object.fromEntries(
        ["prologue", "bassins", "trame", "couronne", "finale"].map(
          (groupe) => [
            groupe,
            catalogueDEvenements.evenements.filter(
              ({ id }) => chapitre(id) === groupe,
            ).length,
          ],
        ),
      ),
    ).toEqual({
      prologue: 4,
      bassins: 17,
      trame: 18,
      couronne: 14,
      finale: 7,
    });

    const parFamille = Object.fromEntries(
      [
        "conflits-regionaux",
        "mystere-des-phares",
        "consequences-systemiques",
        "histoires-de-compagnons",
      ].map((famille) => [
        famille,
        catalogueDEvenements.evenements.filter(
          (evenement) => evenement.famille === famille,
        ).length,
      ]),
    );
    expect(parFamille).toEqual({
      "conflits-regionaux": 22,
      "mystere-des-phares": 13,
      "consequences-systemiques": 13,
      "histoires-de-compagnons": 12,
    });
  });

  it("ajoute exactement une révélation finale et une histoire collective", () => {
    const lot = IDS_DE_L_EPILOGUE.map((id) =>
      catalogueDEvenements.evenements.find(
        (evenement) => evenement.id === id,
      ),
    );
    expect(lot).not.toContain(undefined);
    expect(lot.map((evenement) => evenement?.famille)).toEqual([
      "mystere-des-phares",
      "histoires-de-compagnons",
    ]);
    expect(
      catalogueDEvenements.evenements.filter(({ id }) =>
        id.startsWith("epilogue."),
      ),
    ).toHaveLength(2);
    for (const evenement of lot) {
      expect(evenement?.asset).toMatchObject({
        contientTexte: false,
        fichier: expect.stringMatching(
          /^\/api\/commercial\/assets\/epilogue-.+\.webp$/,
        ),
        alternatives: {
          fr: expect.any(String),
          en: expect.any(String),
        },
        provenance: {
          statutApprobation: "pending-pull-request-review",
          reviseur: null,
        },
      });
    }
  });

  it("garantit cinq révélations essentielles sur tous les parcours", () => {
    expect(
      catalogueDEvenements.evenements
        .filter(({ themes }) => themes.includes("revelation-garantie"))
        .map(({ id }) => id),
    ).toEqual(REVELATIONS_GARANTIES);
  });

  it("répartit les douze Histoires en dix pivots et deux collectifs", () => {
    const histoires = catalogueDEvenements.evenements.filter(
      ({ famille }) => famille === "histoires-de-compagnons",
    );
    expect(
      histoires.filter(({ themes }) => themes.includes("pivot-personnel")),
    ).toHaveLength(10);
    expect(
      histoires.filter(({ themes }) =>
        themes.includes("collectif-de-compagnons"),
      ),
    ).toHaveLength(2);
  });

  it("ne laisse aucun Fait majeur sans catégorie de retour", () => {
    expect(
      FAITS_MAJEURS_DE_L_EPILOGUE.filter(
        (fait) => CATEGORIES_DE_RETOUR_PAR_FAIT_MAJEUR[fait] === undefined,
      ),
    ).toEqual([]);
  });
});
