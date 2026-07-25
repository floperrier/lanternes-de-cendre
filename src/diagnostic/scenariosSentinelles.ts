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
  executerCampagneHeadless,
  STRATEGIES_D_EQUILIBRAGE,
} from "./equilibrageCampagne";
import {
  VERSION_ALEATOIRE_COURANTE,
  VERSION_EMPREINTE_DETERMINISTE,
  VERSION_SIMULATION_COURANTE,
} from "../simulation/versions";

export const VERSION_SCENARIOS_SENTINELLES = 5 as const;

export const FAMILLES_DE_SCENARIOS_SENTINELLES = [
  "debut-nominal",
  "double-tension",
  "cascade-materielle",
  "saturation-halo",
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

const CALIBRATIONS_V5: Readonly<Record<string, CalibrationDeScenario>> = {
  "debut-nominal": {
    "snapshot": "e6a66b74",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "930eaeda",
          "aff2fb9e"
        ],
        [
          "appliquee",
          "082ec56b",
          "c26287a4"
        ],
        [
          "appliquee",
          "18c05e53",
          "e0b6bb78"
        ],
        [
          "appliquee",
          "9624ddfe",
          "8149ac96"
        ],
        [
          "appliquee",
          "1e58ee7f",
          "3e258581"
        ],
        [
          "appliquee",
          "d15c7a6f",
          "ba64ef9e"
        ]
      ],
      "resultat": [
        "d15c7a6f",
        "c7894952",
        120
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "263ead8d",
          "d79c674f"
        ],
        [
          "appliquee",
          "a8d09a0b",
          "0f114506"
        ],
        [
          "appliquee",
          "36772a1c",
          "3e258581"
        ],
        [
          "appliquee",
          "22703a9a",
          "debfe5f7"
        ]
      ],
      "resultat": [
        "22703a9a",
        "d14466cc",
        120
      ]
    }
  },
  "double-tension": {
    "snapshot": "9a67aa37",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "7738bd6b",
          "a5237aae"
        ],
        [
          "appliquee",
          "f0fb7fc5",
          "f96f7e6d"
        ],
        [
          "appliquee",
          "b08a0754",
          "a7678a5a"
        ]
      ],
      "resultat": [
        "b08a0754",
        "40a813d5",
        30
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "1a6381eb",
          "b95c389e"
        ],
        [
          "appliquee",
          "28ff45d4",
          "47eb7a00"
        ],
        [
          "appliquee",
          "58f99bcb",
          "ab10e6fd"
        ]
      ],
      "resultat": [
        "58f99bcb",
        "151bbec1",
        30
      ]
    }
  },
  "cascade-materielle": {
    "snapshot": "79b58502",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "ddf41e1e",
          "35d1ef22"
        ],
        [
          "appliquee",
          "013b9172",
          "941c4c66"
        ],
        [
          "appliquee",
          "709152ca",
          "a7e2dcc4"
        ]
      ],
      "resultat": [
        "709152ca",
        "40a91e1c",
        4320
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "186a7628",
          "2071b34b"
        ],
        [
          "appliquee",
          "be10e15c",
          "941c4c66"
        ],
        [
          "appliquee",
          "7fd9e36e",
          "65c2bf38"
        ],
        [
          "appliquee",
          "c1dd3074",
          "ae3a67b6"
        ],
        [
          "appliquee",
          "2a6b34b0",
          "813281aa"
        ],
        [
          "appliquee",
          "5e46b073",
          "678db458"
        ],
        [
          "appliquee",
          "5e46b073",
          "741638a5"
        ],
        [
          "appliquee",
          "37f1294a",
          "37a546d5"
        ],
        [
          "appliquee",
          "ae9e9d8e",
          "941c4c66"
        ],
        [
          "appliquee",
          "aaceef93",
          "218f120f"
        ]
      ],
      "resultat": [
        "aaceef93",
        "0893d8e9",
        4920
      ]
    }
  },
  "saturation-halo": {
    "snapshot": "6932c2e8",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "0d3f5b86",
          "5589efbb"
        ],
        [
          "appliquee",
          "071ca482",
          "4ef53e47"
        ],
        [
          "appliquee",
          "35c5d4f6",
          "941c4c66"
        ],
        [
          "appliquee",
          "f69c20b7",
          "7620edaa"
        ]
      ],
      "resultat": [
        "f69c20b7",
        "1e076203",
        6660
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "1afaadf5",
          "4a94c229"
        ],
        [
          "appliquee",
          "e709cbcd",
          "4ef53e47"
        ],
        [
          "appliquee",
          "6559d4d9",
          "941c4c66"
        ],
        [
          "appliquee",
          "18f5587a",
          "702225bc"
        ]
      ],
      "resultat": [
        "18f5587a",
        "96aa4815",
        6660
      ]
    }
  },
  "cohorte-en-penurie": {
    "snapshot": "4082002c",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "95a21ae5",
          "dee842e9"
        ],
        [
          "appliquee",
          "d67da63b",
          "bcf0d2b0"
        ],
        [
          "appliquee",
          "48020557",
          "72cdf3de"
        ],
        [
          "appliquee",
          "03696c21",
          "8216968c"
        ],
        [
          "appliquee",
          "0658a645",
          "941c4c66"
        ],
        [
          "appliquee",
          "c9ca3533",
          "a1bde86c"
        ],
        [
          "appliquee",
          "1b325590",
          "7c97f944"
        ],
        [
          "appliquee",
          "02824009",
          "ae290aaf"
        ],
        [
          "appliquee",
          "b16dcc36",
          "cd410d13"
        ]
      ],
      "resultat": [
        "b16dcc36",
        "5cf3d785",
        1260
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "95a21ae5",
          "dee842e9"
        ],
        [
          "appliquee",
          "d67da63b",
          "bcf0d2b0"
        ],
        [
          "appliquee",
          "48020557",
          "72cdf3de"
        ],
        [
          "appliquee",
          "099e1255",
          "5fea5d92"
        ],
        [
          "appliquee",
          "7d0c9c71",
          "941c4c66"
        ],
        [
          "appliquee",
          "4d3150fa",
          "a1bde86c"
        ],
        [
          "appliquee",
          "9206ab7e",
          "edc219fa"
        ],
        [
          "appliquee",
          "05adb9bb",
          "ae290aaf"
        ],
        [
          "appliquee",
          "8b25456f",
          "62b77ccb"
        ]
      ],
      "resultat": [
        "8b25456f",
        "ca5bc225",
        1260
      ]
    }
  },
  "expeditions-simultanees": {
    "snapshot": "49f57fc3",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "5bc2576c",
          "350e6008"
        ],
        [
          "appliquee",
          "ed1141db",
          "6ba3e117"
        ]
      ],
      "resultat": [
        "ed1141db",
        "ffe03cba",
        2520
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "5bc2576c",
          "350e6008"
        ],
        [
          "appliquee",
          "9982e74c",
          "97e71c42"
        ],
        [
          "appliquee",
          "75b408f0",
          "3a41ef3c"
        ]
      ],
      "resultat": [
        "75b408f0",
        "2718450c",
        2520
      ]
    }
  },
  "compagnon-indisponible": {
    "snapshot": "ca86bcda",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "f7b74ed4",
          "d284e99e"
        ]
      ],
      "resultat": [
        "f7b74ed4",
        "d284e99e",
        0
      ]
    },
    "risquee": {
      "etapes": [
        [
          "refusee",
          "ca86bcda",
          "741638a5",
          "Ilyana Voss est indisponible."
        ]
      ],
      "resultat": [
        "ca86bcda",
        "741638a5",
        0
      ]
    }
  },
  "surcharge": {
    "snapshot": "38d8923b",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "02bf7f4e",
          "0de8de41"
        ],
        [
          "appliquee",
          "30c98891",
          "1673dac6"
        ],
        [
          "appliquee",
          "f3b06dda",
          "be402c9b"
        ],
        [
          "appliquee",
          "8fe621a7",
          "09387469"
        ],
        [
          "appliquee",
          "53f6a70f",
          "1417d5bd"
        ]
      ],
      "resultat": [
        "53f6a70f",
        "95d8b8e8",
        45
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "02bf7f4e",
          "0de8de41"
        ],
        [
          "appliquee",
          "30c98891",
          "1673dac6"
        ],
        [
          "refusee",
          "30c98891",
          "741638a5",
          "La contrainte de Charge empêche ce Chantier."
        ]
      ],
      "resultat": [
        "30c98891",
        "2f0e1c5a",
        0
      ]
    }
  },
  "route-coupee": {
    "snapshot": "0f68efa8",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "aae36bb3",
          "25d5c8de"
        ]
      ],
      "resultat": [
        "aae36bb3",
        "25d5c8de",
        0
      ]
    },
    "risquee": {
      "etapes": [
        [
          "refusee",
          "0f68efa8",
          "741638a5",
          "Le Tronçon de route « digue-des-puits » n’est plus physiquement praticable."
        ]
      ],
      "resultat": [
        "0f68efa8",
        "741638a5",
        0
      ]
    }
  },
  "abondance-exploitable": {
    "snapshot": "b7d24fa5",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "3c45ff38",
          "0de8de41"
        ],
        [
          "appliquee",
          "1d3da7f5",
          "1673dac6"
        ],
        [
          "appliquee",
          "235a09ab",
          "bca5f9de"
        ],
        [
          "appliquee",
          "85be767e",
          "09387469"
        ],
        [
          "appliquee",
          "37511ebd",
          "c5dddfda"
        ]
      ],
      "resultat": [
        "37511ebd",
        "9f9e6a2e",
        60
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "540c6d24",
          "350e6008"
        ],
        [
          "appliquee",
          "edacd330",
          "513acc4d"
        ],
        [
          "appliquee",
          "7133c96d",
          "6ceb4d77"
        ]
      ],
      "resultat": [
        "7133c96d",
        "2307eca8",
        9420
      ]
    }
  },
  "revelation-aiguillage-zero": {
    "snapshot": "64cf77a7",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "87f1b6fc",
          "467956df"
        ],
        [
          "appliquee",
          "fd9ad7c7",
          "a870ec52"
        ]
      ],
      "resultat": [
        "fd9ad7c7",
        "045e9e5c",
        3000
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "87f1b6fc",
          "467956df"
        ],
        [
          "appliquee",
          "85e12a5a",
          "f89e7fce"
        ]
      ],
      "resultat": [
        "85e12a5a",
        "6320eee0",
        3000
      ]
    }
  },
  "revelation-couronne": {
    "snapshot": "38db3922",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "51793188",
          "43e3ae52"
        ],
        [
          "appliquee",
          "39592088",
          "5f214b23"
        ]
      ],
      "resultat": [
        "39592088",
        "dd33a9cc",
        4000
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "51793188",
          "43e3ae52"
        ],
        [
          "appliquee",
          "52c6b6cd",
          "7d4bc53b"
        ]
      ],
      "resultat": [
        "52c6b6cd",
        "6bb41470",
        4000
      ]
    }
  },
  "solution-finale-ancrer": {
    "snapshot": "cc22720b",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "92804529",
          "69df907f"
        ],
        [
          "appliquee",
          "d4733196",
          "3dd45549"
        ],
        [
          "appliquee",
          "363ceb9c",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "4a3821fa",
          "9b41cbb2"
        ],
        [
          "appliquee",
          "3e456518",
          "74b3c65a"
        ],
        [
          "appliquee",
          "9c03df5c",
          "13d66448"
        ],
        [
          "appliquee",
          "643219c2",
          "1fe7740e"
        ],
        [
          "appliquee",
          "b8ec3d38",
          "4314612c"
        ]
      ],
      "resultat": [
        "b8ec3d38",
        "bed5661d",
        4200
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "92804529",
          "69df907f"
        ],
        [
          "appliquee",
          "d4733196",
          "3dd45549"
        ],
        [
          "appliquee",
          "363ceb9c",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "4a3821fa",
          "9b41cbb2"
        ],
        [
          "appliquee",
          "3e456518",
          "74b3c65a"
        ],
        [
          "appliquee",
          "9710380f",
          "39015b8e"
        ],
        [
          "appliquee",
          "d951e87d",
          "1fe7740e"
        ],
        [
          "appliquee",
          "b94fe81b",
          "71963b84"
        ]
      ],
      "resultat": [
        "b94fe81b",
        "ecf47983",
        4200
      ]
    }
  },
  "solution-finale-reaccorder": {
    "snapshot": "676fe9d5",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "913f4895",
          "69df907f"
        ],
        [
          "appliquee",
          "4d4ec7e4",
          "3dd45549"
        ],
        [
          "appliquee",
          "1e9bd85e",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "de03a262",
          "81171206"
        ],
        [
          "appliquee",
          "c00a379c",
          "e79d67c6"
        ],
        [
          "appliquee",
          "1010e1f4",
          "bf7a66fe"
        ],
        [
          "appliquee",
          "ebe6cf46",
          "1fe7740e"
        ],
        [
          "appliquee",
          "73057408",
          "4314612c"
        ]
      ],
      "resultat": [
        "73057408",
        "aca1224b",
        4200
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "913f4895",
          "69df907f"
        ],
        [
          "appliquee",
          "4d4ec7e4",
          "3dd45549"
        ],
        [
          "appliquee",
          "1e9bd85e",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "de03a262",
          "81171206"
        ],
        [
          "appliquee",
          "c00a379c",
          "e79d67c6"
        ],
        [
          "appliquee",
          "51e73d82",
          "cef11d62"
        ],
        [
          "appliquee",
          "51ef624c",
          "1fe7740e"
        ],
        [
          "appliquee",
          "1f5b4b44",
          "71963b84"
        ]
      ],
      "resultat": [
        "1f5b4b44",
        "26674e67",
        4200
      ]
    }
  },
  "solution-finale-precipiter": {
    "snapshot": "4e6a1696",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "205580d6",
          "69df907f"
        ],
        [
          "appliquee",
          "415400ab",
          "3dd45549"
        ],
        [
          "appliquee",
          "e9fb3f31",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "79784ba3",
          "8bbdb43b"
        ],
        [
          "appliquee",
          "fecdf202",
          "ee76a539"
        ],
        [
          "appliquee",
          "938a8d09",
          "4abf338b"
        ],
        [
          "appliquee",
          "261d6c13",
          "1fe7740e"
        ],
        [
          "appliquee",
          "32c80f8f",
          "4314612c"
        ]
      ],
      "resultat": [
        "32c80f8f",
        "403fd334",
        4200
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "205580d6",
          "69df907f"
        ],
        [
          "appliquee",
          "415400ab",
          "3dd45549"
        ],
        [
          "appliquee",
          "e9fb3f31",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "79784ba3",
          "8bbdb43b"
        ],
        [
          "appliquee",
          "fecdf202",
          "ee76a539"
        ],
        [
          "appliquee",
          "0eb606a8",
          "931d2144"
        ],
        [
          "appliquee",
          "a81e0546",
          "1fe7740e"
        ],
        [
          "appliquee",
          "36bf4dbe",
          "71963b84"
        ]
      ],
      "resultat": [
        "36bf4dbe",
        "54b76d85",
        4200
      ]
    }
  }
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

let snapshotDeCriseDeTrameEnCache: EtatCampagne | undefined;

function snapshotDeCriseDeTrame(): EtatCampagne {
  if (snapshotDeCriseDeTrameEnCache !== undefined) {
    return snapshotDeCriseDeTrameEnCache;
  }
  const strategie = STRATEGIES_D_EQUILIBRAGE.find(
    ({ id }) => id === "opportunisme-marchand",
  );
  if (strategie === undefined) {
    throw new Error("Stratégie sentinelle de la cascade absente.");
  }
  const graine = "EQUILIBRAGE-000000";
  const campagne = executerCampagneHeadless({
    graine,
    strategie,
    tracerEmpreintes: true,
  });
  const indexDeResolution = campagne.commandes.findIndex(
    ({ commande }) =>
      commande.type === "crise.resoudre" &&
      commande.criseId === "trame-fer.cascade-materielle",
  );
  if (indexDeResolution < 0) {
    throw new Error("La campagne sentinelle n’atteint pas la cascade matérielle.");
  }

  let etat = creerCampagneInitiale(graine);
  for (const etape of campagne.commandes.slice(0, indexDeResolution)) {
    if (etape.statut !== "appliquee") {
      throw new Error("Le préambule sentinelle contient une commande refusée.");
    }
    etat = appliquerCommande(etat, etape.commande).etat;
  }
  if (
    etat.crises.criseActive?.id !==
      "trame-fer.cascade-materielle"
  ) {
    throw new Error("Le snapshot causal de la cascade est invalide.");
  }
  snapshotDeCriseDeTrameEnCache = etat;
  return etat;
}

let snapshotDeCriseDuHaloEnCache: EtatCampagne | undefined;

function snapshotDeCriseDuHalo(): EtatCampagne {
  if (snapshotDeCriseDuHaloEnCache !== undefined) {
    return snapshotDeCriseDuHaloEnCache;
  }
  const strategie = STRATEGIES_D_EQUILIBRAGE.find(
    ({ id }) => id === "vitesse-sous-contrainte",
  );
  if (strategie === undefined) {
    throw new Error("Stratégie sentinelle du Halo absente.");
  }
  const graine = "SENTINELLE-HALO";
  const campagne = executerCampagneHeadless({
    graine,
    strategie,
    tracerEmpreintes: true,
  });
  const indexDeResolution = campagne.commandes.findIndex(
    ({ commande }) =>
      commande.type === "crise.resoudre" &&
      commande.criseId === "couronne-muette.saturation-du-halo",
  );
  if (indexDeResolution < 0) {
    throw new Error("La campagne sentinelle n’atteint pas la saturation du Halo.");
  }

  let etat = creerCampagneInitiale(graine);
  for (const etape of campagne.commandes.slice(0, indexDeResolution)) {
    if (etape.statut !== "appliquee") {
      throw new Error("Le préambule du Halo contient une commande refusée.");
    }
    etat = appliquerCommande(etat, etape.commande).etat;
  }
  if (
    etat.crises.criseActive?.id !==
      "couronne-muette.saturation-du-halo"
  ) {
    throw new Error("Le snapshot causal du Halo est invalide.");
  }
  snapshotDeCriseDuHaloEnCache = etat;
  return etat;
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
  const calibration = CALIBRATIONS_V5[definition.id];
  if (calibration === undefined) {
    throw new Error(
      `Le scénario sentinelle « ${definition.id} » n’a pas de calibration V5.`,
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
  const cascadeMaterielle = snapshotDeCriseDeTrame();
  const saturationHalo = snapshotDeCriseDuHalo();
  let cohorteEnPenurie = appliquerCommande(
    creerCampagneInitiale("SENTINELLE-V1-COHORTE-PENURIE"),
    {
      type: "incident.ordonner",
      incidentId: "purification.pompe-instable",
      ordre: "maintenir-debit",
    },
  ).etat;
  cohorteEnPenurie = appliquerCommande(cohorteEnPenurie, {
    type: "temps-du-convoi.ecouler",
    secondesReelles: 60,
  }).etat;
  for (const [evenementId, choixId] of [
    ["prologue.signaux-sous-la-cendre", "accueillir"],
    ["prologue.reponse-du-phare", "consigner-harmonique"],
    ["prologue.filtres-de-la-veille", "proteger-foyers"],
    ["prologue.ilyana-au-clapet", "confier-clapet"],
  ] as const) {
    cohorteEnPenurie = appliquerCommande(cohorteEnPenurie, {
      type: "evenement-narratif.choisir",
      evenementId,
      choixId,
    }).etat;
    if (evenementId !== "prologue.ilyana-au-clapet") {
      cohorteEnPenurie = appliquerCommande(cohorteEnPenurie, {
        type: "temps-du-convoi.ecouler",
        secondesReelles: 1,
      }).etat;
    }
  }
  for (const commande of [
    {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 117,
    },
    {
      type: "crise.declencher",
      criseId: "penurie-eau.pompe-purification",
    },
    {
      type: "crise.resoudre",
      criseId: "penurie-eau.pompe-purification",
      reponseId: "isoler-et-rationner",
    },
    {
      type: "engagement-de-route.confirmer",
      tronconId: "chaussee-de-veille-basse",
    },
    {
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    },
    {
      type: "temps-du-convoi.ecouler",
      secondesReelles: 120,
    },
  ] as const satisfies readonly CommandeCampagne[]) {
    cohorteEnPenurie = appliquerCommande(
      cohorteEnPenurie,
      commande,
    ).etat;
  }
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
              type: "crise.resoudre",
              criseId: "trame-fer.cascade-materielle",
              reponseId: "etayer-chassis",
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
              secondesReelles: 105,
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "trame-fer.cascade-materielle",
              reponseId: "detacher-plateforme",
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
              secondesReelles: 105,
            },
          },
          {
            commande: {
              type: "evenement-narratif.choisir",
              evenementId:
                "trame.marche.les-services-de-la-voie-principale",
              choixId: "acheter-coupleur-officiel",
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
              evenementId: "trame.marche.la-bascule-sans-manifeste",
              choixId: "acheter-filtres-sans-marque",
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
              type: "engagement-de-route.confirmer",
              tronconId: "traverse-des-porteurs",
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
              secondesReelles: 150,
            },
          },
        ]),
      },
    }),
    scenario({
      id: "saturation-halo",
      famille: "saturation-halo",
      graine: saturationHalo.graine,
      snapshot: saturationHalo,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "couronne-muette.saturation-du-halo",
              reponseId: "stabiliser-anneau-du-halo",
            },
          },
          {
            commande: {
              type: "engagement-de-route.confirmer",
              tronconId: "breche-de-secours-du-noeud",
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
              secondesReelles: 105,
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "couronne-muette.saturation-du-halo",
              reponseId: "condamner-couronne-exterieure",
            },
          },
          {
            commande: {
              type: "engagement-de-route.confirmer",
              tronconId: "breche-de-secours-du-noeud",
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
              secondesReelles: 105,
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
              choixId: "accueillir",
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
              type: "crise.declencher",
              criseId: "veille-basse.accueil-sous-penurie",
            },
          },
          {
            commande: {
              type: "crise.resoudre",
              criseId: "veille-basse.accueil-sous-penurie",
              reponseId: "partager-reserves-cohorte",
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
              secondesReelles: 30,
            },
          },
          {
            commande: {
              type: "crise.declencher",
              criseId: "veille-basse.accueil-sous-penurie",
            },
          },
          {
            commande: {
              type: "crise.resoudre",
              criseId: "veille-basse.accueil-sous-penurie",
              reponseId: "renforcer-accueil",
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
