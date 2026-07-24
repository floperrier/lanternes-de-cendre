import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  BUNDLES_PUBLICS,
  GestionnaireDeBundlesCampagne,
  determinerBundleRegional,
  installerBundlesPremium,
  listerAssetsDuBundle,
} from "./bundles";

describe("bundles de campagne", () => {
  beforeEach(() => {
    installerBundlesPremium({ version: 1, catalogue: { bundles: {} } });
  });

  it("associe chaque lieu à son bundle régional", () => {
    expect(determinerBundleRegional("halte-du-puits-sec")).toBe("bassins");
    expect(determinerBundleRegional("signal-zero")).toBe("trame");
    expect(determinerBundleRegional("seuil")).toBe("couronne");
    expect(determinerBundleRegional("noeud-central")).toBe("finale");
  });

  it("installe les URLs premium sans les exposer dans le catalogue public", () => {
    installerBundlesPremium({
      version: 1,
      catalogue: {
        bundles: {
          trame: [
            "/api/commercial/assets/trame-barriere-permis.webp",
          ],
        },
      },
    });

    expect(BUNDLES_PUBLICS.trame).toEqual([]);
    expect(listerAssetsDuBundle("trame")).toEqual([
      "/api/commercial/assets/trame-barriere-permis.webp",
    ]);
  });

  it("précharge sans bloquer, puis libère le bundle régional dépassé", () => {
    installerBundlesPremium({
      version: 1,
      catalogue: {
        bundles: {
          trame: [
            "/api/commercial/assets/trame-barriere-permis.webp",
          ],
        },
      },
    });
    const sources: { src: string }[] = [];
    let actionPlanifiee: (() => void) | undefined;
    const gestionnaire = new GestionnaireDeBundlesCampagne(
      () => {
        const image = { src: "", decode: vi.fn().mockResolvedValue(undefined) };
        sources.push(image);
        return image;
      },
      {
        planifier: (action) => {
          actionPlanifiee = action;
          return 1;
        },
        annuler: vi.fn(),
      },
    );

    gestionnaire.synchroniser("signal-zero", true);
    expect(sources).toHaveLength(0);
    actionPlanifiee?.();
    expect(sources.some(({ src }) => src.includes("trame-"))).toBe(true);

    const imagesDeLaTrame = sources.filter(({ src }) =>
      src.includes("trame-"),
    );
    gestionnaire.synchroniser("seuil", true);
    expect(imagesDeLaTrame.every(({ src }) => src === "")).toBe(true);
  });

  it("complète la région courante quand l’accès premium s’active", () => {
    const sources: { src: string }[] = [];
    let actionPlanifiee: (() => void) | undefined;
    const gestionnaire = new GestionnaireDeBundlesCampagne(
      () => {
        const image = { src: "", decode: vi.fn().mockResolvedValue(undefined) };
        sources.push(image);
        return image;
      },
      {
        planifier: (action) => {
          actionPlanifiee = action;
          return 1;
        },
        annuler: vi.fn(),
      },
    );
    gestionnaire.synchroniser("haut-puits", false);
    actionPlanifiee?.();
    expect(sources.some(({ src }) => src.includes("/api/commercial/"))).toBe(
      false,
    );

    installerBundlesPremium({
      version: 1,
      catalogue: {
        bundles: {
          bassins: [
            "/api/commercial/assets/haut-puits-vanniers.webp",
          ],
        },
      },
    });
    gestionnaire.synchroniser("haut-puits", true);
    actionPlanifiee?.();

    expect(
      sources.some(({ src }) => src.endsWith("haut-puits-vanniers.webp")),
    ).toBe(true);
  });
});
