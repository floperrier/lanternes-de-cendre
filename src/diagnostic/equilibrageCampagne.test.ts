import { describe, expect, it } from "vitest";
import {
  appliquerCommande,
  creerCampagneInitiale,
} from "../simulation/campagne";
import {
  NOMBRE_DE_GRAINES_NOCTURNE,
  NOMBRE_DE_GRAINES_STANDARD,
  STRATEGIES_D_EQUILIBRAGE,
  VERSION_REGLES_D_EQUILIBRAGE_COURANTE,
  calculerDominancesDEquilibrage,
  comparerPassesDEquilibrage,
  detecterBoucleProfitable,
  detecterStrategieDominante,
  executerCampagneHeadless,
  executerPasseDEquilibrage,
  recuperationAUnCoutReel,
  rejouerPasseAvecCommandesImposees,
  sonderBouclesSemantiques,
  validerReferenceDEquilibrage,
  verifierInvariantsDEquilibrage,
  type ResultatDeCampagneHeadless,
} from "./equilibrageCampagne";

describe("Campagnes headless d’équilibrage", () => {
  it("exige une variation réelle ou un coût de route persisté pour toute Récupération accomplie", () => {
    const avant = creerCampagneInitiale("TEST-COUT-RECUPERATION");
    const evenementMateriaux = {
      type: "crise.recuperation-accomplie",
      recuperationId: "recuperation.1",
      garantie: "socle-de-survie",
      cause: "cicatrice.rationnement-deau",
      moment: 0,
      faitProduit: "crise.recuperation.socle-de-survie.accomplie",
      coutApplique: [{ stock: "materiaux", quantite: 2 }],
    } as const;
    expect(
      recuperationAUnCoutReel(avant, avant, evenementMateriaux),
    ).toBe(false);

    const apresPaiement = {
      ...avant,
      pilotage: {
        ...avant.pilotage,
        economie: {
          ...avant.pilotage.economie,
          stocks: {
            ...avant.pilotage.economie.stocks,
            materiaux: {
              ...avant.pilotage.economie.stocks.materiaux,
              quantite:
                avant.pilotage.economie.stocks.materiaux.quantite - 2,
            },
          },
        },
      },
    };
    expect(
      recuperationAUnCoutReel(
        avant,
        apresPaiement,
        evenementMateriaux,
      ),
    ).toBe(true);

    const enRoute = appliquerCommande(avant, {
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    }).etat;
    const apresRoutePayee = {
      ...enRoute,
      routes: {
        ...enRoute.routes,
        position: "haut-puits" as const,
        engagements: enRoute.routes.engagements.map((engagement) => ({
          ...engagement,
          statut: "termine" as const,
        })),
      },
    };
    expect(
      recuperationAUnCoutReel(enRoute, apresRoutePayee, {
        type: "crise.recuperation-accomplie",
        recuperationId: "recuperation.1",
        garantie: "mobilite-minimale",
        cause: "cicatrice.reserve-de-remedes-entamee",
        moment: apresRoutePayee.routes.engagements[0]!.arriveeA,
        faitProduit:
          "crise.recuperation.mobilite-minimale.accomplie",
        coutApplique: [
          { stock: "combustible", quantite: 3 },
          { stock: "eau", quantite: 4 },
        ],
      }),
    ).toBe(true);
  });

  it("versionne dix stratégies déterministes et les deux tailles de passe", () => {
    expect(STRATEGIES_D_EQUILIBRAGE).toHaveLength(10);
    expect(new Set(STRATEGIES_D_EQUILIBRAGE.map(({ id }) => id)).size).toBe(10);
    expect(
      new Set(STRATEGIES_D_EQUILIBRAGE.map(({ itineraire }) => itineraire.id))
        .size,
    ).toBeGreaterThanOrEqual(6);
    expect(NOMBRE_DE_GRAINES_STANDARD).toBe(256);
    expect(NOMBRE_DE_GRAINES_NOCTURNE).toBe(2_048);
    expect(VERSION_REGLES_D_EQUILIBRAGE_COURANTE).toBe(4);
  });

  it("calibre une branche haute risquée sans perdre son rejeu historique", () => {
    const strategie = STRATEGIES_D_EQUILIBRAGE[0]!;
    const premiere = executerCampagneHeadless({
      graine: "EQUILIBRAGE-000000",
      strategie,
    });
    const seconde = executerCampagneHeadless({
      graine: "EQUILIBRAGE-000000",
      strategie,
    });

    expect(premiere.statut).toBe("terminee");
    expect(premiere.positionFinale).toBe("noeud-central");
    expect(premiere.denouementFinal).toMatchObject({
      statut: "solution-finale",
      solution: "ancrer",
    });
    expect(premiere.metriques).toMatchObject({
      crises: 3,
      tronconsSousTension: 7,
      crisesParIdentifiant: {
        "penurie-eau.pompe-purification": 1,
        "trame-fer.cascade-materielle": 1,
        "couronne-muette.saturation-du-halo": 1,
      },
    });
    expect(premiere.faitsFinaux).toEqual(
      expect.arrayContaining([
        "crise.recuperation.socle-de-survie.accomplie",
        "finale.ancrage.selection-preparee",
        "epilogue.revelation.registre-rendu-public",
        "epilogue.compagnons.devenirs-partages",
      ]),
    );
    expect(premiere.commandes.length).toBeGreaterThan(80);
    expect(premiere).toEqual(seconde);

    const historique = executerCampagneHeadless({
      graine: "EQUILIBRAGE-000000",
      strategie,
      versionRegles: 3,
    });
    expect(historique.metriques).toMatchObject({
      crises: 0,
      tronconsSousTension: 0,
    });
  });

  it("préserve de quoi sélectionner une Solution sur les graines nocturnes", () => {
    const campagne = executerCampagneHeadless({
      graine: "EQUILIBRAGE-000484",
      strategie: STRATEGIES_D_EQUILIBRAGE[0]!,
    });

    expect(campagne).toMatchObject({
      statut: "terminee",
      raisonDEchec: null,
      positionFinale: "noeud-central",
      denouementFinal: { statut: "solution-finale" },
    });
  });

  it("sépare une Défaite exécutée de l’arrivée au Nœud et conserve la référence des règles v2", () => {
    const strategie = STRATEGIES_D_EQUILIBRAGE.find(
      ({ id }) => id === "opportunisme-marchand",
    )!;
    const courante = executerCampagneHeadless({
      graine: "EQUILIBRAGE-000000",
      strategie,
      tracerEmpreintes: true,
    });
    const historique = executerCampagneHeadless({
      graine: "EQUILIBRAGE-000000",
      strategie,
      versionRegles: 2,
      tracerEmpreintes: true,
    });

    expect(courante).toMatchObject({
      versionRegles: 4,
      statut: "terminee",
      positionFinale: "anneau-interieur",
      denouementFinal: { statut: "defaite" },
      metriques: {
        arriveeAuNoeud: false,
        defaiteStrategique: true,
        crisesParIdentifiant: {
          "couronne-muette.saturation-du-halo": 0,
          "extinction-du-phare": 1,
        },
        crisesCausalesEtUniques: true,
      },
      recuperationsGratuites: 0,
      bouclesProfitables: 0,
    });
    expect(historique).toMatchObject({
      versionRegles: 2,
      statut: "terminee",
      positionFinale: "noeud-central",
      denouementFinal: { statut: "solution-finale" },
      metriques: {
        arriveeAuNoeud: true,
        defaiteStrategique: false,
        crisesParIdentifiant: {
          "couronne-muette.saturation-du-halo": 1,
          "extinction-du-phare": 0,
        },
      },
    });
  });

  it("exécute la matrice Graines × stratégies sans réduire la couverture", () => {
    const passe = executerPasseDEquilibrage({
      nombreDeGraines: 2,
      prefixeDeGraine: "TEST-MATRICE",
    });

    expect(passe.campagnes).toHaveLength(20);
    expect(
      new Set(passe.campagnes.map(({ graine }) => graine)),
    ).toHaveLength(2);
    expect(
      new Set(passe.campagnes.map(({ strategieId }) => strategieId)),
    ).toHaveLength(10);
    expect(passe.matrice).toEqual({
      graines: 2,
      strategies: 10,
      campagnesAttendues: 20,
      campagnesExecutees: 20,
    });
    expect(
      passe.campagnes.filter(({ statut }) => statut !== "terminee"),
    ).toEqual([]);
    for (const campagne of passe.campagnes) {
      const strategie = STRATEGIES_D_EQUILIBRAGE.find(
        ({ id }) => id === campagne.strategieId,
      )!;
      const tronconsAttendus =
        campagne.denouementFinal.statut === "defaite"
          ? strategie.itineraire.troncons.slice(0, -1)
          : strategie.itineraire.troncons;
      expect(
        campagne.commandes.flatMap(({ commande }) =>
          commande.type === "engagement-de-route.confirmer"
            ? [commande.tronconId]
            : [],
        ),
      ).toEqual(tronconsAttendus);
      expect(campagne.metriques.tronconsParcourus).toBe(
        tronconsAttendus.length,
      );
      expect(campagne.metriques.dureesDeHalte).toHaveLength(
        strategie.haltesApresTroncons.length,
      );
    }
    const campagnesAvecVeilleBasse = passe.campagnes.filter(
      ({ faitsFinaux }) =>
        faitsFinaux.includes(
          "crise.veille-basse.accueil-sous-penurie",
        ),
    );
    expect(campagnesAvecVeilleBasse.length).toBeGreaterThan(0);
    expect(
      campagnesAvecVeilleBasse.every(
        ({ metriques }) => metriques.crises >= 2,
      ),
    ).toBe(true);
    const campagnesAvecCascadeMaterielle = passe.campagnes.filter(
      ({ faitsFinaux }) =>
        faitsFinaux.includes("crise.trame.cascade-materielle"),
    );
    expect(campagnesAvecCascadeMaterielle.length).toBeGreaterThan(0);
    expect(
      campagnesAvecCascadeMaterielle.every(
        ({ metriques }) =>
          metriques.crises >= 3 &&
          metriques.crisesParIdentifiant[
            "trame-fer.cascade-materielle"
          ] === 1 &&
          metriques.crisesParIdentifiant[
            "couronne-muette.saturation-du-halo"
          ] +
            metriques.crisesParIdentifiant[
              "extinction-du-phare"
            ] ===
            1 &&
          metriques.crisesCausalesEtUniques,
      ),
    ).toBe(true);
    expect(passe.invariants).toEqual({
      sansImpasse: true,
      sansErreur: true,
      sansRecuperationGratuite: true,
      sansBoucleProfitable: true,
      crisesUniquesEtCausales: true,
    });
    expect(passe.metriques).toMatchObject({
      besoinsSousTension: {
        unite: "ratio-troncons",
        dansLaCible: true,
      },
      crises: {
        unite: "nombre-par-campagne",
        dansLaCible: true,
      },
      arriveeAuNoeud: {
        unite: "ratio-campagnes",
        dansLaCible: true,
      },
      entretienRepetitif: {
        unite: "ratio-charge-equipes",
        nature: "proxy-headless",
      },
      dureeDesHaltes: { unite: "secondes" },
      comprehensionCausale: { unite: "ratio-faits-causes" },
      repetition: { unite: "ratio-motifs-repetes" },
    });
    expect(
      passe.campagnes.every(({ bouclesSondees }) => bouclesSondees === 2),
    ).toBe(true);
    expect(passe.metriques.dureeDesHaltes).toMatchObject({
      nombreDEchantillons: 26,
      p25: 120,
      mediane: 180,
    });
  });

  it("sonde deux cycles sémantiques réels sans créer de ressource", () => {
    const etatInitial = creerCampagneInitiale("TEST-BOUCLES-SEMANTIQUES");
    expect(
      sonderBouclesSemantiques(etatInitial),
    ).toEqual({
      bouclesSondees: 2,
      bouclesProfitables: 0,
    });

    expect(
      detecterBoucleProfitable(etatInitial, {
        ...etatInitial,
        pilotage: {
          ...etatInitial.pilotage,
          economie: {
            ...etatInitial.pilotage.economie,
            stocks: {
              ...etatInitial.pilotage.economie.stocks,
              eau: {
                ...etatInitial.pilotage.economie.stocks.eau,
                quantite:
                  etatInitial.pilotage.economie.stocks.eau.quantite + 1,
              },
            },
          },
        },
      }),
    ).toBe(true);

    const avecGainFractionnaire = {
      ...etatInitial,
      pilotage: {
        ...etatInitial.pilotage,
        incidentActif: null,
        economie: {
          ...etatInitial.pilotage.economie,
          stocks: Object.fromEntries(
            Object.entries(etatInitial.pilotage.economie.stocks).map(
              ([id, stock]) => [
                id,
                {
                  ...stock,
                  fluxParHeure: id === "eau" ? 1 : 0,
                  reliquatDeFlux: 0,
                },
              ],
            ),
          ) as typeof etatInitial.pilotage.economie.stocks,
        },
      },
    };
    expect(sonderBouclesSemantiques(avecGainFractionnaire)).toEqual({
      bouclesSondees: 2,
      bouclesProfitables: 1,
    });
  });

  it("valide deux versions de règles successives sur la même matrice", () => {
    const passes = [3, 4].map((versionRegles) =>
      executerPasseDEquilibrage({
        nombreDeGraines: 1,
        prefixeDeGraine: "TEST-VERSIONS",
        versionRegles,
        conserverTraces: true,
      }),
    );
    const referenceV3Recalculee = executerPasseDEquilibrage({
      nombreDeGraines: 1,
      prefixeDeGraine: "TEST-VERSIONS",
      versionRegles: 3,
      conserverTraces: true,
    });

    expect(passes.map(({ versionRegles }) => versionRegles)).toEqual([3, 4]);
    expect(
      validerReferenceDEquilibrage(passes[0]!, referenceV3Recalculee),
    ).toMatchObject({
      conforme: true,
      grainesEtCommandesIdentiques: true,
      premiereDivergence: null,
    });
    expect(passes.map(({ invariants }) => invariants)).toEqual([
      {
        sansImpasse: true,
        sansErreur: true,
        sansRecuperationGratuite: true,
        sansBoucleProfitable: true,
        crisesUniquesEtCausales: true,
      },
      {
        sansImpasse: true,
        sansErreur: true,
        sansRecuperationGratuite: true,
        sansBoucleProfitable: true,
        crisesUniquesEtCausales: true,
      },
    ]);
  });

  it("signale la dominance uniquement avec fréquence, réussite et coût comparables", () => {
    expect(
      detecterStrategieDominante([
        {
          strategieId: "candidate",
          frequenceDeSelection: 0.66,
          tauxDeReussite: 0.82,
          tauxDeReussiteTemoin: 0.7,
          expositionComparable: true,
          coutCompensatoire: false,
        },
      ]),
    ).toEqual([
      expect.objectContaining({
        strategieId: "candidate",
        gainDeReussite: 0.12,
      }),
    ]);
    expect(
      detecterStrategieDominante([
        {
          strategieId: "compensee",
          frequenceDeSelection: 0.9,
          tauxDeReussite: 0.95,
          tauxDeReussiteTemoin: 0.7,
          expositionComparable: true,
          coutCompensatoire: true,
        },
      ]),
    ).toEqual([]);
  });

  it("calcule la dominance dans le même contexte et avec les mêmes options exposées", () => {
    const campagnes = Array.from({ length: 100 }, (_, index) => {
      const candidateSelectionnee = index < 66;
      const reussite = candidateSelectionnee ? index < 60 : index < 86;
      const base = resultatMinimal();
      return {
        ...base,
        graine: `DOMINANCE-${index}`,
        metriques: {
          ...base.metriques,
          arriveeAuNoeud: reussite,
          selectionsStrategiques: [
            {
              contexteId: "evenement:decision",
              optionId: candidateSelectionnee ? "candidate" : "temoin",
              optionsDisponibles: ["candidate", "temoin"],
            },
          ],
        },
      };
    });

    expect(calculerDominancesDEquilibrage(campagnes)).toEqual([
      expect.objectContaining({
        strategieId: "evenement:decision:candidate",
        frequenceDeSelection: 0.66,
        expositionComparable: true,
        coutCompensatoire: false,
      }),
    ]);

    const avecCout = campagnes.map((campagne, index) => ({
      ...campagne,
      metriques: {
        ...campagne.metriques,
        coutsFinaux: {
          ...campagne.metriques.coutsFinaux,
          stocks: { eau: index < 66 ? 0.1 : 0 },
        },
      },
    }));
    expect(calculerDominancesDEquilibrage(avecCout)).toEqual([]);
  });

  it("compare les mêmes Graines et commandes au premier écart explicable", () => {
    const strategie = STRATEGIES_D_EQUILIBRAGE[0]!;
    const reference = executerPasseDEquilibrage({
      nombreDeGraines: 1,
      prefixeDeGraine: "TEST-COMPARAISON",
      strategies: [strategie],
      versionRegles: 1,
    });
    const campagne = reference.campagnes[0]!;
    const commandeDivergente = campagne.commandes[3]!;
    const candidate: typeof reference = {
      ...reference,
      versionRegles: 2,
      campagnes: [
        {
          ...campagne,
          versionRegles: 2,
          commandes: campagne.commandes.map((etape, index) =>
            index === 3
              ? { ...etape, empreinteEtat: "ffffffff" }
              : etape,
          ),
        },
      ],
    };

    const comparaison = comparerPassesDEquilibrage(reference, candidate);

    expect(comparaison.grainesEtCommandesIdentiques).toBe(true);
    expect(comparaison.porteeDeltaMetriques).toBe("campagnes-completes");
    expect(comparaison.deltaMetriques).not.toBeNull();
    expect(comparaison.ecarts).toEqual([
      expect.objectContaining({
        graine: campagne.graine,
        strategieId: strategie.id,
        premiereDivergence: expect.objectContaining({
          sequence: commandeDivergente.sequence,
          dimension: "etat",
          empreinteReference: commandeDivergente.empreinteEtat,
          empreinteCandidate: "ffffffff",
          explication: expect.stringContaining(
            "deux empreintes d’état différentes",
          ),
        }),
      }),
    ]);
    expect(comparaison.capsules).toEqual([
      expect.objectContaining({
        commandes: campagne.commandes.slice(0, 4).map(({ commande }) => commande),
      }),
    ]);
  });

  it("rejoue le journal candidat sous la règle précédente sans changer ses commandes", () => {
    const candidate = executerPasseDEquilibrage({
      nombreDeGraines: 1,
      prefixeDeGraine: "TEST-REF",
      versionRegles: 2,
    });
    const referenceRejouee = rejouerPasseAvecCommandesImposees(
      candidate,
      1,
    );

    const comparaison = comparerPassesDEquilibrage(
      referenceRejouee,
      candidate,
    );

    expect(comparaison.grainesEtCommandesIdentiques).toBe(true);
    expect(comparaison.porteeDeltaMetriques).toBe(
      "indisponible-apres-divergence",
    );
    expect(comparaison.deltaMetriques).toBeNull();
    expect(comparaison.ecarts.length).toBeGreaterThan(0);
    expect(comparaison.ecarts[0]?.premiereDivergence.explication).toContain(
      "La version historique exigeait le relevé de la Ligne Zéro",
    );
    expect(
      comparaison.capsules.some(({ commandes }) =>
        commandes.some(
          (commande) =>
            commande.type === "engagement-de-route.confirmer" &&
            commande.tronconId === "passage-de-la-ligne-zero",
        ),
      ),
    ).toBe(true);
    expect(
      referenceRejouee.campagnes.some(({ statut }) => statut === "erreur"),
    ).toBe(true);
  });

  it("refuse une référence persistée qui dérive du recalcul déterministe", () => {
    const recalculee = executerPasseDEquilibrage({
      nombreDeGraines: 1,
      prefixeDeGraine: "TEST-REFERENCE-PERSISTEE",
      strategies: [STRATEGIES_D_EQUILIBRAGE[0]!],
    });
    expect(
      validerReferenceDEquilibrage(recalculee, recalculee),
    ).toMatchObject({
      conforme: true,
      grainesEtCommandesIdentiques: true,
      premiereDivergence: null,
    });

    const campagne = recalculee.campagnes[0]!;
    const referenceCorrompue: typeof recalculee = {
      ...recalculee,
      campagnes: [
        {
          ...campagne,
          commandes: campagne.commandes.map((etape, index) =>
            index === 0
              ? {
                  ...etape,
                  commande: {
                    type: "temps-du-convoi.ecouler",
                    secondesReelles: 1,
                  },
                }
              : etape,
          ),
        },
      ],
    };

    expect(
      validerReferenceDEquilibrage(referenceCorrompue, recalculee),
    ).toMatchObject({
      conforme: false,
      grainesEtCommandesIdentiques: false,
      premiereDivergence: {
        premiereDivergence: expect.objectContaining({
          sequence: 0,
          dimension: "commande",
        }),
      },
    });
  });

  it("refuse impasse, récupération gratuite et boucle profitable", () => {
    const conforme = resultatMinimal();
    expect(verifierInvariantsDEquilibrage([conforme])).toEqual({
      sansImpasse: true,
      sansErreur: true,
      sansRecuperationGratuite: true,
      sansBoucleProfitable: true,
      crisesUniquesEtCausales: true,
    });

    expect(
      verifierInvariantsDEquilibrage([
        { ...conforme, statut: "impasse", raisonDEchec: "aucune-commande" },
        { ...conforme, recuperationsGratuites: 1 },
        { ...conforme, bouclesSondees: 0 },
        { ...conforme, bouclesProfitables: 1 },
      ]),
    ).toEqual({
      sansImpasse: false,
      sansErreur: true,
      sansRecuperationGratuite: false,
      sansBoucleProfitable: false,
      crisesUniquesEtCausales: true,
    });

    expect(
      verifierInvariantsDEquilibrage([
        { ...conforme, statut: "erreur", raisonDEchec: "commande-refusee" },
      ]),
    ).toMatchObject({
      sansImpasse: true,
      sansErreur: false,
    });
  });
});

function resultatMinimal(): ResultatDeCampagneHeadless {
  return {
    format: "lanternes-de-cendre.campagne-headless",
    version: 1,
    versionRegles: VERSION_REGLES_D_EQUILIBRAGE_COURANTE,
    graine: "MINIMALE",
    strategieId: STRATEGIES_D_EQUILIBRAGE[0]!.id,
    experience: "premiere-campagne",
    statut: "terminee",
    raisonDEchec: null,
    positionFinale: "noeud-central",
    denouementFinal: {
      statut: "solution-finale",
      solution: "ancrer",
      variante: "refuge-commun",
      cause: "finale.ancrage.la-derniere-negociation",
      moment: 4200,
    },
    commandes: [],
    faitsFinaux: [],
    metriques: {
      tronconsParcourus: 0,
      tronconsSousTension: 0,
      crises: 0,
      crisesParIdentifiant: {
        "penurie-eau.pompe-purification": 0,
        "veille-basse.accueil-sous-penurie": 0,
        "trame-fer.cascade-materielle": 0,
        "couronne-muette.saturation-du-halo": 0,
        "extinction-du-phare": 0,
      },
      crisesCausalesEtUniques: true,
      arriveeAuNoeud: true,
      secondesActives: 0,
      secondesDeChargeDEntretien: 0,
      dureesDeHalte: [],
      faitsAvecCause: 0,
      faitsTotaux: 0,
      motifsNarratifs: [],
      selectionsStrategiques: [],
      coutsFinaux: { stocks: {}, habitants: 0, cicatrices: 0 },
      coutFinal: 0,
      defaiteStrategique: false,
    },
    recuperationsGratuites: 0,
    bouclesSondees: 2,
    bouclesProfitables: 0,
    empreinteFinale: "00000000",
  };
}
