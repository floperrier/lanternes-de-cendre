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

export const VERSION_SCENARIOS_SENTINELLES = 6 as const;

export const FAMILLES_DE_SCENARIOS_SENTINELLES = [
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

const CALIBRATIONS_V6: Readonly<Record<string, CalibrationDeScenario>> = {
  "debut-nominal": {
    "snapshot": "e69fafaf",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "9310ed71",
          "aff2fb9e"
        ],
        [
          "appliquee",
          "08358130",
          "c26287a4"
        ],
        [
          "appliquee",
          "18c71a18",
          "e0b6bb78"
        ],
        [
          "appliquee",
          "96271c95",
          "8149ac96"
        ],
        [
          "appliquee",
          "1e5faa44",
          "3e258581"
        ],
        [
          "appliquee",
          "d164c934",
          "ba64ef9e"
        ]
      ],
      "resultat": [
        "d164c934",
        "c7894952",
        120
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "263c6ef6",
          "d79c674f"
        ],
        [
          "appliquee",
          "a8d8e8d0",
          "0f114506"
        ],
        [
          "appliquee",
          "366edb57",
          "3e258581"
        ],
        [
          "appliquee",
          "22727931",
          "debfe5f7"
        ]
      ],
      "resultat": [
        "22727931",
        "d14466cc",
        120
      ]
    }
  },
  "double-tension": {
    "snapshot": "9a6e65fc",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "773f7930",
          "a5237aae"
        ],
        [
          "appliquee",
          "f0f9412e",
          "f96f7e6d"
        ],
        [
          "appliquee",
          "b081b88f",
          "a7678a5a"
        ]
      ],
      "resultat": [
        "b081b88f",
        "40a813d5",
        30
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "1a6a3db0",
          "b95c389e"
        ],
        [
          "appliquee",
          "28f6f70f",
          "47eb7a00"
        ],
        [
          "appliquee",
          "59005790",
          "ab10e6fd"
        ]
      ],
      "resultat": [
        "59005790",
        "151bbec1",
        30
      ]
    }
  },
  "cascade-materielle": {
    "snapshot": "79b7c399",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "ddf65cb5",
          "35d1ef22"
        ],
        [
          "appliquee",
          "013f6309",
          "941c4c66"
        ],
        [
          "appliquee",
          "70939161",
          "a7e2dcc4"
        ]
      ],
      "resultat": [
        "70939161",
        "40a91e1c",
        4320
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "1863ba63",
          "2071b34b"
        ],
        [
          "appliquee",
          "be0a2597",
          "941c4c66"
        ],
        [
          "appliquee",
          "7fdc2205",
          "65c2bf38"
        ],
        [
          "appliquee",
          "c1d674af",
          "ae3a67b6"
        ],
        [
          "appliquee",
          "2a6478eb",
          "813281aa"
        ],
        [
          "appliquee",
          "5e4eff38",
          "678db458"
        ],
        [
          "appliquee",
          "5e4eff38",
          "741638a5"
        ],
        [
          "appliquee",
          "37f367e1",
          "37a546d5"
        ],
        [
          "appliquee",
          "aea0dc25",
          "941c4c66"
        ],
        [
          "appliquee",
          "aad73e58",
          "218f120f"
        ]
      ],
      "resultat": [
        "aad73e58",
        "0893d8e9",
        4920
      ]
    }
  },
  "saturation-halo": {
    "snapshot": "692a7423",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "0d419a1d",
          "5589efbb"
        ],
        [
          "appliquee",
          "071ee319",
          "4ef53e47"
        ],
        [
          "appliquee",
          "35c8138d",
          "941c4c66"
        ],
        [
          "appliquee",
          "f6a2dc7c",
          "7620edaa"
        ]
      ],
      "resultat": [
        "f6a2dc7c",
        "1e076203",
        6660
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "1af86f5e",
          "4a94c229"
        ],
        [
          "appliquee",
          "e7078d36",
          "4ef53e47"
        ],
        [
          "appliquee",
          "65579642",
          "941c4c66"
        ],
        [
          "appliquee",
          "18f79711",
          "702225bc"
        ]
      ],
      "resultat": [
        "18f79711",
        "96aa4815",
        6660
      ]
    }
  },
  "extinction-phare-sans-aide": {
    "snapshot": "0b32fc5f",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "bda3da39",
          "9f3b990b"
        ]
      ],
      "resultat": [
        "bda3da39",
        "9f3b990b",
        7800
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "758503c1",
          "1a700005"
        ]
      ],
      "resultat": [
        "758503c1",
        "1a700005",
        7800
      ]
    }
  },
  "extinction-phare-avec-aide": {
    "snapshot": "c10f2cb1",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "ab536184",
          "144d43e3"
        ]
      ],
      "resultat": [
        "ab536184",
        "144d43e3",
        7800
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "bbf73b17",
          "1a700005"
        ]
      ],
      "resultat": [
        "bbf73b17",
        "1a700005",
        7800
      ]
    }
  },
  "extinction-evitee-recuperation": {
    "snapshot": "b299d874",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "3e239001",
          "5589efbb"
        ]
      ],
      "resultat": [
        "3e239001",
        "5589efbb",
        6240
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "e9e59f1b",
          "4a94c229"
        ]
      ],
      "resultat": [
        "e9e59f1b",
        "4a94c229",
        6240
      ]
    }
  },
  "cohorte-en-penurie": {
    "snapshot": "407b4467",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "959fdc4e",
          "dee842e9"
        ],
        [
          "appliquee",
          "d6846200",
          "bcf0d2b0"
        ],
        [
          "appliquee",
          "480a541c",
          "72cdf3de"
        ],
        [
          "appliquee",
          "03659a8a",
          "8216968c"
        ],
        [
          "appliquee",
          "065667ae",
          "941c4c66"
        ],
        [
          "appliquee",
          "c9d0f0f8",
          "a1bde86c"
        ],
        [
          "appliquee",
          "1b2b99cb",
          "7c97f944"
        ],
        [
          "appliquee",
          "027e6e72",
          "ae290aaf"
        ],
        [
          "appliquee",
          "b1700acd",
          "cd410d13"
        ]
      ],
      "resultat": [
        "b1700acd",
        "5cf3d785",
        1260
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "959fdc4e",
          "dee842e9"
        ],
        [
          "appliquee",
          "d6846200",
          "bcf0d2b0"
        ],
        [
          "appliquee",
          "480a541c",
          "72cdf3de"
        ],
        [
          "appliquee",
          "099a40be",
          "5fea5d92"
        ],
        [
          "appliquee",
          "7d0a5dda",
          "941c4c66"
        ],
        [
          "appliquee",
          "4d338f91",
          "a1bde86c"
        ],
        [
          "appliquee",
          "9208ea15",
          "edc219fa"
        ],
        [
          "appliquee",
          "05b47580",
          "ae290aaf"
        ],
        [
          "appliquee",
          "8b2d9434",
          "62b77ccb"
        ]
      ],
      "resultat": [
        "8b2d9434",
        "ca5bc225",
        1260
      ]
    }
  },
  "expeditions-simultanees": {
    "snapshot": "49fdce88",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "5bba08a7",
          "350e6008"
        ],
        [
          "appliquee",
          "ed1990a0",
          "6ba3e117"
        ]
      ],
      "resultat": [
        "ed1990a0",
        "ffe03cba",
        2520
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "5bba08a7",
          "350e6008"
        ],
        [
          "appliquee",
          "997c2b87",
          "97e71c42"
        ],
        [
          "appliquee",
          "75abba2b",
          "3a41ef3c"
        ]
      ],
      "resultat": [
        "75abba2b",
        "2718450c",
        2520
      ]
    }
  },
  "compagnon-indisponible": {
    "snapshot": "ca88fb71",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "f7af000f",
          "d284e99e"
        ]
      ],
      "resultat": [
        "f7af000f",
        "d284e99e",
        0
      ]
    },
    "risquee": {
      "etapes": [
        [
          "refusee",
          "ca88fb71",
          "741638a5",
          "Ilyana Voss est indisponible."
        ]
      ],
      "resultat": [
        "ca88fb71",
        "741638a5",
        0
      ]
    }
  },
  "surcharge": {
    "snapshot": "38df4e00",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "02c1bde5",
          "0de8de41"
        ],
        [
          "appliquee",
          "30c749fa",
          "1673dac6"
        ],
        [
          "appliquee",
          "f3b2ac71",
          "be402c9b"
        ],
        [
          "appliquee",
          "8fee706c",
          "09387469"
        ],
        [
          "appliquee",
          "53fef5d4",
          "1417d5bd"
        ]
      ],
      "resultat": [
        "53fef5d4",
        "95d8b8e8",
        45
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "02c1bde5",
          "0de8de41"
        ],
        [
          "appliquee",
          "30c749fa",
          "1673dac6"
        ],
        [
          "refusee",
          "30c749fa",
          "741638a5",
          "La contrainte de Charge empêche ce Chantier."
        ]
      ],
      "resultat": [
        "30c749fa",
        "2f0e1c5a",
        0
      ]
    }
  },
  "route-coupee": {
    "snapshot": "0f6233e3",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "aaea2778",
          "25d5c8de"
        ]
      ],
      "resultat": [
        "aaea2778",
        "25d5c8de",
        0
      ]
    },
    "risquee": {
      "etapes": [
        [
          "refusee",
          "0f6233e3",
          "741638a5",
          "Le Tronçon de route « digue-des-puits » n’est plus physiquement praticable."
        ]
      ],
      "resultat": [
        "0f6233e3",
        "741638a5",
        0
      ]
    }
  },
  "abondance-exploitable": {
    "snapshot": "b7d0110e",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "3c3db073",
          "0de8de41"
        ],
        [
          "appliquee",
          "1d3b695e",
          "1673dac6"
        ],
        [
          "appliquee",
          "23625870",
          "bca5f9de"
        ],
        [
          "appliquee",
          "85c0b515",
          "09387469"
        ],
        [
          "appliquee",
          "374d4d26",
          "c5dddfda"
        ]
      ],
      "resultat": [
        "374d4d26",
        "9f9e6a2e",
        60
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "54041e5f",
          "350e6008"
        ],
        [
          "appliquee",
          "eda6176b",
          "513acc4d"
        ],
        [
          "appliquee",
          "712ff7d6",
          "6ceb4d77"
        ]
      ],
      "resultat": [
        "712ff7d6",
        "2307eca8",
        9420
      ]
    }
  },
  "revelation-aiguillage-zero": {
    "snapshot": "64d7c66c",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "87eafb37",
          "467956df"
        ],
        [
          "appliquee",
          "fda1938c",
          "a870ec52"
        ]
      ],
      "resultat": [
        "fda1938c",
        "045e9e5c",
        3000
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "87eafb37",
          "467956df"
        ],
        [
          "appliquee",
          "85e368f1",
          "f89e7fce"
        ]
      ],
      "resultat": [
        "85e368f1",
        "6320eee0",
        3000
      ]
    }
  },
  "revelation-couronne": {
    "snapshot": "38dd77b9",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "5170e2c3",
          "43e3ae52"
        ],
        [
          "appliquee",
          "3950d1c3",
          "5f214b23"
        ]
      ],
      "resultat": [
        "3950d1c3",
        "dd33a9cc",
        4000
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "5170e2c3",
          "43e3ae52"
        ],
        [
          "appliquee",
          "52c47836",
          "7d4bc53b"
        ]
      ],
      "resultat": [
        "52c47836",
        "6bb41470",
        4000
      ]
    }
  },
  "solution-finale-ancrer": {
    "snapshot": "cc2ac0d0",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "927e0692",
          "69df907f"
        ],
        [
          "appliquee",
          "d475702d",
          "3dd45549"
        ],
        [
          "appliquee",
          "36349cd7",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "4a3a6091",
          "9b41cbb2"
        ],
        [
          "appliquee",
          "3e3ea953",
          "74b3c65a"
        ],
        [
          "appliquee",
          "9bfd2397",
          "13d66448"
        ],
        [
          "appliquee",
          "64345859",
          "1fe7740e"
        ],
        [
          "appliquee",
          "b8e3ee73",
          "4314612c"
        ]
      ],
      "resultat": [
        "b8e3ee73",
        "bed5661d",
        4200
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "927e0692",
          "69df907f"
        ],
        [
          "appliquee",
          "d475702d",
          "3dd45549"
        ],
        [
          "appliquee",
          "36349cd7",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "4a3a6091",
          "9b41cbb2"
        ],
        [
          "appliquee",
          "3e3ea953",
          "74b3c65a"
        ],
        [
          "appliquee",
          "971886d4",
          "39015b8e"
        ],
        [
          "appliquee",
          "d94fa9e6",
          "1fe7740e"
        ],
        [
          "appliquee",
          "b956a3e0",
          "71963b84"
        ]
      ],
      "resultat": [
        "b956a3e0",
        "ecf47983",
        4200
      ]
    }
  },
  "solution-finale-reaccorder": {
    "snapshot": "676c183e",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "913d09fe",
          "69df907f"
        ],
        [
          "appliquee",
          "4d480c1f",
          "3dd45549"
        ],
        [
          "appliquee",
          "1e9e16f5",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "de05e0f9",
          "81171206"
        ],
        [
          "appliquee",
          "c001e8d7",
          "e79d67c6"
        ],
        [
          "appliquee",
          "100a262f",
          "bf7a66fe"
        ],
        [
          "appliquee",
          "ebe90ddd",
          "1fe7740e"
        ],
        [
          "appliquee",
          "72fd2543",
          "4314612c"
        ]
      ],
      "resultat": [
        "72fd2543",
        "aca1224b",
        4200
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "913d09fe",
          "69df907f"
        ],
        [
          "appliquee",
          "4d480c1f",
          "3dd45549"
        ],
        [
          "appliquee",
          "1e9e16f5",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "de05e0f9",
          "81171206"
        ],
        [
          "appliquee",
          "c001e8d7",
          "e79d67c6"
        ],
        [
          "appliquee",
          "51e97c19",
          "cef11d62"
        ],
        [
          "appliquee",
          "51e8a687",
          "1fe7740e"
        ],
        [
          "appliquee",
          "1f548f7f",
          "71963b84"
        ]
      ],
      "resultat": [
        "1f548f7f",
        "26674e67",
        4200
      ]
    }
  },
  "solution-finale-precipiter": {
    "snapshot": "4e6c552d",
    "prudente": {
      "etapes": [
        [
          "appliquee",
          "2059526d",
          "69df907f"
        ],
        [
          "appliquee",
          "415c4f70",
          "3dd45549"
        ],
        [
          "appliquee",
          "e9f9009a",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "79809a68",
          "8bbdb43b"
        ],
        [
          "appliquee",
          "fed03099",
          "ee76a539"
        ],
        [
          "appliquee",
          "9386bb72",
          "4abf338b"
        ],
        [
          "appliquee",
          "2625bad8",
          "1fe7740e"
        ],
        [
          "appliquee",
          "32d05e54",
          "4314612c"
        ]
      ],
      "resultat": [
        "32d05e54",
        "403fd334",
        4200
      ]
    },
    "risquee": {
      "etapes": [
        [
          "appliquee",
          "2059526d",
          "69df907f"
        ],
        [
          "appliquee",
          "415c4f70",
          "3dd45549"
        ],
        [
          "appliquee",
          "e9f9009a",
          "4cb0cde2"
        ],
        [
          "appliquee",
          "79809a68",
          "8bbdb43b"
        ],
        [
          "appliquee",
          "fed03099",
          "ee76a539"
        ],
        [
          "appliquee",
          "0eaf4ae3",
          "931d2144"
        ],
        [
          "appliquee",
          "a82043dd",
          "1fe7740e"
        ],
        [
          "appliquee",
          "36c31f55",
          "71963b84"
        ]
      ],
      "resultat": [
        "36c31f55",
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

let snapshotDExtinctionDuPhareEnCache: EtatCampagne | undefined;
let snapshotDExtinctionDuPhareAvecAideEnCache:
  | EtatCampagne
  | undefined;

function snapshotDExtinctionDuPhare(
  aidePreparee = false,
): EtatCampagne {
  const snapshotEnCache = aidePreparee
    ? snapshotDExtinctionDuPhareAvecAideEnCache
    : snapshotDExtinctionDuPhareEnCache;
  if (snapshotEnCache !== undefined) {
    return snapshotEnCache;
  }
  const strategie = STRATEGIES_D_EQUILIBRAGE.find(
    ({ id }) => id === "opportunisme-marchand",
  );
  if (strategie === undefined) {
    throw new Error("Stratégie sentinelle de l’Extinction absente.");
  }
  const graine = "EQUILIBRAGE-000000";
  const campagneSansAide = executerCampagneHeadless({
    graine,
    strategie,
    tracerEmpreintes: true,
  });
  const campagne = aidePreparee
    ? executerCampagneHeadless({
        graine,
        strategie,
        tracerEmpreintes: true,
        commandesImposees: campagneSansAide.commandes.map(
          ({ commande, statut }) => {
            if (statut !== "appliquee") {
              throw new Error(
                "Le journal source de l’Extinction contient une commande refusée.",
              );
            }
            return commande.type === "evenement-narratif.choisir" &&
              commande.evenementId ===
                "trame.aiguillage-zero.le-conseil-des-voies"
              ? { ...commande, choixId: "etablir-charte" }
              : commande;
          },
        ),
      })
    : campagneSansAide;
  const indexDeResolution = campagne.commandes.findIndex(
    ({ commande }) =>
      commande.type === "crise.resoudre" &&
      commande.criseId === "extinction-du-phare",
  );
  if (indexDeResolution < 0) {
    throw new Error("La campagne sentinelle n’atteint pas l’Extinction du Phare.");
  }

  let etat = creerCampagneInitiale(graine);
  for (const etape of campagne.commandes.slice(0, indexDeResolution)) {
    if (etape.statut !== "appliquee") {
      throw new Error("Le préambule de l’Extinction contient une commande refusée.");
    }
    etat = appliquerCommande(etat, etape.commande).etat;
  }
  if (etat.crises.criseActive?.id !== "extinction-du-phare") {
    throw new Error("Le snapshot causal de l’Extinction est invalide.");
  }
  if (aidePreparee) {
    const charte = etat.narration.faitsDeCampagne.find(
      ({ id }) => id === "trame.aiguillage-zero.charte-partagee",
    );
    const extinction = etat.narration.faitsDeCampagne.find(
      ({ id }) => id === "crise.extinction-du-phare",
    );
    if (
      charte === undefined ||
      extinction === undefined ||
      charte.moment >= extinction.moment
    ) {
      throw new Error(
        "Le snapshot de l’Extinction ne conserve pas l’aide préparée antérieure.",
      );
    }
    snapshotDExtinctionDuPhareAvecAideEnCache = etat;
  } else {
    snapshotDExtinctionDuPhareEnCache = etat;
  }
  return etat;
}

let snapshotDExtinctionEviteeEnCache: EtatCampagne | undefined;

function snapshotDExtinctionEvitee(): EtatCampagne {
  if (snapshotDExtinctionEviteeEnCache !== undefined) {
    return snapshotDExtinctionEviteeEnCache;
  }
  const strategie = STRATEGIES_D_EQUILIBRAGE.find(
    ({ id }) => id === "vitesse-sous-contrainte",
  );
  if (strategie === undefined) {
    throw new Error("Stratégie sentinelle d’évitement de l’Extinction absente.");
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
      commande.criseId === "couronne-muette.saturation-du-halo",
  );
  if (indexDeResolution < 0) {
    throw new Error("La campagne sentinelle n’évite pas l’Extinction.");
  }

  let etat = creerCampagneInitiale(graine);
  for (const etape of campagne.commandes.slice(0, indexDeResolution)) {
    if (etape.statut !== "appliquee") {
      throw new Error("Le préambule d’évitement contient une commande refusée.");
    }
    etat = appliquerCommande(etat, etape.commande).etat;
  }
  if (
    etat.crises.criseActive?.id !== "couronne-muette.saturation-du-halo" ||
    !etat.crises.recuperations.some(({ statut }) => statut === "accomplie")
  ) {
    throw new Error("Le snapshot d’évitement par Récupération est invalide.");
  }
  snapshotDExtinctionEviteeEnCache = etat;
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
  const calibration = CALIBRATIONS_V6[definition.id];
  if (calibration === undefined) {
    throw new Error(
      `Le scénario sentinelle « ${definition.id} » n’a pas de calibration V6.`,
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
  const extinctionSansAide = snapshotDExtinctionDuPhare();
  const extinctionAvecAide = snapshotDExtinctionDuPhare(true);
  const extinctionEvitee = snapshotDExtinctionEvitee();
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
      id: "extinction-phare-sans-aide",
      famille: "extinction-phare",
      graine: extinctionSansAide.graine,
      snapshot: extinctionSansAide,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "extinction-du-phare",
              reponseId: "evacuer-le-coeur",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "extinction-du-phare",
              reponseId: "transmettre-sous-le-halo",
            },
          },
        ]),
      },
    }),
    scenario({
      id: "extinction-phare-avec-aide",
      famille: "extinction-phare",
      graine: extinctionAvecAide.graine,
      snapshot: extinctionAvecAide,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "extinction-du-phare",
              reponseId: "solliciter-aide-exterieure",
            },
          },
        ]),
        risquee: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "extinction-du-phare",
              reponseId: "transmettre-sous-le-halo",
            },
          },
        ]),
      },
    }),
    scenario({
      id: "extinction-evitee-recuperation",
      famille: "extinction-phare",
      graine: extinctionEvitee.graine,
      snapshot: extinctionEvitee,
      conduites: {
        prudente: conduite([
          {
            commande: {
              type: "crise.resoudre",
              criseId: "couronne-muette.saturation-du-halo",
              reponseId: "stabiliser-anneau-du-halo",
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
