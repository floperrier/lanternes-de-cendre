import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
  type FaitDeCampagne,
} from "../simulation/campagne";
import {
  executerCampagneHeadless,
  STRATEGIES_D_EQUILIBRAGE,
} from "../diagnostic/equilibrageCampagne";
import { creerCheckpointApresCascadeEvitee } from "./checkpointTrameHistorique.fixture";
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

function archiveV14AvecJournal(
  snapshot: EtatCampagne,
  commande: CommandeCampagne,
  etat: EtatCampagne,
): ObjetInconnu {
  const snapshotV14 = normaliserEnV14(snapshot);
  const etatV14 = normaliserEnV14(etat);
  const empreinteSnapshot = empreinteEtat(
    snapshotV14 as unknown as EtatCampagne,
  );
  const empreinte = empreinteEtat(etatV14 as unknown as EtatCampagne);
  return {
    format: FORMAT_SAUVEGARDE,
    id: `archive-v14-journal-${empreinte}`,
    version: VERSION_SAUVEGARDE_AVANT_CRISE_DU_HALO,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_CRISE_DU_HALO,
    },
    graine: etatV14.graine,
    horloge: { secondes: etatV14.tempsDuConvoi.secondes },
    etat: etatV14,
    reproduction: {
      snapshot: snapshotV14,
      empreinteSnapshot,
      commandes: [{ sequence: 0, commande, empreinteApres: empreinte }],
    },
    empreinte,
  };
}

function archiveV14ApresCascadeEvitee(): ObjetInconnu {
  const checkpoint = creerCheckpointApresCascadeEvitee(
    "MIGRATION-V14-APRES-CASCADE",
    "historiques-v14",
  );
  const commande = {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 1,
  } as const;
  const etat = appliquerCommande(checkpoint.apresFait, commande, {
    crises: "historiques-v14",
  }).etat;
  return archiveV14AvecJournal(checkpoint.apresFait, commande, etat);
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

function archiveV14TraversantLaClef(): ObjetInconnu {
  const estFaitDeClef = (id: string) =>
    id === "couronne.ouverture.clef-collective" ||
    id === "couronne.ouverture.clef-confiee-aux-gardiennes";
  const strategie = STRATEGIES_D_EQUILIBRAGE.find(
    ({ id }) => id === "vitesse-sous-contrainte",
  )!;
  const campagne = executerCampagneHeadless({
    graine: "MIGRATION-V14-TRAVERSE-CLEF",
    strategie,
    tracerEmpreintes: true,
    versionRegles: 3,
  });
  let snapshot = creerCampagneInitiale(campagne.graine);
  let commandeDeClef: CommandeCampagne | undefined;
  let etatApresClef: EtatCampagne | undefined;

  for (const etape of campagne.commandes) {
    const candidate = appliquerCommande(snapshot, etape.commande, {
      crises: "historiques-v14",
    }).etat;
    if (
      candidate.narration.faitsDeCampagne.some(
        ({ id }) => estFaitDeClef(id),
      ) &&
      !snapshot.narration.faitsDeCampagne.some(
        ({ id }) => estFaitDeClef(id),
      )
    ) {
      commandeDeClef = etape.commande;
      etatApresClef = candidate;
      break;
    }
    snapshot = candidate;
  }
  if (commandeDeClef === undefined || etatApresClef === undefined) {
    throw new Error("La campagne de migration n’atteint pas la clef.");
  }

  const snapshotV14 = normaliserEnV14(snapshot);
  const etatV14 = normaliserEnV14(etatApresClef);
  const empreinteSnapshot = empreinteEtat(
    snapshotV14 as unknown as EtatCampagne,
  );
  const empreinte = empreinteEtat(etatV14 as unknown as EtatCampagne);
  return {
    format: FORMAT_SAUVEGARDE,
    id: `archive-v14-clef-${empreinte}`,
    version: VERSION_SAUVEGARDE_AVANT_CRISE_DU_HALO,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_CRISE_DU_HALO,
    },
    graine: etatV14.graine,
    horloge: { secondes: etatV14.tempsDuConvoi.secondes },
    etat: etatV14,
    reproduction: {
      snapshot: snapshotV14,
      empreinteSnapshot,
      commandes: [
        {
          sequence: 0,
          commande: commandeDeClef,
          empreinteApres: empreinte,
        },
      ],
    },
    empreinte,
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
      versions: { simulation: 17 },
      etat: {
        version: 17,
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

  it("préserve un checkpoint postérieur à une cascade évitée", () => {
    const migration = migrerSauvegardeV14(
      archiveV14ApresCascadeEvitee(),
    );

    expect(migration).toMatchObject({
      version: VERSION_SAUVEGARDE_COURANTE,
      etat: {
        version: 17,
        tempsDuConvoi: { vitesse: 1 },
        crises: {
          crisesDeTrameHistoriquesIgnorees: true,
          crisesDuHaloHistoriquesIgnorees: false,
          alerte: null,
          criseActive: null,
        },
      },
      reproduction: { commandes: [] },
    });
  });

  it("rejoue un journal v14 non vide qui traverse la consignation de la clef", () => {
    const migration = migrerSauvegardeV14(
      archiveV14TraversantLaClef(),
    );

    expect(migration).toBeDefined();
    expect(migration?.reproduction.commandes).toEqual([]);
    expect(
      migration?.etat.narration.faitsDeCampagne.some(({ id }) =>
        /^couronne\.ouverture\.clef-(collective|confiee-aux-gardiennes)$/.test(
          id,
        ),
      ),
    ).toBe(true);
    expect(migration?.etat.denouement.statut).toBe("en-cours");
  });
});
