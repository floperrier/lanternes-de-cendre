import { describe, expect, it } from "vitest";

import { prochaineCibleDeFocus } from "./focus";

describe("boucle de focus explicite", () => {
  const controles = ["confirmer", "annuler", "aide"] as const;

  it("avance, recule et boucle sans dépendre du moteur navigateur", () => {
    expect(
      prochaineCibleDeFocus(controles, "confirmer", false),
    ).toBe("annuler");
    expect(
      prochaineCibleDeFocus(controles, "confirmer", true),
    ).toBe("aide");
    expect(prochaineCibleDeFocus(controles, "aide", false)).toBe(
      "confirmer",
    );
  });

  it("entre par la première ou la dernière commande depuis le dialogue", () => {
    expect(prochaineCibleDeFocus(controles, null, false)).toBe(
      "confirmer",
    );
    expect(prochaineCibleDeFocus(controles, null, true)).toBe("aide");
    expect(prochaineCibleDeFocus([], null, false)).toBeUndefined();
  });
});
