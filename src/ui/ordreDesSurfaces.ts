export interface EtatDesSurfacesPrioritaires {
  readonly criseActive: boolean;
  readonly checkpointDeCriseRequis: boolean;
  readonly demonstrationTerminee: boolean;
  readonly ordreDExpedition: boolean;
  readonly evenementNarratif: boolean;
  readonly conseil: boolean;
}

export type SurfacePrioritaire =
  | "crise"
  | "checkpoint-crise"
  | "jalon-demonstration"
  | "ordre-expedition"
  | "evenement-narratif"
  | "conseil"
  | null;

export function choisirSurfacePrioritaire({
  criseActive,
  checkpointDeCriseRequis,
  demonstrationTerminee,
  ordreDExpedition,
  evenementNarratif,
  conseil,
}: EtatDesSurfacesPrioritaires): SurfacePrioritaire {
  if (criseActive) {
    return "crise";
  }
  if (checkpointDeCriseRequis) {
    return "checkpoint-crise";
  }
  if (demonstrationTerminee) {
    return "jalon-demonstration";
  }
  if (ordreDExpedition) {
    return "ordre-expedition";
  }
  if (evenementNarratif) {
    return "evenement-narratif";
  }
  return conseil ? "conseil" : null;
}
