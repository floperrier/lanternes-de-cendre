import type { EtatDeVeilleBasse } from "./veilleBasse";
import type { EtatDesRoutes } from "./routes";

export type DevenirDeSite =
  | "actif"
  | "evacue"
  | "absorbe"
  | "abandonne";

export interface DevenirsDesSitesDesBassins {
  readonly maisonDesFiltres: DevenirDeSite;
  readonly vanniers: DevenirDeSite;
  readonly hospiceDuSillon: DevenirDeSite;
  readonly nacelles: DevenirDeSite;
  readonly trameDeFer?: DevenirsDesSitesDeLaTrame;
}

export interface DevenirsDesSitesDeLaTrame {
  readonly barriereNeuve: DevenirDeSite;
  readonly dortoirDixSept: DevenirDeSite;
  readonly pompeNeuve: DevenirDeSite;
  readonly marcheDesTraverses: DevenirDeSite;
  readonly signalZero: DevenirDeSite;
}

export function calculerDevenirsDesSitesDesBassins(contexte: {
  readonly routes: EtatDesRoutes;
  readonly veilleBasse: EtatDeVeilleBasse;
  readonly faits: readonly string[];
}): DevenirsDesSitesDesBassins {
  const lieuxParcourus = new Set(
    contexte.routes.engagements.flatMap(({ origine, destination }) => [
      origine,
      destination,
    ]),
  );
  const nacellesRencontrees =
    contexte.routes.engagements.some(
      ({ tronconId }) =>
        tronconId === "nacelles-de-veille-basse" ||
        tronconId === "chenal-des-vannes",
    ) ||
    contexte.faits.some((id) => id.startsWith("bassins.nacelles."));
  const hospiceAAbsorbeLaCohorte =
    contexte.veilleBasse.cohorte.destination === "hospice-du-sillon" ||
    contexte.veilleBasse.hospiceDuSillon.devenir === "sous-charge";
  const hospiceAEtMobilise =
    lieuxParcourus.has("hospice-du-sillon") ||
    contexte.veilleBasse.hospiceDuSillon.devenir === "renforce" ||
    contexte.veilleBasse.maelysRive.position === "hospice-du-sillon";

  return {
    maisonDesFiltres: "abandonne",
    vanniers: lieuxParcourus.has("les-vanniers") ? "actif" : "abandonne",
    hospiceDuSillon:
      contexte.veilleBasse.colonie.statut === "perdue"
        ? "evacue"
        : hospiceAAbsorbeLaCohorte
          ? "absorbe"
          : hospiceAEtMobilise
            ? "actif"
            : "abandonne",
    nacelles: nacellesRencontrees ? "actif" : "abandonne",
  };
}

export function calculerDevenirsDesSitesDeLaTrame(contexte: {
  readonly routes: EtatDesRoutes;
  readonly faits: readonly string[];
}): DevenirsDesSitesDeLaTrame {
  const lieuxParcourus = new Set([
    contexte.routes.position,
    ...contexte.routes.engagements.flatMap(({ origine, destination }) => [
      origine,
      destination,
    ]),
  ]);
  const tronconsParcourus = new Set(
    contexte.routes.engagements.map(({ tronconId }) => tronconId),
  );
  const aJoueUnEvenementDe = (prefixe: string) =>
    contexte.faits.some((id) => id.startsWith(prefixe));

  return {
    barriereNeuve:
      lieuxParcourus.has("barriere-neuve") ||
      aJoueUnEvenementDe("trame.barriere-neuve.")
        ? "actif"
        : "abandonne",
    dortoirDixSept: tronconsParcourus.has("voie-des-ponts-lourds")
      ? "actif"
      : "abandonne",
    pompeNeuve:
      lieuxParcourus.has("pompe-neuve") ||
      aJoueUnEvenementDe("trame.pompe-neuve.")
        ? "actif"
        : "abandonne",
    marcheDesTraverses:
      lieuxParcourus.has("marche-des-traverses") ||
      aJoueUnEvenementDe("trame.marche.")
        ? "actif"
        : "abandonne",
    signalZero:
      lieuxParcourus.has("signal-zero") ||
      aJoueUnEvenementDe("trame.signal-zero.")
        ? "actif"
        : "abandonne",
  };
}
