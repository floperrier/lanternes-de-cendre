import { creerFluxPseudoAleatoire } from "../simulation/aleatoire";
import {
  appliquerCommande,
  empreinteEtat,
  type EtatCampagne,
  type FaitDeCampagne,
} from "../simulation/campagne";
import {
  appliquerVariationAUnStock,
  creerPilotageInitial,
  traiterEcheancesDePilotage,
} from "../simulation/pilotage";
import { catalogueDEvenements } from "../content/catalogue";
import type { EffetsDeFait } from "../simulation/faits";
import { creerInfrastructureInitiale } from "../simulation/infrastructure";
import { creerEtatDesRoutesInitial } from "../simulation/routes";
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
  VERSION_SAUVEGARDE_AVANT_ROUTES,
  VERSION_SAUVEGARDE_INITIALE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import {
  estCommandeAvantRoutes,
  estCommandeV2,
  estCommandeV1,
  estObjet,
  lireEtatAvantRoutes,
  lireEtatCourant,
  lireEtatV1,
  lireEtatV2,
  projeterEtatAvantRoutesHistorique,
  type EtatCampagneAvantRoutes,
  type EtatCampagneV1,
  type EtatCampagneV2,
  type ObjetInconnu,
} from "./validation";

const EMPREINTE = /^[0-9a-f]{8}$/;
const PLATEFORMES_DE_LA_SIMULATION_V2 = [
  "phare",
  "foyers",
  "atelier",
  "serres",
  "reservoirs",
  "vigie",
  "forge",
] as const;

function sontStructurellementEgaux(gauche: unknown, droite: unknown): boolean {
  if (Object.is(gauche, droite)) {
    return true;
  }
  if (Array.isArray(gauche) || Array.isArray(droite)) {
    return (
      Array.isArray(gauche) &&
      Array.isArray(droite) &&
      gauche.length === droite.length &&
      gauche.every((membre, index) =>
        sontStructurellementEgaux(membre, droite[index]),
      )
    );
  }
  if (!estObjet(gauche) || !estObjet(droite)) {
    return false;
  }
  const clesGauche = Object.keys(gauche).sort();
  const clesDroite = Object.keys(droite).sort();
  return (
    clesGauche.length === clesDroite.length &&
    clesGauche.every(
      (cle, index) =>
        cle === clesDroite[index] &&
        sontStructurellementEgaux(gauche[cle], droite[cle]),
    )
  );
}

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
  const infrastructure = creerInfrastructureInitiale();
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
    infrastructure,
    routes: creerEtatDesRoutesInitial(),
    citeCaravane: {
      ...etat.citeCaravane,
      formation: {
        type: "grappe",
        plateformes: infrastructure.plateformes.map(
          (plateforme) => plateforme.id,
        ),
      },
    },
    echeances: [],
    fluxPseudoAleatoires: {
      "evenements-narratifs": creerFluxPseudoAleatoire(
        etat.graine,
        "evenements-narratifs",
      ),
    },
  };
}

function migrerEtatV2(etat: EtatCampagneV2): EtatCampagne {
  const infrastructure = creerInfrastructureInitiale();
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    citeCaravane: {
      ...etat.citeCaravane,
      formation: {
        type: "grappe",
        plateformes: infrastructure.plateformes.map(
          (plateforme) => plateforme.id,
        ),
      },
    },
    infrastructure,
    routes: creerEtatDesRoutesInitial(),
  };
}

function normaliserEtatV2(etat: EtatCampagne): EtatCampagneV2 {
  return {
    version: 2,
    graine: etat.graine,
    tempsDuConvoi: etat.tempsDuConvoi,
    citeCaravane: {
      ...etat.citeCaravane,
      formation: {
        type: "grappe",
        plateformes: PLATEFORMES_DE_LA_SIMULATION_V2,
      },
    },
    narration: etat.narration,
    pilotage: etat.pilotage,
    echeances: etat.echeances,
    fluxPseudoAleatoires: etat.fluxPseudoAleatoires,
  };
}

function migrerEtatAvantRoutes(etat: EtatCampagneAvantRoutes): EtatCampagne {
  return {
    ...etat,
    pilotage: {
      ...etat.pilotage,
      economie: {
        ...etat.pilotage.economie,
        stocks: {
          ...etat.pilotage.economie.stocks,
          materiaux: appliquerVariationAUnStock(
            etat.pilotage.economie.stocks.materiaux,
            0,
          ),
        },
      },
    },
    routes: creerEtatDesRoutesInitial(),
  };
}

function normaliserEtatLegacy(
  etat: EtatCampagneV1 | EtatCampagne,
): unknown {
  return {
    graine: etat.graine,
    tempsDuConvoi: etat.tempsDuConvoi,
    citeCaravane: {
      habitants: etat.citeCaravane.habitants,
      phare: etat.citeCaravane.phare,
      formation: { type: etat.citeCaravane.formation.type },
    },
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
  if (!sontStructurellementEgaux(etatLegacyRejoue, etatLegacyDeclare)) {
    return undefined;
  }

  if (
    lireEtatCourant(snapshot) === undefined ||
    lireEtatCourant(etat) === undefined
  ) {
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
    id: `${valeur.id}-v3-${sauvegarde.empreinte}`,
  };
}

function migrerSauvegardeV2Legacy(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_ROUTES ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== 2 ||
    valeur.versions.contenu !== VERSIONS_DU_SNAPSHOT_COURANT.contenu ||
    valeur.versions.aleatoire !== VERSIONS_DU_SNAPSHOT_COURANT.aleatoire ||
    valeur.versions.empreinte !== VERSIONS_DU_SNAPSHOT_COURANT.empreinte ||
    typeof valeur.graine !== "string" ||
    !estObjet(valeur.horloge) ||
    typeof valeur.horloge.secondes !== "number" ||
    !Number.isFinite(valeur.horloge.secondes) ||
    !estObjet(valeur.reproduction) ||
    !Array.isArray(valeur.reproduction.commandes) ||
    typeof valeur.reproduction.empreinteSnapshot !== "string" ||
    !EMPREINTE.test(valeur.reproduction.empreinteSnapshot) ||
    typeof valeur.empreinte !== "string" ||
    !EMPREINTE.test(valeur.empreinte)
  ) {
    return undefined;
  }

  const snapshotV2 = lireEtatV2(valeur.reproduction.snapshot);
  const etatDeclareV2 = lireEtatV2(valeur.etat);
  if (
    snapshotV2 === undefined ||
    etatDeclareV2 === undefined ||
    valeur.graine !== etatDeclareV2.graine ||
    valeur.horloge.secondes !== etatDeclareV2.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV2 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV2 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  const snapshot = migrerEtatV2(snapshotV2);
  let etat = snapshot;
  const commandes: CommandeDeReproduction[] = [];
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeV2(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommande(etat, entree.commande).etat;
      const empreinteLegacy = empreinteEtat(
        normaliserEtatV2(etat) as unknown as EtatCampagne,
      );
      if (empreinteLegacy !== entree.empreinteApres) {
        return undefined;
      }
      commandes.push({
        sequence: index,
        commande: entree.commande,
        empreinteApres: empreinteEtat(etat),
      });
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(normaliserEtatV2(etat), etatDeclareV2) ||
    lireEtatCourant(snapshot) === undefined ||
    lireEtatCourant(etat) === undefined
  ) {
    return undefined;
  }

  const reproduction: ReproductionDeCampagne = {
    snapshot,
    empreinteSnapshot: empreinteEtat(snapshot),
    commandes,
  };
  const sauvegarde = creerSauvegarde(etat, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v3-${sauvegarde.empreinte}`,
  };
}

function migrerSauvegardeAvantRoutes(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_ROUTES ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_COURANTE ||
    valeur.versions.contenu !== VERSIONS_DU_SNAPSHOT_COURANT.contenu ||
    valeur.versions.aleatoire !== VERSIONS_DU_SNAPSHOT_COURANT.aleatoire ||
    valeur.versions.empreinte !== VERSIONS_DU_SNAPSHOT_COURANT.empreinte ||
    typeof valeur.graine !== "string" ||
    !estObjet(valeur.horloge) ||
    typeof valeur.horloge.secondes !== "number" ||
    !Number.isFinite(valeur.horloge.secondes) ||
    !estObjet(valeur.reproduction) ||
    !Array.isArray(valeur.reproduction.commandes) ||
    typeof valeur.reproduction.empreinteSnapshot !== "string" ||
    !EMPREINTE.test(valeur.reproduction.empreinteSnapshot) ||
    typeof valeur.empreinte !== "string" ||
    !EMPREINTE.test(valeur.empreinte)
  ) {
    return undefined;
  }

  const snapshotAvantRoutes = lireEtatAvantRoutes(
    valeur.reproduction.snapshot,
  );
  const etatDeclareAvantRoutes = lireEtatAvantRoutes(valeur.etat);
  if (
    snapshotAvantRoutes === undefined ||
    etatDeclareAvantRoutes === undefined ||
    valeur.graine !== etatDeclareAvantRoutes.graine ||
    valeur.horloge.secondes !==
      etatDeclareAvantRoutes.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotAvantRoutes as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareAvantRoutes as unknown as EtatCampagne) !==
      valeur.empreinte
  ) {
    return undefined;
  }

  const snapshot = migrerEtatAvantRoutes(snapshotAvantRoutes);
  let etat = snapshot;
  const commandes: CommandeDeReproduction[] = [];
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeAvantRoutes(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommande(etat, entree.commande).etat;
      const empreinteLegacy = empreinteEtat(
        projeterEtatAvantRoutesHistorique(etat) as unknown as EtatCampagne,
      );
      if (empreinteLegacy !== entree.empreinteApres) {
        return undefined;
      }
      commandes.push({
        sequence: index,
        commande: entree.commande,
        empreinteApres: empreinteEtat(etat),
      });
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(
      projeterEtatAvantRoutesHistorique(etat),
      etatDeclareAvantRoutes,
    ) ||
    lireEtatCourant(snapshot) === undefined ||
    lireEtatCourant(etat) === undefined
  ) {
    return undefined;
  }

  const reproduction: ReproductionDeCampagne = {
    snapshot,
    empreinteSnapshot: empreinteEtat(snapshot),
    commandes,
  };
  const sauvegarde = creerSauvegarde(etat, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v3-${sauvegarde.empreinte}`,
  };
}

export function migrerSauvegardeV2(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  return estObjet(valeur.versions) &&
    valeur.versions.simulation === VERSION_SIMULATION_COURANTE
    ? migrerSauvegardeAvantRoutes(valeur)
    : migrerSauvegardeV2Legacy(valeur);
}
