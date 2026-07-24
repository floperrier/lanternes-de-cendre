import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import type { EffetMaterielDeFait } from "../simulation/faits";
import {
  type ObjetInconnu,
  voieDesColoniesEstCausale,
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
    cible: "serres-de-verre",
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

function contexte(prepare: boolean) {
  const etat = creerCampagneInitiale("CENDRE-VALIDATION-COLONIES");
  if (!prepare) {
    return etat;
  }
  return {
    ...etat,
    hautPuits: {
      ...etat.hautPuits,
      relationPublique: "cooperative" as const,
    },
    veilleBasse: {
      ...etat.veilleBasse,
      colonie: {
        ...etat.veilleBasse.colonie,
        statut: "stable" as const,
        techniciens: {
          ...etat.veilleBasse.colonie.techniciens,
          equipesDisponibles: 1,
        },
      },
      cohorte: {
        ...etat.veilleBasse.cohorte,
        integration: {
          ...etat.veilleBasse.cohorte.integration,
          statut: "equipes-integrees" as const,
          equipesIntegrees: 2,
        },
      },
    },
    trameDeFer: {
      ...etat.trameDeFer,
      relationRepublique: "cooperative" as const,
      grandAiguillage: {
        ...etat.trameDeFer.grandAiguillage,
        statut: "atelier-negocie" as const,
      },
    },
    traverseLibre: {
      ...etat.traverseLibre,
      statut: "autonome" as const,
      relationPuitsLibres: "cooperative" as const,
    },
  };
}

function valider(
  faits: readonly ObjetInconnu[],
  prepare = true,
): boolean {
  const etat = contexte(prepare);
  return voieDesColoniesEstCausale(
    faits,
    etat.infrastructure,
    etat.routes,
    etat.expeditions,
    etat.hautPuits,
    etat.veilleBasse,
    etat.trameDeFer,
    etat.traverseLibre,
  );
}

describe("validation causale de la voie des Colonies", () => {
  it("exige alliances, équipes, Eau et Matériaux avant la coalition", () => {
    const coalition = fait(
      "couronne.serres-de-verre.coalition-ralliee",
      200,
      [cout("eau", -10), cout("materiaux", -8)],
    );
    expect(valider([coalition])).toBe(true);
    expect(valider([coalition], false)).toBe(false);
    expect(
      valider([
        fait("test.pieces-epuisees", 100, [
          cout("materiaux", -80),
        ]),
        coalition,
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("test.eau-epuisee", 100, [cout("eau", -755)]),
        coalition,
      ]),
    ).toBe(false);
  });

  it("refuse les techniciens fantômes d’une Veille-Basse perdue", () => {
    const etat = contexte(true);
    const initial = creerCampagneInitiale(
      "CENDRE-VALIDATION-SANS-FANTOMES",
    );
    const coalition = fait(
      "couronne.serres-de-verre.coalition-ralliee",
      200,
      [cout("eau", -10), cout("materiaux", -8)],
    );
    const veillePerdue = {
      ...etat.veilleBasse,
      colonie: {
        ...etat.veilleBasse.colonie,
        statut: "perdue" as const,
        techniciens: {
          ...etat.veilleBasse.colonie.techniciens,
          equipesDisponibles: 2,
        },
      },
      cohorte: {
        ...etat.veilleBasse.cohorte,
        integration: initial.veilleBasse.cohorte.integration,
      },
    };

    expect(
      voieDesColoniesEstCausale(
        [coalition],
        etat.infrastructure,
        etat.routes,
        etat.expeditions,
        etat.hautPuits,
        veillePerdue,
        etat.trameDeFer,
        etat.traverseLibre,
      ),
    ).toBe(false);
  });

  it("refuse l’achat sans Eau et la voie alliée sans coalition antérieure", () => {
    expect(
      valider([
        fait("test.eau-epuisee", 100, [cout("eau", -758)]),
        fait(
          "couronne.seuil.dernieres-pieces-achetees",
          200,
          [cout("eau", -4), cout("materiaux", 4)],
        ),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait("couronne.colonies.voie-alliee-preparee", 300),
      ]),
    ).toBe(false);
    expect(
      valider([
        fait(
          "couronne.serres-de-verre.coalition-ralliee",
          200,
          [cout("eau", -10), cout("materiaux", -8)],
        ),
        fait("couronne.colonies.voie-alliee-preparee", 300),
      ]),
    ).toBe(true);
  });
});
