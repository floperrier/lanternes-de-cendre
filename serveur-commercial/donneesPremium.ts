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
] as const;

export const LIEUX_PREMIUM = [
  {
    id: "les-vanniers",
    nom: { fr: "Les Vanniers", en: "The Basketmakers" },
  },
  {
    id: "relais-des-vannes",
    nom: { fr: "Relais des Vannes", en: "Sluice Relay" },
  },
] as const;

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
    extremites: ["veille-basse", "relais-des-vannes"],
    originesAutorisees: ["veille-basse"],
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
] as const;
