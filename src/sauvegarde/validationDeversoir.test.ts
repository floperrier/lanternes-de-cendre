import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  type FaitDeCampagne,
} from "../simulation/campagne";
import { lireEtatCourant } from "./validation";

function campagneAuTempsDuDeversoir() {
  return appliquerCommande(creerCampagneInitiale("CENDRE-FORGE"), {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 780,
  }).etat;
}

function faitDePassageForge(moment: number): FaitDeCampagne {
  return {
    id: "bassins.deversoir.passage-prepare",
    cause: "bassins.deversoir.le-passage-sans-retour",
    acteurs: ["porte-lanterne", "delegues-des-colonies", "ilyana-voss"],
    cible: "passage-vers-la-trame",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

describe("causalité narrative du Déversoir sauvegardé", () => {
  it("refuse le Passage actif forgé hors du Déversoir Noir", () => {
    const etat = campagneAuTempsDuDeversoir();
    expect(lireEtatCourant(etat)).toBeDefined();

    expect(
      lireEtatCourant({
        ...etat,
        narration: {
          ...etat.narration,
          evenementActif:
            "bassins.deversoir.le-passage-sans-retour",
        },
      }),
    ).toBeUndefined();
  });

  it("refuse aussi un Passage prétendument joué hors du Déversoir", () => {
    const etat = campagneAuTempsDuDeversoir();
    const fait = faitDePassageForge(etat.tempsDuConvoi.secondes);

    expect(
      lireEtatCourant({
        ...etat,
        narration: {
          evenementActif: null,
          evenementsJoues: [
            ...etat.narration.evenementsJoues,
            "bassins.deversoir.le-passage-sans-retour",
          ],
          faitsDeCampagne: [...etat.narration.faitsDeCampagne, fait],
        },
      }),
    ).toBeUndefined();
  });
});
