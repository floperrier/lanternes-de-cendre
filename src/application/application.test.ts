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
});
