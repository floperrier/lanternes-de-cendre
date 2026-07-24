export const COMPETENCES_DE_COMPAGNON = [
  "technique",
  "intendance",
  "soin",
  "terrain",
  "diplomatie",
] as const;

export type CompetenceDeCompagnon =
  (typeof COMPETENCES_DE_COMPAGNON)[number];

export const IDENTIFIANTS_DU_VIVIER = [
  "ilyana-voss",
  "maelys-rive",
  "sira-vel",
  "bastien-roux",
  "noor-selan",
  "elian-morne",
  "ava-cendre",
  "tomas-rail",
  "nadia-silex",
  "ysee-orbe",
] as const;

export type IdentifiantDeCompagnon =
  (typeof IDENTIFIANTS_DU_VIVIER)[number];

export interface ProfilDeCompagnon {
  readonly id: IdentifiantDeCompagnon;
  readonly competences: {
    readonly majeure: CompetenceDeCompagnon;
    readonly secondaire: CompetenceDeCompagnon;
  };
  readonly trait: {
    readonly id: string;
    readonly avantageConditionnel: string;
    readonly angleMort: string;
  };
  readonly conviction: {
    readonly id: string;
    readonly sujets: readonly string[];
    readonly preference: string;
    readonly ligneRouge: string;
  };
  readonly projet: string;
  readonly etatPersonnel: {
    readonly id: string;
    readonly contrainte: string;
    readonly voieDeSoin: string;
  };
  readonly pivotPersonnel: {
    readonly id: string;
    readonly faitsDeclencheurs: readonly string[];
  };
}

export const VIVIER_DE_COMPAGNONS = [
  {
    id: "ilyana-voss",
    competences: {
      majeure: "intendance",
      secondaire: "diplomatie",
    },
    trait: {
      id: "minutieuse-intransigeante",
      avantageConditionnel: "detecte-les-ecarts-de-jauge",
      angleMort: "refuse-un-compromis-sans-comptes-verifiables",
    },
    conviction: {
      id: "eau-sure-pour-tous",
      sujets: ["eau", "filtres", "reserves"],
      preference: "partage-mesure-et-verifiable",
      ligneRouge: "exposer-sciemment-des-habitants-a-l-eau-contaminee",
    },
    projet: "circuit-de-purification-redondant",
    etatPersonnel: {
      id: "brulures-de-cendre-stabilisees",
      contrainte: "eviter-eau-contaminee",
      voieDeSoin: "filtres-et-repos-en-halo",
    },
    pivotPersonnel: {
      id: "la-vanne-et-le-registre",
      faitsDeclencheurs: [
        "bassins.haut-puits.ilyana-garante",
        "bassins.haut-puits.ilyana-contredite",
      ],
    },
  },
  {
    id: "maelys-rive",
    competences: {
      majeure: "terrain",
      secondaire: "technique",
    },
    trait: {
      id: "audacieuse-impatiente",
      avantageConditionnel: "ouvre-un-itineraire-avant-qu-il-ne-se-ferme",
      angleMort: "abrege-les-verifications-quand-le-delai-se-resserre",
    },
    conviction: {
      id: "aucun-releve-ne-vaut-une-vie",
      sujets: ["releves", "expeditions", "refuges"],
      preference: "repli-avant-preuve-complete",
      ligneRouge: "maintenir-une-equipe-pour-sauver-des-donnees",
    },
    projet: "atlas-des-abris-transmissible",
    etatPersonnel: {
      id: "souffle-court-des-filtres",
      contrainte: "limiter-les-releves-sans-halo",
      voieDeSoin: "repos-et-cartouches-neuves",
    },
    pivotPersonnel: {
      id: "le-coffret-et-l-hospice",
      faitsDeclencheurs: [
        "veille-basse.maelys-mission-confiee",
        "veille-basse.maelys-equipes-prioritaires",
      ],
    },
  },
  {
    id: "sira-vel",
    competences: {
      majeure: "soin",
      secondaire: "intendance",
    },
    trait: {
      id: "douce-inflexible",
      avantageConditionnel: "stabilise-les-soins-sous-pression",
      angleMort: "refuse-de-prioriser-la-production-sur-un-soin-urgent",
    },
    conviction: {
      id: "les-malades-restent-des-citoyens",
      sujets: ["soin", "cohortes", "abris"],
      preference: "accueil-sans-perte-de-voix",
      ligneRouge: "exclure-les-malades-d-une-decision-collective",
    },
    projet: "infirmerie-de-halte-partagee",
    etatPersonnel: {
      id: "tremblement-de-fatigue",
      contrainte: "eviter-les-gardes-prolongees",
      voieDeSoin: "relais-de-soin-et-sommeil-protege",
    },
    pivotPersonnel: {
      id: "les-lits-du-sillon",
      faitsDeclencheurs: [
        "veille-basse.hospice-ouvert",
        "veille-basse.intervention-refusee",
      ],
    },
  },
  {
    id: "bastien-roux",
    competences: {
      majeure: "technique",
      secondaire: "terrain",
    },
    trait: {
      id: "inventif-temeraire",
      avantageConditionnel: "improvise-avec-des-pieces-incompatibles",
      angleMort: "sous-estime-la-charge-d-un-prototype",
    },
    conviction: {
      id: "une-machine-doit-rester-reparable",
      sujets: ["atelier", "traction", "maintenance"],
      preference: "plans-ouverts-et-pieces-locales",
      ligneRouge: "sceller-une-machine-sous-monopole",
    },
    projet: "attelage-sans-piece-proprietaire",
    etatPersonnel: {
      id: "main-gauche-enraidie",
      contrainte: "ne-pas-travailler-seul-sous-charge",
      voieDeSoin: "attelle-et-gestes-delegues",
    },
    pivotPersonnel: {
      id: "la-piece-sans-serie",
      faitsDeclencheurs: [
        "trame.grand-aiguillage.reparation-locale-ouverte",
        "trame.grand-aiguillage.train-outil-annonce",
      ],
    },
  },
  {
    id: "noor-selan",
    competences: {
      majeure: "diplomatie",
      secondaire: "soin",
    },
    trait: {
      id: "lucide-secrete",
      avantageConditionnel: "repere-les-contradictions-d-un-temoignage",
      angleMort: "retarde-le-partage-d-une-preuve-fragile",
    },
    conviction: {
      id: "une-preuve-doit-pouvoir-changer-de-main",
      sujets: ["archives", "traces", "diplomatie"],
      preference: "copies-attribuables-et-gardes-multiples",
      ligneRouge: "detruire-la-seule-preuve-d-une-dette",
    },
    projet: "registre-public-des-dettes",
    etatPersonnel: {
      id: "acouphenes-de-signal",
      contrainte: "eviter-les-interfaces-en-charge",
      voieDeSoin: "silence-filtre-et-releve-ecrit",
    },
    pivotPersonnel: {
      id: "le-manifeste-sous-scelles",
      faitsDeclencheurs: [
        "trame.traverse-libre.manifeste-public",
        "trame.traverse-libre.registre-scelle",
      ],
    },
  },
  {
    id: "elian-morne",
    competences: {
      majeure: "terrain",
      secondaire: "diplomatie",
    },
    trait: {
      id: "patient-fataliste",
      avantageConditionnel: "maintient-un-repli-lisible-dans-la-cendre",
      angleMort: "renonce-trop-vite-a-rouvrir-un-passage",
    },
    conviction: {
      id: "toute-route-fermee-doit-etre-nommee",
      sujets: ["routes", "balises", "expeditions"],
      preference: "consigner-les-fermetures-et-les-detours",
      ligneRouge: "envoyer-une-equipe-sur-un-passage-non-balise",
    },
    projet: "balises-de-repli-entre-colonies",
    etatPersonnel: {
      id: "genou-des-galeries",
      contrainte: "eviter-les-descentes-sans-cable",
      voieDeSoin: "orthese-et-parcours-balise",
    },
    pivotPersonnel: {
      id: "la-galerie-qui-cede",
      faitsDeclencheurs: [
        "trame.traverse-libre.galerie-etayee",
        "trame.traverse-libre.contournement-ouvert",
      ],
    },
  },
  {
    id: "ava-cendre",
    competences: {
      majeure: "soin",
      secondaire: "technique",
    },
    trait: {
      id: "calme-obstinee",
      avantageConditionnel: "tient-un-protocole-en-zone-contaminee",
      angleMort: "prolonge-un-releve-pour-nommer-toutes-les-expositions",
    },
    conviction: {
      id: "la-cendre-doit-etre-comptee-avec-ses-victimes",
      sujets: ["cendre", "sante", "bassins"],
      preference: "mesurer-les-depots-et-nommer-les-exposes",
      ligneRouge: "deplacer-la-cendre-sans-registre-des-victimes",
    },
    projet: "registre-des-expositions",
    etatPersonnel: {
      id: "peau-sensible-aux-depots",
      contrainte: "eviter-les-bassins-non-confines",
      voieDeSoin: "sas-humide-et-protection-complete",
    },
    pivotPersonnel: {
      id: "les-boues-du-decanteur",
      faitsDeclencheurs: [
        "bassins.haut-puits.panache-confine",
        "bassins.haut-puits.panache-derive",
      ],
    },
  },
  {
    id: "tomas-rail",
    competences: {
      majeure: "technique",
      secondaire: "intendance",
    },
    trait: {
      id: "methodique-rigide",
      avantageConditionnel: "reproduit-une-maintenance-sans-ecart",
      angleMort: "ecarte-une-solution-non-documentee",
    },
    conviction: {
      id: "aucun-reseau-sans-droit-de-maintenance",
      sujets: ["reseau", "interfaces", "ateliers"],
      preference: "manuel-commun-et-acces-aux-pieces",
      ligneRouge: "ceder-le-reseau-sans-droit-d-entretien",
    },
    projet: "manuel-commun-de-la-ligne-zero",
    etatPersonnel: {
      id: "vision-nocturne-reduite",
      contrainte: "ne-pas-inspecter-seul-en-obscurite",
      voieDeSoin: "optique-claire-et-binome",
    },
    pivotPersonnel: {
      id: "l-interface-aux-deux-frequences",
      faitsDeclencheurs: [
        "trame.signal-zero.interface-rail-lue",
        "trame.signal-zero.interface-libre-lue",
      ],
    },
  },
  {
    id: "nadia-silex",
    competences: {
      majeure: "diplomatie",
      secondaire: "terrain",
    },
    trait: {
      id: "franche-provocatrice",
      avantageConditionnel: "force-les-mandats-implicites-a-se-declarer",
      angleMort: "durcit-une-negociation-encore-reversible",
    },
    conviction: {
      id: "un-passage-n-est-libre-que-sans-tutelle",
      sujets: ["routes", "factions", "chartes"],
      preference: "droits-de-passage-reciproques",
      ligneRouge: "accepter-une-tutelle-sans-droit-de-sortie",
    },
    projet: "charte-des-routes-autonomes",
    etatPersonnel: {
      id: "cote-mal-ressoudee",
      contrainte: "eviter-les-chocs-de-traversee",
      voieDeSoin: "harnais-et-allure-reguliere",
    },
    pivotPersonnel: {
      id: "le-conseil-des-voies",
      faitsDeclencheurs: [
        "trame.aiguillage-zero.charte-partagee",
        "trame.aiguillage-zero.monopole-republicain",
      ],
    },
  },
  {
    id: "ysee-orbe",
    competences: {
      majeure: "intendance",
      secondaire: "soin",
    },
    trait: {
      id: "prevoyante-possessive",
      avantageConditionnel: "anticipe-une-rupture-de-stock",
      angleMort: "retient-une-reserve-au-dela-du-besoin-annonce",
    },
    conviction: {
      id: "les-reserves-doivent-avoir-des-gardiens-comptables",
      sujets: ["reserves", "marches", "cohortes"],
      preference: "gardes-nommees-et-comptes-reciproques",
      ligneRouge: "distribuer-une-reserve-sans-trace-ni-responsable",
    },
    projet: "greniers-de-secours-reciproques",
    etatPersonnel: {
      id: "toux-de-citerne",
      contrainte: "eviter-les-poussieres-de-stockage",
      voieDeSoin: "masque-fin-et-rotation-des-postes",
    },
    pivotPersonnel: {
      id: "le-marche-des-abris",
      faitsDeclencheurs: [
        "couronne.seuil.marche-rationne",
        "couronne.seuil.dernieres-pieces-achetees",
      ],
    },
  },
] as const satisfies readonly ProfilDeCompagnon[];

export interface LienDuVivier {
  readonly id: string;
  readonly compagnons: readonly [
    IdentifiantDeCompagnon,
    IdentifiantDeCompagnon,
  ];
  readonly etats: readonly string[];
  readonly transitions: readonly {
    readonly de: string;
    readonly vers: string;
    readonly faitsDeclencheurs: readonly string[];
  }[];
}

export const LIENS_DU_VIVIER = [
  {
    id: "registre-et-releve",
    compagnons: ["ilyana-voss", "maelys-rive"],
    etats: ["inconnu", "releve-partage", "depot-commun"],
    transitions: [
      {
        de: "inconnu",
        vers: "releve-partage",
        faitsDeclencheurs: ["veille-basse.maelys-mission-confiee"],
      },
      {
        de: "releve-partage",
        vers: "depot-commun",
        faitsDeclencheurs: [
          "couronne.seuil.registre-commun",
          "couronne.ouverture.clef-collective",
        ],
      },
    ],
  },
  {
    id: "soin-des-eclaireuses",
    compagnons: ["maelys-rive", "sira-vel"],
    etats: ["inconnu", "souffle-protege"],
    transitions: [
      {
        de: "inconnu",
        vers: "souffle-protege",
        faitsDeclencheurs: ["veille-basse.hospice-ouvert"],
      },
    ],
  },
  {
    id: "attelle-et-attelage",
    compagnons: ["sira-vel", "bastien-roux"],
    etats: ["inconnu", "gestes-delegues"],
    transitions: [
      {
        de: "inconnu",
        vers: "gestes-delegues",
        faitsDeclencheurs: ["trame.grand-aiguillage.attelage-federe-annonce"],
      },
    ],
  },
  {
    id: "preuve-reparable",
    compagnons: ["bastien-roux", "noor-selan"],
    etats: ["inconnu", "preuve-ouverte", "preuve-sous-garde"],
    transitions: [
      {
        de: "inconnu",
        vers: "preuve-ouverte",
        faitsDeclencheurs: ["trame.traverse-libre.manifeste-public"],
      },
      {
        de: "preuve-ouverte",
        vers: "preuve-sous-garde",
        faitsDeclencheurs: ["couronne.seuil.releves-recopies"],
      },
    ],
  },
  {
    id: "parole-et-balise",
    compagnons: ["noor-selan", "elian-morne"],
    etats: ["inconnu", "routes-nommees"],
    transitions: [
      {
        de: "inconnu",
        vers: "routes-nommees",
        faitsDeclencheurs: ["trame.aiguillage-zero.passage-consigne"],
      },
    ],
  },
  {
    id: "balises-des-exposes",
    compagnons: ["elian-morne", "ava-cendre"],
    etats: ["inconnu", "depots-balises"],
    transitions: [
      {
        de: "inconnu",
        vers: "depots-balises",
        faitsDeclencheurs: ["bassins.haut-puits.panache-confine"],
      },
    ],
  },
  {
    id: "registre-de-maintenance",
    compagnons: ["ava-cendre", "tomas-rail"],
    etats: ["inconnu", "expositions-consignees"],
    transitions: [
      {
        de: "inconnu",
        vers: "expositions-consignees",
        faitsDeclencheurs: ["trame.signal-zero.trace-sous-scelles"],
      },
    ],
  },
  {
    id: "manuel-des-routes",
    compagnons: ["tomas-rail", "nadia-silex"],
    etats: ["inconnu", "maintenance-partagee"],
    transitions: [
      {
        de: "inconnu",
        vers: "maintenance-partagee",
        faitsDeclencheurs: ["trame.aiguillage-zero.charte-partagee"],
      },
    ],
  },
  {
    id: "charte-des-reserves",
    compagnons: ["nadia-silex", "ysee-orbe"],
    etats: ["inconnu", "greniers-sans-tutelle"],
    transitions: [
      {
        de: "inconnu",
        vers: "greniers-sans-tutelle",
        faitsDeclencheurs: ["couronne.colonies.voie-alliee-preparee"],
      },
    ],
  },
  {
    id: "comptes-de-l-eau",
    compagnons: ["ysee-orbe", "ilyana-voss"],
    etats: ["inconnu", "reserves-verifiables"],
    transitions: [
      {
        de: "inconnu",
        vers: "reserves-verifiables",
        faitsDeclencheurs: ["bassins.conseil.reserves-partagees"],
      },
    ],
  },
] as const satisfies readonly LienDuVivier[];

export const PARCOURS_DE_RECRUTEMENT = [
  {
    id: "eau-partagee",
    compagnons: [
      "ilyana-voss",
      "maelys-rive",
      "noor-selan",
      "tomas-rail",
    ],
  },
  {
    id: "soins-et-ateliers",
    compagnons: [
      "sira-vel",
      "bastien-roux",
      "ava-cendre",
      "nadia-silex",
    ],
  },
  {
    id: "routes-libres",
    compagnons: [
      "noor-selan",
      "elian-morne",
      "ysee-orbe",
      "ilyana-voss",
    ],
  },
  {
    id: "maintenance-partagee",
    compagnons: [
      "ava-cendre",
      "tomas-rail",
      "maelys-rive",
      "sira-vel",
    ],
  },
  {
    id: "chartes-de-la-couronne",
    compagnons: [
      "nadia-silex",
      "ysee-orbe",
      "bastien-roux",
      "noor-selan",
    ],
  },
] as const satisfies readonly {
  readonly id: string;
  readonly compagnons: readonly IdentifiantDeCompagnon[];
}[];
