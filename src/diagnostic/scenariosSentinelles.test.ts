import { describe, expect, it } from "vitest";

import { empreinteValeurDeterministe } from "../simulation/empreinte";
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
  it("versionne les dix familles et décline les trois Solutions finales", () => {
    const scenarios = obtenirScenariosSentinelles();
    expect(FAMILLES_DE_SCENARIOS_SENTINELLES).toEqual([
      "debut-nominal",
      "double-tension",
      "cascade-materielle",
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
        version: 1,
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
          scenarios: 1,
          simulation: expect.any(Number),
          aleatoire: expect.any(Number),
          empreinte: expect.any(Number),
        },
        scenario: {
          id: scenario.id,
          version: 1,
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
