import { describe, expect, it } from "vitest";

import {
  confirmerEngagementDeRoute,
  creerEtatDesRoutesInitial,
  traiterJalonsDeRoute,
} from "../simulation/routes";
import {
  engagementsDuDeversoirSontCausaux,
  estEtatDesRoutes,
} from "./validationRoutes";

describe("validation persistante des routes", () => {
  it("accepte les états initiaux, engagés et arrivés produits par la simulation", () => {
    const initial = creerEtatDesRoutesInitial();
    const engagement = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      30,
    ).etat;
    const arrivee = traiterJalonsDeRoute(engagement, 30, 390).etat;

    expect(estEtatDesRoutes(initial, 30)).toBe(true);
    expect(estEtatDesRoutes(engagement, 30)).toBe(true);
    expect(estEtatDesRoutes(arrivee, 390)).toBe(true);
  });

  it("accepte une campagne gratuite antérieure au chargement du catalogue premium", () => {
    const initial = creerEtatDesRoutesInitial();
    const etatsGratuits = { ...initial.etatsReels };
    delete etatsGratuits["chemin-des-vanniers"];
    delete etatsGratuits["chenal-des-vannes"];

    expect(
      estEtatDesRoutes({ ...initial, etatsReels: etatsGratuits }, 0),
    ).toBe(true);
    expect(
      estEtatDesRoutes(
        {
          ...initial,
          etatsReels: {
            ...etatsGratuits,
            "route-inconnue": "praticable",
          },
        },
        0,
      ),
    ).toBe(false);
  });

  it("rejette un raccourci vers Signal-Zéro qui contourne la connexion aval", () => {
    const troncons = [
      "digue-des-puits",
      "chemin-des-vanniers",
      "chenal-des-vannes",
      "conduite-du-deversoir",
      "passage-de-la-ligne-zero",
      "rampe-de-barriere-neuve",
      "voie-des-ponts-lourds",
    ] as const;
    let routes = creerEtatDesRoutesInitial();
    let seconde = 0;
    for (const tronconId of troncons) {
      const engagement = confirmerEngagementDeRoute(
        routes,
        tronconId,
        seconde,
      ).etat;
      const arriveeA = engagement.engagements.at(-1)!.arriveeA;
      routes = traiterJalonsDeRoute(
        engagement,
        seconde,
        arriveeA,
      ).etat;
      seconde = arriveeA;
    }
    const raccourci = {
      ...routes,
      engagements: [
        ...routes.engagements,
        {
          id: `engagement-${routes.engagements.length + 1}`,
          tronconId: "rocade-des-regulateurs" as const,
          origine: "grand-aiguillage" as const,
          destination: "signal-zero" as const,
          engageA: seconde,
          arriveeA: seconde + 600,
          statut: "en-cours" as const,
        },
      ],
    };

    expect(estEtatDesRoutes(raccourci, seconde)).toBe(false);
  });

  it("rejette les états réels, sources et Jalons impossibles", () => {
    const initial = creerEtatDesRoutesInitial();
    const engagement = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      30,
    ).etat;
    const arrivee = traiterJalonsDeRoute(engagement, 30, 390).etat;

    expect(
      estEtatDesRoutes(
        {
          ...initial,
          etatsReels: { ...initial.etatsReels, "digue-des-puits": "coupe" },
        },
        30,
      ),
    ).toBe(false);
    expect(
      estEtatDesRoutes(
        {
          ...initial,
          renseignements: [
            { ...initial.renseignements[0], source: "Source omnisciente" },
            ...initial.renseignements.slice(1),
          ],
        },
        30,
      ),
    ).toBe(false);
    expect(
      estEtatDesRoutes(
        {
          ...arrivee,
          jalons: [{ ...arrivee.jalons[0], cause: "sans-cause" }],
        },
        390,
      ),
    ).toBe(false);
    expect(estEtatDesRoutes(engagement, 391)).toBe(false);
  });

  it("réserve les consommations persistées aux Nacelles V7 et refuse leur falsification", () => {
    const initial = creerEtatDesRoutesInitial();
    const engagementOrdinaire = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      30,
    ).etat;
    const engagementOrdinaireGratuit = {
      ...engagementOrdinaire,
      engagements: engagementOrdinaire.engagements.map((engagement) => ({
        ...engagement,
        consommationsAppliquees: { combustible: 0, eau: 0 },
      })),
    };

    expect(estEtatDesRoutes(engagementOrdinaireGratuit, 30)).toBe(false);

    const versHautPuits = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      0,
    ).etat;
    const aHautPuits = traiterJalonsDeRoute(
      versHautPuits,
      0,
      360,
    ).etat;
    const versLesVanniers = confirmerEngagementDeRoute(
      aHautPuits,
      "chemin-des-vanniers",
      360,
    ).etat;
    const etatAuxVanniers = traiterJalonsDeRoute(
      versLesVanniers,
      360,
      780,
    ).etat;
    const engagementDesNacelles = confirmerEngagementDeRoute(
      etatAuxVanniers,
      "chenal-des-vannes",
      780,
      { combustible: 4, eau: 6 },
    ).etat;

    expect(estEtatDesRoutes(engagementDesNacelles, 780)).toBe(true);
    expect(
      estEtatDesRoutes(
        {
          ...engagementDesNacelles,
          engagements: engagementDesNacelles.engagements.map(
            (engagement) => ({
              ...engagement,
              consommationsAppliquees: { combustible: 1, eau: 1 },
            }),
          ),
        },
        780,
      ),
    ).toBe(false);
    expect(
      estEtatDesRoutes(
        {
          ...engagementDesNacelles,
          engagements: engagementDesNacelles.engagements.map(
            (engagement) => {
              const sansConsommations = { ...engagement };
              delete sansConsommations.consommationsAppliquees;
              return sansConsommations;
            },
          ),
        },
        780,
      ),
    ).toBe(false);
  });

  it("circonscrit l’ancienne liaison Veille-Basse–Relais à sa provenance V7", () => {
    const initial = creerEtatDesRoutesInitial();
    const versVeilleBasse = confirmerEngagementDeRoute(
      initial,
      "chaussee-de-veille-basse",
      0,
    ).etat;
    const aVeilleBasse = traiterJalonsDeRoute(
      versVeilleBasse,
      0,
      480,
    ).etat;
    const engagementHistorique = {
      id: "engagement-2",
      tronconId: "nacelles-de-veille-basse",
      origine: "veille-basse",
      destination: "relais-des-vannes",
      engageA: 480,
      arriveeA: 840,
      statut: "termine",
      consommationsAppliquees: { combustible: 6, eau: 8 },
    } as const;
    const etatHistorique = {
      ...aVeilleBasse,
      position: "relais-des-vannes" as const,
      etatsReels: {
        ...aVeilleBasse.etatsReels,
        "nacelles-de-veille-basse": "coupe" as const,
      },
      engagements: [...aVeilleBasse.engagements, engagementHistorique],
      jalons: [
        ...aVeilleBasse.jalons,
        {
          id: "jalon-route-2",
          type: "fin-de-troncon",
          moment: 840,
          tronconId: "nacelles-de-veille-basse",
          cause: "front-de-cendre.condamnation-arriere",
        } as const,
      ],
    };

    expect(estEtatDesRoutes(etatHistorique, 840)).toBe(false);
    expect(estEtatDesRoutes(etatHistorique, 840, true)).toBe(true);
    expect(
      estEtatDesRoutes(
        { ...etatHistorique, topologieHistorique: "nacelles-v7" },
        840,
      ),
    ).toBe(true);
    expect(
      estEtatDesRoutes(
        { ...initial, topologieHistorique: "nacelles-v7" },
        0,
      ),
    ).toBe(false);
  });

  it("refuse les gates du Déversoir franchies avant leurs faits publics", () => {
    const initial = creerEtatDesRoutesInitial();
    const auRelais = {
      ...initial,
      position: "relais-des-vannes" as const,
    };
    const conduite = confirmerEngagementDeRoute(
      auRelais,
      "conduite-du-deversoir",
      100,
    ).etat;

    expect(engagementsDuDeversoirSontCausaux(conduite, [])).toBe(false);
    expect(
      engagementsDuDeversoirSontCausaux(conduite, [
        {
          id: "bassins.nacelles.conseil-passage-partage",
          moment: 101,
        },
      ]),
    ).toBe(false);
    expect(
      engagementsDuDeversoirSontCausaux(conduite, [
        {
          id: "bassins.nacelles.conseil-passage-partage",
          moment: 100,
        },
      ]),
    ).toBe(true);

    const auDeversoir = traiterJalonsDeRoute(
      conduite,
      100,
      460,
    ).etat;
    const passage = confirmerEngagementDeRoute(
      auDeversoir,
      "piste-des-levees",
      460,
    ).etat;
    expect(
      engagementsDuDeversoirSontCausaux(passage, [
        {
          id: "bassins.nacelles.conseil-passage-partage",
          moment: 100,
        },
      ]),
    ).toBe(false);
    expect(
      engagementsDuDeversoirSontCausaux(passage, [
        {
          id: "bassins.nacelles.conseil-passage-partage",
          moment: 100,
        },
        {
          id: "bassins.deversoir.passage-transmis",
          moment: 460,
        },
      ]),
    ).toBe(true);

    const passageParLaLigneZero = confirmerEngagementDeRoute(
      auDeversoir,
      "passage-de-la-ligne-zero",
      460,
    ).etat;
    const faitsDePassage = [
      {
        id: "bassins.nacelles.conseil-passage-partage",
        moment: 100,
      },
      {
        id: "bassins.deversoir.passage-prepare",
        moment: 460,
      },
    ];
    expect(
      engagementsDuDeversoirSontCausaux(passageParLaLigneZero, [
        ...faitsDePassage,
        {
          id: "bassins.deversoir.ligne-zero-preservee",
          moment: 460,
        },
      ]),
    ).toBe(false);
    expect(
      engagementsDuDeversoirSontCausaux(passageParLaLigneZero, [
        ...faitsDePassage,
        {
          id: "bassins.deversoir.ligne-zero-relevee",
          moment: 460,
        },
      ]),
    ).toBe(true);
  });
});
