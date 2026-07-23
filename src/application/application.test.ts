import { describe, expect, it } from "vitest";

import {
  ACCES_AU_CONTENU_COMPLET,
  ErreurDeCommandeRefusee,
  creerApplicationCampagne,
  projeterCampagne,
  reprendreApplicationCampagne,
} from "./application";

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
      nombreDePlateformes: 5,
      evenementNarratif: null,
    });
  });

  it("projette le même Événement narratif en français et en anglais", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });

    const projectionFrancaise = projeterCampagne(
      application.lireEtat(),
      "fr",
    );
    const projectionAnglaise = projeterCampagne(
      application.lireEtat(),
      "en",
    );

    expect(projectionFrancaise.evenementNarratif).toEqual({
      id: "prologue.signaux-sous-la-cendre",
      origine: "Phare",
      libelleIntentions: "Intentions",
      titre: "Des signaux sous la cendre",
      presentation:
        "Depuis le Phare, un signalement indique une cohorte à pied derrière la formation. Vos 184 Habitants peuvent lui faire une place, mais le convoi devra partager ses volumes étanches.",
      variante: "Leurs lampes répondent une à une au signal du Phare.",
      informations: [
        "Le rapport confirme six silhouettes et aucun véhicule à proximité.",
      ],
      asset: {
        fichier: "/assets/cite-caravane.png",
        alternative:
          "Coupe habitée de la Cité-caravane, le Phare entouré de ses Plateformes en formation en grappe.",
      },
      choix: [
        {
          id: "accueillir",
          intention: "Ouvrir les Foyers",
          coutsConnus: ["Coût connu : 6 places occupées dans les Foyers."],
        },
        {
          id: "orienter",
          intention: "Transmettre la route de Veille-Basse",
          coutsConnus: [
            "Coût connu : la cohorte poursuit seule, hors du Halo de veille.",
          ],
        },
      ],
    });
    expect(projectionAnglaise.evenementNarratif).toMatchObject({
      origine: "Lighthouse",
      libelleIntentions: "Intentions",
      titre: "Signals beneath the ash",
      presentation: expect.stringContaining("184 inhabitants"),
      choix: [
        {
          id: "accueillir",
          intention: "Open the living quarters",
          coutsConnus: [
            "Known cost: 6 places occupied in the living quarters.",
          ],
        },
        {
          id: "orienter",
          intention: "Transmit the route to Veille-Basse",
          coutsConnus: [
            "Known cost: the cohort continues alone, outside the watch halo.",
          ],
        },
      ],
    });
  });

  it("notifie les commandes sémantiques sans posséder leur journal de sauvegarde", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    const commandesObservees: unknown[] = [];
    const seDesabonner = application.sabonnerAuxCommandes(
      (commande, etat) => commandesObservees.push({ commande, etat }),
    );

    application.envoyerCommande({
      type: "temps-du-convoi.regler-vitesse",
      vitesse: 4,
    });
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 15,
    });
    seDesabonner();

    expect(commandesObservees).toEqual([
      {
        commande: {
          type: "temps-du-convoi.regler-vitesse",
          vitesse: 4,
        },
        etat: expect.objectContaining({
          tempsDuConvoi: { secondes: 0, vitesse: 4 },
        }),
      },
      {
        commande: {
          type: "temps-du-convoi.ecouler",
          secondesReelles: 15,
        },
        etat: expect.objectContaining({
          tempsDuConvoi: { secondes: 60, vitesse: 4 },
        }),
      },
    ]);

    const applicationReprise = reprendreApplicationCampagne(
      application.lireEtat(),
    );
    expect(applicationReprise.lireEtat()).toEqual(application.lireEtat());
    expect(projeterCampagne(applicationReprise.lireEtat())).toEqual(
      projeterCampagne(application.lireEtat()),
    );
  });

  it("porte la limite de la Démonstration dans une politique d’accès remplaçable", () => {
    const application = creerApplicationCampagne("CENDRE-01");
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

    const deuxiemeTroncon = {
      type: "engagement-de-route.confirmer" as const,
      tronconId: "chenal-des-vannes" as const,
    };
    expect(application.commandeEstAutorisee(deuxiemeTroncon)).toBe(false);
    expect(() => application.envoyerCommande(deuxiemeTroncon)).toThrow(
      ErreurDeCommandeRefusee,
    );
    try {
      application.envoyerCommande(deuxiemeTroncon);
    } catch (erreur) {
      expect(erreur).toMatchObject({
        refus: { code: "acces-premium-requis" },
      });
    }

    const applicationComplete = reprendreApplicationCampagne(
      application.lireEtat(),
      { politiqueDAcces: ACCES_AU_CONTENU_COMPLET },
    );
    expect(applicationComplete.commandeEstAutorisee(deuxiemeTroncon)).toBe(
      true,
    );
    expect(() => applicationComplete.envoyerCommande(deuxiemeTroncon)).not
      .toThrow();
  });

  it("restitue dans le conflit régional le choix persistant du prologue", () => {
    const application = creerApplicationCampagne("CENDRE-01");
    application.envoyerCommande({
      type: "temps-du-convoi.ecouler",
      secondesReelles: 60,
    });
    for (const [evenementId, choixId] of [
      ["prologue.signaux-sous-la-cendre", "orienter"],
      ["prologue.reponse-du-phare", "consigner-harmonique"],
      ["prologue.filtres-de-la-veille", "proteger-foyers"],
      ["prologue.ilyana-au-clapet", "confier-clapet"],
    ] as const) {
      application.envoyerCommande({
        type: "evenement-narratif.choisir",
        evenementId,
        choixId,
      });
      if (evenementId !== "prologue.ilyana-au-clapet") {
        application.envoyerCommande({
          type: "temps-du-convoi.ecouler",
          secondesReelles: 1,
        });
      }
    }
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

    expect(projeterCampagne(application.lireEtat(), "fr").evenementNarratif)
      .toMatchObject({
        id: "bassins-fendus.eau-de-haut-puits",
        variante:
          "La cohorte orientée vers Veille-Basse a fait porter sa demande : la promesse donnée sur la route atteint désormais la citerne.",
      });
  });
});
