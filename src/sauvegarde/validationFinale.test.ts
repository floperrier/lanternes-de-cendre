import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import type {
  EffetHumainDeFait,
  EffetMaterielDeFait,
} from "../simulation/faits";
import {
  contratFinalEstCausal,
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
const eau = (variation: number): EffetMaterielDeFait => ({
  type: "stock.modifie",
  stock: "eau",
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
  return contratFinalEstCausal(
    faits,
    etat.infrastructure,
    etat.routes,
    etat.expeditions,
    etat.hautPuits,
    etat.veilleBasse,
    habitantsCourants,
  );
}

describe("validation causale du contrat final", () => {
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

  it("accepte les coûts exacts des Réaccords préparé et risqué", () => {
    expect(
      valider([
        fait("couronne.approches.etalon-calibre", 50),
        fait("couronne.tete-de-ligne.atelier-commun", 55),
        fait("couronne.colonies.voie-alliee-preparee", 60),
        fait("trame.aiguillage-zero.charte-partagee", 70),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.reaccord.selection-preparee", 300, [
          eau(-4),
          materiaux(-4),
        ]),
        fait("finale.reaccord.constellation", 400),
      ]),
    ).toBe(true);
    expect(
      valider([
        fait("couronne.approches.etalon-calibre", 50),
        fait("finale.contrat.causes-consignees", 200),
        fait("finale.reaccord.selection-risquee", 300, [
          eau(-10),
          materiaux(-8),
        ]),
        fait("finale.reaccord.veilles-dispersees", 400),
      ]),
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

  it("rejette un Réaccord impossible, un coût falsifié et un propriétaire sans mandat", () => {
    expect(
      valider([
        fait("couronne.approches.etalon-calibre", 50),
        fait("couronne.ouverture.breche-ouverte", 80),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.reaccord.selection-risquee", 300, [
          eau(-10),
          materiaux(-8),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.approches.etalon-calibre", 50),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.reaccord.selection-risquee", 300, [
          eau(-9),
          materiaux(-8),
        ]),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.approches.etalon-calibre", 50),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.reaccord.selection-risquee", 300, [
          eau(-10),
          materiaux(-8),
        ]),
        fait("finale.reaccord.reseau-de-fer", 400),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.approches.etalon-calibre", 50),
        fait("couronne.tete-de-ligne.atelier-commun", 60),
        fait("couronne.tete-de-ligne.mandat-republicain", 70),
        fait("finale.contrat.causes-publiees", 200),
        fait("finale.reaccord.selection-preparee", 300, [
          eau(-4),
          materiaux(-4),
        ]),
        fait("finale.reaccord.reseau-de-fer", 400),
      ]),
    ).toBe(true);
  });

  it("accepte les coûts exacts des Précipitations préparée et risquée", () => {
    expect(
      valider([
        fait("couronne.approches.precipitateur-assemble", 20),
        fait("couronne.approches.socles-cartographies", 30),
        fait("bassins.deversoir.ligne-zero-relevee", 40),
        fait("bassins.haut-puits.panache-confine", 50),
        fait("bassins.haut-puits.decanteur-documente", 60),
        fait("bassins.haut-puits.pacte-partage", 70),
        fait("finale.contrat.causes-publiees", 200),
        fait(
          "finale.precipitation.selection-preparee",
          300,
          [eau(-6), materiaux(-6)],
        ),
        fait("finale.precipitation.ciel-rendu", 400),
      ]),
    ).toBe(true);
    expect(
      valider(
        [
          fait("couronne.approches.precipitateur-assemble", 50),
          fait("finale.contrat.causes-consignees", 200),
          fait(
            "finale.precipitation.selection-risquee",
            300,
            [eau(-12), materiaux(-10)],
            [habitants(-6)],
          ),
          fait("finale.precipitation.pluie-noire", 400),
        ],
        178,
      ),
    ).toBe(true);
  });

  it("rejette la Précipitation bréchée, falsifiée ou politiquement impossible", () => {
    const preparation = [
      fait("couronne.approches.precipitateur-assemble", 20),
      fait("couronne.approches.socles-cartographies", 30),
      fait("bassins.deversoir.ligne-zero-relevee", 40),
      fait("bassins.haut-puits.panache-confine", 50),
      fait("bassins.haut-puits.decanteur-documente", 60),
      fait("bassins.haut-puits.pacte-partage", 70),
      fait("finale.contrat.causes-publiees", 200),
    ];
    expect(
      valider([
        ...preparation.slice(0, -1),
        fait("couronne.ouverture.breche-ouverte", 100),
        preparation.at(-1)!,
        fait(
          "finale.precipitation.selection-risquee",
          300,
          [eau(-12), materiaux(-10)],
          [habitants(-6)],
        ),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("finale.contrat.causes-publiees", 200),
        fait(
          "finale.precipitation.selection-risquee",
          300,
          [eau(-11), materiaux(-10)],
          [habitants(-6)],
        ),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("finale.contrat.causes-publiees", 200),
        fait(
          "finale.precipitation.selection-risquee",
          300,
          [eau(-12), materiaux(-10)],
          [habitants(-6)],
        ),
        fait("finale.precipitation.ciel-rendu", 400),
      ]),
    ).toBe(false);
    expect(
      valider([
        ...preparation,
        fait("bassins.conseil.vannes-contraintes", 250),
        fait(
          "finale.precipitation.selection-preparee",
          300,
          [eau(-6), materiaux(-6)],
        ),
        fait("finale.precipitation.ciel-rendu", 400),
      ]),
    ).toBe(false);
    expect(
      valider([
        ...preparation,
        fait(
          "finale.precipitation.selection-preparee",
          300,
          [eau(-6), materiaux(-6)],
        ),
        fait("finale.precipitation.terre-des-sacrifies", 400),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.approches.precipitateur-assemble", 20),
        fait("veille-basse.registres-laisses", 30),
        fait("bassins.deversoir.ligne-zero-relevee", 40),
        fait("bassins.haut-puits.panache-confine", 50),
        fait("bassins.conseil.decanteur-repare", 60),
        fait("bassins.conseil.vannes-contraintes", 70),
        fait("finale.contrat.causes-publiees", 200),
        fait(
          "finale.precipitation.selection-preparee",
          300,
          [eau(-6), materiaux(-6)],
        ),
        fait("finale.precipitation.terre-des-sacrifies", 400),
      ]),
    ).toBe(true);
  });
});
