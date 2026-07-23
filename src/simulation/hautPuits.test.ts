import { describe, expect, it } from "vitest";

import {
  appliquerCommande,
  creerCampagneInitiale,
} from "./campagne";
import { creerPilotageInitial } from "./pilotage";
import {
  appliquerCommandeAHautPuits,
  creerEtatDeHautPuitsInitial,
} from "./hautPuits";

describe("Marché de besoins de Haut-Puits", () => {
  it("échange une offre finie puis interdit de la reproduire", () => {
    const etatInitial = creerEtatDeHautPuitsInitial();
    const stocksInitiaux = creerPilotageInitial().economie.stocks;

    const echange = appliquerCommandeAHautPuits(
      etatInitial,
      stocksInitiaux,
      {
        type: "haut-puits.marche.echanger",
        offreId: "eau-contre-materiaux",
      },
      360,
    );

    expect(echange.etat.marche.offres).toEqual([
      expect.objectContaining({
        id: "eau-contre-materiaux",
        echangesRestants: 0,
      }),
      expect.objectContaining({
        id: "eau-contre-remedes",
        echangesRestants: 1,
      }),
    ]);
    expect(echange.stocks.eau.quantite).toBe(820);
    expect(echange.stocks.materiaux.quantite).toBe(76);
    expect(echange.evenements).toEqual([
      {
        type: "haut-puits.marche.offre-epuisee",
        offreId: "eau-contre-materiaux",
        moment: 360,
      },
    ]);
    expect(() =>
      appliquerCommandeAHautPuits(
        echange.etat,
        echange.stocks,
        {
          type: "haut-puits.marche.echanger",
          offreId: "eau-contre-materiaux",
        },
        361,
      ),
    ).toThrow("épuisée");
  });
});

describe("Colonie de Haut-Puits", () => {
  it("expose son état borné, son devenir et les deux transformations sans en imposer une", () => {
    const etat = creerEtatDeHautPuitsInitial();

    expect(etat.colonie).toEqual({
      id: "haut-puits",
      statut: "stable",
      pressions: ["autonomie-hydrique-menacee"],
      devenir: "negociation-ouverte",
    });
    expect(etat.colonie.pressions).toHaveLength(1);
    expect(etat.projetsTransformationDisponibles).toEqual([
      "decanteur-itinerant",
      "arche-des-deplaces",
    ]);
    expect(etat.projetChoisi).toBeNull();
    expect(etat.relationPublique).toBe("transactionnelle");
    expect(etat.engagementsDiplomatiques).toEqual([]);
  });

  it("engage le partage de l’Eau et prépare son écho au Conseil des Vannes", () => {
    const transition = appliquerCommandeAHautPuits(
      creerEtatDeHautPuitsInitial(),
      creerPilotageInitial().economie.stocks,
      {
        type: "haut-puits.negociation.decider",
        decision: "partager-eau",
      },
      420,
    );

    expect(transition.etat.colonie).toEqual({
      id: "haut-puits",
      statut: "fragile",
      pressions: ["reserves-entamees"],
      devenir: "partage-organise",
    });
    expect(transition.etat.relationPublique).toBe("cooperative");
    expect(transition.etat.engagementsDiplomatiques).toEqual([
      {
        id: "haut-puits.partage-au-conseil-des-vannes",
        prisA: 420,
        echoPrevu: "conseil-des-vannes",
      },
    ]);
    expect(transition.stocks.eau.quantite).toBe(730);
    expect(transition.evenements).toEqual([
      {
        type: "haut-puits.negociation.tranchee",
        decision: "partager-eau",
        moment: 420,
        echoPrevu: "conseil-des-vannes",
      },
    ]);
  });

  it("peut protéger les réserves sans choisir de transformation majeure", () => {
    const initial = creerEtatDeHautPuitsInitial();
    const stocks = creerPilotageInitial().economie.stocks;
    const transition = appliquerCommandeAHautPuits(
      initial,
      stocks,
      {
        type: "haut-puits.negociation.decider",
        decision: "proteger-reserves",
      },
      420,
    );

    expect(transition.etat.colonie).toMatchObject({
      statut: "stable",
      pressions: ["familles-ecartees"],
      devenir: "reserves-protegees",
    });
    expect(transition.etat.relationPublique).toBe("fermee");
    expect(transition.etat.engagementsDiplomatiques).toEqual([]);
    expect(transition.etat.projetChoisi).toBeNull();
    expect(transition.stocks).toBe(stocks);
    expect(() =>
      appliquerCommandeAHautPuits(
        transition.etat,
        transition.stocks,
        {
          type: "haut-puits.negociation.decider",
          decision: "partager-eau",
        },
        421,
      ),
    ).toThrow("déjà tranchée");
  });
});

describe("Campagne à Haut-Puits", () => {
  it("raccorde le Marché à l’économie persistante seulement sur place", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    const commande = {
      type: "haut-puits.marche.echanger",
      offreId: "eau-contre-materiaux",
    } as const;

    expect(() => appliquerCommande(initial, commande)).toThrow(
      "présent à Haut-Puits",
    );

    const surPlace = {
      ...initial,
      routes: { ...initial.routes, position: "haut-puits" as const },
    };
    const transition = appliquerCommande(surPlace, commande);

    expect(transition.etat.hautPuits.marche.offres[0]).toMatchObject({
      echangesRestants: 0,
    });
    expect(transition.etat.pilotage.economie.stocks).toMatchObject({
      eau: { quantite: 820 },
      materiaux: { quantite: 76 },
    });
    expect(transition.evenements).toEqual([
      {
        type: "haut-puits.marche.offre-epuisee",
        offreId: "eau-contre-materiaux",
        moment: 0,
      },
    ]);

    const enDepartDeHautPuits = {
      ...surPlace,
      routes: {
        ...surPlace.routes,
        engagements: [
          {
            id: "engagement-1",
            tronconId: "chemin-des-vanniers" as const,
            origine: "haut-puits" as const,
            destination: "les-vanniers" as const,
            engageA: 0,
            arriveeA: 420,
            statut: "en-cours" as const,
          },
        ],
      },
    };
    expect(() =>
      appliquerCommande(enDepartDeHautPuits, commande),
    ).toThrow("présent à Haut-Puits");
  });

  it("rend les quatre Événements atteignables dans l’ordre à la Halte", () => {
    const initial = creerCampagneInitiale("CENDRE-01");
    let etat: ReturnType<typeof creerCampagneInitiale> = {
      ...initial,
      tempsDuConvoi: { ...initial.tempsDuConvoi, secondes: 360 },
      routes: { ...initial.routes, position: "haut-puits" as const },
      narration: {
        evenementActif: null,
        evenementsJoues: ["bassins-fendus.eau-de-haut-puits"],
        faitsDeCampagne: [
          {
            id: "bassins.haut-puits.partage-promis",
            cause: "bassins-fendus.eau-de-haut-puits",
            acteurs: ["porte-lanterne", "puits-libres"],
            cible: "habitants-haut-puits",
            moment: 360,
            effets: { materiels: [], humains: [] },
          },
        ],
      },
    };
    const parcours = [
      ["bassins.haut-puits.pacte-des-citernes", "ouvrir-citerne"],
      ["bassins.haut-puits.vanniers-du-panache", "confiner-boues"],
      ["bassins.haut-puits.boues-du-decanteur", "consigner-decanteur"],
      ["bassins.haut-puits.ilyana-et-la-vanne", "lui-confier-registre"],
    ] as const;

    for (const [evenementId, choixId] of parcours) {
      etat = appliquerCommande(etat, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 0,
      }).etat;
      expect(etat.narration.evenementActif).toBe(evenementId);
      etat = appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId,
        choixId,
      }).etat;
      if (evenementId === "bassins.haut-puits.pacte-des-citernes") {
        expect(etat.hautPuits).toMatchObject({
          colonie: { statut: "fragile", devenir: "partage-organise" },
          relationPublique: "cooperative",
          engagementsDiplomatiques: [
            {
              echoPrevu: "conseil-des-vannes",
              prisA: 360,
            },
          ],
        });
        expect(etat.pilotage.economie.stocks.eau.quantite).toBe(730);
      }
    }

    expect(etat.narration.evenementsJoues).toEqual([
      "bassins-fendus.eau-de-haut-puits",
      ...parcours.map(([id]) => id),
    ]);
    expect(
      etat.narration.faitsDeCampagne.map((fait) => fait.id),
    ).toContain("bassins.haut-puits.ilyana-garante");
  });
});
