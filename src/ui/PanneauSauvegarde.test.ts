import { describe, expect, it } from "vitest";

import { choisirMessageDeSauvegarde } from "./messageSauvegarde";

describe("message du panneau de sauvegarde", () => {
  it("affiche une erreur asynchrone même après un export réussi", () => {
    expect(
      choisirMessageDeSauvegarde({
        erreurAsynchrone: "IndexedDB indisponible après l’export.",
        messageLocal: "Export portable prêt.",
        statutAutomatique: "Sauvegarde à jour.",
      }),
    ).toBe("IndexedDB indisponible après l’export.");
  });
});
