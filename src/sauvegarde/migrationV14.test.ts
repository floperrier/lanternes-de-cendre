import { describe, expect, it } from "vitest";

import {
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
  type FaitDeCampagne,
} from "../simulation/campagne";
import { VERSION_SIMULATION_AVANT_CRISE_DU_HALO } from "../simulation/versions";
import {
  migrerSauvegardeV14,
  promouvoirEtatV14VersCourant,
} from "./migration";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_CRISE_DU_HALO,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import type { EtatCampagneV14, ObjetInconnu } from "./validation";

function normaliserEnV14(etat: EtatCampagne): EtatCampagneV14 {
  const { crisesDuHaloHistoriquesIgnorees: _marqueur, ...crises } =
    etat.crises;
  void _marqueur;
  return {
    ...etat,
    version: VERSION_SIMULATION_AVANT_CRISE_DU_HALO,
    crises,
  };
}

function archiveV14(etat: EtatCampagne): ObjetInconnu {
  const etatV14 = normaliserEnV14(etat);
  const empreinte = empreinteEtat(etatV14 as unknown as EtatCampagne);
  return {
    format: FORMAT_SAUVEGARDE,
    id: `archive-v14-${empreinte}`,
    version: VERSION_SAUVEGARDE_AVANT_CRISE_DU_HALO,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_CRISE_DU_HALO,
    },
    graine: etatV14.graine,
    horloge: { secondes: etatV14.tempsDuConvoi.secondes },
    etat: etatV14,
    reproduction: {
      snapshot: etatV14,
      empreinteSnapshot: empreinte,
      commandes: [],
    },
    empreinte,
  };
}

function faitDeClef(): FaitDeCampagne {
  return {
    id: "couronne.ouverture.clef-collective",
    cause: "couronne.ouverture.ilyana-maelys-et-la-clef",
    acteurs: ["porte-lanterne"],
    cible: "clef-du-noeud",
    moment: 5_000,
    effets: { materiels: [], humains: [] },
  };
}

describe("migration v14 vers la Crise de saturation du Halo", () => {
  it("migre une archive antérieure à la clef sans neutraliser la future Crise", () => {
    const migration = migrerSauvegardeV14(
      archiveV14(creerCampagneInitiale("MIGRATION-V14-AVANT-HALO")),
    );

    expect(migration).toBeDefined();
    expect(migration).toMatchObject({
      version: VERSION_SAUVEGARDE_COURANTE,
      versions: { simulation: 15 },
      etat: {
        version: 15,
        crises: {
          crisesDuHaloHistoriquesIgnorees: false,
          alerte: null,
          criseActive: null,
        },
      },
      reproduction: { commandes: [] },
    });
  });

  it("neutralise la Crise rétroactive lorsqu’une clef était déjà consignée en v14", () => {
    const initial = creerCampagneInitiale("MIGRATION-V14-APRES-CLEF");
    const etatV14 = normaliserEnV14({
      ...initial,
      tempsDuConvoi: { secondes: 5_000, vitesse: 0 },
      narration: {
        ...initial.narration,
        faitsDeCampagne: [faitDeClef()],
      },
    });

    expect(promouvoirEtatV14VersCourant(etatV14).crises).toMatchObject({
      crisesDuHaloHistoriquesIgnorees: true,
      alerte: null,
      criseActive: null,
    });
  });
});
