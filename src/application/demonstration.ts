import type { Langue } from "../content/types";
import { catalogueDEvenements } from "../content/catalogue";
import type { EtatCampagne } from "../simulation/campagne";
import {
  compagnonEstAffecte,
  conseilEstTermine,
} from "../simulation/conseil";
import { estFaitDIncidentOuDeCrise } from "../simulation/faits";

export const EVENEMENTS_DE_LA_DEMONSTRATION = [
  "prologue.signaux-sous-la-cendre",
  "prologue.reponse-du-phare",
  "prologue.filtres-de-la-veille",
  "prologue.ilyana-au-clapet",
  "bassins-fendus.eau-de-haut-puits",
] as const;

export interface ProjectionDeDemonstration {
  readonly graineRepresentative: "CENDRE-01";
  readonly terminee: boolean;
  readonly jalonFinal: {
    readonly surtitre: string;
    readonly titre: string;
    readonly explication: string;
  } | null;
}

export function projeterDemonstration(
  etat: EtatCampagne,
  langue: Langue = "fr",
): ProjectionDeDemonstration {
  const faits = etat.narration.faitsDeCampagne;
  const tousLesEvenementsSontJoues = EVENEMENTS_DE_LA_DEMONSTRATION.every(
    (evenementId) => etat.narration.evenementsJoues.includes(evenementId),
  );
  const premierTronconEstTermine =
    etat.routes.jalons.length === 1 &&
    etat.routes.engagements[0]?.statut === "termine";
  const expeditionEstTerminee = etat.expeditions.operations.some(
    (expedition) => expedition.statut === "terminee",
  );
  const incidentOuCriseEstTraverse = faits.some(estFaitDIncidentOuDeCrise);
  const interventionDuCompagnonEstFaite =
    compagnonEstAffecte(faits) && conseilEstTermine(faits);
  const terminee =
    tousLesEvenementsSontJoues &&
    premierTronconEstTermine &&
    expeditionEstTerminee &&
    incidentOuCriseEstTraverse &&
    interventionDuCompagnonEstFaite;

  return {
    graineRepresentative: "CENDRE-01",
    terminee,
    jalonFinal: terminee
      ? catalogueDEvenements.libellesTransversaux[langue].demonstration
      : null,
  };
}
