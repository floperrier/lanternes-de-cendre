export const NOMS_D_ASSETS_PREMIUM = [
  "veille-basse-cohorte.webp",
  "veille-basse-porte.webp",
  "veille-basse-archives.webp",
  "veille-basse-maelys.webp",
  "haut-puits-vanniers.webp",
  "haut-puits-decanteur.webp",
  "haut-puits-ilyana.webp",
  "nacelles-deux-rives.webp",
  "nacelles-frein.webp",
  "nacelles-trace.webp",
  "nacelles-compagnes.webp",
  "deversoir-ligne-zero.webp",
  "deversoir-conseil.webp",
  "deversoir-chassis.webp",
  "deversoir-passage.webp",
  "trame-barriere-permis.webp",
  "trame-barriere-taxe.webp",
  "trame-piece-regulation.webp",
  "trame-eau-machines.webp",
  "trame-attelage-federe.webp",
  "trame-pompe-renseignement.webp",
  "trame-pompe-filtres.webp",
  "trame-traverse-reservoir.webp",
  "trame-traverse-galerie.webp",
  "trame-traverse-maelys.webp",
] as const;

export const LIEUX_PREMIUM = [
  {
    id: "les-vanniers",
    nom: { fr: "Les Vanniers", en: "The Basketmakers" },
  },
  {
    id: "hospice-du-sillon",
    nom: { fr: "Hospice du Sillon", en: "Sillon Hospice" },
  },
  {
    id: "relais-des-vannes",
    nom: { fr: "Relais des Vannes", en: "Sluice Relay" },
  },
  {
    id: "deversoir-noir",
    nom: { fr: "Déversoir Noir", en: "Black Spillway" },
  },
  {
    id: "lisiere-trame-de-fer",
    nom: { fr: "Lisière de la Trame de Fer", en: "Iron Weave Verge" },
  },
  {
    id: "barriere-neuve",
    nom: { fr: "Barrière-Neuve", en: "New Barrier" },
  },
  {
    id: "grand-aiguillage",
    nom: { fr: "Grand-Aiguillage", en: "Grand Junction" },
  },
  {
    id: "pompe-neuve",
    nom: { fr: "Pompe-Neuve", en: "New Pump" },
  },
  {
    id: "traverse-libre",
    nom: { fr: "Traverse-Libre", en: "Free Crossing" },
  },
] as const;

const RENSEIGNEMENT_D_APPROCHE_DU_DEVERSOIR = {
  id: "approche-du-deversoir",
  source: "nacelliers-des-vannes",
  releveA: 0,
  fiabilite: "rapporte",
  etatAnnonce: "praticable",
  meteo: "rafales-de-cendre",
  panache: "incertain",
  danger: "orniere",
  controlePolitique: "sans-controle-etabli",
  libelles: {
    fr: {
      source: "Dernier relevé transmis par les Nacelliers",
      danger: "Dalles fendues sous une cendre mobile",
      controlePolitique: "Déversoir sans contrôle établi",
    },
    en: {
      source: "Latest survey relayed by the Cable Crews",
      danger: "Cracked slabs beneath moving ash",
      controlePolitique: "Spillway under no established control",
    },
  },
} as const;

const RENSEIGNEMENT_DE_LA_LIGNE_ZERO = {
  id: "ligne-zero-passage",
  source: "techniciens-du-deversoir",
  releveA: 0,
  fiabilite: "confirme",
  etatAnnonce: "praticable",
  meteo: "cendre-basse",
  panache: "absent",
  danger: "conduit-effondrable",
  controlePolitique: "conseil-des-vannes",
  libelles: {
    fr: {
      source: "Interface relevée par les techniciens du Déversoir",
      danger: "Conduit ancien dont la fermeture condamnera l’arrière",
      controlePolitique: "Passage placé sous la décision du Conseil des Vannes",
    },
    en: {
      source: "Interface surveyed by the Spillway technicians",
      danger: "Ancient conduit whose closure will condemn the rear",
      controlePolitique: "Passage governed by the Sluice Council’s decision",
    },
  },
} as const;

const RENSEIGNEMENTS_NACELLES = [
  {
    id: "nacelles-accord-des-bassins",
    source: "nacelliers-des-vannes",
    releveA: 0,
    fiabilite: "confirme",
    etatAnnonce: "praticable",
    meteo: "cendre-basse",
    panache: "absent",
    danger: "cables-fatigues",
    controlePolitique: "accord-des-bassins",
    libelles: {
      fr: {
        source: "Nacelliers mandatés par les deux branches",
        danger: "Câbles fatigués mais contrepoids coordonnés",
        controlePolitique: "Accord des Puits Libres et des Pèlerins",
      },
      en: {
        source: "Cable crews appointed by both branches",
        danger: "Worn cables with coordinated counterweights",
        controlePolitique: "Free Wells and Ash Pilgrims agreement",
      },
    },
  },
  {
    id: "nacelles-passage-conteste",
    source: "nacelliers-des-vannes",
    releveA: 0,
    fiabilite: "rapporte",
    etatAnnonce: "degrade",
    meteo: "rafales-de-cendre",
    panache: "derive-vers-est",
    danger: "cables-fatigues",
    controlePolitique: "passage-conteste",
    libelles: {
      fr: {
        source: "Nacelliers isolés du Relais",
        danger: "Câbles fatigués sous charge non répartie",
        controlePolitique: "Passage contesté par les deux Factions",
      },
      en: {
        source: "Isolated cable crews at the Relay",
        danger: "Worn cables under an unbalanced load",
        controlePolitique: "Crossing disputed by both Factions",
      },
    },
  },
  {
    id: "nacelles-releve-de-branche",
    source: "nacelliers-des-vannes",
    releveA: 0,
    fiabilite: "rapporte",
    etatAnnonce: "praticable",
    meteo: "rafales-de-cendre",
    panache: "incertain",
    danger: "cables-fatigues",
    controlePolitique: "sans-controle-etabli",
    libelles: {
      fr: {
        source: "Relevé transmis par la branche d’approche",
        danger: "Câbles fatigués et contrepoids incomplets",
        controlePolitique: "Mandat des Nacelliers non reconnu",
      },
      en: {
        source: "Survey relayed by the approach branch",
        danger: "Worn cables and incomplete counterweights",
        controlePolitique: "Cable crews’ mandate unrecognized",
      },
    },
  },
] as const;

const LIBELLES_D_OPTIONS_DES_NACELLES = {
  fr: {
    "treuil-principal": "Appui appliqué : treuil principal sous charge contrôlée",
    "contrepoids-de-la-cohorte":
      "Appui appliqué par la Cohorte : contrepoids de charpente étanche",
    "relais-de-l-hospice":
      "Appui appliqué par l’Hospice : relais filtré de la branche basse",
    "accord-des-factions":
      "Appui appliqué par les Factions : cage commune prioritaire",
  },
  en: {
    "treuil-principal": "Applied support: main winch under controlled load",
    "contrepoids-de-la-cohorte":
      "Applied Cohort support: sealed-frame counterweight",
    "relais-de-l-hospice":
      "Applied Hospice support: filtered relay from the lower branch",
    "accord-des-factions":
      "Applied Faction support: priority shared cage",
  },
} as const;

export const TRONCONS_PREMIUM = [
  {
    id: "chemin-des-vanniers",
    extremites: ["haut-puits", "les-vanniers"],
    dureeSecondes: 420,
    etatInitial: "praticable",
    consommationConnue: {
      stock: "combustible",
      quantite: 3,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 4,
      maximum: 6,
      quantiteReelle: 5,
      unite: "litres",
      renseignementId: "vanniers-haut-puits-0",
    },
    consequenceDuHalo: {
      fr: "Le panache du Phare dérive vers l’est et atteint les Vanniers.",
      en: "The Lighthouse plume drifts east and reaches the Basketmakers.",
    },
    renseignements: [
      {
        id: "vanniers-haut-puits-0",
        tronconId: "chemin-des-vanniers",
        source: "eclaireurs-de-haut-puits",
        releveA: 0,
        fiabilite: "rapporte",
        etatAnnonce: "praticable",
        meteo: "cendre-basse",
        panache: "incertain",
        danger: "orniere",
        controlePolitique: "sans-controle-etabli",
        libelles: {
          fr: {
            source: "Éclaireurs de Haut-Puits",
            danger: "Ornières profondes",
            controlePolitique: "Sans contrôle établi",
          },
          en: {
            source: "High Well Scouts",
            danger: "Deep ruts",
            controlePolitique: "No established control",
          },
        },
      },
    ],
  },
  {
    id: "chenal-des-vannes",
    extremites: ["les-vanniers", "relais-des-vannes"],
    originesAutorisees: ["les-vanniers"],
    libellesDOptions: LIBELLES_D_OPTIONS_DES_NACELLES,
    dureeSecondes: 300,
    etatInitial: "praticable",
    consommationConnue: {
      stock: "combustible",
      quantite: 2,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 2,
      maximum: 4,
      quantiteReelle: 3,
      unite: "litres",
      renseignementId: "nacelles-releve-de-branche",
    },
    renseignements: RENSEIGNEMENTS_NACELLES.map((renseignement) => ({
      ...renseignement,
      tronconId: "chenal-des-vannes",
    })),
  },
  {
    id: "nacelles-de-veille-basse",
    extremites: ["haut-puits", "veille-basse"],
    libellesDOptions: LIBELLES_D_OPTIONS_DES_NACELLES,
    dureeSecondes: 360,
    etatInitial: "degrade",
    consommationConnue: {
      stock: "combustible",
      quantite: 6,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 6,
      maximum: 12,
      quantiteReelle: 8,
      unite: "litres",
      renseignementId: "nacelles-releve-de-branche",
    },
    renseignements: RENSEIGNEMENTS_NACELLES.map((renseignement) => ({
      ...renseignement,
      tronconId: "nacelles-de-veille-basse",
    })),
  },
  {
    id: "chemin-de-l-hospice",
    extremites: ["veille-basse", "hospice-du-sillon"],
    originesAutorisees: ["veille-basse"],
    dureeSecondes: 300,
    etatInitial: "praticable",
    consommationConnue: {
      stock: "combustible",
      quantite: 3,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 3,
      maximum: 5,
      quantiteReelle: 4,
      unite: "litres",
      renseignementId: "hospice-releve-branche-basse",
    },
    renseignements: [
      {
        ...RENSEIGNEMENT_D_APPROCHE_DU_DEVERSOIR,
        id: "hospice-releve-branche-basse",
        tronconId: "chemin-de-l-hospice",
        source: "techniciens-de-veille-basse",
        etatAnnonce: "praticable",
        libelles: {
          fr: {
            source: "Techniciens de Veille-Basse",
            danger: "Sas étroits sous une cendre filtrée",
            controlePolitique: "Relais tenu par l’Hospice du Sillon",
          },
          en: {
            source: "Lower Watch technicians",
            danger: "Narrow airlocks under filtered ash",
            controlePolitique: "Relay held by Sillon Hospice",
          },
        },
      },
    ],
  },
  {
    id: "chenal-de-l-hospice",
    extremites: ["hospice-du-sillon", "relais-des-vannes"],
    originesAutorisees: ["hospice-du-sillon"],
    dureeSecondes: 360,
    etatInitial: "degrade",
    consommationConnue: {
      stock: "combustible",
      quantite: 4,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 4,
      maximum: 7,
      quantiteReelle: 5,
      unite: "litres",
      renseignementId: "hospice-releve-aval",
    },
    renseignements: [
      {
        ...RENSEIGNEMENT_D_APPROCHE_DU_DEVERSOIR,
        id: "hospice-releve-aval",
        tronconId: "chenal-de-l-hospice",
        source: "relais-de-l-hospice",
        etatAnnonce: "degrade",
        libelles: {
          fr: {
            source: "Relais filtré de l’Hospice",
            danger: "Canal bas encombré de filtres usés",
            controlePolitique: "Passage garanti par l’Hospice",
          },
          en: {
            source: "Hospice filtered relay",
            danger: "Low canal cluttered with spent filters",
            controlePolitique: "Passage guaranteed by the Hospice",
          },
        },
      },
    ],
  },
  {
    id: "conduite-du-deversoir",
    extremites: ["relais-des-vannes", "deversoir-noir"],
    originesAutorisees: ["relais-des-vannes"],
    dureeSecondes: 360,
    etatInitial: "praticable",
    consommationConnue: {
      stock: "combustible",
      quantite: 4,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 4,
      maximum: 6,
      quantiteReelle: 5,
      unite: "litres",
      renseignementId: "approche-du-deversoir",
    },
    renseignements: [
      {
        ...RENSEIGNEMENT_D_APPROCHE_DU_DEVERSOIR,
        tronconId: "conduite-du-deversoir",
      },
    ],
  },
  {
    id: "passage-de-la-ligne-zero",
    nom: {
      fr: "Passage de la Ligne Zéro",
      en: "Zero Line Passage",
    },
    extremites: ["deversoir-noir", "lisiere-trame-de-fer"],
    originesAutorisees: ["deversoir-noir"],
    dureeSecondes: 480,
    etatInitial: "praticable",
    consommationConnue: {
      stock: "combustible",
      quantite: 4,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 4,
      maximum: 6,
      quantiteReelle: 5,
      unite: "litres",
      renseignementId: "ligne-zero-passage",
    },
    renseignements: [
      {
        ...RENSEIGNEMENT_DE_LA_LIGNE_ZERO,
        tronconId: "passage-de-la-ligne-zero",
      },
    ],
  },
  {
    id: "piste-des-levees",
    nom: {
      fr: "Piste des levées",
      en: "Embankment Track",
    },
    extremites: ["deversoir-noir", "lisiere-trame-de-fer"],
    originesAutorisees: ["deversoir-noir"],
    dureeSecondes: 540,
    etatInitial: "degrade",
    consommationConnue: {
      stock: "combustible",
      quantite: 7,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 8,
      maximum: 10,
      quantiteReelle: 9,
      unite: "litres",
      renseignementId: "levees-releve-deversoir",
    },
    renseignements: [
      {
        ...RENSEIGNEMENT_D_APPROCHE_DU_DEVERSOIR,
        id: "levees-releve-deversoir",
        tronconId: "piste-des-levees",
        source: "techniciens-du-deversoir",
        etatAnnonce: "degrade",
        libelles: {
          fr: {
            source: "Relevé de surface des techniciens du Déversoir",
            danger: "Levées instables sous la tempête de cendre",
            controlePolitique: "Passage extérieur au Conseil des Vannes",
          },
          en: {
            source: "Spillway technicians’ surface survey",
            danger: "Unstable embankments beneath the ash storm",
            controlePolitique: "Passage outside the Sluice Council",
          },
        },
      },
    ],
  },
  {
    id: "rampe-de-barriere-neuve",
    nom: {
      fr: "Rampe de Barrière-Neuve",
      en: "New Barrier Ramp",
    },
    extremites: ["lisiere-trame-de-fer", "barriere-neuve"],
    originesAutorisees: ["lisiere-trame-de-fer"],
    dureeSecondes: 420,
    etatInitial: "praticable",
    consommationConnue: {
      stock: "combustible",
      quantite: 4,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 4,
      maximum: 6,
      quantiteReelle: 5,
      unite: "litres",
      renseignementId: "barriere-neuve-controle",
    },
    renseignements: [
      {
        id: "barriere-neuve-controle",
        tronconId: "rampe-de-barriere-neuve",
        source: "douaniers-du-rail",
        releveA: 0,
        fiabilite: "confirme",
        etatAnnonce: "praticable",
        meteo: "cendre-basse",
        panache: "absent",
        danger: "controle-des-essieux",
        controlePolitique: "republique-du-rail",
        libelles: {
          fr: {
            source: "Avis officiel de Barrière-Neuve",
            danger: "Contrôle des essieux et des charges",
            controlePolitique: "Voie principale tenue par la République du Rail",
          },
          en: {
            source: "New Barrier official notice",
            danger: "Axle and load inspection",
            controlePolitique: "Main route held by the Rail Republic",
          },
        },
      },
    ],
  },
  {
    id: "voie-des-ponts-lourds",
    nom: {
      fr: "Voie des Ponts lourds",
      en: "Heavy Bridges Route",
    },
    extremites: ["barriere-neuve", "grand-aiguillage"],
    originesAutorisees: ["barriere-neuve"],
    dureeSecondes: 600,
    etatInitial: "degrade",
    consommationConnue: {
      stock: "combustible",
      quantite: 6,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 6,
      maximum: 9,
      quantiteReelle: 8,
      unite: "litres",
      renseignementId: "ponts-lourds-aiguilleurs",
    },
    renseignements: [
      {
        id: "ponts-lourds-aiguilleurs",
        tronconId: "voie-des-ponts-lourds",
        source: "aiguilleurs",
        releveA: 0,
        fiabilite: "rapporte",
        etatAnnonce: "degrade",
        meteo: "rafales-de-cendre",
        panache: "incertain",
        danger: "ponts-fatigues",
        controlePolitique: "republique-du-rail",
        libelles: {
          fr: {
            source: "Aiguilleurs de Grand-Aiguillage",
            danger: "Ponts lourds fatigués mais entretenus",
            controlePolitique: "Services et réquisitions de la République du Rail",
          },
          en: {
            source: "Grand Junction switch crews",
            danger: "Worn but maintained heavy bridges",
            controlePolitique: "Rail Republic services and requisitions",
          },
        },
      },
    ],
  },
  {
    id: "embranchement-de-pompe-neuve",
    nom: {
      fr: "Embranchement de Pompe-Neuve",
      en: "New Pump Branch",
    },
    extremites: ["lisiere-trame-de-fer", "pompe-neuve"],
    originesAutorisees: ["lisiere-trame-de-fer"],
    dureeSecondes: 510,
    etatInitial: "degrade",
    consommationConnue: {
      stock: "combustible",
      quantite: 5,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 5,
      maximum: 9,
      quantiteReelle: 7,
      unite: "litres",
      renseignementId: "pompe-neuve-balises-libres",
    },
    renseignements: [
      {
        id: "pompe-neuve-balises-libres",
        tronconId: "embranchement-de-pompe-neuve",
        source: "mecaniciens-pompe-neuve",
        releveA: 0,
        fiabilite: "rapporte",
        etatAnnonce: "degrade",
        meteo: "cendre-basse",
        panache: "incertain",
        danger: "aiguilles-sans-garde",
        controlePolitique: "puits-libres",
        libelles: {
          fr: {
            source: "Balises reprises par les mécaniciens de Pompe-Neuve",
            danger: "Aiguilles sans garde, état variable après chaque convoi",
            controlePolitique: "Embranchement autonome soutenu par les Puits Libres",
          },
          en: {
            source: "Markers restored by New Pump mechanics",
            danger: "Unattended switches, condition varies after each convoy",
            controlePolitique: "Autonomous branch supported by the Free Wells",
          },
        },
      },
    ],
  },
  {
    id: "galerie-des-reservoirs",
    nom: {
      fr: "Galerie des Réservoirs",
      en: "Reservoir Gallery",
    },
    extremites: ["pompe-neuve", "traverse-libre"],
    originesAutorisees: ["pompe-neuve"],
    dureeSecondes: 660,
    etatInitial: "degrade",
    consommationConnue: {
      stock: "combustible",
      quantite: 6,
      unite: "litres",
    },
    consommationIncertaine: {
      stock: "eau",
      minimum: 7,
      maximum: 11,
      quantiteReelle: 9,
      unite: "litres",
      renseignementId: "traverse-libre-affaissement",
    },
    renseignements: [
      {
        id: "traverse-libre-affaissement",
        tronconId: "galerie-des-reservoirs",
        source: "eclaireurs-puits-libres",
        releveA: 0,
        fiabilite: "ancien",
        etatAnnonce: "degrade",
        meteo: "rafales-de-cendre",
        panache: "incertain",
        danger: "galerie-affaissee",
        controlePolitique: "puits-libres",
        libelles: {
          fr: {
            source: "Dernier relevé partagé par les éclaireurs des Puits Libres",
            danger: "Affaissement signalé, détour coûteux encore praticable",
            controlePolitique: "Passage collectif sans garantie centralisée",
          },
          en: {
            source: "Last survey shared by Free Wells scouts",
            danger: "Reported collapse, costly detour still passable",
            controlePolitique: "Collective passage without centralized guarantee",
          },
        },
      },
    ],
  },
] as const;
