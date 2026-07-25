import { VERSION_SIMULATION_COURANTE } from "../simulation/versions";
import { rejouerReproduction } from "./replay";
import type { SauvegardeCampagne } from "./types";
import {
  VERSION_CONTENU_COURANTE,
  VERSION_SAUVEGARDE_COURANTE,
} from "./version";

const FORMAT_CAPSULE_SUPPORT =
  "lanternes-de-cendre.capsule-support" as const;

export interface CapsuleDeSupport {
  readonly format: typeof FORMAT_CAPSULE_SUPPORT;
  readonly version: 1;
  readonly diagnostic: {
    readonly replay: "termine";
    readonly empreinte: string;
    readonly versions: {
      readonly sauvegarde: number;
      readonly simulation: number;
      readonly contenu: number;
    };
  };
  readonly sauvegarde: SauvegardeCampagne;
}

export function creerCapsuleDeSupport(
  sauvegarde: SauvegardeCampagne,
): string {
  const replay = rejouerReproduction(sauvegarde.reproduction);
  if (
    replay.statut !== "termine" ||
    replay.empreinte !== sauvegarde.empreinte
  ) {
    throw new Error("capsule-support-replay-divergent");
  }

  const capsule: CapsuleDeSupport = {
    format: FORMAT_CAPSULE_SUPPORT,
    version: 1,
    diagnostic: {
      replay: "termine",
      empreinte: sauvegarde.empreinte,
      versions: {
        sauvegarde: VERSION_SAUVEGARDE_COURANTE,
        simulation: VERSION_SIMULATION_COURANTE,
        contenu: VERSION_CONTENU_COURANTE,
      },
    },
    sauvegarde,
  };
  return JSON.stringify(capsule);
}
