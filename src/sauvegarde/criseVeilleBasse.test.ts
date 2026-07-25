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
  VERSION_SAUVEGARDE_AVANT_CRISES_SEQUENTIELLES,
  VERSION_SAUVEGARDE_COURANTE,
  VERSIONS_DU_SNAPSHOT_COURANT,
} from "./version";
import { lireEtatCourant, lireSnapshotCourant } from "./validation";

function atteindreAccueilDeVeilleBasse(
  ignorerCriseSequentielle = false,
  accueillirLaCohorte = true,
): EtatCampagne {
  let etat = appliquerCommande(
    creerCampagneInitiale("PERSISTANCE-CRISE-VEILLE-BASSE"),
    {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "maintenir-debit",
    },
  ).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  for (const [evenementId, choixId] of [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
  ] as const) {
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
  etat = appliquerCommande(etat, {
    type: "crise.resoudre",
    criseId: "penurie-eau.pompe-purification",
    reponseId: "isoler-et-rationner",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId: "chaussee-de-veille-basse",
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 120,
  }).etat;
  if (!accueillirLaCohorte) {
    return etat;
  }
  return appliquerCommande(
    etat,
    {
      type: "evenement-narratif.choisir",
      evenementId: "veille-basse.la-place-sous-le-phare",
      choixId: "accueillir",
    },
    ignorerCriseSequentielle
      ? { crises: "historiques-v12" }
      : undefined,
  ).etat;
}

function exporterArchiveV12(courant: EtatCampagne): string {
  const {
    historique: _historique,
    crisesSequentiellesHistoriquesIgnorees:
      _crisesSequentiellesHistoriquesIgnorees,
    crisesDeTrameHistoriquesIgnorees:
      _crisesDeTrameHistoriquesIgnorees,
    crisesDuHaloHistoriquesIgnorees:
      _crisesDuHaloHistoriquesIgnorees,
    ...crisesV12
  } = courant.crises;
  void _historique;
  void _crisesSequentiellesHistoriquesIgnorees;
  void _crisesDeTrameHistoriquesIgnorees;
  void _crisesDuHaloHistoriquesIgnorees;
  const etatV12 = {
    ...courant,
    version: VERSION_SAUVEGARDE_AVANT_CRISES_SEQUENTIELLES,
    crises: crisesV12,
  };
  const empreinteV12 = empreinteEtat(
    etatV12 as unknown as EtatCampagne,
  );
  return JSON.stringify({
    format: FORMAT_SAUVEGARDE,
    id: `archive-v12-${empreinteV12}`,
    version: VERSION_SAUVEGARDE_AVANT_CRISES_SEQUENTIELLES,
    versions: {
      ...VERSIONS_DU_SNAPSHOT_COURANT,
      simulation: VERSION_SAUVEGARDE_AVANT_CRISES_SEQUENTIELLES,
    },
    graine: etatV12.graine,
    horloge: { secondes: etatV12.tempsDuConvoi.secondes },
    etat: etatV12,
    reproduction: {
      snapshot: etatV12,
      empreinteSnapshot: empreinteV12,
      commandes: [],
    },
    empreinte: empreinteV12,
  });
}

function declencherSecondeCrise(): EtatCampagne {
  let etat = atteindreAccueilDeVeilleBasse();
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 30,
  }).etat;
  return appliquerCommande(etat, {
    type: "crise.declencher",
    criseId: "veille-basse.accueil-sous-penurie",
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

describe("persistance de la Crise séquentielle de Veille-Basse", () => {
  it("exporte, importe et rejoue exactement son historique et sa Récupération", () => {
    const parcours = reproduire(declencherSecondeCrise(), [
      {
        type: "crise.resoudre",
        criseId: "veille-basse.accueil-sous-penurie",
        reponseId: "partager-reserves-cohorte",
      },
      { type: "temps-du-convoi.regler-vitesse", vitesse: 4 },
      {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 120,
      },
      {
        type: "evenement-narratif.choisir",
        evenementId: "veille-basse.la-porte-des-filtres",
        choixId: "ouvrir-hospice",
      },
    ]);

    const importation = importerSauvegarde(
      exporterSauvegarde(
        creerSauvegarde(parcours.etat, parcours.reproduction),
      ),
    );

    expect(VERSION_SIMULATION_COURANTE).toBe(16);
    expect(VERSION_SAUVEGARDE_COURANTE).toBe(16);
    expect(lireSnapshotCourant(parcours.reproduction.snapshot)).toBeDefined();
    expect(lireEtatCourant(parcours.etat)).toBeDefined();
    expect(rejouerReproduction(parcours.reproduction)).toEqual({
      statut: "termine",
      etat: parcours.etat,
      empreinte: empreinteEtat(parcours.etat),
    });
    expect(importation.statut).toBe("compatible");
    if (importation.statut !== "compatible") {
      return;
    }
    expect(importation.sauvegarde.etat.crises.historique).toEqual(
      parcours.etat.crises.historique,
    );
    expect(
      importation.sauvegarde.etat.crises.recuperations.at(-1),
    ).toMatchObject({
      garantie: "cohorte-hydratee",
      statut: "accomplie",
      faitResultat:
        "crise.recuperation.cohorte-hydratee.accomplie",
    });
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat: parcours.etat,
      empreinte: empreinteEtat(parcours.etat),
    });
  });

  it("migre une v12 sans déclencher rétroactivement la seconde Crise", () => {
    const courant = atteindreAccueilDeVeilleBasse(true);

    const importation = importerSauvegarde(exporterArchiveV12(courant));

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      return;
    }
    expect(importation.sauvegarde.etat.crises).toMatchObject({
      crisesSequentiellesHistoriquesIgnorees: true,
      alerte: null,
      criseActive: null,
      historique: [
        expect.objectContaining({
          id: "penurie-eau.pompe-purification",
          reponseId: "isoler-et-rationner",
        }),
      ],
    });
    expect(rejouerReproduction(importation.sauvegarde.reproduction)).toEqual({
      statut: "termine",
      etat: importation.sauvegarde.etat,
      empreinte: importation.sauvegarde.empreinte,
    });
  });

  it("migre une v12 antérieure à l’accueil sans neutraliser la future Crise", () => {
    const avantAccueil = atteindreAccueilDeVeilleBasse(false, false);

    const importation = importerSauvegarde(
      exporterArchiveV12(avantAccueil),
    );

    expect(importation.statut).toBe("migree");
    if (importation.statut !== "migree") {
      return;
    }
    expect(
      importation.sauvegarde.etat.crises
        .crisesSequentiellesHistoriquesIgnorees,
    ).toBe(false);

    const apresAccueil = appliquerCommande(importation.sauvegarde.etat, {
      type: "evenement-narratif.choisir",
      evenementId: "veille-basse.la-place-sous-le-phare",
      choixId: "accueillir",
    }).etat;

    expect(apresAccueil.crises.alerte).toMatchObject({
      id: "veille-basse.accueil-sous-penurie",
    });
  });

  it("refuse un marqueur historique séquentiel sans Fait d’accueil", () => {
    const initial = creerCampagneInitiale(
      "MARQUEUR-HISTORIQUE-CRISE-SEQUENTIELLE",
    );

    expect(
      lireEtatCourant({
        ...initial,
        crises: {
          ...initial.crises,
          crisesSequentiellesHistoriquesIgnorees: true,
        },
      }),
    ).toBeUndefined();
  });
});
