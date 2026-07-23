import type { EvenementStructurel } from "../content/catalogue";
import type { TronconDeRoute } from "../simulation/routes";
import { EVENEMENTS_HISTORIQUES_V5 } from "./catalogueHistoriqueV5";

const EVENEMENTS_DE_HAUT_PUITS = [
  {
    id: "bassins.haut-puits.pacte-des-citernes",
    fenetre: "halte-haut-puits",
    conditions: {
      requises: [
        { type: "temps-au-moins", secondes: 360 },
        {
          type: "un-des-faits-present",
          faits: [
            "bassins.haut-puits.partage-promis",
            "bassins.haut-puits.reserves-protegees",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 360, fin: 24_000 },
    priorite: 100,
    acteurs: [
      "porte-lanterne",
      "puits-libres",
      "habitants-haut-puits",
    ],
    choix: [
      {
        id: "ouvrir-citerne",
        effets: [{ type: "stock.modifier", stock: "eau", valeur: -30 }],
        faitsProduits: [
          {
            id: "bassins.haut-puits.pacte-partage",
            cible: "habitants-haut-puits",
          },
        ],
      },
      {
        id: "garantir-autonomie",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.haut-puits.pacte-autonomie",
            cible: "puits-libres",
          },
        ],
      },
    ],
  },
  {
    id: "bassins.haut-puits.vanniers-du-panache",
    fenetre: "halte-haut-puits",
    conditions: {
      requises: [
        {
          type: "un-des-faits-present",
          faits: [
            "bassins.haut-puits.pacte-partage",
            "bassins.haut-puits.pacte-autonomie",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 360, fin: 24_000 },
    priorite: 90,
    acteurs: [
      "porte-lanterne",
      "puits-libres",
      "habitants-haut-puits",
    ],
    choix: [
      {
        id: "confiner-boues",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.haut-puits.panache-confine",
            cible: "habitants-haut-puits",
          },
        ],
      },
      {
        id: "deriver-panache",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.haut-puits.panache-derive",
            cible: "puits-libres",
          },
        ],
      },
    ],
  },
  {
    id: "bassins.haut-puits.boues-du-decanteur",
    fenetre: "halte-haut-puits",
    conditions: {
      requises: [
        {
          type: "un-des-faits-present",
          faits: [
            "bassins.haut-puits.panache-confine",
            "bassins.haut-puits.panache-derive",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 360, fin: 24_000 },
    priorite: 80,
    acteurs: [
      "porte-lanterne",
      "equipes-entretien",
      "habitants-haut-puits",
    ],
    choix: [
      {
        id: "consigner-decanteur",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.haut-puits.decanteur-documente",
            cible: "equipes-entretien",
          },
        ],
      },
      {
        id: "adapter-arche",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.haut-puits.arche-documentee",
            cible: "equipes-entretien",
          },
        ],
      },
    ],
  },
  {
    id: "bassins.haut-puits.ilyana-et-la-vanne",
    fenetre: "halte-haut-puits",
    conditions: {
      requises: [
        {
          type: "un-des-faits-present",
          faits: [
            "bassins.haut-puits.decanteur-documente",
            "bassins.haut-puits.arche-documentee",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 360, fin: 24_000 },
    priorite: 70,
    acteurs: [
      "porte-lanterne",
      "ilyana-voss",
      "habitants-haut-puits",
    ],
    choix: [
      {
        id: "lui-confier-registre",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.haut-puits.ilyana-garante",
            cible: "ilyana-voss",
          },
        ],
      },
      {
        id: "garder-arbitrage-collectif",
        effets: [],
        faitsProduits: [
          {
            id: "bassins.haut-puits.ilyana-contredite",
            cible: "ilyana-voss",
          },
        ],
      },
    ],
  },
] as const satisfies readonly EvenementStructurel[];

export const EVENEMENTS_HISTORIQUES_V6 = [
  ...EVENEMENTS_HISTORIQUES_V5,
  ...EVENEMENTS_DE_HAUT_PUITS,
] as const satisfies readonly EvenementStructurel[];

export const TRONCONS_HISTORIQUES_V6 = [
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
    renseignements: [],
  },
  {
    id: "chenal-des-vannes",
    extremites: ["les-vanniers", "relais-des-vannes"],
    originesAutorisees: ["les-vanniers"],
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
    renseignements: [],
  },
  {
    id: "nacelles-de-veille-basse",
    extremites: ["veille-basse", "relais-des-vannes"],
    originesAutorisees: ["veille-basse"],
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
    renseignements: [],
  },
] as const satisfies readonly TronconDeRoute[];
