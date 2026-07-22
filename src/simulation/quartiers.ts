const OCCUPATION_DE_TETE_DE_QUARTIER = {
  type: "tete-de-quartier",
  compagnonsMaximum: 1,
  quartierFonctionnelSansCompagnon: true,
} as const;

export const QUARTIERS_MOBILES_CANONIQUES = [
  {
    id: "intendance",
    occupation: OCCUPATION_DE_TETE_DE_QUARTIER,
  },
  {
    id: "foyers",
    occupation: OCCUPATION_DE_TETE_DE_QUARTIER,
  },
  {
    id: "machines",
    occupation: OCCUPATION_DE_TETE_DE_QUARTIER,
  },
  {
    id: "atelier-operations",
    occupation: OCCUPATION_DE_TETE_DE_QUARTIER,
  },
] as const satisfies readonly {
  readonly id: string;
  readonly occupation: typeof OCCUPATION_DE_TETE_DE_QUARTIER;
}[];

export type IdentifiantQuartierMobile =
  (typeof QUARTIERS_MOBILES_CANONIQUES)[number]["id"];

export const QUARTIER_INTENDANCE = QUARTIERS_MOBILES_CANONIQUES[0];

export function trouverQuartierMobileCanonique(
  id: string,
): (typeof QUARTIERS_MOBILES_CANONIQUES)[number] | undefined {
  return QUARTIERS_MOBILES_CANONIQUES.find((quartier) => quartier.id === id);
}
