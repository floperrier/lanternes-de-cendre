import { catalogueDEvenements } from "../content/catalogue";
import { VERSION_CONTENU_COURANTE } from "../content/types";
import { VERSION_SAUVEGARDE_COURANTE } from "../sauvegarde/version";
import {
  appliquerCommande,
  creerCampagneInitiale,
  type CommandeCampagne,
  type EtatCampagne,
  type EvenementDeDomaine,
} from "../simulation/campagne";
import type { FaitDeCampagne } from "../simulation/faits";
import { empreinteValeurDeterministe } from "../simulation/empreinte";
import {
  VERSION_ALEATOIRE_COURANTE,
  VERSION_EMPREINTE_DETERMINISTE,
  VERSION_SIMULATION_COURANTE,
} from "../simulation/versions";

export const VERSION_SCENARIOS_SENTINELLES = 3 as const;

export const FAMILLES_DE_SCENARIOS_SENTINELLES = [
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
] as const;

export type FamilleDeScenarioSentinelle =
  (typeof FAMILLES_DE_SCENARIOS_SENTINELLES)[number];

export const INVARIANTS_SENTINELLES = [
  "causalite",
  "recuperation",
  "determinisme",
  "revelations-essentielles",
  "non-repetition",
] as const;

export type InvariantSentinelle = (typeof INVARIANTS_SENTINELLES)[number];
export type ConduiteSentinelle = "prudente" | "risquee";

interface AttenduDEtapeSentinelle {
  readonly statut: "appliquee" | "refusee";
  readonly empreinteEtat: string;
  readonly empreinteEvenements: string;
  readonly erreur?: string;
}

export interface EtapeDeScenarioSentinelle {
  readonly sequence: number;
  readonly commande: CommandeCampagne;
  readonly attendu: AttenduDEtapeSentinelle;
}

interface ResultatAttenduDeConduite {
  readonly empreinteEtat: string;
  readonly empreinteEvenements: string;
  readonly secondeFinale: number;
}

interface DefinitionDeConduiteSentinelle {
  readonly commandes: readonly EtapeDeScenarioSentinelle[];
  readonly resultatAttendu: ResultatAttenduDeConduite;
}

export interface ScenarioSentinelle {
  readonly format: "lanternes-de-cendre.scenario-sentinelle";
  readonly version: typeof VERSION_SCENARIOS_SENTINELLES;
  readonly id: string;
  readonly famille: FamilleDeScenarioSentinelle;
  readonly variante?: "ancrer" | "reaccorder" | "precipiter";
  readonly graine: string;
  readonly snapshot: EtatCampagne;
  readonly empreinteSnapshot: string;
  readonly revelationsAttendues: readonly string[];
  readonly invariants: typeof INVARIANTS_SENTINELLES;
  readonly conduites: Readonly<
    Record<ConduiteSentinelle, DefinitionDeConduiteSentinelle>
  >;
}

interface EtapeNonCalibree {
  readonly sequence: number;
  readonly commande: CommandeCampagne;
  readonly statutAttendu: "appliquee" | "refusee";
}

interface ConduiteNonCalibree {
  readonly commandes: readonly EtapeNonCalibree[];
}

interface ScenarioNonCalibre {
  readonly id: string;
  readonly famille: FamilleDeScenarioSentinelle;
  readonly variante?: "ancrer" | "reaccorder" | "precipiter";
  readonly graine: string;
  readonly snapshot: EtatCampagne;
  readonly revelationsAttendues?: readonly string[];
  readonly conduites: Readonly<Record<ConduiteSentinelle, ConduiteNonCalibree>>;
}

interface EtapeObservee {
  readonly sequence: number;
  readonly commande: CommandeCampagne;
  readonly statut: "appliquee" | "refusee";
  readonly empreinteEtat: string;
  readonly empreinteEvenements: string;
  readonly erreur?: string;
}

interface ObservationDeConduite {
  readonly etat: EtatCampagne;
  readonly evenements: readonly EvenementDeDomaine[];
  readonly etapes: readonly EtapeObservee[];
  readonly resultat: ResultatAttenduDeConduite;
}

export interface CapsuleDeDivergenceSentinelle {
  readonly format: "lanternes-de-cendre.capsule-sentinelle";
  readonly version: 1;
  readonly versions: {
    readonly scenarios: typeof VERSION_SCENARIOS_SENTINELLES;
    readonly simulation: typeof VERSION_SIMULATION_COURANTE;
    readonly contenu: typeof VERSION_CONTENU_COURANTE;
    readonly sauvegarde: typeof VERSION_SAUVEGARDE_COURANTE;
    readonly aleatoire: typeof VERSION_ALEATOIRE_COURANTE;
    readonly empreinte: typeof VERSION_EMPREINTE_DETERMINISTE;
  };
  readonly scenario: {
    readonly id: string;
    readonly version: typeof VERSION_SCENARIOS_SENTINELLES;
    readonly conduite: ConduiteSentinelle;
  };
  readonly graine: string;
  readonly snapshot: {
    readonly empreinte: string;
    readonly etat: EtatCampagne;
  };
  readonly commandes: readonly {
    readonly sequence: number;
    readonly commande: CommandeCampagne;
    readonly attendu: AttenduDEtapeSentinelle;
  }[];
  readonly premierDesaccord: {
    readonly sequence: number | null;
    readonly dimension:
      | "snapshot"
      | "statut"
      | "etat"
      | "evenements"
      | "erreur"
      | "resultat"
      | "invariant";
    readonly attendue: string;
    readonly obtenue: string;
  };
}

export type ResultatDeScenarioSentinelle =
  | {
      readonly statut: "conforme";
      readonly scenarioId: string;
      readonly famille: FamilleDeScenarioSentinelle;
      readonly conduite: ConduiteSentinelle;
      readonly empreinteEtat: string;
      readonly empreinteEvenements: string;
      readonly secondeFinale: number;
      readonly invariants: Readonly<Record<InvariantSentinelle, true>>;
    }
  | {
      readonly statut: "divergence";
      readonly scenarioId: string;
      readonly famille: FamilleDeScenarioSentinelle;
      readonly conduite: ConduiteSentinelle;
      readonly capsule: CapsuleDeDivergenceSentinelle;
    };

const REVELATIONS_ESSENTIELLES = [
  "prologue.reponse-du-phare",
  "veille-basse.les-registres-du-reflux",
  "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
  "couronne.ouverture.le-diagnostic-des-verrous",
  "epilogue.revelation.le-registre-des-rejets",
] as const;

type CalibrationDEtape = readonly [
  statut: "appliquee" | "refusee",
  empreinteEtat: string,
  empreinteEvenements: string,
  erreur?: string,
];

interface CalibrationDeConduite {
  readonly etapes: readonly CalibrationDEtape[];
  readonly resultat: readonly [
    empreinteEtat: string,
    empreinteEvenements: string,
    secondeFinale: number,
  ];
}

interface CalibrationDeScenario {
  readonly snapshot: string;
  readonly prudente: CalibrationDeConduite;
  readonly risquee: CalibrationDeConduite;
}

const CALIBRATIONS_V3: Readonly<Record<string, CalibrationDeScenario>> = {
  "debut-nominal": {
    snapshot: "0dbe3fc0",
    prudente: {
      etapes: [
        ["appliquee", "cee38dbc", "aff2fb9e"],
        ["appliquee", "f71bf3df", "c26287a4"],
        ["appliquee", "e8b0c7f9", "e0b6bb78"],
        ["appliquee", "181bab2e", "8149ac96"],
        ["appliquee", "dab1176d", "3e258581"],
        ["appliquee", "1b3bb213", "ba64ef9e"],
      ],
      resultat: ["1b3bb213", "c7894952", 120],
    },
    risquee: {
      etapes: [
        ["appliquee", "9608b77d", "d79c674f"],
        ["appliquee", "3bd109cb", "0f114506"],
        ["appliquee", "47166c76", "3e258581"],
        ["appliquee", "fb8fdbf2", "debfe5f7"],
      ],
      resultat: ["fb8fdbf2", "d14466cc", 120],
    },
  },
  "double-tension": {
    snapshot: "c8e1e075",
    prudente: {
      etapes: [
        ["appliquee", "70bc60e5", "a5237aae"],
        ["appliquee", "8ec758af", "f96f7e6d"],
        ["appliquee", "2768a4ee", "a7678a5a"],
      ],
      resultat: ["2768a4ee", "40a813d5", 30],
    },
    risquee: {
      etapes: [
        ["appliquee", "c6684535", "b95c389e"],
        ["appliquee", "e72abb4e", "47eb7a00"],
        ["appliquee", "43e7fe4d", "ab10e6fd"],
      ],
      resultat: ["43e7fe4d", "151bbec1", 30],
    },
  },
  "cascade-materielle": {
    snapshot: "b5be9846",
    prudente: {
      etapes: [
        ["appliquee", "75ec30e7", "a42349ff"],
        ["appliquee", "4c142638", "1100ad93"],
        ["appliquee", "6193557a", "1438bf5c"],
        ["appliquee", "3d8379fc", "776f9614"],
        ["appliquee", "e3b2c3e1", "14255f38"],
      ],
      resultat: ["e3b2c3e1", "694487fe", 180],
    },
    risquee: {
      etapes: [
        ["appliquee", "75ec30e7", "a42349ff"],
        ["appliquee", "4c142638", "1100ad93"],
        ["appliquee", "6193557a", "1438bf5c"],
        ["appliquee", "c38d1ece", "1d683a82"],
        ["appliquee", "3227b623", "fc727786"],
        ["appliquee", "c053eb57", "941c4c66"],
        ["appliquee", "934ecd6c", "33c001c0"],
      ],
      resultat: ["934ecd6c", "bf1803ae", 660],
    },
  },
  "cohorte-en-penurie": {
    snapshot: "a7581a91",
    prudente: {
      etapes: [
        ["appliquee", "c5e8b262", "125e5b8d"],
        ["appliquee", "3999a280", "f5ef49ed"],
        ["appliquee", "d6856aeb", "71fb9131"],
        ["appliquee", "c4d09570", "ae290aaf"],
        ["appliquee", "5e92c982", "cd410d13"],
      ],
      resultat: ["5e92c982", "c13085d5", 1080],
    },
    risquee: {
      etapes: [
        ["appliquee", "ee61c07e", "9fbaf835"],
        ["appliquee", "9bf94f19", "e8e394c3"],
        ["appliquee", "d3950caf", "7fa12c7f"],
        ["appliquee", "8853f4b8", "ae290aaf"],
        ["appliquee", "0979df1f", "62b77ccb"],
      ],
      resultat: ["0979df1f", "90ca5c3d", 1080],
    },
  },
  "expeditions-simultanees": {
    snapshot: "3bbe6005",
    prudente: {
      etapes: [
        ["appliquee", "f90237e6", "350e6008"],
        ["appliquee", "7b635dd1", "6ba3e117"],
      ],
      resultat: ["7b635dd1", "ffe03cba", 2520],
    },
    risquee: {
      etapes: [
        ["appliquee", "f90237e6", "350e6008"],
        ["appliquee", "51b1b070", "97e71c42"],
        ["appliquee", "7d122b9c", "3a41ef3c"],
      ],
      resultat: ["7d122b9c", "2718450c", 2520],
    },
  },
  "compagnon-indisponible": {
    snapshot: "c4c35cee",
    prudente: {
      etapes: [["appliquee", "28ceae7c", "d284e99e"]],
      resultat: ["28ceae7c", "d284e99e", 0],
    },
    risquee: {
      etapes: [
        ["refusee", "c4c35cee", "741638a5", "Ilyana Voss est indisponible."],
      ],
      resultat: ["c4c35cee", "741638a5", 0],
    },
  },
  surcharge: {
    snapshot: "2c697961",
    prudente: {
      etapes: [
        ["appliquee", "5789145c", "0de8de41"],
        ["appliquee", "10210a2d", "1673dac6"],
        ["appliquee", "d4a0f50e", "be402c9b"],
        ["appliquee", "06fe9eb3", "09387469"],
        ["appliquee", "ec52fbc9", "1417d5bd"],
      ],
      resultat: ["ec52fbc9", "95d8b8e8", 45],
    },
    risquee: {
      etapes: [
        ["appliquee", "5789145c", "0de8de41"],
        ["appliquee", "10210a2d", "1673dac6"],
        [
          "refusee",
          "10210a2d",
          "741638a5",
          "La contrainte de Charge empêche ce Chantier.",
        ],
      ],
      resultat: ["10210a2d", "2f0e1c5a", 0],
    },
  },
  "route-coupee": {
    snapshot: "2e6ba42a",
    prudente: {
      etapes: [["appliquee", "67bc359b", "25d5c8de"]],
      resultat: ["67bc359b", "25d5c8de", 0],
    },
    risquee: {
      etapes: [
        [
          "refusee",
          "2e6ba42a",
          "741638a5",
          "Le Tronçon de route « digue-des-puits » n’est plus physiquement praticable.",
        ],
      ],
      resultat: ["2e6ba42a", "741638a5", 0],
    },
  },
  "abondance-exploitable": {
    snapshot: "c406c6d7",
    prudente: {
      etapes: [
        ["appliquee", "c4002972", "0de8de41"],
        ["appliquee", "3b04b771", "1673dac6"],
        ["appliquee", "b601935f", "bca5f9de"],
        ["appliquee", "15effe9a", "09387469"],
        ["appliquee", "74fdae77", "c5dddfda"],
      ],
      resultat: ["74fdae77", "9f9e6a2e", 60],
    },
    risquee: {
      etapes: [
        ["appliquee", "8e8d360e", "350e6008"],
        ["appliquee", "db284422", "513acc4d"],
        ["appliquee", "333a549d", "6ceb4d77"],
      ],
      resultat: ["333a549d", "2307eca8", 9420],
    },
  },
  "revelation-aiguillage-zero": {
    snapshot: "a13cc261",
    prudente: {
      etapes: [
        ["appliquee", "ff92b3c0", "467956df"],
        ["appliquee", "57e80e0d", "a870ec52"],
      ],
      resultat: ["57e80e0d", "045e9e5c", 3000],
    },
    risquee: {
      etapes: [
        ["appliquee", "ff92b3c0", "467956df"],
        ["appliquee", "75bc74ce", "f89e7fce"],
      ],
      resultat: ["75bc74ce", "6320eee0", 3000],
    },
  },
  "revelation-couronne": {
    snapshot: "0ac6075a",
    prudente: {
      etapes: [
        ["appliquee", "c1405108", "43e3ae52"],
        ["appliquee", "19540ae0", "5f214b23"],
      ],
      resultat: ["19540ae0", "dd33a9cc", 4000],
    },
    risquee: {
      etapes: [
        ["appliquee", "c1405108", "43e3ae52"],
        ["appliquee", "2c06faf9", "7d4bc53b"],
      ],
      resultat: ["2c06faf9", "6bb41470", 4000],
    },
  },
  "solution-finale-ancrer": {
    snapshot: "d13a0783",
    prudente: {
      etapes: [
        ["appliquee", "2ca2994f", "69df907f"],
        ["appliquee", "26f677c6", "3dd45549"],
        ["appliquee", "c2d18ee4", "4cb0cde2"],
        ["appliquee", "d84a5380", "9b41cbb2"],
        ["appliquee", "68c531be", "74b3c65a"],
        ["appliquee", "2a30a20a", "13d66448"],
        ["appliquee", "00d030e4", "1fe7740e"],
        ["appliquee", "6c87d4fa", "4314612c"],
      ],
      resultat: ["6c87d4fa", "bed5661d", 4200],
    },
    risquee: {
      etapes: [
        ["appliquee", "2ca2994f", "69df907f"],
        ["appliquee", "26f677c6", "3dd45549"],
        ["appliquee", "c2d18ee4", "4cb0cde2"],
        ["appliquee", "d84a5380", "9b41cbb2"],
        ["appliquee", "68c531be", "74b3c65a"],
        ["appliquee", "d08713c5", "39015b8e"],
        ["appliquee", "25566d5f", "1fe7740e"],
        ["appliquee", "22a619a3", "71963b84"],
      ],
      resultat: ["22a619a3", "ecf47983", 4200],
    },
  },
  "solution-finale-reaccorder": {
    snapshot: "5ec9aa4f",
    prudente: {
      etapes: [
        ["appliquee", "de72c5f5", "69df907f"],
        ["appliquee", "9122f40a", "3dd45549"],
        ["appliquee", "dcc58674", "4cb0cde2"],
        ["appliquee", "aa568298", "81171206"],
        ["appliquee", "8f33f2e8", "e79d67c6"],
        ["appliquee", "73ef87bc", "bf7a66fe"],
        ["appliquee", "b9f81942", "1fe7740e"],
        ["appliquee", "35ed0220", "4314612c"],
      ],
      resultat: ["35ed0220", "aca1224b", 4200],
    },
    risquee: {
      etapes: [
        ["appliquee", "de72c5f5", "69df907f"],
        ["appliquee", "9122f40a", "3dd45549"],
        ["appliquee", "dcc58674", "4cb0cde2"],
        ["appliquee", "aa568298", "81171206"],
        ["appliquee", "8f33f2e8", "e79d67c6"],
        ["appliquee", "e1bc3d56", "cef11d62"],
        ["appliquee", "05c25014", "1fe7740e"],
        ["appliquee", "1e4f994e", "71963b84"],
      ],
      resultat: ["1e4f994e", "26674e67", 4200],
    },
  },
  "solution-finale-precipiter": {
    snapshot: "e3fe2674",
    prudente: {
      etapes: [
        ["appliquee", "a345690a", "69df907f"],
        ["appliquee", "0ee43471", "3dd45549"],
        ["appliquee", "b854c0ef", "4cb0cde2"],
        ["appliquee", "15f536cb", "8bbdb43b"],
        ["appliquee", "3f472bca", "ee76a539"],
        ["appliquee", "d0eb555d", "4abf338b"],
        ["appliquee", "1fae8baf", "1fe7740e"],
        ["appliquee", "d3f8a61b", "4314612c"],
      ],
      resultat: ["d3f8a61b", "403fd334", 4200],
    },
    risquee: {
      etapes: [
        ["appliquee", "a345690a", "69df907f"],
        ["appliquee", "0ee43471", "3dd45549"],
        ["appliquee", "b854c0ef", "4cb0cde2"],
        ["appliquee", "15f536cb", "8bbdb43b"],
        ["appliquee", "3f472bca", "ee76a539"],
        ["appliquee", "abb7c0ae", "931d2144"],
        ["appliquee", "af7db204", "1fe7740e"],
        ["appliquee", "6959cace", "71963b84"],
      ],
      resultat: ["6959cace", "54b76d85", 4200],
    },
  },
};

function fait(id: string, moment = 0): FaitDeCampagne {
  return {
    id,
    cause: "scenario.sentinelle",
    acteurs: ["porte-lanterne"],
    cible: "campagne",
    moment,
    effets: { materiels: [], humains: [] },
  };
}

function sansIncident(etat: EtatCampagne): EtatCampagne {
  return {
    ...etat,
    pilotage: {
      ...etat.pilotage,
      incidentActif: null,
    },
  };
}

function avecStocks(
  etat: EtatCampagne,
  quantites: Partial<
    Record<keyof EtatCampagne["pilotage"]["economie"]["stocks"], number>
  >,
): EtatCampagne {
  const stocks = etat.pilotage.economie.stocks;
  return {
    ...etat,
    pilotage: {
      ...etat.pilotage,
      economie: {
        ...etat.pilotage.economie,
        stocks: {
          vivres: {
            ...stocks.vivres,
            quantite: quantites.vivres ?? stocks.vivres.quantite,
          },
          eau: {
            ...stocks.eau,
            quantite: quantites.eau ?? stocks.eau.quantite,
          },
          combustible: {
            ...stocks.combustible,
            quantite: quantites.combustible ?? stocks.combustible.quantite,
          },
          materiaux: {
            ...stocks.materiaux,
            quantite: quantites.materiaux ?? stocks.materiaux.quantite,
          },
          remedes: {
            ...stocks.remedes,
            quantite: quantites.remedes ?? stocks.remedes.quantite,
          },
        },
      },
    },
  };
}

function snapshotDeFinale(
  id: string,
  idsDeFaits: readonly string[],
): EtatCampagne {
  const initial = sansIncident(creerCampagneInitiale(`SENTINELLE-V1-${id}`));
  return {
    ...initial,
    tempsDuConvoi: { secondes: 4_200, vitesse: 0 },
    routes: { ...initial.routes, position: "noeud-central" },
    narration: {
      ...initial.narration,
      faitsDeCampagne: idsDeFaits.map((faitId) => fait(faitId, 4_000)),
    },
  };
}

function etapes(
  commandes: readonly {
    readonly commande: CommandeCampagne;
    readonly statut?: "appliquee" | "refusee";
  }[],
): readonly EtapeNonCalibree[] {
  return commandes.map(({ commande, statut = "appliquee" }, sequence) => ({
    sequence,
    commande,
    statutAttendu: statut,
  }));
}

function conduite(
  commandes: readonly {
    readonly commande: CommandeCampagne;
    readonly statut?: "appliquee" | "refusee";
  }[],
): ConduiteNonCalibree {
  return { commandes: etapes(commandes) };
}

function scenario(definition: ScenarioNonCalibre): ScenarioSentinelle {
  const calibration = CALIBRATIONS_V3[definition.id];
  if (calibration === undefined) {
    throw new Error(
      `Le scénario sentinelle « ${definition.id} » n’a pas de calibration V3.`,
    );
  }
  const calibrerConduite = (
    conduiteId: ConduiteSentinelle,
  ): DefinitionDeConduiteSentinelle => {
    const definitionDeConduite = definition.conduites[conduiteId];
    const calibrationDeConduite = calibration[conduiteId];
    if (
      definitionDeConduite.commandes.length !==
      calibrationDeConduite.etapes.length
    ) {
      throw new Error(
        `La calibration du scénario « ${definition.id} » ne correspond plus à ses commandes.`,
      );
    }
    const commandes = definitionDeConduite.commandes.map(
      (etape, index): EtapeDeScenarioSentinelle => {
        const [statut, empreinteEtat, empreinteEvenements, erreur] =
          calibrationDeConduite.etapes[index]!;
        if (statut !== etape.statutAttendu) {
          throw new Error(
            `La calibration du scénario « ${definition.id} » contredit le statut attendu de la commande ${etape.sequence}.`,
          );
        }
        return {
          sequence: etape.sequence,
          commande: etape.commande,
          attendu: {
            statut,
            empreinteEtat,
            empreinteEvenements,
            ...(erreur === undefined ? {} : { erreur }),
          },
        };
      },
    );
    const [empreinteEtat, empreinteEvenements, secondeFinale] =
      calibrationDeConduite.resultat;
    return {
      commandes,
      resultatAttendu: {
        empreinteEtat,
        empreinteEvenements,
        secondeFinale,
      },
    };
  };
  const conduites = {
    prudente: calibrerConduite("prudente"),
    risquee: calibrerConduite("risquee"),
  };
  return {
    format: "lanternes-de-cendre.scenario-sentinelle",
    version: VERSION_SCENARIOS_SENTINELLES,
    ...definition,
    conduites,
    empreinteSnapshot: calibration.snapshot,
    revelationsAttendues: definition.revelationsAttendues ?? [],
    invariants: INVARIANTS_SENTINELLES,
  };
}

function construireScenariosSentinelles(): readonly ScenarioSentinelle[] {
  const debutNominal = creerCampagneInitiale("SENTINELLE-V1-DEBUT-NOMINAL");
  const doubleTension = avecStocks(
    sansIncident(creerCampagneInitiale("SENTINELLE-V1-DOUBLE-TENSION")),
    { eau: 90, combustible: 72 },
  );
  const cascadeMaterielle = creerCampagneInitiale(
    "SENTINELLE-V1-CASCADE-MATERIELLE",
  );
  const cohorteEnPenurieInitiale = avecStocks(
    sansIncident(creerCampagneInitiale("SENTINELLE-V1-COHORTE-PENURIE")),
    { eau: 24, vivres: 30 },
  );
  const cohorteEnPenurie: EtatCampagne = {
    ...cohorteEnPenurieInitiale,
    tempsDuConvoi: { secondes: 480, vitesse: 4 },
    routes: {
      ...cohorteEnPenurieInitiale.routes,
      position: "veille-basse",
      jalons: [
        {
          id: "jalon-route-veille-basse",
          type: "fin-de-troncon",
          moment: 480,
          tronconId: "chaussee-de-veille-basse",
          cause: "front-de-cendre.condamnation-arriere",
        },
      ],
    },
    narration: {
      ...cohorteEnPenurieInitiale.narration,
      evenementActif: "veille-basse.la-place-sous-le-phare",
    },
  };
  const expeditionsInitiales = sansIncident(
    creerCampagneInitiale("SENTINELLE-V1-EXPEDITIONS-SIMULTANEES"),
  );
  const expeditionTemoin = expeditionsInitiales.expeditions.operations[0]!;
  const expeditionsSimultanees: EtatCampagne = {
    ...expeditionsInitiales,
    expeditions: {
      operations: [
        expeditionTemoin,
        {
          ...expeditionTemoin,
          id: "collecteurs-sud",
        },
      ],
    },
  };
  const compagnonIndisponibleInitial = creerCampagneInitiale(
    "SENTINELLE-V1-COMPAGNON-INDISPONIBLE",
  );
  const compagnonIndisponible: EtatCampagne = {
    ...compagnonIndisponibleInitial,
    narration: {
      ...compagnonIndisponibleInitial.narration,
      faitsDeCampagne: [fait("compagnon.ilyana-voss.indisponible")],
    },
  };
  const surchargeInitiale = sansIncident(
    creerCampagneInitiale("SENTINELLE-V1-SURCHARGE"),
  );
  const surcharge: EtatCampagne = {
    ...surchargeInitiale,
    pilotage: {
      ...surchargeInitiale.pilotage,
      economie: {
        ...surchargeInitiale.pilotage.economie,
        capacites: {
          ...surchargeInitiale.pilotage.economie.capacites,
          charge: {
            ...surchargeInitiale.pilotage.economie.capacites.charge,
            demande: 82,
          },
        },
      },
    },
  };
  const routeCoupeeInitiale = sansIncident(
    creerCampagneInitiale("SENTINELLE-V1-ROUTE-COUPEE"),
  );
  const routeCoupee: EtatCampagne = {
    ...routeCoupeeInitiale,
    routes: {
      ...routeCoupeeInitiale.routes,
      etatsReels: {
        ...routeCoupeeInitiale.routes.etatsReels,
        "digue-des-puits": "coupe",
      },
    },
  };
  const revelationAiguillageZeroInitiale = sansIncident(
    creerCampagneInitiale("SENTINELLE-V1-REVELATION-AIGUILLAGE-ZERO"),
  );
  const revelationAiguillageZero: EtatCampagne = {
    ...revelationAiguillageZeroInitiale,
    tempsDuConvoi: { secondes: 3_000, vitesse: 0 },
    routes: {
      ...revelationAiguillageZeroInitiale.routes,
      position: "aiguillage-zero",
    },
  };
  const revelationCouronneInitiale = sansIncident(
    creerCampagneInitiale("SENTINELLE-V1-REVELATION-COURONNE"),
  );
  const revelationCouronne: EtatCampagne = {
    ...revelationCouronneInitiale,
    tempsDuConvoi: { secondes: 4_000, vitesse: 0 },
    routes: {
      ...revelationCouronneInitiale.routes,
      position: "anneau-interieur",
    },
  };
  const abondanceExploitable = avecStocks(
    sansIncident(creerCampagneInitiale("SENTINELLE-V1-ABONDANCE")),
    {
      vivres: 4_000,
      eau: 4_000,
      combustible: 2_000,
      materiaux: 300,
      remedes: 120,
    },
  );

  function commandesDeFinale(
    choixDeSolution: string,
    evenementDeNegociation: string,
    choixPrudent: string,
    choixRisque: string,
  ): Readonly<Record<ConduiteSentinelle, ConduiteNonCalibree>> {
    const debut = [
      {
        commande: {
          type: "temps-du-convoi.ecouler",
          secondesReelles: 0,
        } as const,
      },
      {
        commande: {
          type: "evenement-narratif.choisir",
          evenementId: "finale.ancrage.le-contrat-des-trois-solutions",
          choixId: "publier-causes-des-solutions",
        } as const,
      },
      {
        commande: {
          type: "temps-du-convoi.ecouler",
          secondesReelles: 0,
        } as const,
      },
      {
        commande: {
          type: "evenement-narratif.choisir",
          evenementId: "finale.ancrage.choisir-d-ancrer-le-coeur",
          choixId: choixDeSolution,
        } as CommandeCampagne,
      },
      {
        commande: {
          type: "temps-du-convoi.ecouler",
          secondesReelles: 0,
        } as const,
      },
    ];
    const epilogue = [
      {
        commande: {
          type: "temps-du-convoi.ecouler",
          secondesReelles: 0,
        } as const,
      },
    ];
    return {
      prudente: conduite([
        ...debut,
        {
          commande: {
            type: "evenement-narratif.choisir",
            evenementId: evenementDeNegociation,
            choixId: choixPrudent,
          },
        },
        ...epilogue,
        {
          commande: {
            type: "evenement-narratif.choisir",
            evenementId: "epilogue.revelation.le-registre-des-rejets",
            choixId: "rendre-registre-public",
          },
        },
      ]),
      risquee: conduite([
        ...debut,
        {
          commande: {
            type: "evenement-narratif.choisir",
            evenementId: evenementDeNegociation,
            choixId: choixRisque,
          },
        },
        ...epilogue,
        {
          commande: {
            type: "evenement-narratif.choisir",
            evenementId: "epilogue.revelation.le-registre-des-rejets",
            choixId: "confier-copies-aux-colonies",
          },
        },
      ]),
    };
  }

  return [
    scenario({
      id: "debut-nominal",
      famille: "debut-nominal",
      graine: debutNominal.graine,
      snapshot: debutNominal,
      revelationsAttendues: ["prologue.reponse-du-phare"],
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "doctrine.regler",
              politique: "entretien",
              position: "preventif",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 30,
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 90,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "prologue.signaux-sous-la-cendre",
              choixId: "accueillir",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "prologue.reponse-du-phare",
              choixId: "consigner-harmonique",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 120,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "prologue.signaux-sous-la-cendre",
              choixId: "orienter",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "prologue.reponse-du-phare",
              choixId: "etouffer-signal",
            },
          },
        ]),
      },
    }),
    scenario({
      id: "double-tension",
      famille: "double-tension",
      graine: doubleTension.graine,
      snapshot: doubleTension,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "doctrine.regler",
              politique: "rationnement",
              position: "strict",
            },
          },
          {
            commande: {
              type: "doctrine.regler",
              politique: "allure",
              position: "prudente",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 30,
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "doctrine.regler",
              politique: "rationnement",
              position: "genereux",
            },
          },
          {
            commande: {
              type: "doctrine.regler",
              politique: "allure",
              position: "forcee",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 30,
            },
          },
        ]),
      },
    }),
    scenario({
      id: "cascade-materielle",
      famille: "cascade-materielle",
      graine: cascadeMaterielle.graine,
      snapshot: cascadeMaterielle,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "incident.ordonner",
              incidentId: "purification.pompe-instable",
              ordre: "maintenir-debit",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 180,
            },
          },
          {
            commande: {
              type: "crise.declencher",
              criseId: "penurie-eau.pompe-purification",
            },
          },
          {
            commande: {
              type: "crise.resoudre",
              criseId: "penurie-eau.pompe-purification",
              reponseId: "isoler-et-rationner",
            },
          },
          { commande: { type: "halte.deployer" } },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "incident.ordonner",
              incidentId: "purification.pompe-instable",
              ordre: "maintenir-debit",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 180,
            },
          },
          {
            commande: {
              type: "crise.declencher",
              criseId: "penurie-eau.pompe-purification",
            },
          },
          {
            commande: {
              type: "crise.resoudre",
              criseId: "penurie-eau.pompe-purification",
              reponseId: "evacuer-les-foyers-exposes",
            },
          },
          {
            commande: {
              type: "engagement-de-route.confirmer",
              tronconId: "chaussee-de-veille-basse",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 4,
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 120,
            },
          },
        ]),
      },
    }),
    scenario({
      id: "cohorte-en-penurie",
      famille: "cohorte-en-penurie",
      graine: cohorteEnPenurie.graine,
      snapshot: cohorteEnPenurie,
      revelationsAttendues: ["veille-basse.les-registres-du-reflux"],
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "veille-basse.la-place-sous-le-phare",
              choixId: "rediriger",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 150,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "veille-basse.la-porte-des-filtres",
              choixId: "renforcer-sas",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "veille-basse.les-registres-du-reflux",
              choixId: "copier-registres",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "veille-basse.la-place-sous-le-phare",
              choixId: "accueillir",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 150,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "veille-basse.la-porte-des-filtres",
              choixId: "ouvrir-hospice",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "veille-basse.les-registres-du-reflux",
              choixId: "laisser-registres",
            },
          },
        ]),
      },
    }),
    scenario({
      id: "expeditions-simultanees",
      famille: "expeditions-simultanees",
      graine: expeditionsSimultanees.graine,
      snapshot: expeditionsSimultanees,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "expedition.lancer",
              expeditionId: "vannes-grises",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 2_520,
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "expedition.lancer",
              expeditionId: "vannes-grises",
            },
          },
          {
            commande: {
              type: "expedition.lancer",
              expeditionId: "collecteurs-sud",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 2_520,
            },
          },
        ]),
      },
    }),
    scenario({
      id: "compagnon-indisponible",
      famille: "compagnon-indisponible",
      graine: compagnonIndisponible.graine,
      snapshot: compagnonIndisponible,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "incident.ordonner",
              incidentId: "purification.pompe-instable",
              ordre: "securiser-pompe",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "compagnon.affecter",
              compagnonId: "ilyana-voss",
              quartierId: "intendance",
            },
            statut: "refusee",
          },
        ]),
      },
    }),
    scenario({
      id: "surcharge",
      famille: "surcharge",
      graine: surcharge.graine,
      snapshot: surcharge,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 0,
            },
          },
          { commande: { type: "halte.deployer" } },
          {
            commande: {
              type: "chantier.engager",
              ordre: {
                type: "demontage",
                emplacementId: "foyers.habitable-1",
              },
              priorite: "normale",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 1,
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 45,
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 0,
            },
          },
          { commande: { type: "halte.deployer" } },
          {
            commande: {
              type: "chantier.engager",
              ordre: {
                type: "construction",
                definitionId: "condenseur-thermique",
                emplacementId: "intendance.polyvalent",
              },
              priorite: "haute",
            },
            statut: "refusee",
          },
        ]),
      },
    }),
    scenario({
      id: "route-coupee",
      famille: "route-coupee",
      graine: routeCoupee.graine,
      snapshot: routeCoupee,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "engagement-de-route.confirmer",
              tronconId: "chaussee-de-veille-basse",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "engagement-de-route.confirmer",
              tronconId: "digue-des-puits",
            },
            statut: "refusee",
          },
        ]),
      },
    }),
    scenario({
      id: "abondance-exploitable",
      famille: "abondance-exploitable",
      graine: abondanceExploitable.graine,
      snapshot: abondanceExploitable,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 0,
            },
          },
          { commande: { type: "halte.deployer" } },
          {
            commande: {
              type: "chantier.engager",
              ordre: {
                type: "construction",
                definitionId: "condenseur-thermique",
                emplacementId: "intendance.polyvalent",
              },
              priorite: "haute",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.regler-vitesse",
              vitesse: 1,
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 60,
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "expedition.lancer",
              expeditionId: "vannes-grises",
            },
          },
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 9_420,
            },
          },
          {
            commande: {
              type: "expedition.ordonner",
              expeditionId: "vannes-grises",
              intention: "forcer-galerie",
            },
          },
        ]),
      },
    }),
    scenario({
      id: "revelation-aiguillage-zero",
      famille: "route-coupee",
      graine: revelationAiguillageZero.graine,
      snapshot: revelationAiguillageZero,
      revelationsAttendues: [
        "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
      ],
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
              choixId: "relever-portees",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "trame.aiguillage-zero.la-piece-et-le-coeur-mobile",
              choixId: "tester-sequence",
            },
          },
        ]),
      },
    }),
    scenario({
      id: "revelation-couronne",
      famille: "solutions-finales",
      graine: revelationCouronne.graine,
      snapshot: revelationCouronne,
      revelationsAttendues: ["couronne.ouverture.le-diagnostic-des-verrous"],
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "couronne.ouverture.le-diagnostic-des-verrous",
              choixId: "publier-diagnostic-des-verrous",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "temps-du-convoi.ecouler",
              secondesReelles: 0,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId: "couronne.ouverture.le-diagnostic-des-verrous",
              choixId: "separer-diagnostic-des-verrous",
            },
          },
        ]),
      },
    }),
    scenario({
      id: "solution-finale-ancrer",
      famille: "solutions-finales",
      variante: "ancrer",
      graine: "SENTINELLE-V1-FINALE-ANCRER",
      snapshot: snapshotDeFinale("FINALE-ANCRER", [
        "couronne.approches.berceau-amorce",
        "couronne.ouverture.clef-collective",
        "couronne.colonies.voie-alliee-preparee",
        "couronne.tete-de-ligne.mandat-republicain",
      ]),
      revelationsAttendues: ["epilogue.revelation.le-registre-des-rejets"],
      conduites: commandesDeFinale(
        "selectionner-ancrage-prepare",
        "finale.ancrage.la-derniere-negociation",
        "negocier-refuge-commun",
        "negocier-citadelle-de-cendre",
      ),
    }),
    scenario({
      id: "solution-finale-reaccorder",
      famille: "solutions-finales",
      variante: "reaccorder",
      graine: "SENTINELLE-V1-FINALE-REACCORDER",
      snapshot: snapshotDeFinale("FINALE-REACCORDER", [
        "couronne.approches.etalon-calibre",
        "couronne.tete-de-ligne.atelier-commun",
        "couronne.colonies.voie-alliee-preparee",
        "trame.aiguillage-zero.charte-partagee",
        "couronne.tete-de-ligne.mandat-republicain",
      ]),
      revelationsAttendues: ["epilogue.revelation.le-registre-des-rejets"],
      conduites: commandesDeFinale(
        "selectionner-reaccord-prepare",
        "finale.reaccord.la-derniere-negociation-du-reseau",
        "mailler-la-constellation",
        "confier-le-reseau-de-fer",
      ),
    }),
    scenario({
      id: "solution-finale-precipiter",
      famille: "solutions-finales",
      variante: "precipiter",
      graine: "SENTINELLE-V1-FINALE-PRECIPITER",
      snapshot: snapshotDeFinale("FINALE-PRECIPITER", [
        "couronne.approches.precipitateur-assemble",
        "couronne.approches.socles-cartographies",
        "bassins.deversoir.ligne-zero-relevee",
        "bassins.haut-puits.panache-confine",
        "bassins.haut-puits.decanteur-documente",
        "bassins.haut-puits.pacte-partage",
      ]),
      revelationsAttendues: ["epilogue.revelation.le-registre-des-rejets"],
      conduites: commandesDeFinale(
        "selectionner-precipitation-preparee",
        "finale.precipitation.la-derniere-negociation-des-bassins",
        "administrer-le-ciel-rendu",
        "rompre-le-front-en-pluie-noire",
      ),
    }),
  ] as const;
}

export function obtenirScenariosSentinelles(): readonly ScenarioSentinelle[] {
  return construireScenariosSentinelles();
}

function observerConduite(
  scenarioSentinelle: ScenarioSentinelle,
  conduiteId: ConduiteSentinelle,
): ObservationDeConduite {
  let etat = scenarioSentinelle.snapshot;
  const evenementsCumules: EvenementDeDomaine[] = [];
  const etapesObservees: EtapeObservee[] = [];

  for (const etape of scenarioSentinelle.conduites[conduiteId].commandes) {
    let evenements: readonly EvenementDeDomaine[] = [];
    let erreur: string | undefined;
    try {
      const transition = appliquerCommande(etat, etape.commande);
      etat = transition.etat;
      evenements = transition.evenements;
    } catch (cause) {
      erreur = cause instanceof Error ? cause.message : String(cause);
    }
    evenementsCumules.push(...evenements);
    etapesObservees.push({
      sequence: etape.sequence,
      commande: etape.commande,
      statut: erreur === undefined ? "appliquee" : "refusee",
      empreinteEtat: empreinteValeurDeterministe(etat),
      empreinteEvenements: empreinteValeurDeterministe(evenements),
      ...(erreur === undefined ? {} : { erreur }),
    });
  }

  return {
    etat,
    evenements: evenementsCumules,
    etapes: etapesObservees,
    resultat: {
      empreinteEtat: empreinteValeurDeterministe(etat),
      empreinteEvenements: empreinteValeurDeterministe(evenementsCumules),
      secondeFinale: etat.tempsDuConvoi.secondes,
    },
  };
}

interface PremierDesaccordDeterministe {
  readonly sequence: number | null;
  readonly dimension: "statut" | "etat" | "evenements" | "erreur" | "resultat";
  readonly attendue: string;
  readonly obtenue: string;
}

function trouverPremierDesaccordDeterministe(
  premiere: ObservationDeConduite,
  seconde: ObservationDeConduite,
): PremierDesaccordDeterministe | null {
  for (const [index, etapePremiere] of premiere.etapes.entries()) {
    const etapeSeconde = seconde.etapes[index]!;
    const dimensions = [
      ["statut", etapePremiere.statut, etapeSeconde.statut],
      ["etat", etapePremiere.empreinteEtat, etapeSeconde.empreinteEtat],
      [
        "evenements",
        etapePremiere.empreinteEvenements,
        etapeSeconde.empreinteEvenements,
      ],
      ["erreur", etapePremiere.erreur ?? "", etapeSeconde.erreur ?? ""],
    ] as const;
    const difference = dimensions.find(
      ([, attendue, obtenue]) => attendue !== obtenue,
    );
    if (difference !== undefined) {
      const [dimension, attendue, obtenue] = difference;
      return {
        sequence: etapePremiere.sequence,
        dimension,
        attendue,
        obtenue,
      };
    }
  }

  const empreintePremiere = empreinteValeurDeterministe(premiere.resultat);
  const empreinteSeconde = empreinteValeurDeterministe(seconde.resultat);
  if (empreintePremiere !== empreinteSeconde) {
    return {
      sequence: premiere.etapes.at(-1)?.sequence ?? null,
      dimension: "resultat",
      attendue: empreintePremiere,
      obtenue: empreinteSeconde,
    };
  }
  return null;
}

function verifierCausalite(etat: EtatCampagne): boolean {
  return etat.narration.faitsDeCampagne.every(
    (faitDeCampagne) =>
      faitDeCampagne.id.length > 0 &&
      faitDeCampagne.cause.length > 0 &&
      faitDeCampagne.acteurs.length > 0 &&
      faitDeCampagne.acteurs.every((acteur) => acteur.length > 0) &&
      faitDeCampagne.cible.length > 0 &&
      Number.isInteger(faitDeCampagne.moment) &&
      faitDeCampagne.moment >= 0 &&
      faitDeCampagne.moment <= etat.tempsDuConvoi.secondes,
  );
}

function verifierRecuperation(etat: EtatCampagne): boolean {
  const causesDeRecuperation = new Set(
    etat.crises.recuperations.map(({ cause }) => cause),
  );
  return (
    etat.crises.criseActive === null &&
    etat.crises.cicatrices.every(({ id }) => causesDeRecuperation.has(id)) &&
    etat.crises.recuperations.every((recuperation) => {
      if (recuperation.statut === "amorcee") {
        return recuperation.faitResultat === null;
      }
      const fait = etat.narration.faitsDeCampagne.find(
        ({ id }) => id === recuperation.faitResultat,
      );
      return (
        fait?.cause === recuperation.cause &&
        (recuperation.statut === "manquee" ||
          (recuperation.coutApplique.length > 0 &&
            recuperation.coutApplique.every(
              ({ quantite }) => Number.isFinite(quantite) && quantite > 0,
            )))
      );
    }) &&
    etat.citeCaravane.habitants > 0
  );
}

function verifierRevelationsEssentielles(
  scenarioSentinelle: ScenarioSentinelle,
  etat: EtatCampagne,
): boolean {
  const revelationsDuCatalogue = catalogueDEvenements.evenements
    .filter(({ themes }) => themes.includes("revelation-garantie"))
    .map(({ id }) => id);
  const revelationsJouees = etat.narration.evenementsJoues.filter((id) =>
    REVELATIONS_ESSENTIELLES.includes(
      id as (typeof REVELATIONS_ESSENTIELLES)[number],
    ),
  );
  const idsDesFaits = new Set(
    etat.narration.faitsDeCampagne.map(({ id }) => id),
  );
  const attentesSontResolues = scenarioSentinelle.revelationsAttendues.every(
    (id) => {
      const revelation = catalogueDEvenements.evenements.find(
        ({ id: idDuCatalogue }) => idDuCatalogue === id,
      );
      const faitsProduits =
        revelation?.choix.flatMap(({ faitsProduits }) =>
          faitsProduits.map(({ id: idDuFait }) => idDuFait),
        ) ?? [];
      return (
        revelationsJouees.includes(id) &&
        faitsProduits.length > 0 &&
        faitsProduits.some((idDuFait) => idsDesFaits.has(idDuFait))
      );
    },
  );
  return (
    JSON.stringify(revelationsDuCatalogue) ===
      JSON.stringify(REVELATIONS_ESSENTIELLES) &&
    scenarioSentinelle.revelationsAttendues.every((id) =>
      REVELATIONS_ESSENTIELLES.includes(
        id as (typeof REVELATIONS_ESSENTIELLES)[number],
      ),
    ) &&
    new Set(revelationsJouees).size === revelationsJouees.length &&
    attentesSontResolues
  );
}

function verifierNonRepetition(etat: EtatCampagne): boolean {
  return (
    new Set(etat.narration.evenementsJoues).size ===
    etat.narration.evenementsJoues.length
  );
}

function evaluerInvariants(
  scenarioSentinelle: ScenarioSentinelle,
  observation: ObservationDeConduite,
  deterministe: boolean,
): Readonly<Record<InvariantSentinelle, boolean>> {
  return {
    causalite: verifierCausalite(observation.etat),
    recuperation: verifierRecuperation(observation.etat),
    determinisme: deterministe,
    "revelations-essentielles": verifierRevelationsEssentielles(
      scenarioSentinelle,
      observation.etat,
    ),
    "non-repetition": verifierNonRepetition(observation.etat),
  };
}

function creerCapsule(
  scenarioSentinelle: ScenarioSentinelle,
  conduiteId: ConduiteSentinelle,
  sequence: number | null,
  dimension: CapsuleDeDivergenceSentinelle["premierDesaccord"]["dimension"],
  attendue: string,
  obtenue: string,
): CapsuleDeDivergenceSentinelle {
  const commandes = scenarioSentinelle.conduites[conduiteId].commandes
    .filter((etape) => sequence !== null && etape.sequence <= sequence)
    .map(({ sequence: numero, commande }) => {
      const etape = scenarioSentinelle.conduites[conduiteId].commandes[numero]!;
      return {
        sequence: numero,
        commande,
        attendu: etape.attendu,
      };
    });
  return {
    format: "lanternes-de-cendre.capsule-sentinelle",
    version: 1,
    versions: {
      scenarios: VERSION_SCENARIOS_SENTINELLES,
      simulation: VERSION_SIMULATION_COURANTE,
      contenu: VERSION_CONTENU_COURANTE,
      sauvegarde: VERSION_SAUVEGARDE_COURANTE,
      aleatoire: VERSION_ALEATOIRE_COURANTE,
      empreinte: VERSION_EMPREINTE_DETERMINISTE,
    },
    scenario: {
      id: scenarioSentinelle.id,
      version: scenarioSentinelle.version,
      conduite: conduiteId,
    },
    graine: scenarioSentinelle.graine,
    snapshot: {
      empreinte: scenarioSentinelle.empreinteSnapshot,
      etat: scenarioSentinelle.snapshot,
    },
    commandes,
    premierDesaccord: {
      sequence,
      dimension,
      attendue,
      obtenue,
    },
  };
}

function divergence(
  scenarioSentinelle: ScenarioSentinelle,
  conduiteId: ConduiteSentinelle,
  sequence: number | null,
  dimension: CapsuleDeDivergenceSentinelle["premierDesaccord"]["dimension"],
  attendue: string,
  obtenue: string,
): ResultatDeScenarioSentinelle {
  return {
    statut: "divergence",
    scenarioId: scenarioSentinelle.id,
    famille: scenarioSentinelle.famille,
    conduite: conduiteId,
    capsule: creerCapsule(
      scenarioSentinelle,
      conduiteId,
      sequence,
      dimension,
      attendue,
      obtenue,
    ),
  };
}

export function executerConduiteSentinelle(
  scenarioSentinelle: ScenarioSentinelle,
  conduiteId: ConduiteSentinelle,
): ResultatDeScenarioSentinelle {
  const empreinteSnapshot = empreinteValeurDeterministe(
    scenarioSentinelle.snapshot,
  );
  if (empreinteSnapshot !== scenarioSentinelle.empreinteSnapshot) {
    return divergence(
      scenarioSentinelle,
      conduiteId,
      null,
      "snapshot",
      scenarioSentinelle.empreinteSnapshot,
      empreinteSnapshot,
    );
  }

  const observation = observerConduite(scenarioSentinelle, conduiteId);
  const definition = scenarioSentinelle.conduites[conduiteId];
  for (const [index, attendu] of definition.commandes.entries()) {
    const obtenu = observation.etapes[index]!;
    if (obtenu.statut !== attendu.attendu.statut) {
      return divergence(
        scenarioSentinelle,
        conduiteId,
        attendu.sequence,
        "statut",
        attendu.attendu.statut,
        obtenu.statut,
      );
    }
    if (obtenu.empreinteEtat !== attendu.attendu.empreinteEtat) {
      return divergence(
        scenarioSentinelle,
        conduiteId,
        attendu.sequence,
        "etat",
        attendu.attendu.empreinteEtat,
        obtenu.empreinteEtat,
      );
    }
    if (obtenu.empreinteEvenements !== attendu.attendu.empreinteEvenements) {
      return divergence(
        scenarioSentinelle,
        conduiteId,
        attendu.sequence,
        "evenements",
        attendu.attendu.empreinteEvenements,
        obtenu.empreinteEvenements,
      );
    }
    if ((obtenu.erreur ?? "") !== (attendu.attendu.erreur ?? "")) {
      return divergence(
        scenarioSentinelle,
        conduiteId,
        attendu.sequence,
        "erreur",
        attendu.attendu.erreur ?? "",
        obtenu.erreur ?? "",
      );
    }
  }

  if (
    empreinteValeurDeterministe(observation.resultat) !==
    empreinteValeurDeterministe(definition.resultatAttendu)
  ) {
    return divergence(
      scenarioSentinelle,
      conduiteId,
      definition.commandes.at(-1)?.sequence ?? null,
      "resultat",
      empreinteValeurDeterministe(definition.resultatAttendu),
      empreinteValeurDeterministe(observation.resultat),
    );
  }

  const secondeObservation = observerConduite(scenarioSentinelle, conduiteId);
  const desaccordDeterministe = trouverPremierDesaccordDeterministe(
    observation,
    secondeObservation,
  );
  const invariants = evaluerInvariants(
    scenarioSentinelle,
    observation,
    desaccordDeterministe === null,
  );
  if (desaccordDeterministe !== null) {
    return divergence(
      scenarioSentinelle,
      conduiteId,
      desaccordDeterministe.sequence,
      desaccordDeterministe.dimension,
      desaccordDeterministe.attendue,
      desaccordDeterministe.obtenue,
    );
  }

  const invariantEnEchec = INVARIANTS_SENTINELLES.find(
    (invariant) => !invariants[invariant],
  );
  if (invariantEnEchec !== undefined) {
    return divergence(
      scenarioSentinelle,
      conduiteId,
      definition.commandes.at(-1)?.sequence ?? null,
      "invariant",
      `${invariantEnEchec}:true`,
      `${invariantEnEchec}:false`,
    );
  }

  return {
    statut: "conforme",
    scenarioId: scenarioSentinelle.id,
    famille: scenarioSentinelle.famille,
    conduite: conduiteId,
    ...observation.resultat,
    invariants: invariants as Readonly<Record<InvariantSentinelle, true>>,
  };
}

export function executerScenariosSentinelles(): readonly ResultatDeScenarioSentinelle[] {
  return obtenirScenariosSentinelles().flatMap((scenarioSentinelle) =>
    (["prudente", "risquee"] as const).map((conduiteId) =>
      executerConduiteSentinelle(scenarioSentinelle, conduiteId),
    ),
  );
}

export function capturerEtatsEtEvenementsDesScenariosSentinelles(): readonly {
  readonly scenarioId: string;
  readonly conduite: ConduiteSentinelle;
  readonly etat: EtatCampagne;
  readonly evenements: readonly EvenementDeDomaine[];
  readonly empreinteEtat: string;
  readonly empreinteEvenements: string;
}[] {
  return obtenirScenariosSentinelles().flatMap((scenarioSentinelle) =>
    (["prudente", "risquee"] as const).map((conduiteId) => {
      const observation = observerConduite(scenarioSentinelle, conduiteId);
      return {
        scenarioId: scenarioSentinelle.id,
        conduite: conduiteId,
        etat: observation.etat,
        evenements: observation.evenements,
        empreinteEtat: observation.resultat.empreinteEtat,
        empreinteEvenements: observation.resultat.empreinteEvenements,
      };
    }),
  );
}

export function observerSignaturesDesScenariosSentinelles() {
  return obtenirScenariosSentinelles().map((scenarioSentinelle) => ({
    id: scenarioSentinelle.id,
    empreinteSnapshot: empreinteValeurDeterministe(scenarioSentinelle.snapshot),
    conduites: Object.fromEntries(
      (["prudente", "risquee"] as const).map((conduiteId) => {
        const observation = observerConduite(scenarioSentinelle, conduiteId);
        return [
          conduiteId,
          {
            commandes: observation.etapes.map(
              ({ statut, empreinteEtat, empreinteEvenements, erreur }) => ({
                statut,
                empreinteEtat,
                empreinteEvenements,
                ...(erreur === undefined ? {} : { erreur }),
              }),
            ),
            resultatAttendu: observation.resultat,
          },
        ];
      }),
    ),
  }));
}
