import { describe, expect, it } from "vitest";

import { projeterCampagne } from "../application/application";
import { projeterAtlas } from "../application/routes";
import { projeterVoieDesColonies } from "../application/voieColonies";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import type { FaitDeCampagne } from "./faits";
import type { IdentifiantDeTroncon } from "./routes";
import {
  choixDeLaVoieDesColoniesEstDisponible,
  reconstruireEtatDeLaVoieDesColonies,
} from "./voieColonies";

function fait(id: string, moment = 3_000): FaitDeCampagne {
  return {
    id,
    cause: "trame.aiguillage-zero.le-passage-de-la-couronne",
    acteurs: ["porte-lanterne"],
    cible: "couronne-muette",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function preparer(credible = true): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-VOIE-COLONIES");
  const commun = {
    ...initial,
    tempsDuConvoi: { secondes: 3_000, vitesse: 4 as const },
    routes: { ...initial.routes, position: "couronne-muette" as const },
    narration: {
      ...initial.narration,
      faitsDeCampagne: [
        fait("trame.aiguillage-zero.passage-consigne"),
        ...(credible
          ? [
              fait("veille-basse.cohorte-accueillie"),
              fait(
                "trame.grand-aiguillage.reparation-locale-ouverte",
              ),
              fait("trame.traverse-libre.manifeste-public"),
            ]
          : []),
      ],
    },
  };
  if (!credible) {
    return {
      ...commun,
      pilotage: {
        ...commun.pilotage,
        economie: {
          ...commun.pilotage.economie,
          stocks: {
            ...commun.pilotage.economie.stocks,
            eau: {
              ...commun.pilotage.economie.stocks.eau,
              quantite: 0,
            },
            materiaux: {
              ...commun.pilotage.economie.stocks.materiaux,
              quantite: 0,
            },
          },
        },
      },
    };
  }
  return {
    ...commun,
    hautPuits: {
      ...commun.hautPuits,
      relationPublique: "cooperative",
    },
    veilleBasse: {
      ...commun.veilleBasse,
      colonie: {
        ...commun.veilleBasse.colonie,
        statut: "stable",
        techniciens: {
          ...commun.veilleBasse.colonie.techniciens,
          equipesDisponibles: 1,
        },
      },
      cohorte: {
        ...commun.veilleBasse.cohorte,
        integration: {
          ...commun.veilleBasse.cohorte.integration,
          statut: "equipes-integrees",
          equipesIntegrees: 2,
        },
      },
    },
    trameDeFer: {
      ...commun.trameDeFer,
      relationRepublique: "cooperative",
      grandAiguillage: {
        ...commun.trameDeFer.grandAiguillage,
        statut: "atelier-negocie",
      },
      occasions: {
        ...commun.trameDeFer.occasions,
        attelageFedere: {
          ...commun.trameDeFer.occasions.attelageFedere,
          statut: "annoncee",
        },
      },
    },
    traverseLibre: {
      ...commun.traverseLibre,
      statut: "autonome",
      relationPuitsLibres: "cooperative",
      routeSecondaire: {
        ...commun.traverseLibre.routeSecondaire,
        statut: "reparee",
      },
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

describe("voie des Colonies", () => {
  it("ouvre la piste des Serres après le registre puis la Rampe après le ralliement", () => {
    expect(() =>
      appliquerCommande(
        {
          ...preparer(),
          narration: {
            ...preparer().narration,
            faitsDeCampagne: [],
          },
        },
        {
          type: "engagement-de-route.confirmer",
          tronconId: "piste-des-serres-de-verre",
        },
      ),
    ).toThrow("récit de la branche");

    expect(
      projeterAtlas(preparer()).troncons.find(
        ({ id }) => id === "piste-des-serres-de-verre",
      ),
    ).toMatchObject({
      destination: "Serres-de-Verre",
      consommation: "7 L de Combustible",
      renseignements: [
        expect.objectContaining({
          source: "Rapports croisés des quatre Colonies quittées",
        }),
      ],
    });

    const auxSerres = voyager(
      preparer(),
      "piste-des-serres-de-verre",
    );
    expect(auxSerres.narration.evenementActif).toBe(
      "couronne.serres-de-verre.le-ralliement-des-cinq-colonies",
    );
    expect(() =>
      appliquerCommande(auxSerres, {
        type: "engagement-de-route.confirmer",
        tronconId: "rampe-du-seuil",
      }),
    ).toThrow("récit de la branche");
    const rallie = choisir(auxSerres, "rallier-coalition");
    expect(
      projeterAtlas(rallie).troncons.find(
        ({ id }) => id === "rampe-du-seuil",
      )?.destination,
    ).toBe("Le Seuil");
  });

  it("fait revenir causalement les cinq Colonies et la Cohorte", () => {
    const fragile = {
      ...preparer(false),
      routes: {
        ...preparer(false).routes,
        position: "serres-de-verre" as const,
      },
    };
    expect(reconstruireEtatDeLaVoieDesColonies(fragile)).toMatchObject({
      retours: {
        hautPuits: "rapport",
        veilleBasse: "rapport",
        grandAiguillage: "requisition",
        traverseLibre: "penurie",
        seuil: "habitants-du-seuil",
      },
      cohorte: "absente",
      credibilite: { voie: "fragile" },
    });
    expect(projeterVoieDesColonies(fragile, "en")).toMatchObject({
      visible: true,
      titre: "Colony Route",
      retours: expect.arrayContaining([
        "High Well: report relayed",
        "Lower Watch: report relayed",
        "Grand Junction: requisition order",
        "Free Crossing: shortage made visible",
        "Threshold: residents represented on site",
      ]),
    });

    const ralliee = {
      ...preparer(),
      routes: {
        ...preparer().routes,
        position: "serres-de-verre" as const,
      },
    };
    expect(reconstruireEtatDeLaVoieDesColonies(ralliee)).toMatchObject({
      retours: {
        hautPuits: "delegation",
        veilleBasse: "delegation",
        grandAiguillage: "atelier",
        traverseLibre: "autonomie",
        seuil: "habitants-du-seuil",
      },
      cohorte: "integree",
      credibilite: {
        voie: "credible",
        alliances: 4,
        equipes: 5,
      },
    });
  });

  it("ignore les techniciens restés comptés dans une Veille-Basse perdue", () => {
    const reference = creerCampagneInitiale(
      "CENDRE-COLONIES-SANS-FANTOMES",
    );
    const prepare = preparer();
    const veillePerdue = {
      ...prepare,
      routes: {
        ...prepare.routes,
        position: "serres-de-verre" as const,
      },
      veilleBasse: {
        ...prepare.veilleBasse,
        colonie: {
          ...prepare.veilleBasse.colonie,
          statut: "perdue" as const,
          techniciens: {
            ...prepare.veilleBasse.colonie.techniciens,
            equipesDisponibles: 2,
          },
        },
        cohorte: {
          ...prepare.veilleBasse.cohorte,
          integration: reference.veilleBasse.cohorte.integration,
        },
      },
      trameDeFer: {
        ...prepare.trameDeFer,
        occasions: reference.trameDeFer.occasions,
      },
      traverseLibre: {
        ...prepare.traverseLibre,
        routeSecondaire: reference.traverseLibre.routeSecondaire,
      },
    };

    expect(
      reconstruireEtatDeLaVoieDesColonies(veillePerdue).credibilite,
    ).toMatchObject({
      alliances: 3,
      equipes: 0,
      voie: "fragile",
    });
    expect(
      choixDeLaVoieDesColoniesEstDisponible(
        veillePerdue,
        "rallier-coalition",
      ),
    ).toBe(false);
  });

  it("atteint le Seuil, persiste ses Pressions et prépare l’accès allié sans choisir de Solution", () => {
    let etat = voyager(preparer(), "piste-des-serres-de-verre");
    const eau = etat.pilotage.economie.stocks.eau.quantite;
    const materiaux =
      etat.pilotage.economie.stocks.materiaux.quantite;
    etat = choisir(etat, "rallier-coalition");
    expect(etat.pilotage.economie.stocks.eau.quantite).toBe(eau - 10);
    expect(
      etat.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiaux - 8);

    etat = voyager(etat, "rampe-du-seuil");
    expect(etat.narration.evenementActif).toBe(
      "couronne.seuil.le-marche-des-abris",
    );
    etat = choisir(etat, "rationner-marche-partager-abris");
    etat = choisir(etat, "recopier-releves-aux-delegations");
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual([
      "engager-equipes-ralliees",
      "maintenir-breche-couteuse",
    ]);
    etat = choisir(etat, "engager-equipes-ralliees");
    etat = choisir(etat, "tenir-registre-commun");

    expect(reconstruireEtatDeLaVoieDesColonies(etat)).toMatchObject({
      serresDeVerre: {
        interaction: "coalition-ralliee",
        devenir: "carrefour-allie",
      },
      seuil: {
        statut: "stable",
        pressions: ["pieces-rares"],
        marche: "rationne",
        abris: "partages",
        relevesDuNoeud: "recoupes",
        revendication: "voix-garantie",
      },
      accesAuNoeud: "voie-alliee",
      gardeDuRegistre: "commune",
    });
    expect(
      etat.narration.faitsDeCampagne.filter(({ id }) =>
        id.startsWith("couronne."),
      ),
    ).toHaveLength(5);
  });

  it("conserve le recours coûteux quand alliances, eau et pièces manquent", () => {
    let etat = voyager(
      preparer(false),
      "piste-des-serres-de-verre",
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["forcer-passage"]);
    const habitants = etat.citeCaravane.habitants;
    etat = choisir(etat, "forcer-passage");
    expect(etat.citeCaravane.habitants).toBe(habitants - 6);
    etat = voyager(etat, "rampe-du-seuil");
    etat = choisir(etat, "rationner-marche-partager-abris");
    etat = choisir(etat, "conserver-series-separees");
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["maintenir-breche-couteuse"]);
    etat = choisir(etat, "maintenir-breche-couteuse");
    expect(etat.citeCaravane.habitants).toBe(habitants - 10);
    expect(
      reconstruireEtatDeLaVoieDesColonies(etat).accesAuNoeud,
    ).toBe("breche-couteuse");
  });
});
