import {
  appliquerVariationAUnStock,
  type IdentifiantDeStock,
  type StockDuConvoi,
} from "./pilotage";

export type IdentifiantDOffreDeHautPuits =
  | "eau-contre-materiaux"
  | "eau-contre-remedes";

export interface OffreDeHautPuits {
  readonly id: IdentifiantDOffreDeHautPuits;
  readonly besoin: "pieces-de-filtration" | "remedes-pour-les-puisatiers";
  readonly echangesRestants: 0 | 1;
  readonly echangeA: number | null;
  readonly mouvements: readonly {
    readonly stock: IdentifiantDeStock;
    readonly variation: number;
  }[];
}

export interface EtatDeHautPuits {
  readonly colonie: {
    readonly id: "haut-puits";
    readonly statut: "stable" | "fragile" | "perdue";
    readonly pressions:
      | readonly []
      | readonly [PressionLocaleDeHautPuits]
      | readonly [PressionLocaleDeHautPuits, PressionLocaleDeHautPuits];
    readonly devenir:
      | "negociation-ouverte"
      | "partage-organise"
      | "reserves-protegees";
  };
  readonly marche: {
    readonly offres: readonly OffreDeHautPuits[];
  };
  readonly relationPublique:
    | "fermee"
    | "transactionnelle"
    | "cooperative";
  readonly engagementsDiplomatiques: readonly {
    readonly id: "haut-puits.partage-au-conseil-des-vannes";
    readonly prisA: number;
    readonly echoPrevu: "conseil-des-vannes";
  }[];
  readonly projetsTransformationDisponibles: readonly [
    "decanteur-itinerant",
    "arche-des-deplaces",
  ];
  readonly projetChoisi:
    | "decanteur-itinerant"
    | "arche-des-deplaces"
    | null;
  readonly projetRegional?: {
    readonly id: "decanteur-itinerant" | "arche-des-deplaces";
    readonly statut: "retenu" | "scelle";
    readonly retenuA: number;
    readonly scelleA: number | null;
    readonly coutMateriaux: 0 | 12;
  } | null;
  readonly decisionPriseA: number | null;
}

export type PressionLocaleDeHautPuits =
  | "autonomie-hydrique-menacee"
  | "reserves-entamees"
  | "familles-ecartees";

export type CommandeDeHautPuits =
  | {
      readonly type: "haut-puits.marche.echanger";
      readonly offreId: IdentifiantDOffreDeHautPuits;
    }
  | {
      readonly type: "haut-puits.negociation.decider";
      readonly decision: "partager-eau" | "proteger-reserves";
    };

export type CommandeDeMarcheDeHautPuits = Extract<
  CommandeDeHautPuits,
  { readonly type: "haut-puits.marche.echanger" }
>;

export type EvenementDeHautPuits =
  | {
      readonly type: "haut-puits.marche.offre-epuisee";
      readonly offreId: IdentifiantDOffreDeHautPuits;
      readonly moment: number;
    }
  | {
      readonly type: "haut-puits.negociation.tranchee";
      readonly decision: "partager-eau" | "proteger-reserves";
      readonly moment: number;
      readonly echoPrevu: "conseil-des-vannes";
    };

export interface TransitionDeHautPuits {
  readonly etat: EtatDeHautPuits;
  readonly stocks: Readonly<Record<IdentifiantDeStock, StockDuConvoi>>;
  readonly evenements: readonly EvenementDeHautPuits[];
}

export function creerEtatDeHautPuitsInitial(): EtatDeHautPuits {
  return {
    colonie: {
      id: "haut-puits",
      statut: "stable",
      pressions: ["autonomie-hydrique-menacee"],
      devenir: "negociation-ouverte",
    },
    marche: {
      offres: [
        {
          id: "eau-contre-materiaux",
          besoin: "pieces-de-filtration",
          echangesRestants: 1,
          echangeA: null,
          mouvements: [
            { stock: "eau", variation: 60 },
            { stock: "materiaux", variation: -8 },
          ],
        },
        {
          id: "eau-contre-remedes",
          besoin: "remedes-pour-les-puisatiers",
          echangesRestants: 1,
          echangeA: null,
          mouvements: [
            { stock: "eau", variation: 35 },
            { stock: "remedes", variation: -4 },
          ],
        },
      ],
    },
    relationPublique: "transactionnelle",
    engagementsDiplomatiques: [],
    projetsTransformationDisponibles: [
      "decanteur-itinerant",
      "arche-des-deplaces",
    ],
    projetChoisi: null,
    projetRegional: null,
    decisionPriseA: null,
  };
}

export function appliquerCommandeAHautPuits(
  etat: EtatDeHautPuits,
  stocks: Readonly<Record<IdentifiantDeStock, StockDuConvoi>>,
  commande: CommandeDeHautPuits,
  moment: number,
): TransitionDeHautPuits {
  if (commande.type === "haut-puits.negociation.decider") {
    if (etat.colonie.devenir !== "negociation-ouverte") {
      throw new Error("La négociation de Haut-Puits est déjà tranchée.");
    }
    if (commande.decision === "proteger-reserves") {
      return {
        etat: {
          ...etat,
          colonie: {
            ...etat.colonie,
            statut: "stable",
            pressions: ["familles-ecartees"],
            devenir: "reserves-protegees",
          },
          relationPublique: "fermee",
          decisionPriseA: moment,
        },
        stocks,
        evenements: [
          {
            type: "haut-puits.negociation.tranchee",
            decision: commande.decision,
            moment,
            echoPrevu: "conseil-des-vannes",
          },
        ],
      };
    }
    return {
      etat: {
        ...etat,
        colonie: {
          ...etat.colonie,
          statut: "fragile",
          pressions: ["reserves-entamees"],
          devenir: "partage-organise",
        },
        relationPublique: "cooperative",
        engagementsDiplomatiques: [
          ...etat.engagementsDiplomatiques,
          {
            id: "haut-puits.partage-au-conseil-des-vannes",
            prisA: moment,
            echoPrevu: "conseil-des-vannes",
          },
        ],
        decisionPriseA: moment,
      },
      stocks: {
        ...stocks,
        eau: appliquerVariationAUnStock(stocks.eau, -30),
      },
      evenements: [
        {
          type: "haut-puits.negociation.tranchee",
          decision: commande.decision,
          moment,
          echoPrevu: "conseil-des-vannes",
        },
      ],
    };
  }

  const offre = etat.marche.offres.find(
    (candidate) => candidate.id === commande.offreId,
  );
  if (offre === undefined) {
    throw new Error(`L’offre « ${commande.offreId} » est inconnue.`);
  }
  if (offre.echangesRestants === 0) {
    throw new Error(`L’offre « ${commande.offreId} » est épuisée.`);
  }
  const stockInsuffisant = offre.mouvements.some(
    ({ stock, variation }) =>
      variation < 0 && stocks[stock].quantite < -variation,
  );
  if (stockInsuffisant) {
    throw new Error(
      `Les ressources requises par l’offre « ${commande.offreId} » sont insuffisantes.`,
    );
  }

  const nouveauxStocks = { ...stocks };
  for (const mouvement of offre.mouvements) {
    nouveauxStocks[mouvement.stock] = appliquerVariationAUnStock(
      nouveauxStocks[mouvement.stock],
      mouvement.variation,
    );
  }

  return {
    etat: {
      ...etat,
      marche: {
        offres: etat.marche.offres.map((candidate) =>
          candidate.id === offre.id
            ? { ...candidate, echangesRestants: 0, echangeA: moment }
            : candidate,
        ),
      },
    },
    stocks: nouveauxStocks,
    evenements: [
      {
        type: "haut-puits.marche.offre-epuisee",
        offreId: offre.id,
        moment,
      },
    ],
  };
}
