import {
  appliquerCommande,
  empreinteEtat,
  type EtatCampagne,
} from "../simulation/campagne";
import type {
  ReproductionDeCampagne,
  ResultatReplay,
} from "./types";

export function creerReproductionInitiale(
  etat: EtatCampagne,
): ReproductionDeCampagne {
  return {
    snapshot: etat,
    empreinteSnapshot: empreinteEtat(etat),
    commandes: [],
  };
}

export function rejouerReproduction(
  reproduction: ReproductionDeCampagne,
): ResultatReplay {
  const empreinteDuSnapshot = empreinteEtat(reproduction.snapshot);
  if (empreinteDuSnapshot !== reproduction.empreinteSnapshot) {
    return {
      statut: "divergence-snapshot",
      empreinteAttendue: reproduction.empreinteSnapshot,
      empreinteObtenue: empreinteDuSnapshot,
    };
  }

  let etat = reproduction.snapshot;
  for (const [indexCommande, entree] of reproduction.commandes.entries()) {
    try {
      etat = appliquerCommande(etat, entree.commande).etat;
    } catch (erreur) {
      return {
        statut: "divergence",
        indexCommande,
        sequence: entree.sequence,
        commande: entree.commande,
        empreinteAttendue: entree.empreinteApres,
        empreinteObtenue: empreinteEtat(etat),
        erreur: erreur instanceof Error ? erreur.message : String(erreur),
      };
    }

    const empreinteObtenue = empreinteEtat(etat);
    if (empreinteObtenue !== entree.empreinteApres) {
      return {
        statut: "divergence",
        indexCommande,
        sequence: entree.sequence,
        commande: entree.commande,
        empreinteAttendue: entree.empreinteApres,
        empreinteObtenue,
      };
    }
  }

  return {
    statut: "termine",
    etat,
    empreinte: empreinteEtat(etat),
  };
}
