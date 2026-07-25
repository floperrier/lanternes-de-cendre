import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  empreinteEtat,
  type CommandeCampagne,
  type EtatCampagne,
} from "../simulation/campagne";
import { VERSION_SIMULATION_COURANTE } from "../simulation/versions";
import {
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

function recuperationAmorcee(
  reponseId:
    | "isoler-et-rationner"
    | "evacuer-les-foyers-exposes",
): EtatCampagne {
  let etat = creerCampagneInitiale("CENDRE-RECUPERATION");
  etat = appliquerCommande(etat, {
    type: "incident.ordonner",
    incidentId: "purification.pompe-instable",
    ordre: "maintenir-debit",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  const choixDuPrologue = [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
  ] as const;
  for (const [evenementId, choixId] of choixDuPrologue) {
    etat = appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat;
    if (evenementId !== "prologue.ilyana-au-clapet") {
      etat = appliquerCommande(etat, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 1,
      }).etat;
    }
  }
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 117,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "crise.declencher",
    criseId: "penurie-eau.pompe-purification",
  }).etat;
  return appliquerCommande(etat, {
    type: "crise.resoudre",
    criseId: "penurie-eau.pompe-purification",
    reponseId,
  }).etat;
}

function reproduire(
  snapshot: EtatCampagne,
  commandes: readonly CommandeCampagne[],
) {
  let etat = snapshot;
  const entrees = commandes.map((commande, sequence) => {
    etat = appliquerCommande(etat, commande).etat;
    return {
      sequence,
      commande,
      empreinteApres: empreinteEtat(etat),
    };
  });
  return {
    etat,
    reproduction: {
      snapshot,
      empreinteSnapshot: empreinteEtat(snapshot),
      commandes: entrees,
    },
  };
}

describe("persistance des Récupérations de Crise", () => {
  it("exporte, importe et rejoue à l’identique une Récupération accomplie", () => {
    const parcours = reproduire(
      recuperationAmorcee("isoler-et-rationner"),
      [{ type: "halte.deployer" }],
    );
    const sauvegarde = creerSauvegarde(
      parcours.etat,
      parcours.reproduction,
    );

    const importation = importerSauvegarde(
      exporterSauvegarde(sauvegarde),
    );

    expect(VERSION_SIMULATION_COURANTE).toBe(17);
    expect(VERSION_SAUVEGARDE_COURANTE).toBe(17);
    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      return;
    }
    expect(importation.sauvegarde.etat.crises.recuperations[0]).toEqual(
      parcours.etat.crises.recuperations[0],
    );
    expect(
      importation.sauvegarde.etat.narration.faitsDeCampagne.at(-1),
    ).toEqual(parcours.etat.narration.faitsDeCampagne.at(-1));
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat: parcours.etat,
      empreinte: empreinteEtat(parcours.etat),
    });
  });

  it("exporte, importe et rejoue à l’identique une Récupération manquée", () => {
    const parcours = reproduire(
      recuperationAmorcee("evacuer-les-foyers-exposes"),
      [
        {
          type: "engagement-de-route.confirmer",
          tronconId: "chaussee-de-veille-basse",
        },
        { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
        { type: "temps-du-convoi.ecouler", secondesReelles: 120 },
      ],
    );
    const importation = importerSauvegarde(
      exporterSauvegarde(
        creerSauvegarde(parcours.etat, parcours.reproduction),
      ),
    );

    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      return;
    }
    expect(importation.sauvegarde.etat.crises.recuperations[0]?.statut).toBe(
      "manquee",
    );
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat: parcours.etat,
      empreinte: empreinteEtat(parcours.etat),
    });
  });

  it("migre une archive v11 en conservant sa Récupération amorcée", () => {
    const courant = recuperationAmorcee("isoler-et-rationner");
    const recuperationsV11 = courant.crises.recuperations.map(
      ({
        condition,
        coutAttendu,
        amorceeA,
        accomplieA,
        manqueeA,
        faitResultat,
        coutApplique,
        ...recuperation
      }) => {
        void condition;
        void coutAttendu;
        void amorceeA;
        void accomplieA;
        void manqueeA;
        void faitResultat;
        void coutApplique;
        return recuperation;
      },
    );
    const {
      historique: _historique,
      crisesSequentiellesHistoriquesIgnorees:
        _crisesSequentiellesHistoriquesIgnorees,
      crisesDeTrameHistoriquesIgnorees:
        _crisesDeTrameHistoriquesIgnorees,
      crisesDuHaloHistoriquesIgnorees:
        _crisesDuHaloHistoriquesIgnorees,
      ...crisesV11
    } = courant.crises;
    void _historique;
    void _crisesSequentiellesHistoriquesIgnorees;
    void _crisesDeTrameHistoriquesIgnorees;
    void _crisesDuHaloHistoriquesIgnorees;
    const etatV11 = {
      ...courant,
      version: 11,
      crises: { ...crisesV11, recuperations: recuperationsV11 },
    };
    const empreinteV11 = empreinteEtat(
      etatV11 as unknown as EtatCampagne,
    );
    const archiveV11 = JSON.stringify({
      format: FORMAT_SAUVEGARDE,
      id: `archive-v11-${empreinteV11}`,
      version: 11,
      versions: {
        ...VERSIONS_DU_SNAPSHOT_COURANT,
        simulation: 11,
      },
      graine: etatV11.graine,
      horloge: { secondes: etatV11.tempsDuConvoi.secondes },
      etat: etatV11,
      reproduction: {
        snapshot: etatV11,
        empreinteSnapshot: empreinteV11,
        commandes: [],
      },
      empreinte: empreinteV11,
    });

    const importation = importerSauvegarde(archiveV11);

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      return;
    }
    expect(importation.sauvegarde.etat.crises.recuperations[0]).toMatchObject({
      statut: "amorcee",
      amorceeA: 180,
      condition: "halte-de-purification",
      faitResultat: null,
      coutApplique: [],
    });
  });
});
