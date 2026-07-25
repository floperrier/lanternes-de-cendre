import { describe, expect, it } from "vitest";

import { calculerCoutDynamiqueDeLAiguillageZero } from "./aiguillageZero";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type CommandeCampagne,
  type EtatCampagne,
  type FaitDeCampagne,
} from "./campagne";
import { reconstruireHistoriqueDesCrises } from "./crise";

function fait(
  id: string,
  moment: number,
  cause = "test.crise-trame",
): FaitDeCampagne {
  return {
    id,
    cause,
    acteurs: ["porte-lanterne"],
    cible: "convoi",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

const FAITS_DES_CRISES_PRECEDENTES = [
  fait("crise.purification.eau-contaminee", 180),
  fait("crise.purification.isoler-et-rationner", 180),
  fait("crise.veille-basse.accueil-sous-penurie", 780),
  fait("crise.veille-basse.renforcer-accueil", 780),
] as const;

function preparerGrandAiguillage(
  modifier: (etat: EtatCampagne) => EtatCampagne = (etat) => etat,
): EtatCampagne {
  const initial = creerCampagneInitiale("CRISE-TRAME-DE-FER");
  const faitsDeCampagne = [
    ...FAITS_DES_CRISES_PRECEDENTES,
    fait(
      "trame.grand-aiguillage.attelage-federe-annonce",
      2_399,
      "trame.grand-aiguillage.ilyana-et-l-attelage",
    ),
  ];
  const historique = reconstruireHistoriqueDesCrises(faitsDeCampagne);
  return modifier({
    ...initial,
    tempsDuConvoi: { secondes: 2_400, vitesse: 0 },
    routes: {
      ...initial.routes,
      position: "grand-aiguillage",
      etatsReels: {
        ...initial.routes.etatsReels,
        "voie-des-ponts-lourds": "degrade",
      },
      engagements: [
        ...initial.routes.engagements,
        {
          id: "engagement-trame",
          tronconId: "voie-des-ponts-lourds",
          origine: "barriere-neuve",
          destination: "grand-aiguillage",
          engageA: 1_850,
          arriveeA: 2_390,
          statut: "termine",
        },
      ],
      jalons: [
        ...initial.routes.jalons,
        {
          id: "jalon-route-trame",
          type: "fin-de-troncon",
          moment: 2_390,
          tronconId: "voie-des-ponts-lourds",
          cause: "front-de-cendre.condamnation-arriere",
        },
      ],
    },
    narration: {
      ...initial.narration,
      evenementActif: "trame.grand-aiguillage.l-eau-des-machines",
      evenementsJoues: [
        ...initial.narration.evenementsJoues,
        "trame.grand-aiguillage.la-piece-sans-serie",
        "trame.grand-aiguillage.ilyana-et-l-attelage",
        "trame.marche.les-services-de-la-voie-principale",
      ],
      faitsDeCampagne,
    },
    crises: {
      ...initial.crises,
      approvisionnementEau: "sous-tension",
      historique,
    },
    trameDeFer: {
      ...initial.trameDeFer,
      grandAiguillage: {
        ...initial.trameDeFer.grandAiguillage,
        statut: "atelier-negocie",
      },
      pieceDeRegulation: {
        ...initial.trameDeFer.pieceDeRegulation,
        voiesOuvertes: ["reparation-locale"],
      },
    },
  });
}

function rationnerRefroidissement(etat: EtatCampagne): EtatCampagne {
  return appliquerCommande(etat, {
    type: "evenement-narratif.choisir",
    evenementId: "trame.grand-aiguillage.l-eau-des-machines",
    choixId: "rationner-refroidissement",
  }).etat;
}

function atteindreCriseDeTrame(): EtatCampagne {
  let etat = rationnerRefroidissement(preparerGrandAiguillage());
  expect(etat.crises.alerte).toMatchObject({
    id: "trame-fer.cascade-materielle",
    cause: "trame.grand-aiguillage.refroidissement-rationne",
    annonceeA: 2_400,
    ruptureA: 2_520,
  });
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 30,
  }).etat;
  expect(etat.tempsDuConvoi).toEqual({ secondes: 2_520, vitesse: 0 });
  return appliquerCommande(etat, {
    type: "crise.declencher",
    criseId: "trame-fer.cascade-materielle",
  } as CommandeCampagne).etat;
}

function voyager(
  etat: EtatCampagne,
  tronconId:
    | "rocade-du-marche"
    | "ligne-du-signal-zero"
    | "rocade-des-regulateurs"
    | "traverse-des-porteurs",
  secondesReelles: number,
): EtatCampagne {
  etat = appliquerCommande(etat, {
    type: "engagement-de-route.confirmer",
    tronconId,
  }).etat;
  etat = appliquerCommande(etat, {
    type: "temps-du-convoi.regler-vitesse",
    vitesse: 4,
  }).etat;
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles,
  }).etat;
}

describe("Crise matérielle de la Trame de Fer", () => {
  it("ne s’annonce que si Fait, crises antérieures, Charge, entretien et route dégradée concordent", () => {
    const variations = [
      preparerGrandAiguillage((etat) => ({
        ...etat,
        crises: { ...etat.crises, historique: etat.crises.historique.slice(0, 1) },
      })),
      preparerGrandAiguillage((etat) => ({
        ...etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            stocks: {
              ...etat.pilotage.economie.stocks,
              materiaux: {
                ...etat.pilotage.economie.stocks.materiaux,
                quantite: 6,
              },
            },
          },
        },
      })),
      preparerGrandAiguillage((etat) => ({
        ...etat,
        citeCaravane: {
          ...etat.citeCaravane,
          formation: {
            ...etat.citeCaravane.formation,
            plateformes: ["phare"],
          },
        },
      })),
      preparerGrandAiguillage((etat) => ({
        ...etat,
        pilotage: {
          ...etat.pilotage,
          doctrine: {
            ...etat.pilotage.doctrine,
            entretien: {
              position: "preventif",
              transition: null,
            },
          },
        },
      })),
      preparerGrandAiguillage((etat) => ({
        ...etat,
        pilotage: {
          ...etat.pilotage,
          economie: {
            ...etat.pilotage.economie,
            capacites: {
              ...etat.pilotage.economie.capacites,
              charge: {
                ...etat.pilotage.economie.capacites.charge,
                demande: 67,
              },
            },
          },
        },
      })),
      preparerGrandAiguillage((etat) => ({
        ...etat,
        routes: {
          ...etat.routes,
          etatsReels: {
            ...etat.routes.etatsReels,
            "voie-des-ponts-lourds": "praticable",
          },
        },
      })),
    ];

    for (const variation of variations) {
      expect(rationnerRefroidissement(variation).crises.alerte).toBeNull();
    }

    expect(
      rationnerRefroidissement(preparerGrandAiguillage()).crises.alerte,
    ).toMatchObject({
      id: "trame-fer.cascade-materielle",
      chaineVisible: [
        expect.objectContaining({ id: "trame.ponts-lourds-fatigues" }),
        expect.objectContaining({ id: "trame.charge-sans-marge" }),
        expect.objectContaining({ id: "trame.refroidissement-differe" }),
      ],
    });
    expect(
      rationnerRefroidissement(
        preparerGrandAiguillage((etat) => ({
          ...etat,
          routes: {
            ...etat.routes,
            etatsReels: {
              ...etat.routes.etatsReels,
              "voie-des-ponts-lourds": "coupe",
            },
          },
        })),
      ).crises.alerte,
    ).toMatchObject({ id: "trame-fer.cascade-materielle" });
  });

  it("ouvre une fenêtre complète quand les critères matériels deviennent vrais après le Fait annonceur", () => {
    let etat = rationnerRefroidissement(
      preparerGrandAiguillage((candidate) => ({
        ...candidate,
        pilotage: {
          ...candidate.pilotage,
          doctrine: {
            ...candidate.pilotage.doctrine,
            entretien: { position: "preventif", transition: null },
          },
        },
      })),
    );
    expect(etat.crises.alerte).toBeNull();

    etat = {
      ...etat,
      tempsDuConvoi: { secondes: 2_500, vitesse: 0 },
      pilotage: {
        ...etat.pilotage,
        doctrine: {
          ...etat.pilotage.doctrine,
          entretien: { position: "equilibre", transition: null },
        },
      },
    };
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 0,
    }).etat;

    expect(etat.crises.alerte).toMatchObject({
      annonceeA: 2_500,
      ruptureA: 2_620,
    });
  });

  it("n’annonce pas une réponse Matériaux que le flux passif épuiserait avant le checkpoint", () => {
    const etat = rationnerRefroidissement(
      preparerGrandAiguillage((candidate) => ({
        ...candidate,
        pilotage: {
          ...candidate.pilotage,
          incidentActif: null,
          economie: {
            ...candidate.pilotage.economie,
            stocks: {
              ...candidate.pilotage.economie.stocks,
              materiaux: {
                ...candidate.pilotage.economie.stocks.materiaux,
                quantite: 7,
                reliquatDeFlux: -3_500,
              },
            },
          },
        },
      })),
    );

    expect(etat.crises.alerte).toBeNull();
  });

  it("réserve aussi tout le coût restant d’un Chantier au-delà du checkpoint", () => {
    let etat = rationnerRefroidissement(
      preparerGrandAiguillage((candidate) => ({
        ...candidate,
        pilotage: {
          ...candidate.pilotage,
          incidentActif: null,
          economie: {
            ...candidate.pilotage.economie,
            stocks: {
              ...candidate.pilotage.economie.stocks,
              materiaux: {
                ...candidate.pilotage.economie.stocks.materiaux,
                quantite: 13,
              },
            },
          },
        },
      })),
    );
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    etat = appliquerCommande(etat, { type: "halte.deployer" }).etat;

    expect(() =>
      appliquerCommande(etat, {
        type: "chantier.engager",
        ordre: {
          type: "construction",
          definitionId: "condenseur-thermique",
          emplacementId: "intendance.polyvalent",
        },
        priorite: "basse",
      }),
    ).toThrow("réservés aux deux réponses");
  });

  it("réserve les Matériaux et détache une Plateforme réellement libre au checkpoint", () => {
    const avecQuatorzeMateriaux = preparerGrandAiguillage((etat) => ({
      ...etat,
      pilotage: {
        ...etat.pilotage,
        economie: {
          ...etat.pilotage.economie,
          stocks: {
            ...etat.pilotage.economie.stocks,
            materiaux: {
              ...etat.pilotage.economie.stocks.materiaux,
              quantite: 14,
            },
          },
        },
      },
    }));
    let etat = rationnerRefroidissement(avecQuatorzeMateriaux);
    etat = appliquerCommande(etat, { type: "halte.deployer" }).etat;
    expect(() =>
      appliquerCommande(etat, {
        type: "chantier.engager",
        ordre: {
          type: "construction",
          definitionId: "poste-operations",
          emplacementId: "intendance.polyvalent",
        },
        priorite: "basse",
      }),
    ).toThrow("réservés aux deux réponses");

    etat = rationnerRefroidissement(preparerGrandAiguillage());
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 30,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    etat = appliquerCommande(etat, { type: "halte.deployer" }).etat;
    etat = appliquerCommande(etat, {
      type: "chantier.engager",
      ordre: {
        type: "construction",
        definitionId: "condenseur-thermique",
        emplacementId: "intendance.polyvalent",
      },
      priorite: "basse",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 1,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "crise.declencher",
      criseId: "trame-fer.cascade-materielle",
    } as CommandeCampagne).etat;

    const resolution = appliquerCommande(etat, {
      type: "crise.resoudre",
      criseId: "trame-fer.cascade-materielle",
      reponseId: "detacher-plateforme",
    } as CommandeCampagne).etat;

    expect(resolution.infrastructure.chantierActif?.ordre).toMatchObject({
      emplacementId: "intendance.polyvalent",
    });
    expect(resolution.citeCaravane.formation.plateformes).toContain(
      "intendance",
    );
    expect(
      resolution.narration.faitsDeCampagne.at(-1)?.effets.materiels,
    ).toEqual([
      { type: "plateforme.detachee", plateforme: "foyers" },
    ]);
  });

  it.each([
    {
      reponseId: "etayer-chassis",
      cicatrice: "cicatrice.chassis-etaye-dans-l-urgence",
      garantie: "charge-repartie-trame",
      variationMateriaux: -7,
      variationPlateformes: 0,
    },
    {
      reponseId: "detacher-plateforme",
      cicatrice: "cicatrice.plateforme-detachee-trame",
      garantie: "attelage-recale-trame",
      variationMateriaux: 0,
      variationPlateformes: -1,
    },
  ] as const)(
    "résout par $reponseId avec un coût et une cicatrice réels",
    ({
      reponseId,
      cicatrice,
      garantie,
      variationMateriaux,
      variationPlateformes,
    }) => {
      const enCrise = atteindreCriseDeTrame();
      const materiauxAvant =
        enCrise.pilotage.economie.stocks.materiaux.quantite;
      const plateformesAvant =
        enCrise.citeCaravane.formation.plateformes.length;
      const fluxVivresAvant =
        enCrise.pilotage.economie.stocks.vivres.fluxParHeure;
      const fluxEauAvant =
        enCrise.pilotage.economie.stocks.eau.fluxParHeure;
      const resolution = appliquerCommande(enCrise, {
        type: "crise.resoudre",
        criseId: "trame-fer.cascade-materielle",
        reponseId,
      } as CommandeCampagne).etat;

      expect(
        resolution.pilotage.economie.stocks.materiaux.quantite,
      ).toBe(materiauxAvant + variationMateriaux);
      expect(resolution.citeCaravane.formation.plateformes).toHaveLength(
        plateformesAvant + variationPlateformes,
      );
      expect(resolution.crises.cicatrices.at(-1)).toMatchObject({
        id: cicatrice,
        irreversible: true,
      });
      expect(resolution.crises.recuperations.at(-1)).toMatchObject({
        garantie,
        statut: "amorcee",
      });
      if (reponseId === "detacher-plateforme") {
        expect(resolution.citeCaravane.formation.plateformes).not.toContain(
          "intendance",
        );
        expect(resolution.infrastructure.plateformes.map(({ id }) => id)).not
          .toContain("intendance");
        expect(
          resolution.infrastructure.quartiers.map(({ id }) => id),
        ).not.toContain("intendance");
        expect(
          resolution.pilotage.economie.stocks.vivres.fluxParHeure,
        ).toBe(fluxVivresAvant - 8);
        expect(
          resolution.pilotage.economie.stocks.eau.fluxParHeure,
        ).toBe(fluxEauAvant - 10);
        expect(
          resolution.narration.faitsDeCampagne.at(-1)?.effets.materiels,
        ).toEqual([
          {
            type: "plateforme.detachee",
            plateforme: "intendance",
          },
        ]);
      }
    },
  );

  it("accomplit ou manque ses Récupérations par les routes ordinaires et infléchit le coût ultérieur", () => {
    let etat = appliquerCommande(atteindreCriseDeTrame(), {
      type: "crise.resoudre",
      criseId: "trame-fer.cascade-materielle",
      reponseId: "etayer-chassis",
    } as CommandeCampagne).etat;
    etat = voyager(etat, "rocade-du-marche", 135);

    expect(etat.crises.recuperations.at(-1)).toMatchObject({
      garantie: "charge-repartie-trame",
      statut: "accomplie",
      faitResultat:
        "crise.recuperation.charge-repartie-trame.accomplie",
    });
    expect(
      calculerCoutDynamiqueDeLAiguillageZero(
        etat,
        "assurer-transport-autonome",
      ),
    ).toMatchObject({ cible: 12 });

    let autre = appliquerCommande(atteindreCriseDeTrame(), {
      type: "crise.resoudre",
      criseId: "trame-fer.cascade-materielle",
      reponseId: "detacher-plateforme",
    } as CommandeCampagne).etat;
    autre = voyager(autre, "rocade-du-marche", 135);
    expect(autre.crises.recuperations.at(-1)?.statut).toBe("amorcee");
    autre = voyager(autre, "ligne-du-signal-zero", 120);

    expect(autre.crises.recuperations.at(-1)).toMatchObject({
      garantie: "attelage-recale-trame",
      statut: "accomplie",
      faitResultat:
        "crise.recuperation.attelage-recale-trame.accomplie",
    });
    expect(
      calculerCoutDynamiqueDeLAiguillageZero(
        autre,
        "assurer-transport-autonome",
      ),
    ).toMatchObject({ cible: 11 });
  });

  it.each([
    {
      reponseId: "etayer-chassis",
      routes: [["rocade-des-regulateurs", 150]],
      fait: "crise.recuperation.charge-repartie-trame.manquee",
    },
    {
      reponseId: "detacher-plateforme",
      routes: [
        ["rocade-du-marche", 135],
        ["traverse-des-porteurs", 150],
      ],
      fait: "crise.recuperation.attelage-recale-trame.manquee",
    },
  ] as const)(
    "marque la Récupération de $reponseId comme manquée à son horizon ordinaire",
    ({ reponseId, routes, fait }) => {
      let etat = appliquerCommande(atteindreCriseDeTrame(), {
        type: "crise.resoudre",
        criseId: "trame-fer.cascade-materielle",
        reponseId,
      } as CommandeCampagne).etat;
      for (const [tronconId, secondesReelles] of routes) {
        etat = voyager(etat, tronconId, secondesReelles);
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
