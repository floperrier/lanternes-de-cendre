export const VERSION_CONTENU_COURANTE = 1 as const;

export const LANGUES = ["fr", "en"] as const;
export type Langue = (typeof LANGUES)[number];

export const STATUTS_APPROBATION_ASSET = [
  "pending-pull-request-review",
  "approved",
] as const;
export type StatutApprobationAsset =
  (typeof STATUTS_APPROBATION_ASSET)[number];

export const FAMILLES_D_EVENEMENTS = [
  "conflits-regionaux",
  "mystere-des-phares",
  "consequences-systemiques",
  "histoires-de-compagnons",
] as const;
export type FamilleDEvenement = (typeof FAMILLES_D_EVENEMENTS)[number];

export interface TexteCompile {
  readonly cle: string;
  readonly modele: string;
  readonly variables: readonly string[];
  readonly valeurs: Readonly<Record<string, string | number>>;
}

export type ConditionDEvenement =
  | {
      readonly type: "temps-au-moins";
      readonly secondes: number;
    }
  | {
      readonly type: "fait-present";
      readonly fait: string;
    };

export interface FaitProduit {
  readonly id: string;
  readonly cible: string;
}

export interface EffetHabitants {
  readonly type: "habitants.modifier";
  readonly valeur: number;
}

export type EffetDEvenement = EffetHabitants;

export interface ChoixDEvenement {
  readonly id: string;
  readonly effets: readonly EffetDEvenement[];
  readonly faitsProduits: readonly FaitProduit[];
}

export interface TextesDUnChoix {
  readonly intention: TexteCompile;
  readonly coutsConnus: readonly TexteCompile[];
}

export interface TextesDUnEvenement {
  readonly origine: TexteCompile;
  readonly libelleIntentions: TexteCompile;
  readonly titre: TexteCompile;
  readonly presentation: TexteCompile;
  readonly informations: readonly TexteCompile[];
  readonly variantes: Readonly<Record<string, TexteCompile>>;
  readonly choix: Readonly<Record<string, TextesDUnChoix>>;
}

export interface AssetCompile {
  readonly id: string;
  readonly fichier: string;
  readonly contientTexte: false;
  readonly alternatives: Readonly<Record<Langue, string>>;
  readonly provenance: {
    readonly fiche: string;
    readonly creeLe: string;
    readonly outil: string;
    readonly modele: string;
    readonly usage: string;
    readonly entree: string;
    readonly prompt: string;
    readonly droits: string;
    readonly empreinteSha256: string;
    readonly statutApprobation: StatutApprobationAsset;
    readonly reviseur: string | null;
  };
}

export interface EvenementDuCatalogue {
  readonly id: string;
  readonly famille: FamilleDEvenement;
  readonly themes: readonly string[];
  readonly fonction: string;
  readonly fenetre: string;
  readonly conditions: {
    readonly requises: readonly ConditionDEvenement[];
    readonly interdites: readonly ConditionDEvenement[];
  };
  readonly periodeEligibilite: {
    readonly debut: number;
    readonly fin: number;
  };
  readonly priorite: number;
  readonly epuisement: "unique";
  readonly acteurs: readonly string[];
  readonly sourcesInformations: readonly string[];
  readonly faitsLus: readonly string[];
  readonly choix: readonly ChoixDEvenement[];
  readonly consequenceDifferee: {
    readonly type: string;
    readonly cible: string;
  };
  readonly recuperation: {
    readonly type: string;
  };
  readonly variantes: readonly {
    readonly id: string;
    readonly condition: string;
  }[];
  readonly destinationEcho: string;
  readonly asset: AssetCompile | null;
  readonly textes: Readonly<Record<Langue, TextesDUnEvenement>>;
}

export interface TextesDInstallation {
  readonly nom: TexteCompile;
  readonly service: TexteCompile;
  readonly transformationsDeStocks: readonly TexteCompile[];
  readonly consequences: Readonly<
    Record<"operationnelle" | "degradee" | "hors-service", TexteCompile>
  >;
}

export interface InstallationDuCatalogue {
  readonly id: string;
  readonly textes: Readonly<Record<Langue, TextesDInstallation>>;
}

export interface CatalogueDEvenements {
  readonly version: typeof VERSION_CONTENU_COURANTE;
  readonly evenements: readonly EvenementDuCatalogue[];
  readonly installations: readonly InstallationDuCatalogue[];
}

export function figerProfondement<T>(valeur: T): T {
  if (valeur !== null && typeof valeur === "object") {
    Object.values(valeur).forEach(figerProfondement);
    Object.freeze(valeur);
  }

  return valeur;
}
