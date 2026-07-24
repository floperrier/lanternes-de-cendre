import { describe, expect, it } from "vitest";

import { projeterCampagne } from "../application/application";
import { projeterApprochesDeLaCouronne } from "../application/couronne";
import { projeterAtlas } from "../application/routes";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import {
  choixDesApprochesDeLaCouronneEstDisponible,
  reconstruireEtatDesApprochesDeLaCouronne,
} from "./couronne";
import type { FaitDeCampagne } from "./faits";
import type { IdentifiantDeTroncon } from "./routes";

function fait(id: string, moment = 2_300): FaitDeCampagne {
  return {
    id,
    cause: "trame.aiguillage-zero.le-passage-de-la-couronne",
    acteurs: ["porte-lanterne"],
    cible: "couronne-muette",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function preparer(
  faits: readonly string[] = [
    "trame.aiguillage-zero.passage-consigne",
    "trame.aiguillage-zero.charte-partagee",
    "trame.signal-zero.interface-rail-lue",
    "trame.signal-zero.echos-conserves",
    "bassins.deversoir.ligne-zero-relevee",
  ],
): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-COURONNE");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 2_400, vitesse: 4 },
    routes: { ...initial.routes, position: "couronne-muette" },
    trameDeFer: {
      ...initial.trameDeFer,
      relationRepublique: "cooperative",
    },
    traverseLibre: {
      ...initial.traverseLibre,
      relationPuitsLibres: "cooperative",
    },
    narration: {
      ...initial.narration,
      faitsDeCampagne: faits.map((id) => fait(id)),
    },
  };
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

function atteindreLesMontages(
  etat: EtatCampagne,
  route: IdentifiantDeTroncon,
  choixLocal: string,
): EtatCampagne {
  let courant = voyager(etat, route);
  courant = choisir(courant, choixLocal);
  return choisir(courant, "etablir-compatibilites");
}

describe("approches de la Couronne muette", () => {
  it("ouvre deux itinéraires irréversibles seulement après le registre de l’Aiguillage", () => {
    const sansRegistre = preparer([]);
    for (const tronconId of [
      "voie-de-tete-de-ligne",
      "chemin-des-trois-veilles",
    ] as const) {
      expect(() =>
        appliquerCommande(sansRegistre, {
          type: "engagement-de-route.confirmer",
          tronconId,
        }),
      ).toThrow("récit de la branche");
    }

    const atlasFr = projeterAtlas(preparer());
    expect(atlasFr.troncons.map(({ id }) => id)).toEqual(
      expect.arrayContaining([
        "voie-de-tete-de-ligne",
        "chemin-des-trois-veilles",
      ]),
    );
    expect(
      atlasFr.troncons.find(({ id }) => id === "voie-de-tete-de-ligne"),
    ).toMatchObject({
      destination: "Tête-de-Ligne",
      consommation: "6 L de Combustible",
      renseignements: expect.arrayContaining([
        expect.objectContaining({
          controlePolitique: "Camp retranché de Tête-de-Ligne",
        }),
        expect.objectContaining({
          source:
            "Copie du registre portée par la délégation des Puits Libres",
        }),
      ]),
    });
    expect(
      projeterAtlas(preparer(), "en").troncons.find(
        ({ id }) => id === "chemin-des-trois-veilles",
      ),
    ).toMatchObject({
      destination: "Threefold Watch",
      consommation: "7 L of Fuel",
      renseignements: [
        expect.objectContaining({
          danger: "Dead beacons and reflective ash",
        }),
      ],
    });
  });

  it("donne à Tête-de-Ligne un devenir actif et conserve les trois préparatifs sans choisir de fin", () => {
    let etat = atteindreLesMontages(
      preparer(),
      "voie-de-tete-de-ligne",
      "ouvrir-atelier-commun",
    );
    expect(etat.narration.evenementActif).toBe(
      "couronne.approches.les-montages-de-la-couronne",
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual([
      "amorcer-berceau",
      "calibrer-etalon",
      "assembler-precipitateur",
      "reporter-preparatifs",
    ]);

    const materiaux = etat.pilotage.economie.stocks.materiaux.quantite;
    etat = choisir(etat, "calibrer-etalon");
    expect(etat.pilotage.economie.stocks.materiaux.quantite).toBe(
      materiaux - 6,
    );
    etat = choisir(etat, "repartir-plans-aux-equipes");

    const approche = reconstruireEtatDesApprochesDeLaCouronne(etat);
    expect(approche).toMatchObject({
      teteDeLigne: {
        interaction: "atelier-commun",
        devenir: "actif",
      },
      delegations: {
        republique: "conditionnelle",
        puitsLibres: "mandatee",
      },
      diagnostic: "compatibilites-etablies",
      preparatifs: {
        berceauDAncrage: "preparable",
        etalonDeReaccord: "amorce",
        precipitateurEmbarque: "preparable",
      },
      gardeDesPlans: "equipes",
    });
    expect(
      etat.narration.faitsDeCampagne.filter(({ id }) =>
        id.startsWith("couronne.approches."),
      ),
    ).toHaveLength(3);
  });

  it("donne à Veille-des-Trois un devenir évacué distinct et une présentation bilingue", () => {
    let etat = atteindreLesMontages(
      preparer(),
      "chemin-des-trois-veilles",
      "evacuer-releves",
    );
    etat = choisir(etat, "reporter-preparatifs");
    etat = choisir(etat, "confier-plans-a-ilyana");

    expect(
      reconstruireEtatDesApprochesDeLaCouronne(etat),
    ).toMatchObject({
      veilleDesTrois: {
        interaction: "releves-evacues",
        devenir: "evacue",
      },
      delegations: { pelerins: "conditionnelle" },
      gardeDesPlans: "ilyana",
    });
    expect(projeterApprochesDeLaCouronne(etat, "fr")).toMatchObject({
      visible: true,
      titre: "Approches de la Couronne",
      veilleDesTrois: expect.stringContaining("évacué"),
    });
    expect(projeterApprochesDeLaCouronne(etat, "en")).toMatchObject({
      visible: true,
      titre: "Silent Crown Approaches",
      veilleDesTrois: expect.stringContaining("evacuated"),
    });
  });

  it("hérite des Soupçons et garde un report sans coût quand aucun spécialiste n’est disponible", () => {
    const ids = [
      "trame.aiguillage-zero.passage-consigne",
      "trame.aiguillage-zero.trace-du-vol",
    ];
    let etat = atteindreLesMontages(
      preparer(ids),
      "voie-de-tete-de-ligne",
      "ouvrir-atelier-commun",
    );
    etat = {
      ...etat,
      pilotage: {
        ...etat.pilotage,
        economie: {
          ...etat.pilotage.economie,
          stocks: {
            ...etat.pilotage.economie.stocks,
            materiaux: {
              ...etat.pilotage.economie.stocks.materiaux,
              quantite: 0,
            },
          },
        },
      },
    };

    expect(
      reconstruireEtatDesApprochesDeLaCouronne(etat).delegations
        .republique,
    ).toBe("conditionnelle");
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["reporter-preparatifs"]);
    expect(() => choisir(etat, "reporter-preparatifs")).not.toThrow();
  });

  it("fait modifier concessions et renseignements par les héritages régionaux", () => {
    const sansSoupcon = voyager(
      preparer(["trame.aiguillage-zero.passage-consigne"]),
      "voie-de-tete-de-ligne",
    );
    expect(
      projeterCampagne(sansSoupcon).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["ratifier-mandat", "ouvrir-atelier-commun"]);

    const etatAvecSoupcon = preparer([
      "trame.aiguillage-zero.passage-consigne",
      "trame.aiguillage-zero.trace-du-vol",
    ]);
    const avecSoupcon = voyager(
      etatAvecSoupcon,
      "voie-de-tete-de-ligne",
    );
    expect(
      projeterCampagne(avecSoupcon).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["ouvrir-atelier-commun"]);
    expect(
      projeterAtlas(etatAvecSoupcon).troncons.find(
        ({ id }) => id === "voie-de-tete-de-ligne",
      )
        ?.renseignements,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "Inventaire contradictoire de l’Aiguillage Zéro",
          danger: "La Trace du vol ferme le mandat républicain",
        }),
      ]),
    );

    const base = preparer(["trame.aiguillage-zero.passage-consigne"]);
    expect(
      projeterAtlas(
        preparer([
          "trame.aiguillage-zero.passage-consigne",
          "veille-basse.registres-copies",
        ]),
      ).troncons.find(({ id }) => id === "chemin-des-trois-veilles")
        ?.renseignements,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "Copies des registres de Veille-Basse",
        }),
      ]),
    );
    const veillePerdue = voyager(
      {
        ...base,
        veilleBasse: {
          ...base.veilleBasse,
          colonie: {
            ...base.veilleBasse.colonie,
            statut: "perdue",
          },
        },
      },
      "chemin-des-trois-veilles",
    );
    expect(
      projeterCampagne(veillePerdue).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["evacuer-releves"]);
  });

  it("mandate les Puits Libres par l’Engagement de transport autonome", () => {
    const base = preparer([
      "trame.aiguillage-zero.passage-consigne",
      "trame.aiguillage-zero.engagement-transport-autonome",
    ]);
    const avecEngagement = {
      ...base,
      trameDeFer: {
        ...base.trameDeFer,
        relationRepublique: "transactionnelle" as const,
        engagements: [
          ...base.trameDeFer.engagements,
          {
            id: "transport-autonome-aiguillage-zero" as const,
            prisA: 2_300,
            avec: "puits-libres" as const,
            statut: "actif" as const,
          },
        ],
      },
    };

    expect(
      reconstruireEtatDesApprochesDeLaCouronne(avecEngagement)
        .delegations.puitsLibres,
    ).toBe("mandatee");
  });

  it.each([
    ["amorcer-berceau", 8],
    ["calibrer-etalon", 6],
    ["assembler-precipitateur", 10],
  ] as const)(
    "applique le seuil exact de matériaux à %s",
    (choixId, seuil) => {
      const avecMateriaux = (quantite: number) => {
        const base = preparer();
        return {
          ...base,
          pilotage: {
            ...base.pilotage,
            economie: {
              ...base.pilotage.economie,
              stocks: {
                ...base.pilotage.economie.stocks,
                materiaux: {
                  ...base.pilotage.economie.stocks.materiaux,
                  quantite,
                },
              },
            },
          },
        };
      };
      expect(
        choixDesApprochesDeLaCouronneEstDisponible(
          avecMateriaux(seuil),
          choixId,
        ),
      ).toBe(true);
      expect(
        choixDesApprochesDeLaCouronneEstDisponible(
          avecMateriaux(seuil - 1),
          choixId,
        ),
      ).toBe(false);
    },
  );
});
