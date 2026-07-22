import type { FaitDeCampagne } from "./faits";
import type { EtatPilotage, IdentifiantDeStock } from "./pilotage";

export const IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE =
  "penurie-eau.pompe-purification" as const;
export const FAIT_ANNONCANT_LA_CRISE =
  "incident.purification.pompe-instable.debit-maintenu" as const;
export const IDENTIFIANTS_DE_FAITS_DE_CRISE = [
  "crise.purification.eau-contaminee",
  "crise.purification.isoler-et-rationner",
  "crise.purification.mobiliser-les-remedes",
  "crise.purification.evacuer-les-foyers-exposes",
] as const;

export type IdentifiantDeFaitDeCrise =
  (typeof IDENTIFIANTS_DE_FAITS_DE_CRISE)[number];
export type IdentifiantDeReponseALaCrise =
  | "isoler-et-rationner"
  | "mobiliser-les-remedes"
  | "evacuer-les-foyers-exposes";
export type GarantieDeRecuperation =
  | "socle-de-survie"
  | "mobilite-minimale"
  | "aide-exterieure-identifiee";

export interface AlerteDeCrise {
  readonly id: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
  readonly cause: typeof FAIT_ANNONCANT_LA_CRISE;
  readonly annonceeA: number;
  readonly ruptureA: number;
  readonly chaineVisible: readonly [
    {
      readonly id: "pompe-purification.degradee";
      readonly cause: typeof FAIT_ANNONCANT_LA_CRISE;
      readonly irreversible: true;
    },
    {
      readonly id: "eau.purifiee.contamination-annoncee";
      readonly cause: "pompe-purification.degradee";
      readonly irreversible: false;
    },
  ];
}

export interface CriseActive {
  readonly id: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
  readonly cause: typeof FAIT_ANNONCANT_LA_CRISE;
  readonly declencheeA: number;
  readonly faitProduit: (typeof IDENTIFIANTS_DE_FAITS_DE_CRISE)[0];
  readonly chaineVisible: readonly [
    ...AlerteDeCrise["chaineVisible"],
    {
      readonly id: "eau.purifiee.contaminee";
      readonly cause: "eau.purifiee.contamination-annoncee";
      readonly irreversible: true;
    },
  ];
}

export interface CicatriceDeCampagne {
  readonly id:
    | "cicatrice.rationnement-deau"
    | "cicatrice.reserve-de-remedes-entamee"
    | "cicatrice.evacuation-des-foyers";
  readonly cause: Exclude<
    IdentifiantDeFaitDeCrise,
    (typeof IDENTIFIANTS_DE_FAITS_DE_CRISE)[0]
  >;
  readonly acquiseA: number;
  readonly irreversible: true;
}

export interface RecuperationDeCrise {
  readonly id: string;
  readonly cause: CicatriceDeCampagne["id"];
  readonly garantie: GarantieDeRecuperation;
  readonly destination: "halte-du-puits-sec" | "haut-puits";
  readonly horizonTroncons: 1 | 2;
  readonly statut: "amorcee";
}

export interface EtatDesCrises {
  readonly approvisionnementEau: "assure" | "sous-tension" | "rupture";
  readonly faitAnnonceurHistoriqueIgnore: boolean;
  readonly alerte: AlerteDeCrise | null;
  readonly criseActive: CriseActive | null;
  readonly cicatrices: readonly CicatriceDeCampagne[];
  readonly recuperations: readonly RecuperationDeCrise[];
}

interface CoutDeReponse {
  readonly stock?: IdentifiantDeStock;
  readonly quantite?: number;
  readonly habitants?: number;
}

export interface DefinitionDeReponseALaCrise {
  readonly id: IdentifiantDeReponseALaCrise;
  readonly dernierRecours: boolean;
  readonly cout: CoutDeReponse;
  readonly cicatrice: Omit<CicatriceDeCampagne, "cause" | "acquiseA">;
  readonly recuperation: Omit<RecuperationDeCrise, "id" | "cause">;
}

export const DEFINITIONS_DES_REPONSES_A_LA_CRISE = [
  {
    id: "isoler-et-rationner",
    dernierRecours: false,
    cout: { stock: "materiaux", quantite: 4 },
    cicatrice: {
      id: "cicatrice.rationnement-deau",
      irreversible: true,
    },
    recuperation: {
      garantie: "socle-de-survie",
      destination: "halte-du-puits-sec",
      horizonTroncons: 2,
      statut: "amorcee",
    },
  },
  {
    id: "mobiliser-les-remedes",
    dernierRecours: false,
    cout: { stock: "remedes", quantite: 5 },
    cicatrice: {
      id: "cicatrice.reserve-de-remedes-entamee",
      irreversible: true,
    },
    recuperation: {
      garantie: "mobilite-minimale",
      destination: "haut-puits",
      horizonTroncons: 2,
      statut: "amorcee",
    },
  },
  {
    id: "evacuer-les-foyers-exposes",
    dernierRecours: true,
    cout: { habitants: 8 },
    cicatrice: {
      id: "cicatrice.evacuation-des-foyers",
      irreversible: true,
    },
    recuperation: {
      garantie: "aide-exterieure-identifiee",
      destination: "haut-puits",
      horizonTroncons: 1,
      statut: "amorcee",
    },
  },
] as const satisfies readonly DefinitionDeReponseALaCrise[];

export type EvenementDeCrise =
  | {
      readonly type: "crise.aggravation-annoncee";
      readonly criseId: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
      readonly cause: typeof FAIT_ANNONCANT_LA_CRISE;
      readonly ruptureA: number;
      readonly maillonIrreversible: "pompe-purification.degradee";
    }
  | {
      readonly type: "crise.checkpoint-requis";
      readonly criseId: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
      readonly cause: typeof FAIT_ANNONCANT_LA_CRISE;
      readonly moment: number;
      readonly sauvegardeAtomiqueRequise: true;
    }
  | {
      readonly type: "crise.declenchee";
      readonly criseId: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
      readonly cause: typeof FAIT_ANNONCANT_LA_CRISE;
      readonly moment: number;
      readonly sauvegardeAtomiqueRequise: true;
      readonly faitProduit: (typeof IDENTIFIANTS_DE_FAITS_DE_CRISE)[0];
      readonly maillonIrreversible: "eau.purifiee.contaminee";
    }
  | {
      readonly type: "crise.resolue";
      readonly criseId: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
      readonly reponseId: IdentifiantDeReponseALaCrise;
      readonly moment: number;
      readonly faitProduit: Exclude<
        IdentifiantDeFaitDeCrise,
        (typeof IDENTIFIANTS_DE_FAITS_DE_CRISE)[0]
      >;
      readonly cicatriceId: CicatriceDeCampagne["id"];
      readonly garantie: GarantieDeRecuperation;
      readonly maillonIrreversible: CicatriceDeCampagne["id"];
    };

export interface CommandeDeResolutionDeCrise {
  readonly type: "crise.resoudre";
  readonly criseId: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
  readonly reponseId: IdentifiantDeReponseALaCrise;
}

export interface CommandeDeDeclenchementDeCrise {
  readonly type: "crise.declencher";
  readonly criseId: typeof IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE;
}

export function creerEtatDesCrisesInitial(): EtatDesCrises {
  return {
    approvisionnementEau: "assure",
    faitAnnonceurHistoriqueIgnore: false,
    alerte: null,
    criseActive: null,
    cicatrices: [],
    recuperations: [],
  };
}

export function annoncerCriseApresFaits(
  etat: EtatDesCrises,
  faits: readonly FaitDeCampagne[],
): {
  readonly etat: EtatDesCrises;
  readonly evenements: readonly EvenementDeCrise[];
} {
  if (
    etat.faitAnnonceurHistoriqueIgnore ||
    etat.alerte !== null ||
    etat.criseActive !== null
  ) {
    return { etat, evenements: [] };
  }
  const fait = faits.find((candidat) => candidat.id === FAIT_ANNONCANT_LA_CRISE);
  if (fait === undefined) {
    return { etat, evenements: [] };
  }
  const alerte: AlerteDeCrise = {
    id: IDENTIFIANT_DE_LA_CRISE_DE_REFERENCE,
    cause: FAIT_ANNONCANT_LA_CRISE,
    annonceeA: fait.moment,
    ruptureA: fait.moment + 180,
    chaineVisible: [
      {
        id: "pompe-purification.degradee",
        cause: FAIT_ANNONCANT_LA_CRISE,
        irreversible: true,
      },
      {
        id: "eau.purifiee.contamination-annoncee",
        cause: "pompe-purification.degradee",
        irreversible: false,
      },
    ],
  };
  return {
    etat: {
      ...etat,
      approvisionnementEau: "sous-tension",
      alerte,
    },
    evenements: [
      {
        type: "crise.aggravation-annoncee",
        criseId: alerte.id,
        cause: alerte.cause,
        ruptureA: alerte.ruptureA,
        maillonIrreversible: "pompe-purification.degradee",
      },
    ],
  };
}

export function ignorerFaitAnnonceurHistorique(
  etat: EtatDesCrises,
): EtatDesCrises {
  return { ...etat, faitAnnonceurHistoriqueIgnore: true };
}

export function criseAttendSonCheckpoint(
  etat: EtatDesCrises,
  moment: number,
): boolean {
  return (
    etat.criseActive === null &&
    etat.alerte !== null &&
    etat.alerte.ruptureA <= moment
  );
}

export function prochaineSecondeDeCrise(
  etat: EtatDesCrises,
  secondeFinaleDemandee: number,
): number | undefined {
  const ruptureA = etat.alerte?.ruptureA;
  return ruptureA !== undefined && ruptureA <= secondeFinaleDemandee
    ? ruptureA
    : undefined;
}

export function declencherCrise(
  etat: EtatDesCrises,
  eauDisponible: number,
  moment: number,
): {
  readonly etat: EtatDesCrises;
  readonly variationDEau: number;
  readonly fait: FaitDeCampagne;
  readonly evenement: EvenementDeCrise;
} | undefined {
  const alerte = etat.alerte;
  if (alerte === null || alerte.ruptureA !== moment) {
    return undefined;
  }
  const variationDEau = Math.min(0, 16 - eauDisponible);
  const fait: FaitDeCampagne = {
    id: IDENTIFIANTS_DE_FAITS_DE_CRISE[0],
    cause: alerte.cause,
    acteurs: ["equipes-purification", "foyers-du-convoi"],
    cible: "reserve-deau-purifiee",
    moment,
    effets: {
      materiels: [
        { type: "stock.modifie", stock: "eau", variation: variationDEau },
      ],
      humains: [{ type: "habitants.exposes", nombre: 0 }],
    },
  };
  const criseActive: CriseActive = {
    id: alerte.id,
    cause: alerte.cause,
    declencheeA: moment,
    faitProduit: IDENTIFIANTS_DE_FAITS_DE_CRISE[0],
    chaineVisible: [
      ...alerte.chaineVisible,
      {
        id: "eau.purifiee.contaminee",
        cause: "eau.purifiee.contamination-annoncee",
        irreversible: true,
      },
    ],
  };
  return {
    etat: { ...etat, approvisionnementEau: "rupture", criseActive },
    variationDEau,
    fait,
    evenement: {
      type: "crise.declenchee",
      criseId: criseActive.id,
      cause: criseActive.cause,
      moment,
      sauvegardeAtomiqueRequise: true,
      faitProduit: criseActive.faitProduit,
      maillonIrreversible: "eau.purifiee.contaminee",
    },
  };
}

function trouverReponse(
  id: IdentifiantDeReponseALaCrise,
): DefinitionDeReponseALaCrise {
  const reponse = DEFINITIONS_DES_REPONSES_A_LA_CRISE.find(
    (candidate) => candidate.id === id,
  );
  if (reponse === undefined) {
    throw new Error(`La réponse de Crise « ${id} » est inconnue.`);
  }
  return reponse;
}

export function reponseALaCriseEstViable(
  reponse: DefinitionDeReponseALaCrise,
  pilotage: EtatPilotage,
  habitants: number,
): boolean {
  if (reponse.cout.stock !== undefined) {
    return (
      pilotage.economie.stocks[reponse.cout.stock].quantite >=
      (reponse.cout.quantite ?? 0)
    );
  }
  return habitants > (reponse.cout.habitants ?? 0);
}

export function resoudreCrise(
  etat: EtatDesCrises,
  pilotage: EtatPilotage,
  habitants: number,
  commande: CommandeDeResolutionDeCrise,
  moment: number,
): {
  readonly etat: EtatDesCrises;
  readonly variationDeStock:
    | { readonly stock: IdentifiantDeStock; readonly variation: number }
    | undefined;
  readonly variationDHabitants: number;
  readonly fait: FaitDeCampagne;
  readonly evenement: EvenementDeCrise;
} {
  const crise = etat.criseActive;
  if (crise === null || crise.id !== commande.criseId) {
    throw new Error(`La Crise « ${commande.criseId} » n’est pas active.`);
  }
  const reponse = trouverReponse(commande.reponseId);
  if (!reponseALaCriseEstViable(reponse, pilotage, habitants)) {
    throw new Error("Les ressources disponibles ne couvrent pas cette réponse.");
  }
  const faitProduit =
    `crise.purification.${reponse.id}` as Exclude<
      IdentifiantDeFaitDeCrise,
      (typeof IDENTIFIANTS_DE_FAITS_DE_CRISE)[0]
    >;
  const variationDeStock =
    reponse.cout.stock === undefined
      ? undefined
      : {
          stock: reponse.cout.stock,
          variation: -(reponse.cout.quantite ?? 0),
        };
  const variationDHabitants = -(reponse.cout.habitants ?? 0);
  const fait: FaitDeCampagne = {
    id: faitProduit,
    cause: crise.id,
    acteurs:
      reponse.id === "evacuer-les-foyers-exposes"
        ? ["porte-lanterne", "foyers-exposes"]
        : ["porte-lanterne", "equipes-purification"],
    cible:
      reponse.id === "evacuer-les-foyers-exposes"
        ? "foyers-du-convoi"
        : "pompe-purification",
    moment,
    effets: {
      materiels:
        variationDeStock === undefined
          ? []
          : [{ type: "stock.modifie", ...variationDeStock }],
      humains:
        variationDHabitants === 0
          ? []
          : [{ type: "habitants.modifies", variation: variationDHabitants }],
    },
  };
  const cicatrice: CicatriceDeCampagne = {
    ...reponse.cicatrice,
    cause: faitProduit,
    acquiseA: moment,
  };
  const recuperation: RecuperationDeCrise = {
    ...reponse.recuperation,
    id: `recuperation.${etat.recuperations.length + 1}`,
    cause: cicatrice.id,
  };
  return {
    etat: {
      ...etat,
      approvisionnementEau: "sous-tension",
      alerte: null,
      criseActive: null,
      cicatrices: [...etat.cicatrices, cicatrice],
      recuperations: [...etat.recuperations, recuperation],
    },
    variationDeStock,
    variationDHabitants,
    fait,
    evenement: {
      type: "crise.resolue",
      criseId: crise.id,
      reponseId: reponse.id,
      moment,
      faitProduit,
      cicatriceId: cicatrice.id,
      garantie: recuperation.garantie,
      maillonIrreversible: cicatrice.id,
    },
  };
}
