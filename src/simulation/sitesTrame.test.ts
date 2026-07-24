import { describe, expect, it } from "vitest";

import {
  confirmerEngagementDeRoute,
  creerEtatDesRoutesInitial,
  traiterJalonsDeRoute,
  type EtatDesRoutes,
  type IdentifiantDeTroncon,
} from "./routes";
import { calculerDevenirsDesSitesDeLaTrame } from "./sites";

function parcourir(
  troncons: readonly IdentifiantDeTroncon[],
): EtatDesRoutes {
  let routes: EtatDesRoutes = {
    ...creerEtatDesRoutesInitial(),
    position: "lisiere-trame-de-fer",
  };
  let seconde = 0;
  for (const tronconId of troncons) {
    const engagement = confirmerEngagementDeRoute(
      routes,
      tronconId,
      seconde,
    ).etat;
    const arrivee = engagement.engagements.at(-1)!.arriveeA;
    routes = traiterJalonsDeRoute(
      engagement,
      seconde,
      arrivee,
    ).etat;
    seconde = arrivee;
  }
  return routes;
}

describe("devenirs persistants des Sites de la Trame", () => {
  it("conserve les Sites soutenus par la voie principale", () => {
    const routes = parcourir([
      "rampe-de-barriere-neuve",
      "voie-des-ponts-lourds",
      "rocade-du-marche",
      "ligne-du-signal-zero",
    ]);

    expect(
      calculerDevenirsDesSitesDeLaTrame({ routes, faits: [] }),
    ).toEqual({
      barriereNeuve: "actif",
      dortoirDixSept: "actif",
      pompeNeuve: "abandonne",
      marcheDesTraverses: "actif",
      signalZero: "actif",
    });
  });

  it("conserve les Sites soutenus par l’embranchement libre", () => {
    const routes = parcourir([
      "embranchement-de-pompe-neuve",
      "galerie-des-reservoirs",
      "voie-des-citernes",
      "ligne-du-signal-zero",
    ]);

    expect(
      calculerDevenirsDesSitesDeLaTrame({ routes, faits: [] }),
    ).toEqual({
      barriereNeuve: "abandonne",
      dortoirDixSept: "abandonne",
      pompeNeuve: "actif",
      marcheDesTraverses: "actif",
      signalZero: "actif",
    });
  });
});
