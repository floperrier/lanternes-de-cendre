import { describe, expect, it } from "vitest";

import {
  creerFluxPseudoAleatoire,
  tirerEntierNonSigne,
  type FluxPseudoAleatoire,
} from "./aleatoire";

describe("flux pseudo-aléatoires", () => {
  it("reproduit le vecteur xoshiro128** 1.1 de référence", () => {
    let flux: FluxPseudoAleatoire = {
      algorithme: "xoshiro128**",
      version: 1,
      etat: [1, 2, 3, 4],
    };
    const valeurs: number[] = [];

    for (let index = 0; index < 5; index += 1) {
      const tirage = tirerEntierNonSigne(flux);
      valeurs.push(tirage.valeur);
      flux = tirage.flux;
    }

    expect(valeurs).toEqual([
      11_520,
      0,
      5_927_040,
      70_819_200,
      2_031_721_883,
    ]);
  });

  it("dérive des flux nommés indépendants et reproductibles de la Graine", () => {
    const evenements = creerFluxPseudoAleatoire(
      "CENDRE-01",
      "evenements-narratifs",
    );

    expect(
      creerFluxPseudoAleatoire("CENDRE-01", "evenements-narratifs"),
    ).toEqual(evenements);
    expect(creerFluxPseudoAleatoire("CENDRE-01", "meteo")).not.toEqual(
      evenements,
    );
    expect(evenements.etat).not.toEqual([0, 0, 0, 0]);
  });
});
