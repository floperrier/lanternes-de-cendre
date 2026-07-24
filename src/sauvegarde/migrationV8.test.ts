import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
} from "../simulation/campagne";
import { creerEtatInitialDeLaTrameDeFer } from "../simulation/trameFer";
import { creerEtatInitialDeTraverseLibre } from "../simulation/traverseLibre";
import {
  VERSION_SIMULATION_AVANT_TRAME_DE_FER,
  VERSION_SIMULATION_COURANTE,
} from "../simulation/versions";
import { importerSauvegarde } from "./portable";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_TRAME_DE_FER,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";

function normaliserEnV8(etat: EtatCampagne) {
  const { trameDeFer, traverseLibre, ...sansTrame } =
    structuredClone(etat);
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
    ...etatsReels
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
    routes: { ...sansTrame.routes, etatsReels },
  };
}

describe("migration v8 avant la Trame de Fer", () => {
  it("valide le replay puis ajoute l’état initial et les deux routes v9", () => {
    const snapshotCourant = creerCampagneInitiale("CENDRE-MIGRATION-V8");
    const commande = {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 2,
    } as const;
    const etatCourant = appliquerCommande(snapshotCourant, commande).etat;
    const snapshot = normaliserEnV8(snapshotCourant);
    const etat = normaliserEnV8(etatCourant);
    const empreinteSnapshot = empreinteEtat(
      snapshot as unknown as EtatCampagne,
    );
    const empreinte = empreinteEtat(etat as unknown as EtatCampagne);
    const archive = {
      format: FORMAT_SAUVEGARDE,
      id: "archive-v8",
      version: VERSION_SAUVEGARDE_AVANT_TRAME_DE_FER,
      versions: {
        ...VERSIONS_DU_SNAPSHOT_COURANT,
        simulation: VERSION_SIMULATION_AVANT_TRAME_DE_FER,
      },
      graine: etat.graine,
      horloge: { secondes: etat.tempsDuConvoi.secondes },
      etat,
      reproduction: {
        snapshot,
        empreinteSnapshot,
        commandes: [{ sequence: 0, commande, empreinteApres: empreinte }],
      },
      empreinte,
    };

    const importation = importerSauvegarde(JSON.stringify(archive));

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        version: VERSION_SAUVEGARDE_COURANTE,
        versions: { simulation: VERSION_SIMULATION_COURANTE },
        etat: {
          version: VERSION_SIMULATION_COURANTE,
          tempsDuConvoi: { vitesse: 2 },
          trameDeFer: creerEtatInitialDeLaTrameDeFer(),
          traverseLibre: creerEtatInitialDeTraverseLibre(),
          routes: {
            etatsReels: {
              "rampe-de-barriere-neuve": "praticable",
              "voie-des-ponts-lourds": "degrade",
            },
          },
        },
      },
    });
  });
});
