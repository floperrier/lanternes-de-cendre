import type { EffetDEvenement } from "../content/types";
import type { EtatDeLaTrameDeFer } from "./trameFer";
import type { EtatDeTraverseLibre } from "./traverseLibre";

export type OptionDeLAiguillageZero =
  | "monopole"
  | "charte"
  | "vol"
  | "transport";

interface EtatPourLAiguillageZero {
  readonly trameDeFer: EtatDeLaTrameDeFer;
  readonly traverseLibre: EtatDeTraverseLibre;
  readonly pilotage: {
    readonly economie: {
      readonly stocks: {
        readonly materiaux: { readonly quantite: number };
      };
    };
  };
  readonly narration: {
    readonly faitsDeCampagne: readonly { readonly id: string }[];
  };
}

const OPTION_PAR_CHOIX = {
  "accorder-monopole": "monopole",
  "etablir-charte": "charte",
  "soustraire-piece": "vol",
  "assurer-transport-autonome": "transport",
} as const satisfies Readonly<Record<string, OptionDeLAiguillageZero>>;

export function calculerOptionsDeLAiguillageZero(
  etat: EtatPourLAiguillageZero,
): readonly OptionDeLAiguillageZero[] {
  const faits = new Set(
    etat.narration.faitsDeCampagne.map(({ id }) => id),
  );
  return [
    ...(etat.trameDeFer.pieceDeRegulation.monopoleRepublicain ||
    faits.has("trame.marche.coupleur-officiel-acquis")
      ? (["monopole"] as const)
      : []),
    ...(etat.trameDeFer.grandAiguillage.statut === "atelier-negocie" ||
    etat.traverseLibre.aide.statut === "publique"
      ? (["charte"] as const)
      : []),
    ...(etat.traverseLibre.contournement === "praticable"
      ? (["vol"] as const)
      : []),
    "transport",
  ];
}

export function optionDuChoixDeLAiguillageZero(
  choixId: string,
): OptionDeLAiguillageZero | undefined {
  return OPTION_PAR_CHOIX[choixId as keyof typeof OPTION_PAR_CHOIX];
}

export function ajusterEffetsDuChoixDeLAiguillageZero(
  etat: EtatPourLAiguillageZero,
  evenementId: string,
  choixId: string,
  effets: readonly EffetDEvenement[],
): readonly EffetDEvenement[] {
  if (
    evenementId !== "trame.aiguillage-zero.le-conseil-des-voies"
  ) {
    return effets;
  }
  const cout = calculerCoutDynamiqueDeLAiguillageZero(etat, choixId);
  if (cout === undefined) {
    return effets;
  }
  return [
    ...effets.filter(
      (effet) =>
        effet.type !== "stock.modifier" ||
        effet.stock !== "materiaux",
    ),
    {
      type: "stock.modifier",
      stock: "materiaux",
      valeur: -cout.applique,
    },
  ];
}

export function choixDeLAiguillageZeroEstDisponible(
  etat: EtatPourLAiguillageZero,
  choixId: string,
): boolean {
  const option = optionDuChoixDeLAiguillageZero(choixId);
  return (
    option === undefined ||
    calculerOptionsDeLAiguillageZero(etat).includes(option)
  );
}

export interface CoutDynamiqueDeLAiguillageZero {
  readonly applique: number;
  readonly cible: number;
  readonly deficit: number;
  readonly preparation: "train-outil" | "attelage-federe" | "aucune";
}

export function calculerCoutDynamiqueDeLAiguillageZero(
  etat: EtatPourLAiguillageZero,
  choixId: string,
): CoutDynamiqueDeLAiguillageZero | undefined {
  if (choixId === "accorder-monopole") {
    const trainPrepare =
      etat.trameDeFer.occasions.trainOutil.statut === "annoncee" ||
      etat.trameDeFer.occasions.trainOutil.statut === "reservee";
    const cible = trainPrepare ? 2 : 10;
    return {
      applique: cible,
      cible,
      deficit: 0,
      preparation: trainPrepare ? "train-outil" : "aucune",
    };
  }
  if (choixId === "assurer-transport-autonome") {
    const attelagePrepare =
      etat.trameDeFer.occasions.attelageFedere.statut === "annoncee";
    const cible = attelagePrepare ? 6 : 14;
    const applique = Math.min(
      etat.pilotage.economie.stocks.materiaux.quantite,
      cible,
    );
    return {
      applique,
      cible,
      deficit: cible - applique,
      preparation: attelagePrepare ? "attelage-federe" : "aucune",
    };
  }
  return undefined;
}
