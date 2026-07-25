import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
} from "../simulation/campagne";
import { creerCheckpointApresCascadeEvitee } from "./checkpointTrameHistorique.fixture";
import { VERSION_SIMULATION_AVANT_CALIBRAGE_CAUSAL } from "../simulation/versions";
import { migrerSauvegardeV16 } from "./migration";
import { importerSauvegarde } from "./portable";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_CALIBRAGE_CAUSAL,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import type { EtatCampagneV16, ObjetInconnu } from "./validation";

function normaliserEnV16(etat: EtatCampagne): EtatCampagneV16 {
  return {
    ...etat,
    version: VERSION_SIMULATION_AVANT_CALIBRAGE_CAUSAL,
  };
}

function archiveV16AvecJournal(
  snapshot: EtatCampagne,
  commande: CommandeCampagne,
  etat: EtatCampagne,
): ObjetInconnu {
  const snapshotV16 = normaliserEnV16(snapshot);
  const etatV16 = normaliserEnV16(etat);
  const empreinteSnapshot = empreinteEtat(
    snapshotV16 as unknown as EtatCampagne,
  );
  const empreinte = empreinteEtat(etatV16 as unknown as EtatCampagne);
  return {
    format: FORMAT_SAUVEGARDE,
    id: `archive-v16-cascade-${empreinte}`,
    version: VERSION_SAUVEGARDE_AVANT_CALIBRAGE_CAUSAL,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_CALIBRAGE_CAUSAL,
    },
    graine: etatV16.graine,
    horloge: { secondes: etatV16.tempsDuConvoi.secondes },
    etat: etatV16,
    reproduction: {
      snapshot: snapshotV16,
      empreinteSnapshot,
      commandes: [
        {
          sequence: 0,
          commande,
          empreinteApres: empreinte,
        },
      ],
    },
    empreinte,
  };
}

function archiveV16TraversantLaCascade(): ObjetInconnu {
  const checkpoint = creerCheckpointApresCascadeEvitee(
    "MIGRATION-V16-TRAVERSE-CASCADE",
    "historiques-v16",
  );
  return archiveV16AvecJournal(
    checkpoint.avantFait,
    checkpoint.commandeDuFait,
    checkpoint.apresFait,
  );
}

function archiveV16ApresCascadeEvitee(): ObjetInconnu {
  const checkpoint = creerCheckpointApresCascadeEvitee(
    "MIGRATION-V16-APRES-CASCADE",
    "historiques-v16",
  );
  const commande = {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 1,
  } as const;
  const etat = appliquerCommande(checkpoint.apresFait, commande, {
    crises: "historiques-v16",
  }).etat;
  return archiveV16AvecJournal(checkpoint.apresFait, commande, etat);
}

describe("migration v16 avant le calibrage causal de la Trame", () => {
  it("rejoue un journal non vide sans semer rétroactivement la cascade", () => {
    const archive = archiveV16TraversantLaCascade();
    const migration = migrerSauvegardeV16(archive);

    expect(migration).toBeDefined();
    expect(migration).toMatchObject({
      version: VERSION_SAUVEGARDE_COURANTE,
      versions: { simulation: 17 },
      etat: {
        version: 17,
        crises: {
          crisesDeTrameHistoriquesIgnorees: true,
          alerte: null,
          criseActive: null,
        },
      },
      reproduction: { commandes: [] },
    });
    expect(importerSauvegarde(JSON.stringify(archive))).toMatchObject({
      statut: "migree",
      sauvegarde: {
        version: VERSION_SAUVEGARDE_COURANTE,
        etat: {
          version: 17,
          crises: {
            crisesDeTrameHistoriquesIgnorees: true,
            alerte: null,
          },
        },
      },
    });
  });

  it("préserve un checkpoint postérieur au Fait avant d’ajouter le marqueur v17", () => {
    const migration = migrerSauvegardeV16(
      archiveV16ApresCascadeEvitee(),
    );

    expect(migration).toMatchObject({
      version: VERSION_SAUVEGARDE_COURANTE,
      etat: {
        version: 17,
        tempsDuConvoi: { vitesse: 1 },
        crises: {
          crisesDeTrameHistoriquesIgnorees: true,
          alerte: null,
          criseActive: null,
        },
      },
      reproduction: { commandes: [] },
    });
  });
});
