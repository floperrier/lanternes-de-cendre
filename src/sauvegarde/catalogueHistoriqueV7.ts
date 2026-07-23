import type { EvenementStructurel } from "../content/catalogue";
import { EVENEMENTS_HISTORIQUES_V6 } from "./catalogueHistoriqueV6";

const EVENEMENTS_DES_NACELLES = [
  {
    id: "bassins.nacelles.le-poids-des-deux-rives",
    fenetre: "relais-des-nacelles",
    conditions: {
      requises: [
        { type: "lieu-present", lieu: "relais-des-vannes" },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 780, fin: 2_147_483_647 },
    priorite: 120,
    acteurs: [
      "porte-lanterne",
      "nacelliers-des-vannes",
      "puits-libres",
      "pelerins-de-cendre",
      "cohorte-du-sillon",
    ],
    choix: [
      {
        id: "partager-contrepoids",
        effets: [
          { type: "stock.modifier", stock: "materiaux", valeur: -4 },
        ],
        faitsProduits: [
          {
            id: "bassins.nacelles.accord-regional",
            cible: "nacelliers-des-vannes",
          },
        ],
      },
      {
        id: "reserver-passage",
        effets: [{ type: "stock.modifier", stock: "eau", valeur: -8 }],
        faitsProduits: [
          {
            id: "bassins.nacelles.passage-restreint",
            cible: "cohorte-du-sillon",
          },
        ],
      },
    ],
  },
  {
    id: "bassins.nacelles.le-frein-sous-la-cendre",
    fenetre: "relais-des-nacelles",
    conditions: {
      requises: [
        { type: "lieu-present", lieu: "relais-des-vannes" },
        {
          type: "un-des-faits-present",
          faits: [
            "bassins.nacelles.accord-regional",
            "bassins.nacelles.passage-restreint",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 780, fin: 2_147_483_647 },
    priorite: 110,
    acteurs: [
      "porte-lanterne",
      "nacelliers-des-vannes",
      "frein-magnetique-des-nacelles",
    ],
    choix: [
      {
        id: "baliser-frein",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.nacelles.cible-frein-balisee",
            cible: "frein-magnetique-des-nacelles",
          },
        ],
      },
      {
        id: "consigner-frein",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.nacelles.cible-frein-consignee",
            cible: "frein-magnetique-des-nacelles",
          },
        ],
      },
    ],
  },
  {
    id: "bassins.nacelles.la-main-sur-le-frein",
    fenetre: "relais-des-nacelles",
    conditions: {
      requises: [
        { type: "lieu-present", lieu: "relais-des-vannes" },
        {
          type: "un-des-faits-present",
          faits: [
            "bassins.nacelles.cible-frein-balisee",
            "bassins.nacelles.cible-frein-consignee",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 780, fin: 2_147_483_647 },
    priorite: 100,
    acteurs: [
      "porte-lanterne",
      "nacelliers-des-vannes",
      "frein-magnetique-des-nacelles",
      "puits-libres",
      "pelerins-de-cendre",
    ],
    choix: [
      {
        id: "reparer-publiquement",
        effets: [
          { type: "stock.modifier", stock: "materiaux", valeur: -6 },
        ],
        faitsProduits: [
          {
            id: "bassins.nacelles.frein-reaccorde",
            cible: "nacelliers-des-vannes",
          },
        ],
      },
      {
        id: "intervenir-clandestinement",
        effets: [
          { type: "stock.modifier", stock: "materiaux", valeur: -2 },
        ],
        faitsProduits: [
          {
            id: "bassins.nacelles.frein-transforme-clandestinement",
            cible: "frein-magnetique-des-nacelles",
          },
          {
            id: "bassins.nacelles.trace-laiton-persistante",
            cible: "nacelliers-des-vannes",
          },
        ],
      },
    ],
  },
  {
    id: "bassins.nacelles.deux-voix-dans-le-cable",
    fenetre: "relais-des-nacelles",
    conditions: {
      requises: [
        { type: "lieu-present", lieu: "relais-des-vannes" },
        {
          type: "un-des-faits-present",
          faits: [
            "bassins.nacelles.frein-reaccorde",
            "bassins.nacelles.frein-transforme-clandestinement",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 780, fin: 2_147_483_647 },
    priorite: 90,
    acteurs: [
      "porte-lanterne",
      "ilyana-voss",
      "maelys-rive",
      "nacelliers-des-vannes",
    ],
    choix: [
      {
        id: "porter-passage-partage",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.nacelles.conseil-passage-partage",
            cible: "ilyana-voss",
          },
        ],
      },
      {
        id: "porter-maintenance-commune",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.nacelles.conseil-maintenance-commune",
            cible: "maelys-rive",
          },
        ],
      },
    ],
  },
] as const satisfies readonly EvenementStructurel[];

export const EVENEMENTS_HISTORIQUES_V7 = [
  ...EVENEMENTS_HISTORIQUES_V6,
  ...EVENEMENTS_DES_NACELLES,
] as const satisfies readonly EvenementStructurel[];
