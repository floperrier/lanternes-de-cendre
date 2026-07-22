import { describe, expect, expectTypeOf, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
} from "./campagne";
import {
  classerEcartDExpedition,
  type EtatDesExpeditions,
  type Expedition,
  type IdentifiantDExpedition,
} from "./expeditions";

describe("Expédition des Vannes Grises", () => {
  it("représente une collection extensible d’opérations simultanées", () => {
    expectTypeOf<EtatDesExpeditions["operations"]>().toEqualTypeOf<
      readonly Expedition[]
    >();
    expectTypeOf<IdentifiantDExpedition>().toEqualTypeOf<string>();
  });

  it("lance un mandat borné et consomme ses coûts connus exacts", () => {
    const initial = creerCampagneInitiale("CENDRE-01");

    expect(initial.expeditions.operations[0]).toMatchObject({
      statut: "prete",
      mandat: {
        objectif: "retablir-debit-exploitable",
        issueDeRepli: "cartographier-acces-et-rentrer",
        responsable: "liora",
        groupeHabitants: 4,
        equipement: "filtres-doubles",
        enveloppeAutonomie: {
          ecartReversibleMaxSecondes: 2_700,
          depenseMineureRemedesMax: 1,
        },
        seuilDeRepli: "premiere-blessure",
      },
    });

    const transition = appliquerCommande(
      initial,
      {
        type: "expedition.lancer",
        expeditionId: "vannes-grises",
      },
    );

    expect(transition.etat.expeditions.operations[0]).toMatchObject({
      statut: "en-cours",
      progressionPourcent: 0,
      dureeActiveSecondes: 0,
      rapports: [
        {
          type: "depart",
          moment: 0,
          cause: "mandat.vannes-grises.confirme",
          acteurs: ["porte-lanterne", "liora", "equipe-vannes-grises"],
          cible: "station-vannes-grises",
        },
      ],
      mouvementsDeStocks: [
        { moment: 0, stock: "vivres", variation: -331.2 },
        { moment: 0, stock: "eau", variation: -182.4 },
        { moment: 0, stock: "materiaux", variation: -2 },
      ],
    });
    expect(transition.etat.pilotage.economie.stocks).toMatchObject({
      vivres: { quantite: 588.8 },
      eau: { quantite: 577.6 },
      materiaux: { quantite: 82 },
    });
    expect(transition.evenements).toEqual([
      {
        type: "expedition.lancee",
        expeditionId: "vannes-grises",
        moment: 0,
      },
      {
        type: "expedition.rapport-emis",
        expeditionId: "vannes-grises",
        rapportType: "depart",
        moment: 0,
      },
    ]);
  });

  it.each([
    ["objectif", { changementObjectif: true }],
    ["seuil de repli", { seuilDeRepliFranchi: true }],
    ["irréversibilité", { consequenceIrreversible: true }],
    ["coût hors mandat", { coutHorsMandat: true }],
  ])("demande un ordre distant lors d’un changement de %s", (_motif, rupture) => {
    expect(
      classerEcartDExpedition({
        reversible: true,
        dureeSupplementaireSecondes: 900,
        depenseRemedes: 0,
        changementObjectif: false,
        seuilDeRepliFranchi: false,
        consequenceIrreversible: false,
        coutHorsMandat: false,
        ...rupture,
      }),
    ).toBe("ordre-requis");
  });

  it("laisse la responsable résoudre les écarts couverts puis attend un ordre sans suspendre le convoi", () => {
    let etat = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "expedition.lancer",
      expeditionId: "vannes-grises",
    }).etat;

    const transition = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 9_420,
    });
    etat = transition.etat;

    expect(etat.expeditions.operations[0]).toMatchObject({
      statut: "ordre-requis",
      progressionPourcent: 68,
      dureeActiveSecondes: 9_420,
      rapports: [
        { type: "depart", moment: 0 },
        { type: "jalon", moment: 2_520, cause: "jalon.canal-sec" },
        {
          type: "ecart-autonome",
          moment: 5_760,
          cause: "ecart.passerelle-rompue",
        },
        {
          type: "ecart-autonome",
          moment: 9_420,
          cause: "ecart.sas-contamine",
        },
        {
          type: "rupture-mandat",
          moment: 9_420,
          cause: "ecart.salle-des-pompes-alimentee",
        },
      ],
      ordreRequis: {
        motifs: [
          "changement-objectif",
          "consequence-irreversible",
          "cout-hors-mandat",
        ],
      },
    });
    expect(etat.tempsDuConvoi).toEqual({ secondes: 9_420, vitesse: 1 });
    expect(transition.evenements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "expedition.ecart-resolu-autonomement",
          ecartId: "passerelle-rompue",
        }),
        expect.objectContaining({
          type: "expedition.ecart-resolu-autonomement",
          ecartId: "sas-contamine",
        }),
        expect.objectContaining({
          type: "expedition.ordre-requis",
          moment: 9_420,
        }),
      ]),
    );
    expect(
      etat.narration.faitsDeCampagne
        .filter((fait) => fait.id.startsWith("expedition.vannes-grises"))
        .map((fait) => ({
          cause: fait.cause,
          acteurs: fait.acteurs,
          cible: fait.cible,
          moment: fait.moment,
        })),
    ).toEqual([
      {
        cause: "mandat.vannes-grises.confirme",
        acteurs: ["porte-lanterne", "liora", "equipe-vannes-grises"],
        cible: "station-vannes-grises",
        moment: 0,
      },
      {
        cause: "jalon.canal-sec",
        acteurs: ["liora", "equipe-vannes-grises"],
        cible: "canal-sec",
        moment: 2_520,
      },
      {
        cause: "ecart.passerelle-rompue",
        acteurs: ["liora", "equipe-vannes-grises"],
        cible: "passerelle-rompue",
        moment: 5_760,
      },
      {
        cause: "ecart.sas-contamine",
        acteurs: ["liora", "equipe-vannes-grises"],
        cible: "sas-contamine",
        moment: 9_420,
      },
      {
        cause: "ecart.salle-des-pompes-alimentee",
        acteurs: ["liora", "equipe-vannes-grises"],
        cible: "salle-des-pompes",
        moment: 9_420,
      },
    ]);

    const convoiContinue = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    }).etat;
    expect(convoiContinue.tempsDuConvoi.secondes).toBe(9_480);
    expect(convoiContinue.expeditions.operations[0]).toMatchObject({
      statut: "ordre-requis",
      dureeActiveSecondes: 9_420,
    });

    const enPause = appliquerCommande(convoiContinue, {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 0,
    }).etat;
    expect(
      appliquerCommande(enPause, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 60,
      }).etat.tempsDuConvoi.secondes,
    ).toBe(9_480);
  });

  it("termine le retour et conserve le prévu, le réalisé et les conséquences de l’ordre", () => {
    let etat = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "expedition.lancer",
      expeditionId: "vannes-grises",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 9_420,
    }).etat;

    const ordre = appliquerCommande(etat, {
      type: "expedition.ordonner",
      expeditionId: "vannes-grises",
      intention: "forcer-galerie",
    });
    expect(ordre.etat.tempsDuConvoi.vitesse).toBe(1);
    expect(ordre.etat.expeditions.operations[0]).toMatchObject({
      statut: "retour",
      progressionPourcent: 92,
      ordreRequis: null,
      ordresDistants: [
        {
          intention: "forcer-galerie",
          moment: 9_420,
          cause: "ecart.salle-des-pompes-alimentee",
        },
      ],
    });
    expect(ordre.evenements).toEqual([
      {
        type: "expedition.ordre-transmis",
        expeditionId: "vannes-grises",
        intention: "forcer-galerie",
        moment: 9_420,
      },
      {
        type: "expedition.rapport-emis",
        expeditionId: "vannes-grises",
        rapportType: "ordre-distant",
        moment: 9_420,
      },
    ]);

    const retour = appliquerCommande(ordre.etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 7_500,
    });
    expect(retour.etat.expeditions.operations[0]).toMatchObject({
      statut: "terminee",
      progressionPourcent: 100,
      dureeActiveSecondes: 16_920,
      rapports: expect.arrayContaining([
        {
          type: "retour",
          moment: 16_920,
          cause: "ordre.forcer-galerie",
          acteurs: ["liora", "equipe-vannes-grises"],
          cible: "atelier-operations",
        },
      ]),
      mouvementsDeStocks: expect.arrayContaining([
        { moment: 16_920, stock: "eau", variation: 2_371.2 },
      ]),
      bilan: {
        prevision: {
          dureeSecondes: { minimum: 15_000, maximum: 19_200 },
          gainAutonomieEauJours: { minimum: 1.8, maximum: 2.7 },
        },
        realise: {
          dureeSecondes: 16_920,
          gainAutonomieEauJours: 2.6,
        },
        couts: [
          { stock: "vivres", variation: -331.2 },
          { stock: "eau", variation: -182.4 },
          { stock: "materiaux", variation: -2 },
        ],
        gains: [{ stock: "eau", variation: 2_371.2 }],
        ordres: ["forcer-galerie"],
        blessures: ["exposition-cendre-traitee"],
        renseignements: ["debit-fort-vannes-grises-confirme"],
        engagements: [],
        cicatrices: ["liora.exposition-prolongee"],
        ecarts: [
          {
            cause: "passerelle-rompue",
            consequence: "detour-reversible-sans-depasser-mandat",
          },
          {
            cause: "sas-contamine",
            consequence: "filtre-double-engage-dans-le-mandat",
          },
          {
            cause: "galerie-forcee",
            consequence: "une-exposition-traitee",
          },
        ],
      },
    });
    expect(retour.evenements).toEqual(
      expect.arrayContaining([
        {
          type: "expedition.terminee",
          expeditionId: "vannes-grises",
          intention: "forcer-galerie",
          moment: 16_920,
        },
      ]),
    );
  });

  it("refuse le départ lorsque les coûts exacts ne sont plus disponibles", () => {
    const etatEpuise = appliquerCommande(
      creerCampagneInitiale("CENDRE-01"),
      { type: "temps-du-convoi.ecouler", secondesReelles: 57_600 },
    ).etat;

    expect(() =>
      appliquerCommande(etatEpuise, {
        type: "expedition.lancer",
        expeditionId: "vannes-grises",
      }),
    ).toThrow("stocks requis pour l’Expédition");
  });

  it("inclut l’attente d’un ordre dans la durée réellement vécue", () => {
    let etat = appliquerCommande(creerCampagneInitiale("CENDRE-01"), {
      type: "expedition.lancer",
      expeditionId: "vannes-grises",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 9_420,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 3_600,
    }).etat;
    etat = appliquerCommande(etat, {
      type: "expedition.ordonner",
      expeditionId: "vannes-grises",
      intention: "forcer-galerie",
    }).etat;
    etat = appliquerCommande(etat, {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 7_500,
    }).etat;

    expect(etat.expeditions.operations[0]).toMatchObject({
      statut: "terminee",
      dureeActiveSecondes: 16_920,
      bilan: { realise: { dureeSecondes: 20_520 } },
    });
  });
});
