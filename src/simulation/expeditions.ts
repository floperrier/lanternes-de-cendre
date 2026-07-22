import type { IdentifiantDeStock } from "./pilotage";
import type { FaitDeCampagne } from "./faits";

export type IdentifiantDExpedition = string;

export interface MandatDExpedition {
  readonly objectif: string;
  readonly issueDeRepli: string;
  readonly responsable: string;
  readonly groupeHabitants: number;
  readonly equipement: string;
  readonly enveloppeAutonomie: {
    readonly ecartReversibleMaxSecondes: number;
    readonly depenseMineureRemedesMax: number;
  };
  readonly seuilDeRepli: string;
}

export const EXPEDITION_DES_VANNES_GRISES = Object.freeze({
  id: "vannes-grises",
  mandat: {
    objectif: "retablir-debit-exploitable",
    issueDeRepli: "cartographier-acces-et-rentrer",
    responsable: "liora",
    groupeHabitants: 4,
    equipement: "filtres-doubles",
    enveloppeAutonomie: {
      ecartReversibleMaxSecondes: 2_700,
      depenseMineureRemedesMax: 1,
    },
    seuilDeRepli: "premiere-blessure",
  },
} as const satisfies {
  readonly id: IdentifiantDExpedition;
  readonly mandat: MandatDExpedition;
});

export interface RapportDExpedition {
  readonly type:
    | "depart"
    | "jalon"
    | "ecart-autonome"
    | "rupture-mandat"
    | "ordre-distant"
    | "retour";
  readonly moment: number;
  readonly cause: string;
  readonly acteurs: readonly string[];
  readonly cible: string;
}

export interface MouvementDeStockDExpedition {
  readonly moment: number;
  readonly stock: IdentifiantDeStock;
  readonly variation: number;
}

export interface ExpeditionPrete {
  readonly id: IdentifiantDExpedition;
  readonly statut: "prete";
  readonly mandat: MandatDExpedition;
  readonly prevision: PrevisionDExpedition;
  readonly progressionPourcent: 0;
  readonly dureeActiveSecondes: 0;
  readonly rapports: readonly [];
  readonly mouvementsDeStocks: readonly [];
}

export interface ExpeditionEnCours
  extends Omit<
    ExpeditionPrete,
    | "statut"
    | "progressionPourcent"
    | "dureeActiveSecondes"
    | "rapports"
    | "mouvementsDeStocks"
  > {
  readonly statut: "en-cours";
  readonly progressionPourcent: 0 | 18 | 41 | 68;
  readonly dureeActiveSecondes: number;
  readonly lanceeA: number;
  readonly ordreRequis: null;
  readonly rapports: readonly RapportDExpedition[];
  readonly mouvementsDeStocks: readonly MouvementDeStockDExpedition[];
}

export interface ExpeditionEnAttenteDOrdre
  extends Omit<ExpeditionEnCours, "statut" | "ordreRequis"> {
  readonly statut: "ordre-requis";
  readonly ordreRequis: {
    readonly motifs: readonly MotifDOrdreDistant[];
  };
}

export type IntentionDOrdreDistant =
  | "couper-contourner"
  | "forcer-galerie"
  | "ordonner-repli";

export interface OrdreDistantDExpedition {
  readonly intention: IntentionDOrdreDistant;
  readonly moment: number;
  readonly cause: "ecart.salle-des-pompes-alimentee";
}

export interface PrevisionDExpedition {
  readonly coutsConnus: readonly Omit<MouvementDeStockDExpedition, "moment">[];
  readonly coutOpportunite: "liora-quitte-atelier-operations";
  readonly dureeSecondes: { readonly minimum: number; readonly maximum: number };
  readonly sourceDuree: {
    readonly id: string;
    readonly releveA: number;
  };
  readonly gainAutonomieEauJours: { readonly minimum: number; readonly maximum: number };
  readonly sourceGain: {
    readonly id: string;
    readonly releveA: number;
  };
  readonly risque: {
    readonly id: string;
    readonly intensite: string;
    readonly mitigation: string;
    readonly pireConsequence: string;
  };
}

export interface BilanDExpedition {
  readonly prevision: PrevisionDExpedition;
  readonly realise: {
    readonly dureeSecondes: number;
    readonly gainAutonomieEauJours: number;
  };
  readonly couts: readonly Omit<MouvementDeStockDExpedition, "moment">[];
  readonly gains: readonly Omit<MouvementDeStockDExpedition, "moment">[];
  readonly ordres: readonly IntentionDOrdreDistant[];
  readonly blessures: readonly string[];
  readonly renseignements: readonly string[];
  readonly engagements: readonly string[];
  readonly cicatrices: readonly string[];
  readonly ecarts: readonly {
    readonly cause: string;
    readonly consequence: string;
  }[];
}

export interface ExpeditionEnRetour
  extends Omit<
    ExpeditionEnAttenteDOrdre,
    "statut" | "progressionPourcent" | "ordreRequis"
  > {
  readonly statut: "retour";
  readonly progressionPourcent: 70 | 92;
  readonly ordreRequis: null;
  readonly ordresDistants: readonly [OrdreDistantDExpedition];
  readonly retourA: number;
  readonly dureeCibleSecondes: number;
}

export interface ExpeditionTerminee
  extends Omit<
    ExpeditionEnRetour,
    "statut" | "progressionPourcent" | "dureeActiveSecondes"
  > {
  readonly statut: "terminee";
  readonly progressionPourcent: 100;
  readonly dureeActiveSecondes: number;
  readonly bilan: BilanDExpedition;
}

export type Expedition =
  | ExpeditionPrete
  | ExpeditionEnCours
  | ExpeditionEnAttenteDOrdre
  | ExpeditionEnRetour
  | ExpeditionTerminee;

export interface EtatDesExpeditions {
  readonly operations: readonly Expedition[];
}

export interface CommandeDeLancementDExpedition {
  readonly type: "expedition.lancer";
  readonly expeditionId: IdentifiantDExpedition;
}

export interface CommandeDOrdreDistantDExpedition {
  readonly type: "expedition.ordonner";
  readonly expeditionId: IdentifiantDExpedition;
  readonly intention: IntentionDOrdreDistant;
}

export type CommandeDExpedition =
  | CommandeDeLancementDExpedition
  | CommandeDOrdreDistantDExpedition;

export type EvenementDExpedition =
  | {
      readonly type: "expedition.lancee";
      readonly expeditionId: IdentifiantDExpedition;
      readonly moment: number;
    }
  | {
      readonly type: "expedition.rapport-emis";
      readonly expeditionId: IdentifiantDExpedition;
      readonly rapportType: RapportDExpedition["type"];
      readonly moment: number;
    }
  | {
      readonly type: "expedition.ecart-resolu-autonomement";
      readonly expeditionId: IdentifiantDExpedition;
      readonly ecartId: "passerelle-rompue" | "sas-contamine";
      readonly moment: number;
    }
  | {
      readonly type: "expedition.ordre-requis";
      readonly expeditionId: IdentifiantDExpedition;
      readonly motifs: readonly MotifDOrdreDistant[];
      readonly moment: number;
    }
  | {
      readonly type: "expedition.ordre-transmis";
      readonly expeditionId: IdentifiantDExpedition;
      readonly intention: IntentionDOrdreDistant;
      readonly moment: number;
    }
  | {
      readonly type: "expedition.terminee";
      readonly expeditionId: IdentifiantDExpedition;
      readonly intention: IntentionDOrdreDistant;
      readonly moment: number;
    };

export type MotifDOrdreDistant =
  | "changement-objectif"
  | "seuil-de-repli-franchi"
  | "consequence-irreversible"
  | "cout-hors-mandat";

export interface EcartDExpedition {
  readonly reversible: boolean;
  readonly dureeSupplementaireSecondes: number;
  readonly depenseRemedes: number;
  readonly changementObjectif: boolean;
  readonly seuilDeRepliFranchi: boolean;
  readonly consequenceIrreversible: boolean;
  readonly coutHorsMandat: boolean;
}

export function classerEcartDExpedition(
  ecart: EcartDExpedition,
): "autonome" | "ordre-requis" {
  return ecart.reversible &&
    ecart.dureeSupplementaireSecondes <=
      EXPEDITION_DES_VANNES_GRISES.mandat.enveloppeAutonomie
        .ecartReversibleMaxSecondes &&
    ecart.depenseRemedes <=
      EXPEDITION_DES_VANNES_GRISES.mandat.enveloppeAutonomie
        .depenseMineureRemedesMax &&
    !ecart.changementObjectif &&
    !ecart.seuilDeRepliFranchi &&
    !ecart.consequenceIrreversible &&
    !ecart.coutHorsMandat
    ? "autonome"
    : "ordre-requis";
}

export function creerFaitPourRapportDExpedition(
  expeditionId: IdentifiantDExpedition,
  rapport: RapportDExpedition,
): FaitDeCampagne {
  return {
    id: `expedition.${expeditionId}.${rapport.type}.${rapport.cause}`,
    cause: rapport.cause,
    acteurs: rapport.acteurs,
    cible: rapport.cible,
    moment: rapport.moment,
    effets: { materiels: [], humains: [] },
  };
}

const COUTS_DE_DEPART = [
  { moment: 0, stock: "vivres", variation: -331.2 },
  { moment: 0, stock: "eau", variation: -182.4 },
  { moment: 0, stock: "materiaux", variation: -2 },
] as const satisfies readonly MouvementDeStockDExpedition[];

export const PREVISION_VANNES_GRISES = Object.freeze({
  coutsConnus: COUTS_DE_DEPART.map(({ stock, variation }) => ({
    stock,
    variation,
  })),
  coutOpportunite: "liora-quitte-atelier-operations",
  dureeSecondes: { minimum: 15_000, maximum: 19_200 },
  sourceDuree: { id: "itineraire-des-vanniers", releveA: -172_800 },
  gainAutonomieEauJours: { minimum: 1.8, maximum: 2.7 },
  sourceGain: {
    id: "debit-mesure-par-les-vanniers",
    releveA: -777_600,
  },
  risque: {
    id: "exposition-cendre",
    intensite: "marquee",
    mitigation: "filtres-doubles",
    pireConsequence: "blessure-membre-equipe",
  },
} as const satisfies PrevisionDExpedition);

export function creerEtatDesExpeditionsInitial(): EtatDesExpeditions {
  return {
    operations: [
      {
        ...EXPEDITION_DES_VANNES_GRISES,
        prevision: PREVISION_VANNES_GRISES,
        statut: "prete",
        progressionPourcent: 0,
        dureeActiveSecondes: 0,
        rapports: [],
        mouvementsDeStocks: [],
      },
    ],
  };
}

export const COMPROMIS_D_ORDRE_VANNES_GRISES = Object.freeze({
  "couper-contourner": {
    dureeRetourSecondes: 9_000,
    dureeSupplementaireSecondes: { minimum: 2_700, maximum: 2_700 },
    gainAutonomieEauJours: { minimum: 1.2, maximum: 1.9 },
  },
  "forcer-galerie": {
    dureeRetourSecondes: 7_500,
    dureeSupplementaireSecondes: { minimum: 900, maximum: 1_500 },
    gainAutonomieEauJours: { minimum: 2.2, maximum: 2.9 },
  },
  "ordonner-repli": {
    dureeRetourSecondes: 6_300,
    dureeSupplementaireSecondes: { minimum: 0, maximum: 0 },
    gainAutonomieEauJours: { minimum: 0, maximum: 0 },
  },
} as const satisfies Record<
  IntentionDOrdreDistant,
  {
    readonly dureeRetourSecondes: number;
    readonly dureeSupplementaireSecondes: {
      readonly minimum: number;
      readonly maximum: number;
    };
    readonly gainAutonomieEauJours: {
      readonly minimum: number;
      readonly maximum: number;
    };
  }
>);

const ISSUES_PAR_INTENTION = {
  "couper-contourner": {
    progressionPourcent: 92,
    dureeCibleSecondes:
      9_420 +
      COMPROMIS_D_ORDRE_VANNES_GRISES["couper-contourner"]
        .dureeRetourSecondes,
    gainAutonomieEauJours: 1.6,
    gainEau: 1_459.2,
    blessures: [],
    renseignements: ["debit-reduit-vannes-grises-confirme"],
    engagements: [],
    cicatrices: [],
    ecarts: [
      {
        cause: "alimentation-coupee",
        consequence: "debit-reduit-retour-sur",
      },
    ],
  },
  "forcer-galerie": {
    progressionPourcent: 92,
    dureeCibleSecondes:
      9_420 +
      COMPROMIS_D_ORDRE_VANNES_GRISES["forcer-galerie"]
        .dureeRetourSecondes,
    gainAutonomieEauJours: 2.6,
    gainEau: 2_371.2,
    blessures: ["exposition-cendre-traitee"],
    renseignements: ["debit-fort-vannes-grises-confirme"],
    engagements: [],
    cicatrices: ["liora.exposition-prolongee"],
    ecarts: [
      {
        cause: "galerie-forcee",
        consequence: "une-exposition-traitee",
      },
    ],
  },
  "ordonner-repli": {
    progressionPourcent: 70,
    dureeCibleSecondes:
      9_420 +
      COMPROMIS_D_ORDRE_VANNES_GRISES["ordonner-repli"]
        .dureeRetourSecondes,
    gainAutonomieEauJours: 0,
    gainEau: 0,
    blessures: [],
    renseignements: ["salle-des-pompes-balisee"],
    engagements: [],
    cicatrices: [],
    ecarts: [
      {
        cause: "repli-ordonne",
        consequence: "pompe-inactive-equipe-intacte",
      },
    ],
  },
} as const satisfies Record<
  IntentionDOrdreDistant,
  {
    readonly progressionPourcent: 70 | 92;
    readonly dureeCibleSecondes: number;
    readonly gainAutonomieEauJours: number;
    readonly gainEau: number;
    readonly blessures: readonly string[];
    readonly renseignements: readonly string[];
    readonly engagements: readonly string[];
    readonly cicatrices: readonly string[];
    readonly ecarts: readonly { readonly cause: string; readonly consequence: string }[];
  }
>;

export function ordonnerExpedition(
  etat: EtatDesExpeditions,
  commande: CommandeDOrdreDistantDExpedition,
  moment: number,
): {
  readonly etat: EtatDesExpeditions;
  readonly evenements: readonly EvenementDExpedition[];
} {
  const indexOperation = etat.operations.findIndex(
    (operation) => operation.id === commande.expeditionId,
  );
  const operation = etat.operations[indexOperation];
  if (operation === undefined) {
    throw new Error(`L’Expédition « ${commande.expeditionId} » est inconnue.`);
  }
  if (operation.statut !== "ordre-requis") {
    throw new Error("L’Expédition des Vannes Grises n’attend aucun ordre.");
  }
  const issue = ISSUES_PAR_INTENTION[commande.intention];
  const ordre: OrdreDistantDExpedition = {
    intention: commande.intention,
    moment,
    cause: "ecart.salle-des-pompes-alimentee",
  };
  const rapport: RapportDExpedition = {
    type: "ordre-distant",
    moment,
    cause: `ordre.${commande.intention}`,
    acteurs: ["porte-lanterne", "liora", "equipe-vannes-grises"],
    cible: "salle-des-pompes",
  };
  const operationEnRetour: ExpeditionEnRetour = {
    ...operation,
    statut: "retour",
    progressionPourcent: issue.progressionPourcent,
    ordreRequis: null,
    ordresDistants: [ordre],
    retourA: moment + issue.dureeCibleSecondes - operation.dureeActiveSecondes,
    dureeCibleSecondes: issue.dureeCibleSecondes,
    rapports: [...operation.rapports, rapport],
  };
  return {
    etat: {
      operations: etat.operations.map((candidate, index) =>
        index === indexOperation ? operationEnRetour : candidate,
      ),
    },
    evenements: [
      {
        type: "expedition.ordre-transmis",
        expeditionId: operation.id,
        intention: commande.intention,
        moment,
      },
      {
        type: "expedition.rapport-emis",
        expeditionId: operation.id,
        rapportType: "ordre-distant",
        moment,
      },
    ],
  };
}

export function lancerExpedition(
  etat: EtatDesExpeditions,
  commande: CommandeDeLancementDExpedition,
  moment: number,
): {
  readonly etat: EtatDesExpeditions;
  readonly mouvementsDeStocks: readonly MouvementDeStockDExpedition[];
  readonly evenements: readonly EvenementDExpedition[];
} {
  const indexOperation = etat.operations.findIndex(
    (operation) => operation.id === commande.expeditionId,
  );
  const operation = etat.operations[indexOperation];
  if (operation === undefined) {
    throw new Error(`L’Expédition « ${commande.expeditionId} » est inconnue.`);
  }
  if (operation.statut !== "prete") {
    throw new Error("L’Expédition des Vannes Grises est déjà partie.");
  }

  const rapport: RapportDExpedition = {
    type: "depart",
    moment,
    cause: "mandat.vannes-grises.confirme",
    acteurs: ["porte-lanterne", "liora", "equipe-vannes-grises"],
    cible: "station-vannes-grises",
  };
  const mouvementsDeStocks = COUTS_DE_DEPART.map((mouvement) => ({
    ...mouvement,
    moment,
  }));
  return {
    etat: {
      operations: etat.operations.map((candidate, index) =>
        index === indexOperation
          ? {
              ...operation,
              statut: "en-cours",
              lanceeA: moment,
              ordreRequis: null,
              rapports: [rapport],
              mouvementsDeStocks,
            }
          : candidate,
      ),
    },
    mouvementsDeStocks,
    evenements: [
      {
        type: "expedition.lancee",
        expeditionId: operation.id,
        moment,
      },
      {
        type: "expedition.rapport-emis",
        expeditionId: operation.id,
        rapportType: "depart",
        moment,
      },
    ],
  };
}

interface JalonDExpedition {
  readonly dureeActiveSecondes: number;
  readonly progressionPourcent: 18 | 41 | 68;
  readonly rapport: Omit<RapportDExpedition, "moment">;
  readonly ecart?: EcartDExpedition;
  readonly ecartId?: "passerelle-rompue" | "sas-contamine";
  readonly motifs?: readonly MotifDOrdreDistant[];
}

const JALONS_D_EXPEDITION: readonly JalonDExpedition[] = [
  {
    dureeActiveSecondes: 2_520,
    progressionPourcent: 18,
    rapport: {
      type: "jalon",
      cause: "jalon.canal-sec",
      acteurs: ["liora", "equipe-vannes-grises"],
      cible: "canal-sec",
    },
  },
  {
    dureeActiveSecondes: 5_760,
    progressionPourcent: 41,
    rapport: {
      type: "ecart-autonome",
      cause: "ecart.passerelle-rompue",
      acteurs: ["liora", "equipe-vannes-grises"],
      cible: "passerelle-rompue",
    },
    ecart: {
      reversible: true,
      dureeSupplementaireSecondes: 1_800,
      depenseRemedes: 0,
      changementObjectif: false,
      seuilDeRepliFranchi: false,
      consequenceIrreversible: false,
      coutHorsMandat: false,
    },
    ecartId: "passerelle-rompue",
  },
  {
    dureeActiveSecondes: 9_420,
    progressionPourcent: 68,
    rapport: {
      type: "ecart-autonome",
      cause: "ecart.sas-contamine",
      acteurs: ["liora", "equipe-vannes-grises"],
      cible: "sas-contamine",
    },
    ecart: {
      reversible: true,
      dureeSupplementaireSecondes: 900,
      depenseRemedes: 1,
      changementObjectif: false,
      seuilDeRepliFranchi: false,
      consequenceIrreversible: false,
      coutHorsMandat: false,
    },
    ecartId: "sas-contamine",
  },
  {
    dureeActiveSecondes: 9_420,
    progressionPourcent: 68,
    rapport: {
      type: "rupture-mandat",
      cause: "ecart.salle-des-pompes-alimentee",
      acteurs: ["liora", "equipe-vannes-grises"],
      cible: "salle-des-pompes",
    },
    ecart: {
      reversible: false,
      dureeSupplementaireSecondes: 0,
      depenseRemedes: 0,
      changementObjectif: true,
      seuilDeRepliFranchi: false,
      consequenceIrreversible: true,
      coutHorsMandat: true,
    },
    motifs: [
      "changement-objectif",
      "consequence-irreversible",
      "cout-hors-mandat",
    ],
  },
];

const ECARTS_AUTONOMES_VANNES_GRISES = [
  {
    cause: "passerelle-rompue",
    consequence: "detour-reversible-sans-depasser-mandat",
  },
  {
    cause: "sas-contamine",
    consequence: "filtre-double-engage-dans-le-mandat",
  },
] as const;

function progressionPourDuree(duree: number): 0 | 18 | 41 | 68 {
  if (duree >= 9_420) {
    return 68;
  }
  if (duree >= 5_760) {
    return 41;
  }
  return duree >= 2_520 ? 18 : 0;
}

function traiterEcheancesDUneExpedition(
  etat: EtatDesExpeditions,
  secondeInitiale: number,
  secondeFinale: number,
): {
  readonly etat: EtatDesExpeditions;
  readonly evenements: readonly EvenementDExpedition[];
  readonly mouvementsDeStocks: readonly MouvementDeStockDExpedition[];
} {
  const operation = etat.operations[0];
  if (operation.statut === "retour") {
    const secondesEcoulees = Math.max(0, secondeFinale - secondeInitiale);
    const dureeFinale = Math.min(
      operation.dureeCibleSecondes,
      operation.dureeActiveSecondes + secondesEcoulees,
    );
    if (secondeFinale < operation.retourA) {
      return {
        etat: {
          operations: [{ ...operation, dureeActiveSecondes: dureeFinale }],
        },
        evenements: [],
        mouvementsDeStocks: [],
      };
    }

    const intention = operation.ordresDistants[0].intention;
    const issue = ISSUES_PAR_INTENTION[intention];
    const gain: MouvementDeStockDExpedition | undefined =
      issue.gainEau === 0
        ? undefined
        : {
            moment: operation.retourA,
            stock: "eau",
            variation: issue.gainEau,
          };
    const rapport: RapportDExpedition = {
      type: "retour",
      moment: operation.retourA,
      cause: `ordre.${intention}`,
      acteurs: ["liora", "equipe-vannes-grises"],
      cible: "atelier-operations",
    };
    const gains =
      gain === undefined
        ? []
        : [{ stock: gain.stock, variation: gain.variation }];
    const bilan: BilanDExpedition = {
      prevision: operation.prevision,
      realise: {
        dureeSecondes: operation.retourA - operation.lanceeA,
        gainAutonomieEauJours: issue.gainAutonomieEauJours,
      },
      couts: operation.mouvementsDeStocks
        .filter((mouvement) => mouvement.variation < 0)
        .map(({ stock, variation }) => ({ stock, variation })),
      gains,
      ordres: [intention],
      blessures: issue.blessures,
      renseignements: issue.renseignements,
      engagements: issue.engagements,
      cicatrices: issue.cicatrices,
      ecarts: [...ECARTS_AUTONOMES_VANNES_GRISES, ...issue.ecarts],
    };
    const operationTerminee: ExpeditionTerminee = {
      ...operation,
      statut: "terminee",
      progressionPourcent: 100,
      dureeActiveSecondes: operation.dureeCibleSecondes,
      rapports: [...operation.rapports, rapport],
      mouvementsDeStocks:
        gain === undefined
          ? operation.mouvementsDeStocks
          : [...operation.mouvementsDeStocks, gain],
      bilan,
    };
    return {
      etat: { operations: [operationTerminee] },
      evenements: [
        {
          type: "expedition.rapport-emis",
          expeditionId: operation.id,
          rapportType: "retour",
          moment: operation.retourA,
        },
        {
          type: "expedition.terminee",
          expeditionId: operation.id,
          intention,
          moment: operation.retourA,
        },
      ],
      mouvementsDeStocks: gain === undefined ? [] : [gain],
    };
  }
  if (operation.statut !== "en-cours") {
    return { etat, evenements: [], mouvementsDeStocks: [] };
  }

  const dureeFinale = Math.min(
    9_420,
    operation.dureeActiveSecondes +
      Math.max(0, secondeFinale - secondeInitiale),
  );
  const jalonsAtteints = JALONS_D_EXPEDITION.filter(
    (jalon) =>
      jalon.dureeActiveSecondes > operation.dureeActiveSecondes &&
      jalon.dureeActiveSecondes <= dureeFinale,
  );
  const rapports = [...operation.rapports];
  const evenements: EvenementDExpedition[] = [];
  const mouvementsDeStocks: MouvementDeStockDExpedition[] = [];
  let ordreRequis: ExpeditionEnAttenteDOrdre["ordreRequis"] | null = null;

  for (const jalon of jalonsAtteints) {
    const moment = operation.lanceeA + jalon.dureeActiveSecondes;
    rapports.push({ ...jalon.rapport, moment });
    evenements.push({
      type: "expedition.rapport-emis",
      expeditionId: operation.id,
      rapportType: jalon.rapport.type,
      moment,
    });
    const classement =
      jalon.ecart === undefined
        ? undefined
        : classerEcartDExpedition(jalon.ecart);
    if (jalon.ecartId !== undefined && classement === "autonome") {
      const depenseRemedes = jalon.ecart?.depenseRemedes ?? 0;
      if (depenseRemedes > 0) {
        mouvementsDeStocks.push({
          moment,
          stock: "remedes",
          variation: -depenseRemedes,
        });
      }
      evenements.push({
        type: "expedition.ecart-resolu-autonomement",
        expeditionId: operation.id,
        ecartId: jalon.ecartId,
        moment,
      });
    }
    if (jalon.motifs !== undefined && classement === "ordre-requis") {
      ordreRequis = { motifs: jalon.motifs };
      evenements.push({
        type: "expedition.ordre-requis",
        expeditionId: operation.id,
        motifs: jalon.motifs,
        moment,
      });
    }
  }

  const operationMiseAJour = {
    ...operation,
    statut: ordreRequis === null ? "en-cours" : "ordre-requis",
    progressionPourcent: progressionPourDuree(dureeFinale),
    dureeActiveSecondes: dureeFinale,
    rapports,
    ordreRequis,
    mouvementsDeStocks: [
      ...operation.mouvementsDeStocks,
      ...mouvementsDeStocks,
    ],
  } as ExpeditionEnCours | ExpeditionEnAttenteDOrdre;
  return {
    etat: { operations: [operationMiseAJour] },
    evenements,
    mouvementsDeStocks,
  };
}

export function traiterEcheancesDExpedition(
  etat: EtatDesExpeditions,
  secondeInitiale: number,
  secondeFinale: number,
): {
  readonly etat: EtatDesExpeditions;
  readonly evenements: readonly EvenementDExpedition[];
  readonly mouvementsDeStocks: readonly MouvementDeStockDExpedition[];
} {
  const operations: Expedition[] = [];
  const evenements: EvenementDExpedition[] = [];
  const mouvementsDeStocks: MouvementDeStockDExpedition[] = [];
  for (const operation of etat.operations) {
    const transition = traiterEcheancesDUneExpedition(
      { operations: [operation] },
      secondeInitiale,
      secondeFinale,
    );
    operations.push(transition.etat.operations[0]!);
    evenements.push(...transition.evenements);
    mouvementsDeStocks.push(...transition.mouvementsDeStocks);
  }
  return { etat: { operations }, evenements, mouvementsDeStocks };
}

function secondesAvantProchaineEcheanceDUneExpedition(
  etat: EtatDesExpeditions,
  secondeCourante: number,
): number | undefined {
  const operation = etat.operations[0];
  if (operation.statut === "en-cours") {
    const prochainJalon = JALONS_D_EXPEDITION.find(
      (jalon) => jalon.dureeActiveSecondes > operation.dureeActiveSecondes,
    );
    return prochainJalon === undefined
      ? undefined
      : prochainJalon.dureeActiveSecondes - operation.dureeActiveSecondes;
  }
  return operation.statut === "retour"
    ? Math.max(0, operation.retourA - secondeCourante)
    : undefined;
}

export function secondesAvantProchaineEcheanceDExpedition(
  etat: EtatDesExpeditions,
  secondeCourante: number,
): number | undefined {
  const echeances = etat.operations
    .map((operation) =>
      secondesAvantProchaineEcheanceDUneExpedition(
        { operations: [operation] },
        secondeCourante,
      ),
    )
    .filter((secondes): secondes is number => secondes !== undefined);
  return echeances.length === 0 ? undefined : Math.min(...echeances);
}
