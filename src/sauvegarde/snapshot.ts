import { empreinteEtat, type EtatCampagne } from "../simulation/campagne";
import type {
  ReproductionDeCampagne,
  SauvegardeCampagne,
} from "./types";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";

export function creerSauvegarde(
  etat: EtatCampagne,
  reproduction: ReproductionDeCampagne,
): SauvegardeCampagne {
  const empreinte = empreinteEtat(etat);

  return {
    format: FORMAT_SAUVEGARDE,
    id: `${etat.graine}-${etat.tempsDuConvoi.secondes}-${empreinte}`,
    version: VERSION_SAUVEGARDE_COURANTE,
    versions: VERSIONS_DU_SNAPSHOT_COURANT,
    graine: etat.graine,
    horloge: {
      secondes: etat.tempsDuConvoi.secondes,
    },
    etat,
    reproduction,
    empreinte,
  };
}
