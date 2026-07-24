import { describe, expect, it } from "vitest";

import {
  COMPETENCES_DE_COMPAGNON,
  LIENS_DU_VIVIER,
  PARCOURS_DE_RECRUTEMENT,
  VIVIER_DE_COMPAGNONS,
} from "./vivier";

describe("Vivier de compagnons", () => {
  it("répartit dix profils sur cinq compétences équilibrées", () => {
    expect(VIVIER_DE_COMPAGNONS).toHaveLength(10);
    expect(new Set(VIVIER_DE_COMPAGNONS.map(({ id }) => id)).size).toBe(10);
    expect(COMPETENCES_DE_COMPAGNON).toEqual([
      "technique",
      "intendance",
      "soin",
      "terrain",
      "diplomatie",
    ]);

    for (const competence of COMPETENCES_DE_COMPAGNON) {
      expect(
        VIVIER_DE_COMPAGNONS.filter(
          ({ competences }) => competences.majeure === competence,
        ),
      ).toHaveLength(2);
      expect(
        VIVIER_DE_COMPAGNONS.filter(
          ({ competences }) => competences.secondaire === competence,
        ),
      ).toHaveLength(2);
    }
    expect(
      VIVIER_DE_COMPAGNONS.every(
        ({ competences }) =>
          competences.majeure !== competences.secondaire,
      ),
    ).toBe(true);
    expect(
      new Set(
        VIVIER_DE_COMPAGNONS.map(({ pivotPersonnel }) => pivotPersonnel.id),
      ).size,
    ).toBe(10);
    for (const compagnon of VIVIER_DE_COMPAGNONS) {
      expect(compagnon.trait.id).not.toBe("");
      expect(compagnon.trait.avantageConditionnel).not.toBe("");
      expect(compagnon.trait.angleMort).not.toBe("");
      expect(compagnon.conviction.id).not.toBe("");
      expect(compagnon.conviction.sujets.length).toBeGreaterThan(0);
      expect(compagnon.conviction.preference).not.toBe("");
      expect(compagnon.conviction.ligneRouge).not.toBe("");
    }
  });

  it("écrit dix Liens bornés et donne exactement deux partenaires à chacun", () => {
    expect(LIENS_DU_VIVIER).toHaveLength(10);
    expect(new Set(LIENS_DU_VIVIER.map(({ id }) => id)).size).toBe(10);
    expect(
      LIENS_DU_VIVIER.every(
        ({ etats, transitions }) =>
          etats.length <= 3 && transitions.length <= 2,
      ),
    ).toBe(true);

    for (const compagnon of VIVIER_DE_COMPAGNONS) {
      expect(
        LIENS_DU_VIVIER.filter(({ compagnons }) =>
          compagnons.some(
            (compagnonDuLien) => compagnonDuLien === compagnon.id,
          ),
        ),
      ).toHaveLength(2);
    }
  });

  it("garantit au moins un Lien activable dans chaque parcours", () => {
    expect(PARCOURS_DE_RECRUTEMENT.length).toBeGreaterThan(1);
    for (const parcours of PARCOURS_DE_RECRUTEMENT) {
      const recrutes = new Set(parcours.compagnons);
      expect(
        LIENS_DU_VIVIER.some(({ compagnons: [gauche, droite] }) =>
          recrutes.has(gauche) && recrutes.has(droite),
        ),
      ).toBe(true);
    }
  });
});
