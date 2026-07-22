import { describe, expect, it } from "vitest";

import {
  confirmerEngagementDeRoute,
  creerEtatDesRoutesInitial,
  traiterJalonsDeRoute,
} from "../simulation/routes";
import { estEtatDesRoutes } from "./validationRoutes";

describe("validation persistante des routes", () => {
  it("accepte les états initiaux, engagés et arrivés produits par la simulation", () => {
    const initial = creerEtatDesRoutesInitial();
    const engagement = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      30,
    ).etat;
    const arrivee = traiterJalonsDeRoute(engagement, 30, 390).etat;

    expect(estEtatDesRoutes(initial, 30)).toBe(true);
    expect(estEtatDesRoutes(engagement, 30)).toBe(true);
    expect(estEtatDesRoutes(arrivee, 390)).toBe(true);
  });

  it("rejette les états réels, sources et Jalons impossibles", () => {
    const initial = creerEtatDesRoutesInitial();
    const engagement = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      30,
    ).etat;
    const arrivee = traiterJalonsDeRoute(engagement, 30, 390).etat;

    expect(
      estEtatDesRoutes(
        {
          ...initial,
          etatsReels: { ...initial.etatsReels, "digue-des-puits": "coupe" },
        },
        30,
      ),
    ).toBe(false);
    expect(
      estEtatDesRoutes(
        {
          ...initial,
          renseignements: [
            { ...initial.renseignements[0], source: "Source omnisciente" },
            ...initial.renseignements.slice(1),
          ],
        },
        30,
      ),
    ).toBe(false);
    expect(
      estEtatDesRoutes(
        {
          ...arrivee,
          jalons: [{ ...arrivee.jalons[0], cause: "sans-cause" }],
        },
        390,
      ),
    ).toBe(false);
    expect(estEtatDesRoutes(engagement, 391)).toBe(false);
  });
});
