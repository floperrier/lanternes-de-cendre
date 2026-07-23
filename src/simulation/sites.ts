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
