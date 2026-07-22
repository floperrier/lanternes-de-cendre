import {
  appliquerVariationAUnStock,
  type IdentifiantDeStock,
  type StockDuConvoi,
} from "./pilotage";

export const LIEUX_DE_ROUTE = {
  "halte-du-puits-sec": {
    nom: { fr: "Halte du puits sec", en: "Dry Well Halt" },
  },
  "haut-puits": {
    nom: { fr: "Haut-Puits", en: "High Well" },
  },
  "veille-basse": {
    nom: { fr: "Veille-Basse", en: "Lower Watch" },
  },
  "relais-des-vannes": {
    nom: { fr: "Relais des Vannes", en: "Sluice Relay" },
  },
} as const;

export type IdentifiantDeLieu = keyof typeof LIEUX_DE_ROUTE;

export const TRONCONS_DE_ROUTE = [
  {
    id: "digue-des-puits",
    extremites: ["halte-du-puits-sec", "haut-puits"],
    dureeSecondes: 360,
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
      renseignementId: "digue-vigie-0",
    },
  },
  {
    id: "chaussee-de-veille-basse",
    extremites: ["halte-du-puits-sec", "veille-basse"],
    dureeSecondes: 480,
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
      renseignementId: "veille-basse-pelerins-0",
    },
  },
  {
    id: "chenal-des-vannes",
    extremites: ["haut-puits", "relais-des-vannes"],
    dureeSecondes: 600,
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
  },
] as const;

export type TronconDeRoute = (typeof TRONCONS_DE_ROUTE)[number];
export type IdentifiantDeTroncon = TronconDeRoute["id"];
export type EtatReelDeRoute = "praticable" | "degrade" | "coupe";

export interface RenseignementDeRoute {
  readonly id: string;
  readonly tronconId: IdentifiantDeTroncon;
  readonly source:
    | "vigie-du-phare"
    | "messagers-de-haut-puits"
    | "relais-des-pelerins"
    | "eclaireurs-de-haut-puits";
  readonly releveA: number;
  readonly fiabilite: "confirme" | "ancien" | "rapporte";
  readonly etatAnnonce: Exclude<EtatReelDeRoute, "coupe">;
  readonly meteo: "cendre-basse" | "rafales-de-cendre";
  readonly panache: "derive-vers-est" | "absent" | "incertain";
  readonly danger: "saumure" | "orniere" | "visibilite";
  readonly controlePolitique:
    | "puits-libres"
    | "pelerins-de-cendre"
    | "sans-controle-etabli";
}

export interface EngagementDeRoute {
  readonly id: string;
  readonly tronconId: IdentifiantDeTroncon;
  readonly origine: IdentifiantDeLieu;
  readonly destination: IdentifiantDeLieu;
  readonly engageA: number;
  readonly arriveeA: number;
  readonly statut: "en-cours" | "termine";
}

export interface JalonDeRoute {
  readonly id: string;
  readonly type: "fin-de-troncon";
  readonly moment: number;
  readonly tronconId: IdentifiantDeTroncon;
  readonly cause: "front-de-cendre.condamnation-arriere";
}

export interface EtatDesRoutes {
  readonly position: IdentifiantDeLieu;
  readonly etatsReels: Readonly<Record<IdentifiantDeTroncon, EtatReelDeRoute>>;
  readonly renseignements: readonly RenseignementDeRoute[];
  readonly engagements: readonly EngagementDeRoute[];
  readonly jalons: readonly JalonDeRoute[];
}

export type EvenementDeRoute =
  | {
      readonly type: "engagement-de-route.confirme";
      readonly engagementId: string;
      readonly tronconId: IdentifiantDeTroncon;
      readonly origine: IdentifiantDeLieu;
      readonly destination: IdentifiantDeLieu;
      readonly arriveeA: number;
      readonly consommationsAppliquees: {
        readonly combustible: number;
        readonly eau: number;
      };
    }
  | {
      readonly type: "jalon-du-monde.atteint";
      readonly jalonId: string;
      readonly moment: number;
      readonly cause: string;
    }
  | {
      readonly type: "etat-de-route.modifie";
      readonly tronconId: IdentifiantDeTroncon;
      readonly etatPrecedent: EtatReelDeRoute;
      readonly etat: EtatReelDeRoute;
      readonly cause: JalonDeRoute["cause"];
      readonly moment: number;
    };

export interface TransitionDeRoute {
  readonly etat: EtatDesRoutes;
  readonly evenements: readonly EvenementDeRoute[];
}

const RENSEIGNEMENTS_INITIAUX: readonly RenseignementDeRoute[] = [
  {
    id: "digue-messagers-moins-7200",
    tronconId: "digue-des-puits",
    source: "messagers-de-haut-puits",
    releveA: -7_200,
    fiabilite: "ancien",
    etatAnnonce: "degrade",
    meteo: "rafales-de-cendre",
    panache: "incertain",
    danger: "saumure",
    controlePolitique: "puits-libres",
  },
  {
    id: "digue-vigie-0",
    tronconId: "digue-des-puits",
    source: "vigie-du-phare",
    releveA: 0,
    fiabilite: "confirme",
    etatAnnonce: "praticable",
    meteo: "cendre-basse",
    panache: "derive-vers-est",
    danger: "saumure",
    controlePolitique: "puits-libres",
  },
  {
    id: "veille-basse-pelerins-0",
    tronconId: "chaussee-de-veille-basse",
    source: "relais-des-pelerins",
    releveA: 0,
    fiabilite: "rapporte",
    etatAnnonce: "praticable",
    meteo: "rafales-de-cendre",
    panache: "absent",
    danger: "visibilite",
    controlePolitique: "pelerins-de-cendre",
  },
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
  },
];

export function creerEtatDesRoutesInitial(): EtatDesRoutes {
  return {
    position: "halte-du-puits-sec",
    etatsReels: {
      "digue-des-puits": "praticable",
      "chaussee-de-veille-basse": "degrade",
      "chenal-des-vannes": "praticable",
    },
    renseignements: RENSEIGNEMENTS_INITIAUX,
    engagements: [],
    jalons: [],
  };
}

function trouverAutreExtremite(
  troncon: TronconDeRoute,
  origine: IdentifiantDeLieu,
): IdentifiantDeLieu | undefined {
  if (troncon.extremites[0] === origine) {
    return troncon.extremites[1];
  }
  if (troncon.extremites[1] === origine) {
    return troncon.extremites[0];
  }
  return undefined;
}

export function trouverTronconDeRoute(
  id: IdentifiantDeTroncon,
): TronconDeRoute {
  const troncon = TRONCONS_DE_ROUTE.find((candidat) => candidat.id === id);
  if (troncon === undefined) {
    throw new Error(`Le Tronçon de route « ${id} » est inconnu.`);
  }
  return troncon;
}

export function appliquerConsommationDeRouteAUnStock(
  stockId: IdentifiantDeStock,
  stock: StockDuConvoi,
  troncon: TronconDeRoute,
): StockDuConvoi {
  const quantite =
    stockId === "combustible"
      ? troncon.consommationConnue.quantite
      : stockId === "eau"
        ? troncon.consommationIncertaine.quantiteReelle
        : 0;
  return quantite === 0
    ? stock
    : appliquerVariationAUnStock(stock, -quantite);
}

function engagementActif(etat: EtatDesRoutes): EngagementDeRoute | undefined {
  return etat.engagements.find((engagement) => engagement.statut === "en-cours");
}

export function listerTronconsEngageables(etat: EtatDesRoutes): readonly {
  readonly troncon: TronconDeRoute;
  readonly destination: IdentifiantDeLieu;
}[] {
  if (engagementActif(etat) !== undefined) {
    return [];
  }

  return TRONCONS_DE_ROUTE.flatMap((troncon) => {
    const destination = trouverAutreExtremite(troncon, etat.position);
    const condamneParLeFront = etat.jalons.some(
      (jalon) => jalon.tronconId === troncon.id,
    );
    return destination === undefined || condamneParLeFront
      ? []
      : [{ troncon, destination }];
  });
}

export function confirmerEngagementDeRoute(
  etat: EtatDesRoutes,
  tronconId: IdentifiantDeTroncon,
  secondeCourante: number,
): TransitionDeRoute {
  if (engagementActif(etat) !== undefined) {
    throw new Error("Un Engagement de route est déjà en cours.");
  }

  const possibilite = listerTronconsEngageables(etat).find(
    ({ troncon }) => troncon.id === tronconId,
  );
  if (possibilite === undefined) {
    throw new Error(`Le Tronçon de route « ${tronconId} » n’est pas accessible.`);
  }
  if (etat.etatsReels[tronconId] === "coupe") {
    throw new Error(
      `Le Tronçon de route « ${tronconId} » n’est plus physiquement praticable.`,
    );
  }

  const engagement: EngagementDeRoute = {
    id: `engagement-${etat.engagements.length + 1}`,
    tronconId,
    origine: etat.position,
    destination: possibilite.destination,
    engageA: secondeCourante,
    arriveeA: secondeCourante + possibilite.troncon.dureeSecondes,
    statut: "en-cours",
  };
  return {
    etat: {
      ...etat,
      engagements: [...etat.engagements, engagement],
    },
    evenements: [
      {
        type: "engagement-de-route.confirme",
        engagementId: engagement.id,
        tronconId,
        origine: engagement.origine,
        destination: engagement.destination,
        arriveeA: engagement.arriveeA,
        consommationsAppliquees: {
          combustible: possibilite.troncon.consommationConnue.quantite,
          eau: possibilite.troncon.consommationIncertaine.quantiteReelle,
        },
      },
    ],
  };
}

export function traiterJalonsDeRoute(
  etat: EtatDesRoutes,
  secondeInitiale: number,
  secondeFinale: number,
): TransitionDeRoute {
  const engagement = engagementActif(etat);
  if (
    engagement === undefined ||
    engagement.arriveeA <= secondeInitiale ||
    engagement.arriveeA > secondeFinale
  ) {
    return { etat, evenements: [] };
  }

  const etatPrecedent = etat.etatsReels[engagement.tronconId];
  const jalon: JalonDeRoute = {
    id: `jalon-route-${etat.jalons.length + 1}`,
    type: "fin-de-troncon",
    moment: engagement.arriveeA,
    tronconId: engagement.tronconId,
    cause: "front-de-cendre.condamnation-arriere",
  };

  return {
    etat: {
      ...etat,
      position: engagement.destination,
      etatsReels: {
        ...etat.etatsReels,
        [engagement.tronconId]: "coupe",
      },
      engagements: etat.engagements.map((candidat) =>
        candidat.id === engagement.id
          ? { ...candidat, statut: "termine" }
          : candidat,
      ),
      jalons: [...etat.jalons, jalon],
    },
    evenements: [
      {
        type: "jalon-du-monde.atteint",
        jalonId: jalon.id,
        moment: jalon.moment,
        cause: engagement.id,
      },
      {
        type: "etat-de-route.modifie",
        tronconId: engagement.tronconId,
        etatPrecedent,
        etat: "coupe",
        cause: jalon.cause,
        moment: jalon.moment,
      },
    ],
  };
}
