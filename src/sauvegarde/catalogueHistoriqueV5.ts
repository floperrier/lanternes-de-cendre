import type { EvenementStructurel } from "../content/catalogue";

export const EVENEMENTS_HISTORIQUES_V5 = [
  {
    id: "veille-basse.la-place-sous-le-phare",
    fenetre: "premier-jalon-bassins-fendus",
    conditions: {
      requises: [{ type: "lieu-present", lieu: "veille-basse" }],
      interdites: [],
    },
    periodeEligibilite: { debut: 480, fin: 24_000 },
    priorite: 110,
    acteurs: [
      "porte-lanterne",
      "cohorte-du-sillon",
      "habitants-veille-basse",
      "pelerins-de-cendre",
      "techniciens-veille-basse",
    ],
    choix: [
      {
        id: "accueillir",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.cohorte-accueillie",
            cible: "cohorte-du-sillon",
          },
        ],
      },
      {
        id: "refuser",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.cohorte-refusee",
            cible: "cohorte-du-sillon",
          },
        ],
      },
      {
        id: "rediriger",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.cohorte-redirigee",
            cible: "hospice-du-sillon",
          },
        ],
      },
    ],
  },
  {
    id: "veille-basse.la-porte-des-filtres",
    fenetre: "premier-jalon-bassins-fendus",
    conditions: {
      requises: [
        { type: "lieu-present", lieu: "veille-basse" },
        {
          type: "un-des-faits-present",
          faits: [
            "veille-basse.cohorte-accueillie",
            "veille-basse.cohorte-refusee",
            "veille-basse.cohorte-redirigee",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 480, fin: 24_600 },
    priorite: 100,
    acteurs: [
      "porte-lanterne",
      "habitants-veille-basse",
      "pelerins-de-cendre",
      "techniciens-veille-basse",
    ],
    choix: [
      {
        id: "renforcer-sas",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.sas-renforce",
            cible: "habitants-veille-basse",
          },
        ],
      },
      {
        id: "ouvrir-hospice",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.hospice-ouvert",
            cible: "hospice-du-sillon",
          },
        ],
      },
      {
        id: "renoncer-intervention",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.intervention-refusee",
            cible: "habitants-veille-basse",
          },
        ],
      },
    ],
  },
  {
    id: "veille-basse.les-registres-du-reflux",
    fenetre: "premier-jalon-bassins-fendus",
    conditions: {
      requises: [
        { type: "lieu-present", lieu: "veille-basse" },
        {
          type: "un-des-faits-present",
          faits: [
            "veille-basse.sas-renforce",
            "veille-basse.hospice-ouvert",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 480, fin: 25_200 },
    priorite: 90,
    acteurs: ["porte-lanterne", "techniciens-veille-basse"],
    choix: [
      {
        id: "copier-registres",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.registres-copies",
            cible: "techniciens-veille-basse",
          },
        ],
      },
      {
        id: "laisser-registres",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.registres-laisses",
            cible: "habitants-veille-basse",
          },
        ],
      },
    ],
  },
  {
    id: "veille-basse.maelys-et-le-coffret",
    fenetre: "premier-jalon-bassins-fendus",
    conditions: {
      requises: [
        { type: "lieu-present", lieu: "veille-basse" },
        {
          type: "un-des-faits-present",
          faits: [
            "veille-basse.registres-copies",
            "veille-basse.registres-laisses",
          ],
        },
      ],
      interdites: [],
    },
    periodeEligibilite: { debut: 480, fin: 25_800 },
    priorite: 80,
    acteurs: [
      "porte-lanterne",
      "maelys-rive",
      "techniciens-veille-basse",
    ],
    choix: [
      {
        id: "confier-coffret",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.maelys-mission-confiee",
            cible: "maelys-rive",
          },
        ],
      },
      {
        id: "garder-equipes",
        effets: [],
        faitsProduits: [
          {
            id: "veille-basse.maelys-equipes-prioritaires",
            cible: "techniciens-veille-basse",
          },
        ],
      },
    ],
  },
] as const satisfies readonly EvenementStructurel[];
