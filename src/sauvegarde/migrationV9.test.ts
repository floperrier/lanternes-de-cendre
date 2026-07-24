import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
} from "../simulation/campagne";
import { creerEtatInitialDeTraverseLibre } from "../simulation/traverseLibre";
import {
  VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE,
  VERSION_SIMULATION_COURANTE,
} from "../simulation/versions";
import { importerSauvegarde } from "./portable";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_TRAVERSE_LIBRE,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";

function normaliserEnV9(etat: EtatCampagne) {
  const { traverseLibre, ...sansTraverse } = structuredClone(etat);
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
    ...etatsReels
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
  return {
    ...sansTraverse,
    version: VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE,
    routes: { ...sansTraverse.routes, etatsReels },
  };
}

describe("migration v9 avant Traverse-Libre", () => {
  it("valide le replay puis ajoute la Colonie et ses deux routes v10", () => {
    const snapshotCourant = creerCampagneInitiale("CENDRE-MIGRATION-V9");
    const commande = {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 2,
    } as const;
    const etatCourant = appliquerCommande(snapshotCourant, commande).etat;
    const snapshot = normaliserEnV9(snapshotCourant);
    const etat = normaliserEnV9(etatCourant);
    const empreinteSnapshot = empreinteEtat(
      snapshot as unknown as EtatCampagne,
    );
    const empreinte = empreinteEtat(etat as unknown as EtatCampagne);
    const archive = {
      format: FORMAT_SAUVEGARDE,
      id: "archive-v9",
      version: VERSION_SAUVEGARDE_AVANT_TRAVERSE_LIBRE,
      versions: {
        ...VERSIONS_DU_SNAPSHOT_COURANT,
        simulation: VERSION_SIMULATION_AVANT_TRAVERSE_LIBRE,
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
          traverseLibre: creerEtatInitialDeTraverseLibre(),
          routes: {
            etatsReels: {
              "embranchement-de-pompe-neuve": "degrade",
              "galerie-des-reservoirs": "degrade",
            },
          },
        },
      },
    });
  });
});
