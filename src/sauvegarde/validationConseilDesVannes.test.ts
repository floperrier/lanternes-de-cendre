import { describe, expect, it } from "vitest";

import type { FaitDeCampagne } from "../simulation/faits";
import {
  creerEtatDesRoutesInitial,
  type EtatDesRoutes,
} from "../simulation/routes";
import { estCausaliteDuConseilValide } from "./validation-conseil";

function fait(id: string, moment: number): FaitDeCampagne {
  return {
    id,
    cause: "test",
    acteurs: ["porte-lanterne"],
    cible: "conseil-des-vannes",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function routesAuDeversoir(): EtatDesRoutes {
  const initial = creerEtatDesRoutesInitial();
  return {
    ...initial,
    position: "deversoir-noir",
    engagements: [
      {
        id: "engagement-1",
        tronconId: "conduite-du-deversoir",
        origine: "relais-des-vannes",
        destination: "deversoir-noir",
        engageA: 40,
        arriveeA: 100,
        statut: "termine",
      },
    ],
  };
}

describe("causalité sauvegardée du Conseil des Vannes", () => {
  const faitsCommuns = [
    fait("compagnon.ilyana-voss.affectee-intendance", 0),
    fait("bassins.haut-puits.decanteur-documente", 30),
  ];

  it("accepte une convocation et une décision prises au Déversoir", () => {
    expect(
      estCausaliteDuConseilValide(
        [
          ...faitsCommuns,
          fait("bassins.deversoir.conseil-convoque", 105),
          fait("bassins.conseil.decanteur-repare", 110),
        ],
        routesAuDeversoir(),
        120,
      ),
    ).toBe(true);
  });

  it("refuse une décision forgée avant l’arrivée au Déversoir", () => {
    expect(
      estCausaliteDuConseilValide(
        [
          ...faitsCommuns,
          fait("bassins.deversoir.conseil-convoque", 80),
          fait("bassins.conseil.decanteur-repare", 90),
        ],
        routesAuDeversoir(),
        120,
      ),
    ).toBe(false);
  });
});
