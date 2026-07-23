import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
} from "../simulation/campagne";
import { creerEtatInitialDeLaTrameDeFer } from "../simulation/trameFer";
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
  const { trameDeFer, ...sansTrame } = structuredClone(etat);
  void trameDeFer;
  const {
    "rampe-de-barriere-neuve": rampeDeBarriereNeuve,
    "voie-des-ponts-lourds": voieDesPontsLourds,
    ...etatsReels
  } = sansTrame.routes.etatsReels;
  void rampeDeBarriereNeuve;
  void voieDesPontsLourds;
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
