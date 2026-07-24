import { catalogueDEvenements, trouverConseil } from "../content/catalogue";
import type { FaitDeCampagne } from "./faits";
import {
  QUARTIER_INTENDANCE,
  trouverQuartierMobileCanonique,
} from "./quartiers";
import type { IdentifiantDeLieu } from "./routes";

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
export const FAIT_D_INDISPONIBILITE_DU_COMPAGNON =
  "compagnon.ilyana-voss.indisponible" as const;

export const PREMIER_CONSEIL = conseilCompile;
export const IDENTIFIANT_DU_CONSEIL_DES_VANNES = "conseil.des-vannes";
export const FAITS_DE_DECISION_DU_CONSEIL_DES_VANNES = Object.freeze([
  "bassins.conseil.reserves-partagees",
  "bassins.conseil.decanteur-repare",
  "bassins.conseil.cohorte-reorientee",
  "bassins.conseil.vannes-contraintes",
] as const);
const FAITS_DE_CONVOCATION_DU_CONSEIL_DES_VANNES = [
  "bassins.deversoir.conseil-convoque",
  "bassins.deversoir.conseil-public",
] as const;

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

export function compagnonEstAffecte(faits: readonly FaitDeCampagne[]): boolean {
  return faits.some((fait) => fait.id === FAIT_D_AFFECTATION_DU_COMPAGNON.id);
}

export function conseilEstTermine(faits: readonly FaitDeCampagne[]): boolean {
  const identifiantsDesDecisions = PREMIER_CONSEIL.sujets.flatMap((sujet) =>
    sujet.decisions.map((decision) => decision.faitProduit),
  );
  return faits.some((fait) =>
    identifiantsDesDecisions.includes(fait.id as never),
  );
}

function idsDesFaits(faits: readonly FaitDeCampagne[]): readonly string[] {
  return faits.map((fait) => fait.id);
}

export function conseilDesVannesEstConvoque(
  faits: readonly FaitDeCampagne[],
): boolean {
  const ids = idsDesFaits(faits);
  return FAITS_DE_CONVOCATION_DU_CONSEIL_DES_VANNES.some((id) =>
    ids.includes(id),
  );
}

export function conseilDesVannesEstTermine(
  faits: readonly FaitDeCampagne[],
): boolean {
  const ids = idsDesFaits(faits);
  return FAITS_DE_DECISION_DU_CONSEIL_DES_VANNES.some((id) => ids.includes(id));
}

export function decisionDuConseilDesVannesEstDisponible(
  decisionId: string,
  faits: readonly FaitDeCampagne[],
): boolean {
  const ids = idsDesFaits(faits);
  if (decisionId === "partager-reserves") {
    return ids.includes("bassins.haut-puits.pacte-partage");
  }
  if (decisionId === "reparer-decanteur") {
    return ids.includes("bassins.haut-puits.decanteur-documente");
  }
  if (decisionId === "reorienter-cohorte") {
    return [
      "veille-basse.cohorte-accueillie",
      "veille-basse.cohorte-refusee",
      "veille-basse.cohorte-redirigee",
    ].some((id) => ids.includes(id));
  }
  return decisionId === "contraindre-vannes";
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
  if (faits.some(({ id }) => id === FAIT_D_INDISPONIBILITE_DU_COMPAGNON)) {
    throw new Error(`${COMPAGNON_DE_REFERENCE.nom} est indisponible.`);
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
  position: IdentifiantDeLieu,
  commande: CommandeDeDecisionDuConseil,
  moment: number,
): {
  readonly faitProduit: FaitDeCampagne;
  readonly evenement: EvenementDeDecisionDuConseil;
} {
  const definition =
    commande.conseilId === PREMIER_CONSEIL.id
      ? PREMIER_CONSEIL
      : commande.conseilId === IDENTIFIANT_DU_CONSEIL_DES_VANNES
        ? trouverConseil(IDENTIFIANT_DU_CONSEIL_DES_VANNES)
        : undefined;
  const sujet = definition?.sujets.find(
    (candidat) => candidat.id === commande.sujetId,
  );
  const decision = sujet?.decisions.find(
    (candidate) => candidate.id === commande.decisionId,
  );
  if (
    definition === undefined ||
    sujet === undefined ||
    decision === undefined
  ) {
    throw new Error("Cette décision du Conseil est inconnue.");
  }
  if (definition.id === PREMIER_CONSEIL.id && !compagnonEstAffecte(faits)) {
    throw new Error("L’Affectation d’Ilyana à l’Intendance est requise.");
  }
  if (definition.id === PREMIER_CONSEIL.id && conseilEstTermine(faits)) {
    throw new Error("Ce Conseil possède déjà une décision.");
  }
  if (definition.id === IDENTIFIANT_DU_CONSEIL_DES_VANNES) {
    if (position !== "deversoir-noir" || !conseilDesVannesEstConvoque(faits)) {
      throw new Error(`Le Conseil « ${definition.id} » n’est pas convoqué.`);
    }
    if (conseilDesVannesEstTermine(faits)) {
      throw new Error("Ce Conseil possède déjà une décision.");
    }
    if (!decisionDuConseilDesVannesEstDisponible(decision.id, faits)) {
      throw new Error("Cette option n’a pas été préparée dans les Colonies.");
    }
  }

  const faitProduit: FaitDeCampagne = {
    id: decision.faitProduit,
    cause: definition.id,
    acteurs: ["porte-lanterne", COMPAGNON_DE_REFERENCE.id],
    cible:
      definition.id === PREMIER_CONSEIL.id
        ? QUARTIER_INTENDANCE.id
        : "conseil-des-vannes",
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
