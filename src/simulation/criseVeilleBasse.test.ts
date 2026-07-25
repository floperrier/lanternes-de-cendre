import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import { annoncerCriseApresFaits } from "./crise";

function resoudrePrologueEtDeclencherPurification(): EtatCampagne {
  let etat = appliquerCommande(creerCampagneInitiale("CRISES-SEQUENTIELLES"), {
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
  return appliquerCommande(etat, {
    type: "crise.declencher",
    criseId: "penurie-eau.pompe-purification",
  }).etat;
}

function atteindreCriseDeVeilleBasse(): EtatCampagne {
  let etat = appliquerCommande(resoudrePrologueEtDeclencherPurification(), {
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
  expect(etat.narration.evenementActif).toBe(
    "veille-basse.la-place-sous-le-phare",
  );
  etat = appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId: "veille-basse.la-place-sous-le-phare",
    choixId: "accueillir",
  }).etat;
  expect(etat.crises.alerte).toMatchObject({
    id: "veille-basse.accueil-sous-penurie",
    cause: "veille-basse.cohorte-accueillie",
    annonceeA: 660,
    ruptureA: 780,
  });
  expect(etat.crises.historique).toEqual([
    expect.objectContaining({
      id: "penurie-eau.pompe-purification",
      reponseId: "isoler-et-rationner",
    }),
  ]);

  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 30,
  }).etat;
  expect(etat.tempsDuConvoi).toEqual({ secondes: 780, vitesse: 0 });
  return appliquerCommande(etat, {
    type: "crise.declencher",
    criseId: "veille-basse.accueil-sous-penurie",
  }).etat;
}

function manifesterIntervention(etat: EtatCampagne): EtatCampagne {
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 120,
  }).etat;
}

describe("Crise séquentielle de Veille-Basse", () => {
  it("ne peut être semée directement ni annoncée sans pénurie historique", () => {
    const initial = creerCampagneInitiale("CRISE-VEILLE-BASSE-INTERDITE");

    expect(() =>
      appliquerCommande(initial, {
        type: "crise.declencher",
        criseId: "veille-basse.accueil-sous-penurie",
      }),
    ).toThrow(
      "La Crise « veille-basse.accueil-sous-penurie » n’attend pas de checkpoint.",
    );
    expect(
      annoncerCriseApresFaits(initial.crises, [
        {
          id: "veille-basse.cohorte-accueillie",
          cause: "veille-basse.la-place-sous-le-phare",
          acteurs: ["porte-lanterne", "cohorte-du-sillon"],
          cible: "cohorte-du-sillon",
          moment: 480,
          effets: { materiels: [], humains: [] },
        },
      ]),
    ).toEqual({ etat: initial.crises, evenements: [] });
  });

  it("dérive son alerte de l’accueil sous pénurie et conserve l’ordre historique", () => {
    const crise = atteindreCriseDeVeilleBasse();

    expect(crise.crises.criseActive).toMatchObject({
      id: "veille-basse.accueil-sous-penurie",
      cause: "veille-basse.cohorte-accueillie",
      declencheeA: 780,
      faitProduit: "crise.veille-basse.accueil-sous-penurie",
    });
    expect(crise.crises.criseActive?.chaineVisible).toEqual([
      expect.objectContaining({
        id: "veille-basse.cohorte-accueillie-sous-penurie",
      }),
      expect.objectContaining({
        id: "veille-basse.capacite-accueil-saturee-annoncee",
      }),
      expect.objectContaining({
        id: "veille-basse.reserves-et-accueil-en-rupture",
      }),
    ]);
    expect(crise.crises.historique).toHaveLength(1);
  });

  it.each([
    {
      reponseId: "partager-reserves-cohorte",
      stock: "vivres",
      cout: 6,
      cicatrice: "cicatrice.reserves-partagees-veille-basse",
      garantie: "cohorte-hydratee",
      intervention: "ouvrir-hospice",
      fait:
        "crise.recuperation.cohorte-hydratee.accomplie",
    },
    {
      reponseId: "renforcer-accueil",
      stock: "materiaux",
      cout: 5,
      cicatrice: "cicatrice.capacites-accueil-saturees",
      garantie: "accueil-stabilise",
      intervention: "renforcer-sas",
      fait:
        "crise.recuperation.accueil-stabilise.accomplie",
    },
  ] as const)(
    "résout par $reponseId puis accomplit sa Récupération par une action régionale",
    ({
      reponseId,
      stock,
      cout,
      cicatrice,
      garantie,
      intervention,
      fait,
    }) => {
      const enCrise = atteindreCriseDeVeilleBasse();
      const stockAvant =
        enCrise.pilotage.economie.stocks[stock].quantite;

      const resolution = appliquerCommande(enCrise, {
        type: "crise.resoudre",
        criseId: "veille-basse.accueil-sous-penurie",
        reponseId,
      });

      expect(
        resolution.etat.pilotage.economie.stocks[stock].quantite,
      ).toBe(stockAvant - cout);
      expect(resolution.etat.crises.historique).toEqual([
        expect.objectContaining({
          id: "penurie-eau.pompe-purification",
        }),
        expect.objectContaining({
          id: "veille-basse.accueil-sous-penurie",
          reponseId,
        }),
      ]);
      expect(resolution.etat.crises.cicatrices.at(-1)).toMatchObject({
        id: cicatrice,
        irreversible: true,
      });
      expect(resolution.etat.crises.recuperations.at(-1)).toMatchObject({
        garantie,
        destination: "veille-basse",
        statut: "amorcee",
      });

      const interventionDisponible = manifesterIntervention(
        resolution.etat,
      );
      expect(interventionDisponible.narration.evenementActif).toBe(
        "veille-basse.la-porte-des-filtres",
      );
      const materiauxAvant =
        interventionDisponible.pilotage.economie.stocks.materiaux.quantite;
      const accomplissement = appliquerCommande(interventionDisponible, {
        type: "evenement-narratif.choisir",
        evenementId: "veille-basse.la-porte-des-filtres",
        choixId: intervention,
      });

      expect(
        accomplissement.etat.crises.recuperations.at(-1),
      ).toMatchObject({
        statut: "accomplie",
        faitResultat: fait,
        coutApplique: [{ stock: "materiaux", quantite: 2 }],
      });
      expect(
        accomplissement.etat.pilotage.economie.stocks.materiaux.quantite,
      ).toBe(materiauxAvant - 2);
      expect(
        accomplissement.etat.narration.faitsDeCampagne.map(({ id }) => id),
      ).toContain(fait);

      const nouvelleAnnonce = annoncerCriseApresFaits(
        accomplissement.etat.crises,
        accomplissement.etat.narration.faitsDeCampagne,
      );
      expect(nouvelleAnnonce.etat.alerte).toBeNull();
      expect(nouvelleAnnonce.evenements).toEqual([]);
    },
  );

  it.each([
    {
      reponseId: "partager-reserves-cohorte",
      routes: [
        ["chemin-de-l-hospice", 75],
      ],
      fait: "crise.recuperation.cohorte-hydratee.manquee",
    },
    {
      reponseId: "renforcer-accueil",
      routes: [
        ["chemin-de-l-hospice", 75],
        ["chenal-de-l-hospice", 90],
      ],
      fait: "crise.recuperation.accueil-stabilise.manquee",
    },
  ] as const)(
    "marque la Récupération de $reponseId comme manquée à son horizon",
    ({ reponseId, routes, fait }) => {
      let etat = appliquerCommande(atteindreCriseDeVeilleBasse(), {
        type: "crise.resoudre",
        criseId: "veille-basse.accueil-sous-penurie",
        reponseId,
      }).etat;
      etat = manifesterIntervention(etat);
      etat = appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId: "veille-basse.la-porte-des-filtres",
        choixId: "renoncer-intervention",
      }).etat;

      for (const [tronconId, secondesReelles] of routes) {
        etat = appliquerCommande(etat, {
          type: "engagement-de-route.confirmer",
          tronconId,
        }).etat;
        etat = appliquerCommande(etat, {
          type: "temps-du-convoi.regler-vitesse",
          vitesse: 4,
        }).etat;
        etat = appliquerCommande(etat, {
          type: "temps-du-convoi.ecouler",
          secondesReelles,
        }).etat;
      }

      expect(etat.crises.recuperations.at(-1)).toMatchObject({
        statut: "manquee",
        faitResultat: fait,
        coutApplique: [],
      });
      expect(
        etat.narration.faitsDeCampagne.map(({ id }) => id),
      ).toContain(fait);
    },
  );
});
