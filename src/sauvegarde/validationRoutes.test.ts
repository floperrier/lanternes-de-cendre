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

  it("accepte une campagne gratuite antérieure au chargement du catalogue premium", () => {
    const initial = creerEtatDesRoutesInitial();
    const etatsGratuits = { ...initial.etatsReels };
    delete etatsGratuits["chemin-des-vanniers"];
    delete etatsGratuits["chenal-des-vannes"];

    expect(
      estEtatDesRoutes({ ...initial, etatsReels: etatsGratuits }, 0),
    ).toBe(true);
    expect(
      estEtatDesRoutes(
        {
          ...initial,
          etatsReels: {
            ...etatsGratuits,
            "route-inconnue": "praticable",
          },
        },
        0,
      ),
    ).toBe(false);
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

  it("réserve les consommations persistées aux Nacelles V7 et refuse leur falsification", () => {
    const initial = creerEtatDesRoutesInitial();
    const engagementOrdinaire = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      30,
    ).etat;
    const engagementOrdinaireGratuit = {
      ...engagementOrdinaire,
      engagements: engagementOrdinaire.engagements.map((engagement) => ({
        ...engagement,
        consommationsAppliquees: { combustible: 0, eau: 0 },
      })),
    };

    expect(estEtatDesRoutes(engagementOrdinaireGratuit, 30)).toBe(false);

    const versHautPuits = confirmerEngagementDeRoute(
      initial,
      "digue-des-puits",
      0,
    ).etat;
    const aHautPuits = traiterJalonsDeRoute(
      versHautPuits,
      0,
      360,
    ).etat;
    const versLesVanniers = confirmerEngagementDeRoute(
      aHautPuits,
      "chemin-des-vanniers",
      360,
    ).etat;
    const etatAuxVanniers = traiterJalonsDeRoute(
      versLesVanniers,
      360,
      780,
    ).etat;
    const engagementDesNacelles = confirmerEngagementDeRoute(
      etatAuxVanniers,
      "chenal-des-vannes",
      780,
      { combustible: 4, eau: 6 },
    ).etat;

    expect(estEtatDesRoutes(engagementDesNacelles, 780)).toBe(true);
    expect(
      estEtatDesRoutes(
        {
          ...engagementDesNacelles,
          engagements: engagementDesNacelles.engagements.map(
            (engagement) => ({
              ...engagement,
              consommationsAppliquees: { combustible: 1, eau: 1 },
            }),
          ),
        },
        780,
      ),
    ).toBe(false);
    expect(
      estEtatDesRoutes(
        {
          ...engagementDesNacelles,
          engagements: engagementDesNacelles.engagements.map(
            (engagement) => {
              const sansConsommations = { ...engagement };
              delete sansConsommations.consommationsAppliquees;
              return sansConsommations;
            },
          ),
        },
        780,
      ),
    ).toBe(false);
  });
});
