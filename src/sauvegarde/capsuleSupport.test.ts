import { describe, expect, it } from "vitest";

import { creerCampagneInitiale } from "../simulation/campagne";
import {
  VERSION_SIMULATION_COURANTE,
} from "../simulation/versions";
import { creerReproductionInitiale } from "./replay";
import { creerSauvegarde } from "./snapshot";
import { creerCapsuleDeSupport } from "./capsuleSupport";
import { VERSION_SAUVEGARDE_COURANTE } from "./version";

describe("capsule de support", () => {
  it("réunit versions, empreinte et reproduction vérifiée sans identité commerciale", () => {
    const etat = creerCampagneInitiale("CENDRE-SUPPORT");
    const sauvegarde = creerSauvegarde(
      etat,
      creerReproductionInitiale(etat),
    );

    const capsule = JSON.parse(creerCapsuleDeSupport(sauvegarde)) as {
      readonly format: string;
      readonly version: number;
      readonly diagnostic: {
        readonly replay: string;
        readonly empreinte: string;
        readonly versions: {
          readonly sauvegarde: number;
          readonly simulation: number;
        };
      };
      readonly sauvegarde: unknown;
    };

    expect(capsule).toMatchObject({
      format: "lanternes-de-cendre.capsule-support",
      version: 1,
      diagnostic: {
        replay: "termine",
        empreinte: sauvegarde.empreinte,
        versions: {
          sauvegarde: VERSION_SAUVEGARDE_COURANTE,
          simulation: VERSION_SIMULATION_COURANTE,
        },
      },
      sauvegarde,
    });
    expect(JSON.stringify(capsule)).not.toMatch(
      /email|identiteId|preuveLocale|acces-premium/i,
    );
  });

  it("refuse de produire une capsule dont la reproduction diverge", () => {
    const etat = creerCampagneInitiale("CENDRE-SUPPORT-DIVERGENCE");
    const sauvegarde = creerSauvegarde(
      etat,
      creerReproductionInitiale(etat),
    );

    expect(() =>
      creerCapsuleDeSupport({
        ...sauvegarde,
        reproduction: {
          ...sauvegarde.reproduction,
          empreinteSnapshot: "00000000",
        },
      }),
    ).toThrow("capsule-support-replay-divergent");
  });
});
