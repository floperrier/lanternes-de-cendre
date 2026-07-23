import { describe, expect, it } from "vitest";

import { EVENEMENTS_DE_LA_DEMONSTRATION } from "../application/demonstration";
import { catalogueDEvenements } from "./catalogue";
import { FAMILLES_D_EVENEMENTS } from "./types";

describe("contenu de la Démonstration", () => {
  it("livre cinq Événements bilingues, illustrés et traçables sous le budget de première scène", () => {
    const evenements = EVENEMENTS_DE_LA_DEMONSTRATION.map((id) =>
      catalogueDEvenements.evenements.find((evenement) => evenement.id === id),
    );
    const prologue = evenements.slice(0, 4);

    expect(evenements).not.toContain(undefined);
    expect(new Set(prologue.map((evenement) => evenement?.famille))).toEqual(
      new Set(FAMILLES_D_EVENEMENTS),
    );
    expect(evenements[4]?.famille).toBe("conflits-regionaux");
    for (const evenement of evenements) {
      expect(evenement?.textes.fr.titre.modele).not.toBe("");
      expect(evenement?.textes.en.titre.modele).not.toBe("");
      expect(evenement?.asset?.provenance.fiche).toMatch(
        /^docs\/assets\/.*\.provenance\.json$/,
      );
      expect(evenement?.asset?.provenance.droits).toBe(
        "OpenAI Terms of Use — output assigned to the user",
      );
    }

    const assetsUniques = new Map(
      evenements.flatMap((evenement) =>
        evenement?.asset === undefined || evenement.asset === null
          ? []
          : [[evenement.asset.fichier, evenement.asset] as const],
      ),
    );
    const octetsTransferes = [...assetsUniques.values()].reduce(
      (total, asset) => total + asset.octetsTransferes,
      0,
    );
    expect(octetsTransferes).toBeLessThanOrEqual(12 * 1_024 * 1_024);
  });

  it("enchaîne les cinq Événements par leurs Faits persistants", () => {
    const evenements = EVENEMENTS_DE_LA_DEMONSTRATION.map((id) =>
      catalogueDEvenements.evenements.find((evenement) => evenement.id === id),
    );

    expect(evenements.map((evenement) => evenement?.faitsLus)).toEqual([
      ["prologue.cohorte-accueillie", "prologue.cohorte-orientee"],
      ["prologue.cohorte-accueillie", "prologue.cohorte-orientee"],
      ["prologue.harmonique-consignee", "prologue.signal-etouffe"],
      [
        "prologue.filtres-foyers-prioritaires",
        "prologue.filtres-ateliers-prioritaires",
      ],
      [
        "prologue.ilyana-ecoutee",
        "prologue.ilyana-contredite",
        "prologue.cohorte-accueillie",
        "prologue.cohorte-orientee",
      ],
    ]);
    expect(evenements[4]?.variantes).toEqual([
      {
        id: "cohorte-accueillie",
        condition: "fait-present:prologue.cohorte-accueillie",
      },
      {
        id: "cohorte-orientee",
        condition: "fait-present:prologue.cohorte-orientee",
      },
      { id: "standard", condition: "toujours" },
    ]);
  });
});
