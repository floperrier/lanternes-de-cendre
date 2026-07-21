import { describe, expect, it } from "vitest";

import { creerApplicationCampagne, projeterCampagne } from "./application";

describe("application de Campagne", () => {
  it("expose une projection de lecture de la Cité-caravane", () => {
    const application = creerApplicationCampagne("CENDRE-01");

    expect(projeterCampagne(application.lireEtat())).toEqual({
      graine: "CENDRE-01",
      horloge: "00:00",
      dureeIso: "PT0M0S",
      statutDuTemps: "En marche",
      vitesse: 1,
      habitants: 184,
      phare: "actif",
      formation: "grappe",
      nombreDePlateformes: 7,
    });
  });
});
