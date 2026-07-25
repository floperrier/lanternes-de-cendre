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
export const IDENTIFIANTS_DE_FAITS_DE_RECUPERATION = [
  "crise.recuperation.socle-de-survie.accomplie",
  "crise.recuperation.socle-de-survie.manquee",
  "crise.recuperation.mobilite-minimale.accomplie",
  "crise.recuperation.mobilite-minimale.manquee",
  "crise.recuperation.aide-exterieure-identifiee.accomplie",
  "crise.recuperation.aide-exterieure-identifiee.manquee",
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
export type ConditionDeRecuperation =
  | "halte-de-purification"
  | "rejoindre-haut-puits"
  | "demander-aide-haut-puits";
export type StatutDeRecuperation = "amorcee" | "accomplie" | "manquee";

export interface CoutAppliqueAUneRecuperation {
  readonly stock: IdentifiantDeStock;
  readonly quantite: number;
}

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
  readonly condition: ConditionDeRecuperation;
  readonly horizonTroncons: 1 | 2;
  readonly coutAttendu: "deux-materiaux" | "cout-du-troncon";
  readonly amorceeA: number;
  readonly statut: StatutDeRecuperation;
  readonly accomplieA: number | null;
  readonly manqueeA: number | null;
  readonly faitResultat: string | null;
  readonly coutApplique: readonly CoutAppliqueAUneRecuperation[];
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
  readonly recuperation: Pick<
    RecuperationDeCrise,
    | "garantie"
    | "destination"
    | "condition"
    | "horizonTroncons"
    | "coutAttendu"
  >;
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
      condition: "halte-de-purification",
      horizonTroncons: 2,
      coutAttendu: "deux-materiaux",
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
      condition: "rejoindre-haut-puits",
      horizonTroncons: 2,
      coutAttendu: "cout-du-troncon",
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
      condition: "demander-aide-haut-puits",
      horizonTroncons: 1,
      coutAttendu: "deux-materiaux",
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
    }
  | {
      readonly type: "crise.recuperation-accomplie";
      readonly recuperationId: string;
      readonly garantie: GarantieDeRecuperation;
      readonly cause: CicatriceDeCampagne["id"];
      readonly moment: number;
      readonly faitProduit: string;
      readonly coutApplique: readonly CoutAppliqueAUneRecuperation[];
    }
  | {
      readonly type: "crise.recuperation-manquee";
      readonly recuperationId: string;
      readonly garantie: GarantieDeRecuperation;
      readonly cause: CicatriceDeCampagne["id"];
      readonly moment: number;
      readonly faitProduit: string;
      readonly horizonTroncons: 1 | 2;
    };

export type ActionSignificativeDeRecuperation =
  | {
      readonly type: "halte-deployee";
      readonly destination: "halte-du-puits-sec" | "haut-puits";
    }
  | {
      readonly type: "troncon-termine";
      readonly destination: string;
      readonly coutApplique: readonly CoutAppliqueAUneRecuperation[];
    }
  | {
      readonly type: "aide-demandee-haut-puits";
    };

export interface ContexteDEvaluationDesRecuperations {
  readonly moment: number;
  readonly action: ActionSignificativeDeRecuperation | null;
  readonly momentsDesTronconsTermines: readonly number[];
  readonly materiauxDisponibles: number;
  readonly demandeDAideEnAttente: boolean;
}

export interface TransitionDesRecuperations {
  readonly etat: EtatDesCrises;
  readonly variationsDeStocks: readonly {
    readonly stock: IdentifiantDeStock;
    readonly variation: number;
  }[];
  readonly faits: readonly FaitDeCampagne[];
  readonly evenements: readonly EvenementDeCrise[];
}

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
    amorceeA: moment,
    statut: "amorcee",
    accomplieA: null,
    manqueeA: null,
    faitResultat: null,
    coutApplique: [],
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

function identifiantDeFaitDeRecuperation(
  recuperation: RecuperationDeCrise,
  statut: Exclude<StatutDeRecuperation, "amorcee">,
): (typeof IDENTIFIANTS_DE_FAITS_DE_RECUPERATION)[number] {
  return `crise.recuperation.${recuperation.garantie}.${statut}` as
    (typeof IDENTIFIANTS_DE_FAITS_DE_RECUPERATION)[number];
}

function actionAccomplitRecuperation(
  recuperation: RecuperationDeCrise,
  action: ActionSignificativeDeRecuperation | null,
): boolean {
  if (action === null) {
    return false;
  }
  if (recuperation.condition === "halte-de-purification") {
    return (
      action.type === "halte-deployee" &&
      action.destination === recuperation.destination
    );
  }
  if (recuperation.condition === "rejoindre-haut-puits") {
    return (
      action.type === "troncon-termine" &&
      action.destination === recuperation.destination
    );
  }
  return action.type === "aide-demandee-haut-puits";
}

function coutPourAccomplir(
  recuperation: RecuperationDeCrise,
  contexte: ContexteDEvaluationDesRecuperations,
): readonly CoutAppliqueAUneRecuperation[] | undefined {
  if (recuperation.coutAttendu === "deux-materiaux") {
    return contexte.materiauxDisponibles >= 2
      ? [{ stock: "materiaux", quantite: 2 }]
      : undefined;
  }
  return contexte.action?.type === "troncon-termine"
    ? contexte.action.coutApplique
    : undefined;
}

function creerFaitDeResultat(
  recuperation: RecuperationDeCrise,
  statut: Exclude<StatutDeRecuperation, "amorcee">,
  moment: number,
  coutApplique: readonly CoutAppliqueAUneRecuperation[],
): FaitDeCampagne {
  const acteurs =
    recuperation.garantie === "socle-de-survie"
      ? ["porte-lanterne", "equipes-purification"]
      : recuperation.garantie === "mobilite-minimale"
        ? ["porte-lanterne", "equipes-medicales"]
        : ["porte-lanterne", "habitants-haut-puits"];
  const cible =
    recuperation.garantie === "socle-de-survie"
      ? "pompe-purification"
      : recuperation.garantie === "mobilite-minimale"
        ? "haut-puits"
        : "foyers-exposes";
  return {
    id: identifiantDeFaitDeRecuperation(recuperation, statut),
    cause: recuperation.cause,
    acteurs,
    cible,
    moment,
    effets: {
      materiels:
        statut === "accomplie" &&
        recuperation.coutAttendu === "deux-materiaux"
          ? coutApplique.map(({ stock, quantite }) => ({
              type: "stock.modifie" as const,
              stock,
              variation: -quantite,
            }))
          : [],
      humains: [],
    },
  };
}

export function evaluerRecuperationsDeCrise(
  etat: EtatDesCrises,
  contexte: ContexteDEvaluationDesRecuperations,
): TransitionDesRecuperations {
  const faits: FaitDeCampagne[] = [];
  const evenements: EvenementDeCrise[] = [];
  const variationsDeStocks: {
    stock: IdentifiantDeStock;
    variation: number;
  }[] = [];
  let materiauxDisponibles = contexte.materiauxDisponibles;
  let approvisionnementEau = etat.approvisionnementEau;

  const recuperations = etat.recuperations.map((recuperation) => {
    if (recuperation.statut !== "amorcee") {
      return recuperation;
    }

    if (actionAccomplitRecuperation(recuperation, contexte.action)) {
      const coutApplique = coutPourAccomplir(recuperation, {
        ...contexte,
        materiauxDisponibles,
      });
      if (coutApplique !== undefined) {
        const fait = creerFaitDeResultat(
          recuperation,
          "accomplie",
          contexte.moment,
          coutApplique,
        );
        for (const cout of coutApplique) {
          if (
            recuperation.coutAttendu === "deux-materiaux" &&
            cout.stock === "materiaux"
          ) {
            variationsDeStocks.push({
              stock: cout.stock,
              variation: -cout.quantite,
            });
            materiauxDisponibles -= cout.quantite;
          }
        }
        faits.push(fait);
        evenements.push({
          type: "crise.recuperation-accomplie",
          recuperationId: recuperation.id,
          garantie: recuperation.garantie,
          cause: recuperation.cause,
          moment: contexte.moment,
          faitProduit: fait.id,
          coutApplique,
        });
        approvisionnementEau = "assure";
        return {
          ...recuperation,
          statut: "accomplie" as const,
          accomplieA: contexte.moment,
          faitResultat: fait.id,
          coutApplique,
        };
      }
    }

    const tronconsParcourus = contexte.momentsDesTronconsTermines.filter(
      (moment) => moment > recuperation.amorceeA,
    ).length;
    const actionDAideEncorePossible =
      recuperation.condition === "demander-aide-haut-puits" &&
      contexte.demandeDAideEnAttente;
    if (
      tronconsParcourus < recuperation.horizonTroncons ||
      actionDAideEncorePossible
    ) {
      return recuperation;
    }

    const fait = creerFaitDeResultat(
      recuperation,
      "manquee",
      contexte.moment,
      [],
    );
    faits.push(fait);
    evenements.push({
      type: "crise.recuperation-manquee",
      recuperationId: recuperation.id,
      garantie: recuperation.garantie,
      cause: recuperation.cause,
      moment: contexte.moment,
      faitProduit: fait.id,
      horizonTroncons: recuperation.horizonTroncons,
    });
    return {
      ...recuperation,
      statut: "manquee" as const,
      manqueeA: contexte.moment,
      faitResultat: fait.id,
      coutApplique: [],
    };
  });

  return {
    etat: { ...etat, approvisionnementEau, recuperations },
    variationsDeStocks,
    faits,
    evenements,
  };
}
