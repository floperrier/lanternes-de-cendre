import { createHash } from "node:crypto";

export const CONTENU_PREMIUM_V1 = {
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
} as const;

export const CONTENU_PREMIUM_V1_JSON = JSON.stringify(CONTENU_PREMIUM_V1);

export const EMPREINTE_CONTENU_PREMIUM_V1 = createHash("sha256")
  .update(CONTENU_PREMIUM_V1_JSON)
  .digest("base64url");
