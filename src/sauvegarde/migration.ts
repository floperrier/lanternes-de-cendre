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
import {
  catalogueDEvenements,
  executerAvecEvenementsStructurelsTemporaires,
} from "../content/catalogue";
import type { EffetsDeFait } from "../simulation/faits";
import { creerInfrastructureInitiale } from "../simulation/infrastructure";
import {
  creerEtatDesRoutesInitial,
  executerAvecTronconsTemporaires,
} from "../simulation/routes";
import {
  creerEtatDesCrisesInitial,
  FAIT_ANNONCANT_LA_CRISE,
  ignorerFaitAnnonceurHistorique,
} from "../simulation/crise";
import { creerEtatDesExpeditionsInitial } from "../simulation/expeditions";
import { creerEtatInitialDeVeilleBasse } from "../simulation/veilleBasse";
import { creerEtatDeHautPuitsInitial } from "../simulation/hautPuits";
import { creerEtatInitialDeLaTrameDeFer } from "../simulation/trameFer";
import { creerEtatInitialDeTraverseLibre } from "../simulation/traverseLibre";
import {
  CAMPAGNE_EN_COURS,
  reconstruireDenouementReussi,
} from "../simulation/denouement";
import { EVENEMENTS_HISTORIQUES_V5 } from "./catalogueHistoriqueV5";
import {
  EVENEMENTS_HISTORIQUES_V6,
  TRONCONS_HISTORIQUES_V6,
} from "./catalogueHistoriqueV6";
import { EVENEMENTS_HISTORIQUES_V7 } from "./catalogueHistoriqueV7";
import { creerSauvegarde } from "./snapshot";
import type {
  CommandeDeReproduction,
  ReproductionDeCampagne,
  SauvegardeCampagne,
} from "./types";
import {
  VERSION_SIMULATION_AVANT_CRISES,
  VERSION_SIMULATION_AVANT_DENOUEMENT,
  VERSION_SIMULATION_AVANT_DEVERSOIR,
  VERSION_SIMULATION_AVANT_HAUT_PUITS,
  VERSION_SIMULATION_AVANT_NACELLES,
  VERSION_SIMULATION_AVANT_TRAME_DE_FER,
  VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE,
  VERSION_SIMULATION_AVANT_VEILLE_BASSE,
  VERSION_SIMULATION_COURANTE,
  VERSION_SIMULATION_INITIALE,
} from "../simulation/versions";
import {
  FORMAT_SAUVEGARDE,
  VERSION_CONTENU_COURANTE,
  VERSION_SAUVEGARDE_AVANT_ROUTES,
  VERSION_SAUVEGARDE_AVANT_CRISES,
  VERSION_SAUVEGARDE_AVANT_DENOUEMENT,
  VERSION_SAUVEGARDE_AVANT_DEVERSOIR,
  VERSION_SAUVEGARDE_AVANT_HAUT_PUITS,
  VERSION_SAUVEGARDE_AVANT_NACELLES,
  VERSION_SAUVEGARDE_AVANT_TRAME_DE_FER,
  VERSION_SAUVEGARDE_AVANT_TRAVERSE_LIBRE,
  VERSION_SAUVEGARDE_AVANT_VEILLE_BASSE,
  VERSION_SAUVEGARDE_COURANTE,
  VERSION_SAUVEGARDE_INITIALE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import {
  estCommandeAvantCrises,
  estCommandeAvantRoutes,
  estCommande,
  estCommandeV5,
  estCommandeV6,
  estCommandeV7,
  estCommandeV8,
  estCommandeV9,
  estCommandeV2,
  estCommandeV1,
  estObjet,
  lireEtatAvantCrises,
  lireEtatAvantRoutes,
  lireEtatCourant,
  lireSnapshotCourant,
  lireEtatV1,
  lireEtatV2,
  lireEtatV4,
  lireEtatV5,
  lireEtatV6,
  lireEtatV7,
  lireEtatV8,
  lireEtatV9,
  lireEtatV10,
  lireSnapshotV4,
  lireSnapshotV5,
  lireSnapshotV6,
  lireSnapshotV7,
  lireSnapshotV8,
  lireSnapshotV9,
  lireSnapshotV10,
  marquerCausaliteHistoriqueDeNarrationSiNecessaire,
  projeterEtatAvantRoutesHistorique,
  type EtatCampagneAvantCrises,
  type EtatCampagneAvantRoutes,
  type EtatCampagneV1,
  type EtatCampagneV2,
  type EtatCampagneV4,
  type EtatCampagneV5,
  type EtatCampagneV6,
  type EtatCampagneV7,
  type EtatCampagneV8,
  type EtatCampagneV9,
  type EtatCampagneV10,
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

export function promouvoirEtatV10VersCourant(
  etat: EtatCampagneV10,
): EtatCampagne {
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: reconstruireDenouementReussi(
      etat.narration.faitsDeCampagne,
    ),
  };
}

function normaliserEtatCourantEnV10(
  etat: EtatCampagne,
): EtatCampagneV10 {
  const { denouement, ...sansDenouement } = etat;
  void denouement;
  return {
    ...sansDenouement,
    version: VERSION_SIMULATION_AVANT_DENOUEMENT,
  };
}

export function migrerSauvegardeV10(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_DENOUEMENT ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_DENOUEMENT ||
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

  const snapshotV10 = lireSnapshotV10(valeur.reproduction.snapshot);
  const etatDeclareV10 = lireEtatV10(valeur.etat);
  if (
    snapshotV10 === undefined ||
    etatDeclareV10 === undefined ||
    valeur.graine !== etatDeclareV10.graine ||
    valeur.horloge.secondes !== etatDeclareV10.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV10 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV10 as unknown as EtatCampagne) !==
      valeur.empreinte
  ) {
    return undefined;
  }

  let etat = promouvoirEtatV10VersCourant(snapshotV10);
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommande(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommande(etat, entree.commande, {
        autoriserApresDenouement: "migration-v10",
      }).etat;
      if (
        empreinteEtat(
          normaliserEtatCourantEnV10(etat) as unknown as EtatCampagne,
        ) !== entree.empreinteApres
      ) {
        return undefined;
      }
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(
      normaliserEtatCourantEnV10(etat),
      etatDeclareV10,
    )
  ) {
    return undefined;
  }

  const etatCourant = promouvoirEtatV10VersCourant(etatDeclareV10);
  if (
    lireSnapshotCourant(etatCourant) === undefined ||
    lireEtatCourant(etatCourant) === undefined
  ) {
    return undefined;
  }
  const reproduction: ReproductionDeCampagne = {
    snapshot: etatCourant,
    empreinteSnapshot: empreinteEtat(etatCourant),
    commandes: [],
  };
  const sauvegarde = creerSauvegarde(etatCourant, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

function creerEtatDesCrisesDepuisHistorique(
  faits: readonly { readonly id: string }[],
  ignorerFaitAnnonceur = false,
) {
  const initial = creerEtatDesCrisesInitial();
  return ignorerFaitAnnonceur ||
    faits.some((fait) => fait.id === FAIT_ANNONCANT_LA_CRISE)
    ? ignorerFaitAnnonceurHistorique(initial)
    : initial;
}

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
          materiels: choix.effets
            .filter(
              (
                effet,
              ): effet is Extract<
                (typeof choix.effets)[number],
                { readonly type: "stock.modifier" }
              > => effet.type === "stock.modifier",
            )
            .map((effet) => ({
              type: "stock.modifie" as const,
              stock: effet.stock,
              variation: effet.valeur,
            })),
          humains: choix.effets
            .filter(
              (
                effet,
              ): effet is Extract<
                (typeof choix.effets)[number],
                { readonly type: "habitants.modifier" }
              > => effet.type === "habitants.modifier",
            )
            .map((effet) => ({
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
    denouement: CAMPAGNE_EN_COURS,
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
    crises: creerEtatDesCrisesDepuisHistorique(etat.narration.faitsDeCampagne),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
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

function migrerEtatV2(
  etat: EtatCampagneV2,
  ignorerFaitAnnonceur = false,
): EtatCampagne {
  const infrastructure = creerInfrastructureInitiale();
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
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
    crises: creerEtatDesCrisesDepuisHistorique(
      etat.narration.faitsDeCampagne,
      ignorerFaitAnnonceur,
    ),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
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

function migrerEtatAvantRoutes(
  etat: EtatCampagneAvantRoutes,
  ignorerFaitAnnonceur = false,
): EtatCampagne {
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
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
    crises: creerEtatDesCrisesDepuisHistorique(
      etat.narration.faitsDeCampagne,
      ignorerFaitAnnonceur,
    ),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
  };
}

function migrerEtatAvantCrises(
  etat: EtatCampagneAvantCrises,
  ignorerFaitAnnonceur = false,
): EtatCampagne {
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    crises: creerEtatDesCrisesDepuisHistorique(
      etat.narration.faitsDeCampagne,
      ignorerFaitAnnonceur,
    ),
    expeditions: creerEtatDesExpeditionsInitial(),
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
  };
}

function normaliserEtatAvantCrises(
  etat: EtatCampagne,
): EtatCampagneAvantCrises {
  return {
    version: VERSION_SIMULATION_AVANT_CRISES,
    graine: etat.graine,
    tempsDuConvoi: etat.tempsDuConvoi,
    citeCaravane: etat.citeCaravane,
    narration: etat.narration,
    pilotage: etat.pilotage,
    infrastructure: etat.infrastructure,
    routes: etat.routes,
    echeances: etat.echeances,
    fluxPseudoAleatoires: etat.fluxPseudoAleatoires,
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
        etat = appliquerCommandeSelonCatalogueAvantVeilleBasse(
          etat,
          commande,
        );
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
    lireSnapshotCourant(snapshot) === undefined ||
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
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

export function promouvoirEtatV4VersCourant(
  etat: EtatCampagneV4,
): EtatCampagne {
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire({
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    veilleBasse: creerEtatInitialDeVeilleBasse(),
    hautPuits: creerEtatDeHautPuitsInitial(),
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
  });
}

export function promouvoirEtatV6VersCourant(
  etat: EtatCampagneV6,
): EtatCampagne {
  const aDejaEmprunteLesNacelles = etat.routes.engagements.some(
    (engagement) => engagement.tronconId === "chenal-des-vannes",
  );
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire({
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
    routes: aDejaEmprunteLesNacelles
      ? etat.routes
      : {
          ...etat.routes,
          etatsReels: {
            ...etat.routes.etatsReels,
            "nacelles-de-veille-basse": "degrade",
          },
        },
  });
}

function promouvoirEtatV6PourReplay(
  etat: EtatCampagneV6,
): EtatCampagne {
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire({
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
  });
}

function normaliserEtatCourantEnV6(
  etat: EtatCampagne,
): EtatCampagneV6 {
  const {
    denouement,
    trameDeFer,
    traverseLibre,
    ...sansTrame
  } = etat;
  void denouement;
  void trameDeFer;
  void traverseLibre;
  const { causaliteHistorique, ...narrationV6 } = sansTrame.narration;
  void causaliteHistorique;
  const {
    "nacelles-de-veille-basse": routeAjoutee,
    "chemin-de-l-hospice": cheminDeLHospice,
    "chenal-de-l-hospice": chenalDeLHospice,
    "conduite-du-deversoir": routeDuDeversoir,
    "passage-de-la-ligne-zero": passageRegional,
    "piste-des-levees": pisteDesLevees,
    "rampe-de-barriere-neuve": rampeDeBarriereNeuve,
    "voie-des-ponts-lourds": voieDesPontsLourds,
    "embranchement-de-pompe-neuve": embranchementDePompeNeuve,
    "galerie-des-reservoirs": galerieDesReservoirs,
    "rocade-du-marche": rocadeDuMarche,
    "voie-des-citernes": voieDesCiternes,
    "ligne-du-signal-zero": ligneDuSignalZero,
    "voie-des-contremaitres": voieDesContremaitres,
    "traverse-des-porteurs": traverseDesPorteurs,
    "rocade-des-regulateurs": rocadeDesRegulateurs,
    "derivation-des-puits": derivationDesPuits,
    "faisceau-de-l-aiguillage-zero": faisceauDeLAiguillageZero,
    "passage-de-la-couronne-muette": passageDeLaCouronneMuette,
    "voie-de-tete-de-ligne": voieDeTeteDeLigne,
    "chemin-des-trois-veilles": cheminDesTroisVeilles,
    "piste-des-serres-de-verre": pisteDesSerresDeVerre,
    "rampe-du-seuil": rampeDuSeuil,
    "arc-ferroviaire-du-noeud": arcFerroviaireDuNoeud,
    "galerie-des-trois-phares": galerieDesTroisPhares,
    "porte-logistique-du-seuil": porteLogistiqueDuSeuil,
    "passage-de-la-couronne-ouverte": passageDeLaCouronneOuverte,
    "breche-de-secours-du-noeud": brecheDeSecoursDuNoeud,
    ...etatsReelsV6
  } = sansTrame.routes.etatsReels;
  void routeAjoutee;
  void cheminDeLHospice;
  void chenalDeLHospice;
  void routeDuDeversoir;
  void passageRegional;
  void pisteDesLevees;
  void rampeDeBarriereNeuve;
  void voieDesPontsLourds;
  void embranchementDePompeNeuve;
  void galerieDesReservoirs;
  void rocadeDuMarche;
  void voieDesCiternes;
  void ligneDuSignalZero;
  void voieDesContremaitres;
  void traverseDesPorteurs;
  void rocadeDesRegulateurs;
  void derivationDesPuits;
  void faisceauDeLAiguillageZero;
  void passageDeLaCouronneMuette;
  void voieDeTeteDeLigne;
  void cheminDesTroisVeilles;
  void pisteDesSerresDeVerre;
  void rampeDuSeuil;
  void arcFerroviaireDuNoeud;
  void galerieDesTroisPhares;
  void porteLogistiqueDuSeuil;
  void passageDeLaCouronneOuverte;
  void brecheDeSecoursDuNoeud;
  return {
    ...sansTrame,
    version: VERSION_SIMULATION_AVANT_NACELLES,
    narration: narrationV6,
    routes: {
      ...sansTrame.routes,
      etatsReels: etatsReelsV6,
    },
  };
}

function appliquerCommandeSelonCatalogueAvantNacelles(
  etat: EtatCampagne,
  commande: Parameters<typeof appliquerCommande>[1],
): EtatCampagne {
  const evenementActifAvant = etat.narration.evenementActif;
  const applique = appliquerCommande(etat, commande, {
    coutsDesNacelles: "historiques-v6",
  }).etat;
  const nouvelEvenement = applique.narration.evenementActif;
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire(
    evenementActifAvant === null &&
      nouvelEvenement?.startsWith("bassins.nacelles.") === true
      ? {
          ...applique,
          narration: {
            ...applique.narration,
            evenementActif: null,
          },
        }
      : applique,
  );
}

function migrerSauvegardeV6AvecCatalogueHistorique(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_NACELLES ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_NACELLES ||
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

  const snapshotV6 = lireSnapshotV6(valeur.reproduction.snapshot);
  const etatDeclareV6 = lireEtatV6(valeur.etat);
  if (
    snapshotV6 === undefined ||
    etatDeclareV6 === undefined ||
    valeur.graine !== etatDeclareV6.graine ||
    valeur.horloge.secondes !== etatDeclareV6.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV6 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV6 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  let etat = promouvoirEtatV6PourReplay(snapshotV6);
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeV6(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommandeSelonCatalogueAvantNacelles(
        etat,
        entree.commande,
      );
      if (
        empreinteEtat(
          normaliserEtatCourantEnV6(etat) as unknown as EtatCampagne,
        ) !== entree.empreinteApres
      ) {
        return undefined;
      }
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(
      normaliserEtatCourantEnV6(etat),
      etatDeclareV6,
    )
  ) {
    return undefined;
  }

  const etatCourant = promouvoirEtatV6VersCourant(etatDeclareV6);
  if (
    lireSnapshotCourant(etatCourant) === undefined ||
    lireEtatCourant(etatCourant) === undefined
  ) {
    return undefined;
  }
  const reproduction: ReproductionDeCampagne = {
    snapshot: etatCourant,
    empreinteSnapshot: empreinteEtat(etatCourant),
    commandes: [],
  };
  const sauvegarde = creerSauvegarde(etatCourant, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

export function migrerSauvegardeV6(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  return executerAvecTronconsTemporaires(
    TRONCONS_HISTORIQUES_V6,
    () =>
      executerAvecEvenementsStructurelsTemporaires(
        EVENEMENTS_HISTORIQUES_V6,
        () => migrerSauvegardeV6AvecCatalogueHistorique(valeur),
      ),
  );
}

function promouvoirEtatV7PourReplay(
  etat: EtatCampagneV7,
): EtatCampagne {
  const topologieHistoriqueEstUtilisee = etat.routes.engagements.some(
    (engagement) =>
      engagement.tronconId === "nacelles-de-veille-basse" &&
      engagement.origine === "veille-basse" &&
      engagement.destination === "relais-des-vannes",
  );
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire({
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    hautPuits: {
      ...etat.hautPuits,
      projetRegional: null,
    },
    routes: {
      ...etat.routes,
      ...(topologieHistoriqueEstUtilisee
        ? { topologieHistorique: "nacelles-v7" as const }
        : {}),
    },
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
  });
}

export function promouvoirEtatV7VersCourant(
  etat: EtatCampagneV7,
): EtatCampagne {
  const routesInitiales = creerEtatDesRoutesInitial();
  const etatPromu = promouvoirEtatV7PourReplay(etat);
  return {
    ...etatPromu,
    routes: {
      ...etatPromu.routes,
      etatsReels: {
        ...routesInitiales.etatsReels,
        ...etatPromu.routes.etatsReels,
      },
    },
  };
}

function normaliserEtatCourantEnV7(
  etat: EtatCampagne,
): EtatCampagneV7 {
  const {
    denouement,
    devenirsDesSites,
    trameDeFer,
    traverseLibre,
    ...sansDevenirs
  } = etat;
  void denouement;
  void devenirsDesSites;
  void trameDeFer;
  void traverseLibre;
  const { causaliteHistorique, ...narrationV7 } = sansDevenirs.narration;
  void causaliteHistorique;
  const { projetRegional, ...hautPuitsV7 } = sansDevenirs.hautPuits;
  void projetRegional;
  const {
    orientationRegionale,
    ...cohorteV7
  } = sansDevenirs.veilleBasse.cohorte;
  void orientationRegionale;
  const {
    "chemin-de-l-hospice": cheminDeLHospice,
    "chenal-de-l-hospice": chenalDeLHospice,
    "conduite-du-deversoir": conduiteDuDeversoir,
    "passage-de-la-ligne-zero": passageDeLaLigneZero,
    "piste-des-levees": pisteDesLevees,
    "rampe-de-barriere-neuve": rampeDeBarriereNeuve,
    "voie-des-ponts-lourds": voieDesPontsLourds,
    "embranchement-de-pompe-neuve": embranchementDePompeNeuve,
    "galerie-des-reservoirs": galerieDesReservoirs,
    "rocade-du-marche": rocadeDuMarche,
    "voie-des-citernes": voieDesCiternes,
    "ligne-du-signal-zero": ligneDuSignalZero,
    "voie-des-contremaitres": voieDesContremaitres,
    "traverse-des-porteurs": traverseDesPorteurs,
    "rocade-des-regulateurs": rocadeDesRegulateurs,
    "derivation-des-puits": derivationDesPuits,
    "faisceau-de-l-aiguillage-zero": faisceauDeLAiguillageZero,
    "passage-de-la-couronne-muette": passageDeLaCouronneMuette,
    "voie-de-tete-de-ligne": voieDeTeteDeLigne,
    "chemin-des-trois-veilles": cheminDesTroisVeilles,
    "piste-des-serres-de-verre": pisteDesSerresDeVerre,
    "rampe-du-seuil": rampeDuSeuil,
    "arc-ferroviaire-du-noeud": arcFerroviaireDuNoeud,
    "galerie-des-trois-phares": galerieDesTroisPhares,
    "porte-logistique-du-seuil": porteLogistiqueDuSeuil,
    "passage-de-la-couronne-ouverte": passageDeLaCouronneOuverte,
    "breche-de-secours-du-noeud": brecheDeSecoursDuNoeud,
    ...etatsReelsV7
  } = sansDevenirs.routes.etatsReels;
  void cheminDeLHospice;
  void chenalDeLHospice;
  void conduiteDuDeversoir;
  void passageDeLaLigneZero;
  void pisteDesLevees;
  void rampeDeBarriereNeuve;
  void voieDesPontsLourds;
  void embranchementDePompeNeuve;
  void galerieDesReservoirs;
  void rocadeDuMarche;
  void voieDesCiternes;
  void ligneDuSignalZero;
  void voieDesContremaitres;
  void traverseDesPorteurs;
  void rocadeDesRegulateurs;
  void derivationDesPuits;
  void faisceauDeLAiguillageZero;
  void passageDeLaCouronneMuette;
  void voieDeTeteDeLigne;
  void cheminDesTroisVeilles;
  void pisteDesSerresDeVerre;
  void rampeDuSeuil;
  void arcFerroviaireDuNoeud;
  void galerieDesTroisPhares;
  void porteLogistiqueDuSeuil;
  void passageDeLaCouronneOuverte;
  void brecheDeSecoursDuNoeud;
  const { topologieHistorique, ...routesV7 } = sansDevenirs.routes;
  void topologieHistorique;
  return {
    ...sansDevenirs,
    version: VERSION_SIMULATION_AVANT_DEVERSOIR,
    narration: narrationV7,
    hautPuits: hautPuitsV7,
    veilleBasse: {
      ...sansDevenirs.veilleBasse,
      cohorte: cohorteV7,
    },
    routes: {
      ...routesV7,
      etatsReels: etatsReelsV7,
    },
  };
}

function migrerSauvegardeV7AvecCatalogueHistorique(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_DEVERSOIR ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_DEVERSOIR ||
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

  const snapshotV7 = lireSnapshotV7(valeur.reproduction.snapshot);
  const etatDeclareV7 = lireEtatV7(valeur.etat);
  if (
    snapshotV7 === undefined ||
    etatDeclareV7 === undefined ||
    valeur.graine !== etatDeclareV7.graine ||
    valeur.horloge.secondes !== etatDeclareV7.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV7 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV7 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  let etat = promouvoirEtatV7PourReplay(snapshotV7);
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeV7(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommande(etat, entree.commande).etat;
      if (
        empreinteEtat(
          normaliserEtatCourantEnV7(etat) as unknown as EtatCampagne,
        ) !== entree.empreinteApres
      ) {
        return undefined;
      }
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(
      normaliserEtatCourantEnV7(etat),
      etatDeclareV7,
    )
  ) {
    return undefined;
  }

  const etatCourant = promouvoirEtatV7VersCourant(etatDeclareV7);
  if (
    lireSnapshotCourant(etatCourant) === undefined ||
    lireEtatCourant(etatCourant) === undefined
  ) {
    return undefined;
  }
  const reproduction: ReproductionDeCampagne = {
    snapshot: etatCourant,
    empreinteSnapshot: empreinteEtat(etatCourant),
    commandes: [],
  };
  const sauvegarde = creerSauvegarde(etatCourant, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

export function migrerSauvegardeV7(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  const evenementsDuDeversoirNeutralises =
    catalogueDEvenements.evenements
      .filter((evenement) => evenement.id.startsWith("bassins.deversoir."))
      .map((evenement) => ({
        ...evenement,
        conditions: {
          requises: [
            {
              type: "fait-present" as const,
              fait: "migration.v7.deversoir-indisponible",
            },
          ],
          interdites: [],
        },
      }));
  return executerAvecTronconsTemporaires(
    TRONCONS_HISTORIQUES_V6,
    () =>
      executerAvecEvenementsStructurelsTemporaires(
        [
          ...EVENEMENTS_HISTORIQUES_V7,
          ...evenementsDuDeversoirNeutralises,
        ],
        () => migrerSauvegardeV7AvecCatalogueHistorique(valeur),
      ),
  );
}

export function promouvoirEtatV8VersCourant(
  etat: EtatCampagneV8,
): EtatCampagne {
  const routesInitiales = creerEtatDesRoutesInitial();
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    routes: {
      ...etat.routes,
      etatsReels: {
        ...routesInitiales.etatsReels,
        ...etat.routes.etatsReels,
      },
    },
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
  };
}

function normaliserEtatCourantEnV8(
  etat: EtatCampagne,
): EtatCampagneV8 {
  const {
    denouement,
    trameDeFer,
    traverseLibre,
    ...sansTrame
  } = etat;
  void denouement;
  void trameDeFer;
  void traverseLibre;
  const {
    "rampe-de-barriere-neuve": rampeDeBarriereNeuve,
    "voie-des-ponts-lourds": voieDesPontsLourds,
    "embranchement-de-pompe-neuve": embranchementDePompeNeuve,
    "galerie-des-reservoirs": galerieDesReservoirs,
    "rocade-du-marche": rocadeDuMarche,
    "voie-des-citernes": voieDesCiternes,
    "ligne-du-signal-zero": ligneDuSignalZero,
    "voie-des-contremaitres": voieDesContremaitres,
    "traverse-des-porteurs": traverseDesPorteurs,
    "rocade-des-regulateurs": rocadeDesRegulateurs,
    "derivation-des-puits": derivationDesPuits,
    "faisceau-de-l-aiguillage-zero": faisceauDeLAiguillageZero,
    "passage-de-la-couronne-muette": passageDeLaCouronneMuette,
    "voie-de-tete-de-ligne": voieDeTeteDeLigne,
    "chemin-des-trois-veilles": cheminDesTroisVeilles,
    "piste-des-serres-de-verre": pisteDesSerresDeVerre,
    "rampe-du-seuil": rampeDuSeuil,
    "arc-ferroviaire-du-noeud": arcFerroviaireDuNoeud,
    "galerie-des-trois-phares": galerieDesTroisPhares,
    "porte-logistique-du-seuil": porteLogistiqueDuSeuil,
    "passage-de-la-couronne-ouverte": passageDeLaCouronneOuverte,
    "breche-de-secours-du-noeud": brecheDeSecoursDuNoeud,
    ...etatsReelsV8
  } = sansTrame.routes.etatsReels;
  void rampeDeBarriereNeuve;
  void voieDesPontsLourds;
  void embranchementDePompeNeuve;
  void galerieDesReservoirs;
  void rocadeDuMarche;
  void voieDesCiternes;
  void ligneDuSignalZero;
  void voieDesContremaitres;
  void traverseDesPorteurs;
  void rocadeDesRegulateurs;
  void derivationDesPuits;
  void faisceauDeLAiguillageZero;
  void passageDeLaCouronneMuette;
  void voieDeTeteDeLigne;
  void cheminDesTroisVeilles;
  void pisteDesSerresDeVerre;
  void rampeDuSeuil;
  void arcFerroviaireDuNoeud;
  void galerieDesTroisPhares;
  void porteLogistiqueDuSeuil;
  void passageDeLaCouronneOuverte;
  void brecheDeSecoursDuNoeud;
  return {
    ...sansTrame,
    version: VERSION_SIMULATION_AVANT_TRAME_DE_FER,
    routes: {
      ...sansTrame.routes,
      etatsReels: etatsReelsV8,
    },
  };
}

export function migrerSauvegardeV8(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_TRAME_DE_FER ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_TRAME_DE_FER ||
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

  const snapshotV8 = lireSnapshotV8(valeur.reproduction.snapshot);
  const etatDeclareV8 = lireEtatV8(valeur.etat);
  if (
    snapshotV8 === undefined ||
    etatDeclareV8 === undefined ||
    valeur.graine !== etatDeclareV8.graine ||
    valeur.horloge.secondes !== etatDeclareV8.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV8 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV8 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  let etat = promouvoirEtatV8VersCourant(snapshotV8);
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeV8(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommande(etat, entree.commande).etat;
      if (
        empreinteEtat(
          normaliserEtatCourantEnV8(etat) as unknown as EtatCampagne,
        ) !== entree.empreinteApres
      ) {
        return undefined;
      }
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(
      normaliserEtatCourantEnV8(etat),
      etatDeclareV8,
    )
  ) {
    return undefined;
  }

  const etatCourant = promouvoirEtatV8VersCourant(etatDeclareV8);
  if (
    lireSnapshotCourant(etatCourant) === undefined ||
    lireEtatCourant(etatCourant) === undefined
  ) {
    return undefined;
  }
  const reproduction: ReproductionDeCampagne = {
    snapshot: etatCourant,
    empreinteSnapshot: empreinteEtat(etatCourant),
    commandes: [],
  };
  const sauvegarde = creerSauvegarde(etatCourant, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

export function promouvoirEtatV9VersCourant(
  etat: EtatCampagneV9,
): EtatCampagne {
  const routesInitiales = creerEtatDesRoutesInitial();
  return {
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    routes: {
      ...etat.routes,
      etatsReels: {
        ...routesInitiales.etatsReels,
        ...etat.routes.etatsReels,
      },
    },
    traverseLibre: creerEtatInitialDeTraverseLibre(),
  };
}

function normaliserEtatCourantEnV9(
  etat: EtatCampagne,
): EtatCampagneV9 {
  const { denouement, traverseLibre, ...sansTraverse } = etat;
  void denouement;
  void traverseLibre;
  const {
    "embranchement-de-pompe-neuve": embranchementDePompeNeuve,
    "galerie-des-reservoirs": galerieDesReservoirs,
    "rocade-du-marche": rocadeDuMarche,
    "voie-des-citernes": voieDesCiternes,
    "ligne-du-signal-zero": ligneDuSignalZero,
    "voie-des-contremaitres": voieDesContremaitres,
    "traverse-des-porteurs": traverseDesPorteurs,
    "rocade-des-regulateurs": rocadeDesRegulateurs,
    "derivation-des-puits": derivationDesPuits,
    "faisceau-de-l-aiguillage-zero": faisceauDeLAiguillageZero,
    "passage-de-la-couronne-muette": passageDeLaCouronneMuette,
    "voie-de-tete-de-ligne": voieDeTeteDeLigne,
    "chemin-des-trois-veilles": cheminDesTroisVeilles,
    "piste-des-serres-de-verre": pisteDesSerresDeVerre,
    "rampe-du-seuil": rampeDuSeuil,
    "arc-ferroviaire-du-noeud": arcFerroviaireDuNoeud,
    "galerie-des-trois-phares": galerieDesTroisPhares,
    "porte-logistique-du-seuil": porteLogistiqueDuSeuil,
    "passage-de-la-couronne-ouverte": passageDeLaCouronneOuverte,
    "breche-de-secours-du-noeud": brecheDeSecoursDuNoeud,
    ...etatsReelsV9
  } = sansTraverse.routes.etatsReels;
  void embranchementDePompeNeuve;
  void galerieDesReservoirs;
  void rocadeDuMarche;
  void voieDesCiternes;
  void ligneDuSignalZero;
  void voieDesContremaitres;
  void traverseDesPorteurs;
  void rocadeDesRegulateurs;
  void derivationDesPuits;
  void faisceauDeLAiguillageZero;
  void passageDeLaCouronneMuette;
  void voieDeTeteDeLigne;
  void cheminDesTroisVeilles;
  void pisteDesSerresDeVerre;
  void rampeDuSeuil;
  void arcFerroviaireDuNoeud;
  void galerieDesTroisPhares;
  void porteLogistiqueDuSeuil;
  void passageDeLaCouronneOuverte;
  void brecheDeSecoursDuNoeud;
  return {
    ...sansTraverse,
    version: VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE,
    routes: {
      ...sansTraverse.routes,
      etatsReels: etatsReelsV9,
    },
  };
}

export function migrerSauvegardeV9(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_TRAVERSE_LIBRE ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE ||
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

  const snapshotV9 = lireSnapshotV9(valeur.reproduction.snapshot);
  const etatDeclareV9 = lireEtatV9(valeur.etat);
  if (
    snapshotV9 === undefined ||
    etatDeclareV9 === undefined ||
    valeur.graine !== etatDeclareV9.graine ||
    valeur.horloge.secondes !== etatDeclareV9.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV9 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV9 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  let etat = promouvoirEtatV9VersCourant(snapshotV9);
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeV9(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommande(etat, entree.commande).etat;
      if (
        empreinteEtat(
          normaliserEtatCourantEnV9(etat) as unknown as EtatCampagne,
        ) !== entree.empreinteApres
      ) {
        return undefined;
      }
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(
      normaliserEtatCourantEnV9(etat),
      etatDeclareV9,
    )
  ) {
    return undefined;
  }

  const etatCourant = promouvoirEtatV9VersCourant(etatDeclareV9);
  if (
    lireSnapshotCourant(etatCourant) === undefined ||
    lireEtatCourant(etatCourant) === undefined
  ) {
    return undefined;
  }
  const reproduction: ReproductionDeCampagne = {
    snapshot: etatCourant,
    empreinteSnapshot: empreinteEtat(etatCourant),
    commandes: [],
  };
  const sauvegarde = creerSauvegarde(etatCourant, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

function normaliserEtatCourantEnV4(
  etat: EtatCampagne,
): EtatCampagneV4 {
  const {
    denouement,
    veilleBasse,
    hautPuits,
    trameDeFer,
    traverseLibre,
    ...etatV4
  } = etat;
  void denouement;
  void veilleBasse;
  void hautPuits;
  void trameDeFer;
  void traverseLibre;
  const { causaliteHistorique, ...narrationV4 } = etatV4.narration;
  void causaliteHistorique;
  return {
    ...etatV4,
    version: VERSION_SIMULATION_AVANT_VEILLE_BASSE,
    narration: narrationV4,
  };
}

export function promouvoirEtatV5VersCourant(
  etat: EtatCampagneV5,
): EtatCampagne {
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire({
    ...etat,
    version: VERSION_SIMULATION_COURANTE,
    denouement: CAMPAGNE_EN_COURS,
    hautPuits: creerEtatDeHautPuitsInitial(),
    trameDeFer: creerEtatInitialDeLaTrameDeFer(),
    traverseLibre: creerEtatInitialDeTraverseLibre(),
    devenirsDesSites: null,
  });
}

function normaliserEtatCourantEnV5(
  etat: EtatCampagne,
): EtatCampagneV5 {
  const {
    denouement,
    hautPuits,
    trameDeFer,
    traverseLibre,
    ...etatV5
  } = etat;
  void denouement;
  void hautPuits;
  void trameDeFer;
  void traverseLibre;
  const { causaliteHistorique, ...narrationV5 } = etatV5.narration;
  void causaliteHistorique;
  return {
    ...etatV5,
    version: VERSION_SIMULATION_AVANT_HAUT_PUITS,
    narration: narrationV5,
  };
}

function appliquerCommandeSelonCatalogueAvantHautPuits(
  etat: EtatCampagne,
  commande: Parameters<typeof appliquerCommande>[1],
): EtatCampagne {
  const evenementActifAvant = etat.narration.evenementActif;
  const applique = appliquerCommande(etat, commande).etat;
  const nouvelEvenement = applique.narration.evenementActif;
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire(
    evenementActifAvant === null &&
      commande.type === "temps-du-convoi.ecouler" &&
      nouvelEvenement?.startsWith("bassins.haut-puits.") === true
      ? {
          ...applique,
          narration: {
            ...applique.narration,
            evenementActif: null,
          },
        }
      : applique,
  );
}

function migrerSauvegardeV5AvecCatalogueHistorique(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_HAUT_PUITS ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_HAUT_PUITS ||
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

  const snapshotV5 = lireSnapshotV5(valeur.reproduction.snapshot);
  const etatDeclareV5 = lireEtatV5(valeur.etat);
  if (
    snapshotV5 === undefined ||
    etatDeclareV5 === undefined ||
    valeur.graine !== etatDeclareV5.graine ||
    valeur.horloge.secondes !== etatDeclareV5.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV5 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV5 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  const snapshot = promouvoirEtatV5VersCourant(snapshotV5);
  let etat = snapshot;
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeV5(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommandeSelonCatalogueAvantHautPuits(
        etat,
        entree.commande,
      );
      if (
        empreinteEtat(
          normaliserEtatCourantEnV5(etat) as unknown as EtatCampagne,
        ) !== entree.empreinteApres
      ) {
        return undefined;
      }
    }
  } catch {
    return undefined;
  }

  if (
    !sontStructurellementEgaux(
      normaliserEtatCourantEnV5(etat),
      etatDeclareV5,
    ) ||
    lireSnapshotCourant(snapshot) === undefined ||
    lireEtatCourant(etat) === undefined
  ) {
    return undefined;
  }

  const reproduction: ReproductionDeCampagne = {
    snapshot: etat,
    empreinteSnapshot: empreinteEtat(etat),
    commandes: [],
  };
  const sauvegarde = creerSauvegarde(etat, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

export function migrerSauvegardeV5(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  return executerAvecEvenementsStructurelsTemporaires(
    EVENEMENTS_HISTORIQUES_V5,
    () => migrerSauvegardeV5AvecCatalogueHistorique(valeur),
  );
}

function ancienConflitDeHautPuitsEstEligible(
  etat: EtatCampagne,
): boolean {
  return (
    etat.tempsDuConvoi.secondes >= 360 &&
    etat.tempsDuConvoi.secondes <= 24_000 &&
    etat.routes.jalons.length > 0 &&
    !etat.narration.evenementsJoues.includes(
      "bassins-fendus.eau-de-haut-puits",
    ) &&
    etat.narration.faitsDeCampagne.some(
      (fait) =>
        fait.id === "prologue.ilyana-ecoutee" ||
        fait.id === "prologue.ilyana-contredite",
    )
  );
}

function appliquerCommandeSelonCatalogueAvantVeilleBasse(
  etat: EtatCampagne,
  commande: Parameters<typeof appliquerCommande>[1],
): EtatCampagne {
  const evenementActifAvant = etat.narration.evenementActif;
  const applique = appliquerCommande(etat, commande).etat;
  const nouvelEvenement = applique.narration.evenementActif;
  const doitRetablirAncienConflit =
    evenementActifAvant === null &&
    commande.type === "temps-du-convoi.ecouler" &&
    ancienConflitDeHautPuitsEstEligible(applique);
  if (
    evenementActifAvant === null &&
    commande.type === "temps-du-convoi.ecouler" &&
    (doitRetablirAncienConflit ||
      nouvelEvenement?.startsWith("veille-basse.") === true)
  ) {
    return marquerCausaliteHistoriqueDeNarrationSiNecessaire({
      ...applique,
      narration: {
        ...applique.narration,
        evenementActif: doitRetablirAncienConflit
          ? "bassins-fendus.eau-de-haut-puits"
          : null,
      },
    });
  }
  return marquerCausaliteHistoriqueDeNarrationSiNecessaire(applique);
}

function creerReproductionMigree(
  snapshot: EtatCampagne,
  etat: EtatCampagne,
  commandes: readonly CommandeDeReproduction[],
): ReproductionDeCampagne {
  const routageHistoriqueNonRejouable =
    etat.routes.position === "veille-basse" &&
    (etat.narration.evenementActif ===
      "bassins-fendus.eau-de-haut-puits" ||
      etat.narration.evenementsJoues.includes(
        "bassins-fendus.eau-de-haut-puits",
      ));
  return routageHistoriqueNonRejouable
    ? {
        snapshot: etat,
        empreinteSnapshot: empreinteEtat(etat),
        commandes: [],
      }
    : {
        snapshot,
        empreinteSnapshot: empreinteEtat(snapshot),
        commandes,
      };
}

export function migrerSauvegardeV4(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_VEILLE_BASSE ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_VEILLE_BASSE ||
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

  const snapshotV4 = lireSnapshotV4(valeur.reproduction.snapshot);
  const etatDeclareV4 = lireEtatV4(valeur.etat);
  if (
    snapshotV4 === undefined ||
    etatDeclareV4 === undefined ||
    valeur.graine !== etatDeclareV4.graine ||
    valeur.horloge.secondes !== etatDeclareV4.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV4 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV4 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  const snapshot = promouvoirEtatV4VersCourant(snapshotV4);
  let etat = snapshot;
  const commandes: CommandeDeReproduction[] = [];
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommande(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommandeSelonCatalogueAvantVeilleBasse(
        etat,
        entree.commande,
      );
      const empreinteLegacy = empreinteEtat(
        normaliserEtatCourantEnV4(etat) as unknown as EtatCampagne,
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
      normaliserEtatCourantEnV4(etat),
      etatDeclareV4,
    ) ||
    lireSnapshotCourant(snapshot) === undefined ||
    lireEtatCourant(etat) === undefined
  ) {
    return undefined;
  }

  const reproduction = creerReproductionMigree(snapshot, etat, commandes);
  const sauvegarde = creerSauvegarde(etat, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
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

  const ignorerFaitAnnonceur = etatDeclareV2.narration.faitsDeCampagne.some(
    (fait) => fait.id === FAIT_ANNONCANT_LA_CRISE,
  );
  const snapshot = migrerEtatV2(snapshotV2, ignorerFaitAnnonceur);
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
      etat = appliquerCommandeSelonCatalogueAvantVeilleBasse(
        etat,
        entree.commande,
      );
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
    lireSnapshotCourant(snapshot) === undefined ||
    lireEtatCourant(etat) === undefined
  ) {
    return undefined;
  }

  const reproduction = creerReproductionMigree(snapshot, etat, commandes);
  const sauvegarde = creerSauvegarde(etat, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
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
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_CRISES ||
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

  const ignorerFaitAnnonceur =
    etatDeclareAvantRoutes.narration.faitsDeCampagne.some(
      (fait) => fait.id === FAIT_ANNONCANT_LA_CRISE,
    );
  const snapshot = migrerEtatAvantRoutes(
    snapshotAvantRoutes,
    ignorerFaitAnnonceur,
  );
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
      etat = appliquerCommandeSelonCatalogueAvantVeilleBasse(
        etat,
        entree.commande,
      );
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
    lireSnapshotCourant(snapshot) === undefined ||
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
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}

export function migrerSauvegardeV2(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  return estObjet(valeur.versions) &&
    valeur.versions.simulation === VERSION_SIMULATION_AVANT_CRISES
    ? migrerSauvegardeAvantRoutes(valeur)
    : migrerSauvegardeV2Legacy(valeur);
}

export function migrerSauvegardeV3(
  valeur: ObjetInconnu,
): SauvegardeCampagne | undefined {
  if (
    valeur.format !== FORMAT_SAUVEGARDE ||
    typeof valeur.id !== "string" ||
    valeur.version !== VERSION_SAUVEGARDE_AVANT_CRISES ||
    !estObjet(valeur.versions) ||
    valeur.versions.simulation !== VERSION_SIMULATION_AVANT_CRISES ||
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

  const snapshotV3 = lireEtatAvantCrises(valeur.reproduction.snapshot);
  const etatDeclareV3 = lireEtatAvantCrises(valeur.etat);
  if (
    snapshotV3 === undefined ||
    etatDeclareV3 === undefined ||
    valeur.graine !== etatDeclareV3.graine ||
    valeur.horloge.secondes !== etatDeclareV3.tempsDuConvoi.secondes ||
    empreinteEtat(snapshotV3 as unknown as EtatCampagne) !==
      valeur.reproduction.empreinteSnapshot ||
    empreinteEtat(etatDeclareV3 as unknown as EtatCampagne) !== valeur.empreinte
  ) {
    return undefined;
  }

  const ignorerFaitAnnonceur = etatDeclareV3.narration.faitsDeCampagne.some(
    (fait) => fait.id === FAIT_ANNONCANT_LA_CRISE,
  );
  const snapshot = migrerEtatAvantCrises(
    snapshotV3,
    ignorerFaitAnnonceur,
  );
  let etat = snapshot;
  const commandes: CommandeDeReproduction[] = [];
  try {
    for (const [index, entree] of valeur.reproduction.commandes.entries()) {
      if (
        !estObjet(entree) ||
        entree.sequence !== index ||
        !estCommandeAvantCrises(entree.commande) ||
        typeof entree.empreinteApres !== "string" ||
        !EMPREINTE.test(entree.empreinteApres)
      ) {
        return undefined;
      }
      etat = appliquerCommandeSelonCatalogueAvantVeilleBasse(
        etat,
        entree.commande,
      );
      const empreinteLegacy = empreinteEtat(
        normaliserEtatAvantCrises(etat) as unknown as EtatCampagne,
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
      normaliserEtatAvantCrises(etat),
      etatDeclareV3,
    ) ||
    lireSnapshotCourant(snapshot) === undefined ||
    lireEtatCourant(etat) === undefined
  ) {
    return undefined;
  }

  const reproduction = creerReproductionMigree(snapshot, etat, commandes);
  const sauvegarde = creerSauvegarde(etat, reproduction);
  return {
    ...sauvegarde,
    id: `${valeur.id}-v${VERSION_SAUVEGARDE_COURANTE}-${sauvegarde.empreinte}`,
  };
}
