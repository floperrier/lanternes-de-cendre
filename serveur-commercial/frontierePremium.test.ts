import { describe, expect, it } from "vitest";

import frontierePremium from "./frontierePremium.generated";

describe("inventaire de la frontière premium", () => {
  it("protège les libellés contextuels des options de route", () => {
    expect(frontierePremium.fragments).toEqual(
      expect.arrayContaining([
        "Appui appliqué : treuil principal sous charge contrôlée",
        "Applied support: main winch under controlled load",
      ]),
    );
  });
});
