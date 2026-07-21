import { describe, expect, it } from "vitest";

import { creerApplicationCampagne } from "./application";

describe("application de Campagne", () => {
  it("expose une projection de lecture de la Cité-caravane", () => {
    const application = creerApplicationCampagne("CENDRE-01");

    expect(application.lireProjection()).toEqual({
      graine: "CENDRE-01",
      horloge: "00:00",
      statutDuTemps: "En marche",
      vitesse: 1,
      habitants: 184,
      phare: "actif",
      formation: "grappe",
      nombreDePlateformes: 7,
      empreinte: "8102ce44",
    });
  });
});
