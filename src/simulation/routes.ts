import {
  appliquerVariationAUnStock,
  type IdentifiantDeStock,
  type StockDuConvoi,
} from "./pilotage";

export type IdentifiantDeLieu =
  | "halte-du-puits-sec"
  | "haut-puits"
  | "veille-basse"
  | "hospice-du-sillon"
  | "les-vanniers"
  | "relais-des-vannes"
  | "deversoir-noir"
  | "lisiere-trame-de-fer"
  | "barriere-neuve"
  | "grand-aiguillage";

export type IdentifiantDeTroncon =
  | "digue-des-puits"
  | "chaussee-de-veille-basse"
  | "chemin-des-vanniers"
  | "chenal-des-vannes"
  | "nacelles-de-veille-basse"
  | "chemin-de-l-hospice"
  | "chenal-de-l-hospice"
  | "conduite-du-deversoir"
  | "passage-de-la-ligne-zero"
  | "piste-des-levees"
  | "rampe-de-barriere-neuve"
  | "voie-des-ponts-lourds";

export interface DefinitionDeLieu {
  readonly id: IdentifiantDeLieu;
  readonly nom: { readonly fr: string; readonly en: string };
}

export interface TronconDeRoute {
  readonly id: IdentifiantDeTroncon;
  readonly nom?: { readonly fr: string; readonly en: string };
  readonly extremites: readonly [
    IdentifiantDeLieu,
    IdentifiantDeLieu,
  ];
  readonly dureeSecondes: number;
  readonly etatInitial: EtatReelDeRoute;
  readonly consommationConnue: {
    readonly stock: "combustible";
    readonly quantite: number;
    readonly unite: "litres";
  };
  readonly consommationIncertaine: {
    readonly stock: "eau";
    readonly minimum: number;
    readonly maximum: number;
    readonly quantiteReelle: number;
    readonly unite: "litres";
    readonly renseignementId: string;
  };
  readonly renseignements: readonly RenseignementDeRoute[];
  readonly originesAutorisees?: readonly IdentifiantDeLieu[];
  readonly libellesDOptions?: Readonly<
    Record<"fr" | "en", Readonly<Record<string, string>>>
  >;
  readonly consequenceDuHalo?: {
    readonly fr: string;
    readonly en: string;
  };
}

export interface ContenuPremiumDesRoutes {
  readonly version: 1;
  readonly catalogue: {
    readonly lieux: readonly DefinitionDeLieu[];
    readonly troncons: readonly TronconDeRoute[];
  };
}

export const LIEUX_DE_ROUTE: Partial<
  Record<IdentifiantDeLieu, DefinitionDeLieu>
> = {
  "halte-du-puits-sec": {
    id: "halte-du-puits-sec",
    nom: { fr: "Maison des Filtres", en: "Filter House" },
  },
  "haut-puits": {
    id: "haut-puits",
    nom: { fr: "Haut-Puits", en: "High Well" },
  },
  "veille-basse": {
    id: "veille-basse",
    nom: { fr: "Veille-Basse", en: "Lower Watch" },
  },
};

export const TRONCONS_DE_ROUTE: TronconDeRoute[] = [
  {
    id: "digue-des-puits",
    extremites: ["halte-du-puits-sec", "haut-puits"],
    originesAutorisees: ["halte-du-puits-sec"],
    dureeSecondes: 360,
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
      renseignementId: "digue-vigie-0",
    },
    renseignements: [],
  },
  {
    id: "chaussee-de-veille-basse",
    extremites: ["halte-du-puits-sec", "veille-basse"],
    originesAutorisees: ["halte-du-puits-sec"],
    dureeSecondes: 480,
    etatInitial: "degrade",
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
    renseignements: [],
  },
];

export type EtatReelDeRoute = "praticable" | "degrade" | "coupe";

export interface RenseignementDeRoute {
  readonly id: string;
  readonly tronconId: IdentifiantDeTroncon;
  readonly source:
    | "vigie-du-phare"
    | "messagers-de-haut-puits"
    | "relais-des-pelerins"
    | "eclaireurs-de-haut-puits"
    | "nacelliers-des-vannes"
    | "techniciens-du-deversoir"
    | "douaniers-du-rail"
    | "aiguilleurs";
  readonly releveA: number;
  readonly fiabilite: "confirme" | "ancien" | "rapporte";
  readonly etatAnnonce: Exclude<EtatReelDeRoute, "coupe">;
  readonly meteo: "cendre-basse" | "rafales-de-cendre";
  readonly panache: "derive-vers-est" | "absent" | "incertain";
  readonly danger:
    | "saumure"
    | "orniere"
    | "visibilite"
    | "cables-fatigues"
    | "conduit-effondrable"
    | "controle-des-essieux"
    | "ponts-fatigues";
  readonly controlePolitique:
    | "puits-libres"
    | "pelerins-de-cendre"
    | "sans-controle-etabli"
    | "accord-des-bassins"
    | "passage-conteste"
    | "conseil-des-vannes"
    | "republique-du-rail";
  readonly libelles?: Readonly<
    Record<
      "fr" | "en",
      {
        readonly source: string;
        readonly danger: string;
        readonly controlePolitique: string;
      }
    >
  >;
}

export interface EngagementDeRoute {
  readonly id: string;
  readonly tronconId: IdentifiantDeTroncon;
  readonly origine: IdentifiantDeLieu;
  readonly destination: IdentifiantDeLieu;
  readonly engageA: number;
  readonly arriveeA: number;
  readonly statut: "en-cours" | "termine";
  readonly consommationsAppliquees?: ConsommationsDeRoute;
}

export interface ConsommationsDeRoute {
  readonly combustible: number;
  readonly eau: number;
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
  readonly topologieHistorique?: "nacelles-v7";
  readonly etatsReels: Readonly<
    Partial<Record<IdentifiantDeTroncon, EtatReelDeRoute>>
  >;
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
];

const IDENTIFIANTS_DE_LIEUX = new Set<IdentifiantDeLieu>([
  "halte-du-puits-sec",
  "haut-puits",
  "veille-basse",
  "hospice-du-sillon",
  "les-vanniers",
  "relais-des-vannes",
  "deversoir-noir",
  "lisiere-trame-de-fer",
  "barriere-neuve",
  "grand-aiguillage",
]);
const IDENTIFIANTS_DE_TRONCONS = new Set<IdentifiantDeTroncon>([
  "digue-des-puits",
  "chaussee-de-veille-basse",
  "chemin-des-vanniers",
  "chenal-des-vannes",
  "nacelles-de-veille-basse",
  "chemin-de-l-hospice",
  "chenal-de-l-hospice",
  "conduite-du-deversoir",
  "passage-de-la-ligne-zero",
  "piste-des-levees",
  "rampe-de-barriere-neuve",
  "voie-des-ponts-lourds",
]);

export function installerContenuPremiumDesRoutes(
  valeur: unknown,
): ContenuPremiumDesRoutes {
  const contenu = valeur as Partial<ContenuPremiumDesRoutes>;
  if (
    contenu.version !== 1 ||
    !Array.isArray(contenu.catalogue?.lieux) ||
    !Array.isArray(contenu.catalogue.troncons)
  ) {
    throw new Error("contenu-premium-invalide");
  }
  const lieux = contenu.catalogue.lieux as readonly DefinitionDeLieu[];
  const troncons = contenu.catalogue.troncons as readonly TronconDeRoute[];
  for (const lieu of lieux) {
    if (
      !IDENTIFIANTS_DE_LIEUX.has(lieu.id) ||
      typeof lieu.nom?.fr !== "string" ||
      typeof lieu.nom.en !== "string"
    ) {
      throw new Error("lieu-premium-invalide");
    }
  }
  for (const troncon of troncons) {
    if (
      !IDENTIFIANTS_DE_TRONCONS.has(troncon.id) ||
      troncon.extremites.length !== 2 ||
      !troncon.extremites.every((id) =>
        IDENTIFIANTS_DE_LIEUX.has(id),
      ) ||
      !Number.isSafeInteger(troncon.dureeSecondes) ||
      troncon.dureeSecondes <= 0 ||
      !Array.isArray(troncon.renseignements) ||
      (troncon.originesAutorisees !== undefined &&
        (!Array.isArray(troncon.originesAutorisees) ||
          troncon.originesAutorisees.length === 0 ||
          !troncon.originesAutorisees.every(
            (id) =>
              IDENTIFIANTS_DE_LIEUX.has(id) &&
              troncon.extremites.includes(id),
          ))) ||
      (troncon.libellesDOptions !== undefined &&
        (!troncon.libellesDOptions.fr ||
          !troncon.libellesDOptions.en ||
          [...Object.values(troncon.libellesDOptions.fr),
          ...Object.values(troncon.libellesDOptions.en)].some(
            (libelle) => typeof libelle !== "string" || libelle.length === 0,
          ))) ||
      (troncon.consequenceDuHalo !== undefined &&
        (typeof troncon.consequenceDuHalo.fr !== "string" ||
          typeof troncon.consequenceDuHalo.en !== "string"))
    ) {
      throw new Error("troncon-premium-invalide");
    }
  }

  for (const lieu of lieux) {
    LIEUX_DE_ROUTE[lieu.id] = lieu;
  }
  for (const troncon of troncons) {
    const index = TRONCONS_DE_ROUTE.findIndex(
      (existant) => existant.id === troncon.id,
    );
    if (index === -1) {
      TRONCONS_DE_ROUTE.push(troncon);
    } else {
      TRONCONS_DE_ROUTE[index] = troncon;
    }
  }
  return contenu as ContenuPremiumDesRoutes;
}

export function executerAvecTronconsTemporaires<T>(
  troncons: readonly TronconDeRoute[],
  action: () => T,
): T {
  const tronconsInitiaux = [...TRONCONS_DE_ROUTE];
  for (const troncon of troncons) {
    const index = TRONCONS_DE_ROUTE.findIndex(
      (existant) => existant.id === troncon.id,
    );
    if (index === -1) {
      TRONCONS_DE_ROUTE.push(troncon);
    } else {
      TRONCONS_DE_ROUTE[index] = troncon;
    }
  }
  try {
    return action();
  } finally {
    TRONCONS_DE_ROUTE.splice(
      0,
      TRONCONS_DE_ROUTE.length,
      ...tronconsInitiaux,
    );
  }
}

export function creerEtatDesRoutesInitial(): EtatDesRoutes {
  return {
    position: "halte-du-puits-sec",
    etatsReels: Object.fromEntries(
      TRONCONS_DE_ROUTE.map((troncon) => [
        troncon.id,
        troncon.etatInitial,
      ]),
    ),
    renseignements: RENSEIGNEMENTS_INITIAUX,
    engagements: [],
    jalons: [],
  };
}

function trouverAutreExtremite(
  troncon: TronconDeRoute,
  origine: IdentifiantDeLieu,
): IdentifiantDeLieu | undefined {
  if (
    troncon.originesAutorisees !== undefined &&
    !troncon.originesAutorisees.includes(origine)
  ) {
    return undefined;
  }
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
  consommations?: ConsommationsDeRoute,
): StockDuConvoi {
  const quantite =
    stockId === "combustible"
      ? (consommations?.combustible ??
        troncon.consommationConnue.quantite)
      : stockId === "eau"
        ? (consommations?.eau ??
          troncon.consommationIncertaine.quantiteReelle)
        : 0;
  return quantite === 0
    ? stock
    : appliquerVariationAUnStock(stock, -quantite);
}

export function trouverEngagementDeRouteActif(
  etat: EtatDesRoutes,
): EngagementDeRoute | undefined {
  return etat.engagements.find((engagement) => engagement.statut === "en-cours");
}

export function listerTronconsEngageables(etat: EtatDesRoutes): readonly {
  readonly troncon: TronconDeRoute;
  readonly destination: IdentifiantDeLieu;
}[] {
  if (trouverEngagementDeRouteActif(etat) !== undefined) {
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
  consommations?: ConsommationsDeRoute,
): TransitionDeRoute {
  if (trouverEngagementDeRouteActif(etat) !== undefined) {
    throw new Error("Un Engagement de route est déjà en cours.");
  }

  const possibilite = listerTronconsEngageables(etat).find(
    ({ troncon }) => troncon.id === tronconId,
  );
  if (possibilite === undefined) {
    throw new Error(`Le Tronçon de route « ${tronconId} » n’est pas accessible.`);
  }
  if (
    (etat.etatsReels[tronconId] ?? possibilite.troncon.etatInitial) ===
    "coupe"
  ) {
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
    ...(consommations === undefined
      ? {}
      : { consommationsAppliquees: consommations }),
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
          combustible:
            consommations?.combustible ??
            possibilite.troncon.consommationConnue.quantite,
          eau:
            consommations?.eau ??
            possibilite.troncon.consommationIncertaine.quantiteReelle,
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
  const engagement = trouverEngagementDeRouteActif(etat);
  if (
    engagement === undefined ||
    engagement.arriveeA <= secondeInitiale ||
    engagement.arriveeA > secondeFinale
  ) {
    return { etat, evenements: [] };
  }

  const troncon = trouverTronconDeRoute(engagement.tronconId);
  const etatPrecedent =
    etat.etatsReels[engagement.tronconId] ?? troncon.etatInitial;
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
