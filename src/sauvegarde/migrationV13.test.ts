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
import { VERSION_SIMULATION_AVANT_CRISE_DE_TRAME } from "../simulation/versions";
import {
  migrerSauvegardeV13,
  promouvoirEtatV13VersCourant,
} from "./migration";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_AVANT_CRISE_DE_TRAME,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import type { EtatCampagneV13, ObjetInconnu } from "./validation";

function normaliserEnV13(etat: EtatCampagne): EtatCampagneV13 {
  const {
    crisesDeTrameHistoriquesIgnorees: _marqueur,
    crisesDuHaloHistoriquesIgnorees: _marqueurHalo,
    ...crises
  } = etat.crises;
  void _marqueur;
  void _marqueurHalo;
  return {
    ...etat,
    version: VERSION_SIMULATION_AVANT_CRISE_DE_TRAME,
    crises,
  };
}

function archiveV13(etat: EtatCampagne): ObjetInconnu {
  const etatV13 = normaliserEnV13(etat);
  const empreinte = empreinteEtat(etatV13 as unknown as EtatCampagne);
  return {
    format: FORMAT_SAUVEGARDE,
    id: `archive-v13-${empreinte}`,
    version: VERSION_SAUVEGARDE_AVANT_CRISE_DE_TRAME,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_CRISE_DE_TRAME,
    },
    graine: etatV13.graine,
    horloge: { secondes: etatV13.tempsDuConvoi.secondes },
    etat: etatV13,
    reproduction: {
      snapshot: etatV13,
      empreinteSnapshot: empreinte,
      commandes: [],
    },
    empreinte,
  };
}

function archiveV13TraversantLaClef(): ObjetInconnu {
  const estFaitDeClef = (id: string) =>
    id === "couronne.ouverture.clef-collective" ||
    id === "couronne.ouverture.clef-confiee-aux-gardiennes";
  const strategie = STRATEGIES_D_EQUILIBRAGE.find(
    ({ id }) => id === "vitesse-sous-contrainte",
  )!;
  const campagne = executerCampagneHeadless({
    graine: "MIGRATION-V13-TRAVERSE-CLEF",
    strategie,
    tracerEmpreintes: true,
  });
  let snapshot = creerCampagneInitiale(campagne.graine);
  let commandeDeClef: CommandeCampagne | undefined;
  let etatApresClef: EtatCampagne | undefined;

  for (const etape of campagne.commandes) {
    const candidate = appliquerCommande(snapshot, etape.commande).etat;
    if (
      candidate.narration.faitsDeCampagne.some(
        ({ id }) => estFaitDeClef(id),
      ) &&
      !snapshot.narration.faitsDeCampagne.some(
        ({ id }) => estFaitDeClef(id),
      )
    ) {
      commandeDeClef = etape.commande;
      etatApresClef = {
        ...candidate,
        crises: {
          ...candidate.crises,
          alerte: null,
        },
      };
      break;
    }
    snapshot = candidate;
  }
  if (commandeDeClef === undefined || etatApresClef === undefined) {
    throw new Error("La campagne de migration n’atteint pas la clef.");
  }

  const snapshotV13 = normaliserEnV13(snapshot);
  const etatV13 = normaliserEnV13(etatApresClef);
  const empreinteSnapshot = empreinteEtat(
    snapshotV13 as unknown as EtatCampagne,
  );
  const empreinte = empreinteEtat(etatV13 as unknown as EtatCampagne);
  return {
    format: FORMAT_SAUVEGARDE,
    id: `archive-v13-clef-${empreinte}`,
    version: VERSION_SAUVEGARDE_AVANT_CRISE_DE_TRAME,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SIMULATION_AVANT_CRISE_DE_TRAME,
    },
    graine: etatV13.graine,
    horloge: { secondes: etatV13.tempsDuConvoi.secondes },
    etat: etatV13,
    reproduction: {
      snapshot: snapshotV13,
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

function faitDeRefroidissement(): FaitDeCampagne {
  return {
    id: "trame.grand-aiguillage.refroidissement-rationne",
    cause: "trame.grand-aiguillage.l-eau-des-machines",
    acteurs: ["porte-lanterne", "ateliers-grand-aiguillage"],
    cible: "grand-aiguillage",
    moment: 2_400,
    effets: { materiels: [], humains: [] },
  };
}

describe("migration v13 vers la Crise matérielle de la Trame", () => {
  it("migre et rejoue une archive antérieure au Fait sans neutraliser la future Crise", () => {
    const migration = migrerSauvegardeV13(
      archiveV13(creerCampagneInitiale("MIGRATION-V13-AVANT-TRAME")),
    );

    expect(migration).toBeDefined();
    expect(migration).toMatchObject({
      version: VERSION_SAUVEGARDE_COURANTE,
      versions: { simulation: 16 },
      etat: {
        version: 16,
        crises: {
          crisesDeTrameHistoriquesIgnorees: false,
          alerte: null,
          criseActive: null,
        },
      },
      reproduction: { commandes: [] },
    });
  });

  it("marque comme historique un Fait de refroidissement déjà présent sans semer de Crise rétroactive", () => {
    const initial = creerCampagneInitiale("MIGRATION-V13-APRES-FAIT");
    const etatV13 = normaliserEnV13({
      ...initial,
      tempsDuConvoi: { secondes: 2_400, vitesse: 0 },
      narration: {
        ...initial.narration,
        faitsDeCampagne: [faitDeRefroidissement()],
      },
    });

    expect(promouvoirEtatV13VersCourant(etatV13).crises).toMatchObject({
      crisesDeTrameHistoriquesIgnorees: true,
      alerte: null,
      criseActive: null,
    });
  });

  it("rejoue une archive v13 dont le journal traverse la consignation de la clef", () => {
    const migration = migrerSauvegardeV13(
      archiveV13TraversantLaClef(),
    );

    expect(migration).toBeDefined();
    expect(migration?.etat.crises).toMatchObject({
      crisesDuHaloHistoriquesIgnorees: true,
      alerte: null,
      criseActive: null,
    });
    expect(
      migration?.etat.narration.faitsDeCampagne.map(({ id }) => id),
    ).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^couronne\.ouverture\.clef-(collective|confiee-aux-gardiennes)$/,
        ),
      ]),
    );
  });
});
