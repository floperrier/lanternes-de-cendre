import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import type {
  EffetHumainDeFait,
  EffetMaterielDeFait,
} from "../simulation/faits";
import {
  ancrageFinalEstCausal,
  type ObjetInconnu,
} from "./validation";

function fait(
  id: string,
  moment: number,
  materiels: readonly EffetMaterielDeFait[] = [],
  humains: readonly EffetHumainDeFait[] = [],
): ObjetInconnu {
  return {
    id,
    cause: `test.${id}`,
    acteurs: ["porte-lanterne", "equipes-de-l-anneau"],
    cible: "coeur-du-noeud",
    moment,
    effets: { materiels, humains },
  };
}

const materiaux = (variation: number): EffetMaterielDeFait => ({
  type: "stock.modifie",
  stock: "materiaux",
  variation,
});
const habitants = (variation: number): EffetHumainDeFait => ({
  type: "habitants.modifies",
  variation,
});

function valider(
  faits: readonly ObjetInconnu[],
  habitantsCourants = 184,
): boolean {
  const etat = creerCampagneInitiale("CENDRE-VALIDATION-FINALE");
  return ancrageFinalEstCausal(
    faits,
    etat.infrastructure,
    etat.routes,
    etat.expeditions,
    etat.hautPuits,
    etat.veilleBasse,
    habitantsCourants,
  );
}

describe("validation causale de l’Ancrage final", () => {
  it("accepte les coûts exacts des Ancrages préparé et risqué", () => {
    expect(
      valider([
        fait("couronne.approches.berceau-amorce", 100),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.ancrage.selection-preparee", 300, [
          materiaux(-4),
        ]),
      ]),
    ).toBe(true);
    expect(
      valider(
        [
          fait("couronne.ouverture.breche-ouverte", 100),
          fait("finale.contrat.causes-consignees", 200),
          fait(
            "finale.ancrage.selection-risquee",
            300,
            [materiaux(-10)],
            [habitants(-8)],
          ),
        ],
        176,
      ),
    ).toBe(true);
  });

  it("rejette une branche inversée, dupliquée, sous-financée ou falsifiée", () => {
    expect(
      valider([
        fait("couronne.approches.berceau-amorce", 100),
        fait("finale.ancrage.selection-preparee", 200, [
          materiaux(-4),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("finale.contrat.causes-publiees", 100),
        fait("finale.contrat.causes-consignees", 110),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.approches.berceau-amorce", 100),
        fait("test.epuisement", 150, [materiaux(-84)]),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.ancrage.selection-preparee", 300, [
          materiaux(-4),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.ouverture.breche-ouverte", 100),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.ancrage.selection-preparee", 300, [
          materiaux(-4),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("finale.contrat.causes-publiees", 100),
        fait(
          "finale.ancrage.selection-risquee",
          200,
          [materiaux(-9)],
          [habitants(-8)],
        ),
      ]),
    ).toBe(false);
  });

  it("n’accepte que les variantes rendues crédibles par l’historique", () => {
    const preparation = [
      fait("couronne.approches.berceau-amorce", 100),
      fait("finale.contrat.causes-publiees", 200),
      fait("finale.ancrage.selection-preparee", 300, [
        materiaux(-4),
      ]),
    ];
    expect(
      valider([
        ...preparation,
        fait("finale.ancrage.refuge-commun", 400),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.ouverture.clef-collective", 80),
        fait("trame.aiguillage-zero.charte-partagee", 90),
        ...preparation,
        fait("finale.ancrage.refuge-commun", 400),
      ]),
    ).toBe(true);
    expect(
      valider([
        ...preparation,
        fait("finale.ancrage.citadelle-de-cendre", 400),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.tete-de-ligne.mandat-republicain", 80),
        ...preparation,
        fait("finale.ancrage.citadelle-de-cendre", 400),
      ]),
    ).toBe(true);
    expect(
      valider([
        ...preparation,
        fait("finale.ancrage.dernier-rempart", 400),
      ]),
    ).toBe(true);
  });
});
