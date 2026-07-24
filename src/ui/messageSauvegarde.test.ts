import { describe, expect, it } from "vitest";

import { choisirMessageDeSauvegarde } from "./messageSauvegarde";

describe("message de sauvegarde", () => {
  it("rend un checkpoint irréversible visible malgré un ancien message local", () => {
    expect(
      choisirMessageDeSauvegarde({
        messageLocal: "Sauvegarde importée et reprise.",
        statutAutomatique:
          "Point de reprise avant Solution finale enregistré.",
      }),
    ).toBe("Point de reprise avant Solution finale enregistré.");
  });

  it("conserve la priorité des erreurs asynchrones", () => {
    expect(
      choisirMessageDeSauvegarde({
        erreurAsynchrone: "Stockage indisponible.",
        messageLocal: "Export portable prêt.",
        statutAutomatique:
          "Point de reprise avant Solution finale en cours…",
      }),
    ).toBe("Stockage indisponible.");
  });
});
