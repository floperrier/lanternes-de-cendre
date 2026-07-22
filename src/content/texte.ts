const MOTIF_VARIABLE = /\{([a-zA-Z][a-zA-Z0-9_-]*)\}/g;

export function extraireVariables(modele: string): readonly string[] {
  return [...modele.matchAll(MOTIF_VARIABLE)].map((resultat) => resultat[1]!);
}

export function remplacerVariables(
  modele: string,
  remplacement: (variable: string) => string,
): string {
  return modele.replace(MOTIF_VARIABLE, (_, variable: string) =>
    remplacement(variable),
  );
}
