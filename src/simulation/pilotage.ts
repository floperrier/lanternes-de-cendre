import {
  IDENTIFIANTS_DE_FAITS_D_INCIDENT,
  type EffetHumainDeFait,
  type EffetMaterielDeFait,
  type FaitDeCampagne,
} from "./faits";

export const SECONDES_PAR_HEURE = 3_600;

const STOCKS_INITIAUX = {
  vivres: {
    quantite: 920,
    unite: "rations",
    fluxParHeure: -46,
    reliquatDeFlux: 0,
  },
  eau: {
    quantite: 760,
    unite: "litres",
    fluxParHeure: -38,
    reliquatDeFlux: 0,
  },
  combustible: {
    quantite: 540,
    unite: "litres",
    fluxParHeure: -30,
    reliquatDeFlux: 0,
  },
  materiaux: {
    quantite: 84,
    unite: "pieces",
    fluxParHeure: -2,
    reliquatDeFlux: 0,
  },
  remedes: {
    quantite: 36,
    unite: "doses",
    fluxParHeure: -1,
    reliquatDeFlux: 0,
  },
} as const;

const CAPACITES_INITIALES = {
  chaleur: { production: 78, demande: 70, unite: "kilowatts" },
  "main-d-oeuvre": {
    production: 12,
    demande: 9,
    unite: "equipes",
  },
  charge: { production: 80, demande: 68, unite: "tonnes" },
} as const;

export const DEFINITIONS_DE_DOCTRINE = [
  {
    id: "rationnement",
    positions: ["genereux", "mesure", "strict"],
    positionInitiale: "mesure",
  },
  {
    id: "allure",
    positions: ["prudente", "soutenue", "forcee"],
    positionInitiale: "soutenue",
  },
  {
    id: "entretien",
    positions: ["preventif", "equilibre", "urgence"],
    positionInitiale: "equilibre",
  },
  {
    id: "delestage-thermique",
    positions: ["foyers", "equilibre", "machines"],
    positionInitiale: "equilibre",
  },
] as const;

type DefinitionDeDoctrine = (typeof DEFINITIONS_DE_DOCTRINE)[number];
export type IdentifiantDeStock = keyof typeof STOCKS_INITIAUX;
export type IdentifiantDeCapacite = keyof typeof CAPACITES_INITIALES;
export type IdentifiantDePolitique = DefinitionDeDoctrine["id"];
export type PositionPourPolitique<Politique extends IdentifiantDePolitique> =
  Extract<
    DefinitionDeDoctrine,
    { readonly id: Politique }
  >["positions"][number];
export type PositionDeDoctrine = PositionPourPolitique<IdentifiantDePolitique>;

export const IDENTIFIANTS_DE_STOCK = Object.keys(
  STOCKS_INITIAUX,
) as IdentifiantDeStock[];
export const IDENTIFIANTS_DE_CAPACITE = Object.keys(
  CAPACITES_INITIALES,
) as IdentifiantDeCapacite[];
export const IDENTIFIANTS_DE_POLITIQUE = DEFINITIONS_DE_DOCTRINE.map(
  (definition) => definition.id,
);
export const POSITIONS_DE_DOCTRINE = Object.fromEntries(
  DEFINITIONS_DE_DOCTRINE.map((definition) => [
    definition.id,
    definition.positions,
  ]),
) as unknown as {
  readonly [
    Politique in IdentifiantDePolitique
  ]: readonly PositionPourPolitique<Politique>[];
};

type CommandePourDefinition<Definition extends DefinitionDeDoctrine> =
  Definition extends DefinitionDeDoctrine
    ? {
        readonly type: "doctrine.regler";
        readonly politique: Definition["id"];
        readonly position: Definition["positions"][number];
      }
    : never;

export type CommandeDeDoctrine = CommandePourDefinition<DefinitionDeDoctrine>;

export type EvenementDeDoctrine =
  | {
      readonly type: "doctrine.transition-engagee";
      readonly politique: IdentifiantDePolitique;
      readonly position: PositionDeDoctrine;
      readonly appliqueA: number;
    }
  | {
      readonly type: "doctrine.position-appliquee";
      readonly politique: IdentifiantDePolitique;
      readonly position: PositionDeDoctrine;
      readonly appliqueA: number;
    };

export function creerCommandeDeDoctrine(
  politique: IdentifiantDePolitique,
  position: PositionDeDoctrine,
): CommandeDeDoctrine {
  if (!positionsDePolitiqueRuntime(politique).includes(position)) {
    throw new Error(
      `La position « ${position} » ne convient pas à la politique « ${politique} ».`,
    );
  }

  return { type: "doctrine.regler", politique, position } as CommandeDeDoctrine;
}

function positionsDePolitiqueRuntime(politique: string): readonly string[] {
  const positions = (
    POSITIONS_DE_DOCTRINE as Readonly<
      Partial<Record<string, readonly string[]>>
    >
  )[politique];
  if (positions === undefined) {
    throw new Error(`La politique « ${politique} » est inconnue.`);
  }
  return positions;
}

export type ModeDeResolutionDIncident = "ordre-explicite" | "doctrine";
export type DecisionDIncident =
  "securiser-pompe" | "isoler-circuit" | "maintenir-debit";
export type OrdreDIncident = "securiser-pompe" | "maintenir-debit";

export interface CommandeDIncident {
  readonly type: "incident.ordonner";
  readonly incidentId: IncidentAnnonce["id"];
  readonly ordre: OrdreDIncident;
}

export const INCIDENT_INITIAL = {
  id: "purification.pompe-instable",
  titre: "Pompe de purification instable",
  cause: "Usure du joint de la pompe de purification",
  priorite: "preserver-habitants",
  annonceA: 0,
  echeance: 120,
  incertitude: {
    source: "Inspection de l’Atelier",
    releveeA: 0,
    observation: "Rupture possible avant la Halte du puits sec",
  },
} as const;

export type IncidentAnnonce = typeof INCIDENT_INITIAL;

export interface EvenementDIncidentResolu {
  readonly type: "incident.resolu";
  readonly incidentId: IncidentAnnonce["id"];
  readonly mode: ModeDeResolutionDIncident;
  readonly decision: DecisionDIncident;
  readonly cause: IncidentAnnonce["id"];
  readonly facteurs: {
    readonly entretien: PositionPourPolitique<"entretien">;
    readonly priorite: IncidentAnnonce["priorite"];
    readonly materiauxDisponibles: number;
  };
  readonly effets: FaitDeCampagne["effets"];
  readonly faitProduit: string;
  readonly moment: number;
}

export interface StockDuConvoi {
  readonly quantite: number;
  readonly unite: (typeof STOCKS_INITIAUX)[IdentifiantDeStock]["unite"];
  readonly fluxParHeure: number;
  readonly reliquatDeFlux: number;
}

export function appliquerVariationAUnStock(
  stock: StockDuConvoi,
  variation: number,
): StockDuConvoi {
  const quantite = Math.max(0, stock.quantite + variation);
  return {
    ...stock,
    quantite,
    reliquatDeFlux: quantite === 0 ? 0 : stock.reliquatDeFlux,
  };
}

export function projeterQuantiteDUnStock(
  stock: Pick<
    StockDuConvoi,
    "quantite" | "fluxParHeure" | "reliquatDeFlux"
  >,
  secondesEcoulees: number,
): number {
  const numerateur =
    stock.reliquatDeFlux + stock.fluxParHeure * secondesEcoulees;
  return Math.max(
    0,
    stock.quantite + Math.trunc(numerateur / SECONDES_PAR_HEURE),
  );
}

export interface CapaciteDuConvoi {
  readonly production: number;
  readonly demande: number;
  readonly unite: (typeof CAPACITES_INITIALES)[IdentifiantDeCapacite]["unite"];
}

type PolitiquePourDefinition<Definition extends DefinitionDeDoctrine> =
  Definition extends DefinitionDeDoctrine
    ? {
        readonly id: Definition["id"];
        readonly position: Definition["positions"][number];
        readonly transition: {
          readonly position: Definition["positions"][number];
          readonly appliqueA: number;
        } | null;
      }
    : never;

export type PolitiqueDeDoctrine = PolitiquePourDefinition<DefinitionDeDoctrine>;

export type DoctrineDuConvoi = {
  readonly [Politique in IdentifiantDePolitique]: Omit<
    Extract<PolitiqueDeDoctrine, { readonly id: Politique }>,
    "id"
  >;
};

const ENTRETIEN_INITIAL = {
  equipesMobilisees: 2,
  materiauxParHeure: 2,
} as const;

export interface EntretienDuConvoi {
  readonly equipesMobilisees: number;
  readonly materiauxParHeure: number;
}

const PROCHAIN_JALON_INITIAL = {
  nom: "Halte du puits sec",
  atteintA: 10_800,
  incertitude: {
    source: "Relevé de route du Phare",
    releveeA: 0,
    variationFluxPourcent: 10,
    explication: "Consommation variable de ±10 % selon la cendre",
  },
} as const;

export interface EtatPilotage {
  readonly economie: {
    readonly stocks: Readonly<Record<IdentifiantDeStock, StockDuConvoi>>;
    readonly capacites: Readonly<
      Record<IdentifiantDeCapacite, CapaciteDuConvoi>
    >;
    readonly entretien: EntretienDuConvoi;
    readonly prochainJalon: typeof PROCHAIN_JALON_INITIAL;
  };
  readonly doctrine: DoctrineDuConvoi;
  readonly incidentActif: IncidentAnnonce | null;
}

export function creerPilotageInitial(): EtatPilotage {
  const doctrine = Object.fromEntries(
    DEFINITIONS_DE_DOCTRINE.map((definition) => [
      definition.id,
      { position: definition.positionInitiale, transition: null },
    ]),
  ) as DoctrineDuConvoi;

  return {
    economie: {
      stocks: Object.fromEntries(
        IDENTIFIANTS_DE_STOCK.map((id) => [id, { ...STOCKS_INITIAUX[id] }]),
      ) as Readonly<Record<IdentifiantDeStock, StockDuConvoi>>,
      capacites: Object.fromEntries(
        IDENTIFIANTS_DE_CAPACITE.map((id) => [
          id,
          { ...CAPACITES_INITIALES[id] },
        ]),
      ) as Readonly<Record<IdentifiantDeCapacite, CapaciteDuConvoi>>,
      entretien: ENTRETIEN_INITIAL,
      prochainJalon: PROCHAIN_JALON_INITIAL,
    },
    doctrine,
    incidentActif: INCIDENT_INITIAL,
  };
}

export function engagerTransitionDeDoctrine(
  etat: EtatPilotage,
  commande: CommandeDeDoctrine,
  secondeCourante: number,
): { readonly etat: EtatPilotage; readonly evenements: EvenementDeDoctrine[] } {
  if (
    !positionsDePolitiqueRuntime(commande.politique).includes(commande.position)
  ) {
    throw new Error(
      `La position « ${commande.position} » ne convient pas à la politique « ${commande.politique} ».`,
    );
  }

  const politiqueCourante = etat.doctrine[commande.politique];
  if (
    politiqueCourante.position === commande.position &&
    politiqueCourante.transition === null
  ) {
    return { etat, evenements: [] };
  }

  const appliqueA = secondeCourante + 30;
  return {
    etat: {
      ...etat,
      doctrine: {
        ...etat.doctrine,
        [commande.politique]: {
          position: politiqueCourante.position,
          transition: {
            position: commande.position,
            appliqueA,
          },
        },
      },
    },
    evenements: [
      {
        type: "doctrine.transition-engagee",
        politique: commande.politique,
        position: commande.position,
        appliqueA,
      },
    ],
  };
}

interface ResolutionDIncident {
  readonly decision: DecisionDIncident;
  readonly coutMateriaux: number;
  readonly idDuFait: string;
  readonly etatDeLaPompe: "securisee" | "stabilisee" | "degradee";
  readonly effetHumain: EffetHumainDeFait;
}

function securiserPompe(): ResolutionDIncident {
  return {
    decision: "securiser-pompe",
    coutMateriaux: 3,
    idDuFait: IDENTIFIANTS_DE_FAITS_D_INCIDENT[0],
    etatDeLaPompe: "securisee",
    effetHumain: { type: "habitants.exposes", nombre: 0 },
  };
}

function choisirResolutionAutomatique(etat: EtatPilotage): ResolutionDIncident {
  const materiaux = etat.economie.stocks.materiaux.quantite;
  const entretien = etat.doctrine.entretien.position;

  if (entretien === "preventif" && materiaux >= 3) {
    return securiserPompe();
  }

  if (
    etat.incidentActif?.priorite === "preserver-habitants" &&
    materiaux >= 2
  ) {
    return {
      decision: "isoler-circuit",
      coutMateriaux: 2,
      idDuFait: IDENTIFIANTS_DE_FAITS_D_INCIDENT[1],
      etatDeLaPompe: "stabilisee",
      effetHumain: { type: "habitants.exposes", nombre: 0 },
    };
  }

  return {
    decision: "maintenir-debit",
    coutMateriaux: 0,
    idDuFait: IDENTIFIANTS_DE_FAITS_D_INCIDENT[2],
    etatDeLaPompe: "degradee",
    effetHumain: { type: "habitants.sous-surveillance", nombre: 2 },
  };
}

function choisirResolutionExplicite(
  etat: EtatPilotage,
  ordre: OrdreDIncident,
): ResolutionDIncident {
  if (ordre === "securiser-pompe") {
    if (etat.economie.stocks.materiaux.quantite < 3) {
      throw new Error(
        "L’ordre de sécuriser la pompe exige 3 Matériaux disponibles.",
      );
    }

    return securiserPompe();
  }

  return {
    decision: "maintenir-debit",
    coutMateriaux: 0,
    idDuFait: IDENTIFIANTS_DE_FAITS_D_INCIDENT[2],
    etatDeLaPompe: "degradee",
    effetHumain: { type: "habitants.sous-surveillance", nombre: 2 },
  };
}

function appliquerResolutionDIncident(
  etat: EtatPilotage,
  resolution: ResolutionDIncident,
  mode: ModeDeResolutionDIncident,
  moment: number,
): {
  readonly etat: EtatPilotage;
  readonly evenement: EvenementDIncidentResolu;
  readonly fait: FaitDeCampagne;
} {
  const incident = etat.incidentActif;
  if (incident === null) {
    throw new Error("Aucun Incident annoncé ne peut être résolu.");
  }

  const materiauxDisponibles = etat.economie.stocks.materiaux.quantite;
  const effetsMateriels: EffetMaterielDeFait[] = [];
  if (resolution.coutMateriaux > 0) {
    effetsMateriels.push({
      type: "stock.modifie",
      stock: "materiaux",
      variation: -resolution.coutMateriaux,
    });
  }
  effetsMateriels.push({
    type: "installation.etat-modifie",
    installation: "pompe-purification",
    etat: resolution.etatDeLaPompe,
  });
  const fait: FaitDeCampagne = {
    id: resolution.idDuFait,
    cause: incident.id,
    acteurs: ["porte-lanterne", "equipes-entretien"],
    cible: "pompe-purification",
    moment,
    effets: {
      materiels: effetsMateriels,
      humains: [resolution.effetHumain],
    },
  };
  const evenement: EvenementDIncidentResolu = {
    type: "incident.resolu",
    incidentId: incident.id,
    mode,
    decision: resolution.decision,
    cause: incident.id,
    facteurs: {
      entretien: etat.doctrine.entretien.position,
      priorite: incident.priorite,
      materiauxDisponibles,
    },
    effets: fait.effets,
    faitProduit: fait.id,
    moment,
  };

  return {
    etat: {
      ...etat,
      economie: {
        ...etat.economie,
        stocks: {
          ...etat.economie.stocks,
          materiaux: {
            ...etat.economie.stocks.materiaux,
            quantite: materiauxDisponibles - resolution.coutMateriaux,
          },
        },
      },
      incidentActif: null,
    },
    evenement,
    fait,
  };
}

type EcheanceDePilotage =
  | {
      readonly type: "doctrine";
      readonly moment: number;
      readonly priorite: 10;
      readonly identifiant: string;
      readonly politique: IdentifiantDePolitique;
    }
  | {
      readonly type: "incident";
      readonly moment: number;
      readonly priorite: 20;
      readonly identifiant: string;
    };

export function traiterEcheancesDePilotage(
  etat: EtatPilotage,
  secondeInitiale: number,
  secondeFinale: number,
): {
  readonly etat: EtatPilotage;
  readonly evenements: readonly (
    EvenementDeDoctrine | EvenementDIncidentResolu
  )[];
  readonly faitsProduits: readonly FaitDeCampagne[];
} {
  const echeances: EcheanceDePilotage[] = [];

  for (const politique of IDENTIFIANTS_DE_POLITIQUE) {
    const transition = etat.doctrine[politique].transition;
    if (transition !== null && transition.appliqueA <= secondeFinale) {
      echeances.push({
        type: "doctrine",
        moment: transition.appliqueA,
        priorite: 10,
        identifiant: `doctrine.${politique}`,
        politique,
      });
    }
  }

  if (
    etat.incidentActif !== null &&
    etat.incidentActif.echeance <= secondeFinale
  ) {
    echeances.push({
      type: "incident",
      moment: etat.incidentActif.echeance,
      priorite: 20,
      identifiant: `incident.${etat.incidentActif.id}`,
    });
  }

  echeances.sort((gauche, droite) => {
    if (gauche.moment !== droite.moment) {
      return gauche.moment - droite.moment;
    }
    if (gauche.priorite !== droite.priorite) {
      return gauche.priorite - droite.priorite;
    }
    return gauche.identifiant < droite.identifiant
      ? -1
      : gauche.identifiant > droite.identifiant
        ? 1
        : 0;
  });

  let nouvelEtat = etat;
  let curseur = secondeInitiale;
  const evenements: Array<EvenementDeDoctrine | EvenementDIncidentResolu> = [];
  const faitsProduits: FaitDeCampagne[] = [];

  for (const echeance of echeances) {
    const momentDEcheance = Math.max(curseur, echeance.moment);
    nouvelEtat = appliquerFluxEconomiques(
      nouvelEtat,
      momentDEcheance - curseur,
    );
    curseur = momentDEcheance;

    if (echeance.type === "doctrine") {
      const transition = nouvelEtat.doctrine[echeance.politique].transition;
      if (transition === null || transition.appliqueA !== echeance.moment) {
        continue;
      }
      nouvelEtat = {
        ...nouvelEtat,
        doctrine: {
          ...nouvelEtat.doctrine,
          [echeance.politique]: {
            position: transition.position,
            transition: null,
          },
        },
      };
      evenements.push({
        type: "doctrine.position-appliquee",
        politique: echeance.politique,
        position: transition.position,
        appliqueA: transition.appliqueA,
      });
      continue;
    }

    if (nouvelEtat.incidentActif === null) {
      continue;
    }
    const resolution = appliquerResolutionDIncident(
      nouvelEtat,
      choisirResolutionAutomatique(nouvelEtat),
      "doctrine",
      echeance.moment,
    );
    nouvelEtat = resolution.etat;
    evenements.push(resolution.evenement);
    faitsProduits.push(resolution.fait);
  }

  nouvelEtat = appliquerFluxEconomiques(nouvelEtat, secondeFinale - curseur);

  return { etat: nouvelEtat, evenements, faitsProduits };
}

function appliquerFluxEconomiques(
  etat: EtatPilotage,
  secondesEcoulees: number,
): EtatPilotage {
  if (secondesEcoulees <= 0) {
    return etat;
  }

  const stocks = { ...etat.economie.stocks };
  for (const id of IDENTIFIANTS_DE_STOCK) {
    const stock = stocks[id];
    const numerateur =
      stock.reliquatDeFlux + stock.fluxParHeure * secondesEcoulees;
    const variation = Math.trunc(numerateur / SECONDES_PAR_HEURE);
    const quantite = projeterQuantiteDUnStock(stock, secondesEcoulees);
    stocks[id] = {
      ...stock,
      quantite,
      reliquatDeFlux:
        quantite === 0 ? 0 : numerateur - variation * SECONDES_PAR_HEURE,
    };
  }

  return {
    ...etat,
    economie: {
      ...etat.economie,
      stocks,
    },
  };
}

export function ordonnerResolutionDIncident(
  etat: EtatPilotage,
  commande: CommandeDIncident,
  secondeCourante: number,
): {
  readonly etat: EtatPilotage;
  readonly evenements: readonly EvenementDIncidentResolu[];
  readonly faitsProduits: readonly FaitDeCampagne[];
} {
  if (etat.incidentActif?.id !== commande.incidentId) {
    throw new Error(`L’Incident « ${commande.incidentId} » n’est pas annoncé.`);
  }

  const resolution = appliquerResolutionDIncident(
    etat,
    choisirResolutionExplicite(etat, commande.ordre),
    "ordre-explicite",
    secondeCourante,
  );
  return {
    etat: resolution.etat,
    evenements: [resolution.evenement],
    faitsProduits: [resolution.fait],
  };
}
