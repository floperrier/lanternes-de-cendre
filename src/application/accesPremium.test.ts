import { describe, expect, it } from "vitest";

import {
  creerApplicationCampagne,
  creerPolitiqueDAccesPremium,
} from "./application";

describe("politique d’Accès premium vivante", () => {
  it("ouvre la suite sur la même Campagne dès que le droit est accordé", () => {
    let premium = false;
    const application = creerApplicationCampagne("CENDRE-01", {
      politiqueDAcces: creerPolitiqueDAccesPremium(() => premium),
    });
    application.envoyerCommande({
      type: "engagement-de-route.confirmer",
      tronconId: "digue-des-puits",
    });
    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 90,
    });
    const etatAvantAchat = application.lireEtat();
    const suite = {
      type: "haut-puits.marche.echanger" as const,
      offreId: "eau-contre-materiaux" as const,
    };

    expect(application.commandeEstAutorisee(suite)).toBe(false);
    premium = true;

    expect(application.lireEtat()).toBe(etatAvantAchat);
    expect(application.commandeEstAutorisee(suite)).toBe(true);
    expect(() => application.envoyerCommande(suite)).not.toThrow();
  });

  it("refuse les commandes mécaniques locales tant que le droit manque", () => {
    let premium = false;
    const application = creerApplicationCampagne("CENDRE-01", {
      politiqueDAcces: creerPolitiqueDAccesPremium(() => premium),
    });
    const echange = {
      type: "haut-puits.marche.echanger" as const,
      offreId: "eau-contre-materiaux" as const,
    };

    expect(application.commandeEstAutorisee(echange)).toBe(false);
    premium = true;
    expect(application.commandeEstAutorisee(echange)).toBe(true);
  });
});
