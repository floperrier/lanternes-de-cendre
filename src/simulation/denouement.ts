import type { FaitDeCampagne } from "./faits";
import type {
  IdentifiantDeSolutionFinale,
  VarianteFinale,
} from "./finale";

export type DenouementDeCampagne =
  | {
      readonly statut: "en-cours";
    }
  | {
      readonly statut: "solution-finale";
      readonly solution: IdentifiantDeSolutionFinale;
      readonly variante: VarianteFinale;
      readonly cause: string;
      readonly moment: number;
    };

export const CAMPAGNE_EN_COURS: DenouementDeCampagne = Object.freeze({
  statut: "en-cours",
});

export const FAITS_D_ACHEVEMENT_DE_L_EPILOGUE = [
  "epilogue.compagnons.devenirs-partages",
  "epilogue.compagnons.devenirs-confies",
] as const;

export const FAITS_DE_REVELATION_DE_L_EPILOGUE = [
  "epilogue.revelation.registre-rendu-public",
  "epilogue.revelation.copies-confiees-aux-colonies",
] as const;

const SOLUTIONS_PAR_FAIT_DE_VARIANTE = {
  "finale.ancrage.refuge-commun": {
    solution: "ancrer",
    variante: "refuge-commun",
    cause: "finale.ancrage.la-derniere-negociation",
  },
  "finale.ancrage.citadelle-de-cendre": {
    solution: "ancrer",
    variante: "citadelle-de-cendre",
    cause: "finale.ancrage.la-derniere-negociation",
  },
  "finale.ancrage.dernier-rempart": {
    solution: "ancrer",
    variante: "dernier-rempart",
    cause: "finale.ancrage.la-derniere-negociation",
  },
  "finale.reaccord.constellation": {
    solution: "reaccorder",
    variante: "constellation",
    cause: "finale.reaccord.la-derniere-negociation-du-reseau",
  },
  "finale.reaccord.reseau-de-fer": {
    solution: "reaccorder",
    variante: "reseau-de-fer",
    cause: "finale.reaccord.la-derniere-negociation-du-reseau",
  },
  "finale.reaccord.veilles-dispersees": {
    solution: "reaccorder",
    variante: "veilles-dispersees",
    cause: "finale.reaccord.la-derniere-negociation-du-reseau",
  },
  "finale.precipitation.ciel-rendu": {
    solution: "precipiter",
    variante: "ciel-rendu",
    cause: "finale.precipitation.la-derniere-negociation-des-bassins",
  },
  "finale.precipitation.terre-des-sacrifies": {
    solution: "precipiter",
    variante: "terre-des-sacrifies",
    cause: "finale.precipitation.la-derniere-negociation-des-bassins",
  },
  "finale.precipitation.pluie-noire": {
    solution: "precipiter",
    variante: "pluie-noire",
    cause: "finale.precipitation.la-derniere-negociation-des-bassins",
  },
} as const satisfies Readonly<
  Record<
    string,
    {
      readonly solution: IdentifiantDeSolutionFinale;
      readonly variante: VarianteFinale;
      readonly cause: string;
    }
  >
>;

export function reconstruireDenouementReussi(
  faits: readonly FaitDeCampagne[],
): DenouementDeCampagne {
  const faitDeRevelation = faits.find((fait) =>
    (FAITS_DE_REVELATION_DE_L_EPILOGUE as readonly string[]).includes(
      fait.id,
    ),
  );
  const faitDAchevement = faits.find((fait) =>
    (FAITS_D_ACHEVEMENT_DE_L_EPILOGUE as readonly string[]).includes(
      fait.id,
    ),
  );
  if (faitDeRevelation === undefined || faitDAchevement === undefined) {
    return CAMPAGNE_EN_COURS;
  }

  const faitDeVariante = faits.find(
    (fait) => fait.id in SOLUTIONS_PAR_FAIT_DE_VARIANTE,
  );
  if (faitDeVariante === undefined) {
    return CAMPAGNE_EN_COURS;
  }

  const finale =
    SOLUTIONS_PAR_FAIT_DE_VARIANTE[
      faitDeVariante.id as keyof typeof SOLUTIONS_PAR_FAIT_DE_VARIANTE
    ];
  return {
    statut: "solution-finale",
    solution: finale.solution,
    variante: finale.variante,
    cause: finale.cause,
    moment: faitDAchevement.moment,
  };
}
