import {
  COMPAGNON_DE_REFERENCE,
  FAIT_D_AFFECTATION_DU_COMPAGNON,
  FAITS_DE_DECISION_DU_CONSEIL_DES_VANNES,
  IDENTIFIANT_DU_CONSEIL_DES_VANNES,
  PREMIER_CONSEIL,
  type CommandeDAffectationDeCompagnon,
  type CommandeDeDecisionDuConseil,
} from "../simulation/conseil";
import type { FaitDeCampagne } from "../simulation/faits";
import { QUARTIER_INTENDANCE, trouverQuartierMobileCanonique } from "../simulation/quartiers";
import type {
  EtatDesRoutes,
  IdentifiantDeLieu,
} from "../simulation/routes";

type ObjetInconnu = Record<string, unknown>;

function estObjet(valeur: unknown): valeur is ObjetInconnu {
  return valeur !== null && typeof valeur === "object" && !Array.isArray(valeur);
}

const FAITS_DE_DECISION = PREMIER_CONSEIL.sujets.flatMap((sujet) =>
  sujet.decisions.map((decision) => decision.faitProduit),
);
const DECISIONS_DU_CONSEIL_DES_VANNES = [
  {
    id: "partager-reserves",
    faitProduit: "bassins.conseil.reserves-partagees",
  },
  {
    id: "reparer-decanteur",
    faitProduit: "bassins.conseil.decanteur-repare",
  },
  {
    id: "reorienter-cohorte",
    faitProduit: "bassins.conseil.cohorte-reorientee",
  },
  {
    id: "contraindre-vannes",
    faitProduit: "bassins.conseil.vannes-contraintes",
  },
] as const;

export const IDENTIFIANTS_DE_FAITS_DU_CONSEIL = Object.freeze([
  FAIT_D_AFFECTATION_DU_COMPAGNON.id,
  ...FAITS_DE_DECISION,
  ...FAITS_DE_DECISION_DU_CONSEIL_DES_VANNES,
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
  if (valeur.conseilId === IDENTIFIANT_DU_CONSEIL_DES_VANNES) {
    return (
      valeur.sujetId === "eau-cohorte-et-deversoir" &&
      DECISIONS_DU_CONSEIL_DES_VANNES.some(
        (decision) => decision.id === valeur.decisionId,
      )
    );
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
  const faitRegional = FAITS_DE_DECISION_DU_CONSEIL_DES_VANNES.includes(
    String(estObjet(valeur) ? valeur.id : "") as never,
  );
  if (
    !estObjet(valeur) ||
    typeof valeur.id !== "string" ||
    !Number.isInteger(valeur.moment) ||
    (valeur.moment as number) < 0 ||
    !Array.isArray(valeur.acteurs) ||
    valeur.acteurs.length !== 2 ||
    valeur.acteurs[0] !== "porte-lanterne" ||
    valeur.acteurs[1] !== COMPAGNON_DE_REFERENCE.id ||
    (faitRegional
      ? valeur.cible !== "conseil-des-vannes"
      : valeur.cible !== QUARTIER_INTENDANCE.id ||
        trouverQuartierMobileCanonique(String(valeur.cible))?.occupation
          .type !== "tete-de-quartier") ||
    !effetsSontVides(valeur.effets)
  ) {
    return false;
  }
  if (valeur.id === FAIT_D_AFFECTATION_DU_COMPAGNON.id) {
    return valeur.cause === FAIT_D_AFFECTATION_DU_COMPAGNON.cause;
  }
  if (faitRegional) {
    return valeur.cause === IDENTIFIANT_DU_CONSEIL_DES_VANNES;
  }
  return (
    FAITS_DE_DECISION.includes(valeur.id as never) &&
    valeur.cause === PREMIER_CONSEIL.id
  );
}

export function estCausaliteDuConseilValide(
  faits: readonly FaitDeCampagne[],
  routes: EtatDesRoutes,
  secondeCourante: number,
): boolean {
  const affectations = faits.filter(
    (fait) => fait.id === FAIT_D_AFFECTATION_DU_COMPAGNON.id,
  );
  const decisions = faits.filter((fait) =>
    FAITS_DE_DECISION.includes(fait.id as never),
  );
  const decisionsRegionales = faits.filter((fait) =>
    FAITS_DE_DECISION_DU_CONSEIL_DES_VANNES.includes(fait.id as never),
  );
  if (
    affectations.length > 1 ||
    decisions.length > 1 ||
    decisionsRegionales.length > 1
  ) {
    return false;
  }
  if (decisions.length === 0 && decisionsRegionales.length === 0) {
    return true;
  }
  const indexAffectation = faits.indexOf(affectations[0]!);
  const decisionsOntUneAffectationAnterieure = decisions.every(
    (decision) => {
    const indexDecision = faits.indexOf(decision);
    return (
      affectations.length === 1 &&
      indexAffectation < indexDecision &&
      affectations[0]!.moment <= decision.moment
    );
    },
  );
  if (!decisionsOntUneAffectationAnterieure) {
    return false;
  }
  if (decisionsRegionales.length === 0) {
    return true;
  }
  const decisionRegionale = decisionsRegionales[0]!;
  const indexDecisionRegionale = faits.indexOf(decisionRegionale);
  const convocation = faits.find(
    (fait) =>
      [
        "bassins.deversoir.conseil-convoque",
        "bassins.deversoir.conseil-public",
      ].includes(fait.id) &&
      faits.indexOf(fait) < indexDecisionRegionale,
  );
  const prerequis = (() => {
    if (decisionRegionale.id === "bassins.conseil.reserves-partagees") {
      return ["bassins.haut-puits.pacte-partage"];
    }
    if (decisionRegionale.id === "bassins.conseil.decanteur-repare") {
      return ["bassins.haut-puits.decanteur-documente"];
    }
    if (decisionRegionale.id === "bassins.conseil.cohorte-reorientee") {
      return [
        "veille-basse.cohorte-accueillie",
        "veille-basse.cohorte-refusee",
        "veille-basse.cohorte-redirigee",
      ];
    }
    return [];
  })();
  const prerequisAnterieur =
    prerequis.length === 0 ||
    faits.some(
      (fait) =>
        prerequis.includes(fait.id) &&
        faits.indexOf(fait) < indexDecisionRegionale &&
        fait.moment <= decisionRegionale.moment,
    );
  const estPresentAuDeversoir = (moment: number): boolean => {
    let position: IdentifiantDeLieu = "halte-du-puits-sec";
    let presentDepuis = 0;
    for (const engagement of routes.engagements) {
      if (
        position === "deversoir-noir" &&
        moment >= presentDepuis &&
        moment <= engagement.engageA
      ) {
        return true;
      }
      if (engagement.statut === "en-cours") {
        return false;
      }
      position = engagement.destination;
      presentDepuis = engagement.arriveeA;
    }
    return (
      position === "deversoir-noir" &&
      moment >= presentDepuis &&
      moment <= secondeCourante
    );
  };
  return (
    convocation !== undefined &&
    convocation.moment <= decisionRegionale.moment &&
    prerequisAnterieur &&
    estPresentAuDeversoir(convocation.moment) &&
    estPresentAuDeversoir(decisionRegionale.moment)
  );
}
