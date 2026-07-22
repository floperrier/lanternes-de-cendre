import { creerFluxPseudoAleatoire } from "../simulation/aleatoire";
import {
  appliquerCommande,
  empreinteEtat,
  type EtatCampagne,
  type FaitDeCampagne,
} from "../simulation/campagne";
import {
  creerPilotageInitial,
  traiterEcheancesDePilotage,
} from "../simulation/pilotage";
import { catalogueDEvenements } from "../content/catalogue";
import type { EffetsDeFait } from "../simulation/faits";
import { creerSauvegarde } from "./snapshot";
import type {
  CommandeDeReproduction,
  ReproductionDeCampagne,
  SauvegardeCampagne,
} from "./types";
import {
  VERSION_SIMULATION_COURANTE,
  VERSION_SIMULATION_INITIALE,
} from "../simulation/versions";
import {
  FORMAT_SAUVEGARDE,
  VERSION_CONTENU_COURANTE,
  VERSION_SAUVEGARDE_INITIALE,
} from "./version";
import {
  estCommandeV1,
  estObjet,
  lireEtatV1,
  lireEtatV2,
  type EtatCampagneV1,
  type ObjetInconnu,
} from "./validation";

const EFFETS_DES_FAITS_LEGACY = new Map(
  catalogueDEvenements.evenements.flatMap((evenement) =>
    evenement.choix.flatMap((choix) =>
      choix.faitsProduits.map((fait) => [
        fait.id,
        {
          materiels: [],
          humains: choix.effets.map((effet) => ({
            type: "habitants.modifies" as const,
            variation: effet.valeur,
          })),
        } satisfies EffetsDeFait,
      ] as const),
    ),
  ),
);

function reconstruireEffetsLegacy(id: string): EffetsDeFait {
  const effets = EFFETS_DES_FAITS_LEGACY.get(id);
  if (effets === undefined) {
    throw new Error(`Le Fait legacy « ${id} » est inconnu.`);
  }
  return effets;
}

function migrerEtatV1(etat: EtatCampagneV1): EtatCampagne {
  const pilotage = traiterEcheancesDePilotage(
    creerPilotageInitial(),
    0,
    etat.tempsDuConvoi.secondes,
  );
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    narration: {
      ...etat.narration,
      faitsDeCampagne: [
        ...pilotage.faitsProduits,
        ...etat.narration.faitsDeCampagne.map(
          (fait): FaitDeCampagne => ({
            id: fait.id,
            cause: fait.cause,
            acteurs: fait.acteurs,
            cible: fait.cible,
            moment: fait.moment,
            effets: reconstruireEffetsLegacy(fait.id),
          }),
        ),
      ].sort((gauche, droite) => gauche.moment - droite.moment),
    },
    pilotage: pilotage.etat,
    echeances: [],
    fluxPseudoAleatoires: {
      "evenements-narratifs": creerFluxPseudoAleatoire(
        etat.graine,
        "evenements-narratifs",
      ),
    },
  };
}

function normaliserEtatLegacy(
  etat: EtatCampagneV1 | EtatCampagne,
): unknown {
  return {
    graine: etat.graine,
    tempsDuConvoi: etat.tempsDuConvoi,
    citeCaravane: etat.citeCaravane,
    narration: {
      evenementActif: etat.narration.evenementActif,
      evenementsJoues: etat.narration.evenementsJoues,
      faitsDeCampagne: etat.narration.faitsDeCampagne
        .filter((fait) => EFFETS_DES_FAITS_LEGACY.has(fait.id))
        .map((fait) => ({
          id: fait.id,
          cause: fait.cause,
          acteurs: fait.acteurs,
          cible: fait.cible,
          moment: fait.moment,
        })),
    },
  };
}

export function migrerSauvegardeV1(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_INITIALE ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_INITIALE ||
    valeur.versions.contenu !== VERSION_CONTENU_COURANTE ||
    !estObjet(valeur.horloge) ||
    typeof valeur.horloge.secondes !== "number" ||
    !Number.isFinite(valeur.horloge.secondes) ||
    !estObjet(valeur.reproduction) ||
    !Array.isArray(valeur.reproduction.commandes)
  ) {
    return undefined;
  }
  const snapshotV1 = lireEtatV1(valeur.reproduction.snapshot);
  const etatV1 = lireEtatV1(valeur.etat);
  if (
    snapshotV1 === undefined ||
    etatV1 === undefined ||
    valeur.horloge.secondes !== etatV1.tempsDuConvoi.secondes
  ) {
    return undefined;
  }

  const snapshot = migrerEtatV1(snapshotV1);
  let etat = snapshot;
  const empreinteSnapshot = empreinteEtat(snapshot);
  let empreinteCourante = empreinteSnapshot;
  const commandes: CommandeDeReproduction[] = [];

  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeV1(entree.commande)
      ) {
        return undefined;
      }
      const commande = entree.commande;
      const reglageDeVitesseIdempotent =
        commande.type === "temps-du-convoi.regler-vitesse" &&
        commande.vitesse === etat.tempsDuConvoi.vitesse;
      if (!reglageDeVitesseIdempotent) {
        etat = appliquerCommande(etat, commande).etat;
        empreinteCourante = empreinteEtat(etat);
      }
      commandes.push({
        sequence: index,
        commande,
        empreinteApres: empreinteCourante,
      });
    }
  } catch {
    return undefined;
  }

  const etatLegacyDeclare = normaliserEtatLegacy(etatV1);
  const etatLegacyRejoue = normaliserEtatLegacy(etat);
  if (JSON.stringify(etatLegacyRejoue) !== JSON.stringify(etatLegacyDeclare)) {
    return undefined;
  }

  if (lireEtatV2(snapshot) === undefined || lireEtatV2(etat) === undefined) {
    return undefined;
  }

  const reproduction: ReproductionDeCampagne = {
    snapshot,
    empreinteSnapshot,
    commandes,
  };
  const sauvegarde = creerSauvegarde(etat, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v2-${sauvegarde.empreinte}`,
  };
}
