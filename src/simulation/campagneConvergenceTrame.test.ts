import { describe, expect, it } from "vitest";

import {
  calculerOptionsDeLAiguillageZero,
  projeterConvergenceDeLaTrame,
} from "../application/convergenceTrame";
import { projeterCampagne } from "../application/application";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type EtatCampagne,
} from "./campagne";
import type { IdentifiantDeTroncon } from "./routes";

function depuis(lieu: "grand-aiguillage" | "traverse-libre"): EtatCampagne {
  const initial = creerCampagneInitiale("CENDRE-CONVERGENCE");
  return {
    ...initial,
    tempsDuConvoi: { secondes: 2_400, vitesse: 4 },
    routes: { ...initial.routes, position: lieu },
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

function resoudreEtContinuer(
  etat: EtatCampagne,
  choixId: string,
): EtatCampagne {
  const evenementId = etat.narration.evenementActif;
  if (evenementId === null) {
    throw new Error("Aucun Événement de convergence n’est actif.");
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

describe("Marché des Traverses et Signal-Zéro", () => {
  it("fait converger les deux axes vers le même Marché sans retour libre", () => {
    const depuisGrand = voyager(
      depuis("grand-aiguillage"),
      "rocade-du-marche",
    );
    const depuisTraverse = voyager(
      depuis("traverse-libre"),
      "voie-des-citernes",
    );

    expect(depuisGrand.routes.position).toBe("marche-des-traverses");
    expect(depuisTraverse.routes.position).toBe("marche-des-traverses");
    expect(depuisGrand.narration.evenementActif).toBe(
      "trame.marche.les-services-de-la-voie-principale",
    );
    expect(depuisTraverse.narration.evenementActif).toBe(
      "trame.marche.les-services-de-la-voie-principale",
    );
  });

  it("dérive les deux offres finies de l’état laissé par chaque branche", () => {
    const auMarche = voyager(
      depuis("grand-aiguillage"),
      "rocade-du-marche",
    );
    const sansServiceNiBesoin: EtatCampagne = {
      ...auMarche,
      trameDeFer: {
        ...auMarche.trameDeFer,
        grandAiguillage: {
          ...auMarche.trameDeFer.grandAiguillage,
          marche: {
            ...auMarche.trameDeFer.grandAiguillage.marche,
            servicesLourdsRestants: 0,
          },
        },
      },
      traverseLibre: {
        ...auMarche.traverseLibre,
        marche: {
          ...auMarche.traverseLibre.marche,
          lotsDeFiltresManquants: 0,
        },
      },
    };

    expect(projeterConvergenceDeLaTrame(sansServiceNiBesoin)).toMatchObject({
      offreOfficielle:
        "1 échange · coupleur garanti par le registre républicain",
      offreClandestine:
        "1 échange · filtres sans marque ou accès à la transmission",
    });
  });

  it("n’expose et n’accepte que l’échange correspondant à chaque état de Colonie", () => {
    let etat = voyager(
      depuis("grand-aiguillage"),
      "rocade-du-marche",
    );
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["ceder-reserve-refroidissement"]);
    expect(() =>
      appliquerCommande(etat, {
        type: "evenement-narratif.choisir",
        evenementId:
          "trame.marche.les-services-de-la-voie-principale",
        choixId: "acheter-coupleur-officiel",
      }),
    ).toThrow("stocks sont insuffisants");

    etat = resoudreEtContinuer(etat, "ceder-reserve-refroidissement");
    expect(
      projeterCampagne(etat).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["acheter-filtres-sans-marque"]);

    const besoinsCouverts: EtatCampagne = {
      ...etat,
      traverseLibre: {
        ...etat.traverseLibre,
        marche: {
          ...etat.traverseLibre.marche,
          lotsDeFiltresManquants: 0,
        },
      },
    };
    expect(
      projeterCampagne(besoinsCouverts).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["intervenir-sur-bascule"]);

    const sansServices: EtatCampagne = {
      ...voyager(depuis("grand-aiguillage"), "rocade-du-marche"),
      trameDeFer: {
        ...etat.trameDeFer,
        grandAiguillage: {
          ...etat.trameDeFer.grandAiguillage,
          marche: {
            ...etat.trameDeFer.grandAiguillage.marche,
            servicesLourdsRestants: 0,
          },
        },
      },
    };
    expect(
      projeterCampagne(sansServices).evenementNarratif?.choix.map(
        ({ id }) => id,
      ),
    ).toEqual(["acheter-coupleur-officiel"]);
  });

  it("épuise les offres, conserve la Trace et transforme les échos en options sans choisir le climax", () => {
    const origine = depuis("grand-aiguillage");
    let etat = voyager(
      {
        ...origine,
        traverseLibre: {
          ...origine.traverseLibre,
          contournement: "praticable",
          marche: {
            ...origine.traverseLibre.marche,
            lotsDeFiltresManquants: 0,
          },
          aide: {
            statut: "publique",
            connueDeLaRepublique: true,
          },
        },
      },
      "rocade-du-marche",
    );
    expect(projeterConvergenceDeLaTrame(etat)).toMatchObject({
      titre: "Marché des Traverses",
      offreOfficielle:
        "1 échange · service lourd issu de Grand-Aiguillage",
      offreClandestine:
        "1 échange · filtres sans marque ou accès à la transmission",
    });

    etat = resoudreEtContinuer(etat, "ceder-reserve-refroidissement");
    expect(projeterConvergenceDeLaTrame(etat).offreOfficielle).toBe(
      "Offre officielle épuisée",
    );
    etat = resoudreEtContinuer(etat, "intervenir-sur-bascule");
    expect(projeterConvergenceDeLaTrame(etat)).toMatchObject({
      offreClandestine: "Offre clandestine épuisée",
      trace: "Bascule des manifestes · fil rompu et plombs déplacés",
    });

    etat = voyager(etat, "ligne-du-signal-zero");
    expect(etat.routes.position).toBe("signal-zero");
    etat = resoudreEtContinuer(etat, "lire-frequence-du-rail");
    etat = resoudreEtContinuer(etat, "graver-les-deux-branches");
    etat = resoudreEtContinuer(etat, "transmettre-trace-au-signal");

    expect(calculerOptionsDeLAiguillageZero(etat)).toEqual([
      "charte",
      "vol",
      "transport",
    ]);
    expect(projeterConvergenceDeLaTrame(etat)).toMatchObject({
      titre: "Signal-Zéro",
      interfaceLigneZero:
        "Fréquence du Rail lue · verrouillage lourd documenté",
      trace:
        "Preuve transmise · attribution possible dès l’Aiguillage Zéro",
      optionsDuClimax: [
        "Charte de circulation partagée préparée",
        "Vol avec contournement préparé",
        "Transport autonome coûteux toujours disponible",
      ],
    });
    expect(
      projeterConvergenceDeLaTrame(etat, "en"),
    ).toMatchObject({
      titre: "Zero Signal",
      trace:
        "Evidence transmitted · attribution possible at Zero Junction",
    });
  });

  it("fait réellement desserrer la dépendance aux filtres par l’offre clandestine", () => {
    let etat = voyager(
      depuis("traverse-libre"),
      "voie-des-citernes",
    );
    etat = resoudreEtContinuer(etat, "ceder-reserve-refroidissement");
    etat = resoudreEtContinuer(etat, "acheter-filtres-sans-marque");

    expect(etat.traverseLibre).toMatchObject({
      statut: "stabilisee",
      pressions: { filtres: "rationnes" },
      marche: { lotsDeFiltresManquants: 1 },
      dependancesAuRail: { filtres: "contournee" },
    });
  });

  it("ne déclenche aucun récit ni Fait de Trace sans Intervention", () => {
    let etat = voyager(
      depuis("grand-aiguillage"),
      "rocade-du-marche",
    );
    etat = resoudreEtContinuer(etat, "ceder-reserve-refroidissement");
    etat = resoudreEtContinuer(etat, "acheter-filtres-sans-marque");
    etat = voyager(etat, "ligne-du-signal-zero");
    etat = resoudreEtContinuer(etat, "lire-frequence-du-rail");
    etat = resoudreEtContinuer(etat, "graver-les-deux-branches");

    expect(etat.narration.evenementActif).toBeNull();
    expect(
      etat.narration.faitsDeCampagne.map(({ id }) => id),
    ).not.toEqual(
      expect.arrayContaining([
        "trame.signal-zero.trace-sous-scelles",
        "trame.signal-zero.trace-transmise",
      ]),
    );
    expect(projeterConvergenceDeLaTrame(etat).trace).toBe(
      "Aucune rupture clandestine relevée",
    );
  });

  it("fait modifier les options par les branches, pas par les seules lectures de Signal-Zéro", () => {
    const base = depuis("grand-aiguillage");
    const avecLectures: EtatCampagne = {
      ...base,
      narration: {
        ...base.narration,
        faitsDeCampagne: [
          {
            id: "trame.signal-zero.interface-rail-lue",
            cause:
              "trame.signal-zero.l-interface-aux-deux-frequences",
            acteurs: ["porte-lanterne"],
            cible: "interface-de-la-ligne-zero",
            moment: 2_400,
            effets: { materiels: [], humains: [] },
          },
          {
            id: "trame.signal-zero.echos-conserves",
            cause:
              "trame.signal-zero.les-deux-branches-dans-le-verre",
            acteurs: ["porte-lanterne"],
            cible: "table-de-signal-zero",
            moment: 2_400,
            effets: { materiels: [], humains: [] },
          },
        ],
      },
    };
    expect(calculerOptionsDeLAiguillageZero(avecLectures)).toEqual([
      "transport",
    ]);

    const deuxBranchesPreparees: EtatCampagne = {
      ...avecLectures,
      routes: {
        ...avecLectures.routes,
        position: "signal-zero",
      },
      trameDeFer: {
        ...avecLectures.trameDeFer,
        pieceDeRegulation: {
          ...avecLectures.trameDeFer.pieceDeRegulation,
          monopoleRepublicain: true,
        },
        occasions: {
          ...avecLectures.trameDeFer.occasions,
          attelageFedere: {
            ...avecLectures.trameDeFer.occasions.attelageFedere,
            statut: "annoncee",
          },
        },
      },
      traverseLibre: {
        ...avecLectures.traverseLibre,
        routeSecondaire: {
          statut: "reparee",
          issueCouteuse: "materiaux-de-reparation",
        },
        aide: {
          statut: "publique",
          connueDeLaRepublique: true,
        },
      },
    };
    expect(
      calculerOptionsDeLAiguillageZero(deuxBranchesPreparees),
    ).toEqual(["monopole", "charte", "transport"]);
    expect(
      projeterConvergenceDeLaTrame(deuxBranchesPreparees),
    ).toMatchObject({
      echoGrandAiguillage:
        "Train-outil sous contrôle républicain · Attelage fédéré disponible en recours",
      echoTraverseLibre:
        "Galerie étayée · aide publique opposable au Rail",
      optionsDuClimax: [
        "Monopole républicain préparé",
        "Charte de circulation partagée préparée",
        "Transport autonome par Attelage fédéré et Galerie étayée",
      ],
    });
  });
});
