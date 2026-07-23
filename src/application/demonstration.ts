import type { Langue } from "../content/types";
import type { EtatCampagne } from "../simulation/campagne";
import {
  compagnonEstAffecte,
  conseilEstTermine,
} from "../simulation/conseil";
import { IDENTIFIANTS_DE_FAITS_D_INCIDENT } from "../simulation/faits";

export const EVENEMENTS_DE_LA_DEMONSTRATION = [
  "prologue.signaux-sous-la-cendre",
  "prologue.reponse-du-phare",
  "prologue.filtres-de-la-veille",
  "prologue.ilyana-au-clapet",
  "bassins-fendus.eau-de-haut-puits",
] as const;

const TEXTES_DU_JALON_FINAL = {
  fr: {
    titre: "La route continue",
    explication:
      "La Démonstration s’achève avant le deuxième Tronçon. La même Campagne pourra continuer avec l’Accès premium, sans recommencer.",
  },
  en: {
    titre: "The road continues",
    explication:
      "The Demonstration ends before the second Route Segment. The same Campaign can continue with Premium Access, without starting over.",
  },
} as const;

export interface ProjectionDeDemonstration {
  readonly graineRepresentative: "CENDRE-01";
  readonly terminee: boolean;
  readonly jalonFinal: {
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
  const incidentOuCriseEstTraverse = faits.some(
    (fait) =>
      IDENTIFIANTS_DE_FAITS_D_INCIDENT.includes(fait.id as never) ||
      fait.id.startsWith("crise."),
  );
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
    jalonFinal: terminee ? TEXTES_DU_JALON_FINAL[langue] : null,
  };
}
