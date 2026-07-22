import { catalogueDEvenements } from "../content/catalogue";
import type { FaitDeCampagne } from "./faits";
import { QUARTIER_INTENDANCE, trouverQuartierMobileCanonique } from "./quartiers";

const conseilCompile = catalogueDEvenements.conseils[0];
if (conseilCompile === undefined) {
  throw new Error("Le catalogue doit contenir le premier Conseil.");
}
if (
  conseilCompile.compagnon.affectation.quartier !== QUARTIER_INTENDANCE.id ||
  conseilCompile.compagnon.affectation.occupation !==
    QUARTIER_INTENDANCE.occupation.type
) {
  throw new Error("Ilyana doit occuper la tête de l’Intendance.");
}

export const COMPAGNON_DE_REFERENCE = Object.freeze({
  id: conseilCompile.compagnon.id,
  nom: conseilCompile.textes.fr.compagnon.nom.modele,
  competences: conseilCompile.compagnon.competences,
  trait: conseilCompile.compagnon.trait,
  conviction: conseilCompile.compagnon.conviction,
  projet: conseilCompile.compagnon.projet,
  etatPersonnel: conseilCompile.compagnon.etatPersonnel,
});

export const FAIT_D_AFFECTATION_DU_COMPAGNON = Object.freeze({
  id: conseilCompile.compagnon.affectation.faitProduit,
  cause: conseilCompile.compagnon.affectation.cause,
  acteurs: ["porte-lanterne", COMPAGNON_DE_REFERENCE.id] as const,
  cible: conseilCompile.compagnon.affectation.quartier,
});

export const PREMIER_CONSEIL = conseilCompile;

export interface CommandeDAffectationDeCompagnon {
  readonly type: "compagnon.affecter";
  readonly compagnonId: string;
  readonly quartierId: string;
}

export interface EvenementDAffectationDeCompagnon {
  readonly type: "compagnon.affectation-confirmee";
  readonly compagnonId: string;
  readonly quartierId: string;
  readonly faitProduit: string;
  readonly moment: number;
}

export interface CommandeDeDecisionDuConseil {
  readonly type: "conseil.decider";
  readonly conseilId: string;
  readonly sujetId: string;
  readonly decisionId: string;
}

export interface EvenementDeDecisionDuConseil {
  readonly type: "conseil.decision-inscrite";
  readonly conseilId: string;
  readonly sujetId: string;
  readonly decisionId: string;
  readonly faitProduit: string;
  readonly moment: number;
}

export const POIDS_DES_CRITERES_DE_PERTINENCE = Object.freeze({
  "affectation-au-quartier": 5,
  "competence-majeure": 4,
  "competence-secondaire": 2,
  "conviction-concernee": 3,
  "enjeu-personnel": 1,
} as const);

export type CritereDePertinence = keyof typeof POIDS_DES_CRITERES_DE_PERTINENCE;

export interface VoixPertinente {
  readonly compagnonId: string;
  readonly criteres: readonly CritereDePertinence[];
}

function calculerPertinence(voix: VoixPertinente): number {
  return voix.criteres.reduce(
    (total, critere) => total + POIDS_DES_CRITERES_DE_PERTINENCE[critere],
    0,
  );
}

export function selectionnerVoixPertinentes<Voix extends VoixPertinente>(
  voix: readonly Voix[],
): readonly Voix[] {
  return [...voix]
    .sort((gauche, droite) => {
      const pertinenceGauche = calculerPertinence(gauche);
      const pertinenceDroite = calculerPertinence(droite);
      if (pertinenceGauche !== pertinenceDroite) {
        return pertinenceDroite - pertinenceGauche;
      }
      return gauche.compagnonId < droite.compagnonId
        ? -1
        : gauche.compagnonId > droite.compagnonId
          ? 1
          : 0;
    })
    .slice(0, 2);
}

export function compagnonEstAffecte(
  faits: readonly FaitDeCampagne[],
): boolean {
  return faits.some(
    (fait) => fait.id === FAIT_D_AFFECTATION_DU_COMPAGNON.id,
  );
}

export function conseilEstTermine(
  faits: readonly FaitDeCampagne[],
): boolean {
  const identifiantsDesDecisions = PREMIER_CONSEIL.sujets.flatMap((sujet) =>
    sujet.decisions.map((decision) => decision.faitProduit),
  );
  return faits.some((fait) =>
    identifiantsDesDecisions.includes(fait.id as never),
  );
}

export function affecterCompagnon(
  faits: readonly FaitDeCampagne[],
  commande: CommandeDAffectationDeCompagnon,
  moment: number,
): {
  readonly faitProduit: FaitDeCampagne;
  readonly evenement: EvenementDAffectationDeCompagnon;
} {
  if (
    commande.compagnonId !== COMPAGNON_DE_REFERENCE.id ||
    commande.quartierId !== QUARTIER_INTENDANCE.id ||
    trouverQuartierMobileCanonique(commande.quartierId)?.occupation.type !==
      "tete-de-quartier"
  ) {
    throw new Error("Cette Affectation de Compagnon est inconnue.");
  }
  if (compagnonEstAffecte(faits)) {
    throw new Error(`${COMPAGNON_DE_REFERENCE.nom} est déjà affectée.`);
  }

  const faitProduit: FaitDeCampagne = {
    ...FAIT_D_AFFECTATION_DU_COMPAGNON,
    moment,
    effets: { materiels: [], humains: [] },
  };

  return {
    faitProduit,
    evenement: {
      type: "compagnon.affectation-confirmee",
      compagnonId: commande.compagnonId,
      quartierId: commande.quartierId,
      faitProduit: FAIT_D_AFFECTATION_DU_COMPAGNON.id,
      moment,
    },
  };
}

export function deciderAuConseil(
  faits: readonly FaitDeCampagne[],
  commande: CommandeDeDecisionDuConseil,
  moment: number,
): {
  readonly faitProduit: FaitDeCampagne;
  readonly evenement: EvenementDeDecisionDuConseil;
} {
  if (!compagnonEstAffecte(faits)) {
    throw new Error(
      "L’Affectation d’Ilyana à l’Intendance est requise.",
    );
  }
  if (conseilEstTermine(faits)) {
    throw new Error("Ce Conseil possède déjà une décision.");
  }

  const sujet = PREMIER_CONSEIL.sujets.find(
    (candidat) => candidat.id === commande.sujetId,
  );
  const decision = sujet?.decisions.find(
    (candidate) => candidate.id === commande.decisionId,
  );
  if (
    commande.conseilId !== PREMIER_CONSEIL.id ||
    sujet === undefined ||
    decision === undefined
  ) {
    throw new Error("Cette décision du Conseil est inconnue.");
  }

  const faitProduit: FaitDeCampagne = {
    id: decision.faitProduit,
    cause: PREMIER_CONSEIL.id,
    acteurs: ["porte-lanterne", COMPAGNON_DE_REFERENCE.id],
    cible: QUARTIER_INTENDANCE.id,
    moment,
    effets: { materiels: [], humains: [] },
  };

  return {
    faitProduit,
    evenement: {
      type: "conseil.decision-inscrite",
      conseilId: commande.conseilId,
      sujetId: commande.sujetId,
      decisionId: commande.decisionId,
      faitProduit: decision.faitProduit,
      moment,
    },
  };
}
