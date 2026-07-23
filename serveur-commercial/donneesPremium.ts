export const NOMS_D_ASSETS_PREMIUM = [
  "veille-basse-cohorte.webp",
  "veille-basse-porte.webp",
  "veille-basse-archives.webp",
  "veille-basse-maelys.webp",
  "haut-puits-vanniers.webp",
  "haut-puits-decanteur.webp",
  "haut-puits-ilyana.webp",
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
      renseignementId: "vanniers-vannes-0",
    },
    renseignements: [
      {
        id: "vanniers-vannes-0",
        tronconId: "chenal-des-vannes",
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
] as const;
