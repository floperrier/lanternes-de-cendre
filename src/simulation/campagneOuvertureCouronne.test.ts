import { describe, expect, it } from "vitest";

import { projeterCampagne } from "../application/application";
import { projeterOuvertureDeLaCouronne } from "../application/ouvertureCouronne";
import { projeterAtlas } from "../application/routes";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import type { FaitDeCampagne } from "./faits";
import {
  reconstruireEtatDeLOuvertureDeLaCouronne,
} from "./ouvertureCouronne";
import type {
  IdentifiantDeLieu,
  IdentifiantDeTroncon,
} from "./routes";

function fait(id: string, moment = 4_000): FaitDeCampagne {
  return {
    id,
    cause: "couronne.approches.ilyana-et-les-plans-sous-cendre",
    acteurs: ["porte-lanterne"],
    cible: "couronne-muette",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function preparer(
  position: IdentifiantDeLieu,
  faits: readonly string[],
): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-OUVERTURE");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 4_200, vitesse: 4 },
    routes: { ...initial.routes, position },
    hautPuits: {
      ...initial.hautPuits,
      relationPublique: "cooperative",
    },
    veilleBasse: {
      ...initial.veilleBasse,
      colonie: {
        ...initial.veilleBasse.colonie,
        statut: "stable",
      },
    },
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

function limiterStocks(
  etat: EtatCampagne,
  eau: number,
  materiaux: number,
): EtatCampagne {
  return {
    ...etat,
    pilotage: {
      ...etat.pilotage,
      economie: {
        ...etat.pilotage.economie,
        stocks: {
          ...etat.pilotage.economie.stocks,
          eau: {
            ...etat.pilotage.economie.stocks.eau,
            quantite: eau,
          },
          materiaux: {
            ...etat.pilotage.economie.stocks.materiaux,
            quantite: materiaux,
          },
        },
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

function reveiller(etat: EtatCampagne): EtatCampagne {
  return appliquerCommande(etat, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 0,
  }).etat;
}

function choisir(etat: EtatCampagne, choixId: string): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement actif.");
  }
  return reveiller(
    appliquerCommande(etat, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat,
  );
}

function atteindreLeConseil(etat: EtatCampagne): EtatCampagne {
  let courant = reveiller(etat);
  courant = choisir(courant, "publier-diagnostic-des-verrous");
  return choisir(courant, "maintenir-trois-preparatifs");
}

describe("Ouverture de la Couronne", () => {
  it("fait converger trois approches distinctes vers l’Anneau intérieur", () => {
    const approches = [
      {
        position: "tete-de-ligne",
        route: "arc-ferroviaire-du-noeud",
        fait: "couronne.approches.plans-repartis-aux-equipes",
      },
      {
        position: "veille-des-trois",
        route: "galerie-des-trois-phares",
        fait: "couronne.approches.plans-repartis-aux-equipes",
      },
      {
        position: "seuil",
        route: "porte-logistique-du-seuil",
        fait: "couronne.seuil.registre-commun",
      },
    ] as const;

    for (const approche of approches) {
      const etat = preparer(approche.position, [approche.fait]);
      expect(
        projeterAtlas(etat).troncons.map(({ id }) => id),
      ).toContain(approche.route);
      expect(voyager(etat, approche.route).routes.position).toBe(
        "anneau-interieur",
      );
    }
  });

  it("offre les voies ferroviaire, des Phares et des Colonies selon leurs préparatifs", () => {
    const scenarios = [
      {
        faits: [
          "couronne.tete-de-ligne.atelier-commun",
          "couronne.approches.berceau-amorce",
        ],
        choix: "ouvrir-par-les-rails",
      },
      {
        faits: [
          "couronne.veille-des-trois.sanctuaire-renforce",
          "couronne.approches.etalon-calibre",
        ],
        choix: "ouvrir-par-les-phares",
      },
      {
        faits: [
          "couronne.colonies.voie-alliee-preparee",
          "couronne.approches.precipitateur-assemble",
        ],
        choix: "ouvrir-par-les-colonies",
      },
    ] as const;

    for (const scenario of scenarios) {
      const conseil = atteindreLeConseil(
        preparer("anneau-interieur", scenario.faits),
      );
      expect(
        projeterCampagne(conseil).evenementNarratif?.choix.map(
          ({ id }) => id,
        ),
      ).toEqual([scenario.choix, "ouvrir-breche-de-secours"]);
    }
  });

  it("autorise chaque Projet au seuil exact de son coût réduit", () => {
    const scenarios = [
      {
        faits: [
          "couronne.tete-de-ligne.atelier-commun",
          "couronne.approches.berceau-amorce",
        ],
        choix: "ouvrir-par-les-rails",
        eau: 0,
        materiaux: 2,
      },
      {
        faits: [
          "couronne.veille-des-trois.sanctuaire-renforce",
          "couronne.approches.etalon-calibre",
        ],
        choix: "ouvrir-par-les-phares",
        eau: 2,
        materiaux: 0,
      },
      {
        faits: [
          "couronne.colonies.voie-alliee-preparee",
          "couronne.approches.precipitateur-assemble",
        ],
        choix: "ouvrir-par-les-colonies",
        eau: 2,
        materiaux: 2,
      },
    ] as const;

    for (const scenario of scenarios) {
      const conseil = limiterStocks(
        atteindreLeConseil(
          preparer("anneau-interieur", scenario.faits),
        ),
        scenario.eau,
        scenario.materiaux,
      );
      expect(
        projeterCampagne(conseil).evenementNarratif?.choix.map(
          ({ id }) => id,
        ),
      ).toEqual([scenario.choix, "ouvrir-breche-de-secours"]);
      expect(() => choisir(conseil, scenario.choix)).not.toThrow();
    }
  });

  it("réduit réellement le coût d’ouverture grâce aux trois Projets sans choisir de Solution", () => {
    const avecBerceau = atteindreLeConseil(
      preparer("anneau-interieur", [
        "couronne.tete-de-ligne.atelier-commun",
        "couronne.approches.berceau-amorce",
      ]),
    );
    const materiaux =
      avecBerceau.pilotage.economie.stocks.materiaux.quantite;
    const ouvert = choisir(avecBerceau, "ouvrir-par-les-rails");
    expect(
      ouvert.pilotage.economie.stocks.materiaux.quantite,
    ).toBe(materiaux - 2);
    expect(
      reconstruireEtatDeLOuvertureDeLaCouronne(ouvert),
    ).toMatchObject({
      noeud: "intact",
      ouvertureChoisie: "ferroviaire",
      projets: {
        berceau: {
          diagnostic: "portance-confirmee",
          preparation: "amorcee",
          reduction: 4,
        },
      },
      solutions: {
        ancrer: "preparee",
        reaccorder: "risquee",
        precipiter: "risquee",
      },
    });

    const sansBerceau = atteindreLeConseil(
      preparer("anneau-interieur", [
        "couronne.tete-de-ligne.atelier-commun",
      ]),
    );
    const avant =
      sansBerceau.pilotage.economie.stocks.materiaux.quantite;
    expect(
      choisir(sansBerceau, "ouvrir-par-les-rails").pilotage.economie
        .stocks.materiaux.quantite,
    ).toBe(avant - 6);

    const avecEtalon = atteindreLeConseil(
      preparer("anneau-interieur", [
        "couronne.veille-des-trois.sanctuaire-renforce",
        "couronne.approches.etalon-calibre",
      ]),
    );
    const eauAvantEtalon =
      avecEtalon.pilotage.economie.stocks.eau.quantite;
    expect(
      choisir(avecEtalon, "ouvrir-par-les-phares").pilotage.economie
        .stocks.eau.quantite,
    ).toBe(eauAvantEtalon - 2);

    const avecPrecipitateur = atteindreLeConseil(
      preparer("anneau-interieur", [
        "couronne.colonies.voie-alliee-preparee",
        "couronne.approches.precipitateur-assemble",
      ]),
    );
    const eauAvantPrecipitateur =
      avecPrecipitateur.pilotage.economie.stocks.eau.quantite;
    const materiauxAvantPrecipitateur =
      avecPrecipitateur.pilotage.economie.stocks.materiaux.quantite;
    const ouvertParLesColonies = choisir(
      avecPrecipitateur,
      "ouvrir-par-les-colonies",
    );
    expect(
      ouvertParLesColonies.pilotage.economie.stocks.eau.quantite,
    ).toBe(eauAvantPrecipitateur - 2);
    expect(
      ouvertParLesColonies.pilotage.economie.stocks.materiaux
        .quantite,
    ).toBe(materiauxAvantPrecipitateur - 2);
  });

  it("représente les Factions causales et atteint le Nœud sans Compagnon obligatoire", () => {
    let etat = atteindreLeConseil(
      preparer("anneau-interieur", [
        "couronne.tete-de-ligne.mandat-republicain",
        "couronne.veille-des-trois.sanctuaire-renforce",
        "couronne.colonies.voie-alliee-preparee",
        "couronne.approches.berceau-amorce",
        "trame.aiguillage-zero.charte-partagee",
      ]),
    );
    expect(
      reconstruireEtatDeLOuvertureDeLaCouronne(etat).conseil,
    ).toEqual({
      republique: "mandatee",
      pelerins: "mandatee",
      puitsLibres: "mandatee",
    });
    etat = choisir(etat, "ouvrir-par-les-rails");
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["consigner-clef-collective"]);
    etat = choisir(etat, "consigner-clef-collective");
    expect(
      projeterAtlas(etat).troncons.map(({ id }) => id),
    ).toContain("passage-de-la-couronne-ouverte");
    etat = voyager(etat, "passage-de-la-couronne-ouverte");
    expect(etat.routes.position).toBe("noeud-central");
    expect(projeterOuvertureDeLaCouronne(etat, "en")).toMatchObject({
      visible: true,
      titre: "Opening the Crown",
      conseil: expect.stringContaining("mandated voice"),
      garde: "key recorded among the crews",
    });
  });

  it("garde la brèche toujours disponible et explicite les Solutions dégradées", () => {
    let etat = atteindreLeConseil(
      preparer("anneau-interieur", []),
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["ouvrir-breche-de-secours"]);
    etat = choisir(etat, "ouvrir-breche-de-secours");
    etat = choisir(etat, "consigner-clef-collective");

    expect(
      reconstruireEtatDeLOuvertureDeLaCouronne(etat),
    ).toMatchObject({
      ouvertureChoisie: "breche",
      noeud: "endommage",
      solutions: {
        ancrer: "risquee",
        reaccorder: "impossible",
        precipiter: "impossible",
      },
    });
    expect(
      projeterAtlas(etat).troncons.map(({ id }) => id),
    ).toContain("breche-de-secours-du-noeud");
    expect(
      voyager(etat, "breche-de-secours-du-noeud").routes.position,
    ).toBe("noeud-central");
  });
});
