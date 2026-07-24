import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import type { EffetMaterielDeFait } from "../simulation/faits";
import {
  estFaitDeCampagneV2,
  ouvertureDeLaCouronneEstCausale,
  type ObjetInconnu,
} from "./validation";

function fait(
  id: string,
  moment: number,
  materiels: readonly EffetMaterielDeFait[] = [],
): ObjetInconnu {
  return {
    id,
    cause: `test.${id}`,
    acteurs: ["porte-lanterne"],
    cible: "anneau-interieur",
    moment,
    effets: { materiels, humains: [] },
  };
}

const cout = (
  stock: "eau" | "materiaux",
  variation: number,
): EffetMaterielDeFait => ({
  type: "stock.modifie",
  stock,
  variation,
});

function valider(faits: readonly ObjetInconnu[]): boolean {
  const etat = creerCampagneInitiale("CENDRE-VALIDATION-OUVERTURE");
  return ouvertureDeLaCouronneEstCausale(
    faits,
    etat.infrastructure,
    etat.routes,
    etat.expeditions,
    etat.hautPuits,
    etat.veilleBasse,
  );
}

describe("validation causale de l’Ouverture de la Couronne", () => {
  it("reconnaît les trois coûts réduits dans le schéma courant des Faits", () => {
    for (const [id, materiels] of [
      [
        "couronne.ouverture.rail-ouverte",
        [cout("materiaux", -2)],
      ],
      ["couronne.ouverture.phares-ouvertes", [cout("eau", -2)]],
      [
        "couronne.ouverture.colonies-ouvertes",
        [cout("eau", -2), cout("materiaux", -2)],
      ],
    ] as const) {
      expect(
        estFaitDeCampagneV2({
          id,
          cause:
            "couronne.ouverture.le-dernier-conseil-de-la-couronne",
          acteurs: ["porte-lanterne", "equipes-de-l-anneau"],
          cible: "verrous-du-noeud",
          moment: 200,
          effets: { materiels, humains: [] },
        }),
      ).toBe(true);
    }
  });

  it("accepte une voie préparée suivie d’une garde collective", () => {
    expect(
      valider([
        fait("couronne.tete-de-ligne.atelier-commun", 100),
        fait("couronne.approches.berceau-amorce", 120),
        fait("couronne.ouverture.rail-ouverte", 200, [
          cout("materiaux", -2),
        ]),
        fait("couronne.ouverture.clef-collective", 220),
      ]),
    ).toBe(true);
  });

  it("refuse les ouvertures sans acteurs ou sans ressources antérieures", () => {
    expect(
      valider([
        fait("couronne.ouverture.rail-ouverte", 200, [
          cout("materiaux", -6),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.tete-de-ligne.atelier-commun", 100),
        fait("test.materiaux-epuises", 150, [
          cout("materiaux", -84),
        ]),
        fait("couronne.ouverture.rail-ouverte", 200, [
          cout("materiaux", -6),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.tete-de-ligne.atelier-commun", 100),
        fait("couronne.ouverture.rail-ouverte", 200, [
          cout("materiaux", -1),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.tete-de-ligne.atelier-commun", 100),
        fait("couronne.approches.berceau-amorce", 120),
        fait("couronne.ouverture.rail-ouverte", 200, [
          cout("materiaux", -6),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.tete-de-ligne.atelier-commun", 100),
        fait("couronne.ouverture.rail-ouverte", 200, [
          cout("materiaux", -2),
        ]),
      ]),
    ).toBe(false);
  });

  it("accepte toujours la brèche mais refuse deux ouvertures", () => {
    expect(
      valider([
        fait("couronne.ouverture.breche-ouverte", 200),
        fait("couronne.ouverture.clef-collective", 220),
      ]),
    ).toBe(true);
    expect(
      valider([
        fait("couronne.ouverture.breche-ouverte", 200),
        fait("couronne.tete-de-ligne.atelier-commun", 210),
        fait("couronne.ouverture.rail-ouverte", 220, [
          cout("materiaux", -6),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.ouverture.breche-ouverte", 200, [
          cout("eau", 100),
        ]),
      ]),
    ).toBe(false);
  });

  it("refuse une garde personnelle sans garde antérieure des plans ou du registre", () => {
    expect(
      valider([
        fait("couronne.ouverture.breche-ouverte", 200),
        fait(
          "couronne.ouverture.clef-confiee-aux-gardiennes",
          220,
        ),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait(
          "couronne.approches.plans-confies-a-ilyana",
          100,
        ),
        fait("couronne.ouverture.breche-ouverte", 200),
        fait(
          "couronne.ouverture.clef-confiee-aux-gardiennes",
          220,
        ),
      ]),
    ).toBe(true);
  });
});
