import { describe, expect, it } from "vitest";

import { projeterAiguillageZero } from "../application/aiguillageZero";
import { projeterCampagne } from "../application/application";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import {
  confirmerEngagementDeRoute,
  creerEtatDesRoutesInitial,
  traiterJalonsDeRoute,
  type IdentifiantDeTroncon,
} from "./routes";

function preparer(
  modification: (etat: EtatCampagne) => EtatCampagne = (etat) => etat,
): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-AIGUILLAGE-ZERO");
  return modification({
    ...initial,
    tempsDuConvoi: { secondes: 2_400, vitesse: 4 },
    crises: {
      ...initial.crises,
      faitAnnonceurHistoriqueIgnore: true,
    },
    routes: { ...initial.routes, position: "signal-zero" },
    narration: {
      ...initial.narration,
      evenementsJoues: [
        "trame.signal-zero.l-interface-aux-deux-frequences",
        "trame.signal-zero.les-deux-branches-dans-le-verre",
      ],
      faitsDeCampagne: [
        {
          id: "trame.signal-zero.interface-rail-lue",
          cause:
            "trame.signal-zero.l-interface-aux-deux-frequences",
          acteurs: ["porte-lanterne"],
          cible: "interface-de-la-ligne-zero",
          moment: 2_300,
          effets: { materiels: [], humains: [] },
        },
        {
          id: "trame.signal-zero.echos-conserves",
          cause:
            "trame.signal-zero.les-deux-branches-dans-le-verre",
          acteurs: ["porte-lanterne"],
          cible: "table-de-signal-zero",
          moment: 2_300,
          effets: { materiels: [], humains: [] },
        },
      ],
    },
  });
}

function voyager(
  etat: EtatCampagne,
  tronconId: IdentifiantDeTroncon,
): EtatCampagne {
  const engage = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId,
  }).etat;
  const enMarche = appliquerCommande(engage, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(enMarche, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 300,
  }).etat;
}

function choisir(etat: EtatCampagne, choixId: string): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement actif.");
  }
  const resolu = appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId,
    choixId,
  }).etat;
  return appliquerCommande(resolu, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  }).etat;
}

function atteindreLeConseil(etat: EtatCampagne): EtatCampagne {
  const aLAiguillage = voyager(
    etat,
    "faisceau-de-l-aiguillage-zero",
  );
  expect(aLAiguillage.narration.evenementActif).toBe(
    "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
  );
  return choisir(aLAiguillage, "relever-portees");
}

function avecMateriaux(
  etat: EtatCampagne,
  quantite: number,
): EtatCampagne {
  return {
    ...etat,
    pilotage: {
      ...etat.pilotage,
      economie: {
        ...etat.pilotage.economie,
        stocks: {
          ...etat.pilotage.economie.stocks,
          materiaux: {
            ...etat.pilotage.economie.stocks.materiaux,
            quantite,
          },
        },
      },
    },
  };
}

describe("climax de l’Aiguillage Zéro", () => {
  it("refuse le départ tant que le récit de Signal-Zéro n’est pas achevé", () => {
    const incomplet = preparer((etat) => ({
      ...etat,
      narration: {
        ...etat.narration,
        evenementActif:
          "trame.signal-zero.les-deux-branches-dans-le-verre",
        evenementsJoues: [
          "trame.signal-zero.l-interface-aux-deux-frequences",
        ],
        faitsDeCampagne: etat.narration.faitsDeCampagne.slice(0, 1),
      },
    }));
    expect(() =>
      appliquerCommande(incomplet, {
        type: "engagement-de-route.confirmer",
        tronconId: "faisceau-de-l-aiguillage-zero",
      }),
    ).toThrow("récit de la branche");
  });

  it("n’expose que les accords préparés, avec le transport toujours disponible", () => {
    const conseil = atteindreLeConseil(preparer());
    expect(conseil.narration.evenementActif).toBe(
      "trame.aiguillage-zero.le-conseil-des-voies",
    );
    expect(
      projeterCampagne(conseil).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["assurer-transport-autonome"]);

    const toutes = atteindreLeConseil(
      preparer((etat) => ({
        ...etat,
        trameDeFer: {
          ...etat.trameDeFer,
          grandAiguillage: {
            ...etat.trameDeFer.grandAiguillage,
            statut: "atelier-negocie",
          },
          pieceDeRegulation: {
            voiesOuvertes: ["train-outil"],
            monopoleRepublicain: true,
          },
        },
        traverseLibre: {
          ...etat.traverseLibre,
          contournement: "praticable",
        },
      })),
    );
    expect(
      projeterCampagne(toutes).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual([
      "accorder-monopole",
      "etablir-charte",
      "soustraire-piece",
      "assurer-transport-autonome",
    ]);
  });

  it("applique au monopole le coût réduit par le Train-outil sans le sélectionner", () => {
    let etat = atteindreLeConseil(
      avecMateriaux(
        preparer((base) => ({
          ...base,
          trameDeFer: {
            ...base.trameDeFer,
            pieceDeRegulation: {
              voiesOuvertes: ["train-outil"],
              monopoleRepublicain: true,
            },
            occasions: {
              ...base.trameDeFer.occasions,
              trainOutil: {
                ...base.trameDeFer.occasions.trainOutil,
                statut: "reservee",
              },
            },
          },
        })),
        20,
      ),
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.find(
        ({ id }) => id === "accorder-monopole",
      )?.coutsConnus,
    ).toEqual([
      "Coût appliqué : 2 Matériaux grâce au Train-outil préparé.",
    ]);
    expect(etat.trameDeFer.relationRepublique).toBe("fermee");

    const materiauxAvant = etat.pilotage.economie.stocks.materiaux.quantite;
    etat = choisir(etat, "accorder-monopole");
    expect(
      etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiauxAvant - 2);
    expect(etat.trameDeFer).toMatchObject({
      relationRepublique: "cooperative",
      engagements: expect.arrayContaining([
        expect.objectContaining({
          id: "monopole-de-l-aiguillage-zero",
        }),
      ]),
    });
    expect(etat.traverseLibre.relationPuitsLibres).toBe("fermee");
  });

  it("réduit le transport avec l’Attelage et conserve la décision au Conseil", () => {
    let etat = atteindreLeConseil(
      avecMateriaux(
        preparer((base) => ({
          ...base,
          trameDeFer: {
            ...base.trameDeFer,
            occasions: {
              ...base.trameDeFer.occasions,
              attelageFedere: {
                ...base.trameDeFer.occasions.attelageFedere,
                statut: "annoncee",
              },
            },
          },
        })),
        20,
      ),
    );
    expect(etat.narration.faitsDeCampagne.map(({ id }) => id)).not.toContain(
      "trame.aiguillage-zero.transport-autonome",
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.find(
        ({ id }) => id === "assurer-transport-autonome",
      )?.coutsConnus[0],
    ).toContain("6 Matériaux grâce à l’Attelage fédéré");

    const materiauxAvant = etat.pilotage.economie.stocks.materiaux.quantite;
    etat = choisir(etat, "assurer-transport-autonome");
    expect(
      etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiauxAvant - 6);
    expect(etat.traverseLibre).toMatchObject({
      statut: "autonome",
      relationPuitsLibres: "cooperative",
    });
    expect(
      projeterAiguillageZero(etat).engagements,
    ).not.toContain("dette");
  });

  it.each([
    [
      "etablir-charte",
      (etat: EtatCampagne) => ({
        ...etat,
        trameDeFer: {
          ...etat.trameDeFer,
          grandAiguillage: {
            ...etat.trameDeFer.grandAiguillage,
            statut: "atelier-negocie" as const,
          },
        },
      }),
      "trame.aiguillage-zero.charte-partagee",
      "cooperative",
    ],
    [
      "soustraire-piece",
      (etat: EtatCampagne) => ({
        ...etat,
        traverseLibre: {
          ...etat.traverseLibre,
          contournement: "praticable" as const,
        },
      }),
      "trame.aiguillage-zero.piece-soustraite",
      "fermee",
    ],
  ] as const)(
    "produit une sortie persistante pour %s",
    (choixId, modifier, fait, relation) => {
      const etat = choisir(
        atteindreLeConseil(modifier(preparer())),
        choixId,
      );
      expect(etat.narration.faitsDeCampagne.map(({ id }) => id)).toContain(
        fait,
      );
      expect(etat.trameDeFer.relationRepublique).toBe(relation);
    },
  );

  it("garantit le recours coûteux sans Colonie, Compagnon ni Matériaux", () => {
    let etat = atteindreLeConseil(
      avecMateriaux(
        preparer((base) => ({
          ...base,
          hautPuits: {
            ...base.hautPuits,
            colonie: { ...base.hautPuits.colonie, statut: "perdue" },
          },
        })),
        0,
      ),
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["assurer-transport-autonome"]);
    etat = choisir(etat, "assurer-transport-autonome");
    expect(etat.pilotage.economie.stocks.materiaux.quantite).toBe(0);
    expect(etat.narration.evenementActif).toBe(
      "trame.aiguillage-zero.le-passage-de-la-couronne",
    );
  });

  it("consigne tous les états, ouvre la porte puis verrouille le retour", () => {
    let etat = atteindreLeConseil(avecMateriaux(preparer(), 0));
    expect(() =>
      appliquerCommande(etat, {
        type: "engagement-de-route.confirmer",
        tronconId: "passage-de-la-couronne-muette",
      }),
    ).toThrow("récit de la branche");
    etat = choisir(etat, "assurer-transport-autonome");
    etat = choisir(etat, "consigner-etats-de-sortie");
    const projection = projeterAiguillageZero(etat);
    expect(projection).toMatchObject({
      visible: true,
      accordRegional: "Transport autonome",
      soupcons: "Aucun Soupçon clandestin",
    });
    expect(projection.sites).toContain("Barrière-Neuve : abandonné");
    expect(projection.sites).toContain("Signal-Zéro : actif");
    expect(projection.routes).toContain(
      "porte de la Couronne ouverte · retour verrouillé",
    );
    expect(projection.engagements).toContain(
      "Dette de transport : 14 Matériaux",
    );
    expect(projection.echoFutur).toContain("planifié");
    expect(etat.narration.faitsDeCampagne.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "trame.aiguillage-zero.passage-consigne",
        "trame.aiguillage-zero.retours-couronne-planifies",
      ]),
    );
    expect(etat.devenirsDesSites?.trameDeFer).toEqual({
      barriereNeuve: "abandonne",
      dortoirDixSept: "abandonne",
      pompeNeuve: "abandonne",
      marcheDesTraverses: "abandonne",
      signalZero: "actif",
    });

    etat = voyager(etat, "passage-de-la-couronne-muette");
    expect(etat.routes.position).toBe("couronne-muette");
    expect(
      etat.routes.etatsReels["passage-de-la-couronne-muette"],
    ).toBe("coupe");
  });

  it("conserve un budget direct de six segments depuis les deux branches", () => {
    const itineraires: readonly (readonly IdentifiantDeTroncon[])[] = [
      [
        "rampe-de-barriere-neuve",
        "voie-des-ponts-lourds",
        "rocade-du-marche",
        "ligne-du-signal-zero",
        "faisceau-de-l-aiguillage-zero",
        "passage-de-la-couronne-muette",
      ],
      [
        "embranchement-de-pompe-neuve",
        "galerie-des-reservoirs",
        "voie-des-citernes",
        "ligne-du-signal-zero",
        "faisceau-de-l-aiguillage-zero",
        "passage-de-la-couronne-muette",
      ],
    ];
    for (const itineraire of itineraires) {
      let routes = creerEtatDesRoutesInitial();
      routes = { ...routes, position: "lisiere-trame-de-fer" };
      let seconde = 0;
      for (const tronconId of itineraire) {
        const engage = confirmerEngagementDeRoute(
          routes,
          tronconId,
          seconde,
        ).etat;
        const arrivee = engage.engagements.at(-1)!.arriveeA;
        routes = traiterJalonsDeRoute(engage, seconde, arrivee).etat;
        seconde = arrivee;
      }
      expect(itineraire).toHaveLength(6);
      expect(routes.position).toBe("couronne-muette");
    }
  });
});
