import type { ContenuPremiumDesRoutes } from "../simulation/routes";

export const CONTENU_PREMIUM_DE_TEST = {
  version: 1,
  catalogue: {
    lieux: [
      {
        id: "relais-des-vannes",
        nom: { fr: "Relais des Vannes", en: "Sluice Relay" },
      },
    ],
    troncons: [
      {
        id: "chenal-des-vannes",
        extremites: ["haut-puits", "relais-des-vannes"],
        dureeSecondes: 600,
        etatInitial: "praticable",
        consommationConnue: {
          stock: "combustible",
          quantite: 5,
          unite: "litres",
        },
        consommationIncertaine: {
          stock: "eau",
          minimum: 5,
          maximum: 7,
          quantiteReelle: 6,
          unite: "litres",
          renseignementId: "vannes-haut-puits-0",
        },
        renseignements: [
          {
            id: "vannes-haut-puits-0",
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
    ],
  },
} as const satisfies ContenuPremiumDesRoutes;
