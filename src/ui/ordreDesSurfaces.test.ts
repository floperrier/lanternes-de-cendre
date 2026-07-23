import { describe, expect, it } from "vitest";

import { choisirSurfacePrioritaire } from "./ordreDesSurfaces";

describe("ordre des surfaces bloquantes", () => {
  it("ne masque jamais une Crise active derrière la porte de la Démonstration", () => {
    expect(
      choisirSurfacePrioritaire({
        criseActive: true,
        checkpointDeCriseRequis: false,
        demonstrationTerminee: true,
        ordreDExpedition: true,
        evenementNarratif: true,
        conseil: true,
      }),
    ).toBe("crise");
  });

  it("réserve le checkpoint atomique avant d’afficher la porte finale", () => {
    expect(
      choisirSurfacePrioritaire({
        criseActive: false,
        checkpointDeCriseRequis: true,
        demonstrationTerminee: true,
        ordreDExpedition: true,
        evenementNarratif: true,
        conseil: true,
      }),
    ).toBe("checkpoint-crise");
  });

  it("affiche la porte avant les décisions non critiques une fois les Crises écartées", () => {
    expect(
      choisirSurfacePrioritaire({
        criseActive: false,
        checkpointDeCriseRequis: false,
        demonstrationTerminee: true,
        ordreDExpedition: true,
        evenementNarratif: true,
        conseil: true,
      }),
    ).toBe("jalon-demonstration");
  });
});
