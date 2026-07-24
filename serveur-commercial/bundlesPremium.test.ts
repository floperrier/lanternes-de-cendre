import { describe, expect, it } from "vitest";

import { BUNDLES_PREMIUM } from "./bundlesPremium";
import { NOMS_D_ASSETS_PREMIUM } from "./donneesPremium";

describe("catalogue de bundles premium", () => {
  it("place chaque asset commercial dans exactement une région", () => {
    const urls = Object.values(BUNDLES_PREMIUM).flat();
    const noms = urls.map((url) => url.split("/").at(-1));

    expect(urls).toHaveLength(NOMS_D_ASSETS_PREMIUM.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect(new Set(noms)).toEqual(new Set(NOMS_D_ASSETS_PREMIUM));
    expect(
      Object.values(BUNDLES_PREMIUM).every(
        (bundle) => bundle.length > 0,
      ),
    ).toBe(true);
  });
});
