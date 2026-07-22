import {
  COMPAGNON_DE_REFERENCE,
  FAIT_D_AFFECTATION_DU_COMPAGNON,
  PREMIER_CONSEIL,
  type CommandeDAffectationDeCompagnon,
  type CommandeDeDecisionDuConseil,
} from "../simulation/conseil";
import type { FaitDeCampagne } from "../simulation/faits";
import { QUARTIER_INTENDANCE, trouverQuartierMobileCanonique } from "../simulation/quartiers";

type ObjetInconnu = Record<string, unknown>;

function estObjet(valeur: unknown): valeur is ObjetInconnu {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

const FAITS_DE_DECISION = PREMIER_CONSEIL.sujets.flatMap((sujet) =>
  sujet.decisions.map((decision) => decision.faitProduit),
);

export const IDENTIFIANTS_DE_FAITS_DU_CONSEIL = Object.freeze([
  FAIT_D_AFFECTATION_DU_COMPAGNON.id,
  ...FAITS_DE_DECISION,
]);

export function estCommandeDuConseil(
  valeur: unknown,
): valeur is CommandeDAffectationDeCompagnon | CommandeDeDecisionDuConseil {
  if (!estObjet(valeur)) {
    return false;
  }
  if (valeur.type === "compagnon.affecter") {
    return (
      valeur.compagnonId === COMPAGNON_DE_REFERENCE.id &&
      valeur.quartierId === QUARTIER_INTENDANCE.id &&
      trouverQuartierMobileCanonique(String(valeur.quartierId))?.occupation
        .type === "tete-de-quartier"
    );
  }
  if (valeur.type !== "conseil.decider") {
    return false;
  }
  const sujet = PREMIER_CONSEIL.sujets.find(
    (candidat) => candidat.id === valeur.sujetId,
  );
  return (
    valeur.conseilId === PREMIER_CONSEIL.id &&
    sujet !== undefined &&
    sujet.decisions.some((decision) => decision.id === valeur.decisionId)
  );
}

export function estIdentifiantDeFaitDuConseil(id: string): boolean {
  return IDENTIFIANTS_DE_FAITS_DU_CONSEIL.includes(id as never);
}

function effetsSontVides(valeur: unknown): boolean {
  return (
    estObjet(valeur) &&
    Array.isArray(valeur.materiels) &&
    valeur.materiels.length === 0 &&
    Array.isArray(valeur.humains) &&
    valeur.humains.length === 0
  );
}

export function estFaitDuConseil(valeur: unknown): boolean {
  if (
    !estObjet(valeur) ||
    typeof valeur.id !== "string" ||
    !Number.isInteger(valeur.moment) ||
    (valeur.moment as number) < 0 ||
    !Array.isArray(valeur.acteurs) ||
    valeur.acteurs.length !== 2 ||
    valeur.acteurs[0] !== "porte-lanterne" ||
    valeur.acteurs[1] !== COMPAGNON_DE_REFERENCE.id ||
    valeur.cible !== QUARTIER_INTENDANCE.id ||
    trouverQuartierMobileCanonique(String(valeur.cible))?.occupation.type !==
      "tete-de-quartier" ||
    !effetsSontVides(valeur.effets)
  ) {
    return false;
  }
  if (valeur.id === FAIT_D_AFFECTATION_DU_COMPAGNON.id) {
    return valeur.cause === FAIT_D_AFFECTATION_DU_COMPAGNON.cause;
  }
  return (
    FAITS_DE_DECISION.includes(valeur.id as never) &&
    valeur.cause === PREMIER_CONSEIL.id
  );
}

export function estCausaliteDuConseilValide(
  faits: readonly FaitDeCampagne[],
): boolean {
  const affectations = faits.filter(
    (fait) => fait.id === FAIT_D_AFFECTATION_DU_COMPAGNON.id,
  );
  const decisions = faits.filter((fait) =>
    FAITS_DE_DECISION.includes(fait.id as never),
  );
  if (affectations.length > 1 || decisions.length > 1) {
    return false;
  }
  if (decisions.length === 0) {
    return true;
  }
  const indexAffectation = faits.indexOf(affectations[0]!);
  const indexDecision = faits.indexOf(decisions[0]!);
  return (
    affectations.length === 1 &&
    indexAffectation < indexDecision &&
    affectations[0]!.moment <= decisions[0]!.moment
  );
}
