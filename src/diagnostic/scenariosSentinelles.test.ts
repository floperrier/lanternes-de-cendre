import { describe, expect, it } from "vitest";

import { empreinteValeurDeterministe } from "../simulation/empreinte";
import { lireEtatCourant } from "../sauvegarde/validation";
import {
  capturerEtatsEtEvenementsDesScenariosSentinelles,
  FAMILLES_DE_SCENARIOS_SENTINELLES,
  INVARIANTS_SENTINELLES,
  executerConduiteSentinelle,
  executerScenariosSentinelles,
  obtenirScenariosSentinelles,
  type ScenarioSentinelle,
} from "./scenariosSentinelles";

describe("catalogue des scénarios sentinelles", () => {
  it("versionne les douze familles et décline les trois Solutions finales", () => {
    const scenarios = obtenirScenariosSentinelles();
    expect(FAMILLES_DE_SCENARIOS_SENTINELLES).toEqual([
      "debut-nominal",
      "double-tension",
      "cascade-materielle",
      "saturation-halo",
      "extinction-phare",
      "cohorte-en-penurie",
      "expeditions-simultanees",
      "compagnon-indisponible",
      "surcharge",
      "route-coupee",
      "abondance-exploitable",
      "solutions-finales",
    ]);
    expect(new Set(scenarios.map(({ famille }) => famille))).toEqual(
      new Set(FAMILLES_DE_SCENARIOS_SENTINELLES),
    );
    expect(
      scenarios
        .filter(({ variante }) => variante !== undefined)
        .map(({ variante }) => variante),
    ).toEqual(["ancrer", "reaccorder", "precipiter"]);
  });

  it("porte pour chaque scénario un snapshot, deux conduites et le résultat attendu", () => {
    for (const scenario of obtenirScenariosSentinelles()) {
      expect(scenario).toMatchObject({
        format: "lanternes-de-cendre.scenario-sentinelle",
        version: 6,
        graine: expect.any(String),
        empreinteSnapshot: expect.stringMatching(/^[0-9a-f]{8}$/),
        invariants: INVARIANTS_SENTINELLES,
      });
      expect(empreinteValeurDeterministe(scenario.snapshot)).toBe(
        scenario.empreinteSnapshot,
      );
      expect(Object.keys(scenario.conduites)).toEqual(["prudente", "risquee"]);
      for (const conduite of Object.values(scenario.conduites)) {
        expect(conduite.commandes.length).toBeGreaterThan(0);
        expect(conduite.resultatAttendu).toMatchObject({
          empreinteEtat: expect.stringMatching(/^[0-9a-f]{8}$/),
          empreinteEvenements: expect.stringMatching(/^[0-9a-f]{8}$/),
          secondeFinale: expect.any(Number),
        });
        for (const [sequence, etape] of conduite.commandes.entries()) {
          expect(etape.sequence).toBe(sequence);
          expect(etape.commande).toHaveProperty("type");
          expect(etape.attendu.empreinteEtat).toMatch(/^[0-9a-f]{8}$/);
          expect(etape.attendu.empreinteEvenements).toMatch(/^[0-9a-f]{8}$/);
        }
      }
    }
  });

  it("valide l’évitement préventif et le réglage préventif postérieur à l’annonce", () => {
    const snapshot = obtenirScenariosSentinelles().find(
      ({ id }) => id === "cascade-materielle",
    )!.snapshot;
    const entretienPreventif = {
      ...snapshot.pilotage,
      doctrine: {
        ...snapshot.pilotage.doctrine,
        entretien: { position: "preventif" as const, transition: null },
      },
    };
    expect(
      lireEtatCourant({
        ...snapshot,
        pilotage: entretienPreventif,
      }),
    ).toEqual({
      ...snapshot,
      pilotage: entretienPreventif,
    });

    const evitement = {
      ...snapshot,
      tempsDuConvoi: {
        ...snapshot.tempsDuConvoi,
        vitesse: 4 as const,
      },
      pilotage: entretienPreventif,
      narration: {
        ...snapshot.narration,
        faitsDeCampagne: snapshot.narration.faitsDeCampagne.filter(
          ({ id }) => id !== "crise.trame.cascade-materielle",
        ),
      },
      crises: {
        ...snapshot.crises,
        alerte: null,
        criseActive: null,
      },
    };
    expect(lireEtatCourant(evitement)).toEqual(evitement);
  });
});

describe("exécution des scénarios sentinelles", () => {
  it("réussit cent pour cent des conduites et de leurs invariants", () => {
    const resultats = executerScenariosSentinelles();

    expect(resultats).toHaveLength(obtenirScenariosSentinelles().length * 2);
    expect(resultats.every(({ statut }) => statut === "conforme")).toBe(true);
    for (const resultat of resultats) {
      if (resultat.statut !== "conforme") {
        continue;
      }
      expect(resultat.invariants).toEqual(
        Object.fromEntries(
          INVARIANTS_SENTINELLES.map((invariant) => [invariant, true]),
        ),
      );
    }
  });

  it("rejoue le même snapshot et les mêmes commandes sans aucun écart", () => {
    expect(executerScenariosSentinelles()).toEqual(
      executerScenariosSentinelles(),
    );
    expect(capturerEtatsEtEvenementsDesScenariosSentinelles()).toEqual(
      capturerEtatsEtEvenementsDesScenariosSentinelles(),
    );
  });

  it("exerce réellement l’indisponibilité, la surcharge et les cinq révélations", () => {
    const scenarios = obtenirScenariosSentinelles();
    const observations = capturerEtatsEtEvenementsDesScenariosSentinelles();
    const compagnon = scenarios.find(
      ({ id }) => id === "compagnon-indisponible",
    )!;
    expect(
      compagnon.snapshot.narration.faitsDeCampagne.map(({ id }) => id),
    ).toContain("compagnon.ilyana-voss.indisponible");
    expect(
      compagnon.snapshot.narration.faitsDeCampagne.map(({ id }) => id),
    ).not.toContain("compagnon.ilyana-voss.affectee-intendance");
    expect(compagnon.conduites.prudente.commandes[0]?.commande.type).toBe(
      "incident.ordonner",
    );
    expect(compagnon.conduites.risquee.commandes[0]?.attendu.erreur).toBe(
      "Ilyana Voss est indisponible.",
    );

    const surchargePrudente = observations.find(
      ({ scenarioId, conduite }) =>
        scenarioId === "surcharge" && conduite === "prudente",
    )!;
    const charge = surchargePrudente.etat.pilotage.economie.capacites.charge;
    expect(charge.demande).toBeLessThan(charge.production);
    const surcharge = scenarios.find(({ id }) => id === "surcharge")!;
    expect(surcharge.conduites.risquee.commandes.at(-1)?.attendu.erreur).toBe(
      "La contrainte de Charge empêche ce Chantier.",
    );

    const revelations = [
      "prologue.reponse-du-phare",
      "veille-basse.les-registres-du-reflux",
      "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
      "couronne.ouverture.le-diagnostic-des-verrous",
      "epilogue.revelation.le-registre-des-rejets",
    ];
    expect([
      ...new Set(
        scenarios.flatMap(({ revelationsAttendues }) => revelationsAttendues),
      ),
    ]).toEqual(revelations);
    for (const scenario of scenarios.filter(
      ({ revelationsAttendues }) => revelationsAttendues.length > 0,
    )) {
      for (const revelation of scenario.revelationsAttendues) {
        expect(scenario.snapshot.narration.evenementsJoues).not.toContain(
          revelation,
        );
        for (const observation of observations.filter(
          ({ scenarioId }) => scenarioId === scenario.id,
        )) {
          expect(observation.etat.narration.evenementsJoues).toContain(
            revelation,
          );
          expect(
            observation.etat.narration.faitsDeCampagne.some(
              ({ cause }) => cause === revelation,
            ),
          ).toBe(true);
        }
      }
    }
    for (const observation of observations) {
      expect(new Set(observation.etat.narration.evenementsJoues).size).toBe(
        observation.etat.narration.evenementsJoues.length,
      );
    }
  });

  it("couvre une Récupération accomplie et une Récupération manquée", () => {
    const observations = capturerEtatsEtEvenementsDesScenariosSentinelles()
      .filter(({ scenarioId }) => scenarioId === "cascade-materielle");

    expect(
      observations.find(({ conduite }) => conduite === "prudente")
        ?.etat.crises.recuperations.at(-1),
    ).toMatchObject({
      statut: "accomplie",
      garantie: "charge-repartie-trame",
      coutApplique: [
        { stock: "combustible", quantite: 5 },
        { stock: "eau", quantite: 6 },
      ],
    });
    expect(
      observations.find(({ conduite }) => conduite === "risquee")
        ?.etat.crises.recuperations.at(-1),
    ).toMatchObject({
      statut: "manquee",
      garantie: "attelage-recale-trame",
      coutApplique: [],
    });
    const etatRisque = observations.find(
      ({ conduite }) => conduite === "risquee",
    )?.etat;
    expect(etatRisque).toBeDefined();
    expect(
      etatRisque?.citeCaravane.formation.plateformes,
    ).toEqual(etatRisque?.infrastructure.plateformes.map(({ id }) => id));
    expect(
      etatRisque?.narration.faitsDeCampagne
        .find(({ id }) => id === "crise.trame.detacher-plateforme")
        ?.effets.materiels,
    ).toEqual([
      { type: "plateforme.detachee", plateforme: "intendance" },
    ]);
    expect(lireEtatCourant(etatRisque)).toEqual(etatRisque);
  });

  it("enchaîne deux Crises dans les conduites prudente et risquée de Veille-Basse", () => {
    const observations =
      capturerEtatsEtEvenementsDesScenariosSentinelles().filter(
        ({ scenarioId }) => scenarioId === "cohorte-en-penurie",
      );

    expect(observations).toHaveLength(2);
    for (const observation of observations) {
      expect(observation.etat.crises.historique.map(({ id }) => id)).toEqual([
        "penurie-eau.pompe-purification",
        "veille-basse.accueil-sous-penurie",
      ]);
      expect(observation.etat.crises.recuperations.at(-1)).toMatchObject({
        statut: "accomplie",
        coutApplique: [{ stock: "materiaux", quantite: 2 }],
      });
    }
    expect(
      observations.map(({ conduite, etat }) => ({
        conduite,
        reponse: etat.crises.historique.at(-1)?.reponseId,
      })),
    ).toEqual([
      {
        conduite: "prudente",
        reponse: "partager-reserves-cohorte",
      },
      {
        conduite: "risquee",
        reponse: "renforcer-accueil",
      },
    ]);
  });

  it("couvre le Halo préparé et le dernier recours sans inventer de Défaite", () => {
    const observations =
      capturerEtatsEtEvenementsDesScenariosSentinelles().filter(
        ({ scenarioId }) => scenarioId === "saturation-halo",
      );
    expect(observations).toHaveLength(2);

    const prudente = observations.find(
      ({ conduite }) => conduite === "prudente",
    )!;
    const risquee = observations.find(
      ({ conduite }) => conduite === "risquee",
    )!;
    expect(
      prudente.etat.narration.faitsDeCampagne.map(({ id }) => id),
    ).toEqual(
      expect.arrayContaining([
        "crise.couronne.stabiliser-anneau-du-halo",
        "crise.recuperation.halo-reparti-au-noeud.accomplie",
      ]),
    );
    expect(
      risquee.etat.narration.faitsDeCampagne.map(({ id }) => id),
    ).toEqual(
      expect.arrayContaining([
        "crise.couronne.condamner-couronne-exterieure",
        "crise.recuperation.passage-interieur-preserve.accomplie",
      ]),
    );
    expect(prudente.etat.denouement.statut).toBe("en-cours");
    expect(risquee.etat.denouement.statut).toBe("en-cours");
  });

  it("sentinellise la Défaite sans aide, avec aide et son évitement par Récupération", () => {
    const scenarios = obtenirScenariosSentinelles();
    const observations = capturerEtatsEtEvenementsDesScenariosSentinelles();
    const sansAide = scenarios.find(
      ({ id }) => id === "extinction-phare-sans-aide",
    )!;
    const avecAide = scenarios.find(
      ({ id }) => id === "extinction-phare-avec-aide",
    )!;
    const extinctionEvitee = scenarios.find(
      ({ id }) => id === "extinction-evitee-recuperation",
    )!;

    expect(sansAide.snapshot.crises.criseActive?.id).toBe(
      "extinction-du-phare",
    );
    expect(avecAide.snapshot.crises.criseActive?.id).toBe(
      "extinction-du-phare",
    );
    expect(
      sansAide.snapshot.narration.faitsDeCampagne.map(({ id }) => id),
    ).not.toContain("trame.aiguillage-zero.charte-partagee");
    expect(
      avecAide.snapshot.narration.faitsDeCampagne.map(({ id }) => id),
    ).toContain("trame.aiguillage-zero.charte-partagee");
    expect(
      avecAide.snapshot.narration.faitsDeCampagne.find(
        ({ id }) => id === "trame.aiguillage-zero.charte-partagee",
      )?.moment,
    ).toBeLessThan(
      avecAide.snapshot.narration.faitsDeCampagne.find(
        ({ id }) => id === "crise.extinction-du-phare",
      )!.moment,
    );

    expect(
      observations
        .filter(
          ({ scenarioId }) =>
            scenarioId === "extinction-phare-sans-aide" ||
            scenarioId === "extinction-phare-avec-aide",
        )
        .map(({ etat }) => etat.denouement.statut),
    ).toEqual(["defaite", "defaite", "defaite", "defaite"]);
    expect(
      observations.find(
        ({ scenarioId, conduite }) =>
          scenarioId === "extinction-phare-avec-aide" &&
          conduite === "prudente",
      )?.etat.denouement,
    ).toMatchObject({
      statut: "defaite",
      choix: "solliciter-aide-exterieure",
    });

    expect(extinctionEvitee.snapshot.crises.criseActive?.id).toBe(
      "couronne-muette.saturation-du-halo",
    );
    expect(
      extinctionEvitee.snapshot.crises.recuperations.some(
        ({ statut }) => statut === "accomplie",
      ),
    ).toBe(true);
    for (const observation of observations.filter(
      ({ scenarioId }) => scenarioId === "extinction-evitee-recuperation",
    )) {
      expect(observation.etat.denouement.statut).not.toBe("defaite");
      expect(
        observation.etat.narration.faitsDeCampagne.map(({ id }) => id),
      ).not.toContain("crise.extinction-du-phare");
    }
  });

  it("produit une capsule minimale au premier désaccord", () => {
    const scenario = obtenirScenariosSentinelles()[0]!;
    const premiereEtape = scenario.conduites.prudente.commandes[0]!;
    const scenarioDivergent: ScenarioSentinelle = {
      ...scenario,
      conduites: {
        ...scenario.conduites,
        prudente: {
          ...scenario.conduites.prudente,
          commandes: [
            {
              ...premiereEtape,
              attendu: {
                ...premiereEtape.attendu,
                empreinteEtat: "00000000",
              },
            },
            ...scenario.conduites.prudente.commandes.slice(1),
          ],
        },
      },
    };

    const resultat = executerConduiteSentinelle(scenarioDivergent, "prudente");

    expect(resultat).toMatchObject({
      statut: "divergence",
      capsule: {
        format: "lanternes-de-cendre.capsule-sentinelle",
        version: 1,
        versions: {
          scenarios: 6,
          simulation: expect.any(Number),
          aleatoire: expect.any(Number),
          empreinte: expect.any(Number),
        },
        scenario: {
          id: scenario.id,
          version: 6,
          conduite: "prudente",
        },
        graine: scenario.graine,
        snapshot: {
          empreinte: scenario.empreinteSnapshot,
          etat: scenario.snapshot,
        },
        commandes: [
          {
            sequence: 0,
            commande: premiereEtape.commande,
          },
        ],
        premierDesaccord: {
          sequence: 0,
          dimension: "etat",
          attendue: "00000000",
          obtenue: expect.stringMatching(/^[0-9a-f]{8}$/),
        },
      },
    });
  });

  it("n’inclut aucune commande quand le premier désaccord porte sur le snapshot", () => {
    const scenario = obtenirScenariosSentinelles()[0]!;
    const resultat = executerConduiteSentinelle(
      {
        ...scenario,
        empreinteSnapshot: "00000000",
      },
      "prudente",
    );

    expect(resultat).toMatchObject({
      statut: "divergence",
      capsule: {
        commandes: [],
        premierDesaccord: {
          sequence: null,
          dimension: "snapshot",
          attendue: "00000000",
          obtenue: expect.stringMatching(/^[0-9a-f]{8}$/),
        },
      },
    });
  });
});
