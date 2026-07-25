import { describe, expect, it } from "vitest";

import {
  STRATEGIES_D_EQUILIBRAGE,
  executerCampagneHeadless,
} from "../diagnostic/equilibrageCampagne";
import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type EtatCampagne,
} from "../simulation/campagne";
import { reconstruireDenouementReussi } from "../simulation/denouement";
import {
  VERSION_SIMULATION_COURANTE,
} from "../simulation/versions";
import {
  creerReproductionInitiale,
  creerSauvegarde,
  exporterSauvegarde,
  importerSauvegarde,
  rejouerReproduction,
} from "./sauvegarde";
import {
  FORMAT_SAUVEGARDE,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";

function parcoursConclu(): {
  readonly etat: EtatCampagne;
  readonly arriveeAuNoeudSansConclusionObservee: boolean;
} {
  const graine = "CENDRE-SAUVEGARDE-DENOUEMENT";
  const resultat = executerCampagneHeadless({
    graine,
    strategie: STRATEGIES_D_EQUILIBRAGE[0]!,
  });
  let etat = creerCampagneInitiale(graine);
  let arriveeAuNoeudSansConclusionObservee = false;
  for (const etape of resultat.commandes) {
    if (etape.statut === "appliquee") {
      etat = appliquerCommande(etat, etape.commande).etat;
    }
    arriveeAuNoeudSansConclusionObservee ||=
      etat.routes.position === "noeud-central" &&
      etat.denouement.statut === "en-cours";
    if (etat.denouement.statut !== "en-cours") {
      return { etat, arriveeAuNoeudSansConclusionObservee };
    }
  }
  throw new Error("La conduite headless n’a pas accompli son Dénouement.");
}

function etatConclu(): EtatCampagne {
  return parcoursConclu().etat;
}

function archiveV10(etatCourant: EtatCampagne): string {
  const { denouement, ...etatSansDenouement } =
    structuredClone(etatCourant);
  void denouement;
  const {
    historique: _historique,
    crisesSequentiellesHistoriquesIgnorees:
      _crisesSequentiellesHistoriquesIgnorees,
    crisesDeTrameHistoriquesIgnorees:
      _crisesDeTrameHistoriquesIgnorees,
    crisesDuHaloHistoriquesIgnorees:
      _crisesDuHaloHistoriquesIgnorees,
    ...crisesV10
  } = etatSansDenouement.crises;
  void _historique;
  void _crisesSequentiellesHistoriquesIgnorees;
  void _crisesDeTrameHistoriquesIgnorees;
  void _crisesDuHaloHistoriquesIgnorees;
  const etatV10 = {
    ...etatSansDenouement,
    version: 10,
    crises: crisesV10,
  };
  const empreinte = empreinteEtat(etatV10 as unknown as EtatCampagne);
  return JSON.stringify({
    format: FORMAT_SAUVEGARDE,
    id: `archive-v10-${empreinte}`,
    version: 10,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: 10,
    },
    graine: etatV10.graine,
    horloge: { secondes: etatV10.tempsDuConvoi.secondes },
    etat: etatV10,
    reproduction: {
      snapshot: etatV10,
      empreinteSnapshot: empreinte,
      commandes: [],
    },
    empreinte,
  });
}

describe("persistance du Dénouement de Campagne", () => {
  it("exporte, importe et rejoue exactement une Solution finale accomplie", () => {
    const parcours = parcoursConclu();
    const etat = parcours.etat;
    const sauvegarde = creerSauvegarde(
      etat,
      creerReproductionInitiale(etat),
    );
    const importation = importerSauvegarde(
      exporterSauvegarde(sauvegarde),
    );

    expect(VERSION_SIMULATION_COURANTE).toBe(16);
    expect(VERSION_SAUVEGARDE_COURANTE).toBe(16);
    expect(parcours.arriveeAuNoeudSansConclusionObservee).toBe(true);
    expect(importation).toMatchObject({
      statut: "compatible",
      sauvegarde: {
        etat: { denouement: etat.denouement },
        reproduction: {
          snapshot: { denouement: etat.denouement },
        },
      },
    });
    if (importation.statut !== "compatible") {
      throw new Error("La sauvegarde courante devrait être compatible.");
    }
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat,
      empreinte: sauvegarde.empreinte,
    });
  });

  it("migre une archive v10 conclue en reconstruisant son Dénouement", () => {
    const etat = etatConclu();
    const importation = importerSauvegarde(archiveV10(etat));

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        etat: {
          denouement: etat.denouement,
        },
      },
    });
  });

  it("migre une archive v10 incomplète comme Campagne en cours", () => {
    const importation = importerSauvegarde(
      archiveV10(creerCampagneInitiale("CENDRE-V10-INCOMPLETE")),
    );

    expect(importation).toMatchObject({
      statut: "migree",
      sauvegarde: {
        etat: { denouement: { statut: "en-cours" } },
      },
    });
  });

  it("exige la révélation et les devenirs pour prouver un ancien Dénouement", () => {
    const etat = etatConclu();
    const faitsSansRevelation = etat.narration.faitsDeCampagne.filter(
      ({ id }) => !id.startsWith("epilogue.revelation."),
    );

    expect(reconstruireDenouementReussi(faitsSansRevelation)).toEqual({
      statut: "en-cours",
    });
  });
});
